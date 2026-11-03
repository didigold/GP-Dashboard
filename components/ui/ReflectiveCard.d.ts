import React, { CSSProperties, ReactNode } from 'react';

export interface ReflectiveCardProps {
  /** Name shown on the card */
  name?: ReactNode | string;
  /** Role shown under the name */
  role?: string;
  /** Label or element of the badge in the top left corner */
  badge?: ReactNode | string;
  /** Optional custom icon or ReactNode for the badge in top left (pass null to suppress default icon) */
  badgeIcon?: ReactNode | any;
  /** Label of the status chip in the top right corner */
  status?: string;
  /** Color of the status dot */
  statusColor?: string;
  /** Whether to show the colored status dot in top right */
  showStatusDot?: boolean;
  /** Small label above the ID number */
  idLabel?: ReactNode;
  /** ID number / stats value shown in the footer */
  idValue?: ReactNode;
  /** Custom content for the card. Replaces the badge, name and footer */
  children?: ReactNode;
  /** Dark graphite or light silver metal, with matching text */
  theme?: 'dark' | 'light';
  /** Looping video the card reflects when the camera is off. Without one it reflects a soft studio */
  videoSrc?: string;
  /** Reflects the camera feed, mirrored. Asks for camera access and falls back to the video */
  webcam?: boolean;
  /** Called when camera access is denied or unavailable */
  onWebcamError?: (error: Error) => void;
  /** Color of the metal / team color */
  tint?: string;
  /** How strongly the surface mirrors the scene, from 0 to 1. At 0 the card turns matte */
  metalness?: number;
  /** Brushed grain of the metal, from 0 to 1. Stretches reflections along the grain */
  roughness?: number;
  /** Blur of the reflection, in px */
  blurStrength?: number;
  /** Removes color from the reflection, from 0 to 1. Lower it to see the scene in color */
  grayscale?: number;
  /** Gentle bends in the surface that ripple the reflection */
  warp?: number;
  /** Size of the bends */
  warpScale?: number;
  /** Brightness of the light band that sweeps across the card as it tilts */
  shine?: number;
  /** Width of the polished edge that catches the light, in px */
  bevel?: number;
  /** Strength of the light that follows the cursor, from 0 to 1 */
  glare?: number;
  /** Tilts the card toward the cursor */
  enableTilt?: boolean;
  /** Largest tilt angle, in degrees */
  tiltStrength?: number;
  /** Fades the card in and sweeps the light across it once */
  intro?: boolean;
  /** Width of the card. Numbers are in px */
  width?: number | string;
  /** Height of the card. Numbers are in px */
  height?: number | string;
  /** Corner radius, in px */
  radius?: number;
  /** Extra class names for the card */
  className?: string;
  /** Inline styles for the card */
  style?: CSSProperties;
  /** Oversized background number / watermark displayed behind the driver */
  bgNumber?: string | number;
  /** Custom color for the background racing number */
  bgNumColor?: string;
  /** Custom opacity for the background racing number */
  bgNumOpacity?: number;
  /** Driver image URL or motorcycle image URL displayed in the card */
  imageSrc?: string;
  /** Alt text for image */
  imageAlt?: string;
  /** Set to true if displaying a prototype motorcycle rather than a driver */
  isBike?: boolean;
  /** Optional destination route when clicking the card body */
  cardHref?: string;
  /** Custom icon or component for the bottom right tile (e.g. SwordsIcon / clash / vs) */
  tileIcon?: ReactNode | any;
  /** Optional link URL for the bottom right tile (e.g. /head-to-head?rider1=93) */
  tileHref?: string;
  /** Tooltip or title for the bottom right tile */
  tileTitle?: string;
  /** Whether to show a 'VS' indicator badge on the tile */
  clashBadge?: boolean;
  /** Callback when tile is clicked */
  onTileClick?: (e: React.MouseEvent) => void;
  /** Optional team drivers lineup displayed when hovering the card */
  hoverDrivers?: Array<{
    id?: string;
    name: string;
    number: number | string;
    flag: React.ReactNode | string;
    url?: string;
  }>;
}

declare const ReflectiveCard: React.NamedExoticComponent<ReflectiveCardProps>;

export { ReflectiveCard };
export default ReflectiveCard;
