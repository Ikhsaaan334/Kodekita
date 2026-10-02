import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "c",
  moduleRange: [8, 9],
  modules: [
    {
      title: "File I/O",
      description: "fopen/fread/fwrite, file biner, EOF, dan penanganan error I/O.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description: "Parsing argv, struktur program besar, kebiasaan debugging, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: File I/O ====================
    {
      slug: "fio-fopen-mode",
      title: "fopen: Membuka File dengan Mode yang Tepat",
      summary: "Buka file dengan fopen, pahami mode r, w, dan a, serta kenapa cek NULL itu wajib.",
      steps: [
        {
          kind: "theory",
          title: "Semua input dan output lewat stream",
          body: "Sampai modul ini, semua data yang disentuh program hilang begitu proses selesai. File membuat data bertahan. Di C, pintu masuk dan keluar file adalah satu tipe bernama `FILE *`, sebuah stream yang dibuka dengan `fopen(nama_file, mode)` dan ditutup dengan `fclose`. Tiga stream justru sudah terbuka otomatis sejak program lahir: `stdin`, `stdout`, dan `stderr`. Artinya keahlian membaca file dan keahlian membaca input sebenarnya keahlian yang sama: yang berganti hanya stream-nya.\n\nMode menentukan apa yang boleh dilakukan dan dari mana mulainya. Mode `\"r\"` hanya membaca, dan gagal kalau file tidak ada. Mode `\"w\"` menulis dari awal dan menghapus isi lama, sekaligus membuat file baru bila belum ada. Mode `\"a\"` menambah di akhir tanpa menyentuh isi lama, mode andalan untuk log. Ada juga `\"r+\"`, `\"w+\"`, dan `\"a+\"` yang membuka dua arah, tapi tiga mode dasar sudah menutup sebagian besar kebutuhan sehari-hari.\n\n`fopen` bisa gagal: file tidak ada, izin kurang, atau path salah. Hasilnya saat itu `NULL`, dan memakainya langsung berarti crash. Kebiasaan wajibnya ada di contoh di bawah: buka, cek, pakai, tutup. Di platform ini judge hanya punya stdin dan stdout, jadi latihan kodenya membaca dari stdin; konsep buka dan tutupnya tetap dipakai penuh.",
          code: {
            language: "c",
            content: "FILE *f = fopen(\"data.txt\", \"r\");\nif (f == NULL) {\n    perror(\"data.txt\");\n    return 1;\n}\n/* baca lewat f, lalu tutup */\nfclose(f);",
            caption: "Pola wajib: buka, cek NULL, pakai, tutup.",
          },
        },
        {
          kind: "quiz",
          question: "Isi file `log.txt` sudah ada dan program hanya boleh menambah baris baru di bagian akhirnya. Mode fopen yang tepat?",
          options: ["\"r\"", "\"w\"", "\"a\"", "\"r+\""],
          answer: 2,
          explanation: "Mode \"a\" (append) mulai menulis di akhir file tanpa menghapus isi lama, dan membuat file baru bila belum ada. Mode \"w\" justru langsung mengosongkan file.",
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan fopen ketika file tidak bisa dibuka?",
          options: ["-1", "NULL", "0", "FILE kosong"],
          answer: 1,
          explanation: "fopen mengembalikan NULL saat gagal. Itu sebabnya cek `if (f == NULL)` wajib ada sebelum stream dipakai, karena memakai NULL langsung membuat program crash.",
        },
      ],
    },
    {
      slug: "fio-fgets-baris",
      title: "fgets: Membaca Baris dari Stream",
      summary: "Baca satu baris utuh dengan fgets, termasuk idiom membuang newline yang ikut tersimpan.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris utuh, spasi ikut",
          body: "`fgets(buffer, ukuran, stream)` membaca satu potongan baris: paling banyak `ukuran - 1` karakter, berhenti setelah newline, dan selalu menutup buffer dengan `'\\0'`. Dibanding `scanf(\"%s\")` yang berhenti di spasi, fgets menghabiskan satu baris utuh, spasi dan semua. Itu yang membuatnya cocok untuk nama lengkap atau kalimat.\n\nNilai baliknya juga informatif: alamat buffer yang sama saat berhasil, dan `NULL` saat stream sudah habis (EOF) atau terjadi error. Sifat inilah fondasi pola loop baca baris yang dipakai di hampir semua program C: `while (fgets(...) != NULL)`.\n\nSatu hal yang sering mengejutkan: newline `'\\n'` ikut tersimpan di buffer kalau masih muat. Saat hasilnya mau dibandingkan dengan `strcmp`, newline itu harus dibuang dulu. Idiom bakuannya `baris[strcspn(baris, \"\\n\")] = '\\0';`: strcspn mencari posisi newline, lalu baris dipotong di situ.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[64];\n    fgets(baris, sizeof baris, stdin);\n    baris[strcspn(baris, \"\\n\")] = '\\0';\n    printf(\"Baris: [%s]\\n\", baris);\n    return 0;\n}",
            caption: "fgets membaca dari stdin karena stdin juga sebuah stream.",
          },
        },
        {
          kind: "quiz",
          question: "Apakah karakter newline (`\\n`) ikut tersimpan di buffer hasil fgets?",
          options: [
            "Tidak, fgets selalu membuangnya",
            "Iya, ikut tersimpan kalau masih muat sebelum batas ukuran",
            "Hanya bila barisnya kosong",
            "fgets menggantinya dengan spasi",
          ],
          answer: 1,
          explanation: "fgets menyimpan newline bila muat dalam batas ukuran. Itulah kenapa sebelum dipakai untuk perbandingan, newline sering dipotong dengan idiom strcspn.",
        },
        {
          kind: "code",
          title: "Sapa pembaca lewat fgets",
          prompt: "Lengkapi dua blank: fungsi pembaca satu baris dari stream, dan fungsi dari string.h yang menemukan posisi newline agar bisa dipotong. Input satu baris nama, keluaran `Halo, <nama>!`.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[64];\n    ___(baris, sizeof baris, stdin);\n    baris[___(baris, \"\\n\")] = '\\0';\n    printf(\"Halo, %s!\\n\", baris);\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[64];\n    fgets(baris, sizeof baris, stdin);\n    baris[strcspn(baris, \"\\n\")] = '\\0';\n    printf(\"Halo, %s!\\n\", baris);\n    return 0;\n}",
          tests: [
            { stdin: "Sinta", expectedOutput: "Halo, Sinta!" },
            { stdin: "Bagas", expectedOutput: "Halo, Bagas!" },
            { stdin: "Rani Puspa", expectedOutput: "Halo, Rani Puspa!", hidden: true },
          ],
          hints: [
            "Fungsi pembaca satu baris dari stream bernama fgets, dan stream yang dipakai di sini adalah stdin.",
            "Fungsi dari string.h yang menghitung panjang awal tanpa karakter tertentu bernama strcspn.",
            "Blank pertama diisi fgets, blank kedua diisi strcspn.",
          ],
        },
      ],
    },
    {
      slug: "fio-fscanf-terformat",
      title: "fscanf dan sscanf: Membaca Terformat",
      summary: "Satu fungsi terformat untuk semua sumber: fscanf dari stream, sscanf dari string.",
      steps: [
        {
          kind: "theory",
          title: "scanf hanyalah fscanf dengan stdin",
          body: "`fscanf(stream, format, ...)` adalah bentuk umum dari scanf: `scanf(\"%d\", &x)` persis sama dengan `fscanf(stdin, \"%d\", &x)`. Begitu juga printf yang merupakan `fprintf` di stdout. Satu mesin pembaca, semua sumber data: file, stdin, atau string di memori.\n\nNilai balik fscanf penting: jumlah item yang berhasil dibaca. Format `\"%d %d\"` pada baris `7 12` mengembalikan 2. Kalau stream habis sebelum konversi pertama, hasilnya `EOF`. Mengecek nilai balik adalah cara paling murah mendeteksi input rusak sebelum dipakai dihitung.\n\nSaudaranya `sscanf` membaca dari string di memori, dan ia pasangan sempurna fgets: fgets mengambil satu baris, lalu sscanf membedah isinya. Pola dua langkah ini menghindari jebakan scanf yang meninggalkan sisa baris menganggur di stream.",
          code: {
            language: "c",
            content: "char baris[64];\nint jam, menit;\n\nif (fgets(baris, sizeof baris, stdin) != NULL) {\n    if (sscanf(baris, \"%d:%d\", &jam, &menit) == 2) {\n        printf(\"Pukul %d lewat %d menit\\n\", jam, menit);\n    }\n}",
            caption: "fgets mengambil baris, sscanf membedah isinya.",
          },
        },
        {
          kind: "quiz",
          question: "`fscanf(f, \"%d %d\", &a, &b)` dijalankan saat f menunjuk baris `7 12`. Nilai baliknya?",
          options: ["1", "2", "12", "EOF"],
          answer: 1,
          explanation: "fscanf mengembalikan jumlah item yang berhasil dibaca. Dua konversi berhasil, jadi nilainya 2. EOF hanya muncul bila stream habis sebelum konversi pertama.",
        },
        {
          kind: "code",
          title: "Baca barang dan harganya",
          prompt: "Lengkapi stream yang dipakai fscanf: program membaca nama barang dan harganya dari stdin, lalu mencetak `<barang>: Rp<harga>`. Bila input tidak lengkap, program sudah menanganinya dengan pesan sendiri.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    char barang[32];\n    int harga;\n    if (fscanf(___, \"%31s %d\", barang, &harga) != 2) {\n        printf(\"Input tidak lengkap\\n\");\n        return 1;\n    }\n    printf(\"%s: Rp%d\\n\", barang, harga);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    char barang[32];\n    int harga;\n    if (fscanf(stdin, \"%31s %d\", barang, &harga) != 2) {\n        printf(\"Input tidak lengkap\\n\");\n        return 1;\n    }\n    printf(\"%s: Rp%d\\n\", barang, harga);\n    return 0;\n}",
          tests: [
            { stdin: "Kopi 15000", expectedOutput: "Kopi: Rp15000" },
            { stdin: "Buku 48000", expectedOutput: "Buku: Rp48000" },
            { stdin: "Gula 12500", expectedOutput: "Gula: Rp12500", hidden: true },
          ],
          hints: [
            "scanf, fscanf, dan sscanf beda hanya di sumber datanya; yang membaca dari sebuah stream berawalan f.",
            "Stream input standar bernama stdin, sama seperti yang dipakai scanf.",
            "Blank satu-satunya diisi stdin.",
          ],
        },
      ],
    },
    {
      slug: "fio-fprintf-menulis",
      title: "fprintf: Menulis Terformat",
      summary: "Tulis terformat ke stream mana pun, pahami buffering, dan pisahkan error ke stderr.",
      steps: [
        {
          kind: "theory",
          title: "printf adalah fprintf di stdout",
          body: "`fprintf(stream, format, ...)` menulis teks terformat ke stream mana pun, dan printf hanyalah fprintf yang ditujukan ke stdout. Untuk file yang dibuka dengan mode `\"w\"` atau `\"a\"`, setiap panggilan menambah teks terformat ke stream itu, sehingga laporan dan log tinggal dirakit baris demi baris.\n\nPenulisan dibuffer: teks dikumpulkan dulu di memori, lalu benar-benar ditulis saat buffer penuh, saat `fclose`, atau saat diminta dengan `fflush`. Karena itu lupa fclose bukan cuma boros resource: bagian akhir data bisa jadi tidak pernah sampai ke file.\n\nAda satu stream lagi yang terbuka otomatis: `stderr`, tempat resmi pesan error. Memisahkan error dari data itu berguna nyata: program yang mengirim laporan ke file tetap bisa meneriakkan masalahnya ke layar, dan perintah shell seperti `./prog > hasil.txt` tidak ikut menelan pesan errornya ke dalam hasil.",
          code: {
            language: "c",
            content: "FILE *log = fopen(\"aktifitas.log\", \"a\");\nif (log != NULL) {\n    fprintf(log, \"Program selesai dengan rapi\\n\");\n    fclose(log);\n}\nfprintf(stderr, \"Peringatan: disk hampir penuh\\n\");",
            caption: "Data menulis ke file, keluhan menulis ke stderr.",
          },
        },
        {
          kind: "quiz",
          question: "Program menghasilkan laporan ke stdout sambil kadang perlu memberi peringatan. Ke mana peringatan itu sebaiknya ditulis?",
          options: ["stdout saja, dicampur dengan data", "stderr, supaya terpisah dari data", "wajib ke file error.txt", "tidak perlu ditulis"],
          answer: 1,
          explanation: "stderr adalah stream khusus pesan error. Dengan memisahkannya, pengalihan seperti ./prog > hasil.txt tetap berisi data bersih sementara error muncul di layar.",
        },
        {
          kind: "quiz",
          question: "Sebelum fclose dipanggil, teks yang sudah ditulis fprintf sebenarnya baru berada di...",
          options: ["file tujuan", "buffer di memori", "stdin", "register prosesor"],
          answer: 1,
          explanation: "stdio membuffer penulisan di memori demi kecepatan. Isi buffer baru sampai ke file saat buffer penuh, saat fclose, atau saat fflush dipanggil.",
        },
      ],
    },
    {
      slug: "fio-fread-fwrite-biner",
      title: "File Biner dengan fread dan fwrite",
      summary: "Salin isi memori apa adanya dengan fwrite dan baca balik dengan fread.",
      steps: [
        {
          kind: "theory",
          title: "Menyalin memori, bukan menulis teks",
          body: "File teks berisi byte yang menggambarkan karakter. File biner lain ceritanya: ia menyimpan isi memori apa adanya. Untuk menyimpan struct, `fwrite(&rekaman, sizeof rekaman, 1, f)` menyalin `sizeof` byte dari alamat itu ke file, dan `fread` membaca balik dengan pola yang persis sama. Satu baris menyalin satu rekaman utuh, tanpa format apa pun.\n\nParameternya berurutan: alamat sumber atau tujuan, ukuran satu item, jumlah item, dan stream. Nilai baliknya adalah jumlah item yang berhasil diproses. `fwrite` yang meminta satu item dan mengembalikan 0 berarti penulisan gagal, misalnya disk penuh; nilai balik ini layak dicek, bukan diabaikan.\n\nCatatan portabilitas: byte mentah ikut membawa padding struct dan urutan byte khas mesin, jadi file biner buatan program di satu mesin belum tentu cocok dibaca mesin lain. Untuk data yang menyeberang mesin, format teks atau format eksplisit lebih aman. Untuk cache dan berkas privat program, biner paling ringkas dan cepat.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n\ntypedef struct {\n    int x;\n    int y;\n} Titik;\n\nint main(void) {\n    Titik t = {3, 4};\n    FILE *f = fopen(\"titik.bin\", \"wb\");\n    if (f == NULL) return 1;\n    fwrite(&t, sizeof t, 1, f);\n    fclose(f);\n    return 0;\n}",
            caption: "sizeof t byte tersalin apa adanya ke titik.bin.",
          },
        },
        {
          kind: "quiz",
          question: "`fwrite(&p, sizeof p, 1, f)` mengembalikan 0 padahal diminta menulis 1 item. Artinya?",
          options: ["Satu item tertulis dengan sukses", "Tidak ada item yang berhasil tertulis", "Ukuran p adalah nol", "File pasti penuh"],
          answer: 1,
          explanation: "Nilai balik fwrite adalah jumlah item yang berhasil ditulis. Nol berarti gagal menulis, dan kegagalan seperti itu sebaiknya dilaporkan, bukan diabaikan.",
        },
        {
          kind: "quiz",
          question: "Fungsi yang menyalin isi memori sebuah struct ke file biner adalah...",
          options: ["fprintf", "fwrite", "fputs", "fseek"],
          answer: 1,
          explanation: "fwrite menyalin byte dari memori ke stream apa adanya. fprintf dan fputs menulis teks terformat, dan fseek hanya memindahkan posisi baca tulis.",
        },
      ],
    },
    {
      slug: "fio-eof-feof",
      title: "EOF dan feof: Membaca Sampai Habis dengan Benar",
      summary: "Kenali tanda habisnya stream dan hindari jebakan while (!feof(f)).",
      steps: [
        {
          kind: "theory",
          title: "EOF adalah hasil baca, bukan ramalan",
          body: "`EOF` adalah konstanta bernilai -1 dari stdio.h, dikembalikan `fgetc` dan `getchar` saat stream habis. fgets dan fscanf menandai hal yang sama lewat cara mereka sendiri: NULL dan jumlah item yang kurang. Prinsipnya satu: hasil baca dulu yang dicek, baru status stream ditanya.\n\n`feof(f)` menjawab pertanyaan \"apakah pembacaan terakhir gagal karena stream habis?\" Ia belum bernilai benar sebelum ada upaya baca yang gagal. Karena itu `while (!feof(f))` klasik itu salah: pada pengecekan sebelum bacaan terakhir feof masih nol, program tetap membaca, dan item terakhir terproses dua kali. Bug ini tidak terlihat saat kompilasi dan baru ketahuan dari keluaran yang menggandakan data.\n\nPola yang benar menaruh pembacaan langsung di kondisi loop: `while (fgets(baris, sizeof baris, f) != NULL)`. Setelah loop selesai, feof baru berguna untuk membedakan sebab berhenti: habis karena akhir file (feof benar) atau karena error (ferror benar).",
          code: {
            language: "c",
            content: "char baris[128];\n\n/* benar: cek hasil baca di kondisi loop */\nwhile (fgets(baris, sizeof baris, stdin) != NULL) {\n    proses(baris);\n}\n\n/* salah: item terakhir terproses dua kali */\n/* while (!feof(stdin)) { fgets(...); proses(...); } */",
            caption: "Hasil baca dulu dicek, feof baru ditanya setelahnya.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa pola `while (!feof(f)) { fread(...); proses(); }` dianggap salah?",
          options: [
            "feof hanya berlaku untuk file teks",
            "feof baru bernilai benar setelah ada bacaan yang gagal, sehingga item terakhir terproses dua kali",
            "feof selalu bernilai benar di awal file",
            "Tidak salah, itu idiom baku yang direkomendasikan",
          ],
          answer: 1,
          explanation: "feof melaporkan hasil bacaan yang sudah terjadi, bukan masa depan. Sebelum bacaan gagal karena habis, feof masih nol, sehingga loop memproses data yang sudah habis sekali lagi.",
        },
        {
          kind: "code",
          title: "Hitung baris sampai habis",
          prompt: "Lengkapi fungsi pembaca di kondisi while: program menghitung banyaknya baris di stdin sampai habis, lalu mencetak `<jumlah> baris`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    char baris[128];\n    int jumlah = 0;\n    while (___(baris, sizeof baris, stdin) != NULL) {\n        jumlah = jumlah + 1;\n    }\n    printf(\"%d baris\\n\", jumlah);\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    char baris[128];\n    int jumlah = 0;\n    while (fgets(baris, sizeof baris, stdin) != NULL) {\n        jumlah = jumlah + 1;\n    }\n    printf(\"%d baris\\n\", jumlah);\n    return 0;\n}",
          tests: [
            { stdin: "satu\ndua\ntiga", expectedOutput: "3 baris" },
            { stdin: "hanya ini", expectedOutput: "1 baris" },
            { stdin: "a\nb\nc\nd\ne", expectedOutput: "5 baris", hidden: true },
          ],
          hints: [
            "Kondisi while memanggil fungsi pembaca baris dan membandingkan hasilnya dengan NULL.",
            "Fungsi yang dimaksud adalah fgets: dia mengembalikan NULL saat stream habis.",
            "Blank diisi fgets.",
          ],
        },
      ],
    },
    {
      slug: "fio-error-null-perror",
      title: "Saat fopen Gagal: NULL dan perror",
      summary: "Perlakukan kegagalan fopen sebagai jalur normal: cek NULL, laporkan dengan perror, keluar rapi.",
      steps: [
        {
          kind: "theory",
          title: "Gagal buka file itu biasa",
          body: "Kegagalan `fopen` itu normal, bukan kejadian langka: path salah ketik, file dipindah orang lain, izin tidak cukup. Program yang tangguh memperlakukannya sebagai jalur eksekusi biasa: cek `NULL`, laporkan penyebabnya, lalu keluar dengan exit code tidak nol. Yang tidak boleh adalah lanjut memakai `NULL` seolah itu file, karena baris baca pertama akan menjatuhkan program.\n\n`perror(\"teks\")` adalah pelapor yang paling hemat tenaga: ia mencetak teks, titik dua, lalu deskripsi kesalahan sistem terakhir (dari variabel `errno`) ke stderr. Untuk file yang tidak ada, hasilnya kira-kira `data.txt: No such file or directory`. Tanpa perror, pembaca log hanya tahu programnya gagal, tidak tahu kenapa.\n\nKarena judge di platform ini hanya melihat stdout, latihan di bawah mensimulasikan keputusan itu: nama file dibaca dari stdin, program memutuskan berhasil atau gagal, lalu melaporkannya ke stdout. Bentuk keputusannya sama persis dengan cek NULL pada fopen sungguhan.",
          code: {
            language: "c",
            content: "FILE *f = fopen(path, \"r\");\nif (f == NULL) {\n    perror(path);\n    return 1;\n}",
            caption: "perror melengkapi pesan dengan alasan dari errno.",
          },
        },
        {
          kind: "quiz",
          question: "Ke stream mana perror menulis pesannya?",
          options: ["stdout", "stderr", "file errno.txt", "perror tidak menulis apa pun"],
          answer: 1,
          explanation: "perror menulis ke stderr karena isinya adalah pesan error, bukan data. Keluaran data program tetap bersih di stdout.",
        },
        {
          kind: "code",
          title: "Buka file atau laporkan gagal",
          prompt: "Lengkapi dua blank di syarat keberhasilan: fungsi pembanding isi string dan operator `sama dengan nol`. Input satu kata nama file; hanya `data.txt` yang dianggap ada, sisanya dilaporkan gagal.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char nama[64];\n    scanf(\"%63s\", nama);\n    /* simulasi: di judge hanya \"data.txt\" yang dianggap ada */\n    if (___(nama, \"data.txt\") ___ 0) {\n        printf(\"File dibuka\\n\");\n    } else {\n        printf(\"Gagal: %s\\n\", nama);\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char nama[64];\n    scanf(\"%63s\", nama);\n    /* simulasi: di judge hanya \"data.txt\" yang dianggap ada */\n    if (strcmp(nama, \"data.txt\") == 0) {\n        printf(\"File dibuka\\n\");\n    } else {\n        printf(\"Gagal: %s\\n\", nama);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "data.txt", expectedOutput: "File dibuka" },
            { stdin: "hilang.txt", expectedOutput: "Gagal: hilang.txt" },
            { stdin: "/tmp/rahasia", expectedOutput: "Gagal: /tmp/rahasia", hidden: true },
          ],
          hints: [
            "Membandingkan isi dua string memakai fungsi dari string.h, dan hasilnya dibandingkan dengan nol.",
            "Fungsi itu strcmp, dan kesamaan ditandai hasil == 0.",
            "Blank pertama diisi strcmp, blank kedua diisi ==.",
          ],
        },
      ],
    },
    {
      slug: "fio-fseek-ftell",
      title: "fseek dan ftell: Posisi di Dalam File",
      summary: "Pindahkan posisi baca tulis dengan fseek dan tanya posisi dengan ftell, termasuk pola mengukur ukuran file.",
      steps: [
        {
          kind: "theory",
          title: "Dari baca berurutan ke akses acak",
          body: "Setiap stream punya penanda posisi: titik byte berikutnya yang akan dibaca atau ditulis. Pembacaan biasa maju terus dari depan ke belakang. `fseek` memindahkan penanda itu, dan kemampuan ini membuka akses acak: melompat ke tengah file tanpa membaca semua yang di depannya.\n\nBentuk panggilannya `fseek(f, offset, asal)` dengan tiga pilihan asal: `SEEK_SET` dihitung dari awal file, `SEEK_CUR` dari posisi sekarang, dan `SEEK_END` dari akhir. Pasangannya `ftell(f)` melaporkan posisi sekarang dalam tipe `long`, dan `rewind(f)` mengembalikan penanda ke awal file.\n\nPola paling terkenal dari duo ini adalah mengukur ukuran file: fseek ke akhir, ftell memberi jumlah byte, lalu fseek kembali ke awal. Setelah ukurannya diketahui, membaca seluruh file bisa direncanakan: malloc seukuran hasil ftell, lalu fread sekali jalan. Pola ini akan sering kamu temui di kode nyata.",
          code: {
            language: "c",
            content: "FILE *f = fopen(\"data.bin\", \"rb\");\nif (f != NULL) {\n    fseek(f, 0, SEEK_END);\n    long ukuran = ftell(f);\n    fseek(f, 0, SEEK_SET);\n    printf(\"Ukuran: %ld byte\\n\", ukuran);\n    fclose(f);\n}",
            caption: "Pola ukur file: ke akhir, tanya posisi, kembali ke awal.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `fseek(f, 0, SEEK_END);` pada file berukuran 1024 byte, apa nilai `ftell(f)`?",
          options: ["0", "1", "1023", "1024"],
          answer: 3,
          explanation: "Penanda posisi berada tepat di akhir file, yaitu setelah byte ke-1024. ftell melaporkan jarak dari awal, jadi 1024. Pola inilah cara termudah mengukur ukuran file.",
        },
        {
          kind: "quiz",
          question: "Fungsi yang mengembalikan posisi byte penanda baca tulis saat ini adalah...",
          options: ["fseek", "ftell", "rewind", "fopen"],
          answer: 1,
          explanation: "ftell melaporkan posisi sekarang sebagai long. fseek yang memindahkan, rewind yang mengembalikan ke awal, dan fopen yang membuka file.",
        },
      ],
    },
    {
      slug: "fio-csv-parser",
      title: "Parser CSV Mini",
      summary: "Bedah baris CSV dengan fgets dan scanset sscanf, lengkap dengan penjaga untuk baris rusak.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris, dua kolom, satu koma",
          body: "CSV menyimpan tabel dalam teks polos: satu baris satu rekaman, kolom dipisah koma, misalnya `Buku,15000`. Resep membacanya di C sudah kamu pegang semua bahan bakunya: fgets mengambil baris, lalu sscanf membedah isinya.\n\nKunci pemecah kolom adalah scanset: `%31[^,]` berarti baca paling banyak 31 karakter selama karakternya bukan koma. Ditulis utuh, formatnya `\"%31[^,],%d\"`: nama sampai koma, koma literal sebagai pemisah, lalu satu bilangan. Angka 31 membatasi panjang agar buffer aman, dan newline sisa baris sudah dibuang strcspn sebelumnya.\n\nNilai balik sscanf kembali berperan sebagai satpam: baris rusak yang hanya menghasilkan satu item atau nol tidak lolos cek `== 2`, dan baris seperti itu dilewati daripada dipercaya. Alternatif lain adalah memecah baris dengan strtok, tapi scanset lebih ringkas untuk struktur tetap seperti ini.",
          code: {
            language: "c",
            content: "char baris[128], nama[32];\nint harga;\n\n/* baris: \"Buku,15000\" */\nif (sscanf(baris, \"%31[^,],%d\", nama, &harga) == 2) {\n    printf(\"%s: Rp%d\\n\", nama, harga);\n}",
            caption: "%31[^,] membaca nama sampai koma, %d membaca harganya.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam format `%31[^,]`, tanda `^` di dalam kurung siku berarti...",
          options: ["awal baris", "baca selama karakter TIDAK termasuk daftar di dalam kurung", "negasi bilangan", "penanda komentar"],
          answer: 1,
          explanation: "Scanset %[^,] membaca terus selama karakternya bukan koma, dan berhenti tepat sebelum koma. Angka 31 membatasi panjangnya agar tidak meluber.",
        },
        {
          kind: "code",
          title: "Bedah daftar belanja CSV",
          prompt: "Lengkapi dua blank: format sscanf yang memecah `nama,harga` (nama sampai koma, lalu bilangan), dan pembanding yang memastikan dua kolom terbaca. Setiap baris valid dicetak, lalu baris akhir merangkum total harga.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[128];\n    char nama[32];\n    int harga;\n    long total = 0;\n    while (fgets(baris, sizeof baris, stdin) != NULL) {\n        baris[strcspn(baris, \"\\n\")] = '\\0';\n        if (sscanf(baris, \"___\", nama, &harga) ___ 2) {\n            printf(\"%s: Rp%d\\n\", nama, harga);\n            total = total + harga;\n        }\n    }\n    printf(\"Total: Rp%ld\\n\", total);\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[128];\n    char nama[32];\n    int harga;\n    long total = 0;\n    while (fgets(baris, sizeof baris, stdin) != NULL) {\n        baris[strcspn(baris, \"\\n\")] = '\\0';\n        if (sscanf(baris, \"%31[^,],%d\", nama, &harga) == 2) {\n            printf(\"%s: Rp%d\\n\", nama, harga);\n            total = total + harga;\n        }\n    }\n    printf(\"Total: Rp%ld\\n\", total);\n    return 0;\n}",
          tests: [
            { stdin: "Buku,15000\nPensil,3000", expectedOutput: "Buku: Rp15000\nPensil: Rp3000\nTotal: Rp18000" },
            { stdin: "Kopi,8000", expectedOutput: "Kopi: Rp8000\nTotal: Rp8000" },
            { stdin: "Gula,12000\nTeh,4000\nRoti,9000", expectedOutput: "Gula: Rp12000\nTeh: Rp4000\nRoti: Rp9000\nTotal: Rp25000", hidden: true },
          ],
          hints: [
            "Scanset %[...] membaca karakter selama tidak ada yang termasuk daftarnya; tanda ^ di depan berarti bukan.",
            "Format lengkapnya: nama sampai koma, koma literal, lalu bilangan bulat, ditulis %31[^,],%d.",
            "sscanf mengembalikan jumlah item yang terbaca, jadi pembandingnya == 2.",
          ],
        },
      ],
    },
    {
      slug: "fio-latihan-log-analyzer",
      title: "Latihan Gabungan: Analis Log",
      summary: "Gabungkan fgets, parsing, dan agregasi jadi penghitung level log yang utuh.",
      steps: [
        {
          kind: "theory",
          title: "Dari baris mentah jadi ringkasan",
          body: "Tugas lapangan yang paling sering muncul: membaca ratusan baris log dan merangkumnya. Format baris di latihan ini sederhana: `LEVEL pesan`, dengan LEVEL salah satu dari INFO, WARN, atau ERROR, misalnya `WARN memori 80 persen`.\n\nResepnya gabungan semua yang sudah kamu latih di modul ini: loop fgets sampai NULL, sscanf untuk mengambil kata pertama, penghitung per level, lalu ringkasan di akhir. Program semacam ini di dunia nyata hanya bertambah fitur: filter tanggal, ambang alarm, keluaran CSV. Kerangkanya tidak berubah.\n\nTemplate di latihan sudah hampir jadi, tapi mengandung satu kesalahan klasik yang lolos kompilasi (di sebagian compiler hanya muncul sebagai warning): membandingkan isi string dengan `==`. Temuan seperti inilah yang nanti di modul berikutnya akan kita buru lewat warning compiler.",
          code: {
            language: "c",
            content: "/* baris log: \"ERROR koneksi gagal\" */\nchar baris[128], level[16];\nfgets(baris, sizeof baris, stdin);\nsscanf(baris, \"%15s\", level);\n/* level sekarang berisi \"ERROR\" */",
            caption: "Kata pertama baris log adalah levelnya.",
          },
        },
        {
          kind: "quiz",
          question: "Ekspresi `level == \"INFO\"` dengan level berupa `char level[16]` sebenarnya membandingkan...",
          options: ["isi kedua string", "alamat kedua string", "panjang kedua string", "huruf pertama kedua string"],
          answer: 1,
          explanation: "Nama array meluruh jadi alamat, dan string literal juga alamat, jadi == membandingkan alamat dua memori berbeda. Isi string dibandingkan dengan strcmp.",
        },
        {
          kind: "code",
          title: "Perbaiki penghitung level log",
          prompt: "Program penghitung level log ini dikompilasi tanpa error, tapi INFO tidak pernah terhitung padahal barisnya ada. Cari satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[128];\n    char level[16];\n    int info = 0, warn = 0, error = 0;\n    while (fgets(baris, sizeof baris, stdin) != NULL) {\n        sscanf(baris, \"%15s\", level);\n        if (level == \"INFO\") {\n            info = info + 1;\n        } else if (strcmp(level, \"WARN\") == 0) {\n            warn = warn + 1;\n        } else if (strcmp(level, \"ERROR\") == 0) {\n            error = error + 1;\n        }\n    }\n    printf(\"INFO: %d\\n\", info);\n    printf(\"WARN: %d\\n\", warn);\n    printf(\"ERROR: %d\\n\", error);\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char baris[128];\n    char level[16];\n    int info = 0, warn = 0, error = 0;\n    while (fgets(baris, sizeof baris, stdin) != NULL) {\n        sscanf(baris, \"%15s\", level);\n        if (strcmp(level, \"INFO\") == 0) {\n            info = info + 1;\n        } else if (strcmp(level, \"WARN\") == 0) {\n            warn = warn + 1;\n        } else if (strcmp(level, \"ERROR\") == 0) {\n            error = error + 1;\n        }\n    }\n    printf(\"INFO: %d\\n\", info);\n    printf(\"WARN: %d\\n\", warn);\n    printf(\"ERROR: %d\\n\", error);\n    return 0;\n}",
          tests: [
            { stdin: "INFO server start\nWARN memori 80 persen\nERROR koneksi gagal\nINFO request ok\nERROR timeout", expectedOutput: "INFO: 2\nWARN: 1\nERROR: 2" },
            { stdin: "ERROR koneksi mati", expectedOutput: "INFO: 0\nWARN: 0\nERROR: 1" },
            { stdin: "INFO a\nINFO b\nWARN c\nERROR d\nINFO e\nWARN f", expectedOutput: "INFO: 3\nWARN: 2\nERROR: 1", hidden: true },
          ],
          hints: [
            "Tanda == pada dua string membandingkan alamatnya, bukan isinya, sehingga hasilnya tidak pernah sama.",
            "Isi string dibandingkan dengan strcmp dan hasilnya dicek == 0, seperti yang sudah dilakukan pada WARN dan ERROR.",
            "Ganti syarat pertama menjadi strcmp(level, \"INFO\") == 0.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "lap-argv-parsing",
      title: "Argumen Baris Perintah: argc dan argv",
      summary: "Terima argumen lewat argc dan argv, konversi dengan aman, dan cek dulu sebelum memakai.",
      steps: [
        {
          kind: "theory",
          title: "Kata-kata yang menyertai program",
          body: "Program CLI menerima argumen lewat parameter main: `int main(int argc, char *argv[])`. argc menghitung jumlah kata, argv adalah array string: `argv[0]` berisi nama program seperti saat dipanggil, `argv[1]` dan seterusnya berisi argumennya. Perintah `./tool kuadrat 9` punya argc 3, dengan argv[1] berisi \"kuadrat\" dan argv[2] berisi \"9\".\n\nSemua argv berbentuk string, jadi angka harus dikonversi: `atoi` untuk yang ringkas, atau `strtol` yang bisa melaporkan kegagalan konversi. Sebelum menyentuh `argv[i]`, cek dulu `argc`: membaca melebihi argc berarti membaca alamat liar, dan ini sumber crash paling klasik di program CLI pemula.\n\nJudge di platform ini tidak meneruskan argv, jadi latihannya mensimulasikannya: satu baris stdin dibaca lalu dipecah dengan strtok menjadi token-token yang disimpan di array, seperti yang dilakukan shell sebelum meneruskan argv. Logika pengecekannya identik dengan program CLI sungguhan.",
          code: {
            language: "c",
            content: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    if (argc < 2) {\n        printf(\"Pemakaian: %s <angka>\\n\", argv[0]);\n        return 2;\n    }\n    printf(\"%d\\n\", atoi(argv[1]) * 2);\n    return 0;\n}",
            caption: "Cek argc dulu, baru sentuh argv.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk pemanggilan `./tool data.txt -v`, berapa nilai argc dan apa isi argv[0]?",
          options: ["2 dan data.txt", "3 dan ./tool", "3 dan tool", "2 dan ./tool"],
          answer: 1,
          explanation: "argv[0] adalah nama program seperti saat dipanggil, yaitu ./tool. Argumennya dua kata, jadi total argc = 3.",
        },
        {
          kind: "code",
          title: "Simulasi argc dan argv",
          prompt: "Lengkapi dua blank: batas minimal jumlah argumen sebelum program menolak, dan fungsi pengubah string ke bilangan. Input satu baris menirukan baris perintah: kata pertama adalah nama program `kuadrat`, kata kedua angkanya. Tanpa argumen, program mencetak petunjuk pemakaian.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main(void) {\n    char baris[128];\n    char *arg[16];\n    int n = 0;\n    fgets(baris, sizeof baris, stdin);\n    baris[strcspn(baris, \"\\n\")] = '\\0';\n    char *token = strtok(baris, \" \");\n    while (token != NULL) {\n        arg[n] = token;\n        n = n + 1;\n        token = strtok(NULL, \" \");\n    }\n    if (n < ___) {\n        printf(\"Pemakaian: kuadrat <angka>\\n\");\n    } else {\n        int angka = ___(arg[1]);\n        printf(\"%d\\n\", angka * angka);\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main(void) {\n    char baris[128];\n    char *arg[16];\n    int n = 0;\n    fgets(baris, sizeof baris, stdin);\n    baris[strcspn(baris, \"\\n\")] = '\\0';\n    char *token = strtok(baris, \" \");\n    while (token != NULL) {\n        arg[n] = token;\n        n = n + 1;\n        token = strtok(NULL, \" \");\n    }\n    if (n < 2) {\n        printf(\"Pemakaian: kuadrat <angka>\\n\");\n    } else {\n        int angka = atoi(arg[1]);\n        printf(\"%d\\n\", angka * angka);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "kuadrat 9", expectedOutput: "81" },
            { stdin: "kuadrat", expectedOutput: "Pemakaian: kuadrat <angka>" },
            { stdin: "kuadrat -5", expectedOutput: "25", hidden: true },
          ],
          hints: [
            "Perintah ini butuh satu argumen di belakang nama program, jadi jumlah token minimal ada dua.",
            "Argumen argv berbentuk string; untuk mengubahnya jadi bilangan, stdlib menyediakan atoi.",
            "Blank pertama diisi 2, blank kedua diisi atoi.",
          ],
        },
      ],
    },
    {
      slug: "lap-exit-code",
      title: "Exit Code: Angka yang Dibaca Script",
      summary: "Bicara ke script dengan exit code: nol sukses, selain nol gagal.",
      steps: [
        {
          kind: "theory",
          title: "Pesan terakhir yang berupa angka",
          body: "Program yang selesai meninggalkan satu angka: exit code. `return` dari main dan `exit(n)` sama-sama mengirimkannya ke pemanggil. Konvensinya tegas: 0 berarti sukses, selain nol berarti gagal. Shell menyimpan angka ini, misalnya `$?` di bash, dan script memakainya untuk memutuskan langkah berikutnya: lanjut, ulangi, atau berhenti.\n\nAngka gagal sebaiknya konsisten dan bermakna: 1 untuk kegagalan umum, 2 untuk salah pemakaian adalah kebiasaan yang lazim, dan kode lain diberi arti khusus oleh programnya. Yang paling penting: kegagalan tidak boleh menyamar sebagai 0, karena pipeline hanya melihat angka ini, bukan teks yang sempat dicetak.\n\nKebiasaan baiknya: setiap jalur error di fungsi mengembalikan kode yang berbeda, dan main meneruskannya dengan return. Latihan di bawah melatih keputusan itu: skenario dibaca dari stdin, fungsi mengembalikan kode yang semestinya, dan main mencetaknya karena judge hanya melihat stdout.",
          code: {
            language: "c",
            content: "FILE *f = fopen(nama, \"r\");\nif (f == NULL) {\n    perror(nama);\n    return 1; /* gagal umum */\n}\nif (argc < 3) {\n    fprintf(stderr, \"Pemakaian: %s <in> <out>\\n\", argv[0]);\n    return 2; /* salah pemakaian */\n}\n/* kerjakan, lalu */\nreturn 0;",
            caption: "Kode berbeda untuk sebab gagal yang berbeda.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut konvensi, exit code yang menandakan program berhasil adalah...",
          options: ["0", "1", "-1", "255"],
          answer: 0,
          explanation: "Nol berarti sukses di hampir semua sistem dan semua shell. Angka selain nol dibaca pemanggil sebagai tanda gagal, dengan arti detailnya ditentukan program itu sendiri.",
        },
        {
          kind: "code",
          title: "Tentukan exit code yang semestinya",
          prompt: "Lengkapi tiga return di fungsi exit_untuk sesuai konvensi: sukses, gagal umum (file tidak ada), dan salah pemakaian. Input satu kata skenario, keluaran `Exit code: <nilai>`.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n\nint exit_untuk(const char *skenario) {\n    if (strcmp(skenario, \"ok\") == 0) {\n        return ___;\n    }\n    if (strcmp(skenario, \"tidak_ada\") == 0) {\n        return ___;\n    }\n    return ___;\n}\n\nint main(void) {\n    char skenario[32];\n    scanf(\"%31s\", skenario);\n    printf(\"Exit code: %d\\n\", exit_untuk(skenario));\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint exit_untuk(const char *skenario) {\n    if (strcmp(skenario, \"ok\") == 0) {\n        return 0;\n    }\n    if (strcmp(skenario, \"tidak_ada\") == 0) {\n        return 1;\n    }\n    return 2;\n}\n\nint main(void) {\n    char skenario[32];\n    scanf(\"%31s\", skenario);\n    printf(\"Exit code: %d\\n\", exit_untuk(skenario));\n    return 0;\n}",
          tests: [
            { stdin: "ok", expectedOutput: "Exit code: 0" },
            { stdin: "tidak_ada", expectedOutput: "Exit code: 1" },
            { stdin: "bebas", expectedOutput: "Exit code: 2", hidden: true },
          ],
          hints: [
            "Sukses selalu dilambangkan angka nol.",
            "Kegagalan umum biasanya 1, dan skenario yang tidak dikenal jatuh ke return terakhir sebagai salah pemakaian.",
            "Tiga blank berurutan diisi 0, 1, lalu 2.",
          ],
        },
      ],
    },
    {
      slug: "lap-assert-defensive",
      title: "assert dan Program yang Bertahan",
      summary: "Pakai assert untuk invariant internal dan validasi input dengan cara yang tidak crash.",
      steps: [
        {
          kind: "theory",
          title: "Dua lapis pertahanan",
          body: "`assert(kondisi)` dari assert.h adalah pernyataan yang wajib benar: saat dilanggar, program berhenti dan menunjuk file serta barisnya. Ia mendokumentasikan asumsi sekaligus mengawasinya, misalnya pointer parameter di fungsi internal yang memang seharusnya tidak pernah NULL. Pelanggaran assert berarti ada bug di kode sendiri, bukan ulah pengguna.\n\nBatasnya jelas: assert untuk kesalahan programmer, bukan untuk input pengguna. Pengguna memasukkan usia negatif itu input; jawabannya pesan yang jelas atau kode error, bukan crash. Perlu diingat juga bahwa saat kompilasi dengan `NDEBUG` terdefinisi, seluruh assert hilang, jadi program tetap harus benar tanpa pengawas itu.\n\nProgram yang bertahan menyusun lapisan: validasi input di batas sistem, cek nilai balik fungsi yang bisa gagal, dan assert untuk invariant internal. Latihan di bawah melatih lapisan pertama: fungsi validasi yang mengembalikan kode error, bukan menghentikan program.",
          code: {
            language: "c",
            content: "#include <assert.h>\n\n/* invariant internal: dipanggil hanya dengan buffer terisi */\nvoid proses(const char *isi) {\n    assert(isi != NULL);\n    assert(isi[0] != '\\0');\n    /* kerjakan */\n}\n\n/* input pengguna: ditangani dengan kode, bukan assert */\nint validasi_usia(int usia) {\n    if (usia < 0 || usia > 150) return 1;\n    return 0;\n}",
            caption: "Assert untuk programmer, kode error untuk pengguna.",
          },
        },
        {
          kind: "quiz",
          question: "assert paling tepat dipakai untuk...",
          options: [
            "memvalidasi input pengguna sehari-hari",
            "menjaga invariant internal yang pelanggarannya berarti bug programmer",
            "menangani file yang tidak ada",
            "mengganti return kode error",
          ],
          answer: 1,
          explanation: "Assert adalah pengawas asumsi internal: dilanggar berarti kode salah dan perlu diperbaiki. Input pengguna ditangani dengan pesan dan kode error yang ramah, karena assert bisa hilang saat kompilasi NDEBUG.",
        },
        {
          kind: "code",
          title: "Perbaiki batas validasi usia",
          prompt: "Fungsi validasi_usia menolak usia negatif dengan kode 1 dan usia di atas 150 dengan kode 2. Usia 0 seharusnya sah, tapi tesnya gagal. Cari satu kesalahan di syarat pertama dan perbaiki.",
          mode: "fix",
          template: "#include <stdio.h>\n\nint validasi_usia(int usia) {\n    if (usia <= 0) {\n        return 1;\n    }\n    if (usia > 150) {\n        return 2;\n    }\n    return 0;\n}\n\nint main(void) {\n    int usia;\n    scanf(\"%d\", &usia);\n    int status = validasi_usia(usia);\n    if (status == 0) {\n        printf(\"Usia sah\\n\");\n    } else {\n        printf(\"Kode error: %d\\n\", status);\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint validasi_usia(int usia) {\n    if (usia < 0) {\n        return 1;\n    }\n    if (usia > 150) {\n        return 2;\n    }\n    return 0;\n}\n\nint main(void) {\n    int usia;\n    scanf(\"%d\", &usia);\n    int status = validasi_usia(usia);\n    if (status == 0) {\n        printf(\"Usia sah\\n\");\n    } else {\n        printf(\"Kode error: %d\\n\", status);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "17", expectedOutput: "Usia sah" },
            { stdin: "0", expectedOutput: "Usia sah" },
            { stdin: "-3", expectedOutput: "Kode error: 1", hidden: true },
          ],
          hints: [
            "Jalankan tes dengan input 0: hasilnya seharusnya sah, tapi program menolaknya.",
            "Angka 0 bukan bilangan negatif; syarat penolakan di baris pertama terlalu lebar satu tanda.",
            "Ubah usia <= 0 menjadi usia < 0.",
          ],
        },
      ],
    },
    {
      slug: "lap-struktur-proyek",
      title: "Struktur Proyek C yang Besar",
      summary: "Susun proyek jadi include, src, dan Makefile yang membangun ulang seperlunya.",
      steps: [
        {
          kind: "theory",
          title: "Satu modul, satu pasang file",
          body: "Program besar tidak hidup di satu main.c. Pembagian yang lazim: folder `include/` untuk header, folder `src/` untuk implementasi, dan satu pasang `.h` dan `.c` per modul, misalnya `parse.h` dan `parse.c`. Header berisi deklarasi fungsi, tipe, dan makro yang dipakai bersama; file .c memuat tubuh fungsinya; pemakai cukup `#include \"parse.h\"`. main.c dibuat tipis: hanya merangkai modul-modul.\n\nProses build menyusunnya bertahap: `gcc -c` mengompilasi tiap .c menjadi file object `.o` tanpa menghubungkan, lalu semua .o dihubungkan (link) sekali di akhir. Makefile mencatat resep itu sehingga `make` tahu urutan kerjanya, dan yang paling penting: hanya file yang berubah yang dibangun ulang. Untuk proyek dua file, resepnya terasa mubazir; untuk proyek dua puluh file, ia penyelamat.\n\nKeuntungannya nyata saat proyek tumbuh: waktu kompilasi turun karena modul lain tidak ikut dibangun ulang, tugas tiap file jelas, dan dua orang bisa mengedit modul berbeda tanpa berpapasan. Mulailah membiasakan struktur ini sejak proyek masih kecil, saat memindahkannya masih murah.",
          code: {
            language: "makefile",
            content: "CC = gcc\nCFLAGS = -Wall -Wextra\n\nbuild/kalkulator: build/main.o build/parse.o\n\t$(CC) $^ -o $@\n\nbuild/%.o: src/%.c include/kalkulator.h\n\t$(CC) $(CFLAGS) -Iinclude -c $< -o $@",
            caption: "make hanya membangun ulang file yang berubah.",
          },
        },
        {
          kind: "quiz",
          question: "Isi yang paling tepat untuk file header (.h) adalah...",
          options: [
            "implementasi lengkap semua fungsi",
            "deklarasi fungsi, tipe, dan makro yang dipakai bersama",
            "fungsi main",
            "kode yang jarang dipakai",
          ],
          answer: 1,
          explanation: "Header adalah kontrak: deklarasi dan tipe yang boleh dipakai file lain. Tubuh fungsinya hidup di file .c yang dikompilasi terpisah.",
        },
        {
          kind: "quiz",
          question: "Perintah `gcc -c main.c` melakukan...",
          options: [
            "mengompilasi main.c menjadi file object tanpa menghubungkan",
            "menghubungkan semua file object menjadi program",
            "menjalankan program yang sudah dibangun",
            "menghapus file .o yang lama",
          ],
          answer: 0,
          explanation: "Flag -c berarti compile only: hasilnya main.o. Penghubungan dilakukan terpisah saat semua .o dirangkai menjadi satu program.",
        },
      ],
    },
    {
      slug: "lap-warning-compiler",
      title: "Warning Compiler: Alarm Gratis",
      summary: "Nyalakan -Wall -Wextra dan perlakukan warning sebagai bug yang belum meledak.",
      steps: [
        {
          kind: "theory",
          title: "Dua suara compiler",
          body: "Compiler punya dua suara. Error menolak membangun program. Warning membangun sambil curiga, dan curiganya hampir selalu beralasan: variabel yang dipakai sebelum diisi, format printf yang tidak cocok tipenya, fungsi yang tidak selalu mengembalikan nilai, atau deklarasi implisit dari fungsi yang headernya lupa di-include.\n\nMasalahnya, gcc secara bawaan diam tentang banyak warning. Flag `-Wall` menyalakan mayoritas warning umum, `-Wextra` menambah sisanya yang lebih teliti, dan `-Werror` menaikkan warning menjadi error untuk yang ingin disiplin total. Kebiasaan kerja yang menyelamatkan: selalu build dengan `-Wall -Wextra`, dan jadikan jumlah warning nol sebagai garis dasar proyek.\n\nWarning itu gratis: bayarannya cuma kejujuran membaca. Banyak crash yang dianggap misterius ternyata sudah diumumkan lebih dulu di baris warning; programnya memang jalan, tapi jalan menuju lubang yang sudah ditandai.",
          code: {
            language: "c",
            content: "int jumlah(int a, int b) {\n    int hasil;\n    printf(\"%d\\n\", hasil); /* warning: hasil dipakai sebelum diisi */\n    return a + b;\n}",
            caption: "gcc -Wall menunjuk baris yang kelak menghasilkan nilai sampah.",
          },
        },
        {
          kind: "quiz",
          question: "Flag gcc yang menyalakan mayoritas warning umum adalah...",
          options: ["-O2", "-Wall", "-o", "-std=c11"],
          answer: 1,
          explanation: "-Wall menyalakan kelompok warning yang paling sering menangkap bug, dan biasanya dipasangkan dengan -Wextra. -O2 mengatur optimasi, -o menamai keluaran, dan -std memilih standar bahasa.",
        },
      ],
    },
    {
      slug: "lap-mini-kalkulator",
      title: "Mini Proyek 1: Kalkulator Ekspresi",
      summary: "Bangun kalkulator satu baris yang tahan input rusak, bagi nol, dan operator asing.",
      steps: [
        {
          kind: "theory",
          title: "Satu baris, semua jalur dipikirkan",
          body: "Proyek pertama dari tiga mini proyek penutup jalur: kalkulator satu baris. Inputnya berupa `<a> <op> <b>`, misalnya `12 + 5`, dan keluarannya satu angka. Yang membedakan proyek dari latihan biasa bukan rumusnya, melainkan jalur-jalur lain yang juga dipikirkan: input rusak, pembagian dengan nol, dan operator yang tidak dikenal.\n\nscanf mengembalikan jumlah item yang berhasil dibaca, jadi input rusak terdeteksi sebelum dihitung: kalau hasilnya bukan 3, program menolak dengan pesan dan exit code 1. `switch` menyalurkan operator, dan case pembagian memeriksa penyebutnya lebih dulu. Pembagian bulat menghasilkan bilangan bulat: `7 / 2` menghasilkan 3, bukan 3.5, dan perilaku itulah yang diuji di sini.\n\nPerhatikan juga bagaimana setiap jalur error punya pesan berbeda. Pesan yang spesifik membuat pengguna tahu apa yang harus diperbaiki, dan inilah perbedaan program yang jadi vs program yang layak dipakai.",
          code: {
            language: "c",
            content: "switch (op) {\n    case '+':\n        printf(\"%d\\n\", a + b);\n        break;\n    case '/':\n        if (b == 0) {\n            printf(\"Error: bagi nol\\n\");\n        } else {\n            printf(\"%d\\n\", a / b);\n        }\n        break;\n    default:\n        printf(\"Error: operator tidak dikenal\\n\");\n}",
            caption: "Setiap case menutup dengan break, dan pembagian dijaga lebih dulu.",
          },
        },
        {
          kind: "quiz",
          question: "Ketika input tidak berisi angka sama sekali, apa yang dikembalikan `scanf(\"%d %c %d\", ...)`?",
          options: ["0 atau EOF, bukan 3", "3", "1", "scanf menunggu selamanya"],
          answer: 0,
          explanation: "scanf mengembalikan jumlah item yang berhasil dibaca; kalau konversi pertama saja gagal hasilnya EOF. Karena itu keberhasilannya dicek dengan != 3 sebelum nilai dipakai.",
        },
        {
          kind: "code",
          title: "Rakit kalkulator yang lengkap",
          prompt: "Lengkapi dua penjaga di kalkulator: jumlah item yang dianggap sah dari scanf, dan pembanding untuk mendeteksi penyebut nol. Pembagian memakai pembagian bulat, jadi `7 / 2` menghasilkan `3`.",
          mode: "fill",
          template: "#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    char op;\n    if (scanf(\"%d %c %d\", &a, &op, &b) != ___) {\n        printf(\"Error: input tidak valid\\n\");\n        return 1;\n    }\n    switch (op) {\n        case '+':\n            printf(\"%d\\n\", a + b);\n            break;\n        case '-':\n            printf(\"%d\\n\", a - b);\n            break;\n        case '*':\n            printf(\"%d\\n\", a * b);\n            break;\n        case '/':\n            if (b ___ 0) {\n                printf(\"Error: bagi nol\\n\");\n            } else {\n                printf(\"%d\\n\", a / b);\n            }\n            break;\n        default:\n            printf(\"Error: operator tidak dikenal\\n\");\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    char op;\n    if (scanf(\"%d %c %d\", &a, &op, &b) != 3) {\n        printf(\"Error: input tidak valid\\n\");\n        return 1;\n    }\n    switch (op) {\n        case '+':\n            printf(\"%d\\n\", a + b);\n            break;\n        case '-':\n            printf(\"%d\\n\", a - b);\n            break;\n        case '*':\n            printf(\"%d\\n\", a * b);\n            break;\n        case '/':\n            if (b == 0) {\n                printf(\"Error: bagi nol\\n\");\n            } else {\n                printf(\"%d\\n\", a / b);\n            }\n            break;\n        default:\n            printf(\"Error: operator tidak dikenal\\n\");\n    }\n    return 0;\n}",
          tests: [
            { stdin: "12 + 5", expectedOutput: "17" },
            { stdin: "8 / 0", expectedOutput: "Error: bagi nol" },
            { stdin: "4 x 2", expectedOutput: "Error: operator tidak dikenal", hidden: true },
          ],
          hints: [
            "scanf mengembalikan jumlah item yang berhasil dibaca, dan format ini menanyakan tiga item sekaligus.",
            "Pembagian dengan nol dicek sebelum operasi: penyebut dibandingkan dengan nol.",
            "Blank pertama diisi 3, blank kedua diisi ==.",
          ],
        },
      ],
    },
    {
      slug: "lap-mini-kontak",
      title: "Mini Proyek 2: Manajemen Kontak",
      summary: "Bangun aplikasi kontak berbasis loop perintah: add, list, dan cari.",
      steps: [
        {
          kind: "theory",
          title: "Loop perintah, jantung aplikasi CLI",
          body: "Pola aplikasi CLI yang paling awet: loop perintah. Baca satu kata perintah, bandingkan dengan daftar yang dikenal, jalankan yang cocok, ulangi sampai input habis. Aplikasi kontak mini ini punya tiga perintah: `add <nama> <nomor>` menyimpan, `list` mencetak semua, dan `cari <nama>` mencari satu.\n\nPenyimpanannya memakai dua array paralel dan satu penghitung: kontak ke-i namanya di `nama[i]` dan nomornya di `nomor[i]`, dengan `n` mencatat jumlahnya. add menulis di indeks n lalu menaikkannya; list mencetak indeks 0 sampai n-1; cari menyapu linear dan mengingat indeks yang cocok.\n\nBentuk seperti ini adalah versi mungil dari aplikasi nyata: dispatch perintah, penyimpanan, dan pencarian. Nanti struktur datanya bisa naik kelas ke linked list atau hash table dari modul struktur data tanpa mengubah kerangka loop-nya sama sekali. Itulah tanda struktur yang benar: bagian dalam boleh berganti, bentuk luarnya tetap.",
          code: {
            language: "c",
            content: "while (scanf(\"%15s\", perintah) == 1) {\n    if (strcmp(perintah, \"add\") == 0) {\n        /* baca nama dan nomor, simpan, naikkan n */\n    } else if (strcmp(perintah, \"list\") == 0) {\n        /* cetak 0 sampai n-1 */\n    } else if (strcmp(perintah, \"cari\") == 0) {\n        /* baca target, sapu linear */\n    }\n}",
            caption: "Satu loop, tiga perintah, nol duplikasi kerangka.",
          },
        },
        {
          kind: "quiz",
          question: "Untuk membandingkan kata perintah yang dibaca dengan isi array nama kontak, fungsi yang tepat adalah...",
          options: ["==", "strcmp", "=", "&"],
          answer: 1,
          explanation: "strcmp membandingkan isi dua string dan mengembalikan 0 saat sama. Tanda == pada array hanya membandingkan alamatnya, bukan isinya.",
        },
        {
          kind: "code",
          title: "Rakit aplikasi kontak",
          prompt: "Lengkapi dua blank: batas loop saat mencetak daftar kontak, dan fungsi pembanding untuk mencari kontak. Perintah datang berurutan dari stdin: `add <nama> <nomor>`, `list`, dan `cari <nama>`. Kontak tidak ditemukan dilaporkan dengan `Tidak ketemu: <nama>`.",
          mode: "fill",
          template: "#include <stdio.h>\n#include <string.h>\n\n#define MAKS 16\n\nint main(void) {\n    char nama[MAKS][32];\n    char nomor[MAKS][16];\n    int n = 0;\n    char perintah[16];\n    while (scanf(\"%15s\", perintah) == 1) {\n        if (strcmp(perintah, \"add\") == 0) {\n            scanf(\"%31s %15s\", nama[n], nomor[n]);\n            n = n + 1;\n        } else if (strcmp(perintah, \"list\") == 0) {\n            printf(\"Daftar kontak:\\n\");\n            for (int i = 0; i < ___; i = i + 1) {\n                printf(\"%s: %s\\n\", nama[i], nomor[i]);\n            }\n        } else if (strcmp(perintah, \"cari\") == 0) {\n            char target[32];\n            scanf(\"%31s\", target);\n            int ketemu = -1;\n            for (int i = 0; i < n; i = i + 1) {\n                if (___(nama[i], target) == 0) {\n                    ketemu = i;\n                }\n            }\n            if (ketemu >= 0) {\n                printf(\"%s: %s\\n\", nama[ketemu], nomor[ketemu]);\n            } else {\n                printf(\"Tidak ketemu: %s\\n\", target);\n            }\n        }\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\n#define MAKS 16\n\nint main(void) {\n    char nama[MAKS][32];\n    char nomor[MAKS][16];\n    int n = 0;\n    char perintah[16];\n    while (scanf(\"%15s\", perintah) == 1) {\n        if (strcmp(perintah, \"add\") == 0) {\n            scanf(\"%31s %15s\", nama[n], nomor[n]);\n            n = n + 1;\n        } else if (strcmp(perintah, \"list\") == 0) {\n            printf(\"Daftar kontak:\\n\");\n            for (int i = 0; i < n; i = i + 1) {\n                printf(\"%s: %s\\n\", nama[i], nomor[i]);\n            }\n        } else if (strcmp(perintah, \"cari\") == 0) {\n            char target[32];\n            scanf(\"%31s\", target);\n            int ketemu = -1;\n            for (int i = 0; i < n; i = i + 1) {\n                if (strcmp(nama[i], target) == 0) {\n                    ketemu = i;\n                }\n            }\n            if (ketemu >= 0) {\n                printf(\"%s: %s\\n\", nama[ketemu], nomor[ketemu]);\n            } else {\n                printf(\"Tidak ketemu: %s\\n\", target);\n            }\n        }\n    }\n    return 0;\n}",
          tests: [
            { stdin: "add Budi 0812\nadd Sari 0813\nlist\ncari Budi", expectedOutput: "Daftar kontak:\nBudi: 0812\nSari: 0813\nBudi: 0812" },
            { stdin: "add Budi 0812\ncari Rara", expectedOutput: "Tidak ketemu: Rara" },
            { stdin: "add Andi 111\nadd B 222\nlist", expectedOutput: "Daftar kontak:\nAndi: 111\nB: 222", hidden: true },
          ],
          hints: [
            "list mencetak semua kontak yang sudah tersimpan, jadi batas loop-nya adalah penghitung jumlah kontak.",
            "Membandingkan isi dua string memakai strcmp dari string.h, dengan hasil dicek == 0.",
            "Blank pertama diisi n, blank kedua diisi strcmp.",
          ],
        },
      ],
    },
    {
      slug: "lap-mini-statistik-kata",
      title: "Mini Proyek 3: Statistik Kata",
      summary: "Hitung kata, cari yang terpanjang, dan hitung rata-rata panjangnya dalam satu lintasan.",
      steps: [
        {
          kind: "theory",
          title: "Satu lintasan, tiga statistik",
          body: "Proyek ketiga: statistik kata. Loop `while (scanf(\"%63s\", kata) == 1)` membaca kata demi kata sampai stream habis, karena %s berhenti di spasi dan scanf mengembalikan 1 selama ada kata yang berhasil masuk. Tidak perlu peduli baris: spasi dan newline sama-sama pemisah baginya.\n\nTiga angka dikejar sekali jalan: jumlah kata, total huruf, dan kata terpanjang. Ada satu aturan kecil yang wajib disepakati supaya hasilnya deterministik: saat seri, kata pertama yang mencapai panjang tertinggi yang menang, dan itu dicapai dengan pembanding `lebih panjang`, bukan `lebih panjang atau sama`. Rata-rata panjang dihitung total huruf dibagi jumlah kata, dicetak satu desimal dengan `%.1f`.\n\nTemplate di latihan sudah jalan tanpa error, tapi keluaran Terpanjang-nya janggal: ia justru memilih kata yang lebih pendek. Satu tanda perbandingan terbalik adalah bug yang paling sering lolos review manusia, dan justru karena itulah tes otomatis dibuat.",
          code: {
            language: "c",
            content: "char kata[64];\nint jumlah = 0, total_huruf = 0;\n\nwhile (scanf(\"%63s\", kata) == 1) {\n    jumlah = jumlah + 1;\n    total_huruf = total_huruf + (int)strlen(kata);\n}",
            caption: "scanf dengan %s otomatis berhenti di spasi dan newline.",
          },
        },
        {
          kind: "quiz",
          question: "Saat stream sudah habis, `scanf(\"%63s\", kata)` mengembalikan...",
          options: ["1", "0", "EOF", "NULL"],
          answer: 2,
          explanation: "Saat input habis sebelum konversi pertama berhasil, scanf mengembalikan EOF. Karena itu kondisi loop-nya == 1: loop berhenti di kata terakhir.",
        },
        {
          kind: "code",
          title: "Perbaiki pemilih kata terpanjang",
          prompt: "Program statistik kata ini sudah jalan, tapi pilihan kata Terpanjang-nya salah arah: yang tercetak kosong atau justru yang pendek. Cari satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char kata[64];\n    char terpanjang[64] = \"\";\n    int jumlah = 0;\n    int total_huruf = 0;\n    while (scanf(\"%63s\", kata) == 1) {\n        jumlah = jumlah + 1;\n        total_huruf = total_huruf + (int)strlen(kata);\n        if (strlen(kata) < strlen(terpanjang)) {\n            strcpy(terpanjang, kata);\n        }\n    }\n    printf(\"Kata: %d\\n\", jumlah);\n    printf(\"Terpanjang: %s\\n\", terpanjang);\n    if (jumlah > 0) {\n        printf(\"Rata-rata: %.1f\\n\", (double)total_huruf / jumlah);\n    }\n    return 0;\n}",
          solution: "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char kata[64];\n    char terpanjang[64] = \"\";\n    int jumlah = 0;\n    int total_huruf = 0;\n    while (scanf(\"%63s\", kata) == 1) {\n        jumlah = jumlah + 1;\n        total_huruf = total_huruf + (int)strlen(kata);\n        if (strlen(kata) > strlen(terpanjang)) {\n            strcpy(terpanjang, kata);\n        }\n    }\n    printf(\"Kata: %d\\n\", jumlah);\n    printf(\"Terpanjang: %s\\n\", terpanjang);\n    if (jumlah > 0) {\n        printf(\"Rata-rata: %.1f\\n\", (double)total_huruf / jumlah);\n    }\n    return 0;\n}",
          tests: [
            { stdin: "belajar coding di platform kodekita", expectedOutput: "Kata: 5\nTerpanjang: platform\nRata-rata: 6.2" },
            { stdin: "kamu", expectedOutput: "Kata: 1\nTerpanjang: kamu\nRata-rata: 4.0" },
            { stdin: "satu\ndua tiga\nempat", expectedOutput: "Kata: 4\nTerpanjang: empat\nRata-rata: 4.0", hidden: true },
          ],
          hints: [
            "Jalankan tes pertama dan perhatikan: kata terpanjang yang tercetak kosong, artinya penggantian juara tidak pernah terjadi.",
            "Kata baru boleh menggantikan juara hanya bila lebih panjang darinya, bukan lebih pendek.",
            "Balik arah pembanding strlen: ganti < dengan >.",
          ],
        },
      ],
    },
    {
      slug: "lap-checklist-kerja",
      title: "Checklist Kesiapan Kerja",
      summary: "Centang kebiasaan yang dicari dunia kerja: build bersih, debugging, git, dan membaca kode orang lain.",
      steps: [
        {
          kind: "theory",
          title: "Yang ditanya, bukan yang dihafal",
          body: "Yang dicari saat merekrut programmer C jarang tentang hafalan sintaks. Yang dinilai: membaca pesan error dan warning tanpa panik, memecah masalah jadi tes kecil yang bisa dijalankan, dan menutup program dengan rapi, mulai dari pasangan malloc dan free, cek NULL, sampai fclose. Semua itu kebiasaan, dan kebiasaan dilatih lewat pengulangan.\n\nDaftar yang bisa kamu centang sendiri sekarang: build bersih dengan `-Wall -Wextra`; bisa memakai debugger untuk menonton isi variabel dan call stack; tahu memakai git untuk menyimpan progres dan membatalkan kesalahan; membaca kode orang lain dan mengikuti gaya proyeknya; menguji sebelum mengklaim selesai. Setiap butir punya latihan alaminya: proyek kecil yang diselesaikan sampai tuntas lebih berharga daripada sepuluh proyek setengah jadi.\n\nSatu lagi yang sering dilupakan: alat pemeriksa memori seperti valgrind untuk menangkap kebocoran, dan kebiasaan menulis pesan commit yang menjelaskan mengapa, bukan hanya apa. Dengan checklist ini tercentang, kamu bukan sekadar bisa C; kamu bisa bekerja dengan C bersama orang lain.",
          code: {
            language: "c",
            content: "/* gaya build kerja: warning dianggap gagal */\ngcc -Wall -Wextra -Werror src/*.c -o program\n\n/* lalu, di mesin linux, buru kebocoran memori */\nvalgrind --leak-check=full ./program",
            caption: "Dua perintah yang layak jadi kebiasaan sebelum menyerahkan pekerjaan.",
          },
        },
        {
          kind: "quiz",
          question: "Logikamu menurutmu sudah benar, tapi program tetap menghasilkan keluaran salah. Langkah pertama yang paling tepat...",
          options: [
            "melaporkan bug ke pembuat compiler",
            "membaca ulang keluaran -Wall -Wextra dan menjalankan debugger pada kasus terkecil",
            "mengubah flag compiler secara acak sampai jalan",
            "menulis ulang program dari nol",
          ],
          answer: 1,
          explanation: "Anggap dulu kodemu yang salah: kecilkan kasus sampai seminimal mungkin, baca warning, lalu lacak nilai variabel dengan debugger. Melaporkan bug compiler adalah langkah terakhir setelah semua itu gagal, dan itu langka sekali.",
        },
        {
          kind: "quiz",
          question: "Alat klasik untuk memeriksa kebocoran memori pada program C di Linux adalah...",
          options: ["valgrind", "npm audit", "gcc -O2", "git diff"],
          answer: 0,
          explanation: "valgrind menjalankan program dan melaporkan blok malloc yang tidak pernah di-free, plus akses memori liar. gcc -O2 hanya mengatur optimasi, dan git diff membandingkan perubahan kode.",
        },
      ],
    },
    {
      slug: "lap-rekap-lanjutan",
      title: "Rekap dan Jalur Setelah Ini",
      summary: "Rangkum sepuluh modul dan pilih arah lanjutan: algoritma, thread, jaringan, atau embedded.",
      steps: [
        {
          kind: "theory",
          title: "Tangga yang sudah kamu naiki",
          body: "Sepuluh modul ini adalah satu tangga: tipe dan memori, pointer, memori dinamis, string dan buffer, struct, fungsi lanjut, struktur data, preprocessor dan build, file I/O, lalu proyek lapangan. Di bawahnya ada fondasi enam konsep inti; di atasnya kini hanya pengalaman. Kalau satu anak tangga masih terasa licin, ulang modulnya lewat latihannya, bukan lewat membaca ulang saja.\n\nArah lanjutan yang paling sering dipakai: algoritma dan struktur data lanjut untuk wawancara dan performa; multithreading dengan pthreads untuk program yang membagi kerja; pemrograman jaringan dengan socket untuk program yang bicara lewat internet; dan dunia embedded, tempat C paling di rumah di perangkat kecil tanpa sistem operasi. Semua jalur itu berdiri di atas apa yang sudah kamu kuasai di sini.\n\nCara menguatkan yang terbukti hanya satu: kontak dengan kode sungguhan. Bangun proyek kecil tapi selesai sampai dipakai. Baca kode proyek open source dan pahami satu filenya sampai dalam. Perbaiki warning proyek orang lain dan kirim perubahan pertamamu. Keahlian C tumbuh dari kebiasaan menyelesaikan, bukan dari menumpuk materi.",
          code: {
            language: "c",
            content: "#include <pthread.h>\n\nvoid *kerja(void *arg) {\n    /* potongan pekerjaan yang berjalan paralel */\n    return NULL;\n}\n\n/* pthread_create(&t, NULL, kerja, NULL); */",
            caption: "Salah satu pintu lanjutan: thread lewat pthreads.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut rekomendasi modul ini, cara paling efektif menguatkan kemampuan C setelah jalur ini selesai adalah...",
          options: [
            "menghafal ulang seluruh materi modul",
            "membangun proyek nyata sampai selesai dan membaca kode orang lain",
            "menunggu materi baru terbit",
            "beralih ke bahasa lain dan melupakan C",
          ],
          answer: 1,
          explanation: "Materi hanya peta; keahlian tumbuh saat menempuh jalannya. Proyek kecil yang tuntas dan membaca kode open source memberi kontak dengan persoalan nyata yang tidak ada di latihan.",
        },
        {
          kind: "quiz",
          question: "Pustaka standar POSIX untuk membuat thread dalam program C adalah...",
          options: ["pthreads", "stdio.h", "curl", "make"],
          answer: 0,
          explanation: "pthread.h menyediakan pthread_create dan teman-temannya untuk menjalankan fungsi secara paralel. Ini pintu masuk paling umum ke pemrograman concurrent di C.",
        },
      ],
    },
  ],
};
