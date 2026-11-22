import { Coordinates } from "../types";

/**
 * Computes Haversine distance in kilometers between two geographical coordinates
 */
export function haversineDistance(c1: Coordinates, c2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Linearly interpolates waypoints between start and end coordinates
 */
export function interpolateWaypoints(
  start: Coordinates,
  end: Coordinates,
  steps = 15
): Coordinates[] {
  const points: Coordinates[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add small realistic curvature so it looks like city road geometry
    const curveOffset = Math.sin(t * Math.PI) * 0.0018;
    points.push({
      lat: start.lat + (end.lat - start.lat) * t + curveOffset * 0.5,
      lng: start.lng + (end.lng - start.lng) * t - curveOffset,
    });
  }
  return points;
}

/**
 * Calculates geometric route overlap percentage between two destination trajectories
 * originating from the same transit hub.
 * 
 * Returns percentage (e.g. 78 for 78%)
 */
export function calculateRouteOverlap(
  hub: Coordinates,
  userDest: Coordinates,
  matchDest: Coordinates
): number {
  const userDist = haversineDistance(hub, userDest);
  const matchDist = haversineDistance(hub, matchDest);
  const destToDest = haversineDistance(userDest, matchDest);

  if (userDist === 0 || matchDist === 0) return 0;

  // Approximate common corridor via angular proximity & distance ratio
  // Cosine rule on the triangle formed by Hub, Dest1, Dest2
  const cosAngle =
    (userDist * userDist + matchDist * matchDist - destToDest * destToDest) /
    (2 * userDist * matchDist);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angleRad = Math.acos(clampedCos);

  // If diverging by less than ~25 degrees and moving in same directional corridor
  const angleDeg = (angleRad * 180) / Math.PI;

  let baseOverlap = 0;
  if (angleDeg < 45) {
    const sharedCorridorDist = Math.min(userDist, matchDist) * Math.cos(angleRad);
    const maxDist = Math.max(userDist, matchDist);
    baseOverlap = Math.min(95, Math.max(20, (sharedCorridorDist / maxDist) * 100));
  } else {
    // Large angle divergence means low overlap
    baseOverlap = Math.max(10, 50 - angleDeg);
  }

  return Math.round(baseOverlap);
}

/**
 * Calculates shared fare split based on base fare, total distance, and overlap
 */
export function calculateFareSplit(
  soloFare: number,
  overlapPercentage: number
): { sharedFare: number; savings: number } {
  // Shared route portion gets 50% discount; unshared portion paid proportionally
  const overlapRatio = Math.max(0, Math.min(1, overlapPercentage / 100));
  const sharedDiscountFactor = 0.5; // Split common leg 50/50
  const effectiveFare = soloFare * (1 - overlapRatio * sharedDiscountFactor);
  
  const roundedShared = Math.round(effectiveFare / 5) * 5; // Round to nearest ₹5
  const savings = Math.max(0, soloFare - roundedShared);

  return {
    sharedFare: roundedShared,
    savings,
  };
}
