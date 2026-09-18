"""
NeuroSaathi - Production Multi-Threaded WSGI Server
Runs Flask using Waitress (compatible with Windows, macOS, and Linux).
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.database import init_db
from app import create_app

if __name__ == "__main__":
    init_db()
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")

    try:
        from waitress import serve
        print("=" * 65)
        print("  NEUROSAATHI PRODUCTION WSGI SERVER (Waitress)")
        print(f"  Serving on http://{host}:{port} (Threads: 6)")
        print("  Single-port full-stack: REST API + React SPA")
        print("=" * 65)
        serve(app, host=host, port=port, threads=6)
    except ImportError:
        print("=" * 65)
        print("  Waitress not found. Falling back to standard Flask runner.")
        print(f"  Serving on http://{host}:{port}")
        print("=" * 65)
        app.run(host=host, port=port, debug=False)
