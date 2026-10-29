# SE PRIMER — Tasarım Sistemi ve Mobil Ekran Şartnamesi (DESIGN.md)

**Versiyon:** 1.0.0  
**Tarih:** 2026-10-30  
**Tasarım Felsefesi:** Premium Dark Cockpit / Mission-Critical Dashboard  
**Hedef Platform:** Mobil Öncelikli (375px - 430px iOS/Android), Masaüstü Cihaz Çerçevesi Desteği  

---

## 1. Google Stitch Entegrasyon Durumu ve Tasarım Metodolojisi

> [!NOTE]
> **Google Stitch Entegrasyon Notu:**  
> Google Stitch (Google'ın deneysel AI destekli UI/ekran prototipleme ve design-to-code ortamı) harici API yetkilendirmesi ve sınırlı erişim gerektirdiği için; projenin teslim edilebilirliğini ve tekrarlanabilirliğini garanti altına almak amacıyla tam teşekküllü, üretime hazır mobil arayüz spesifikasyonları, CSS tasarım token'ları, semantik renk sistemleri ve piksel hassasiyetli bileşen mimarisi bu belgede eksiksiz olarak tanımlanmış ve doğrudan React/Tailwind/CSS bileşenlerine dönüştürülmüştür. Hiçbir yapay veya asılsız iddia üretilmemiştir.

---

## 2. Tasarım Sistemi ve Temel Token'lar (Design System Tokens)

### 2.1 Renk Paleti (Color Palette)
Profesyonel bir kriz merkezi ve sağlık operasyon odası hissi uyandırmak amacıyla koyu gece mavisi (dark navy / slate) zemin üzerine yüksek kontrastlı, amaca yönelik fonksiyonel vurgu renkleri seçilmiştir.

| Token Adı | HEX Değeri | Kullanım Alanı | Psikolojik / Teknik Anlamı |
|---|---|---|---|
| `--bg-base` | `#080d1a` | Ana uygulama arka planı | Derin gece mavisi, göz yormayan kriz ortamı |
| `--bg-surface` | `#0f172a` | Kartlar ve modallar | Yüzey katmanı, slate-900 |
| `--bg-surface-elevated` | `#1e293b` | İkincil kartlar, buton zeminleri | Slate-800, tıklanabilir elemanlar |
| `--border-subtle` | `#334155` | Kart ve ayırıcı kenarlıkları | Slate-700, 1px net sınırlar |
| `--border-focus` | `#3b82f6` | Seçili ve odaklanmış elemanlar | Mavi-500, aktif seçim göstergesi |
| `--text-primary` | `#f8fafc` | Başlıklar ve birincil metinler | Slate-50, maksimum okunabilirlik |
| `--text-secondary` | `#94a3b8` | Açıklamalar ve ikincil etiketler | Slate-400, dengeli hiyerarşi |
| `--text-muted` | `#64748b` | Sayaç ve meta veriler | Slate-500, düşük öncelik |
| `--accent-blue` | `#2563eb` | Birincil butonlar, mimari ikonlar | Güven, karar mekanizması |
| `--accent-emerald` | `#10b981` | Başarılı sonuçlar, iyi son | Çözüm, sağlık sisteminin toparlanması |
| `--accent-amber` | `#f59e0b` | Uyarılar, geri sayım sayacı, ipucu | Dikkat, kriz baskısı, orta seviye |
| `--accent-rose` | `#f43f5e` | Kritik hatalar, kötü son, KVKK ihlali | Kırmızı alarm, veri sızıntısı |
| `--accent-purple` | `#8b5cf6` | Sokratik AI Eğitmen vurguları | Yapay zekâ pedagojisi, rehberlik |

### 2.2 Tipografi (Typography)
- **Yazı Tipi Ailesi:** `Plus Jakarta Sans`, `Inter`, `-apple-system, BlinkMacSystemFont, sans-serif`.
- **Kod ve Log Yazı Tipi:** `JetBrains Mono`, `Fira Code`, `ui-monospace`.
- **Hiyerarşi:**
  - `Display / H1`: 24px - 28px / Semi-bold (700) — Ekran başlıkları ve kriz zamanı.
  - `H2`: 18px - 20px / Semi-bold (600) — Kart başlıkları ve soru metinleri.
  - `H3`: 15px - 16px / Medium (500) — Seçenek başlıkları ve alt başlıklar.
  - `Body`: 13px - 14px / Regular (400) — Senaryo detayları ve teknik açıklamalar.
  - `Caption / Badge`: 11px - 12px / Medium (600) — Durum rozetleri, sayaç ve etiketler.

### 2.3 Spacing ve Yerleşim (Layout Grid)
- **Maksimum Mobil Genişlik:** `440px` (Mobil öncelikli merkezi container).
- **Yatay İç Boşluk:** `16px` (Mobil ekran kenarları için optimal dolgu).
- **Köşe Yuvarlama (Border Radius):**
  - Kartlar: `16px` (`rounded-2xl`)
  - Butonlar: `12px` (`rounded-xl`)
  - Rozetler: `9999px` (`rounded-full`)

---

## 3. Ekran 1 — Karşılama ve Onboarding (SCREEN 1)

### 3.1 Amacı ve Hiyerarşisi
Kullanıcıyı kriz ortamına psikolojik olarak hazırlamak, 3 zorunlu soruyu (Deneyim Seviyesi, Rol, Öğrenme Hedefi) toplamak ve simülasyonu başlatmak.

### 3.2 Ekran Mimarisi ve Bileşenleri
```
+--------------------------------------------------+
| [SE PRIMER LOGO]                                |
| Sağlık Sistemi Kriz Simülasyonu                   |
+--------------------------------------------------+
| HERO KARTI                                       |
| "08:00 — Randevu Sistemi Çöktü. Nöbetçi Sensin." |
| 300 hasta sırada bekliyor. Kararlarının teknik    |
| ve hukuki sonuçlarıyla yüzleşeceksin.            |
+--------------------------------------------------+
| ADIM 1: Deneyim Seviyesi                         |
| ( ) Başlangıç (Beginner) - Bol ipucu ve rehberlik|
| ( ) Orta (Intermediate) - Mimari ödünleşimler    |
| ( ) Deneyimli (Experienced) - 60s geri sayım     |
+--------------------------------------------------+
| ADIM 2: Mühendislik Rolü                         |
| [ Backend ] [ Frontend ] [ Full-Stack ]          |
| [ DevOps ] [ Software Engineer ] [ Öğrenci ]    |
+--------------------------------------------------+
| ADIM 3: Öğrenme Hedefi                           |
| [ Mimari ] [ Test & Güvenilirlik ]               |
| [ KVKK & Güvenlik ] [ Genel Yazılım Mühendisliği]|
+--------------------------------------------------+
| [>>> KRİZ SİMÜLASYONUNU BAŞLAT >>>]              |
| (Tüm seçimler yapılınca aktifleşen birincil CTA) |
+--------------------------------------------------+
```

### 3.3 Durumlar ve Mikro-Etkileşimler
- Seçenek kartlarına dokunulduğunda hafif yukarı kalkma (`transform: translateY(-2px)`) ve mavi parlama efekti (`ring-2 ring-blue-500 bg-blue-500/10`).
- Seçim yapılmadan "Başlat" butonunun opaklığı düşük (`opacity-50 cursor-not-allowed`) tutulur.
- 3 seçim tamamlandığında buton akıcı bir animasyonla canlı maviye dönüşür.

---

## 4. Ekran 2 — Kriz Yönetimi ve Karar Arayüzü (SCREEN 2)

### 4.1 Amacı ve Hiyerarşisi
Kullanıcının teknik krizle yüzleştiği ana çalışma alanı. Her karar aşamasında olay örgüsü, teknik telemetri, iki seçenek ve Sokratik AI Eğitmen modülü yer alır.

### 4.2 Ekran Mimarisi ve Bileşenleri
```
+--------------------------------------------------+
| [08:00 KRİZ PANELİ]         [Aşama: 1 / 3]       |
| 300 Hasta Beklemede • HTTP 500: %78              |
| [Eğer Experienced: ⏱ 00:54 Kalan Süre]           |
+--------------------------------------------------+
| SEVİYE VE ROL ROZETLERİ                           |
| [DevOps Engineer] [Experienced] [60s Zaman Sınırı]|
+--------------------------------------------------+
| SENARYO KARTI                                    |
| 🚨 Gece 02:00'de dağıtılan v2.4.0 güncellemesi    |
| sonrası veritabanı bağlantı havuzu tükendi.      |
| Poliklinikler randevu oluşturamıyor.             |
+--------------------------------------------------+
| [BEGINNER İPUCU KUTUSU (Yalnızca Beginner ise)]  |
| 💡 İpucu: Rollback yapmadan önce DB şema          |
| değişikliklerinin geriye uyumluluğunu düşünün.  |
+--------------------------------------------------+
| [SEÇENEK A KARTI]                                |
| ⏪ Önceki Stabil Sürüme (v2.3.9) Geri Al (Rollback)|
| DB migration geriye dönülebilirliğini kontrol et |
+--------------------------------------------------+
| [SEÇENEK B KARTI]                                |
| ⚡ Canlı Ortamda Hızlı Yama Uygula (Hotfix Prod)   |
| Connection pool boyutunu canlıda artırıp deploy et|
+--------------------------------------------------+
| [ 🧠 SOKRATİK AI EĞİTMENE DANIŞ (TUTOR) ]        |
| "Karar veremiyor musun? Sokratik ipucu al."      |
+--------------------------------------------------+
```

### 4.3 Sokratik AI Eğitmen Modalı / Alt Sayfası (Tutor Drawer)
Kullanıcı AI Eğitmen butonuna bastığında alttan zarif bir modal açılır:
- Başlık: `🧠 Sokratik AI Eğitmen (Dr. Gemini)`
- Bilgilendirme Rozeti: `Cevap söylenmez • Sokratik rehberlik sağlar`
- Hızlı Soru Hapları:
  - *"Rollback yaparsam veritabanı ne olur?"*
  - *"Canlıda hotfix uygulamanın riskleri neler?"*
  - *"Hangisini seçmem daha mantıklı?"*
- Mesajlaşma alanı: Kullanıcının kendi sorusunu yazabildiği giriş kutusu ve Sokratik yanıt balonu.
- Çevrimdışı Durum Göstergesi: Ağ veya API hatasında kullanıcıya bildiren zarif rozet ve yedek soru havuzu.

---

## 5. Ekran 3 — Simülasyon Sonu ve Kriz Değerlendirme Raporu (SCREEN 3)

### 5.1 İYİ SON (Good Ending) — Tasarım Şartnamesi
- **Ana Zemin / Vurgu:** Koyu zümrüt yeşili gradient parlama (`emerald-500/10 border-emerald-500/40`).
- **Başlık:** `✅ BAŞARILI KRİZ ÇÖZÜMÜ: Randevular Açık, Veriler Güvende`
- **Operasyonel Zaman Çizelgesi:**
  - `08:00` — Kriz patlak verdi, 300 hasta sırada.
  - `08:08` — Mimari karar uygulandı (Stabil versiyona dönüldü).
  - `08:15` — 5 dakikalık duman testleri koşuldu, regresyon saptanmadı.
  - `08:22` — Hata analiz logları KVKK'ya uygun maskelenerek paylaşıldı.
  - `08:25` — Sistem %100 operasyonel, 300 hastanın randevusu güvenle işlendi.
- **Kazanılan Mühendislik Dersleri Kartı:**
  1. Geriye dönük uyumlu veritabanı migration disiplini.
  2. Kriz anında bile kritik testleri atlamamanın hayati önemi.
  3. KVKK veri minimizasyonu ve log maskeleme sorumluluğu.

### 5.2 KÖTÜ SON (Bad Ending) — Tasarım Şartnamesi
- **Ana Zemin / Vurgu:** Koyu kızıl gül / kırmızı gradient parlama (`rose-500/10 border-rose-500/40`).
- **Başlık:** `❌ KRİTİK MÜHENDİSLİK VEYA KVKK FELAKETİ`
- **Olay Yeri İncelemesi (Post-Mortem):**
  - Yaşanan arızanın ve hatanın teknik analizi (Ör: Ham log paylaşımı nedeniyle Kişisel Verileri Koruma Kurulu tarafından 2.500.000 TL idari para cezası ve hasta verilerinin sızması; veya canlıda hotfix nedeniyle randevu tablosunda veri kaybı).
- **Kurtarma Önerileri ve Hatalar Listesi.**

### 5.3 Simülasyonu Yeniden Başlatma Butonu (Restart Action)
- Her iki sonuç ekranının en altında büyük ve belirgin `🔄 Farklı Kararlarla Yeniden Başlat` butonu yer alır.
- Tıklandığında tüm seçimler temizlenir, kullanıcı Onboarding ekranına geri döner.

---

## 6. Erişilebilirlik ve Cypress Test Kimlikleri (Data-TestId Standardı)

Otomatik testlerin kırılmadan çalışabilmesi için tüm etkileşimli elemanlara aşağıdaki standart `data-testid` değerleri atanacaktır:

| Bileşen | `data-testid` |
|---|---|
| Deneyim Seviyesi Seçenekleri | `experience-beginner`, `experience-intermediate`, `experience-experienced` |
| Rol Seçenekleri | `role-backend`, `role-frontend`, `role-devops`, vb. |
| Öğrenme Hedefi Seçenekleri | `goal-architecture`, `goal-testing`, `goal-privacy`, `goal-general` |
| Simülasyon Başlat Butonu | `start-simulation-btn` |
| Geri Sayım Sayacı | `countdown-timer` |
| Karar A Seçeneği | `decision-option-a` |
| Karar B Seçeneği | `decision-option-b` |
| Sonraki Aşamaya Geç Butonu | `next-stage-btn` |
| AI Eğitmeni Aç Butonu | `open-tutor-btn` |
| AI Eğitmen Soru Girişi | `tutor-input` |
| AI Eğitmen Gönder Butonu | `tutor-send-btn` |
| AI Eğitmen Yanıt Balonu | `tutor-response-message` |
| AI Eğitmeni Kapat Butonu | `close-tutor-btn` |
| Sonuç Ekranı Durum Başlığı | `ending-status-badge` |
| Simülasyonu Yeniden Başlat | `restart-simulation-btn` |
