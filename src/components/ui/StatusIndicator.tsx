import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Status = 'nominal' | 'warning' | 'critical' | 'offline' | 'initializing';

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<Status, { color: string; bg: string; glow: string }> = {
  nominal: { 
    color: 'text-success', 
    bg: 'bg-success', 
    glow: 'shadow-[0_0_12px_var(--success)]' 
  },
  warning: { 
    color: 'text-warning', 
    bg: 'bg-warning', 
    glow: 'shadow-[0_0_12px_var(--warning)]' 
  },
  critical: { 
    color: 'text-danger', 
    bg: 'bg-danger', 
    glow: 'shadow-[0_0_12px_var(--danger)]' 
  },
  offline: { 
    color: 'text-text-muted', 
    bg: 'bg-text-muted', 
    glow: '' 
  },
  initializing: { 
    color: 'text-accent-primary', 
    bg: 'bg-accent-primary', 
    glow: 'shadow-[0_0_12px_var(--accent-primary)]' 
  }
};

const sizeConfig = {
  sm: { dot: 'w-1.5 h-1.5', text: 'text-xs' },
  md: { dot: 'w-2 h-2', text: 'text-sm' },
  lg: { dot: 'w-3 h-3', text: 'text-base' }
};

export function StatusIndicator({ 
  status, 
  label, 
  pulse = true, 
  size = 'md',
  className 
}: StatusIndicatorProps) {
  const { color, bg, glow } = statusConfig[status];
  const { dot, text } = sizeConfig[size];
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('rounded-full', dot, bg, glow)} />
        {pulse && status !== 'offline' && (
          <motion.div
            className={cn('absolute inset-0 rounded-full', bg)}
            animate={{ 
              scale: [1, 1.8, 1], 
              opacity: [0.8, 0, 0.8] 
            }}
            transition={{ 
              duration: status === 'initializing' ? 1 : 2, 
              repeat: Infinity 
            }}
          />
        )}
      </div>
      {label && (
        <span className={cn('font-mono uppercase tracking-wider', text, color)}>
          {label}
        </span>
      )}
    </div>
  );
}
