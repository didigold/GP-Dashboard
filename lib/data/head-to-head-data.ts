import { MOTOGP_RIDERS, MOTOGP_TEAMS, GridRider, GridTeam } from './motogp-grid';
import { DRIVER_SEASON_STATS, getRiderStats, RiderSeasonStats } from './driver-stats-data';
import { CHAMPIONSHIP_ROUNDS_2026 } from './circuits-data';

export interface HeadToHeadSession {
  round: number;
  circuitName: string;
  type: 'Quali' | 'Sprint Quali' | 'Race';
  delta: number; // Negative = Rider A faster, Positive = Rider B faster
  riderATime: string;
  riderBTime: string;
  winner: 'A' | 'B';
  isLast: boolean;
  jitter: number; // Vertical offset (-8 to +8 px) for natural dot plot spread
}

export interface TeamHeadToHeadData {
  teamId: string;
  teamName: string;
  teamShortName: string;
  constructorName: string;
  bikeName: string;
  teamColor: string;
  teamLogoUrl: string;
  riderA: {
    id: string;
    code: string;
    fullName: string;
    number: number;
    photoUrl: string;
    color: string;
  };
  riderB: {
    id: string;
    code: string;
    fullName: string;
    number: number;
    photoUrl: string;
    color: string;
  };
  qualiWinsA: number;
  qualiWinsB: number;
  sprintWinsA: number;
  sprintWinsB: number;
  raceWinsA: number;
  raceWinsB: number;
  avgQualiDelta: number; // e.g. -0.218
  medianQualiDelta: number;
  sessions: HeadToHeadSession[];
}

// Generate seeded deterministic deltas for 19 championship rounds
function generateTeamSessions(
  riderACode: string,
  riderBCode: string,
  baseAdvantage: number, // negative favors A, positive favors B
  spread: number,
  seed: number
): HeadToHeadSession[] {
  let rng = seed;
  const nextRandom = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };

  const sessions: HeadToHeadSession[] = [];
  const roundsCount = 19; // Up to Sepang (Round 19)

  for (let round = 1; round <= roundsCount; round++) {
    const circuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.round_number === round) || CHAMPIONSHIP_ROUNDS_2026[0];
    const circuitShort = circuit.name.replace(' Grand Prix', ' GP').replace('GP of ', '');

    // Base lap time around 1:57 - 1:59 for Sepang / Lusail
    const baseSeconds = 117.5 + (nextRandom() * 4);

    // Quali session
    const variation = (nextRandom() - 0.5) * spread * 2;
    const delta = parseFloat((baseAdvantage + variation).toFixed(3));
    // Clamp to realistic range [-1.85, 1.85]
    const clampedDelta = Math.max(-1.9, Math.min(1.9, delta));
    const winner: 'A' | 'B' = clampedDelta <= 0 ? 'A' : 'B';

    const timeA = baseSeconds;
    const timeB = baseSeconds + clampedDelta;

    const formatLap = (secs: number) => {
      const mins = Math.floor(secs / 60);
      const rem = (secs % 60).toFixed(3).padStart(6, '0');
      return `${mins}:${rem}`;
    };

    // Deterministic jitter for dot plot
    const jitter = Math.round((nextRandom() - 0.5) * 16);

    sessions.push({
      round,
      circuitName: circuitShort,
      type: 'Quali',
      delta: clampedDelta,
      riderATime: formatLap(timeA),
      riderBTime: formatLap(timeB),
      winner,
      isLast: round === roundsCount,
      jitter,
    });

    // Sprint Quali session (for rounds that have sprints)
    if (round % 3 !== 0) {
      const sprintVariation = (nextRandom() - 0.5) * spread * 2.2;
      const sprintDelta = parseFloat((baseAdvantage * 0.9 + sprintVariation).toFixed(3));
      const clampedSprintDelta = Math.max(-1.9, Math.min(1.9, sprintDelta));
      const sprintWinner: 'A' | 'B' = clampedSprintDelta <= 0 ? 'A' : 'B';
      const sprintJitter = Math.round((nextRandom() - 0.5) * 14);

      sessions.push({
        round,
        circuitName: `${circuitShort} (Sprint Q)`,
        type: 'Sprint Quali',
        delta: clampedSprintDelta,
        riderATime: formatLap(timeA + 0.15),
        riderBTime: formatLap(timeA + 0.15 + clampedSprintDelta),
        winner: sprintWinner,
        isLast: round === roundsCount,
        jitter: sprintJitter,
      });
    }
  }

  return sessions;
}

// 11 Official MotoGP Teams Data
export const ALL_GRID_HEAD_TO_HEAD: TeamHeadToHeadData[] = [
  {
    teamId: 'ducati-lenovo-team',
    teamName: 'Ducati Lenovo Team',
    teamShortName: 'Ducati Lenovo',
    constructorName: 'Ducati',
    bikeName: 'Ducati Desmosedici GP25',
    teamColor: '#E10600',
    teamLogoUrl: 'https://photos.motogp.com/teams/8/9/892fff2f-7402-4fbd-99fb-5fd567d8a80c/main-picture.png',
    riderA: {
      id: 'marquez-93',
      code: 'MAR',
      fullName: 'Marc Márquez',
      number: 93,
      photoUrl: 'https://photos.motogp.com/riders/7/c/7caee789-5f25-4528-9842-8386f7f0c10b/headshot.png',
      color: '#E10600',
    },
    riderB: {
      id: 'bagnaia-63',
      code: 'BAG',
      fullName: 'Francesco Bagnaia',
      number: 63,
      photoUrl: 'https://photos.motogp.com/riders/f/8/f8e2394f-4d98-4c07-b2e1-a083320cce99/headshot.png',
      color: '#FF2A24',
    },
    qualiWinsA: 11,
    qualiWinsB: 8,
    sprintWinsA: 12,
    sprintWinsB: 7,
    raceWinsA: 10,
    raceWinsB: 9,
    avgQualiDelta: -0.114,
    medianQualiDelta: -0.098,
    sessions: generateTeamSessions('MAR', 'BAG', -0.114, 0.28, 9363),
  },
  {
    teamId: 'aprilia-racing',
    teamName: 'Aprilia Racing',
    teamShortName: 'Aprilia Racing',
    constructorName: 'Aprilia',
    bikeName: 'Aprilia RS-GP25',
    teamColor: '#800020',
    teamLogoUrl: 'https://photos.motogp.com/teams/1/1/11d18b37-baba-400a-80c2-f8ddf040f97e/main-picture.png',
    riderA: {
      id: 'martin-89',
      code: 'MAR',
      fullName: 'Jorge Martín',
      number: 89,
      photoUrl: 'https://photos.motogp.com/riders/6/5/65fc5fc8-80f2-49d6-b514-61fa820ec50b/headshot.png',
      color: '#800020',
    },
    riderB: {
      id: 'bezzecchi-72',
      code: 'BEZ',
      fullName: 'Marco Bezzecchi',
      number: 72,
      photoUrl: 'https://photos.motogp.com/riders/9/1/91aa219c-95ea-4c55-8025-aa8b067a39ba/headshot.png',
      color: '#E10600',
    },
    qualiWinsA: 14,
    qualiWinsB: 5,
    sprintWinsA: 13,
    sprintWinsB: 6,
    raceWinsA: 13,
    raceWinsB: 6,
    avgQualiDelta: -0.342,
    medianQualiDelta: -0.285,
    sessions: generateTeamSessions('MAR', 'BEZ', -0.342, 0.35, 8972),
  },
  {
    teamId: 'red-bull-ktm-factory-racing',
    teamName: 'Red Bull KTM Factory Racing',
    teamShortName: 'Red Bull KTM',
    constructorName: 'KTM',
    bikeName: 'KTM RC16 Prototype',
    teamColor: '#FF6600',
    teamLogoUrl: 'https://photos.motogp.com/teams/0/b/0b6cc118-a286-4343-9020-fb53c6f77c1a/main-picture.png',
    riderA: {
      id: 'acosta-37',
      code: 'ACO',
      fullName: 'Pedro Acosta',
      number: 37,
      photoUrl: 'https://photos.motogp.com/riders/5/0/50cf0f28-090c-4ec8-bcbf-ca5ea56ea7fb/headshot.png',
      color: '#FF6600',
    },
    riderB: {
      id: 'binder-33',
      code: 'BIN',
      fullName: 'Brad Binder',
      number: 33,
      photoUrl: 'https://photos.motogp.com/riders/c/a/ca79116c-e0ee-49ce-ab63-739343ee06fe/headshot.png',
      color: '#1E3A8A',
    },
    qualiWinsA: 13,
    qualiWinsB: 6,
    sprintWinsA: 11,
    sprintWinsB: 8,
    raceWinsA: 12,
    raceWinsB: 7,
    avgQualiDelta: -0.245,
    medianQualiDelta: -0.210,
    sessions: generateTeamSessions('ACO', 'BIN', -0.245, 0.32, 3733),
  },
  {
    teamId: 'monster-energy-yamaha-motogp',
    teamName: 'Monster Energy Yamaha MotoGP',
    teamShortName: 'Yamaha Factory',
    constructorName: 'Yamaha',
    bikeName: 'Yamaha YZR-M1',
    teamColor: '#002B7F',
    teamLogoUrl: 'https://photos.motogp.com/teams/1/4/141b6f0f-7e53-4d27-9bdb-0ea8fba7e842/main-picture.png',
    riderA: {
      id: 'quartararo-20',
      code: 'QUA',
      fullName: 'Fabio Quartararo',
      number: 20,
      photoUrl: 'https://photos.motogp.com/riders/2/8/28adff94-3996-419b-ab29-4d6d67b2d56a/headshot.png',
      color: '#002B7F',
    },
    riderB: {
      id: 'rins-42',
      code: 'RIN',
      fullName: 'Álex Rins',
      number: 42,
      photoUrl: 'https://photos.motogp.com/riders/d/2/d2dfc39a-5bca-44ef-a6bc-e5f8f30689b7/headshot.png',
      color: '#2563EB',
    },
    qualiWinsA: 16,
    qualiWinsB: 3,
    sprintWinsA: 14,
    sprintWinsB: 5,
    raceWinsA: 15,
    raceWinsB: 4,
    avgQualiDelta: -0.418,
    medianQualiDelta: -0.370,
    sessions: generateTeamSessions('QUA', 'RIN', -0.418, 0.36, 2042),
  },
  {
    teamId: 'pertamina-enduro-vr46',
    teamName: 'Pertamina Enduro VR46 Racing Team',
    teamShortName: 'VR46 Racing',
    constructorName: 'Ducati',
    bikeName: 'Ducati Desmosedici GP25',
    teamColor: '#EFFF00',
    teamLogoUrl: 'https://photos.motogp.com/teams/1/1/11729e67-d2cb-41ad-b3a8-4a0ac5768a5f/main-picture.png',
    riderA: {
      id: 'digiannantonio-49',
      code: 'DIG',
      fullName: 'Fabio Di Giannantonio',
      number: 49,
      photoUrl: 'https://photos.motogp.com/riders/1/b/1b1424e4-7d52-4fe1-ba71-6eb45be326f2/headshot.png',
      color: '#EFFF00',
    },
    riderB: {
      id: 'morbidelli-21',
      code: 'MOR',
      fullName: 'Franco Morbidelli',
      number: 21,
      photoUrl: 'https://photos.motogp.com/riders/1/9/194488b3-3a56-4bfa-a6be-28bf616082c9/headshot.png',
      color: '#10B981',
    },
    qualiWinsA: 12,
    qualiWinsB: 7,
    sprintWinsA: 10,
    sprintWinsB: 9,
    raceWinsA: 11,
    raceWinsB: 8,
    avgQualiDelta: -0.162,
    medianQualiDelta: -0.145,
    sessions: generateTeamSessions('DIG', 'MOR', -0.162, 0.31, 4921),
  },
  {
    teamId: 'bk8-gresini-racing-motogp',
    teamName: 'BK8 Gresini Racing MotoGP',
    teamShortName: 'Gresini Racing',
    constructorName: 'Ducati',
    bikeName: 'Ducati Desmosedici GP24/25',
    teamColor: '#7BAFD4',
    teamLogoUrl: 'https://photos.motogp.com/teams/1/1/11729e67-d2cb-41ad-b3a8-4a0ac5768a5f/main-picture.png',
    riderA: {
      id: 'marquez-73',
      code: 'AMR',
      fullName: 'Álex Márquez',
      number: 73,
      photoUrl: 'https://photos.motogp.com/riders/9/d/9d0a0b27-4402-46a2-9a3e-7a5e88942360/headshot.png',
      color: '#7BAFD4',
    },
    riderB: {
      id: 'aldeguer-54',
      code: 'ALD',
      fullName: 'Fermín Aldeguer',
      number: 54,
      photoUrl: 'https://photos.motogp.com/riders/4/a/4a1c5d92-2a71-4608-aa13-5d51ae10283b/headshot.png',
      color: '#38BDF8',
    },
    qualiWinsA: 13,
    qualiWinsB: 6,
    sprintWinsA: 12,
    sprintWinsB: 7,
    raceWinsA: 14,
    raceWinsB: 5,
    avgQualiDelta: -0.280,
    medianQualiDelta: -0.240,
    sessions: generateTeamSessions('AMR', 'ALD', -0.280, 0.38, 7354),
  },
  {
    teamId: 'superfile-trackhouse-motogp',
    teamName: 'SuperFile Trackhouse MotoGP',
    teamShortName: 'Trackhouse MotoGP',
    constructorName: 'Aprilia',
    bikeName: 'Aprilia RS-GP25',
    teamColor: '#003399',
    teamLogoUrl: 'https://photos.motogp.com/teams/8/5/8532f5e4-c2f3-417b-8c76-09302a826dd4/main-picture.png',
    riderA: {
      id: 'ogura-79',
      code: 'OGU',
      fullName: 'Ai Ogura',
      number: 79,
      photoUrl: 'https://photos.motogp.com/riders/0/8/087ae70f-d5b7-4a0b-bc6d-09fe43a1f1fa/headshot.png',
      color: '#003399',
    },
    riderB: {
      id: 'fernandez-25',
      code: 'FER',
      fullName: 'Raúl Fernández',
      number: 25,
      photoUrl: 'https://photos.motogp.com/riders/2/5/25eb5c94-1a2f-410a-8bf8-0eb83792cb15/headshot.png',
      color: '#2563EB',
    },
    qualiWinsA: 10,
    qualiWinsB: 9,
    sprintWinsA: 11,
    sprintWinsB: 8,
    raceWinsA: 10,
    raceWinsB: 9,
    avgQualiDelta: -0.065,
    medianQualiDelta: -0.040,
    sessions: generateTeamSessions('OGU', 'FER', -0.065, 0.29, 7925),
  },
  {
    teamId: 'red-bull-ktm-tech3',
    teamName: 'Red Bull KTM Tech3',
    teamShortName: 'KTM Tech3',
    constructorName: 'KTM',
    bikeName: 'KTM RC16 Prototype',
    teamColor: '#EA580C',
    teamLogoUrl: 'https://photos.motogp.com/teams/8/a/8a8633cd-a3e2-4a3d-aa24-66b99014a9dd/main-picture.png',
    riderA: {
      id: 'bastianini-23',
      code: 'BAS',
      fullName: 'Enea Bastianini',
      number: 23,
      photoUrl: 'https://photos.motogp.com/riders/d/2/d236055c-cfb9-4458-ba84-d62193cb9d46/headshot.png',
      color: '#EA580C',
    },
    riderB: {
      id: 'vinales-12',
      code: 'VIN',
      fullName: 'Maverick Viñales',
      number: 12,
      photoUrl: 'https://photos.motogp.com/riders/6/c/6cfb8e0b-d249-43c2-8433-28f89c6ca6fc/headshot.png',
      color: '#F97316',
    },
    qualiWinsA: 11,
    qualiWinsB: 8,
    sprintWinsA: 9,
    sprintWinsB: 10,
    raceWinsA: 12,
    raceWinsB: 7,
    avgQualiDelta: -0.125,
    medianQualiDelta: -0.110,
    sessions: generateTeamSessions('BAS', 'VIN', -0.125, 0.34, 2312),
  },
  {
    teamId: 'honda-hrc-castrol',
    teamName: 'Honda HRC Castrol',
    teamShortName: 'Honda HRC',
    constructorName: 'Honda',
    bikeName: 'Honda RC213V Factory',
    teamColor: '#D90429',
    teamLogoUrl: 'https://photos.motogp.com/teams/c/e/ce837bd3-bc07-40ef-83cf-6a8025bededf/main-picture.png',
    riderA: {
      id: 'mir-36',
      code: 'MIR',
      fullName: 'Joan Mir',
      number: 36,
      photoUrl: 'https://photos.motogp.com/riders/4/5/45155734-b258-46f9-aeb5-5a7bbcd62391/headshot.png',
      color: '#D90429',
    },
    riderB: {
      id: 'marini-10',
      code: 'MAR',
      fullName: 'Luca Marini',
      number: 10,
      photoUrl: 'https://photos.motogp.com/riders/9/1/91dfaa34-dc8e-49b8-a6b1-912a7bf3faee/headshot.png',
      color: '#EF4444',
    },
    qualiWinsA: 15,
    qualiWinsB: 4,
    sprintWinsA: 14,
    sprintWinsB: 5,
    raceWinsA: 13,
    raceWinsB: 6,
    avgQualiDelta: -0.388,
    medianQualiDelta: -0.340,
    sessions: generateTeamSessions('MIR', 'MAR', -0.388, 0.42, 3610),
  },
  {
    teamId: 'pro-honda-lcr',
    teamName: 'CASTROL Honda LCR',
    teamShortName: 'LCR Honda',
    constructorName: 'Honda',
    bikeName: 'Honda RC213V Prototype',
    teamColor: '#16A34A',
    teamLogoUrl: 'https://photos.motogp.com/teams/7/7/77a0174a-c84d-4955-a722-b39e4d8e4ce5/main-picture.png',
    riderA: {
      id: 'zarco-5',
      code: 'ZAR',
      fullName: 'Johann Zarco',
      number: 5,
      photoUrl: 'https://photos.motogp.com/riders/1/b/1bb9c07e-1311-4fa3-94c3-e847b3be6100/headshot.png',
      color: '#16A34A',
    },
    riderB: {
      id: 'moreira-11',
      code: 'MOR',
      fullName: 'Diogo Moreira',
      number: 11,
      photoUrl: 'https://photos.motogp.com/riders/e/6/e623115a-b620-42cf-9ca7-009ab55e9ba7/headshot.png',
      color: '#22C55E',
    },
    qualiWinsA: 17,
    qualiWinsB: 2,
    sprintWinsA: 16,
    sprintWinsB: 3,
    raceWinsA: 16,
    raceWinsB: 3,
    avgQualiDelta: -0.562,
    medianQualiDelta: -0.510,
    sessions: generateTeamSessions('ZAR', 'MOR', -0.562, 0.44, 511),
  },
  {
    teamId: 'prima-pramac-yamaha-motogp',
    teamName: 'Prima Pramac Yamaha MotoGP',
    teamShortName: 'Pramac Yamaha',
    constructorName: 'Yamaha',
    bikeName: 'Yamaha YZR-M1 Factory Spec',
    teamColor: '#002B7F',
    teamLogoUrl: 'https://photos.motogp.com/teams/5/9/598ccfb2-e0f1-4ad7-92b7-00ec9238a72c/main-picture.png',
    riderA: {
      id: 'miller-43',
      code: 'MIL',
      fullName: 'Jack Miller',
      number: 43,
      photoUrl: 'https://photos.motogp.com/riders/1/7/17b96131-0118-472b-86ea-ea720d2cb2f3/headshot.png',
      color: '#002B7F',
    },
    riderB: {
      id: 'razgatlioglu-7',
      code: 'RAZ',
      fullName: 'Toprak Razgatlioglu',
      number: 7,
      photoUrl: 'https://photos.motogp.com/riders/d/2/d2dfc39a-5bca-44ef-a6bc-e5f8f30689b7/headshot.png',
      color: '#3B82F6',
    },
    qualiWinsA: 12,
    qualiWinsB: 7,
    sprintWinsA: 10,
    sprintWinsB: 9,
    raceWinsA: 11,
    raceWinsB: 8,
    avgQualiDelta: -0.185,
    medianQualiDelta: -0.160,
    sessions: generateTeamSessions('MIL', 'RAZ', -0.185, 0.35, 4307),
  },
];

// Helper to calculate head-to-head metrics between ANY two riders on the grid
export function computeRivalDuel(riderAId: string, riderBId: string) {
  const riderA = MOTOGP_RIDERS.find((r) => r.id === riderAId) || MOTOGP_RIDERS[0];
  const riderB = MOTOGP_RIDERS.find((r) => r.id === riderBId) || MOTOGP_RIDERS[1];
  const statsA = getRiderStats(riderAId) || DRIVER_SEASON_STATS[0];
  const statsB = getRiderStats(riderBId) || DRIVER_SEASON_STATS[1];

  let qualiWinsA = 0;
  let qualiWinsB = 0;
  let sprintWinsA = 0;
  let sprintWinsB = 0;
  let sundayWinsA = 0;
  let sundayWinsB = 0;
  const sessions: HeadToHeadSession[] = [];
  const cumulativePointsA: number[] = [];
  const cumulativePointsB: number[] = [];
  let runPointsA = 0;
  let runPointsB = 0;

  const roundsCount = Math.min(statsA.rounds.length, statsB.rounds.length, 19);

  for (let i = 0; i < roundsCount; i++) {
    const rA = statsA.rounds[i];
    const rB = statsB.rounds[i];
    const circuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.round_number === rA.round) || CHAMPIONSHIP_ROUNDS_2026[0];
    const circuitShort = circuit.name.replace(' Grand Prix', ' GP').replace('GP of ', '');

    // Quali battle (lower gridPos is better)
    if (rA.gridPos <= rB.gridPos) qualiWinsA++;
    else qualiWinsB++;

    // Sprint battle
    if (rA.sprintPos > 0 && rB.sprintPos > 0) {
      if (rA.sprintPos <= rB.sprintPos) sprintWinsA++;
      else sprintWinsB++;
    } else if (rA.sprintPos > 0) {
      sprintWinsA++;
    } else if (rB.sprintPos > 0) {
      sprintWinsB++;
    }

    // Sunday battle
    if (rA.sundayPos > 0 && rB.sundayPos > 0) {
      if (rA.sundayPos <= rB.sundayPos) sundayWinsA++;
      else sundayWinsB++;
    } else if (rA.sundayPos > 0) {
      sundayWinsA++;
    } else if (rB.sundayPos > 0) {
      sundayWinsB++;
    }

    // Qualifying delta estimation from grid positions and pace
    const posDiff = rA.gridPos - rB.gridPos;
    const paceDiff = (statsB.radar.qualifyingPace - statsA.radar.qualifyingPace) * 0.015;
    const rawDelta = (posDiff * 0.08) + paceDiff;
    const clampedDelta = Math.max(-1.9, Math.min(1.9, parseFloat(rawDelta.toFixed(3))));

    const baseLap = 117.8;
    const timeA = baseLap;
    const timeB = baseLap + clampedDelta;

    const formatLap = (secs: number) => {
      const mins = Math.floor(secs / 60);
      const rem = (secs % 60).toFixed(3).padStart(6, '0');
      return `${mins}:${rem}`;
    };

    const jitter = ((i * 7) % 15) - 7;

    sessions.push({
      round: rA.round,
      circuitName: circuitShort,
      type: 'Quali',
      delta: clampedDelta,
      riderATime: formatLap(timeA),
      riderBTime: formatLap(timeB),
      winner: clampedDelta <= 0 ? 'A' : 'B',
      isLast: i === roundsCount - 1,
      jitter,
    });

    runPointsA += rA.points;
    runPointsB += rB.points;
    cumulativePointsA.push(runPointsA);
    cumulativePointsB.push(runPointsB);
  }

  const avgQualiDelta = parseFloat(
    (sessions.reduce((acc, s) => acc + s.delta, 0) / sessions.length).toFixed(3)
  );

  const sortedDeltas = [...sessions.map((s) => s.delta)].sort((a, b) => a - b);
  const medianQualiDelta = sortedDeltas[Math.floor(sortedDeltas.length / 2)];

  // Realistic mini-sector splits (Sepang Grand Prix reference)
  const sectorSplits = [
    {
      name: 'Sector 1 (Main Straight & T1-T2)',
      timeA: 28.290,
      timeB: 28.380 + (avgQualiDelta * 0.28),
      delta: Math.abs(parseFloat((-avgQualiDelta * 0.28).toFixed(3))),
      winner: avgQualiDelta <= 0 ? 'A' : 'B',
    },
    {
      name: 'Sector 2 (T3-T6 High-Speed Sweepers)',
      timeA: 29.110,
      timeB: 29.080 + (avgQualiDelta * 0.24),
      delta: Math.abs(parseFloat((-avgQualiDelta * 0.24).toFixed(3))),
      winner: avgQualiDelta <= 0 ? 'A' : 'B',
    },
    {
      name: 'Sector 3 (T7-T11 Complex & Uphill Crest)',
      timeA: 23.840,
      timeB: 23.890 + (avgQualiDelta * 0.26),
      delta: Math.abs(parseFloat((-avgQualiDelta * 0.26).toFixed(3))),
      winner: avgQualiDelta <= 0 ? 'A' : 'B',
    },
    {
      name: 'Sector 4 (920m Back Straight & T15)',
      timeA: 23.310,
      timeB: 23.290 + (avgQualiDelta * 0.22),
      delta: Math.abs(parseFloat((-avgQualiDelta * 0.22).toFixed(3))),
      winner: avgQualiDelta <= 0 ? 'A' : 'B',
    },
  ];

  return {
    riderA,
    riderB,
    statsA,
    statsB,
    qualiWinsA,
    qualiWinsB,
    sprintWinsA,
    sprintWinsB,
    sundayWinsA,
    sundayWinsB,
    avgQualiDelta,
    medianQualiDelta,
    sessions,
    cumulativePointsA,
    cumulativePointsB,
    sectorSplits,
  };
}

// Helper to compute 3-way fight metrics
export function computeTriDuel(riderAId: string, riderBId: string, riderCId: string) {
  const riderA = MOTOGP_RIDERS.find((r) => r.id === riderAId) || MOTOGP_RIDERS[0];
  const riderB = MOTOGP_RIDERS.find((r) => r.id === riderBId) || MOTOGP_RIDERS[1];
  const riderC = MOTOGP_RIDERS.find((r) => r.id === riderCId) || MOTOGP_RIDERS[2];

  const statsA = getRiderStats(riderAId) || DRIVER_SEASON_STATS[0];
  const statsB = getRiderStats(riderBId) || DRIVER_SEASON_STATS[1];
  const statsC = getRiderStats(riderCId) || DRIVER_SEASON_STATS[2];

  const duelAB = computeRivalDuel(riderAId, riderBId);
  const duelAC = computeRivalDuel(riderAId, riderCId);
  const duelBC = computeRivalDuel(riderBId, riderCId);

  // Round by round benchmark analysis: who was fastest of the 3 per round?
  const roundsCount = Math.min(statsA.rounds.length, statsB.rounds.length, statsC.rounds.length, 19);
  const benchmarkRounds = [];

  for (let i = 0; i < roundsCount; i++) {
    const rA = statsA.rounds[i];
    const rB = statsB.rounds[i];
    const rC = statsC.rounds[i];
    const circuit = CHAMPIONSHIP_ROUNDS_2026.find((c) => c.round_number === rA.round) || CHAMPIONSHIP_ROUNDS_2026[0];
    const circuitShort = circuit.name.replace(' Grand Prix', ' GP').replace('GP of ', '');

    const gridBest = Math.min(rA.gridPos, rB.gridPos, rC.gridPos);
    let bestRider: 'A' | 'B' | 'C' = 'A';
    if (rB.gridPos === gridBest) bestRider = 'B';
    else if (rC.gridPos === gridBest) bestRider = 'C';

    const deltaA = parseFloat(((rA.gridPos - gridBest) * 0.082).toFixed(3));
    const deltaB = parseFloat(((rB.gridPos - gridBest) * 0.082).toFixed(3));
    const deltaC = parseFloat(((rC.gridPos - gridBest) * 0.082).toFixed(3));

    benchmarkRounds.push({
      round: rA.round,
      circuitName: circuitShort,
      bestRider,
      deltaA,
      deltaB,
      deltaC,
      posA: rA.sundayPos || 20,
      posB: rB.sundayPos || 20,
      posC: rC.sundayPos || 20,
      pointsA: rA.points,
      pointsB: rB.points,
      pointsC: rC.points,
    });
  }

  return {
    riderA,
    riderB,
    riderC,
    statsA,
    statsB,
    statsC,
    duelAB,
    duelAC,
    duelBC,
    benchmarkRounds,
  };
}
