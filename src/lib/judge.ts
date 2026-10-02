import type { TestCase } from "@content/types";
import { runCode } from "./runner";
import type { LangId } from "./languages";

type RunOutcome = Awaited<ReturnType<typeof runCode>>;

// Piston menerima beberapa job sekaligus, jadi test case dieksekusi paralel.
// Runner lokal mem-spawn compiler per test case; paralel di sana akan membanjiri
// mesin dev, jadi tanpa PISTON_URL tetap berurutan.
const PARALLEL_LIMIT = 4;

async function runAllTests(tests: TestCase[], lang: LangId, code: string): Promise<RunOutcome[]> {
  if (!process.env.PISTON_URL || tests.length <= 1) {
    const hasil: RunOutcome[] = [];
    for (const t of tests) {
      const r = await runCode(lang, code, t.stdin);
      hasil.push(r);
      if (!r.ok && !r.stdout && r.stderr) break;
    }
    return hasil;
  }
  const hasil = new Array<RunOutcome>(tests.length);
  let next = 0;
  async function pekerja() {
    while (next < tests.length) {
      const i = next++;
      hasil[i] = await runCode(lang, code, tests[i].stdin);
    }
  }
  await Promise.all(Array.from({ length: Math.min(PARALLEL_LIMIT, tests.length) }, pekerja));
  return hasil;
}

export type CaseResult = {
  hidden: boolean;
  passed: boolean;
  stdin?: string;
  expected?: string;
  actual?: string;
};

export type JudgeOutcome = {
  allPassed: boolean;
  compileFailed: boolean;
  stderr: string;
  results: CaseResult[];
  backend: "http" | "local" | null;
};

function normalize(s: string) {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

export async function judgeCode(lang: LangId, code: string, tests: TestCase[]): Promise<JudgeOutcome> {
  const runs = await runAllTests(tests, lang, code);
  const failIdx = runs.findIndex((r) => !r.ok && !r.stdout && r.stderr);

  const results: CaseResult[] = [];
  let compileFailed = false;
  let stderr = "";
  let backend: "http" | "local" | null = null;

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const r = runs[i];
    if (r) backend = r.backend;
    if (i === failIdx) {
      // kemungkinan besar gagal compile: case ini dan semua setelahnya gagal
      compileFailed = true;
      stderr = (r.stderr ?? "").slice(0, 4000);
    }
    if (compileFailed) {
      results.push({
        hidden: t.hidden ?? false,
        passed: false,
        stdin: t.hidden ? undefined : t.stdin,
        ...(i === failIdx ? { actual: "(tidak berjalan)" } : {}),
      });
      continue;
    }
    const passed = normalize(r.stdout) === normalize(t.expectedOutput);
    results.push({
      hidden: t.hidden ?? false,
      passed,
      stdin: t.hidden ? undefined : t.stdin,
      expected: t.hidden ? undefined : t.expectedOutput,
      actual: normalize(r.stdout).slice(0, 2000),
    });
  }

  return { allPassed: !compileFailed && results.every((r) => r.passed), compileFailed, stderr, results, backend };
}
