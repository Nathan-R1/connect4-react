type TestFn = () => void | Promise<void>;

interface TestCase {
  name: string;
  fn: TestFn;
}

interface Suite {
  name: string;
  tests: TestCase[];
  beforeAll: (() => void)[];
  afterAll: (() => void)[];
  beforeEach: (() => void)[];
  afterEach: (() => void)[];
}

const suites: Suite[] = [];
let currentSuite: Suite | null = null;

export function describe(name: string, fn: () => void) {
  const suite: Suite = {
    name,
    tests: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
  };
  currentSuite = suite;
  fn();
  suites.push(suite);
  currentSuite = null;
}

export function it(name: string, fn: TestFn) {
  if (currentSuite) {
    currentSuite.tests.push({ name, fn });
  }
}

export function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: unknown) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      if (a !== e) {
        throw new Error(`Expected ${e}, got ${a}`);
      }
    },
    not: {
      toBeNull() {
        if (actual === null) {
          throw new Error(`Expected not null, got null`);
        }
      },
    },
    toHaveLength(len: number) {
      if (!Array.isArray(actual)) {
        throw new Error(`Expected array, got ${typeof actual}`);
      }
      if (actual.length !== len) {
        throw new Error(`Expected length ${len}, got ${actual.length}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThanOrEqual(n: number) {
      if (typeof actual !== 'number' || actual < n) {
        throw new Error(`Expected >= ${n}, got ${actual}`);
      }
    },
    toBeLessThan(n: number) {
      if (typeof actual !== 'number' || actual >= n) {
        throw new Error(`Expected < ${n}, got ${actual}`);
      }
    },
  };
}

export async function runTests() {
  let ok = 0;
  let fail = 0;

  for (const suite of suites) {
    console.log(`\n${suite.name}`);
    for (const before of suite.beforeAll) before();
    for (const test of suite.tests) {
      for (const before of suite.beforeEach) before();
      try {
        await test.fn();
        console.log(`  ✓ ${test.name}`);
        ok++;
      } catch (e: any) {
        console.log(`  ✗ ${test.name}`);
        console.log(`    ${e.message}`);
        fail++;
      }
      for (const after of suite.afterEach) after();
    }
    for (const after of suite.afterAll) after();
  }

  console.log(`\n${ok + fail} tests: ${ok} passed, ${fail} failed`);
  return { ok, fail };
}
