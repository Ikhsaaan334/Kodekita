import type { TrackContent } from "./types";

export const go: TrackContent = {
  track: {
    slug: "go",
    name: "Go",
    tagline: "Bahasa sederhana yang dikompilasi cepat, cocok untuk belajar kode yang rapi sejak awal.",
    description:
      "Mulai dari mencetak teks dengan fmt.Println, mengelola variabel, membaca input, percabangan, perulangan, sampai menulis fungsi. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan Go: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-go",
          title: "Halo, Go",
          summary: "Cetak teks pertamamu dengan fmt.Println.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Setiap program Go punya tiga bagian wajib: `package main` di baris paling atas, `import \"fmt\"` untuk paket input dan output, lalu `func main` sebagai pintu masuk eksekusi. Program mulai berjalan dari baris pertama di dalam main.\n\nUntuk menampilkan sesuatu ke layar, panggil `fmt.Println` dan berikan teks yang ingin ditampilkan. Teks dalam Go ditulis di antara tanda kutip, dan Println otomatis pindah baris setelah selesai mencetak.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Halo, dunia!")\n    fmt.Println("Aku sedang belajar Go")\n}',
                caption: "Dua pemanggilan Println menghasilkan dua baris keluaran.",
              },
            },
            {
              kind: "quiz",
              question: "Setiap program Go wajib memiliki fungsi apa sebagai titik awal eksekusi?",
              options: ["start", "main", "init", "begin"],
              answer: 1,
              explanation:
                "Fungsi main di package main adalah pintu masuk program Go; compiler menjalankan isi fungsi itu lebih dulu. init hanya untuk persiapan paket, bukan titik awal program.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt: "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan fungsi cetak dari paket fmt.",
              mode: "fill",
              template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.___("Halo, dunia!")\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Halo, dunia!")\n}',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Paket fmt menyediakan fungsi cetak; namanya gabungan dari print dan line.",
                "Namanya Println: fmt.Println mencetak lalu otomatis pindah baris.",
              ],
            },
          ],
        },
        {
          slug: "variabel-tipe-data",
          title: "Variabel dan Tipe Data",
          summary: "Simpan angka dan teks ke dalam variabel, lalu gabungkan saat mencetak.",
          steps: [
            {
              kind: "theory",
              title: "Variabel: kotak bertipe untuk data",
              body: "Variabel di Go selalu punya tipe yang jelas. Cara terpendek mendeklarasikannya di dalam fungsi adalah `:=`, yang sekaligus mengisi nilai dan menyimpulkan tipe: `nama := \"Sinta\"` menjadi string, `umur := 17` menjadi int. Tipe dasar yang sering dipakai: `int` bilangan bulat, `float64` desimal, `string` teks, `bool` benar atau salah.\n\nSaat mencetak, `fmt.Println` menyisipkan satu spasi di antara argumen, jadi menggabungkan teks dan angka jadi ringkas.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nama := "Sinta"\n    umur := 17\n    fmt.Println(nama, "berumur", umur, "tahun")\n}',
                caption: "Keluarannya: Sinta berumur 17 tahun.",
              },
            },
            {
              kind: "quiz",
              question: "Di dalam fungsi, baris `umur := 17` sama artinya dengan?",
              options: ['var umur int = 17', "umur == 17", 'var umur string = "17"', "let umur = 17"],
              answer: 0,
              explanation:
                "`:=` mendeklarasikan variabel sekaligus mengisinya, dan tipenya disimpulkan dari nilai. Angka bulat 17 disimpulkan sebagai int, jadi bentuk panjangnya var umur int = 17.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang rusak",
              prompt: "Kode ini seharusnya mencetak `Sinta berumur 17 tahun`, tapi gagal dikompilasi. Ada satu nama yang salah tulis. Cari dan perbaiki, lalu jalankan.",
              mode: "fix",
              template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nama := "Sinta"\n    umur := 17\n    fmt.Println(nama, "berumur", umr, "tahun")\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nama := "Sinta"\n    umur := 17\n    fmt.Println(nama, "berumur", umur, "tahun")\n}',
              tests: [{ stdin: "", expectedOutput: "Sinta berumur 17 tahun" }],
              hints: [
                "Baca pesan error compiler: ada nama yang dianggap undefined (belum dideklarasikan).",
                "Variabelnya dideklarasikan sebagai umur, tapi yang dipanggil di dalam Println ditulis umr.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input lewat fmt.Scan, lalu balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "fmt.Scan: mendengarkan pengguna",
              body: "`fmt.Scan(&nilai)` membaca input dari stdin dan menaruhnya ke variabel. Tanda `&` memberi alamat variabel, supaya Scan tahu ke mana hasilnya harus disimpan. Scan memisahkan input berdasarkan spasi dan baris baru, jadi `fmt.Scan(&nama)` pada variabel string membaca satu kata.\n\nDi platform ini, input berasal dari kotak stdin saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var nama string\n    var umur int\n    fmt.Scan(&nama)\n    fmt.Scan(&umur)\n    fmt.Println("Tahun depan", nama, "berumur", umur+1)\n}',
                caption: "Input Sinta lalu 17 menghasilkan: Tahun depan Sinta berumur 18.",
              },
            },
            {
              kind: "quiz",
              question: "Mengapa fmt.Scan ditulis dengan tanda & seperti fmt.Scan(&umur)?",
              options: [
                "Agar Scan menerima alamat variabel dan bisa mengisi nilainya",
                "Agar nilai umur langsung dicetak ke layar",
                "Tanda & menandai bilangan positif",
                "Tanda & mengubah teks menjadi angka",
              ],
              answer: 0,
              explanation:
                "Scan perlu tahu ke memori mana hasil input ditulis. &umur adalah alamat variabel umur, sehingga Scan bisa mengisinya dengan nilai yang dibaca.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt: "Lengkapi program: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var nama string\n    fmt.___(&nama)\n    fmt.Printf("Halo, ___!\\n", nama)\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var nama string\n    fmt.Scan(&nama)\n    fmt.Printf("Halo, %s!\\n", nama)\n}',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Fungsi pembaca input dari paket fmt bernama Scan.",
                "Di dalam Printf, placeholder untuk teks (string) adalah %s.",
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
              body: "Percabangan di Go tidak memakai tanda kurung untuk kondisi, tapi kurung kurawalnya wajib. `if angka%2 == 0 { ... } else { ... }` dibaca: jika sisa bagi dua bernilai nol, kerjakan blok pertama, selain itu blok kedua.\n\nOperator yang sering dipakai: `==` sama dengan, `!=` tidak sama, `<` `>` `<=` `>=`, dan `%` sisa bagi yang pas untuk cek genap atau ganjil.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var angka int\n    fmt.Scan(&angka)\n\n    if angka%2 == 0 {\n        fmt.Println("genap")\n    } else {\n        fmt.Println("ganjil")\n    }\n}',
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
              prompt: "Program ini seharusnya membedakan genap dan ganjil, tapi compiler menolaknya. Kesalahannya ada di kondisi if. Perbaiki sampai semua tes lulus.",
              mode: "fix",
              template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var angka int\n    fmt.Scan(&angka)\n\n    if angka%2 = 0 {\n        fmt.Println("genap")\n    } else {\n        fmt.Println("ganjil")\n    }\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var angka int\n    fmt.Scan(&angka)\n\n    if angka%2 == 0 {\n        fmt.Println("genap")\n    } else {\n        fmt.Println("ganjil")\n    }\n}',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Pesan error compiler menunjuk baris if: tidak bisa mengisi nilai ke hasil hitungan angka % 2.",
                "Membandingkan ditulis dua tanda sama dengan (==). Satu tanda = artinya mengisi nilai.",
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
              body: "`for` adalah satu-satunya kata kunci perulangan di Go. Bentuk paling umum: `for i := 1; i <= 10; i++ { ... }` dengan tiga bagian: persiapan (`i := 1`), kondisi lanjut (`i <= 10`), dan langkah tiap putaran (`i++` artinya naik satu).\n\nBentuk lain: `for kondisi { ... }` tanpa titik koma, bekerja seperti while di bahasa lain.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    total := 0\n    for i := 1; i <= 10; i++ {\n        total += i\n    }\n    fmt.Println(total)\n}',
                caption: "Menjumlahkan 1 sampai 10, hasilnya 55, tanpa menulis sepuluh baris.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for i := 0; i < 3; i++ { ... }` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Tergantung isi blok"],
              answer: 1,
              explanation: "i bernilai 0, 1, 2, lalu berhenti saat i mencapai 3. Tiga nilai, tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Cetak hitungan 1 sampai 5",
              prompt: "Lengkapi program agar mencetak angka 1 sampai 5, satu per baris. Ganti tanda `___` dengan operator pembanding yang tepat.",
              mode: "fill",
              template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i ___ 5; i++ {\n        fmt.Println(i)\n    }\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        fmt.Println(i)\n    }\n}',
              tests: [{ stdin: "", expectedOutput: "1\n2\n3\n4\n5" }],
              hints: [
                "Perulangan harus masih berjalan saat i bernilai 5.",
                "Pakai i <= 5, karena i < 5 akan berhenti sebelum sempat mencetak 5.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Bungkus logika jadi blok yang bisa dipakai ulang dengan func.",
          steps: [
            {
              kind: "theory",
              title: "func: mendefinisikan sendiri perintah",
              body: "`func` mendefinisikan fungsi: nama, daftar parameter beserta tipenya, lalu tipe hasil yang dikembalikan. Nilai dikirim keluar lewat `return`, dan setelah didefinisikan, fungsi bisa dipanggil seperti fungsi bawaan.\n\nPisahkan urusan menghitung dari urusan mencetak: fungsi menghitung dan mengembalikan nilai, main yang memutuskan mencetaknya.",
              code: {
                language: "go",
                content: 'package main\n\nimport "fmt"\n\nfunc luas(panjang int, lebar int) int {\n    return panjang * lebar\n}\n\nfunc main() {\n    var p, l int\n    fmt.Scan(&p, &l)\n    fmt.Println(luas(p, l))\n}',
                caption: "Fungsi menghitung, program utama mencetak. Input 3 dan 4 menghasilkan 12.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari fungsi di Go?",
              options: ["print", "return", "send", "yield"],
              answer: 1,
              explanation: "`return` mengembalikan nilai ke pemanggil. fmt.Println hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Perbaiki fungsi sapaan",
              prompt: "Fungsi `sapa` seharusnya MENGEMBALIKAN teks `Halo, <nama>!` (yang mencetak cukup main saja, baris itu jangan diubah). Sekarang isinya malah mencetak sendiri dan tidak mengembalikan apa pun, sehingga compiler menolak. Perbaiki isinya sampai semua tes lulus.",
              mode: "fix",
              template: 'package main\n\nimport "fmt"\n\nfunc sapa(nama string) string {\n    fmt.Println("Halo, " + nama + "!")\n}\n\nfunc main() {\n    var nama string\n    fmt.Scan(&nama)\n    fmt.Println(sapa(nama))\n}',
              solution: 'package main\n\nimport "fmt"\n\nfunc sapa(nama string) string {\n    return "Halo, " + nama + "!"\n}\n\nfunc main() {\n    var nama string\n    fmt.Scan(&nama)\n    fmt.Println(sapa(nama))\n}',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "Pesan error compiler Go menyebut missing return: fungsi yang bertipe string wajib mengembalikan string.",
                "Ganti baris fmt.Println di dalam sapa menjadi: return \"Halo, \" + nama + \"!\"",
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
      starterCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var a, b int\n    fmt.Scan(&a, &b)\n    fmt.Println(___)\n}',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "Hasil penjumlahan dua variabel ditulis a + b.",
        "fmt.Println(a + b) sudah mencetak hasilnya diikuti pindah baris.",
      ],
      xpReward: 100,
    },
    {
      slug: "kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu kata, cetak kata yang sama dengan urutan huruf terbalik.\n\n**Format input**: satu kata tanpa spasi\n**Format output**: kata terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var teks string\n    fmt.Scan(&teks)\n    // cetak teks terbalik\n}',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Indeks terakhir string adalah len(teks) - 1, indeks pertama adalah 0.",
        "Pakai perulangan mundur: for i := len(teks) - 1; i >= 0; i--, lalu cetak tiap huruf dengan fmt.Print(string(teks[i])).",
        "Setelah perulangan, tutup dengan fmt.Println() supaya keluaran pindah baris.",
      ],
      xpReward: 100,
    },
    {
      slug: "hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu kata huruf kecil, hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Format input**: satu kata huruf kecil tanpa spasi\n**Format output**: satu angka, jumlah vokal\n\n**Contoh**: input `belajar` menjadi `3` (e, a, a)",
      starterCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var teks string\n    fmt.Scan(&teks)\n    // hitung vokalnya, lalu cetak jumlahnya\n}',
      tests: [
        { stdin: "belajar", expectedOutput: "3" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Siapkan penghitung: jumlah := 0, lalu iterasi tiap indeks: for i := 0; i < len(teks); i++.",
        "Ambil hurufnya: huruf := string(teks[i]), lalu bandingkan dengan tiap vokal memakai || (atau): if huruf == \"a\" || huruf == \"i\" dan seterusnya.",
        "Setiap kali vokal ketemu, naikkan dengan jumlah++. Di akhir, cetak dengan fmt.Println(jumlah).",
      ],
      xpReward: 150,
    },
    {
      slug: "statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat berikutnya. Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n\n    angka := make([]int, n)\n    for i := 0; i < n; i++ {\n        fmt.Scan(&angka[i])\n    }\n\n    // cetak min, max, dan rata-rata dua desimal\n}',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Siapkan variabel terkecil dan terbesar yang diawali angka[0], plus total := 0. Satu perulangan range cukup untuk mengisi ketiganya.",
        "Rata-rata butuh pembagian pecahan: rata := float64(total) / float64(n).",
        "Cetak dengan fmt.Printf: fmt.Printf(\"min: %d\\n\", terkecil) dan fmt.Printf(\"rata: %.2f\\n\", rata).",
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
        "Kamu diminta membuat program kasir kecil. Program membaca harga satuan barang, jumlah barang, dan persen diskon dari input, lalu menghitung total bayar.\n\nAturan diskon: total kotor (harga kali jumlah) dikurangi sesuai persen diskon. Semua data uji dijamin hasilnya bilangan bulat, jadi pembagian biasa sudah cukup tanpa pembulatan.\n\n**Format input**\nBaris 1: harga satuan (int)\nBaris 2: jumlah barang (int)\nBaris 3: persen diskon (int, 0 sampai 100)\n\n**Format output**\nSatu baris: total bayar (int)",
      steps: [
        {
          title: "Rancang input dan output",
          detail:
            "Tentukan tiga variabel input dan satu keluaran. Tulis kerangka program yang membaca ketiganya sekaligus dengan fmt.Scan.",
          hint: "var harga, jumlah, diskon int lalu satu pemanggilan fmt.Scan(&harga, &jumlah, &diskon) sudah cukup.",
        },
        {
          title: "Hitung total kotor",
          detail: "Kalikan harga satuan dengan jumlah barang, simpan di variabel totalKotor.",
          hint: "totalKotor := harga * jumlah",
        },
        {
          title: "Terapkan diskon",
          detail:
            "Kurangi total kotor sesuai persen diskon. Persen berarti per seratus: kalikan (100 - diskon) dulu, baru bagi 100, supaya hasilnya tetap bilangan bulat.",
          hint: "totalBayar := totalKotor * (100 - diskon) / 100",
        },
        {
          title: "Cetak dan uji dengan kasus nyata",
          detail:
            "Cetak total bayar. Uji dengan contoh: harga 25000, jumlah 3, diskon 20. Hasil yang benar: 60000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: "fmt.Println(totalBayar) mencetak angka diikuti pindah baris.",
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
