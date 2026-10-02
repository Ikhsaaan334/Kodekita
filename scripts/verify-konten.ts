import { spawn } from "node:child_process";
import { ALGORITMA } from "../prisma/content/algoritma";
import { PROYEK_GLOBAL } from "../prisma/content/proyek-global";
import { gabungFondasi } from "../prisma/content/gabung";
import { ALL_TRACKS } from "../prisma/content";
import { runLocal } from "../src/lib/runner/local";
import type { TestCase } from "../prisma/content/types";

// Gerbang mutu konten: jalankan sebelum seed. Kalau ada satu saja yang gagal,
// seed jangan dilanjutkan (exit 1).

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
      if (codeExit !== 0) reject(new Error(`${label}: exit ${codeExit}\n${err.slice(0, 400)}`));
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

async function ujiSet(
  label: string,
  solution: string,
  lang: string,
  tests: TestCase[]
): Promise<string[]> {
  const gagal: string[] = [];
  for (const [i, t] of tests.entries()) {
    try {
      let out: string;
      if (lang === "python") {
        out = await runPython(solution, t.stdin, `${label} #${i + 1}`);
      } else {
        const r = await runLocal(lang as never, solution, t.stdin);
        if (!r.ok && !r.stdout) throw new Error(r.stderr.slice(0, 300));
        out = r.stdout;
      }
      if (normalize(out) !== normalize(t.expectedOutput)) {
        gagal.push(
          `${label} [${lang}] test ${i + 1} GAGAL: dapat "${normalize(out).slice(0, 120)}" , harusnya "${normalize(
            t.expectedOutput
          ).slice(0, 120)}"`
        );
      }
    } catch (e) {
      gagal.push(`${label} [${lang}] test ${i + 1} ERROR: ${String(e).slice(0, 250)}`);
    }
  }
  return gagal;
}

async function main() {
  const masalah: string[] = [];

  // 1. tantangan algoritma: solusi referensi python
  for (const p of ALGORITMA) {
    masalah.push(...(await ujiSet(`tantangan ${p.slug}`, p.refSolution, "python", p.tests)));
  }

  // 2. proyek global: solusi referensi python
  for (const p of PROYEK_GLOBAL) {
    masalah.push(...(await ujiSet(`proyek ${p.slug}`, p.refSolution, "python", p.finalTests)));
  }

  // 3. fondasi: solusi tiap bahasa terhadap test kanonik (dari python)
  const { lessons, peringatan } = gabungFondasi(ALL_TRACKS);
  for (const w of peringatan) masalah.push(`PERINGATAN ${w}`);
  const cekRuntime = ["python", "go", "c", "cpp", "java", "php", "csharp"];
  for (const [li, lesson] of lessons.entries()) {
    const step = lesson.steps.find((s) => s.kind === "code");
    if (!step || step.kind !== "code") {
      masalah.push(`lesson ${lesson.slug}: tidak ada step kode`);
      continue;
    }
    for (const [lang, v] of Object.entries(step.byLang)) {
      if (!cekRuntime.includes(lang)) {
        console.log(`SKIP ${lesson.slug} [${lang}] (tanpa runtime; sudah diverifikasi manual saat penulisan)`);
        continue;
      }
      masalah.push(...(await ujiSet(`fondasi ${lesson.slug}`, v.solution, lang, step.tests)));
    }
  }

  if (masalah.length) {
    console.log("\n=== MASALAH ===");
    for (const m of masalah) console.log(m);
    console.log(`\nTOTAL masalah: ${masalah.length}`);
    process.exit(1);
  }
  console.log(`\nVERIFIKASI KONTEN LULUS: ${ALGORITMA.length} tantangan, ${PROYEK_GLOBAL.length} proyek, ${lessons.length} lesson fondasi.`);
}

main();
