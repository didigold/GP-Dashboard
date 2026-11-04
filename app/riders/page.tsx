'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOTOGP_RIDERS, MOTOGP_TEAMS, getTeamBySlug, GridRider } from '@/lib/data/motogp-grid';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { abbreviateRiderName, getRiderPillParts } from '@/lib/utils/rider-name';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { ConstructorLogo } from '@/components/ui/ConstructorLogo';
import { Swords, Users, Search, X, SlidersHorizontal, Check, ArrowUpDown } from 'lucide-react';
import { GiLaurelCrown, GiTrophyCup, GiSpeedometer, GiPowerLightning, GiFullMotorcycleHelmet, GiVibratingShield } from 'react-icons/gi';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const CONSTRUCTOR_COUNTRY_ISOS: Record<string, string> = {
  Ducati: 'IT',
  Aprilia: 'IT',
  KTM: 'AT',
  Yamaha: 'JP',
  Honda: 'JP',
};

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

const COUNTRY_CODES_3: Record<string, string> = {
  ES: 'ESP',
  Spain: 'ESP',
  IT: 'ITA',
  Italy: 'ITA',
  FR: 'FRA',
  FRA: 'FRA',
  France: 'FRA',
  ZA: 'RSA',
  'South Africa': 'RSA',
  AU: 'AUS',
  Australia: 'AUS',
  JP: 'JPN',
  Japan: 'JPN',
  BR: 'BRA',
  Brazil: 'BRA',
  PT: 'POR',
  Portugal: 'POR',
  DE: 'GER',
  Germany: 'GER',
  GB: 'GBR',
  UK: 'GBR',
  'United Kingdom': 'GBR',
  US: 'USA',
  USA: 'USA',
  AT: 'AUT',
  Austria: 'AUT',
  MC: 'MCO',
  Monaco: 'MCO',
  TH: 'THA',
  Thailand: 'THA',
  MY: 'MAS',
  Malaysia: 'MAS',
  ID: 'INA',
  Indonesia: 'INA',
  QA: 'QAT',
  Qatar: 'QAT',
  NL: 'NED',
  Netherlands: 'NED',
};

function getCountryCode3(country: { iso: string; name?: string }): string {
  const isoUpper = (country.iso || '').toUpperCase().trim();
  if (COUNTRY_CODES_3[isoUpper]) return COUNTRY_CODES_3[isoUpper];
  if (country.name && COUNTRY_CODES_3[country.name]) return COUNTRY_CODES_3[country.name];
  return (country.name || country.iso || '').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
}

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
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

type AchievementFilter = 'all' | 'champions' | 'winners';
type SortOption = 'default' | 'titles' | 'wins' | 'age_young' | 'age_old' | 'number' | 'alpha';

export default function GridPage() {
  const [activeView, setActiveView] = useState<'drivers' | 'teams'>('drivers');

  // Filter Dropdown Open State
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [achievementFilter, setAchievementFilter] = useState<AchievementFilter>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const availableConstructors = ['all', 'Ducati', 'Aprilia', 'KTM', 'Yamaha', 'Honda'];

  // Filtered & Sorted Drivers
  const filteredRiders = useMemo(() => {
    let list = [...MOTOGP_RIDERS];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.surname.toLowerCase().includes(q) ||
          String(r.number).includes(q) ||
          r.team_name.toLowerCase().includes(q) ||
          r.constructor_name.toLowerCase().includes(q)
      );
    }

    // Achievement filter
    if (achievementFilter === 'champions') {
      list = list.filter((r) => r.stats.world_championships > 0);
    } else if (achievementFilter === 'winners') {
      list = list.filter((r) => r.stats.victories > 0);
    }

    // Team / Constructor filter
    if (teamFilter !== 'all') {
      list = list.filter(
        (r) =>
          r.constructor_name.toLowerCase() === teamFilter.toLowerCase() ||
          r.team_name.toLowerCase().includes(teamFilter.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'titles':
        list.sort(
          (a, b) =>
            b.stats.world_championships - a.stats.world_championships ||
            b.stats.victories - a.stats.victories
        );
        break;
      case 'wins':
        list.sort(
          (a, b) =>
            b.stats.victories - a.stats.victories ||
            b.stats.podiums - a.stats.podiums
        );
        break;
      case 'age_young':
        list.sort((a, b) => calculateAge(a.birth_date) - calculateAge(b.birth_date));
        break;
      case 'age_old':
        list.sort((a, b) => calculateAge(b.birth_date) - calculateAge(a.birth_date));
        break;
      case 'number':
        list.sort((a, b) => a.number - b.number);
        break;
      case 'alpha':
        list.sort((a, b) => a.surname.localeCompare(b.surname));
        break;
      case 'default':
      default:
        break;
    }

    return list;
  }, [searchQuery, achievementFilter, teamFilter, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== '') count++;
    if (achievementFilter !== 'all') count++;
    if (teamFilter !== 'all') count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [searchQuery, achievementFilter, teamFilter, sortBy]);

  const hasActiveFilters = activeFilterCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setAchievementFilter('all');
    setTeamFilter('all');
    setSortBy('default');
  };

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 space-y-6 select-none font-sans">
      {/* TOP HEADER: Centered Drivers vs Teams Central Pill + Single Round Dropdownable Filter Button on the Right */}
      <div className="w-full relative z-10 flex items-center justify-center pt-1 pb-1">
        {/* The Clean Central Pill */}
        <div className="h-9 p-0.5 inline-flex items-center rounded-full liquid-glass-pill shadow-lg">
          <button
            onClick={() => setActiveView('drivers')}
            className={`h-full px-3.5 sm:px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeView === 'drivers'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GiFullMotorcycleHelmet className="w-4 h-4 shrink-0" />
            <span>Riders</span>
          </button>
          <button
            onClick={() => setActiveView('teams')}
            className={`h-full px-3.5 sm:px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeView === 'teams'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GiVibratingShield className="w-4 h-4 shrink-0" />
            <span>Teams</span>
          </button>
        </div>

        {/* Single Round Filter Button on the Right (Dropdownable with Shadcn UI Popover) */}
        {activeView === 'drivers' && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
            <Popover open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  className={`relative h-9 px-3.5 sm:px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-xl cursor-pointer ${
                    hasActiveFilters || filterDropdownOpen
                      ? 'bg-white text-black shadow-white/10'
                      : 'liquid-glass-pill text-neutral-300 hover:text-white'
                  }`}
                  title="Filter & Sort Riders"
                  aria-label="Filter & Sort Riders"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#E10600] text-white text-[10px] font-bold flex items-center justify-center shrink-0 leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[330px] sm:w-[360px] p-4 rounded-2xl liquid-glass-dropdown shadow-[0_25px_65px_rgba(0,0,0,0.95)] z-30 space-y-3.5 font-sans text-white"
              >
                {/* Search Input - Unified h-9 height */}
                <div className="relative w-full h-9">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rider, #number, team..."
                    className="w-full h-9 pl-9 pr-8 rounded-full bg-[#1c1d25] border border-white/15 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-neutral-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter by Achievements - Unified h-9 Grouped Pill */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-neutral-300">
                    Achievements
                  </div>
                  <div className="w-full h-9 p-0.5 flex items-center rounded-full liquid-glass-pill bg-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => setAchievementFilter('all')}
                      className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        achievementFilter === 'all'
                          ? 'bg-white text-black shadow-sm font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAchievementFilter('champions')}
                      className={`flex-1 h-full flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        achievementFilter === 'champions'
                          ? 'bg-white text-black shadow-sm font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <GiLaurelCrown className="w-3.5 h-3.5 shrink-0" />
                      <span>Titles</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAchievementFilter('winners')}
                      className={`flex-1 h-full flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        achievementFilter === 'winners'
                          ? 'bg-white text-black shadow-sm font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <GiTrophyCup className="w-3.5 h-3.5 shrink-0" />
                      <span>Wins</span>
                    </button>
                  </div>
                </div>

                {/* Filter by Constructors - Unified h-9 Single Line Pill with Optically Balanced Logos */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-neutral-300">
                    Constructors
                  </div>
                  <div className="w-full h-9 p-0.5 flex items-center rounded-full liquid-glass-pill bg-white/[0.04]">
                    {availableConstructors.map((c) => {
                      const isActive = teamFilter === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setTeamFilter(c)}
                          title={c === 'all' ? 'All Constructors' : c}
                          aria-label={c === 'all' ? 'All Constructors' : c}
                          className={`flex-1 h-full flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-white text-black shadow-sm font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {c === 'all' ? (
                            <span className="text-xs font-semibold px-1">All</span>
                          ) : (
                            <ConstructorLogo
                              constructor={c}
                              opticalBalance={true}
                              invertYamaha={!isActive}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort Option (Combobox) - Unified h-9 height */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-neutral-300">
                    Sort By
                  </div>
                  <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                    <SelectTrigger className="w-full h-9 bg-[#1c1d25] border-white/15 text-xs text-white rounded-full px-3.5">
                      <SelectValue placeholder="Sort order..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Grid Order</SelectItem>
                      <SelectItem value="titles">World Titles (Most → Least)</SelectItem>
                      <SelectItem value="wins">GP Victories (Most → Least)</SelectItem>
                      <SelectItem value="age_young">Age (Youngest First)</SelectItem>
                      <SelectItem value="age_old">Age (Oldest First)</SelectItem>
                      <SelectItem value="number">Bike Number (#5 → #93)</SelectItem>
                      <SelectItem value="alpha">Alphabetical (Surname A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Footer Actions: Reset only (Removed 'Showing 17 of 17') */}
                {hasActiveFilters && (
                  <div className="pt-1 flex items-center justify-end text-xs">
                    <button
                      onClick={resetFilters}
                      className="text-[#E10600] hover:text-white font-semibold transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Grid of Reflective Cards (Animated Transition between Drivers and Teams) */}
      <AnimatePresence mode="wait">
        {activeView === 'drivers' ? (
          <motion.div
            key="drivers-grid"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch relative z-0"
          >
            {filteredRiders.map((rider) => {
              const team = getTeamBySlug(rider.team_id);
              const teamName = team?.short_name || rider.team_name;
              const age = calculateAge(rider.birth_date);

              // Aprilia drivers refined subtle watermark (visible without being overly bright)
              const isAprilia = rider.team_id === 'aprilia-racing';
              const cardTint = isAprilia ? '#800020' : rider.color;
              const bgNumberColor = isAprilia ? '#C92A2A' : undefined;
              const bgNumberOpacity = isAprilia ? 0.24 : undefined;

              return (
                <motion.div
                  key={rider.id}
                  variants={cardItemVariants}
                  className="w-full flex justify-center"
                >
                  <ReflectiveCard
                    name={rider.full_name}
                    role={
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <TeamLogo
                          teamId={rider.team_id}
                          constructorName={rider.constructor_name}
                          className="h-4 w-5"
                        />
                        <span className="truncate">{teamName}</span>
                      </span>
                    }
                    badge={
                      <span className="inline-flex items-center gap-2 font-bold tracking-wider text-xs">
                        <CountryFlag iso={rider.country.iso} width={18} height={12} />
                        <span>{getCountryCode3(rider.country)}</span>
                      </span>
                    }
                    badgeIcon={null}
                    status={`${age} years old`}
                    showStatusDot={false}
                    idLabel={undefined}
                    idValue={
                      <div className="flex items-center gap-3.5 sm:gap-4 font-sans text-white">
                        <span
                          className="flex items-center gap-1.5"
                          title={`${rider.stats.world_championships} World Titles`}
                        >
                          <GiLaurelCrown className="w-6 h-6 text-white shrink-0 drop-shadow-sm" />
                          <span className="text-white font-sans text-xl sm:text-2xl font-black leading-none tracking-tight">
                            {rider.stats.world_championships}
                          </span>
                        </span>
                        <span
                          className="flex items-center gap-1.5"
                          title={`${rider.stats.victories} Grand Prix Victories`}
                        >
                          <GiTrophyCup className="w-5 h-5 text-white shrink-0 drop-shadow-sm" />
                          <span className="text-white font-sans text-xl sm:text-2xl font-black leading-none tracking-tight">
                            {rider.stats.victories}
                          </span>
                        </span>
                      </div>
                    }
                    bgNumber={rider.number}
                    bgNumColor={bgNumberColor}
                    bgNumOpacity={bgNumberOpacity}
                    imageSrc={rider.photo_url}
                    imageAlt={rider.full_name}
                    cardHref={`/driver-stats?rider=${rider.id}`}
                    tileIcon={Swords}
                    tileHref={`/head-to-head?rider1=${rider.number}`}
                    tileTitle={`Head to Head Clash · Compare #${rider.number} ${rider.surname}`}
                    clashBadge={false}
                    theme="dark"
                    tint={cardTint}
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
        ) : (
          <motion.div
            key="teams-grid"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 xl:gap-6 items-stretch relative z-0"
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
        )}
      </AnimatePresence>
    </div>
  );
}
