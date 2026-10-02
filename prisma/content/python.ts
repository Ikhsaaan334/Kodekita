import type { TrackContent } from "./types";

export const python: TrackContent = {
  track: {
    slug: "python",
    name: "Python",
    tagline: "Bahasa paling ramah untuk pemula, dari nol sampai bisa membangun program sendiri.",
    description:
      "Mulai dari mencetak teks, mengelola variabel, membaca input, percabangan, perulangan, sampai menulis fungsi. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan Python: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-python",
          title: "Halo, Python",
          summary: "Cetak teks pertamamu dengan fungsi print.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Setiap program Python mulai berjalan dari baris paling atas. Untuk menampilkan sesuatu ke layar, kita panggil fungsi `print` dan memberinya teks yang ingin ditampilkan. Teks dalam Python ditulis di antara tanda kutip.\n\nCoba perhatikan contoh di bawah, lalu bayangkan baris itu berjalan: Python membaca `print`, lalu menampilkan isi di dalam tanda kurung.",
              code: {
                language: "python",
                content: 'print("Halo, dunia!")\nprint("Aku sedang belajar Python")',
                caption: "Dua baris print menghasilkan dua baris keluaran.",
              },
            },
            {
              kind: "quiz",
              question: "Fungsi apa yang dipakai untuk menampilkan teks ke layar di Python?",
              options: ["echo", "print", "write", "show"],
              answer: 1,
              explanation: "`print` adalah fungsi bawaan Python untuk menampilkan nilai ke layar. `echo` adalah milik PHP, bukan Python.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt: "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan fungsi yang tepat.",
              mode: "fill",
              template: '___("Halo, dunia!")',
              solution: 'print("Halo, dunia!")',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Yang dicari adalah fungsi bawaan Python untuk menampilkan teks.",
                "Namanya print, cukup tiga kata: print lalu teksnya di dalam tanda kutip dan kurung.",
              ],
            },
          ],
        },
        {
          slug: "variabel-tipe-data",
          title: "Variabel dan Tipe Data",
          summary: "Simpan angka dan teks ke dalam variabel, lalu gabungkan.",
          steps: [
            {
              kind: "theory",
              title: "Kotak berlabel untuk data",
              body: "Variabel adalah nama yang menempel pada sebuah nilai. Tidak perlu mendeklarasikan tipe: Python mengenali sendiri apakah itu angka (`int`, `float`) atau teks (`str`).\n\nUntuk menggabungkan teks dan angka saat mencetak, cara paling rapi adalah *f-string*: awali teks dengan huruf `f`, lalu taruh nama variabel di dalam kurung kurawal.",
              code: {
                language: "python",
                content: 'nama = "Sinta"\numur = 17\nprint(f"{nama} berumur {umur} tahun")',
                caption: "f-string menyisipkan isi variabel langsung ke dalam teks.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran dari kode berikut?\n\n```python\nx = 5\nprint(f\"nilai x adalah {x}\")\n```",
              options: ["nilai x adalah {x}", "nilai x adalah 5", "nilai x adalah x", "Error"],
              answer: 1,
              explanation: "Di dalam f-string, `{x}` diganti dengan isi variabel x, yaitu 5.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang rusak",
              prompt: "Kode ini seharusnya mencetak `Sinta - 17`. Ada satu kesalahan yang membuat program gagal jalan. Cari dan perbaiki, lalu jalankan.",
              mode: "fix",
              template: 'nama = "Sinta"\numur = 17\nprint(f"{nama} - {umr}")',
              solution: 'nama = "Sinta"\numur = 17\nprint(f"{nama} - {umur}")',
              tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
              hints: [
                "Perhatikan pesan error saat kamu menjalankan: Python menyebut nama yang tidak dikenalinya.",
                "Variabelnya bernama umur, tapi yang dipanggil di dalam kurung kurawal ditulis beda.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input, ubah ke angka, balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "input(): mendengarkan pengguna",
              body: "Fungsi `input()` membaca satu baris ketikan pengguna sebagai teks (`str`). Kalau kita butuh angka, ubah dulu dengan `int()` (bilangan bulat) atau `float()` (desimal).\n\nDi latihan platform ini, input berasal dari kotak *stdin* saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "python",
                content: 'nama = input()\numur = int(input())\nprint(f"Tahun depan {nama} berumur {umur + 1}")',
                caption: "Baris pertama stdin masuk ke nama, baris kedua ke umur.",
              },
            },
            {
              kind: "quiz",
              question: "`input()` selalu mengembalikan tipe data apa?",
              options: ["int", "str", "float", "tergantung yang diketik"],
              answer: 1,
              explanation: "`input()` selalu mengembalikan `str`, meski yang diketik terlihat seperti angka. Ubah dengan `int()` atau `float()` kalau perlu hitung.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt: "Lengkapi program: baca satu baris nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template: 'nama = ___\nprint(f"___")',
              solution: 'nama = input()\nprint(f"Halo, {nama}!")',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Baris pertama butuh fungsi pembaca input.",
                "Di dalam f-string, sisipkan variabel nama dengan {nama}, dan jangan lupa tanda seru di akhir.",
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
          summary: "Program yang bisa memilih: if, elif, dan else.",
          steps: [
            {
              kind: "theory",
              title: "Berpilihur sesuai kondisi",
              body: "`if` menjalankan blok kode hanya jika kondisinya benar. `else` menampung sisanya. Indentasi (menjorok 4 spasi) bukan gaya bebas: itulah cara Python menandai isi blok.\n\nOperator perbandingan yang sering dipakai: `==` sama dengan, `!=` tidak sama, `>` `<` `>=` `<=`, dan `%` sisa bagi yang sering dipakai untuk cek genap/ganjil.",
              code: {
                language: "python",
                content: 'angka = int(input())\nif angka % 2 == 0:\n    print("genap")\nelse:\n    print("ganjil")',
                caption: "% 2 == 0 berarti habis dibagi dua.",
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
              prompt: "Lengkapi program: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu cetak `ganjil`.",
              mode: "fill",
              template: "angka = int(input())\nif angka % 2 ___ 0:\n    print(\"genap\")\n___:\n    print(\"ganjil\")",
              solution: 'angka = int(input())\nif angka % 2 == 0:\n    print("genap")\nelse:\n    print("ganjil")',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Operator pembanding 'sama dengan' ditulis dua tanda sama dengan.",
                "Blok penampung terakhir setelah if dalam pola ini bernama else, ditulis tanpa kondisi.",
              ],
            },
          ],
        },
        {
          slug: "perulangan-for",
          title: "Perulangan for",
          summary: "Ulangi pekerjaan dengan range() tanpa menulis ulang kode.",
          steps: [
            {
              kind: "theory",
              title: "range(): hitung tanpa capek",
              body: "`for` mengulang blok kode untuk setiap nilai dari sebuah urutan. `range(1, 6)` menghasilkan 1 sampai 5: batas akhir tidak ikut.\n\nPola umum: `for i in range(1, 6):` lalu di dalam blok, gunakan `i`. Untuk mencetak tanpa pindah baris, beri argumen `end=\" \"`.?",
              code: {
                language: "python",
                content: 'for i in range(1, 6):\n    print(i, end=" ")\n# keluaran: 1 2 3 4 5',
                caption: "Batas akhir range tidak disertakan.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for i in range(3):` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Terkadang error"],
              answer: 1,
              explanation: "range(3) menghasilkan 0, 1, 2. Tiga nilai, tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Perbaiki hitungan yang melompat",
              prompt: "Program ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Hasilnya sekarang salah. Perbaiki sampai tesnya lulus.",
              mode: "fix",
              template: 'for i in range(1, 5):\n    print(i, end=" ")',
              solution: 'for i in range(1, 6):\n    print(i, end=" ")',
              tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
              hints: [
                "Jalankan dulu dan lihat hasilnya: satu angka hilang di ujung.",
                "range(1, 5) berhenti sebelum 5. Batas akhir tidak ikut, jadi naikkan satu.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Bungkus logika jadi blok yang bisa dipakai ulang dengan def.",
          steps: [
            {
              kind: "theory",
              title: "def: mendefinisikan sendiri perintah",
              body: "`def` membuat fungsi: blok kode bernama yang menerima parameter dan (biasanya) mengembalikan hasil dengan `return`. Setelah didefinisikan, fungsi dipanggil seperti fungsi bawaan.\n\nPisahkan urusan mencetak dari urusan menghitung: fungsi yang baik menghitung dan mengembalikan nilai, pemanggil yang memutuskan mau diapakan.",
              code: {
                language: "python",
                content: "def luas_persegi_panjang(panjang, lebar):\n    return panjang * lebar\n\np = int(input())\nl = int(input())\nprint(luas_persegi_panjang(p, l))",
                caption: "Fungsi menghitung, program utama mencetak.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari fungsi?",
              options: ["print", "return", "send", "yield"],
              answer: 1,
              explanation: "`return` mengembalikan nilai ke pemanggil. `print` hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Bangun fungsi sapaan",
              prompt: "Lengkapi fungsi `sapa` agar menerima satu parameter nama dan MENGEMBALIKAN teks `Halo, <nama>!`. Baris cetak sudah tersedia, jangan diubah.",
              mode: "fill",
              template: 'def sapa(___):\n    ___ f"Halo, {nama}!"\n\nprint(sapa(input()))',
              solution: 'def sapa(nama):\n    return f"Halo, {nama}!"\n\nprint(sapa(input()))',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "Parameter fungsi adalah nama variabel yang menerima nilai saat dipanggil.",
                "Untuk mengirim hasil keluar fungsi, pakai return, bukan print.",
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
      starterCode: "# baca dua baris input, cetak jumlahnya\na = int(input())\nb = ___\n",
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "input() mengembalikan teks; ubah ke bilangan bulat sebelum dijumlah.",
        "Baris kedua polanya sama seperti baris pertama: b = int(input()).",
      ],
      xpReward: 100,
    },
    {
      slug: "kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu baris teks, cetak teks yang sama dengan urutan karakter terbalik.\n\n**Format input**: satu baris teks tanpa spasi\n**Format output**: teks terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode: "teks = input()\n# cetak teks terbalik\n",
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Python punya cara memotong urutan dengan langkah minus: teks[::-1].",
        "Alternatif: teks[::-1] artinya ambil seluruh string dari belakang ke depan.",
      ],
      xpReward: 100,
    },
    {
      slug: "hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu baris teks kecil (huruf kecil semua), hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Contoh**: input `belajar kode` menjadi `5` (e, a, a, o, e)",
      starterCode: "teks = input()\njumlah = 0\n# hitung vokalnya\n",
      tests: [
        { stdin: "belajar kode", expectedOutput: "5" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Iterasi tiap karakter: for c in teks, lalu cek keanggotaan: if c in \"aiueo\".",
        "Jangan lupa menaikkan jumlah dengan jumlah += 1 setiap kali ketemu vokal.",
      ],
      xpReward: 150,
    },
    {
      slug: "statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode: "n = int(input())\nangka = []\nfor _ in range(n):\n    angka.append(int(input()))\n# cetak min, max, rata dua desimal\n",
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Bawaan Python: min(daftar), max(daftar), sum(daftar) untuk total.",
        "Rata-rata: sum(angka) / len(angka), lalu format dengan f\"{nilai:.2f}\".",
        "Cetak tiga baris terpisah: print(f\"min: {min(angka)}\") dan seterusnya.",
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "kalkulator-diskon",
      title: "Kalkulator Diskon Kasir",
      summary: "Program struk sederhana: hitung total belanja lalu terapkan diskon bertingkat.",
      brief:
        "Kamu diminta membuat program kasir kecil. Program membaca harga satuan barang, jumlah barang, dan persen diskon dari input, lalu menghitung total bayar.\n\nAturan diskon: total kotor (harga kali jumlah) dikurangi persen diskon yang diberikan. Hasil akhir dibulatkan ke bilangan bulat terdekat.\n\n**Format input**\nBaris 1: harga satuan (int)\nBaris 2: jumlah barang (int)\nBaris 3: persen diskon (int, 0 sampai 100)\n\n**Format output**\nSatu baris: total bayar (int)",
      steps: [
        {
          title: "Rancang input dan output",
          detail:
            "Tentukan tiga variabel input dan satu keluaran. Tulis dulu kerangka program yang membaca tiga baris input dengan int(input()).",
          hint: "Tiga baris berurutan: harga = int(input()), jumlah = int(input()), diskon = int(input()).",
        },
        {
          title: "Hitung total kotor",
          detail: "Kalikan harga satuan dengan jumlah barang, simpan di variabel total_kotor.",
          hint: "total_kotor = harga * jumlah",
        },
        {
          title: "Terapkan diskon",
          detail:
            "Kurangi total kotor sesuai persen diskon. Ingat: persen berarti per seratus, jadi bagi dengan 100.",
          hint: "total_bayar = round(total_kotor * (100 - diskon) / 100)",
        },
        {
          title: "Cetak dan uji dengan kasus nyata",
          detail:
            "Cetak total bayar. Uji dengan contoh: harga 25000, jumlah 3, diskon 20. Hasil yang benar: 60000. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: "round() membulatkan ke bilangan bulat terdekat, pas untuk syarat soal.",
        },
      ],
      finalTests: [
        { stdin: "25000\n3\n20", expectedOutput: "60000" },
        { stdin: "10000\n2\n0", expectedOutput: "20000" },
        { stdin: "19999\n1\n50", expectedOutput: "10000" },
      ],
      xpReward: 300,
    },
  ],
};
