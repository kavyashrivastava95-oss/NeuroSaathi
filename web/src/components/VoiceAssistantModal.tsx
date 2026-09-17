import React, { useState } from 'react';
import { Mic, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../data/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { isListening, speak } = useVoice();
  const { language } = useAuth();
  const [transcript, setTranscript] = useState<string>('');
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleCommands = [
    { label: "💧 Water Request", text: "I need water.", intent: "WATER_REQUEST" },
    { label: "💊 Medicine Query", text: "Remind me about my medicine.", intent: "MEDICINE_REMINDER" },
    { label: "🧠 Start Game", text: "Start my brain activity.", intent: "START_GAME" },
    { label: "📅 Show Routine", text: "Show my daily routine.", intent: "SHOW_ROUTINE" },
    { label: "❤️ Memory Capsule", text: "Show family memories.", intent: "SHOW_MEMORY" },
    { label: "🤝 Alert Caregiver", text: "Alert my caregiver.", intent: "CAREGIVER_CONTACT" },
  ];

  const handleCommandSelect = (cmdText: string, intent: string) => {
    setTranscript(cmdText);
    setDetectedIntent(intent);

    let reply = "";
    if (intent === "WATER_REQUEST") {
      reply = "I have notified your caregiver Ananya that you need water. Please rest for a moment.";
    } else if (intent === "MEDICINE_REMINDER") {
      reply = "Your next medicine is Blood Pressure tablet scheduled at 8:00 AM after breakfast.";
    } else if (intent === "START_GAME") {
      reply = "Opening today's brain activity game!";
      if (onNavigateTab) onNavigateTab('brain');
    } else if (intent === "SHOW_ROUTINE") {
      reply = "Showing your daily routine plan for today.";
      if (onNavigateTab) onNavigateTab('myday');
    } else if (intent === "SHOW_MEMORY") {
      reply = "Opening your Memory Capsule photos and family memories.";
      if (onNavigateTab) onNavigateTab('memory');
    } else if (intent === "CAREGIVER_CONTACT") {
      reply = "Caregiver Ananya Devi has been notified. She will check in on you shortly.";
    } else {
      reply = "I am here to help you remember your day, medicines, and games!";
    }

    setResponseMsg(reply);
    speak(reply);
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
        <div className="flex items-center space-x-2 text-teal-800 font-bold text-elderly-lg mb-2">
          <Sparkles className="w-7 h-7 text-teal-600 animate-spin" />
          <span>NeuroSaathi Voice Companion</span>
        </div>
        <p className="text-slate-600 text-base mb-6">Speak or tap any request below</p>

        {/* Large Pulse Microphone */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-xl ring-8 ring-teal-100 animate-pulse">
            <Mic className="w-12 h-12" />
          </div>
        </div>

        {/* Transcript & Assistant Response Box */}
        {transcript ? (
          <div className="w-full bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 mb-6 text-left space-y-2">
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
              <span>{responseMsg}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 font-medium text-sm mb-4">Tap a sample request to test voice assistant NLU:</p>
        )}

        {/* Quick Sample Voice Command Buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          {sampleCommands.map((cmd) => (
            <button
              key={cmd.intent}
              onClick={() => handleCommandSelect(cmd.text, cmd.intent)}
              className="p-3 bg-slate-50 hover:bg-teal-100 border-2 border-slate-200 hover:border-teal-400 rounded-xl text-left font-bold text-slate-800 text-sm flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg py-3 rounded-2xl shadow-lg transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
