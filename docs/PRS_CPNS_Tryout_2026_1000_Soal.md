# PRS — CPNS Tryout 2026/2027 (APK Offline 1000 Soal)

| Field | Isi |
|---|---|
| **Produk** | CPNS Tryout 2026 — APK Offline 1000 Soal Bank (TWK 300 • TIU 350 • TKP 350) |
| **Versi** | v1.0 MVP Bank Soal |
| **Tanggal** | 16 Sep 2026 17:15 WIB |
| **Owner** | Chukie99 / SOPIAN |
| **Target rilis** | v1.0 tag 17 Sep 2026 — GH Actions 6 menit |
| **Platform** | Android APK (Capacitor 6.2.2 + Java 17, webDir `www`), offline 100% |
| **Harga** | Early 19K (3 hari) → 59K normal → Bundle 3 paket 79K |

## 1. Problem
- 3jt daftar CPNS/tahun, 90% gagal SKD bukan karena IQ rendah tapi **kurang jam terbang CAT + HOTS** (BKN 11 Sep 2025).
- Sistem baru 2026: **TOEFL-style hasil 2 tahun + per subtes (gagal TKP ulang TKP doang) + tes tidak serentak**. Bimbel mahal 300K/bulan, web tryout 43K-69K harus online. **Belum ada APK offline 1000 soal yang bisa random 110 tiap tryout**.
- Buyer panic gagal = willingness bayar 43K-69K proven: `40 PAKET 43K Stock 35` https://lynk.id/soalcpns/vYY69P7 + `VIP 69K` https://lynk.id/mulaicpns . Scribd/Telegram banyak gratisan tapi **gak ada timer + skor CAT**.

## 2. Goal (angka + tanggal)
- **7 hari:** 5 buyer × 19K = **95K validasi** (bukan 100jt dulu) — bukti produk work via feedback
- **30 hari:** 50 buyer × 59K = **2,95jt** (track Lynk + testimoni)
- **Akhir 2026:** 1.700 buyer × 59K = **100jt** (hero non-UMKM sesuai target lu)
- Metric: install → start tryout → submit → lihat pembahasan → rate 5

## 3. Constraints
- Modal Rp0, PC G3260 4GB (no local Gradle, GH Actions only), no VPS 24 jam
- No macro, HP/WPS harus jalan (tapi ini APK, bukan Excel)
- Jualan via Lynk.id (kasir) + TikTok Search + FB Grup CPNS 200K (traffic)
- Jangan pakai resource `https://` CDN di APK offline — font inline, no Google Fonts

## 4. Existing Assets Reused
- Kasir Kita v1.1.16 (Ed25519 + keygen flow) — bisa pakai aktivasi jika mau lock
- Excel navy #1A495D / teal #0B8EC2 / cream #FFF9E6 — palette sama
- Pillow cover 1080×1350 (Lynk) — reuse style
- GH Actions `build-apk.yml` proven 80MB Kasir Kita

## 5. Scope v1.0 (MVP Bank Soal)

### 5.1 Fitur Wajib
- **Bank 1000 soal**: TWK 300 (Pancasila, UUD, NKRI, Bhinneka, BerAKHLAK UU ASN 20/2023, IKN UU 3/2022, netralitas ASN, moderasi, bela negara) — **HOTS case-based 2026**: hoaks WA, intoleransi rumah ibadah, konflik lahan adat IKN
- TIU 350 (verbal sinonim/antonim, analogi, silogisme, deret n(n+1)/x2, aritmatika diskon/rata, figural)
- TKP 350 (pelayanan, integritas, kolaboratif, WBS, bridging TOEFL-style 2026: per subtes 2 tahun, fleksibel jadwal)
- **Random 110 tiap tryout**: ambil **30 TWK + 35 TIU + 45 TKP random** dari bank — tiap Mulai beda, gak bosen
- **Timer CAT 100 menit** (resmi BKN 2024, 130 difabel) + autosave `localStorage` + lanjutkan
- **Grid navigasi 110** (biru=sudah, kuning=ragu, loncat), tandai ragu, hapus jawaban
- **Skor auto**: TWK 150 (5×30), TIU 175 (5×35), TKP 225 (5×45) = **550 max**, passing **TWK 65 TIU 80 TKP 166 total 311**, total benar X/110, waktu pakai, bar per kategori, badge lulus/gagal
- **Pembahasan per soal** (1 kalimat why)
- **Offline 100%** no login no ads, `www/content/questions.json` 301KB

### 5.2 Out of Scope v1.0
- Skoring TKP granular 1-5 per opsi jarak (v1.0: 5 benar else 1-3 random) — fine untuk MVP
- Figural gambar (butuh PNG 100) — v1.0 teks dulu, v1.1 tambah figural image
- Leaderboard online, sync cloud — v2

### 5.3 Non-Fungsional
- APK <15MB (JSON 301KB + HTML/JS + icon), cold start <2s
- Android 8+ (API 21+), no iOS
- No `https://` literal di `www/` — `grep https www/` = 0 sebelum push

## 6. User Flow
`Home (110 soal / 1000 bank)` → `MULAI → random 110` → `Quiz (timer 100:00, 1-110, pilih A-D, grid, ragu)` → `Selesai → Result (skor TWK/TIU/TKP + total + bar + lulus)` → `Pembahasan (scroll 110)` → `Ulang (random baru)` / `Beranda`

## 7. Tech Stack
- Web: `www/index.html` + `www/js/app.js` + `www/content/questions.json` (vanilla JS, no framework)
- Style: navy #1A495D, teal #0B8EC2, yellow #FFD23F, cream #FFF9E6, green #06D6A0, pink #EF476F — card 2.5px border + 6px shadow
- Build: Capacitor 6.2.2 + Java 17, `webDir: www`, `appId com.chukie99.cpnstryout`, `appName CPNS Tryout 2026`
- Workflow `.github/workflows/build-apk.yml` — `cap add android && cap sync && gradlew assembleDebug` → artifact `app-debug.apk`

## 8. Monetisasi & Distribusi (Rp0)
- Lynk.id harga tripwire 19K 3 hari → 59K (proven 43K-69K laku)
- Ebook **20 soal gratis PDF** sebagai umpan → share FB Grup CPNS 200K + TikTok 30 detik screen record timer → QR di akhir PDF ke Lynk
- Update soal: ganti `questions.json` → tag v1.1 → user update APK (gak perlu redesign)

## 9. Risks
- BKN umumkan jadwal hoaks 24 Agt 2026 — antisipasi: tulis di deskripsi `jadwal resmi hanya SSCASN` + disclaimer `bukan bocoran, latihan pola`
- 9router quota habis (429) — v1.0 no image jadi aman
- Shopee SPA block — tidak relevan, jualan Lynk + FB

## 10. Acceptance Criteria (Definition of Done)
- [ ] `questions.json` 1000 soal valid (300/350/350)
- [ ] Random 110 tiap Mulai (30/35/45) teruji
- [ ] Timer 100:00 hitung mundur + warn di 10:00 + autosave + lanjutkan
- [ ] Grid 110 loncat + ragu + hapus
- [ ] Skor TWK/TIU/TKP + bar + passing 65/80/166 + pembahasan 110
- [ ] `www/index.html` buka di Chrome HP offline ok
- [ ] `grep -r https www/` = 0
- [ ] GH Actions `build-apk.yml` SUCCESS → `app-debug.apk` <15MB install di J9AXGF...

## 11. Timeline 7 Hari Lean
- Hari 1: 1000 soal + engine random + UI (done 16 Sep) — PRS + mockup approve
- Hari 2: Push tag v1.0 → build APK → test J9AXGF...
- Hari 3: Cover 1080×1350 + listing Lynk + PDF 20 soal gratis
- Hari 4-7: Share FB + TikTok → 5 buyer 19K → feedback → kontenin → naik 59K
