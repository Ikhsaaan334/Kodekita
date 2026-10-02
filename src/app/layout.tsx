import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Silkscreen } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-silkscreen",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KodeKita, belajar coding dengan mengetik kode",
    template: "%s | KodeKita",
  },
  description:
    "Kursus coding interaktif berbahasa Indonesia: pelajaran bertahap, tantangan ala LeetCode, proyek, dan kode yang dieksekusi langsung. Go, Python, PHP, C, C++, C#, dan Java.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${bricolage.variable} ${plexMono.variable} ${silkscreen.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
