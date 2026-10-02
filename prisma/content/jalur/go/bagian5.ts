import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "go",
  moduleRange: [8, 9],
  modules: [
    {
      title: "Modul dan Alat Kerja",
      description: "go mod, table-driven test, benchmark, go vet/fmt, dan struktur proyek.",
    },
    {
      title: "Menuju Proyek Lapangan",
      description: "HTTP server dengan net/http, JSON API mini, graceful shutdown, dan mini proyek akhir.",
    },
  ],
  lessons: [
    // ==================== MODUL 8: Modul dan Alat Kerja ====================
    {
      slug: "go-mod-init-dependensi",
      title: "go mod: Modul dan Dependensi",
      summary: "Pahami go.mod, go.sum, dan cara menambah dependensi dengan versi yang terkunci.",
      steps: [
        {
          kind: "theory",
          title: "Satu modul, satu go.mod",
          body: "Sejauh ini programmu selalu satu file package main. Proyek nyata terbagi ke banyak package dan hampir selalu bergantung pada pustaka orang lain. Di Go, satuan pembagiannya disebut modul: kumpulan package yang diberi versi bersama, dan ditandai satu file go.mod di akar proyek. Perintah go mod init nama-modul yang membuatnya, dan nama modul biasanya mengikuti path repositori, misalnya github.com/kamu/kasir.\n\nDi dalam go.mod ada tiga hal utama: nama modul, versi bahasa, dan daftar require yang mengunci dependensi pada versi tertentu. Untuk menambah pustaka, pakai go get github.com/google/uuid@v1.6.0; tanpa @versi, Go mengambil yang paling baru. Pasangan go.mod adalah go.sum: file checksum yang membuat build bisa diverifikasi, sehingga dua orang di dua mesin membangun dari dependensi yang benar-benar identik.\n\nPerintah yang paling sering dipakai sehari-hari adalah go mod tidy: menambahkan dependensi yang terpakai tapi belum tercatat, dan membuang yang sudah tidak dipakai. Unduhan dependensi disimpan di cache bersama komputer, jadi folder vendor tidak perlu dikomit secara default; yang dikomit cukup go.mod dan go.sum.",
          code: {
            language: "text",
            content:
              "module kodekita/kasir\n\ngo 1.25\n\nrequire github.com/google/uuid v1.6.0",
            caption: "go.mod: nama modul, versi bahasa, dan dependensi terkunci; pasangannya go.sum menyimpan checksum.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah apa yang membuat file go.mod untuk modul baru bernama kasir?",
          options: ["go init kasir", "go mod init kasir", "go create kasir", "go mod new kasir"],
          answer: 1,
          explanation:
            "go mod init diikuti nama modul yang membuat go.mod. Nama modul lazimnya path repositori, misalnya github.com/kamu/kasir.",
        },
        {
          kind: "quiz",
          question: "File apa yang mencatat checksum dependensi supaya build bisa diverifikasi?",
          options: ["go.mod", "go.sum", "go.lock", "go.mod.sum"],
          answer: 1,
          explanation:
            "go.sum menyimpan checksum setiap versi dependensi. Dua file yang dikomit adalah go.mod dan go.sum; cache unduhannya bersifat lokal.",
        },
      ],
    },
    {
      slug: "struktur-proyek-go",
      title: "Struktur Proyek Go",
      summary: "Susun proyek dengan konvensi cmd, internal, dan test yang menempel di samping kode.",
      steps: [
        {
          kind: "theory",
          title: "cmd, internal, dan main yang kurus",
          body: "Go tidak memaksakan satu layout resmi, tapi komunitas bersepakat pada beberapa konvensi yang kamu temui di hampir semua proyek kerja. go.mod berada di akar. Folder cmd/<nama>/ menampung titik masuk, satu subfolder untuk tiap binary yang dihasilkan proyek; isinya main.go yang sengaja dibuat kurus: membaca konfigurasi, memasang kabel antar komponen, lalu memanggil paket logika.\n\nFolder yang paling penting dipahami adalah internal. Paket di dalamnya hanya boleh diimpor oleh kode dari modul yang sama; compiler yang menegakkannya, bukan sekadar kebiasaan. Di situlah logika inti tinggal: service, akses data, model. Nama pkg/ juga sering muncul untuk kode yang memang disiapkan untuk diimpor proyek lain, tapi banyak proyek melewatinya dan cukup internal.\n\nFile test menempel di samping kode yang diuji, dalam folder yang sama dengan akhiran _test.go, bukan dikumpulkan di folder test terpisah. Dengan susunan ini, orang baru yang membuka repo bisa menebak: lihat cmd/ untuk cara program dijalankan, lihat internal/ untuk cara kerjanya.",
          code: {
            language: "text",
            content:
              "kasir/\n  go.mod\n  cmd/kasir/main.go          // titik masuk: hanya wiring\n  internal/diskon/\n    diskon.go                // logika inti, privat untuk modul ini\n    diskon_test.go\n  internal/penyimpanan/\n    penyimpanan.go",
            caption: "Logika di internal, binary di cmd, test menempel di samping kode yang diuji.",
          },
        },
        {
          kind: "quiz",
          question: "Paket di dalam folder mana yang tidak bisa diimpor oleh modul lain?",
          options: ["pkg/", "internal/", "cmd/", "vendor/"],
          answer: 1,
          explanation:
            "Compiler melarang impor paket internal dari luar modul. Inilah cara Go menandai kode privat, ditegakkan saat build, bukan sekadar kesepakatan.",
        },
        {
          kind: "quiz",
          question: "Menurut konvensi, di mana main.go untuk binary bernama server diletakkan?",
          options: ["cmd/server/main.go", "src/server/main.go", "server/main.go di akar proyek", "internal/main.go"],
          answer: 0,
          explanation:
            "Konvensi umum: satu subfolder di cmd/ untuk tiap binary. Go tidak punya folder src/ seperti bahasa lain.",
        },
      ],
    },
    {
      slug: "table-driven-test",
      title: "Table-Driven Test",
      summary: "Gali pola pengujian paling khas Go: satu fungsi test, tabel kasus, satu loop.",
      steps: [
        {
          kind: "theory",
          title: "Satu fungsi test, banyak kasus",
          body: "Pola pengujian yang paling khas Go adalah table-driven test. Idenya sederhana: kasus uji disusun sebagai slice of struct yang berisi nama, input, dan hasil yang diharapkan, lalu satu loop menjalankan asersi yang sama untuk tiap baris. Menambah kasus berarti menambah satu baris di tabel, bukan menyalin seluruh fungsi test.\n\nFungsi test namanya harus diawali Test dan menerima *testing.T. Di dalam loop, t.Errorf menandai kasus gagal lalu melanjutkan ke kasus berikutnya, sementara t.Fatalf menghentikan seketika dan dipakai kalau kasus berikutnya tidak mungkin valid. Dengan t.Run, tiap baris tabel menjadi subtest dengan namanya sendiri, sehingga keluaran go test menunjuk persis baris mana yang meleset. Jalankan semuanya dengan go test ./...\n\nKebiasaan yang membedakan test yang enak dibaca: beri nama kasus berdasarkan perilakunya, seperti \"persen penuh\" atau \"harga nol\", bukan \"kasus1\". Saat test gagal tiga bulan kemudian, nama itulah yang memberi tahu perilaku mana yang rusak tanpa perlu membuka kode.",
          code: {
            language: "go",
            content:
              "package diskon\n\nimport \"testing\"\n\nfunc hitungDiskon(harga, persen int) int {\n\treturn harga * persen / 100\n}\n\nfunc TestHitungDiskon(t *testing.T) {\n\tkasus := []struct {\n\t\tnama   string\n\t\tharga  int\n\t\tpersen int\n\t\tingin  int\n\t}{\n\t\t{\"nol\", 0, 10, 0},\n\t\t{\"biasa\", 200_000, 25, 50_000},\n\t\t{\"persen penuh\", 100, 100, 100},\n\t}\n\tfor _, k := range kasus {\n\t\tt.Run(k.nama, func(t *testing.T) {\n\t\t\tdapat := hitungDiskon(k.harga, k.persen)\n\t\t\tif dapat != k.ingin {\n\t\t\t\tt.Errorf(\"hitungDiskon(%d, %d) = %d, ingin %d\", k.harga, k.persen, dapat, k.ingin)\n\t\t\t}\n\t\t})\n\t}\n}",
            caption: "Satu fungsi test, banyak kasus; tambah baris berarti tambah kasus uji.",
          },
        },
        {
          kind: "quiz",
          question: "Di table-driven test, fungsi mana yang menandai kasus gagal lalu melanjutkan ke kasus berikutnya?",
          options: ["t.Fatalf", "t.Errorf", "t.Skipf", "t.Log"],
          answer: 1,
          explanation:
            "t.Errorf menandai gagal tanpa menghentikan eksekusi, cocok untuk loop tabel. t.Fatalf menghentikan fungsi test seketika.",
        },
        {
          kind: "code",
          title: "Bangun pelari tabel kasus",
          prompt:
            "Program di bawah adalah pelari table-driven test versi mini. Input: baris pertama berisi `n`, lalu `n` baris berupa `nama a b ingin`; tiap baris adalah satu kasus uji untuk fungsi `tambah`. Lengkapi tiga bagian kosong supaya kasus yang cocok mencetak `PASS <nama>`, kasus yang meleset mencetak `FAIL <nama>: dapat X, ingin Y`, dan di akhir mencetak `<lulus> dari <n> kasus lulus`.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc tambah(a, b int) int {\n\treturn a + b\n}\n\ntype kasus struct {\n\tnama  string\n\ta, b  int\n\tingin int\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tlulus := 0\n\tfor i := 0; i < n; i++ {\n\t\tvar k kasus\n\t\tfmt.Scan(&k.nama, &k.a, &k.b, &k.ingin)\n\t\tdapat := ___(k.a, k.b)\n\t\tif dapat ___ k.ingin {\n\t\t\tfmt.Println(\"PASS\", k.nama)\n\t\t\tlulus++\n\t\t} else {\n\t\t\tfmt.Printf(\"FAIL %s: dapat %d, ingin %d\\n\", k.nama, dapat, k.ingin)\n\t\t}\n\t}\n\tfmt.Printf(\"%d dari %d kasus lulus\\n\", ___, n)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc tambah(a, b int) int {\n\treturn a + b\n}\n\ntype kasus struct {\n\tnama  string\n\ta, b  int\n\tingin int\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tlulus := 0\n\tfor i := 0; i < n; i++ {\n\t\tvar k kasus\n\t\tfmt.Scan(&k.nama, &k.a, &k.b, &k.ingin)\n\t\tdapat := tambah(k.a, k.b)\n\t\tif dapat == k.ingin {\n\t\t\tfmt.Println(\"PASS\", k.nama)\n\t\t\tlulus++\n\t\t} else {\n\t\t\tfmt.Printf(\"FAIL %s: dapat %d, ingin %d\\n\", k.nama, dapat, k.ingin)\n\t\t}\n\t}\n\tfmt.Printf(\"%d dari %d kasus lulus\\n\", lulus, n)\n}",
          tests: [
            {
              stdin: "3\nkosong 0 0 0\nsatu 1 0 1\nsalah 2 3 6",
              expectedOutput: "PASS kosong\nPASS satu\nFAIL salah: dapat 5, ingin 6\n2 dari 3 kasus lulus",
            },
            { stdin: "2\na 1 1 2\nb 2 2 4", expectedOutput: "PASS a\nPASS b\n2 dari 2 kasus lulus" },
            {
              stdin: "4\nx 10 20 30\ny -1 1 0\nz 5 5 11\nw 0 7 7",
              expectedOutput: "PASS x\nPASS y\nFAIL z: dapat 10, ingin 11\nPASS w\n3 dari 4 kasus lulus",
              hidden: true,
            },
          ],
          hints: [
            "Fungsi yang diuji bernama tambah; panggil dia dengan dua argumen dari kasus.",
            "Perbandingan kesamaan angka di Go memakai dua tanda sama dengan.",
            "Di baris ringkasan, yang dicetak adalah penghitung kasus yang lulus, yaitu variabel lulus.",
          ],
        },
      ],
    },
    {
      slug: "subtests-dan-tparallel",
      title: "Subtest dan t.Parallel",
      summary: "Pecah test jadi subtest bernama, dan kenali kapan t.Parallel layak dipakai.",
      steps: [
        {
          kind: "theory",
          title: "Nama induk/nama, berjalan sendiri-sendiri",
          body: "t.Run(nama, func) menjalankan satu subtest dengan nama keluaran bergaya induk/nama, misalnya TestHitungDiskon/biasa. Dengan go test -v kamu melihat tiap subtest lulus atau gagal secara terpisah, dan go test -run 'TestHitungDiskon/biasa' bisa menyaring satu subtest saja. Aturan pentingnya satu: nama subtest harus unik di induknya; kalau kembar, Go menambahkan akhiran #01 secara otomatis.\n\nt.Parallel() menandai subtest yang aman berjalan serentak dengan subtest paralel lainnya. Mekanismenya: subtest yang memanggil t.Parallel() menjeda, fungsi test induk berjalan sampai selesai, lalu semua subtest yang dijeda berjalan bersamaan. Hasilnya lebih cepat untuk kasus yang saling lepas, tapi jangan dipakai bila kasus menyentuh state bersama tanpa pengaman; urutan jadi tak pasti dan kegagalan sulit diulang.\n\nSatu catatan sejarah yang sering muncul saat membaca kode lama: sebelum Go 1.22, variabel loop dipakai bersama semua iterasi, sehingga subtest paralel harus menyalinnya dulu (k := k). Sejak Go 1.22 tiap iterasi punya variabel sendiri dan trik itu tidak diperlukan lagi; tetap kenali bentuknya karena banyak kode lama masih memakainya.",
          code: {
            language: "text",
            content:
              "=== RUN   TestHitungDiskon\n=== RUN   TestHitungDiskon/biasa\n--- PASS: TestHitungDiskon (0.00s)\n    --- PASS: TestHitungDiskon/biasa (0.00s)",
            caption: "Keluaran go test -v: nama subtest tampil sebagai induk/nama, kegagalan dilaporkan per subtest.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan subtest yang memanggil t.Parallel() benar-benar berjalan bersamaan?",
          options: [
            "Setiap kali t.Run dipanggil",
            "Setelah fungsi test induk kembali, bersama subtest paralel lainnya",
            "Hanya bila program dijalankan dengan go run -race",
            "Selalu, karena subtest memang otomatis paralel",
          ],
          answer: 1,
          explanation:
            "Subtest paralel dijeda sampai induk selesai, lalu semuanya berjalan bersamaan. Tanpa t.Parallel(), subtest berjalan berurutan.",
        },
        {
          kind: "code",
          title: "Perbaiki nama subtest yang hilang",
          prompt:
            "Program ini mensimulasikan keluaran go test untuk subtest penghitung huruf vokal. Input: baris pertama `n`, lalu `n` baris `kata ingin` (jumlah vokal yang diharapkan). Nama subtest yang benar bergaya `TestKata/<kata>`, misalnya `TestKata/kata`. Saat ini keluaran hanya mencetak `TestKata` tanpa nama kasusnya, padahal yang diuji tiap baris adalah kata yang berbeda. Temukan satu kesalahannya dan perbaiki.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc hitungVokal(kata string) int {\n\tjumlah := 0\n\tfor _, r := range kata {\n\t\tswitch r {\n\t\tcase 'a', 'i', 'u', 'e', 'o':\n\t\t\tjumlah++\n\t\t}\n\t}\n\treturn jumlah\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tlulus := 0\n\tfor i := 0; i < n; i++ {\n\t\tvar kata string\n\t\tvar ingin int\n\t\tfmt.Scan(&kata, &ingin)\n\t\tnama := fmt.Sprintf(\"TestKata%s\", kata)\n\t\tdapat := hitungVokal(kata)\n\t\tfmt.Println(\"=== RUN\", nama)\n\t\tif dapat == ingin {\n\t\t\tfmt.Println(\"--- PASS:\", nama)\n\t\t\tlulus++\n\t\t} else {\n\t\t\tfmt.Printf(\"--- FAIL: %s (dapat %d, ingin %d)\\n\", nama, dapat, ingin)\n\t\t}\n\t}\n\tfmt.Printf(\"%d dari %d subtes lulus\\n\", lulus, n)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc hitungVokal(kata string) int {\n\tjumlah := 0\n\tfor _, r := range kata {\n\t\tswitch r {\n\t\tcase 'a', 'i', 'u', 'e', 'o':\n\t\t\tjumlah++\n\t\t}\n\t}\n\treturn jumlah\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tlulus := 0\n\tfor i := 0; i < n; i++ {\n\t\tvar kata string\n\t\tvar ingin int\n\t\tfmt.Scan(&kata, &ingin)\n\t\tnama := fmt.Sprintf(\"TestKata/%s\", kata)\n\t\tdapat := hitungVokal(kata)\n\t\tfmt.Println(\"=== RUN\", nama)\n\t\tif dapat == ingin {\n\t\t\tfmt.Println(\"--- PASS:\", nama)\n\t\t\tlulus++\n\t\t} else {\n\t\t\tfmt.Printf(\"--- FAIL: %s (dapat %d, ingin %d)\\n\", nama, dapat, ingin)\n\t\t}\n\t}\n\tfmt.Printf(\"%d dari %d subtes lulus\\n\", lulus, n)\n}",
          tests: [
            {
              stdin: "3\nkata 2\nsolusi 3\ngagal 1",
              expectedOutput:
                "=== RUN TestKata/kata\n--- PASS: TestKata/kata\n=== RUN TestKata/solusi\n--- PASS: TestKata/solusi\n=== RUN TestKata/gagal\n--- FAIL: TestKata/gagal (dapat 2, ingin 1)\n2 dari 3 subtes lulus",
            },
            {
              stdin: "2\nbola 2\nkode 2",
              expectedOutput: "=== RUN TestKata/bola\n--- PASS: TestKata/bola\n=== RUN TestKata/kode\n--- PASS: TestKata/kode\n2 dari 2 subtes lulus",
            },
            {
              stdin: "4\ndua 2\ntujuh 2\ndelapan 3\npercobaan 4",
              expectedOutput:
                "=== RUN TestKata/dua\n--- PASS: TestKata/dua\n=== RUN TestKata/tujuh\n--- PASS: TestKata/tujuh\n=== RUN TestKata/delapan\n--- PASS: TestKata/delapan\n=== RUN TestKata/percobaan\n--- PASS: TestKata/percobaan\n4 dari 4 subtes lulus",
              hidden: true,
            },
          ],
          hints: [
            "Nama subtest di go test dipisah garis miring dari nama induknya: TestKata/kata, bukan TestKatakata.",
            "Perhatikan format string di fmt.Sprintf: antara TestKata dan %s ada satu karakter yang hilang.",
            "Ubah formatnya menjadi \"TestKata/%s\".",
          ],
        },
      ],
    },
    {
      slug: "benchmark-bn",
      title: "Benchmark dan b.N",
      summary: "Ukur kecepatan kode dengan benchmark b.N dan baca keluaran ns/op dengan benar.",
      steps: [
        {
          kind: "theory",
          title: "b.N: framework yang menentukan jumlah putaran",
          body: "Benchmark menjawab \"seberapa cepat\", bukan \"apakah benar\". Bentuknya fungsi berawalan Benchmark yang menerima *testing.B, dengan loop yang berputar b.N kali. Kamu tidak menentukan nilai b.N: framework memulai dari angka kecil, mengukur, lalu menaikkannya sampai hasilnya stabil, sehingga angka ns/op yang dilaporkan punya dasar statistik yang layak.\n\nJalankan dengan go test -bench . dan tambahkan -run '^$' bila unit test mau dilewati, plus -benchmem untuk melihat alokasi memori. Keluaran seperti BenchmarkLoop-8 152 ns/op berarti satu operasi rata-rata 152 nanodetik di mesin dengan GOMAXPROCS 8. Angka alokasi sering lebih menceritakan daripada angka waktu: versi yang mengalokasi lebih sedikit hampir selalu lebih cepat di beban nyata. Bila ada penyiapan data di awal fungsi, panggil b.ResetTimer() setelahnya supaya biaya penyiapan tidak ikut terhitung.\n\nDua jebakan yang perlu diingat: pertama, compiler bisa membuang hasil yang tidak dipakai, jadi pastikan hasil loop benar-benar dikonsumsi; kedua, angka absolut bergantung mesin, jadi benchmark yang paling berguna adalah pembanding relatif, misalnya sebelum dan sesudah satu perubahan, atau dua implementasi dalam kondisi yang sama.",
          code: {
            language: "go",
            content:
              "package jumlah\n\nimport \"testing\"\n\nfunc JumlahLoop(n int) int {\n\ttotal := 0\n\tfor i := 1; i <= n; i++ {\n\t\ttotal += i\n\t}\n\treturn total\n}\n\nfunc BenchmarkLoop(b *testing.B) {\n\tfor i := 0; i < b.N; i++ {\n\t\t_ = JumlahLoop(1000)\n\t}\n}",
            caption: "Jalankan dengan go test -bench . ; b.N ditentukan framework, isi loop harus kerja yang sama tiap putaran.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti b.N di dalam fungsi benchmark?",
          options: [
            "Jumlah iterasi yang dipilih framework sampai hasilnya stabil",
            "Batas maksimum iterasi yang dilarang dilampaui",
            "Jumlah goroutine yang dipakai saat benchmark",
            "Konstanta satu miliar putaran",
          ],
          answer: 0,
          explanation:
            "Framework menyesuaikan b.N mulai dari angka kecil dan menaikkannya sampai waktu yang terukur cukup stabil. Kode di dalam loop harus berkerjanya sama tiap putaran.",
        },
        {
          kind: "quiz",
          question: "Pada keluaran `BenchmarkCari-8  152 ns/op`, angka 152 ns/op berarti?",
          options: [
            "Total waktu seluruh benchmark 152 nanodetik",
            "Rata-rata satu operasi butuh 152 nanodetik",
            "152 operasi dijalankan per nanodetik",
            "Alokasi memori 152 byte per operasi",
          ],
          answer: 1,
          explanation:
            "ns/op adalah waktu rata-rata per operasi. Angka 8 di belakang nama adalah GOMAXPROCS mesin saat benchmark dijalankan.",
        },
      ],
    },
    {
      slug: "go-fmt-vet-staticcheck",
      title: "go fmt, go vet, dan Staticcheck",
      summary: "Bikin format dan pola mencurigakan bukan lagi bahan debat: serahkan ke alat.",
      steps: [
        {
          kind: "theory",
          title: "Format dikunci, pola dicurigai",
          body: "gofmt mengunci format kode Go ke satu gaya: indentasi tab, kurung kurawal di baris yang sama, spasi di sekitar operator. Perdebatan gaya di tim Go biasanya selesai sebelum dimulai karena alatnya yang memutuskan. gofmt -l mendaftar file yang belum rapi, dan go fmt ./... memformat ulang seluruh modul. Banyak orang memakai goimports yang bekerja sama tetapi sekalian mengelola daftar import.\n\ngo vet adalah pemeriksa statis untuk kode yang sah menurut compiler tapi hampir pasti keliru: verb Printf yang tidak cocok dengan argumennya, struct sync.Mutex yang disalin sehingga kuncinya kehilangan arti, Sprintf yang punya argumen tapi tanpa verb, dan sebagainya. vet otomatis ikut jalan saat go test. Satu tingkat di atasnya ada staticcheck, alat pihak ketiga yang mencakup lebih banyak pola: pemakaian API yang usang, kesalahan logika yang umum, sampai perbaikan gaya yang disarankan; biasanya dipasang di CI supaya temuan sampai ke penulis sebelum direview manusia.\n\nKebiasaan kerjanya sederhana: formatter jalan saat menyimpan file, vet dan staticcheck jalan di pipeline, dan review kode tidak pernah membahas format lagi karena tidak ada yang bisa dibahas.",
          code: {
            language: "go",
            content:
              "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tnama := \"Sinta\"\n\t// go vet menandai baris ini: ada argumen, tapi formatnya tanpa verb\n\tfmt.Printf(\"Halo!\\n\", nama)\n}",
            caption: "Sah menurut compiler, salah diam-diam saat jalan: persis jenis masalah yang ditangkap vet.",
          },
        },
        {
          kind: "quiz",
          question: "Perintah bawaan mana yang memformat ulang file Go di seluruh modul?",
          options: ["go fmt ./...", "go clean -fmt", "go build -format", "gofmt semua"],
          answer: 0,
          explanation:
            "go fmt ./... menjalankan gofmt pada seluruh paket di modul. Alternatif yang lebih lengkap adalah goimports, tapi keduanya bukan bagian dari go build.",
        },
        {
          kind: "quiz",
          question: "Masalah mana yang paling mungkin ditemukan go vet?",
          options: [
            "Kode yang lambat saat runtime",
            "Verb Printf yang tidak cocok dengan argumennya",
            "Kekurangan memori saat build",
            "Versi dependensi yang kedaluwarsa",
          ],
          answer: 1,
          explanation:
            "vet menangkap pola yang sah tapi mencurigakan: verb Printf salah, salinan mutex, argumen tanpa verb. Kecepatan runtime dan dependensi bukan ranahnya.",
        },
      ],
    },
    {
      slug: "error-wrapping-boundary",
      title: "Error Wrapping di Batas Lapisan",
      summary: "Bungkus error dengan konteks di batas lapisan tanpa merusak errors.Is dan errors.As.",
      steps: [
        {
          kind: "theory",
          title: "Konteks ditambah di batas, rantai tetap utuh",
          body: "Error dari lapisan bawah terasa terlalu kering bagi pemanggilnya: strconv.Atoi: parsing \"abc\": invalid syntax tidak memberi tahu baris mana atau berkas mana yang bermasalah. Kebiasaan di proyek nyata: bungkus error dengan konteks saat melintasi batas lapisan, memakai fmt.Errorf dengan verb %w. Pesan berlapis terbaca dari satu sisi, dan error aslinya tetap bisa ditelusuri.\n\nVerb %w inilah yang menjaga rantai. Dengan %w, errors.Is(err, fs.ErrNotExist) dan errors.As(err, &target) tetap bekerja menembus berapa pun lapis pembungkus; dengan %v pesan ikut tercetak tapi rantai putus dan pemeriksaan jenis gagal. Aturan jempolnya: bungkus saat kamu punya informasi baru untuk ditambahkan, kembalikan apa adanya saat tidak ada; error penanda (sentinel) seperti ErrNotFound didefinisikan di level paket dan dipakai bersama errors.Is oleh pemanggil.\n\nYang perlu dijaga adalah frekuensinya: bungkus satu kali per lapisan, bukan di setiap fungsi yang dilewati, supaya pesan tidak berubah jadi \"baca: parse: buka: ...\" yang bersarang tanpa makna. Di ujung atas, biasanya main atau handler HTTP, catat rantai lengkap satu kali, lalu jawab pengguna dengan pesan yang bersih.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc muatSkor(path string) (int, error) {\n\tisi, err := os.ReadFile(path)\n\tif err != nil {\n\t\treturn 0, fmt.Errorf(\"muat skor dari %s: %w\", path, err)\n\t}\n\tskor, err := strconv.Atoi(strings.TrimSpace(string(isi)))\n\tif err != nil {\n\t\treturn 0, fmt.Errorf(\"muat skor dari %s: %w\", path, err)\n\t}\n\treturn skor, nil\n}\n\nfunc main() {\n\tskor, err := muatSkor(\"skor.txt\")\n\tif err != nil {\n\t\tfmt.Println(\"gagal:\", err)\n\t\tos.Exit(1)\n\t}\n\tfmt.Println(\"skor:\", skor)\n}",
            caption: "Dua sumber error berbeda, konteksnya sama: pemanggil cukup membaca satu rantai.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan utama `%w` dan `%v` di dalam fmt.Errorf?",
          options: [
            "%w mengenkripsi pesan error",
            "%w membungkus error asli sehingga errors.Is dan errors.As masih bisa menelusurinya",
            "%w mengubah error menjadi panic bila tidak ditangani",
            "Tidak ada bedanya, hanya gaya penulisan",
          ],
          answer: 1,
          explanation:
            "%w menyimpan error asli di dalam rantai. %v hanya menyisipkan teksnya, sehingga pemeriksaan errors.Is dan errors.As kehilangan jejak.",
        },
        {
          kind: "code",
          title: "Bungkus error parsing dengan konteks baris",
          prompt:
            "Baca `n`, lalu `n` token dari input. Fungsi `proses` mengubah tiap token menjadi angka: kalau berhasil cetak `ok: <angka>`; kalau gagal, kembalikan error yang dibungkus konteks `baris <nomor>: ...` lalu cetak di main. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc proses(teks string, nomor int) error {\n\tangka, err := strconv.___(teks)\n\tif err != nil {\n\t\treturn fmt.Errorf(\"baris %d: ___\", nomor, err)\n\t}\n\tfmt.Println(\"ok:\", ___)\n\treturn nil\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 1; i <= n; i++ {\n\t\tvar teks string\n\t\tfmt.Scan(&teks)\n\t\tif err := proses(teks, i); err != nil {\n\t\t\tfmt.Println(err)\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc proses(teks string, nomor int) error {\n\tangka, err := strconv.Atoi(teks)\n\tif err != nil {\n\t\treturn fmt.Errorf(\"baris %d: %w\", nomor, err)\n\t}\n\tfmt.Println(\"ok:\", angka)\n\treturn nil\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 1; i <= n; i++ {\n\t\tvar teks string\n\t\tfmt.Scan(&teks)\n\t\tif err := proses(teks, i); err != nil {\n\t\t\tfmt.Println(err)\n\t\t}\n\t}\n}",
          tests: [
            {
              stdin: "5\n42\n-7\nabc\n8x\n19",
              expectedOutput:
                "ok: 42\nok: -7\nbaris 3: strconv.Atoi: parsing \"abc\": invalid syntax\nbaris 4: strconv.Atoi: parsing \"8x\": invalid syntax\nok: 19",
            },
            { stdin: "3\n100\n-5\n0", expectedOutput: "ok: 100\nok: -5\nok: 0" },
            {
              stdin: "3\n3.5\n007\nab",
              expectedOutput:
                "baris 1: strconv.Atoi: parsing \"3.5\": invalid syntax\nok: 7\nbaris 3: strconv.Atoi: parsing \"ab\": invalid syntax",
              hidden: true,
            },
          ],
          hints: [
            "Fungsi konversi teks ke int di package strconv bernama Atoi.",
            "Verb pembungkus error diawali tanda persen dan huruf w; dia yang menjaga rantai error tetap bisa ditelusuri.",
            "Yang dicetak setelah konversi berhasil adalah variabel angka.",
          ],
        },
      ],
    },
    {
      slug: "log-package",
      title: "Logging dengan Package log",
      summary: "Tulis log dengan package log: prefix, flag, dan tujuan keluaran yang tepat.",
      steps: [
        {
          kind: "theory",
          title: "Stderr, waktu, dan prefix",
          body: "Package log adalah titik awal logging di Go, dan perilaku defaultnya penting dipahami: log menulis ke stderr, lengkap dengan tanggal dan waktu di tiap baris. log.Println dan log.Printf berperilaku seperti pasangan fmt-nya, hanya tujuannya berbeda. log.Fatalf mencetak lalu memanggil os.Exit(1); pakai hanya di main, karena exit mendadak di tengah pustaka melompati pembersihan.\n\nUntuk program yang butuh lebih dari satu jenis catatan, log.New(writer, prefix, flag) membuat logger bernama: satu untuk info, satu untuk error, masing-masing dengan prefix sendiri. Flag menata bentuk baris: log.Ltime menambah jam, log.Lshortfile menambah nama file dan baris, dan SetFlags(0) merampas semuanya sampai hanya pesan dan prefix yang tersisa. Pembagian aliran yang sehat: data yang dikonsumsi manusia atau program lain lewat stdout, catatan diagnostik lewat stderr.\n\nUntuk service yang lognya diagregasi ke satu tempat, naik satu tingkat ke log/slog yang sudah bawaan stdlib sejak Go 1.21: pasangan kunci-nilai dan keluaran JSON yang mudah diolah. Package log tetap alat yang pas untuk CLI dan alat bantu kecil.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"log\"\n\t\"os\"\n)\n\nfunc main() {\n\tinfo := log.New(os.Stderr, \"[INFO] \", log.Ltime)\n\tinfo.Println(\"server menyala\")\n\n\tlog.SetFlags(0) // buang tanggal dan waktu, cocok untuk CLI kecil\n\tlog.Println(\"memproses 3 berkas\")\n}",
            caption: "Default ke stderr dengan waktu; prefix dan flag menata bentuk tiap baris log.",
          },
        },
        {
          kind: "quiz",
          question: "Ke mana package log menulis keluaran secara default?",
          options: [
            "stdout",
            "stderr",
            "File app.log di folder kerja",
            "Tidak ke mana-mana sebelum log.SetOutput dipanggil",
          ],
          answer: 1,
          explanation:
            "Defaultnya stderr, dengan tanggal dan waktu di tiap baris, sehingga aliran data program di stdout tetap bersih.",
        },
        {
          kind: "code",
          title: "Pasang dua logger kecil",
          prompt:
            "Dua logger: satu untuk kejadian biasa, satu untuk kegagalan. Input: baris pertama `n`, lalu `n` baris `LEVEL kode` (LEVEL berisi INFO atau ERROR). Lengkapi tiga bagian kosong supaya keluaran persis `[INFO] status <kode>: aman` untuk INFO dan `[GAGAL] status <kode>: perlu diperiksa` untuk ERROR.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"log\"\n\t\"os\"\n)\n\nfunc main() {\n\tinfo := log.New(___, \"[INFO] \", 0)\n\tgagal := log.New(os.Stdout, \"[GAGAL] \", 0)\n\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar level string\n\t\tvar kode int\n\t\tfmt.Scan(&level, &kode)\n\t\tif level ___ \"ERROR\" {\n\t\t\tgagal.___(\"status %d: perlu diperiksa\", kode)\n\t\t} else {\n\t\t\tinfo.Printf(\"status %d: aman\", kode)\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"log\"\n\t\"os\"\n)\n\nfunc main() {\n\tinfo := log.New(os.Stdout, \"[INFO] \", 0)\n\tgagal := log.New(os.Stdout, \"[GAGAL] \", 0)\n\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar level string\n\t\tvar kode int\n\t\tfmt.Scan(&level, &kode)\n\t\tif level == \"ERROR\" {\n\t\t\tgagal.Printf(\"status %d: perlu diperiksa\", kode)\n\t\t} else {\n\t\t\tinfo.Printf(\"status %d: aman\", kode)\n\t\t}\n\t}\n}",
          tests: [
            {
              stdin: "3\nINFO 200\nERROR 500\nINFO 201",
              expectedOutput: "[INFO] status 200: aman\n[GAGAL] status 500: perlu diperiksa\n[INFO] status 201: aman",
            },
            { stdin: "1\nERROR 404", expectedOutput: "[GAGAL] status 404: perlu diperiksa" },
            {
              stdin: "4\nINFO 100\nERROR 503\nERROR 401\nINFO 204",
              expectedOutput:
                "[INFO] status 100: aman\n[GAGAL] status 503: perlu diperiksa\n[GAGAL] status 401: perlu diperiksa\n[INFO] status 204: aman",
              hidden: true,
            },
          ],
          hints: [
            "log.New meminta io.Writer sebagai tujuan; untuk keluaran standar, yang dikirim adalah os.Stdout.",
            "Membandingkan dua string di Go memakai dua tanda sama dengan.",
            "Metode logger yang menerima format seperti Printf memang bernama Printf.",
          ],
        },
      ],
    },
    {
      slug: "go-build-crosscompile",
      title: "go build dan Cross-Compile",
      summary: "Ubah source jadi satu binary dan bangun untuk platform lain tanpa alat tambahan.",
      steps: [
        {
          kind: "theory",
          title: "Satu binary, semua platform",
          body: "go run mengompilasi ke folder sementara lalu langsung mengeksekusi; nyaman untuk development, tapi tidak meninggalkan apa pun. go build menghasilkan binary sesungguhnya: satu file, statis untuk program tanpa cgo, tanpa runtime yang perlu diinstal di mesin target. go build -o bin/kasir ./cmd/kasir membangun paket di cmd/kasir menjadi satu file bernama kasir, dan inilah bentuk akhir yang disebar ke server atau dikirim ke pengguna.\n\nKeunggulan yang paling sering dipakai: cross-compile tanpa memasang toolchain tambahan. Dengan variabel GOOS dan GOARCH, laptop Windows bisa membangun binary Linux, dan sebaliknya: GOOS=linux GOARCH=arm64 go build. Flag -ldflags \"-s -w\" membuang tabel debug supaya binary lebih kecil untuk disebar. Perintah go version -m nama-binary membaca balik informasi modul yang tertanam, berguna saat menyelidiki binary mana yang berjalan di server.\n\nDua hal yang sering menyertai build di proyek nyata: menyuntik versi lewat -ldflags \"-X main.Versi=v1.2.0\" ke variabel paket supaya binary bisa melapor versinya sendiri, dan build tag (//go:build) untuk memilih file yang berbeda per platform, misalnya implementasi khusus Windows dan Linux.",
          code: {
            language: "bash",
            content:
              "go build -o bin/kasir ./cmd/kasir\nGOOS=linux GOARCH=arm64 go build -o bin/kasir-linux-arm64 ./cmd/kasir\ngo version -m bin/kasir",
            caption: "Satu toolchain membangun untuk semua platform; info modul bisa dibaca balik dari binary.",
          },
        },
        {
          kind: "quiz",
          question: "Cara membangun binary Linux dari laptop Windows tanpa memasang apa pun lagi?",
          options: [
            "GOOS=linux go build",
            "go build --target linux",
            "Salin source ke mesin Linux lalu jalankan go run di sana",
            "Tidak mungkin, harus lewat Docker",
          ],
          answer: 0,
          explanation:
            "Compiler Go lintas-kompilasi secara bawaan: cukup atur GOOS (dan GOARCH bila perlu). Tidak ada toolchain target yang perlu diinstal.",
        },
        {
          kind: "quiz",
          question: "Apa beda pokok go run dan go build?",
          options: [
            "go run tidak melakukan kompilasi sama sekali",
            "go build menghasilkan file binary yang bisa disebar; go run mengeksekusi lewat file sementara",
            "go run hanya untuk menjalankan test",
            "go build selalu butuh koneksi internet",
          ],
          answer: 1,
          explanation:
            "Keduanya sama-sama mengompilasi; bedanya go build menyimpan hasilnya sebagai binary, sedangkan go run memakai folder sementara lalu menjalankannya.",
        },
      ],
    },
    {
      slug: "latihan-alat-kerja",
      title: "Latihan: Statistik Multi Fungsi",
      summary: "Rangkai fungsi kecil jadi program statistik yang siap diuji tabel.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi kecil yang saling dipanggil",
          body: "Modul ini dirangkum dalam satu program: empat fungsi, masing-masing mengerjakan satu hal. cariMin dan cariMax membandingkan elemen terhadap calon jawaban yang diisi awal dengan elemen pertama; rataRata menjumlahkan lalu membagi dengan panjang slice; diAtasRata memanggil rataRata lalu menghitung berapa elemen yang melampauinya. Karena tiap fungsi murni dan menerima slice, semuanya siap diuji dengan tabel kasus seperti yang dilatih di awal modul.\n\nDua detail teknis yang muncul di latihan ini: konversi tipe sebelum pembagian, karena total int dibagi len(angka) int akan membulat ke bawah sebagai bilangan bulat, sehingga total harus dikonversi ke float64 lebih dulu; dan verb format %.2f yang mencetak float dengan dua angka desimal. main sengaja tetap kurus seperti konvensi proyek: membaca input, memanggil fungsi, mencetak hasil.",
          code: {
            language: "go",
            content:
              "func main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\tfmt.Printf(\"min: %d\\n\", cariMin(angka))\n\tfmt.Printf(\"max: %d\\n\", cariMax(angka))\n\tfmt.Printf(\"rata: %.2f\\n\", rataRata(angka))\n\tfmt.Printf(\"di atas rata: %d\\n\", diAtasRata(angka))\n}",
            caption: "Main hanya membaca input dan memanggil fungsi; logika ada di fungsi terpisah yang mudah diuji.",
          },
        },
        {
          kind: "code",
          title: "Bangun program statistik empat fungsi",
          prompt:
            "Program statistik dengan empat fungsi. Input: baris pertama `n`, baris kedua berisi `n` bilangan bulat. Keluaran empat baris: `min:`, `max:`, `rata:` (dua angka desimal), dan `di atas rata:` (banyaknya angka yang lebih besar dari rata-rata). Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc cariMin(angka []int) int {\n\tmin := angka[0]\n\tfor _, a := range angka {\n\t\tif a ___ min {\n\t\t\tmin = a\n\t\t}\n\t}\n\treturn min\n}\n\nfunc cariMax(angka []int) int {\n\tmax := angka[0]\n\tfor _, a := range angka {\n\t\tif a > max {\n\t\t\tmax = a\n\t\t}\n\t}\n\treturn max\n}\n\nfunc rataRata(angka []int) float64 {\n\ttotal := 0\n\tfor _, a := range angka {\n\t\ttotal += a\n\t}\n\treturn ___(total) / float64(len(angka))\n}\n\nfunc diAtasRata(angka []int) int {\n\tr := rataRata(angka)\n\tjumlah := 0\n\tfor _, a := range angka {\n\t\tif float64(a) > r {\n\t\t\tjumlah++\n\t\t}\n\t}\n\treturn jumlah\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\tfmt.Printf(\"min: %d\\n\", cariMin(angka))\n\tfmt.Printf(\"max: %d\\n\", cariMax(angka))\n\tfmt.Printf(\"rata: ___\\n\", rataRata(angka))\n\tfmt.Printf(\"di atas rata: %d\\n\", diAtasRata(angka))\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc cariMin(angka []int) int {\n\tmin := angka[0]\n\tfor _, a := range angka {\n\t\tif a < min {\n\t\t\tmin = a\n\t\t}\n\t}\n\treturn min\n}\n\nfunc cariMax(angka []int) int {\n\tmax := angka[0]\n\tfor _, a := range angka {\n\t\tif a > max {\n\t\t\tmax = a\n\t\t}\n\t}\n\treturn max\n}\n\nfunc rataRata(angka []int) float64 {\n\ttotal := 0\n\tfor _, a := range angka {\n\t\ttotal += a\n\t}\n\treturn float64(total) / float64(len(angka))\n}\n\nfunc diAtasRata(angka []int) int {\n\tr := rataRata(angka)\n\tjumlah := 0\n\tfor _, a := range angka {\n\t\tif float64(a) > r {\n\t\t\tjumlah++\n\t\t}\n\t}\n\treturn jumlah\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tangka := make([]int, n)\n\tfor i := range angka {\n\t\tfmt.Scan(&angka[i])\n\t}\n\tfmt.Printf(\"min: %d\\n\", cariMin(angka))\n\tfmt.Printf(\"max: %d\\n\", cariMax(angka))\n\tfmt.Printf(\"rata: %.2f\\n\", rataRata(angka))\n\tfmt.Printf(\"di atas rata: %d\\n\", diAtasRata(angka))\n}",
          tests: [
            { stdin: "5\n3 19 8 4 15", expectedOutput: "min: 3\nmax: 19\nrata: 9.80\ndi atas rata: 2" },
            { stdin: "1\n7", expectedOutput: "min: 7\nmax: 7\nrata: 7.00\ndi atas rata: 0" },
            { stdin: "4\n-5 10 -3 2", expectedOutput: "min: -5\nmax: 10\nrata: 1.00\ndi atas rata: 2", hidden: true },
          ],
          hints: [
            "Nilai terkecil ditemukan dengan membandingkan setiap elemen terhadap calon minimum; operatornya menghadap ke kiri.",
            "Pembagian rata-rata menghasilkan pecahan: konversi total lebih dulu dengan nama tipe sebagai fungsi.",
            "Verb untuk float dengan dua angka desimal: %%.2f.",
          ],
        },
      ],
    },
    // ==================== MODUL 9: Menuju Proyek Lapangan ====================
    {
      slug: "http-handler-hello",
      title: "Server HTTP Pertama",
      summary: "Hidupkan server HTTP pertamamu hanya dengan stdlib net/http.",
      steps: [
        {
          kind: "theory",
          title: "Handler, mux, dan ListenAndServe",
          body: "net/http cukup untuk membangun server web tanpa framework, dan di Go inilah titik mulai yang disarankan. Tiga bagian dasarnya: handler, yaitu fungsi yang menjawab satu permintaan; mux, yaitu pencocok rute yang memilih handler; dan http.ListenAndServe yang menjalankan server sampai dimatikan. Signature handler selalu sama: func(w http.ResponseWriter, r *http.Request); w adalah tempat menulis balasan, r membawa isi permintaan seperti metode, path, dan body.\n\nhttp.HandleFunc(\"/\", sapa) mendaftarkan fungsi biasa sebagai handler pada DefaultServeMux; rahasianya ada di http.HandlerFunc, tipe fungsi yang mengimplementasikan interface http.Handler. ListenAndServe(\":8080\", nil) memblokir selamanya, jadi baris setelahnya hanya berjalan saat server berhenti. Untuk API kecil dan menengah, kombinasi ini sering sudah cukup; framework baru relevan saat kebutuhan routing, middleware, dan validasi bertumbuh.\n\nKebiasaan yang membuat handler mudah diuji: pisahkan logika dari HTTP. Handler hanya membaca permintaan dan menulis balasan; hitungannya ada di fungsi biasa yang menerima dan mengembalikan nilai, sehingga bisa diuji tanpa server hidup. Latihan di bawah melatih persis itu: logika sapaan dipanggil dari stdin alih-alih dari permintaan nyata.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc sapa(w http.ResponseWriter, r *http.Request) {\n\tfmt.Fprintln(w, \"Halo dari KodeKita!\")\n}\n\nfunc main() {\n\thttp.HandleFunc(\"/\", sapa)\n\tfmt.Println(\"server jalan di http://localhost:8080\")\n\tif err := http.ListenAndServe(\":8080\", nil); err != nil {\n\t\tfmt.Println(\"server berhenti:\", err)\n\t}\n}",
            caption: "Server HTTP lengkap dalam belasan baris, tanpa satu pun dependensi.",
          },
        },
        {
          kind: "quiz",
          question: "Lewat parameter mana handler menulis balasan ke klien?",
          options: ["http.ResponseWriter", "http.Request", "http.ListenAndServe", "ServeMux"],
          answer: 0,
          explanation:
            "http.ResponseWriter adalah aliran keluaran ke klien; http.Request membawa data permintaan yang masuk.",
        },
        {
          kind: "code",
          title: "Uji logika handler tanpa server",
          prompt:
            "Fungsi handler murni versi mini: `sapa` menerima satu baris nama dan mengembalikan teks sapaan; nama kosong atau berisi spasi saja disapa sebagai pengunjung. Input: baris pertama `n`, lalu `n` baris nama. Lengkapi tiga bagian kosong supaya tiap baris input menghasilkan satu baris sapaan.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc sapa(nama string) string {\n\tnama = strings.___(nama)\n\tif nama ___ {\n\t\treturn \"Halo, pengunjung!\"\n\t}\n\treturn \"Halo, \" + ___ + \"!\"\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\tvar n int\n\tfmt.Sscanf(scanner.Text(), \"%d\", &n)\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tfmt.Println(sapa(scanner.Text()))\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n)\n\nfunc sapa(nama string) string {\n\tnama = strings.TrimSpace(nama)\n\tif nama == \"\" {\n\t\treturn \"Halo, pengunjung!\"\n\t}\n\treturn \"Halo, \" + nama + \"!\"\n}\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Scan()\n\tvar n int\n\tfmt.Sscanf(scanner.Text(), \"%d\", &n)\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tfmt.Println(sapa(scanner.Text()))\n\t}\n}",
          tests: [
            { stdin: "3\nSinta\n\nRizky", expectedOutput: "Halo, Sinta!\nHalo, pengunjung!\nHalo, Rizky!" },
            { stdin: "2\nDewi Lestari\nBagas", expectedOutput: "Halo, Dewi Lestari!\nHalo, Bagas!" },
            { stdin: "2\n  Budi  \n\n", expectedOutput: "Halo, Budi!\nHalo, pengunjung!", hidden: true },
          ],
          hints: [
            "Whitespace di pinggir nama dibersihkan satu fungsi dari package strings yang namanya menyebut spasi.",
            "Perbandingan dengan string kosong ditulis nama == \"\".",
            "Yang disisipkan ke teks sapaan adalah variabel nama.",
          ],
        },
      ],
    },
    {
      slug: "mux-handlerfunc",
      title: "Routing dengan ServeMux",
      summary: "Atur rute dengan ServeMux: pola path, metode, dan fallback 404.",
      steps: [
        {
          kind: "theory",
          title: "Pola path dan metode di satu string",
          body: "http.NewServeMux() memetakan pola ke handler. Pola \"/beranda\" tanpa garis miring di akhir berlaku persis untuk path itu; pola \"/beranda/\" dengan garis miring adalah prefix yang menangkap semua path di bawahnya. Sejak Go 1.22, pola bisa membawa metode sekaligus: \"GET /beranda\" hanya menjawab GET, dan mux yang otomatis menjawab 405 Method Not Allowed bila path cocok tetapi metodenya salah. Prioritasnya jelas: pola paling spesifik (paling panjang) yang menang, dan pola \"/\" menjadi penampung sisa.\n\nhttp.HandlerFunc adalah tipe fungsi yang mengimplementasikan interface http.Handler, dan itulah yang membuat fungsi biasa bisa didaftarkan: mux.HandleFunc(\"GET /catatan\", buatCatatan) atau mux.Handle(\"GET /catatan\", http.HandlerFunc(buatCatatan)) untuk yang sudah jadi. Karena mux bawaan sudah menyelesaikan pencocokan path, metode, dan 404, banyak API internal tidak butuh router pihak ketiga sama sekali.\n\nLatihan di bawah meniru keputusan yang sama di dalam satu fungsi: metode dicek lebih dulu, lalu path dicocokkan persis, dan sisanya jatuh ke jawaban 404. Urutan cabang itu bukan kebetulan; itulah urutan yang dipakai router sungguhan.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc buatCatatan(w http.ResponseWriter, r *http.Request) {\n\tfmt.Fprintln(w, \"catatan dibuat\")\n}\n\nfunc main() {\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"GET /beranda\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"halaman beranda\")\n\t})\n\tmux.HandleFunc(\"POST /catatan\", buatCatatan)\n\tmux.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\thttp.NotFound(w, r)\n\t})\n\tfmt.Println(\"server jalan di http://localhost:8080\")\n\thttp.ListenAndServe(\":8080\", mux)\n}",
            caption: "Pola \"METODE /path\" sejak Go 1.22 mengikat metode dan path sekaligus; pola \"/\" menangkap sisanya.",
          },
        },
        {
          kind: "code",
          title: "Simulasi pencocok rute",
          prompt:
            "Simulasi routing. Input: baris pertama `n`, lalu `n` baris `METODE path`. Aturan: metode selain GET dan POST jawab `405 metode tidak dikenal`; `GET /beranda` jawab `200 Halaman beranda`; `GET /tentang` jawab `200 Tentang KodeKita`; `POST /catatan` jawab `201 catatan dibuat`; sisanya `404 halaman tidak ditemukan`. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc berikan(metode, path string) string {\n\tswitch {\n\tcase metode != \"GET\" && metode != \"POST\":\n\t\treturn \"405 metode tidak dikenal\"\n\tcase metode == \"GET\" && path ___ \"/beranda\":\n\t\treturn \"200 Halaman beranda\"\n\tcase metode == \"GET\" && path == ___:\n\t\treturn \"200 Tentang KodeKita\"\n\tcase metode == \"POST\" && path == \"/catatan\":\n\t\treturn \"201 catatan dibuat\"\n\tdefault:\n\t\treturn \"404 halaman tidak ditemukan\"\n\t}\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar metode, path string\n\t\tfmt.___(&metode, &path)\n\t\tfmt.Println(berikan(metode, path))\n\t}\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc berikan(metode, path string) string {\n\tswitch {\n\tcase metode != \"GET\" && metode != \"POST\":\n\t\treturn \"405 metode tidak dikenal\"\n\tcase metode == \"GET\" && path == \"/beranda\":\n\t\treturn \"200 Halaman beranda\"\n\tcase metode == \"GET\" && path == \"/tentang\":\n\t\treturn \"200 Tentang KodeKita\"\n\tcase metode == \"POST\" && path == \"/catatan\":\n\t\treturn \"201 catatan dibuat\"\n\tdefault:\n\t\treturn \"404 halaman tidak ditemukan\"\n\t}\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar metode, path string\n\t\tfmt.Scan(&metode, &path)\n\t\tfmt.Println(berikan(metode, path))\n\t}\n}",
          tests: [
            {
              stdin: "4\nGET /beranda\nGET /api\nPOST /catatan\nDELETE /beranda",
              expectedOutput:
                "200 Halaman beranda\n404 halaman tidak ditemukan\n201 catatan dibuat\n405 metode tidak dikenal",
            },
            {
              stdin: "3\nGET /tentang\nPOST /beranda\nGET /catatan",
              expectedOutput: "200 Tentang KodeKita\n404 halaman tidak ditemukan\n404 halaman tidak ditemukan",
            },
            {
              stdin: "3\nPOST /catatan\nPOST /catatan\nGET /beranda",
              expectedOutput: "201 catatan dibuat\n201 catatan dibuat\n200 Halaman beranda",
              hidden: true,
            },
          ],
          hints: [
            "Rute dicocokkan persis: operator kesamaan string, dan literal path lengkap dengan garis miring di depan.",
            "Path untuk halaman tentang ditulis dengan garis miring: /tentang.",
            "Membaca dua nilai sekaligus dari input: fmt.Scan(&metode, &path).",
          ],
        },
      ],
    },
    {
      slug: "json-request-response",
      title: "JSON Masuk, JSON Keluar",
      summary: "Decode body JSON jadi struct dan balas dengan JSON yang rapi.",
      steps: [
        {
          kind: "theory",
          title: "Decode dari body, encode ke balasan",
          body: "Alur JSON API di Go nyaris selalu sama: body permintaan di-decode ke struct, diproses, lalu struct balasan di-encode ke JSON. Untuk membaca, json.NewDecoder(r.Body).Decode(&masuk) menyerap aliran body langsung; untuk menjawab, set header Content-Type ke application/json lalu json.NewEncoder(w).Encode(keluar). Nama field JSON dikendalikan struct tag seperti `json:\"nama\"`; pencocokannya tidak peduli huruf besar-kecil, tapi tag tetap ditulis agar kontrak API jelas terbaca di kode.\n\nBila body tidak sah, Decode mengembalikan error dan handler wajib menjawab dengan status 400, bukan membiarkan data kosong jalan terus. Keluaran json.Marshal tidak diberi spasi: {\"nama\":\"Sinta\",\"status\":\"lulus\"} persis begitu, dan justru itulah bentuk yang dikirim kebanyakan API; indentasi hanya untuk konsumsi manusia lewat MarshalIndent.\n\nLatihan di bawah memindahkan pipa itu ke stdin dan stdout: decode satu objek JSON dari input, putuskan statusnya, lalu cetak satu baris JSON keluaran. Struktur kodenya identik dengan handler sungguhan, hanya r.Body digantikan os.Stdin dan w digantikan fmt.Println.",
          code: {
            language: "go",
            content:
              "type skorMasuk struct {\n\tNama string `json:\"nama\"`\n\tSkor int    `json:\"skor\"`\n}\n\ntype skorKeluar struct {\n\tNama   string `json:\"nama\"`\n\tStatus string `json:\"status\"`\n}\n\nfunc nilai(w http.ResponseWriter, r *http.Request) {\n\tvar masuk skorMasuk\n\tif err := json.NewDecoder(r.Body).Decode(&masuk); err != nil {\n\t\thttp.Error(w, \"body bukan JSON yang sah\", http.StatusBadRequest)\n\t\treturn\n\t}\n\tstatus := \"remedial\"\n\tif masuk.Skor >= 70 {\n\t\tstatus = \"lulus\"\n\t}\n\tw.Header().Set(\"Content-Type\", \"application/json\")\n\tjson.NewEncoder(w).Encode(skorKeluar{Nama: masuk.Nama, Status: status})\n}",
            caption: "Decode dari r.Body, encode ke w; struct tag yang menentukan nama field JSON.",
          },
        },
        {
          kind: "code",
          title: "Terima JSON, putuskan status, balas JSON",
          prompt:
            "Baca satu objek JSON dari stdin berisi field `nama` dan `skor`, lalu cetak JSON keluaran berisi `nama` dan `status`: berisi `lulus` bila skor minimal 70, selain itu `remedial`. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Skor struct {\n\tNama string `json:\"___\"`\n\tSkor int    `json:\"skor\"`\n}\n\ntype Hasil struct {\n\tNama   string `json:\"nama\"`\n\tStatus string `json:\"status\"`\n}\n\nfunc main() {\n\tvar s Skor\n\tif err := json.NewDecoder(os.Stdin).___(&s); err != nil {\n\t\tfmt.Println(\"error:\", err)\n\t\treturn\n\t}\n\tstatus := \"remedial\"\n\tif s.Skor ___ 70 {\n\t\tstatus = \"lulus\"\n\t}\n\th := Hasil{Nama: s.Nama, Status: status}\n\tkeluar, _ := json.Marshal(h)\n\tfmt.Println(string(keluar))\n}",
          solution:
            "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n)\n\ntype Skor struct {\n\tNama string `json:\"nama\"`\n\tSkor int    `json:\"skor\"`\n}\n\ntype Hasil struct {\n\tNama   string `json:\"nama\"`\n\tStatus string `json:\"status\"`\n}\n\nfunc main() {\n\tvar s Skor\n\tif err := json.NewDecoder(os.Stdin).Decode(&s); err != nil {\n\t\tfmt.Println(\"error:\", err)\n\t\treturn\n\t}\n\tstatus := \"remedial\"\n\tif s.Skor >= 70 {\n\t\tstatus = \"lulus\"\n\t}\n\th := Hasil{Nama: s.Nama, Status: status}\n\tkeluar, _ := json.Marshal(h)\n\tfmt.Println(string(keluar))\n}",
          tests: [
            { stdin: '{"nama":"Sinta","skor":87}', expectedOutput: '{"nama":"Sinta","status":"lulus"}' },
            { stdin: '{"nama":"Budi","skor":55}', expectedOutput: '{"nama":"Budi","status":"remedial"}' },
            {
              stdin: '{\n  "nama": "Caca",\n  "skor": 70\n}',
              expectedOutput: '{"nama":"Caca","status":"lulus"}',
              hidden: true,
            },
          ],
          hints: [
            "Struct tag mengikat field ke kunci JSON; kunci di input bernama nama, huruf kecil semua.",
            "Metode decoder dari package json yang membaca satu nilai JSON dari reader bernama Decode.",
            "Syarat kelulusan adalah skor minimal 70, dan angka 70 sendiri termasuk lulus.",
          ],
        },
      ],
    },
    {
      slug: "http-status-response",
      title: "Status Code dan Respons Error",
      summary: "Pilih status code yang jujur dan tulis respons error yang konsisten.",
      steps: [
        {
          kind: "theory",
          title: "Angka yang bercerita",
          body: "Status code adalah bagian dari kontrak API, dan memilihnya dengan jujur membuat klien bisa bereaksi dengan benar. Keluarga 2xx berarti sukses: 200 OK untuk jawaban biasa, 201 Created untuk data baru yang berhasil dibuat, 204 No Content untuk sukses tanpa isi. Keluarga 4xx berarti kesalahan di sisi klien: 400 body tidak sah, 401 dan 403 soal autentikasi dan izin, 404 resource tidak ada, 405 metode tidak diizinkan. Keluarga 5xx berarti kesalahan di sisi server, misalnya 500 saat handler panik.\n\nAturan mekanis yang wajib diingat di Go: WriteHeader harus dipanggil sebelum Write pertama, karena tulisan pertama otomatis mengunci status 200. Untuk respons error teks, http.Error(w, pesan, kode) adalah pintasan yang menyetel Content-Type text/plain, menulis status, dan menulis pesan sekali jalan. API JSON yang rapi tetap mengembalikan body JSON untuk error, lengkap dengan kode yang benar di headernya.\n\nLatihan di bawah memutuskan status untuk tiap permintaan dari tiga masukan: metode, path, dan ada tidaknya isi. Urutan pengecekannya meniru handler sungguhan: metode dulu, lalu keberadaan resource, lalu validasi isi.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc tulisPesan(w http.ResponseWriter, kode int, pesan string) {\n\tw.WriteHeader(kode)\n\tfmt.Fprintln(w, pesan)\n}\n\nfunc main() {\n\thttp.HandleFunc(\"POST /catatan\", func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.ContentLength == 0 {\n\t\t\ttulisPesan(w, http.StatusBadRequest, \"isi kosong\")\n\t\t\treturn\n\t\t}\n\t\ttulisPesan(w, http.StatusCreated, \"catatan dibuat\")\n\t})\n\thttp.ListenAndServe(\":8080\", nil)\n}",
            caption: "Status ditulis sebelum body; konstanta http.Status lebih jelas dibaca daripada angka telanjang.",
          },
        },
        {
          kind: "code",
          title: "Putuskan status tiap permintaan",
          prompt:
            "Simulasi keputusan status sebuah handler. Input: baris pertama `n`, lalu `n` baris `METODE path isi` (isi 0 atau 1). Urutan cek: metode selain GET dan POST jawab `405 metode tidak diizinkan`; path tidak ada di daftar rute jawab `404 tidak ditemukan`; POST tanpa isi jawab `400 isi kosong`; POST dengan isi jawab `201 dibuat`; sisanya `200 OK`. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nvar rute = map[string]bool{\n\t\"/beranda\": true,\n\t\"/catatan\": true,\n}\n\nfunc status(metode, path string, isi int) string {\n\tif metode != \"GET\" ___ metode != \"POST\" {\n\t\treturn \"405 metode tidak diizinkan\"\n\t}\n\tif ___rute[path] {\n\t\treturn \"404 tidak ditemukan\"\n\t}\n\tif metode == \"POST\" ___ isi == 0 {\n\t\treturn \"400 isi kosong\"\n\t}\n\tif metode == \"POST\" {\n\t\treturn \"201 dibuat\"\n\t}\n\treturn \"200 OK\"\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar metode, path string\n\t\tvar isi int\n\t\tfmt.Scan(&metode, &path, &isi)\n\t\tfmt.Println(status(metode, path, isi))\n\t}\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nvar rute = map[string]bool{\n\t\"/beranda\": true,\n\t\"/catatan\": true,\n}\n\nfunc status(metode, path string, isi int) string {\n\tif metode != \"GET\" && metode != \"POST\" {\n\t\treturn \"405 metode tidak diizinkan\"\n\t}\n\tif !rute[path] {\n\t\treturn \"404 tidak ditemukan\"\n\t}\n\tif metode == \"POST\" && isi == 0 {\n\t\treturn \"400 isi kosong\"\n\t}\n\tif metode == \"POST\" {\n\t\treturn \"201 dibuat\"\n\t}\n\treturn \"200 OK\"\n}\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar metode, path string\n\t\tvar isi int\n\t\tfmt.Scan(&metode, &path, &isi)\n\t\tfmt.Println(status(metode, path, isi))\n\t}\n}",
          tests: [
            {
              stdin: "5\nGET /beranda 1\nPOST /catatan 1\nPOST /catatan 0\nPUT /beranda 1\nGET /hapus 1",
              expectedOutput:
                "200 OK\n201 dibuat\n400 isi kosong\n405 metode tidak diizinkan\n404 tidak ditemukan",
            },
            {
              stdin: "3\nGET /catatan 0\nPOST /beranda 1\nGET /beranda 0",
              expectedOutput: "200 OK\n201 dibuat\n200 OK",
            },
            {
              stdin: "2\nPATCH /catatan 1\nPOST /catatan 5",
              expectedOutput: "405 metode tidak diizinkan\n201 dibuat",
              hidden: true,
            },
          ],
          hints: [
            "Metode ditolak bila dua cek gagal sekaligus: bukan GET dan bukan POST; gabungkan dengan &&.",
            "Map rute bernilai true untuk path yang dikenal; untuk path yang tidak dikenal, negasikan hasilnya dengan tanda seru.",
            "POST tanpa isi (0) jawabannya 400; POST berisi jawabannya 201.",
          ],
        },
      ],
    },
    {
      slug: "graceful-shutdown",
      title: "Graceful Shutdown",
      summary: "Matikan server tanpa memotong permintaan yang sedang berjalan.",
      steps: [
        {
          kind: "theory",
          title: "Berhenti menunggu, bukan berhenti memotong",
          body: "Menekan Ctrl+C mengirim sinyal SIGINT, dan perilaku default Go adalah langsung mematikan proses: permintaan yang sedang diproses terpotong di tengah jalan dan klien menerima koneksi yang putus. Graceful shutdown memperbaiki ini dengan kontrak yang jelas: berhenti menerima permintaan baru, biarkan yang sedang berjalan selesai sampai batas waktu, baru keluar.\n\nMekanismenya di Go: bangun server lewat struct http.Server agar referensinya dipegang, jalankan ListenAndServe di goroutine, lalu dengarkan sinyal dengan signal.NotifyContext(context.Background(), os.Interrupt). Saat channel context.Done() terpicu, panggil srv.Shutdown(ctx) dengan context berdeadline, misalnya 10 detik lewat context.WithTimeout. Shutdown menunggu semua handler kembali; bila deadline lewat lebih dulu, ia mengembalikan error dan pemilik keputusan untuk memaksa mati. Satu catatan: Shutdown tidak menutup koneksi yang dibajak seperti websocket; itu ditangani terpisah.\n\nLatihan di bawah menguji kontraknya dalam bentuk yang bisa diamati: permintaan yang datang sebelum momen shutdown tetap berjalan sampai tuntas, bahkan bila waktunya selesai melampaui batas; yang datang pada atau sesudahnya ditolak. Itulah makna kata graceful di sini.",
          code: {
            language: "go",
            content:
              "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"net/http\"\n\t\"os\"\n\t\"os/signal\"\n\t\"time\"\n)\n\nfunc main() {\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"ok\")\n\t})\n\tsrv := &http.Server{Addr: \":8080\", Handler: mux}\n\n\tgo srv.ListenAndServe()\n\tfmt.Println(\"server jalan; tekan Ctrl+C untuk berhenti\")\n\n\tctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)\n\tdefer stop()\n\t<-ctx.Done() // sinyal diterima\n\n\ttunggu, batal := context.WithTimeout(context.Background(), 10*time.Second)\n\tdefer batal()\n\tif err := srv.Shutdown(tunggu); err != nil {\n\t\tfmt.Println(\"berhenti paksa:\", err)\n\t}\n\tfmt.Println(\"server berhenti dengan rapi\")\n}",
            caption: "Sinyal memicu, Shutdown menunggu; deadline menjaga agar server benar-benar berhenti.",
          },
        },
        {
          kind: "code",
          title: "Simulasi aturan drain",
          prompt:
            "Simulasi aturan graceful shutdown. Input: satu baris `batas n` (batas adalah momen shutdown), lalu `n` baris `datang durasi`. Permintaan yang datang pada atau sesudah batas ditolak; yang datang sebelum batas tetap berjalan sampai tuntas pada waktu `datang+durasi`, berapa pun batasnya. Cetak `pekerjaan <i>: selesai di <t>` atau `pekerjaan <i>: ditolak` untuk tiap baris, lalu tutup dengan `server berhenti`. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar batas, n int\n\tfmt.Scan(&batas, &n)\n\tfor i := 1; i <= n; i++ {\n\t\tvar datang, durasi int\n\t\tfmt.Scan(&datang, &durasi)\n\t\tif datang ___ batas {\n\t\t\tfmt.Printf(\"pekerjaan %d: ditolak\\n\", i)\n\t\t\tcontinue\n\t\t}\n\t\tfmt.Printf(\"pekerjaan %d: selesai di %d\\n\", i, ___)\n\t}\n\tfmt.___(\"server berhenti\")\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar batas, n int\n\tfmt.Scan(&batas, &n)\n\tfor i := 1; i <= n; i++ {\n\t\tvar datang, durasi int\n\t\tfmt.Scan(&datang, &durasi)\n\t\tif datang >= batas {\n\t\t\tfmt.Printf(\"pekerjaan %d: ditolak\\n\", i)\n\t\t\tcontinue\n\t\t}\n\t\tfmt.Printf(\"pekerjaan %d: selesai di %d\\n\", i, datang+durasi)\n\t}\n\tfmt.Println(\"server berhenti\")\n}",
          tests: [
            {
              stdin: "10 4\n0 5\n4 6\n10 3\n8 2",
              expectedOutput:
                "pekerjaan 1: selesai di 5\npekerjaan 2: selesai di 10\npekerjaan 3: ditolak\npekerjaan 4: selesai di 10\nserver berhenti",
            },
            {
              stdin: "5 2\n0 3\n5 1",
              expectedOutput: "pekerjaan 1: selesai di 3\npekerjaan 2: ditolak\nserver berhenti",
            },
            {
              stdin: "100 3\n0 100\n99 1\n99 2",
              expectedOutput:
                "pekerjaan 1: selesai di 100\npekerjaan 2: selesai di 100\npekerjaan 3: selesai di 101\nserver berhenti",
              hidden: true,
            },
          ],
          hints: [
            "Permintaan ditolak bila waktu datangnya sama dengan atau sesudah momen shutdown.",
            "Permintaan yang sudah masuk selesai pada waktu datang ditambah durasi, tanpa memedulikan batas; itulah inti graceful.",
            "Mencetak satu baris tanpa format memakai fmt.Println.",
          ],
        },
      ],
    },
    {
      slug: "mini-api-catatan",
      title: "Mini Proyek: API Catatan",
      summary: "Bangun API catatan in-memory: tambah, lihat, hapus, lengkap dengan validasi.",
      steps: [
        {
          kind: "theory",
          title: "In-memory, dengan validasi yang sopan",
          body: "Proyek akhir pertama: API catatan yang datanya hidup di memori proses. Penyimpanannya cukup slice of string karena urutan penting saat menampilkan daftar. Tiga operasinya adalah cermin kata kerja HTTP yang sudah kamu kenal: tambah setara POST, lihat setara GET untuk daftar, dan hapus <nomor> setara DELETE untuk resource bernomor. Karena tanpa database, data hilang saat proses mati; untuk tahap belajar ini wajar, dan menyimpan ke berkas adalah latihan lanjutan yang bagus.\n\nDua teknik di balik layar perlu dicermati. Pertama, teks catatan boleh berisi spasi, jadi baris perintah dipecah dengan strings.SplitN(baris, \" \", 2): bagian pertama perintahnya, bagian kedua seluruh sisa teksnya. Kedua, menghapus elemen slice memakai idiom satu baris yang layak diingat: append(s[:i], s[i+1:]...), yang menggeser sisa elemen menutup lubang. Nomor pengguna mulai dari 1 sementara indeks slice mulai dari 0, jadi selalu ada penerjemahan nomor-1 di titik pemakaian.\n\nBagian yang paling sering diremehkan justru validasi: hapus dengan nomor 0, negatif, atau lebih besar dari jumlah catatan harus dijawab sopan dengan pesan jelas, bukan crash. Di API sungguhan, inilah bedanya status 400 versus 500.",
          code: {
            language: "go",
            content:
              "// hapus elemen index i dari slice s\ns = append(s[:i], s[i+1:]...)",
            caption: "Idiom hapus yang perlu diingat: geser sisa elemen untuk menutup lubang.",
          },
        },
        {
          kind: "code",
          title: "Rakit API catatan dari stdin",
          prompt:
            "API catatan in-memory. Input: baris pertama `n`, lalu `n` perintah: `tambah <teks>` (teks boleh berisi spasi), `lihat`, atau `hapus <nomor>`. Keluaran: tambah mencetak `tersimpan: <teks>`; lihat mencetak daftar bernomor `1. <teks>` atau `tidak ada catatan` bila kosong; hapus mencetak `hapus: <teks>` bila nomor sah, atau `nomor tidak ada` bila di luar rentang. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Buffer(make([]byte, 64*1024), 64*1024)\n\tscanner.Scan()\n\tn, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\tcatatan := []string{}\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tbagian := strings.SplitN(strings.TrimSpace(scanner.Text()), \" \", 2)\n\t\tswitch bagian[0] {\n\t\tcase \"tambah\":\n\t\t\tcatatan = append(catatan, ___)\n\t\t\tfmt.Println(\"tersimpan: \" + bagian[1])\n\t\tcase \"lihat\":\n\t\t\tif len(catatan) == 0 {\n\t\t\t\tfmt.Println(\"tidak ada catatan\")\n\t\t\t}\n\t\t\tfor j, c := range catatan {\n\t\t\t\tfmt.Printf(\"%d. %s\\n\", ___, c)\n\t\t\t}\n\t\tcase \"hapus\":\n\t\t\tnomor, _ := strconv.Atoi(bagian[1])\n\t\t\tif nomor >= 1 && nomor <= len(catatan) {\n\t\t\t\tfmt.Println(\"hapus: \" + catatan[nomor-1])\n\t\t\t\tcatatan = append(catatan[:nomor-1], catatan[___]...)\n\t\t\t} else {\n\t\t\t\tfmt.Println(\"nomor tidak ada\")\n\t\t\t}\n\t\t}\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tscanner.Buffer(make([]byte, 64*1024), 64*1024)\n\tscanner.Scan()\n\tn, _ := strconv.Atoi(strings.TrimSpace(scanner.Text()))\n\tcatatan := []string{}\n\tfor i := 0; i < n; i++ {\n\t\tscanner.Scan()\n\t\tbagian := strings.SplitN(strings.TrimSpace(scanner.Text()), \" \", 2)\n\t\tswitch bagian[0] {\n\t\tcase \"tambah\":\n\t\t\tcatatan = append(catatan, bagian[1])\n\t\t\tfmt.Println(\"tersimpan: \" + bagian[1])\n\t\tcase \"lihat\":\n\t\t\tif len(catatan) == 0 {\n\t\t\t\tfmt.Println(\"tidak ada catatan\")\n\t\t\t}\n\t\t\tfor j, c := range catatan {\n\t\t\t\tfmt.Printf(\"%d. %s\\n\", j+1, c)\n\t\t\t}\n\t\tcase \"hapus\":\n\t\t\tnomor, _ := strconv.Atoi(bagian[1])\n\t\t\tif nomor >= 1 && nomor <= len(catatan) {\n\t\t\t\tfmt.Println(\"hapus: \" + catatan[nomor-1])\n\t\t\t\tcatatan = append(catatan[:nomor-1], catatan[nomor:]...)\n\t\t\t} else {\n\t\t\t\tfmt.Println(\"nomor tidak ada\")\n\t\t\t}\n\t\t}\n\t}\n}",
          tests: [
            {
              stdin: "6\ntambah belajar go\ntambah baca buku\nlihat\nhapus 1\nlihat\ntambah minum air",
              expectedOutput:
                "tersimpan: belajar go\ntersimpan: baca buku\n1. belajar go\n2. baca buku\nhapus: belajar go\n1. baca buku\ntersimpan: minum air",
            },
            {
              stdin: "3\nlihat\ntambah uji satu\nlihat",
              expectedOutput: "tidak ada catatan\ntersimpan: uji satu\n1. uji satu",
            },
            {
              stdin: "5\ntambah a b\nhapus 5\nhapus 1\nlihat\ntambah c",
              expectedOutput: "tersimpan: a b\nnomor tidak ada\nhapus: a b\ntidak ada catatan\ntersimpan: c",
              hidden: true,
            },
          ],
          hints: [
            "SplitN membelah baris paling banyak jadi dua bagian: perintah dan sisa teksnya; sisa teks ada di bagian[1].",
            "Penomoran daftar mulai dari 1, sedangkan indeks range mulai dari 0.",
            "Idiom hapus elemen slice adalah append(s[:i], s[i+1:]...); di sini i sama dengan nomor dikurangi satu.",
          ],
        },
      ],
    },
    {
      slug: "mini-agregasi-data",
      title: "Mini Proyek: Agregasi Data",
      summary: "Akumulasi data per kunci di map dan keluarkan laporan dengan urutan pasti.",
      steps: [
        {
          kind: "theory",
          title: "Map untuk menghitung, slice untuk menampilkan",
          body: "Proyek akhir kedua memproses data dalam jumlah lebih besar: catatan penjualan, satu baris satu pasang produk dan jumlah, yang harus diringkas menjadi total per produk. Pola agregasinya selalu sama: map[string]int sebagai wadah akumulasi, lalu satu loop menambahkan lewat total[nama] += jumlah. Nilai nol bawaan map membuat baris pertama tidak butuh inisialisasi khusus, dan angka negatif (misalnya retur) otomatis ikut terhitung karena += tidak peduli tanda.\n\nSatu sifat map yang wajib dihormati: urutan iterasinya sengaja dirandom oleh Go, jadi mencetak langsung dari map menghasilkan urutan berbeda tiap dijalankan. Idiom untuk laporan yang deterministik: kumpulkan semua kunci ke slice, urutkan dengan sort.Strings, lalu cetak lewat kunci yang sudah terurut. Data sama, keluaran sama, tiap kali; itu kebiasaan yang membuat laporan bisa diuji dan dibandingkan.\n\nSetelah daftar per produk, laporan biasanya ditutup angka besar: total semua item. Karena setiap nilai per produk sudah dihitung, totalnya cukup dijumlahkan di loop yang sama; tidak perlu membaca input dua kali.",
          code: {
            language: "go",
            content:
              "total := map[string]int{}\n// akumulasi per kunci\ntotal[nama] += jumlah\n\nkunci := make([]string, 0, len(total))\nfor k := range total {\n\tkunci = append(kunci, k)\n}\nsort.Strings(kunci)\nfor _, k := range kunci {\n\tfmt.Println(k, total[k])\n}",
            caption: "Map untuk menghitung, slice terurut untuk menampilkan; inilah resep laporan deterministik.",
          },
        },
        {
          kind: "code",
          title: "Susun laporan penjualan",
          prompt:
            "Laporan penjualan. Input: baris pertama `n`, lalu `n` baris `produk jumlah` (jumlah boleh negatif untuk retur). Jumlahkan per produk, cetak tiap produk dengan totalnya diurut abjad dalam format `produk: total`, lalu tutup dengan baris `total item: <jumlah semua>`. Lengkapi tiga bagian kosong.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\ttotal := map[string]int{}\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar jumlah int\n\t\tfmt.Scan(&nama, &jumlah)\n\t\ttotal[___] += jumlah\n\t}\n\tkunci := make([]string, 0, len(total))\n\tfor k := ___ total {\n\t\tkunci = append(kunci, k)\n\t}\n\tsort.___(kunci)\n\tsemua := 0\n\tfor _, k := range kunci {\n\t\tfmt.Printf(\"%s: %d\\n\", k, total[k])\n\t\tsemua += total[k]\n\t}\n\tfmt.Printf(\"total item: %d\\n\", semua)\n}",
          solution:
            "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tvar n int\n\tfmt.Scan(&n)\n\ttotal := map[string]int{}\n\tfor i := 0; i < n; i++ {\n\t\tvar nama string\n\t\tvar jumlah int\n\t\tfmt.Scan(&nama, &jumlah)\n\t\ttotal[nama] += jumlah\n\t}\n\tkunci := make([]string, 0, len(total))\n\tfor k := range total {\n\t\tkunci = append(kunci, k)\n\t}\n\tsort.Strings(kunci)\n\tsemua := 0\n\tfor _, k := range kunci {\n\t\tfmt.Printf(\"%s: %d\\n\", k, total[k])\n\t\tsemua += total[k]\n\t}\n\tfmt.Printf(\"total item: %d\\n\", semua)\n}",
          tests: [
            {
              stdin: "6\nbuku 3\npulpen 5\nbuku 2\ntas 1\npulpen 4\nbuku 1",
              expectedOutput: "buku: 6\npulpen: 9\ntas: 1\ntotal item: 16",
            },
            { stdin: "2\na 10\na -3", expectedOutput: "a: 7\ntotal item: 7" },
            { stdin: "3\nz 1\na 2\nz 3", expectedOutput: "a: 2\nz: 4\ntotal item: 6", hidden: true },
          ],
          hints: [
            "Akumulasi per produk: tambahkan jumlah ke entri map yang kuncinya nama.",
            "Menjelajahi isi map memakai range.",
            "Fungsi package sort untuk slice string bernama Strings.",
          ],
        },
      ],
    },
    {
      slug: "godoc-membaca-kode",
      title: "Membaca Kode Orang dan GoDoc",
      summary: "Baca kode orang lain dengan go doc dan pkg.go.dev, dan tulis komentar dokumen yang benar.",
      steps: [
        {
          kind: "theory",
          title: "Membaca adalah keahlian kerja",
          body: "Di pekerjaan nyata kamu membaca kode jauh lebih banyak daripada menulisnya: kode tim, dependensi, dan stdlib. Go membuat membaca jadi murah. go doc fmt.Println menampilkan dokumentasi di terminal tanpa membuka browser; pkg.go.dev memuat dokumentasi setiap modul publik dengan versi dan sourcenya; dan source stdlib sendiri layak dibaca langsung, karena tulisannya bersih dan penuh idiom yang layak ditiru. Saat perilaku sebuah fungsi terasa aneh, kebiasaan yang paling cepat: tulis program sepuluh baris untuk memancing perilakunya, bukan menebak.\n\nKebalikannya, tulis komentar dokumen agar kode kamu enak dibaca orang. Konvensinya khas Go: baris komentar langsung di atas deklarasi, diawali nama yang didokumentasikan, sebagai kalimat penuh; // HitungDiskon mengembalikan potongan harga untuk harga dan persen tertentu. Tidak perlu mengulang tipe parameter karena tanda tangan fungsi sudah menampilkannya. Identitas yang diawali huruf besar diekspor dan layak didokumentasikan; helper kecil yang unexported tetap menyenangkan bila diberi komentar untuk dirimu di masa depan.\n\nUrutan membaca sebuah repo Go yang efektif: go.mod dulu untuk tahu nama modul dan dependensinya, lalu cmd/ untuk melihat titik masuk, lalu internal/ untuk logika; test juga peta yang jujur, karena test menunjukkan cara pakai yang sebenarnya.",
          code: {
            language: "go",
            content:
              "// Paket kasir menyediakan perhitungan struk sederhana.\npackage kasir\n\n// HitungDiskon mengembalikan potongan harga untuk harga\n// dan persen tertentu. Persen boleh nol.\nfunc HitungDiskon(harga, persen int) int {\n\treturn harga * persen / 100\n}",
            caption: "Komentar dokumen diawali nama deklarasi, kalimat penuh, tanpa mengulang tanda tangan fungsi.",
          },
        },
        {
          kind: "quiz",
          question: "Bagaimana komentar dokumentasi untuk fungsi HitungDiskon sebaiknya dimulai?",
          options: [
            "// Fungsi untuk menghitung diskon:",
            "// HitungDiskon mengembalikan potongan harga untuk harga dan persen tertentu.",
            "// ============ DISKON ============",
            "// TODO: dokumentasikan nanti",
          ],
          answer: 1,
          explanation:
            "Konvensi GoDoc: komentar diawali nama yang didokumentasikan dan ditulis sebagai kalimat penuh; alat dokumentasi memakai baris itu apa adanya.",
        },
        {
          kind: "quiz",
          question: "Perintah terminal untuk melihat dokumentasi fmt.Println?",
          options: ["go help fmt.Println", "go doc fmt.Println", "go manual fmt.Println", "godocc fmt.Println"],
          answer: 1,
          explanation:
            "go doc fmt.Println menampilkan komentar dokumen dan tanda tangan fungsinya langsung di terminal; pkg.go.dev untuk versi web.",
        },
      ],
    },
    {
      slug: "checklist-siap-kerja",
      title: "Checklist Kesiapan Kerja",
      summary: "Daftar cek kesiapan kerja yang bisa diverifikasi orang lain, bukan klaim.",
      steps: [
        {
          kind: "theory",
          title: "Bukti, bukan perasaan",
          body: "Kesiapan kerja lebih terasa sebagai daftar cek daripada perasaan. Dari sisi kode: penamaan yang khas Go, error ditangani bukan diabaikan dengan _ di tempat yang penting, context dibawa ke lapisan bawah bila relevan, dan program konkuren lulus go test -race tanpa temuan. Dari sisi pengujian: logika inti punya table-driven test, dan kamu nyaman membaca laporan coverage tanpa memujanya sebagai angka.\n\nDari sisi alat dan kolaborasi: gofmt dan go vet bersih, staticcheck tidak berteriak, go.mod dan go.sum terawat, dan binary bisa dibangun ulang dari nol dengan satu perintah yang tertulis di README. README itu sendiri adalah tes keterbacaan: teman harus bisa menjalankan proyekmu dalam lima menit tanpa menanyakan apa pun. Komit kecil dengan pesan jelas menutup daftar, karena itu yang dilihat reviewer pertama kali sebelum membaca satu baris kode.\n\nCara memakai daftar ini: pilih satu proyek kecil, lalu bawa sampai tuntas melalui seluruh butir. Satu proyek yang semua butirnya bisa diverifikasi orang lain jauh lebih bernilai daripada lima proyek setengah jalan; repo itu sendiri adalah bukti, dan wawancara kerja nyaris selalu menanyakan bukti.",
          code: {
            language: "text",
            content:
              "[x] proyek punya go.mod dan struktur cmd/ internal/\n[x] logika inti punya table-driven test\n[x] gofmt dan go vet bersih\n[x] README: cara jalan, cara tes, contoh pemakaian\n[x] binary bisa dibangun ulang dari nol dengan satu perintah",
            caption: "Daftar cek yang bisa diverifikasi orang lain, bukan klaim diri sendiri.",
          },
        },
        {
          kind: "quiz",
          question: "Butir mana yang paling menunjukkan kesiapan kerja secara terverifikasi?",
          options: [
            "Mampu menyebut sepuluh bahasa pemrograman",
            "Repo yang lulus vet, punya test, dan bisa dijalankan orang lain lewat README",
            "Sertifikat kursus tanpa proyek pendamping",
            "Menghafal semua verb format package fmt",
          ],
          answer: 1,
          explanation:
            "Yang bisa dicek orang lain adalah repo: test yang lulus, alat yang bersih, dan README yang membuat proyek jalan dalam hitungan menit.",
        },
        {
          kind: "quiz",
          question: "Saat perilaku program terasa aneh, langkah pertama yang paling sehat?",
          options: [
            "Langsung mengganti pustaka yang dipakai",
            "Membuat program kecil terisolasi yang memunculkan perilakunya, lalu membaca dokumentasi atau sumbernya",
            "Menghapus cache lalu mencoba berulang tanpa mengubah apa pun",
            "Bertanya di forum tanpa mencoba apa pun lebih dulu",
          ],
          answer: 1,
          explanation:
            "Program kecil yang mereproduksi masalah mempersempit penyebab, dan hasilnya bisa dilampirkan saat bertanya; itulah kebiasaan pembaca kode yang baik.",
        },
      ],
    },
    {
      slug: "rekap-jalur-lanjutan",
      title: "Rekap dan Jalur Lanjutan",
      summary: "Tutup jalur dengan rekap dan peta belajar lanjutan yang konkret.",
      steps: [
        {
          kind: "theory",
          title: "Yang sudah kamu punya, dan langkah berikutnya",
          body: "Sebentar saja menoleh ke belakang: jalur ini mulai dari gaya penulisan Go yang idiomatik, lewat slice dan map, struct dan method, interface dan error, generics, goroutine dan channel, pola sinkronisasi, stdlib, alat kerja dan pengujian, sampai server HTTP dan mini proyek. Itu bukan daftar topik acak; itulah bentuk standar pekerjaan Go: model data yang jujur, fungsi kecil yang teruji, konkurensi yang terkendali, dan alat yang menjaga disiplin.\n\nCara naik level dari sini bukan mengulang tutorial, tapi membangun satu hal yang nyata sampai tuntas: API dengan database, CLI yang memproses berkas secara massal, atau pekerja latar yang mengonsumsi antrean. Sambil membangun, baca kode yang baik: stdlib seperti net/http dan strings, lalu proyek open source yang populer; perhatikan bukan hanya apa yang ditulis, tapi apa yang sengaja tidak ditulis. Topik lanjutan boleh masuk sesuai kebutuhan: pprof untuk mencari kemacetan, database/sql untuk penyimpanan, dan penyebaran yang benar.\n\nSatu kebiasaan dari jalur ini yang layak dibawa terus: fungsi kecil, tabel kasus, keluaran deterministik, dan alat sebelum opini. Go menghargai kejelasan yang sedikit membosankan, dan kejelasan itulah yang sebenarnya diuji di dunia kerja.",
          code: {
            language: "text",
            content:
              "usulan langkah lanjutan, dalam urutan:\n1. bangun satu API dengan penyimpanan database\n2. tambahkan go test -race dan benchmark ke proyek itu\n3. saat lambat, profil dengan pprof; jangan menebak\n4. kontribusi ke proyek open source Go, mulai dari dokumentasi dan test",
            caption: "Jalur lanjutan bukan daftar tutorial baru, tapi satu proyek yang makin dalam.",
          },
        },
        {
          kind: "quiz",
          question: "Cara paling efektif naik level setelah jalur ini selesai?",
          options: [
            "Mengulang tutorial dasar yang sama",
            "Membangun satu proyek nyata sampai tuntas dan membaca kode proyek lain",
            "Menghafal syntax lewat kartu hafalan",
            "Menunggu tugas datang sebelum mencoba membangun apa pun",
          ],
          answer: 1,
          explanation:
            "Proyek nyata memaksa semua kebiasaan bekerja bersama: desain, test, alat, dan dokumentasi; membaca kode orang lain menaikkan standar tulisanmu.",
        },
        {
          kind: "quiz",
          question: "Tool bawaan Go untuk mencari kemacetan performa pada program yang berjalan?",
          options: ["go vet", "pprof", "gofmt", "go mod tidy"],
          answer: 1,
          explanation:
            "pprof memprofilkan CPU dan memori sehingga kemacetan terlihat terukur; vet dan gofmt mengurus kebenaran dan format, bukan kecepatan.",
        },
      ],
    },
  ],
};
