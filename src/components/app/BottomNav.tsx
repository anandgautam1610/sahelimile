"use client";

import React from "react";
import { AppTab } from "@/lib/types";
import { Compass, ShieldCheck, Car, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  activeRideBadge?: boolean;
}

export default function BottomNav({
  activeTab,
  onSelectTab,
  activeRideBadge,
}: BottomNavProps) {
  const { t } = useLanguage();

  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "find-match",
      label: t("navFindMatch"),
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: "auto-trust",
      label: t("navAutoTrust"),
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: "active-ride",
      label: t("navActiveRide"),
      icon: (
        <div className="relative">
          <Car className="w-5 h-5" />
          {activeRideBadge && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          )}
        </div>
      ),
    },
    {
      id: "profile",
      label: t("navProfile"),
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-2">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? "text-[#0D9488] font-bold"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-teal-50 text-[#0D9488]" : ""
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
