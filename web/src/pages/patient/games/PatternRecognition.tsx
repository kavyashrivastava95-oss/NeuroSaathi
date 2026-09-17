import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';

const PATTERNS = [
  { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🔵', '🟡', '🟢'] },
  { sequence: ['🌸', '🍃', '🌸', '🍃'], answer: '🌸', options: ['🌸', '🍃', '☀️', '🌧️'] },
  { sequence: ['🍎', '🍌', '🍎', '🍌'], answer: '🍎', options: ['🍎', '🍌', '🍇', '🥭'] },
  { sequence: ['🫖', '☕', '🫖', '☕'], answer: '🫖', options: ['🫖', '☕', '🥣', '🍽️'] },
];

export const PatternRecognition: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const currentPattern = PATTERNS[currentIndex % PATTERNS.length];

  const handleSelectOption = (option: string) => {
    const isCorrect = option === currentPattern.answer;
    const elapsed = (Date.now() - startTime) / 1000;
    
    if (!isCorrect) {
      setMistakes((prev) => prev + 1);
    }

    const accuracy = isCorrect ? 100 : 0;
    const score = isCorrect ? Math.round(100 - elapsed * 2) : 20;

    let nextDiff = difficulty;
    let reason = isCorrect
      ? "Identified sequence pattern correctly!"
      : "Selected alternative sequence option.";

    if (isCorrect && difficulty === 'Easy') nextDiff = 'Medium';

    addOfflineEvent('session', {
      game_id: 'pattern_recognition',
      difficulty,
      score,
      accuracy,
      response_time: elapsed,
      attempts: 1,
      mistakes: isCorrect ? mistakes : mistakes + 1
    });

    setSessionResult({
      score,
      accuracy,
      responseTime: elapsed,
      mistakes: isCorrect ? mistakes : mistakes + 1,
      adaptiveReason: reason,
      nextDifficulty: nextDiff,
      recommendedGame: 'attention_game'
    });
    setIsCompleted(true);
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
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Pattern Recognition</h2>
        <div className="w-8"></div>
      </div>

      <p className="text-slate-600 text-base font-medium text-center mb-6">
        What comes next in this pattern?
      </p>

      {/* Pattern Display Box */}
      <div className="bg-white border-4 border-teal-500 rounded-3xl p-6 shadow-xl w-full flex items-center justify-center space-x-3 mb-8">
        {currentPattern.sequence.map((item, idx) => (
          <span key={idx} className="text-5xl md:text-6xl">{item}</span>
        ))}
        <span className="text-5xl md:text-6xl font-black text-teal-600 animate-pulse">❓</span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentPattern.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectOption(opt)}
            className="p-6 bg-white border-4 border-slate-200 hover:border-teal-500 rounded-3xl text-5xl flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 large-touch-target"
          >
            {opt}
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Pattern Recognition"
          adaptiveReason={sessionResult.adaptiveReason}
          nextDifficulty={sessionResult.nextDifficulty}
          recommendedGame={sessionResult.recommendedGame}
          onPlayAgain={() => {
            setCurrentIndex((prev) => prev + 1);
            setIsCompleted(false);
          }}
          onBackToGames={onBack}
        />
      )}
    </div>
  );
};
