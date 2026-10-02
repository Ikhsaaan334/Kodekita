import type { AgnosticStep, LangMap, Step } from "./types";

/**
 * Menyeragamkan bentuk step: konten tunggal-bahasa (jalur per bahasa) dibungkus
 * jadi bentuk agnostic dengan satu kunci bahasa, sehingga player memakai satu
 * jalur render untuk semua track. Bahasa kunci = slug bahasanya sendiri.
 */
export function keAgnostic(steps: Step[], lang: string): AgnosticStep[] {
  return steps.map((s): AgnosticStep => {
    if (s.kind === "theory") {
      const body: LangMap<string> = { [lang]: s.body };
      const code: LangMap<{ content: string; caption?: string }> = {};
      if (s.code) code[lang] = { content: s.code.content, caption: s.code.caption };
      return { kind: "theory", title: s.title, bodyByLang: body, codeByLang: code };
    }
    if (s.kind === "quiz") {
      return {
        kind: "quiz",
        byLang: {
          [lang]: { question: s.question, options: s.options, answer: s.answer, explanation: s.explanation },
        },
      };
    }
    return {
      kind: "code",
      title: s.title,
      tests: s.tests,
      byLang: {
        [lang]: { mode: s.mode, prompt: s.prompt, template: s.template, solution: s.solution, hints: s.hints },
      },
    };
  });
}

/** Kumpulan kunci bahasa yang benar-benar punya varian di lesson ini. */
export function bahasaTersedia(steps: AgnosticStep[]): string[] {
  const kunci = new Set<string>();
  for (const s of steps) {
    if (s.kind === "theory") Object.keys(s.bodyByLang).forEach((k) => kunci.add(k));
    if (s.kind === "quiz") Object.keys(s.byLang).forEach((k) => kunci.add(k));
    if (s.kind === "code") Object.keys(s.byLang).forEach((k) => kunci.add(k));
  }
  return [...kunci];
}
