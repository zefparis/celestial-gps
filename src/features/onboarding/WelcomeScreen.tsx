import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Satellite, Shield, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WelcomeScreenProps {
  onStart: () => void;
  onLearnMore: () => void;
}

export function WelcomeScreen({ onStart, onLearnMore }: WelcomeScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-void cyber-grid flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated Logo */}
        <motion.div
          className="flex justify-center mb-8"
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{ 
            rotateY: { duration: 8, repeat: Infinity, ease: 'linear' }
          }}
        >
          <div className="relative">
            <Satellite className="w-24 h-24 text-accent-primary" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <Shield className="w-32 h-32 text-accent-secondary opacity-20" strokeWidth={0.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 holographic">
          {t('welcome.title')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-text-secondary mb-8 font-body">
          {t('welcome.subtitle')}
        </p>

        {/* Version Badge */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="px-4 py-2 rounded-full bg-glass-bg border border-glass-border backdrop-blur-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' }}
          >
            <span className="text-sm font-mono text-accent-primary">
              CELESTIAL GPS v2.0.0
            </span>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mb-12">
          <Button variant="primary" size="lg" glow onClick={onStart}>
            <Rocket className="w-5 h-5" />
            {t('welcome.cta_start')}
          </Button>
          
          <Button variant="ghost" size="md" onClick={onLearnMore}>
            {t('welcome.cta_learn_more')}
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Shield, label: t('features.anti_spoofing') },
            { icon: Satellite, label: t('features.multi_sensor') },
            { icon: Rocket, label: t('features.real_time') }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-elevated border border-border-subtle"
            >
              <feature.icon className="w-6 h-6 text-accent-primary" />
              <span className="text-xs text-text-tertiary text-center">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
