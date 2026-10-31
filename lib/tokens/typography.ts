/**
 * Apex Design System (Apex DS) - Typography Tokens
 * Technical motorsport typography: sharp tabular monospace for milliseconds & deltas,
 * high-contrast grotesque display font for session banners, and clean neutral sans for UI.
 */

export const typography = {
  fontFamilies: {
    sans: 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    display: 'var(--font-display, "Space Grotesk", "Cabinet Grotesk", ui-sans-serif, sans-serif)',
    mono: 'var(--font-mono, "JetBrains Mono", "SF Mono", "Geist Mono", monospace)',
  },

  fontSizes: {
    '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
    xs: ['11px', { lineHeight: '16px', letterSpacing: '0.04em' }],
    sm: ['12px', { lineHeight: '18px', letterSpacing: '0.02em' }],
    base: ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
    md: ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
    lg: ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
    xl: ['22px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
    '2xl': ['28px', { lineHeight: '34px', letterSpacing: '-0.03em' }],
    '3xl': ['36px', { lineHeight: '42px', letterSpacing: '-0.03em' }],
    '4xl': ['48px', { lineHeight: '54px', letterSpacing: '-0.04em' }],
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};
