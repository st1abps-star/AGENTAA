"use client";
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'neon' | 'purple' | 'teal';
};

export default function GlassIcon({ children, className, size = 'md', variant = 'neon' }: Props) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const variantClasses = {
    neon: 'bg-gradient-to-br from-neon/20 to-neon/10 border-neon/30 shadow-glow',
    purple: 'bg-gradient-to-br from-purple/20 to-purple/10 border-purple/30 shadow-glow-purple',
    teal: 'bg-gradient-to-br from-teal/20 to-teal/10 border-teal/30 shadow-glow-teal'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'glass-panel rounded-xl flex items-center justify-center transition-all duration-300',
        'backdrop-blur-xl border',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <div className="icon-glow">
        {children}
      </div>
    </motion.div>
  );
}