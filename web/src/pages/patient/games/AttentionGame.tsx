import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, RefreshCw } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';

interface TargetItem {
  id: number;
  type: 'flower' | 'leaf' | 'butterfly';
  emoji: string;
  isTapped: boolean;
}

export const AttentionGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [gridItems, setGridItems] = useState<TargetItem[]>([]);
  const [correctTaps, setCorrectTaps] = useState<number>(0);
  const [incorrectTaps, setIncorrectTaps] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const totalFlowers = difficulty === 'Easy' ? 4 : difficulty === 'Medium' ? 6 : 8;

  const initGame = () => {
    const items: TargetItem[] = [];
    let id = 1;
    
    // Add target flowers
    for (let i = 0; i < totalFlowers; i++) {
      items.push({ id: id++, type: 'flower', emoji: '🌸', isTapped: false });
    }
    // Add distractors
    for (let i = 0; i < 6; i++) {
      items.push({ id: id++, type: 'leaf', emoji: '🍃', isTapped: false });
      items.push({ id: id++, type: 'butterfly', emoji: '🦋', isTapped: false });
    }

    setGridItems(items.sort(() => Math.random() - 0.5));
    setCorrectTaps(0);
    setIncorrectTaps(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const handleTapItem = (id: number) => {
    const item = gridItems.find((i) => i.id === id);
    if (!item || item.isTapped) return;

    setGridItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isTapped: true } : i))
    );

    if (item.type === 'flower') {
      const nextCorrect = correctTaps + 1;
      setCorrectTaps(nextCorrect);

      if (nextCorrect === totalFlowers) {
        // Completed all flowers!
        const elapsed = (Date.now() - startTime) / 1000;
        const accuracy = Math.max(0, 100 - incorrectTaps * 15);
        const score = Math.round(accuracy * 10 - elapsed * 2);

        let nextDiff = difficulty;
        if (accuracy >= 85) nextDiff = difficulty === 'Easy' ? 'Medium' : 'Hard';

        addOfflineEvent('session', {
          game_id: 'attention_game',
          difficulty,
          score,
          accuracy,
          response_time: elapsed,
          attempts: 1,
          mistakes: incorrectTaps
        });

        setSessionResult({
          score,
          accuracy,
          responseTime: elapsed,
          mistakes: incorrectTaps,
          adaptiveReason: `Found all ${totalFlowers} flowers with ${incorrectTaps} distractors tapped.`,
          nextDifficulty: nextDiff,
          recommendedGame: 'object_recognition'
        });
        setIsCompleted(true);
      }
    } else {
      setIncorrectTaps((prev) => prev + 1);
    }
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
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Attention Search</h2>
        <button onClick={initGame} className="p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Target Banner */}
      <div className="bg-pink-100 border-4 border-pink-400 rounded-3xl p-4 w-full flex items-center justify-center space-x-3 mb-6 shadow-md">
        <Target className="w-8 h-8 text-pink-600" />
        <span className="text-elderly-lg font-extrabold text-pink-950">
          Instruction: Tap all {totalFlowers} Flowers 🌸 ({correctTaps}/{totalFlowers})
        </span>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {gridItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTapItem(item.id)}
            disabled={item.isTapped}
            className={`h-24 md:h-28 rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all active:scale-95 border-2 ${
              item.isTapped
                ? item.type === 'flower'
                  ? 'bg-emerald-200 border-emerald-500 scale-95 opacity-80'
                  : 'bg-red-100 border-red-400 opacity-40'
                : 'bg-white border-slate-200 hover:border-pink-400'
            }`}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Attention Search"
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
