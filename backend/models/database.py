"""
NeuroSaathi - Database & Storage Layer
SQLite + Firebase/Firestore-compatible JSON schema with automated demo data seeding.
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "neurosaathi.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL, -- 'patient', 'caregiver', 'doctor', 'admin'
        age INTEGER,
        gender TEXT,
        location TEXT,
        primary_language TEXT DEFAULT 'en',
        current_difficulty TEXT DEFAULT 'Easy',
        streak_days INTEGER DEFAULT 5,
        memory_score INTEGER DEFAULT 78,
        caregiver_id TEXT,
        created_at TEXT
    )
    """)

    # Game Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        game_title TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        score INTEGER NOT NULL,
        accuracy REAL NOT NULL,
        response_time REAL,
        mistakes INTEGER DEFAULT 0,
        ai_recommendation TEXT,
        ai_rationale TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    # Routines & Reminders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        category TEXT DEFAULT 'medication', -- 'medication', 'hydration', 'activity', 'meal'
        date TEXT NOT NULL
    )
    """)

    # Caregiver Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        caregiver_id TEXT NOT NULL,
        type TEXT NOT NULL, -- 'cognitive_drop', 'missed_routine', 'streak_milestone', 'positive_trend'
        severity TEXT DEFAULT 'normal', -- 'info', 'normal', 'warning'
        message TEXT NOT NULL,
        acknowledged INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed demo data if users table is empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    count = cursor.fetchone()["count"]

    if count == 0:
        seed_demo_data(cursor, conn)

    conn.close()

def seed_demo_data(cursor, conn):
    today = datetime.now().strftime("%Y-%m-%d")
    now_iso = datetime.now().isoformat()

    # 1. Seed Demo Elderly User: Kamala Devi
    cursor.execute("""
    INSERT INTO users (id, name, role, age, gender, location, primary_language, current_difficulty, streak_days, memory_score, caregiver_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "kamala_devi",
        "Kamala Devi",
        "patient",
        72,
        "Female",
        "Guwahati, Assam",
        "en",
        "Easy",
        5,
        78,
        "ananya_devi",
        now_iso
    ))

    # 2. Seed Demo Caregiver: Ananya Devi
    cursor.execute("""
    INSERT INTO users (id, name, role, age, gender, location, primary_language, current_difficulty, streak_days, memory_score, caregiver_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "ananya_devi",
        "Ananya Devi",
        "caregiver",
        42,
        "Female",
        "Guwahati, Assam",
        "en",
        "Easy",
        0,
        0,
        None,
        now_iso
    ))

    # 3. Seed Past 7 Days of Game Sessions
    sample_games = [
        ("memory_match", "Memory Match", "Easy", 85, 85.0, 42.5, 1, "Increase to Medium", "Consistent high recall accuracy", -6),
        ("pattern_recognition", "Pattern Recognition", "Easy", 75, 75.0, 50.0, 2, "Maintain Easy", "Good pattern matching with steady pacing", -5),
        ("attention_game", "Attention Focus", "Easy", 80, 80.0, 38.0, 1, "Maintain Easy", "Quick visual reflexes maintained", -4),
        ("object_recognition", "Object Recall", "Easy", 90, 90.0, 35.0, 0, "Increase to Medium", "Flawless item identification", -3),
        ("routine_recall", "Routine Recall", "Medium", 80, 80.0, 45.0, 1, "Maintain Medium", "Demonstrated solid temporal recall", -2),
        ("memory_match", "Memory Match", "Medium", 70, 70.0, 48.0, 2, "Maintain Medium", "Steady retention at Medium level", -1),
    ]

    for gid, title, diff, sc, acc, rt, mist, rec, rat, day_offset in sample_games:
        ts = (datetime.now() + timedelta(days=day_offset)).strftime("%Y-%m-%d 10:30:00")
        cursor.execute("""
        INSERT INTO game_sessions (user_id, game_id, game_title, difficulty, score, accuracy, response_time, mistakes, ai_recommendation, ai_rationale, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ("kamala_devi", gid, title, diff, sc, acc, rt, mist, rec, rat, ts))

    # 4. Seed Today's Routines
    routines = [
        ("Morning Blood Pressure Check", "08:00 AM", 1, "medication"),
        ("Morning Hydration & Green Tea", "09:00 AM", 1, "hydration"),
        ("Daily Cognitive Activity: Memory Match", "10:30 AM", 1, "activity"),
        ("Post-Lunch Heart Medication", "01:30 PM", 0, "medication"),
        ("Evening Garden Walk & Social Chat", "05:00 PM", 0, "activity"),
        ("Night Calcium Supplement", "09:00 PM", 0, "medication"),
    ]

    for title, slot, done, cat in routines:
        cursor.execute("""
        INSERT INTO routines (user_id, title, time_slot, completed, category, date)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("kamala_devi", title, slot, done, cat, today))

    # 5. Seed Caregiver Alerts
    cursor.execute("""
    INSERT INTO alerts (user_id, caregiver_id, type, severity, message, acknowledged, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "kamala_devi",
        "ananya_devi",
        "streak_milestone",
        "info",
        "Kamala Devi achieved a 5-day continuous cognitive activity streak!",
        0,
        now_iso
    ))

    cursor.execute("""
    INSERT INTO alerts (user_id, caregiver_id, type, severity, message, acknowledged, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "kamala_devi",
        "ananya_devi",
        "positive_trend",
        "normal",
        "Memory Match recall accuracy improved by +12% over the last 7 sessions.",
        0,
        now_iso
    ))

    conn.commit()

# Ensure database is initialized on import
init_db()
