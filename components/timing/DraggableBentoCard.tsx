'use client';

import React, { useRef } from 'react';
import { useMagicBentoEffect } from '@/components/ui/MagicBentoCard';
import { GripVertical, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { GiCardPick } from 'react-icons/gi';

interface DraggableBentoCardProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onHide?: (id: string) => void;
  headerRight?: React.ReactNode;
}

export function DraggableBentoCard({
  id,
  title,
  icon,
  subtitle,
  children,
  glowColor = '225, 6, 0',
  className = '',
  isDraggable = true,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onHide,
  headerRight,
}: DraggableBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);

  // Apply MotoGP Magic Bento interactive spotlight, dynamic border glow, and click wave
  useMagicBentoEffect(cardRef, {
    glowColor,
    spotlightRadius: 360,
    enableBorderGlow: true,
    enableSpotlight: true,
    enableTilt: false,
    clickEffect: true,
    spotAlpha: 0.08,
    glowAlpha: 0.9,
  });

  return (
    <div
      ref={cardRef}
      draggable={isDraggable && !isMaximized}
      onDragStart={(e) => onDragStart?.(e, id)}
      onDragOver={(e) => onDragOver?.(e, id)}
      onDragLeave={(e) => onDragLeave?.(e, id)}
      onDrop={(e) => onDrop?.(e, id)}
      onDragEnd={onDragEnd}
      className={`relative group rounded-2xl border transition-all duration-300 font-sans select-none overflow-hidden ${
        isDragging
          ? 'opacity-40 border-dashed border-[#E10600] scale-[0.98] shadow-2xl'
          : isDropTarget
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40 bg-neutral-900/90 scale-[1.01]'
          : 'border-neutral-800/90 bg-[#0B0D14] hover:border-neutral-700/90 shadow-xl'
      } ${isMaximized ? 'fixed inset-4 z-50 bg-[#07080B] p-4 flex flex-col' : ''} ${className}`}
    >
      {/* Magic Bento Internal Lighting DOM Layers */}
      <span className="magic-bento__light" aria-hidden="true" />
      <span className="magic-bento__rim" aria-hidden="true" />
      <span className="magic-bento__border" aria-hidden="true" />

      {/* Frame Header with Drag Handle, Game Icon, Title, and Actions */}
      <div className="px-4 py-2.5 bg-[#080A0F]/90 border-b border-neutral-800/80 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {isDraggable && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-colors flex items-center gap-1 group/handle"
              title="Drag frame to reorder in Bento grid"
            >
              <GripVertical className="w-4 h-4 text-neutral-400 group-hover/handle:text-[#E10600] transition-colors" />
              <GiCardPick className="w-3.5 h-3.5 text-neutral-500 group-hover/handle:text-[#E10600] transition-colors hidden sm:inline" />
            </div>
          )}

          {icon && <div className="text-[#E10600] shrink-0">{icon}</div>}

          <div>
            <h2 className="font-sans font-bold text-white text-sm sm:text-base tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] font-sans text-neutral-400 leading-none">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Frame Action Controls */}
        <div className="flex items-center gap-1.5 text-neutral-400">
          {headerRight}

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded-md hover:text-white hover:bg-neutral-800 transition-colors"
            title={isMaximized ? 'Restore frame size' : 'Maximize frame'}
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {onHide && (
            <button
              onClick={() => onHide(id)}
              className="p-1 rounded-md hover:text-rose-400 hover:bg-neutral-800 transition-colors"
              title="Hide this frame"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Frame Body Content */}
      <div className={`relative z-10 flex-1 ${isMaximized ? 'overflow-y-auto' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default DraggableBentoCard;
