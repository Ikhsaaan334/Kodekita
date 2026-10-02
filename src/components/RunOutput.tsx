"use client";

import { CheckCircle, WarningCircle, SpinnerGap } from "@phosphor-icons/react";

/** Panel hasil eksekusi: idle, loading, keluaran, dan error yang jujur (R-27). */
export function RunOutput({
  state,
  stdout,
  stderr,
  timedOut,
}: {
  state: "idle" | "loading" | "done" | "error";
  stdout?: string;
  stderr?: string;
  timedOut?: boolean;
}) {
  if (state === "idle") {
    return (
      <p className="rounded-xl border border-ink-600 bg-ink-800/50 p-4 text-sm text-gading-500">
        Tekan tombol jalankan atau uji untuk melihat hasilnya di sini.
      </p>
    );
  }
  if (state === "loading") {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/50 p-4 text-sm text-gading-300" role="status">
        <SpinnerGap size={18} className="animate-spin" aria-hidden />
        Menjalankan kode di server...
      </p>
    );
  }
  if (state === "error") {
    return (
      <div className="rounded-xl border border-gagal/40 bg-gagal/10 p-4 text-sm" role="alert">
        <p className="mb-1 flex items-center gap-2 font-semibold text-gagal">
          <WarningCircle size={18} aria-hidden />
          {timedOut ? "Kode terlalu lama berjalan (batas 10 detik)" : "Kode gagal berjalan"}
        </p>
        {stderr && (
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-code text-xs text-gading-300">{stderr}</pre>
        )}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-950 p-4 text-sm">
      <p className="mb-2 flex items-center gap-1.5 font-code text-xs uppercase tracking-wide text-gading-500">
        <CheckCircle size={14} className={stdout ? "text-lulus" : ""} aria-hidden />
        Keluaran program
      </p>
      {stdout ? (
        <pre className="max-h-60 overflow-auto whitespace-pre-wrap font-code text-[0.85rem] leading-relaxed text-gading-50">
          {stdout}
        </pre>
      ) : (
        <p className="text-gading-500">Program berjalan tanpa mencetak apa pun.</p>
      )}
      {stderr && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-gading-500">Pesan samping (stderr)</summary>
          <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap font-code text-xs text-gading-500">{stderr}</pre>
        </details>
      )}
    </div>
  );
}
