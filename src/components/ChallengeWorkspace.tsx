"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, SpinnerGap, Trophy } from "@phosphor-icons/react";
import { CodeEditor } from "./CodeEditor";
import { TestResults } from "./LessonStepPlayer";
import { XpBurst } from "./motion-bits";
import { RunOutput } from "./RunOutput";
import { LANGUAGES, type LangId } from "@/lib/languages";
import type { JudgeOutcomeDto } from "@/lib/client-types";
import type { TestCase } from "@content/types";

export function ChallengeWorkspace({
  slug,
  starters,
  availableLangs,
  totalTests,
  hints,
  solved,
  backHref,
  trackName,
}: {
  slug: string;
  /** lang -> starter code; satu entri = tantangan per-track, banyak entri = lintas-bahasa */
  starters: Record<string, string>;
  availableLangs: LangId[];
  totalTests: number;
  hints: string[];
  solved: boolean;
  backHref: string;
  trackName?: string;
}) {
  const langKeys = Object.keys(starters);
  const lintasBahasa = langKeys.length > 1;
  const [lang, setLang] = useState<string>(
    () => langKeys.find((k) => availableLangs.includes(k as LangId)) ?? langKeys[0]
  );
  const [codes, setCodes] = useState<Record<string, string>>(() => ({ ...starters }));
  const [manualStdin, setManualStdin] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [runState, setRunState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [runResult, setRunResult] = useState<{ stdout: string; stderr: string; timedOut?: boolean } | null>(null);
  const [outcome, setOutcome] = useState<JudgeOutcomeDto | null>(null);
  const [lulus, setLulus] = useState(solved);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const code = codes[lang] ?? "";
  const langTersedia = availableLangs.includes(lang as LangId);

  function setCode(v: string) {
    setCodes((c) => ({ ...c, [lang]: v }));
  }

  function gantiBahasa(k: string) {
    setLang(k);
    setOutcome(null);
    setRunState("idle");
    setRunResult(null);
  }

  async function jalankan() {
    setBusy(true);
    setRunState("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, code, stdin: manualStdin }),
      });
      if (res.status === 401) {
        setRunState("error");
        setRunResult(null);
        setErrorMsg("Sesi habis. Masuk lagi untuk menjalankan kode.");
        return;
      }
      const data = await res.json();
      setRunResult(data);
      setRunState(data.ok ? "done" : "error");
    } catch {
      setRunState("error");
      setRunResult(null);
      setErrorMsg("Tidak bisa menghubungi server eksekusi.");
    } finally {
      setBusy(false);
    }
  }

  async function ujiSemua() {
    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "challenge", refId: slug, code, language: lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Gagal menguji. Coba lagi.");
        return;
      }
      const data = (await res.json()) as { outcome: JudgeOutcomeDto; xpGained: number };
      setOutcome(data.outcome);
      if (data.outcome.allPassed && !lulus) {
        setLulus(true);
        setXpGained(data.xpGained || null);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {lintasBahasa && (
        <div>
          <p className="mb-2 font-code text-xs uppercase tracking-wide text-gading-500">Bahasa pengerjaan</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih bahasa pengerjaan">
            {langKeys.map((k) => {
              const ada = availableLangs.includes(k as LangId);
              return (
                <button
                  key={k}
                  onClick={() => gantiBahasa(k)}
                  disabled={!ada}
                  aria-pressed={lang === k}
                  title={ada ? undefined : `Runtime ${LANGUAGES[k as LangId]?.label ?? k} belum tersedia di server ini`}
                  className={`min-h-[44px] rounded-full border px-4 font-code text-sm font-semibold transition-colors ${
                    lang === k
                      ? "border-emas-500 bg-emas-500/15 text-emas-300"
                      : ada
                        ? "border-ink-600 text-gading-300 hover:border-ink-500"
                        : "cursor-not-allowed border-ink-700 text-gading-500/50 line-through"
                  }`}
                >
                  {LANGUAGES[k as LangId]?.label ?? k}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gading-500">Kode tiap bahasa tersimpan terpisah, aman untuk pindah-pindah.</p>
        </div>
      )}
      {!lintasBahasa && (
        <p className="font-code text-xs uppercase tracking-wide text-gading-500">
          Bahasa: {trackName ?? LANGUAGES[lang as LangId]?.label ?? lang}
        </p>
      )}

      <CodeEditor
        value={code}
        onChange={setCode}
        language={(lang as LangId) ?? "python"}
        minHeight="320px"
        maxHeight="600px"
        ariaLabel={`Editor solusi ${slug}`}
      />
      <div>
        <label htmlFor="stdin" className="mb-1 block font-code text-xs uppercase tracking-wide text-gading-500">
          Input (stdin) untuk coba jalankan manual
        </label>
        <textarea
          id="stdin"
          value={manualStdin}
          onChange={(e) => setManualStdin(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-ink-600 bg-ink-950 p-3 font-code text-sm text-gading-50 placeholder:text-gading-500"
          placeholder="Tempel input uji di sini sesuai format soal"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={ujiSemua}
          disabled={busy || !langTersedia}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {busy ? <SpinnerGap size={18} className="animate-spin" aria-hidden /> : <Trophy size={18} aria-hidden />}
          Uji Semua ({totalTests} test)
        </button>
        <button
          onClick={jalankan}
          disabled={busy || !langTersedia}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-500 px-5 font-semibold text-gading-50 transition-colors hover:bg-ink-800 disabled:opacity-50"
        >
          Jalankan Manual
        </button>
        <button
          onClick={() => setHintsShown((h) => Math.min(h + 1, hints.length))}
          disabled={hintsShown >= hints.length}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-emas-600/40 px-4 text-sm font-semibold text-emas-400 transition-colors hover:bg-ink-800 disabled:opacity-40"
        >
          <Lightbulb size={18} aria-hidden />
          {hintsShown === 0 ? "Saya bingung" : `Hint berikutnya (${hintsShown}/${hints.length})`}
        </button>
      </div>
      {!langTersedia && (
        <p className="rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm" role="alert">
          Runtime {LANGUAGES[lang as LangId]?.label ?? lang} belum tersedia di server ini, jadi uji dinonaktifkan.
          Pilih bahasa lain atau aktifkan toolchainnya (lihat README).
        </p>
      )}
      <AnimatePresence>
        {hintsShown > 0 && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            {hints.slice(0, hintsShown).map((h, i) => (
              <li key={i} className="rounded-xl border border-emas-600/30 bg-emas-500/5 p-3 text-sm text-gading-300">
                <span className="mr-1 font-semibold text-emas-400">Hint {i + 1}:</span>
                {h}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {errorMsg && (
        <p className="rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm" role="alert">
          {errorMsg}
        </p>
      )}
      {runState !== "idle" && (
        <RunOutput state={runState} stdout={runResult?.stdout} stderr={runResult?.stderr} timedOut={runResult?.timedOut} />
      )}
      {outcome && <TestResults outcome={outcome} />}
      {lulus && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-lulus/40 bg-lulus/10 p-6 text-center">
          {xpGained ? <XpBurst xp={xpGained} /> : null}
          <p className="mt-2 flex items-center justify-center gap-2 font-semibold text-lulus">
            <Trophy size={18} aria-hidden />
            {xpGained ? "Tantangan pertama kali lulus." : "Tantangan sudah pernah kamu lulus."}
          </p>
          <Link
            href={backHref}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
          >
            Cari tantangan berikutnya
            <ArrowRight size={18} aria-hidden />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
