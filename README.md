# SE Primer — Sistem ve Yazılım Mühendisliği Kriz Simülasyonu

[![Cypress E2E Tests](https://img.shields.io/badge/Cypress-16%2F16%20Passed-10b981?style=for-the-badge&logo=cypress)](cypress/)
[![AI Tutor Evaluation](https://img.shields.io/badge/AI%20Tutor-100%25%20Pass%20%7C%200%25%20Leakage-8b5cf6?style=for-the-badge&logo=google)](evaluation.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](package.json)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](tailwind.config.js)

**SE Primer**, kullanıcıyı saat 08:00'de 300 hastanın sırada beklediği çökmüş bir sağlık randevu sisteminin **nöbetçi yazılım mühendisi (On-Call Engineer)** koltuğuna oturtan; mobil öncelikli, dallanan kararlı ve Sokratik yapay zekâ eğitmeni (Dr. Gemini) ile güçlendirilmiş interaktif bir mühendislik simülasyonudur.

---

## 1. Problem ve Çözüm (Problem & Solution)

### Problem
Geleneksel yazılım mühendisliği eğitimi teoriye ve sentetik kodlama ödevlerine odaklanır. Ancak gerçek dünyada yazılım mühendisleri; yüksek baskı altında, veritabanı kilitlenmelerinde, geri dönüşü olmayan migration adımlarında ve KVKK yaptırımlarının olduğu kriz anlarında karar vermek zorundadır. Mevcut AI asistanları ise öğrenciye cevabı doğrudan vererek (answer giveaway) bilişsel öğrenme sürecini engeller.

### Çözüm
SE Primer:
1. **08:00 Sağlık Krizi Senaryosu:** 300 hastanın polikliniklerde beklediği gerçekçi bir sağlık sistemi kesintisini yaşatır.
2. **Deterministik Dallanma (8 Farklı Yol):** Mimari (Rollback vs Hotfix), Test (Duman Testi vs Anında Dağıtım) ve KVKK (Log Maskeleme vs Ham Log) kararlarının teknik sonuçlarını anlık telemetriyle gösterir.
3. **Sokratik AI Eğitmen (Dr. Gemini):** Sıfır cevap sızıntısı (%0.0 Answer Leakage) prensibiyle çalışır; öğrenciye asla cevabı söylemez, doğru teknik soruları sorarak düşündürür.
4. **Seviye ve Rol Bazlı Kişiselleştirme:** Deneyimli kullanıcılar için 60 saniyelik geri sayım sayacı, başlangıç seviyesi için mimari ipuçları, DevOps/Backend/Frontend rollerine özel telemetri bağlamı sunar.

---

## 2. Bilinçli Olarak Uygulanmayan Üç Özellik (Deliberately Excluded Features)

Akademik yönerge ve ürün kapsamı sınırları gereği aşağıdaki üç özellik **bilinçli olarak kapsam dışı bırakılmıştır**:

1. **Kullanıcı Kayıt ve Giriş Sistemi (User Authentication):**  
   *Öğrencilerin ve değerlendiricilerin herhangi bir kimlik doğrulama sürtünmesi veya veritabanı bağımlılığı olmadan simülasyona anında erişebilmesi için kullanıcı kayıt ve giriş sistemi bilinçli olarak uygulanmamıştır.*

2. **Yerel Mobil Uygulama (Native iOS/Android App):**  
   *Mobil uygulama mağazalarının onay süreçlerinden kaçınmak ve tüm cihazlardan evrensel olarak tek tıkla erişilebilirlik sağlamak amacıyla yerel mobil uygulama yerine PWA standartlarında mobil öncelikli web mimarisi tercih edilmiştir.*

3. **İkinci Simülasyon Bölümü (Second Chapter):**  
   *Projenin tek bir sağlık krizi anındaki karar derinliğine, Sokratik pedagojik doğrulamaya ve 8 karar yolunun eksiksiz E2E test kapsamına odaklanabilmesi için ikinci bir kriz senaryosu bilinçli olarak uygulanmamıştır.*

---

## 3. Teknoloji Yığını ve Mimari (Technology Stack)

- **Frontend:** React 19, TypeScript 5.7, Tailwind CSS, Lucide React
- **Derleme Aracı:** Vite 6
- **Yapay Zekâ Motoru:** Google Gemini 1.5 Flash (`@google/generative-ai`) & Yerel Sokratik Çevrimdışı Yedek Motoru (Offline Fallback Engine)
- **E2E Test Otomasyonu:** Cypress 14 (16/16 Test Başarılı, 8 Karar Yolunun Tamamı)
- **Durum Yönetimi:** Modüler Deterministik Durum Makinesi (`src/engine/stateMachine.ts`)

### Proje Dizin Yapısı
```
SE-Primer/
│
├── src/
│   ├── components/       # Header, Onboarding, Incident, DecisionCard, ConsequenceModal, TutorDrawer, EndingScreen, DeviceFrame
│   ├── engine/           # Deterministik durum makinesi (8 olası yol ve kriz değerlendirme motoru)
│   ├── tutor/            # Sokratik Gemini API istemcisi ve çevrimdışı Sokratik soru motoru
│   ├── data/             # 3 aşamalı sağlık kriz senaryosu, metrikler, roller ve sonuç verileri
│   ├── types/            # TypeScript alan modelleri, profiller ve telemetri tipleri
│   ├── styles/           # CSS tasarım token'ları, glassmorphism ve animasyonlar
│   ├── App.tsx           # Ana simülasyon kontrolcüsü
│   └── main.tsx          # React giriş noktası
│
├── cypress/
│   └── e2e/
│       ├── 01_onboarding_and_personalization.cy.ts # Onboarding ve profil testleri
│       ├── 02_decision_paths_all_eight.cy.ts       # 8 karar yolunun tamamı (A-A-A'dan B-B-B'ye)
│       ├── 03_ai_tutor_and_fallback.cy.ts          # Sokratik eğitmen ve sıfır cevap sızıntısı
│       └── 04_experienced_timer_and_mobile.cy.ts   # 60s sayaç ve iPhone görünüm testleri
│
├── docs/
│   ├── demo-script.md    # 60 saniyelik Türkçe video seslendirme metni
│   ├── storyboard.md     # Sahne bazlı görsel storyboard
│   └── recording-guide.md# Ekran kaydı ve YouTube yükleme rehberi
│
├── scripts/
│   └── evaluate_tutor.js # 20 test senaryolu AI Eğitmen değerlendirme motoru
│
├── spec.md               # Kapsamlı ürün şartnamesi ve durum şeması
├── DESIGN.md             # Tasarım sistemi, Google Stitch entegrasyon spesifikasyonu ve token'lar
├── evaluation.md         # 20 öğrenci yanıtlı nesnel AI Eğitmen değerlendirme raporu
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── .gitignore
```

---

## 4. Karar Dallanma Şeması ve 8 Yol Matrisi (Decision Matrix)

| Yol | Karar 1 (Mimari) | Karar 2 (Test) | Karar 3 (KVKK) | Sonuç Türü | Sonuç Gerekçesi |
|---|---|---|---|---|---|
| **Yol 1** | A (Rollback) | A (Duman Testi) | A (Maskele) | **İYİ SON** | Mükemmel mühendislik: Stabil sürüme dönüldü, testler doğrulandı, hasta verileri korundu. |
| **Yol 2** | A (Rollback) | A (Duman Testi) | B (Ham Log) | **KÖTÜ SON** | Sistem kurtarıldı ancak KVKK ihlali nedeniyle Kişisel Verileri Koruma Kurumu soruşturma başlattı. |
| **Yol 3** | A (Rollback) | B (Anında Dağıtım) | A (Maskele) | **KÖTÜ SON** | Test edilmeyen rollback şema uyuşmazlığı nedeniyle randevu kayıtlarında veri tutarsızlığına yol açtı. |
| **Yol 4** | A (Rollback) | B (Anında Dağıtım) | B (Ham Log) | **KÖTÜ SON** | Çifte felaket: Hem veritabanı tutarsızlığı hem de hasta mahremiyeti ihlali gerçekleşti. |
| **Yol 5** | B (Hotfix) | A (Duman Testi) | A (Maskele) | **İYİ SON** | Riskli yama duman testleriyle yakalanan yan etkiler düzeltilerek kurtarıldı, veri güvenliği korundu. |
| **Yol 6** | B (Hotfix) | A (Duman Testi) | B (Ham Log) | **KÖTÜ SON** | Yama çalıştı ancak hasta logları sızdırıldığı için hukuki ceza ve itibar kaybı yaşandı. |
| **Yol 7** | B (Hotfix) | B (Anında Dağıtım) | A (Maskele) | **KÖTÜ SON** | Test edilmeyen acil yama canlıda veritabanı kilitlenmesine (deadlock) yol açtı; randevular kilitlendi. |
| **Yol 8** | B (Hotfix) | B (Anında Dağıtım) | B (Ham Log) | **KÖTÜ SON** | Tam fiyasko: Sistem tamamen çöktü ve hastaların özel sağlık verileri kontrolsüzce açığa çıktı. |

---

## 5. Kurulum ve Yerel Çalıştırma (Getting Started)

### Gereksinimler
- Node.js (v18+)
- npm (v9+)

### Adım 1: Bağımlılıkları Yükleyin
```bash
git clone https://github.com/your-username/SE-Primer.git
cd SE-Primer
npm install
```

### Adım 2: Ortam Değişkenlerini Ayarlayın (İsteğe Bağlı)
Gemini API anahtarınızı tanımlamak için `.env.example` dosyasını kopyalayın:
```bash
cp .env.example .env
```
Dosya içine Gemini API anahtarınızı ekleyin:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Not: API anahtarı girilmediğinde sistem kesintisiz olarak zengin yerel Sokratik çevrimdışı motoruyla çalışmaya devam eder).*

### Adım 3: Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama `http://localhost:5173/` adresinde çalışacaktır.

### Adım 4: Üretim Derlemesini Alın
```bash
npm run build
npm run preview
```

---

## 6. Test ve Değerlendirme Komutları

### Cypress Uçtan Uca (E2E) Testlerini Çalıştırma
```bash
# Headless modda tüm testleri koşma:
npm run cypress:run

# Görsel Cypress arayüzünü açma:
npm run cypress:open
```
**Sonuç:** 4 test paketinde toplam **16 testin tamamı (%100)** başarıyla geçmektedir.

### Sokratik AI Eğitmen Değerlendirmesini Çalıştırma
```bash
node scripts/evaluate_tutor.js
```
**Sonuç:** 20 öğrenci test senaryosunda **%0.0 Cevap Sızıntısı (Zero Answer Leakage)** ve **%100 Başarı Oranı**. Rapor `evaluation.md` dosyasına üretilir.

---

## 7. Teslimat Bağlantıları ve Notlar

- **GitHub Repository:** Hazırlandı ve yerel commit'lendi.
- **Canlı Demo (Live App):** Uygulama production-ready olarak derlenmiştir (`dist/`). Vercel / Netlify veya Google Cloud Run ortamına tek tıkla dağıtılabilir.
- **60 Saniyelik Tanıtım Videosu Materyalleri:**
  - Seslendirme Metni: [docs/demo-script.md](docs/demo-script.md)
  - Storyboard: [docs/storyboard.md](docs/storyboard.md)
  - Kayıt ve Yükleme Yönergesi: [docs/recording-guide.md](docs/recording-guide.md)
- **Tasarım Şartnamesi:** [DESIGN.md](DESIGN.md)
- **Teknik ve Ürün Şartnamesi:** [spec.md](spec.md)
- **AI Eğitmen Değerlendirme Raporu:** [evaluation.md](evaluation.md)

---

## 8. Lisans
Bu proje akademik değerlendirme ve eğitim amacıyla hazırlanmıştır. MIT Lisansı altında sunulmaktadır.
