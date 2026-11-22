export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TransitHub {
  id: string;
  name: string;
  shortName: string;
  city: string;
  coordinates: Coordinates;
  type: "railway" | "metro" | "bus";
  description: string;
  dailyFootfall: string;
  activeSaheliCount: number;
}

export interface CommuteDestination {
  id: string;
  name: string;
  hubId: string;
  coordinates: Coordinates;
  landmark: string;
  estimatedSoloFare: number;
  distanceKm: number;
}

export interface CoRiderMatch {
  id: string;
  name: string;
  avatar: string;
  verificationBadge: "College ID" | "Corporate Email" | "Govt / PSU ID";
  organization: string;
  verifiedSince: string;
  completedRides: number;
  safetyRating: number;
  destinationName: string;
  destinationCoords: Coordinates;
  overlapPercentage: number;
  soloFare: number;
  sharedFare: number;
  savings: number;
  departureWindow: string; // e.g. "Leaves in 4 mins"
  mutualTrustTags: string[];
  isSyntheticPilot: boolean;
}

export type SafetyVerdict = "safe" | "neutral" | "caution";

export interface AutoReview {
  id: string;
  plate: string; // e.g., "MP04-4821" or "MP-04-7732"
  maskedPlate: string; // e.g., "MP-04-XX-4821"
  driverName: string;
  hubStation: string;
  vehicleType?: "CNG Auto" | "Electric Rickshaw";
  verdict: SafetyVerdict;
  tags: string[];
  note: string;
  timestamp: string;
  commuterBadge?: string; // e.g., "Verified Woman Commuter"
}

export interface DriverTrustProfile {
  id: string;
  name: string;
  maskedPlate: string; // e.g., "MP-04-XX-4821" for privacy compliance
  rawPlateForVerification: string; // e.g., "MP04-4821"
  vehicleType: "CNG Auto" | "Electric Rickshaw";
  verifiedYear: number;
  totalWomenRides: number;
  rating: number;
  hubStation: string;
  badges: string[];
  photoUrl: string;
  isCommunityVouched: boolean;
  status: "available" | "on-ride" | "offline";
  qrBadgeId: string;
  verdict?: SafetyVerdict;
}

export interface SafeHaven {
  id: string;
  name: string;
  nameHi: string;
  category: "Police / RPF" | "Hospital / Clinic" | "Metro Security" | "24x7 Transit Stand";
  distanceMeters: number;
  locationDetails: string;
  locationDetailsHi: string;
  phone: string;
  is24x7WellLit: boolean;
  googleMapsQuery: string;
}

export interface PilotRideState {
  id: string;
  saheliPin: string; // 4-digit mutual boarding PIN (e.g. "4829")
  driver: DriverTrustProfile;
  mainRider: {
    name: string;
    organization: string;
    avatar: string;
    destinationName: string;
  };
  coRider: CoRiderMatch;
  originHub: TransitHub;
  stage: "shared-active" | "solo-guardian" | "home-safe";
  handoverTimestamp: string;
  routeProgressPercent: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  shareablePath: string;
}

export type AppTab = "find-match" | "auto-trust" | "active-ride" | "profile";
