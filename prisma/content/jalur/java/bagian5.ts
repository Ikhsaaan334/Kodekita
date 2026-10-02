import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "java",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Java Modern",
      description: "Record, sealed class, text block, switch expression, dan LocalDateTime.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description: "Struktur proyek, JUnit dasar, build jar, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: Java Modern ====================
    {
      slug: "jdk-record-dasar",
      title: "Record: Data Carrier Ringkas",
      summary: "Satu baris deklarasi menghasilkan constructor, accessor, equals, hashCode, dan toString.",
      steps: [
        {
          kind: "theory",
          title: "Class yang hanya membawa data",
          body: "Banyak class di Java tidak punya perilaku menarik: ia hanya membawa data. Padahal menulisnya tetap panjang: field, constructor, getter, lalu equals, hashCode, dan toString yang kalau dilupakan malah jadi bug, misalnya dua objek berisi sama dianggap berbeda karena perbandingan memakai referensi. Java 16 memperkenalkan record untuk kasus ini: satu baris deklarasi, sisanya digenerate compiler.\n\n`record Produk(String nama, int harga) {}` langsung memberi constructor lengkap, accessor bernama sama dengan komponennya (`nama()` dan `harga()`, bukan `getNama()`), equals dan hashCode berbasis nilai seluruh komponen, serta toString berformat `Produk[nama=..., harga=...]`. Coba perhatikan contoh di bawah, terutama bahwa dua record berisi sama memang dibandingkan sama.\n\nRecord itu immutable: semua komponennya final dan tidak ada setter. Butuh nilai berbeda berarti membuat objek baru. Karena sifat itu, record cocok untuk data yang sekali dibuat lalu hanya dibaca: baris hasil query, butir laporan, koordinat, atau pesan antarbagian. Kalau datanya memang berubah-ubah sepanjang hidupnya, class biasa masih tempat yang tepat.",
          code: {
            language: "java",
            content: `public class Main {
    record Produk(String nama, int harga) {}

    public static void main(String[] args) {
        Produk p = new Produk("Kopi", 20000);
        System.out.println(p.nama());   // Kopi, bukan getNama()
        System.out.println(p);          // Produk[nama=Kopi, harga=20000]
        System.out.println(p.equals(new Produk("Kopi", 20000))); // true
    }
}`,
            caption: "Constructor, accessor, equals, hashCode, dan toString hadir otomatis.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk record `record User(String nama, int umur) {}`, bagaimana cara membaca field `nama` dari objek `user`?",
          options: ["user.getNama()", "user.nama()", "user.nama", "User.nama()"],
          answer: 1,
          explanation:
            "Accessor record bernama sama dengan komponennya, jadi pemanggilannya user.nama(). Tidak ada awalan get seperti getter gaya class biasa.",
        },
        {
          kind: "code",
          title: "Bangun record Produk",
          prompt:
            "Program membaca `n`, lalu `n` baris berformat `nama harga`, dan mencetak tiap produk berformat `nama - harga` serta `Total: X` berisi jumlah semua harga. Lengkapi tiga `___`: nama record, pembuatan objeknya, dan accessor harga.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    record ___(String nama, int harga) {}

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long total = 0;
        for (int i = 0; i < n; i++) {
            Produk p = new ___(in.next(), in.nextInt());
            total += p.___();
            System.out.println(p.nama() + " - " + p.harga());
        }
        System.out.println("Total: " + total);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    record Produk(String nama, int harga) {}

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long total = 0;
        for (int i = 0; i < n; i++) {
            Produk p = new Produk(in.next(), in.nextInt());
            total += p.harga();
            System.out.println(p.nama() + " - " + p.harga());
        }
        System.out.println("Total: " + total);
    }
}`,
          tests: [
            { stdin: "2\nKopi 20000\nGula 15000", expectedOutput: "Kopi - 20000\nGula - 15000\nTotal: 35000" },
            { stdin: "1\nPensil 3000", expectedOutput: "Pensil - 3000\nTotal: 3000" },
            { stdin: "3\nA 100\nB 250\nC 50", expectedOutput: "A - 100\nB - 250\nC - 50\nTotal: 400", hidden: true },
          ],
          hints: [
            "Record dideklarasikan dengan kata kunci record, diikuti nama dan daftar komponennya.",
            "Membuat objek record tetap memakai new, persis seperti memanggil constructor class biasa.",
            "Accessor record bernama sama dengan komponennya: harga() untuk komponen harga.",
          ],
        },
      ],
    },
    {
      slug: "jdk-record-compact-constructor",
      title: "Compact Constructor Record",
      summary: "Normalisasi dan validasi data langsung di constructor ringkas record.",
      steps: [
        {
          kind: "theory",
          title: "Merapikan data di pintu masuk",
          body: "Data yang masuk sering perlu dirapikan dulu: teks di-trim, angka negatif yang mustahil diganti nol, atau format yang diseragamkan. Record menyediakan tempat khusus untuk itu bernama compact constructor: ditulis tanpa daftar parameter dan tanpa penugasan field, cukup kata kunci record-nya saja diikuti blok.\n\nDi dalamnya, nama parameter sama dengan nama komponen. Setiap perubahan nilai parameter otomatis menjadi nilai field saat constructor selesai. Pada contoh di bawah, `Waktu(-3, 45)` tersimpan sebagai jam 0 tanpa satu baris `this.jam = ...` pun, karena penugasan itu diurus compiler di akhir blok.\n\nDua aturan yang sering menjebak. Pertama, compact constructor tidak boleh menulis `this.jam = jam;` karena field sudah ditugaskan otomatis; itu error kompilasi. Kedua, kalau data benar-benar tidak layak diterima, lempar exception seperti `IllegalArgumentException`, sehingga objek dalam keadaan salah tidak pernah jadi.",
          code: {
            language: "java",
            content: `public class Main {
    record Waktu(int jam, int menit) {
        Waktu {
            if (jam < 0) {
                jam = 0;   // normalisasi, tanpa this.jam = ...
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(new Waktu(-3, 45)); // Waktu[jam=0, menit=45]
    }
}`,
            caption: "Ubah parameter di compact constructor, compiler yang menugaskannya ke field.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila compact constructor menulis `this.saldo = saldo;`?",
          options: [
            "Tidak apa-apa, nilainya ditulis dua kali",
            "Error kompilasi karena field sudah ditugaskan otomatis oleh compact constructor",
            "Field saldo menjadi null",
            "Constructor berubah menjadi constructor biasa secara otomatis",
          ],
          answer: 1,
          explanation:
            "Compact constructor menugaskan seluruh field dari parameter di akhir bloknya. Menulis this.saldo = saldo di dalamnya ditolak compiler: variable saldo sudah dianggap assigned.",
        },
        {
          kind: "code",
          title: "Perbaiki compact constructor Waktu",
          prompt:
            "Record `Waktu` seharusnya menormalisasi jam negatif menjadi 0 dan menyimpan menit apa adanya. Program ini gagal kompilasi karena ada satu kesalahan di compact constructor-nya. Cari dan perbaiki, lalu jalankan tesnya.",
          mode: "fix",
          template: `import java.util.Scanner;

public class Main {
    record Waktu(int jam, int menit) {
        Waktu {
            if (jam < 0) {
                jam = 0;
            }
            this.jam = jam;
        }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Waktu w = new Waktu(in.nextInt(), in.nextInt());
        System.out.println(w.jam() + ":" + w.menit());
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    record Waktu(int jam, int menit) {
        Waktu {
            if (jam < 0) {
                jam = 0;
            }
        }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Waktu w = new Waktu(in.nextInt(), in.nextInt());
        System.out.println(w.jam() + ":" + w.menit());
    }
}`,
          tests: [
            { stdin: "9\n30", expectedOutput: "9:30" },
            { stdin: "-3\n45", expectedOutput: "0:45" },
            { stdin: "-10\n5", expectedOutput: "0:5", hidden: true },
          ],
          hints: [
            "Baca pesan compiler: ia menyebut variable jam might already have been assigned.",
            "Compact constructor menugaskan semua field otomatis dari parameter di akhir badannya.",
            "Cukup hapus baris this.jam = jam; sisanya sudah benar.",
          ],
        },
      ],
    },
    {
      slug: "jdk-sealed-class",
      title: "Sealed Class: Hierarki Terkendali",
      summary: "Kunci daftar subclass dengan sealed dan permits, lalu panen manfaatnya di switch.",
      steps: [
        {
          kind: "theory",
          title: "Daftar bentuk yang ditutup",
          body: "Interface dan class biasa bisa di-extends oleh siapa saja. Padahal banyak konsep domain memang jumlah bentuknya terbatas: pembayaran hanya bisa transfer atau e-wallet, bentuk geometri yang didukung hanya lingkaran dan persegi. Untuk kasus seperti itu Java 17 menyediakan `sealed`: deklarasi interface atau class ditutup klausa `permits` yang menyebut satu per satu subclass yang sah.\n\nSetiap subclass yang disebut wajib memilih salah satu dari tiga: `final` untuk menutupnya dari di-extends lagi, `sealed` untuk melanjutkan penguncian ke bawah, atau `non-sealed` untuk membukanya kembali untuk siapa saja. Kabar baiknya record sudah final secara implisit, jadi record yang implements sealed interface tidak butuh kata tambahan. Subclass di luar daftar permits langsung ditolak compiler.\n\nKombinasi ini paling terasa saat dipadukan dengan switch pattern matching. Karena daftar bentuknya tertutup, compiler tahu seluruh kemungkinan dan menganggap switch lengkap tanpa `default`. Menambah bentuk baru berarti menyentuh daftar permits, dan compiler menunjuk semua switch yang belum menanganinya.",
          code: {
            language: "java",
            content: `public sealed interface Bentuk permits Lingkaran, Persegi {}

record Lingkaran(double r) implements Bentuk {}
record Persegi(double sisi) implements Bentuk {}

static double luas(Bentuk b) {
    return switch (b) {
        case Lingkaran l -> Math.PI * l.r() * l.r();
        case Persegi p -> p.sisi() * p.sisi();
    }; // tanpa default, tetap dianggap lengkap
}`,
            caption: "Sealed membuat switch tanpa default tetap dianggap menutup semua kemungkinan.",
          },
        },
        {
          kind: "quiz",
          question: "Subclass yang disebut dalam klausa `permits` wajib memilih salah satu modifier. Modifier mana yang menutup subclass itu dari di-extends lagi?",
          options: ["static", "abstract", "final", "private"],
          answer: 2,
          explanation:
            "Pilihannya final, sealed, atau non-sealed. final berarti rantai pewarisan berhenti di class itu. Catatan: record sudah final secara implisit.",
        },
        {
          kind: "quiz",
          question: "Apa manfaat utama sealed class saat dipadukan dengan switch pattern matching?",
          options: [
            "Switch selalu berjalan lebih cepat tanpa syarat",
            "Compiler memastikan semua kemungkinan tipe tertangani, sehingga default bisa ditiadakan",
            "Subclass baru bisa ditambahkan dari file lain tanpa mengubah kode apa pun",
            "Sealed interface tidak perlu di-implements oleh subclassnya",
          ],
          answer: 1,
          explanation:
            "Daftar subclass yang tertutup membuat compiler bisa memeriksa kelengkapan switch. Begitu ada bentuk baru, semua switch yang belum menanganinya ditandai sebagai error.",
        },
      ],
    },
    {
      slug: "jdk-text-block",
      title: "Text Block untuk Teks Multiline",
      summary: "Tulis JSON, SQL, atau HTML multiline apa adanya dengan tiga tanda kutip.",
      steps: [
        {
          kind: "theory",
          title: "Tiga tanda kutip untuk teks panjang",
          body: "Menyimpan JSON atau SQL di String biasa berarti kabur dari escape: setiap tanda kutip diawali backslash dan tiap ganti baris disambung `+`. Sejak Java 15 ada text block: teks dibuka dengan `\"\"\"`, boleh melintasi banyak baris, dan tanda kutip di dalamnya ditulis apa adanya tanpa escape.\n\nJava memangkas indentasi yang disebut insidental: posisi `\"\"\"` penutup (atau baris paling kiri konten) menjadi patokan, dan sisa indentasi relatifnya itulah yang tersimpan. Spasi di ujung tiap baris dibuang, baris baru setelah `\"\"\"` pembuka tidak dihitung, sedangkan pindah baris di dalam konten tetap tersimpan. Pada contoh di bawah, JSON keluar rapi dengan indentasi empat spasi karena konten menjorok dua kali lipat dari penutupnya.\n\nPasangan yang nyaman untuk text block adalah `formatted(...)`: placeholder `%s` (teks) dan `%d` (bilangan bulat) menggantikan penyambungan `+` yang panjang. Kalau memang butuh spasi di ujung baris agar tersimpan, ada escape khusus `\\s` yang melindunginya dari pemangkasan.",
          code: {
            language: "java",
            content: `String json = """
        {
            "nama": "Kopi",
            "stok": 12
        }
        """;
System.out.print(json);`,
            caption: "Indentasi mengikuti posisi kutip penutup; kutip di dalam teks tidak perlu di-escape.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan text block berikut.\n\n```java\nString s = \"\"\"\n    halo\n    \"\"\";\n```\n\nApa isi variabel `s`?",
          options: ['"halo"', '"halo\\n"', '"\\n    halo\\n    "', "Kompilasi gagal"],
          answer: 1,
          explanation:
            "Baris setelah pembuka tidak dihitung, indentasi empat spasi tergolong insidental dan terpangkas mengikuti posisi penutup, sedangkan pindah baris setelah halo tetap tersimpan. Hasilnya halo diikuti satu baris baru.",
        },
        {
          kind: "code",
          title: "Cetak laporan JSON dengan text block",
          prompt:
            "Program membaca nama (satu kata) dan stok (bilangan bulat), lalu mencetak JSON persis dengan bentuk di bawah ini. Lengkapi dua `___`: pembuka text block dan pengisi placeholder.\n\n```\n{\n    \"nama\": \"Kopi\",\n    \"stok\": 12\n}\n```",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String nama = in.next();
        int stok = in.nextInt();
        String json = ___
        {
            "nama": "%s",
            "stok": %d
        }
        ___(nama, stok);
        System.out.print(json);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String nama = in.next();
        int stok = in.nextInt();
        String json = """
        {
            "nama": "%s",
            "stok": %d
        }
        """.formatted(nama, stok);
        System.out.print(json);
    }
}`,
          tests: [
            { stdin: "Kopi\n12", expectedOutput: '{\n    "nama": "Kopi",\n    "stok": 12\n}' },
            { stdin: "Teh\n0", expectedOutput: '{\n    "nama": "Teh",\n    "stok": 0\n}' },
            { stdin: "Susu\n150", expectedOutput: '{\n    "nama": "Susu",\n    "stok": 150\n}', hidden: true },
          ],
          hints: [
            "Text block dibuka dan ditutup dengan tiga tanda kutip berturut-turut.",
            "Placeholder %s mengisi teks dan %d mengisi bilangan bulat, keduanya diisi lewat formatted(...).",
            "Baris penutupnya berbunyi: \"\"\".formatted(nama, stok);",
          ],
        },
      ],
    },
    {
      slug: "jdk-switch-expression",
      title: "Switch Expression dengan Arrow",
      summary: "Cabang tanpa fallthrough yang mengembalikan nilai langsung.",
      steps: [
        {
          kind: "theory",
          title: "Dari pernyataan menjadi expression",
          body: "Switch lama gaya `case X: ... break;` punya satu lubang klasik bernama fallthrough: lupa `break` membuat eksekusi jatuh ke case berikutnya tanpa suara. Bentuk arrow yang final sejak Java 14 menutup lubang itu: `case \"A\" ->` menjalankan satu cabang saja, tidak ada jebol ke bawah, dan tidak perlu `break`.\n\nLebih penting lagi, switch sekarang bisa menjadi expression: ia menghasilkan nilai yang langsung ditampung. `String label = switch (kode) { case \"SEN\" -> \"kerja\"; default -> \"lain\"; };` membaca seperti tabel pemetaan. Untuk cabang berisi beberapa baris, gunakan blok `{ ... }` dan kirim hasilnya dengan `yield`. Beberapa nilai bisa berbagi cabang lewat `case \"A\", \"B\" ->`.\n\nKonsekuensi bentuk expression: switch harus lengkap. Untuk String atau int, artinya wajib ada `default`. Untuk enum dan sealed type, compiler bisa memeriksa kelengkapan tanpa default, seperti yang dibahas pada lesson sealed class. Pilih switch expression saat setiap masukan harus menghasilkan satu nilai keluaran; itu pola paling umum di kode Java modern.",
          code: {
            language: "java",
            content: `String kategori = switch (kode) {
    case "SEN", "SEL" -> "hari kerja";
    case "MIN" -> "hari libur";
    default -> "tidak dikenal";
};`,
            caption: "Satu cabang satu hasil, tanpa break, tanpa fallthrough.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keuntungan bentuk arrow `case \"A\" ->` dibanding bentuk kolon `case \"A\":` pada switch?",
          options: [
            "Tidak perlu break karena tidak ada fallthrough antarcabang",
            "Bisa dipakai tanpa variabel yang dibandingkan",
            "Setiap cabang dijalankan dua kali demi keamanan",
            "Cabang default menjadi tidak wajib dalam kondisi apa pun",
          ],
          answer: 0,
          explanation:
            "Cabang arrow mengeksekusi kode di kanannya saja lalu berhenti. Fallthrough tidak ada, jadi break yang jadi sumber bug klasik itu tidak dibutuhkan lagi.",
        },
        {
          kind: "code",
          title: "Konversi kode kategori menjadi poin",
          prompt:
            "Program membaca satu kode kategori dan mencetak poinnya: `A` bernilai 100, `B` bernilai 75, `C` bernilai 50, selain itu 0. Keluaran berformat `Poin: X`. Lengkapi tiga `___` pada switch expression-nya.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String kode = in.next();
        int poin = ___ (kode) {
            case "A" -> 100;
            case "B" ___ 75;
            case "C" -> 50;
            ___ -> 0;
        };
        System.out.println("Poin: " + poin);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String kode = in.next();
        int poin = switch (kode) {
            case "A" -> 100;
            case "B" -> 75;
            case "C" -> 50;
            default -> 0;
        };
        System.out.println("Poin: " + poin);
    }
}`,
          tests: [
            { stdin: "A", expectedOutput: "Poin: 100" },
            { stdin: "C", expectedOutput: "Poin: 50" },
            { stdin: "Z", expectedOutput: "Poin: 0", hidden: true },
          ],
          hints: [
            "Kata kunci yang memulai switch expression adalah switch sendiri.",
            "Tanda panah cabang arrow ditulis sebagai minus diikuti lebih besar dari.",
            "Cabang penampung semua nilai lain bernama default.",
          ],
        },
      ],
    },
    {
      slug: "jdk-pattern-matching-switch",
      title: "Pattern Matching untuk switch",
      summary: "Cabang berpola tipe dengan cast aman, syarat when, dan urutan yang benar.",
      steps: [
        {
          kind: "theory",
          title: "Mengolah tipe campuran tanpa instanceof berantai",
          body: "Mengolah data bertipe campuran dulu berarti `instanceof` di satu cabang, cast manual di baris berikutnya, dan berulang untuk tiap tipe. Java 21 mematok pattern matching untuk switch: setiap case boleh menyebut pola tipe seperti `case Integer i ->`, dan variabel `i` langsung terisi dengan cast yang sudah aman, siap dipakai di cabangnya.\n\nPola bisa diberi syarat tambahan lewat `when`: `case String s when s.isBlank()` hanya menangkap String yang kosong, sisanya jatuh ke `case String s` di bawahnya. Karena itu urutan penting: pola yang lebih spesifik ditaruh di atas, dan compiler menolak cabang yang mustahil terjangkau karena tertutup cabang sebelumnya. Nilai `null` pun bisa ditangani rapi dengan `case null`, alih-alih melempar NullPointerException.\n\nUntuk `Object` biasa yang jenisnya tak terbatas, tetap sediakan `default` sebagai penampung sisanya. Kombinasi yang paling produktif justru sealed plus pattern switch: sealed mengunci daftar tipe, switch memetakan tiap tipe ke perlakuannya, dan compiler menjaga keduanya tetap sinkron.",
          code: {
            language: "java",
            content: `static String ringkas(Object data) {
    return switch (data) {
        case null -> "kosong";
        case Integer i when i < 0 -> "angka negatif";
        case Integer i -> "angka " + i;
        case String s -> "teks " + s.length();
        default -> "lain";
    };
}`,
            caption: "Pola tipe, syarat when, dan urutan dari paling spesifik ke paling umum.",
          },
        },
        {
          kind: "quiz",
          question: "Pada switch over `Object`, cabang mana yang menangani seluruh nilai bertipe Integer?",
          options: ["case int:", "case Integer i ->", "case is Integer ->", "case typeof Integer ->"],
          answer: 1,
          explanation:
            "Pola tipe ditulis dengan nama tipenya diikuti nama variabel: case Integer i. Karena generics tidak menampung primitif, polanya memakai wrapper Integer, bukan int.",
        },
        {
          kind: "quiz",
          question: "Apa fungsi klausa `when` pada `case String s when s.isEmpty() ->`?",
          options: [
            "Menandai cabang yang tidak pernah dijalankan",
            "Menambahkan syarat: cabang dipakai hanya bila s.isEmpty() benar",
            "Mengubah s menjadi boolean",
            "Mewajibkan default ditulis di bawahnya",
          ],
          answer: 1,
          explanation:
            "when adalah penyaring di atas pola tipe. String yang tidak lolos syarat jatuh ke cabang berikutnya yang cocok, misalnya case String s tanpa when.",
        },
      ],
    },
    {
      slug: "jdk-localdatetime",
      title: "LocalDateTime dan Format",
      summary: "Bangun tanggal-jam, format dengan pola, dan geser waktunya dengan aman.",
      steps: [
        {
          kind: "theory",
          title: "Waktu modern tanpa kejutan",
          body: "Paket `java.time` (sejak Java 8) adalah tanggal-waktu modern yang menggantikan Date dan Calendar. `LocalDate` untuk tanggal saja, `LocalTime` untuk jam saja, dan `LocalDateTime` menggabungkan keduanya. Semuanya immutable: method seperti `plusDays` dan `plusHours` tidak mengubah objek lama, ia mengembalikan objek baru berisi hasil.\n\nUntuk membuat nilai tanpa bergantung jam mesin, pakai `LocalDateTime.of(2026, 10, 1, 9, 30)`. Untuk tampilan, `DateTimeFormatter.ofPattern(\"dd-MM-yyyy HH:mm\")` memformat sesuai pola: `dd` tanggal dua digit, `MM` bulan dua digit, `yyyy` tahun, `HH` jam 00 sampai 23, dan `mm` menit. Perhatikan bahwa `MM` besar untuk bulan beda dengan `mm` kecil untuk menit; tertukar di sini menghasilkan keluaran yang tampak tidak masuk akal.\n\nAritmetika waktunya jujur dan sederhana: `waktu.plus(90, ChronoUnit.MINUTES)` menggeser 90 menit. Bila hasilnya melewati tengah malam, akhir bulan, atau akhir tahun, LocalDateTime bergulir otomatis ke nilai kalender yang benar. Tidak perlu lagi menghitung sisa hari bulan dengan tangan seperti di era Calendar.",
          code: {
            language: "java",
            content: `LocalDateTime mulai = LocalDateTime.of(2026, 10, 1, 9, 30);
LocalDateTime selesai = mulai.plus(90, ChronoUnit.MINUTES);
DateTimeFormatter pola = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
System.out.println(selesai.format(pola)); // 01-10-2026 11:00`,
            caption: "Format dan geser waktu tanpa mengubah objek aslinya.",
          },
        },
        {
          kind: "code",
          title: "Hitung waktu selesai rapat",
          prompt:
            "Input berisi lima angka: `tahun bulan tanggal jam menit` untuk waktu mulai rapat. Rapat berlangsung 90 menit. Cetak dua baris `Mulai: ...` dan `Selesai: ...` berformat `dd-MM-yyyy HH:mm`. Lengkapi dua `___`.",
          mode: "fill",
          template: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int t = in.nextInt();
        int b = in.nextInt();
        int h = in.nextInt();
        int j = in.nextInt();
        int m = in.nextInt();
        LocalDateTime mulai = LocalDateTime.___(t, b, h, j, m);
        LocalDateTime selesai = mulai.plus(90, ChronoUnit.MINUTES);
        DateTimeFormatter pola = DateTimeFormatter.___("dd-MM-yyyy HH:mm");
        System.out.println("Mulai: " + mulai.format(pola));
        System.out.println("Selesai: " + selesai.format(pola));
    }
}`,
          solution: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int t = in.nextInt();
        int b = in.nextInt();
        int h = in.nextInt();
        int j = in.nextInt();
        int m = in.nextInt();
        LocalDateTime mulai = LocalDateTime.of(t, b, h, j, m);
        LocalDateTime selesai = mulai.plus(90, ChronoUnit.MINUTES);
        DateTimeFormatter pola = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        System.out.println("Mulai: " + mulai.format(pola));
        System.out.println("Selesai: " + selesai.format(pola));
    }
}`,
          tests: [
            { stdin: "2026 10 1 9 30", expectedOutput: "Mulai: 01-10-2026 09:30\nSelesai: 01-10-2026 11:00" },
            { stdin: "2026 12 31 23 0", expectedOutput: "Mulai: 31-12-2026 23:00\nSelesai: 01-01-2027 00:30" },
            { stdin: "2027 3 14 6 5", expectedOutput: "Mulai: 14-03-2027 06:05\nSelesai: 14-03-2027 07:35", hidden: true },
          ],
          hints: [
            "Method statis untuk membangun LocalDateTime dari angka tahun, bulan, tanggal, jam, dan menit bernama of.",
            "Method pembuat formatter dari teks pola bernama ofPattern.",
          ],
        },
      ],
    },
    {
      slug: "jdk-duration-period",
      title: "Duration dan Period",
      summary: "Mengukur jarak waktu: presisi dengan Duration, kalender dengan Period.",
      steps: [
        {
          kind: "theory",
          title: "Dua kelas untuk dua pertanyaan beda",
          body: "Java memisahkan dua cara mengukur jarak waktu. `Duration` menjawab berapa lama secara presisi: jam, menit, detik, sampai nanodetik. `Period` menjawab berapa lama secara kalender: tahun, bulan, hari. Duration bekerja dengan LocalTime dan LocalDateTime, sedangkan Period bekerja dengan LocalDate.\n\nKeduanya dibuat dengan method statis `between`: `Duration.between(mulai, selesai)` untuk selisih waktu, `Period.between(tanggalA, tanggalB)` untuk selisih tanggal. Hasil Duration dibaca lewat `toMinutes()`, `toHours()`, atau `getSeconds()`, sedangkan hasil Period lewat `getDays()`, `getMonths()`, dan `getYears()`.\n\nPerbedaan perilakunya penting dipahami: Duration murni detik dan mengabaikan kalender, sedangkan Period memahami kalender, jadi jarak satu bulan dari 31 Januari tetap dihitung satu bulan, bukan 28 atau 31 hari. Pilih berdasarkan pertanyaan yang dijawab: lama sidang atau lama proses pakai Duration, usia atau masa kontrak pakai Period.",
          code: {
            language: "java",
            content: `LocalTime a = LocalTime.of(9, 0);
LocalTime b = LocalTime.of(11, 30);
Duration d = Duration.between(a, b);
System.out.println(d.toMinutes()); // 150`,
            caption: "between menghitung selisihnya, toMinutes menerjemahkannya ke menit.",
          },
        },
        {
          kind: "code",
          title: "Durasi kerja dari jam masuk dan pulang",
          prompt:
            "Input empat angka: `jam menit` waktu masuk dan `jam menit` waktu pulang pada hari yang sama (pulang tidak lebih awal dari masuk). Cetak `Total menit: X`, lalu satu baris berformat `X jam Y menit`. Lengkapi dua `___`.",
          mode: "fill",
          template: `import java.time.Duration;
import java.time.LocalTime;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        LocalTime masuk = LocalTime.of(in.nextInt(), in.nextInt());
        LocalTime pulang = LocalTime.of(in.nextInt(), in.nextInt());
        Duration durasi = Duration.___(masuk, pulang);
        long total = durasi.___();
        System.out.println("Total menit: " + total);
        System.out.println((total / 60) + " jam " + (total % 60) + " menit");
    }
}`,
          solution: `import java.time.Duration;
import java.time.LocalTime;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        LocalTime masuk = LocalTime.of(in.nextInt(), in.nextInt());
        LocalTime pulang = LocalTime.of(in.nextInt(), in.nextInt());
        Duration durasi = Duration.between(masuk, pulang);
        long total = durasi.toMinutes();
        System.out.println("Total menit: " + total);
        System.out.println((total / 60) + " jam " + (total % 60) + " menit");
    }
}`,
          tests: [
            { stdin: "9 0\n11 30", expectedOutput: "Total menit: 150\n2 jam 30 menit" },
            { stdin: "8 15\n8 15", expectedOutput: "Total menit: 0\n0 jam 0 menit" },
            { stdin: "7 45\n16 20", expectedOutput: "Total menit: 515\n8 jam 35 menit", hidden: true },
          ],
          hints: [
            "Method statis Duration untuk menghitung selisih dua waktu bernama between.",
            "Untuk membaca durasi sebagai jumlah menit, gunakan toMinutes().",
          ],
        },
      ],
    },
    {
      slug: "jdk-var-best-practice",
      title: "var: Kapan Dipakai",
      summary: "Aturan praktis memakai penulisan tipe singkat tanpa mengorbankan keterbacaan.",
      steps: [
        {
          kind: "theory",
          title: "Dari aturan ke selera kerja",
          body: "Modul awal jalur ini sudah memperkenalkan `var`: tipe lokal yang disimpulkan compiler. Sekarang sisi praktiknya. Aturan yang dipakai banyak tim sederhana: pakai var saat tipenya terbaca langsung dari sisi kanan, seperti `var sb = new StringBuilder();` atau `var daftar = new ArrayList<String>();`, dan hindari saat sisi kanan tidak bicara apa-apa, seperti `var hasil = proses(data);`.\n\nvar paling terasa menghemat pada generik yang panjang: `var indeks = new HashMap<String, List<Integer>>();` menghindari penulisan tipe yang sama dua kali dalam satu baris. Hati-hati justru pada literal angka: `var x = 5` berarti int, `var y = 5.0` berarti double, dan `var z = 5L` berarti long. Salah satu karakter itu bisa diam-diam mengubah hasil pembagian di baris berikutnya.\n\nUkuran akhirnya soal pembaca: kalau orang yang membaca harus membuka definisi method hanya untuk tahu tipe variabelnya, tulis tipe eksplisit. Dengan sisi kanan yang jujur dan nama variabel yang jelas, var menjadi pemanis keterbacaan, bukan kabut yang menutupinya.",
          code: {
            language: "java",
            content: `var sb = new StringBuilder();              // jelas: StringBuilder
var indeks = new HashMap<String, List<Integer>>(); // menghemat tulisan panjang

var rasio = 10 / 4;   // int 2, bukan 2.5: kedua operan int
var desimal = 10 / 4.0; // double 2.5`,
            caption: "var meringkas penulisan, tipenya tetap pasti dan tidak berubah.",
          },
        },
        {
          kind: "quiz",
          question: "Deklarasi mana yang paling membingungkan pembaca bila ditulis dengan var?",
          options: [
            "var sb = new StringBuilder();",
            "var jumlah = daftar.size();",
            "var hasil = proses(data);",
            'var teks = "hai";',
          ],
          answer: 2,
          explanation:
            "Tipe kembalian proses(data) tidak terlihat dari sisi kanan, jadi pembaca terpaksa membuka definisinya. Untuk kasus seperti ini tipe eksplisit lebih membantu.",
        },
        {
          kind: "quiz",
          question: "Apa tipe dan nilai dari `var rasio = 10 / 4;`?",
          options: ["double bernilai 2.5", "int bernilai 2", "double bernilai 2.0", "int bernilai 3"],
          answer: 1,
          explanation:
            "Kedua operan bertipe int, jadi pembagiannya pembagian bulat: hasil 2 bertipe int. Untuk mendapat 2.5, minimal satu operan harus ditulis 4.0 atau di-cast ke double.",
        },
      ],
    },
    {
      slug: "jdk-latihan-gabungan",
      title: "Latihan Gabungan Java Modern",
      summary: "Record, switch expression, dan fungsi murni bekerja sama di satu program diskon.",
      steps: [
        {
          kind: "theory",
          title: "Tiga fitur, satu program kecil",
          body: "Latihan modul ini menggabungkan apa yang baru saja kamu pelajari: record sebagai data carrier, switch expression sebagai tabel aturan, dan loop biasa sebagai alur program. Pola seperti ini persis gaya kode Java produksi: data yang tak berubah, aturan yang dipetakan lewat switch, dan program utama yang hanya mengatur alur masuk keluar.\n\nSoalnya tentang diskon tiket. Tiap tiket dibaca berformat `jenis harga`. Jenis `REG` tanpa potongan, `STD` dipotong 10 persen, `VIP` dipotong 25 persen, dan jenis lain diperlakukan tanpa potongan. Perhatikan bahwa perhitungan memakai pembagian bulat Java: `harga * 90 / 100`. Urutan kali dulu baru bagi inilah yang menjaga hasil tetap presisi untuk harga kelipatan 10, dan tetap deterministik untuk harga lain.\n\nSatu kebiasaan yang ingin tertanam dari latihan ini: pisahkan data (record), aturan (fungsi murni seperti hargaAkhir), dan alur (main). Fungsi murni yang masukannya sama selalu berkeluaran sama itulah yang paling mudah diuji, dan di modul berikutnya ia langsung dipakai sebagai bahan unit test.",
          code: {
            language: "java",
            content: `record Tiket(String jenis, int harga) {}

static int hargaAkhir(Tiket t) {
    return switch (t.jenis()) {
        case "REG" -> t.harga();
        case "STD" -> t.harga() * 90 / 100;
        case "VIP" -> t.harga() * 75 / 100;
        default -> t.harga();
    };
}`,
            caption: "Aturan diskon jadi fungsi murni: masukan sama, keluaran sama, tanpa efek samping.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan program diskon tiket",
          prompt:
            "Program membaca `n`, lalu `n` baris berformat `jenis harga`, dan mencetak `jenis hargaAkhir` untuk tiap tiket lalu `Total: X` berisi jumlah semua harga akhir. Aturan: REG tanpa potongan, STD dipotong 10 persen, VIP dipotong 25 persen, jenis lain tanpa potongan. Lengkapi tiga `___`.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    record ___(String jenis, int harga) {}

    static int hargaAkhir(Tiket t) {
        return ___ (t.jenis()) {
            case "REG" -> t.harga();
            case "STD" -> t.harga() * 90 / 100;
            case "VIP" -> t.harga() * 75 / 100;
            ___ -> t.harga();
        };
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long total = 0;
        for (int i = 0; i < n; i++) {
            Tiket t = new Tiket(in.next(), in.nextInt());
            int akhir = hargaAkhir(t);
            total += akhir;
            System.out.println(t.jenis() + " " + akhir);
        }
        System.out.println("Total: " + total);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    record Tiket(String jenis, int harga) {}

    static int hargaAkhir(Tiket t) {
        return switch (t.jenis()) {
            case "REG" -> t.harga();
            case "STD" -> t.harga() * 90 / 100;
            case "VIP" -> t.harga() * 75 / 100;
            default -> t.harga();
        };
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long total = 0;
        for (int i = 0; i < n; i++) {
            Tiket t = new Tiket(in.next(), in.nextInt());
            int akhir = hargaAkhir(t);
            total += akhir;
            System.out.println(t.jenis() + " " + akhir);
        }
        System.out.println("Total: " + total);
    }
}`,
          tests: [
            { stdin: "3\nREG 100000\nVIP 200000\nSTD 50000", expectedOutput: "REG 100000\nVIP 150000\nSTD 45000\nTotal: 295000" },
            { stdin: "1\nVIP 40000", expectedOutput: "VIP 30000\nTotal: 30000" },
            { stdin: "4\nSTD 55\nREG 10\nXYZ 20\nVIP 80", expectedOutput: "STD 49\nREG 10\nXYZ 20\nVIP 60\nTotal: 139", hidden: true },
          ],
          hints: [
            "Nama record harus cocok dengan tipe parameter hargaAkhir dan pemanggilan new di main: Tiket.",
            "Switch expression diawali kata switch, dan cabang penampung jenis tak dikenal bernama default.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "lap-struktur-proyek",
      title: "Anatomi Proyek Java",
      summary: "Dari satu file Main.java ke tata letak src/main/java yang dipakai seluruh dunia Java.",
      steps: [
        {
          kind: "theory",
          title: "Satu konvensi untuk semua proyek",
          body: "Sepanjang jalur ini kamu bekerja dengan satu file Main.java. Proyek nyata berisi ratusan file, dan seluruh alat Java menyepakati tata letak yang sama: kode sumber di `src/main/java`, resource seperti file konfigurasi dan template di `src/main/resources`, dan kode tes di `src/test/java`. Tata letak ini dibakukan oleh Maven lalu ditiru hampir semua build tool, termasuk Gradle.\n\nDi dalam `src/main/java`, paket menentukan folder. Class dengan deklarasi `package com.kodekita.util;` wajib hidup di `src/main/java/com/kodekita/util/`, dan kalimat package di atas file harus persis cocok dengan foldernya. Kebiasaan yang sehat: satu paket untuk satu tanggung jawab, misalnya `model` untuk data, `service` untuk aturan bisnis, `util` untuk alat bantu, dengan nama paket huruf kecil semua.\n\nKenapa ini penting dipelajari sekarang? Karena tata letak ini bukan gaya bebas: buka proyek Java di perusahaan mana pun, kamu langsung tahu ke mana harus melihat pertama kali. Pemahaman ini juga membuat materi build tool di lesson berikutnya terasa wajar, bukan seperti ritual tanpa alasan.",
          code: {
            language: "java",
            content: `aplikasi-laporan/
  src/
    main/
      java/
        com/kodekita/laporan/
          Main.java
          model/Produk.java
          service/Penghitung.java
      resources/
        konfigurasi.properties
    test/
      java/
        com/kodekita/laporan/
          service/PenghitungTest.java`,
            caption: "Paket = folder. Struktur ini dipahami Maven, Gradle, dan semua IDE.",
          },
        },
        {
          kind: "quiz",
          question: "Pada struktur proyek Java standar, di folder mana kode sumber utama diletakkan?",
          options: ["src/", "src/main/java", "java/main/src", "source/"],
          answer: 1,
          explanation:
            "Konvensinya src/main/java untuk kode utama, src/main/resources untuk resource, dan src/test/java untuk kode tes.",
        },
        {
          kind: "quiz",
          question: "Class dengan deklarasi `package com.kodekita.util;` harus berada di jalur folder mana?",
          options: [
            "src/main/java/com/kodekita/util/",
            "src/main/java/com.kodekita.util/",
            "src/com/kodekita/util/",
            "Di mana saja asal masih di dalam src",
          ],
          answer: 0,
          explanation:
            "Paket dipetakan satu banding satu ke folder: setiap titik pada nama paket menjadi pemisah folder di bawah src/main/java.",
        },
      ],
    },
    {
      slug: "lap-junit-dasar",
      title: "Unit Test dengan JUnit",
      summary: "Cara kerja @Test dan assertEquals, ditranslasikan ke latihan yang bisa dijalankan di judge.",
      steps: [
        {
          kind: "theory",
          title: "Menguji logika secara otomatis",
          body: "JUnit adalah pustaka pengujian standar Java. Sebuah test adalah method biasa beranotasi `@Test`; di dalamnya kamu memanggil fungsi yang diuji lalu mencocokkan hasilnya dengan pernyataan seperti `assertEquals(harapan, kenyataan)`. Bila cocok, test lulus; bila tidak, JUnit melaporkan nilai yang diharapkan dan yang keluar. Ribuan test bisa berjalan dalam hitungan detik setiap kali kode diubah, dan regresi ketahuan sebelum sampai ke pengguna.\n\nPola menulis test yang umum diringkas tiga huruf: AAA, Arrange Act Assert. Arrange menyiapkan data, Act memanggil fungsi yang diuji, Assert membandingkan hasilnya dengan harapan. Fungsi murni adalah kandidat test terbaik: masukan yang sama selalu menghasilkan keluaran yang sama dan tidak menyentuh keadaan luar. Itulah alasan lesson sebelumnya memisahkan logika ke method statis.\n\nCatatan untuk platform ini: judge tidak membawa pustaka JUnit, jadi latihan di bawah meniru inti pengujian secara manual, fungsi dipanggil dengan berbagai masukan dan keluarannya dicocokkan. Di proyek sungguhan dengan Maven atau Gradle, fungsi yang sama persis dites dengan `@Test` dan `assertEquals` di `src/test/java`. Yang berubah hanya pembungkusnya, bukan cara berpikirnya.",
          code: {
            language: "java",
            content: `@Test
void skorTinggiDapatLabelA() {
    // Arrange: tidak perlu data khusus
    int skor = 90;                          // Act
    assertEquals("A", LabelKuis.label(skor)); // Assert
    assertEquals("B", LabelKuis.label(70));
}`,
            caption: "assertEquals membandingkan nilai harapan dengan hasil fungsi yang dipanggil.",
          },
        },
        {
          kind: "quiz",
          question: "Anotasi apa yang menandai sebuah method sebagai test case pada JUnit?",
          options: ["@Check", "@Test", "@TestCase", "@RunTest"],
          answer: 1,
          explanation:
            "Method beranotasi @Test dijalankan JUnit sebagai satu skenario pengujian. Di dalamnya, assertEquals dan kawan-kawan yang memutuskan lulus atau gagal.",
        },
        {
          kind: "code",
          title: "Uji fungsi label skor",
          prompt:
            "Fungsi `label(int skor)` mengembalikan `A` untuk skor minimal 85, `B` untuk minimal 70, `C` untuk minimal 60, selain itu `D`. Program membaca `n` lalu `n` skor, dan mencetak label tiap skor, persis seperti rangkaian assertEquals yang dijalankan berurutan. Lengkapi dua `___`.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {

    static String label(int skor) {
        if (skor >= 85) {
            return "A";
        }
        if (skor >= ___) {
            return "B";
        }
        if (skor >= 60) {
            return "C";
        }
        return ___;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(label(in.nextInt()));
        }
    }
}`,
          solution: `import java.util.Scanner;

public class Main {

    static String label(int skor) {
        if (skor >= 85) {
            return "A";
        }
        if (skor >= 70) {
            return "B";
        }
        if (skor >= 60) {
            return "C";
        }
        return "D";
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(label(in.nextInt()));
        }
    }
}`,
          tests: [
            { stdin: "5\n90\n84\n70\n60\n0", expectedOutput: "A\nB\nB\nC\nD" },
            { stdin: "3\n85\n69\n59", expectedOutput: "A\nC\nD" },
            { stdin: "1\n86", expectedOutput: "A", hidden: true },
          ],
          hints: [
            "Urutan pengecekan dari skor tertinggi membuat syarat berikutnya otomatis berada di bawahnya.",
            "Batas label B adalah 70, dan skor yang tidak masuk ketiga rentang itu kembali sebagai teks D.",
          ],
        },
      ],
    },
    {
      slug: "lap-build-jar",
      title: "Build dan Jalankan Jar",
      summary: "Perjalanan file .java menjadi .class lalu terkemas dalam jar yang bisa dibagikan.",
      steps: [
        {
          kind: "theory",
          title: "Dari source ke paket yang bisa dijalankan",
          body: "`javac` mengubah setiap file .java menjadi file .class berisi bytecode, bahasa mesin milik JVM. Untuk membagikan program, file-file class itu dikemas menjadi satu arsip bernama jar: misalnya `jar --create --file app.jar -C bin .` mengemas seluruh isi folder bin. Secara teknis jar adalah file zip plus metadata bernama manifest di `META-INF/MANIFEST.MF`.\n\nBaris terpenting dalam manifest adalah `Main-Class`: nama class yang punya method main. Dengan baris itu, siapa pun bisa menjalankan program dengan `java -jar app.jar` tanpa perlu tahu class mana yang jadi titik masuk. Tanpa manifest, jar masih bisa dipakai lewat classpath: `java -cp app.jar com.kodekita.Main`, yang menyuruh JVM mencari class utamanya di dalam jar.\n\nDi tempat kerja, jar jarang dibuat manual; Maven dan Gradle mengurusnya sekaligus dengan dependensi dan plugin. Tetap ada nilai praktisnya memahami alur java, class, lalu jar: pesan error build tidak lagi terasa seperti teka-teki, dan `java -jar` adalah cara paling umum menjalankan tool berbasis Java yang kamu unduh.",
          code: {
            language: "java",
            content: `javac src/com/kodekita/Main.java -d bin
jar --create --file app.jar --main-class com.kodekita.Main -C bin .
java -jar app.jar`,
            caption: "Kompilasi, kemas dengan Main-Class, jalankan dengan satu perintah.",
          },
        },
        {
          kind: "quiz",
          question: "Manifest jar sudah menyebut Main-Class. Perintah mana yang menjalankan aplikasinya?",
          options: ["java app.jar", "javac app.jar", "java -jar app.jar", "jar --run app.jar"],
          answer: 2,
          explanation:
            "Opsi -jar menyuruh java membaca manifest dan memulai program dari class yang disebut Main-Class. javac untuk kompilasi, bukan menjalankan.",
        },
        {
          kind: "quiz",
          question: "Apa isi baris Main-Class pada MANIFEST.MF?",
          options: [
            "Nama folder tempat class-class disimpan",
            "Nama class yang menjadi titik masuk, tempat method main berada",
            "Nama file jar yang sedang dibuat",
            "Versi Java minimum yang dipakai",
          ],
          answer: 1,
          explanation:
            "Main-Class menyebut class berisi method main, misalnya com.kodekita.Main. Dari sinilah JVM memulai eksekusi saat java -jar dijalankan.",
        },
      ],
    },
    {
      slug: "lap-cli-args",
      title: "args[]: Argumen Baris Perintah",
      summary: "Menerima dan memvalidasi argumen program, disimulasikan lewat stdin.",
      steps: [
        {
          kind: "theory",
          title: "Masukan pertama programmu: array args",
          body: "Method main selalu menerima `String[] args`: argumen yang diketik setelah nama program. Perintah `java Main Kopi 12` mengisi `args[0]` dengan \"Kopi\" dan `args[1]` dengan \"12\". Isinya selalu String, jadi angka harus diuraikan dengan `Integer.parseInt` sebelum dihitung.\n\nKarena pengguna bisa salah ketik atau lupa memberi argumen, program CLI yang sopan memeriksa `args.length` lebih dulu. Kalau jumlahnya kurang, ia mencetak cara pemakaian lalu berhenti, alih-alih crash dengan exception di hadapan pengguna. Pola validasi dulu, proses kemudian ini akan kamu tulis sendiri di latihan di bawah.\n\nJudge platform ini tidak menerima argumen baris perintah, jadi latihannya menyimulasikannya: baris pertama stdin berisi seluruh argumen dipisah spasi, dan program memecahnya dengan `split(\" \")`. Logika di dalamnya identik dengan mengolah array args asli, jadi keterampilannya berpindah utuh ke terminal sungguhan.",
          code: {
            language: "java",
            content: `public static void main(String[] args) {
    if (args.length < 2) {
        System.out.println("Pemakaian: java Main <nama> <jumlah>");
        return;
    }
    String nama = args[0];
    int jumlah = Integer.parseInt(args[1]);
    System.out.println(nama + " x " + jumlah);
}`,
            caption: "Validasi panjang args lebih dulu, baru urai dan pakai isinya.",
          },
        },
        {
          kind: "code",
          title: "Perbaiki sapaan CLI",
          prompt:
            "Program membaca baris pertama stdin sebagai argumen simulasi. Dengan dua argumen ia harus mencetak `Halo <nama>, umur <umur> tahun`; bila argumen kurang dari dua, cetak pesan pemakaian. Keluarannya sekarang tertukar. Cari satu kesalahannya dan perbaiki sampai tes lulus.",
          mode: "fix",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] arg = in.nextLine().trim().split(" ");
        if (arg.length < 2) {
            System.out.println("Pemakaian: java Main <nama> <umur>");
            return;
        }
        String nama = arg[1];
        int umur = Integer.parseInt(arg[0]);
        System.out.println("Halo " + nama + ", umur " + umur + " tahun");
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] arg = in.nextLine().trim().split(" ");
        if (arg.length < 2) {
            System.out.println("Pemakaian: java Main <nama> <umur>");
            return;
        }
        String nama = arg[0];
        int umur = Integer.parseInt(arg[1]);
        System.out.println("Halo " + nama + ", umur " + umur + " tahun");
    }
}`,
          tests: [
            { stdin: "Dina 17", expectedOutput: "Halo Dina, umur 17 tahun" },
            { stdin: "Budi", expectedOutput: "Pemakaian: java Main <nama> <umur>" },
            { stdin: "Citra 30", expectedOutput: "Halo Citra, umur 30 tahun", hidden: true },
          ],
          hints: [
            "Jalankan dengan input dua kata dan bandingkan posisi yang muncul di keluaran dengan seharusnya.",
            "Indeks array mulai dari 0: argumen pertama ada di indeks 0, argumen kedua di indeks 1.",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-tugas",
      title: "Mini Proyek 1: Manajer Tugas",
      summary: "CLI add, done, dan list yang menyatukan List, parsing perintah, dan loop input.",
      steps: [
        {
          kind: "theory",
          title: "Program CLI pertamamu yang utuh",
          body: "Manajer tugas adalah proyek klasik yang menyentuh hampir semua materi sebelumnya: List untuk menyimpan data, penguraian perintah dari teks, loop membaca input sampai habis, dan keluaran yang terformat rapi. Versi nyata menyimpan datanya ke file atau database supaya bertahan antarjalankan; di latihan ini data hidup selama program berjalan, dan itu cukup untuk melatih strukturnya.\n\nProtokolnya meniru CLI sungguhan: setiap baris stdin adalah satu perintah. `add <teks>` menambah tugas baru, teksnya boleh mengandung spasi. `done <nomor>` menandai tugas dengan nomor itu selesai, nomor mulai dari 1. `list` mencetak seluruh tugas saat itu dalam format `<nomor>. [<x bila selesai, spasi bila belum>] <teks>`.\n\nTemplate memakai dua List paralel: satu menyimpan teks tugas, satu menyimpan status selesai dengan indeks yang berpasangan. Pendekatan lain yang lebih rapi adalah satu List berisi record Tugas dengan dua komponennya; coba bayangkan perubahannya setelah tesmu lulus, karena itu persis refactor kecil yang dilakukan programmer setiap hari.",
          code: {
            language: "java",
            content: `while (in.hasNextLine()) {
    String baris = in.nextLine().trim();
    if (baris.equals("list")) {
        // cetak semua tugas
    } else if (baris.startsWith("add ")) {
        // simpan teks setelah "add "
    } else if (baris.startsWith("done ")) {
        // tandai tugas ke-nomor selesai
    }
}`,
            caption: "Kerangka CLI: baca per baris, cocokkan perintah, proses sisanya.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan manajer tugas",
          prompt:
            "Proses semua baris perintah sesuai protokol: `add <teks>`, `done <nomor>`, dan `list` yang mencetak tiap tugas berformat `1. [ ] Belajar Java` atau `2. [x] Cuci piring`. Lengkapi tiga `___`: tanda selesai saat mencetak, penguraian nomor, dan penandaan selesai.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> tugas = new ArrayList<>();
        List<Boolean> selesai = new ArrayList<>();
        while (in.hasNextLine()) {
            String baris = in.nextLine().trim();
            if (baris.isEmpty()) {
                continue;
            }
            if (baris.equals("list")) {
                for (int i = 0; i < tugas.size(); i++) {
                    String tanda = selesai.get(i) ? ___ : " ";
                    System.out.println((i + 1) + ". [" + tanda + "] " + tugas.get(i));
                }
            } else if (baris.startsWith("add ")) {
                tugas.add(baris.substring(4));
                selesai.add(false);
            } else if (baris.startsWith("done ")) {
                int nomor = Integer.___(baris.substring(5));
                selesai.___(nomor - 1, true);
            }
        }
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> tugas = new ArrayList<>();
        List<Boolean> selesai = new ArrayList<>();
        while (in.hasNextLine()) {
            String baris = in.nextLine().trim();
            if (baris.isEmpty()) {
                continue;
            }
            if (baris.equals("list")) {
                for (int i = 0; i < tugas.size(); i++) {
                    String tanda = selesai.get(i) ? "x" : " ";
                    System.out.println((i + 1) + ". [" + tanda + "] " + tugas.get(i));
                }
            } else if (baris.startsWith("add ")) {
                tugas.add(baris.substring(4));
                selesai.add(false);
            } else if (baris.startsWith("done ")) {
                int nomor = Integer.parseInt(baris.substring(5));
                selesai.set(nomor - 1, true);
            }
        }
    }
}`,
          tests: [
            { stdin: "add Belajar Java\nadd Cuci piring\ndone 2\nlist", expectedOutput: "1. [ ] Belajar Java\n2. [x] Cuci piring" },
            { stdin: "list\nadd Laporan\nlist", expectedOutput: "1. [ ] Laporan" },
            { stdin: "add Satu\nadd Dua\nadd Tiga\ndone 1\ndone 3\nlist", expectedOutput: "1. [x] Satu\n2. [ ] Dua\n3. [x] Tiga", hidden: true },
          ],
          hints: [
            "Status selesai dicetak sebagai huruf x di dalam tanda kurung siku, sisanya satu spasi.",
            "Nomor yang datang sebagai teks perlu diuraikan dengan Integer.parseInt.",
            "Mengganti isi posisi tertentu pada List memakai method set(indeks, nilai).",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-csv",
      title: "Mini Proyek 2: CSV ke Laporan",
      summary: "Uraikan baris CSV, hitung per kolom, dan keluarkan laporan dengan total.",
      steps: [
        {
          kind: "theory",
          title: "Pola kerja backend dalam satu latihan",
          body: "Banyak pekerjaan backend pada akhirnya berbentuk ini: terima data mentah, olah, keluarkan laporan. CSV adalah format pertukaran paling awam: setiap baris satu data, kolom dipisah koma. Untuk CSV sederhana yang nilainya tidak mengandung koma, `split(\",\")` sudah memadai; format yang lebih rumit (koma di dalam kutip) memang butuh pustaka khusus, dan itu catatan untuk nanti di dunia kerja.\n\nAda satu jebakan Scanner yang nyata dan sering menggigit pemula: setelah `nextInt()`, karakter pindah baris masih tertinggal di buffer, sehingga `nextLine()` berikutnya membaca sisa baris kosong, bukan data berikutnya. Solusinya memanggil `nextLine()` sekali untuk membuang sisa itu sebelum masuk loop pembacaan baris, persis yang dilakukan template.\n\nSoal menampung hasil, ingat batas int sekitar 2,1 miliar. Perkalian qty kali harga bisa melewatinya tanpa terasa, dan kelebihannya tidak melempar error melainkan melingkar diam-diam menjadi angka kacau. Kebiasaan menampung hasil kali dalam `long` sejak awal menghemat jam debugging kelak.",
          code: {
            language: "java",
            content: `String[] kolom = "Kopi,2,15000".split(",");
// kolom[0] = "Kopi", kolom[1] = "2", kolom[2] = "15000"
int qty = Integer.parseInt(kolom[1]);
int harga = Integer.parseInt(kolom[2]);
long jumlah = (long) qty * harga;`,
            caption: "split memecah baris CSV, parseInt menguraikan angkanya, long menampung hasil kali.",
          },
        },
        {
          kind: "code",
          title: "Susun laporan penjualan",
          prompt:
            "Baris pertama berisi `n`. Tiap baris berikutnya berformat `nama,qty,harga`. Cetak `nama: jumlah` (qty kali harga) untuk tiap baris, lalu `Total: X` berisi penjumlahan semua. Lengkapi tiga `___`.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.___();
        long total = 0;
        for (int i = 0; i < n; i++) {
            String[] kolom = in.nextLine().___(",");
            String nama = kolom[0];
            int qty = Integer.parseInt(kolom[1]);
            int harga = Integer.parseInt(kolom[2]);
            long jumlah = (long) qty * harga;
            total ___ jumlah;
            System.out.println(nama + ": " + jumlah);
        }
        System.out.println("Total: " + total);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        long total = 0;
        for (int i = 0; i < n; i++) {
            String[] kolom = in.nextLine().split(",");
            String nama = kolom[0];
            int qty = Integer.parseInt(kolom[1]);
            int harga = Integer.parseInt(kolom[2]);
            long jumlah = (long) qty * harga;
            total += jumlah;
            System.out.println(nama + ": " + jumlah);
        }
        System.out.println("Total: " + total);
    }
}`,
          tests: [
            { stdin: "2\nKopi,2,15000\nGula,1,18000", expectedOutput: "Kopi: 30000\nGula: 18000\nTotal: 48000" },
            { stdin: "1\nPensil,10,3000", expectedOutput: "Pensil: 30000\nTotal: 30000" },
            { stdin: "3\nA,1,1\nB,2,2\nC,3,3", expectedOutput: "A: 1\nB: 4\nC: 9\nTotal: 14", hidden: true },
          ],
          hints: [
            "Setelah nextInt(), panggil nextLine() sekali untuk membuang sisa barisnya.",
            "Pemisah kolom CSV adalah koma, jadi split dipanggil dengan teks koma.",
            "Menambahkan ke penampung total memakai operator +=.",
          ],
        },
      ],
    },
    {
      slug: "lap-proyek-kalkulator",
      title: "Mini Proyek 3: Kalkulator Ekspresi",
      summary: "Uraikan satu ekspresi menjadi operan dan operator, lalu hitung dengan aturan yang aman.",
      steps: [
        {
          kind: "theory",
          title: "Parsing: dari teks ke aturan",
          body: "Kalkulator ekspresi melatih keterampilan inti bernama parsing: menerima teks, mengurainya menjadi bagian-bagian, menjalankan aturan, lalu mengeluarkan hasil. Format input `a op b` dengan spasi pemisah sengaja dipilih agar ramah: `split(\" \")` langsung menghasilkan tiga potongan, dua angka dan satu operator.\n\nDua perilaku pembagian Java harus kamu pegang. Pembagian bulat memotong ke arah nol: `7 / 2` menghasilkan 3 dan `-7 / 2` menghasilkan -3. Lalu pembagian dengan nol melempar `ArithmeticException`, jadi kalkulator yang layak memeriksanya lebih dulu dan mencetak pesan yang jelas, bukan crash. Kasus khusus yang diperiksa sebelum dipakai adalah pola yang juga dipakai kode produksi setiap hari.\n\nSwitch dengan arrow juga sah sebagai pernyataan, bukan hanya expression, dan cabang berisi beberapa baris memakai blok `{ }`. Kalkulator sungguhan untuk ekspresi bersarang seperti `2 + 3 * 4` butuh tokenizer dan algoritma penanganan prioritas operator; versi satu operasi ini adalah langkah pertamanya, dan logika cabang per operatornya persis sama.",
          code: {
            language: "java",
            content: `switch (op) {
    case "+" -> hasil = a + b;
    case "/" -> {
        if (b == 0) {
            System.out.println("Error: bagi nol");
            return;
        }
        hasil = a / b;
    }
    default -> System.out.println("Operator tidak dikenal");
}`,
            caption: "Cabang arrow dengan blok untuk logika lebih dari satu baris.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan kalkulator ekspresi",
          prompt:
            "Input satu baris berformat `a op b` dengan op salah satu dari `+`, `-`, `*`, `/`, `%`. Cetak `Hasil: X`. Pembagian memakai aturan Java, dan bila pembaginya 0 cetak `Error: bagi nol`. Lengkapi tiga `___`.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] bagian = in.nextLine().trim().split(" ");
        int a = Integer.parseInt(bagian[0]);
        String op = bagian[1];
        int b = Integer.parseInt(bagian[2]);
        int hasil;
        switch (op) {
            case "+" -> hasil = a + b;
            case "-" -> hasil = a - b;
            case ___ -> hasil = a * b;
            case "/", "%" -> {
                if (b ___ 0) {
                    System.out.println("Error: bagi nol");
                    return;
                }
                if (op.equals("/")) {
                    hasil = a ___ b;
                } else {
                    hasil = a % b;
                }
            }
            default -> {
                System.out.println("Operator tidak dikenal");
                return;
            }
        }
        System.out.println("Hasil: " + hasil);
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] bagian = in.nextLine().trim().split(" ");
        int a = Integer.parseInt(bagian[0]);
        String op = bagian[1];
        int b = Integer.parseInt(bagian[2]);
        int hasil;
        switch (op) {
            case "+" -> hasil = a + b;
            case "-" -> hasil = a - b;
            case "*" -> hasil = a * b;
            case "/", "%" -> {
                if (b == 0) {
                    System.out.println("Error: bagi nol");
                    return;
                }
                if (op.equals("/")) {
                    hasil = a / b;
                } else {
                    hasil = a % b;
                }
            }
            default -> {
                System.out.println("Operator tidak dikenal");
                return;
            }
        }
        System.out.println("Hasil: " + hasil);
    }
}`,
          tests: [
            { stdin: "12 + 30", expectedOutput: "Hasil: 42" },
            { stdin: "5 / 0", expectedOutput: "Error: bagi nol" },
            { stdin: "17 % 5", expectedOutput: "Hasil: 2", hidden: true },
          ],
          hints: [
            "Operator perkalian pada Java adalah tanda bintang.",
            "Membandingkan angka dengan nol memakai dua tanda sama dengan.",
            "Operator pembagian bulat adalah garis miring.",
          ],
        },
      ],
    },
    {
      slug: "lap-checklist-kerja",
      title: "Checklist Kesiapan Kerja",
      summary: "Bekal di luar sintaks: proyek yang bisa dijalankan orang lain, test, git, dan kebiasaan tim.",
      steps: [
        {
          kind: "theory",
          title: "Yang dinilai bukan hafalan",
          body: "Sampai titik ini kamu sudah membawa bahasa inti Java, collections, exception dan I/O, gaya fungsional, concurrency dasar, fitur modern, dan beberapa proyek mini. Sebelum melamar atau mengambil proyek, rapikan bekalnya. Yang dicari tim bukan hafalan sintaks, melainkan kebiasaan: kode yang terbaca, teruji, dan mudah digarap orang lain.\n\nChecklist minimum yang layak kamu penuhi sekarang. Satu proyek yang bisa dijalankan orang lain tanpa bertanya, artinya ada README singkat berisi cara build dan run. Sedikit unit test pada logika intinya, cukup untuk menunjukkan kamu tahu cara mengujinya. Kode tersimpan di git dengan riwayat commit yang bermakna. Dan kemampuan membaca stack trace sampai tuntas, bukan berhenti di baris pertama.\n\nKebiasaan kerja timnya sama pentingnya: commit kecil dengan pesan yang menjelaskan kenapa, bertanya setelah usaha mandiri yang wajar, dan membaca kode orang lain lebih sering daripada menulis. Semua itu bisa mulai dilatih pada proyek mini yang sudah kamu buat di modul ini: tambahkan test-nya, push ke repositori, lalu minta temanmu menjalankannya.",
          code: {
            language: "java",
            content: `// Stack trace adalah petunjuk arah, bukan hinaan.
// Baca dari atas: baris pertama di file milikmu
// biasanya adalah tempat sesungguhnya masalahnya.
Exception in thread "main" java.lang.NumberFormatException:
    at java.base/java.lang.Integer.parseInt(Integer.java:652)
    at Main.main(Main.java:7)   <- mulai dari sini`,
            caption: "Kebiasaan membaca error sampai tuntas termasuk bekal yang dinilai.",
          },
        },
        {
          kind: "quiz",
          question: "Kamu menerima laporan bug dari pengguna. Langkah pertama yang paling tepat adalah?",
          options: [
            "Langsung menulis perbaikan sesuai dugaan penyebabnya",
            "Mencoba memunculkan bug kembali dengan langkah yang sama",
            "Menulis ulang modul terkait dari awal",
            "Menambahkan try-catch di method main",
          ],
          answer: 1,
          explanation:
            "Bug yang bisa dimunculkan ulang (reproducible) bisa diuji perbaikannya. Perbaikan tanpa reproduksi hanya menebak, dan tidak ada cara membuktikan bug itu benar selesai.",
        },
        {
          kind: "quiz",
          question: "Riwayat commit seperti apa yang paling membantu tim?",
          options: [
            "Satu commit besar berisi seluruh pekerjaan agar cepat selesai",
            "Commit kecil yang fokus satu perubahan dengan pesan yang menjelaskan alasannya",
            "Pesan commit dikosongkan agar hemat waktu",
            "Semua pekerjaan dikommit bersamaan di akhir proyek",
          ],
          answer: 1,
          explanation:
            "Commit kecil dan bermakna mudah ditinjau, mudah dikembalikan bila salah, dan menceritakan perkembangan proyek. Itu yang dibutuhkan saat tim membaca riwayatnya.",
        },
      ],
    },
    {
      slug: "lap-ekosistem",
      title: "Sekilas Ekosistem: Maven, Gradle, Spring",
      summary: "Peta besar dunia Java produksi dan urutan belajar yang benar.",
      steps: [
        {
          kind: "theory",
          title: "Dua lapis di atas fondasi",
          body: "Java produksi nyaris selalu berdiri di atas dua lapis ekosistem. Lapis pertama build tool: Maven atau Gradle. Keduanya mengurus kompilasi, pengemasan jar, dan yang paling berharga: dependensi. Kamu menulis daftar pustaka yang dibutuhkan di `pom.xml` (Maven) atau `build.gradle` (Gradle), lalu alatnya mengunduh, menyusun, dan menyatukan semuanya. Tidak ada lagi mengunduh jar satu-satu dengan tangan.\n\nLapis kedua framework. Spring Boot adalah yang paling banyak dipakai untuk layanan web dan API di Java: ia menyediakan server terpasang, pemetaan URL ke method, koneksi database, dan konfigurasi, sehingga kamu fokus pada aturan bisnis. Di luar web, ekosistem JVM juga hidup di Android dan berbagai sistem data berskala besar, jadi keterampilan Java ini punya pintu keluar yang banyak.\n\nYang perlu dijaga adalah urutan belajarnya: fondasi yang kamu bangun sepanjang jalur ini dulu, framework kemudian. Spring Boot hanya terasa masuk akal bila interface, annotation, struktur proyek, dan build tool sudah tidak asing, sebab semua konsep itu dipakai framework sebagai bahan bakunya. Langkah belajar berikutnya yang sehat: pasang Maven sungguhan pada manajer tugas milikmu, pindahkan test-nya ke JUnit, lalu mulai Spring Boot untuk layanan web pertama.",
          code: {
            language: "java",
            content: `<!-- pom.xml: cukup tulis apa yang dibutuhkan,
     Maven yang mengunduh dan menyusunnya -->
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.10.2</version>
  <scope>test</scope>
</dependency>`,
            caption: "Dependensi dideklarasikan sekali, build tool yang bekerja sisanya.",
          },
        },
        {
          kind: "quiz",
          question: "File mana yang mendeklarasikan dependensi proyek pada Maven?",
          options: ["package.json", "pom.xml", "build.gradle", "requirements.txt"],
          answer: 1,
          explanation:
            "pom.xml adalah milik Maven. build.gradle milik Gradle, package.json milik npm untuk JavaScript, dan requirements.txt milik pip untuk Python.",
        },
        {
          kind: "quiz",
          question: "Untuk kebutuhan apa Spring Boot paling sering dipilih?",
          options: [
            "Mengedit gambar",
            "Membangun layanan web dan REST API",
            "Mendesain poster dan antarmuka grafis",
            "Menulis rumus spreadsheet",
          ],
          answer: 1,
          explanation:
            "Spring Boot dipakai untuk layanan web dan API: server, pemetaan URL, dan koneksi database sudah diurusnya, jadi kamu fokus menulis aturan bisnis.",
        },
      ],
    },
    {
      slug: "lap-rekap",
      title: "Rekap Jalur Java",
      summary: "Menutup sepuluh modul dengan peta yang bisa kamu pegang dan langkah berikutnya.",
      steps: [
        {
          kind: "theory",
          title: "Perjalanan sepuluh modul dalam satu pandangan",
          body: "Sepuluh modul berjalan dari kebiasaan bahasa: tipe dan wrapper, String yang immutable, StringBuilder, sampai konvensi. Lanjut ke OOP dari akar sampai polimorfisme, Collections Framework, exception dan I/O, gaya fungsional dengan lambda dan Optional, Streams API, concurrency dasar, lalu fitur modern seperti record, sealed, dan text block, ditutup bekal proyek. Rangkaiannya satu benang: Java memberi struktur yang ketat, dan struktur itulah yang membuat proyek besar tetap bisa dirawat bertahun-tahun.\n\nKalau ada materi yang masih terasa samar, cara mengeceknya satu: kembali ke modulnya dan tulis ulang latihannya dari nol tanpa melihat solusi. Materi yang benar-benar melekat biasanya ditandai dua hal, kamu bisa menjelaskannya ke orang lain dengan kalimatmu sendiri, dan kamu memakainya tanpa perlu membuka catatan.\n\nLangkah setelah jalur ini sudah tertata. Perbesar salah satu mini proyek, misalnya menambah penyimpanan file pada manajer tugas atau operasi bersarang pada kalkulator. Pindahkan alat kerjamu ke yang sungguhan: Maven, JUnit, git. Setelah itu Spring Boot menunggu untuk layanan web pertamamu. Bawa kebiasaan yang terbentuk di sini: perubahan kecil, teruji, dan konsisten.",
          code: {
            language: "java",
            content: `// Semua yang dipelajari bertemu di satu program kecil:
record Tiket(String jenis, int harga) {}          // modul Java Modern

static int hargaAkhir(Tiket t) {                  // gaya fungsional: fungsi murni
    return switch (t.jenis()) {                   // switch expression + arrow
        case "STD" -> t.harga() * 90 / 100;
        case "VIP" -> t.harga() * 75 / 100;
        default -> t.harga();
    };
}
// tinggal diuji dengan JUnit, dibungkus jar, dan sudah siap dibagikan`,
            caption: "Fondasi, struktur, dan alat: tiga lapis yang dibangun sepanjang jalur ini.",
          },
        },
        {
          kind: "quiz",
          question: "Pernyataan mana yang paling tepat menggambarkan record?",
          options: [
            "Class yang wajib punya setter untuk tiap field",
            "Data carrier immutable dengan constructor, accessor, equals, hashCode, dan toString otomatis",
            "Interface tanpa method apa pun",
            "Tipe generik khusus untuk angka",
          ],
          answer: 1,
          explanation:
            "Record dirancang untuk membawa data: komponennya final, dan semua method standarnya digenerate berbasis nilai komponen. Butuh objek berbeda berarti membuat objek baru.",
        },
        {
          kind: "quiz",
          question: "Apa yang membedakan switch expression dengan arrow dari switch lama gaya kolon?",
          options: [
            "Hanya bisa dipakai untuk tipe int",
            "Tidak ada fallthrough antarcabang dan switch bisa menghasilkan nilai",
            "Wajib ditulis di dalam method abstract",
            "Tidak mendukung perbandingan String",
          ],
          answer: 1,
          explanation:
            "Cabang arrow selesai di tempat tanpa jatuh ke cabang berikutnya, dan bentuk expression memungkinkan hasil switch langsung ditampung ke variabel.",
        },
      ],
    },
  ],
};
