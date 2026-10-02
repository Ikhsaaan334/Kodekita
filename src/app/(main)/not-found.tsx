import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-code text-6xl font-bold text-emas-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">Halaman yang kamu cari tidak ada</h1>
      <p className="mt-2 text-gading-300">
        Mungkin tautannya salah ketik, atau kontennya memang belum dibuat. Coba kembali ke jalur belajar.
      </p>
      <Link
        href="/belajar"
        className="mt-6 inline-flex min-h-[48px] items-center rounded-xl bg-emas-500 px-6 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
      >
        Kembali ke Belajar
      </Link>
    </div>
  );
}
