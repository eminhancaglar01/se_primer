# The Primer v2 — Veri Sözlüğü (data/SOZLUK.md)

Bu belge, **The Primer v2** kriz simülasyonunda toplanan oyun oturumu ve karar kayıtlarının şemasını, her alanın veri tipini, anlamını, ölçüm birimini ve olası değer aralıklarını tanımlar.

---

## 1. Veri Toplama İlkeleri ve KVKK Güvencesi

1. **Sıfır Kişisel Veri (Zero PII):** Kullanıcı adı, e-posta, IP adresi, coğrafi konum, tarayıcı parmak izi veya cihaz kimliği **kesinlikle toplanmaz**.
2. **Yerel Saklama ve Açık İzin:** Veriler oyuncunun tarayıcı oturumunda geçici olarak saklanır; arka planda hiçbir harici sunucuya otomatik olarak gönderilmez.
3. **Kullanıcı Kontrollü Dışa Aktarma:** Veriler yalnızca kullanıcının "Oturum Verilerini İndir (CSV)" butonuna açıkça tıklamasıyla CSV formatında yerel diske indirilir.
4. **Kaynak Ayrımı (`kaynak`):** Gerçek insan oturumları (`gercek`) ile model doğrulama amaçlı üretilen sentetik kayıtlar (`sentetik`) kesin olarak etiketlenir ve ayrıştırılır.

---

## 2. CSV Veri Şeması (`data/oturumlar.csv`)

| Sütun Adı | Veri Tipi | Birim / Format | Olası Değerler / Aralık | Açıklama |
|---|---|---|---|---|
| `oturum_id` | `string` | UUID / Hash | Örn: `sess_a8f9c1...` | Her oyun oturumu için oluşturulan rastgele tekil oturum kimliği. |
| `sahne_no` | `integer` | Adım sırası | `1`, `2`, `3` | Mevcut kriz aşaması (1: Mimari, 2: Test, 3: KVKK). |
| `seviye` | `string` | Kategorik | `beginner`, `intermediate`, `experienced` | Oyuncunun onboarding aşamasında seçtiği deneyim düzeyi. |
| `seviye_kod` | `integer` | Ordinal Kod | `0` (beginner), `1` (intermediate), `2` (experienced) | Model girdi özniteliği için sayısal seviye kodu. |
| `rol` | `string` | Kategorik | `backend`, `frontend`, `fullstack`, `devops`, `software`, `student` | Oyuncunun onboarding aşamasında seçtiği mühendislik rolü. |
| `hedef` | `string` | Kategorik | `architecture`, `testing`, `privacy`, `general` | Oyuncunun onboarding aşamasında seçtiği öğrenme hedefi. |
| `karar_suresi_sn` | `float` | Saniye ($s$) | $[0.1, 300.0]$ | Sahne yüklendiği andan kararın verildiği ana kadar geçen süre. |
| `karar_degistirme_sayisi` | `integer` | Adet | $[0, 50]$ | Oyuncunun nihai kararından önce seçenek kartları arasında yaptığı tıklama/geçiş sayısı. |
| `onceki_yanlis_sayisi` | `integer` | Adet | `0`, `1`, `2` | Mevcut sahneye kadar yapılmış olan hatalı/riskli karar sayısı. |
| `ipucu_sayisi` | `integer` | Adet | $[0, 20]$ | Oyuncunun o ana kadar AI Tutor'a sorduğu soru veya baktığı ipucu adedi. |
| `secilen_secenek` | `string` | Harf Kodu | `A`, `B` | Oyuncunun nihai seçtiği seçenek (A veya B). |
| `destek_gerekli` | `integer` | İkili Hedef (Label) | `0` veya `1` | **Model Hedef Etiketi (Ground Truth):** Oyuncunun o kararda ek desteğe muhtaç olup olmadığı. |
| `kaynak` | `string` | Menşei | `gercek`, `sentetik` | Verinin gerçek kullanıcı oturumundan mı yoksa sentetik üreticiden mi geldiğini belirtir. |
| `zaman_damgasi` | `string` | ISO 8601 UTC | Örn: `2026-11-06T18:45:00Z` | Kararın kaydedildiği anın zaman damgası. |

---

## 3. `destek_gerekli` (Ground Truth) Etiketleme Kuralları

Modelin tahmin edeceği hedef etiket (`destek_gerekli`), veri sızıntısı olmaksızın şu nesnel ölçütlere göre atanır:

- **`destek_gerekli = 1` (Desteğe İhtiyaç Var):**
  - Oyuncu mevcut sahnede sistem çöküşü veya KVKK ihlali doğuran riskli bir karar vermişse (Aşama 1'de Hotfix B, Aşama 2'de Test Atla B, Aşama 3'te Ham Log B) VEYA
  - Karar öncesinde Sokratik AI Eğitmene danışarak ipucu aradıysa (`ipucu_sayisi > 0`) VEYA
  - Karar verme süresi kendi seviye grubunun ortalamasının 1.5 katını aşıp tereddüt/karar değiştirme sergilediyse (`karar_degistirme_sayisi >= 2`).
- **`destek_gerekli = 0` (Otonom / Başarılı):**
  - Oyuncu doğru ve stabil seçeneği makul sürede, tereddütsüz (`karar_degistirme_sayisi <= 1`) ve AI Tutor desteğine ihtiyaç duymadan verdiyse.

---

## 4. Model İçin Seçilen Özellik Vektörü (Feature Contract)

Makine öğrenmesi modelinin çıkarım ve eğitim sözleşmesinde yer alan 6 temel öznitelik şunlardır:

1. `seviye` (Ordinal kod: 0, 1, 2)
2. `sahne_no` (1, 2, 3)
3. `karar_suresi_sn` (float)
4. `karar_degistirme_sayisi` (int)
5. `onceki_yanlis_sayisi` (int: 0, 1, 2)
6. `ipucu_sayisi` (int)

Bu sıra ve tipler hem Python (`train.py`, `parite.py`) hem de tarayıcı ONNX (`onnxInference.ts`) tarafında birebir aynı olacaktır.
