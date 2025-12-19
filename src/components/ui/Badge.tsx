import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  default: 'bg-bg-surface text-text-secondary border-border-normal',
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-warning/20 text-warning border-warning/30',
  danger: 'bg-danger/20 text-danger border-danger/30',
  info: 'bg-accent-primary/20 text-accent-primary border-accent-primary/30'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm'
};

export function Badge({ 
  variant = 'default', 
  size = 'sm', 
  children, 
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono uppercase tracking-wider rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
