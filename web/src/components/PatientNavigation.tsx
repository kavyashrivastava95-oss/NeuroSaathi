import React from 'react';
import { Home, Brain, Calendar, Heart, User } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { useAuth } from '../context/AuthContext';

export type PatientTab = 'home' | 'brain' | 'myday' | 'memory' | 'profile';

interface PatientNavigationProps {
  activeTab: PatientTab;
  setActiveTab: (tab: PatientTab) => void;
}

export const PatientNavigation: React.FC<PatientNavigationProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems: { key: PatientTab; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: t.nav_home, icon: <Home className="w-8 h-8" /> },
    { key: 'brain', label: t.nav_brain, icon: <Brain className="w-8 h-8" /> },
    { key: 'myday', label: t.nav_my_day, icon: <Calendar className="w-8 h-8" /> },
    { key: 'memory', label: t.nav_memory, icon: <Heart className="w-8 h-8" /> },
    { key: 'profile', label: t.nav_profile, icon: <User className="w-8 h-8" /> },
  ];

  return (
    <div className="bg-white border-t-2 border-teal-200 px-3 py-2 flex items-center justify-around shadow-lg sticky bottom-0 z-40">
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all large-touch-target flex-1 max-w-[100px] ${
              isActive
                ? 'bg-teal-700 text-white font-bold scale-105 shadow-md ring-4 ring-teal-200'
                : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900 font-semibold'
            }`}
          >
            <div className={isActive ? 'text-white' : 'text-teal-800'}>{item.icon}</div>
            <span className="text-xs md:text-sm mt-1 tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
