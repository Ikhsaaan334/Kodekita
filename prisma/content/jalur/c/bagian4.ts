import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "c",
  moduleRange: [6, 7],
  modules: [
    {
      title: "Struktur Data di C",
      description: "Dynamic array, linked list, stack/queue, dan hash table sederhana.",
    },
    {
      title: "Preprocessor dan Build",
      description: "Macro, include guard, kompilasi multi-file, dan Makefile sederhana.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: Struktur Data di C ====================
    {
      slug: "sd-dynamic-array",
      title: "Dynamic Array: Ukuran Logis dan Fisik",
      summary:
        "Kelola array yang tumbuh dengan realloc dan jaga dua ukurannya: jumlah terisi dan jumlah slot.",
      steps: [
        {
          kind: "theory",
          title: "Dua ukuran dalam satu struktur",
          body: "Array biasa beku sejak deklarasi: ukurannya ditulis di kode dan tidak bisa berubah. Dynamic array menyiasatinya dengan menyimpan pointer ke blok heap plus dua angka: ukuran logis (sering disebut size, jumlah elemen yang benar-benar terisi) dan ukuran fisik (capacity, jumlah slot yang sudah dialokasikan). Membedakan kedua ukuran ini adalah inti struktur; banyak bug array dinamis berawal dari menyamakan keduanya.\n\nSaat elemen baru datang dan size == capacity, blok diperbesar dengan realloc dan capacity digandakan (strategi double). Penggandaan membuat biaya total n kali insert menjadi amortized O(1): sebagian besar insert hanya menulis satu slot, dan sesekali ada insert yang mahal karena menyalin seluruh isi ke blok baru.\n\nrealloc boleh memindahkan blok ke alamat lain, dan hasil kembalinya satu-satunya pointer yang sah untuk dipakai. Di akhir, free cukup sekali dengan pointer dasar blok, bukan alamat elemen tengah. Pasangan discipline dari modul memori dinamis tetap berlaku: setiap blok yang dialokasikan punya satu free, dan ukuran yang tidak dijaga berarti lubang buffer overflow.",
          code: {
            language: "c",
            content:
              "int *data = NULL;\nint size = 0;      /* elemen terisi */\nint capacity = 0;  /* slot teralokasi */\n\n/* saat penuh, sebelum menulis elemen baru: */\ncapacity = (capacity == 0) ? 1 : capacity * 2;\ndata = realloc(data, capacity * sizeof(int));",
            caption: "Kapasitas dimulai dari nol lalu selalu digandakan saat penuh.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam dynamic array, apa beda ukuran logis dan ukuran fisik?",
          options: [
            "ukuran logis adalah jumlah slot teralokasi, fisik adalah jumlah elemen terisi",
            "ukuran logis adalah jumlah elemen terisi, fisik adalah jumlah slot yang dialokasikan",
            "keduanya selalu bernilai sama",
            "ukuran fisik dihitung otomatis oleh compiler",
          ],
          answer: 1,
          explanation:
            "Size menghitung elemen yang sah untuk dibaca; capacity menghitung slot yang sudah dibayar di heap. Size selalu kurang dari atau sama dengan capacity.",
        },
        {
          kind: "code",
          title: "Isi dynamic array dengan penggandaan kapasitas",
          prompt:
            "Program membaca n bilangan lalu menyimpannya di dynamic array yang tumbuh dua kali lipat saat penuh. Lengkapi penggandaan kapasitas, pemanggilan realokasi, dan posisi penulisan elemen. Ganti ketiga `___`, lalu perhatikan angka kapasitas akhirnya.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int *data = NULL;\n    int size = 0;\n    int capacity = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        if (size == capacity) {\n            capacity = (capacity == 0) ? 1 : ___;\n            data = ___(data, capacity * sizeof(int));\n        }\n        data[___] = x;\n        size++;\n    }\n    for (int i = 0; i < size; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    printf(\"size %d kapasitas %d\\n\", size, capacity);\n    free(data);\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int *data = NULL;\n    int size = 0;\n    int capacity = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        if (size == capacity) {\n            capacity = (capacity == 0) ? 1 : capacity * 2;\n            data = realloc(data, capacity * sizeof(int));\n        }\n        data[size] = x;\n        size++;\n    }\n    for (int i = 0; i < size; i++) {\n        if (i > 0) {\n            printf(\" \");\n        }\n        printf(\"%d\", data[i]);\n    }\n    printf(\"\\n\");\n    printf(\"size %d kapasitas %d\\n\", size, capacity);\n    free(data);\n    return 0;\n}",
          tests: [
            { stdin: "5\n1 2 3 4 5", expectedOutput: "1 2 3 4 5\nsize 5 kapasitas 8" },
            { stdin: "3\n7 8 9", expectedOutput: "7 8 9\nsize 3 kapasitas 4" },
            {
              stdin: "8\n4 4 4 4 4 4 4 4",
              expectedOutput: "4 4 4 4 4 4 4 4\nsize 8 kapasitas 8",
              hidden: true,
            },
          ],
          hints: [
            "Kapasitas pertama ketika masih nol adalah satu slot; setelah itu selalu digandakan.",
            "Fungsi stdlib yang mengalokasi ulang blok lama ke ukuran baru menerima pointer lama dan ukuran byte.",
            "Blank pertama capacity * 2, blank kedua realloc, blank ketiga size.",
          ],
        },
      ],
    },
    {
      slug: "sd-stack-array",
      title: "Stack via Array: Push dan Pop",
      summary: "Bangun tumpukan LIFO di atas array: dua operasi O(1) yang dijaga satu indeks top.",
      steps: [
        {
          kind: "theory",
          title: "Tumpukan piring di atas array",
          body: "Stack bekerja seperti tumpukan piring: yang terakhir ditaruh diambil lebih dulu (LIFO). Operasinya hanya dua: push menaruh nilai di puncak, pop mengambil nilai dari puncak, dan keduanya menyentuh satu ujung saja sehingga O(1). Di C, sebuah array plus satu integer top sudah cukup; top menunjuk elemen teratas, dan nilainya -1 saat tumpukan kosong.\n\nUrutan langkahnya penting. Push yang benar: periksa penuh (top == MAKS - 1), naikkan top, tulis stack[top]. Pop yang benar: periksa kosong, baca stack[top], turunkan top, kembalikan nilai. Menulis sebelum menaikkan atau membaca setelah menurunkan akan menggeser seluruh isi tumpukan satu posisi.\n\nKelebihannya sederhana dan bebas malloc. Kelemahannya kapasitas beku sejak deklarasi, dan dua kesalahan klasik harus dijaga sendiri: underflow (pop saat kosong) dan overflow (push saat penuh). C tidak menolak keduanya; yang ada hanya pembacaan memori yang salah atau ditimpa.",
          code: {
            language: "c",
            content:
              "#define MAKS 4\n\nint stack[MAKS];\nint top = -1;\n\nvoid push(int x) {\n    if (top == MAKS - 1) {\n        printf(\"penuh\\n\");\n        return;\n    }\n    stack[++top] = x;\n}",
            caption: "top bernilai -1 saat kosong; ++top menaikkan dulu, menulis kemudian.",
          },
        },
        {
          kind: "quiz",
          question: "Nilai awal top untuk stack berbasis array yang masih kosong adalah...",
          options: ["0", "-1", "1", "MAKS"],
          answer: 1,
          explanation:
            "Indeks array mulai dari 0, jadi kondisi belum ada elemen ditandai top = -1. Nilai 0 justru berarti satu elemen sudah ada.",
        },
        {
          kind: "code",
          title: "Tumpukan yang membalik urutan",
          prompt:
            "Program membaca n bilangan, mendorong semuanya ke stack, lalu memunculkan sampai kosong. Lengkapi penulisan elemen saat push, penanda stack kosong, dan kondisi loop pembuangan. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n\n#define MAKS 100\n\nint stack[MAKS];\nint top = -1;\n\nvoid push(int x) {\n    if (top == MAKS - 1) {\n        return;\n    }\n    top++;\n    stack[___] = x;\n}\n\nint pop(void) {\n    if (top == ___) {\n        return -1;\n    }\n    int x = stack[top];\n    top--;\n    return x;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        push(x);\n    }\n    while (___) {\n        printf(\"%d\\n\", pop());\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n#define MAKS 100\n\nint stack[MAKS];\nint top = -1;\n\nvoid push(int x) {\n    if (top == MAKS - 1) {\n        return;\n    }\n    top++;\n    stack[top] = x;\n}\n\nint pop(void) {\n    if (top == -1) {\n        return -1;\n    }\n    int x = stack[top];\n    top--;\n    return x;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        push(x);\n    }\n    while (top != -1) {\n        printf(\"%d\\n\", pop());\n    }\n    return 0;\n}",
          tests: [
            { stdin: "3\n10 20 30", expectedOutput: "30\n20\n10" },
            { stdin: "1\n99", expectedOutput: "99" },
            { stdin: "5\n1 2 3 4 5", expectedOutput: "5\n4\n3\n2\n1", hidden: true },
          ],
          hints: [
            "Setelah top dinaikkan, elemen baru ditulis tepat di posisi yang baru saja dinaikkan itu.",
            "Stack kosong ditandai top kembali ke nilai awalnya.",
            "Blank pertama top, blank kedua -1, blank ketiga top != -1.",
          ],
        },
      ],
    },
    {
      slug: "sd-stack-linked-list",
      title: "Stack via Linked List",
      summary:
        "Ganti array dengan simpul bertaut: push dan pop tetap O(1) tanpa batas kapasitas.",
      steps: [
        {
          kind: "theory",
          title: "Puncak tumpukan adalah head",
          body: "Stack juga bisa berdiri di atas linked list, dan pasangan ini sangat alami. Simpul teratas adalah head: push menyisipkan simpul baru di depan head, pop melepas head. Tidak ada MAKS dan tidak ada cek penuh; kapasitasnya mengikuti memori yang masih tersedia.\n\nPush terdiri dari tiga langkah: malloc simpul, isi nilai, sambungkan baru->berikut = top, lalu top = baru. Pop: pegang dulu simpul teratas, majukan top ke berikutnya, baca nilainya, lalu free simpul lama. Karena kedua operasi hanya menyentuh head, tidak ada penyusuran sama sekali; itulah kenapa linked list dipakai sebagai stack jauh lebih sering daripada sebagai antrean.\n\nDisiplin modul memori dinamis kini bekerja di posisi depan: setiap malloc punya pasangan free, dan urutan sambung dulu baru pindahkan top tidak boleh dibalik. Memindahkan top sebelum simpul baru menyambung membuat sisa tumpukan kehilangan satu mata rantai.",
          code: {
            language: "c",
            content:
              "typedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *top = NULL;\n\nvoid push(int x) {\n    Node *baru = malloc(sizeof(Node));\n    baru->nilai = x;\n    baru->berikut = top;\n    top = baru;\n}",
            caption: "Simpul baru selalu jadi head; sisa tumpukan menggantung di belakangnya.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa push dan pop stack linked list dilakukan di head, bukan di ekor?",
          options: [
            "karena head selalu berada di alamat memori terendah",
            "karena di head keduanya tetap O(1), sedangkan pop di ekor harus menyusuri seluruh list",
            "karena simpul ekor tidak bisa di-free",
            "karena malloc hanya bisa dipanggil untuk head",
          ],
          answer: 1,
          explanation:
            "Singly linked list hanya bisa disusuri maju dari head. Pop harus menghapus simpul, dan hanya di head penghapusan bisa O(1) tanpa perlu menyimpan pointer tambahan.",
        },
        {
          kind: "code",
          title: "Stack linked list dengan perintah",
          prompt:
            "Program membaca perintah baris demi baris: `push x` mendorong nilai, `pop` memunculkan sambil mencetak. Lengkapi sambungan simpul baru ke top, pembacaan nilai simpul yang dilepas, dan perpindahan top. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *top = NULL;\n\nvoid push(int x) {\n    Node *baru = malloc(sizeof(Node));\n    baru->nilai = x;\n    baru->berikut = ___;\n    top = baru;\n}\n\nvoid pop(void) {\n    if (top == NULL) {\n        printf(\"KOSONG\\n\");\n        return;\n    }\n    Node *dilepas = top;\n    printf(\"POP %d\\n\", ___->nilai);\n    ___ = dilepas->berikut;\n    free(dilepas);\n}\n\nint main(void) {\n    char perintah[8];\n    while (scanf(\"%7s\", perintah) == 1) {\n        if (strcmp(perintah, \"push\") == 0) {\n            int x;\n            scanf(\"%d\", &x);\n            push(x);\n        } else if (strcmp(perintah, \"pop\") == 0) {\n            pop();\n        }\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *top = NULL;\n\nvoid push(int x) {\n    Node *baru = malloc(sizeof(Node));\n    baru->nilai = x;\n    baru->berikut = top;\n    top = baru;\n}\n\nvoid pop(void) {\n    if (top == NULL) {\n        printf(\"KOSONG\\n\");\n        return;\n    }\n    Node *dilepas = top;\n    printf(\"POP %d\\n\", dilepas->nilai);\n    top = dilepas->berikut;\n    free(dilepas);\n}\n\nint main(void) {\n    char perintah[8];\n    while (scanf(\"%7s\", perintah) == 1) {\n        if (strcmp(perintah, \"push\") == 0) {\n            int x;\n            scanf(\"%d\", &x);\n            push(x);\n        } else if (strcmp(perintah, \"pop\") == 0) {\n            pop();\n        }\n    }\n    return 0;\n}",
          tests: [
            { stdin: "push 5\npush 8\npop\npop\npop", expectedOutput: "POP 8\nPOP 5\nKOSONG" },
            { stdin: "push 1\npush 2\npush 3\npop\npop", expectedOutput: "POP 3\nPOP 2" },
            { stdin: "pop\npush 42\npop", expectedOutput: "KOSONG\nPOP 42", hidden: true },
          ],
          hints: [
            "Simpul baru menunjuk siapa pun yang saat ini menjadi top.",
            "Nilai simpul yang dilepas dibaca lewat pointer yang menyimpannya, sebelum top pindah.",
            "Blank pertama dan ketiga top, blank kedua dilepas.",
          ],
        },
      ],
    },
    {
      slug: "sd-queue-circular",
      title: "Queue via Array Melingkar",
      summary:
        "Antrean FIFO di atas array: dua indeks yang berputar dengan modulo dan satu penghitung isi.",
      steps: [
        {
          kind: "theory",
          title: "Array yang ujungnya tersambung",
          body: "Queue adalah kebalikan stack: yang pertama masuk keluar lebih dulu (FIFO), seperti antrean kasir. Enqueue masuk di ujung belakang, dequeue keluar dari ujung depan. Kalau kedua indeks hanya maju terus, slot di depan terbuang setelah sekali dipakai. Trik klasiknya memperlakukan array sebagai lingkaran: `belakang = (belakang + 1) % MAKS` membuat indeks kembali ke 0 setelah melewati ujung, dan slot lama bisa dipakai lagi.\n\nDua indeks saja menimbulkan ambiguitas: depan == belakang bisa berarti kosong atau penuh. Cara paling jernih menambah satu penghitung jumlah: kosong saat 0, penuh saat MAKS. Alternatifnya menyisakan satu slot kosong sebagai penanda, tapi penghitung lebih mudah dibaca dan tidak memakan slot.\n\nQueue circular menuntut ketelitian lebih daripada stack: dua indeks plus satu penghitung harus konsisten setiap operasi. Perbarui ketiganya dalam urutan yang sama di enqueue dan dequeue, lalu uji dengan skenario yang memutar melewati ujung array; di sanalah bug modulo biasanya bersembunyi.",
          code: {
            language: "c",
            content:
              "antre[belakang] = x;\nbelakang = (belakang + 1) % MAKS;\njumlah++;",
            caption: "Modulo membuat indeks melompat kembali ke 0 setelah slot terakhir.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan `depan = (depan + 1) % MAKS;`, apa yang terjadi saat depan bernilai MAKS - 1 lalu dimajukan?",
          options: [
            "depan menjadi MAKS dan program crash",
            "depan kembali ke 0",
            "depan menjadi -1",
            "terjadi buffer overflow",
          ],
          answer: 1,
          explanation:
            "(MAKS - 1 + 1) % MAKS = 0. Indeks melompat kembali ke awal array; itulah sifat melingkar yang membuat slot bekas bisa dipakai ulang.",
        },
        {
          kind: "code",
          title: "Antrean dengan kapasitas empat",
          prompt:
            "Queue ini berkapasitas MAKS 4 supaya perilaku penuh dan perputarannya terlihat. Program membaca perintah `enqueue x` dan `dequeue`. Lengkapi penulisan di ujung belakang, perputaran indeksnya, dan pembacaan di ujung depan. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <string.h>\n\n#define MAKS 4\n\nint antre[MAKS];\nint depan = 0;\nint belakang = 0;\nint jumlah = 0;\n\nvoid enqueue(int x) {\n    if (jumlah == MAKS) {\n        printf(\"PENUH\\n\");\n        return;\n    }\n    antre[___] = x;\n    belakang = (belakang + 1) % ___;\n    jumlah++;\n}\n\nvoid dequeue(void) {\n    if (jumlah == 0) {\n        printf(\"KOSONG\\n\");\n        return;\n    }\n    printf(\"KELUAR %d\\n\", antre[___]);\n    depan = (depan + 1) % MAKS;\n    jumlah--;\n}\n\nint main(void) {\n    char perintah[10];\n    while (scanf(\"%9s\", perintah) == 1) {\n        if (strcmp(perintah, \"enqueue\") == 0) {\n            int x;\n            scanf(\"%d\", &x);\n            enqueue(x);\n        } else if (strcmp(perintah, \"dequeue\") == 0) {\n            dequeue();\n        }\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <string.h>\n\n#define MAKS 4\n\nint antre[MAKS];\nint depan = 0;\nint belakang = 0;\nint jumlah = 0;\n\nvoid enqueue(int x) {\n    if (jumlah == MAKS) {\n        printf(\"PENUH\\n\");\n        return;\n    }\n    antre[belakang] = x;\n    belakang = (belakang + 1) % MAKS;\n    jumlah++;\n}\n\nvoid dequeue(void) {\n    if (jumlah == 0) {\n        printf(\"KOSONG\\n\");\n        return;\n    }\n    printf(\"KELUAR %d\\n\", antre[depan]);\n    depan = (depan + 1) % MAKS;\n    jumlah--;\n}\n\nint main(void) {\n    char perintah[10];\n    while (scanf(\"%9s\", perintah) == 1) {\n        if (strcmp(perintah, \"enqueue\") == 0) {\n            int x;\n            scanf(\"%d\", &x);\n            enqueue(x);\n        } else if (strcmp(perintah, \"dequeue\") == 0) {\n            dequeue();\n        }\n    }\n    return 0;\n}",
          tests: [
            {
              stdin: "enqueue 4\nenqueue 5\nenqueue 6\ndequeue\ndequeue\ndequeue",
              expectedOutput: "KELUAR 4\nKELUAR 5\nKELUAR 6",
            },
            { stdin: "dequeue", expectedOutput: "KOSONG" },
            {
              stdin:
                "enqueue 1\nenqueue 2\ndequeue\nenqueue 3\nenqueue 4\nenqueue 5\nenqueue 6\ndequeue\ndequeue\ndequeue\ndequeue\ndequeue",
              expectedOutput: "KELUAR 1\nPENUH\nKELUAR 2\nKELUAR 3\nKELUAR 4\nKELUAR 5\nKOSONG",
              hidden: true,
            },
          ],
          hints: [
            "Elemen baru selalu masuk lewat indeks yang menunjuk ujung belakang antrean.",
            "Indeks belakang dimajukan dengan bantuan konstanta ukuran array.",
            "Blank pertama belakang, blank kedua MAKS, blank ketiga depan.",
          ],
        },
      ],
    },
    {
      slug: "sd-linked-list-insert-print",
      title: "Singly Linked List: Insert dan Print",
      summary:
        "Rangkai simpul pertama kali: sisip di head, susuri rantai, dan berhenti di NULL.",
      steps: [
        {
          kind: "theory",
          title: "Rantai simpul dengan satu arah",
          body: "Singly linked list adalah rantai simpul: struct berisi data plus pointer ke simpul berikutnya, dan simpul terakhir menunjuk NULL. Satu pointer bernama head menampung seluruh list; kehilangan head berarti kehilangan semuanya. Definisinya memakai tag struct (`typedef struct Node { ... struct Node *berikut; } Node;`) karena member menunjuk tipe yang sedang didefinisikan sendiri, dan tag inilah yang membuatnya sah.\n\nInsert di head adalah pola termudah: malloc simpul baru, sambungkan baru->berikut = head, lalu head = baru. Konsekuensinya urutan list terbalik dari urutan penyisipan; untuk mempertahankan urutan input dibutuhkan pointer ekor atau penyisipan di posisi terakhir, yang sedikit lebih panjang kodenya.\n\nMembaca seluruh list memakai pola perulangan baku: `for (Node *p = head; p != NULL; p = p->berikut)`. NULL adalah penanda ujung yang sah untuk berhenti. Berbeda dari array, tidak ada indeks dan tidak ada sizeof; yang ada hanya maju satu rantai pada satu waktu, dan menyentuh p->berikut setelah p mencapai NULL adalah pembacaan yang salah.",
          code: {
            language: "c",
            content:
              "Node *baru = malloc(sizeof(Node));\nbaru->nilai = x;\nbaru->berikut = head;   /* sisa list menggantung di belakang */\nhead = baru;            /* head pindah ke simpul baru */",
            caption: "Insert di head membalik urutan: terakhir masuk, paling depan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Tiga kali insert di head dilakukan berurutan dengan nilai 1, 2, lalu 3. Urutan list dari head ke ekor adalah...",
          options: ["1 -> 2 -> 3", "3 -> 2 -> 1", "3 -> 1 -> 2", "1 -> 3 -> 2"],
          answer: 1,
          explanation:
            "Setiap simpul baru mengambil alih posisi head, sehingga nilai yang terakhir disisipkan berada paling depan: 3 -> 2 -> 1.",
        },
        {
          kind: "code",
          title: "Bangun dan cetak list",
          prompt:
            "Program membaca n bilangan, menyisipkannya di head satu per satu, mencetak list, lalu membebaskan seluruh simpulnya. Lengkapi sambungan simpul baru, perpindahan head, dan langkah maju di loop cetak. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->___) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = ___;\n        head = ___;\n    }\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->berikut) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = head;\n        head = baru;\n    }\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "3\n1 2 3", expectedOutput: "3 -> 2 -> 1 -> NULL" },
            { stdin: "1\n42", expectedOutput: "42 -> NULL" },
            { stdin: "5\n5 4 3 2 1", expectedOutput: "1 -> 2 -> 3 -> 4 -> 5 -> NULL", hidden: true },
          ],
          hints: [
            "Simpul baru menunjuk head lama, lalu head berpindah ke simpul baru.",
            "Di dalam loop cetak, pointer maju ke member yang menunjuk simpul berikutnya.",
            "Blank pertama head, blank kedua baru, blank ketiga berikut.",
          ],
        },
      ],
    },
    {
      slug: "sd-linked-list-delete-value",
      title: "Linked List: Delete by Value",
      summary:
        "Lepaskan simpul tertentu: jaga sambungan dari pendahulunya dan tangani head secara khusus.",
      steps: [
        {
          kind: "theory",
          title: "Menjahit ulang rantai sebelum memotong",
          body: "Menghapus simpul di tengah list berarti merapikan sambungan: pendahulu harus melompat langsung ke penerus. Karena singly linked list hanya bisa disusuri maju, pencarian membawa dua pointer: prev dan kini. Tanpa prev, sambungan dari belakang tidak bisa diperbaiki dan sisa list terputus dari head.\n\nHapus head adalah kasus khusus yang wajib ditangani lebih dulu: tidak ada prev, cukup majukan head ke head->berikut lalu free simpul lama. Melupakan cabang ini adalah bug paling umum operasi delete. Kalau penyusuran berakhir di NULL tanpa menemukan target, nilai memang tidak ada di list dan list dibiarkan utuh.\n\nUrutan yang aman saat menemukan target: tautkan dulu prev->berikut = kini->berikut, baru free(kini). Membalik urutannya berarti membaca member simpul yang sudah dikembalikan ke heap, dangling pointer dari modul memori dinamis yang kini muncul dalam wujud nyata dan hasilnya tidak terduga.",
          code: {
            language: "c",
            content:
              "if (kini != NULL) {\n    prev->berikut = kini->berikut; /* pendahulu melompati target */\n    free(kini);\n}",
            caption: "Rapikan sambungan dulu, baru simpul target dilepas.",
          },
        },
        {
          kind: "quiz",
          question: "Saat nilai yang mau dihapus justru berada di head, langkah yang benar adalah...",
          options: [
            "tetap mencari prev karena setiap penghapusan wajib punya pendahulu",
            "memajukan head ke head->berikut lalu free head yang lama",
            "membiarkannya karena head tidak boleh dihapus",
            "membalik list terlebih dahulu supaya head menjadi ekor",
          ],
          answer: 1,
          explanation:
            "Head tidak punya pendahulu, jadi cukup head = head->berikut lalu free simpul lama. Fungsi yang benar menangani cabang ini sebelum pencarian umum.",
        },
        {
          kind: "code",
          title: "Perbaiki penghapusan yang memutus list",
          prompt:
            "Program membaca n bilangan (terbangun berurutan sesuai input), membaca nilai target, menghapusnya, lalu mencetak list. Sayangnya setiap penghapusan membuat list putus. Perbaiki satu kesalahan di fungsi hapus_nilai sampai semua tes lulus.",
          mode: "fix",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *hapus_nilai(Node *head, int target) {\n    if (head == NULL) {\n        return NULL;\n    }\n    if (head->nilai == target) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n        return head;\n    }\n    Node *prev = head;\n    Node *kini = head->berikut;\n    while (kini != NULL && kini->nilai != target) {\n        prev = kini;\n        kini = kini->berikut;\n    }\n    if (kini != NULL) {\n        prev->berikut = kini;\n        free(kini);\n    }\n    return head;\n}\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->berikut) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    Node *ekor = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = NULL;\n        if (head == NULL) {\n            head = baru;\n        } else {\n            ekor->berikut = baru;\n        }\n        ekor = baru;\n    }\n    int target;\n    scanf(\"%d\", &target);\n    head = hapus_nilai(head, target);\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *hapus_nilai(Node *head, int target) {\n    if (head == NULL) {\n        return NULL;\n    }\n    if (head->nilai == target) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n        return head;\n    }\n    Node *prev = head;\n    Node *kini = head->berikut;\n    while (kini != NULL && kini->nilai != target) {\n        prev = kini;\n        kini = kini->berikut;\n    }\n    if (kini != NULL) {\n        prev->berikut = kini->berikut;\n        free(kini);\n    }\n    return head;\n}\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->berikut) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    Node *ekor = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = NULL;\n        if (head == NULL) {\n            head = baru;\n        } else {\n            ekor->berikut = baru;\n        }\n        ekor = baru;\n    }\n    int target;\n    scanf(\"%d\", &target);\n    head = hapus_nilai(head, target);\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "4\n1 2 3 4\n3", expectedOutput: "1 -> 2 -> 4 -> NULL" },
            { stdin: "3\n5 6 7\n5", expectedOutput: "6 -> 7 -> NULL" },
            { stdin: "3\n1 2 3\n9", expectedOutput: "1 -> 2 -> 3 -> NULL", hidden: true },
          ],
          hints: [
            "Jalankan tes pertama dan lihat: setelah simpul sebelum target, list terputus.",
            "Pendahulu harus menunjuk ke penerus target, bukan ke target itu sendiri.",
            "Ganti prev->berikut = kini menjadi prev->berikut = kini->berikut.",
          ],
        },
      ],
    },
    {
      slug: "sd-linked-list-reverse",
      title: "Reverse Linked List Secara Iteratif",
      summary:
        "Balik arah seluruh rantai dengan tiga pointer: satu kali lewat, tanpa memori tambahan.",
      steps: [
        {
          kind: "theory",
          title: "Membalik panah sambil berjalan",
          body: "Membalik linked list adalah soal klasik sekaligus latihan pointer terbaik. Idenya: susuri list sambil membalik arah setiap panah. prev menampung bagian yang sudah terbalik, kini adalah simpul yang sedang diproses, dan lanjut menyelamatkan referensi ke sisa list sebelum panahnya ditimpa. Tanpa lanjut, sisa list hilang begitu kini->berikut ditimpa.\n\nIsi loop berulang tiga gerakan: simpan lanjut = kini->berikut, balik kini->berikut = prev, lalu majukan prev = kini dan kini = lanjut. Saat kini mencapai NULL, seluruh rantai sudah terbalik dan prev berdiri di head baru. Totalnya satu kali lewat O(n) dengan memori tambahan O(1): tidak ada list kedua, tidak ada malloc.\n\nAda jalan rekursif yang elegan, tapi versi iteratif lebih aman untuk list panas karena tidak menumpuk frame pemanggilan sedalam panjang list. Keduanya sah; yang wajib dikuasai adalah gerakan tiga pointer ini, karena variasinya muncul lagi di banyak soal struktur data.",
          code: {
            language: "c",
            content:
              "Node *prev = NULL;\nNode *kini = head;\nwhile (kini != NULL) {\n    Node *lanjut = kini->berikut; /* selamatkan dulu */\n    kini->berikut = prev;         /* balik panahnya */\n    prev = kini;\n    kini = lanjut;\n}\nreturn prev; /* head baru */",
            caption: "lanjut diselamatkan sebelum kini->berikut ditimpa.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika baris `lanjut = kini->berikut` dihapus dari loop pembalik?",
          options: [
            "tetap bekerja, hanya lebih lambat",
            "sisa list hilang dari jangkauan karena kini->berikut ditimpa sebelum diselamatkan",
            "prev ikut terbalik dua kali",
            "list menjadi melingkar dengan aman",
          ],
          answer: 1,
          explanation:
            "Menimpa kini->berikut memutus akses ke sisa rantai. Tanpa menyimpan kini->berikut lebih dulu, pointer kini tidak punya jalan untuk melanjutkan penyusuran.",
        },
        {
          kind: "code",
          title: "Balik list yang sudah berurutan",
          prompt:
            "Program membangun list sesuai urutan input, mencetaknya, membalik dengan fungsi balik, lalu mencetak lagi. Lengkapi penyelamatan pointer, pembalikan panah, dan head yang dikembalikan. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *balik(Node *head) {\n    Node *prev = NULL;\n    Node *kini = head;\n    while (kini != NULL) {\n        Node *lanjut = kini->___;\n        kini->berikut = ___;\n        prev = kini;\n        kini = lanjut;\n    }\n    return ___;\n}\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->berikut) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    Node *ekor = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = NULL;\n        if (head == NULL) {\n            head = baru;\n        } else {\n            ekor->berikut = baru;\n        }\n        ekor = baru;\n    }\n    cetak(head);\n    head = balik(head);\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int nilai;\n    struct Node *berikut;\n} Node;\n\nNode *balik(Node *head) {\n    Node *prev = NULL;\n    Node *kini = head;\n    while (kini != NULL) {\n        Node *lanjut = kini->berikut;\n        kini->berikut = prev;\n        prev = kini;\n        kini = lanjut;\n    }\n    return prev;\n}\n\nvoid cetak(Node *head) {\n    for (Node *p = head; p != NULL; p = p->berikut) {\n        printf(\"%d\", p->nilai);\n        if (p->berikut != NULL) {\n            printf(\" -> \");\n        }\n    }\n    printf(\" -> NULL\\n\");\n}\n\nint main(void) {\n    Node *head = NULL;\n    Node *ekor = NULL;\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        Node *baru = malloc(sizeof(Node));\n        baru->nilai = x;\n        baru->berikut = NULL;\n        if (head == NULL) {\n            head = baru;\n        } else {\n            ekor->berikut = baru;\n        }\n        ekor = baru;\n    }\n    cetak(head);\n    head = balik(head);\n    cetak(head);\n    while (head != NULL) {\n        Node *dilepas = head;\n        head = head->berikut;\n        free(dilepas);\n    }\n    return 0;\n}",
          tests: [
            {
              stdin: "3\n1 2 3",
              expectedOutput: "1 -> 2 -> 3 -> NULL\n3 -> 2 -> 1 -> NULL",
            },
            { stdin: "1\n7", expectedOutput: "7 -> NULL\n7 -> NULL" },
            {
              stdin: "4\n4 3 2 1",
              expectedOutput: "4 -> 3 -> 2 -> 1 -> NULL\n1 -> 2 -> 3 -> 4 -> NULL",
              hidden: true,
            },
          ],
          hints: [
            "Tiga gerakan dalam loop: selamatkan simpul berikutnya, balik panah, majukan dua pointer.",
            "Saat loop berakhir, kini sudah NULL dan simpul ujung balikan tersimpan di prev.",
            "Blank pertama berikut, blank kedua dan ketiga prev.",
          ],
        },
      ],
    },
    {
      slug: "sd-doubly-linked-list",
      title: "Doubly Linked List",
      summary:
        "Simpul yang bisa melihat dua arah dengan prev dan berikut, lengkap dengan biayanya.",
      steps: [
        {
          kind: "theory",
          title: "Dua panah per simpul",
          body: "Doubly linked list menambah satu pointer per simpul: prev. Setiap simpul kini tahu tetangga kiri dan kanannya, sehingga penyusuran bisa dua arah dan penghapusan simpul yang sudah dipegang tidak butuh mencari pendahulu: cukup menjahit node->prev->berikut dan node->berikut->prev, lalu free node.\n\nPolanya: prev simpul pertama NULL, berikut simpul terakhir NULL, dan sering kali head plus ekor dipelihara bersamaan supaya penyisipan di kedua ujung tetap O(1). Konsekuensinya setiap operasi menyentuh dua panah, bukan satu; lupa memperbarui prev adalah bug khas list dua arah, dan simpul yang tampak benar dari depan bisa patah kalau disusuri dari belakang.\n\nHarganya nyata: memori bertambah satu pointer per simpul dan tiap sambungan ditulis dua kali. Dipakai ketika navigasi mundur memang penting: riwayat undo dua arah, LRU cache, dan struktur urutan yang sering disisip dari dua sisi. Kalau penyusurannya hanya maju, singly linked list tetap pilihan yang lebih hemat.",
          code: {
            language: "c",
            content:
              "typedef struct Node {\n    int nilai;\n    struct Node *prev;\n    struct Node *berikut;\n} Node;\n\n/* hapus simpul yang sudah dipegang, tanpa mencari pendahulu */\nif (node->prev != NULL) {\n    node->prev->berikut = node->berikut;\n} else {\n    head = node->berikut;\n}\nif (node->berikut != NULL) {\n    node->berikut->prev = node->prev;\n}\nfree(node);",
            caption: "Dua panah dijahit; prev simpul pertama dan berikut simpul terakhir selalu NULL.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa keunggulan doubly linked list saat menghapus simpul yang sudah dipegang pointer-nya?",
          options: [
            "simpulnya dibersihkan otomatis tanpa perlu free",
            "tidak perlu menyusuri pendahulu karena simpul menyimpan prev sendiri",
            "penyusurannya lebih hemat memori daripada singly linked list",
            "penghapusannya selalu O(1) tanpa syarat apa pun",
          ],
          answer: 1,
          explanation:
            "Simpul membawa prev sendiri, jadi pendahulunya langsung diketahui. Singly linked list harus menyusuri dari head untuk menemukan pendahulu.",
        },
        {
          kind: "quiz",
          question:
            "Dalam doubly linked list yang benar, member prev simpul pertama dan member berikut simpul terakhir berisi...",
          options: [
            "saling menunjuk satu sama lain",
            "menunjuk head dan ekor",
            "NULL",
            "alamat simpul itu sendiri",
          ],
          answer: 2,
          explanation:
            "Ujung-ujung rantai menunjuk NULL, sama seperti singly linked list; itu penanda berhenti yang sah dari kedua arah penyusuran.",
        },
      ],
    },
    {
      slug: "sd-hash-table",
      title: "Hash Table Sederhana",
      summary:
        "Array of linked list plus hash djb2: kamus mini yang mencari tanpa menyusuri semuanya.",
      steps: [
        {
          kind: "theory",
          title: "Pertanyaan langsung: di bucket mana?",
          body: "Hash table mempercepat pencarian dengan menjawab pertanyaan langsung: kata ini seharusnya berada di bucket nomor berapa? Fungsi hash memetakan string menjadi angka besar, lalu modulo memotongnya ke rentang indeks array. Setiap bucket adalah linked list, jadi dua kata yang mendarat di bucket yang sama (collision) tidak saling menimpa; keduanya berbaris di rantai yang sama.\n\nFungsi djb2 adalah hash klasik yang ringkas: mulai dari bibit 5381, lalu untuk setiap karakter hitung h = h * 33 + karakter. Perkalian 33 menyebarkan bit dengan murah, dan sebarannya cukup baik untuk tabel latihan. Seluruh fungsinya beberapa baris tanpa tabel ajaib, dan nilai kembaliannya unsigned long supaya pembalikan angka tidak bermasalah.\n\nKualitas tabel bergantung pada sebaran hash dan jumlah bucket: makin sedikit bucket untuk banyak data, makin panjang rantainya dan makin mendekati pencarian linear. Konsep load factor (jumlah elemen dibagi jumlah bucket) menjadi pemicu menambah bucket dan me-rehash di tabel nyata. Untuk kamus kecil, delapan bucket sudah cukup terasa bedanya dibanding menyusuri satu list panjang.",
          code: {
            language: "c",
            content:
              "unsigned long djb2(const char *s) {\n    unsigned long h = 5381;\n    while (*s != '\\0') {\n        h = h * 33 + (unsigned char)*s;\n        s++;\n    }\n    return h;\n}",
            caption: "h * 33 + karakter, diulang untuk tiap karakter; 5381 adalah bibit tradisionalnya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dua kata berbeda menghasilkan nilai djb2 yang sama setelah di-modulo jumlah bucket. Apa yang terjadi?",
          options: [
            "program gagal dikompilasi karena bucket bentrok",
            "keduanya disimpan dalam linked list milik bucket yang sama",
            "kata kedua menggantikan kata pertama secara diam-diam",
            "hash table otomatis menambah bucket baru",
          ],
          answer: 1,
          explanation:
            "Itulah gunanya separate chaining: collision ditangani dengan menambah simpul di rantai bucket yang sama. Pencarian lalu membandingkan kata satu per satu di rantai itu.",
        },
        {
          kind: "code",
          title: "Kamus mini dengan delapan bucket",
          prompt:
            "Program membaca n kata lalu menyisipkannya ke tabel hash, dan pada akhirnya melaporkan posisi satu kata target. Lengkapi pemotongan hash ke indeks bucket serta kedua penyambungan simpul baru ke rantainya. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define BUCKET 8\n\ntypedef struct Node {\n    char kata[24];\n    struct Node *berikut;\n} Node;\n\nunsigned long djb2(const char *s) {\n    unsigned long h = 5381;\n    while (*s != '\\0') {\n        h = h * 33 + (unsigned char)*s;\n        s++;\n    }\n    return h;\n}\n\nint cari(Node *tabel[], const char *kata) {\n    unsigned long h = djb2(kata) % ___;\n    for (Node *p = tabel[h]; p != NULL; p = p->berikut) {\n        if (strcmp(p->kata, kata) == 0) {\n            return 1;\n        }\n    }\n    return 0;\n}\n\nvoid masukkan(Node *tabel[], const char *kata) {\n    if (cari(tabel, kata)) {\n        return;\n    }\n    unsigned long h = djb2(kata) % BUCKET;\n    Node *baru = malloc(sizeof(Node));\n    strcpy(baru->kata, kata);\n    baru->berikut = tabel[___];\n    tabel[___] = baru;\n}\n\nint main(void) {\n    Node *tabel[BUCKET] = {NULL};\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        char kata[24];\n        scanf(\"%23s\", kata);\n        masukkan(tabel, kata);\n    }\n    char target[24];\n    scanf(\"%23s\", target);\n    if (cari(tabel, target)) {\n        printf(\"%s ADA di bucket %lu\\n\", target, djb2(target) % BUCKET);\n    } else {\n        printf(\"%s TIDAK ADA\\n\", target);\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define BUCKET 8\n\ntypedef struct Node {\n    char kata[24];\n    struct Node *berikut;\n} Node;\n\nunsigned long djb2(const char *s) {\n    unsigned long h = 5381;\n    while (*s != '\\0') {\n        h = h * 33 + (unsigned char)*s;\n        s++;\n    }\n    return h;\n}\n\nint cari(Node *tabel[], const char *kata) {\n    unsigned long h = djb2(kata) % BUCKET;\n    for (Node *p = tabel[h]; p != NULL; p = p->berikut) {\n        if (strcmp(p->kata, kata) == 0) {\n            return 1;\n        }\n    }\n    return 0;\n}\n\nvoid masukkan(Node *tabel[], const char *kata) {\n    if (cari(tabel, kata)) {\n        return;\n    }\n    unsigned long h = djb2(kata) % BUCKET;\n    Node *baru = malloc(sizeof(Node));\n    strcpy(baru->kata, kata);\n    baru->berikut = tabel[h];\n    tabel[h] = baru;\n}\n\nint main(void) {\n    Node *tabel[BUCKET] = {NULL};\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        char kata[24];\n        scanf(\"%23s\", kata);\n        masukkan(tabel, kata);\n    }\n    char target[24];\n    scanf(\"%23s\", target);\n    if (cari(tabel, target)) {\n        printf(\"%s ADA di bucket %lu\\n\", target, djb2(target) % BUCKET);\n    } else {\n        printf(\"%s TIDAK ADA\\n\", target);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "3\nkucing kambing kuda\nkuda", expectedOutput: "kuda ADA di bucket 2" },
            { stdin: "2\nalpha beta\ngamma", expectedOutput: "gamma TIDAK ADA" },
            { stdin: "3\nsatu satu dua\nsatu", expectedOutput: "satu ADA di bucket 2", hidden: true },
          ],
          hints: [
            "Hasil hash dipotong dengan modulo konstanta jumlah bucket sebelum dipakai sebagai indeks.",
            "Simpul baru diselipkan di depan rantai: dia menunjuk head lama, lalu bucket menunjuk dia.",
            "Blank pertama BUCKET, blank kedua dan ketiga h.",
          ],
        },
      ],
    },
    {
      slug: "sd-latihan-undo",
      title: "Latihan Gabungan: Editor dengan Undo",
      summary:
        "Padukan stack linked list, string, dan disiplin memori: riwayat undo berbasis snapshot.",
      steps: [
        {
          kind: "theory",
          title: "Tumpukan keadaan untuk tombol undo",
          body: "Penutup modul merakit sesuatu yang akrab: editor kecil dengan perintah TULIS, UNDO, dan CETAK. Jantungnya stack of states: setiap kali teks akan diubah, keadaan lama disalin ke simpul dan ditumpuk. UNDO memunculkan keadaan terakhir dan mengembalikannya ke buffer; CETAK menampilkan hasilnya.\n\nPola ini disebut snapshot undo: menyimpan salinan penuh keadaan sebelum berubah. Versi hemat menyimpan hanya delta (perintah pembaliknya), tapi snapshot paling jernih untuk dipelajari dan cukup untuk teks pendek. Simpul yang sudah dipunculkan langsung di-free, jadi undo berkali-kali tidak menumpukkan sampah memori.\n\nPerhatikan urutan di kedua fungsinya: saat menyimpan, salin dulu lalu sambungkan dan majukan top; saat membatalkan, baca isi simpul, majukan top, baru free. Urutan yang sama sudah kamu latih di stack linked list dan delete by value; kini ia bekerja menyelamatkan riwayat ketikan sungguhan.",
          code: {
            language: "c",
            content:
              "void simpan_state(void) {\n    State *s = malloc(sizeof(State));\n    strcpy(s->isi, buffer);   /* keadaan lama disalin sebelum buffer berubah */\n    s->berikut = undo_top;\n    undo_top = s;\n}\n\nvoid undo(void) {\n    if (undo_top == NULL) {\n        return;\n    }\n    State *s = undo_top;\n    strcpy(buffer, s->isi);\n    undo_top = s->berikut;\n    free(s);                  /* free setelah top pindah */\n}",
            caption: "Snapshot sebelum berubah; free setelah top pindah, bukan sebelumnya.",
          },
        },
        {
          kind: "quiz",
          question:
            "Mengapa keadaan lama disimpan SEBELUM buffer diubah pada setiap perintah TULIS?",
          options: [
            "supaya malloc bekerja lebih cepat",
            "karena UNDO harus mengembalikan keadaan tepat sebelum perubahan terakhir",
            "karena strcpy tidak bisa menimpa isi lama",
            "supaya buffer tidak pernah kosong",
          ],
          answer: 1,
          explanation:
            "Snapshot yang disimpan sebelum perubahan adalah satu-satunya yang persis seperti tampilan sebelumnya. Kalau disimpan setelahnya, undo tidak punya keadaan lama untuk dikembalikan.",
        },
        {
          kind: "code",
          title: "Editor tiga perintah",
          prompt:
            "Program menerima perintah `TULIS kata` (tambahkan kata ke teks), `UNDO` (kembalikan keadaan sebelumnya), dan `CETAK` (tampilkan teks). Lengkapi penunjukan simpul baru ke tumpukan, pengembalian isi ke buffer, dan perpindahan top saat undo. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct State {\n    char isi[64];\n    struct State *berikut;\n} State;\n\nState *undo_top = NULL;\nchar buffer[64] = \"\";\n\nvoid simpan_state(void) {\n    State *s = malloc(sizeof(State));\n    strcpy(s->isi, buffer);\n    s->berikut = ___;\n    undo_top = s;\n}\n\nvoid undo(void) {\n    if (undo_top == NULL) {\n        printf(\"UNDO KOSONG\\n\");\n        return;\n    }\n    State *s = undo_top;\n    strcpy(buffer, ___);\n    undo_top = ___;\n    free(s);\n}\n\nint main(void) {\n    char perintah[8];\n    while (scanf(\"%7s\", perintah) == 1) {\n        if (strcmp(perintah, \"TULIS\") == 0) {\n            char kata[24];\n            scanf(\"%23s\", kata);\n            simpan_state();\n            if (buffer[0] != '\\0') {\n                strcat(buffer, \" \");\n            }\n            strcat(buffer, kata);\n        } else if (strcmp(perintah, \"UNDO\") == 0) {\n            undo();\n        } else if (strcmp(perintah, \"CETAK\") == 0) {\n            printf(\"%s\\n\", buffer);\n        }\n    }\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct State {\n    char isi[64];\n    struct State *berikut;\n} State;\n\nState *undo_top = NULL;\nchar buffer[64] = \"\";\n\nvoid simpan_state(void) {\n    State *s = malloc(sizeof(State));\n    strcpy(s->isi, buffer);\n    s->berikut = undo_top;\n    undo_top = s;\n}\n\nvoid undo(void) {\n    if (undo_top == NULL) {\n        printf(\"UNDO KOSONG\\n\");\n        return;\n    }\n    State *s = undo_top;\n    strcpy(buffer, s->isi);\n    undo_top = s->berikut;\n    free(s);\n}\n\nint main(void) {\n    char perintah[8];\n    while (scanf(\"%7s\", perintah) == 1) {\n        if (strcmp(perintah, \"TULIS\") == 0) {\n            char kata[24];\n            scanf(\"%23s\", kata);\n            simpan_state();\n            if (buffer[0] != '\\0') {\n                strcat(buffer, \" \");\n            }\n            strcat(buffer, kata);\n        } else if (strcmp(perintah, \"UNDO\") == 0) {\n            undo();\n        } else if (strcmp(perintah, \"CETAK\") == 0) {\n            printf(\"%s\\n\", buffer);\n        }\n    }\n    return 0;\n}",
          tests: [
            {
              stdin: "TULIS halo\nCETAK\nTULIS dunia\nCETAK\nUNDO\nCETAK",
              expectedOutput: "halo\nhalo dunia\nhalo",
            },
            {
              stdin: "TULIS a\nUNDO\nCETAK\nUNDO\nCETAK",
              expectedOutput: "\nUNDO KOSONG\n\n",
            },
            {
              stdin: "TULIS satu\nTULIS dua\nTULIS tiga\nUNDO\nUNDO\nCETAK",
              expectedOutput: "satu",
              hidden: true,
            },
          ],
          hints: [
            "Simpul baru menunjuk top lama, lalu top berpindah ke simpul baru; pola push yang sudah kamu kenal.",
            "Isi keadaan lama ada di member isi milik simpul yang sedang dipunculkan.",
            "Blank pertama undo_top, blank kedua s->isi, blank ketiga s->berikut.",
          ],
        },
      ],
    },
    // ==================== MODUL 7: Preprocessor dan Build ====================
    {
      slug: "pp-define-konstanta",
      title: "#define Konstanta vs const",
      summary:
        "Kenali penggantian teks oleh preprocessor sebelum kompilasi, dan bedanya dengan const.",
      steps: [
        {
          kind: "theory",
          title: "Penggantian teks yang terjadi lebih dulu",
          body: "Sebelum compiler membaca kode, preprocessor bekerja lebih dulu. `#define PI 3.14159` tidak membuat variabel: ia mencatat aturan \"setiap PI diganti 3.14159\", lalu penggantian dilakukan secara teks ke seluruh file. Yang dikompilasi adalah hasil gantinya; nama PI sendiri sudah tidak ada saat program berjalan.\n\n`const double PI = 3.14159;` berbeda: PI adalah nama bertipe yang diperiksa compiler, punya ruang lingkup, dan muncul di pesan error dengan tipe yang jelas. Makro tidak punya tipe dan tidak mengenal ruang lingkup. Untuk konstanta biasa, const atau enum lebih aman; makro tetap dipakai untuk nilai yang dibutuhkan directive #if dan untuk konstanta yang harus tersedia sebelum kompilasi.\n\nKesalahan klasiknya satu karakter: `#define MAKS 40;`. Titik koma ikut menjadi bagian teks pengganti, sehingga `int a[MAKS];` menjadi `int a[40;;]` dan errornya dilaporkan di baris pemakaian, bukan di baris #define. Konvensinya makro ditulis HURUF_BESAR_SEMUA supaya pembaca langsung tahu itu bukan variabel biasa.",
          code: {
            language: "c",
            content:
              "#include <stdio.h>\n\n#define UKURAN 4\n\nint main(void) {\n    int total = 0;\n    for (int i = 0; i < UKURAN; i++) {\n        total += i * i;\n    }\n    printf(\"total %d\\n\", total);\n    return 0;\n}",
            caption: "Preprocessor mengganti UKURAN menjadi 4 sebelum compiler melihat barisnya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa akibat menulis `#define MAKS 40;` (dengan titik koma di ujung)?",
          options: [
            "titik koma diabaikan preprocessor",
            "setiap pemakaian MAKS diganti teks `40;` dan biasanya memicu error di baris pemakaiannya",
            "MAKS menjadi variabel bertipe int",
            "kompilasi berhasil tanpa efek apa pun",
          ],
          answer: 1,
          explanation:
            "#define mengganti teks apa adanya, titik koma termasuk. int a[MAKS]; menjadi int a[40;;]; yang gagal dikompilasi, dan pesan errornya muncul jauh dari baris #define.",
        },
        {
          kind: "code",
          title: "Konstanta dari preprocessor",
          prompt:
            "Program ini menghitung luas lingkaran memakai makro dan menampilkan kapasitas kelas. Lengkapi kedua direktif #define dan pemakaian makronya. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n\n#___ PI 3.14159\n#define MAKS_SISWA ___\n\nint main(void) {\n    double r;\n    scanf(\"%lf\", &r);\n    double luas = ___ * r * r;\n    printf(\"luas %.2f\\n\", luas);\n    printf(\"kapasitas %d siswa\\n\", MAKS_SISWA);\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n#define PI 3.14159\n#define MAKS_SISWA 40\n\nint main(void) {\n    double r;\n    scanf(\"%lf\", &r);\n    double luas = PI * r * r;\n    printf(\"luas %.2f\\n\", luas);\n    printf(\"kapasitas %d siswa\\n\", MAKS_SISWA);\n    return 0;\n}",
          tests: [
            { stdin: "7", expectedOutput: "luas 153.94\nkapasitas 40 siswa" },
            { stdin: "1", expectedOutput: "luas 3.14\nkapasitas 40 siswa" },
            { stdin: "2.5", expectedOutput: "luas 19.63\nkapasitas 40 siswa", hidden: true },
          ],
          hints: [
            "Direktif praprosesor untuk mendefinisikan makro diawali tanda pagar.",
            "Nilai makro ditulis apa adanya, tanpa titik koma dan tanpa tanda sama dengan.",
            "Blank pertama define, blank kedua 40, blank ketiga PI.",
          ],
        },
      ],
    },
    {
      slug: "pp-macro-fungsi",
      title: "Macro Fungsi dan Jebakan Tanda Kurung",
      summary:
        "Macro dengan argumen bekerja dengan menyalin teks, dan di sanalah jebakannya menyergap.",
      steps: [
        {
          kind: "theory",
          title: "Bukan fungsi, hanya salin-tempel",
          body: "Makro bisa menerima argumen: `#define KUADRAT(x) ((x) * (x))`. Jangan tertipu bentuknya; ini bukan fungsi. Preprocessor menyalin teks argumen apa adanya ke badan makro: KUADRAT(a + 1) menjadi ((a + 1) * (a + 1)). Tidak ada pemanggilan, tidak ada pengecekan tipe; yang ada hanya teks yang sudah jadi sebelum compiler bekerja.\n\nTanpa tanda kurung, penyalinan teks membocorkan bug. `#define KUADRAT(x) (x * x)` membuat KUADRAT(a + 1) melebar menjadi (a + 1 * a + 1), yang dihitung sebagai a + (1 * a) + 1 karena perkalian didahulukan. Hasilnya 2a + 2, bukan kuadrat. Kebiasaan wajibnya satu kalimat: bungkus setiap parameter dan seluruh badan makro dengan tanda kurung.\n\nJebakan kedua lebih halus: argumen bisa dievaluasi lebih dari sekali. KUADRAT(i++) melebar menjadi ((i++) * (i++)) dan menaikkan i dua kali, sesuatu yang mustahil terjadi pada fungsi sungguhan. Untuk kebanyakan kasus, fungsi biasa atau const sudah lebih aman; makro fungsi tersisa untuk hal yang memang butuh bekerja pada teks atau tipe yang beragam.",
          code: {
            language: "c",
            content:
              "#define KUADRAT(x) ((x) * (x))\n#define MAKS2(a, b) ((a) > (b) ? (a) : (b))\n\nprintf(\"%d\\n\", KUADRAT(a + 1)); /* ((a + 1) * (a + 1)), aman */\nprintf(\"%d\\n\", MAKS2(x, y));    /* ternary: nilai yang lebih besar */",
            caption: "Setiap parameter dan seluruh badan dibungkus tanda kurung.",
          },
        },
        {
          kind: "quiz",
          question:
            "Ekspansi teks dari `DUA_KALI(n + 2)` jika didefinisikan `#define DUA_KALI(x) ((x) + (x))` adalah...",
          options: [
            "((n + 2) + (n + 2))",
            "(n + (2 + n + 2))",
            "DUA_KALI(n) + DUA_KALI(2)",
            "(n + 2 + n + 2)",
          ],
          answer: 0,
          explanation:
            "Parameter x diganti seluruh teks n + 2 di setiap kemunculannya, dan karena badan makro dibungkus kurung, hasilnya ((n + 2) + (n + 2)).",
        },
        {
          kind: "code",
          title: "Perbaiki macro kuadrat",
          prompt:
            "Program ini menghitung kuadrat a dan kuadrat (a + 1) lewat makro. Baris pertama benar, tapi baris kedua selalu melenceng. Perbaiki satu kesalahan di definisi makronya sampai semua tes lulus.",
          mode: "fix",
          template:
            "#include <stdio.h>\n\n#define KUADRAT(x) (x * x)\n\nint main(void) {\n    int a;\n    scanf(\"%d\", &a);\n    printf(\"kuadrat a = %d\\n\", KUADRAT(a));\n    printf(\"kuadrat a+1 = %d\\n\", KUADRAT(a + 1));\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n#define KUADRAT(x) ((x) * (x))\n\nint main(void) {\n    int a;\n    scanf(\"%d\", &a);\n    printf(\"kuadrat a = %d\\n\", KUADRAT(a));\n    printf(\"kuadrat a+1 = %d\\n\", KUADRAT(a + 1));\n    return 0;\n}",
          tests: [
            { stdin: "5", expectedOutput: "kuadrat a = 25\nkuadrat a+1 = 36" },
            { stdin: "3", expectedOutput: "kuadrat a = 9\nkuadrat a+1 = 16" },
            { stdin: "0", expectedOutput: "kuadrat a = 0\nkuadrat a+1 = 1", hidden: true },
          ],
          hints: [
            "Jalankan dengan input 5: baris pertama benar, baris kedua jadi 12 karena (a + 1 * a + 1) dihitung a + (1 * a) + 1.",
            "Perkalian lebih dulu daripada penjumlahan; paksa urutannya dengan tanda kurung di sekitar parameter.",
            "Ubah definisinya menjadi #define KUADRAT(x) ((x) * (x)).",
          ],
        },
      ],
    },
    {
      slug: "pp-ifdef-guard",
      title: "Include Guard dan #ifdef",
      summary:
        "Cegah header yang sama diproses dua kali dengan pola #ifndef, #define, #endif.",
      steps: [
        {
          kind: "theory",
          title: "Header yang disertakan dua kali",
          body: "Header bisa ter-sertakan dua kali tanpa disengaja: a.h meng-include util.h, main.c meng-include a.h sekaligus util.h, dan isi util.h diproses dua kali dalam satu file. Untuk prototipe fungsi itu masih sah, tapi untuk typedef dan definisi struct, duplikasi berarti error redefinition. Preprocessor tidak mengingat isi file; ia hanya menurut pada direktif yang ia temui.\n\nJawabannya include guard. Seluruh isi header dibungkus `#ifndef UTIL_H` di atas, `#define UTIL_H` di baris kedua, dan `#endif` di akhir. Saat pertama kali diproses, UTIL_H belum terdefinisi sehingga isi masuk dan makro UTIL_H terdefinisi. Saat file yang sama disertakan lagi, #ifndef gagal dan seluruh isi dilompati. Nama guard mengikuti nama file: UTIL_H, KERANJANG_H, ditulis konsisten.\n\n`#pragma once` adalah alternatif yang lebih ringkas dan didukung semua compiler besar, meski bukan bagian standar C. Pola guard standar tetap wajib dikuasai karena bekerja di mana saja dan menjadi bahasa bersama di kode C lama. Direktif #ifdef sendiri lebih luas lagi: mematikan blok debug dan menyusun kode per platform, yang dibahas di lesson conditional compilation.",
          code: {
            language: "c",
            content:
              "/* util.h */\n#ifndef UTIL_H\n#define UTIL_H\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\ndouble jarak(Titik a, Titik b);\n\n#endif",
            caption: "Disertakan sebanyak apa pun, isi util.h hanya diproses satu kali.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa tugas `#define UTIL_H` di baris kedua include guard?",
          options: [
            "mendeklarasikan fungsi util agar bisa dipanggil",
            "menandai isi header sudah pernah diproses, sehingga #ifndef yang berikutnya gagal",
            "memberi nama file header kepada compiler",
            "menghitung berapa kali header disertakan",
          ],
          answer: 1,
          explanation:
            "Makro UTIL_H adalah kuncinya: terdefinisi setelah kunjungan pertama, dan #ifndef pada kunjungan berikutnya melihatnya lalu melompati seluruh isi header.",
        },
        {
          kind: "quiz",
          question:
            "Header tanpa include guard berisi `typedef struct {...} Titik;` dan disertakan dua kali dalam satu file .c. Akibatnya...",
          options: [
            "tetap dikompilasi normal karena typedef boleh diulang",
            "gagal kompilasi karena tipe dengan nama yang sama didefinisikan dua kali",
            "otomatis dilewati oleh preprocessor",
            "hanya menghasilkan peringatan dan program tetap jalan",
          ],
          answer: 1,
          explanation:
            "Dua typedef dengan nama sama di satu file adalah error redefinition. Include guard mencegahnya karena isi kedua hanya diproses sekali.",
        },
      ],
    },
    {
      slug: "pp-multi-file",
      title: "Kompilasi Multi-File Secara Manual",
      summary:
        "Dari banyak file .c menjadi satu program: preprocess, kompilasi, lalu hubungkan.",
      steps: [
        {
          kind: "theory",
          title: "Tiga tahap dari source ke program",
          body: "Program C nyata jarang berupa satu file. `gcc main.c util.c -o program` melakukan pekerjaan berurutan: preprocessor membentangkan #include dan #define pada tiap file, compiler menerjemahkan tiap file menjadi file objek .o berisi kode mesin plus tabel simbol, lalu linker menyambung semua .o beserta pustaka menjadi satu program yang bisa dijalankan.\n\nDua error yang sering membingungkan ternyata datang dari tahap berbeda. `undefined reference to 'jumlah_array'` adalah pesan linker: deklarasinya ada, tapi definisinya tidak ditemukan di file objek mana pun, biasanya karena util.c lupa ikut dikompilasi. Sebaliknya `redefinition` adalah pesan compiler: satu file mendefinisikan hal yang sama dua kali.\n\nPerintah yang dipisah memberi kontrol penuh: `gcc -c util.c` hanya menghasilkan util.o tanpa menautkan, dan `gcc main.o util.o -o program` menyatukannya. Untuk tiga file pola ini terasa sepele; untuk tiga puluh file ia menjadi beban yang nanti diotomasi Makefile. Di platform ini latihan berjalan satu file, jadi tiga peran (header, util.c, main.c) disatukan dalam satu editor dengan pembatas komentar.",
          code: {
            language: "c",
            content:
              "/* gcc main.c util.c -o program */\n\n/* isi util.c: definisi */\nint jumlah_array(const int *data, int n) {\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total += data[i];\n    }\n    return total;\n}\n\n/* isi main.c: pemanggil, dengan deklarasi dari util.h */\n#include <stdio.h>\n\nint jumlah_array(const int *data, int n);\n\nint main(void) {\n    int data[] = {4, 10, 7};\n    printf(\"total %d\\n\", jumlah_array(data, 3));\n    return 0;\n}",
            caption: "Definisi di util.c, deklarasi di util.h, pemanggil di main.c.",
          },
        },
        {
          kind: "quiz",
          question:
            "Saat build muncul pesan `undefined reference to 'jumlah_array'`. Artinya...",
          options: [
            "jumlah_array tidak pernah dipanggil di main",
            "linker tidak menemukan definisi fungsi tersebut di file objek mana pun",
            "preprocessor gagal membentangkan #include",
            "jumlah_array didefinisikan dua kali",
          ],
          answer: 1,
          explanation:
            "Deklarasi cukup untuk lolos kompilasi, tapi linker butuh definisi yang sesungguhnya. Pesan ini lazim muncul karena file .c yang berisi definisinya tidak ikut dikompilasi.",
        },
        {
          kind: "code",
          title: "Satu file, tiga peran",
          prompt:
            "Ketiga peran multi-file disatukan dalam satu editor: bagian header berisi deklarasi, bagian util berisi definisi, dan main memanggilnya. Lengkapi tipe kembalian di prototipe, penjumlahan elemen, dan argumen pemanggilan. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n\n/* === isi util.h: deklarasi yang dilihat pemanggil === */\n___ jumlah_array(const int *data, int n);\n\n/* === isi util.c: definisi === */\nint jumlah_array(const int *data, int n) {\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total ___ data[i];\n    }\n    return total;\n}\n\n/* === isi main.c: pemanggil === */\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int data[64];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    printf(\"total %d\\n\", jumlah_array(___, n));\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n/* === isi util.h: deklarasi yang dilihat pemanggil === */\nint jumlah_array(const int *data, int n);\n\n/* === isi util.c: definisi === */\nint jumlah_array(const int *data, int n) {\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n        total += data[i];\n    }\n    return total;\n}\n\n/* === isi main.c: pemanggil === */\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    int data[64];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &data[i]);\n    }\n    printf(\"total %d\\n\", jumlah_array(data, n));\n    return 0;\n}",
          tests: [
            { stdin: "3\n4 10 7", expectedOutput: "total 21" },
            { stdin: "1\n5", expectedOutput: "total 5" },
            { stdin: "5\n1 2 3 4 5", expectedOutput: "total 15", hidden: true },
          ],
          hints: [
            "Prototipe di bagian header menyebut tipe kembalian fungsi, sama seperti definisinya.",
            "Menjumlahkan array berarti menambahkan tiap elemen ke total; operator penugasan gabungan meringkasnya.",
            "Blank pertama int, blank kedua +=, blank ketiga data.",
          ],
        },
      ],
    },
    {
      slug: "pp-header-deklarasi-definisi",
      title: "Header: Deklarasi vs Definisi",
      summary:
        "Taruh kontrak di header dan isi di file .c, termasuk aturan extern untuk variabel global.",
      steps: [
        {
          kind: "theory",
          title: "Header menjanjikan, .c menggenapi",
          body: "Aturan pembagian kerja yang membuat proyek multi-file sehat: header (.h) berisi deklarasi, yaitu janji bentuk; file .c berisi definisi, yaitu isi. Prototipe fungsi, typedef, struct, dan deklarasi extern boleh berulang di banyak file. Badan fungsi dan isi variabel hanya boleh ada satu di seluruh program.\n\nMasalah klasiknya variabel global di header. `int penghitung = 0;` yang ditulis di header dan di-include tiga file .c menghasilkan tiga definisi sekaligus, dan linker menolak programnya. Solusinya: header hanya berisi `extern int penghitung;` yang artinya \"variabel ini ada di tempat lain; di sini cuma janjinya\", sedangkan definisi `int penghitung = 0;` ditulis tepat satu kali di satu file .c.\n\nAturan yang sama berlaku untuk fungsi: prototipe boleh muncul di banyak file lewat header, definisi tetap satu. Menaruh badan fungsi di header yang di-include banyak .c membuat tiap file objek membawa salinannya sendiri dan linker protes duplicate symbol. Satu kalimat pengingatnya: header menjanjikan, .c menggenapi.",
          code: {
            language: "c",
            content:
              "/* penghitung.h */\nextern int penghitung;      /* deklarasi: janji */\nint ambil_penghitung(void); /* prototipe: janji */\n\n/* penghitung.c */\n#include \"penghitung.h\"\n\nint penghitung = 0;         /* definisi: satu-satunya */\n\nint ambil_penghitung(void) {\n    penghitung++;\n    return penghitung;\n}",
            caption: "extern di header, definisi tunggal di satu file .c.",
          },
        },
        {
          kind: "quiz",
          question:
            "Header berisi `int total = 0;` dan di-include oleh tiga file .c yang dikompilasi jadi satu program. Apa yang terjadi?",
          options: [
            "satu variabel total dipakai bersama oleh ketiganya",
            "tiap file .c mendefinisikan total sendiri dan linker menolak programnya",
            "compiler otomatis menambahkan extern",
            "total menjadi variabel lokal main",
          ],
          answer: 1,
          explanation:
            "Penggantian teks #include menyalin definisi ke ketiga file, sehingga ada tiga variabel global bernama sama. Solusinya extern di header dan definisi tunggal di satu .c.",
        },
        {
          kind: "code",
          title: "Global yang terbagi dengan benar",
          prompt:
            "Program mensimulasikan pasangan header dan .c untuk satu penghitung global. Lengkapi deklarasi extern di bagian header, definisinya di bagian .c, dan nilai yang dikembalikan fungsi. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n\n/* === bagian penghitung.h: hanya deklarasi === */\n___ int penghitung;\nint ambil_penghitung(void);\n\n/* === bagian penghitung.c: definisi === */\nint penghitung = ___;\n\nint ambil_penghitung(void) {\n    penghitung++;\n    return ___;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        ambil_penghitung();\n    }\n    printf(\"dipanggil %d kali\\n\", ambil_penghitung());\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n/* === bagian penghitung.h: hanya deklarasi === */\nextern int penghitung;\nint ambil_penghitung(void);\n\n/* === bagian penghitung.c: definisi === */\nint penghitung = 0;\n\nint ambil_penghitung(void) {\n    penghitung++;\n    return penghitung;\n}\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 0; i < n; i++) {\n        ambil_penghitung();\n    }\n    printf(\"dipanggil %d kali\\n\", ambil_penghitung());\n    return 0;\n}",
          tests: [
            { stdin: "2", expectedOutput: "dipanggil 3 kali" },
            { stdin: "5", expectedOutput: "dipanggil 6 kali" },
            { stdin: "0", expectedOutput: "dipanggil 1 kali", hidden: true },
          ],
          hints: [
            "Kata kunci yang menyatakan variabel didefinisikan di tempat lain, di sini hanya dijanjikan.",
            "Definisi tunggal variabel global diberi nilai awal nol secara eksplisit di bagian .c.",
            "Blank pertama extern, blank kedua 0, blank ketiga penghitung.",
          ],
        },
      ],
    },
    {
      slug: "pp-makefile",
      title: "Makefile Sederhana",
      summary:
        "Otomasi build dengan make: target, dependensi, dan resep yang hanya dijalankan saat perlu.",
      steps: [
        {
          kind: "theory",
          title: "Aturan build yang tahu kapan harus kerja",
          body: "Mengetik ulang gcc untuk sepuluh file melelahkan dan rawan salah urutan. make membaca Makefile yang berisi aturan: target (hasil yang diinginkan), dependensi (bahan yang dibutuhkan), dan resep (cara membuatnya). Perintah make mengurus urutan build, dan target pembantu seperti clean membersihkan hasil build.\n\nKecerdasan make ada di perbandingan waktu file. Kalau util.o lebih baru daripada util.c, make menganggapnya segar dan melewatinya; kalau main.c lebih baru daripada main.o, hanya main.c yang dikompilasi ulang, lalu program ditautkan kembali. Proyek besar jadi membangun ulang seperlunya, bukan semuanya dari nol setiap kali satu baris berubah.\n\nDua kebiasaan yang harus dibiasakan sejak awal: resep diawali karakter tab (spasi membuat make menolak dengan pesan missing separator), dan aturan pertama di file menjadi target default. Variabel CC = gcc dan CFLAGS = -Wall merapikan file yang makin panjang, dipakai lewat $(CC) dan $(CFLAGS). Di platform ini make tidak tersedia untuk dieksekusi, jadi lesson ini fokus membaca dan memahami strukturnya.",
          code: {
            language: "make",
            content:
              "CC = gcc\nCFLAGS = -Wall\n\nprogram: main.o util.o\n\t$(CC) main.o util.o -o program\n\nmain.o: main.c util.h\n\t$(CC) $(CFLAGS) -c main.c\n\nutil.o: util.c util.h\n\t$(CC) $(CFLAGS) -c util.c\n\nclean:\n\trm -f *.o program",
            caption: "program butuh dua .o; tiap .o butuh .c dan header yang sama.",
          },
        },
        {
          kind: "quiz",
          question:
            "util.c tidak diubah sejak build terakhir, tapi main.c baru diedit. Saat make dijalankan, apa yang dikompilasi ulang?",
          options: [
            "semua file .c dari nol",
            "hanya main.c, lalu program ditautkan ulang",
            "tidak ada yang dikompilasi",
            "hanya util.h",
          ],
          answer: 1,
          explanation:
            "make membandingkan waktu berkas: main.o lebih tua dari main.c sehingga dikompilasi ulang, util.o masih segar sehingga dilewati, dan program ditautkan kembali.",
        },
        {
          kind: "quiz",
          question: "make menolak Makefile dengan pesan missing separator. Penyebab paling sering adalah...",
          options: [
            "resep diawali spasi, padahal make mewajibkan karakter tab",
            "nama target harus huruf kapital",
            "ada terlalu banyak dependensi dalam satu aturan",
            "file Makefile harus disimpan sebagai make.txt",
          ],
          answer: 0,
          explanation:
            "make membedakan resep dari baris aturan lewat karakter tab di awal. Editor yang mengganti tab dengan spasi adalah penyebab error ini yang paling sering.",
        },
      ],
    },
    {
      slug: "pp-conditional-compilation",
      title: "Conditional Compilation",
      summary:
        "Nyalakan dan matikan potongan kode lewat #ifdef dan #if tanpa menghapus apa pun.",
      steps: [
        {
          kind: "theory",
          title: "Kode yang tidak lolos, seolah tak pernah ada",
          body: "Preprocessor juga bisa memilih kode mana yang sampai ke compiler. `#ifdef DEBUG` ... `#endif` menyertakan blok hanya saat makro DEBUG terdefinisi, sedangkan `#if VERSI >= 2` mengevaluasi ekspresi aritmetika makro saat preprocessing. Blok yang gugur tidak dikompilasi sama sekali: bukan dijalankan dengan skip, melainkan hilang dari file yang diteruskan.\n\nCara menyalakannya dua arah: `#define DEBUG 1` di header konfigurasi, atau lewat command line `gcc -DDEBUG main.c` yang lazim di kode nyata karena tidak menyentuh sumber. Kombinasi #elif dan #else mengatur lebih dari dua varian, misalnya perilaku berbeda per platform atau per tingkat fitur yang dibeli pengguna.\n\nKekuatannya juga bahayanya: terlalu banyak #if membuat jalur yang benar-benar aktif sulit dibaca dan sulit diuji. Gunakan untuk hal yang memang bervariasi antar lingkungan (debug, platform, fitur opsional) dan jaga tiap blok tetap kecil. Kalau kondisinya bisa dinilai saat program berjalan, percabangan if biasa hampir selalu lebih jelas.",
          code: {
            language: "c",
            content:
              "#include <stdio.h>\n\n#define DEBUG 1\n\nint main(void) {\n#ifdef DEBUG\n    printf(\"mode debug aktif\\n\");\n#endif\n#if DEBUG > 0\n    printf(\"level debug: %d\\n\", DEBUG);\n#else\n    printf(\"rilis bersih\\n\");\n#endif\n    return 0;\n}",
            caption: "Blok yang gugur tidak pernah sampai ke compiler.",
          },
        },
        {
          kind: "quiz",
          question:
            "Kode dikompilasi tanpa flag apa pun: `gcc main.c`. Baris mana yang masuk program?\n\n```c\n#ifdef CEPAT\n    printf(\"cepat\\n\");\n#else\n    printf(\"lambat\\n\");\n#endif\n```",
          options: ["cepat", "lambat", "keduanya", "error karena CEPAT tidak didefinisikan"],
          answer: 1,
          explanation:
            "Makro CEPAT tidak terdefinisi sehingga #ifdef gagal dan cabang #else yang lolos. Tidak ada error; makro yang belum didefinisikan dianggap tidak ada, bukan salah.",
        },
        {
          kind: "quiz",
          question: "Cara menyalakan makro DEBUG dari command line gcc adalah...",
          options: [
            "gcc --debug main.c",
            "gcc -DDEBUG main.c",
            "gcc #DEBUG main.c",
            "gcc -define DEBUG main.c",
          ],
          answer: 1,
          explanation:
            "Flag -DNAMA (bisa juga -DNAMA=nilai) mendefinisikan makro dari luar sumber. Inilah yang membuat satu sumber bisa dibangun dalam varian debug dan rilis.",
        },
      ],
    },
    {
      slug: "pp-predefined-macro",
      title: "Predefined Macro: __FILE__ dan __LINE__",
      summary:
        "Makro bawaan yang menyebut lokasi kode: fondasi pesan log dan makro assert.",
      steps: [
        {
          kind: "theory",
          title: "Lokasi yang tahu posisinya sendiri",
          body: "Beberapa makro sudah terdefinisi sebelum kode ditulis: __FILE__ melebar menjadi nama file saat ini, __LINE__ menjadi nomor baris tempat ia ditulis, __func__ (sejak C99) menjadi nama fungsi berjalan, dan __DATE__ plus __TIME__ mencatat waktu kompilasi. Semuanya melebar saat preprocessing, jadi nilainya pasti dan tidak ada biaya saat program berjalan.\n\nYang paling berguna adalah sifat __LINE__ yang berubah mengikuti posisi: satu makro yang sama di sepuluh baris berbeda menghasilkan sepuluh angka berbeda. Dari sini lahir makro log seperti `#define LOG(msg) printf(\"[%s:%d] %s\\n\", __FILE__, __LINE__, msg)`, dan makro assert di assert.h yang melaporkan kondisi gagal beserta file dan barisnya.\n\nKarena melebar sebagai teks, perhatikan tipenya: __LINE__ adalah int, sedangkan __FILE__ dan __func__ adalah string literal, jadi format printf-nya %d dan %s. Nama ditulis dengan dua garis bawah di depan dan belakang; salah ketik membuatnya menjadi variabel biasa, dan errornya muncul di tempat yang tidak terduga.",
          code: {
            language: "c",
            content:
              "#include <stdio.h>\n\nvoid kerja(void) {\n    printf(\"di %s baris %d fungsi %s\\n\", __FILE__, __LINE__, __func__);\n}\n\nint main(void) {\n    kerja();\n    printf(\"file %s baris %d\\n\", __FILE__, __LINE__);\n    return 0;\n}",
            caption: "Yang dicetak mengikuti tempat makro berada, bukan tempat ia didefinisikan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Tiga pemanggilan `printf(\"%d\\n\", __LINE__);` berada di baris 10, 11, dan 12. Keluarannya...",
          options: ["10 10 10", "12 12 12", "10 11 12", "angka acak tiap program dijalankan"],
          answer: 2,
          explanation:
            "__LINE__ melebar berdasarkan posisi baris tempat ia ditulis, jadi tiga pemanggilan di tiga baris menghasilkan 10, 11, dan 12.",
        },
        {
          kind: "quiz",
          question: "Specifier format yang tepat untuk mencetak __FILE__ adalah...",
          options: ["%d", "%s", "%zu", "%p"],
          answer: 1,
          explanation:
            "__FILE__ melebar menjadi string literal seperti \"main.c\", sehingga dicetak dengan %s. __LINE__ yang berupa int baru memakai %d.",
        },
      ],
    },
    {
      slug: "pp-static-linkage",
      title: "static dan Linkage Internal",
      summary:
        "Kunci fungsi dan variabel global agar milik satu file saja, dan alasan kenapa itu penting.",
      steps: [
        {
          kind: "theory",
          title: "Simbol yang tidak keluar dari rumah",
          body: "Kata static di depan fungsi atau variabel global mengubah jangkauannya di tingkat file: simbol itu menjadi milik file .c tempat ia didefinisikan (linkage internal), tak terlihat dari file lain meski di sana dideklarasikan extern. Tanpa static, setiap fungsi dan variabel global bisa dipakai dari mana saja, dan namanya harus unik di seluruh program.\n\nManfaatnya langsung terasa saat proyek membesar: dua file boleh sama-sama punya `static void bantu(void)` tanpa bertabrakan, dan detail internal satu file terlindungi dari pemakaian di luar kontraknya. Pola serupa dipakai di header berisi fungsi kecil: dibuat static supaya tiap file yang meng-include memperoleh salinannya sendiri tanpa memicu duplicate symbol saat ditautkan.\n\nJangan tertukar dengan static di dalam badan fungsi yang artinya lain: variabel lokal yang hidup terus antar pemanggilan. Ejaannya sama, posisinya yang membedakan makna; di tingkat file berarti privat, di dalam fungsi berarti persisten. Dari sini antarmuka sebuah modul terlihat jelas: fungsi publik tanpa static yang dijanjikan di header, sisanya disembunyikan.",
          code: {
            language: "c",
            content:
              "/* util.c */\nstatic int rahasia = 7;   /* privat: hanya util.c yang melihat */\n\nstatic void bantu(void) { /* privat: hanya dipanggil dari util.c */\n    rahasia++;\n}\n\nint hitung(void) {        /* publik: bebas dipanggil file lain */\n    bantu();\n    return rahasia;\n}",
            caption: "Dua simbol privat, satu publik; itulah antarmuka util.c.",
          },
        },
        {
          kind: "quiz",
          question:
            "file_a.c dan file_b.c sama-sama berisi `static int penghitung;` di tingkat file. Apa yang terjadi?",
          options: [
            "linker menolak karena nama variabel sama",
            "keduanya menjadi dua variabel berbeda yang masing-masing privat di filenya",
            "compiler memilih salah satu secara acak",
            "keduanya otomatis digabung menjadi satu variabel bersama",
          ],
          answer: 1,
          explanation:
            "Linkage internal membuat tiap penghitung hanya dikenal di file miliknya sendiri. Tanpa static, dua definisi global bernama sama justru bentrok saat ditautkan.",
        },
        {
          kind: "quiz",
          question: "`static int hitung = 0;` ditulis di dalam badan fungsi proses(). Artinya...",
          options: [
            "hitung hanya terlihat oleh file itu saja",
            "hitung hilang setiap kali proses() kembali",
            "hitung tetap hidup antar pemanggilan dan menyimpan nilai terakhirnya",
            "hitung hanya boleh diakses lewat pointer",
          ],
          answer: 2,
          explanation:
            "static di dalam fungsi berarti variabel lokal persisten: nilainya bertahan antar pemanggilan, meski jangkauannya tetap terbatas di fungsi itu. Arti ini berbeda dari static di tingkat file.",
        },
      ],
    },
    {
      slug: "pp-latihan-satufail-duaperan",
      title: "Latihan Gabungan: Satu File, Dua File",
      summary:
        "Rakit program ala multi-file dalam satu file: header berisi janji, .c berisi isi, main memanggil.",
      steps: [
        {
          kind: "theory",
          title: "Semua peran kembali ke satu editor",
          body: "Penutup modul memadatkan semuanya dalam satu file: bagian atas berperan sebagai segitiga.h yang hanya menjanjikan, bagian tengah sebagai segitiga.c yang menggenapi, dan main di bawah memanggil lewat deklarasi. Pada proyek nyata keduanya pisah file dan disatukan linker; di platform ini pembatas komentar menggantikan pemisahan filenya.\n\nPerhatikan urutannya: deklarasi muncul sebelum main supaya compiler mengetahui bentuk fungsi saat memeriksa pemanggilannya; definisi boleh berada di atas atau di bawah selama prototipenya sudah terbaca. Inilah alasan header ada. Tanpa prototipe, compiler menemukan pemanggilan sebelum definisi, mulai menebak bentuknya, dan protes dengan pesan yang membingungkan.\n\nProgram menghitung luas dan keliling segitiga sama kaki dari alas, tinggi, dan panjang sisi miringnya. Tiga blank yang harus diisi tersebar di tiga peran: satu di bagian janji, satu di bagian isi, dan satu di pemanggil. Kalau semua benar, bagian janji dan bagian isi akan persis berpadanan, seperti header dan .c yang dipisahkan linker di dunia nyata.",
          code: {
            language: "c",
            content:
              "/* segitiga.h */\ndouble luas_segitiga(double alas, double tinggi);\n\n/* segitiga.c */\ndouble luas_segitiga(double alas, double tinggi) {\n    return 0.5 * alas * tinggi;\n}\n\n/* main.c */\n/* printf(\"luas %.2f\\n\", luas_segitiga(10, 4)); -> 20.00 */",
            caption: "Janji di atas, isi di tengah, pemanggil di bawah; urutan inilah alasan header ada.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa prototipe luas_segitiga harus berada sebelum main?",
          options: [
            "agar linker tahu di file mana fungsi itu berada",
            "agar compiler mengetahui bentuk fungsi saat memeriksa pemanggilannya",
            "karena definisi fungsi dilarang berada di file yang sama dengan main",
            "agar fungsi dikompilasi lebih cepat",
          ],
          answer: 1,
          explanation:
            "Compiler membaca dari atas ke bawah. Tanpa deklarasi di depan, ia menemukan pemanggilan sebelum definisi dan harus menebak bentuk fungsinya, yang mudah berujung error.",
        },
        {
          kind: "code",
          title: "Program segitiga dua peran",
          prompt:
            "Lengkapi nama fungsi di bagian deklarasi, rumus luas di bagian definisi, dan pemanggilan keliling di main. Setelah lulus, coba baca ulang: bagian janji dan bagian isi berpadanan seperti header dan .c. Ganti ketiga `___`.",
          mode: "fill",
          template:
            "#include <stdio.h>\n\n/* === segitiga.h: deklarasi === */\ndouble ___(double alas, double tinggi);\ndouble keliling_segitiga(double a, double b, double c);\n\n/* === segitiga.c: definisi === */\ndouble luas_segitiga(double alas, double tinggi) {\n    return 0.5 * ___ * tinggi;\n}\n\ndouble keliling_segitiga(double a, double b, double c) {\n    return a + b + c;\n}\n\n/* === main.c: pemanggil === */\nint main(void) {\n    double a, t, s;\n    scanf(\"%lf %lf %lf\", &a, &t, &s);\n    printf(\"luas %.2f\\n\", luas_segitiga(a, t));\n    printf(\"keliling %.2f\\n\", ___(a, s, s));\n    return 0;\n}",
          solution:
            "#include <stdio.h>\n\n/* === segitiga.h: deklarasi === */\ndouble luas_segitiga(double alas, double tinggi);\ndouble keliling_segitiga(double a, double b, double c);\n\n/* === segitiga.c: definisi === */\ndouble luas_segitiga(double alas, double tinggi) {\n    return 0.5 * alas * tinggi;\n}\n\ndouble keliling_segitiga(double a, double b, double c) {\n    return a + b + c;\n}\n\n/* === main.c: pemanggil === */\nint main(void) {\n    double a, t, s;\n    scanf(\"%lf %lf %lf\", &a, &t, &s);\n    printf(\"luas %.2f\\n\", luas_segitiga(a, t));\n    printf(\"keliling %.2f\\n\", keliling_segitiga(a, s, s));\n    return 0;\n}",
          tests: [
            { stdin: "10 4 3", expectedOutput: "luas 20.00\nkeliling 16.00" },
            { stdin: "6 2 5", expectedOutput: "luas 6.00\nkeliling 16.00" },
            { stdin: "1 1 1", expectedOutput: "luas 0.50\nkeliling 3.00", hidden: true },
          ],
          hints: [
            "Bagian janji menyebut nama fungsi dan bentuk parameternya; tipe kembaliannya double.",
            "Luas segitiga: setengah kali alas kali tinggi.",
            "Blank pertama luas_segitiga, blank kedua alas, blank ketiga keliling_segitiga.",
          ],
        },
      ],
    },
  ],
};
