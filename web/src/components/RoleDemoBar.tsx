import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useOfflineSync } from '../context/OfflineSyncContext';
import { Wifi, WifiOff, RefreshCw, Globe, MapPin, Smartphone, Monitor } from 'lucide-react';
import { SupportedLanguage } from '../data/translations';

interface RoleDemoBarProps {
  onGoToLanding?: () => void;
}

export const RoleDemoBar: React.FC<RoleDemoBarProps> = ({ onGoToLanding }) => {
  const { role, setRole, language, setLanguage, region, setRegion, isTabletView, setIsTabletView } = useAuth();
  const { isOnline, isSyncing, offlineQueue, toggleNetwork, syncNow } = useOfflineSync();

  const roles: { key: UserRole; label: string; bg: string }[] = [
    { key: 'patient', label: '👴 Patient', bg: 'bg-emerald-600' },
    { key: 'caregiver', label: '👩‍👧 Caregiver', bg: 'bg-teal-700' },
    { key: 'healthcare', label: '🩺 Healthcare Worker', bg: 'bg-blue-700' },
    { key: 'admin', label: '🛡️ Admin', bg: 'bg-purple-700' },
  ];

  const states = ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'];

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs md:text-sm flex flex-wrap items-center justify-between gap-3 shadow-md sticky top-0 z-50">
      {/* Role Switcher */}
      <div className="flex items-center space-x-2 flex-wrap">
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="px-2.5 py-1 rounded-md bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1 mr-1 transition-all"
            title="Return to public landing page"
          >
            <span>🏠 Landing</span>
          </button>
        )}
        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] md:text-xs">DEMO ROLE:</span>
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 space-x-1">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                role === r.key
                  ? `${r.bg} text-white shadow-sm font-semibold`
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connectivity Simulator & Language/Region Selector */}
      <div className="flex items-center space-x-3 flex-wrap">
        {/* Network Toggle Button */}
        <button
          onClick={toggleNetwork}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-semibold transition-all border ${
            isSyncing
              ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
              : isOnline
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
              : 'bg-amber-950 text-amber-300 border-amber-500 hover:bg-amber-900'
          }`}
          title="Click to toggle Internet connectivity for SIH offline demonstration"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>SYNCING ({offlineQueue.length})</span>
            </>
          ) : isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE ({offlineQueue.length} queued)</span>
            </>
          )}
        </button>

        {/* Manual Sync Trigger if pending */}
        {!isOnline && offlineQueue.length > 0 && (
          <button
            onClick={syncNow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync</span>
          </button>
        )}

        {/* Language Selector */}
        <div className="flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="as" className="bg-slate-900 text-white">অসমীয়া (Assamese)</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
            <option value="en" className="bg-slate-900 text-white">English</option>
          </select>
        </div>

        {/* NER Regional Content Selector */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {states.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
            ))}
          </select>
        </div>

        {/* Device Mode Toggle (only relevant for Patient role) */}
        {role === 'patient' && (
          <button
            onClick={() => setIsTabletView(!isTabletView)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-700 text-xs flex items-center space-x-1"
            title="Toggle between tablet preview frame and full screen view"
          >
            {isTabletView ? <Monitor className="w-3.5 h-3.5 text-teal-400" /> : <Smartphone className="w-3.5 h-3.5 text-teal-400" />}
            <span className="hidden md:inline">{isTabletView ? 'Tablet Mode' : 'Full Screen'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
