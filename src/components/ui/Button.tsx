import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-accent-primary text-bg-deep hover:bg-accent-secondary',
  secondary: 'bg-bg-elevated text-text-primary border border-border-strong hover:bg-bg-surface',
  ghost: 'bg-transparent text-accent-primary hover:bg-bg-surface',
  danger: 'bg-danger text-white hover:bg-danger-dim',
  success: 'bg-success text-bg-deep hover:bg-success-dim'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}, ref) => (
  <motion.button
    ref={ref}
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    className={cn(
      'font-display font-semibold rounded-lg transition-all duration-200',
      'flex items-center justify-center gap-2',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep',
      variants[variant],
      sizes[size],
      glow && 'shadow-glow',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : icon ? (
      icon
    ) : null}
    {children}
  </motion.button>
));

Button.displayName = 'Button';
