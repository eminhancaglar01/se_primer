import React from 'react';
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  RotateCcw, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { DecisionChoice, EndingData, UserProfile } from '../types';

interface EndingScreenProps {
  ending: EndingData;
  profile: UserProfile | null;
  decisions: {
    1?: DecisionChoice;
    2?: DecisionChoice;
    3?: DecisionChoice;
  };
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  ending,
  profile,
  decisions,
  onRestart,
}) => {
  const isGood = ending.type === 'good';

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Outcome Badge */}
      <div className={`p-5 rounded-3xl border transition-all text-center space-y-3 ${
        isGood
          ? 'bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 border-emerald-500/40 shadow-xl shadow-emerald-500/10'
          : 'bg-gradient-to-b from-rose-950/50 via-slate-900 to-slate-950 border-rose-500/40 shadow-xl shadow-rose-500/10'
      }`}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mx-auto shadow-md">
          {isGood ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div 
            data-testid="ending-status-badge"
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isGood
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {ending.badge}
          </div>
          <h1 className="text-xl font-black text-white tracking-tight leading-snug">
            {ending.title}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            {ending.subtitle}
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto pt-1">
          {ending.summary}
        </p>

        {/* User Choice Footprint */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>Kararların:</span>
          <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            D1: {decisions[1]} | D2: {decisions[2]} | D3: {decisions[3]}
          </span>
          <span className="text-slate-500">•</span>
          <span className="capitalize text-blue-400">{profile?.experience}</span>
        </div>
      </div>

      {/* Incident Resolution Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">İşlenen Hasta</span>
            <span className="text-xs font-extrabold text-white">{ending.metrics.resolvedPatients} / 300</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Toplam Kesinti</span>
            <span className="text-xs font-extrabold text-white">{ending.metrics.totalDowntime}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">KVKK Uyumu</span>
            <span className={`text-xs font-extrabold ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {ending.metrics.complianceScore}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Kriz Kalitesi</span>
            <span className={`text-xs font-extrabold ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {ending.metrics.recoveryQuality}
            </span>
          </div>
        </div>
      </div>

      {/* 08:00 - 08:25 Incident Timeline */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Kriz Operasyon Zaman Çizelgesi (08:00 — 08:25)</span>
        </div>

        <div className="space-y-3 pl-2 border-l border-slate-800 relative ml-2">
          {ending.timeline.map((item, idx) => (
            <div key={idx} className="relative pl-4 space-y-0.5">
              <div className={`absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                item.status === 'success'
                  ? 'bg-emerald-500 border-slate-900 ring-2 ring-emerald-500/30'
                  : item.status === 'warning'
                  ? 'bg-amber-500 border-slate-900 ring-2 ring-amber-500/30'
                  : 'bg-rose-500 border-slate-900 ring-2 ring-rose-500/30'
              }`} />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-blue-400">{item.time}</span>
                <span className="text-xs text-slate-200">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Post-Mortem */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <FileCheck className="w-4 h-4 text-purple-400" />
          <span>Olay Yeri İncelemesi (Post-Mortem Analizi)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {ending.rootCauseAnalysis}
        </p>
      </div>

      {/* KVKK Status Box */}
      <div className={`p-4 rounded-2xl border ${
        isGood 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold mb-1">
          <Scale className="w-4 h-4" />
          <span>KVKK ve Hukuki Uyumluluk Durumu</span>
        </div>
        <p className="text-xs opacity-90 leading-relaxed">
          {ending.kvkkStatus}
        </p>
      </div>

      {/* Engineering Lessons Learned */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Kazanılan Mühendislik Dersleri</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {ending.engineeringLessons.map((lesson, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Restart Simulation Button */}
      <button
        type="button"
        data-testid="restart-simulation-btn"
        onClick={onRestart}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Simülasyonu Farklı Kararlarla Baştan Başlat</span>
      </button>
    </div>
  );
};
