"""
NeuroSaathi - Main Flask Application Entry Point
Smart India Hackathon (SIH 2026) Prototype Backend & Production Server
"""

import os
import sys
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.database import init_db
from routes.auth_routes import auth_bp
from routes.game_routes import game_bp
from routes.caregiver_routes import caregiver_bp
from routes.voice_routes import voice_bp
from routes.healthcare_routes import healthcare_bp

def create_app():
    # Detect frontend build directory for production single-port deployment
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "web", "dist"))
    if not os.path.exists(dist_dir):
        # Fallback for container deployments where dist might be in ./web/dist
        dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "web", "dist"))

    static_folder = dist_dir if os.path.exists(dist_dir) else None
    app = Flask(__name__, static_folder=static_folder)
    
    # Enable CORS for Vite dev server and local clients
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(caregiver_bp)
    app.register_blueprint(voice_bp)
    app.register_blueprint(healthcare_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "app": "NeuroSaathi",
            "database": "SQLite (Firebase-compatible JSON Schema)",
            "ai_engine": "Explainable Rule-Based Cognitive Adaptive Engine",
            "cors": "enabled",
            "production_static": bool(static_folder and os.path.exists(static_folder))
        })

    # Serve built React frontend if available in production
    if static_folder and os.path.exists(static_folder):
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            if path.startswith("api/"):
                return jsonify({"status": "error", "message": "Endpoint not found"}), 404
            file_path = os.path.join(static_folder, path)
            if path != "" and os.path.exists(file_path):
                return send_from_directory(static_folder, path)
            return send_from_directory(static_folder, "index.html")
    else:
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
                    "/api/healthcare/patients",
                    "/api/healthcare/notes",
                    "/api/recommendation",
                    "/api/voice"
                ]
            })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"status": "error", "message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"status": "error", "message": "Internal server error"}), 500

    return app

if __name__ == "__main__":
    init_db()
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print("  NEUROSAATHI BACKEND (SIH 2026 PROTOTYPE)")
    print(f"  Server running on http://127.0.0.1:{port}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=False)
