import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "php",
  moduleRange: [4, 5],
  modules: [
    {
      title: "OOP Lanjut",
      description: "Interface, abstract class, trait, namespace, dan autoload.",
    },
    {
      title: "Error dan Exception",
      description: "try/catch/finally, custom exception, throwable hierarchy, dan logging.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: OOP Lanjut ====================
    {
      slug: "oo2-interface-kontrak",
      title: "Interface: Kontrak untuk Class",
      summary: "Definisikan kontrak method yang wajib dipenuhi class lewat interface dan implements.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak tanpa isi",
          body: "Interface mendefinisikan apa yang bisa dilakukan sebuah class tanpa menjelaskan caranya. Deklarasinya berisi tanda tangan method saja: nama, parameter, return type, lalu titik koma. Setiap class yang menyatakan `implements` diwajibkan menyiapkan semua method itu dengan tanda tangan yang persis sama.\n\nSemua method interface otomatis public, dan menulis `private` di sana adalah pelanggaran kontrak. Satu class boleh mengikat diri ke banyak interface sekaligus dalam satu daftar dipisah koma, berbeda dengan `extends` yang cuma boleh satu. Inilah pintu komposisi kemampuan di PHP.\n\nKekuatan sesungguhnya muncul di type hint: parameter bertipe interface menerima objek dari class mana pun yang mengikutinya. Detail pemakaiannya menunggu di latihan gabungan akhir modul ini.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

interface Kurs
{
    public function keDolar(int $rupiah): int;
}

class KursDolar implements Kurs
{
    public function keDolar(int $rupiah): int
    {
        return intdiv($rupiah, 16000);
    }
}

echo (new KursDolar())->keDolar(48000); // 3`,
            caption: "Tanda tangan di interface, isinya di class yang mengikat diri padanya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Class menyatakan `implements Kurs` tapi tidak menulis satu pun method dari interface itu. Apa yang terjadi?",
          options: [
            "Class otomatis mewarisi implementasi bawaan interface",
            "Fatal error: class wajib menyiapkan semua method interface",
            "Method yang hilang mengembalikan null saat dipanggil",
            "PHP memberi warning lalu melanjutkan",
          ],
          answer: 1,
          explanation:
            "Interface tidak punya isi sama sekali. Mengaku implements berarti berjanji menulis semua methodnya, dan janji kosong ditolak PHP dengan fatal error saat class dimuat.",
        },
        {
          kind: "code",
          title: "Kontrak konversi dolar",
          prompt:
            "Lengkapi dua kekosongan: kata kunci yang mengikat class `KursDolar` pada interface `Kurs`, dan nama method kontrak yang wajib ada di class itu. Input: satu bilangan rupiah. Keluaran: nilai dalam dolar dengan kurs 1 dolar = 16000 rupiah.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

interface Kurs
{
    public function keDolar(int $rupiah): int;
}

class KursDolar ___ Kurs
{
    public function ___(int $rupiah): int
    {
        return intdiv($rupiah, 16000);
    }
}

$kurs = new KursDolar();
echo $kurs->keDolar((int) trim(fgets(STDIN))) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

interface Kurs
{
    public function keDolar(int $rupiah): int;
}

class KursDolar implements Kurs
{
    public function keDolar(int $rupiah): int
    {
        return intdiv($rupiah, 16000);
    }
}

$kurs = new KursDolar();
echo $kurs->keDolar((int) trim(fgets(STDIN))) . "\\n";`,
          tests: [
            { stdin: "32000", expectedOutput: "2" },
            { stdin: "16000", expectedOutput: "1" },
            { stdin: "800000", expectedOutput: "50", hidden: true },
          ],
          hints: [
            "Class menempel pada interface lewat kata kunci yang berarti mengimplementasikan.",
            "Nama method di class harus sama persis dengan deklarasi interface: keDolar.",
          ],
        },
      ],
    },
    {
      slug: "oo2-abstract-class",
      title: "Abstract Class dan Abstract Method",
      summary: "Bangun kerangka class yang tidak bisa di instansiasi dan wajib dilengkapi anaknya.",
      steps: [
        {
          kind: "theory",
          title: "Setengah jadi yang disiplin",
          body: "Abstract class adalah class yang dilarang di instansiasi: ia cetakan setengah jadi. Ia tetap boleh membawa property, constructor, dan method konkret yang siap dipakai anak-anaknya. Method yang belum selesai ditandai `abstract` dan hanya berupa tanda tangan tanpa tubuh.\n\nSetiap class anak non-abstract wajib melengkapi seluruh method abstract orang tuanya, dengan parameter dan return type yang cocok. Pengambilan anak tetap lewat `extends`, dan karena PHP membatasi satu extends, satu anak cuma punya satu orang tua abstract.\n\nMethod konkret di abstract class boleh memanggil method abstract miliknya sendiri, misalnya `$this->luas()`. PHP tidak keberatan: saat method itu berjalan, objeknya pasti anak konkret yang sudah melengkapi semuanya.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

abstract class BangunDatar
{
    abstract public function luas(): int;

    public function deskripsi(): string
    {
        return "Luas: " . $this->luas();
    }
}

class Persegi extends BangunDatar
{
    public function __construct(private int $sisi) {}

    public function luas(): int
    {
        return $this->sisi * $this->sisi;
    }
}

echo (new Persegi(5))->deskripsi(); // Luas: 25`,
            caption: "deskripsi() ditulis sekali di orang tua, luas() dilengkapi tiap anak.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `new BangunDatar()` jika `BangunDatar` adalah abstract class?",
          options: [
            "Objek dibuat dengan semua method abstract bernilai null",
            "Objek dibuat tapi tidak bisa memanggil method",
            "Fatal error: abstract class tidak bisa di instansiasi",
            "PHP otomatis memilih salah satu anaknya",
          ],
          answer: 2,
          explanation:
            "Abstract class sengaja setengah jadi dan dilarang di instansiasi. Yang boleh di new hanya class anak konkret yang sudah melengkapi semua method abstract.",
        },
        {
          kind: "code",
          title: "Bangun datar yang menolak dibuat",
          prompt:
            "Program ini gagal dimuat karena satu deklarasi kurang: pesan error PHP menunjuk class yang berisi method abstract. Perbaiki supaya input 7 mencetak `Luas: 49`.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

class BangunDatar
{
    abstract public function luas(): int;

    public function deskripsi(): string
    {
        return "Luas: " . $this->luas();
    }
}

class Persegi extends BangunDatar
{
    public function __construct(private int $sisi) {}

    public function luas(): int
    {
        return $this->sisi * $this->sisi;
    }
}

$persegi = new Persegi((int) trim(fgets(STDIN)));
echo $persegi->deskripsi() . "\\n";`,
          solution: `<?php
declare(strict_types=1);

abstract class BangunDatar
{
    abstract public function luas(): int;

    public function deskripsi(): string
    {
        return "Luas: " . $this->luas();
    }
}

class Persegi extends BangunDatar
{
    public function __construct(private int $sisi) {}

    public function luas(): int
    {
        return $this->sisi * $this->sisi;
    }
}

$persegi = new Persegi((int) trim(fgets(STDIN)));
echo $persegi->deskripsi() . "\\n";`,
          tests: [
            { stdin: "7", expectedOutput: "Luas: 49" },
            { stdin: "4", expectedOutput: "Luas: 16" },
            { stdin: "12", expectedOutput: "Luas: 144", hidden: true },
          ],
          hints: [
            "Baca pesan fatal errornya: PHP menyebut class yang berisi method abstract.",
            "Class yang punya method abstract wajib ditandai kata abstract di depan namanya.",
          ],
        },
      ],
    },
    {
      slug: "oo2-abstract-vs-interface",
      title: "Kapan Interface, Kapan Abstract Class",
      summary: "Pilih antara kontrak kemampuan dan kerangka keturunan sebelum menulis class.",
      steps: [
        {
          kind: "theory",
          title: "Dua alat, dua kegunaan",
          body: "Pilih interface untuk kemampuan yang melintasi keluarga class. `Bayable` bisa diikuti oleh TransferBank, KartuKredit, bahkan SaldoPoint yang tidak satu pohon turunan; satu class boleh mengambil banyak kemampuan sekaligus. Kalau isinya benar-benar kosong dari implementasi, interface biasanya sudah cukup.\n\nPilih abstract class untuk berbagi kerangka di satu keluarga. Property, constructor, dan method konkret yang dipakai bersama hidup enak di sini, diwariskan sekali lewat `extends`. Interface tidak bisa menyimpan state, abstract class bisa.\n\nKeduanya sering bekerja berpasangan di kode nyata: interface menetapkan kontrak publik, abstract class menyediakan basis yang nyaman untuk satu cabang, dan class konkret tetap bebas mengambil interface lain. Banyak pustaka populer menyediakan keduanya dengan pola persis seperti ini.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

interface Bayable
{
    public function bayar(int $jumlah): string;
}

abstract class MetodeOnline
{
    public function __construct(protected string $nama) {}

    public function identitas(): string
    {
        return "metode: $this->nama";
    }
}

class Qris extends MetodeOnline implements Bayable
{
    public function bayar(int $jumlah): string
    {
        return "$this->nama membayar Rp$jumlah";
    }
}`,
            caption: "extends untuk kerangka, implements untuk kontrak, keduanya muat di satu class.",
          },
        },
        {
          kind: "quiz",
          question: "Satu class perlu punya dua kemampuan sekaligus: bisa dibayar dan bisa dikirim. Deklarasi yang paling pas?",
          options: [
            "class Pesanan extends Bayable, Kirimable",
            "class Pesanan implements Bayable, Kirimable",
            "class Pesanan implements Bayable lalu extends Kirimable",
            "interface Pesanan implements Bayable, Kirimable",
          ],
          answer: 1,
          explanation:
            "PHP hanya mengizinkan satu extends, tapi mengizinkan banyak implements dalam satu daftar dipisah koma. Interface juga tidak pernah implements; ia yang mendefinisikan kontrak.",
        },
      ],
    },
    {
      slug: "oo2-trait",
      title: "Trait: Reuse Horizontal",
      summary: "Bagikan method ke class mana pun lewat trait, tanpa mengganggu garis turunan.",
      steps: [
        {
          kind: "theory",
          title: "Warisan dari samping",
          body: "Garis turunan di PHP tipis: satu class cuma boleh punya satu `extends`. Trait mengisi celah itu berupa kumpulan method yang bisa ditempelkan ke class mana pun lewat kata `use` di dalam tubuh class. Bentuknya mirip class: boleh berisi property dan method, tapi tidak bisa di instansiasi.\n\nMethod trait menyatu ke class pemakainya, persis seperti ditulis langsung di sana. Karena itu `$this` di dalam trait menunjuk objek class pemakai, dan trait boleh memanggil method milik class itu asal kontraknya jelas.\n\nSatu class bisa memakai beberapa trait sekaligus dalam satu daftar. Trait tidak menggantikan interface; pasangan yang umum di proyek nyata: interface menetapkan kontrak, trait menyediakan implementasi bersama untuk kontrak yang sama.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

trait Ringkas
{
    public function ringkas(): string
    {
        return strtoupper($this->nama());
    }
}

class Produk
{
    use Ringkas;

    public function nama(): string
    {
        return "kopi sachet";
    }
}

echo (new Produk())->ringkas(); // KOPI SACHET`,
            caption: "ringkas() tinggal di trait, tapi berlaku seperti method milik Produk.",
          },
        },
        {
          kind: "quiz",
          question: "Kata kunci apa yang menempelkan method trait ke dalam tubuh sebuah class?",
          options: ["extends", "implements", "use", "require"],
          answer: 2,
          explanation:
            "Di dalam class, `use NamaTrait;` menyatu-kan method trait seolah ditulis langsung di class itu. Di luar class, use dipakai untuk alias namespace; konteksnya yang membedakan.",
        },
        {
          kind: "code",
          title: "Trait penyambung sapaan",
          prompt:
            "Lengkapi dua kekosongan: kata kunci pembuat trait, dan pernyataan yang menempelkan trait `Uppercase` ke class `Sapaan`. Input: satu baris nama. Keluaran: sapaan dengan nama dalam huruf besar.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

___ Uppercase
{
    public function besar(): string
    {
        return strtoupper($this->teks());
    }
}

class Sapaan
{
    use ___;

    public function __construct(private string $teks) {}

    public function teks(): string
    {
        return $this->teks;
    }
}

$sapaan = new Sapaan(trim(fgets(STDIN)));
echo "Halo, " . $sapaan->besar() . "\\n";`,
          solution: `<?php
declare(strict_types=1);

trait Uppercase
{
    public function besar(): string
    {
        return strtoupper($this->teks());
    }
}

class Sapaan
{
    use Uppercase;

    public function __construct(private string $teks) {}

    public function teks(): string
    {
        return $this->teks;
    }
}

$sapaan = new Sapaan(trim(fgets(STDIN)));
echo "Halo, " . $sapaan->besar() . "\\n";`,
          tests: [
            { stdin: "sinta", expectedOutput: "Halo, SINTA" },
            { stdin: "belajar php", expectedOutput: "Halo, BELAJAR PHP" },
            { stdin: "dunia", expectedOutput: "Halo, DUNIA", hidden: true },
          ],
          hints: [
            "Kumpulan method yang bisa ditempel ke banyak class dibuat dengan satu kata kunci sebelum nama traitnya.",
            "Di dalam class, trait ditempel dengan use diikuti nama trait dan titik koma.",
          ],
        },
      ],
    },
    {
      slug: "oo2-trait-konflik",
      title: "Konflik Trait dan insteadof",
      summary: "Dua trait membawa nama method sama: pilih pemenangnya dengan insteadof.",
      steps: [
        {
          kind: "theory",
          title: "Dua trait, satu nama",
          body: "Dua trait dipakai satu class dan sama-sama membawa method `sapa()` membuat PHP berhenti dengan fatal error. Ia menolak menebak mana yang benar, sekalipun isinya identik.\n\nPenyelesaiannya ditulis dalam kurung kurawal setelah daftar trait: `use A, B { A::sapa insteadof B; }` menyatakan versi A yang menang. Temannya kata `as` memberi nama baru lewat `B::sapa as sapaB`, supaya versi B tetap terjangkau lewat panggilan lain.\n\nFitur ini jarang dipakai harian, tapi wajib dikenali saat membaca class yang menempel banyak trait: blok kurung kurawal setelah daftar trait adalah wasit konfliknya.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

trait A
{
    public function sapa(): string
    {
        return "dari A";
    }
}

trait B
{
    public function sapa(): string
    {
        return "dari B";
    }
}

class Mesin
{
    use A, B {
        A::sapa insteadof B;
        B::sapa as sapaB;
    }
}

$m = new Mesin();
echo $m->sapa() . "\\n";  // dari A
echo $m->sapaB() . "\\n"; // dari B, lewat nama baru`,
            caption: "insteadof memilih pemenang, as menyelamatkan yang kalah.",
          },
        },
        {
          kind: "quiz",
          question: "Class memakai trait A dan trait B yang sama-sama punya method `sapa()`. Tulisan mana yang membuat versi A yang terpakai?",
          options: [
            "use A, B { A::sapa insteadof B; }",
            "use A, B { B::sapa insteadof A; }",
            "use A; use B; urutan penulisan menentukan pemenang",
            "use A::sapa overriding B::sapa;",
          ],
          answer: 0,
          explanation:
            "Konflik dua trait tidak diselesaikan oleh urutan penulisan use. Kata insteadof di dalam kurung kurawal setelah daftar trait yang menyatakan pemenangnya.",
        },
      ],
    },
    {
      slug: "oo2-namespace",
      title: "Namespace dan use",
      summary: "Kelompokkan class dalam namespace agar namanya bebas bentrok, dan panggil singkat lewat use.",
      steps: [
        {
          kind: "theory",
          title: "Alamat lengkap untuk class",
          body: "Dua pustaka yang sama-sama punya class `Produk` tidak bisa hidup berdampingan tanpa namespace. `namespace Toko;` di baris atas file memberi alamat lengkap `Toko\\Produk`, dan file lain bebas punya `Gudang\\Produk` tanpa tabrakan. Deklarasinya ditulis sekali, tepat setelah `declare(strict_types=1)`, dan berlaku untuk sisa file.\n\nMenulis alamat lengkap setiap kali melelahkan. `use Toko\\Produk;` membuat alias: sejak baris itu, nama `Produk` di file tersebut merujuk ke alamat lengkapnya. Alias cuma panggilan singkat di file pemakai; ia tidak memuat file apa pun.\n\nDi proyek nyata, nama namespace mengikuti struktur folder: `App\\Models\\Produk` biasanya tinggal di `src/Models/Produk.php`. Konvensi ini yang nanti dipegang autoload pada lesson berikutnya.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

namespace Toko;

class Produk
{
    public function label(): string
    {
        return "produk milik Toko";
    }
}

$produk = new Produk();
echo $produk->label(); // produk milik Toko
// dari file lain: use Toko\\Produk; lalu cukup new Produk();`,
            caption: "Di file yang sama, class tetap dipanggil dengan nama pendeknya.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `use Laporan\\Cetak;` di sebuah file, pemanggilan `new Cetak()` di file itu merujuk ke?",
          options: [
            "Class Cetak global tanpa namespace",
            "Class Laporan\\Cetak",
            "Class Cetak di folder yang sama",
            "Class apa pun yang terakhir dimuat",
          ],
          answer: 1,
          explanation:
            "use membuat alias di file tersebut: nama pendek Cetak mewakili alamat lengkap Laporan\\Cetak. Ia tidak memuat file dan tidak mengubah struktur folder.",
        },
        {
          kind: "code",
          title: "Class di dalam namespace",
          prompt:
            "Lengkapi dua kekosongan: nama namespace tempat class ini tinggal, dan nama method yang dipanggil di akhir program. Input: baris pertama nama produk, baris kedua harga. Keluaran: label produk.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

namespace ___;

class Produk
{
    public function __construct(public string $nama, public int $harga) {}

    public function label(): string
    {
        return "$this->nama: Rp$this->harga";
    }
}

$produk = new Produk(trim(fgets(STDIN)), (int) trim(fgets(STDIN)));
echo $produk->___() . "\\n";`,
          solution: `<?php
declare(strict_types=1);

namespace Toko;

class Produk
{
    public function __construct(public string $nama, public int $harga) {}

    public function label(): string
    {
        return "$this->nama: Rp$this->harga";
    }
}

$produk = new Produk(trim(fgets(STDIN)), (int) trim(fgets(STDIN)));
echo $produk->label() . "\\n";`,
          tests: [
            { stdin: "Kopi\n25000", expectedOutput: "Kopi: Rp25000" },
            { stdin: "Teh\n18000", expectedOutput: "Teh: Rp18000" },
            { stdin: "Gula\n15000", expectedOutput: "Gula: Rp15000", hidden: true },
          ],
          hints: [
            "Di contoh teori, class Produk tinggal di namespace Toko.",
            "Method yang mencetak label dideklarasikan dengan nama label.",
          ],
        },
      ],
    },
    {
      slug: "oo2-autoload",
      title: "Autoload: spl_autoload_register",
      summary: "Biarkan PHP memuat file class tepat saat class itu pertama dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Muat class tepat waktu",
          body: "Konvensi proyek PHP: satu class satu file. Tanpa bantuan, file itu harus dimuat manual dengan `require` sebelum class pertama kali dipakai. Daftar require memanjang, urutannya sensitif, dan satu yang terlewat bikin fatal error.\n\n`spl_autoload_register()` mendaftarkan fungsi yang PHP panggil otomatis hanya saat ada class yang belum terdefinisi. Di dalam fungsi itulah nama class diterjemahkan menjadi path lalu dimuat. Kalau fungsi pertama tidak menemukan file, fungsi autoload lain yang terdaftar masih diberi giliran.\n\nComposer membangun standar PSR-4 di atas mekanisme yang sama: kamu menulis aturan singkat seperti `App\\` menunjuk folder `src/`, dan file autoload buatannya mendaftarkan penerjemah untukmu. Karena itu proyek modern nyaris tidak pernah menulis daftar require manual.",
          code: {
            language: "php",
            content: `<?php

spl_autoload_register(function (string $class): void {
    // contoh sederhana: terjemahkan nama class menjadi path, muat jika ada
    $file = str_replace("\\\\", "/", $class) . ".php";
    if (is_file($file)) {
        require $file;
    }
});

// new App\\Models\\Produk(); file App/Models/Produk.php dimuat di sini`,
            caption: "Autoload bekerja malas: baru berjalan saat class benar-benar dipakai.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan fungsi yang didaftarkan lewat spl_autoload_register dipanggil?",
          options: [
            "Sekali di awal program untuk seluruh class",
            "Hanya saat ada class yang dipakai tapi belum terdefinisi",
            "Setiap satu file selesai dimuat",
            "Saat script berakhir",
          ],
          answer: 1,
          explanation:
            "Autoload bekerja malas: ia baru berjalan ketika PHP menemui nama class yang belum dikenalnya, lalu memberi kodemu kesempatan memuat file class itu.",
        },
      ],
    },
    {
      slug: "oo2-final",
      title: "final Class dan final Method",
      summary: "Kunci class dan method agar tidak ditimpa turunan.",
      steps: [
        {
          kind: "theory",
          title: "Pintu yang sengaja dikunci",
          body: "Kata `final` di depan class berarti dilarang di-extends. `class KonfigurasiKhusus extends Konfigurasi` akan ditolak PHP dengan fatal error kalau Konfigurasi ditandai final. Di depan method, final berarti method itu tidak boleh ditimpa class anak, meskipun classnya sendiri masih boleh punya anak.\n\nIni alat desain, bukan pengaman. Alasan yang sehat: method itu menjaga aturan yang rusak kalau diubah lewat pewarisan, atau pustaka ingin bebas merapikan isi class tanpa merusak kode orang yang meng-extends-nya.\n\nPakai secukupnya. Membuat semua class final menutup pintu reuse yang legal. Kebiasaan yang sehat: buka dulu, kunci saat ada alasan konkret.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

final class Tagihan
{
    final public function total(): int
    {
        return 150000; // perhitungan yang tidak boleh ditimpa siapa pun
    }
}

// class TagihanDiskon extends Tagihan {} // fatal error: cannot extend final class`,
            caption: "final menutup jalur pewarisan pada titik yang sengaja dipilih.",
          },
        },
        {
          kind: "quiz",
          question: "Apa akibat menandai sebuah method sebagai final?",
          options: [
            "Method hanya boleh dipanggil sekali per request",
            "Class anak tidak boleh menimpa (override) method itu",
            "Method tidak bisa dipanggil dari luar class",
            "Class induk otomatis jadi abstract",
          ],
          answer: 1,
          explanation:
            "final pada method melarang override oleh class turunannya. Membatasi pemanggilan dari luar adalah urusan visibility, bukan final.",
        },
      ],
    },
    {
      slug: "oo2-late-static-binding",
      title: "Late Static Binding: self vs static",
      summary: "Pahami beda self:: dan static:: saat method orang tua dipanggil lewat anak.",
      steps: [
        {
          kind: "theory",
          title: "self ikat tempat tulis, static ikat pemanggil",
          body: "`self::` di dalam method terikat ke class tempat kodenya ditulis, sekalipun method itu dipanggil lewat class anak. `static::` menengok class yang dipakai saat runtime. Perbedaan inilah yang disebut late static binding, dan `new static()` mengikutinya.\n\nKombinasi yang sering muncul: class induk punya `public static function buat(): static { return new static(); }`. Setiap anak mewarisi method itu dan menerima objek milik dirinya sendiri, bukan objek induk. Pola ini jadi fondasi builder dan pustaka ORM.\n\nPilih `self::` untuk konstanta dan method yang memang sengaja terikat ke class penulisnya, dan `static::` saat hasil harus mengikuti class pemanggil. Salah pilih jarang berupa error; hasilnya justru diam-diam berbeda.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

class Induk
{
    public static function siapaSelf(): string
    {
        return self::class;
    }

    public static function siapaStatic(): string
    {
        return static::class;
    }
}

class Anak extends Induk {}

echo Anak::siapaSelf() . "\\n";   // Induk
echo Anak::siapaStatic() . "\\n"; // Anak`,
            caption: "Sama-sama dipanggil lewat Anak, hasilnya tergantung kata yang dipilih.",
          },
        },
        {
          kind: "quiz",
          question:
            "Method `public static function siapa(): string { return self::class; }` ditulis di class Induk, lalu dipanggil lewat `Anak::siapa()`. Hasilnya?",
          options: ["Anak", "Induk", "null", "Fatal error karena self tidak dipakai di method static"],
          answer: 1,
          explanation:
            "self terikat ke class tempat kodenya ditulis, yaitu Induk, sekalipun dipanggil lewat Anak. Ganti dengan static::class kalau ingin hasil Anak.",
        },
      ],
    },
    {
      slug: "oo2-latihan-gabungan",
      title: "Latihan Gabungan: Hierarki Pembayaran",
      summary: "Satukan interface dan polymorphism dalam program pembayaran yang mudah diperluas.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak di tengah, detail di tepi",
          body: "Program penutup modul merangkai alat-alat modul ini dalam satu bentuk yang sering kamu temui di kode nyata: interface `MetodePembayaran` sebagai kontrak, dua class konkret `TransferBank` dan `Ewallet`, serta satu function `proses()` yang parameternya bertipe interface.\n\nPerhatikan `function proses(MetodePembayaran $metode, int $jumlah): string`. Ia tidak tahu class apa yang masuk, dan tidak perlu tahu: semua yang mengikuti kontrak dijamin punya `bayar()`. Menambah metode baru berarti menulis satu class; `proses()` tidak disentuh sama sekali.\n\nUntuk satu input jumlah, program mencetak dua baris: hasil transfer bank lalu hasil ewallet. Ini bentuk paling kecil dari prinsip bergantung pada kontrak, bukan pada implementasi.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

interface MetodePembayaran
{
    public function bayar(int $jumlah): string;
}

function proses(MetodePembayaran $metode, int $jumlah): string
{
    return $metode->bayar($jumlah);
}

// proses(new TransferBank(), 50000) => "Transfer bank Rp50000 berhasil"`,
            caption: "Function cuma kenal kontrak; class konkret urusan belakangan.",
          },
        },
        {
          kind: "quiz",
          question: "Parameter `MetodePembayaran $metode` pada function proses() menerima?",
          options: [
            "Hanya objek class TransferBank",
            "Objek dari class mana pun yang mengimplementasikan MetodePembayaran",
            "String nama metode",
            "Semua objek, tipe diabaikan",
          ],
          answer: 1,
          explanation:
            "Type hint interface menerima semua class yang mengikuti kontraknya. Karena itu proses() tetap bekerja untuk metode pembayaran baru tanpa disentuh.",
        },
        {
          kind: "code",
          title: "Program pembayaran dua metode",
          prompt:
            "Lengkapi tiga kekosongan: kata kunci pengikat class pada interface, tipe parameter function `proses`, dan method kontrak yang dipanggil di dalamnya. Input: satu bilangan jumlah. Keluaran: dua baris, hasil transfer bank lalu ewallet.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

interface MetodePembayaran
{
    public function bayar(int $jumlah): string;
}

class TransferBank ___ MetodePembayaran
{
    public function bayar(int $jumlah): string
    {
        return "Transfer bank Rp$jumlah berhasil";
    }
}

class Ewallet implements MetodePembayaran
{
    public function bayar(int $jumlah): string
    {
        return "Ewallet Rp$jumlah berhasil";
    }
}

function proses(___ $metode, int $jumlah): string
{
    return $metode->___($jumlah);
}

$jumlah = (int) trim(fgets(STDIN));
echo proses(new TransferBank(), $jumlah) . "\\n";
echo proses(new Ewallet(), $jumlah) . "\\n";`,
          solution: `<?php
declare(strict_types=1);

interface MetodePembayaran
{
    public function bayar(int $jumlah): string;
}

class TransferBank implements MetodePembayaran
{
    public function bayar(int $jumlah): string
    {
        return "Transfer bank Rp$jumlah berhasil";
    }
}

class Ewallet implements MetodePembayaran
{
    public function bayar(int $jumlah): string
    {
        return "Ewallet Rp$jumlah berhasil";
    }
}

function proses(MetodePembayaran $metode, int $jumlah): string
{
    return $metode->bayar($jumlah);
}

$jumlah = (int) trim(fgets(STDIN));
echo proses(new TransferBank(), $jumlah) . "\\n";
echo proses(new Ewallet(), $jumlah) . "\\n";`,
          tests: [
            { stdin: "50000", expectedOutput: "Transfer bank Rp50000 berhasil\nEwallet Rp50000 berhasil" },
            { stdin: "7500", expectedOutput: "Transfer bank Rp7500 berhasil\nEwallet Rp7500 berhasil" },
            {
              stdin: "1000000",
              expectedOutput: "Transfer bank Rp1000000 berhasil\nEwallet Rp1000000 berhasil",
              hidden: true,
            },
          ],
          hints: [
            "Pengikat class ke interface ditulis setelah nama class.",
            "Parameter proses bertipe interface, bukan class konkret.",
            "Kontrak MetodePembayaran hanya punya satu method: bayar.",
          ],
        },
      ],
    },
    // ==================== MODUL 5: Error dan Exception ====================
    {
      slug: "err-try-catch",
      title: "Try dan Catch",
      summary: "Jebak kegagalan dengan try/catch dan baca pesannya lewat getMessage.",
      steps: [
        {
          kind: "theory",
          title: "Kejutan yang dijadwalkan",
          body: "Exception adalah objek yang dilempar saat jalur program menabrak keadaan yang tidak boleh dilanjutkan: `throw new Exception(\"stok habis\");`. Begitu terlempar, sisa baris di blok itu dilewati dan eksekusi melompat ke catch yang tipenya cocok. Tanpa catch, program berhenti dengan pesan Uncaught Exception.\n\n`try` membungkus kode yang berisiko, `catch (Exception $e)` menampung objeknya, dan `$e->getMessage()` membawa pesan yang dikirim saat throw. Kebiasaan yang dijaga: jangan menangkap lalu diam; minimal catat kejadian atau sampaikan ke pengguna.\n\nBedakan dengan `if`. Pakai if kalau kegagalan adalah jalur normal seperti input kosong. Pertimbangkan exception kalau kejadiannya menandakan situasi yang tidak boleh diteruskan, misalnya data korup atau konfigurasi hilang.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

try {
    echo "membuka koneksi\\n";
    throw new Exception("server tidak merespons");
    echo "baris ini tidak pernah jalan\\n";
} catch (Exception $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
}`,
            caption: "Baris setelah throw dilewati; kendali pindah ke catch.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana membaca pesan dari objek exception yang ditampung di variabel `$e`?",
          options: ["$e->pesan", "$e->message", "$e->getMessage()", "pesan($e)"],
          answer: 2,
          explanation:
            "Pesan yang dikirim lewat constructor tersimpan di dalam objek dan dibaca dengan method getMessage(), warisan class Exception.",
        },
        {
          kind: "code",
          title: "Penjaga angka negatif",
          prompt:
            "Lengkapi dua kekosongan: kata kunci melempar exception, dan tipe yang ditangkap di catch. Input: satu bilangan. Keluaran `aman: <angka>` kalau tidak negatif, atau `tertangkap: angka negatif` kalau negatif.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$angka = (int) trim(fgets(STDIN));

try {
    if ($angka < 0) {
        ___ new Exception("angka negatif");
    }
    echo "aman: " . $angka . "\\n";
} catch (___ $e) {
    echo "tertangkap: " . $e->getMessage() . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

$angka = (int) trim(fgets(STDIN));

try {
    if ($angka < 0) {
        throw new Exception("angka negatif");
    }
    echo "aman: " . $angka . "\\n";
} catch (Exception $e) {
    echo "tertangkap: " . $e->getMessage() . "\\n";
}`,
          tests: [
            { stdin: "7", expectedOutput: "aman: 7" },
            { stdin: "-5", expectedOutput: "tertangkap: angka negatif" },
            { stdin: "0", expectedOutput: "aman: 0", hidden: true },
          ],
          hints: [
            "Melempar exception dimulai satu kata, diikuti objek Exception-nya.",
            "Yang ditangkap catch adalah tipe yang sama dengan yang dilempar: Exception.",
          ],
        },
      ],
    },
    {
      slug: "err-hierarki-throwable",
      title: "Hierarki Throwable",
      summary: "Kenal dua keluarga besar kesalahan PHP: Error dan Exception, keduanya Throwable.",
      steps: [
        {
          kind: "theory",
          title: "Dua keluarga, satu leluhur",
          body: "Sejak PHP 7, kesalahan runtime yang dulu langsung fatal kini menjadi objek: `TypeError` saat argumen salah tipe, `DivisionByZeroError` saat pembagian nol, `ArgumentCountError` saat argumen kurang. Semuanya anak dari `Error`, dan biasanya menandai bug di kode.\n\n`Exception` menampung kegagalan yang lebih sering sudah diperhitungkan: data tidak valid, sumber daya tidak tersedia. `Error` dan `Exception` sama-sama mengimplementasikan interface `Throwable`, jadi keduanya punya `getMessage()` dan bisa di-catch. `catch (Throwable $t)` menampung keduanya sekaligus, pas untuk jaring pengaman di lapisan terluar.\n\nSatu batasan penting: class buatan sendiri tidak boleh langsung implements Throwable. Butuh exception sendiri? Extends Exception. Error dari mesin sebaiknya dibiarkan naik sampai terlihat, bukan ditangkap lalu disembunyikan.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

function dobel(int $n): int
{
    return $n * 2;
}

try {
    dobel("lima"); // strict types: TypeError
} catch (Throwable $t) {
    echo "tertangkap: " . get_class($t) . "\\n";
    echo $t instanceof Error ? "keluarga Error\\n" : "keluarga Exception\\n";
}`,
            caption: "TypeError berasal dari keluarga Error, tapi tetap tertangkap lewat Throwable.",
          },
        },
        {
          kind: "quiz",
          question: "`TypeError` yang muncul karena argumen salah tipe adalah turunan dari?",
          options: ["Exception", "Error", "LogicException", "RuntimeException"],
          answer: 1,
          explanation:
            "Kesalahan level mesin seperti TypeError, DivisionByZeroError, dan ArgumentCountError masuk keluarga Error, bukan Exception. Keduanya bertemu di interface Throwable.",
        },
      ],
    },
    {
      slug: "err-finally",
      title: "Blok finally",
      summary: "Jalankan pembersihan yang dijamin tereksekusi, entah sukses entah gagal.",
      steps: [
        {
          kind: "theory",
          title: "Kerja bersih yang dijamin",
          body: "Blok `finally` menempel setelah catch dan dijalankan apa pun hasilnya: try lancar, exception tertangkap, bahkan exception yang tidak tertangkap sekalipun. Tempatnya untuk pekerjaan pembersihan yang tidak boleh bolong: menutup file, melepas kunci, mencatat selesai.\n\nTanpa finally, pembersihan harus ditulis dua kali, di ujung try dan di dalam catch, dan jalur exception yang tidak tertangkap tetap bocor. Satu blok finally menyatukannya di satu tempat yang dijamin tereksekusi.\n\nJangan taruh logika hasil di finally; tugasnya urusan kebersihan. Meletakkan `return` di sana juga buruk karena bisa menelan nilai kembalian atau exception yang sedang naik.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

try {
    echo "buka file\\n";
    throw new Exception("disk penuh");
} catch (Exception $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
} finally {
    echo "file ditutup\\n";
}`,
            caption: "Ditutup selalu, lancar atau gagal.",
          },
        },
        {
          kind: "quiz",
          question: "Blok try berisi `return 5;` dan ada blok finally setelahnya. Apakah finally tetap dijalankan?",
          options: [
            "Tidak, return langsung keluar dari fungsi",
            "Ya, finally dijalankan sebelum nilai benar-benar dikembalikan",
            "Hanya jika ada catch yang cocok",
            "Tergantung versi PHP",
          ],
          answer: 1,
          explanation:
            "finally dijamin berjalan apa pun yang terjadi, termasuk saat try atau catch melakukan return. Eksekusi baru benar-benar meninggalkan fungsi setelah finally beres.",
        },
        {
          kind: "code",
          title: "Pembagi dengan laporan selesai",
          prompt:
            "Lengkapi dua kekosongan: class exception yang dilempar saat pembagi nol, dan kata kunci blok penutup yang selalu jalan. Input: satu bilangan pembagi untuk 100. Keluaran hasil atau pesan gagal, lalu selalu diakhiri `selesai`.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

$angka = (int) trim(fgets(STDIN));

try {
    if ($angka === 0) {
        throw new ___("tidak boleh nol");
    }
    echo "hasil: " . intdiv(100, $angka) . "\\n";
} catch (Exception $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
} ___ {
    echo "selesai\\n";
}`,
          solution: `<?php
declare(strict_types=1);

$angka = (int) trim(fgets(STDIN));

try {
    if ($angka === 0) {
        throw new Exception("tidak boleh nol");
    }
    echo "hasil: " . intdiv(100, $angka) . "\\n";
} catch (Exception $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
} finally {
    echo "selesai\\n";
}`,
          tests: [
            { stdin: "4", expectedOutput: "hasil: 25\nselesai" },
            { stdin: "0", expectedOutput: "gagal: tidak boleh nol\nselesai" },
            { stdin: "10", expectedOutput: "hasil: 10\nselesai", hidden: true },
          ],
          hints: [
            "Tipe yang dilempar dan ditangkap sama: Exception.",
            "Blok yang dijamin berjalan di akhir diberi kata finally.",
          ],
        },
      ],
    },
    {
      slug: "err-throw-rethrow",
      title: "Throw dan Melempar Ulang",
      summary: "Catat kegagalan lalu teruskan exception yang sama ke lapisan atas.",
      steps: [
        {
          kind: "theory",
          title: "Menangkap bukan berarti memiliki",
          body: "Ada lapisan yang cuma berhak mencatat kejadian, sementara keputusan penanganan ada di pemanggilnya. Polanya: catch, kerjakan tugas lokal seperti mencatat, lalu `throw $e;` untuk melempar objek yang sama ke atas.\n\nPHP juga mendukung chaining: `throw new RuntimeException(\"gagal simpan\", previous: $e);` menyimpan exception asli sebagai previous dan bisa dibaca lewat `getPrevious()`. Rantai ini menyimpan akar masalah, bukan menggantinya dengan versi yang kehilangan informasi.\n\nDua kebiasaan yang dihindari: catch kosong yang menelan kegagalan diam-diam, dan mengganti exception asli dengan yang kehilangan konteks. Kalau tidak punya sesuatu yang berguna untuk ditambahkan, melempar ulang objek yang sama lebih jujur.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

try {
    try {
        throw new Exception("kunci tabel gagal");
    } catch (Exception $e) {
        echo "dicatat: " . $e->getMessage() . "\\n";
        throw $e; // teruskan ke lapisan atas
    }
} catch (Exception $e) {
    echo "ditangani: " . $e->getMessage() . "\\n";
}`,
            caption: "Dua lapisan, satu objek exception yang sama.",
          },
        },
        {
          kind: "quiz",
          question:
            "Ada `throw new Exception(\"gagal\");` lalu di baris berikutnya `echo \"lanjut\";` di blok yang sama. Baris echo itu?",
          options: [
            "Jalan dulu sebelum exception terlempar",
            "Tidak pernah dijalankan",
            "Jalan hanya kalau exception tertangkap",
            "Menyebabkan error sintaks",
          ],
          answer: 1,
          explanation:
            "throw menghentikan eksekusi blok seketika, jadi baris tepat setelahnya tak terjangkau. finally tetap berjalan, tapi bukan baris itu.",
        },
        {
          kind: "code",
          title: "Penjaga yang bocor",
          prompt:
            "Program ini seharusnya mencetak dua baris `dicatat: pembagi nol` lalu `ditangani: pembagi nol` saat pembaginya 0. Satu tipe di inner catch salah tulis sehingga baris pertama hilang. Perbaiki, lalu pastikan pembagi bukan nol tetap mencetak `hasil: <hasil>`.",
          mode: "fix",
          template: `<?php
declare(strict_types=1);

function bagi(int $a, int $b): int
{
    if ($b === 0) {
        throw new Exception("pembagi nol");
    }
    return intdiv($a, $b);
}

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

try {
    try {
        echo "hasil: " . bagi($a, $b) . "\\n";
    } catch (Error $e) {
        echo "dicatat: " . $e->getMessage() . "\\n";
        throw $e;
    }
} catch (Exception $e) {
    echo "ditangani: " . $e->getMessage() . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

function bagi(int $a, int $b): int
{
    if ($b === 0) {
        throw new Exception("pembagi nol");
    }
    return intdiv($a, $b);
}

$a = (int) trim(fgets(STDIN));
$b = (int) trim(fgets(STDIN));

try {
    try {
        echo "hasil: " . bagi($a, $b) . "\\n";
    } catch (Exception $e) {
        echo "dicatat: " . $e->getMessage() . "\\n";
        throw $e;
    }
} catch (Exception $e) {
    echo "ditangani: " . $e->getMessage() . "\\n";
}`,
          tests: [
            { stdin: "10\n2", expectedOutput: "hasil: 5" },
            { stdin: "10\n0", expectedOutput: "dicatat: pembagi nol\nditangani: pembagi nol" },
            { stdin: "9\n3", expectedOutput: "hasil: 3", hidden: true },
          ],
          hints: [
            "Jalankan dengan pembagi 0: baris `dicatat` hilang karena inner catch tidak cocok.",
            "function bagi melempar Exception, sedangkan inner catch menangkap Error. Samakan tipenya.",
          ],
        },
      ],
    },
    {
      slug: "err-custom-exception",
      title: "Custom Exception",
      summary: "Buat jenis kegagalan milik domain supaya bisa ditangkap secara spesifik.",
      steps: [
        {
          kind: "theory",
          title: "Ke gagalan yang bernama",
          body: "Exception kustom dibuat dengan extends Exception, sering kali tanpa isi baru: `class SaldoTidakCukupException extends Exception {}`. Nilainya ada di nama. Catch yang menuliskan jenis ini menyatakan maksud dengan jelas, tidak seperti membaca string pesan lalu menebak jenisnya.\n\nNama mengikuti isi kegagalan, dan konvensi umum memberi akhiran Exception. Dengan jenis yang berbeda, catch bisa berlapis: jenis spesifik di atas untuk penanganan khusus, `Exception` generik di bawah menampung sisanya.\n\nPerlu membawa data tambahan seperti kekurangan saldo? Tambahkan property dan constructor seperti class biasa. Tapi tahan diri: kebanyakan exception cukup warisan pesan dari induknya.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

class KodePromoKadaluarsaException extends Exception
{
}

function terapkan(string $kode): string
{
    if ($kode === "LAMA") {
        throw new KodePromoKadaluarsaException("promo $kode sudah berakhir");
    }
    return "promo $kode aktif";
}

try {
    echo terapkan("LAMA") . "\\n";
} catch (KodePromoKadaluarsaException $e) {
    echo "ditolak: " . $e->getMessage() . "\\n";
}`,
            caption: "Jenis exception menyatakan arti kegagalan; pesan cuma pelengkap.",
          },
        },
        {
          kind: "quiz",
          question: "Cara yang benar membuat exception kustom bernama StokHabis?",
          options: [
            "class StokHabis implements Exception",
            "class StokHabis extends Exception",
            "interface StokHabis extends Throwable",
            "exception StokHabis",
          ],
          answer: 1,
          explanation:
            "Exception kustom adalah class yang mewarisi Exception. Interface Throwable sengaja tidak bisa diimplementasikan langsung oleh class buatan sendiri.",
        },
        {
          kind: "code",
          title: "Rekening dengan aturan tarik",
          prompt:
            "Lengkapi tiga kekosongan: class induk untuk exception kustom, jenis yang dilempar saat saldo tidak cukup, dan jenis yang ditangkap di catch. Input: satu bilangan nominal tarik dari saldo awal 100000. Keluaran sisa saldo atau pesan gagal.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

class SaldoTidakCukupException extends ___
{
}

class Rekening
{
    public function __construct(private int $saldo) {}

    public function tarik(int $nominal): int
    {
        if ($nominal > $this->saldo) {
            throw new ___("saldo kurang " . ($nominal - $this->saldo));
        }
        $this->saldo -= $nominal;
        return $this->saldo;
    }
}

$rekening = new Rekening(100000);
$nominal = (int) trim(fgets(STDIN));

try {
    echo "sisa: " . $rekening->tarik($nominal) . "\\n";
} catch (___ $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

class SaldoTidakCukupException extends Exception
{
}

class Rekening
{
    public function __construct(private int $saldo) {}

    public function tarik(int $nominal): int
    {
        if ($nominal > $this->saldo) {
            throw new SaldoTidakCukupException("saldo kurang " . ($nominal - $this->saldo));
        }
        $this->saldo -= $nominal;
        return $this->saldo;
    }
}

$rekening = new Rekening(100000);
$nominal = (int) trim(fgets(STDIN));

try {
    echo "sisa: " . $rekening->tarik($nominal) . "\\n";
} catch (SaldoTidakCukupException $e) {
    echo "gagal: " . $e->getMessage() . "\\n";
}`,
          tests: [
            { stdin: "40000", expectedOutput: "sisa: 60000" },
            { stdin: "150000", expectedOutput: "gagal: saldo kurang 50000" },
            { stdin: "100000", expectedOutput: "sisa: 0", hidden: true },
          ],
          hints: [
            "Exception kustom menumpang pada satu class induk bawaan PHP.",
            "Yang dilempar dan ditangkap bernama sama: SaldoTidakCukupException.",
            "Kekurangan saldo dihitung nominal dikurangi saldo saat ini.",
          ],
        },
      ],
    },
    {
      slug: "err-multiple-catch",
      title: "Multiple Catch Berurutan",
      summary: "Susun beberapa catch dari yang paling spesifik ke paling umum.",
      steps: [
        {
          kind: "theory",
          title: "Spesifik di atas, umum di bawah",
          body: "Satu try boleh diikuti banyak catch. PHP memeriksa dari atas ke bawah dan memakai blok pertama yang tipenya cocok, sisanya dilewati. Karena itu urutan adalah keputusan desain: jenis sempit di atas untuk penanganan khusus, jenis lebar di bawah untuk sisanya.\n\nTaruh `catch (Exception $e)` paling atas dan semua turunannya tertangkap di situ; catch di bawahnya jadi blok mati yang tidak pernah terjangkau. Kondisi ini bahkan ditandai oleh banyak linter PHP sebagai unreachable.\n\nSusunan yang sehat di aplikasi nyata: exception domain di atas untuk keputusan khusus, lalu `Exception` atau `Throwable` paling bawah sebagai jaring pengaman yang mencatat kejutan.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

try {
    throw new InvalidArgumentException("email kosong");
} catch (InvalidArgumentException $e) {
    echo "input salah: " . $e->getMessage() . "\\n";
} catch (Exception $e) {
    echo "kesalahan lain: " . $e->getMessage() . "\\n";
}`,
            caption: "Blok pertama yang cocok mengambil tugas; sisanya dilewati.",
          },
        },
        {
          kind: "quiz",
          question:
            "Sebuah try punya `catch (Exception $e)` di atas dan `catch (LogicException $e)` di bawah. Sebuah LogicException dilempar. Blok mana yang berjalan?",
          options: [
            "catch LogicException karena tipenya paling dekat",
            "catch Exception karena diperiksa lebih dulu dan cocok",
            "Keduanya berjalan berurutan",
            "Tidak ada; exception lolos tak tertangkap",
          ],
          answer: 1,
          explanation:
            "Pemeriksaan berhenti di blok pertama yang cocok. LogicException adalah turunan Exception, jadi blok atas menang dan blok bawah tak pernah terjangkau.",
        },
        {
          kind: "code",
          title: "Tiga jalur keluaran",
          prompt:
            "Lengkapi dua kekosongan: jenis exception yang dilempar untuk kode nol, dan jenis yang ditangkap blok pertama. Input: satu bilangan kode. Keluaran menunjukkan jalur mana yang ditempuh.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

function periksa(int $kode): string
{
    if ($kode < 0) {
        throw new InvalidArgumentException("kode negatif");
    }
    if ($kode === 0) {
        throw new ___("kode nol");
    }
    return "kode ok: " . $kode;
}

$kode = (int) trim(fgets(STDIN));

try {
    echo periksa($kode) . "\\n";
} catch (___ $e) {
    echo "input salah: " . $e->getMessage() . "\\n";
} catch (Exception $e) {
    echo "kesalahan lain: " . $e->getMessage() . "\\n";
}`,
          solution: `<?php
declare(strict_types=1);

function periksa(int $kode): string
{
    if ($kode < 0) {
        throw new InvalidArgumentException("kode negatif");
    }
    if ($kode === 0) {
        throw new RuntimeException("kode nol");
    }
    return "kode ok: " . $kode;
}

$kode = (int) trim(fgets(STDIN));

try {
    echo periksa($kode) . "\\n";
} catch (InvalidArgumentException $e) {
    echo "input salah: " . $e->getMessage() . "\\n";
} catch (Exception $e) {
    echo "kesalahan lain: " . $e->getMessage() . "\\n";
}`,
          tests: [
            { stdin: "5", expectedOutput: "kode ok: 5" },
            { stdin: "-3", expectedOutput: "input salah: kode negatif" },
            { stdin: "0", expectedOutput: "kesalahan lain: kode nol", hidden: true },
          ],
          hints: [
            "Untuk kode nol, dilempar anak Exception yang bukan anak InvalidArgumentException, jadi jatuh ke catch generik.",
            "Blok pertama menangkap jenis yang sama dengan yang dilempar saat kode negatif.",
          ],
        },
      ],
    },
    {
      slug: "err-vs-error",
      title: "Error vs Exception",
      summary: "Bedakan kegagalan mesin dan kegagalan alur sebelum memutuskan menangkap.",
      steps: [
        {
          kind: "theory",
          title: "Tiga rupa kegagalan",
          body: "PHP menampung kegagalan dalam beberapa bentuk. `Warning` dan `Notice` bukan exception: mereka catatan di keluaran yang tidak menghentikan program, misalnya membaca index array yang belum ada. Yang berubah menjadi objek adalah keluarga `Error`: `TypeError`, `DivisionByZeroError`, dan kawan-kawan yang menandai bug.\n\nKarena itu `catch (Throwable $t)` yang menangkap luas hanya pantas di lapisan terluar aplikasi: mencatat, menampilkan halaman rapi, lalu berhenti dengan sopan. Menangkap Error di dalam logika bisnis justru menyembunyikan bug; pembagian nol dan tipe salah harusnya diperbaiki, bukan ditelan.\n\nAturan praktisnya: Exception untuk keadaan yang bisa diantisipasi pemilik kode, Error dibiarkan naik sampai terlihat dan akarnya dibasmi.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

$daftar = [1, 2, 3];
// $daftar[10]; // Warning: bukan exception, program tetap jalan

try {
    intdiv(5, 0); // ini bukan warning, ini Error
} catch (DivisionByZeroError $e) {
    echo "tertangkap: " . $e->getMessage() . "\\n";
}`,
            caption: "Warning cuma berbisik, Error dilempar sebagai objek.",
          },
        },
        {
          kind: "quiz",
          question: "Objek `DivisionByZeroError` yang muncul saat pembagian bilangan bulat dengan nol adalah instance dari interface?",
          options: ["Exception", "Throwable", "RuntimeException", "Warning"],
          answer: 1,
          explanation:
            "Keluarga Error dan Exception sama-sama mengimplementasikan interface Throwable, sebab itulah keduanya bisa di-catch dengan satu jaring yang sama.",
        },
      ],
    },
    {
      slug: "err-error-reporting",
      title: "error_reporting dan Tingkat Error",
      summary: "Atur apa yang dilaporkan, ditampilkan, dan dicatat supaya bug tidak tersembunyi.",
      steps: [
        {
          kind: "theory",
          title: "Lapor, tampil, catat: tiga setelan berbeda",
          body: "PHP memilah kesalahan ke dalam tingkat: `E_ERROR` yang fatal, `E_WARNING` untuk masalah serius yang tidak menghentikan program, `E_NOTICE` sebagai indikasi keliru seperti variabel yang belum diisi, dan `E_DEPRECATED` untuk fitur yang menua. Direktif `error_reporting` menentukan tingkat mana yang dilaporkan, dan `error_reporting(E_ALL)` adalah setelan yang disarankan saat mengembangkan.\n\nMelapor berbeda dengan menampilkan. `display_errors` mengatur apakah laporan muncul di keluaran program, `log_errors` mengatur pencatatan ke file log. Setelan produksi yang sehat: laporan tetap `E_ALL`, display mati, log hidup; pengguna tidak melihat jejak internal, tim tetap punya jejak untuk diselidiki.\n\nYang dihindari: mematikan pelaporan supaya pesan hilang. Warning yang disembunyikan lewat setelan bukan warning yang hilang; ia cuma tidak terlihat, dan penyebabnya tetap tinggal di kode.",
          code: {
            language: "php",
            content: `<?php

// setelan produksi yang sehat, biasanya di php.ini:
// error_reporting = E_ALL
// display_errors = Off
// log_errors = On

error_reporting(E_ALL);
ini_set("display_errors", "0"); // jangan tampilkan ke pengguna
ini_set("log_errors", "1");     // catat ke log untuk diselidiki`,
            caption: "Laporan tetap lengkap; yang diatur cuma jalannya, layar atau log.",
          },
        },
        {
          kind: "quiz",
          question: "Setelan produksi yang membuat laporan error tidak tampil ke pengguna tapi tetap terekam adalah?",
          options: [
            "error_reporting(0) dengan log_errors aktif",
            "display_errors mati dengan log_errors aktif",
            "display_errors aktif dengan log_errors mati",
            "error_reporting(E_ALL) dengan display_errors aktif",
          ],
          answer: 1,
          explanation:
            "display_errors mengatur tampilan ke pengguna, log_errors mengatur pencatatan. Produksi yang sehat: tampilan mati, pencatatan hidup, laporan tetap lengkap di E_ALL.",
        },
      ],
    },
    {
      slug: "err-logging",
      title: "Logging dengan error_log",
      summary: "Catat kejadian penting ke aliran log, dan kenali bedanya dengan keluaran program.",
      steps: [
        {
          kind: "theory",
          title: "Catatan di aliran sebelah",
          body: "`error_log(\"pesanan gagal diproses\")` adalah cara tercepat mencatat kejadian. Di CLI tanpa setelan tambahan, pesannya mengalir ke stderr, bukan stdout. Keduanya bercampur di terminal sehingga sulit dibedakan mata, tapi secara teknis dua aliran berbeda: stdout untuk hasil program, stderr untuk catatan diagnostik.\n\nUntuk platform latihan yang menilai stdout, log yang tidak muncul di hasil penilaian itu perilaku yang benar: log bukan bagian jawaban. Di aplikasi nyata, tujuan bisa diatur lewat parameter kedua `error_log()`, dari file tertentu sampai layanan pengiriman pesan.\n\nKapan mencatat, kapan melempar? Log untuk kejadian yang layak diingat tapi tidak mengubah alur, misalnya percobaan login gagal. Exception untuk keadaan yang memaksa alur berubah. Mencatat lalu melanjutkan seolah aman adalah cara memelihara insiden agar tumbuh diam-diam.",
          code: {
            language: "php",
            content: `<?php

error_log("percobaan login gagal untuk user 42"); // mengalir ke stderr
echo "login gagal\\n"; // hasil program, di stdout`,
            caption: "Dua aliran berbeda: hasil di stdout, catatan di stderr.",
          },
        },
        {
          kind: "quiz",
          question: "Di CLI standar, ke mana pesan `error_log(\"mulai\")` mengalir?",
          options: [
            "Ke stdout, bercampur dengan hasil echo",
            "Ke stderr, terpisah dari hasil program",
            "Otomatis ke file bernama error.log",
            "Tidak ke mana-mana, hanya di memori",
          ],
          answer: 1,
          explanation:
            "Tanpa parameter tambahan, error_log menulis ke stderr. Hasil program di stdout tetap bersih, dan itulah alasan log tidak mengganggu penilaian otomatis.",
        },
      ],
    },
    {
      slug: "err-latihan-gabungan",
      title: "Latihan Gabungan: Validasi Usia",
      summary: "Rangkai custom exception, multiple catch, dan finally jadi validator input yang tegas.",
      steps: [
        {
          kind: "theory",
          title: "Validator yang jujur",
          body: "Program penutup modul menerima satu baris usia lalu menimbangnya di function `validasiUsia()`. Input yang bukan angka melempar `InvalidArgumentException`, usia di luar rentang 17 sampai 120 melempar `UsiaInvalidException` buatan sendiri, dan nilai yang sah dikembalikan sebagai int.\n\nDi lapisan pemanggil, dua catch berurutan membedakan nasib: input salah berujung pesan `input salah`, usia tak wajar berujung `ditolak`. Blok finally menutup dengan `pemeriksaan selesai` apa pun hasilnya. Catat kebiasaannya: catch spesifik ditaruh sebelum catch generik.\n\nPola ini layak dibawa pulang: fungsi validasi jujur melempar, pemanggil yang memutuskan tampilan. Menambah aturan berarti menambah throw di satu tempat, bukan mencabut if bersarang di banyak tempat.",
          code: {
            language: "php",
            content: `<?php
declare(strict_types=1);

class UsiaInvalidException extends Exception
{
}

function validasiUsia(string $input): int
{
    if (!is_numeric($input)) {
        throw new InvalidArgumentException("bukan angka");
    }
    $usia = (int) $input;
    if ($usia < 17 || $usia > 120) {
        throw new UsiaInvalidException("usia di luar rentang");
    }
    return $usia;
}`,
            caption: "Lempar secepat mungkin, tangkap di lapisan yang tahu harus berbuat apa.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dalam validator ini, catch `InvalidArgumentException` sengaja ditulis sebelum catch yang lebih generik. Alasan terkuatnya?",
          options: [
            "PHP mewajibkan urutan abjad pada catch",
            "Blok pertama yang cocok menang; catch generik di atas akan melahap semuanya dan catch spesifik jadi sia-sia",
            "InvalidArgumentException lebih cepat diproses di posisi atas",
            "Supaya pesan errornya berbahasa Indonesia",
          ],
          answer: 1,
          explanation:
            "Pemeriksaan catch berhenti di blok pertama yang cocok. Menaruh jenis lebar di depan membuat jenis sempit di belakangnya tak pernah terjangkau.",
        },
        {
          kind: "code",
          title: "Validator usia lengkap",
          prompt:
            "Lengkapi tiga kekosongan: jenis exception kustom untuk usia di luar rentang, jenis yang ditangkap untuk input bukan angka, dan kata kunci blok penutup yang selalu jalan. Input: satu baris usia. Rentang sah: 17 sampai 120.",
          mode: "fill",
          template: `<?php
declare(strict_types=1);

class UsiaInvalidException extends Exception
{
}

function validasiUsia(string $input): int
{
    if (!is_numeric($input)) {
        throw new InvalidArgumentException("bukan angka");
    }
    $usia = (int) $input;
    if ($usia < 17 || $usia > 120) {
        throw new ___("usia di luar rentang");
    }
    return $usia;
}

$input = trim(fgets(STDIN));

try {
    echo "terdaftar usia " . validasiUsia($input) . "\\n";
} catch (___ $e) {
    echo "input salah: " . $e->getMessage() . "\\n";
} catch (UsiaInvalidException $e) {
    echo "ditolak: " . $e->getMessage() . "\\n";
} ___ {
    echo "pemeriksaan selesai\\n";
}`,
          solution: `<?php
declare(strict_types=1);

class UsiaInvalidException extends Exception
{
}

function validasiUsia(string $input): int
{
    if (!is_numeric($input)) {
        throw new InvalidArgumentException("bukan angka");
    }
    $usia = (int) $input;
    if ($usia < 17 || $usia > 120) {
        throw new UsiaInvalidException("usia di luar rentang");
    }
    return $usia;
}

$input = trim(fgets(STDIN));

try {
    echo "terdaftar usia " . validasiUsia($input) . "\\n";
} catch (InvalidArgumentException $e) {
    echo "input salah: " . $e->getMessage() . "\\n";
} catch (UsiaInvalidException $e) {
    echo "ditolak: " . $e->getMessage() . "\\n";
} finally {
    echo "pemeriksaan selesai\\n";
}`,
          tests: [
            { stdin: "25", expectedOutput: "terdaftar usia 25\npemeriksaan selesai" },
            { stdin: "abc", expectedOutput: "input salah: bukan angka\npemeriksaan selesai" },
            { stdin: "9", expectedOutput: "ditolak: usia di luar rentang\npemeriksaan selesai", hidden: true },
          ],
          hints: [
            "Usia di luar rentang memakai jenis yang dideklarasikan di atas.",
            "Input bukan angka jatuh ke blok pertama: InvalidArgumentException.",
            "Blok pembersih di akhir diberi kata finally.",
          ],
        },
      ],
    },
  ],
};
