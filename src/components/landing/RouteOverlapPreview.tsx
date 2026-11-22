"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, IndianRupee, MapPin, Zap } from "lucide-react";

interface RouteOption {
  destName: string;
  distance: string;
  overlap: number;
  soloFare: number;
  sharedFare: number;
  coRider: {
    name: string;
    role: string;
    verified: string;
  };
}

const ROUTE_PREVIEWS: RouteOption[] = [
  {
    destName: "Arera Colony (E-6)",
    distance: "3.4 km",
    overlap: 88,
    soloFare: 90,
    sharedFare: 45,
    coRider: {
      name: "Priya Sharma",
      role: "Software Consultant (TCS)",
      verified: "Corporate Email",
    },
  },
  {
    destName: "Shahpura Lake / Sector C",
    distance: "2.9 km",
    overlap: 74,
    soloFare: 85,
    sharedFare: 45,
    coRider: {
      name: "Ananya Verma",
      role: "Student (MANIT Bhopal)",
      verified: "College ID",
    },
  },
  {
    destName: "Gulmohar / Trilanga",
    distance: "4.8 km",
    overlap: 66,
    soloFare: 110,
    sharedFare: 60,
    coRider: {
      name: "Dr. Sneha Patel",
      role: "Doctor (AIIMS Bhopal)",
      verified: "Govt / Hospital ID",
    },
  },
];

export default function RouteOverlapPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeRoute = ROUTE_PREVIEWS[selectedIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-teal-100 relative overflow-hidden transition-all duration-300">
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-600/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Live Route-Overlap Engine
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                OSRM + Haversine
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Origin: Rani Kamalapati Railway Station (Habibganj)
            </p>
          </div>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs">
        {ROUTE_PREVIEWS.map((route, idx) => (
          <button
            key={route.destName}
            onClick={() => setSelectedIndex(idx)}
            className={`px-3 py-2 rounded-xl font-medium transition-all text-left whitespace-nowrap flex-shrink-0 cursor-pointer ${
              selectedIndex === idx
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-500/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            <div className="font-semibold">{route.destName}</div>
            <div
              className={`text-[10px] ${
                selectedIndex === idx ? "text-teal-100" : "text-slate-400"
              }`}
            >
              {route.distance} • {route.overlap}% Overlap
            </div>
          </button>
        ))}
      </div>

      {/* Visual Corridor Representation */}
      <div className="mt-5 bg-gradient-to-br from-amber-50/70 to-teal-50/40 rounded-2xl p-4 border border-teal-100/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Shared Corridor Geometry</span>
          </div>
          <span className="font-extrabold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
            {activeRoute.overlap}% Overlapping Distance
          </span>
        </div>

        {/* Progress bar visual for common corridor */}
        <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-l-full relative transition-all duration-500"
            style={{ width: `${activeRoute.overlap}%` }}
          >
            <span className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <div
            className="h-full bg-orange-400 rounded-r-full transition-all duration-500"
            style={{ width: `${100 - activeRoute.overlap}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] mt-2 font-medium">
          <span className="text-teal-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
            Shared Leg ({activeRoute.overlap}%)
          </span>
          <span className="text-orange-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            Final Solo Leg ({100 - activeRoute.overlap}%)
          </span>
        </div>
      </div>

      {/* Matched Co-Rider Snapshot */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-orange-400 p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full rounded-full bg-teal-50 flex items-center justify-center font-bold text-teal-800 text-xs">
              {activeRoute.coRider.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">
                {activeRoute.coRider.name}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                <ShieldCheck className="w-2.5 h-2.5" />
                {activeRoute.coRider.verified}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeRoute.coRider.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Users className="w-4 h-4 text-teal-600" />
        </div>
      </div>

      {/* Fare Split Comparison */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Solo Auto Fare
          </span>
          <div className="mt-1 flex items-baseline gap-0.5 text-slate-500 line-through font-bold text-lg">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{activeRoute.soloFare}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Standard metered</span>
        </div>

        <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200">
          <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
            SaheliMile Shared
          </span>
          <div className="mt-1 flex items-baseline gap-0.5 text-orange-600 font-extrabold text-2xl">
            <IndianRupee className="w-4 h-4" />
            <span>{activeRoute.sharedFare}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700">
            Save ₹{activeRoute.soloFare - activeRoute.sharedFare} (50% Off)
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href="/app"
        className="mt-5 w-full flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0f766e] text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 transition-all group"
      >
        <span>Test Route Matching on Web App</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
