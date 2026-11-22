"use client";

import React, { useState, useEffect } from "react";
import { DriverTrustProfile, AutoReview, SafetyVerdict } from "@/lib/types";
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Sparkles,
  Heart,
  Check,
  Info,
  PlusCircle,
  Clock,
  Car,
  MessageSquare,
  ThumbsUp,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getStoredLedger,
  findDriverInLedger,
  logAutoReview,
  toggleDriverVouchInStorage,
  formatPlateMasked,
  formatPlateRaw,
  normalizePlate,
} from "@/lib/ledger";

interface AutoTrustTabProps {
  onSelectAutoForRide?: (driver: DriverTrustProfile) => void;
}

const PRESET_PLATES = [
  { plate: "MP-04-4821", name: "Ramesh Kumar", type: "CNG Auto", hub: "RKMP Stand" },
  { plate: "MP-04-9104", name: "Mohammad Rafiq", type: "Electric Rickshaw", hub: "MP Nagar" },
  { plate: "MP-04-1052", name: "Sunita Bai", type: "Pink EV Auto", hub: "West Gate" },
  { plate: "MP-04-7732", name: "Kailash Meena", type: "CNG Auto", hub: "Habibganj" },
  { plate: "MP-04-8291", name: "Santosh Yadav", type: "CNG Auto", hub: "AIIMS Metro" },
];

const BEHAVIOR_TAG_OPTIONS = [
  { key: "polite", labelEn: "Polite & Respectful", labelHi: "विनम्र व्यवहार" },
  { key: "fairFare", labelEn: "Fair Fare / No Haggling", labelHi: "उचित किराया / मोलभाव नहीं" },
  { key: "safeRoute", labelEn: "Followed Safe Route", labelHi: "सुरक्षित मार्ग का पालन" },
  { key: "wellMaintained", labelEn: "Well-Maintained Auto", labelHi: "साफ-सुथरा ऑटो" },
  { key: "nightSafe", labelEn: "Night Safe", labelHi: "रात में सुरक्षित" },
  { key: "sosButton", labelEn: "SOS Button Fitted", labelHi: "SOS बटन उपलब्ध" },
];

export default function AutoTrustTab({ onSelectAutoForRide }: AutoTrustTabProps) {
  const { t, language } = useLanguage();

  // Ledger state
  const [drivers, setDrivers] = useState<DriverTrustProfile[]>([]);
  const [reviews, setReviews] = useState<AutoReview[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverTrustProfile | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Vouch toggle
  const [hasVouched, setHasVouched] = useState(false);
  const [vouchCount, setVouchCount] = useState<number>(412);

  // Log & Rate Modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [inputPlate, setInputPlate] = useState("");
  const [inputDriverName, setInputDriverName] = useState("");
  const [inputHub, setInputHub] = useState("Rani Kamalapati Railway Station Stand");
  const [inputVehicleType, setInputVehicleType] = useState<"CNG Auto" | "Electric Rickshaw">("CNG Auto");
  const [selectedVerdict, setSelectedVerdict] = useState<SafetyVerdict>("safe");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Polite & Respectful",
    "Fair Fare / No Haggling",
  ]);
  const [inputNote, setInputNote] = useState("");
  const [logSuccessToast, setLogSuccessToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const data = getStoredLedger();
    setDrivers(data.drivers);
    setReviews(data.reviews);
    if (data.drivers.length > 0) {
      setSelectedDriver(data.drivers[0]);
      setVouchCount(data.drivers[0].totalWomenRides);
    }
  }, []);

  // Update vouch count when selected driver changes
  useEffect(() => {
    if (selectedDriver) {
      setVouchCount(selectedDriver.totalWomenRides);
      setHasVouched(false);
    }
  }, [selectedDriver]);

  // Handle Search by Plate or Name
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = findDriverInLedger(searchQuery, drivers);
    if (found) {
      setSelectedDriver(found);
      setVouchCount(found.totalWomenRides);
      setHasVouched(false);
      setSearchFeedback(`Found in Ledger: ${found.maskedPlate} (${found.name})`);
    } else {
      setSearchFeedback(
        `Auto "${searchQuery}" not yet logged. You can be the first to log it below!`
      );
    }
  };

  // Preset plate click
  const handleSelectPreset = (plateStr: string) => {
    setSearchQuery(plateStr);
    const found = findDriverInLedger(plateStr, drivers);
    if (found) {
      setSelectedDriver(found);
      setVouchCount(found.totalWomenRides);
      setHasVouched(false);
      setSearchFeedback(`Inspecting: ${found.maskedPlate}`);
    } else {
      // Auto might be preset not in storage yet
      setInputPlate(plateStr);
      setSearchFeedback(`Preset selected: ${plateStr}`);
    }
  };

  // Toggle user vouch
  const handleToggleVouch = () => {
    if (!selectedDriver) return;
    const increment = !hasVouched;
    const { updatedDriver, updatedCount } = toggleDriverVouchInStorage(
      selectedDriver.rawPlateForVerification,
      increment
    );

    if (updatedDriver) {
      setSelectedDriver(updatedDriver);
      setVouchCount(updatedCount);
      setHasVouched(increment);
      // update list in state
      setDrivers((prev) =>
        prev.map((d) =>
          normalizePlate(d.rawPlateForVerification) ===
          normalizePlate(updatedDriver.rawPlateForVerification)
            ? updatedDriver
            : d
        )
      );
    }
  };

  // Toggle behavior tag in logging form
  const toggleTag = (tagText: string) => {
    if (selectedTags.includes(tagText)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagText));
    } else {
      setSelectedTags([...selectedTags, tagText]);
    }
  };

  // Handle Submit Log & Rate
  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPlate.trim()) return;

    const { review, updatedDriver, updatedLedger } = logAutoReview({
      plate: inputPlate.trim(),
      driverName: inputDriverName.trim() || undefined,
      hubStation: inputHub,
      vehicleType: inputVehicleType,
      verdict: selectedVerdict,
      tags: selectedTags,
      note: inputNote.trim(),
      commuterBadge: language === "hi" ? "सत्यापित महिला यात्री" : "Verified Woman Commuter",
    });

    setDrivers(updatedLedger.drivers);
    setReviews(updatedLedger.reviews);
    setSelectedDriver(updatedDriver);
    setVouchCount(updatedDriver.totalWomenRides);
    setHasVouched(selectedVerdict === "safe");
    setSearchQuery(updatedDriver.rawPlateForVerification);

    // Reset form
    setInputPlate("");
    setInputDriverName("");
    setInputNote("");
    setSelectedTags(["Polite & Respectful", "Fair Fare / No Haggling"]);
    setSelectedVerdict("safe");
    setIsLogModalOpen(false);

    // Show toast
    const msg =
      language === "hi"
        ? `✓ ऑटो ${updatedDriver.maskedPlate} कम्युनिटी लेजर में दर्ज हो गया!`
        : `✓ Auto ${updatedDriver.maskedPlate} logged to Community Ledger!`;
    setLogSuccessToast(msg);
    setTimeout(() => setLogSuccessToast(null), 4000);
  };

  // Filter reviews for currently selected driver
  const currentDriverReviews = selectedDriver
    ? reviews.filter(
        (r) =>
          normalizePlate(r.plate) ===
            normalizePlate(selectedDriver.rawPlateForVerification) ||
          normalizePlate(r.maskedPlate) ===
            normalizePlate(selectedDriver.maskedPlate)
      )
    : [];

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      {/* Top Banner: Crowdsourced Community Auto Ledger */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {t("autoTrustTitle")}
              </h3>
              <p className="text-[11px] text-teal-100/90 leading-tight">
                {t("autoTrustSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {logSuccessToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{logSuccessToast}</span>
          </div>
          <button
            onClick={() => setLogSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Check Auto Plate & + Log Auto Section */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-teal-600" />
            <span>{t("checkPlateLabel")}</span>
          </label>

          {/* Prominent + Log & Rate an Auto Button */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="text-xs font-black text-white bg-[#0D9488] hover:bg-teal-700 px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t("logAutoBtn")}</span>
          </button>
        </div>

        {/* Plate Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("checkPlatePlaceholder")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase font-mono"
            />
            <Car className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>{t("verifyBtn")}</span>
          </button>
        </form>

        {searchFeedback && (
          <div className="text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="flex-1">{searchFeedback}</span>
          </div>
        )}

        {/* Preset Plates Strip (Click to Inspect) */}
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
            {t("quickStandBadges")}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_PLATES.map((preset) => {
              const isSelected =
                selectedDriver &&
                normalizePlate(selectedDriver.rawPlateForVerification) ===
                  normalizePlate(preset.plate);
              return (
                <button
                  key={preset.plate}
                  type="button"
                  onClick={() => handleSelectPreset(preset.plate)}
                  className={`px-3 py-1.5 rounded-xl text-left transition-all border cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? "bg-teal-50 border-teal-600 ring-2 ring-teal-500/20"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <div className="font-mono text-xs font-black text-slate-900">
                    {preset.plate}
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">
                    {preset.name.split(" ")[0]} • {preset.hub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Auto Trust Stamp Result Card */}
      {selectedDriver ? (
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-teal-200 relative overflow-hidden space-y-4">
          {/* Top Verification & Verdict Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-black border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t("verifiedStandDriver")}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>
                {t("verifiedSince")} {selectedDriver.verifiedYear}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-md flex-shrink-0 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedDriver.photoUrl}
                  alt={selectedDriver.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedDriver.name}
                </h4>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {selectedDriver.vehicleType}
                </span>
              </div>

              {/* Privacy-Masked Plate */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-300 shadow-inner">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">IND</span>
                  <span>{selectedDriver.maskedPlate}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">
                  (Privacy Masked)
                </span>
              </div>

              <p className="text-[11px] text-slate-600 font-medium pt-0.5 flex items-center gap-1">
                <span className="text-teal-600 font-bold">📍</span>
                <span>{selectedDriver.hubStation}</span>
              </p>
            </div>
          </div>

          {/* Key Safety Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100">
              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                {t("womenSafeRides")}
              </span>
              <div className="text-2xl font-black text-teal-900 mt-0.5 flex items-baseline gap-1">
                <span>{vouchCount}</span>
                <span className="text-xs font-bold text-teal-600">trips</span>
              </div>
              <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
                {t("zeroComplaints")}
              </span>
            </div>

            <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-200">
              <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">
                {t("safetyRating")}
              </span>
              <div className="text-2xl font-black text-orange-600 mt-0.5 flex items-baseline gap-1">
                <span>★ {selectedDriver.rating}</span>
                <span className="text-xs font-bold text-orange-500">/ 5.0</span>
              </div>
              <span className="text-[10px] text-orange-700 font-medium block mt-0.5">
                Vouched by Bhopal commuters
              </span>
            </div>
          </div>

          {/* Community Safety Tags */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
              {t("communitySafetyTags")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedDriver.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                >
                  <Award className="w-3 h-3 text-[#F97316]" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Recent Reviews for this Auto */}
          {currentDriverReviews.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Recent Commuter Reviews ({currentDriverReviews.length})</span>
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {currentDriverReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {rev.commuterBadge || "Commuter"}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {rev.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      &quot;{rev.note}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Community Vouch & Ride Link Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleToggleVouch}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                hasVouched
                  ? "bg-rose-50 text-rose-700 border border-rose-300 shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  hasVouched
                    ? "fill-rose-500 text-rose-500 animate-pulse"
                    : "text-slate-500"
                }`}
              />
              <span>{hasVouched ? t("vouchedRecorded") : t("vouchForDriver")}</span>
            </button>

            {onSelectAutoForRide && (
              <button
                onClick={() => onSelectAutoForRide(selectedDriver)}
                className="py-2.5 px-3.5 bg-[#0D9488] hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>{t("useInRide")}</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Search an auto registration plate above or pick from the community feed.
        </div>
      )}

      {/* Live Community Auto Ledger Feed */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {t("recentLedgerFeed")}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {reviews.length} entries
          </span>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight">
          {t("recentLedgerDesc")}
        </p>

        {/* Review list */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {reviews.map((rev) => {
            const isCaution = rev.verdict === "caution";
            const isNeutral = rev.verdict === "neutral";

            return (
              <div
                key={rev.id}
                onClick={() => handleSelectPreset(rev.plate)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/70 hover:bg-teal-50/40 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      {rev.maskedPlate}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">
                      {rev.driverName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      isCaution
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isNeutral
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {isCaution
                      ? t("verdictCaution")
                      : isNeutral
                      ? t("verdictNeutral")
                      : t("verdictSafe")}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-snug">
                  &quot;{rev.note}&quot;
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {rev.tags.slice(0, 2).map((tg, i) => (
                      <span
                        key={i}
                        className="bg-white/80 text-slate-600 px-1.5 py-0.2 rounded font-semibold border border-slate-200"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-2.5 h-2.5" />
                    {rev.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent '+ Log & Rate an Auto' Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 text-slate-900 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0D9488]" />
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {t("logAutoModalTitle")}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {t("logAutoModalDesc")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitLog} className="space-y-3.5">
              {/* Plate Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t("plateInputLabel")} *
                </label>
                <input
                  type="text"
                  required
                  value={inputPlate}
                  onChange={(e) => setInputPlate(e.target.value)}
                  placeholder={t("plateInputPlaceholder")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase placeholder:normal-case placeholder:font-sans"
                />
              </div>

              {/* Driver Name (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t("driverNameOptional")}
                </label>
                <input
                  type="text"
                  value={inputDriverName}
                  onChange={(e) => setInputDriverName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar / Mohammad Rafiq"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Hub Stand & Vehicle Type */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">
                    {t("hubStationLabel")}
                  </label>
                  <select
                    value={inputHub}
                    onChange={(e) => setInputHub(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Rani Kamalapati Railway Station Stand">RKMP Station</option>
                    <option value="MP Nagar Zone 1 Stand">MP Nagar Zone 1</option>
                    <option value="Habibganj West Gate Stand">Habibganj West</option>
                    <option value="AIIMS Metro Station Stand">AIIMS Metro</option>
                    <option value="Bhopal Junction Main Stand">Bhopal Junction</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">
                    Vehicle Type
                  </label>
                  <select
                    value={inputVehicleType}
                    onChange={(e) =>
                      setInputVehicleType(e.target.value as "CNG Auto" | "Electric Rickshaw")
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CNG Auto">CNG Auto</option>
                    <option value="Electric Rickshaw">Electric Rickshaw (EV)</option>
                  </select>
                </div>
              </div>

              {/* Safety Verdict */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t("verdictLabel")} *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedVerdict("safe")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedVerdict === "safe"
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-800 font-black"
                        : "bg-slate-50 border-slate-200 text-slate-600 font-bold"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-600" />
                    <span className="text-[10px] block leading-tight">
                      {t("verdictSafe")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVerdict("neutral")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedVerdict === "neutral"
                        ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-800 font-black"
                        : "bg-slate-50 border-slate-200 text-slate-600 font-bold"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 mx-auto mb-0.5 text-amber-600" />
                    <span className="text-[10px] block leading-tight">
                      {t("verdictNeutral")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVerdict("caution")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedVerdict === "caution"
                        ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-800 font-black"
                        : "bg-slate-50 border-slate-200 text-slate-600 font-bold"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-0.5 text-rose-600" />
                    <span className="text-[10px] block leading-tight">
                      {t("verdictCaution")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Behavior Tags (1-Tap Multi-select) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t("behaviorTagsLabel")}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BEHAVIOR_TAG_OPTIONS.map((tag) => {
                    const tagLabel = language === "hi" ? tag.labelHi : tag.labelEn;
                    const isSelected = selectedTags.includes(tag.labelEn);
                    return (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => toggleTag(tag.labelEn)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-teal-50 border-teal-600 text-teal-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tagLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Line Commuter Note */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t("shortNoteLabel")}
                </label>
                <input
                  type="text"
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  placeholder={t("shortNotePlaceholder")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {t("cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {t("submitLedgerBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Honest Data Disclosure Note */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] leading-relaxed flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">
            Pilot Demo Mode • Simulated Transit Data for Evaluation:
          </strong>{" "}
          Auto registration plates are formatted with privacy masks (e.g. MP-04-XX-4821)
          in compliance with commuter privacy guidelines. Crowd ratings and stand
          reviews reflect pilot datasets for Bhopal transit corridors.
        </div>
      </div>
    </div>
  );
}
