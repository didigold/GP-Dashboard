'use client';

import React from 'react';
import Link from 'next/link';
import { MOTOGP_TEAMS, MOTOGP_RIDERS, GridRider } from '@/lib/data/motogp-grid';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { Users } from 'lucide-react';

const TEAM_COUNTRY_ISOS: Record<string, string> = {
  'ducati-lenovo-team': 'IT',
  'aprilia-racing': 'IT',
  'red-bull-ktm-factory-racing': 'AT',
  'superfile-trackhouse-motogp': 'US',
  'pertamina-enduro-vr46': 'IT',
  'bk8-gresini-racing-motogp': 'IT',
  'red-bull-ktm-tech3': 'FR',
  'monster-energy-yamaha-motogp': 'JP',
  'prima-pramac-yamaha-motogp': 'IT',
  'honda-hrc-castrol': 'JP',
  'pro-honda-lcr': 'MC',
};

export default function TeamsPage() {
  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 space-y-6 select-none font-sans">
      {/* Centered Button Pilled Group: Drivers vs Teams */}
      <div className="w-full flex items-center justify-center pt-1 pb-1">
        <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-lg">
          <Link
            href="/riders"
            className="px-7 py-2 rounded-full text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-all"
          >
            Drivers ({MOTOGP_RIDERS.length})
          </Link>
          <button
            className="px-7 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white text-black shadow-md scale-[1.02] transition-all"
          >
            Teams ({MOTOGP_TEAMS.length})
          </button>
        </div>
      </div>

      {/* Grid of Reflective Team Cards with Official Prototype Bikes */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch">
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

          const teamCountryIso = TEAM_COUNTRY_ISOS[team.id] || 'IT';
          const topSpeed = team.specs.top_speed.split('(')[0].trim();
          const hpPower = team.specs.power.replace('>', '').split('at')[0].trim();

          const teamRiders: GridRider[] = MOTOGP_RIDERS.filter(
            (r) => r.team_id === team.id || team.rider_ids?.includes(r.id)
          );
          const hoverDrivers = teamRiders.map((r) => ({
            id: r.id,
            name: `${r.name[0]}. ${r.surname}`,
            number: r.number,
            flag: <CountryFlag iso={r.country.iso} width={15} height={10} />,
            url: `/driver-stats?rider=${r.id}`,
          }));

          return (
            <div key={team.id} className="w-full flex justify-center">
              <ReflectiveCard
                name={
                  <span className="inline-flex items-center gap-2">
                    <span>{team.short_name}</span>
                    <CountryFlag iso={teamCountryIso} width={18} height={12} />
                  </span>
                }
                role={team.bike_name}
                badge={
                  <span className="inline-flex items-center gap-2 font-bold tracking-wider text-xs">
                    <CountryFlag iso={teamCountryIso} width={18} height={12} />
                    <span>{team.constructor}</span>
                  </span>
                }
                badgeIcon={null}
                status={`${team.type} Team`}
                showStatusDot={false}
                idLabel="MAX SPEED · POWER"
                idValue={`${topSpeed} · ${hpPower}`}
                bgNumber={bikeShortName}
                imageSrc={team.logo_url}
                imageAlt={team.bike_name}
                isBike={true}
                cardHref={`/teams/${team.slug}`}
                tileIcon={Users}
                tileHref={`/teams/${team.slug}`}
                tileTitle={`Team Lineup · View ${team.short_name}`}
                clashBadge={false}
                hoverDrivers={hoverDrivers}
                theme="dark"
                tint={team.color}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
