# 🛺 SaheliMile — Safe, Shared Last-Mile Commutes for Women

> **Built for TuteDude Buildathon (CityFix Challenge)** | `#TutedudeBuildathon` `#BuildForMyCity`  
> **Pilot Hub:** Rani Kamalapati Railway Station (Habibganj) & Bhopal Urban Transit Nodes  
> **Brand Kit (PDF):** [`/SaheliMile_Brand_Kit.pdf`](file:///c:/Users/anand/OneDrive/Desktop/BUILDATHON/public/SaheliMile_Brand_Kit.pdf)  
> **Interactive Feature Guide:** Accessible directly on the landing page (`/`) via the **App Guide** & **Interactive Tutorial (6 Steps)** buttons.

---

## 🎯 The Urban Commuter Problem

Transit hubs like metro stations and railway terminals are well-lit, monitored, and CCTV-secured. However, the final **1–2 km stretch** from the station exit gate to home interior colonies is dark, expensive, and isolated. 

Women commuters returning after dark face steep barriers:
- Predatory solo auto surge fares (₹100–₹150 for a short 2 km hop).
- Drivers refusing to drop inside unlit residential streets.
- Zero mutual accountability between co-passengers.

**SaheliMile** bridges this gap by connecting verified women commuters exiting the same transit hub along overlapping corridors, pairing them with community-vouched auto drivers, providing pre-split fares, and activating an automated **Safe-Drop Handshake** for the solo leg.

---

## 📊 Primary Commuter Research & Pilot Survey Findings

To anchor our product design in real urban commuter behavior, we conducted a verified primary field survey across daily railway and metro commuters (Sample Size: **$N = 13$ Verified Responses** — **53.8% Female, 46.2% Male**).

> **Transparent Field Survey Badge:** `Primary Pilot Survey (N = 13 Verified Commuters)`  
> **Live Google Form:** [Participate / View Live Google Form Survey](https://docs.google.com/forms/d/1edAnanUOB2yZp5y3EvPWA6jCQDE4mMzCH29rsy0SAQ4/viewform)

### 📈 4 Core Quantitative Metrics (100% Real Field Data)

| Metric | Primary Survey Finding | Behavioral Breakdown | SaheliMile Architectural Solution |
| :--- | :--- | :--- | :--- |
| **92.4%** *(12/13)* | **Route Alteration & Travel Curtailment** | **46.2% Frequently** + **46.2% Occasionally** alter routes or avoid traveling post-8:00 PM due to dark or isolated streets (*0% Unaffected*). | **Evening Safe-Corridor Mode**: Highlights well-lit arterial roads with verified auto traffic and automatic guardian tracking. |
| **77.0%** *(10/13)* | **Adoption Willingness for Verified Shared Transit** | **30.8% Very Likely** + **46.2% Subject to driver & peer verification protocols** (*0% Unlikely*). | **Anti-Spoofing 3-Blink Liveness**: Biometric verification guaranteeing 100% women-only rides + mutual 4-digit Saheli PIN. |
| **38.5%** *(5/13)* | **Short-Distance Auto Drop Refusals** | Cited as the **#1 station gate friction point** by commuters when trying to reach interior residential colonies. | **'Show Driver Card' (ड्राईवर को दिखाएं)**: Large-type bilingual card showing exact OSRM distance and pre-split fair total (e.g. ₹45 + ₹45 = ₹90). |
| **53.9%** *(7/13)* | **Lack of Driver Accountability & Dark Streets** | **30.8%** identify lack of driver accountability/live trip visibility and **23.1%** identify dark interior streets as critical safety barriers. | **Crowdsourced Community Auto Ledger**: Instant plate search before boarding + live public Guardian View (`/track/[id]`). |

### 💬 Real Commuter Voices (Qualitative Responses)

> *"Driver verification, live trip tracking, and emergency support would help female commuters feel safer and more comfortable while travelling."*  
> — **Primary Survey Respondent** *(Daily Transit Commuter)*

> *"Solving last-mile safety with verified co-passengers and community-rated autos is brilliant—just start with one busy college or office metro station first to build a strong user base."*  
> — **Primary Survey Respondent** *(College Student / Urban Commuter)*

---

## ✨ 6 Core Product Modules (End-to-End Functional)

### 1. 👁️ Anti-Spoofing 3-Blink Face AI Verification (`/login`)
- Real-time front-camera verification using `@vladmandic/face-api` (*TinyFaceDetector + AgeGenderNet + FaceLandmark68*).
- **Eye Aspect Ratio (EAR) 3-Blink Liveness**: Detects real eyelid closures (`EAR < 0.22`) and openings (`> 0.25`), preventing static photo spoofing from phones or printouts.
- **100% Client-Side Privacy**: All biometric inferences run inside the browser. No photos or face embeddings are ever sent to an external server.
- Built-in **1-Tap Judge Demo Access** for evaluators without front-facing webcams.

### 2. 🗺️ Pan-India Dual Fuzzy Search & Rapido-Style Pin-Drop (`/app`)
- **Parallel Search Engine**: Runs **Komoot Photon API** and **OpenStreetMap Nominatim** in parallel via `Promise.allSettled`, surfacing hyper-local neighborhood shops (e.g., *"Gangaram Sweets, Barauni"*) and metro gates without paid Google Maps APIs.
- **1-Tap GPS Pickup**: Reverse-geocodes live device coordinates to the nearest entrance gate.
- **Interactive Pin-Drop Mode**: Fixed center crosshair pin with live coordinate reverse-geocoding, allowing riders to position exact spots and customize landmark labels.

### 3. 🛺 Real-Road OSRM Routing & 'Show Driver Card' (`/app?demo=true`)
- Dynamic road distance and driving duration computed via real OpenStreetMap road polylines.
- **Fair Meter Split Formula**: Standard Indian auto rate (*Base ₹25 + ₹14/km*), split 50/50 between co-riders (*e.g., ₹90 meter = ₹45 each*).
- **Mutual 4-Digit Saheli PIN**: Both matched riders see the same PIN (e.g. `4829`) to verify each other visually amid crowded station gates.
- **'Show Driver Card' (ड्राईवर को दिखाएं)**: 1-tap modal in large Hindi + English typography displaying origin, destination, road distance, and fair split total so auto drivers accept without argument.

### 4. 📋 Crowdsourced Community Auto Ledger (`/app`)
- **Zero-Hardware Day 1**: Search any auto registration plate (e.g., `MP-04-4821`) before boarding to view privacy-masked numbers (`MP-04-XX-4821`), women-safe completed rides, and community badges.
- **+ Log & Rate an Auto**: Commuters record safety verdicts (*Safe & Recommended, Neutral, Caution*) with 1-tap behavioral tags (*Polite & Respectful, Fair Fare / No Haggling, Followed Safe Route*).
- Persisted immediately in `localStorage` and merged into the live community feed.

### 5. 🤝 Safe-Drop Handshake & Live Guardian View (`/track/pilot-ride-01`)
- **2-Stage Trip Progression**:
  - *Stage 1*: Shared ride active with real-time route progress for both co-riders.
  - *Stage 2*: When Rider 1 exits, clicking *"Co-Rider Dropped at Stop"* records a timestamped security handshake and activates **Comfort Guardian Mode** for Rider 2's solo leg.
- **Public Guardian Live View (`/track/pilot-ride-01`)**: Real-time mobile status screen showing route progress, masked auto plate, handover alert, and 1-tap *"I've Reached Home Safely 🎉"* button.
- **1-Tap WhatsApp Share**: Pre-fills an urgent safety message (via `wa.me` API) with verified auto details and live tracking link for family.

### 6. 🛡️ 24×7 Safe-Haven Shield, Bilingual UX & Offline Cache (`/app`)
- **Safe-Haven Shield**: Bottom sheet listing 24×7 well-lit emergency safe havens (*RPF Police Help Post, Habibganj Thana Urja Desk, Bansal Hospital Gate*) with distance and 1-tap call/directions.
- **Bilingual EN | हिंदी Toggle**: 1-click switcher across the app translating headings, safety instructions, quick-chat chips, and fare cards.
- **Offline Safe-Cache**: Caches active trip state, emergency contacts, and safe havens in `localStorage` for weak station cellular connectivity.

---

## 🎨 Design System & Brand Identity

| Element | Specification | Hex / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | Teal | `#0D9488` | Trust, calm, safe mobility |
| **Accent Warm** | Coral | `#F97316` | Energy, action, community warmth |
| **Canvas** | Warm Cream | `#FFFBEB` | Soft, human-centric, zero fear-based dark UI |
| **Surface Cards** | Pure White | `#FFFFFF` | Crisp readability & contrast |
| **Typography** | Plus Jakarta Sans | Body: Inter | Modern, legible urban signage feel |

Download the complete PDF brand specification: [`/SaheliMile_Brand_Kit.pdf`](file:///c:/Users/anand/OneDrive/Desktop/BUILDATHON/public/SaheliMile_Brand_Kit.pdf).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router, Turbopack/Webpack)
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Biometric AI:** `@vladmandic/face-api` (Client-side WebAssembly / WebGL)
- **Maps & GIS:** Leaflet.js, OpenStreetMap Nominatim API, Komoot Photon API, OSRM Road Routing API
- **State & Storage:** React Context (`LanguageContext`), HTML5 LocalStorage (offline trip & community ledger persistence)
- **PWA & Mobile:** Web App Manifest (`manifest.json`), mobile-first viewport meta configuration

---

## 🚀 Local Setup & Running

```bash
# 1. Clone the repository
git clone https://github.com/anandgautam1610/sahelimile.git
cd sahelimile

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Landing Page: http://localhost:3000
# Mobile App Shell: http://localhost:3000/app
# Face AI Login: http://localhost:3000/login
# Guardian Tracker: http://localhost:3000/track/pilot-ride-01
```

### Production Build
```bash
npm run build
npm start
```

---

## 🏆 Buildathon Attribution
Built with pride for the **TuteDude Buildathon (CityFix Challenge)**.  
`#TutedudeBuildathon` `#BuildForMyCity` `#CityFixChallenge`
