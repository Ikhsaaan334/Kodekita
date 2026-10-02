# DESIGN.md — KodeKita (judul kerja, nama bisa diganti pemilik)

> Status arah: bagian "Brief pemilik" adalah kata-kata pemilik produk (sumber arah). Bagian lain adalah turunan dari brief itu, dan setiap keputusan wajib punya alasan satu baris (R-31). Pemilik boleh mengubah kapan saja.

## Brief pemilik (sumber arah, 2026-09-29)

- Tema aplikasi: "fancy dengan banyak animasi yang membuat fancy dan smooth sehingga enak dipandang mata"
- Produk: platform SaaS belajar coding interaktif: kursus lengkap, tantangan ala LeetCode, latihan proyek, lengkapi kode, perbaiki kode yang salah, hint saat bingung
- Bahasa: Go, Python, PHP, C, C++, C#, Java
- Profil: foto profil (boleh GIF), warna nama + efek nama (normal, pixel, glitch)
- Antarmuka berbahasa Indonesia

## Design Read

Membaca ini sebagai: aplikasi belajar coding interaktif untuk pemula dan pelajar Indonesia, dengan bahasa visual "fancy hangat" (ink hangat + emas + motion teroreografi), dial ENERGY 3 / RHYTHM 2 / MOTION 3.

## Dial (wajib, lihat docs/antislop.md Part 3)

- **ENERGY 3**: brief pemilik minta fancy; produk menyambut pemula yang gugup, bukan membatu seperti alat internal.
- **RHYTHM 2**: area kerja (lesson, editor) konsisten supaya tidak melelahkan saat sesi panjang; variasi komposisi di momen naratif (landing, halaman track, perayaan selesai).
- **MOTION 3**: brief pemilik minta banyak animasi smooth. Semua motion mengikat ke aksi user atau pengalihan perhatian: micro-interaction spring, entrance teroreografi, feedback XP dan sukses. Tanpa loop idle kecuali efek nama yang dipilih user sendiri.

## Palet (2 warna inti + 1 aksen, R-29)

| Peran | Nilai | Alasan satu baris |
|---|---|---|
| Dasar | ink hangat `#101014`, permukaan `#17171E` | produk padat kode; gelap hangat nyaman untuk sesi panjang, alasan produk bukan gaya (R-21) |
| Teks | putih gading `#F2EFE9`, sekunder `#A8A29E` | kontras AA di atas ink (R-25) |
| Aksen (satu-satunya) | emas `#E9B44C` | "fancy" versi produk: mewah hangat, bukan neon; hanya di momen fokus (CTA utama, XP, focal point) |
| Semantik | hijau `#4ADE80` (lulus), merah `#F87171` (gagal) | informasi status, bukan dekorasi |

- Dilarang: gradien biru-ungu, glow merambat, glassmorphism lebih dari 1-2 elemen, palet pelangi (R-01, R-10, R-13).
- Warna nama user (fitur kustomisasi) adalah konten user, bukan palet UI; tetap wajib lolos kontras di atas ink.
- Warna sintaks di editor kode melayani keterbacaan kode (konten), bukan palet UI chrome.

## Tipografi (R-06)

- Display + UI: **Bricolage Grotesque**. Alasan: berkarakter dan hangat (fancy tanpa jadi default Inter/Geist), punya rentang weight penuh untuk hierarki.
- Kode: **IBM Plex Mono**. Alasan: mono hangat yang serasi dengan emas, bukan mono default (JetBrains/Fira).
- Efek nama "pixel": **Silkscreen**. Alasan fungsional: fitur efek pixel memang butuh font bitmap; tidak dipakai di UI lain.

## Bentuk & elevasi

- Skala radius: 6px (input, chip), 12px (kartu, tombol), 20px (panel besar, modal). Pill hanya untuk avatar dan tag status (R-11: radius sebagai hierarki).
- Shadow hanya untuk overlay (dropdown, modal, toast) dan kartu yang sedang aktif; sisanya flat (R-12).
- Glass hanya di navbar utama, satu elemen itu saja (R-10).
- Glow default: tidak ada. Satu pengecualian: burst emas saat momen sukses (XP/lulus tes), sebagai satu fokus perayaan (R-13).

## Motion system (R-19)

- Spring untuk micro-interaction (hover, tap): stiffness 300, damping 24, durasi ± 200ms.
- Entrance teroreografi: stagger 40ms per item, fade + naik 12px, hanya sekali saat masuk viewport.
- Transisi halaman: fade + geser 240ms.
- Feedback pencapaian: angka XP menghitung naik + burst emas sekali.
- Motif identitas: **caret berkedip** (kursor teks). Dipakai di logo, hero, dan state mengetik. Alasan: tanda mengetik yang hidup, spesifik produk belajar mengetik kode, dan menandai state nyata (fokus input / animasi ketik).
- `prefers-reduced-motion`: matikan entrance dan loop; sisakan transisi opacity cepat.
- Dilarang: loop idle tanpa pemicu (kecuali efek nama glitch/pixel yang dipilih user, loop pendek dan hormat reduced-motion).

## Ikon & ilustrasi (R-04, R-22)

- Set ikon: **Phosphor**, weight `duotone` untuk ilustratif dan `bold` untuk UI fungsional. Alasan: bobot visualnya hangat dan khas, bukan thin-stroke default; ikon dipilih relevan dengan kontennya, bukan sparkle/star generik.
- Tanpa ilustrasi generik; visual produk memakai cuplikan produk nyata (editor, hasil tes) atau tidak sama sekali.

## Komposisi & copy

- Landing dibangun dari konten nyata: demo kode yang benar-benar bisa dijalankan, contoh tipe latihan yang benar-benar bisa dicoba. Tanpa testimoni, tanpa statistik, tanpa FAQ, tanpa logo bar: belum ada data nyata (R-17, R-18, R-28, R-38).
- CTA spesifik konteks: "Buat Akun Gratis", "Lanjutkan ke Modul 2", "Jalankan Kode" (R-15).
- Copy Indonesia yang natural; tanpa em dash (R-02), tanpa buzzword (R-16).
- Setiap layar punya satu focal point; aksen emas hanya di situ (core Part 3).

## Pengecualian tercatat

- Tema gelap tanpa toggle: alasan produk (editor kode, sesi panjang). Toggle terang/gelap masuk roadmap bila pemilik mau; bila di ships, kedua mode wajib utuh (R-34).
- Nama produk "KodeKita" adalah judul kerja yang kutandai sebagai placeholder; pemilik bebas mengganti (R-23).
