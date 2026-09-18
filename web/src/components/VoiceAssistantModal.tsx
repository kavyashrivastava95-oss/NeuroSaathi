import React, { useState } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { isListening, startListening, stopListening, speak, isVoiceSupported } = useVoice();
  const { language } = useAuth();
  const [transcript, setTranscript] = useState<string>('');
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const sampleCommands = [
    { label: "💧 Water Request", text: "I need water.", intent: "WATER_REQUEST" },
    { label: "💊 Medicine Query", text: "Remind me about my medicine.", intent: "MEDICINE_REMINDER" },
    { label: "🧠 Start Game", text: "Start my brain activity.", intent: "START_GAME" },
    { label: "📅 Show Routine", text: "Show my daily routine.", intent: "SHOW_ROUTINE" },
    { label: "❤️ Memory Capsule", text: "Show family memories.", intent: "SHOW_MEMORY" },
    { label: "🤝 Alert Caregiver", text: "Alert my caregiver.", intent: "CAREGIVER_CONTACT" },
  ];

  const processQuery = async (queryText: string) => {
    setTranscript(queryText);
    setIsProcessing(true);

    try {
      const res = await api.sendVoiceQuery(queryText, language);
      const intent = res.intent || 'fallback';
      const reply = res.spoken_response || "I am here to help you remember your day, medicines, and games!";
      
      setDetectedIntent(intent);
      setResponseMsg(reply);
      speak(reply);

      // Execute navigation action if applicable
      if (intent === 'start_game' && onNavigateTab) {
        setTimeout(() => onNavigateTab('brain'), 1500);
      } else if (intent === 'routine' && onNavigateTab) {
        setTimeout(() => onNavigateTab('myday'), 1500);
      } else if (intent === 'home' && onNavigateTab) {
        setTimeout(() => onNavigateTab('home'), 1500);
      } else if (intent === 'caregiver' && onNavigateTab) {
        setTimeout(() => onNavigateTab('profile'), 1500);
      }
    } catch {
      const fallbackReply = "I heard your request. Opening your routine.";
      setResponseMsg(fallbackReply);
      speak(fallbackReply);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setResponseMsg('');
      setDetectedIntent(null);
      startListening(language, (heardText) => {
        processQuery(heardText);
      });
    }
  };

  const handleCommandSelect = (cmdText: string) => {
    processQuery(cmdText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-teal-500 relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 text-teal-800 font-bold text-elderly-lg mb-1">
          <Sparkles className="w-7 h-7 text-teal-600 animate-spin" />
          <span>NeuroSaathi Voice Companion</span>
        </div>
        <p className="text-slate-600 text-sm mb-5">
          {isListening ? "Listening... Speak clearly into your microphone" : "Tap microphone to speak or choose a request below"}
        </p>

        {/* Interactive Microphone Button */}
        <div className="relative mb-6">
          <button
            onClick={handleMicClick}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-600 ring-8 ring-rose-200 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 ring-8 ring-teal-100'
            }`}
            title={isListening ? "Click to stop listening" : "Click to speak"}
          >
            {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
          {isListening && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-600 uppercase tracking-wider animate-pulse whitespace-nowrap">
              Listening now...
            </span>
          )}
        </div>

        {/* Transcript & Assistant Response Box */}
        {transcript ? (
          <div className="w-full bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 mb-5 text-left space-y-2">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Recognized Voice Request:</div>
            <div className="text-lg font-semibold text-slate-800">"{transcript}"</div>
            {detectedIntent && (
              <span className="inline-block bg-teal-200 text-teal-900 text-xs px-2.5 py-1 rounded-full font-bold">
                Intent: {detectedIntent}
              </span>
            )}
            <hr className="border-teal-200 my-2" />
            <div className="flex items-start space-x-2 text-teal-900 font-medium text-base">
              <Volume2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{responseMsg || (isProcessing ? "Processing..." : "")}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 font-medium text-xs mb-3">Or select a pre-set voice command:</p>
        )}

        {/* Quick Sample Voice Command Buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          {sampleCommands.map((cmd) => (
            <button
              key={cmd.intent}
              onClick={() => handleCommandSelect(cmd.text)}
              className="p-3 bg-slate-50 hover:bg-teal-100 border-2 border-slate-200 hover:border-teal-400 rounded-xl text-left font-bold text-slate-800 text-xs flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-base py-3 rounded-2xl shadow-lg transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
