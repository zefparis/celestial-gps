import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Activity, Compass, Camera, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Permission {
  id: string;
  icon: typeof MapPin;
  title: string;
  description: string;
  required: boolean;
}

const permissions: Permission[] = [
  {
    id: 'geolocation',
    icon: MapPin,
    title: 'permissions.gps.title',
    description: 'permissions.gps.description',
    required: true
  },
  {
    id: 'motion',
    icon: Activity,
    title: 'permissions.motion.title',
    description: 'permissions.motion.description',
    required: true
  },
  {
    id: 'orientation',
    icon: Compass,
    title: 'permissions.orientation.title',
    description: 'permissions.orientation.description',
    required: true
  },
  {
    id: 'camera',
    icon: Camera,
    title: 'permissions.camera.title',
    description: 'permissions.camera.description',
    required: false
  }
];

interface PermissionsRequestProps {
  onComplete: () => void;
}

export function PermissionsRequest({ onComplete }: PermissionsRequestProps) {
  const { t } = useTranslation();
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requesting, setRequesting] = useState<string | null>(null);

  const requestPermission = useCallback(async (permission: Permission) => {
    setRequesting(permission.id);
    setErrors(prev => ({ ...prev, [permission.id]: '' }));

    try {
      switch (permission.id) {
        case 'geolocation':
          await new Promise<void>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              () => resolve(),
              (err) => reject(new Error(err.message)),
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });
          break;

        case 'motion':
        case 'orientation':
          if (typeof DeviceOrientationEvent !== 'undefined' && 
              typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const result = await (DeviceOrientationEvent as any).requestPermission();
            if (result !== 'granted') {
              throw new Error('Permission denied');
            }
          }
          break;

        case 'camera':
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          break;
      }

      setGranted(prev => ({ ...prev, [permission.id]: true }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [permission.id]: error instanceof Error ? error.message : 'Unknown error' 
      }));
    } finally {
      setRequesting(null);
    }
  }, []);

  const allRequiredGranted = permissions
    .filter(p => p.required)
    .every(p => granted[p.id]);

  return (
    <div className="min-h-screen bg-bg-deep cyber-grid p-6">
      <div className="max-w-2xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-center mb-4">
            {t('permissions.title')}
          </h1>
          <p className="text-text-secondary text-center mb-12">
            {t('permissions.description') || 'Grant access to sensors for GPS validation'}
          </p>
        </motion.div>

        <div className="space-y-4">
          {permissions.map((permission, index) => {
            const Icon = permission.icon;
            const isGranted = granted[permission.id];
            const hasError = errors[permission.id];
            const isRequesting = requesting === permission.id;

            return (
              <motion.div
                key={permission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="solid"
                  glow={!isGranted && !hasError}
                  className={cn(
                    'transition-all duration-300',
                    isGranted && 'border-success/50',
                    hasError && 'border-danger/50'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      isGranted ? 'bg-success/20' : hasError ? 'bg-danger/20' : 'bg-accent-primary/20'
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        isGranted ? 'text-success' : hasError ? 'text-danger' : 'text-accent-primary'
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-display font-semibold">
                          {t(permission.title)}
                        </h3>
                        
                        {permission.required && (
                          <Badge variant="warning" size="sm">
                            {t('permissions.required')}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-text-secondary mb-4">
                        {t(permission.description)}
                      </p>

                      {!isGranted && !hasError && (
                        <Button
                          variant="primary"
                          size="sm"
                          loading={isRequesting}
                          onClick={() => requestPermission(permission)}
                        >
                          {t('permissions.grant')}
                        </Button>
                      )}

                      {isGranted && (
                        <div className="flex items-center gap-2 text-success">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-mono">
                            {t('permissions.granted')}
                          </span>
                        </div>
                      )}

                      {hasError && (
                        <div className="flex items-center gap-2 text-danger">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-mono">{hasError}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => requestPermission(permission)}
                          >
                            {t('calibration.retry')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            glow
            disabled={!allRequiredGranted}
            onClick={onComplete}
          >
            {t('permissions.continue_to_calibration')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
