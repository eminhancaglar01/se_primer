import React from 'react';
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Database, 
  FileText, 
  Info, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { Consequence } from '../types';

interface ConsequenceModalProps {
  consequence: Consequence | null;
  onProceed: () => void;
  isFinalStage: boolean;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  consequence,
  onProceed,
  isFinalStage,
}) => {
  if (!consequence) return null;

  const isCritical = consequence.metrics.riskScore === 'Yüksek' || 
                    consequence.metrics.riskScore === 'Kritik' || 
                    consequence.metrics.riskScore === 'Yıkıcı Ceza';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {isCritical ? <AlertTriangle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Teknik Karar Sonucu</span>
              <h2 className="text-base font-extrabold text-white">{consequence.title}</h2>
            </div>
          </div>
        </div>

        {/* Short Summary */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 font-medium leading-relaxed">
          {consequence.summary}
        </div>

        {/* Detailed Sections: Ne Oldu & Neden Oldu */}
        <div className="space-y-3 text-xs">
          {/* Ne Oldu? */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ne Oldu? (What Happened)</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-5">
              {consequence.whatHappened}
            </p>
          </div>

          {/* Neden Oldu? */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Neden Oldu? (Why It Happened)</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-5">
              {consequence.whyItHappened}
            </p>
          </div>

          {/* Teknik Detay & Veritabanı Telemetrisi */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-sans font-bold text-slate-300">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Sistem Telemetrisi & Kayıtlar:</span>
            </div>
            <p className="text-slate-400 pl-5">
              {consequence.technicalDetails}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[10px] text-slate-400 block">Sistem Durumu</span>
            <span className={`text-xs font-bold ${
              consequence.metrics.systemStatus === 'Kurtarıldı' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {consequence.metrics.systemStatus}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[10px] text-slate-400 block">Bekleyen Hasta</span>
            <span className="text-xs font-bold text-slate-200">
              {consequence.metrics.activePatients}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[10px] text-slate-400 block">Ek Kesinti</span>
            <span className="text-xs font-bold text-slate-200">
              {consequence.metrics.downtime}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-[10px] text-slate-400 block">Risk Seviyesi</span>
            <span className={`text-xs font-bold ${
              isCritical ? 'text-rose-400' : 'text-blue-400'
            }`}>
              {consequence.metrics.riskScore}
            </span>
          </div>
        </div>

        {/* Next Stage Button */}
        <button
          type="button"
          data-testid="next-stage-btn"
          onClick={onProceed}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <span>{isFinalStage ? 'Sonuç Raporunu Gör' : 'Sıradaki Kriz Aşamasına Geç'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
