"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpinnerGap, Trash } from "@phosphor-icons/react";

export function AnnouncementManager({
  items,
}: {
  items: { id: string; title: string; body: string; active: boolean }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  async function terbitkan() {
    setBusy(true);
    setPesan(null);
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPesan(data.error ?? "Gagal menerbitkan.");
        return;
      }
      setTitle("");
      setBody("");
      setPesan("Pengumuman terbit dan tampil di dashboard semua pengguna.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function hapus(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/announcement?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-ink-600 bg-ink-950 px-3 text-sm text-gading-50 placeholder:text-gading-500"
          placeholder="Judul pengumuman"
          aria-label="Judul pengumuman"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-ink-600 bg-ink-950 p-3 text-sm text-gading-50 placeholder:text-gading-500"
          placeholder="Isi pengumuman, tampil di dashboard semua pengguna"
          aria-label="Isi pengumuman"
        />
        <button
          onClick={terbitkan}
          disabled={busy || title.length < 3 || body.length < 3}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {busy && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
          Terbitkan (menggantikan yang aktif)
        </button>
        {pesan && (
          <p className="text-sm text-gading-300" role="status">
            {pesan}
          </p>
        )}
      </div>
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="flex items-start gap-3 rounded-xl border border-ink-600 bg-ink-800/50 p-3 text-sm">
              <span className={`mt-1 shrink-0 rounded-full border px-2 py-0.5 font-code text-[0.65rem] uppercase ${a.active ? "border-lulus/40 text-lulus" : "border-ink-500 text-gading-500"}`}>
                {a.active ? "aktif" : "lama"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gading-50">{a.title}</span>
                <span className="mt-0.5 block text-gading-300">{a.body}</span>
              </span>
              <button
                onClick={() => hapus(a.id)}
                disabled={busy}
                aria-label={`Hapus pengumuman ${a.title}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gading-500 transition-colors hover:bg-gagal/10 hover:text-gagal disabled:opacity-50"
              >
                <Trash size={16} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
