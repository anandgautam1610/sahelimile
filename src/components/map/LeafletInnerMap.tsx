"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Coordinates } from "@/lib/types";

export interface LeafletMapProps {
  origin: Coordinates & { label?: string };
  userDestination?: Coordinates & { label?: string };
  matchDestination?: Coordinates & { label?: string };
  routeCoordinates?: [number, number][];
  matchRouteCoordinates?: [number, number][];
  overlapPercentage?: number;
  className?: string;
  isPinDropMode?: boolean;
  pinDropTarget?: "source" | "destination";
  onCenterChange?: (coords: Coordinates) => void;
}

export default function LeafletInnerMap({
  origin,
  userDestination,
  matchDestination,
  routeCoordinates,
  matchRouteCoordinates,
  overlapPercentage,
  className = "h-[300px] w-full",
  isPinDropMode = false,
  pinDropTarget = "destination",
  onCenterChange,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const onCenterChangeRef = useRef(onCenterChange);

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [origin.lat, origin.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Add small zoom control to bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers & polylines
    layerGroup.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [];

    // Origin Icon (Teal Brand Pin)
    const originIcon = L.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="background-color: #0D9488; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4); border: 2.5px solid white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon });
    originMarker.bindPopup(
      `<div class="text-xs font-semibold text-slate-800">
        <span class="inline-block px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded font-bold uppercase tracking-wider text-[10px]">Origin Transit Hub</span>
        <div class="mt-1 font-bold">${origin.label || "Transit Station"}</div>
      </div>`
    );
    layerGroup.addLayer(originMarker);
    boundsPoints.push([origin.lat, origin.lng]);

    // User Destination (Warm Coral Pin)
    if (userDestination) {
      const destIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="background-color: #F97316; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.45); border: 2.5px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const destMarker = L.marker([userDestination.lat, userDestination.lng], {
        icon: destIcon,
      });
      destMarker.bindPopup(
        `<div class="text-xs font-semibold text-slate-800">
          <span class="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded font-bold uppercase tracking-wider text-[10px]">Your Destination</span>
          <div class="mt-1 font-bold">${userDestination.label || "Home Drop"}</div>
        </div>`
      );
      layerGroup.addLayer(destMarker);
      boundsPoints.push([userDestination.lat, userDestination.lng]);
    }

    // Co-Rider Destination (Violet / Purple Pin)
    if (matchDestination) {
      const matchIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="background-color: #8B5CF6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); border: 2.5px solid white;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const matchMarker = L.marker([matchDestination.lat, matchDestination.lng], {
        icon: matchIcon,
      });
      matchMarker.bindPopup(
        `<div class="text-xs font-semibold text-slate-800">
          <span class="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold uppercase tracking-wider text-[10px]">Co-Rider Drop</span>
          <div class="mt-1 font-bold">${matchDestination.label || "Co-Rider Drop"}</div>
        </div>`
      );
      layerGroup.addLayer(matchMarker);
      boundsPoints.push([matchDestination.lat, matchDestination.lng]);
    }

    // Route Polyline (Teal shared corridor)
    if (routeCoordinates && routeCoordinates.length > 0) {
      const polyline = L.polyline(routeCoordinates, {
        color: "#0D9488",
        weight: 5,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      });
      layerGroup.addLayer(polyline);

      // Add route points to bounds
      routeCoordinates.forEach((pt) => boundsPoints.push(pt));
    }

    // Co-Rider Route Polyline (Dashed Violet)
    if (matchRouteCoordinates && matchRouteCoordinates.length > 0) {
      const matchPolyline = L.polyline(matchRouteCoordinates, {
        color: "#8B5CF6",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.8,
        lineCap: "round",
      });
      layerGroup.addLayer(matchPolyline);
      matchRouteCoordinates.forEach((pt) => boundsPoints.push(pt));
    }

    // Adjust map viewport to fit all points (unless pin drop mode is active)
    if (!isPinDropMode) {
      if (boundsPoints.length > 1) {
        map.fitBounds(L.latLngBounds(boundsPoints), {
          padding: [30, 30],
          maxZoom: 16,
        });
      } else {
        map.setView([origin.lat, origin.lng], 14);
      }
    }

    // Invalidate size on initial load to avoid half-rendered tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [
    origin,
    userDestination,
    matchDestination,
    routeCoordinates,
    matchRouteCoordinates,
    overlapPercentage,
    isPinDropMode,
  ]);

  // Handle Pin Drop Mode Movement Listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isPinDropMode) {
      // Pan to target when pin drop activates
      const targetCoords =
        pinDropTarget === "source"
          ? [origin.lat, origin.lng]
          : userDestination
          ? [userDestination.lat, userDestination.lng]
          : [origin.lat, origin.lng];

      map.setView(targetCoords as [number, number], 16, { animate: true });

      const handleMove = () => {
        const center = map.getCenter();
        onCenterChangeRef.current?.({ lat: center.lat, lng: center.lng });
      };

      map.on("move", handleMove);
      map.on("moveend", handleMove);

      // Report initial center
      const center = map.getCenter();
      onCenterChangeRef.current?.({ lat: center.lat, lng: center.lng });

      return () => {
        map.off("move", handleMove);
        map.off("moveend", handleMove);
      };
    }
  }, [isPinDropMode, pinDropTarget, origin.lat, origin.lng, userDestination]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-inner border transition-all ${
        isPinDropMode
          ? "border-orange-500 ring-2 ring-orange-400/40"
          : "border-slate-200"
      } ${className}`}
    >
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Normal mode overlap percentage badge */}
      {!isPinDropMode && overlapPercentage !== undefined && (
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-teal-200 flex items-center gap-1.5 text-xs font-bold text-teal-800">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>{overlapPercentage}% Overlap</span>
        </div>
      )}

      {/* Pin Drop Mode Overlay Elements */}
      {isPinDropMode && (
        <>
          {/* Top Instruction Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xl border border-orange-400/50 flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>Pan & zoom map to center your spot</span>
          </div>

          {/* Center Crosshair Fixed Pin (Rapido Style) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[500] pointer-events-none flex flex-col items-center select-none pb-0.5">
            {/* Target Label Bubble */}
            <div
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-lg mb-1 tracking-wide uppercase ${
                pinDropTarget === "source"
                  ? "bg-[#0D9488] ring-2 ring-teal-200"
                  : "bg-[#F97316] ring-2 ring-orange-200"
              }`}
            >
              {pinDropTarget === "source" ? "Pickup Spot" : "Drop Spot"}
            </div>

            {/* Custom SVG Pin Marker */}
            <div className="relative">
              <svg
                width="40"
                height="48"
                viewBox="0 0 24 28"
                fill="none"
                className={`drop-shadow-xl ${
                  pinDropTarget === "source"
                    ? "text-[#0D9488]"
                    : "text-[#F97316]"
                }`}
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 9 12 16 12 16s12-7 12-16c0-6.627-5.373-12-12-12z"
                  fill="currentColor"
                />
                <circle cx="12" cy="11" r="5" fill="white" />
                <circle
                  cx="12"
                  cy="11"
                  r="2.5"
                  fill={pinDropTarget === "source" ? "#0D9488" : "#F97316"}
                />
              </svg>
              {/* Ripple / Ground Dot */}
              <div className="w-3.5 h-1.5 bg-black/45 rounded-full mx-auto -mt-1 blur-[1px]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
