import type { TrackContent } from "./types";

export const c: TrackContent = {
  track: {
    slug: "c",
    name: "C",
    tagline: "Bahasa kecil yang dekat dengan mesin, fondasi untuk memahami cara kerja komputer.",
    description:
      "Mulai dari mencetak teks dengan printf, variabel dan tipe, membaca input dengan scanf, percabangan, perulangan, sampai menulis fungsi sendiri. Setiap pelajaran diakhiri dengan kode yang kamu jalankan dan tes sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan C: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-c",
          title: "Halo, C",
          summary: "Cetak teks pertamamu dengan printf.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Program C selalu mulai dari fungsi `main`. Untuk menampilkan teks, kita panggil `printf` dari pustaka `stdio.h` yang disertakan lewat `#include`. Teks ditulis di antara tanda kutip, dan `\\n` di akhir berarti pindah baris: printf tidak otomatis pindah baris seperti print di bahasa lain.\n\nBaris `return 0;` menutup main dan melaporkan program selesai dengan sukses.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint main(void) {\n    printf("Halo, dunia!\\n");\n    printf("Aku sedang belajar C\\n");\n    return 0;\n}',
                caption: "Tanpa \\n, keluaran berikutnya menyambung di baris yang sama.",
              },
            },
            {
              kind: "quiz",
              question: "Apa arti \\n di dalam printf?",
              options: ["Mencetak teks dua kali", "Pindah ke baris baru", "Menghapus layar", "Menutup program"],
              answer: 1,
              explanation: "`\\n` adalah karakter baris baru. Tanpa itu, keluaran berikutnya akan menyambung di baris yang sama.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt: "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` diikuti pindah baris. Ganti tanda `___` dengan fungsi cetak dari pustaka stdio.",
              mode: "fill",
              template: '#include <stdio.h>\n\nint main(void) {\n    ___("Halo, dunia!\\n");\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint main(void) {\n    printf("Halo, dunia!\\n");\n    return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Pustaka stdio.h menyediakan fungsi cetak bernama printf, singkatan dari print formatted.",
                "Bentuknya: printf(\"Halo, dunia!\\n\");, jangan lupa \\n dan titik koma di akhir.",
              ],
            },
          ],
        },
        {
          slug: "variabel-tipe-data",
          title: "Variabel dan Tipe Data",
          summary: "Deklarasikan variabel bertipe, lalu cetak isinya dengan penanda format.",
          steps: [
            {
              kind: "theory",
              title: "Variabel bertipe: kotak berlabel untuk data",
              body: "Setiap variabel di C harus dideklarasikan dengan tipenya: `int` bilangan bulat, `float` desimal, `char` satu karakter. Untuk teks, C memakai larik karakter: `char nama[] = \"Sinta\"`.\n\nSaat mencetak, printf butuh penanda format: `%d` untuk int, `%s` untuk teks, `%f` untuk desimal. Nilainya ditulis berurutan setelah teks, dipisah koma.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint main(void) {\n    char nama[] = "Sinta";\n    int umur = 17;\n    printf("%s berumur %d tahun\\n", nama, umur);\n    return 0;\n}',
                caption: "%s diganti isi nama, %d diganti isi umur, sesuai urutan argumen.",
              },
            },
            {
              kind: "quiz",
              question: "Penanda format apa yang dipakai printf untuk mencetak isi variabel int?",
              options: ["%s", "%d", "%f", "%c"],
              answer: 1,
              explanation: "`%d` untuk bilangan bulat. %s untuk teks, %f untuk desimal, %c untuk satu karakter.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang rusak",
              prompt: "Kode ini seharusnya mencetak `Sinta berumur 17 tahun`, tapi gagal dikompilasi. Ada satu nama yang salah tulis. Cari dan perbaiki, lalu jalankan.",
              mode: "fix",
              template: '#include <stdio.h>\n\nint main(void) {\n    char nama[] = "Sinta";\n    int umur = 17;\n    printf("%s berumur %d tahun\\n", nama, umr);\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint main(void) {\n    char nama[] = "Sinta";\n    int umur = 17;\n    printf("%s berumur %d tahun\\n", nama, umur);\n    return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "Sinta berumur 17 tahun" }],
              hints: [
                "Compiler C menyebut error umr undeclared: ada nama yang belum dideklarasikan.",
                "Variabelnya bernama umur, tapi argumen kedua printf ditulis umr.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input lewat scanf, lalu balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "scanf: mendengarkan pengguna",
              body: "`scanf` membaca input dari stdin dan menaruhnya ke variabel. Ia butuh alamat variabel, itulah gunanya tanda `&`: `scanf(\"%d\", &umur)` berarti baca satu bilangan lalu simpan di umur.\n\nUntuk satu kata teks, pakai `scanf(\"%s\", nama)` tanpa tanda &, karena nama sudah berupa alamat lariknya. Di platform ini, input berasal dari kotak stdin saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint main(void) {\n    char nama[50];\n    int umur;\n    scanf("%s", nama);\n    scanf("%d", &umur);\n    printf("Tahun depan %s berumur %d\\n", nama, umur + 1);\n    return 0;\n}',
                caption: "Input Sinta lalu 17 menghasilkan: Tahun depan Sinta berumur 18.",
              },
            },
            {
              kind: "quiz",
              question: "Mengapa scanf(\"%d\", &umur) memakai tanda &?",
              options: [
                "Agar scanf menerima alamat variabel dan bisa mengisi nilainya",
                "Agar nilai umur langsung dicetak ke layar",
                "Tanda & menandai bilangan positif",
                "Tanda & mengubah teks menjadi angka",
              ],
              answer: 0,
              explanation:
                "scanf perlu tahu ke memori mana hasil pembacaan ditulis. &umur memberi alamat variabel umur ke scanf.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt: "Lengkapi program: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template: '#include <stdio.h>\n\nint main(void) {\n    char nama[50];\n    scanf(___, nama);\n    printf("Halo, %s!\\n", nama);\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint main(void) {\n    char nama[50];\n    scanf("%s", nama);\n    printf("Halo, %s!\\n", nama);\n    return 0;\n}',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Format untuk membaca satu kata teks adalah %s.",
                "Barisnya menjadi: scanf(\"%s\", nama);, tanpa tanda & karena nama sudah berupa alamat larik.",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Alur Program",
      description: "Buat program yang mengambil keputusan, mengulang pekerjaan, dan dibagi menjadi fungsi.",
      lessons: [
        {
          slug: "percabangan-if",
          title: "Percabangan if",
          summary: "Program yang bisa memilih: if dan else.",
          steps: [
            {
              kind: "theory",
              title: "Berpilih sesuai kondisi",
              body: "Percabangan C memakai `if` dengan kondisi di dalam tanda kurung, dan isi blok dibungkus kurung kurawal. `else` menampung kasus selainnya.\n\nOperator perbandingan yang sering dipakai: `==` sama dengan, `!=` tidak sama, `<` `>` `<=` `>=`, dan `%` sisa bagi yang pas untuk cek genap atau ganjil.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint main(void) {\n    int angka;\n    scanf("%d", &angka);\n    if (angka % 2 == 0) {\n        printf("genap\\n");\n    } else {\n        printf("ganjil\\n");\n    }\n    return 0;\n}',
                caption: "% 2 == 0 berarti angka habis dibagi dua.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran program di atas jika input-nya `7`?",
              options: ["genap", "ganjil", "7", "Error"],
              answer: 1,
              explanation: "7 % 2 hasilnya 1, jadi kondisi == 0 salah, program masuk ke blok else dan mencetak ganjil.",
            },
            {
              kind: "code",
              title: "Genap atau ganjil",
              prompt: "Program ini seharusnya membedakan genap dan ganjil, tapi compiler menolaknya. Ada satu karakter yang salah di kondisi if. Perbaiki sampai semua tes lulus.",
              mode: "fix",
              template: '#include <stdio.h>\n\nint main(void) {\n    int angka;\n    scanf("%d", &angka);\n    if (angka % 2 = 0) {\n        printf("genap\\n");\n    } else {\n        printf("ganjil\\n");\n    }\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint main(void) {\n    int angka;\n    scanf("%d", &angka);\n    if (angka % 2 == 0) {\n        printf("genap\\n");\n    } else {\n        printf("ganjil\\n");\n    }\n    return 0;\n}',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Pesan error compiler menyebut lvalue required di baris if: kamu tidak bisa mengisi nilai ke hasil hitungan.",
                "Sama dengan untuk membandingkan ditulis dua kali: ==. Satu tanda = artinya mengisi nilai.",
              ],
            },
          ],
        },
        {
          slug: "perulangan-for",
          title: "Perulangan for",
          summary: "Ulangi pekerjaan dengan for tanpa menulis ulang kode.",
          steps: [
            {
              kind: "theory",
              title: "for: hitung tanpa capek",
              body: "`for` mengulang blok kode dengan tiga bagian di dalam kurung: persiapan, kondisi lanjut, dan langkah tiap putaran. `for (int i = 1; i <= 5; i++)` berarti mulai dari 1, lanjut selama i kurang dari sama dengan 5, naik satu tiap putaran. `i++` adalah singkatan dari i = i + 1.\n\nKalau hanya punya kondisi, pakai `while`: perulangannya jalan selama kondisi itu benar.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i <= 10; i++) {\n        total += i;\n    }\n    printf("%d\\n", total);\n    return 0;\n}',
                caption: "Menjumlahkan 1 sampai 10, hasilnya 55.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for (int i = 0; i < 3; i++) { ... }` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Tergantung isi blok"],
              answer: 1,
              explanation: "i bernilai 0, 1, 2, lalu berhenti saat i mencapai 3. Tiga nilai, tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Cetak hitungan 1 sampai 5",
              prompt: "Lengkapi program agar mencetak angka 1 sampai 5, satu per baris. Ada dua bagian yang hilang: operator pembanding dan langkah tiap putaran.",
              mode: "fill",
              template: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i ___ 5; ___) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "1\n2\n3\n4\n5" }],
              hints: [
                "Perulangan harus masih berjalan saat i bernilai 5, jadi pembandingnya <=.",
                "Langkah tiap putaran menaikkan i satu angka: tulis i++.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Definisikan fungsi sendiri di atas main dan kembalikan nilainya.",
          steps: [
            {
              kind: "theory",
              title: "Fungsi di atas main",
              body: "Fungsi di C didefinisikan dengan tipe hasil, nama, dan parameter bertipe: `int luas(int panjang, int lebar)`. Hasil dikirim keluar lewat `return`.\n\nDefinisikan fungsi di ATAS main, karena compiler C membaca berurutan dan harus mengenal fungsi sebelum ia dipanggil. Pisahkan urusan menghitung dari urusan mencetak: fungsi menghitung dan mengembalikan nilai, main yang mencetak.",
              code: {
                language: "c",
                content: '#include <stdio.h>\n\nint luas(int panjang, int lebar) {\n    return panjang * lebar;\n}\n\nint main(void) {\n    int p, l;\n    scanf("%d %d", &p, &l);\n    printf("%d\\n", luas(p, l));\n    return 0;\n}',
                caption: "Fungsi menghitung, main mencetak. Input 3 dan 4 menghasilkan 12.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari fungsi di C?",
              options: ["printf", "return", "send", "yield"],
              answer: 1,
              explanation: "`return` mengembalikan nilai ke pemanggil. printf hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Perbaiki fungsi luas",
              prompt: "Fungsi `luas` seharusnya menghitung luas persegi panjang, panjang kali lebar. Program ini bisa jalan, tapi hasilnya salah: input 3 dan 4 mencetak 7, bukan 12. Perbaiki satu karakternya sampai semua tes lulus.",
              mode: "fix",
              template: '#include <stdio.h>\n\nint luas(int panjang, int lebar) {\n    return panjang + lebar;\n}\n\nint main(void) {\n    int p, l;\n    scanf("%d %d", &p, &l);\n    printf("%d\\n", luas(p, l));\n    return 0;\n}',
              solution: '#include <stdio.h>\n\nint luas(int panjang, int lebar) {\n    return panjang * lebar;\n}\n\nint main(void) {\n    int p, l;\n    scanf("%d %d", &p, &l);\n    printf("%d\\n", luas(p, l));\n    return 0;\n}',
              tests: [
                { stdin: "3\n4", expectedOutput: "12" },
                { stdin: "5\n2", expectedOutput: "10" },
              ],
              hints: [
                "Uji dulu dengan 3 dan 4: hasil 7 adalah hasil penjumlahan, bukan perkalian.",
                "Ganti operator + di dalam luas menjadi * (kali).",
              ],
            },
          ],
        },
      ],
    },
  ],
  challenges: [
    {
      slug: "jumlah-dua-angka",
      title: "Jumlah Dua Angka",
      difficulty: "mudah",
      statement:
        "Baca dua bilangan bulat dari input (satu per baris), lalu cetak jumlahnya.\n\n**Format input**\nBaris 1: bilangan pertama\nBaris 2: bilangan kedua\n\n**Format output**\nSatu baris: hasil penjumlahan\n\n**Contoh**\nInput: `3` dan `4` menjadi `7`",
      starterCode: '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    /* cetak jumlahnya */\n    return 0;\n}',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "Hasil penjumlahan ditulis a + b di dalam printf.",
        "Cetak bilangan bulat dengan %d dan akhiri dengan \\n: printf(\"%d\\n\", a + b);",
      ],
      xpReward: 100,
    },
    {
      slug: "kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu kata, cetak kata yang sama dengan urutan huruf terbalik.\n\n**Format input**: satu kata tanpa spasi\n**Format output**: kata terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode: '#include <stdio.h>\n\nint main(void) {\n    char teks[100];\n    scanf("%s", teks);\n    /* cetak teks terbalik */\n    return 0;\n}',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Cari panjang kata dulu. Paling ringkas pakai strlen(teks) dari pustaka string.h, tambahkan #include <string.h> di atas.",
        "Perulangan mundur: for (int i = n - 1; i >= 0; i--), lalu cetak tiap huruf dengan printf(\"%c\", teks[i]);",
        "Setelah perulangan, tutup dengan printf(\"\\n\"); supaya keluaran berhenti di barisnya sendiri.",
      ],
      xpReward: 100,
    },
    {
      slug: "hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu kata huruf kecil, hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Format input**: satu kata huruf kecil tanpa spasi\n**Format output**: satu angka, jumlah vokal\n\n**Contoh**: input `belajar` menjadi `3` (e, a, a)",
      starterCode: '#include <stdio.h>\n\nint main(void) {\n    char teks[100];\n    int jumlah = 0;\n    scanf("%s", teks);\n    /* hitung vokalnya, lalu cetak jumlahnya */\n    return 0;\n}',
      tests: [
        { stdin: "belajar", expectedOutput: "3" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Iterasi dari indeks 0 sampai tanda akhir string: for (int i = 0; teks[i] != '\\0'; i++).",
        "Bandingkan satu karakter memakai tanda kutip tunggal dan || (atau): if (teks[i] == 'a' || teks[i] == 'i') dan seterusnya.",
        "Setiap kali vokal ketemu, jumlah++. Di akhir, cetak dengan printf(\"%d\\n\", jumlah);",
      ],
      xpReward: 150,
    },
    {
      slug: "statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat berikutnya (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\nAsumsikan `n` paling banyak 100.\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n\n    int angka[100];\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &angka[i]);\n    }\n\n    /* cetak min, max, dan rata-rata dua desimal */\n    return 0;\n}',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Siapkan int terkecil = angka[0];, int terbesar = angka[0]; dan int total = 0;. Satu perulangan cukup untuk mengisi ketiganya.",
        "Rata-rata harus dibagi sebagai pecahan: (double) total / n, karena total / n bulat dan membulatkan ke bawah.",
        "Cetak dengan printf(\"min: %d\\n\", terkecil); dan printf(\"rata: %.2f\\n\", (double) total / n);",
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "kalkulator-diskon",
      title: "Kalkulator Diskon Kasir",
      summary: "Program struk sederhana: hitung total belanja lalu terapkan diskon.",
      brief:
        "Kamu diminta membuat program kasir kecil. Program membaca harga satuan barang, jumlah barang, dan persen diskon dari input, lalu menghitung total bayar.\n\nAturan diskon: total kotor (harga kali jumlah) dikurangi sesuai persen diskon. Semua data uji dijamin hasilnya bilangan bulat, jadi pembagian bulat biasa sudah cukup tanpa pembulatan.\n\n**Format input**\nBaris 1: harga satuan (int)\nBaris 2: jumlah barang (int)\nBaris 3: persen diskon (int, 0 sampai 100)\n\n**Format output**\nSatu baris: total bayar (int)",
      steps: [
        {
          title: "Rancang input dan output",
          detail:
            "Tentukan tiga variabel input dan satu keluaran. Tulis kerangka program yang membaca ketiganya sekaligus dengan satu scanf.",
          hint: 'int harga, jumlah, diskon; lalu scanf("%d %d %d", &harga, &jumlah, &diskon);, jangan lupa & di depan tiap variabel.',
        },
        {
          title: "Hitung total kotor",
          detail: "Kalikan harga satuan dengan jumlah barang, simpan di variabel totalKotor.",
          hint: "int totalKotor = harga * jumlah;",
        },
        {
          title: "Terapkan diskon",
          detail:
            "Kurangi total kotor sesuai persen diskon. Persen berarti per seratus: kalikan (100 - diskon) dulu, baru bagi 100, supaya hasilnya tetap bilangan bulat.",
          hint: "int totalBayar = totalKotor * (100 - diskon) / 100;",
        },
        {
          title: "Cetak dan uji dengan kasus nyata",
          detail:
            "Cetak total bayar. Uji dengan contoh: harga 25000, jumlah 3, diskon 20. Hasil yang benar: 60000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: 'printf("%d\\n", totalBayar);',
        },
      ],
      finalTests: [
        { stdin: "25000\n3\n20", expectedOutput: "60000" },
        { stdin: "10000\n2\n0", expectedOutput: "20000" },
        { stdin: "15000\n4\n25", expectedOutput: "45000" },
      ],
      xpReward: 300,
    },
  ],
};
