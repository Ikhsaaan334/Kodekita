"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, SpinnerGap } from "@phosphor-icons/react";
import { CodeEditor } from "./CodeEditor";
import { RunOutput } from "./RunOutput";

const DEMO_CODE = `# Contoh betul-betul dijalankan di server
nama = "Kamu"
for i in range(1, 4):
    print(f"{i}. Halo, {nama}!")`;

export function LandingDemo() {
  const [code, setCode] = useState(DEMO_CODE);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ stdout: string; stderr: string; timedOut?: boolean } | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  async function jalankan() {
    setState("loading");
    setNeedLogin(false);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code, stdin: "" }),
      });
      if (res.status === 401) {
        setNeedLogin(true);
        setState("error");
        setResult(null);
        return;
      }
      const data = await res.json();
      setResult(data);
      setState(data.ok ? "done" : "error");
    } catch {
      setState("error");
      setResult(null);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-4 sm:p-6">
      <CodeEditor value={code} onChange={setCode} language="python" minHeight="160px" maxHeight="280px" ariaLabel="Cuplikan kode demo" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={jalankan}
          disabled={state === "loading"}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emas-500 px-5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {state === "loading" ? <SpinnerGap size={18} className="animate-spin" aria-hidden /> : <Play size={18} weight="fill" aria-hidden />}
          Jalankan Kode
        </button>
        <p className="font-code text-xs text-gading-500">python, dieksekusi sungguhan di server</p>
      </div>
      {needLogin ? (
        <p className="mt-4 rounded-xl border border-ink-600 bg-ink-900 p-4 text-sm text-gading-300" role="status">
          Eksekusi kode di server ini khusus anggota.{" "}
          <Link href="/daftar" className="font-semibold text-emas-400 hover:underline">
            Buat akun gratis
          </Link>{" "}
          atau{" "}
          <Link href="/masuk" className="font-semibold text-emas-400 hover:underline">
            masuk
          </Link>{" "}
          untuk mencobanya.
        </p>
      ) : (
        <div className="mt-4">
          <RunOutput state={state} stdout={result?.stdout} stderr={result?.stderr} timedOut={result?.timedOut} />
        </div>
      )}
    </div>
  );
}
