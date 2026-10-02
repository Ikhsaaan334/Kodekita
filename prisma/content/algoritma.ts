import type { GlobalChallengeContent } from "./types";

/**
 * Koleksi tantangan algoritma lintas-bahasa. Soal diambil dari soal-soal
 * klasik LeetCode yang dikumpulkan di github.com/haoel/leetcode dan
 * github.com/snehasishroy/leetcode-companywise-interview-questions, dengan
 * pemilihan mengikuti list populer (Blind 75, Top Interview 150) dari
 * github.com/ashishps1/awesome-leetcode-resources.
 *
 * Pernyataan ditulis ulang dengan kata sendiri (bukan salinan), dan setiap
 * refSolution diverifikasi mesin oleh scripts/verify-algoritma.ts sebelum seed.
 */

export function makeStarters(judul: string): Record<string, string> {
  const komentar = `Soal: ${judul}. Tulis solusimu di bawah, baca input dari stdin.`;
  return {
    python: `import sys\n\n# ${komentar}\ndata = sys.stdin.read().split()\n`,
    go: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\nfunc main() {\n\treader := bufio.NewReader(os.Stdin)\n\tbaris, _ := reader.ReadString('\\n')\n\t_ = strings.TrimSpace(baris)\n\t// ${komentar}\n\tfmt.Println()\n}\n`,
    c: `#include <stdio.h>\n\nint main(void) {\n\t/* ${komentar} */\n\treturn 0;\n}\n`,
    cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n\t// ${komentar}\n\treturn 0;\n}\n`,
    java: `import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\t// ${komentar}\n\t}\n}\n`,
    php: `<?php\n// ${komentar}\n`,
    csharp: `using System;\n\npublic class Program {\n\tpublic static void Main() {\n\t\t// ${komentar}\n\t}\n}\n`,
  };
}

function sumber(lc: string) {
  return `\n\n---\n**Sumber**: ${lc}, salah satu soal yang dikumpulkan di github.com/haoel/leetcode dan github.com/snehasishroy/leetcode-companywise-interview-questions; pemilihan soal mengikuti list populer di github.com/ashishps1/awesome-leetcode-resources.`;
}

export const ALGORITMA: GlobalChallengeContent[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "mudah",
    statement:
      "Diberikan sejumlah bilangan dan satu angka target. Cari dua bilangan dalam daftar yang jumlahnya tepat sama dengan target, lalu cetak indeks keduanya.\n\nDijamin selalu ada tepat satu pasangan jawaban, dan kamu tidak boleh memakai elemen yang sama dua kali.\n\n**Format input**\nBaris 1: `n`, banyaknya bilangan\nBaris 2: `n` bilangan bulat dipisah spasi\nBaris 3: `target`\n\n**Format output**\nSatu baris: dua indeks (mulai dari 0) dengan indeks lebih kecil dulu, dipisah spasi\n\n**Contoh**\nInput: `4`, `2 7 11 15`, `9` menjadi `0 1` karena 2 + 7 = 9." +
      sumber("LeetCode #1 (Two Sum)"),
    tests: [
      { stdin: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { stdin: "3\n3 2 4\n6", expectedOutput: "1 2" },
      { stdin: "2\n3 3\n6", expectedOutput: "0 1" },
      { stdin: "5\n-1 -2 -3 -4 -5\n-8", expectedOutput: "2 4", hidden: true },
    ],
    hints: [
      "Cara kuadratik (cek semua pasangan) sah untuk soal latihan ini, dan cukup untuk lulus semua tes.",
      "Kalau ingin lebih cepat: saat membaca angka ke-i, sudahkah angka target - angka sekarang muncul sebelumnya? Simpan angka yang sudah dibaca dalam peta nilai ke indeks.",
      "Cetak pasangan indeks dengan urutan indeks lama dulu, baru indeks sekarang.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #1 (Two Sum)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    nums = list(map(int, data[1 : 1 + n]))\n    target = int(data[1 + n])\n    idx = {}\n    for i, x in enumerate(nums):\n        if target - x in idx:\n            print(idx[target - x], i)\n            return\n        idx[x] = i\n\nmain()',
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "mudah",
    statement:
      "Diberikan satu baris yang hanya berisi karakter `(`, `)`, `[`, `]`, `{`, `}`. Tentukan apakah urutan tanda kurungnya tertutup dengan benar: setiap pembuka harus ditutup oleh jenis yang sama, dengan urutan yang tepat.\n\n**Format input**\nSatu baris string tanpa spasi, panjang maksimal 10.000\n\n**Format output**\n`ya` jika valid, `tidak` jika tidak\n\n**Contoh**\n`()[]{}` menjadi `ya`; `([)]` menjadi `tidak` karena penutupnya bersilangan." +
      sumber("LeetCode #20 (Valid Parentheses)"),
    tests: [
      { stdin: "()[]{}", expectedOutput: "ya" },
      { stdin: "([)]", expectedOutput: "tidak" },
      { stdin: "{[]}", expectedOutput: "ya" },
      { stdin: "]", expectedOutput: "tidak", hidden: true },
    ],
    hints: [
      "Struktur data yang cocok untuk soal pencocokan tanda kurung adalah stack (tumpukan).",
      "Setiap kali ketemu pembuka, dorong ke tumpukan. Setiap ketemu penutup, isi atas tumpukan harus pasangannya, kalau tidak, langsung tidak valid.",
      "Valid berarti di akhir tumpukan juga harus kosong; jangan lupa kasus seperti `((`.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #20 (Valid Parentheses)",
    refSolution:
      'import sys\n\ndef main():\n    s = sys.stdin.read().split()[0]\n    pasang = {")": "(", "]": "[", "}": "{"}\n    tumpuk = []\n    for c in s:\n        if c in "([{":\n            tumpuk.append(c)\n        else:\n            if not tumpuk or tumpuk.pop() != pasang[c]:\n                print("tidak")\n                return\n    print("ya" if not tumpuk else "tidak")\n\nmain()',
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "mudah",
    statement:
      "Diberikan satu bilangan bulat. Cetak `ya` jika bilangan itu dibaca sama dari depan dan dari belakang, dan `tidak` jika tidak. Bilangan negatif selalu `tidak` karena tanda minusnya.\n\n**Format input**\nSatu baris: satu bilangan bulat\n\n**Format output**\n`ya` atau `tidak`\n\n**Contoh**\n`121` menjadi `ya`; `-121` menjadi `tidak`; `10` menjadi `tidak`." +
      sumber("LeetCode #9 (Palindrome Number)"),
    tests: [
      { stdin: "121", expectedOutput: "ya" },
      { stdin: "-121", expectedOutput: "tidak" },
      { stdin: "10", expectedOutput: "tidak" },
      { stdin: "0", expectedOutput: "ya", hidden: true },
    ],
    hints: [
      "Mengubah bilangan menjadi string lalu membandingkan dengan versi terbaliknya adalah cara paling lugas.",
      "Kalau ingin tantangan tanpa string: balik digitnya dengan operasi sisa bagi dan pembagian 10 sampai habis.",
      "Hati-hati satu digit seperti 7: bilangan satu digit selalu palindrome.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #9 (Palindrome Number)",
    refSolution:
      'import sys\n\ndef main():\n    x = int(sys.stdin.read().split()[0])\n    s = str(x)\n    print("ya" if s == s[::-1] else "tidak")\n\nmain()',
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "mudah",
    statement:
      "Cetak angka 1 sampai n, satu per baris. Tapi untuk kelipatan 3 cetak `Fizz` alih-alih angkanya, untuk kelipatan 5 cetak `Buzz`, dan untuk kelipatan 3 dan 5 sekaligus cetak `FizzBuzz`.\n\n**Format input**\nSatu baris: bilangan bulat n (1 sampai 10.000)\n\n**Format output**\nn baris sesuai aturan di atas\n\n**Contoh**\nInput `5` menjadi:\n```\n1\n2\nFizz\n4\nBuzz\n```" +
      sumber("LeetCode #412 (Fizz Buzz)"),
    tests: [
      { stdin: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz" },
      { stdin: "1", expectedOutput: "1" },
      { stdin: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { stdin: "3", expectedOutput: "1\n2\nFizz", hidden: true },
    ],
    hints: [
      "Cek kelipatan 15 (3 dan 5 sekaligus) lebih dulu sebelum kelipatan 3 atau 5.",
      "Ingat operator sisa bagi: i % 3 == 0 berarti i kelipatan 3.",
      "Kumpulkan hasil di daftar lalu cetak sekali, atau cetak langsung per baris; keduanya sah.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #412 (Fizz Buzz)",
    refSolution:
      'import sys\n\ndef main():\n    n = int(sys.stdin.read().split()[0])\n    out = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            out.append("FizzBuzz")\n        elif i % 3 == 0:\n            out.append("Fizz")\n        elif i % 5 == 0:\n            out.append("Buzz")\n        else:\n            out.append(str(i))\n    print("\\n".join(out))\n\nmain()',
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "mudah",
    statement:
      "Diberikan sejumlah bilangan bulat. Cetak `ya` jika ada nilai yang muncul minimal dua kali, dan `tidak` jika semua nilainya unik.\n\n**Format input**\nBaris 1: `n`, banyaknya bilangan\nBaris 2: `n` bilangan bulat dipisah spasi\n\n**Format output**\n`ya` atau `tidak`\n\n**Contoh**\nInput `4`, `1 2 3 1` menjadi `ya` karena 1 muncul dua kali." +
      sumber("LeetCode #217 (Contains Duplicate)"),
    tests: [
      { stdin: "4\n1 2 3 1", expectedOutput: "ya" },
      { stdin: "4\n1 2 3 4", expectedOutput: "tidak" },
      { stdin: "1\n7", expectedOutput: "tidak" },
      { stdin: "6\n1 1 2 2 3 3", expectedOutput: "ya", hidden: true },
    ],
    hints: [
      "Membandingkan setiap pasangan (dua loop) berfungsi, tapi ada cara sekali jalan.",
      "Masukkan nilai yang sudah dilihat ke dalam himpunan (set); jika nilai berikutnya sudah ada di situ, jawabannya ya.",
      "Bandingkan juga ukuran: kalau jumlah nilai unik lebih kecil dari n, berarti ada duplikat.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #217 (Contains Duplicate)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    nums = data[1 : 1 + n]\n    print("ya" if len(set(nums)) < n else "tidak")\n\nmain()',
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "mudah",
    statement:
      "Diberikan dua kata (huruf kecil semua). Cetak `ya` jika kata kedua adalah anagram dari kata pertama, artinya susunan hurufnya bisa diacak ulang menjadi kata pertama tanpa sisa, dan `tidak` jika tidak.\n\n**Format input**\nBaris 1: kata pertama\nBaris 2: kata kedua\n\n**Format output**\n`ya` atau `tidak`\n\n**Contoh**\n`anagram` dan `margana` menjadi `ya`; `rat` dan `car` menjadi `tidak`." +
      sumber("LeetCode #242 (Valid Anagram)"),
    tests: [
      { stdin: "anagram\nmargana", expectedOutput: "ya" },
      { stdin: "rat\ncar", expectedOutput: "tidak" },
      { stdin: "a\nab", expectedOutput: "tidak" },
      { stdin: "listen\nsilent", expectedOutput: "ya", hidden: true },
    ],
    hints: [
      "Panjangnya beda? Langsung tidak, tanpa perlu menghitung apa pun lagi.",
      "Cara sederhana: urutkan huruf kedua kata, lalu bandingkan hasilnya.",
      "Cara lebih efisien: hitung frekuensi tiap huruf dengan peta, lalu bandingkan kedua peta.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #242 (Valid Anagram)",
    refSolution:
      'import sys\n\ndef main():\n    a, b = sys.stdin.read().split()[:2]\n    print("ya" if sorted(a) == sorted(b) else "tidak")\n\nmain()',
  },
  {
    slug: "best-time-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "mudah",
    statement:
      "Kamu memegang daftar harga saham per hari. Pilih satu hari untuk membeli dan satu hari berikutnya untuk menjual supaya untungnya maksimal. Cetak keuntungan maksimal itu; jika tidak ada skenario untung (harga terus turun), cetak `0`.\n\n**Format input**\nBaris 1: `n`, banyaknya hari (1 sampai 100.000)\nBaris 2: `n` harga dipisah spasi\n\n**Format output**\nSatu baris: keuntungan maksimal\n\n**Contoh**\nInput `6`, `7 1 5 3 6 4` menjadi `5` (beli di 1, jual di 6)." +
      sumber("LeetCode #121 (Best Time to Buy and Sell Stock)"),
    tests: [
      { stdin: "6\n7 1 5 3 6 4", expectedOutput: "5" },
      { stdin: "5\n7 6 4 3 1", expectedOutput: "0" },
      { stdin: "1\n5", expectedOutput: "0" },
      { stdin: "4\n2 4 1 7", expectedOutput: "6", hidden: true },
    ],
    hints: [
      "Dua loop untuk semua pasangan beli-jual berfungsi, tapi bisa sekali lewat.",
      "Saat berjalan menyusuri harga, catat harga terendah yang sudah lewat; keuntungan terbaik di titik sekarang adalah harga sekarang dikurangi terendah itu.",
      "Jangan lupa jawaban minimal adalah 0, bukan negatif.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #121 (Best Time to Buy and Sell Stock)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    p = list(map(int, data[1 : 1 + n]))\n    terkecil = p[0]\n    terbaik = 0\n    for x in p[1:]:\n        if x - terkecil > terbaik:\n            terbaik = x - terkecil\n        if x < terkecil:\n            terkecil = x\n    print(terbaik)\n\nmain()',
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "mudah",
    statement:
      "Kamu sedang menaiki tangga dengan n anak tangga. Setiap langkah kamu boleh naik 1 atau 2 anak tangga. Cetak berapa banyak cara berbeda untuk mencapai puncak.\n\n**Format input**\nSatu baris: bilangan bulat n (1 sampai 45)\n\n**Format output**\nSatu baris: banyaknya cara\n\n**Contoh**\n`2` menjadi `2` (1+1 atau 2); `3` menjadi `3` (1+1+1, 1+2, 2+1)." +
      sumber("LeetCode #70 (Climbing Stairs)"),
    tests: [
      { stdin: "2", expectedOutput: "2" },
      { stdin: "3", expectedOutput: "3" },
      { stdin: "1", expectedOutput: "1" },
      { stdin: "10", expectedOutput: "89", hidden: true },
      { stdin: "45", expectedOutput: "1836311903", hidden: true },
    ],
    hints: [
      "Cara ke-n adalah cara ke n-1 ditambah cara ke n-2: langkah terakhirmu pasti 1 (dari n-1) atau 2 (dari n-2).",
      "Pola ini adalah deret Fibonacci yang bergeser: 1, 1, 2, 3, 5, 8, dan seterusnya.",
      "Cukup simpan dua nilai terakhir saat berjalan, tidak perlu array penuh.",
    ],
    xpReward: 100,
    lcRef: "LeetCode #70 (Climbing Stairs)",
    refSolution:
      'import sys\n\ndef main():\n    n = int(sys.stdin.read().split()[0])\n    a, b = 1, 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    print(b)\n\nmain()',
  },
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "sedang",
    statement:
      "Diberikan satu angka Romawi (nilai 1 sampai 3999). Ubah menjadi bilangan bulat.\n\nAturannya: simbol `I`=1, `V`=5, `X`=10, `L`=50, `C`=100, `D`=500, `M`=1000. Biasanya simbol ditulis dari besar ke kecil dan dijumlahkan, tapi jika simbol yang lebih kecil berada sebelum yang lebih besar (misal `IV`), nilainya dikurangkan (4, bukan 6).\n\n**Format input**\nSatu baris: angka Romawi dalam huruf besar\n\n**Format output**\nSatu baris: nilai bilangan bulatnya\n\n**Contoh**\n`III` menjadi `3`; `LVIII` menjadi `58`; `MCMXCIV` menjadi `1994`." +
      sumber("LeetCode #13 (Roman to Integer)"),
    tests: [
      { stdin: "III", expectedOutput: "3" },
      { stdin: "LVIII", expectedOutput: "58" },
      { stdin: "MCMXCIV", expectedOutput: "1994" },
      { stdin: "IX", expectedOutput: "9", hidden: true },
    ],
    hints: [
      "Baca simbol satu per satu; jika nilai simbol berikutnya lebih besar, simbol sekarang dikurangkan, selain itu dijumlahkan.",
      "Semua kasus pengurangan hanya enam: IV, IX, XL, XC, CD, CM.",
      "Cara alternatif: proses dari kanan ke kiri sambil membandingkan dengan nilai maksimum yang sudah lewat.",
    ],
    xpReward: 150,
    lcRef: "LeetCode #13 (Roman to Integer)",
    refSolution:
      'import sys\n\ndef main():\n    s = sys.stdin.read().split()[0]\n    nilai = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    total = 0\n    for i, c in enumerate(s):\n        v = nilai[c]\n        if i + 1 < len(s) and nilai[s[i + 1]] > v:\n            total -= v\n        else:\n            total += v\n    print(total)\n\nmain()',
  },
  {
    slug: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "sedang",
    statement:
      "Diberikan bilangan bulat bertanda. Balik urutan digitnya dan cetak hasilnya. Jika hasil pembalikan keluar dari rentang bilangan 32-bit bertanda (dari -2147483648 sampai 2147483647), cetak `0`.\n\n**Format input**\nSatu baris: satu bilangan bulat\n\n**Format output**\nSatu baris: digit terbalik, atau `0` jika meluap\n\n**Contoh**\n`123` menjadi `321`; `-123` menjadi `-321`; `120` menjadi `21`." +
      sumber("LeetCode #7 (Reverse Integer)"),
    tests: [
      { stdin: "123", expectedOutput: "321" },
      { stdin: "-123", expectedOutput: "-321" },
      { stdin: "120", expectedOutput: "21" },
      { stdin: "1534236469", expectedOutput: "0", hidden: true },
    ],
    hints: [
      "Di banyak bahasa, membalik lewat string lalu mengubahnya kembali ke bilangan jauh lebih mudah daripada operasi digit.",
      "Yang diperiksa luapnya adalah HASIL pembalikan, bukan masukannya: input selalu muat dalam 32-bit.",
      "Tanda negatif dilepas dulu saat membalik, lalu ditempel kembali di akhir.",
    ],
    xpReward: 150,
    lcRef: "LeetCode #7 (Reverse Integer)",
    refSolution:
      'import sys\n\ndef main():\n    x = int(sys.stdin.read().split()[0])\n    tanda = -1 if x < 0 else 1\n    y = tanda * int(str(abs(x))[::-1])\n    print(y if -2**31 <= y <= 2**31 - 1 else 0)\n\nmain()',
  },
  {
    slug: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "sedang",
    statement:
      "Diberikan sejumlah bilangan bulat (bisa negatif). Cari potongan berurutan (subarray) dengan jumlah terbesar, dan cetak jumlah itu. Potongan minimal berisi satu elemen.\n\n**Format input**\nBaris 1: `n`, banyaknya bilangan (1 sampai 100.000)\nBaris 2: `n` bilangan bulat dipisah spasi\n\n**Format output**\nSatu baris: jumlah subarray terbesar\n\n**Contoh**\nInput `9`, `-2 1 -3 4 -1 2 1 -5 4` menjadi `6` (potongan 4, -1, 2, 1)." +
      sumber("LeetCode #53 (Maximum Subarray)"),
    tests: [
      { stdin: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { stdin: "1\n1", expectedOutput: "1" },
      { stdin: "5\n5 4 -1 7 8", expectedOutput: "23" },
      { stdin: "8\n-2 -3 4 -1 -2 1 5 -3", expectedOutput: "7", hidden: true },
    ],
    hints: [
      "Kadane: berjalan dari kiri, simpan jumlah terbaik yang berakhir di posisi sekarang. Untuk tiap elemen, pilih yang lebih besar: mulai potongan baru di sini, atau sambung dengan potongan sebelumnya.",
      "Jumlah berakhir di i adalah max(elemen_sekarang, jumlah_sebelumnya + elemen_sekarang).",
      "Jawaban keseluruhan adalah nilai maksimum dari semua jumlah berakhir di i, jadi jangan lupa memperbarui jawaban setiap langkah.",
    ],
    xpReward: 150,
    lcRef: "LeetCode #53 (Maximum Subarray)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    p = list(map(int, data[1 : 1 + n]))\n    terbaik = p[0]\n    kini = p[0]\n    for x in p[1:]:\n        kini = max(x, kini + x)\n        if kini > terbaik:\n            terbaik = kini\n    print(terbaik)\n\nmain()',
  },
  {
    slug: "longest-substring-unique",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "sedang",
    statement:
      "Diberikan satu baris string. Cari panjang potongan terpanjang yang tidak memiliki karakter berulang.\n\n**Format input**\nSatu baris: string (panjang 1 sampai 50.000, bisa berisi karakter apa pun kecuali spasi)\n\n**Format output**\nSatu baris: panjang potongan terpanjang tanpa karakter berulang\n\n**Contoh**\n`abcabcbb` menjadi `3` (potongan `abc`); `bbbbb` menjadi `1`; `pwwkew` menjadi `3` (potongan `wke`, ingat waw harus berurutan)." +
      sumber("LeetCode #3 (Longest Substring Without Repeating Characters)"),
    tests: [
      { stdin: "abcabcbb", expectedOutput: "3" },
      { stdin: "bbbbb", expectedOutput: "1" },
      { stdin: "pwwkew", expectedOutput: "3" },
      { stdin: "dvdf", expectedOutput: "3", hidden: true },
    ],
    hints: [
      "Sliding window: pertahankan jendela [kiri, kanan] yang selalu tanpa duplikat; perpanjang kanan, dan jika karakter kanan sudah ada di jendela, geser kiri sampai duplikatnya keluar.",
      "Simpan posisi terakhir tiap karakter dalam peta agar geser kiri bisa langsung melompat, tidak selangkah demi selangkah.",
      "Panjang jendela saat ini adalah kanan - kiri + 1; jawaban adalah maksimumnya sepanjang perjalanan.",
    ],
    xpReward: 150,
    lcRef: "LeetCode #3 (Longest Substring Without Repeating Characters)",
    refSolution:
      'import sys\n\ndef main():\n    s = sys.stdin.read().split()[0]\n    terakhir = {}\n    awal = 0\n    terbaik = 0\n    for i, c in enumerate(s):\n        if c in terakhir and terakhir[c] >= awal:\n            awal = terakhir[c] + 1\n        terakhir[c] = i\n        if i - awal + 1 > terbaik:\n            terbaik = i - awal + 1\n    print(terbaik)\n\nmain()',
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "sulit",
    statement:
      "Diberikan koin-koin dengan nilai berbeda (boleh dipakai berkali-kali) dan satu nilai target. Cetak jumlah koin paling sedikit untuk mencapai target persis. Jika tidak mungkin, cetak `-1`; jika targetnya 0, cetak `0`.\n\n**Format input**\nBaris 1: `n`, banyaknya jenis koin\nBaris 2: `n` nilai koin dipisah spasi\nBaris 3: `amount`, nilai target\n\n**Format output**\nSatu baris: jumlah koin minimum, `-1` jika tidak mungkin\n\n**Contoh**\nKoin `1 2 5` dan target `11` menjadi `3` (5 + 5 + 1)." +
      sumber("LeetCode #322 (Coin Change)"),
    tests: [
      { stdin: "3\n1 2 5\n11", expectedOutput: "3" },
      { stdin: "1\n2\n3", expectedOutput: "-1" },
      { stdin: "1\n1\n0", expectedOutput: "0" },
      { stdin: "4\n1 5 6 9\n11", expectedOutput: "2", hidden: true },
    ],
    hints: [
      "Program dinamis: dp[a] adalah koin minimal untuk nilai a. dp[0] = 0, dan dp[a] = min(dp[a - koin] + 1) untuk setiap koin yang muat.",
      "Kalau dp[a - koin] belum bisa dicapai, lewati koin itu; jangan sampai menambah tak-hingga.",
      "Nilai tak tercapai tetap ditandai sebagai tak hingga sampai akhir, lalu dicetak sebagai -1.",
    ],
    xpReward: 250,
    lcRef: "LeetCode #322 (Coin Change)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    koin = list(map(int, data[1 : 1 + n]))\n    amount = int(data[1 + n])\n    tak = float("inf")\n    dp = [0] + [tak] * amount\n    for a in range(1, amount + 1):\n        for c in koin:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    print(dp[amount] if dp[amount] < tak else -1)\n\nmain()',
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "sulit",
    statement:
      "Diberikan n bilangan non-negatif yang menggambarkan ketinggian dinding pada posisi berurutan. Setelah hujan, air tergenang di lembah-lembah di antara dinding. Cetak total banyaknya satuan air yang tertampung.\n\nAir di satu posisi dibatasi oleh dinding tertinggi di kirinya dan dinding tertinggi di kanannya; genangannya setinggi yang lebih rendah di antara keduanya, dikurangi ketinggian dinding di posisi itu.\n\n**Format input**\nBaris 1: `n`, banyaknya posisi (1 sampai 20.000)\nBaris 2: `n` ketinggian dipisah spasi\n\n**Format output**\nSatu baris: total air yang tertampung\n\n**Contoh**\nInput `12`, `0 1 0 2 1 0 1 3 2 1 2 1` menjadi `6`." +
      sumber("LeetCode #42 (Trapping Rain Water)"),
    tests: [
      { stdin: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
      { stdin: "6\n4 2 0 3 2 5", expectedOutput: "9" },
      { stdin: "3\n1 2 3", expectedOutput: "0" },
      { stdin: "5\n3 0 2 0 4", expectedOutput: "7", hidden: true },
    ],
    hints: [
      "Untuk tiap posisi, airnya = min(tinggi maksimum dari kiri, tinggi maksimum dari kanan) - tinggi di posisi itu (kalau positif).",
      "Hitung dua array prefix: maksimum dari kiri sampai i, dan maksimum dari kanan sampai i, lalu jumlahkan airnya satu per satu.",
      "Ada versi dua penunjuk yang hemat memori, tapi versi dua array sudah benar dan jauh lebih mudah dilakukan dengan tepat.",
    ],
    xpReward: 250,
    lcRef: "LeetCode #42 (Trapping Rain Water)",
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    h = list(map(int, data[1 : 1 + n]))\n    kiri = [0] * n\n    kanan = [0] * n\n    maks = 0\n    for i in range(n):\n        if h[i] > maks:\n            maks = h[i]\n        kiri[i] = maks\n    maks = 0\n    for i in range(n - 1, -1, -1):\n        if h[i] > maks:\n            maks = h[i]\n        kanan[i] = maks\n    total = 0\n    for i in range(n):\n        genang = min(kiri[i], kanan[i]) - h[i]\n        if genang > 0:\n            total += genang\n    print(total)\n\nmain()',
  },
  // ==== empat soal dasar tambahan, dibawa dari kurikulum fondasi lama ====
  {
    slug: "jumlah-dua-angka",
    title: "Jumlah Dua Angka",
    difficulty: "mudah",
    statement:
      "Baca dua bilangan bulat dari input (satu per baris), lalu cetak jumlahnya.\n\n**Format input**\nBaris 1: bilangan pertama\nBaris 2: bilangan kedua\n\n**Format output**\nSatu baris: hasil penjumlahan\n\n**Contoh**\nInput `3` dan `4` menjadi `7`." +
      sumber("soal dasar aritmetika, dipakai di kurikulum fondasi platform ini"),
    tests: [
      { stdin: "3\n4", expectedOutput: "7" },
      { stdin: "-10\n25", expectedOutput: "15" },
      { stdin: "0\n0", expectedOutput: "0" },
    ],
    hints: [
      "Baca input sebagai teks lalu ubah ke bilangan sebelum dijumlah; kalau tidak, hasilnya penggabungan teks.",
      "Perhatikan bilangan negatif: konversi biasa sudah menangani tanda minus.",
    ],
    xpReward: 100,
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    a, b = int(data[0]), int(data[1])\n    print(a + b)\n\nmain()',
  },
  {
    slug: "kata-terbalik",
    title: "Kata Terbalik",
    difficulty: "mudah",
    statement:
      "Baca satu baris teks (tanpa spasi), cetak teks yang sama dengan urutan karakter terbalik.\n\n**Format input**\nSatu baris teks tanpa spasi\n\n**Format output**\nSatu baris: teks terbalik\n\n**Contoh**\nInput `kode` menjadi `edok`." +
      sumber("soal dasar manipulasi string, dipakai di kurikulum fondasi platform ini"),
    tests: [
      { stdin: "kode", expectedOutput: "edok" },
      { stdin: "abc", expectedOutput: "cba" },
      { stdin: "aaaa", expectedOutput: "aaaa" },
    ],
    hints: [
      "Hampir semua bahasa punya cara membalik string: dari fungsi bawaan sampai loop dari belakang.",
      "Loop manual juga sah: mulai dari indeks terakhir turun ke nol sambil menempelkan karakter.",
    ],
    xpReward: 100,
    refSolution:
      'import sys\n\ndef main():\n    teks = sys.stdin.read().split()[0]\n    print(teks[::-1])\n\nmain()',
  },
  {
    slug: "hitung-vokal",
    title: "Hitung Vokal",
    difficulty: "sedang",
    statement:
      "Baca satu baris teks huruf kecil, hitung berapa banyak huruf vokal (a, i, u, e, o) di dalamnya, lalu cetak jumlahnya.\n\n**Format input**\nSatu baris teks huruf kecil\n\n**Format output**\nSatu baris: jumlah vokal\n\n**Contoh**\nInput `belajar kode` menjadi `5` (e, a, a, o, e)." +
      sumber("soal dasar perulangan dan kondisi, dipakai di kurikulum fondasi platform ini"),
    tests: [
      { stdin: "belajar kode", expectedOutput: "5" },
      { stdin: "xyz", expectedOutput: "0" },
      { stdin: "aaaaa", expectedOutput: "5" },
    ],
    hints: [
      "Iterasi tiap karakter, lalu cek keanggotaan terhadap himpunan vokal.",
      "Jangan lupa menaikkan penghitung setiap kali ketemu vokal, dan mencetaknya di akhir.",
    ],
    xpReward: 150,
    refSolution:
      'import sys\n\ndef main():\n    teks = sys.stdin.readline().rstrip("\\n")\n    jumlah = 0\n    for c in teks:\n        if c in "aiueo":\n            jumlah += 1\n    print(jumlah)\n\nmain()',
  },
  {
    slug: "statistik-mini",
    title: "Statistik Mini",
    difficulty: "sulit",
    statement:
      "Baca satu bilangan `n`, lalu baca `n` bilangan bulat (satu per baris). Cetak tiga baris:\n\n```\nmin: <nilai terkecil>\nmax: <nilai terbesar>\nrata: <rata-rata, dua angka desimal>\n```\n\n**Contoh**\nInput `3`, `4`, `10`, `7` menjadi:\n```\nmin: 4\nmax: 10\nrata: 7.00\n```" +
      sumber("soal dasar agregasi dan format keluaran, dipakai di kurikulum fondasi platform ini"),
    tests: [
      { stdin: "3\n4\n10\n7", expectedOutput: "min: 4\nmax: 10\nrata: 7.00" },
      { stdin: "1\n5", expectedOutput: "min: 5\nmax: 5\nrata: 5.00" },
      { stdin: "4\n2\n8\n-3\n9", expectedOutput: "min: -3\nmax: 9\nrata: 4.00", hidden: true },
    ],
    hints: [
      "Banyak bahasa punya bawaan untuk minimum, maksimum, dan penjumlahan daftar; pakai kalau ada.",
      "Rata-rata harus dibagi sebagai bilangan pecahan (pastikan pembaginya bukan nol bulat) lalu diformat dua desimal.",
      "Cetak tiga baris terpisah dengan label persis seperti contoh, termasuk spasi setelah titik dua.",
    ],
    xpReward: 250,
    refSolution:
      'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    n = int(data[0])\n    angka = list(map(int, data[1 : 1 + n]))\n    rata = sum(angka) / len(angka)\n    print(f"min: {min(angka)}")\n    print(f"max: {max(angka)}")\n    print(f"rata: {rata:.2f}")\n\nmain()',
  },
];
