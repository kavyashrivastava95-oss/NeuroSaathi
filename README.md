# NeuroSaathi (न्यूरो-साथी)

> **"Your Companion for a Healthier Mind"**  
> *Smart India Hackathon (SIH 2026) Prototype — Problem Statement ID: SIH-2026*  
> **Repository**: [https://github.com/kavyashrivastava95-oss/NeuroSaathi](https://github.com/kavyashrivastava95-oss/NeuroSaathi)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%206-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20%2B%20Python%203.11-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%203.1%20REST%20API-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Deploy-Docker%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Project Overview

**NeuroSaathi** is an **AI-Powered Cognitive Gaming and Memory Assistance Platform** engineered specifically for elderly citizens across India, including those experiencing age-related memory decline, mild confusion, difficulty adhering to daily routines, or social isolation.

Unlike generic gaming apps or clinical hospital software, NeuroSaathi bridges the generational and digital gap by fusing:
1. **8 Culturally Resonant Cognitive Games**: Featuring familiar Indian iconography (Jaapi, Gamosa, Diyas, traditional morning routines).
2. **Explainable Rule-Based Adaptive AI Engine**: Quantifiable, transparent difficulty adjustments based on neuroplasticity thresholds ($\ge 80\%$ promotes, $< 50\%$ relieves).
3. **Multilingual Voice Assistance**: Browser-native voice recognition supporting English, Hindi (हिन्दी), and Assamese (অসমীয়া).
4. **Tri-Portal Architecture**: Dedicated interfaces for the **Elderly Patient**, the **Family Caregiver**, and the **Healthcare Specialist**.
5. **Dual-Mode Offline-First Resilience**: 100% presentation uptime guaranteed — automatically uses client-side local fallback if network or backend disconnects.

> [!IMPORTANT]
> **Non-Clinical Assistance Notice**:  
> NeuroSaathi is a cognitive wellness and daily memory companion designed to support active neuroplasticity and family connection. It is **not** a clinical diagnostic tool and does **not** claim to diagnose dementia, Alzheimer's disease, or substitute for licensed medical practitioners.

---

## 2. Problem Statement & Social Impact

* **Demographic Reality**: India is home to over 140 million seniors aged 60+, projected to surpass 300 million by 2050.
* **The Geriatric Specialist Shortage**: There are fewer than 1,000 qualified geriatric psychiatrists nationwide. Cognitive decline often goes unnoticed until late-stage dementia.
* **Tier-2 / Tier-3 & Rural Access**: Senior citizens frequently struggle with complex mobile interfaces, English-only navigation, and intermittent internet connectivity.
* **Caregiver Distance & Anxiety**: Millions of adult children work away from their elderly parents in urban hubs, experiencing daily worry over medication adherence, hydration, and mental well-being.

---

## 3. Technology Stack & Design Decisions

| Layer | Technologies Selected | Rationale for SIH & Clinical Utility |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, TypeScript, TailwindCSS, Lucide Icons, Recharts | Blazing fast, strictly typed, WCAG AAA accessibility, dynamic data visualization. |
| **Backend** | Python 3.11, Flask 3.1, Flask-CORS, Waitress WSGI | Clean, modular REST blueprints; easy to audit, low memory footprint, multi-threaded production ready. |
| **Database** | SQLite + Firestore-compatible JSON schema | Zero-setup relational persistence with structured JSON blobs for game telemetry. Pre-seeded with realistic data. |
| **AI Engine** | Explainable Rule-Based Cognitive Engine (`adaptive_engine.py`) | 100% auditable, deterministic, zero GPU cost, runs offline, zero hallucinations. |
| **Voice / Multilingual** | Web Speech API + Flask Intent Parser (`voice_routes.py`) | Speech recognition and audio synthesis in English, Hindi, and Assamese with zero cloud API latency. |
| **Deployment** | Docker, Docker Compose, Waitress, Render, Railway/Heroku, Vercel | Single-port full-stack serving (Flask hosting compiled Vite SPA on port 5000) or decoupled cloud hosting. |

---

## 4. End-to-End System Architecture

```
+---------------------------------------------------------------------------------------------------------+
|                                             USER INTERFACES                                             |
|   ┌──────────────────────────┐   ┌──────────────────────────┐   ┌───────────────────────────────────┐   |
|   │     ELDERLY PORTAL       │   │    CAREGIVER PORTAL      │   │    HEALTHCARE SPECIALIST PORTAL   │   |
|   │ • 8 Cognitive Games      │   │ • 7-Day Cognitive Trends │   │ • Patient Directory (Kamala, Biren│   |
|   │ • Daily Routine & Water  │   │ • Routine Adherence (85%)│   │ • Longitudinal Decline Monitoring │   |
|   │ • Voice Assistant (HI/AS)│   │ • Anomaly Alert Dismissal│   │ • Clinical Note Persistence       │   |
|   │ • Text Scale & Contrast  │   │ • "Add Routine" Modal    │   │ • Diagnostic Export Ready         │   |
|   └──────────────────────────┘   └──────────────────────────┘   └───────────────────────────────────┘   |
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                HTTP / REST JSON Requests (or Offline Fallback)
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                    FLASK 3.1 BACKEND (Port 5000)                                        |
|   ┌───────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐  |
|   │  /api/auth/*      │  │  /api/game/*        │  │  /api/caregiver/*    │  │  /api/healthcare/*     │  |
|   │  User profiles &  │  │  Session submit &   │  │  Adherence, alert ack│  │  Patient list &        │  |
|   │  1-click logins   │  │  domain rotation    │  │  & routine mutation  │  │  clinical notes store  │  |
|   └───────────────────┘  └─────────────────────┘  └──────────────────────┘  └────────────────────────┘  |
|   ┌────────────────────────────────────────────┐  ┌──────────────────────────────────────────────────┐  |
|   │  /api/voice (Multilingual Intent Parser)   │  │  Single-Port Static Hosting (Vite 'dist' at '/') │  |
|   └────────────────────────────────────────────┘  └──────────────────────────────────────────────────┘  |
+---------------------------------------------------------------------------------------------------------+
                          │                                                 │
                          ▼                                                 ▼
+-----------------------------------------------+ +-------------------------------------------------------+
|          SQLITE PERSISTENCE LAYER             | |              EXPLAINABLE ADAPTIVE ENGINE              |
|  • users (patients, caregivers, doctors)      | |  • Real-time accuracy & mistake-rate scoring          |
|  • game_sessions (telemetry & domain stats)   | |  • Neuroplasticity promotion rule: Acc >= 80% & Err<=2|
|  • routines (water, medicines, exercises)     | |  • Frustration prevention rule: Acc < 50% or Err >= 5 |
|  • alerts (cognitive drift, missed routines)  | |  • 5-session rolling baseline anomaly detection       |
|  • clinical_notes (doctor longitudinal logs)  | |  • Domain rotation: targets weakest cognitive domain  |
+-----------------------------------------------+ +-------------------------------------------------------+
```

---

## 5. 8 Cognitive Games & Targeted Domains

| # | Game Title | Cognitive Domain | Cultural / Accessible Elements |
| :---: | :--- | :--- | :--- |
| **1** | **Memory Match** | Visual & Working Memory | Traditional Assamese and Indian cultural cards (Jaapi, Gamosa, Diya). |
| **2** | **Pattern Recognition** | Executive Function & Logic | Sequential symbol prediction with soothing audio-visual feedback. |
| **3** | **Attention Game** | Selective Attention & Focus | Visual target search amidst distractor symbols under gentle pacing. |
| **4** | **Remember Objects** | Short-Term & Delayed Recall | Timed stimulus presentation followed by active retrieval from options. |
| **5** | **Routine Recall** | Episodic Memory & Daily Life | Chronological ordering of morning tea, bath, medication, and temple visit. |
| **6** | **Sequence Game** | Working Memory & Order | Sequential pattern repetition (Simon-style) with sensory tone feedback. |
| **7** | **Object Recognition** | Semantic Memory & Language | Real-world Indian kitchen and household items naming and category pairing. |
| **8** | **Emotion Recognition** | Social Cognition & Empathy | Identifying facial expressions and emotional states to counter isolation. |

---

## 6. How to Run Locally

### Option A: One-Click Production WSGI Launcher (Single Port 5000 — Recommended)
Double-click:
```cmd
start_production.bat
```
*Builds the React frontend, initializes the SQLite database, starts the multi-threaded Waitress WSGI server on port 5000, and opens your browser.*

---

### Option B: Dual Development Servers (With Hot Reload)
Double-click:
```cmd
run_demo.bat
```
*Runs Flask on `http://127.0.0.1:5000` and Vite dev server on `http://localhost:3000`.*

---

### Option C: Docker & Docker Compose (Zero Setup)
```bash
docker compose up --build
```
*Spins up the multi-stage container at `http://localhost:5000` with persistent SQLite volume.*

---

### Option D: Manual Command Line
```powershell
# 1. Start Backend
cd "backend"
pip install -r requirements.txt
python app.py

# 2. In another terminal, run Frontend
cd "web"
npm install
npm run dev
```

---

## 7. Demo Credentials & Pre-Seeded Profiles

| Role | Name / Identifier | Details | Pre-Seeded Data |
| :--- | :--- | :--- | :--- |
| **Elderly Patient** | **Kamala Devi** (`kamala_devi`) | Age 72, Guwahati, Assam. Mild memory decline. | Level: Easy, 5-Day Streak 🔥, 78/100 Memory Score, 4 active routines. |
| **Elderly Patient** | **Biren Gogoi** (`biren_gogoi`) | Age 76, Jorhat, Assam. Attention focus needs. | Level: Medium, 3-Day Streak, 64/100 Attention Score. |
| **Caregiver** | **Ananya Devi** (`ananya_devi`) | Daughter & primary guardian of Kamala Devi. | Linked to Kamala Devi. 85% routine adherence, 7-day trend charts, anomaly alerts. |
| **Healthcare Specialist** | **Dr. Barua** (`dr_barua`) | Geriatric Neurologist, Guwahati Neurological Clinic. | Full clinical patient directory, cognitive drift badges, clinical notes editor. |

*Quick Access: Click any profile on the top demo switch bar or on the login page for instant 1-click access without typing passwords.*

---

## 8. SIH 3–5 Minute Live Judge Demonstration Guide

See the full script in [SHOWCASE_GUIDE.md](SHOWCASE_GUIDE.md).

1. **The Hook (30 sec)**: Open `http://localhost:5000` or `http://localhost:3000`. Show the landing page, explain the 140M senior demographic crisis in India, and highlight the non-clinical companion focus.
2. **Elderly Experience (60 sec)**:
   * 1-Click Login as **Kamala Devi (72 yrs)**.
   * Demonstrate **Accessibility Toolbar**: Scale font ($A \rightarrow A++$), toggle **High Contrast**, switch language to **हिन्दी** or **অসমীয়া**.
   * Voice Interaction: Click microphone $\rightarrow$ speak *"Start game"* or *"दवाई"*.
   * Play **Memory Match**: Match cards. When game finishes, highlight the **Explainable AI Modal**:  
     *"Accuracy 90% with 0 mistakes $\rightarrow$ Promoted from Easy to Medium to stimulate neuroplasticity."*
   * Check off morning hydration and medication routines.
3. **Caregiver Oversight (45 sec)**:
   * Switch to **Caregiver Portal** (Ananya Devi).
   * Review 7-day cognitive trend charts (Recharts) and 85% adherence.
   * Show the Cognitive Drift anomaly alert and click **"Acknowledge"**.
   * Click **"Add Routine"** to add an evening walk.
4. **Healthcare Specialist Portal (45 sec)**:
   * Switch to **Healthcare Portal** (Dr. Barua).
   * View patient directory with Kamala Devi and Biren Gogoi.
   * Add a clinical observation note: *"Patient demonstrates sustained visual recall. Recommend continuing morning routine."* Note persists in SQLite!
5. **Offline Presentation Resilience (30 sec)**:
   * Disable network in DevTools or stop backend: app seamlessly handles actions via dual-mode local storage fallback without throwing any errors!

---

## 9. Likely SIH Judge Questions & Expert Answers

### Q1: Why rule-based AI instead of a deep neural network or LLM?
> **Answer**: In geriatric mental health, safety, predictability, and auditability are non-negotiable. Deep neural networks are "black boxes" prone to hallucinations. Our explainable engine uses validated clinical thresholds ($\ge 80\%$ accuracy advances difficulty, $< 50\%$ relaxes difficulty) that doctors, caregivers, and regulatory authorities can inspect and verify. Furthermore, it operates with 0ms latency on low-cost offline hardware.

### Q2: What if Wi-Fi disconnects in rural clinics or hackathon venues?
> **Answer**: NeuroSaathi is engineered **offline-first**. The frontend client has an automatic fallback layer that detects network drops and switches to local state simulation without displaying error screens. When connectivity resumes, telemetry syncs back to the backend.

### Q3: Does this platform diagnose Alzheimer's or dementia?
> **Answer**: No. NeuroSaathi adheres strictly to non-clinical assistive guidelines. We explicitly disclaim diagnostic capability. It is a cognitive exercise companion, memory aid, and family communication tool designed to promote mental engagement and routine adherence.

### Q4: How is data privacy maintained?
> **Answer**: Data is encrypted and stored locally in SQLite with anonymized identifiers. No telemetry is shared with ad trackers or third-party cloud analytics.

### Q5: How do you prevent elderly users from feeling discouraged?
> **Answer**: The adaptive engine features a "Frustration Prevention Protocol". If accuracy falls below 50% or mistakes exceed 5, the game difficulty automatically softens and delivers positive reinforcement messages celebrating effort.

---

## 10. Automated Test Suite

NeuroSaathi includes a backend automated test suite covering all REST endpoints, cognitive score recording, routine toggling, alerts, and clinical notes:

```powershell
python backend/test_backend.py
```
**Results**:
```
Ran 10 tests in 0.133s
OK (10/10 endpoints verified)
```

---

## 11. Project Directory Structure

```
NeuroSaathi/
├── backend/
│   ├── app.py                     # Flask application factory & SPA static server
│   ├── prod_server.py             # Waitress multi-threaded WSGI runner
│   ├── test_backend.py            # Comprehensive 10/10 automated test suite
│   ├── requirements.txt           # Python dependencies (Flask, Waitress, Gunicorn)
│   ├── models/
│   │   ├── database.py            # SQLite schema (users, games, routines, alerts, notes)
│   │   └── neurosaathi.db         # Seeded database with realistic demo data
│   ├── routes/
│   │   ├── auth_routes.py         # Login & user demographic endpoints
│   │   ├── game_routes.py         # Cognitive session submissions & recommendations
│   │   ├── caregiver_routes.py    # Adherence, routine mutation, & alert ack
│   │   ├── healthcare_routes.py   # Patient roster & clinical notes
│   │   └── voice_routes.py        # Multilingual voice intent parser
│   └── services/
│       └── adaptive_engine.py     # Explainable AI rule engine & anomaly detector
├── web/
│   ├── index.html                 # WCAG AAA accessible HTML entry point
│   ├── package.json               # Vite, React, Lucide, Recharts dependencies
│   ├── vite.config.ts             # Vite build configuration with /api proxy
│   ├── dist/                      # Optimized, compiled production assets
│   └── src/
│       ├── App.tsx                # Client-side SPA routing & demo navigation bar
│       ├── services/api.ts        # Dual-mode API client with offline fallback
│       ├── context/
│       │   ├── AccessibilityContext.tsx # Font scaling (100%-150%) & high contrast
│       │   └── VoiceContext.tsx         # Web Speech API recognition & synthesis
│       ├── pages/
│       │   ├── LandingPage.tsx          # Public showcase & social impact hero
│       │   ├── patient/                 # Elderly dashboard, My Day, & 8 games
│       │   ├── caregiver/               # Caregiver charts, alerts, & routine manager
│       │   └── healthcare/              # Clinical specialist patient management
├── Dockerfile                     # Multi-stage production container build
├── docker-compose.yml             # Container orchestration with volume persistence
├── start_production.bat           # 1-Click Windows production WSGI launcher
├── run_demo.bat                   # 1-Click Windows development launcher
├── render.yaml                    # Render cloud deployment blueprint
├── Procfile                       # Railway / Heroku deployment specification
├── SHOWCASE_GUIDE.md              # Complete 3-minute SIH live pitch script
└── README.md                      # Comprehensive project documentation
```

---

## 12. Team & Acknowledgments

* **Platform**: NeuroSaathi (न्यूरो-साथी)
* **Hackathon**: Smart India Hackathon (SIH 2026)
* **GitHub**: [@kavyashrivastava95-oss](https://github.com/kavyashrivastava95-oss/NeuroSaathi)
* **License**: MIT License
