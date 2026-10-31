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
        surface: {
          base: '#07090E',
          subtle: '#0D111A',
          card: '#121824',
          cardHover: '#182030',
          overlay: '#1A2336',
          border: '#222C40',
          borderSubtle: '#161D2B',
          borderActive: '#00F5D4',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
          subtle: '#475569',
        },
        apex: {
          cyan: '#00F5D4',
          purple: '#A855F7',
          green: '#00E676',
          amber: '#FFB703',
          crimson: '#FF2A54',
          orange: '#FB8500',
          blue: '#38BDF8',
        },
      },
      borderRadius: {
        'apex-none': '0px',
        'apex-xs': '4px',
        'apex-sm': '8px',
        'apex-md': '12px',
        'apex-lg': '16px',
        'apex-xl': '24px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 245, 212, 0.45)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.45)',
        'glow-crimson': '0 0 20px -3px rgba(255, 42, 84, 0.45)',
        'glow-amber': '0 0 20px -3px rgba(255, 183, 3, 0.45)',
        'inner-bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
