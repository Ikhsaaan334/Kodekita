import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "go",
  moduleRange: [6, 7],
  modules: [
    {
      title: "Sinkronisasi dan Pola Concurrent",
      description: "Mutex, atomic, worker pool, pipeline, fan-out/fan-in, dan context pembatalan.",
    },
    {
      title: "Stdlib Inti",
      description: "strings/strconv, time, os/io, encoding/json, dan testing bawaan.",
    },
  ],
  lessons: [
    // ==================== MODUL 6: Sinkronisasi dan Pola Concurrent ====================
    {
      slug: "race-condition-data-race",
      title: "Data Race dan Race Condition",
      summary:
        "Pahami data race, kenapa hasil program mendadak tidak pasti, dan cara mendeteksinya dengan -race.",
      steps: [
        {
          kind: "theory",
          title: "Dua goroutine, satu variabel, hasil tak pasti",
          body: "Di modul sebelumnya goroutine sudah sering dipakai, dan selama mereka tidak menyentuh data yang sama, semuanya aman. Masalah mulai saat dua goroutine mengakses variabel yang sama dan minimal satu di antaranya menulis. Kondisi ini disebut data race: dua akses bersamaan tanpa sinkronisasi, dan hasilnya bergantung pada urutan interleave yang tidak bisa diprediksi.\n\nLihat contoh di bawah: dua goroutine masing-masing menaikkan n seribu kali. Naifnya hasilnya 2000, tapi sering kali kurang. Penyebabnya, baris n++ bukan satu langkah: CPU membaca n, menaikkannya, lalu menulis kembali. Dua goroutine bisa membaca nilai yang sama, menambah, lalu saling menimpa, dan satu penambahan lenyap.\n\nData race termasuk bug paling sukar dilacak karena program tetap jalan, bahkan sering lulus saat dicoba manual. Untungnya Go punya detektor bawaan: jalankan dengan go run -race atau go test -race, laporan yang muncul menyebut file dan baris yang berlomba. Cara menutup perlombaan itu dibahas satu per satu di modul ini: mutex, atomic, dan pola channel.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar n int\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 2; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor j := 0; j < 1000; j++ {\n\t\t\t\tn++ // data race: dua goroutine membaca dan menulis n\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(n) // bisa 2000, bisa kurang, tiap jalan berbeda\n}",
            caption: "Tanpa kunci, jumlah akhir tidak bisa dijamin; coba jalankan beberapa kali.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah bawaan Go apa yang dipakai untuk mendeteksi data race saat program dijalankan?",
          options: ["go run -race", "go run -debug", "go check race", "go vet -all"],
          answer: 0,
          explanation:
            "Flag -race mengaktifkan race detector bawaan toolchain Go. go vet memeriksa hal lain seperti verb fmt yang salah, bukan race saat runtime.",
        },
        {
          kind: "quiz",
          question: "Mengapa `n++` dari banyak goroutine tanpa kunci bisa menghasilkan angka yang salah?",
          options: [
            "Karena n++ bukan satu operasi: baca, tambah, dan tulis bisa saling menimpa",
            "Karena int tidak bisa menyimpan angka besar",
            "Karena goroutine tidak boleh membaca variabel luar",
            "Karena compiler mengubah n++ menjadi n = 0",
          ],
          answer: 0,
          explanation:
            "n++ terdiri dari tiga langkah memori. Dua goroutine yang membaca nilai sama lalu menulis hasilnya masing-masing membuat satu penambahan hilang.",
        },
      ],
    },
    {
      slug: "sync-mutex",
      title: "sync.Mutex: Kunci Bagian Kritis",
      summary: "Lindungi data bersama dengan Lock dan Unlock, dan kenapa lupa melepas kunci bikin program macet.",
      steps: [
        {
          kind: "theory",
          title: "Bagian kritis dan kuncinya",
          body: "sync.Mutex adalah kunci untuk bagian kritis: potongan kode yang hanya boleh dijalankan satu goroutine pada satu waktu. mu.Lock() mengambil kunci; kalau sedang dipegang goroutine lain, pemanggil menunggu sampai kunci dilepas dengan mu.Unlock(). Di dalam kunci, penambahan pada contoh lesson sebelumnya tidak bisa saling menimpa lagi.\n\nKebiasaan yang sehat: taruh mutex sebagai field di struct yang datanya dilindungi, biasanya diberi nama mu, dan buat method yang mengurus kunci sendiri sehingga pemanggil tidak bisa lupa. Untuk alur yang punya banyak return, pola defer mu.Unlock() lebih aman daripada memanggil Unlock manual di setiap jalur keluar.\n\nDua peringatan. Pertama, Unlock dari goroutine yang tidak memegang kunci memicu panic fatal, jadi kunci dilepas oleh pemegangnya. Kedua, mutex hanya melindungi akses yang lewat kunci: kalau satu method membaca field tanpa mengunci, race tetap ada. Kunci dipasang di semua pintu, bukan sebagian.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Penghitung struct {\n\tmu sync.Mutex\n\tn  int\n}\n\nfunc (p *Penghitung) Naik(delta int) {\n\tp.mu.Lock()\n\tdefer p.mu.Unlock()\n\tp.n += delta\n}\n\nfunc main() {\n\tvar p Penghitung\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 4; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor j := 0; j < 250; j++ {\n\t\t\t\tp.Naik(1)\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(p.n) // selalu 1000\n}",
            caption: "Empat goroutine, satu mutex: hasilnya selalu 1000, berapa kali pun dijalankan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi jika goroutine memanggil `mu.Lock()` padahal kunci sedang dipegang goroutine lain?",
          options: [
            "Program langsung panic",
            "Pemanggil menunggu sampai kunci dilepas",
            "Lock mengembalikan error false",
            "Kunci dilepas paksa untuk pemanggil",
          ],
          answer: 1,
          explanation:
            "Inti mutual exclusion: pemanggil diblokir sampai pemegang memanggil Unlock. Tidak ada error dan tidak ada pelepasan paksa.",
        },
        {
          kind: "code",
          title: "Lengkapi kunci penghitung",
          prompt:
            "Lengkapi method `Naik` agar setiap penambahan terlindungi: ambil kunci sebelum mengubah `n`, lepas setelahnya. Input: jumlah pekerja dan jumlah penambahan per pekerja. Keluaran: nilai akhir penghitung.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Penghitung struct {\n\tmu sync.Mutex\n\tn  int\n}\n\nfunc (p *Penghitung) Naik(delta int) {\n\tp.mu.___()\n\tp.n += delta\n\tp.mu.___()\n}\n\nfunc main() {\n\tvar pekerja, ulang int\n\tfmt.Scan(&pekerja, &ulang)\n\tvar p Penghitung\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < pekerja; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor j := 0; j < ulang; j++ {\n\t\t\t\tp.Naik(1)\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(p.n)\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Penghitung struct {\n\tmu sync.Mutex\n\tn  int\n}\n\nfunc (p *Penghitung) Naik(delta int) {\n\tp.mu.Lock()\n\tp.n += delta\n\tp.mu.Unlock()\n}\n\nfunc main() {\n\tvar pekerja, ulang int\n\tfmt.Scan(&pekerja, &ulang)\n\tvar p Penghitung\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < pekerja; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor j := 0; j < ulang; j++ {\n\t\t\t\tp.Naik(1)\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(p.n)\n}",
          tests: [
            { stdin: "4 250", expectedOutput: "1000" },
            { stdin: "3 100", expectedOutput: "300" },
            { stdin: "5 2", expectedOutput: "10", hidden: true },
          ],
          hints: [
            "Method kunci ada dua: satu untuk mengambil, satu untuk melepas.",
            "Diawali huruf L dan diakhiri k: satu sebelum mengubah n, satu setelahnya.",
            "Jawabannya: Lock dan Unlock.",
          ],
        },
      ],
    },
    {
      slug: "sync-rwmutex",
      title: "sync.RWMutex: Kunci Dua Mode",
      summary: "RLock membolehkan banyak pembaca bersamaan; Lock menghentikan semuanya untuk satu penulis.",
      steps: [
        {
          kind: "theory",
          title: "Banyak pembaca, satu penulis",
          body: "Banyak data di program nyata lebih sering dibaca daripada ditulis: konfigurasi, cache, tabel referensi. Untuk kasus ini sync.RWMutex lebih longgar daripada Mutex biasa. Kunci bacanya, RLock dan RUnlock, boleh dipegang banyak goroutine sekaligus, karena saling membaca tidak saling mengganggu.\n\nKunci tulisnya, Lock dan Unlock, eksklusif penuh: saat dipegang, tidak ada pembaca dan tidak ada penulis lain yang masuk. Penulis juga tidak boleh tersedot terus oleh pembaca baru; begitu ada penulis menunggu, pembaca berikutnya ikut antre. Satu larangan yang penting: jangan mengubah kunci baca menjadi kunci tulis di goroutine yang sama, RLock lalu Lock di jalur yang sama adalah resep deadlock.\n\nRWMutex bukan upgrade gratis: strukturnya lebih berat daripada Mutex biasa, jadi manfaatnya baru terasa saat pembaca jauh lebih banyak daripada penulis. Latihan di bawah memakai pola yang umum: Set mengunci penuh, Get hanya mengunci baca.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Stok struct {\n\tmu sync.RWMutex\n\tm  map[string]int\n}\n\nfunc (s *Stok) Set(kunci string, nilai int) {\n\ts.mu.Lock() // tulis: eksklusif\n\tdefer s.mu.Unlock()\n\ts.m[kunci] = nilai\n}\n\nfunc (s *Stok) Get(kunci string) (int, bool) {\n\ts.mu.RLock() // baca: boleh bersamaan\n\tdefer s.mu.RUnlock()\n\tv, ok := s.m[kunci]\n\treturn v, ok\n}\n\nfunc main() {\n\ts := &Stok{m: map[string]int{}}\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 2; i++ { // dua pembaca paralel\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\ts.Get(\"buku\")\n\t\t}()\n\t}\n\twg.Wait()\n\ts.Set(\"buku\", 12)\n\tv, ok := s.Get(\"buku\")\n\tfmt.Println(v, ok)\n}",
            caption: "Dua goroutine membaca bersamaan lewat RLock; menulis tetap eksklusif lewat Lock.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan dua goroutine boleh memegang kunci sync.RWMutex pada saat yang sama?",
          options: [
            "Keduanya memanggil Lock",
            "Keduanya memanggil RLock",
            "Satu Lock dan satu RLock",
            "Tidak pernah; RWMutex selalu eksklusif",
          ],
          answer: 1,
          explanation:
            "RLock boleh dipegang banyak goroutine sekaligus. Begitu ada Lock yang menunggu atau memegang, pembaca harus antre.",
        },
        {
          kind: "code",
          title: "Lengkapi kunci penyimpanan stok",
          prompt:
            "Lengkapi dua method penyimpanan: `Set` menulis data jadi butuh kunci eksklusif, `Get` hanya membaca jadi pakai varian kunci baca. Input: n pasangan kunci dan nilai, lalu daftar kunci yang ditanyakan.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Stok struct {\n\tmu sync.RWMutex\n\tm  map[string]int\n}\n\nfunc (s *Stok) Set(kunci string, nilai int) {\n\ts.mu.___()\n\tdefer s.mu.Unlock()\n\ts.m[kunci] = nilai\n}\n\nfunc (s *Stok) Get(kunci string) (int, bool) {\n\ts.mu.___()\n\tdefer s.mu.RUnlock()\n\tv, ok := s.m[kunci]\n\treturn v, ok\n}\n\nfunc main() {\n\ts := &Stok{m: map[string]int{}}\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar kunci string\n\t\tvar nilai int\n\t\tfmt.Scan(&kunci, &nilai)\n\t\ts.Set(kunci, nilai)\n\t}\n\tvar q int\n\tfmt.Scan(&q)\n\tfor i := 0; i < q; i++ {\n\t\tvar kunci string\n\t\tfmt.Scan(&kunci)\n\t\tif v, ok := s.Get(kunci); ok {\n\t\t\tfmt.Println(kunci, v)\n\t\t} else {\n\t\t\tfmt.Println(kunci, \"tidak ada\")\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Stok struct {\n\tmu sync.RWMutex\n\tm  map[string]int\n}\n\nfunc (s *Stok) Set(kunci string, nilai int) {\n\ts.mu.Lock()\n\tdefer s.mu.Unlock()\n\ts.m[kunci] = nilai\n}\n\nfunc (s *Stok) Get(kunci string) (int, bool) {\n\ts.mu.RLock()\n\tdefer s.mu.RUnlock()\n\tv, ok := s.m[kunci]\n\treturn v, ok\n}\n\nfunc main() {\n\ts := &Stok{m: map[string]int{}}\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar kunci string\n\t\tvar nilai int\n\t\tfmt.Scan(&kunci, &nilai)\n\t\ts.Set(kunci, nilai)\n\t}\n\tvar q int\n\tfmt.Scan(&q)\n\tfor i := 0; i < q; i++ {\n\t\tvar kunci string\n\t\tfmt.Scan(&kunci)\n\t\tif v, ok := s.Get(kunci); ok {\n\t\t\tfmt.Println(kunci, v)\n\t\t} else {\n\t\t\tfmt.Println(kunci, \"tidak ada\")\n\t\t}\n\t}\n}",
          tests: [
            { stdin: "3\nbuku 12\ntas 5\npulpen 3\n2\ntas\npenghapus", expectedOutput: "tas 5\npenghapus tidak ada" },
            { stdin: "2\na 1\nb 2\n3\na\nb\nc", expectedOutput: "a 1\nb 2\nc tidak ada" },
            { stdin: "1\nx 99\n1\nx", expectedOutput: "x 99", hidden: true },
          ],
          hints: [
            "Set mengubah data, jadi butuh kunci yang eksklusif.",
            "Get hanya membaca, jadi pakai varian kunci baca, diawali huruf R.",
            "Jawabannya: Lock dan RLock.",
          ],
        },
      ],
    },
    {
      slug: "atomic-operations",
      title: "sync/atomic: Sinkronisasi Ringan",
      summary: "Untuk counter dan flag tunggal, operasi atomik menutup race tanpa kunci.",
      steps: [
        {
          kind: "theory",
          title: "Satu operasi, tanpa kunci",
          body: "Kalau yang dilindungi cuma satu angka, membawa mutex rasanya berlebihan. Package sync/atomic menyediakan operasi memori tunggal yang tak terputus: AddInt64, LoadInt64, StoreInt64, SwapInt64, dan CompareAndSwapInt64. Dari luar, satu operasi atomik terjadi sekaligus; tidak ada goroutine lain yang bisa mengintip keadaan setengah jadi.\n\nPola counter di bawah memakai dua fungsi: atomic.AddInt64(&total, 1) untuk menaikkan, atomic.LoadInt64(&total) untuk membaca. Disiplinnya satu: akses selalu lewat atomic dari awal sampai akhir. Mencampur, misalnya menulis total = 5 biasa lalu membaca dengan LoadInt64, tetap data race.\n\nBatasnya jelas: atomic mengurus satu operasi pada satu variabel. Begitu invarianmu menyentuh dua variabel, misalnya memindahkan stok dari gudang A ke gudang B dalam satu langkah yang harus utuh, kembali ke mutex. Atomic itu murah, tapi bukan pengganti kunci untuk transaksi.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"sync/atomic\"\n)\n\nfunc main() {\n\tvar total int64\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < 8; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor j := 0; j < 1000; j++ {\n\t\t\t\tatomic.AddInt64(&total, 1)\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n\tfmt.Println(atomic.LoadInt64(&total)) // selalu 8000\n}",
            caption: "Delapan goroutine, delapan ribu penambahan, tanpa satu pun kunci.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi atomic mana yang tepat untuk menaikkan counter int64 dari banyak goroutine?",
          options: [
            "atomic.LoadInt64(&c) + 1",
            "atomic.AddInt64(&c, 1)",
            "c = atomic.StoreInt64(&c, 1)",
            "atomic.CompareAndSwapInt64(&c, 0, 1)",
          ],
          answer: 1,
          explanation:
            "AddInt64 menambah dan menulis dalam satu operasi atomik. Load lalu assignment adalah dua langkah yang bisa saling menimpa.",
        },
        {
          kind: "quiz",
          question: "Kapan atomic tidak cukup dan mutex lebih tepat?",
          options: [
            "Saat menaikkan satu counter int64",
            "Saat menyimpan flag boolean",
            "Saat dua variabel harus berubah konsisten dalam satu langkah",
            "Saat goroutine hanya membaca tanpa menulis",
          ],
          answer: 2,
          explanation:
            "Atomic hanya menjamin satu operasi tunggal. Menjaga invarian lintas beberapa variabel butuh bagian kritis, dan itu pekerjaan mutex.",
        },
      ],
    },
    {
      slug: "fan-out-fan-in",
      title: "Fan-out dan Fan-in",
      summary: "Bagi pekerjaan ke banyak worker, kumpulkan hasilnya kembali, urutkan, cetak.",
      steps: [
        {
          kind: "theory",
          title: "Keran yang dibagi, hasil yang dikumpulkan",
          body: "Fan-out artinya membuka keran yang sama ke banyak worker: satu channel jobs dibaca oleh beberapa goroutine identik, dan tiap pekerjaan diterima tepat satu worker. Fan-in kebalikannya: hasil dari banyak worker dikumpulkan lewat satu channel results. Dengan pola ini jumlah pekerja paralel bisa dinaikkan tanpa mengubah kode pengirim maupun penerima.\n\nSatu detail yang sering menjebak: kapan channel results ditutup. Menutupnya dari dalam worker salah, karena worker lain masih boleh mengirim ke channel yang sudah tertutup, dan itu panic send on closed channel. Pola yang benar: catat semua worker di WaitGroup, lalu satu goroutine kecil menunggu wg.Wait() dan menutup results setelah semua worker benar-benar selesai.\n\nKonsekuensi fan-in: urutan kedatangan hasil tidak bisa dijamin, karena bergantung pada worker mana yang selesai lebih dulu. Kalau keluaran harus berurut, kumpulkan dulu ke slice lalu urutkan sebelum mencetak, atau sertakan indeks pekerjaan dan rapikan di akhir. Latihan di bawah memakai jalan pertama.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"sync\"\n)\n\nfunc main() {\n\tjobs := make(chan int)\n\tresults := make(chan int)\n\tvar wg sync.WaitGroup\n\n\tworker := func() {\n\t\tdefer wg.Done()\n\t\tfor x := range jobs {\n\t\t\tresults <- x * x\n\t\t}\n\t}\n\n\t// fan-out: tiga worker membagi pekerjaan yang sama\n\tfor i := 0; i < 3; i++ {\n\t\twg.Add(1)\n\t\tgo worker()\n\t}\n\n\tgo func() {\n\t\tfor _, x := range []int{4, 1, 3, 2} {\n\t\t\tjobs <- x\n\t\t}\n\t\tclose(jobs)\n\t}()\n\n\t// fan-in: tunggu semua worker, baru tutup results\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(results)\n\t}()\n\n\tvar hasil []int\n\tfor r := range results {\n\t\thasil = append(hasil, r)\n\t}\n\tsort.Ints(hasil)\n\tfmt.Println(hasil)\n}",
            caption: "Urutan kedatangan hasil tak bisa dijamin; sort di akhir yang menjamin keluaran.",
          },
        },
        {
          kind: "quiz",
          question:
            "Mengapa penutupan channel results dilakukan goroutine terpisah setelah wg.Wait(), bukan oleh salah satu worker?",
          options: [
            "Supaya semua worker selesai dulu; menutup lebih awal berisiko panic send on closed channel",
            "Agar results terkirim lebih cepat",
            "Karena close hanya boleh dipanggil dari main",
            "Supaya hasil tidak perlu diurutkan",
          ],
          answer: 0,
          explanation:
            "Goroutine penutup baru berjalan setelah WaitGroup kosong, artinya tidak ada worker yang masih akan mengirim. Menutup dari worker manapun terlalu dini.",
        },
        {
          kind: "code",
          title: "Bangun fan-out tiga worker",
          prompt:
            "Lengkapi tiga kekosongan agar pola fan-out/fan-in utuh: pekerjaan berhenti dikirim setelah semua angka masuk, pengumpul menunggu semua worker selesai, dan channel hasil ditutup. Keluaran: kuadrat semua angka, terurut naik, satu per baris.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\n\tjobs := make(chan int)\n\tresults := make(chan int)\n\tvar wg sync.WaitGroup\n\n\tworker := func() {\n\t\tdefer wg.Done()\n\t\tfor x := range jobs {\n\t\t\tresults <- x * x\n\t\t}\n\t}\n\n\tfor i := 0; i < 3; i++ {\n\t\twg.Add(1)\n\t\tgo worker()\n\t}\n\n\tgo func() {\n\t\tfor _, x := range angka {\n\t\t\tjobs <- x\n\t\t}\n\t\t___(jobs)\n\t}()\n\n\tgo func() {\n\t\twg.___()\n\t\t___(results)\n\t}()\n\n\thasil := make([]int, 0, n)\n\tfor r := range results {\n\t\thasil = append(hasil, r)\n\t}\n\tsort.Ints(hasil)\n\tfor _, v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"sync\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\n\tjobs := make(chan int)\n\tresults := make(chan int)\n\tvar wg sync.WaitGroup\n\n\tworker := func() {\n\t\tdefer wg.Done()\n\t\tfor x := range jobs {\n\t\t\tresults <- x * x\n\t\t}\n\t}\n\n\tfor i := 0; i < 3; i++ {\n\t\twg.Add(1)\n\t\tgo worker()\n\t}\n\n\tgo func() {\n\t\tfor _, x := range angka {\n\t\t\tjobs <- x\n\t\t}\n\t\tclose(jobs)\n\t}()\n\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(results)\n\t}()\n\n\thasil := make([]int, 0, n)\n\tfor r := range results {\n\t\thasil = append(hasil, r)\n\t}\n\tsort.Ints(hasil)\n\tfor _, v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          tests: [
            { stdin: "5\n1 2 3 4 5", expectedOutput: "1\n4\n9\n16\n25" },
            { stdin: "3\n0 -2 7", expectedOutput: "0\n4\n49" },
            { stdin: "4\n3 3 2 1", expectedOutput: "1\n4\n9\n9", hidden: true },
          ],
          hints: [
            "Channel yang tidak akan dikirim lagi harus ditutup supaya range di worker berhenti.",
            "Goroutine penutup harus menunggu semua worker selesai lewat WaitGroup.",
            "Jawabannya: close(jobs), lalu wg.Wait() dan close(results).",
          ],
        },
      ],
    },
    {
      slug: "pipeline-multi-stage",
      title: "Pipeline Multi Tahap",
      summary: "Sambungkan goroutine per tahap lewat channel dan pertahankan urutan data.",
      steps: [
        {
          kind: "theory",
          title: "Pabrik per tahap",
          body: "Pipeline menyusun pekerjaan seperti pabrik: tahap pertama menghasilkan data, tahap berikutnya mengubah, begitu seterusnya sampai selesai. Tiap tahap adalah goroutine yang menerima channel masuk, memproses satu per satu, lalu mengirim ke channel keluar. Data mengalir tanpa harus menampung semuanya di memori.\n\nKunci penutupannya berantai: tahap yang menutup channel masuknya membuat range tahap berikutnya selesai, dan defer close(out) di tahap itu meneruskan sinyal habis ke tahap selanjutnya. Karena setiap tahap hanya satu goroutine yang memproses berurutan, urutan keluaran sama persis dengan urutan masukan.\n\nBandingkan dengan fan-out pada lesson sebelumnya: di sana kecepatan dibeli dengan keacakan urutan. Pipeline murni mempertahankan urutan tapi satu tahap dikerjakan satu goroutine. Kalau satu tahap berat dan urutan boleh dirapikan di akhir, gabungkan keduanya: fan-out di tahap berat, lalu urutkan hasilnya.",
          code: {
            language: "go",
            content:
              "package main\n\nimport \"fmt\"\n\nfunc generator(angka []int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer close(out)\n\t\tfor _, n := range angka {\n\t\t\tout <- n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc kuadrat(in <-chan int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer close(out)\n\t\tfor n := range in {\n\t\t\tout <- n * n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc main() {\n\thasil := kuadrat(generator([]int{2, 5, 1}))\n\tfor v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
            caption: "Tiga tahap tersambung channel; keluaran mengikuti urutan masukan.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam pipeline generator lalu kuadrat, apa jaminan urutan keluarannya?",
          options: [
            "Acak, karena tiap tahap adalah goroutine",
            "Sama seperti urutan masukan, karena tiap tahap meneruskan satu per satu",
            "Kebalikan dari urutan masukan",
            "Bergantung jumlah CPU",
          ],
          answer: 1,
          explanation:
            "Tanpa fan-out, tiap channel diteruskan satu nilai per satu oleh satu goroutine, sehingga urutan masuk dan keluar sama. Fan-out di tengah pipeline yang merusak urutan.",
        },
        {
          kind: "code",
          title: "Sambungkan pipeline dua tahap",
          prompt:
            "Lengkapi tiga kekosongan: tahap `kuadrat` membaca dari channel masuknya, menutup channel keluar saat masukan habis, dan main menyambungkan tahap kuadrat ke generator. Keluaran: hasil kuadrat tiap angka, satu per baris, urutan tetap.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc generator(angka []int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer close(out)\n\t\tfor _, n := range angka {\n\t\t\tout <- n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc kuadrat(in <-chan int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer ___(out)\n\t\tfor n := range ___ {\n\t\t\tout <- n * n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tnums := make([]int, n)\n\tfor i := range nums {\n\t\tfmt.Scan(&nums[i])\n\t}\n\thasil := ___(generator(nums))\n\tfor v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc generator(angka []int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer close(out)\n\t\tfor _, n := range angka {\n\t\t\tout <- n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc kuadrat(in <-chan int) <-chan int {\n\tout := make(chan int)\n\tgo func() {\n\t\tdefer close(out)\n\t\tfor n := range in {\n\t\t\tout <- n * n\n\t\t}\n\t}()\n\treturn out\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tnums := make([]int, n)\n\tfor i := range nums {\n\t\tfmt.Scan(&nums[i])\n\t}\n\thasil := kuadrat(generator(nums))\n\tfor v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          tests: [
            { stdin: "3\n2 5 1", expectedOutput: "4\n25\n1" },
            { stdin: "4\n0 3 -2 5", expectedOutput: "0\n9\n4\n25" },
            { stdin: "2\n10 -7", expectedOutput: "100\n49", hidden: true },
          ],
          hints: [
            "Tahap penerus membaca dari channel masuknya sampai habis.",
            "Channel keluar tahap ditutup begitu masukan habis, dengan defer.",
            "Jawabannya: close, in, dan kuadrat.",
          ],
        },
      ],
    },
    {
      slug: "context-withcancel",
      title: "context.WithCancel: Pembatalan Tersalur",
      summary: "Sinyal berhenti untuk satu pohon goroutine lewat ctx.Done() dan cancel().",
      steps: [
        {
          kind: "theory",
          title: "Satu sinyal untuk semua",
          body: "Membatalkan goroutine secara manual berarti membuat satu channel berhenti untuk tiap goroutine, lalu mengirim ke semuanya. Saat goroutine bertumpuk dan saling memanggil, cara itu cepat berantakan. context adalah jawaban standar Go: satu nilai context.Context dibawa sebagai argumen pertama (kebiasaan menamainya ctx) dan membawa sinyal pembatalan yang bisa diturunkan ke seluruh pohon pemanggilan.\n\ncontext.WithCancel mengembalikan context turunan dan fungsi cancel. Di dalam goroutine, sinyalnya dilihat lewat select pada ctx.Done(), sebuah channel yang ditutup begitu cancel dipanggil. Karena menerima dari channel yang sudah tertutup langsung berjalan, tidak ada sinyal yang hilang walau cancel dipanggil sebelum goroutine sempat menunggu.\n\nDua kebiasaan wajib. Pertama, panggil cancel dengan defer cancel() walau operasi selesai normal: context yang tidak dibatalkan menahan resource sampai induknya dibatalkan. Kedua, ingat bahwa pembatalan itu kooperatif: cancel tidak memaksa goroutine berhenti, goroutine hanya berhenti kalau sendiri memeriksa Done() atau memakai operasi yang mengerti context.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n)\n\nfunc tunggu(ctx context.Context, hasil chan<- string) {\n\t<-ctx.Done() // tertahan di sini sampai cancel() dipanggil\n\thasil <- ctx.Err().Error()\n}\n\nfunc main() {\n\tctx, cancel := context.WithCancel(context.Background())\n\tdefer cancel()\n\n\thasil := make(chan string, 1)\n\tgo tunggu(ctx, hasil)\n\n\tcancel() // menutup Done(); goroutine langsung lepas\n\tfmt.Println(<-hasil)\n}",
            caption: "cancel() menutup Done(); goroutine yang menunggu langsung lepas.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana sifat channel `ctx.Done()` dan kapan goroutine bisa membacanya?",
          options: [
            "Channel berisi pesan error yang dikirim sekali",
            "Channel yang ditutup saat pembatalan; penerimaan langsung berjalan setelah itu",
            "Angka urutan berapa kali context dibatalkan",
            "Channel yang berisi waktu sisa sebelum tenggat",
          ],
          answer: 1,
          explanation:
            "Done() dikosongkan lalu ditutup saat cancel. Menerima dari channel tertutup langsung berjalan tanpa menunggu, sehingga tidak ada sinyal yang lewat.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada goroutine yang sedang `time.Sleep(5 * time.Second)` saat contextnya dibatalkan?",
          options: [
            "Sleep langsung dipotong dan goroutine berhenti",
            "Goroutine tetap tidur sampai waktunya habis; pembatalan tidak memaksa apa pun",
            "Program panic",
            "Goroutine otomatis memanggil cancel balik",
          ],
          answer: 1,
          explanation:
            "Pembatalan bersifat kooperatif. Goroutine berhenti hanya di titik yang memeriksa ctx.Done(); Sleep biasa tidak bisa dibatalkan.",
        },
      ],
    },
    {
      slug: "context-withtimeout",
      title: "context.WithTimeout: Batas Waktu",
      summary: "Beri operasi batas waktu; begitu lewat, Done tertutup dan errornya DeadlineExceeded.",
      steps: [
        {
          kind: "theory",
          title: "Tenggat yang menutup Done()",
          body: "Bentuk pembatalan yang paling sering dipakai di layanan nyata: batas waktu. context.WithTimeout(ctx, d) sama dengan WithDeadline yang tenggatnya waktu sekarang ditambah d. Setelah tenggat lewat, ctx.Done() tertutup dan ctx.Err() berisi context.DeadlineExceeded. Untuk pembatalan manual nilainya context.Canceled; errors.Is dipakai untuk membedakannya.\n\nPola paling umum ada di contoh bawah: pekerjaan berjalan di goroutine lain dan mengirim hasilnya ke channel, sementara pemanggil memilih lewat select antara hasil yang datang dan ctx.Done(). Siapa pun yang datang lebih dulu menang. Dengan begitu pemanggil tidak pernah tergantung selamanya pada pekerjaan yang macet.\n\nPerlu jujur soal batasnya: lewatnya tenggat tidak mematikan goroutine pekerja. Di contoh, pekerja tetap tidur 200 milidetik dan mengirim hasil yang tak dibaca lagi; itulah kenapa channelnya dibuffer. Untuk operasi yang mengerti context secara bawaan, seperti http.NewRequestWithContext atau QueryContext di database, kirimkan ctx supaya pembatalan benar-benar menjangkau pekerjaan itu.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)\n\tdefer cancel()\n\n\thasil := make(chan int, 1)\n\tgo func() {\n\t\ttime.Sleep(200 * time.Millisecond) // meniru pekerjaan lambat\n\t\thasil <- 42\n\t}()\n\n\tselect {\n\tcase v := <-hasil:\n\t\tfmt.Println(\"selesai:\", v)\n\tcase <-ctx.Done():\n\t\tfmt.Println(\"gagal:\", ctx.Err())\n\t}\n}",
            caption: "Pemanggil lepas lewat Done(); goroutine pekerja tetap jalan sampai selesai.",
          },
        },
        {
          kind: "quiz",
          question: "Nilai `ctx.Err()` apa yang muncul ketika batas waktu WithTimeout terlampaui?",
          options: ["context.Canceled", "context.DeadlineExceeded", "nil, karena timeout bukan error", "time.Expired"],
          answer: 1,
          explanation:
            "Tenggat yang lewat menghasilkan context.DeadlineExceeded. context.Canceled hanya muncul karena cancel() dipanggil manual.",
        },
        {
          kind: "quiz",
          question: "Setelah cabang `<-ctx.Done()` dalam select dieksekusi, apa yang terjadi pada goroutine pekerja di belakang?",
          options: [
            "Goroutine pekerja ikut berhenti otomatis",
            "Goroutine pekerja tetap berjalan; hasilnya ditampung buffer atau tidak dibaca siapa pun",
            "Channel hasil ditutup otomatis oleh context",
            "Timer diatur ulang dari awal",
          ],
          answer: 1,
          explanation:
            "Select memilih satu cabang saja; goroutine lain tak tersentuh. Karena channelnya dibuffer, pengiriman terakhir tidak menggantung goroutine.",
        },
      ],
    },
    {
      slug: "errgroup-konsep",
      title: "errgroup: WaitGroup Plus Error",
      summary: "Menunggu banyak goroutine sekaligus mengambil error pertamanya, dari golang.org/x/sync/errgroup.",
      steps: [
        {
          kind: "theory",
          title: "Error pertama yang menang",
          body: "Menggabungkan banyak goroutine yang bisa gagal dengan WaitGroup murni butuh tambahan: tempat menampung error pertama, plus kunci kecil supaya penulisan errornya sendiri tidak berlomba. Pola ini muncul berulang-ulang sampai akhirnya dibungkus jadi package kecil: golang.org/x/sync/errgroup.\n\nCaranya: var g errgroup.Group, lalu kirim tiap pekerjaan dengan g.Go(func() error { ... }). g.Wait() menunggu semuanya selesai dan mengembalikan error pertama yang pernah dikembalikan salah satu goroutine; kalau semuanya sukses, nil. Perhatikan kata pertama: error kedua dan seterusnya tidak ditampung.\n\nVersi yang paling berguna: g, ctx := errgroup.WithContext(ctx). Context yang dikembalikan otomatis dibatalkan begitu satu goroutine mengembalikan error, sehingga goroutine lain yang memantau ctx.Done() bisa berhenti lebih awal, bukan menyelesaikan pekerjaan yang hasilnya sudah pasti dibuang. Catatan penting: errgroup bukan stdlib dan perlu go get, jadi latihan platform ini menulis pola setaranya manual dengan WaitGroup dan channel.",
          code: {
            language: "go",
            content:
              "// package eksternal: golang.org/x/sync/errgroup\nfunc unduhSemua(url []string) error {\n\tg, ctx := errgroup.WithContext(context.Background())\n\tfor _, u := range url {\n\t\tg.Go(func() error {\n\t\t\treturn unduh(ctx, u)\n\t\t})\n\t}\n\treturn g.Wait() // error pertama, atau nil\n}",
            caption: "Satu Wait() menampung nasib semua goroutine yang dikirim lewat g.Go.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `g.Wait()` pada errgroup ketika beberapa goroutine mengembalikan error?",
          options: [
            "Slice berisi semua error",
            "Error pertama yang dikembalikan salah satu goroutine",
            "Error terakhir yang dikembalikan",
            "nil selalu; error harus dikumpulkan sendiri",
          ],
          answer: 1,
          explanation:
            "errgroup menyimpan error pertama yang pernah terjadi dan mengembalikannya di Wait. Error berikutnya diabaikan.",
        },
        {
          kind: "quiz",
          question: "Apa efek errgroup.WithContext ketika satu goroutine mengembalikan error?",
          options: [
            "Semua goroutine dimatikan paksa",
            "Context hasilnya dibatalkan; goroutine yang memantau Done() bisa berhenti lebih awal",
            "Program berhenti dengan exit code 1",
            "Error dikonversi jadi panic",
          ],
          answer: 1,
          explanation:
            "Context turunan dibatalkan otomatis. Berhenti atau tidaknya goroutine lain tetap tergantung pada apakah mereka memeriksa ctx.Done().",
        },
      ],
    },
    {
      slug: "latihan-worker-pool",
      title: "Latihan: Worker Pool dan Semaphore",
      summary:
        "Batasi jumlah goroutine dengan semaphore channel, lalu bangun pool tiga pekerja yang hasilnya dijamin berurut.",
      steps: [
        {
          kind: "theory",
          title: "Channel buffer sebagai semaphore",
          body: "Meluncurkan satu goroutine untuk tiap pekerjaan terasa praktis sampai jumlahnya ribuan dan tiap goroutine membuka koneksi atau file. Batasi jumlahnya dengan semaphore sederhana: buffered channel berkapasitas N. Sebelum bekerja, goroutine mengisi token dengan sem <- struct{}{}; setelah selesai, melepasnya dengan <-sem. Maksimal N goroutine berada di dalam pada satu waktu, sisanya menunggu.\n\nBentuk lain yang setara: worker pool tetap. Sekelompok goroutine pekerja, misalnya tiga, membaca satu channel jobs sampai channelnya ditutup. Untuk banyak pekerjaan kecil, pool ini lebih hemat daripada membuat goroutine per pekerjaan, dan jumlah pekerja paralel tertulis eksplisit di satu tempat.\n\nLatihan di bawah menggabungkan hampir semua yang ada di modul ini: pool tiga pekerja di atas channel jobs, hasil dikumpulkan lewat channel results dengan WaitGroup dan close yang benar, lalu diurutkan sebelum dicetak supaya keluarannya deterministik. Pola yang sama, dengan ukuran pool dari konfigurasi, adalah bentuk dasar banyak library pekerja di proyek nyata.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\nfunc main() {\n\tpekerjaan := []int{5, 1, 9, 3}\n\tsem := make(chan struct{}, 2) // maksimal 2 goroutine sekaligus\n\tvar wg sync.WaitGroup\n\n\tfor _, p := range pekerjaan {\n\t\twg.Add(1)\n\t\tgo func(n int) {\n\t\t\tdefer wg.Done()\n\t\t\tsem <- struct{}{} // ambil token\n\t\t\tdefer func() { <-sem }() // lepas token\n\t\t\tfmt.Println(\"memproses\", n) // urutan tampil bisa berbeda\n\t\t}(p)\n\t}\n\twg.Wait()\n}",
            caption: "Dua token berarti maksimal dua goroutine memproses bersamaan; sisanya antre di semaphore.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan `sem := make(chan struct{}, 4)` dan pola ambil-lepas token, berapa goroutine maksimal yang berada di bagian kerja bersamaan?",
          options: ["1", "4", "Sebanyak jumlah pekerjaan yang dikirim", "Tidak terbatas"],
          answer: 1,
          explanation:
            "Kapasitas buffer adalah jumlah token. Saat keempat token terisi, goroutine berikutnya menunggu sampai ada yang melepas tokennya.",
        },
        {
          kind: "code",
          title: "Bangun pool tiga pekerja",
          prompt:
            "Lengkapi tiga kekosongan: pekerja menandai dirinya selesai, pendaftaran pekerja menambah WaitGroup, dan hasil diurutkan sebelum dicetak. Tiap pekerja menghitung jumlah digit angka. Keluaran: hasil penghitungan terurut naik, satu per baris.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"sync\"\n)\n\nfunc jumlahDigit(n int) int {\n\tif n < 0 {\n\t\tn = -n\n\t}\n\ttotal := 0\n\tfor n > 0 {\n\t\ttotal += n % 10\n\t\tn /= 10\n\t}\n\treturn total\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\n\tjobs := make(chan int)\n\tresults := make(chan int)\n\tvar wg sync.WaitGroup\n\n\tpekerja := func() {\n\t\tdefer wg.___()\n\t\tfor x := range jobs {\n\t\t\tresults <- jumlahDigit(x)\n\t\t}\n\t}\n\n\tfor i := 0; i < 3; i++ {\n\t\twg.___(1)\n\t\tgo pekerja()\n\t}\n\n\tgo func() {\n\t\tfor _, x := range angka {\n\t\t\tjobs <- x\n\t\t}\n\t\tclose(jobs)\n\t}()\n\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(results)\n\t}()\n\n\thasil := make([]int, 0, n)\n\tfor r := range results {\n\t\thasil = append(hasil, r)\n\t}\n\tsort.___(hasil)\n\tfor _, v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n\t\"sync\"\n)\n\nfunc jumlahDigit(n int) int {\n\tif n < 0 {\n\t\tn = -n\n\t}\n\ttotal := 0\n\tfor n > 0 {\n\t\ttotal += n % 10\n\t\tn /= 10\n\t}\n\treturn total\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\n\tjobs := make(chan int)\n\tresults := make(chan int)\n\tvar wg sync.WaitGroup\n\n\tpekerja := func() {\n\t\tdefer wg.Done()\n\t\tfor x := range jobs {\n\t\t\tresults <- jumlahDigit(x)\n\t\t}\n\t}\n\n\tfor i := 0; i < 3; i++ {\n\t\twg.Add(1)\n\t\tgo pekerja()\n\t}\n\n\tgo func() {\n\t\tfor _, x := range angka {\n\t\t\tjobs <- x\n\t\t}\n\t\tclose(jobs)\n\t}()\n\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(results)\n\t}()\n\n\thasil := make([]int, 0, n)\n\tfor r := range results {\n\t\thasil = append(hasil, r)\n\t}\n\tsort.Ints(hasil)\n\tfor _, v := range hasil {\n\t\tfmt.Println(v)\n\t}\n}",
          tests: [
            { stdin: "5\n12 99 100 7 50", expectedOutput: "1\n3\n5\n7\n18" },
            { stdin: "4\n10 20 30 40", expectedOutput: "1\n2\n3\n4" },
            { stdin: "6\n9 999 0 1234 55 8", expectedOutput: "0\n8\n9\n10\n10\n27", hidden: true },
          ],
          hints: [
            "Pekerja menandai dirinya selesai dengan Done; pendaftaran pekerja pakai pasangannya.",
            "Pengurutan angka di package sort untuk []int bernama Ints.",
            "Jawabannya: Done, Add, dan Ints.",
          ],
        },
      ],
    },
    // ==================== MODUL 7: Stdlib Inti ====================
    {
      slug: "strings-package",
      title: "Package strings: Pisah, Sambung, Rapikan",
      summary: "Split, Join, Fields, TrimSpace, dan Contains untuk pekerjaan teks harian.",
      steps: [
        {
          kind: "theory",
          title: "Kotak peralatan teks",
          body: "Package strings adalah kotak peralatan teks yang paling sering dibuka. Beberapa fungsi yang layak hafal: Contains untuk mengecek keberadaan substring, HasPrefix dan HasSuffix untuk awalan dan akhiran, ToUpper dan ToLower untuk kapitalisasi, ReplaceAll untuk menukar substring, serta TrimSpace yang menghapus spasi, tab, dan karakter akhir baris di kedua ujung teks.\n\nPasangan paling produktif: Split memecah string jadi slice berdasarkan pemisah, Join menyambung slice string jadi satu dengan pemisah baru. Sementara Fields memecah pada runtunan spasi apa pun tanpa menghasilkan elemen kosong. Untuk input pengguna yang spasinya tak terduga, Fields lebih toleran; untuk format yang ketat, Split eksplisit lebih jujur.\n\nSatu contoh yang menunjukkan bedanya: strings.Split(\"a  b\", \" \") dengan dua spasi di tengah menghasilkan tiga elemen, yaitu \"a\", string kosong, dan \"b\". strings.Fields(\"a  b\") menghasilkan dua. Kalau programmu kemudian menghitung jumlah kata atau mengakses indeks, beda kecil ini jadi beda besar.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\tkalimat := \"  belajar go seru  \"\n\tkata := strings.Fields(kalimat)\n\tfmt.Println(len(kata), kata)\n\tfmt.Println(strings.Join(kata, \"-\"))\n\tfmt.Println(strings.Contains(kalimat, \"go\"))\n\tfmt.Println(strings.ToUpper(strings.TrimSpace(kalimat)))\n}",
            caption: "Fields merapikan spasi berlebih; Join menyusun ulang dengan pemisah baru.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `strings.Split(\"a  b\", \" \")` (dua spasi di tengah)?",
          options: [
            "Slice berisi \"a\", \"\", dan \"b\"",
            "Slice berisi \"a\" dan \"b\" saja",
            "Error karena spasi ganda",
            "Slice berisi satu elemen \"a  b\"",
          ],
          answer: 0,
          explanation:
            "Split memotong pada setiap pemisah; spasi kedua menghasilkan elemen kosong di antaranya. Fields yang melewatkan elemen kosong.",
        },
        {
          kind: "code",
          title: "Sambung dan periksa kata",
          prompt:
            "Lengkapi dua kekosongan: gabungkan slice kata menjadi satu string berpemisah tanda hubung, lalu periksa apakah hasilnya mengandung substring go. Input: n, lalu n kata. Keluaran tiga baris: hasil pemeriksaan, jumlah kata, dan hasil penyambungan.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tkata := make([]string, n)\n\tfor i := range kata {\n\t\tfmt.Scan(&kata[i])\n\t}\n\tsambung := strings.___(kata, \"-\")\n\tfmt.Println(strings.___(sambung, \"go\"))\n\tfmt.Println(len(kata))\n\tfmt.Println(sambung)\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tkata := make([]string, n)\n\tfor i := range kata {\n\t\tfmt.Scan(&kata[i])\n\t}\n\tsambung := strings.Join(kata, \"-\")\n\tfmt.Println(strings.Contains(sambung, \"go\"))\n\tfmt.Println(len(kata))\n\tfmt.Println(sambung)\n}",
          tests: [
            { stdin: "4\nbelajar go itu seru", expectedOutput: "true\n4\nbelajar-go-itu-seru" },
            { stdin: "3\ngo go go", expectedOutput: "true\n3\ngo-go-go" },
            { stdin: "2\nsatu dua", expectedOutput: "false\n2\nsatu-dua", hidden: true },
          ],
          hints: [
            "Menyambung slice string dengan pemisah: satu fungsi di package strings yang berawalan J.",
            "Cek keberadaan substring: fungsi yang mengembalikan bool, namanya berawalan Con.",
            "Jawabannya: Join dan Contains.",
          ],
        },
      ],
    },
    {
      slug: "strconv-parsing",
      title: "strconv: Teks Jadi Angka",
      summary: "Atoi dan ParseFloat mengubah teks jadi angka dengan pola (nilai, error); Itoa arah sebaliknya.",
      steps: [
        {
          kind: "theory",
          title: "Pola (nilai, error)",
          body: "Semua masukan dari luar, stdin, argumen, file, datang sebagai string. Package strconv yang mengubahnya jadi angka. Fungsi utamanya: strconv.Atoi untuk bilangan bulat dan strconv.ParseFloat untuk desimal, keduanya mengembalikan dua nilai, hasil dan error. Arah sebaliknya: strconv.Itoa mengubah int jadi string, dan FormatInt untuk basis lain.\n\nPola (nilai, error) ini wajib dihormati: selalu periksa err sebelum memakai nilai. Kalau parse gagal, nilainya 0 dan err menjelaskan sebabnya, misalnya strconv.Atoi: parsing \"abc\": invalid syntax. Mengabaikan error berarti programmu diam-diam memakai 0 untuk input yang tidak sah, bug yang sukar dilacak.\n\nDetail parsing yang menghemat waktu debugging: Atoi menerima tanda plus dan minus serta awalan nol, jadi \"+3\" dan \"08\" sah, tapi spasi di mana pun tidak, \" 12\" gagal dengan invalid syntax. Kalau butuh kontrol penuh, ParseInt(s, 10, 64) adalah versi panjangnya dengan basis dan lebar bit yang bisa diatur.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tfor _, s := range []string{\"12\", \"-5\", \"3.5\", \"abc\", \"08\"} {\n\t\tif v, err := strconv.Atoi(s); err == nil {\n\t\t\tfmt.Println(s, \"=> int\", v)\n\t\t} else if f, err := strconv.ParseFloat(s, 64); err == nil {\n\t\t\tfmt.Println(s, \"=> float\", f)\n\t\t} else {\n\t\t\tfmt.Println(s, \"=> bukan angka\")\n\t\t}\n\t}\n}",
            caption: "Coba Atoi dulu, turun ke ParseFloat, terakhir nyatakan gagal.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `strconv.Atoi(\"08\")`?",
          options: [
            "Error, karena angka berawalan nol dianggap oktal",
            "(8, nil)",
            "(0, error invalid syntax)",
            "(8.0, nil)",
          ],
          answer: 1,
          explanation:
            "Atoi mem-parse basis 10, jadi awalan nol tidak masalah; tanda plus dan minus juga diterima. Yang ditolak adalah spasi dan karakter lain.",
        },
        {
          kind: "code",
          title: "Pembagi dua angka",
          prompt:
            "Lengkapi tiga kekosongan: ubah teks ke bilangan bulat, periksa errornya, dan ubah hasil dua kali lipatnya kembali ke string untuk dicetak. Input: n, lalu n token. Token bukan bilangan bulat dicetak sebagai gagal.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar s string\n\t\tfmt.Scan(&s)\n\t\tv, err := strconv.___(s)\n\t\tif ___ != nil {\n\t\t\tfmt.Println(\"gagal:\", s)\n\t\t\tcontinue\n\t\t}\n\t\tfmt.Println(\"ok:\", strconv.___(v*2))\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar s string\n\t\tfmt.Scan(&s)\n\t\tv, err := strconv.Atoi(s)\n\t\tif err != nil {\n\t\t\tfmt.Println(\"gagal:\", s)\n\t\t\tcontinue\n\t\t}\n\t\tfmt.Println(\"ok:\", strconv.Itoa(v*2))\n\t}\n}",
          tests: [
            { stdin: "3\n12 ab 7", expectedOutput: "ok: 24\ngagal: ab\nok: 14" },
            { stdin: "2\n-5 08", expectedOutput: "ok: -10\nok: 16" },
            { stdin: "2\n0 +3", expectedOutput: "ok: 0\nok: 6", hidden: true },
          ],
          hints: [
            "Fungsi pengubah string ke int di strconv berawalan huruf A.",
            "Atoi mengembalikan dua nilai; nilai kedua yang perlu dibandingkan dengan nil.",
            "Jawabannya: Atoi, err, dan Itoa.",
          ],
        },
      ],
    },
    {
      slug: "time-layout-parsing",
      title: "time: Layout dan Parsing Tanggal",
      summary: "Parse dan format tanggal dengan layout contoh 2006-01-02 dan 02/01/2006.",
      steps: [
        {
          kind: "theory",
          title: "Layout ditulis dengan contoh",
          body: "Format tanggal Go terlihat aneh pada pandangan pertama karena layoutnya ditulis dengan contoh waktu, bukan simbol. Waktu rujukannya: Mon Jan 2 15:04:05 MST 2006. Ingat urutannya 1 2 3 4 5 6: 01 bulan, 02 hari, 03 jam (ditulis 15 untuk format 24 jam), 04 menit, 05 detik, 06 tahun.\n\ntime.Parse(layout, teks) membedah teks sesuai layout dan mengembalikan time.Time plus error; t.Format(layout) bekerja ke arah sebaliknya. Jadi mem-parse 25/12/2023 butuh layout 02/01/2006, sedangkan mencetak ISO memakai 2006-01-02. Layout yang tidak cocok dengan bentuk teks menghasilkan error parsing, dan pesannya menyebut posisi yang gagal.\n\nHasil Parse untuk teks tanpa keterangan zona berada di UTC. Untuk tanggal murni seperti tanggal lahir atau tenggat itu tidak masalah, tapi hati-hati mencampurnya dengan time.Now() yang berzona lokal ketika waktunya dekat tengah malam: selisih zona bisa menggeser tanggal satu hari.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tt, err := time.Parse(\"02/01/2006\", \"17/08/1945\")\n\tif err != nil {\n\t\tfmt.Println(\"gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(t.Format(\"2006-01-02\"))\n\tfmt.Println(t.Weekday())\n}",
            caption: "Layout 02/01/2006 berarti hari/bulan/tahun; Weekday() mengikuti tanggalnya.",
          },
        },
        {
          kind: "quiz",
          question: "Layout apa yang tepat untuk mem-parse teks `2024-03-09`?",
          options: ["02/01/2006", "2006-01-02", "%Y-%m-%d", "2006-02-01"],
          answer: 1,
          explanation:
            "Tahun dulu (2006), lalu bulan (01), lalu hari (02), dipisah tanda minus. 02/01/2006 untuk teks hari/bulan/tahun seperti 09/03/2024.",
        },
        {
          kind: "code",
          title: "Konversi tanggal dan nama hari",
          prompt:
            "Lengkapi dua layout: satu untuk mem-parse masukan berformat hari/bulan/tahun, satu untuk mencetak dalam format tahun-bulan-hari. Baris ketiga mencetak nama hari Indonesia. Input: satu tanggal, contoh 25/12/2023.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar masukan string\n\tfmt.Scan(&masukan)\n\thari := [7]string{\"Minggu\", \"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\"}\n\n\tt, err := time.Parse(\"___\", masukan)\n\tif err != nil {\n\t\tfmt.Println(\"format salah\")\n\t\treturn\n\t}\n\tfmt.Println(t.Format(\"___\"))\n\tfmt.Println(hari[t.Weekday()])\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar masukan string\n\tfmt.Scan(&masukan)\n\thari := [7]string{\"Minggu\", \"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\"}\n\n\tt, err := time.Parse(\"02/01/2006\", masukan)\n\tif err != nil {\n\t\tfmt.Println(\"format salah\")\n\t\treturn\n\t}\n\tfmt.Println(t.Format(\"2006-01-02\"))\n\tfmt.Println(hari[t.Weekday()])\n}",
          tests: [
            { stdin: "25/12/2023", expectedOutput: "2023-12-25\nSenin" },
            { stdin: "01/01/2024", expectedOutput: "2024-01-01\nSenin" },
            { stdin: "17/08/1945", expectedOutput: "1945-08-17\nJumat", hidden: true },
          ],
          hints: [
            "Layout ditulis dengan angka waktu rujukan: 02 untuk hari, 01 untuk bulan, 2006 untuk tahun.",
            "Keluaran minta format ISO: tahun-bulan-hari.",
            "Jawabannya: 02/01/2006 dan 2006-01-02.",
          ],
        },
      ],
    },
    {
      slug: "time-durasi",
      title: "time.Duration: Menghitung Waktu",
      summary: "Duration adalah bilangan nanodetik: bandingkan, jumlahkan, pecah ke satuan.",
      steps: [
        {
          kind: "theory",
          title: "Nanodetik yang enak dibaca",
          body: "time.Duration adalah int64 yang hitungannya nanodetik, dibungkus konstanta yang enak dibaca: time.Second, time.Minute, time.Hour, time.Millisecond. time.ParseDuration(\"1h30m\") mengubah teks jadi Duration; satuannya boleh ns, us, ms, s, m, dan h, boleh bertumpuk seperti 1h30m, dan boleh negatif.\n\nAritmetikanya aritmetika bilangan biasa: d1 + d2 menjumlah, d1 > d2 membandingkan, dan pembagian dengan konstanta time memecah ke satuan tertentu. Satu jebakan tipe: Duration dibagi Duration menghasilkan Duration lagi, jadi (d1 + d2) / time.Minute tetap bertipe time.Duration dan tercetak 135ns, bukan 135. Bungkus kedua sisi dengan int64 supaya dapat angka polos: int64(d1+d2) / int64(time.Minute) menghasilkan jumlah menit utuh karena pembagian bilangan bulat membuang sisa. Kalau butuh desimal, pakai metode seperti d.Seconds() yang mengembalikan float64.\n\nJangan tertukar antara rentang dan saat: Duration untuk selisih dan lama, time.Time untuk titik waktu. Selisih dua waktu dihitung dengan t2.Sub(t1), dan perbandingannya lewat t.Before(t2) atau t.After(t2). Semuanya tetap bilangan di balik layar, tapi istilah yang tepat membuat kode bisa dibaca.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\td1, _ := time.ParseDuration(\"1h30m\")\n\td2, _ := time.ParseDuration(\"45m\")\n\tfmt.Println(d1 > d2)                    // true\n\tfmt.Println(d2.Seconds())               // 2700\n\tfmt.Println(int64(d1+d2) / int64(time.Minute)) // 135\n\tfmt.Println(time.Duration(90)*time.Minute < d1) // false\n}",
            caption: "Duration adalah bilangan; bagi dengan konstanta time untuk pindah satuan.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `time.ParseDuration(\"90m\") == time.ParseDuration(\"1h30m\")`?",
          options: [
            "false, karena satuannya berbeda",
            "true, keduanya 5400 detik",
            "Tidak bisa dibandingkan, harus lewat Before/After",
            "Error saat kompilasi",
          ],
          answer: 1,
          explanation:
            "Duration murni bilangan nanodetik. 90 menit dan 1 jam 30 menit bernilai sama persis, jadi perbandingannya true.",
        },
        {
          kind: "code",
          title: "Perbaiki konversi menit",
          prompt:
            "Program ini membandingkan dua durasi lalu mencetak total keduanya dalam menit utuh. Angkanya jelas jauh lebih besar dari seharusnya: cari satu kesalahannya dan perbaiki. Input: dua teks durasi, contoh 1h30m 45m.",
          mode: "fix",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar a, b string\n\tfmt.Scan(&a, &b)\n\td1, err1 := time.ParseDuration(a)\n\td2, err2 := time.ParseDuration(b)\n\tif err1 != nil || err2 != nil {\n\t\tfmt.Println(\"durasi tidak valid\")\n\t\treturn\n\t}\n\tswitch {\n\tcase d1 > d2:\n\t\tfmt.Println(\"pertama lebih lama\")\n\tcase d1 < d2:\n\t\tfmt.Println(\"kedua lebih lama\")\n\tdefault:\n\t\tfmt.Println(\"sama lama\")\n\t}\n\tfmt.Println(int64(d1+d2) / int64(time.Second), \"menit total\")\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar a, b string\n\tfmt.Scan(&a, &b)\n\td1, err1 := time.ParseDuration(a)\n\td2, err2 := time.ParseDuration(b)\n\tif err1 != nil || err2 != nil {\n\t\tfmt.Println(\"durasi tidak valid\")\n\t\treturn\n\t}\n\tswitch {\n\tcase d1 > d2:\n\t\tfmt.Println(\"pertama lebih lama\")\n\tcase d1 < d2:\n\t\tfmt.Println(\"kedua lebih lama\")\n\tdefault:\n\t\tfmt.Println(\"sama lama\")\n\t}\n\tfmt.Println(int64(d1+d2) / int64(time.Minute), \"menit total\")\n}",
          tests: [
            { stdin: "1h30m 45m", expectedOutput: "pertama lebih lama\n135 menit total" },
            { stdin: "90m 1h30m", expectedOutput: "sama lama\n180 menit total" },
            { stdin: "500ms 2m", expectedOutput: "kedua lebih lama\n2 menit total", hidden: true },
          ],
          hints: [
            "Jalankan dulu: angkanya 60 kali lebih besar dari seharusnya.",
            "Yang dibagi adalah satu detik, padahal label keluarannya menit.",
            "Ganti time.Second menjadi time.Minute.",
          ],
        },
      ],
    },
    {
      slug: "os-args-flag",
      title: "os.Args dan flag",
      summary: "Baca argumen program dari os.Args dan opsi bertipe lewat package flag.",
      steps: [
        {
          kind: "theory",
          title: "Argumen program",
          body: "Program baris perintah mewarisi argumennya lewat os.Args, sebuah []string. Indeks 0 adalah nama atau path program itu sendiri, jadi argumen dari pengguna mulai di os.Args[1:]. Cara manualnya: loop dan bandingkan string. Cara standarnya: package flag.\n\nflag mendeklarasikan opsi bertipe: flag.Int(\"ulang\", 1, \"keterangan\"), flag.String, flag.Bool, lalu satu kali flag.Parse(). Setelah itu pengguna bisa menulis -ulang 3 atau -ulang=3, dan -h otomatis menampilkan daftar opsi. Nilai baliknya pointer, sehingga dipakai dengan *ulang.\n\nDi platform ini latihan dijalankan tanpa argumen baris perintah, jadi step kodenya mensimulasikan: satu baris stdin berisi argumen, token pertama dianggap nama program dan dilewati seperti os.Args[1:]. Pola parsing kunci=nilai di latihan itu juga bentuk sederhana dari parser opsi sendiri, berguna saat flag bawaan kurang pas.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"flag\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tulang := flag.Int(\"ulang\", 1, \"berapa kali menyapa\")\n\tnama := flag.String(\"nama\", \"kawan\", \"nama yang disapa\")\n\tflag.Parse()\n\n\tfor i := 0; i < *ulang; i++ {\n\t\tfmt.Println(\"Halo,\", *nama)\n\t}\n}",
            caption: "Tanpa flag, nilai default dipakai; *ulang karena flag.Int mengembalikan pointer.",
          },
        },
        {
          kind: "quiz",
          question: "Pada `os.Args`, apa isi indeks 0 saat program dijalankan?",
          options: [
            "Argumen pertama dari pengguna",
            "Nama atau path program itu sendiri",
            "String kosong",
            "Jumlah argumen",
          ],
          answer: 1,
          explanation:
            "Indeks 0 selalu programnya sendiri. Itu sebabnya argumen pengguna dibaca mulai dari os.Args[1:].",
        },
        {
          kind: "code",
          title: "Simulasi parsing argumen",
          prompt:
            "Lengkapi dua kekosongan: mulai iterasi dari argumen pertama pengguna (token pertama adalah nama program), lalu potong tiap argumen pada tanda sama dengan maksimal dua bagian. Argumen tanpa tanda sama dengan dilaporkan tanpa nilai. Input: satu baris argumen.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\targumen := strings.Fields(scanner.Text())\n\n\t// argumen[0] meniru nama program, jadi dilewati seperti os.Args[1:]\n\tfor _, arg := range argumen[___:] {\n\t\tbagian := strings.___(arg, \"=\", 2)\n\t\tif len(bagian) == 2 {\n\t\t\tfmt.Println(bagian[0] + \": \" + bagian[1])\n\t\t} else {\n\t\t\tfmt.Println(\"tanpa nilai:\", arg)\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\targumen := strings.Fields(scanner.Text())\n\n\t// argumen[0] meniru nama program, jadi dilewati seperti os.Args[1:]\n\tfor _, arg := range argumen[1:] {\n\t\tbagian := strings.SplitN(arg, \"=\", 2)\n\t\tif len(bagian) == 2 {\n\t\t\tfmt.Println(bagian[0] + \": \" + bagian[1])\n\t\t} else {\n\t\t\tfmt.Println(\"tanpa nilai:\", arg)\n\t\t}\n\t}\n}",
          tests: [
            { stdin: "app nama=Budi umur=17", expectedOutput: "nama: Budi\numur: 17" },
            { stdin: "cli verbose", expectedOutput: "tanpa nilai: verbose" },
            { stdin: "prog a=1 b=x=y", expectedOutput: "a: 1\nb: x=y", hidden: true },
          ],
          hints: [
            "Sama seperti os.Args, elemen pertama adalah nama program, jadi mulai dari indeks 1.",
            "Fungsi yang memotong string maksimal n bagian bernama SplitN.",
            "Jawabannya: 1 dan SplitN.",
          ],
        },
      ],
    },
    {
      slug: "bufio-scanner-stdin",
      title: "bufio.Scanner: Membaca Baris demi Baris",
      summary: "Iterasi stdin baris demi baris dengan scanner.Scan() dan scanner.Text().",
      steps: [
        {
          kind: "theory",
          title: "Dari io.Reader ke Scanner",
          body: "Modul 4 sudah memperkenalkan io.Reader: interface satu metode, Read(p []byte), yang terlalu mentah untuk membaca baris. Package bufio menyelipkan buffer di antaranya. bufio.Scanner adalah cara paling ringkas mengiterasi masukan per baris: scanner.Scan() maju ke baris berikutnya dan mengembalikan false saat habis, scanner.Text() memberi isi baris tanpa karakter akhir baris.\n\nPola lengkapnya di contoh bawah. Setelah loop, scanner.Err() membedakan berhenti karena habis atau karena error baca, misalnya baris yang lebih panjang dari buffer default 64KB (bufio.Scanner: token too long). Untuk file log atau baris yang bisa sangat panjang, perbesar dengan scanner.Buffer(buf, ukuran).\n\nScanner memisah baris lewat fungsi ScanLines, yang juga membuang \\r di akhir baris Windows. Baris kosong di tengah masukan tetap terbaca sebagai string kosong; hanya baris kosong di ujung yang tidak menghasilkan token. Kombinasi Scan dan Text ini yang dipakai terus untuk soal stdin multi baris.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tnomor := 1\n\tfor scanner.Scan() {\n\t\tfmt.Printf(\"%d: %s\\n\", nomor, scanner.Text())\n\t\tnomor++\n\t}\n\tif err := scanner.Err(); err != nil {\n\t\tfmt.Println(\"baca gagal:\", err)\n\t}\n}",
            caption: "Scan() maju satu baris per panggilan; loop selesai sendiri saat input habis.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah loop `for scanner.Scan()` selesai, cara memastikan loop berhenti karena habis dan bukan karena error adalah:",
          options: [
            "Cek scanner.Err() setelah loop",
            "Cek scanner.Text() == \"\"",
            "Panggil scanner.Scan() sekali lagi",
            "Scanner tidak pernah error",
          ],
          answer: 0,
          explanation:
            "Scan mengembalikan false baik saat habis maupun saat error. scanner.Err() bernilai nil bila sebelumnya benar-benar habis.",
        },
        {
          kind: "code",
          title: "Perbaiki pemilih baris terpanjang",
          prompt:
            "Program membaca semua baris sampai habis lalu melaporkan jumlah baris dan baris terpanjang. Saat ada dua baris sama panjang, yang muncul lebih dulu yang harus menang, tapi hasil sekarang kebalikannya. Cari satu kesalahannya dan perbaiki. Input: beberapa baris teks.",
          mode: "fix",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tjumlah := 0\n\tterpanjang := \"\"\n\tfor scanner.Scan() {\n\t\tbaris := scanner.Text()\n\t\tjumlah++\n\t\tif len(baris) >= len(terpanjang) {\n\t\t\tterpanjang = baris\n\t\t}\n\t}\n\tif err := scanner.Err(); err != nil {\n\t\tfmt.Println(\"baca gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(jumlah, \"baris\")\n\tfmt.Println(\"terpanjang:\", terpanjang)\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tjumlah := 0\n\tterpanjang := \"\"\n\tfor scanner.Scan() {\n\t\tbaris := scanner.Text()\n\t\tjumlah++\n\t\tif len(baris) > len(terpanjang) {\n\t\t\tterpanjang = baris\n\t\t}\n\t}\n\tif err := scanner.Err(); err != nil {\n\t\tfmt.Println(\"baca gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(jumlah, \"baris\")\n\tfmt.Println(\"terpanjang:\", terpanjang)\n}",
          tests: [
            { stdin: "alpha\nbeta\ngamma\nmu", expectedOutput: "4 baris\nterpanjang: alpha" },
            { stdin: "go\nkotlin\nrust", expectedOutput: "3 baris\nterpanjang: kotlin" },
            { stdin: "a\nbb\ncc", expectedOutput: "3 baris\nterpanjang: bb", hidden: true },
          ],
          hints: [
            "Coba input dengan dua baris sama panjang: pemenangnya yang terakhir, padahal harus yang pertama.",
            "Kondisi sekarang juga menerima baris yang sama panjang, bukan hanya yang lebih panjang.",
            "Ganti >= menjadi >.",
          ],
        },
      ],
    },
    {
      slug: "json-marshal-unmarshal",
      title: "encoding/json: Marshal dan Unmarshal",
      summary: "Ubah struct jadi teks JSON dan kembali lagi, dengan pola (hasil, error) yang sama seperti strconv.",
      steps: [
        {
          kind: "theory",
          title: "Dua arah, satu pola",
          body: "json.Marshal(v) mengubah nilai Go menjadi []byte berisi JSON; json.Unmarshal(data, &tujuan) sebaliknya, mengisi nilai dari teks JSON. Keduanya mengembalikan error. Marshal bisa gagal pada tipe yang tak punya padanan JSON seperti channel atau func; Unmarshal gagal bila teks bukan JSON sah atau tipenya tidak cocok.\n\nPencocokan kunci pada struct: nama field dicocokkan dengan kunci JSON tanpa memandang besar kecilnya huruf, tapi idiomanya menempel struct tag seperti json:\"nama\" supaya kunci JSON tetap lowercase, tag yang sudah kamu kenal di modul 3. Field yang tidak ada di JSON tetap zero value; kunci JSON yang tidak punya field diabaikan tanpa suara, nyaman untuk data yang bisa bertambah.\n\nDua jebakan kecil. Unmarshal butuh alamat tujuan, &s; tanpa pointer ia menolak dengan error non-pointer saat runtime, bukan saat kompilasi. Dan Marshal mencetak kunci sesuai urutan deklarasi field, bukan alfabetis, sehingga keluaran struct yang sama selalu identik.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Produk struct {\n\tNama  string `json:\"nama\"`\n\tHarga int    `json:\"harga\"`\n}\n\nfunc main() {\n\tdata := []byte(`{\"nama\":\"Buku\",\"harga\":35000}`)\n\n\tvar p Produk\n\tif err := json.Unmarshal(data, &p); err != nil {\n\t\tfmt.Println(\"json rusak:\", err)\n\t\treturn\n\t}\n\tfmt.Println(p.Nama, p.Harga)\n\n\thasil, _ := json.Marshal(Produk{Nama: \"Tas\", Harga: 120000})\n\tfmt.Println(string(hasil))\n}",
            caption: "Tag json menurunkan nama kunci; Marshal mengikuti urutan deklarasi field.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa Unmarshal dipanggil dengan `&s`, bukan `s`?",
          options: [
            "Supaya tidak perlu import dua kali",
            "Supaya Unmarshal bisa mengisi struct aslimu, bukan salinannya",
            "Karena Unmarshal hanya menerima pointer ke pointer",
            "Supaya hasilnya otomatis dicetak",
          ],
          answer: 1,
          explanation:
            "Unmarshal menulis hasil ke tujuan lewat alamatnya. Nilai biasa ditolak dengan error non-pointer saat runtime.",
        },
        {
          kind: "code",
          title: "Terima dan terbitkan JSON",
          prompt:
            "Lengkapi dua kekosongan: baca JSON dari stdin ke struct Siswa, lalu kembalikan struct itu menjadi teks JSON di baris kedua. Input: satu baris JSON dengan kunci nama dan umur.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Siswa struct {\n\tNama string `json:\"nama\"`\n\tUmur int    `json:\"umur\"`\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\n\tvar s Siswa\n\tif err := json.___([]byte(scanner.Text()), &s); err != nil {\n\t\tfmt.Println(\"json tidak valid\")\n\t\treturn\n\t}\n\tfmt.Printf(\"%s (%d tahun)\\n\", s.Nama, s.Umur)\n\n\thasil, _ := json.___(s)\n\tfmt.Println(string(hasil))\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Siswa struct {\n\tNama string `json:\"nama\"`\n\tUmur int    `json:\"umur\"`\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\n\tvar s Siswa\n\tif err := json.Unmarshal([]byte(scanner.Text()), &s); err != nil {\n\t\tfmt.Println(\"json tidak valid\")\n\t\treturn\n\t}\n\tfmt.Printf(\"%s (%d tahun)\\n\", s.Nama, s.Umur)\n\n\thasil, _ := json.Marshal(s)\n\tfmt.Println(string(hasil))\n}",
          tests: [
            {
              stdin: "{\"nama\":\"Budi\",\"umur\":17}",
              expectedOutput: "Budi (17 tahun)\n{\"nama\":\"Budi\",\"umur\":17}",
            },
            { stdin: "{\"nama\":\"Ani\"}", expectedOutput: "Ani (0 tahun)\n{\"nama\":\"Ani\",\"umur\":0}" },
            {
              stdin: "{\"umur\":30,\"nama\":\"Caca\"}",
              expectedOutput: "Caca (30 tahun)\n{\"nama\":\"Caca\",\"umur\":30}",
              hidden: true,
            },
          ],
          hints: [
            "Mengisi struct dari byte JSON: fungsi berawalan Un.",
            "Mengubah struct jadi byte JSON: fungsi berawalan Ma.",
            "Jawabannya: Unmarshal dan Marshal.",
          ],
        },
      ],
    },
    {
      slug: "json-nested-omitempty",
      title: "JSON Bersarang dan Struct Tag",
      summary: "Struct di dalam struct, slice, dan tag omitempty untuk kunci yang boleh kosong.",
      steps: [
        {
          kind: "theory",
          title: "Sarang dan opsi tag",
          body: "JSON bertingkat dipetakan ke struct bertingkat: field bertipe struct lain menampung objek di dalam objek, dan []string atau []int menampung array. Tidak ada rekursi tersembunyi; cukup deklarasikan bentuknya dan Unmarshal mengisi semuanya sekaligus, termasuk level terdalam.\n\nTag punya opsi lebih dari sekadar ganti nama. json:\"email,omitempty\" menyembunyikan kunci saat Marshal kalau nilainya zero: string kosong, 0, false, nil, atau slice kosong. json:\"-\" mengeluarkan field dari JSON sepenuhnya. Untuk data yang bentuknya memang bebas, map[string]any menampung apa pun, dengan harga berupa type assertion saat membaca.\n\nSatu perbandingan yang berguna: Marshal atas struct mengikuti urutan deklarasi field, sedangkan atas map kuncinya diurutkan alfabetis agar keluarannya deterministik. Dan karena kunci asing diabaikan diam-diam saat Unmarshal, validasi bentuk data sebenarnya sudah dikerjakan compiler lewat struct: field yang salah tulis di JSON hanya tidak terisi, tidak merusak program.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Alamat struct {\n\tKota    string `json:\"kota\"`\n\tKodePos int    `json:\"kode_pos\"`\n}\n\ntype Pegawai struct {\n\tNama   string   `json:\"nama\"`\n\tEmail  string   `json:\"email,omitempty\"`\n\tAlamat Alamat   `json:\"alamat\"`\n\tSkill  []string `json:\"skill\"`\n}\n\nfunc main() {\n\tdata := []byte(`{\"nama\":\"Dewi\",\"alamat\":{\"kota\":\"Bandung\",\"kode_pos\":40115},\"skill\":[\"go\",\"sql\"]}`)\n\n\tvar p Pegawai\n\tif err := json.Unmarshal(data, &p); err != nil {\n\t\tfmt.Println(\"json rusak:\", err)\n\t\treturn\n\t}\n\tfmt.Println(p.Alamat.Kota, len(p.Skill))\n\n\thasil, _ := json.Marshal(p)\n\tfmt.Println(string(hasil))\n}",
            caption: "Email kosong ditag omitempty: tidak tercetak, tanpa error.",
          },
        },
        {
          kind: "quiz",
          question: "Dengan tag `json:\"email,omitempty\"`, apa yang terjadi saat Marshal jika field Email berisi \"\"?",
          options: [
            "Kunci email dicetak dengan nilai kosong",
            "Kunci email tidak muncul di hasil Marshal",
            "Marshal mengembalikan error",
            "Nilainya diganti null",
          ],
          answer: 1,
          explanation:
            "omitempty melewatkan kunci saat nilainya zero value, termasuk string kosong. Field tetap ada di struct, hanya hilang dari JSON.",
        },
        {
          kind: "code",
          title: "Lengkapi struct pegawai",
          prompt:
            "Lengkapi dua kekosongan: tipe field Skill yang menampung daftar skill, dan akses kota dari struct alamat yang bersarang. Input: satu baris JSON pegawai. Keluaran: nama kota dan jumlah skill, lalu JSON hasil Marshal.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Alamat struct {\n\tKota    string `json:\"kota\"`\n\tKodePos int    `json:\"kode_pos\"`\n}\n\ntype Pegawai struct {\n\tNama   string   `json:\"nama\"`\n\tEmail  string   `json:\"email,omitempty\"`\n\tAlamat Alamat   `json:\"alamat\"`\n\tSkill  ___      `json:\"skill\"`\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\n\tvar p Pegawai\n\tif err := json.Unmarshal([]byte(scanner.Text()), &p); err != nil {\n\t\tfmt.Println(\"json tidak valid\")\n\t\treturn\n\t}\n\tfmt.Println(p.Alamat.___, len(p.Skill))\n\n\thasil, _ := json.Marshal(p)\n\tfmt.Println(string(hasil))\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Alamat struct {\n\tKota    string `json:\"kota\"`\n\tKodePos int    `json:\"kode_pos\"`\n}\n\ntype Pegawai struct {\n\tNama   string   `json:\"nama\"`\n\tEmail  string   `json:\"email,omitempty\"`\n\tAlamat Alamat   `json:\"alamat\"`\n\tSkill  []string `json:\"skill\"`\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\n\tvar p Pegawai\n\tif err := json.Unmarshal([]byte(scanner.Text()), &p); err != nil {\n\t\tfmt.Println(\"json tidak valid\")\n\t\treturn\n\t}\n\tfmt.Println(p.Alamat.Kota, len(p.Skill))\n\n\thasil, _ := json.Marshal(p)\n\tfmt.Println(string(hasil))\n}",
          tests: [
            {
              stdin: "{\"nama\":\"Dewi\",\"alamat\":{\"kota\":\"Bandung\",\"kode_pos\":40115},\"skill\":[\"go\",\"sql\"]}",
              expectedOutput:
                "Bandung 2\n{\"nama\":\"Dewi\",\"alamat\":{\"kota\":\"Bandung\",\"kode_pos\":40115},\"skill\":[\"go\",\"sql\"]}",
            },
            {
              stdin: "{\"nama\":\"Eko\",\"email\":\"eko@contoh.id\",\"alamat\":{\"kota\":\"Solo\",\"kode_pos\":57100},\"skill\":[]}",
              expectedOutput:
                "Solo 0\n{\"nama\":\"Eko\",\"email\":\"eko@contoh.id\",\"alamat\":{\"kota\":\"Solo\",\"kode_pos\":57100},\"skill\":[]}",
            },
            {
              stdin: "{\"nama\":\"Fahri\",\"alamat\":{\"kota\":\"Medan\",\"kode_pos\":20111},\"skill\":[\"go\"]}",
              expectedOutput: "Medan 1\n{\"nama\":\"Fahri\",\"alamat\":{\"kota\":\"Medan\",\"kode_pos\":20111},\"skill\":[\"go\"]}",
              hidden: true,
            },
          ],
          hints: [
            "Field yang menampung daftar skill bertipe slice string.",
            "Kota ada di struct Alamat milik Pegawai, aksesnya dua tingkat.",
            "Jawabannya: []string dan Kota.",
          ],
        },
      ],
    },
    {
      slug: "testing-bawaan",
      title: "testing: Uji Bawaan Go",
      summary: "File _test.go, fungsi TestXxx, Errorf vs Fatal, dan table-driven test tanpa library tambahan.",
      steps: [
        {
          kind: "theory",
          title: "Uji tanpa library tambahan",
          body: "Go membawa framework uji di dalam tooling. Aturannya: tulis uji di file berakhiran _test.go dalam folder package yang sama, buat fungsi bernama Test diikuti huruf besar (TestJumlah, bukan Testjumlah) dengan satu parameter t *testing.T, lalu jalankan go test. File dan fungsi lain diabaikan.\n\nDi dalam test, tandai kegagalan dengan t.Errorf atau t.Fatalf, keduanya menerima format seperti Printf. Bedanya: Errorf mencatat kegagalan lalu fungsi test lanjut ke baris berikut, sedangkan Fatal mencatat lalu berhenti saat itu juga, dipilih saat langkah berikutnya pasti gagal tanpa data langkah ini. Untuk subkasus, t.Run(nama, func) membuat subtest dengan nama sendiri di laporan.\n\nPola paling idiomatik adalah table-driven test: daftar kasus dalam slice struct berisi input dan hasil yang diharapkan, lalu satu loop memeriksa semuanya. Menambah kasus berarti menambah satu baris data, bukan satu fungsi. Flag yang sering dipakai: go test -v untuk detail, -run untuk memilih nama, dan -race dari modul 6 untuk ikut mendeteksi data race. Platform ini tidak menjalankan go test di editor latihan, tapi contoh di bawah siap dipakai di proyekmu.",
          code: {
            language: "go",
            content:
              "// file: jumlah.go\npackage main\n\nfunc Jumlah(a, b int) int { return a + b }\n\n// file: jumlah_test.go (satu folder, nama wajib berakhiran _test.go)\npackage main\n\nimport \"testing\"\n\nfunc TestJumlah(t *testing.T) {\n\tkasus := []struct {\n\t\tnama        string\n\t\ta, b, ingin int\n\t}{\n\t\t{\"positif\", 2, 3, 5},\n\t\t{\"negatif\", -1, 1, 0},\n\t}\n\tfor _, k := range kasus {\n\t\tt.Run(k.nama, func(t *testing.T) {\n\t\t\tif got := Jumlah(k.a, k.b); got != k.ingin {\n\t\t\t\tt.Errorf(\"Jumlah(%d, %d) = %d, ingin %d\", k.a, k.b, got, k.ingin)\n\t\t\t}\n\t\t})\n\t}\n}",
            caption: "go test menjalankan TestJumlah beserta dua subtestnya: positif dan negatif.",
          },
        },
        {
          kind: "quiz",
          question: "Syarat apa yang membuat fungsi dikenali sebagai test oleh `go test`?",
          options: [
            "Fungsi bernama Test diikuti huruf besar, di file berakhiran _test.go",
            "Fungsi mengembalikan error",
            "File bernama testing.go di folder testing",
            "Fungsi diberi komentar // test",
          ],
          answer: 0,
          explanation:
            "Dua syarat sekaligus: nama file dan pola nama fungsi TestXxx dengan parameter t *testing.T. Fungsi bantu lain di file yang sama tidak dijalankan.",
        },
        {
          kind: "quiz",
          question: "Kapan memilih t.Fatal alih-alih t.Errorf dalam sebuah test?",
          options: [
            "Selalu, karena Fatal lebih cepat",
            "Saat langkah berikutnya tak bermakna tanpa hasil langkah ini, misalnya memakai nilai yang ternyata nil",
            "Saat ingin pengujian lanjut mencari error lain",
            "Saat keluarannya panjang",
          ],
          answer: 1,
          explanation:
            "Fatal menghentikan fungsi test saat itu juga. Lanjutkan dengan Errorf bila kegagalan tidak menghalangi pemeriksaan berikutnya.",
        },
      ],
    },
    {
      slug: "latihan-stdlib",
      title: "Latihan: Papan Skor dari Stdin",
      summary: "Gabungkan bufio, strings, strconv, dan fmt menjadi satu program papan skor.",
      steps: [
        {
          kind: "theory",
          title: "Empat package, satu program",
          body: "Program yang sedikit serius hampir selalu menggabungkan beberapa package stdlib sekaligus. Soal latihan ini: baca n, lalu n baris berformat nama skor; cari pemilik skor tertinggi (kalau seri, yang muncul lebih dulu menang), dan hitung rata-rata seluruh skor dengan dua angka desimal.\n\nPecahan pekerjaannya per package: bufio.Scanner membaca baris seperti lesson Scanner, strings.SplitN memisah nama dan skor pada spasi pertama, strconv.Atoi mengubah skor jadi int dengan pemeriksaan error, dan fmt mencetak. Verb %.2f memaksa dua desimal; karena itu pembagiannya harus float64, bukan pembagian int yang membuang desimal.\n\nPerhatikan juga inisialisasi skorTerbaik dengan -1 dan syarat perbandingan yang ketat: kombinasi itu yang membuat pemuncak pertama menang saat skor seri. Detail kecil seperti ini yang menentukan benar tidaknya program saat input berubah, dan persis bagian yang dites.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\tbarisan := \"Budi 95\"\n\tbagian := strings.SplitN(barisan, \" \", 2)\n\tskor, err := strconv.Atoi(bagian[1])\n\tif err != nil {\n\t\tfmt.Println(\"bukan angka:\", bagian[1])\n\t\treturn\n\t}\n\trata := float64(skor) / 2\n\tfmt.Printf(\"%s dapat %d, setengahnya %.2f\\n\", bagian[0], skor, rata)\n}",
            caption: "SplitN dengan batas 2 menyisakan sisanya utuh di potongan kedua; %.2f memaksa dua desimal.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa pembagian rata-rata ditulis `float64(total) / float64(n)`, bukan `total / n`?",
          options: [
            "Supaya hasilnya desimal; pembagian int membuang sisa",
            "Karena fmt.Printf menolak argumen int",
            "Supaya pembagiannya lebih cepat",
            "Karena total bertipe string",
          ],
          answer: 0,
          explanation:
            "Pembagian dua int menghasilkan int. Konversi ke float64 mempertahankan desimal, yang lalu dibentuk %.2f.",
        },
        {
          kind: "code",
          title: "Lengkapi papan skor",
          prompt:
            "Lengkapi tiga kekosongan: pisah baris pada spasi pertama, ubah teks skor jadi int, dan beri tipe yang tepat pada pembagian rata-rata. Input: baris pertama n, lalu n baris berformat nama skor. Keluaran: pemilik skor terbaik dan rata-rata dua desimal.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\tn, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\n\ttotal := 0\n\tterbaik := \"\"\n\tskorTerbaik := -1\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tbagian := strings.___(scanner.Text(), \" \", 2)\n\t\tskor, err := strconv.___(bagian[1])\n\t\tif err != nil {\n\t\t\tcontinue\n\t\t}\n\t\ttotal += skor\n\t\tif skor > skorTerbaik {\n\t\t\tskorTerbaik = skor\n\t\t\tterbaik = bagian[0]\n\t\t}\n\t}\n\trata := float64(total) / ___(n)\n\tfmt.Printf(\"terbaik: %s (%d)\\n\", terbaik, skorTerbaik)\n\tfmt.Printf(\"rata-rata: %.2f\\n\", rata)\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\tn, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\n\ttotal := 0\n\tterbaik := \"\"\n\tskorTerbaik := -1\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tbagian := strings.SplitN(scanner.Text(), \" \", 2)\n\t\tskor, err := strconv.Atoi(bagian[1])\n\t\tif err != nil {\n\t\t\tcontinue\n\t\t}\n\t\ttotal += skor\n\t\tif skor > skorTerbaik {\n\t\t\tskorTerbaik = skor\n\t\t\tterbaik = bagian[0]\n\t\t}\n\t}\n\trata := float64(total) / float64(n)\n\tfmt.Printf(\"terbaik: %s (%d)\\n\", terbaik, skorTerbaik)\n\tfmt.Printf(\"rata-rata: %.2f\\n\", rata)\n}",
          tests: [
            { stdin: "3\nAni 80\nBudi 95\nCici 70", expectedOutput: "terbaik: Budi (95)\nrata-rata: 81.67" },
            { stdin: "2\nDewi 100\nEko 100", expectedOutput: "terbaik: Dewi (100)\nrata-rata: 100.00" },
            {
              stdin: "4\nFajar 55\nGita 78\nHana 91\nIndra 60",
              expectedOutput: "terbaik: Hana (91)\nrata-rata: 71.00",
              hidden: true,
            },
          ],
          hints: [
            "Pemisah nama dan skor: fungsi strings yang membatasi jumlah potongan.",
            "Ubah teks ke int: fungsi strconv dari lesson strconv.",
            "Jawabannya: SplitN, Atoi, dan float64.",
          ],
        },
      ],
    },
  ],
};
