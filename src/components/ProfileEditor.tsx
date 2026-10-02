"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, SpinnerGap, UploadSimple, WarningCircle } from "@phosphor-icons/react";
import { Avatar } from "./Avatar";
import { NameTag } from "./NameTag";
import { NAME_COLORS } from "@/lib/profile";
import { LANGUAGES, LANG_IDS } from "@/lib/languages";
import type { SessionUser } from "@/lib/auth";

const EFFECTS = [
  { id: "normal", label: "Normal", desc: "Klasik dan bersih" },
  { id: "pixel", label: "Pixel", desc: "Font bitmap, rasa retro" },
  { id: "glitch", label: "Glitch", desc: "Sedikit kacau, banyak karakter" },
];

export function ProfileEditor({ user }: { user: SessionUser }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState(user.nameColor);
  const [effect, setEffect] = useState(user.nameEffect);
  const [lang, setLang] = useState(user.preferredLang);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  async function uploadAvatar(file: File) {
    setUploading(true);
    setFeedback(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ ok: false, text: data.error ?? "Gagal mengunggah avatar." });
        return;
      }
      setAvatarUrl(data.avatarUrl);
      setFeedback({ ok: true, text: "Avatar diperbarui, termasuk kalau itu GIF." });
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  async function simpan() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameColor: color, nameEffect: effect, preferredLang: lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ ok: false, text: data.error ?? "Gagal menyimpan." });
        return;
      }
      setFeedback({ ok: true, text: "Gaya nama tersimpan." });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <section aria-label="Pratinjau" className="rounded-2xl border border-ink-600 bg-ink-800/40 p-6 text-center">
        <div className="mx-auto w-fit">
          <Avatar url={avatarUrl} name={user.username} size={96} className="mx-auto" />
        </div>
        <div className="mt-4 text-2xl">
          <NameTag name={user.username} color={color} effect={effect} />
        </div>
        <p className="mt-2 font-code text-xs text-gading-500">{user.email}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl bg-ink-900 p-3">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">XP</dt>
            <dd className="font-code text-xl font-semibold text-emas-400">{user.xp}</dd>
          </div>
          <div className="rounded-xl bg-ink-900 p-3">
            <dt className="font-code text-[0.68rem] uppercase tracking-wide text-gading-500">Streak</dt>
            <dd className="font-code text-xl font-semibold text-emas-400">{user.streakCount} hari</dd>
          </div>
        </dl>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-ink-500 px-4 text-sm font-semibold transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {uploading ? <SpinnerGap size={18} className="animate-spin" aria-hidden /> : <UploadSimple size={18} aria-hidden />}
          Unggah Foto (PNG, JPG, GIF)
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="sr-only"
          aria-label="Pilih berkas avatar"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadAvatar(f);
            e.target.value = "";
          }}
        />
        <p className="mt-2 text-xs text-gading-500">Maksimal 2 MB. GIF juga bisa, dan akan bergerak.</p>
      </section>

      <div className="space-y-8">
        <section aria-label="Warna nama">
          <h2 className="mb-3 text-lg font-bold">Warna nama</h2>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Pilih warna nama">
            {Object.entries(NAME_COLORS).map(([key, hex]) => (
              <button
                key={key}
                role="radio"
                aria-checked={color === key}
                onClick={() => setColor(key)}
                className={`h-11 w-11 rounded-full border-2 transition-transform hover:-translate-y-0.5 ${color === key ? "border-gading-50" : "border-transparent"}`}
                style={{ backgroundColor: hex }}
                title={key}
              >
                <span className="sr-only">{key}</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-label="Efek nama">
          <h2 className="mb-3 text-lg font-bold">Efek nama</h2>
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Pilih efek nama">
            {EFFECTS.map((e) => (
              <button
                key={e.id}
                role="radio"
                aria-checked={effect === e.id}
                onClick={() => setEffect(e.id)}
                className={`min-h-[72px] rounded-xl border p-4 text-left transition-colors ${
                  effect === e.id ? "border-emas-500 bg-ink-800" : "border-ink-600 bg-ink-800/40 hover:border-ink-500"
                }`}
              >
                <span className="block font-semibold">
                  <NameTag name={e.label} color={color} effect={e.id} />
                </span>
                <span className="mt-0.5 block text-xs text-gading-500">{e.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-label="Bahasa utama">
          <h2 className="mb-3 text-lg font-bold">Bahasa utama</h2>
          <p className="mb-3 text-sm text-gading-500">
            Bahasa yang aktif otomatis saat kamu membuka pelajaran dan proyek. Tetap bisa diganti kapan saja di atas editor.
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih bahasa utama">
            {LANG_IDS.map((k) => (
              <button
                key={k}
                role="radio"
                aria-checked={lang === k}
                onClick={() => setLang(k)}
                className={`min-h-[44px] rounded-full border px-4 font-code text-sm font-semibold transition-colors ${
                  lang === k
                    ? "border-emas-500 bg-emas-500/15 text-emas-300"
                    : "border-ink-600 text-gading-300 hover:border-ink-500"
                }`}
              >
                {LANGUAGES[k].label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={simpan}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-6 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving && <SpinnerGap size={18} className="animate-spin" aria-hidden />}
            Simpan Gaya Nama
          </button>
          {feedback && (
            <p className={`flex items-center gap-2 text-sm ${feedback.ok ? "text-lulus" : "text-gagal"}`} role="status">
              {feedback.ok ? <CheckCircle size={16} aria-hidden /> : <WarningCircle size={16} aria-hidden />}
              {feedback.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
