import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Target, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GameResultModalProps {
  score: number;
  accuracy: number;
  responseTime: number;
  mistakes: number;
  gameTitle: string;
  adaptiveReason: string;
  nextDifficulty: string;
  recommendedGame: string;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  accuracy,
  responseTime,
  mistakes,
  gameTitle,
  adaptiveReason,
  nextDifficulty,
  recommendedGame,
  onPlayAgain,
  onBackToGames,
}) => {
  const { setDifficulty } = useAuth();

  useEffect(() => {
    // Trigger festive celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Update global user difficulty based on AI engine decision
    if (nextDifficulty && (nextDifficulty === 'Easy' || nextDifficulty === 'Medium' || nextDifficulty === 'Hard')) {
      setDifficulty(nextDifficulty);
    }
  }, [nextDifficulty, setDifficulty]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-emerald-500 text-center flex flex-col items-center animate-pulse-subtle">
        
        {/* Trophy Header */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 shadow-inner">
          <Trophy className="w-12 h-12" />
        </div>

        <h2 className="text-elderly-xl font-extrabold text-slate-900 mb-1">Wonderful Job! 🎉</h2>
        <p className="text-slate-600 text-base mb-6 font-medium">You completed {gameTitle}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
            <div className="flex items-center justify-center text-emerald-700 mb-1">
              <Trophy className="w-5 h-5 mr-1" />
              <span className="text-xs font-bold uppercase">Score</span>
            </div>
            <div className="text-2xl font-black text-emerald-900">{score}</div>
          </div>

          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-3">
            <div className="flex items-center justify-center text-teal-700 mb-1">
              <Target className="w-5 h-5 mr-1" />
              <span className="text-xs font-bold uppercase">Accuracy</span>
            </div>
            <div className="text-2xl font-black text-teal-900">{accuracy.toFixed(0)}%</div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
            <div className="flex items-center justify-center text-blue-700 mb-1">
              <Clock className="w-5 h-5 mr-1" />
              <span className="text-xs font-bold uppercase">Time</span>
            </div>
            <div className="text-2xl font-black text-blue-900">{responseTime.toFixed(1)}s</div>
          </div>
        </div>

        {/* AI Adaptive Difficulty Decision Box */}
        <div className="w-full bg-slate-900 text-white rounded-2xl p-4 text-left mb-6 shadow-md border border-slate-700">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Adaptive Engine Decision</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mb-2 font-medium">
            "{adaptiveReason}"
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Next Recommended Difficulty: <strong className="text-emerald-300">{nextDifficulty}</strong></span>
            <span>Recommended: <strong className="text-teal-300">{recommendedGame}</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 w-full">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-2xl transition-all border-2 border-slate-300"
          >
            Play Again
          </button>
          <button
            onClick={onBackToGames}
            className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>All Games</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
