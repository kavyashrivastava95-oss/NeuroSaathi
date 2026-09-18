# NeuroSaathi — SIH 2026 Judge Presentation & Live Showcase Guide

> **"Your Companion for a Healthier Mind"**  
> *Smart India Hackathon 2026 Presentation Dossier*  
> **Repository**: [https://github.com/kavyashrivastava95-oss/NeuroSaathi](https://github.com/kavyashrivastava95-oss/NeuroSaathi)

---

## 🏆 Presentation Quick Reference

| Item | Details |
| :--- | :--- |
| **Project Name** | **NeuroSaathi** (न्यूरो-साथी) |
| **Category** | Healthcare & MedTech / Social Impact / AI for Good |
| **Target Audience** | 140M+ Indian seniors (60+), family caregivers, geriatric clinics |
| **Recommended Server** | Single-Port Production WSGI (`start_production.bat` on `http://localhost:5000`) |
| **Dev Mode Launcher** | Dual Server (`run_demo.bat` on `http://localhost:3000`) |
| **Demo Persona 1** | **Kamala Devi** (Age 72, Guwahati, Assam) — Elderly Patient |
| **Demo Persona 2** | **Ananya Devi** (Daughter) — Family Caregiver |
| **Demo Persona 3** | **Dr. Barua** (Geriatric Specialist, ID: `dr_barua`) — Clinician |

---

## ⏱️ The 3-Minute Competition Pitch Script

### Minute 0:00 – 0:45 | The Problem & The Mission (Hook)
> *"Good morning, respected judges. India is undergoing a massive demographic shift: we have over 140 million citizens over the age of 60, yet fewer than 1,000 qualified geriatric psychiatrists in the entire country. Millions of seniors experience mild memory decline and routine confusion in isolation. Meanwhile, their adult children work in distant cities, experiencing constant anxiety over whether their parents took their medicine or drank water.*
>
> *Existing brain apps like Lumosity are built for young, English-speaking gamers with high-end phones and expensive subscriptions. Hospital software is clinical, cold, and intimidating.*
>
> *We built **NeuroSaathi** — a warm, culturally resonant, AI-powered cognitive companion that stimulates neuroplasticity through Indian cultural games, keeps daily routines on track, and gives families and doctors auditable peace of mind."*

---

### Minute 0:45 – 1:45 | Elderly Experience & Explainable AI (Show & Play)
*Action: Log in as **Kamala Devi (72 yrs)** on `http://localhost:5000`.*

> *"Notice our interface: WCAG AAA compliant, oversized touch targets, and high-contrast visuals designed specifically for arthritic hands and low vision.*
>
> *(Click Accessibility Floating Button in bottom-right)*  
> *A senior can scale font size up to 150%, enable high-contrast amber outlines, or switch language to **हिन्दी** or **অসমীয়া**.*
>
> *(Click Microphone / Voice Assistant)*  
> *Our speech recognition allows seniors who cannot type to interact naturally in native dialects: 'Start game' or 'दवाई'.*
>
> *(Click 'Start Today's Activity' $\rightarrow$ Play **Memory Match**)*  
> *Rather than abstract symbols, our cognitive games feature familiar cultural iconography: the Assamese Jaapi, Gamosa, and Diwali Diyas. Let's match these cards...*
>
> *(Complete the game $\rightarrow$ Celebration Confetti & AI Rationale Modal appears)*  
> *Look at this modal: this is our **Explainable Rule-Based Cognitive Adaptive Engine**. Unlike a 'black-box' deep neural net that hallucinates, our engine operates on transparent neuroplasticity rules: because Kamala achieved 90% accuracy with 0 mistakes, the engine promoted her difficulty from Easy to Medium. If she struggled, it would gently relax difficulty to prevent frustration."*

---

### Minute 1:45 – 2:30 | Caregiver Portal & Family Reassurance
*Action: Click **Caregiver** on the top demo bar (Ananya Devi).*

> *"Now switch to Ananya Devi's view in Bengaluru. She doesn't need to call ten times a day asking 'Maa, did you take your pills?'.*
>
> *Here on the dashboard:*
> 1. *She sees today's **85% routine adherence**.*
> 2. *Interactive 7-day longitudinal trends generated with Recharts tracking memory and attention stability.*
> 3. *Real-time **Cognitive Drift alerts**: if accuracy drops more than 25% below baseline, it notifies the family that the patient might be sleep-deprived or dehydrated.*
> 4. *(Click 'Acknowledge') The alert updates instantly.*
> 5. *(Click 'Add Routine') She can add an 'Evening Garden Walk' directly to her mother's daily schedule."*

---

### Minute 2:30 – 3:15 | Healthcare Specialist Portal & Clinical Audit
*Action: Click **Healthcare** on the top demo bar (Dr. Barua).*

> *"Third, we bridge the clinical gap with the **Healthcare Specialist Portal** for Dr. Barua.*
>
> *Doctors can:*
> * Inspect the active patient roster (Kamala Devi, Biren Gogoi).*
> * Review non-clinical cognitive stability indices across weeks.*
> * Add persistent clinical observation notes directly into the patient record.*
>
> *(Type in note: 'Sustained visual recall; continue current daily routine' and click Add Note)*  
> *The note is instantly persisted in our SQLite database for longitudinal review."*

---

### Minute 3:15 – 3:45 | Offline-First Dual Mode & Conclusion
*Action: Open DevTools Network tab $\rightarrow$ select 'Offline' (or stop backend).*

> *"Finally, consider rural primary health centres (PHCs) with intermittent internet. NeuroSaathi is engineered **Dual-Mode Offline-First**. Even if connectivity drops completely, our client-side fallback layer maintains full functionality without crashing or showing error screens.*
>
> *NeuroSaathi is light, accessible, 100% explainable, and production ready for deployment in homes and community elder centers across India. Thank you, and we welcome your questions!"*

---

## 🎯 High-Probability Judge Questions & Rebuttals

### Q1: "Why rule-based AI? Why didn't you use a Deep Neural Network or fine-tuned LLM?"
* **Your Winning Rebuttal**:  
  *"In geriatric healthcare, safety and explainability are paramount. Deep learning models and LLMs suffer from three critical flaws here:*
  1. *They are **black boxes** whose reasoning cannot be audited by a doctor.*
  2. *They **hallucinate**.*
  3. *They require high-end GPU cloud infrastructure and constant internet connectivity, which fails in rural Indian clinics.*
  *Our rule-based engine is 100% deterministic, auditable, runs offline with zero latency, and provides human-readable explanations that doctors and families can trust."*

---

### Q2: "Are you diagnosing dementia or Alzheimer's?"
* **Your Winning Rebuttal**:  
  *"No, absolutely not, and we state this prominently on our landing page and all dashboards. NeuroSaathi is a **non-clinical cognitive wellness and memory assistance companion**. It supports daily cognitive exercise, routine adherence, and family peace of mind. We do not claim to replace licensed neurologist diagnosis."*

---

### Q3: "How does your difficulty adaptation algorithm work mathematically?"
* **Your Winning Rebuttal**:  
  *"The engine evaluates three parameters from each game session:*
  1. *$\text{Accuracy} = \frac{\text{Correct Matches}}{\text{Total Attempts}} \times 100$*
  2. *$\text{Mistakes Count}$*
  3. *$\text{Completion Time}$*
  * **Promotion Rule**: If $\text{Accuracy} \ge 80\%$ AND $\text{Mistakes} \le 2$, promote difficulty to the next tier ($\text{Easy} \rightarrow \text{Medium} \rightarrow \text{Hard}$).*
  * **Relief / Frustration Prevention Rule**: If $\text{Accuracy} < 50\%$ OR $\text{Mistakes} \ge 5$, reduce difficulty and deliver positive encouragement.*
  * **Anomaly Flag**: If current accuracy is $> 25\%$ lower than the 5-session rolling baseline, an alert is queued for the caregiver."*

---

### Q4: "How does this compare to Lumosity or Elevate?"
* **Your Winning Rebuttal**:  
  *"Commercial brain apps are designed for young, urban, tech-savvy users. They feature fast-paced timers, complex English instructions, micro-transactions, and zero caregiver integration.*
  *NeuroSaathi is purpose-built for Indian seniors:*
  * *Culturally familiar symbols (Jaapi, Gamosa, Diyas).*
  * *Bilingual voice interaction in Hindi and Assamese.*
  * *Elderly-first ergonomics (large buttons, high contrast, zero popups).*
  * *Integrated daily routine tracking (water, medication) linked to a caregiver portal."*

---

### Q5: "How does the dual-mode offline capability work?"
* **Your Winning Rebuttal**:  
  *"Our frontend API client in `web/src/services/api.ts` implements an intelligent dual-mode architecture. Every request first targets our Flask REST API. If the network drops or the server is unreachable, the client catches the error and falls back seamlessly to an in-memory and local storage state layer. The elderly user never experiences a broken screen or error dialog."*

---

### Q6: "How do you protect patient privacy?"
* **Your Winning Rebuttal**:  
  *"We do not collect Aadhaar numbers, biometric data, or sensitive PII. Sessions are linked to anonymized local database IDs. No data is sent to third-party ad networks or public cloud LLMs."*

---

## 🛠️ Emergency Presentation Contingency Plan

| Scenario | Immediate Fix |
| :--- | :--- |
| **Port 5000 is already in use** | Open PowerShell: `Get-Process python* \| Stop-Process -Force`, then re-run `start_production.bat`. |
| **Projector has weird low resolution** | Click the floating Accessibility button in the bottom right and select `A` (standard) or `A+` to adjust layout scaling. |
| **Microphone fails permission prompt** | You can click the voice chips ('Start game', 'Water reminder') directly in the assistant modal to demonstrate intent parsing without microphone hardware. |
| **Venue Wi-Fi drops completely** | The app runs 100% on `localhost` (offline)! No external internet is required to run the full stack. |

---

*NeuroSaathi — Empowering Minds, Supporting Families, Bridging Care.*
