import React, { useState } from 'react';
import { Brain, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import all 8 cognitive game components
import { MemoryMatch } from './games/MemoryMatch';
import { RememberObjects } from './games/RememberObjects';
import { PatternRecognition } from './games/PatternRecognition';
import { RoutineRecall } from './games/RoutineRecall';
import { AttentionGame } from './games/AttentionGame';
import { SequenceGame } from './games/SequenceGame';
import { ObjectRecognition } from './games/ObjectRecognition';
import { EmotionRecognition } from './games/EmotionRecognition';

export const BrainGym: React.FC = () => {
  const { difficulty } = useAuth();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const games = [
    { id: 'memory_match', name: 'Memory Match', category: 'Object Matching', emoji: '🃏', color: 'border-emerald-400 bg-emerald-50' },
    { id: 'remember_objects', name: 'Remember Objects', category: 'Visual Memory', emoji: '👀', color: 'border-teal-400 bg-teal-50' },
    { id: 'pattern_recognition', name: 'Pattern Match', category: 'Logic Sequence', emoji: '🧩', color: 'border-blue-400 bg-blue-50' },
    { id: 'routine_recall', name: 'Daily Routine Recall', category: 'Daily Life', emoji: '⏰', color: 'border-indigo-400 bg-indigo-50' },
    { id: 'attention_game', name: 'Attention Search', category: 'Visual Focus', emoji: '🎯', color: 'border-pink-400 bg-pink-50' },
    { id: 'sequence_game', name: 'Sequence Order', category: 'Ordering', emoji: '🔢', color: 'border-purple-400 bg-purple-50' },
    { id: 'object_recognition', name: 'Cultural Objects', category: 'NER Heritage', emoji: '🧣', color: 'border-amber-400 bg-amber-50' },
    { id: 'emotion_recognition', name: 'Emotion Recognition', category: 'Social Engagement', emoji: '😊', color: 'border-rose-400 bg-rose-50' },
  ];

  if (activeGameId === 'memory_match') return <MemoryMatch onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'remember_objects') return <RememberObjects onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'pattern_recognition') return <PatternRecognition onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'routine_recall') return <RoutineRecall onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'attention_game') return <AttentionGame onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'sequence_game') return <SequenceGame onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'object_recognition') return <ObjectRecognition onBack={() => setActiveGameId(null)} />;
  if (activeGameId === 'emotion_recognition') return <EmotionRecognition onBack={() => setActiveGameId(null)} />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-elderly-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Brain className="w-8 h-8 text-teal-600" />
            <span>Brain Gym</span>
          </h1>
          <p className="text-slate-600 text-sm font-medium">Select an exercise to train memory & attention</p>
        </div>

        <div className="bg-teal-100 text-teal-900 px-3 py-1.5 rounded-full text-xs font-bold border border-teal-300 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
          <span>Difficulty: {difficulty}</span>
        </div>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGameId(g.id)}
            className={`p-5 rounded-3xl border-4 ${g.color} text-left flex items-center justify-between shadow-md hover:shadow-lg transition-all transform active:scale-98 large-touch-target`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{g.emoji}</span>
              <div>
                <h3 className="text-elderly-base font-extrabold text-slate-900">{g.name}</h3>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{g.category}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-teal-700 text-white rounded-full flex items-center justify-center shadow">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
