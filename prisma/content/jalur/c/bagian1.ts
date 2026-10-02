import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "c",
  moduleRange: [0, 1],
  modules: [
    {
      title: "Tipe dan Memori Dasar",
      description: "Ukuran tipe, cast, qualifier const/volatile, storage class, dan representasi angka.",
    },
    {
      title: "Pointer Secara Benar",
      description: "Aritmetika pointer, pointer vs array, pointer ke pointer, dan void*.",
    },
  ],
  lessons: [
    // ==================== MODUL 0: Tipe dan Memori Dasar ====================
    {
      slug: "ukuran-tipe-sizeof",
      title: "Mengukur Tipe dengan sizeof",
      summary: "Ukur byte setiap tipe dengan operator sizeof dan pakai pola sizeof untuk array.",
      steps: [
        {
          kind: "theory",
          title: "Setiap byte terhitung",
          body: "Setiap variabel menempati ruang memori yang diukur dalam byte. Operator `sizeof` memberi tahu berapa byte yang dipakai suatu tipe atau ekspresi. Ia terlihat seperti fungsi tapi sesungguhnya operator yang dievaluasi saat kompilasi, jadi tidak ada biaya apa pun saat program berjalan.\n\n`sizeof` menghasilkan tipe `size_t`, tipe unsigned khusus untuk ukuran, dan dari situlah specifier pencetaknya `%zu`. Ukuran `char` dijamin selalu 1, tapi ukuran tipe lain ditentukan platform: di mesin desktop saat ini `int` lazimnya 4 byte dan `double` 8 byte, sementara `long` berukuran 4 di Windows 64 bit tapi 8 di Linux 64 bit. Jangan menghafal; ukur dengan `sizeof`.\n\nPola paling berguna: `sizeof(arr) / sizeof(arr[0])` menghitung jumlah elemen array. Trik ini hanya jujur untuk array sungguhan. Begitu array dikirim ke fungsi, ia meluruh menjadi pointer dan pola ini salah; itu dibahas tuntas di modul berikutnya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    printf(\"char      %zu\\n\", sizeof(char));\n    printf(\"int       %zu\\n\", sizeof(int));\n    printf(\"long      %zu\\n\", sizeof(long));\n    printf(\"double    %zu\\n\", sizeof(double));\n\n    int nilai[] = {10, 20, 30, 40, 50};\n    printf(\"elemen nilai: %zu\\n\", sizeof(nilai) / sizeof(nilai[0]));\n    return 0;\n}",
            caption: "Jalankan di mesinmu, lalu bandingkan hasilnya dengan sistem lain.",
          },
        },
        {
          kind: "quiz",
          question: "Tipe hasil kembalian operator `sizeof` adalah...",
          options: ["int", "size_t", "double", "void"],
          answer: 1,
          explanation: "sizeof menghasilkan size_t, tipe unsigned khusus untuk ukuran memori, sehingga pencetakannya memakai %zu.",
        },
        {
          kind: "code",
          title: "Hitung isi array tanpa menghitung manual",
          prompt: "Lengkapi perhitungan jumlah elemen array di bawah memakai pola sizeof, tanpa menulis angka 5 secara manual. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int nilai[] = {12, 25, 7, 40, 9};\n    size_t jumlah = ___ / ___;\n    printf(\"%zu\\n\", jumlah);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int nilai[] = {12, 25, 7, 40, 9};\n    size_t jumlah = sizeof(nilai) / sizeof(nilai[0]);\n    printf(\"%zu\\n\", jumlah);\n    return 0;\n}",
          tests: [{ stdin: "", expectedOutput: "5" }],
          hints: [
            "Pembilangnya ukuran seluruh array, penyebutnya ukuran satu elemen.",
            "sizeof(nilai) memberi byte seluruh array; sizeof(nilai[0]) memberi byte satu int.",
            "Jawabannya: sizeof(nilai) / sizeof(nilai[0])",
          ],
        },
      ],
    },
    {
      slug: "signed-unsigned-overflow",
      title: "Signed, Unsigned, dan Batas Overflow",
      summary: "Bedakan signed dan unsigned, pahami wrap-around dan mengapa signed overflow berbahaya.",
      steps: [
        {
          kind: "theory",
          title: "Dua dunia bilangan bulat",
          body: "Tipe bilangan bulat punya dua varian. `signed` menyisakan satu bit untuk tanda sehingga bisa negatif; `unsigned` memakai semua bit untuk besaran sehingga hanya menyimpan nol ke atas. `int` tanpa kata tambahan berarti signed.\n\nPerhitungan unsigned terdefinisi penuh: hasilnya dibungkus secara modulo. `0u - 1` menghasilkan nilai terbesar unsigned int, yaitu 4294967295 pada varian 32 bit. Tidak ada error; angkanya berputar seperti odometer. Berbeda jauh dengan signed: melewati `INT_MAX` adalah undefined behavior, dan compiler berhak melakukan apa saja, dari hasil aneh sampai menghapus cabang kode yang dianggap mustahil.\n\nJebakan klasiknya ada di ekspresi campuran: dalam perbandingan `int` dengan `unsigned int`, si int dikonversi menjadi unsigned terlebih dahulu, sehingga `-1 < 1u` bernilai salah karena -1 berubah menjadi 4294967295. Kalau nilainya memang bisa negatif, jangan memilih unsigned hanya demi rentang yang lebih besar.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    unsigned int stok = 0;\n    stok = stok - 1;\n    printf(\"%u\\n\", stok);\n\n    int hutang = 0;\n    hutang = hutang - 1;\n    printf(\"%d\\n\", hutang);\n    return 0;\n}",
            caption: "Unsigned berputar modulo; signed bebas negatif sampai batasnya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `printf(\"%u\\n\", u)` setelah `unsigned int u = 0; u = u - 1;`?",
          options: ["-1", "0", "4294967295", "program berhenti dengan error"],
          answer: 2,
          explanation: "Unsigned int 32 bit berhitung modulo 2^32, jadi 0 dikurangi 1 berputar ke nilai terbesarnya, 4294967295. Tidak ada error.",
        },
      ],
    },
    {
      slug: "cast-eksplisit-implisit",
      title: "Cast: Eksplisit dan Implisit",
      summary: "Kendalikan konversi tipe: yang terjadi diam-diam dan yang kamu tulis sendiri.",
      steps: [
        {
          kind: "theory",
          title: "Konversi yang diam dan yang diumumkan",
          body: "C sering mengonversi tipe diam-diam. Nilai kecil menuju tipe yang lebih besar aman, tapi sebaliknya bisa memotong: menugaskan `double` ke `int` membuang seluruh bagian pecahan, bukan membulatkan. `(int)9.7` menjadi 9 dan `(int)-9.7` menjadi -9, selalu dipangkas menuju nol.\n\nCast eksplisit `(double)a` menyatakan niat dan mengubah jalur perhitungan. Pembagian dua int membulatkan menuju nol; `(double)a / b` memaksa pembagian pecahan. Operator cast mengikat lebih kuat daripada `/`, jadi cukup satu sisi yang di-cast untuk seluruh pembagian.\n\nAturan praktisnya: biarkan konversi naik terjadi sendiri, dan tulis cast hanya saat tipe turun atau saat niatnya harus terbaca, misalnya melempar alamat generik `void*` kembali ke tipe asalnya. Cast yang berhamburan biasanya tanda pengelolaan tipe yang kurang rapi.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int a = 7, b = 2;\n    printf(\"%d\\n\", a / b);\n    printf(\"%.2f\\n\", (double)a / b);\n\n    double rata = 9.7;\n    int dipangkas = (int)rata;\n    printf(\"%d\\n\", dipangkas);\n    return 0;\n}",
            caption: "7 / 2 menghasilkan 3; satu cast mengubahnya menjadi 3.50.",
          },
        },
        {
          kind: "quiz",
          question: "`int x = (int)7.9;` Berapa nilai x?",
          options: ["7.9", "8, karena dibulatkan ke atas", "7, karena pecahan dipangkas", "0"],
          answer: 2,
          explanation: "Cast double ke int memangkas menuju nol, bukan membulatkan. 7.9 menjadi 7.",
        },
        {
          kind: "code",
          title: "Rata-rata yang kehilangan pecahan",
          prompt: "Program ini menghitung rata-rata dari total dan banyak data, tapi hasilnya selalu bulat. Jalankan dulu untuk melihat kejanggalannya, lalu perbaiki satu kesalahan di baris perhitungan sampai semua tes lulus.",
          mode: "fix",
          template: "#include <stdio.h>\n\nint main(void) {\n    int total, n;\n    scanf(\"%d %d\", &total, &n);\n    double rata = total / n;\n    printf(\"%.2f\\n\", rata);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int total, n;\n    scanf(\"%d %d\", &total, &n);\n    double rata = (double)total / n;\n    printf(\"%.2f\\n\", rata);\n    return 0;\n}",
          tests: [
            { stdin: "17 4", expectedOutput: "4.25" },
            { stdin: "10 3", expectedOutput: "3.33" },
            { stdin: "7 2", expectedOutput: "3.50", hidden: true },
          ],
          hints: [
            "total dan n sama-sama int, maka pembagiannya pun pembagian bulat.",
            "Ubah salah satu sisi menjadi double dengan cast sebelum dibagi.",
            "Tulis (double)total / n.",
          ],
        },
      ],
    },
    {
      slug: "const-dan-volatile",
      title: "const dan volatile",
      summary: "Kunci nilai dengan const, kenali volatile, dan tahu kapan keduanya dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Nilai yang dikunci dan yang berubah sendiri",
          body: "Menulis `const int batas = 100;` menjadikan batas konstanta bernama: setiap usaha menugaskan ulang ditolak compiler sebelum program jadi. Variabel const wajib diisi saat dideklarasikan, dan kehadirannya menggantikan angka ajaib: `if (suhu > batas)` lebih berbicara daripada `if (suhu > 100)`.\n\nconst juga menempel pada yang dirujuk pointer, dan bedanya halus: `const int *p` berarti nilai yang ditunjuk tidak boleh ditulis lewat p, sedangkan `int *const p` berarti p sendiri tidak boleh berpindah alamat. Dibaca dari kanan ke kiri. Membiasakan const pada parameter pointer sekaligus mendokumentasikan bahwa fungsi itu hanya membaca.\n\nVolatile arahnya sebaliknya: ia memberi tahu compiler untuk tidak berasumsi nilai itu stabil di antara dua pembacaan. Nilainya bisa berubah dari luar kendali kode yang sedang jalan, misalnya dari perangkat keras atau utas lain, sehingga setiap pembacaan harus benar-benar dilakukan. Di aplikasi biasa kamu hampir tak pernah menulisnya; kenali bentuknya agar tidak asing saat bertemu kode sistem.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    const int batas = 100;\n    int suhu = 104;\n\n    if (suhu > batas) {\n        printf(\"melebihi %d derajat\\n\", batas);\n    }\n    return 0;\n}",
            caption: "Ubah suhu menjadi 90 dan cabang ini tidak jalan.",
          },
        },
        {
          kind: "quiz",
          question: "`const int batas = 100;` lalu `batas = 200;`. Apa yang terjadi?",
          options: ["batas berisi 200", "batas tetap 100 tapi program jalan", "program gagal dikompilasi karena const tidak boleh ditugaskan ulang", "terjadi undefined behavior saat runtime"],
          answer: 2,
          explanation: "Menugaskan ulang variabel const adalah kesalahan yang ditangkap compiler, jadi program bahkan tidak jadi dibangun.",
        },
      ],
    },
    {
      slug: "storage-class",
      title: "Storage Class: auto, static, extern",
      summary: "Atur jangkauan dan masa hidup variabel dengan auto, static, dan extern.",
      steps: [
        {
          kind: "theory",
          title: "Di mana nama hidup, dan sampai kapan",
          body: "Setiap variabel punya dua sisi yang sering disamakan padahal beda: jangkauan, yaitu di mana namanya dikenal, dan masa hidup, yaitu kapan memorinya ada. Keduanya diatur storage class: `auto`, `static`, dan `extern`.\n\nVariabel lokal sifatnya auto: lahir saat blok dijalankan, mati saat blok selesai, dan isinya tidak dijamin antar pemanggilan. Menambah `static` pada lokal mengubah masa hidupnya: memori tetap ada sepanjang program, inisialisasi dilakukan sekali saja, dan nilainya bertahan antar pemanggilan. Ini cara paling ringkas membuat penghitung pemanggilan tanpa variabel global.\n\n`static` di level file berarti lain: jangkauan namanya dibatasi ke file itu saja, berguna menyembunyikan fungsi pembantu dari file lain. Sementara `extern` adalah janji: variabel ini didefinisikan di file lain, pakai saja di sini, biar linker yang menyatukan. Kata kunci `auto` sendiri nyaris tak pernah ditulis karena memang menjadi bawaan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nvoid tandai(void) {\n    static int kali = 0;\n    kali++;\n    printf(\"panggilan ke-%d\\n\", kali);\n}\n\nint main(void) {\n    tandai();\n    tandai();\n    tandai();\n    return 0;\n}",
            caption: "Nilai kali bertahan antar pemanggilan karena static.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi berisi lokal `static int n = 0;` lalu `n++; return n;`. Fungsi dipanggil tiga kali. Nilai kembalian panggilan ketiga?",
          options: ["0", "1", "3", "tidak bisa dipastikan"],
          answer: 2,
          explanation: "static lokal diinisialisasi sekali dan nilainya bertahan: panggilan pertama mengembalikan 1, kedua 2, ketiga 3.",
        },
      ],
    },
    {
      slug: "char-dan-ascii",
      title: "char dan Kode ASCII",
      summary: "Lihat char sebagai angka: kode ASCII, aritmetika huruf, dan konversi digit.",
      steps: [
        {
          kind: "theory",
          title: "char adalah angka berkostum",
          body: "Tipe `char` sesungguhnya bilangan bulat kecil selebar satu byte. Karakter 'A' hanyalah nama manusiawi untuk angka 65 menurut tabel ASCII: huruf besar 'A' sampai 'Z' menempati 65 sampai 90, huruf kecil 'a' sampai 'z' menempati 97 sampai 122, dan digit '0' sampai '9' menempati 48 sampai 57.\n\nKarena char adalah angka, ia boleh dihitung. Selisih 'a' dan 'A' tepat 32, jadi `c - 32`, atau lebih terbaca `c - 'a' + 'A'`, mengkapitalkan huruf kecil. Nilai angka dari karakter digit didapat dari `c - '0'`; trik ini dipakai hampir semua kode parsing manual.\n\nUntuk mencetak, `%c` menampilkan karakternya dan `%d` menampilkan kodenya. Satu catatan platform: standar tidak memaksa char bersifat signed atau unsigned, jadi untuk data byte mentah yang bisa melebihi 127, gunakan `unsigned char` secara eksplisit.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    char huruf = 'A';\n    printf(\"%c = %d\\n\", huruf, huruf);\n\n    char kecil = huruf + 32;\n    printf(\"%c\\n\", kecil);\n\n    char digit = '7';\n    int nilai = digit - '0';\n    printf(\"%d\\n\", nilai);\n    return 0;\n}",
            caption: "Selisih 'a' dan 'A' selalu 32 di tabel ASCII.",
          },
        },
        {
          kind: "quiz",
          question: "Nilai ekspresi `'C' - 'A'` adalah...",
          options: ["32", "2", "0", "67"],
          answer: 1,
          explanation: "Huruf besar berurutan di ASCII: 'C' bernilai 67 dan 'A' bernilai 65, selisihnya 2.",
        },
        {
          kind: "code",
          title: "Kapitalkan huruf",
          prompt: "Lengkapi program: baca satu huruf kecil dari input, lalu cetak huruf kapitalnya memakai aritmetika char. Ganti `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    char c;\n    scanf(\"%c\", &c);\n    char besar = ___;\n    printf(\"%c\\n\", besar);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    char c;\n    scanf(\"%c\", &c);\n    char besar = c - 'a' + 'A';\n    printf(\"%c\\n\", besar);\n    return 0;\n}",
          tests: [
            { stdin: "b", expectedOutput: "B" },
            { stdin: "z", expectedOutput: "Z" },
            { stdin: "m", expectedOutput: "M", hidden: true },
          ],
          hints: [
            "Huruf kecil dan huruf besar berjarak 32 di tabel ASCII.",
            "Jadikan indeks nol dulu dengan c - 'a', lalu geser ke 'A'.",
            "Jawabannya: c - 'a' + 'A'",
          ],
        },
      ],
    },
    {
      slug: "float-vs-double",
      title: "float vs double dan Presisi",
      summary: "Pahami beda float dan double, kenapa 0.1 tak pernah persis, dan cara membandingkannya.",
      steps: [
        {
          kind: "theory",
          title: "Pecahan biner dan batas presisi",
          body: "Kedua tipe ini menyimpan pecahan menurut standar IEEE 754: angka disusun dari tanda, eksponen, dan mantisa berbasis biner. `float` memakai 32 bit dengan sekitar 7 digit desimal yang akurat; `double` memakai 64 bit dengan sekitar 15 sampai 16 digit. Kalau tidak ada alasan khusus seperti array besar yang mengejar hemat memori, pilih double.\n\nHati-hati dengan literal: `3.14` bertipe double, `3.14f` bertipe float. Sisi yang lebih menjegal, banyak nilai desimal sederhana tidak bisa diwakili persis dalam biner. `0.1` tersimpan sebagai bilangan sedikit di sampingnya, sehingga `0.1 + 0.2 == 0.3` bernilai salah. Ini bukan bug C, melainkan sifat aritmetika pecahan biner.\n\nKarena itu, jangan membandingkan pecahan dengan `==`. Bandingkan selisihnya dengan batas kecil yang masuk akal untuk kasusmu. Untuk mencetak, `%f` menampilkan enam desimal secara bawaan, dan `%.2f` mengatur jumlahnya sendiri.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    double a = 0.1 + 0.2;\n    printf(\"%d\\n\", a == 0.3);\n\n    double selisih = a - 0.3;\n    if (selisih < 0) {\n        selisih = -selisih;\n    }\n    if (selisih < 1e-9) {\n        printf(\"dianggap sama\\n\");\n    }\n    return 0;\n}",
            caption: "Selisih yang cukup kecil dianggap sama; itu pola pembandingan pecahan yang sehat.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `0.1 + 0.2 == 0.3` bernilai 0 (salah)?",
          options: [
            "Karena compiler salah mengoptimasi",
            "Karena 0.1 dan 0.2 tidak persis terwakili dalam biner sehingga hasilnya meleset sedikit",
            "Karena == tidak boleh dipakai untuk angka",
            "Karena 0.3 bertipe float sedangkan hasil penjumlahannya double",
          ],
          answer: 1,
          explanation: "Sebagian besar desimal tidak persis terwakili dalam biner. Hasil penjumlahan tersimpan sedikit di samping 0.3, maka == gagal.",
        },
      ],
    },
    {
      slug: "format-specifier-lengkap",
      title: "Format Specifier Lengkap",
      summary: "Pasangkan specifier dengan tipe yang benar, dari %d sampai %zu dan %p.",
      steps: [
        {
          kind: "theory",
          title: "Satu tipe, satu specifier",
          body: "Specifier adalah kontrak antara format dan argumen. `%d` untuk int, `%u` untuk unsigned int, `%ld` untuk long dan `%lld` untuk long long, `%zu` untuk size_t. Untuk pecahan, printf memakai `%f` untuk double, sementara scanf memakai `%lf`. `%c` untuk satu karakter, `%s` untuk string, dan `%p` untuk alamat pointer.\n\nSalah memasangkan specifier dengan tipe bukan kesalahan tampilan, melainkan undefined behavior: printf membaca argumen sesuai specifier, dan argumen yang salah tipe membuatnya membaca data yang bukan haknya. Kebetulan jalan di satu mesin tidak berarti aman; `%zu` yang ditukar `%d` sering lolos di satu platform lalu rusak di platform lain.\n\nLebar dan presisi menambah kendali: `%8d` meratakan kanan dalam 8 kolom, `%-8s` meratakan kiri, `%.3f` memotong tiga desimal. Tanda `%%` mencetak persen sungguhan. Untuk pemindaian, ingat `%s` berhenti pada spasi, jadi ia hanya untuk satu kata.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int kecil = -42;\n    unsigned besar = 3000000000u;\n    long long juta = 9000000000LL;\n    size_t ukuran = 16;\n    double harga = 12500.5;\n    char inisial = 'K';\n    char nama[] = \"KodeKita\";\n\n    printf(\"%d %u\\n\", kecil, besar);\n    printf(\"%lld %zu\\n\", juta, ukuran);\n    printf(\"%.2f %c %s\\n\", harga, inisial, nama);\n    printf(\"kanan: [%8d] kiri: [%-8d]\\n\", kecil, kecil);\n    return 0;\n}",
            caption: "Satu tipe, satu specifier; tidak ada pengecualian.",
          },
        },
        {
          kind: "quiz",
          question: "Specifier yang tepat untuk mencetak hasil `sizeof` adalah...",
          options: ["%d", "%ld", "%zu", "%p"],
          answer: 2,
          explanation: "sizeof menghasilkan size_t, dan specifiernya %zu.",
        },
        {
          kind: "code",
          title: "Kartu data dengan specifier yang pas",
          prompt: "Baris scanf kehilangan specifier-nya. Lengkapi supaya stok (int) dan harga (double) terbaca benar, lalu jalankan. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    char nama[20];\n    int stok;\n    double harga;\n\n    scanf(\"%s %___ %___\", nama, &stok, &harga);\n    printf(\"%s: stok %d, harga Rp%.0f\\n\", nama, stok, harga);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    char nama[20];\n    int stok;\n    double harga;\n\n    scanf(\"%s %d %lf\", nama, &stok, &harga);\n    printf(\"%s: stok %d, harga Rp%.0f\\n\", nama, stok, harga);\n    return 0;\n}",
          tests: [
            { stdin: "Kabel 12 3500", expectedOutput: "Kabel: stok 12, harga Rp3500" },
            { stdin: "Resistor 240 27500", expectedOutput: "Resistor: stok 240, harga Rp27500" },
            { stdin: "LED 500 1250", expectedOutput: "LED: stok 500, harga Rp1250", hidden: true },
          ],
          hints: [
            "stok bertipe int; scanf-nya butuh %d.",
            "harga bertipe double; di scanf pecahan ditandai huruf l, menjadi %lf.",
            "Barisnya menjadi scanf(\"%s %d %lf\", nama, &stok, &harga).",
          ],
        },
      ],
    },
    {
      slug: "literal-oktal-heksadesimal",
      title: "Literal Oktal dan Heksadesimal",
      summary: "Tulis angka dalam oktal dan heksadesimal, dan cetak kembali dalam bentuk apa pun.",
      steps: [
        {
          kind: "theory",
          title: "Nilai sama, kostum beda",
          body: "Nilai dan cara menulisnya adalah dua hal. `42`, `052`, dan `0x2A` adalah tiga penulisan untuk angka yang sama: tanpa awalan berarti desimal, awalan `0x` berarti heksadesimal, dan awalan `0` (nol) berarti oktal. Jebakannya jelas: `010` bukan sepuluh melainkan delapan.\n\nHeksadesimal adalah bahasa sehari-hari dunia sistem: satu digit mewakili empat bit, jadi satu byte selalu dua digit, dari `0x00` sampai `0xFF`. Warna, alamat memori, dan flag bit lazim ditulis begini. Huruf digitnya boleh besar atau kecil; `0xff` sama dengan `0xFF`.\n\nUntuk mencetak, `%x` dan `%X` menghasilkan heksadesimal huruf kecil dan besar, `%o` menghasilkan oktal, semuanya dari nilai yang sama. Arah sebaliknya juga ada: `scanf(\"%x\")` membaca masukan heksadesimal, berguna saat menangani data yang memang ditulis dalam heksa.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int desimal = 42;\n    printf(\"%d %x %X %o\\n\", desimal, desimal, desimal, desimal);\n\n    int heksa = 0x2A;\n    int oktal = 052;\n    printf(\"%d %d\\n\", heksa, oktal);\n    return 0;\n}",
            caption: "42, 052, dan 0x2A mencetak hasil yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "Nilai desimal dari literal `0x10` adalah...",
          options: ["10", "8", "16", "100"],
          answer: 2,
          explanation: "0x10 berarti 1 kali 16 ditambah 0, yaitu 16. Awalan 0x menandai heksadesimal, bukan sepuluh.",
        },
        {
          kind: "code",
          title: "Konversi kode warna",
          prompt: "Program membaca satu angka heksadesimal dengan scanf %x, lalu mencetaknya dalam desimal dan heksadesimal huruf besar. Lengkapi kedua specifier printf. Ganti `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    unsigned n;\n    scanf(\"%x\", &n);\n    printf(\"desimal %___\\n\", n);\n    printf(\"heksa %___\\n\", n);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    unsigned n;\n    scanf(\"%x\", &n);\n    printf(\"desimal %u\\n\", n);\n    printf(\"heksa %X\\n\", n);\n    return 0;\n}",
          tests: [
            { stdin: "ff", expectedOutput: "desimal 255\nheksa FF" },
            { stdin: "10", expectedOutput: "desimal 16\nheksa 10" },
            { stdin: "7fff", expectedOutput: "desimal 32767\nheksa 7FFF", hidden: true },
          ],
          hints: [
            "n bertipe unsigned, bukan int.",
            "Heksadesimal huruf besar dicetak dengan %X.",
            "Isi dengan %u untuk baris desimal dan %X untuk baris heksa.",
          ],
        },
      ],
    },
    {
      slug: "latihan-tipe-memori",
      title: "Latihan Gabungan: Struk Barang",
      summary: "Satukan char, long long, cast, dan specifier dalam satu program struk barang.",
      steps: [
        {
          kind: "theory",
          title: "Rekap, lalu gabungkan",
          body: "Sampai di sini peralatan tipemu lengkap: ukur dengan sizeof, kendalikan konversi dengan cast, kunci konstanta dengan const, atur masa hidup dengan static, dan pasangkan setiap nilai dengan specifier yang benar. Lesson ini memakainya berbarengan dalam satu program kecil.\n\nProgram struk barang memakai char untuk kategori, array char untuk nama, long long untuk harga agar aman dari total besar, dan int untuk jumlah. Perhatikan tiga detail: ` %c` di scanf diberi spasi supaya lompat ke karakter berikutnya yang bukan whitespace, kategori huruf kecil dikapitalkan dengan aritmetika ASCII, dan total dihitung dalam long long.\n\nBaca template pelan-pelan dan tentukan isi setiap blank sebelum mengetik. Kalau ada tes yang gagal, bandingkan keluaran yang diharapkan dengan keluaranmu baris per baris; bedanya selalu ada di tipe, specifier, atau aritmetika yang kurang tepat.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    long long harga = 3000000;\n    int jumlah = 3;\n    printf(\"%lld\\n\", harga * jumlah);\n    return 0;\n}",
            caption: "Perkalian dalam long long menjaga total struk dari overflow.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `long long harga = 3000000; int jumlah = 3;`, tipe hasil `harga * jumlah` adalah...",
          options: ["int", "long long", "double", "tergantung urutan penulisan"],
          answer: 1,
          explanation: "Dalam aritmetika campuran, int ikut dinaikkan ke tipe terbesar yang terlibat, jadi hasilnya long long.",
        },
        {
          kind: "code",
          title: "Struk barang lengkap",
          prompt: "Program struk barang: baca kategori (satu huruf), nama (satu kata), harga satuan, dan jumlah. Kategori huruf kecil otomatis dikapitalkan, lalu total dicetak. Lengkapi tiga `___` di bagian yang menyangkut tipe dan char.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    char kategori;\n    char nama[16];\n    long long harga;\n    int jumlah;\n\n    scanf(\" %c %s %___ %d\", &kategori, nama, &harga, &jumlah);\n    if (kategori >= 'a' && kategori <= 'z') {\n        kategori = ___;\n    }\n    long long total = harga * jumlah;\n    printf(\"kategori: %c\\n\", kategori);\n    printf(\"%s: %___\\n\", nama, total);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    char kategori;\n    char nama[16];\n    long long harga;\n    int jumlah;\n\n    scanf(\" %c %s %lld %d\", &kategori, nama, &harga, &jumlah);\n    if (kategori >= 'a' && kategori <= 'z') {\n        kategori = kategori - 'a' + 'A';\n    }\n    long long total = harga * jumlah;\n    printf(\"kategori: %c\\n\", kategori);\n    printf(\"%s: %lld\\n\", nama, total);\n    return 0;\n}",
          tests: [
            { stdin: "a SSD 3000000 3", expectedOutput: "kategori: A\nSSD: 9000000" },
            { stdin: "b RAM 4500000 2", expectedOutput: "kategori: B\nRAM: 9000000" },
            { stdin: "c GPU 12000000 2", expectedOutput: "kategori: C\nGPU: 24000000", hidden: true },
          ],
          hints: [
            "harga bertipe long long; specifier scanf-nya bukan %d.",
            "Kapitalisasi memakai selisih 'a' dan 'A'.",
            "Blank pertama lld, blank kedua kategori - 'a' + 'A', blank ketiga lld.",
          ],
        },
      ],
    },
    // ==================== MODUL 1: Pointer Secara Benar ====================
    {
      slug: "alamat-memori-operator",
      title: "Alamat Memori dan Operator &",
      summary: "Lihat memori sebagai alamat bernomor dan ambil alamat variabel dengan &.",
      steps: [
        {
          kind: "theory",
          title: "Memori bernomor",
          body: "Memori bisa dibayangkan deret byte panjang yang setiap byte-nya bernomor. Nomor itu adalah alamat. Setiap variabel menempati beberapa byte mulai dari alamat tertentu, dan alamat itu bisa kamu lihat dengan operator `&`.\n\n`&x` menghasilkan alamat x. Tipenya bukan angka biasa melainkan pointer ke tipe x: sebuah alamat yang tahu apa yang tinggal di sana. Untuk mencetaknya dipakai `%p`, dan konvensinya melewatkan `(void *)&x` supaya jelas yang dicetak hanyalah alamat tanpa tipe. Alamat ditampilkan dalam heksadesimal dan biasanya berbeda di setiap eksekusi.\n\nUkuran alamat seragam untuk semua tipe pointer: di sistem 64 bit sebesar 8 byte, apa pun yang ditunjuknya. Ini fakta penting: pointer menyimpan alamat, bukan salinan data. Perbedaan antar tipe pointer terletak pada cara menafsir dan melangkah di alamat itu, dan itulah tema modul ini.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int umur = 20;\n    double harga = 2500.0;\n\n    printf(\"%p\\n\", (void *)&umur);\n    printf(\"%p\\n\", (void *)&harga);\n    printf(\"ukuran alamat: %zu\\n\", sizeof(&umur));\n    return 0;\n}",
            caption: "Alamatmu akan berbeda dari contoh; yang penting ukurannya 8 di sistem 64 bit.",
          },
        },
        {
          kind: "quiz",
          question: "Ekspresi mana yang menghasilkan alamat variabel `x` bertipe int?",
          options: ["*x", "&x", "sizeof(x)", "(int)x"],
          answer: 1,
          explanation: "Operator & mengambil alamat variabel. *x justru kebalikannya: membaca isi dari sebuah pointer.",
        },
      ],
    },
    {
      slug: "deklarasi-pointer",
      title: "Mendeklarasikan Pointer",
      summary: "Deklarasikan pointer dengan benar dan hindari jebakan deklarasi ganda.",
      steps: [
        {
          kind: "theory",
          title: "Tipe yang menyimpan alamat",
          body: "Deklarasi pointer menyebut tipe yang ditunjuk lalu tanda bintang: `int *p` berarti p menyimpan alamat sebuah int. Inisialisasikan langsung saat deklarasi: `int *p = &stok;`. Pointer yang dibiarkan tanpa nilai berisi alamat sampah, dan satu dereference ke arah sana cukup meruntuhkan program.\n\nTanda bintang menempel pada nama variabel, bukan pada tipe. Deklarasi `int *a, b;` mendeklarasikan pointer a dan int biasa b. Menulisnya jadi `int* a, b;` tidak mengubah apa pun di mata compiler dan justru mengelabui mata manusia. Banyak tim memilih satu deklarasi per baris supaya tidak ada yang tertukar.\n\nGaya `int* p` dan `int *p` sama sahnya bagi compiler; yang penting konsisten. Cara membacanya: bintang milik nama, jadi `int *p` dibaca p adalah pointer ke int.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int stok = 42;\n    int *p = &stok;\n\n    printf(\"%d\\n\", *p);\n    *p = 50;\n    printf(\"%d\\n\", stok);\n    return 0;\n}",
            caption: "Mengubah *p mengubah stok; keduanya satu memori.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah deklarasi `int *a, b;`, tipe b adalah...",
          options: ["pointer ke int", "int biasa", "pointer ke pointer", "const int"],
          answer: 1,
          explanation: "Bintang menempel pada nama, bukan pada tipe. Hanya a yang jadi pointer; b int biasa.",
        },
        {
          kind: "code",
          title: "Sambungkan pointer pertamamu",
          prompt: "Deklarasikan p sebagai pointer ke int lalu sambungkan ke stok, dan jalankan: nilai stok akan berubah lewat pointer. Ganti `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int stok;\n    scanf(\"%d\", &stok);\n    ___ p = &stok;\n    *p = *p + 8;\n    printf(\"%d\\n\", stok);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int stok;\n    scanf(\"%d\", &stok);\n    int *p = &stok;\n    *p = *p + 8;\n    printf(\"%d\\n\", stok);\n    return 0;\n}",
          tests: [
            { stdin: "42", expectedOutput: "50" },
            { stdin: "100", expectedOutput: "108" },
            { stdin: "0", expectedOutput: "8", hidden: true },
          ],
          hints: [
            "p akan menunjuk int; sebutkan tipenya lalu bintang.",
            "Bintang menempel pada nama: int *p.",
            "Barisnya menjadi int *p = &stok;",
          ],
        },
      ],
    },
    {
      slug: "dereference-pointer",
      title: "Dereference dengan *",
      summary: "Baca dan tulis nilai lewat pointer menggunakan dereference *.",
      steps: [
        {
          kind: "theory",
          title: "Baca dan tulis lewat alamat",
          body: "Tanda `*` di depan pointer yang sudah ada dalam ekspresi berarti dereference: akses objek yang ditunjuk. `*p` bisa dibaca dan bisa juga ditulis. `printf(\"%d\", *p)` membaca nilai lewat alamat, `*p = 50` menulis ke alamat itu, dan variabel aslinya ikut berubah karena memang satu tempat.\n\nBedakan dua peran bintang: saat deklarasi ia bagian dari tipe (`int *p`), saat dalam ekspresi ia operator dereference (`*p`). Nama sama, makna bergantung konteks. Bedakan juga `p`, yaitu alamatnya, dengan `*p`, yaitu isinya; menukar keduanya adalah kesalahan pointer paling umum.\n\nDereference hanya sah bila pointer menunjuk objek yang masih hidup. Pointer liar yang belum diisi dan pointer ke variabel yang bloknya sudah selesai sama-sama berbahaya, dan bahasa ini tidak mendeteksinya untukmu: program berjalan rusak saat runtime atau diam-diam merusak memori. Disiplin inisialisasi dan pengujian keabsahan adalah pertahanannya; itu dibahas di lesson NULL.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int a = 5;\n    int *p = &a;\n\n    printf(\"%d %d\\n\", a, *p);\n    *p = 12;\n    printf(\"%d %d\\n\", a, *p);\n    return 0;\n}",
            caption: "Satu alamat, dua pintu: lewat a atau lewat *p.",
          },
        },
        {
          kind: "quiz",
          question: "`int a = 5; int *p = &a; *p = 12;` Berapa nilai a sekarang?",
          options: ["5", "alamat p", "tidak terdefinisi", "12"],
          answer: 3,
          explanation: "*p = 12 menulis ke alamat a itu sendiri, jadi a ikut menjadi 12.",
        },
      ],
    },
    {
      slug: "aritmetika-pointer",
      title: "Aritmetika Pointer",
      summary: "Geser pointer per elemen, bukan per byte, dan hitung selisih dua pointer.",
      steps: [
        {
          kind: "theory",
          title: "Melangkah per elemen",
          body: "Aritmetika pointer bergerak per elemen, bukan per byte. `p + 1` pada `int *p` maju 4 byte di mesin ini karena sizeof(int) bernilai 4; pada `double *` maju 8 byte. Compiler menghitungnya dari tipe yang ditunjuk, dan itulah alasan tipe pointer penting.\n\nSelisih dua pointer ke array yang sama menghasilkan jarak dalam satuan elemen, tipenya `ptrdiff_t` dengan pencetak `%td`. Pointer juga boleh dibandingkan dengan `<` atau `==`, dan itu sah untuk pointer ke array yang sama. Membandingkan pointer dari array yang berbeda tidak punya arti yang terdefinisi.\n\nMenggeser pointer keluar dari batas array adalah undefined behavior. Pola aman yang lazim: berjalan dari `data` sampai `data + n` dengan kondisi `p < data + n`. Pointer boleh menunjuk satu langkah setelah elemen terakhir, tapi tidak boleh didereference di sana.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int data[] = {10, 20, 30, 40};\n    int *p = data;\n\n    printf(\"%d\\n\", *p);\n    printf(\"%d\\n\", *(p + 1));\n    p++;\n    printf(\"%d\\n\", *p);\n    printf(\"%td\\n\", (data + 3) - p);\n    return 0;\n}",
            caption: "p++ maju satu elemen int, bukan satu byte.",
          },
        },
        {
          kind: "quiz",
          question: "Pada sistem dengan sizeof(double) bernilai 8, untuk `double *d` ekspresi `d + 1` maju...",
          options: ["1 byte", "4 byte", "8 byte", "bergantung isi datanya"],
          answer: 2,
          explanation: "Aritmetika pointer melangkah sebesar sizeof tipe yang ditunjuk, jadi 8 byte untuk double.",
        },
        {
          kind: "code",
          title: "Jumlahkan lewat pointer",
          prompt: "Jumlahkan seluruh elemen array dengan menggeser pointer, bukan subscript. Lengkapi gerakan pointer dan pembacaan nilainya. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int data[] = {4, 8, 15, 16, 23, 42};\n    int total = 0;\n    for (int *p = data; p < data + 6; ___) {\n        total += ___;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int data[] = {4, 8, 15, 16, 23, 42};\n    int total = 0;\n    for (int *p = data; p < data + 6; p++) {\n        total += *p;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
          tests: [{ stdin: "", expectedOutput: "108" }],
          hints: [
            "Gerakkan p satu elemen tiap putaran di bagian ketiga for.",
            "Tambahkan nilai yang ditunjuk p, bukan p-nya.",
            "Isi dengan p++ dan *p.",
          ],
        },
      ],
    },
    {
      slug: "pointer-vs-array",
      title: "Pointer dan Array",
      summary: "Pahami ekuivalensi data[i] dengan *(data + i) dan jebakan sizeof di fungsi.",
      steps: [
        {
          kind: "theory",
          title: "Dua wajah array",
          body: "Nama array dan pointer berkaitan erat tapi tidak identik. Dalam hampir semua ekspresi, nama array meluruh menjadi pointer ke elemen pertamanya. Karena itu `data[i]` persis sama dengan `*(data + i)`: subscript adalah gula sintaks untuk aritmetika pointer.\n\nBedanya muncul di sizeof dan penugasan. `sizeof(data)` pada array sungguhan memberi ukuran seluruh array, sedangkan pada pointer memberi ukuran alamat. Array juga tidak bisa ditugaskan atau dipindah seperti pointer; namanya melekat pada memorinya.\n\nKonsekuensi yang paling sering menjebak: saat array dikirim ke fungsi, yang sampai adalah pointer. Parameter `int arr[]` di fungsi sebenarnya `int *arr`, dan `sizeof(arr)` di dalam fungsi memberi ukuran pointer, bukan total array. Karena itu fungsi pemroses array hampir selalu menerima panjangnya sebagai parameter kedua.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint jumlahkan(int arr[], size_t n) {\n    int total = 0;\n    for (size_t i = 0; i < n; i++) {\n        total += arr[i];\n    }\n    return total;\n}\n\nint main(void) {\n    int data[] = {1, 2, 3, 4};\n    printf(\"%zu vs %zu\\n\", sizeof(data), sizeof(int *));\n    printf(\"%d\\n\", jumlahkan(data, 4));\n    return 0;\n}",
            caption: "16 vs 8 di sistem 64 bit: array utuh dibanding alamat.",
          },
        },
        {
          kind: "quiz",
          question: "Di dalam fungsi dengan parameter `int arr[]`, apa hasil `sizeof(arr) / sizeof(arr[0])`?",
          options: ["jumlah elemen array", "selalu 1", "ukuran pointer dibagi ukuran int, bukan jumlah elemen", "error kompilasi"],
          answer: 2,
          explanation: "Parameter array adalah pointer, jadi sizeof(arr) hanya memberi ukuran alamat. Hasilnya bukan jumlah elemen; itulah kenapa panjang dikirim sebagai parameter.",
        },
        {
          kind: "code",
          title: "Buktikan ekuivalensi subscript",
          prompt: "Cetak indeks, isi lewat subscript, dan isi lewat bentuk pointer-nya. Kedua cara harus memberi angka sama. Ganti `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int data[] = {5, 10, 15, 20};\n    size_t n = sizeof(data) / sizeof(data[0]);\n    for (size_t i = 0; i < n; i++) {\n        printf(\"%zu %d %d\\n\", i, data[i], ___);\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int data[] = {5, 10, 15, 20};\n    size_t n = sizeof(data) / sizeof(data[0]);\n    for (size_t i = 0; i < n; i++) {\n        printf(\"%zu %d %d\\n\", i, data[i], *(data + i));\n    }\n    return 0;\n}",
          tests: [{ stdin: "", expectedOutput: "0 5 5\n1 10 10\n2 15 15\n3 20 20" }],
          hints: [
            "Subscript adalah gula sintaks untuk aritmetika pointer.",
            "Dereference hasil penjumlahan data + i.",
            "Tulis *(data + i).",
          ],
        },
      ],
    },
    {
      slug: "pointer-parameter-fungsi",
      title: "Pointer sebagai Parameter Fungsi",
      summary: "Ubah variabel pemanggil dari dalam fungsi lewat alamat, pola swap klasik.",
      steps: [
        {
          kind: "theory",
          title: "Kirim alamat, bukan salinan",
          body: "C selalu mengirim argumen dengan menyalin nilainya. Fungsi menerima duplikat, dan mengubah parameter hanya mengubah salinannya. Itulah sebabnya fungsi tukar versi tanpa pointer tidak pernah berhasil: ia menukar dua salinan lalu membuangnya saat kembali.\n\nSolusinya kirim alamat. `tukar(&x, &y)` memberi fungsi lokasi asli, parameter `int *a, *b` menerima alamat itu, dan dereference mengubah nilai di lokasi sungguhan. Pola yang sama menjelaskan kenapa scanf meminta `&umur`: ia perlu alamat untuk menaruh hasilnya.\n\nPola ini bernama parameter keluaran: fungsi mengembalikan satu nilai lewat return, dan nilai tambahan lewat pointer. Konvensinya rapi: fungsi menghitung, pointer mengirim hasil. Di lesson penutup modul ini pola yang sama dipakai untuk mengirim dua hasil sekaligus.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nvoid tukar(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main(void) {\n    int x = 3, y = 9;\n    tukar(&x, &y);\n    printf(\"%d %d\\n\", x, y);\n    return 0;\n}",
            caption: "Alamat yang dikirim, nilai yang berubah.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `tukar(x, y)` tanpa pointer tidak menukar nilai aslinya?",
          options: [
            "Karena variabel lokal fungsi selalu konstan",
            "Karena C menyalin argumen; fungsi hanya mengubah salinannya",
            "Karena x dan y tidak bisa diubah dari fungsi mana pun",
            "Karena return belum dipanggil",
          ],
          answer: 1,
          explanation: "C pass by value. Fungsi menerima salinan, menukar salinan itu, lalu salinan dibuang saat fungsi kembali.",
        },
        {
          kind: "code",
          title: "Tukar yang meninggalkan jejak ganda",
          prompt: "Fungsi tukar sudah menerima alamat, tapi setelah dipanggil kedua nilai jadi sama. Jalankan tes untuk melihat gejalanya, lalu perbaiki satu baris yang salah di badan fungsi.",
          mode: "fix",
          template: "#include <stdio.h>\n\nvoid tukar(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = *a;\n}\n\nint main(void) {\n    int x, y;\n    scanf(\"%d %d\", &x, &y);\n    tukar(&x, &y);\n    printf(\"%d %d\\n\", x, y);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nvoid tukar(int *a, int *b) {\n    int tmp = *a;\n    *a = *b;\n    *b = tmp;\n}\n\nint main(void) {\n    int x, y;\n    scanf(\"%d %d\", &x, &y);\n    tukar(&x, &y);\n    printf(\"%d %d\\n\", x, y);\n    return 0;\n}",
          tests: [
            { stdin: "3 9", expectedOutput: "9 3" },
            { stdin: "100 1", expectedOutput: "1 100" },
            { stdin: "-5 5", expectedOutput: "5 -5", hidden: true },
          ],
          hints: [
            "Setelah *a diisi *b, nilai awal a hanya tersisa di tmp.",
            "Baris terakhir harus menulis isi tmp ke *b.",
            "Ganti *b = *a; menjadi *b = tmp;",
          ],
        },
      ],
    },
    {
      slug: "pointer-ke-pointer",
      title: "Pointer ke Pointer",
      summary: "Rantai dua tingkat dereference: pointer yang menunjuk pointer.",
      steps: [
        {
          kind: "theory",
          title: "Rantai dua tingkat",
          body: "Pointer bisa menunjuk pointer. `int **pp` berarti pp menyimpan alamat sebuah `int *`. Dereference-nya bertingkat: `*pp` adalah pointer yang ditunjuk pp, dan `**pp` adalah int yang ditunjuk pointer itu. Deklarasinya dibaca dari kanan: pp adalah pointer ke pointer ke int.\n\nUkuran `int **` tetap 8 byte di sistem 64 bit, sama seperti pointer mana pun. Yang berubah hanyalah berapa langkah dereference untuk sampai ke data. Terlalu banyak tingkatan memang membuat kode sulit dibaca, tapi satu tingkat `T **` adalah pola resmi yang sering muncul.\n\nUse case utamanya: mengubah pointer milik pemanggil dari dalam fungsi. Kalau fungsi perlu memindahkan ke mana sebuah pointer menunjuk, misalnya memasang head linked list baru atau mengganti buffer, ia butuh alamat pointer itu, dan alamat pointer adalah pointer ke pointer. Modul memori dinamis nanti memakainya terus.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    int nilai = 7;\n    int *p = &nilai;\n    int **pp = &p;\n\n    printf(\"%d %d %d\\n\", nilai, *p, **pp);\n    **pp = 30;\n    printf(\"%d\\n\", nilai);\n    return 0;\n}",
            caption: "nilai, *p, dan **pp membaca tempat yang sama.",
          },
        },
        {
          kind: "quiz",
          question: "`int x = 7; int *p = &x; int **pp = &p;` Ekspresi bernilai 7 adalah...",
          options: ["pp", "*pp", "**pp", "&pp"],
          answer: 2,
          explanation: "*pp adalah p, dan **pp adalah x. Dua langkah dereference sampai ke nilainya.",
        },
        {
          kind: "code",
          title: "Sambung rantai dua tingkat",
          prompt: "Sambungkan pp ke p sehingga **pp menulis langsung ke nilai. Ganti `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int nilai;\n    scanf(\"%d\", &nilai);\n    int *p = &nilai;\n    int **pp = ___;\n    **pp = **pp * 3;\n    printf(\"%d\\n\", nilai);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int nilai;\n    scanf(\"%d\", &nilai);\n    int *p = &nilai;\n    int **pp = &p;\n    **pp = **pp * 3;\n    printf(\"%d\\n\", nilai);\n    return 0;\n}",
          tests: [
            { stdin: "20", expectedOutput: "60" },
            { stdin: "5", expectedOutput: "15" },
            { stdin: "0", expectedOutput: "0", hidden: true },
          ],
          hints: [
            "pp menyimpan alamat pointer p, bukan alamat nilai.",
            "Operator & dipakai pada variabel pointer itu sendiri.",
            "Tulis int **pp = &p;",
          ],
        },
      ],
    },
    {
      slug: "void-pointer",
      title: "void* dan Cast Kembali",
      summary: "Kenali void* sebagai alamat generik dan cara mengembalikannya ke tipe asal.",
      steps: [
        {
          kind: "theory",
          title: "Alamat tanpa tipe",
          body: "`void *` adalah pointer ke tipe yang tidak disebutkan: alamat generik. Ia bisa menampung alamat objek tipe apa pun, dan C mengonversi `void*` ke dan dari `T*` secara otomatis saat penugasan. Itulah kenapa `malloc`, yang dibahas di modul berikutnya, mengembalikan `void*`.\n\nBatasnya jelas: void* tidak bisa didereference dan tidak bisa diaritmetika. Compiler tidak tahu berapa byte yang dimaksud dan bagaimana menafsirkannya. Untuk memakai isinya, cast dulu ke tipe asalnya: `int *p = (int *)alamat;`. Setelah itu dereference berjalan normal.\n\nKarena itu void* adalah alat untuk kode yang bekerja pada alamat tanpa peduli isinya: memcpy, qsort beserta callback pembandingnya, dan fungsi generik buatan sendiri. Aturan mainnya disiplin: siapa menyimpan, dia tahu tipenya, dan cast kembali harus ke tipe yang benar. Salah tipe, hasilnya sampah yang terlihat sah.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nvoid cetak_int(void *alamat) {\n    int *p = (int *)alamat;\n    printf(\"%d\\n\", *p);\n}\n\nint main(void) {\n    int x = 99;\n    void *v = &x;\n    cetak_int(v);\n    return 0;\n}",
            caption: "Cast (int *) mengembalikan alamat ke tipe asalnya sebelum didereference.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `*v` untuk `void *v` ditolak compiler?",
          options: [
            "Karena void* tidak menyimpan alamat apa pun",
            "Karena compiler tidak tahu tipe objeknya, jadi tak tahu berapa byte dibaca dan cara menafsirkannya",
            "Karena void* hanya boleh diisi dari malloc",
            "Karena dereference harus lewat char* dulu",
          ],
          answer: 1,
          explanation: "void* adalah alamat tanpa tipe. Tanpa tipe, compiler tak bisa menentukan ukuran dan tafsiran objeknya; cast dulu ke tipe asal.",
        },
      ],
    },
    {
      slug: "null-dan-cek-pointer",
      title: "NULL dan Cek Sebelum Dereference",
      summary: "Tandai pointer kosong dengan NULL dan selalu uji sebelum dereference.",
      steps: [
        {
          kind: "theory",
          title: "Kosong yang bisa dites",
          body: "`NULL` adalah konstanta pointer yang tidak menunjuk ke mana pun, dan dijamin tidak sama dengan alamat objek mana pun. Ia cara baku menandai kekosongan: fungsi pencarian mengembalikan NULL saat tidak ketemu, malloc mengembalikan NULL saat memori habis, dan parameter pointer opsional boleh menerima NULL.\n\nDereference NULL adalah undefined behavior dengan gejala paling terkenal: crash segfault. Bedanya dengan pointer liar, NULL setidaknya bisa dites. Karena itu dua kebiasaan yang dijaga: inisialisasi pointer dengan NULL saat belum punya alamat, dan uji sebelum dereference, `if (p != NULL)` atau bentuk singkatnya `if (p)`.\n\nPengujian bukan formalitas: fungsi yang menerima pointer pun berhak menolak NULL di awal. Memisahkan kasus kosong sejak awal jauh lebih murah daripada mengejar crash yang muncul di jalur eksekusi yang lain.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint *cari(int *data, size_t n, int target) {\n    for (size_t i = 0; i < n; i++) {\n        if (data[i] == target) {\n            return &data[i];\n        }\n    }\n    return NULL;\n}\n\nint main(void) {\n    int data[] = {8, 3, 5, 9};\n    int *hasil = cari(data, 4, 5);\n    if (hasil != NULL) {\n        printf(\"ketemu %d\\n\", *hasil);\n    } else {\n        printf(\"tidak ada\\n\");\n    }\n    return 0;\n}",
            caption: "NULL dipakai sebagai jawaban resmi untuk tidak ketemu.",
          },
        },
        {
          kind: "quiz",
          question: "Kebiasaan yang benar sebelum menulis `*p` adalah...",
          options: ["mencetak p dengan %p dulu", "meng-cast p ke int dulu", "menguji p != NULL", "menandai p volatile"],
          answer: 2,
          explanation: "Uji pointer sebelum dereference: if (p != NULL) atau singkatnya if (p).",
        },
        {
          kind: "code",
          title: "Cari dengan jawaban NULL",
          prompt: "Lengkapi fungsi cari: saat target tidak ada, kembalikan tanda pointer kosong; dan di main, uji hasil sebelum didereference. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint *cari(int *data, size_t n, int target) {\n    for (size_t i = 0; i < n; i++) {\n        if (data[i] == target) {\n            return &data[i];\n        }\n    }\n    return ___;\n}\n\nint main(void) {\n    int data[] = {8, 3, 5, 9};\n    int target;\n    scanf(\"%d\", &target);\n    int *hasil = cari(data, 4, target);\n    if (hasil != ___) {\n        printf(\"ketemu %d\\n\", *hasil);\n    } else {\n        printf(\"tidak ada\\n\");\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint *cari(int *data, size_t n, int target) {\n    for (size_t i = 0; i < n; i++) {\n        if (data[i] == target) {\n            return &data[i];\n        }\n    }\n    return NULL;\n}\n\nint main(void) {\n    int data[] = {8, 3, 5, 9};\n    int target;\n    scanf(\"%d\", &target);\n    int *hasil = cari(data, 4, target);\n    if (hasil != NULL) {\n        printf(\"ketemu %d\\n\", *hasil);\n    } else {\n        printf(\"tidak ada\\n\");\n    }\n    return 0;\n}",
          tests: [
            { stdin: "5", expectedOutput: "ketemu 5" },
            { stdin: "4", expectedOutput: "tidak ada" },
            { stdin: "8", expectedOutput: "ketemu 8", hidden: true },
          ],
          hints: [
            "Fungsi ini butuh jawaban resmi untuk tidak ketemu.",
            "Pengujian kekosongan pointer membandingkan dengan konstanta khusus.",
            "Isi keduanya dengan NULL.",
          ],
        },
      ],
    },
    {
      slug: "latihan-min-max",
      title: "Latihan Gabungan: Fungsi min_max",
      summary: "Rancang fungsi dengan dua pointer keluaran: min dan max sekaligus.",
      steps: [
        {
          kind: "theory",
          title: "Dua hasil, dua pointer",
          body: "Penutup modul ini memadukan semuanya: fungsi yang menghitung, dua pointer keluaran yang mengirim hasil, array yang meluruh jadi pointer saat dikirim, dan loop aritmetika pointer di dalamnya. Pola seperti `min_max` ini muncul terus di kode C nyata.\n\nPerhatikan desainnya: data dikirim sebagai `int *` dengan panjang terpisah, karena sizeof di dalam fungsi tidak berguna; sementara terkecil dan terbesar dikirim sebagai pointer yang diisi fungsi. Pemanggil membuat variabelnya sendiri lalu memberi alamatnya dengan &.\n\nAnggap n minimal 1 supaya data[0] sah menjadi nilai awal; fungsi produksi biasanya menolak n nol lebih dulu. Setelah tes lulus, baca ulang badan fungsi dan pastikan kamu bisa menjelaskan tiap bintang di sana.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nvoid min_max(int *data, size_t n, int *terkecil, int *terbesar) {\n    *terkecil = data[0];\n    *terbesar = data[0];\n    for (size_t i = 1; i < n; i++) {\n        if (data[i] < *terkecil) {\n            *terkecil = data[i];\n        }\n        if (data[i] > *terbesar) {\n            *terbesar = data[i];\n        }\n    }\n}\n\nint main(void) {\n    int data[] = {4, 10, 7, 1, 9};\n    int kecil, besar;\n    min_max(data, 5, &kecil, &besar);\n    printf(\"%d %d\\n\", kecil, besar);\n    return 0;\n}",
            caption: "Dua hasil sekaligus lewat dua pointer keluaran.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam `void min_max(int *data, size_t n, int *terkecil, int *terbesar)`, mengapa panjang n jadi parameter?",
          options: [
            "Agar fungsi bisa menghitung ulang sizeof(data)",
            "Karena di dalam fungsi data hanyalah pointer; sizeof(data) memberi ukuran alamat, bukan array",
            "Karena size_t wajib berpasangan dengan pointer",
            "Supaya compiler melakukan optimasi",
          ],
          answer: 1,
          explanation: "Array yang dikirim meluruh menjadi pointer, jadi ukurannya hilang. Panjang harus dikirim terpisah.",
        },
        {
          kind: "code",
          title: "Bangun min_max",
          prompt: "Lengkapi fungsi min_max: perbarui nilai terbesar di dalam loop, dan kirim hasil terkecil lewat pointer keluarannya. Ganti kedua `___`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nvoid min_max(int *data, size_t n, int *terkecil, int *terbesar) {\n    int min = data[0];\n    int max = data[0];\n    for (size_t i = 1; i < n; i++) {\n        if (data[i] < min) {\n            min = data[i];\n        }\n        if (data[i] > max) {\n            ___;\n        }\n    }\n    ___ = min;\n    *terbesar = max;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int data[100];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int terkecil, terbesar;\n    min_max(data, (size_t)n, &terkecil, &terbesar);\n    printf(\"min %d\\n\", terkecil);\n    printf(\"max %d\\n\", terbesar);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nvoid min_max(int *data, size_t n, int *terkecil, int *terbesar) {\n    int min = data[0];\n    int max = data[0];\n    for (size_t i = 1; i < n; i++) {\n        if (data[i] < min) {\n            min = data[i];\n        }\n        if (data[i] > max) {\n            max = data[i];\n        }\n    }\n    *terkecil = min;\n    *terbesar = max;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int data[100];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    int terkecil, terbesar;\n    min_max(data, (size_t)n, &terkecil, &terbesar);\n    printf(\"min %d\\n\", terkecil);\n    printf(\"max %d\\n\", terbesar);\n    return 0;\n}",
          tests: [
            { stdin: "5\n4 10 7 1 9", expectedOutput: "min 1\nmax 10" },
            { stdin: "1\n42", expectedOutput: "min 42\nmax 42" },
            { stdin: "3\n-5 0 5", expectedOutput: "min -5\nmax 5", hidden: true },
          ],
          hints: [
            "Saat data[i] lebih besar dari max, max harus diperbarui.",
            "Hasil dikirim lewat dereference pointer keluaran.",
            "Blank pertama max = data[i]; blank kedua *terkecil.",
          ],
        },
      ],
    },
  ],
};
