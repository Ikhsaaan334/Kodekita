import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AdminUserActions } from "@/components/admin/AdminUserActions";

export const dynamic = "force-dynamic";

export default async function AdminDetailPenggunaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") notFound();

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      banned: true,
      xp: true,
      streakCount: true,
      preferredLang: true,
      avatarUrl: true,
      createdAt: true,
      lastActiveAt: true,
    },
  });
  if (!user) notFound();

  const [lessonSelesai, totalSubmission, lulus, submissions] = await Promise.all([
    db.lessonProgress.count({ where: { userId: user.id, completed: true } }),
    db.submission.count({ where: { userId: user.id } }),
    db.submission.count({ where: { userId: user.id, passed: true } }),
    db.submission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { challenge: { select: { title: true, slug: true } } },
    }),
  ]);

  const stat = [
    { label: "Total XP", nilai: user.xp.toLocaleString("id-ID") },
    { label: "Streak", nilai: `${user.streakCount} hari` },
    { label: "Pelajaran tuntas", nilai: String(lessonSelesai) },
    { label: "Submission", nilai: `${lulus}/${totalSubmission} lulus` },
  ];

  return (
    <div>
      <Link href="/admin/pengguna" className="text-sm text-gading-500 transition-colors hover:text-gading-50">
        Daftar pengguna
      </Link>
      <header className="mt-2 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight">{user.username}</h2>
        {user.role === "admin" && (
          <span className="rounded-full border border-emas-500/50 px-2.5 py-1 font-code text-[0.65rem] uppercase text-emas-400">admin</span>
        )}
        {user.banned && (
          <span className="rounded-full border border-gagal/40 px-2.5 py-1 font-code text-[0.65rem] uppercase text-gagal">dibekukan</span>
        )}
      </header>
      <p className="mt-1 text-sm text-gading-500">
        {user.email} , terdaftar {new Date(user.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })} , bahasa utama {user.preferredLang}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stat.map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
            <dt className="font-code text-[0.65rem] uppercase tracking-wide text-gading-500">{s.label}</dt>
            <dd className="mt-1 font-code text-lg font-semibold text-emas-400">{s.nilai}</dd>
          </div>
        ))}
      </dl>

      <section aria-label="Aksi admin" className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Aksi</h3>
        <AdminUserActions
          userId={user.id}
          username={user.username}
          banned={user.banned}
          xp={user.xp}
          isAdmin={user.role === "admin"}
          isSelf={user.id === admin.id}
        />
      </section>

      <section aria-label="Submission terakhir" className="mt-10">
        <h3 className="mb-3 text-lg font-bold">Submission terakhir</h3>
        {submissions.length === 0 ? (
          <p className="rounded-xl border border-ink-600 bg-ink-800/40 p-4 text-sm text-gading-500">Belum ada submission.</p>
        ) : (
          <ul className="divide-y divide-ink-700 rounded-2xl border border-ink-600 bg-ink-800/40">
            {submissions.map((s) => (
              <li key={s.id} className="p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 font-code text-[0.65rem] uppercase ${
                      s.passed ? "border border-lulus/40 text-lulus" : "border border-gagal/40 text-gagal"
                    }`}
                  >
                    {s.passed ? "lulus" : "gagal"}
                  </span>
                  <span className="font-semibold text-gading-50">{s.challenge?.title ?? "tanpa tantangan"}</span>
                  <span className="font-code text-xs text-gading-500">{s.language}</span>
                  <span className="ml-auto font-code text-xs text-gading-500">
                    {new Date(s.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gading-500 hover:text-gading-300">lihat kode</summary>
                  <pre className="mt-1 max-h-48 overflow-auto rounded-lg bg-ink-950 p-3 font-code text-xs text-gading-300">{s.code}</pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
