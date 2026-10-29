import React, { useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface CountdownTimerProps {
  secondsRemaining: number;
  totalSeconds?: number;
  onTimeout: () => void;
  isActive: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  secondsRemaining,
  totalSeconds = 60,
  onTimeout,
  isActive,
}) => {
  useEffect(() => {
    if (isActive && secondsRemaining <= 0) {
      onTimeout();
    }
  }, [isActive, secondsRemaining, onTimeout]);

  const percentage = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));
  const isUrgent = secondsRemaining <= 15;

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
          <span className="font-semibold">Kıdemli Nöbetçi Süresi:</span>
        </div>
        <div 
          data-testid="countdown-timer-text"
          className={`font-mono text-sm font-bold ${
            isUrgent ? 'text-rose-400 animate-pulse' : 'text-amber-300'
          }`}
        >
          00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            isUrgent ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isUrgent && (
        <div className="flex items-center gap-1 mt-2 text-[11px] text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Süre tükeniyor! 0 olduğunda acil eylem otomatik tetiklenir.</span>
        </div>
      )}
    </div>
  );
};
