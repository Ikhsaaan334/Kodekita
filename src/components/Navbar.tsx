"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { List, SignOut, X } from "@phosphor-icons/react";
import { Avatar } from "./Avatar";
import { NameTag } from "./NameTag";
import type { SessionUser } from "@/lib/auth";

const LINKS = [
  { href: "/belajar", label: "Belajar" },
  { href: "/tantangan", label: "Tantangan" },
  { href: "/proyek", label: "Proyek" },
  { href: "/papan-peringkat", label: "Papan Peringkat" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const daftarLink = user?.role === "admin" ? [...LINKS, { href: "/admin", label: "Admin" }] : LINKS;

  async function keluar() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      {daftarLink.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex min-h-[44px] items-center rounded-lg px-3 text-[0.95rem] transition-colors ${
              active ? "bg-ink-700 font-semibold text-gading-50" : "text-gading-300 hover:bg-ink-800 hover:text-gading-50"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/75 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4" aria-label="Navigasi utama">
        <Link href={user ? "/belajar" : "/"} className="mr-2 flex items-center gap-1 font-code text-lg font-semibold tracking-tight">
          <span className="text-gading-50">kodekita</span>
          <span className="anim-caret inline-block h-4 w-2 bg-emas-500" aria-hidden />
        </Link>
        <div className="hidden items-center gap-1 md:flex">{navLinks}</div>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/profil"
                className="flex min-h-[44px] items-center gap-2 rounded-lg px-2 transition-colors hover:bg-ink-800"
                title="Buka profil"
              >
                <Avatar url={user.avatarUrl} name={user.username} size={32} />
                <NameTag name={user.username} color={user.nameColor} effect={user.nameEffect} className="hidden sm:inline" />
              </Link>
              <button
                onClick={keluar}
                disabled={loggingOut}
                aria-label="Keluar dari akun"
                className="flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-sm text-gading-500 transition-colors hover:bg-ink-800 hover:text-gading-50 disabled:opacity-50"
              >
                <SignOut size={16} aria-hidden />
                <span className="hidden sm:inline">{loggingOut ? "Keluar..." : "Keluar"}</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/masuk" className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-gading-300 transition-colors hover:text-gading-50">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="flex min-h-[44px] items-center rounded-lg bg-emas-500 px-4 text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Buat Akun Gratis
              </Link>
            </>
          )}
          <button
            className="grid h-11 w-11 place-items-center rounded-lg text-gading-300 hover:bg-ink-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-ink-700 bg-ink-900 px-4 py-2 md:hidden">
          <div className="flex flex-col gap-1 pb-2">{navLinks}</div>
        </div>
      )}
    </header>
  );
}
