import React, { useState } from 'react';
import { 
  Bot, 
  Brain, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  User, 
  WifiOff, 
  X 
} from 'lucide-react';
import { ChatMessage, DecisionStageId, UserProfile } from '../types';
import { askSocraticTutor } from '../tutor/geminiTutor';

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStageId: DecisionStageId;
  profile: UserProfile | null;
}

export const TutorDrawer: React.FC<TutorDrawerProps> = ({
  isOpen,
  onClose,
  currentStageId,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Merhaba! Ben Dr. Gemini. Sağlık sistemi krizinde Sokratik eğitmenin olarak buradayım. Sana doğrudan "şunu seç" demeyeceğim; doğru karara ulaşman için doğru mühendislik sorularını soracağım. Bu aşamada kafana takılan nedir?`,
      timestamp: '08:02',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickChips = [
    'Hangisini seçmeliyim, doğru cevap ne?',
    currentStageId === 1
      ? 'Rollback yaparsam veritabanı ne olur?'
      : currentStageId === 2
      ? '5 dakikalık duman testi gecikmeye değer mi?'
      : 'Hata ayıklamak için hasta kimliklerine gerek var mı?',
    currentStageId === 1
      ? 'Canlıda hotfix uygulamanın riskleri neler?'
      : currentStageId === 2
      ? 'Testleri atlayıp hemen dağıtmak ne yaratır?'
      : 'Ham logları genel kanala atarsam KVKK ne der?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askSocraticTutor(text, currentStageId, profile);
      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        isFallback: response.isFallback,
      };
      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `tutor-err-${Date.now()}`,
        sender: 'tutor',
        text: 'Bir bağlantı hatası oluştu. Ancak kriz anında şunu unutma: Hangi seçeneğin veri bütünlüğünü ve hasta güvenliğini daha az riske atacağını düşün.',
        timestamp: '08:02',
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[85vh] sm:h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Sokratik AI Eğitmen</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Dr. Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Doğrudan cevap yok • Düşünmeye yönlendirir</p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-tutor-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-4 py-2 bg-purple-950/30 border-b border-purple-900/30 text-[11px] text-purple-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Sokratik metod: Seçenek söylemez, doğru soruları sordurur.</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p 
                    data-testid={!isUser ? 'tutor-response-message' : undefined}
                    className="whitespace-pre-line"
                  >
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-white/10 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.isFallback && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <WifiOff className="w-2.5 h-2.5" /> Çevrimdışı Sokratik Motor
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Dr. Gemini düşünüyor ve yönlendirici soru hazırlıyor...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] whitespace-nowrap transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            data-testid="tutor-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Dr. Gemini'ye bir mühendislik sorusu sor..."
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="button"
            data-testid="tutor-send-btn"
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSendMessage(inputText)}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
