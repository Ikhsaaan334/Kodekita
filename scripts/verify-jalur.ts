import { spawn } from "node:child_process";
import { JALUR } from "../prisma/content/jalur";
import { runLocal } from "../src/lib/runner/local";
import type { LangId } from "../src/lib/languages";
import type { CodeStep, Step, TestCase } from "../prisma/content/types";

// Verifikasi jalur mendalam: setiap solusi step code diuji terhadap test-nya
// sendiri untuk runtime yang tersedia di mesin ini. c/cpp tanpa compiler
// dilewati dengan catatan (sudah diverifikasi saat penulisan).

function runPython(code: string, stdin: string, label: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("python", ["-c", code], { windowsHide: true });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${label}: timeout`));
    }, 30_000);
    child.stdout?.on("data", (d: Buffer) => (out += d.toString()));
    child.stderr?.on("data", (d: Buffer) => (err += d.toString()));
    child.on("close", (codeExit) => {
      clearTimeout(timer);
      if (codeExit !== 0) reject(new Error(`${label}: exit ${codeExit}\n${err.slice(0, 300)}`));
      else resolve(out);
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.stdin?.write(stdin);
    child.stdin?.end();
  });
}

function normalize(s: string) {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

const BISA_JALAN: Record<string, boolean> = {
  python: true,
  go: true,
  java: true,
  php: true,
  csharp: true,
  c: true,
  cpp: true,
};

async function main() {
  const target = process.argv[2]; // opsional: filter bahasa, mis. `npx tsx scripts/verify-jalur.ts go`
  const masalah: string[] = [];
  let dicek = 0;
  let dilewati = 0;

  for (const [lang, bagians] of Object.entries(JALUR)) {
    if (target && lang !== target) continue;
    for (const bagian of bagians) {
      for (const lesson of bagian.lessons) {
        for (const [si, step] of lesson.steps.entries()) {
          if (step.kind !== "code") continue;
          const cs = step as CodeStep;
          if (!BISA_JALAN[lang]) {
            dilewati++;
            continue;
          }
          for (const [ti, t] of (cs.tests as TestCase[]).entries()) {
            dicek++;
            try {
              let out: string;
              if (lang === "python") {
                out = await runPython(cs.solution, t.stdin, `${lang}/${lesson.slug}#${si}.${ti}`);
              } else {
                const r = await runLocal(lang as LangId, cs.solution, t.stdin);
                if (!r.ok && !r.stdout) throw new Error(r.stderr.slice(0, 250));
                out = r.stdout;
              }
              if (normalize(out) !== normalize(t.expectedOutput)) {
                masalah.push(
                  `${lang}/${lesson.slug} step ${si} test ${ti + 1} GAGAL: dapat "${normalize(out).slice(0, 100)}" , harusnya "${normalize(t.expectedOutput).slice(0, 100)}"`
                );
              }
            } catch (e) {
              masalah.push(`${lang}/${lesson.slug} step ${si} test ${ti + 1} ERROR: ${String(e).slice(0, 220)}`);
            }
          }
        }
      }
    }
  }

  console.log(`\ndicek: ${dicek} test, dilewati (tanpa runtime): ${dilewati}, masalah: ${masalah.length}`);
  if (masalah.length) {
    for (const m of masalah.slice(0, 80)) console.log(m);
    if (masalah.length > 80) console.log(`... dan ${masalah.length - 80} lainnya`);
    process.exit(1);
  }
  console.log("VERIFIKASI JALUR LULUS");
}

main();
