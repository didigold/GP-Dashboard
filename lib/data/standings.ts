import { MOCK_STANDINGS } from '@/lib/data/mock-race-data';
import { MOTOGP_TEAMS, getRiderByNumber } from '@/lib/data/motogp-grid';
import {
  EvolutionDataset,
  EvolutionDriver,
  aggregateStandingsEvolution,
} from '@/lib/data/standings-evolution';
import { abbreviateRiderName } from '@/lib/utils/rider-name';
import { getTeamLogoInfo } from '@/components/ui/TeamLogo';

export interface Season {
  year: number;
  id: string;
  label: string;
  subtitle?: string;
  isCurrent?: boolean;
}

export const STANDINGS_SEASONS: Season[] = [
  {
    year: 2026,
    id: 'e88b4e43-2209-47aa-8e83-0e0b1cedde6e',
    label: '2026 World Championship',
    subtitle: 'Official Live Season',
    isCurrent: true,
  },
  {
    year: 2025,
    id: 'ae6c6f0d-c652-44f8-94aa-420fc5b3dab4',
    label: '2025 World Championship',
    subtitle: 'Marquez vs Bagnaia Title Fight',
  },
  {
    year: 2024,
    id: 'dd12382e-1d9f-46ee-a5f7-c5104db28e43',
    label: '2024 World Championship',
    subtitle: 'Martin Champion • 508 pts',
  },
  {
    year: 2023,
    id: 'db8dc197-c7b2-4c1b-b3a4-6dc534c023ef',
    label: '2023 World Championship',
    subtitle: 'Bagnaia Champion • 467 pts',
  },
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
    if (rider) {
      const info = getTeamLogoInfo(rider.team_id, rider.constructor_name);
      if (info?.src) return info.src;
    }
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
  if (team) {
    const info = getTeamLogoInfo(team.id, team.constructor);
    if (info?.src) return info.src;
  }
  const constructorInfo = getTeamLogoInfo(undefined, constructorName);
  return constructorInfo?.src || '';
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

export const STANDINGS_2024_FALLBACK: StandingItem[] = [
  {
    id: 'martin-89',
    position: 1,
    rider: { id: 'martin-89', full_name: 'Jorge Martin', number: 89, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'pramac', name: 'Prima Pramac Racing' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 508,
    race_wins: 3,
    podiums: 16,
  },
  {
    id: 'bagnaia-63',
    position: 2,
    rider: { id: 'bagnaia-63', full_name: 'Francesco Bagnaia', number: 1, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'ducati-lenovo', name: 'Ducati Lenovo Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 498,
    race_wins: 11,
    podiums: 16,
  },
  {
    id: 'marquez-93',
    position: 3,
    rider: { id: 'marquez-93', full_name: 'Marc Marquez', number: 93, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'gresini', name: 'Gresini Racing MotoGP' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 392,
    race_wins: 3,
    podiums: 10,
  },
  {
    id: 'bastianini-23',
    position: 4,
    rider: { id: 'bastianini-23', full_name: 'Enea Bastianini', number: 23, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'ducati-lenovo', name: 'Ducati Lenovo Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 368,
    race_wins: 2,
    podiums: 9,
  },
  {
    id: 'binder-33',
    position: 5,
    rider: { id: 'binder-33', full_name: 'Brad Binder', number: 33, country: { iso: 'ZA', name: 'South Africa' } },
    team: { id: 'ktm-factory', name: 'Red Bull KTM Factory Racing' },
    constructor: { id: 'ktm', name: 'KTM' },
    points: 217,
    race_wins: 0,
    podiums: 1,
  },
  {
    id: 'acosta-37',
    position: 6,
    rider: { id: 'acosta-37', full_name: 'Pedro Acosta', number: 37, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'gasgas-tech3', name: 'Red Bull GASGAS Tech3' },
    constructor: { id: 'ktm', name: 'KTM' },
    points: 215,
    race_wins: 0,
    podiums: 5,
  },
  {
    id: 'vinales-12',
    position: 7,
    rider: { id: 'vinales-12', full_name: 'Maverick Viñales', number: 12, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'aprilia-racing', name: 'Aprilia Racing' },
    constructor: { id: 'aprilia', name: 'Aprilia' },
    points: 190,
    race_wins: 1,
    podiums: 3,
  },
  {
    id: 'alexmarquez-73',
    position: 8,
    rider: { id: 'alexmarquez-73', full_name: 'Alex Marquez', number: 73, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'gresini', name: 'Gresini Racing MotoGP' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 173,
    race_wins: 0,
    podiums: 1,
  },
  {
    id: 'morbidelli-21',
    position: 9,
    rider: { id: 'morbidelli-21', full_name: 'Franco Morbidelli', number: 21, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'pramac', name: 'Prima Pramac Racing' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 173,
    race_wins: 0,
    podiums: 0,
  },
  {
    id: 'digiannantonio-49',
    position: 10,
    rider: { id: 'digiannantonio-49', full_name: 'Fabio Di Giannantonio', number: 49, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'vr46', name: 'Pertamina Enduro VR46 Racing Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 165,
    race_wins: 0,
    podiums: 0,
  },
  {
    id: 'espargaro-41',
    position: 11,
    rider: { id: 'espargaro-41', full_name: 'Aleix Espargaro', number: 41, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'aprilia-racing', name: 'Aprilia Racing' },
    constructor: { id: 'aprilia', name: 'Aprilia' },
    points: 163,
    race_wins: 1,
    podiums: 2,
  },
  {
    id: 'bezzecchi-72',
    position: 12,
    rider: { id: 'bezzecchi-72', full_name: 'Marco Bezzecchi', number: 72, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'vr46', name: 'Pertamina Enduro VR46 Racing Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 153,
    race_wins: 0,
    podiums: 1,
  },
];

export const STANDINGS_2025_FALLBACK: StandingItem[] = [
  {
    id: 'marquez-93',
    position: 1,
    rider: { id: 'marquez-93', full_name: 'Marc Marquez', number: 93, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'ducati-lenovo', name: 'Ducati Lenovo Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 545,
    race_wins: 11,
    podiums: 15,
  },
  {
    id: 'alexmarquez-73',
    position: 2,
    rider: { id: 'alexmarquez-73', full_name: 'Alex Marquez', number: 73, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'gresini', name: 'BK8 Gresini Racing MotoGP' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 467,
    race_wins: 3,
    podiums: 12,
  },
  {
    id: 'bezzecchi-72',
    position: 3,
    rider: { id: 'bezzecchi-72', full_name: 'Marco Bezzecchi', number: 72, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'aprilia-racing', name: 'Aprilia Racing' },
    constructor: { id: 'aprilia', name: 'Aprilia' },
    points: 353,
    race_wins: 3,
    podiums: 9,
  },
  {
    id: 'bagnaia-63',
    position: 4,
    rider: { id: 'bagnaia-63', full_name: 'Francesco Bagnaia', number: 63, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'ducati-lenovo', name: 'Ducati Lenovo Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 340,
    race_wins: 4,
    podiums: 10,
  },
  {
    id: 'acosta-37',
    position: 5,
    rider: { id: 'acosta-37', full_name: 'Pedro Acosta', number: 37, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'ktm-factory', name: 'Red Bull KTM Factory Racing' },
    constructor: { id: 'ktm', name: 'KTM' },
    points: 285,
    race_wins: 1,
    podiums: 8,
  },
  {
    id: 'martin-89',
    position: 6,
    rider: { id: 'martin-89', full_name: 'Jorge Martin', number: 89, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'aprilia-racing', name: 'Aprilia Racing' },
    constructor: { id: 'aprilia', name: 'Aprilia' },
    points: 270,
    race_wins: 2,
    podiums: 8,
  },
  {
    id: 'digiannantonio-49',
    position: 7,
    rider: { id: 'digiannantonio-49', full_name: 'Fabio Di Giannantonio', number: 49, country: { iso: 'IT', name: 'Italy' } },
    team: { id: 'vr46', name: 'Pertamina Enduro VR46 Racing Team' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 240,
    race_wins: 1,
    podiums: 6,
  },
  {
    id: 'aldeguer-54',
    position: 8,
    rider: { id: 'aldeguer-54', full_name: 'Fermin Aldeguer', number: 54, country: { iso: 'ES', name: 'Spain' } },
    team: { id: 'gresini', name: 'BK8 Gresini Racing MotoGP' },
    constructor: { id: 'ducati', name: 'Ducati' },
    points: 210,
    race_wins: 0,
    podiums: 4,
  },
];

export function getFallbackStandings(year: number): StandingItem[] {
  if (year === 2024) return STANDINGS_2024_FALLBACK;
  if (year === 2025) return STANDINGS_2025_FALLBACK;
  return INITIAL_STANDINGS;
}
