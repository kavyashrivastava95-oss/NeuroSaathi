import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';

export const RoutineRecall: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const routineSteps = [
    { title: 'Wake up', emoji: '🌅' },
    { title: 'Brush teeth', emoji: '🪥' },
    { title: 'Morning Medicine', emoji: '💊' },
    { title: 'Breakfast', emoji: '🥣' },
  ];

  const question = "What comes after Breakfast in your daily morning routine?";
  const options = [
    { label: '🧠 Brain Session / Walk', emoji: '🚶‍♂️', isCorrect: true },
    { label: '🌙 Go to Sleep', emoji: '🛌', isCorrect: false },
    { label: 'Dinner', emoji: '🍲', isCorrect: false },
    { label: 'Night Medicine', emoji: '🌙', isCorrect: false },
  ];

  const handleSelectAnswer = (isCorrect: boolean) => {
    const elapsed = (Date.now() - startTime) / 1000;
    const accuracy = isCorrect ? 100 : 0;
    const score = isCorrect ? 90 : 30;

    let nextDiff = difficulty;
    let reason = isCorrect
      ? "Accurately recalled morning daily routine sequence!"
      : "Selected alternative activity step.";

    addOfflineEvent('session', {
      game_id: 'routine_recall',
      difficulty,
      score,
      accuracy,
      response_time: elapsed,
      attempts: 1,
      mistakes: isCorrect ? 0 : 1
    });

    setSessionResult({
      score,
      accuracy,
      responseTime: elapsed,
      mistakes: isCorrect ? 0 : 1,
      adaptiveReason: reason,
      nextDifficulty: nextDiff,
      recommendedGame: 'sequence_game'
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
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Daily Routine Recall</h2>
        <div className="w-8"></div>
      </div>

      {/* Steps Visual Timeline */}
      <div className="w-full bg-white border-2 border-teal-200 rounded-3xl p-4 shadow-md mb-6">
        <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-3 text-center">
          Morning Routine Steps:
        </div>
        <div className="flex items-center justify-around flex-wrap gap-2">
          {routineSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center p-2 bg-teal-50 rounded-xl">
                <span className="text-3xl">{step.emoji}</span>
                <span className="text-xs font-bold text-slate-800 mt-1">{step.title}</span>
              </div>
              {idx < routineSteps.length - 1 && <span className="text-slate-400 font-bold text-xl">➔</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h3 className="text-elderly-lg font-extrabold text-slate-900 text-center mb-6">{question}</h3>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectAnswer(opt.isCorrect)}
            className="p-5 bg-white border-4 border-slate-200 hover:border-teal-500 rounded-3xl flex items-center space-x-4 shadow-md transition-all text-left large-touch-target active:scale-95"
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-lg font-extrabold text-slate-800">{opt.label}</span>
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Daily Routine Recall"
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
