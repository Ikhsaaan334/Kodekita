import type { TestCase } from "@content/types";
import { runCode } from "./runner";
import type { LangId } from "./languages";

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
  const results: CaseResult[] = [];
  let compileFailed = false;
  let stderr = "";
  let backend: "http" | "local" | null = null;

  for (const t of tests) {
    const r = await runCode(lang, code, t.stdin);
    backend = r.backend;
    if (!r.ok && !r.stdout && r.stderr) {
      // kemungkinan besar gagal compile: berhenti lebih awal, semua case gagal
      compileFailed = true;
      stderr = r.stderr.slice(0, 4000);
      results.push({
        hidden: t.hidden ?? false,
        passed: false,
        stdin: t.hidden ? undefined : t.stdin,
        actual: "(tidak berjalan)",
      });
      break;
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

  // bila compile gagal di tengah, tandai sisa case sebagai gagal tanpa dieksekusi
  if (compileFailed) {
    for (const t of tests.slice(results.length)) {
      results.push({ hidden: t.hidden ?? false, passed: false, stdin: t.hidden ? undefined : t.stdin });
    }
  }

  return { allPassed: !compileFailed && results.every((r) => r.passed), compileFailed, stderr, results, backend };
}
