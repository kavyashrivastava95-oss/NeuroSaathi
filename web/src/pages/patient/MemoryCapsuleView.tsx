import React, { useState } from 'react';
import { Heart, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';

export const MemoryCapsuleView: React.FC = () => {
  const { speak } = useVoice();
  const [activeQuizItem, setActiveQuizItem] = useState<any | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const memoryItems = [
    {
      id: 1,
      category: 'PEOPLE',
      title: 'Ananya Devi',
      relationship: 'Daughter',
      description: 'Ananya is your loving daughter who brings home-baked Pitha every weekend.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
      question: 'Who is this person?',
      options: ['Your Daughter Ananya', 'Your Niece Priya', 'Your Doctor', 'Your Neighbor']
    },
    {
      id: 2,
      category: 'PLACES',
      title: 'Majuli River Island',
      relationship: 'Ancestral Homestead',
      description: 'Your ancestral family home on the world famous river island in Assam.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
      question: 'What place is this?',
      options: ['Majuli Island Home', 'Guwahati Market', 'Kaziranga Park', 'Shillong Hill']
    },
    {
      id: 3,
      category: 'OBJECTS',
      title: 'Assamese Gamusa',
      relationship: 'Traditional Honor',
      description: 'Handwoven red and white traditional towel of respect and honor.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      question: 'What is this cultural item?',
      options: ['Assamese Gamusa', 'Silk Saree', 'Bamboo Mat', 'Clay Pot']
    }
  ];

  const handleQuizAnswer = (option: string, correctOption: string) => {
    const correct = option === correctOption;
    setIsCorrect(correct);
    setQuizAnswered(true);
    speak(correct ? "Wonderful! That is absolutely correct." : "That is okay! This is your memory capsule.");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="text-elderly-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-100" />
          <span>Memory Capsule</span>
        </h1>
        <p className="text-slate-600 text-sm font-medium">
          Personalized family memories added by your caregiver Ananya
        </p>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-6">
        {memoryItems.map((item) => (
          <div key={item.id} className="bg-white border-4 border-teal-200 rounded-3xl overflow-hidden shadow-lg">
            <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-rose-100 text-rose-900 px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.category}: {item.relationship}
                </span>

                <button
                  onClick={() => speak(`${item.title}. ${item.description}`)}
                  className="p-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-full"
                  title="Read aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-elderly-lg font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-slate-700 text-base font-medium leading-relaxed">{item.description}</p>

              <button
                onClick={() => {
                  setActiveQuizItem(item);
                  setQuizAnswered(false);
                }}
                className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-2xl shadow flex items-center justify-center space-x-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Play Memory Question</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Personalized Quiz Modal */}
      {activeQuizItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-teal-500 text-center">
            <img src={activeQuizItem.imageUrl} alt={activeQuizItem.title} className="w-full h-44 object-cover rounded-2xl mb-4 shadow" />

            <h3 className="text-elderly-lg font-extrabold text-slate-900 mb-4">{activeQuizItem.question}</h3>

            {!quizAnswered ? (
              <div className="grid grid-cols-1 gap-2.5 w-full mb-4">
                {activeQuizItem.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleQuizAnswer(opt, activeQuizItem.options[0])}
                    className="p-3.5 bg-slate-50 hover:bg-teal-100 border-2 border-slate-300 font-extrabold text-slate-800 rounded-2xl text-left transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className={`p-4 rounded-2xl mb-4 font-bold text-lg ${isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {isCorrect ? "✨ Correct! This is " + activeQuizItem.title : "❤️ Wonderful memory of " + activeQuizItem.title}
              </div>
            )}

            <button
              onClick={() => setActiveQuizItem(null)}
              className="w-full bg-slate-800 text-white font-bold py-3 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
