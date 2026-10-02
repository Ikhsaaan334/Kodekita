"use client";

import { useState } from "react";
import { SpinnerGap } from "@phosphor-icons/react";

export function SeedButton() {
  const [teks, setTeks] = useState("");
  const [busy, setBusy] = useState(false);
  const [pesan, setPesan] = useState<{ ok: boolean; text: string } | null>(null);

  async function seedUlang() {
    setBusy(true);
    setPesan(null);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: teks }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPesan({ ok: false, text: data.error ?? "Seed ulang gagal." });
        return;
      }
      setPesan({
        ok: true,
        text: `Selesai: ${data.fondasi + data.jalur} materi, ${data.tantangan} tantangan, ${data.proyek} proyek dibangun ulang.`,
      });
      setTeks("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gading-300">
        Membangun ulang seluruh konten dari sumber. <span className="font-semibold text-gagal">Semua progres pengguna akan terhapus</span> (akun dan XP
        tetap). Untuk konfirmasi, ketik persis: <code className="font-code text-emas-300">HAPUS PROGRES</code>
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          className="min-h-[44px] flex-1 rounded-xl border border-ink-600 bg-ink-950 px-3 font-code text-sm text-gading-50 placeholder:text-gading-500"
          placeholder="HAPUS PROGRES"
          aria-label="Teks konfirmasi seed ulang"
        />
        <button
          onClick={seedUlang}
          disabled={busy || teks !== "HAPUS PROGRES"}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gagal/50 px-5 text-sm font-semibold text-gagal transition-colors hover:bg-gagal/10 disabled:opacity-40"
        >
          {busy && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
          Seed Ulang Konten
        </button>
      </div>
      {pesan && (
        <p className={`text-sm ${pesan.ok ? "text-lulus" : "text-gagal"}`} role="status">
          {pesan.text}
        </p>
      )}
    </div>
  );
}
