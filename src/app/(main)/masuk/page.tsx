import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Masuk" };

export default async function MasukPage() {
  // cek di level halaman (bukan middleware) agar token milik user yang sudah
  // dihapus tidak memicu loop redirect dengan /belajar
  const user = await getSessionUser();
  if (user) redirect("/belajar");
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Masuk lagi<span className="anim-caret ml-1 inline-block h-[0.8em] w-[0.12em] translate-y-[0.06em] bg-emas-500" aria-hidden />
      </h1>
      <p className="mb-8 mt-2 text-gading-300">Streak dan XP kamu menunggu di tempat yang sama.</p>
      <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
        <Suspense fallback={<p className="text-gading-500" role="status">Memuat form...</p>}>
          <AuthForm mode="masuk" />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-gading-500">
        Baru mendengar tentang platform ini?{" "}
        <Link href="/" className="text-emas-400 hover:underline">
          Lihat dulu caranya belajar di sini
        </Link>
      </p>
    </div>
  );
}
