import { DecisionChoice, DecisionStageId, EndingData, SimulationState, UserProfile } from '../types';
import { ENDINGS_DATA, SCENARIO_STAGES } from '../data/scenarioData';

export const INITIAL_SIMULATION_STATE: SimulationState = {
  profile: null,
  currentStageId: 1,
  decisions: {},
  activeConsequence: null,
  isSimulating: false,
  isCompleted: false,
  isTutorOpen: false,
};

/**
 * Evaluates the 3 decisions to determine whether the simulation ends in a Good or Bad outcome.
 * 
 * Decision Combinations (2^3 = 8 paths):
 * - Path 1: A-A-A -> Good Ending (Rollback, Smoke test, Mask PII)
 * - Path 2: A-A-B -> Bad Ending (Rollback, Smoke test, Raw logs -> KVKK Violation)
 * - Path 3: A-B-A -> Bad Ending (Rollback, Immediate deploy -> Untested schema glitch)
 * - Path 4: A-B-B -> Bad Ending (Rollback, Immediate deploy, Raw logs -> Schema glitch + KVKK)
 * - Path 5: B-A-A -> Good Ending (Hotfix, Smoke test catches bugs, Mask PII -> Narrow recovery)
 * - Path 6: B-A-B -> Bad Ending (Hotfix, Smoke test, Raw logs -> KVKK Violation)
 * - Path 7: B-B-A -> Bad Ending (Hotfix, Immediate deploy, Mask PII -> Prod DB Deadlock)
 * - Path 8: B-B-B -> Bad Ending (Hotfix, Immediate deploy, Raw logs -> Total System Catastrophe)
 */
export function evaluateSimulationOutcome(decisions: {
  1?: DecisionChoice;
  2?: DecisionChoice;
  3?: DecisionChoice;
}): EndingData {
  const d1 = decisions[1];
  const d2 = decisions[2];
  const d3 = decisions[3];

  // If KVKK decision (d3) is B (Raw logs), it is ALWAYS a Bad Ending due to severe data privacy violation
  if (d3 === 'B') {
    return {
      ...ENDINGS_DATA.bad,
      title: "KRİTİK KVKK İHLALİ VE VERİ SIZINTISI FELAKETİ",
      subtitle: "Sistem Teknik Olarak Açılsa Bile Hukuki Yıkım Yaşandı",
      summary: "Karar 3'te hasta verilerinin maskelenmeden açık kanallarda paylaşılması affedilemez bir KVKK ihlali doğurdu. Kişisel Verileri Koruma Kurulu (KVKK) 2.500.000 TL idari para cezası ve cezai soruşturma başlattı.",
    };
  }

  // If testing decision (d2) is B (Immediate deploy without testing)
  if (d2 === 'B') {
    if (d1 === 'B') {
      // B-B-A: Hotfix + No Test -> Catastrophic Database Deadlock
      return {
        ...ENDINGS_DATA.bad,
        title: "ÜRETİM ORTAMI KİLİTLENMESİ (CASCADING DEADLOCK)",
        subtitle: "Test Edilmemiş Canlı Yama Sistemi Tamamen Durdurdu",
        summary: "Canlı ortamda test edilmeden dağıtılan aceleci yama, veritabanı connection pool'unu tüketmekle kalmadı; deadlock yaratarak 300 hastanın randevu kayıtlarını kilitledi.",
      };
    } else {
      // A-B-A: Rollback + No Test -> Schema mismatch regression
      return {
        ...ENDINGS_DATA.bad,
        title: "ŞEMA UYUMSUZLUĞU VE VERİ TUTARSIZLIĞI",
        subtitle: "Duman Testi Atlandığı İçin Eski Sürüm Yeni Şemayı Bozdu",
        summary: "Geri alma (rollback) sonrası kritik duman testleri atlandığı için, v2.4.0 ile eklenen veritabanı sütunları v2.3.9 kodunun sessizce çökmesine ve randevuların kaybolmasına yol açtı.",
      };
    }
  }

  // At this point: d2 === 'A' (Tested) and d3 === 'A' (Masked PII)
  if (d1 === 'A') {
    // Path 1: A-A-A -> Golden Standard Good Ending
    return {
      ...ENDINGS_DATA.good,
      title: "MÜKEMMEL KRİZ YÖNETİMİ: Randevular Açık, Veriler Güvende",
      subtitle: "Stabil Rollback, Duman Testleri ve KVKK Uyumlu İletişim",
      summary: "Örnek bir on-call mühendislik yaklaşımı sergilendi. Stabil sürüme dönüldü, kritik yol testleri doğrulandı ve hasta mahremiyeti eksiksiz korundu. 300 hasta randevusunu aldı.",
    };
  } else {
    // Path 5: B-A-A -> Tough but Good Ending (Hotfix survived thanks to smoke testing)
    return {
      ...ENDINGS_DATA.good,
      title: "ZORLU KURTARIŞ: Canlı Yama Testlerle Güvenceye Alındı",
      subtitle: "Riskli Hotfix Seçimi Disiplinli Duman Testiyle Kurtarıldı",
      summary: "Canlıda yama uygulamak yüksek riskliydi; ancak 5 dakikalık duman testinde tespit edilen bellek sızıntısı giderildi ve hasta verileri titizlikle maskelendi. Sistem başarıyla stabilize edildi.",
    };
  }
}

export function getNextStageId(currentStage: DecisionStageId): DecisionStageId | null {
  if (currentStage === 1) return 2;
  if (currentStage === 2) return 3;
  return null;
}

export function getCurrentStageData(stageId: DecisionStageId) {
  return SCENARIO_STAGES[stageId];
}
