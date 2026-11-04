'use client';

import React from 'react';

interface ConstructorLogoProps {
  constructor: string;
  className?: string;
  imgClassName?: string;
}

export const CONSTRUCTOR_FACTORY_LOGOS: Record<
  string,
  { src: string; alt: string; isYamaha?: boolean; isBoxed?: boolean }
> = {
  Ducati: {
    src: '/images/constructors/factory/ducati.webp',
    alt: 'Ducati',
  },
  Aprilia: {
    src: '/images/constructors/factory/aprilia.webp',
    alt: 'Aprilia',
    isBoxed: true,
  },
  KTM: {
    src: '/images/constructors/factory/ktm.webp',
    alt: 'KTM',
    isBoxed: true,
  },
  Yamaha: {
    src: '/images/constructors/factory/yamaha.webp',
    alt: 'Yamaha',
    isYamaha: true,
  },
  Honda: {
    src: '/images/constructors/factory/honda.webp',
    alt: 'Honda',
  },
};

export function ConstructorLogo({
  constructor,
  className = 'w-7 h-7',
  imgClassName,
}: ConstructorLogoProps) {
  const norm = (constructor || '').toLowerCase();

  let src = '';
  let alt = constructor;
  let isYamaha = false;
  let isBoxed = false;

  if (norm.includes('ducati')) {
    src = '/images/constructors/factory/ducati.webp';
    alt = 'Ducati';
  } else if (norm.includes('aprilia')) {
    src = '/images/constructors/factory/aprilia.webp';
    alt = 'Aprilia';
    isBoxed = true;
  } else if (norm.includes('ktm')) {
    src = '/images/constructors/factory/ktm.webp';
    alt = 'KTM';
    isBoxed = true;
  } else if (norm.includes('yamaha')) {
    src = '/images/constructors/factory/yamaha.webp';
    alt = 'Yamaha';
    isYamaha = true;
  } else if (norm.includes('honda')) {
    src = '/images/constructors/factory/honda.webp';
    alt = 'Honda';
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
      className={`${className} flex items-center justify-center shrink-0 select-none`}
      title={alt}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${
          isBoxed ? 'rounded-[3px] shadow-sm' : ''
        } ${isYamaha ? 'filter brightness-0 invert' : ''} ${imgClassName || ''}`}
        style={isYamaha ? { filter: 'brightness(0) invert(1)' } : undefined}
        loading="lazy"
      />
    </div>
  );
}
