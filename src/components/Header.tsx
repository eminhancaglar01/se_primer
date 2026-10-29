import React from 'react';
import { Activity, AlertTriangle, Brain, Clock, ShieldCheck, Users } from 'lucide-react';
import { DecisionStageId, UserProfile } from '../types';

interface HeaderProps {
  isSimulating: boolean;
  currentStageId: DecisionStageId;
  profile: UserProfile | null;
  onOpenTutor: () => void;
  timeRemaining?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isSimulating,
  currentStageId,
  profile,
  onOpenTutor,
  timeRemaining,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Logo and Project Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">SE PRIMER</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Sağlık Randevu Sistemi</p>
          </div>
        </div>

        {/* Right side: Simulation Context Actions */}
        {isSimulating ? (
          <div className="flex items-center gap-2">
            {/* Stage Pill */}
            <div className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
              Aşama <span className="text-blue-400">{currentStageId}</span>/3
            </div>

            {/* Experienced Timer Indicator if active */}
            {profile?.experience === 'experienced' && typeof timeRemaining === 'number' && (
              <div 
                data-testid="countdown-timer"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  timeRemaining <= 15
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-timer-alert'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}</span>
              </div>
            )}

            {/* AI Tutor Button */}
            <button
              data-testid="open-tutor-btn"
              onClick={onOpenTutor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all transform active:scale-95"
              aria-label="Sokratik AI Eğitmeni Aç"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>AI Eğitmen</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kriz Simülasyonu</span>
          </div>
        )}
      </div>

      {/* Emergency Status Sub-bar when simulating */}
      {isSimulating && (
        <div className="max-w-md mx-auto mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block"></span>
            <span>08:00 Kesintisi</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Users className="w-3 h-3 text-amber-400" />
            <span>300 Hasta Sırada</span>
          </div>
          <div className="text-slate-400">
            Rol: <span className="text-blue-300 capitalize">{profile?.role || 'Engineer'}</span>
          </div>
        </div>
      )}
    </header>
  );
};
