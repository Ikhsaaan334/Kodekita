"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SpinnerGap } from "@phosphor-icons/react";

export function AuthForm({ mode }: { mode: "masuk" | "daftar" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/belajar";
  const [fields, setFields] = useState({ identity: "", email: "", username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const endpoint = mode === "daftar" ? "/api/auth/register" : "/api/auth/login";
      const body = mode === "daftar" ? { email: fields.email, username: fields.username, password: fields.password } : { identity: fields.identity, password: fields.password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Ada yang salah, coba lagi.");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "min-h-[48px] w-full rounded-xl border border-ink-600 bg-ink-950 px-4 text-gading-50 placeholder:text-gading-500 focus:border-emas-500";

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {mode === "masuk" ? (
        <div>
          <label htmlFor="identity" className="mb-1 block text-sm font-semibold">
            Email atau username
          </label>
          <input id="identity" type="text" autoComplete="username" required value={fields.identity} onChange={set("identity")} className={inputCls} placeholder="email@kamu.com" />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">
              Email
            </label>
            <input id="email" type="email" autoComplete="email" required value={fields.email} onChange={set("email")} className={inputCls} placeholder="email@kamu.com" />
          </div>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-semibold">
              Username
            </label>
            <input id="username" type="text" autoComplete="username" required minLength={3} maxLength={20} value={fields.username} onChange={set("username")} className={inputCls} placeholder="huruf, angka, garis bawah" />
            <p className="mt-1 text-xs text-gading-500">Nama ini yang tampil di papan peringkat dan bisa kamu warnai nanti.</p>
          </div>
        </>
      )}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "daftar" ? "new-password" : "current-password"}
          required
          minLength={mode === "daftar" ? 8 : undefined}
          value={fields.password}
          onChange={set("password")}
          className={inputCls}
          placeholder={mode === "daftar" ? "minimal 8 karakter" : "password kamu"}
        />
      </div>
      {error && (
        <p className="rounded-xl border border-gagal/40 bg-gagal/10 p-3 text-sm" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emas-500 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {busy && <SpinnerGap size={18} className="animate-spin" aria-hidden />}
        {mode === "daftar" ? "Buat Akun & Mulai Belajar" : "Masuk"}
      </button>
      <p className="text-center text-sm text-gading-500">
        {mode === "masuk" ? (
          <>
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-semibold text-emas-400 hover:underline">
              Daftar gratis
            </Link>
          </>
        ) : (
          <>
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-semibold text-emas-400 hover:underline">
              Masuk di sini
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
