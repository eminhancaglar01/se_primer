import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isMobileMode, setIsMobileMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Viewport Mode Switcher for Desktop Browsers */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-300">SE Primer — Mobil Öncelikli Kriz Simülasyonu</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsMobileMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              isMobileMode
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobil Çerçeve (390px)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              !isMobileMode
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Geniş Görünüm</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-start justify-center md:py-6">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileMode
              ? 'max-w-[440px] md:rounded-[36px] md:border md:border-slate-800 md:shadow-2xl md:shadow-blue-950/30 md:bg-[#080d1a] md:overflow-hidden md:min-h-[820px]'
              : 'max-w-2xl'
          }`}
        >
          {children}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-3 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/50">
        <p>SE Primer © 2026 • Yazılım Mühendisliği Kriz Simülasyonu • Sokratik AI Eğitmen Destekli</p>
      </footer>
    </div>
  );
};
