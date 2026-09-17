"""
NeuroSaathi - Authentication & User Profile Routes
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.database import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    role = data.get("role", "patient")
    user_id = data.get("user_id", "")

    # Handle demo logins
    if not user_id:
        if role == "patient":
            user_id = "kamala_devi"
        elif role == "caregiver":
            user_id = "ananya_devi"
        elif role == "doctor":
            user_id = "dr_barua"
        else:
            user_id = "admin"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        # Auto-create if not exists for quick hackathon flexibility
        now_iso = datetime.now().isoformat()
        name = "Kamala Devi" if role == "patient" else ("Ananya Devi" if role == "caregiver" else "Staff User")
        cursor.execute("""
        INSERT INTO users (id, name, role, age, gender, location, primary_language, current_difficulty, streak_days, memory_score, caregiver_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, role, 72 if role == "patient" else 42, "Female", "Guwahati, Assam", "en", "Easy", 5, 78, "ananya_devi" if role == "patient" else None, now_iso))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()

    user_dict = dict(user)
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Logged in as {user_dict['name']}",
        "user": user_dict,
        "token": f"demo-token-{user_id}"
    })

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "New User")
    role = data.get("role", "patient")
    user_id = name.lower().replace(" ", "_")
    age = data.get("age", 70)
    location = data.get("location", "Guwahati, Assam")
    lang = data.get("language", "en")

    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()

    cursor.execute("""
    INSERT OR REPLACE INTO users (id, name, role, age, gender, location, primary_language, current_difficulty, streak_days, memory_score, caregiver_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, name, role, age, data.get("gender", "Female"), location, lang, "Easy", 1, 70, None, now_iso))
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    user_dict = dict(user)
    conn.close()

    return jsonify({
        "status": "success",
        "message": "User registered successfully",
        "user": user_dict
    }), 201

@auth_bp.route("/api/user/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id", "kamala_devi")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify({
        "status": "success",
        "user": dict(user)
    })
