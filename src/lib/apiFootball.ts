const BASE_URL = process.env.FOOTBALL_API_URL ?? "https://v3.football.api-sports.io";
const API_KEY = process.env.FOOTBALL_API_KEY ?? "";

async function fetchApi<T>(path: string): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      "FOOTBALL_API_KEY is not configured. Set it in .env.local before using the API proxy."
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "x-apisports-key": API_KEY,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`API Football error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json as T;
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface ApiFixtureItem {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface ApiStatisticItem {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

export interface ApiEventItem {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
}

export interface ApiPlayerItem {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string | null;
  };
}

export interface ApiLineupItem {
  team: { id: number; name: string; logo: string };
  formation: string | null;
  startXI: ApiPlayerItem[];
  substitutes: ApiPlayerItem[];
}

export interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[];
  results: number;
  paging: { current: number; total: number };
  response: T;
}

// ─── Public API functions ─────────────────────────────────────────────────────

/** Returns all currently live fixtures. */
export async function getLiveFixtures(): Promise<ApiFixtureItem[]> {
  const data = await fetchApi<ApiResponse<ApiFixtureItem[]>>("/fixtures?live=all");
  return data.response;
}

/** Returns a single fixture by ID. */
export async function getFixture(id: number): Promise<ApiFixtureItem | null> {
  const data = await fetchApi<ApiResponse<ApiFixtureItem[]>>(`/fixtures?id=${id}`);
  return data.response[0] ?? null;
}

/** Returns per-team statistics for a fixture. */
export async function getFixtureStatistics(
  fixtureId: number
): Promise<ApiStatisticItem[]> {
  const data = await fetchApi<ApiResponse<ApiStatisticItem[]>>(
    `/fixtures/statistics?fixture=${fixtureId}`
  );
  return data.response;
}

/** Returns all events (goals, cards, subs) for a fixture. */
export async function getFixtureEvents(fixtureId: number): Promise<ApiEventItem[]> {
  const data = await fetchApi<ApiResponse<ApiEventItem[]>>(
    `/fixtures/events?fixture=${fixtureId}`
  );
  return data.response;
}

/** Returns lineups for both teams. */
export async function getFixtureLineups(fixtureId: number): Promise<ApiLineupItem[]> {
  const data = await fetchApi<ApiResponse<ApiLineupItem[]>>(
    `/fixtures/lineups?fixture=${fixtureId}`
  );
  return data.response;
}
