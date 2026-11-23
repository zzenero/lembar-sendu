# Tutorial: Bikin "Lembar Sendu" di Sublime Text

Tutorial ini buat pemula. Kita pakai **Sublime Text** (ringan), bukan VS Code.
Hasil akhirnya: halaman HTML yang dibuka dengan double-click `index.html` — tanpa server, tanpa install Node.

Bentuknya **kotak / buku**, bukan lingkaran. Ada kata **Lembar Sendu** di tengah, empat sudut (**Aku**, **Pena**, **Hidup**, **Dan.**), puisi yang terbuka baris demi baris sendiri (tanpa diklik), huruf merah yang merangkai kata tersembunyi, garis yang pelan-pelan jadi seperti pizza, lalu finale.

Teks & visualnya **karya Zeen**. Untuk kode yang berlaku, salin file `index.html`, `style.css`, dan `script.js` dari folder proyek ini — potongan di bawah hanya kerangka lama, bisa sudah ketinggalan.

---

## Yang kamu butuhkan

- Komputer Windows / Mac / Linux
- Browser (Chrome / Edge / Firefox)
- Koneksi internet (sekali saja, untuk unduh Sublime + font Google)

---

## Langkah 0 — Install Sublime Text

1. Buka https://www.sublimetext.com/
2. Klik **Download**, pilih sesuai sistem operasi kamu.
3. Install seperti biasa (Next → Next → Finish).
4. Buka Sublime Text.

> Tips: di Windows, setelah install, klik kanan file `.html` → *Open with* → Sublime Text (opsional).

---

## Langkah 1 — Buat folder & file kosong

1. Buat folder di Desktop (atau mana saja), namanya: `lembar-sendu`
2. Di dalam folder itu, buat 3 file kosong:
   - `index.html`
   - `style.css`
   - `script.js`
3. Di Sublime: **File → Open Folder…** → pilih `lembar-sendu`
4. Di sidebar kiri akan muncul ketiga file. Klik `index.html` untuk mulai mengetik.

Struktur akhir:

```
lembar-sendu/
  index.html
  style.css
  script.js
  TUTORIAL.md          ← file ini (opsional)
  screenshots/         ← hasil tes (opsional)
```

**Cek:** folder berisi 3 file. Belum ada yang tampil di browser.

---

## Langkah 2 — Kerangka HTML

Buka `index.html`, hapus semua isinya, lalu **paste seluruh kode di bawah ini**. Simpan (`Ctrl+S` / `Cmd+S`).

Ada 3 layar:

1. **Hub** — kertas kosong + kata *Lembar Sendu* di tengah (nanti ditambah 4 sudut)
2. **Puisi** — judul, lalu baris muncul sendiri satu per satu, tombol Continue setelah selesai
3. **Finale** — *Lembar Sendu*, baris penutup muncul sendiri satu per satu, lalu *Mulai lagi*

Kanvas `#kanvas-tinta` dipakai JavaScript untuk menggambar noda tinta mengikuti kursor.

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Puisi Hiperlink</title>
  <meta name="description" content="Puisi interaktif berbentuk kotak: Buku, Aku, Pena, Hidup, dan." />
  <!-- Font opsional dari Google (butuh internet). Fallback: Georgia di CSS. -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Latar kertas buku bergaris (kosong, warna krem) -->
  <div class="kertas" aria-hidden="true"></div>

  <!-- Kanvas tinta: noda & riak hitam mengikuti kursor / sentuhan -->
  <canvas id="kanvas-tinta" aria-hidden="true"></canvas>

  <!-- ===== LAYAR HUB: kata Buku di tengah + empat sudut kotak ===== -->
  <section id="layar-hub" class="layar">
    <header class="kepala-halaman">
      <p class="judul-karya">Puisi Hiperlink</p>
    </header>

    <div class="panggung">
      <svg class="svg-kotak" viewBox="0 0 100 100" aria-hidden="true">
        <g id="panduan-x" class="panduan">
          <line x1="10" y1="10" x2="90" y2="90" />
          <line x1="90" y1="10" x2="10" y2="90" />
        </g>

        <g id="coretan" class="coretan">
          <path d="M32,36 C36,33 40,39 44,36" />
          <path d="M56,35 C60,32 65,38 70,34" />
          <path d="M30,64 C35,67 40,61 46,65" />
          <path d="M56,66 C61,69 67,63 72,67" />
        </g>

        <line id="jari-aku"   class="garis" x1="50" y1="50" x2="10" y2="10" />
        <line id="jari-pena"  class="garis" x1="50" y1="50" x2="90" y2="10" />
        <line id="jari-hidup" class="garis" x1="50" y1="50" x2="90" y2="90" />
        <line id="jari-dan"   class="garis" x1="50" y1="50" x2="10" y2="90" />

        <line id="tepi-atas"  class="garis" x1="10" y1="10" x2="90" y2="10" />
        <line id="tepi-kanan" class="garis" x1="90" y1="10" x2="90" y2="90" />
        <line id="tepi-bawah" class="garis" x1="90" y1="90" x2="10" y2="90" />
        <line id="tepi-kiri"  class="garis" x1="10" y1="90" x2="10" y2="10" />
      </svg>

      <button type="button" id="kata-buku">Buku</button>
      <button type="button" class="sudut" data-bab="aku" hidden>Aku</button>
      <button type="button" class="sudut" data-bab="pena" hidden>Pena</button>
      <button type="button" class="sudut" data-bab="hidup" hidden>Hidup</button>
      <button type="button" class="sudut" data-bab="dan" hidden>Dan.</button>
    </div>

    <p id="petunjuk-hub" class="petunjuk">klik Buku untuk membuka</p>
  </section>

  <!-- ===== LAYAR PUISI ===== -->
  <section id="layar-puisi" class="layar" hidden>
    <p id="label-sudut" class="label-sudut"></p>
    <div id="kata-pemicu" class="kata-pemicu" aria-label="Kata pemicu puisi"></div>
    <div id="puisi" class="puisi" aria-live="polite"></div>
    <button type="button" id="tombol-lanjut" class="tombol tombol-lanjut" hidden>Continue</button>
    <p id="petunjuk-puisi" class="petunjuk petunjuk-puisi">arahkan kursor / ketuk tiap kata</p>
  </section>

  <!-- ===== LAYAR FINALE ===== -->
  <section id="layar-akhir" class="layar" hidden>
    <div class="halaman-terbuka">
      <svg class="ombak ombak-atas" viewBox="0 0 400 40" aria-hidden="true">
        <path d="M4,22 C28,8 52,34 76,20 S124,8 148,22 S196,34 220,20 S268,8 292,22 S340,34 364,18 S388,8 398,16" />
        <path d="M8,28 C36,16 60,36 88,26 S140,14 168,28 S220,38 248,24 S300,14 332,26 S372,36 396,24" />
      </svg>

      <h2 id="judul-finale">Buku</h2>

      <p class="penutup">Yang terbuka bukan hanya kertasnya,</p>
      <p class="penutup">melainkan keempat suaranya:</p>
      <p class="penutup penutup-daftar">aku, pena, hidup, dan.</p>
      <p class="selesai">— selesai —</p>

      <svg class="ombak ombak-bawah" viewBox="0 0 400 40" aria-hidden="true">
        <path d="M2,16 C26,30 54,8 80,20 S128,34 152,18 S200,6 228,22 S276,34 304,18 S352,8 398,20" />
        <path d="M6,26 C40,14 68,34 96,24 S152,12 180,26 S232,36 264,22 S320,12 352,24 S384,34 398,28" />
      </svg>

      <button type="button" id="tombol-ulang" class="tombol">Mulai lagi</button>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>
```

**Cek:** double-click `index.html`. Kamu harusnya lihat halaman hampir kosong (belum ada CSS) dengan tulisan *Lembar Sendu*. Kalau putih polos + teks hitam default, itu normal — CSS belum dipasang.

---

## Langkah 3 — CSS: kertas, kotak, dan tipografi

Buka `style.css`. Untuk hasil yang **persis sama dan tanpa error**, salin **seluruh isi** file `style.css` yang ada di folder proyek ini (buka di Sublime, pilih semua `Ctrl+A`, salin, tempel ke file kamu, simpan).

Yang perlu kamu pahami, supaya nanti berani mengubah-ubah:

### Kertas bergaris

Kelas `.kertas` menggambar latar krem, garis horizontal samar, garis tepi merah seperti buku tulis, plus butiran kertas. Ini pengganti “air + malam” di contoh Goldfish.

### Kanvas tinta

`#kanvas-tinta` menutupi seluruh layar, `pointer-events: none` supaya tidak menghalangi klik. JavaScript yang menggambar nodanya. Posisinya di *atas* kertas, *bawah* tulisan — kata tetap kebaca.

### Panggung kotak

`.panggung` adalah kotak di tengah (ukuran `vmin` supaya proporsional di HP dan laptop). Di dalamnya:

- `#kata-buku` — oval di pusat
- `.sudut` — Aku / Pena / Hidup / Dan. di empat penjuru
- `.garis` — garis SVG yang awalnya tersembunyi (`stroke-dashoffset: 130`)
- `.garis.tergambar` — garis digambar (dashoffset jadi 0)

### Puisi

`.baris` adalah baris puisi. Kelas `.tampil` membuatnya memudar masuk sekitar 0.5 detik, satu baris per jeda baca (otomatis). Huruf yang ditandai di naskah memakai kelas `.huruf-merah`; setelah baris terakhir, huruf itu merangkai kata tersembunyi di tengah.

### Finale

`#judul-finale` adalah judul *Lembar Sendu*. Baris finale muncul satu per satu, seperti halaman puisi.

### HP

Di layar sempit (`max-width: 640px`), ukuran huruf dan tombol tengah disesuaikan supaya muat, termasuk judul *Lembar Sendu* di oval.

**Cek:** simpan CSS, refresh browser. Latar harus jadi kertas krem bergaris, *Lembar Sendu* ada di tengah dalam oval, font serif (EB Garamond kalau ada internet, kalau tidak Georgia).

---

## Langkah 4 — JavaScript: alur cerita

Buka `script.js`. Sama seperti CSS: untuk hasil persis, salin **seluruh isi** `script.js` dari folder proyek ini, simpan, lalu refresh browser.

Alurnya seperti ini:

```
awal          → hanya "Lembar Sendu" di tengah
                arahkan kursor ke Lembar Sendu (di HP, ketuk)
puisi Lembar  → judul "Lembar", lalu baris muncul sendiri satu per satu
                baris terakhir → huruf merah merangkai kata LEMBAR
                Continue (arahkan / ketuk) kembali ke hub
sudut         → muncul Aku, Pena, Hidup, Dan. + panduan X samar
                arahkan ke salah satu sudut
puisi         → judul, lalu baris muncul sendiri satu per satu
                baris terakhir → huruf merah merangkai kata tersembunyi
                Continue kembali ke hub
                sudut itu ditandai selesai + garis terhubung ke tengah
                kalau dua sudut berdampingan selesai, tepi kotaknya ikut tergambar
siap-finale   → keempat sudut selesai, garis penuh seperti pizza
                arahkan ke Lembar Sendu sekali lagi
finale        → baris penutup muncul sendiri satu per satu, tombol "Mulai lagi"
```

### Ganti teks puisinya

Semua puisi ada di objek `BAB` dekat bagian atas `script.js`. Setiap bab punya `judul`, `tersembunyi` (kata dari huruf merah), dan `bait` (kelompok baris). Huruf di dalam `[...]` akan berwarna merah:

```javascript
"Sudah [l]ama tak singgah"
```

- Teks di luar kurung tampil hitam; huruf di dalam `[ ]` tampil merah
- Setelah baris terakhir, huruf merah itu merangkai `tersembunyi` (misalnya `LEMBAR`)

Kamu boleh ganti kalimatnya. Kalau puisinya panjang, halaman puisi bisa digulir pelan-pelan.

### Efek tinta

Di bagian bawah `script.js` ada fungsi `jejakTinta`, `tambahNoda`, dan `tambahRiak`. Setiap kursor bergerak cukup jauh, sebuah noda hitam + riak lingkaran ditambahkan ke kanvas, lalu pelan-pelan memudar. Klik atau ketuk membuat cipratan lebih besar.

---

## Langkah 5 — Tes di browser

1. Simpan ketiga file (`Ctrl+S` di masing-masing tab Sublime).
2. Di folder `lembar-sendu`, double-click `index.html`.
3. Jangan buka lewat Live Server atau VS Code — file lokal (`file://`) memang sudah cukup.

Yang harus terjadi, berurutan:

1. Kertas kosong, *Lembar Sendu* di tengah. Gerakkan mouse: muncul noda tinta hitam.
2. Arahkan kursor ke *Lembar Sendu* (di HP, ketuk) → puisi *Lembar*. Baris muncul sendiri, satu per satu.
3. Setelah baris terakhir, huruf merah merangkai kata di tengah, lalu tombol **Continue**.
4. Continue → empat sudut muncul di penjuru kotak.
5. Arahkan ke *Aku* (lalu *Pena*, *Hidup*, *Dan.*) — barisnya juga muncul sendiri.
6. Continue → sudut itu menjadi redup, ada garis dari sudut ke tengah. Kalau dua sudut yang berdampingan sudah selesai, sisi kotaknya ikut tergambar.
7. Setelah keempatnya selesai, kotak + huruf X terlihat penuh (seperti pizza).
8. Arahkan ke *Lembar Sendu* sekali lagi → finale, baris muncul sendiri satu per satu.
9. **Mulai lagi** mengembalikan semua ke langkah 1.

---

## Langkah 6 — Cek error (kalau ada yang tidak jalan)

1. Di Chrome / Edge: klik kanan halaman → **Inspect** (atau `Ctrl+Shift+I`).
2. Buka tab **Console**.
3. Kalau kosong (tidak ada tulisan merah), kodenya bersih.

Error yang sering terjadi:

| Gejala | Penyebab umum | Perbaikan |
| --- | --- | --- |
| Halaman putih, tidak ada gaya | `style.css` tidak sefolder dengan `index.html`, atau namanya salah | Pastikan ketiga file satu folder, nama persis `style.css` |
| Arahkan / ketuk *Lembar Sendu* tidak terjadi apa-apa | `script.js` belum tersimpan / namanya salah | Cek Console; pastikan ada `<script src="script.js"></script>` di akhir `index.html` |
| Empat sudut tidak muncul | File JS lama, atau ada typo di `id` / `data-bab` | Bandingkan dengan file asli di folder ini |
| Font terlihat “biasa” (bukan Garamond) | Tidak ada internet, Google Fonts tidak termuat | Normal. Fallback-nya Georgia, tetap enak dibaca |
| Di HP kata saling nutup | Jendela browser terlalu sempit saat tes di laptop | Perkecil jendela, atau buka di HP sungguhan; CSS mobile sudah disiapkan |

Jangan menaruh file di dalam folder yang namanya mengandung karakter aneh, dan jangan rename `index.html` kalau kamu ingin double-click langsung jalan.

---

## Langkah 7 — Ide ubahan (setelah yang dasar jalan)

- Ganti puisi di objek `BAB` dengan tulisanmu sendiri.
- Ubah warna kertas di `:root` (`--kertas`, `--tinta`) di `style.css`.
- Tambah atau kurangi baris: sesuaikan juga jarak `top`.
- Kalau mau judul halaman berubah, edit `<title>`, teks `.judul-karya`, dan label di tombol `#kata-buku`.

Yang sebaiknya tidak diubah dulu: `id` elemen (`kata-buku`, `jari-aku`, `layar-hub`, …) karena JavaScript mencarinya dengan nama itu.

---

## Penutup

Kalau ketiga file tersimpan dan `index.html` dibuka di browser, kamu sudah punya puisi interaktif yang barisnya muncul sendiri satu per satu, dengan huruf merah yang merangkai arti lain di akhir tiap puisi. Latarnya lembar buku kosong, jejak kursornya tinta hitam, dan geometrinya kotak yang pelan-pelan jadi pizza.

Selamat menulis.

---

## Catatan tempo (pembaruan singkat)

`SKALA_INTRO_FINALE` (0.62) menakar intro finale saja: fade judul `DURASI_JUDUL_FINALE`, garis bawah `DURASI_GARIS_FINALE`, fade subtitel (baris pertama) `DURASI_SUBTITEL_FINALE`, dan jeda baca baris itu. Reveal baris puisi tidak berubah. Sisa baris finale memakai `SKALA_BARIS_FINALE` (0.7) pada fade, jeda baca, dan ganti bait.

`TEMPO` (baku 2.2) tetap menakar semua jeda. Urutan di dalam puisi: per baris, huruf merah fade penuh dulu, lalu menunggu. Teks hitam (`DURASI_FADE` / `--dur-fade-baris`, easing `--ease-hitam`, kata demi kata dengan `JEDA_KATA_HITAM`) baru muncul ketika kursor menyentuh atau mengetuk huruf merah itu. Setelah hitam selesai, `JEDA_SETELAH_BARIS` lalu baris berikutnya. `JEDA_TAHAN_BARIS_MERAH`, `JEDA_TAHAN_MERAH`, dan `JEDA_BARIS_HITAM` masih ada sebagai cadangan, tidak dipakai di urutan ini.
