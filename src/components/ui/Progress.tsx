import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

const variantStyles = {
  default: 'bg-accent-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger'
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  animated = true,
  className
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-bg-surface rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full',
            variantStyles[variant]
          )}
          initial={{ width: animated ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            boxShadow: `0 0 10px ${variant === 'default' ? 'var(--accent-primary)' : `var(--${variant})`}`
          }}
        />
      </div>
      {showValue && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-mono text-text-secondary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
