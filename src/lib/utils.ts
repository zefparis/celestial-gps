import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoordinate(value: number, isLatitude: boolean): string {
  const direction = isLatitude
    ? value >= 0 ? 'N' : 'S'
    : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(6)}°${direction}`;
}

export function formatAltitude(meters: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    const feet = meters * 3.28084;
    return `${feet.toFixed(0)} ft`;
  }
  return `${meters.toFixed(0)} m`;
}

export function formatDegrees(degrees: number): string {
  return `${degrees.toFixed(1)}°`;
}

export function formatPressure(hPa: number): string {
  return `${hPa.toFixed(1)} hPa`;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(2)} km`;
}

export function getIntegrityColor(score: number): string {
  if (score >= 95) return 'var(--integrity-100)';
  if (score >= 85) return 'var(--integrity-85)';
  if (score >= 70) return 'var(--integrity-70)';
  if (score >= 50) return 'var(--integrity-50)';
  return 'var(--integrity-30)';
}

export function getStatusFromScore(score: number): 'NOMINAL' | 'DRIFT' | 'SPOOFING' {
  if (score >= 85) return 'NOMINAL';
  if (score >= 60) return 'DRIFT';
  return 'SPOOFING';
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

export function angleDifference(a: number, b: number): number {
  let diff = ((a - b + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
