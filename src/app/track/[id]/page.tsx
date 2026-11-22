"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Navigation,
  PhoneCall,
  Share2,
  HeartHandshake,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Car,
  Home,
  AlertTriangle,
  Info,
  Check,
} from "lucide-react";
import { PILOT_DRIVERS, PILOT_MATCHED_RIDERS, DEFAULT_PILOT_RIDE } from "@/lib/data/pilotData";
import { PilotRideState, SafetyVerdict } from "@/lib/types";
import { logAutoReview } from "@/lib/ledger";

export default function TrackRidePage() {
  const params = useParams();
  const trackId = (params?.id as string) || "pilot-ride-01";

  const [rideState, setRideState] = useState<PilotRideState>(DEFAULT_PILOT_RIDE);
  const [isHomeSafe, setIsHomeSafe] = useState(false);
  const [safeTimestamp, setSafeTimestamp] = useState<string | null>(null);

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
      plate: rideState.driver.rawPlateForVerification,
      driverName: rideState.driver.name,
      hubStation: rideState.driver.hubStation,
      vehicleType: rideState.driver.vehicleType,
      verdict: postRideVerdict,
      tags: postRideTags,
      note: postRideNote.trim() || "Safe doorstep arrival verified via Guardian tracking.",
      commuterBadge: "Guardian Verified Commuter",
    });
    setIsPostRideVouched(true);
  };

  // Read synced ride state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sahelimile_active_ride");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRideState(parsed);
        if (parsed.stage === "home-safe") {
          setIsHomeSafe(true);
        }
      }
    } catch {
      // Fallback to default pilot ride state
    }
  }, []);

  const handleMarkHomeSafe = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setIsHomeSafe(true);
    setSafeTimestamp(timeStr);

    try {
      const updated = { ...rideState, stage: "home-safe" as const };
      localStorage.setItem("sahelimile_active_ride", JSON.stringify(updated));
    } catch {
      // LocalStorage access fallback
    }
  };

  const driver = rideState.driver || PILOT_DRIVERS[0];
  const coRider = rideState.coRider || PILOT_MATCHED_RIDERS[0];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
      {/* Centered Mobile-First Frame */}
      <div className="w-full max-w-md min-h-screen bg-[#FFFBEB] shadow-2xl border-x border-slate-200/80 flex flex-col relative pb-10">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-50">
            <Link
              href="/app"
              className="flex items-center gap-1 text-slate-600 hover:text-teal-700 font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>
            <span className="font-mono text-[10px] text-slate-400">
              ID: {trackId}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                🛡️
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Guardian Live Tracking
                </h1>
                <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span>Real-Time Comfort Monitor</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 uppercase">
              {isHomeSafe ? "Completed" : "Solo Leg Active"}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-4 px-4 pt-4 flex-1">
          {/* Active Guardian Status Banner */}
          {!isHomeSafe ? (
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-lg space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Comfort Guardian Mode Engaged
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  Live GPS Guard
                </span>
              </div>
              <p className="text-xs text-orange-50 font-medium leading-relaxed pt-1">
                Monitoring <strong>Aditi Rao</strong> on the final solo stretch home. Handover from co-rider <strong>{coRider.name}</strong> confirmed.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-lg space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Safe Arrival Confirmed
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Commuter marked safely home at {safeTimestamp || "doorstep"}. Comfort Guardian monitoring completed.
              </p>
            </div>
          )}

          {/* Co-Rider Handover Proof Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <HeartHandshake className="w-4 h-4 text-orange-500" />
                <span>Co-Rider Handover Timestamp</span>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Verified Handshake
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-teal-500 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coRider.avatar}
                  alt={coRider.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-slate-900">
                  {coRider.name} Dropped Safely
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-600" />
                  <span>Handover at {rideState.handoverTimestamp} • Stop 1: {coRider.destinationName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Vehicle & Driver Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-teal-200 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#0D9488]" />
                <span>Verified Community Vehicle</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Hub Verified
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-teal-400 flex-shrink-0 bg-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={driver.photoUrl}
                  alt={driver.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {driver.name}
                  </h3>
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    {driver.vehicleType}
                  </span>
                </div>

                {/* Privacy-Masked Plate */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                    {driver.maskedPlate}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">
                    (Masked for Privacy)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                  <span className="text-amber-600 font-bold">★ {driver.rating}</span>
                  <span>•</span>
                  <span className="text-teal-700 font-bold">{driver.totalWomenRides} women-safe trips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Route Progress Indicator */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span>Solo Leg Route Progress</span>
              </span>
              <span className="text-[11px] font-extrabold text-orange-600">
                {isHomeSafe ? "Arrived" : "800m • ETA 3 mins"}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isHomeSafe ? "w-full bg-emerald-500" : "w-[85%] bg-orange-500 animate-pulse"
                }`}
              />
            </div>

            {/* Progression Steps */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-600">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {rideState.originHub.shortName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Departed together at 09:30 PM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-600">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    Stop 1: {coRider.destinationName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    {coRider.name} safely dropped at {rideState.handoverTimestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                    isHomeSafe
                      ? "bg-emerald-600 text-white"
                      : "bg-orange-500 text-white animate-pulse"
                  }`}
                >
                  {isHomeSafe ? "✓" : "3"}
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    Final Stop: {rideState.mainRider.destinationName}
                  </div>
                  <div className="text-[10px] text-orange-600 font-bold">
                    {isHomeSafe
                      ? `Arrived safely at ${safeTimestamp || "doorstep"}`
                      : "Comfort Guardian monitoring active"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1-Tap 'I've Reached Home Safely' Confirmation Action */}
          {!isHomeSafe ? (
            <div className="pt-2">
              <button
                onClick={handleMarkHomeSafe}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 px-4 rounded-2xl shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>I&apos;ve Reached Home Safely 🎉</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                Tap upon reaching your doorstep to conclude Comfort Guardian monitoring.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mx-auto">
                🏡
              </div>
              <h4 className="text-sm font-extrabold text-emerald-950">
                Safe Arrival Recorded!
              </h4>
              <p className="text-xs text-emerald-800 font-medium">
                Emergency contacts have been notified that you are safely inside your home.
              </p>
              <Link
                href="/app"
                className="inline-block mt-1 text-xs font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Return to SaheliMile App
              </Link>
            </div>
          )}

          {/* Post-Ride Vouch Card (Saves directly to Community Auto Ledger) */}
          {isHomeSafe && (
            <div className="p-4 bg-teal-50/90 rounded-2xl border-2 border-teal-300 text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h4 className="text-xs font-black text-teal-950 uppercase tracking-wide">
                    Vouch for Auto in Community Ledger
                  </h4>
                </div>
                <span className="font-mono text-[10px] font-black text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-200">
                  {driver.maskedPlate}
                </span>
              </div>

              <p className="text-[11px] text-teal-900/90 leading-tight">
                Help sister commuters in Bhopal by logging this auto into the public safety ledger.
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
                      ✓ Safe & Recommended
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
                      Neutral / Okay
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
                      Flag Caution
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
                    placeholder="1-line note (e.g. courteous, dropped right at gate)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handlePostRideVouch}
                    className="w-full py-2 px-3 bg-[#0D9488] hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Log to Community Ledger</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Thank you! Your vouch is logged into the Community Ledger (+1 Trip Added).</span>
                </div>
              )}
            </div>
          )}

          {/* Emergency Assistance Direct Dial */}
          <div className="pt-1">
            <a
              href="tel:1090"
              className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Call MP Police Women Helpline (1090)</span>
            </a>
          </div>
        </main>

        {/* Honest Data Disclosure Note */}
        <footer className="mt-6 px-4">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] leading-relaxed flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Pilot Demo Mode • Simulated Transit Data for Evaluation:</strong> Public tracking views encrypt rider identifiers and mask vehicle registration numbers to demonstrate urban last-mile safety workflows.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
