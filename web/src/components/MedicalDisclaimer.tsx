import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { useAuth } from '../context/AuthContext';

export const MedicalDisclaimer: React.FC = () => {
  const { language } = useAuth();
  const text = TRANSLATIONS[language]?.medical_disclaimer || TRANSLATIONS.en.medical_disclaimer;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-center space-x-2 font-medium">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span className="text-center">{text}</span>
    </div>
  );
};
