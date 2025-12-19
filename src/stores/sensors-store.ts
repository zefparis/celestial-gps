import { create } from 'zustand';
import type { 
  GPSData, 
  BarometerData, 
  MagnetometerData, 
  DeviceOrientation,
  SensorsState,
  SensorStatus 
} from '@/types/sensors';

interface SensorsStore {
  status: SensorsState;
  gps: GPSData | null;
  barometer: BarometerData | null;
  magnetometer: MagnetometerData | null;
  orientation: DeviceOrientation | null;
  ambientLight: number | null;
  
  setGPSStatus: (status: SensorStatus) => void;
  setBarometerStatus: (status: SensorStatus) => void;
  setMagnetometerStatus: (status: SensorStatus) => void;
  
  updateGPS: (data: GPSData) => void;
  updateBarometer: (data: BarometerData) => void;
  updateMagnetometer: (data: MagnetometerData) => void;
  updateOrientation: (data: DeviceOrientation) => void;
  updateAmbientLight: (lux: number) => void;
  
  resetSensors: () => void;
}

const initialStatus: SensorsState = {
  gps: 'offline',
  barometer: 'offline',
  magnetometer: 'offline',
  gyroscope: 'offline',
  accelerometer: 'offline',
  ambientLight: 'offline',
  camera: 'offline'
};

export const useSensorsStore = create<SensorsStore>((set) => ({
  status: initialStatus,
  gps: null,
  barometer: null,
  magnetometer: null,
  orientation: null,
  ambientLight: null,
  
  setGPSStatus: (status) => set((state) => ({
    status: { ...state.status, gps: status }
  })),
  
  setBarometerStatus: (status) => set((state) => ({
    status: { ...state.status, barometer: status }
  })),
  
  setMagnetometerStatus: (status) => set((state) => ({
    status: { ...state.status, magnetometer: status }
  })),
  
  updateGPS: (data) => set({ gps: data }),
  updateBarometer: (data) => set({ barometer: data }),
  updateMagnetometer: (data) => set({ magnetometer: data }),
  updateOrientation: (data) => set({ orientation: data }),
  updateAmbientLight: (lux) => set({ ambientLight: lux }),
  
  resetSensors: () => set({
    status: initialStatus,
    gps: null,
    barometer: null,
    magnetometer: null,
    orientation: null,
    ambientLight: null
  })
}));
