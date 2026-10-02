import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "c",
  moduleRange: [4, 5],
  modules: [
    {
      title: "Struct, Union, Enum",
      description: "struct, padding, typedef, union, enum, dan nested data.",
    },
    {
      title: "Fungsi Lanjut",
      description: "Function pointer, rekursi, variadic, dan organisasi header multi-file.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: Struct, Union, Enum ====================
    {
      slug: "struct-dasar",
      title: "Struct: Mengelompokkan Data",
      summary: "Kumpulkan beberapa data jadi satu tipe baru dengan struct dan akses isinya dengan titik.",
      steps: [
        {
          kind: "theory",
          title: "Satu kartu data dari beberapa variabel",
          body: "Variabel yang berdiri sendiri cepat menyebar: nama di satu sisi, stok di sisi lain, dan keduanya harus dijaga berpasangan secara manual. `struct` menggabungkan beberapa variabel menjadi satu tipe baru. Definisinya menyebut nama struct lalu daftar member di dalam kurung kurawal, dan tanda titik koma setelah kurung tutup wajib, karena sering terlewat dan menjadi sumber error pertama.\n\nSetelah tipe didefinisikan, buat variabelnya dengan `struct Produk p;`. Isi awal bisa diberikan sekaligus dengan kurung kurawal mengikuti urutan member, atau satu per satu lewat tanda titik: `p.stok = 12;`. Member struct diperlakukan persis seperti variabel biasa, termasuk saat dipindai `scanf`, yang meminta alamatnya dengan `&`.\n\nAnggap struct sebagai kartu data: satu kartu berisi beberapa informasi, dan kartu bisa dibuat banyak. Modul ini berangkat dari kartu tunggal, lalu mengirimkannya ke fungsi, menumpuknya dalam array, sampai menyarangkannya di dalam kartu lain.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n    double harga;\n};\n\nint main(void) {\n    struct Produk p = {\"Kabel\", 12, 15000.0};\n    p.stok = p.stok - 2;\n    printf(\"%s stok %d harga %.0f\\n\", p.nama, p.stok, p.harga);\n    return 0;\n}",
            caption: "Urutan pengisian mengikuti urutan member di struct.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `struct Titik { int x; int y; };` dan `struct Titik t = {3, 4};`, berapa nilai `t.y`?",
          options: ["3", "4", "0", "error kompilasi"],
          answer: 1,
          explanation: "Pengisian dengan kurung kurawal mengikuti urutan deklarasi member: 3 masuk ke x dan 4 masuk ke y.",
        },
        {
          kind: "code",
          title: "Isi kartu produk pertamamu",
          prompt: "Lengkapi deklarasi variabel struct dan alamat member untuk scanf, lalu jalankan: stok otomatis ditambah 5. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n};\n\nint main(void) {\n    ___ Produk p;\n    scanf(\"%s %d\", p.nama, ___);\n    p.stok = p.stok + 5;\n    printf(\"%s: stok %d\\n\", p.nama, p.stok);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n};\n\nint main(void) {\n    struct Produk p;\n    scanf(\"%s %d\", p.nama, &p.stok);\n    p.stok = p.stok + 5;\n    printf(\"%s: stok %d\\n\", p.nama, p.stok);\n    return 0;\n}",
          tests: [
            { stdin: "Kabel 12", expectedOutput: "Kabel: stok 17" },
            { stdin: "Resistor 240", expectedOutput: "Resistor: stok 245" },
            { stdin: "LED 8", expectedOutput: "LED: stok 13", hidden: true },
          ],
          hints: [
            "Untuk mendeklarasikan variabel bertipe struct, sebut kata kunci tipenya di depan nama variabel.",
            "scanf butuh alamat variabel, dan member struct diperlakukan seperti variabel biasa.",
            "Blank pertama diisi struct, blank kedua diisi &p.stok.",
          ],
        },
      ],
    },
    {
      slug: "struct-fungsi",
      title: "Struct dan Fungsi",
      summary: "Kirim struct ke fungsi, pahami salinan by value, dan ubah data aslinya lewat pointer.",
      steps: [
        {
          kind: "theory",
          title: "Seluruh kartu disalin, bukan cuma alamatnya",
          body: "C selalu menyalin argumen, dan untuk struct yang berarti seluruh member ikut disalin. Fungsi yang menerima `struct Produk p` bekerja pada duplikat: mengubah `p.stok` di dalamnya tidak pernah menyentuh variabel asli pemanggil. Untuk struct kecil itu murah dan aman, tapi pola ini menjelaskan kenapa fungsi terasa \"tidak jalan\" padahal ia justru berlaku jujur pada salinannya.\n\nKetika fungsi harus mengubah aslinya, kirim alamatnya: `restock(&p, 8)` dengan parameter `struct Produk *p`. Akses member lewat pointer memakai panah: `p->stok`, singkatan dari `(*p).stok`. Panah mendereference dulu, baru mengambil member, dan bentuk inilah yang dipakai kode C nyata hampir tanpa kecuali.\n\nUntuk fungsi yang hanya membaca, kebiasaan yang baik adalah `const struct Produk *p`: tidak menyalin data, sekaligus menjanjikan kepada pemanggil bahwa isinya tidak akan diubah. Hemat dan terdokumentasi dalam satu tanda tangan fungsi.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n};\n\nvoid tampilkan(struct Produk *p) {\n    printf(\"%s: %d\\n\", p->nama, p->stok);\n}\n\nvoid restock(struct Produk *p, int tambah) {\n    p->stok = p->stok + tambah;\n}\n\nint main(void) {\n    struct Produk p = {\"Kabel\", 12};\n    restock(&p, 8);\n    tampilkan(&p);\n    return 0;\n}",
            caption: "p->stok adalah singkatan dari (*p).stok.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam fungsi dengan parameter `struct Produk *p`, ekspresi `p->stok` sama artinya dengan...",
          options: ["p.stok", "(*p).stok", "*p.stok", "&p.stok"],
          answer: 1,
          explanation: "Panah mendereference pointer lalu mengakses member. Bentuk panjangnya (*p).stok, dan tanda kurung wajib karena titik mengikat lebih kuat daripada bintang.",
        },
        {
          kind: "code",
          title: "Restock yang arahnya terbalik",
          prompt: "Fungsi restock sudah menerima alamat struct dengan benar, tapi setiap tes hasilnya justru berkurang. Perbaiki satu kesalahan di badan fungsi sampai semua tes lulus.",
          mode: "fix",
          template: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n};\n\nvoid restock(struct Produk *p, int tambah) {\n    p->stok = p->stok - tambah;\n}\n\nint main(void) {\n    struct Produk p;\n    int tambah;\n    scanf(\"%s %d %d\", p.nama, &p.stok, &tambah);\n    restock(&p, tambah);\n    printf(\"%s: stok %d\\n\", p.nama, p.stok);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nstruct Produk {\n    char nama[16];\n    int stok;\n};\n\nvoid restock(struct Produk *p, int tambah) {\n    p->stok = p->stok + tambah;\n}\n\nint main(void) {\n    struct Produk p;\n    int tambah;\n    scanf(\"%s %d %d\", p.nama, &p.stok, &tambah);\n    restock(&p, tambah);\n    printf(\"%s: stok %d\\n\", p.nama, p.stok);\n    return 0;\n}",
          tests: [
            { stdin: "Kabel 12 8", expectedOutput: "Kabel: stok 20" },
            { stdin: "RAM 30 15", expectedOutput: "RAM: stok 45" },
            { stdin: "SSD 5 10", expectedOutput: "SSD: stok 15", hidden: true },
          ],
          hints: [
            "Jalankan satu tes dan bandingkan arah perubahan stoknya dengan yang diminta soal.",
            "Menambah stok berarti menjumlahkan tambah ke nilai lama, bukan menguranginya.",
            "Ganti tanda minus menjadi tanda tambah pada baris p->stok = ...",
          ],
        },
      ],
    },
    {
      slug: "typedef-struct",
      title: "typedef untuk Struct",
      summary: "Buang kata struct yang berulang-ulang dengan alias typedef.",
      steps: [
        {
          kind: "theory",
          title: "Satu nama untuk tipe yang sama",
          body: "Menulis `struct Produk p;` di setiap deklarasi cepat terasa berat. `typedef` memberi tipe itu nama pendek: `typedef struct { ... } Produk;` membuat `Produk` menjadi nama tipe yang sah, dan sejak itu cukup `Produk p;`. Yang terjadi bukan tipe baru, hanya nama lain untuk tipe yang persis sama.\n\nAda dua gaya yang lazim. Gaya tanpa tag seperti di atas ringkas dan cukup untuk kebanyakan kasus. Gaya `typedef struct Titik { ... } Titik;` menyimpan tag sekaligus alias dengan nama sama, berguna saat struct perlu menyebut dirinya sendiri, misalnya member `struct Titik *berikutnya` pada linked list di modul struktur data nanti.\n\nKonvensi penamaannya: alias ditulis huruf besar di awal (PascalCase) supaya mata langsung membedakan tipe dari variabel. Setelah terbiasa, hampir semua struct di kode produksi dibungkus typedef, dan kata `struct` hanya muncul di tempat yang memang membutuhkannya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\ndouble jarak_kuadrat(Titik a) {\n    return (double)a.x * a.x + (double)a.y * a.y;\n}\n\nint main(void) {\n    Titik t = {3, 4};\n    printf(\"%.0f\\n\", jarak_kuadrat(t));\n    return 0;\n}",
            caption: "Parameter fungsi cukup ditulis Titik, tanpa kata struct.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `typedef struct { int berat; } Kargo;`, cara mendeklarasikan variabel yang benar adalah...",
          options: ["struct Kargo k;", "Kargo k;", "typedef Kargo k;", "Kargo = k;"],
          answer: 1,
          explanation: "typedef menjadikan Kargo nama tipe yang lengkap, jadi kata struct tidak diperlukan lagi. Bentuk struct Kargo bahkan gagal karena struct ini dideklarasikan tanpa tag.",
        },
        {
          kind: "code",
          title: "Singkatkan dengan typedef",
          prompt: "Lengkali alias typedef-nya dan deklarasi variabelnya, lalu program membaca titik dan mencetak jumlah kuadrat koordinatnya. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\n___ struct {\n    int x;\n    int y;\n} Titik;\n\nint main(void) {\n    ___ t;\n    scanf(\"%d %d\", &t.x, &t.y);\n    printf(\"jumlah kuadrat %d\\n\", t.x * t.x + t.y * t.y);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\nint main(void) {\n    Titik t;\n    scanf(\"%d %d\", &t.x, &t.y);\n    printf(\"jumlah kuadrat %d\\n\", t.x * t.x + t.y * t.y);\n    return 0;\n}",
          tests: [
            { stdin: "3 4", expectedOutput: "jumlah kuadrat 25" },
            { stdin: "2 6", expectedOutput: "jumlah kuadrat 40" },
            { stdin: "0 0", expectedOutput: "jumlah kuadrat 0", hidden: true },
          ],
          hints: [
            "Kata kunci yang memberi alias pada tipe ditulis di depan struct.",
            "Setelah typedef, nama alias bisa langsung dipakai untuk mendeklarasikan variabel.",
            "Blank pertama typedef, blank kedua Titik.",
          ],
        },
      ],
    },
    {
      slug: "struct-bersarang",
      title: "Struct Berisi Struct",
      summary: "Susun data bertingkat: struct di dalam struct dan aksesnya dengan titik bertingkat.",
      steps: [
        {
          kind: "theory",
          title: "Kartu di dalam kartu",
          body: "Member struct boleh berupa struct lain, asalkan tipenya sudah didefinisikan lebih dulu. Pola ini mengikuti cara berpikir alami: `Titik` mengurus posisi, lalu `Kotak` memakai `Titik` untuk kiri atas ditambah lebar dan tinggi sendiri. Data kecil dibangun dari data yang lebih kecil, dan tiap tingkat tetap sederhana.\n\nInisialisasinya bersarang: `Kotak k = {{2, 3}, 10, 5};`. Aksesnya pun bertingkat: `k.kiri_atas.x` membaca koordinat x dari posisi kotak. Menugaskan seluruh struct juga sah: `k.posisi = titik_lain;` menyalin semua member sekaligus, termasuk saat struct bersarang.\n\nBatasi kedalamannya pada yang masih mudah dilacak; dua sampai tiga tingkat biasanya cukup. Jika mulai terasa seperti hierarki tak berujung, tanda desainnya bukan di C, melainkan di cara membagi data yang terlalu dipaksakan ke satu struktur.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\ntypedef struct {\n    Titik posisi;\n    int lebar;\n    int tinggi;\n} Kotak;\n\nint main(void) {\n    Kotak k = {{2, 3}, 10, 5};\n    k.posisi.x = k.posisi.x + 1;\n    printf(\"posisi %d,%d\\n\", k.posisi.x, k.posisi.y);\n    printf(\"luas %d\\n\", k.lebar * k.tinggi);\n    return 0;\n}",
            caption: "Titik didefinisikan lebih dulu supaya bisa dipakai Kotak.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk variabel `Kotak k;` yang member-nya `Titik posisi;`, cara membaca koordinat x posisi adalah...",
          options: ["k.x", "k.posisi.x", "k->posisi->x", "posisi.k.x"],
          answer: 1,
          explanation: "Akses member menyusuri tingkat demi tingkat dari variabel terluar: dulu posisi, baru x. Panah hanya dipakai jika yang dipegang pointer.",
        },
        {
          kind: "code",
          title: "Geser kiri atas kotak",
          prompt: "Program membaca titik kiri atas lalu lebar dan tinggi. Lengkapi akses member yang bersarang dan perhitungan luasnya. Ganti ketiga `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\ntypedef struct {\n    Titik kiri_atas;\n    int lebar;\n    int tinggi;\n} Kotak;\n\nint main(void) {\n    Kotak k = {{0, 0}, 1, 1};\n    scanf(\"%d %d\", &k.kiri_atas.___, &___);\n    scanf(\"%d %d\", &k.lebar, &k.tinggi);\n    printf(\"posisi %d,%d\\n\", k.kiri_atas.x, k.kiri_atas.y);\n    printf(\"luas %d\\n\", ___);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\ntypedef struct {\n    Titik kiri_atas;\n    int lebar;\n    int tinggi;\n} Kotak;\n\nint main(void) {\n    Kotak k = {{0, 0}, 1, 1};\n    scanf(\"%d %d\", &k.kiri_atas.x, &k.kiri_atas.y);\n    scanf(\"%d %d\", &k.lebar, &k.tinggi);\n    printf(\"posisi %d,%d\\n\", k.kiri_atas.x, k.kiri_atas.y);\n    printf(\"luas %d\\n\", k.lebar * k.tinggi);\n    return 0;\n}",
          tests: [
            { stdin: "1 2\n4 5", expectedOutput: "posisi 1,2\nluas 20" },
            { stdin: "3 7\n10 3", expectedOutput: "posisi 3,7\nluas 30" },
            { stdin: "0 0\n9 9", expectedOutput: "posisi 0,0\nluas 81", hidden: true },
          ],
          hints: [
            "Koordinat y tinggal satu tingkat di bawah kiri_atas.",
            "scanf membutuhkan alamat member, dan member bersarang punya alamat juga.",
            "Blank pertama x, blank kedua &k.kiri_atas.y, blank ketiga k.lebar * k.tinggi.",
          ],
        },
      ],
    },
    {
      slug: "array-of-struct",
      title: "Array of Struct",
      summary: "Simpan banyak kartu data dalam array struct dan olah dengan loop.",
      steps: [
        {
          kind: "theory",
          title: "Lemari penuh kartu",
          body: "Struct menjadi berguna sungguhan saat dikumpulkan: `Produk daftar[5];` membuat lima kartu berurutan di memori, dan tiap kartu diakses `daftar[i].stok`. Urutan penulisannya: subscript dulu untuk memilih kartu, titik kemudian untuk memilih member. Kedua operator itu setingkat prioritas dan dibaca dari kiri.\n\nLoop di atas array struct adalah pola harian: membaca data, menjumlahkan, mencari yang terbesar, atau memperbarui banyak kartu sekaligus. Menugaskan antar elemen juga sah dan menyalin seluruh struct: `daftar[1] = daftar[0];` menduplikasi kartu, bukan memindahkan alamatnya.\n\nSaat array struct dikirim ke fungsi, aturan lama tetap berlaku: yang sampai adalah pointer ke elemen pertama, jadi panjang dikirim sebagai parameter terpisah. Fungsi tidak pernah tahu berapa kartu yang diterimanya kalau tidak diberi tahu.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef struct {\n    char nama[16];\n    int stok;\n} Produk;\n\nint main(void) {\n    Produk daftar[3] = {\n        {\"Kabel\", 12},\n        {\"Resistor\", 240},\n        {\"LED\", 50}\n    };\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total = total + daftar[i].stok;\n    }\n    printf(\"total stok %d\\n\", total);\n    return 0;\n}",
            caption: "Setiap elemen array adalah struct utuh, bukan pointer.",
          },
        },
        {
          kind: "quiz",
          question: "Dengan `Produk d[5];`, cara yang benar mengakses stok elemen berindeks 1 adalah...",
          options: ["d.stok[1]", "d[1].stok", "d[1]->stok", "stok.d[1]"],
          answer: 1,
          explanation: "Subscript memilih elemen, titik memilih member: d[1].stok. Panah dipakai hanya untuk pointer ke struct, bukan elemen array struct biasa.",
        },
        {
          kind: "code",
          title: "Total stok tiga barang",
          prompt: "Lengkapi pembacaan stok ke member struct dan penjumlahannya di dalam loop. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\ntypedef struct {\n    char nama[16];\n    int stok;\n} Produk;\n\nint main(void) {\n    Produk daftar[3];\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        scanf(\"%s %d\", daftar[i].nama, ___);\n        total = total + ___;\n    }\n    printf(\"total stok %d\\n\", total);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\ntypedef struct {\n    char nama[16];\n    int stok;\n} Produk;\n\nint main(void) {\n    Produk daftar[3];\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        scanf(\"%s %d\", daftar[i].nama, &daftar[i].stok);\n        total = total + daftar[i].stok;\n    }\n    printf(\"total stok %d\\n\", total);\n    return 0;\n}",
          tests: [
            { stdin: "Kabel 4\nResistor 10\nLED 6", expectedOutput: "total stok 20" },
            { stdin: "A 1\nB 2\nC 3", expectedOutput: "total stok 6" },
            { stdin: "X 7\nY 8\nZ 9", expectedOutput: "total stok 24", hidden: true },
          ],
          hints: [
            "scanf butuh alamat stok milik elemen i.",
            "Nama array struct tidak butuh & karena array sudah alamat; stok satu per satu butuh.",
            "Blank pertama &daftar[i].stok, blank kedua daftar[i].stok.",
          ],
        },
      ],
    },
    {
      slug: "padding-ukuran-struct",
      title: "Padding dan Ukuran Struct",
      summary: "Kenapa sizeof struct tidak sama dengan jumlah member, dan cara menyusunnya agar hemat.",
      steps: [
        {
          kind: "theory",
          title: "Lubang tak terlihat di dalam struct",
          body: "Ukuran struct sering bukan jumlah ukuran membernya. Compiler menyisipkan byte kosong bernama padding agar setiap member berada di alamat kelipatan alignmen-nya: `int` enak dibaca dari alamat kelipatan 4, `double` dari kelipatan 8. `struct { char c; int i; }` bukan 5 byte melainkan 8: satu byte untuk c, tiga byte padding, empat byte untuk i.\n\nPadding juga tertinggal di ujung struct supaya array-nya tetap rapi: tiap elemen harus mulai di alamat yang layak untuk member terbesarnya. Karena itu urutan member memengaruhi total. Member yang sama tapi tersusun `char, int, char` berukuran 12 byte, sementara `int, char, char` cukup 8. Kebiasaan hematnya satu kalimat: susun member dari yang terbesar ke terkecil.\n\nJangan menghafal angka; alignment berbeda antar platform dan `sizeof` selalu benar. Untuk memeriksa posisi member secara persis, header `stddef.h` menyediakan `offsetof(tipe, member)` yang memberi jarak member dari awal struct. Data yang berhemat padat seperti format file dan array jutaan elemen sangat merasakan bedanya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nstruct A {\n    char c;\n    int i;\n    char d;\n};\n\nstruct B {\n    int i;\n    char c;\n    char d;\n};\n\nint main(void) {\n    printf(\"A %zu\\n\", sizeof(struct A));\n    printf(\"B %zu\\n\", sizeof(struct B));\n    return 0;\n}",
            caption: "Member sama, urutan beda: 12 lawan 8 byte.",
          },
        },
        {
          kind: "quiz",
          question: "Dengan alignment int 4 byte, berapa `sizeof` untuk `struct { char c; int i; }`?",
          options: ["5 byte", "8 byte", "4 byte", "9 byte"],
          answer: 1,
          explanation: "char memakai 1 byte, lalu 3 byte padding disisipkan supaya int mulai di alamat kelipatan 4, total 8 byte.",
        },
      ],
    },
    {
      slug: "enum-dasar",
      title: "Enum dan switch",
      summary: "Beri nama pada nilai-nilai tetap dengan enum dan pilih tindakan lewat switch.",
      steps: [
        {
          kind: "theory",
          title: "Angka yang berbicara",
          body: "`enum` mendefinisikan daftar konstanta bilangan bulat bernama. `enum Status { MENANG, SERI, KALAH };` memberi MENANG nilai 0, SERI 1, dan KALAH 2, berurutan. Angka awal bisa digeser dengan pengisian eksplisit, misalnya `enum { TASK = 1, PROSES, SELESAI };` yang melanjutkan 2 dan 3 dari nilai terakhir.\n\nNilai enum tetap berupa bilangan bulat biasa, dan di situlah manfaatnya: variabel enum bisa menjadi pilihan `switch`, sehingga percabangan terbaca seperti maksud program, bukan tabel angka ajaib. `case MENANG` jauh lebih berbicara daripada `case 0`, dan compiler yang baik memberi peringatan bila ada enum yang belum ditangani.\n\nSatu batas yang harus diwariskan turun-temurun: C tidak memeriksa apakah isi variabel enum masih anggota daftarnya. Membaca `kode` dari luar lalu meng-cast ke enum tidak divalidasi apa pun, sehingga cabang `default` pada switch tetap layak dipasang sebagai penjaga kasus tak terduga.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nenum Status { MENANG, SERI, KALAH };\n\nint main(void) {\n    enum Status s = SERI;\n    switch (s) {\n        case MENANG:\n            printf(\"3 poin\\n\");\n            break;\n        case SERI:\n            printf(\"1 poin\\n\");\n            break;\n        case KALAH:\n            printf(\"0 poin\\n\");\n            break;\n    }\n    printf(\"nilai SERI = %d\\n\", SERI);\n    return 0;\n}",
            caption: "Enum mengubah percabangan angka menjadi percabangan makna.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk `enum Warna { MERAH, HIJAU, BIRU };`, berapa nilai HIJAU?",
          options: ["0", "1", "2", "tergantung compiler"],
          answer: 1,
          explanation: "Enum dimulai dari 0 kecuali diisi eksplisit, jadi MERAH 0, HIJAU 1, dan BIRU 2.",
        },
        {
          kind: "code",
          title: "Poin dari kode pertandingan",
          prompt: "Program membaca kode status dan mencetak poin lewat switch. Lengkapi label case dan pernyataan penghentinya. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nenum Status { MENANG, SERI, KALAH };\n\nint main(void) {\n    int kode;\n    scanf(\"%d\", &kode);\n    enum Status s = (enum Status)kode;\n    switch (s) {\n        case MENANG:\n            printf(\"3 poin\\n\");\n            break;\n        ___ SERI:\n            printf(\"1 poin\\n\");\n            break;\n        case KALAH:\n            printf(\"0 poin\\n\");\n            ___;\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nenum Status { MENANG, SERI, KALAH };\n\nint main(void) {\n    int kode;\n    scanf(\"%d\", &kode);\n    enum Status s = (enum Status)kode;\n    switch (s) {\n        case MENANG:\n            printf(\"3 poin\\n\");\n            break;\n        case SERI:\n            printf(\"1 poin\\n\");\n            break;\n        case KALAH:\n            printf(\"0 poin\\n\");\n            break;\n    }\n    return 0;\n}",
          tests: [
            { stdin: "0", expectedOutput: "3 poin" },
            { stdin: "1", expectedOutput: "1 poin" },
            { stdin: "2", expectedOutput: "0 poin", hidden: true },
          ],
          hints: [
            "Setiap label pilihan dalam switch diawali kata kunci yang sama.",
            "Tanpa pernyataan penghenti, eksekusi jatuh ke case berikutnya dan mencetak lebih dari satu baris.",
            "Blank pertama case, blank kedua break.",
          ],
        },
      ],
    },
    {
      slug: "union-dasar",
      title: "Union: Satu Memori, Banyak Wajah",
      summary: "Kenali union yang berbagi memori, ukurannya, dan kapan ia lebih tepat daripada struct.",
      steps: [
        {
          kind: "theory",
          title: "Semua member menempati tempat yang sama",
          body: "`union` terlihat seperti struct, tapi aturannya sebaliknya: semua member berbagi satu area memori yang sama. Ukurannya adalah ukuran member terbesar, bukan jumlahnya, dan menulis satu member menimpa isi member lain. Struct menyimpan semuanya sekaligus; union menyimpan salah satunya pada satu waktu.\n\nUse case yang paling sering adalah nilai yang tipe aktifnya berubah-ubah: sebuah sel bisa berisi angka atau teks, dan hanya satu yang berlaku. Pola bakunya tagged union: struct yang berisi enum penanda tipe ditambah union penyimpannya. Penanda menjawab \"isi sekarang apa\", union menjawab \"tempatnya di mana\", dan gabungan keduanya jauh lebih hemat daripada menyimpan semua kemungkinan sekaligus.\n\nHati-hati dengan membaca member yang bukan yang terakhir ditulis: yang terjadi adalah menafsir ulang byte yang sama dengan tipe berbeda. Di C itu terdefinisi untuk banyak kasus (type punning lewat union), tapi hasilnya jarang bermakna bila tipenya tak sengaja dipertukarkan. Disiplin satu aturan: tulis member yang sama dengan yang terakhir diisi, dan catat tipe aktifnya di penanda.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nunion Nilai {\n    int angka;\n    char huruf;\n};\n\nint main(void) {\n    union Nilai n;\n    printf(\"ukuran %zu\\n\", sizeof(union Nilai));\n    n.angka = 65;\n    printf(\"%d %c\\n\", n.angka, n.huruf);\n    n.huruf = 'Z';\n    printf(\"%d %c\\n\", n.angka, n.huruf);\n    return 0;\n}",
            caption: "Menulis huruf menimpa byte angka; keduanya berbagi memori.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk `union Data { int i; double d; char nama[8]; };`, berapa `sizeof(union Data)` di sistem yang lazim?",
          options: ["20 byte, jumlah semua member", "8 byte", "4 byte", "1 byte"],
          answer: 1,
          explanation: "Union berukuran member terbesarnya: double dan char[8] sama-sama 8 byte, int hanya 4, jadi totalnya 8, bukan jumlah semua member.",
        },
      ],
    },
    {
      slug: "bit-field",
      title: "Bit Field",
      summary: "Nyatakan member struct dalam satuan bit untuk flag yang padat dan bernama.",
      steps: [
        {
          kind: "theory",
          title: "Flag yang dihitung per bit",
          body: "Struct boleh menyatakan berapa bit yang dipakai sebuah member: `unsigned aktif : 1;` hanya memakai satu bit. Beberapa field kecil dikemas compiler ke dalam satu unit penyimpanan, sehingga sepuluh flag on/off cukup ditaruh dalam satu `unsigned int` alih-alih sepuluh int. Struktur yang berisi banyak status jadi ringkas tanpa kehilangan nama yang jelas.\n\nBatas nilainya otomatis: field selebar 3 bit menampung 0 sampai 7, dan nilai yang melebihi kapasitas dipangkas bit tingginya. Komprominya nyata: bit field tidak bisa diambil alamatnya dengan `&`, tata letak persisnya bergantung compiler, dan operasi per bit tidak selalu lebih cepat daripada operasi biasa karena compiler menambah penyaringan bit.\n\nPemakai alaminya ada di kode yang dekat dengan mesin: register perangkat, header format file, dan struktur status ukuran besar. Untuk logika aplikasi biasa, sering lebih jelas memakai unsigned biasa atau mask bit eksplisit. Kenali bit field sebagai alat yang tepat untuk masalah yang tepat.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef struct {\n    unsigned aktif : 1;\n    unsigned level : 3;\n    unsigned ulang : 2;\n} Bendera;\n\nint main(void) {\n    Bendera b = {1, 5, 3};\n    printf(\"ukuran %zu\\n\", sizeof(Bendera));\n    printf(\"%u %u %u\\n\", b.aktif, b.level, b.ulang);\n    return 0;\n}",
            caption: "Enam bit total, tapi tiap flag tetap punya nama sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa nilai terbesar yang bisa ditampung field `unsigned tingkat : 3;`?",
          options: ["3", "7", "8", "31"],
          answer: 1,
          explanation: "Tiga bit menyediakan 2^3 = 8 kombinasi, yaitu nilai 0 sampai 7.",
        },
      ],
    },
    {
      slug: "latihan-inventaris",
      title: "Latihan Gabungan: Inventaris Barang",
      summary: "Padukan typedef, enum, struct, dan switch dalam satu program inventaris.",
      steps: [
        {
          kind: "theory",
          title: "Satu program, empat materi",
          body: "Penutup modul ini memakai semuanya sekaligus: `typedef` meringkas nama tipe, `enum` menamai kategori, struct menyusun data barang, dan `switch` memilih label kategori. Bentuk `Barang` di bawah adalah pola data kecil yang nyata: nama untuk manusia, kategori untuk logika, stok dan harga untuk perhitungan.\n\nKategori dibaca dari input sebagai int, lalu di-cast ke enum sebelum dipakai. Nilai persediaan dihitung `stok * harga`, dan karena harga memakai `long long`, hasil kalinya di-cast eksplisit agar perkalian tidak berlangsung dalam int. Spekifier scanf untuk long long adalah `%lld`, pengulangan dari modul tipe yang kini terpakai sungguhan.\n\nBaca template sampai selesai sebelum mengisi apa pun: tentukan tipe tiap blank, alamat member mana yang diminta scanf, dan label apa yang dicetak tiap kategori. Kalau ada tes yang merah, bandingkan keluaranmu dengan yang diharapkan baris demi baris.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef enum { ELEKTRONIK, PAKAN, PAKAI } Kategori;\n\ntypedef struct {\n    char nama[16];\n    Kategori kategori;\n    int stok;\n    long long harga;\n} Barang;\n\nint main(void) {\n    Barang b = {\"Kabel\", ELEKTRONIK, 3, 15000};\n    long long nilai = (long long)b.stok * b.harga;\n    printf(\"%s nilai %lld\\n\", b.nama, nilai);\n    return 0;\n}",
            caption: "Struktur data yang jelas membuat perhitungan tinggal mengikuti.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam struct Barang, mengapa harga dideklarasikan `long long`, bukan `int`?",
          options: [
            "supaya ukuran struct selalu genap",
            "karena hasil stok kali harga bisa melampaui batas int",
            "karena long long dihitung lebih cepat",
            "karena enum mewajibkan member long long",
          ],
          answer: 1,
          explanation: "Harga satuan dan stok yang besar mudah menghasilkan nilai di atas 2 miliar, batas int. long long menjaga perkalian nilai persediaan dari overflow.",
        },
        {
          kind: "code",
          title: "Inventaris lengkap",
          prompt: "Lengkapi deklarasi variabel barang, cast kategorinya, dan specifier untuk nilai persediaan. Ganti ketiga `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\ntypedef enum { ELEKTRONIK, PAKAN, PAKAI } Kategori;\n\ntypedef struct {\n    char nama[16];\n    Kategori kategori;\n    int stok;\n    long long harga;\n} Barang;\n\nint main(void) {\n    int kode;\n    ___ b;\n    scanf(\"%s %d %d %lld\", b.nama, &kode, &b.stok, &b.harga);\n    b.kategori = (___)kode;\n    long long nilai = (long long)b.stok * b.harga;\n    switch (b.kategori) {\n        case ELEKTRONIK:\n            printf(\"%s elektronik\\n\", b.nama);\n            break;\n        case PAKAN:\n            printf(\"%s pakan\\n\", b.nama);\n            break;\n        case PAKAI:\n            printf(\"%s pakai\\n\", b.nama);\n            break;\n    }\n    printf(\"nilai %___\\n\", nilai);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\ntypedef enum { ELEKTRONIK, PAKAN, PAKAI } Kategori;\n\ntypedef struct {\n    char nama[16];\n    Kategori kategori;\n    int stok;\n    long long harga;\n} Barang;\n\nint main(void) {\n    int kode;\n    Barang b;\n    scanf(\"%s %d %d %lld\", b.nama, &kode, &b.stok, &b.harga);\n    b.kategori = (Kategori)kode;\n    long long nilai = (long long)b.stok * b.harga;\n    switch (b.kategori) {\n        case ELEKTRONIK:\n            printf(\"%s elektronik\\n\", b.nama);\n            break;\n        case PAKAN:\n            printf(\"%s pakan\\n\", b.nama);\n            break;\n        case PAKAI:\n            printf(\"%s pakai\\n\", b.nama);\n            break;\n    }\n    printf(\"nilai %lld\\n\", nilai);\n    return 0;\n}",
          tests: [
            { stdin: "Kabel 0 3 15000", expectedOutput: "Kabel elektronik\nnilai 45000" },
            { stdin: "Pakan 1 12 25000", expectedOutput: "Pakan pakan\nnilai 300000" },
            { stdin: "Sarung 2 5 80000", expectedOutput: "Sarung pakai\nnilai 400000", hidden: true },
          ],
          hints: [
            "Tipe barangnya sendiri sudah diberi alias typedef di atas; pakai namanya saja.",
            "Cast ke enum memakai nama alias kategorinya, ditulis dalam tanda kurung.",
            "Blank pertama Barang, blank kedua Kategori, blank ketiga lld.",
          ],
        },
      ],
    },
    // ==================== MODUL 5: Fungsi Lanjut ====================
    {
      slug: "function-pointer-dasar",
      title: "Function Pointer Dasar",
      summary: "Simpan alamat fungsi di variabel dan panggil lewat pointer.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi punya alamat juga",
          body: "Kode fungsi tinggal di memori, jadi fungsi punya alamat, dan alamat itu bisa disimpan. Nama fungsi tanpa tanda kurung meluruh menjadi alamatnya, seperti nama array. Variabel yang menampungnya ditulis `int (*op)(int, int) = tambah;`: op adalah pointer ke fungsi yang menerima dua int dan mengembalikan int. Tanda kurung di sekitar `*op` wajib.\n\nPemanggilannya dua bentuk yang sama sahnya: `op(2, 3)` atau bentuk eksplisitnya `(*op)(2, 3)`. Tanpa kurung, `int *op(int, int)` tidak lagi mendeklarasikan pointer, melainkan fungsi yang mengembalikan `int *`. Satu pasang tanda kurung mengubah arti total, dan kesalahan ini klasik sampai sekarang.\n\nNilai pointer fungsi bisa diganti kapan saja, dan variabel yang sama memanggil fungsi berbeda. Itu fondasi callback, tabel perintah, dan strategi yang dipilih saat program berjalan. Modul ini membangun ketiganya selangkah demi selangkah.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint tambah(int a, int b) {\n    return a + b;\n}\n\nint kali(int a, int b) {\n    return a * b;\n}\n\nint main(void) {\n    int (*op)(int, int) = kali;\n    printf(\"%d\\n\", op(6, 7));\n\n    op = tambah;\n    printf(\"%d\\n\", op(6, 7));\n    return 0;\n}",
            caption: "Satu variabel, dua perilaku: cukup ganti fungsi yang ditunjuk.",
          },
        },
        {
          kind: "quiz",
          question: "Deklarasi yang benar untuk variabel pointer ke fungsi bertipe `double f(int)` adalah...",
          options: ["double *fp(int);", "double (*fp)(int);", "double (fp*)(int);", "*double fp(int);"],
          answer: 1,
          explanation: "Tanda kurung mengikat bintang ke nama variabel: double (*fp)(int). Tanpa itu, double *fp(int) berarti deklarasi fungsi yang mengembalikan pointer ke double.",
        },
        {
          kind: "code",
          title: "Panggil lewat pointer",
          prompt: "Lengkapi alamat fungsi yang ditunjuk op dan pemanggilannya lewat pointer. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint kali(int a, int b) {\n    return a * b;\n}\n\nint main(void) {\n    int x, y;\n    scanf(\"%d %d\", &x, &y);\n    int (*op)(int, int) = ___;\n    printf(\"hasil %d\\n\", ___(x, y));\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint kali(int a, int b) {\n    return a * b;\n}\n\nint main(void) {\n    int x, y;\n    scanf(\"%d %d\", &x, &y);\n    int (*op)(int, int) = kali;\n    printf(\"hasil %d\\n\", op(x, y));\n    return 0;\n}",
          tests: [
            { stdin: "6 7", expectedOutput: "hasil 42" },
            { stdin: "5 5", expectedOutput: "hasil 25" },
            { stdin: "-3 4", expectedOutput: "hasil -12", hidden: true },
          ],
          hints: [
            "Nama fungsi tanpa tanda kurung sudah berupa alamatnya.",
            "Pemanggilan lewat pointer sama seperti pemanggilan fungsi biasa.",
            "Blank pertama kali, blank kedua op.",
          ],
        },
      ],
    },
    {
      slug: "callback-apply",
      title: "Callback: Fungsi sebagai Parameter",
      summary: "Kirim fungsi ke fungsi lain dan terapkan pada seluruh data.",
      steps: [
        {
          kind: "theory",
          title: "Loop yang ditulis sekali, perilakunya dikirim",
          body: "Fungsi yang menerima fungsi lain sebagai parameter membuka pola apply: satu loop di tulis sekali di dalam `apply`, sedangkan transformasi tiap elemen ditentukan pemanggil. Signature-nya `void apply(int *data, int n, int (*f)(int))`, dan parameter ketiga adalah fungsi satu argumen yang mengembalikan int.\n\nDi dalam apply, `f(data[i])` memanggil fungsi yang ditunjuk untuk tiap elemen. Pemanggil memilih `duplikat`, `negasi`, atau fungsi lain yang cocok signature-nya, tanpa perlu menyentuh apply lagi. Perilaku berubah lewat argumen, bukan lewat menyalin-tempel loop baru; itu persis alasan pola ini bertahan puluhan tahun.\n\nNama umumnya callback: fungsi yang \"dipanggil balik\" oleh fungsi lain. `qsort` di stdlib bekerja dengan cara yang sama lewat comparator, dan dua lesson ke depan memakainya sungguhan. Syaratnya kaku dan itu bagusnya: signature fungsi yang dikirim harus persis dengan yang diminta parameter.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint kuadrat(int v) {\n    return v * v;\n}\n\nvoid apply(int *data, int n, int (*f)(int)) {\n    for (int i = 0; i < n; i++) {\n        data[i] = f(data[i]);\n    }\n}\n\nint main(void) {\n    int data[3] = {1, 2, 3};\n    apply(data, 3, kuadrat);\n    printf(\"%d %d %d\\n\", data[0], data[1], data[2]);\n    return 0;\n}",
            caption: "apply tetap sama meski fungsi yang dikirim berganti.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah pemanggilan `apply(d, 3, kuadrat)`, apa yang terjadi?",
          options: [
            "kuadrat dipanggil satu kali dengan argumen 3",
            "kuadrat dipanggil untuk setiap elemen d",
            "data disalin ke dalam kuadrat",
            "apply mengembalikan hasil kuadrat",
          ],
          answer: 1,
          explanation: "apply memanggil f(data[i]) untuk i dari 0 sampai n-1, jadi kuadrat diterapkan pada setiap elemen array.",
        },
        {
          kind: "code",
          title: "Pilih transformasi lewat callback",
          prompt: "Program membaca empat angka lalu kode pilihan: 1 menggandakan semua angka, selain itu menegasikan. Lengkapi fungsi yang dikirim ke apply pada masing-masing cabang. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint duplikat(int v) {\n    return v * 2;\n}\n\nint negasi(int v) {\n    return -v;\n}\n\nvoid apply(int *data, int n, int (*f)(int)) {\n    for (int i = 0; i < n; i++) {\n        data[i] = f(data[i]);\n    }\n}\n\nint main(void) {\n    int data[4];\n    for (int i = 0; i < 4; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int pilih;\n    scanf(\"%d\", &pilih);\n    if (pilih == 1) {\n        apply(data, 4, ___);\n    } else {\n        apply(data, 4, ___);\n    }\n    for (int i = 0; i < 4; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint duplikat(int v) {\n    return v * 2;\n}\n\nint negasi(int v) {\n    return -v;\n}\n\nvoid apply(int *data, int n, int (*f)(int)) {\n    for (int i = 0; i < n; i++) {\n        data[i] = f(data[i]);\n    }\n}\n\nint main(void) {\n    int data[4];\n    for (int i = 0; i < 4; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int pilih;\n    scanf(\"%d\", &pilih);\n    if (pilih == 1) {\n        apply(data, 4, duplikat);\n    } else {\n        apply(data, 4, negasi);\n    }\n    for (int i = 0; i < 4; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          tests: [
            { stdin: "1 2 3 4\n1", expectedOutput: "2 4 6 8" },
            { stdin: "1 2 3 4\n2", expectedOutput: "-1 -2 -3 -4" },
            { stdin: "9 8 7 6\n2", expectedOutput: "-9 -8 -7 -6", hidden: true },
          ],
          hints: [
            "Fungsi dikirim sebagai argumen tanpa tanda kurung dan tanpa dipanggil.",
            "Pilihan 1 berarti semua angka dikali dua; sisanya berpindah tanda.",
            "Blank pertama duplikat, blank kedua negasi.",
          ],
        },
      ],
    },
    {
      slug: "tabel-function-pointer",
      title: "Array of Function Pointer",
      summary: "Susun fungsi dalam tabel dan panggil lewat indeks, alternatif switch yang ringkas.",
      steps: [
        {
          kind: "theory",
          title: "Menu yang tinggal diindeks",
          body: "Fungsi-fungsi dengan bentuk sama bisa dihimpun dalam array: `int (*ops[3])(int, int) = {tambah, kurang, kali};`. Cara membacanya dari dalam ke luar: ops adalah array 3 elemen, tiap elemen pointer ke fungsi dua int yang mengembalikan int. Kurung di sekitar `*ops[3]` tetap yang menentukan bahwa inilah arraynya.\n\nPemanggilan `ops[pilihan](x, y)` menggantikan rantai if atau switch yang panjangnya sebanding dengan jumlah pilihan. Menu CLI, tabel perintah, dan state machine sering ditulis begini: menambah pilihan berarti menambah satu baris di tabel, bukan satu cabang baru di tiga tempat.\n\nSatu tanggung jawab tetap di tanganmu: validasi indeks. Array C tidak mengenal batas, dan `ops[7]` membaca alamat sampah lalu memanggilnya, error yang berhenti program dengan cara paling tidak informatif. Periksa rentang pilihan sebelum mengindeks, seperti yang dilakukan template latihan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint tambah(int a, int b) { return a + b; }\nint kurang(int a, int b) { return a - b; }\nint kali(int a, int b) { return a * b; }\n\nint main(void) {\n    int (*ops[3])(int, int) = {tambah, kurang, kali};\n\n    int pilihan = 2;\n    printf(\"%d\\n\", ops[pilihan](10, 4));\n    return 0;\n}",
            caption: "Indeks 2 memanggil fungsi ketiga di tabel, yaitu kali.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk `int (*ops[3])(int, int);`, cara memanggil fungsi pada indeks 0 dengan argumen 2 dan 3 adalah...",
          options: ["ops.0(2, 3)", "*ops(2, 3)", "ops[0](2, 3)", "ops(0, 2, 3)"],
          answer: 2,
          explanation: "Subscript memilih elemen array, lalu pemanggilan biasa: ops[0](2, 3).",
        },
        {
          kind: "code",
          title: "Kalkulator satu tabel",
          prompt: "Lengkapi ukuran tabel dan pemanggilan fungsi berdasarkan pilihan. Jika pilihan di luar 0 sampai 2, program sudah mencetak pesan kesalahan. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint tambah(int a, int b) { return a + b; }\nint kurang(int a, int b) { return a - b; }\nint kali(int a, int b) { return a * b; }\n\nint main(void) {\n    int (*ops[___])(int, int) = {tambah, kurang, kali};\n    int pilihan, x, y;\n    scanf(\"%d %d %d\", &pilihan, &x, &y);\n    if (pilihan < 0 || pilihan > 2) {\n        printf(\"pilihan tidak ada\\n\");\n        return 0;\n    }\n    printf(\"hasil %d\\n\", ___(x, y));\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint tambah(int a, int b) { return a + b; }\nint kurang(int a, int b) { return a - b; }\nint kali(int a, int b) { return a * b; }\n\nint main(void) {\n    int (*ops[3])(int, int) = {tambah, kurang, kali};\n    int pilihan, x, y;\n    scanf(\"%d %d %d\", &pilihan, &x, &y);\n    if (pilihan < 0 || pilihan > 2) {\n        printf(\"pilihan tidak ada\\n\");\n        return 0;\n    }\n    printf(\"hasil %d\\n\", ops[pilihan](x, y));\n    return 0;\n}",
          tests: [
            { stdin: "0 10 4", expectedOutput: "hasil 14" },
            { stdin: "1 10 4", expectedOutput: "hasil 6" },
            { stdin: "2 10 4", expectedOutput: "hasil 40", hidden: true },
          ],
          hints: [
            "Jumlah inisialisasi di kurung kurawal harus sama dengan ukuran array.",
            "Elemen tabel dipilih dengan subscript, lalu dipanggil seperti fungsi biasa.",
            "Blank pertama 3, blank kedua ops[pilihan].",
          ],
        },
      ],
    },
    {
      slug: "rekursi-faktorial",
      title: "Rekursi: Faktorial dan Fibonacci",
      summary: "Fungsi yang memanggil dirinya: base case, langkah rekursif, dan harga yang dibayarnya.",
      steps: [
        {
          kind: "theory",
          title: "Masalah yang menyusutkan dirinya",
          body: "Fungsi rekursif memanggil dirinya untuk versi masalah yang lebih kecil. Dua bagian wajib ada: base case yang menjawab tanpa memanggil lagi, dan langkah rekursif yang selalu mendekati base case. Faktorial menuliskannya rapi: `faktorial(n) = n * faktorial(n - 1)` dengan jawaban langsung 1 saat n mencapai 0 atau 1.\n\nSaat `faktorial(5)` berjalan, lima frame fungsi menumpuk di call stack, lalu ditutup mundur dari bawah: 1, 2, 6, 24, 120. Rekursi memang memakai memori stack sebanding kedalamannya, dan inilah bedanya dengan loop yang cuma satu frame. Base case yang tak pernah tercapai berarti tumpukan tumbuh tanpa henti sampai stack habis: stack overflow.\n\nFibonacci memperlihatkan sisi mahalnya: `fib(n) = fib(n-1) + fib(n-2)` memanggil dirinya dua kali, dan tiap anak memanggil dua lagi, membentuk pohon panggilan yang tumbuh eksponensial. `fib(40)` naif sudah terasa lambat padahal `faktorial(40)` sekejap. Rekursi itu alat yang tepat untuk struktur bercabang seperti pohon; untuk barisan sederhana, loop atau tabel hasil (dynamic programming) jauh lebih hemat.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint faktorial(int n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * faktorial(n - 1);\n}\n\nint fib(int n) {\n    if (n < 2) {\n        return n;\n    }\n    return fib(n - 1) + fib(n - 2);\n}\n\nint main(void) {\n    printf(\"%d\\n\", faktorial(5));\n    printf(\"%d\\n\", fib(10));\n    return 0;\n}",
            caption: "faktorial(5) membuka lima frame lalu menutupnya mundur.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika base case sebuah fungsi rekursif tidak pernah tercapai?",
          options: [
            "fungsi mengembalikan 0",
            "program gagal saat kompilasi",
            "panggilan menumpuk terus sampai stack overflow",
            "rekursi berhenti sendiri setelah seribu panggilan",
          ],
          answer: 2,
          explanation: "Tanpa base case yang tercapai, setiap panggilan membuka frame baru di stack sampai memori stack habis dan program jatuh dengan stack overflow.",
        },
        {
          kind: "code",
          title: "Faktorial yang selalu nol",
          prompt: "Setiap tes menghasilkan 0. Ada satu kesalahan pada base case faktorial; perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: "#include <stdio.h>\n\nint faktorial(int n) {\n    if (n <= 1) {\n        return 0;\n    }\n    return n * faktorial(n - 1);\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%d\\n\", faktorial(n));\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint faktorial(int n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * faktorial(n - 1);\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%d\\n\", faktorial(n));\n    return 0;\n}",
          tests: [
            { stdin: "5", expectedOutput: "120" },
            { stdin: "1", expectedOutput: "1" },
            { stdin: "7", expectedOutput: "5040", hidden: true },
          ],
          hints: [
            "Base case adalah titik berhenti rekursi, dan nilainya ikut dikalikan seluruh rantai panggilan.",
            "Faktorial 1 dan 0 bernilai 1, bukan 0; satu nilai salah meracuni semua hasil di atasnya.",
            "Ganti return 0; di dalam if menjadi return 1;",
          ],
        },
      ],
    },
    {
      slug: "rekursi-binary-search",
      title: "Binary Search Rekursif",
      summary: "Bagi dua jangkauan pencarian pada setiap panggilan dan temukan data terurut dalam log n.",
      steps: [
        {
          kind: "theory",
          title: "Membuang separuh data tiap langkah",
          body: "Pencarian linear memeriksa satu per satu; binary search membuang separuh data setiap perbandingan. Syaratnya satu: data harus terurut. Bandingkan target dengan elemen tengah; kalau tengah lebih kecil, seluruh sisi kiri pasti bukan jawaban dan pencarian lanjut di kanan, begitu pula sebaliknya.\n\nBentuk rekursifnya natural: `cari(data, kiri, kanan, target)` dengan base case `kiri > kanan` yang berarti jangkauan kosong, dijawab -1. Setiap panggilan menyempitkan jangkauan, jadi kedalaman rekursi hanya sekitar log2 dari n: satu juta elemen cukup dua puluh panggilan. Struktur masalahnya memang bercabang dua, dan rekursi menyusutkannya dengan rapi.\n\nPerhatikan cara tengah dihitung: `kiri + (kanan - kiri) / 2`, bukan `(kiri + kanan) / 2`. Keduanya benar secara matematika, tapi penjumlahan dua indeks besar bisa melampaui batas int sebelum dibagi dua, bug nyata yang bertahun-tahun tersembunyi di implementasi terkenal. Bentuk selisih tidak pernah melebihi lebar jangkauan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint cari(int *data, int kiri, int kanan, int target) {\n    if (kiri > kanan) {\n        return -1;\n    }\n    int tengah = kiri + (kanan - kiri) / 2;\n    if (data[tengah] == target) {\n        return tengah;\n    }\n    if (data[tengah] < target) {\n        return cari(data, tengah + 1, kanan, target);\n    }\n    return cari(data, kiri, tengah - 1, target);\n}\n\nint main(void) {\n    int data[8] = {2, 5, 8, 12, 16, 23, 38, 56};\n    printf(\"%d\\n\", cari(data, 0, 7, 23));\n    printf(\"%d\\n\", cari(data, 0, 7, 9));\n    return 0;\n}",
            caption: "Indeks 5 ketemu dalam tiga panggilan; 9 berujung -1.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa perkiraan panggilan paling banyak untuk binary search pada 1000 elemen terurut?",
          options: ["sekitar 1000", "sekitar 500", "sekitar 10", "sekitar 30"],
          answer: 2,
          explanation: "Setiap panggilan membagi dua jangkauan. Karena 2^10 = 1024, sepuluh panggilan sudah cukup untuk seribu elemen.",
        },
        {
          kind: "code",
          title: "Lengkapi lompatan jangkauan",
          prompt: "Lengkapi dua panggilan rekursif: satu menyempitkan ke sisi kanan, satu ke sisi kiri, tanpa menyertakan tengah yang sudah diperiksa. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint cari(int *data, int kiri, int kanan, int target) {\n    if (kiri > kanan) {\n        return -1;\n    }\n    int tengah = kiri + (kanan - kiri) / 2;\n    if (data[tengah] == target) {\n        return tengah;\n    }\n    if (data[tengah] < target) {\n        return cari(data, ___, kanan, target);\n    }\n    return cari(data, kiri, ___, target);\n}\n\nint main(void) {\n    int data[8] = {2, 5, 8, 12, 16, 23, 38, 56};\n    int target;\n    scanf(\"%d\", &target);\n    printf(\"%d\\n\", cari(data, 0, 7, target));\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint cari(int *data, int kiri, int kanan, int target) {\n    if (kiri > kanan) {\n        return -1;\n    }\n    int tengah = kiri + (kanan - kiri) / 2;\n    if (data[tengah] == target) {\n        return tengah;\n    }\n    if (data[tengah] < target) {\n        return cari(data, tengah + 1, kanan, target);\n    }\n    return cari(data, kiri, tengah - 1, target);\n}\n\nint main(void) {\n    int data[8] = {2, 5, 8, 12, 16, 23, 38, 56};\n    int target;\n    scanf(\"%d\", &target);\n    printf(\"%d\\n\", cari(data, 0, 7, target));\n    return 0;\n}",
          tests: [
            { stdin: "23", expectedOutput: "5" },
            { stdin: "2", expectedOutput: "0" },
            { stdin: "9", expectedOutput: "-1", hidden: true },
          ],
          hints: [
            "Bila nilai tengah lebih kecil dari target, sisa satu-satunya adalah sisi kanan tengah.",
            "Tengah yang sudah diperiksa tidak boleh ikut lagi di jangkauan berikutnya, atau rekursi bisa berputar tanpa ujung.",
            "Blank pertama tengah + 1, blank kedua tengah - 1.",
          ],
        },
      ],
    },
    {
      slug: "variadic-stdarg",
      title: "Fungsi Variadic dengan stdarg",
      summary: "Fungsi dengan jumlah argumen tak tetap: va_list, va_start, va_arg, va_end.",
      steps: [
        {
          kind: "theory",
          title: "Argumen yang tak dihitung di muka",
          body: "Tanda `...` di akhir parameter membuat fungsi menerima argumen sebanyak apa pun: `int jumlah(int n, ...)`. Pemakainya ada di mana-mana: printf adalah fungsi variadic paling terkenal. Aturan satu-satunya yang dijamin standar: `...` harus paling kanan, dan harus ada parameter tetap sebelumnya supaya ada pijakan menghitung sisanya.\n\nIsi `...` dibaca lewat empat alat dari `stdarg.h`. `va_list ap` mendeklarasikan pemindah argumen, `va_start(ap, n)` memasangnya setelah parameter tetap terakhir, `va_arg(ap, int)` mengambil satu argumen bertipe int dan memajukan posisi, dan `va_end(ap)` menutup. Loop di atas `n` adalah pola bakunya: parameter tetap memberi tahu berapa argumen variadic yang sah diambil.\n\nBiayanya keamanan: compiler tidak memeriksa jumlah maupun tipe argumen variadic. `va_arg(ap, double)` pada argumen int membaca sampah tanpa keluhan, dan jumlah yang lebih banyak daripada dikirim membaca memori milik orang lain. Karena itu fungsi variadic buatan sendiri sebaiknya hemat dipakai, kontraknya ditulis jelas di komentar atau nama fungsi, dan kalau tipe bisa dibuat seragam, lebih baik kirim array dengan panjangnya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdarg.h>\n\nint jumlah(int n, ...) {\n    va_list ap;\n    va_start(ap, n);\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total += va_arg(ap, int);\n    }\n    va_end(ap);\n    return total;\n}\n\nint main(void) {\n    printf(\"%d\\n\", jumlah(3, 10, 20, 30));\n    printf(\"%d\\n\", jumlah(5, 1, 2, 3, 4, 5));\n    return 0;\n}",
            caption: "Parameter n memberi tahu loop kapan berhenti mengambil argumen.",
          },
        },
        {
          kind: "quiz",
          question: "Macro yang mengambil argumen variadic berikutnya dari sebuah va_list adalah...",
          options: ["va_start", "va_list", "va_arg", "va_end"],
          answer: 2,
          explanation: "va_arg(ap, tipe) mengembalikan argumen berikutnya dengan tipe yang disebut dan memajukan posisi pembacaan. va_start memasang, va_end menutup.",
        },
      ],
    },
    {
      slug: "qsort-comparator",
      title: "qsort dan Comparator",
      summary: "Sortir array apa pun dengan qsort dari stdlib dan fungsi pembanding buatanmu.",
      steps: [
        {
          kind: "theory",
          title: "Sortir generik dari stdlib",
          body: "`qsort` men-sortir array tipe apa pun karena ia tidak perlu tahu isinya. Signature-nya `qsort(void *base, size_t n, size_t size, int (*cmp)(const void *, const void *))`: alamat awal, jumlah elemen, ukuran satu elemen dalam byte, dan fungsi pembanding. qsort menukar blok byte berukuran `size` dan bertanya pada comparator urutannya harus seperti apa.\n\nTugas comparator: terima dua alamat elemen sebagai `const void *`, cast ke tipe elemen yang benar, lalu kembalikan negatif bila elemen pertama harus di depan, positif bila sebaliknya, nol bila setara. `qsort` hanya membaca tandanya. Membalik urutan naik menjadi turun berarti membalik tanda hasilnya, tanpa menyentuh qsort sama sekali.\n\nLesson ini merangkai dua materi lama dalam satu tempat: `void*` dari modul pointer, dan function pointer dari awal modul ini. Comparator adalah callback paling sering ditulis programmer C, dan menulisnya benar berarti paham keduanya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint banding(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    if (x < y) {\n        return -1;\n    }\n    if (x > y) {\n        return 1;\n    }\n    return 0;\n}\n\nint main(void) {\n    int data[5] = {5, 2, 9, 1, 7};\n    qsort(data, 5, sizeof(int), banding);\n    for (int i = 0; i < 5; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
            caption: "Urutan naik sepenuhnya ditentukan oleh banding.",
          },
        },
        {
          kind: "quiz",
          question: "Comparator untuk urutan naik harus mengembalikan nilai positif saat...",
          options: [
            "kedua elemen sama nilainya",
            "elemen pertama harus ditukar ke belakang elemen kedua",
            "array sudah terurut",
            "terjadi kesalahan memori",
          ],
          answer: 1,
          explanation: "Hasil positif berarti elemen pertama dianggap lebih besar, jadi qsort menaruhnya setelah elemen kedua. Itu arti tanda pada kontrak comparator.",
        },
        {
          kind: "code",
          title: "Sortir dengan comparator sendiri",
          prompt: "Lengkapi nilai pembanding untuk urutan naik dan nama comparator yang dikirim ke qsort. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <stdlib.h>\n\nint banding(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    if (x < y) {\n        return ___;\n    }\n    if (x > y) {\n        return 1;\n    }\n    return 0;\n}\n\nint main(void) {\n    int data[5];\n    for (int i = 0; i < 5; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    qsort(data, 5, sizeof(int), ___);\n    for (int i = 0; i < 5; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <stdlib.h>\n\nint banding(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    if (x < y) {\n        return -1;\n    }\n    if (x > y) {\n        return 1;\n    }\n    return 0;\n}\n\nint main(void) {\n    int data[5];\n    for (int i = 0; i < 5; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    qsort(data, 5, sizeof(int), banding);\n    for (int i = 0; i < 5; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          tests: [
            { stdin: "5 2 9 1 7", expectedOutput: "1 2 5 7 9" },
            { stdin: "10 -3 4 0 2", expectedOutput: "-3 0 2 4 10" },
            { stdin: "9 9 9 9 9", expectedOutput: "9 9 9 9 9", hidden: true },
          ],
          hints: [
            "Untuk urutan naik, elemen yang lebih kecil harus dilaporkan dengan tanda negatif.",
            "Argumen terakhir qsort adalah nama fungsi pembandingnya, tanpa tanda kurung.",
            "Blank pertama -1, blank kedua banding.",
          ],
        },
      ],
    },
    {
      slug: "header-c-terpisah",
      title: "Memisahkan Header dan .c",
      summary: "Bagi program menjadi header berisi deklarasi dan file .c berisi definisi.",
      steps: [
        {
          kind: "theory",
          title: "Antarmuka di .h, isi di .c",
          body: "Satu file main mulai sesak begitu program bertumbuh, dan C punya pembagian kerja baku: header `.h` berisi apa yang orang lain perlu tahu (deklarasi fungsi, tipe, konstanta), sedangkan `.c` berisi bagaimana semuanya dijalankan (definisi). File lain cukup `#include \"modul.h\"` dan tidak pernah melihat isi modul.c.\n\nPerbedaan deklarasi dan definisi kini terpakai sungguhan. Deklarasi `int jumlahkan(int a, int b);` hanya mengumumkan keberadaan dan bentuknya; definisi di modul.c menyimpan kodenya. Compiler menangani file satu per satu tanpa saling melihat, lalu linker menyambung setiap panggilan ke definisinya. Kalau deklarasi ada tapi definisi lupa ditulis, hasilnya error linker dengan pesan undefined reference.\n\nMengompilasinya tinggal menyebut semua file: `gcc main.c modul.c -o program`. Ketika satu file berubah, hanya itu yang perlu dikompilasi ulang pada build besar; itu sebagian alasan organisasi multi-file bernilai di proyek nyata. Latihan modul preprocessor nanti menyempurnakan sisi build ini.",
          code: {
            language: "c",
            content: "// matematika.h\nint jumlahkan(int a, int b);\n\n// matematika.c\n#include \"matematika.h\"\n\nint jumlahkan(int a, int b) {\n    return a + b;\n}\n\n// main.c\n#include <stdio.h>\n#include \"matematika.h\"\n\nint main(void) {\n    printf(\"%d\\n\", jumlahkan(2, 3));\n    return 0;\n}",
            caption: "Deklarasi di header, definisi di .c, linker yang menyatukan. Kompilasi: gcc main.c matematika.c -o program",
          },
        },
        {
          kind: "quiz",
          question: "Isi yang tepat untuk file header (.h) adalah...",
          options: [
            "definisi semua fungsi supaya bisa langsung dipakai",
            "deklarasi fungsi, tipe, dan konstanta yang dipakai bersama",
            "fungsi main dari program",
            "kode yang sudah dikompilasi",
          ],
          answer: 1,
          explanation: "Header adalah antarmuka: deklarasi, tipe, dan konstanta bersama. Definisi fungsi tinggal di file .c masing-masing.",
        },
      ],
    },
    {
      slug: "include-guard-extern",
      title: "Include Guard dan extern",
      summary: "Cegah header terbaca dua kali dengan include guard dan bagikan variabel global lewat extern.",
      steps: [
        {
          kind: "theory",
          title: "Satu kali cukup, dua kali kacau",
          body: "Header bisa terinclude dua kali tanpa terlihat: main.c menginclude a.h dan b.h, sementara b.h ternyata juga menginclude a.h. Isi a.h sampai dua kali dalam satu file, dan definisi tipe yang kembar membuat kompilasi gagal. Include guard menutup masalahnya: `#ifndef HITUNG_H`, `#define HITUNG_H`, isi header, `#endif`. Pemanggilan kedua melompati seluruh isi karena HITUNG_H sudah terdefinisi.\n\nNama guard harus unik di seluruh proyek, lazimnya dari nama filenya: HITUNG_H untuk hitung.h. Alternatif modernnya `#pragma once` di baris pertama header, lebih pendek dan didukung hampir semua compiler, meski secara teknis bukan bagian standar. Proyek lama dan lintas platform tetap memakai guard klasik.\n\nUntuk variabel global lintas file, kuncinya membedakan deklarasi dan definisi. Di header tulis `extern int hitung;`, yang artinya variabel ini ada, didefinisikan di tempat lain. Tepat satu file .c menuliskan definisinya: `int hitung = 0;`. Semua file yang menginclude header melihat variabel yang sama, dan linker yang memastikan semuanya menunjuk ke satu tempat.",
          code: {
            language: "c",
            content: "// hitung.h\n#ifndef HITUNG_H\n#define HITUNG_H\n\nextern int hitung;\n\nint tambah_satu(void);\n\n#endif\n\n// hitung.c\n#include \"hitung.h\"\n\nint hitung = 0;\n\nint tambah_satu(void) {\n    hitung = hitung + 1;\n    return hitung;\n}",
            caption: "extern di header hanya mengumumkan; definisinya tepat satu di .c.",
          },
        },
        {
          kind: "quiz",
          question: "Apa fungsi utama include guard?",
          options: [
            "mempercepat kompilasi dengan membuang komentar",
            "mencegah isi header terbaca dua kali dalam satu file .c",
            "menyembunyikan fungsi dari linker",
            "menggantikan deklarasi extern",
          ],
          answer: 1,
          explanation: "Guard berbasis #ifndef memastikan isi header hanya diproses sekali per file .c, meski dia terinclude lewat beberapa jalur berbeda.",
        },
      ],
    },
    {
      slug: "latihan-qsort-callback",
      title: "Latihan Gabungan: Sortir Dua Arah",
      summary: "Rangkai comparator dan function pointer: satu program, dua arah sortir dari satu logika.",
      steps: [
        {
          kind: "theory",
          title: "Satu comparator, dua arah",
          body: "Penutup modul ini merangkai semuanya: comparator naik ditulis satu kali sebagai sumber kebenaran, comparator turun cukup membalik tandanya dengan `-naik(a, b)`, dan qsort menerima keduanya sebagai argumen biasa. Pemilihan arah menjadi pemilihan pointer, bukan penulisan ulang logika sortir.\n\nPola kecil seperti `return -naik(a, b);` menjaga logika tetap tunggal: kalau aturan pembandingnya berubah, misalnya sortir struct berdasarkan beberapa field, arah turun otomatis ikut benar. Menyalin fungsi lalu membalik setiap perbandingan bekerja juga, tapi dua tempat berarti dua tempat untuk keliru.\n\nPerhatikan juga output-nya dipisah spasi tanpa spasi di ujung: elemen pertama dicetak telanjang, sisanya diprefixi spasi. Setelah semua tes hijau, tantangan berpikirnya: bagaimana menambah pilihan ketiga tanpa menyentuh qsort sama sekali? Jawabannya sudah ada di lesson tabel function pointer.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint naik(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    return (x > y) - (x < y);\n}\n\nint main(void) {\n    int data[4] = {9, 1, 8, 2};\n    qsort(data, 4, sizeof(int), naik);\n    for (int i = 0; i < 4; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
            caption: "Pola (x > y) - (x < y) menghasilkan -1, 0, atau 1 dalam satu ekspresi.",
          },
        },
        {
          kind: "quiz",
          question: "Comparator turun berisi `return -naik(a, b);`. Efeknya pada qsort adalah...",
          options: [
            "hasilnya sama dengan urutan naik",
            "urutan menjadi kebalikan dari naik",
            "qsort gagal berjalan",
            "nilai elemen ikut dinegasikan",
          ],
          answer: 1,
          explanation: "qsort hanya membaca tanda hasil comparator. Membalik tanda membalik setiap keputusan penukar, sehingga hasil akhirnya urutan turun.",
        },
        {
          kind: "code",
          title: "Sortir sesuai pilihan",
          prompt: "Program membaca lima angka lalu pilihan arah: 1 sortir naik, selain itu turun. Lengkapi comparator yang dikirim ke qsort pada tiap cabang. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <stdlib.h>\n\nint naik(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    if (x < y) {\n        return -1;\n    }\n    if (x > y) {\n        return 1;\n    }\n    return 0;\n}\n\nint turun(const void *a, const void *b) {\n    return -naik(a, b);\n}\n\nint main(void) {\n    int data[5];\n    for (int i = 0; i < 5; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int pilih;\n    scanf(\"%d\", &pilih);\n    if (pilih == 1) {\n        qsort(data, 5, sizeof(int), ___);\n    } else {\n        qsort(data, 5, sizeof(int), ___);\n    }\n    for (int i = 0; i < 5; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <stdlib.h>\n\nint naik(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    if (x < y) {\n        return -1;\n    }\n    if (x > y) {\n        return 1;\n    }\n    return 0;\n}\n\nint turun(const void *a, const void *b) {\n    return -naik(a, b);\n}\n\nint main(void) {\n    int data[5];\n    for (int i = 0; i < 5; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int pilih;\n    scanf(\"%d\", &pilih);\n    if (pilih == 1) {\n        qsort(data, 5, sizeof(int), naik);\n    } else {\n        qsort(data, 5, sizeof(int), turun);\n    }\n    for (int i = 0; i < 5; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    return 0;\n}",
          tests: [
            { stdin: "5 2 9 1 7\n1", expectedOutput: "1 2 5 7 9" },
            { stdin: "5 2 9 1 7\n2", expectedOutput: "9 7 5 2 1" },
            { stdin: "-3 10 0 -7 4\n1", expectedOutput: "-7 -3 0 4 10", hidden: true },
          ],
          hints: [
            "Pilihan 1 berarti urutan naik; cabang lain pakai comparator kebalikannya.",
            "Fungsi dikirim sebagai argumen dengan namanya saja, tanpa tanda kurung.",
            "Blank pertama naik, blank kedua turun.",
          ],
        },
      ],
    },
  ],
};
