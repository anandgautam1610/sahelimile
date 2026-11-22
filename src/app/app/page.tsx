"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppTab, CoRiderMatch, TransitHub, CommuteDestination, DriverTrustProfile } from "@/lib/types";
import { PILOT_TRANSIT_HUBS, PILOT_DESTINATIONS, PILOT_MATCHED_RIDERS, PILOT_DRIVERS } from "@/lib/data/pilotData";
import TopBar from "@/components/app/TopBar";
import BottomNav from "@/components/app/BottomNav";
import FindMatchTab from "@/components/app/FindMatchTab";
import AutoTrustTab from "@/components/app/AutoTrustTab";
import ActiveRideTab from "@/components/app/ActiveRideTab";
import ProfileTab from "@/components/app/ProfileTab";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

function MobileAppShell() {
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo");
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<AppTab>("find-match");
  const [isPilotMode, setIsPilotMode] = useState<boolean>(true);
  const [currentMatch, setCurrentMatch] = useState<CoRiderMatch | null>(
    PILOT_MATCHED_RIDERS[0]
  );
  const [currentHub, setCurrentHub] = useState<TransitHub>(PILOT_TRANSIT_HUBS[0]);
  const [currentDest, setCurrentDest] = useState<CommuteDestination>(
    PILOT_DESTINATIONS[0]
  );
  const [currentDriver, setCurrentDriver] = useState<DriverTrustProfile>(
    PILOT_DRIVERS[0]
  );
  const [hasActiveRide, setHasActiveRide] = useState<boolean>(false);

  // Auto trigger instant demo if query param present
  useEffect(() => {
    if (demoParam === "true") {
      setCurrentHub(PILOT_TRANSIT_HUBS[0]);
      setCurrentDest(PILOT_DESTINATIONS[0]);
      setCurrentMatch(PILOT_MATCHED_RIDERS[0]);
      setCurrentDriver(PILOT_DRIVERS[0]);
    }
  }, [demoParam]);

  const handleStartRide = (
    match: CoRiderMatch,
    hub: TransitHub,
    dest: CommuteDestination
  ) => {
    setCurrentMatch(match);
    setCurrentHub(hub);
    setCurrentDest(dest);
    setHasActiveRide(true);
    setActiveTab("active-ride");
  };

  const handleSelectAuto = (driver: DriverTrustProfile) => {
    setCurrentDriver(driver);
    setHasActiveRide(true);
    setActiveTab("active-ride");
  };

  const handleResetDemo = () => {
    setCurrentHub(PILOT_TRANSIT_HUBS[0]);
    setCurrentDest(PILOT_DESTINATIONS[0]);
    setCurrentMatch(PILOT_MATCHED_RIDERS[0]);
    setCurrentDriver(PILOT_DRIVERS[0]);
    setHasActiveRide(false);
    setActiveTab("find-match");
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex justify-center selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
      {/* Centered Mobile-Frame PWA Shell */}
      <div className="w-full max-w-md min-h-screen bg-[#FFFBEB] shadow-2xl border-x border-slate-200/80 flex flex-col relative pb-20">
        {/* Top App Bar with Pilot Banner */}
        <TopBar
          activeHubName={currentHub.shortName || currentHub.name}
          activeCity={currentHub.city || "India"}
          isPilotMode={isPilotMode}
          onTogglePilot={() => setIsPilotMode((prev) => !prev)}
        />

        {/* Tab Content Panes */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "find-match" && (
            <FindMatchTab
              onStartRide={handleStartRide}
              triggerInstantDemo={demoParam === "true"}
            />
          )}

          {activeTab === "auto-trust" && (
            <AutoTrustTab onSelectAutoForRide={handleSelectAuto} />
          )}

          {activeTab === "active-ride" && (
            <ActiveRideTab
              currentMatch={currentMatch}
              currentHub={currentHub}
              currentDest={currentDest}
              currentDriver={currentDriver}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab onResetDemo={handleResetDemo} />
          )}
        </main>

        {/* Subtle Footer Note */}
        <div className="px-4 py-2 text-center text-[10px] text-slate-500 font-medium border-t border-amber-200/40 bg-white/40">
          {t("pilotDisclosure")}
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeRideBadge={hasActiveRide}
        />
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <LanguageProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
          </div>
        }
      >
        <MobileAppShell />
      </Suspense>
    </LanguageProvider>
  );
}
