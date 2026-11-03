'use client';

import React, { useState, useMemo } from 'react';
import { CHAMPIONSHIP_ROUNDS_2026, CircuitInfo } from '@/lib/data/circuits-data';
import { CircuitCard } from '@/components/calendar/CircuitCard';
import { ExpandedCircuitView } from '@/components/calendar/ExpandedCircuitView';
import { UnifiedCalendarMap } from '@/components/calendar/UnifiedCalendarMap';
import { CircuitDetailModal } from '@/components/circuit/CircuitDetailModal';
import { LayoutGrid, Columns, Search } from 'lucide-react';

export default function SchedulePage() {
  // Current selected circuit (autolocated on map)
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitInfo>(
    CHAMPIONSHIP_ROUNDS_2026.find((c) => c.status === 'CURRENT') || CHAMPIONSHIP_ROUNDS_2026[0]
  );

  // When non-null, this circuit is expanded to the left, hiding other cards but keeping the map
  const [expandedCircuit, setExpandedCircuit] = useState<CircuitInfo | null>(null);

  // Map view mode: 'globe' or 'track' (satellite zoom)
  const [mapMode, setMapMode] = useState<'globe' | 'track'>('globe');

  // Layout mode for cards list: '2-col' or '1-col'
  const [layoutMode, setLayoutMode] = useState<'2-col' | '1-col'>('2-col');

  // Filter: 'ALL' | 'FINISHED' | 'UPCOMING'
  const [filter, setFilter] = useState<'ALL' | 'FINISHED' | 'UPCOMING'>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Deep telemetry modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered rounds
  const filteredRounds = useMemo(() => {
    return CHAMPIONSHIP_ROUNDS_2026.filter((round) => {
      if (filter === 'FINISHED' && round.status !== 'FINISHED') return false;
      if (filter === 'UPCOMING' && round.status === 'FINISHED') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = round.name.toLowerCase().includes(query);
        const matchesCountry = round.country.toLowerCase().includes(query);
        const matchesOfficial = round.official_name.toLowerCase().includes(query);
        const matchesRound = `r${round.round_number}`.includes(query) || `${round.round_number}` === query;
        return matchesName || matchesCountry || matchesOfficial || matchesRound;
      }

      return true;
    });
  }, [filter, searchQuery]);

  const handleSelectCircuit = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
    if (expandedCircuit) {
      setExpandedCircuit(circuit);
    }
  };

  const handleExpandCircuit = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
    setExpandedCircuit(circuit);
  };

  const handleCollapse = () => {
    setExpandedCircuit(null);
    setTimeout(() => {
      const el = document.getElementById(`circuit-card-${selectedCircuit.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleFocusTrackZoom = () => {
    setMapMode('track');
  };

  const handleViewGlobe = () => {
    setMapMode('globe');
  };

  const handleOpenModal = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#060810] text-white font-sans select-none">
      {/* =========================================================================
          FULL-BLEED MAP VIEW
         ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <UnifiedCalendarMap
          selectedCircuit={selectedCircuit}
          onSelectCircuit={handleSelectCircuit}
          onOpenModal={handleOpenModal}
          mapMode={mapMode}
          onToggleMapMode={setMapMode}
        />
      </div>

      {/* =========================================================================
          FLOATING CIRCUIT CARDS PANEL
         ========================================================================= */}
      <div className="absolute z-30 flex flex-col overflow-hidden
                      left-3 right-3 bottom-3 top-auto max-h-[58vh]
                      lg:left-4 lg:right-auto lg:top-4 lg:bottom-4 lg:max-h-none lg:w-[400px] xl:w-[420px]
                      rounded-2xl bg-[#070913]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {expandedCircuit ? (
          <ExpandedCircuitView
            circuit={expandedCircuit}
            onCollapse={handleCollapse}
            onSelectCircuit={handleSelectCircuit}
            onFocusTrackZoom={handleFocusTrackZoom}
            onViewGlobe={handleViewGlobe}
            onOpenModal={handleOpenModal}
          />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header control bar */}
            <div className="p-3 sm:p-4 border-b border-white/[0.08] space-y-2.5 shrink-0 bg-[#070913]/90 backdrop-blur-md">
              {/* Row 1: Title + layout switcher */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                  <span className="font-sans font-extrabold text-white tracking-wider text-xs uppercase">
                    2026 Calendar
                  </span>
                  <span className="text-[11px] font-sans text-neutral-400">
                    ({CHAMPIONSHIP_ROUNDS_2026.length} Rounds)
                  </span>
                </div>

                <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setLayoutMode('2-col')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans transition-all ${
                      layoutMode === '2-col'
                        ? 'bg-white/20 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title="2-Column Cards Grid"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>2-Col</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode('1-col')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans transition-all ${
                      layoutMode === '1-col'
                        ? 'bg-white/20 text-white shadow-sm font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title="1-Column Full Width"
                  >
                    <Columns className="w-3 h-3" />
                    <span>1-Col</span>
                  </button>
                </div>
              </div>

              {/* Row 2: status filter + search */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] font-sans">
                  {(['ALL', 'FINISHED', 'UPCOMING'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        filter === s
                          ? 'bg-[#E10600] text-white font-bold'
                          : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s === 'FINISHED' ? 'Completed' : 'Upcoming'}
                    </button>
                  ))}
                </div>

                <div className="relative max-w-[140px] sm:max-w-[160px]">
                  <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search track..."
                    className="w-full bg-black/60 border border-white/10 rounded-md pl-6 pr-2 py-0.5 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable cards grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
              {filteredRounds.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 font-sans">
                  No circuits matching search criteria.
                </div>
              ) : (
                <div
                  className={`grid gap-3 ${
                    layoutMode === '2-col' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {filteredRounds.map((round) => (
                    <CircuitCard
                      key={round.id}
                      circuit={round}
                      isSelected={selectedCircuit.id === round.id}
                      onSelect={handleSelectCircuit}
                      onExpand={handleExpandCircuit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Circuit Detail Modal for in-depth engineering telemetry */}
      <CircuitDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        circuit={selectedCircuit}
      />
    </div>
  );
}
