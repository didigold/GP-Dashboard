'use client';

import React from 'react';
import Link from 'next/link';
import { MOTOGP_TEAMS, MOTOGP_RIDERS, GridRider } from '@/lib/data/motogp-grid';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { getRiderPillParts } from '@/lib/utils/rider-name';
import { GiSpeedometer, GiPowerLightning, GiFullMotorcycleHelmet, GiVibratingShield } from 'react-icons/gi';
import { motion, type Variants } from 'framer-motion';

const CONSTRUCTOR_COUNTRY_ISOS: Record<string, string> = {
  Ducati: 'IT',
  Aprilia: 'IT',
  KTM: 'AT',
  Yamaha: 'JP',
  Honda: 'JP',
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.04,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function TeamsPage() {
  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 space-y-6 select-none font-sans">
      {/* Centered Button Pilled Group: Drivers vs Teams */}
      <div className="w-full relative z-10 flex items-center justify-center pt-1 pb-1">
        <div className="h-9 p-0.5 inline-flex items-center rounded-full liquid-glass-pill shadow-lg">
          <Link
            href="/riders"
            className="h-full px-3.5 sm:px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 text-neutral-400 hover:text-white transition-all"
          >
            <GiFullMotorcycleHelmet className="w-4 h-4 shrink-0" />
            <span>Riders</span>
          </Link>
          <button
            className="h-full px-3.5 sm:px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white text-black shadow-md transition-all cursor-default"
          >
            <GiVibratingShield className="w-4 h-4 shrink-0" />
            <span>Teams</span>
          </button>
        </div>
      </div>

      {/* Grid of Reflective Team Cards with Official Prototype Bikes */}
      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch"
      >
        {MOTOGP_TEAMS.map((team) => {
          const bikeShortName = team.bike_name.includes('GP25')
            ? 'GP25'
            : team.bike_name.includes('GP24')
            ? 'GP24'
            : team.bike_name.includes('RS-GP')
            ? 'RS25'
            : team.bike_name.includes('RC16')
            ? 'RC16'
            : team.bike_name.includes('YZR-M1')
            ? 'M1'
            : team.bike_name.includes('RC213V')
            ? 'RCV'
            : team.constructor.toUpperCase().slice(0, 4);

          const constructorCountryIso = CONSTRUCTOR_COUNTRY_ISOS[team.constructor] || 'IT';
          const topSpeedRaw = team.specs.top_speed.split('(')[0].trim();
          const speedMatch = topSpeedRaw.match(/([\d.]+)\s*(.*)/);
          const speedVal = speedMatch ? speedMatch[1] : topSpeedRaw;
          const speedUnit = speedMatch ? speedMatch[2] : 'km/h';

          const hpPowerRaw = team.specs.power.replace('>', '').split('at')[0].trim();
          const powerMatch = hpPowerRaw.match(/([\d.]+)\s*(.*)/);
          const powerVal = powerMatch ? powerMatch[1] : hpPowerRaw;
          const powerUnit = powerMatch ? powerMatch[2] : 'hp';

          const teamRiders: GridRider[] = MOTOGP_RIDERS.filter(
            (r) => r.team_id === team.id || team.rider_ids?.includes(r.id)
          );
          const hoverDrivers = teamRiders.map((r) => {
            const { initial, surname } = getRiderPillParts(r.name, r.surname);
            return {
              id: r.id,
              name: `${initial}${surname}`,
              initial,
              surname,
              number: r.number,
              flag: <CountryFlag iso={r.country.iso} width={15} height={10} />,
              url: `/driver-stats?rider=${r.id}`,
            };
          });

          const isApriliaTeam = team.id === 'aprilia-racing';
          const teamBgNumColor = isApriliaTeam ? '#C92A2A' : undefined;
          const teamBgNumOpacity = isApriliaTeam ? 0.24 : undefined;

          return (
            <motion.div
              key={team.id}
              variants={cardItemVariants}
              className="w-full flex justify-center"
            >
              <ReflectiveCard
                name={team.short_name}
                role={team.bike_name}
                badge={
                  <span className="inline-flex items-center gap-2 font-bold tracking-wider text-xs">
                    <CountryFlag iso={constructorCountryIso} width={18} height={12} />
                    <span>{team.constructor}</span>
                  </span>
                }
                badgeIcon={null}
                status={`${team.type} Team`}
                showStatusDot={false}
                idLabel={undefined}
                idValue={
                  <div className="flex items-center gap-3 sm:gap-3.5 font-sans text-white">
                    <span
                      className="flex items-center gap-1.5"
                      title={`Top Speed: ${speedVal} ${speedUnit}`}
                    >
                      <GiSpeedometer className="w-6 h-6 text-white shrink-0 drop-shadow-sm" />
                      <span className="flex items-baseline gap-0.5">
                        <span className="text-white font-sans text-xl sm:text-2xl font-black leading-none tracking-tight">
                          {speedVal}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-normal text-white/60 tracking-tight">
                          {speedUnit}
                        </span>
                      </span>
                    </span>
                    <span
                      className="flex items-center gap-1.5"
                      title={`Power: ${powerVal} ${powerUnit}`}
                    >
                      <GiPowerLightning className="w-5 h-5 text-white shrink-0 drop-shadow-sm" />
                      <span className="flex items-baseline gap-0.5">
                        <span className="text-white font-sans text-xl sm:text-2xl font-black leading-none tracking-tight">
                          {powerVal}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-normal text-white/60 tracking-tight">
                          {powerUnit}
                        </span>
                      </span>
                    </span>
                  </div>
                }
                bgNumber={bikeShortName}
                bgNumColor={teamBgNumColor}
                bgNumOpacity={teamBgNumOpacity}
                imageSrc={team.logo_url}
                imageAlt={team.bike_name}
                isBike={true}
                cardHref={`/teams/${team.slug}`}
                hoverDrivers={hoverDrivers}
                theme="dark"
                tint={team.color}
                glowColor="225, 6, 0"
                enableBorderGlow={true}
                enableSpotlight={true}
                spotlightRadius={340}
                metalness={0.92}
                roughness={0.28}
                blurStrength={6}
                shine={1.2}
                glare={0.5}
                enableTilt={true}
                tiltStrength={2}
                width="100%"
                height={520}
                radius={24}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
