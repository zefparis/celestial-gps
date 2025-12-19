import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getIntegrityColor } from '@/lib/utils';

interface GaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: { radius: 40, stroke: 6, fontSize: 'text-lg', labelSize: 'text-xs' },
  md: { radius: 60, stroke: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
  lg: { radius: 80, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
  xl: { radius: 120, stroke: 12, fontSize: 'text-5xl', labelSize: 'text-sm' }
};

export function Gauge({ 
  value, 
  size = 'md', 
  showLabel = true, 
  animated = true,
  label = 'INTEGRITY',
  className 
}: GaugeProps) {
  const { radius, stroke, fontSize, labelSize } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getIntegrityColor(value);
  const svgSize = radius * 2 + stroke * 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={svgSize} height={svgSize} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="var(--bg-surface)"
          strokeWidth={stroke}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: animated ? circumference : offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-display font-bold number-display', fontSize)}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
          <span className={cn('text-text-tertiary font-mono mt-1 tracking-widest', labelSize)}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
