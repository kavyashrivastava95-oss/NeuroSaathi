import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OfflineEvent {
  eventId: string;
  deviceId: string;
  patientId: number;
  eventType: 'session' | 'reminder' | 'mood' | 'memory';
  payload: any;
  createdAt: string;
  syncStatus: 'pending' | 'synced';
}

interface OfflineSyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  offlineQueue: OfflineEvent[];
  toggleNetwork: () => void;
  addOfflineEvent: (type: OfflineEvent['eventType'], payload: any) => void;
  syncNow: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineEvent[]>([]);

  // Load stored queue on startup
  useEffect(() => {
    const saved = localStorage.getItem('neurosaathi_offline_queue');
    if (saved) {
      try {
        setOfflineQueue(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse offline queue:', e);
      }
    }
  }, []);

  const saveQueue = (queue: OfflineEvent[]) => {
    setOfflineQueue(queue);
    localStorage.setItem('neurosaathi_offline_queue', JSON.stringify(queue));
  };

  const toggleNetwork = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState && offlineQueue.length > 0) {
      // Auto flush queue when reconnecting
      syncNow();
    }
  };

  const addOfflineEvent = (type: OfflineEvent['eventType'], payload: any) => {
    const newEvent: OfflineEvent = {
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      deviceId: 'device_elderly_tablet_01',
      patientId: 1,
      eventType: type,
      payload,
      createdAt: new Date().toISOString(),
      syncStatus: isOnline ? 'synced' : 'pending'
    };

    if (!isOnline) {
      const updated = [newEvent, ...offlineQueue];
      saveQueue(updated);
    }
  };

  const syncNow = async () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);
    // Simulate network delay for SIH demo visualization
    await new Promise((resolve) => setTimeout(resolve, 1800));
    saveQueue([]);
    setIsSyncing(false);
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        offlineQueue,
        toggleNetwork,
        addOfflineEvent,
        syncNow
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};
