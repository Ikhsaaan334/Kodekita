// Kontrak konten kursus. Semua file bahasa di prisma/content/ mengikuti bentuk ini.

export type TestCase = {
  stdin: string;
  expectedOutput: string;
  hidden?: boolean; // true = test kasus tidak ditampilkan detailnya ke user
};

export type CodeStep = {
  kind: "code";
  title: string;
  prompt: string; // instruksi untuk user (markdown ringkas)
  mode: "fill" | "fix"; // fill = lengkapi kode, fix = perbaiki kode yang salah
  template: string; // kode awal di editor (fill: mengandung ___ ; fix: mengandung bug)
  solution: string; // solusi referensi (tidak pernah dikirim ke client)
  tests: TestCase[];
  hints: string[]; // urutan hint, makin akhir makin jelas
};

export type TheoryStep = {
  kind: "theory";
  title: string;
  body: string; // markdown ringkas (paragraf, list, inline code)
  code?: { language: string; content: string; caption?: string };
};

export type QuizStep = {
  kind: "quiz";
  question: string;
  options: string[];
  answer: number; // index opsi benar
  explanation: string;
};

export type Step = TheoryStep | QuizStep | CodeStep;

export type LessonContent = {
  slug: string;
  title: string;
  summary: string;
  xpReward?: number;
  steps: Step[];
};

export type ModuleContent = {
  title: string;
  description: string;
  lessons: LessonContent[];
};

export type ChallengeContent = {
  slug: string;
  title: string;
  difficulty: "mudah" | "sedang" | "sulit";
  statement: string; // markdown: deskripsi, format input, format output, contoh
  starterCode: string;
  tests: TestCase[];
  hints: string[];
  xpReward?: number;
};

export type ProjectStepContent = {
  title: string;
  detail: string;
  hint?: string;
};

export type ProjectContent = {
  slug: string;
  title: string;
  summary: string;
  brief: string; // markdown
  steps: ProjectStepContent[];
  finalTests?: TestCase[];
  xpReward?: number;
};

export type TrackContent = {
  track: {
    slug: string;
    name: string;
    tagline: string;
    description: string;
  };
  modules: ModuleContent[];
  challenges: ChallengeContent[];
  projects: ProjectContent[];
};

/**
 * Tantangan algoritma lintas-bahasa (koleksi ala LeetCode): satu soal,
 * dikerjakan di bahasa pilihan user. Starter disediakan per bahasa, dan
 * refSolution (python) hanya untuk verifikasi mesin saat build konten.
 */
export type GlobalChallengeContent = {
  slug: string;
  title: string;
  difficulty: "mudah" | "sedang" | "sulit";
  statement: string; // markdown; wajib menyebut format input/output + sumber asli
  tests: TestCase[];
  hints: string[];
  xpReward?: number;
  lcRef?: string; // nomor + nama soal LeetCode aslinya
  refSolution: string; // python, untuk scripts/verify-algoritma.ts
};

// ==== bentuk lesson lintas-bahasa: satu lesson, isi berganti sesuai bahasa pilihan user ====

export type LangMap<T> = Record<string, T>;

export type AgnosticTheoryStep = {
  kind: "theory";
  title: string;
  bodyByLang: LangMap<string>;
  codeByLang: LangMap<{ content: string; caption?: string }>;
};

export type AgnosticQuizStep = {
  kind: "quiz";
  byLang: LangMap<{ question: string; options: string[]; answer: number; explanation: string }>;
};

export type AgnosticCodeStep = {
  kind: "code";
  title: string;
  tests: TestCase[]; // dibagi semua bahasa: soalnya sama, bahasanya bebas
  byLang: LangMap<{
    mode: "fill" | "fix";
    prompt: string;
    template: string;
    solution: string;
    hints: string[];
  }>;
};

export type AgnosticStep = AgnosticTheoryStep | AgnosticQuizStep | AgnosticCodeStep;

export type AgnosticLessonContent = {
  slug: string;
  title: string;
  summary: string;
  xpReward?: number;
  steps: AgnosticStep[];
};

export type GlobalProjectContent = {
  slug: string;
  title: string;
  summary: string;
  brief: string;
  steps: ProjectStepContent[];
  finalTests: TestCase[];
  refSolution: string; // python, untuk verifikasi mesin
  xpReward?: number;
};

// ==== jalur mendalam per bahasa: konten tunggal-bahasa, dibungkus jadi agnostic saat seed ====

export type JalurLesson = {
  slug: string;
  title: string;
  summary: string;
  xpReward?: number;
  steps: Step[]; // bentuk tunggal-bahasa (theory/quiz/code); dinormalisasi saat seed
};

export type JalurBagian = {
  lang: string; // slug bahasa, mis. "python"
  /** index modul 0..9 yang dicover bagian ini; setiap bagian = 2 modul = 20 lesson */
  moduleRange: [number, number];
  modules: { title: string; description: string }[];
  lessons: JalurLesson[];
};
