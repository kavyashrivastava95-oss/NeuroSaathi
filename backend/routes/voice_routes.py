"""
NeuroSaathi - Voice Intent & Multilingual Speech Processing Routes
Supports browser Web Speech API queries with responses in English, Hindi, and Assamese.
"""

from flask import Blueprint, request, jsonify

voice_bp = Blueprint("voice", __name__)

INTENT_MAP = {
    # Game intent
    "start": "start_game",
    "play": "start_game",
    "game": "start_game",
    "match": "start_game",
    "khel": "start_game",
    "shuru": "start_game",
    "aarambh": "start_game",
    "खेल": "start_game",
    "शुरू": "start_game",
    "आरंभ": "start_game",
    "খেল": "start_game",
    "আৰম্ভ": "start_game",
    
    # Routine & Medication intent
    "routine": "routine",
    "medicine": "routine",
    "dawai": "routine",
    "pani": "routine",
    "water": "routine",
    "ooukhodh": "routine",
    "schedule": "routine",
    "दवा": "routine",
    "दवाई": "routine",
    "पानी": "routine",
    "दिनचर्या": "routine",
    "औषध": "routine",
    "औषधि": "routine",
    "ঔষধ": "routine",
    "পানী": "routine",
    "কাৰ্যসূচী": "routine",
    
    # Progress & Score intent
    "progress": "progress",
    "score": "progress",
    "report": "progress",
    "ank": "progress",
    "स्कोर": "progress",
    "प्रगति": "progress",
    "अंक": "progress",
    "স্কোৰ": "progress",
    "প্ৰগতি": "progress",
    
    # Home intent
    "home": "home",
    "ghar": "home",
    "mukhyaprishth": "home",
    "घर": "home",
    "मुख्य": "home",
    "ঘৰ": "home",
    
    # Caregiver intent
    "caregiver": "caregiver",
    "ananya": "caregiver",
    "beti": "caregiver",
    "बेटी": "caregiver",
    "अनन्या": "caregiver",
    "অভিভাৱক": "caregiver",
    "অনন্যা": "caregiver"
}

RESPONSES = {
    "start_game": {
        "en": "Opening today's recommended cognitive game. Best of luck!",
        "hi": "आज का अनुशंसित खेल शुरू किया जा रहा है। शुभकामनाएँ!",
        "as": "আজিৰ পৰামৰ্শ দিয়া খেলখন আৰম্ভ কৰা হৈছে। শুভকামনা!"
    },
    "routine": {
        "en": "Here is your routine for today. Don't forget your afternoon hydration!",
        "hi": "यह रही आपकी आज की दिनचर्या। दोपहर में पानी पीना न भूलें!",
        "as": "এইখন আপোনাৰ আজিৰ দৈনিক কাৰ্যসূচী। দুপৰীয়া পানী খাবলৈ নাপাহৰিব!"
    },
    "progress": {
        "en": "You have a 5-day streak! Your memory score is 78.",
        "hi": "आपने लगातार 5 दिनों तक अभ्यास किया है! आपका मेमोरी स्कोर 78 है।",
        "as": "আপুনি ৫ দিন ধৰি নিয়মীয়াকৈ খেলি আছে! আপোনাৰ স্কোৰ ৭৮।"
    },
    "home": {
        "en": "Welcome back to your NeuroSaathi home.",
        "hi": "न्यूरोसाथी मुख्य पृष्ठ पर आपका स्वागत है।",
        "as": "নিউৰোসাৰথীৰ মূল পৃষ্ঠালৈ স্বাগতম।"
    },
    "caregiver": {
        "en": "Connecting with your caregiver portal.",
        "hi": "आपके केयरगिवर पोर्टल से जोड़ा जा रहा है।",
        "as": "আপোনাৰ অভিভাৱক পৰ্টেলৰ সৈতে সংযোগ কৰা হৈছে।"
    },
    "fallback": {
        "en": "I heard you! You can say 'Start Game', 'My Routine', or 'Show Score'.",
        "hi": "मैंने आपकी बात सुनी! आप 'खेल शुरू करें' या 'दिनचर्या दिखाएं' कह सकते हैं।",
        "as": "মই আপোনাৰ কথা শুনিলো! আপুনি 'খেল আৰম্ভ কৰক' বা 'কাৰ্যসূচী' ক'ব পাৰে।"
    }
}

@voice_bp.route("/api/voice", methods=["POST"])
def process_voice():
    data = request.get_json() or {}
    text = (data.get("text") or "").strip().lower()
    lang = data.get("language", "en").lower()

    if lang not in ["en", "hi", "as"]:
        lang = "en"

    matched_intent = "fallback"
    for keyword, intent in INTENT_MAP.items():
        if keyword in text:
            matched_intent = intent
            break

    spoken_text = RESPONSES.get(matched_intent, RESPONSES["fallback"]).get(lang, RESPONSES["fallback"]["en"])

    return jsonify({
        "status": "success",
        "query": text,
        "language": lang,
        "intent": matched_intent,
        "spoken_response": spoken_text,
        "action_target": matched_intent
    })
