"""
NeuroSaathi - Healthcare Professional & Clinical Follow-up Routes
Provides assigned patient tracking, longitudinal history, and persistent clinical notes.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from models.database import get_db_connection

healthcare_bp = Blueprint("healthcare", __name__)

@healthcare_bp.route("/api/healthcare/patients", methods=["GET"])
def get_patients():
    """Returns directory of assigned patients with longitudinal summaries."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, name, age, location, current_difficulty, streak_days, memory_score, primary_language
    FROM users WHERE role = 'patient'
    """)
    rows = cursor.fetchall()
    patients = []
    
    for row in rows:
        p = dict(row)
        # Fetch adherence rate from routines
        cursor.execute("SELECT COUNT(*) as total, SUM(completed) as completed FROM routines WHERE user_id = ?", (p["id"],))
        stats = cursor.fetchone()
        tot = stats["total"] or 0
        comp = stats["completed"] or 0
        adherence_pct = round((comp / tot * 100) if tot > 0 else 85)
        
        patients.append({
            "id": p["id"],
            "name": p["name"],
            "age": p["age"],
            "region": p["location"].split(",")[-1].strip() if "," in p["location"] else p["location"],
            "difficulty": p["current_difficulty"],
            "trend": "Stable" if p["memory_score"] >= 70 else "Needs Review",
            "adherence": f"{adherence_pct}%",
            "memory_score": p["memory_score"],
            "lastActive": "Today"
        })

    conn.close()
    return jsonify({
        "status": "success",
        "patients": patients
    })

@healthcare_bp.route("/api/healthcare/notes", methods=["GET"])
def get_notes():
    """Returns clinical notes for a given patient."""
    patient_id = request.args.get("patient_id", "kamala_devi")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM clinical_notes 
    WHERE patient_id = ? 
    ORDER BY id DESC
    """, (patient_id,))
    rows = cursor.fetchall()
    notes = [dict(r) for r in rows]
    conn.close()

    return jsonify({
        "status": "success",
        "patient_id": patient_id,
        "notes": notes
    })

@healthcare_bp.route("/api/healthcare/notes", methods=["POST"])
def add_note():
    """Adds a new clinical observation or doctor note for a patient."""
    data = request.get_json() or {}
    patient_id = data.get("patient_id", "kamala_devi")
    doctor_id = data.get("doctor_id", "dr_barua")
    doctor_name = data.get("doctor_name", "Dr. Biren Barua")
    note = (data.get("note") or "").strip()

    if not note:
        return jsonify({"status": "error", "message": "Note content cannot be empty"}), 400

    now_iso = datetime.now().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO clinical_notes (patient_id, doctor_id, doctor_name, note, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (patient_id, doctor_id, doctor_name, note, now_iso))
    note_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Clinical note saved successfully",
        "note": {
            "id": note_id,
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "doctor_name": doctor_name,
            "note": note,
            "created_at": now_iso
        }
    }), 201
