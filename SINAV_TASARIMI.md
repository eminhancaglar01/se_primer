# YZM301 — Yazılım Mühendisliği ve Akıllı Sistemler Dersi
## Klasik Vize Sınavı Tasarımı: "The Primer Kriz ve Akıllı Adaptasyon Analizi"

**Sınav Türü:** Klasik / Açık Uçlu Mühendislik Analizi  
**Süre:** 75 Dakika | **Toplam Puan:** 100 Puan  
**Hedef Kitle:** Bilgisayar / Yazılım / Yapay Zekâ Mühendisliği Lisans Öğrencileri  

---

### GENEL SENARYO (Öğrenciye Verilecek Metin):
> Ulusal bir sağlık randevu altyapısı geliştiren bir HealthTech firmasında kıdemli yazılım mühendisi olarak görev yapmaktasınız. Sabah 08:00 yoğunluğunda yapılan plansız bir mikroservis dağıtımı sonrasında veritabanı şemasında geriye dönük uyumsuz bir değişiklik yapılmış; randevu sorgulama servisleri kilitlenmiş ve API yanıt süreleri 8.5 saniyeye fırlamıştır.
> 
> Şirketiniz, personelin kriz yönetimi reflekslerini ölçmek ve eğitmek için **The Primer** adlı simülasyon sistemini devreye almıştır. Sistem, personelin kriz anındaki karar verme hızını, tereddütlerini ve hata sıklıklarını istemci tarafında yerel bir Makine Öğrenmesi (ML) modeliyle analiz ederek öğrenme desteğine ihtiyaç duyan mühendislere otomatik sokratik rehberlik sağlamaktadır.

---

### SORULAR

#### Soru 1: Dağıtık Sistem Mimarisi ve Sıfır Kesinti (Zero-Downtime) Stratejisi (25 Puan)
Kriz anında bir junior mühendisin *"Hemen veritabanını dünkü yedeğe geri alalım (rollback) ve servisi yeniden başlatalım"* önerisini değerlendiriniz.
- **(a)** Canlıda bekleyen ve işlem gören binlerce randevu kaydı varken veritabanı seviyesinde kontrolsüz bir rollback yapılmasının veri bütünlüğü ve tutarlılığı (ACID) açısından yaratacağı riskleri açıklayınız. *(10 Puan)*
- **(b)** Bu tür şema kırıcı (breaking change) güncellemelerin sıfır kesintiyle uygulanabilmesi için **Expand and Contract (Parallel Change)** veya **Blue-Green Deployment** desenlerinin nasıl kurgulanması gerektiğini şematik olarak açıklayınız. *(15 Puan)*

#### Soru 2: Makine Öğrenmesi Sistem Tasarımı ve Veri Sızıntısı (Data Leakage) (25 Puan)
The Primer v2'de oyuncunun destek ihtiyacını (`destek_gerekli`: 0/1) tahmin etmek üzere bir sınıflandırma modeli eğitilmektedir. Girdiler: `seviye`, `sahne_no`, `karar_suresi_sn`, `karar_degistirme_sayisi`, `onceki_yanlis_sayisi`, `ipucu_sayisi`.
- **(a)** Aynı oyuncunun 1., 2. ve 3. sahne kararlarının eğitim (train) ve test (test) kümelerine rastgele (random split) dağıtılması durumunda ortaya çıkacak **Veri Sızıntısı (Data Leakage / Group Leakage)** problemini açıklayınız. Bu sızıntıyı engellemek için hangi çapraz doğrulama (cross-validation) stratejisi uygulanmalıdır? *(15 Puan)*
- **(b)** Modelin eğitim öncesi kabul kriteri olarak neden sadece Doğruluk (Accuracy) metriği yerine $F_1 \ge 0.70$ ve ROC-AUC kriterleri tercih edilmiştir? Dengesiz veri dağılımı üzerinden gerekçelendiriniz. *(10 Puan)*

#### Soru 3: İstemci Taraflı (WASM) Çıkarım Mimarisi ve Sayısal Parite (25 Puan)
The Primer v2 mimarisinde çıkarım sunucusu (REST API) yerine tarayıcı içi WebAssembly (`onnxruntime-web`) kullanılmıştır.
- **(a)** İstemci tarafı (WASM) çıkarımın gecikme (latency), KVKK/gizlilik, altyapı maliyeti ve çevrimdışı çalışma kabiliyeti açısından sunucu tarafı çıkarıma üstünlüklerini ve model fikri mülkiyeti (IP theft) açısından dezavantajını tartışınız. *(15 Puan)*
- **(b)** Python scikit-learn ortamında eğitilip ONNX'e dönüştürülen bir modelin, tarayıcıda çalışan JavaScript/WASM çıktısıyla $\le 10^{-4}$ toleransla parite sağlaması neden zorunludur? Kayan nokta (float32/float64) hassasiyeti ve ZipMap dönüşüm hatalarının bu sürece etkisini belirtiniz. *(10 Puan)*

#### Soru 4: Yazılım Etiği, Telemetri ve KVKK/GDPR Uyumluluğu (25 Puan)
Kullanıcıların öğrenme davranışlarını ölçmek üzere telemetri toplayan bir yazılım tasarlamaktasınız.
- **(a)** Sistemde IP adresi, kullanıcı adı, çerez kimliği veya donanım parmak izi toplamaksızın oturum bazlı davranış analitiği yapmanın "Veri Minimizasyonu (Privacy by Design)" ilkesiyle ilişkisini açıklayınız. *(15 Puan)*
- **(b)** Telemetrinin gizlice bir uzak sunucuya gönderilmesi yerine kullanıcının açık rızasıyla yerel CSV dosyası olarak dışa aktarılmasının yasal ve etik avantajlarını değerlendiriniz. *(10 Puan)*

---

### NOTLANDIRMA VE DEĞERLENDİRME KRİTERLERİ (RUBRIC)

| Not Aralığı | Değerlendirme Ölçütü |
| :--- | :--- |
| **90 – 100 (Mükemmel)** | Dağıtık veri tabanı işlemlerinde veri kaybı riskini tam açıklamış; Expand/Contract desenini doğru kurgulamış; GroupKFold ve veri sızıntısını teorik olarak netleştirmiş; WASM mimari ödünleşimlerini (trade-offs) eksiksiz analiz etmiş ve KVKK prensiplerini doğru bağdaştırmıştır. |
| **75 – 89 (İyi)** | Teknik kavramları doğru kavramış, desenleri ve WASM çıkarım avantajlarını açıklamış ancak matematiksel veya parite detaylarında küçük eksikler bırakmıştır. |
| **50 – 74 (Orta)** | Temel kavramları (rollback, accuracy, KVKK) genel hatlarıyla bilmekte fakat sistem seviyesi tasarım ve çapraz doğrulama sızıntısı detaylarına yeterince değinememiştir. |
| **0 – 49 (Yetersiz)** | Mimari desenleri veya makine öğrenmesi doğrulama prensiplerini hatalı aktarmıştır. |

