'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/frontend/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  shortLabel?: React.ReactNode;
}

/**
 * Helper to extract icons and label even if callers pass icons inside children.
 * Ensures leading icon, label, and trailing icon are separate flex children in ONE row.
 */
function extractChildrenContent(
  children: React.ReactNode,
  iconProp?: React.ReactNode,
  trailingIconProp?: React.ReactNode
) {
  if (iconProp !== undefined || trailingIconProp !== undefined) {
    return {
      leadingIcon: iconProp,
      label: children,
      trailingIcon: trailingIconProp
    };
  }

  const childArray = React.Children.toArray(children);
  if (childArray.length <= 1) {
    return {
      leadingIcon: undefined,
      label: children,
      trailingIcon: undefined
    };
  }

  const isIconLike = (item: React.ReactNode): boolean => {
    if (!React.isValidElement(item)) return false;
    const el = item as React.ReactElement<Record<string, unknown>>;
    if (typeof el.type === 'string' && el.type.toLowerCase() === 'svg') return true;
    const typeObj = el.type as { displayName?: string; name?: string };
    const name = typeObj?.displayName || typeObj?.name || '';
    if (name && (name.includes('Icon') || name.includes('Lucide') || el.props?.strokeWidth || el.props?.size)) {
      return true;
    }
    // Element with w- and h- classes and no text children
    if (el.props?.className && typeof el.props.className === 'string' && el.props.className.includes('w-') && el.props.className.includes('h-')) {
      if (!el.props.children || typeof el.props.children !== 'string') {
        return true;
      }
    }
    return false;
  };

  let leadingIcon: React.ReactNode = undefined;
  let trailingIcon: React.ReactNode = undefined;
  let middle = [...childArray];

  if (isIconLike(middle[0])) {
    leadingIcon = middle[0];
    middle = middle.slice(1);
  }

  if (middle.length > 0 && isIconLike(middle[middle.length - 1])) {
    trailingIcon = middle[middle.length - 1];
    middle = middle.slice(0, -1);
  }

  return {
    leadingIcon,
    label: middle.length === 1 ? middle[0] : middle,
    trailingIcon
  };
}

/**
 * Shared Button Component
 * - Base classes: inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap select-none leading-none
 * - Icons: 16px (14px in sm), shrink-0, display block, no margin hacks, strictly 1 row
 * - Label: single <span> with whitespace-nowrap (never wraps)
 * - Radius: 12px
 * - Sizes: sm (h-8 px-3 text-[13px]), md (h-10 px-4 text-sm), lg (h-12 px-6 text-base)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      trailingIcon,
      shortLabel,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-[13px] gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0',
      md: 'h-10 px-4 text-sm gap-2 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0',
      lg: 'h-12 px-6 text-base gap-2.5 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:block [&_svg]:m-0'
    }[size];

    const variantClasses = {
      primary:
        'btn-gold-gradient text-white border-0 shadow-[0_2px_8px_rgba(201,131,16,0.18)] hover:brightness-105 active:scale-[0.99]',
      gold:
        'btn-gold-gradient text-white border-0 shadow-[0_2px_8px_rgba(201,131,16,0.18)] hover:brightness-105 active:scale-[0.99]',
      secondary:
        'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--chip-bg)]/40 hover:border-[var(--gold)]/50 active:scale-[0.99] shadow-[0_1px_4px_rgba(201,131,16,0.06)]',
      outline:
        'bg-transparent text-[var(--gold)] border border-[var(--gold)] hover:bg-[var(--chip-bg)]/30 active:scale-[0.99]',
      ghost:
        'bg-transparent text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--chip-bg)]/25 border-0 active:scale-[0.99]'
    }[variant];

    const { leadingIcon, label, trailingIcon: extractedTrailing } = extractChildrenContent(
      children,
      icon,
      trailingIcon
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex flex-row items-center justify-center whitespace-nowrap select-none leading-none rounded-[12px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none w-auto shrink-0',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {leadingIcon && (
          <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
            {leadingIcon}
          </span>
        )}

        {shortLabel ? (
          <>
            <span className="whitespace-nowrap leading-none truncate-none hidden sm:inline">
              {label}
            </span>
            <span className="whitespace-nowrap leading-none truncate-none sm:hidden">
              {shortLabel}
            </span>
          </>
        ) : (
          <span className="whitespace-nowrap leading-none truncate-none">
            {label}
          </span>
        )}

        {extractedTrailing && (
          <span className="shrink-0 flex items-center justify-center leading-none [&>svg]:block [&>svg]:shrink-0 [&>svg]:m-0">
            {extractedTrailing}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { IconButton } from './IconButton';
export { LinkButton } from './LinkButton';
