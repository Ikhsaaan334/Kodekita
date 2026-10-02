import { LANGUAGES, type LangId } from "../languages";
import type { RunResult } from "./local";

/**
 * Runner HTTP yang kompatibel Piston (mis. instance self-host docker, atau
 * instance emkc yang sudah dapat whitelist). Aktif bila env PISTON_URL diisi.
 */

const versionCache = new Map<string, string | null>();

async function resolveVersion(base: string, pistonId: string): Promise<string | null> {
  let cached = versionCache.get(base + pistonId);
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(`${base}/runtimes`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(String(res.status));
    const runtimes = (await res.json()) as { language: string; aliases?: string[]; version: string }[];
    const hit = runtimes.find(
      (r) => r.language === pistonId || (r.aliases ?? []).includes(pistonId)
    );
    cached = hit ? hit.version : null;
  } catch {
    cached = null;
  }
  versionCache.set(base + pistonId, cached);
  return cached;
}

export async function pistonRun(lang: LangId, code: string, stdin: string): Promise<RunResult | null> {
  const base = process.env.PISTON_URL;
  if (!base) return null;
  const pistonId = LANGUAGES[lang].local.piston;
  const version = (await resolveVersion(base, pistonId)) ?? "*";
  try {
    const res = await fetch(`${base}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.PISTON_KEY ? { Authorization: process.env.PISTON_KEY } : {}),
      },
      body: JSON.stringify({
        language: pistonId,
        version,
        files: [{ content: code }],
        stdin,
        compile_timeout: 30000,
        run_timeout: 10000,
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      compile?: { stdout?: string; stderr?: string; code?: number };
      run?: { stdout?: string; stderr?: string; code?: number; signal?: string };
    };
    if (data.compile && data.compile.code !== 0) {
      return { ok: false, stdout: "", stderr: data.compile.stderr || data.compile.stdout || "gagal kompilasi" };
    }
    const run = data.run ?? {};
    const timedOut = run.signal === "SIGKILL";
    return {
      ok: run.code === 0 && !timedOut,
      stdout: run.stdout ?? "",
      stderr: run.stderr ?? "",
      timedOut,
    };
  } catch {
    return null;
  }
}
