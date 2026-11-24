"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RouteOverlapPreview from "@/components/landing/RouteOverlapPreview";
import InteractiveGuideModal from "@/components/guide/InteractiveGuideModal";
import {
  ShieldCheck,
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
  Camera,
  Eye,
  Crosshair,
  FileText,
  ShieldAlert,
  BookOpen,
  Mail,
  User,
  AtSign,
} from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const [isVerified, setIsVerified] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Guide Modal State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideInitialStep, setGuideInitialStep] = useState(0);

  const openGuideAtStep = (stepIdx: number) => {
    setGuideInitialStep(stepIdx);
    setIsGuideOpen(true);
  };

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.verified) {
      setIsVerified(true);
      setUserName(user.name);
    }
  }, []);

  const primaryTarget = isVerified ? "/app" : "/login";

  // 6 Micro-Feature Showcase Cards Definition
  const FEATURE_SHOWCASE_ITEMS = [
    {
      step: 1,
      badge: language === "hi" ? "बायोमेट्रिक सुरक्षा" : "Biometric AI",
      title:
        language === "hi"
          ? "एंटी-स्पूफिंग 3-ब्लिंक फेस वेरिफिकेशन"
          : "Anti-Spoofing 3-Blink Face AI Login",
      desc:
        language === "hi"
          ? "68 फेशियल लैंडमार्क और EAR डिटेक्शन द्वारा 3 बार पलक झपकाने की पुष्टि। फोटो स्पूफिंग पूरी तरह ब्लॉक और डेटा 100% ऑन-डिवाइस।"
          : "Real front-camera Eye Aspect Ratio (EAR) 3-blink detection that blocks static photo spoofing while keeping biometric data 100% client-side.",
      icon: Eye,
      accentBg: "bg-teal-50 text-[#0D9488] border-teal-200",
      route: "/login",
    },
    {
      step: 2,
      badge: language === "hi" ? "अखिल भारतीय खोज" : "Pan-India Dual Search",
      title:
        language === "hi"
          ? "डुअल फ़ज़ी सर्च व मैप पिन-ड्रॉप"
          : "Pan-India Dual Search & Map Pin-Drop",
      desc:
        language === "hi"
          ? "फ़ोटॉन + नोमिनेटिम इंजन से स्थानीय मिठाई दुकानों व मेट्रो गेटों की खोज, 1-टैप GPS पिकअप और रैपिडो-स्टाइल इंटरैक्टिव पिन-ड्रॉप।"
          : "Parallel Photon + OSM Nominatim search for hyper-local shops, 1-tap live GPS pickup, and Rapido-style interactive crosshair pin-drop.",
      icon: Crosshair,
      accentBg: "bg-orange-50 text-[#F97316] border-orange-200",
      route: "/app",
    },
    {
      step: 3,
      badge: language === "hi" ? "उचित किराया" : "Fair Pricing & Routing",
      title:
        language === "hi"
          ? "OSRM सड़क रूट व 'ड्राईवर को दिखाएं' कार्ड"
          : "Real-Road OSRM Routing & 'Show Driver Card'",
      desc:
        language === "hi"
          ? "सड़क मार्ग के आधार पर 50/50 तय किराया, गेट पर पहचान हेतु 4-अंकीय सहेली पिन और मोलभाव खत्म करने वाला द्विभाषी ड्राईवर कार्ड।"
          : "Exact road distance via OSRM, 50/50 fair meter split, 4-digit mutual Saheli PIN, and a large Hindi/English driver card that stops haggling.",
      icon: FileText,
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      route: "/app?demo=true",
    },
    {
      step: 4,
      badge: language === "hi" ? "कम्युनिटी लेजर" : "Community Trust",
      title:
        language === "hi"
          ? "कम्युनिटी ऑटो सुरक्षा लेजर (Crowdsourced)"
          : "Crowdsourced Community Auto Ledger",
      desc:
        language === "hi"
          ? "बिना किसी फिजिकल QR स्टिकर के किसी भी ऑटो प्लेट (MP-04-4821) की सुरक्षा जांचें और यात्रा के बाद 1-टैप व्यवहार रेटिंग लेजर में जोड़ें।"
          : "Search any auto registration plate before boarding to view masked numbers & ratings, and log safety reviews with zero physical QR stickers on Day 1.",
      icon: QrCode,
      accentBg: "bg-amber-50 text-amber-700 border-amber-200",
      route: "/app",
    },
    {
      step: 5,
      badge: language === "hi" ? "ट्रिप हैंडशेक" : "Handover & Live View",
      title:
        language === "hi"
          ? "सेफ-ड्रॉप हैंडशेक व लाइव गार्डियन ट्रैकिंग"
          : "Safe-Drop Handshake & Live Guardian View",
      desc:
        language === "hi"
          ? "पहली सहेली के उतरते ही कम्फर्ट गार्डियन मोड चालू होता है। परिजनों के लिए 1-टैप व्हाट्सएप लाइव ट्रैकिंग लिंक (/track/pilot-ride-01)।"
          : "2-stage trip progression with timestamped handover alert when Rider 1 drops, plus 1-tap WhatsApp live tracking for family and guardians.",
      icon: HeartHandshake,
      accentBg: "bg-teal-50 text-teal-800 border-teal-200",
      route: "/track/pilot-ride-01",
    },
    {
      step: 6,
      badge: language === "hi" ? "आपातकालीन बैकअप" : "Emergency & Offline",
      title:
        language === "hi"
          ? "24×7 सेफ-हेवन शील्ड, हिंदी UX व ऑफलाइन कैश"
          : "24×7 Safe-Havens, Bilingual UX & Offline Cache",
      desc:
        language === "hi"
          ? "निकटतम RPF/थाना सेफ-हेवन की 1-टैप कॉल सूची, एक क्लिक में हिंदी भाषा बदलाव और कमजोर नेटवर्क में ट्रिप सेव रखने वाला ऑफलाइन कैश।"
          : "Nearest RPF/police 24×7 shelter lookup with 1-tap call, instant EN | हिंदी switching, and full localStorage offline trip persistence.",
      icon: ShieldAlert,
      accentBg: "bg-rose-50 text-rose-700 border-rose-200",
      route: "/app",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#0F172A] flex flex-col selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
      {/* Top Banner for Buildathon */}
      <div className="bg-gradient-to-r from-[#0D9488] via-[#0f766e] to-[#0D9488] text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex flex-wrap items-center justify-center gap-2">
        <span className="bg-white/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
          {language === "hi" ? "ट्यूटड्यूड बिल्डाथॉन" : "TuteDude Buildathon"}
        </span>
        <span className="font-semibold">
          {language === "hi"
            ? "सिटीफिक्स चैलेंज • भोपाल पायलट संस्करण"
            : "CityFix Challenge • Bhopal Pilot Edition"}
        </span>
        <span className="hidden sm:inline text-teal-200">|</span>
        <span className="bg-teal-950/45 px-2.5 py-0.5 rounded-full font-bold text-[10px] text-teal-100 border border-teal-300/40">
          {language === "hi"
            ? "लाइव पैन-इंडिया रूटिंग • सत्यापित N=13 यात्री पायलट"
            : "Live Pan-India Routing • Verified N=13 Commuter Pilot"}
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FFFBEB]/90 backdrop-blur-md border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0D9488] flex items-center justify-center shadow-md shadow-teal-900/10 overflow-hidden">
              <img src="/icon-192.png" alt="SaheliMile Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">
                Saheli<span className="text-[#0D9488]">Mile</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest -mt-1">
                {language === "hi" ? "सुरक्षित साझा कम्यूट" : "Safe Shared Commutes"}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-700">
            <a href="#problem" className="hover:text-[#0D9488] transition-colors">
              {language === "hi" ? "अंतिम मील की समस्या" : "The Last-Mile Gap"}
            </a>
            <a href="#how-it-works" className="hover:text-[#0D9488] transition-colors">
              {language === "hi" ? "यह कैसे काम करता है" : "How It Works"}
            </a>
            <a
              href="#features-guide"
              className="hover:text-[#0D9488] transition-colors flex items-center gap-1 text-[#0F766E]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{language === "hi" ? "फ़ीचर गाइड" : "Feature Guide"}</span>
            </a>
            <a href="#safety" className="hover:text-[#0D9488] transition-colors">
              {language === "hi" ? "सुरक्षा प्रणाली" : "Safety Architecture"}
            </a>
            <a href="#contact" className="hover:text-[#0D9488] transition-colors">
              {language === "hi" ? "संपर्क" : "Contact"}
            </a>
            <a
              href="https://github.com/anandgautam1610/sahelimile.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#0D9488] transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Switcher (EN | हिंदी) */}
            <div className="flex items-center bg-white/90 p-0.5 rounded-full border border-slate-300 shadow-2xs text-[10px] font-black">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-[#0D9488] text-white shadow-2xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-[#0D9488] text-white shadow-2xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="हिंदी में बदलें"
              >
                हिंदी
              </button>
            </div>

            {/* App Guide Entry Button */}
            <button
              type="button"
              onClick={() => openGuideAtStep(0)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F766E] bg-teal-50 hover:bg-teal-100/90 border border-teal-300 px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              title="Open Interactive Feature Tutorial"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>{language === "hi" ? "ऐप गाइड" : "App Guide"}</span>
            </button>

            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-teal-700 px-3.5 py-2 rounded-full border border-slate-300 hover:bg-amber-100/60 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>
                {isVerified
                  ? language === "hi"
                    ? "पुनः फेस सत्यापन"
                    : "Re-verify Face"
                  : language === "hi"
                  ? "अकाउंट सत्यापन"
                  : "Verify Account"}
              </span>
            </Link>

            <Link
              href={primaryTarget}
              className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-black py-2.5 px-4 sm:px-5 rounded-full shadow-md shadow-teal-900/15 transition-all hover:shadow-teal-900/25 active:scale-95"
            >
              <span>
                {isVerified
                  ? language === "hi"
                    ? "ऐप शुरू करें (/app)"
                    : "Launch App (/app)"
                  : language === "hi"
                  ? "ऐप शुरू करें"
                  : "Launch App"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Semantic Main Content Landmark for Google PageSpeed & WCAG Accessibility */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-900 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>
                    {language === "hi"
                      ? "महिला यात्रियों के लिए स्मार्ट ट्रांजिट-हब पेयरिंग"
                      : "Smart Transit-Hub Pairing for Women Commuters"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                  {language === "hi" ? (
                    <>
                      घर तक आपका सुरक्षित, साझा{" "}
                      <span className="text-[#0D9488] underline decoration-[#F97316] decoration-wavy decoration-2">
                        अंतिम मील सफर।
                      </span>
                    </>
                  ) : (
                    <>
                      Your Safe, Shared{" "}
                      <span className="text-[#0D9488] underline decoration-[#F97316] decoration-wavy decoration-2">
                        Last-Mile Home.
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  {language === "hi"
                    ? "मेट्रो व रेलवे स्टेशन रोशनी व कैमरों से सुरक्षित होते हैं, लेकिन घर तक का अंतिम 1–2 किमी सफर अंधेरा, महंगा और अकेला होता है। सहेलीमाइल एक ही दिशा में जाने वाली सत्यापित महिलाओं को कम्युनिटी-रेटेड ऑटो और 50% तय किराए पर जोड़ता है।"
                    : "Transit hubs like metro stations and railway terminals are well-lit and monitored. But the final 1–2 km stretch home is dark, expensive, and isolated. SaheliMile connects verified women exiting together along overlapping routes with community-vouched autos."}
                </p>

                {/* Value Highlights Pill list */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                    <span>
                      {language === "hi"
                        ? "सत्यापित कॉलेज व ऑफिस पहचान पत्र"
                        : "Verified Corporate & College IDs"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs">
                    <IndianRupee className="w-4 h-4 text-[#F97316]" />
                    <span>
                      {language === "hi"
                        ? "50% तय ऑटो किराया छूट"
                        : "50% Auto Fare Split"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs">
                    <HeartHandshake className="w-4 h-4 text-[#0D9488]" />
                    <span>
                      {language === "hi"
                        ? "ऑटोमेटेड सेफ-ड्रॉप हैंडशेक"
                        : "Automated Safe-Drop Handshake"}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
                  <Link
                    href={primaryTarget}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-extrabold text-base py-3.5 px-7 rounded-2xl shadow-xl shadow-teal-900/20 hover:shadow-teal-900/30 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>
                      {isVerified
                        ? language === "hi"
                          ? `${userName?.split(" ")[0]} के रूप में जारी रखें →`
                          : `Continue as ${userName?.split(" ")[0]} →`
                        : language === "hi"
                        ? "सत्यापन शुरू करें (लाइव फेस AI)"
                        : "Get Started (Live Face AI Verification)"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Secondary Interactive Tutorial Button */}
                  <button
                    type="button"
                    onClick={() => openGuideAtStep(0)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100/90 text-teal-950 font-extrabold text-sm py-3.5 px-6 rounded-2xl border-2 border-teal-400 shadow-sm transition-all cursor-pointer active:scale-95 hover:border-teal-500"
                  >
                    <Sparkles className="w-4 h-4 text-[#F97316]" />
                    <span>
                      {language === "hi"
                        ? "फ़ीचर ट्यूटोरियल (6 स्टेप्स)"
                        : "Interactive Tutorial (6 Steps)"}
                    </span>
                  </button>

                  <Link
                    href="/app?demo=true"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm py-3.5 px-6 rounded-2xl border border-slate-300 shadow-sm transition-all active:scale-95"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping" />
                    <span>
                      {language === "hi"
                        ? "1-क्लिक पायलट डेमो"
                        : "1-Click Pilot Demo"}
                    </span>
                  </Link>
                </div>

                <div className="pt-2 text-xs text-slate-600 font-semibold">
                  {language === "hi"
                    ? "⚡ बिना किसी ऐप स्टोर डाउनलोड के तुरंत PWA के रूप में चलाएं"
                    : "⚡ Zero install required • Runs instantly as a Progressive Web App (PWA)"}
                </div>
              </div>

              {/* Right Interactive Component */}
              <div className="lg:col-span-5">
                <RouteOverlapPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Primary Commuter Research & Pilot Survey Findings (N = 13 Verified Commuters) */}
        <section id="problem" className="py-16 sm:py-24 bg-white border-y border-amber-200/50 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Section Header with Transparent Sample Badge */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#F97316] bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                  <span>
                    {language === "hi"
                      ? "प्राथमिक पायलट सर्वेक्षण (N = 13 सत्यापित दैनिक यात्री)"
                      : "Primary Pilot Survey (N = 13 Verified Commuters)"}
                  </span>
                </span>

                <span className="text-[11px] font-extrabold text-teal-900 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {language === "hi"
                    ? "सैंपल: 53.8% महिलाएं • 46.2% पुरुष"
                    : "Demographics: 53.8% Female • 46.2% Male"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {language === "hi"
                  ? "अंतिम 1.5 किमी का जमीनी सर्वेक्षण डेटा"
                  : "Real Commuter Data Behind the Last-Mile Gap"}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
                {language === "hi"
                  ? "रात 8 बजे के बाद भोपाल व टियर-2 स्टेशनों (रानी कमलापति, एम्स मेट्रो) से घर लौटने वाले वास्तविक दैनिक यात्रियों से एकत्रित 100% सत्यापित डेटा।"
                  : "100% verified primary field data collected from urban commuters exiting railway and metro hubs after dark."}
              </p>

              {/* Google Form Link Button */}
              <div className="pt-1">
                <a
                  href="https://docs.google.com/forms/d/1edAnanUOB2yZp5y3EvPWA6jCQDE4mMzCH29rsy0SAQ4/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F766E] hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-4 py-2 rounded-full transition-all shadow-2xs hover:shadow-xs"
                >
                  <span>
                    {language === "hi"
                      ? "लाइव Google फॉर्म सर्वेक्षण देखें / भाग लें"
                      : "View Live Google Form Survey"}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F97316]" />
                </a>
              </div>
            </div>

            {/* 4 Core Quantitative Stat Cards (100% Real Field Data) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: 92.4% Route Alteration */}
              <div className="p-6 rounded-3xl bg-[#FFFBEB] border-2 border-orange-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center font-black">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    92.4%
                  </div>
                  <div className="text-xs font-mono font-bold text-[#F97316] -mt-2">
                    (12 / 13 Commuters)
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {language === "hi"
                      ? "रूट बदलना या रात 8 बजे बाद सफर रोकना"
                      : "Route Alteration & Post-8 PM Travel Curtailment"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {language === "hi"
                      ? "कम रोशनी, कम आवाजाही और असुरक्षित साधनों के कारण रात 8 बजे बाद अंदरूनी कॉलोनियों में जाने से बचते हैं या लंबा रास्ता लेते हैं।"
                      : "Alter routes or curtail post-8:00 PM travel due to poor lighting, low footfall, or unreliable last-mile transit."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/80 text-[10px] font-bold text-orange-900 bg-orange-100/70 px-2.5 py-1.5 rounded-xl text-center">
                  46.2% Frequently • 46.2% Occasionally • 0% Unaffected
                </div>
              </div>

              {/* Card 2: 77.0% Adoption Readiness */}
              <div className="p-6 rounded-3xl bg-[#FFFBEB] border-2 border-teal-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-100 text-[#0D9488] flex items-center justify-center font-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    77.0%
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0D9488] -mt-2">
                    (10 / 13 Commuters)
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {language === "hi"
                      ? "सत्यापित सह-यात्री साझा ऑटो अपनाने को तैयार"
                      : "Ready to Adopt Verified Peer-Paired Auto"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {language === "hi"
                      ? "सत्यापित पहचान व 50% किराया छूट के साथ स्टेशन से साझा ऑटो लेने के लिए तत्काल तैयार हैं।"
                      : "Ready to adopt verified peer-paired shared transit with ~50% auto fare split."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/80 text-[10px] font-bold text-teal-900 bg-teal-100/80 px-2.5 py-1.5 rounded-xl text-center">
                  30.8% Very Likely • 46.2% Verified Protocol • 0% Unlikely
                </div>
              </div>

              {/* Card 3: 38.5% Short Distance Refusals */}
              <div className="p-6 rounded-3xl bg-[#FFFBEB] border-2 border-emerald-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    38.5%
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-800 -mt-2">
                    (5 / 13 Commuters)
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {language === "hi"
                      ? "कम दूरी पर ऑटो चालकों का जाने से इनकार"
                      : "Short-Distance Auto Refusal Friction"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {language === "hi"
                      ? "स्टेशन से 1–2 किमी अंदरूनी कॉलोनियों में जाने से ऑटो चालकों का मना करना सबसे बड़ी स्टेशन बाधा बताया।"
                      : "Cite short-distance auto driver refusals for interior residential drops as their #1 station friction point."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/80 text-[10px] font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1.5 rounded-xl text-center">
                  #1 Station Friction • Solved by &apos;Show Driver Card&apos;
                </div>
              </div>

              {/* Card 4: 53.9% Accountability & Dark Streets */}
              <div className="p-6 rounded-3xl bg-[#FFFBEB] border-2 border-rose-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    53.9%
                  </div>
                  <div className="text-xs font-mono font-bold text-rose-700 -mt-2">
                    (7 / 13 Commuters)
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {language === "hi"
                      ? "ड्राइवर जवाबदेही का अभाव व अंधेरी सड़कें"
                      : "Driver Accountability & Dark Streets Barrier"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {language === "hi"
                      ? "ड्राइवर की पहचान/लाइव विजिबिलिटी न होना (30.8%) और अंधेरी गलियां (23.1%) मुख्य सुरक्षा बाधा हैं।"
                      : "Identify lack of driver accountability/live visibility (30.8%) and unlit interior roads (23.1%) as critical barriers."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/80 text-[10px] font-bold text-rose-900 bg-rose-100/80 px-2.5 py-1.5 rounded-xl text-center">
                  30.8% Accountability Gap • 23.1% Unlit Interior Roads
                </div>
              </div>
            </div>

            {/* Real Commuter Voices Quotes Showcase */}
            <div className="bg-gradient-to-r from-amber-50/80 via-white to-teal-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0D9488]" />
                  <span>
                    {language === "hi"
                      ? "दैनिक यात्रियों की सीधी आवाजें (क्वालिटेटिव फीडबैक)"
                      : "Real Commuter Voices (Qualitative Responses)"}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-teal-900 bg-teal-100/90 px-2.5 py-0.5 rounded-full">
                  Primary Survey Field Submissions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quote 1 */}
                <div className="p-4 rounded-2xl bg-white border border-teal-200/80 shadow-2xs space-y-2 relative">
                  <div className="text-2xl text-teal-600 font-serif leading-none select-none">
                    “
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed font-medium">
                    {language === "hi"
                      ? "ड्राइवर सत्यापन, लाइव ट्रिप ट्रैकिंग और आपातकालीन सहायता महिला यात्रियों को सफर के दौरान अधिक सुरक्षित और सहज महसूस कराएगी।"
                      : "Driver verification, live trip tracking, and emergency support would help female commuters feel safer and more comfortable while travelling."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-slate-900">
                      — Primary Survey Respondent
                    </span>
                    <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                      Daily Transit Commuter
                    </span>
                  </div>
                </div>

                {/* Quote 2 */}
                <div className="p-4 rounded-2xl bg-white border border-orange-200/80 shadow-2xs space-y-2 relative">
                  <div className="text-2xl text-orange-500 font-serif leading-none select-none">
                    “
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed font-medium">
                    {language === "hi"
                      ? "सत्यापित सह-यात्रियों और कम्युनिटी-रेटेड ऑटो से अंतिम मील सुरक्षा का समाधान शानदार है — एक मजबूत यूजर बेस बनाने के लिए पहले किसी व्यस्त कॉलेज या ऑफिस मेट्रो स्टेशन से शुरुआत करें।"
                      : "Solving last-mile safety with verified co-passengers and community-rated autos is brilliant—just start with one busy college or office metro station first to build a strong user base."}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-slate-900">
                      — Primary Survey Respondent
                    </span>
                    <span className="text-[10px] text-orange-900 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                      College Student / Urban Commuter
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Feature Showcase Section (Step-by-Step Guide) */}
        <section id="features-guide" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFFBEB] via-white to-[#FFFBEB]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0F766E] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
                {language === "hi"
                  ? "संपूर्ण प्रोडक्ट गाइड व तकनीक"
                  : "Comprehensive Product Tour"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {language === "hi"
                  ? "सहेलीमाइल के हर फ़ीचर की कार्यप्रणाली"
                  : "How Every Feature Works (Step-by-Step Guide)"}
              </h2>
              <p className="text-sm sm:text-base text-slate-700">
                {language === "hi"
                  ? "जज और नए यात्रियों के लिए विस्तृत व इंटरैक्टिव तकनीकी विवरण। किसी भी कार्ड पर क्लिक करके डीप-डाइव ट्यूटोरियल खोलें।"
                  : "Click any micro-feature pill below to launch the interactive walkthrough modal with live UI mockups and direct testing links."}
              </p>
            </div>

            {/* 6 Clickable Feature Pills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURE_SHOWCASE_ITEMS.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.step}
                    onClick={() => openGuideAtStep(idx)}
                    className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                          {item.step}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${item.accentBg}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <IconComp className="w-5 h-5 text-[#0D9488] group-hover:text-[#F97316] transition-colors flex-shrink-0" />
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-950">
                      <span>{language === "hi" ? "ट्यूटोरियल खोलें" : "Open Tutorial"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Full Tour Banner */}
            <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base sm:text-lg font-black tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>
                    {language === "hi"
                      ? "क्या आप सभी 6 स्टेप्स एक साथ देखना चाहते हैं?"
                      : "Ready to explore the full 6-step walkthrough?"}
                  </span>
                </h4>
                <p className="text-xs text-teal-200">
                  {language === "hi"
                    ? "बायोमेट्रिक से लेकर सेफ-ड्रॉप हैंडशेक और 24×7 सेफ-हेवन तक हर फ़ीचर की लाइव जांच करें।"
                    : "Explore facial liveness AI, dual search, driver cards, crowdsourced auto ledger, and live tracking."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openGuideAtStep(0)}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>{language === "hi" ? "पूरा गाइड शुरू करें →" : "Start Guided Tour →"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3-Step 'How It Works' Section */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0F766E] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {language === "hi" ? "सरल 3-चरणीय प्रक्रिया" : "Simple 3-Step Flow"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {language === "hi" ? "सहेलीमाइल कैसे काम करता है" : "How SaheliMile Works"}
              </h2>
              <p className="text-sm sm:text-base text-slate-700">
                {language === "hi"
                  ? "स्टेशन के निकास गेट पर तुरंत बिना किसी परेशानी के उपयोग हेतु निर्मित।"
                  : "Designed for zero friction right at the transit station exit gate."}
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
                    {language === "hi" ? "साझा रूट का मिलान" : "Match Overlapping Routes"}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {language === "hi"
                      ? "अपना स्टेशन व ड्रॉप पॉइंट चुनें। हमारा OSRM एल्गोरिदम ≥ 65% समान मार्ग वाली सह-यात्रियों को तुरंत जोड़ता है।"
                      : "Select your exit station and destination pin. Our OSRM + Haversine algorithm scans co-riders with ≥ 65% route overlap heading down your corridor."}
                  </p>
                </div>
                <div className="p-3 bg-teal-50/70 rounded-xl text-xs font-bold text-teal-950 flex items-center gap-2 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>
                    {language === "hi"
                      ? "सत्यापित ऑफिस ईमेल व कॉलेज पहचान पत्र"
                      : "Verified corporate email & college ID badges"}
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-sm relative flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white flex items-center justify-center text-lg font-black shadow-md shadow-orange-700/20 mb-6">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {language === "hi" ? "कम्युनिटी रेटेड ऑटो पर भरोसा" : "Trust the Vouched Ride"}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {language === "hi"
                      ? "कम्युनिटी द्वारा जाँचे गए ऑटो में बैठें। ऑटो नंबर प्लेट जांचकर देखें कि उन्होंने महिला यात्रियों के साथ कितनी सुरक्षित यात्राएं की हैं।"
                      : "Board community-vouched auto and e-rickshaw drivers. Scan their QR or verify their masked plate to see total women-safe rides completed at that hub."}
                  </p>
                </div>
                <div className="p-3 bg-orange-50/70 rounded-xl text-xs font-bold text-orange-950 flex items-center gap-2 border border-orange-100">
                  <QrCode className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>
                    {language === "hi"
                      ? "कम्युनिटी सुरक्षा रेटिंग व प्राइवेसी मास्क प्लेट"
                      : "Community trust stamps & masked privacy plates"}
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm relative flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-700/20 mb-6">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {language === "hi" ? "सुरक्षित ड्रॉप हैंडशेक" : "Safe-Drop Handshake"}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {language === "hi"
                      ? "जब पहली सहेली अपने स्टॉप पर उतरती है, तो दूसरी सहेली के लिए कम्फर्ट गार्डियन मोड और परिजनों के लिए लाइव ट्रैकिंग अपने आप चालू हो जाती है।"
                      : "When Rider 1 reaches her stop and drops off, Comfort Guardian Mode automatically triggers for Rider 2 with live tracking until she confirms safe home arrival."}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-xl text-xs font-bold text-emerald-950 flex items-center gap-2 border border-emerald-100">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    {language === "hi"
                      ? "स्वचालित 2-चरणीय यात्रा सुरक्षा हैंडओवर"
                      : "Automatic 2-stage trip security handover"}
                  </span>
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
                  {language === "hi" ? "भय-मुक्त सकारात्मक डिज़ाइन" : "Zero Fear-Based Design"}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {language === "hi"
                    ? "उच्च भरोसा। आत्मीय कम्युनिटी। आत्मविश्वासी सफर।"
                    : "High Trust. Warm Community. Confident Mobility."}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {language === "hi"
                    ? "ज्यादातर सुरक्षा ऐप केवल पैनिक बटन और सायरन पर निर्भर होते हैं। सहेलीमाइल सक्रिय सामाजिक सुरक्षा, सत्यापित पहचान और रीयल-टाइम परस्पर सहयोग से वास्तविक सुरक्षा देता है।"
                    : "Most safety tools rely on panic buttons and dark emergency alarms. SaheliMile builds safety through proactive social architecture, verified credentials, and real-time mutual accountability."}
                </p>

                <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-400" />
                    <span>
                      {language === "hi"
                        ? "प्राइवेसी प्रथम: मास्क की गई ऑटो नंबर प्लेट व गोपनीय संपर्क"
                        : "Privacy First: Masked auto plates & encrypted contact routing"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>
                      {language === "hi"
                        ? "स्क्रीन पर पारदर्शी 50/50 मीटर किराया बंटवारा"
                        : "Transparent 50/50 fare splitting right on the screen"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 text-center">
                <div className="text-3xl font-extrabold text-orange-400">
                  {language === "hi" ? "शहरी पायलट के लिए तैयार" : "Ready for City Pilots"}
                </div>
                <p className="text-xs text-slate-300">
                  {language === "hi"
                    ? "रानी कमलापति स्टेशन के वास्तविक डेटा के साथ अपने ब्राउज़र में तुरंत मोबाइल ऐप का अनुभव लें।"
                    : "Experience the interactive mobile shell on your browser right now with synthetic demo data for Rani Kamalapati Station."}
                </p>
                <Link
                  href="/app"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  <span>
                    {language === "hi"
                      ? "मोबाइल वेब ऐप खोलें"
                      : "Open Mobile Web App"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Pilot Support Section */}
        <section
          id="contact"
          className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFBEB] via-white to-[#FFFBEB] border-t border-amber-200/60 px-4 sm:px-6"
        >
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full text-xs font-bold text-[#0D9488]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>
                  {language === "hi"
                    ? "सीधा संपर्क और सहायता"
                    : "Direct Contact & Pilot Support"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === "hi"
                  ? "संपर्क और पायलट सहायता"
                  : "Contact & Pilot Support"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {language === "hi"
                  ? "पायलट फीडबैक, कम्युनिटी सुझाव या साझेदारी के लिए सीधे हमारी टीम से संपर्क करें।"
                  : "Reach out for pilot feedback, community suggestions, or city transit partnerships."}
              </p>
            </div>

            {/* 3 Mobile-Responsive Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Founder & Pilot Lead */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0D9488]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === "hi"
                        ? "संस्थापक और पायलट लीड"
                        : "Founder / Pilot Lead"}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      Anand Gautam
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {language === "hi"
                        ? "सहेलीमाइल इनिशिएटिव • भोपाल कम्यूटर पायलट"
                        : "SaheliMile Initiative • Bhopal Commuter Pilot"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {language === "hi" ? "पायलट सक्रिय" : "Pilot Active"}
                  </span>
                </div>
              </div>

              {/* Card 2: Official Support Email */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === "hi"
                        ? "आधिकारिक ईमेल"
                        : "Official Support Email"}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5 break-all">
                      sahelimile@gmail.com
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {language === "hi"
                        ? "पूछताछ, फीडबैक या तकनीकी सहायता के लिए लिखें।"
                        : "Write to us for queries, feedback, or partnerships."}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="mailto:sahelimile@gmail.com"
                    className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>
                      {language === "hi" ? "ईमेल भेजें" : "Send an Email"}
                    </span>
                  </a>
                </div>
              </div>

              {/* Card 3: Official Social Channels */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                    <AtSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === "hi"
                        ? "आधिकारिक सोशल मीडिया"
                        : "Official Social Channels"}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      @sahelimile
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {language === "hi"
                        ? "दैनिक अपडेट्स और सुरक्षा अभियानों के लिए जुड़ें।"
                        : "Follow daily updates and safety campaigns."}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <a
                    href="https://instagram.com/sahelimile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-opacity"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-none stroke-current"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://x.com/Sahelimile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#0F172A] text-slate-400 py-12 px-4 sm:px-6 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Lead */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <img
                src="/icon-192.png"
                alt="SaheliMile Logo"
                className="w-6 h-6 rounded-md object-cover"
              />
              <span>SaheliMile</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === "hi"
                ? "घर तक आपका सुरक्षित, साझा अंतिम मील सफर। ट्यूटड्यूड बिल्डाथॉन (सिटीफिक्स चैलेंज) के लिए निर्मित।"
                : "Your Safe, Shared Last-Mile Home. Built for the TuteDude Buildathon (CityFix Challenge)."}
            </p>
            <div className="pt-1 text-[11px] text-slate-300">
              <span className="text-slate-500 block">
                {language === "hi"
                  ? "संस्थापक और पायलट लीड:"
                  : "Founder / Pilot Lead:"}
              </span>
              <span className="font-bold text-white text-xs">Anand Gautam</span>
            </div>
          </div>

          {/* Col 2: Contact & Social */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              {language === "hi" ? "संपर्क और सोशल" : "Contact & Support"}
            </h4>
            <div className="space-y-2.5">
              <a
                href="mailto:sahelimile@gmail.com"
                className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span className="truncate group-hover:underline">
                  sahelimile@gmail.com
                </span>
              </a>
              <a
                href="https://instagram.com/sahelimile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors group"
              >
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current text-pink-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>
                  Instagram:{" "}
                  <span className="font-semibold text-white">@sahelimile</span>
                </span>
              </a>
              <a
                href="https://x.com/Sahelimile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors group"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current text-sky-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>
                  X (Twitter):{" "}
                  <span className="font-semibold text-white">@Sahelimile</span>
                </span>
              </a>
            </div>
          </div>

          {/* Col 3: Design System & Brand Kit */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              {language === "hi"
                ? "डिज़ाइन सिस्टम व ब्रांड किट"
                : "Design System & Brand Kit"}
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

          {/* Col 4: Project Resources */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              {language === "hi" ? "प्रोजेक्ट संसाधन" : "Project Resources"}
            </h4>
            <div className="space-y-2">
              <a
                href="https://github.com/anandgautam1610/sahelimile.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {language === "hi" ? "गिटहब रिपॉजिटरी" : "GitHub Repository"}
                </span>
              </a>
              <a
                href="/SaheliMile_Brand_Kit.pdf"
                target="_blank"
                download
                className="flex items-center gap-1.5 hover:text-white transition-colors text-teal-400 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {language === "hi"
                    ? "ब्रांड किट डाउनलोड (PDF)"
                    : "Download Brand Kit (PDF)"}
                </span>
              </a>
              <a
                href="https://docs.google.com/forms/d/1edAnanUOB2yZp5y3EvPWA6jCQDE4mMzCH29rsy0SAQ4/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors text-amber-300 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {language === "hi"
                    ? "प्राथमिक कम्यूटर सर्वे (Google फॉर्म)"
                    : "Primary Commuter Survey (Google Form)"}
                </span>
              </a>
              <Link
                href="/app"
                className="block hover:text-white transition-colors"
              >
                {language === "hi"
                  ? "पायलट PWA वेब ऐप (/app)"
                  : "Pilot PWA Web App (/app)"}
              </Link>
              <button
                type="button"
                onClick={() => openGuideAtStep(0)}
                className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === "hi"
                    ? "इंटरैक्टिव फ़ीचर गाइड (6 स्टेप्स)"
                    : "Interactive Feature Guide (6 Steps)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-3 text-center text-slate-300 text-[11px] border-b border-slate-800/80 mb-6 font-semibold">
          {language === "hi"
            ? "लाइव पैन-इंडिया रूटिंग • सत्यापित N=13 यात्री पायलट"
            : "Live Pan-India Routing • Verified N=13 Commuter Pilot"}
        </div>

        <div className="max-w-6xl mx-auto pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <span>
            {language === "hi"
              ? "© 2026 सहेलीमाइल • Next.js, Leaflet और OpenStreetMap द्वारा निर्मित"
              : "© 2026 SaheliMile • Built with Next.js, Leaflet, and OpenStreetMap"}
          </span>
          <span className="font-semibold text-teal-400">#BuildForMyCity #CityFixChallenge</span>
        </div>
      </footer>

      {/* 6-Step Interactive Feature Walkthrough Modal with explicit lang passed */}
      <InteractiveGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialStep={guideInitialStep}
        lang={language}
      />
    </div>
  );
}
