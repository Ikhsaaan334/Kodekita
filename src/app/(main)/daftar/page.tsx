import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Daftar" };

export default async function DaftarPage() {
  const user = await getSessionUser();
  if (user) redirect("/belajar");
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Buat akun gratis<span className="anim-caret ml-1 inline-block h-[0.8em] w-[0.12em] translate-y-[0.06em] bg-emas-500" aria-hidden />
      </h1>
      <p className="mb-8 mt-2 text-gading-300">Tanpa kartu kredit. XP dan streak mulai dihitung dari pelajaran pertama.</p>
      <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
        <Suspense fallback={<p className="text-gading-500" role="status">Memuat form...</p>}>
          <AuthForm mode="daftar" />
        </Suspense>
      </div>
    </div>
  );
}
