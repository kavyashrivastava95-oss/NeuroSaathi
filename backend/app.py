"""
NeuroSaathi - Main Flask Application Entry Point
Smart India Hackathon (SIH 2026) Prototype Backend
"""

import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.database import init_db
from routes.auth_routes import auth_bp
from routes.game_routes import game_bp
from routes.caregiver_routes import caregiver_bp
from routes.voice_routes import voice_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for Vite dev server and local static clients
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(caregiver_bp)
    app.register_blueprint(voice_bp)

    @app.route("/")
    def index():
        return jsonify({
            "project": "NeuroSaathi",
            "tagline": "Your Companion for a Healthier Mind",
            "status": "online",
            "version": "1.0.0",
            "endpoints": [
                "/api/health",
                "/api/login",
                "/api/games",
                "/api/game/result",
                "/api/user/progress",
                "/api/caregiver/dashboard",
                "/api/recommendation",
                "/api/voice"
            ]
        })

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "app": "NeuroSaathi",
            "database": "SQLite (Firebase-compatible JSON Schema)",
            "ai_engine": "Explainable Rule-Based Cognitive Adaptive Engine",
            "cors": "enabled"
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"status": "error", "message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"status": "error", "message": "Internal server error"}), 500

    return app

if __name__ == "__main__":
    # Ensure database is prepared
    init_db()
    app = create_app()
    print("=" * 60)
    print("  NEUROSAATHI BACKEND (SIH 2026 PROTOTYPE)")
    print("  Server running on http://127.0.0.1:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=False)
