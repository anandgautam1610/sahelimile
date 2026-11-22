"use client";

import React, { useState, useEffect } from "react";
import LeafletMap from "@/components/map/LeafletMap";
import {
  PILOT_TRANSIT_HUBS,
  PILOT_DESTINATIONS,
  PILOT_MATCHED_RIDERS,
} from "@/lib/data/pilotData";
import {
  TransitHub,
  CommuteDestination,
  CoRiderMatch,
} from "@/lib/types";
import {
  haversineDistance,
  calculateRouteOverlap,
  calculateFareSplit,
} from "@/lib/geo/haversine";
import { getOsrmRoute } from "@/lib/geo/osrm";
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  IndianRupee,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Info,
  Moon,
  Sun,
  ShieldAlert,
  Check,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FindMatchTabProps {
  onStartRide: (match: CoRiderMatch, hub: TransitHub, destination: CommuteDestination) => void;
  triggerInstantDemo?: boolean;
}

export default function FindMatchTab({
  onStartRide,
  triggerInstantDemo = false,
}: FindMatchTabProps) {
  const { language, t } = useLanguage();

  // Selected Transit Hub
  const [selectedHub, setSelectedHub] = useState<TransitHub>(PILOT_TRANSIT_HUBS[0]);
  // Selected Destination
  const [selectedDest, setSelectedDest] = useState<CommuteDestination>(
    PILOT_DESTINATIONS[0]
  );
  // Evening Safe-Corridor Mode Toggle (defaults to active for evening commutes)
  const [eveningSafeCorridor, setEveningSafeCorridor] = useState<boolean>(true);

  // Matched co-riders
  const [matchedRiders, setMatchedRiders] = useState<CoRiderMatch[]>([]);
  // Currently inspected co-rider for map overlay
  const [selectedMatch, setSelectedMatch] = useState<CoRiderMatch | null>(null);
  // Route coordinates for user and selected match
  const [userRouteCoords, setUserRouteCoords] = useState<[number, number][]>([]);
  const [matchRouteCoords, setMatchRouteCoords] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [overlapThreshold, setOverlapThreshold] = useState(65); // Minimum 65% per SPEC

  // Load routes and compute matches whenever hub or destination changes
  useEffect(() => {
    let isCancelled = false;

    async function computeMatchesAndRoutes() {
      setIsLoadingRoute(true);

      // 1. Fetch OSRM user route
      const userRoute = await getOsrmRoute(
        selectedHub.coordinates,
        selectedDest.coordinates
      );

      if (isCancelled) return;
      setUserRouteCoords(userRoute.coordinates);

      // 2. Compute Haversine overlap for each candidate rider
      const computedMatches: CoRiderMatch[] = PILOT_MATCHED_RIDERS.map((rider) => {
        const overlap = calculateRouteOverlap(
          selectedHub.coordinates,
          selectedDest.coordinates,
          rider.destinationCoords
        );

        const fareCalc = calculateFareSplit(
          selectedDest.estimatedSoloFare,
          overlap
        );

        return {
          ...rider,
          overlapPercentage: overlap,
          soloFare: selectedDest.estimatedSoloFare,
          sharedFare: fareCalc.sharedFare,
          savings: fareCalc.savings,
        };
      });

      // Filter by >= 65% overlap per SPEC
      const eligibleMatches = computedMatches.filter(
        (m) => m.overlapPercentage >= overlapThreshold
      );

      // Fallback if none meet strict threshold for synthetic test
      const finalMatches =
        eligibleMatches.length > 0
          ? eligibleMatches
          : computedMatches.sort((a, b) => b.overlapPercentage - a.overlapPercentage);

      setMatchedRiders(finalMatches);

      // Set default inspected match
      if (finalMatches.length > 0) {
        setSelectedMatch(finalMatches[0]);

        // Fetch match route
        const matchRoute = await getOsrmRoute(
          selectedHub.coordinates,
          finalMatches[0].destinationCoords
        );
        if (!isCancelled) {
          setMatchRouteCoords(matchRoute.coordinates);
        }
      }

      setIsLoadingRoute(false);
    }

    computeMatchesAndRoutes();

    return () => {
      isCancelled = true;
    };
  }, [selectedHub, selectedDest, overlapThreshold]);

  // Handle selecting a specific co-rider to preview on the map
  const handleSelectMatchForPreview = async (rider: CoRiderMatch) => {
    setSelectedMatch(rider);
    const matchRoute = await getOsrmRoute(
      selectedHub.coordinates,
      rider.destinationCoords
    );
    setMatchRouteCoords(matchRoute.coordinates);
  };

  // 1-Click Pilot Demo Action
  const handleTriggerPilotDemo = () => {
    setSelectedHub(PILOT_TRANSIT_HUBS[0]); // Rani Kamalapati
    setSelectedDest(PILOT_DESTINATIONS[0]); // Arera Colony E-6
  };

  // Auto trigger if passed from parent or query param
  useEffect(() => {
    if (triggerInstantDemo) {
      handleTriggerPilotDemo();
    }
  }, [triggerInstantDemo]);

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      {/* 1-Click Judge / Pilot Demo Mode Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 rounded-2xl p-4 text-white shadow-lg shadow-teal-950/15 border border-teal-600/50">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-300">
                1-Click Judge / Pilot Demo
              </span>
            </div>
            <h3 className="text-sm font-extrabold tracking-tight">
              {t("instantDemoTitle")}
            </h3>
            <p className="text-[11px] text-teal-100 max-w-[240px] leading-snug">
              {t("demoDesc")}
            </p>
          </div>

          <button
            onClick={handleTriggerPilotDemo}
            className="flex-shrink-0 bg-[#F97316] hover:bg-orange-600 text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("tryDemoBtn")}</span>
          </button>
        </div>

        <div className="mt-2.5 pt-2 border-t border-teal-600/40 flex items-center justify-between text-[10px] text-teal-200">
          <span>{t("noSignupRequired")}</span>
          <span className="font-semibold text-orange-200">Bhopal Pilot Ready</span>
        </div>
      </div>

      {/* Evening Safe-Corridor Active Toggle Card */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-2xl p-3.5 text-white shadow-md border border-teal-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              eveningSafeCorridor
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/40 animate-pulse"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            <Moon className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold tracking-tight text-white">
                {t("eveningModeTitle")}
              </h4>
              <span className="text-[9px] font-extrabold bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded border border-teal-500/30">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-300 max-w-[210px] leading-tight pt-0.5">
              {t("eveningModeDesc")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setEveningSafeCorridor(!eveningSafeCorridor)}
          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex-shrink-0 ${
            eveningSafeCorridor
              ? "bg-[#0D9488] text-white border-teal-400"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          {eveningSafeCorridor ? "ON" : "OFF"}
        </button>
      </div>

      {/* 1-Tap Horizontally Scrollable Colony Chips */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>{t("quickColonyChips")}</span>
          </label>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.2 rounded">
            1-Tap Select
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
          {PILOT_DESTINATIONS.map((dest) => {
            const isSelected = selectedDest.id === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-teal-600 shadow-md ring-2 ring-teal-500/30 scale-102"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  {isSelected && <Check className="w-3 h-3 text-white flex-shrink-0" />}
                  <span className="text-xs font-bold truncate max-w-[150px]">
                    {dest.name}
                  </span>
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  ~{dest.distanceKm} km • ₹{dest.estimatedSoloFare} solo
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        {/* Origin Hub */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
            <span>{t("originStationLabel")}</span>
          </label>
          <div className="mt-1 relative">
            <select
              value={selectedHub.id}
              onChange={(e) => {
                const found = PILOT_TRANSIT_HUBS.find((h) => h.id === e.target.value);
                if (found) setSelectedHub(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl py-2.5 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {PILOT_TRANSIT_HUBS.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.shortName} ({hub.activeSaheliCount} active commuters)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination Drop */}
        <div>
          <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span>{t("destDropLabel")}</span>
          </label>
          <div className="mt-1 relative">
            <select
              value={selectedDest.id}
              onChange={(e) => {
                const found = PILOT_DESTINATIONS.find((d) => d.id === e.target.value);
                if (found) setSelectedDest(found);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl py-2.5 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {PILOT_DESTINATIONS.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name} (~{dest.distanceKm} km • ₹{dest.estimatedSoloFare} solo)
                </option>
              ))}
            </select>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{t("landmarkLabel")}: {selectedDest.landmark}</span>
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map with OSRM Polylines */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>{t("liveRouteMap")}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {isLoadingRoute ? "Fetching route..." : "Dynamic OSM Tiles"}
          </span>
        </div>

        <LeafletMap
          origin={{
            ...selectedHub.coordinates,
            label: selectedHub.name,
          }}
          userDestination={{
            ...selectedDest.coordinates,
            label: selectedDest.name,
          }}
          matchDestination={
            selectedMatch
              ? {
                  ...selectedMatch.destinationCoords,
                  label: `${selectedMatch.name} (${selectedMatch.destinationName})`,
                }
              : undefined
          }
          routeCoordinates={userRouteCoords}
          matchRouteCoordinates={matchRouteCoords}
          overlapPercentage={selectedMatch?.overlapPercentage}
          className="h-[270px] w-full"
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
            <span>Origin: {selectedHub.shortName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
            <span>You: {selectedDest.name.split(" ")[0]}</span>
          </div>
          {selectedMatch && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Match: {selectedMatch.name.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Overlap Matching Engine Stats */}
      {selectedMatch && (
        <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-2xl p-3.5 border border-teal-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                {t("haversineCorridorOverlap")}
              </span>
              <div className="text-xl font-black text-teal-900 mt-0.5">
                {selectedMatch.overlapPercentage}% Match
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">
                {t("fairFareSplit")}
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="text-xs text-slate-400 line-through">
                  ₹{selectedDest.estimatedSoloFare}
                </span>
                <span className="text-xl font-black text-orange-600">
                  ₹{selectedMatch.sharedFare}
                </span>
              </div>
            </div>
          </div>

          {/* Overlap Progress Bar */}
          <div className="mt-2.5 w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-teal-600 rounded-l-full transition-all duration-500"
              style={{ width: `${selectedMatch.overlapPercentage}%` }}
            />
            <div
              className="h-full bg-orange-400 rounded-r-full transition-all duration-500"
              style={{ width: `${100 - selectedMatch.overlapPercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <span className="text-teal-700">
              {t("corridorShared")}: ~{((selectedDest.distanceKm * selectedMatch.overlapPercentage) / 100).toFixed(1)} km
            </span>
            <span className="text-emerald-700 font-bold">
              {t("youSave")} ₹{selectedMatch.savings} (50% Off)
            </span>
          </div>
        </div>
      )}

      {/* Matched Co-Riders List Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>{t("verifiedCoRiders")}</span>
          </h4>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            {matchedRiders.length} {t("availableCount")}
          </span>
        </div>

        {/* Co-Rider Cards */}
        <div className="space-y-3">
          {matchedRiders.map((rider) => {
            const isSelected = selectedMatch?.id === rider.id;
            return (
              <div
                key={rider.id}
                onClick={() => handleSelectMatchForPreview(rider)}
                className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500/40 flex-shrink-0 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs text-slate-900">
                          {rider.name}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
                          {rider.verificationBadge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        {rider.organization}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          ★ {rider.safetyRating}
                        </span>
                        <span>•</span>
                        <span>{rider.completedRides} rides completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Overlap & Fare Split Badge */}
                  <div className="text-right flex-shrink-0">
                    <div className="inline-block px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-black text-xs">
                      {rider.overlapPercentage}% Overlap
                    </div>
                    <div className="mt-1 text-sm font-black text-orange-600">
                      ₹{rider.sharedFare}
                    </div>
                    <span className="text-[9px] text-slate-400 block -mt-0.5">
                      (Save ₹{rider.savings})
                    </span>
                  </div>
                </div>

                {/* Sub details */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-teal-600" />
                    <span>{rider.departureWindow}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRide(rider, selectedHub, selectedDest);
                    }}
                    className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-xl shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>{t("connectAndRide")}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pilot Synthetic Demo Badge Disclaimer */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] leading-relaxed flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Pilot Demo Mode • Simulated Transit Data for Evaluation:</strong> Commuter profiles, routes, and auto stands are pre-loaded for Rani Kamalapati Station & Bhopal transit hubs per Buildathon guidelines. Real identity verification occurs via corporate email / college ID SSO.
        </div>
      </div>
    </div>
  );
}
