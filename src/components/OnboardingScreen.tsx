import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  HelpCircle, 
  Layers, 
  Shield, 
  Sparkles, 
  Terminal, 
  User, 
  Zap 
} from 'lucide-react';
import { EngineeringRole, ExperienceLevel, LearningObjective, UserProfile } from '../types';
import { ONBOARDING_CONFIG } from '../data/scenarioData';

interface OnboardingScreenProps {
  onStartSimulation: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStartSimulation }) => {
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');
  const [role, setRole] = useState<EngineeringRole>('backend');
  const [goal, setGoal] = useState<LearningObjective>('architecture');

  const handleStart = () => {
    onStartSimulation({ experience, role, goal });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Sağlık Sistemi Kriz Simülasyonu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          08:00 — Randevu Sistemi Çöktü.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Nöbetçi Sensin.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
          Dün gece yapılan dağıtım sonrası 300 hasta sırada bekliyor. Kararlarının teknik ve hukuki sonuçlarını Sokratik AI Eğitmen eşliğinde deneyimle.
        </p>
      </div>

      {/* Soru 1: Deneyim Seviyesi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Deneyim Seviyen</span>
          </label>
          <span className="text-[11px] text-blue-400 font-medium">Zorluk & İpucu Seviyesi</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {ONBOARDING_CONFIG.experienceOptions.map((item) => {
            const isSelected = experience === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`experience-${item.id}`}
                onClick={() => setExperience(item.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{item.label}</span>
                    {item.id === 'experienced' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-2.5 h-2.5" /> 60s Sayaç
                      </span>
                    )}
                    {item.id === 'beginner' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Bol İpucu
                      </span>
                    )}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 2: Mühendislik Rolü */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
            <span>Mühendislik Rolün</span>
          </label>
          <span className="text-[11px] text-indigo-400 font-medium">Senaryo Bakış Açısı</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ONBOARDING_CONFIG.roles.map((item) => {
            const isSelected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`role-${item.id}`}
                onClick={() => setRole(item.id)}
                className={`p-3 rounded-xl text-left border transition-all text-xs font-medium flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Soru 3: Öğrenme Hedefi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">3</span>
            <span>Öğrenme Hedefin</span>
          </label>
          <span className="text-[11px] text-purple-400 font-medium">Sokratik Odak</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ONBOARDING_CONFIG.objectives.map((item) => {
            const isSelected = goal === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`goal-${item.id}`}
                onClick={() => setGoal(item.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-white">{item.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçim Özeti ve Kişiselleştirme Rozeti */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-800/80 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Simülasyon Kişiselleştirildi:</p>
          <p className="text-[11px] text-slate-400 leading-tight">
            {experience === 'beginner' && 'Sadeleştirilmiş Türkçe açıklamalar ve her kararda rehber ipucu aktif.'}
            {experience === 'intermediate' && 'Mimari ve operasyonel ödünleşimler (trade-offs) ön planda tutulacak.'}
            {experience === 'experienced' && '⚠️ Her karar için 60 saniyelik geri sayım sayacı uygulanacak.'}
          </p>
        </div>
      </div>

      {/* Başlat Butonu */}
      <button
        type="button"
        data-testid="start-simulation-btn"
        onClick={handleStart}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
      >
        <span>Kriz Simülasyonunu Başlat</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Güvenlik ve Gizlilik Alt Notu */}
      <div className="text-center text-[11px] text-slate-500 pt-1">
        🔒 Bu simülasyonda gerçek hasta veya hastane verisi kullanılmamaktadır.
      </div>
    </div>
  );
};
