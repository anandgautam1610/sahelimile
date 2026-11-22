import { AutoReview, DriverTrustProfile, SafetyVerdict } from "./types";
import { PILOT_DRIVERS } from "./data/pilotData";

const LEDGER_STORAGE_KEY = "sahelimile_community_ledger";

export const INITIAL_COMMUNITY_REVIEWS: AutoReview[] = [
  {
    id: "rev-1",
    plate: "MP04-4821",
    maskedPlate: "MP-04-XX-4821",
    driverName: "Ramesh Kumar Sahu",
    hubStation: "Rani Kamalapati Railway Station Stand",
    vehicleType: "CNG Auto",
    verdict: "safe",
    tags: ["Polite & Respectful", "Fair Fare / No Haggling", "Followed Safe Route"],
    note: "Very safe commute from RKMP Station at 10 PM. Checked destination twice and took well-lit main road.",
    timestamp: "18 mins ago",
    commuterBadge: "Verified Student Commuter",
  },
  {
    id: "rev-2",
    plate: "MP04-9104",
    maskedPlate: "MP-04-XX-9104",
    driverName: "Mohammad Rafiq",
    hubStation: "MP Nagar Zone 1 Stand",
    vehicleType: "Electric Rickshaw",
    verdict: "safe",
    tags: ["Polite & Respectful", "Well-Maintained Auto", "Fair Fare / No Haggling"],
    note: "Smooth EV auto ride to MP Nagar Zone 2. Courteous behavior, zero haggling.",
    timestamp: "1 hour ago",
    commuterBadge: "Corporate Verified",
  },
  {
    id: "rev-3",
    plate: "MP04-1052",
    maskedPlate: "MP-04-XX-1052",
    driverName: "Sunita Bai",
    hubStation: "Habibganj West Gate Stand",
    vehicleType: "Electric Rickshaw",
    verdict: "safe",
    tags: ["Followed Safe Route", "Polite & Respectful", "Well-Maintained Auto"],
    note: "Felt 100% comfortable riding with Sunita didi late night. Highly recommend to all female commuters!",
    timestamp: "3 hours ago",
    commuterBadge: "Healthcare Worker",
  },
  {
    id: "rev-4",
    plate: "MP04-7732",
    maskedPlate: "MP-04-XX-7732",
    driverName: "Kailash Meena",
    hubStation: "Rani Kamalapati Railway Station Stand",
    vehicleType: "CNG Auto",
    verdict: "neutral",
    tags: ["Followed Safe Route"],
    note: "Normal ride from Habibganj, took standard fare after asking. Vehicle clean.",
    timestamp: "Yesterday",
    commuterBadge: "Daily Commuter",
  },
  {
    id: "rev-5",
    plate: "MP04-8291",
    maskedPlate: "MP-04-XX-8291",
    driverName: "Santosh Yadav",
    hubStation: "AIIMS Metro Station Stand",
    vehicleType: "CNG Auto",
    verdict: "safe",
    tags: ["Polite & Respectful", "Followed Safe Route", "Night Safe"],
    note: "Punctual pickup from AIIMS Metro stand. Respectful uncle and kept speed moderate.",
    timestamp: "2 days ago",
    commuterBadge: "Doctor / AIIMS Staff",
  },
];

// Helper to normalize any plate for comparison
export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Format any raw string into privacy-masked plate: MP-04-XX-4821
export function formatPlateMasked(plate: string): string {
  const norm = normalizePlate(plate);
  if (norm.length >= 8) {
    const state = norm.slice(0, 2);
    const rto = norm.slice(2, 4);
    const last4 = norm.slice(-4);
    return `${state}-${rto}-XX-${last4}`;
  } else if (norm.length >= 4) {
    const last4 = norm.slice(-4);
    return `MP-04-XX-${last4}`;
  }
  return plate.toUpperCase();
}

// Format any raw plate into user-friendly format: MP04-4821
export function formatPlateRaw(plate: string): string {
  const norm = normalizePlate(plate);
  if (norm.length >= 8) {
    const stateRto = norm.slice(0, 4);
    const last4 = norm.slice(-4);
    return `${stateRto}-${last4}`;
  } else if (norm.length >= 4) {
    return `MP04-${norm.slice(-4)}`;
  }
  return plate.toUpperCase();
}

export interface StoredLedgerState {
  drivers: DriverTrustProfile[];
  reviews: AutoReview[];
}

// Retrieve ledger from localStorage with fallback to default pilot drivers and initial reviews
export function getStoredLedger(): StoredLedgerState {
  if (typeof window === "undefined") {
    return {
      drivers: PILOT_DRIVERS,
      reviews: INITIAL_COMMUNITY_REVIEWS,
    };
  }

  try {
    const stored = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (!stored) {
      return {
        drivers: PILOT_DRIVERS,
        reviews: INITIAL_COMMUNITY_REVIEWS,
      };
    }
    const parsed = JSON.parse(stored) as StoredLedgerState;
    if (parsed && Array.isArray(parsed.drivers) && Array.isArray(parsed.reviews)) {
      // Ensure all initial pilot drivers exist in the merged list
      const driverMap = new Map<string, DriverTrustProfile>();
      PILOT_DRIVERS.forEach((d) => driverMap.set(normalizePlate(d.rawPlateForVerification), d));
      parsed.drivers.forEach((d) => driverMap.set(normalizePlate(d.rawPlateForVerification), d));

      return {
        drivers: Array.from(driverMap.values()),
        reviews: parsed.reviews,
      };
    }
  } catch (err) {
    console.error("Failed to read community auto ledger from localStorage", err);
  }

  return {
    drivers: PILOT_DRIVERS,
    reviews: INITIAL_COMMUNITY_REVIEWS,
  };
}

// Persist ledger state
export function saveLedgerToStorage(state: StoredLedgerState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save community auto ledger to localStorage", err);
  }
}

// Search for an auto in the community ledger
export function findDriverInLedger(
  query: string,
  drivers: DriverTrustProfile[]
): DriverTrustProfile | null {
  const normQuery = normalizePlate(query);
  if (!normQuery) return null;

  return (
    drivers.find((d) => {
      const normRaw = normalizePlate(d.rawPlateForVerification);
      const normMasked = normalizePlate(d.maskedPlate);
      const nameMatch = d.name.toLowerCase().includes(query.toLowerCase().trim());
      return (
        normRaw.includes(normQuery) ||
        normMasked.includes(normQuery) ||
        normQuery.includes(normRaw) ||
        nameMatch
      );
    }) || null
  );
}

// Log a new auto review and update the driver record
export function logAutoReview(input: {
  plate: string;
  driverName?: string;
  hubStation?: string;
  vehicleType?: "CNG Auto" | "Electric Rickshaw";
  verdict: SafetyVerdict;
  tags: string[];
  note: string;
  commuterBadge?: string;
}): { review: AutoReview; updatedDriver: DriverTrustProfile; updatedLedger: StoredLedgerState } {
  const current = getStoredLedger();
  const rawPlate = formatPlateRaw(input.plate);
  const maskedPlate = formatPlateMasked(input.plate);
  const normTarget = normalizePlate(input.plate);

  const existingIndex = current.drivers.findIndex(
    (d) => normalizePlate(d.rawPlateForVerification) === normTarget
  );

  let targetDriver: DriverTrustProfile;

  if (existingIndex >= 0) {
    const existing = current.drivers[existingIndex];
    const newCount =
      input.verdict === "safe"
        ? existing.totalWomenRides + 1
        : existing.totalWomenRides;
    const combinedBadges = Array.from(new Set([...existing.badges, ...input.tags]));
    
    // Adjust rating slightly
    let newRating = existing.rating;
    if (input.verdict === "safe") {
      newRating = Math.min(5.0, Number((newRating * 0.9 + 5.0 * 0.1).toFixed(2)));
    } else if (input.verdict === "caution") {
      newRating = Math.max(2.5, Number((newRating * 0.85 + 2.0 * 0.15).toFixed(2)));
    }

    targetDriver = {
      ...existing,
      totalWomenRides: newCount,
      rating: newRating,
      badges: combinedBadges,
      verdict: input.verdict,
      isCommunityVouched: input.verdict === "safe" ? true : existing.isCommunityVouched,
    };

    current.drivers[existingIndex] = targetDriver;
  } else {
    // New auto registered directly by community commuter!
    const last4 = normTarget.slice(-4) || "AUTO";
    const driverName = input.driverName?.trim() || `Auto Driver (${maskedPlate})`;
    targetDriver = {
      id: `drv-${normTarget.toLowerCase()}`,
      name: driverName,
      maskedPlate: maskedPlate,
      rawPlateForVerification: rawPlate,
      vehicleType: input.vehicleType || "CNG Auto",
      verifiedYear: 2026,
      totalWomenRides: input.verdict === "safe" ? 1 : 0,
      rating: input.verdict === "safe" ? 5.0 : input.verdict === "neutral" ? 4.0 : 3.0,
      hubStation: input.hubStation || "Rani Kamalapati Railway Station Stand",
      badges: Array.from(new Set(["Community Logged", ...input.tags])),
      photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
      isCommunityVouched: input.verdict === "safe",
      status: "available",
      qrBadgeId: `LEDGER-${last4}`,
      verdict: input.verdict,
    };
    current.drivers.unshift(targetDriver);
  }

  const newReview: AutoReview = {
    id: `rev-${Date.now()}`,
    plate: rawPlate,
    maskedPlate: maskedPlate,
    driverName: targetDriver.name,
    hubStation: targetDriver.hubStation,
    vehicleType: targetDriver.vehicleType,
    verdict: input.verdict,
    tags: input.tags.length > 0 ? input.tags : ["Community Verified"],
    note: input.note.trim() || (input.verdict === "safe" ? "Punctual, safe route followed." : "Ride logged into community ledger."),
    timestamp: "Just now",
    commuterBadge: input.commuterBadge || "Verified Woman Commuter",
  };

  current.reviews.unshift(newReview);
  saveLedgerToStorage(current);

  return {
    review: newReview,
    updatedDriver: targetDriver,
    updatedLedger: current,
  };
}

// Toggle vouch (+1 / -1) for an auto
export function toggleDriverVouchInStorage(
  plate: string,
  increment: boolean
): { updatedDriver: DriverTrustProfile | null; updatedCount: number } {
  const current = getStoredLedger();
  const normTarget = normalizePlate(plate);
  const idx = current.drivers.findIndex(
    (d) => normalizePlate(d.rawPlateForVerification) === normTarget
  );

  if (idx < 0) return { updatedDriver: null, updatedCount: 0 };

  const driver = current.drivers[idx];
  const updatedCount = Math.max(0, driver.totalWomenRides + (increment ? 1 : -1));
  const updatedDriver: DriverTrustProfile = {
    ...driver,
    totalWomenRides: updatedCount,
    isCommunityVouched: true,
  };

  current.drivers[idx] = updatedDriver;
  saveLedgerToStorage(current);

  return { updatedDriver, updatedCount };
}
