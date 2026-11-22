"use client";

import React, { useState, useEffect, useRef } from "react";
import { Coordinates } from "@/lib/types";
import {
  MapPin,
  Navigation,
  Loader2,
  X,
  Building2,
  Train,
  Crosshair,
  Compass,
  Store,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface PlaceResult {
  title: string;
  subtitle: string;
  city: string;
  coordinates: Coordinates;
  source?: "photon" | "osm" | "gps" | "map_pin";
  category?: string;
}

interface PlaceSearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  selectedCoords?: Coordinates | null;
  onSelectPlace: (place: PlaceResult) => void;
  onTriggerPinDrop?: (target: "source" | "destination") => void;
  isSource?: boolean;
  iconType?: "source" | "destination";
  className?: string;
}

function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function PlaceSearchInput({
  label,
  placeholder,
  value,
  selectedCoords,
  onSelectPlace,
  onTriggerPinDrop,
  isSource = false,
  iconType = "source",
  className = "",
}: PlaceSearchInputProps) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dual Fuzzy Search Engine (Photon Komoot + OpenStreetMap Nominatim in Parallel)
  const handleInputChange = (text: string) => {
    setQuery(text);
    setLocationError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    debounceTimerRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const trimmedQuery = text.trim();

      // Parallel fetch using Promise.allSettled
      // 1. Photon Komoot API (Excels at POIs, metro stations, shops, local businesses)
      const fetchPhoton = async (): Promise<PlaceResult[]> => {
        try {
          const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
            trimmedQuery
          )}&limit=6&lat=22.5&lon=79.0`;
          const res = await fetch(photonUrl, { signal });
          if (!res.ok) return [];
          const data = await res.json();
          if (!data || !Array.isArray(data.features)) return [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.features
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((f: any) => {
              const cc = f.properties?.countrycode?.toUpperCase();
              const c = f.properties?.country?.toLowerCase();
              return cc === "IN" || c === "india";
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((f: any) => {
              const props = f.properties || {};
              const title =
                props.name || props.street || props.district || "Landmark";
              const localityParts = [
                props.street && props.street !== title ? props.street : null,
                props.suburb,
                props.district,
                props.city,
                props.state,
              ].filter(Boolean);

              const subtitle =
                localityParts.join(", ") || props.country || "India";
              const city =
                props.city || props.district || props.state || "India";

              return {
                title,
                subtitle,
                city,
                coordinates: {
                  lat: f.geometry.coordinates[1],
                  lng: f.geometry.coordinates[0],
                },
                source: "photon" as const,
                category: props.osm_value || props.type || "Local Spot",
              };
            });
        } catch {
          return [];
        }
      };

      // 2. OpenStreetMap Nominatim API (Excels at addresses, administrative boundaries, colonies)
      const fetchNominatim = async (): Promise<PlaceResult[]> => {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&addressdetails=1&namedetails=1&limit=6&q=${encodeURIComponent(
            trimmedQuery
          )}`;
          const res = await fetch(nomUrl, {
            signal,
            headers: {
              "Accept-Language": language === "hi" ? "hi,en" : "en",
            },
          });
          if (!res.ok) return [];
          const data = await res.json();
          if (!Array.isArray(data)) return [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.map((item: any) => {
            const parts = (item.display_name || "").split(",");
            const title =
              item.namedetails?.name ||
              item.name ||
              parts[0]?.trim() ||
              "Location";
            const subtitle =
              parts.slice(1, 4).join(", ").trim() ||
              parts.slice(1).join(", ").trim();

            const city =
              item.address?.city ||
              item.address?.town ||
              item.address?.suburb ||
              item.address?.state_district ||
              item.address?.state ||
              "India";

            return {
              title,
              subtitle,
              city,
              coordinates: {
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
              },
              source: "osm" as const,
              category: item.type || "Colony / Area",
            };
          });
        } catch {
          return [];
        }
      };

      try {
        const [photonRes, nominatimRes] = await Promise.allSettled([
          fetchPhoton(),
          fetchNominatim(),
        ]);

        const photonResults =
          photonRes.status === "fulfilled" ? photonRes.value : [];
        const nominatimResults =
          nominatimRes.status === "fulfilled" ? nominatimRes.value : [];

        // Combine both engines
        const combined = [...photonResults, ...nominatimResults];

        // Deduplicate results within 120m or identical titles
        const deduplicated: PlaceResult[] = [];
        for (const candidate of combined) {
          const isDuplicate = deduplicated.some((existing) => {
            const dist = calculateDistanceMeters(
              existing.coordinates.lat,
              existing.coordinates.lng,
              candidate.coordinates.lat,
              candidate.coordinates.lng
            );
            const sameTitle =
              existing.title.toLowerCase().trim() ===
              candidate.title.toLowerCase().trim();
            return dist < 120 || sameTitle;
          });

          if (!isDuplicate) {
            deduplicated.push(candidate);
          }
        }

        setSuggestions(deduplicated);
        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setIsLoading(false);
      }
    }, 350);
  };

  // Select place from dropdown
  const handleSelect = (place: PlaceResult) => {
    setQuery(place.title);
    setIsOpen(false);
    setSuggestions([]);
    onSelectPlace(place);
  };

  // 1-Tap "Use Current GPS Location"
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        language === "hi"
          ? "आपके डिवाइस में GPS उपलब्ध नहीं है।"
          : "Geolocation is not supported by your device."
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Reverse geocode via Nominatim
          const revUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
          const res = await fetch(revUrl, {
            headers: {
              "Accept-Language": language === "hi" ? "hi,en" : "en",
            },
          });

          let placeTitle =
            language === "hi" ? "वर्तमान GPS स्थान" : "Current GPS Location";
          let placeSubtitle = `Near coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          let city = "Live Location";

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road =
              addr.road || addr.suburb || addr.neighbourhood || addr.residential;
            city =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.state ||
              "India";
            if (road) {
              placeTitle = `${road} (GPS)`;
              placeSubtitle = `${city}, ${addr.state || "India"}`;
            } else if (data.display_name) {
              const parts = data.display_name.split(",");
              placeTitle = parts[0]?.trim() || placeTitle;
              placeSubtitle = parts.slice(1, 3).join(", ").trim();
            }
          }

          const livePlace: PlaceResult = {
            title: placeTitle,
            subtitle: placeSubtitle,
            city,
            coordinates: { lat, lng },
            source: "gps",
          };

          setQuery(placeTitle);
          setIsLocating(false);
          setIsOpen(false);
          onSelectPlace(livePlace);
        } catch {
          // Fallback with raw coordinates
          const fallbackPlace: PlaceResult = {
            title:
              language === "hi" ? "वर्तमान GPS स्थान" : "Current GPS Location",
            subtitle: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
            city: "Live GPS",
            coordinates: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            source: "gps",
          };
          setQuery(fallbackPlace.title);
          setIsLocating(false);
          onSelectPlace(fallbackPlace);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? language === "hi"
              ? "GPS अनुमति अस्वीकृत हुई। कृपया नाम से खोजें या नक्शे पर पिन चुनें।"
              : "Location access denied. Please search or pick on map."
            : language === "hi"
            ? "GPS स्थान प्राप्त नहीं हो सका।"
            : "Could not fetch GPS location."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleTriggerPinDrop = () => {
    setIsOpen(false);
    if (onTriggerPinDrop) {
      onTriggerPinDrop(iconType);
    }
  };

  return (
    <div ref={containerRef} className={`space-y-1 relative ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              iconType === "source" ? "bg-[#0D9488]" : "bg-[#F97316]"
            }`}
          />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1.5">
          {/* Rapido-Style Pick on Map shortcut icon button in header */}
          {onTriggerPinDrop && (
            <button
              type="button"
              onClick={handleTriggerPinDrop}
              className="text-[10px] font-bold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Pick exact spot on map"
            >
              <Crosshair className="w-3 h-3 text-teal-600" />
              <span>{language === "hi" ? "नक्शा पिन" : "Pin on Map"}</span>
            </button>
          )}

          {/* GPS Button for Source Pickup Input */}
          {isSource && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="text-[10px] font-extrabold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/90 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Locate via device GPS"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3 h-3 text-teal-600 animate-spin" />
                  <span>
                    {language === "hi" ? "GPS खोज रहे हैं..." : "Locating..."}
                  </span>
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3 text-teal-600 fill-teal-600/20" />
                  <span>{language === "hi" ? "GPS चालू करें" : "Use GPS"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Input container */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-2xl py-2.5 pl-9 pr-8 text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-xs"
        />

        {/* Icon */}
        <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
          ) : iconType === "source" ? (
            <Train className="w-4 h-4 text-[#0D9488]" />
          ) : (
            <Building2 className="w-4 h-4 text-[#F97316]" />
          )}
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Location Error alert */}
      {locationError && (
        <div className="text-[10px] text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl px-2.5 py-1">
          {locationError}
        </div>
      )}

      {/* Dropdown Results (Merged Photon + OSM Nominatim + Pick on Map Action) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-600" />
              <span>{t("dualSearchBadge")}</span>
            </span>
            <span>{suggestions.length} places found</span>
          </div>

          {/* Results List */}
          {suggestions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full p-2.5 text-left hover:bg-teal-50/70 transition-colors flex items-start gap-2.5 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      item.source === "photon"
                        ? "bg-amber-50 group-hover:bg-[#F97316] text-[#F97316] group-hover:text-white"
                        : "bg-teal-50 group-hover:bg-[#0D9488] text-teal-700 group-hover:text-white"
                    }`}
                  >
                    {item.category?.includes("shop") ||
                    item.category?.includes("sweet") ||
                    item.source === "photon" ? (
                      <Store className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded-full flex-shrink-0">
                        {item.city}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : !isLoading ? (
            /* Zero Results State with Direct Map Pin Action */
            <div className="p-4 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                {t("noSearchMatches")}
              </p>
              <p className="text-[10px] text-slate-400">
                &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : null}

          {/* Bottom Action Bar: Rapido-Style Pick on Map */}
          {onTriggerPinDrop && (
            <div className="p-2 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-orange-50/80 border-t border-slate-200">
              <button
                type="button"
                onClick={handleTriggerPinDrop}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-teal-300 text-teal-800 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98 group"
              >
                <Crosshair className="w-4 h-4 text-orange-500 group-hover:rotate-45 transition-transform" />
                <span>{t("pickExactOnMap")}</span>
                <span className="text-[10px] font-normal text-slate-500">
                  (Rapido Pin Mode)
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
