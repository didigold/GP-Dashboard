'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CHAMPIONSHIP_ROUNDS_2026 } from '@/lib/data/circuits-data';
import { MOTOGP_NEWS } from '@/lib/data/news-data';
import { UnifiedHeroScheduleCard } from '@/components/dashboard/UnifiedHeroScheduleCard';
import { CircuitHistoryCarousel } from '@/components/dashboard/CircuitHistoryCarousel';
import { DriverStandingsTop5 } from '@/components/dashboard/DriverStandingsTop5';
import { ConstructorStandingsTop5 } from '@/components/dashboard/ConstructorStandingsTop5';
import { CircuitDetailModal } from '@/components/circuit/CircuitDetailModal';
import MagicBento from '@/components/ui/MagicBento';
import {
  Clock,
  ArrowRight,
  ChevronRight,
  Newspaper,
} from 'lucide-react';

export default function HomePage() {
  const [circuitModalOpen, setCircuitModalOpen] = useState(false);

  // Petronas Sepang Circuit Data (Round 19)
  const sepangCircuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.round_number === 19) || CHAMPIONSHIP_ROUNDS_2026[2];

  const featuredNews = MOTOGP_NEWS[0];
  const sideNews = MOTOGP_NEWS.slice(1, 5);

  // Magic Bento Items for Overview Paddock Intelligence News (Proportioned to match top cards)
  const newsBentoItems = [
    {
      id: `featured-${featuredNews.id}`,
      colSpan: 2,
      rowSpan: 2,
      content: (
        <div className="w-full h-full flex flex-col justify-between gap-5 p-2 sm:p-3 group">
          <div className="h-60 sm:h-72 w-full relative overflow-hidden rounded-xl bg-neutral-900 shrink-0">
            <img
              src={featuredNews.imageUrl}
              alt={featuredNews.title}
              className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className="text-xs font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-lg"
                style={{
                  borderColor: `${featuredNews.categoryColor}60`,
                  backgroundColor: `${featuredNews.categoryColor}25`,
                  color: featuredNews.categoryColor,
                }}
              >
                {featuredNews.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-sans font-semibold border border-white/10 shadow-lg">
                Lead Story
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-[#E10600]" />
                <span>{featuredNews.publishedAt}</span>
                <span>·</span>
                <span>{featuredNews.readTime}</span>
                <span>·</span>
                <span className="text-neutral-300 font-semibold">{featuredNews.author}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-white leading-snug tracking-tight group-hover:text-[#FF2A24] transition-colors">
                {featuredNews.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-3">
                {featuredNews.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-sans text-[#E10600] font-semibold group-hover:text-white transition-colors">
              <span>Read Full Technical Briefing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      ),
    },
    ...sideNews.map((article) => ({
      id: `side-${article.id}`,
      colSpan: 1,
      rowSpan: 1,
      content: (
        <div className="w-full h-full flex flex-col justify-between p-2 sm:p-2.5 group">
          <div className="space-y-3">
            {/* Top Bar matching top cards */}
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  borderColor: `${article.categoryColor}50`,
                  backgroundColor: `${article.categoryColor}15`,
                  color: article.categoryColor,
                }}
              >
                {article.category}
              </span>
              <span className="text-xs font-sans text-neutral-400">
                {article.publishedAt}
              </span>
            </div>

            {/* Title matching top card proportions */}
            <h4 className="text-sm sm:text-base font-bold font-sans text-white leading-snug group-hover:text-[#FF2A24] transition-colors line-clamp-2">
              {article.title}
            </h4>

            {/* Narrative Summary matching top card body */}
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>

          {/* Footer matching top cards */}
          <div className="flex items-center justify-between text-xs font-sans text-neutral-400 pt-3 border-t border-white/[0.08] mt-3">
            <span className="truncate max-w-[65%]">{article.readTime} · {article.author.split('·')[0].trim()}</span>
            <span className="text-[#E10600] flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      ),
    })),
  ];

  return (
    <div className="w-full min-h-screen bg-[#07080B] text-white select-none">
      {/* =========================================================================
          FULL-VIEWPORT INITIAL SCREEN: HERO + 3 CARDS FILL 100% OF INITIAL VIEWPORT
          (News section sits below the fold so user scrolls down to see it)
         ========================================================================= */}
      <div className="min-h-[calc(100vh-48px)] flex flex-col justify-between">
        {/* SECTION 1: HERO SECTION WITH VIBRANT CIRCUIT IMAGE & UNIFIED SCHEDULE CARD */}
        <section className="relative w-full overflow-hidden flex-1 flex items-center pt-6 pb-4 lg:pt-10 lg:pb-6 px-4 sm:px-6">
          {/* Dynamic GP Hero Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 scale-100 filter saturate-110 contrast-105"
            style={{ backgroundImage: `url('/images/circuits/malaysia-sepang.avif')` }}
          />

          {/* Subtle cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-black/35 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

          <div className="relative z-10 max-w-[1560px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Circuit & GP Identity + Details CTA (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3 max-w-xl">
                  {/* Natural-case custom Sora typography */}
                  <div className="text-xs sm:text-sm font-sans font-medium tracking-normal text-neutral-300">
                    Petronas Sepang International Circuit · Round 19 of 22
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight text-white leading-[1.08]">
                    Petronas Grand Prix of <span className="text-[#E10600]">Malaysia</span>
                  </h1>
                </div>

                {/* Details Button - Full rounded button in white */}
                <div className="pt-1">
                  <Button
                    onClick={() => setCircuitModalOpen(true)}
                    className="rounded-full px-7 py-2.5 font-sans text-xs sm:text-sm font-semibold bg-white hover:bg-neutral-200 text-black border-0 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Unified Next Session Countdown & Weekend Timetable (7 Cols) */}
              <div className="lg:col-span-7 w-full self-start">
                <UnifiedHeroScheduleCard />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 3-COLUMN MAGIC BENTO (1/3 HISTORIC, 1/3 DRIVERS TOP 5, 1/3 CONSTRUCTORS TOP 5) */}
        <section className="relative w-full bg-[#0A0A0B] pt-4 pb-8 lg:pb-10 px-4 sm:px-6">
          <div className="max-w-[1560px] mx-auto">
            <MagicBento
              columns={3}
              rowHeight={370}
              gap={20}
              radius={20}
              theme="dark"
              glowColor="225, 6, 0"
              enableBorderGlow={true}
              enableSpotlight={true}
              spotlightRadius={340}
              clickEffect={true}
              items={[
                {
                  id: 'sepang-history',
                  colSpan: 1,
                  rowSpan: 1,
                  content: (
                    <CircuitHistoryCarousel className="w-full h-full bg-transparent border-0 p-1 sm:p-2 shadow-none flex flex-col justify-between" />
                  ),
                },
                {
                  id: 'driver-standings-top5',
                  colSpan: 1,
                  rowSpan: 1,
                  content: (
                    <DriverStandingsTop5 className="w-full h-full bg-transparent border-0 p-1 sm:p-2 shadow-none flex flex-col justify-start" />
                  ),
                },
                {
                  id: 'constructor-standings-top5',
                  colSpan: 1,
                  rowSpan: 1,
                  content: (
                    <ConstructorStandingsTop5 className="w-full h-full bg-transparent border-0 p-1 sm:p-2 shadow-none flex flex-col justify-start" />
                  ),
                },
              ]}
            />
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 3: NEWS & TECHNICAL REPORTS (Visible upon scrolling down)
         ========================================================================= */}
      <section className="bg-[#07080B] pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-[1560px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                Latest News &amp; Engineering Reports
              </h2>
              <p className="text-xs font-sans text-neutral-400 mt-0.5">
                Direct from MotoGP™ pitwall &amp; steward desks
              </p>
            </div>
            <span className="text-xs font-sans text-neutral-500">
              Updated hourly during Grand Prix weekends
            </span>
          </div>

          {/* Magic Bento News Grid (Proportioned to top cards) */}
          <MagicBento
            columns={3}
            rowHeight={250}
            gap={20}
            radius={20}
            theme="dark"
            glowColor="225, 6, 0"
            enableBorderGlow={true}
            enableSpotlight={true}
            spotlightRadius={340}
            clickEffect={true}
            items={newsBentoItems}
          />
        </div>
      </section>

      {/* =========================================================================
          CIRCUIT DETAIL MODAL (Opens when clicking "Details")
         ========================================================================= */}
      <CircuitDetailModal
        isOpen={circuitModalOpen}
        onClose={() => setCircuitModalOpen(false)}
        circuit={sepangCircuit}
      />
    </div>
  );
}
