import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <p className="font-code text-6xl font-bold text-emas-400">404</p>
        <h1 className="mt-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <Link href="/" className="mt-6 inline-flex min-h-[48px] items-center rounded-xl bg-emas-500 px-6 font-semibold text-ink-950">
          Kembali ke halaman utama
        </Link>
      </div>
    </div>
  );
}
