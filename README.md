# NeuroSaathi

> **"Your Companion for a Healthier Mind"**  
> *Smart India Hackathon (SIH 2026) Prototype*

---

## 1. Project Overview

**NeuroSaathi** is an **AI-Powered Cognitive Gaming and Memory Assistance Platform** engineered specifically for elderly individuals, including those experiencing memory decline, confusion, difficulty managing daily routines, or social isolation. 

Unlike generic mobile gaming apps or clinical hospital software, NeuroSaathi combines **culturally resonant cognitive stimulation**, **explainable rule-based adaptive AI**, **daily routine and hydration support**, and **real-time family/caregiver oversight** into a simple, warm, and highly accessible interface.

> [!IMPORTANT]
> **Non-Clinical Assistance Notice**:  
> NeuroSaathi is a cognitive wellness and daily memory companion designed to support active neuroplasticity and family connection. It is **not** a clinical diagnostic tool and does **not** claim to diagnose dementia, Alzheimer's disease, or substitute for licensed medical practitioners.

---

## 2. Problem Statement & Social Impact

* **The Demographic Shift**: India has over 140 million citizens aged 60+, projected to reach 300 million by 2050.
* **The Cognitive Gap**: Mild Cognitive Impairment (MCI) and age-related memory loss often go unaddressed until advanced stages due to stigma and a critical shortage of geriatric neuro-specialists.
* **Rural & Remote Disconnect**: In tier-2/tier-3 towns and rural areas, high-speed internet is unstable, digital literacy among seniors is low, and English-only interfaces create barriers.
* **Caregiver Anxiety**: Adult children who work in different cities experience constant worry regarding whether their elderly parents took their medication, drank enough water, or remained mentally active.

---

## 3. Technology Stack Actually Used

| Layer | Technologies Selected | Rationale for SIH |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, TypeScript, TailwindCSS, Lucide Icons, Recharts | Fast, responsive, accessible, modular components with instant hot reload. |
| **Backend** | Python 3.11 + Flask 3.1, Flask-CORS | Clean, beginner-friendly REST API; easily explainable to hackathon judges in 60 seconds. |
| **Database** | SQLite + Firebase/Firestore-compatible JSON Schema | Zero-setup, standalone local persistence with cloud-ready document structure. |
| **AI / Adaptive** | Python Rule-Based Explainable Cognitive Engine (`services/adaptive_engine.py`) | 100% transparent, auditable, clinically safe, and runs offline without expensive GPUs. |
| **Voice & Speech** | Browser Web Speech API (SpeechSynthesis & SpeechRecognition) | Native speech interaction supporting English, Hindi, and Assamese without cloud fees. |
| **Reliability** | Dual-Mode Live API + Local Storage Fallback | 100% presentation uptime before judges even if Wi-Fi or backend server is interrupted. |

---

## 4. "Technology Choices Explained" (For Student Explanations)

* **Why Flask over Django or FastAPI?**  
  Flask is minimalist and lightweight. It does not carry bloated boilerplate or complex asynchronous abstractions that confuse student teams during 5-minute live presentations.
* **Why Rule-Based AI instead of a Deep Learning Neural Network?**  
  Deep neural networks in healthcare are often "black boxes" whose outputs cannot be audited or explained. Our rule-based adaptive engine relies on quantifiable metrics ($\ge 80\%$ accuracy advances difficulty, $< 50\%$ relieves difficulty), providing verifiable explanations to doctors, caregivers, and judges.
* **Why Dual-Mode Architecture?**  
  Hackathon convention centers notoriously suffer from failing Wi-Fi networks. NeuroSaathi communicates with the live Flask API by default, but seamlessly falls back to local storage if offline.

---

## 5. End-to-End System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|   Landing Page  |  Elderly Dashboard  |  8 Cognitive Games  |  Caregiver Portal   |
+-----------------------------------------------------------------------------------+
                                         │
                         REST API Requests (JSON / HTTP)
                                         ▼
+-----------------------------------------------------------------------------------+
|                              FLASK BACKEND (Port 5000)                             |
|   auth_routes.py  |  game_routes.py  |  caregiver_routes.py  |  voice_routes.py   |
+-----------------------------------------------------------------------------------+
                       │                                    │
                       ▼                                    ▼
+-------------------------------+         +-----------------------------------------+
|   DATABASE (SQLite / JSON)    |         |        EXPLAINABLE ADAPTIVE ENGINE      |
|   • Users Table               |         |  • Evaluates score, accuracy, & time    |
|   • Game Sessions Table       | ◄─────► |  • Verifiable promotion/relaxation rules|
|   • Daily Routines Table      |         |  • Rolling baseline anomaly detection   |
|   • Caregiver Alerts Table    |         |  • Domain rotation recommendation       |
+-------------------------------+         +-----------------------------------------+
```

---

## 6. How to Run (Exact Terminal Commands)

### Option A: One-Click Windows Launcher (Fastest)
Double-click:
```cmd
run_demo.bat
```
*This automatically launches the Flask API on port 5000 and the Vite frontend on port 3000, then opens your browser.*

---

### Option B: Manual Terminal Execution

#### Terminal 1 — Backend (Python + Flask)
```powershell
cd "c:\Users\Kavya Shrivastava\OneDrive\Desktop\NeuroSaathi"
backend\python_embed\python.exe backend\app.py
```
*Server starts at `http://127.0.0.1:5000`.*

#### Terminal 2 — Frontend (React + Vite)
```powershell
cd "c:\Users\Kavya Shrivastava\OneDrive\Desktop\NeuroSaathi\web"
npm run dev
```
*Vite dev server starts at `http://localhost:3000` (or `http://localhost:5173`).*

---

## 7. Demo Credentials & Profiles

* **Demo Elderly User**:
  * **Name**: Kamala Devi (Age 72)
  * **Location**: Guwahati, Assam
  * **Level**: Easy
  * **Streak**: 5 Days 🔥
  * **Memory Score**: 78 / 100
* **Demo Caregiver**:
  * **Name**: Ananya Devi (Daughter)
  * **Linked Patient**: Kamala Devi
  * **Adherence Rate**: 85%

---

## 8. SIH 3–5 Minute Live Demonstration Sequence

1. **Step 1: The Landing Page (30 seconds)**  
   Open `http://localhost:3000`. Show the hero banner, explain the problem facing 140M Indian seniors, and point out the 8 cognitive game domains and explainable AI architecture.
2. **Step 2: 1-Click Elderly Login (20 seconds)**  
   Click **"Start Cognitive Activity"** or **"Sign In"**. Select 1-click login for **Kamala Devi (72 yrs)**.
3. **Step 3: Elderly Dashboard (30 seconds)**  
   Highlight the large, high-contrast buttons, warm greeting ("Good Morning, Kamala"), 5-day streak, memory score, and upcoming hydration/medicine reminders.
4. **Step 4: Live Cognitive Game (45 seconds)**  
   Click **"Start Today's Activity"** $\rightarrow$ launches **Memory Match** (cultural pairs: Jaapi, Gamosa, Dipa). Flip cards and match all pairs.
5. **Step 5: Explainable AI Rationale Modal (30 seconds)**  
   Show the celebration confetti and read the **AI Adaptive Engine Rationale**:  
   *"Outstanding recall accuracy (90%) with 0 mistakes. Promoted difficulty from Easy to Medium to stimulate neuroplasticity."*
6. **Step 6: Caregiver Control Center (45 seconds)**  
   Click the **Caregiver** tab on the top demo bar. Show Ananya Devi's view: 7-day memory/attention trends, 85% routine adherence, self-reported well-being pie chart, and non-clinical anomaly alerts.
7. **Step 7: Accessibility & Multilingual Demonstration (30 seconds)**  
   Click the floating **Accessibility** button in the bottom right:
   * Switch font size: `A` $\rightarrow$ `A+` (125%) $\rightarrow$ `A++` (150%).
   * Toggle **High Contrast Mode** (vivid amber borders for low-vision seniors).
   * Switch Language to **हिन्दी (Hindi)** or **অসমীয়া (Assamese)**.

---

## 9. Likely SIH Judge Questions & Authoritative Answers

### 1. Why did you choose this problem?
**Answer:** India has over 140 million seniors, yet fewer than 1,000 qualified geriatric psychiatrists. Most seniors experience memory decline and routine confusion in isolation. NeuroSaathi offers non-stigmatizing, accessible, daily cognitive stimulation and family reassurance.

### 2. Why rule-based AI instead of deep learning or an LLM?
**Answer:** In geriatric healthcare, safety and explainability are vital. Deep learning models are un-auditable "black boxes" susceptible to hallucination. Our rule-based engine operates on explicit clinical logic ($\ge 80\%$ promotes, $< 50\%$ relaxes), runs offline without GPU hardware, and provides human-readable explanations to doctors and families.

### 3. How does the adaptive difficulty algorithm work?
**Answer:** The engine evaluates three factors: accuracy percentage, mistake count, and response time. High accuracy ($\ge 80\%$) with $\le 2$ mistakes advances the user to the next cognitive tier. Excessive mistakes ($\ge 5$) or $< 50\%$ accuracy reduces difficulty to prevent cognitive fatigue and frustration.

### 4. How does anomaly detection work?
**Answer:** The engine maintains a 5-session rolling baseline of accuracy. If a session drops $>25\%$ below this baseline, it flags an alert in the caregiver portal (e.g., *"Session accuracy dropped below baseline; may indicate poor sleep, mild dehydration, or fatigue"*).

### 5. What happens if the internet goes down during use?
**Answer:** NeuroSaathi is built offline-first. If the network or backend is offline, the frontend API service automatically switches to client-side local storage simulation without throwing an error or interrupting the user.

### 6. How is user privacy handled?
**Answer:** No sensitive personally identifiable health data (PII) is transmitted to third-party ad networks. All game scores and routines are stored locally in SQLite with anonymized identifiers.

### 7. Why Python and Flask for the backend?
**Answer:** Flask provides an unbloated, clear REST API architecture. It allows any engineering student to explain the endpoints, database transactions, and CORS setup within 60 seconds without buried boilerplate.

### 8. Does NeuroSaathi diagnose dementia or Alzheimer's?
**Answer:** Absolutely not. We include explicit disclaimers across the landing page, dashboards, and caregiver portal. NeuroSaathi is a cognitive wellness and memory assistance platform, not a clinical diagnostic apparatus.

### 9. What cognitive domains do your 8 games target?
**Answer:** Visual memory (`MemoryMatch`), working memory (`SequenceGame`), executive logic (`PatternRecognition`), sustained attention (`AttentionGame`), semantic memory (`ObjectRecognition`), episodic memory (`RoutineRecall`), delayed recall (`RememberObjects`), and social cognition (`EmotionRecognition`).

### 10. How is accessibility tailored for elderly users?
**Answer:** High touch-target sizes ($>56\text{px}$), font scaling up to $150\%$, high-contrast visual filters, calm color palettes avoiding eye strain, voice assistant integration, and zero advertisements.

### 11. How does multilingual support work?
**Answer:** We maintain a modular dictionary in `translations.ts` and multilingual voice intents in `voice_routes.py`. It currently demonstrates English, Hindi, and Assamese, with a modular structure allowing seamless addition of Bengali, Tamil, Telugu, and Marathi.

### 12. How does the voice feature function?
**Answer:** We utilize the native browser Web Speech API for zero-latency speech recognition and text-to-speech, backed by a Flask `/api/voice` intent parser that matches spoken commands like "Start game" or "Water reminder".

### 13. How do you prevent elderly users from feeling frustrated?
**Answer:** When performance drops below $50\%$, the adaptive engine relaxes the difficulty level and praises effort with cheerful positive reinforcement rather than showing red "Failed" banners.

### 14. How does the caregiver benefit from this platform?
**Answer:** Caregivers get peaceful reassurance: they see whether daily activities were completed, monitor 7-day cognitive stability, and receive non-clinical notifications without hovering over their parents.

### 15. How does this compare to commercial brain-training apps like Lumosity?
**Answer:** Commercial apps target young tech-savvy subscribers, feature complex micro-transactions, and lack cultural relevance. NeuroSaathi is designed specifically for seniors with Indian cultural symbols (Jaapi, Gamosa, earthen lamps), multilingual audio, routine reminders, and caregiver monitoring.

### 16. What is the database schema?
**Answer:** SQLite relational tables for `users`, `game_sessions`, `routines`, and `alerts`, formatted with Firebase Firestore-aligned JSON schemas for painless cloud migration.

### 17. How can this scale to primary health centres (PHCs)?
**Answer:** Because the system requires minimal compute and works offline, it can be distributed on low-cost Android tablets at village ASHA worker clinics or community elder centers.

### 18. What are the limitations of the current prototype?
**Answer:** The current prototype uses browser-based local speech recognition (which requires a microphone permission prompt) and rule-based anomaly detection rather than biometric sensor integration.

### 19. What is the future scope?
**Answer:** Integration with wearable smartwatches for passive sleep/heart-rate correlation, WhatsApp bot notifications for caregivers, and clinical trials with geriatric research institutes.

### 20. How did the team ensure code quality and maintainability?
**Answer:** Fully typed TypeScript interfaces, modular Flask blueprints, separation of concerns (API client, database layer, adaptive service), and zero unnecessary dependencies.

---

## 10. Final Verification & Checklist

* [x] **Landing Page**: Fully functional with hero section, problem overview, 8 game showcase, AI architecture, and CTAs.
* [x] **Elderly Authentication**: 1-click login for Kamala Devi with pre-populated stats.
* [x] **Caregiver Portal**: Real-time adherence, 7-day Recharts trends, alert acknowledgement, and non-clinical disclaimer.
* [x] **Cognitive Games**: 8 playable games including Memory Match, Pattern Recognition, and Routine Recall.
* [x] **Explainable AI Engine**: Rule-based difficulty adaptation with transparent rationale modal.
* [x] **Accessibility Toolbar**: Text scaling (100%-150%), High-Contrast toggle, audio guidance, and language selector.
* [x] **Dual-Mode Offline Resilience**: Seamless fallback to local storage if Flask backend is offline.
* [x] **Single-Click Windows Launcher**: `run_demo.bat` starts both servers and opens the browser.
