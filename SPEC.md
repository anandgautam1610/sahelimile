# SPEC.md — SaheliMile (CityFix Buildathon)

## 1. Product Overview & Value Proposition
- **Product Name:** SaheliMile
- **Tagline:** *Your Safe, Shared Last-Mile Home.*
- **Core Problem:** Transit stations (metro/bus/railway) are well-lit and monitored, but the final 1–2 km stretch home is dark, expensive for solo autos, and unsafe—forcing women to pay 3x fares or avoid evening mobility altogether.
- **Solution:** A mobile-first Progressive Web App (PWA) connecting verified women commuters exiting the same transit hub along overlapping routes, paired with community-vouched auto/e-rickshaw drivers and an automated "Safe-Drop Handshake."

## 2. Visual Identity & Design System (Bright, Trustworthy, Energetic)
- **Theme:** Light, warm, high-trust aesthetic (strictly avoid dark/red fear-based UI).
- **Colors:**
  - Primary Brand Teal: `#0D9488` (Trust, Calm, Reliability)
  - Accent Warm Coral: `#F97316` (Action, Energy, Warmth)
  - Background Canvas: `#FFFBEB` (Warm Cream) & `#FFFFFF` (Cards)
  - Text Primary: `#0F172A` (Slate 900)
- **Typography:** `Plus Jakarta Sans` (Headings) + `Inter` (Body/UI).
- **Layout Architecture:**
  - `/` — **Public Landing Page:** Hero with interactive live route-overlap preview, "How It Works" 3-step visual, Problem & Survey Stats section, Safety Architecture, and Footer with Brand Kit & GitHub links.
  - `/app` — **Centered Mobile-Frame Web App (`max-w-md mx-auto min-h-screen shadow-xl`):** Bottom navigation (`Find Match`, `Auto Trust`, `Active Ride`, `Profile`) so judges on desktop get a realistic mobile app experience.

## 3. Core Functional Modules (Must Work End-to-End)
1. **1-Click Judge / Pilot Demo Mode:**
   - A prominent *"Try Instant Demo (No Signup)"* banner on `/app` that pre-fills a realistic transit-hub trip (e.g., *Rani Kamalapati Station → Arera Colony / MP Nagar*) with simulated live co-riders so judges can test the entire flow in 10 seconds.
   - Clearly label all pre-loaded routes and profiles as *"Pilot / Synthetic Demo Data"* per Buildathon guidelines.
2. **Transit-Hub Route Overlap Matcher (`Find Match` Tab):**
   - User selects Origin Transit Hub + Destination pin/address.
   - Uses **Leaflet.js + OpenStreetMap (OSRM API)** to fetch route polylines (ensure Leaflet imports are dynamically loaded with `ssr: false` in Next.js).
   - **Matching Logic:** Computes route overlap percentage using Haversine proximity along route waypoints. Displays matches with **>= 65% route overlap**, highlighting:
     - Co-rider's verified trust badge (e.g., *Verified College ID / Corporate Email*), shared route %, and exact fare split (e.g., *₹90 Solo → ₹45 Shared*).
3. **Auto / E-Rickshaw "Community Trust Stamp" (`Auto Trust` Tab):**
   - Input via QR code scan (`html5-qrcode`) or manual Auto ID / Plate lookup (display masked/blurred plate format in UI for privacy compliance).
   - Queries Supabase (with local JSON fallback) to show driver verification status, total community rides completed by women from that hub, and safety rating.
4. **"Safe-Drop Handshake" (`Active Ride` Tab):**
   - Visual 2-stage trip tracker: *Stage 1: Shared Ride Active* → *Stage 2: Co-Rider Dropped (Solo Leg Alert)*.
   - When Rider 1 marks *"Dropped at Stop"*, the app automatically triggers **Comfort Guardian Mode** for Rider 2—generating a live shareable status view (`/track/[id]`) with auto details, live route progress, and a 1-tap *"I've Reached Home Safely"* button.

## 4. Tech Stack & Build Rules
- **Framework:** Next.js (App Router) + Tailwind CSS + Lucide Icons
- **Maps & Routing:** Leaflet.js + OpenStreetMap + OSRM Routing API
- **Backend / Realtime:** Supabase (PostgreSQL + Realtime) with LocalStorage/JSON Pilot Fallback
- **Deployment:** Vercel
- **Privacy & Compliance:** Mask/blur vehicle registration plates; explicitly label demo/synthetic datasets.