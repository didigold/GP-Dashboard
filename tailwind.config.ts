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
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '6px',
        full: '9999px',
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
