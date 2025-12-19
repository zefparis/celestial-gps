import type { SensorSnapshot } from './sensors';
import type { ValidationStatus } from './sensors';

export type { ValidationStatus };
import type { CelestialPosition, MagneticFieldModel } from './celestial';

export interface ValidationResult {
  id: string;
  timestamp: number;
  status: ValidationStatus;
  integrityScore: number;
  
  sunDelta: {
    azimuth: number;
    elevation: number;
  };
  magneticDelta: number;
  altitudeDelta: number | null;
  
  gpsAccuracy: number;
  sensorConsensus: number;
  confidence: number;
  
  snapshot: SensorSnapshot;
  celestialData: {
    sun: CelestialPosition;
    magneticField: MagneticFieldModel;
  };
  
  timings: {
    predictionMs: number;
    cryptoMs: number;
    totalMs: number;
  };
}

export interface ValidationConfig {
  integrityThreshold: number;
  azimuthTolerance: number;
  elevationTolerance: number;
  altitudeDeltaMax: number;
  
  consensusMethod: 'weighted' | 'majority' | 'bayesian';
  outlierDetection: boolean;
  kalmanFilter: boolean;
  
  weights: {
    gps: number;
    sun: number;
    stars: number;
    magnetometer: number;
    barometer: number;
  };
  
  useBarometricCrossCheck: boolean;
  applyRefractionCorrection: boolean;
}

export interface ConsensusInput {
  gpsPosition: { lat: number; lon: number; alt: number };
  sunObserved: CelestialPosition | null;
  sunExpected: CelestialPosition;
  magneticObserved: number;
  magneticExpected: number;
  barometerAlt: number | null;
  weights: ValidationConfig['weights'];
}

export interface ConsensusOutput {
  score: number;
  status: ValidationStatus;
  contributions: Record<string, number>;
  outliers: string[];
}

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
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
