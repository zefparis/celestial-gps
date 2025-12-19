import * as Astronomy from 'astronomy-engine';
import type { SunPosition, CelestialPosition } from '@/types/celestial';

export function calculateSunPosition(
  latitude: number,
  longitude: number,
  altitude: number,
  date: Date = new Date()
): SunPosition {
  const observer = new Astronomy.Observer(latitude, longitude, altitude);
  
  const sunEquatorial = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);
  const sunHorizontal = Astronomy.Horizon(date, observer, sunEquatorial.ra, sunEquatorial.dec, 'normal');
  
  const isDaytime = sunHorizontal.altitude > 0;
  
  const sunriseSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, date, 1);
  const sunsetSearch = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, 1);
  const transitSearch = Astronomy.SearchHourAngle(Astronomy.Body.Sun, observer, 0, date, +1);
  
  const sunrise = sunriseSearch ? sunriseSearch.date : new Date(date);
  const sunset = sunsetSearch ? sunsetSearch.date : new Date(date);
  const solarNoon = transitSearch ? transitSearch.time.date : new Date(date);

  return {
    azimuth: sunHorizontal.azimuth,
    elevation: sunHorizontal.altitude,
    distance: sunEquatorial.dist,
    isDaytime,
    sunrise,
    sunset,
    solarNoon
  };
}

export function calculateExpectedSunPosition(
  latitude: number,
  longitude: number,
  altitude: number,
  date: Date = new Date()
): CelestialPosition {
  const sun = calculateSunPosition(latitude, longitude, altitude, date);
  return {
    azimuth: sun.azimuth,
    elevation: sun.elevation,
    distance: sun.distance
  };
}

export function calculateSunDelta(
  observed: CelestialPosition,
  expected: CelestialPosition
): { azimuth: number; elevation: number } {
  let azimuthDiff = observed.azimuth - expected.azimuth;
  if (azimuthDiff > 180) azimuthDiff -= 360;
  if (azimuthDiff < -180) azimuthDiff += 360;
  
  return {
    azimuth: azimuthDiff,
    elevation: observed.elevation - expected.elevation
  };
}

export function applyAtmosphericRefraction(
  apparentElevation: number,
  pressure: number = 1013.25,
  temperature: number = 15
): number {
  if (apparentElevation < -1) return apparentElevation;
  
  const P = pressure / 1013.25;
  const T = 283 / (273 + temperature);
  
  let R: number;
  if (apparentElevation > 15) {
    R = (0.00452 * P * T) / Math.tan(apparentElevation * Math.PI / 180);
  } else if (apparentElevation > -0.575) {
    const h = apparentElevation;
    R = P * T * (1.02 / Math.tan((h + 10.3 / (h + 5.11)) * Math.PI / 180)) / 60;
  } else {
    R = P * T * (-20.774 / Math.tan(apparentElevation * Math.PI / 180)) / 3600;
  }
  
  return apparentElevation + R;
}

export function getSunPhase(elevation: number): 'day' | 'civil_twilight' | 'nautical_twilight' | 'astronomical_twilight' | 'night' {
  if (elevation > 0) return 'day';
  if (elevation > -6) return 'civil_twilight';
  if (elevation > -12) return 'nautical_twilight';
  if (elevation > -18) return 'astronomical_twilight';
  return 'night';
}
