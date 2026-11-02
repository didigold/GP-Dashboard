'use client';

import React from 'react';

interface ConstructorLogoProps {
  constructor: string;
  className?: string;
}

export function ConstructorLogo({ constructor, className = 'w-7 h-7' }: ConstructorLogoProps) {
  const norm = constructor.toLowerCase();

  let src = '';
  let alt = constructor;
  let containerStyle = 'bg-white/[0.06] border border-white/10';

  if (norm.includes('ducati')) {
    src = '/images/constructors/ducati.png';
    alt = 'Ducati Corse';
    containerStyle = 'bg-white/[0.04] border border-white/10 p-0.5';
  } else if (norm.includes('aprilia')) {
    src = '/images/constructors/aprilia.webp';
    alt = 'Aprilia Racing';
    containerStyle = 'bg-white border border-white/20 p-0.5';
  } else if (norm.includes('ktm')) {
    src = '/images/constructors/ktm.jpg';
    alt = 'Red Bull KTM Factory Racing';
    containerStyle = 'bg-[#001026] border border-orange-500/30 overflow-hidden';
  } else if (norm.includes('yamaha')) {
    src = '/images/constructors/yamaha.png';
    alt = 'Monster Energy Yamaha MotoGP';
    containerStyle = 'bg-black border border-blue-500/30 overflow-hidden';
  } else if (norm.includes('honda')) {
    src = '/images/constructors/honda.webp';
    alt = 'Honda HRC Racing';
    containerStyle = 'bg-white border border-white/20 p-0.5';
  }

  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center shrink-0 rounded bg-white/10 text-white font-bold text-xs`}
      >
        {constructor.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center shrink-0 rounded shadow-sm overflow-hidden ${containerStyle}`}
      title={alt}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}
