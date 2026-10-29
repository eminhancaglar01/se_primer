import React from 'react';
import { 
  AlertTriangle, 
  Brain, 
  Clock, 
  HelpCircle, 
  Lightbulb, 
  Server, 
  Sparkles, 
  Users, 
  Zap 
} from 'lucide-react';
import { DecisionChoice, DecisionStage, UserProfile } from '../types';
import { DecisionCard } from './DecisionCard';
import { CountdownTimer } from './CountdownTimer';

interface IncidentScreenProps {
  stage: DecisionStage;
  profile: UserProfile | null;
  onSelectOption: (choice: DecisionChoice) => void;
  onOpenTutor: () => void;
  timeRemaining?: number;
  onTimeout?: () => void;
}

export const IncidentScreen: React.FC<IncidentScreenProps> = ({
  stage,
  profile,
  onSelectOption,
  onOpenTutor,
  timeRemaining = 60,
  onTimeout = () => {},
}) => {
  const isBeginner = profile?.experience === 'beginner';
  const isExperienced = profile?.experience === 'experienced';
  const role = profile?.role || 'software';
  const roleAdvice = stage.roleContext[role] || stage.roleContext.software;

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

      {/* Beginner Hint Box (Displayed only for Beginners) */}
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
            onSelect={onSelectOption}
          />
          <DecisionCard
            option={stage.options.B}
            onSelect={onSelectOption}
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
