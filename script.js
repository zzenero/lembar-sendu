/* =========================================
   Lembar Sendu — logika interaksi
   Vanilla JS, tanpa jQuery, bisa dibuka file://
   Semua komentar dalam Bahasa Indonesia
   ========================================= */

(function () {
  "use strict";

  /* -----------------------------------------
     1. Data puisi
        [huruf] = huruf merah (ilustrasi)
        Ejaan naskah dipertahankan apa adanya
     ----------------------------------------- */
  var BAB = {
    lembar: {
      judul: "Lembar",
      tersembunyi: ["LEMBAR"],
      bait: [
        [
          "Sudah [l]ama tak singgah",
          "Hidupmu, baik-baik saja?"
        ],
        [
          "Aku rindu.",
          "S[e]mua sendu yang kau beri",
          "Luka yang kau bagi",
          "Dan banyak hal yang tak kau [m]engerti"
        ],
        [
          "Kepada siapa semua ini [b]erlabu?",
          "Jika buka aku, kertas usangmu."
        ],
        [
          "L[a]ntas bagaimana?",
          "Hidupmu kemarin, ha[r]i ini, dan nanti."
        ]
      ]
    },
    aku: {
      judul: "Aku pulang",
      tersembunyi: ["AKU", "PULANG"],
      bait: [
        [
          "Hari ini, [a]ku hidup dengan baik",
          "Mung[k]in?"
        ],
        [
          "Wakt[u] telah dirampas",
          "Penuh kacau membekas",
          "Tangis yang tak pernah terbalas"
        ],
        [
          "Namun aku tega[p] tanpamu",
          "Merangkai sendiri di pikiran pilu",
          "Akupun tak lagi men[u]lis, enggan.",
          "Menyampaikan [l]ara dalam katapun sukar."
        ],
        [
          "[A]ku hanya diam",
          "Mematung",
          "Dan tenggelam"
        ],
        [
          "Berharap aka[n] ada yang membawaku",
          "Pulan[g]."
        ]
      ]
    },
    pena: {
      judul: "Tulis",
      tersembunyi: ["TULIS"],
      bait: [
        [
          "Kata demi ka[t]a ku tulis asal",
          "Kalimat yang terangkai seperti ocehan membual"
        ],
        [
          "It[u] caranya hidup, dulu.",
          "Beribu lembar ia habiskan hanya untuk mengenang kesedihan",
          "Itu caranya hidup, dulu."
        ],
        [
          "Sampai aku terus diganti dan",
          "Mati berka[l]i-kali",
          "Sejak saat itu aku tak lagi ia sentuh",
          "[I]a tak lagi lihai menoreh tinta dari pena sepertiku ini"
        ],
        [
          "Kalau saja dia tau",
          "Aku, [s]edang menunggu."
        ]
      ]
    },
    hidup: {
      judul: "Pintaku",
      tersembunyi: ["PINTAKU"],
      bait: [
        [
          "Lembar sendu yang tak [p]ernah disentuh pena",
          "Duka hampa yang tak pernah dipinta"
        ],
        [
          "Apa-apa yang diluar kendal[i]nya",
          "Mengalir deras menerpa batu tak bernyawa"
        ],
        [
          "Sekarang telah sadar",
          "Hidup juga layak untuk me[n]ari ria",
          "Bersolek dan menikma[t]i yang ada"
        ],
        [
          "Hidupny[a] hari ini dan nanti",
          "A[k]hirnya telah bahagia."
        ],
        [
          "Lal[u], bagaimana bisa?"
        ]
      ]
    },
    dan: {
      judul: "Dan",
      tersembunyi: ["DAN", "DAN", "DAN"],
      bait: [
        [
          "[Dan] engkau wahai tuan",
          "Membuatku bernyawa",
          "Di atas dunia fana"
        ],
        [
          "[Dan] engkau wahai tuan",
          "Penolong cinta",
          "Yang tidak pernah menjelma"
        ],
        [
          "Pada dasar apa gerangan",
          "Berani mempertaruhkan",
          "Segalanya untuk perempuan",
          "Yang tak pernah ditaklukkan."
        ],
        [
          "[Dan] engkau wahai tuan",
          "Terima kasih",
          "Sudah membawaku",
          "Pulang."
        ]
      ]
    }
  };

  var FINALE = [
    [
      "Tentang buku yang sudah tidak pernah ia gunakan",
      "Tentang pena yang telah ia tinggalkan",
      "Tak ada tulisan",
      "Tak ada kesedihan"
    ],
    [
      "Hari ini dan nanti",
      "Bersamanya",
      "Tuan si pembawa",
      "Pulang."
    ]
  ];

  var JARI = {
    aku: "jari-aku",
    pena: "jari-pena",
    hidup: "jari-hidup",
    dan: "jari-dan"
  };

  var TEPI = [
    { a: "aku",   b: "pena",  id: "tepi-atas" },
    { a: "pena",  b: "hidup", id: "tepi-kanan" },
    { a: "hidup", b: "dan",   id: "tepi-bawah" },
    { a: "dan",   b: "aku",   id: "tepi-kiri" }
  ];

  /* Satu angka untuk percepat/perlambat semua transisi.
     Nilai dasar di bawah adalah TEMPO = 1; hasil di 2.2
     mengikuti permintaan "agak slow" saat ini. */
  var TEMPO = 2.2;
  try {
    var paramTempo = new URLSearchParams(location.search).get("tempo");
    if (paramTempo != null && paramTempo !== "") {
      var nTempo = parseFloat(paramTempo);
      if (isFinite(nTempo) && nTempo > 0 && nTempo <= 8) {
        TEMPO = nTempo;
      }
    }
  } catch (eTempo) {}
  var EASE_LEMBUT = "ease-in-out";
  var EASE_HITAM = "cubic-bezier(.33, 0, .2, 1)";

  function skalaWaktu(dasarMs) {
    return Math.round(dasarMs * TEMPO);
  }

  var BASE_KELUAR = 625;           /* 1000 */
  var BASE_MASUK = 1000;           /* 1600 */
  var BASE_FADE_HURUF = 875;       /* 1400 */
  var BASE_HURUF_AWAL = 187.5;     /* 300 */
  var BASE_HURUF_ANTAR = 187.5;    /* 300 */
  var BASE_FADE_KATA = 1750;       /* 2800 */
  var BASE_FADE_MERAH = 1375;      /* 2200 */
  var BASE_MERAH_ANTAR = 250;      /* 400 */
  var BASE_TAHAN_MERAH = 1562.5;   /* 2500, cadangan alur lama */
  var BASE_FADE_BARIS = 2500;      /* 5500: fade hitam lembut */
  var BASE_TAHAN_BARIS_MERAH = 550; /* 1210: jeda setelah merah baris itu tampak */
  var BASE_JEDA_SETELAH_BARIS = 850; /* 1870: napas baca setelah hitam selesai */
  var BASE_JEDA_KATA_HITAM = 150;  /* 330: jeda antar kata hitam kiri ke kanan */
  var BASE_BARIS_HITAM = 2375;     /* 3800 */
  var BASE_BAIT_HITAM = 750;       /* 1200 */
  var BASE_JEDA_DASAR = 1600;      /* 2560 */
  var BASE_JEDA_PER_HURUF = 40;    /* 64 */
  var BASE_JEDA_MAKS = 3500;       /* 5600 */
  var BASE_JEDA_BAIT = 750;        /* 1200 */
  var BASE_JEDA_AWAL = 187.5;      /* 300 */
  var BASE_SUDUT_AWAL = 80;        /* 128 */
  var BASE_SUDUT_ANTAR = 140;      /* 224 */
  var BASE_PENGGALAN_AWAL = 160;   /* 256 */
  var BASE_PENGGALAN_ANTAR = 95;   /* 152 */
  var BASE_PANDUAN = 1350;         /* 2160 */
  var BASE_GARIS = 1250;           /* 2000 */
  var BASE_GARIS_OP = 1000;        /* 1600 */
  var BASE_JUDUL = 900;            /* 1440 */
  var BASE_PUISI = 1200;           /* 1920 */
  var BASE_SUDUT_MUNCUL = 900;     /* 1440 */
  var BASE_FADE_MASUK = 1000;      /* 1600 */
  var BASE_FADE_MASUK_PENDEK = 700;/* 1120 */
  var BASE_NAPAS = 2800;           /* 4480 */
  var BASE_HOVER = 350;            /* 560 */
  var BASE_PENGGALAN_FADE = 1150;  /* 1840 */

  var DURASI_KELUAR = skalaWaktu(BASE_KELUAR);
  var DURASI_MASUK = skalaWaktu(BASE_MASUK);
  var DURASI_FADE_HURUF = skalaWaktu(BASE_FADE_HURUF);
  var JEDA_HURUF_AWAL = skalaWaktu(BASE_HURUF_AWAL);
  var JEDA_HURUF_ANTAR = skalaWaktu(BASE_HURUF_ANTAR);
  var DURASI_FADE_KATA = skalaWaktu(BASE_FADE_KATA);
  var DURASI_FADE_MERAH = skalaWaktu(BASE_FADE_MERAH);
  var JEDA_MERAH_ANTAR = skalaWaktu(BASE_MERAH_ANTAR);
  var JEDA_TAHAN_MERAH = skalaWaktu(BASE_TAHAN_MERAH);
  var DURASI_FADE = skalaWaktu(BASE_FADE_BARIS);
  var JEDA_BARIS_HITAM = skalaWaktu(BASE_BARIS_HITAM);
  var JEDA_BAIT_HITAM = skalaWaktu(BASE_BAIT_HITAM);
  var JEDA_TAHAN_BARIS_MERAH = skalaWaktu(BASE_TAHAN_BARIS_MERAH);
  var JEDA_SETELAH_BARIS = skalaWaktu(BASE_JEDA_SETELAH_BARIS);
  var JEDA_KATA_HITAM = skalaWaktu(BASE_JEDA_KATA_HITAM);
  var JEDA_DASAR = skalaWaktu(BASE_JEDA_DASAR);
  var JEDA_PER_HURUF = skalaWaktu(BASE_JEDA_PER_HURUF);
  var JEDA_MAKS = skalaWaktu(BASE_JEDA_MAKS);
  var JEDA_BAIT = skalaWaktu(BASE_JEDA_BAIT);
  var JEDA_AWAL = skalaWaktu(BASE_JEDA_AWAL);
  /* Intro finale (judul + garis + subtitel + jeda): ~62% dari durasi lama, tidak mengubah reveal baris puisi. */
  var SKALA_INTRO_FINALE = 0.62;
  var DURASI_JUDUL_FINALE = Math.round(skalaWaktu(BASE_JUDUL) * SKALA_INTRO_FINALE);
  var DURASI_GARIS_FINALE = DURASI_JUDUL_FINALE;
  var DURASI_SUBTITEL_FINALE = Math.round(DURASI_FADE * SKALA_INTRO_FINALE);
  /* Sisa baris finale (setelah intro): ~70% fade, jeda baca, dan ganti bait. Puisi tidak berubah. */
  var SKALA_BARIS_FINALE = 0.7;
  var DURASI_FADE_FINALE = Math.round(DURASI_FADE * SKALA_BARIS_FINALE);
  var JEDA_BAIT_FINALE = Math.round(JEDA_BAIT * SKALA_BARIS_FINALE);
  var JEDA_SUDUT_AWAL = skalaWaktu(BASE_SUDUT_AWAL);
  var JEDA_SUDUT_ANTAR = skalaWaktu(BASE_SUDUT_ANTAR);
  var JEDA_PENGGALAN_AWAL = skalaWaktu(BASE_PENGGALAN_AWAL);
  var JEDA_PENGGALAN_ANTAR = skalaWaktu(BASE_PENGGALAN_ANTAR);

  function terapkanTempoKeCss() {
    var s = document.documentElement.style;
    function setDur(nama, nilai) {
      s.setProperty(nama, String(nilai) + "ms");
    }
    s.setProperty("--tempo", String(TEMPO));
    s.setProperty("--ease-lembut", EASE_LEMBUT);
    s.setProperty("--ease-hitam", EASE_HITAM);
    setDur("--dur-keluar", DURASI_KELUAR);
    setDur("--dur-masuk", DURASI_MASUK);
    setDur("--dur-fade-huruf", DURASI_FADE_HURUF);
    setDur("--dur-fade-kata", DURASI_FADE_KATA);
    setDur("--dur-fade-merah", DURASI_FADE_MERAH);
    setDur("--dur-fade-baris", DURASI_FADE);
    setDur("--jeda-kata-hitam", JEDA_KATA_HITAM);
    setDur("--dur-judul", skalaWaktu(BASE_JUDUL));
    setDur("--dur-judul-finale", DURASI_JUDUL_FINALE);
    setDur("--dur-garis-finale", DURASI_GARIS_FINALE);
    setDur("--dur-subtitile-finale", DURASI_SUBTITEL_FINALE);
    setDur("--dur-fade-finale", DURASI_FADE_FINALE);
    setDur("--dur-puisi", skalaWaktu(BASE_PUISI));
    setDur("--dur-sudut", skalaWaktu(BASE_SUDUT_MUNCUL));
    setDur("--dur-fade-masuk", skalaWaktu(BASE_FADE_MASUK));
    setDur("--dur-fade-masuk-pendek", skalaWaktu(BASE_FADE_MASUK_PENDEK));
    setDur("--dur-napas", skalaWaktu(BASE_NAPAS));
    setDur("--dur-hover", skalaWaktu(BASE_HOVER));
    setDur("--dur-penggalan", skalaWaktu(BASE_PENGGALAN_FADE));
    setDur("--dur-panduan", skalaWaktu(BASE_PANDUAN));
    setDur("--dur-garis", skalaWaktu(BASE_GARIS));
    setDur("--dur-garis-op", skalaWaktu(BASE_GARIS_OP));
  }
  terapkanTempoKeCss();

  /* -----------------------------------------
     2. Ambil elemen penting
     ----------------------------------------- */
  var layarHub = document.getElementById("layar-hub");
  var layarPuisi = document.getElementById("layar-puisi");
  var layarAkhir = document.getElementById("layar-akhir");
  var kataBuku = document.getElementById("kata-buku");
  var petunjukHub = document.getElementById("petunjuk-hub");
  var judulPuisi = document.getElementById("judul-puisi");
  var kotakPuisi = document.getElementById("puisi");
  var ilustrasiKata = document.getElementById("ilustrasi-kata");
  var tombolLanjut = document.getElementById("tombol-lanjut");
  var tombolKembali = document.getElementById("tombol-kembali");
  var tombolUlang = document.getElementById("tombol-ulang");
  var judulFinale = document.getElementById("judul-finale");
  var kotakFinale = document.getElementById("puisi-akhir");
  var kreditAkhir = document.getElementById("kredit-akhir");
  var panduanX = document.getElementById("panduan-x");
  var kanvas = document.getElementById("kanvas-tinta");

  /* -----------------------------------------
     3. State
        "awal"        = hanya Lembar Sendu di tengah
        "sudut"       = empat sudut sudah muncul
        "siap-finale" = keempat bab selesai
     ----------------------------------------- */
  var fase = "awal";
  var selesai = { aku: false, pena: false, hidup: false, dan: false };
  var babSekarang = null;
  var sudahDibuka = 0;
  var totalBaris = 0;
  var sudahTerkumpul = false;
  var modeKata = false;
  var kataSiap = false;
  var sedangSebar = false;
  var timerHuruf = [];
  var timerLain = [];
  var angkatanAnimasi = 0;
  var jejakPizza = { w: 0, h: 0 };
  var jejakSegi = { aku: null, pena: null, hidup: null, dan: null };
  var sedangSusutSudut = false;
  var modeFinale = false;
  var barisFinale = [];
  var sudahFinale = 0;
  var timerReveal = null;
  var timerTransisi = null;
  var layarSekarang = null;
  var sedangTransisi = false;
  var hoverTerkunci = false;
  var kunciPos = null;
  var lastPointer = { x: 0, y: 0 };
  var gerakSaatKunci = false;
  var antrianAksi = null;

  function gerakDikurangi() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function perangkatHover() {
    try {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch (e) {
      return true;
    }
  }

  function teksPetunjuk(frasa) {
    return perangkatHover() ? ("arahkan ke " + frasa) : ("ketuk " + frasa);
  }

  /* -----------------------------------------
     4. Ganti layar yang tampil
     ----------------------------------------- */
  function hentikanTimerDaftar(daftar) {
    var i;
    for (i = 0; i < daftar.length; i++) {
      window.clearTimeout(daftar[i]);
    }
    daftar.length = 0;
  }

  function hentikanTimerHuruf() {
    hentikanTimerDaftar(timerHuruf);
  }

  function hentikanTimerLain() {
    hentikanTimerDaftar(timerLain);
  }

  function jadwalTimer(fn, jeda, keLain) {
    var ang = angkatanAnimasi;
    var t = window.setTimeout(function () {
      var daftar = keLain ? timerLain : timerHuruf;
      var i = daftar.indexOf(t);
      if (i >= 0) { daftar.splice(i, 1); }
      /* Timer hub (sudut/penggalan) tidak terikat angkatan reveal puisi. */
      if (!keLain && ang !== angkatanAnimasi) { return; }
      fn();
    }, jeda);
    (keLain ? timerLain : timerHuruf).push(t);
    return t;
  }

  function hentikanHurufKata() {
    hentikanTimerHuruf();
    kataSiap = false;
    if (ilustrasiKata) {
      ilustrasiKata.classList.remove("siap", "pudar");
      ilustrasiKata.style.opacity = "";
      ilustrasiKata.style.animation = "";
      ilustrasiKata.style.transition = "";
    }
  }

  function bersihkanAnimasi() {
    angkatanAnimasi += 1;
    if (timerReveal) {
      window.clearTimeout(timerReveal);
      timerReveal = null;
    }
    hentikanTimerHuruf();
    hentikanTimerLain();
    hentikanHurufKata();
    sedangSebar = false;
  }

  /* Hentikan reveal puisi saja — jangan batalkan fade sudut/penggalan di hub. */
  function hentikanReveal() {
    angkatanAnimasi += 1;
    if (timerReveal) {
      window.clearTimeout(timerReveal);
      timerReveal = null;
    }
    hentikanTimerHuruf();
    hentikanHurufKata();
    sedangSebar = false;
  }

  function jadwalReveal(fn, jeda) {
    if (timerReveal) {
      window.clearTimeout(timerReveal);
      timerReveal = null;
    }
    var ang = angkatanAnimasi;
    timerReveal = window.setTimeout(function () {
      timerReveal = null;
      if (ang !== angkatanAnimasi) { return; }
      fn();
    }, jeda);
  }

  function masihDiPuisiIni(idBab) {
    if (layarPuisi && (layarPuisi.hidden || !layarPuisi.classList.contains("aktif"))) {
      return false;
    }
    if (modeFinale || modeKata) { return false; }
    if (idBab && babSekarang !== idBab) { return false; }
    return true;
  }

  function daftarLayar() {
    return [layarHub, layarPuisi, layarAkhir].filter(Boolean);
  }

  function layarAktif() {
    if (layarSekarang && !layarSekarang.hidden) { return layarSekarang; }
    var daftar = daftarLayar();
    var i;
    for (i = 0; i < daftar.length; i++) {
      if (daftar[i].classList.contains("aktif") && !daftar[i].hidden) {
        return daftar[i];
      }
    }
    return null;
  }

  function aturLayarInstan(layar) {
    daftarLayar().forEach(function (el) {
      if (el === layar) {
        el.hidden = false;
        el.classList.add("aktif");
        el.classList.remove("keluar");
      } else {
        el.hidden = true;
        el.classList.remove("aktif", "keluar");
      }
      el.style.transition = "";
      el.style.opacity = "";
    });
    layarSekarang = layar;
    sedangTransisi = false;
  }

  function selesaikanTransisi(sebelumnya, layar) {
    timerTransisi = null;
    if (sebelumnya && sebelumnya !== layar) {
      sebelumnya.hidden = true;
      sebelumnya.classList.remove("keluar", "aktif");
    }
    sedangTransisi = false;
    afterTransisi();
  }

  function tampilkan(layar) {
    var sebelumnya = layarAktif();
    if (sebelumnya && sebelumnya !== layar &&
        (sebelumnya === layarPuisi || sebelumnya === layarAkhir)) {
      hentikanReveal();
    }

    if (timerTransisi) {
      window.clearTimeout(timerTransisi);
      timerTransisi = null;
      daftarLayar().forEach(function (el) {
        if (el !== layar && el !== sebelumnya) {
          el.hidden = true;
          el.classList.remove("aktif", "keluar");
        }
      });
    }

    if (!sebelumnya || sebelumnya === layar) {
      aturLayarInstan(layar);
      return;
    }

    sedangTransisi = true;
    kunciHoverBaru();

    var durKeluar = gerakDikurangi() ? 150 : DURASI_KELUAR;
    var durMasuk = gerakDikurangi() ? 150 : DURASI_MASUK;

    layar.hidden = false;
    layar.classList.remove("keluar", "aktif");
    layar.style.transition = "none";
    layar.style.opacity = "0";
    layar.offsetWidth; /* paksa reflow supaya fade-in mulai dari nol */
    layar.style.transition = "";
    layar.style.opacity = "";

    sebelumnya.classList.remove("aktif");
    sebelumnya.classList.add("keluar");

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (layarSekarang !== layar && layar !== sebelumnya) {
          /* already superseded */
        }
        layar.classList.add("aktif");
      });
    });

    layarSekarang = layar;

    timerTransisi = window.setTimeout(function () {
      selesaikanTransisi(sebelumnya, layar);
    }, Math.max(durKeluar, durMasuk));
  }

  function semuaSelesai() {
    return selesai.aku && selesai.pena && selesai.hidup && selesai.dan;
  }

  /* -----------------------------------------
     5. Klik Lembar Sendu di hub
     ----------------------------------------- */
  function klikBuku() {
    if (sedangTransisi) {
      antreAksi(function () { klikBuku(); }, true);
      return;
    }
    if (fase === "awal") {
      masukPuisi("lembar");
    } else if (fase === "siap-finale") {
      bukaFinale();
      window.setTimeout(bersihkanTinta, 0);
    }
  }

  function bukaSudut() {
    fase = "sudut";
    var daftar = document.querySelectorAll(".sudut");
    daftar.forEach(function (tombol, i) {
      tombol.hidden = false;
      if (kursorDiElemen(tombol)) {
        tombol._perluKeluar = true;
      }
      jadwalTimer(function () {
        tombol.classList.add("muncul");
        if (kursorDiElemen(tombol)) {
          tombol._perluKeluar = true;
        }
        aturCelahTengah();
      }, JEDA_SUDUT_AWAL + i * JEDA_SUDUT_ANTAR, true);
    });
    var bingkai = document.getElementById("bingkai");
    if (bingkai) { bingkai.classList.add("tergambar"); }
    kataBuku.classList.add("diam");
    petunjukHub.textContent = teksPetunjuk("salah satu sudut");
    aturCelahTengah();
    window.requestAnimationFrame(function () {
      aturCelahTengah();
      window.requestAnimationFrame(aturCelahTengah);
    });
  }

  /* -----------------------------------------
     6. Masuk ke halaman puisi
     ----------------------------------------- */
  function masukPuisi(idBab, paksa) {
    if (sedangTransisi && !paksa) {
      antreAksi(function () { masukPuisi(idBab, paksa); }, true);
      return;
    }
    if (paksa) {
      sedangTransisi = false;
      antrianAksi = null;
    }
    if (!paksa && idBab !== "lembar" && selesai[idBab]) {
      return;
    }
    if (!BAB[idBab]) {
      return;
    }
    hentikanReveal();
    babSekarang = idBab;
    bangunPuisi(BAB[idBab]);
    if (tombolKembali) {
      tombolKembali.hidden = false;
      if (kursorDiElemen(tombolKembali)) {
        tombolKembali._perluKeluar = true;
      }
    }
    modeKata = true;
    kataSiap = false;
    sedangSebar = false;
    layarPuisi.classList.add("tahap-kata");
    tampilkanKataAwal();
    tampilkan(layarPuisi);
  }

  /* Urai [huruf] menjadi potongan teks biasa / merah */
  function uraiBaris(teks) {
    var bagian = [];
    var re = /\[(.*?)\]/g;
    var last = 0;
    var m;
    while ((m = re.exec(teks))) {
      if (m.index > last) {
        bagian.push({ t: teks.slice(last, m.index), r: false });
      }
      bagian.push({ t: m[1], r: true });
      last = m.index + m[0].length;
    }
    if (last < teks.length) {
      bagian.push({ t: teks.slice(last), r: false });
    }
    return bagian;
  }

  function tambahTeksHitam(induk, teks) {
    var potongan = teks.split(/(\s+)/);
    var k;
    var spanKata;
    for (k = 0; k < potongan.length; k++) {
      if (!potongan[k]) { continue; }
      spanKata = document.createElement("span");
      spanKata.className = "teks-hitam";
      if (!/^\s+$/.test(potongan[k])) {
        spanKata.classList.add("kata-hitam");
      }
      spanKata.textContent = potongan[k];
      induk.appendChild(spanKata);
    }
  }

  function siapkanFadeHitam(baris) {
    var kata = baris.querySelectorAll(".kata-hitam");
    var i;
    for (i = 0; i < kata.length; i++) {
      kata[i].style.setProperty("--i", String(i));
    }
    return kata.length;
  }

  function isiHuruf(induk, teks) {
    var bagian = uraiBaris(teks);
    var i;
    var j;
    var pot;
    var ch;
    var span;
    for (i = 0; i < bagian.length; i++) {
      pot = bagian[i];
      if (!pot.r) {
        tambahTeksHitam(induk, pot.t);
      } else {
        for (j = 0; j < pot.t.length; j++) {
          ch = pot.t.charAt(j);
          if (ch === " ") {
            span = document.createElement("span");
            span.className = "teks-hitam";
            span.textContent = " ";
            induk.appendChild(span);
            continue;
          }
          span = document.createElement("span");
          span.className = "huruf-merah";
          span.textContent = ch;
          induk.appendChild(span);
        }
      }
    }
  }

  function bangunPuisi(data) {
    kotakPuisi.innerHTML = "";
    ilustrasiKata.innerHTML = "";
    ilustrasiKata.classList.remove("tampil", "siap");
    tombolLanjut.hidden = true;
    layarPuisi.classList.remove("sudah-terkumpul");
    judulPuisi.textContent = data.judul;
    judulPuisi.classList.remove("tampil");

    sudahDibuka = 0;
    sudahTerkumpul = false;
    sedangSebar = false;
    modeFinale = false;

    var daftar = [];
    data.bait.forEach(function (bait) {
      var bungkus = document.createElement("div");
      bungkus.className = "bait";
      bait.forEach(function (teks) {
        var baris = document.createElement("p");
        baris.className = "baris";
        isiHuruf(baris, teks);
        bungkus.appendChild(baris);
        daftar.push(baris);
      });
      kotakPuisi.appendChild(bungkus);
    });

    daftar.forEach(function (baris, i) {
      baris.setAttribute("data-baris", String(i));
    });
    totalBaris = daftar.length;
  }

  function panjangTeks(baris) {
    return ((baris && baris.textContent) || "").replace(/\s+/g, " ").trim().length;
  }

  function jedaBaca(baris) {
    var n = panjangTeks(baris);
    var jeda = JEDA_DASAR + n * JEDA_PER_HURUF;
    if (jeda > JEDA_MAKS) {
      jeda = JEDA_MAKS;
    }
    if (n === 0) {
      jeda += JEDA_BAIT;
    }
    return jeda;
  }

  function adaGantiBait(barisIni, barisBerikut) {
    if (!barisIni || !barisBerikut) {
      return false;
    }
    return barisIni.parentNode !== barisBerikut.parentNode;
  }

  function mulaiTampilBarisPerBaris() {
    var ang = angkatanAnimasi;
    sudahDibuka = 0;
    sudahTerkumpul = false;
    if (judulPuisi) { judulPuisi.classList.add("tampil"); }
    window.requestAnimationFrame(function () {
      if (ang !== angkatanAnimasi) { return; }
      aturMuatTeksLayar();
      window.requestAnimationFrame(function () {
        if (ang !== angkatanAnimasi) { return; }
        aturMuatTeksLayar();
        tampilkanSatuBaris();
      });
    });
  }

  /* Satu baris: huruf merah fade penuh dulu, teks hitam hanya setelah kursor/ketuk menyentuh huruf merah itu. */
  function tampilkanSatuBaris() {
    if (!masihDiPuisiIni(babSekarang)) { return; }
    if (sudahTerkumpul) { return; }
    if (sudahDibuka >= totalBaris) { return; }

    var idBab = babSekarang;
    var baris = kotakPuisi.querySelector('.baris[data-baris="' + sudahDibuka + '"]');
    if (!baris) { return; }

    var meras = baris.querySelectorAll(".huruf-merah");
    var fadeMerah = gerakDikurangi() ? 0 : DURASI_FADE_MERAH;
    var antar = gerakDikurangi() ? 40 : JEDA_MERAH_ANTAR;
    var fadeHitam = gerakDikurangi() ? 0 : DURASI_FADE;

    function setelahHitam() {
      if (!masihDiPuisiIni(idBab)) { return; }
      var nKata = siapkanFadeHitam(baris);
      var antarKata = gerakDikurangi() ? 0 : JEDA_KATA_HITAM;
      var fadeHitamTotal = fadeHitam + Math.max(0, nKata - 1) * antarKata;
      baris.classList.add("tampil");
      sudahDibuka += 1;
      if (sudahDibuka >= totalBaris) {
        jadwalReveal(function () {
          if (!masihDiPuisiIni(idBab)) { return; }
          sudahTerkumpul = true;
          tampilkanLanjut();
        }, fadeHitamTotal);
        return;
      }
      var berikutnya = kotakPuisi.querySelector('.baris[data-baris="' + sudahDibuka + '"]');
      var jeda = fadeHitamTotal + (gerakDikurangi() ? 40 : JEDA_SETELAH_BARIS);
      if (adaGantiBait(baris, berikutnya)) {
        jeda += gerakDikurangi() ? 40 : JEDA_BAIT_HITAM;
      }
      jadwalReveal(tampilkanSatuBaris, jeda);
    }

    function mulaiHitam() {
      if (!masihDiPuisiIni(idBab)) { return; }
      if (baris._hitamMulai) { return; }
      baris._hitamMulai = true;
      var j;
      for (j = 0; j < meras.length; j++) {
        meras[j].classList.remove("siap-sentuh");
        meras[j]._perluKeluar = false;
      }
      setelahHitam();
    }

    if (meras.length === 0) {
      mulaiHitam();
      return;
    }

    var i;
    for (i = 0; i < meras.length; i++) {
      (function (el, delay) {
        jadwalTimer(function () {
          if (!masihDiPuisiIni(idBab)) { return; }
          el.classList.add("menetap");
        }, delay);
      })(meras[i], i * antar);
    }

    /* Arm hanya setelah fade merah selesai penuh — hitam tidak dijalankan timer. */
    jadwalTimer(function () {
      if (!masihDiPuisiIni(idBab)) { return; }
      if (baris._hitamMulai) { return; }
      var j;
      for (j = 0; j < meras.length; j++) {
        pasangHoverBuka(meras[j], mulaiHitam);
        meras[j].classList.add("siap-sentuh");
        if (!meras[j]._sentuhKlik) {
          meras[j]._sentuhKlik = true;
          meras[j].addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            mulaiHitam();
          });
        }
        if (kursorDiElemen(meras[j])) {
          meras[j]._perluKeluar = true;
        }
      }
    }, Math.max(0, meras.length - 1) * antar + fadeMerah);
  }

  function tampilkanBarisBerikutnya() {
    tampilkanSatuBaris();
  }

  function tampilkanLanjut() {
    /* Tidak ada tombol Continue. Kembali tetap tampil; hover/ketuk membuka hub. */
    if (tombolLanjut) {
      tombolLanjut.hidden = true;
    }
    if (tombolKembali) {
      tombolKembali.hidden = false;
      if (kursorDiElemen(tombolKembali)) {
        tombolKembali._perluKeluar = true;
      }
    }
    window.requestAnimationFrame(aturMuatTeksLayar);
  }

  function bangunIlustrasi(barisKata) {
    ilustrasiKata.innerHTML = "";
    if (!barisKata || !barisKata.length) { return; }

    var tumpuk = barisKata.length > 1 && barisKata.every(function (kata) {
      return kata === barisKata[0];
    });

    function isiKata(induk, kata) {
      var i;
      for (i = 0; i < kata.length; i++) {
        var span = document.createElement("span");
        span.className = "huruf-tujuan";
        span.textContent = kata.charAt(i);
        induk.appendChild(span);
      }
    }

    if (tumpuk) {
      barisKata.forEach(function (kata) {
        var baris = document.createElement("span");
        baris.className = "baris-kata";
        isiKata(baris, kata);
        ilustrasiKata.appendChild(baris);
      });
    } else {
      var baris = document.createElement("span");
      baris.className = "baris-kata";
      barisKata.forEach(function (kata, wi) {
        if (wi > 0) {
          var jarak = document.createElement("span");
          jarak.className = "jarak-kata";
          jarak.setAttribute("aria-hidden", "true");
          baris.appendChild(jarak);
        }
        isiKata(baris, kata);
      });
      ilustrasiKata.appendChild(baris);
    }
  }

  function tampilkanKataAwal() {
    var data = babSekarang ? BAB[babSekarang] : null;
    if (!data || !data.tersembunyi) {
      modeKata = false;
      layarPuisi.classList.remove("tahap-kata");
      jadwalReveal(mulaiTampilBarisPerBaris, gerakDikurangi() ? 80 : JEDA_AWAL);
      return;
    }

    bangunIlustrasi(data.tersembunyi);
    if (ilustrasiKata) {
      ilustrasiKata.setAttribute("aria-hidden", "false");
      ilustrasiKata.setAttribute("aria-label", data.tersembunyi.join(" "));
    }
    hentikanHurufKata();

    var huruf = ilustrasiKata.querySelectorAll(".huruf-tujuan");
    var awal = gerakDikurangi() ? 40 : JEDA_HURUF_AWAL;
    var antar = gerakDikurangi() ? 40 : JEDA_HURUF_ANTAR;
    var i;
    for (i = 0; i < huruf.length; i++) {
      (function (el, delay) {
        jadwalTimer(function () {
          el.classList.add("tampil");
        }, delay);
      })(huruf[i], awal + i * antar);
    }

    var fadeHuruf = gerakDikurangi() ? 0 : DURASI_FADE_HURUF;
    var armAt = awal + Math.max(0, huruf.length - 1) * antar + fadeHuruf;
    jadwalTimer(siapkanKata, armAt);
    window.requestAnimationFrame(function () {
      aturUkuranKata();
      window.requestAnimationFrame(aturUkuranKata);
    });
  }

  function aturUkuranKata() {
    if (!ilustrasiKata) { return; }
    if (!layarPuisi || !layarPuisi.classList.contains("tahap-kata")) { return; }
    ilustrasiKata.style.setProperty("--skala-kata", "1");
    var r = ilustrasiKata.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) { return; }
    var padX = 16;
    var padY = 16;
    try {
      var stil = getComputedStyle(document.documentElement);
      padX = 16 + (parseFloat(stil.getPropertyValue("--pad-aman-kiri")) || 0)
        + (parseFloat(stil.getPropertyValue("--pad-aman-kanan")) || 0);
      padY = 16 + (parseFloat(stil.getPropertyValue("--pad-aman-atas")) || 0)
        + (parseFloat(stil.getPropertyValue("--pad-aman-bawah")) || 0);
    } catch (eUkuran) {}
    var maxW = Math.max(48, window.innerWidth - padX);
    var maxH = Math.max(48, window.innerHeight - padY);
    var skala = Math.min(1, maxW / r.width, maxH / r.height);
    if (skala < 0.2) { skala = 0.2; }
    ilustrasiKata.style.setProperty("--skala-kata", String(skala));
  }

  function ungkapPuisiSekarang() {
    hentikanHurufKata();
    hentikanReveal();
    if (ilustrasiKata) {
      ilustrasiKata.innerHTML = "";
      ilustrasiKata.classList.remove("siap", "pudar", "tampil");
      ilustrasiKata.style.opacity = "";
      ilustrasiKata.style.animation = "";
      ilustrasiKata.style.transition = "";
      ilustrasiKata.style.removeProperty("--skala-kata");
      ilustrasiKata.setAttribute("aria-hidden", "true");
    }
    layarPuisi.classList.remove("tahap-kata");
    modeKata = false;
    kataSiap = false;
    sedangSebar = false;
    var meras = kotakPuisi.querySelectorAll(".huruf-merah");
    var i;
    for (i = 0; i < meras.length; i++) {
      meras[i].classList.add("menetap");
    }
    var baris = kotakPuisi.querySelectorAll(".baris");
    for (i = 0; i < baris.length; i++) {
      baris[i].classList.add("tampil");
    }
    sudahDibuka = totalBaris;
    sudahTerkumpul = true;
    if (judulPuisi) { judulPuisi.classList.add("tampil"); }
    tampilkanLanjut();
    window.requestAnimationFrame(function () {
      aturMuatTeksLayar();
      window.requestAnimationFrame(aturMuatTeksLayar);
    });
  }

  function siapkanKata() {
    if (!modeKata || !ilustrasiKata || sedangSebar) {
      return;
    }
    kataSiap = true;
    if (kursorDiElemen(ilustrasiKata)) {
      ilustrasiKata._perluKeluar = true;
    }
    ilustrasiKata.classList.add("siap");
  }

  function bukaDariKata() {
    if (sedangSebar) { return; }
    if (!modeKata) { return; }
    if (!kataSiap) { return; }
    if (layarPuisi.hidden) { return; }
    if (sedangTransisi) {
      antreAksi(function () { bukaDariKata(); }, true);
      return;
    }
    modeKata = false;
    hentikanTimerHuruf();
    kataSiap = false;
    kunciHoverBaru();
    layarPuisi.classList.remove("tahap-kata");
    fadeDariKata();
  }

  function tampilkanBarisCepat() {
    tampilkanSatuBaris();
  }

  function fadeDariKata() {
    if (sedangSebar) { return; }
    sedangSebar = true;

    var fadeOut = gerakDikurangi() ? 180 : DURASI_FADE_KATA;
    var barisSudahMulai = false;

    function mulaiBaris() {
      if (barisSudahMulai) { return; }
      barisSudahMulai = true;
      sedangSebar = false;
      if (layarPuisi && (layarPuisi.hidden || modeFinale)) { return; }
      mulaiTampilBarisPerBaris();
    }

    function tutupIlustrasi() {
      if (!ilustrasiKata) { return; }
      ilustrasiKata.innerHTML = "";
      ilustrasiKata.classList.remove("siap", "pudar");
      ilustrasiKata.style.opacity = "";
      ilustrasiKata.style.animation = "";
      ilustrasiKata.style.transition = "";
      ilustrasiKata.style.pointerEvents = "";
      ilustrasiKata.removeAttribute("aria-label");
      ilustrasiKata.setAttribute("aria-hidden", "true");
    }

    if (ilustrasiKata) {
      ilustrasiKata.style.pointerEvents = "none";
      ilustrasiKata.classList.remove("siap");
      ilustrasiKata.style.animation = "none";
      ilustrasiKata.style.opacity = String(
        parseFloat(window.getComputedStyle(ilustrasiKata).opacity) || 1
      );
      ilustrasiKata.offsetWidth;
      ilustrasiKata.classList.add("pudar");
    }

    jadwalTimer(function () {
      tutupIlustrasi();
      mulaiBaris();
    }, fadeOut);
  }

  /* -----------------------------------------
     7. Continue → kembali ke hub
     ----------------------------------------- */
  function lanjutKeHub() {
    if (sedangTransisi) {
      antreAksi(function () { lanjutKeHub(); }, true);
      return;
    }
    var id = babSekarang;
    var tuntas = sudahTerkumpul || sudahDibuka >= totalBaris;
    hentikanReveal();
    ilustrasiKata.innerHTML = "";
    ilustrasiKata.removeAttribute("aria-label");
    ilustrasiKata.setAttribute("aria-hidden", "true");
    layarPuisi.classList.remove("tahap-kata", "sudah-terkumpul");
    modeKata = false;
    sedangSebar = false;
    tombolLanjut.hidden = true;
    if (tombolKembali) {
      tombolKembali.hidden = true;
    }

    if (id === "lembar") {
      if (fase === "awal" && tuntas) {
        bukaSudut();
      }
    } else if (id && tuntas) {
      tandaiSelesai(id);
    }

    babSekarang = null;
    tampilkan(layarHub);
  }

  function tandaiSelesai(idBab) {
    selesai[idBab] = true;

    var tombol = document.querySelector('.sudut[data-bab="' + idBab + '"]');
    if (tombol) {
      tombol.classList.add("selesai");
    }

    var idJari = JARI[idBab];
    var garisJari = idJari ? document.getElementById(idJari) : null;
    if (garisJari) {
      garisJari.classList.add("tergambar");
    }

    var bingkai = document.getElementById("bingkai");
    if (bingkai) { bingkai.classList.add("tergambar"); }

    tampilkanPenggalan(idBab);

    if (semuaSelesai()) {
      fase = "siap-finale";
      kataBuku.classList.remove("diam");
      kataBuku.classList.add("menunggu-finale");
      petunjukHub.textContent = teksPetunjuk("Lembar Sendu sekali lagi");
    }
  }

  function tampilkanPenggalan(idBab) {
    var daftar = document.querySelectorAll('.penggalan[data-bab="' + idBab + '"]');
    daftar.forEach(function (el, i) {
      jadwalTimer(function () {
        el.classList.add("muncul");
        aturCelahTengah();
      }, JEDA_PENGGALAN_AWAL + i * JEDA_PENGGALAN_ANTAR, true);
    });
  }

  /* -----------------------------------------
     8. Finale: baris satu per satu, lalu Mulai lagi
     ----------------------------------------- */
  function bukaFinale() {
    if (sedangTransisi) { return; }
    bersihkanAnimasi();
    modeFinale = true;
    sudahFinale = 0;
    kotakFinale.innerHTML = "";
    tombolUlang.hidden = true;
    if (layarAkhir) { layarAkhir.classList.remove("segera"); }
    if (kreditAkhir) {
      kreditAkhir.hidden = true;
      kreditAkhir.classList.remove("tampil");
    }
    judulFinale.classList.remove("tampil");

    barisFinale = [];
    FINALE.forEach(function (bait) {
      var bungkus = document.createElement("div");
      bungkus.className = "bait";
      bait.forEach(function (teks) {
        var baris = document.createElement("p");
        baris.className = "baris";
        baris.textContent = teks;
        bungkus.appendChild(baris);
        barisFinale.push(baris);
      });
      kotakFinale.appendChild(bungkus);
    });

    tampilkan(layarAkhir);
    /* Paksa reflow supaya fade judul benar-benar berjalan (bukan loncat opacity). */
    judulFinale.offsetWidth;
    judulFinale.classList.add("tampil");
    jadwalReveal(tampilkanBarisFinale, gerakDikurangi() ? 80 : DURASI_JUDUL_FINALE);
  }

  function tampilkanBarisFinale() {
    if (layarAkhir.hidden || !modeFinale) {
      return;
    }
    if (sudahFinale >= barisFinale.length) {
      return;
    }

    var baris = barisFinale[sudahFinale];
    var intro = sudahFinale === 0;
    if (intro) { baris.classList.add("intro-akhir"); }
    baris.classList.add("tampil");
    sudahFinale += 1;

    var fade = gerakDikurangi() ? 0 : (intro ? DURASI_SUBTITEL_FINALE : DURASI_FADE_FINALE);
    if (sudahFinale >= barisFinale.length) {
      jadwalReveal(function () {
        tombolUlang.hidden = false;
        if (kreditAkhir) {
          kreditAkhir.hidden = false;
          kreditAkhir.classList.remove("tampil");
          kreditAkhir.offsetWidth;
        }
        kunciHoverBaru();
        aturMuatTeksLayar();
        jadwalReveal(function () {
          if (!modeFinale || !kreditAkhir) { return; }
          kreditAkhir.classList.add("tampil");
        }, gerakDikurangi() ? 40 : Math.round(skalaWaktu(BASE_FADE_MASUK_PENDEK) * 0.55));
      }, fade);
      return;
    }

    var berikutnya = barisFinale[sudahFinale];
    var baca = jedaBaca(baris);
    if (intro) { baca = Math.round(baca * SKALA_INTRO_FINALE); }
    else { baca = Math.round(baca * SKALA_BARIS_FINALE); }
    var jeda = fade + baca;
    if (adaGantiBait(baris, berikutnya)) {
      jeda += intro ? JEDA_BAIT : JEDA_BAIT_FINALE;
    }
    jadwalReveal(tampilkanBarisFinale, jeda);
  }

  /* -----------------------------------------
     9. Mulai lagi
     ----------------------------------------- */
  function ulangDariAwal() {
    if (sedangTransisi) {
      antreAksi(function () { ulangDariAwal(); }, true);
      return;
    }
    bersihkanAnimasi();
    fase = "awal";
    selesai = { aku: false, pena: false, hidup: false, dan: false };
    babSekarang = null;
    sudahDibuka = 0;
    totalBaris = 0;
    sudahTerkumpul = false;
    modeKata = false;
    sedangSebar = false;
    modeFinale = false;
    sudahFinale = 0;
    barisFinale = [];

    document.querySelectorAll(".sudut").forEach(function (tombol) {
      tombol.hidden = true;
      tombol.classList.remove("muncul", "selesai");
    });
    document.querySelectorAll(".garis").forEach(function (garis) {
      garis.classList.remove("tergambar");
    });
    var panduanX = document.getElementById("panduan-x");
    if (panduanX) { panduanX.classList.remove("tampil"); }
    document.querySelectorAll(".penggalan").forEach(function (el) {
      el.classList.remove("muncul");
    });

    kataBuku.classList.remove("diam", "menunggu-finale");
    petunjukHub.textContent = teksPetunjuk("Lembar Sendu");
    tombolLanjut.hidden = true;
    if (tombolKembali) {
      tombolKembali.hidden = true;
    }
    tombolUlang.hidden = true;
    if (kreditAkhir) {
      kreditAkhir.hidden = true;
      kreditAkhir.classList.remove("tampil");
    }
    kotakPuisi.innerHTML = "";
    kotakFinale.innerHTML = "";
    ilustrasiKata.innerHTML = "";
    ilustrasiKata.removeAttribute("aria-label");
    ilustrasiKata.setAttribute("aria-hidden", "true");
    layarPuisi.classList.remove("tahap-kata", "sudah-terkumpul");
    modeKata = false;
    sedangSebar = false;
    judulPuisi.textContent = "";
    judulPuisi.classList.remove("tampil");
    judulFinale.classList.remove("tampil");
    hentikanReveal();

    bersihkanTinta();
    tampilkan(layarHub);
  }

  /* -----------------------------------------
     10. Efek tinta: goresan kuas, noda organik, riak basah
     ----------------------------------------- */
  var ctx = kanvas ? kanvas.getContext("2d") : null;
  var goresan = [];
  var noda = [];
  var riak = [];
  var lastX = -1;
  var lastY = -1;
  var lastT = 0;
  var hpHalus = false;
  try {
    hpHalus = window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
  } catch (e) {
    hpHalus = false;
  }
  var MAX_GORESAN = hpHalus ? 140 : 460;
  var MAX_NODA = hpHalus ? 36 : 64;
  var MAX_RIAK = hpHalus ? 16 : 28;
  var JARAK_SEGMEN = hpHalus ? 4.2 : 2.5;
  var tintaW = 0;
  var tintaH = 0;
  var MARGIN_TINTA = 10;

  function kotakAmanTinta() {
    var m = MARGIN_TINTA;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var kiri = m;
    var atas = m;
    var kanan = Math.max(kiri + 1, w - m);
    var bawah = Math.max(atas + 1, h - m);
    try {
      var stil = getComputedStyle(document.documentElement);
      function bacaPad(nama, cadangan) {
        var n = parseFloat(stil.getPropertyValue(nama));
        return isFinite(n) ? Math.max(cadangan, n) : cadangan;
      }
      kiri = bacaPad("--pad-aman-kiri", m);
      atas = bacaPad("--pad-aman-atas", m);
      kanan = w - bacaPad("--pad-aman-kanan", m);
      bawah = h - bacaPad("--pad-aman-bawah", m);
    } catch (ePad) {}
    if (kanan - kiri < 40) {
      kiri = Math.min(m, w * 0.04);
      kanan = w - kiri;
    }
    if (bawah - atas < 40) {
      atas = Math.min(m, h * 0.04);
      bawah = h - atas;
    }
    return { x0: kiri, y0: atas, x1: kanan, y1: bawah };
  }

  function jepitTitik(x, y, r) {
    var b = kotakAmanTinta();
    r = r || 0;
    var x0 = b.x0 + r;
    var y0 = b.y0 + r;
    var x1 = b.x1 - r;
    var y1 = b.y1 - r;
    if (x1 < x0) {
      x0 = (b.x0 + b.x1) / 2;
      x1 = x0;
    }
    if (y1 < y0) {
      y0 = (b.y0 + b.y1) / 2;
      y1 = y0;
    }
    return {
      x: Math.min(x1, Math.max(x0, x)),
      y: Math.min(y1, Math.max(y0, y))
    };
  }

  function skalaTinta(wBaru, hBaru) {
    if (!(tintaW > 0 && tintaH > 0) || (tintaW === wBaru && tintaH === hBaru)) {
      tintaW = wBaru;
      tintaH = hBaru;
      return;
    }
    var s = Math.min(wBaru / tintaW, hBaru / tintaH);
    var ox = (wBaru - tintaW * s) / 2;
    var oy = (hBaru - tintaH * s) / 2;
    function peta(x, y, r) {
      return jepitTitik(x * s + ox, y * s + oy, r || 0);
    }
    var i;
    var p1;
    var p2;
    for (i = 0; i < goresan.length; i++) {
      p1 = peta(goresan[i].x1, goresan[i].y1, goresan[i].lebar);
      p2 = peta(goresan[i].x2, goresan[i].y2, goresan[i].lebar);
      goresan[i].x1 = p1.x;
      goresan[i].y1 = p1.y;
      goresan[i].x2 = p2.x;
      goresan[i].y2 = p2.y;
      goresan[i].lebar *= s;
    }
    for (i = 0; i < noda.length; i++) {
      p1 = peta(noda[i].x, noda[i].y, noda[i].r * (noda[i].stretch || 1) * 1.32);
      noda[i].x = p1.x;
      noda[i].y = p1.y;
      noda[i].r *= s;
    }
    for (i = 0; i < riak.length; i++) {
      p1 = peta(riak[i].x, riak[i].y, (riak[i].max || riak[i].r) + (riak[i].amp || 0) + (riak[i].lebar || 0));
      riak[i].x = p1.x;
      riak[i].y = p1.y;
      riak[i].r *= s;
      riak[i].max *= s;
      riak[i].amp *= s;
      riak[i].lebar *= s;
    }
    if (lastX >= 0) {
      p1 = peta(lastX, lastY, 0);
      lastX = p1.x;
      lastY = p1.y;
    }
    tintaW = wBaru;
    tintaH = hBaru;
  }

  function batasGambarTinta() {
    var b = kotakAmanTinta();
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    function masuk(x, y) {
      if (x < minX) { minX = x; }
      if (y < minY) { minY = y; }
      if (x > maxX) { maxX = x; }
      if (y > maxY) { maxY = y; }
    }
    var i;
    for (i = 0; i < goresan.length; i++) {
      var g = goresan[i];
      var lg = (g.lebar * 2.15) / 2;
      masuk(g.x1 - lg, g.y1 - lg);
      masuk(g.x2 + lg, g.y2 + lg);
    }
    for (i = 0; i < noda.length; i++) {
      var n = noda[i];
      var rn = n.r * (n.stretch || 1) * 1.32;
      masuk(n.x - rn, n.y - rn);
      masuk(n.x + rn, n.y + rn);
    }
    for (i = 0; i < riak.length; i++) {
      var r = riak[i];
      var rr = r.r + (r.amp || 0) + (r.lebar || 0);
      masuk(r.x - rr, r.y - rr);
      masuk(r.x + rr, r.y + rr);
    }
    if (!isFinite(minX)) {
      return { kosong: true, x: 0, y: 0, w: 0, h: 0, clip: b };
    }
    var visX0 = Math.max(minX, b.x0);
    var visY0 = Math.max(minY, b.y0);
    var visX1 = Math.min(maxX, b.x1);
    var visY1 = Math.min(maxY, b.y1);
    return {
      kosong: false,
      x: visX0,
      y: visY0,
      w: Math.max(0, visX1 - visX0),
      h: Math.max(0, visY1 - visY0),
      raw: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
      clip: b
    };
  }

  function ukuranKanvas() {
    if (!kanvas || !ctx) { return; }
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = window.innerWidth;
    var h = window.innerHeight;
    skalaTinta(w, h);
    kanvas.width = Math.floor(w * dpr);
    kanvas.height = Math.floor(h * dpr);
    kanvas.style.width = w + "px";
    kanvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function acak(min, max) {
    return min + Math.random() * (max - min);
  }

  function buatGoyang(jumlah) {
    var arr = [];
    var i;
    for (i = 0; i < jumlah; i++) {
      arr.push(acak(0.68, 1.32));
    }
    return arr;
  }

  function tambahGoresan(x1, y1, x2, y2, lebar, op) {
    if (goresan.length >= MAX_GORESAN) {
      goresan.shift();
    }
    var r = Math.max(0.5, (lebar || 1) * 1.08);
    var a = jepitTitik(x1, y1, r);
    var b = jepitTitik(x2, y2, r);
    goresan.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      lebar: lebar,
      op: op,
      fade: 0.0032
    });
  }

  function tambahNodaOrganik(x, y, kuat, radiusPaksa) {
    if (noda.length >= MAX_NODA) {
      noda.shift();
    }
    var rNoda = radiusPaksa != null ? radiusPaksa : (kuat ? acak(7, 13) : acak(2.4, 5.8));
    var pNoda = jepitTitik(x + acak(-1.4, 1.4), y + acak(-1.4, 1.4), rNoda * 1.4);
    noda.push({
      x: pNoda.x,
      y: pNoda.y,
      r: rNoda,
      op: kuat ? acak(0.30, 0.46) : acak(0.18, 0.32),
      fade: kuat ? 0.0038 : 0.0046,
      rot: acak(0, Math.PI * 2),
      stretch: kuat ? acak(0.82, 1.22) : acak(0.68, 1.38),
      goyang: buatGoyang(10),
      tumbuh: kuat ? 0.022 : 0.012
    });
  }

  function tambahRiakOrganik(x, y, kuat, urutan) {
    if (riak.length >= MAX_RIAK) {
      riak.shift();
    }
    var tunda = (urutan || 0) * 0.35;
    var maxR = kuat ? acak(46, 78) - urutan * 8 : acak(16, 30);
    if (maxR < 8) { maxR = 8; }
    var pRiak = jepitTitik(x, y, maxR + 6);
    riak.push({
      x: pRiak.x,
      y: pRiak.y,
      r: kuat ? (2.4 + tunda) : 1.2,
      max: maxR,
      op: kuat ? (0.40 - urutan * 0.07) : 0.26,
      lebar: kuat ? (2.0 - urutan * 0.25) : 1.05,
      speed: kuat ? (1.05 + urutan * 0.15) : 0.62,
      fade: kuat ? 0.006 : 0.008,
      fase: acak(0, Math.PI * 2),
      amp: kuat ? acak(2.0, 4.2) : acak(1.0, 2.0)
    });
  }

  function gambarNoda(n) {
    var titik = n.goyang.length;
    var i;
    ctx.beginPath();
    for (i = 0; i <= titik; i++) {
      var a = (i / titik) * Math.PI * 2 + n.rot;
      var g = n.goyang[i % n.goyang.length];
      var rx = n.r * n.stretch * g;
      var ry = n.r / n.stretch * g;
      var px = n.x + Math.cos(a) * rx;
      var py = n.y + Math.sin(a) * ry;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(18, 12, 9, " + n.op + ")";
    ctx.fill();
  }

  function gambarRiak(r) {
    var titik = 36;
    var i;
    ctx.beginPath();
    for (i = 0; i <= titik; i++) {
      var a = (i / titik) * Math.PI * 2;
      var gelombang = Math.sin(a * 5 + r.fase) * r.amp
        + Math.sin(a * 3 - r.fase * 1.3) * r.amp * 0.45;
      var rr = r.r + gelombang;
      var px = r.x + Math.cos(a) * rr;
      var py = r.y + Math.sin(a) * rr;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(16, 11, 8, " + (r.op * 0.35) + ")";
    ctx.lineWidth = Math.max(0.4, r.lebar * 2.15);
    ctx.stroke();
    ctx.strokeStyle = "rgba(14, 10, 8, " + r.op + ")";
    ctx.lineWidth = Math.max(0.35, r.lebar);
    ctx.stroke();
  }

  function cipratan(x, y) {
    tambahNodaOrganik(x, y, true);
    var k;
    for (k = 0; k < (hpHalus ? 3 : 6); k++) {
      var sudut = acak(0, Math.PI * 2);
      var jauh = acak(7, 26);
      tambahNodaOrganik(
        x + Math.cos(sudut) * jauh,
        y + Math.sin(sudut) * jauh,
        false,
        acak(1.3, 3.8)
      );
    }
  }

  function jejakTinta(x, y, kuat) {
    var p = jepitTitik(x, y, 6);
    if (kuat) {
      cipratan(p.x, p.y);
    } else {
      tambahNodaOrganik(p.x, p.y, false);
    }
  }

  function bersihkanTinta() {
    goresan.length = 0;
    noda.length = 0;
    riak.length = 0;
    lastX = -1;
    lastY = -1;
    if (ctx && kanvas) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function gambarTinta() {
    if (!ctx) { return; }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.save();
    var aman = kotakAmanTinta();
    ctx.beginPath();
    ctx.rect(aman.x0, aman.y0, Math.max(0, aman.x1 - aman.x0), Math.max(0, aman.y1 - aman.y0));
    ctx.clip();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var i;
    for (i = goresan.length - 1; i >= 0; i--) {
      var g = goresan[i];
      ctx.beginPath();
      ctx.moveTo(g.x1, g.y1);
      ctx.lineTo(g.x2, g.y2);
      ctx.strokeStyle = "rgba(28, 18, 12, " + (g.op * 0.22) + ")";
      ctx.lineWidth = g.lebar * 2.15;
      ctx.stroke();
      ctx.strokeStyle = "rgba(16, 11, 8, " + g.op + ")";
      ctx.lineWidth = g.lebar;
      ctx.stroke();
      g.op -= g.fade;
      if (g.op <= 0) {
        goresan.splice(i, 1);
      }
    }

    for (i = noda.length - 1; i >= 0; i--) {
      gambarNoda(noda[i]);
      noda[i].op -= noda[i].fade;
      noda[i].r += noda[i].tumbuh;
      var maxNoda = Math.min(
        noda[i].x - aman.x0,
        aman.x1 - noda[i].x,
        noda[i].y - aman.y0,
        aman.y1 - noda[i].y
      ) / ((noda[i].stretch || 1) * 1.32);
      if (noda[i].r > maxNoda) { noda[i].r = Math.max(0.2, maxNoda); }
      if (noda[i].op <= 0) {
        noda.splice(i, 1);
      }
    }

    for (i = riak.length - 1; i >= 0; i--) {
      gambarRiak(riak[i]);
      riak[i].r += riak[i].speed;
      riak[i].op -= riak[i].fade;
      riak[i].lebar *= 0.988;
      riak[i].amp *= 1.008;
      var maxRiak = Math.min(
        riak[i].x - aman.x0,
        aman.x1 - riak[i].x,
        riak[i].y - aman.y0,
        aman.y1 - riak[i].y
      ) - (riak[i].amp || 0) - (riak[i].lebar || 0);
      if (riak[i].r > maxRiak) { riak[i].r = Math.max(0.2, maxRiak); }
      if (riak[i].max > maxRiak) { riak[i].max = maxRiak; }
      if (riak[i].op <= 0 || riak[i].r > riak[i].max) {
        riak.splice(i, 1);
      }
    }

    ctx.restore();
    window.requestAnimationFrame(gambarTinta);
  }

  function jejakKursorAktif(jenis) {
    if (jenis === "touch") { return false; }
    try {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return false;
      }
    } catch (eJejak) {}
    /* Kanvas tinta pointer-events: none, jadi tidak menghalangi hover huruf merah. */
    return true;
  }

  function onPointerMove(x, y, jenis) {
    if (!jejakKursorAktif(jenis)) { return; }
    var jepitMasuk = jepitTitik(x, y, 4);
    x = jepitMasuk.x;
    y = jepitMasuk.y;
    var sekarang = (window.performance && performance.now) ? performance.now() : Date.now();
    if (lastX < 0) {
      lastX = x;
      lastY = y;
      lastT = sekarang;
      tambahNodaOrganik(x, y, false, acak(1.8, 3.4));
      return;
    }

    var dx = x - lastX;
    var dy = y - lastY;
    var jarak = Math.sqrt(dx * dx + dy * dy);
    if (jarak < 1.5) {
      return;
    }

    if (jarak > 80) {
      lastX = x;
      lastY = y;
      lastT = sekarang;
      return;
    }

    var dt = Math.max(8, sekarang - lastT);
    var kecepatan = jarak / dt;
    var sudut = Math.atan2(dy, dx);
    var tebal = Math.max(1.1, 2.4 - Math.min(kecepatan, 0.45) * 2.2);
    var op = Math.min(0.28, 0.12 + tebal * 0.04);
    var langkah = Math.max(1, Math.ceil(jarak / JARAK_SEGMEN));
    var px = lastX;
    var py = lastY;
    var i;
    for (i = 1; i <= langkah; i++) {
      var t = i / langkah;
      var nx = lastX + dx * t;
      var ny = lastY + dy * t;
      var goyang = (Math.random() - 0.5) * 0.6;
      var wx = nx - Math.sin(sudut) * goyang;
      var wy = ny + Math.cos(sudut) * goyang;
      var w = tebal * (0.8 + Math.random() * 0.4);
      tambahGoresan(px, py, wx, wy, w, op * (0.82 + Math.random() * 0.28));
      px = wx;
      py = wy;
    }

    if (kecepatan < 0.16 && Math.random() < 0.35) {
      tambahNodaOrganik(x, y, false, acak(1.6, 3.2));
    }

    lastX = x;
    lastY = y;
    lastT = sekarang;
  }

  /* -----------------------------------------
     10b. Celah garis di sekitar teks tengah
     ----------------------------------------- */
  function titikBerat(pts) {
    var x = 0;
    var y = 0;
    var i;
    for (i = 0; i < pts.length; i++) {
      x += pts[i][0];
      y += pts[i][1];
    }
    return [x / pts.length, y / pts.length];
  }

  function segiMasuk(pts, pad) {
    var c = titikBerat(pts);
    return pts.map(function (p) {
      var dx = c[0] - p[0];
      var dy = c[1] - p[1];
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var t = Math.min(0.42, pad / len);
      return [p[0] + dx * t, p[1] + dy * t];
    });
  }

  function segiBerisiTitik(p, a, b, c) {
    function silang(p1, p2, p3) {
      return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
    }
    var d1 = silang(p, a, b);
    var d2 = silang(p, b, c);
    var d3 = silang(p, c, a);
    var neg = d1 < -0.02 || d2 < -0.02 || d3 < -0.02;
    var pos = d1 > 0.02 || d2 > 0.02 || d3 > 0.02;
    return !(neg && pos);
  }

  function kotakDiDalamSegi(r, s, tri, marginPx) {
    marginPx = marginPx || 0;
    var pts = [
      [r.left - marginPx, r.top - marginPx],
      [r.right + marginPx, r.top - marginPx],
      [r.right + marginPx, r.bottom + marginPx],
      [r.left - marginPx, r.bottom + marginPx]
    ];
    var i;
    for (i = 0; i < pts.length; i++) {
      var p = [
        (pts[i][0] - s.left) / s.width * 100,
        (pts[i][1] - s.top) / s.height * 100
      ];
      if (!segiBerisiTitik(p, tri[0], tri[1], tri[2])) { return false; }
    }
    return true;
  }

  function puncakSegi(tri) {
    var best = 0;
    var bestD = Infinity;
    var i;
    for (i = 0; i < tri.length; i++) {
      var dx = tri[i][0] - 50;
      var dy = tri[i][1] - 50;
      var d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /* Titik di area terbuka segi: dari tengah alas menuju puncak, bukan centroid (yang condong ke tepi kotak). */
  function titikDalamSegi(tri) {
    var iP = puncakSegi(tri);
    var puncak = tri[iP];
    var a = tri[(iP + 1) % 3];
    var b = tri[(iP + 2) % 3];
    var mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return [
      mid[0] + (puncak[0] - mid[0]) * 0.4,
      mid[1] + (puncak[1] - mid[1]) * 0.4
    ];
  }

  function rangkaiMuat(rangkai, s, tri, marginPx) {
    var muncul = rangkai.querySelectorAll(".penggalan.muncul");
    var daftar = muncul.length ? muncul : [rangkai];
    var i;
    for (i = 0; i < daftar.length; i++) {
      var r = daftar[i].getBoundingClientRect();
      if (r.width < 1 || r.height < 1) { continue; }
      if (!kotakDiDalamSegi(r, s, tri, marginPx)) { return false; }
    }
    return true;
  }

  function muatkanRangkai(rangkai, s, tri) {
    if (!rangkai) { return; }
    var marginPx = Math.max(6, Math.min(s.width, s.height) * 0.022);
    var c0 = titikDalamSegi(tri);
    var puncak = tri[puncakSegi(tri)];

    function coba(c) {
      tempatkanDiKotak(rangkai, c[0], c[1]);
      return rangkaiMuat(rangkai, s, tri, marginPx);
    }

    var langkah;
    var t;
    var fs;
    for (langkah = 0; langkah < 20; langkah++) {
      if (coba(c0)) { return; }
      var ok = false;
      for (t = 0.08; t <= 0.88; t += 0.08) {
        if (coba([
          c0[0] + (puncak[0] - c0[0]) * t,
          c0[1] + (puncak[1] - c0[1]) * t
        ])) { ok = true; break; }
      }
      if (ok) { return; }
      fs = parseFloat(window.getComputedStyle(rangkai).fontSize) || 16;
      if (fs <= 7) { coba(c0); return; }
      rangkai.style.fontSize = Math.max(7, fs * 0.88) + "px";
    }
  }

  function aturClipWilayah(idBab, tri) {
    var el = document.querySelector(".wilayah-" + idBab);
    if (!el) { return; }
    var clip = segiMasuk(tri, 1.05);
    el.style.clipPath = "polygon(" + clip.map(function (p) {
      return p[0].toFixed(2) + "% " + p[1].toFixed(2) + "%";
    }).join(", ") + ")";
  }

  function tempatkanDiKotak(el, xPct, yPct) {
    if (!el) { return; }
    el.style.left = xPct + "%";
    el.style.top = yPct + "%";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.transform = "translate(-50%, -50%)";
  }

  function kecilkanSampaiMuat(el, s, tri) {
    if (!el) { return; }
    var langkah = 0;
    while (langkah < 14) {
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) { return; }
      if (kotakDiDalamSegi(r, s, tri, 1.5)) { return; }
      var fs = parseFloat(window.getComputedStyle(el).fontSize) || 16;
      if (fs <= 10) { return; }
      el.style.fontSize = Math.max(10, fs * 0.9) + "px";
      el.style.padding = "0.2em 0.3em";
      langkah += 1;
    }
  }

  function aturUkuranTengah(s, h, pizzaBerubah) {
    if (!kataBuku) { return; }
    if (pizzaBerubah) {
      kataBuku.style.fontSize = "";
      kataBuku.style.padding = "";
    }
    var maxW = (h * 2 - 2) / 100 * s.width;
    var maxH = (h * 2 - 2) / 100 * s.height;
    var langkah = 0;
    while (langkah < 12) {
      var r = kataBuku.getBoundingClientRect();
      if (r.width <= maxW && r.height <= maxH) { return; }
      var fs = parseFloat(window.getComputedStyle(kataBuku).fontSize) || 16;
      if (fs <= 11) { return; }
      kataBuku.style.fontSize = Math.max(11, fs * 0.9) + "px";
      kataBuku.style.padding = "0.4em 0.55em";
      langkah += 1;
    }
  }


  function kotakTeksDalamSvg(s) {
    var r = kataBuku.getBoundingClientRect();
    var pad = 1;
    return {
      left: (r.left - pad - s.left) / s.width * 100,
      top: (r.top - pad - s.top) / s.height * 100,
      right: (r.right + pad - s.left) / s.width * 100,
      bottom: (r.bottom + pad - s.top) / s.height * 100
    };
  }

  /* Potong garis dari ujung kotak ke (50,50) di tepi blok teks, tanpa celah. */
  function potongKeKotak(x0, y0, box) {
    var dx = 50 - x0;
    var dy = 50 - y0;
    var daftar = [];
    function coba(t, x, y, tegak) {
      if (t <= 0.001 || t > 1) { return; }
      if (tegak) {
        if (y >= box.top - 0.05 && y <= box.bottom + 0.05) { daftar.push(t); }
      } else if (x >= box.left - 0.05 && x <= box.right + 0.05) {
        daftar.push(t);
      }
    }
    if (dx !== 0) {
      coba((box.left - x0) / dx, box.left, y0 + dy * ((box.left - x0) / dx), true);
      coba((box.right - x0) / dx, box.right, y0 + dy * ((box.right - x0) / dx), true);
    }
    if (dy !== 0) {
      coba((box.top - y0) / dy, x0 + dx * ((box.top - y0) / dy), box.top, false);
      coba((box.bottom - y0) / dy, x0 + dx * ((box.bottom - y0) / dy), box.bottom, false);
    }
    if (!daftar.length) {
      return [x0 + dx * 0.62, y0 + dy * 0.62];
    }
    var t = Math.min.apply(null, daftar);
    return [x0 + dx * t, y0 + dy * t];
  }

  var sudutLuarTip = {
    aku:   [2, 2],
    pena:  [98, 2],
    hidup: [98, 98],
    dan:   [2, 98]
  };
  var sudutLuarArah = {
    aku:   { ox: -1, oy: -1, tx: "-100%", ty: "-100%" },
    pena:  { ox:  1, oy: -1, tx: "0", ty: "-100%" },
    hidup: { ox:  1, oy:  1, tx: "0", ty: "0" },
    dan:   { ox: -1, oy:  1, tx: "-100%", ty: "0" }
  };

  function batasAmanSudut() {
    var stil = getComputedStyle(document.documentElement);
    function pad(nama) {
      return parseFloat(stil.getPropertyValue(nama)) || 0;
    }
    var kiri = pad("--pad-aman-kiri") + 4;
    var kanan = window.innerWidth - pad("--pad-aman-kanan") - 4;
    var atas = pad("--pad-aman-atas") + 4;
    var bawah = window.innerHeight - pad("--pad-aman-bawah") - 4;
    var kepala = document.querySelector(".kepala-halaman");
    if (kepala) {
      var hk = kepala.getBoundingClientRect();
      if (hk.height > 2) { atas = Math.max(atas, hk.bottom + 2); }
    }
    var petunjuk = document.getElementById("petunjuk-hub");
    if (petunjuk) {
      var hp = petunjuk.getBoundingClientRect();
      if (hp.height > 2) { bawah = Math.min(bawah, hp.top - 2); }
    }
    return { kiri: kiri, kanan: kanan, atas: atas, bawah: bawah };
  }

  function tempatkanSudutLuar(tombol, idBab, s) {
    var tip = sudutLuarTip[idBab];
    var arah = sudutLuarArah[idBab];
    if (!tombol || !tip || !arah) { return; }
    var gap = Math.max(8, Math.min(s.width, s.height) * 0.018);
    tombol.style.left = (tip[0] / 100 * s.width + arah.ox * gap) + "px";
    tombol.style.top = (tip[1] / 100 * s.height + arah.oy * gap) + "px";
    tombol.style.right = "auto";
    tombol.style.bottom = "auto";
    tombol.style.transform = "translate(" + arah.tx + ", " + arah.ty + ")";
  }

  function kelebihanSudut() {
    var aman = batasAmanSudut();
    var lebih = 0;
    var daftar = document.querySelectorAll(".sudut");
    var i;
    for (i = 0; i < daftar.length; i++) {
      var el = daftar[i];
      if (el.hidden) { continue; }
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) { continue; }
      if (r.left < aman.kiri) { lebih = Math.max(lebih, aman.kiri - r.left); }
      if (r.top < aman.atas) { lebih = Math.max(lebih, aman.atas - r.top); }
      if (r.right > aman.kanan) { lebih = Math.max(lebih, r.right - aman.kanan); }
      if (r.bottom > aman.bawah) { lebih = Math.max(lebih, r.bottom - aman.bawah); }
    }
    return lebih;
  }

  function aturCelahTengah() {
    var svg = document.querySelector(".svg-kotak");
    var tulang = document.querySelector(".tulang-kotak");
    if (!svg || !kataBuku || !tulang) { return; }
    var s = svg.getBoundingClientRect();
    if (s.width < 10 || s.height < 10) { return; }

    var pizzaBerubah = Math.abs(s.width - jejakPizza.w) > 1 || Math.abs(s.height - jejakPizza.h) > 1;
    jejakPizza.w = s.width;
    jejakPizza.h = s.height;

    if (pizzaBerubah) {
      kataBuku.style.fontSize = "";
      kataBuku.style.padding = "";
    }
    var t = kataBuku.getBoundingClientRect();
    if (t.width < 2) { return; }

    var gap = Math.max(14, Math.min(s.width, s.height) * 0.045);
    var cx = s.left + s.width / 2;
    var cy = s.top + s.height / 2;
    var hx = (Math.max(cx - t.left, t.right - cx) + gap) / s.width * 100;
    var hy = (Math.max(cy - t.top, t.bottom - cy) + gap) / s.height * 100;
    var h = Math.min(hx, hy);
    if (h < 7) { h = 7; }
    if (h > 20) { h = 20; }

    aturUkuranTengah(s, h, pizzaBerubah);
    t = kataBuku.getBoundingClientRect();
    hx = (Math.max(cx - t.left, t.right - cx) + gap) / s.width * 100;
    hy = (Math.max(cy - t.top, t.bottom - cy) + gap) / s.height * 100;
    h = Math.min(hx, hy);
    if (h < 7) { h = 7; }
    if (h > 20) { h = 20; }

    var luar = {
      aku:   [2, 2],
      pena:  [98, 2],
      hidup: [98, 98],
      dan:   [2, 98]
    };
    var kotakTeks = kotakTeksDalamSvg(s);
    var dalam = {
      aku:   potongKeKotak(luar.aku[0], luar.aku[1], kotakTeks),
      pena:  potongKeKotak(luar.pena[0], luar.pena[1], kotakTeks),
      hidup: potongKeKotak(luar.hidup[0], luar.hidup[1], kotakTeks),
      dan:   potongKeKotak(luar.dan[0], luar.dan[1], kotakTeks)
    };

    /* Segitiga visual: sisi kotak + puncak di tepi blok teks tengah. */
    var segi = {
      aku:   [[2, 2], [98, 2], [50, kotakTeks.top]],
      pena:  [[98, 2], [98, 98], [kotakTeks.right, 50]],
      hidup: [[98, 98], [2, 98], [50, kotakTeks.bottom]],
      dan:   [[2, 98], [2, 2], [kotakTeks.left, 50]]
    };
    var luarArah = {
      aku:   [0, -1],
      pena:  [1, 0],
      hidup: [0, 1],
      dan:   [-1, 0]
    };

    Object.keys(dalam).forEach(function (id) {
      var d = dalam[id];
      var l = luar[id];
      var jari = document.getElementById("jari-" + id);
      if (jari) {
        jari.setAttribute("x1", String(d[0]));
        jari.setAttribute("y1", String(d[1]));
        jari.setAttribute("x2", String(l[0]));
        jari.setAttribute("y2", String(l[1]));
      }
    });

    var bingkaiEl = document.getElementById("bingkai");
    if (bingkaiEl) {
      bingkaiEl.setAttribute("x", "2");
      bingkaiEl.setAttribute("y", "2");
      bingkaiEl.setAttribute("width", "96");
      bingkaiEl.setAttribute("height", "96");
    }

    var padSvg = Math.max(5, 18 / (Math.min(s.width, s.height) / 100));
    var idBab;
    var daftarBab = ["aku", "pena", "hidup", "dan"];
    for (var bi = 0; bi < daftarBab.length; bi++) {
      idBab = daftarBab[bi];
      var aman = segiMasuk(segi[idBab], padSvg);
      var cSegi = titikDalamSegi(segi[idBab]);
      jejakSegi[idBab] = segi[idBab];
      aturClipWilayah(idBab, segi[idBab]);
      var tombol = document.querySelector('.sudut[data-bab="' + idBab + '"]');
      var rangkai = document.querySelector(".wilayah-" + idBab + " .rangkai-segi");
      var adaPenggalan = false;
      if (rangkai) {
        var muncul = rangkai.querySelectorAll(".penggalan.muncul");
        adaPenggalan = muncul.length > 0;
        if (pizzaBerubah) {
          rangkai.style.fontSize = "";
          rangkai.style.maxWidth = "";
        }
      }
      if (tombol && pizzaBerubah) {
        tombol.style.fontSize = "";
        tombol.style.padding = "";
      }

      if (rangkai) {
        tempatkanDiKotak(rangkai, cSegi[0], cSegi[1]);
      }
      if (tombol && !tombol.hidden) {
        tempatkanSudutLuar(tombol, idBab, s);
      }
      if (rangkai && adaPenggalan) {
        muatkanRangkai(rangkai, s, segi[idBab]);
      }
    }

    if (!sedangSusutSudut) {
      var lebih = kelebihanSudut();
      var nSusut = 0;
      while (lebih > 0.75 && nSusut < 8) {
        var ukuranBaru = Math.max(132, s.width - lebih * 2 - 4);
        if (ukuranBaru >= s.width - 0.5) { break; }
        tulang.style.width = ukuranBaru + "px";
        tulang.style.height = ukuranBaru + "px";
        sedangSusutSudut = true;
        aturCelahTengah();
        sedangSusutSudut = false;
        s = svg.getBoundingClientRect();
        lebih = kelebihanSudut();
        nSusut += 1;
      }
    }
  }

  function aturMuatTeksLayar() {
    function muat(el, varNama, kelasInduk, minSkala) {
      if (!el) { return; }
      var induk = kelasInduk || el;
      induk.classList.remove("muat-scroll");
      el.style.setProperty(varNama, "1");
      var skala = 1;
      var i;
      for (i = 0; i < 16; i++) {
        if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) {
          break;
        }
        skala = Math.max(minSkala, skala - 0.04);
        el.style.setProperty(varNama, String(skala));
      }
      var masih = el.scrollHeight > el.clientHeight + 1;
      var sempit = window.innerWidth <= 520 || window.innerHeight <= 400;
      if (masih && sempit) {
        induk.classList.add("muat-scroll");
      }
    }
    if (layarPuisi && kotakPuisi && layarPuisi.classList.contains("aktif") && !layarPuisi.hidden) {
      muat(kotakPuisi, "--skala-puisi", layarPuisi, 0.58);
    }
    if (layarAkhir && layarAkhir.classList.contains("aktif") && !layarAkhir.hidden) {
      var isi = layarAkhir.querySelector(".halaman-terbuka");
      muat(isi || layarAkhir, "--skala-finale", layarAkhir, 0.62);
    }
  }

  /* -----------------------------------------
     11. Hover-buka (desktop) + klik/ketuk cadangan
     ----------------------------------------- */
  function kunciHoverBaru() {
    hoverTerkunci = true;
    kunciPos = { x: lastPointer.x, y: lastPointer.y };
    gerakSaatKunci = false;
    tandaiSasaranDiBawahKursor();
  }

  function kursorDiElemen(el) {
    if (!el) { return false; }
    var r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) { return false; }
    return lastPointer.x >= r.left && lastPointer.x <= r.right &&
      lastPointer.y >= r.top && lastPointer.y <= r.bottom;
  }

  function tandaiSasaranDiBawahKursor() {
    var semua = document.querySelectorAll(".bisa-hover-buka");
    var i;
    var el;
    for (i = 0; i < semua.length; i++) {
      el = semua[i];
      if (!bolehHover(el)) { continue; }
      if (kursorDiElemen(el)) {
        el._perluKeluar = true;
      }
    }
  }

  function bolehHover(el) {
    if (!el || el.hidden) { return false; }
    if (el.classList.contains("selesai") || el.classList.contains("diam")) { return false; }
    if (el === ilustrasiKata && (!modeKata || !kataSiap)) { return false; }
    return true;
  }

  function antreAksi(fn, dariKlik) {
    antrianAksi = { fn: fn, klik: !!dariKlik };
  }

  function cariSasaran(x, y) {
    var diAtas = document.elementFromPoint(x, y);
    return diAtas && diAtas.closest ? diAtas.closest(".bisa-hover-buka") : null;
  }

  function afterTransisi() {
    var item = antrianAksi;
    antrianAksi = null;
    hoverTerkunci = false;
    kunciPos = null;
    gerakSaatKunci = false;
    tandaiSasaranDiBawahKursor();
    /* Hanya klik yang diantre; hover yang terjadi di bawah kursor diam dibuang. */
    if (item && item.klik && typeof item.fn === "function") {
      item.fn();
    }
  }

  function bukaDariHover(el) {
    if (!perangkatHover()) { return; }
    if (!bolehHover(el)) { return; }
    if (el === ilustrasiKata && !kataSiap) { return; }
    if (sedangTransisi) { return; }
    if (el._perluKeluar) { return; }
    if (typeof el._aksiHover === "function") {
      el._aksiHover();
    }
  }

  function pasangHoverBuka(el, aksi) {
    if (!el) { return; }
    el.classList.add("bisa-hover-buka");
    el._aksiHover = aksi;
    if (el._hoverTerpasang) { return; }
    el._hoverTerpasang = true;
    el.addEventListener("pointerenter", function () {
      if (el._perluKeluar) { return; }
      bukaDariHover(el);
    });
    el.addEventListener("pointerleave", function () {
      el._perluKeluar = false;
    });
  }

  function lepasKunciHover(e) {
    lastPointer.x = e.clientX;
    lastPointer.y = e.clientY;
    var semua = document.querySelectorAll(".bisa-hover-buka");
    var i;
    var el;
    for (i = 0; i < semua.length; i++) {
      el = semua[i];
      if (el._perluKeluar && !kursorDiElemen(el)) {
        el._perluKeluar = false;
      }
    }
  }

  kataBuku.addEventListener("click", klikBuku);
  kataBuku.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      klikBuku();
    }
  });
  pasangHoverBuka(kataBuku, klikBuku);

  document.querySelectorAll(".sudut").forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      masukPuisi(tombol.getAttribute("data-bab"));
    });
    pasangHoverBuka(tombol, function () {
      masukPuisi(tombol.getAttribute("data-bab"));
    });
  });

  tombolLanjut.addEventListener("click", function (e) {
    e.stopPropagation();
    lanjutKeHub();
  });
  pasangHoverBuka(tombolLanjut, lanjutKeHub);

  if (tombolKembali) {
    tombolKembali.addEventListener("click", function (e) {
      e.stopPropagation();
      lanjutKeHub();
    });
    pasangHoverBuka(tombolKembali, lanjutKeHub);
  }

  tombolUlang.addEventListener("click", function (e) {
    e.stopPropagation();
    ulangDariAwal();
  });
  pasangHoverBuka(tombolUlang, ulangDariAwal);

  if (ilustrasiKata) {
    ilustrasiKata.addEventListener("click", function (e) {
      e.stopPropagation();
      bukaDariKata();
    });
    pasangHoverBuka(ilustrasiKata, bukaDariKata);
  }

  document.addEventListener("mousemove", function (e) {
    onPointerMove(e.clientX, e.clientY, "mouse");
    lepasKunciHover(e);
  });

  document.addEventListener("click", function (e) {
    if (!jejakKursorAktif("mouse")) { return; }
    jejakTinta(e.clientX, e.clientY, true);
  });

  /* Sentuh tidak meninggalkan jejak usap; noda kecil hanya dari ketukan, bukan goresan panjang. */
  document.addEventListener("touchmove", function () {
    lastX = -1;
    lastY = -1;
  }, { passive: true });

  document.addEventListener("touchstart", function (e) {
    if (!e.touches || !e.touches[0]) { return; }
    lastX = -1;
    lastY = -1;
    var t = e.touches[0];
    jejakTinta(t.clientX, t.clientY, true);
  }, { passive: true });

  window.addEventListener("resize", function () {
    var kotakTulang = document.querySelector(".tulang-kotak");
    if (kotakTulang) {
      kotakTulang.style.width = "";
      kotakTulang.style.height = "";
    }
    jejakPizza.w = 0;
    jejakPizza.h = 0;
    ukuranKanvas();
    aturCelahTengah();
    aturUkuranKata();
    aturMuatTeksLayar();
  });

  ukuranKanvas();
  gambarTinta();
  aturCelahTengah();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      aturCelahTengah();
      aturUkuranKata();
      aturMuatTeksLayar();
    }).catch(function () {});
  }
  if (petunjukHub) {
    petunjukHub.textContent = teksPetunjuk("Lembar Sendu");
  }
  tampilkan(layarHub);

  var modeUji = /(?:\?|&)uji=1(?:&|$)/.test(location.search)
    || location.hash === "#uji"
    || /(?:\?|&)tempo=/.test(location.search);
  if (modeUji) {
    window.__lembarUji = {
      tempo: function () { return TEMPO; },
      timings: function () {
        return {
          tempo: TEMPO,
          keluar: DURASI_KELUAR,
          masuk: DURASI_MASUK,
          fadeHuruf: DURASI_FADE_HURUF,
          hurufAwal: JEDA_HURUF_AWAL,
          hurufAntar: JEDA_HURUF_ANTAR,
          fadeKata: DURASI_FADE_KATA,
          fadeMerah: DURASI_FADE_MERAH,
          merahAntar: JEDA_MERAH_ANTAR,
          tahanMerah: JEDA_TAHAN_MERAH,
          tahanBarisMerah: JEDA_TAHAN_BARIS_MERAH,
          jedaSetelahBaris: JEDA_SETELAH_BARIS,
          jedaKataHitam: JEDA_KATA_HITAM,
          easeHitam: EASE_HITAM,
          fadeBaris: DURASI_FADE,
          barisHitam: JEDA_BARIS_HITAM,
          baitHitam: JEDA_BAIT_HITAM,
          jedaDasar: JEDA_DASAR,
          jedaPerHuruf: JEDA_PER_HURUF,
          jedaMaks: JEDA_MAKS,
          jedaBait: JEDA_BAIT,
          jedaAwal: JEDA_AWAL,
        durJudulFinale: DURASI_JUDUL_FINALE,
        durGarisFinale: DURASI_GARIS_FINALE,
        durSubtitileFinale: DURASI_SUBTITEL_FINALE,
        skalaIntroFinale: SKALA_INTRO_FINALE,
        durFadeFinale: DURASI_FADE_FINALE,
        jedaBaitFinale: JEDA_BAIT_FINALE,
        skalaBarisFinale: SKALA_BARIS_FINALE
        };
      },
      keHubSudut: function () {
        sudahTerkumpul = true;
        hentikanReveal();
        if (ilustrasiKata) {
          ilustrasiKata.innerHTML = "";
          ilustrasiKata.classList.remove("siap", "pudar");
          ilustrasiKata.style.opacity = "";
          ilustrasiKata.style.animation = "";
          ilustrasiKata.style.transition = "";
          ilustrasiKata.setAttribute("aria-hidden", "true");
        }
        layarPuisi.classList.remove("tahap-kata", "sudah-terkumpul");
        modeKata = false;
        sedangSebar = false;
        tombolLanjut.hidden = true;
        if (tombolKembali) { tombolKembali.hidden = true; }
        if (fase === "awal") { bukaSudut(); }
        babSekarang = null;
        tampilkan(layarHub);
        window.requestAnimationFrame(function () {
          aturCelahTengah();
          window.requestAnimationFrame(aturCelahTengah);
        });
      },
      bukaFinaleLangsung: function () {
        selesai.aku = true;
        selesai.pena = true;
        selesai.hidup = true;
        selesai.dan = true;
        fase = "siap-finale";
        sedangTransisi = false;
        antrianAksi = null;
        bukaFinale();
      },
      keTahapKata: function (id) {
        sedangTransisi = false;
        antrianAksi = null;
        masukPuisi(id || "lembar", true);
        if (ilustrasiKata) {
          var hs = ilustrasiKata.querySelectorAll(".huruf-tujuan");
          var hi;
          for (hi = 0; hi < hs.length; hi++) {
            hs[hi].classList.add("tampil");
          }
          /* Kursor yang sudah diam di tengah tidak boleh langsung membuka puisi. */
          if (kursorDiElemen(ilustrasiKata)) {
            ilustrasiKata._perluKeluar = true;
          }
          ilustrasiKata.classList.add("siap");
          kataSiap = true;
        }
        aturUkuranKata();
      },
      bersihkanTinta: function () { bersihkanTinta(); },
      segiPenggalan: function () {
        var svg = document.querySelector(".svg-kotak");
        var box = svg ? svg.getBoundingClientRect() : null;
        var out = {};
        var id;
        for (id in jejakSegi) {
          if (!jejakSegi[id] || !box) { out[id] = null; continue; }
          out[id] = jejakSegi[id].map(function (p) {
            return { x: box.left + p[0] / 100 * box.width, y: box.top + p[1] / 100 * box.height };
          });
        }
        return out;
      },
      hubSelesaiSemua: function () {
        sedangTransisi = false;
        antrianAksi = null;
        this.keHubSudut();
        ["aku", "pena", "hidup", "dan"].forEach(function (id) {
          tandaiSelesai(id);
        });
        window.requestAnimationFrame(function () {
          aturCelahTengah();
          window.requestAnimationFrame(aturCelahTengah);
        });
      },
      bukaPuisiPenuh: function (id) {
        sedangTransisi = false;
        antrianAksi = null;
        masukPuisi(id, true);
        ungkapPuisiSekarang();
      },
      ungkapFinale: function () {
        selesai.aku = true;
        selesai.pena = true;
        selesai.hidup = true;
        selesai.dan = true;
        fase = "siap-finale";
        sedangTransisi = false;
        antrianAksi = null;
        bukaFinale();
        if (timerTransisi) {
          window.clearTimeout(timerTransisi);
          timerTransisi = null;
        }
        hentikanReveal();
        aturLayarInstan(layarAkhir);
        var fi;
        for (fi = 0; fi < barisFinale.length; fi++) {
          barisFinale[fi].classList.add("tampil");
        }
        sudahFinale = barisFinale.length;
        if (judulFinale) { judulFinale.classList.add("tampil"); }
        tombolUlang.hidden = false;
        if (kreditAkhir) {
          kreditAkhir.hidden = false;
          kreditAkhir.classList.add("tampil");
        }
        if (layarAkhir) { layarAkhir.classList.add("segera"); }
        aturMuatTeksLayar();
      },
      batasTinta: function () { return batasGambarTinta(); },
      angkatan: function () { return angkatanAnimasi; },
      timerAktif: function () {
        return {
          huruf: timerHuruf.length,
          lain: timerLain.length,
          reveal: timerReveal != null,
          angkatan: angkatanAnimasi
        };
      },
      aturTataLetak: function () {
        aturCelahTengah();
        aturUkuranKata();
        aturMuatTeksLayar();
        ukuranKanvas();
      }
    };
  }
})();
