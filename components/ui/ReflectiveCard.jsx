'use client';

import React, { memo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { FingerPrintIcon } from '@hugeicons/core-free-icons';
import { Fingerprint } from 'lucide-react';
import { useMagicBentoEffect, parseRgb } from './MagicBentoCard';

import './ReflectiveCard.css';
import './MagicBento.css';

const THEMES = {
  dark: {
    '--rc-base': '#1d1c22',
    '--rc-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--rc-ink': '#f4f4f5',
    '--rc-muted': 'rgba(244, 244, 245, 0.65)',
    '--rc-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--rc-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--rc-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--rc-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--rc-rim': 'rgba(255, 255, 255, 0.07)',
    '--rc-rim-highlight': 'rgba(255, 255, 255, 0.1)'
  },
  light: {
    '--rc-base': '#e7e7ea',
    '--rc-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
    '--rc-ink': '#18181b',
    '--rc-muted': 'rgba(244, 244, 27, 0.65)',
    '--rc-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--rc-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--rc-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--rc-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
    '--rc-rim': 'rgba(24, 24, 27, 0.08)',
    '--rc-rim-highlight': 'rgba(255, 255, 255, 0.8)'
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toPx = value => {
  if (typeof value === 'number') return `${value}px`;
  return value;
};

const parseColor = value => {
  const text = String(value || '').trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16) / 255);
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
  if (rgb) return [rgb[1], rgb[2], rgb[3]].map(channel => clamp(parseFloat(channel) / 255, 0, 1));
  return [1, 1, 1];
};

const ReflectiveCard = ({
  name = 'Alexander Doe',
  role = 'Senior Developer',
  badge = 'Verified',
  badgeIcon = null,
  status = 'Active',
  statusColor = '#22c55e',
  showStatusDot = false,
  idLabel = null,
  idValue = '8901 2345 6789',
  children,
  theme = 'dark',
  tint = '#ffffff',
  glowColor = '225, 6, 0',
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 340,
  enableTilt = true,
  tiltStrength = 2,
  width = '100%',
  height = 520,
  radius = 24,
  className = '',
  style,
  // Custom driver, team & head-to-head extensions
  bgNumber,
  bgNumColor: customBgNumColor,
  bgNumOpacity: customBgNumOpacity,
  imageSrc,
  imageAlt,
  isBike = false,
  cardHref,
  tileIcon,
  tileHref,
  tileTitle,
  clashBadge = false,
  onTileClick,
  hoverDrivers
}) => {
  const router = useRouter();
  const rootRef = useRef(null);
  const bodyRef = useRef(null);

  const palette = theme === 'light' ? 'light' : 'dark';
  const corner = Math.max(0, radius);
  const rgb = parseColor(tint);

  // Boost contrast specifically for dark navy teams (Trackhouse #003399, Yamaha Factory #001968, Pramac #002B7F)
  const isDarkNavy =
    (rgb[2] > 0.35 && rgb[0] < 0.15 && rgb[1] < 0.25) ||
    Boolean(tint && ['#001968', '#003399', '#002b7f'].includes(String(tint).toLowerCase()));
  // Boost contrast for dark maroon / burgundy teams like Aprilia (#800020)
  const isDarkRed =
    Boolean(tint && ['#800020', '#990400', '#5c0017', '#6b001a'].includes(String(tint).toLowerCase())) ||
    (rgb[0] > 0.35 && rgb[0] < 0.65 && rgb[1] < 0.15 && rgb[2] < 0.25);
  const bgNumColor = customBgNumColor || (isDarkNavy ? '#38bdf8' : isDarkRed ? '#C92A2A' : (tint || '#ffffff'));
  const bgNumOpacity = customBgNumOpacity !== undefined ? customBgNumOpacity : (isDarkNavy ? 0.30 : isDarkRed ? 0.23 : 0.18);
  const teamGlow = isDarkRed ? 'rgba(201, 42, 42, 0.22)' : `${tint || '#ffffff'}40`;

  const resolvedGlowRgb = parseRgb(glowColor) ?? [225, 6, 0];

  // Hook up the MotoGP Magic Bento interactive spotlight, dynamic border glow, and click wave effect
  useMagicBentoEffect(bodyRef, {
    glowColor: glowColor || '225, 6, 0',
    spotlightRadius,
    enableBorderGlow,
    enableSpotlight,
    enableTilt,
    tiltStrength,
    clickEffect: true,
  });

  const cardStyle = {
    ...THEMES[palette],
    '--rc-width': toPx(width),
    '--rc-height': toPx(height),
    '--rc-radius': `${corner}px`,
    '--rc-pad': `${Math.round(clamp(corner * 0.8, 16, 22))}px`,
    '--rc-tile-radius': `${Math.round(clamp(corner * 0.5, 8, 14))}px`,
    '--rc-status': statusColor,
    '--rc-team-color': tint || '#ffffff',
    '--rc-team-glow': teamGlow,
    '--rc-bg-num-color': bgNumColor,
    '--rc-bg-num-opacity': bgNumOpacity,
    '--mb-glow-rgb': resolvedGlowRgb.join(', '),
    '--mb-spot-size': `${spotlightRadius}px`,
    '--mb-border-size': `${Math.round(spotlightRadius * 0.75)}px`,
    '--mb-spot-alpha': '0.08',
    '--mb-glow-alpha': '0.85',
    '--mb-edge': 'rgba(255, 255, 255, 0.08)',
    '--mb-highlight': 'rgba(255, 255, 255, 0.08)',
    '--rc-base': tint
      ? `radial-gradient(circle at 50% 12%, ${tint}48 0%, ${tint}18 50%, #0d0c11 100%)`
      : THEMES[palette]['--rc-base'],
    '--rc-rim': tint ? `${tint}50` : THEMES[palette]['--rc-rim'],
    '--rc-rim-highlight': tint ? `${tint}95` : THEMES[palette]['--rc-rim-highlight'],
    '--rc-tile': tint
      ? `linear-gradient(180deg, ${tint}40 0%, #17151e 100%)`
      : THEMES[palette]['--rc-tile'],
    '--rc-tile-edge': tint ? `${tint}40` : THEMES[palette]['--rc-tile-edge'],
    '--rc-shadow': tint
      ? `0 24px 48px -20px ${tint}35, 0 8px 24px -10px rgba(0, 0, 0, 0.7)`
      : THEMES[palette]['--rc-shadow']
  };

  const renderBadgeIcon = () => {
    if (badgeIcon === null || badgeIcon === false) return null;
    if (badgeIcon) {
      if (React.isValidElement(badgeIcon)) return badgeIcon;
      if (typeof badgeIcon === 'function' || (typeof badgeIcon === 'object' && badgeIcon.$$typeof)) {
        const IconComponent = badgeIcon;
        return <IconComponent className="w-4 h-4" />;
      }
      if (Array.isArray(badgeIcon)) {
        return <HugeiconsIcon icon={badgeIcon} size={16} strokeWidth={1.8} />;
      }
      return null;
    }
    return null;
  };

  const renderTileIcon = () => {
    if (tileIcon) {
      if (React.isValidElement(tileIcon)) return tileIcon;
      if (typeof tileIcon === 'function' || (typeof tileIcon === 'object' && tileIcon.$$typeof)) {
        const IconComponent = tileIcon;
        return <IconComponent className="w-5 h-5" />;
      }
      if (Array.isArray(tileIcon)) {
        return <HugeiconsIcon icon={tileIcon} size={22} strokeWidth={1.8} />;
      }
    }
    if (FingerPrintIcon && Array.isArray(FingerPrintIcon)) {
      return <HugeiconsIcon icon={FingerPrintIcon} size={22} strokeWidth={1.6} />;
    }
    return <Fingerprint className="w-5 h-5 text-white/80" />;
  };

  const handleCardClick = (e) => {
    if (!cardHref) return;
    if (e.target.closest('a') || e.target.closest('button')) return;
    router.push(cardHref);
  };

  const hasTile = Boolean(tileHref || onTileClick || tileIcon);

  return (
    <div
      ref={rootRef}
      onClick={handleCardClick}
      className={`reflective-card ${cardHref ? 'reflective-card--clickable liquid-glass-card' : ''} ${hasTile ? 'reflective-card--has-tile' : ''} ${className}`.trim()}
      style={{ ...cardStyle, ...style }}
    >
      <div ref={bodyRef} className="reflective-card__body">
        {/* Magic Bento Interactive Spotlight */}
        {enableSpotlight && <span className="magic-bento__light" aria-hidden="true" />}

        {/* Oversized Background Racing Number / Watermark (Zooms on hover) */}
        {bgNumber !== undefined && bgNumber !== null && (
          <div className="reflective-card__bg-number" aria-hidden="true">
            {bgNumber}
          </div>
        )}

        {/* Driver Hero Cutout Image OR Official Prototype Bike Image */}
        {imageSrc && (
          <div className="reflective-card__driver-bottom-wrap" aria-hidden="true">
            <img
              src={imageSrc}
              alt={imageAlt || name || 'Photo'}
              className={isBike ? 'reflective-card__bike-bottom-img' : 'reflective-card__driver-bottom-img'}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="reflective-card__driver-vignette" />
          </div>
        )}

        <div className="reflective-card__content">
          {children ?? (
            <>
              {(badge || status) && (
                <div className="reflective-card__header">
                  {badge && (
                    <span className="reflective-card__badge">
                      {renderBadgeIcon()}
                      {badge}
                    </span>
                  )}
                  {status && (
                    <span className="reflective-card__status">
                      {showStatusDot && <span className="reflective-card__dot" />}
                      {status}
                    </span>
                  )}
                </div>
              )}

              {/* Center space where cutout / bike sits */}
              <div className="flex-1" />

              <div className="reflective-card__identity">
                {name && <h3 className="reflective-card__name">{name}</h3>}
                {role && <div className="reflective-card__role">{role}</div>}
                {hoverDrivers && hoverDrivers.length > 0 && (
                  <div className="reflective-card__hover-drivers" aria-label="Team Lineup">
                    <span className="reflective-card__hover-drivers-label">RIDERS</span>
                    <div className="reflective-card__hover-drivers-list">
                      {hoverDrivers.map((d) => (
                        <span
                          key={d.id || d.number}
                          className="reflective-card__hover-driver-pill"
                          onClick={(e) => {
                            if (d.url) {
                              e.stopPropagation();
                              router.push(d.url);
                            }
                          }}
                        >
                          <span className="reflective-card__hover-driver-flag">{d.flag}</span>
                          <span className="font-bold">#{d.number}</span>
                          <span className="reflective-card__hover-driver-name">
                            {d.initial && d.surname ? (
                              <>
                                <span className="font-normal opacity-90">{d.initial}</span>
                                <span className="font-bold">{d.surname}</span>
                              </>
                            ) : (
                              <span className="text-white/85 font-normal">{d.name}</span>
                            )}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(idLabel || idValue) && (
                  <div className="reflective-card__footer">
                    <div className="reflective-card__id">
                      {idLabel && <span className="reflective-card__label">{idLabel}</span>}
                      {idValue && <span className="reflective-card__value">{idValue}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Right Tile: Head-to-Head Clash / VS Icon (no red pill) */}
              {(tileHref || onTileClick || tileIcon) && (
                <div className="reflective-card__tile-wrap">
                  {tileHref ? (
                    <Link
                      href={tileHref}
                      className="reflective-card__tile reflective-card__tile--interactive"
                      title={tileTitle || 'Head to Head Clash'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTileClick?.(e);
                      }}
                    >
                      {renderTileIcon()}
                      {clashBadge && <span className="reflective-card__clash-indicator">VS</span>}
                    </Link>
                  ) : (
                    <span
                      className={`reflective-card__tile ${onTileClick ? 'reflective-card__tile--interactive' : ''}`}
                      title={tileTitle}
                      onClick={onTileClick}
                      role={onTileClick ? 'button' : undefined}
                      tabIndex={onTileClick ? 0 : undefined}
                    >
                      {renderTileIcon()}
                      {clashBadge && <span className="reflective-card__clash-indicator">VS</span>}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Magic Bento Interactive Rim & Dynamic Glowing Border */}
        <span className="magic-bento__rim" aria-hidden="true" />
        {enableBorderGlow && <span className="magic-bento__border" aria-hidden="true" />}
      </div>
    </div>
  );
};

export { ReflectiveCard };
export default memo(ReflectiveCard);
