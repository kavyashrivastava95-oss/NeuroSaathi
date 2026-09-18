import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';
import { NER_CULTURAL_DATABASE } from '../../../data/ner_cultural';
import { api } from '../../../services/api';

export const ObjectRecognition: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty, user } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const currentItem = NER_CULTURAL_DATABASE[currentIndex % NER_CULTURAL_DATABASE.length];

  const choices = [
    currentItem.name,
    "Wooden Drum",
    "Banana Leaf",
    "Bamboo Flute"
  ].sort(() => Math.random() - 0.5);

  const handleSelectChoice = async (choice: string) => {
    const isCorrect = choice === currentItem.name;
    const elapsed = (Date.now() - startTime) / 1000;
    const accuracy = isCorrect ? 100 : 0;
    const score = isCorrect ? 90 : 25;
    const mistakesCount = isCorrect ? 0 : 1;

    const payload = {
      user_id: user?.id || 'kamala_devi',
      game_id: 'object_recognition',
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
          recommendedGame: res.evaluation.recommendation_title || 'Expression Connect'
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
      adaptiveReason: `Recognized cultural object '${currentItem.name}' from ${currentItem.state}.`,
      nextDifficulty: difficulty,
      recommendedGame: 'Expression Connect'
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
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Object Identification</h2>
        <div className="w-8"></div>
      </div>

      <div className="w-full bg-white border-4 border-teal-500 rounded-3xl p-4 shadow-xl flex flex-col items-center mb-6">
        <img
          src={currentItem.imageUrl}
          alt={currentItem.name}
          className="w-full h-56 object-cover rounded-2xl mb-3 shadow"
        />
        <span className="text-xs font-bold text-teal-800 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
          Cultural Heritage ({currentItem.state})
        </span>
      </div>

      <h3 className="text-elderly-lg font-extrabold text-slate-900 text-center mb-6">
        What is this object?
      </h3>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {choices.map((ch, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectChoice(ch)}
            className="p-5 bg-white border-4 border-slate-200 hover:border-teal-500 rounded-3xl font-extrabold text-slate-800 text-base shadow-md transition-all active:scale-95 large-touch-target"
          >
            {ch}
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Object Identification"
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
