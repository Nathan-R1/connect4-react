# Connect Four (React + TypeScript)

A browser-based Connect Four game ported from the Java Swing version by Nathan Rais. Fully client-side — no backend, no database.

<div align="center">
  <img src="https://raw.githubusercontent.com/Nathan-R1/connect4-react/master/public/resource.jpg" alt="Connect 4 Game" width="300">
</div>

## Quick Start

```bash
npm install
npm run build
cd dist && python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000` in your browser.

## Development

```bash
npm run dev
```

Starts a dev server on port 3000 with live reload.

## Tests

```bash
npm test
```

30 unit tests covering board logic, win detection, AI (3 difficulties), and game state.

## Game Modes

- **PvP** — two players on the same device
- **PvE** — play against the AI (Easy / Medium / Hard)
- **AI vs AI** — watch two AIs play each other

## AI Difficulty

- **Easy** — plays randomly with occasional good moves
- **Medium** — blocks opponent wins and takes winning moves
- **Hard** — full logic including double-move detection and hazard checking

## Build

```bash
npm run build
```

Output goes to `dist/`. Open `dist/index.html` via any HTTP server (localStorage won't work with `file://`).

## Ported From

Original Java version by [Nathan Rais](https://nathansoftware.com/wordpress/connect-four/).
