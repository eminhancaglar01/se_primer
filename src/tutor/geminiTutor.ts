import { GoogleGenerativeAI } from '@google/generative-ai';
import { DecisionStageId, UserProfile } from '../types';
import { SCENARIO_STAGES } from '../data/scenarioData';

// System prompt enforcing strict Socratic pedagogy, zero answer leakage, and Turkish responses
export function buildSocraticSystemPrompt(profile: UserProfile | null, stageId: DecisionStageId): string {
  const stage = SCENARIO_STAGES[stageId];
  const userLevel = profile?.experience || 'beginner';
  const userRole = profile?.role || 'software';
  const userGoal = profile?.goal || 'general';

  return `SEN KİMSİN:
Adın "Dr. Gemini". Sağlık ve kritik sistemler alanında 15+ yıl deneyimli Kıdemli Başyazılım Mühendisisin (Senior Principal Systems Engineer). 
Şu anda "SE Primer" kriz simülasyonunda on-call (nöbetçi) mühendise rehberlik eden bir SOKRATİK EĞİTMENSİN (Socratic AI Tutor).

TEMEL PEDAGOJİK GÖREVİN:
Öğrencinin yerine karar verme. Asla doğru cevabı veya hangi seçeneği seçmesi gerektiğini doğrudan ya da dolaylı olarak söyleme.
Öğrencinin kendi mühendislik muhakemesini (engineering reasoning) yapmasını sağla. Ona cevabı değil; doğru cevabı bulmasını sağlayacak TEKNİK SORULARI ve KAVRAMLARI ver.

KATI KURALLAR (KESİNLİKLE UYULACAK):
1. SIFIR CEVAP SIZINTISI (ZERO ANSWER LEAKAGE):
   - "A şıkkını seç", "B'yi seçmelisin", "Rollback yap", "Duman testi koş", "Logları maskele", "Bence ilki daha iyi" gibi ifadeler KESİNLİKLE YASAKTIR.
   - "Seçenek A daha güvenlidir", "Doğru yol A'dır" gibi dolaylı imalar dahi YASAKTIR.
   - Öğrenci "Hangisini seçmeliyim?", "Doğru cevap ne?" diye sorsa bile asla cevap verme; kararı verirken hangi teknik faktörleri tartması gerektiğini sor.

2. DİL VE TON:
   - Yanıtların TAMAMI profesyonel ve akıcı TÜRKÇE olacaktır.
   - Yapay, klişe bot cümleleri kurma. Bir kıdemli mühendis gibi doğal, yapıcı ve düşündürücü konuş.
   - Yanıtlarını 2-3 kısa paragrafta tut (mobil ekranda kolay okunması için).

3. KİŞİSELLEŞTİRME VE ÖĞRENCİ PROFİLİ:
   - Seviye: ${userLevel.toUpperCase()}
     * beginner: Sade Türkçe kullan, kavramları açıkla, cesaretlendirici ol.
     * intermediate: Mimari ve operasyonel ödünleşimlere (trade-offs) odaklan.
     * experienced: İleri seviye sistem terminolojisi kullan (deadlock, transaction isolation, backward compatibility, RPO/RTO), kısa ve net ol.
   - Rol: ${userRole.toUpperCase()} (Örnekleri bu role göre ver).
   - Hedef: ${userGoal.toUpperCase()}

4. MEVCUT KRİZ VE AŞAMA BAĞLAMI:
   - Aşama: ${stage.title} (${stage.category})
   - Olay: 08:00'de randevu sistemi çöktü, 300 hasta sırada.
   - Aşama Detayı: ${stage.scenario}
   - Bu aşamadaki teknik gerilim: ${stage.beginnerHint}

ÖRNEK DOĞRU SOKRATİK DAVRANIŞ:
Öğrenci: "Rollback mi yapayım yoksa canlıda hotfix mi?"
Doğru Yanıt: "Bu aşamada iki kritik faktörü düşünmelisin: v2.4.0 sürümüyle veritabanında geriye dönük uyumsuz bir şema değişikliği (migration) yapıldı mı? Eğer yapıldıysa, eski koda (v2.3.9) döndüğünde eski servis yeni tablo yapısıyla sorunsuz çalışabilir mi? Canlıda doğrudan hotfix uygulamanın ise test edilmemiş hangi gizli bağımlılıkları tetikleyebileceğini tarttın mı?"`;
}

// Pre-compiled contextual Socratic responses when Gemini API is unavailable or offline
export function getOfflineSocraticResponse(
  userInput: string,
  stageId: DecisionStageId,
  profile: UserProfile | null
): string {
  const query = userInput.toLowerCase();
  const role = profile?.role || 'software';
  const level = profile?.experience || 'beginner';

  // Check stage 1: Architecture
  if (stageId === 1) {
    if (query.includes('hangisi') || query.includes('doğru') || query.includes('seç') || query.includes('ne yap')) {
      return `Kriz anında doğru seçimi bulmak için şu iki kritik soruyu tartmalısın: 
1) Gece canlıya alınan v2.4.0 sürümündeki veritabanı migration'ları geriye dönük uyumlu (backward-compatible) mu? Eski kod (v2.3.9) mevcut veritabanı şemasıyla sorunsuz konuşabilir mi?
2) Canlıda hızlı bir hotfix atmak bağlantı havuzunu rahatlatabilir, fakat kod incelemesinden (code review) geçmemiş bir yamayı 300 hastanın işlem yaptığı sırada dağıtmanın yaratacağı yan etkileri nasıl göze alırsın?`;
    }
    if (query.includes('rollback') || query.includes('geri')) {
      return `Geri alma (rollback) kulağa en güvenli sığınak gibi gelebilir. Fakat bir sistem mühendisi olarak sormalısın: Dağıtım sırasında geri dönüşü olmayan (destructive) bir tablo değişikliği yapıldı mı? Eski sürüme döndüğünde yetim kalan (orphaned) kayıtlar oluşur mu? Bunu nasıl doğrularsın?`;
    }
    if (query.includes('hotfix') || query.includes('yama') || query.includes('canlı')) {
      return `Canlıda acil yama uygulamak hızlı bir can simidi gibi hissettirebilir. Ancak düşün: Havuz limitini artırmak veritabanı sunucusunun CPU ve bellek sınırlarını zorlayıp sistemi tamamen kilitleyebilir mi? ${role === 'backend' ? 'ORM bağlantı sızıntısını canlıda yamamak başka neleri tetikler?' : 'Bu riski almak için yeterli telemetriye sahip misin?'}`;
    }
    return `Mimari bir krizde karar vermeden önce iki tarafın ödünleşimini değerlendir: Stabil bilinen sürüme dönmek mi (şema uyumluluğu kontrolüyle), yoksa canlı ortamda semptomu hızla bastırmaya çalışmak mı? Sence hangisi veri bütünlüğünü daha az tehlikeye atar?`;
  }

  // Check stage 2: Testing
  if (stageId === 2) {
    if (query.includes('hangisi') || query.includes('doğru') || query.includes('seç') || query.includes('ne yap')) {
      return `Hastane yönetimi kapıda beklerken hız ile doğruluk arasında sıkıştın. Şunu düşün:
5 dakikalık bir duman testini beklemek mi hastalar için daha büyük risk, yoksa test edilmeden canlıya sürülen kodun randevu saatlerini çakıştırıp (double-booking) sistemi saatlerce felç etmesi mi? Bu kararı verirken test kapsamını nasıl değerlendiriyorsun?`;
    }
    if (query.includes('test') || query.includes('duman') || query.includes('smoke')) {
      return `5 dakikalık duman testleri kriz anında neden bu kadar kritiktir? Sistemin en temel fonksiyonlarının (randevu oluşturma, kimlik doğrulama) canlıya çıkmadan önce onaylanması, olası bir ikincil çöküşü nasıl engeller?`;
    }
    if (query.includes('atla') || query.includes('hemen') || query.includes('canlıya')) {
      return `Hemen dağıtmak acil baskıyı birkaç dakikalığına dindirebilir. Fakat test edilmemiş bir serialization veya thread çakışması canlıda 300 hastanın kayıtlarını bozarsa, bunu geri almak ne kadar sürer?`;
    }
    if (query.includes('derlendi') || query.includes('gerek var')) {
      return `Kodun derlenmesi (compilation) sadece sözdizimsel doğruluğu gösterir; iş mantığının ve veritabanı işlemlerinin doğru çalıştığını kanıtlar mı? Duman testleri yapmadan çalışma zamanı güvenliğini nasıl doğrularsın?`;
    }
    return `Test kararı verirken şu soruyu cevaplamalısın: Dağıtacağın düzeltmenin temel iş akışlarını bozmadığından emin olmak için 5 dakikalık bir kritik yol testini göze alabilir misin?`;
  }

  // Check stage 3: Privacy & KVKK
  if (stageId === 3) {
    if (query.includes('hangisi') || query.includes('doğru') || query.includes('seç') || query.includes('ne yap')) {
      return `Teknik kriz çözülürken hukuki ve etik sınırları hatırlamalısın:
Teknik ekibin sorunu çözmesi için hastaların açık T.C. Kimlik Numaralarına ve poliklinik tanılarına (psikiyatri, onkoloji vb.) gerçekten ihtiyacı var mı? Yoksa hata ayıklama için stack trace ve korelasyon ID'leri yeterli değil mi? Veri minimizasyonu ilkesi burada ne söyler?`;
    }
    if (query.includes('maskele') || query.includes('gizle') || query.includes('anonim')) {
      return `Kişisel verileri maskelemek birkaç saniye alabilir. Peki bu işlem teknik ekibin hatayı tespit etme kabiliyetini kısıtlar mı, yoksa sadece gereksiz hassas veriyi mi filtreler? KVKK Madde 12 veri güvenliği sorumluluğunu nasıl karşılarsın?`;
    }
    if (query.includes('ham') || query.includes('hızlı') || query.includes('direkt')) {
      return `Ham logları 40 kişinin ve dış paydaşların olduğu kanala atmak anlık bir kolaylık sağlar. Ancak sağlık verileri özel nitelikli kişisel veridir. Olası bir sızıntıda kuruma kesilecek milyonluk cezayı ve hastaların mahremiyetini nasıl savunursun?`;
    }
    return `KVKK açısından düşün: Hata analizinde teknik ekipler için kritik olan bilgi nedir? Hastanın adı ve tanısı mı, yoksa sistemin ürettiği hata kodu ve SQL sorgusu mu?`;
  }

  return `Kriz ortamında bir mühendis olarak düşün: Alacağın kararın sistem kararlılığına, veri tutarlılığına ve hasta güvenliğine etkileri neler olur? Bu aşamadaki iki seçeneğin teknik risklerini nasıl karşılaştırırsın?`;
}

/**
 * Sends a query to the Socratic AI Tutor.
 * Automatically attempts Gemini API call if key is available,
 * otherwise falls back cleanly to the offline Socratic reasoning engine.
 */
export async function askSocraticTutor(
  userQuery: string,
  stageId: DecisionStageId,
  profile: UserProfile | null
): Promise<{ text: string; isFallback: boolean }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If no API key is provided or it's placeholder, use offline Socratic fallback immediately
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return {
      text: getOfflineSocraticResponse(userQuery, stageId, profile),
      isFallback: true,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSocraticSystemPrompt(profile, stageId),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 350,
      },
    });

    const prompt = `Öğrenci Profili: ${profile?.experience || 'beginner'} seviye, ${profile?.role || 'software'} rolü, hedef: ${profile?.goal || 'general'}.
Mevcut Aşama: Aşama ${stageId}.
Öğrencinin Sorusu: "${userQuery}"

Lütfen Sokratik kurallara uyarak, ASLA doğru cevabı doğrudan veya dolaylı vermeden, düşündürücü teknik sorularla Türkçe yanıt ver.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText || responseText.trim() === '') {
      throw new Error('Boş API yanıtı');
    }

    return {
      text: responseText.trim(),
      isFallback: false,
    };
  } catch (error) {
    console.warn('Gemini API çağrısı başarısız oldu, Sokratik yedek motor devreye alındı:', error);
    return {
      text: getOfflineSocraticResponse(userQuery, stageId, profile),
      isFallback: true,
    };
  }
}
