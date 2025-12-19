export type SensorStatus = 'offline' | 'initializing' | 'active' | 'error';
export type ValidationStatus = 'NOMINAL' | 'DRIFT' | 'SPOOFING' | 'UNCERTAIN';

export interface GPSData {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  satellites?: number;
}

export interface BarometerData {
  pressure: number;
  altitudeEstimate: number;
  temperature?: number;
  timestamp: number;
}

export interface MagnetometerData {
  x: number;
  y: number;
  z: number;
  heading: number;
  accuracy: number;
  timestamp: number;
}

export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  inclination: number;
  timestamp: number;
}

export interface AmbientLightData {
  illuminance: number;
  timestamp: number;
}

export interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
}

export interface SensorSnapshot {
  gps: GPSData | null;
  barometer: BarometerData | null;
  magnetometer: MagnetometerData | null;
  gyroscope: GyroscopeData | null;
  accelerometer: AccelerometerData | null;
  ambientLight: AmbientLightData | null;
  orientation: DeviceOrientation | null;
  timestamp: number;
}

export interface SensorsState {
  gps: SensorStatus;
  barometer: SensorStatus;
  magnetometer: SensorStatus;
  gyroscope: SensorStatus;
  accelerometer: SensorStatus;
  ambientLight: SensorStatus;
  camera: SensorStatus;
}

export interface SensorConfig {
  enabled: boolean;
  updateRate: number;
}

export interface GPSConfig extends SensorConfig {
  minAccuracy: number;
  timeout: number;
  maximumAge: number;
}

export interface BarometerConfig extends SensorConfig {
  seaLevelPressure: number;
}

export interface MagnetometerConfig extends SensorConfig {
  calibrationOffset: { x: number; y: number; z: number };
  autoCorrection: boolean;
}
