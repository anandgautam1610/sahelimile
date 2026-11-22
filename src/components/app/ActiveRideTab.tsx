"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CoRiderMatch, TransitHub, CommuteDestination, DriverTrustProfile, SafetyVerdict } from "@/lib/types";
import { logAutoReview } from "@/lib/ledger";
import {
  PILOT_MATCHED_RIDERS,
  PILOT_TRANSIT_HUBS,
  PILOT_DESTINATIONS,
  PILOT_DRIVERS,
  DEFAULT_PILOT_RIDE,
} from "@/lib/data/pilotData";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Navigation,
  Share2,
  PhoneCall,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Clock,
  Check,
  AlertCircle,
  Home,
  MapPin,
  Info,
  MessageSquare,
  Send,
  Lock,
  KeyRound,
  FileText,
  X,
  IndianRupee,
  Car,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActiveRideTabProps {
  currentMatch?: CoRiderMatch | null;
  currentHub?: TransitHub | null;
  currentDest?: CommuteDestination | null;
  currentDriver?: DriverTrustProfile | null;
}

interface QuickMeetMessage {
  id: string;
  sender: "user" | "corider";
  text: string;
  time: string;
}

export default function ActiveRideTab({
  currentMatch,
  currentHub,
  currentDest,
  currentDriver,
}: ActiveRideTabProps) {
  const { language, t } = useLanguage();

  const [stage, setStage] = useState<"shared-active" | "solo-guardian" | "home-safe">("shared-active");
  const [copiedLink, setCopiedLink] = useState(false);
  const [handoverTimestamp, setHandoverTimestamp] = useState("09:42 PM");
  const [showDriverCard, setShowDriverCard] = useState(false);
  const [saheliPin] = useState("4829"); // 4-digit mutual boarding PIN per SPEC

  // Post-Ride Community Auto Ledger Vouch
  const [postRideVerdict, setPostRideVerdict] = useState<SafetyVerdict>("safe");
  const [postRideTags, setPostRideTags] = useState<string[]>([
    "Polite & Respectful",
    "Followed Safe Route",
  ]);
  const [postRideNote, setPostRideNote] = useState("");
  const [isPostRideVouched, setIsPostRideVouched] = useState(false);

  const handlePostRideVouch = () => {
    logAutoReview({
      plate: driver.rawPlateForVerification,
      driverName: driver.name,
      hubStation: driver.hubStation,
      vehicleType: driver.vehicleType,
      verdict: postRideVerdict,
      tags: postRideTags,
      note: postRideNote.trim() || (language === "hi" ? "सुरक्षित एवं समय पर यात्रा।" : "Safe doorstep arrival."),
      commuterBadge: language === "hi" ? "सत्यापित सहेली यात्री" : "Verified Saheli Rider",
    });
    setIsPostRideVouched(true);
  };

  const rider = currentMatch || PILOT_MATCHED_RIDERS[0];
  const hub = currentHub || PILOT_TRANSIT_HUBS[0];
  const dest = currentDest || PILOT_DESTINATIONS[0];
  const driver = currentDriver || PILOT_DRIVERS[0];

  const shareableUrl = "/track/pilot-ride-01";

  // Privacy-First Quick Meet Chips state
  const [messages, setMessages] = useState<QuickMeetMessage[]>([
    {
      id: "msg-0",
      sender: "corider",
      text:
        language === "hi"
          ? "नमस्ते! मैं स्टेशन एग्जिट गेट के पास हूं।"
          : "Hi! I just exited the platform and heading toward the auto stand.",
      time: "09:28 PM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync state to localStorage for offline resilience & /track/[id] sync
  useEffect(() => {
    try {
      const stateToStore = {
        ...DEFAULT_PILOT_RIDE,
        saheliPin,
        driver,
        coRider: rider,
        originHub: hub,
        mainRider: {
          ...DEFAULT_PILOT_RIDE.mainRider,
          destinationName: dest.name,
        },
        dest,
        distanceRemainingKm: Math.min(1.2, Number((dest.distanceKm * 0.25).toFixed(1))),
        stage,
        handoverTimestamp,
        language,
      };
      localStorage.setItem("sahelimile_active_ride", JSON.stringify(stateToStore));
    } catch {
      // LocalStorage access safe fallback
    }
  }, [stage, driver, rider, hub, dest, handoverTimestamp, saheliPin, language]);

  const handleTriggerHandshake = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setHandoverTimestamp(timeString);
    setStage("solo-guardian");
  };

  const handleCopyLink = async () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareableUrl}`
        : `https://sahelimile.app${shareableUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // WhatsApp formatted safety dispatch message
  const handleShareWhatsApp = () => {
    const fullTrackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareableUrl}`
        : `https://sahelimile.app${shareableUrl}`;

    const text =
      language === "hi"
        ? `🚨 *सहेलीमाइल सुरक्षित सफर अपडेट*\n` +
          `• *ऑटो नंबर:* ${driver.maskedPlate} (${driver.name})\n` +
          `• *रूट:* ${hub.shortName} ➔ ${dest.name}\n` +
          `• *सह-यात्री:* ${rider.name} (${rider.verificationBadge})\n` +
          `• *सहेली पिन:* ${saheliPin}\n` +
          `• *लाइव ट्रैकिंग लिंक:* ${fullTrackUrl}\n` +
          `मैं रास्ते में हूं और कम्फर्ट गार्डियन सक्रिय है।`
        : `🚨 *SaheliMile Safe Commute Update*\n` +
          `• *Auto Plate:* ${driver.maskedPlate} (Driver: ${driver.name})\n` +
          `• *Route:* ${hub.shortName} ➔ ${dest.name}\n` +
          `• *Co-Rider:* ${rider.name} (${rider.verificationBadge})\n` +
          `• *Saheli PIN:* ${saheliPin}\n` +
          `• *Live Guardian Link:* ${fullTrackUrl}\n` +
          `I am on my way with automated Comfort Guardian tracking.`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  // Quick meet coordination preset chips
  const quickChips = [
    {
      key: "chipGate1",
      text: t("chipGate1"),
      reply:
        language === "hi"
          ? "देख लिया! पिलर 4 के पास खड़ी हूं।"
          : "Got it! Standing right beside pillar 4 in white kurta!",
    },
    {
      key: "chipPrepaid",
      text: t("chipPrepaid"),
      reply:
        language === "hi"
          ? "मैं भी प्रीपेड बूथ की तरफ आ रही हूं!"
          : "I see the booth! Walking over now!",
    },
    {
      key: "chip2Mins",
      text: t("chip2Mins"),
      reply:
        language === "hi"
          ? "बढ़िया, मैं चालक रमेश जी के पास रुकती हूं।"
          : "Perfect, holding a spot with driver Ramesh!",
    },
    {
      key: "chipWestBridge",
      text: t("chipWestBridge"),
      reply:
        language === "hi"
          ? "वेस्ट सीढ़ियों से उतर रही हूं, 1 मिनट!"
          : "Coming down the west stairs now, see you in 1 min!",
    },
  ];

  const handleSendQuickChip = (chip: { text: string; reply: string }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const userMsg: QuickMeetMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: chip.text,
      time: timeStr,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulate instant co-rider reply
    setTimeout(() => {
      const coriderMsg: QuickMeetMessage = {
        id: `corider-${Date.now()}`,
        sender: "corider",
        text: chip.reply,
        time: timeStr,
      };
      setMessages((prev) => [...prev, coriderMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      {/* Stage Progression Breadcrumb */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
          <span>{t("tripSecurityHandshake")}</span>
          <span className="text-teal-700 font-extrabold">
            {stage === "shared-active" && "Stage 1: " + t("stage1Title")}
            {stage === "solo-guardian" && "Stage 2: " + t("stage2Title")}
            {stage === "home-safe" && t("homeSafeCelebration")}
          </span>
        </div>

        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div
            className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-teal-600 transition-all duration-500 -z-0"
            style={{
              width:
                stage === "shared-active"
                  ? "20%"
                  : stage === "solo-guardian"
                  ? "65%"
                  : "100%",
            }}
          />

          {/* Node 1 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                stage === "shared-active"
                  ? "bg-teal-600 text-white ring-4 ring-teal-100"
                  : "bg-teal-700 text-white"
              }`}
            >
              1
            </div>
            <span className="text-[10px] font-bold text-slate-700">Shared Leg</span>
          </div>

          {/* Node 2 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                stage === "solo-guardian"
                  ? "bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse"
                  : stage === "home-safe"
                  ? "bg-teal-700 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
            <span className="text-[10px] font-bold text-slate-700">Guardian</span>
          </div>

          {/* Node 3 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                stage === "home-safe"
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              ✓
            </div>
            <span className="text-[10px] font-bold text-slate-700">Safely Home</span>
          </div>
        </div>
      </div>

      {/* Milestone 4: Mutual 4-Digit Saheli PIN Card */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-2xl p-4 shadow-md space-y-2 border border-teal-700/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-200">
              {t("saheliPinLabel")}
            </h4>
          </div>
          <span className="text-[9px] font-extrabold bg-orange-500/30 text-orange-200 px-2 py-0.5 rounded-full border border-orange-400/40">
            Visual Boarding Match
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-300 max-w-[200px] leading-tight">
            {t("saheliPinHelper")}
          </p>

          {/* Large Digit Display */}
          <div className="flex items-center gap-1.5">
            {saheliPin.split("").map((digit, i) => (
              <div
                key={i}
                className="w-8 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-lg font-black text-orange-300 shadow-inner"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone 4: 'Show Driver Card' Action Button */}
      <div>
        <button
          onClick={() => setShowDriverCard(true)}
          className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <FileText className="w-4 h-4 text-orange-600" />
          <span>{t("showDriverBtn")}</span>
          <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-bold ml-1">
            Zero Haggling
          </span>
        </button>
      </div>

      {/* STAGE 1: Shared Ride Active & Privacy Quick-Meet */}
      {stage === "shared-active" && (
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-teal-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {t("stage1Title")}
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
              Live Corridor Sharing
            </span>
          </div>

          {/* Both Co-Riders Display */}
          <div className="space-y-2">
            {/* You */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                  YOU
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">
                      Aditi Rao
                    </span>
                    <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                      Rider 2
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Final Stop: {dest.name} (Solo Leg)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Fare</span>
                <div className="text-xs font-black text-orange-600">₹{rider.sharedFare}</div>
              </div>
            </div>

            {/* Co-Rider */}
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rider.avatar}
                    alt={rider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">
                      {rider.name}
                    </span>
                    <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      {rider.verificationBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-800 font-medium">
                    Stop 1: {rider.destinationName} (~2 mins away)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Fare</span>
                <div className="text-xs font-black text-orange-600">₹{rider.sharedFare}</div>
              </div>
            </div>
          </div>

          {/* Privacy-First Quick-Meet Chips Section */}
          <div className="p-3.5 bg-gradient-to-br from-teal-50/80 to-amber-50/50 rounded-2xl border border-teal-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                <h4 className="text-xs font-extrabold text-teal-950">
                  {t("quickMeetTitle")}
                </h4>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
                <span>Zero Phone Share</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              {t("quickMeetSubtitle")}
            </p>

            {/* In-App Coordination Message Log */}
            <div className="bg-white/90 rounded-xl p-2.5 space-y-2 max-h-36 overflow-y-auto border border-teal-100 text-xs shadow-inner">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#0D9488] text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                    {msg.sender === "user" ? "You" : rider.name.split(" ")[0]} • {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 text-[10px] text-teal-700 font-semibold italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  <span>{rider.name.split(" ")[0]} is typing...</span>
                </div>
              )}
            </div>

            {/* Quick Chips Tap Strip */}
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Tap Coordination Chip:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => handleSendQuickChip(chip)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-teal-200 text-slate-700 hover:text-teal-900 text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                  >
                    <span>{chip.text}</span>
                    <Send className="w-2.5 h-2.5 text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Auto Profile */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={driver.photoUrl}
                  alt={driver.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-800 block">
                  {driver.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {driver.maskedPlate} • {driver.vehicleType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stand Vouched</span>
            </div>
          </div>

          {/* Handshake Trigger Action Button */}
          <div className="pt-2">
            <button
              onClick={handleTriggerHandshake}
              className="w-full bg-[#0D9488] hover:bg-[#0f766e] text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-teal-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
            >
              <HeartHandshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t("handshakeBtn")}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
              {t("handshakeDesc")}
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: Comfort Guardian Mode Activated */}
      {stage === "solo-guardian" && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-400 space-y-4">
          {/* Active Guardian Status Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-md space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {t("stage2Title")}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Solo Final Leg
              </span>
            </div>
            <p className="text-xs text-orange-50 font-medium leading-snug pt-1">
              Co-rider handover complete. Live tracking & community monitoring are safeguarding your final 800m doorstep stretch.
            </p>
          </div>

          {/* Co-Rider Handover Confirmation Proof */}
          <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                ✓
              </div>
              <div>
                <span className="font-extrabold text-orange-950 block">
                  {rider.name} Dropped Safely
                </span>
                <span className="text-[10px] text-orange-800">
                  Stop: {rider.destinationName} • Verified at {handoverTimestamp}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {t("handshakeVerified")}
            </span>
          </div>

          {/* Shareable Guardian Link Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{t("guardianLiveLink")}</span>
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono font-bold">
                /track/pilot-ride-01
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t("copiedSuccess")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t("copyGuardianLink")}</span>
                  </>
                )}
              </button>

              <Link
                href={shareableUrl}
                className="flex-1 py-2.5 px-3 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>{t("openGuardianView")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Live Progress for Remaining Solo Leg */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-orange-500" />
                <span>{t("remainingSoloLeg")}</span>
              </span>
              <span className="text-orange-600 font-extrabold text-[11px]">
                800m • ETA 3 mins
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-orange-500 h-full w-[82%] rounded-full transition-all duration-500 animate-pulse" />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Auto: {driver.name} ({driver.maskedPlate})</span>
              <span className="text-emerald-700 font-bold">Signal Strong</span>
            </div>
          </div>

          {/* Milestone 4: Real Share via WhatsApp Button & Helpline */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:1090"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t("callHelpline")}</span>
            </a>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t("whatsAppFamily")}</span>
            </button>
          </div>

          {/* 1-Tap Home Safe Arrival Confirmation */}
          <div className="pt-2">
            <button
              onClick={() => setStage("home-safe")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t("homeSafeBtn")}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Home Safe Celebration */}
      {stage === "home-safe" && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl shadow-inner">
            🏡
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {t("homeSafeCelebration")}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {t("guardianConcluded")}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs font-medium text-slate-700 border border-slate-200 space-y-2 text-left">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Commute Leg:</span>
              <span className="font-bold text-slate-800">{hub.shortName} → {dest.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Shared Fare Split:</span>
              <span className="font-bold text-orange-600">₹{rider.sharedFare} (Saved ₹{rider.savings})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Auto Driver:</span>
              <span className="font-bold text-teal-700">{driver.name} ({driver.maskedPlate})</span>
            </div>
          </div>

          {/* Post-Ride Vouch Card (Saves directly to Community Auto Ledger) */}
          <div className="p-4 bg-teal-50/90 rounded-2xl border-2 border-teal-300 text-left space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-black text-teal-950 uppercase tracking-wide">
                  {t("postRideVouchTitle")}
                </h4>
              </div>
              <span className="font-mono text-[10px] font-black text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-200">
                {driver.maskedPlate}
              </span>
            </div>

            <p className="text-[11px] text-teal-900/90 leading-tight">
              {t("postRideVouchDesc")}
            </p>

            {!isPostRideVouched ? (
              <div className="space-y-2.5 pt-1">
                {/* 1-Tap Verdict */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPostRideVerdict("safe")}
                    className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-black border transition-all cursor-pointer ${
                      postRideVerdict === "safe"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    ✓ {t("verdictSafe")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostRideVerdict("neutral")}
                    className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${
                      postRideVerdict === "neutral"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {t("verdictNeutral")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostRideVerdict("caution")}
                    className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${
                      postRideVerdict === "caution"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {t("verdictCaution")}
                  </button>
                </div>

                {/* 1-Tap Quick Tags */}
                <div className="flex flex-wrap gap-1">
                  {[
                    "Polite & Respectful",
                    "Fair Fare / No Haggling",
                    "Followed Safe Route",
                    "Well-Maintained Auto",
                  ].map((tg) => {
                    const isSelected = postRideTags.includes(tg);
                    return (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => {
                          if (isSelected) setPostRideTags(postRideTags.filter((t) => t !== tg));
                          else setPostRideTags([...postRideTags, tg]);
                        }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0D9488] text-white border-[#0D9488]"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tg}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Note */}
                <input
                  type="text"
                  value={postRideNote}
                  onChange={(e) => setPostRideNote(e.target.value)}
                  placeholder={
                    language === "hi"
                      ? "एक लाइन का नोट (उदा. मुख्य सड़क से सुरक्षित ले गए)"
                      : "1-line note (e.g. courteous, dropped right at gate)"
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handlePostRideVouch}
                  className="w-full py-2 px-3 bg-[#0D9488] hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("submitLedgerBtn")}</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{t("postRideVouchSuccess")}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={shareableUrl}
              className="flex-1 py-2.5 px-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>View Guardian Log</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setStage("shared-active")}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer"
            >
              {t("startNewRide")}
            </button>
          </div>
        </div>
      )}

      {/* Milestone 4: 'Show Driver Card' (ड्राईवर को दिखाएं) Modal */}
      {showDriverCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FFFBEB] rounded-3xl max-w-sm w-full p-6 text-[#0F172A] border-4 border-[#0D9488] shadow-2xl space-y-4">
            {/* Header in large bold typography */}
            <div className="flex items-start justify-between border-b-2 border-slate-300 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0D9488] bg-teal-100 px-2 py-0.5 rounded-md">
                  SaheliMile • सहेलीमाइल
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1 leading-tight">
                  ड्राईवर को दिखाएं
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Show Driver Card — Fixed Fare & Route
                </p>
              </div>

              <button
                onClick={() => setShowDriverCard(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Stops */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border-2 border-slate-200">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  शुरुआत / Pickup Stand
                </span>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  📍 {hub.name}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  स्टॉप 1 (सहेली ड्रॉप / Stop 1)
                </span>
                <div className="text-sm font-black text-teal-800 mt-0.5">
                  1️⃣ {rider.destinationName} ({rider.name})
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  अंतिम स्टॉप (Final Stop)
                </span>
                <div className="text-sm font-black text-orange-700 mt-0.5">
                  2️⃣ {dest.name} (Aditi Rao)
                </div>
              </div>
            </div>

            {/* Fare Breakdown in Massive Typography for Driver Clarity */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white p-5 rounded-2xl text-center shadow-md space-y-2">
              <span className="text-[11px] uppercase font-black tracking-widest text-teal-200">
                कुल मीटर किराया / Total Fare
              </span>
              <div className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-1">
                <IndianRupee className="w-8 h-8 text-orange-400" />
                <span>{rider.sharedFare * 2}</span>
              </div>

              {/* Exact Formula Breakdown */}
              <div className="pt-2 border-t border-teal-600/60 flex items-center justify-center gap-2 text-sm font-black text-amber-200">
                <span>₹{rider.sharedFare} (सवारी 1)</span>
                <span>+</span>
                <span>₹{rider.sharedFare} (सवारी 2)</span>
                <span>=</span>
                <span>₹{rider.sharedFare * 2}</span>
              </div>

              <p className="text-[11px] text-teal-100 pt-1 font-semibold">
                दोनों सवारियां बराबर ₹{rider.sharedFare}-₹{rider.sharedFare} देंगी। कोई मोलभाव नहीं।
              </p>
            </div>

            {/* Vehicle Plate Info */}
            <div className="text-center text-xs font-bold text-slate-600 pt-1">
              वाहन: <span className="font-mono font-black text-slate-900">{driver.maskedPlate}</span> ({driver.name})
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDriverCard(false)}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              {t("closeCardBtn")}
            </button>
          </div>
        </div>
      )}

      {/* Honest Data Disclosure Note */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] leading-relaxed flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Pilot Demo Mode • Simulated Transit Data for Evaluation:</strong> The Safe-Drop Handshake, Saheli PIN, and Show Driver Card eliminate last-mile fare haggling and verify co-riders visually at urban transit gates.
        </div>
      </div>
    </div>
  );
}
