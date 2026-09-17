"""
NeuroSaathi - Explainable AI Adaptive Cognitive Engine
Transparent, rule-based neuro-adaptive engine that personalizes activity difficulty,
tracks cognitive fatigue/engagement, and provides explainable rationale for judges and users.
"""

from typing import Dict, Any, List, Optional

DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"]

GAME_CATALOG = {
    "memory_match": {
        "title": "Memory Match",
        "domain": "Visual & Short-Term Memory",
        "description": "Pair matching cards to stimulate working memory and recall speed."
    },
    "pattern_recognition": {
        "title": "Pattern Recognition",
        "domain": "Executive Function & Reasoning",
        "description": "Identify logical sequence continuations to exercise problem solving."
    },
    "attention_game": {
        "title": "Attention Focus",
        "domain": "Sustained Attention & Reflexes",
        "description": "Track and respond to visual cues to strengthen active focus."
    },
    "object_recognition": {
        "title": "Object Recall",
        "domain": "Semantic Memory & Identification",
        "description": "Identify everyday cultural objects and everyday utilities."
    },
    "routine_recall": {
        "title": "Routine Recall",
        "domain": "Episodic Memory & Daily Autonomy",
        "description": "Recall medication times, daily habits, and familiar life schedules."
    },
    "emotion_recognition": {
        "title": "Expression Connect",
        "domain": "Social-Emotional Cognition",
        "description": "Recognize friendly facial emotions to maintain empathetic connection."
    },
    "sequence_game": {
        "title": "Sequence Master",
        "domain": "Working Memory & Ordering",
        "description": "Repeat progressive sequences of shapes, colors, and sounds."
    },
    "remember_objects": {
        "title": "Memory Tray",
        "domain": "Delayed Recall & Spatial Memory",
        "description": "Memorize items on a virtual tray and recall missing items."
    }
}

def evaluate_session(
    game_id: str,
    score: int,
    accuracy: float,
    response_time: float,
    mistakes: int,
    current_difficulty: str = "Easy",
    past_sessions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Evaluates player performance with explicit, verifiable rules.
    Outputs:
      - new_difficulty: 'Easy' | 'Medium' | 'Hard'
      - difficulty_changed: bool
      - adjustment_type: 'promoted' | 'maintained' | 'relaxed'
      - confidence_score: float (0.0 to 1.0)
      - rationale: human-readable explainable rationale
      - recommended_next_game: game_id string
      - recommendation_title: game name
      - recommendation_reason: why this activity was chosen
      - anomaly_detected: bool (for caregiver alert flag)
      - anomaly_message: str
    """
    if current_difficulty not in DIFFICULTY_LEVELS:
        current_difficulty = "Easy"
    
    current_idx = DIFFICULTY_LEVELS.index(current_difficulty)
    new_difficulty = current_difficulty
    adjustment_type = "maintained"
    confidence = 0.75
    rationale = ""

    # Rule 1: High Accuracy & Low Mistakes -> Promote Difficulty
    if accuracy >= 80.0 and mistakes <= 2:
        if current_idx < len(DIFFICULTY_LEVELS) - 1:
            new_difficulty = DIFFICULTY_LEVELS[current_idx + 1]
            adjustment_type = "promoted"
            confidence = 0.88
            rationale = (
                f"Outstanding recall accuracy ({accuracy:.0f}%) with only {mistakes} mistake(s). "
                f"Elevated difficulty from {current_difficulty} to {new_difficulty} to foster active neuroplasticity."
            )
        else:
            adjustment_type = "maintained"
            confidence = 0.95
            rationale = (
                f"Mastery demonstrated at maximum difficulty ({current_difficulty}) with {accuracy:.0f}% accuracy! "
                f"Difficulty maintained to reinforce neural pathways."
            )

    # Rule 2: Struggling Score or Excessive Mistakes -> Relax Difficulty
    elif accuracy < 50.0 or mistakes >= 5:
        if current_idx > 0:
            new_difficulty = DIFFICULTY_LEVELS[current_idx - 1]
            adjustment_type = "relaxed"
            confidence = 0.82
            rationale = (
                f"Performance indicates potential fatigue ({accuracy:.0f}% accuracy, {mistakes} mistakes). "
                f"Gently adjusted difficulty from {current_difficulty} to {new_difficulty} to reduce cognitive strain and prevent frustration."
            )
        else:
            adjustment_type = "maintained"
            confidence = 0.78
            rationale = (
                f"Supported pacing maintained at {current_difficulty} level to ensure comfortable, low-stress practice."
            )

    # Rule 3: Steady Range -> Maintain Difficulty
    else:
        adjustment_type = "maintained"
        confidence = 0.80
        rationale = (
            f"Consistent performance ({accuracy:.0f}% accuracy, response time {response_time:.1f}s). "
            f"Difficulty maintained at {current_difficulty} for consolidation."
        )

    # Recommendation Logic: Cognitive Domain Rotation
    # Rotate between Visual Memory, Pattern Reasoning, and Attention to prevent fatigue
    domain_transitions = {
        "memory_match": "pattern_recognition",
        "pattern_recognition": "attention_game",
        "attention_game": "object_recognition",
        "object_recognition": "routine_recall",
        "routine_recall": "memory_match",
        "emotion_recognition": "memory_match",
        "sequence_game": "remember_objects",
        "remember_objects": "pattern_recognition"
    }

    next_game_id = domain_transitions.get(game_id, "memory_match")
    next_game_info = GAME_CATALOG.get(next_game_id, GAME_CATALOG["memory_match"])

    # Anomaly Detection for Caregiver Oversight (Rolling baseline comparison)
    anomaly_detected = False
    anomaly_message = ""

    if past_sessions and len(past_sessions) >= 3:
        avg_acc = sum(s.get("accuracy", 75.0) for s in past_sessions[:5]) / min(len(past_sessions), 5)
        # Drop of more than 25% points from rolling average indicates noticeable cognitive variation
        if (avg_acc - accuracy) >= 25.0:
            anomaly_detected = True
            anomaly_message = (
                f"Session accuracy ({accuracy:.0f}%) dropped {avg_acc - accuracy:.1f}% below 5-day baseline ({avg_acc:.0f}%). "
                f"May indicate mild physical fatigue, poor sleep, or dehydration."
            )

    return {
        "game_id": game_id,
        "score": score,
        "accuracy": accuracy,
        "response_time": response_time,
        "mistakes": mistakes,
        "previous_difficulty": current_difficulty,
        "new_difficulty": new_difficulty,
        "difficulty_changed": new_difficulty != current_difficulty,
        "adjustment_type": adjustment_type,
        "confidence": confidence,
        "rationale": rationale,
        "recommended_next_game": next_game_id,
        "recommendation_title": next_game_info["title"],
        "recommendation_domain": next_game_info["domain"],
        "recommendation_reason": f"Exercises {next_game_info['domain']} following {GAME_CATALOG.get(game_id, {}).get('title', 'previous activity')}.",
        "anomaly_detected": anomaly_detected,
        "anomaly_message": anomaly_message
    }

def get_daily_recommendation(user_id: str, past_sessions: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """Returns today's curated cognitive game recommendation with reasoning."""
    if not past_sessions or len(past_sessions) == 0:
        return {
            "game_id": "memory_match",
            "title": "Memory Match",
            "domain": "Visual & Working Memory",
            "difficulty": "Easy",
            "estimated_time": "3-5 mins",
            "reason": "Perfect gentle morning activity to awaken visual memory and spatial recall."
        }
    
    last_game = past_sessions[0].get("game_id", "memory_match")
    last_diff = past_sessions[0].get("difficulty", "Easy")
    
    # Alternate to complementary domain
    if last_game in ["memory_match", "remember_objects"]:
        next_gid = "pattern_recognition"
    elif last_game in ["pattern_recognition", "sequence_game"]:
        next_gid = "attention_game"
    else:
        next_gid = "memory_match"

    info = GAME_CATALOG.get(next_gid, GAME_CATALOG["memory_match"])
    return {
        "game_id": next_gid,
        "title": info["title"],
        "domain": info["domain"],
        "difficulty": last_diff,
        "estimated_time": "4-5 mins",
        "reason": f"Designed to stimulate {info['domain']} while building upon your current streak."
    }
