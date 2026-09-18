import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface CardItem {
  id: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ITEMS_POOL = [
  { symbol: '🌸', label: 'Flower' },
  { symbol: '🍎', label: 'Apple' },
  { symbol: '🥭', label: 'Mango' },
  { symbol: '🧣', label: 'Gamusa' },
  { symbol: '🫖', label: 'Assam Tea Pot' },
  { symbol: '🌶️', label: 'Ghost Pepper' },
  { symbol: '🍋', label: 'Kazi Nemu' },
  { symbol: '🐘', label: 'Kaziranga Elephant' },
];

export const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty, user } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const numPairs = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 7;
  
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const initGame = () => {
    const selected = ITEMS_POOL.slice(0, numPairs);
    const duplicated = [...selected, ...selected];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setAttempts(0);
    setMistakes(0);
    setIsCompleted(false);
    setSessionResult(null);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Match found!
        setTimeout(() => {
          setCards((prev) => {
            const matchedCards = [...prev];
            matchedCards[firstIdx].isMatched = true;
            matchedCards[secondIdx].isMatched = true;
            
            // Check completion
            if (matchedCards.every((c) => c.isMatched)) {
              handleGameComplete(attempts + 1, mistakes);
            }
            return matchedCards;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setMistakes((prev) => prev + 1);
        setTimeout(() => {
          setCards((prev) => {
            const resetCards = [...prev];
            resetCards[firstIdx].isFlipped = false;
            resetCards[secondIdx].isFlipped = false;
            return resetCards;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameComplete = async (finalAttempts: number, finalMistakes: number) => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const accuracy = Math.max(0, Math.min(100, (numPairs / (finalAttempts || 1)) * 100));
    const score = Math.round(accuracy * 10 - elapsedSeconds * 2);

    const payload = {
      user_id: user?.id || 'kamala_devi',
      game_id: 'memory_match',
      score,
      accuracy,
      response_time: elapsedSeconds,
      mistakes: finalMistakes
    };

    addOfflineEvent('session', payload);

    try {
      const res = await api.submitGameResult(payload);
      if (res && res.evaluation) {
        setSessionResult({
          score,
          accuracy,
          responseTime: elapsedSeconds,
          mistakes: finalMistakes,
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
    let reason = "";

    if (accuracy >= 85) {
      nextDiff = difficulty === 'Easy' ? 'Medium' : 'Hard';
      reason = `Difficulty increased because accuracy was ${accuracy.toFixed(0)}% with low mistakes (${finalMistakes}).`;
    } else if (accuracy >= 65) {
      reason = `Maintained ${difficulty} difficulty as steady accuracy (${accuracy.toFixed(0)}%) was observed.`;
    } else {
      nextDiff = difficulty === 'Hard' ? 'Medium' : 'Easy';
      reason = `Adjusted difficulty to lower level to ensure smooth cognitive engagement.`;
    }

    setSessionResult({
      score,
      accuracy,
      responseTime: elapsedSeconds,
      mistakes: finalMistakes,
      adaptiveReason: reason,
      nextDifficulty: nextDiff,
      recommendedGame: "Remember Objects"
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

        <h2 className="text-elderly-lg font-extrabold text-slate-900">Memory Match</h2>

        <button
          onClick={initGame}
          className="p-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
          title="Restart Game"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <p className="text-slate-600 font-medium text-base mb-6 text-center">
        Tap cards to turn them over and find matching pairs!
      </p>

      {/* Cards Grid */}
      <div className={`grid gap-3 w-full max-w-md ${numPairs >= 7 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {cards.map((card, index) => {
          const isVisible = card.isFlipped || card.isMatched;
          return (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`h-28 md:h-32 rounded-2xl flex flex-col items-center justify-center text-4xl shadow-md transition-all transform active:scale-95 border-2 ${
                card.isMatched
                  ? 'bg-emerald-100 border-emerald-400 opacity-60 cursor-default'
                  : isVisible
                  ? 'bg-white border-teal-500 scale-105'
                  : 'bg-teal-700 border-teal-800 text-white font-black hover:bg-teal-800'
              }`}
            >
              {isVisible ? (
                <>
                  <span>{card.symbol}</span>
                  <span className="text-xs font-bold text-slate-700 mt-1">{card.label}</span>
                </>
              ) : (
                <span className="text-2xl opacity-60">❓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Modal */}
      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Memory Match"
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
