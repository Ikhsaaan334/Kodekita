import type { JalurBagian } from "../../types";

// Bagian 3 dari jalur go: modul 4 (Generics dan Pola Tipe) dan
// modul 5 (Goroutine dan Channel), 10 lesson per modul, tingkat menanjak.
export const BAGIAN: JalurBagian = {
  lang: "go",
  moduleRange: [4, 5],
  modules: [
    {
      title: "Generics dan Pola Tipe",
      description: "Type parameters, constraints, dan kapan generics justru bikin rumit.",
    },
    {
      title: "Goroutine dan Channel",
      description: "Goroutine, buffered/unbuffered channel, select, dan WaitGroup.",
    },
  ],
  lessons: [
    // ==================== MODUL 4: Generics dan Pola Tipe ====================
    {
      slug: "generics-fungsi-dasar",
      title: "Fungsi Generic Pertama",
      summary: "Type parameter dalam kurung siku: satu fungsi untuk semua tipe, tetap dicek compiler.",
      steps: [
        {
          kind: "theory",
          title: "T sebagai placeholder tipe",
          body: "Kotak pertama yang dibuka generics adalah type parameter: daftar tipe formal dalam kurung siku sebelum daftar parameter. `func Pertama[T any](s []T) T` dibaca: Pertama punya satu type parameter bernama T dengan constraint `any` (semua tipe sah), menerima slice `[]T`, dan mengembalikan satu nilai bertipe T. Satu fungsi untuk semua tipe, dan tetap aman di setiap pemakaiannya.\n\nSaat dipanggil dengan `[]int`, compiler mengganti T menjadi int lalu memeriksa seluruh badan fungsi terhadap int. Salah pakai tertangkap sebelum program jalan. Bandingkan dengan parameter `any`: tipe asli nilai tersembunyi, dan setiap pemakaian menuntut type assertion yang bisa meleset saat runtime.\n\nPenamaan type parameter mengikuti konvensi: satu huruf kapital untuk kasus sederhana (`T`, `K`, `V`), nama deskriptif ketika kontraknya bermakna (`Ordered`, `BisaLuas`). Kebiasaan yang dijaga komunitas: tulis versi konkret dulu, jadikan generic hanya setelah tipe kedua benar-benar muncul dan algoritmanya sama persis.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func Pertama[T any](s []T) T {
	return s[0]
}

func main() {
	fmt.Println(Pertama([]int{10, 20, 30}))
	fmt.Println(Pertama([]string{"go", "generics"}))
	fmt.Println(Pertama([]float64{2.5, 0.5}))
}`,
            caption: "Satu definisi, tiga tipe slice berbeda; compiler mengecek masing-masing instansiasi.",
          },
        },
        {
          kind: "code",
          title: "Pertama yang generic",
          prompt: "Lengkapi deklarasi type parameter pada fungsi `Pertama` supaya fungsi itu bekerja untuk slice int sekaligus slice string di `main`. Ganti `___`.",
          mode: "fill",
          template: `package main

import "fmt"

func Pertama[___](s []T) T {
	return s[0]
}

func main() {
	var n int
	fmt.Scan(&n)
	angka := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&angka[i])
	}
	fmt.Println(Pertama(angka))
	fmt.Println(Pertama([]string{"go", "generics"}))
}`,
          solution: `package main

import "fmt"

func Pertama[T any](s []T) T {
	return s[0]
}

func main() {
	var n int
	fmt.Scan(&n)
	angka := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&angka[i])
	}
	fmt.Println(Pertama(angka))
	fmt.Println(Pertama([]string{"go", "generics"}))
}`,
          tests: [
            { stdin: "3\n10 20 30", expectedOutput: "10\ngo" },
            { stdin: "1\n42", expectedOutput: "42\ngo" },
            { stdin: "4\n-5 1 2 3", expectedOutput: "-5\ngo", hidden: true },
          ],
          hints: [
            "Kurung siku sebelum daftar parameter menampung nama type parameter beserta constraintnya.",
            "Constraint yang paling luas, semua tipe sah, ditulis dengan satu kata tiga huruf.",
            "Jawabannya: T any.",
          ],
        },
      ],
    },
    {
      slug: "constraint-comparable",
      title: "Constraint comparable",
      summary: "T yang boleh dibandingkan dengan ==, dan hubungannya dengan kunci map.",
      steps: [
        {
          kind: "theory",
          title: "Tipe yang boleh == ",
          body: "`comparable` adalah constraint bawaan yang type set-nya semua tipe yang bisa dibandingkan dengan `==` dan `!=`: angka, string, bool, pointer, channel, serta struct dan array yang isinya comparable. Slice, map, dan fungsi tidak termasuk. Dengan `T comparable`, baris `if v == cari` di badan fungsi sah; dengan `T any` saja, baris itu error kompilasi.\n\nHubungannya dengan map bukan kebetulan: kunci map wajib comparable, jadi fungsi generic dengan `T comparable` bebas memakai `map[T]V` di dalamnya. Fungsi pencari di contoh bawah bekerja untuk slice string, dan versi yang sama jalan untuk `[]int` tanpa mengubah satu baris.\n\nYang comparable tidak mencakup urutan: `<` dan `>` butuh type set angka atau string, dibahas di lesson berikutnya lewat union. Untuk kode sehari-hari cukup pegang satu kalimat: comparable berarti boleh `==` dan boleh jadi kunci map.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func Index[T comparable](s []T, cari T) int {
	for i, v := range s {
		if v == cari {
			return i
		}
	}
	return -1
}

func main() {
	fmt.Println(Index([]string{"buku", "tas"}, "tas"))
	fmt.Println(Index([]int{3, 1, 4}, 4))
	fmt.Println(Index([]string{"a", "b"}, "z"))
}`,
            caption: "Comparable mengizinkan ==; tanpa dia, perbandingan itu error kompilasi.",
          },
        },
        {
          kind: "code",
          title: "Pencarian generic yang ditolak compiler",
          prompt: "Program ini gagal dikompilasi: compiler menolak perbandingan `v == cari` pada type parameter. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `package main

import "fmt"

func Index[T any](s []T, cari T) int {
	for i, v := range s {
		if v == cari {
			return i
		}
	}
	return -1
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	var cari string
	fmt.Scan(&cari)
	fmt.Println(Index(kata, cari))
}`,
          solution: `package main

import "fmt"

func Index[T comparable](s []T, cari T) int {
	for i, v := range s {
		if v == cari {
			return i
		}
	}
	return -1
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	var cari string
	fmt.Scan(&cari)
	fmt.Println(Index(kata, cari))
}`,
          tests: [
            { stdin: "3\nbuku tas dompet\ntas", expectedOutput: "1" },
            { stdin: "2\na b\nc", expectedOutput: "-1" },
            { stdin: "4\nx y z w\nw", expectedOutput: "3", hidden: true },
          ],
          hints: [
            "Baca pesan compiler: invalid operation, ia bicara soal tipe yang tidak bisa dibandingkan.",
            "Constraint `any` menampung semua tipe, termasuk yang tidak boleh dibandingkan. Ada constraint bawaan khusus untuk itu.",
            "Jawabannya: ganti [T any] menjadi [T comparable].",
          ],
        },
      ],
    },
    {
      slug: "constraint-custom-union",
      title: "Constraint Kustom: Union dan Method",
      summary: "Definisikan type set sendiri: union tipe untuk operator, method untuk perilaku.",
      steps: [
        {
          kind: "theory",
          title: "Constraint milikmu sendiri",
          body: "Constraint apa pun di Go pada dasarnya interface, dan kamu bebas mendefinisikannya sendiri. Bentuk pertama: union, daftar tipe yang diperbolehkan. `type Angka interface { int | float64 }` membuat type set berisi dua tipe itu, dan `~int` (tanda tilde) menambahkan semua tipe berbasis int, bukan hanya int persis.\n\nType set menentukan operator yang boleh dipakai di badan fungsi. Kalau semua anggota type set mendukung `+`, fungsi generic boleh menulis `a + b` dan hasilnya bertipe T. Inilah yang membuat satu `Jumlahkan` cukup untuk int dan float64, sesuatu yang sebelum Go 1.18 hanya bisa lewat duplikasi fungsi atau interface kosong.\n\nBentuk kedua: constraint method, persis interface biasa. `type BisaLuas interface { Luas() float64 }` memaksa T punya method `Luas() float64`, sehingga fungsi bisa memanggilnya pada tiap elemen. Keduanya boleh dicampur dalam satu constraint. Pedoman memilihnya singkat: union untuk operator, method untuk perilaku.",
          code: {
            language: "go",
            content: `type Angka interface {
	int | float64
}

type BisaLuas interface {
	Luas() float64
}

func Jumlahkan[T Angka](a, b T) T {
	return a + b // + sah: int dan float64 sama-sama mendukung
}

func TotalLuas[T BisaLuas](s []T) float64 {
	total := 0.0
	for _, b := range s {
		total += b.Luas()
	}
	return total
}`,
            caption: "Union untuk operator aritmetika; constraint method untuk perilaku Luas().",
          },
        },
        {
          kind: "code",
          title: "Jumlahkan dua dunia angka",
          prompt: "Lengkapi constraint kustom `Angka` dan deklarasi type parameter `Jumlahkan` supaya satu fungsi bisa menjumlahkan int dari input sekaligus dua float yang sudah ditulis di `main`.",
          mode: "fill",
          template: `package main

import "fmt"

type Angka interface {
	___ | float64
}

func Jumlahkan[___](a, b T) T {
	return a + b
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	fmt.Println(Jumlahkan(a, b))
	fmt.Println(Jumlahkan(1.5, 2.5))
}`,
          solution: `package main

import "fmt"

type Angka interface {
	int | float64
}

func Jumlahkan[T Angka](a, b T) T {
	return a + b
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	fmt.Println(Jumlahkan(a, b))
	fmt.Println(Jumlahkan(1.5, 2.5))
}`,
          tests: [
            { stdin: "3 4", expectedOutput: "7\n4" },
            { stdin: "10 -2", expectedOutput: "8\n4" },
            { stdin: "0 0", expectedOutput: "0\n4", hidden: true },
          ],
          hints: [
            "Baris pertama type set: tipe dasar bilangan bulat, ditulis dengan tiga huruf.",
            "Type parameter dideklarasikan di kurung siku dengan constraint yang baru kamu definisikan.",
            "Jawabannya: int dan T Angka.",
          ],
        },
      ],
    },
    {
      slug: "generic-type-struct",
      title: "Tipe Generic: Struct dan Method",
      summary: "Struct dengan type parameter dan methodnya, dari stack sampai cache.",
      steps: [
        {
          kind: "theory",
          title: "Type parameter pada struct",
          body: "Type parameter tidak berhenti di fungsi. Struct juga bisa membawanya: `type Tumpukan[T any] struct { isi []T }`. Setelah itu T berlaku di seluruh struct, dan setiap instansiasi menghasilkan tipe yang berbeda: `Tumpukan[int]` dan `Tumpukan[string]` tidak bisa dicampur, persis dua tipe konkret yang kebetulan punya bentuk sama.\n\nMethod dari struct generic mendeklarasikan ulang T pada receiver: `func (t *Tumpukan[T]) Dorong(v T)`. Namanya harus sama dengan deklarasi struct, dan method tidak boleh menambah type parameter baru. Yang boleh: memakai T untuk parameter, nilai kembali, dan variabel di dalam badan method.\n\nKapan struct generic layak: kontainer yang isinya homogen tetapi jenis isinya berubah-ubah antar pemakaian. Stack, queue, cache, node graph. Stdlib contohnya `atomic.Pointer[T]`. Sebaliknya, struct yang fieldnya memang bertipe tertentu tidak perlu digeneralisasi hanya supaya terlihat canggih.",
          code: {
            language: "go",
            content: `package main

import "fmt"

type Tumpukan[T any] struct {
	isi []T
}

func (t *Tumpukan[T]) Dorong(v T) {
	t.isi = append(t.isi, v)
}

func (t *Tumpukan[T]) Ambil() T {
	lama := t.isi[len(t.isi)-1]
	t.isi = t.isi[:len(t.isi)-1]
	return lama
}

func main() {
	var t Tumpukan[string]
	t.Dorong("satu")
	t.Dorong("dua")
	fmt.Println(t.Ambil(), t.Ambil()) // dua satu
}`,
            caption: "T dideklarasikan di struct dan diulang di receiver setiap method.",
          },
        },
        {
          kind: "code",
          title: "Tumpukan yang tumbuh mundur",
          prompt: "Lengkapi deklarasi struct generic `Tumpukan` dan receiver method `Dorong`. Program membaca n bilangan, menumpuknya, lalu mengeluarkan semuanya dari atas tumpukan.",
          mode: "fill",
          template: `package main

import "fmt"

type Tumpukan[___] struct {
	isi []T
}

func (t *Tumpukan[___]) Dorong(v T) {
	t.isi = append(t.isi, v)
}

func (t *Tumpukan[T]) Ambil() T {
	lama := t.isi[len(t.isi)-1]
	t.isi = t.isi[:len(t.isi)-1]
	return lama
}

func main() {
	var n int
	fmt.Scan(&n)
	var t Tumpukan[int]
	for i := 0; i < n; i++ {
		var x int
		fmt.Scan(&x)
		t.Dorong(x)
	}
	for i := 0; i < n; i++ {
		fmt.Println(t.Ambil())
	}
}`,
          solution: `package main

import "fmt"

type Tumpukan[T any] struct {
	isi []T
}

func (t *Tumpukan[T]) Dorong(v T) {
	t.isi = append(t.isi, v)
}

func (t *Tumpukan[T]) Ambil() T {
	lama := t.isi[len(t.isi)-1]
	t.isi = t.isi[:len(t.isi)-1]
	return lama
}

func main() {
	var n int
	fmt.Scan(&n)
	var t Tumpukan[int]
	for i := 0; i < n; i++ {
		var x int
		fmt.Scan(&x)
		t.Dorong(x)
	}
	for i := 0; i < n; i++ {
		fmt.Println(t.Ambil())
	}
}`,
          tests: [
            { stdin: "3\n7 8 9", expectedOutput: "9\n8\n7" },
            { stdin: "1\n42", expectedOutput: "42" },
            { stdin: "5\n1 2 3 4 5", expectedOutput: "5\n4\n3\n2\n1", hidden: true },
          ],
          hints: [
            "Deklarasi struct generic menaruh type parameter dan constraint di kurung siku setelah nama struct.",
            "Nama type parameter pada receiver harus sama dengan yang di struct.",
            "Jawabannya: T any pada kedua bagian.",
          ],
        },
      ],
    },
    {
      slug: "inference-dan-instansiasi",
      title: "Inference dan Instansiasi Eksplisit",
      summary: "Kapan compiler menyimpulkan T dari argumen, dan kapan kamu harus menulisnya sendiri.",
      steps: [
        {
          kind: "theory",
          title: "Simpulan sendiri, atau tunjuk",
          body: "Sebagian besar pemanggilan generic tidak menulis T sama sekali: compiler menyimpulkannya dari argumen. `Jumlahkan(3, 4)` cukup; T menjadi int karena kedua argumen int. Inference bekerja pada argumen, jadi nilai kembali ikut pasti: `hasil := Jumlahkan(3, 4)` membuat hasil bertipe int tanpa anotasi apa pun.\n\nBatas inference yang paling sering ketemu: T tidak muncul di parameter. `func Baru[T any]() []T` dipanggil dengan `Baru()` membuat compiler tidak punya bahan penyimpulan, jadi T wajib ditulis eksplisit: `Baru[int]()`. Instansiasi eksplisit juga dipakai secara sadar untuk membaca kode, misalnya memaksa T tertentu pada pemanggilan yang ambigu.\n\nKesalahan inference yang klasik: dua argumen yang mengarah ke T berbeda, misalnya satu variabel int dan satu variabel float64 pada `Jumlahkan`. Untuk konstanta tanpa tipe compiler bisa menyatukan, tapi begitu ada variabel bertipe beda, error muncul di pemanggilan, dan pesannya informatif: ia menunjukkan T yang tersimpulkan dari tiap argumen.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func Baru[T any]() []T {
	return make([]T, 0)
}

func Ganda[T any](a, b T) (T, T) {
	return a, b
}

func main() {
	angka := Baru[int]() // eksplisit: wajib, T tidak muncul di parameter
	fmt.Println(len(angka))

	fmt.Println(Ganda(7, 8))      // T disimpulkan: int
	fmt.Println(Ganda[int](7, 8)) // hasil sama, ditulis eksplisit
}`,
            caption: "Tanpa argumen pembawa T, compiler tidak bisa menyimpulkan apa pun.",
          },
        },
        {
          kind: "quiz",
          question:
            "Pada `func Jumlahkan[T Angka](a, b T) T`, bagaimana compiler mengetahui T saat memanggil `Jumlahkan(3, 4)`?",
          options: [
            "Ditulis eksplisit di pemanggilan",
            "Disimpulkan dari tipe kedua argumen",
            "Dari tipe variabel penampung hasilnya",
            "T selalu int pada fungsi generic",
          ],
          answer: 1,
          explanation:
            "Type inference menyimpulkan T dari tipe argumen: kedua argumen int, jadi T int. Nilai kembaliannya mengikuti T.",
        },
        {
          kind: "quiz",
          question:
            "Fungsi `func Buat[T any]() []T` dipanggil dengan `Buat()`. Apa yang terjadi?",
          options: [
            "Kompilasi gagal: T tidak bisa disimpulkan, wajib menulis Buat[int]()",
            "T otomatis menjadi int",
            "Slice kosong bertipe []any dikembalikan",
            "Panic saat runtime",
          ],
          answer: 0,
          explanation:
            "T tidak muncul di daftar parameter, jadi inference tidak punya bahan. Instansiasi eksplisit seperti Buat[int]() adalah satu-satunya cara memanggilnya.",
        },
      ],
    },
    {
      slug: "kapan-tanpa-generics",
      title: "Kapan Tidak Pakai Generics",
      summary: "Interface kecil sering lebih jujur daripada type parameter.",
      steps: [
        {
          kind: "theory",
          title: "Generic bukan tujuan",
          body: "Generics menyelesaikan satu masalah: algoritma yang sama untuk banyak tipe dengan tetap dicek compiler. Ketika masalah itu tidak ada, type parameter hanya menambah beban baca. Contoh paling umum: fungsi yang hanya memanggil satu method. `func Tampilkan(d Deskriptif)` dengan `type Deskriptif interface { String() string }` lebih pendek, lebih jelas, dan kesalahannya sama ketat dengan versi generic.\n\nTanda generic dipaksakan antara lain: signature lebih panjang daripada seluruh logikanya; constraint dibuat selebar mungkin padahal pemanggilnya cuma satu tipe; dan yang paling khas, muncul branching per tipe di dalam badan fungsi generic. Yang terakhir itu sinyal kuat polimorfisme interface lebih cocok, karena perilaku yang berbeda per tipe memang ranah interface.\n\nStdlib bisa jadi rujukan rasa: `sort` tetap memakai interface, `fmt` tetap menerima `any`. Kebiasaan yang sehat: tulis versi konkret, dan generic baru ketika duplikasi kedua benar-benar muncul. Generic adalah alat menghapus duplikasi yang nyata, bukan antisipasi duplikasi hipotetis.",
          code: {
            language: "go",
            content: `package main

import "fmt"

type Deskriptif interface {
	String() string
}

func Tampilkan(d Deskriptif) {
	fmt.Println(d.String())
}

type Produk struct{ Nama string }

func (p Produk) String() string { return "Produk: " + p.Nama }

func main() {
	Tampilkan(Produk{"Buku"}) // interface cukup: tidak butuh generic
}`,
            caption: "Satu method yang dibutuhkan: parameter interface lebih sederhana daripada type parameter.",
          },
        },
        {
          kind: "quiz",
          question:
            "Fungsi hanya memanggil `String()` pada setiap elemen slice. Bentuk parameter yang paling sederhana dan tepat?",
          options: [
            "Generic dengan constraint any",
            "Parameter bertipe any lalu type assertion manual",
            "Slice interface yang punya method String() string, mis. []fmt.Stringer",
            "Dibuat generic dengan constraint union tipe dasar",
          ],
          answer: 2,
          explanation:
            "Yang dibutuhkan hanya satu method, jadi interface dengan method itu cukup dan lebih sederhana. Generic layak ketika algoritmanya butuh tipe konkret, bukan satu method.",
        },
        {
          kind: "quiz",
          question: "Mana tanda bahwa generic dipaksakan pada sebuah fungsi?",
          options: [
            "Fungsinya dipakai untuk dua tipe dengan algoritma yang sama persis",
            "Signature generic lebih panjang daripada seluruh logika di badannya",
            "Type parameternya memakai comparable untuk fungsi pencarian",
            "Struct kontainernya menyimpan elemen homogen",
          ],
          answer: 1,
          explanation:
            "Kalau signature generic lebih rumit daripada logikanya, biayanya lebih besar daripada manfaatnya. Sisanya justru pemakaian generic yang sehat.",
        },
      ],
    },
    {
      slug: "any-vs-generics",
      title: "any vs Generics",
      summary: "Ketika tipe diperiksa: waktu kompilasi dengan generics, waktu jalan dengan any.",
      steps: [
        {
          kind: "theory",
          title: "Pemeriksaan tipe pindah waktu",
          body: "`any` adalah alias `interface{}`: satu variabel menampung nilai tipe apa pun, tetapi tipe statisnya any. Konsekuensinya operator tidak dikenal: `x * 2` untuk `var x any` langsung error kompilasi, dan method apa pun harus lewat type assertion `v.(int)` yang bisa panic kalau tebakan meleset. Tipe asli nilai itu tersembunyi sejak masuk fungsi.\n\nGenerics menahan informasi tipe itu tetap hidup. Nilai masuk dan keluar bertipe T yang sama, assertion tidak pernah dibutuhkan, dan pemakaian yang salah tipe gagal di waktu kompilasi. Kalimat pengeratnya: any memindahkan pemeriksaan tipe ke saat program berjalan, generics menahannya di waktu kompilasi.\n\nany tetap pilihan tepat untuk nilai yang benar-benar beragam bentuknya: `fmt.Println` menerima apa saja, hasil decode JSON memang tipe campuran, dan handler pesan yang bentuknya belum pasti bisa mulai dari any sebelum desainnya matang. Pedoman praktisnya: any untuk nilai yang tipe memang tak dikenal, generic untuk struktur yang isinya seragam.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func JumlahkanAny(a, b any) any {
	return a.(int) + b.(int) // assertion: bisa panic
}

func Jumlahkan[T int | float64](a, b T) T {
	return a + b // tipe aman sejak kompilasi
}

func main() {
	fmt.Println(JumlahkanAny(2, 3))
	fmt.Println(Jumlahkan(2, 3))
}`,
            caption: "Versi any percaya assertion di runtime; versi generic sudah dicek compiler.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil kompilasi `var x any = 5` diikuti `fmt.Println(x * 2)`?",
          options: [
            "10",
            "Error kompilasi: operator * tidak terdefinisi untuk any",
            "Panic saat runtime",
            "2",
          ],
          answer: 1,
          explanation:
            "any tidak membawa tipe yang mendukung operator. Supaya jalan, nilai harus di-assert dulu, misalnya x.(int) * 2, dan baru itu berisiko panic di runtime.",
        },
        {
          kind: "quiz",
          question: "Kasus mana yang paling tepat memakai any, bukan generic?",
          options: [
            "Fungsi menjumlah dua nilai dengan tipe yang sama",
            "Stack homogen yang isinya int",
            "Fungsi cetak nilai tipe apa pun, seperti fmt.Println",
            "Filter elemen slice dengan tipe tetap",
          ],
          answer: 2,
          explanation:
            "Nilai yang memang beragam tipe cocok untuk any. Kasus lain isinya seragam dan butuh type safety, ranah generics.",
        },
      ],
    },
    {
      slug: "generic-helper-koleksi",
      title: "Helper Koleksi Generic",
      summary: "Kunci, Filter, dan teman-temannya: dua type parameter sekaligus.",
      steps: [
        {
          kind: "theory",
          title: "Dua type parameter dalam satu fungsi",
          body: "Pola generics yang paling sering dipakai di kode nyata adalah helper koleksi: ambil kunci map, filter slice, petakan elemen ke bentuk baru. Semuanya mengikuti bentuk yang sama: type parameter dengan constraint sesuai kebutuhan operasinya. `Kunci[K comparable, V any](m map[K]V) []K` memakai dua type parameter sekaligus, dipisah koma, masing-masing dengan constraint sendiri.\n\nPerhatikan pembagian perannya: K harus comparable karena kunci map menuntut itu, V bebas. Fungsi ini bekerja untuk `map[string]int`, `map[int][]byte`, dan map apa pun tanpa duplikasi. Helper filter serupa: tipe elemen T any, dan kriteria dipilih pemanggil lewat fungsi yang dikirim.\n\nSebelum menulis sendiri, lihat dulu stdlib: Go 1.21 menambahkan package `slices` dan `maps` yang mencakup banyak kebutuhan umum. Helper buatan sendiri tetap bermakna untuk perilaku khusus proyek, dan sebagai latihan memahami bagaimana dua type parameter saling mengikat tipe.",
          code: {
            language: "go",
            content: `func Kunci[K comparable, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

func Filter[T any](s []T, tetap func(T) bool) []T {
	hasil := []T{}
	for _, v := range s {
		if tetap(v) {
			hasil = append(hasil, v)
		}
	}
	return hasil
}`,
            caption: "K comparable karena jadi kunci map; V dan T bebas bertipe apa pun.",
          },
        },
        {
          kind: "code",
          title: "Kunci map versi generic",
          prompt: "Lengkapi fungsi `Kunci` yang mengembalikan semua kunci map tipe apa pun. Program membaca n pasang nama dan skor, lalu mencetak semuanya terurut abjad memakai fungsi generic itu.",
          mode: "fill",
          template: `package main

import (
	"fmt"
	"sort"
)

func Kunci[K comparable, ___](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, ___)
	}
	return keys
}

func main() {
	skor := make(map[string]int)
	var n int
	fmt.Scan(&n)
	for i := 0; i < n; i++ {
		var nama string
		var s int
		fmt.Scan(&nama, &s)
		skor[nama] = s
	}
	keys := Kunci(skor)
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("%s: %d\\n", k, skor[k])
	}
}`,
          solution: `package main

import (
	"fmt"
	"sort"
)

func Kunci[K comparable, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

func main() {
	skor := make(map[string]int)
	var n int
	fmt.Scan(&n)
	for i := 0; i < n; i++ {
		var nama string
		var s int
		fmt.Scan(&nama, &s)
		skor[nama] = s
	}
	keys := Kunci(skor)
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("%s: %d\\n", k, skor[k])
	}
}`,
          tests: [
            { stdin: "3\nceri 90\nandi 80\nbudi 85", expectedOutput: "andi: 80\nbudi: 85\nceri: 90" },
            { stdin: "2\nzaki 10\namin 20", expectedOutput: "amin: 20\nzaki: 10" },
            { stdin: "4\nd 1\nb 2\nc 3\na 4", expectedOutput: "a: 4\nb: 2\nc: 3\nd: 1", hidden: true },
          ],
          hints: [
            "Dua type parameter dipisah koma; yang pertama, K comparable, sudah ditulis.",
            "V adalah tipe nilai map, dan yang di-append di dalam loop adalah kuncinya.",
            "Jawabannya: V any dan k.",
          ],
        },
      ],
    },
    {
      slug: "functional-options",
      title: "Pola Functional Options",
      summary: "Konstruktor dengan konfigurasi opsional yang tumbuh tanpa merusak pemanggil.",
      steps: [
        {
          kind: "theory",
          title: "Konfigurasi yang tumbuh tanpa merusak",
          body: "Masalah yang dipecahkan functional options: konstruktor yang konfigurasinya bertambah terus. Go tidak punya overload fungsi atau parameter opsional, dan menumpuk parameter seperti `withTimeout bool`, `withRetry bool` membuat pemanggil lama rusak dan makna `true` di posisi keempat tidak terbaca.\n\nPolanya: satu tipe opsi, `type Opsi func(*Server)`. Setiap konfigurasi menjadi fungsi kecil yang mengembalikan Opsi: `DenganPort(3000)` mengembalikan closure yang mengubah field port ketika diterapkan. Konstruktor `ServerBaru(host string, opsi ...Opsi)` menyiapkan nilai default dulu, lalu menerapkan opsi satu per satu. Variadic membuat nol opsi sah, dan opsi yang ditambahkan di masa depan tidak pernah mengubah pemanggil lama.\n\nPola ini tersebar luas di ekosistem Go untuk konfigurasi klien dan server. Varian lanjutannya: opsi yang mengembalikan error untuk validasi, dan opsi yang menyimpan hasil untuk dibaca pemanggil. Intinya tetap satu: konfigurasi opsional yang boleh tumbuh tanpa merusak siapa pun.",
          code: {
            language: "go",
            content: `type Opsi func(*Server)

func DenganPort(p int) Opsi {
	return func(s *Server) { s.port = p }
}

func DenganTimeout(d time.Duration) Opsi {
	return func(s *Server) { s.timeout = d }
}

func ServerBaru(host string, opsi ...Opsi) *Server {
	s := &Server{host: host, port: 8080, timeout: 5 * time.Second}
	for _, o := range opsi {
		o(s) // terapkan tiap opsi pada struct yang sama
	}
	return s
}

// srv := ServerBaru("localhost", DenganPort(3000))`,
            caption: "Nilai default disiapkan di konstruktor; opsi menimpa hanya yang diberikan.",
          },
        },
        {
          kind: "quiz",
          question:
            "Tipe `Opsi` yang benar untuk pola functional options pada konstruktor `ServerBaru(host string, opsi ...Opsi)`?",
          options: [
            "type Opsi func(*Server)",
            "type Opsi interface{}",
            "type Opsi chan *Server",
            "type Opsi func() error",
          ],
          answer: 0,
          explanation:
            "Opsi adalah fungsi yang menerima pointer ke struct yang dikonfigurasi dan mengubah fieldnya saat diterapkan di dalam konstruktor.",
        },
        {
          kind: "quiz",
          question:
            "Kenapa functional options lebih disukai daripada menambah parameter `withX bool` untuk setiap fitur baru?",
          options: [
            "Karena fungsi variadic boleh dipanggil tanpa argumen sama sekali",
            "Karena opsi baru bisa ditambah tanpa mengubah pemanggil lama, dan nol opsi tetap sah",
            "Karena lebih cepat dijalankan daripada parameter biasa",
            "Karena Go tidak mengizinkan fungsi dengan banyak parameter",
          ],
          answer: 1,
          explanation:
            "Signature konstruktor tidak berubah saat opsi baru muncul, jadi pemanggil lama aman. Nilai default juga jelas: yang tidak diberi opsi tetap default.",
        },
      ],
    },
    {
      slug: "latihan-generics",
      title: "Latihan Gabungan: Unik Generic",
      summary: "comparable, map, dan slice bertemu dalam satu fungsi generic.",
      steps: [
        {
          kind: "theory",
          title: "Saring duplikat, jaga urutan",
          body: "Lesson penutup modul merangkai tiga hal yang sudah dilalui: fungsi generic dengan `T comparable`, map sebagai penanda yang sudah lewat, dan pembangunan slice hasil. Tujuannya fungsi `Unik[T comparable](s []T) []T`: menyaring nilai yang muncul lebih dari sekali, dengan urutan kemunculan pertama tetap terjaga.\n\nPola penyaringnya pernah kamu pakai di modul slice dan map: `seen := make(map[T]bool)` sebagai catatan, lalu hanya nilai yang belum tercatat yang boleh masuk hasil. Bedanya, sekarang pola itu dibungkus generic sehingga satu definisi bekerja untuk slice string, int, dan tipe comparable lain.\n\nUrutan kemunculan pertama adalah bagian yang menarik: map tidak bisa dipakai untuk menentukan urutan keluaran, jadi slice hasil yang menyimpan urutan, dan map hanya menandai keberadaan. Keduanya menjalankan peran yang tepat masing-masing.",
          code: {
            language: "go",
            content: `func Unik[T comparable](s []T) []T {
	// map[T]bool menandai nilai yang sudah lewat
	// hanya kunjungan pertama yang boleh masuk hasil
	// urutan kemunculan pertama dipertahankan
}`,
            caption: "Gambaran fungsi yang akan kamu lengkapi di langkah berikutnya.",
          },
        },
        {
          kind: "code",
          title: "Unik untuk tipe apa pun",
          prompt: "Lengkapi fungsi `Unik`: constraint T dan kondisi yang memutuskan sebuah nilai belum pernah muncul. Program membaca n kata lalu mencetak berapa yang unik dan daftarnya sesuai urutan kemunculan pertama.",
          mode: "fill",
          template: `package main

import "fmt"

func Unik[___](s []T) []T {
	seen := make(map[T]bool)
	hasil := []T{}
	for _, v := range s {
		if !___ {
			seen[v] = true
			hasil = append(hasil, v)
		}
	}
	return hasil
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	hasil := Unik(kata)
	fmt.Println(len(hasil))
	for _, v := range hasil {
		fmt.Println(v)
	}
}`,
          solution: `package main

import "fmt"

func Unik[T comparable](s []T) []T {
	seen := make(map[T]bool)
	hasil := []T{}
	for _, v := range s {
		if !seen[v] {
			seen[v] = true
			hasil = append(hasil, v)
		}
	}
	return hasil
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	hasil := Unik(kata)
	fmt.Println(len(hasil))
	for _, v := range hasil {
		fmt.Println(v)
	}
}`,
          tests: [
            { stdin: "5\nbuku tas buku pulpen tas", expectedOutput: "3\nbuku\ntas\npulpen" },
            { stdin: "4\na a b b", expectedOutput: "2\na\nb" },
            { stdin: "3\nx y z", expectedOutput: "3\nx\ny\nz", hidden: true },
          ],
          hints: [
            "Fungsi ini menyimpan string dan memakai string sebagai kunci map, jadi T harus bisa dibandingkan.",
            "Kondisi untuk nilai yang belum pernah muncul: cek map penandanya dengan indexing biasa.",
            "Jawabannya: T comparable dan seen[v].",
          ],
        },
      ],
    },
    // ==================== MODUL 5: Goroutine dan Channel ====================
    {
      slug: "goroutine-dan-waitgroup",
      title: "Goroutine dan sync.WaitGroup",
      summary: "Jalankan fungsi secara bersamaan, lalu tunggu semuanya selesai dengan rapi.",
      steps: [
        {
          kind: "theory",
          title: "go, dan menunggu yang dijatuhkan",
          body: "`go` di depan pemanggilan fungsi menjalankannya sebagai goroutine: alur eksekusi bersamaan yang ringan, mulai dari beberapa kilobyte stack dan bisa tumbuh sesuai kebutuhan. Ribuan goroutine masih murah, dan scheduler Go membagikannya ke core yang tersedia. Ada harga yang langsung terasa: `main` yang selesai menutup seluruh program, dan goroutine yang masih berjalan mati tanpa peringatan.\n\nMenyambungkan umur goroutine dengan pemanggil adalah pekerjaanmu, dan alat bawaannya `sync.WaitGroup`: `wg.Add(n)` menaikkan penghitung sebelum goroutine dijalankan, `wg.Done()` menurunkannya di akhir goroutine (hampir selalu lewat `defer`), dan `wg.Wait()` menunggu penghitung mencapai nol. WaitGroup adalah struct; kirim sebagai pointer kalau lewat parameter fungsi, dan jangan menyalin nilainya.\n\nGoroutine yang tiap anggota menulis ke indeks berbeda dalam satu slice tidak saling bertabrakan, dan pembacaan setelah `Wait()` aman karena Wait membangun urutan kejadian. Pola hasil-per-indeks inilah yang dipakai di latihan: hasil dikumpulkan per indeks, dicetak setelah semua selesai, sehingga keluaran pasti walau eksekusinya tidak berurutan.",
          code: {
            language: "go",
            content: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		fmt.Println("dari goroutine")
	}()
	wg.Wait()
	fmt.Println("main selesai")
}`,
            caption: "Wait() menahan main sampai goroutine memanggil Done().",
          },
        },
        {
          kind: "code",
          title: "Menunggu yang tidak pernah selesai",
          prompt: "Program ini berhenti dengan `fatal error: all goroutines are asleep - deadlock!`: main menunggu di `wg.Wait()`, tapi penghitung WaitGroup tidak pernah kembali ke nol. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	hasil := make([]int, n)
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			hasil[i] = (i + 1) * (i + 1)
		}(i)
	}
	wg.Wait()
	fmt.Println(hasil)
}`,
          solution: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	hasil := make([]int, n)
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			hasil[i] = (i + 1) * (i + 1)
		}(i)
	}
	wg.Wait()
	fmt.Println(hasil)
}`,
          tests: [
            { stdin: "3", expectedOutput: "[1 4 9]" },
            { stdin: "5", expectedOutput: "[1 4 9 16 25]" },
            { stdin: "1", expectedOutput: "[1]", hidden: true },
          ],
          hints: [
            "Pesan deadlock bicara jujur: main menunggu di wg.Wait(), dan tidak ada goroutine lain yang masih bisa jalan. Penghitung WaitGroup tidak pernah mencapai nol.",
            "Penghitung dinaikkan dengan wg.Add(1) sebelum goroutine dijalankan, tapi tidak pernah diturunkan di dalam goroutine.",
            "Jawabannya: tambahkan defer wg.Done() sebagai baris pertama badan goroutine.",
          ],
        },
      ],
    },
    {
      slug: "unbuffered-channel",
      title: "Unbuffered Channel",
      summary: "Kirim dan terima bertemu di satu titik: serah terima yang sinkron.",
      steps: [
        {
          kind: "theory",
          title: "Serah terima dari tangan ke tangan",
          body: "`chan T` adalah channel yang hanya mengangkut nilai bertipe T. Channel unbuffered, dibuat dengan `make(chan T)` tanpa kapasitas, punya sifat yang menjadi kuncinya: kirim menunggu sampai ada penerima yang siap, dan terima menunggu sampai ada pengirim. Keduanya bertemu di satu titik waktu, seperti serah terima paket dari tangan ke tangan.\n\nSifat menunggu itu alat sinkronisasi, bukan gangguan. Program yang mengirim ke channel tanpa penerima selamanya berhenti dengan `fatal error: all goroutines are asleep - deadlock`, begitu juga penerima yang menunggu channel yang tak pernah dikirim. Error itu jujur: menunggu tanpa harapan memang harus dihentikan.\n\nKarena kirim dan terima bertemu, channel juga membangun urutan kejadian: semua yang terjadi sebelum kirim terlihat aman setelah terima. Dari sini lahir pola request-response yang dipakai di latihan: goroutine menerima permintaan, mengolah, dan mengirim balasan lewat channel; pemanggil cukup menunggu balasan, tanpa mutex.",
          code: {
            language: "go",
            content: `ch := make(chan string) // unbuffered: kirim menunggu penerima
done := make(chan bool)
go func() {
	pesan := <-ch // menunggu sampai ada yang mengirim
	fmt.Println("menerima:", pesan)
	done <- true
}()
ch <- "halo"
<-done
fmt.Println("selesai")`,
            caption: "Kirim dan terima bertemu; done memastikan main tidak mendahului goroutine.",
          },
        },
        {
          kind: "code",
          title: "Request dan balasan lewat satu channel",
          prompt: "Lengkapi pola request-response: buat channel string, dan terima balasannya dari goroutine sebelum dicetak. Goroutine mengirim balasan berformat `diterima: <pesan>` lewat channel yang sama.",
          mode: "fill",
          template: `package main

import "fmt"

func main() {
	var pesan string
	fmt.Scan(&pesan)
	ch := ___
	go func() {
		ch <- "diterima: " + pesan
	}()
	balasan := ___
	fmt.Println(balasan)
}`,
          solution: `package main

import "fmt"

func main() {
	var pesan string
	fmt.Scan(&pesan)
	ch := make(chan string)
	go func() {
		ch <- "diterima: " + pesan
	}()
	balasan := <-ch
	fmt.Println(balasan)
}`,
          tests: [
            { stdin: "halo", expectedOutput: "diterima: halo" },
            { stdin: "kabar", expectedOutput: "diterima: kabar" },
            { stdin: "go", expectedOutput: "diterima: go", hidden: true },
          ],
          hints: [
            "Channel string unbuffered dibuat dengan make, tanpa argumen kapasitas.",
            "Menerima satu nilai dari channel memakai operator panah kiri.",
            "Jawabannya: make(chan string) dan <-ch.",
          ],
        },
      ],
    },
    {
      slug: "buffered-channel",
      title: "Buffered Channel",
      summary: "Antrean berkapasitas antara pengirim dan penerima, FIFO sampai penuh.",
      steps: [
        {
          kind: "theory",
          title: "Antrean kecil di tengah",
          body: "`make(chan T, n)` membuat channel berkapasitas n: sebuah antrean FIFO di antara pengirim dan penerima. Selama masih ada ruang, kirim tidak menunggu; penerima mengambil nilai dalam urutan yang sama dengan saat dikirim. `len(ch)` menghitung isi antrean saat itu, `cap(ch)` kapasitasnya.\n\nKapasitas penuh mengembalikan sifat lama: pengirim menunggu sampai ada ruang, artinya sampai penerima menarik satu nilai. Jadi buffered channel melonggarkan serah terima, bukan menghapusnya. Nilai yang sudah dikirim tidak pernah hilang: ia menunggu di antrean sampai diterima.\n\nKapan berguna: mengimbangi perbedaan kecepatan sesaat antara produsen dan konsumen, atau memberi jeda sebelum pengirim tertahan. Yang perlu dilawan adalah memperlakukan buffer sebagai knob performa: buffer besar tidak membuat program selesai lebih cepat, hanya menunda kapan kemacetan terlihat.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func main() {
	ch := make(chan int, 3)
	ch <- 10
	ch <- 20
	ch <- 30 // antrean penuh: kirim berikutnya akan menunggu
	fmt.Println(len(ch), cap(ch))
	fmt.Println(<-ch) // 10: urutan sesuai kirim
	fmt.Println(len(ch))
}`,
            caption: "FIFO: nilai keluar dalam urutan masuk, walau pengirim dan penerima tidak bertemu.",
          },
        },
        {
          kind: "code",
          title: "Isi antrean, lalu tuang",
          prompt: "Lengkapi program: buat channel berkapasitas n, isi n nilai kelipatan 10, cetak len dan cap, lalu tuang isinya satu per satu dengan menerima dari channel.",
          mode: "fill",
          template: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	ch := make(chan int, ___)
	for i := 1; i <= n; i++ {
		ch <- i * 10
	}
	fmt.Println(len(ch), cap(ch))
	for i := 0; i < n; i++ {
		fmt.Println(___)
	}
}`,
          solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	ch := make(chan int, n)
	for i := 1; i <= n; i++ {
		ch <- i * 10
	}
	fmt.Println(len(ch), cap(ch))
	for i := 0; i < n; i++ {
		fmt.Println(<-ch)
	}
}`,
          tests: [
            { stdin: "3", expectedOutput: "3 3\n10\n20\n30" },
            { stdin: "5", expectedOutput: "5 5\n10\n20\n30\n40\n50" },
            { stdin: "1", expectedOutput: "1 1\n10", hidden: true },
          ],
          hints: [
            "Kapasitas channel diset dari jumlah nilai yang akan dikirim, yaitu n.",
            "Mengosongkan channel satu nilai per putaran: terima dengan operator panah kiri.",
            "Jawabannya: n dan <-ch.",
          ],
        },
      ],
    },
    {
      slug: "channel-direction",
      title: "Arah Channel",
      summary: "chan<- dan <-chan: kontrak kirim atau terima yang dijaga compiler.",
      steps: [
        {
          kind: "theory",
          title: "Kontrak arah di tipe",
          body: "Tipe channel bisa dibatasi arahnya: `chan<- T` hanya boleh mengirim, `<-chan T` hanya boleh menerima. Konversinya otomatis dan satu arah: channel dua arah bisa dipakai di tempat yang menuntut salah satu arah, tapi tidak sebaliknya. Batasan ini tidak menambah biaya apa pun di runtime; murni tertulis di tipe dan dijaga compiler.\n\nManfaatnya paling terasa di signature fungsi: produsen menerima `chan<- int`, konsumen menerima `<-chan int`, dan pembaca pipeline langsung tahu siapa mengirim, siapa menerima. Kesalahan arah, misalnya menerima dari channel kirim-saja, error kompilasi dengan pesan yang jelas.\n\nKebiasaan yang menyertai: hanya pemilik channel dua arah yang berhak memanggil `close`, karena dialah yang tahu kapan pengiriman benar-benar selesai. Fungsi lain menerima versi satu arah sehingga tidak mungkin menutup atau mengirim tanpa hak. Kontrak kecil seperti ini mencegah bug yang tidak mungkin ditangkap kalau semua orang berbagi channel penuh.",
          code: {
            language: "go",
            content: `func produsen(keluar chan<- int) {
	for i := 1; i <= 3; i++ {
		keluar <- i
	}
	close(keluar)
}

func konsumen(masuk <-chan int) {
	for v := range masuk {
		fmt.Println(v)
	}
}`,
            caption: "Produsen hanya mengirim dan menutup; konsumen hanya menerima sampai habis.",
          },
        },
        {
          kind: "quiz",
          question: "Signature yang benar untuk fungsi produsen yang hanya mengirim int ke channel?",
          options: [
            "func produsen(ch chan int)",
            "func produsen(ch chan<- int)",
            "func produsen(ch <-chan int)",
            "func produsen(ch <- int)",
          ],
          answer: 1,
          explanation:
            "Panah yang menunjuk keluar dari kata chan berarti kirim saja: chan<- int. <-chan int justru terima saja, dan chan int dua arah tanpa kontrak.",
        },
        {
          kind: "quiz",
          question: "Apa yang terjadi pada `v := <-kirim` ketika `kirim` bertipe `chan<- int`?",
          options: [
            "v berisi zero value int",
            "Menunggu sampai ada pengirim",
            "Error kompilasi: chan<- int tidak boleh diterima",
            "Panic saat runtime",
          ],
          answer: 2,
          explanation:
            "Tipe kirim-saja menolak operasi penerimaan saat kompilasi. Batas arah memang tugas compiler, bukan pemeriksaan runtime.",
        },
      ],
    },
    {
      slug: "select-multi-channel",
      title: "select: Menunggu Banyak Channel",
      summary: "Satu select untuk beberapa channel, plus default untuk kasus tidak siap.",
      steps: [
        {
          kind: "theory",
          title: "Satu titik tunggu, banyak pintu",
          body: "`select` menunggu beberapa operasi channel sekaligus dan menjalankan case yang lebih dulu siap. Bila lebih dari satu siap pada saat yang sama, pilihannya acak dan adil, tidak ada case yang kelaparan. Bila tidak ada yang siap, select menunggu; dan `default` mengubahnya menjadi percobaan sekali jalan tanpa menunggu.\n\nBentuk paling umum di kode nyata: select di dalam `for`, melayani beberapa sumber terus-menerus sampai ada sinyal berhenti. Pola yang sama nanti dipakai untuk memantau `ctx.Done()`, jadi menguasai select adalah tiket masuk pembatalan yang rapi.\n\nSatu hal penting untuk menguji kode concurrent: kalau hanya satu case yang mungkin siap pada satu waktu, keluarannya pasti dan bisa diuji. Kalau dua sumber balapan memperebutkan select, urutannya tidak bisa diandalkan dan tidak boleh dijadikan keluaran yang diharapkan. Latihan di lesson ini sengaja deterministik: produsen mengirim berurutan lewat channel unbuffered, sehingga setiap kali select berjalan hanya ada satu calon.",
          code: {
            language: "go",
            content: `select {
case v := <-c1:
	fmt.Println("dari c1:", v)
case v := <-c2:
	fmt.Println("dari c2:", v)
default:
	fmt.Println("belum ada yang siap")
}`,
            caption: "default membuat select tidak menunggu; tanpa default, select menunggu satu case siap.",
          },
        },
        {
          kind: "code",
          title: "select dengan urutan yang pasti",
          prompt: "Lengkapi select: loop dua kali menunggu dari c1 dan c2, dan isi case penerimaan dari c2. Karena produsen mengirim lewat channel unbuffered secara berurutan, keluarannya pasti urut.",
          mode: "fill",
          template: `package main

import "fmt"

func main() {
	var kata string
	fmt.Scan(&kata)
	c1 := make(chan string)
	c2 := make(chan string)
	go func() {
		c1 <- kata
		c2 <- "selesai"
	}()
	for i := 0; i < ___; i++ {
		select {
		case v := <-c1:
			fmt.Println("dari c1:", v)
		case v := ___:
			fmt.Println("dari c2:", v)
		}
	}
}`,
          solution: `package main

import "fmt"

func main() {
	var kata string
	fmt.Scan(&kata)
	c1 := make(chan string)
	c2 := make(chan string)
	go func() {
		c1 <- kata
		c2 <- "selesai"
	}()
	for i := 0; i < 2; i++ {
		select {
		case v := <-c1:
			fmt.Println("dari c1:", v)
		case v := <-c2:
			fmt.Println("dari c2:", v)
		}
	}
}`,
          tests: [
            { stdin: "halo", expectedOutput: "dari c1: halo\ndari c2: selesai" },
            { stdin: "pagi", expectedOutput: "dari c1: pagi\ndari c2: selesai" },
            { stdin: "x", expectedOutput: "dari c1: x\ndari c2: selesai", hidden: true },
          ],
          hints: [
            "Ada dua nilai yang lewat: satu di c1, satu di c2. Loop harus melayani keduanya.",
            "Menerima dari c2 di case kedua memakai operator yang sama seperti case pertama.",
            "Jawabannya: 2 dan <-c2.",
          ],
        },
      ],
    },
    {
      slug: "close-dan-range",
      title: "close dan range",
      summary: "Sinyal selesai dari pengirim, dan loop penerima yang berhenti sendiri.",
      steps: [
        {
          kind: "theory",
          title: "Tidak ada kirim lagi",
          body: "`close(ch)` menandai tidak ada pengiriman lagi setelah ini. Penerima tetap bisa menerima setelahnya: bentuk `v, ok := <-ch` memberi `ok == false` beserta zero value T begitu channel kosong dan sudah ditutup. Mengirim ke channel yang sudah ditutup memicu panic, begitu juga close terhadap channel nil.\n\nIdiom paling bersih bagi penerima adalah `for v := range ch`: loop menerima terus sampai channel ditutup, lalu berakhir dengan sendirinya. Untuk mengosongkan seluruh hasil satu produsen, ini bentuk yang paling disukai, dan close adalah bagian yang membuat loop tahu kapan berhenti.\n\nAturan pemilikannya tegas: hanya pengirim yang boleh close, dan cukup satu yang melakukannya. Channel yang tidak perlu ditutup boleh dibiarkan; ia akan terkumpul oleh garbage collector. close bukan gratis, ia sinyal: untuk satu produsen artinya data selesai, untuk banyak penerima artinya broadcast bahwa semuanya usai.",
          code: {
            language: "go",
            content: `package main

import "fmt"

func main() {
	ch := make(chan int)
	go func() {
		for i := 1; i <= 3; i++ {
			ch <- i
		}
		close(ch) // sinyal: tidak ada kirim lagi
	}()
	for v := range ch {
		fmt.Println(v)
	}
	fmt.Println("selesai") // range berakhir karena close
}`,
            caption: "range berhenti sendiri setelah channel ditutup.",
          },
        },
        {
          kind: "code",
          title: "Range yang tidak pernah berakhir",
          prompt: "Program ini mencetak kuadrat, lalu berhenti dengan deadlock tanpa pernah mencetak kata `selesai`: loop `range` menunggu selamanya. Temukan satu kesalahannya dan perbaiki sampai semua tes lulus.",
          mode: "fix",
          template: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	hasil := make(chan int)
	go func() {
		for i := 1; i <= n; i++ {
			hasil <- i * i
		}
	}()
	for v := range hasil {
		fmt.Println(v)
	}
	fmt.Println("selesai")
}`,
          solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	hasil := make(chan int)
	go func() {
		defer close(hasil)
		for i := 1; i <= n; i++ {
			hasil <- i * i
		}
	}()
	for v := range hasil {
		fmt.Println(v)
	}
	fmt.Println("selesai")
}`,
          tests: [
            { stdin: "4", expectedOutput: "1\n4\n9\n16\nselesai" },
            { stdin: "1", expectedOutput: "1\nselesai" },
            { stdin: "6", expectedOutput: "1\n4\n9\n16\n25\n36\nselesai", hidden: true },
          ],
          hints: [
            "Perhatikan baris terakhir yang tidak pernah tercetak: range hanya berakhir kalau channel ditutup, dan pengirim di sini tidak pernah memberi sinyal selesai.",
            "Sinyal itu perlu dipanggil setelah loop kirim berakhir; defer menjadwalkannya tepat, bahkan jika terjadi panic.",
            "Jawabannya: tambahkan defer close(hasil) di awal fungsi goroutine.",
          ],
        },
      ],
    },
    {
      slug: "worker-pool-terurut",
      title: "Worker Pool Sederhana",
      summary: "Beberapa worker menarik tugas dari satu channel, hasil dikumpulkan terurut.",
      steps: [
        {
          kind: "theory",
          title: "Jumlah worker tetap, tugas mengalir",
          body: "Worker pool: sejumlah worker tetap menarik pekerjaan dari satu channel tugas. Jumlah goroutine tidak lagi mengikuti jumlah data; seratus ribu tugas dikerjakan oleh, misalnya, tiga worker yang sama. Skala kerja diatur dari satu angka, jumlah worker, bukan dari ledakan goroutine.\n\nRangkaiannya: channel tugas diisi lalu ditutup setelah semua tugas dikirim; worker menarik dengan `for i := range tugasCh` sehingga otomatis berhenti saat channel habis dan ditutup; WaitGroup menunggu semua worker keluar. Worker tidak perlu saling tahu, cukup tahu channel tugasnya.\n\nHasil kerja worker tidak berurutan, karena tidak ada yang menjamin tugas mana selesai duluan. Trik yang dipakai di latihan: tugas membawa indeksnya, hasil disimpan ke slice pada indeks yang sama, dan pencetakan menunggu semua worker selesai. Keluaran jadi terurut tanpa mengorbankan paralelisme.",
          code: {
            language: "go",
            content: `for w := 0; w < jumlahWorker; w++ {
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := range tugasCh {
			proses(i) // worker menarik tugas sampai habis
		}
	}()
}
// kirim semua tugas, lalu close(tugasCh) dan wg.Wait()`,
            caption: "Worker berhenti sendiri ketika channel tugas ditutup.",
          },
        },
        {
          kind: "code",
          title: "Tiga worker menghitung kuadrat",
          prompt: "Lengkapi worker pool: worker menarik indeks tugas dari channel, dan setelah semua tugas dikirim, channel tugas ditutup. Hasil disimpan per indeks sehingga cetakan terurut.",
          mode: "fill",
          template: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	tugas := make([]int, n)
	for i := range tugas {
		fmt.Scan(&tugas[i])
	}
	hasil := make([]string, n)
	tugasCh := make(chan int)
	var wg sync.WaitGroup
	for w := 0; w < 3; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := ___ tugasCh {
				hasil[i] = fmt.Sprintf("%d: %d", i, tugas[i]*tugas[i])
			}
		}()
	}
	for i := range tugas {
		tugasCh <- i
	}
	___(tugasCh)
	wg.Wait()
	for _, h := range hasil {
		fmt.Println(h)
	}
}`,
          solution: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	tugas := make([]int, n)
	for i := range tugas {
		fmt.Scan(&tugas[i])
	}
	hasil := make([]string, n)
	tugasCh := make(chan int)
	var wg sync.WaitGroup
	for w := 0; w < 3; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range tugasCh {
				hasil[i] = fmt.Sprintf("%d: %d", i, tugas[i]*tugas[i])
			}
		}()
	}
	for i := range tugas {
		tugasCh <- i
	}
	close(tugasCh)
	wg.Wait()
	for _, h := range hasil {
		fmt.Println(h)
	}
}`,
          tests: [
            { stdin: "3\n2 5 10", expectedOutput: "0: 4\n1: 25\n2: 100" },
            { stdin: "4\n1 2 3 4", expectedOutput: "0: 1\n1: 4\n2: 9\n3: 16" },
            { stdin: "2\n7 0", expectedOutput: "0: 49\n1: 0", hidden: true },
          ],
          hints: [
            "Worker menarik pekerjaan dengan mengiterasi channel tugas sampai habis.",
            "Setelah semua indeks tugas dikirim, beri sinyal selesai pada channel tugas.",
            "Jawabannya: range dan close.",
          ],
        },
      ],
    },
    {
      slug: "pipeline-satu-arah",
      title: "Pipeline Satu Arah",
      summary: "Tahapan terhubung channel, close berantai sampai ujung.",
      steps: [
        {
          kind: "theory",
          title: "Tahap demi tahap",
          body: "Pipeline memecah pengolahan menjadi tahapan yang terhubung channel: generator menghasilkan nilai, tahap berikutnya memproses dan meneruskan, tahap terakhir mengonsumsi. Tiap tahap berjalan serentak, dan channel direction di signature (`chan<-` keluar, `<-chan` masuk) membuat arah data terbaca dari tipe fungsi itu sendiri.\n\nclose berantai dari hulu: generator menutup channel keluarannya saat selesai; tahap tengah yang menarik dengan range ikut berakhir, lalu menutup channel keluarannya sendiri; begitu seterusnya sampai konsumen paling ujung melihat range-nya berakhir. Satu produsen per channel, satu penutup per channel: aturan yang menjaga rantai tetap aman.\n\nUntuk tahap yang berat, pola ini mudah dikombinasikan dengan worker pool: satu tahap dijalankan beberapa goroutine sekaligus. Yang belum dijawab pipeline sederhana ini adalah pembatalan di tengah jalan, ketika konsumen sudah tidak butuh data; itu pekerjaan context, di lesson berikutnya.",
          code: {
            language: "go",
            content: `func generator(keluar chan<- int) {
	defer close(keluar)
	for i := 1; i <= 5; i++ {
		keluar <- i
	}
}

func kuadrat(masuk <-chan int, keluar chan<- int) {
	defer close(keluar)
	for v := range masuk {
		keluar <- v * v
	}
}`,
            caption: "Arah data terbaca dari signature; tiap tahap menutup channel keluarannya.",
          },
        },
        {
          kind: "code",
          title: "Dua tahap: angka jadi kuadrat",
          prompt: "Lengkapi pipeline: tahap kuadrat membaca dari channel masukannya, dan main meneruskan channel angka ke tahap itu. Generator mengisi angka 1 sampai n, keluaran kuadratnya tercetak berurutan.",
          mode: "fill",
          template: `package main

import "fmt"

func generator(n int, keluar chan<- int) {
	defer close(keluar)
	for i := 1; i <= n; i++ {
		keluar <- i
	}
}

func kuadrat(masuk <-chan int, keluar chan<- int) {
	defer close(keluar)
	for v := range ___ {
		keluar <- v * v
	}
}

func main() {
	var n int
	fmt.Scan(&n)
	angka := make(chan int)
	hasil := make(chan int)
	go generator(n, angka)
	go kuadrat(___, hasil)
	for v := range hasil {
		fmt.Println(v)
	}
}`,
          solution: `package main

import "fmt"

func generator(n int, keluar chan<- int) {
	defer close(keluar)
	for i := 1; i <= n; i++ {
		keluar <- i
	}
}

func kuadrat(masuk <-chan int, keluar chan<- int) {
	defer close(keluar)
	for v := range masuk {
		keluar <- v * v
	}
}

func main() {
	var n int
	fmt.Scan(&n)
	angka := make(chan int)
	hasil := make(chan int)
	go generator(n, angka)
	go kuadrat(angka, hasil)
	for v := range hasil {
		fmt.Println(v)
	}
}`,
          tests: [
            { stdin: "3", expectedOutput: "1\n4\n9" },
            { stdin: "5", expectedOutput: "1\n4\n9\n16\n25" },
            { stdin: "1", expectedOutput: "1", hidden: true },
          ],
          hints: [
            "Tahap kuadrat membaca dari channel masukannya sendiri, bukan dari hasil.",
            "Generator mengisi channel pertama, dan channel itu yang diteruskan ke tahap berikutnya.",
            "Jawabannya: masuk dan angka.",
          ],
        },
      ],
    },
    {
      slug: "context-dasar",
      title: "Pembatalan dengan context",
      summary: "WithCancel, WithTimeout, dan ctx.Done() sebagai sinyal berhenti yang seragam.",
      steps: [
        {
          kind: "theory",
          title: "Cara standar menyuruh berhenti",
          body: "Program concurrent butuh cara berhenti lebih awal: klien menutup koneksi, permintaan kehabisan waktu, server dimatikan. Membuat channel done sendiri per kasus bisa, tapi cepat berulang dan tidak seragam. Package `context` bawaan menyeragamkannya: satu tipe `context.Context` yang dibawa fungsi sebagai parameter pertama, lazim dinamai `ctx`.\n\nContext dibuat berantai: `context.WithCancel(parent)` mengembalikan ctx dan fungsi `cancel()` untuk membatalkan; `context.WithTimeout(parent, d)` otomatis membatalkan setelah durasi habis. Di dalam goroutine, `ctx.Done()` adalah channel yang ditutup ketika pembatalan terjadi, dan select di atasnya membuat goroutine bisa berhenti di antara pekerjaan.\n\nPembatalannya kooperatif: context tidak memaksa goroutine apa pun berhenti. `cancel()` hanya menutup channel Done; goroutine yang rapi memantau, keluar, dan `ctx.Err()` menjelaskan sebabnya (`context.Canceled` atau `context.DeadlineExceeded`). Kontrak yang menyertai: pemanggil `WithCancel` atau `WithTimeout` wajib memanggil cancel, biasanya lewat `defer cancel()`, supaya sumber daya di balik context lepas.",
          code: {
            language: "go",
            content: `ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

select {
case hasil := <-kerjaCh:
	fmt.Println("selesai:", hasil)
case <-ctx.Done():
	fmt.Println("batal:", ctx.Err())
}`,
            caption: "ctx.Done() adalah channel yang ditutup saat timeout atau cancel.",
          },
        },
        {
          kind: "quiz",
          question: "Apa yang dikembalikan `ctx.Done()`?",
          options: [
            "bool true saat context dibatalkan",
            "Channel yang ditutup ketika pembatalan terjadi",
            "error berisi sebab pembatalan",
            "int penghitung sisa waktu",
          ],
          answer: 1,
          explanation:
            "Done() mengembalikan channel; ia ditutup ketika cancel dipanggil atau timeout habis. Sebabnya dibaca lewat ctx.Err(), bukan dari Done().",
        },
        {
          kind: "quiz",
          question: "Bagaimana goroutine yang benar berhenti ketika context dibatalkan?",
          options: [
            "Runtime Go memaksa goroutine berhenti otomatis",
            "Goroutine memantau ctx.Done() lewat select dan keluar sendiri (kooperatif)",
            "cancel() mengirim nilai nil ke semua goroutine",
            "Goroutine panik lalu di-recover pemanggil",
          ],
          answer: 1,
          explanation:
            "Pembatalan context selalu kooperatif: cancel hanya menutup channel Done, dan goroutine yang memantau memutuskan sendiri untuk keluar.",
        },
      ],
    },
    {
      slug: "latihan-concurrency",
      title: "Latihan Gabungan: Checksum Paralel",
      summary: "Goroutine per data, WaitGroup, dan hasil tercetak terurut.",
      steps: [
        {
          kind: "theory",
          title: "Paralel, tapi keluaran yang pasti",
          body: "Lesson penutup merangkai jalur modul ini: goroutine per data, WaitGroup, dan hasil yang dikumpulkan per indeks supaya tercetak terurut. Tugasnya checksum kecil: jumlah kode karakter tiap string, dimodulo 100. Input n string dihitung paralel, dan keluaran `i: checksum` tercetak berurutan berdasarkan indeks input.\n\nPerhatikan tiga kontrak yang membuat program ini aman: setiap goroutine menulis hanya ke `hasil[i]` miliknya sendiri; `wg.Done()` dijadwalkan dengan `defer` agar tetap terpanggil meski terjadi panic di tengah; dan pembacaan hasil menunggu `wg.Wait()`. Tanpa ketiganya, hasil bisa terbaca setengah jadi.\n\nPola ini fondasi pola yang lebih besar di modul berikutnya: worker pool, fan-out/fan-in, dan context. Bentuk dasarnya selalu sama: pecah pekerjaan, kumpulkan hasil di tempat yang aman, sinkronkan dengan WaitGroup atau channel, dan jaga keluaran yang bisa diprediksi.",
          code: {
            language: "go",
            content: `func checksum(s string) int {
	total := 0
	for _, c := range s {
		total += int(c)
	}
	return total % 100
}

// hasil[i] diisi goroutine milik indeks i
// main membaca hasil hanya setelah wg.Wait()`,
            caption: "Checksum untuk dihitung paralel; hasil disimpan per indeks, dibaca setelah sinkron.",
          },
        },
        {
          kind: "code",
          title: "Checksum paralel yang terurut",
          prompt: "Lengkapi dua bagian: sisa bagi pada perhitungan checksum, dan penurunan penghitung WaitGroup oleh tiap goroutine. Setiap string dihitung oleh goroutine sendiri, dan hasilnya tercetak berurutan.",
          mode: "fill",
          template: `package main

import (
	"fmt"
	"sync"
)

func checksum(s string) int {
	total := 0
	for _, c := range s {
		total += int(c)
	}
	return total ___ 100
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	hasil := make([]int, n)
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.___()
			hasil[i] = checksum(kata[i])
		}(i)
	}
	wg.Wait()
	for i, h := range hasil {
		fmt.Printf("%d: %d\\n", i, h)
	}
}`,
          solution: `package main

import (
	"fmt"
	"sync"
)

func checksum(s string) int {
	total := 0
	for _, c := range s {
		total += int(c)
	}
	return total % 100
}

func main() {
	var n int
	fmt.Scan(&n)
	kata := make([]string, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&kata[i])
	}
	hasil := make([]int, n)
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			hasil[i] = checksum(kata[i])
		}(i)
	}
	wg.Wait()
	for i, h := range hasil {
		fmt.Printf("%d: %d\\n", i, h)
	}
}`,
          tests: [
            { stdin: "3\nhi abc go", expectedOutput: "0: 9\n1: 94\n2: 14" },
            { stdin: "1\ngolang", expectedOutput: "0: 32" },
            { stdin: "2\nzz aa", expectedOutput: "0: 44\n1: 94", hidden: true },
          ],
          hints: [
            "Checksum didefinisikan sebagai sisa bagi dari total kode karakter.",
            "Tiap goroutine wajib menurunkan penghitung WaitGroup ketika selesai.",
            "Jawabannya: % dan Done.",
          ],
        },
      ],
    },
  ],
};
