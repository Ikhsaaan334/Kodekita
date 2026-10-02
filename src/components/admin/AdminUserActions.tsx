"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpinnerGap } from "@phosphor-icons/react";

export function AdminUserActions({
  userId,
  username,
  banned,
  xp,
  isAdmin,
  isSelf,
}: {
  userId: string;
  username: string;
  banned: boolean;
  xp: number;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [pesan, setPesan] = useState<{ ok: boolean; text: string } | null>(null);
  const [xpBaru, setXpBaru] = useState(String(xp));
  const [passwordBaru, setPasswordBaru] = useState<string | null>(null);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState("");

  async function aksi(fn: () => Promise<Response>, label: string) {
    setBusy(label);
    setPesan(null);
    try {
      const res = await fn();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPesan({ ok: false, text: data.error ?? "Aksi gagal." });
        return data;
      }
      return data;
    } finally {
      setBusy(null);
    }
  }

  async function toggleBan() {
    const data = await aksi(
      () =>
        fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banned: !banned }),
        }),
      "ban"
    );
    if (data) {
      setPesan({ ok: true, text: banned ? "Pembekuan dibuka." : "Akun dibekukan." });
      router.refresh();
    }
  }

  async function setXp() {
    const nilai = parseInt(xpBaru, 10);
    if (Number.isNaN(nilai) || nilai < 0) {
      setPesan({ ok: false, text: "XP harus angka bulat >= 0." });
      return;
    }
    const data = await aksi(
      () =>
        fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xp: nilai }),
        }),
      "xp"
    );
    if (data) {
      setPesan({ ok: true, text: `XP diset ke ${nilai.toLocaleString("id-ID")}.` });
      router.refresh();
    }
  }

  async function resetPassword() {
    const data = await aksi(
      () =>
        fetch(`/api/admin/users/${userId}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }),
      "reset"
    );
    if (data) {
      setPasswordBaru(data.password);
      setPesan({ ok: true, text: "Password baru dibuat. Salin sekarang, hanya ditampilkan sekali:" });
    }
  }

  async function hapusAkun() {
    const data = await aksi(() => fetch(`/api/admin/users/${userId}`, { method: "DELETE" }), "hapus");
    if (data) {
      router.push("/admin/pengguna");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <section aria-label="Bekukan akun" className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
        <h3 className="font-semibold">Bekukan akun</h3>
        <p className="mt-1 text-sm text-gading-500">
          {banned ? "Akun ini sedang dibekukan dan tidak bisa masuk." : "Memblokir akun dari masuk tanpa menghapus data."}
        </p>
        <button
          onClick={toggleBan}
          disabled={busy !== null || isSelf || isAdmin}
          className={`mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors disabled:opacity-40 ${
            banned ? "border-lulus/50 text-lulus hover:bg-lulus/10" : "border-gagal/50 text-gagal hover:bg-gagal/10"
          }`}
        >
          {busy === "ban" && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
          {banned ? "Buka Pembekuan" : "Bekukan Akun"}
        </button>
        {(isSelf || isAdmin) && (
          <p className="mt-2 text-xs text-gading-500">{isSelf ? "Tidak bisa membekukan akun sendiri." : "Akun admin tidak bisa dibekukan."}</p>
        )}
      </section>

      <section aria-label="Koreksi XP" className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
        <h3 className="font-semibold">Koreksi XP</h3>
        <p className="mt-1 text-sm text-gading-500">Set nilai XP eksak untuk memperbaiki kesalahan hitung.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="number"
            min={0}
            value={xpBaru}
            onChange={(e) => setXpBaru(e.target.value)}
            aria-label="Nilai XP baru"
            className="min-h-[44px] w-40 rounded-xl border border-ink-600 bg-ink-950 px-3 font-code text-sm text-gading-50"
          />
          <button
            onClick={setXp}
            disabled={busy !== null}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {busy === "xp" && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
            Set XP
          </button>
        </div>
      </section>

      <section aria-label="Reset password" className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
        <h3 className="font-semibold">Reset password</h3>
        <p className="mt-1 text-sm text-gading-500">Membuat password baru untuk pengguna ini. Salin dan sampaikan lewat jalur aman.</p>
        <button
          onClick={resetPassword}
          disabled={busy !== null}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-500 px-5 text-sm font-semibold transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {busy === "reset" && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
          Buat Password Baru
        </button>
        {passwordBaru && (
          <p className="mt-3 break-all rounded-lg border border-emas-600/40 bg-emas-500/10 p-3 font-code text-sm text-emas-300" role="status">
            {passwordBaru}
          </p>
        )}
      </section>

      <section aria-label="Hapus akun" className="rounded-xl border border-gagal/40 bg-gagal/5 p-4">
        <h3 className="font-semibold text-gagal">Hapus akun permanen</h3>
        <p className="mt-1 text-sm text-gading-500">
          Menghapus progres dan submission. Tidak bisa dibatalkan. Ketik username <span className="font-code text-gading-50">{username}</span> untuk
          konfirmasi.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={konfirmasiHapus}
            onChange={(e) => setKonfirmasiHapus(e.target.value)}
            aria-label="Ketik username untuk konfirmasi hapus"
            className="min-h-[44px] flex-1 rounded-xl border border-ink-600 bg-ink-950 px-3 font-code text-sm text-gading-50"
            placeholder={username}
          />
          <button
            onClick={hapusAkun}
            disabled={busy !== null || konfirmasiHapus !== username || isAdmin || isSelf}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gagal/50 px-5 text-sm font-semibold text-gagal transition-colors hover:bg-gagal/10 disabled:opacity-40"
          >
            {busy === "hapus" && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
            Hapus Permanen
          </button>
        </div>
        {(isAdmin || isSelf) && (
          <p className="mt-2 text-xs text-gading-500">{isAdmin ? "Akun admin tidak bisa dihapus lewat panel." : "Tidak bisa menghapus akun sendiri."}</p>
        )}
      </section>

      {pesan && (
        <p className={`rounded-xl border p-3 text-sm ${pesan.ok ? "border-lulus/40 bg-lulus/10 text-gading-50" : "border-gagal/40 bg-gagal/10 text-gading-50"}`} role="status">
          {pesan.text}
        </p>
      )}
    </div>
  );
}
