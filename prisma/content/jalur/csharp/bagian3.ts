import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "csharp",
  moduleRange: [4, 5],
  modules: [
    {
      title: "Exception dan File I/O",
      description: "try/catch/finally, using statement, File/Directory, System.Text.Json.",
    },
    {
      title: "LINQ Inti",
      description: "Where/Select/OrderBy dengan method syntax, dan deferred execution.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: Exception dan File I/O ====================
    {
      slug: "exc-try-catch-finally",
      title: "try, catch, dan finally",
      summary: "Menjaga kode berisiko dengan try/catch, memahami alur exception, dan finally yang selalu dijalankan.",
      steps: [
        {
          kind: "theory",
          title: "Rencana B saat eksekusi tidak bisa dilanjutkan",
          body: "Exception adalah objek yang membawa informasi kegagalan. Saat program menemui kondisi yang tidak bisa dilanjutkan, misalnya membagi bilangan bulat dengan nol, runtime membuat objek exception dan melemparkannya. Eksekusi baris demi baris langsung berhenti: sisa pernyataan di blok `try` dilewati, dan runtime mencari blok `catch` yang tipenya cocok. Program tanpa catch yang cocok berhenti dengan pesan error dan jejak stack di layar.\n\nAnatomi dasarnya tiga blok. `try` membungkus kode berisiko. `catch` menyatakan tipe yang ditangkap, misalnya `catch (FormatException)`, dan isinya berupa rencana penanganan. `finally` menampung pekerjaan yang harus jalan apa pun hasilnya: exception terjadi atau tidak, ada `return` atau tidak. Tempat yang tepat untuk menutup resource atau mencetak penanda bahwa satu siklus usai.\n\nObjek exception yang tertangkap juga bisa dibaca: `catch (Exception ex)` menyimpannya di `ex`, lalu `ex.Message` memberi keterangan singkat dan `ex.StackTrace` jejak panggilan. Tangkap hanya exception yang bisa kamu tangani secara bermakna; bila tidak, biarkan naik ke pemanggil. Satu catatan untuk latihan di platform ini: kode dieksekusi lewat stdin dan stdout, jadi risiko yang dilatih berasal dari penguraian input dan pembagian, bukan dari file nyata.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    public static void Main()
    {
        try
        {
            int angka = int.Parse(Console.ReadLine());
            Console.WriteLine("Kuadrat: {0}", angka * angka);
            Console.WriteLine("Baris ini dilewati bila parse gagal");
        }
        catch (FormatException)
        {
            Console.WriteLine("Input bukan bilangan bulat yang sah");
        }
        finally
        {
            Console.WriteLine("Siklus selesai");
        }
    }
}`,
            caption: "Parse gagal: sisa blok try dilewati, catch jalan, finally tetap jalan.",
          },
        },
        {
          kind: "quiz",
          question: "Bila exception terjadi di tengah blok try, apa yang terjadi pada pernyataan berikutnya di dalam blok try yang sama?",
          options: [
            "Tetap dijalankan sebelum masuk ke blok catch",
            "Dilewati, eksekusi langsung lompat ke blok catch yang cocok",
            "Dijalankan setelah blok catch selesai",
            "Program langsung berhenti tanpa pesan apa pun",
          ],
          answer: 1,
          explanation:
            "Exception menghentikan eksekusi sekuensial: sisa blok try dilewati dan runtime mencari blok catch dengan tipe yang cocok. finally tetap dijalankan setelahnya.",
        },
        {
          kind: "quiz",
          question: "Blok mana yang dijamin dijalankan baik exception terjadi maupun tidak?",
          options: ["try", "catch", "finally", "Main"],
          answer: 2,
          explanation:
            "finally selalu dijalankan: bila exception tertangkap, ia jalan setelah catch; bila tidak tertangkap atau tidak ada exception sama sekali, ia tetap jalan sebelum kontrol lanjut.",
        },
        {
          kind: "code",
          title: "Bagi angka dengan pagar try/catch/finally",
          prompt:
            "Program membaca dua bilangan dan mencetak hasil bagi `a / b`. Lengkapi dua kata kunci yang hilang: satu untuk blok penangkap `DivideByZeroException`, satu untuk blok yang mencetak `Selesai` apa pun yang terjadi.",
          mode: "fill",
          template: `using System;

public class Program
{
    public static void Main()
    {
        int a = Convert.ToInt32(Console.ReadLine());
        int b = Convert.ToInt32(Console.ReadLine());

        try
        {
            Console.WriteLine(a / b);
        }
        ___ (DivideByZeroException)
        {
            Console.WriteLine("Tidak bisa membagi dengan nol");
        }
        ___
        {
            Console.WriteLine("Selesai");
        }
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        int a = Convert.ToInt32(Console.ReadLine());
        int b = Convert.ToInt32(Console.ReadLine());

        try
        {
            Console.WriteLine(a / b);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Tidak bisa membagi dengan nol");
        }
        finally
        {
            Console.WriteLine("Selesai");
        }
    }
}`,
          tests: [
            { stdin: "10\n2", expectedOutput: "5\nSelesai" },
            { stdin: "10\n0", expectedOutput: "Tidak bisa membagi dengan nol\nSelesai" },
            { stdin: "7\n-7", expectedOutput: "-1\nSelesai", hidden: true },
          ],
          hints: [
            "Dua kata kunci yang hilang fungsinya berbeda: satu menyatakan penangkap exception, satu menjamin blok terakhir jalan apa pun hasilnya.",
            "Blok penangkap ditulis dengan tipe di dalam kurung; blok penutup ditulis tanpa tipe dan tanpa kurung.",
            "Jawabannya: catch dan finally.",
          ],
        },
      ],
    },
    {
      slug: "exc-tipe-exception-umum",
      title: "Tipe Exception yang Sering Dijumpai",
      summary: "FormatException, OverflowException, dan saudara-saudaranya: kenali tipe yang tepat untuk ditangkap.",
      steps: [
        {
          kind: "theory",
          title: "Setiap kegagalan punya nama",
          body: "Semua exception mewarisi `System.Exception`, tetapi tipe turunannya yang membawa makna. `FormatException` berarti teks tidak berbentuk yang diharapkan saat penguraian. `OverflowException` berarti nilainya di luar jangkauan tipe tujuan. `DivideByZeroException` muncul pada pembagian bilangan bulat atau decimal dengan nol. Yang lain juga sering dijumpai: `IndexOutOfRangeException` untuk indeks array di luar batas, `ArgumentOutOfRangeException` untuk indeks `List<T>` yang tidak sah, `NullReferenceException` untuk anggota yang diakses lewat referensi null, `KeyNotFoundException` untuk kunci dictionary yang tidak ada, dan `InvalidOperationException` untuk keadaan objek yang tidak memungkinkan operasinya jalan.\n\nPerbedaan detailnya menentukan tipe yang kamu tangkap. `int.Parse(\"abc\")` melempar `FormatException` karena bentuknya salah, dan `int.Parse(\"3.5\")` pun begitu: titik desimal bukan bentuk bilangan bulat. `int.Parse(\"99999999999999\")` bentuknya sah tetapi nilainya terlalu besar untuk int 32 bit, jadi yang dilempar `OverflowException`. Pembagian `double` dengan nol justru tidak melempar apa pun dan menghasilkan `Infinity`, sementara `decimal` dibagi nol melempar `DivideByZeroException`.\n\nKarena itu tangkap tipe yang spesifik, bukan `catch (Exception)` untuk semua hal. Keputusan penanganan didasarkan pada tipe, bukan pada isi teks `ex.Message`; teks pesan bisa berubah antar versi .NET, sedangkan tipe adalah kontrak yang stabil.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    public static void Main()
    {
        CobaParse("12a");                 // FormatException
        CobaParse("99999999999999999999"); // OverflowException
    }

    static void CobaParse(string teks)
    {
        try
        {
            Console.WriteLine(int.Parse(teks));
        }
        catch (FormatException)
        {
            Console.WriteLine("Bentuknya bukan bilangan bulat");
        }
        catch (OverflowException)
        {
            Console.WriteLine("Terlalu besar untuk int");
        }
    }
}`,
            caption: "Dua catch terpisah untuk dua kegagalan yang berbeda maknanya.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `int.Parse("3.14")`?',
          options: [
            "3, dibulatkan ke bawah",
            "3.14 dibulatkan menjadi 3",
            "Melempar FormatException",
            "Melempar OverflowException",
          ],
          answer: 2,
          explanation:
            "int hanya menerima bentuk bilangan bulat; ada titik desimal berarti bentuknya tidak sah untuk int.Parse, jadi yang dilempar FormatException. Untuk desimal, pakai double.Parse atau decimal.Parse.",
        },
        {
          kind: "quiz",
          question: 'Exception apa yang dilempar `int.Parse("99999999999999999999")`?',
          options: ["FormatException", "OverflowException", "DivideByZeroException", "NullReferenceException"],
          answer: 1,
          explanation:
            "Bentuknya sah sebagai bilangan bulat, tetapi nilainya jauh di luar jangkauan int 32 bit. Kegagalan jangkauan seperti ini adalah ranah OverflowException.",
        },
        {
          kind: "code",
          title: "Perbaiki tipe exception yang keliru",
          prompt:
            "Program ini seharusnya menampilkan pesan ramah saat input bukan bilangan bulat, tetapi ada satu kesalahan yang membuatnya tetap crash untuk input `abc`. Jalankan dulu untuk melihat tipe exceptionnya, lalu perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `using System;

public class Program
{
    public static void Main()
    {
        try
        {
            int n = int.Parse(Console.ReadLine());
            Console.WriteLine("OK: {0}", n);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Input bukan bilangan bulat");
        }
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        try
        {
            int n = int.Parse(Console.ReadLine());
            Console.WriteLine("OK: {0}", n);
        }
        catch (FormatException)
        {
            Console.WriteLine("Input bukan bilangan bulat");
        }
    }
}`,
          tests: [
            { stdin: "42", expectedOutput: "OK: 42" },
            { stdin: "abc", expectedOutput: "Input bukan bilangan bulat" },
            { stdin: "12a", expectedOutput: "Input bukan bilangan bulat", hidden: true },
          ],
          hints: [
            "Jalankan dengan input abc: pesan crash menyebut nama tipe exception yang sebenarnya dilempar.",
            "Tipe di dalam catch harus cocok dengan tipe yang dilempar; saat ini keduanya tidak bertemu.",
            "Jawabannya: ganti DivideByZeroException menjadi FormatException.",
          ],
        },
      ],
    },
    {
      slug: "exc-throw-dan-custom",
      title: "throw dan Exception Buatan Sendiri",
      summary: "Melempar exception secara sadar dengan throw, lalu membuat class exception khusus domainmu.",
      steps: [
        {
          kind: "theory",
          title: "Melempar secara sadar",
          body: "Kata kunci `throw` melempar exception secara sadar: `throw new ArgumentException(\"nilai tidak sah\");`. Ini cara kode menyatakan bahwa kontraknya dilanggar dan tidak bisa melanjutkan pekerjaan dengan aman. Melempar lebih awal, sering disebut fail fast, hampir selalu lebih baik daripada melanjutkan proses dengan data yang sudah jelas salah; kesalahan yang dibiarkan justru menyebar ke tempat yang lebih sulit dilacak.\n\nUntuk kondisi khas domainmu, buat class exception sendiri: turunkan `Exception`, beri nama berakhiran `Exception`, dan buat constructor yang meneruskan pesan ke `base`. Contohnya `SaldoKurangException` atau `UmurTidakSahException`. Manfaatnya konkret: pemanggil bisa menulis `catch (SaldoKurangException)` dan memperlakukannya berbeda dari kesalahan teknis lain, tanpa menebak makna dari isi teks pesan.\n\nPilih exception bawaan lebih dulu untuk kesalahan penggunaan API: `ArgumentException` untuk argumen tidak sah, `ArgumentNullException` untuk null yang dilarang. Exception buatan sendiri layak ketika pemanggil perlu membedakan kondisi domain itu lewat tipe; bila perlu, classmu boleh menambah property, misalnya jumlah kekurangan saldo.",
          code: {
            language: "csharp",
            content: `using System;

public class SaldoKurangException : Exception
{
    public SaldoKurangException(string pesan) : base(pesan)
    {
    }
}

public class Program
{
    static void Tarik(double saldo, double jumlah)
    {
        if (jumlah > saldo)
        {
            throw new SaldoKurangException("Saldo tidak cukup untuk menarik " + jumlah);
        }
    }

    public static void Main()
    {
        try
        {
            Tarik(50000, 75000);
        }
        catch (SaldoKurangException ex)
        {
            Console.WriteLine(ex.Message); // Saldo tidak cukup untuk menarik 75000
        }
    }
}`,
            caption: "Constructor meneruskan pesan ke base agar ex.Message terisi.",
          },
        },
        {
          kind: "quiz",
          question: "Class exception buatan sendiri harus mewarisi class apa?",
          options: ["object saja, bebas", "Exception", "IDisposable", "String"],
          answer: 1,
          explanation:
            "Setiap exception, termasuk buatan sendiri, harus turunan System.Exception. Tanpa itu, throw dan catch tidak akan memperlakukannya sebagai exception.",
        },
        {
          kind: "quiz",
          question: 'Cara yang benar melempar SaldoKurangException dengan pesan "Saldo kurang" adalah?',
          options: [
            'throw SaldoKurangException("Saldo kurang");',
            'throw new SaldoKurangException("Saldo kurang");',
            'raise SaldoKurangException("Saldo kurang");',
            'new SaldoKurangException("Saldo kurang");',
          ],
          answer: 1,
          explanation:
            "Exception adalah objek, jadi butuh new untuk membuatnya, dan kata kunci throw yang melemparnya. raise adalah milik Python, dan hanya new tanpa throw tidak melempar apa pun.",
        },
        {
          kind: "code",
          title: "Lempar exception domainmu sendiri",
          prompt:
            "Lengkapi dua bagian: constructor `UmurTidakSahException` yang meneruskan pesan ke class induknya, dan pernyataan yang melempar exception baru saat umur negatif.",
          mode: "fill",
          template: `using System;

public class UmurTidakSahException : Exception
{
    public UmurTidakSahException(string pesan) : ___(pesan)
    {
    }
}

public class Program
{
    static void CekUmur(int umur)
    {
        if (umur < 0)
        {
            ___ new UmurTidakSahException("Umur tidak boleh negatif");
        }
    }

    public static void Main()
    {
        int umur = Convert.ToInt32(Console.ReadLine());
        try
        {
            CekUmur(umur);
            Console.WriteLine("Umur sah");
        }
        catch (UmurTidakSahException ex)
        {
            Console.WriteLine("Ditolak: {0}", ex.Message);
        }
    }
}`,
          solution: `using System;

public class UmurTidakSahException : Exception
{
    public UmurTidakSahException(string pesan) : base(pesan)
    {
    }
}

public class Program
{
    static void CekUmur(int umur)
    {
        if (umur < 0)
        {
            throw new UmurTidakSahException("Umur tidak boleh negatif");
        }
    }

    public static void Main()
    {
        int umur = Convert.ToInt32(Console.ReadLine());
        try
        {
            CekUmur(umur);
            Console.WriteLine("Umur sah");
        }
        catch (UmurTidakSahException ex)
        {
            Console.WriteLine("Ditolak: {0}", ex.Message);
        }
    }
}`,
          tests: [
            { stdin: "17", expectedOutput: "Umur sah" },
            { stdin: "-3", expectedOutput: "Ditolak: Umur tidak boleh negatif" },
            { stdin: "0", expectedOutput: "Umur sah", hidden: true },
          ],
          hints: [
            "Bagian pertama memanggil constructor class induk dari daftar inisialisasi constructor.",
            "Bagian kedua adalah kata kunci yang melempar objek exception; objeknya dibuat dengan new di depannya.",
            "Jawabannya: base dan throw.",
          ],
        },
      ],
    },
    {
      slug: "exc-multi-catch-urutan",
      title: "Beberapa catch dan Urutannya",
      summary: "Satu try dengan banyak catch: hanya satu yang jalan, urutan spesifik dulu, dan C# 5 tanpa multi-tipe.",
      steps: [
        {
          kind: "theory",
          title: "Satu try, banyak catch",
          body: "Satu blok `try` boleh diikuti beberapa blok `catch`, masing-masing untuk satu tipe. Saat exception terjadi, blok-blok diperiksa dari atas ke bawah dan hanya yang pertama cocok yang dijalankan; sisanya dilewati. Karena itu susun urutannya dari yang paling spesifik ke yang paling umum: `FormatException` lebih dulu, `Exception` paling akhir sebagai penampung sisanya.\n\nCompiler menjaga urutan itu. `catch (Exception)` yang ditulis sebelum `catch (FormatException)` pada try yang sama ditolak saat kompilasi karena catch yang lebih umum sudah menangkap semua tipe itu; blok kedua tidak akan pernah terjangkau. `catch` tanpa tipe sama saja dengan `catch (Exception)`, jadi pakai hanya di posisi terakhir bila memang perlu.\n\nSatu batasan C# 5 yang perlu kamu tahu: tidak ada satu catch dengan dua tipe sekaligus seperti `catch (A | B)` di beberapa bahasa lain. Dua perlakuan berbeda berarti dua blok terpisah. C# 6 kemudian menambahkan filter `catch ... when` dan C# 7 memperluasnya dengan pattern matching; keduanya di luar compiler yang dipakai judge ini, jadi bentuk klasik inilah yang dilatih.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    public static void Main()
    {
        try
        {
            int n = int.Parse(Console.ReadLine());
            Console.WriteLine(100 / n);
        }
        catch (FormatException)
        {
            Console.WriteLine("Bukan bilangan bulat");
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Pembagi nol");
        }
        catch (Exception)
        {
            Console.WriteLine("Kesalahan lain");
        }
    }
}`,
            caption: "Spesifik di atas, umum di bawah; hanya satu blok yang dijalankan.",
          },
        },
        {
          kind: "quiz",
          question: "Pada satu try dengan dua blok catch, berapa blok yang dijalankan saat exception terjadi?",
          options: [
            "Keduanya berurutan",
            "Hanya yang paling atas",
            "Hanya satu, yaitu blok pertama yang tipenya cocok",
            "Tidak ada yang dijalankan",
          ],
          answer: 2,
          explanation:
            "Blok catch diperiksa dari atas ke bawah dan pencarian berhenti di kecocokan pertama. Bila tidak ada yang cocok, exception naik ke pemanggil.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila `catch (Exception)` ditulis sebelum `catch (FormatException)` dalam try yang sama?",
          options: [
            "FormatException tidak pernah tertangkap, tanpa peringatan apa pun",
            "Tidak lolos kompilasi karena catch yang umum sudah menangkap semua tipe itu",
            "Kedua catch dijalankan berurutan",
            "Compiler menukar urutannya secara otomatis",
          ],
          answer: 1,
          explanation:
            "Compiler menolaknya sebagai error: blok Exception menangkap semuanya sehingga FormatException tak akan pernah terjangkau. Urutan harus spesifik dulu.",
        },
        {
          kind: "code",
          title: "Dua risiko, dua catch",
          prompt:
            "Program mencetak `100 / n` dari input. Ada dua kegagalan yang mungkin: teks bukan bilangan bulat, dan pembagi nol. Lengkapi kedua tipe exception pada blok catch sesuai pesannya.",
          mode: "fill",
          template: `using System;

public class Program
{
    public static void Main()
    {
        string teks = Console.ReadLine();
        try
        {
            int n = int.Parse(teks);
            Console.WriteLine(100 / n);
        }
        catch (___)
        {
            Console.WriteLine("Input bukan bilangan bulat");
        }
        catch (___)
        {
            Console.WriteLine("Tidak boleh dibagi nol");
        }
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        string teks = Console.ReadLine();
        try
        {
            int n = int.Parse(teks);
            Console.WriteLine(100 / n);
        }
        catch (FormatException)
        {
            Console.WriteLine("Input bukan bilangan bulat");
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Tidak boleh dibagi nol");
        }
    }
}`,
          tests: [
            { stdin: "25", expectedOutput: "4" },
            { stdin: "abc", expectedOutput: "Input bukan bilangan bulat" },
            { stdin: "0", expectedOutput: "Tidak boleh dibagi nol", hidden: true },
          ],
          hints: [
            "Coba jalankan dengan input abc dan perhatikan nama tipe exception di pesan crash-nya.",
            "Catch pertama menangani bentuk teks yang salah, catch kedua menangani pembagian dengan nol.",
            "Jawabannya: FormatException dan DivideByZeroException.",
          ],
        },
      ],
    },
    {
      slug: "exc-using-idisposable",
      title: "using Statement dan IDisposable",
      summary: "Resource yang wajib ditutup, kontrak IDisposable, dan using sebagai penjaga otomatisnya.",
      steps: [
        {
          kind: "theory",
          title: "Tutup sendiri, atau suruh using",
          body: "Banyak resource di .NET sesungguhnya milik sistem operasi: handle file, koneksi jaringan, stream. Garbage collector membersihkan memori managed, tetapi tidak menjanjikan kapan resource itu ditutup, dan membiarkannya terbuka tanpa batas waktu adalah kebocoran. Kontraknya sederhana: class yang memegang resource mengimplementasikan `IDisposable` dengan satu method `Dispose()` yang wajib dipanggil saat selesai.\n\nMemanggil `Dispose()` manual itu rapuh: satu exception di tengah jalan dan panggilannya terlewat. `using` statement menyelesaikannya lewat compiler: `using (StreamReader pembaca = File.OpenText(jalur)) { ... }` dikompilasi menjadi try/finally yang memanggil `Dispose()` di akhir blok, apa pun yang terjadi di dalamnya. Variabelnya hanya hidup di dalam blok, dan dua resource bisa ditumpuk dengan dua using berurutan tanpa kurung kurawal tambahan.\n\nSejak C# 8 ada bentuk using declaration tanpa tanda kurung yang menutup resource di akhir scope. Compiler judge ini adalah C# 5, jadi tulislah bentuk klasik dengan tanda kurung. Kebiasaannya bagus untuk dipupuk sekarang: setiap kali membuat stream, reader, atau writer, kemas dengan `using`.",
          code: {
            language: "csharp",
            content: `using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        using (StreamReader pembaca = File.OpenText("data.txt"))
        {
            string baris = pembaca.ReadLine();
            Console.WriteLine(baris);
        } // Dispose() dipanggil di sini, bahkan bila exception terjadi di atas

        // dua resource sekaligus:
        // using (StreamReader a = File.OpenText("a.txt"))
        // using (StreamReader b = File.OpenText("b.txt"))
        // {
        //     Console.WriteLine(a.ReadLine() + b.ReadLine());
        // }
    }
}`,
            caption: "Blok using berakhir, Dispose() dijamin terpanggil.",
          },
        },
        {
          kind: "quiz",
          question: "Method apa yang otomatis dipanggil di akhir blok using?",
          options: ["Close()", "Flush()", "Dispose()", "Finalize()"],
          answer: 2,
          explanation:
            "using menjamin Dispose() terpanggil di akhir blok, bahkan saat exception. Close() sering menjadi isi dari Dispose pada class stream, tetapi kontrak using adalah Dispose.",
        },
        {
          kind: "quiz",
          question: "Interface apa yang harus dipenuhi sebuah class agar bisa dipakai dalam using statement?",
          options: ["IEnumerable", "IDisposable", "IComparable", "ICloneable"],
          answer: 1,
          explanation:
            "using hanya menerima tipe yang mengimplementasikan IDisposable. Tanpa method Dispose(), compiler menolaknya.",
        },
      ],
    },
    {
      slug: "exc-file-directory",
      title: "File dan Directory API",
      summary: "Class statis File dan Directory untuk membaca, menulis, dan memeriksa, dengan pemeriksaan dulu sebelum membaca.",
      steps: [
        {
          kind: "theory",
          title: "Operasi file dalam satu panggilan",
          body: "Class `File` dan `Directory` di namespace `System.IO` adalah pintu utama I/O file gaya statis: tidak perlu membuat objek, cukup panggil methodnya. `File.ReadAllText(jalur)` mengembalikan seluruh isi sebagai satu string, `File.ReadAllLines(jalur)` sebagai array baris, `File.WriteAllText(jalur, isi)` menulis sekaligus menimpa, `File.AppendAllText` menambah di ujung. Pemeriksaan lewat `File.Exists`, penyalinan `File.Copy`, penghapusan `File.Delete`. Di sisi folder: `Directory.Exists`, `Directory.CreateDirectory`, `Directory.GetFiles`, dan `Directory.GetDirectories`.\n\nSemua method baca itu tegas: `File.ReadAllText` pada file yang tidak ada melempar `FileNotFoundException`, dan jalur yang salah bentuk melempar `ArgumentException`. Karena itu periksa dulu dengan `File.Exists` atau kemas panggilannya dengan try/catch `IOException`. Ingat juga `File.WriteAllText` menimpa tanpa bertanya; data lama langsung hilang. Penyusunan jalur serahkan ke `Path.Combine` supaya pemisah foldernya benar di sistem operasi mana pun.\n\nUntuk file besar, `File.ReadLines` mengalirkan baris demi baris saat ditelusuri, berbeda dari `ReadAllLines` yang menampung semuanya di memori lebih dulu. Satu catatan untuk konteks platform ini: judge mengeksekusi kode lewat stdin dan stdout tanpa akses file, jadi lesson ini berhenti di konsep dan kuis; latihan kodenya kembali ke penguraian input yang aman.",
          code: {
            language: "csharp",
            content: `using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        string jalur = "catatan.txt";

        if (File.Exists(jalur))
        {
            Console.WriteLine(File.ReadAllText(jalur));
        }
        else
        {
            File.WriteAllText(jalur, "halo");
        }

        Directory.CreateDirectory("backup");
        foreach (string file in Directory.GetFiles("."))
        {
            Console.WriteLine(file);
        }
    }
}`,
            caption: "Periksa Exists sebelum membaca; Path.Combine untuk menyusun jalur.",
          },
        },
        {
          kind: "quiz",
          question: "Method class File yang mengembalikan seluruh isi file sebagai satu string adalah?",
          options: ["File.Read(jalur)", "File.ReadAllText(jalur)", "File.ReadAllBytes(jalur)", "File.Open(jalur)"],
          answer: 1,
          explanation:
            "ReadAllText mengembalikan seluruh isi sebagai string. ReadAllBytes mengembalikan byte[], dan Open hanya membuka Stream yang harus dibaca dan ditutup sendiri.",
        },
        {
          kind: "quiz",
          question: 'Apa hasil `File.Exists("data.txt")` bila file itu tidak ada?',
          options: [
            "Melempar FileNotFoundException",
            "Mengembalikan false tanpa exception",
            "Mengembalikan null",
            "Membuat file kosong lalu mengembalikan true",
          ],
          answer: 1,
          explanation:
            "Exists dirancang untuk bertanya tanpa melempar: file tidak ada dijawab false. Exception baru muncul bila kamu memaksakan membaca file yang memang tidak ada.",
        },
      ],
    },
    {
      slug: "exc-system-text-json",
      title: "JSON dengan System.Text.Json",
      summary: "JsonSerializer.Serialize dan Deserialize<T>, syarat class target, dan error yang mungkin muncul.",
      steps: [
        {
          kind: "theory",
          title: "Objek bertukar tempat dengan teks",
          body: "JSON adalah format pertukaran data yang paling umum antar sistem, dan `System.Text.Json` adalah library bawaan .NET untuk itu: masuk sebagai bagian .NET Core 3.0 dan tersedia untuk .NET Framework lewat paket NuGet, sebagai alternatif dari `Newtonsoft.Json` yang lebih tua. Dua method intinya: `JsonSerializer.Serialize(objek)` mengubah objek menjadi teks JSON, dan `JsonSerializer.Deserialize<T>(teks)` menguraikan teks menjadi objek bertipe T.\n\nPenguraian butuh class target dengan property publik: nama property menjadi kunci JSON dan tipe nilainya harus cocok. Teks yang tidak sah dilempar sebagai `JsonException`, begitu juga bila bentuk JSON tidak cocok dengan T. Kesalahan yang sering dijumpai pemula: class tanpa property publik sehingga hasilnya objek kosong, atau berharap `Deserialize` memeriksa semuanya padahal kunci yang tidak ada di JSON dibiarkan berisi nilai bawaan.\n\nRacikan paling umum di program kecil adalah berpasangan dengan File API: `File.WriteAllText(jalur, JsonSerializer.Serialize(data))` untuk menyimpan, dan `JsonSerializer.Deserialize<List<Produk>>(File.ReadAllText(jalur))` untuk memuat, dengan try/catch `IOException` dan `JsonException` mengelilinginya. Class kecil pembawa data seperti `Produk` ini mirip pola yang sudah kamu kenal di modul OOP lanjutan.",
          code: {
            language: "csharp",
            content: `using System.Collections.Generic;
using System.Text.Json;

public class Produk
{
    public string Nama { get; set; }
    public int Harga { get; set; }
}

public class Program
{
    public static void Main()
    {
        Produk p = new Produk();
        p.Nama = "Buku";
        p.Harga = 45000;

        string json = JsonSerializer.Serialize(p);
        // {"Nama":"Buku","Harga":45000}

        Produk hasil = JsonSerializer.Deserialize<Produk>(json);
        // hasil.Nama == "Buku", hasil.Harga == 45000

        List<Produk> daftar = JsonSerializer.Deserialize<List<Produk>>("[{\"Nama\":\"Tas\",\"Harga\":120000}]");
    }
}`,
            caption: "Serialize mengubah objek menjadi teks, Deserialize<T> mengembalikannya.",
          },
        },
        {
          kind: "quiz",
          question: "Method mana yang mengubah objek C# menjadi teks JSON?",
          options: [
            "JsonSerializer.Parse(objek)",
            "JsonSerializer.Serialize(objek)",
            "JsonSerializer.Read(objek)",
            "Convert.ToJson(objek)",
          ],
          answer: 1,
          explanation:
            "Serialize mengubah objek menjadi teks JSON; arah sebaliknya adalah Deserialize<T>. Parse dan Convert.ToJson bukan anggota System.Text.Json.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila `JsonSerializer.Deserialize<Produk>(teks)` menerima teks yang bukan JSON sah?",
          options: [
            "Mengembalikan null",
            "Mengembalikan objek Produk kosong",
            "Melempar JsonException",
            "Tidak lolos kompilasi",
          ],
          answer: 2,
          explanation:
            "Teks yang tidak dapat diuraikan melempar JsonException. Deserialize tidak mengembalikan null, jadi bila teksnya datang dari luar, kemas dengan try/catch.",
        },
      ],
    },
    {
      slug: "exc-validasi-input",
      title: "Validasi Input yang Tidak Pernah Crash",
      summary: "TryParse, keluar lebih awal, dan pesan yang menjelaskan: program yang tetap jalan di input apa pun.",
      steps: [
        {
          kind: "theory",
          title: "Input dari luar selalu dicurigai",
          body: "Aturan pertama: input dari luar program tidak bisa dipercaya. Pengguna salah ketik, file berisi data rusak, koneksi terpotong di tengah. Karena itu periksa dulu sebelum memakai: `int.TryParse(teks, out nilai)` menjawab bool tanpa pernah melempar exception, dan saat gagal mengisi `nilai` dengan 0. Tambahkan pesan yang menjelaskan harapanmu, bukan sekadar kata tidak sah; contoh format yang benar sangat membantu pengguna.\n\nPola yang nyaman dibaca adalah keluar lebih awal: bila penguraian gagal, cetak pesan lalu `return`, sehingga cabang utama program berjalan lurus tanpa if yang bersarang dalam-dalam. Untuk daftar input, jangan berhenti di tengah karena satu baris rusak: loop dengan `TryParse`, hitung yang tidak sah, proses yang sah, lalu laporkan keduanya di akhir.\n\n`try/catch` bukan pengganti validasi. Menangkap `FormatException` dari `int.Parse` untuk input yang sebenarnya bisa dicek lebih dulu itu boros dan menyembunyikan alurnya; exception memang untuk keadaan luar biasa. Bedakan dua lapis: validasi untuk kegagalan yang diharapkan, exception untuk yang tidak terduga.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    public static void Main()
    {
        string teks = Console.ReadLine();
        int angka;
        if (!int.TryParse(teks, out angka))
        {
            Console.WriteLine("Isi angka bulat yang sah, contoh: 42");
            return;
        }

        Console.WriteLine("Kuadrat: {0}", angka * angka);
    }
}`,
            caption: "Gagal dikonfirmasi lebih dulu, cabang utama berjalan lurus.",
          },
        },
        {
          kind: "quiz",
          question: "Input dari pengguna bisa berisi teks apa saja. Cara paling tepat menguraikannya menjadi int tanpa risiko crash?",
          options: [
            "int.Parse(input) di dalam try/catch (FormatException)",
            "int.TryParse(input, out nilai)",
            "Convert.ToInt32(input)",
            "Cast (int)input",
          ],
          answer: 1,
          explanation:
            "TryParse memang dirancang untuk input yang tidak bisa dipercaya: tidak pernah melempar dan menjawab sah atau tidak lewat nilai balik. Parse dalam try/catch juga bisa jalan, tetapi lebih panjang dan menyalahgunakan exception untuk kondisi biasa.",
        },
        {
          kind: "code",
          title: "Hitung total dengan baris tak sah",
          prompt:
            "Program membaca `n` lalu `n` baris. Baris yang berisi bilangan bulat sah masuk ke total; yang tidak sah dihitung terpisah. Lengkapi dua bagian penguraian yang aman.",
          mode: "fill",
          template: `using System;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        int total = 0;
        int tidakSah = 0;

        for (int i = 0; i < n; i++)
        {
            string teks = Console.ReadLine();
            int nilai;
            if (int.___(teks, ___ nilai))
            {
                total += nilai;
            }
            else
            {
                tidakSah++;
            }
        }

        Console.WriteLine("Total: {0}", total);
        Console.WriteLine("Tidak sah: {0}", tidakSah);
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        int total = 0;
        int tidakSah = 0;

        for (int i = 0; i < n; i++)
        {
            string teks = Console.ReadLine();
            int nilai;
            if (int.TryParse(teks, out nilai))
            {
                total += nilai;
            }
            else
            {
                tidakSah++;
            }
        }

        Console.WriteLine("Total: {0}", total);
        Console.WriteLine("Tidak sah: {0}", tidakSah);
    }
}`,
          tests: [
            { stdin: "3\n10\nabc\n5", expectedOutput: "Total: 15\nTidak sah: 1" },
            { stdin: "2\n-4\n7", expectedOutput: "Total: 3\nTidak sah: 0" },
            { stdin: "4\n1\nx\n2\ny", expectedOutput: "Total: 3\nTidak sah: 2", hidden: true },
          ],
          hints: [
            "Method yang dicari tidak pernah melempar exception dan jawabannya berupa bool.",
            "Kata kunci kedua menandai parameter keluaran pada saat pemanggilan.",
            "Jawabannya: TryParse dan out.",
          ],
        },
      ],
    },
    {
      slug: "exc-exception-vs-return",
      title: "Exception versus Kode Kembalian",
      summary: "Dua kontrak pelaporan kegagalan, biayanya, dan bahaya nilai sentinel yang mengelabui.",
      steps: [
        {
          kind: "theory",
          title: "Dua cara mengatakan gagal",
          body: "Kegagalan bisa dilaporkan lewat nilai balik atau lewat exception, dan memilih yang tepat adalah keputusan desain. Nilai balik cocok untuk kegagalan yang diharapkan dan sering: penguraian input, pencarian yang boleh tidak ketemu. `int.TryParse` adalah contoh rapinya: nilai balik bool adalah jawabannya, dan hasilnya datang lewat parameter `out`. Exception cocok untuk keadaan luar biasa yang membuat method tidak bisa menepati kontraknya sama sekali.\n\nKebalikan dari nilai balik yang eksplisit adalah nilai sentinel: `-1` untuk gagal, `null` untuk kosong. Bahayanya, `-1` bisa jadi nilai sah yang tak disengaja, dan pemanggil yang lupa memeriksa membawa bug jauh dari sumbernya. `TryParse` mengurangi jebakan itu karena keberhasilan dan hasilnya datang berpasangan dan tidak bisa dipisah.\n\nBiayanya juga berbeda: melempar exception jauh lebih mahal daripada membaca nilai balik, karena runtime harus menggulung stack dan mengisi jejak panggilan. Jangan pakai exception sebagai alur kontrol biasa di dalam loop. Dan sekali lagi soal `catch (Exception)` yang kosong: ia menyembunyikan bug paling jahat, yaitu program yang terus berjalan dalam keadaan tidak sah. Tangkap yang spesifik, tangani dengan jelas, biarkan sisanya naik.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    static int BagiAtauMinusSatu(int a, int b)
    {
        if (b == 0)
        {
            return -1; // sentinel: bisa tertukar dengan hasil sah
        }
        return a / b;
    }

    public static void Main()
    {
        Console.WriteLine(BagiAtauMinusSatu(10, 2)); // 5
        Console.WriteLine(BagiAtauMinusSatu(10, 0)); // -1: gagal, atau memang hasilnya -1?
    }
}`,
            caption: "Sentinel memaksa pemanggil menebak; TryParse dan exception tidak membiarkan ragu.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan exception lebih tepat daripada kode kembalian?",
          options: [
            "Untuk kegagalan yang diharapkan dan sering terjadi",
            "Untuk keadaan luar biasa yang membuat method tidak bisa menepati kontraknya",
            "Untuk semua kegagalan tanpa kecuali",
            "Untuk menggantikan if di dalam loop",
          ],
          answer: 1,
          explanation:
            "Exception melaporkan keadaan yang luar biasa. Kegagalan yang wajar dan sering lebih cocok lewat nilai balik, seperti pasangan bool dan out pada TryParse.",
        },
        {
          kind: "quiz",
          question: "Apa bahaya utama `catch (Exception) { }` yang kosong membungkus seluruh program?",
          options: [
            "Program menjadi lambat",
            "Bug tersembunyi: kegagalan apa pun ditelan dan program lanjut dalam keadaan tidak sah",
            "Program tidak bisa dikompilasi",
            "Memori langsung habis",
          ],
          answer: 1,
          explanation:
            "Catch umum yang diam menyembunyikan penyebabnya, termasuk bug pemrograman seharusnya. Tangkap tipe yang spesifik dan tangani dengan jelas.",
        },
      ],
    },
    {
      slug: "exc-parser-aman",
      title: "Latihan Gabungan: Parser Data Aman",
      summary: "Split, TryParse, dan penghitungan baris yang dilewati menyatu di satu parser data penjualan.",
      steps: [
        {
          kind: "theory",
          title: "Semua lapis menyatu",
          body: "Penutup modul merangkai kebiasaan yang kamu bangun: baris data dipotong dengan `Split`, bentuknya diperiksa lewat panjang array, angkanya diuraikan dengan `TryParse`, dan baris yang gugur tidak menghentikan program melainkan dihitung lalu dilaporkan. `continue` menjaga loop tetap mengalir saat satu baris rusak.\n\nKontrak programnya jujur dan sederhana: setiap baris data berbentuk `nama;harga;jumlah`. Baris yang bentuknya tidak cocok atau angkanya tidak sah dilewati dan dihitung sebagai dilewati; baris yang sah menyumbang `harga * jumlah` ke total. Di akhir, program melaporkan total dan berapa baris yang dilewati, jadi tidak ada data yang hilang secara diam-diam.",
          code: {
            language: "csharp",
            content: "// baris data: nama;harga;jumlah\n// bentuk salah  -> dilewati, dilewati++\n// angka tak sah -> dilewati, dilewati++\n// sah           -> total += harga * jumlah\n// keluaran      -> \"Total: <total>\" lalu \"Dilewati: <dilewati>\"",
            caption: "Empat kontrak parser yang kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Parser data penjualan yang jujur",
          prompt:
            "Lengkapi tiga bagian yang hilang: perbandingan jumlah bagian baris, dan kata kunci yang sama pada dua pemanggilan penguraian angka. Baris rusak harus dilewati tanpa menghentikan loop.",
          mode: "fill",
          template: `using System;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        long total = 0;
        int dilewati = 0;

        for (int i = 0; i < n; i++)
        {
            string[] bagian = Console.ReadLine().Split(';');
            if (bagian.Length ___ 3)
            {
                dilewati++;
                continue;
            }

            int harga;
            int jumlah;
            bool okHarga = int.TryParse(bagian[1], ___ harga);
            bool okJumlah = int.TryParse(bagian[2], ___ jumlah);

            if (okHarga && okJumlah)
            {
                total += harga * jumlah;
            }
            else
            {
                dilewati++;
            }
        }

        Console.WriteLine("Total: {0}", total);
        Console.WriteLine("Dilewati: {0}", dilewati);
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        long total = 0;
        int dilewati = 0;

        for (int i = 0; i < n; i++)
        {
            string[] bagian = Console.ReadLine().Split(';');
            if (bagian.Length != 3)
            {
                dilewati++;
                continue;
            }

            int harga;
            int jumlah;
            bool okHarga = int.TryParse(bagian[1], out harga);
            bool okJumlah = int.TryParse(bagian[2], out jumlah);

            if (okHarga && okJumlah)
            {
                total += harga * jumlah;
            }
            else
            {
                dilewati++;
            }
        }

        Console.WriteLine("Total: {0}", total);
        Console.WriteLine("Dilewati: {0}", dilewati);
    }
}`,
          tests: [
            {
              stdin: "3\nbuku;5000;2\ntas;25000;1\npensil;2000;x",
              expectedOutput: "Total: 35000\nDilewati: 1",
            },
            { stdin: "2\nkopi;15000;2\nrusak", expectedOutput: "Total: 30000\nDilewati: 1" },
            { stdin: "4\na;1;1\nb;2;2\nsalah;saja\nc;3;3", expectedOutput: "Total: 14\nDilewati: 1", hidden: true },
          ],
          hints: [
            "Bagian pertama membandingkan panjang array dengan tiga; baris yang tidak tepat tiga bagian tidak sah.",
            "Dua bagian terakhir adalah kata kunci yang sama untuk parameter keluaran pada int.TryParse.",
            "Jawabannya: != lalu out dan out.",
          ],
        },
      ],
    },
    // ==================== MODUL 5: LINQ Inti ====================
    {
      slug: "linq-where-predicate",
      title: "LINQ Where: Menyaring Koleksi",
      summary: "Method syntax, lambda sebagai predicate, dan Where yang menghasilkan urutan baru tanpa menyentuh sumbernya.",
      steps: [
        {
          kind: "theory",
          title: "Saring dengan satu baris niat",
          body: "LINQ (Language Integrated Query) adalah kumpulan method query yang bekerja pada `IEnumerable<T>` apa pun: list, array, hasil iterator, semuanya. Semua methodnya hidup di `System.Linq`, jadi tambahkan `using System.Linq;` di baris atas file. Method yang paling sering dipakai pertama adalah `Where`: ia menerima satu predicate, yaitu `Func<T, bool>`, dan mengembalikan urutan berisi elemen yang lolos syarat.\n\nPredicate ditulis paling ringkas sebagai lambda: `n => n >= 70` dibaca untuk setiap n, jawab apakah n >= 70. Kode `nilai.Where(n => n >= 70)` menggantikan loop `foreach` dengan `if` di dalamnya, dan maksudnya terbaca sekali pandang: menyaring. Perhatikan juga `Where` tidak mengubah sumbernya; list aslinya tetap utuh, hasilnya urutan baru.\n\nMerantai method itu sah karena hasil `Where` juga `IEnumerable<T>`: `data.Where(a).Where(b)` berarti dua syarat berurutan, dan sering lebih terbaca daripada satu lambda berisi banyak `&&`. Satu kebiasaan yang dijaga: predicate sebaiknya murni, hanya menjawab ya atau tidak tanpa mengubah keadaan di dalamnya; alasannya menyusul di lesson deferred execution.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> nilai = new List<int> { 70, 45, 90, 60, 85 };

        IEnumerable<int> lulus = nilai.Where(n => n >= 70);

        Console.WriteLine(nilai.Count); // 5, sumber tak tersentuh
        foreach (int n in lulus)
        {
            Console.WriteLine(n); // 70, 90, 85
        }
    }
}`,
            caption: "Where menghasilkan urutan baru; list aslinya tetap lima elemen.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `List<int>`, tipe argumen yang diterima Where adalah?",
          options: ["Func<int, bool>", "Action<int>", "int", "string"],
          answer: 0,
          explanation:
            "Where menerima predicate Func<int,bool>: menerima satu int dan menjawab bool. Action<int> tidak mengembalikan nilai sehingga tak bisa jadi syarat penyaringan.",
        },
        {
          kind: "quiz",
          question: "Setelah `IEnumerable<int> hasil = data.Where(n => n > 10);`, bagaimana kondisi `data`?",
          options: [
            "Isinya menyusut menjadi yang lolos saja",
            "Tidak berubah, hasilnya adalah urutan baru",
            "Berubah menjadi array",
            "Error saat kompilasi",
          ],
          answer: 1,
          explanation:
            "Where tidak mengubah sumbernya. Ia mengembalikan urutan baru berisi elemen yang lolos; data asli tetap lengkap.",
        },
        {
          kind: "code",
          title: "Saring nilai yang lulus",
          prompt:
            "Program membaca `n` nilai lalu mencetak yang bernilai 70 ke atas, satu per baris. Lengkapi method LINQ yang menyaringnya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> nilai = new List<int>();
        for (int i = 0; i < n; i++)
        {
            nilai.Add(Convert.ToInt32(Console.ReadLine()));
        }

        IEnumerable<int> lulus = nilai.___(x => x >= 70);

        foreach (int x in lulus)
        {
            Console.WriteLine(x);
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> nilai = new List<int>();
        for (int i = 0; i < n; i++)
        {
            nilai.Add(Convert.ToInt32(Console.ReadLine()));
        }

        IEnumerable<int> lulus = nilai.Where(x => x >= 70);

        foreach (int x in lulus)
        {
            Console.WriteLine(x);
        }
    }
}`,
          tests: [
            { stdin: "4\n70\n50\n90\n69", expectedOutput: "70\n90" },
            { stdin: "3\n100\n80\n71", expectedOutput: "100\n80\n71" },
            { stdin: "5\n1\n2\n3\n70\n70", expectedOutput: "70\n70", hidden: true },
          ],
          hints: [
            "Method yang dicari anggota System.Linq dan tugasnya menyaring elemen.",
            "Lambdanya sudah benar; yang hilang nama methodnya.",
            "Jawabannya: Where.",
          ],
        },
      ],
    },
    {
      slug: "linq-select-proyeksi",
      title: "LINQ Select: Mengubah Bentuk Data",
      summary: "Proyeksi dengan Select: tiap elemen dipetakan menjadi bentuk lain, bahkan tipe yang berbeda.",
      steps: [
        {
          kind: "theory",
          title: "Proyeksi: dari satu bentuk ke bentuk lain",
          body: "Jika `Where` menyaring, `Select` mengubah: ia menerima `Func<T, TResult>` dan memetakan setiap elemen menjadi bentuk baru. `nama.Select(s => s.Length)` mengubah urutan string menjadi urutan int berisi panjangnya; `angka.Select(x => x * x)` menjadi urutan kuadrat. Tipe hasil mengikuti isi lambda, jadi proyeksi lintas tipe itu normal: `List<string>` bisa menghasilkan `IEnumerable<int>`.\n\nJumlah elemen tidak berubah pada Select; yang berubah bentuknya. Itu bedanya dengan Where yang bisa menyusut. Keduanya sering dirantai: `data.Where(syarat).Select(petakan)` menyaring dulu supaya pemetaan hanya dilakukan pada elemen yang lolos, urutan kerja yang biasanya lebih murah dan lebih jelas daripada memetakan semuanya lalu menyaring hasilnya.\n\nProyeksi menjadi class kecil berisi field hasil adalah pola harian: ambil yang penting saja dari data besar sebelum diurutkan atau dikelompokkan. Bekal class dan property dari modul OOP bertemu LINQ tepat di sini.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<string> nama = new List<string> { "ani", "budi", "citra" };

        IEnumerable<int> panjang = nama.Select(s => s.Length);
        IEnumerable<string> kapital = nama.Select(s => s.ToUpper());

        foreach (int p in panjang)
        {
            Console.Write("{0} ", p); // 3 4 5
        }
        Console.WriteLine();
        foreach (string s in kapital)
        {
            Console.Write("{0} ", s); // ANI BUDI CITRA
        }
    }
}`,
            caption: "Satu sumber, dua proyeksi: panjang bertipe int, kapital bertipe string.",
          },
        },
        {
          kind: "quiz",
          question: "Dengan `List<string> nama`, tipe hasil `nama.Select(s => s.Length)` adalah?",
          options: ["IEnumerable<string>", "IEnumerable<int>", "List<int>", "int"],
          answer: 1,
          explanation:
            "Lambda mengembalikan s.Length bertipe int, jadi hasilnya urutan int. Tipe hasil Select selalu mengikuti apa yang dikembalikan lambdanya.",
        },
        {
          kind: "code",
          title: "Kapitalkan seluruh kata",
          prompt:
            "Program membaca `n` kata lalu mencetak versi huruf besar dari tiap kata, satu per baris. Lengkapi method LINQ yang memetakannya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<string> kata = new List<string>();
        for (int i = 0; i < n; i++)
        {
            kata.Add(Console.ReadLine());
        }

        IEnumerable<string> besar = kata.___(s => s.ToUpper());

        foreach (string s in besar)
        {
            Console.WriteLine(s);
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<string> kata = new List<string>();
        for (int i = 0; i < n; i++)
        {
            kata.Add(Console.ReadLine());
        }

        IEnumerable<string> besar = kata.Select(s => s.ToUpper());

        foreach (string s in besar)
        {
            Console.WriteLine(s);
        }
    }
}`,
          tests: [
            { stdin: "3\nkopi\nteh\nsusu", expectedOutput: "KOPI\nTEH\nSUSU" },
            { stdin: "2\na\nb", expectedOutput: "A\nB" },
            { stdin: "2\nAbC\nzYx", expectedOutput: "ABC\nZYX", hidden: true },
          ],
          hints: [
            "Method yang dicari memetakan tiap elemen menjadi bentuk lain, bukan menyaring.",
            "Lambdanya sudah benar; yang hilang nama methodnya.",
            "Jawabannya: Select.",
          ],
        },
      ],
    },
    {
      slug: "linq-orderby",
      title: "OrderBy dan OrderByDescending",
      summary: "Mengurutkan dengan kunci pilihan, menambah kunci kedua lewat ThenBy, tanpa mengubah sumbernya.",
      steps: [
        {
          kind: "theory",
          title: "Urut berdasarkan kunci yang kamu pilih",
          body: "`OrderBy(keySelector)` mengurutkan menaik berdasarkan kunci pilihanmu: `angka.OrderBy(x => x)` berdasarkan nilainya, `nama.OrderBy(s => s.Length)` berdasarkan panjang. Untuk arah sebaliknya ada `OrderByDescending`. Pengurutan LINQ stabil: dua elemen dengan kunci setara mempertahankan urutan asal relatifnya, sifat yang tidak dijanjikan `List.Sort`.\n\nKunci kedua ditambahkan lewat `ThenBy` dan `ThenByDescending` setelah OrderBy pertama: `data.OrderByDescending(p => p.Nilai).ThenBy(p => p.Nama)` berarti nilai terbesar di depan, dan untuk nilai yang seri, nama menaik. Ini jauh lebih terbaca daripada pembanding dua lapis manual seperti yang kamu tulis untuk `List.Sort` di modul collections.\n\nSama seperti Where dan Select, `OrderBy` tidak mengubah sumbernya; ia mengembalikan urutan baru, list asli tetap pada urutan semula. Bila hasil harus disimpan atau dikirim keluar, wujudkan dengan `ToList()` atau `ToArray()`; bila hanya untuk ditampilkan, langsung foreach.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> angka = new List<int> { 5, 1, 4 };

        IEnumerable<int> naik = angka.OrderBy(x => x);
        IEnumerable<int> turun = angka.OrderByDescending(x => x);

        Console.WriteLine(string.Join(" ", naik));  // 1 4 5
        Console.WriteLine(string.Join(" ", turun)); // 5 4 1
        Console.WriteLine(string.Join(" ", angka)); // 5 1 4, sumber tetap
    }
}`,
            caption: "OrderBy mengembalikan urutan baru; sumbernya tidak tersentuh.",
          },
        },
        {
          kind: "quiz",
          question: "Apa beda `List.Sort()` dan `angka.OrderBy(x => x)`?",
          options: [
            "Sort mengembalikan urutan baru, OrderBy mengurutkan di tempat",
            "Sort mengurutkan di tempat tanpa nilai balik, OrderBy mengembalikan urutan baru tanpa mengubah sumber",
            "Keduanya identik dalam segala hal",
            "OrderBy hanya bisa untuk string",
          ],
          answer: 1,
          explanation:
            "List.Sort mengurutkan list itu sendiri dan tidak mengembalikan apa pun. OrderBy adalah method LINQ yang menghasilkan urutan baru dan membiarkan sumbernya utuh.",
        },
        {
          kind: "code",
          title: "Urutkan dari terbesar",
          prompt:
            "Program membaca `n` bilangan lalu mencetaknya terurut menurun dalam satu baris dipisah spasi. Lengkapi method pengurutannya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        IEnumerable<int> urut = angka.___(x => x);
        Console.WriteLine(string.Join(" ", urut));
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        IEnumerable<int> urut = angka.OrderByDescending(x => x);
        Console.WriteLine(string.Join(" ", urut));
    }
}`,
          tests: [
            { stdin: "5\n3\n1\n4\n1\n5", expectedOutput: "5 4 3 1 1" },
            { stdin: "3\n10\n-2\n7", expectedOutput: "10 7 -2" },
            { stdin: "1\n42", expectedOutput: "42", hidden: true },
          ],
          hints: [
            "Cari method LINQ yang mengurutkan dari nilai terbesar ke terkecil.",
            "Kebalikannya bernama OrderBy; tambahkan akhiran yang menunjuk arah.",
            "Jawabannya: OrderByDescending.",
          ],
        },
      ],
    },
    {
      slug: "linq-first-firstordefault",
      title: "First, FirstOrDefault, dan Single",
      summary: "Mengambil satu elemen: First yang tegas, FirstOrDefault yang toleran, Single yang menuntut tepat satu.",
      steps: [
        {
          kind: "theory",
          title: "Satu elemen, tiga kontrak",
          body: "Setelah menyaring, sering kamu hanya butuh satu elemen. `First()` mengambil elemen pertama, `First(syarat)` yang pertama lolos syarat. Kontraknya tegas: bila tidak ada, ia melempar `InvalidOperationException`. `FirstOrDefault()` memilih kontrak lain: bila tidak ada, ia mengembalikan nilai bawaan tipe, yaitu 0 untuk int dan null untuk tipe referensi.\n\n`Single()` paling keras kepala: ia menuntut tepat satu elemen; kosong melempar exception, dan lebih dari satu pun melempar exception. Pakai bila duplikat berarti bug, misalnya pencarian berdasarkan ID unik. `SingleOrDefault()` menoleransi nol tetapi tetap protes bila dua. Melengkapi keluarganya ada `Last`, `LastOrDefault`, dan `ElementAt` untuk posisi tertentu.\n\nSatu jebakan `FirstOrDefault` layak digarisbawahi: nilai bawaan 0 bisa saja nilai sah yang memang ada di data. Pastikan tidak ambigu, misalnya dengan menyaring `x >= 80` sehingga 0 mustahil lolos, atau periksa keberadaan lebih dulu dengan `Any` sebelum mengambil.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> nilai = new List<int> { 50, 82, 90 };

        int pertama = nilai.First(n => n >= 80);         // 82
        int aman = nilai.FirstOrDefault(n => n >= 80);   // 82
        int kosong = nilai.FirstOrDefault(n => n >= 99); // 0

        Console.WriteLine(pertama);
        Console.WriteLine(aman);
        Console.WriteLine(kosong);
        // nilai.First(n => n >= 99) melempar InvalidOperationException
    }
}`,
            caption: "First menuntut ada; FirstOrDefault memberi nilai bawaan bila tidak ada.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `angka.FirstOrDefault(x => x > 100)` bila tidak ada satu pun elemen yang memenuhi, dengan `angka` bertipe `List<int>`?",
          options: [
            "Melempar InvalidOperationException",
            "Mengembalikan 0",
            "Mengembalikan null",
            "Mengembalikan -1",
          ],
          answer: 1,
          explanation:
            "FirstOrDefault mengembalikan nilai bawaan tipe saat tidak ada yang lolos; untuk int berarti 0. Yang melempar exception adalah First.",
        },
        {
          kind: "quiz",
          question: "Method mana yang melempar exception bila hasil query berisi dua elemen, bukan satu?",
          options: ["First", "FirstOrDefault", "Single", "Last"],
          answer: 2,
          explanation:
            "Single menuntut tepat satu: kosong melempar exception, dua atau lebih pun melempar exception. First hanya peduli elemen pertama dan tidak peduli sisanya.",
        },
        {
          kind: "code",
          title: "Cari nilai pertama yang memenuhi",
          prompt:
            "Program mencari nilai pertama yang 80 ke atas. Bila ketemu cetak `Ketemu: <nilai>`, bila tidak ada cetak `Tidak ada`. Lengkapi method pengambilnya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> nilai = new List<int>();
        for (int i = 0; i < n; i++)
        {
            nilai.Add(Convert.ToInt32(Console.ReadLine()));
        }

        int hasil = nilai.___(x => x >= 80);

        if (hasil == 0)
        {
            Console.WriteLine("Tidak ada");
        }
        else
        {
            Console.WriteLine("Ketemu: {0}", hasil);
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> nilai = new List<int>();
        for (int i = 0; i < n; i++)
        {
            nilai.Add(Convert.ToInt32(Console.ReadLine()));
        }

        int hasil = nilai.FirstOrDefault(x => x >= 80);

        if (hasil == 0)
        {
            Console.WriteLine("Tidak ada");
        }
        else
        {
            Console.WriteLine("Ketemu: {0}", hasil);
        }
    }
}`,
          tests: [
            { stdin: "3\n70\n85\n90", expectedOutput: "Ketemu: 85" },
            { stdin: "2\n10\n20", expectedOutput: "Tidak ada" },
            { stdin: "1\n80", expectedOutput: "Ketemu: 80", hidden: true },
          ],
          hints: [
            "Method yang dicari tidak pernah melempar exception saat tidak ada yang lolos syarat.",
            "Namanya menggabungkan First dengan penanda nilai bawaan.",
            "Jawabannya: FirstOrDefault.",
          ],
        },
      ],
    },
    {
      slug: "linq-any-all-contains",
      title: "Any, All, dan Contains",
      summary: "Pertanyaan ya atau tidak atas koleksi: minimal satu lolos, semuanya lolos, atau memuat nilai tertentu.",
      steps: [
        {
          kind: "theory",
          title: "Satu jawaban untuk satu pertanyaan",
          body: "`Any(syarat)` menjawab: ada minimal satu elemen yang lolos? Ia berhenti begitu menemukan yang pertama, jadi murah bahkan pada data besar. `Any()` tanpa argumen menjawab apakah koleksi tidak kosong, dan itulah cara paling ringkas menggantikan `Count() > 0`. `All(syarat)` menjawab apakah semuanya lolos, dan berhenti di penyangkal pertama.\n\nSatu hasil yang sering mengejutkan: `All` pada koleksi kosong bernilai true. Secara logika itu benar, tidak ada satu pun elemen yang menyangkal, tetapi secara bisnis bisa jadi bukan maksudmu. Bila keadaan kosong harus diperlakukan khusus, gabungkan dengan `Any` lebih dulu.\n\n`Contains(nilai)` memeriksa keanggotaan berdasarkan kesetaraan: cepat pada `HashSet<T>`, tetapi memindai satu per satu pada `List<T>`. Bila pertanyaan keanggotaan muncul terus-menerus pada data besar, ubah sumbernya menjadi HashSet seperti di modul collections; LINQ bekerja pada IEnumerable apa pun, tetapi tidak bisa mengubah biaya struktur di baliknya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> nilai = new List<int> { 80, 75, 90 };

        Console.WriteLine(nilai.Any(n => n > 85));  // True
        Console.WriteLine(nilai.All(n => n >= 75)); // True
        Console.WriteLine(nilai.All(n => n >= 80)); // False
        Console.WriteLine(nilai.Contains(75));      // True
        Console.WriteLine(new List<int>().Any());   // False
    }
}`,
            caption: "Any berhenti di temuan pertama, All di penyangkal pertama.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `new List<int>().All(x => x > 0)`?",
          options: [
            "False karena koleksinya kosong",
            "True, karena tidak ada elemen yang menyangkal",
            "Melempar exception",
            "Mengembalikan null",
          ],
          answer: 1,
          explanation:
            "All pada koleksi kosong selalu true: tidak ada penyangkal. Ini sumber bug halus bila keadaan kosong seharusnya diperlakukan khusus.",
        },
        {
          kind: "quiz",
          question: "Untuk mengecek apakah daftar tidak kosong, cara LINQ paling ringkas adalah?",
          options: ["daftar.Count() > 0", "daftar.Any()", "daftar.All(x => true)", "daftar.First() != null"],
          answer: 1,
          explanation:
            "Any() tanpa argumen berhenti pada elemen pertama, jadi paling murah dan paling terbaca. Count() harus menelusuri, dan First pada list kosong justru melempar exception.",
        },
        {
          kind: "code",
          title: "Audit daftar angka",
          prompt:
            "Program membaca `n` bilangan lalu menjawab dua pertanyaan: ada yang negatif atau tidak, dan apakah semuanya genap. Lengkapi dua method LINQ-nya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        bool adaNegatif = angka.___(x => x < 0);
        bool semuaGenap = angka.___(x => x % 2 == 0);

        Console.WriteLine(adaNegatif ? "Ada negatif" : "Semua non-negatif");
        Console.WriteLine(semuaGenap ? "Semua genap" : "Ada ganjil");
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        bool adaNegatif = angka.Any(x => x < 0);
        bool semuaGenap = angka.All(x => x % 2 == 0);

        Console.WriteLine(adaNegatif ? "Ada negatif" : "Semua non-negatif");
        Console.WriteLine(semuaGenap ? "Semua genap" : "Ada ganjil");
    }
}`,
          tests: [
            { stdin: "3\n2\n-4\n6", expectedOutput: "Ada negatif\nSemua genap" },
            { stdin: "3\n2\n5\n8", expectedOutput: "Semua non-negatif\nAda ganjil" },
            { stdin: "2\n0\n10", expectedOutput: "Semua non-negatif\nSemua genap", hidden: true },
          ],
          hints: [
            "Method pertama menjawab ada atau tidaknya satu saja yang lolos; method kedua menuntut semuanya.",
            "Keduanya menerima lambda yang mengembalikan bool.",
            "Jawabannya: Any dan All.",
          ],
        },
      ],
    },
    {
      slug: "linq-agregasi",
      title: "Agregasi: Count, Sum, Min, Max",
      summary: "Merangkum koleksi menjadi satu angka dengan Count, Sum, Min, Max, dan Average.",
      steps: [
        {
          kind: "theory",
          title: "Dari sekian elemen menjadi satu angka",
          body: "Method agregasi merangkum koleksi menjadi satu nilai. `Count()` menghitung elemen, dan `Count(syarat)` menghitung yang lolos syarat; pada `List<T>` tetap ada property `Count` yang dibaca langsung tanpa menelusuri. `Sum()` menjumlah, `Min()` dan `Max()` mengambil ekstrem, `Average()` menghitung rata-rata dan mengembalikan `double`.\n\nPerilakunya pada koleksi kosong perlu diingat: `Sum` mengembalikan 0, tetapi `Min`, `Max`, dan `Average` melempar `InvalidOperationException`. Bila kosong adalah keadaan yang mungkin terjadi, periksa dengan `Any` lebih dulu dan putuskan apa arti rata-rata dari data yang tidak ada.\n\nUntuk menampilkan, jaga bentuknya konsisten: `Average` bertipe double, dan `ToString(\"F1\", CultureInfo.InvariantCulture)` mengunci satu angka desimal dengan titik sebagai pemisah, tidak terpengaruh setelan regional komputer. Kebiasaan format string dari modul sebelumnya tetap berlaku penuh di sini.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> penjualan = new List<int> { 120, 80, 150 };

        Console.WriteLine(penjualan.Count);               // 3, property
        Console.WriteLine(penjualan.Count(n => n > 100)); // 2
        Console.WriteLine(penjualan.Sum());               // 350
        Console.WriteLine(penjualan.Min());               // 80
        Console.WriteLine(penjualan.Max());               // 150
        double rata = penjualan.Average();
        Console.WriteLine(rata.ToString("F1", CultureInfo.InvariantCulture)); // 116.7
    }
}`,
            caption: "Lima method agregasi, satu baris masing-masing.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk `List<int>`, apa beda property `Count` dan method `Count()`?",
          options: [
            "Tidak ada bedanya sama sekali",
            "Property dibaca langsung, sedangkan method LINQ menelusuri dan bisa menerima predicate",
            "Method lebih cepat untuk menghitung seluruh isi",
            "Property hanya berlaku untuk array",
          ],
          answer: 1,
          explanation:
            "Property Count milik List dibaca langsung. Count() adalah method LINQ pada IEnumerable yang menelusuri, dan bentuk berargumennya menghitung yang lolos syarat.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `angka.Average()` bila `angka` kosong?",
          options: [
            "Mengembalikan 0",
            "Mengembalikan NaN",
            "Melempar InvalidOperationException",
            "Mengembalikan null",
          ],
          answer: 2,
          explanation:
            "Average tidak punya jawaban untuk data kosong, jadi ia melempar InvalidOperationException. Periksa Any lebih dulu bila kosong mungkin terjadi; Sum sendiri mengembalikan 0.",
        },
        {
          kind: "code",
          title: "Ringkasan empat angka",
          prompt:
            "Program membaca `n` bilangan lalu mencetak jumlahnya, rata-rata satu desimal, nilai terkecil, dan terbesar. Lengkapi method agregasi yang mengambil nilai terkecil.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        Console.WriteLine("Jumlah: {0}", angka.Sum());
        Console.WriteLine("Rata-rata: {0}", angka.Average().ToString("F1", CultureInfo.InvariantCulture));
        Console.WriteLine("Terkecil: {0}", angka.___());
        Console.WriteLine("Terbesar: {0}", angka.Max());
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> angka = new List<int>();
        for (int i = 0; i < n; i++)
        {
            angka.Add(Convert.ToInt32(Console.ReadLine()));
        }

        Console.WriteLine("Jumlah: {0}", angka.Sum());
        Console.WriteLine("Rata-rata: {0}", angka.Average().ToString("F1", CultureInfo.InvariantCulture));
        Console.WriteLine("Terkecil: {0}", angka.Min());
        Console.WriteLine("Terbesar: {0}", angka.Max());
    }
}`,
          tests: [
            { stdin: "4\n10\n5\n8\n1", expectedOutput: "Jumlah: 24\nRata-rata: 6.0\nTerkecil: 1\nTerbesar: 10" },
            { stdin: "3\n7\n7\n7", expectedOutput: "Jumlah: 21\nRata-rata: 7.0\nTerkecil: 7\nTerbesar: 7" },
            { stdin: "3\n-5\n2\n9", expectedOutput: "Jumlah: 6\nRata-rata: 2.0\nTerkecil: -5\nTerbesar: 9", hidden: true },
          ],
          hints: [
            "Cari method yang mengembalikan nilai terkecil dari koleksi.",
            "Pasangannya untuk nilai terbesar sudah tertulis di baris bawah.",
            "Jawabannya: Min.",
          ],
        },
      ],
    },
    {
      slug: "linq-groupby",
      title: "GroupBy: Mengelompokkan Data",
      summary: "Sekali kelompok, banyak hitungan: kunci, anggota, dan jumlah per kelompok dengan GroupBy.",
      steps: [
        {
          kind: "theory",
          title: "Susun menjadi kelompok berdasarkan kunci",
          body: "`GroupBy(keySelector)` mengumpulkan elemen yang kuncinya sama menjadi satu kelompok. Hasilnya `IEnumerable<IGrouping<TKey, T>>`: tiap kelompok membawa `Key`, yaitu nilai yang jadi dasar pengelompokan, dan isinya yang bisa di-foreach. Dengan `kata.GroupBy(k => k[0])` kamu mendapat kelompok per huruf awal; dengan `k => k` kamu mendapat frekuensi tiap kata.\n\nHitungan per kelompok tinggal `Count()` tanpa argumen di dalam foreach grup, dan isi tiap grup bisa dipetakan lagi dengan Select bila perlu. Pada LINQ to Objects, kelompok keluar sesuai urutan kemunculan pertama kuncinya, kebiasaan yang nyaman untuk laporan, meski secara kontrak urutan tidak selalu dijanjikan oleh semua penyedia LINQ.\n\nGroupBy menggantikan pola dictionary yang diisi manual di loop: kunci diperiksa, bila belum ada dibuat, lalu nilainya diubah. Hasil GroupBy menyatakan maksud pengelompokan secara langsung, lebih sedikit bagian yang bisa salah, dan mudah dirantai ke pengurutan atau proyeksi berikutnya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<string> kata = new List<string> { "apel", "jeruk", "avokad", "jambu" };

        IEnumerable<IGrouping<char, string>> kelompok = kata.GroupBy(k => k[0]);

        foreach (IGrouping<char, string> g in kelompok)
        {
            Console.WriteLine("{0}: {1}", g.Key, g.Count()); // a: 2, j: 2
            foreach (string s in g)
            {
                Console.WriteLine("  {0}", s);
            }
        }
    }
}`,
            caption: "Tiap grup membawa Key dan isinya sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `kata.GroupBy(k => k[0])`, apa isi `grup.Key` untuk grup yang menampung semua kata berawalan a?",
          options: [
            "Daftar kata berawalan a",
            "Karakter a",
            "Jumlah anggota grup",
            "Indeks grup",
          ],
          answer: 1,
          explanation:
            "Key adalah nilai kunci hasil selector, di sini karakter pertama, bertipe char. Isi grupnya adalah grup itu sendiri yang bisa di-foreach, bukan Key.",
        },
        {
          kind: "quiz",
          question: "Cara menghitung anggota satu kelompok `grup` adalah?",
          options: ["grup.Key", "grup.Count()", "grup.Length", "grup.Sum"],
          answer: 1,
          explanation:
            "IGrouping adalah IEnumerable<T>, jadi Count() menghitung anggotanya. Length adalah milik array, dan Sum menjumlahkan nilai, bukan menghitung banyaknya.",
        },
        {
          kind: "code",
          title: "Hitung frekuensi kata",
          prompt:
            "Program membaca `n` kata lalu mencetak setiap kata beserta jumlah kemunculannya berbentuk `kata: <jumlah>`, sesuai urutan kemunculan pertamanya. Lengkapi property kunci dari tiap grup.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<string> kata = new List<string>();
        for (int i = 0; i < n; i++)
        {
            kata.Add(Console.ReadLine());
        }

        IEnumerable<IGrouping<string, string>> kelompok = kata.GroupBy(k => k);

        foreach (IGrouping<string, string> grup in kelompok)
        {
            Console.WriteLine("{0}: {1}", grup.___, grup.Count());
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<string> kata = new List<string>();
        for (int i = 0; i < n; i++)
        {
            kata.Add(Console.ReadLine());
        }

        IEnumerable<IGrouping<string, string>> kelompok = kata.GroupBy(k => k);

        foreach (IGrouping<string, string> grup in kelompok)
        {
            Console.WriteLine("{0}: {1}", grup.Key, grup.Count());
        }
    }
}`,
          tests: [
            { stdin: "5\nkopi\nteh\nkopi\nkopi\nteh", expectedOutput: "kopi: 3\nteh: 2" },
            { stdin: "2\na\na", expectedOutput: "a: 2" },
            { stdin: "3\nx\ny\nx", expectedOutput: "x: 2\ny: 1", hidden: true },
          ],
          hints: [
            "Yang dicetak sebelum titik dua adalah nilai yang jadi dasar pengelompokan.",
            "Property grup yang menyimpan nilai kuncinya ditulis PascalCase tanpa tanda kurung.",
            "Jawabannya: Key.",
          ],
        },
      ],
    },
    {
      slug: "linq-deferred-execution",
      title: "Deferred Execution",
      summary: "Query baru rencana, bukan hasil: kapan LINQ benar-benar berjalan dan apa konsekuensinya.",
      steps: [
        {
          kind: "theory",
          title: "Rencana yang baru jalan saat diminta",
          body: "Method LINQ seperti `Where` dan `Select` tidak menghitung apa pun saat barisnya dieksekusi. Ia hanya menyusun pipeline: catatan bahwa nanti, saat diminta, elemen akan disaring begini dan dipetakan begini. Eksekusi sungguhan ditunda sampai enumerasi: `foreach`, `ToList()`, `ToArray()`, `Count()`, `First()`, dan method lain yang butuh hasil nyata. Sifat ini bernama deferred execution.\n\nKonsekuensinya nyata. Query yang dibuat dari sebuah List masih membaca List itu saat enumerasi, jadi elemen yang ditambahkan setelah query dibuat tetap ikut terhitung. Enumerasi dua kali berarti pekerjaan penyaringan dijalankan dua kali; pada data besar dan pipeline panjang, itu biaya yang mudah terlewat. Dan bila sumbernya berubah di tengah enumerasi, `InvalidOperationException` dengan pesan collection was modified bisa muncul, sama seperti pada foreach biasa.\n\nKapan perlu mewujudkan? Saat kamu butuh snapshot yang tidak ikut berubah: `ToList()` membekukan hasil ke List baru. Aturan praktisnya: biarkan malas di tengah pipeline, wujudkan sekali di ujung atau di batas method.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> angka = new List<int> { 1, 2, 3 };

        IEnumerable<int> query = angka.Where(n => n > 1);

        angka.Add(99); // ditambahkan SETELAH query dibuat

        foreach (int n in query)
        {
            Console.WriteLine(n); // 2, 3, 99: query baru jalan di sini
        }

        List<int> beku = angka.Where(n => n > 1).ToList(); // mewujudkan hasil
        Console.WriteLine(beku.Count); // 3
    }
}`,
            caption: "Query membaca sumber saat enumerasi, bukan saat dibuat.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan filter pada `data.Where(n => n > 10)` benar-benar dijalankan?",
          options: [
            "Segera setelah barisnya dieksekusi",
            "Saat urutan hasil dienumerasi, misalnya foreach atau ToList",
            "Saat program dikompilasi",
            "Saat sumbernya dibuat",
          ],
          answer: 1,
          explanation:
            "Where hanya menyusun rencana. Penyaringan sungguhan terjadi ketika hasilnya dienumerasi oleh foreach, ToList, Count, dan method lain yang menuntut elemen nyata.",
        },
        {
          kind: "quiz",
          question: "Query dibuat dari sebuah List, lalu satu elemen ditambahkan ke List itu sebelum foreach. Apa hasil enumerasinya?",
          options: [
            "Elemen baru tidak ikut karena query sudah dibuat",
            "Elemen baru ikut, karena query membaca sumber saat enumerasi",
            "Query melempar exception",
            "Hasilnya kosong",
          ],
          answer: 1,
          explanation:
            "Deferred execution berarti query tidak menyimpan salinan; ia membaca sumber pada saat enumerasi, sehingga perubahan sumber sebelum enumerasi tetap terlihat.",
        },
      ],
    },
    {
      slug: "linq-query-vs-method",
      title: "Query Syntax versus Method Syntax",
      summary: "Dua penulisan satu makna: from-where-select yang diterjemahkan menjadi Where-Select, dan kapan masing-masing unggul.",
      steps: [
        {
          kind: "theory",
          title: "Satu makna, dua ejaan",
          body: "Bentuk `from n in angka where n > 0 select n` disebut query syntax, dan ia tidak punya mesinnya sendiri: compiler menerjemahkannya menjadi pemanggilan method yang persis sama, `angka.Where(n => n > 0)`. Dua ejaan, satu hasil kompilasi. Itu sebabnya hasil keduanya tidak mungkin berbeda, dan memilih keduanya murni soal keterbacaan.\n\nMethod syntax lebih lengkap. Banyak operator tidak punya padanan query syntax: `Count`, `First`, `Sum`, `Take`, dan `Skip` hanya bisa dipanggil sebagai method. Sebaliknya, query syntax paling bersinar pada `join` antar dua sumber dan `let` untuk variabel perantara di tengah query, dua hal yang di method syntax jadi bertingkat dan lebih sulit dibaca.\n\nGaya campuran juga sah dan lazim: susun query syntax untuk bagian yang terbaca seperti kalimat, lalu lanjutkan dengan method di ujungnya, misalnya `(from p in data where p.Nilai >= 70 select p).Count()`. Yang penting satu: konsisten dengan gaya tim di satu proyek, bukan berganti-gaya antar file.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        List<int> nilai = new List<int> { 70, 45, 90 };

        // method syntax
        IEnumerable<int> a = nilai.Where(n => n >= 70).OrderBy(n => n);

        // query syntax: maknanya sama persis
        IEnumerable<int> b = from n in nilai
                             where n >= 70
                             orderby n
                             select n;

        Console.WriteLine(string.Join(" ", a)); // 70 90
        Console.WriteLine(string.Join(" ", b)); // 70 90
        Console.WriteLine(a.Count());           // Count hanya lewat method
    }
}`,
            caption: "Compiler menerjemahkan query syntax menjadi pemanggilan method yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Operator mana yang hanya tersedia lewat method syntax?",
          options: ["where", "select", "Count", "orderby"],
          answer: 2,
          explanation:
            "Query syntax hanya menutup operator seperti from, where, select, orderby, join, dan group. Count, First, Sum, Take, dan Skip harus dipanggil sebagai method.",
        },
        {
          kind: "quiz",
          question: "Saat dikompilasi, query `from n in angka where n > 0 select n` menjadi apa?",
          options: [
            "Loop for manual",
            "Pemanggilan method LINQ yang sama, yaitu angka.Where(n => n > 0)",
            "Array baru",
            "Perintah SQL",
          ],
          answer: 1,
          explanation:
            "Query syntax adalah gula sintaks: compiler menerjemahkannya ke pemanggilan method LINQ yang persis sama, tanpa perbedaan hasil.",
        },
      ],
    },
    {
      slug: "linq-latihan-laporan",
      title: "Latihan Gabungan: Laporan Penjualan",
      summary: "Where, Average, dan pengurutan dua kunci menyatu di satu laporan data peserta.",
      steps: [
        {
          kind: "theory",
          title: "Satu laporan, satu pipeline",
          body: "Penutup modul menyatukan semuanya. Data masuk sebagai baris `nama;nilai` dan tidak semuanya sah, jadi baris rusak dilewati dengan cara yang kamu latih di modul exception: periksa jumlah bagian hasil `Split`, uraikan angkanya dengan `TryParse`. Sisanya menjadi `List<Peserta>` yang siap di-query dengan LINQ.\n\nLaporannya empat baris kejujuran: jumlah peserta sah, jumlah yang lulus dengan batas nilai 70, rata-rata nilai lulus dengan satu angka desimal, lalu daftar lulus dari nilai terbesar. Untuk nilai yang seri, nama diurutkan menaik, dan itulah tempat `OrderByDescending` bersanding dengan `ThenBy`. Perhatikan pemakaian `ToList()` untuk mewujudkan hasil sebelum dicetak; kamu sudah tahu alasannya dari lesson deferred execution.",
          code: {
            language: "csharp",
            content: "// baris: \"nama;nilai\"\n// sah: bagian.Length == 2 && int.TryParse(bagian[1], out nilai)\n// lulus: p.Nilai >= 70\n// peringkat: OrderByDescending(p => p.Nilai).ThenBy(p => p.Nama)",
            caption: "Empat kontrak laporan yang kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Laporan kelulusan peserta",
          prompt:
            "Lengkapi tiga method LINQ yang hilang: penyaring peserta lulus, perata-rata nilai lulus, dan pengurut kunci kedua untuk nama menaik. Baris data rusak sudah ditangani di bagian atas.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class Peserta
{
    public string Nama;
    public int Nilai;
}

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Peserta> data = new List<Peserta>();

        for (int i = 0; i < n; i++)
        {
            string[] bagian = Console.ReadLine().Split(';');
            int nilai;
            if (bagian.Length == 2 && int.TryParse(bagian[1], out nilai))
            {
                Peserta p = new Peserta();
                p.Nama = bagian[0];
                p.Nilai = nilai;
                data.Add(p);
            }
        }

        List<Peserta> lulus = data.___(p => p.Nilai >= 70).ToList();

        Console.WriteLine("Peserta sah: {0}", data.Count);
        Console.WriteLine("Lulus: {0}", lulus.Count);
        Console.WriteLine("Rata-rata lulus: {0}", lulus.___(p => p.Nilai).ToString("F1", CultureInfo.InvariantCulture));

        List<Peserta> peringkat = lulus.OrderByDescending(p => p.Nilai).___(p => p.Nama).ToList();
        foreach (Peserta p in peringkat)
        {
            Console.WriteLine("{0}: {1}", p.Nama, p.Nilai);
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class Peserta
{
    public string Nama;
    public int Nilai;
}

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Peserta> data = new List<Peserta>();

        for (int i = 0; i < n; i++)
        {
            string[] bagian = Console.ReadLine().Split(';');
            int nilai;
            if (bagian.Length == 2 && int.TryParse(bagian[1], out nilai))
            {
                Peserta p = new Peserta();
                p.Nama = bagian[0];
                p.Nilai = nilai;
                data.Add(p);
            }
        }

        List<Peserta> lulus = data.Where(p => p.Nilai >= 70).ToList();

        Console.WriteLine("Peserta sah: {0}", data.Count);
        Console.WriteLine("Lulus: {0}", lulus.Count);
        Console.WriteLine("Rata-rata lulus: {0}", lulus.Average(p => p.Nilai).ToString("F1", CultureInfo.InvariantCulture));

        List<Peserta> peringkat = lulus.OrderByDescending(p => p.Nilai).ThenBy(p => p.Nama).ToList();
        foreach (Peserta p in peringkat)
        {
            Console.WriteLine("{0}: {1}", p.Nama, p.Nilai);
        }
    }
}`,
          tests: [
            {
              stdin: "4\nani;80\nbudi;60\ncita;90\ndon;80",
              expectedOutput: "Peserta sah: 4\nLulus: 3\nRata-rata lulus: 83.3\ncita: 90\nani: 80\ndon: 80",
            },
            {
              stdin: "3\neka;70\nfile;70\ngita;70",
              expectedOutput: "Peserta sah: 3\nLulus: 3\nRata-rata lulus: 70.0\neka: 70\nfile: 70\ngita: 70",
            },
            {
              stdin: "5\nhana;95\nindra;55\njoko;70\nkiki;45\nlala;95",
              expectedOutput: "Peserta sah: 5\nLulus: 3\nRata-rata lulus: 86.7\nhana: 95\nlala: 95\njoko: 70",
              hidden: true,
            },
          ],
          hints: [
            "Kata kunci pertama menyaring, kedua merangkum menjadi satu angka, ketiga menambah kunci urutan kedua.",
            "Rata-rata per objek dihitung lewat method LINQ yang menerima selector dan mengembalikan double.",
            "Jawabannya: Where, Average, dan ThenBy.",
          ],
        },
      ],
    },
  ],
};
