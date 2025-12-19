import type { ConsensusInput, ConsensusOutput, ValidationConfig } from '@/types/validation';
import type { ValidationStatus } from '@/types/sensors';
import { angleDifference } from '@/lib/utils';

export function calculateConsensus(input: ConsensusInput): ConsensusOutput {
  const contributions: Record<string, number> = {};
  const outliers: string[] = [];
  let totalWeight = 0;
  let weightedScore = 0;

  if (input.sunObserved && input.sunExpected) {
    const azDiff = Math.abs(angleDifference(input.sunObserved.azimuth, input.sunExpected.azimuth));
    const elDiff = Math.abs(input.sunObserved.elevation - input.sunExpected.elevation);
    
    const azScore = Math.max(0, 100 - azDiff * 2);
    const elScore = Math.max(0, 100 - elDiff * 3);
    const sunScore = (azScore + elScore) / 2;
    
    contributions['sun'] = sunScore;
    
    if (sunScore < 30) {
      outliers.push('sun');
    } else {
      weightedScore += sunScore * input.weights.sun;
      totalWeight += input.weights.sun;
    }
  }

  const magDiff = Math.abs(angleDifference(input.magneticObserved, input.magneticExpected));
  const magScore = Math.max(0, 100 - magDiff * 2);
  contributions['magnetometer'] = magScore;
  
  if (magScore < 30) {
    outliers.push('magnetometer');
  } else {
    weightedScore += magScore * input.weights.magnetometer;
    totalWeight += input.weights.magnetometer;
  }

  if (input.barometerAlt !== null) {
    const altDiff = Math.abs(input.gpsPosition.alt - input.barometerAlt);
    const baroScore = Math.max(0, 100 - altDiff);
    contributions['barometer'] = baroScore;
    
    if (baroScore < 30) {
      outliers.push('barometer');
    } else {
      weightedScore += baroScore * input.weights.barometer;
      totalWeight += input.weights.barometer;
    }
  }

  contributions['gps'] = 85;
  weightedScore += 85 * input.weights.gps;
  totalWeight += input.weights.gps;

  const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

  let status: ValidationStatus;
  if (finalScore >= 85) {
    status = 'NOMINAL';
  } else if (finalScore >= 60) {
    status = 'DRIFT';
  } else if (finalScore >= 40) {
    status = 'UNCERTAIN';
  } else {
    status = 'SPOOFING';
  }

  if (outliers.length >= 2) {
    status = 'SPOOFING';
  }

  return {
    score: Math.round(finalScore * 10) / 10,
    status,
    contributions,
    outliers
  };
}

export function detectAnomalies(
  history: Array<{ score: number; timestamp: number }>,
  currentScore: number,
  windowSize: number = 10
): { isAnomaly: boolean; zscore: number } {
  if (history.length < windowSize) {
    return { isAnomaly: false, zscore: 0 };
  }

  const recentScores = history.slice(0, windowSize).map(h => h.score);
  const mean = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const variance = recentScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recentScores.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return { isAnomaly: false, zscore: 0 };
  }

  const zscore = (currentScore - mean) / stdDev;
  const isAnomaly = Math.abs(zscore) > 2.5;

  return { isAnomaly, zscore };
}

export function getValidationConfig(): ValidationConfig {
  return {
    integrityThreshold: 85,
    azimuthTolerance: 15,
    elevationTolerance: 10,
    altitudeDeltaMax: 100,
    consensusMethod: 'weighted',
    outlierDetection: true,
    kalmanFilter: true,
    weights: {
      gps: 0.25,
      sun: 0.30,
      stars: 0.15,
      magnetometer: 0.20,
      barometer: 0.10
    },
    useBarometricCrossCheck: true,
    applyRefractionCorrection: true
  };
}
