# SE PRIMER — Video Kayıt, YouTube Yayınlama ve Canlı Dağıtım Rehberi (recording-guide.md)

Bu belge, **SE Primer** projesinin 60 saniyelik tanıtım videosunun çekimi, YouTube'a yüklenmesi ve canlı dağıtım adımlarını adım adım açıklar.

---

## 1. 60 Saniyelik Tanıtım Videosu Kayıt Adımları

### Hazırlık
1. Yerel sunucuyu başlatın:
   ```bash
   npm run preview
   ```
   veya
   ```bash
   npm run dev
   ```
2. Tarayıcıda (Google Chrome) `http://localhost:5173/` adresini açın.
3. Geliştirici Araçları'nı (`F12`) açın ve Cihaz Çubuğu'nu (Device Toolbar `Ctrl+Shift+M`) aktif edin.
4. Cihaz profilini **iPhone 14 Pro (390 x 844)** olarak seçin ve %100 ölçeklendirin.

### Kayıt Araçları (OBS Studio veya Windows Oyun Çubuğu)
- **Önerilen Araç:** OBS Studio veya Windows Game Bar (`Win + G`).
- **Çözünürlük:** 1080x1920 (dikey Shorts) veya 1920x1080 (yatay ortalanmış mobil çerçeve).
- **Kare Hızı:** 60 FPS.
- **Ses Kaydı:** [docs/demo-script.md](demo-script.md) dosyasındaki Türkçe seslendirme metnini mikrofondan okuyarak veya yapay zekâ seslendirici (TTS) ile kaydedin.

### Sahne Çekim Sırası (Tam 60 Saniye)
- **00:00 — 00:05:** Başlık ekranı ve kriz duyurusu.
- **00:05 — 00:12:** Onboarding: Deneyimli, DevOps, Mimari seçip başlatma.
- **00:12 — 00:22:** Aşama 1: 60s sayaç akarken Rollback seçeneğini tıklama.
- **00:22 — 00:35:** Aşama 1 Sonuç kartı -> Aşama 2: Duman Testi seçeneğini tıklama.
- **00:35 — 00:43:** AI Eğitmen butonuna basma, Dr. Gemini'ye soru sorma ve Sokratik yanıtı gösterme.
- **00:43 — 00:51:** Aşama 3: KVKK Maskeleme seçeneğini tıklama ve İyi Son ekranını (08:25 çözümü) gösterme.
- **00:51 — 00:57:** Terminalde `npm run cypress:run` çıktısını veya Cypress yeşil test sonuçlarını ekrana getirme.
- **00:57 — 01:00:** GitHub repo kapanış kartı.

---

## 2. YouTube Yükleme Bilgileri

- **Video Başlığı:** `SE Primer — 60-Second System Engineering Crisis Simulation (Academic Demo)`
- **Kategori:** Science & Technology / Education
- **Açıklama:**
  ```
  SE Primer: 08:00'de çöken sağlık randevu sisteminin nöbetçi mühendisi olarak teknik, test ve KVKK kararları aldığınız Sokratik AI destekli kriz simülasyonu.
  
  GitHub Repo: https://github.com/your-username/SE-Primer
  Canlı Demo: http://localhost:5173 / Google AI Studio Live
  
  Teknolojiler: React 19, TypeScript, Tailwind CSS, Google Gemini 1.5 Flash, Cypress E2E.
  ```
- **Etiketler (Tags):** `Software Engineering, Socratic AI, Gemini AI, Crisis Simulation, KVKK, System Reliability, Cypress Testing`

---

## 3. Canlı Dağıtım (Live Demo) Yönergeleri

### Seçenek 1: Vercel ile 1 Dakikada Canlıya Alma
1. `npm i -g vercel`
2. `vercel deploy --prod` komutunu çalıştırın.
3. Oluşan canlı linki (ör. `https://se-primer.vercel.app`) GitHub README ve teslimat formuna ekleyin.

### Seçenek 2: Google AI Studio Web / Cloud Run Dağıtımı
1. Google Cloud SDK kurulu ise:
   ```bash
   gcloud run deploy se-primer --source . --allow-unauthenticated
   ```
2. Ya da Google AI Studio Web App Entegrasyonu üzerinden GitHub reposunu bağlayarak deploy edin.
