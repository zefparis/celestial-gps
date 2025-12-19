import { useEffect, useCallback, useRef } from 'react';
import { useSensorsStore } from '@/stores/sensors-store';
import type { GPSData } from '@/types/sensors';

interface UseGPSOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  updateInterval?: number;
}

export function useGPS(options: UseGPSOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    updateInterval = 1000
  } = options;

  const { 
    gps, 
    status, 
    updateGPS, 
    setGPSStatus 
  } = useSensorsStore();
  
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < updateInterval) return;
    lastUpdateRef.current = now;

    const data: GPSData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude ?? 0,
      accuracy: position.coords.accuracy,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };

    updateGPS(data);
    setGPSStatus('active');
  }, [updateGPS, setGPSStatus, updateInterval]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    console.error('GPS Error:', error.message);
    setGPSStatus('error');
  }, [setGPSStatus]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setGPSStatus('error');
      return;
    }

    setGPSStatus('initializing');

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError, setGPSStatus]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGPSStatus('offline');
  }, [setGPSStatus]);

  const requestSinglePosition = useCallback(() => {
    return new Promise<GPSData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: GPSData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude ?? 0,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          resolve(data);
        },
        (error) => reject(error),
        { enableHighAccuracy, timeout, maximumAge }
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    data: gps,
    status: status.gps,
    isAvailable: 'geolocation' in navigator,
    startWatching,
    stopWatching,
    requestSinglePosition
  };
}
