import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Satellite, Activity, FlaskConical, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { LiveValidation } from './LiveValidation';
import { ScenarioTests } from '../scenarios/ScenarioTests';
import { HistoryPanel } from '../analysis/HistoryPanel';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

type Tab = 'live' | 'scenarios' | 'history';

export function MainDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('live');

  const tabs = [
    { id: 'live' as Tab, icon: Activity, label: 'nav.live' },
    { id: 'scenarios' as Tab, icon: FlaskConical, label: 'nav.scenarios' },
    { id: 'history' as Tab, icon: History, label: 'nav.history' }
  ];

  return (
    <div className="min-h-screen bg-bg-void">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-xl border-b border-border-subtle safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Satellite className="w-8 h-8 text-accent-primary" />
              </motion.div>
              <h1 className="text-2xl font-display font-bold holographic">
                CELESTIAL GPS
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap',
                  'font-mono text-sm uppercase tracking-wide',
                  activeTab === tab.id
                    ? 'bg-accent-primary/20 text-accent-primary border-b-2 border-accent-primary'
                    : 'text-text-secondary hover:bg-bg-surface'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {t(tab.label)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 safe-bottom">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LiveValidation />
            </motion.div>
          )}
          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ScenarioTests />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HistoryPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
