# The Primer v2.0 — Akıllı Öğrenme Adaptasyonlu Kriz Simülasyonu

[![Cypress E2E Tests](https://img.shields.io/badge/Cypress-22%2F22%20Passed-10b981?style=for-the-badge&logo=cypress)](cypress/)
[![ML Model Parity](https://img.shields.io/badge/Parity-10%5E--4%20Verified-0ea5e9?style=for-the-badge&logo=onnx)](tests/parite.json)
[![DecisionTree F1](https://img.shields.io/badge/Model%20F1-0.8393-8b5cf6?style=for-the-badge&logo=scikitlearn)](model/README.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](package.json)

**The Primer v2.0**, kullanıcıyı saat 08:00'de 300 hastanın sırada beklediği çökmüş bir sağlık randevu sisteminin **nöbetçi yazılım mühendisi (On-Call Engineer)** koltuğuna oturtan; tarayıcı içi çalışan yerel Makine Öğrenmesi (ONNX WebAssembly) ile oyuncunun zorlanma ve tereddüt reflekslerini gerçek zamanlı analiz edip öğrenme deneyimini proaktif olarak uyarlayan akıllı bir kriz simülasyonudur.

---

## 1. Araştırma Sorusu ve ML Mimarisi

> **Araştırma Sorusu:**  
> *Oyuncunun karar verme süresi, karar değiştirme davranışı ve önceki hataları kullanılarak öğrenme desteği ihtiyacı tahmin edilebilir mi ve bu tahmin The Primer deneyimini nasıl uyarlayabilir?*

### Model Özellikleri (Inputs):
1. `seviye`: Oyuncunun başlangıç seviyesi (`0: baslangic`, `1: deneyimli`).
2. `sahne_no`: Mevcut kriz sahnesi (`1: Mimari`, `2: Test`, `3: KVKK`).
3. `karar_suresi_sn`: Oyuncunun kararı vermeden önce sahnede geçirdiği süre (saniye).
4. `karar_degistirme_sayisi`: Aynı sahnede seçenek kartları arasında yapılan geçiş/tereddüt sayısı.
5. `onceki_yanlis_sayisi`: Önceki sahnelerde verilen kritik hatalı karar adedi.
6. `ipucu_sayisi`: Sokratik AI Eğitmene danışılan soru/ipucu sayısı.

### Hedef Değişken (Target):
- `destek_gerekli`: Oyuncunun proaktif rehberliğe ihtiyaç duyup duymadığı (`0: Hayır, akışa devam et`, `1: Evet, proaktif sokratik yardım sun`).

### Model Performansı:
- **Seçilen Model:** Karar Ağacı (`DecisionTreeClassifier(max_depth=3, random_state=42)`)
- **Doğrulama Yöntemi:** 5 Katlı Oturum Gruplu Çapraz Doğrulama (`GroupKFold` — veri sızıntısını önler)
- **F1 Skoru:** $0.8393 \ge 0.70$ (Kabul Eşiği Geçildi)
- **Doğruluk (Accuracy):** $0.8278 \ge 0.75$ (Kabul Eşiği Geçildi)
- **ROC-AUC:** $0.8593$
- **Python / ONNX Paritesi:** Maksimum mutlak fark $\approx 1.25 \times 10^{-8} \le 10^{-4}$

---

## 2. Hızlı Kurulum ve Çalıştırma (3 Komutta)

Uygulama ve model geliştirme ortamını kurup çalıştırmak için aşağıdaki 3 adımı terminalinizde yürütmeniz yeterlidir:

```bash
# 1. Depoyu klonlayın ve dizine girin
git clone https://github.com/eminhancaglar01/se_primer.git && cd se_primer

# 2. Web ve Python bağımlılıklarını yükleyin
npm install && pip install -r requirements.txt

# 3. Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama tarayıcınızda `http://localhost:5173/` adresinde açılacaktır.

---

## 3. Model Eğitimi, Parite ve E2E Testleri

### Modeli Sıfırdan Eğitme ve ONNX Dışa Aktarımı:
```bash
python train.py
```
*Bu komut sentetik ve toplanan oturumları doğrular, GroupKFold ile modelleri karşılaştırır, `model/model.onnx`, `model/config.json` ve `model/README.md` dosyalarını üretir.*

### Python Parite Testini Koşma:
```bash
python tests/parite.py
```
*`tests/parite.json` dosyasına 5 adet referans girdi ve Python ONNX Runtime olasılık çıktılarını yazar.*

### Cypress Testlerini Çalıştırma (Parite + Adaptasyon + Regresyon):
```bash
# Tüm 7 test paketini (22 test) headless modda koşma:
npx cypress run --headless

# Görsel Cypress arayüzünü açma:
npx cypress open
```
**Test Kapsamı (22/22 Başarılı):**
1. `00_demo_walkthrough_video.cy.ts`: 60 saniyelik uçtan uca otomatik video akışı.
2. `01_onboarding_and_personalization.cy.ts`: Profilleme ve seviye seçimi.
3. `02_decision_paths_all_eight.cy.ts`: 8 farklı karar dalı (A-A-A'dan B-B-B'ye).
4. `03_ai_tutor_and_fallback.cy.ts`: Sokratik Gemini eğitmen ve yerel çevrimdışı motor.
5. `04_experienced_timer_and_mobile.cy.ts`: 60 saniye zaman baskısı ve mobil arayüz.
6. `05_model_parity.cy.ts`: Tarayıcı içi `onnxruntime-web` ile Python referansı arasında $|P_{\text{py}} - P_{\text{browser}}| \le 10^{-4}$ sayısal parite doğrulaması.
7. `06_model_adaptation.cy.ts`: $P \ge 0.50$ durumunda proaktif ipucu banner'ının açılması, $P < 0.50$ durumunda otonom akışın korunması.

---

## 4. Hugging Face Hub Model Yayını

Eğitilen `v2.0` modeli Hugging Face Hub'a sabit commit URL'siyle yayınlamak için hazır betik:

```bash
# 1. Hugging Face Write yetkili token'ınızı ayarlayın
$env:HF_TOKEN = "hf_your_token_here"

# 2. Modeli yayınlayın
python scripts/publish_hf.py --repo eminhancaglar/se-primer-v2
```

Yayınlanan model dosyalarına kalıcı ve sabit commit ile erişilir:
- `https://huggingface.co/<KULLANICI>/<REPO>/resolve/<COMMIT>/model.onnx`
- `https://huggingface.co/<KULLANICI>/<REPO>/resolve/<COMMIT>/config.json`

---

## 5. Veri Toplama ve KVKK / Gizlilik İlkeleri

- **Anonim Oturum Kimliği:** Her simülasyonda rastgele benzersiz `sessionId` oluşturulur.
- **Sıfır PII (Privacy by Design):** Kullanıcı adı, e-posta, IP adresi, konum veya donanım kimliği kesinlikle toplanmaz.
- **Açık Dışa Aktarım:** Veriler gizlice sunucuya gönderilmez; kullanıcı simülasyon sonunda veya başlık çubuğundaki düğmeyle CSV formatında (`data/oturumlar.csv` şemasına tam uyumlu) cihazına indirebilir.
- **Veri Sözlüğü:** Tüm alanların detaylı açıklamaları [data/SOZLUK.md](data/SOZLUK.md) dosyasındadır.

---

## 6. Proje Dizin Yapısı

```
se_primer/
├── data/
│   ├── SOZLUK.md                   # Veri sözlüğü ve KVKK kuralları
│   ├── oturumlar.csv               # Toplanan gerçek oturumlar için şema şablonu
│   └── sentetik_oturumlar.csv      # train.py için seed=42 ile üretilen 60 sentetik oturum
├── model/
│   ├── model.onnx                  # Optimize edilmiş DecisionTree ONNX ikili modeli
│   ├── config.json                 # Girdi sırası, eşik değerleri ve ön işleme sözleşmesi
│   └── README.md                   # Model kartı (Model Card)
├── public/
│   └── model/                      # Tarayıcının fetch ettiği statik model dosyaları
├── src/
│   ├── components/                 # React UI bileşenleri (Incident, Header, Ending, Tutor)
│   ├── engine/                     # Deterministik durum makinesi (State Machine)
│   ├── services/
│   │   ├── onnxInference.ts        # onnxruntime-web WASM çıkarım ve fallback motoru
│   │   └── dataCollector.ts        # Oturum telemetri kayıt ve CSV dışa aktarım servisi
│   └── types/                      # TypeScript alan ve telemetri tipleri
├── cypress/e2e/                    # 7 adet Cypress E2E ve Parite test paketi
├── scripts/
│   ├── generate_synthetic_data.py  # Tekrarlanabilir sentetik veri üretici (seed=42)
│   └── publish_hf.py               # Hugging Face Hub sürümleme betiği
├── tests/
│   ├── parite.py                   # Python ONNX Runtime referans çıkarım betiği
│   └── parite.json                 # 5 referans girdi ve Python çıkarım olasılıkları
├── train.py                        # Scikit-learn model eğitimi ve ONNX dönüşümü
├── spec.md                         # Ürün ve model kabul şartnamesi (v2.0)
├── RELEASE.md                      # Dağıtım, Rollback, Canary ve Mimari Matris analizi
├── SINAV_TASARIMI.md               # 1 sayfalık özgün klasik vize sınavı tasarımı
├── package.json
└── README.md
```

---

## 7. Yapay Zekâ Asistanı Kullanımı ve İnsan Denetimi Bildirimi (AI Agent Disclosure)

Bu projenin v2 geliştirme sürecinde **Google DeepMind Antigravity (Advanced Agentic Coding)** yapay zekâ asistanı kullanılmıştır.

### Kullanılan AI Modeli ve Rolü:
- **Asistan:** Antigravity AI Agent
- **Kullanım Amacı:** 
  - `spec.md` kabul kriterlerinin biçimlendirilmesi,
  - Sentetik veri üretim algoritmasının matematiksel kurgulanması (`generate_synthetic_data.py`),
  - `train.py` GroupKFold çapraz doğrulama ve ONNX ZipMap dönüşüm hatasının giderilmesi,
  - `onnxruntime-web` TypeScript entegrasyonu ve Cypress parite test otomasyonunun hazırlanması.

### İnsan Mühendisliği ve Denetimi (Human Verification):
1. **Veri Bütünlüğü:** Sentetik ve gerçek veri ayrımı manuel olarak denetlenmiş, `kaynak` etiketi zorunlu kılınmıştır.
2. **Kabul Eşikleri:** Modelin $F_1 \ge 0.70$ ve Accuracy $\ge 0.75$ sınırları insan kararıyla belirlenmiş, eğitim öncesinde `spec.md` dosyasına dondurulmuştur.
3. **Parite Onayı:** Python ve WebAssembly arasındaki $10^{-4}$ mutlak fark sınırı `tests/parite.py` ve Cypress `05_model_parity.cy.ts` testleri ile bağımsız olarak kanıtlanmıştır.
4. **Sokratik İlke:** Asistanın kullanıcıya doğrudan cevap vermemesi kuralı 20 test senaryosuyla korunmuştur.

---

## 8. Teslimat Bağlantıları

- **GitHub Repository:** [https://github.com/eminhancaglar01/se_primer](https://github.com/eminhancaglar01/se_primer)
- **Canlı Demo (Vercel):** `https://se-primer.vercel.app` (veya `npm run build && npm run preview`)
- **Tanıtım Videosu:** `cypress/videos/00_demo_walkthrough_video.cy.ts.mp4`
- **Sürümleme & Mimari Kararlar:** [RELEASE.md](RELEASE.md)
- **Klasik Vize Sınavı Tasarımı:** [SINAV_TASARIMI.md](SINAV_TASARIMI.md)
- **Model Kartı:** [model/README.md](model/README.md)
- **Veri Sözlüğü:** [data/SOZLUK.md](data/SOZLUK.md)

---

## 9. Lisans
Bu proje akademik değerlendirme ve eğitim amacıyla hazırlanmıştır. MIT Lisansı altında sunulmaktadır.
