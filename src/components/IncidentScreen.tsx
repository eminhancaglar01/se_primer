import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Brain, 
  CheckCircle2, 
  Cpu, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { DecisionChoice, DecisionStage, ModelPrediction, UserProfile } from '../types';
import { DecisionCard } from './DecisionCard';
import { CountdownTimer } from './CountdownTimer';

interface IncidentScreenProps {
  stage: DecisionStage;
  profile: UserProfile | null;
  onSelectOption: (choice: DecisionChoice) => void;
  onOpenTutor: () => void;
  timeRemaining?: number;
  onTimeout?: () => void;
  prediction?: ModelPrediction | null;
  onCardSwitch?: () => void;
  durationSec?: number;
}

export const IncidentScreen: React.FC<IncidentScreenProps> = ({
  stage,
  profile,
  onSelectOption,
  onOpenTutor,
  timeRemaining = 60,
  onTimeout = () => {},
  prediction = null,
  onCardSwitch,
  durationSec = 0,
}) => {
  const [selectedPending, setSelectedPending] = useState<DecisionChoice | null>(null);
  const isBeginner = profile?.experience === 'beginner';
  const isExperienced = profile?.experience === 'experienced';
  const role = profile?.role || 'software';
  const roleAdvice = stage.roleContext[role] || stage.roleContext.software;

  const handleCardClick = (choice: DecisionChoice) => {
    if (selectedPending !== null && selectedPending !== choice) {
      if (onCardSwitch) onCardSwitch();
    }
    setSelectedPending(choice);
    onSelectOption(choice);
  };

  const probValue = prediction ? prediction.probability : 0.0;
  const needsSupport = prediction ? prediction.needsSupport : false;

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-4">
      {/* Experienced 60s Countdown Timer */}
      {isExperienced && (
        <CountdownTimer
          secondsRemaining={timeRemaining}
          totalSeconds={60}
          onTimeout={onTimeout}
          isActive={true}
        />
      )}

      {/* Incident Header Card */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-mono text-xs font-bold text-rose-400">
              {stage.systemMetrics.time} KRİZİ
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {stage.category}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {stage.title}
          </span>
          <h2 className="text-base sm:text-lg font-black text-white leading-snug">
            {stage.subtitle}
          </h2>
        </div>

        {/* Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-medium pt-1">
          <div className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400 block">Bekleyen</span>
            <span className="font-bold text-amber-400">{stage.systemMetrics.waitingPatients} Hasta</span>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400 block">Hata Oranı</span>
            <span className="font-bold text-rose-400">{stage.systemMetrics.errorRate}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400 block">DB Havuzu</span>
            <span className="font-bold text-blue-400">{stage.systemMetrics.dbConnections}</span>
          </div>
        </div>

        {/* Narrative Box */}
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {stage.scenario}
        </p>

        {/* Role-Specific Engineering Context */}
        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-tight">{roleAdvice}</p>
        </div>
      </div>

      {/* The Primer v2 — Real-time ML Inference Indicator */}
      <div 
        data-cy="model-telemetry-card"
        className="p-3 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">ML Destek İhtiyacı:</span>
              <span 
                data-cy="p"
                data-testid="model-probability"
                className={`font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
                  needsSupport 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {probValue.toFixed(4)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {prediction?.isFallback ? 'Kural Tabanlı Yedek Model' : 'ONNX Tarayıcı Çıkarımı'} • {durationSec.toFixed(1)}s
            </span>
          </div>
        </div>

        <span 
          data-cy="model-status"
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            needsSupport 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          {needsSupport ? 'Destek Gerekli' : 'Otonom'}
        </span>
      </div>

      {/* The Primer v2 — Proactive AI Tutor Adaptive Assistance Banner */}
      {needsSupport && (
        <div 
          data-cy="proactive-tutor-banner"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 shadow-lg text-xs space-y-2 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="font-bold text-purple-200">Proaktif Mühendislik Desteği (AI Tutor)</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              P &ge; %50
            </span>
          </div>

          <p className="text-[11px] text-slate-200 leading-relaxed">
            {stage.id === 1 && "⚠️ Veritabanı bağlantı havuzu tükenmiş durumda. Canlıda alelacele yapılan hotfix kodu veritabanında deadlock yaratabilir. Karar vermeden önce v2.4.0 sürümündeki veritabanı migration'larının geri alınabilirliğini tart."}
            {stage.id === 2 && "⚠️ Hastane yönetimi baskı yapsa bile 5 dakikalık duman testini atlamak, çift randevu ataması gibi gizli regresyonları canlıya taşır. Kritik yol testini koşmak saatlerce sürecek yeni çöküşleri engeller."}
            {stage.id === 3 && "⚠️ Sağlık verileri KVKK kapsamında 'özel nitelikli kişisel veri'dir. Hata ayıklarken teknik ekiplerin sadece stack trace ve hata kodlarına ihtiyacı vardır; hasta T.C. kimlikleri asla sansürsüzce paylaşılamaz."}
          </p>

          <button
            type="button"
            data-cy="proactive-ask-tutor-btn"
            onClick={onOpenTutor}
            className="text-[11px] font-semibold text-purple-300 hover:text-white flex items-center gap-1 underline underline-offset-2 pt-0.5"
          >
            <span>Dr. Gemini ile bu ödünleşimi derinlemesine tartış &rarr;</span>
          </button>
        </div>
      )}

      {/* Beginner Hint Box (Displayed only for Beginners when active) */}
      {isBeginner && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 block">Başlangıç Seviyesi İpucu:</span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              {stage.beginnerHint}
            </p>
          </div>
        </div>
      )}

      {/* Decision Cards A and B */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Kararını Ver:</span>
          <span>Aşama {stage.id} / 3</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <DecisionCard
            option={stage.options.A}
            onSelect={handleCardClick}
          />
          <DecisionCard
            option={stage.options.B}
            onSelect={handleCardClick}
          />
        </div>
      </div>

      {/* AI Tutor Callout Bar */}
      <button
        type="button"
        onClick={onOpenTutor}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/30 flex items-center justify-between gap-3 text-left transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sokratik AI Eğitmene Danış</h4>
            <p className="text-[11px] text-purple-300">Cevabı söylemez, teknik sorularla yol gösterir.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-purple-400 shrink-0">Sor &rarr;</span>
      </button>
    </div>
  );
};
