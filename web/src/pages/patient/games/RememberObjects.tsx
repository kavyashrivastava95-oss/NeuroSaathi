import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

const ALL_OBJECTS = [
  { id: 'mango', name: 'Mango', emoji: '🥭' },
  { id: 'gamusa', name: 'Gamusa', emoji: '🧣' },
  { id: 'teapot', name: 'Tea Pot', emoji: '🫖' },
  { id: 'lemon', name: 'Kazi Nemu', emoji: '🍋' },
  { id: 'flower', name: 'Rhododendron', emoji: '🌸' },
  { id: 'pepper', name: 'Ghost Pepper', emoji: '🌶️' },
  { id: 'bamboo', name: 'Bamboo Basket', emoji: '🧺' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘' },
];

export const RememberObjects: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty, user } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const numObjectsToShow = difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 3 : 4;

  const [targetObjects, setTargetObjects] = useState<typeof ALL_OBJECTS>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [timer, setTimer] = useState<number>(4);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const initGame = () => {
    const shuffled = [...ALL_OBJECTS].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, numObjectsToShow);
    setTargetObjects(chosen);
    setPhase('memorize');
    setTimer(4);
    setSelectedIds([]);
    setIsCompleted(false);
    setSessionResult(null);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  useEffect(() => {
    if (phase === 'memorize') {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
      } else {
        setPhase('recall');
        setStartTime(Date.now());
      }
    }
  }, [phase, timer]);

  const handleSelectObject = async (id: string) => {
    if (phase !== 'recall') return;
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    
    setSelectedIds(updated);

    if (updated.length === targetObjects.length) {
      // Check answers
      const correctCount = updated.filter((id) => targetObjects.some((t) => t.id === id)).length;
      const elapsed = (Date.now() - startTime) / 1000;
      const accuracy = (correctCount / targetObjects.length) * 100;
      const score = Math.round(accuracy * 10 - elapsed * 2);
      const mistakesCount = targetObjects.length - correctCount;

      const payload = {
        user_id: user?.id || 'kamala_devi',
        game_id: 'remember_objects',
        score,
        accuracy,
        response_time: elapsed,
        mistakes: mistakesCount
      };

      addOfflineEvent('session', payload);

      try {
        const res = await api.submitGameResult(payload);
        if (res && res.evaluation) {
          setSessionResult({
            score,
            accuracy,
            responseTime: elapsed,
            mistakes: mistakesCount,
            adaptiveReason: res.evaluation.rationale,
            nextDifficulty: res.evaluation.new_difficulty,
            recommendedGame: res.evaluation.recommendation_title || 'Pattern Recognition'
          });
          setIsCompleted(true);
          return;
        }
      } catch {
        // Fallback below
      }

      let nextDiff = difficulty;
      let reason = `Remembered ${correctCount} of ${targetObjects.length} objects accurately.`;

      if (accuracy >= 85) {
        nextDiff = difficulty === 'Easy' ? 'Medium' : 'Hard';
      }

      setSessionResult({
        score,
        accuracy,
        responseTime: elapsed,
        mistakes: mistakesCount,
        adaptiveReason: reason,
        nextDifficulty: nextDiff,
        recommendedGame: 'Pattern Recognition'
      });
      setIsCompleted(true);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-teal-800 font-bold bg-white px-4 py-2 rounded-xl shadow border border-teal-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Remember the Objects</h2>
        <button onClick={initGame} className="p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {phase === 'memorize' ? (
        <div className="flex flex-col items-center text-center space-y-6 my-6 w-full">
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 font-bold text-lg animate-pulse">
            <Eye className="w-6 h-6" />
            <span>Look closely! Hiding in {timer} seconds...</span>
          </div>

          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            {targetObjects.map((obj) => (
              <div
                key={obj.id}
                className="w-32 h-36 bg-white border-4 border-teal-500 rounded-3xl flex flex-col items-center justify-center shadow-xl p-3"
              >
                <span className="text-5xl mb-2">{obj.emoji}</span>
                <span className="text-sm font-extrabold text-slate-800">{obj.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-4 w-full">
          <h3 className="text-elderly-lg font-extrabold text-teal-900">Which objects did you see?</h3>
          <p className="text-slate-600 text-base font-medium">
            Select {targetObjects.length} objects from below:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full my-4">
            {ALL_OBJECTS.map((obj) => {
              const isSelected = selectedIds.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => handleSelectObject(obj.id)}
                  className={`p-4 rounded-2xl border-4 flex flex-col items-center justify-center transition-all large-touch-target ${
                    isSelected
                      ? 'bg-teal-700 border-teal-800 text-white shadow-lg scale-105'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400'
                  }`}
                >
                  <span className="text-4xl mb-1">{obj.emoji}</span>
                  <span className="text-sm font-bold">{obj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Remember the Objects"
          adaptiveReason={sessionResult.adaptiveReason}
          nextDifficulty={sessionResult.nextDifficulty}
          recommendedGame={sessionResult.recommendedGame}
          onPlayAgain={initGame}
          onBackToGames={onBack}
        />
      )}
    </div>
  );
};
