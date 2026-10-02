import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "csharp",
  moduleRange: [6, 7],
  modules: [
    {
      title: "LINQ Lanjut dan Delegasi",
      description: "GroupBy/Join/aggregate, Func/Action, dan komposisi logika.",
    },
    {
      title: "Async dan Task",
      description: "async/await, Task, penanganan exception async, dan jebakan umum.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: LINQ Lanjut dan Delegasi ====================
    {
      slug: "lin-func-action-dasar",
      title: "Func dan Action: Perilaku sebagai Nilai",
      summary: "Simpan logika ke dalam variabel dengan Func dan Action, fondasi di balik semua method LINQ.",
      steps: [
        {
          kind: "theory",
          title: "Logika yang bisa disimpan dan dikirim",
          body: "Sejauh ini variabel menyimpan data: angka, teks, list. `Func` dan `Action` menyimpan sesuatu yang lain: perilaku, yaitu logika yang bisa dipanggil. Keduanya adalah delegate generik bawaan .NET. `Func<T, TResult>` menerima argumen dan mengembalikan hasil; tipe parameter terakhir selalu tipe kembalinya, jadi `Func<int, int>` menerima satu int dan mengembalikan int, sementara `Func<int, int, int>` menerima dua int dan mengembalikan int. `Action<T>` mirip tetapi tidak mengembalikan apa pun, seperti method void.\n\nIsi variabelnya paling ringkas dengan lambda. Setelah terisi, variabel itu dipanggil seperti method biasa: `kuadrat(7)` atau eksplisit lewat `kuadrat.Invoke(7)`. Karena perilakunya kini berupa nilai, ia bisa dikirim sebagai argumen ke method lain, disimpan di list, atau diganti-ganti saat runtime. Inilah mekanisme yang sama dipakai semua method LINQ: `Where` menerima `Func<T, bool>`, `Select` menerima `Func<T, TResult>`. Memahami dua tipe ini berarti memahami bahasa yang dipakai LINQ.\n\nCatatan versi: di compiler klasik C# 5 lambda adalah cara utama menuliskannya. C# yang lebih baru menambah bentuk penulisan lain seperti natural type untuk lambda, tetapi maknanya tetap sama: satu nilai bertipe delegate yang bisa dipanggil.",
          code: {
            language: "csharp",
            content: `using System;

public class Program
{
    public static void Main()
    {
        Func<int, int> kuadrat = x => x * x;
        Func<int, int, int> jumlahkan = (a, b) => a + b;
        Action<string> sapa = nama => Console.WriteLine("Hai, {0}!", nama);

        Console.WriteLine(kuadrat(7));            // 49
        Console.WriteLine(jumlahkan(kuadrat(3), 1)); // 10
        sapa("Dina");
    }
}`,
            caption: "Tiga perilaku berbeda, semuanya tinggal variabel yang bisa dipanggil.",
          },
        },
        {
          kind: "quiz",
          question: "Tipe delegate mana yang tepat untuk logika yang menerima satu string dan mengembalikan bool?",
          options: ["Func<string, bool>", "Action<string>", "Func<bool, string>", "Func<string, int>"],
          answer: 0,
          explanation:
            "Pada Func, tipe terakhir selalu tipe kembalian. Menerima string dan mengembalikan bool berarti Func<string, bool>. Action tidak mengembalikan apa pun.",
        },
        {
          kind: "quiz",
          question: "Apa beda mendasar Action dan Func?",
          options: [
            "Action hanya untuk angka, Func untuk teks",
            "Action tidak punya nilai kembalian, Func selalu mengembalikan nilai",
            "Func tidak bisa menerima parameter",
            "Action tidak bisa diisi lambda",
          ],
          answer: 1,
          explanation:
            "Action mewakili method yang mengembalikan void. Func selalu punya satu tipe kembalian, walau tanpa parameter seperti Func<int>.",
        },
        {
          kind: "code",
          title: "Lengkapi tipe delegate-nya",
          prompt:
            "Program di bawah sudah benar isinya, tipe datanya saja yang kosong. Lengkapi dua tipe yang hilang: hasil `kuadrat` dan tipe argumen `cetak`.",
          mode: "fill",
          template: `using System;

public class Program
{
    public static void Main()
    {
        Func<int, ___> kuadrat = x => x * x;
        Func<int, int, int> jumlahkan = (a, b) => a + b;
        Action<___> cetak = teks => Console.WriteLine(teks);

        Console.WriteLine(kuadrat(9));
        Console.WriteLine(jumlahkan(40, 2));
        cetak("program selesai");
    }
}`,
          solution: `using System;

public class Program
{
    public static void Main()
    {
        Func<int, int> kuadrat = x => x * x;
        Func<int, int, int> jumlahkan = (a, b) => a + b;
        Action<string> cetak = teks => Console.WriteLine(teks);

        Console.WriteLine(kuadrat(9));
        Console.WriteLine(jumlahkan(40, 2));
        cetak("program selesai");
    }
}`,
          tests: [{ stdin: "", expectedOutput: "81\n42\nprogram selesai" }],
          hints: [
            "Lihat lambda-nya: x => x * x menerima int dan menghasilkan int, jadi tipe kembalian kuadrat juga int.",
            "Lambda cetak menerima teks lalu mencetaknya, dan teks adalah string.",
          ],
        },
      ],
    },
    {
      slug: "lin-lambda-closure",
      title: "Lambda dan Closure",
      summary: "Anatomi lambda dari satu ekspresi sampai blok, dan closure yang menangkap variabel di sekitarnya.",
      steps: [
        {
          kind: "theory",
          title: "Dari ekspresi pendek sampai blok penuh",
          body: "Lambda yang kamu tulis selama ini, seperti `x => x * x`, adalah expression lambda: badannya satu ekspresi dan nilai ekspresi itu menjadi nilai kembalian, tanpa kata `return`. Untuk logika lebih panjang ada statement lambda: badannya blok kurung kurawal berisi beberapa pernyataan, dan kalau delegate-nya mengembalikan nilai, wajib ada `return` eksplisit di dalamnya. Parameter lebih dari satu ditulis dalam kurung: `(a, b) => a + b`.\n\nSifat yang lebih penting lagi: lambda bisa menangkap variabel yang ada di sekitarnya. Yang ditangkap adalah variabelnya, bukan salinan nilainya saat lambda dibuat. Jadi bila kamu mengubah variabel itu setelah lambda dibuat, lambda yang berjalan belakangan melihat nilai terbarunya. Pola ini bernama closure, dan sering dipakai untuk membuat predicate yang parameternya fleksibel: satu lambda `x => x >= ambang` bisa dipakai ulang dengan ambang yang berubah.\n\nKarena method LINQ menerima lambda sebagai argumen, closure membuat pipeline data terasa hidup: predicate yang sama bisa mengikuti keadaan terbaru tanpa dibuat ulang. Hati-hatinya satu: jangan menaruh efek samping di dalam lambda yang dipakai LINQ, karena kapan persisnya lambda dipanggil ditentukan oleh operatornya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int ambang = 60;

        Func<int, bool> lulus = x => x >= ambang; // menangkap variabel ambang

        List<int> nilai = new List<int> { 55, 60, 88 };
        Console.WriteLine(string.Join(" ", nilai.Where(lulus))); // 60 88

        ambang = 80; // variabel yang ditangkap ikut berubah
        Console.WriteLine(string.Join(" ", nilai.Where(lulus))); // 88
    }
}`,
            caption: "Lambda melihat nilai terkini ambang saat ia benar-benar dijalankan.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `Func<int, int> duaKali = x => x * 2;`, apa yang terjadi dengan hasil ekspresinya?",
          options: [
            "Hasilnya dibuang karena tidak ada return",
            "Nilai ekspresi dikembalikan secara implisit, seperti ada return",
            "Harus ditulis return eksplisit agar bisa dikompilasi",
            "Hasilnya otomatis dicetak ke layar",
          ],
          answer: 1,
          explanation:
            "Expression lambda mengembalikan nilai ekspresinya tanpa kata return. Kata return eksplisit baru wajib pada statement lambda dengan blok kurung kurawal.",
        },
        {
          kind: "quiz",
          question: "Lambda menangkap variabel `batas` dari sekitarnya. Apa yang terjadi bila `batas` diubah SETELAH lambda dibuat?",
          options: [
            "Lambda tetap memakai nilai lama saat ia dibuat",
            "Lambda memakai nilai terbaru, karena yang ditangkap variabelnya bukan salinannya",
            "Lambda melempar exception saat dipanggil",
            "Kompilasi gagal",
          ],
          answer: 1,
          explanation:
            "Closure menangkap variabel, bukan nilai. Saat lambda dijalankan, ia membaca isi terkini variabel yang ditangkapnya.",
        },
        {
          kind: "code",
          title: "Perbaiki predicate stok",
          prompt:
            "Program membaca `n` nilai stok lalu satu `minimum`, dan seharusnya mencetak stok yang AMAN, yaitu yang nilainya `minimum` ke atas, dipisah spasi. Saat ini hasilnya salah: predicate-nya memilih arah yang terbalik. Perbaiki satu operatornya.",
          mode: "fix",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<int> stok = new List<int>();
        for (int i = 0; i < n; i++)
        {
            stok.Add(Convert.ToInt32(Console.ReadLine()));
        }
        int minimum = Convert.ToInt32(Console.ReadLine());

        Func<int, bool> aman = x => x < minimum;

        Console.WriteLine(string.Join(" ", stok.Where(aman)));
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
        List<int> stok = new List<int>();
        for (int i = 0; i < n; i++)
        {
            stok.Add(Convert.ToInt32(Console.ReadLine()));
        }
        int minimum = Convert.ToInt32(Console.ReadLine());

        Func<int, bool> aman = x => x >= minimum;

        Console.WriteLine(string.Join(" ", stok.Where(aman)));
    }
}`,
          tests: [
            { stdin: "4\n8\n5\n12\n7\n7", expectedOutput: "8 12 7" },
            { stdin: "3\n1\n2\n3\n2", expectedOutput: "2 3" },
            { stdin: "3\n10\n20\n30\n30", expectedOutput: "30", hidden: true },
          ],
          hints: [
            "Jalankan dulu dengan test pertama: yang muncul justru stok di bawah minimum.",
            "Aman berarti nilainya minimum ke atas, termasuk sama dengan minimum.",
            "Ganti operator perbandingan di lambda aman menjadi x >= minimum.",
          ],
        },
      ],
    },
    {
      slug: "lin-groupby-agregat",
      title: "GroupBy Lanjut: Ringkasan per Kelompok",
      summary: "Dari sekadar mengelompokkan menjadi melaporkan: Sum, Count, dan Max untuk setiap grup.",
      steps: [
        {
          kind: "theory",
          title: "Setiap grup adalah koleksi kecil",
          body: "Di modul LINQ inti kamu sudah mengelompokkan data dan menghitung anggotanya dengan `Count()`. Level berikutnya: grup juga bisa diringkas dengan agregasi lain, karena setiap `IGrouping<TKey, TElement>` adalah `IEnumerable<TElement>` utuh. `g.Sum(p => p.Nilai)` menjumlahkan property dari anggota grup itu saja, `g.Max(p => p.Nilai)` mengambil nilai terbesarnya, dan seterusnya. Bentuk yang sama juga tersedia lewat element selector: `GroupBy(k => k.Kategori, p => p.Nilai)` menghasilkan grup yang anggotanya sudah dipetakan ke nilai, jadi ringkasannya tinggal `g.Sum()` tanpa lambda.\n\nKombinasi yang paling sering dibutuhkan untuk laporan: kelompokkan dulu, lalu urutkan grup berdasarkan ringkasannya, misalnya `OrderByDescending(g => g.Sum(...))` untuk papan skor kategori terbesar. Pada LINQ to Objects, grup keluar sesuai urutan kemunculan pertama kuncinya, dan grup yang sudah terbentuk itu ter-buffer: menelusuri satu grup berkali-kali tidak menghitung ulang sumbernya.\n\nDengan dua perkakas ini, pola laporan klasik jadi pendek: `data.GroupBy(kunci).OrderByDescending(ringkasan)` lalu cetak `g.Key` beserta angka ringkasannya. Latihan di bawah memakai pola persis ini pada data transaksi.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Pesanan { public string Kategori; public int Nilai; }

    public static void Main()
    {
        List<Pesanan> data = new List<Pesanan>
        {
            new Pesanan { Kategori = "atk", Nilai = 20 },
            new Pesanan { Kategori = "mainan", Nilai = 50 },
            new Pesanan { Kategori = "atk", Nilai = 30 }
        };

        IEnumerable<IGrouping<string, Pesanan>> grup = data.GroupBy(p => p.Kategori);

        foreach (IGrouping<string, Pesanan> g in grup)
        {
            Console.WriteLine(
                "{0}: {1} pesanan, total {2}",
                g.Key, g.Count(), g.Sum(p => p.Nilai));
        }
    }
}`,
            caption: "atk: 2 pesanan, total 50. mainan: 1 pesanan, total 50.",
          },
        },
        {
          kind: "quiz",
          question: "Pada foreach di atas `foreach (IGrouping<string, Pesanan> g in grup)`, apa yang dilakukan `g.Sum(p => p.Nilai)`?",
          options: [
            "Menjumlahkan Nilai dari seluruh data, bukan hanya satu grup",
            "Menjumlahkan property Nilai dari anggota grup g saja",
            "Menghitung banyaknya grup",
            "Melempar exception karena grup bukan list",
          ],
          answer: 1,
          explanation:
            "g adalah IEnumerable<Pesanan> yang isinya hanya anggota grup itu. Sum dengan lambda menjumlahkan property Nilai dari anggota grup tersebut.",
        },
        {
          kind: "quiz",
          question: "Pada LINQ to Objects, urutan keluar dari `data.GroupBy(k => k.Kategori)` adalah?",
          options: [
            "Alfabetis nama kategori",
            "Urutan kemunculan pertama setiap kunci di sumber",
            "Acak setiap kali dijalankan",
            "Terbalik dari urutan sumber",
          ],
          answer: 1,
          explanation:
            "Kelompok dikeluarkan sesuai urutan kunci pertama kali muncul, dan anggota di dalam grup menjaga urutan asalnya. Bila butuh urutan lain, rantai dengan OrderBy setelahnya.",
        },
        {
          kind: "code",
          title: "Total penjualan per kategori",
          prompt:
            "Program membaca `n` transaksi berbentuk `kategori;nilai`, lalu mencetak total nilai per kategori berbentuk `kategori: total`, sesuai urutan kemunculan pertama kategorinya. Lengkapi dua method yang hilang: pengelompok dan penjumlah.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Transaksi { public string Kategori; public int Nilai; }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Transaksi> data = new List<Transaksi>();
        for (int i = 0; i < n; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            data.Add(new Transaksi { Kategori = b[0], Nilai = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, Transaksi>> grup = data.___(t => t.Kategori);

        foreach (IGrouping<string, Transaksi> g in grup)
        {
            Console.WriteLine("{0}: {1}", g.Key, g.___(t => t.Nilai));
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Transaksi { public string Kategori; public int Nilai; }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Transaksi> data = new List<Transaksi>();
        for (int i = 0; i < n; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            data.Add(new Transaksi { Kategori = b[0], Nilai = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, Transaksi>> grup = data.GroupBy(t => t.Kategori);

        foreach (IGrouping<string, Transaksi> g in grup)
        {
            Console.WriteLine("{0}: {1}", g.Key, g.Sum(t => t.Nilai));
        }
    }
}`,
          tests: [
            { stdin: "4\natk;20\nmainan;50\natk;30\natk;10", expectedOutput: "atk: 60\nmainan: 50" },
            { stdin: "3\nmakan;10\nmakan;5\nmain;7", expectedOutput: "makan: 15\nmain: 7" },
            { stdin: "2\nzeta;1\nalpha;2", expectedOutput: "zeta: 1\nalpha: 2", hidden: true },
          ],
          hints: [
            "Baris pertama yang kosong menyusun data menjadi kelompok berdasarkan kategori.",
            "Baris kedua menjumlahkan satu property dari anggota grup, sama seperti g.Count() tetapi untuk menjumlah.",
            "Jawabannya: GroupBy dan Sum.",
          ],
        },
      ],
    },
    {
      slug: "lin-join-dua-koleksi",
      title: "Join: Menyatukan Dua Koleksi",
      summary: "Pasangkan penjualan dengan produk lewat kuncinya: sintaks Join dan sifat inner join-nya.",
      steps: [
        {
          kind: "theory",
          title: "Dua koleksi, satu kunci",
          body: "Data nyata hampir selalu terpecah menjadi beberapa koleksi: satu list produk, satu list penjualan, dan penghubungnya berupa kunci yang sama, misalnya nama barang. `Join` menyatukannya dalam satu panggilan berempat argumen: koleksi dalam, pemilih kunci dari sumber luar, pemilih kunci dari koleksi dalam, lalu pemilih hasil yang menyusun satu keluaran dari pasangan yang cocok. Bentuknya: `luar.Join(dalam, l => l.Kunci, d => d.Kunci, (l, d) => hasil)`.\n\nSifat pentingnya adalah inner join: hanya pasangan yang kuncinya cocok di kedua sisi yang keluar. Penjualan untuk produk yang tidak ada di daftar akan hilang tanpa suara, dan produk yang tidak pernah dijual juga tidak muncul. Urutan hasil mengikuti sumber luar: tiap elemen luar dikeluarkan berikut semua pasangannya, jadi laporan terbaca stabil.\n\nKalau satu sisi boleh tidak punya pasangan dan tetap harus tampil, itu ranah `GroupJoin` yang menghasilkan grup berisi pasangan atau kosong, di luar cakupan lesson ini. Untuk kasus kedua sisi wajib cocok, `Join` adalah cara yang paling jelas menyatakan maksud, dan di belakang layar LINQ to Objects memakai struktur lookup sehingga efisien untuk koleksi besar.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Produk { public string Nama; public int Harga; }
    class Pesanan { public string Produk; public int Jumlah; }

    public static void Main()
    {
        List<Produk> produk = new List<Produk>
        {
            new Produk { Nama = "buku", Harga = 5000 },
            new Produk { Nama = "pensil", Harga = 2000 }
        };

        List<Pesanan> pesanan = new List<Pesanan>
        {
            new Pesanan { Produk = "pensil", Jumlah = 3 },
            new Pesanan { Produk = "buku", Jumlah = 2 },
            new Pesanan { Produk = "penghapus", Jumlah = 5 } // tak punya produk
        };

        IEnumerable<string> baris = pesanan.Join(
            produk,
            p => p.Produk,   // kunci dari pesanan
            pr => pr.Nama,   // kunci dari produk
            (p, pr) => p.Produk + ": " + p.Jumlah * pr.Harga);

        foreach (string b in baris)
        {
            Console.WriteLine(b);
        }
    }
}`,
            caption: "Penghapus tidak pernah muncul: kuncinya tidak ada di sisi produk.",
          },
        },
        {
          kind: "quiz",
          question: "Penjualan untuk produk yang tidak ada di koleksi produk, apa akibatnya pada `Join`?",
          options: [
            "Muncul dengan harga 0",
            "Melempar KeyNotFoundException",
            "Tidak muncul sama sekali, karena Join adalah inner join",
            "Muncul di akhir urutan",
          ],
          answer: 2,
          explanation:
            "Join hanya mengeluarkan pasangan yang kuncinya cocok di kedua sisi. Elemen tanpa pasangan dijatuhi tanpa pesan, jadi pastikan itu memang yang diinginkan.",
        },
        {
          kind: "quiz",
          question: "Bagaimana urutan hasil `pesanan.Join(produk, ...)`?",
          options: [
            "Mengikuti urutan koleksi dalam, yaitu produk",
            "Diurutkan alfabetis otomatis",
            "Mengikuti urutan sumber luar, yaitu pesanan",
            "Tidak bisa dipastikan",
          ],
          answer: 2,
          explanation:
            "Hasil Join keluar mengikuti urutan sumber luar. Untuk setiap elemen luar, pasangannya dikeluarkan sesuai urutan kemunculannya di koleksi dalam.",
        },
        {
          kind: "code",
          title: "Sambungkan pesanan dengan produk",
          prompt:
            "Daftar produk sudah tersedia. Program membaca `k` pesanan berbentuk `produk;jumlah`, lalu mencetak nilai tiap pesanan berbentuk `produk: harga*jumlah` sesuai urutan pesanan. Lengkapi dua pemilih kunci pada Join.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Produk { public string Nama; public int Harga; }
    class Pesanan { public string Produk; public int Jumlah; }

    public static void Main()
    {
        List<Produk> produk = new List<Produk>
        {
            new Produk { Nama = "buku", Harga = 5000 },
            new Produk { Nama = "pensil", Harga = 2000 },
            new Produk { Nama = "tas", Harga = 25000 }
        };

        int k = Convert.ToInt32(Console.ReadLine());
        List<Pesanan> pesanan = new List<Pesanan>();
        for (int i = 0; i < k; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            pesanan.Add(new Pesanan { Produk = b[0], Jumlah = Convert.ToInt32(b[1]) });
        }

        IEnumerable<string> baris = pesanan.Join(
            produk,
            p => p.___,
            pr => pr.___,
            (p, pr) => p.Produk + ": " + p.Jumlah * pr.Harga);

        foreach (string b in baris)
        {
            Console.WriteLine(b);
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Produk { public string Nama; public int Harga; }
    class Pesanan { public string Produk; public int Jumlah; }

    public static void Main()
    {
        List<Produk> produk = new List<Produk>
        {
            new Produk { Nama = "buku", Harga = 5000 },
            new Produk { Nama = "pensil", Harga = 2000 },
            new Produk { Nama = "tas", Harga = 25000 }
        };

        int k = Convert.ToInt32(Console.ReadLine());
        List<Pesanan> pesanan = new List<Pesanan>();
        for (int i = 0; i < k; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            pesanan.Add(new Pesanan { Produk = b[0], Jumlah = Convert.ToInt32(b[1]) });
        }

        IEnumerable<string> baris = pesanan.Join(
            produk,
            p => p.Produk,
            pr => pr.Nama,
            (p, pr) => p.Produk + ": " + p.Jumlah * pr.Harga);

        foreach (string b in baris)
        {
            Console.WriteLine(b);
        }
    }
}`,
          tests: [
            { stdin: "3\npensil;3\nbuku;2\ntas;1", expectedOutput: "pensil: 6000\nbuku: 10000\ntas: 25000" },
            { stdin: "2\nbuku;4\npulpen;2", expectedOutput: "buku: 20000" },
            { stdin: "1\ntas;2", expectedOutput: "tas: 50000", hidden: true },
          ],
          hints: [
            "Kunci harus merujuk field yang isinya sama di kedua sisi.",
            "Di sisi pesanan field penghubungnya menyimpan nama produk yang dipesan; di sisi produk field penghubungnya adalah namanya.",
            "Jawabannya: Produk dan Nama.",
          ],
        },
      ],
    },
    {
      slug: "lin-aggregate-fold",
      title: "Aggregate: Melipat Koleksi",
      summary: "Satu akumulator, satu elemen per langkah: cara paling umum merangkum koleksi di luar Sum dan Count.",
      steps: [
        {
          kind: "theory",
          title: "Akumulator yang dibawa menelusuri koleksi",
          body: "`Sum` dan `Count` merangkum koleksi dengan cara yang sudah ditentukan. `Aggregate` adalah bentuk umumnya, dikenal juga sebagai fold: ada satu akumulator, lalu koleksi ditelusuri satu elemen demi satu elemen, dan pada setiap langkah lambda menggabungkan isi akumulator dengan elemen saat itu menjadi isi akumulator yang baru. `angka.Aggregate(0, (acc, x) => acc + x)` untuk `{ 5, 7 }` berjalan: 0+5 menjadi 5, lalu 5+7 menjadi 12.\n\nAda dua bentuk panggilan. Dengan seed, seperti di atas, koleksi kosong tetap sah dan menghasilkan nilai seed itu sendiri. Tanpa seed, `kata.Aggregate((a, b) => a + \" \" + b)`, elemen pertama menjadi akumulator awal dan koleksi kosong melempar `InvalidOperationException`. Karena itu bentuk tanpa seed hanya untuk kasus yang dijamin punya isi.\n\nKekuatan sebenarnya: tipe akumulator tidak harus sama dengan tipe elemen. Seed menentukan tipe awal, sehingga dari list string bisa dihasilkan satu kalimat, dari list angka bisa dibangun satu string berformat, atau dihitung nilai terbesar dengan lambda perbandingan. Bila ada method bawaan yang pas seperti `Sum` atau `Max`, pakai yang bawaan; `Aggregate` untuk gabungan yang tidak disediakan.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int[] nilai = { 78, 92, 65 };

        int terbesar = nilai.Aggregate(int.MinValue, (acc, x) => x > acc ? x : acc);
        string ringkas = nilai.Aggregate("nilai", (acc, x) => acc + "|" + x);

        Console.WriteLine(terbesar); // 92
        Console.WriteLine(ringkas);  // nilai|78|92|65
    }
}`,
            caption: "Seed bisa bertipe berbeda dari elemen: int.MinValue untuk mencari maksimum, string untuk merangkai.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `angka.Aggregate(0, (acc, x) => acc + x)` bila `angka` berisi `{ 5, 7 }`?",
          options: ["0", "5", "7", "12"],
          answer: 3,
          explanation:
            "Mulai dari seed 0: langkah pertama 0+5 = 5, langkah kedua 5+7 = 12. Akumulator terakhir itulah hasilnya.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `kata.Aggregate((a, b) => a + \"-\" + b)` bila `kata` kosong?",
          options: [
            "Mengembalikan string kosong",
            "Mengembalikan null",
            "Melempar InvalidOperationException",
            "Mengembalikan \"-\"",
          ],
          answer: 2,
          explanation:
            "Bentuk tanpa seed memakai elemen pertama sebagai akumulator awal, dan pada koleksi kosong tidak ada elemen pertama, jadi ia melempar InvalidOperationException. Bentuk ber-seed aman dan menghasilkan seed-nya.",
        },
        {
          kind: "code",
          title: "Merangkai kata dan menghitung huruf",
          prompt:
            "Program membaca `n` kata, mencetak semuanya digabung dengan tanda minus, lalu mencetak jumlah seluruh huruf. Lengkapi dua bagian Aggregate: nilai awal akumulator dan property yang membaca panjang kata.",
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

        string gabung = kata.Aggregate((a, b) => a + "-" + b);
        int totalHuruf = kata.Aggregate(___, (acc, s) => acc + s.___);

        Console.WriteLine(gabung);
        Console.WriteLine(totalHuruf);
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

        string gabung = kata.Aggregate((a, b) => a + "-" + b);
        int totalHuruf = kata.Aggregate(0, (acc, s) => acc + s.Length);

        Console.WriteLine(gabung);
        Console.WriteLine(totalHuruf);
    }
}`,
          tests: [
            { stdin: "3\nlinq\nlanjut\ndelegasi", expectedOutput: "linq-lanjut-delegasi\n18" },
            { stdin: "2\na\nbb", expectedOutput: "a-bb\n3" },
            { stdin: "1\nsolo", expectedOutput: "solo\n4", hidden: true },
          ],
          hints: [
            "Akumulator penjumlahan dimulai dari nilai netral: apapun ditambah dengannya tetap nilainya.",
            "Panjang sebuah string di C# dibaca lewat property, bukan method, sama seperti di modul string.",
            "Jawabannya: 0 dan Length.",
          ],
        },
      ],
    },
    {
      slug: "lin-multisort-thenby",
      title: "Multi-Sort dengan ThenBy",
      summary: "Urutan bertingkat: kunci utama, pemutus seri, dan jebakan memanggil OrderBy dua kali.",
      steps: [
        {
          kind: "theory",
          title: "Kunci pertama menang, kunci kedua memutus",
          body: "Laporan nyata jarang diurutkan dengan satu kunci: nilainya menurun, dan untuk nilai yang seri urutkan namanya. `ThenBy` dan `ThenByDescending` menempel di belakang `OrderBy` untuk menambah kunci pemutus seri: `data.OrderByDescending(m => m.Nilai).ThenBy(m => m.Nama)` berarti nilai terbesar dulu, dan bila nilainya sama, nama menaik. Tingkatnya bisa ditambah lagi dengan `ThenBy` berikutnya, dibaca sebagai daftar prioritas dari kiri ke kanan.\n\nAda satu jebakan klasik: memanggil `OrderBy` dua kali berurutan. Panggilan kedua mengurutkan ulang seluruh hasil dari awal, sehingga urutan pertama yang sudah dibangun ditimpa habis. `ThenBy` hanya bekerja karena ia tahu urutan sebelumnya; makanya ia hanya sah setelah `OrderBy` atau `ThenBy` lain.\n\nUntuk hasil yang sepenuhnya menentu, pastikan rantai kuncimu sampai pada kunci yang unik, misalnya nama sebagai pemutus terakhir. Pengurutan LINQ sendiri stabil, artinya elemen berkunci sama mempertahankan urutan asal relatifnya, tetapi bergantung pada stabilitas untuk memutus seri membuat laporan sulit diprediksi pembacanya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Murid { public string Nama; public int Kelas; public int Nilai; }

    public static void Main()
    {
        List<Murid> murid = new List<Murid>
        {
            new Murid { Nama = "Budi", Kelas = 11, Nilai = 85 },
            new Murid { Nama = "Ani", Kelas = 12, Nilai = 85 },
            new Murid { Nama = "Citra", Kelas = 11, Nilai = 90 },
            new Murid { Nama = "Dewi", Kelas = 12, Nilai = 80 }
        };

        IEnumerable<Murid> terurut = murid
            .OrderBy(m => m.Kelas)
            .ThenByDescending(m => m.Nilai);

        foreach (Murid m in terurut)
        {
            Console.WriteLine("{0} {1} {2}", m.Nama, m.Kelas, m.Nilai);
        }
    }
}`,
            caption: "Kelas menaik, lalu nilai menurun di dalam kelas yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Apa akibat `data.OrderBy(x => x.A).OrderBy(x => x.B)`?",
          options: [
            "Diurutkan berdasarkan A lalu B seperti ThenBy",
            "Hanya urutan berdasarkan B yang berlaku, urutan A ditimpa",
            "Kompilasi gagal",
            "Diurutkan berdasarkan gabungan A dan B",
          ],
          answer: 1,
          explanation:
            "OrderBy kedua mengurutkan ulang seluruh urutan dari awal, jadi hasil A hilang. Untuk kunci kedua gunakan ThenBy.",
        },
        {
          kind: "quiz",
          question: "Kapan `ThenBy` boleh dipakai?",
          options: [
            "Sebagai method pertama pada koleksi apa pun",
            "Setelah OrderBy, OrderByDescending, atau ThenBy sebelumnya",
            "Hanya pada array",
            "Hanya setelah GroupBy",
          ],
          answer: 1,
          explanation:
            "ThenBy melanjutkan urutan yang sudah ada, jadi ia harus mengikuti OrderBy, OrderByDescending, atau ThenBy lain. Dipanggil duluan ia tidak ada artinya dan tidak dikompilasi.",
        },
        {
          kind: "code",
          title: "Papan skor dua tingkat",
          prompt:
            "Program membaca `n` baris `nama;nilai` lalu mencetak `nama: nilai` dengan nilai terbesar di depan, dan untuk nilai yang sama, nama yang lebih kecil alfabetis duluan. Lengkapi arah pengurutan kunci pertama dan method pemutus serinya.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        string[] baris = new string[n];
        for (int i = 0; i < n; i++)
        {
            baris[i] = Console.ReadLine();
        }

        var skor = baris
            .Select(b => b.Split(';'))
            .Select(b => new { Nama = b[0], Nilai = Convert.ToInt32(b[1]) });

        var terurut = skor
            .OrderBy___(m => m.Nilai)
            .___(m => m.Nama);

        foreach (var m in terurut)
        {
            Console.WriteLine("{0}: {1}", m.Nama, m.Nilai);
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
        string[] baris = new string[n];
        for (int i = 0; i < n; i++)
        {
            baris[i] = Console.ReadLine();
        }

        var skor = baris
            .Select(b => b.Split(';'))
            .Select(b => new { Nama = b[0], Nilai = Convert.ToInt32(b[1]) });

        var terurut = skor
            .OrderByDescending(m => m.Nilai)
            .ThenBy(m => m.Nama);

        foreach (var m in terurut)
        {
            Console.WriteLine("{0}: {1}", m.Nama, m.Nilai);
        }
    }
}`,
          tests: [
            { stdin: "4\nbudi;80\nani;90\ncitra;80\ndewi;70", expectedOutput: "ani: 90\nbudi: 80\ncitra: 80\ndewi: 70" },
            { stdin: "2\nzaki;50\nadi;50", expectedOutput: "adi: 50\nzaki: 50" },
            { stdin: "3\nx;10\ny;10\nw;5", expectedOutput: "x: 10\ny: 10\nw: 5", hidden: true },
          ],
          hints: [
            "Nilai terbesar harus keluar duluan: itu arah menurun pada kunci pertama.",
            "Pemutus seri nama menaik memakai bentuk ThenBy biasa, bukan yang menurun.",
            "Jawabannya: OrderByDescending dan ThenBy.",
          ],
        },
      ],
    },
    {
      slug: "lin-todictionary-tolookup",
      title: "ToDictionary dan ToLookup",
      summary: "Materialisasi koleksi menjadi kamus dan lookup, beserta aturan kunci duplikat dan kunci yang tidak ada.",
      steps: [
        {
          kind: "theory",
          title: "Bangun sekali, akses berkali-kali",
          body: "Query LINQ yang malas kerja ulang setiap enumerasi. Bila hasilnya akan diakses berkali-kali lewat kunci, materialisasikan sekali di awal: `ToDictionary(keySelector, valueSelector)` mengubah urutan menjadi `Dictionary<TKey, TValue>` dalam satu panggilan, dan aksesnya menjadi pencarian langsung. Bentuknya rapi saat dirantai: `baris.Select(b => b.Split(';')).ToDictionary(b => b[0], b => int.Parse(b[1]))` menghasilkan kamus nama ke harga.\n\nAturan mainnya ketat: kunci duplikat melempar `ArgumentException` dan kunci null melempar `ArgumentNullException`. Jadi `ToDictionary` hanya untuk data yang kuncinya dijamin unik. Untuk data yang boleh berbagi kunci, pakai `ToLookup`: hasilnya mirip GroupBy yang langsung jadi, dan keunggulannya justru pada kunci yang tidak ada. `lookup[kunci]` tidak pernah melempar; kunci yang belum terdaftar mengembalikan urutan kosong, sehingga kode pemakai tidak perlu TryGetValue.\n\nSatu kebiasaan yang dijaga: jangan bergantung pada urutan enumerasi `Dictionary`. Akseslah lewat kunci seperti contoh di bawah, atau urutkan dulu bila butuh tampilan berurutan. `Lookup` sendiri menjaga urutan kemunculan kuncinya, mirip perilaku GroupBy.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        string[] baris = { "buku;5000", "pensil;2000" };

        Dictionary<string, int> harga = baris
            .Select(b => b.Split(';'))
            .ToDictionary(b => b[0], b => Convert.ToInt32(b[1]));

        ILookup<char, string> perAwal = baris.ToLookup(b => b[0]);

        Console.WriteLine(harga["pensil"]);      // 2000
        Console.WriteLine(perAwal['b'].Count()); // 1
        Console.WriteLine(perAwal['z'].Count()); // 0, tidak melempar
    }
}`,
            caption: "Kamus untuk kunci unik; lookup untuk kunci yang boleh berulang atau tidak ada.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi bila `ToDictionary` menemukan dua elemen dengan kunci yang sama?",
          options: [
            "Kunci kedua menimpa yang pertama",
            "Melempar ArgumentException",
            "Dua nilai disimpan dalam list di kunci yang sama",
            "Kunci kedua diabaikan diam-diam",
          ],
          answer: 1,
          explanation:
            "Dictionary hanya mengizinkan satu nilai per kunci, dan ToDictionary memilih untuk melempar ArgumentException alih-alih menebak maksudmu. Gunakan ToLookup bila kunci boleh berulang.",
        },
        {
          kind: "quiz",
          question: "Apa hasil `lookup['z']` pada sebuah `ILookup<char, string>` bila tidak ada elemen berawalan z?",
          options: [
            "Melempar KeyNotFoundException",
            "Mengembalikan null",
            "Mengembalikan urutan kosong",
            "Melempar ArgumentException",
          ],
          answer: 2,
          explanation:
            "Indexer pada ILookup selalu mengembalikan IEnumerable, kosong bila kuncinya tidak ada. Itu perbedaan praktisnya dari Dictionary yang melempar KeyNotFoundException.",
        },
        {
          kind: "code",
          title: "Kamus harga dan pencarian cepat",
          prompt:
            "Program membaca `n` baris `barang;harga`, membangun kamusnya sekali dengan ToDictionary, lalu menjawab `q` pertanyaan: cetak harganya, atau `tidak ada` bila barangnya tidak terdaftar. Lengkapi dua method yang hilang.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        string[] baris = new string[n];
        for (int i = 0; i < n; i++)
        {
            baris[i] = Console.ReadLine();
        }

        Dictionary<string, int> harga = baris
            .Select(b => b.Split(';'))
            .___(b => b[0], b => Convert.ToInt32(b[1]));

        int q = Convert.ToInt32(Console.ReadLine());
        for (int i = 0; i < q; i++)
        {
            string cari = Console.ReadLine();
            int nilai;
            if (harga.___(cari, out nilai))
            {
                Console.WriteLine(nilai);
            }
            else
            {
                Console.WriteLine("tidak ada");
            }
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
        string[] baris = new string[n];
        for (int i = 0; i < n; i++)
        {
            baris[i] = Console.ReadLine();
        }

        Dictionary<string, int> harga = baris
            .Select(b => b.Split(';'))
            .ToDictionary(b => b[0], b => Convert.ToInt32(b[1]));

        int q = Convert.ToInt32(Console.ReadLine());
        for (int i = 0; i < q; i++)
        {
            string cari = Console.ReadLine();
            int nilai;
            if (harga.TryGetValue(cari, out nilai))
            {
                Console.WriteLine(nilai);
            }
            else
            {
                Console.WriteLine("tidak ada");
            }
        }
    }
}`,
          tests: [
            {
              stdin: "3\nbuku;5000\npensil;2000\ntas;25000\n3\nbuku\ntopi\ntas",
              expectedOutput: "5000\ntidak ada\n25000",
            },
            { stdin: "2\na;1\nb;2\n2\na\nb", expectedOutput: "1\n2" },
            { stdin: "1\nsatu;11\n1\nsatu", expectedOutput: "11", hidden: true },
          ],
          hints: [
            "Method pertama mengubah urutan hasil Select menjadi Dictionary dalam satu panggilan.",
            "Method kedua memeriksa kunci tanpa melempar exception, hasilnya lewat parameter out.",
            "Jawabannya: ToDictionary dan TryGetValue.",
          ],
        },
      ],
    },
    {
      slug: "lin-deferred-lanjut",
      title: "Deferred Execution Lanjut",
      summary: "Query sebagai rencana hidup: biaya enumerasi ulang, hasil yang berubah diam-diam, dan kapan membekukannya.",
      steps: [
        {
          kind: "theory",
          title: "Rencana yang terus membaca sumber",
          body: "Di modul LINQ inti kamu tahu query baru berjalan saat dienumerasi. Level lanjutnya: setiap enumerasi adalah eksekusi penuh. Pipeline `Where` di atas list yang berubah membaca list apa adanya setiap kali dienumerasi, jadi dua enumerasi bisa menghasilkan dua keluaran berbeda bila sumbernya ikut berubah di antaranya. Query seperti ini terasa hidup: cocok untuk laporan yang memang harus mengikuti data terbaru, berbahaya bila kamu menganggapnya snapshot.\n\nKonsekuensi biayanya nyata. Pipeline panjang yang dienumerasi tiga kali menyaring dan memetakan tiga kali. Pola cek-berdua juga berisiko: `query.Count() > 0` lalu `foreach (query)` adalah dua eksekusi, dan bila sumber berubah di antaranya, jumlah dan isinya bisa tidak konsisten. Solusinya satu kata: materialisasi. `ToList()` atau `ToArray()` menjalankan pipeline sekali dan membekukan hasilnya; dari situ kamu bisa menghitung dan menelusuri sepuasnya tanpa kerja ulang.\n\nTidak semua operator malas dengan cara yang sama. Operator agregasi seperti `Count()` dan `Sum()` berjalan segera saat dipanggil karena butuh jawabannya saat itu. Pada LINQ to Objects, `GroupBy` juga segera membangun seluruh kelompoknya ke dalam struktur lookup saat dipanggil, sehingga perubahan sumber setelahnya tidak mengubah kelompok yang sudah ada; berbeda dengan `Where` murni yang tetap membaca sumber terkini.\n\nKonsekuensi terakhir menyangkut isi lambda: karena jumlah pemanggilan selector tidak kamu kendalikan, jangan menaruh efek samping di dalamnya, seperti mencetak atau mengubah variabel. Selector yang murni membuat perilaku query bisa dipindah-pindah, dibungkus ToList, atau dienumerasi ulang tanpa kejutan.",
        },
        {
          kind: "quiz",
          question: "Perhatikan kode berikut:\n\n```csharp\nList<int> s = new List<int> { 1 };\nIEnumerable<int> q = s.Where(x => x > 0);\ns.Add(2);\n// enumerasi pertama\ns.Add(3);\n// enumerasi kedua\n```\n\nApa isi enumerasi kedua?",
          options: ["1", "1 2", "1 2 3", "Melempar exception"],
          answer: 2,
          explanation:
            "Query Where malas dan terus membaca sumber saat enumerasi. Elemen 3 ditambahkan sebelum enumerasi kedua, jadi ikut terhitung: 1 2 3.",
        },
        {
          kind: "quiz",
          question: "Cara paling tepat menjalankan pipeline yang mahal SEKALI saja lalu memakai hasilnya berkali-kali adalah?",
          options: [
            "Menyimpan IEnumerable-nya dan berhati-hati mengenumerasi hanya sekali",
            "Memanggil ToList() atau ToArray() agar pipeline berjalan sekali dan hasilnya beku",
            "Menambahkan komentar agar compiler mengoptimalkan",
            "Mengurutkan dulu dengan OrderBy",
          ],
          answer: 1,
          explanation:
            "Materialisasi dengan ToList atau ToArray mengeksekusi pipeline satu kali dan menyimpan hasilnya. Setiap enumerasi IEnumerable yang malas justru menjalankan ulang seluruh pipeline.",
        },
        {
          kind: "quiz",
          question: "Mengapa efek samping seperti Console.WriteLine sebaiknya tidak ditaruh di dalam selector LINQ?",
          options: [
            "Karena compiler melarangnya",
            "Karena jumlah dan waktu pemanggilan selector ditentukan operatornya, jadi keluarannya tidak bisa diprediksi",
            "Karena membuat query lebih lambat sepuluh kali",
            "Karena selector hanya boleh mengembalikan bool",
          ],
          answer: 1,
          explanation:
            "Deferred execution membuat waktu pemanggilan lambda bergantung pada kapan dan berapa kali query dienumerasi. Selector yang murni membuat perilakunya aman diubah-ubah bentuknya.",
        },
      ],
    },
    {
      slug: "lin-pipeline-komposisi",
      title: "Komposisi Pipeline Data",
      summary: "Saring, kelompokkan, urutkan, bentuk: merangkai tahap LINQ menjadi satu pipeline yang terbaca.",
      steps: [
        {
          kind: "theory",
          title: "Empat tahap, satu rantai",
          body: "Pipeline data punya bentuk yang berulang: saring yang tidak relevan, kelompokkan sisanya, urutkan kelompoknya, lalu bentuk keluarannya. Setiap tahap LINQ mengembalikan `IEnumerable`, sehingga semuanya bisa dirantai dan dibaca dari atas ke bawah seperti resep. Satu kebiasaan yang menjaga keterbacaan: satu baris rantai untuk satu tujuan, dan bila syarat penyaringnya panjang, beri nama sebagai `Func<T, bool>` terpisah, lalu pasang ke `Where`. Lambda bernama seperti itu bisa dipakai ulang antar pipeline dan query terbaca seperti kalimat.\n\nPola laporan per kelompok dari lesson sebelumnya menjadi blok bangunan utama di sini: `GroupBy` menghasilkan grup, `OrderByDescending(g => ringkasan)` menyusun papan skor, dan `ThenBy(g => g.Key)` menjamin urutan yang menentu bila ringkasannya seri. Proyeksi terakhir dengan `Select(g => ...)` mengubah grup menjadi bentuk yang siap dicetak, sehingga foreach di ujung tinggal menampilkan string.\n\nIngat juga urutan penulisan bukan urutan eksekusi: seluruh rantai baru berjalan saat foreach menarik elemennya. Itu bukan alasan untuk takut, hanya alasan untuk tetap menjaga selector tetap murni dan mewujudkan hasil dengan ToList bila pipeline mahal atau dipakai lebih dari sekali.",
          code: {
            language: "csharp",
            content: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Transaksi { public string Kategori; public int Nilai; }

    public static void Main()
    {
        List<Transaksi> data = new List<Transaksi>
        {
            new Transaksi { Kategori = "a", Nilai = 15 },
            new Transaksi { Kategori = "b", Nilai = 12 },
            new Transaksi { Kategori = "a", Nilai = 10 }
        };

        Func<Transaksi, bool> layak = t => t.Nilai >= 10;

        IEnumerable<string> laporan = data
            .Where(layak)
            .GroupBy(t => t.Kategori)
            .OrderByDescending(g => g.Sum(t => t.Nilai))
            .Select(g => g.Key + ": " + g.Sum(t => t.Nilai));

        foreach (string b in laporan)
        {
            Console.WriteLine(b); // a: 25, b: 12
        }
    }
}`,
            caption: "Predicate bernama layak dipasang ke Where: pipeline terbaca, logikanya bisa dipakai ulang.",
          },
        },
        {
          kind: "quiz",
          question: "Apa untung menaruh predicate panjang ke variabel `Func<Transaksi, bool>` sebelum dipasang ke Where?",
          options: [
            "Query menjadi berjalan lebih cepat",
            "Query lebih terbaca dan predicate bisa dipakai ulang, tanpa mengubah perilakunya",
            "Mengubah query dari malas menjadi segera",
            "Menghindari deferred execution",
          ],
          answer: 1,
          explanation:
            "Menamai logika tidak mengubah mekanisme eksekusinya sama sekali. Manfaatnya murni keterbacaan dan pemakaian ulang, dan itu penting di pipeline panjang.",
        },
        {
          kind: "code",
          title: "Laporan kategori dengan papan skor",
          prompt:
            "Program membaca `n` transaksi `kategori;nilai`. Buang yang nilainya di bawah 10, lalu cetak total per kategori berbentuk `kategori: total`, terbesar dulu, dan bila seri, kategori yang lebih kecil alfabetis duluan. Lengkapi tiga method yang hilang.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Transaksi { public string Kategori; public int Nilai; }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Transaksi> data = new List<Transaksi>();
        for (int i = 0; i < n; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            data.Add(new Transaksi { Kategori = b[0], Nilai = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, Transaksi>> terurut = data
            .___(t => t.Nilai >= 10)
            .GroupBy(t => t.Kategori)
            .___(g => g.Sum(t => t.Nilai))
            .___(g => g.Key);

        foreach (IGrouping<string, Transaksi> g in terurut)
        {
            Console.WriteLine("{0}: {1}", g.Key, g.Sum(t => t.Nilai));
        }
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Transaksi { public string Kategori; public int Nilai; }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        List<Transaksi> data = new List<Transaksi>();
        for (int i = 0; i < n; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            data.Add(new Transaksi { Kategori = b[0], Nilai = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, Transaksi>> terurut = data
            .Where(t => t.Nilai >= 10)
            .GroupBy(t => t.Kategori)
            .OrderByDescending(g => g.Sum(t => t.Nilai))
            .ThenBy(g => g.Key);

        foreach (IGrouping<string, Transaksi> g in terurut)
        {
            Console.WriteLine("{0}: {1}", g.Key, g.Sum(t => t.Nilai));
        }
    }
}`,
          tests: [
            {
              stdin: "5\nelektronik;20\nbuku;5\nelektronik;30\nbuku;50\nmainan;15",
              expectedOutput: "buku: 50\nelektronik: 50\nmainan: 15",
            },
            { stdin: "3\nmakanan;10\nmakanan;10\nminuman;25", expectedOutput: "minuman: 25\nmakanan: 20" },
            { stdin: "3\nalat;9\nalat;30\nobeng;30", expectedOutput: "alat: 30\nobeng: 30", hidden: true },
          ],
          hints: [
            "Tahap pertama menyaring baris yang nilainya kurang dari 10.",
            "Tahap ketiga menyusun total terbesar di depan; tahap terakhir hanya pemutus seri alfabetis.",
            "Jawabannya: Where, OrderByDescending, dan ThenBy.",
          ],
        },
      ],
    },
    {
      slug: "lin-latihan-dashboard",
      title: "Latihan Gabungan: Dashboard Penjualan",
      summary: "Join, GroupBy, agregat, dan multi-sort bekerja satu rantai untuk melaporkan pendapatan per kategori.",
      steps: [
        {
          kind: "theory",
          title: "Merancang laporan dari dua sumber",
          body: "Penutup modul menyatukan semua yang kamu bangun. Datanya dua koleksi: produk berisi `nama;kategori;harga`, dan penjualan berisi `nama;jumlah`. Yang dilaporkan: pendapatan per kategori, terbesar dulu, pemutus serinya nama kategori, ditutup total keseluruhan. Rencana pipeline-nya empat langkah: pasangkan tiap penjualan dengan produknya lewat Join, proyeksikan menjadi pasangan kategori dan pendapatan, kelompokkan per kategori dengan pendapatan sebagai isi grup, lalu urutkan grup berdasarkan totalnya.\n\nDua detail yang menentukan benar tidaknya laporan. Pertama, Join adalah inner join: penjualan untuk nama produk yang tidak terdaftar dijatuhi dan tidak menyumbang apa pun, dan itu perilaku yang diinginkan laporan ini. Kedua, pendapatan dihitung dengan `(long)jumlah * harga` sebelum dikalikan: kuadrat perkalian produk harga bisa melampaui batas int, dan mengubah ke long setelah perkalian berarti terlambat.\n\nKelompok hasil Join dipetakan dulu menjadi nilai pendapatan lewat element selector `GroupBy(x => x.Kategori, x => x.Pendapatan)`, sehingga ringkasannya tinggal `g.Sum()`. Semua potongan ini pernah kamu latih satu per satu; tugas lesson ini merangkainya tanpa mengubah satu pun perilakunya.",
          code: {
            language: "csharp",
            content: `// baris produk   : nama;kategori;harga
// baris penjualan: nama;jumlah
// pendapatan     = jumlah * harga per penjualan yang cocok
// keluaran       : "<kategori>: <total>" terbesar dulu, seri dipecah nama kategori
// penutup        : "Total: <total keseluruhan>"`,
            caption: "Empat kontrak dashboard yang kamu bangun di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Bangun dashboard pendapatan",
          prompt:
            "Lengkapi tiga method yang hilang: penyambung dua koleksi, pengurut total terbesar, dan pemutus seri nama kategori. Penjualan yang produknya tidak terdaftar harus terbuang oleh inner join.",
          mode: "fill",
          template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Produk { public string Nama; public string Kategori; public int Harga; }
    class Penjualan { public string Nama; public int Jumlah; }
    class BarisPenjualan { public string Kategori; public long Pendapatan; }

    public static void Main()
    {
        int m = Convert.ToInt32(Console.ReadLine());
        List<Produk> produk = new List<Produk>();
        for (int i = 0; i < m; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            produk.Add(new Produk { Nama = b[0], Kategori = b[1], Harga = Convert.ToInt32(b[2]) });
        }

        int k = Convert.ToInt32(Console.ReadLine());
        List<Penjualan> penjualan = new List<Penjualan>();
        for (int i = 0; i < k; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            penjualan.Add(new Penjualan { Nama = b[0], Jumlah = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, long>> perKategori = penjualan
            .___(
                produk,
                j => j.Nama,
                p => p.Nama,
                (j, p) => new BarisPenjualan
                {
                    Kategori = p.Kategori,
                    Pendapatan = (long)j.Jumlah * p.Harga
                })
            .GroupBy(b => b.Kategori, b => b.Pendapatan);

        long total = 0;
        foreach (IGrouping<string, long> g in perKategori
            .___(gr => gr.Sum())
            .___(gr => gr.Key))
        {
            total += g.Sum();
            Console.WriteLine("{0}: {1}", g.Key, g.Sum());
        }
        Console.WriteLine("Total: {0}", total);
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    class Produk { public string Nama; public string Kategori; public int Harga; }
    class Penjualan { public string Nama; public int Jumlah; }
    class BarisPenjualan { public string Kategori; public long Pendapatan; }

    public static void Main()
    {
        int m = Convert.ToInt32(Console.ReadLine());
        List<Produk> produk = new List<Produk>();
        for (int i = 0; i < m; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            produk.Add(new Produk { Nama = b[0], Kategori = b[1], Harga = Convert.ToInt32(b[2]) });
        }

        int k = Convert.ToInt32(Console.ReadLine());
        List<Penjualan> penjualan = new List<Penjualan>();
        for (int i = 0; i < k; i++)
        {
            string[] b = Console.ReadLine().Split(';');
            penjualan.Add(new Penjualan { Nama = b[0], Jumlah = Convert.ToInt32(b[1]) });
        }

        IEnumerable<IGrouping<string, long>> perKategori = penjualan
            .Join(
                produk,
                j => j.Nama,
                p => p.Nama,
                (j, p) => new BarisPenjualan
                {
                    Kategori = p.Kategori,
                    Pendapatan = (long)j.Jumlah * p.Harga
                })
            .GroupBy(b => b.Kategori, b => b.Pendapatan);

        long total = 0;
        foreach (IGrouping<string, long> g in perKategori
            .OrderByDescending(gr => gr.Sum())
            .ThenBy(gr => gr.Key))
        {
            total += g.Sum();
            Console.WriteLine("{0}: {1}", g.Key, g.Sum());
        }
        Console.WriteLine("Total: {0}", total);
    }
}`,
          tests: [
            {
              stdin: "3\nbuku;atk;5000\npensil;atk;2000\ntas;fashion;25000\n4\nbuku;2\npensil;3\ntas;1\nbuku;1",
              expectedOutput: "fashion: 25000\natk: 21000\nTotal: 46000",
            },
            {
              stdin: "3\na;c1;10\nb;c2;20\nc;c1;30\n3\na;2\nb;1\nz;5",
              expectedOutput: "c1: 20\nc2: 20\nTotal: 40",
            },
            {
              stdin: "1\nx;k1;7\n1\nx;3",
              expectedOutput: "k1: 21\nTotal: 21",
              hidden: true,
            },
          ],
          hints: [
            "Bagian pertama menyatukan penjualan dengan produk berdasarkan nama yang cocok.",
            "Dua bagian terakhir menyusun grup: total terbesar dulu, lalu nama kategori menaik untuk yang seri.",
            "Jawabannya: Join, OrderByDescending, dan ThenBy.",
          ],
        },
        {
          kind: "quiz",
          question: "Pada test kedua ada penjualan `z;5` padahal produk z tidak terdaftar. Mengapa keluarannya tetap rapi tanpa baris untuk z?",
          options: [
            "Join memasangkan z dengan produk pertama secara default",
            "Join adalah inner join: penjualan tanpa pasangan produk dijatuhi tanpa pesan",
            "Program melewatkannya karena jumlahnya 5",
            "Z sebenarnya masuk ke total",
          ],
          answer: 1,
          explanation:
            "Inner join hanya mengeluarkan pasangan yang kuncinya cocok di kedua sisi. Penjualan tanpa produk tidak menyumbang ke grup maupun total, dan itu memang kontrak laporan ini.",
        },
      ],
    },
    // ==================== MODUL 7: Async dan Task ====================
    {
      slug: "asy-konsep-async",
      title: "Async: Masalah yang Dijawabnya",
      summary: "Sinkron menunggu, async mengerjakan yang lain selagi menunggu: kapan async berharga dan apa itu blocking.",
      steps: [
        {
          kind: "theory",
          title: "Thread yang menunggu vs thread yang bebas",
          body: "Model eksekusi yang selama ini kamu tulis adalah sinkron: baris berikut baru jalan setelah baris ini selesai. Untuk menghitung, itu wajar, hasilnya memang dibutuhkan. Masalah muncul saat baris itu menunggu sesuatu dari luar program: respons jaringan, baca file, query database. Di situ thread tidak menghitung apa pun, ia hanya berdiri menunggu; keadaan itu disebut blocking, dan pada server yang melayani banyak permintaan, thread yang terblokir adalah thread yang tidak bisa melayani siapa pun.\n\nAsync menawarkan pembagian kerja yang lain: mulai operasinya, terima janji bahwa hasilnya akan datang, lalu lanjutkan pekerjaan berikutnya. Janji itu di C# bernama `Task`. Kata kunci `await` menandai titik di mana kamu benar-benar butuh hasilnya: eksekusi method tergantung di sana tanpa menahan thread, dan sisa method berjalan otomatis saat hasil tiba. Perlu jelas sejak awal: async membuat program yang banyak menunggu menjadi efisien, tetapi tidak membuat perhitungan berat selesai lebih cepat; untuk itu dibutuhkan paralel, yang memang dibahas di lesson berikut dengan `Task.Run`.\n\nDi latihan platform ini tidak ada jaringan atau file nyata yang bisa ditunggu, jadi mekanik async dilatih dengan komputasi kecil yang hasilnya pasti. Polanya identik dengan kasus nyata: titipkan pekerjaan, dapatkan Task, tunggu di titik yang tepat, baca hasilnya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static int HitungJumlah(int n)
    {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }

    public static void Main()
    {
        // Main tidak berhenti di baris berikut: ia langsung lanjut
        Task<int> a = Task.Run(() => HitungJumlah(50000));
        Task<int> b = Task.Run(() => HitungJumlah(40000));

        Console.WriteLine("Dua pekerjaan sudah dititipkan");

        Task.WaitAll(a, b); // titik tunggu: sampai di sini saja
        Console.WriteLine("Hasil: {0} dan {1}", a.Result, b.Result);
    }
}`,
            caption: "Hasil: 1250025000 dan 800020000. Main bekerja dulu, menunggu hanya di WaitAll.",
          },
        },
        {
          kind: "quiz",
          question: "Situasi mana yang paling diuntungkan oleh async?",
          options: [
            "Program yang menghabiskan waktunya di perhitungan berat",
            "Program yang banyak menunggu: jaringan, disk, atau sumber luar lainnya",
            "Program kecil yang selesai dalam milidetik",
            "Semua program otomatis dua kali lebih cepat dengan async",
          ],
          answer: 1,
          explanation:
            "Async bersinar saat thread menunggu pekerjaan luar, karena selama menunggu ia bisa melayani yang lain. Perhitungan berat tidak lebih cepat oleh async; itu ranah paralelisme.",
        },
        {
          kind: "quiz",
          question: "Apa arti pemanggilan yang bersifat blocking?",
          options: [
            "Pemanggilan yang melempar exception",
            "Thread berhenti mengerjakan apa pun dan hanya menunggu sampai operasi selesai",
            "Pemanggilan yang butuh parameter banyak",
            "Program menjadi lambat secara permanen",
          ],
          answer: 1,
          explanation:
            "Blocking berarti thread ditahan sampai operasinya selesai; selama itu ia tidak bisa melakukan kerja lain. await menghindari ini dengan menyerahkan kontrol kembali.",
        },
      ],
    },
    {
      slug: "asy-task-dan-taskrun",
      title: "Task dan Task.Run",
      summary: "Menitipkan pekerjaan ke thread pool dengan Task.Run, membedakan Task dan Task<T>, dan menunggu dengan WaitAll.",
      steps: [
        {
          kind: "theory",
          title: "Janji pekerjaan yang bisa ditunggu",
          body: "`Task` adalah objek yang mewakili pekerjaan yang sedang atau akan selesai. `Task` polos hanya mengabarkan selesai atau gagal, sedangkan `Task<T>` membawa hasil bertipe T. `Task.Run(...)` menitipkan delegasi ke thread pool, yaitu kumpulan thread kerja milik runtime: barisnya kembali seketika, dan delegasimu berjalan di thread lain. Isinya lambda tanpa kembalian untuk `Task`, atau lambda yang mengembalikan nilai untuk `Task<T>`.\n\nMenunggu hasilnya ada beberapa cara, dan yang paling lugas untuk beberapa task sekaligus adalah `Task.WaitAll(t1, t2)`: pemanggil menunggu sampai semuanya selesai. Setelah itu, `task.Result` memberi nilai tanpa menunggu lagi. Kebalikannya juga benar dan perlu diwaspadai: membaca `Result` pada task yang belum selesai otomatis menunggu. Untuk program kecil itu tidak masalah, tetapi kebiasaan yang baik adalah menunggu secara eksplisit dulu, lalu membaca hasil, supaya titik tunggunya terlihat di kode.\n\nUntuk latihan di platform ini urutan tunggu itu bukan sekadar gaya, melainkan syarat keluaran yang pasti: hasil hanya boleh dicetak SETELAH semua task selesai. Selama aturan itu dipegang, kapan persisnya thread pool menjalankan delegasimu tidak memengaruhi keluaran sedikit pun.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        Task sapa = Task.Run(() => Console.WriteLine("kerja tanpa hasil"));
        Task<int> hitung = Task.Run(() => 6 * 7);

        Task.WaitAll(sapa, hitung); // tunggu keduanya
        Console.WriteLine(hitung.Result); // 42
    }
}`,
            caption: "Task tanpa hasil untuk aksi, Task<T> untuk perhitungan yang membawa nilai.",
          },
        },
        {
          kind: "quiz",
          question: "Apa beda `Task` dan `Task<int>`?",
          options: [
            "Task<int> berjalan lebih cepat",
            "Task<int> membawa hasil bertipe int setelah selesai; Task hanya menandai selesai atau gagal",
            "Task tidak bisa dibuat dengan Task.Run",
            "Task<int> tidak bisa menunggu",
          ],
          answer: 1,
          explanation:
            "Task<T> adalah versi berparameter yang menyimpan hasil bertipe T, dibaca lewat Result atau await. Task polos untuk aksi yang tidak mengembalikan apa pun.",
        },
        {
          kind: "quiz",
          question: "Membaca `task.Result` pada task yang masih berjalan akan?",
          options: [
            "Melempar InvalidOperationException",
            "Mengembalikan nilai default tanpa menunggu",
            "Membuat pemanggil menunggu sampai task selesai",
            "Membatalkan task",
          ],
          answer: 2,
          explanation:
            "Result menunggu bila tasknya belum selesai, yang berarti blocking. Karena itu titik tunggu lebih baik dinyatakan eksplisit lewat WaitAll atau await.",
        },
        {
          kind: "code",
          title: "Dua hitungan berjalan bersamaan",
          prompt:
            "Lengkapi tiga bagian: cara menitipkan lambda kedua ke thread pool, cara menunggu kedua task selesai, dan cara membaca hasil task kedua. Kedua task menghitung jumlah 1 sampai batasnya.",
          mode: "fill",
          template: `using System;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        int a = Convert.ToInt32(Console.ReadLine());
        int b = Convert.ToInt32(Console.ReadLine());

        Task<int> hitungA = Task.Run(() =>
        {
            int total = 0;
            for (int i = 1; i <= a; i++) total += i;
            return total;
        });

        Task<int> hitungB = Task.___(() =>
        {
            int total = 0;
            for (int i = 1; i <= b; i++) total += i;
            return total;
        });

        Task.___(hitungA, hitungB);

        Console.WriteLine("A: {0}", hitungA.Result);
        Console.WriteLine("B: {0}", hitungB.Result);
        Console.WriteLine("Total: {0}", hitungA.Result + hitungB.___);
    }
}`,
          solution: `using System;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        int a = Convert.ToInt32(Console.ReadLine());
        int b = Convert.ToInt32(Console.ReadLine());

        Task<int> hitungA = Task.Run(() =>
        {
            int total = 0;
            for (int i = 1; i <= a; i++) total += i;
            return total;
        });

        Task<int> hitungB = Task.Run(() =>
        {
            int total = 0;
            for (int i = 1; i <= b; i++) total += i;
            return total;
        });

        Task.WaitAll(hitungA, hitungB);

        Console.WriteLine("A: {0}", hitungA.Result);
        Console.WriteLine("B: {0}", hitungB.Result);
        Console.WriteLine("Total: {0}", hitungA.Result + hitungB.Result);
    }
}`,
          tests: [
            { stdin: "10\n5", expectedOutput: "A: 55\nB: 15\nTotal: 70" },
            { stdin: "1\n1", expectedOutput: "A: 1\nB: 1\nTotal: 2" },
            { stdin: "100\n50", expectedOutput: "A: 5050\nB: 1275\nTotal: 6325", hidden: true },
          ],
          hints: [
            "Lambda pertama sudah menunjukkan caranya: method statis milik Task yang menerima delegasi.",
            "Method yang menunggu beberapa task sekaligus menerima keduanya sebagai argumen.",
            "Jawabannya: Task.Run, Task.WaitAll, dan hitungB.Result.",
          ],
        },
      ],
    },
    {
      slug: "asy-async-await-dasar",
      title: "async dan await",
      summary: "Tandai method async, serahkan kontrol di titik await, dan jalankan kembali otomatis saat hasil tiba.",
      steps: [
        {
          kind: "theory",
          title: "Tunggu tanpa menahan",
          body: "Kata kunci `async` ditempel pada deklarasi method untuk memperbolehkan `await` di dalam tubuhnya. Saat `await task` dijalankan pada task yang belum selesai, method berhenti di titik itu, sisanya dicatat sebagai kelanjutan, dan kontrol kembali ke pemanggil. Thread tidak diam menunggu. Ketika task selesai, kelanjutan itu dijalankan otomatis, seolah sisa method dilanjutkan dari baris setelah await. Bila ternyata task sudah selesai sejak awal, eksekusi langsung melaju tanpa penundaan.\n\nMethod async mengembalikan `Task`, `Task<T>`, atau `void`, dan yang void hanya wajar untuk event handler; jebakannya dibahas di lesson khusus. Konvensi penamaannya diberi akhiran `Async` supaya pemanggil tahu method ini sebaiknya di-await. Untuk program console klasik di C# 5, `Main` tidak boleh async, jadi polanya: panggil method async, dapatkan Task-nya, lalu tunggu dari dunia sinkron dengan `Wait()` atau `GetAwaiter().GetResult()`. Versi C# yang lebih baru (sejak 7.1) akhirnya mengizinkan `Main` bertipe `async Task`, tetapi pola jembatan ini tetap sering dijumpai di kode lama.\n\nUntuk mencoba mekaniknya tanpa I/O nyata ada `Task.Delay(waktu)`: menghasilkan task yang selesai setelah waktu itu, tanpa memblokir thread apa pun. Itu pasangan aman dari `Thread.Sleep` yang benar-benar menahan thread. Pada materi ini Task.Delay dipakai di teori saja, karena keluaran program yang bergantung pada waktu nyata tidak bisa dijamin pasti di setiap mesin.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task<int> HitungSambilTungguAsync()
    {
        Task tunda = Task.Delay(50);
        int total = 0;
        for (int i = 1; i <= 100; i++) total += i;
        await tunda; // berhenti di sini, thread bebas
        return total;
    }

    public static void Main()
    {
        Task<int> t = HitungSambilTungguAsync();
        Console.WriteLine("Method async sudah berjalan");
        t.Wait(); // jembatan dari dunia sinkron (C# 5)
        Console.WriteLine(t.Result); // 5050
    }
}`,
            caption: "Penghitungan jalan selagi tunda berjalan; await baru menahan alur methodnya.",
          },
        },
        {
          kind: "quiz",
          question: "Saat `await task` dijalankan dan tasknya belum selesai, apa yang terjadi?",
          options: [
            "Thread memutar dan menunggu sampai task selesai",
            "Method berhenti di titik itu, kontrol kembali ke pemanggil, dan sisanya berjalan otomatis saat task selesai",
            "Tasknya dibatalkan dan method lanjut",
            "Program langsung berhenti",
          ],
          answer: 1,
          explanation:
            "Itulah inti await: method tergantung di titik itu tanpa menahan thread, kontrol kembali ke pemanggil, dan sisa method disusun sebagai kelanjutan yang jalan saat task selesai.",
        },
        {
          kind: "quiz",
          question: "Apa beda `Task.Delay(1000)` dan `Thread.Sleep(1000)`?",
          options: [
            "Tidak ada, keduanya identik",
            "Task.Delay mengembalikan Task dan tidak memblokir thread; Thread.Sleep menahan thread sampai waktunya habis",
            "Thread.Sleep mengembalikan Task",
            "Task.Delay hanya bisa dipakai di Main",
          ],
          answer: 1,
          explanation:
            "Thread.Sleep adalah blocking murni. Task.Delay menghasilkan Task yang bisa di-await, sehingga selama menunggu thread bebas mengerjakan hal lain.",
        },
      ],
    },
    {
      slug: "asy-task-t-hasil",
      title: "Method Async yang Mengembalikan Hasil",
      summary: "async Task<T> dengan return biasa, await yang memberi nilai langsung, dan jembatan pemanggil sinkron.",
      steps: [
        {
          kind: "theory",
          title: "Return biasa, hasil yang di-await",
          body: "Method async yang bertipe `Task<T>` cukup menulis `return nilai` biasa di dalamnya; compiler membungkusnya menjadi task yang membawa nilai itu. Pemanggil yang meng-await menerima T langsung, bukan Task-nya: `int hasil = await HitungAsync();`. Perbedaan posisi menentukan yang mana yang kamu pegang: sebelum await kamu memegang `Task<T>` yang bisa dikirim-keliling, dan setelah await kamu memegang hasilnya.\n\nDi program console C# 5, `Main` tidak bisa async, sehingga pemanggilan dari Main memakai jembatan: simpan tasknya, tunggu dengan `Wait()`, lalu baca `Result`. Urutan simpan dulu, tunggu belakangan memungkinkan kamu memulai beberapa task sebelum menunggu semuanya, fondasi pola paralel sederhana. Alternatif jembatannya `GetAwaiter().GetResult()` yang menghasilkan exception asli tanpa pembungusan, dibahas lebih lanjut di lesson jebakan Result.\n\nMethod async juga boleh memanggil method async lain dengan await, dan begitulah pipeline async tersusun: satu await per lapis, masing-masing menunggu bagian yang memang butuh hasilnya. Dan karena exception yang lewat await tetap mengalir ke pemanggil, penanganan kegagalannya menyatu dengan try/catch yang sudah kamu kuasai, yang jadi pokok lesson berikutnya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task<int> FaktorialAsync(int n)
    {
        return await Task.Run(() =>
        {
            int hasil = 1;
            for (int i = 2; i <= n; i++) hasil *= i;
            return hasil;
        });
    }

    public static void Main()
    {
        Task<int> t = FaktorialAsync(6);
        Console.WriteLine("Menghitung...");
        t.Wait();
        Console.WriteLine(t.Result); // 720
    }
}`,
            caption: "Sebelum Wait kamu memegang Task<int>; setelahnya Result berisi 720.",
          },
        },
        {
          kind: "quiz",
          question: "Pemanggil menulis `int hasil = await HitungAsync();`. Apa tipe `hasil`?",
          options: [
            "Task<int>",
            "Task",
            "int, karena await mengeluarkan isi Task<T>",
            "void",
          ],
          answer: 2,
          explanation:
            "await pada Task<T> menghasilkan nilainya langsung. Yang bertipe Task<int> adalah nilai kembalian method sebelum di-await.",
        },
        {
          kind: "code",
          title: "Faktorial lewat task",
          prompt:
            "Lengkapi tiga bagian: kata kunci yang membolehkan await di dalam method, kata kunci penunggu di depan Task.Run, dan cara menunggu task dari Main. Program membaca satu bilangan `n` (0 sampai 12) dan mencetak faktorialnya.",
          mode: "fill",
          template: `using System;
using System.Threading.Tasks;

public class Program
{
    static ___ Task<int> FaktorialAsync(int n)
    {
        return ___ Task.Run(() =>
        {
            int hasil = 1;
            for (int i = 2; i <= n; i++) hasil *= i;
            return hasil;
        });
    }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        Task<int> t = FaktorialAsync(n);
        t.___();
        Console.WriteLine(t.Result);
    }
}`,
          solution: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task<int> FaktorialAsync(int n)
    {
        return await Task.Run(() =>
        {
            int hasil = 1;
            for (int i = 2; i <= n; i++) hasil *= i;
            return hasil;
        });
    }

    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        Task<int> t = FaktorialAsync(n);
        t.Wait();
        Console.WriteLine(t.Result);
    }
}`,
          tests: [
            { stdin: "5", expectedOutput: "120" },
            { stdin: "7", expectedOutput: "5040" },
            { stdin: "12", expectedOutput: "479001600", hidden: true },
          ],
          hints: [
            "Dua kata kunci pertama adalah pasangan yang selalu bersama: satu pada deklarasi method, satu di depan task yang ditunggu.",
            "Main sinkron menunggu task lewat method instance milik task itu sendiri.",
            "Jawabannya: async, await, dan Wait.",
          ],
        },
      ],
    },
    {
      slug: "asy-exception-task",
      title: "Exception di Dalam Task",
      summary: "Kegagalan task tersimpan lalu dilempar ulang saat menunggu: AggregateException dari Wait, exception asli dari await.",
      steps: [
        {
          kind: "theory",
          title: "Kegagalan yang menunggu saat yang tepat",
          body: "Bila lambda di dalam `Task.Run` melempar exception, jangan bayangkan ia langsung meledak di pemanggil: task itu berjalan di thread lain dan pemanggil sudah lanjut ke baris berikutnya. Yang terjadi adalah task ditandai gagal dan exceptionnya disimpan di dalam task. Exception baru dilempar ulang pada saat ada yang menunggu task itu, entah lewat `await`, `Wait()`, atau `Result`. Karena itu letak try/catch yang benar adalah di sekitar titik tunggu, bukan di sekitar pembuatan task.\n\nBentuk yang dilempar berbeda menurut cara menunggunya, dan ini sumber kebingungan paling umum. `await` membongkar pembungusnya dan melempar exception asli, sehingga `catch (DivideByZeroException)` biasa bisa menangkapnya. Sebaliknya `Wait()` dan `Result` melempar `AggregateException`, wadah yang bisa berisi satu atau beberapa kegagalan; exception aslinya diakses lewat `InnerException` atau `InnerExceptions`. Pada program console pola yang praktis: tunggu di dalam try, tangkap AggregateException, periksa InnerException-nya.\n\nSatu bahaya senyap terakhir: task yang gagal tapi tidak pernah ditunggu siapa pun. Exceptionnya tidak pernah muncul dan pekerjaanmu hilang diam-diam. Aturannya sederhana, setiap task yang kamu buat harus ada yang menunggu atau setidaknya memeriksa keberhasilannya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static Task<int> BagiAsync(int a, int b)
    {
        return Task.Run(() => a / b);
    }

    public static void Main()
    {
        Task<int> t = BagiAsync(10, 0); // pembuatan tidak melempar apa pun

        try
        {
            t.Wait(); // kegagalan muncul di titik tunggu
        }
        catch (AggregateException ex)
        {
            Console.WriteLine("Gagal: {0}", ex.InnerException.GetType().Name);
        }
    }
}`,
            caption: "Keluarannya: Gagal: DivideByZeroException, dibungkus AggregateException oleh Wait.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan exception di dalam Task.Run sampai ke pemanggil?",
          options: [
            "Segera saat exception terjadi di thread lain",
            "Saat task dibuat",
            "Saat pemanggil menunggu task itu lewat await, Wait, atau Result",
            "Saat program selesai",
          ],
          answer: 2,
          explanation:
            "Task menyimpan kegagalannya, dan exception dilempar ulang kepada siapa pun yang menunggunya. Tanpa penunggu, kegagalan itu tidak pernah terlihat.",
        },
        {
          kind: "quiz",
          question: "`t.Wait()` pada task yang gagal melempar apa, dan `await t` melempar apa?",
          options: [
            "Keduanya melempar exception asli yang sama",
            "Wait melempar AggregateException; await melempar exception aslinya langsung",
            "Wait melempar TaskCanceledException; await melempar AggregateException",
            "Keduanya tidak melempar apa pun",
          ],
          answer: 1,
          explanation:
            "Wait dan Result membungkus kegagalan dalam AggregateException yang isinya dibaca lewat InnerException. await membongkarnya, jadi catch dengan tipe aslinya cukup.",
        },
      ],
    },
    {
      slug: "asy-result-blocking",
      title: "Jebakan Result dan Wait",
      summary: "Membaca hasil dengan memblokir terasa mudah sampai ada context yang menunggu balasan: cerita deadlock.",
      steps: [
        {
          kind: "theory",
          title: "Blocking yang diam-diam berbalik melawan",
          body: "`Result` dan `Wait()` memblokir thread pemanggil sampai task selesai. Pada program console sederhana itu tidak berbahaya: thread yang diblokir tidak sedang memegang tugas lain. Masalah muncul di lingkungan yang punya satu thread penting, misalnya thread antarmuka pada aplikasi GUI atau context permintaan pada ASP.NET klasik. Method async di lingkungan itu, setelah await-nya selesai, ingin melanjutkan dirinya di thread yang sama. Bila thread itu justru sedang diblokir oleh `Result` yang menunggu method async selesai, keduanya saling menunggu: method menunggu thread bebas, thread menunggu method selesai. Itulah deadlock klasik async, dan programnya membeku tanpa error apa pun.\n\nCara menghindarinya dirangkum dalam satu kaidah: async all the way. Dari panggilan paling atas sampai bawah, lanjutkan dengan await; jangan menyelipkan blocking di tengah jalur async. Async yang dipanggil dari async boleh di-await, dan panggilan paling atas pada program console cukup dijembatani sekali di Main.\n\nBila memang terpaksa jembatan sinkron, pilih `GetAwaiter().GetResult()` daripada `Result`: keduanya sama-sama memblokir, tetapi yang pertama melempar exception asli langsung, sedangkan `Result` membungkusnya dalam `AggregateException` sehingga catch-mu harus mengenali wadahnya. Tetap saja, itu obat penenang, bukan penawar deadlock; penawarnya tetap tidak memblokir sama sekali.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task<int> HitungAsync()
    {
        return await Task.Run(() => 2 * 21);
    }

    public static void Main()
    {
        // dua jembatan sinkron; GetResult melempar exception asli tanpa pembungkus
        int a = HitungAsync().GetAwaiter().GetResult();

        Task<int> t = HitungAsync();
        t.Wait();
        Console.WriteLine("{0} {1}", a, t.Result);
    }
}`,
            caption: "Di console keduanya aman. Di thread UI, jembatan seperti ini bisa deadlock.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `.Result` pada method async berbahaya di aplikasi GUI?",
          options: [
            "Karena Result menghapus hasilnya setelah dibaca",
            "Karena bisa deadlock: thread UI diblokir menunggu task, sementara task menunggu thread UI bebas untuk melanjutkan",
            "Karena GUI tidak mendukung Task sama sekali",
            "Karena Result selalu melempar exception",
          ],
          answer: 1,
          explanation:
            "Method async di GUI melanjutkan dirinya di thread UI. Kalau thread UI diblokir oleh Result, kelanjutan tak pernah jalan dan Result tak pernah selesai: keduanya saling menunggu.",
        },
        {
          kind: "quiz",
          question: "Apa keunggulan `GetAwaiter().GetResult()` dibanding `.Result` sebagai jembatan sinkron?",
          options: [
            "Tidak memblokir thread sama sekali",
            "Melempar exception asli tanpa dibungkus AggregateException",
            "Menjalankan task di thread pemanggil",
            "Menghindari deadlock di GUI",
          ],
          answer: 1,
          explanation:
            "Keduanya tetap memblokir, jadi deadlock tetap mungkin. Keunggulannya hanya pada exception: GetResult melempar yang asli, Result membungkusnya di AggregateException. Penawar deadlock tetap await.",
        },
      ],
    },
    {
      slug: "asy-task-whenall",
      title: "Task.WhenAll: Menunggu Banyak Sekaligus",
      summary: "Satu task penunggu untuk banyak task: hasil dalam urutan argumen, kegagalan yang terkumpul.",
      steps: [
        {
          kind: "theory",
          title: "Mulai semuanya dulu, tunggu sekali",
          body: "`Task.WaitAll` menunggu dengan memblokir. Pasangan yang ramah async adalah `Task.WhenAll(t1, t2, ...)`: ia mengembalikan satu task yang selesai ketika semua task di dalamnya selesai, sehingga bisa di-await seperti task lain. Untuk kumpulan `Task<T>` yang sejenis, hasilnya `T[]`, dan urutannya mengikuti urutan argumen, bukan urutan task yang kebetulan selesai duluan. `hasil[0]` selalu milik task pertama, apa pun kecepatannya.\n\nPerbedaan paling sering ditanya: kapan Which yang mana. `WaitAll` untuk jembatan sinkron, `WhenAll` untuk kode async murni karena mengikuti kaidah async all the way. Pola pemakaiannya berurutan tiga langkah: mulai semua task lebih dulu supaya benar-benar berjalan bersamaan, baru tunggu sekali dengan WhenAll, lalu pakai hasilnya. Menunggu satu per satu di dalam loop, `await kerja[i]` sebelum memulai kerja berikutnya, bukan paralel: itu eksekusi berurutan yang hanya memakai gaya async.\n\nSoal kegagalan, WhenAll menunggu sampai semua selesai dulu, lalu kegagalan dikumpulkan menjadi satu. `await` di atasnya melempar exception pertama yang terjadi, sementara task kembalinya sendiri menyimpan seluruh kegagalan di `AggregateException` bila kamu perlu laporan lengkapnya. Untuk latihan, cukup pegang prinsipnya: satu titik tunggu, hasil terurut, kegagalan terkumpul.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        Task<int> a = Task.Run(() => 3 * 4);
        Task<int> b = Task.Run(() => 10 / 2);

        int[] hasil = Task.WhenAll(a, b).Result; // di console: boleh sebagai jembatan

        Console.WriteLine(string.Join(" ", hasil)); // 12 5, urutan sesuai argumen
    }
}`,
            caption: "Bila b selesai duluan pun, hasil[0] tetap 12 milik a.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan inti `Task.WaitAll` dan `Task.WhenAll`?",
          options: [
            "WaitAll untuk Task<T>, WhenAll untuk Task polos",
            "WaitAll memblokir dan tidak mengembalikan apa pun; WhenAll mengembalikan Task yang bisa di-await",
            "WhenAll menjalankan task secara berurutan",
            "WaitAll bisa menerima banyak task, WhenAll hanya dua",
          ],
          answer: 1,
          explanation:
            "Keduanya menerima banyak task dan menunggu semuanya. Bedanya gaya: WaitAll memblokir pemanggil, WhenAll mengembalikan task sehingga cocok untuk kode async murni.",
        },
        {
          kind: "quiz",
          question: "`int[] hasil = Task.WhenAll(tA, tB).Result;` dengan kedua task int. Apa isi `hasil[1]`?",
          options: [
            "Hasil task yang selesai duluan",
            "Hasil tB, karena urutan hasil mengikuti urutan argumen",
            "Hasil tA",
            "Tidak bisa dipastikan",
          ],
          answer: 1,
          explanation:
            "WhenAll menyusun hasil dalam urutan argumen pemanggilan, bukan urutan penyelesaian. Hasil tB selalu di indeks 1.",
        },
        {
          kind: "quiz",
          question: "Pola mana yang benar-benar paralel?",
          options: [
            "for (int i = 0; i < n; i++) { hasil[i] = await KerjaAsync(i); }",
            "Mulai semua task lebih dulu, lalu sekali await Task.WhenAll(semuaTask)",
            "await satu task di dalam foreach yang isinya satu task",
            "Memanggil Wait() setelah setiap Task.Run",
          ],
          answer: 1,
          explanation:
            "Await di dalam loop menunggu satu kerja selesai sebelum memulai yang berikutnya: itu berurutan. Paralel dimulai dengan menitipkan semua kerja dulu, baru menunggu sekali.",
        },
      ],
    },
    {
      slug: "asy-async-void",
      title: "Jebakan async void",
      summary: "Satu dari tiga tipe kembalian method async adalah jebakan: tidak bisa ditunggu, exceptionnya lepas.",
      steps: [
        {
          kind: "theory",
          title: "Kembalian yang tidak bisa dipegang",
          body: "Method async boleh mengembalikan `Task`, `Task<T>`, atau `void`. Dua yang pertama memberi pemanggil sebuah task: ia bisa di-await, bisa di-Wait, dan kalau gagal, exceptionnya sampai ke pemanggil. `async void` tidak memberikan apa-apa. Pemanggil tidak bisa menunggunya, tidak tahu kapan selesainya, dan bila di dalamnya meledak exception, tidak ada wadah yang meneruskannya; exception itu naik langsung ke lingkungan host dan pada program console biasanya menghentikan program.\n\nLalu untuk apa ia ada? Karena ada satu tempat yang memaksa: event handler UI. Signature-nya dari framework berbentuk void, misalnya penangan klik tombol, dan di situlah `async void` adalah pilihan yang sah. Di luar kasus itu, aturannya tegas: method async milikmu sendiri mengembalikan Task, sekecil apa pun pekerjaannya, supaya pemanggil punya kendali penuh atas tunggu dan kegagalannya.\n\nDi program console C# 5 soal ini bahkan tidak muncul di Main: compiler menolak `Main` yang async, jadi jembatannya method async terpisah yang dipanggil lalu di-Wait dari Main. Kebiasaan yang dibawa dari lesson ini ke proyek nyata: begitu menulis `async` pada sebuah method, matamu mencari tipe kembaliannya, dan Task hampir selalu jawabannya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task KerjaAsync()
    {
        await Task.Run(() => Console.WriteLine("kerja selesai"));
    }

    // async void: tidak mengembalikan Task, tidak bisa ditunggu.
    // Tempat yang wajar hanya event handler UI.
    static async void KerjaPesan(string pesan)
    {
        await Task.Run(() => Console.WriteLine(pesan));
    }

    public static void Main()
    {
        KerjaAsync().Wait(); // bisa ditunggu karena mengembalikan Task
    }
}`,
            caption: "KerjaPesan tidak bisa di-Wait: Main tidak punya pegangan apa pun atasnya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa dua kehilangan utama pemanggil bila method async kamu mengembalikan void?",
          options: [
            "Tidak bisa mengirim parameter dan tidak bisa memanggilnya dua kali",
            "Tidak bisa menunggu penyelesaiannya dan tidak bisa menangkap exceptionnya",
            "Tidak bisa dipanggil dari Main dan tidak bisa async",
            "Tidak mendapat hasil dan tidak mendapat Task.Delay",
          ],
          answer: 1,
          explanation:
            "Tanpa Task tidak ada pegangan untuk menunggu, dan exception di dalamnya tidak dikirim ke pemanggil. Dua hal itulah yang membuat async void berbahaya di luar event handler.",
        },
        {
          kind: "quiz",
          question: "Dalam kondisi apa `async void` masih menjadi pilihan yang wajar?",
          options: [
            "Method utama program console",
            "Event handler UI yang signature void-nya dipaksakan framework",
            "Method yang wajib cepat",
            "Method yang tidak melempar exception",
          ],
          answer: 1,
          explanation:
            "Framework UI memanggil handler dengan tipe kembalian void, dan kebutuhan itu sah. Untuk semua method buatan sendiri, kembalikan Task agar bisa ditunggu dan kegagalannya tertangkap.",
        },
      ],
    },
    {
      slug: "asy-cancellationtoken",
      title: "CancellationToken: Membatalkan dengan Rapi",
      summary: "Pembatalan kooperatif: sumber token, pekerjaan yang memeriksa, dan berhenti sebagai dibatalkan bukan gagal.",
      steps: [
        {
          kind: "theory",
          title: "Pintu keluar untuk pekerjaan panjang",
          body: "Task yang sudah dititipkan tidak bisa dipaksa berhenti dari luar; membunuh thread-nya kasar dan bisa meninggalkan data setengah jadi. Cara .NET adalah pembatalan kooperatif: peminta keberhentian membuat `CancellationTokenSource`, pekerjaan menerima `Token`-nya, dan pekerjaan itulah yang secara berkala memeriksa apakah harus berhenti. Pembatalan hanya efektif bila pekerjaannya mau melihat pintu keluar yang disediakan.\n\nDi dalam pekerjaan ada dua bentuk pemeriksaan. `token.IsCancellationRequested` memberi bool supaya kamu bisa berhenti dengan rapi, misalnya mengembalikan hasil sebagian. `token.ThrowIfCancellationRequested()` melempar `OperationCanceledException` yang menandai task berakhir batal, bukan gagal; task seperti itu berstatus Canceled dan pemanggilnya menangkap `TaskCanceledException`, turunan dari OperationCanceledException. Token juga bisa didaftarkan langsung pada `Task.Run(action, token)`: bila pembatalan terjadi sebelum pekerjaan sempat mulai, task langsung berakhir batal tanpa menjalankan lambda-nya.\n\nDi latihan platform ini tidak ada pekerjaan panjang sungguhan untuk dibatalkan, jadi konsepnya dipelajari lewat contoh kecil yang pasti. Yang perlu terbawa: setiap pekerjaan lama layak menerima token sejak desainnya, karena menambahkannya belakangan berarti menyentuh seluruh jalur pemanggilannya.",
          code: {
            language: "csharp",
            content: `using System;
using System.Threading;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        CancellationTokenSource sumber = new CancellationTokenSource();
        sumber.Cancel(); // dibatalkan sebelum pekerjaan sempat jalan

        Task kerja = Task.Run(() =>
        {
            for (int i = 1; i <= 1000000; i++)
            {
                // bayangkan pekerjaan berat di sini
            }
        }, sumber.Token);

        try
        {
            kerja.Wait();
        }
        catch (AggregateException ex)
        {
            Console.WriteLine("Berhenti: {0}", ex.InnerException.GetType().Name);
        }
    }
}`,
            caption: "Token yang sudah batal membuat task berstatus Canceled tanpa lambda-nya jalan.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa pembatalan di .NET disebut kooperatif?",
          options: [
            "Karena beberapa thread harus menyetujui pembatalannya",
            "Karena pekerjaan itu sendiri yang memeriksa token secara berkala dan memutuskan berhenti",
            "Karena pembatalan memerlukan izin sistem operasi",
            "Karena hanya Task.Run yang bisa dibatalkan",
          ],
          answer: 1,
          explanation:
            "Tidak ada cara aman memaksa task berhenti dari luar. Yang bisa dilakukan peminta adalah menyalakan token; efektif atau tidak tergantung pekerjaannya memeriksa pintu keluar itu.",
        },
        {
          kind: "quiz",
          question: "Exception apa yang menandai pekerjaan berhenti karena pembatalan?",
          options: [
            "InvalidOperationException",
            "AggregateException",
            "OperationCanceledException, dengan TaskCanceledException sebagai bentuk tasknya",
            "NullReferenceException",
          ],
          answer: 2,
          explanation:
            "token.ThrowIfCancellationRequested() melempar OperationCanceledException, dan task yang beral ke status Canceled dengan TaskCanceledException. Itu berbeda dari task yang gagal.",
        },
      ],
    },
    {
      slug: "asy-latihan-paralel",
      title: "Latihan Gabungan: Hitung Paralel",
      summary: "Dua Task.Run membagi data di tengah, WaitAll menyatukan, dan hasil dicetak dalam urutan yang pasti.",
      steps: [
        {
          kind: "theory",
          title: "Membagi kerja, menyatukan hasil",
          body: "Penutup modul memakai mekanik async untuk kerja paralel yang hasilnya pasti. Data `n` bilangan dibagi dua di indeks tengah: bagian pertama ke list kiri, sisanya ke kanan. Masing-masing dihitung jumlah kuadratnya di `Task<long>` terpisah lewat `Task.Run`, lalu `Task.WaitAll` memastikan keduanya selesai sebelum satu pun hasil dicetak. Dengan disiplin itu, kapan persisnya thread pool menyelesaikan tugasnya tidak memengaruhi keluaran sedikit pun.\n\nDua detail numerik dijaga sejak awal. Perkalian kuadrat mudah melampaui batas int, jadi akumulator dan penampungnya bertipe `long` sejak lambda ditulis, dengan cast `(long)` sebelum perkalian. Dan pembagian `n / 2` untuk n ganjil menaruh bagian ekstra di kanan, kesepakatan yang harus dipegang kedua loop supaya tidak ada elemen yang terlewat atau terhitung dua kali.\n\nKode di langkah berikutnya sudah mengikuti semua pola itu, kecuali satu kesalahan yang terselip di dalamnya. Jalankan dengan test pertama, bandingkan keluarannya dengan yang seharusnya, lalu telusuri loop mana yang menghitung list yang tidak tepat.",
          code: {
            language: "csharp",
            content: `// input : n, lalu n bilangan
// bagi  : indeks 0..n/2-1 ke kiri, sisanya ke kanan
// hitung: jumlah kuadrat tiap bagian di Task<long> masing-masing
// tunggu: Task.WaitAll, baru cetak
// keluaran:
//   "Bagian 1: <jumlah kuadrat kiri>"
//   "Bagian 2: <jumlah kuadrat kanan>"
//   "Total: <keduanya>"`,
            caption: "Kontrak program paralel yang kamu perbaiki di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Temukan loop yang salah hitung",
          prompt:
            "Program seharusnya mencetak jumlah kuadrat kedua bagian dan totalnya, tetapi salah satu bagian selalu terhitung dari list yang tidak tepat. Jalankan, lihat test pertama, perbaiki satu kesalahan di dalamnya.",
          mode: "fix",
          template: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        int tengah = n / 2;
        List<int> kiri = new List<int>();
        List<int> kanan = new List<int>();
        for (int i = 0; i < n; i++)
        {
            int v = Convert.ToInt32(Console.ReadLine());
            if (i < tengah) kiri.Add(v); else kanan.Add(v);
        }

        Task<long> bagian1 = Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < kiri.Count; i++) total += (long)kiri[i] * kiri[i];
            return total;
        });

        Task<long> bagian2 = Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < kiri.Count; i++) total += (long)kanan[i] * kanan[i];
            return total;
        });

        Task.WaitAll(bagian1, bagian2);

        Console.WriteLine("Bagian 1: {0}", bagian1.Result);
        Console.WriteLine("Bagian 2: {0}", bagian2.Result);
        Console.WriteLine("Total: {0}", bagian1.Result + bagian2.Result);
    }
}`,
          solution: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class Program
{
    public static void Main()
    {
        int n = Convert.ToInt32(Console.ReadLine());
        int tengah = n / 2;
        List<int> kiri = new List<int>();
        List<int> kanan = new List<int>();
        for (int i = 0; i < n; i++)
        {
            int v = Convert.ToInt32(Console.ReadLine());
            if (i < tengah) kiri.Add(v); else kanan.Add(v);
        }

        Task<long> bagian1 = Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < kiri.Count; i++) total += (long)kiri[i] * kiri[i];
            return total;
        });

        Task<long> bagian2 = Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < kanan.Count; i++) total += (long)kanan[i] * kanan[i];
            return total;
        });

        Task.WaitAll(bagian1, bagian2);

        Console.WriteLine("Bagian 1: {0}", bagian1.Result);
        Console.WriteLine("Bagian 2: {0}", bagian2.Result);
        Console.WriteLine("Total: {0}", bagian1.Result + bagian2.Result);
    }
}`,
          tests: [
            { stdin: "3\n1\n2\n3", expectedOutput: "Bagian 1: 1\nBagian 2: 13\nTotal: 14" },
            { stdin: "5\n2\n3\n4\n5\n6", expectedOutput: "Bagian 1: 13\nBagian 2: 77\nTotal: 90" },
            { stdin: "3\n10\n0\n7", expectedOutput: "Bagian 1: 100\nBagian 2: 49\nTotal: 149", hidden: true },
          ],
          hints: [
            "Test pertama seharusnya menghasilkan 1 dan 13. Bandingkan dengan keluaranmu untuk tahu bagian mana yang keliru.",
            "Dua blok Task.Run hampir identik. Bandingkan list mana yang dihitung oleh masing-masing.",
            "Loop di bagian2 masih menghitung sepanjang kiri.Count; ia seharusnya menelusuri kanan.",
          ],
        },
      ],
    },
  ],
};
