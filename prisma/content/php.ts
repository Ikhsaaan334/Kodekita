import type { TrackContent } from "./types";

export const php: TrackContent = {
  track: {
    slug: "php",
    name: "PHP",
    tagline:
      "Bahasa server yang ramah pemula: tulis kode, jalankan lewat terminal, lihat hasilnya langsung.",
    description:
      "Mulai dari mencetak teks dengan echo, mengelola variabel, membaca input dari terminal, percabangan, perulangan, sampai menulis fungsi. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan PHP: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-php",
          title: "Halo, PHP",
          summary: "Cetak teks pertamamu dengan echo.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "File kode PHP diawali tanda `<?php`, lalu perintah dijalankan dari atas ke bawah. Untuk menampilkan sesuatu ke layar, kita pakai `echo` lalu teksnya di dalam tanda kutip, ditutup titik koma.\n\nTanda `\\n` di akhir teks artinya pindah baris. Di latihan platform ini program dijalankan lewat terminal, jadi bayangkan keluarannya muncul di baris perintah.",
              code: {
                language: "php",
                content: '<?php\necho "Halo, dunia!\\n";\necho "Aku sedang belajar PHP\\n";',
                caption: "Dua perintah echo menghasilkan dua baris keluaran.",
              },
            },
            {
              kind: "quiz",
              question: "Perintah apa yang dipakai untuk menampilkan teks ke layar di PHP?",
              options: ["cout", "echo", "puts", "writeln"],
              answer: 1,
              explanation:
                "`echo` adalah konstruksi bawaan PHP untuk menampilkan nilai. `cout` milik C++ dan `puts` milik C, bukan PHP.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt:
                "Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan perintah yang tepat.",
              mode: "fill",
              template: '<?php\n___ "Halo, dunia!";',
              solution: '<?php\necho "Halo, dunia!";',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Yang dicari adalah perintah bawaan PHP untuk menampilkan teks.",
                "Namanya echo, ditulis sebelum teks yang berada di dalam tanda kutip, ditutup titik koma.",
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
              body: "Nama variabel di PHP selalu diawali tanda dolar, misalnya `$nama` atau `$umur`. PHP mengenali sendiri tipe datanya, baik angka (`int`, `float`), teks (`string`), maupun `bool`.\n\nUntuk menyambung teks dengan isi variabel saat mencetak, pakai tanda titik. Tanda titik itulah operator penggabung string di PHP.",
              code: {
                language: "php",
                content:
                  '<?php\n$nama = "Sinta";\n$umur = 17;\necho $nama . " berumur " . $umur . " tahun";',
                caption: "Tanda titik menyambung teks dan isi variabel.",
              },
            },
            {
              kind: "quiz",
              question:
                'Apa keluaran dari kode berikut?\n\n```php\n$harga = 2500;\necho "Total: " . $harga;\n```',
              options: ["Total: $harga", "Total: 2500", "Total: harga", "Error"],
              answer: 1,
              explanation:
                "Tanda titik menyambung teks dengan isi variabel, jadi $harga diganti nilainya, yaitu 2500.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang kebalik",
              prompt:
                "Kode ini seharusnya mencetak `Sinta - 17`, tapi hasilnya kebalik. Cari kesalahannya, perbaiki, lalu jalankan.",
              mode: "fix",
              template: '<?php\n$nama = "Sinta";\n$umur = 17;\necho $umur . " - " . $nama;',
              solution: '<?php\n$nama = "Sinta";\n$umur = 17;\necho $nama . " - " . $umur;',
              tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
              hints: [
                "Jalankan dulu dan bandingkan urutan keluarannya dengan yang diminta.",
                "Baris echo menyebut $umur lebih dulu. Tukar posisinya: $nama dulu, baru $umur.",
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
              title: "fgets(STDIN): mendengarkan terminal",
              body: "`fgets(STDIN)` membaca satu baris masukan sebagai teks, lengkap dengan pindah baris di ujungnya. Karena itu hasilnya biasa dibersihkan dulu dengan `trim()`. Kalau butuh angka, ubah dengan menulis `(int)` di depannya.\n\nDi latihan platform ini, input berasal dari kotak *stdin* saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "php",
                content:
                  '<?php\n$nama = trim(fgets(STDIN));\n$umur = (int)trim(fgets(STDIN));\necho "Tahun depan " . $nama . " berumur " . ($umur + 1) . " tahun";',
                caption: "Baris pertama stdin masuk ke $nama, baris kedua ke $umur.",
              },
            },
            {
              kind: "quiz",
              question: "Fungsi apa yang membaca satu baris masukan dari stdin di PHP?",
              options: ["read()", "fgets(STDIN)", "ambil()", "scan()"],
              answer: 1,
              explanation:
                "`fgets(STDIN)` membaca satu baris dari masukan standar. `trim()` biasanya menyertainya untuk membersihkan pindah baris di ujung.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt:
                "Lengkapi program: baca satu baris nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template: '<?php\n$nama = trim(___);\necho "Halo, " . ___ . "!";',
              solution: '<?php\n$nama = trim(fgets(STDIN));\necho "Halo, " . $nama . "!";',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Bagian pertama butuh sumber masukan satu baris, seperti pada contoh di teori.",
                "Isi kedua `___` dengan fgets(STDIN) dan $nama. Tanda seru di akhir sudah tersedia.",
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
          summary: "Program yang bisa memilih: if, elseif, dan else.",
          steps: [
            {
              kind: "theory",
              title: "Berpilih sesuai kondisi",
              body: "`if` menjalankan blok kode hanya jika kondisinya benar, `else` menampung sisanya. Kondisi ditulis di dalam kurung biasa, dan isi blok dibungkus kurung kurawal { }.\n\nOperator yang sering dipakai: `==` sama dengan, `!=` tidak sama, `>` `<` `>=` `<=`, dan `%` sisa bagi yang sering dipakai untuk cek genap/ganjil.",
              code: {
                language: "php",
                content:
                  '<?php\n$angka = (int)trim(fgets(STDIN));\nif ($angka % 2 == 0) {\n    echo "genap";\n} else {\n    echo "ganjil";\n}',
                caption: "% 2 == 0 berarti habis dibagi dua.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran program di atas jika input-nya `7`?",
              options: ["genap", "ganjil", "7", "Error"],
              answer: 1,
              explanation:
                "7 % 2 hasilnya 1, jadi kondisi == 0 salah, program masuk ke blok else dan mencetak ganjil.",
            },
            {
              kind: "code",
              title: "Genap atau ganjil",
              prompt:
                "Lengkapi program: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu cetak `ganjil`.",
              mode: "fill",
              template:
                '<?php\n$angka = (int)trim(fgets(STDIN));\nif ($angka % 2 ___ 0) {\n    echo "genap";\n} ___ {\n    echo "ganjil";\n}',
              solution:
                '<?php\n$angka = (int)trim(fgets(STDIN));\nif ($angka % 2 == 0) {\n    echo "genap";\n} else {\n    echo "ganjil";\n}',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Operator pembanding 'sama dengan' ditulis dua tanda sama dengan.",
                "Blok penampung terakhir setelah if dalam pola ini ditulis else tanpa kondisi.",
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
              body: "`for` mengulang blok kode sebanyak yang kita minta. Di dalam kurungnya ada tiga bagian yang dipisah titik koma: nilai awal, syarat jalan, dan perubahan. Contoh `for ($i = 1; $i <= 5; $i++)`: mulai dari 1, jalan selama $i kurang dari sama dengan 5, dan `$i++` menaikkan nilai satu per satu.\n\nSatu catatan kecil: `echo $i . \" \"` mencetak angka lalu satu spasi, tanpa pindah baris, jadi hitungan tersusun dalam satu baris.",
              code: {
                language: "php",
                content:
                  '<?php\nfor ($i = 1; $i <= 5; $i++) {\n    echo $i . " ";\n}\n// keluaran: 1 2 3 4 5 dengan spasi di antaranya',
                caption: "Perulangan berhenti saat syarat $i <= 5 tidak terpenuhi lagi.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for ($i = 0; $i < 3; $i++)` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Terkadang error"],
              answer: 1,
              explanation:
                "$i bernilai 0, 1, 2. Saat $i mencapai 3, syarat $i < 3 sudah salah, jadi tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Perbaiki hitungan yang melompat",
              prompt:
                "Program ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Hasilnya sekarang kurang satu angka. Perbaiki sampai tesnya lulus.",
              mode: "fix",
              template: '<?php\nfor ($i = 1; $i <= 4; $i++) {\n    echo $i . " ";\n}',
              solution: '<?php\nfor ($i = 1; $i <= 5; $i++) {\n    echo $i . " ";\n}',
              tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
              hints: [
                "Jalankan dulu dan lihat hasilnya: angka terakhir hilang.",
                "Syarat $i <= 4 berhenti di 4. Naikkan batasnya supaya 5 ikut tercetak.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Bungkus logika jadi blok yang bisa dipakai ulang dengan function.",
          steps: [
            {
              kind: "theory",
              title: "function: mendefinisikan sendiri perintah",
              body: "`function` membuat fungsi: blok kode bernama yang menerima parameter dan (biasanya) mengembalikan hasil dengan `return`. Setelah didefinisikan, fungsi dipanggil seperti fungsi bawaan PHP.\n\nPisahkan urusan mencetak dari urusan menghitung: fungsi yang baik menghitung dan mengembalikan nilai, pemanggil yang memutuskan mau diapakan.",
              code: {
                language: "php",
                content:
                  '<?php\nfunction luas_persegi_panjang($panjang, $lebar) {\n    return $panjang * $lebar;\n}\n\n$p = (int)trim(fgets(STDIN));\n$l = (int)trim(fgets(STDIN));\necho luas_persegi_panjang($p, $l);',
                caption: "Fungsi menghitung, program utama mencetak.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari fungsi?",
              options: ["print", "return", "send", "yield"],
              answer: 1,
              explanation:
                "`return` mengembalikan nilai ke pemanggil. `print` hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Bangun fungsi sapaan",
              prompt:
                "Lengkapi fungsi `sapa` agar menerima satu parameter nama dan MENGEMBALIKAN teks `Halo, <nama>!`. Baris cetak di bawah sudah tersedia, jangan diubah.",
              mode: "fill",
              template:
                '<?php\nfunction sapa(___) {\n    ___ "Halo, " . $nama . "!";\n}\n\necho sapa(trim(fgets(STDIN)));',
              solution:
                '<?php\nfunction sapa($nama) {\n    return "Halo, " . $nama . "!";\n}\n\necho sapa(trim(fgets(STDIN)));',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "Parameter fungsi ditulis di dalam kurung setelah nama fungsi, diawali tanda dolar.",
                "Untuk mengirim hasil keluar fungsi, pakai return, bukan echo.",
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
      starterCode:
        '<?php\n// baca dua baris input, cetak jumlahnya\n$a = (int)trim(fgets(STDIN));\n$b = ___;\necho $a + $b;\n',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "fgets(STDIN) mengembalikan teks; ubah ke bilangan bulat dengan (int) sebelum dijumlah.",
        "Baris kedua polanya sama seperti baris pertama: $b = (int)trim(fgets(STDIN));",
      ],
      xpReward: 100,
    },
    {
      slug: "kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu baris teks, cetak teks yang sama dengan urutan karakter terbalik.\n\n**Format input**: satu baris teks tanpa spasi\n**Format output**: teks terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode: '<?php\n$teks = trim(fgets(STDIN));\n// cetak teks terbalik\n',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "PHP punya fungsi bawaan yang membalik string dalam sekali panggil.",
        "Cukup satu baris: echo strrev($teks);",
      ],
      xpReward: 100,
    },
    {
      slug: "hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu baris teks kecil (huruf kecil semua), hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Contoh**: input `belajar kode` menjadi `5` (e, a, a, o, e)",
      starterCode: '<?php\n$teks = trim(fgets(STDIN));\n$jumlah = 0;\n// hitung vokalnya\n',
      tests: [
        { stdin: "belajar kode", expectedOutput: "5" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Ulangi dari 0 sampai strlen($teks) - 1, lalu ambil satu karakter dengan $teks[$i].",
        'Cek dengan if ($c == "a" || $c == "i" || $c == "u" || $c == "e" || $c == "o"), lalu naikkan $jumlah dengan $jumlah += 1.',
        'Alternatif singkat: substr_count($teks, "a") menghitung kemunculan sebuah huruf; jumlahkan hasilnya untuk kelima vokal lalu echo.',
      ],
      xpReward: 150,
    },
    {
      slug: "statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode:
        '<?php\n$n = (int)trim(fgets(STDIN));\n$angka = [];\nfor ($i = 0; $i < $n; $i++) {\n    $angka[] = (int)trim(fgets(STDIN));\n}\n// cetak min, max, rata dua desimal\n',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Bawaan PHP: min($angka) dan max($angka) untuk nilai terkecil dan terbesar.",
        "Total: array_sum($angka), banyak data: count($angka). Bagi keduanya untuk rata-rata.",
        'Format dua desimal: sprintf("%.2f", $rata). Untuk pindah baris, tulis \\n di akhir teks.',
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "laporan-rapor-siswa",
      title: "Laporan Rapor Siswa",
      summary: "Program laporan kecil: baca tiga nilai, hitung rata-rata, dan tentukan status kelulusan.",
      brief:
        "Kamu diminta membuat program laporan nilai. Program membaca nama siswa dan tiga nilai ujian, lalu mencetak laporan singkat.\n\nAturan kelulusan: rata-rata nilai 75 atau lebih berarti LULUS, selain itu TIDAK LULUS.\n\n**Format input**\nBaris 1: nama siswa (satu baris teks)\nBaris 2 sampai 4: tiga nilai ujian (int)\n\n**Format output**\nTiga baris:\n```\nNama: <nama>\nRata-rata: <rata-rata, dua angka desimal>\nStatus: LULUS atau TIDAK LULUS\n```",
      steps: [
        {
          title: "Baca input dan simpan nilainya",
          detail:
            "Baca nama dengan trim(fgets(STDIN)), lalu tiga nilai dengan (int)trim(fgets(STDIN)). Simpan masing-masing di variabelnya sendiri.",
          hint: "Empat baris berurutan: $nama = trim(fgets(STDIN)); lalu $nilai1, $nilai2, $nilai3 masing-masing (int)trim(fgets(STDIN)).",
        },
        {
          title: "Hitung rata-rata",
          detail: "Jumlahkan ketiga nilai, lalu bagi tiga. Simpan di variabel $rata.",
          hint: "$rata = ($nilai1 + $nilai2 + $nilai3) / 3;",
        },
        {
          title: "Tentukan status kelulusan",
          detail:
            "Pakai if dan else: jika $rata sudah 75 atau lebih, statusnya LULUS, selain itu TIDAK LULUS. Simpan di variabel $status.",
          hint: 'if ($rata >= 75) { $status = "LULUS"; } else { $status = "TIDAK LULUS"; }',
        },
        {
          title: "Cetak laporan dan uji dengan kasus nyata",
          detail:
            "Cetak tiga baris: nama, rata-rata dengan dua angka desimal, dan status. Uji dengan contoh: Budi, nilai 80, 75, 86. Hasil yang benar: rata-rata 80.33, status LULUS. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: "number_format($rata, 2) menghasilkan dua desimal dengan pemisah titik, pas untuk format keluaran.",
        },
      ],
      finalTests: [
        { stdin: "Budi\n80\n75\n86", expectedOutput: "Nama: Budi\nRata-rata: 80.33\nStatus: LULUS" },
        { stdin: "Ani\n90\n90\n90", expectedOutput: "Nama: Ani\nRata-rata: 90.00\nStatus: LULUS" },
        {
          stdin: "Cika\n40\n50\n60",
          expectedOutput: "Nama: Cika\nRata-rata: 50.00\nStatus: TIDAK LULUS",
        },
      ],
      xpReward: 300,
    },
  ],
};
