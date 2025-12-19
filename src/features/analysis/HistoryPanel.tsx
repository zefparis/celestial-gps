import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { History, TrendingUp, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useValidationStore } from '@/stores/validation-store';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function HistoryPanel() {
  const { t } = useTranslation();
  const { history, clearHistory, getAverageIntegrity, getSpoofingCount, getStatusCounts } = useValidationStore();

  const chartData = history.slice(0, 50).reverse().map((result, index) => ({
    index,
    score: result.integrityScore,
    sunDelta: Math.abs(result.sunDelta.azimuth),
    magneticDelta: Math.abs(result.magneticDelta)
  }));

  const avgIntegrity = getAverageIntegrity();
  const spoofingCount = getSpoofingCount();
  const statusCounts = getStatusCounts();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <History className="w-16 h-16 text-text-muted mb-4" />
        <h3 className="text-xl font-display font-semibold mb-2">
          {t('history.no_sessions')}
        </h3>
        <p className="text-text-secondary text-center max-w-md">
          {t('history.no_sessions_description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">
            {t('history.title')}
          </h2>
          <p className="text-text-secondary">
            {t('history.description')}
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={clearHistory}>
          <Trash2 className="w-4 h-4" />
          {t('actions.clear')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="solid" className="text-center">
          <p className="text-3xl font-display font-bold text-accent-primary">
            {history.length}
          </p>
          <p className="text-sm text-text-secondary">Total Validations</p>
        </Card>

        <Card variant="solid" className="text-center">
          <p className="text-3xl font-display font-bold text-success">
            {avgIntegrity.toFixed(1)}%
          </p>
          <p className="text-sm text-text-secondary">{t('metrics.avg_integrity')}</p>
        </Card>

        <Card variant="solid" className="text-center">
          <p className="text-3xl font-display font-bold text-success">
            {statusCounts.NOMINAL}
          </p>
          <p className="text-sm text-text-secondary">Nominal</p>
        </Card>

        <Card variant="solid" className="text-center">
          <p className="text-3xl font-display font-bold text-danger">
            {spoofingCount}
          </p>
          <p className="text-sm text-text-secondary">Spoofing Detected</p>
        </Card>
      </div>

      {/* Chart */}
      <Card variant="glass">
        <CardTitle className="mb-4">{t('history.realtime_title')}</CardTitle>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="index" 
                stroke="#718096"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#718096"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#00d4ff" 
                strokeWidth={2}
                dot={false}
                name="Integrity"
              />
              <Line 
                type="monotone" 
                dataKey="sunDelta" 
                stroke="#ff9500" 
                strokeWidth={1}
                dot={false}
                name="Sun Δ"
              />
              <Line 
                type="monotone" 
                dataKey="magneticDelta" 
                stroke="#6366f1" 
                strokeWidth={1}
                dot={false}
                name="Mag Δ"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Validations */}
      <Card variant="glass">
        <CardTitle className="mb-4">Recent Validations</CardTitle>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.slice(0, 20).map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'bg-bg-surface border border-border-subtle'
              )}
            >
              <div className="flex items-center gap-3">
                {result.status === 'NOMINAL' && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                {result.status === 'DRIFT' && (
                  <TrendingUp className="w-5 h-5 text-warning" />
                )}
                {result.status === 'SPOOFING' && (
                  <AlertTriangle className="w-5 h-5 text-danger" />
                )}
                
                <div>
                  <p className="font-mono text-sm">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    GPS: ±{result.gpsAccuracy.toFixed(0)}m
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    result.status === 'NOMINAL' ? 'success' : 
                    result.status === 'DRIFT' ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {result.status}
                </Badge>
                
                <span className={cn(
                  'text-xl font-display font-bold',
                  result.integrityScore >= 85 ? 'text-success' :
                  result.integrityScore >= 60 ? 'text-warning' : 'text-danger'
                )}>
                  {result.integrityScore.toFixed(0)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
