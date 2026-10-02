import type { TrackContent } from "./types";

export const cpp: TrackContent = {
  track: {
    slug: "cpp",
    name: "C++",
    tagline: "Bahasa andalan kompetisi pemrograman: cepat, ketat, dan diajarkan di sini dari nol.",
    description:
      "Mulai dari program pertama dengan cout, mengelola variabel, membaca input dengan cin, percabangan, perulangan, sampai menulis fungsi sendiri. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan C++: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-cpp",
          title: "Halo, C++",
          summary: "Cetak teks pertamamu dengan std::cout.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Program C++ butuh dua hal sebelum bisa bicara: mengambil alat dari perpustakaan lewat `#include`, dan satu fungsi `main` tempat program mulai berjalan. Untuk menampilkan sesuatu ke layar, kita pakai `std::cout` dari `<iostream>` dan mengirim teks dengan tanda `<<`.\n\nCoba perhatikan contoh di samping, lalu bayangkan barisnya berjalan: C++ masuk ke `main`, menjalankan perintah cetak, lalu `return 0` menandakan program selesai tanpa masalah.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\n\nint main() {\n  std::cout << "Halo, dunia!" << std::endl;\n  return 0;\n}',
                caption: "std::endl memindahkan keluaran berikutnya ke baris baru.",
              },
            },
            {
              kind: "quiz",
              question: "Library apa yang wajib di-include supaya bisa memakai std::cout?",
              options: ["<iostream>", "<string>", "<stdio>", "<math>"],
              answer: 0,
              explanation:
                "`std::cout` tinggal di `<iostream>`. Tanpa include itu, compiler tidak mengenal cout.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt:
                'Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan alat cetak dari `<iostream>`.',
              mode: "fill",
              template:
                '#include <iostream>\n\nint main() {\n  ___ << "Halo, dunia!" << std::endl;\n  return 0;\n}',
              solution:
                '#include <iostream>\n\nint main() {\n  std::cout << "Halo, dunia!" << std::endl;\n  return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Yang dicari adalah alat cetak bawaan `<iostream>`, ditulis dengan awalan std::.",
                "Namanya std::cout, ditaruh sebelum tanda << yang mengirim teksnya.",
              ],
            },
          ],
        },
        {
          slug: "variabel-tipe-data",
          title: "Variabel dan Tipe Data",
          summary: "Simpan angka dan teks ke dalam variabel bertipe, lalu gabungkan.",
          steps: [
            {
              kind: "theory",
              title: "Kotak bertipe untuk data",
              body: "Variabel di C++ selalu punya tipe yang ditulis di depan namanya: `int` untuk bilangan bulat, `double` untuk pecahan, dan `std::string` untuk teks (butuh `#include <string>`).\n\nUntuk merangkai teks dengan isi variabel saat mencetak, kirim potongan demi potongan ke `cout` dengan `<<`, seperti menyusun gerbong kereta.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama = "Sinta";\n  int umur = 17;\n  cout << nama << " berumur " << umur << " tahun" << endl;\n  return 0;\n}',
                caption:
                  "Baris using namespace std; boleh dipakai agar tidak perlu menulis std:: berulang.",
              },
            },
            {
              kind: "quiz",
              question: "Tipe data apa yang paling pas untuk menyimpan umur dalam tahun?",
              options: ["string", "int", "double", "bool"],
              answer: 1,
              explanation:
                "Umur adalah bilangan bulat, jadi `int` paling pas. `double` untuk pecahan, `string` untuk teks, `bool` untuk benar atau salah.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang rusak",
              prompt:
                "Kode ini seharusnya mencetak `Sinta - 17`. Ada satu kesalahan yang membuat program gagal dikompilasi. Cari dan perbaiki, lalu jalankan.",
              mode: "fix",
              template:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama = "Sinta";\n  int umur = 17;\n  cout << nama << " - " << umr << endl;\n  return 0;\n}',
              solution:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama = "Sinta";\n  int umur = 17;\n  cout << nama << " - " << umur << endl;\n  return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
              hints: [
                "Baca pesan error dari compiler: biasanya ia menyebut nama yang tidak dikenalinya.",
                "Variabelnya dideklarasikan sebagai umur, tapi yang dicetak ditulis beda satu huruf.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input dengan cin, lalu balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "cin: mendengarkan pengguna",
              body: "`std::cin` membaca input dengan tanda `>>` yang mengirim isi kotak stdin ke variabel: `cin >> nama;` menyimpan satu kata ke variabel nama. Tipe variabel menentukan cara membacanya: `string` untuk satu kata teks, `int` untuk bilangan bulat. Keduanya bisa dibaca sekaligus: `cin >> nama >> umur;`.\n\nDi platform ini, input berasal dari kotak *stdin* saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama;\n  int umur;\n  cin >> nama >> umur;\n  cout << "Tahun depan " << nama << " berumur " << umur + 1 << endl;\n  return 0;\n}',
                caption:
                  "Baris pertama stdin masuk ke nama, baris kedua ke umur. Tanpa kurung tambahan, umur + 1 dihitung dulu sebelum dicetak.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran program di atas jika input-nya `Budi` dan `15`?",
              options: [
                "Tahun depan Budi berumur 15",
                "Tahun depan Budi berumur 16",
                "Tahun depan nama berumur umur",
                "Error",
              ],
              answer: 1,
              explanation:
                "`cin >> umur` menyimpan 15, lalu `umur + 1` dihitung menjadi 16 sebelum dikirim ke cout.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt:
                "Lengkapi program: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama;\n  ___ >> ___;\n  cout << "Halo, " << nama << "!" << endl;\n  return 0;\n}',
              solution:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string nama;\n  cin >> nama;\n  cout << "Halo, " << nama << "!" << endl;\n  return 0;\n}',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Bagian pertama adalah alat pembaca input, saudaraan dari cout.",
                "Pola lengkapnya: cin >> nama; dengan dua tanda lebih besar dari, lalu titik koma.",
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
              body: "`if` menjalankan blok kurung kurawal hanya jika kondisinya benar, `else` menampung sisanya. Beda dengan Python yang mengandalkan indentasi, C++ menandai blok dengan `{ }` dan menutup setiap perintah dengan titik koma.\n\nOperator yang sering dipakai: `==` sama dengan, `!=` tidak sama, `>` `<` `>=` `<=`, dan `%` sisa bagi yang sering dipakai untuk cek genap atau ganjil.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\nusing namespace std;\n\nint main() {\n  int angka;\n  cin >> angka;\n  if (angka % 2 == 0) {\n    cout << "genap" << endl;\n  } else {\n    cout << "ganjil" << endl;\n  }\n  return 0;\n}',
                caption: "% 2 == 0 berarti habis dibagi dua.",
              },
            },
            {
              kind: "quiz",
              question: "Apa keluaran program di atas jika input-nya `7`?",
              options: ["genap", "ganjil", "7", "Error"],
              answer: 1,
              explanation:
                "7 % 2 hasilnya 1, jadi kondisi == 0 salah dan program masuk ke blok else, mencetak ganjil.",
            },
            {
              kind: "code",
              title: "Genap atau ganjil",
              prompt:
                "Lengkapi program: baca satu bilangan bulat, cetak `genap` jika habis dibagi 2, selain itu cetak `ganjil`.",
              mode: "fill",
              template:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n  int angka;\n  cin >> angka;\n  if (angka ___ 2 == 0) {\n    cout << "genap" << endl;\n  } ___ {\n    cout << "ganjil" << endl;\n  }\n  return 0;\n}',
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n  int angka;\n  cin >> angka;\n  if (angka % 2 == 0) {\n    cout << "genap" << endl;\n  } else {\n    cout << "ganjil" << endl;\n  }\n  return 0;\n}',
              tests: [
                { stdin: "4", expectedOutput: "genap" },
                { stdin: "9", expectedOutput: "ganjil" },
                { stdin: "0", expectedOutput: "genap" },
              ],
              hints: [
                "Operator sisa bagi ditulis dengan satu tanda persen.",
                "Blok penampung terakhir setelah if dalam pola ini bernama else, ditulis tanpa kondisi.",
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
              body: "Pola `for` di C++ punya tiga bagian dalam kurung: `for (int i = 1; i <= 5; i++)` berarti mulai dari 1, lanjut selama `i <= 5`, dan naik satu setiap putaran lewat `i++`.\n\n`cout` tidak pernah pindah baris sendiri, dan itu keuntungan di sini: pakai `cout << i << \" \";` untuk mencetak sebaris, lalu satu `endl` di luar loop untuk menutup barisnya.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 1; i <= 5; i++) {\n    cout << i << " ";\n  }\n  cout << endl;\n  return 0;\n}',
                caption: "i++ menaikkan i satu setiap putaran, dari 1 sampai 5.",
              },
            },
            {
              kind: "quiz",
              question: "Berapa kali blok dalam `for (int i = 0; i < 3; i++)` dijalankan?",
              options: ["2 kali", "3 kali", "4 kali", "Terkadang error"],
              answer: 1,
              explanation: "i bernilai 0, 1, 2 selama kondisi i < 3 masih benar. Tiga nilai, tiga kali dijalankan.",
            },
            {
              kind: "code",
              title: "Perbaiki hitungan yang melompat",
              prompt:
                "Program ini seharusnya mencetak `1 2 3 4 5` dalam satu baris. Hasilnya sekarang kurang. Perbaiki sampai tesnya lulus.",
              mode: "fix",
              template:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 1; i < 5; i++) {\n    if (i > 1) {\n      cout << " ";\n    }\n    cout << i;\n  }\n  cout << endl;\n  return 0;\n}',
              solution:
                '#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 1; i <= 5; i++) {\n    if (i > 1) {\n      cout << " ";\n    }\n    cout << i;\n  }\n  cout << endl;\n  return 0;\n}',
              tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
              hints: [
                "Jalankan dulu dan lihat hasilnya: satu angka hilang di ujung.",
                "Kondisi i < 5 berhenti sebelum 5. Supaya 5 ikut, syaratnya harus i <= 5.",
              ],
            },
          ],
        },
        {
          slug: "fungsi",
          title: "Fungsi",
          summary: "Bungkus logika jadi blok yang bisa dipakai ulang dengan return.",
          steps: [
            {
              kind: "theory",
              title: "Fungsi: mendefinisikan sendiri perintah",
              body: "Fungsi di C++ menyebut dulu tipe hasilnya: `int luas(int panjang, int lebar)` berarti fungsi bernama luas menerima dua `int` dan mengembalikan `int`. Hasil dikirim balik dengan `return`, dan fungsi yang sudah didefinisikan bisa dipanggil dari `main` seperti fungsi bawaan.\n\nPisahkan urusan mencetak dari urusan menghitung: fungsi yang baik menghitung dan mengembalikan nilai, pemanggil yang memutuskan mau diapakan.",
              code: {
                language: "cpp",
                content:
                  '#include <iostream>\nusing namespace std;\n\nint luas(int panjang, int lebar) {\n  return panjang * lebar;\n}\n\nint main() {\n  int p, l;\n  cin >> p >> l;\n  cout << luas(p, l) << endl;\n  return 0;\n}',
                caption: "Fungsi menghitung, main mencetak.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari fungsi di C++?",
              options: ["print", "return", "send", "yield"],
              answer: 1,
              explanation:
                "`return` mengembalikan nilai ke pemanggil dan langsung mengakhiri fungsi. `cout` hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Bangun fungsi sapaan",
              prompt:
                "Lengkapi fungsi `sapa` agar menerima satu parameter nama dan MENGEMBALIKAN teks `Halo, <nama>!`. Bagian main sudah benar, jangan diubah.",
              mode: "fill",
              template:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring sapa(string nama) {\n  ___ "Halo, " + nama + "!";\n}\n\nint main() {\n  string nama;\n  cin >> nama;\n  cout << sapa(nama) << endl;\n  return 0;\n}',
              solution:
                '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring sapa(string nama) {\n  return "Halo, " + nama + "!";\n}\n\nint main() {\n  string nama;\n  cin >> nama;\n  cout << sapa(nama) << endl;\n  return 0;\n}',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "C++ mengenali teks + string sebagai penyambungan, jadi yang kurang hanya satu kata kunci.",
                "Untuk mengirim hasil keluar fungsi, pakai return, bukan cout.",
              ],
            },
          ],
        },
      ],
    },
  ],
  challenges: [
    {
      slug: "cpp-jumlah-dua-angka",
      title: "Jumlah Dua Angka",
      difficulty: "mudah",
      statement:
        "Baca dua bilangan bulat dari input (satu per baris), lalu cetak jumlahnya.\n\n**Format input**\nBaris 1: bilangan pertama\nBaris 2: bilangan kedua\n\n**Format output**\nSatu baris: hasil penjumlahan\n\n**Contoh**\nInput: `3` dan `4` menjadi `7`",
      starterCode:
        '#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  // cetak jumlahnya\n  return 0;\n}',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "cin >> a >> b sudah membaca dua baris input ke dua variabel, tinggal dihitung.",
        "Cukup satu baris: cout << a + b << endl;",
      ],
      xpReward: 100,
    },
    {
      slug: "cpp-kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu kata, cetak kata yang sama dengan urutan karakter terbalik.\n\n**Format input**: satu kata tanpa spasi\n**Format output**: kata terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode:
        '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string teks;\n  cin >> teks;\n  // cetak teks terbalik\n  return 0;\n}',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Ulangi dari indeks paling belakang: for (int i = (int)teks.size() - 1; i >= 0; i--).",
        "Cetak tiap karakter dengan cout << teks[i];, lalu tutup dengan cout << endl; setelah loop selesai.",
      ],
      xpReward: 100,
    },
    {
      slug: "cpp-hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu baris teks kecil (huruf kecil semua, boleh ada spasi), hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Contoh**: input `belajar kode` menjadi `5` (e, a, a, o, e)",
      starterCode:
        '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string teks;\n  getline(cin, teks); // membaca satu baris penuh, termasuk spasinya\n  int jumlah = 0;\n  // hitung vokalnya\n  return 0;\n}',
      tests: [
        { stdin: "belajar kode", expectedOutput: "5" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Ulangi setiap karakter: for (int i = 0; i < (int)teks.size(); i++), lalu simpan char c = teks[i].",
        "Cek kelima vokal sekaligus: if (c == 'a' || c == 'i' || c == 'u' || c == 'e' || c == 'o'), lalu jumlah++.",
        "Terakhir, cetak jumlah dengan cout << jumlah << endl;",
      ],
      xpReward: 150,
    },
    {
      slug: "cpp-statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode:
        '#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  cin >> n;\n  // baca n bilangan, catat terkecil, terbesar, dan totalnya\n  // cetak tiga baris: min, max, lalu rata dengan dua angka desimal\n  return 0;\n}',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Siapkan variabel terkecil dan terbesar. Saat membaca bilangan pertama, jadikan keduanya bilangan itu, lalu bandingkan untuk setiap bilangan berikutnya.",
        "Pakai long long total untuk penjumlahan, lalu hitung rata-ratanya pecahan: (double) total / n.",
        'Tambahkan #include <cstdio> di atas, lalu satu printf menyelesaikan semuanya: printf("min: %d\\nmax: %d\\nrata: %.2f\\n", terkecil, terbesar, (double) total / n);',
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "cpp-penilaian-siswa",
      title: "Penilaian Siswa",
      summary: "Program penilaian ujian: rata-rata tiga nilai dan nilai hurufnya.",
      brief:
        "Kamu diminta membuat program penilaian untuk guru. Program membaca tiga nilai ujian dari input, menghitung rata-ratanya, lalu menentukan nilai huruf.\n\nAturan huruf: rata-rata 85 ke atas mendapat A, 70 sampai 84 mendapat B, 60 sampai 69 mendapat C, di bawah itu D.\n\n**Format input**\nBaris 1 sampai 3: nilai ujian (int)\n\n**Format output**\nBaris 1: `Rata-rata: <dua angka desimal>`\nBaris 2: `Nilai: <huruf>`",
      steps: [
        {
          title: "Rancang input dan output",
          detail:
            "Tentukan tiga variabel input dan dua keluaran. Tulis dulu kerangka program yang membaca ketiga nilai sekaligus dalam satu perintah cin.",
          hint: "cin >> a >> b >> c; membaca tiga baris berurutan tanpa perlu tiga perintah terpisah.",
        },
        {
          title: "Buat fungsi rataRata",
          detail:
            "Definisikan fungsi yang menerima tiga int dan mengembalikan double berupa rata-ratanya.",
          hint: "double rataRata(int a, int b, int c) { return (a + b + c) / 3.0; } Tulis 3.0, bukan 3, supaya pembagiannya menghasilkan pecahan.",
        },
        {
          title: "Tentukan nilai huruf",
          detail:
            "Pakai if dan else if bertingkat mulai dari syarat paling tinggi, dan simpan hurufnya di variabel bertipe char.",
          hint: "Cek rata >= 85 dulu (A), lalu >= 70 (B), lalu >= 60 (C), sisanya D.",
        },
        {
          title: "Cetak dua desimal dan uji",
          detail:
            'Cetak rata-rata dengan dua angka desimal, misalnya lewat printf dengan %.2f (butuh #include <cstdio>). Uji dengan nilai 85, 90, 88: rata-ratanya 87.67 dan hurufnya A. Lalu kumpulkan lewat tombol Kumpulkan di bawah.',
          hint: 'printf("Rata-rata: %.2f\\n", rata); lalu cout << "Nilai: " << huruf << endl; juga boleh.',
        },
      ],
      finalTests: [
        { stdin: "85\n90\n88", expectedOutput: "Rata-rata: 87.67\nNilai: A" },
        { stdin: "70\n75\n65", expectedOutput: "Rata-rata: 70.00\nNilai: B" },
        { stdin: "40\n50\n45", expectedOutput: "Rata-rata: 45.00\nNilai: D" },
      ],
      xpReward: 300,
    },
  ],
};
