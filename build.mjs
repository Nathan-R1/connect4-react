import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, 'src');
const out = join(__dirname, 'dist');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');

async function build() {
  mkdirSync(out, { recursive: true });

  // Copy index.html (inject script)
  let html = readFileSync(join(__dirname, 'index.html'), 'utf-8');
  const errorHandler = '<script>window.onerror=function(m,s,l,c,e){document.getElementById("root").innerHTML="<pre style=color:red;padding:20px;white-space:pre-wrap>"+m+"\\n"+(e&&e.stack||"")+"</pre>"}</script>';
  html = html.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    errorHandler + '<script src="/main.js"></script>'
  );
  html = html.replace('</head>', '<link rel="stylesheet" href="/main.css"></head>');

  const ctx = await esbuild.context({
    entryPoints: [join(src, 'main.tsx')],
    outfile: join(out, 'main.js'),
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    jsx: 'automatic',
    jsxImportSource: 'react',
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    },
    loader: {
      '.tsx': 'tsx',
      '.ts': 'tsx',
      '.js': 'js',
      '.css': 'css',
      '.svg': 'dataurl',
      '.png': 'dataurl',
    },
    plugins: [],
  });

  if (isDev) {
    const { host, port } = await ctx.serve({
      servedir: out,
      port: 3000,
    });
    // Write index.html to dist
    writeFileSync(join(out, 'index.html'), html);
    console.log(`Dev server at http://${host}:${port}`);
  } else {
    await ctx.rebuild();
    writeFileSync(join(out, 'index.html'), html);
    ctx.dispose();
    console.log('Build complete: dist/');
  }
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
