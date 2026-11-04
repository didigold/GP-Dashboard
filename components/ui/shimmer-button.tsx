'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'render'> {
  /**
   * The label or content, rendered above the ring.
   */
  children?: React.ReactNode;
  /**
   * How long one pass of light around the ring takes, in milliseconds, pause included.
   * @default 3000
   */
  duration?: number;
  /**
   * The ring's border thickness in pixels or CSS units.
   * @default 2.5
   */
  ringWidth?: number | string;
  /**
   * Whether the button should be focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * Whether the component renders a native `<button>` element when replacing it via the `render` prop.
   * Set to `false` if the rendered element is not a button (for example, `<div>`).
   * @default true
   */
  nativeButton?: boolean;
  /**
   * The ring's color at rest, any CSS color.
   */
  ringColor?: string;
  /**
   * The light that runs along the ring, any CSS color.
   */
  shimmerColor?: string;
  /**
   * Replace the host element or compose it with another component.
   */
  render?:
    | React.ReactElement
    | ((
        props: Record<string, unknown>,
        state: { disabled?: boolean }
      ) => React.ReactElement);
  /**
   * Additional CSS classes merged with the component.
   */
  className?: string;
  /**
   * Button variant from shadcn button
   */
  variant?: ButtonProps['variant'];
  /**
   * Button size from shadcn button
   */
  size?: ButtonProps['size'];
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  ShimmerButtonProps
>(
  (
    {
      children,
      duration = 3000,
      ringWidth = 2.5,
      focusableWhenDisabled = false,
      nativeButton = true,
      ringColor,
      shimmerColor,
      render,
      className,
      variant = 'default',
      size = 'default',
      disabled,
      style,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const resolvedRingWidth =
      typeof ringWidth === 'number' ? `${ringWidth}px` : ringWidth || '2.5px';

    // Style variables for the ring animation, colors, and thickness
    const ringStyle = {
      ...(duration !== undefined ? { '--shimmer-button-duration': `${duration}ms` } : {}),
      ...(shimmerColor ? { '--shimmer-button-glint': shimmerColor } : {}),
      ...(ringColor ? { '--shimmer-button-ring': ringColor } : {}),
      padding: resolvedRingWidth,
    } as React.CSSProperties;

    const ringElement = (
      <span
        aria-hidden="true"
        data-slot="shimmer-button-ring"
        className="pointer-events-none absolute -inset-px overflow-hidden rounded-[inherit] [--shimmer-button-glint:var(--background)] [--shimmer-button-ring:color-mix(in_oklch,var(--primary)_60%,var(--foreground))] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] dark:[--shimmer-button-glint:var(--foreground)] dark:[--shimmer-button-ring:color-mix(in_oklch,var(--primary)_55%,var(--background))] z-20"
        style={ringStyle}
      >
        <span className="absolute inset-y-0 left-0 w-[300%] animate-shimmer-button bg-[linear-gradient(110deg,var(--shimmer-button-ring)_40%,var(--shimmer-button-glint)_50%,var(--shimmer-button-ring)_60%)] motion-reduce:translate-x-[-33.333%] motion-reduce:animate-none rtl:[animation-direction:reverse]" />
      </span>
    );

    const baseMotionClasses =
      'duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] focus-visible:scale-[1.03] active:scale-[0.98] motion-reduce:focus-visible:scale-100 motion-reduce:hover:scale-100 motion-reduce:active:scale-100';

    // 1. Custom Render Prop Handler
    if (render) {
      const mergedProps: Record<string, unknown> = {
        className: cn(baseMotionClasses, className),
        style,
        disabled: disabled && !focusableWhenDisabled ? true : undefined,
        'aria-disabled': disabled ? true : undefined,
        onClick: disabled && !focusableWhenDisabled ? undefined : onClick,
        children: (
          <>
            {ringElement}
            {nativeButton ? (
              <span className="relative inline-flex items-center justify-center gap-[inherit]">
                {children}
              </span>
            ) : (
              children
            )}
          </>
        ),
        ...props,
      };

      if (typeof render === 'function') {
        return render(mergedProps, { disabled: Boolean(disabled) });
      }
      if (React.isValidElement(render)) {
        return React.cloneElement(render, mergedProps);
      }
    }

    // 2. Non-native button (for example, wrapping or rendering as a card/div)
    if (!nativeButton) {
      const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (onClick as unknown as React.MouseEventHandler<HTMLDivElement>)?.(
            e as unknown as React.MouseEvent<HTMLDivElement>
          );
        }
        (onKeyDown as unknown as React.KeyboardEventHandler<HTMLDivElement>)?.(e);
      };

      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="button"
          tabIndex={disabled && !focusableWhenDisabled ? -1 : 0}
          aria-disabled={disabled ? true : undefined}
          onClick={disabled ? undefined : (onClick as unknown as React.MouseEventHandler<HTMLDivElement>)}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative',
            baseMotionClasses,
            disabled && 'pointer-events-none opacity-50',
            className
          )}
          style={style}
          {...(props as unknown as React.HTMLAttributes<HTMLDivElement>)}
        >
          {ringElement}
          {children}
        </div>
      );
    }

    // 3. Native Button Element (wrapping @/components/ui/button)
    return (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        variant={variant}
        size={size}
        disabled={disabled && !focusableWhenDisabled}
        aria-disabled={disabled ? true : undefined}
        onClick={disabled && !focusableWhenDisabled ? undefined : onClick}
        onKeyDown={onKeyDown}
        className={cn('relative overflow-hidden', baseMotionClasses, className)}
        style={style}
        {...props}
      >
        {ringElement}
        <span className="relative inline-flex items-center justify-center gap-[inherit]">
          {children}
        </span>
      </Button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
