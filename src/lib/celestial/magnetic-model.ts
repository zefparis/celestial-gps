import type { MagneticFieldModel } from '@/types/celestial';

const IGRF_COEFFICIENTS = {
  g: [
    [0],
    [-29404.8, -1450.9],
    [-2499.6, 2982.0, 1677.0],
    [1363.2, -2381.2, 1236.2, 525.7],
    [903.0, 809.5, 86.3, -309.4, 48.0],
  ],
  h: [
    [0],
    [0, 4652.5],
    [0, -2991.6, -734.6],
    [0, -82.1, 241.9, -543.4],
    [0, 281.9, -158.4, 199.7, -349.7],
  ]
};

function toRadians(deg: number): number {
  return deg * Math.PI / 180;
}

function toDegrees(rad: number): number {
  return rad * 180 / Math.PI;
}

export function calculateMagneticField(
  latitude: number,
  longitude: number,
  altitudeKm: number = 0,
  _year: number = new Date().getFullYear()
): MagneticFieldModel {
  const phi = toRadians(latitude);
  const lambda = toRadians(longitude);
  
  const a = 6371.2;
  const r = a + altitudeKm;
  
  let X = 0, Y = 0, Z = 0;
  
  const nMax = Math.min(4, IGRF_COEFFICIENTS.g.length - 1);
  
  for (let n = 1; n <= nMax; n++) {
    const ratio = Math.pow(a / r, n + 2);
    
    for (let m = 0; m <= n; m++) {
      const g = IGRF_COEFFICIENTS.g[n]?.[m] || 0;
      const h = IGRF_COEFFICIENTS.h[n]?.[m] || 0;
      
      const P = associatedLegendre(n, m, Math.sin(phi));
      const dP = associatedLegendreDeriv(n, m, Math.sin(phi), Math.cos(phi));
      
      const cosmLambda = Math.cos(m * lambda);
      const sinmLambda = Math.sin(m * lambda);
      
      X += ratio * (g * cosmLambda + h * sinmLambda) * dP;
      Y += ratio * m * (g * sinmLambda - h * cosmLambda) * P / Math.cos(phi);
      Z -= ratio * (n + 1) * (g * cosmLambda + h * sinmLambda) * P;
    }
  }
  
  const H = Math.sqrt(X * X + Y * Y);
  const F = Math.sqrt(H * H + Z * Z);
  const D = toDegrees(Math.atan2(Y, X));
  const I = toDegrees(Math.atan2(Z, H));
  
  return {
    declination: D,
    inclination: I,
    horizontalIntensity: H,
    totalIntensity: F,
    northComponent: X,
    eastComponent: Y,
    verticalComponent: Z
  };
}

function associatedLegendre(n: number, m: number, x: number): number {
  if (n === 0 && m === 0) return 1;
  if (n === 1 && m === 0) return x;
  if (n === 1 && m === 1) return Math.sqrt(1 - x * x);
  
  if (m === n) {
    return (2 * n - 1) * Math.sqrt(1 - x * x) * associatedLegendre(n - 1, n - 1, x);
  }
  if (m === n - 1) {
    return x * (2 * n - 1) * associatedLegendre(n - 1, n - 1, x);
  }
  
  return ((2 * n - 1) * x * associatedLegendre(n - 1, m, x) - 
          (n + m - 1) * associatedLegendre(n - 2, m, x)) / (n - m);
}

function associatedLegendreDeriv(n: number, m: number, sinPhi: number, cosPhi: number): number {
  if (Math.abs(cosPhi) < 1e-10) {
    return 0;
  }
  
  const P_nm = associatedLegendre(n, m, sinPhi);
  const P_nm1 = m < n ? associatedLegendre(n, m + 1, sinPhi) : 0;
  
  return m * sinPhi / cosPhi * P_nm - P_nm1 / cosPhi;
}

export function getMagneticDeclination(
  latitude: number,
  longitude: number,
  altitudeKm: number = 0
): number {
  const field = calculateMagneticField(latitude, longitude, altitudeKm);
  return field.declination;
}

export function correctMagneticHeading(
  compassHeading: number,
  declination: number
): number {
  let trueHeading = compassHeading + declination;
  while (trueHeading < 0) trueHeading += 360;
  while (trueHeading >= 360) trueHeading -= 360;
  return trueHeading;
}
