import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "go",
  moduleRange: [2, 3],
  modules: [
    {
      title: "Struct dan Method",
      description: "Struct, embedding, method pointer vs value, dan komposisi tanpa inheritance.",
    },
    {
      title: "Interface dan Error",
      description: "Interface implisit, pola error, errors.Is/As/wrapping, panic/recover yang benar.",
    },
  ],
  lessons: [
    // ==================== MODUL 2: Struct dan Method ====================
    {
      slug: "struct-dasar-literal",
      title: "Anatomi Struct dan Literalnya",
      summary: "Definisikan tipe struct, isi lewat literal bernama maupun posisi, dan baca isinya dengan %v.",
      steps: [
        {
          kind: "theory",
          title: "Kumpulan field sebagai satu tipe",
          body: "Modul sebelumnya sudah menyinggung struct sebagai elemen slice. Sekarang kita bedah tipe struct itu sendiri: kumpulan field yang masing-masing punya nama dan tipe. Tipe struct dideklarasikan sekali di level package dengan `type`, lalu bisa dipakai di semua fungsi. Field yang awalnya huruf kapital bersifat ekspor dan bisa diakses dari package lain; yang kecil hanya hidup di package ini.\n\nAda dua cara menulis literal struct. Literal bernama menyebut field satu per satu, `Produk{Nama: \"Buku\", Harga: 35000}`, dan boleh menyebut sebagian saja: field yang tidak disebut menerima zero value. Literal posisi, `Produk{\"Buku\", 35000, 5}`, lebih singkat tetapi wajib mengisi semua field sesuai urutan deklarasi, dan rusak begitu urutan field berubah. Karena itu gaya idiomatik adalah literal bernama.\n\nStruct tanpa nilai awal tetap siap dipakai: seluruh field berisi zero value masing-masing. Untuk mengintip isi struct saat debugging, `%v` mencetak `{Buku 35000}`, sedangkan `%+v` menyertakan nama field: `{Nama:Buku Harga:35000}`.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Produk struct {\n\tNama  string\n\tHarga int\n\tStok  int\n}\n\nfunc main() {\n\tp1 := Produk{Nama: \"Buku\", Harga: 35000} // Stok dapat zero value\n\tp2 := Produk{\"Tas\", 120000, 5}           // posisi: wajib lengkap\n\tvar p3 Produk                            // {\"\", 0, 0}\n\n\tfmt.Println(p1)\n\tfmt.Printf(\"%+v\\n\", p2)\n\tfmt.Printf(\"%+v\\n\", p3)\n}",
            caption: "Literal bernama boleh menyebut sebagian field; literal posisi wajib lengkap dan berurutan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan `type Produk struct { Nama string; Harga int; Stok int }`, apa isi `p.Stok` setelah `p := Produk{Nama: \"Buku\", Harga: 35000}`?",
          options: ["nil", "Error: semua field wajib diisi", "0, field yang tidak disebut dapat zero value", "1"],
          answer: 2,
          explanation:
            "Literal bernama boleh menyebut sebagian field. Field yang tidak disebut menerima zero value tipenya; untuk int berarti 0.",
        },
        {
          kind: "code",
          title: "Lengkapi tipe dan cetak struct",
          prompt:
            "Lengkapi dua kekosongan: nama tipe struct yang dipakai literal, dan verb `%` yang mencetak struct beserta nama fieldnya. Input: nama, harga, lalu stok.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Produk struct {\n\tNama  string\n\tHarga int\n\tStok  int\n}\n\nfunc main() {\n\tvar nama string\n\tvar harga, stok int\n\tfmt.Scan(&nama, &harga, &stok)\n\tp := ___{Nama: nama, Harga: harga, Stok: stok}\n\tfmt.Printf(\"%___\\n\", p)\n\tfmt.Printf(\"nilai stok: %d\\n\", p.Harga*p.Stok)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Produk struct {\n\tNama  string\n\tHarga int\n\tStok  int\n}\n\nfunc main() {\n\tvar nama string\n\tvar harga, stok int\n\tfmt.Scan(&nama, &harga, &stok)\n\tp := Produk{Nama: nama, Harga: harga, Stok: stok}\n\tfmt.Printf(\"%+v\\n\", p)\n\tfmt.Printf(\"nilai stok: %d\\n\", p.Harga*p.Stok)\n}",
          tests: [
            { stdin: "Pensil 4000 12", expectedOutput: "{Nama:Pensil Harga:4000 Stok:12}\nnilai stok: 48000" },
            { stdin: "Tas 120000 5", expectedOutput: "{Nama:Tas Harga:120000 Stok:5}\nnilai stok: 600000" },
            { stdin: "Penghapus 3000 0", expectedOutput: "{Nama:Penghapus Harga:3000 Stok:0}\nnilai stok: 0", hidden: true },
          ],
          hints: [
            "Nama tipe ditulis langsung sebelum kurung kurawal literal, seperti Produk{...}.",
            "Isi verbnya sehingga menjadi %+v, verb yang menyertakan nama field.",
            "Jawabannya: Produk dan +v.",
          ],
        },
      ],
    },
    {
      slug: "method-value-receiver",
      title: "Method dengan Value Receiver",
      summary: "Tempelkan fungsi pada tipe lewat receiver, dan panggil lewat nilai maupun pointer.",
      steps: [
        {
          kind: "theory",
          title: "Fungsi yang menempel pada tipe",
          body: "Method adalah fungsi yang menempel pada satu tipe. Bedanya hanya receiver: `func (t Tiket) TotalBeli(jumlah int) int` memiliki receiver `t` bertipe Tiket, sehingga dipanggil `t.TotalBeli(2)`. Konvensi penamaan receiver pendek dan konsisten: huruf pertama nama tipenya, dan jangan berganti nama di antara method (t saja, bukan t di satu method lalu tk di method lain).\n\nValue receiver menerima salinan struct. Untuk method yang hanya membaca dan menghitung, itu justru ideal: method tidak bisa merusak data pemanggil. Method juga bebas memanggil method lain pada receiver yang sama, seperti TotalBeli dipakai oleh Rincian.\n\nPemanggilan tetap nyaman dari dua arah: lewat nilai maupun pointer. `p := Tiket{}; p.Rincian(2)` sah, dan begitu juga `pt := &p; pt.Rincian(2)`, karena method set dari *Tiket mencakup method value receiver. Go menyisipkan dereference otomatis saat kompilasi.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Tiket struct {\n\tAcara string\n\tHarga int\n}\n\nfunc (t Tiket) TotalBeli(jumlah int) int {\n\treturn t.Harga * jumlah\n}\n\nfunc (t Tiket) Rincian(jumlah int) string {\n\treturn fmt.Sprintf(\"%s x%d = Rp%d\", t.Acara, jumlah, t.TotalBeli(jumlah))\n}\n\nfunc main() {\n\tt := Tiket{Acara: \"Konser\", Harga: 150000}\n\tfmt.Println(t.Rincian(2))\n\n\tpt := &t\n\tfmt.Println(pt.TotalBeli(3)) // sah: *Tiket juga punya method value receiver\n}",
            caption: "Method membaca receiver dan saling memanggil; pemanggil lewat pointer tetap sah.",
          },
        },
        {
          kind: "quiz",
          question: "Manakah deklarasi method `Luas` untuk tipe `Kotak` yang tidak mengubah nilainya?",
          options: ["func Kotak.Luas() int", "func (k Kotak) Luas() int", "method (k Kotak) Luas() int", "func Luas(Kotak) int"],
          answer: 1,
          explanation:
            "Method ditulis sebagai fungsi dengan receiver di depan nama: func (k Kotak) Luas() int. Receiver adalah parameter pertama yang tersirat.",
        },
        {
          kind: "code",
          title: "Method pembeli tiket",
          prompt:
            "Lengkapi isi TotalBeli (harga kali jumlah) dan nama method yang merangkai rincian, dipanggil main sebagai t.Rincian(jumlah). Input: nama acara, harga, lalu jumlah tiket.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Tiket struct {\n\tAcara string\n\tHarga int\n}\n\nfunc (t Tiket) TotalBeli(jumlah int) int {\n\treturn ___\n}\n\nfunc (t Tiket) ___(jumlah int) string {\n\treturn fmt.Sprintf(\"%s x%d = Rp%d\", t.Acara, jumlah, t.TotalBeli(jumlah))\n}\n\nfunc main() {\n\tvar t Tiket\n\tvar jumlah int\n\tfmt.Scan(&t.Acara, &t.Harga, &jumlah)\n\tfmt.Println(t.Rincian(jumlah))\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Tiket struct {\n\tAcara string\n\tHarga int\n}\n\nfunc (t Tiket) TotalBeli(jumlah int) int {\n\treturn t.Harga * jumlah\n}\n\nfunc (t Tiket) Rincian(jumlah int) string {\n\treturn fmt.Sprintf(\"%s x%d = Rp%d\", t.Acara, jumlah, t.TotalBeli(jumlah))\n}\n\nfunc main() {\n\tvar t Tiket\n\tvar jumlah int\n\tfmt.Scan(&t.Acara, &t.Harga, &jumlah)\n\tfmt.Println(t.Rincian(jumlah))\n}",
          tests: [
            { stdin: "Konser 150000 2", expectedOutput: "Konser x2 = Rp300000" },
            { stdin: "Film 50000 3", expectedOutput: "Film x3 = Rp150000" },
            { stdin: "Teater 75000 0", expectedOutput: "Teater x0 = Rp0", hidden: true },
          ],
          hints: [
            "TotalBeli mengalikan harga tiket dengan jumlah yang dibeli.",
            "Method dipanggil di main lewat t.Rincian(jumlah), jadi namanya mengikuti panggilan itu.",
            "Jawabannya: t.Harga * jumlah dan Rincian.",
          ],
        },
      ],
    },
    {
      slug: "pointer-receiver",
      title: "Pointer Receiver Saat Perlu Mengubah",
      summary: "Kenali batas value receiver dan gunakan pointer receiver saat method harus mengubah data.",
      steps: [
        {
          kind: "theory",
          title: "Salinan yang lenyap",
          body: "Value receiver mengantar salinan ke dalam method, sehingga `t.Saldo += jumlah` hanya mengubah salinan itu dan lenyap begitu method selesai. Bug ini nyata dan tidak terdeteksi compiler. Kalau method harus mengubah receiver, receivernya wajib pointer: `func (t *Tabungan) Setor(jumlah int)`.\n\nAda dua alasan memilih pointer receiver. Pertama, mutasi seperti di atas. Kedua, efisiensi: struct besar yang dikirim lewat value receiver tersalin di setiap pemanggilan. Karena itu gaya umum di kode Go: sekali satu method memakai pointer receiver, method lain pada tipe yang sama ikut memakai pointer supaya konsisten.\n\nGo memanggilnya tetap rapi: `t.Setor(100)` pada variabel biasa otomatis menjadi `(&t).Setor(100)`. Batasnya muncul di elemen map: elemen map tidak bisa diambil alamatnya, jadi `m[\"b1\"].Setor(100)` tidak bisa dikompilasi. Simpan pointer di map, `m := map[string]*Tabungan{}`, lalu panggil methodnya.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Hitung struct {\n\tN int\n}\n\nfunc (h Hitung) NaikSalah() { h.N++ } // mengubah salinan, lenyap\n\nfunc (h *Hitung) Naik() { h.N++ }\n\nfunc main() {\n\th := Hitung{}\n\th.NaikSalah()\n\tfmt.Println(h.N) // 0\n\th.Naik()\n\th.Naik()\n\tfmt.Println(h.N) // 2\n}",
            caption: "Satu method mengubah salinan, satu method mengubah aslinya; bedanya hanya tanda *.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `func (s Saldo) Tambah(n int)` tidak pernah mengubah saldo pemanggil?",
          options: [
            "Karena int tidak bisa dijumlah",
            "Karena s adalah salinan dari saldo pemanggil",
            "Karena method wajib mengembalikan error",
            "Karena Saldo harus di-embed dulu",
          ],
          answer: 1,
          explanation:
            "Value receiver menerima salinan struct. Perubahan hanya terjadi pada salinan itu; agar aslinya ikut berubah, receiver harus *Saldo.",
        },
        {
          kind: "code",
          title: "Perbaiki setoran yang menguap",
          prompt:
            "Program seharusnya mencetak total saldo setelah semua setoran, tapi hasilnya selalu 0. Cari dan perbaiki satu kesalahannya. Input: banyak setoran, lalu nilai tiap setoran.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Tabungan struct {\n\tSaldo int\n}\n\nfunc (t Tabungan) Setor(jumlah int) {\n\tt.Saldo += jumlah\n}\n\nfunc main() {\n\tvar t Tabungan\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tt.Setor(x)\n\t}\n\tfmt.Println(t.Saldo)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Tabungan struct {\n\tSaldo int\n}\n\nfunc (t *Tabungan) Setor(jumlah int) {\n\tt.Saldo += jumlah\n}\n\nfunc main() {\n\tvar t Tabungan\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar x int\n\t\tfmt.Scan(&x)\n\t\tt.Setor(x)\n\t}\n\tfmt.Println(t.Saldo)\n}",
          tests: [
            { stdin: "3\n1000 2000 500", expectedOutput: "3500" },
            { stdin: "1\n25000", expectedOutput: "25000" },
            { stdin: "4\n100 100 100 700", expectedOutput: "1000", hidden: true },
          ],
          hints: [
            "Jalankan dulu: hasilnya selalu 0 walaupun setoran terbaca semua.",
            "Method yang memutasi field receiver harus menerima pointer agar perubahan tidak hilang.",
            "Ubah receivernya menjadi (t *Tabungan). Isi methodnya sudah benar.",
          ],
        },
      ],
    },
    {
      slug: "constructor-newx",
      title: "Pola NewX: Konstruktor Go",
      summary: "Konvensi NewX untuk menyiapkan nilai siap pakai, tanpa kata kunci constructor.",
      steps: [
        {
          kind: "theory",
          title: "Tidak ada constructor, ada NewX",
          body: "Go tidak punya constructor. Zero value sering bukan keadaan awal yang valid, misalnya map nil yang panic saat ditulis. Gantinya, Go memakai konvensi fungsi NewX: `func NewStack() *Stack` yang mengembalikan struct siap pakai, sudah diisi field yang tidak bisa mengandalkan zero value.\n\nMengembalikan pointer adalah kebiasaan umum: seluruh pemanggil berbagi satu struct yang sama, dan method pointer bisa dipakai. Untuk tipe yang butuh validasi, pola yang sama diperluas menjadi `(T, error)`; modul berikutnya membahas itu. Penamaan mengikuti package: di package umum namanya NewStack, di package khusus stack cukup `New`, seperti `bytes.NewBuffer` di package bytes.\n\nFungsi NewX juga tempat menaruh keputusan alokasi: `make([]int, 0, 8)` memesan kapasitas di muka supaya append tidak menyalin berulang-ulang. Pemanggil tidak perlu tahu detailnya; ia hanya memanggil NewX dan memakai hasilnya.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Stack struct {\n\tData []int\n}\n\nfunc NewStack() *Stack {\n\treturn &Stack{Data: make([]int, 0, 8)}\n}\n\nfunc (s *Stack) Push(v int) { s.Data = append(s.Data, v) }\n\nfunc main() {\n\ts := NewStack()\n\ts.Push(1)\n\ts.Push(2)\n\tfmt.Println(s.Data, len(s.Data))\n}",
            caption: "NewStack menyiapkan slice berkapasitas; pemanggil tinggal memakai Push.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa fungsi NewX lazim mengembalikan *T, bukan T?",
          options: [
            "Supaya tidak perlu import fmt",
            "Supaya semua pemanggil berbagi satu struct dan method pointer bisa dipakai",
            "Karena Go melarang mengembalikan struct biasa",
            "Agar struct tersalin lebih cepat",
          ],
          answer: 1,
          explanation:
            "Pointer membuat semua pemanggil merujuk struct yang sama, dan method set *T mencakup method pointer. Untuk NewX yang bisa gagal, polanya diperluas menjadi (T, error).",
        },
        {
          kind: "code",
          title: "Bangun konstruktor antrean",
          prompt:
            "Lengkapi konstruktor: nama fungsinya (yang dipanggil main) dan kapasitas awal slice dari parameter. Input: nama antrean, kapasitas, banyak isi, lalu isi-nya.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Antrean struct {\n\tNama string\n\tData []string\n}\n\nfunc ___(nama string, kapasitas int) *Antrean {\n\treturn &Antrean{\n\t\tNama: nama,\n\t\tData: make([]string, 0, ___),\n\t}\n}\n\nfunc (a *Antrean) Tambah(v string) {\n\ta.Data = append(a.Data, v)\n}\n\nfunc main() {\n\tvar nama string\n\tvar kap, n int\n\tfmt.Scan(&nama, &kap, &n)\n\ta := NewAntrean(nama, kap)\n\tfor i := 0; i < n; i++ {\n\t\tvar v string\n\t\tfmt.Scan(&v)\n\t\ta.Tambah(v)\n\t}\n\tfmt.Printf(\"%s: %v (len %d, cap %d)\\n\", a.Nama, a.Data, len(a.Data), cap(a.Data))\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Antrean struct {\n\tNama string\n\tData []string\n}\n\nfunc NewAntrean(nama string, kapasitas int) *Antrean {\n\treturn &Antrean{\n\t\tNama: nama,\n\t\tData: make([]string, 0, kapasitas),\n\t}\n}\n\nfunc (a *Antrean) Tambah(v string) {\n\ta.Data = append(a.Data, v)\n}\n\nfunc main() {\n\tvar nama string\n\tvar kap, n int\n\tfmt.Scan(&nama, &kap, &n)\n\ta := NewAntrean(nama, kap)\n\tfor i := 0; i < n; i++ {\n\t\tvar v string\n\t\tfmt.Scan(&v)\n\t\ta.Tambah(v)\n\t}\n\tfmt.Printf(\"%s: %v (len %d, cap %d)\\n\", a.Nama, a.Data, len(a.Data), cap(a.Data))\n}",
          tests: [
            { stdin: "kasir 8 3 Budi Ani Cika", expectedOutput: "kasir: [Budi Ani Cika] (len 3, cap 8)" },
            { stdin: "lab 2 2 X Y", expectedOutput: "lab: [X Y] (len 2, cap 2)" },
            { stdin: "cetak 5 1 Z", expectedOutput: "cetak: [Z] (len 1, cap 5)", hidden: true },
          ],
          hints: [
            "Nama fungsi di baris pertama harus sama dengan yang dipanggil main: NewAntrean.",
            "Kapasitas make diisi dari parameter kedua, bukan angka tetap.",
            "Jawabannya: NewAntrean dan kapasitas.",
          ],
        },
      ],
    },
    {
      slug: "embedding-struct",
      title: "Embedding: Field yang Naik",
      summary: "Tempel struct ke struct lain dan akses field serta methodnya lewat promotion.",
      steps: [
        {
          kind: "theory",
          title: "Field tanpa nama, akses tanpa perantara",
          body: "Embedding menempel satu tipe ke struct lain tanpa nama field: cukup nama tipenya. `type Mobil struct { Mesin; Merk string }`. Field dan method milik Mesin ter-promote: bisa diakses langsung dari Mobil, `m.Daya` dan `m.Nyalakan()`, tanpa menulis `m.Mesin.Daya`.\n\nNama field hasil embedding adalah nama tipenya sendiri, jadi akses eksplisit `m.Mesin.Daya` juga selalu sah dan berguna saat ada tabrakan nama. Kalau struct luar punya field atau method dengan nama sama, milik luar menang, dan milik dalam hanya terjangkau lewat penulisan eksplisit.\n\nEmbedding sering disangka inheritance. Bukan: tidak ada hierarki, Mobil tidak menjadi Mesin, dan method yang ter-promote tidak tahu apa-apa tentang Mobil. Yang terjadi hanyalah komposisi dengan jalan pintas penulisan. Pointer juga bisa di-embed, `*Mesin`, kalau struct dalam ingin dibagi atau diganti saat runtime.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Mesin struct {\n\tDaya int\n}\n\nfunc (m Mesin) Nyalakan() string { return \"brum\" }\n\ntype Mobil struct {\n\tMesin // embedded: field dan method ter-promote\n\tMerk  string\n}\n\nfunc main() {\n\tm := Mobil{Merk: \"Kancil\", Mesin: Mesin{Daya: 80}}\n\tfmt.Println(m.Merk, m.Daya, m.Nyalakan())\n\tfmt.Printf(\"%+v\\n\", m)\n}",
            caption: "m.Daya dan m.Nyalakan() datang dari Mesin tanpa perantara.",
          },
        },
        {
          kind: "quiz",
          question:
            "Dengan `type Buku struct { Bab }` dan Bab punya field Halaman, cara mana yang sah untuk mengaksesnya pada variabel `b`?",
          options: ["b.Bab.Halaman saja", "b.Halaman saja", "Keduanya sah, karena field ter-promote", "b.Buku.Halaman"],
          answer: 2,
          explanation:
            "Field hasil embedding ter-promote sehingga b.Halaman sah, dan akses eksplisit lewat nama tipenya, b.Bab.Halaman, juga selalu sah.",
        },
        {
          kind: "code",
          title: "Perbaiki sensor yang tidak naik",
          prompt:
            "Program gagal dikompilasi: field dan method Sensor seharusnya ter-promote ke Stasiun. Perbaiki satu baris deklarasi field di Stasiun. Input: kode stasiun lalu nilai sensor.",
          mode: "fix",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Sensor struct {\n\tNilai float64\n}\n\nfunc (s Sensor) Baca() string {\n\treturn fmt.Sprintf(\"%.1f\", s.Nilai)\n}\n\ntype Stasiun struct {\n\tSensor Sensor\n\tKode   string\n}\n\nfunc main() {\n\tvar kode string\n\tvar nilai float64\n\tfmt.Scan(&kode, &nilai)\n\tst := Stasiun{Kode: kode}\n\tst.Sensor.Nilai = nilai\n\tfmt.Println(st.Kode, st.Baca())\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Sensor struct {\n\tNilai float64\n}\n\nfunc (s Sensor) Baca() string {\n\treturn fmt.Sprintf(\"%.1f\", s.Nilai)\n}\n\ntype Stasiun struct {\n\tSensor\n\tKode string\n}\n\nfunc main() {\n\tvar kode string\n\tvar nilai float64\n\tfmt.Scan(&kode, &nilai)\n\tst := Stasiun{Kode: kode}\n\tst.Sensor.Nilai = nilai\n\tfmt.Println(st.Kode, st.Baca())\n}",
          tests: [
            { stdin: "ST01 36.5", expectedOutput: "ST01 36.5" },
            { stdin: "ST02 -3.24", expectedOutput: "ST02 -3.2" },
            { stdin: "ST03 27.68", expectedOutput: "ST03 27.7", hidden: true },
          ],
          hints: [
            "Pesan compiler: st.Baca undefined, karena field yang diberi nama sendiri tidak ter-promote.",
            "Field yang ditulis hanya dengan nama tipenya akan ter-promote ke struct luar.",
            "Ubah baris field menjadi hanya Sensor, tanpa nama field di depannya.",
          ],
        },
      ],
    },
    {
      slug: "komposisi-tanpa-inheritance",
      title: "Komposisi, Bukan Warisan",
      summary: "Kenapa Go tidak punya inheritance, dan apa penggantinya sehari-hari.",
      steps: [
        {
          kind: "theory",
          title: "Susun, jangan turunkan",
          body: "Go sengaja tidak menyediakan inheritance. Warisan membuat hierarki yang makin lama makin rapuh: mengubah tipe induk mengguncang semua turunan, dan perilaku sebenarnya tersembunyi di rantai class yang dalam. Go memilih komposisi: bangun tipe kecil yang fokus, lalu susun menjadi yang lebih besar.\n\nAlatnya sudah kamu kenal: embedding untuk memakai ulang implementasi, dan interface (modul berikutnya) untuk memakai ulang kontrak. Kalau perilaku struct luar harus berbeda dari struct dalam, tulis method sendiri di struct luar dan delegasikan secara eksplisit ke yang dalam. Delegasi eksplisit sedikit lebih panjang daripada embedding, tetapi niatnya terbaca dan mudah diganti.\n\nAturan praktisnya: pakai embedding kalau struct luar ingin menampakkan perilaku struct dalam apa adanya dan tidak ada nama yang bertabrakan. Pakai field bernama plus delegasi eksplisit kalau hubungannya milik dan kamu ingin mengontrol permukaan API-nya. Dua-duanya komposisi: tiap tipe tetap independen dan bisa diuji terpisah.",
        },
        {
          kind: "quiz",
          question: "Go tidak punya inheritance. Cara utama memakai ulang perilaku di Go adalah...",
          options: [
            "Menyalin kode tipe lain ke tipe baru",
            "Embedding struct dan menyusun tipe kecil",
            "Fungsi global di package util",
            "Variabel global bersama",
          ],
          answer: 1,
          explanation:
            "Reuse di Go dibangun dari komposisi: embedding untuk implementasi, interface untuk kontrak. Tidak ada hierarki turunan.",
        },
        {
          kind: "quiz",
          question:
            "Struct Luar meng-embed struct Dalam, dan keduanya punya field `Nama`. Apa yang terjadi pada `l.Nama` untuk variabel `l` bertipe Luar?",
          options: [
            "Error: nama field bertabrakan",
            "Menunjuk Nama milik Luar; Nama milik Dalam lewat l.Dalam.Nama",
            "Menunjuk Nama milik Dalam karena ter-promote",
            "Keduanya diubah bersamaan",
          ],
          answer: 1,
          explanation:
            "Field milik struct luar menutupi field ter-promote yang bernama sama. Milik dalam tetap terjangkau secara eksplisit lewat nama tipenya.",
        },
      ],
    },
    {
      slug: "struct-tag",
      title: "Struct Tag: Catatan untuk Mesin",
      summary: "Tempelkan metadata pada field dengan tag, dan baca aturan encoding/json.",
      steps: [
        {
          kind: "theory",
          title: "String kecil di belakang field",
          body: "Struct tag adalah catatan yang menempel pada field: string di dalam backtick setelah deklarasi field, seperti `Harga int `json:\"harga\"``. Compiler mengabaikan isinya; tag dibaca lewat reflection oleh library tertentu. Yang paling sering dipakai adalah encoding/json, yang akan kamu gunakan di modul stdlib.\n\nTag json menentukan nama kunci saat struct diubah ke JSON dan sebaliknya. Tanpa tag, kunci memakai nama field persis, sehingga field ekspor (huruf kapital) tampil sebagai `\"Nama\"`. Dengan tag `json:\"nama\"`, kuncinya `\"nama\"`. Field yang tidak diekspor (huruf kecil) tidak dibaca encoder sama sekali, jadi datanya tidak muncul di JSON.\n\nOpsi tambahan ditulis setelah kunci, dipisah koma: `json:\"total,omitempty\"` melewatkan field yang nilainya zero, dan `json:\"-\"` menyembunyikan field dari JSON. Tag lain seperti `db` atau `validate` mengikuti pola yang sama; isi tag adalah konvensi string milik tiap library, bukan bagian bahasa.",
        },
        {
          kind: "quiz",
          question: "Tanpa tag json, struct `type Produk struct { Nama string }` yang di-marshal menghasilkan kunci apa?",
          options: ['{"nama":"Buku"}', '{"Nama":"Buku"}', '{"Produk":"Buku"}', '{"0":"Buku"}'],
          answer: 0,
          explanation: "Tanpa tag, kunci JSON memakai nama field persis, termasuk huruf kapitalnya.",
        },
        {
          kind: "quiz",
          question: "Apa arti tag `json:\"harga_akhir,omitempty\"`?",
          options: [
            "Field dihapus dari struct saat kompilasi",
            "Saat di-marshal, field dilewati kalau nilainya zero; kuncinya harga_akhir",
            "Field hanya boleh dibaca, tidak ditulis",
            "harga_akhir dihitung otomatis dari field lain",
          ],
          answer: 1,
          explanation:
            "omitempty melewatkan field ber-zero value (0, \"\", nil, false) dari keluaran JSON. Nama kunci diambil dari bagian sebelum koma.",
        },
      ],
    },
    {
      slug: "membandingkan-menyalin-struct",
      title: "Menyalin dan Membandingkan Struct",
      summary: "Assignment menyalin struct utuh; == hanya sah untuk struct comparable.",
      steps: [
        {
          kind: "theory",
          title: "Salinan utuh dan perbandingan bersyarat",
          body: "Struct berperilaku sebagai nilai utuh. Assignment, parameter fungsi, dan nilai balik menyalin seluruh field. `b := a` menduplikasi struct; mengubah `b.Harga` tidak menyentuh `a`. Ini berbeda dari slice dan map yang berbagi data di belakang.\n\nKehati-hatian muncul ketika struct memuat tipe referensi. `type Profil struct { Nama string; Tag []string }`: menyalin Profil hanya menyalin header slice, jadi salinan dan asli masih menunjuk backing array yang sama. Menambah elemen lewat salinan bisa memutasi yang asli. Perlakukan field referensi sebagai jendela yang ikut tersalin.\n\nOperator `==` dan `!=` bekerja pada struct jika semua fieldnya comparable: angka, string, bool, array, dan struct comparable. Satu saja field berupa slice, map, atau function membuat `p1 == p2` ditolak compiler. Untuk kasus itu ada `reflect.DeepEqual` yang membandingkan isi sampai ke dalam, tetapi semantiknya berbeda dari `==` dan lebih lambat; sering lebih jujur membandingkan field per field. Kalau struct punya field pointer, `==` membandingkan alamatnya, bukan isi yang ditunjuk.",
        },
        {
          kind: "quiz",
          question: "Dengan `type P struct { Tags []string }`, mengapa `p1 == p2` ditolak compiler?",
          options: [
            "Karena P terlalu besar untuk dibandingkan",
            "Karena field bertipe slice tidak comparable",
            "Karena string tidak comparable",
            "Karena p1 dan p2 belum diinisialisasi",
          ],
          answer: 1,
          explanation:
            "Perbandingan struct dengan == hanya sah jika semua field comparable. Slice, map, dan function tidak termasuk; satu field saja cukup membuat == ditolak.",
        },
        {
          kind: "quiz",
          question:
            "Apa keluaran program berikut?\n\n```go\na := Produk{Nama: \"Buku\", Harga: 35000}\nb := a\nb.Harga = 99000\nfmt.Println(a.Harga)\n```",
          options: ["99000", "35000", "0", "Tidak bisa dikompilasi"],
          answer: 1,
          explanation:
            "Assignment menyalin struct field demi field. b adalah salinan mandiri untuk field scalar, jadi a tidak ikut berubah.",
        },
      ],
    },
    {
      slug: "stringer-method-string",
      title: "fmt.Stringer: Struct yang Bisa Dicetak",
      summary: "Beri method String() string dan fmt otomatis mencetak struct kamu dengan rapi.",
      steps: [
        {
          kind: "theory",
          title: "Satu method, cetak jadi rapi",
          body: "Cetak struct tanpa persiapan dan keluarannya `{95}`: benar tetapi kaku. Interface `fmt.Stringer` menuntut satu method, `String() string`. Tipe yang memilikinya langsung dicetak lewat method itu oleh `fmt.Println` dan verb `%v`.\n\nIni implementasi implisit pertama kamu, tanpa kata implements, dan jembatan ke modul berikutnya: interface satu method yang membentuk mayoritas API Go. Satu perhatian penting: `String()` dipanggil otomatis saat dicetak, jadi jangan memanggil `fmt.Println` pada receiver di dalamnya; format saja dengan `fmt.Sprintf` dan kembalikan stringnya, kalau tidak rekursi tanpa ujung.\n\nStringer bekerja bertingkat: slice dari tipe kamu ikut tercetak rapi, karena fmt memanggil String() pada tiap elemen. Untuk struct yang membawa satuan, seperti durasi, uang, atau koordinat, method String adalah tempat alami menaruh format tampilannya.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Durasi struct {\n\tMenit int\n}\n\nfunc (d Durasi) String() string {\n\treturn fmt.Sprintf(\"%d j %d m\", d.Menit/60, d.Menit%60)\n}\n\nfunc main() {\n\tfmt.Println(Durasi{95})\n\tfmt.Println([]Durasi{{45}, {130}})\n}",
            caption: "Println memanggil String() otomatis, juga untuk tiap elemen slice.",
          },
        },
        {
          kind: "quiz",
          question: "Method apa yang membuat sebuah tipe dicetak rapi oleh fmt.Println?",
          options: ["Print() string", "ToString() string", "String() string", "Format(w io.Writer)"],
          answer: 2,
          explanation: "Interface fmt.Stringer menuntut method String() string. fmt memanggilnya otomatis untuk %v dan Println.",
        },
        {
          kind: "code",
          title: "Cetak durasi dengan Stringer",
          prompt:
            "Lengkapi dua kekosongan: nama method yang dituntut fmt.Stringer, dan pemanggilan fmt di main yang mencetak durasi tanpa format khusus. Input: jumlah menit.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Durasi struct {\n\tMenit int\n}\n\nfunc (d Durasi) ___() string {\n\treturn fmt.Sprintf(\"%d j %d m\", d.Menit/60, d.Menit%60)\n}\n\nfunc main() {\n\tvar m int\n\tfmt.Scan(&m)\n\td := Durasi{Menit: m}\n\tfmt.___(d)\n\tfmt.Printf(\"total %d menit\\n\", d.Menit)\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Durasi struct {\n\tMenit int\n}\n\nfunc (d Durasi) String() string {\n\treturn fmt.Sprintf(\"%d j %d m\", d.Menit/60, d.Menit%60)\n}\n\nfunc main() {\n\tvar m int\n\tfmt.Scan(&m)\n\td := Durasi{Menit: m}\n\tfmt.Println(d)\n\tfmt.Printf(\"total %d menit\\n\", d.Menit)\n}",
          tests: [
            { stdin: "95", expectedOutput: "1 j 35 m\ntotal 95 menit" },
            { stdin: "45", expectedOutput: "0 j 45 m\ntotal 45 menit" },
            { stdin: "720", expectedOutput: "12 j 0 m\ntotal 720 menit", hidden: true },
          ],
          hints: [
            "Interface fmt.Stringer menuntut method bernama String.",
            "Untuk mencetak tanpa format, pakai fmt.Println.",
            "Jawabannya: String dan Println.",
          ],
        },
      ],
    },
    {
      slug: "latihan-inventaris",
      title: "Latihan Gabungan: Inventaris Gudang",
      summary: "Rakit struct, method pointer, dan slice of struct menjadi inventaris kecil yang utuh.",
      steps: [
        {
          kind: "theory",
          title: "Pola yang dirangkai",
          body: "Latihan penutup modul ini merangkai semuanya: tipe struct, method pointer yang menambah isi slice, method value yang menghitung, dan slice of struct. Skenarionya inventaris gudang: `Barang` punya Nama, Harga, dan Stok; `Inventaris` menampung banyak Barang, bisa menambah barang, dan menghitung total nilai berupa jumlah harga kali stok.\n\nPerhatikan kenapa Tambah memakai pointer receiver: `append` bisa mengganti header slice (len dan cap ikut tumbuh), dan hasilnya harus dikembalikan ke struct. Method yang hanya membaca, seperti penghitung total, cukup value receiver. Pola ini berulang terus di kode Go nyata.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Log struct {\n\tBaris []string\n}\n\nfunc (l *Log) Tulis(pesan string) {\n\tl.Baris = append(l.Baris, pesan)\n}\n\nfunc (l Log) Total() int {\n\treturn len(l.Baris)\n}\n\nfunc main() {\n\tvar l Log\n\tl.Tulis(\"mulai\")\n\tl.Tulis(\"selesai\")\n\tfmt.Println(l.Total(), l.Baris)\n}",
            caption: "append bisa mengganti header slice, jadi method yang memanggilnya wajib pointer receiver.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan inventaris",
          prompt:
            "Lengkapi receiver Tambah yang menambah isi slice, dan nama method penghitung total nilai yang dipanggil main. Total nilai = jumlah (harga kali stok) semua barang. Input: banyak barang, lalu tiap barang (nama, harga, stok).",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Barang struct {\n\tNama  string\n\tHarga int\n\tStok  int\n}\n\ntype Inventaris struct {\n\tDaftar []Barang\n}\n\nfunc (inv ___) Tambah(b Barang) {\n\tinv.Daftar = append(inv.Daftar, b)\n}\n\nfunc (inv Inventaris) ___() int {\n\ttotal := 0\n\tfor _, b := range inv.Daftar {\n\t\ttotal += b.Harga * b.Stok\n\t}\n\treturn total\n}\n\nfunc main() {\n\tvar inv Inventaris\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar b Barang\n\t\tfmt.Scan(&b.Nama, &b.Harga, &b.Stok)\n\t\tinv.Tambah(b)\n\t}\n\tfmt.Println(inv.TotalNilai())\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Barang struct {\n\tNama  string\n\tHarga int\n\tStok  int\n}\n\ntype Inventaris struct {\n\tDaftar []Barang\n}\n\nfunc (inv *Inventaris) Tambah(b Barang) {\n\tinv.Daftar = append(inv.Daftar, b)\n}\n\nfunc (inv Inventaris) TotalNilai() int {\n\ttotal := 0\n\tfor _, b := range inv.Daftar {\n\t\ttotal += b.Harga * b.Stok\n\t}\n\treturn total\n}\n\nfunc main() {\n\tvar inv Inventaris\n\tvar n int\n\tfmt.Scan(&n)\n\tfor i := 0; i < n; i++ {\n\t\tvar b Barang\n\t\tfmt.Scan(&b.Nama, &b.Harga, &b.Stok)\n\t\tinv.Tambah(b)\n\t}\n\tfmt.Println(inv.TotalNilai())\n}",
          tests: [
            { stdin: "2\nBuku 35000 2\nTas 120000 1", expectedOutput: "190000" },
            { stdin: "3\nPensil 3000 10\nPenghapus 2000 5\nPenggaris 8000 3", expectedOutput: "64000" },
            { stdin: "1\nKertas 500 100", expectedOutput: "50000", hidden: true },
          ],
          hints: [
            "Method Tambah mengganti isi slice lewat append, jadi receivernya harus pointer.",
            "main memanggil inv.TotalNilai(); nama method kedua mengikuti panggilan itu.",
            "Jawabannya: *Inventaris dan TotalNilai.",
          ],
        },
      ],
    },
    // ==================== MODUL 3: Interface dan Error ====================
    {
      slug: "interface-dasar-implisit",
      title: "Interface dan Implementasi Implisit",
      summary: "Daftar method sebagai kontrak; tipe memenuhinya tanpa deklarasi implements.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak tanpa kata implements",
          body: "Interface mendefinisikan perilaku: daftar method tanpa isi. `type Bentuk interface { Luas() float64 }`. Tipe apa pun yang punya semua method itu otomatis memenuhi interface, tanpa deklarasi implements. Ini kunci fleksibilitas Go: tipe lama yang ditulis sebelum interface-nya ada tetap bisa memenuhinya.\n\nKarena keputusan diterima compiler, salah langkah tetap ketahuan dini: tipe yang kurang satu method tidak bisa masuk ke slice atau parameter bertipe interface itu. Errornya muncul saat kompilasi, bukan saat program jalan. Variabel interface tanpa isi bernilai nil, dan memanggil method padanya memicu panic, jadi periksa dulu kalau variabelnya bisa nil.\n\nPola pemakaiannya seperti contoh: fungsi menerima slice bertipe interface, lalu memanggil method yang dijanjikan tanpa tahu tipe konkret tiap elemen. Menambah Bentuk baru, misalnya Segitiga, tidak menyentuh `totalLuas` sama sekali.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\ntype Bentuk interface {\n\tLuas() float64\n}\n\ntype Persegi struct {\n\tSisi float64\n}\n\nfunc (p Persegi) Luas() float64 { return p.Sisi * p.Sisi }\n\ntype Lingkaran struct {\n\tJari float64\n}\n\nfunc (l Lingkaran) Luas() float64 { return 3.14 * l.Jari * l.Jari }\n\nfunc totalLuas(bentuk []Bentuk) float64 {\n\ttotal := 0.0\n\tfor _, b := range bentuk {\n\t\ttotal += b.Luas()\n\t}\n\treturn total\n}\n\nfunc main() {\n\tbentuk := []Bentuk{Persegi{3}, Lingkaran{2}}\n\tfmt.Printf(\"%.2f\\n\", totalLuas(bentuk))\n}",
            caption: "Persegi dan Lingkaran tidak pernah menyebut Bentuk; cukup punya method Luas.",
          },
        },
        {
          kind: "quiz",
          question: "Kapan sebuah tipe dikatakan mengimplementasikan interface di Go?",
          options: [
            "Saat menulis implements NamaInterface",
            "Saat tipe punya semua method yang dituntut interface",
            "Saat tipe di-embed ke dalam interface",
            "Saat interface menyebut nama tipenya",
          ],
          answer: 1,
          explanation:
            "Implementasi di Go implisit: cukup punya semua methodnya. Compiler yang memeriksa saat tipe dipakai sebagai interface.",
        },
        {
          kind: "code",
          title: "Pilih barang terberat",
          prompt:
            "Lengkapi method yang dituntut interface Penghitung, dan tipe elemen slice di parameter terberat. Input: sisi kotak lalu jari-jari silinder; tinggi silinder 2.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\ntype Penghitung interface {\n\t___() float64\n}\n\ntype Kotak struct {\n\tSisi float64\n}\n\nfunc (k Kotak) Berat() float64 {\n\treturn k.Sisi * k.Sisi * 2\n}\n\ntype Silinder struct {\n\tJari, Tinggi float64\n}\n\nfunc (s Silinder) Berat() float64 {\n\treturn 3.14 * s.Jari * s.Jari * s.Tinggi\n}\n\nfunc terberat(barang []___) float64 {\n\tmax := 0.0\n\tfor _, b := range barang {\n\t\tberat := b.Berat()\n\t\tif berat > max {\n\t\t\tmax = berat\n\t\t}\n\t}\n\treturn max\n}\n\nfunc main() {\n\tvar a, b float64\n\tfmt.Scan(&a, &b)\n\tbarang := []Penghitung{Kotak{a}, Silinder{b, 2}}\n\tfmt.Printf(\"%.2f\\n\", terberat(barang))\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\ntype Penghitung interface {\n\tBerat() float64\n}\n\ntype Kotak struct {\n\tSisi float64\n}\n\nfunc (k Kotak) Berat() float64 {\n\treturn k.Sisi * k.Sisi * 2\n}\n\ntype Silinder struct {\n\tJari, Tinggi float64\n}\n\nfunc (s Silinder) Berat() float64 {\n\treturn 3.14 * s.Jari * s.Jari * s.Tinggi\n}\n\nfunc terberat(barang []Penghitung) float64 {\n\tmax := 0.0\n\tfor _, b := range barang {\n\t\tberat := b.Berat()\n\t\tif berat > max {\n\t\t\tmax = berat\n\t\t}\n\t}\n\treturn max\n}\n\nfunc main() {\n\tvar a, b float64\n\tfmt.Scan(&a, &b)\n\tbarang := []Penghitung{Kotak{a}, Silinder{b, 2}}\n\tfmt.Printf(\"%.2f\\n\", terberat(barang))\n}",
          tests: [
            { stdin: "3 1", expectedOutput: "18.00" },
            { stdin: "2 2", expectedOutput: "25.12" },
            { stdin: "1 0.5", expectedOutput: "2.00", hidden: true },
          ],
          hints: [
            "Method yang dituntut interface bernama sama dengan yang dimiliki Kotak dan Silinder.",
            "Slice di parameter terberat bertipe interface, bukan struct konkret.",
            "Jawabannya: Berat dan Penghitung.",
          ],
        },
      ],
    },
    {
      slug: "interface-kecil-multi",
      title: "Interface Kecil, Banyak Wajah",
      summary: "Satu method cukup: interface kecil membuat API Go lentur dan mudah dipenuhi.",
      steps: [
        {
          kind: "theory",
          title: "Satu method, banyak tipe",
          body: "Stdlib Go ditopang interface yang kecil-kecil: `io.Writer` satu method, `fmt.Stringer` satu method, `error` juga satu method. Interface kecil mudah dipenuhi, sehingga banyak tipe cocok dan komposisi jadi murah. Prinsipnya: fungsi menerima interface sekecil mungkin yang masih memadai, dan mengembalikan tipe konkret.\n\nSatu tipe konkret bisa memenuhi banyak interface sekaligus. `*os.File` adalah io.Reader sekaligus io.Writer dan io.Closer, karena punya semua methodnya. Tidak ada hubungan formal antara interface-interface itu; yang menentukan hanyalah kumpulan method.\n\nInterface juga bisa menyusun interface: `type ReadWriter interface { Reader; Writer }`. Hasilnya kontrak gabungan. Pola ini terlihat di package io (ReadWriter, ReadWriteCloser) dan membuat fungsi bisa menuntut persis kemampuan yang dipakainya, tidak lebih.",
        },
        {
          kind: "quiz",
          question: "Mengapa fungsi sebaiknya menerima parameter interface kecil, bukan struct besar?",
          options: [
            "Supaya kompilasi lebih cepat",
            "Supaya bisa dipakai semua tipe yang punya method yang dibutuhkan",
            "Karena struct besar boros memori",
            "Supaya tidak perlu mengembalikan nilai",
          ],
          answer: 1,
          explanation:
            "Parameter interface kecil menerima semua tipe yang punya method itu, termasuk tipe yang belum ada saat fungsi ditulis. Inilah kelonggaran tanpa mengorbankan pemeriksaan tipe.",
        },
        {
          kind: "quiz",
          question: "Apa arti deklarasi `type ReadWriter interface { Reader; Writer }`?",
          options: [
            "ReadWriter mewarisi data dari Reader dan Writer",
            "ReadWriter menuntut semua method Reader dan semua method Writer",
            "ReadWriter adalah alias dari Writer",
            "ReadWriter hanya punya method milik Reader",
          ],
          answer: 1,
          explanation:
            "Interface bisa menyusun interface. ReadWriter terpenuhi hanya jika tipe punya seluruh method kedua interface, seperti *os.File.",
        },
      ],
    },
    {
      slug: "type-assertion-switch",
      title: "Type Assertion dan Type Switch",
      summary: "Bongkar tipe asli dari interface dengan comma-ok dan type switch.",
      steps: [
        {
          kind: "theory",
          title: "Mengintip isi interface",
          body: "Nilai bertipe interface membawa tipe aslinya di dalam. Type assertion `x.(T)` mengeluarkannya: kalau tipe asli memang T, hasilnya nilai bertipe T; kalau bukan, program panic. Bentuk amannya comma-ok: `v, ok := x.(T)` mengembalikan false tanpa panic.\n\nUntuk lebih dari satu kemungkinan, type switch lebih rapi: `switch x := v.(type)` dengan satu `case` per tipe. Di dalam tiap kasus, `x` bertipe tipe kasus itu, jadi bisa langsung dipakai. `default` menampung sisanya.\n\nPakai seperlunya. Type switch mengikat kode pada daftar tipe konkret: setiap tipe baru berarti kasus baru. Kalau perilakunya cukup diekspresikan lewat method interface, panggil methodnya saja dan biarkan tipe bekerja. Assertion berguna di batas program, misalnya membongkar error menjadi tipe tertentu lewat errors.As, atau mengambil nilai dari `any`.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc deskripsi(v any) string {\n\tswitch x := v.(type) {\n\tcase string:\n\t\treturn \"teks: \" + x\n\tcase int:\n\t\treturn fmt.Sprintf(\"bilangan %d\", x)\n\tcase bool:\n\t\tif x {\n\t\t\treturn \"ya\"\n\t\t}\n\t\treturn \"tidak\"\n\tdefault:\n\t\treturn \"entah\"\n\t}\n}\n\nfunc main() {\n\tfmt.Println(deskripsi(\"go\"))\n\tfmt.Println(deskripsi(7))\n\tfmt.Println(deskripsi(true))\n\tfmt.Println(deskripsi(2.5))\n}",
            caption: "Di dalam tiap case, x bertipe tipe kasusnya; default menampung sisanya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `x.(T)` bila tipe asli x bukan T dan tidak dipakai bentuk comma-ok?",
          options: ["Mengembalikan zero value T", "Error saat kompilasi", "Panic saat runtime", "Mengembalikan nil"],
          answer: 2,
          explanation:
            "Assertion tanpa comma-ok yang meleset memicu panic. Bentuk amannya v, ok := x.(T) mengembalikan ok false tanpa panic.",
        },
        {
          kind: "code",
          title: "Lengkapi type switch",
          prompt:
            "Lengkapi dua tipe pada type switch: kasus bilangan bulat dan kasus nilai kebenaran. Program lalu mengklasifikasikan satu angka dan satu kata dari input, ditambah nilai true tetap.",
          mode: "fill",
          template:
            "package main\n\nimport \"fmt\"\n\nfunc sebut(v any) string {\n\tswitch x := v.(type) {\n\tcase ___:\n\t\treturn fmt.Sprintf(\"bilangan %d\", x)\n\tcase string:\n\t\treturn \"kata \" + x\n\tcase ___:\n\t\tif x {\n\t\t\treturn \"logika benar\"\n\t\t}\n\t\treturn \"logika salah\"\n\tdefault:\n\t\treturn \"lain\"\n\t}\n}\n\nfunc main() {\n\tvar angka int\n\tvar kata string\n\tfmt.Scan(&angka, &kata)\n\tbenda := []any{angka, kata, true}\n\tfor _, b := range benda {\n\t\tfmt.Println(sebut(b))\n\t}\n}",
          solution:
            "package main\n\nimport \"fmt\"\n\nfunc sebut(v any) string {\n\tswitch x := v.(type) {\n\tcase int:\n\t\treturn fmt.Sprintf(\"bilangan %d\", x)\n\tcase string:\n\t\treturn \"kata \" + x\n\tcase bool:\n\t\tif x {\n\t\t\treturn \"logika benar\"\n\t\t}\n\t\treturn \"logika salah\"\n\tdefault:\n\t\treturn \"lain\"\n\t}\n}\n\nfunc main() {\n\tvar angka int\n\tvar kata string\n\tfmt.Scan(&angka, &kata)\n\tbenda := []any{angka, kata, true}\n\tfor _, b := range benda {\n\t\tfmt.Println(sebut(b))\n\t}\n}",
          tests: [
            { stdin: "42 kuda", expectedOutput: "bilangan 42\nkata kuda\nlogika benar" },
            { stdin: "7 mobil", expectedOutput: "bilangan 7\nkata mobil\nlogika benar" },
            { stdin: "-5 kereta", expectedOutput: "bilangan -5\nkata kereta\nlogika benar", hidden: true },
          ],
          hints: [
            "Kasus pertama menangkap nilai bilangan bulat; tulis tipe itu.",
            "Nilai true dan false bertipe bool.",
            "Jawabannya: int dan bool.",
          ],
        },
      ],
    },
    {
      slug: "error-sebagai-nilai",
      title: "Error Adalah Nilai",
      summary: "Kegagalan dikembalikan sebagai nilai error dan diperiksa di tempatnya.",
      steps: [
        {
          kind: "theory",
          title: "Kegagalan yang terlihat",
          body: "Di Go, kegagalan adalah nilai. `error` adalah interface dengan satu method `Error() string`, dan konvensinya fungsi yang bisa gagal mengembalikannya sebagai nilai balik terakhir: `f, err := os.Open(path)`. `err == nil` berarti sukses; selain itu err menjelaskan apa yang salah.\n\nKarena error adalah nilai biasa, alurnya terlihat: setiap pemanggilan yang bisa gagal ditangani di tempatnya, biasanya `if err != nil`. Pola ini terlihat berisik, tetapi membuat jalur kegagalan eksplisit; tidak ada exception yang menyelinap lewat. Mengabaikan error secara sadar ditulis `_`, dan itu keputusan yang terbaca di kode.\n\nUntuk kegagalan yang tetap dan dikenali, buat sentinel di level package: `var ErrStokHabis = errors.New(\"stok habis\")`. Fungsi mengembalikannya apa adanya, dan pemanggil membandingkan dengan `==`. Ini berlaku selama error tidak dibungkus; begitu perlu konteks, beralihlah ke wrapping pada lesson berikutnya.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrStokHabis = errors.New(\"stok habis\")\n\nfunc ambil(stok, jumlah int) (sisa int, err error) {\n\tif jumlah > stok {\n\t\treturn 0, ErrStokHabis\n\t}\n\treturn stok - jumlah, nil\n}\n\nfunc main() {\n\tsisa, err := ambil(5, 3)\n\tif err != nil {\n\t\tfmt.Println(\"gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"sisa\", sisa)\n}",
            caption: "Error dikembalikan sebagai nilai balik terakhir dan diperiksa segera.",
          },
        },
        {
          kind: "quiz",
          question: "Menurut konvensi Go, kapan sebuah fungsi dianggap berhasil?",
          options: [
            "Saat mengembalikan true",
            "Saat error yang dikembalikan bernilai nil",
            "Saat tidak panic",
            "Saat mencetak pesan sukses",
          ],
          answer: 1,
          explanation:
            "Konvensinya nilai balik terakhir bertipe error; nil berarti tidak ada kegagalan. Pola if err != nil adalah alur bawaan Go.",
        },
        {
          kind: "code",
          title: "Ambil stok dengan error",
          prompt:
            "Lengkapi sentinel error yang dikembalikan saat stok kurang, dan perbandingan di main untuk mendeteksi kegagalan. Input: stok lalu jumlah yang diambil.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrStokKurang = errors.New(\"stok kurang\")\n\nfunc ambil(stok, jumlah int) (int, error) {\n\tif jumlah > stok {\n\t\treturn 0, ___\n\t}\n\treturn stok - jumlah, nil\n}\n\nfunc main() {\n\tvar stok, jumlah int\n\tfmt.Scan(&stok, &jumlah)\n\tsisa, err := ambil(stok, jumlah)\n\tif err ___ nil {\n\t\tfmt.Println(\"gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"sisa\", sisa)\n}",
          solution:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrStokKurang = errors.New(\"stok kurang\")\n\nfunc ambil(stok, jumlah int) (int, error) {\n\tif jumlah > stok {\n\t\treturn 0, ErrStokKurang\n\t}\n\treturn stok - jumlah, nil\n}\n\nfunc main() {\n\tvar stok, jumlah int\n\tfmt.Scan(&stok, &jumlah)\n\tsisa, err := ambil(stok, jumlah)\n\tif err != nil {\n\t\tfmt.Println(\"gagal:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"sisa\", sisa)\n}",
          tests: [
            { stdin: "5 3", expectedOutput: "sisa 2" },
            { stdin: "2 9", expectedOutput: "gagal: stok kurang" },
            { stdin: "10 10", expectedOutput: "sisa 0", hidden: true },
          ],
          hints: [
            "Sentinel error yang dideklarasikan di atas bernama ErrStokKurang.",
            "Kegagalan diperiksa dengan err tidak sama dengan nil.",
            "Jawabannya: ErrStokKurang dan !=.",
          ],
        },
      ],
    },
    {
      slug: "errorf-wrapping",
      title: "Wrapping Error dengan %w",
      summary: "Tambahkan konteks pada error tanpa memutus jejak ke penyebab aslinya.",
      steps: [
        {
          kind: "theory",
          title: "Konteks yang tetap terlacak",
          body: "Mengembalikan error apa adanya sering kurang: pemanggil tidak tahu kegagalan itu terjadi saat operasi apa. fmt.Errorf menambah konteks: `fmt.Errorf(\"baca konfigurasi: %w\", err)`. Pesan jadi berlapis mirip jejak: baca konfigurasi: buka berkas: permission denied.\n\nKuncinya verb `%w`. Dengan `%w`, error asli tetap tersimpan di dalam error baru dan bisa ditelusuri `errors.Is` dan `errors.As`. Memakai `%v` menghasilkan pesan serupa tetapi rantai putus: error asli hilang dan tak bisa dikenali lagi. Aturan mainnya: bungkus dengan %w kalau pemanggil perlu mengenali penyebabnya.\n\nJangan menumpuk konteks berlebihan. Setiap lapisan sebaiknya menambah informasi baru, seperti nama operasi, berkas, atau id, bukan mengulang pesan lapisan sebelumnya. Wrapping boleh berlapis-lapis; errors.Is tetap menelusuri sampai dasar.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrKosong = errors.New(\"antrian kosong\")\n\nfunc layani(n int) error {\n\tif n == 0 {\n\t\treturn fmt.Errorf(\"layani nomor %d: %w\", n, ErrKosong)\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tif err := layani(0); err != nil {\n\t\tfmt.Println(err)\n\t}\n}",
            caption: "Pesan gabungan membawa konteks dan sentinel sekaligus.",
          },
        },
        {
          kind: "quiz",
          question: "Apa beda `%v` dan `%w` di dalam fmt.Errorf?",
          options: [
            "%v membuat error baru, %w tidak",
            "%w menyimpan error asli sehingga masih bisa dikenali errors.Is dan errors.As",
            "Tidak ada beda, hanya gaya",
            "%w mencetak pesan ke stderr",
          ],
          answer: 1,
          explanation:
            "%w membungkus error asli di dalam error baru. Rantai itulah yang ditelusuri errors.Is dan errors.As; %v hanya menggabungkan teksnya.",
        },
        {
          kind: "code",
          title: "Bungkus error pesanan",
          prompt:
            "Lengkapi pembuatan sentinel dengan errors.New, dan verb pembungkus yang menyimpan ErrStokKurang di dalam error baru. Input: stok lalu jumlah pesanan.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrStokKurang = errors.___(\"stok tidak cukup\")\n\nfunc pesan(stok, jumlah int) error {\n\tif jumlah > stok {\n\t\treturn fmt.Errorf(\"pesan %d unit, stok %d: %___\", jumlah, stok, ErrStokKurang)\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar stok, jumlah int\n\tfmt.Scan(&stok, &jumlah)\n\tif err := pesan(stok, jumlah); err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(\"pesanan ok\")\n}",
          solution:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrStokKurang = errors.New(\"stok tidak cukup\")\n\nfunc pesan(stok, jumlah int) error {\n\tif jumlah > stok {\n\t\treturn fmt.Errorf(\"pesan %d unit, stok %d: %w\", jumlah, stok, ErrStokKurang)\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar stok, jumlah int\n\tfmt.Scan(&stok, &jumlah)\n\tif err := pesan(stok, jumlah); err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(\"pesanan ok\")\n}",
          tests: [
            { stdin: "5 8", expectedOutput: "pesan 8 unit, stok 5: stok tidak cukup" },
            { stdin: "9 4", expectedOutput: "pesanan ok" },
            { stdin: "3 10", expectedOutput: "pesan 10 unit, stok 3: stok tidak cukup", hidden: true },
          ],
          hints: [
            "Fungsi pembuat error dari package errors bernama New.",
            "Verb pembungkus menyimpan error asli di dalam error baru; satu huruf saja.",
            "Jawabannya: New dan w.",
          ],
        },
      ],
    },
    {
      slug: "errors-is-as",
      title: "errors.Is dan errors.As",
      summary: "Telusuri rantai error bungkus: Is untuk sentinel, As untuk tipe berisi data.",
      steps: [
        {
          kind: "theory",
          title: "Mencari penyebab di dasar rantai",
          body: "Setelah error dibungkus %w, perbandingan `err == ErrStokKurang` tidak lagi benar: err kini error baru yang membungkus sentinel. Untuk itu ada `errors.Is(err, target)`: ia menelusuri rantai error lewat method Unwrap dan mencocokkan setiap lapisan, termasuk lapisan paling dasar.\n\n`errors.As` bekerja serupa tetapi mencocokkan tipe, bukan nilai: `var gb *GagalBaca; errors.As(err, &gb)` mengisi gb kalau di rantai ada error bertipe itu. Setelah itu field error bisa dibaca untuk mengambil keputusan. Dua fungsi ini menggantikan perbandingan dan assertion manual pada error.\n\nKebiasaan yang benar sejak sekarang: selalu `errors.Is` alih-alih `==`, dan `errors.As` alih-alih `err.(*T)`. Keduanya aman untuk error yang tidak dibungkus sekalipun, jadi tidak ada kerugiannya. Stdlib memakai pola ini di mana-mana; `errors.Is(err, os.ErrNotExist)` contoh yang akan sering kamu temui.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrDitutup = errors.New(\"laporan ditutup\")\n\nfunc kirim(tertutup bool) error {\n\tif tertutup {\n\t\treturn fmt.Errorf(\"kirim laporan: %w\", ErrDitutup)\n\t}\n\treturn nil\n}\n\nfunc main() {\n\terr := kirim(true)\n\tfmt.Println(\"cocok Is:\", errors.Is(err, ErrDitutup))\n\tfmt.Println(\"cocok ==:\", err == ErrDitutup)\n}",
            caption: "Setelah dibungkus %w, == gagal mengenali sentinel; errors.Is menelusuri rantainya.",
          },
        },
        {
          kind: "quiz",
          question: "Setelah `err := fmt.Errorf(\"konteks: %w\", ErrX)`, ekspresi mana yang benar mendeteksi ErrX?",
          options: ["err == ErrX", "errors.Is(err, ErrX)", "err.Error() == \"ErrX\"", "errors.New(err) == ErrX"],
          answer: 1,
          explanation:
            "err kini error pembungkus, bukan ErrX lagi, jadi == gagal. errors.Is menelusuri rantai wrap dan cocok dengan ErrX di dasarnya.",
        },
        {
          kind: "code",
          title: "Kenali penyebab gagal unduh",
          prompt:
            "Lengkapi sentinel yang dibungkus saat kode 1, dan fungsi errors yang mengenali ErrJaringan di dalam error bungkus. Input: kode 0, 1, atau 2.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrJaringan = errors.New(\"jaringan putus\")\n\nfunc unduh(kode int) error {\n\tswitch kode {\n\tcase 1:\n\t\treturn fmt.Errorf(\"unduh berkas besar: %w\", ___)\n\tcase 2:\n\t\treturn errors.New(\"berkas tidak ada\")\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar kode int\n\tfmt.Scan(&kode)\n\terr := unduh(kode)\n\tswitch {\n\tcase errors.___(err, ErrJaringan):\n\t\tfmt.Println(\"coba lagi nanti\")\n\tcase err != nil:\n\t\tfmt.Println(\"gagal lain:\", err)\n\tdefault:\n\t\tfmt.Println(\"unduhan selesai\")\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar ErrJaringan = errors.New(\"jaringan putus\")\n\nfunc unduh(kode int) error {\n\tswitch kode {\n\tcase 1:\n\t\treturn fmt.Errorf(\"unduh berkas besar: %w\", ErrJaringan)\n\tcase 2:\n\t\treturn errors.New(\"berkas tidak ada\")\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar kode int\n\tfmt.Scan(&kode)\n\terr := unduh(kode)\n\tswitch {\n\tcase errors.Is(err, ErrJaringan):\n\t\tfmt.Println(\"coba lagi nanti\")\n\tcase err != nil:\n\t\tfmt.Println(\"gagal lain:\", err)\n\tdefault:\n\t\tfmt.Println(\"unduhan selesai\")\n\t}\n}",
          tests: [
            { stdin: "0", expectedOutput: "unduhan selesai" },
            { stdin: "1", expectedOutput: "coba lagi nanti" },
            { stdin: "2", expectedOutput: "gagal lain: berkas tidak ada", hidden: true },
          ],
          hints: [
            "Nilai yang dibungkus di case 1 adalah sentinel jaringan yang dideklarasikan di atas.",
            "Untuk mengenali sentinel di dalam error bungkus, package errors punya fungsi Is.",
            "Jawabannya: ErrJaringan dan Is.",
          ],
        },
      ],
    },
    {
      slug: "custom-error-type",
      title: "Custom Error Type",
      summary: "Buat tipe error sendiri dengan field konteks dan method Error().",
      steps: [
        {
          kind: "theory",
          title: "Error yang membawa data",
          body: "Sentinel hanya membawa satu kalimat. Bila pemanggil perlu data dari kegagalan, misalnya field mana yang salah validasi, buat tipe error sendiri: struct dengan field konteks plus method `Error() string`. Method itulah yang membuat struct memenuhi interface error, secara implisit.\n\nBentuk return dan target errors.As harus sepakat: kalau fungsi mengembalikan `&ValidasiError{...}`, targetnya `*ValidasiError`; kalau mengembalikan nilai struct, targetnya `ValidasiError`. Pilih satu gaya untuk satu tipe dan konsisten. Wrapping dengan %w tetap berlaku di atas tipe error buatan sendiri.\n\nTanda kapan custom error layak: pemanggil membuat keputusan berdasarkan isi error, seperti mencoba ulang, meminta ulang field, atau mencatat id order. Kalau hanya butuh pesan dengan konteks, fmt.Errorf dan %w sudah cukup; jangan menambah tipe tanpa alasan.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype GagalBaca struct {\n\tBerkas string\n\tBaris  int\n}\n\nfunc (e *GagalBaca) Error() string {\n\treturn fmt.Sprintf(\"berkas %s baris %d\", e.Berkas, e.Baris)\n}\n\nfunc baca(berkas string) error {\n\treturn &GagalBaca{Berkas: berkas, Baris: 17}\n}\n\nfunc main() {\n\terr := baca(\"config.yaml\")\n\tvar gb *GagalBaca\n\tif errors.As(err, &gb) {\n\t\tfmt.Println(\"baris:\", gb.Baris)\n\t}\n}",
            caption: "Custom error membawa data; errors.As membongkarnya kembali.",
          },
        },
        {
          kind: "quiz",
          question: "Agar `errors.As(err, &target)` bisa mengisi `target *ValidasiError`, error harus...",
          options: [
            "Berupa string yang sama persis",
            "Merupakan *ValidasiError atau error yang membungkusnya",
            "Punya field bernama sama dengan struct",
            "Dibuat dengan errors.New",
          ],
          answer: 1,
          explanation:
            "errors.As mencari tipe persis (atau error bungkus yang akhirnya bertipe itu) di rantai error, lalu mengisinya ke target.",
        },
        {
          kind: "code",
          title: "Perbaiki error yang tak terbaca",
          prompt:
            "Program harus mencetak alasan kegagalan lewat errors.As, tapi hasilnya selalu bayar ok. Cari dan perbaiki satu kesalahannya. Input: id order lalu saldo.",
          mode: "fix",
          template:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype GagalBayar struct {\n\tOrderID string\n\tAlasan  string\n}\n\nfunc (e GagalBayar) Error() string {\n\treturn fmt.Sprintf(\"order %s: %s\", e.OrderID, e.Alasan)\n}\n\nfunc bayar(orderID string, saldo int) error {\n\tif saldo < 10000 {\n\t\treturn GagalBayar{OrderID: orderID, Alasan: \"saldo kurang\"}\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar orderID string\n\tvar saldo int\n\tfmt.Scan(&orderID, &saldo)\n\terr := bayar(orderID, saldo)\n\tvar gb *GagalBayar\n\tif errors.As(err, &gb) {\n\t\tfmt.Println(\"alasan:\", gb.Alasan)\n\t\treturn\n\t}\n\tfmt.Println(\"bayar ok\")\n}",
          solution:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype GagalBayar struct {\n\tOrderID string\n\tAlasan  string\n}\n\nfunc (e GagalBayar) Error() string {\n\treturn fmt.Sprintf(\"order %s: %s\", e.OrderID, e.Alasan)\n}\n\nfunc bayar(orderID string, saldo int) error {\n\tif saldo < 10000 {\n\t\treturn &GagalBayar{OrderID: orderID, Alasan: \"saldo kurang\"}\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar orderID string\n\tvar saldo int\n\tfmt.Scan(&orderID, &saldo)\n\terr := bayar(orderID, saldo)\n\tvar gb *GagalBayar\n\tif errors.As(err, &gb) {\n\t\tfmt.Println(\"alasan:\", gb.Alasan)\n\t\treturn\n\t}\n\tfmt.Println(\"bayar ok\")\n}",
          tests: [
            { stdin: "ORD-88 5000", expectedOutput: "alasan: saldo kurang" },
            { stdin: "ORD-91 25000", expectedOutput: "bayar ok" },
            { stdin: "ORD-77 9999", expectedOutput: "alasan: saldo kurang", hidden: true },
          ],
          hints: [
            "Coba order dengan saldo 5000: hasilnya bayar ok, padahal seharusnya gagal.",
            "errors.As mencocokkan tipe *GagalBayar di rantai error; bayar saat ini mengembalikan nilai GagalBayar tanpa tanda pointer.",
            "Tambahkan & di depan GagalBayar{...} pada baris return.",
          ],
        },
      ],
    },
    {
      slug: "panic-recover",
      title: "Panic dan Recover",
      summary: "Panic untuk kondisi tak terpulihkan, recover di defer, dan batas penggunaannya.",
      steps: [
        {
          kind: "theory",
          title: "Ketika program harus berhenti",
          body: "Panic menghentikan fungsi yang sedang jalan, menjalankan semua fungsi yang di-defer dari yang terakhir, lalu keluar dari program dengan jejak stack. Bedanya dengan error: error adalah hasil yang diharapkan dari operasi yang bisa gagal; panic menandai kondisi yang seharusnya tidak pernah terjadi, seperti index di luar batas karena invariant yang rusak.\n\nrecover() menahan panic yang sedang berjalan, tetapi hanya berfungsi di dalam function yang di-defer. Pola bakunya: `defer func() { if r := recover(); r != nil { ... } }()`. Kalau tidak ada panic, recover mengembalikan nil dan tidak berefek apa-apa.\n\nKapan tidak: jangan menjadikan panic alur kontrol untuk kesalahan yang wajar seperti input pengguna salah atau berkas tidak ada; itu tugas error. Jangan pula recover lalu diam; minimal catat kejadiannya dan ubah menjadi error yang jelas. Tempat yang pantas memakai keduanya adalah batas program: server HTTP yang men-recover panic satu request agar request lain tetap hidup, atau library yang mengubah panic internal menjadi error di API publiknya.",
          code: {
            language: "go",
            content: "package main\n\nimport \"fmt\"\n\nfunc amanBagi(a, b int) (hasil int) {\n\tdefer func() {\n\t\tif r := recover(); r != nil {\n\t\t\thasil = -1\n\t\t}\n\t}()\n\treturn a / b\n}\n\nfunc main() {\n\tfmt.Println(amanBagi(10, 2))\n\tfmt.Println(amanBagi(1, 0))\n\tfmt.Println(\"program masih hidup\")\n}",
            caption: "Recover menahan panic pembagian nol; program lanjut sampai akhir.",
          },
        },
        {
          kind: "quiz",
          question: "Di mana pemanggilan recover() berfungsi menahan panic?",
          options: [
            "Di baris mana saja selama masih di fungsi yang sama",
            "Hanya di dalam function yang di-defer",
            "Hanya di func main",
            "Di goroutine lain yang sedang berjalan",
          ],
          answer: 1,
          explanation:
            "recover hanya berpengaruh di dalam function yang dijalankan lewat defer, karena di situlah proses pembongkaran panic lewat.",
        },
        {
          kind: "quiz",
          question: "Manakah penggunaan panic yang pantas menurut idiom Go?",
          options: [
            "Input pengguna tidak valid",
            "Berkas konfigurasi tidak ditemukan",
            "Invariant internal rusak, misalnya index di luar batas karena bug",
            "Sandi pengguna salah saat login",
          ],
          answer: 2,
          explanation:
            "Kegagalan yang wajar dan diharapkan dikembalikan sebagai error. Panic untuk kondisi yang menandakan bug dan tidak masuk akal dilanjutkan.",
        },
      ],
    },
    {
      slug: "io-reader-writer",
      title: "io.Reader dan io.Writer",
      summary: "Dua interface satu-method yang menopang seluruh I/O Go.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak di balik semua I/O",
          body: "Dua interface ini menopang hampir semua I/O di Go. `io.Reader` punya `Read(p []byte) (n int, err error)`: ia mengisi p sebisanya dan melaporkan berapa yang terisi. `io.Writer` punya `Write(p []byte) (n int, err error)`. Tidak ada method baca-semua; pembacaan besar selalu berulang sampai muncul `io.EOF`, tanda aliran habis.\n\nKarena kontraknya sekecil itu, sumber dan tujuan bisa dipertukarkan: bytes.Buffer, strings.Reader, os.File, koneksi jaringan, badan request HTTP, semuanya memenuhi interface yang sama. Fungsi seperti io.Copy(dst, src) dan fmt.Fprintf(w, format, args) bekerja pada apa pun yang memenuhi interface, tanpa tahu asalnya.\n\nCara membaca kode I/O Go jadi seragam: lihat parameter fungsinya. Parameter `w io.Writer` berarti fungsi bisa menulis ke buffer, berkas, atau respons HTTP; parameter `r io.Reader` berarti sumbernya bisa string, berkas, atau koneksi. Package bytes dan bufio menyediakan pembungkus untuk efisiensi dan kemudahan; keduanya akan sering kamu temui di modul stdlib.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"io\"\n\t\"strings\"\n)\n\nfunc main() {\n\tsrc := strings.NewReader(\"kopi dan teh\")\n\tvar buf bytes.Buffer\n\tn, err := io.Copy(&buf, src)\n\tfmt.Println(n, err)\n\tfmt.Println(buf.String())\n}",
            caption: "io.Copy bekerja pada pasangan Reader/Writer apa pun, tak peduli sumbernya berkas atau string.",
          },
        },
        {
          kind: "quiz",
          question: "Apa arti keluaran io.EOF dari Read?",
          options: [
            "Error fatal yang harus di-recover",
            "Aliran sudah habis, tidak ada data lagi",
            "Buffer p terlalu kecil",
            "Reader perlu dibuat ulang",
          ],
          answer: 1,
          explanation: "io.EOF bukan kegagalan, melainkan tanda bacaan mencapai ujung aliran. Loop pembacaan berhenti di situ.",
        },
        {
          kind: "quiz",
          question: "Mengapa fungsi sebaiknya menerima `w io.Writer` alih-alih `*os.File`?",
          options: [
            "io.Writer lebih cepat dari berkas",
            "Agar bisa menulis ke buffer, berkas, koneksi, atau apa pun yang punya method Write",
            "*os.File tidak ada di Windows",
            "io.Writer tidak melaporkan error",
          ],
          answer: 1,
          explanation:
            "io.Writer adalah kontrak satu method. Fungsi yang menulis kepadanya bekerja dengan semua tujuan: bytes.Buffer, os.File, respons HTTP, dan lainnya.",
        },
      ],
    },
    {
      slug: "latihan-kasir-error",
      title: "Latihan Gabungan: Mesin Kasir",
      summary: "Gabungkan custom error, wrapping, dan errors.As dalam satu program kasir.",
      steps: [
        {
          kind: "theory",
          title: "Satu alur, empat alat",
          body: "Latihan penutup merangkai modul ini jadi satu alur kasir: fungsi proses memeriksa pembayaran, mengembalikan nil kalau lunas, dan membungkus custom error ErrKurangBayar dengan konteks transaksi gagal kalau uangnya kurang. main membongkarnya dengan errors.As supaya jumlah kekurangan bisa ditampilkan.\n\nPerhatikan pembagian perannya. ErrKurangBayar membawa data (Kurang), method Error() memformatnya, fmt.Errorf menambah konteks dan menyimpan aslinya lewat %w, dan errors.As menemukan tipe itu kembali di main. errors.Is dipakai untuk sentinel, As untuk tipe berisi data. Kembalian dihitung hanya kalau tidak ada error.",
          code: {
            language: "go",
            content: "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype ErrSaldoKurang struct {\n\tKurang int\n}\n\nfunc (e ErrSaldoKurang) Error() string {\n\treturn fmt.Sprintf(\"kurang Rp%d\", e.Kurang)\n}\n\nfunc tarik(saldo, jumlah int) error {\n\tif jumlah > saldo {\n\t\treturn fmt.Errorf(\"tarik tunai: %w\", ErrSaldoKurang{Kurang: jumlah - saldo})\n\t}\n\treturn nil\n}\n\nfunc main() {\n\terr := tarik(50000, 80000)\n\tvar e ErrSaldoKurang\n\tif errors.As(err, &e) {\n\t\tfmt.Println(\"ditolak:\", e.Error())\n\t\treturn\n\t}\n\tfmt.Println(\"berhasil\")\n}",
            caption: "Custom error membawa data, dibungkus %w, lalu dibongkar errors.As.",
          },
        },
        {
          kind: "code",
          title: "Selesaikan mesin kasir",
          prompt:
            "Lengkapi verb pembungkus di proses dan fungsi errors yang membongkar tipe ErrKurangBayar di main. Input: harga lalu uang yang dibayar.",
          mode: "fill",
          template:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype ErrKurangBayar struct {\n\tKurang int\n}\n\nfunc (e ErrKurangBayar) Error() string {\n\treturn fmt.Sprintf(\"kurang bayar Rp%d\", e.Kurang)\n}\n\nfunc proses(harga, bayar int) error {\n\tif bayar < harga {\n\t\treturn fmt.Errorf(\"transaksi gagal: %___\", ErrKurangBayar{Kurang: harga - bayar})\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar harga, bayar int\n\tfmt.Scan(&harga, &bayar)\n\terr := proses(harga, bayar)\n\tvar eb ErrKurangBayar\n\tswitch {\n\tcase errors.___(err, &eb):\n\t\tfmt.Println(eb.Error())\n\tcase err != nil:\n\t\tfmt.Println(\"error lain:\", err)\n\tdefault:\n\t\tfmt.Printf(\"kembalian Rp%d\\n\", bayar-harga)\n\t}\n}",
          solution:
            "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\ntype ErrKurangBayar struct {\n\tKurang int\n}\n\nfunc (e ErrKurangBayar) Error() string {\n\treturn fmt.Sprintf(\"kurang bayar Rp%d\", e.Kurang)\n}\n\nfunc proses(harga, bayar int) error {\n\tif bayar < harga {\n\t\treturn fmt.Errorf(\"transaksi gagal: %w\", ErrKurangBayar{Kurang: harga - bayar})\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tvar harga, bayar int\n\tfmt.Scan(&harga, &bayar)\n\terr := proses(harga, bayar)\n\tvar eb ErrKurangBayar\n\tswitch {\n\tcase errors.As(err, &eb):\n\t\tfmt.Println(eb.Error())\n\tcase err != nil:\n\t\tfmt.Println(\"error lain:\", err)\n\tdefault:\n\t\tfmt.Printf(\"kembalian Rp%d\\n\", bayar-harga)\n\t}\n}",
          tests: [
            { stdin: "50000 60000", expectedOutput: "kembalian Rp10000" },
            { stdin: "25000 20000", expectedOutput: "kurang bayar Rp5000" },
            { stdin: "18000 10000", expectedOutput: "kurang bayar Rp8000", hidden: true },
          ],
          hints: [
            "Verb yang menyimpan error asli di dalam error baru adalah %w.",
            "Untuk membongkar error menjadi tipe tertentu, package errors punya fungsi As.",
            "Jawabannya: w dan As.",
          ],
        },
      ],
    },
  ],
};
