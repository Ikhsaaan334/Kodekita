import { LANG_IDS, LANGUAGES, type LangId } from "../languages";
import { runLocal } from "./local";
import { pistonRun } from "./http";
import type { RunResult } from "./local";

export type { RunResult };

export type BackendInfo = { available: boolean; backend: "http" | "local" | null; hint?: string };

// local runner hanya untuk dev. Di produksi kode user wajib lewat judge
// terisolasi (Piston) karena toolchain host tidak punya sandbox.
function localAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_LOCAL_RUNNER === "true";
}

const PISTON_HINT = "Mode produksi: kode dieksekusi via judge eksternal. Atur PISTON_URL ke instance Piston (lihat DEPLOY.md).";

/**
 * Urutan backend: instance Piston via env PISTON_URL (untuk produksi/self-host),
 lalu toolchain lokal (dev). Keduanya gagal = runtime tidak tersedia, dan UI
 menampilkan pesan jujur beserta cara mengaktifkannya.
 */
export async function runCode(lang: LangId, code: string, stdin: string): Promise<RunResult & { backend: "http" | "local" | null }> {
  const viaHttp = await pistonRun(lang, code, stdin);
  if (viaHttp) return { ...viaHttp, backend: "http" };
  if (!localAllowed()) {
    return {
      ok: false,
      stdout: "",
      stderr: PISTON_HINT,
      backend: null,
      timedOut: false,
    };
  }
  const viaLocal = await runLocal(lang, code, stdin);
  return { ...viaLocal, backend: "local" };
}

export async function checkBackend(lang: LangId): Promise<BackendInfo> {
  if (process.env.PISTON_URL) {
    const probe = await pistonRun(lang, probeSource(lang), "");
    if (probe && probe.ok) return { available: true, backend: "http" };
    if (probe && !probe.ok && !probe.stderr) return { available: true, backend: "http" };
  }
  if (!localAllowed()) {
    return { available: false, backend: null, hint: PISTON_HINT };
  }
  const { detectLocal } = await import("./local");
  const ok = await detectLocal(lang);
  return ok
    ? { available: true, backend: "local" }
    : { available: false, backend: null, hint: LANGUAGES[lang].local.missingHint };
}

function probeSource(lang: LangId): string {
  switch (lang) {
    case "python":
      return "pass";
    case "go":
      return "package main\nfunc main() {}";
    case "c":
      return "int main(void){return 0;}";
    case "cpp":
      return "int main(){return 0;}";
    case "java":
      return "public class Main{}";
    case "php":
      return "<?php ";
    case "csharp":
      return "class P{static void Main(){}}";
  }
}

let availCache: { at: number; map: Record<LangId, BackendInfo> } | null = null;
const AVAIL_TTL = 60_000;

export async function availabilityMap(): Promise<Record<LangId, BackendInfo>> {
  if (availCache && Date.now() - availCache.at < AVAIL_TTL) return availCache.map;
  const entries = await Promise.all(
    LANG_IDS.map(async (id) => [id, await checkBackend(id)] as const)
  );
  const map = Object.fromEntries(entries) as Record<LangId, BackendInfo>;
  availCache = { at: Date.now(), map };
  return map;
}
