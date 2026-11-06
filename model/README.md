# The Primer v2 — Model Kartı (Model Card)

**Model Sürümü:** v2.0  
**Algoritma:** DecisionTree  
**ONNX Opset:** 12  
**Tarih:** 2026-11-06  
**Lisans:** MIT  

---

## 1. Modelin Amacı (Model Purpose)
Bu model, **The Primer v2** kriz simülasyonu sırasında oyuncunun sergilediği davranışsal telemetriyi (karar süresi, karar değiştirme tereddüdü, önceki hata sayısı ve ipucu talebi) gerçek zamanlı analiz ederek oyuncunun proaktif öğrenme desteğine ihtiyaç duyup duymadığını (`destek_gerekli`: 0/1) tahmin eder.

Eğer $P(\text{destek\_gerekli} = 1) \ge 0.50$ ise, oyun arayüzünde Sokratik AI Eğitmen proaktif olarak devreye girerek yönlendirici mimari/hukuki ipucu sunar.

---

## 2. Eğitim Verisi ve Özellik Sözleşmesi
- **Eğitim Verisi Boyutu:** 180 karar satırı (60 tekil oturum)
- **Hedef Değişken:** `destek_gerekli` (0: Otonom, 1: Destek Gerekli)
- **Girdi Öznitelikleri (Giriş Sırası):**
  1. `seviye_kod` (float32)
  2. `sahne_no` (float32)
  3. `karar_suresi_sn` (float32)
  4. `karar_degistirme_sayisi` (float32)
  5. `onceki_yanlis_sayisi` (float32)
  6. `ipucu_sayisi` (float32)

---

## 3. Doğrulama Yöntemi ve Başarı Metrikleri
Oturum içi kararların test kümesine sızmasını önlemek amacıyla **GroupKFold (oturum_id bazlı)** çapraz doğrulama uygulanmıştır.

| Metrik | Model Değeri | Kabul Eşiği | Durum |
|---|---|---|---|
| **F1-Score** | **0.8393** | $\ge 0.7$ | ✅ GEÇTİ |
| **Accuracy** | **0.8278** | $\ge 0.75$ | ✅ GEÇTİ |
| **ROC-AUC** | **0.8593** | $\ge 0.75$ | ✅ GEÇTİ |
| **Parite Farkı** | **1.25e-08** | $< 0.0001$ | ✅ GEÇTİ |

---

## 4. Kısıtlar ve Olası Hatalar (Limitations & Biases)
1. **Küçük Tabular Kapsam:** Model yalnızca simülasyondaki 3 aşamalı sağlık kriz senaryosu telemetrisi üzerinde eğitilmiştir. Başka tür simülasyonlara doğrudan genellenemez.
2. **Ağlantısız/Hata Durumu:** ONNX modeli tarayıcıda yüklenemezse kural tabanlı seviye ipucu devreye girer. Sahte olasılık üretilmez.
3. **Uygun Olmayan Kullanım:** Bu model bir sınav notlandırma veya insan yetenek değerlendirme aracı değildir; yalnızca oyun içi pedagojik ipucu tetikleme amacıyla tasarlanmıştır.
