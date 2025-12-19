import { useCallback, useRef, useState, useEffect } from 'react';
import { useSensorsStore } from '@/stores/sensors-store';
import type { BarometerData } from '@/types/sensors';

interface UseBarometerOptions {
  seaLevelPressure?: number;
  updateInterval?: number;
}

function pressureToAltitude(pressure: number, seaLevelPressure: number): number {
  return 44330 * (1 - Math.pow(pressure / seaLevelPressure, 0.1903));
}

export function useBarometer(options: UseBarometerOptions = {}) {
  const { 
    seaLevelPressure = 1013.25,
    updateInterval = 500 
  } = options;
  
  const { 
    barometer, 
    status, 
    updateBarometer, 
    setBarometerStatus 
  } = useSensorsStore();
  
  const [isAvailable, setIsAvailable] = useState(false);
  const sensorRef = useRef<any>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    setIsAvailable('Barometer' in window || 'AbsoluteOrientationSensor' in window);
  }, []);

  const handleReading = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < updateInterval) return;
    lastUpdateRef.current = now;

    if (sensorRef.current) {
      const pressure = sensorRef.current.pressure || 1013.25;
      const altitude = pressureToAltitude(pressure, seaLevelPressure);
      
      const data: BarometerData = {
        pressure,
        altitudeEstimate: altitude,
        timestamp: now
      };
      
      updateBarometer(data);
      setBarometerStatus('active');
    }
  }, [updateBarometer, setBarometerStatus, seaLevelPressure, updateInterval]);

  const startWatching = useCallback(async () => {
    if (!isAvailable) {
      setBarometerStatus('offline');
      return false;
    }

    setBarometerStatus('initializing');

    try {
      if ('Barometer' in window) {
        sensorRef.current = new (window as any).Barometer({ frequency: 1000 / updateInterval });
        sensorRef.current.addEventListener('reading', handleReading);
        sensorRef.current.addEventListener('error', () => setBarometerStatus('error'));
        sensorRef.current.start();
        return true;
      }
      
      setBarometerStatus('offline');
      return false;
    } catch (error) {
      console.error('Barometer error:', error);
      setBarometerStatus('error');
      return false;
    }
  }, [isAvailable, handleReading, setBarometerStatus, updateInterval]);

  const stopWatching = useCallback(() => {
    if (sensorRef.current) {
      sensorRef.current.stop();
      sensorRef.current = null;
    }
    setBarometerStatus('offline');
  }, [setBarometerStatus]);

  useEffect(() => {
    return () => {
      if (sensorRef.current) {
        sensorRef.current.stop();
      }
    };
  }, []);

  return {
    data: barometer,
    status: status.barometer,
    isAvailable,
    startWatching,
    stopWatching
  };
}
