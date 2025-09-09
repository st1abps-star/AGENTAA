"use client";
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export default function LiquidButton({ 
  className, 
  variant = 'primary', 
  size = 'md',
  icon, 
  children, 
  ...props 
}: Props) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        'liquid-button relative rounded-xl font-medium transition-all duration-300',
        'border backdrop-blur-xl',
        sizeClasses[size],
        variant === 'primary'
          ? 'bg-gradient-to-r from-neon/20 to-purple/20 border-neon/30 text-slate-100 hover:from-neon/30 hover:to-purple/30'
          : 'bg-glass border-glass-border text-slate-100 hover:bg-white/10',
        className
      )}
      {...props}
    >
      <span className="liquid-sheen pointer-events-none" />
      <span className="relative inline-flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
    </motion.button>
  );
}

