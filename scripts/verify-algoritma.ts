import { spawn } from "node:child_process";
import { ALGORITMA } from "../prisma/content/algoritma";

// Verifikasi mesin: jalankan solusi referensi python terhadap semua TestCase
// sebelum konten boleh di-seed. Keluar (exit 1) jika ada satu saja yang gagal.

function runPython(code: string, stdin: string, file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("python", ["-c", code], { windowsHide: true });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${file}: timeout`));
    }, 30_000);
    child.stdout?.on("data", (d: Buffer) => (out += d.toString()));
    child.stderr?.on("data", (d: Buffer) => (err += d.toString()));
    child.on("close", (codeExit) => {
      clearTimeout(timer);
      if (codeExit !== 0) reject(new Error(`${file}: exit ${codeExit}\n${err.slice(0, 500)}`));
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

async function main() {
  let gagal = 0;
  let total = 0;
  for (const p of ALGORITMA) {
    for (const [i, t] of p.tests.entries()) {
      total++;
      try {
        const out = normalize(await runPython(p.refSolution, t.stdin, p.slug));
        const harus = normalize(t.expectedOutput);
        if (out !== harus) {
          gagal++;
          console.log(`FAIL ${p.slug} test ${i + 1}: dapat "${out}" , harusnya "${harus}"`);
        }
      } catch (e) {
        gagal++;
        console.log(`ERROR ${p.slug} test ${i + 1}: ${String(e).slice(0, 300)}`);
      }
    }
  }
  console.log(`${ALGORITMA.length} soal, ${total} test, gagal: ${gagal}`);
  if (gagal > 0) process.exit(1);
  console.log("SEMUA VERIFIKASI LULUS");
}

main();
