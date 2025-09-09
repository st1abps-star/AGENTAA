import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        surface: '#121212',
        neon: '#00D1FF',
        glow: '#1f2937'
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 209, 255, 0.25)'
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseDots: {
          '0%, 80%, 100%': { opacity: '0.2' },
          '40%': { opacity: '1' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulseDots: 'pulseDots 1.4s infinite ease-in-out'
      }
    }
  },
  plugins: []
};

export default config;

