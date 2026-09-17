import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Pill, Droplets, Utensils, Footprints, Moon } from 'lucide-react';

export const MyDay: React.FC = () => {
  const [routines, setRoutines] = useState([
    { id: 1, time: '07:00 AM', title: 'Wake up & Morning Tea', category: 'ROUTINE', icon: '🌅', isCompleted: true },
    { id: 2, time: '08:00 AM', title: 'Morning Medicine (Blood Pressure)', category: 'MEDICINE', icon: '💊', isCompleted: true },
    { id: 3, time: '10:00 AM', title: 'Brain Activity Game Session', category: 'EXERCISE', icon: '🧠', isCompleted: true },
    { id: 4, time: '11:00 AM', title: 'Hydration Check (Glass of water)', category: 'HYDRATION', icon: '💧', isCompleted: false },
    { id: 5, time: '01:00 PM', title: 'Nutritional Lunch', category: 'MEAL', icon: '🥣', isCompleted: false },
    { id: 6, time: '04:30 PM', title: 'Courtyard Evening Walk', category: 'WALK', icon: '🚶‍♂️', isCompleted: false },
    { id: 7, time: '08:30 PM', title: 'Night Medication', category: 'MEDICINE', icon: '💊', isCompleted: false },
    { id: 8, time: '10:00 PM', title: 'Night Sleep', category: 'SLEEP', icon: '🛌', isCompleted: false }
  ]);

  const toggleComplete = (id: number) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const completedCount = routines.filter((r) => r.isCompleted).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="text-elderly-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-teal-600" />
          <span>My Day Routine</span>
        </h1>
        <p className="text-slate-600 text-sm font-medium">
          Progress today: <strong>{completedCount} of {routines.length} completed</strong>
        </p>
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
