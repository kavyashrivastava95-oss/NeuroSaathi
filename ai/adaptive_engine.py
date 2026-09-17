"""
NeuroSaathi - AI Engine Module
Exposes the explainable rule-based adaptive engine at the top-level ai/ path for SIH presentation clarity.
"""

import os
import sys

# Ensure backend path is available
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from services.adaptive_engine import (
    evaluate_session,
    get_daily_recommendation,
    GAME_CATALOG,
    DIFFICULTY_LEVELS
)

__all__ = [
    "evaluate_session",
    "get_daily_recommendation",
    "GAME_CATALOG",
    "DIFFICULTY_LEVELS"
]
