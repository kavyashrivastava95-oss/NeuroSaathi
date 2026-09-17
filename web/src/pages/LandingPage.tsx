import React from 'react';
import { 
  Brain, 
  Heart, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  Languages, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Gamepad2, 
  Smile, 
  Clock, 
  HelpCircle,
  WifiOff
} from 'lucide-react';

interface LandingPageProps {
  onStartElderlyDemo: () => void;
  onStartCaregiverDemo: () => void;
  onOpenAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartElderlyDemo,
  onStartCaregiverDemo,
  onOpenAuthModal
}) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white text-xs md:text-sm py-2 px-4 text-center font-medium flex items-center justify-center space-x-2 shadow-md">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>
          <strong>Smart India Hackathon (SIH 2026) Prototype</strong> — NeuroSaathi: AI-Powered Cognitive Care for Seniors
        </span>
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/30">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-outfit">
                Neuro<span className="text-teal-400">Saathi</span>
              </span>
              <p className="text-xs text-teal-300/80 font-medium">Your Companion for a Healthier Mind</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-teal-400 transition-colors">What is it?</a>
            <a href="#features" className="hover:text-teal-400 transition-colors">Cognitive Games</a>
            <a href="#adaptive-ai" className="hover:text-teal-400 transition-colors">Explainable AI</a>
            <a href="#caregiver" className="hover:text-teal-400 transition-colors">Caregiver Support</a>
            <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2.5 rounded-xl border border-teal-500/30 hover:border-teal-400 bg-slate-800 hover:bg-slate-700/80 text-teal-300 text-sm font-semibold transition-all shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={onStartElderlyDemo}
              className="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-sm font-bold shadow-lg shadow-teal-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs md:text-sm font-semibold shadow-inner">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Empowering Senior Minds with Dignity & Warmth</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] font-outfit">
                Your AI Companion for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300">Healthier, Sharper Mind</span>.
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong>NeuroSaathi</strong> provides joyful, culturally familiar cognitive games, daily memory routines, and explainable AI adaptive difficulty — giving seniors joyful autonomy and families peaceful reassurance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onStartElderlyDemo}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
                >
                  <Gamepad2 className="w-6 h-6" />
                  <span>Start Cognitive Activity</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onStartCaregiverDemo}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-teal-500/40 text-slate-200 font-semibold text-lg hover:text-white transition-all flex items-center justify-center space-x-3"
                >
                  <Users className="w-6 h-6 text-teal-400" />
                  <span>Caregiver Portal</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-teal-400">8+</p>
                  <p className="text-xs text-slate-400">Cognitive Exercises</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400">Explainable AI</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">Rural/Offline</p>
                  <p className="text-xs text-slate-400">Resilient Design</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Preview */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-900/20 relative">
                
                {/* Live Status Pill */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600/30 border border-teal-400/40 flex items-center justify-center font-bold text-teal-300">
                      KD
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Kamala Devi (Age 72)</h4>
                      <p className="text-xs text-slate-400">Guwahati, Assam • Daily Streak: 5 Days 🔥</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    Level: Easy
                  </span>
                </div>

                {/* Today's Exercise Highlight */}
                <div className="my-6 p-5 rounded-2xl bg-teal-950/40 border border-teal-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs text-teal-400 font-semibold uppercase tracking-wider">
                    <span>Today's Morning Exercise</span>
                    <span className="flex items-center space-x-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>4 mins</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>Memory Match (Cultural Pairs)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pairs of traditional Jaapi, Gamosa, earthen lamps, and flowers designed to stimulate visual recall.
                  </p>
                  
                  {/* AI Rationale Preview */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-teal-500/30 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Adaptive AI Rationale:</span>
                    </div>
                    <p className="text-slate-300 italic text-[11px]">
                      "Kamala achieved 85% accuracy yesterday. System maintains gentle pacing while expanding recall intervals."
                    </p>
                  </div>
                </div>

                {/* Action in Card */}
                <button
                  onClick={onStartElderlyDemo}
                  className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20"
                >
                  <span>Launch Kamala's Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WHAT IS NEUROSAATHI & WHO IS IT FOR? */}
      <section id="about" className="py-16 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Problem & Purpose</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
              Bridging the Cognitive Health Gap for India's Elderly
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Over 140 million seniors in India experience progressive memory decline, daily routine confusion, and social isolation — especially in rural and tier-2 regions where specialized cognitive therapists are virtually absent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-teal-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Smile className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">For Elderly Users</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Empowers seniors with non-intrusive, joyful memory exercises, familiar cultural symbols, voice guidance in their mother tongue, and comforting daily autonomy without feeling judged or evaluated.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-teal-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">For Caregivers & Children</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Provides adult children and caregivers continuous visibility into their parents' cognitive wellness, routine completion, medication reminders, and positive trends without nagging or hovering.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-teal-500/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <WifiOff className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Rural & Remote Communities</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Built offline-first with lightweight requirements so it works seamlessly on low-cost tablets and smartphones across village healthcare centres (PHCs) without requiring high-speed fiber internet.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 8 COGNITIVE GAMES & DOMAINS */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Cognitive Gym</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
              8 Multi-Domain Exercises Tailored for Senior Neuromuscular Health
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Each activity targets specific neurocognitive domains validated by geriatric psychology principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'memory_match', title: 'Memory Match', domain: 'Visual & Working Memory', icon: '🎴', desc: 'Pair matching cultural cards to exercise short-term retention.' },
              { id: 'pattern_recognition', title: 'Pattern Recognition', domain: 'Reasoning & Logic', icon: '🧩', desc: 'Discover rhythmic sequences to stimulate executive function.' },
              { id: 'attention_game', title: 'Attention Focus', domain: 'Sustained Attention', icon: '🎯', desc: 'Engage reaction timing with high-contrast visual cues.' },
              { id: 'object_recognition', title: 'Object Recall', domain: 'Semantic Association', icon: '🔍', desc: 'Recognize everyday household items and cultural artifacts.' },
              { id: 'routine_recall', title: 'Routine Recall', domain: 'Episodic Memory', icon: '⏰', desc: 'Recall daily medication, meals, and hydration schedules.' },
              { id: 'emotion_recognition', title: 'Expression Connect', domain: 'Social Cognition', icon: '😊', desc: 'Identify friendly emotions to cultivate empathetic warmth.' },
              { id: 'sequence_game', title: 'Sequence Master', domain: 'Ordering & Sequencing', icon: '🔢', desc: 'Follow progressive audio-visual cues to train working memory.' },
              { id: 'remember_objects', title: 'Memory Tray', domain: 'Delayed Spatial Recall', icon: '🧺', desc: 'Spot which everyday objects were moved or placed on the tray.' }
            ].map((game, i) => (
              <div 
                key={game.id}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-teal-500/40 hover:bg-slate-800/80 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="text-3xl mb-3">{game.icon}</div>
                  <h4 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">{game.title}</h4>
                  <p className="text-xs font-semibold text-teal-400/90 mb-2">{game.domain}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{game.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                  <span>3-5 mins</span>
                  <span className="text-teal-400 font-semibold">Playable</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. EXPLAINABLE ADAPTIVE AI ENGINE */}
      <section id="adaptive-ai" className="py-16 bg-gradient-to-br from-slate-900 via-teal-950/20 to-slate-900 border-y border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Explainable AI Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
                No Black Boxes: Transparent, Rule-Based Adaptive Intelligence
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                Judges and doctors often reject opaque AI models in healthcare. NeuroSaathi utilizes a <strong>verifiable, explainable rule engine</strong> that adjusts game difficulty based on quantifiable performance metrics.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/70 border-l-4 border-emerald-400 space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Accuracy &ge; 80% &amp; &le; 2 Mistakes &rarr; Difficulty Promoted</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Advances to the next cognitive tier to promote neuroplasticity without inducing frustration.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border-l-4 border-amber-400 space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Accuracy 50% - 79% &rarr; Difficulty Maintained</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Reinforces neural retention pathways until mastery is consolidated.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/70 border-l-4 border-rose-400 space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Accuracy &lt; 50% or &ge; 5 Mistakes &rarr; Difficulty Relaxed</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Gently reduces difficulty to alleviate cognitive strain and prevent elderly burnout.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-teal-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Live AI Evaluation Flow</span>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">Python + Flask Engine</span>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
                  <p className="text-teal-400"># 1. User Completes Activity</p>
                  <p className="text-slate-400">Input: &#123; accuracy: 88%, response_time: 34s, mistakes: 1 &#125;</p>
                  <p className="text-teal-400 mt-2"># 2. Rule Evaluation &amp; Anomaly Analysis</p>
                  <p className="text-emerald-400">&#10003; Target threshold met (&ge; 80%)</p>
                  <p className="text-emerald-400">&#10003; 5-Day rolling baseline stable (No fatigue detected)</p>
                  <p className="text-teal-400 mt-2"># 3. Transparent Rationale Emitted</p>
                  <p className="text-amber-200">"Accuracy of 88% demonstrated strong recall. Elevated difficulty to Medium to stimulate neuroplasticity."</p>
                  <p className="text-teal-400 mt-2"># 4. Domain Rotation Recommendation</p>
                  <p className="text-slate-300">Next Activity: Pattern Recognition (Executive Function)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CAREGIVER SUPPORT & NON-CLINICAL SAFETY */}
      <section id="caregiver" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Family &amp; Caregiver Portal</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
                Peace of Mind for Children &amp; Caregivers
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                Ananya Devi lives in another city but stays connected with her 72-year-old mother Kamala. NeuroSaathi sends automated milestone alerts, logs routine adherence, and flags unusual dips in cognitive focus — without clinical alarmism.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Daily routine &amp; hydration check-ins</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Weekly memory score trends</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Non-clinical anomaly notifications</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Preserves elder dignity &amp; independence</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col space-y-4">
              <button
                onClick={onStartCaregiverDemo}
                className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Open Caregiver Portal</span>
              </button>

              {/* Medical disclaimer note */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <p className="font-bold text-amber-400/90 mb-1">Non-Clinical Safety Notice:</p>
                NeuroSaathi is a cognitive assistance and wellness platform. It is not designed to diagnose dementia, Alzheimer's, or replace certified medical practitioners.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (JUDGE PREVIEW) */}
      <section id="faq" className="py-16 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">SIH Judge FAQ</span>
            <h2 className="text-3xl font-extrabold text-white font-outfit">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-2">
              <h4 className="text-base font-bold text-teal-300">Why rule-based AI instead of a deep neural network?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In geriatric healthcare, explainability and clinical safety are paramount. Rule-based adaptive algorithms are 100% transparent, auditable, and run locally without requiring costly GPUs or internet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-2">
              <h4 className="text-base font-bold text-teal-300">What happens if Wi-Fi disconnects during the demo?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                NeuroSaathi is dual-mode: it talks to the Flask REST API by default, but seamlessly falls back to local storage offline mode without interrupting the user.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-2">
              <h4 className="text-base font-bold text-teal-300">How is accessibility addressed for seniors?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Font scaling (100%-150%), High-Contrast color mode, Web Speech audio assistance, large touch targets (&gt;48px), and zero distracting advertisements or clutter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-2">
              <h4 className="text-base font-bold text-teal-300">Does NeuroSaathi diagnose medical diseases?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No. We explicitly disclaim diagnostic authority. NeuroSaathi is a cognitive wellness, memory exercise, and daily routine assistance companion.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">NeuroSaathi</p>
              <p className="text-[11px] text-teal-400">Smart India Hackathon (SIH 2026) Prototype</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <button onClick={onStartElderlyDemo} className="hover:text-teal-400 transition-colors">Elderly Dashboard</button>
            <button onClick={onStartCaregiverDemo} className="hover:text-teal-400 transition-colors">Caregiver Portal</button>
            <button onClick={onOpenAuthModal} className="hover:text-teal-400 transition-colors">Demo Login</button>
          </div>

          <p className="text-slate-400 text-center md:text-right">
            Designed with empathy for India's seniors.
          </p>
        </div>
      </footer>

    </div>
  );
};
