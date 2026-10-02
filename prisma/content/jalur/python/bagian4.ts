import type { JalurBagian } from "../../types";

export const BAGIAN: JalurBagian = {
  lang: "python",
  moduleRange: [6, 7],
  modules: [
    {
      title: "File dan Data",
      description: "context manager, pathlib, csv, json, encoding, dan penanganan file besar.",
    },
    {
      title: "Stdlib yang Sering Dipakai Kerja",
      description: "datetime, collections, itertools, re, logging, dan argparse untuk CLI.",
    },
  ],
  lessons: [
    {
      slug: "membuka-file-dengan-with",
      title: "Membuka File dengan with",
      summary: "Buka file dengan aman memakai context manager, kenali mode r, w, dan a.",
      steps: [
        {
          kind: "theory",
          title: "open() dan context manager",
          body: "Untuk membaca atau menulis file, Python menyediakan fungsi `open`. Argumen pertama adalah alamat file, argumen kedua adalah mode: `\"r\"` untuk membaca (bawaan), `\"w\"` untuk menulis dari nol, dan `\"a\"` untuk menambah di akhir. Hasilnya sebuah objek file yang punya metode `read`, `readline`, dan `write`.\n\nObjek file harus ditutup setelah dipakai. Cara paling aman adalah `with`, yang menutup file otomatis begitu bloknya selesai, bahkan ketika terjadi error di tengah jalan. Pola ini disebut context manager dan dipakai hampir untuk semua operasi file di kode Python modern.\n\nDi latihan platform ini, `sys.stdin` dipakai untuk menyimulasikan isi file: data dikirim lewat stdin, dan `sys.stdin` pun berperilaku seperti file yang bisa diiterasi. Dengan begitu kamu bisa berlatih pola baca file tanpa menyentuh disk.",
          code: {
            language: "python",
            content:
              'with open("catatan.txt", "r", encoding="utf-8") as f:\n    for baris in f:\n        print(baris.rstrip())\n# file sudah tertutup otomatis di sini',
            caption: "for baris in f membaca file satu baris demi satu baris.",
          },
        },
        {
          kind: "quiz",
          question:
            "Apa yang terjadi pada file yang dibuka dengan `with open(...) as f:` ketika blok `with` selesai dijalankan?",
          options: [
            "Tetap terbuka sampai program selesai",
            "Tertutup otomatis, meski terjadi error di dalam blok",
            "Hanya tertutup jika kita memanggil f.close() secara manual",
            "File dihapus dari disk",
          ],
          answer: 1,
          explanation:
            "Context manager `with` menjamin `close()` dipanggil di akhir blok, termasuk saat exception terjadi. Itulah alasan pola ini lebih aman daripada open tanpa with.",
        },
        {
          kind: "code",
          title: "Baca file dengan nomor baris",
          prompt:
            "Anggap isi stdin adalah isi sebuah file. Baca baris demi baris dengan pola `with ... as f`, lalu cetak setiap baris berformat `<nomor>: <isi>`, dimulai dari 1. Tanda newline di akhir baris dibuang dengan `rstrip`.",
          mode: "fill",
          template:
            'import sys\n\n___ sys.stdin ___ f:\n    for no, baris in enumerate(f, start=1):\n        print(f"{no}: {baris.___()}")',
          solution:
            'import sys\n\nwith sys.stdin as f:\n    for no, baris in enumerate(f, start=1):\n        print(f"{no}: {baris.rstrip()}")',
          tests: [
            { stdin: "alfa\nbeta", expectedOutput: "1: alfa\n2: beta" },
            { stdin: "python\nts\nsql", expectedOutput: "1: python\n2: ts\n3: sql", hidden: true },
          ],
          hints: [
            "Pola context manager ditulis `with <objek> as <nama>:`.",
            "Metode yang membuang spasi dan newline di ujung kanan teks bernama rstrip.",
          ],
        },
      ],
    },
    {
      slug: "mode-tulis-file",
      title: "Menulis dan Menambah ke File",
      summary: "Kenali mode w dan a, dan celah kecil yang bikin data hilang.",
      steps: [
        {
          kind: "theory",
          title: "Mode w menghapus, mode a menambah",
          body: "Untuk menulis, mode file menentukan nasib isi lama. Mode `\"w\"` mengosongkan file begitu dibuka: seluruh isi lama hilang sebelum satu karakter pun ditulis. Mode `\"a\"` (append) menjaga isi lama dan menulis mulai dari akhir file. Mode `\"x\"` menolak membuat file jika nama itu sudah ada, berguna untuk mencegah timpa tak sengaja.\n\nMetode `write` menulis teks apa adanya, tanpa menambahkan newline. Kalau mau baris baru, sisipkan sendiri `\\n`. Untuk banyak baris sekaligus, `writelines` menerima iterable berisi teks, tapi tetap tanpa newline otomatis.\n\nKarena `write` tidak menambah baris, pola yang lazim adalah menulis per baris di dalam loop dengan `f.write(baris + \"\\n\")`. Dan satu kebiasaan wajib: selalu bungkus dengan `with` supaya data benar benar tersimpan dan file tertutup rapi.",
          code: {
            language: "python",
            content:
              'with open("log.txt", "a", encoding="utf-8") as f:\n    f.write("2026-10-01: proses mulai\\n")\n    f.write("2026-10-01: proses selesai\\n")\n\nwith open("log.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
            caption: "Mode a menjaga isi lama; dua write menghasilkan dua baris karena \\n ditulis manual.",
          },
        },
        {
          kind: "quiz",
          question:
            "Kamu ingin menambah baris baru di akhir `log.txt` tanpa menghapus isinya. Mode mana yang dipakai saat `open`?",
          options: ['"w"', '"a"', '"r"', '"x"'],
          answer: 1,
          explanation:
            "Mode `\"a\"` menambah di akhir file dan menjaga isi lama. Mode `\"w\"` justru mengosongkan file begitu dibuka.",
        },
        {
          kind: "quiz",
          question: "Berapa banyak karakter newline yang ditambahkan otomatis oleh `f.write(\"halo\")`?",
          options: [
            "Satu kali, otomatis seperti print",
            "Tidak sama sekali, teks ditulis apa adanya",
            "Dua kali karena mode tulis",
            "Tergantung sistem operasi",
          ],
          answer: 1,
          explanation:
            "`write` menulis persis teks yang diberikan, tanpa newline. `print` yang otomatis menambahkan; `write` tidak. Tambahkan `\\n` sendiri bila perlu.",
        },
      ],
    },
    {
      slug: "pathlib-dasar",
      title: "pathlib: Alamat File yang Rapi",
      summary: "Susun dan bedah lokasi file dengan Path, tanpa manipulasi string manual.",
      steps: [
        {
          kind: "theory",
          title: "Path sebagai objek",
          body: "Modul `pathlib` mengubah alamat file menjadi objek `Path`, sehingga bisa dibedah lewat atribut: `.name` (nama lengkap file), `.stem` (nama tanpa akhiran), `.suffix` (akhiran seperti `.csv`), dan `.parent` (foldernya). Jauh lebih aman daripada memotong string sendiri.\n\nMenyambung alamat pun rapi: operator `/` menggabungkan folder dan file dengan pemisah yang benar di Windows maupun Linux. Metode `.exists()` mengecek keberadaan, dan `.glob(\"*.csv\")` mencari file berpola di dalam folder.\n\nAtribut bedah seperti `.name` dan `.suffix` murni bekerja pada teks alamat, jadi tetap aman dipraktikkan lewat stdin tanpa menyentuh disk.",
          code: {
            language: "python",
            content:
              'from pathlib import Path\n\np = Path("data/2026/laporan.csv")\nprint(p.name)     # laporan.csv\nprint(p.stem)     # laporan\nprint(p.suffix)   # .csv\n\nbaru = Path("data") / "2026" / "ringkasan.txt"\nprint(baru.suffix)  # .txt',
            caption: "Operator / menyambung alamat, atribut name, stem, dan suffix membedahnya.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `Path("data/2026/laporan.csv").stem`?',
          options: ["laporan.csv", "laporan", "csv", "data/2026"],
          answer: 1,
          explanation:
            "`.stem` adalah nama file tanpa akhiran, yaitu laporan. `.name` memberi laporan.csv dan `.suffix` memberi .csv.",
        },
        {
          kind: "code",
          title: "Bedah alamat file",
          prompt:
            "Baca satu alamat file dari input, lalu cetak tiga baris: `stem: <stem>`, `suffix: <suffix>`, dan `jenis: csv` bila akhirannya `.csv`, atau `jenis: lain` untuk selain itu.",
          mode: "fill",
          template:
            'from pathlib import Path\n\np = Path(input())\nprint(f"stem: {p.___}")\nprint(f"suffix: {p.___}")\nif ___:\n    print("jenis: csv")\nelse:\n    print("jenis: lain")',
          solution:
            'from pathlib import Path\n\np = Path(input())\nprint(f"stem: {p.stem}")\nprint(f"suffix: {p.suffix}")\nif p.suffix == ".csv":\n    print("jenis: csv")\nelse:\n    print("jenis: lain")',
          tests: [
            { stdin: "data/2026/laporan.csv", expectedOutput: "stem: laporan\nsuffix: .csv\njenis: csv" },
            { stdin: "gambar/foto.png", expectedOutput: "stem: foto\nsuffix: .png\njenis: lain", hidden: true },
            { stdin: "arsip/nilai.xlsx", expectedOutput: "stem: nilai\nsuffix: .xlsx\njenis: lain", hidden: true },
          ],
          hints: [
            "Atribut Path untuk nama tanpa akhiran bernama stem, untuk akhiran bernama suffix.",
            "Perbandingan suffix dilakukan terhadap teks .csv, lengkap dengan titiknya.",
          ],
        },
      ],
    },
    {
      slug: "file-besar-baris-demi-baris",
      title: "Membaca File Besar",
      summary: "Proses file raksasa satu baris demi satu baris tanpa menghabiskan memori.",
      steps: [
        {
          kind: "theory",
          title: "Streaming, bukan memuat semua",
          body: "Cara membaca menentukan beban memori. `f.read()` dan `f.readlines()` menarik seluruh isi ke memori sekaligus; untuk file beberapa ratus MB, program bisa melambat atau kehabisan memori. Iterasi langsung pada objek file, `for baris in f:`, mengalirkan data: Python membaca sepotong (buffer), memberi satu baris, lalu bergerak ke baris berikutnya.\n\nPola streaming yang sehat mengagregasi sambil berjalan: simpan yang kecil (jumlah, nilai maksimum, akumulator), buang yang besar. Dengan begitu penggunaan memori tetap konstan berapa pun panjang filenya.\n\nDi latihan ini stdin berperan sebagai file besar. Baca dengan `for baris in sys.stdin` dan proses tiap baris begitu masuk. Ingat, setiap baris masih membawa `\\n` di ujungnya, jadi bersihkan dengan `rstrip(\"\\n\")` sebelum menghitung panjangnya.",
          code: {
            language: "python",
            content:
              'total = 0\nwith open("besar.log", encoding="utf-8") as f:\n    for baris in f:\n        total += len(baris.rstrip("\\n"))\nprint(total)',
            caption: "Agregasi sambil streaming: memori tetap hemat berapa pun besar filenya.",
          },
        },
        {
          kind: "quiz",
          question: "Membaca file 2 GB, pola mana yang menjaga penggunaan memori tetap kecil?",
          options: [
            "isi = f.read()",
            "baris_list = f.readlines()",
            "for baris in f: proses(baris)",
            'f.read() lalu dipecah dengan split("\\n")',
          ],
          answer: 2,
          explanation:
            "Iterasi objek file bersifat streaming: satu baris diproses lalu dilepas. `read()` dan `readlines()` menarik seluruh isi ke memori.",
        },
        {
          kind: "code",
          title: "Temukan baris terpanjang",
          prompt:
            "Anggap stdin adalah file log berukuran besar. Baca streaming, lalu cetak baris terpanjang berformat `baris <nomor>: <panjang> karakter`. Nomor dimulai dari 1, panjang dihitung tanpa newline. Bila ada yang sama panjang, baris paling awal yang menang.",
          mode: "fill",
          template:
            'import sys\n\nterbaik_no = 0\nterbaik_len = -1\nfor no, baris in ___(sys.stdin, start=1):\n    panjang = len(baris.___("\\n"))\n    if panjang > terbaik_len:\n        terbaik_no = no\n        terbaik_len = ___\nprint(f"baris {terbaik_no}: {terbaik_len} karakter")',
          solution:
            'import sys\n\nterbaik_no = 0\nterbaik_len = -1\nfor no, baris in enumerate(sys.stdin, start=1):\n    panjang = len(baris.rstrip("\\n"))\n    if panjang > terbaik_len:\n        terbaik_no = no\n        terbaik_len = panjang\nprint(f"baris {terbaik_no}: {terbaik_len} karakter")',
          tests: [
            { stdin: "kode\nbelajar python\ngitu", expectedOutput: "baris 2: 14 karakter" },
            { stdin: "satu", expectedOutput: "baris 1: 4 karakter", hidden: true },
            { stdin: "ab\nab\nabc", expectedOutput: "baris 3: 3 karakter", hidden: true },
          ],
          hints: [
            "enumerate(sys.stdin, start=1) memberi nomor baris sekaligus isinya.",
            "Karena pembandingnya > (bukan >=), rekor hanya berganti saat benar benar lebih panjang, dan yang pertama tetap menang.",
          ],
        },
      ],
    },
    {
      slug: "csv-membaca",
      title: "Membaca CSV",
      summary: "Bedah data tabular dengan csv.reader, dari header sampai kolom hitungan.",
      steps: [
        {
          kind: "theory",
          title: "csv.reader: baris jadi list",
          body: "CSV menyimpan tabel sebagai teks: satu baris satu record, kolom dipisah koma. Mengandalkan `split(\",\")` memang bisa, tapi modul `csv` lebih aman karena mengerti aturan quoting: nilai yang mengandung koma dibungkus tanda kutip dan tidak boleh dipecah.\n\n`csv.reader` menerima objek yang bisa diiterasi (termasuk file hasil `open` atau `sys.stdin`) dan menghasilkan list string per baris. Baris pertama biasanya judul kolom; lewati dengan `next(reader)` sebelum loop data. Butuh pemisah lain? Beri argumen `delimiter=\";\"`.\n\nAngka yang keluar dari CSV bertipe `str`. Konversi dengan `int` atau `float` sebelum dihitung; ini sumber bug klasik ketika dua harga malah digabung seperti teks.",
          code: {
            language: "python",
            content:
              'import csv\n\nwith open("penjualan.csv", encoding="utf-8") as f:\n    reader = csv.reader(f)\n    header = next(reader)  # ["produk", "qty", "harga"]\n    for baris in reader:\n        print(baris[0], int(baris[1]) * int(baris[2]))',
            caption: "next(reader) melompati baris judul; kolom angka dikonversi sebelum dihitung.",
          },
        },
        {
          kind: "quiz",
          question: "Setiap iterasi pada `csv.reader` menghasilkan satu baris dalam bentuk apa?",
          options: [
            "dict dengan kunci dari header",
            "list berisi string per kolom",
            "satu string utuh",
            "objek khusus milik modul csv",
          ],
          answer: 1,
          explanation:
            "`csv.reader` menghasilkan list string. Untuk dict dengan kunci dari header, gunakan `csv.DictReader`.",
        },
        {
          kind: "code",
          title: "Hitung total per produk",
          prompt:
            "Stdin berisi CSV dengan header `produk,qty,harga` lalu baris data. Lewati header, lalu untuk tiap produk cetak `<produk>: <qty * harga>`.",
          mode: "fill",
          template:
            'import csv\nimport sys\n\nreader = csv.___(sys.stdin)\n___(reader)  # lewati baris judul\nfor baris in reader:\n    if not baris:\n        continue\n    nama, qty, harga = baris\n    print(f"{nama}: {___}")',
          solution:
            'import csv\nimport sys\n\nreader = csv.reader(sys.stdin)\nnext(reader)  # lewati baris judul\nfor baris in reader:\n    if not baris:\n        continue\n    nama, qty, harga = baris\n    print(f"{nama}: {int(qty) * int(harga)}")',
          tests: [
            { stdin: "produk,qty,harga\nBuku,3,5000\nPensil,10,2000", expectedOutput: "Buku: 15000\nPensil: 20000" },
            { stdin: "produk,qty,harga\nTas,2,75000", expectedOutput: "Tas: 150000", hidden: true },
            {
              stdin: "produk,qty,harga\nCokelat,7,3500\nTipex,4,15000",
              expectedOutput: "Cokelat: 24500\nTipex: 60000",
              hidden: true,
            },
          ],
          hints: [
            "Fungsi pembacanya bernama csv.reader; untuk melompati satu baris, panggil next(reader).",
            "qty dan harga masih string; ubah dengan int() sebelum dikalikan.",
          ],
        },
      ],
    },
    {
      slug: "csv-menulis",
      title: "Menulis CSV",
      summary: "Tulis CSV yang benar dengan csv.writer dan baca ulang dengan DictReader.",
      steps: [
        {
          kind: "theory",
          title: "csv.writer dan newline kosong",
          body: "Pasangan dari `csv.reader` adalah `csv.writer`. Berikan list lewat `writerow`, atau list berisi list lewat `writerows`, dan modul csv yang mengurus pemisah serta quoting: nilai yang mengandung koma otomatis dibungkus kutip ganda.\n\nSaat membuka file untuk menulis CSV, pola yang disarankan dokumentasi adalah `open(nama, \"w\", newline=\"\")`. Tanpa `newline=\"\"`, di Windows bisa muncul baris kosong berselang, karena newline ditulis dua lapis: satu dari modul csv, satu lagi dari `open`.\n\nUntuk membaca CSV sebagai dict per baris, pakai `csv.DictReader`: baris pertama otomatis menjadi kunci, tiap baris berikutnya menjadi `dict` bernilai string, diakses misalnya `row[\"harga\"]`.",
          code: {
            language: "python",
            content:
              'import csv\n\nwith open("hasil.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.writer(f)\n    writer.writerow(["nama", "skor"])\n    writer.writerows([["Ayu", 90], ["Bima", 75]])\n\nwith open("hasil.csv", encoding="utf-8") as f:\n    for row in csv.DictReader(f):\n        print(row["nama"], row["skor"])',
            caption: "writerow untuk satu baris, writerows untuk banyak; DictReader mengembalikan dict per baris.",
          },
        },
        {
          kind: "quiz",
          question:
            'Mengapa file CSV yang ditulis sebaiknya dibuka dengan `open(nama, "w", newline="")`?',
          options: [
            "Supaya ukuran filenya lebih kecil",
            "Agar penanganan baris diserahkan ke modul csv, mencegah baris kosong ganda terutama di Windows",
            "Karena wajib untuk semua jenis file",
            "Supaya file langsung terkompresi",
          ],
          answer: 1,
          explanation:
            "Tanpa `newline=\"\"`, newline bisa tertulis ganda pada sebagian platform dan CSV jadi berselang baris kosong. Modul csv ingin mengatur barisnya sendiri.",
        },
        {
          kind: "quiz",
          question: 'Dengan `csv.DictReader` dan header `nama,harga`, apa tipe `row["harga"]` untuk baris `Ayu,90`?',
          options: [
            "int bernilai 90",
            'str bernilai "90"',
            "float bernilai 90.0",
            "list berisi satu angka",
          ],
          answer: 1,
          explanation:
            "DictReader menghasilkan dict bernilai string untuk semua kolom. Konversi dengan int atau float sebelum dihitung.",
        },
      ],
    },
    {
      slug: "json-load-dump",
      title: "JSON: Jembatan Data",
      summary: "Ubah bolak balik antara teks JSON dan objek Python dengan modul json.",
      steps: [
        {
          kind: "theory",
          title: "loads, dumps, load, dump",
          body: "JSON adalah format pertukaran data paling umum. Python memetakannya langsung: object JSON menjadi `dict`, array menjadi `list`, `true` dan `false` menjadi `True` dan `False`, dan `null` menjadi `None`.\n\nEmpat fungsi `json` yang sering dipakai: `json.loads` mengubah string JSON menjadi objek Python (s di akhir berarti string), `json.dumps` sebaliknya. Versi tanpa s, yaitu `json.load` dan `json.dump`, bekerja langsung dengan objek file. Argumen `indent=2` pada `dumps` membuat keluaran menjorok dan enak dibaca.\n\nSatu catatan sintaks: JSON mewajibkan kutip ganda untuk nama kunci dan string. `{'nama': 'Ayu'}` bukan JSON sah dan akan membuat `loads` melempar `json.JSONDecodeError`.",
          code: {
            language: "python",
            content:
              "import json\n\nteks = '{\"nama\": \"Ayu\", \"skor\": 90}'\ndata = json.loads(teks)\nprint(data[\"skor\"])          # 90\n\ndata[\"skor\"] += 5\nprint(json.dumps(data))      # {\"nama\": \"Ayu\", \"skor\": 95}\nprint(json.dumps(data, indent=2))",
            caption: "loads untuk masuk, dumps untuk keluar; indent membuat hasil terbaca manusia.",
          },
        },
        {
          kind: "quiz",
          question: "Fungsi mana yang mengubah string JSON menjadi objek Python?",
          options: ["json.load", "json.loads", "json.dumps", "json.decode"],
          answer: 1,
          explanation:
            "`json.loads` menerima string (s = string). `json.load` untuk objek file, dan `json.dumps` untuk ke arah sebaliknya.",
        },
        {
          kind: "code",
          title: "Ringkas nilai dari JSON",
          prompt:
            'Stdin berisi satu baris JSON berbentuk {"nama": "...", "nilai": [angka, ...]}. Cetak namanya, lalu baris `rata: <rata-rata>` dengan dua angka desimal.',
          mode: "fill",
          template:
            'import json\nimport sys\n\ndata = json.___(sys.stdin.readline())\nprint(data["___"])\nrata = ___(data["nilai"]) / len(data["nilai"])\nprint(f"rata: {rata:.2f}")',
          solution:
            'import json\nimport sys\n\ndata = json.loads(sys.stdin.readline())\nprint(data["nama"])\nrata = sum(data["nilai"]) / len(data["nilai"])\nprint(f"rata: {rata:.2f}")',
          tests: [
            { stdin: '{"nama": "Ayu", "nilai": [80, 90, 100]}', expectedOutput: "Ayu\nrata: 90.00" },
            { stdin: '{"nama": "Bima", "nilai": [70, 75]}', expectedOutput: "Bima\nrata: 72.50", hidden: true },
            { stdin: '{"nama": "Cika", "nilai": [100]}', expectedOutput: "Cika\nrata: 100.00", hidden: true },
          ],
          hints: [
            "Untuk string JSON, fungsi yang tepat adalah json.loads.",
            "Total nilai dihitung dengan sum() sebelum dibagi len().",
          ],
        },
      ],
    },
    {
      slug: "json-bersarang-akses-aman",
      title: "JSON Bersarang dan Akses Aman",
      summary: "Jelajahi data bersarang tanpa tersandung KeyError.",
      steps: [
        {
          kind: "theory",
          title: "get() dengan nilai cadangan",
          body: "Data JSON nyata biasanya bersarang: dict di dalam dict, list di dalam dict. Akses berantai seperti `data[\"user\"][\"alamat\"][\"kota\"]` berjalan cepat, tapi satu kunci hilang langsung melempar `KeyError` dan program berhenti.\n\nMetode `.get(kunci, bawaan)` adalah bantalan: kalau kunci ada isinya yang dikembalikan, kalau tidak, nilai cadangan yang dipakai. Untuk struktur bersarang, rantai get-nya: `data.get(\"user\", {}).get(\"alamat\", {}).get(\"kota\")` menghasilkan `None` tanpa error bila jalurnya putus.\n\nHati hati membedakan `None` dari nilai kosong yang sah: nilai `0` atau `\"\"` tetap ada di data, jadi cek kehadiran dengan `is None`, bukan sekadar kebenaran.",
          code: {
            language: "python",
            content:
              'import json\n\ndata = json.loads(\'{"user": {"nama": "Ayu"}, "tag": ["python", "data"]}\')\n\nprint(data["user"]["nama"])                            # Ayu\nprint(data.get("alamat", {}).get("kota", "tidak ada")) # tidak ada\nprint(data.get("tag", [])[0])                          # python',
            caption: "Rantai get dengan bawaan {} membuat akses bersarang tidak pernah meledak.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `data.get("x", {})` bila kunci `x` tidak ada di `data`?',
          options: ["Melempar KeyError", "Dict kosong {}", "None", 'String "x"'],
          answer: 1,
          explanation:
            "Argumen kedua `.get` adalah nilai cadangan, jadi hasilnya {}. Tanpa argumen kedua, `.get` mengembalikan None.",
        },
        {
          kind: "code",
          title: "Baca nilai dengan aman",
          prompt:
            "Stdin berisi satu baris JSON. Ambil `mahasiswa.nama`, lalu `mahasiswa.nilai.python`. Bila salah satu jalur tidak ada, pakai nilai cadangan: nama menjadi `tanpa nama`, dan baris kedua menjadi `python: belum ada`.",
          mode: "fill",
          template:
            "import json\nimport sys\n\ndata = json.loads(sys.stdin.readline())\nmhs = data.___(\"mahasiswa\", {})\nprint(mhs.___(\"nama\", \"tanpa nama\"))\nskor = mhs.get(\"nilai\", {}).___(\"python\")\nprint(f\"python: {skor if skor is not None else 'belum ada'}\")",
          solution:
            "import json\nimport sys\n\ndata = json.loads(sys.stdin.readline())\nmhs = data.get(\"mahasiswa\", {})\nprint(mhs.get(\"nama\", \"tanpa nama\"))\nskor = mhs.get(\"nilai\", {}).get(\"python\")\nprint(f\"python: {skor if skor is not None else 'belum ada'}\")",
          tests: [
            { stdin: '{"mahasiswa": {"nama": "Ayu", "nilai": {"python": 90}}}', expectedOutput: "Ayu\npython: 90" },
            { stdin: '{"mahasiswa": {"nama": "Bima"}}', expectedOutput: "Bima\npython: belum ada", hidden: true },
            { stdin: '{"mahasiswa": {"nilai": {"python": 0}}}', expectedOutput: "tanpa nama\npython: 0", hidden: true },
          ],
          hints: [
            ".get(kunci, bawaan) mengembalikan bawaan bila kunci tidak ada.",
            "Untuk skor yang memang 0, cek kehadiran dengan is not None agar tidak salah dianggap hilang.",
          ],
        },
      ],
    },
    {
      slug: "encoding-utf8",
      title: "Encoding dan UTF-8",
      summary: "Kenali bytes, str, dan jebakan encoding yang sering muncul lintas sistem.",
      steps: [
        {
          kind: "theory",
          title: "str, bytes, dan utf-8",
          body: "Objek `str` di Python menyimpan karakter Unicode, bukan byte. Supaya bisa disimpan ke file atau dikirim lewat jaringan, string di encode menjadi `bytes`. Sebaliknya, bytes di decode menjadi str. Pasangan fungsinya: `teks.encode(\"utf-8\")` dan `b.decode(\"utf-8\")`.\n\nUTF-8 memakai panjang variabel: huruf ASCII satu byte, karakter lain dua sampai empat byte. Contohnya `\\u2713` (tanda centang) adalah satu karakter tapi tiga byte UTF-8. Karena itu `len(teks)` dan `len(teks.encode(\"utf-8\"))` bisa berbeda.\n\nSumber bug klasik: `open()` tanpa argumen `encoding` mengikuti pengaturan lokal sistem. Di banyak mesin Linux itu berarti UTF-8, di Windows bisa bukan, sehingga file yang enak dibaca di satu tempat meledak di tempat lain. Kebiasaan aman: selalu tulis `encoding=\"utf-8\"` secara eksplisit, dan bila data dari luar tidak terkendali, saring dengan `errors=\"replace\"` agar karakter rusak tidak menghentikan program.",
          code: {
            language: "python",
            content:
              'teks = "Halo \\u2713"\nb = teks.encode("utf-8")\n\nprint(len(teks))          # 6 karakter\nprint(len(b))             # 8 byte\nprint(b)                  # b\'Halo \\xe2\\x9c\\x93\'\nprint(b.decode("utf-8"))  # kembali menjadi str',
            caption: "Satu karakter bisa berupa lebih dari satu byte; itu normal di UTF-8.",
          },
        },
        {
          kind: "quiz",
          question: "Apa risiko memakai `open(nama)` tanpa argumen `encoding`?",
          options: [
            "Python selalu memakai UTF-8, jadi tidak ada risiko",
            "Encoding mengikuti pengaturan lokal sistem dan bisa berbeda antar mesin",
            "File otomatis terenkripsi",
            "Python mendeteksi encoding dari isi file",
          ],
          answer: 1,
          explanation:
            "Tanpa encoding eksplisit, Python memakai locale bawaan platform, dan itu berbeda antar sistem. Tulis selalu `encoding=\"utf-8\"`.",
        },
        {
          kind: "quiz",
          question: 'Berapa byte yang dihasilkan `"\\u2713".encode("utf-8")`?',
          options: ["1 byte karena hanya satu karakter", "2 byte", "3 byte", "4 byte"],
          answer: 2,
          explanation:
            "Karakter di luar ASCII biasanya 2 sampai 4 byte di UTF-8; tanda centang U+2713 memakai 3 byte.",
        },
      ],
    },
    {
      slug: "parser-mini-gabungan",
      title: "Latihan Gabungan: Parser Mini",
      summary: "Saring baris kotor, parse CSV, dan agregasi: rangkuman seluruh modul ini.",
      steps: [
        {
          kind: "theory",
          title: "Pola parser yang tahan banting",
          body: "Data nyata jarang rapi: ada baris komentar yang diawali `#`, baris kosong, dan spasi liar di pinggir. Parser yang baik menjalankan pola tetap: bersihkan tiap baris dengan `strip()`, buang yang kosong atau komentar dengan `continue`, lalu parse yang bersih.\n\nSetelah parsing, agregasi biasanya memakai dict: `total[kategori] = total.get(kategori, 0) + nilai`. Teknik `get` dengan bawaan `0` menggantikan pengecekan kunci secara eksplisit.\n\nLangkah terakhir yang sering dilupakan: urutkan sebelum mencetak. `sorted(total)` menghasilkan kunci terurut sehingga keluaran bisa dibandingkan dan diuji. Tiga fase ini, saring, parse, agregasi, adalah kerangka hampir semua skrip pengolah data.",
          code: {
            language: "python",
            content:
              'for baris in sys.stdin:\n    bersih = baris.strip()\n    if not bersih or bersih.startswith("#"):\n        continue  # lewati baris kosong dan komentar\n    proses(bersih)',
            caption: "Gerbang pertama parser: bersihkan, lalu buang yang tidak layak.",
          },
        },
        {
          kind: "quiz",
          question: "Dalam parser, apa fungsi `if not bersih: continue`?",
          options: [
            "Menghapus spasi di tengah teks",
            "Melewatkan baris yang setelah dibersihkan ternyata kosong",
            "Menghentikan seluruh program",
            "Mengubah baris menjadi huruf kecil",
          ],
          answer: 1,
          explanation:
            "`not bersih` bernilai True saat string kosong. `continue` melompat ke baris berikutnya, jadi baris kosong tidak ikut diparse.",
        },
        {
          kind: "code",
          title: "Parser nilai dengan komentar",
          prompt:
            "Stdin berisi data penjualan yang kotor: baris komentar diawali `#`, ada baris kosong, dan baris pertama yang sah adalah header `kategori,nilai` yang harus dilewati. Jumlahkan nilai per kategori, lalu cetak `<kategori>: <total>` terurut abjad.",
          mode: "fill",
          template:
            'import sys\n\ntotal = {}\nheader_dilewati = False\nfor baris in sys.stdin:\n    bersih = baris.___()\n    if not bersih or bersih.startswith("#"):\n        ___\n    if not header_dilewati:\n        header_dilewati = True\n        continue\n    kategori, nilai = bersih.split(",")\n    total[kategori] = total.___(kategori, 0) + int(nilai)\nfor k in sorted(total):\n    print(f"{k}: {total[k]}")',
          solution:
            'import sys\n\ntotal = {}\nheader_dilewati = False\nfor baris in sys.stdin:\n    bersih = baris.strip()\n    if not bersih or bersih.startswith("#"):\n        continue\n    if not header_dilewati:\n        header_dilewati = True\n        continue\n    kategori, nilai = bersih.split(",")\n    total[kategori] = total.get(kategori, 0) + int(nilai)\nfor k in sorted(total):\n    print(f"{k}: {total[k]}")',
          tests: [
            {
              stdin: "# data penjualan\nkategori,nilai\nelektronik,100\nbuku,40\nelektronik,60\n\nbuku,20",
              expectedOutput: "buku: 60\nelektronik: 160",
            },
            { stdin: "kategori,nilai\nmakanan,5", expectedOutput: "makanan: 5", hidden: true },
            {
              stdin: "# komentar\nkategori,nilai\nmainan,3\n# komentar lagi\nmainan,4\nbuku,1",
              expectedOutput: "buku: 1\nmainan: 7",
              hidden: true,
            },
          ],
          hints: [
            "strip() membersihkan spasi dan newline di pinggir; continue melompat ke baris berikutnya.",
            "total.get(kategori, 0) mulai dari 0 bila kategori belum ada di dict.",
          ],
        },
      ],
    },
    {
      slug: "datetime-parsing-format",
      title: "datetime: Parsing dan Format",
      summary: "Ubah teks tanggal menjadi objek datetime, lalu format ulang sesuai kebutuhan.",
      steps: [
        {
          kind: "theory",
          title: "strptime dan strftime",
          body: "Modul `datetime` mengubah tanggal dari teks menjadi objek dan sebaliknya. `datetime.strptime(teks, format)` mem parsing teks sesuai pola, sedangkan `strftime(format)` memformat objek menjadi teks. Ingat arahnya: p di strptime berarti parsing, f di strftime berarti formatting.\n\nKode format yang sering dipakai: `%d` tanggal, `%m` bulan, `%Y` tahun empat digit, `%H` jam, `%M` menit. Untuk tanggal ISO seperti `2026-01-05`, jangan repot repot: `date.fromisoformat()` langsung mengenalinya.\n\nNama hari dan bulan dari `%A` atau `%B` mengikuti locale sistem, jadi tidak stabil untuk keluaran program. Kalau butuh nama hari dalam bahasa tertentu, siapkan list sendiri dan ambil indeksnya dari `weekday()`, yang mengembalikan 0 untuk Senin sampai 6 untuk Minggu.",
          code: {
            language: "python",
            content:
              'from datetime import datetime, date\n\nd = datetime.strptime("17/08/1945", "%d/%m/%Y")\nprint(d.year)                     # 1945\nprint(d.strftime("%d/%m/%Y"))     # 17/08/1945\n\nhari_id = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]\niso = date.fromisoformat("2026-01-01")\nprint(hari_id[iso.weekday()])     # Kamis',
            caption: "Parsing dengan pola, formatting dengan kode format; nama hari diatur sendiri agar konsisten.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa yang terjadi saat `datetime.strptime("2026-03-01", "%d/%m/%Y")` dijalankan?',
          options: [
            "Berhasil, hasilnya objek datetime",
            "Melempar ValueError karena teks tidak cocok dengan pola",
            "Mengembalikan None",
            "Mengembalikan string aslinya",
          ],
          answer: 1,
          explanation:
            "strptime bersifat ketat: teks `2026-03-01` tidak cocok dengan pola `%d/%m/%Y`, sehingga melempar ValueError. Pola harus persis, termasuk pemisahnya.",
        },
        {
          kind: "code",
          title: "Format ulang tanggal",
          prompt:
            "Baca satu tanggal ISO `YYYY-MM-DD` dari input, lalu cetak `<DD/MM/YYYY> <nama hari>` dengan nama hari Indonesia dari list yang sudah disediakan.",
          mode: "fill",
          template:
            "from datetime import date\n\nhari_id = [\"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\", \"Minggu\"]\nd = date.___(input())\nprint(f\"{d.strftime('%d/___/%Y')} {hari_id[d.___()]}\")",
          solution:
            "from datetime import date\n\nhari_id = [\"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\", \"Minggu\"]\nd = date.fromisoformat(input())\nprint(f\"{d.strftime('%d/%m/%Y')} {hari_id[d.weekday()]}\")",
          tests: [
            { stdin: "2026-01-01", expectedOutput: "01/01/2026 Kamis" },
            { stdin: "1945-08-17", expectedOutput: "17/08/1945 Jumat" },
            { stdin: "2026-12-25", expectedOutput: "25/12/2026 Jumat", hidden: true },
          ],
          hints: [
            "Untuk teks ISO YYYY-MM-DD, date.fromisoformat adalah jalan terpendek.",
            "weekday() mengembalikan 0 untuk Senin sampai 6 untuk Minggu; pas untuk indeks list hari_id.",
          ],
        },
      ],
    },
    {
      slug: "timedelta-aritmetika",
      title: "timedelta: Aritmetika Tanggal",
      summary: "Kurangi dan tambahkan tanggal; Python mengurus rollover bulan dan tahun.",
      steps: [
        {
          kind: "theory",
          title: "Tanggal minus tanggal, tanggal plus durasi",
          body: "Selisih dua objek `date` atau `datetime` menghasilkan `timedelta`, durasi dengan atribut `days`, `seconds`, dan `total_seconds()`. Sebaliknya, tanggal ditambah `timedelta` menghasilkan tanggal baru. Dua arah ini menutup hampir semua kebutuhan hitungan tenggat, jatuh tempo, dan umur.\n\nYang membuat `timedelta` nyaman: ia mengurus rollover. `date(2026, 1, 31) + timedelta(days=1)` menghasilkan `2026-02-01`, bukan tanggal mustahil `2026-02-31`. Tahun kabisat juga sudah ditangani.\n\nPerhatikan tipe hasilnya: `d2 - d1` bukan angka melainkan objek `timedelta`. Ambil `.days` untuk jumlah hari utuh, atau `total_seconds()` untuk presisi saat bekerja dengan `datetime` berjam jam menit.",
          code: {
            language: "python",
            content:
              "from datetime import date, timedelta\n\nhari_ini = date(2026, 10, 1)\njatuh_tempo = hari_ini + timedelta(days=30)\nprint(jatuh_tempo)                      # 2026-10-31\n\nselisih = date(2026, 12, 31) - hari_ini\nprint(selisih)                          # 91 days, 0:00:00\nprint(selisih.days)                     # 91",
            caption: "Plus durasi untuk maju, minus tanggal untuk selisih; .days mengambil angka utuhnya.",
          },
        },
        {
          kind: "quiz",
          question: "Apa hasil `date(2026, 1, 31) + timedelta(days=1)`?",
          options: [
            "Error karena 31 Januari tidak punya besok di bulan yang sama",
            "2026-01-32",
            "2026-02-01",
            "2026-02-31",
          ],
          answer: 2,
          explanation: "timedelta mengurus rollover antar bulan: sehari setelah 31 Januari adalah 1 Februari.",
        },
        {
          kind: "quiz",
          question: "Tipe hasil `d2 - d1` untuk dua objek `date` adalah?",
          options: [
            "int, langsung jumlah hari",
            "str berformat tertentu",
            "timedelta, ambil .days untuk jumlah hari",
            "date baru",
          ],
          answer: 2,
          explanation: "Selisih tanggal menghasilkan objek timedelta. Untuk angka hari utuhnya, akses atribut .days.",
        },
      ],
    },
    {
      slug: "counter-hitung-frekuensi",
      title: "Counter: Menghitung Frekuensi",
      summary: "Hitung kemunculan item dan ambil yang teratas tanpa loop manual.",
      steps: [
        {
          kind: "theory",
          title: "Counter: dict penghitung siap pakai",
          body: "`collections.Counter` dibangun khusus untuk satu pekerjaan: menghitung. Berikan iterable, dan dia mengembalikan dict di mana kunci adalah item dan nilai adalah jumlah kemunculannya. Tiga baris Counter menggantikan loop penghitung yang biasanya lima sampai tujuh baris.\n\nDua perilaku praktis: akses kunci yang tidak ada mengembalikan `0`, bukan `KeyError`; dan `most_common(n)` mengembalikan `n` pasangan `(item, jumlah)` teratas, terurut jumlah terbanyak dulu.\n\nUntuk urutan yang sepenuhnya menentu, misalnya seri ketika jumlah kembar, gabungkan `sorted` dengan kunci sendiri: `key=lambda kv: (-kv[1], kv[0])`, artinya jumlah menurun lalu nama menaik.",
          code: {
            language: "python",
            content:
              'from collections import Counter\n\nkata = "a b a c a b".split()\nhitung = Counter(kata)\n\nprint(hitung)                    # Counter({\'a\': 3, \'b\': 2, \'c\': 1})\nprint(hitung["z"])               # 0, tidak error\nprint(hitung.most_common(2))     # [(\'a\', 3), (\'b\', 2)]',
            caption: "most_common mengurutkan jumlah terbanyak dulu; seri mengikuti urutan kemunculan pertama.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `Counter(["a"])["z"]` untuk kunci yang tidak ada?',
          options: ["Melempar KeyError", "0", "None", "1"],
          answer: 1,
          explanation:
            "Counter mengembalikan 0 untuk kunci yang belum tercatat, karena kelakuannya seperti dict penghitung, bukan pencarian biasa.",
        },
        {
          kind: "code",
          title: "Rekap kata terurut",
          prompt:
            "Baca satu baris kata dari input. Cetak rekap `<kata>: <jumlah>` untuk semua kata, terurut jumlah terbanyak dulu; bila seri, urut abjad.",
          mode: "fill",
          template:
            "from collections import Counter\nimport sys\n\nhitung = ___(sys.stdin.read().split())\nfor kata, n in sorted(hitung.items(), key=lambda kv: (-kv[1], ___)):\n    print(f\"{kata}: {n}\")",
          solution:
            "from collections import Counter\nimport sys\n\nhitung = Counter(sys.stdin.read().split())\nfor kata, n in sorted(hitung.items(), key=lambda kv: (-kv[1], kv[0])):\n    print(f\"{kata}: {n}\")",
          tests: [
            { stdin: "apel jeruk apel pisang apel", expectedOutput: "apel: 3\njeruk: 1\npisang: 1" },
            { stdin: "b a b a c", expectedOutput: "a: 2\nb: 2\nc: 1", hidden: true },
            { stdin: "satu", expectedOutput: "satu: 1", hidden: true },
          ],
          hints: [
            "Counter menerima iterable apa pun; sys.stdin.read().split() memberi daftar kata.",
            "Kunci -kv[1] membalik urutan jumlah; kv[0] mengurutkan nama untuk seri.",
          ],
        },
      ],
    },
    {
      slug: "defaultdict-namedtuple",
      title: "defaultdict dan namedtuple",
      summary: "Kelompokkan data tanpa cek kunci, dan bungkus record kecil dengan nama field.",
      steps: [
        {
          kind: "theory",
          title: "Dua helper collections yang menghemat kode",
          body: "`defaultdict(tipe)` adalah dict yang otomatis membuat nilai bawaan saat kunci baru diakses. `defaultdict(list)` langsung memberi list kosong, sehingga pola pengelompokan menjadi satu baris: `kelompok[kunci].append(nilai)`. Dengan dict biasa, kamu perlu cek dulu apakah kunci sudah ada.\n\nPilihan bawaan mengikuti argumennya: `defaultdict(int)` memberi `0` (enak untuk penghitung), `defaultdict(list)` memberi list kosong (enak untuk mengelompokkan), dan `defaultdict(set)` memberi set kosong (enak untuk keanggotaan unik).\n\n`namedtuple` membuat class record mini: sekali didefinisikan `Pegawai = namedtuple(\"Pegawai\", [\"nama\", \"divisi\"])`, tiap instance bisa dibaca lewat nama field seperti `p.nama`, dan tetap kompatibel dengan tuple biasa. Cocok untuk data yang hanya dibaca, sebelum kamu benar benar butuh `@dataclass` penuh.",
          code: {
            language: "python",
            content:
              'from collections import defaultdict, namedtuple\n\nkelompok = defaultdict(list)\nkelompok["A"].append("Ayu")\nkelompok["B"].append("Bima")\nprint(dict(kelompok))          # {\'A\': [\'Ayu\'], \'B\': [\'Bima\']}\n\nPegawai = namedtuple("Pegawai", ["nama", "divisi"])\np = Pegawai("Cika", "data")\nprint(p.nama, p.divisi)        # Cika data\nprint(p[0])                    # Cika, masih bisa diakses seperti tuple',
            caption: "defaultdict menghilangkan cek kunci; namedtuple memberi nama pada posisi tuple.",
          },
        },
        {
          kind: "quiz",
          question: '`d = defaultdict(int)` lalu `d["baru"]` diakses untuk pertama kali, apa hasilnya?',
          options: ["KeyError karena kunci belum ada", "0", "None", 'String kosong ""'],
          answer: 1,
          explanation: "defaultdict memanggil tipe yang diberikan untuk kunci baru; `int()` menghasilkan 0.",
        },
        {
          kind: "quiz",
          question: "Keunggulan utama `namedtuple` dibanding tuple biasa?",
          options: [
            "Akses lewat nama field, seperti p.nama",
            "Isinya bisa diubah",
            "Otomatis tersortir",
            'Bisa diakses seperti dict lewat p["nama"]',
          ],
          answer: 0,
          explanation:
            "namedtuple tetap tuple, tapi tiap posisi punya nama: `p.nama` sama dengan `p[0]`. Isinya tetap immutable.",
        },
      ],
    },
    {
      slug: "itertools-kombinasi",
      title: "itertools: Alat Iterasi",
      summary: "Gabungkan, kelompokkan, dan kombinasikan urutan dengan modul itertools.",
      steps: [
        {
          kind: "theory",
          title: "chain, combinations, dan groupby",
          body: "`itertools` adalah kotak peralatan untuk iterasi: `chain(a, b)` menyambung dua iterable menjadi satu aliran; `combinations(data, r)` menghasilkan semua kombinasi r item tanpa mengulang susunan yang sama; `islice` memotong iterator seperti slicing pada list.\n\nYang paling sering salah kaprah adalah `groupby`: ia hanya mengelompokkan item yang berurutan sama. Sebelum dipakai, data harus diurutkan dulu dengan kunci yang sama lewat `sorted(data)`; kalau tidak, kunci yang sama akan muncul sebagai beberapa grup terpisah.\n\nSemua fungsi itertools mengembalikan iterator: hemat memori, tapi sekali jalan. Bila perlu dipakai dua kali, ubah dulu menjadi list dengan `list(...)`.",
          code: {
            language: "python",
            content:
              'from itertools import chain, combinations, groupby\n\nprint(list(chain([1, 2], [3, 4])))     # [1, 2, 3, 4]\nprint(list(combinations("abc", 2)))    # [(\'a\', \'b\'), (\'a\', \'c\'), (\'b\', \'c\')]\n\ndata = sorted(["b", "a", "b", "a"])\nfor kunci, grup in groupby(data):\n    print(kunci, len(list(grup)))      # a 2, lalu b 2',
            caption: "groupby butuh data terurut; hasilnya iterator grup yang harus dikonsumsi.",
          },
        },
        {
          kind: "quiz",
          question: "Mengapa `groupby` sering menghasilkan grup yang pecah pecah?",
          options: [
            "Karena groupby hanya mengelompokkan item yang berurutan sama saja",
            "Karena datanya terlalu besar",
            "Karena groupby hanya bekerja untuk angka",
            "Karena lupa memberi argumen r",
          ],
          answer: 0,
          explanation:
            "groupby membandingkan item bersebelahan. Kunci yang sama yang terpisah di tengah data menjadi grup berbeda; urutkan dulu dengan sorted().",
        },
        {
          kind: "code",
          title: "Semua pasangan uji",
          prompt:
            "Baca satu baris kata dari input, lalu cetak semua pasangan kombinasi 2 kata dalam format `<a> & <b>`, mengikuti urutan kemunculan input.",
          mode: "fill",
          template:
            'from itertools import ___\nimport sys\n\nkata = sys.stdin.read().split()\nfor a, b in ___(kata, 2):\n    print(f"{a} ___ {b}")',
          solution:
            'from itertools import combinations\nimport sys\n\nkata = sys.stdin.read().split()\nfor a, b in combinations(kata, 2):\n    print(f"{a} & {b}")',
          tests: [
            { stdin: "a b c", expectedOutput: "a & b\na & c\nb & c" },
            { stdin: "merah kuning", expectedOutput: "merah & kuning", hidden: true },
            { stdin: "1 2 3 4", expectedOutput: "1 & 2\n1 & 3\n1 & 4\n2 & 3\n2 & 4\n3 & 4", hidden: true },
          ],
          hints: [
            "Fungsi untuk semua kombinasi r item bernama combinations.",
            "combinations menghasilkan tuple; unpack dengan for a, b in.",
          ],
        },
      ],
    },
    {
      slug: "re-search-groups",
      title: "Regex: search dan groups",
      summary: "Temukan pola di teks dan tarik bagian yang kamu butuhkan dengan grup.",
      steps: [
        {
          kind: "theory",
          title: "Pola, grup, dan raw string",
          body: 'Modul `re` mencocokkan pola pada teks. `re.search(pola, teks)` mencari di seluruh teks dan mengembalikan objek match atau `None`; `re.match` hanya mengecek di awal string. Tulis pola sebagai raw string `r"..."` supaya backslash tidak perlu dobel.\n\nKelas karakter yang sering dipakai: `\\d` digit, `\\w` huruf angka garis bawah, `\\s` spasi apa pun, dan kuantifier `+` (satu atau lebih) serta `*` (nol atau lebih). Kurung `( )` menangkap bagian yang cocok, dibaca lewat `m.group(1)`, `m.group(2)`, atau sekaligus lewat `m.groups()`.\n\nKebiasaan penting: selalu uji keberadaan match sebelum memakainya. `m = re.search(...)` lalu `if m:`, karena mengakses grup dari `None` melempar AttributeError.',
          code: {
            language: "python",
            content:
              'import re\n\nteks = "Order #1234 dikirim tanggal 2026-03-05"\n\nm = re.search(r"#(\\d+)", teks)\nprint(m.group(1))        # 1234\n\nm2 = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", teks)\nprint(m2.groups())       # (\'2026\', \'03\', \'05\')',
            caption: "Kurung menangkap potongan pola; groups() mengembalikan semuanya sebagai tuple.",
          },
        },
        {
          kind: "quiz",
          question: "Apa perbedaan utama `re.match` dan `re.search`?",
          options: [
            "match lebih cepat untuk teks panjang",
            "match hanya mencocokkan di awal string, search mencari di seluruh teks",
            "match mengembalikan list semua hasil",
            "Tidak ada bedanya",
          ],
          answer: 1,
          explanation:
            "re.match menambatkan pola di awal string; re.search menyapu sampai pola ketemu di mana pun. Keduanya mengembalikan satu match pertama.",
        },
        {
          kind: "code",
          title: "Perbaiki penarik skor",
          prompt:
            "Program ini harus menarik nama dan skor dari tiap baris `Nama: <nama>, Skor: <angka>` lalu mencetak `<nama>: <skor>`. Ada satu kesalahan pola yang membuat angka terpotong. Perbaiki sampai semua tes lulus.",
          mode: "fix",
          template:
            'import re\nimport sys\n\nfor baris in sys.stdin:\n    m = re.search(r"Nama: (\\w+), Skor: (\\d)", baris)\n    if m:\n        nama, skor = m.groups()\n        print(f"{nama}: {skor}")',
          solution:
            'import re\nimport sys\n\nfor baris in sys.stdin:\n    m = re.search(r"Nama: (\\w+), Skor: (\\d+)", baris)\n    if m:\n        nama, skor = m.groups()\n        print(f"{nama}: {skor}")',
          tests: [
            { stdin: "Nama: Ayu, Skor: 90\nNama: Bima, Skor: 75", expectedOutput: "Ayu: 90\nBima: 75" },
            { stdin: "Nama: Cika, Skor: 100", expectedOutput: "Cika: 100" },
            { stdin: "Nama: Dewi, Skor: 88\nbaris ini tidak berpola", expectedOutput: "Dewi: 88", hidden: true },
          ],
          hints: [
            "Jalankan dan lihat keluarannya: skor yang muncul terpotong satu digit.",
            "\\d hanya mencocokkan satu digit; tambahkan kuantifier + untuk satu atau lebih.",
          ],
        },
      ],
    },
    {
      slug: "re-sub-pola",
      title: "Regex: sub dan Pembersihan Teks",
      summary: "Ganti pola dengan re.sub, dari merapikan spasi sampai menyamarkan data.",
      steps: [
        {
          kind: "theory",
          title: "re.sub: ganti berdasarkan pola",
          body: '`re.sub(pola, pengganti, teks)` mengganti semua bagian yang cocok dengan pola. Kombinasi paling populer untuk teks kotor: `re.sub(r"\\s+", " ", teks).strip()`, yang memadatkan spasi, tab, dan newline menjadi satu spasi, lalu membuang sisa di pinggir.\n\nDi string pengganti, `\\1`, `\\2`, dan seterusnya merujuk grup hasil tangkapan. Pola `r"(\\w+)-(\\d+)"` dengan pengganti `r"\\1-XXX"` menyamarkan angkanya sambil menjaga nama depannya. Ini dasar teknik normalisasi dan penyamaran data.\n\nDua anchor yang melengkapi: `^` menyentuh awal string dan `$` akhir string. Anchor berguna saat kamu hanya mau mengganti kalau pola berada di posisi tertentu, misalnya membuang awalan `DEBUG: ` di baris log.',
          code: {
            language: "python",
            content:
              'import re\n\nteks = "Halo   dunia,\\t  banyak   spasi"\nprint(re.sub(r"\\s+", " ", teks).strip())\n# Halo dunia, banyak spasi\n\nmobil = "mobil-123 dan motor-45"\nprint(re.sub(r"(\\w+)-(\\d+)", r"\\1-XXX", mobil))\n# mobil-XXX dan motor-XXX',
            caption: "\\s+ memadatkan whitespace; \\1 merujuk grup pertama di string pengganti.",
          },
        },
        {
          kind: "quiz",
          question: 'Apa hasil `re.sub(r"\\s+", " ", "a   b\\tc")`?',
          options: ['"a b c"', '"a   b c"', '"abc"', '"a b\\tc"'],
          answer: 0,
          explanation:
            "`\\s+` mencocokkan rangkaian whitespace apa pun dan menggantinya dengan satu spasi, termasuk tab.",
        },
        {
          kind: "quiz",
          question: "Dalam string pengganti `re.sub`, apa arti `\\1`?",
          options: [
            "Karakter backslash literal",
            "Teks grup pertama yang tertangkap",
            "Seluruh teks asli",
            "Ganti hanya satu kemunculan pertama",
          ],
          answer: 1,
          explanation:
            "`\\1` adalah backreference ke grup tangkapan pertama. Batasi jumlah penggantian dengan argumen count kalau tidak mau semuanya.",
        },
      ],
    },
    {
      slug: "logging-dasar",
      title: "logging: Catatan Program",
      summary: "Catat peristiwa dengan level yang benar; kenali alur keluarannya ke stderr.",
      steps: [
        {
          kind: "theory",
          title: "Dari print ke logging",
          body: "`print` cocok untuk keluaran program, bukan untuk catatan proses. Modul `logging` memberi konteks yang tidak dimiliki print: kapan peristiwa terjadi, seberapa serius, dan dari bagian mana asalnya. Saat masalah datang, catatan itu yang menyelamatkan.\n\nTingkat log berurutan dari paling ringan: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. `logging.basicConfig(level=...)` menetapkan ambang: panggilan di bawah level itu diabaikan. Saat development pakai `DEBUG`, di produksi naikkan ke `WARNING` agar catatan mengikuti peristiwa penting saja.\n\nSatu hal yang sering mengejutkan: keluaran `logging` bawaan masuk ke `stderr`, bukan `stdout`. Itu disengaja, supaya catatan tidak bercampur dengan data hasil program saat output diarahkan ke file atau diuji otomatis. Di platform ini judge membandingkan `stdout` saja, jadi pemanggilan logging tidak merusak keluaran yang dinilai.",
          code: {
            language: "python",
            content:
              'import logging\n\nlogging.basicConfig(\n    level=logging.INFO,\n    format="%(levelname)s:%(message)s",\n)\n\nlogging.debug("detail rumit")          # tidak muncul, di bawah INFO\nlogging.info("mulai proses")           # INFO:mulai proses\nlogging.warning("quota hampir habis")  # WARNING:quota hampir habis',
            caption: "Keduanya muncul di stderr; debug disaring karena di bawah ambang INFO.",
          },
        },
        {
          kind: "quiz",
          question: "Secara bawaan, keluaran `logging.info(...)` tampil di mana?",
          options: [
            "stdout, bersama print biasa",
            "stderr, terpisah dari keluaran program",
            "Ke file logging.txt",
            "Tidak tampil di mana pun",
          ],
          answer: 1,
          explanation:
            "Handler bawaan logging menulis ke stderr. Karena itu catatan tidak bercampur dengan data program di stdout.",
        },
        {
          kind: "quiz",
          question: 'Dengan `logging.basicConfig(level=logging.WARNING)`, apa yang terjadi pada `logging.info("cek")`?',
          options: [
            "Tampil seperti biasa",
            "Tampil tanpa format",
            "Diabaikan karena INFO di bawah WARNING",
            "Program berhenti dengan error",
          ],
          answer: 2,
          explanation:
            "basicConfig menetapkan ambang. Pesan dengan level di bawah ambang, termasuk INFO saat ambang WARNING, tidak direkam sama sekali.",
        },
      ],
    },
    {
      slug: "argparse-cli",
      title: "argparse: CLI yang Rapi",
      summary: "Terima opsi baris perintah dengan argparse; pahami pola opsi dan nilai bawaan.",
      steps: [
        {
          kind: "theory",
          title: "ArgumentParser dan parse_args",
          body: "Program CLI yang layak menerima opsi: `sapa.py Ayu --ulang 2`. Modul `argparse` mengurus pembacaan, validasi, sampai halaman `--help` otomatis. Buat `ArgumentParser`, daftarkan tiap argumen dengan `add_argument`, lalu `parse_args()` mengembalikan objek dengan atribut sesuai nama.\n\nAda dua jenis argumen: posisi (wajib, urutannya menentukan) dan opsi yang diawali tanda hubung seperti `--ulang`. Opsi bisa diberi `type=int` untuk konversi otomatis dan `default=...` untuk nilai bawaan bila pengguna tidak menyebutkannya.\n\nCatatan praktis untuk latihan di platform ini: judge mengirim input lewat stdin dan tidak memberi argumen CLI. Jadi pada latihan kodenya, string argumen dibaca dari stdin dan diurai manual. Pola pikirnya sama persis dengan argparse: baca token, kenali opsinya, isi nilai bawaan untuk yang absen.",
          code: {
            language: "python",
            content:
              'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("nama")                       # posisi, wajib\nparser.add_argument("--ulang", type=int, default=1)\nargs = parser.parse_args()\n\nfor _ in range(args.ulang):\n    print(f"Halo, {args.nama}!")',
            caption: "args.ulang otomatis int bernilai 1 bila opsi tidak diberikan; --help pun jadi gratis.",
          },
        },
        {
          kind: "quiz",
          question:
            'Dengan `parser.add_argument("--ulang", type=int, default=1)` dan pengguna menjalankan program tanpa `--ulang`, berapa `args.ulang`?',
          options: ["Error karena opsi wajib", "None", "0", "1, dari default"],
          answer: 3,
          explanation:
            "Nilai default dipakai bila opsi tidak muncul di baris perintah, dan `type=int` tetap diterapkan pada input yang ada.",
        },
        {
          kind: "code",
          title: "Pengurai opsi mini",
          prompt:
            "Baris pertama stdin berisi argumen ala CLI, misalnya `--nama Ayu --ulang 2`, dan bisa juga kosong. Dukungan opsi: `--nama <teks>` bernilai bawaan `Dunia`, dan `--ulang <int>` bernilai bawaan `1`. Cetak `Halo, <nama>!` sebanyak ulang kali.",
          mode: "fill",
          template:
            "import sys\n\ntokens = sys.stdin.readline().split()\nopsi = {\"nama\": \"Dunia\", \"ulang\": 1}\ni = 0\nwhile i < len(tokens):\n    kunci = tokens[i].lstrip(\"-\")\n    nilai = tokens[i + 1]\n    if kunci == \"ulang\":\n        nilai = ___(nilai)\n    opsi[kunci] = ___\n    i += ___\nfor _ in range(opsi[\"ulang\"]):\n    print(f\"Halo, {opsi['nama']}!\")",
          solution:
            "import sys\n\ntokens = sys.stdin.readline().split()\nopsi = {\"nama\": \"Dunia\", \"ulang\": 1}\ni = 0\nwhile i < len(tokens):\n    kunci = tokens[i].lstrip(\"-\")\n    nilai = tokens[i + 1]\n    if kunci == \"ulang\":\n        nilai = int(nilai)\n    opsi[kunci] = nilai\n    i += 2\nfor _ in range(opsi[\"ulang\"]):\n    print(f\"Halo, {opsi['nama']}!\")",
          tests: [
            { stdin: "--nama Ayu --ulang 2", expectedOutput: "Halo, Ayu!\nHalo, Ayu!" },
            { stdin: "", expectedOutput: "Halo, Dunia!" },
            { stdin: "--ulang 3", expectedOutput: "Halo, Dunia!\nHalo, Dunia!\nHalo, Dunia!", hidden: true },
          ],
          hints: [
            "Setiap opsi memakan dua token: nama opsinya dan nilainya, jadi indeks melompat dua.",
            "Nilai ulang datang sebagai teks; ubah dengan int() sebelum dipakai untuk range().",
          ],
        },
      ],
    },
    {
      slug: "latihan-log-gabungan",
      title: "Latihan Gabungan: Analisis Log",
      summary: "Sahutan akhir modul: datetime, Counter, dan penguraian baris dalam satu program.",
      steps: [
        {
          kind: "theory",
          title: "Stdlib bekerja bersama",
          body: "Pekerjaan pengolahan data nyata jarang butuh satu modul saja. Analisis log misalnya: `datetime` menguraikan penanda waktu, `collections.Counter` merangkum level, dan `re` atau `split` memecah baris. Standar library Python saling melengkapi, dan menguasai kombinasinya lebih berharga daripada menghafal satu modul.\n\nRancang program per fase: baca dan saring baris, parse tiap bagian, kumpulkan agregat, lalu format keluaran. Menyimpan `timedelta` dari selisih penanda waktu terakhir dan terawal memberi rentang kejadian, satu angka yang sering ditanyakan lebih dulu saat inspeksi.\n\nKeluaran yang terurut menentu juga bagian dari kualitas: `sorted(level.items(), key=lambda kv: (-kv[1], kv[0]))` menampilkan level terramai dulu, dan bila seri, urut abjad. Pola kunci sortir dua lapis ini layak diingat; muncul terus dalam pekerjaan data.",
          code: {
            language: "python",
            content:
              'from collections import Counter\nfrom datetime import datetime\n\nt = datetime.strptime("2026-01-05 08:15", "%Y-%m-%d %H:%M")\nlevel = Counter(["INFO", "ERROR", "INFO"])\nprint(level.most_common())   # [(\'INFO\', 2), (\'ERROR\', 1)]',
            caption: "strptime menguraikan penanda waktu; most_common merangkum level.",
          },
        },
        {
          kind: "quiz",
          question:
            "Untuk menampilkan level log dari yang paling sering, dengan seri dipecah urut abjad, kunci sortir yang tepat adalah?",
          options: [
            "key=lambda kv: kv[1]",
            "key=lambda kv: (-kv[1], kv[0])",
            "key=lambda kv: kv[0]",
            "key=lambda kv: abs(kv[1])",
          ],
          answer: 1,
          explanation:
            "Membalik jumlah dengan tanda minus menurunkan urutannya, lalu kv[0] memecah seri secara abjad. Satu sorted, dua aturan.",
        },
        {
          kind: "code",
          title: "Rekap log server",
          prompt:
            "Stdin berisi log berformat `<YYYY-MM-DD HH:MM>,<LEVEL>,<pesan>`, satu per baris (abaikan baris kosong). Cetak rekap tiga baris: `total: <jumlah baris>`, lalu `<LEVEL>: <jumlah>` terurut jumlah terbanyak dulu (seri dipecah urut abjad), lalu `rentang: <selisih menit>` antara penanda waktu terakhir dan terawal.",
          mode: "fill",
          template:
            'import sys\nfrom collections import Counter\nfrom datetime import datetime\n\nwaktu = []\nlevel = Counter()\nfor baris in sys.stdin:\n    baris = baris.strip()\n    if not baris:\n        continue\n    bagian = baris.split(",")\n    t = datetime.___(bagian[0], "%Y-%m-%d %H:%M")\n    waktu.append(t)\n    level[bagian[1]] += 1\nprint(f"total: {sum(level.values())}")\nfor lvl, n in sorted(level.items(), key=lambda kv: ___):\n    print(f"{lvl}: {n}")\nprint(f"rentang: {int((max(waktu) - min(waktu)).total_seconds() // 60)} menit")',
          solution:
            'import sys\nfrom collections import Counter\nfrom datetime import datetime\n\nwaktu = []\nlevel = Counter()\nfor baris in sys.stdin:\n    baris = baris.strip()\n    if not baris:\n        continue\n    bagian = baris.split(",")\n    t = datetime.strptime(bagian[0], "%Y-%m-%d %H:%M")\n    waktu.append(t)\n    level[bagian[1]] += 1\nprint(f"total: {sum(level.values())}")\nfor lvl, n in sorted(level.items(), key=lambda kv: (-kv[1], kv[0])):\n    print(f"{lvl}: {n}")\nprint(f"rentang: {int((max(waktu) - min(waktu)).total_seconds() // 60)} menit")',
          tests: [
            {
              stdin:
                "2026-01-05 08:15,INFO,server mulai\n2026-01-05 08:16,ERROR,gagal baca config\n2026-01-05 08:17,INFO,config dimuat",
              expectedOutput: "total: 3\nINFO: 2\nERROR: 1\nrentang: 2 menit",
            },
            { stdin: "2026-03-01 10:00,WARNING,disk penuh", expectedOutput: "total: 1\nWARNING: 1\nrentang: 0 menit" },
            {
              stdin:
                "2026-05-10 09:00,ERROR,db down\n2026-05-10 09:01,ERROR,db down lagi\n2026-05-10 09:04,ERROR,db up\n2026-05-10 09:05,INFO,restart",
              expectedOutput: "total: 4\nERROR: 3\nINFO: 1\nrentang: 5 menit",
              hidden: true,
            },
          ],
          hints: [
            "Fungsi yang menguraikan teks sesuai pola bernama datetime.strptime.",
            "Kunci sortir (-kv[1], kv[0]) menurunkan jumlah lalu memecah seri secara abjad; rentang dihitung dari total_seconds() dibagi 60.",
          ],
        },
      ],
    },
  ],
};
