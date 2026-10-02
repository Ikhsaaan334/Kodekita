import type { JalurBagian } from "../../types";

// Bagian 3 dari jalur java: modul 4 (Exception dan I/O) dan
// modul 5 (Java Fungsional), 10 lesson per modul, tingkat menanjak.
export const BAGIAN: JalurBagian = {
  lang: "java",
  moduleRange: [4, 5],
  modules: [
    {
      title: "Exception dan I/O",
      description: "Checked vs unchecked, try-with-resources, Files/Paths, dan desain error.",
    },
    {
      title: "Java Fungsional",
      description: "Lambda, functional interface, method reference, dan Optional.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: Exception dan I/O ====================
    {
      slug: "exc-try-catch-finally",
      title: "try, catch, dan finally",
      summary: "Tangkap exception dengan try-catch, dan kenali finally yang selalu dijalankan.",
      steps: [
        {
          kind: "theory",
          title: "Ketika kode berjalan tidak sesuai rencana",
          body: "Exception adalah kejadian yang memutus alur normal program: pembagian dengan nol, indeks di luar batas array, teks yang gagal diurai menjadi angka. Tanpa penanganan, Java menghentikan method yang sedang berjalan, meneruskan keadaan error ke pemanggilnya, dan begitu terus sampai program berhenti dengan stack trace di layar. Untuk latihan kecil itu masih bisa dimaklumi, tapi program yang dipakai orang lain tidak boleh mati mendadak hanya karena satu input tidak terduga.\n\nJava menangani dengan pasangan `try` dan `catch`. Blok `try` membungkus kode yang berpotensi gagal; blok `catch` menampung exception yang terlempar, lengkap dengan objeknya. Dari objek itu `e.getMessage()` memberi pesan singkat penyebabnya. Begitu exception tertangani, program melanjutkan ke baris setelah blok catch, bukan berhenti.\n\nBlok `finally`, jika ditulis, dijalankan dalam semua keadaan: ada exception, tidak ada exception, bahkan saat blok catch ikut melempar exception baru. Tempat yang tepat untuk pekerjaan pemberesan yang tidak boleh terlewat. Untuk menutup sumber daya seperti file, Java modern punya cara yang lebih ringkas bernama try-with-resources, dibahas khusus dalam lesson kelima modul ini.",
          code: {
            language: "java",
            content: `try {
    int hasil = 10 / 0;               // melempar ArithmeticException
    System.out.println(hasil);        // tidak pernah sempat jalan
} catch (ArithmeticException e) {
    System.out.println("Tertangkap: " + e.getMessage());
} finally {
    System.out.println("Blok ini selalu jalan");
}

// keluaran:
// Tertangkap: / by zero
// Blok ini selalu jalan`,
            caption: "finally dijalankan meski exception terjadi, bahkan setelah ditangani.",
          },
        },
        {
          kind: "quiz",
          question: "Blok manakah yang tetap dijalankan baik exception terjadi maupun tidak?",
          options: ["try", "catch", "finally", "throw"],
          answer: 2,
          explanation:
            "finally dijalankan dalam semua keadaan: exception terjadi, tertangani, atau sama sekali tidak ada. Karena itu blok ini dipakai untuk pemberesan yang tidak boleh terlewat.",
        },
        {
          kind: "code",
          title: "Selamatkan pembagian dari nol",
          prompt:
            "Program ini membaca dua bilangan bulat lalu membaginya. Lengkapi dua `___` supaya pembagian dengan nol tidak membuat program crash, melainkan mencetak pesan yang jelas.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        ___ {
            System.out.println(a / b);
        } catch (___ e) {
            System.out.println("Error: pembagian dengan nol");
        }
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        try {
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("Error: pembagian dengan nol");
        }
    }
}`,
          tests: [
            { stdin: "10\n2", expectedOutput: "5" },
            { stdin: "9\n0", expectedOutput: "Error: pembagian dengan nol" },
            { stdin: "-8\n2", expectedOutput: "-4", hidden: true },
          ],
          hints: [
            "Pembagian dengan nol pada bilangan bulat melempar ArithmeticException.",
            "Blok yang membungkus kode berpotensi gagal dimulai dengan kata try.",
          ],
        },
      ],
    },
    {
      slug: "exc-checked-vs-unchecked",
      title: "Checked vs Unchecked",
      summary: "Dua dunia exception Java: yang dicek compiler dan yang baru terasa saat runtime.",
      steps: [
        {
          kind: "theory",
          title: "Pohon Throwable dan garis besarnya",
          body: "Semua exception di Java diturunkan dari `Throwable`. Anak pertamanya, `Error`, adalah masalah yang biasanya bukan tanggungan aplikasi: `OutOfMemoryError` saat memori habis, `StackOverflowError` saat rekursi tak berujung. Anak keduanya, `Exception`, yang dikelola programmer, dan di sinilah garis besar lesson ini: `Exception` terbagi dua keluarga, checked dan unchecked.\n\nChecked exception adalah semua `Exception` yang tidak mewarisi `RuntimeException`, contohnya `IOException`. Compiler benar-benar memeriksa: method yang bisa melempar checked exception wajib menanganinya dengan `try-catch` atau menyatakannya lewat `throws`. Kalau tidak, program gagal dikompilasi. Filosofinya jelas: kondisi seperti file yang hilang atau jaringan yang putus bisa terjadi meski kodenya benar, jadi pemanggil harus punya rencana.\n\nUnchecked exception adalah `RuntimeException` dan keturunannya: `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`, `NumberFormatException`. Compiler tidak menuntut apa pun; semuanya biasanya menunjuk bug atau pelanggaran kontrak yang seharusnya dicegah, bukan ditangani di semua titik. Saat melempar sendiri, pakai `IllegalArgumentException` untuk argumen yang tidak sah, dan pilih checked hanya jika pemanggil memang perlu punya strategi pemulihan.",
          code: {
            language: "java",
            content: `// unchecked: compiler diam, baru meledak saat program berjalan
int[] data = new int[3];
System.out.println(data[5]);   // ArrayIndexOutOfBoundsException

// checked: compiler menolak sebelum program jalan
// Files.readString(Path.of("catatan.txt"));
// error: unreported exception IOException; must be caught or declared`,
            caption: "Unchecked adalah bug yang dicegah, checked adalah risiko yang direncanakan.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah yang termasuk checked exception?",
          options: [
            "NullPointerException",
            "IOException",
            "ArithmeticException",
            "ArrayIndexOutOfBoundsException",
          ],
          answer: 1,
          explanation:
            "IOException tidak mewarisi RuntimeException, jadi compiler menuntut penanganan atau deklarasi throws. Tiga lainnya adalah RuntimeException (unchecked).",
        },
        {
          kind: "quiz",
          question:
            "Apa yang terjadi kalau checked exception tidak ditangani dengan catch dan juga tidak dideklarasikan dengan throws?",
          options: [
            "Program tetap berhasil dikompilasi",
            "Gagal kompilasi",
            "Exception diam-diam diabaikan saat runtime",
            "JVM otomatis menanganinya",
          ],
          answer: 1,
          explanation:
            "Inilah asal nama checked: compiler memeriksa dan menolak kompilasi sampai pemanggil menangani exception itu atau menyatakannya dengan throws.",
        },
      ],
    },
    {
      slug: "exc-throw-custom-exception",
      title: "throw dan Custom Exception",
      summary: "Lempar exception sendiri dan buat class exception yang bicara bahasa domainmu.",
      steps: [
        {
          kind: "theory",
          title: "Menutup gerbang sebelum masalah masuk",
          body: "Kata kunci `throw` melempar objek exception secara manual: `throw new IllegalArgumentException(\"umur tidak boleh negatif\");`. Ini cara paling tegas menolak keadaan yang tidak boleh diterima. Alih-alih menunggu program menabrak masalah di seberang sana, kamu menutup gerbangnya di awal: nilai jelek berhenti di tempat masuk, tidak sampai merusak data di tengah.\n\nJava juga membolehkan class exception buatan sendiri: turunkan dari `Exception` untuk yang checked, atau dari `RuntimeException` untuk yang unchecked. Manfaatnya nyata saat menangani: `catch (SaldoKurangException e)` hanya menangkap kondisi bisnis itu, tidak ikut menangkap bug yang tidak terkait. Konvensi penamaannya konsisten diakhiri `Exception`, dan constructor-nya biasanya meneruskan pesan ke `super(pesan)` supaya `getMessage()` tetap berisi.\n\nAturan deklarasinya mengikuti pilihan turunannya. Method yang melempar checked exception wajib menuliskannya di signature, misalnya `void tarik(int jumlah) throws SaldoKurangException`, dan pemanggil wajib menangani. Unchecked bebas dari kewajiban itu, jadi pilihlah secara sadar: checked saat pemanggil memang harus punya rencana menghadapinya, unchecked saat keadaannya lebih tepat disebut bug.",
          code: {
            language: "java",
            content: `class SaldoKurangException extends Exception {
    public SaldoKurangException(String pesan) {
        super(pesan);
    }
}

void tarik(int jumlah, int saldo) throws SaldoKurangException {
    if (jumlah > saldo) {
        throw new SaldoKurangException("Saldo kurang " + (jumlah - saldo));
    }
    System.out.println("Berhasil menarik " + jumlah);
}`,
            caption: "Checked exception dinyatakan di signature, pemanggilnya wajib menangani.",
          },
        },
        {
          kind: "quiz",
          question: "Kata kunci untuk melempar exception secara manual di dalam method adalah?",
          options: ["throws", "throw", "raise", "catch"],
          answer: 1,
          explanation:
            "throw melempar satu objek exception: throw new IllegalArgumentException(...). throws adalah kata lain, dipakai di signature method untuk menyatakan checked exception yang mungkin terlempar.",
        },
        {
          kind: "code",
          title: "Buat exception sendiri untuk umur tidak sah",
          prompt:
            "Lengkapi dua `___`: class exception kustom harus mewarisi kelas yang tepat supaya jadi checked exception, dan keadaan tidak sah harus dilempar dengan kata kunci yang benar.",
          mode: "fill",
          template: `import java.util.Scanner;

class UmurInvalidException extends ___ {
    public UmurInvalidException(String pesan) {
        super(pesan);
    }
}

public class Main {
    static void cekUmur(int umur) throws UmurInvalidException {
        if (umur < 0) {
            ___ new UmurInvalidException("Umur tidak boleh negatif");
        }
        System.out.println("Umur sah: " + umur);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try {
            cekUmur(in.nextInt());
        } catch (UmurInvalidException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          solution: `import java.util.Scanner;

class UmurInvalidException extends Exception {
    public UmurInvalidException(String pesan) {
        super(pesan);
    }
}

public class Main {
    static void cekUmur(int umur) throws UmurInvalidException {
        if (umur < 0) {
            throw new UmurInvalidException("Umur tidak boleh negatif");
        }
        System.out.println("Umur sah: " + umur);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try {
            cekUmur(in.nextInt());
        } catch (UmurInvalidException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
          tests: [
            { stdin: "17", expectedOutput: "Umur sah: 17" },
            { stdin: "-3", expectedOutput: "Umur tidak boleh negatif" },
            { stdin: "0", expectedOutput: "Umur sah: 0", hidden: true },
          ],
          hints: [
            "Checked exception mewarisi Exception, bukan RuntimeException.",
            "Melempar objek exception di dalam method memakai kata kunci throw.",
          ],
        },
      ],
    },
    {
      slug: "exc-multi-catch",
      title: "Multi-catch dan Urutan catch",
      summary: "Susun beberapa catch dengan urutan yang benar, lalu ringkas dengan multi-catch.",
      steps: [
        {
          kind: "theory",
          title: "Satu try, banyak kemungkinan gagal",
          body: "Satu blok `try` bisa gagal dengan beberapa cara berbeda: input bukan angka, pembagi nol, file tak ada. Karena itu satu `try` boleh diikuti beberapa blok `catch`. Saat exception terlempar, JVM memeriksa blok catch satu per satu dari atas ke bawah, dan blok pertama yang tipenya cocok yang dijalankan; sisanya dilewati.\n\nUrutannya menentukan benar atau tidaknya penanganan. Aturan pragmatisnya: yang spesifik di atas, yang umum di bawah. `NumberFormatException` harus tertulis sebelum `Exception`, karena setiap `NumberFormatException` juga adalah `Exception`; kalau blok umumnya maju lebih dulu, blok spesifiknya tak pernah terjangkau. Compiler mengenali pola ini dan menolaknya dengan pesan \"already been caught\".\n\nSejak Java 7 ada ringkasannya: multi-catch, `catch (IOException | SQLException e)`, satu blok untuk dua tipe dengan penanganan yang sama persis. Variabel `e` di dalamnya bersifat final dan tipenya gabungan keduanya. Pakai multi-catch hanya jika isi penanganannya memang identik; begitu perlakuannya berbeda, pisahkan bloknya.",
          code: {
            language: "java",
            content: `try {
    int nilai = Integer.parseInt(input);
    System.out.println(100 / nilai);
} catch (NumberFormatException e) {
    System.out.println("Input bukan angka");
} catch (ArithmeticException e) {
    System.out.println("Pembagi nol");
} catch (Exception e) {
    System.out.println("Lainnya: " + e.getMessage());
}`,
            caption: "Spesifik di atas, umum paling bawah sebagai jaring terakhir.",
          },
        },
        {
          kind: "quiz",
          question:
            "Perhatikan potongan berikut.\n\n```java\ntry {\n    ...\n} catch (Exception e) {\n    System.out.println(\"umum\");\n} catch (NumberFormatException e) {\n    System.out.println(\"spesifik\");\n}\n```\n\nApa yang terjadi saat dikompilasi?",
          options: [
            "Kompilasi berhasil, catch kedua menampung NumberFormatException",
            "Gagal kompilasi: NumberFormatException sudah tertangkap blok di atasnya",
            "Kompilasi berhasil, dua blok dijalankan berurutan untuk satu exception",
            "Gagal kompilasi karena Exception wajib di blok paling atas",
          ],
          answer: 1,
          explanation:
            "Setiap NumberFormatException juga Exception, jadi blok umum di atas sudah menampung semuanya. Blok kedua jadi tak terjangkau, dan compiler menolaknya.",
        },
        {
          kind: "code",
          title: "Perbaiki urutan catch yang salah",
          prompt:
            "Program ini gagal dikompilasi. Pesan untuk setiap jenis masalahnya sudah benar, tapi susunan catch-nya keliru: blok yang terlalu umum berada di atas. Perbaiki urutannya sampai semua tes lulus.",
          mode: "fix",
          template: `import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try {
            int a = in.nextInt();
            int b = in.nextInt();
            System.out.println(a / b);
        } catch (RuntimeException e) {
            System.out.println("Input harus angka bulat");
        } catch (ArithmeticException e) {
            System.out.println("Pembagi tidak boleh nol");
        }
    }
}`,
          solution: `import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try {
            int a = in.nextInt();
            int b = in.nextInt();
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("Pembagi tidak boleh nol");
        } catch (RuntimeException e) {
            System.out.println("Input harus angka bulat");
        }
    }
}`,
          tests: [
            { stdin: "10\n0", expectedOutput: "Pembagi tidak boleh nol" },
            { stdin: "abc\n2", expectedOutput: "Input harus angka bulat" },
            { stdin: "8\n2", expectedOutput: "4", hidden: true },
          ],
          hints: [
            "Baca pesan error compiler: satu blok catch disebut sudah tertangkap blok lain.",
            "RuntimeException adalah induk dari ArithmeticException, jadi yang spesifik harus ditangkap lebih dulu.",
          ],
        },
      ],
    },
    {
      slug: "exc-try-with-resources",
      title: "try-with-resources",
      summary: "Tutup sumber daya otomatis dengan try-with-resources dan interface AutoCloseable.",
      steps: [
        {
          kind: "theory",
          title: "Sumber daya yang wajib dikembalikan",
          body: "Sumber daya seperti file, socket, dan koneksi database bukan milik program sendirian; sistem operasi membatasi jumlahnya, dan lupa menutup berarti bocor yang menumpuk diam-diam. Cara lama menutupnya di `finally` memaksa tulisan berlapis: cek `null`, panggil `close()`, dan `close()` sendiri bisa melempar `IOException` sehingga butuh `try-catch` lagi. Pola ini verbose dan gampang salah tulis.\n\nTry-with-resources membersihkannya. Resource dideklarasikan di dalam kurung `try`, dan compiler menyisipkan pemanggilan `close()` secara otomatis di akhir blok, dalam urutan terbalik dari deklarasi, sekalipun di dalam blok terjadi exception. Syaratnya satu: class resource mengimplementasikan `AutoCloseable`, interface dengan satu method `close()`.\n\nBoleh lebih dari satu resource dalam satu try, dipisah titik koma. Detail yang jarang diketahui: jika blok try dan `close()` sama-sama melempar exception, yang dari blok menjadi exception utama, dan yang dari `close()` tidak hilang melainkan tersimpan sebagai suppressed exception yang bisa dibaca lewat `getSuppressed()`. Sejak Java 9, variabel resource yang sudah efektif final boleh langsung dipakai: `try (in) { ... }`.",
          code: {
            language: "java",
            content: `class Koneksi implements AutoCloseable {
    Koneksi() {
        System.out.println("koneksi dibuka");
    }

    @Override
    public void close() {
        System.out.println("koneksi ditutup");
    }
}

try (Koneksi k = new Koneksi()) {
    System.out.println("query dijalankan");
}

// keluaran:
// koneksi dibuka
// query dijalankan
// koneksi ditutup`,
            caption: "close() dipanggil compiler di akhir blok, apa pun yang terjadi di dalamnya.",
          },
        },
        {
          kind: "quiz",
          question: "Syarat sebuah objek bisa dideklarasikan di dalam try-with-resources?",
          options: [
            "Class-nya implements AutoCloseable",
            "Class-nya extends Thread",
            "Class-nya implements Serializable",
            "Objeknya tidak pernah melempar exception",
          ],
          answer: 0,
          explanation:
            "Compiler memanggil close() di akhir blok, dan method itu berasal dari kontrak AutoCloseable. Tanpa kontrak itu, deklarasi di kurung try ditolak saat kompilasi.",
        },
        {
          kind: "quiz",
          question:
            "Ada dua resource di satu try-with-resources, dipisah titik koma. Kapan keduanya ditutup?",
          options: [
            "Sesuai urutan deklarasinya",
            "Dalam urutan terbalik dari deklarasinya",
            "Secara acak oleh JVM",
            "Hanya yang pertama yang otomatis ditutup",
          ],
          answer: 1,
          explanation:
            "Penutupan berjalan dalam urutan terbalik: yang terakhir dideklarasikan ditutup lebih dulu. Pola ini masuk akal karena resource yang dibuka kemudian sering bergantung pada yang dibuka lebih awal.",
        },
        {
          kind: "code",
          title: "Auto-tutup resource buatanmu sendiri",
          prompt:
            "Simulasi resource dari stdin: lengkapi dua `___` supaya class `SumberDaya` sah sebagai resource (implementasi interface yang tepat) dan blok try-nya berbentuk try-with-resources, sehingga pesan ditutup tercetak otomatis di akhir.",
          mode: "fill",
          template: `import java.util.Scanner;

class SumberDaya implements ___ {
    private final String nama;

    SumberDaya(String nama) {
        this.nama = nama;
        System.out.println(nama + " dibuka");
    }

    void pakai() {
        System.out.println(nama + " dipakai");
    }

    public void close() {
        System.out.println(nama + " ditutup");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        ___ (SumberDaya s = new SumberDaya(in.nextLine())) {
            s.pakai();
        }
    }
}`,
          solution: `import java.util.Scanner;

class SumberDaya implements AutoCloseable {
    private final String nama;

    SumberDaya(String nama) {
        this.nama = nama;
        System.out.println(nama + " dibuka");
    }

    void pakai() {
        System.out.println(nama + " dipakai");
    }

    public void close() {
        System.out.println(nama + " ditutup");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        try (SumberDaya s = new SumberDaya(in.nextLine())) {
            s.pakai();
        }
    }
}`,
          tests: [
            {
              stdin: "koneksi",
              expectedOutput: "koneksi dibuka\nkoneksi dipakai\nkoneksi ditutup",
            },
            {
              stdin: "berkas",
              expectedOutput: "berkas dibuka\nberkas dipakai\nberkas ditutup",
            },
          ],
          hints: [
            "Interface dengan satu method close() yang menjadi syarat try-with-resources bernama AutoCloseable.",
            "Bentuk deklarasinya: try (SumberDaya s = ...) { }, resource ditulis di dalam kurung try.",
          ],
        },
      ],
    },
    {
      slug: "exc-files-dan-path",
      title: "Files dan Path",
      summary:
        "Kenali Path untuk lokasi file dan Files untuk operasinya, plus IOException yang menyertai.",
      steps: [
        {
          kind: "theory",
          title: "Lokasi dan operasi, dua objek yang berbeda",
          body: "Package `java.nio.file` adalah cara modern Java menangani file. Objek `Path` merepresentasikan lokasi di filesystem, bukan isinya: `Path.of(\"data\", \"catatan.txt\")` menyusun `data/catatan.txt` dengan pemisah yang benar di setiap sistem operasi. Dari `Path` bisa ditanya macam-macam: `getFileName()`, `getParent()`, `isAbsolute()`, dan bisa dirapikan dengan `normalize()` untuk membersihkan `.` dan `..`.\n\nOperasi kerjanya ada di class statis `Files`: `Files.exists(path)` untuk keberadaan, `Files.size(path)` untuk ukuran, `Files.readString(path)` untuk membaca seluruh file menjadi satu String, `Files.writeString(path, isi)` untuk menulis, dan `Files.lines(path)` untuk membaca per baris sebagai Stream. Hampir semuanya melempar `IOException`, checked exception dari lesson kedua, jadi pemanggilannya selalu di dalam `try` yang menangani.\n\nSatu catatan desain: memeriksa `Files.exists` lalu membaca tidak pernah sepenuhnya aman, karena file bisa hilang di antara pemeriksaan dan pembacaan. Karena itu pola yang disarankan tetap menangkap `IOException`, dengan pemeriksaan exists sekadar untuk alur yang lebih ramah. Di platform ini judge hanya memberi masukan lewat stdin dan menilai stdout, jadi materi file di modul ini diuji lewat konsep dan quiz; coba langsung potongan kodenya di komputermu sendiri.",
          code: {
            language: "java",
            content: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

Path lokasi = Path.of("data", "catatan.txt");

if (Files.exists(lokasi)) {
    try {
        String isi = Files.readString(lokasi);
        System.out.println(isi.length() + " karakter");
    } catch (IOException e) {
        System.out.println("Gagal membaca: " + e.getMessage());
    }
}`,
            caption: "Path menyimpan lokasi; Files mengerjakan isinya dan melempar IOException.",
          },
        },
        {
          kind: "quiz",
          question: "Di java.nio.file, class yang merepresentasikan lokasi sebuah file adalah?",
          options: ["java.io.File", "Path", "FileStream", "Reader"],
          answer: 1,
          explanation:
            "Path adalah representasi lokasi di java.nio.file. java.io.File adalah cara lama yang masih ada tapi tidak lagi disarankan untuk kode baru.",
        },
        {
          kind: "quiz",
          question: "Sebagian besar method class Files melempar checked exception apa?",
          options: [
            "RuntimeException",
            "IOException",
            "ClassNotFoundException",
            "IllegalArgumentException",
          ],
          answer: 1,
          explanation:
            "Operasi disk bisa gagal karena banyak hal di luar kendali kode, jadi Files menyatakannya sebagai IOException yang wajib ditangani pemanggil.",
        },
      ],
    },
    {
      slug: "exc-scanner-multibaris",
      title: "Scanner Multibaris dengan Aman",
      summary: "Baca input banyak baris tanpa jebakan newline dan tanpa crash saat input habis.",
      steps: [
        {
          kind: "theory",
          title: "Sisa newline, dua pembaca, dan satu jaring pengaman",
          body: "Masalah klasik Scanner: `nextInt()` dan `next()` berhenti membaca sebelum penanda baris, menyisakan karakter newline yang belum ditelan. `nextLine()` berikutnya lalu membaca sisa baris itu, yang isinya kosong, dan program terlihat melompat satu input. Solusinya baku: setelah `nextInt()`, buang sisanya dengan satu panggilan `in.nextLine()` yang hasilnya sengaja tidak dipakai.\n\nDua cara membaca yang perlu dibedakan: `next()` mengambil satu token tanpa spasi, cocok untuk satu kata; `nextLine()` mengambil seluruh baris, spasi dan semua, cocok untuk nama atau kalimat. Membaca sejumlah `n` baris tinggal loop `for` dengan `nextLine()` di dalamnya; membaca sampai input habis pakai `while (in.hasNextLine())`.\n\nAman berarti program tidak runtuh ketika input berakhir lebih awal. Memangsa `nextLine()` saat sudah habis melempar `NoSuchElementException`, unchecked exception yang berarti kamu menagih input yang tidak ada. Karena itu `hasNextLine()` dicek dulu sebelum membaca. Tiga kebiasaan ini, buang newline, pilih pembaca yang sesuai, cek sebelum baca, adalah fondasi semua pemrosesan input di modul ini.",
          code: {
            language: "java",
            content: `Scanner in = new Scanner(System.in);
int n = in.nextInt();
in.nextLine(); // buang sisa baris setelah angka

for (int i = 1; i <= n; i++) {
    String baris = in.nextLine();
    System.out.println(i + ": " + baris);
}`,
            caption: "nextLine() ekstra setelah nextInt() menelan newline yang tertinggal.",
          },
        },
        {
          kind: "quiz",
          question:
            "Perhatikan program berikut.\n\n```java\nint n = in.nextInt();\nString s = in.nextLine();\n```\n\nDengan input `5` di baris pertama lalu `kopi` di baris kedua, apa isi `s`?",
          options: [
            "\"kopi\"",
            "\"\" (teks kosong: sisa baris pertama yang tertinggal)",
            "\"5\"",
            "Melempar NoSuchElementException",
          ],
          answer: 1,
          explanation:
            "nextInt() berhenti sebelum newline, jadi nextLine() berikutnya hanya menelan sisa baris pertama. Untuk membaca kopi, perlu nextLine() ekstra dulu setelah nextInt().",
        },
        {
          kind: "code",
          title: "Nomori setiap baris input",
          prompt:
            "Program ini membaca sejumlah `n` lalu `n` baris berikutnya, dan mencetaknya bernomor. Lengkapi dua `___`: buangan sisa newline setelah `nextInt()`, dan pembaca yang mengambil satu baris utuh beserta spasinya.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        ___; // buang sisa baris setelah angka
        for (int i = 1; i <= n; i++) {
            String baris = in.___();
            System.out.println(i + ": " + baris);
        }
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine(); // buang sisa baris setelah angka
        for (int i = 1; i <= n; i++) {
            String baris = in.nextLine();
            System.out.println(i + ": " + baris);
        }
    }
}`,
          tests: [
            { stdin: "2\nkopi susu\nteh tarik", expectedOutput: "1: kopi susu\n2: teh tarik" },
            { stdin: "3\nalpha\nbeta\ngamma", expectedOutput: "1: alpha\n2: beta\n3: gamma" },
            { stdin: "1\nsatu saja", expectedOutput: "1: satu saja", hidden: true },
          ],
          hints: [
            "Sisa newline setelah nextInt() dibuang dengan satu panggilan in.nextLine() yang hasilnya tidak dipakai.",
            "Pembaca yang mengambil seluruh baris, spasi termasuk, adalah nextLine, bukan next.",
          ],
        },
      ],
    },
    {
      slug: "exc-desain-error",
      title: "Desain Error: Validasi dan Pesan",
      summary: "Validasi di gerbang dan tulis pesan error yang benar-benar membantu.",
      steps: [
        {
          kind: "theory",
          title: "Pesan yang bisa dievaluasi, validasi di gerbang",
          body: "Pesan error yang baik menjawab tiga hal sekaligus: apa yang salah, nilai apa yang bermasalah, dan harapan program seperti apa. Bandingkan `Input tidak valid` dengan `Nilai harus di antara 0 dan 100, dapat: 150`. Yang pertama memaksa penebakan; yang kedua bisa langsung dievaluasi dan diperbaiki. Pesan semahal ini ditulis sekali, tapi dibaca berkali-kali setiap kali validasi gagal.\n\nTempat memvalidasi juga menentukan: di gerbang, sebelum nilai dipakai. Input dari luar diurai dan diperiksa di awal; kalau tidak sah, tolak di situ dengan `throw new IllegalArgumentException(...)` atau tangkap dan laporkan dengan rapi. Jangan biarkan `NumberFormatException` mentah sampai ke mata pengguna; ubah menjadi pesan yang mereka pahami.\n\nLawan dari semua ini adalah blok `catch` kosong: `catch (NumberFormatException e) { }`. Exception-nya tertangkap, lalu dibuang tanpa jejak. Program lanjut berjalan dalam keadaan yang tidak dihitung, dan saat kerusakan muncul di tempat lain, tidak ada petunjuk dari mana asalnya. Kalau memang sengaja mengabaikan satu exception tertentu, tulis komentar yang menjelaskan alasannya; dan seringkali keputusan yang paling jujur adalah membiarkan exception itu naik ke atas.",
          code: {
            language: "java",
            content: `try {
    int umur = Integer.parseInt(input);
    System.out.println("Umur sah: " + umur);
} catch (NumberFormatException e) {
    // jangan hanya printStackTrace(): beri konteks pada pembaca pesannya
    System.out.println("Umur harus angka bulat, dapat: " + input);
}`,
            caption: "Pesan menyebut harapan program dan nilai yang bermasalah sekaligus.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa blok `catch` yang kosong dianggap bahaya?",
          options: [
            "Membuat program berjalan lebih lambat",
            "Informasi error hilang tanpa jejak, sehingga penyebab masalah sulit dilacak",
            "Blok kosong gagal dikompilasi",
            "Exception otomatis dilempar ulang dua kali",
          ],
          answer: 1,
          explanation:
            "catch kosong menelan exception tanpa jejak: program lanjut dalam keadaan tidak terduga, dan saat kerusakan muncul di tempat lain tidak ada petunjuk asalnya.",
        },
        {
          kind: "code",
          title: "Perbaiki batas validasi yang salah",
          prompt:
            "Syarat nilai yang sah adalah 0 sampai 100, termasuk angka 0 dan 100 sendiri. Program ini menolak nilai yang seharusnya sah. Cari satu kesalahannya di pemeriksaan batas, perbaiki, lalu jalankan sampai tes lulus.",
          mode: "fix",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String baris = in.nextLine();
        try {
            int nilai = Integer.parseInt(baris);
            if (nilai <= 0 || nilai > 100) {
                System.out.println("Nilai harus di antara 0 dan 100, dapat: " + nilai);
                return;
            }
            System.out.println("Nilai sah: " + nilai);
        } catch (NumberFormatException e) {
            System.out.println("Nilai harus angka bulat, dapat: " + baris);
        }
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String baris = in.nextLine();
        try {
            int nilai = Integer.parseInt(baris);
            if (nilai < 0 || nilai > 100) {
                System.out.println("Nilai harus di antara 0 dan 100, dapat: " + nilai);
                return;
            }
            System.out.println("Nilai sah: " + nilai);
        } catch (NumberFormatException e) {
            System.out.println("Nilai harus angka bulat, dapat: " + baris);
        }
    }
}`,
          tests: [
            { stdin: "85", expectedOutput: "Nilai sah: 85" },
            { stdin: "0", expectedOutput: "Nilai sah: 0" },
            {
              stdin: "150",
              expectedOutput: "Nilai harus di antara 0 dan 100, dapat: 150",
              hidden: true,
            },
          ],
          hints: [
            "Jalankan dengan input 0: nilai itu sah, tapi program menolaknya.",
            "Batas bawah 0 termasuk angka sah, jadi pembandingnya harus longgar: nilai < 0, bukan nilai <= 0.",
          ],
        },
      ],
    },
    {
      slug: "exc-exception-chaining",
      title: "Exception Chaining",
      summary: "Naikkan exception ke level yang lebih tinggi tanpa kehilangan penyebab aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Menerjemahkan tanpa memutus jejak",
          body: "Semakin dalam arsitektur program, semakin terasa dua dunia: lapisan bawah bicara teknis (`SQLException`, `IOException`), lapisan atas bicara domain (pesanan gagal disimpan, laporan gagal dibuat). Exception chaining menjembatani keduanya: tangkap exception teknis, lempar exception domain dengan pesan yang berarti bagi pemanggil, dan simpan aslinya sebagai `cause`.\n\nMekanismenya lewat constructor dua argumen: `new SimpanGagalException(\"Pesanan #42 gagal disimpan\", e)`. Objek `e` tersimpan di dalam exception baru dan bisa diambil dengan `getCause()`. Saat `printStackTrace()` dipanggil, Java menampilkan rantainya lengkap dengan penanda `Caused by:`, sehingga akar masalah teknis tidak pernah hilang meski pesannya sudah diterjemahkan ke bahasa domain.\n\nYang perlu dijauhi justru dua kelebihan. Membungkus tanpa menyertakan cause, `new SimpanGagalException(\"gagal\")` saja, memutus jejak dan menyulitkan debugging. Membungkus berlapis tanpa menambah informasi, exception membungkus exception membungkus exception, menghasilkan stack trace panjang tanpa makna baru. Bungkus sekali di batas lapisan dengan pesan yang menambah konteks; selebihnya biarkan exception asli naik sendiri.",
          code: {
            language: "java",
            content: `try {
    simpanKeDatabase(pesanan);
} catch (SQLException e) {
    throw new SimpanGagalException(
        "Pesanan " + pesanan.id() + " gagal disimpan", e); // e jadi cause
}

// nanti di tempat penanganan:
// catch (SimpanGagalException x) {
//     System.out.println(x.getMessage());
//     x.getCause().printStackTrace();  // jejak teknis masih ada
// }`,
            caption: "Constructor (pesan, cause) menyimpan penyebab asli di dalam exception baru.",
          },
        },
        {
          kind: "quiz",
          question: "Cara yang benar melempar exception baru sambil menyimpan penyebab aslinya?",
          options: [
            "new SimpanGagalException(\"pesan\", e)",
            "new SimpanGagalException(\"pesan\") lalu membuang e",
            "e.setMessage(\"pesan\")",
            "throw e saja, penyebabnya otomatis tersimpan",
          ],
          answer: 0,
          explanation:
            "Constructor dua argumen (pesan, Throwable) menyimpan exception asli sebagai cause, sehingga getCause() dan penanda Caused by tetap menunjukkan akar masalah.",
        },
        {
          kind: "quiz",
          question: "Method mana yang mengembalikan penyebab (cause) dari sebuah exception?",
          options: ["getMessage()", "getCause()", "getReason()", "printStackTrace()"],
          answer: 1,
          explanation:
            "getCause() mengembalikan Throwable asli yang dibungkus saat exception dilempar. getMessage() hanya mengembalikan teks pesannya, dan printStackTrace() mencetak ke stderr.",
        },
      ],
    },
    {
      slug: "exc-parser-gabungan",
      title: "Latihan: Parser yang Tidak Pernah Crash",
      summary:
        "Gabungkan semua keterampilan modul ini menjadi parser input yang tidak pernah crash.",
      steps: [
        {
          kind: "theory",
          title: "Standar tegas: apa pun inputnya, program selesai dengan normal",
          body: "Modul ini sudah menyediakan semua potongannya: `try-catch` untuk menampung kegagalan, `hasNextLine` untuk menjaga input yang berakhir lebih awal, validasi yang menolak nilai jelek di gerbang, dan pesan error yang bisa dibaca. Saatnya menyusunnya menjadi satu program: parser input yang tidak pernah crash. Standarnya tegas, apa pun isi stdin, program melaporkan hasilnya dan menyelesaikan dirinya dengan normal.\n\nStrategi dasarnya per baris: baris yang sah diproses, baris yang tidak sah dilaporkan dan dilewati. Satu baris jelek tidak boleh membunuh seluruh proses. Pola ini persis pekerjaan nyata: memproses log, beres-beres CSV hasil ekspor, atau menelan payload dari sistem lain yang kualitasnya di luar kendalimu.",
          code: {
            language: "java",
            content: `while (in.hasNextLine()) {
    String baris = in.nextLine().trim();
    if (baris.isEmpty()) {
        continue;
    }
    try {
        int nilai = Integer.parseInt(baris);
        System.out.println("OK " + nilai);
    } catch (NumberFormatException e) {
        System.out.println("SKIP " + baris);
    }
}`,
            caption: "Keputusan per baris: sah diproses, tidak sah dilaporkan, tidak ada yang crash.",
          },
        },
        {
          kind: "code",
          title: "Bangun parser baris yang tahan banting",
          prompt:
            "Program membaca semua baris stdin sampai habis. Baris kosong dilewati diam-diam; baris berisi bilangan bulat dicetak dengan awalan `OK`; baris lain dicetak dengan awalan `SKIP`. Lengkapi tiga `___` di tempat pengecekan akhir input, penguraian angka, dan jenis exceptionnya.",
          mode: "fill",
          template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.___()) {
            String baris = in.nextLine().trim();
            if (baris.isEmpty()) {
                continue;
            }
            try {
                int nilai = Integer.___(baris);
                System.out.println("OK " + nilai);
            } catch (___ e) {
                System.out.println("SKIP " + baris);
            }
        }
    }
}`,
          solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            String baris = in.nextLine().trim();
            if (baris.isEmpty()) {
                continue;
            }
            try {
                int nilai = Integer.parseInt(baris);
                System.out.println("OK " + nilai);
            } catch (NumberFormatException e) {
                System.out.println("SKIP " + baris);
            }
        }
    }
}`,
          tests: [
            { stdin: "12\n-4\nkopi\n\n7", expectedOutput: "OK 12\nOK -4\nSKIP kopi\nOK 7" },
            { stdin: "42", expectedOutput: "OK 42" },
            { stdin: "x\ny", expectedOutput: "SKIP x\nSKIP y", hidden: true },
          ],
          hints: [
            "Loop berjalan selama masih ada baris: metode pengeceknya hasNextLine.",
            "Menguraikan teks menjadi int memakai Integer.parseInt, dan kegagalannya berupa NumberFormatException.",
          ],
        },
      ],
    },
    // ==================== MODUL 5: Java Fungsional ====================
    {
      slug: "fn-lambda-dasar",
      title: "Lambda: Kode sebagai Nilai",
      summary:
        "Tulis implementasi method secara inline dengan lambda dan pahami cara Java menentukan tipenya.",
      steps: [
        {
          kind: "theory",
          title: "Implementasi tanpa upacara",
          body: "Lambda adalah ekspresi yang mewakili implementasi sebuah method, ditulis langsung di tempat dibutuhkan: `(a, b) -> a + b`. Parameter di kiri panah, isi di kanan. Untuk interface `Operasi` dengan satu method `int hitung(int a, int b)`, lambda itu adalah implementasinya, tanpa class pembungkus, tanpa tulisan `@Override`.\n\nYang membuat lambda bekerja adalah target typing: compiler menentukan tipe lambda dari konteks penampungnya. Variabel `Runnable sapa = () -> System.out.println(\"Halo\");` membuat lambda itu menjadi Runnable; lambda bergaya serupa di variabel `Comparator<String>` menjadi comparator. Lambdanya sama, tipenya ikut wadahnya. Karena itu lambda hanya bisa ditulis di tempat yang tipenya interface fungsional, yakni interface dengan satu method abstract.\n\nSintaksnya punya beberapa bentuk yang layak dihafal: tanpa parameter `() -> ekspresi`; satu parameter boleh tanpa kurung, `s -> s.length()`; dan kalau isinya lebih dari satu pernyataan, bungkus dengan kurung kurawal dan tulis `return` eksplisit: `(a, b) -> { int hasil = a * b; return hasil; }`.",
          code: {
            language: "java",
            content: `Runnable sapa = () -> System.out.println("Halo dari lambda");
sapa.run(); // Halo dari lambda

Comparator<String> perPanjang = (a, b) -> a.length() - b.length();
// membandingkan dua string dari panjangnya`,
            caption: "Tipe lambda ditentukan variabel penampungnya, bukan isinya.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah penulisan lambda yang sah untuk menjumlahkan dua bilangan?",
          options: ["(a, b) -> a + b", "a, b -> a + b", "(a, b) => a + b", "lambda(a, b): a + b"],
          answer: 0,
          explanation:
            "Parameter diapit kurung, pemisahnya panah ->, dan isi menyusul. Panah => milik bahasa lain, dan parameter tanpa kurung hanya sah untuk satu parameter.",
        },
        {
          kind: "code",
          title: "Perkalian dalam satu lambda",
          prompt:
            "Interface `Operasi` berhak jadi target lambda karena hanya punya satu method abstract. Lengkapi dua `___`: isi variabel `kali` dengan lambda yang mengalikan dua parameternya, dan panggil method interface yang tepat.",
          mode: "fill",
          template: `import java.util.Scanner;

interface Operasi {
    int hitung(int a, int b);
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        Operasi kali = ___;
        System.out.println(kali.___(a, b));
    }
}`,
          solution: `import java.util.Scanner;

interface Operasi {
    int hitung(int a, int b);
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        Operasi kali = (x, y) -> x * y;
        System.out.println(kali.hitung(a, b));
    }
}`,
          tests: [
            { stdin: "3\n4", expectedOutput: "12" },
            { stdin: "-2\n5", expectedOutput: "-10" },
            { stdin: "7\n0", expectedOutput: "0", hidden: true },
          ],
          hints: [
            "Bentuknya dua parameter di kurung, panah, lalu ekspresi hasilnya: (x, y) -> x * y.",
            "Memanggil method lewat objek lambda sama seperti method biasa: kali.hitung(a, b).",
          ],
        },
      ],
    },
    {
      slug: "fn-functional-interface",
      title: "Functional Interface",
      summary: "Syarat sebuah interface jadi target lambda dan fungsi anotasi @FunctionalInterface.",
      steps: [
        {
          kind: "theory",
          title: "Satu method abstract, tak lebih",
          body: "Interface fungsional adalah interface dengan tepat satu method abstract. Jumlah inilah syaratnya, bukan nama atau paketnya: compiler menghitung berapa method abstract yang harus diimplementasikan, dan kalau jawabannya satu, lambda bisa menjadi implementasinya. Method `default` dan `static` tidak ikut dihitung karena sudah membawa isinya sendiri.\n\nAnotasi `@FunctionalInterface` bersifat opsional. Ia tidak membuat interface menjadi fungsional; ia menyuruh compiler memeriksa bahwa interface itu memang hanya punya satu method abstract, dan menggagalkan kompilasi kalau seseorang menambah method kedua. Perannya mirip `@Override`: dokumentasi yang divalidasi. Kebiasaan yang baik: beri anotasi ini di setiap interface fungsional yang kamu tulis sendiri.\n\nSebelum menulis interface fungsional sendiri, cek dulu `java.util.function`: `Predicate`, `Function`, `Consumer`, `Supplier`, beserta varian `Bi`-nya, sudah menutup sebagian besar kebutuhan. Interface buatan sendiri layak ketika nama domainmu lebih bermakna daripada nama generik bawaannya, misalnya `ValidasiNisn` alih-alih `Predicate<String>` di tempat yang sama.",
          code: {
            language: "java",
            content: `@FunctionalInterface
interface Validasi {
    boolean cek(String input); // satu-satunya method abstract
}

Validasi tidakKosong = s -> !s.isEmpty();
System.out.println(tidakKosong.cek("kode")); // true`,
            caption: "Kalau ada yang menambah method kedua, compiler langsung protes.",
          },
        },
        {
          kind: "quiz",
          question: "Sebuah interface bisa menjadi target lambda jika?",
          options: [
            "Punya tepat satu method abstract",
            "Punya minimal dua method default",
            "Semua methodnya static",
            "Dianotasi @FunctionalInterface",
          ],
          answer: 0,
          explanation:
            "Syaratnya jumlah method abstract: tepat satu. Anotasi hanya alat pemeriksa, dan method default maupun static tidak dihitung karena sudah punya isi.",
        },
        {
          kind: "quiz",
          question: "Apa gunanya anotasi @FunctionalInterface?",
          options: [
            "Wajib ada supaya lambda bisa dibuat",
            "Menyuruh compiler memeriksa interface itu benar hanya punya satu method abstract",
            "Menghasilkan implementasi otomatis untuk methodnya",
            "Membuat interface bisa diinstansiasi dengan new",
          ],
          answer: 1,
          explanation:
            "Anotasinya opsional, tetapi begitu dipasang, penambahan method abstract kedua gagal dikompilasi. Perannya seperti @Override: dokumentasi yang divalidasi.",
        },
      ],
    },
    {
      slug: "fn-predicate-function",
      title: "Predicate dan Function",
      summary:
        "Predicate untuk syarat, Function untuk transformasi: dua interface bawaan yang paling sering dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Menanya dan mengubah",
          body: "`Predicate<T>` adalah operasi yang menerima satu nilai T dan menjawab boolean: `Predicate<String> kosong = s -> s.isEmpty();` lalu dipanggil dengan `kosong.test(\"\")`. Ini interface untuk semua syarat dan penyaring. Ia juga punya method komposisi: `a.and(b)`, `a.or(b)`, dan `a.negate()` menyambung beberapa syarat tanpa menulis `&&` manual di dalam lambda.\n\n`Function<T, R>` menerima T dan mengubahnya menjadi R: `Function<String, Integer> panjang = s -> s.length();` dipanggil dengan `panjang.apply(\"kode\")` yang hasilnya 4. Inilah interface untuk transformasi. Arah pengolahannya bisa disambung: `f.andThen(g)` menjalankan f lalu g, sedangkan `f.compose(g)` sebaliknya, g dulu baru f.\n\nKeduanya bergenerik, jadi tipe argumennya harus wrapper: `Predicate<Integer>`, bukan `Predicate<int>`, karena generics Java tidak menampung primitif. Konsekuensinya ada autoboxing kecil di tiap panggilan; untuk kode yang benar-benar sensitif performa tersedia varian khusus seperti `IntPredicate`, tapi untuk mayoritas pemakaian `Predicate<Integer>` adalah pilihan yang tepat.",
          code: {
            language: "java",
            content: `import java.util.function.Function;
import java.util.function.Predicate;

Predicate<String> kosong = s -> s.isEmpty();
Function<String, Integer> panjang = s -> s.length();

System.out.println(kosong.test(""));       // true
System.out.println(panjang.apply("kode")); // 4`,
            caption: "test() menanya, apply() mengubah; dua kata kerja yang perlu diingat.",
          },
        },
        {
          kind: "quiz",
          question:
            "Perhatikan kode berikut.\n\n```java\nFunction<String, Integer> panjang = s -> s.length();\nSystem.out.println(panjang.apply(\"kode\"));\n```\n\nApa keluarannya?",
          options: ["4", "\"kode\"", "kode", "Gagal dikompilasi"],
          answer: 0,
          explanation:
            "Function dipanggil dengan apply, dan lambdanya menghitung panjang string. Panjang \"kode\" adalah 4.",
        },
        {
          kind: "code",
          title: "Hitung bilangan genap dengan Predicate",
          prompt:
            "Program membaca `n` bilangan lalu menghitung berapa yang genap. Lengkapi dua `___`: lambdanya menyatakan syarat genap, dan pemanggilan syarat itu lewat method milik Predicate.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        List<Integer> angka = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            angka.add(in.nextInt());
        }
        Predicate<Integer> genap = ___;
        int jumlah = 0;
        for (int k : angka) {
            if (genap.___(k)) {
                jumlah++;
            }
        }
        System.out.println(jumlah);
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        List<Integer> angka = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            angka.add(in.nextInt());
        }
        Predicate<Integer> genap = k -> k % 2 == 0;
        int jumlah = 0;
        for (int k : angka) {
            if (genap.test(k)) {
                jumlah++;
            }
        }
        System.out.println(jumlah);
    }
}`,
          tests: [
            { stdin: "5\n1\n2\n3\n4\n6", expectedOutput: "3" },
            { stdin: "3\n7\n9\n11", expectedOutput: "0" },
            { stdin: "1\n0", expectedOutput: "1", hidden: true },
          ],
          hints: [
            "Syarat genap diuji dengan sisa bagi: k % 2 == 0.",
            "Predicate dijalankan lewat method test: genap.test(k).",
          ],
        },
      ],
    },
    {
      slug: "fn-consumer-supplier",
      title: "Consumer dan Supplier",
      summary: "Consumer menelan nilai, Supplier menghasilkannya, lengkap dengan pemakaiannya.",
      steps: [
        {
          kind: "theory",
          title: "Empat arah data",
          body: "`Consumer<T>` menerima satu nilai, menggerakannya, dan tidak mengembalikan apa pun: `Consumer<String> cetak = s -> System.out.println(\">> \" + s);` dipanggil dengan `cetak.accept(\"halo\")`. Ini interface untuk efek samping yang memang disengaja: mencetak, menulis log, mengisi field. `andThen()` menyambung dua consumer sehingga keduanya dijalankan berurutan atas nilai yang sama.\n\n`Supplier<T>` kebalikannya: tidak menerima apa pun, menghasilkan satu nilai T: `Supplier<List<String>> pabrik = ArrayList::new;` dipanggil dengan `pabrik.get()`. Pemakaiannya yang paling sering muncul adalah nilai bawaan yang dihitung hanya kalau perlu: `orElseGet(Supplier)` pada Optional menjalankan suppliernya saat dibutuhkan saja, berbeda dengan `orElse(nilai)` yang argumennya selalu dihitung duluan.\n\nArah datanya bisa dirangkum jadi satu kalimat yang gampang diingat: `Predicate` menanya ya atau tidak, `Function` mengubah bentuk, `Consumer` menelan untuk dipakai, `Supplier` menghasilkan dari nol. Empat arah ini menutup hampir semua kebutuhan lambda sehari-hari; sisanya, seperti `BiFunction<T, U, R>` untuk dua argumen, hanya variasi di atas pola yang sama.",
          code: {
            language: "java",
            content: `import java.util.function.Consumer;
import java.util.function.Supplier;

Consumer<String> cetak = s -> System.out.println(">> " + s);
Supplier<String> sapaan = () -> "Halo";

cetak.accept(sapaan.get()); // >> Halo`,
            caption: "accept() menelan, get() menghasilkan; dua arah yang berlawanan.",
          },
        },
        {
          kind: "quiz",
          question: "Interface mana yang mewakili operasi yang menerima satu nilai dan tidak mengembalikan apa pun?",
          options: ["Supplier<T>", "Consumer<T>", "Predicate<T>", "Function<T,R>"],
          answer: 1,
          explanation:
            "Consumer menerima dan mengolah tanpa hasil lewat accept(). Supplier justru tanpa masukan, Predicate mengembalikan boolean, Function mengembalikan nilai baru.",
        },
        {
          kind: "code",
          title: "Cetak daftar dengan Consumer",
          prompt:
            "Program membaca `n` baris lalu mencetak setiap baris dengan awalan `* `. Lengkapi dua `___`: lambdanya mencetak satu baris dengan awalan itu, dan method Collections yang menerima Consumer untuk setiap elemennya.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Consumer;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> kata = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            kata.add(in.nextLine());
        }
        Consumer<String> cetak = ___;
        kata.___(cetak);
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Consumer;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> kata = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            kata.add(in.nextLine());
        }
        Consumer<String> cetak = s -> System.out.println("* " + s);
        kata.forEach(cetak);
    }
}`,
          tests: [
            { stdin: "2\nkopi\nteh", expectedOutput: "* kopi\n* teh" },
            { stdin: "1\nsusu", expectedOutput: "* susu" },
            { stdin: "3\na\nb\nc", expectedOutput: "* a\n* b\n* c", hidden: true },
          ],
          hints: [
            "Lambdanya menerima satu parameter s dan mencetaknya dengan awalan: s -> System.out.println(\"* \" + s).",
            "Method List yang menjalankan Consumer untuk setiap elemen bernama forEach.",
          ],
        },
      ],
    },
    {
      slug: "fn-method-reference",
      title: "Method Reference",
      summary: "Persingkat lambda yang isinya cuma satu panggilan method dengan tanda ::.",
      steps: [
        {
          kind: "theory",
          title: "Tiga bentuk tanda ::",
          body: "Banyak lambda yang isinya cuma satu hal: memanggil method yang sudah ada. `s -> System.out.println(s)` tidak menambah logika apa pun di luar panggilan itu. Untuk pola seperti ini Java menyediakan method reference, ditulis dengan dua titik dua: `System.out::println`. Keduanya setara, dan versi `::` membaca lebih langsung: untuk setiap elemen, panggil println milik System.out.\n\nTiga bentuknya perlu dibedakan. `objek::method` memanggil method pada objek tertentu, seperti `System.out::println`. `Class::method` dipakai untuk method statis (`Integer::parseInt`) maupun method instance yang penerimanya justru parameter lambda: `String::toUpperCase` berarti `s -> s.toUpperCase()`. Bentuk ketiga, `Class::new`, adalah referensi constructor: `ArrayList::new` berarti memanggil `new ArrayList<>()`.\n\nBatasiannya adalah keterbacaan. Method reference menang kalau nama methodnya sudah menceritakan isinya: `String::isBlank`, `Objects::isNull`, `System.out::println`. Lambda menang begitu ada logika tambahan: `s -> s.length() > 3 && s.startsWith(\"a\")` tidak punya bentuk `::` yang tetap terbaca. Aturan kasarnya: pakai `::` kalau pembaca tidak perlu berhenti untuk memahaminya.",
          code: {
            language: "java",
            content: `import java.util.List;
import java.util.function.Function;

List<String> nama = List.of("ani", "budi");

nama.forEach(s -> System.out.println(s)); // bentuk lambda
nama.forEach(System.out::println);        // method reference, hasil sama

Function<String, Integer> panjang = String::length; // s -> s.length()`,
            caption: "Kalau isinya cuma satu panggilan method, tanda :: lebih langsung.",
          },
        },
        {
          kind: "quiz",
          question: "Lambda manakah yang setara dengan method reference `System.out::println`?",
          options: [
            "s -> System.out.println(s)",
            "System.out.println(s)",
            "s -> println(s)",
            "() -> System.out.println",
          ],
          answer: 0,
          explanation:
            "System.out::println menerima satu argumen lalu mencetaknya, persis seperti lambda s -> System.out.println(s). Tanpa parameter lambda, tidak ada yang bisa dicetak.",
        },
        {
          kind: "code",
          title: "Kapitalkan dengan method reference",
          prompt:
            "Program membaca `n` baris lalu mencetak versi huruf besar setiap baris. Lengkapi dua `___`: method reference untuk mengubah String menjadi huruf besar, dan method Function untuk menjalankan transformasinya.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Function;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> kata = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            kata.add(in.nextLine());
        }
        Function<String, String> kapital = ___;
        for (String s : kata) {
            System.out.println(kapital.___(s));
        }
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Function;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> kata = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            kata.add(in.nextLine());
        }
        Function<String, String> kapital = String::toUpperCase;
        for (String s : kata) {
            System.out.println(kapital.apply(s));
        }
    }
}`,
          tests: [
            { stdin: "2\nkopi\nsusu", expectedOutput: "KOPI\nSUSU" },
            { stdin: "1\nJawa", expectedOutput: "JAWA" },
            { stdin: "3\nsa\ntu\ndua", expectedOutput: "SA\nTU\nDUA", hidden: true },
          ],
          hints: [
            "Method instance String yang mengubah ke huruf besar dirujuk lewat class-nya: String::toUpperCase.",
            "Function dijalankan lewat method apply, sama seperti pada lesson Predicate dan Function.",
          ],
        },
      ],
    },
    {
      slug: "fn-optional-dasar",
      title: "Optional: Pengganti null",
      summary: "Gantikan null dengan Optional dan baca isinya dengan aman lewat orElse.",
      steps: [
        {
          kind: "theory",
          title: "Kekosongan yang diakui sejak tanda tangan method",
          body: "`null` adalah sumber `NullPointerException` klasik: method yang kadang tidak punya jawaban mengembalikan `null`, dan pemanggil yang lupa memeriksa langsung jatuh. `Optional<T>` mengganti kebiasaan itu dengan wadah eksplisit: tipe kembalian `Optional<Integer>` sudah mengatakan sejak tanda tangan method bahwa jawabannya mungkin tidak ada. Tidak ada lagi tebakan diam-diam.\n\nMembuatnya ada tiga cara: `Optional.of(nilai)` untuk nilai yang dijamin tidak null, dan null di sini langsung melempar NPE, memang itu tujuannya, gagal cepat saat kontrak dilanggar; `Optional.ofNullable(nilai)` untuk nilai yang boleh null, yang lalu menjadi `Optional.empty()`; dan `Optional.empty()` untuk keadaan kosongnya.\n\nMembacanya pun tanpa risiko: `isPresent()` dan `isEmpty()` menanyakan keadaan; `orElse(nilaiLain)` mengembalikan isi atau nilai bawaan; `orElseGet(supplier)` sama tetapi bawaannya dihitung hanya saat perlu; `orElseThrow()` melempar kalau kosong. Dua kebiasaan yang perlu dijauhi: `get()` tanpa pemeriksaan, yang hanya memindahkan NPE ke tempat lain, dan `Optional` sebagai field class atau parameter; tempat paling pas untuknya adalah tipe kembalian method.",
          code: {
            language: "java",
            content: `import java.util.Optional;

Optional<String> ada = Optional.of("kopi");
Optional<String> kosong = Optional.empty();
Optional<String> mungkin = Optional.ofNullable(null); // menjadi empty

System.out.println(ada.orElse("teh"));    // kopi
System.out.println(kosong.orElse("teh")); // teh`,
            caption: "orElse() memberi jalan keluar yang aman untuk wadah kosong.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran pernyataan berikut?\n\n```java\nSystem.out.println(Optional.ofNullable(null).orElse(\"kosong\"));\n```",
          options: ["null", "kosong", "Optional.empty", "Melempar NullPointerException"],
          answer: 1,
          explanation:
            "ofNullable(null) menghasilkan wadah kosong, dan orElse(\"kosong\") mengembalikan nilainya saat wadah kosong. Yang tercetak adalah kosong.",
        },
        {
          kind: "code",
          title: "Cek stok tanpa takut null",
          prompt:
            "Program mencari barang di peta stok. Barang yang tidak terdaftar menghasilkan null dari `get`, jadi wadahnya harus dibuat dengan cara yang menerima null, dan dibaca dengan nilai bawaan nol. Lengkapi dua `___`.",
          mode: "fill",
          template: `import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Map<String, Integer> stok = new HashMap<>();
        stok.put("kopi", 12);
        stok.put("teh", 7);
        String nama = in.nextLine();
        Optional<Integer> nilai = Optional.___(stok.get(nama));
        System.out.println("Stok " + nama + ": " + nilai.___(0));
    }
}`,
          solution: `import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Map<String, Integer> stok = new HashMap<>();
        stok.put("kopi", 12);
        stok.put("teh", 7);
        String nama = in.nextLine();
        Optional<Integer> nilai = Optional.ofNullable(stok.get(nama));
        System.out.println("Stok " + nama + ": " + nilai.orElse(0));
    }
}`,
          tests: [
            { stdin: "kopi", expectedOutput: "Stok kopi: 12" },
            { stdin: "gula", expectedOutput: "Stok gula: 0" },
            { stdin: "teh", expectedOutput: "Stok teh: 7", hidden: true },
          ],
          hints: [
            "Hasil pencarian boleh null, jadi pembuat wadahnya ofNullable, bukan of.",
            "Membaca isi wadah dengan nilai bawaan memakai orElse.",
          ],
        },
      ],
    },
    {
      slug: "fn-optional-map-filter",
      title: "Optional dengan map dan filter",
      summary: "Rantai map dan filter pada Optional tanpa blok if berlapis.",
      steps: [
        {
          kind: "theory",
          title: "Transformasi yang menoleh pada kekosongan",
          body: "`map` mengubah isi Optional kalau isinya ada, lalu mengembalikan Optional baru: `Optional.of(\"kode\").map(String::length)` hasilnya `Optional[4]`. Kalau wadahnya kosong, `map` melewatinya tanpa error dan hasilnya tetap kosong. Inilah bedanya dari `if (opt.isPresent())`: transformasi bisa disambung tanpa satu blok if pun.\n\n`filter` menyaring isi dengan `Predicate`: syaratnya lolos, Optional tetap berisi; syaratnya gagal, menjadi empty. Keduanya dirancang untuk dirantai: `cari(nama).filter(u -> u.aktif()).map(Kartu::tampil).orElse(\"tidak ada\")` membaca seperti satu kalimat, dari pencarian sampai nilai bawaan, tanpa pemeriksaan manual di tengah jalan.\n\nSatu varian yang muncul begitu sering: transformasimu sendiri sudah mengembalikan `Optional`. Menyambungnya dengan `map` menghasilkan `Optional<Optional<T>>`, wadah dalam wadah. Untuk kasus ini pakai `flatMap`, yang membungkusnya sekali saja. Dan anjuran lama tetap berlaku sebagai penutup: `isPresent()` lalu `get()` sah untuk pemakaian sesekali, tapi kalau pola itu muncul terus, hampir selalu ada rangkaian `map`, `filter`, dan `orElse` yang lebih ringkas.",
          code: {
            language: "java",
            content: `Optional<String> nama = Optional.of("kodekita");

Optional<Integer> panjang = nama.map(String::length);
Optional<String> tersaring = nama.filter(s -> s.length() > 4);

System.out.println(panjang.get());                 // 8
System.out.println(tersaring.orElse("tidak ada")); // kodekita`,
            caption: "map mengubah isi, filter menyaring; keduanya sadar kekosongan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `Optional.of(5).map(x -> x * 2).orElse(0)`?",
          options: ["5", "10", "0", "Optional[10]"],
          answer: 1,
          explanation:
            "Wadahnya berisi 5, map melipatduakannya menjadi 10, dan orElse(0) tidak dipakai karena wadah tidak kosong. Hasil akhirnya angka 10.",
        },
        {
          kind: "quiz",
          question: "Apa hasil `Optional.of(7).filter(x -> x % 2 == 0).isPresent()`?",
          options: ["true", "false", "7", "0"],
          answer: 1,
          explanation:
            "Syarat genap gagal untuk 7, jadi filter mengosongkan wadahnya, dan isPresent() menjawab false. Wadah kosong bukan error, hanya kosong.",
        },
      ],
    },
    {
      slug: "fn-lambda-collections",
      title: "Lambda di Collections",
      summary: "removeIf, forEach, dan sort: lambda di method-method Collections.",
      steps: [
        {
          kind: "theory",
          title: "Method bawaan yang menunggu lambda",
          body: "Sejak Java 8, antarmuka `Collection` membawa method yang langsung menerima lambda: `removeIf(Predicate)` untuk membuang elemen yang memenuhi syarat, dan `forEach(Consumer)` untuk memproses setiap elemen. `List` menambah `replaceAll(UnaryOperator)` untuk mengubah semua isi dan `sort(Comparator)` untuk mengurutkan. Semuanya method biasa di atas list yang sama; lambda hanya mengganti cara menuliskan kriterianya.\n\n`removeIf` punya keunggulan yang bukan sekadar ringkas: dia menghapus dengan aman. Menghapus elemen lewat loop for-each manual memicu `ConcurrentModificationException`, karena list berubah strukturnya saat sedang diiterasi. Cara aman versi lama memakai `Iterator` dengan `iterator.remove()`, dan `removeIf` pada dasarnya mengemas pola itu menjadi satu panggilan.\n\nUntuk pengurutan, lambda dan method reference jadi pasangan yang pas dengan `Comparator`: `list.sort(Comparator.comparing(String::length))` mengurutkan berdasarkan panjang, dan `.reversed()` membalik arahnya. Dari semua pemakaian lambda di collections, tiga ini yang paling sering muncul di kode nyata: `removeIf` untuk membersihkan, `forEach` untuk memproses, `sort` untuk menata.",
          code: {
            language: "java",
            content: `import java.util.ArrayList;
import java.util.List;

List<Integer> angka = new ArrayList<>(List.of(4, 7, 10, 13));

angka.removeIf(n -> n % 2 == 0);           // buang yang genap
angka.forEach(n -> System.out.println(n)); // 7, lalu 13`,
            caption: "removeIf mengubah list langsung, aman dari ConcurrentModificationException.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `removeIf` lebih aman daripada menghapus elemen lewat loop for-each manual?",
          options: [
            "removeIf tidak benar-benar mengubah list",
            "Menghapus elemen saat iterasi manual memicu ConcurrentModificationException",
            "for-each tidak boleh dipakai pada ArrayList",
            "removeIf berjalan di thread terpisah",
          ],
          answer: 1,
          explanation:
            "List tidak mengizinkan perubahan struktural selama iterasi. removeIf menangani penghapusannya lewat Iterator secara benar, jadi tidak memicu exception itu.",
        },
        {
          kind: "code",
          title: "Buang yang genap, cetak sisanya",
          prompt:
            "Program membaca `n` bilangan ke dalam list, membuang semua bilangan genap, lalu mencetak sisanya dalam urutan aslinya. Lengkapi dua `___` dengan method Collections penerima lambda yang tepat.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        List<Integer> angka = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            angka.add(in.nextInt());
        }
        angka.___(k -> k % 2 == 0);
        angka.___(k -> System.out.println(k));
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        List<Integer> angka = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            angka.add(in.nextInt());
        }
        angka.removeIf(k -> k % 2 == 0);
        angka.forEach(k -> System.out.println(k));
    }
}`,
          tests: [
            { stdin: "5\n1\n2\n3\n4\n5", expectedOutput: "1\n3\n5" },
            { stdin: "4\n10\n20\n30\n41", expectedOutput: "41" },
            { stdin: "4\n9\n8\n7\n6", expectedOutput: "9\n7", hidden: true },
          ],
          hints: [
            "Membuang elemen yang memenuhi syarat memakai removeIf.",
            "Menjalankan satu aksi untuk setiap elemen memakai forEach.",
          ],
        },
      ],
    },
    {
      slug: "fn-lambda-vs-anonymous",
      title: "Lambda vs Anonymous Class",
      summary:
        "Kapan lambda cukup, kapan anonymous class masih diperlukan, dan beda this di keduanya.",
      steps: [
        {
          kind: "theory",
          title: "Bukan sekadar gula sintaks",
          body: "Sebelum Java 8, satu-satunya cara memberi implementasi method secara inline adalah anonymous class: `new Runnable() { public void run() { ... } }`. Lambda menggantikan sebagian besar pemakaiannya, tapi keduanya bukan benda yang sama. Beda yang paling sering menjebak: makna `this`. Di dalam anonymous class, `this` merujuk ke instance anonymous class itu; di dalam lambda, `this` merujuk ke instance class yang melingkupinya, karena lambda tidak punya scope sendiri.\n\nBeda kedua: jangkauan. Lambda hanya menempel pada interface fungsional, satu method abstract. Anonymous class bisa mengimplementasikan interface dengan banyak method sekaligus, meng-extend class, menambahkan field, dan menyimpan state antar panggilan. Itulah alasan anonymous class masih hidup: listener lama dengan lima method, atau kebutuhan menyimpan data di dalam implementasinya.\n\nAturan yang berlaku sama di keduanya dan sering muncul di compiler: lambda dan anonymous class hanya boleh memakai variabel lokal di sekelilingnya kalau variabel itu effectively final, tidak pernah ditugaskan ulang. Untuk kasus satu method tanpa state, pilih lambda: lebih pendek, dan makna `this`-nya tidak berubah di tengah kode.",
          code: {
            language: "java",
            content: `// sebelum Java 8: anonymous class
Runnable lama = new Runnable() {
    @Override
    public void run() {
        System.out.println("dari anonymous class");
    }
};

// Java 8 ke atas: lambda
Runnable baru = () -> System.out.println("dari lambda");`,
            caption: "Hasilnya sama, tapi this di dalam keduanya berbeda makna.",
          },
        },
        {
          kind: "quiz",
          question: "Lambda TIDAK bisa menggantikan anonymous class pada kasus mana?",
          options: [
            "Implementasi Runnable yang punya satu method run",
            "Implementasi interface dengan tiga method abstract",
            "Implementasi Comparator yang punya satu method compare",
            "Implementasi Function yang punya satu method apply",
          ],
          answer: 1,
          explanation:
            "Lambda hanya bisa untuk interface fungsional dengan satu method abstract. Interface dengan tiga method abstract butuh anonymous class, atau class biasa.",
        },
        {
          kind: "quiz",
          question: "Di dalam body lambda, kata `this` merujuk ke?",
          options: [
            "Objek lambda itu sendiri",
            "Instance class yang melingkupinya",
            "Interface fungsional targetnya",
            "null",
          ],
          answer: 1,
          explanation:
            "Lambda tidak punya scope sendiri, jadi this tetap berarti instance di sekitarnya. Di anonymous class, this merujuk ke instance anonymous class itu.",
        },
      ],
    },
    {
      slug: "fn-latihan-gabungan",
      title: "Latihan Gabungan Java Fungsional",
      summary:
        "Satu program kecil yang memakai lambda, Predicate, dan method reference sekaligus.",
      steps: [
        {
          kind: "theory",
          title: "Masuk, saring, kumpulkan, laporkan",
          body: "Modul ini memberi perangkatnya: lambda untuk menulis perilaku secara inline, `Predicate` untuk syarat, `Consumer` untuk pemrosesan, method reference untuk memangkas, dan `Optional` untuk kekosongan yang jujur. Latihan penutup menyusun sebagiannya menjadi satu program nyata: membaca daftar nama dan skor, menyaring dengan syarat yang dinyatakan sebagai `Predicate` bernama, lalu melaporkan hasilnya dengan `forEach`.\n\nPerhatikan pola di program latihan: parse dan validasi di gerbang, keputusan dinyatakan sebagai objek syarat yang punya nama (`lulus`), hasil dikumpulkan lalu dilaporkan sekali di akhir. Pola itu, data masuk, saring, kumpulkan, laporkan, adalah bentuk paling umum dari kode fungsional di Java sehari-hari, dan fondasi langsung untuk modul berikutnya tentang Streams API.",
          code: {
            language: "java",
            content: `Predicate<Integer> lulus = skor -> skor >= 70;

List<String> lolos = new ArrayList<>();
for (String baris : daftarBaris) {
    String[] potongan = baris.split(" ");
    int skor = Integer.parseInt(potongan[1]);
    if (lulus.test(skor)) {
        lolos.add(potongan[0]);
    }
}
lolos.forEach(System.out::println);`,
            caption: "Syarat beri nama, data disaring sekali, laporan diberikan di akhir.",
          },
        },
        {
          kind: "code",
          title: "Rekap kelulusan dengan Predicate dan forEach",
          prompt:
            "Program membaca `n` baris berformat `nama skor`, lalu mencetak jumlah yang lulus (skor minimal 70) beserta namanya berawalan `- `. Lengkapi tiga `___`: lambdanya menyatakan syarat lulus, penguraian skor, dan method untuk mencetak setiap nama yang lolos.",
          mode: "fill",
          template: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> lolos = new ArrayList<>();
        Predicate<Integer> lulus = ___;
        for (int i = 0; i < n; i++) {
            String[] potongan = in.nextLine().split(" ");
            String nama = potongan[0];
            int skor = Integer.___(potongan[1]);
            if (lulus.test(skor)) {
                lolos.add(nama);
            }
        }
        System.out.println("Lulus: " + lolos.size());
        lolos.___(nm -> System.out.println("- " + nm));
    }
}`,
          solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();
        List<String> lolos = new ArrayList<>();
        Predicate<Integer> lulus = skor -> skor >= 70;
        for (int i = 0; i < n; i++) {
            String[] potongan = in.nextLine().split(" ");
            String nama = potongan[0];
            int skor = Integer.parseInt(potongan[1]);
            if (lulus.test(skor)) {
                lolos.add(nama);
            }
        }
        System.out.println("Lulus: " + lolos.size());
        lolos.forEach(nm -> System.out.println("- " + nm));
    }
}`,
          tests: [
            {
              stdin: "3\nAni 80\nBudi 60\nCitra 70",
              expectedOutput: "Lulus: 2\n- Ani\n- Citra",
            },
            { stdin: "1\nDedi 69", expectedOutput: "Lulus: 0" },
            {
              stdin: "4\nEka 100\nFajar 0\nGita 71\nHana 70",
              expectedOutput: "Lulus: 3\n- Eka\n- Gita\n- Hana",
              hidden: true,
            },
          ],
          hints: [
            "Syarat lulus: skor minimal 70, termasuk 70 sendiri, jadi pembandingnya >=.",
            "Menguraikan teks menjadi int memakai Integer.parseInt, dan mencetak setiap nama memakai forEach.",
          ],
        },
      ],
    },
  ],
};
