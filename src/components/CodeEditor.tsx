"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { StreamLanguage } from "@codemirror/language";
import { csharp } from "@codemirror/legacy-modes/mode/clike";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import type { LangId } from "@/lib/languages";

/* Warna sintaks melayani keterbacaan kode (konten), bukan palet UI (DESIGN.md). */
const kodekitaTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "#F2EFE9",
    caret: "#E9B44C",
    selection: "#2a2a35",
    selectionMatch: "#3a3a48",
    lineHighlight: "#17171e",
    gutterBackground: "transparent",
    gutterForeground: "#565668",
    fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
  },
  styles: [
    { tag: t.comment, color: "#7d7869", fontStyle: "italic" },
    { tag: [t.keyword, t.moduleKeyword, t.controlKeyword], color: "#f0c46b" },
    { tag: [t.string, t.special(t.string)], color: "#a8c98a" },
    { tag: [t.number, t.bool, t.null], color: "#e98aa8" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#8fbde9" },
    { tag: [t.typeName, t.className], color: "#f5d691" },
    { tag: t.operator, color: "#c9c4bb" },
    { tag: t.punctuation, color: "#a8a29e" },
    { tag: t.meta, color: "#a8a29e" },
  ],
});

function extensionsFor(lang: LangId) {
  switch (lang) {
    case "python":
      return [python()];
    case "go":
      return [go()];
    case "php":
      return [php()];
    case "cpp":
      return [cpp()];
    case "c":
      return [cpp()];
    case "java":
      return [java()];
    case "csharp":
      return [StreamLanguage.define(csharp)];
  }
}

export function CodeEditor({
  value,
  onChange,
  language,
  minHeight = "200px",
  maxHeight = "480px",
  readOnly = false,
  ariaLabel = "Editor kode",
}: {
  value: string;
  onChange: (v: string) => void;
  language: LangId;
  /** Editor ikut menyesuaikan isi; melebihi maxHeight menjadi digulir di dalam, bukan terpotong. */
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-600 bg-ink-950">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={kodekitaTheme}
        extensions={[...extensionsFor(language), EditorView.lineWrapping]}
        readOnly={readOnly}
        editable={!readOnly}
        basicSetup={{ foldGutter: false, autocompletion: false, highlightActiveLine: !readOnly }}
        minHeight={minHeight}
        maxHeight={maxHeight}
        aria-label={ariaLabel}
      />
    </div>
  );
}
