/**
 * Apex Design System (Apex DS) - Standardized UI Control Sizes
 * Unifies buttons, pills, dropdowns, and icon controls across the application.
 */

export const controlSizes = {
  /**
   * Standard Pill Heights & Paddings
   * Used for SeasonSelectorPill, Category Switchers (Riders vs Teams), Filters, and Badges.
   */
  pill: {
    sm: {
      height: 'h-8',
      padding: 'px-3',
      text: 'text-xs',
      className: 'h-8 px-3 text-xs',
    },
    // Standard baseline pill height (36px) used throughout header, grid switchers, and filters
    md: {
      height: 'h-9',
      padding: 'px-4',
      text: 'text-xs sm:text-sm',
      className: 'h-9 px-4 text-xs sm:text-sm',
    },
    lg: {
      height: 'h-10',
      padding: 'px-5',
      text: 'text-sm',
      className: 'h-10 px-5 text-sm',
    },
  },

  /**
   * Standard Action Button Sizes
   * Used for CTA buttons (Details, View More, Primary actions).
   */
  button: {
    sm: {
      height: 'h-8',
      padding: 'px-3',
      text: 'text-xs',
      className: 'h-8 px-3 text-xs font-medium',
    },
    md: {
      height: 'h-9',
      padding: 'px-4 sm:px-5',
      text: 'text-xs sm:text-sm',
      className: 'h-9 px-4 sm:px-5 text-xs sm:text-sm font-semibold',
    },
    lg: {
      height: 'h-11',
      padding: 'px-6 sm:px-7',
      text: 'text-sm sm:text-base',
      className: 'h-11 px-6 sm:px-7 text-sm sm:text-base font-semibold',
    },
  },

  /**
   * Circular Icon Button Sizes
   * Used for Language selector, Search, Settings, Close triggers.
   */
  iconButton: {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9',
  },
} as const;

export type PillSize = keyof typeof controlSizes.pill;
export type ButtonSize = keyof typeof controlSizes.button;
export type IconButtonSize = keyof typeof controlSizes.iconButton;
