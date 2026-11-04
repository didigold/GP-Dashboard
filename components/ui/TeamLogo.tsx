'use client';

import React from 'react';

interface TeamLogoProps {
  teamId?: string;
  constructorName?: string;
  className?: string;
}

export const TEAM_LOGOS: Record<string, { src: string; alt: string; containerStyle?: string }> = {
  'ducati-lenovo-team': {
    src: '/images/constructors/ducati.png',
    alt: 'Ducati Lenovo Team',
  },
  'aprilia-racing': {
    src: '/images/constructors/aprilia.webp',
    alt: 'Aprilia Racing',
    containerStyle: 'bg-white rounded-sm p-0.5 shadow-sm',
  },
  'red-bull-ktm-factory-racing': {
    src: '/images/constructors/ktm.jpg',
    alt: 'Red Bull KTM Factory Racing',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  'superfile-trackhouse-motogp': {
    src: '/images/constructors/SuperFile-MGP-Black-Outline_recky7.png',
    alt: 'Trackhouse MotoGP Team',
  },
  'pertamina-enduro-vr46': {
    src: '/images/constructors/11761.png',
    alt: 'Pertamina Enduro VR46 Racing Team',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  'bk8-gresini-racing-motogp': {
    src: '/images/constructors/sFzS7uV6_400x400.jpg',
    alt: 'Gresini Racing MotoGP',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  'red-bull-ktm-tech3': {
    src: '/images/constructors/tech3.png',
    alt: 'Red Bull KTM Tech3',
  },
  'monster-energy-yamaha-motogp': {
    src: '/images/constructors/yamaha.png',
    alt: 'Monster Energy Yamaha MotoGP',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  'prima-pramac-yamaha-motogp': {
    src: '/images/constructors/pramac.png',
    alt: 'Prima Pramac Yamaha MotoGP',
  },
  'honda-hrc-castrol': {
    src: '/images/constructors/honda.webp',
    alt: 'Honda HRC Castrol',
    containerStyle: 'bg-white rounded-sm p-0.5 shadow-sm',
  },
  'pro-honda-lcr': {
    src: '/images/constructors/honda.webp',
    alt: 'Pro Honda LCR',
    containerStyle: 'bg-white rounded-sm p-0.5 shadow-sm',
  },
};

export const CONSTRUCTOR_LOGOS: Record<string, { src: string; alt: string; containerStyle?: string }> = {
  Ducati: {
    src: '/images/constructors/ducati.png',
    alt: 'Ducati Corse',
  },
  Aprilia: {
    src: '/images/constructors/aprilia.webp',
    alt: 'Aprilia Racing',
    containerStyle: 'bg-white rounded-sm p-0.5 shadow-sm',
  },
  KTM: {
    src: '/images/constructors/ktm.jpg',
    alt: 'Red Bull KTM Factory Racing',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  Yamaha: {
    src: '/images/constructors/yamaha.png',
    alt: 'Monster Energy Yamaha MotoGP',
    containerStyle: 'rounded-sm overflow-hidden shadow-sm',
  },
  Honda: {
    src: '/images/constructors/honda.webp',
    alt: 'Honda HRC Racing',
    containerStyle: 'bg-white rounded-sm p-0.5 shadow-sm',
  },
};

export function getTeamLogoInfo(teamId?: string, constructorName?: string) {
  if (teamId && TEAM_LOGOS[teamId]) {
    return TEAM_LOGOS[teamId];
  }
  if (constructorName && CONSTRUCTOR_LOGOS[constructorName]) {
    return CONSTRUCTOR_LOGOS[constructorName];
  }
  return null;
}

export function TeamLogo({
  teamId,
  constructorName,
  className = 'h-4 w-5',
}: TeamLogoProps) {
  const info = getTeamLogoInfo(teamId, constructorName);

  if (!info) return null;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className} ${info.containerStyle || ''}`}
      title={info.alt}
    >
      <img
        src={info.src}
        alt={info.alt}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </span>
  );
}

export default TeamLogo;
