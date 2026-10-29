import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { DecisionChoice, DecisionOption } from '../types';

interface DecisionCardProps {
  option: DecisionOption;
  onSelect: (choice: DecisionChoice) => void;
  disabled?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  option,
  onSelect,
  disabled = false,
}) => {
  const isOptionA = option.id === 'A';
  const testId = isOptionA ? 'decision-option-a' : 'decision-option-b';

  const riskBadgeColor = {
    'Düşük': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Orta': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Yüksek': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Kritik': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  }[option.riskLevel] || 'bg-slate-700 text-slate-300';

  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        isOptionA
          ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 shadow-md'
          : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900 shadow-md'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'}`}
    >
      {/* Top Bar with Badge and Option letter */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              isOptionA
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
            }`}
          >
            {option.id}
          </div>
          <span className="text-[11px] font-semibold text-slate-400">{option.badge}</span>
        </div>

        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskBadgeColor}`}>
          Risk: {option.riskLevel}
        </span>
      </div>

      {/* Title & Short Description */}
      <div className="space-y-1 mb-3">
        <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
          {option.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {option.shortDesc}
        </p>
      </div>

      {/* Action CTA indicator */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
        <span>{option.actionLabel}</span>
        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
