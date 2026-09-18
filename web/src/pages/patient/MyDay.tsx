import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Pill, Droplets, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useOfflineSync } from '../../context/OfflineSyncContext';

interface RoutineItem {
  id: number;
  time: string;
  title: string;
  category: string;
  icon: string;
  isCompleted: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  medication: '💊',
  hydration: '💧',
  activity: '🧠',
  meal: '🥣',
  routine: '🌅',
  walk: '🚶‍♂️',
  sleep: '🛌'
};

export const MyDay: React.FC = () => {
  const { addOfflineEvent } = useOfflineSync();
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: 1, time: '08:00 AM', title: 'Morning Blood Pressure Check', category: 'medication', icon: '💊', isCompleted: true },
    { id: 2, time: '09:00 AM', title: 'Morning Hydration & Green Tea', category: 'hydration', icon: '💧', isCompleted: true },
    { id: 3, time: '10:30 AM', title: 'Daily Cognitive Activity: Memory Match', category: 'activity', icon: '🧠', isCompleted: true },
    { id: 4, time: '01:30 PM', title: 'Post-Lunch Heart Medication', category: 'medication', icon: '💊', isCompleted: false },
    { id: 5, time: '05:00 PM', title: 'Evening Garden Walk & Social Chat', category: 'activity', icon: '🚶‍♂️', isCompleted: false },
    { id: 6, time: '09:00 PM', title: 'Night Calcium Supplement', category: 'medication', icon: '💊', isCompleted: false },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadRoutines = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCaregiverDashboard();
      if (data && data.routines && data.routines.length > 0) {
        const mapped = data.routines.map((r) => ({
          id: r.id,
          time: r.time_slot,
          title: r.title,
          category: r.category,
          icon: CATEGORY_ICONS[r.category] || '⏰',
          isCompleted: r.completed === 1
        }));
        setRoutines(mapped);
      }
    } catch {
      // Keep initial defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const toggleComplete = async (id: number) => {
    // Optimistic UI update
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );

    addOfflineEvent('reminder', { routine_id: id, toggled_at: new Date().toISOString() });

    try {
      await api.toggleRoutine(id);
    } catch (e) {
      console.warn('API routine toggle offline, stored in queue', e);
    }
  };

  const completedCount = routines.filter((r) => r.isCompleted).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-elderly-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-teal-600" />
            <span>My Day Routine</span>
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Progress today: <strong>{completedCount} of {routines.length} completed</strong>
          </p>
        </div>

        <button
          onClick={loadRoutines}
          className="p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200 transition-all"
          title="Refresh today's schedule"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Routine Timeline Cards */}
      <div className="space-y-3">
        {routines.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleComplete(item.id)}
            className={`p-4 rounded-3xl border-2 flex items-center justify-between shadow-sm cursor-pointer transition-all large-touch-target ${
              item.isCompleted
                ? 'bg-emerald-50 border-emerald-300 opacity-80'
                : 'bg-white border-slate-200 hover:border-teal-400'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button className="text-2xl">
                {item.isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-400" />
                )}
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full">
                    {item.time}
                  </span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div
                  className={`text-elderly-base font-extrabold mt-1 ${
                    item.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
