import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        surface: {
          base: '#000000',
          soft: '#0A0A0A',
          card: '#111111',
          cardHover: '#181818',
          elevated: '#1E1E1E',
          border: '#262626',
          borderStrong: '#3A3A3A',
          borderSubtle: '#1A1A1A',
        },
        motogp: {
          red: '#E10600',
          darkred: '#990400',
          lightred: '#FF2A24',
          carbon: '#141414',
          asphalt: '#080808',
        },
        ink: {
          primary: '#FFFFFF',
          strong: '#E5E5E5',
          body: '#A3A3A3',
          muted: '#737373',
          dark: '#000000',
        },
        motorsport: {
          purple: '#A855F7',
          green: '#16A34A',
          amber: '#EAB308',
          crimson: '#E10600',
          blue: '#2563EB',
        },
        racing: {
          dark: '#0A0A0A',
          card: '#161616',
          cardHover: '#1E1E1E',
          border: '#262626',
          subtle: '#737373',
          cyan: '#00F5D4',
          yellow: '#EAB308',
          orange: '#F97316',
          purple: '#A855F7',
          red: '#E10600',
          green: '#16A34A',
        },
      },
      boxShadow: {
        'elev-1':
          'inset 0 1px 0 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.6)',
        'elev-2':
          'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 8px 24px -8px rgba(0,0,0,0.8)',
        'elev-3':
          'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 24px 48px -12px rgba(0,0,0,0.85)',
        'glow-red':
          '0 0 0 1px rgba(225,6,0,0.35), 0 0 24px -6px rgba(225,6,0,0.5)',
        'glow-cyan':
          '0 0 0 1px rgba(0,245,212,0.4), 0 0 20px -4px rgba(0,245,212,0.45)',
        'glow-purple':
          '0 0 0 1px rgba(168,85,247,0.4), 0 0 20px -4px rgba(168,85,247,0.45)',
      },
      borderRadius: {
        none: '0px',
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
        'apex-xs': '4px',
        'apex-sm': '6px',
        'apex-md': '12px',
        'apex-lg': '16px',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        precision: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-sans)', 'Sora', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
