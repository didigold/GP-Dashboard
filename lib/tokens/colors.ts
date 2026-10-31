/**
 * Apex Design System (Apex DS) - Color Tokens
 * Derived from high-contrast motorsport telemetry consoles, dark asphalt pitwalls,
 * and semantic flag/telemetry indicators.
 */

export const colors = {
  // Surface Hierarchy
  surface: {
    base: '#07090E',          // Deepest pitwall background
    subtle: '#0D111A',        // Table alternating rows / subtle container
    card: '#121824',          // Standard glassmorphic card
    cardHover: '#182030',     // Card hover state
    overlay: '#1A2336',       // Modals, dropdowns, popovers
    border: '#222C40',        // Tactical 1px primary border
    borderSubtle: '#161D2B',  // Inner dividers
    borderActive: '#00F5D4',  // Active selected border
  },

  // Text Hierarchy
  text: {
    primary: '#F8FAFC',       // High emphasis headlines & active data
    secondary: '#94A3B8',     // Body text & labels
    muted: '#64748B',         // Secondary metadata & timestamps
    subtle: '#475569',        // Inactive tabs / borders
    inverse: '#07090E',       // Text on neon backgrounds
  },

  // Semantic Racing & Telemetry Accents
  racing: {
    cyan: '#00F5D4',          // Live session / Fastest Lap / High Velocity
    purple: '#A855F7',        // All-time session record / Best sector
    green: '#00E676',         // Personal best sector / Green flag track clear
    amber: '#FFB703',         // Slower sector / Yellow flag caution / Medium tyre
    crimson: '#FF2A54',       // Crash / Red flag / Soft tyre / Ducati red
    orange: '#FB8500',        // KTM orange / Hard tyre / Hard braking zone
    electricBlue: '#38BDF8',  // Extreme lean angle threshold / Cold tyre
    magenta: '#EC4899',       // Telemetry differential
  },

  // Tyre Thermal Gradients
  tyreThermal: {
    cold: '#38BDF8',          // < 75°C (Grip hazard)
    optimal: '#00E676',       // 85°C - 115°C (Peak operating window)
    warning: '#FFB703',       // 120°C - 130°C (Thermal degradation)
    critical: '#FF2A54',      // > 135°C (Blistering / tearing risk)
  },
};
