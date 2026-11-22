import React from "react";
import Link from "next/link";
import RouteOverlapPreview from "@/components/landing/RouteOverlapPreview";
import {
  ShieldCheck,
  MapPin,
  Users,
  IndianRupee,
  ArrowRight,
  Sparkles,
  QrCode,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Download,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#0F172A] flex flex-col selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
      {/* Top Banner for Buildathon */}
      <div className="bg-gradient-to-r from-[#0D9488] via-[#0f766e] to-[#0D9488] text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex flex-wrap items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
          TuteDude Buildathon
        </span>
        <span>CityFix Challenge • Bhopal Pilot Edition</span>
        <span className="hidden sm:inline text-teal-200">|</span>
        <span className="bg-teal-950/40 px-2.5 py-0.5 rounded-full font-semibold text-[10px] text-teal-100 border border-teal-400/30">
          Pilot Demo Mode • Simulated Transit Data for Evaluation
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FFFBEB]/90 backdrop-blur-md border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0D9488] flex items-center justify-center shadow-md shadow-teal-900/10 text-white font-extrabold text-xl">
              🛺
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">
                Saheli<span className="text-[#0D9488]">Mile</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                Safe Shared Commutes
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#problem" className="hover:text-[#0D9488] transition-colors">
              The Last-Mile Gap
            </a>
            <a href="#how-it-works" className="hover:text-[#0D9488] transition-colors">
              How It Works
            </a>
            <a href="#safety" className="hover:text-[#0D9488] transition-colors">
              Safety Architecture
            </a>
            <a
              href="https://github.com/anandgautam1610/sahelimile.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#0D9488] transition-colors"
            >
              GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold py-2.5 px-4 sm:px-5 rounded-full shadow-md shadow-teal-800/15 transition-all hover:shadow-teal-800/25 active:scale-95"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Smart Transit-Hub Pairing for Women Commuters</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Your Safe, Shared{" "}
                <span className="text-[#0D9488] underline decoration-[#F97316] decoration-wavy decoration-2">
                  Last-Mile Home.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Transit hubs like metro stations and railway terminals are well-lit and monitored. But the final 1–2 km stretch home is dark, expensive, and isolated. SaheliMile connects verified women exiting together along overlapping routes with community-vouched autos.
              </p>

              {/* Value Highlights Pill list */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  <span>Verified Corporate & College IDs</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-sm">
                  <IndianRupee className="w-4 h-4 text-[#F97316]" />
                  <span>50% Auto Fare Split</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-sm">
                  <HeartHandshake className="w-4 h-4 text-[#0D9488]" />
                  <span>Automated Safe-Drop Handshake</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-extrabold text-base py-3.5 px-7 rounded-2xl shadow-xl shadow-teal-900/20 hover:shadow-teal-900/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Launch SaheliMile App</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/app?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm py-3.5 px-6 rounded-2xl border border-slate-200 shadow-sm transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping" />
                  <span>1-Click Pilot Demo</span>
                </Link>
              </div>

              <div className="pt-2 text-xs text-slate-500 font-medium">
                ⚡ Zero install required • Runs instantly as a Progressive Web App (PWA)
              </div>
            </div>

            {/* Right Interactive Component */}
            <div className="lg:col-span-5">
              <RouteOverlapPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Survey Stats Section */}
      <section id="problem" className="py-16 sm:py-20 bg-white border-y border-amber-200/50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              The Urban Commuter Reality
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Dark Last 1.5 Kilometers
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Urban transit infrastructure ends at the station exit gate. For women returning home after dark, the final stretch carries steep penalties.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F97316] font-extrabold mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                83%
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-800">
                Evening Anxiety Gap
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Of women surveyed in tier-1 and tier-2 transit cities alter routes or avoid stepping out after 8:30 PM due to unlit, unmonitored interior colony roads.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-[#0D9488] font-extrabold mb-4">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                3x
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-800">
                Solo Last-Mile Fare Surge
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Auto and cab drivers charge predatory flat rates (₹100–₹150 for a 2 km hop) or refuse short interior drops, leaving commuters stranded at hub gates.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFBEB] border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                45,000+
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-800">
                Isolated Commuters Daily
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thousands of women exit transit points like Rani Kamalapati Station simultaneously heading to the same residential colonies without any pairing mechanism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step 'How It Works' Section */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Simple 3-Step Flow
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How SaheliMile Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Designed for zero friction right at the transit station exit gate.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-7 border border-teal-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center text-lg font-black shadow-md shadow-teal-700/20 mb-6">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Match Overlapping Routes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Select your exit station and destination pin. Our OSRM + Haversine algorithm scans co-riders with <strong className="text-teal-700">≥ 65% route overlap</strong> heading down your corridor.
                </p>
              </div>
              <div className="p-3 bg-teal-50/70 rounded-xl text-xs font-semibold text-teal-900 flex items-center gap-2 border border-teal-100">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Verified corporate email & college ID badges</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white flex items-center justify-center text-lg font-black shadow-md shadow-orange-700/20 mb-6">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Trust the Vouched Ride
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Board community-vouched auto and e-rickshaw drivers. Scan their QR or verify their masked plate to see total women-safe rides completed at that hub.
                </p>
              </div>
              <div className="p-3 bg-orange-50/70 rounded-xl text-xs font-semibold text-orange-900 flex items-center gap-2 border border-orange-100">
                <QrCode className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Community trust stamps & masked privacy plates</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-700/20 mb-6">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Safe-Drop Handshake
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  When Rider 1 reaches her stop and drops off, <strong className="text-emerald-700">Comfort Guardian Mode</strong> automatically triggers for Rider 2 with live tracking until she confirms safe home arrival.
                </p>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 border border-emerald-100">
                <HeartHandshake className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Automatic 2-stage trip security handover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section id="safety" className="py-16 sm:py-20 bg-gradient-to-b from-white to-[#FFFBEB] border-t border-amber-200/50 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">
                Zero Fear-Based Design
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                High Trust. Warm Community. Confident Mobility.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Most safety tools rely on panic buttons and dark emergency alarms. SaheliMile builds safety through proactive social architecture, verified credentials, and real-time mutual accountability.
              </p>

              <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Privacy First: Masked auto plates & encrypted contact routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Transparent 50/50 fare splitting right on the screen</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 text-center">
              <div className="text-3xl font-extrabold text-orange-400">
                Ready for City Pilots
              </div>
              <p className="text-xs text-slate-300">
                Experience the interactive mobile shell on your browser right now with synthetic demo data for Rani Kamalapati Station.
              </p>
              <Link
                href="/app"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
              >
                <span>Open Mobile Web App</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0F172A] text-slate-400 py-12 px-4 sm:px-6 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <span>🛺</span>
              <span>SaheliMile</span>
            </div>
            <p className="mt-2 text-slate-400 leading-relaxed max-w-xs">
              Your Safe, Shared Last-Mile Home. Built for the TuteDude Buildathon (CityFix Challenge).
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Design System & Brand Kit
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0D9488]" />
                <span>Primary Brand Teal: #0D9488</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F97316]" />
                <span>Accent Warm Coral: #F97316</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FFFBEB] border border-slate-600" />
                <span>Background Cream: #FFFBEB</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Project Resources
            </h4>
            <div className="space-y-2">
              <a
                href="https://github.com/anandgautam1610/sahelimile.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
              <a
                href="/SaheliMile_Brand_Kit.pdf"
                target="_blank"
                download
                className="flex items-center gap-1.5 hover:text-white transition-colors text-teal-400 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Brand Kit (PDF)</span>
              </a>
              <Link href="/app" className="block hover:text-white transition-colors">
                Pilot PWA Web App (/app)
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-3 text-center text-slate-400 text-[11px] border-b border-slate-800/80 mb-6 font-medium">
          Pilot Demo Mode • Simulated Transit Data for Evaluation
        </div>

        <div className="max-w-6xl mx-auto pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <span>© 2026 SaheliMile • Built with Next.js, Leaflet, and OpenStreetMap</span>
          <span className="font-semibold text-teal-400">#BuildForMyCity #CityFixChallenge</span>
        </div>
      </footer>
    </div>
  );
}
