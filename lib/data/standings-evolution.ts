/**
 * Derives per-round points, cumulative points and championship ranking series
 * from the current standings totals. The live Pulselive standings only expose
 * season totals, so we deterministically distribute each rider's points across
 * the rounds — the same seed always produces the same curve.
 */

export interface EvolutionDriver {
  id: string;
  fullName: string;
  /** Timing-board name, e.g. "M MAR". */
  shortName: string;
  number: number;
  color: string;
  points: number;
  wins: number;
  podiums: number;
}

export interface EvolutionDataset {
  roundCount: number;
  drivers: EvolutionDriver[];
  /** Cumulative championship points after each round. */
  cumulative: Record<string, number[]>;
  /** Points scored in each round. */
  perRound: Record<string, number[]>;
  /** Championship position after each round (1 = leader). */
  rankings: Record<string, number[]>;
}

export interface EvolutionAggregateInput extends EvolutionDriver {
  /** Driver IDs whose per-round points roll up into this entity. */
  memberIds: string[];
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Split an integer total into `rounds` non-negative integer buckets using a
 * seeded weight distribution, guaranteeing the sum equals the total.
 */
function distributePoints(total: number, rounds: number, rng: () => number): number[] {
  if (rounds <= 0) return [];
  if (total <= 0) return new Array(rounds).fill(0);

  const weights = Array.from({ length: rounds }, () => 0.55 + rng() * 1.1);
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const raw = weights.map((weight) => (weight / weightSum) * total);
  const buckets = raw.map((value) => Math.floor(value));

  let remainder = total - buckets.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  let cursor = 0;
  while (remainder > 0) {
    buckets[order[cursor % rounds].index] += 1;
    remainder -= 1;
    cursor += 1;
  }

  return buckets;
}

export function buildStandingsEvolution(
  drivers: EvolutionDriver[],
  roundCount = 20
): EvolutionDataset {
  const sorted = [...drivers].sort(
    (a, b) => b.points - a.points || a.number - b.number
  );

  const perRound: Record<string, number[]> = {};
  const cumulative: Record<string, number[]> = {};
  const rankings: Record<string, number[]> = {};

  sorted.forEach((driver) => {
    const rng = mulberry32(hashString(driver.id || driver.fullName));
    const rounds = distributePoints(driver.points, roundCount, rng);
    perRound[driver.id] = rounds;

    const runningTotals: number[] = [];
    let running = 0;
    rounds.forEach((points) => {
      running += points;
      runningTotals.push(running);
    });
    cumulative[driver.id] = runningTotals;
    rankings[driver.id] = new Array(roundCount).fill(0);
  });

  for (let round = 0; round < roundCount; round += 1) {
    const order = [...sorted].sort(
      (a, b) =>
        cumulative[b.id][round] - cumulative[a.id][round] ||
        a.number - b.number
    );
    order.forEach((driver, index) => {
      rankings[driver.id][round] = index + 1;
    });
  }

  return { roundCount, drivers: sorted, cumulative, perRound, rankings };
}

/**
 * Roll driver evolution series up into constructor / team series. Per-round
 * points are summed from member riders so entity totals match the standings.
 */
export function aggregateStandingsEvolution(
  base: EvolutionDataset,
  entities: EvolutionAggregateInput[]
): EvolutionDataset {
  const roundCount = base.roundCount;
  const perRound: Record<string, number[]> = {};
  const cumulative: Record<string, number[]> = {};

  entities.forEach((entity) => {
    const rounds = new Array(roundCount).fill(0);
    entity.memberIds.forEach((memberId) => {
      const memberRounds = base.perRound[memberId];
      if (!memberRounds) return;
      memberRounds.forEach((points, round) => {
        rounds[round] += points;
      });
    });

    perRound[entity.id] = rounds;
    let running = 0;
    cumulative[entity.id] = rounds.map((points) => {
      running += points;
      return running;
    });
  });

  const drivers: EvolutionDriver[] = entities
    .map((entity) => ({
      id: entity.id,
      fullName: entity.fullName,
      shortName: entity.shortName,
      number: entity.number,
      color: entity.color,
      points: entity.points,
      wins: entity.wins,
      podiums: entity.podiums,
    }))
    .sort((a, b) => b.points - a.points || a.fullName.localeCompare(b.fullName));

  const rankings: Record<string, number[]> = {};
  drivers.forEach((driver) => {
    rankings[driver.id] = new Array(roundCount).fill(0);
  });

  for (let round = 0; round < roundCount; round += 1) {
    const order = [...drivers].sort(
      (a, b) =>
        (cumulative[b.id]?.[round] ?? 0) - (cumulative[a.id]?.[round] ?? 0) ||
        a.fullName.localeCompare(b.fullName)
    );
    order.forEach((driver, index) => {
      rankings[driver.id][round] = index + 1;
    });
  }

  return { roundCount, drivers, cumulative, perRound, rankings };
}
