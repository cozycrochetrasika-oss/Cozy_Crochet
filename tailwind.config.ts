import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium White + Pink System Tokens
        white: '#FFFFFF',
        'background-soft': 'var(--background-soft)',
        'surface-pink': 'var(--surface-pink)',

        pink: {
          50: '#FFF7FA',
          100: '#FFEAF1',
          200: '#FFD6E3',
          300: '#F8B9CF',
          400: '#EE91B3',
          500: '#DD6996',
          600: '#C64D7D',
          700: '#A93B68',
          800: '#7F294D',
        },

        roseSoft: '#F4CCD8',
        blush: '#F8DDE5',
        dustyRose: '#D99AAC',

        // Refined Pastel Highlights
        lavender: '#E4D7F3',
        mint: '#D9F0E5',
        warmGold: '#D4B06B',

        // Neutrals
        ink: '#241B20',
        textSecondary: '#6A5962',
        textSubtle: '#8E7A85',

        // Remapped tokens for backwards compatibility
        cream: '#FFFCFD',
        cocoa: '#6A5962',
        sage: '#D9F0E5',

        // Semantic UI Tokens backed by CSS variables
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          muted: 'var(--surface-muted)',
          pink: 'var(--surface-pink)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          inverse: 'var(--fg-on-accent)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        yarn: 'var(--shadow-yarn)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
