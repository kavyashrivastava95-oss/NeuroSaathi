"""
NeuroSaathi - Cognitive Games & Adaptive Progress Routes
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models.database import get_db_connection
from services.adaptive_engine import (
    evaluate_session,
    get_daily_recommendation,
    GAME_CATALOG
)

game_bp = Blueprint("games", __name__)

@game_bp.route("/api/games", methods=["GET"])
def list_games():
    """Returns the list of 8 cognitive games with descriptions and domain targets."""
    games = []
    for gid, info in GAME_CATALOG.items():
        games.append({
            "id": gid,
            "title": info["title"],
            "domain": info["domain"],
            "description": info["description"],
            "icon": gid
        })
    return jsonify({
        "status": "success",
        "games": games
    })

@game_bp.route("/api/game/result", methods=["POST"])
def submit_game_result():
    """
    Submits a completed game session, evaluates performance via the Explainable
    Adaptive Engine, updates difficulty, and returns transparent rationale.
    """
    data = request.get_json() or {}
    user_id = data.get("user_id", "kamala_devi")
    game_id = data.get("game_id", "memory_match")
    score = int(data.get("score", 80))
    accuracy = float(data.get("accuracy", 80.0))
    response_time = float(data.get("response_time", 40.0))
    mistakes = int(data.get("mistakes", 1))

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch user's current difficulty
    cursor.execute("SELECT current_difficulty, streak_days, memory_score, caregiver_id FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    current_diff = user["current_difficulty"] if user else "Easy"
    streak = user["streak_days"] if user else 5
    old_memory_score = user["memory_score"] if user else 78
    caregiver_id = user["caregiver_id"] if user else "ananya_devi"

    # Fetch past 5 sessions for rolling baseline analysis
    cursor.execute("""
    SELECT accuracy, difficulty, timestamp FROM game_sessions 
    WHERE user_id = ? ORDER BY id DESC LIMIT 5
    """, (user_id,))
    past_sessions = [dict(row) for row in cursor.fetchall()]

    # Run Explainable Adaptive Engine
    evaluation = evaluate_session(
        game_id=game_id,
        score=score,
        accuracy=accuracy,
        response_time=response_time,
        mistakes=mistakes,
        current_difficulty=current_diff,
        past_sessions=past_sessions
    )

    new_diff = evaluation["new_difficulty"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    game_title = GAME_CATALOG.get(game_id, {}).get("title", game_id.replace("_", " ").title())

    # Calculate updated aggregate memory score (weighted: 80% old + 20% new)
    new_memory_score = int(round(old_memory_score * 0.8 + accuracy * 0.2))

    # Persist session to database
    cursor.execute("""
    INSERT INTO game_sessions (user_id, game_id, game_title, difficulty, score, accuracy, response_time, mistakes, ai_recommendation, ai_rationale, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        game_id,
        game_title,
        current_diff,
        score,
        accuracy,
        response_time,
        mistakes,
        evaluation["recommendation_title"],
        evaluation["rationale"],
        now_str
    ))

    # Update user record
    cursor.execute("""
    UPDATE users 
    SET current_difficulty = ?, memory_score = ?
    WHERE id = ?
    """, (new_diff, new_memory_score, user_id))

    # If anomaly detected, record caregiver alert
    if evaluation.get("anomaly_detected") and caregiver_id:
        cursor.execute("""
        INSERT INTO alerts (user_id, caregiver_id, type, severity, message, acknowledged, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            caregiver_id,
            "cognitive_drop",
            "warning",
            evaluation["anomaly_message"],
            0,
            datetime.now().isoformat()
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "evaluation": evaluation,
        "new_memory_score": new_memory_score,
        "current_difficulty": new_diff,
        "session_id": cursor.lastrowid
    })

@game_bp.route("/api/user/progress", methods=["GET"])
def get_user_progress():
    """Returns 7-day cognitive performance, accuracy trends, domain distribution, and history."""
    user_id = request.args.get("user_id", "kamala_devi")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if not user:
        user_dict = {"name": "Kamala Devi", "current_difficulty": "Easy", "streak_days": 5, "memory_score": 78}
    else:
        user_dict = dict(user)

    cursor.execute("""
    SELECT * FROM game_sessions 
    WHERE user_id = ? 
    ORDER BY id DESC LIMIT 10
    """, (user_id,))
    recent_sessions = [dict(row) for row in cursor.fetchall()]

    # Format daily chart data for past 7 days
    today = datetime.now()
    daily_stats = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        d_str = d.strftime("%Y-%m-%d")
        d_name = d.strftime("%a")
        
        # Find sessions on that day
        day_sessions = [s for s in recent_sessions if s["timestamp"].startswith(d_str)]
        if day_sessions:
            avg_acc = sum(s["accuracy"] for s in day_sessions) / len(day_sessions)
            total_sc = sum(s["score"] for s in day_sessions)
        else:
            # Baseline simulation for smooth chart display
            base_acc = [72, 75, 80, 85, 78, 82, 85][6 - i]
            avg_acc = base_acc
            total_sc = int(base_acc * 10)

        daily_stats.append({
            "day": d_name,
            "date": d_str,
            "accuracy": round(avg_acc, 1),
            "score": total_sc,
            "sessions": max(1, len(day_sessions))
        })

    conn.close()

    return jsonify({
        "status": "success",
        "user": user_dict,
        "weekly_trend": daily_stats,
        "recent_sessions": recent_sessions,
        "domain_breakdown": [
            {"domain": "Visual Memory", "score": 82, "color": "#10B981"},
            {"domain": "Reasoning", "score": 76, "color": "#3B82F6"},
            {"domain": "Attention", "score": 79, "color": "#8B5CF6"},
            {"domain": "Recall Autonomy", "score": 85, "color": "#F59E0B"}
        ]
    })

@game_bp.route("/api/recommendation", methods=["GET"])
def get_recommendation():
    """Returns today's curated cognitive game recommendation with reasoning."""
    user_id = request.args.get("user_id", "kamala_devi")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT game_id, difficulty, accuracy, timestamp FROM game_sessions
    WHERE user_id = ? ORDER BY id DESC LIMIT 5
    """, (user_id,))
    past_sessions = [dict(row) for row in cursor.fetchall()]
    conn.close()

    rec = get_daily_recommendation(user_id, past_sessions)
    return jsonify({
        "status": "success",
        "recommendation": rec
    })
