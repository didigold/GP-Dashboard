'use client';

import React from 'react';

interface ConstructorLogoProps {
  constructor: string;
  className?: string;
  imgClassName?: string;
  invertYamaha?: boolean;
  opticalBalance?: boolean;
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
  invertYamaha = true,
  opticalBalance = false,
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

  let opticalImgClass = 'w-full h-full object-contain';
  if (opticalBalance) {
    if (norm.includes('aprilia')) {
      opticalImgClass = 'h-[14px] w-auto max-w-[32px] object-contain';
    } else if (norm.includes('ktm')) {
      opticalImgClass = 'h-[13px] w-auto max-w-[34px] object-contain';
    } else if (norm.includes('yamaha')) {
      opticalImgClass = 'h-[17px] w-[17px] object-contain';
    } else if (norm.includes('honda')) {
      opticalImgClass = 'h-[16px] w-auto max-w-[24px] object-contain';
    } else if (norm.includes('ducati')) {
      opticalImgClass = 'h-[17px] w-auto max-w-[19px] object-contain';
    }
  }

  return (
    <div
      className={`${opticalBalance ? 'w-full h-full' : className} flex items-center justify-center shrink-0 select-none`}
      title={alt}
    >
      <img
        src={src}
        alt={alt}
        className={`${opticalImgClass} ${
          isBoxed ? 'rounded-[2px] shadow-xs' : ''
        } ${imgClassName || ''}`}
        style={isYamaha ? { filter: invertYamaha ? 'brightness(0) invert(1)' : 'brightness(0)' } : undefined}
        loading="lazy"
      />
    </div>
  );
}
