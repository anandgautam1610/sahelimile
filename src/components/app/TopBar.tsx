"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowLeft,
  Info,
  Shield,
  Phone,
  Navigation,
  X,
  CheckCircle2,
  Lock,
  ExternalLink,
  LogOut,
  User,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PILOT_SAFE_HAVENS } from "@/lib/data/pilotData";
import { getStoredUser, clearStoredUser, DEMO_VERIFIED_USER, UserProfile } from "@/lib/auth";

interface TopBarProps {
  activeHubName: string;
  activeCity?: string;
  isPilotMode: boolean;
  onTogglePilot: () => void;
}

export default function TopBar({
  activeHubName,
  activeCity,
  isPilotMode,
  onTogglePilot,
}: TopBarProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isSafeHavensOpen, setIsSafeHavensOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEMO_VERIFIED_USER);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        {/* Top micro bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-4 py-2 border-b border-slate-50">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-teal-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("landingPageLink")}</span>
          </Link>

          {/* Bilingual Switcher (EN | हिंदी) */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-[#0D9488] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-[#0D9488] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Discreet Safe-Zone Shield Button */}
            <button
              onClick={() => setIsSafeHavensOpen(true)}
              className="flex items-center gap-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors cursor-pointer shadow-xs active:scale-95"
              title="View 24x7 verified Safe Havens"
            >
              <Shield className="w-3 h-3 text-rose-600 fill-rose-600/20" />
              <span>{t("safeHavenBtn")}</span>
            </button>
          </div>
        </div>

        {/* Main app bar */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              🛺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Saheli<span className="text-[#0D9488]">Mile</span>
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded truncate max-w-[80px]">
                  {activeCity || t("bhopalHub")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
                <MapPin className="w-3 h-3 text-[#0D9488] flex-shrink-0" />
                <span className="truncate">{activeHubName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* User Profile & Selfie Verified Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 py-1 px-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition-all cursor-pointer text-left active:scale-95 shadow-xs"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0D9488] text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="leading-none">
                  <div className="text-[11px] font-black text-slate-900 truncate max-w-[70px]">
                    {user.name.split(" ")[0]}
                  </div>
                  <div className="text-[8px] font-extrabold text-emerald-700 flex items-center gap-0.5 mt-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                    <span>{t("selfieVerified")}</span>
                  </div>
                </div>
              </button>

              {/* User Popover / Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 space-y-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="border-b border-slate-100 pb-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{user.name}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                        {user.gender === "female" ? "Female" : "Verified"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{t("verifiedFemaleCommuter")}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium space-y-0.5">
                    <div>
                      <span>Method: </span>
                      <strong className="text-slate-800 font-bold">
                        {user.verificationMethod === "face-ai" ? "Live Face-AI Camera" : "Judge Demo Bypass"}
                      </strong>
                    </div>
                    {user.confidence && (
                      <div className="text-emerald-700 font-bold">
                        Confidence: {Math.round(user.confidence * 100)}%
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t("logoutBtn")}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onTogglePilot}
              className={`px-2 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                isPilotMode
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Toggle synthetic pilot dataset"
            >
              <Sparkles className="w-3 h-3 text-[#F97316]" />
              <span>{isPilotMode ? t("pilotActive") : t("demoMode")}</span>
            </button>
          </div>
        </div>

        {/* Offline Safe-Cache Ready & Disclosure Sub-bar */}
        <div className="bg-amber-50/90 border-t border-amber-200/60 px-3 py-1 flex items-center justify-between text-[10px] font-medium text-amber-900">
          <span className="truncate max-w-[210px]">{t("pilotDisclosure")}</span>
          <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100/90 px-1.5 py-0.2 rounded text-[9px]">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
            <span>Safe-Cache</span>
          </span>
        </div>
      </header>

      {/* 24x7 Safe-Havens Bottom Sheet Modal */}
      {isSafeHavensOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                  <Shield className="w-5 h-5 fill-rose-500/30" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {t("safeHavensTitle")}
                  </h3>
                  <p className="text-[11px] text-teal-200">
                    Rani Kamalapati Transit Hub (Bhopal)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSafeHavensOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-info banner */}
            <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span>{t("safeHavensSub")}</span>
            </div>

            {/* List of Safe Havens */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {PILOT_SAFE_HAVENS.map((haven) => (
                <div
                  key={haven.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-extrabold text-slate-900">
                          {language === "hi" ? haven.nameHi : haven.name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800">
                          {haven.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        {language === "hi"
                          ? haven.locationDetailsHi
                          : haven.locationDetails}
                      </p>
                    </div>

                    <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg flex-shrink-0">
                      {haven.distanceMeters}m
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{t("cctvMonitored")}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${haven.phone}`}
                        className="py-1 px-3 bg-[#0D9488] hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{t("callNowBtn")} ({haven.phone})</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          haven.googleMapsQuery
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                        title="Open directions in Google Maps"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-500">
                Direct Emergency: Call 1090 (Women Helpline)
              </span>
              <button
                onClick={() => setIsSafeHavensOpen(false)}
                className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
