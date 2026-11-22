import { Coordinates, CoRiderMatch, TransitHub, CommuteDestination } from "../types";
import { interpolateWaypoints } from "./haversine";

export interface PanIndiaPreset {
  id: string;
  name: string;
  cityName: string;
  source: {
    title: string;
    subtitle: string;
    city: string;
    coordinates: Coordinates;
  };
  destination: {
    title: string;
    subtitle: string;
    city: string;
    coordinates: Coordinates;
  };
}

export const POPULAR_PAN_INDIA_PRESETS: PanIndiaPreset[] = [
  {
    id: "bhopal-pilot",
    name: "Rani Kamalapati ➔ Arera Colony",
    cityName: "Bhopal",
    source: {
      title: "Rani Kamalapati Railway Station (Gate 1)",
      subtitle: "Habibganj, Bhopal, Madhya Pradesh",
      city: "Bhopal",
      coordinates: { lat: 23.2185, lng: 77.4398 },
    },
    destination: {
      title: "Arera Colony (E-6 Sector)",
      subtitle: "Near 10 Number Market, Bhopal",
      city: "Bhopal",
      coordinates: { lat: 23.2098, lng: 77.4278 },
    },
  },
  {
    id: "delhi-nizamuddin",
    name: "Hazrat Nizamuddin ➔ Saket Metro",
    cityName: "Delhi NCR",
    source: {
      title: "Hazrat Nizamuddin Railway Station",
      subtitle: "Central, South East Delhi",
      city: "New Delhi",
      coordinates: { lat: 28.5883, lng: 77.2449 },
    },
    destination: {
      title: "Saket Metro Station (Select CITYWALK)",
      subtitle: "Saket, South Delhi",
      city: "New Delhi",
      coordinates: { lat: 28.5204, lng: 77.2014 },
    },
  },
  {
    id: "mumbai-bkc",
    name: "Bandra Station ➔ BKC G-Block",
    cityName: "Mumbai",
    source: {
      title: "Bandra Terminus Railway Station",
      subtitle: "Bandra East, Western Suburbs",
      city: "Mumbai",
      coordinates: { lat: 19.0622, lng: 77.8465 },
    },
    destination: {
      title: "Bandra Kurla Complex (BKC)",
      subtitle: "G Block, Corporate Hub, Mumbai",
      city: "Mumbai",
      coordinates: { lat: 19.0664, lng: 72.8687 },
    },
  },
  {
    id: "bengaluru-majestic",
    name: "KSR Majestic ➔ Indiranagar 100ft",
    cityName: "Bengaluru",
    source: {
      title: "KSR Bengaluru City Railway Station (Majestic)",
      subtitle: "Kempegowda Metro, Central Bengaluru",
      city: "Bengaluru",
      coordinates: { lat: 12.9784, lng: 77.5684 },
    },
    destination: {
      title: "Indiranagar (100 Feet Road)",
      subtitle: "Near CMH Road Metro, East Bengaluru",
      city: "Bengaluru",
      coordinates: { lat: 12.9719, lng: 77.6412 },
    },
  },
];

// Calculate dynamic Indian Auto-Rickshaw fare (Standard Meter Formula: Base ₹25 + ₹14/km)
export function calculatePanIndiaAutoFare(distanceKm: number): {
  soloFare: number;
  sharedFare: number;
  savings: number;
  distanceKm: number;
  travelTimeMins: number;
} {
  const cleanDist = Math.max(0.8, distanceKm);
  const baseMeter = 25; // covers first 1.5 km
  const perKmRate = 14;
  const rawSolo = baseMeter + Math.max(0, cleanDist - 1.5) * perKmRate;
  const soloFare = Math.max(30, Math.round(rawSolo / 5) * 5); // round to ₹5
  const sharedFare = Math.round((soloFare * 0.5) / 5) * 5;
  const savings = Math.max(0, soloFare - sharedFare);
  const travelTimeMins = Math.max(4, Math.round(cleanDist * 2.8));

  return {
    soloFare,
    sharedFare,
    savings,
    distanceKm: Number(cleanDist.toFixed(1)),
    travelTimeMins,
  };
}

// Generate realistic, context-aware co-riders for any chosen city & route across India
export function generateContextAwareMatches(
  source: { coordinates: Coordinates; name: string; city: string },
  destination: { coordinates: Coordinates; name: string; city: string },
  distanceKm: number,
  soloFare: number
): CoRiderMatch[] {
  const city = (source.city || destination.city || "Bhopal").toLowerCase();

  // City-specific institutions
  let org1 = "TCS Regional Hub";
  let org2 = "State Central University";
  let org3 = "AIIMS Healthcare Resident";

  if (city.includes("delhi") || city.includes("noida") || city.includes("gurgaon")) {
    org1 = "TCS Olympus / Cyber City Gurgaon";
    org2 = "Delhi University (North Campus)";
    org3 = "AIIMS New Delhi Resident Doctors";
  } else if (city.includes("bengaluru") || city.includes("bangalore")) {
    org1 = "Infosys Electronic City / Whitefield";
    org2 = "IISc Bangalore Research Scholar";
    org3 = "Manipal Hospital / Narayana Health";
  } else if (city.includes("mumbai") || city.includes("thane")) {
    org1 = "Morgan Stanley / BKC Financial";
    org2 = "St. Xavier's College Mumbai";
    org3 = "Lilavati Hospital Staff Nurse";
  } else if (city.includes("pune")) {
    org1 = "Infosys Hinjewadi Phase 1";
    org2 = "COEP Technological University";
    org3 = "Ruby Hall Clinic Healthcare Fellow";
  } else if (city.includes("hyderabad")) {
    org1 = "Google Hitec City / Microsoft Campus";
    org2 = "IIIT Hyderabad";
    org3 = "Apollo Hospitals Jubilee Hills";
  } else if (city.includes("kolkata")) {
    org1 = "Wipro Salt Lake Sector V";
    org2 = "Jadavpur University";
    org3 = "AMRI Hospitals Kolkata";
  } else if (city.includes("patna")) {
    org1 = "TCS Ion / Patliputra Hub";
    org2 = "Patna Science College";
    org3 = "AIIMS Patna Medical Resident";
  } else {
    org1 = `${source.city || "City"} IT & Tech Park`;
    org2 = `${source.city || "City"} Govt University`;
    org3 = "District Civil Hospital & Medical Staff";
  }

  // Intermediate route coordinates for co-rider drop pins
  const waypoints = interpolateWaypoints(source.coordinates, destination.coordinates, 6);
  const dropCoords1 = waypoints[4] || destination.coordinates;
  const dropCoords2 = waypoints[5] || destination.coordinates;
  const dropCoords3 = waypoints[3] || destination.coordinates;

  const fareCalc1 = calculatePanIndiaAutoFare(distanceKm * 0.88);
  const fareCalc2 = calculatePanIndiaAutoFare(distanceKm * 0.79);
  const fareCalc3 = calculatePanIndiaAutoFare(distanceKm * 0.84);

  return [
    {
      id: "corider-dyn-1",
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      verificationBadge: "Corporate Email",
      organization: org1,
      verifiedSince: "Nov 2025",
      completedRides: 42,
      safetyRating: 4.98,
      destinationName: `${destination.name} (Stop 1)`,
      destinationCoords: dropCoords1,
      overlapPercentage: 88,
      soloFare: soloFare,
      sharedFare: fareCalc1.sharedFare,
      savings: soloFare - fareCalc1.sharedFare,
      departureWindow: "Exiting Hub Gate in 3 mins",
      mutualTrustTags: ["Identity Verified", "Frequent Commuter", "Safe-Drop Enabled"],
      isSyntheticPilot: true,
    },
    {
      id: "corider-dyn-2",
      name: "Ananya Verma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      verificationBadge: "College ID",
      organization: org2,
      verifiedSince: "Aug 2025",
      completedRides: 28,
      safetyRating: 4.94,
      destinationName: `Near ${destination.name.split(" ")[0]} Main Rd`,
      destinationCoords: dropCoords2,
      overlapPercentage: 79,
      soloFare: soloFare,
      sharedFare: fareCalc2.sharedFare,
      savings: soloFare - fareCalc2.sharedFare,
      departureWindow: "At Stand Waiting Area",
      mutualTrustTags: ["Student ID Vetted", "Top Rated Rider"],
      isSyntheticPilot: true,
    },
    {
      id: "corider-dyn-3",
      name: "Dr. Sneha Patel",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      verificationBadge: "Govt / PSU ID",
      organization: org3,
      verifiedSince: "Jan 2026",
      completedRides: 56,
      safetyRating: 5.0,
      destinationName: `${destination.name.split(" ")[0]} Colony Gate`,
      destinationCoords: dropCoords3,
      overlapPercentage: 84,
      soloFare: soloFare,
      sharedFare: fareCalc3.sharedFare,
      savings: soloFare - fareCalc3.sharedFare,
      departureWindow: "2 mins from Stand",
      mutualTrustTags: ["Healthcare Professional", "Safe-Drop Handshake Pro"],
      isSyntheticPilot: true,
    },
  ];
}
