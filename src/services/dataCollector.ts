import { DecisionChoice, DecisionStageId, ExperienceLevel, SessionDecisionRecord, UserProfile } from '../types';

export function getExperienceCode(level: ExperienceLevel): number {
  switch (level) {
    case 'beginner': return 0;
    case 'intermediate': return 1;
    case 'experienced': return 2;
    default: return 0;
  }
}

/**
 * Calculates ground-truth 'destek_gerekli' label without data leakage.
 * Rules aligned with data/SOZLUK.md:
 * 1. If player chose a risky/destructive option (Hotfix B in Stage 1, Skip Tests B in Stage 2, Raw Logs B in Stage 3) -> 1
 * 2. If player consulted AI Tutor before making the decision -> 1
 * 3. If decision took longer than normal threshold with hesitation/switches -> 1
 * 4. Otherwise (correct decision, confident, no tutor dependency) -> 0
 */
export function calculateGroundTruthSupportLabel(
  stageId: DecisionStageId,
  choice: DecisionChoice,
  tutorQuestionsInStage: number,
  durationSec: number,
  switchCount: number,
  level: ExperienceLevel
): 0 | 1 {
  // Risky choice in any stage requires learning support
  if (choice === 'B') {
    return 1;
  }

  // If player asked AI tutor for help during this stage
  if (tutorQuestionsInStage > 0) {
    return 1;
  }

  // Hesitation thresholds: Beginner > 45s with switches, Intermediate > 35s with switches, Experienced > 25s with switches
  const hesitationDurationThreshold = level === 'experienced' ? 25 : level === 'intermediate' ? 35 : 45;
  if (durationSec > hesitationDurationThreshold && switchCount >= 2) {
    return 1;
  }

  return 0;
}

/**
 * Creates a validated session record
 */
export function createDecisionRecord(
  sessionId: string,
  stageId: DecisionStageId,
  profile: UserProfile,
  choice: DecisionChoice,
  durationSec: number,
  switchCount: number,
  previousWrongCount: number,
  tutorQuestionsInStage: number,
  source: 'gercek' | 'sentetik' = 'gercek'
): SessionDecisionRecord {
  const roundedDuration = Math.round(Math.max(0.1, durationSec) * 10) / 10;
  const destekGerekli = calculateGroundTruthSupportLabel(
    stageId,
    choice,
    tutorQuestionsInStage,
    roundedDuration,
    switchCount,
    profile.experience
  );

  return {
    oturum_id: sessionId,
    sahne_no: stageId,
    seviye: profile.experience,
    seviye_kod: getExperienceCode(profile.experience),
    rol: profile.role,
    hedef: profile.goal,
    karar_suresi_sn: roundedDuration,
    karar_degistirme_sayisi: Math.max(0, switchCount),
    onceki_yanlis_sayisi: previousWrongCount,
    ipucu_sayisi: tutorQuestionsInStage,
    secilen_secenek: choice,
    destek_gerekli: destekGerekli,
    kaynak: source,
    zaman_damgasi: new Date().toISOString(),
  };
}

/**
 * Converts records to CSV string compliant with data/oturumlar.csv schema
 */
export function recordsToCSV(records: SessionDecisionRecord[], includeHeader = true): string {
  const header = 'oturum_id,sahne_no,seviye,seviye_kod,rol,hedef,karar_suresi_sn,karar_degistirme_sayisi,onceki_yanlis_sayisi,ipucu_sayisi,secilen_secenek,destek_gerekli,kaynak,zaman_damgasi';
  const rows = records.map(r => 
    `${r.oturum_id},${r.sahne_no},${r.seviye},${r.seviye_kod},${r.rol},${r.hedef},${r.karar_suresi_sn},${r.karar_degistirme_sayisi},${r.onceki_yanlis_sayisi},${r.ipucu_sayisi},${r.secilen_secenek},${r.destek_gerekli},${r.kaynak},${r.zaman_damgasi}`
  );

  return includeHeader ? [header, ...rows].join('\n') : rows.join('\n');
}

/**
 * Triggers a client-side file download of CSV data
 */
export function downloadCSVFile(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

