import { EvolutionDataset } from '@/lib/data/standings-evolution';

interface StandingsKpisProps {
  dataset: EvolutionDataset;
  label: string;
}

export function StandingsKpis({ dataset, label }: StandingsKpisProps) {
  const drivers = dataset.drivers;
  if (drivers.length === 0) return null;

  const leader = drivers[0];
  const runnerUp = drivers[1];
  const gap = runnerUp ? leader.points - runnerUp.points : 0;

  const mostWins = [...drivers].sort((a, b) => b.wins - a.wins)[0];
  const form = drivers
    .map((driver) => ({
      driver,
      total: (dataset.perRound[driver.id] ?? []).slice(-5).reduce((sum, value) => sum + value, 0),
    }))
    .sort((a, b) => b.total - a.total)[0];

  const cards = [
    {
      label: `${label} Leader`,
      value: leader.shortName,
      sub: `${leader.points} pts`,
      accent: leader.color,
    },
    {
      label: 'P1 – P2 Gap',
      value: `${gap}`,
      sub: runnerUp ? `to ${runnerUp.shortName}` : 'No challenger',
      accent: '#E10600',
    },
    {
      label: 'Most Wins',
      value: `${mostWins.wins}`,
      sub: mostWins.shortName,
      accent: '#F59E0B',
    },
    {
      label: 'Best Form (Last 5)',
      value: `${form.total}`,
      sub: `${form.driver.shortName} pts`,
      accent: '#22D3EE',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 font-sans">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl liquid-glass-card p-4 shadow-xl transition-all relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: card.accent }}
              aria-hidden="true"
            />
            <span className="truncate">{card.label}</span>
          </div>
          <div className="mt-1.5 truncate text-2xl font-bold tracking-tight text-white">
            {card.value}
          </div>
          <div className="mt-0.5 truncate text-xs text-neutral-400">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
