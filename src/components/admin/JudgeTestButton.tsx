"use client";

import { useState } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { LANGUAGES, type LangId } from "@/lib/languages";

export function JudgeTestButton({ langs }: { langs: LangId[] }) {
  const [busy, setBusy] = useState<LangId | null>(null);
  const [hasil, setHasil] = useState<{ lang: string; ok: boolean; teks: string } | null>(null);

  async function tes(lang: LangId) {
    setBusy(lang);
    setHasil(null);
    try {
      const res = await fetch("/api/admin/judge-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      const data = await res.json();
      setHasil({
        lang,
        ok: data.ok === true,
        teks: data.ok === true ? `keluaran: ${String(data.stdout).trim()}` : String(data.stderr || "gagal").slice(0, 200),
      });
    } catch {
      setHasil({ lang, ok: false, teks: "tidak bisa menghubungi server" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => tes(l)}
            disabled={busy !== null}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-ink-600 px-3 font-code text-xs font-semibold text-gading-300 transition-colors hover:border-emas-600 hover:text-gading-50 disabled:opacity-50"
          >
            {busy === l && <SpinnerGap size={13} className="animate-spin" aria-hidden />}
            tes {LANGUAGES[l].label}
          </button>
        ))}
      </div>
      {hasil && (
        <p className={`mt-3 rounded-lg border p-3 font-code text-xs ${hasil.ok ? "border-lulus/40 bg-lulus/10 text-lulus" : "border-gagal/40 bg-gagal/10 text-gagal"}`} role="status">
          {LANGUAGES[hasil.lang as LangId]?.label ?? hasil.lang}: {hasil.teks}
        </p>
      )}
    </div>
  );
}
