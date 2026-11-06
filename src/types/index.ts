export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';

export type EngineeringRole = 
  | 'backend' 
  | 'frontend' 
  | 'fullstack' 
  | 'devops' 
  | 'software' 
  | 'student';

export type LearningObjective = 
  | 'architecture' 
  | 'testing' 
  | 'privacy' 
  | 'general';

export interface UserProfile {
  experience: ExperienceLevel;
  role: EngineeringRole;
  goal: LearningObjective;
}

export type DecisionStageId = 1 | 2 | 3;
export type DecisionChoice = 'A' | 'B';

export interface DecisionOption {
  id: DecisionChoice;
  title: string;
  shortDesc: string;
  actionLabel: string;
  badge: string;
  riskLevel: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
}

export interface Consequence {
  title: string;
  summary: string;
  whatHappened: string;
  whyItHappened: string;
  technicalDetails: string;
  metrics: {
    systemStatus: 'Kurtarıldı' | 'Kısmi Arıza' | 'Kritik Çöküş' | 'İncelemede';
    activePatients: string;
    downtime: string;
    riskScore: string;
  };
}

export interface DecisionStage {
  id: DecisionStageId;
  title: string;
  subtitle: string;
  category: 'Mimari' | 'Test & Güvenilirlik' | 'KVKK & Gizlilik';
  scenario: string;
  systemMetrics: {
    time: string;
    waitingPatients: number;
    errorRate: string;
    dbConnections: string;
  };
  options: {
    A: DecisionOption;
    B: DecisionOption;
  };
  consequences: {
    A: Consequence;
    B: Consequence;
  };
  beginnerHint: string;
  roleContext: Record<EngineeringRole, string>;
}

export interface SimulationState {
  profile: UserProfile | null;
  currentStageId: DecisionStageId;
  decisions: {
    1?: DecisionChoice;
    2?: DecisionChoice;
    3?: DecisionChoice;
  };
  activeConsequence: Consequence | null;
  isSimulating: boolean;
  isCompleted: boolean;
  isTutorOpen: boolean;
  // The Primer v2 State Extensions
  sessionId: string;
  dataCollectionMode: boolean;
  records: SessionDecisionRecord[];
  currentStageStartTime: number;
  currentStageSwitchCount: number;
  totalTutorQuestionsAsked: number;
  currentPrediction: ModelPrediction | null;
  modelStatus: 'idle' | 'loading' | 'ready' | 'fallback' | 'error';
}

export interface SessionDecisionRecord {
  oturum_id: string;
  sahne_no: DecisionStageId;
  seviye: ExperienceLevel;
  seviye_kod: number; // 0: beginner, 1: intermediate, 2: experienced
  rol: EngineeringRole;
  hedef: LearningObjective;
  karar_suresi_sn: number;
  karar_degistirme_sayisi: number;
  onceki_yanlis_sayisi: number;
  ipucu_sayisi: number;
  secilen_secenek: DecisionChoice;
  destek_gerekli: 0 | 1;
  kaynak: 'gercek' | 'sentetik';
  zaman_damgasi: string;
}

export interface ModelPrediction {
  probability: number;
  threshold: number;
  needsSupport: boolean;
  isFallback: boolean;
  explanation: string;
  latencyMs?: number;
}

export interface EndingData {
  type: 'good' | 'bad';
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  timeline: Array<{
    time: string;
    event: string;
    status: 'success' | 'warning' | 'danger';
  }>;
  rootCauseAnalysis: string;
  engineeringLessons: string[];
  kvkkStatus: string;
  metrics: {
    resolvedPatients: number;
    totalDowntime: string;
    complianceScore: string;
    recoveryQuality: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}
