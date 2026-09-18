import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

export const SequenceGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty, user } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const options = [
    { title: "1. Seed Planting ➔ 2. Watering ➔ 3. Flower Blooming 🌸", isCorrect: true },
    { title: "1. Flower Blooming ➔ 2. Seed Planting ➔ 3. Watering", isCorrect: false },
    { title: "1. Watering ➔ 2. Harvest ➔ 3. Seed Planting", isCorrect: false },
  ];

  const handleSelectSequence = async (isCorrect: boolean) => {
    const elapsed = (Date.now() - startTime) / 1000;
    const accuracy = isCorrect ? 100 : 0;
    const score = isCorrect ? 95 : 25;
    const mistakesCount = isCorrect ? 0 : 1;

    const payload = {
      user_id: user?.id || 'kamala_devi',
      game_id: 'sequence_game',
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
          recommendedGame: res.evaluation.recommendation_title || 'Object Identification'
        });
        setIsCompleted(true);
        return;
      }
    } catch {
      // Fallback below
    }

    setSessionResult({
      score,
      accuracy,
      responseTime: elapsed,
      mistakes: mistakesCount,
      adaptiveReason: "Completed plant growth chronological sequence test.",
      nextDifficulty: difficulty,
      recommendedGame: 'Object Identification'
    });
    setIsCompleted(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-teal-800 font-bold bg-white px-4 py-2 rounded-xl shadow border border-teal-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Sequence Order</h2>
        <div className="w-8"></div>
      </div>

      <h3 className="text-elderly-lg font-extrabold text-slate-900 text-center mb-6">
        Select the correct order of plant growth:
      </h3>

      <div className="space-y-4 w-full max-w-md">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSequence(opt.isCorrect)}
            className="w-full p-5 bg-white border-4 border-slate-200 hover:border-teal-500 rounded-3xl text-left text-lg font-extrabold text-slate-800 shadow-md transition-all active:scale-95 large-touch-target"
          >
            {opt.title}
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Sequence Order"
          adaptiveReason={sessionResult.adaptiveReason}
          nextDifficulty={sessionResult.nextDifficulty}
          recommendedGame={sessionResult.recommendedGame}
          onPlayAgain={() => setIsCompleted(false)}
          onBackToGames={onBack}
        />
      )}
    </div>
  );
};
