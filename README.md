# 🛺 SaheliMile — Safe, Shared Last-Mile Commutes for Women

> **Built for TuteDude Buildathon (CityFix Challenge)** | `#TutedudeBuildathon` `#BuildForMyCity`

**SaheliMile** is a mobile-first Progressive Web App (PWA) solving the urban last-mile safety and affordability gap for women commuters. While metro and bus stations are well-lit and monitored, the final 1–2 km stretch home is often dark, isolated, and expensive for solo rides.

SaheliMile connects verified women exiting the same transit hub along overlapping routes, pairs them with community-vouched auto/e-rickshaw drivers, and activates an automated **Safe-Drop Handshake** for the final solo leg of the journey.

---

## ✨ Key Features

- **🧭 Route-Overlap Co-Rider Matching:** Computes real-time route geometry overlap using OpenStreetMap (OSRM) and Haversine proximity ($\ge 65\%$ overlap) to pair verified commuters from the same transit hub and split auto fares fairly.
- **🛡️ Auto "Community Trust Stamp":** Instant QR or ID lookup displaying community safety ratings and verified trip counts from local women commuters—without relying on slow municipal databases.
- **🤝 Safe-Drop Handshake:** When the first co-rider reaches her stop, the app automatically triggers **Comfort Guardian Mode** for the remaining rider, sharing live route progress with trusted contacts until she marks herself safely home.
- **⚡ 1-Click Pilot Demo Mode:** Built-in interactive demo flow pre-loaded with clearly labelled pilot data so anyone can test the full experience immediately without signup friction.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Maps & Routing:** Leaflet.js, OpenStreetMap, OSRM Routing API
- **Backend & Realtime:** Supabase (PostgreSQL + Realtime) with local pilot fallback
- **Deployment:** Vercel

---

## 🚀 Local Setup & Execution

1. **Clone the repository**
   ```bash
   git clone [https://github.com/anandgautam1610/sahelimile.git](https://github.com/anandgautam1610/sahelimile.git)
   cd sahelimile