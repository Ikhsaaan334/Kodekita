import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Admin | KodeKita" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/admin");
  // guard di level layout: halaman admin tidak pernah dirender untuk non-admin
  if (user.role !== "admin") redirect("/belajar");

  const tabs = [
    { href: "/admin", label: "Ringkasan" },
    { href: "/admin/pengguna", label: "Pengguna" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="font-code text-xs uppercase tracking-wide text-emas-400">Panel Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Kendali Penuh KodeKita</h1>
        <nav className="mt-5 flex gap-2" aria-label="Menu admin">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="min-h-[44px] rounded-full border border-ink-600 px-4 py-2 text-sm font-semibold text-gading-300 transition-colors hover:border-emas-600 hover:text-gading-50"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
