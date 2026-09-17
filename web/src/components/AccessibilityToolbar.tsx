import React, { useState, useEffect } from 'react';
import { Type, Eye, Volume2, VolumeX, Languages, Settings, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../data/translations';

export const AccessibilityToolbar: React.FC = () => {
  const { language, setLanguage } = useAuth();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Apply font size scaling to root document element
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'normal') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '19px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '22px';
    }
  }, [fontSize]);

  // Apply high contrast class
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const speakNotice = (text: string) => {
    if (voiceAudioEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Toggle Pill Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            speakNotice("Accessibility settings opened");
          }}
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-2xl shadow-teal-900/40 border-2 border-teal-300 ring-4 ring-teal-600/20 active:scale-95 transition-all"
          aria-label="Open accessibility controls"
        >
          <Settings className="w-5 h-5 animate-spin-slow" />
          <span className="text-sm">Accessibility</span>
        </button>
      )}

      {/* Expanded Accessibility Menu Panel */}
      {isOpen && (
        <div className="w-80 bg-slate-900 border-2 border-teal-500/50 rounded-3xl p-5 shadow-2xl shadow-slate-950/80 text-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-sm">
              <Settings className="w-4 h-4" />
              <span>Accessibility Panel</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* 1. Font Size Scaling */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Type className="w-3.5 h-3.5 text-teal-400" />
              <span>Text Size</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'normal', label: 'A (100%)' },
                { id: 'large', label: 'A+ (125%)' },
                { id: 'xlarge', label: 'A++ (150%)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setFontSize(item.id as any);
                    speakNotice(`Text size set to ${item.id}`);
                  }}
                  className={`py-2 px-1 text-xs rounded-xl font-bold transition-all ${
                    fontSize === item.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. High Contrast Mode Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Visual Contrast</span>
            </div>
            <button
              onClick={() => {
                const next = !highContrast;
                setHighContrast(next);
                speakNotice(next ? "High contrast mode enabled" : "Normal contrast restored");
              }}
              className={`w-full py-2 px-3 text-xs rounded-xl font-bold flex items-center justify-between transition-all ${
                highContrast
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{highContrast ? 'High Contrast Active' : 'Enable High Contrast'}</span>
              {highContrast && <Check className="w-4 h-4" />}
            </button>
          </div>

          {/* 3. Audio Voice Assistance Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              {voiceAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-teal-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>Voice Guidance (Audio)</span>
            </div>
            <button
              onClick={() => {
                const next = !voiceAudioEnabled;
                setVoiceAudioEnabled(next);
                if (next) speakNotice("Voice guidance enabled");
              }}
              className={`w-full py-2 px-3 text-xs rounded-xl font-bold flex items-center justify-between transition-all ${
                voiceAudioEnabled
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>{voiceAudioEnabled ? 'Voice Guidance Active' : 'Audio Muted'}</span>
              {voiceAudioEnabled && <Check className="w-4 h-4" />}
            </button>
          </div>

          {/* 4. Language Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>Language (भाषा / ভাষা)</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' },
                { id: 'as', label: 'অসমীয়া' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id as SupportedLanguage);
                    speakNotice(`Language set to ${lang.label}`);
                  }}
                  className={`py-2 px-1 text-xs rounded-xl font-bold transition-all ${
                    language === lang.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
