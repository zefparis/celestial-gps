import { useEffect, useCallback, useRef, useState } from 'react';
import { useSensorsStore } from '@/stores/sensors-store';
import type { MagnetometerData, DeviceOrientation } from '@/types/sensors';

interface UseMagnetometerOptions {
  updateInterval?: number;
}

export function useMagnetometer(options: UseMagnetometerOptions = {}) {
  const { updateInterval = 100 } = options;
  
  const { 
    magnetometer, 
    orientation,
    status, 
    updateMagnetometer, 
    updateOrientation,
    setMagnetometerStatus 
  } = useSensorsStore();
  
  const [isCalibrated, setIsCalibrated] = useState(false);
  const lastUpdateRef = useRef<number>(0);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < updateInterval) return;
    lastUpdateRef.current = now;

    const orientationData: DeviceOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute
    };
    
    updateOrientation(orientationData);

    if (event.alpha !== null) {
      const heading = event.absolute ? event.alpha : (360 - event.alpha) % 360;
      
      const magnetometerData: MagnetometerData = {
        x: 0,
        y: 0,
        z: 0,
        heading: heading,
        accuracy: event.absolute ? 5 : 15,
        timestamp: now
      };
      
      updateMagnetometer(magnetometerData);
      setMagnetometerStatus('active');
    }
  }, [updateMagnetometer, updateOrientation, setMagnetometerStatus, updateInterval]);

  const startWatching = useCallback(async () => {
    setMagnetometerStatus('initializing');

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setMagnetometerStatus('error');
          return false;
        }
      } catch (error) {
        console.error('Magnetometer permission error:', error);
        setMagnetometerStatus('error');
        return false;
      }
    }

    window.addEventListener('deviceorientation', handleOrientation, true);
    return true;
  }, [handleOrientation, setMagnetometerStatus]);

  const stopWatching = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation, true);
    setMagnetometerStatus('offline');
  }, [handleOrientation, setMagnetometerStatus]);

  const calibrate = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsCalibrated(true);
        resolve(true);
      }, 3000);
    });
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  return {
    data: magnetometer,
    orientation,
    status: status.magnetometer,
    isAvailable: typeof DeviceOrientationEvent !== 'undefined',
    isCalibrated,
    startWatching,
    stopWatching,
    calibrate
  };
}
