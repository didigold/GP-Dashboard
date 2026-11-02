'use client';

import React, { useState } from 'react';
import { MOTOGP_RIDERS, MOTOGP_TEAMS, getTeamBySlug, GridRider } from '@/lib/data/motogp-grid';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { Swords, Users } from 'lucide-react';

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

function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 26;
  const birth = new Date(birthDateStr);
  const refDate = new Date('2026-11-02'); // Current 2026 MotoGP season
  let age = refDate.getFullYear() - birth.getFullYear();
  const m = refDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function GridPage() {
  const [activeView, setActiveView] = useState<'drivers' | 'teams'>('drivers');

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 space-y-6 select-none font-sans">
      {/* Centered Button Pilled Group: Drivers vs Teams */}
      <div className="w-full flex items-center justify-center pt-1 pb-1">
        <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-lg">
          <button
            onClick={() => setActiveView('drivers')}
            className={`px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeView === 'drivers'
                ? 'bg-white text-black shadow-md scale-[1.02]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Drivers ({MOTOGP_RIDERS.length})
          </button>
          <button
            onClick={() => setActiveView('teams')}
            className={`px-7 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeView === 'teams'
                ? 'bg-white text-black shadow-md scale-[1.02]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Teams ({MOTOGP_TEAMS.length})
          </button>
        </div>
      </div>

      {/* Grid of Reflective Cards (Full-Width, 1 to 6 columns on large screens) */}
      {activeView === 'drivers' ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch">
          {MOTOGP_RIDERS.map((rider) => {
            const team = getTeamBySlug(rider.team_id);
            const age = calculateAge(rider.birth_date);
            const topSpeed = team?.specs.top_speed.split('(')[0].trim() || '366.1 km/h';
            const hpPower = team?.specs.power.replace('>', '').split('at')[0].trim() || '300 hp';

            return (
              <div key={rider.id} className="w-full flex justify-center">
                <ReflectiveCard
                  name={
                    <span className="inline-flex items-center gap-2">
                      <span>{rider.full_name}</span>
                      <CountryFlag iso={rider.country.iso} width={18} height={12} />
                    </span>
                  }
                  role={`${team?.short_name || rider.team_name} · ${rider.bike_name}`}
                  badge={
                    <span className="inline-flex items-center gap-2 font-bold tracking-wider text-xs">
                      <CountryFlag iso={rider.country.iso} width={18} height={12} />
                      <span>#{rider.number}</span>
                    </span>
                  }
                  badgeIcon={null}
                  status={`${age} years old`}
                  showStatusDot={false}
                  idLabel="MAX SPEED · POWER"
                  idValue={`${topSpeed} · ${hpPower}`}
                  bgNumber={rider.number}
                  imageSrc={rider.photo_url}
                  imageAlt={rider.full_name}
                  cardHref={`/driver-stats?rider=${rider.id}`}
                  tileIcon={Swords}
                  tileHref={`/head-to-head?rider1=${rider.number}`}
                  tileTitle={`Head to Head Clash · Compare #${rider.number} ${rider.surname}`}
                  clashBadge={false}
                  theme="dark"
                  tint={rider.color}
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
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch">
          {MOTOGP_TEAMS.map((team) => {
            // Short badge identifier for the background
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
      )}
    </div>
  );
}
