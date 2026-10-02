"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, CheckCircle, XCircle, SpinnerGap, PushPin } from "@phosphor-icons/react";
import { CodeEditor } from "./CodeEditor";
import { Markdown } from "./Markdown";
import { XpBurst } from "./motion-bits";
import { LANGUAGES, type LangId } from "@/lib/languages";
import { bahasaTersedia } from "@content/normalisasi";
import type { LessonProgressDto, JudgeOutcomeDto } from "@/lib/client-types";
import type { AgnosticStep } from "@content/types";

type Props = {
  lesson: { id: string; title: string; steps: AgnosticStep[] };
  availableLangs: LangId[];
  initialLang: string;
  trackTitle: string;
  trackHref: string;
  nextHref: string | null;
  initialProgress: LessonProgressDto;
};

function ambil<T>(map: Record<string, T>, lang: string): T {
  return map[lang] ?? map["python"] ?? Object.values(map)[0];
}

export function LessonStepPlayer({
  lesson,
  availableLangs,
  initialLang,
  trackTitle,
  trackHref,
  nextHref,
  initialProgress,
}: Props) {
  const steps = lesson.steps;
  const done = new Set(initialProgress.completedSteps);
  const firstUndone = steps.findIndex((_, i) => !done.has(i));
  const [current, setCurrent] = useState(firstUndone === -1 ? steps.length - 1 : firstUndone);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(done);
  const [finishing, setFinishing] = useState(false);
  // bahasa yang benar-benar punya varian di lesson ini: jalur per-bahasa cuma satu,
  // jadi picker disembunyikan dan bahasa terkunci ke bahasa track-nya
  const contentLangs = bahasaTersedia(steps);
  const satuBahasa = contentLangs.length <= 1;
  const [lang, setLang] = useState<string>(() => {
    const kandidat = contentLangs.length ? contentLangs : ["python"];
    const pilihan = availableLangs.filter((l) => kandidat.includes(l));
    if (satuBahasa) return kandidat[0];
    return pilihan.includes(initialLang as LangId) ? initialLang : (pilihan[0] ?? kandidat[0]);
  });
  const step = steps[current];
  const allDone = completedSteps.size >= steps.length;

  async function tandahSelesai() {
    if (finishing) return;
    setFinishing(true);
    try {
      await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, stepIndex: current }),
      });
      setCompletedSteps((s) => new Set(s).add(current));
      if (current < steps.length - 1) setCurrent(current + 1);
    } finally {
      setFinishing(false);
    }
  }

  function onCodeLulus() {
    setCompletedSteps((s) => new Set(s).add(current));
  }

  return (
    <div
      className={`mx-auto px-4 py-8 transition-[max-width] duration-300 ${
        step.kind === "code" ? "max-w-6xl" : "max-w-3xl"
      }`}
    >
      <div className="mb-6">
        <Link href={trackHref} className="text-sm text-gading-500 transition-colors hover:text-gading-50">
          {trackTitle}
        </Link>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700"
            role="progressbar"
            aria-valuenow={completedSteps.size}
            aria-valuemin={0}
            aria-valuemax={steps.length}
          >
            <motion.div
              className="h-full rounded-full bg-emas-500"
              initial={false}
              animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="font-code text-xs text-gading-500">
            {completedSteps.size}/{steps.length}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ke langkah ${i + 1}`}
              aria-current={i === current ? "step" : undefined}
              className={`h-8 min-w-8 rounded-lg px-2 font-code text-xs transition-colors ${
                i === current
                  ? "bg-emas-500 font-bold text-ink-950"
                  : completedSteps.has(i)
                    ? "bg-ink-700 text-lulus"
                    : "bg-ink-800 text-gading-500 hover:bg-ink-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {!satuBahasa && (
          <div className="mt-4">
            <p className="mb-2 font-code text-xs uppercase tracking-wide text-gading-500">Bahasa latihan</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih bahasa latihan">
              {contentLangs.map((k) => {
                const ada = availableLangs.includes(k as LangId);
                return (
                  <button
                    key={k}
                    onClick={() => setLang(k)}
                    disabled={!ada}
                    aria-pressed={lang === k}
                    title={ada ? undefined : `Runtime ${LANGUAGES[k as LangId].label} belum tersedia di server ini`}
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
            <p className="mt-2 text-xs text-gading-500">
              Soalnya sama untuk semua bahasa; teori, contoh, kuis, dan template berganti mengikuti bahasa yang dipilih.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {step.kind === "theory" && (
            <TheoryStepView step={step} lang={lang} onNext={tandahSelesai} busy={finishing} isLast={current === steps.length - 1} />
          )}
          {step.kind === "quiz" && (
            <QuizStepView step={step} lang={lang} onNext={tandahSelesai} busy={finishing} isLast={current === steps.length - 1} />
          )}
          {step.kind === "code" && (
            <CodeStepView step={step} lang={lang} lessonId={lesson.id} stepIndex={current} onPassed={onCodeLulus} />
          )}
        </motion.div>
      </AnimatePresence>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-emas-600/40 bg-emas-500/10 p-6 text-center"
        >
          <p className="font-semibold text-emas-300">Pelajaran selesai. Kode kamu yang menyelesaikannya.</p>
          {nextHref ? (
            <Link
              href={nextHref}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Lanjut ke pelajaran berikutnya
              <ArrowRight size={18} aria-hidden />
            </Link>
          ) : (
            <Link
              href={trackHref}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Kembali ke daftar modul
              <ArrowRight size={18} aria-hidden />
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

function TheoryStepView({
  step,
  lang,
  onNext,
  busy,
  isLast,
}: {
  step: Extract<AgnosticStep, { kind: "theory" }>;
  lang: string;
  onNext: () => void;
  busy: boolean;
  isLast: boolean;
}) {
  const body = ambil(step.bodyByLang, lang);
  const code = ambil(step.codeByLang, lang);
  return (
    <section aria-label={step.title}>
      <h2 className="mb-3 text-xl font-bold">{step.title}</h2>
      <Markdown text={body} />
      {code && (
        <figure className="mt-4">
          <pre className="overflow-x-auto rounded-xl border border-ink-600 bg-ink-950 p-4 font-code text-[0.85rem] leading-relaxed">
            <code>{code.content}</code>
          </pre>
          {code.caption && <figcaption className="mt-2 text-xs text-gading-500">{code.caption}</figcaption>}
        </figure>
      )}
      <button
        onClick={onNext}
        disabled={busy}
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {isLast ? "Selesaikan pelajaran" : "Mengerti, lanjut"}
        <ArrowRight size={18} aria-hidden />
      </button>
    </section>
  );
}

function QuizStepView({
  step,
  lang,
  onNext,
  busy,
  isLast,
}: {
  step: Extract<AgnosticStep, { kind: "quiz" }>;
  lang: string;
  onNext: () => void;
  busy: boolean;
  isLast: boolean;
}) {
  const v = ambil(step.byLang, lang);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const benar = checked && picked === v.answer;

  return (
    <section aria-label="Kuis">
      <div className="mb-4 text-xl font-bold">
        <Markdown text={v.question} />
      </div>
      <fieldset className="space-y-2">
        <legend className="sr-only">Pilih satu jawaban</legend>
        {v.options.map((opt, i) => {
          const isPicked = picked === i;
          return (
            <label
              key={i}
              className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                checked && i === v.answer
                  ? "border-lulus/50 bg-lulus/10"
                  : checked && isPicked
                    ? "border-gagal/50 bg-gagal/10"
                    : isPicked
                      ? "border-emas-500 bg-ink-800"
                      : "border-ink-600 bg-ink-800/50 hover:border-ink-500"
              }`}
            >
              <input
                type="radio"
                name="quiz"
                className="h-4 w-4 accent-[#e9b44c]"
                checked={isPicked}
                onChange={() => {
                  setPicked(i);
                  setChecked(false);
                }}
              />
              <span className="font-code text-[0.92rem]">{opt}</span>
            </label>
          );
        })}
      </fieldset>
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl border p-4 text-sm ${
            benar ? "border-lulus/40 bg-lulus/10 text-gading-50" : "border-gagal/40 bg-gagal/10 text-gading-50"
          }`}
          role="status"
        >
          <p className="font-semibold">{benar ? "Tepat sekali." : "Belum tepat, coba lagi."}</p>
          <div className="mt-1 text-gading-300">
            <Markdown text={v.explanation} />
          </div>
        </motion.div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {!benar && (
          <button
            onClick={() => setChecked(true)}
            disabled={picked === null}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-500 px-5 font-semibold text-gading-50 transition-colors hover:bg-ink-800 disabled:opacity-40"
          >
            Periksa Jawaban
          </button>
        )}
        {benar && (
          <button
            onClick={onNext}
            disabled={busy}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLast ? "Selesaikan pelajaran" : "Lanjut"}
            <ArrowRight size={18} aria-hidden />
          </button>
        )}
      </div>
    </section>
  );
}

function CodeStepView({
  step,
  lang,
  lessonId,
  stepIndex,
  onPassed,
}: {
  step: Extract<AgnosticStep, { kind: "code" }>;
  lang: string;
  lessonId: string;
  stepIndex: number;
  onPassed: () => void;
}) {
  const v = ambil(step.byLang, lang);
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(step.byLang).map(([k, s]) => [k, s.template]))
  );
  const [hintsShown, setHintsShown] = useState(0);
  const [loading, setLoading] = useState<"uji" | null>(null);
  const [outcome, setOutcome] = useState<JudgeOutcomeDto | null>(null);
  const [lulus, setLulus] = useState(false);
  const [xpGained, setXpGained] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const code = codes[lang] ?? v.template;

  function setCode(val: string) {
    setCodes((c) => ({ ...c, [lang]: val }));
  }

  async function uji() {
    setLoading("uji");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "lesson", refId: lessonId, stepIndex, code, language: lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Gagal menguji. Coba lagi.");
        return;
      }
      const data = (await res.json()) as { outcome: JudgeOutcomeDto; progress: LessonProgressDto | null };
      setOutcome(data.outcome);
      if (data.outcome.allPassed && !lulus) {
        setLulus(true);
        setXpGained(data.progress?.xpGained);
        onPassed();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <section aria-label="Soal latihan">
        <p className="mb-1 flex items-center gap-2 font-code text-xs uppercase tracking-wide text-gading-500">
          <PushPin size={14} aria-hidden />
          {v.mode === "fill" ? "Lengkapi kodenya" : "Perbaiki kodenya"}
        </p>
        <h2 className="mb-2 text-xl font-bold">{step.title}</h2>
        <div className="mb-6">
          <Markdown text={v.prompt} />
        </div>
        <div>
          <button
            onClick={() => setHintsShown((h) => Math.min(h + 1, v.hints.length))}
            disabled={hintsShown >= v.hints.length}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-500 px-4 text-sm font-semibold text-emas-400 transition-colors hover:bg-ink-800 disabled:opacity-40"
          >
            <Lightbulb size={18} aria-hidden />
            {hintsShown === 0 ? "Saya bingung" : `Hint berikutnya (${hintsShown}/${v.hints.length})`}
          </button>
          <AnimatePresence>
            {hintsShown > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {v.hints.slice(0, hintsShown).map((h, i) => (
                  <li key={i} className="rounded-xl border border-emas-600/30 bg-emas-500/5 p-3 text-sm text-gading-300">
                    <span className="mr-1 font-semibold text-emas-400">Hint {i + 1}:</span>
                    {h}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section aria-label="Editor latihan">
        <CodeEditor value={code} onChange={setCode} language={(lang as LangId) ?? "python"} ariaLabel="Editor latihan kode" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={uji}
            disabled={loading !== null}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading === "uji" ? (
              <>
                <SpinnerGap size={18} className="animate-spin" aria-hidden /> Menguji...
              </>
            ) : (
              "Uji Kode"
            )}
          </button>
          <button
            onClick={() => setCode(v.template)}
            className="min-h-[44px] rounded-xl px-3 text-sm text-gading-500 transition-colors hover:text-gading-50"
          >
            Kembalikan template
          </button>
        </div>
        {errorMsg && (
          <p className="mt-4 rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm text-gading-50" role="alert">
            {errorMsg}
          </p>
        )}
        {outcome && <TestResults outcome={outcome} />}
        {lulus && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <XpBurst xp={xpGained ?? 0} />
            <p className="mt-2 text-center text-sm text-gading-300">Semua tes lulus. Langkah ini tercatat selesai.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}

export function TestResults({ outcome }: { outcome: JudgeOutcomeDto }) {
  if (outcome.compileFailed) {
    return (
      <div className="mt-4 rounded-xl border border-gagal/40 bg-gagal/10 p-4" role="alert">
        <p className="font-semibold text-gagal">Gagal kompilasi</p>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-code text-xs text-gading-300">
          {outcome.stderr}
        </pre>
      </div>
    );
  }
  return (
    <ul className="mt-4 space-y-2">
      {outcome.results.map((r, i) => (
        <li
          key={i}
          className={`rounded-xl border p-3 text-sm ${
            r.passed ? "border-lulus/40 bg-lulus/5" : "border-gagal/40 bg-gagal/10"
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            {r.passed ? (
              <CheckCircle size={16} className="text-lulus" aria-hidden />
            ) : (
              <XCircle size={16} className="text-gagal" aria-hidden />
            )}
            Test {i + 1} {r.passed ? "lulus" : "belum lulus"}
            {r.hidden && (
              <span className="ml-1 flex items-center gap-1 font-code text-[0.7rem] uppercase text-gading-500">
                tersembunyi
              </span>
            )}
          </p>
          {!r.passed && !r.hidden && (
            <div className="mt-2 grid gap-2 font-code text-xs text-gading-300 sm:grid-cols-3">
              {r.stdin !== undefined && (
                <div>
                  <p className="text-gading-500">input</p>
                  <pre className="whitespace-pre-wrap">{r.stdin || "(kosong)"}</pre>
                </div>
              )}
              {r.expected !== undefined && (
                <div>
                  <p className="text-gading-500">diharapkan</p>
                  <pre className="whitespace-pre-wrap">{r.expected}</pre>
                </div>
              )}
              {r.actual !== undefined && (
                <div>
                  <p className="text-gading-500">hasil kamu</p>
                  <pre className="whitespace-pre-wrap">{r.actual || "(kosong)"}</pre>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
