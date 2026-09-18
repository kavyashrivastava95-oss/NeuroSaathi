"""
NeuroSaathi - Caregiver Monitoring & Dashboard Routes
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.database import get_db_connection

caregiver_bp = Blueprint("caregiver", __name__)

@caregiver_bp.route("/api/caregiver/dashboard", methods=["GET"])
def get_caregiver_dashboard():
    """
    Returns patient overview, cognitive trends, routine adherence, and alert flags.
    Strictly non-clinical cognitive assistance metrics.
    """
    caregiver_id = request.args.get("caregiver_id", "ananya_devi")
    conn = get_db_connection()
    cursor = conn.cursor()

    # Find linked elderly patient
    cursor.execute("SELECT * FROM users WHERE caregiver_id = ? OR id = 'kamala_devi' LIMIT 1", (caregiver_id,))
    patient = cursor.fetchone()
    if not patient:
        conn.close()
        return jsonify({"status": "error", "message": "No linked patient found"}), 404

    patient_dict = dict(patient)
    patient_id = patient_dict["id"]

    # Fetch recent game sessions
    cursor.execute("""
    SELECT * FROM game_sessions 
    WHERE user_id = ? 
    ORDER BY id DESC LIMIT 5
    """, (patient_id,))
    recent_sessions = [dict(row) for row in cursor.fetchall()]

    # Fetch today's routines
    today = datetime.now().strftime("%Y-%m-%d")
    cursor.execute("""
    SELECT * FROM routines 
    WHERE user_id = ? AND date = ?
    ORDER BY id ASC
    """, (patient_id, today))
    routines = [dict(row) for row in cursor.fetchall()]

    if not routines:
        # Fallback to general schedule and normalize date to today
        cursor.execute("""
        SELECT * FROM routines 
        WHERE user_id = ?
        ORDER BY id ASC
        """, (patient_id,))
        routines = [dict(row) for row in cursor.fetchall()]
        if routines:
            cursor.execute("UPDATE routines SET date = ? WHERE user_id = ?", (today, patient_id))
            conn.commit()

    # Calculate adherence rate
    total_routines = len(routines)
    completed_routines = sum(1 for r in routines if r["completed"] == 1)
    adherence_pct = round((completed_routines / total_routines * 100) if total_routines > 0 else 85)

    # Fetch alerts
    cursor.execute("""
    SELECT * FROM alerts 
    WHERE caregiver_id = ? 
    ORDER BY id DESC LIMIT 10
    """, (caregiver_id,))
    alerts = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify({
        "status": "success",
        "patient": patient_dict,
        "caregiver": {"id": caregiver_id, "name": "Ananya Devi", "relation": "Daughter"},
        "adherence_rate": adherence_pct,
        "routines_summary": {
            "total": total_routines,
            "completed": completed_routines,
            "pending": total_routines - completed_routines
        },
        "routines": routines,
        "recent_sessions": recent_sessions,
        "alerts": alerts,
        "cognitive_summary": {
            "weekly_status": "Improving (+8% recall)",
            "engagement_streak": f"{patient_dict.get('streak_days', 5)} Days",
            "current_difficulty": patient_dict.get("current_difficulty", "Easy"),
            "status_indicator": "Active & Healthy"
        }
    })

@caregiver_bp.route("/api/caregiver/alert/ack", methods=["POST"])
def acknowledge_alert():
    data = request.get_json() or {}
    alert_id = data.get("alert_id")

    if not alert_id:
        return jsonify({"status": "error", "message": "Missing alert_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET acknowledged = 1 WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"Alert {alert_id} acknowledged"
    })

@caregiver_bp.route("/api/caregiver/routines/toggle", methods=["POST"])
def toggle_routine():
    data = request.get_json() or {}
    routine_id = data.get("routine_id")

    if not routine_id:
        return jsonify({"status": "error", "message": "Missing routine_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT completed FROM routines WHERE id = ?", (routine_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "Routine not found"}), 404

    new_val = 0 if row["completed"] == 1 else 1
    cursor.execute("UPDATE routines SET completed = ? WHERE id = ?", (new_val, routine_id))
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "routine_id": routine_id,
        "completed": new_val
    })

@caregiver_bp.route("/api/caregiver/routines/add", methods=["POST"])
def add_routine():
    """Allows caregiver to add a new routine or reminder for patient."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "kamala_devi")
    title = (data.get("title") or "").strip()
    time_slot = (data.get("time_slot") or "12:00 PM").strip()
    category = data.get("category", "medication")

    if not title:
        return jsonify({"status": "error", "message": "Routine title is required"}), 400

    today = datetime.now().strftime("%Y-%m-%d")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO routines (user_id, title, time_slot, completed, category, date)
    VALUES (?, ?, ?, 0, ?, ?)
    """, (user_id, title, time_slot, category, today))
    routine_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Routine created successfully",
        "routine": {
            "id": routine_id,
            "user_id": user_id,
            "title": title,
            "time_slot": time_slot,
            "completed": 0,
            "category": category,
            "date": today
        }
    }), 201

