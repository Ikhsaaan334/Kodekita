import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LANGUAGES, type LangId } from "../languages";

export type RunResult = {
  ok: boolean; // false = gagal compile / crash / timeout
  stdout: string;
  stderr: string;
  timedOut?: boolean;
};

const MAX_OUTPUT = 64 * 1024;
const COMPILE_TIMEOUT = 60_000;
// go run menyertakan kompilasi; build cache dingin bisa >10 detik
const RUN_TIMEOUT = 30_000;

function exec(cmd: string[], cwd: string, stdin: string, timeoutMs: number): Promise<RunResult> {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd[0], cmd.slice(1), { cwd, windowsHide: true });
    } catch {
      resolve({ ok: false, stdout: "", stderr: "perintah tidak dapat dijalankan" });
      return;
    }
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);
    child.stdout?.on("data", (d: Buffer) => {
      if (stdout.length < MAX_OUTPUT) stdout += d.toString();
    });
    child.stderr?.on("data", (d: Buffer) => {
      if (stderr.length < MAX_OUTPUT) stderr += d.toString();
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: code === 0 && !timedOut, stdout, stderr, timedOut });
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, stdout: "", stderr: String(err) });
    });
    child.stdin?.write(stdin);
    child.stdin?.end();
  });
}

// csc.exe dari .NET Framework tersedia di semua Windows modern; C# 5 saja, cukup untuk latihan dasar.
const CSC_CANDIDATES = [
  "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe",
  "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe",
];

function cscPath(): string | null {
  for (const p of CSC_CANDIDATES) if (existsSync(p)) return p;
  return null;
}

const exeCache = new Map<string, Promise<string | null>>();

// MinGW-w64 yang dipasang via winget (WinLibs) tidak selalu masuk PATH proses
// yang sudah berjalan; cari langsung di folder paketnya.
let mingwBinCache: string | null | undefined;
function mingwBinDir(): string | null {
  if (mingwBinCache !== undefined) return mingwBinCache;
  mingwBinCache = null;
  try {
    const base = join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Packages");
    if (existsSync(base)) {
      for (const entry of readdirSync(base)) {
        if (!entry.startsWith("BrechtSanders.WinLibs")) continue;
        const bin = join(base, entry, "mingw64", "bin");
        if (existsSync(join(bin, "gcc.exe"))) {
          mingwBinCache = bin;
          break;
        }
      }
    }
  } catch {
    // LOCALAPPDATA tidak ada atau tidak bisa dibaca: anggap tidak terpasang
  }
  return mingwBinCache;
}

const MINGW_TOOLS = new Set(["gcc", "g++", "cc", "c++", "gdb", "make"]);

/**
 * Resolve nama executable ke path nyata via `where`. Diperlukan karena toolchain
 * Windows kadang cuma tersedia sebagai .bat (mis. php dari Herd), yang tidak bisa
 * di-spawn Node langsung dan harus dibungkus cmd /c.
 */
function resolveExecutable(name: string): Promise<string | null> {
  let cached = exeCache.get(name);
  if (!cached) {
    cached = new Promise((resolve) => {
      const child = spawn("where", [name], { windowsHide: true });
      let out = "";
      child.stdout?.on("data", (d: Buffer) => (out += d.toString()));
      child.on("close", (code) => {
        if (code !== 0) {
          if (MINGW_TOOLS.has(name)) {
            const bin = mingwBinDir();
            const exe = bin ? join(bin, `${name}.exe`) : null;
            return resolve(exe && existsSync(exe) ? exe : null);
          }
          return resolve(null);
        }
        const first = out.split(/\r?\n/).find((l) => l.trim())?.trim();
        resolve(first ?? null);
      });
      child.on("error", () => {
        if (MINGW_TOOLS.has(name)) {
          const bin = mingwBinDir();
          const exe = bin ? join(bin, `${name}.exe`) : null;
          return resolve(exe && existsSync(exe) ? exe : null);
        }
        resolve(null);
      });
    });
    exeCache.set(name, cached);
  }
  return cached;
}

async function buildCommand(cmd: string[]): Promise<string[] | null> {
  // path hasil kompilasi bersifat literal, bukan nama yang perlu dicari di PATH
  if (cmd[0].startsWith("./")) return cmd;
  if (cmd[0] === "CSC_PATH") {
    const csc = cscPath();
    return csc ? [csc, ...cmd.slice(1)] : null;
  }
  if (cmd[0] === "csc-detect") {
    // penanda deteksi saja, tidak pernah dieksekusi
    return cscPath() ? ["csc-detect"] : null;
  }
  const resolved = await resolveExecutable(cmd[0]);
  if (!resolved) return null;
  // stub Microsoft Store (python.exe di WindowsApps) bukan Python sungguhan
  if (/WindowsApps/i.test(resolved)) return null;
  if (/\.bat$/i.test(resolved) || /\.cmd$/i.test(resolved)) {
    return ["cmd.exe", "/c", resolved, ...cmd.slice(1)];
  }
  return [resolved, ...cmd.slice(1)];
}

const detectionCache = new Map<LangId, Promise<boolean>>();

export function detectLocal(lang: LangId): Promise<boolean> {
  let cached = detectionCache.get(lang);
  if (!cached) {
    cached = (async () => {
      const spec = LANGUAGES[lang].local;
      const cmd = await buildCommand(spec.detect);
      return cmd !== null;
    })();
    detectionCache.set(lang, cached);
  }
  return cached;
}

/** Jalankan kode di toolchain lokal. Hanya untuk dev; produksi wajib judge terisolasi. */
export async function runLocal(lang: LangId, code: string, stdin: string): Promise<RunResult> {
  const spec = LANGUAGES[lang].local;
  const detectCmd = await buildCommand(spec.detect);
  if (!detectCmd) return { ok: false, stdout: "", stderr: `toolchain ${lang} tidak tersedia` };
  const dir = await mkdtemp(join(tmpdir(), "kk-run-"));
  try {
    await writeFile(join(dir, spec.sourceFile), code, "utf8");
    if (spec.compile) {
      const compileCmd = await buildCommand(spec.compile);
      if (!compileCmd) return { ok: false, stdout: "", stderr: `toolchain ${lang} tidak tersedia` };
      const compiled = await exec(compileCmd, dir, "", COMPILE_TIMEOUT);
      if (!compiled.ok) {
        return { ok: false, stdout: "", stderr: compiled.stderr || "gagal kompilasi" };
      }
    }
    const runCmd = await buildCommand(spec.run);
    if (!runCmd) return { ok: false, stdout: "", stderr: `toolchain ${lang} tidak tersedia` };
    const withAbsExe = runCmd.map((a) => (a === "./program.exe" ? join(dir, "program.exe") : a));
    return await exec(withAbsExe, dir, stdin, RUN_TIMEOUT);
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
