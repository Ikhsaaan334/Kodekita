import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "c",
  moduleRange: [2, 3],
  modules: [
    {
      title: "Memori Dinamis",
      description: "malloc/calloc/realloc/free, memory leak, dangling pointer, dan disiplin kepemilikan.",
    },
    {
      title: "String dan Buffer",
      description: "char array, string.h, jebakan buffer overflow, dan kebiasaan aman.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: Memori Dinamis ====================
    {
      slug: "mdyn-malloc-dasar",
      title: "malloc: Memesan Memori Saat Program Jalan",
      summary: "Pesan blok memori dari heap dengan malloc, cek hasilnya, dan pakai seperti array.",
      steps: [
        {
          kind: "theory",
          title: "Heap: memori yang kamu atur sendiri",
          body: "Selama ini array yang kamu buat berukuran tetap dan ditulis di kode: `int nilai[10]`. Ukurannya disepakati saat kompilasi, dan kalau kebutuhan nyatanya lebih besar atau lebih kecil, kita hanya bisa menebak. `malloc` memecah batas itu: ia memesan blok memori dari heap saat program berjalan, sebesar jumlah byte yang diminta, lalu mengembalikan pointer ke awal bloknya.\n\n`malloc` menerima jumlah byte, dan cara paling aman menghitungnya adalah mengalikan banyak elemen dengan ukuran tipenya: `malloc(n * sizeof(int))`. Hasilnya bertipe `void*`, pointer serbaguna yang di C otomatis cocok ke pointer tipe apa pun, jadi `int *data = malloc(...)` tidak perlu cast.\n\n`malloc` bisa gagal, misalnya saat permintaan terlalu besar. Saat gagal ia mengembalikan `NULL`, bukan pesan error. Karena itu setiap `malloc` wajib disambut cek `if (data == NULL)` sebelum dipakai. Membaca atau menulis lewat pointer `NULL` membuat program crash, dan kesalahan ini biasanya muncul justru di kondisi langka yang sulit diuji.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 3;\n    int *data = malloc(n * sizeof(int));\n    if (data == NULL) {\n        printf(\"alokasi gagal\\n\");\n        return 1;\n    }\n    for (int i = 0; i < n; i++) {\n        data[i] = (i + 1) * (i + 1);\n    }\n    for (int i = 0; i < n; i++) {\n        printf(\"%d \", data[i]);\n    }\n    printf(\"\\n\");\n    free(data);\n    return 0;\n}",
            caption: "malloc memesan tiga int di heap; free mengembalikannya saat selesai.",
          },
        },
        {
          kind: "quiz",
          question: "Kalau `malloc` gagal memenuhi permintaan alokasi, apa yang ia kembalikan?",
          options: ["Angka 0", "NULL", "Pointer ke memori sampah", "Ia langsung menghentikan program"],
          answer: 1,
          explanation: "`malloc` mengembalikan NULL saat gagal. Karena itu cek `if (p == NULL)` wajib dilakukan sebelum pointer dipakai.",
        },
        {
          kind: "code",
          title: "Jumlahkan data dari heap",
          prompt: "Lengkapi dua kekosongan: panggilan alokasi untuk `n` buah `int`, dan nilai yang dibandingkan dengan `data` untuk mendeteksi kegagalan alokasi. Input: baris pertama `n`, baris kedua `n` buah bilangan. Keluaran: jumlahnya.",
          mode: "fill",
          template: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = ___(n * sizeof(int));
    if (data == ___) {
        printf("alokasi gagal\\n");
        return 1;
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
        total += data[i];
    }
    printf("%d\\n", total);
    free(data);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = malloc(n * sizeof(int));
    if (data == NULL) {
        printf("alokasi gagal\\n");
        return 1;
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
        total += data[i];
    }
    printf("%d\\n", total);
    free(data);
    return 0;
}`,
          tests: [
            { stdin: "3\n4 10 7", expectedOutput: "21" },
            { stdin: "1\n5", expectedOutput: "5" },
            { stdin: "4\n2 8 -3 9", expectedOutput: "16", hidden: true },
          ],
          hints: [
            "Fungsi alokasinya sama seperti yang ada di teori, menerima jumlah byte hasil perkalian n dengan sizeof(int).",
            "Cek kegagalan alokasi membandingkan pointer dengan konstanta khusus yang berarti tidak menunjuk ke mana pun.",
            "Jawabannya: malloc dan NULL.",
          ],
        },
      ],
    },
    {
      slug: "mdyn-calloc-zeroing",
      title: "calloc: Alokasi yang Sudah Bersih",
      summary: "Bedakan malloc dan calloc, dan tahu kapan butuh memori yang berisi nol sejak awal.",
      steps: [
        {
          kind: "theory",
          title: "Memori sampah versus memori nol",
          body: "`malloc` tidak mengisi bloknya dengan apa pun: isinya memori sampah yang bisa berupa angka apa pun. Membaca elemen sebelum diisi adalah perilaku tidak terdefinisi, dan hasilnya bisa berbeda antar mesin maupun antar eksekusi. `calloc` menutup lubang ini: ia menerima banyak elemen dan ukuran tiap elemen, `calloc(n, sizeof(int))`, lalu mengisi seluruh blok dengan nol sebelum dikembalikan.\n\nAda dua perbedaan praktis. Pertama, bentuk parameternya sudah berpasangan, `calloc(n, sizeof(int))` berbanding `malloc(n * sizeof(int))`. Kedua, `calloc` mengecek perkaliannya: kalau `n * sizeof(int)` melebihi batas ukuran yang bisa dialamatkan, ia gagal dan mengembalikan NULL. Pada `malloc`, perkalian yang meluap terjadi di kode kamu sendiri dan bisa tanpa sadar memesan blok jauh lebih kecil dari yang dikira.\n\nKapan memilih mana? Pakai `malloc` kalau kamu akan mengisi semua elemen segera setelah alokasi. Pakai `calloc` kalau kamu butuh keadaan awal nol, misalnya penghitung, penanda kosong, atau array yang hanya terisi sebagian.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *hitung = calloc(4, sizeof(int));\n    if (hitung == NULL) return 1;\n    hitung[0]++;\n    hitung[0]++;\n    hitung[3]++;\n    for (int i = 0; i < 4; i++) {\n        printf(\"%d \", hitung[i]);\n    }\n    printf(\"\\n\");\n    free(hitung);\n    return 0;\n}",
            caption: "Semua elemen mulai dari 0, jadi cukup ditambah tanpa diisi dulu.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan utama `calloc(n, size)` dari `malloc(n * size)`?",
          options: [
            "calloc selalu lebih cepat",
            "calloc mengisi blok dengan nol, malloc tidak",
            "calloc tidak perlu di-free",
            "calloc mengembalikan array, malloc mengembalikan pointer",
          ],
          answer: 1,
          explanation: "calloc men-zeroing seluruh blok sebelum dikembalikan, malloc tidak mengisi apa pun. Keduanya tetap wajib di-free dan keduanya mengembalikan pointer.",
        },
        {
          kind: "code",
          title: "Penanda kursi yang mulai dari nol",
          prompt: "Lengkapi dua kekosongan: alokasi array n buah `int` yang isinya nol sejak awal, dan pembebasan memori di akhir. Program menandai posisi pertama dan terakhir dari input, sisanya tetap 0. Input: baris pertama `n`, lalu dua bilangan penanda.",
          mode: "fill",
          template: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *kursi = ___(n, sizeof(int));
    if (kursi == NULL) return 1;
    scanf("%d", &kursi[0]);
    scanf("%d", &kursi[n - 1]);
    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", kursi[i]);
    }
    printf("\\n");
    ___(kursi);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *kursi = calloc(n, sizeof(int));
    if (kursi == NULL) return 1;
    scanf("%d", &kursi[0]);
    scanf("%d", &kursi[n - 1]);
    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", kursi[i]);
    }
    printf("\\n");
    free(kursi);
    return 0;
}`,
          tests: [
            { stdin: "2\n5\n9", expectedOutput: "5 9" },
            { stdin: "3\n1\n2", expectedOutput: "1 0 2" },
            { stdin: "4\n-3\n4", expectedOutput: "-3 0 0 4", hidden: true },
          ],
          hints: [
            "Fungsi yang mengisi nol menerima dua argumen: banyak elemen, lalu ukuran tiap elemen.",
            "Setiap alokasi diakhiri pembebasan dengan fungsi yang menerima pointernya saja.",
            "Jawabannya: calloc dan free.",
          ],
        },
      ],
    },
    {
      slug: "mdyn-free-pasangan",
      title: "free dan Aturan Pasangan",
      summary: "Setiap alokasi wajib dibebaskan tepat sekali; pelajari aturan mainnya sebelum terlanjur bocor.",
      steps: [
        {
          kind: "theory",
          title: "Satu alokasi, satu free",
          body: "Memori heap tidak kembali dengan sendirinya. Setiap `malloc` dan `calloc` membuat utang yang hanya bisa dilunasi dengan `free(pointer)`. `free` menerima pointer yang dulu dikembalikan `malloc`, `calloc`, atau `realloc`, lalu menandai bloknya tersedia lagi. Setelah pemanggilan itu, memori tersebut bukan milikmu.\n\nAturannya pasangan satu-satu: tepat satu `free` untuk tiap alokasi. Lupa `free` berarti kebocoran. `free` dua kali pada pointer yang sama (double free) adalah perilaku tidak terdefinisi: bisa crash, bisa diam-diam merusak data internal pengelola memori dan meledak jauh di tempat lain. Kabar baiknya, `free(NULL)` aman dan tidak melakukan apa pun, jadi pola `int *p = NULL;` lalu `free(p)` tetap sah walau alokasinya tidak pernah terjadi.\n\nKebiasaan yang menolong: bebaskan memori di tingkat yang sama dengan tempat ia dialokasi kalau memungkinkan, dan setelah `free`, jangan sentuh pointernya lagi. Poin kedua ini dibahas tuntas di pelajaran tentang dangling pointer.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *a = malloc(sizeof(int));\n    int *b = NULL;            // belum pernah dialokasi\n    if (a != NULL) {\n        *a = 10;\n    }\n    free(a);   // pasangan dari malloc\n    free(b);   // aman: free(NULL) tidak melakukan apa pun\n    a = NULL;  // mencegah pemakaian tak sengaja\n    printf(\"selesai\\n\");\n    return 0;\n}",
            caption: "Tepat satu free untuk tiap alokasi; free(NULL) aman.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi kalau satu pointer yang sama di-`free` dua kali?",
          options: [
            "Pemanggilan kedua diabaikan, aman",
            "Perilaku tidak terdefinisi, sering berujung crash atau kerusakan memori",
            "free kedua otomatis mengalokasi ulang bloknya",
            "Compiler menolak mengompilasi kode itu",
          ],
          answer: 1,
          explanation: "Double free adalah perilaku tidak terdefinisi. Hanya free(NULL) yang dijamin aman; itulah alasan pointer sering di-NULL-kan setelah di-free.",
        },
        {
          kind: "quiz",
          question: "Manakah pemanggilan `free` yang dijamin aman tanpa syarat apa pun?",
          options: ["free(p) setelah p dipakai membaca data", "free(p) dua kali berturut-turut", "free(NULL)", "free(p) saat p masih menunjuk data yang sedang dipakai fungsi lain"],
          answer: 2,
          explanation: "Standar C menjamin free(NULL) tidak melakukan apa pun. Bentuk lain tetap menuntut kecocokan satu-satu dengan alokasi yang masih hidup.",
        },
      ],
    },
    {
      slug: "mdyn-memory-leak",
      title: "Memory Leak dan Cara Mendeteksinya",
      summary: "Kenali kebocoran memori, dampaknya pada program lama, dan alat pendeteksi seperti valgrind.",
      steps: [
        {
          kind: "theory",
          title: "Blok yatim yang tidak bisa dilepas",
          body: "Memory leak terjadi saat blok heap masih dialokasi, tetapi tidak ada pointer yang menunjuknya lagi. Blok itu tidak bisa dipakai dan tidak bisa dibebaskan: alamatnya hilang. Contoh paling umum adalah menimpa pointer: `int *p = malloc(sizeof(int) * 10);` lalu `p = malloc(sizeof(int) * 5);` tanpa membebaskan yang pertama. Blok pertama kini yatim, dan utangnya tetap ada.\n\nSatu kebocoran kecil jarang terasa. Masalahnya menumpuk di program yang berjalan lama: server, game, atau alat baris perintah yang dipakai berjam-jam. Kebocoran yang terjadi tiap iterasi, dikali jutaan iterasi, berubah jadi pemakaian RAM yang naik terus sampai sistem kehabisan memori. Karena itu kebocoran dicari sejak kode masih kecil, bukan setelah produksi.\n\nAlat klasik untuk mendeteksinya adalah valgrind di Linux: programmu dijalankan di bawahnya, dan saat selesai valgrind melaporkan blok yang hilang beserta jejak baris tempat ia dialokasi. Compiler modern punya laporan serupa lewat sanitizer, misalnya opsi `-fsanitize=address`. Konsepnya sama: catat tiap alokasi, lalu cek semuanya sudah dilepas saat program keluar.",
          code: {
            language: "c",
            content: "#include <stdlib.h>\n\nvoid bocor(void) {\n    int *p = malloc(100 * sizeof(int));\n    (void)p;\n    // p keluar scope tanpa free: 400 byte hilang tiap panggilan\n}\n\nvoid aman(void) {\n    int *p = malloc(100 * sizeof(int));\n    if (p == NULL) return;\n    free(p);\n}\n\nint main(void) {\n    bocor();\n    aman();\n    return 0;\n}",
            caption: "Sama-sama keluar dari fungsi, nasib bloknya berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Perhatikan kode ini (int berukuran 4 byte):\n\n```c\nint *p = malloc(sizeof(int) * 10);\np = malloc(sizeof(int) * 5);\n```\n\nBerapa byte yang bocor?",
          options: ["20 byte, blok kedua yang bocor", "40 byte, blok pertama kehilangan satu-satunya penunjuknya", "60 byte, keduanya bocor", "Tidak ada yang bocor"],
          answer: 1,
          explanation: "p adalah satu-satunya penunjuk ke blok pertama (10 x 4 = 40 byte). Setelah ditimpa, blok itu yatim dan tidak pernah bisa di-free. Blok kedua masih terjangkau lewat p.",
        },
      ],
    },
    {
      slug: "mdyn-dangling-pointer",
      title: "Dangling Pointer dan Use-After-Free",
      summary: "Kenapa memori yang sudah di-free tidak boleh disentuh, dan cara menetralisir pointernya.",
      steps: [
        {
          kind: "theory",
          title: "Alamat yang masih tertinggal",
          body: "Setelah `free(p)`, p tidak otomatis menjadi NULL. Ia masih menyimpan alamat lama, tetapi bloknya sudah bukan milikmu: pengelola memori bebas memakai ulang isinya kapan saja. Pointer dalam keadaan seperti ini disebut dangling pointer. Membaca atau menulis lewatnya (use-after-free) adalah perilaku tidak terdefinisi: kadang tampak jalan normal, kadang menghasilkan data sampah, kadang crash. Kasus pertama justru paling berbahaya, karena bug itu tampak sehat sampai suatu hari tidak.\n\nPerlindungan yang umum: tepat setelah `free`, tulis `p = NULL`. Pemakaian tak sengaja lalu tampak segera sebagai crash di titik yang benar (null dereference), alih-alih korupsi yang muncul jauh dari sumbernya. Ini penyelamatan kecil dengan efek besar saat debugging.\n\nSatu catatan lagi: `malloc` berikutnya bisa saja mengembalikan alamat yang sama. Dua pointer yang kebetulan sealamat tidak mengembalikan hak milikmu; aturannya tetap satu, jangan sentuh memori yang sudah di-free.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *p = malloc(sizeof(int));\n    if (p == NULL) return 1;\n    *p = 7;\n    printf(\"sebelum: %d\\n\", *p);\n    free(p);\n    p = NULL;\n    if (p == NULL) {\n        printf(\"p sudah netral, salah pakai langsung terlihat\\n\");\n    }\n    return 0;\n}",
            caption: "Setelah free, pointer langsung di-NULL supaya salah pakai terlihat.",
          },
        },
        {
          kind: "code",
          title: "Netralisir pointer setelah free",
          prompt: "Program ini seharusnya mencetak dua baris, tetapi baris kedua tidak pernah muncul karena perlindungan setelah `free` hilang. Perbaiki satu kesalahannya. Input: satu bilangan bulat.",
          mode: "fix",
          template: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    if (p == NULL) {
        printf("alokasi gagal\\n");
        return 1;
    }
    scanf("%d", p);
    printf("nilai: %d\\n", *p);
    free(p);
    if (p == NULL) {
        printf("pointer sudah netral\\n");
    }
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    if (p == NULL) {
        printf("alokasi gagal\\n");
        return 1;
    }
    scanf("%d", p);
    printf("nilai: %d\\n", *p);
    free(p);
    p = NULL;
    if (p == NULL) {
        printf("pointer sudah netral\\n");
    }
    return 0;
}`,
          tests: [
            { stdin: "42", expectedOutput: "nilai: 42\npointer sudah netral" },
            { stdin: "7", expectedOutput: "nilai: 7\npointer sudah netral" },
            { stdin: "-5", expectedOutput: "nilai: -5\npointer sudah netral", hidden: true },
          ],
          hints: [
            "Jalankan dulu: kondisi if setelah free tidak pernah terpenuhi, padahal free sudah dipanggil.",
            "free tidak mengubah isi p. Yang membuat p NULL adalah penugasan, dan penugasan itu yang hilang.",
            "Tambahkan p = NULL; tepat setelah free(p);",
          ],
        },
      ],
    },
    {
      slug: "mdyn-realloc-array",
      title: "realloc: Memperbesar Array yang Sudah Ada",
      summary: "Perluas blok heap dengan realloc dan pelajari idiom penampungannya yang aman.",
      steps: [
        {
          kind: "theory",
          title: "Blok yang ikut pindah",
          body: "Kebutuhan sering berubah di tengah jalan: array 10 elemen ternyata butuh 100. `realloc(ptr, ukuran_baru)` mencoba memperluas blok yang ada; kalau di tempat lama tidak muat, ia memesan blok baru, menyalin isi lama, membebaskan blok lama, lalu mengembalikan alamat baru. Karena alamat bisa berubah, hasil `realloc` wajib ditampung, bukan dianggap alamat lama tetap sah.\n\nIdiom yang aman menampung ke pointer sementara: `int *sementara = realloc(data, m * sizeof(int));` kalau `sementara == NULL`, alokasi gagal dan blok lama masih utuh, jadi `free(data)` lalu beres. Kalau berhasil, `data = sementara`. Menulis `data = realloc(data, ...)` langsung membuang satu-satunya pointer ke blok lama saat gagal, dan itulah resep kebocoran baru.\n\nElemen yang baru ditambah tidak dijamin isinya: `realloc` tidak mengisi memori tambahan. Kalau butuh nol, isi sendiri. Untuk array yang tumbuh terus, trik umum adalah menggandakan kapasitas saat penuh, bukan menambah satu elemen tiap kali, supaya penyalinan jarang terjadi.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *data = malloc(2 * sizeof(int));\n    if (data == NULL) return 1;\n    data[0] = 10;\n    data[1] = 20;\n\n    int *sementara = realloc(data, 4 * sizeof(int));\n    if (sementara == NULL) {\n        free(data);\n        return 1;\n    }\n    data = sementara;\n    data[2] = 30;\n    data[3] = 40;\n    for (int i = 0; i < 4; i++) {\n        printf(\"%d \", data[i]);\n    }\n    printf(\"\\n\");\n    free(data);\n    return 0;\n}",
            caption: "Isi lama ikut pindah; yang perlu diisi hanya elemen barunya.",
          },
        },
        {
          kind: "code",
          title: "Array yang bertambah satu",
          prompt: "Lengkapi dua kekosongan: pemanggilan pelebaran blok dari `n` ke `n + 1` elemen, dan penampungan hasilnya ke `data`. Input: `n`, `n` buah bilangan, lalu satu bilangan tambahan. Keluaran: seluruh isi array akhir.",
          mode: "fill",
          template: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = malloc(n * sizeof(int));
    if (data == NULL) return 1;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
    }

    int *sementara = ___(data, (n + 1) * sizeof(int));
    if (sementara == NULL) {
        free(data);
        return 1;
    }
    data = ___;
    scanf("%d", &data[n]);
    n = n + 1;

    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", data[i]);
    }
    printf("\\n");
    free(data);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = malloc(n * sizeof(int));
    if (data == NULL) return 1;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
    }

    int *sementara = realloc(data, (n + 1) * sizeof(int));
    if (sementara == NULL) {
        free(data);
        return 1;
    }
    data = sementara;
    scanf("%d", &data[n]);
    n = n + 1;

    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", data[i]);
    }
    printf("\\n");
    free(data);
    return 0;
}`,
          tests: [
            { stdin: "3\n1 2 3\n5", expectedOutput: "1 2 3 5" },
            { stdin: "1\n9\n8", expectedOutput: "9 8" },
            { stdin: "2\n-4 -1\n-7", expectedOutput: "-4 -1 -7", hidden: true },
          ],
          hints: [
            "Fungsi pelebaran menerima pointer lama dan ukuran baru dalam byte.",
            "Variabel penampungnya sudah bernama sementara; pointer data harus mengikuti hasilnya.",
            "Jawabannya: realloc dan sementara.",
          ],
        },
      ],
    },
    {
      slug: "mdyn-sizeof-jebakan",
      title: "Jebakan sizeof di malloc",
      summary: "Hitung ukuran alokasi dengan benar, dan pahami sizeof pada pointer versus tipe yang ditunjuk.",
      steps: [
        {
          kind: "theory",
          title: "Perkalian yang salah cara",
          body: "Rumus yang benar: banyak elemen dikali ukuran tiap elemen, `malloc(n * sizeof(int))` untuk n buah int. Kesalahannya biasanya tiga arah. `malloc(n)` untuk n int hanya memesan n byte, cukup untuk sebagian kecil int. `malloc(sizeof(int))` memesan satu int saja, padahal yang diinginkan array. Dan `malloc(n) * sizeof(int)` justru mengalikan hasil malloc, bukan argumennya.\n\nJebakan kedua lebih licik: `sizeof` pada pointer. Untuk `int *p;`, nilai `sizeof(p)` adalah ukuran pointernya (8 byte di sistem 64-bit), bukan ukuran int yang ditunjuk. Rumus yang selamat dari semua tipe adalah `malloc(n * sizeof *p)`: ia mengikuti tipe yang ditunjuk p, jadi tetap benar bahkan saat tipe elemen berganti dari int ke double.\n\nSatu hal yang penting dilupakan: `sizeof` tidak bisa memberi tahu seberapa besar blok yang sudah berhasil dialokasi. C tidak menyimpan panjang blok untukmu, dan `sizeof` dievaluasi dari tipe statis saat kompilasi. Kamu sendiri yang mencatat n-nya, biasanya berpasangan dengan pointernya di satu struct.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *p = malloc(3 * sizeof(int));   // benar: ruang untuk 3 int\n    double *q = malloc(3 * sizeof *q);  // ikut tipe q\n\n    printf(\"sizeof(int) = %zu\\n\", sizeof(int));\n    printf(\"sizeof(*p)  = %zu\\n\", sizeof(*p));  // ukuran int yang ditunjuk\n    printf(\"sizeof(p)   = %zu\\n\", sizeof(p));   // ukuran pointernya\n\n    free(p);\n    free(q);\n    return 0;\n}",
            caption: "sizeof *p mengikuti tipe elemen; sizeof p mengikuti pointernya.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa banyak int utuh (4 byte) yang benar-benar muat di blok hasil `int *p = malloc(30);`?",
          options: ["30 int", "7 int", "8 int", "Tergantung isi p"],
          answer: 1,
          explanation: "30 byte hanya muat 7 int utuh (7 x 4 = 28 byte). Pola malloc(n * sizeof(int)) mencegah hitungan rusak seperti ini.",
        },
        {
          kind: "quiz",
          question: "Pada sistem 64-bit, apa nilai `sizeof(p)` jika `int *p;`?",
          options: ["4, sama dengan ukuran int", "8, ukuran pointernya", "Ukuran blok yang dialokasi malloc", "0"],
          answer: 1,
          explanation: "sizeof pada variabel pointer mengukur pointernya, yaitu 8 byte di sistem 64-bit, apa pun tipe yang ditunjuk. Ukuran elemen dihitung lewat sizeof(*p).",
        },
      ],
    },
    {
      slug: "mdyn-struct-dinamis",
      title: "Alokasi Struct di Heap",
      summary: "Pesan struct dengan malloc, akses field lewat operator panah, dan bebaskan dengan benar.",
      steps: [
        {
          kind: "theory",
          title: "Struct besar tinggal di heap",
          body: "Struct yang besar, atau struct yang harus hidup melampaui fungsi pembuatnya, pasangannya adalah heap. Pola umumnya: `Titik *p = malloc(sizeof *p);`. `sizeof *p` menghitung ukuran struct yang ditunjuk p dan tetap benar walau field struct ditambah atau diubah. Setelah itu, akses fieldnya lewat operator panah: `p->x` sama artinya dengan `(*p).x`.\n\n`scanf` bekerja dengan alamat, jadi membaca ke struct dinamis berarti memberi alamat fieldnya: `scanf(\"%d\", &p->x)`. Urutan pengerjaannya sudah benar tanpa tanda kurung tambahan, karena `&p->x` berarti `&(p->x)`. Ini porsi kesalahan klasik: lupa `&`, dan scanf menerima nilai alih-alih alamat.\n\nMembebaskan struct dinamis tetap satu `free(p)`. Yang perlu disadari: kalau field struct itu sendiri berisi pointer hasil malloc, `free(p)` hanya melepas structnya, bukan blok yang ditunjuk fieldnya. Blok dalam harus dilepas lebih dulu; pola ini kita bahas tuntas di pelajaran kepemilikan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    char nama[16];\n    int nilai;\n} Mahasiswa;\n\nint main(void) {\n    Mahasiswa *m = malloc(sizeof *m);\n    if (m == NULL) return 1;\n    m->nilai = 88;\n    printf(\"nilai %s: %d\\n\", \"Rina\", m->nilai);\n    free(m);\n    return 0;\n}",
            caption: "Panah menggantikan titik saat bekerja lewat pointer struct.",
          },
        },
        {
          kind: "code",
          title: "Titik di heap",
          prompt: "Lengkapi dua kekosongan: nama tipe struct yang dialokasi, dan alamat field pertama untuk `scanf`. Input: dua bilangan bulat x dan y. Keluaran: isi struct yang sudah terisi.",
          mode: "fill",
          template: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Titik;

int main(void) {
    Titik *p = malloc(sizeof(___));
    if (p == NULL) return 1;
    scanf("%d %d", ___, &p->y);
    printf("Titik(%d, %d)\\n", p->x, p->y);
    free(p);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Titik;

int main(void) {
    Titik *p = malloc(sizeof(Titik));
    if (p == NULL) return 1;
    scanf("%d %d", &p->x, &p->y);
    printf("Titik(%d, %d)\\n", p->x, p->y);
    free(p);
    return 0;
}`,
          tests: [
            { stdin: "3 4", expectedOutput: "Titik(3, 4)" },
            { stdin: "-2 7", expectedOutput: "Titik(-2, 7)" },
            { stdin: "0 0", expectedOutput: "Titik(0, 0)", hidden: true },
          ],
          hints: [
            "sizeof butuh nama tipenya, sama seperti yang dideklarasikan di typedef.",
            "scanf butuh alamat field. Field struct lewat pointer ditulis dengan panah: &p->x.",
            "Jawabannya: Titik dan &p->x.",
          ],
        },
      ],
    },
    {
      slug: "mdyn-ownership",
      title: "Siapa yang Memfree? Disiplin Kepemilikan",
      summary: "Tetapkan satu pemilik untuk tiap blok heap supaya tidak ada lupa free maupun dobel free.",
      steps: [
        {
          kind: "theory",
          title: "Satu blok, satu pemilik",
          body: "Dengan aturan `siapa malloc, dia yang free`, kekacauan mulai saat blok melewati batas fungsi: fungsi A membuat, fungsi B memakai, lalu siapa yang membebaskan? Jawaban yang dipakai kode C yang sehat adalah kepemilikan: tiap blok punya tepat satu pemilik, dan hanya pemilik yang boleh mem-free. Pihak lain boleh memakai pointernya (meminjam), tetapi tidak melepasnya.\n\nKepemilikan dikomunikasikan lewat nama dan kontrak. Fungsi yang mengembalikan pointer hasil malloc biasanya dinamai jelas, misalnya `buat_daftar` atau `muat_data`, dan didokumentasikan: pemanggil wajib free hasilnya. Sebaliknya, fungsi yang hanya meminjam tidak pernah mem-free milik pemanggil. Ketika kepemilikan berpindah tangan, pemilik lama berhenti sepenuhnya: pointernya di-NULL dan tidak disentuh lagi.\n\nDisiplin ini yang menyelamatkanmu dari dua kutub bahaya sekaligus: lupa free (kebocoran) dan dobel free (korupsi). Bahasa lain membangun ide yang sama ke dalam tipenya; di C, kamu yang menjaganya. Kebiasaan sederhana `satu blok, satu pemilik, satu free` sudah menutup sebagian besar kasus.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\n// mengembalikan blok yang miliknya berpindah ke pemanggil\nint *buat_kuadrat(int n) {\n    int *data = malloc(n * sizeof(int));\n    if (data == NULL) return NULL;\n    for (int i = 0; i < n; i++) data[i] = (i + 1) * (i + 1);\n    return data;\n}\n\n// hanya meminjam: membaca, tanpa free, tanpa menyimpan alamat\nvoid cetak(const int *data, int n) {\n    for (int i = 0; i < n; i++) printf(\"%d \", data[i]);\n    printf(\"\\n\");\n}\n\nint main(void) {\n    int *data = buat_kuadrat(3);\n    if (data == NULL) return 1;\n    cetak(data, 3);\n    free(data);  // pemilik menutup umur bloknya\n    data = NULL;\n    return 0;\n}",
            caption: "buat_kuadrat menyerahkan kepemilikan; cetak meminjam; main melepas.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi `char *muat_teks()` terdokumentasi begini: mengembalikan buffer hasil malloc, dan pemanggil yang memiliki. Siapa yang wajib mem-free hasilnya?",
          options: [
            "muat_teks sendiri, otomatis sebelum return",
            "Pemanggil, sebagai pemilik baru hasil alokasi",
            "Sistem operasi, saat program keluar",
            "Tidak ada, buffer dibersihkan sendiri",
          ],
          answer: 1,
          explanation: "Kontraknya jelas: kepemilikan berpindah ke pemanggil. Pemanggil wajib free saat selesai, dan muat_teks tidak boleh menyentuh blok itu lagi setelah mengembalikannya.",
        },
      ],
    },
    {
      slug: "mdyn-latihan-array-dinamis",
      title: "Latihan: Array Dinamis yang Bertumbuh",
      summary: "Gabungkan malloc, realloc, pencarian maksimum, dan free dalam satu program utuh.",
      steps: [
        {
          kind: "theory",
          title: "Empat babak yang selalu sama",
          body: "Sekarang seluruh modul dirangkai jadi satu program: alokasi awal dengan `malloc` dan cek NULL, pelebaran dengan `realloc` lewat pointer sementara, pemakaian array seperti biasa, dan `free` di akhir. Pola ini adalah kerangka dynamic array yang nanti dipoles lagi di modul struktur data.\n\nPerhatikan urutan yang aman saat `realloc` gagal: blok lama masih valid, jadi `free(data)` pada pointer lama, lalu keluar. Setelah berhasil, pointer lama tidak dipakai lagi; semua akses lewat `data` yang baru. Mencari maksimum dan menampilkan isi dikerjakan dua loop terpisah supaya mudah dibaca ulang besok.\n\nSatu kebiasaan penutup: setiap jalur keluar yang sudah melewati alokasi wajib melepas apa yang dipegangnya sebelum `return`. Di program kecil ini dampaknya tak terlihat; di program panjang, konsistensi inilah yang membuat alat cek kebocoran melaporkan angka nol.",
          code: {
            language: "c",
            content: "// kerangka yang selalu sama\nint *data = malloc(n * sizeof(int));\nif (data == NULL) { /* keluar */ }\n\n/* pakai blok awal */\n\nint *sementara = realloc(data, m * sizeof(int));\nif (sementara == NULL) { free(data); /* keluar */ }\ndata = sementara;\n\n/* pakai blok yang diperbesar */\n\nfree(data);",
            caption: "Empat babak: alokasi, cek, pakai, lepas.",
          },
        },
        {
          kind: "code",
          title: "Tumbuh lalu cari maksimum",
          prompt: "Lengkapi dua kekosongan: pelebaran blok untuk satu elemen tambahan, dan pembanding yang mencari nilai maksimum. Input: `n`, `n` buah bilangan, lalu satu bilangan tambahan. Keluaran: seluruh isi array akhir, lalu baris `maks: <nilai>`.",
          mode: "fill",
          template: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = malloc(n * sizeof(int));
    if (data == NULL) return 1;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
    }

    int *sementara = ___(data, (n + 1) * sizeof(int));
    if (sementara == NULL) {
        free(data);
        return 1;
    }
    data = sementara;
    scanf("%d", &data[n]);
    n = n + 1;

    int maks = data[0];
    for (int i = 1; i < n; i++) {
        if (data[i] ___ maks) {
            maks = data[i];
        }
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", data[i]);
    }
    printf("\\n");
    printf("maks: %d\\n", maks);
    free(data);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *data = malloc(n * sizeof(int));
    if (data == NULL) return 1;
    for (int i = 0; i < n; i++) {
        scanf("%d", &data[i]);
    }

    int *sementara = realloc(data, (n + 1) * sizeof(int));
    if (sementara == NULL) {
        free(data);
        return 1;
    }
    data = sementara;
    scanf("%d", &data[n]);
    n = n + 1;

    int maks = data[0];
    for (int i = 1; i < n; i++) {
        if (data[i] > maks) {
            maks = data[i];
        }
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) printf(" ");
        printf("%d", data[i]);
    }
    printf("\\n");
    printf("maks: %d\\n", maks);
    free(data);
    return 0;
}`,
          tests: [
            { stdin: "3\n1 5 3\n9", expectedOutput: "1 5 3 9\nmaks: 9" },
            { stdin: "2\n-4 -1\n-7", expectedOutput: "-4 -1 -7\nmaks: -1" },
            { stdin: "1\n2\n3", expectedOutput: "2 3\nmaks: 3", hidden: true },
          ],
          hints: [
            "Pelebaran memakai fungsi yang sama seperti pelajaran realloc, dengan ukuran baru (n + 1) elemen.",
            "Maksimum diperbarui tiap kali elemen sekarang lebih besar dari penampung maksimum.",
            "Jawabannya: realloc dan >.",
          ],
        },
        {
          kind: "quiz",
          question: "Saat `int *sementara = realloc(data, baru);` mengembalikan NULL, apa langkah yang benar?",
          options: [
            "Langsung free data pada pointer baru yang NULL",
            "Blok lama masih valid: free(data) pada pointer lama, lalu keluar",
            "Panggil realloc lagi tanpa free apa pun",
            "Tidak perlu apa-apa, realloc membersihkan sendiri",
          ],
          answer: 1,
          explanation: "Saat realloc gagal, blok lama tidak berpindah dan tidak dibebaskan. Satu-satunya penunjuknya masih data, jadi dia yang harus di-free.",
        },
      ],
    },

    // ==================== MODUL 3: String dan Buffer ====================
    {
      slug: "sbuf-char-array-terminator",
      title: "char Array dan Null Terminator",
      summary: "String di C hanyalah char array yang diakhiri karakter nol; pelajari aturan yang mengatur semuanya.",
      steps: [
        {
          kind: "theory",
          title: "Satu byte nol yang menentukan segalanya",
          body: "C tidak punya tipe string. Yang dinamakan string adalah deretan char yang diakhiri penanda: `\\0`, karakter bernilai nol. `printf(\"%s\", s)` membaca dari alamat s sampai ketemu `\\0`; kalau terminatornya lupa ditaruh, pembacaan terus berjalan ke memori di luar array sampai kebetulan menemukan byte nol. Dari satu kealpaan kecil inilah lahir banyak bug misterius di C.\n\nMenulis `char kata[] = \"bajuu\";` membuat compiler menghitung sendiri: 5 karakter plus satu `\\0`, total 6 byte. Kalau kamu menentukan ukurannya sendiri, sisakan ruang untuk terminator. Saat mengisi array karakter satu per satu, penutup jadi tugas manualmu: elemen terakhir wajib kamu isi `\\0` sendiri, karena tidak ada yang melakukannya untukmu.\n\nTerminator itu juga data yang dipakai semua fungsi string. `strlen` menghitung dengan mencari `\\0`, `strcpy` menyalin sampai `\\0`, `strtok` memotong dengan menanam `\\0` di tempat pemisah. Seluruh `string.h` berpijak pada satu konvensi yang sama, jadi memahami satu byte nol ini berarti memahami separuh bab string C.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    char otomatis[] = \"bajuu\";   // 6 byte: 5 huruf + '\\0'\n    char manual[6];\n    manual[0] = 'b';\n    manual[1] = 'a';\n    manual[2] = 'j';\n    manual[3] = 'u';\n    manual[4] = 'u';\n    manual[5] = '\\0';            // penutup wajib\n    printf(\"%s %s\\n\", otomatis, manual);\n    return 0;\n}",
            caption: "Isinya sama, jalur pembentukannya beda; keduanya butuh '\\0' di ujung.",
          },
        },
        {
          kind: "quiz",
          question: "Berapa ukuran array terkecil yang cukup untuk menyimpan teks `halo` sebagai string C yang sah?",
          options: ["4 byte", "5 byte", "6 byte", "8 byte"],
          answer: 1,
          explanation: "Empat huruf plus satu '\\0' berarti minimal 5 byte. Array 4 byte hanya cukup untuk menyimpan hurufnya tanpa penutup.",
        },
        {
          kind: "code",
          title: "Susun kata dari karakter",
          prompt: "Lengkapi dua kekosongan: karakter penutup string, dan variabel yang dicetak. Program membaca tiga karakter lalu menyusunnya menjadi satu string. Input: tiga karakter dipisah spasi.",
          mode: "fill",
          template: `#include <stdio.h>

int main(void) {
    char kata[4];
    scanf(" %c %c %c", &kata[0], &kata[1], &kata[2]);
    kata[3] = ___;
    printf("%s\\n", ___);
    return 0;
}`,
          solution: `#include <stdio.h>

int main(void) {
    char kata[4];
    scanf(" %c %c %c", &kata[0], &kata[1], &kata[2]);
    kata[3] = '\\0';
    printf("%s\\n", kata);
    return 0;
}`,
          tests: [
            { stdin: "a b c", expectedOutput: "abc" },
            { stdin: "k o d", expectedOutput: "kod" },
            { stdin: "z z z", expectedOutput: "zzz", hidden: true },
          ],
          hints: [
            "Tanpa penutup, %s tidak tahu di mana string berakhir. Penutupnya karakter nol, bukan spasi.",
            "Yang dicetak printf adalah nama arraynya, tanpa tanda kurung siku.",
            "Jawabannya: '\\0' dan kata.",
          ],
        },
      ],
    },
    {
      slug: "sbuf-strlen-vs-sizeof",
      title: "strlen vs sizeof",
      summary: "Dua angka yang sering tertukar: panjang isi string saat jalan versus ukuran array saat kompilasi.",
      steps: [
        {
          kind: "theory",
          title: "Isi versus kapasitas",
          body: "`strlen(s)` menghitung berapa karakter sebelum `\\0`. Ia bekerja saat program jalan, menyusuri memori byte demi byte mencari terminator. `sizeof(s)` adalah pertanyaan ke compiler: berapa byte total alokasi variabel ini? Jawabannya ditetapkan saat kompilasi dan tidak peduli isinya apa.\n\nUntuk `char s[20] = \"kode\";`, nilai `strlen(s)` adalah 4 (empat huruf) dan `sizeof(s)` adalah 20 (kapasitas array, termasuk byte yang tidak terpakai plus terminator). Keduanya benar, menjawab pertanyaan yang berbeda. Memakai `sizeof` untuk menanyakan panjang string adalah bug klasik: hasilnya kapasitas, bukan isi.\n\nHati-hati juga saat string dipegang pointer: `char *p = \"kode\";` membuat `sizeof(p)` bukan panjang dan bukan kapasitas, melainkan ukuran pointernya, 8 byte di sistem 64-bit. Untuk menanyakan panjang teks yang sedang disimpan, `strlen` adalah satu-satunya yang benar.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char s[20] = \"kode\";\n    char *p = \"kode\";\n    printf(\"strlen(s) = %zu\\n\", strlen(s));  // 4: isi sampai '\\0'\n    printf(\"sizeof(s) = %zu\\n\", sizeof(s));  // 20: kapasitas array\n    printf(\"sizeof(p) = %zu\\n\", sizeof(p));  // ukuran pointer\n    printf(\"strlen(p) = %zu\\n\", strlen(p));  // 4: isi yang ditunjuk\n    return 0;\n}",
            caption: "strlen menjawab isi, sizeof menjawab deklarasi.",
          },
        },
        {
          kind: "quiz",
          question: "Apa keluaran `printf(\"%zu %zu\", strlen(\"kopi\"), sizeof(\"kopi\"));`?",
          options: ["4 5", "5 5", "4 4", "5 4"],
          answer: 0,
          explanation: "strlen kopi menghitung 4 huruf. sizeof pada literal kopi mengukur array-nya: 4 huruf plus '\\0', jadi 5 byte.",
        },
        {
          kind: "quiz",
          question: "Untuk `char nama[30] = \"Budi\";`, berapa nilai `strlen(nama)` dan `sizeof(nama)`?",
          options: ["4 dan 30", "30 dan 4", "4 dan 5", "5 dan 30"],
          answer: 0,
          explanation: "Isinya 4 huruf, jadi strlen 4. Arraynya dideklarasikan 30 byte, jadi sizeof 30, apa pun isinya.",
        },
      ],
    },
    {
      slug: "sbuf-strcpy-aman",
      title: "Menyalin String dengan Aman",
      summary: "Kenapa strcpy berbahaya, dan cara menyalin terbatas dengan snprintf atau strncpy.",
      steps: [
        {
          kind: "theory",
          title: "Penyalin tanpa rem",
          body: "`strcpy(tujuan, sumber)` menyalin sampai ketemu `\\0` di sumber, tanpa pernah bertanya seberapa besar tujuannya. Kalau sumber lebih panjang dari buffer tujuan, ia menulis melebihi batas: buffer overflow. Program bisa crash, bisa diam-diam merusak variabel tetangga, dan di dunia nyata ini pintu masuk celah keamanan klasik.\n\nAlternatif aman yang paling mudah diingat: `snprintf(tujuan, ukuran, \"%s\", sumber)`. Ia menulis paling banyak `ukuran - 1` karakter plus terminator, jadi tidak pernah meluber. Kalau sumbernya terpotong, `snprintf` mengembalikan panjang yang sebenarnya mau ia tulis, sehingga pemotongan bisa dideteksi dengan satu perbandingan.\n\n`strncpy(tujuan, sumber, n)` juga membatasi n karakter, tetapi punya jebakan sendiri: kalau sumber mencapai n karakter sebelum `\\0`, terminator tidak ikut disalin, dan tujuan jadi string tanpa penutup. Kamu harus menanam `\\0` sendiri setelahnya. Karena itu banyak gaya kode C modern memilih `snprintf` untuk penyalinan sederhana.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char sumber[32];\n    char tujuan[8];\n    scanf(\"%31s\", sumber);\n    int butuh = snprintf(tujuan, sizeof(tujuan), \"%s\", sumber);\n    if (butuh >= (int)sizeof(tujuan)) {\n        printf(\"terpotong: %s\\n\", tujuan);\n    } else {\n        printf(\"utuh: %s\\n\", tujuan);\n    }\n    return 0;\n}",
            caption: "snprintf tidak pernah meluber; nilai baliknya memberi tahu bila terpotong.",
          },
        },
        {
          kind: "code",
          title: "Ganti penyalin tanpa rem",
          prompt: "Program ini jalan untuk kata pendek, tetapi baris penyalinnya tidak punya batas: untuk kata panjang ia menulis melebihi `target` yang hanya berkapasitas 16. Perbaiki satu kesalahannya supaya penyalinan dijaga ukuran target. Input: satu kata (maksimal 31 karakter). Keluaran: salinan yang selalu berhenti pada kapasitas target.",
          mode: "fix",
          template: `#include <stdio.h>
#include <string.h>

int main(void) {
    char sumber[32];
    char target[16];
    scanf("%31s", sumber);
    strcpy(target, sumber);
    printf("%s\\n", target);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <string.h>

int main(void) {
    char sumber[32];
    char target[16];
    scanf("%31s", sumber);
    snprintf(target, sizeof(target), "%s", sumber);
    printf("%s\\n", target);
    return 0;
}`,
          tests: [
            { stdin: "implementasiberjalan", expectedOutput: "implementasiber" },
            { stdin: "kode", expectedOutput: "kode" },
            { stdin: "bahasaindonesia", expectedOutput: "bahasaindonesia", hidden: true },
          ],
          hints: [
            "strcpy tidak menerima ukuran, jadi ia tidak bisa dijadikan aman dengan mengubah angka. Barisnya harus diganti.",
            "Fungsi yang menerima ukuran target dan selalu menutup string dengan '\\0' adalah snprintf.",
            "Ganti barisnya menjadi: snprintf(target, sizeof(target), \"%s\", sumber);",
          ],
        },
        {
          kind: "quiz",
          question: "Apa jebakan `strncpy(tujuan, sumber, n)` dibanding `snprintf`?",
          options: [
            "strncpy lebih lambat dari strcpy",
            "Kalau sumber sepanjang n karakter atau lebih, strncpy tidak menaruh '\\0' di tujuan",
            "strncpy bisa menulis melebihi n karakter",
            "strncpy tidak bisa menyalin huruf kecil",
          ],
          answer: 1,
          explanation: "Saat batas n tercapai sebelum terminator sumber, strncpy berhenti tanpa menulis '\\0'. Tujuan harus ditutup manual, atau ganti snprintf yang selalu menutup.",
        },
      ],
    },
    {
      slug: "sbuf-strcat-strncat",
      title: "strcat dan strncat: Menyambung String",
      summary: "Hitung ruang sebelum menyambung, dan kenali perbedaan penting strncat dari strncpy.",
      steps: [
        {
          kind: "theory",
          title: "Menempel di atas terminator",
          body: "`strcat(tujuan, sumber)` menempelkan sumber di akhir tujuan, tepat menggantikan `\\0` milik tujuan, lalu menutup dengan `\\0` baru. Ia tidak mengecek ruang: kalau tujuan tidak cukup besar menampung isi lama plus isi baru plus terminator, hasilnya overflow. Aturan hitungannya: `sizeof(tujuan)` minimal `strlen(tujuan) + strlen(sumber) + 1`.\n\n`strncat(tujuan, sumber, n)` menempel paling banyak n karakter dari sumber, lalu selalu menambah `\\0`. Ini poin yang sering tertukar dengan `strncpy`: strncpy bisa menyisakan string tanpa terminator, strncat tidak. Syaratnya tetap ada: tujuan harus muat `strlen(tujuan) + n + 1`, dan pilih n dari sisa ruang, bukan dari ukuran sumber.\n\nPola aman yang umum: hitung sisa ruang dulu, `size_t sisa = sizeof(tujuan) - strlen(tujuan) - 1;`, lalu `strncat(tujuan, sumber, sisa)`. Kalau sumber lebih panjang dari sisa, ia terpotong dengan aman dan string tetap sah.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char kalimat[16] = \"halo\";\n    size_t sisa = sizeof(kalimat) - strlen(kalimat) - 1;\n    strncat(kalimat, \" dunia\", sisa);\n    printf(\"%s\\n\", kalimat);\n    printf(\"panjang: %zu\\n\", strlen(kalimat));\n    return 0;\n}",
            caption: "Sisa ruang dihitung dulu; strncat yang menutup terminator.",
          },
        },
        {
          kind: "quiz",
          question: "Buffer `char s[10];` sudah berisi `\"kopi\"`. Berapa karakter terpanjang yang boleh disambungkan dengan aman ke belakangnya?",
          options: ["4", "5", "6", "9"],
          answer: 1,
          explanation: "Total 10 byte, terpakai 4 huruf, dan 1 byte wajib untuk '\\0'. Sisanya 10 - 4 - 1 = 5 karakter untuk tambahan.",
        },
        {
          kind: "quiz",
          question: "Pernyataan mana yang benar tentang `strncat`?",
          options: [
            "Ia bisa menghasilkan string tanpa '\\0'",
            "Ia selalu menutup hasilnya dengan '\\0'",
            "Ia menimpa isi awal tujuan",
            "Ia mengembalikan panjang hasil gabungan",
          ],
          answer: 1,
          explanation: "strncat selalu menambah terminator setelah menempel, beda dari strncpy yang bisa berhenti tanpa '\\0'. Ia menempel di akhir, bukan menimpa awal, dan mengembalikan pointer tujuan.",
        },
      ],
    },
    {
      slug: "sbuf-strcmp",
      title: "strcmp: Membandingkan String",
      summary: "Bandingkan isi string lewat strcmp, bukan ==, dan baca tiga kemungkinan hasilnya.",
      steps: [
        {
          kind: "theory",
          title: "Alamat bukan isi",
          body: "Membandingkan string dengan `==` membandingkan alamat, bukan isinya. Untuk `char a[16] = \"kopi\";` dan `char b[16] = \"kopi\";`, ekspresi `a == b` bernilai salah karena dua array itu berdiri di alamat berbeda. Yang benar adalah `strcmp(a, b)`: ia menyusuri kedua string byte demi byte dan berhenti di perbedaan pertama atau di terminator.\n\nNilai balik `strcmp` bukan hanya 0 dan 1. Nol berarti isinya identik. Negatif berarti string pertama lebih kecil secara urutan byte, artinya muncul lebih dulu seperti urutan kamus. Positif berarti kebalikannya. Karena itu pola pemakaiannya tiga arah: `== 0` untuk kesetaraan, `< 0` dan `> 0` untuk pengurutan.\n\nSatu peringatan tentang urutannya: bandingan mengikuti nilai byte ASCII, jadi `\"Zebra\"` datang sebelum `\"apel\"` karena huruf besar bernilai lebih kecil dari huruf kecil. Untuk teks pengguna sungguhan, sadari dulu asumsi ini sebelum mengurutkan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char a[16] = \"kopi\";\n    char b[16] = \"gula\";\n    int hasil = strcmp(a, b);\n    if (hasil == 0) {\n        printf(\"isinya sama\\n\");\n    } else if (hasil < 0) {\n        printf(\"%s di depan %s\\n\", a, b);\n    } else {\n        printf(\"%s di depan %s\\n\", b, a);\n    }\n    return 0;\n}",
            caption: "Yang dipakai tandanya, bukan angka pastinya.",
          },
        },
        {
          kind: "code",
          title: "Pembanding dua kata",
          prompt: "Lengkapi dua kekosongan: fungsi pembanding isi string, dan operator untuk menguji kesetaraan. Input: dua kata dipisah spasi. Keluaran: `sama` bila identik, atau kata mana yang datang lebih dulu menurut strcmp.",
          mode: "fill",
          template: `#include <stdio.h>
#include <string.h>

int main(void) {
    char a[32], b[32];
    scanf("%31s %31s", a, b);
    int hasil = ___(a, b);
    if (hasil ___ 0) {
        printf("sama\\n");
    } else if (hasil < 0) {
        printf("%s sebelum %s\\n", a, b);
    } else {
        printf("%s sebelum %s\\n", b, a);
    }
    return 0;
}`,
          solution: `#include <stdio.h>
#include <string.h>

int main(void) {
    char a[32], b[32];
    scanf("%31s %31s", a, b);
    int hasil = strcmp(a, b);
    if (hasil == 0) {
        printf("sama\\n");
    } else if (hasil < 0) {
        printf("%s sebelum %s\\n", a, b);
    } else {
        printf("%s sebelum %s\\n", b, a);
    }
    return 0;
}`,
          tests: [
            { stdin: "kode kode", expectedOutput: "sama" },
            { stdin: "apel babi", expectedOutput: "apel sebelum babi" },
            { stdin: "babi apel", expectedOutput: "apel sebelum babi", hidden: true },
          ],
          hints: [
            "Fungsi pembanding string ada di string.h dan menerima dua string.",
            "Isinya identik ditandai nilai balik nol, dan penguji kesetaraannya operator ==, bukan =.",
            "Jawabannya: strcmp dan ==.",
          ],
        },
      ],
    },
    {
      slug: "sbuf-strchr-strstr",
      title: "Mencari di String: strchr dan strstr",
      summary: "Temukan karakter dan potongan teks, lalu ubah pointer hasilnya menjadi posisi.",
      steps: [
        {
          kind: "theory",
          title: "Hasil pencarian berupa alamat",
          body: "`strchr(s, c)` mengembalikan pointer ke kemunculan pertama karakter c di s, atau NULL kalau tidak ketemu. `strstr(s, cari)` berlaku sama untuk potongan teks. Keduanya mengembalikan alamat, bukan angka: hasilnya langsung bisa dipakai, misalnya `printf(\"%s\", p)` untuk mencetak mulai dari titik temuan sampai akhir string.\n\nUntuk mengubah temuan jadi posisi (index), pakai aritmetika pointer: `char *p = strchr(s, 'a');` lalu kalau p tidak NULL, `int posisi = p - s;`. Selisih dua pointer yang menunjuk array yang sama adalah banyak elemen di antaranya, dan inilah cara C menghitung index kemunculan.\n\nDua catatan kecil: `strchr` juga bisa mencari `\\0` dan pasti menemukannya di ujung string, karena terminator memang bagian dari string. Dan selalu cek NULL sebelum mengurangkan atau men-dereference hasil pencarian; lupa cek adalah jebakan null dereference yang paling sering muncul di kode pemula.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char teks[] = \"belajar string di c\";\n    char *p = strchr(teks, 's');\n    if (p != NULL) {\n        printf(\"ketemu di posisi %d\\n\", (int)(p - teks));\n        printf(\"sisanya: %s\\n\", p);\n    } else {\n        printf(\"tidak ketemu\\n\");\n    }\n\n    char *q = strstr(teks, \"ring\");\n    if (q != NULL) {\n        printf(\"potongan mulai: %s\\n\", q);\n    }\n    return 0;\n}",
            caption: "Hasil pencarian adalah alamat; kurangi alamat awal untuk mendapat posisi.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk `char teks[] = \"banjir\";`, bagaimana cara benar mendapatkan posisi kemunculan pertama huruf `a`?",
          options: [
            "strchr(teks, 'a') langsung memberi angka posisi",
            "strchr(teks, 'a') dikurangi teks",
            "strlen(teks) dikurangi panjang teks",
            "Posisi tidak bisa didapat di C",
          ],
          answer: 1,
          explanation: "strchr mengembalikan pointer. Selisih pointer hasil dengan alamat awal, p - teks, menghasilkan index kemunculannya (di sini 1).",
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `strstr(s, \"xyz\")` kalau `xyz` tidak ada di dalam s?",
          options: ["Pointer ke awal s", "NULL", "Angka 0 bertipe int", "String kosong"],
          answer: 1,
          explanation: "Kalau tidak ketemu, strstr mengembalikan NULL. Karena itu hasilnya selalu dicek sebelum dipakai.",
        },
      ],
    },
    {
      slug: "sbuf-snprintf-format",
      title: "snprintf: Merakit Teks dengan Aman",
      summary: "Susun string berformat ke dalam buffer terbatas, dan baca nilai baliknya untuk mendeteksi pemotongan.",
      steps: [
        {
          kind: "theory",
          title: "printf yang menulis ke buffer",
          body: "Banyak program perlu merakit teks: menyambung nama, angka, dan tanda baca jadi satu pesan. `snprintf(pesan, ukuran, format, ...)` adalah alatnya: bekerja seperti printf tetapi hasilnya ditulis ke pesan, paling banyak `ukuran - 1` karakter plus `\\0`. Ia tidak pernah meluber, apa pun panjang hasil formatnya.\n\nNilai baliknya informatif: jumlah karakter yang sebenarnya mau ia tulis, tanpa terminator. Kalau nilai itu lebih besar atau sama dengan ukuran buffer, hasilnya terpotong, dan kamu tahu dari satu perbandingan. Kalau muat, nilai baliknya persis `strlen(pesan)`.\n\nBuffer pesan sebaiknya longgar untuk data terburuk yang mungkin masuk, dan ukurannya selalu dikirim dengan `sizeof(pesan)` supaya perubahan deklarasi otomatis ikut. Kombinasi ini menghapus hampir semua alasan memakai `sprintf`, versi tanpa rem yang sebaiknya tidak pernah kamu pakai.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    char pesan[16];\n    int butuh = snprintf(pesan, sizeof(pesan), \"nilai: %d\", 123456789);\n    printf(\"%s\\n\", pesan);\n    if (butuh >= (int)sizeof(pesan)) {\n        printf(\"terpotong, butuh %d karakter\\n\", butuh);\n    }\n    return 0;\n}",
            caption: "Hasilnya selalu string sah; nilai balik mengungkap pemotongan.",
          },
        },
        {
          kind: "code",
          title: "Kartu nilai otomatis",
          prompt: "Lengkapi dua kekosongan: fungsi perakit teks yang aman, dan variabel yang dicetak di baris kedua. Input: satu kata nama dan satu bilangan nilai. Keluaran: pesan yang dirakit, lalu panjangnya.",
          mode: "fill",
          template: `#include <stdio.h>

int main(void) {
    char nama[32];
    int nilai;
    scanf("%31s %d", nama, &nilai);

    char pesan[64];
    int panjang = ___(pesan, sizeof(pesan), "Nama: %s, Nilai: %d", nama, nilai);
    printf("%s\\n", pesan);
    printf("panjang: %d\\n", ___);
    return 0;
}`,
          solution: `#include <stdio.h>

int main(void) {
    char nama[32];
    int nilai;
    scanf("%31s %d", nama, &nilai);

    char pesan[64];
    int panjang = snprintf(pesan, sizeof(pesan), "Nama: %s, Nilai: %d", nama, nilai);
    printf("%s\\n", pesan);
    printf("panjang: %d\\n", panjang);
    return 0;
}`,
          tests: [
            { stdin: "Budi 90", expectedOutput: "Nama: Budi, Nilai: 90\npanjang: 21" },
            { stdin: "Boim 8", expectedOutput: "Nama: Boim, Nilai: 8\npanjang: 20" },
            { stdin: "Dinda 95", expectedOutput: "Nama: Dinda, Nilai: 95\npanjang: 22", hidden: true },
          ],
          hints: [
            "Fungsi perakitnya bekerja seperti printf tetapi menerima buffer dan ukurannya di depan.",
            "Baris kedua mencetak jumlah karakter yang dikembalikan pemanggilan itu.",
            "Jawabannya: snprintf dan panjang.",
          ],
        },
      ],
    },
    {
      slug: "sbuf-buffer-overflow",
      title: "Buffer Overflow: Tulisan yang Meluber",
      summary: "Apa yang terjadi saat program menulis melebihi batas buffer, dan kebiasaan yang menahannya.",
      steps: [
        {
          kind: "theory",
          title: "Byte kelebihan tidak menghilang",
          body: "Buffer overflow terjadi saat program menulis melampaui ujung array: kata 30 karakter masuk ke buffer 16, `strcpy` tanpa batas, atau `scanf(\"%s\")` tanpa lebar. Byte kelebihannya tidak menghilang; ia menimpa memori tetangga, bisa variabel lain, bisa data internal program. Gejalanya bervariasi: nilai aneh muncul entah dari mana, program crash di tempat yang tidak berkaitan, atau yang paling buruk, tidak ada gejala sampai input tertentu datang.\n\nC tidak menahanmu: akses array tidak dibatasi saat runtime, dan compiler umumnya tetap mengompilasi kode yang rawan. Pertahanannya ada di kebiasaan menulis. Tiga yang paling menolong: selalu kirim ukuran ke fungsi string (`snprintf`, `fgets`, lebar `%31s` pada scanf), jangan pernah memakai `gets` yang tidak punya parameter batas sama sekali sampai dihapus dari standar C, dan perlakukan setiap input eksternal sebagai lebih panjang dari yang kamu duga.\n\nPerhatikan perbedaan satu angka ini: `scanf(\"%s\", buf)` sama berbahayanya dengan `gets`, sedangkan `scanf(\"%31s\", buf)` untuk `buf[32]` adalah bentuk amannya. Angka kecil itu yang memisahkan kode sehat dari kelas bug paling tua di sejarah C.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\nint main(void) {\n    char singkat[8];\n    char panjang[64];\n    scanf(\"%63s\", panjang);                             // batas: 63 karakter + '\\0'\n    snprintf(singkat, sizeof(singkat), \"%s\", panjang);  // dibatasi kapasitas\n    printf(\"%s\\n\", singkat);                            // paling banyak 7 karakter\n    return 0;\n}",
            caption: "Sisi penerima yang menahan diri: kapasitas dihormati apa pun inputnya.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa fungsi `gets` dihapus dari standar C?",
          options: [
            "Karena terlalu lambat dibanding scanf",
            "Karena tidak bisa membaca karakter spasi",
            "Karena tidak punya parameter batas, sehingga tidak mungkin dipakai dengan aman",
            "Karena nilai baliknya sulit dipakai",
          ],
          answer: 2,
          explanation: "gets tidak menerima ukuran buffer, jadi tidak ada cara membatasi tulisannya. Ia dihapus di standar C11 dan digantikan fgets yang menerima ukuran.",
        },
        {
          kind: "quiz",
          question: "Untuk `char buf[32];`, pemanggilan scanf yang aman untuk membaca satu kata adalah?",
          options: ['scanf("%s", buf);', 'scanf("%32s", buf);', 'scanf("%31s", buf);', "scanf(buf);"],
          answer: 2,
          explanation: "%31s membatasi 31 karakter plus satu byte untuk '\\0', pas dalam 32 byte. %32s bisa memakai seluruh 32 byte untuk huruf dan menulis terminator di luar buffer.",
        },
      ],
    },
    {
      slug: "sbuf-strtok",
      title: "Memecah String dengan strtok",
      summary: "Potong baris input menjadi token, dan pahami bahwa strtok mengubah string aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Memotong dengan menanam nol",
          body: "`strtok(s, pemisah)` memotong string di tempat: panggilan pertama diberi alamat string, panggilan berikutnya diberi NULL untuk melanjutkan dari posisi terakhir. Setiap kali ketemu pemisah, ia menanam `\\0` di situ dan mengembalikan pointer ke awal token. Saat habis, ia mengembalikan NULL, jadi loopnya berbentuk `while (kata != NULL)`.\n\nDua akibat dari cara kerjanya. Pertama, string aslinya rusak: pemisah diganti terminator, jadi kalau teks aslinya masih dibutuhkan, salin dulu. Kedua, strtok menyimpan posisi di variabel internal tersembunyi, sehingga dua proses yang bergantian memotong string berbeda akan saling merusak; untuk itu ada versi `strtok_r` yang posisinya dibawa pemanggil.\n\nPemisah ditulis sebagai kumpulan karakter, bukan kata: `strtok(baris, \" \")` memotong di spasi. Karakter pemisah beruntun diperlakukan sebagai satu, jadi `\"a  b\"` dengan dua spasi tetap menghasilkan dua token, bukan token kosong di antaranya.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char data[] = \"ano,budi,cika\";\n    char *nama = strtok(data, \",\");\n    while (nama != NULL) {\n        printf(\"%s\\n\", nama);\n        nama = strtok(NULL, \",\");\n    }\n    printf(\"data asli kini: %s\\n\", data);\n    return 0;\n}",
            caption: "Token dipotong dengan menanam '\\0'; string asli tidak utuh lagi.",
          },
        },
        {
          kind: "code",
          title: "Penghitung kata satu baris",
          prompt: "Lengkapi dua kekosongan: panggilan tokenisasi pertama, dan cara melanjutkan tokenisasi di dalam loop. Input: satu baris kata-kata dipisah spasi. Keluaran: tiap kata satu baris, lalu `jumlah: <banyak kata>`.",
          mode: "fill",
          template: `#include <stdio.h>
#include <string.h>

int main(void) {
    char baris[128];
    if (fgets(baris, sizeof(baris), stdin) == NULL) return 1;
    baris[strcspn(baris, "\\n")] = '\\0'; // buang newline sisa fgets

    int jumlah = 0;
    char *kata = ___(baris, " ");
    while (kata != NULL) {
        printf("%s\\n", kata);
        jumlah++;
        kata = strtok(___, " ");
    }
    printf("jumlah: %d\\n", jumlah);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <string.h>

int main(void) {
    char baris[128];
    if (fgets(baris, sizeof(baris), stdin) == NULL) return 1;
    baris[strcspn(baris, "\\n")] = '\\0'; // buang newline sisa fgets

    int jumlah = 0;
    char *kata = strtok(baris, " ");
    while (kata != NULL) {
        printf("%s\\n", kata);
        jumlah++;
        kata = strtok(NULL, " ");
    }
    printf("jumlah: %d\\n", jumlah);
    return 0;
}`,
          tests: [
            { stdin: "saya belajar bahasa c\n", expectedOutput: "saya\nbelajar\nbahasa\nc\njumlah: 4" },
            { stdin: "satu\n", expectedOutput: "satu\njumlah: 1" },
            { stdin: "a  b\n", expectedOutput: "a\nb\njumlah: 2", hidden: true },
          ],
          hints: [
            "Panggilan pertama menerima string yang mau dipotong; itu satu-satunya panggilan yang tidak diberi NULL.",
            "Panggilan lanjutan diberi NULL agar strtok melanjutkan dari posisi terakhirnya.",
            "Jawabannya: strtok dan NULL.",
          ],
        },
        {
          kind: "quiz",
          question: "Setelah loop `strtok` selesai, bagaimana keadaan string aslinya?",
          options: [
            "Utuh seperti semula",
            "Token pertama saja yang tersisa, pemisah setelahnya tertanam '\\0'",
            "Seluruh karakternya berubah menjadi nol",
            "strtok mengembalikan aslinya secara otomatis",
          ],
          answer: 1,
          explanation: "strtok bekerja di tempat dengan menanam '\\0' di tiap pemisah. Hasilnya hanya token pertama yang tersisa lewat nama array aslinya.",
        },
      ],
    },
    {
      slug: "sbuf-latihan-parser-kata",
      title: "Latihan: Parser Kata dari stdin",
      summary: "Rangkai fgets, strtok, strlen, dan snprintf untuk membaca baris dan menemukan kata terpanjang.",
      steps: [
        {
          kind: "theory",
          title: "Baca, bersihkan, potong, proses",
          body: "Penutup modul merangkai hampir semua kebiasaan aman yang sudah kamu pelajari: membaca baris utuh dengan `fgets` (bukan `scanf(\"%s\")` tanpa batas), membuang newline sisanya, menokenisasi dengan `strtok`, mengukur dengan `strlen`, dan menyalin pemenangnya dengan `snprintf` ke buffer tetap.\n\nPerhatikan aturan pemilihannya: pembanding memakai `>` dan bukan `>=`, sehingga kata berpanjang sama mempertahankan yang muncul lebih dulu. Buffer `terpanjang[64]` adalah asumsi data yang disengaja: kata dari baris 128 karakter paling panjang 127, dan kalau asumsi itu dilanggar, `snprintf` tetap menutup string dan program tidak meluber dalam keadaan apa pun.\n\nDari sini jalurmu melaju ke modul struct. Data nyata jarang sekali string tunggal, hampir selalu gabungan field, dan semua keterampilan buffer ini dipakai ulang di sana bersama struct dinamis dari modul memori.",
          code: {
            language: "c",
            content: "// alur parser satu baris yang rapi\nchar baris[128];\nif (fgets(baris, sizeof(baris), stdin) == NULL) return 1;\nbaris[strcspn(baris, \"\\n\")] = '\\0';\n\nchar *kata = strtok(baris, \" \");\nwhile (kata != NULL) {\n    /* proses kata: ukur, bandingkan, simpan */\n    kata = strtok(NULL, \" \");\n}",
            caption: "Pola baca, bersihkan, potong, proses.",
          },
        },
        {
          kind: "code",
          title: "Kata terpanjang",
          prompt: "Lengkapi dua kekosongan: fungsi pengukur panjang token, dan panggilan lanjutan tokenisasi. Input: satu baris kata dipisah spasi. Keluaran: `kata terpanjang: <kata>` (yang muncul lebih dulu bila panjangnya seri) dan `jumlah kata: <n>`.",
          mode: "fill",
          template: `#include <stdio.h>
#include <string.h>

int main(void) {
    char baris[128];
    if (fgets(baris, sizeof(baris), stdin) == NULL) return 1;
    baris[strcspn(baris, "\\n")] = '\\0';

    int jumlah = 0;
    size_t maks = 0;
    char terpanjang[64] = "";
    char *kata = strtok(baris, " ");
    while (kata != NULL) {
        if (___(kata) > maks) {
            maks = strlen(kata);
            snprintf(terpanjang, sizeof(terpanjang), "%s", kata);
        }
        jumlah++;
        kata = strtok(___, " ");
    }
    printf("kata terpanjang: %s\\n", terpanjang);
    printf("jumlah kata: %d\\n", jumlah);
    return 0;
}`,
          solution: `#include <stdio.h>
#include <string.h>

int main(void) {
    char baris[128];
    if (fgets(baris, sizeof(baris), stdin) == NULL) return 1;
    baris[strcspn(baris, "\\n")] = '\\0';

    int jumlah = 0;
    size_t maks = 0;
    char terpanjang[64] = "";
    char *kata = strtok(baris, " ");
    while (kata != NULL) {
        if (strlen(kata) > maks) {
            maks = strlen(kata);
            snprintf(terpanjang, sizeof(terpanjang), "%s", kata);
        }
        jumlah++;
        kata = strtok(NULL, " ");
    }
    printf("kata terpanjang: %s\\n", terpanjang);
    printf("jumlah kata: %d\\n", jumlah);
    return 0;
}`,
          tests: [
            { stdin: "saya sedang belajar string di c\n", expectedOutput: "kata terpanjang: belajar\njumlah kata: 6" },
            { stdin: "kode kita\n", expectedOutput: "kata terpanjang: kode\njumlah kata: 2" },
            { stdin: "ab abc abcd\n", expectedOutput: "kata terpanjang: abcd\njumlah kata: 3", hidden: true },
          ],
          hints: [
            "Panjang token diukur fungsi yang menghitung sampai '\\0'.",
            "Panggilan lanjutan strtok selalu menerima nilai khusus yang berarti lanjutkan, bukan alamat baru.",
            "Jawabannya: strlen dan NULL.",
          ],
        },
      ],
    },
  ],
};
