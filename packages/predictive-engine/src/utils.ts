import { Location } from './types';

/**
 * Extract time features from ISO date string 
 */
export function getLocalTimeFeatures(isoDateString: string): number[] {
  const date = new Date(isoDateString);
  
  // Extract time components
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const dayOfMonth = date.getDate();
  const month = date.getMonth(); // 0 = January, 11 = December
  
  // Normalize time features
  const normalizedHour = hour / 24; 
  const normalizedMinute = minute / 60;
  const normalizedDayOfWeek = dayOfWeek / 6;
  const normalizedDayOfMonth = (dayOfMonth - 1) / 30; // Approximate normalization
  const normalizedMonth = month / 11;
  
  // Create cyclic features for time (to handle the circular nature of time)
  const hourSin = Math.sin(2 * Math.PI * hour / 24);
  const hourCos = Math.cos(2 * Math.PI * hour / 24);
  const dayOfWeekSin = Math.sin(2 * Math.PI * dayOfWeek / 7);
  const dayOfWeekCos = Math.cos(2 * Math.PI * dayOfWeek / 7);
  const monthSin = Math.sin(2 * Math.PI * month / 12);
  const monthCos = Math.cos(2 * Math.PI * month / 12);
  
  // Return array of time features
  return [
    normalizedHour,
    normalizedMinute,
    normalizedDayOfWeek,
    normalizedDayOfMonth,
    normalizedMonth,
    hourSin,
    hourCos,
    dayOfWeekSin,
    dayOfWeekCos,
    monthSin,
    monthCos
  ];
}

/**
 * Calculate distance between two geographic points in kilometers
 */
export function getDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = degToRad(point2.lat - point1.lat);
  const dLng = degToRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degToRad(point1.lat)) * Math.cos(degToRad(point2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get distance to all events and return sorted array
 */
export function getDistanceToEvents(
  location: Location, 
  events: Array<{ location: Location; attendees: number; name: string }>
): Array<{ name: string; attendees: number; distance: number }> {
  return events
    .map(event => ({
      name: event.name,
      attendees: event.attendees,
      distance: getDistance(location, event.location)
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Calculate exponential decay based on distance
 * Used for influence modeling where closer points have higher influence
 */
export function calculateDecay(distance: number, decayFactor: number = 0.1): number {
  return Math.exp(-decayFactor * distance);
}

/**
 * Normalize a value to be between 0 and 1
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Predict user's willingness to pay based on user data and current conditions
 */
export function predictWillingnessToPay(
  userType: 'new' | 'returning' | 'premium',
  demandLevel: number, // 0-100
  timeUrgency: number, // 0-1
  alternativeOptions: number // number of alternative options available
): number {
  // Base multiplier based on user type
  let baseMultiplier = 1.0;
  switch (userType) {
    case 'premium': baseMultiplier = 1.3; break;
    case 'returning': baseMultiplier = 1.0; break;
    case 'new': baseMultiplier = 0.9; break;
  }
  
  // Demand factor (higher demand = higher willingness)
  const demandFactor = 1 + (demandLevel / 100) * 0.5;
  
  // Urgency factor (more urgent = higher willingness)
  const urgencyFactor = 1 + timeUrgency * 0.4;
  
  // Alternatives factor (fewer alternatives = higher willingness)
  const alternativesFactor = 1 + Math.max(0, (1 - (alternativeOptions / 10))) * 0.3;
  
  // Calculate willingness multiplier
  return baseMultiplier * demandFactor * urgencyFactor * alternativesFactor;
}

/**
 * Calculate trip cost estimation based on distance, time and vehicle type
 */
export function calculateTripCost(
  distance: number, // in kilometers
  duration: number, // in minutes
  vehicleType: string,
  basePrices: Record<string, { perKm: number; perMinute: number }> = {
    'economy': { perKm: 0.5, perMinute: 0.2 },
    'standard': { perKm: 0.7, perMinute: 0.25 },
    'premium': { perKm: 1.0, perMinute: 0.4 },
    'suv': { perKm: 0.9, perMinute: 0.3 },
    'electric': { perKm: 0.6, perMinute: 0.22 }
  }
): { total: number; breakdown: { distance: number; time: number; base: number } } {
  // Get rates for the vehicle type, default to standard if not found
  const rates = basePrices[vehicleType.toLowerCase()] || basePrices['standard'];
  
  // Calculate cost components
  const distanceCost = distance * rates.perKm;
  const timeCost = duration * rates.perMinute;
  const baseCost = 2.5; // Base fare
  
  // Calculate total
  const total = baseCost + distanceCost + timeCost;
  
  return {
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    breakdown: {
      distance: Math.round(distanceCost * 100) / 100,
      time: Math.round(timeCost * 100) / 100,
      base: baseCost
    }
  };
}