import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SupportedLanguage } from '../data/translations';

export type UserRole = 'patient' | 'caregiver' | 'healthcare' | 'admin';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  language: SupportedLanguage;
  region: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  region: string;
  setRegion: (region: string) => void;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setDifficulty: (diff: 'Easy' | 'Medium' | 'Hard') => void;
  isTabletView: boolean;
  setIsTabletView: (val: boolean) => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  patient: {
    id: 1,
    email: 'kamala@neurosaathi.in',
    fullName: 'Kamala Devi',
    role: 'patient',
    language: 'en',
    region: 'Assam',
    difficulty: 'Easy'
  },
  caregiver: {
    id: 2,
    email: 'ananya@neurosaathi.in',
    fullName: 'Ananya Devi',
    role: 'caregiver',
    language: 'en',
    region: 'Assam',
    difficulty: 'Easy'
  },
  healthcare: {
    id: 3,
    email: 'doctor@neurosaathi.in',
    fullName: 'Dr. Barua',
    role: 'healthcare',
    language: 'en',
    region: 'Assam',
    difficulty: 'Easy'
  },
  admin: {
    id: 4,
    email: 'admin@neurosaathi.in',
    fullName: 'System Admin',
    role: 'admin',
    language: 'en',
    region: 'Assam',
    difficulty: 'Easy'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('patient');
  const [user, setUser] = useState<UserProfile>(DEMO_USERS.patient);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [region, setRegion] = useState<string>('Assam');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isTabletView, setIsTabletView] = useState<boolean>(true);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser(DEMO_USERS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        setRole,
        language,
        setLanguage,
        region,
        setRegion,
        difficulty,
        setDifficulty,
        isTabletView,
        setIsTabletView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
