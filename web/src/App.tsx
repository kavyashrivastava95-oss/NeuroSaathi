import React, { useState } from 'react';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { OfflineSyncProvider, useOfflineSync } from './context/OfflineSyncContext';
import { VoiceProvider } from './context/VoiceContext';

import { RoleDemoBar } from './components/RoleDemoBar';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { PatientNavigation, PatientTab } from './components/PatientNavigation';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AccessibleAuthModal } from './components/AccessibleAuthModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';

import { LandingPage } from './pages/LandingPage';
import { PatientHome } from './pages/patient/PatientHome';
import { BrainGym } from './pages/patient/BrainGym';
import { MyDay } from './pages/patient/MyDay';
import { MemoryCapsuleView } from './pages/patient/MemoryCapsuleView';
import { PatientProfile } from './pages/patient/PatientProfile';

import { CaregiverDashboard } from './pages/caregiver/CaregiverDashboard';
import { HealthcareDashboard } from './pages/healthcare/HealthcareDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const MainContainer: React.FC = () => {
  const { role, setRole, isTabletView } = useAuth();
  const { isOnline, isSyncing } = useOfflineSync();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [patientTab, setPatientTab] = useState<PatientTab>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const startElderlyDemo = () => {
    setRole('patient');
    setPatientTab('home');
    setCurrentView('app');
  };

  const startCaregiverDemo = () => {
    setRole('caregiver');
    setCurrentView('app');
  };

  const handleAuthSuccess = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'patient') {
      setPatientTab('home');
    }
    setCurrentView('app');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans selection:bg-teal-400 selection:text-slate-950">
      
      {/* If on Landing Page */}
      {currentView === 'landing' ? (
        <div className="w-full flex-1 flex flex-col">
          <LandingPage
            onStartElderlyDemo={startElderlyDemo}
            onStartCaregiverDemo={startCaregiverDemo}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        </div>
      ) : (
        /* App View: Dashboards & Games */
        <div className="w-full flex-1 flex flex-col">
          {/* 1. SIH Presenter Role Switcher & Connectivity Simulator */}
          <RoleDemoBar onGoToLanding={() => setCurrentView('landing')} />

          {/* 2. Medical Disclaimer Banner */}
          <MedicalDisclaimer />

          {/* Connectivity Status Banner */}
          {!isOnline && (
            <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center space-x-2 shadow-inner">
              <span>⚠️ OFFLINE MODE: Activities saved locally in device storage. Will sync when reconnected.</span>
            </div>
          )}

          {isSyncing && (
            <div className="bg-blue-600 text-white text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center space-x-2 animate-pulse">
              <span>🔄 SYNCING: Uploading local offline events to central database...</span>
            </div>
          )}

          {/* 3. Role Based View Routing */}
          <div className="flex-1 flex flex-col items-center justify-start overflow-x-hidden">
            {role === 'patient' && (
              <div className={`w-full transition-all duration-300 ${isTabletView ? 'py-4 md:py-8 px-2 max-w-2xl' : 'w-full'}`}>
                <div className={`bg-patient-bg rounded-3xl shadow-2xl flex flex-col min-h-[85vh] relative border-4 border-teal-600/30 overflow-hidden ${isTabletView ? 'ring-8 ring-slate-800' : 'rounded-none border-none'}`}>
                  
                  {/* Main Tab Content */}
                  <div className="flex-1 overflow-y-auto">
                    {patientTab === 'home' && (
                      <PatientHome
                        onStartGame={() => setPatientTab('brain')}
                        onOpenVoice={() => setIsVoiceModalOpen(true)}
                        onNavigateTab={(tab) => setPatientTab(tab)}
                      />
                    )}
                    {patientTab === 'brain' && <BrainGym />}
                    {patientTab === 'myday' && <MyDay />}
                    {patientTab === 'memory' && <MemoryCapsuleView />}
                    {patientTab === 'profile' && <PatientProfile />}
                  </div>

                  {/* Patient Navigation */}
                  <PatientNavigation activeTab={patientTab} setActiveTab={setPatientTab} />
                </div>
              </div>
            )}

            {role === 'caregiver' && (
              <div className="w-full">
                <CaregiverDashboard />
              </div>
            )}

            {role === 'healthcare' && (
              <div className="w-full">
                <HealthcareDashboard />
              </div>
            )}

            {role === 'admin' && (
              <div className="w-full">
                <AdminDashboard />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Accessibility Toolbar (Available across all screens) */}
      <AccessibilityToolbar />

      {/* Accessible Auth Modal */}
      <AccessibleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Voice Assistant Overlay Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateTab={(tab) => {
          setPatientTab(tab);
          setIsVoiceModalOpen(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <OfflineSyncProvider>
        <VoiceProvider>
          <MainContainer />
        </VoiceProvider>
      </OfflineSyncProvider>
    </AuthProvider>
  );
}
