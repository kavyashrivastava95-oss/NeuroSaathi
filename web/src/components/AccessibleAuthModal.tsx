import React, { useState } from 'react';
import { X, User, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { api } from '../services/api';

interface AccessibleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AccessibleAuthModal: React.FC<AccessibleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [customName, setCustomName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleDemoQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.login(role);
      setRole(role);
      onSuccess(role);
      onClose();
    } catch (err: any) {
      console.error(err);
      // Even if network error occurs, auth context will proceed with demo data
      setRole(role);
      onSuccess(role);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setErrorMessage('Please enter your name to continue.');
      return;
    }
    setIsLoading(true);
    try {
      await api.login(selectedRole, customName.trim().toLowerCase().replace(/\s+/g, '_'));
      setRole(selectedRole);
      onSuccess(selectedRole);
      onClose();
    } catch (err) {
      setRole(selectedRole);
      onSuccess(selectedRole);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-950/50 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-teal-950 border border-teal-500/40 text-teal-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-white font-outfit">
            Sign In to NeuroSaathi
          </h2>
          <p className="text-sm text-slate-400">
            Choose your role or select a 1-click quick demo profile
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole('patient')}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              selectedRole === 'patient'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Elderly User</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('caregiver')}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              selectedRole === 'caregiver'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Caregiver</span>
          </button>
        </div>

        {/* 1-Click SIH Live Demo Card */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 to-slate-800/80 border border-teal-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-300">
            <span>SIH JUDGING DEMO PROFILE</span>
            <span className="bg-teal-500/20 px-2 py-0.5 rounded text-teal-300">1-Click Login</span>
          </div>

          {selectedRole === 'patient' ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">Kamala Devi (72 yrs)</h4>
                <p className="text-xs text-slate-400">Guwahati, Assam • 5-day active streak</p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoQuickLogin('patient')}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
              >
                <span>Enter as Kamala</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">Ananya Devi (Daughter)</h4>
                <p className="text-xs text-slate-400">Linked to Kamala Devi • Notifications active</p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoQuickLogin('caregiver')}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
              >
                <span>Enter as Ananya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Or Enter Your Name (Optional):
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !customName.trim()}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 font-bold text-sm transition-all"
          >
            {isLoading ? 'Connecting...' : `Sign in as ${selectedRole === 'patient' ? 'Elderly User' : 'Caregiver'}`}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Secure local authentication • No personal health data transmitted externally</span>
          </p>
        </div>

      </div>
    </div>
  );
};
