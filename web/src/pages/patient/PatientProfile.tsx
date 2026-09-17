import React, { useState } from 'react';
import { User, ShieldAlert, Sliders, Volume2, Eye, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';

export const PatientProfile: React.FC = () => {
  const { user, language, difficulty, setDifficulty } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);

  // Non-diagnostic performance profile as required by prompt
  const profileMetrics = [
    { label: 'Memory Activity', pct: 78, color: 'bg-emerald-500' },
    { label: 'Attention Focus', pct: 64, color: 'bg-teal-500' },
    { label: 'Object Recognition', pct: 81, color: 'bg-blue-500' },
    { label: 'Routine Recall', pct: 72, color: 'bg-indigo-500' },
    { label: 'Pattern Completion', pct: 78, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* User Header */}
      <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 shadow-md flex items-center space-x-4">
        <div className="w-20 h-20 bg-teal-700 text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner">
          {user.fullName[0]}
        </div>
        <div>
          <h1 className="text-elderly-lg font-extrabold text-slate-900">{user.fullName}</h1>
          <p className="text-slate-600 text-sm font-medium">Age 72 • Language: {user.language === 'as' ? 'Assamese' : 'English'}</p>
          <div className="mt-2 inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Activity Trend: Steady & Active</span>
          </div>
        </div>
      </div>

      {/* Non-Diagnostic Cognitive Activity Profile */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-teal-600" />
            <span>Cognitive Activity Profile</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">(Non-Clinical Activity)</span>
        </div>

        <div className="space-y-3.5">
          {profileMetrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-sm font-extrabold text-slate-800">
                <span>{m.label}</span>
                <span>{m.pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className={`${m.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${m.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>Note: Scores reflect daily game participation and engagement. They do not constitute medical or clinical diagnoses.</span>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-teal-600" />
          <span>Accessibility & Comfort</span>
        </h3>

        <div className="space-y-3">
          {/* AI Difficulty Selector */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <span className="font-bold text-slate-800 text-sm">AI Adaptive Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="bg-white border border-slate-300 font-bold text-teal-900 text-sm rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Voice Guidance Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-800 text-sm">Voice Announcements</span>
            </div>
            <input
              type="checkbox"
              checked={voiceGuidance}
              onChange={(e) => setVoiceGuidance(e.target.checked)}
              className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
