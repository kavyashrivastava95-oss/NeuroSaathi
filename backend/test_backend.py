"""
NeuroSaathi - Comprehensive Backend Automated Test Suite
Tests all REST endpoints, Explainable Adaptive Engine, database transactions,
caregiver routes, healthcare notes, and voice NLU.
"""

import os
import sys
import unittest
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models.database import init_db, get_db_connection

class NeuroSaathiBackendTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_health_check(self):
        """Verify /api/health responds with healthy status"""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["app"], "NeuroSaathi")

    def test_02_auth_login(self):
        """Verify login for patient, caregiver, and doctor"""
        for role, expected_id in [("patient", "kamala_devi"), ("caregiver", "ananya_devi"), ("doctor", "dr_barua")]:
            res = self.client.post("/api/login", json={"role": role})
            self.assertEqual(res.status_code, 200)
            data = json.loads(res.data)
            self.assertEqual(data["status"], "success")
            self.assertEqual(data["user"]["id"], expected_id)

    def test_03_games_list(self):
        """Verify list of 8 cognitive games"""
        res = self.client.get("/api/games")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(len(data["games"]), 8)

    def test_04_game_result_submission(self):
        """Verify game submission and Explainable Adaptive AI evaluation"""
        payload = {
            "user_id": "kamala_devi",
            "game_id": "memory_match",
            "score": 90,
            "accuracy": 92.0,
            "response_time": 28.5,
            "mistakes": 1
        }
        res = self.client.post("/api/game/result", json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "success")
        self.assertIn("evaluation", data)
        self.assertIn("rationale", data["evaluation"])
        self.assertIn("new_difficulty", data["evaluation"])

    def test_05_caregiver_dashboard(self):
        """Verify caregiver monitoring data, routine adherence, and alerts"""
        res = self.client.get("/api/caregiver/dashboard?caregiver_id=ananya_devi")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["patient"]["id"], "kamala_devi")
        self.assertIn("adherence_rate", data)
        self.assertTrue(len(data["routines"]) > 0)

    def test_06_routine_toggle(self):
        """Verify toggling routine completion"""
        # Get first routine id
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, completed FROM routines LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(row)

        r_id = row["id"]
        original = row["completed"]

        res = self.client.post("/api/caregiver/routines/toggle", json={"routine_id": r_id})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["completed"], 0 if original == 1 else 1)

        # Toggle back to original
        self.client.post("/api/caregiver/routines/toggle", json={"routine_id": r_id})

    def test_07_routine_add(self):
        """Verify caregiver can add a new routine"""
        payload = {
            "user_id": "kamala_devi",
            "title": "Evening Chamomile Tea & Relaxation",
            "time_slot": "07:30 PM",
            "category": "hydration"
        }
        res = self.client.post("/api/caregiver/routines/add", json=payload)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["routine"]["title"], payload["title"])

    def test_08_alert_acknowledgment(self):
        """Verify acknowledging an alert"""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM alerts LIMIT 1")
        row = cursor.fetchone()
        conn.close()

        if row:
            res = self.client.post("/api/caregiver/alert/ack", json={"alert_id": row["id"]})
            self.assertEqual(res.status_code, 200)
            data = json.loads(res.data)
            self.assertEqual(data["status"], "success")

    def test_09_healthcare_routes(self):
        """Verify healthcare patient list and clinical notes persistence"""
        # 1. Get patients
        res = self.client.get("/api/healthcare/patients")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(len(data["patients"]) >= 1)

        # 2. Add clinical note
        note_text = "Routine compliance verified. Patient shows strong engagement."
        res2 = self.client.post("/api/healthcare/notes", json={
            "patient_id": "kamala_devi",
            "doctor_id": "dr_barua",
            "doctor_name": "Dr. Biren Barua",
            "note": note_text
        })
        self.assertEqual(res2.status_code, 201)

        # 3. Get clinical notes
        res3 = self.client.get("/api/healthcare/notes?patient_id=kamala_devi")
        self.assertEqual(res3.status_code, 200)
        data3 = json.loads(res3.data)
        self.assertTrue(any(n["note"] == note_text for n in data3["notes"]))

    def test_10_voice_intent_processing(self):
        """Verify voice NLU in English, Hindi, and Assamese"""
        cases = [
            ("Start my daily game", "en", "start_game"),
            ("दवाई का समय क्या है", "hi", "routine"),
            ("আজিৰ খেল আৰম্ভ কৰক", "as", "start_game")
        ]
        for query, lang, expected_intent in cases:
            res = self.client.post("/api/voice", json={"text": query, "language": lang})
            self.assertEqual(res.status_code, 200)
            data = json.loads(res.data)
            self.assertEqual(data["status"], "success")
            self.assertEqual(data["intent"], expected_intent)

if __name__ == "__main__":
    unittest.main()
