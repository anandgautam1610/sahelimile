"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import LeafletMap from "@/components/map/LeafletMap";
import PlaceSearchInput, { PlaceResult } from "./PlaceSearchInput";
import {
  TransitHub,
  CommuteDestination,
  CoRiderMatch,
  Coordinates,
} from "@/lib/types";
import { getOsrmRoute } from "@/lib/geo/osrm";
import {
  POPULAR_PAN_INDIA_PRESETS,
  PanIndiaPreset,
  calculatePanIndiaAutoFare,
  generateContextAwareMatches,
} from "@/lib/geo/panIndia";
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Info,
  Moon,
  Compass,
  Check,
  Zap,
  Crosshair,
  Loader2,
  CheckCircle,
  X,
  Edit3,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FindMatchTabProps {
  onStartRide: (
    match: CoRiderMatch,
    hub: TransitHub,
    destination: CommuteDestination
  ) => void;
  triggerInstantDemo?: boolean;
}

export default function FindMatchTab({
  onStartRide,
  triggerInstantDemo = false,
}: FindMatchTabProps) {
  const { language, t } = useLanguage();

  // Selected Transit Hub (Source)
  const [selectedHub, setSelectedHub] = useState<TransitHub>({
    id: "hub-rkmp",
    name: "Rani Kamalapati Railway Station (Gate 1)",
    shortName: "Rani Kamalapati Station",
    city: "Bhopal",
    coordinates: { lat: 23.2185, lng: 77.4398 },
    type: "railway",
    description: "Main central terminal with high evening footfall & metro interchange",
    dailyFootfall: "45,000+",
    activeSaheliCount: 14,
  });

  // Selected Destination (Drop)
  const [selectedDest, setSelectedDest] = useState<CommuteDestination>({
    id: "dest-arera",
    name: "Arera Colony (E-6 Sector)",
    hubId: "hub-rkmp",
    coordinates: { lat: 23.2098, lng: 77.4278 },
    landmark: "Near Paryavaran Parisar / 10 Number Market",
    estimatedSoloFare: 85,
    distanceKm: 3.4,
  });

  // Active City state for UI badges
  const [activeCityName, setActiveCityName] = useState<string>("Bhopal");

  // Evening Safe-Corridor Mode Toggle (defaults to active for night commute security)
  const [eveningSafeCorridor, setEveningSafeCorridor] = useState<boolean>(true);

  // Dynamic Road Metrics from OSRM
  const [roadMetrics, setRoadMetrics] = useState({
    distanceKm: 3.4,
    durationMins: 9,
    soloFare: 85,
    sharedFare: 45,
    savings: 40,
  });

  // Matched co-riders
  const [matchedRiders, setMatchedRiders] = useState<CoRiderMatch[]>([]);
  // Currently inspected co-rider for map overlay
  const [selectedMatch, setSelectedMatch] = useState<CoRiderMatch | null>(null);
  // Route coordinates for Leaflet road polyline
  const [userRouteCoords, setUserRouteCoords] = useState<[number, number][]>([]);
  const [matchRouteCoords, setMatchRouteCoords] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Rapido-Style Interactive Pin-Drop Mode State
  const [isPinDropMode, setIsPinDropMode] = useState<boolean>(false);
  const [pinDropTarget, setPinDropTarget] = useState<"source" | "destination">("destination");
  const [pinDropCenter, setPinDropCenter] = useState<Coordinates>({ lat: 23.2098, lng: 77.4278 });
  const [pinDropAddress, setPinDropAddress] = useState<string>("");
  const [pinDropCity, setPinDropCity] = useState<string>("Bhopal");
  const [customLandmarkName, setCustomLandmarkName] = useState<string>("");
  const [isReverseLocating, setIsReverseLocating] = useState<boolean>(false);

  const reverseGeocodeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Load routes, compute OSRM driving polyline & dynamic fare whenever Source or Destination changes
  useEffect(() => {
    let isCancelled = false;

    async function computeMatchesAndRoutes() {
      setIsLoadingRoute(true);

      // 1. Fetch real road route from OSRM
      const userRoute = await getOsrmRoute(
        selectedHub.coordinates,
        selectedDest.coordinates
      );

      if (isCancelled) return;
      setUserRouteCoords(userRoute.coordinates);

      // 2. Compute dynamic Indian auto-rickshaw metered fare & time
      const distKm = Number((userRoute.distanceMeters / 1000).toFixed(1));
      const durationMins = Math.max(3, Math.round(userRoute.durationSeconds / 60));
      const fareCalc = calculatePanIndiaAutoFare(distKm);

      setRoadMetrics({
        distanceKm: distKm,
        durationMins,
        soloFare: fareCalc.soloFare,
        sharedFare: fareCalc.sharedFare,
        savings: fareCalc.savings,
      });

      // Update destination's dynamic attributes
      setSelectedDest((prev) => ({
        ...prev,
        distanceKm: distKm,
        estimatedSoloFare: fareCalc.soloFare,
      }));

      // 3. Generate context-aware verified co-riders for the selected city & corridor
      const dynamicMatches = generateContextAwareMatches(
        {
          name: selectedHub.shortName || selectedHub.name,
          city: selectedHub.city,
          coordinates: selectedHub.coordinates,
        },
        {
          name: selectedDest.name,
          city: selectedHub.city,
          coordinates: selectedDest.coordinates,
        },
        distKm,
        fareCalc.soloFare
      );

      setMatchedRiders(dynamicMatches);

      // 4. Default inspected match and fetch match route for overlay
      if (dynamicMatches.length > 0) {
        setSelectedMatch(dynamicMatches[0]);

        const matchRoute = await getOsrmRoute(
          selectedHub.coordinates,
          dynamicMatches[0].destinationCoords
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
  }, [selectedHub.coordinates, selectedDest.coordinates]);

  // Handle selecting a specific co-rider for map inspection
  const handleSelectMatchForPreview = async (rider: CoRiderMatch) => {
    setSelectedMatch(rider);
    const matchRoute = await getOsrmRoute(
      selectedHub.coordinates,
      rider.destinationCoords
    );
    setMatchRouteCoords(matchRoute.coordinates);
  };

  // Place selection from Source input
  const handleSelectSource = (place: PlaceResult) => {
    const newHub: TransitHub = {
      id: `hub-${Date.now()}`,
      name: place.title,
      shortName: place.title.split(",")[0].split("(")[0].trim(),
      city: place.city || "India",
      coordinates: place.coordinates,
      type: "railway",
      description: place.subtitle,
      dailyFootfall: "35,000+",
      activeSaheliCount: 18,
    };
    setSelectedHub(newHub);
    setActiveCityName(place.city);
  };

  // Place selection from Destination input
  const handleSelectDest = (place: PlaceResult) => {
    const newDest: CommuteDestination = {
      id: `dest-${Date.now()}`,
      name: place.title,
      hubId: selectedHub.id,
      coordinates: place.coordinates,
      landmark: place.subtitle,
      estimatedSoloFare: roadMetrics.soloFare,
      distanceKm: roadMetrics.distanceKm,
    };
    setSelectedDest(newDest);
  };

  // Preset shortcut selection
  const handleSelectPreset = (preset: PanIndiaPreset) => {
    const newHub: TransitHub = {
      id: `hub-${preset.id}`,
      name: preset.source.title,
      shortName: preset.source.title.split(",")[0].split("(")[0].trim(),
      city: preset.cityName,
      coordinates: preset.source.coordinates,
      type: "railway",
      description: preset.source.subtitle,
      dailyFootfall: "45,000+",
      activeSaheliCount: 24,
    };

    const newDest: CommuteDestination = {
      id: `dest-${preset.id}`,
      name: preset.destination.title,
      hubId: newHub.id,
      coordinates: preset.destination.coordinates,
      landmark: preset.destination.subtitle,
      estimatedSoloFare: 85,
      distanceKm: 3.4,
    };

    setSelectedHub(newHub);
    setSelectedDest(newDest);
    setActiveCityName(preset.cityName);
  };

  // Start Rapido-Style Pin-Drop Mode
  const handleStartPinDrop = (target: "source" | "destination") => {
    setPinDropTarget(target);
    setIsPinDropMode(true);

    const initialCoords =
      target === "source"
        ? selectedHub.coordinates
        : selectedDest.coordinates;

    setPinDropCenter(initialCoords);
    setCustomLandmarkName(
      target === "source"
        ? selectedHub.shortName || selectedHub.name
        : selectedDest.name
    );

    // Scroll map smoothly into view
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // Reverse geocode when map center moves
  const handleMapCenterChange = useCallback(
    (coords: Coordinates) => {
      setPinDropCenter(coords);
      setIsReverseLocating(true);

      if (reverseGeocodeTimerRef.current) {
        clearTimeout(reverseGeocodeTimerRef.current);
      }

      reverseGeocodeTimerRef.current = setTimeout(async () => {
        try {
          const revUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`;
          const res = await fetch(revUrl, {
            headers: {
              "Accept-Language": language === "hi" ? "hi,en" : "en",
            },
          });

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const streetName =
              addr.road ||
              addr.neighbourhood ||
              addr.suburb ||
              addr.commercial ||
              addr.amenity;
            const city =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.state ||
              "India";

            const display = data.display_name
              ? data.display_name.split(",").slice(0, 3).join(", ").trim()
              : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

            setPinDropAddress(display);
            setPinDropCity(city);

            // Auto-fill custom landmark if currently empty or default
            setCustomLandmarkName((prev) => {
              if (
                !prev ||
                prev.includes("Pin-Drop") ||
                prev.includes("Custom")
              ) {
                return streetName ? `${streetName}, ${city}` : display;
              }
              return prev;
            });
          }
        } catch {
          setPinDropAddress(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        } finally {
          setIsReverseLocating(false);
        }
      }, 400);
    },
    [language]
  );

  // Confirm spot and update location
  const handleConfirmPinDrop = () => {
    const finalTitle =
      customLandmarkName.trim() ||
      pinDropAddress ||
      (language === "hi" ? "पिन-ड्रॉप स्थान" : "Pin-Drop Spot");

    if (pinDropTarget === "source") {
      const newHub: TransitHub = {
        id: `hub-pin-${Date.now()}`,
        name: finalTitle,
        shortName: finalTitle.split(",")[0].trim(),
        city: pinDropCity || activeCityName,
        coordinates: pinDropCenter,
        type: "railway",
        description: pinDropAddress || "Exact pin-drop pickup hub",
        dailyFootfall: "35,000+",
        activeSaheliCount: 16,
      };
      setSelectedHub(newHub);
      setActiveCityName(pinDropCity || activeCityName);
    } else {
      const newDest: CommuteDestination = {
        id: `dest-pin-${Date.now()}`,
        name: finalTitle,
        hubId: selectedHub.id,
        coordinates: pinDropCenter,
        landmark: pinDropAddress || finalTitle,
        estimatedSoloFare: roadMetrics.soloFare,
        distanceKm: roadMetrics.distanceKm,
      };
      setSelectedDest(newDest);
    }

    setIsPinDropMode(false);
  };

  // Cancel pin drop mode
  const handleCancelPinDrop = () => {
    setIsPinDropMode(false);
  };

  // Auto trigger if instant demo prop passed
  useEffect(() => {
    if (triggerInstantDemo) {
      handleSelectPreset(POPULAR_PAN_INDIA_PRESETS[0]);
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
                Pan-India Transit Pairing
              </span>
            </div>
            <h3 className="text-sm font-extrabold tracking-tight">
              {t("instantDemoTitle")}
            </h3>
            <p className="text-[11px] text-teal-100 max-w-[240px] leading-snug">
              Works across all Indian cities & stations. Search any live address, local shop, or pick on map.
            </p>
          </div>

          <button
            onClick={() => handleSelectPreset(POPULAR_PAN_INDIA_PRESETS[0])}
            className="flex-shrink-0 bg-[#F97316] hover:bg-orange-600 text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("tryDemoBtn")}</span>
          </button>
        </div>

        <div className="mt-2.5 pt-2 border-t border-teal-600/40 flex items-center justify-between text-[10px] text-teal-200">
          <span>{t("noSignupRequired")}</span>
          <span className="font-semibold text-orange-200">
            Active: {activeCityName}
          </span>
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

      {/* Pan-India Popular Transit Presets (Quick Tap Strip) */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>{t("panIndiaPresets")}</span>
          </label>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.2 rounded">
            Pan-India Shortcuts
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {POPULAR_PAN_INDIA_PRESETS.map((preset) => {
            const isSelected =
              selectedHub.name === preset.source.title &&
              selectedDest.name === preset.destination.title;

            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0D9488] text-white border-teal-600 shadow-md ring-2 ring-teal-500/30 scale-102"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  {isSelected && <Check className="w-3 h-3 text-white flex-shrink-0" />}
                  <span className="text-xs font-black truncate max-w-[170px]">
                    {preset.name}
                  </span>
                </div>
                <div
                  className={`text-[10px] mt-0.5 font-medium ${
                    isSelected ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  📍 {preset.cityName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pan-India Dual Fuzzy Search Form (Photon + OSM Nominatim + Pick on Map) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3.5">
        {/* Source Pickup Input (with 1-Tap GPS & Pin on Map) */}
        <PlaceSearchInput
          label={t("pickupInputLabel")}
          placeholder={
            language === "hi"
              ? "स्टेशन, मेट्रो गेट, दुकान या GPS खोजें..."
              : "Search pickup station, metro gate, shop, or GPS..."
          }
          value={selectedHub.name}
          selectedCoords={selectedHub.coordinates}
          onSelectPlace={handleSelectSource}
          onTriggerPinDrop={() => handleStartPinDrop("source")}
          isSource={true}
          iconType="source"
        />

        {/* Destination Drop Input (with Dual Search & Pin on Map) */}
        <PlaceSearchInput
          label={t("dropInputLabel")}
          placeholder={
            language === "hi"
              ? "गंतव्य कॉलोनी, दुकान, कॉलेज या पता खोजें..."
              : "Search colony, shop (e.g. Ganagram Sweets), or drop address..."
          }
          value={selectedDest.name}
          selectedCoords={selectedDest.coordinates}
          onSelectPlace={handleSelectDest}
          onTriggerPinDrop={() => handleStartPinDrop("destination")}
          isSource={false}
          iconType="destination"
        />

        {/* Dynamic Route Info Badge */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
            <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">
              {selectedDest.landmark || selectedDest.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartPinDrop("destination")}
              className="text-[10px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <Crosshair className="w-3 h-3 text-orange-500" />
              <span>{t("pickExactOnMap")}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex-shrink-0">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>OSRM Road Matched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Real-Road Leaflet Map (Supports Rapido-Style Pin-Drop Mode) */}
      <div ref={mapSectionRef} className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>
              {isPinDropMode
                ? t("pinDropActiveTitle")
                : t("liveRouteMap")}
            </span>
          </span>

          <div className="flex items-center gap-2">
            {isPinDropMode ? (
              <span className="text-[11px] text-orange-600 font-extrabold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>
                  {pinDropTarget === "source"
                    ? t("settingPickup")
                    : t("settingDrop")}
                </span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 font-semibold">
                {isLoadingRoute
                  ? "Calculating Road Route..."
                  : `${roadMetrics.distanceKm} km • ~${roadMetrics.durationMins} mins`}
              </span>
            )}
          </div>
        </div>

        {/* Map Container */}
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
          isPinDropMode={isPinDropMode}
          pinDropTarget={pinDropTarget}
          onCenterChange={handleMapCenterChange}
          className={`${
            isPinDropMode ? "h-[330px]" : "h-[270px]"
          } w-full transition-all duration-300`}
        />

        {/* Pin-Drop Mode Floating Action Bottom Card (Rapido / Uber Style) */}
        {isPinDropMode && (
          <div className="p-3.5 bg-white rounded-2xl border-2 border-orange-400 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold ${
                    pinDropTarget === "source"
                      ? "bg-[#0D9488]"
                      : "bg-[#F97316]"
                  }`}
                >
                  <Crosshair className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">
                    {pinDropTarget === "source"
                      ? t("settingPickup")
                      : t("settingDrop")}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {t("pinDropInstruction")}
                  </p>
                </div>
              </div>

              <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {pinDropCenter.lat.toFixed(4)}, {pinDropCenter.lng.toFixed(4)}
              </div>
            </div>

            {/* Editable Landmark / Shop Name input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-orange-500" />
                <span>{t("customLandmarkPrompt")}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customLandmarkName}
                  onChange={(e) => setCustomLandmarkName(e.target.value)}
                  placeholder="e.g. Gangaram Sweets, Barauni or Metro Gate 2"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-orange-500 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Reverse Geocoded Locality Status */}
            <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-200/80 text-[11px] flex items-start gap-2">
              {isReverseLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 italic">
                    {t("reverseLocating")}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-800 block truncate">
                      {pinDropAddress || "Exact Pin-Drop Location"}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      City: {pinDropCity}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Confirm & Cancel Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmPinDrop}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t("confirmSpotBtn")}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelPinDrop}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t("cancelPinDrop")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Legend (Shown in Normal Map Mode) */}
        {!isPinDropMode && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-[10px] text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
              <span className="truncate max-w-[120px]">
                Origin: {selectedHub.shortName || selectedHub.name.split(" ")[0]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span className="truncate max-w-[120px]">
                You: {selectedDest.name.split(" ")[0]}
              </span>
            </div>
            {selectedMatch && (
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="truncate max-w-[120px]">
                  Co-Rider: {selectedMatch.name.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Road Distance, Time & Indian Auto Fare Split Breakdown */}
      {selectedMatch && (
        <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-2xl p-3.5 border border-teal-200/60 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-black text-teal-800 tracking-wider">
                {t("haversineCorridorOverlap")}
              </span>
              <div className="text-xl font-black text-teal-900 mt-0.5">
                {selectedMatch.overlapPercentage}% Match
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-black text-orange-800 tracking-wider">
                {t("fairFareSplit")}
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="text-xs text-slate-400 line-through">
                  ₹{roadMetrics.soloFare}
                </span>
                <span className="text-xl font-black text-orange-600">
                  ₹{selectedMatch.sharedFare}
                </span>
              </div>
            </div>
          </div>

          {/* Overlap Progress Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-teal-600 rounded-l-full transition-all duration-500"
              style={{ width: `${selectedMatch.overlapPercentage}%` }}
            />
            <div
              className="h-full bg-orange-400 rounded-r-full transition-all duration-500"
              style={{ width: `${100 - selectedMatch.overlapPercentage}%` }}
            />
          </div>

          {/* Fare Formula & Distance Summary */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 pt-0.5">
            <span className="text-teal-800">
              {roadMetrics.distanceKm} km Road Leg (~{roadMetrics.durationMins} mins)
            </span>
            <span className="text-emerald-700 font-bold">
              {t("youSave")} ₹{selectedMatch.savings} (50% Off)
            </span>
          </div>

          <div className="text-[9px] text-slate-400 flex items-center justify-between border-t border-slate-200/50 pt-1 font-medium">
            <span>Formula: Base ₹25 + ₹14/km (Meter Split 50/50)</span>
            <span className="text-teal-700 font-bold">Pan-India Standard</span>
          </div>
        </div>
      )}

      {/* Matched Co-Riders List Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
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
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500/40 flex-shrink-0 bg-slate-100 shadow-xs">
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
                    <span className="text-[9px] text-slate-400 block -mt-0.5 font-medium">
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
                    className="bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-[11px] py-1.5 px-3 rounded-xl shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
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

      {/* Honest Data Disclosure */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] leading-relaxed flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">
            Live Pan-India OpenStreetMap & Photon Routing:
          </strong>{" "}
          Road distance, travel duration, and auto-rickshaw fares are computed
          dynamically via real-world OSRM routing across any Indian city, railway
          terminal, local neighborhood shops, or custom pin-dropped spots.
        </div>
      </div>
    </div>
  );
}
