export interface Season {
  id: string;
  name: string | null;
  year: number;
  current: boolean;
}

export interface Circuit {
  id?: string;
  name: string;
  place?: string;
  nation?: string;
  length_meters?: number;
  corners?: {
    left: number;
    right: number;
    total: number;
  };
  longest_straight_meters?: number;
  lap_record?: {
    time: string;
    rider: string;
    year: number;
  };
  top_speed_record?: {
    speed_kmh: number;
    rider: string;
    year: number;
  };
}

export interface Event {
  id: string;
  name: string;
  sponsored_name: string;
  short_name: string;
  date_start: string;
  date_end: string;
  season?: {
    id: string;
    year: number;
  };
  circuit: Circuit;
  country: {
    iso: string;
    name: string;
  };
  status?: string;
  test?: boolean;
}

export interface Session {
  id: string;
  name?: string;
  type: 'FP' | 'PR' | 'Q' | 'SPR' | 'WUP' | 'RAC';
  date?: string;
  number?: number;
}

export interface Rider {
  id: string;
  full_name: string;
  name: string;
  surname: string;
  number: number;
  nickname?: string;
  country: {
    iso: string;
    name: string;
    flag?: string;
  };
  birth_date?: string;
  birth_city?: string;
  team_name?: string;
  constructor_name?: string;
  photo_url?: string;
  color?: string;
  stats?: {
    starts: number;
    victories: number;
    podiums: number;
    poles: number;
    world_championships: number;
  };
}

export interface ClassificationRider {
  position: number;
  rider: {
    id: string;
    full_name: string;
    number: number;
    country: {
      iso: string;
      name: string;
    };
  };
  team: {
    id: string;
    name: string;
  };
  constructor: {
    id: string;
    name: string;
  };
  time: string;
  total_laps: number;
  average_speed: number;
  points: number;
  status: string;
  gap: {
    first: string;
    lap: string;
  };
}

export interface LiveTimingRider {
  pos: number;
  order?: number;
  rider_number: string;
  rider_name: string;
  rider_surname: string;
  rider_shortname: string;
  team_name: string;
  bike_name: string;
  color: string;
  text_color?: string;
  lap_time: string;
  last_lap_time: string;
  num_lap: number;
  last_lap: number;
  gap_first: string;
  gap_prev: string;
  on_pit: boolean;
  trac_status?: string; // B = Box, O = Out, etc.
  t1?: string;
  t2?: string;
  t3?: string;
  t4?: string;
  speed?: number;
  tyre_front?: string;
  tyre_rear?: string;
}

export interface LiveTimingState {
  head: {
    category: string;
    circuit_name: string;
    event_tv_name: string;
    session_name: string;
    session_shortname: string;
    remaining: string;
    duration: string;
    session_status_name: string;
    date_formated: string;
    air_temp?: number;
    track_temp?: number;
    humidity?: number;
    condition?: 'Dry' | 'Wet' | 'Mixed';
  };
  rider: Record<string, LiveTimingRider>;
}

export interface StandingRider {
  position: number;
  points: number;
  rider: {
    id: string;
    full_name: string;
    number: number;
    country: {
      iso: string;
      name: string;
    };
  };
  team: {
    name: string;
  };
  constructor: {
    name: string;
  };
}

export interface LapAnalysis {
  lap_number: number;
  lap_time: string;
  lap_time_seconds: number;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
  speed_kmh: number;
  pit: boolean;
  valid: boolean;
}

export interface RiderRacePace {
  rider_name: string;
  rider_number: number;
  team_name: string;
  constructor_name: string;
  color: string;
  front_tyre: string;
  rear_tyre: string;
  laps: LapAnalysis[];
  median_pace: number;
  best_lap: string;
}
