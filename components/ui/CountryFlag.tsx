import React from 'react';

interface CountryFlagProps {
  iso: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function CountryFlag({
  iso,
  width = 20,
  height = 14,
  className = '',
}: CountryFlagProps) {
  const code = (iso || '').toUpperCase().trim();

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '2.5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
    flexShrink: 0,
    verticalAlign: 'middle',
  };

  switch (code) {
    case 'ES': // Spain
      return (
        <span style={containerStyle} className={className} title="Spain">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#aa151b" d="M0 0h640v480H0z" />
            <path fill="#f1bf00" d="M0 120h640v240H0z" />
            <path fill="#aa151b" d="M0 360h640v120H0z" />
            {/* Coat of arms simplified silhouette */}
            <g transform="translate(180, 160) scale(0.65)">
              <rect x="0" y="20" width="80" height="90" rx="10" fill="#aa151b" stroke="#fff" strokeWidth="6" />
              <circle cx="40" cy="65" r="16" fill="#f1bf00" />
              <path d="M10 20 L40 0 L70 20 Z" fill="#f1bf00" />
            </g>
          </svg>
        </span>
      );

    case 'IT': // Italy
      return (
        <span style={containerStyle} className={className} title="Italy">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#009246" d="M0 0h213.3v480H0z" />
            <path fill="#ffffff" d="M213.3 0h213.4v480H213.3z" />
            <path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
          </svg>
        </span>
      );

    case 'FR':
    case 'FRA': // France
      return (
        <span style={containerStyle} className={className} title="France">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#002395" d="M0 0h213.3v480H0z" />
            <path fill="#ffffff" d="M213.3 0h213.4v480H213.3z" />
            <path fill="#ed2939" d="M426.7 0H640v480H426.7z" />
          </svg>
        </span>
      );

    case 'JP': // Japan
      return (
        <span style={containerStyle} className={className} title="Japan">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0 0h640v480H0z" />
            <circle cx="320" cy="240" r="135" fill="#bc002d" />
          </svg>
        </span>
      );

    case 'AT': // Austria
      return (
        <span style={containerStyle} className={className} title="Austria">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#ed2939" d="M0 0h640v160H0z" />
            <path fill="#ffffff" d="M0 160h640v160H0z" />
            <path fill="#ed2939" d="M0 320h640v160H0z" />
          </svg>
        </span>
      );

    case 'US':
    case 'USA': // United States
      return (
        <span style={containerStyle} className={className} title="United States">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#bd3d44" d="M0 0h640v480H0z" />
            <path stroke="#ffffff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
            <path fill="#192f5d" d="M0 0h260v258.5H0z" />
            <g fill="#ffffff">
              <circle cx="50" cy="50" r="14" />
              <circle cx="130" cy="50" r="14" />
              <circle cx="210" cy="50" r="14" />
              <circle cx="90" cy="115" r="14" />
              <circle cx="170" cy="115" r="14" />
              <circle cx="50" cy="180" r="14" />
              <circle cx="130" cy="180" r="14" />
              <circle cx="210" cy="180" r="14" />
            </g>
          </svg>
        </span>
      );

    case 'ZA': // South Africa
      return (
        <span style={containerStyle} className={className} title="South Africa">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#de3831" d="M0 0h640v240H0z" />
            <path fill="#002395" d="M0 240h640v240H0z" />
            <path fill="#ffffff" d="M0 0l280 240L0 480v-40l233.3-200L0 40z" />
            <path fill="#007a4d" d="M0 40l233.3 200L0 440h640v-80H315L151.7 240 315 120h325V40z" />
            <path fill="#ffb612" d="M0 80l186.7 160L0 400z" />
            <path fill="#000000" d="M0 115l145.8 125L0 365z" />
          </svg>
        </span>
      );

    case 'AU': // Australia
      return (
        <span style={containerStyle} className={className} title="Australia">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#00008b" d="M0 0h640v480H0z" />
            <path fill="#00247d" d="M0 0h320v240H0z" />
            <path stroke="#ffffff" strokeWidth="40" d="M0 0l320 240M320 0L0 240" />
            <path stroke="#cf142b" strokeWidth="24" d="M0 0l320 240M320 0L0 240" />
            <path fill="#ffffff" d="M136 0h48v240h-48zM0 96h320v48H0z" />
            <path fill="#cf142b" d="M144 0h32v240h-32zM0 104h320v32H0z" />
            <circle cx="160" cy="360" r="28" fill="#ffffff" />
            <circle cx="480" cy="380" r="16" fill="#ffffff" />
            <circle cx="440" cy="260" r="16" fill="#ffffff" />
            <circle cx="480" cy="120" r="16" fill="#ffffff" />
            <circle cx="540" cy="210" r="16" fill="#ffffff" />
          </svg>
        </span>
      );

    case 'BR': // Brazil
      return (
        <span style={containerStyle} className={className} title="Brazil">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#009c3b" d="M0 0h640v480H0z" />
            <path fill="#ffdf00" d="M320 40L600 240 320 440 40 240z" />
            <circle cx="320" cy="240" r="110" fill="#002776" />
            <path fill="#ffffff" d="M213 255a115 115 0 0 1 214-30 110 110 0 0 0-214 30z" />
          </svg>
        </span>
      );

    case 'MC': // Monaco
      return (
        <span style={containerStyle} className={className} title="Monaco">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#ce1126" d="M0 0h640v240H0z" />
            <path fill="#ffffff" d="M0 240h640v240H0z" />
          </svg>
        </span>
      );

    case 'DE': // Germany
      return (
        <span style={containerStyle} className={className} title="Germany">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#000000" d="M0 0h640v160H0z" />
            <path fill="#dd0000" d="M0 160h640v160H0z" />
            <path fill="#ffce00" d="M0 320h640v160H0z" />
          </svg>
        </span>
      );

    case 'PT': // Portugal
      return (
        <span style={containerStyle} className={className} title="Portugal">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#046a38" d="M0 0h256v480H0z" />
            <path fill="#da291c" d="M256 0h384v480H256z" />
            <circle cx="256" cy="240" r="75" fill="#ffcd00" />
            <circle cx="256" cy="240" r="45" fill="#da291c" />
          </svg>
        </span>
      );

    case 'GB':
    case 'UK': // United Kingdom
      return (
        <span style={containerStyle} className={className} title="United Kingdom">
          <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none">
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path stroke="#ffffff" strokeWidth="70" d="M0 0l640 480M640 0L0 480" />
            <path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480" />
            <path fill="#ffffff" d="M260 0h120v480H260zM0 180h640v120H0z" />
            <path fill="#c8102e" d="M280 0h80v480h-80zM0 200h640v80H0z" />
          </svg>
        </span>
      );

    default:
      return (
        <span style={containerStyle} className={className} title={code}>
          <span className="text-[10px] font-bold text-neutral-300">🏁</span>
        </span>
      );
  }
}

export default CountryFlag;
