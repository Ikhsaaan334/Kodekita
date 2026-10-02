import Link from "next/link";
import { db } from "@/lib/db";
import { availabilityMap } from "@/lib/runner";
import { LANG_IDS, LANGUAGES } from "@/lib/languages";
import { JudgeTestButton } from "@/components/admin/JudgeTestButton";
import { AnnouncementManager } from "@/components/admin/AnnouncementManager";
import { SeedButton } from "@/components/admin/SeedButton";

export const dynamic = "force-dynamic";

function angka(n: number) {
  return n.toLocaleString("id-ID");
}

export default async function AdminRingkasanPage() {
  const batas7hari = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const batasHariIni = new Date();
  batasHariIni.setHours(0, 0, 0, 0);

  const [
    totalUser,
    aktif7Hari,
    aktifHariIni,
    totalSubmission,
    submissionLulus,
    progressCount,
    totalMateri,
    avail,
    pengumuman,
    log,
    totalTantangan,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { lastActiveAt: { gte: batas7hari } } }),
    db.user.count({ where: { lastActiveAt: { gte: batasHariIni } } }),
    db.submission.count(),
    db.submission.count({ where: { passed: true } }),
    db.lessonProgress.count(),
    db.lesson.count(),
    availabilityMap(),
    db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.adminAction.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.challenge.count(),
  ]);

  const passRate = totalSubmission > 0 ? Math.round((submissionLulus / totalSubmission) * 100) : 0;

  const kartu = [
    { label: "Total pengguna", nilai: angka(totalUser) },
    { label: "Aktif 7 hari", nilai: angka(aktif7Hari) },
    { label: "Aktif hari ini", nilai: angka(aktifHariIni) },
    { label: "Submission", nilai: angka(totalSubmission) },
    { label: "Tingkat lulus", nilai: `${passRate}%` },
    { label: "Progres materi", nilai: angka(progressCount) },
  ];

  return (
    <div className="space-y-10">
      <section aria-label="Ringkasan sistem">
        <h2 className="mb-4 text-xl font-bold">Ringkasan sistem</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kartu.map((k) => (
            <div key={k.label} className="rounded-xl border border-ink-600 bg-ink-800/40 p-4">
              <dt className="font-code text-[0.65rem] uppercase tracking-wide text-gading-500">{k.label}</dt>
              <dd className="mt-1 font-code text-xl font-semibold text-emas-400">{k.nilai}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-code text-xs text-gading-500">
          Konten: {angka(totalMateri)} materi, {angka(totalTantangan)} tantangan. Semua angka dihitung langsung dari database.
        </p>
      </section>

      <section aria-label="Status judge">
        <h2 className="mb-4 text-xl font-bold">Status judge eksekusi kode</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {LANG_IDS.map((l) => {
            const s = avail[l];
            return (
              <li key={l} className="flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/40 px-4 py-3">
                <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${s.available ? "bg-lulus" : "bg-gagal"}`} />
                <span className="font-code text-sm font-semibold">{LANGUAGES[l].label}</span>
                <span className="ml-auto font-code text-[0.65rem] uppercase text-gading-500">
                  {s.available ? s.backend : "tidak aktif"}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <p className="mb-2 text-sm text-gading-300">Tes eksekusi nyata per bahasa:</p>
          <JudgeTestButton langs={LANG_IDS} />
        </div>
      </section>

      <section aria-label="Pengumuman">
        <h2 className="mb-4 text-xl font-bold">Pengumuman</h2>
        <AnnouncementManager
          items={pengumuman.map((a) => ({ id: a.id, title: a.title, body: a.body, active: a.active }))}
        />
      </section>

      <section aria-label="Operasi konten">
        <h2 className="mb-4 text-xl font-bold">Operasi konten</h2>
        <SeedButton />
      </section>

      <section aria-label="Log aksi admin">
        <h2 className="mb-4 text-xl font-bold">Log aksi admin</h2>
        {log.length === 0 ? (
          <p className="rounded-xl border border-ink-600 bg-ink-800/40 p-4 text-sm text-gading-500">
            Belum ada aksi admin yang tercatat.
          </p>
        ) : (
          <ul className="divide-y divide-ink-700 rounded-2xl border border-ink-600 bg-ink-800/40">
            {log.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                <span className="font-code text-xs text-gading-500">
                  {new Date(a.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                </span>
                <span className="font-semibold text-gading-50">{a.adminUsername}</span>
                <span className="rounded-full border border-emas-500/40 px-2 py-0.5 font-code text-[0.65rem] uppercase text-emas-400">
                  {a.action}
                </span>
                {a.targetUsername && <span className="text-gading-300">pada {a.targetUsername}</span>}
                {a.detail && <span className="text-gading-500">({a.detail})</span>}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-sm text-gading-500">
          Butuh olah data mentah? Panel bawaan Supabase (Table Editor) tetap tersedia untuk kebutuhan luar biasa.
        </p>
        <Link href="/admin/pengguna" className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-ink-500 px-5 text-sm font-semibold transition-colors hover:bg-ink-800">
          Kelola pengguna
        </Link>
      </section>
    </div>
  );
}
