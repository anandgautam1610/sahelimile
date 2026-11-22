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
}

export default function LeafletInnerMap({
  origin,
  userDestination,
  matchDestination,
  routeCoordinates,
  matchRouteCoordinates,
  overlapPercentage,
  className = "h-[300px] w-full",
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

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

    // Adjust map viewport to fit all points
    if (boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [30, 30],
        maxZoom: 16,
      });
    } else {
      map.setView([origin.lat, origin.lng], 14);
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
  ]);

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
    <div className={`relative overflow-hidden rounded-2xl shadow-inner border border-slate-200 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {overlapPercentage !== undefined && (
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-teal-200 flex items-center gap-1.5 text-xs font-bold text-teal-800">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>{overlapPercentage}% Overlap</span>
        </div>
      )}
    </div>
  );
}
