import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, Mountain, Radio, 
  Moon, ArrowLeftRight, Play, RotateCcw 
} from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Gauge } from '@/components/ui/Gauge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface Scenario {
  id: string;
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedMin: number;
  expectedMax: number;
}

const scenarios: Scenario[] = [
  {
    id: 'nominal',
    icon: CheckCircle2,
    title: 'scenarios.nominal.title',
    description: 'scenarios.nominal.description',
    difficulty: 'easy',
    expectedMin: 95,
    expectedMax: 100
  },
  {
    id: 'urban_canyon',
    icon: Radio,
    title: 'scenarios.urban_canyon.title',
    description: 'scenarios.urban_canyon.description',
    difficulty: 'medium',
    expectedMin: 75,
    expectedMax: 90
  },
  {
    id: 'gps_drift',
    icon: AlertTriangle,
    title: 'scenarios.gps_drift.title',
    description: 'scenarios.gps_drift.description',
    difficulty: 'medium',
    expectedMin: 80,
    expectedMax: 92
  },
  {
    id: 'spoofing_attack',
    icon: AlertTriangle,
    title: 'scenarios.spoofing_attack.title',
    description: 'scenarios.spoofing_attack.description',
    difficulty: 'hard',
    expectedMin: 0,
    expectedMax: 60
  },
  {
    id: 'altitude_climb',
    icon: Mountain,
    title: 'scenarios.altitude_climb.title',
    description: 'scenarios.altitude_climb.description',
    difficulty: 'medium',
    expectedMin: 85,
    expectedMax: 98
  },
  {
    id: 'night_stars',
    icon: Moon,
    title: 'scenarios.night_stars.title',
    description: 'scenarios.night_stars.description',
    difficulty: 'hard',
    expectedMin: 88,
    expectedMax: 96
  },
  {
    id: 'indoor_outdoor',
    icon: ArrowLeftRight,
    title: 'scenarios.indoor_outdoor.title',
    description: 'scenarios.indoor_outdoor.description',
    difficulty: 'medium',
    expectedMin: 60,
    expectedMax: 100
  }
];

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger'
} as const;

interface ScenarioResult {
  scenarioId: string;
  score: number;
  timestamp: number;
}

export function ScenarioTests() {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScenarioResult[]>([]);

  const runScenario = async (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i);
    }

    const score = Math.random() * (scenario.expectedMax - scenario.expectedMin) + scenario.expectedMin;
    
    setResults(prev => [...prev, {
      scenarioId: scenario.id,
      score: Math.round(score),
      timestamp: Date.now()
    }]);

    setIsRunning(false);
    setProgress(0);
  };

  const clearResults = () => {
    setResults([]);
    setSelectedScenario(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">
            {t('scenarios.title')}
          </h2>
          <p className="text-text-secondary">
            {t('scenarios.description')}
          </p>
        </div>

        {results.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearResults}>
            <RotateCcw className="w-4 h-4" />
            {t('scenarios.clear_results')}
          </Button>
        )}
      </div>

      {/* Running Scenario */}
      {isRunning && selectedScenario && (
        <Card variant="glass" glow className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Gauge value={progress} size="lg" label="PROGRESS" />
            <h3 className="text-xl font-display font-semibold">
              {t(selectedScenario.title)}
            </h3>
            <p className="text-text-secondary">{t('scenarios.running')}</p>
            <Progress value={progress} size="md" className="max-w-md" />
          </div>
        </Card>
      )}

      {/* Scenario Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          const result = results.find(r => r.scenarioId === scenario.id);
          
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                variant="solid" 
                glow={!result}
                className={cn(
                  'h-full transition-all cursor-pointer hover:border-accent-primary/50',
                  result && 'border-success/30'
                )}
                onClick={() => !isRunning && runScenario(scenario)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    result ? 'bg-success/20' : 'bg-accent-primary/20'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      result ? 'text-success' : 'text-accent-primary'
                    )} />
                  </div>
                  <Badge variant={difficultyColors[scenario.difficulty]} size="sm">
                    {scenario.difficulty}
                  </Badge>
                </div>

                <h3 className="text-lg font-display font-semibold mb-2">
                  {t(scenario.title)}
                </h3>
                
                <p className="text-sm text-text-secondary mb-4">
                  {t(scenario.description)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary font-mono">
                    Expected: {scenario.expectedMin}-{scenario.expectedMax}%
                  </span>
                  
                  {result && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-display font-bold text-success">
                        {result.score}%
                      </span>
                    </div>
                  )}
                </div>

                {!result && !isRunning && (
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    <Play className="w-4 h-4" />
                    {t('actions.start_test')}
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card variant="glass">
          <CardTitle className="mb-4">Results Summary</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-accent-primary">
                {results.length}
              </p>
              <p className="text-sm text-text-secondary">Tests Run</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-success">
                {Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)}%
              </p>
              <p className="text-sm text-text-secondary">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-success">
                {Math.max(...results.map(r => r.score))}%
              </p>
              <p className="text-sm text-text-secondary">Best</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-warning">
                {Math.min(...results.map(r => r.score))}%
              </p>
              <p className="text-sm text-text-secondary">Worst</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
