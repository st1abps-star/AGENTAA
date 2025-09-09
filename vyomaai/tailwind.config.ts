import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        background: '#000000',
        surface: '#0a0a0a',
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        neon: '#00f5ff',
        purple: '#8b5cf6',
        teal: '#14b8a6',
        glow: '#1e293b'
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 245, 255, 0.15)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.15)',
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.15)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseDots: {
          '0%, 80%, 100%': { opacity: '0.2' },
          '40%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulseDots: 'pulseDots 1.4s infinite ease-in-out',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      }
    }
  },
  plugins: []
};

export default config;

