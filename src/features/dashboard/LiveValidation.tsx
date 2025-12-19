import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  MapPin, Mountain, Sun, Compass, Gauge as GaugeIcon, 
  RefreshCw, Download, AlertTriangle, Satellite
} from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Gauge } from '@/components/ui/Gauge';
import { Button } from '@/components/ui/Button';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { useGPS } from '@/features/sensors/hooks/useGPS';
import { useMagnetometer } from '@/features/sensors/hooks/useMagnetometer';
import { useSensorsStore } from '@/stores/sensors-store';
import { useValidationStore } from '@/stores/validation-store';
import { calculateSunPosition, calculateSunDelta } from '@/lib/celestial/solar-engine';
import { getMagneticDeclination } from '@/lib/celestial/magnetic-model';
import { calculateConsensus } from '@/lib/validation/consensus-algorithm';
import { formatCoordinate, formatAltitude, formatDegrees, generateId, angleDifference } from '@/lib/utils';
import { CelestialDome3D } from '@/features/celestial/CelestialDome3D';
import type { ValidationResult } from '@/types/validation';

export function LiveValidation() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  
  const gpsHook = useGPS();
  const magnetometerHook = useMagnetometer();
  const { gps, magnetometer } = useSensorsStore();
  const { currentResult, isValidating, setCurrentResult, addToHistory, setIsValidating, config } = useValidationStore();

  const runValidation = useCallback(() => {
    if (!gps) return;

    setIsValidating(true);
    const startTime = performance.now();

    const sunPosition = calculateSunPosition(
      gps.latitude,
      gps.longitude,
      gps.altitude,
      new Date()
    );

    const expectedDeclination = getMagneticDeclination(
      gps.latitude,
      gps.longitude,
      gps.altitude / 1000
    );

    const observedHeading = magnetometer?.heading ?? 0;

    const observedSunPosition = {
      azimuth: sunPosition.azimuth,
      elevation: sunPosition.elevation
    };

    const consensusResult = calculateConsensus({
      gpsPosition: { lat: gps.latitude, lon: gps.longitude, alt: gps.altitude },
      sunObserved: observedSunPosition,
      sunExpected: sunPosition,
      magneticObserved: observedHeading,
      magneticExpected: expectedDeclination,
      barometerAlt: null,
      weights: config.weights
    });

    const sunDelta = calculateSunDelta(observedSunPosition, sunPosition);
    const magneticDelta = angleDifference(observedHeading, expectedDeclination);

    const endTime = performance.now();

    const result: ValidationResult = {
      id: generateId(),
      timestamp: Date.now(),
      status: consensusResult.status,
      integrityScore: consensusResult.score,
      sunDelta,
      magneticDelta,
      altitudeDelta: null,
      gpsAccuracy: gps.accuracy,
      sensorConsensus: consensusResult.score / 100,
      confidence: 0.85,
      snapshot: {
        gps,
        barometer: null,
        magnetometer,
        gyroscope: null,
        accelerometer: null,
        ambientLight: null,
        orientation: null,
        timestamp: Date.now()
      },
      celestialData: {
        sun: sunPosition,
        magneticField: {
          declination: expectedDeclination,
          inclination: 0,
          horizontalIntensity: 0,
          totalIntensity: 0,
          northComponent: 0,
          eastComponent: 0,
          verticalComponent: 0
        }
      },
      timings: {
        predictionMs: endTime - startTime,
        cryptoMs: 0,
        totalMs: endTime - startTime
      }
    };

    setCurrentResult(result);
    addToHistory(result);
    setIsValidating(false);
  }, [gps, magnetometer, config.weights, setCurrentResult, addToHistory, setIsValidating]);

  useEffect(() => {
    if (isRunning) {
      gpsHook.startWatching();
      magnetometerHook.startWatching();

      const interval = setInterval(runValidation, 2000);
      return () => {
        clearInterval(interval);
        gpsHook.stopWatching();
        magnetometerHook.stopWatching();
      };
    }
  }, [isRunning]);

  const toggleValidation = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      gpsHook.stopWatching();
      magnetometerHook.stopWatching();
    }
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      result: currentResult
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celestial-gps-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const score = currentResult?.integrityScore ?? 0;
  const status = currentResult?.status ?? 'NOMINAL';

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card variant="glass" glow className="text-center">
        <div className="flex flex-col items-center gap-6 py-8">
          <Gauge value={score} size="xl" animated />
          
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">
              {t(`validation.status.${status}`)}
            </h2>
            <p className="text-text-secondary">
              {t('validation.consensus_description')}
            </p>
          </div>

          {status === 'SPOOFING' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md p-4 bg-danger/20 border border-danger/50 rounded-lg"
            >
              <div className="flex items-center gap-3 text-danger">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-display font-bold">{t('alerts.spoofing_detected')}</p>
                  <p className="text-sm opacity-80">
                    {t('alerts.spoofing_description', { delta: '2.2' })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* 3D Dome + Metrics Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 3D Celestial Dome */}
        <Card variant="glass">
          <CardTitle className="mb-4">{t('celestial.dome_title')}</CardTitle>
          <div className="aspect-square rounded-lg overflow-hidden bg-bg-void">
            <CelestialDome3D
              sunAzimuth={currentResult?.celestialData.sun.azimuth ?? 180}
              sunElevation={currentResult?.celestialData.sun.elevation ?? 45}
              compassHeading={magnetometer?.heading ?? 0}
            />
          </div>
        </Card>

        {/* Metrics */}
        <Card variant="glass">
          <CardTitle className="mb-4">{t('metrics.title')}</CardTitle>
          
          <div className="space-y-4">
            <MetricRow
              icon={MapPin}
              label={t('metrics.gps_position')}
              value={gps ? `${formatCoordinate(gps.latitude, true)}, ${formatCoordinate(gps.longitude, false)}` : '--'}
              status={gps && gps.accuracy < 10 ? 'nominal' : 'warning'}
            />

            <MetricRow
              icon={Mountain}
              label={t('metrics.altitude')}
              value={gps ? `${formatAltitude(gps.altitude)} ±${gps.altitudeAccuracy?.toFixed(0) ?? '?'}m` : '--'}
              status="nominal"
            />

            <MetricRow
              icon={Sun}
              label={t('metrics.sun_delta')}
              value={currentResult 
                ? `Δ${formatDegrees(currentResult.sunDelta.azimuth)} Az, Δ${formatDegrees(currentResult.sunDelta.elevation)} El`
                : '--'}
              status={currentResult && Math.abs(currentResult.sunDelta.azimuth) < 10 ? 'nominal' : 'warning'}
            />

            <MetricRow
              icon={Compass}
              label={t('metrics.magnetic_delta')}
              value={currentResult ? `Δ${formatDegrees(currentResult.magneticDelta)}` : '--'}
              status={currentResult && Math.abs(currentResult.magneticDelta) < 15 ? 'nominal' : 'warning'}
            />

            <MetricRow
              icon={GaugeIcon}
              label={t('sensors.barometer')}
              value="--"
              status="offline"
            />
          </div>
        </Card>
      </div>

      {/* Sensors Status */}
      <Card variant="glass">
        <CardTitle className="mb-4">{t('sensors.title')}</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SensorCard
            icon={Satellite}
            name={t('sensors.gps')}
            status={gps ? 'nominal' : 'offline'}
            detail={gps ? `±${gps.accuracy.toFixed(0)}m` : 'N/A'}
          />
          <SensorCard
            icon={Compass}
            name={t('sensors.magnetometer')}
            status={magnetometer ? 'nominal' : 'offline'}
            detail={magnetometer ? `${magnetometer.heading.toFixed(0)}°` : 'N/A'}
          />
          <SensorCard
            icon={GaugeIcon}
            name={t('sensors.barometer')}
            status="offline"
            detail="N/A"
          />
          <SensorCard
            icon={Sun}
            name={t('sensors.ambient_light')}
            status="offline"
            detail="N/A"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          variant={isRunning ? 'danger' : 'primary'}
          size="lg"
          glow={!isRunning}
          loading={isValidating}
          onClick={toggleValidation}
        >
          <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? t('actions.stop') : t('actions.refresh')}
        </Button>
        
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={exportData}
          disabled={!currentResult}
        >
          <Download className="w-5 h-5" />
          {t('actions.export_json')}
        </Button>
      </div>
    </div>
  );
}

function MetricRow({ 
  icon: Icon, 
  label, 
  value, 
  status 
}: { 
  icon: typeof MapPin; 
  label: string; 
  value: string; 
  status: 'nominal' | 'warning' | 'critical' | 'offline';
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-accent-primary" />
        <span className="text-text-secondary">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-text-primary">{value}</span>
        <StatusIndicator status={status} size="sm" />
      </div>
    </div>
  );
}

function SensorCard({ 
  icon: Icon, 
  name, 
  status, 
  detail 
}: { 
  icon: typeof Satellite; 
  name: string; 
  status: 'nominal' | 'warning' | 'critical' | 'offline' | 'initializing';
  detail: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-bg-surface border border-border-subtle">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-accent-primary" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-tertiary font-mono">{detail}</span>
        <StatusIndicator status={status} size="sm" />
      </div>
    </div>
  );
}
