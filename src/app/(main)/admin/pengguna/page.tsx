import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const kueri = (q ?? "").trim();
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perHalaman = 20;

  const where = kueri
    ? {
        OR: [
          { username: { contains: kueri, mode: "insensitive" as const } },
          { email: { contains: kueri, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        banned: true,
        xp: true,
        streakCount: true,
        lastActiveAt: true,
        createdAt: true,
      },
      skip: (page - 1) * perHalaman,
      take: perHalaman,
    }),
    db.user.count({ where }),
  ]);

  const totalHalaman = Math.max(1, Math.ceil(total / perHalaman));
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (kueri) params.set("q", kueri);
    params.set("page", String(p));
    return `/admin/pengguna?${params.toString()}`;
  };

  return (
    <div>
      <form method="get" action="/admin/pengguna" className="mb-5 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={kueri}
          placeholder="Cari username atau email..."
          aria-label="Cari pengguna"
          className="min-h-[44px] flex-1 rounded-xl border border-ink-600 bg-ink-950 px-4 text-sm text-gading-50 placeholder:text-gading-500"
        />
        <button type="submit" className="min-h-[44px] rounded-xl bg-emas-500 px-5 text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5">
          Cari
        </button>
      </form>

      <p className="mb-3 font-code text-xs text-gading-500">
        {total.toLocaleString("id-ID")} pengguna ditemukan, halaman {page} dari {totalHalaman}
      </p>

      {users.length === 0 ? (
        <p className="rounded-xl border border-ink-600 bg-ink-800/40 p-6 text-sm text-gading-500">
          Tidak ada pengguna yang cocok dengan pencarian.
        </p>
      ) : (
        <ul className="divide-y divide-ink-700 rounded-2xl border border-ink-600 bg-ink-800/40">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                href={`/admin/pengguna/${u.id}`}
                className="flex min-h-[64px] flex-wrap items-center gap-3 p-4 transition-colors hover:bg-ink-800/60"
              >
                <span className="font-semibold text-gading-50">{u.username}</span>
                {u.role === "admin" && (
                  <span className="rounded-full border border-emas-500/50 px-2 py-0.5 font-code text-[0.65rem] uppercase text-emas-400">admin</span>
                )}
                {u.banned && (
                  <span className="rounded-full border border-gagal/40 px-2 py-0.5 font-code text-[0.65rem] uppercase text-gagal">dibekukan</span>
                )}
                <span className="text-sm text-gading-500">{u.email}</span>
                <span className="ml-auto font-code text-xs text-gading-500">
                  {u.xp.toLocaleString("id-ID")} XP , aktif{" "}
                  {u.lastActiveAt
                    ? new Date(u.lastActiveAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                    : "belum pernah"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalHalaman > 1 && (
        <nav className="mt-4 flex items-center gap-3" aria-label="Halaman">
          {page > 1 && (
            <Link href={qs(page - 1)} className="min-h-[44px] rounded-xl border border-ink-600 px-4 py-2 text-sm font-semibold hover:bg-ink-800">
              Sebelumnya
            </Link>
          )}
          <span className="font-code text-xs text-gading-500">
            halaman {page}/{totalHalaman}
          </span>
          {page < totalHalaman && (
            <Link href={qs(page + 1)} className="min-h-[44px] rounded-xl border border-ink-600 px-4 py-2 text-sm font-semibold hover:bg-ink-800">
              Berikutnya
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
