import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-gading-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 font-code">
          <span>kodekita</span>
          <span className="anim-caret inline-block h-3.5 w-1.5 bg-emas-500" aria-hidden />
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Tautan kaki">
          <Link href="/belajar" className="transition-colors hover:text-gading-50">
            Belajar
          </Link>
          <Link href="/tantangan" className="transition-colors hover:text-gading-50">
            Tantangan
          </Link>
          <Link href="/proyek" className="transition-colors hover:text-gading-50">
            Proyek
          </Link>
          <Link href="/papan-peringkat" className="transition-colors hover:text-gading-50">
            Papan Peringkat
          </Link>
        </nav>
        <p className="text-xs">MVP lokal. Kode dijalankan di toolchain server ini, bukan di browser.</p>
      </div>
    </footer>
  );
}
