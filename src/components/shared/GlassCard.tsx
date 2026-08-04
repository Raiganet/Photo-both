import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'strong' | 'subtle';
}

export function GlassCard({ className, variant = 'default', children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 shadow-xl',
        variant === 'default' && 'glass',
        variant === 'strong' && 'glass-strong',
        variant === 'subtle' && 'bg-background/50 backdrop-blur-sm border border-border',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
