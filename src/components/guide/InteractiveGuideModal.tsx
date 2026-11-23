"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Camera,
  MapPin,
  Crosshair,
  Compass,
  QrCode,
  HeartHandshake,
  ShieldAlert,
  PhoneCall,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  Store,
  Navigation,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InteractiveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
  lang?: "en" | "hi";
}

interface GuideStep {
  id: number;
  route: string;
  category: { en: string; hi: string };
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  highlights: {
    icon: React.ElementType;
    title: { en: string; hi: string };
    desc: { en: string; hi: string };
  }[];
  mockUi: {
    badge: { en: string; hi: string };
    content: React.ReactNode;
  };
  ctaLabel: { en: string; hi: string };
}

export default function InteractiveGuideModal({
  isOpen,
  onClose,
  initialStep = 0,
  lang,
}: InteractiveGuideModalProps) {
  const { language: contextLang, setLanguage } = useLanguage();
  const language = lang || contextLang;

  useEffect(() => {
    if (lang && lang !== contextLang) {
      setLanguage(lang);
    }
  }, [lang, contextLang, setLanguage]);

  const [currentStep, setCurrentStep] = useState(initialStep);

  // Sync initialStep when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(Math.min(Math.max(0, initialStep), 5));
    }
  }, [isOpen, initialStep]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
      } else if (e.key === "ArrowLeft") {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const STEPS: GuideStep[] = [
    // Step 1: Anti-Spoofing 3-Blink Liveness Login
    {
      id: 1,
      route: "/login",
      category: {
        en: "Biometric Security • Client-Side Face AI",
        hi: "बायोमेट्रिक सुरक्षा • ऑन-डिवाइस फेस AI",
      },
      title: {
        en: "Anti-Spoofing 3-Blink Face AI Verification",
        hi: "एंटी-स्पूफिंग 3-ब्लिंक फेस AI वेरिफिकेशन",
      },
      subtitle: {
        en: "Real-time front-camera verification that prevents static photo spoofing while keeping biometric data 100% on-device.",
        hi: "लाइव फ्रंट-कैमरा जांच जो फोटो स्पूफिंग रोकती है और बायोमेट्रिक डेटा को 100% यूजर के फोन में सुरक्षित रखती है।",
      },
      highlights: [
        {
          icon: Eye,
          title: {
            en: "Eye Aspect Ratio (EAR) 3-Blink Counter",
            hi: "आई एस्पेक्ट रेशियो (EAR) 3-ब्लिंक डिटेक्शन",
          },
          desc: {
            en: "Calculates eyelid opening/closure transitions (EAR < 0.22) using 68 facial landmarks. Static paper or phone photos cannot bypass this gate.",
            hi: "68 फेशियल लैंडमार्क द्वारा पलक झपकाने का सटीक मापन। फोन स्क्रीन या प्रिंटेड फोटो से इसे बायपास नहीं किया जा सकता।",
          },
        },
        {
          icon: Lock,
          title: {
            en: "100% Zero-Backend Privacy",
            hi: "100% ऑन-डिवाइस प्राइवेसी (जीरो बैकएंड)",
          },
          desc: {
            en: "Powered by @vladmandic/face-api running entirely inside the commuter's browser. No facial images or embeddings are ever uploaded to a server.",
            hi: "ब्राउज़र में रन होने वाला क्लाइंट-साइड मॉडल। कोई भी फोटो या फेशियल डेटा किसी सर्वर पर अपलोड नहीं होता।",
          },
        },
        {
          icon: Sparkles,
          title: {
            en: "1-Tap Judge Demo Bypass",
            hi: "1-टैप जज डेमो एक्सेस",
          },
          desc: {
            en: "Evaluators without front-facing webcams can click 'No Camera / Judge Demo Access' to test the verified commuter experience immediately.",
            hi: "यदि कैमरा उपलब्ध न हो, तो जज सीधे 1-टैप डेमो बटन द्वारा सत्यापित कम्यूटर अनुभव की जांच कर सकते हैं।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Live Camera Viewfinder Mockup",
          hi: "लाइव कैमरा व्यूफाइंडर मॉकअप",
        },
        content: (
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-teal-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>TinyFaceDetector + AgeGenderNet</span>
              </span>
              <span className="font-mono text-slate-400">FPS: 30 • EAR: 0.28</span>
            </div>

            <div className="relative w-28 h-28 mx-auto rounded-full border-3 border-teal-500 shadow-lg shadow-teal-500/20 flex flex-col items-center justify-center bg-slate-800/80">
              <span className="text-3xl">👩‍💼</span>
              <span className="text-[9px] font-extrabold text-teal-300 mt-1">
                LIVENESS OK
              </span>
            </div>

            {/* 3 Blink Dots */}
            <div className="flex items-center justify-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
                ✓ Blink 1
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
                ✓ Blink 2
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
                ✓ Blink 3
              </span>
            </div>

            <div className="text-center text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-xl py-1.5 px-3">
              Verified Female Commuter • 98.4% Confidence
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Try Face AI Verification (/login) →",
        hi: "फेस AI वेरिफिकेशन आज़माएं (/login) →",
      },
    },

    // Step 2: Pan-India Dual Search & Map Pin-Drop
    {
      id: 2,
      route: "/app",
      category: {
        en: "Transit Search • Pan-India Coverage",
        hi: "ट्रांजिट खोज • अखिल भारतीय कवरेज",
      },
      title: {
        en: "Dual Fuzzy Search & Rapido-Style Pin-Drop",
        hi: "डुअल फ़ज़ी सर्च व मैप पिन-ड्रॉप मोड",
      },
      subtitle: {
        en: "Locate local neighborhood sweets shops, metro gates, or pick exact map spots across all Indian cities without paid Google Maps APIs.",
        hi: "बिना किसी सशुल्क गूगल मैप्स API के किसी भी शहर की स्थानीय दुकानों, मेट्रो गेटों या सटीक पिन द्वारा लोकेशन सेट करें।",
      },
      highlights: [
        {
          icon: Compass,
          title: {
            en: "Parallel Photon + OSM Nominatim Engine",
            hi: "समानांतर फ़ोटॉन + OSM नोमिनेटिम इंजन",
          },
          desc: {
            en: "Queries both Komoot Photon & OpenStreetMap in parallel using Promise.allSettled, deduplicating nearby points within 120m for hyper-local accuracy.",
            hi: "Promise.allSettled द्वारा दोनों इंजनों से एक साथ खोज। 120 मीटर के भीतर के स्थानों को स्वचालित रूप से मर्ज करता है।",
          },
        },
        {
          icon: Crosshair,
          title: {
            en: "Rapido-Style Interactive Pin-Drop",
            hi: "रैपिडो-स्टाइल इंटरैक्टिव पिन-ड्रॉप",
          },
          desc: {
            en: "Drag and zoom the map with a fixed center crosshair. Reverse-geocodes live road names and lets commuters type custom shop landmarks.",
            hi: "नक्शे को खिसकाकर सटीक स्थान पर पिन रखें। सड़क का नाम स्वतः पहचानता है और मनपसंद दुकान/लैंडमार्क लिखने की सुविधा देता है।",
          },
        },
        {
          icon: Navigation,
          title: {
            en: "1-Tap GPS Live Pickup",
            hi: "1-टैप लाइव GPS पिकअप",
          },
          desc: {
            en: "Commuters exiting station gates tap 'Use GPS' to automatically reverse-geocode their live coordinates to the nearest entrance gate.",
            hi: "स्टेशन गेट से बाहर निकलते समय 'GPS चालू करें' दबाकर तुरंत अपने लाइव स्थान को पिकअप पॉइंट बनाएं।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Dual Search & Pin Drop Card",
          hi: "सर्च व पिन ड्रॉप कार्ड",
        },
        content: (
          <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-sm space-y-3">
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
                  <span className="font-extrabold text-slate-800">
                    Barauni Junction (Gate 1)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#F97316]" />
                  <span className="font-extrabold text-slate-800">
                    Gangaram Sweets, Barauni
                  </span>
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  Photon Matched
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-orange-400" />
                <span className="font-bold">Pin-Drop Center: 23.2098, 77.4278</span>
              </div>
              <span className="text-orange-400 font-extrabold">Confirm Spot ✓</span>
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Try Location Search & Pin-Drop (/app) →",
        hi: "स्थान खोज व पिन-ड्रॉप आज़माएं (/app) →",
      },
    },

    // Step 3: Real-Road OSRM Routing & 'Show Driver Card'
    {
      id: 3,
      route: "/app?demo=true",
      category: {
        en: "Routing & Pricing • Zero Haggling",
        hi: "रूट व किराया • मोलभाव से मुक्ति",
      },
      title: {
        en: "Real-Road OSRM Routing & 'Show Driver' Fare Card",
        hi: "वास्तविक सड़क रूट व 'ड्राईवर को दिखाएं' कार्ड",
      },
      subtitle: {
        en: "Eliminates auto stand bargaining with exact 50/50 split meter fares and mutual 4-digit boarding PINs.",
        hi: "पहले से तय 50/50 मीटर किराया और 4-अंकीय सहेली बोर्डिंग पिन द्वारा स्टेशन पर मोलभाव से पूरी मुक्ति।",
      },
      highlights: [
        {
          icon: MapPin,
          title: {
            en: "OSRM Real Road Polylines",
            hi: "OSRM वास्तविक सड़क मार्ग",
          },
          desc: {
            en: "No straight-line guesses: computes real road driving distance, travel duration, and corridor overlap percentage.",
            hi: "हवाई दूरी नहीं: वास्तविक सड़कों के आधार पर सटीक दूरी, अनुमानित समय और ओवरलैप प्रतिशत का आकलन।",
          },
        },
        {
          icon: FileText,
          title: {
            en: "'Show Driver Card' (ड्राईवर को दिखाएं)",
            hi: "ड्राईवर को दिखाएं (Show Driver Card)",
          },
          desc: {
            en: "Large Hindi + English typography modal showing origin, destination, road km, and split total (₹45 + ₹45 = ₹90) to show drivers directly.",
            hi: "बड़े हिंदी-अंग्रेजी अक्षरों में तैयार कार्ड जिसे सीधे ऑटो चालक को दिखाकर तय किराए पर आसानी से बैठा जा सकता है।",
          },
        },
        {
          icon: ShieldCheck,
          title: {
            en: "Mutual 4-Digit Saheli PIN",
            hi: "पारस्परिक 4-अंकीय सहेली पिन",
          },
          desc: {
            en: "Both matched co-riders see the identical 4-digit PIN (e.g. 4829) on their screens to verify each other visually at crowded gates.",
            hi: "भीड़भाड़ वाले स्टेशन गेट पर दोनों सहेलियां अपनी स्क्रीन पर एक ही 4-अंकीय पिन देखकर एक-दूसरे की पहचान करती हैं।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Driver Fare Card & Saheli PIN Mockup",
          hi: "ड्राईवर किराया कार्ड व सहेली पिन",
        },
        content: (
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-2xl p-4 text-white space-y-3 border border-teal-500/30">
            <div className="flex items-center justify-between border-b border-teal-800 pb-2">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-orange-400">
                  Saheli Boarding PIN
                </span>
                <div className="text-2xl font-black tracking-widest text-white mt-0.5">
                  4 8 2 9
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-teal-300 font-bold block">
                  Fair 50/50 Split
                </span>
                <span className="text-xl font-extrabold text-orange-400">
                  ₹45 + ₹45 = ₹90
                </span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Corridor:</span>
                <span className="text-white font-bold">Rani Kamalapati → Arera E-6</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Road Distance:</span>
                <span className="text-teal-300 font-bold">3.4 km (~9 mins)</span>
              </div>
            </div>

            <div className="text-center text-[10px] font-bold text-teal-200 bg-teal-950/80 rounded-lg py-1">
              Show this official screen to the auto driver at the stand
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Inspect Driver Card & PIN (/app) →",
        hi: "किराया कार्ड व पिन देखें (/app) →",
      },
    },

    // Step 4: Crowdsourced Community Auto Ledger
    {
      id: 4,
      route: "/app",
      category: {
        en: "Zero-Hardware Safety • Community Trust",
        hi: "जीरो-हार्डवेयर सुरक्षा • कम्युनिटी भरोसा",
      },
      title: {
        en: "Crowdsourced Community Auto Ledger",
        hi: "कम्युनिटी ऑटो सुरक्षा लेजर (Crowdsourced)",
      },
      subtitle: {
        en: "Look up or review any auto by its registration plate before or after boarding—requiring zero physical QR stickers on Day 1.",
        hi: "बिना किसी फिजिकल QR स्टिकर के किसी भी ऑटो का नंबर प्लेट जांचें या सुरक्षित यात्रा के बाद रिव्यू जोड़ें।",
      },
      highlights: [
        {
          icon: QrCode,
          title: {
            en: "Instant Auto Plate Search",
            hi: "त्वरित ऑटो नंबर प्लेट खोज",
          },
          desc: {
            en: "Type any plate (e.g. MP-04-4821) to view masked numbers (MP-04-XX-4821), total women-safe rides completed, and community badges.",
            hi: "ऑटो नंबर दर्ज करते ही कुल सुरक्षित राइड्स, सुरक्षा रेटिंग और कम्युनिटी बैज तुरंत स्क्रीन पर दिखते हैं।",
          },
        },
        {
          icon: Sparkles,
          title: {
            en: "+ Log & Rate an Auto",
            hi: "+ ऑटो का रिव्यू और रेटिंग जोड़ें",
          },
          desc: {
            en: "Riders record verdicts (Safe & Recommended, Neutral, Caution) with 1-tap behavioral tags: 'Polite & Respectful', 'Fair Fare', 'Safe Route'.",
            hi: "महिला यात्री 1-टैप टैग्स द्वारा ड्राईवर के व्यवहार, सही किराए और सुरक्षित रूट की रेटिंग लेजर में जोड़ सकती हैं।",
          },
        },
        {
          icon: Radio,
          title: {
            en: "Real-Time localStorage Persistence",
            hi: "रीयल-टाइम लोकल स्टोरेज सेव",
          },
          desc: {
            en: "Newly logged auto reviews merge immediately with existing pilot data and appear in the live feed for subsequent searches.",
            hi: "नया रिव्यू दर्ज करते ही वह लेजर में जुड़ जाता है और अन्य यात्रियों की खोज में तुरंत दिखाई देता है।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Community Auto Ledger Card Mockup",
          hi: "कम्युनिटी ऑटो लेजर कार्ड",
        },
        content: (
          <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-black font-mono text-slate-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                  MP-04-XX-4821
                </span>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  Rameshwar Yadav (Rani Kamalapati Stand)
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Safe & Recommended
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Women-Safe Rides
                </span>
                <span className="font-black text-teal-800 text-sm">312 Rides</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Safety Rating
                </span>
                <span className="font-black text-amber-600 text-sm">★ 4.9 / 5.0</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                ✓ Polite & Respectful
              </span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                ✓ Fair Fare / No Haggling
              </span>
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Open Auto Safety Ledger (/app) →",
        hi: "ऑटो सुरक्षा लेजर खोलें (/app) →",
      },
    },

    // Step 5: Safe-Drop Handshake & Live Guardian View
    {
      id: 5,
      route: "/track/pilot-ride-01",
      category: {
        en: "Trip Security • Safe Handover Handshake",
        hi: "ट्रिप सुरक्षा • सेफ हैंडशेक व लाइव ट्रैकिंग",
      },
      title: {
        en: "Safe-Drop Handshake & Live Guardian View",
        hi: "सेफ-ड्रॉप हैंडशेक व लाइव गार्डियन ट्रैकिंग",
      },
      subtitle: {
        en: "Automated 2-leg handover when Rider 1 exits, activating Comfort Guardian Mode for the solo leg with real-time public tracking.",
        hi: "पहली सहेली के उतरते ही सोलो सफर के लिए ऑटो-गार्डियन मोड और परिजनों के लिए 1-टैप व्हाट्सएप लाइव ट्रैकिंग।",
      },
      highlights: [
        {
          icon: HeartHandshake,
          title: {
            en: "Cryptographic Safe-Drop Handshake",
            hi: "सुरक्षित ड्रॉप हैंडशेक",
          },
          desc: {
            en: "Clicking 'Co-Rider Dropped at Stop' triggers a timestamped handover confirmation, switching the remaining leg to Guardian protection.",
            hi: "पहली सहेली के स्टॉप पर उतरने पर 'Co-Rider Dropped' दबाते ही हैंडशेक दर्ज होता है और अंतिम अकेले सफर की निगरानी शुरू होती है।",
          },
        },
        {
          icon: ExternalLink,
          title: {
            en: "Public Guardian Tracking (/track/pilot-ride-01)",
            hi: "सार्वजनिक गार्डियन ट्रैकिंग स्क्रीन",
          },
          desc: {
            en: "Generates a mobile-friendly public tracking URL showing live route progress, auto plate, handover time, and 1-tap emergency helplines.",
            hi: "परिजनों के लिए लाइव लिंक जिसमें ऑटो नंबर, रूट की प्रगति, हैंडशेक का समय और आपातकालीन नंबर शामिल होते हैं।",
          },
        },
        {
          icon: PhoneCall,
          title: {
            en: "1-Tap WhatsApp Guardian Share",
            hi: "1-टैप व्हाट्सएप शेयर",
          },
          desc: {
            en: "Pre-fills an urgent safety message (via wa.me API) containing the verified auto plate, destination, and live tracking link for family members.",
            hi: "एक क्लिक में ऑटो नंबर, मार्ग और लाइव ट्रैकिंग लिंक से भरा व्हाट्सएप संदेश परिवार को भेजने की सुविधा।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Comfort Guardian Live Tracker Mockup",
          hi: "कम्फर्ट गार्डियन लाइव ट्रैकर",
        },
        content: (
          <div className="bg-gradient-to-r from-teal-900 to-emerald-950 rounded-2xl p-4 text-white space-y-3 border border-teal-500/40">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black flex items-center gap-1.5 text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>Comfort Guardian Mode ACTIVE</span>
              </span>
              <span className="text-[10px] text-teal-200">Remaining Solo Leg</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Handshake Verified:</span>
                <span className="text-emerald-400 font-bold">08:42 PM (Co-Rider Dropped)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Live Auto Plate:</span>
                <span className="text-white font-mono font-bold">MP-04-XX-4821</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-center text-xs font-black text-emerald-300">
              🎉 I&apos;ve Reached Home Safely (Conclude Guardian)
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Open Public Guardian Tracker (/track/pilot-ride-01) →",
        hi: "लाइव गार्डियन ट्रैकर खोलें (/track/pilot-ride-01) →",
      },
    },

    // Step 6: 24×7 Safe-Haven Shield, Bilingual UX & Offline Cache
    {
      id: 6,
      route: "/app",
      category: {
        en: "Emergency Readiness • Offline Resilience",
        hi: "आपातकालीन तैयारी • ऑफलाइन बैकअप",
      },
      title: {
        en: "24×7 Safe-Havens, Bilingual UX & Offline Cache",
        hi: "24×7 सेफ-हेवन शील्ड, द्विभाषी UX व ऑफलाइन कैश",
      },
      subtitle: {
        en: "Engineered for real transit stations: nearest RPF safe shelter lookup, instant Hindi switcher, and offline trip persistence.",
        hi: "कमजोर नेटवर्क व स्टेशन की भीड़ के अनुकूल — निकटतम RPF सुरक्षित आश्रय, हिंदी स्विच और ऑफलाइन ट्रिप सेविंग।",
      },
      highlights: [
        {
          icon: ShieldAlert,
          title: {
            en: "1-Tap Verified Safe-Haven Shield",
            hi: "1-टैप सत्यापित सेफ-हेवन शील्ड",
          },
          desc: {
            en: "Top-bar shield button opens a bottom sheet listing 24×7 well-lit emergency safe havens (RPF Police Post, Habibganj Thana, Bansal Hospital Gate) with 1-tap call.",
            hi: "टॉप बार में शील्ड बटन दबाते ही निकटतम 24×7 पुलिस चौकी, थाना और सुरक्षित अस्पतालों की सूची दूरी व सीधे कॉल बटन सहित खुलती है।",
          },
        },
        {
          icon: Globe,
          title: {
            en: "Instant Bilingual (EN | हिंदी) Toggle",
            hi: "तत्काल द्विभाषी (EN | हिंदी) स्विच",
          },
          desc: {
            en: "Flips all headings, instructions, buttons, chat chips, and driver fare cards between English and conversational everyday Hindi.",
            hi: "एक क्लिक में सभी शीर्षकों, सुरक्षा निर्देशों, चैट चिप्स और ड्राईवर कार्ड को सरल हिंदी या अंग्रेजी में बदलें।",
          },
        },
        {
          icon: Zap,
          title: {
            en: "Offline Safe-Cache Ready",
            hi: "ऑफलाइन सेफ-कैश बैकअप",
          },
          desc: {
            en: "Persists active trip state, emergency numbers, and safe havens in localStorage so commuters remain protected even with zero cellular signal.",
            hi: "सक्रिय ट्रिप, इमरजेंसी नंबर और सेफ हेवन का डेटा फोन में ऑफलाइन सेव रहता है ताकि नेटवर्क गायब होने पर भी सुरक्षा बनी रहे।",
          },
        },
      ],
      mockUi: {
        badge: {
          en: "Safe-Haven Shield Bottom Sheet",
          hi: "सेफ-हेवन शील्ड बॉटम शीट",
        },
        content: (
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>24×7 Verified Safe Havens</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Well-Lit & Guarded
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-900">
                  RPF Police Post (Station Gate 1)
                </div>
                <div className="text-[10px] text-slate-500">
                  120m away • 24×7 Active Security
                </div>
              </div>
              <span className="text-[10px] font-bold text-white bg-rose-600 px-2.5 py-1 rounded-lg">
                Call Post
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-900">
                  Habibganj Police Thana
                </div>
                <div className="text-[10px] text-slate-500">
                  450m away • Emergency Room Open
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">
                Directions
              </span>
            </div>
          </div>
        ),
      },
      ctaLabel: {
        en: "Launch SaheliMile App (/app) →",
        hi: "सहेलीमाइल ऐप चालू करें (/app) →",
      },
    },
  ];

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-[#FFFBEB] rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-amber-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              🛺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider">
                  SaheliMile Feature Guide
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316] border border-orange-200">
                  Step {currentStep + 1} of 6
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {step.category[language]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-[10px] font-extrabold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-[#0D9488] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-[#0D9488] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Step Header */}
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {step.title[language]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {step.subtitle[language]}
            </p>
          </div>

          {/* Interactive Visual Mock UI */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {step.mockUi.badge[language]}
            </span>
            {step.mockUi.content}
          </div>

          {/* Highlights List */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              {language === "hi" ? "प्रमुख तकनीकी खूबियां" : "Micro-Feature Breakdown"}
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {step.highlights.map((h, idx) => {
                const IconComponent = h.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-amber-200/70 shadow-2xs flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {h.title[language]}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        {h.desc[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Try Live Link Banner */}
          <div className="pt-2">
            <Link
              href={step.route}
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-[#0D9488] hover:bg-[#0f766e] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-900/15 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>{step.ctaLabel[language]}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Modal Footer with Progress Dots & Nav Buttons */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-200/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === "hi" ? "पिछला" : "Previous"}</span>
          </button>

          {/* 6 Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentStep === idx
                    ? "w-6 h-2 bg-[#0D9488]"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
              className="px-4 py-1.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>{language === "hi" ? "अगला" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === "hi" ? "समाप्त" : "Finish Guide"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
