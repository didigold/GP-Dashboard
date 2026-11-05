'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { FrameContext } from './types';
import { FRAME_COMPONENTS, FRAME_META } from './frame-registry';

interface FrameSlotProps {
  slotIndex: number;
  contentType: string;
  ctx: FrameContext;
  onSwap: (from: number, to: number) => void;
  className?: string;
}

export function FrameSlot({ slotIndex, contentType, ctx, onSwap, className = '' }: FrameSlotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const meta = FRAME_META[contentType];
  const Content = FRAME_COMPONENTS[contentType];
  const Icon = meta?.icon;

  if (!Content || !meta) {
    return (
      <div className={`rounded-xl border border-dashed border-white/10 bg-[#0D0D0E]/60 ${className}`} />
    );
  }

  const isMap = contentType === 'track-map';

  return (
    <motion.div
      layout
      layoutId={`frame-${contentType}`}
      key={contentType}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      onDragOver={(e: any) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e: any) => {
        e.preventDefault();
        setIsOver(false);
        const from = parseInt(e.dataTransfer?.getData('text/plain') || '', 10);
        if (!Number.isNaN(from) && from !== slotIndex) onSwap(from, slotIndex);
      }}
      className={`relative rounded-xl border bg-[#0D0D0E]/90 shadow-xl flex flex-col overflow-hidden select-none font-sans transition-[border-color,opacity,box-shadow] duration-200 ${
        isDragging
          ? 'opacity-50 border-[#E10600] scale-[0.98]'
          : isOver
          ? 'border-[#00F5D4] ring-2 ring-[#00F5D4]/40'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      } ${className}`}
    >
      {/* Header (drag zone) */}
      <div
        draggable
        onDragStart={(e: any) => {
          setIsDragging(true);
          e.dataTransfer?.setData('text/plain', String(slotIndex));
          if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => setIsDragging(false)}
        className="flex items-center gap-2 px-3 pt-2 pb-1.5 shrink-0 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-3.5 h-3.5 text-neutral-500" />
        {Icon && <Icon className="w-4 h-4 text-white shrink-0" />}
        <h3 className="text-[11px] sm:text-xs font-bold text-white tracking-tight truncate">
          {meta.title}
        </h3>
        {contentType === 'track-map' && (
          <span className="text-[9px] text-neutral-500 truncate hidden md:inline">
            · {ctx.circuitName}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        <Content ctx={ctx} />
      </div>
    </motion.div>
  );
}
