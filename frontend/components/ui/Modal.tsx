'use client';

import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/frontend/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
  closeAriaLabel?: string;
  className?: string;
}

/**
 * Unified Modal / Bottom-Sheet Component
 * - Desktop: Centered dialog, width min(720px, 100vw - 32px), radius 24px, max-height 90dvh
 * - Mobile (<640px): Bottom-sheet drawer, rounded top 24px, max-height 92dvh, drag handle, swipe-down to close
 * - Focus trap, returns focus to trigger on close, Esc key closes, backdrop click closes
 * - Body scroll lock with scrollbar width compensation (iOS Safari supported)
 * - Overscroll containment (overscroll-behavior: contain)
 * - Smooth 180ms animations (respects prefers-reduced-motion)
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClassName,
  closeAriaLabel = 'Close modal',
  className
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchTranslate, setTouchTranslate] = useState<number>(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = `modal-title-${generatedId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle focus trap & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock body scroll with scrollbar compensation
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Set focus inside modal
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Mobile drag-down to close handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStart;
    if (diff > 0) {
      setTouchTranslate(diff);
    }
  };

  const handleTouchEnd = () => {
    if (touchTranslate > 90) {
      onClose();
    }
    setTouchStart(null);
    setTouchTranslate(0);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 z-50 flex items-end sm:items-center justify-center',
        // Backdrop: rgba of heading color at 40% + subtle blur (no heavy blur)
        'bg-[rgba(20,33,61,0.40)] backdrop-blur-[2px]',
        'duration-180 ease-out transition-opacity motion-reduce:transition-none'
      )}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        style={{
          transform: touchTranslate > 0 ? `translateY(${touchTranslate}px)` : undefined
        }}
        className={cn(
          'relative flex flex-col bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-2xl',
          'overscroll-contain transition-transform duration-180 ease-out motion-reduce:transition-none',
          // Mobile (<640px): bottom sheet, full width, max-height 92dvh, rounded top 24px, safe-area padding
          'w-full max-h-[92dvh] rounded-t-[24px] rounded-b-none pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-0',
          // Desktop (sm+): centered, width min(720px, 100vw - 32px), radius 24px, max-height 90dvh
          'sm:w-[min(720px,calc(100vw-32px))] sm:max-h-[90dvh] sm:rounded-[24px]',
          maxWidthClassName,
          className
        )}
      >
        {/* Mobile Drag Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="sm:hidden flex items-center justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="w-10 h-1.5 rounded-full bg-[var(--border)]" />
        </div>

        {/* Modal Header: Sticky at top */}
        {(title || subtitle) && (
          <div className="sticky top-0 z-10 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0 rounded-t-[24px]">
            <div className="min-w-0 flex-1">
              {title && (
                <h3
                  id={titleId}
                  className="font-serif font-bold text-base sm:text-lg text-[var(--heading)] leading-snug truncate"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate leading-normal">
                  {subtitle}
                </p>
              )}
            </div>

            {/* X button with 40px tap target */}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--chip-bg)] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Modal Body: Scrolls inside with overscroll-contain & thin scrollbar */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(201,131,16,0.3)_transparent]">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="sticky bottom-0 z-10 bg-[var(--surface)] border-t border-[var(--border)] px-4 sm:px-6 py-3 shrink-0 sm:rounded-b-[24px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export const Drawer = Modal;
