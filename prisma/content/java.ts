import type { TrackContent } from "./types";

export const java: TrackContent = {
  track: {
    slug: "java",
    name: "Java",
    tagline: "Bahasa yang tertata dan ketat aturannya, pintu masuk ke aplikasi besar dan Android.",
    description:
      "Mulai dari class Main pertama, variabel bertipe, membaca input dengan Scanner, percabangan, perulangan, sampai menulis method sendiri. Setiap pelajaran diakhiri dengan kode yang kamu ketik dan jalankan sendiri.",
  },
  modules: [
    {
      title: "Fondasi",
      description: "Kenalan dengan Java: mencetak teks, menyimpan data di variabel, dan membaca input.",
      lessons: [
        {
          slug: "halo-java",
          title: "Halo, Java",
          summary: "Cetak teks pertamamu dengan System.out.println.",
          steps: [
            {
              kind: "theory",
              title: "Program pertama: mencetak teks",
              body: "Semua kode Java tinggal di dalam class, dan program mulai berjalan dari method `main` dengan tulisan lengkap `public static void main(String[] args)`. Untuk menampilkan sesuatu ke layar, panggil `System.out.println` yang mencetak lalu pindah baris.\n\nCoba perhatikan contoh di samping: kurung kurawal menandai batas class dan method, dan setiap perintah ditutup titik koma.",
              code: {
                language: "java",
                content:
                  'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Halo, dunia!");\n    System.out.println("Aku sedang belajar Java");\n  }\n}',
                caption: "Dua println menghasilkan dua baris keluaran.",
              },
            },
            {
              kind: "quiz",
              question: "Method apa yang menjadi titik awal berjalannya program Java?",
              options: ["start", "main", "run", "init"],
              answer: 1,
              explanation:
                "JVM selalu mencari dan menjalankan `public static void main(String[] args)` sebagai pintu masuk program.",
            },
            {
              kind: "code",
              title: "Lengkapi program pertamamu",
              prompt:
                'Lengkapi kode di bawah supaya mencetak teks `Halo, dunia!` persis. Ganti tanda `___` dengan perintah cetak yang pindah baris.',
              mode: "fill",
              template:
                'public class Main {\n  public static void main(String[] args) {\n    ___("Halo, dunia!");\n  }\n}',
              solution:
                'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Halo, dunia!");\n  }\n}',
              tests: [{ stdin: "", expectedOutput: "Halo, dunia!" }],
              hints: [
                "Yang dicari adalah perintah cetak bawaan Java, panjang memang, tapi bentuknya selalu sama.",
                "Namanya System.out.println, ditaruh sebelum tanda kurung berisi teksnya.",
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
              body: "Java menuntut kejelasan: setiap variabel dideklarasikan dengan tipenya di depan. `int` untuk bilangan bulat, `double` untuk pecahan, dan `String` untuk teks (perhatikan S besar, `string` huruf kecil tidak dikenal compiler).\n\nUntuk menggabungkan teks dengan isi variabel, cukup pakai tanda tambah. Java merangkai semuanya jadi satu kalimat sebelum dicetak.",
              code: {
                language: "java",
                content:
                  'public class Main {\n  public static void main(String[] args) {\n    String nama = "Sinta";\n    int umur = 17;\n    System.out.println(nama + " berumur " + umur + " tahun");\n  }\n}',
                caption: "Tanda + merangkai teks dan isi variabel jadi satu kalimat.",
              },
            },
            {
              kind: "quiz",
              question: "Tipe data apa yang dipakai Java untuk menyimpan teks?",
              options: ["string", "String", "str", "Text"],
              answer: 1,
              explanation:
                "Di Java tipe teksnya `String` dengan S besar. Tulisan `string` huruf kecil akan membuat compiler protes.",
            },
            {
              kind: "code",
              title: "Perbaiki kartu nama yang rusak",
              prompt:
                "Kode ini seharusnya mencetak `Sinta - 17`. Ada satu kesalahan yang membuat program gagal dikompilasi. Cari dan perbaiki, lalu jalankan.",
              mode: "fix",
              template:
                'public class Main {\n  public static void main(String[] args) {\n    String nama = "Sinta";\n    int umur = 17;\n    System.out.println(nama + " - " + umr);\n  }\n}',
              solution:
                'public class Main {\n  public static void main(String[] args) {\n    String nama = "Sinta";\n    int umur = 17;\n    System.out.println(nama + " - " + umur);\n  }\n}',
              tests: [{ stdin: "", expectedOutput: "Sinta - 17" }],
              hints: [
                "Baca pesan error dari compiler: biasanya ada tulisan cannot find symbol beserta nama yang bermasalah.",
                "Variabelnya dideklarasikan sebagai umur, tapi yang digabung di akhir ditulis beda satu huruf.",
              ],
            },
          ],
        },
        {
          slug: "input-pengguna",
          title: "Membaca Input",
          summary: "Buat program yang berinteraksi: baca input dengan Scanner, lalu balas pengguna.",
          steps: [
            {
              kind: "theory",
              title: "Scanner: mendengarkan pengguna",
              body: "Java membaca input lewat class `Scanner` dari `java.util`. Buat dulu objeknya dengan `new Scanner(System.in)`, lalu pakai `sc.next()` untuk satu kata teks atau `sc.nextInt()` untuk bilangan bulat.\n\nDi platform ini, input berasal dari kotak *stdin* saat kode dijalankan, jadi kamu tidak perlu mengetik saat program berjalan.",
              code: {
                language: "java",
                content:
                  'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nama = sc.next();\n    int umur = sc.nextInt();\n    System.out.println("Tahun depan " + nama + " berumur " + (umur + 1));\n  }\n}',
                caption:
                  "Baris pertama stdin masuk ke nama, baris kedua ke umur. Kurung di (umur + 1) wajib, supaya dihitung sebelum digabung.",
              },
            },
            {
              kind: "quiz",
              question: "Method Scanner mana yang membaca satu bilangan bulat dari input?",
              options: ["sc.read()", "sc.next()", "sc.nextInt()", "sc.getNumber()"],
              answer: 2,
              explanation:
                "`nextInt()` membaca token berikutnya sebagai `int`. `next()` membacanya sebagai teks `String`, jadi tidak bisa langsung dihitung.",
            },
            {
              kind: "code",
              title: "Sapa pengguna dengan namanya",
              prompt:
                "Lengkapi program: baca satu kata nama dari input, lalu cetak `Halo, <nama>!`. Contoh: input `Sinta` menghasilkan keluaran `Halo, Sinta!`.",
              mode: "fill",
              template:
                'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nama = ___;\n    System.out.println("Halo, " + ___ + "!");\n  }\n}',
              solution:
                'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nama = sc.next();\n    System.out.println("Halo, " + nama + "!");\n  }\n}',
              tests: [
                { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
                { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
              ],
              hints: [
                "Bagian pertama memakai method Scanner yang membaca satu kata teks.",
                "Isi pertama: sc.next(). Isi kedua cukup nama variabelnya, tanpa tanda kutip.",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Alur Program",
      description: "Buat program yang mengambil keputusan, mengulang pekerjaan, dan dibagi menjadi method.",
      lessons: [
        {
          slug: "percabangan-if",
          title: "Percabangan if",
          summary: "Program yang bisa memilih: if dan else.",
          steps: [
            {
              kind: "theory",
              title: "Berpilih sesuai kondisi",
              body: "`if` menjalankan blok kurung kurawal hanya jika kondisinya benar, `else` menampung sisanya. Kondisi ditulis dalam kurung biasa, dan setiap perintah di dalam blok ditutup titik koma.\n\nOperator yang sering dipakai: `==` sama dengan, `!=` tidak sama, `>` `<` `>=` `<=`, dan `%` sisa bagi yang sering dipakai untuk cek genap atau ganjil.",
              code: {
                language: "java",
                content:
                  'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int angka = sc.nextInt();\n    if (angka % 2 == 0) {\n      System.out.println("genap");\n    } else {\n      System.out.println("ganjil");\n    }\n  }\n}',
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
                'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int angka = sc.nextInt();\n    if (angka ___ 2 == 0) {\n      System.out.println("genap");\n    } ___ {\n      System.out.println("ganjil");\n    }\n  }\n}',
              solution:
                'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int angka = sc.nextInt();\n    if (angka % 2 == 0) {\n      System.out.println("genap");\n    } else {\n      System.out.println("ganjil");\n    }\n  }\n}',
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
              body: "Pola `for` di Java punya tiga bagian dalam kurung: `for (int i = 1; i <= 5; i++)` berarti mulai dari 1, lanjut selama `i <= 5`, dan naik satu setiap putaran lewat `i++`.\n\nBedakan dua perintah cetak: `System.out.print` tetap di baris yang sama, sedangkan `System.out.println` pindah baris setelah selesai mencetak.",
              code: {
                language: "java",
                content:
                  'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      System.out.print(i + " ");\n    }\n    System.out.println();\n  }\n}',
                caption: "print tanpa ln tidak pindah baris, jadi angkanya berjajar dalam satu baris.",
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
                'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i < 5; i++) {\n      if (i > 1) {\n        System.out.print(" ");\n      }\n      System.out.print(i);\n    }\n    System.out.println();\n  }\n}',
              solution:
                'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      if (i > 1) {\n        System.out.print(" ");\n      }\n      System.out.print(i);\n    }\n    System.out.println();\n  }\n}',
              tests: [{ stdin: "", expectedOutput: "1 2 3 4 5" }],
              hints: [
                "Jalankan dulu dan lihat hasilnya: satu angka hilang di ujung.",
                "Kondisi i < 5 berhenti sebelum 5. Supaya 5 ikut, syaratnya harus i <= 5.",
              ],
            },
          ],
        },
        {
          slug: "fungsi-method",
          title: "Fungsi dan Method",
          summary: "Bungkus logika jadi method yang bisa dipakai ulang dengan return.",
          steps: [
            {
              kind: "theory",
              title: "Method: mendefinisikan sendiri perintah",
              body: "Method di Java menyebut dulu tipe hasilnya: `static int luasPersegiPanjang(int panjang, int lebar)` berarti method bernama luasPersegiPanjang menerima dua `int` dan mengembalikan `int`. Kata `static` penting supaya method bisa dipanggil langsung dari `main` yang juga static. Hasil dikirim balik dengan `return`.\n\nPisahkan urusan mencetak dari urusan menghitung: method yang baik menghitung dan mengembalikan nilai, pemanggil yang memutuskan mau diapakan.",
              code: {
                language: "java",
                content:
                  'public class Main {\n  static int luasPersegiPanjang(int panjang, int lebar) {\n    return panjang * lebar;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(luasPersegiPanjang(4, 3));\n  }\n}',
                caption: "Method menghitung, main mencetak.",
              },
            },
            {
              kind: "quiz",
              question: "Kata kunci apa yang mengirim hasil keluar dari method?",
              options: ["print", "return", "send", "yield"],
              answer: 1,
              explanation:
                "`return` mengembalikan nilai ke pemanggil dan langsung mengakhiri method. `System.out.println` hanya menampilkan, tidak mengirim nilai balik.",
            },
            {
              kind: "code",
              title: "Bangun method sapaan",
              prompt:
                "Lengkapi method `sapa` agar MENGEMBALIKAN teks `Halo, <nama>!`. Bagian main sudah benar, jangan diubah.",
              mode: "fill",
              template:
                'import java.util.Scanner;\n\npublic class Main {\n  static String sapa(String nama) {\n    ___ "Halo, " + nama + "!";\n  }\n\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nama = sc.next();\n    System.out.println(sapa(nama));\n  }\n}',
              solution:
                'import java.util.Scanner;\n\npublic class Main {\n  static String sapa(String nama) {\n    return "Halo, " + nama + "!";\n  }\n\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nama = sc.next();\n    System.out.println(sapa(nama));\n  }\n}',
              tests: [
                { stdin: "Dina", expectedOutput: "Halo, Dina!" },
                { stdin: "Rizky", expectedOutput: "Halo, Rizky!" },
              ],
              hints: [
                "Java merangkai teks dengan tanda tambah, jadi yang kurang hanya satu kata kunci.",
                "Untuk mengirim hasil keluar method, pakai return, bukan System.out.println.",
              ],
            },
          ],
        },
      ],
    },
  ],
  challenges: [
    {
      slug: "java-jumlah-dua-angka",
      title: "Jumlah Dua Angka",
      difficulty: "mudah",
      statement:
        "Baca dua bilangan bulat dari input (satu per baris), lalu cetak jumlahnya.\n\n**Format input**\nBaris 1: bilangan pertama\nBaris 2: bilangan kedua\n\n**Format output**\nSatu baris: hasil penjumlahan\n\n**Contoh**\nInput: `3` dan `4` menjadi `7`",
      starterCode:
        'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    // cetak jumlahnya\n  }\n}',
      tests: [
        { stdin: "3\n4", expectedOutput: "7" },
        { stdin: "-10\n25", expectedOutput: "15" },
        { stdin: "0\n0", expectedOutput: "0" },
      ],
      hints: [
        "Dua input sudah terbaca ke variabel a dan b, tinggal dijumlahkan.",
        "Cukup satu baris: System.out.println(a + b);",
      ],
      xpReward: 100,
    },
    {
      slug: "java-kata-terbalik",
      title: "Kata Terbalik",
      difficulty: "mudah",
      statement:
        "Baca satu kata, cetak kata yang sama dengan urutan karakter terbalik.\n\n**Format input**: satu kata tanpa spasi\n**Format output**: kata terbalik\n\n**Contoh**: input `kode` menjadi `edok`",
      starterCode:
        'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String teks = sc.next();\n    // cetak teks terbalik\n  }\n}',
      tests: [
        { stdin: "kode", expectedOutput: "edok" },
        { stdin: "abc", expectedOutput: "cba" },
        { stdin: "aaaa", expectedOutput: "aaaa" },
      ],
      hints: [
        "Ulangi dari indeks paling belakang: for (int i = teks.length() - 1; i >= 0; i--).",
        "Cetak tiap karakter dengan System.out.print(teks.charAt(i));, lalu tutup dengan System.out.println(); setelah loop selesai.",
      ],
      xpReward: 100,
    },
    {
      slug: "java-hitung-vokal",
      title: "Hitung Vokal",
      difficulty: "sedang",
      statement:
        "Baca satu baris teks kecil (huruf kecil semua, boleh ada spasi), hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Contoh**: input `belajar kode` menjadi `5` (e, a, a, o, e)",
      starterCode:
        'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String teks = sc.nextLine(); // membaca satu baris penuh, termasuk spasinya\n    int jumlah = 0;\n    // hitung vokalnya\n  }\n}',
      tests: [
        { stdin: "belajar kode", expectedOutput: "5" },
        { stdin: "xyz", expectedOutput: "0" },
        { stdin: "aaaaa", expectedOutput: "5" },
      ],
      hints: [
        "Ulangi setiap karakter: for (int i = 0; i < teks.length(); i++), lalu simpan char c = teks.charAt(i).",
        "Cek kelima vokal sekaligus: if (c == 'a' || c == 'i' || c == 'u' || c == 'e' || c == 'o'), lalu jumlah++.",
        "Terakhir, cetak jumlah dengan System.out.println(jumlah);",
      ],
      xpReward: 150,
    },
    {
      slug: "java-statistik-mini",
      title: "Statistik Mini",
      difficulty: "sulit",
      statement:
        "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput: `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```",
      starterCode:
        'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // baca n bilangan, catat terkecil, terbesar, dan totalnya\n    // cetak tiga baris: min, max, lalu rata dengan dua angka desimal\n  }\n}',
      tests: [
        { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
        { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
        { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00" },
      ],
      hints: [
        "Siapkan variabel terkecil dan terbesar. Saat membaca bilangan pertama, jadikan keduanya bilangan itu, lalu bandingkan untuk setiap bilangan berikutnya.",
        "Hitung rata-ratanya pecahan: (double) total / n.",
        'Satu printf menyelesaikan semuanya: System.out.printf("min: %d\\nmax: %d\\nrata: %.2f\\n", terkecil, terbesar, (double) total / n);',
      ],
      xpReward: 250,
    },
  ],
  projects: [
    {
      slug: "java-konverter-detik",
      title: "Konverter Detik",
      summary: "Pengurai waktu: ubah total detik menjadi jam, menit, dan detik.",
      brief:
        "Kamu diminta membuat pengurai waktu untuk papan skor. Program membaca satu bilangan bulat berupa total detik, lalu mengurainya menjadi jam, menit, dan detik.\n\n**Format input**\nBaris 1: total detik (int, 0 sampai 86399)\n\n**Format output**\nSatu baris: `<h> jam <m> menit <s> detik`",
      steps: [
        {
          title: "Rancang input dan output",
          detail:
            "Baca satu bilangan dengan Scanner, lalu siapkan variabel jam, menit, dan detik.",
          hint: "int total = sc.nextInt(); cukup untuk seluruh input karena hanya ada satu baris.",
        },
        {
          title: "Pecah dengan bagi dan sisa bagi",
          detail:
            "Satu jam 3600 detik dan satu menit 60 detik. Operator / memberi hasil bagi bulat dan % memberi sisanya.",
          hint: "jam = total / 3600; sisa = total % 3600; lalu menit = sisa / 60; dan detik = sisa % 60;",
        },
        {
          title: "Bungkus dalam method",
          detail:
            "Pindahkan perhitungan dan penyusunan kalimat ke method static String format(int total) agar mudah dipakai ulang.",
          hint: 'Method mengembalikan jam + " jam " + menit + " menit " + detik + " detik".',
        },
        {
          title: "Cetak dan uji dengan kasus nyata",
          detail:
            "Cetak hasil method dari main. Uji dengan input 3665 yang benar hasilnya 1 jam 1 menit 5 detik. Lalu kumpulkan lewat tombol Kumpulkan di bawah.",
          hint: "Jaga jaraknya tetap satu spasi di tiap batas kata, misalnya jam + \" jam \" + menit.",
        },
      ],
      finalTests: [
        { stdin: "3665", expectedOutput: "1 jam 1 menit 5 detik" },
        { stdin: "59", expectedOutput: "0 jam 0 menit 59 detik" },
        { stdin: "86399", expectedOutput: "23 jam 59 menit 59 detik" },
      ],
      xpReward: 300,
    },
  ],
};
