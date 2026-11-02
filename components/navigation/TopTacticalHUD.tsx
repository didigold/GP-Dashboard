'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Layers,
  BarChart3,
  GitCompare,
  Trophy,
  AlertTriangle,
  Compass,
  Disc,
  Zap,
  Calendar,
  ShieldCheck,
  Users,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Full catalogue retained for CommandPalette and full index searches
export const NAV_ITEMS = [
  { name: 'Live Timing', href: '/live-timing', icon: Radio, isLive: true },
  { name: 'Teams', href: '/teams', icon: ShieldCheck },
  { name: 'Riders', href: '/riders', icon: Users },
  { name: 'Lean & Gyro', href: '/lean-telemetry', icon: Compass },
  { name: 'Tyre Thermals', href: '/tyres-asymmetry', icon: Disc },
  { name: 'Braking Zones', href: '/braking-zones', icon: Zap },
  { name: 'Sprint vs GP', href: '/race-pace', icon: BarChart3 },
  { name: 'Head to Head', href: '/head-to-head', icon: GitCompare },
  { name: '3D Track', href: '/track-map', icon: Layers },
  { name: 'Stats', href: '/standings', icon: Trophy },
  { name: 'Calendar', href: '/schedule', icon: Calendar },
  { name: 'Incidents', href: '/gravel-trap', icon: AlertTriangle },
  { name: 'Design System', href: '/design-system', icon: Sparkles },
];

export function TopTacticalHUD() {
  const pathname = usePathname();
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gridTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic scroll listener for blur background animation as content slides below
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close telemetry dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setTelemetryOpen(false);
        setStatsOpen(false);
        setGridOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menus on route change
  useEffect(() => {
    setTelemetryOpen(false);
    setStatsOpen(false);
    setGridOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatsOpen(false);
    setGridOpen(false);
    setTelemetryOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setTelemetryOpen(false);
    }, 200);
  };

  const handleStatsEnter = () => {
    if (statsTimeoutRef.current) clearTimeout(statsTimeoutRef.current);
    setTelemetryOpen(false);
    setGridOpen(false);
    setStatsOpen(true);
  };

  const handleStatsLeave = () => {
    statsTimeoutRef.current = setTimeout(() => {
      setStatsOpen(false);
    }, 200);
  };

  const handleGridEnter = () => {
    if (gridTimeoutRef.current) clearTimeout(gridTimeoutRef.current);
    setTelemetryOpen(false);
    setStatsOpen(false);
    setGridOpen(true);
  };

  const handleGridLeave = () => {
    gridTimeoutRef.current = setTimeout(() => {
      setGridOpen(false);
    }, 200);
  };

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const isTelemetryActive = [
    '/lean-telemetry',
    '/tyres-asymmetry',
    '/braking-zones',
    '/track-map',
    '/gravel-trap',
  ].some((path) => pathname === path || pathname.startsWith(path + '/'));

  const isStatsActive = ['/standings', '/driver-stats', '/head-to-head', '/race-pace', '/history'].some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  const isGridActive = ['/riders', '/teams'].some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  return (
    <div className="sticky top-0 z-50 w-full select-none" ref={menuContainerRef}>
      {/* Top Bar - Apple minimalist style with logo and search closer to tabs */}
      <header
        className={`w-full h-12 transition-all duration-300 ${
          telemetryOpen || statsOpen || gridOpen
            ? 'bg-[#0B0B0C] border-none shadow-none'
            : isScrolled
            ? 'bg-[#0B0B0C]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl'
            : 'bg-[#0B0B0C]/75 backdrop-blur-xl border-b border-white/[0.06]'
        }`}
      >
        <div className="w-full h-full flex items-center justify-between sm:justify-center px-4 sm:px-6">
          {/* Centered tight cluster: Logo + Tabs + Search Icon */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
            {/* Left: MotoGP Logo Mark (Closer to tabs as requested) */}
            <Link
              href="/"
              className="flex items-center text-white hover:opacity-85 transition-opacity py-1 shrink-0"
              aria-label="MotoGP Pitwall Home"
            >
              <span className="font-sans font-black text-sm tracking-tighter text-white">
                Moto<span className="text-[#E10600]">GP</span>™
              </span>
            </Link>

            {/* Center: Apple-style pure text tabs (NO borders, NO pill containers) */}
            <nav
              aria-label="Global Navigation"
              className="hidden md:flex items-center gap-7 lg:gap-8 text-[12px] font-normal tracking-normal text-neutral-300"
            >
              <Link
                href="/"
                className={`transition-colors duration-200 hover:text-white ${
                  pathname === '/' ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                Overview
              </Link>

              <Link
                href="/live-timing"
                className={`transition-colors duration-200 hover:text-white flex items-center gap-1.5 ${
                  pathname === '/live-timing' ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                <span>Live Timing</span>
              </Link>

              {/* Stats Tab with Apple-style Mega-Menu Trigger */}
              <div
                className="relative py-3 cursor-pointer"
                onMouseEnter={handleStatsEnter}
                onMouseLeave={handleStatsLeave}
                onClick={() => setStatsOpen(!statsOpen)}
              >
                <span
                  className={`transition-colors duration-200 hover:text-white flex items-center gap-1 ${
                    isStatsActive || statsOpen ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Stats
                </span>
              </div>

              <Link
                href="/schedule"
                className={`transition-colors duration-200 hover:text-white ${
                  pathname.startsWith('/schedule') ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                Calendar
              </Link>

              {/* Grid Tab with Apple-style Mega-Menu Trigger */}
              <div
                className="relative py-3 cursor-pointer"
                onMouseEnter={handleGridEnter}
                onMouseLeave={handleGridLeave}
                onClick={() => setGridOpen(!gridOpen)}
              >
                <span
                  className={`transition-colors duration-200 hover:text-white flex items-center gap-1 ${
                    isGridActive || gridOpen ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Grid
                </span>
              </div>

              {/* Telemetry Tab with Apple-style Mega-Menu Trigger */}
              <div
                className="relative py-3 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setTelemetryOpen(!telemetryOpen)}
              >
                <span
                  className={`transition-colors duration-200 hover:text-white flex items-center gap-1 ${
                    isTelemetryActive || telemetryOpen ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Telemetry
                </span>
              </div>
            </nav>

            {/* Right: Search Icon (Closer to tabs as requested, white icon, no label) */}
            <button
              onClick={triggerCommandPalette}
              aria-label="Search telemetry & grid"
              className="p-1.5 text-neutral-400 hover:text-white transition-colors duration-200 shrink-0"
              title="Search (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* APPLE-STYLE MEGA DROPDOWN (Same color as topnav, no top separator, smooth in & out animation) */}
      <AnimatePresence>
        {telemetryOpen && (
          <>
            {/* Dimmed backdrop covering content below */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-12 z-40 bg-black/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setTelemetryOpen(false)}
            />

            {/* Fullscreen Categorized Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-12 left-0 w-full z-50 bg-[#0B0B0C]/95 backdrop-blur-3xl border-b border-white/[0.08] shadow-2xl py-10 px-6 sm:px-12"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 font-sans">
                {/* Column 1: Dynamics & IMU */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Dynamics &amp; IMU
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/lean-telemetry"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Lean Angle &amp; Gyro</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        68.2° gyroscopic sensor traces &amp; roll rates
                      </p>
                    </Link>

                    <Link
                      href="/braking-zones"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Braking Deceleration</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Brembo 1.83G forces, 14.1 Bar master cylinder
                      </p>
                    </Link>

                    <Link
                      href="/track-map"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>3D Circuit Simulator</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Interactive WebGL circuit mesh &amp; apex data
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Tyres & Race Pace */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Tyres &amp; Degradation
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/tyres-asymmetry"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Tyre Thermals</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Michelin asymmetric carcass temperature deltas
                      </p>
                    </Link>

                    <Link
                      href="/race-pace"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Sprint vs GP Pace</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Lap-by-lap tyre degradation &amp; median curves
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Analysis & Incidents */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Analysis &amp; Incidents
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/head-to-head"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Head to Head</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sector delta split comparison between rivals
                      </p>
                    </Link>

                    <Link
                      href="/gravel-trap"
                      className="block group"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Incident Crash Ledger</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Fall analysis, turn frequency &amp; repair bills
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 4: Quick Telemetry Links */}
                <div className="space-y-4 border-l border-white/[0.08] pl-6 hidden md:block">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Live Operations
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/live-timing"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      Live Sector Splits →
                    </Link>
                    <Link
                      href="/standings"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      World Championship Table →
                    </Link>
                    <Link
                      href="/schedule"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      2026 Season Calendar →
                    </Link>
                    <Link
                      href="/design-system"
                      className="block text-xs font-semibold text-neutral-400 hover:text-white transition-colors pt-2"
                      onClick={() => setTelemetryOpen(false)}
                    >
                      Design Tokens &amp; System →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* STATS MEGA DROPDOWN */}
      <AnimatePresence>
        {statsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-12 z-40 bg-black/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setStatsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-12 left-0 w-full z-50 bg-[#0B0B0C]/95 backdrop-blur-3xl border-b border-white/[0.08] shadow-2xl py-10 px-6 sm:px-12"
              onMouseEnter={handleStatsEnter}
              onMouseLeave={handleStatsLeave}
            >
              <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 font-sans">
                {/* Column 1: Championships */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Championships
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/standings"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Driver Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Live points, ranking evolution &amp; season plots
                      </p>
                    </Link>

                    <Link
                      href="/standings/constructors"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Constructor Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Manufacturer points aggregated across the grid
                      </p>
                    </Link>

                    <Link
                      href="/standings/teams"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Team Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Championship points per team entry
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Performance */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Performance
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/driver-stats"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Driver Stats</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sprint vs Sunday splits, finish distributions &amp; telemetry radar
                      </p>
                    </Link>

                    <Link
                      href="/race-pace"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Race Pace</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sprint vs Grand Prix pace &amp; tyre degradation
                      </p>
                    </Link>

                    <Link
                      href="/race-pace#consistency"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Consistency</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Lap-time deviation &amp; championship pace deltas
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Comparisons */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Comparisons
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/head-to-head"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Head to Head</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sector-by-sector rider duels &amp; deltas
                      </p>
                    </Link>

                    <Link
                      href="/history"
                      className="block group"
                      onClick={() => setStatsOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Season History</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Past championship results and archives
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 4: Live Operations */}
                <div className="space-y-4 border-l border-white/[0.08] pl-6 hidden md:block">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Live Operations
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/live-timing"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setStatsOpen(false)}
                    >
                      Live Timing →
                    </Link>
                    <Link
                      href="/schedule"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setStatsOpen(false)}
                    >
                      2026 Season Calendar →
                    </Link>
                    <Link
                      href="/riders"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setStatsOpen(false)}
                    >
                      Full Rider Grid →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GRID MEGA DROPDOWN (Matches Telemetry & Stats) */}
      <AnimatePresence>
        {gridOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-12 z-40 bg-black/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setGridOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-12 left-0 w-full z-50 bg-[#0B0B0C]/95 backdrop-blur-3xl border-b border-white/[0.08] shadow-2xl py-10 px-6 sm:px-12"
              onMouseEnter={handleGridEnter}
              onMouseLeave={handleGridLeave}
            >
              <div className="w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 font-sans">
                {/* Column 1: Riders */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Riders &amp; Grid
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/riders"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Riders Directory</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        All 22 premier class riders, bios &amp; career stats
                      </p>
                    </Link>

                    <Link
                      href="/driver-stats"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Driver Stats &amp; Radar</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sprint vs Sunday, finish distribution &amp; telemetry
                      </p>
                    </Link>

                    <Link
                      href="/head-to-head"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Head-to-Head Duels</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Teammate qualifying &amp; race pace comparisons
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Teams & Constructors */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Teams &amp; Paddock
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/teams"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Teams Paddock</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        11 official MotoGP teams &amp; prototype bikes
                      </p>
                    </Link>

                    <Link
                      href="/teams/ducati-lenovo-team"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Ducati Lenovo Team</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Desmosedici GP25 factory engineering powerhouse
                      </p>
                    </Link>

                    <Link
                      href="/teams/red-bull-ktm-factory-racing"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Red Bull KTM Factory</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        KTM RC16 factory squad with Acosta &amp; Binder
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Championships */}
                <div className="space-y-4">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Championships
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/standings"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Driver Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Official 2026 World Championship standings
                      </p>
                    </Link>

                    <Link
                      href="/standings/constructors"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Constructor Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Manufacturer points &amp; specs comparison
                      </p>
                    </Link>

                    <Link
                      href="/standings/teams"
                      className="block group"
                      onClick={() => setGridOpen(false)}
                    >
                      <div className="text-sm font-bold text-white group-hover:text-[#FF2A24] transition-colors flex items-center justify-between">
                        <span>Team Standings</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E10600]" />
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Championship points accumulated per garage
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 4: Grid Operations */}
                <div className="space-y-4 border-l border-white/[0.08] pl-6 hidden md:block">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400">
                    Grid Operations
                  </div>
                  <div className="space-y-2.5">
                    <Link
                      href="/live-timing"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setGridOpen(false)}
                    >
                      Live Timing Tower →
                    </Link>
                    <Link
                      href="/schedule"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setGridOpen(false)}
                    >
                      2026 Season Calendar →
                    </Link>
                    <Link
                      href="/track-map"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setGridOpen(false)}
                    >
                      3D Track Simulator →
                    </Link>
                    <Link
                      href="/gravel-trap"
                      className="block text-xs font-semibold text-white hover:text-[#FF2A24] transition-colors"
                      onClick={() => setGridOpen(false)}
                    >
                      Incident Crash Ledger →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0B0B0C]/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium"
            >
              Overview
            </Link>
            <Link
              href="/live-timing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-white font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
              Live Timing
            </Link>
            <Link
              href="/standings"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium"
            >
              Stats
            </Link>
            <Link
              href="/schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium"
            >
              Calendar
            </Link>
            <Link
              href="/riders"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium"
            >
              Riders Grid
            </Link>
            <Link
              href="/teams"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-medium"
            >
              Teams &amp; Bikes
            </Link>
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Telemetry Suites
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/lean-telemetry"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Lean &amp; Gyro
              </Link>
              <Link
                href="/tyres-asymmetry"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Tyre Thermals
              </Link>
              <Link
                href="/braking-zones"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Braking Zones
              </Link>
              <Link
                href="/track-map"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                3D Track Map
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Stats &amp; Standings
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/standings"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Driver Standings
              </Link>
              <Link
                href="/standings/constructors"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Constructors
              </Link>
              <Link
                href="/standings/teams"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Teams
              </Link>
              <Link
                href="/driver-stats"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Driver Stats
              </Link>
              <Link
                href="/head-to-head"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Head to Head
              </Link>
              <Link
                href="/race-pace"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                Race Pace
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-neutral-200"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
