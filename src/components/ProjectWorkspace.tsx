"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Circle, Lightbulb, SpinnerGap, Trophy } from "@phosphor-icons/react";
import { CodeEditor } from "./CodeEditor";
import { Markdown } from "./Markdown";
import { TestResults } from "./LessonStepPlayer";
import { XpBurst } from "./motion-bits";
import { LANGUAGES, type LangId } from "@/lib/languages";
import type { JudgeOutcomeDto, ProjectProgressDto } from "@/lib/client-types";
import type { ProjectStepContent } from "@content/types";

export function ProjectWorkspace({
  project,
  starters,
  availableLangs,
  initialLang,
  hasFinalTests,
  initialProgress,
  backHref,
}: {
  project: { id: string; slug: string; title: string; brief: string; steps: ProjectStepContent[] };
  /** lang -> starter code (proyek lintas-bahasa) */
  starters: Record<string, string>;
  availableLangs: LangId[];
  initialLang: string;
  hasFinalTests: boolean;
  initialProgress: ProjectProgressDto;
  backHref: string;
}) {
  const langKeys = Object.keys(starters);
  const [lang, setLang] = useState<string>(
    availableLangs.includes(initialLang as LangId) ? initialLang : (availableLangs[0] ?? langKeys[0] ?? "python")
  );
  const [codes, setCodes] = useState<Record<string, string>>(() => ({ ...starters }));
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set(initialProgress.doneSteps));
  const [finalPassed, setFinalPassed] = useState(initialProgress.finalPassed);
  const [completed, setCompleted] = useState(initialProgress.completed);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<JudgeOutcomeDto | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openHint, setOpenHint] = useState<number | null>(null);

  const code = codes[lang] ?? "";
  const langTersedia = availableLangs.includes(lang as LangId);

  function setCode(v: string) {
    setCodes((c) => ({ ...c, [lang]: v }));
  }

  function gantiBahasa(k: string) {
    setLang(k);
    setOutcome(null);
  }

  async function toggle(i: number, done: boolean) {
    const next = new Set(doneSteps);
    if (done) next.add(i);
    else next.delete(i);
    setDoneSteps(next);
    const res = await fetch("/api/progress/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, stepIndex: i, done }),
    });
    if (res.ok) {
      const data = (await res.json()) as { doneSteps: number[]; completed: boolean; xpGained?: number };
      setDoneSteps(new Set(data.doneSteps));
      setCompleted(data.completed);
      if (data.xpGained) setXpGained(data.xpGained);
    }
  }

  async function ujiAkhir() {
    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "project", refId: project.slug, code, language: lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Gagal menguji. Coba lagi.");
        return;
      }
      const data = (await res.json()) as { outcome: JudgeOutcomeDto; progress: ProjectProgressDto | null };
      setOutcome(data.outcome);
      if (data.outcome.allPassed && data.progress) {
        setFinalPassed(true);
        setCompleted(data.progress.completed);
        if (data.progress.xpGained) setXpGained(data.progress.xpGained);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section aria-label="Checklist langkah proyek" className="rounded-2xl border border-ink-600 bg-ink-800/40 p-5">
        <h2 className="mb-4 text-lg font-bold">Langkah pengerjaan</h2>
        <ul className="space-y-3">
          {project.steps.map((s, i) => {
            const done = doneSteps.has(i);
            return (
              <li key={i} className={`rounded-xl border p-4 transition-colors ${done ? "border-lulus/40 bg-lulus/5" : "border-ink-600 bg-ink-800/50"}`}>
                <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={(e) => toggle(i, e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#4ade80]"
                    aria-label={`Tandai langkah ${i + 1}: ${s.title}`}
                  />
                  <span>
                    <span className={`font-semibold ${done ? "text-lulus line-through" : "text-gading-50"}`}>
                      {i + 1}. {s.title}
                    </span>
                    <span className="mt-1 block text-sm text-gading-300">{s.detail}</span>
                  </span>
                </label>
                {s.hint && (
                  <div className="mt-2 pl-9">
                    <button
                      onClick={() => setOpenHint(openHint === i ? null : i)}
                      className="inline-flex min-h-[36px] items-center gap-1.5 text-sm font-semibold text-emas-400 transition-colors hover:text-emas-300"
                      aria-expanded={openHint === i}
                    >
                      <Lightbulb size={15} aria-hidden />
                      {openHint === i ? "Sembunyikan hint" : "Butuh hint?"}
                    </button>
                    {openHint === i && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 rounded-lg border border-emas-600/30 bg-emas-500/5 p-3 text-sm text-gading-300">
                        {s.hint}
                      </motion.p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 font-code text-xs text-gading-500">
          {doneSteps.size}/{project.steps.length} langkah selesai
          {hasFinalTests && !finalPassed && " , lalu lolos ujian akhir di bawah untuk menuntaskan proyek"}
        </p>
      </section>

      {hasFinalTests && (
        <section aria-label="Ujian akhir proyek">
          <h2 className="mb-2 text-lg font-bold">Ujian akhir: kumpulkan kodemu</h2>
          <p className="mb-3 text-sm text-gading-300">
            Tulis program lengkap sesuai spesifikasi di brief. Judge menguji dengan kasus tersembunyi sesuai format
            input-output, di bahasa pilihanmu di bawah ini.
          </p>
          {langKeys.length > 1 && (
            <div className="mb-3">
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
            </div>
          )}
          <CodeEditor
            value={code}
            onChange={setCode}
            language={(lang as LangId) ?? "python"}
            minHeight="280px"
            maxHeight="560px"
            ariaLabel="Editor solusi akhir proyek"
          />
          <button
            onClick={ujiAkhir}
            disabled={busy || !langTersedia}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {busy ? <SpinnerGap size={18} className="animate-spin" aria-hidden /> : <Trophy size={18} aria-hidden />}
            Kumpulkan & Uji
          </button>
          {!langTersedia && (
            <p className="mt-4 rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm" role="alert">
              Runtime {LANGUAGES[lang as LangId]?.label ?? lang} belum tersedia di server ini. Pilih bahasa lain atau
              aktifkan toolchainnya (lihat README).
            </p>
          )}
          {errorMsg && (
            <p className="mt-4 rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm" role="alert">
              {errorMsg}
            </p>
          )}
          {outcome && <TestResults outcome={outcome} />}
        </section>
      )}

      {(completed || (hasFinalTests && finalPassed)) && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-lulus/40 bg-lulus/10 p-6 text-center">
          {xpGained ? <XpBurst xp={xpGained} /> : null}
          <p className="mt-2 flex items-center justify-center gap-2 font-semibold text-lulus">
            {completed ? <CheckCircle size={18} aria-hidden /> : <Circle size={18} aria-hidden />}
            {completed
              ? "Proyek tuntas. Kerja bagus!"
              : "Ujian akhir lulus. Tandai semua langkah checklist untuk menuntaskan."}
          </p>
          <Link href={backHref} className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5">
            Lihat proyek lain
            <ArrowRight size={18} aria-hidden />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
