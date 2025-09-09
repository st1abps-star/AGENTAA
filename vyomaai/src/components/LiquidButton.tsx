"use client";
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
};

export default function LiquidButton({ className, variant = 'primary', icon, children, ...props }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'liquid-button relative rounded-xl px-4 py-2 transition-colors',
        'border backdrop-blur-md',
        variant === 'primary'
          ? 'bg-[rgba(0,209,255,0.12)] border-[rgba(0,209,255,0.35)] text-sky-100 hover:bg-[rgba(0,209,255,0.18)]'
          : 'bg-white/10 border-white/15 text-gray-100 hover:bg-white/15',
        className
      )}
      {...props}
    >
      <span className="liquid-sheen pointer-events-none" />
      <span className="relative inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </motion.button>
  );
}

