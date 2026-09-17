import React, { useState } from 'react';
import { ArrowLeft, Smile, HeartHandshake } from 'lucide-react';
import { GameResultModal } from './GameResultModal';
import { useOfflineSync } from '../../../context/OfflineSyncContext';
import { useAuth } from '../../../context/AuthContext';

const EMOTIONS = [
  { emoji: '😊', label: 'Happy', desc: 'Warm smile with relaxed eyes' },
  { emoji: '😌', label: 'Calm', desc: 'Gentle peaceful expression' },
  { emoji: '😟', label: 'Worried', desc: 'Frowned brows looking concerned' },
  { emoji: '😢', label: 'Sad', desc: 'Tearful expression' },
  { emoji: '😠', label: 'Angry', desc: 'Steeped brows with tight lips' },
];

export const EmotionRecognition: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { difficulty } = useAuth();
  const { addOfflineEvent } = useOfflineSync();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const currentEmotion = EMOTIONS[currentIndex % EMOTIONS.length];

  const handleSelectEmotion = (label: string) => {
    const isCorrect = label === currentEmotion.label;
    const elapsed = (Date.now() - startTime) / 1000;
    const accuracy = isCorrect ? 100 : 0;
    const score = isCorrect ? 95 : 30;

    addOfflineEvent('session', {
      game_id: 'emotion_recognition',
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
      adaptiveReason: `Identified emotional expression '${currentEmotion.label}' accurately.`,
      nextDifficulty: difficulty,
      recommendedGame: 'memory_match'
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
        <h2 className="text-elderly-lg font-extrabold text-slate-900">Emotion Recognition</h2>
        <div className="w-8"></div>
      </div>

      <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-2.5 mb-6 text-xs text-amber-900 flex items-center justify-center space-x-1.5 font-medium">
        <HeartHandshake className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>This activity is for cognitive training and social engagement only (non-diagnostic).</span>
      </div>

      {/* Emotion Facial Card */}
      <div className="w-full max-w-sm bg-white border-4 border-teal-500 rounded-3xl p-8 shadow-xl flex flex-col items-center mb-6">
        <span className="text-8xl mb-4 animate-bounce">{currentEmotion.emoji}</span>
        <p className="text-slate-600 text-sm text-center font-medium italic font-serif">
          "{currentEmotion.desc}"
        </p>
      </div>

      <h3 className="text-elderly-lg font-extrabold text-slate-900 text-center mb-6">
        How does this person feel?
      </h3>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {EMOTIONS.map((emo) => (
          <button
            key={emo.label}
            onClick={() => handleSelectEmotion(emo.label)}
            className="p-4 bg-white border-4 border-slate-200 hover:border-teal-500 rounded-3xl flex items-center space-x-3 shadow-md transition-all active:scale-95 large-touch-target"
          >
            <span className="text-3xl">{emo.emoji}</span>
            <span className="text-lg font-extrabold text-slate-800">{emo.label}</span>
          </button>
        ))}
      </div>

      {isCompleted && sessionResult && (
        <GameResultModal
          score={sessionResult.score}
          accuracy={sessionResult.accuracy}
          responseTime={sessionResult.responseTime}
          mistakes={sessionResult.mistakes}
          gameTitle="Emotion Recognition"
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
