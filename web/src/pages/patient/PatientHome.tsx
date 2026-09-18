import React, { useState, useEffect } from 'react';
import { Play, Mic, Heart, Droplets, Pill, Calendar, Smile, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { TRANSLATIONS } from '../../data/translations';
import { api } from '../../services/api';

interface PatientHomeProps {
  onStartGame: () => void;
  onOpenVoice: () => void;
  onNavigateTab: (tab: any) => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({ onStartGame, onOpenVoice, onNavigateTab }) => {
  const { user, language, difficulty } = useAuth();
  const { addOfflineEvent } = useOfflineSync();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<{ title: string; domain: string; difficulty: string; reason: string } | null>(null);
  const [medicineDone, setMedicineDone] = useState<boolean>(true);
  const [hydrationDone, setHydrationDone] = useState<boolean>(false);

  useEffect(() => {
    api.getRecommendation(user.id).then((rec) => {
      if (rec) setRecommendation(rec);
    }).catch(console.error);
  }, [user.id]);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😟', label: 'Worried' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '🥱', label: 'Tired' },
  ];

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    setMoodSaved(true);
    addOfflineEvent('mood', { mood: label, timestamp: new Date().toISOString() });
    setTimeout(() => setMoodSaved(false), 3000);
  };

  const toggleMedicine = () => {
    const next = !medicineDone;
    setMedicineDone(next);
    addOfflineEvent('reminder', { title: 'Blood Pressure Tablet', completed: next });
  };

  const toggleHydration = () => {
    const next = !hydrationDone;
    setHydrationDone(next);
    addOfflineEvent('reminder', { title: '1 Glass Fresh Water', completed: next });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* Warm Header Greeting */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-teal-200 text-sm font-semibold tracking-wide uppercase mb-1">
            {new Date().toLocaleDateString(language === 'as' ? 'as-IN' : 'en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="text-elderly-xl font-extrabold flex items-center space-x-2">
            <span>{t.welcome}, {user.fullName.split(' ')[0]}</span>
            <span className="text-rose-400">❤️</span>
          </h1>
          <p className="text-teal-100 text-base mt-1 font-medium">
            Let's have a wonderful and active day together!
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-1.5 bg-teal-900/60 px-3.5 py-1.5 rounded-full border border-teal-500/40 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Target Level: <strong className="text-amber-300">{difficulty}</strong></span>
            </div>
            {recommendation && (
              <div className="inline-flex items-center space-x-1 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40 text-xs font-bold text-emerald-200">
                <span>🎯 {recommendation.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={onStartGame}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-elderly-lg py-5 rounded-3xl shadow-xl flex items-center justify-center space-x-3 transition-all transform active:scale-98 ring-4 ring-emerald-200 large-touch-target animate-pulse-subtle"
      >
        <Play className="w-8 h-8 fill-current" />
        <div className="text-center">
          <div>{t.start_today_activity}</div>
          {recommendation && (
            <div className="text-xs font-semibold text-emerald-100 opacity-90">{recommendation.title} ({recommendation.domain})</div>
          )}
        </div>
      </button>

      {/* Prominent Voice Assistant Button */}
      <button
        onClick={onOpenVoice}
        className="w-full bg-white hover:bg-teal-50 border-4 border-teal-500 text-teal-900 font-extrabold text-lg py-4 px-6 rounded-3xl shadow-md flex items-center justify-between transition-all large-touch-target"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow">
            <Mic className="w-7 h-7" />
          </div>
          <div className="text-left">
            <div className="font-extrabold text-elderly-base">Voice Assistant</div>
            <div className="text-xs text-slate-500">Tap to speak requests in native language</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-teal-600" />
      </button>

      {/* Today's Schedule Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next Medicine */}
        <div 
          onClick={toggleMedicine}
          className={`border-2 rounded-3xl p-4 shadow-md flex flex-col justify-between cursor-pointer transition-all ${
            medicineDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-rose-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 mb-2 font-bold text-sm">
            <div className="flex items-center space-x-1.5">
              <Pill className="w-5 h-5" />
              <span>{t.next_medicine}</span>
            </div>
            {medicineDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className="text-lg font-extrabold text-slate-900">08:00 AM</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">
            {medicineDone ? 'Blood Pressure (Done ✓)' : 'Blood Pressure Tablet'}
          </div>
        </div>

        {/* Hydration Reminder */}
        <div 
          onClick={toggleHydration}
          className={`border-2 rounded-3xl p-4 shadow-md flex flex-col justify-between cursor-pointer transition-all ${
            hydrationDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-blue-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700 mb-2 font-bold text-sm">
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-5 h-5" />
              <span>{t.hydration_reminder}</span>
            </div>
            {hydrationDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className="text-lg font-extrabold text-slate-900">11:00 AM</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">
            {hydrationDone ? '1 Glass Water (Done ✓)' : '1 Glass Fresh Water'}
          </div>
        </div>
      </div>

      {/* Mood Check Section */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">{t.mood_check}</h3>
          {moodSaved && <span className="text-xs text-emerald-600 font-bold">Saved ✓</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => handleMoodSelect(m.label)}
              className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                selectedMood === m.label
                  ? 'bg-teal-700 border-teal-800 text-white shadow-md scale-105 font-bold'
                  : 'bg-slate-50 border-slate-200 hover:bg-teal-50 text-slate-800'
              }`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs font-bold mt-1">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
