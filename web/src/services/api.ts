/**
 * NeuroSaathi - Unified Dual-Mode API Service
 * 
 * Communicates with the live Flask backend at http://127.0.0.1:5000.
 * In convention center hackathon settings where Wi-Fi or backend may be offline,
 * it automatically falls back to an offline-safe local simulator, guaranteeing
 * zero crashes and 100% demo uptime.
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Fallback Local Mock Store Keys
const STORAGE_USER_KEY = 'neurosaathi_user';
const STORAGE_SESSIONS_KEY = 'neurosaathi_sessions';
const STORAGE_ROUTINES_KEY = 'neurosaathi_routines';
const STORAGE_ALERTS_KEY = 'neurosaathi_alerts';

export interface GameResultPayload {
  user_id: string;
  game_id: string;
  score: number;
  accuracy: number;
  response_time: number;
  mistakes: number;
}

export interface AdaptiveEvaluation {
  game_id: string;
  score: number;
  accuracy: number;
  response_time: number;
  mistakes: number;
  previous_difficulty: 'Easy' | 'Medium' | 'Hard';
  new_difficulty: 'Easy' | 'Medium' | 'Hard';
  difficulty_changed: boolean;
  adjustment_type: 'promoted' | 'maintained' | 'relaxed';
  confidence: number;
  rationale: string;
  recommended_next_game: string;
  recommendation_title: string;
  recommendation_domain: string;
  recommendation_reason: string;
  anomaly_detected: boolean;
  anomaly_message: string;
}

export interface GameResultResponse {
  status: string;
  evaluation: AdaptiveEvaluation;
  new_memory_score: number;
  current_difficulty: 'Easy' | 'Medium' | 'Hard';
  is_offline_fallback?: boolean;
}

export interface CaregiverDashboardData {
  patient: {
    id: string;
    name: string;
    age: number;
    location: string;
    current_difficulty: 'Easy' | 'Medium' | 'Hard';
    streak_days: number;
    memory_score: number;
  };
  caregiver: {
    id: string;
    name: string;
    relation: string;
  };
  adherence_rate: number;
  routines: Array<{
    id: number;
    title: string;
    time_slot: string;
    completed: number;
    category: string;
  }>;
  recent_sessions: Array<{
    id: number;
    game_title: string;
    difficulty: string;
    score: number;
    accuracy: number;
    timestamp: string;
  }>;
  alerts: Array<{
    id: number;
    type: string;
    severity: string;
    message: string;
    acknowledged: number;
    created_at: string;
  }>;
  cognitive_summary: {
    weekly_status: string;
    engagement_streak: string;
    current_difficulty: string;
    status_indicator: string;
  };
  is_offline_fallback?: boolean;
}

class ApiService {
  private backendAvailable: boolean = true;

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 2500): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(id);
      this.backendAvailable = true;
      return response;
    } catch (error) {
      clearTimeout(id);
      this.backendAvailable = false;
      throw error;
    }
  }

  // 1. Health Check
  async checkHealth(): Promise<{ status: string; backendOnline: boolean }> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/health`, { method: 'GET' }, 1500);
      if (res.ok) {
        const data = await res.json();
        return { status: data.status, backendOnline: true };
      }
    } catch {
      // Backend offline
    }
    return { status: 'offline-mode', backendOnline: false };
  }

  // 2. Login
  async login(role: string = 'patient', userId?: string): Promise<any> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ role, user_id: userId })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      console.warn('NeuroSaathi: Live Flask API unreachable. Utilizing demo local storage.');
    }

    // Local fallback
    const fallbackUser = {
      id: role === 'patient' ? 'kamala_devi' : 'ananya_devi',
      name: role === 'patient' ? 'Kamala Devi' : 'Ananya Devi',
      role: role,
      age: role === 'patient' ? 72 : 42,
      location: 'Guwahati, Assam',
      primary_language: 'en',
      current_difficulty: 'Easy',
      streak_days: 5,
      memory_score: 78
    };
    return { status: 'success', user: fallbackUser, is_offline_fallback: true };
  }

  // 3. Submit Game Result & Calculate Adaptive AI
  async submitGameResult(payload: GameResultPayload): Promise<GameResultResponse> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/game/result`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      console.warn('NeuroSaathi: Live backend unreachable. Computing adaptive AI via client simulator.');
    }

    // Local Adaptive Engine Fallback (Same logic as backend/services/adaptive_engine.py)
    const { accuracy, mistakes, score, response_time, game_id } = payload;
    let newDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
    let rationale = '';
    let adjustmentType: 'promoted' | 'maintained' | 'relaxed' = 'maintained';

    if (accuracy >= 80 && mistakes <= 2) {
      newDifficulty = 'Medium';
      adjustmentType = 'promoted';
      rationale = `Outstanding recall accuracy (${accuracy.toFixed(0)}%) with only ${mistakes} mistake(s). Promoted difficulty to Medium to stimulate neuroplasticity.`;
    } else if (accuracy < 50 || mistakes >= 5) {
      newDifficulty = 'Easy';
      adjustmentType = 'relaxed';
      rationale = `Performance indicates cognitive fatigue (${accuracy.toFixed(0)}% accuracy). Pacing gently adjusted to Easy to reduce stress.`;
    } else {
      newDifficulty = 'Easy';
      adjustmentType = 'maintained';
      rationale = `Steady recall demonstrated (${accuracy.toFixed(0)}% accuracy, ${response_time}s). Difficulty maintained for consolidation.`;
    }

    return {
      status: 'success',
      evaluation: {
        game_id,
        score,
        accuracy,
        response_time,
        mistakes,
        previous_difficulty: 'Easy',
        new_difficulty: newDifficulty,
        difficulty_changed: newDifficulty !== 'Easy',
        adjustment_type: adjustmentType,
        confidence: 0.88,
        rationale,
        recommended_next_game: 'pattern_recognition',
        recommendation_title: 'Pattern Recognition',
        recommendation_domain: 'Executive Function & Reasoning',
        recommendation_reason: 'Exercises logical sequence continuation after visual matching.',
        anomaly_detected: false,
        anomaly_message: ''
      },
      new_memory_score: Math.min(100, Math.round(78 * 0.8 + accuracy * 0.2)),
      current_difficulty: newDifficulty,
      is_offline_fallback: true
    };
  }

  // 4. Caregiver Dashboard
  async getCaregiverDashboard(caregiverId: string = 'ananya_devi'): Promise<CaregiverDashboardData> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/caregiver/dashboard?caregiver_id=${caregiverId}`, {
        method: 'GET'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      console.warn('NeuroSaathi: Live caregiver backend unreachable. Rendering local demo caregiver data.');
    }

    return {
      patient: {
        id: 'kamala_devi',
        name: 'Kamala Devi',
        age: 72,
        location: 'Guwahati, Assam',
        current_difficulty: 'Easy',
        streak_days: 5,
        memory_score: 78
      },
      caregiver: {
        id: 'ananya_devi',
        name: 'Ananya Devi',
        relation: 'Daughter'
      },
      adherence_rate: 83,
      routines: [
        { id: 1, title: 'Morning Blood Pressure Check', time_slot: '08:00 AM', completed: 1, category: 'medication' },
        { id: 2, title: 'Morning Hydration & Green Tea', time_slot: '09:00 AM', completed: 1, category: 'hydration' },
        { id: 3, title: 'Daily Cognitive Activity: Memory Match', time_slot: '10:30 AM', completed: 1, category: 'activity' },
        { id: 4, title: 'Post-Lunch Heart Medication', time_slot: '01:30 PM', completed: 0, category: 'medication' },
        { id: 5, title: 'Evening Walk & Social Chat', time_slot: '05:00 PM', completed: 0, category: 'activity' }
      ],
      recent_sessions: [
        { id: 1, game_title: 'Memory Match', difficulty: 'Easy', score: 85, accuracy: 85.0, timestamp: 'Today, 10:30 AM' },
        { id: 2, game_title: 'Pattern Recognition', difficulty: 'Easy', score: 75, accuracy: 75.0, timestamp: 'Yesterday' },
        { id: 3, game_title: 'Attention Focus', difficulty: 'Easy', score: 80, accuracy: 80.0, timestamp: '2 days ago' }
      ],
      alerts: [
        {
          id: 1,
          type: 'streak_milestone',
          severity: 'info',
          message: 'Kamala Devi completed 5 consecutive daily cognitive sessions!',
          acknowledged: 0,
          created_at: 'Today'
        },
        {
          id: 2,
          type: 'positive_trend',
          severity: 'normal',
          message: 'Visual memory accuracy improved +12% this week.',
          acknowledged: 0,
          created_at: 'Yesterday'
        }
      ],
      cognitive_summary: {
        weekly_status: 'Improving (+8% recall)',
        engagement_streak: '5 Days',
        current_difficulty: 'Easy',
        status_indicator: 'Active & Healthy'
      },
      is_offline_fallback: true
    };
  }

  // 5. Voice Query & Intent
  async sendVoiceQuery(text: string, language: string = 'en'): Promise<any> {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}/voice`, {
        method: 'POST',
        body: JSON.stringify({ text, language })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const t = text.toLowerCase();
    let intent = 'fallback';
    let spoken = "I heard you! You can say 'Start Game', 'Show Routine', or 'Show Score'.";

    if (t.includes('start') || t.includes('game') || t.includes('khel')) {
      intent = 'start_game';
      spoken = language === 'hi' ? 'आज का खेल शुरू किया जा रहा है।' : "Opening today's recommended cognitive game.";
    } else if (t.includes('routine') || t.includes('medicine') || t.includes('dawai') || t.includes('water')) {
      intent = 'routine';
      spoken = language === 'hi' ? 'आपकी आज की दिनचर्या यहाँ है।' : "Here is your routine for today.";
    } else if (t.includes('progress') || t.includes('score')) {
      intent = 'progress';
      spoken = language === 'hi' ? 'आपका मेमोरी स्कोर 78 है।' : "Your memory score is 78 with a 5-day streak.";
    }

    return {
      status: 'success',
      query: text,
      language,
      intent,
      spoken_response: spoken,
      action_target: intent,
      is_offline_fallback: true
    };
  }
}

export const api = new ApiService();
