import { MOCK_STANDINGS } from '@/lib/data/mock-race-data';
import { MOTOGP_TEAMS, getRiderByNumber } from '@/lib/data/motogp-grid';
import {
  EvolutionDataset,
  EvolutionDriver,
  aggregateStandingsEvolution,
} from '@/lib/data/standings-evolution';
import { abbreviateRiderName } from '@/lib/utils/rider-name';

export interface Season {
  year: number;
  id: string;
  label: string;
}

export const STANDINGS_SEASONS: Season[] = [
  { year: 2026, id: 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e', label: '2026 World Championship (Official Live)' },
  { year: 2025, id: 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4', label: '2025 Championship' },
  { year: 2024, id: 'dd12382e-1d9f-46ee-a5f7-c5104db28e43', label: '2024 World Championship' },
];

export const MOTOGP_CAT_ID = 'e8c110ad-64aa-4e8e-8a86-f2f152f6a942';
export const STANDINGS_ROUNDS = 20;

export interface StandingItem {
  id: string;
  position: number;
  rider: {
    id: string;
    full_name: string;
    number: number;
    country: { iso: string; name: string };
  };
  team: {
    id: string;
    name: string;
  };
  constructor: {
    id: string;
    name: string;
  };
  points: number;
  race_wins?: number;
  podiums?: number;
}

export interface EntityStanding {
  name: string;
  points: number;
  wins: number;
  podiums: number;
  riderIds: string[];
  riderNames: string[];
}

export type EntityKind = 'constructor' | 'team';

/** Stable key used to join classification rows with evolution series. */
export function standingId(item: StandingItem): string {
  return (
    item.rider?.id ||
    item.id ||
    String(item.rider?.number ?? item.rider?.full_name ?? '')
  );
}

export const INITIAL_STANDINGS: StandingItem[] = MOCK_STANDINGS.map((standing, index) => ({
  id: standing.rider.id || `standing-${index}`,
  position: standing.position,
  rider: {
    id: standing.rider.id || `r-${index}`,
    full_name: standing.rider.full_name,
    number: standing.rider.number,
    country: standing.rider.country,
  },
  team: { id: `team-${index}`, name: standing.team.name },
  constructor: { id: `const-${index}`, name: standing.constructor.name },
  points: standing.points,
  race_wins:
    standing.position === 1 ? 7 : standing.position === 2 ? 11 : standing.position === 3 ? 3 : 2,
  podiums:
    standing.position === 1 ? 16 : standing.position === 2 ? 16 : standing.position === 3 ? 10 : 8,
}));

export function teamColorByName(name?: string): string {
  const team = MOTOGP_TEAMS.find((entry) => entry.name.toLowerCase() === (name || '').toLowerCase());
  return team?.color ?? '#E10600';
}

export function constructorColorByName(name?: string): string {
  const team = MOTOGP_TEAMS.find(
    (entry) => entry.constructor.toLowerCase() === (name || '').toLowerCase()
  );
  return team?.color ?? '#E10600';
}

export function resolveTeamLogo(teamName?: string, constructorName?: string, riderNumber?: number): string {
  if (riderNumber) {
    const rider = getRiderByNumber(riderNumber);
    if (rider?.team_logo_url) return rider.team_logo_url;
  }
  const tName = (teamName || '').toLowerCase();
  const cName = (constructorName || '').toLowerCase();
  const team = MOTOGP_TEAMS.find(
    (entry) =>
      entry.name.toLowerCase() === tName ||
      entry.short_name.toLowerCase() === tName ||
      tName.includes(entry.short_name.toLowerCase()) ||
      (entry.constructor.toLowerCase() === cName && entry.type === 'Factory')
  );
  return team?.logo_url || '';
}

export function resolveRiderColor(
  number: number,
  teamName?: string,
  constructorName?: string
): string {
  const rider = getRiderByNumber(number);
  if (rider) return rider.color;
  const byTeam = MOTOGP_TEAMS.find(
    (entry) => entry.name.toLowerCase() === (teamName || '').toLowerCase()
  );
  if (byTeam) return byTeam.color;
  return constructorColorByName(constructorName);
}

/** Short, readable team label for chart legends and heatmap rows. */
export function teamShortName(name: string): string {
  const team = MOTOGP_TEAMS.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
  if (team) return team.short_name;
  const firstWord = name.split(/\s+/)[0] ?? name;
  return firstWord.slice(0, 10);
}

export function buildDriverEvolutionDrivers(standings: StandingItem[]): EvolutionDriver[] {
  return standings
    .filter((item) => (item.points ?? 0) > 0)
    .map((item) => {
      const number = item.rider?.number ?? 0;
      const points = item.points ?? 0;
      const wins = item.race_wins ?? Math.min(20, Math.round(points / 40));
      const podiums =
        item.podiums ?? Math.min(20, Math.max(wins, Math.round(points / 18)));

      return {
        id: standingId(item),
        fullName: item.rider?.full_name ?? `#${number}`,
        shortName: abbreviateRiderName(item.rider?.full_name || `#${number}`),
        number,
        color: resolveRiderColor(number, item.team?.name, item.constructor?.name),
        points,
        wins,
        podiums,
      };
    });
}

function aggregateEntities(
  standings: StandingItem[],
  kind: EntityKind
): EntityStanding[] {
  const map = new Map<string, EntityStanding>();

  standings.forEach((item) => {
    const name =
      kind === 'constructor'
        ? item.constructor?.name || 'Independent'
        : item.team?.name || 'Independent Team';

    const entry =
      map.get(name) ??
      {
        name,
        points: 0,
        wins: 0,
        podiums: 0,
        riderIds: [],
        riderNames: [],
      };

    const points = item.points ?? 0;
    const wins = item.race_wins ?? Math.min(20, Math.round(points / 40));
    const podiums = item.podiums ?? Math.min(20, Math.max(wins, Math.round(points / 18)));

    entry.points += points;
    entry.wins += wins;
    entry.podiums += podiums;
    entry.riderIds.push(standingId(item));
    entry.riderNames.push(item.rider?.full_name ?? '');
    map.set(name, entry);
  });

  return Array.from(map.values()).sort((a, b) => b.points - a.points);
}

export function aggregateConstructors(standings: StandingItem[]): EntityStanding[] {
  return aggregateEntities(standings, 'constructor');
}

export function aggregateTeams(standings: StandingItem[]): EntityStanding[] {
  return aggregateEntities(standings, 'team');
}

/**
 * Collapse the driver evolution into constructor / team series. Per-round
 * points are summed from the members so entity totals stay consistent with
 * the driver standings.
 */
export function buildEntityEvolution(
  base: EvolutionDataset,
  entities: EntityStanding[],
  kind: EntityKind
): EvolutionDataset {
  return aggregateStandingsEvolution(
    base,
    entities.map((entity) => ({
      id: entity.name,
      fullName: entity.name,
      shortName: kind === 'constructor' ? entity.name : teamShortName(entity.name),
      number: 0,
      color:
        kind === 'constructor'
          ? constructorColorByName(entity.name)
          : teamColorByName(entity.name),
      points: entity.points,
      wins: entity.wins,
      podiums: entity.podiums,
      memberIds: entity.riderIds,
    }))
  );
}
