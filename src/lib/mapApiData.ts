import type {
  ApiFixtureItem,
  ApiStatisticItem,
  ApiEventItem,
  ApiLineupItem,
} from "./apiFootball";
import type {
  Match,
  Team,
  Player,
  LiveMatchStats,
  TimelineEvent,
  MomentumPoint,
  AIAnalysis,
  Odds,
} from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statNum(stats: ApiStatisticItem["statistics"], type: string): number {
  const found = stats.find((s) => s.type === type);
  if (found == null || found.value == null) return 0;
  if (typeof found.value === "number") return found.value;
  // possession comes as "55%"
  return parseFloat(String(found.value).replace("%", "")) || 0;
}

function statusToAppStatus(short: string): Match["status"] {
  switch (short) {
    case "1H":
    case "2H":
    case "ET":
    case "BT":
    case "P":
    case "INT":
    case "LIVE":
      return "LIVE";
    case "HT":
      return "HT";
    case "FT":
    case "AET":
    case "PEN":
      return "FT";
    default:
      return "UPCOMING";
  }
}

function teamLogoEmoji(teamName: string): string {
  // Emoji logos are not available from the API; use a generic ball
  const logos: Record<string, string> = {
    flamengo: "🔴",
    palmeiras: "🟢",
    corinthians: "⚫",
    "são paulo": "🔴",
    "atletico-mg": "🔵",
    "atletico mineiro": "🔵",
    fluminense: "🔴",
    grêmio: "🔵",
    internacional: "🔴",
    santos: "⚪",
    cruzeiro: "🔵",
    botafogo: "⚪",
    vasco: "⚪",
    bahia: "🔵",
    fortaleza: "🔴",
    atletico: "🔵",
  };
  return logos[teamName.toLowerCase()] ?? "⚽";
}

function teamColor(teamId: number): string {
  const colors: Record<number, string> = {
    133: "#E31D3C",  // Flamengo
    1062: "#006437", // Palmeiras
    131: "#1A1A1A",  // Corinthians
    126: "#E31D3C",  // São Paulo
    127: "#000080",  // Atletico MG
    129: "#70134A",  // Fluminense
    130: "#0066CC",  // Grêmio
    119: "#E31D3C",  // Internacional
    132: "#FFFFFF",  // Santos
    1624: "#0033A0", // Cruzeiro
    128: "#000000",  // Botafogo
    141: "#FFFFFF",  // Vasco
  };
  // Generate a deterministic colour from the ID for unknown teams
  const hue = (teamId * 137.5) % 360;
  return colors[teamId] ?? `hsl(${hue}, 65%, 45%)`;
}

function mapTeam(apiTeam: ApiFixtureItem["teams"]["home"]): Team {
  return {
    id: String(apiTeam.id),
    name: apiTeam.name,
    // Always produce a 3-character abbreviation regardless of original length
    shortName: apiTeam.name.slice(0, 3).toUpperCase(),
    logo: teamLogoEmoji(apiTeam.name),
    color: teamColor(apiTeam.id),
  };
}

function mapStats(
  homeStats: ApiStatisticItem["statistics"],
  awayStats: ApiStatisticItem["statistics"]
): LiveMatchStats {
  const homeXG = statNum(homeStats, "expected_goals");
  const awayXG = statNum(awayStats, "expected_goals");

  return {
    possession: [statNum(homeStats, "Ball Possession"), statNum(awayStats, "Ball Possession")],
    shots: [statNum(homeStats, "Total Shots"), statNum(awayStats, "Total Shots")],
    shotsOnTarget: [statNum(homeStats, "Shots on Goal"), statNum(awayStats, "Shots on Goal")],
    corners: [statNum(homeStats, "Corner Kicks"), statNum(awayStats, "Corner Kicks")],
    fouls: [statNum(homeStats, "Fouls"), statNum(awayStats, "Fouls")],
    yellowCards: [statNum(homeStats, "Yellow Cards"), statNum(awayStats, "Yellow Cards")],
    redCards: [statNum(homeStats, "Red Cards"), statNum(awayStats, "Red Cards")],
    attacks: [
      statNum(homeStats, "Total attacks") || statNum(homeStats, "Total Attacks"),
      statNum(awayStats, "Total attacks") || statNum(awayStats, "Total Attacks"),
    ],
    dangerousAttacks: [
      statNum(homeStats, "Dangerous Attacks"),
      statNum(awayStats, "Dangerous Attacks"),
    ],
    xG: [homeXG, awayXG],
    xGA: [awayXG, homeXG],
    bigChances: [
      statNum(homeStats, "Big Chances") || statNum(homeStats, "big_chances_created"),
      statNum(awayStats, "Big Chances") || statNum(awayStats, "big_chances_created"),
    ],
  };
}

function mapEvents(
  events: ApiEventItem[],
  homeTeamId: number
): TimelineEvent[] {
  return events
    .filter((e) => ["Goal", "Card", "subst", "Var"].includes(e.type))
    .map((e): TimelineEvent => {
      const team: "home" | "away" = e.team.id === homeTeamId ? "home" : "away";
      let type: TimelineEvent["type"] = "corner";

      if (e.type === "Goal") {
        type = "goal";
      } else if (e.type === "Card") {
        type = e.detail === "Yellow Card" ? "yellowCard" : "redCard";
      } else if (e.type === "subst") {
        type = "substitution";
      }

      return {
        minute: e.time.elapsed,
        type,
        team,
        player: e.player.name,
        description:
          e.type === "Goal"
            ? `GOL! ${e.player.name}`
            : e.type === "subst"
            ? `${e.player.name} ↔ ${e.assist?.name ?? ""}`
            : `${e.detail} — ${e.player.name}`,
      };
    });
}

function mapPlayers(lineup: ApiLineupItem | undefined, teamId: string): Player[] {
  if (!lineup) return [];
  return lineup.startXI.map((item): Player => ({
    id: String(item.player.id),
    name: item.player.name,
    number: item.player.number,
    position: item.player.pos ?? "MID",
    teamId,
    stats: {
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      passes: 0,
      passAccuracy: 0,
      keyPasses: 0,
      tackles: 0,
      interceptions: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
      corners: 0,
      dribbles: 0,
      form: 75,
      avgRating: 7.0,
    },
  }));
}

function buildMomentumData(
  events: ApiEventItem[],
  elapsed: number,
  homeTeamId: number
): MomentumPoint[] {
  // Build approximate momentum from events at each 5-minute interval
  const maxMin = Math.max(elapsed, 5);
  const points: MomentumPoint[] = [];
  let homeXG = 0;
  let awayXG = 0;

  for (let min = 5; min <= maxMin; min += 5) {
    // Count events in window
    const windowEvents = events.filter(
      (e) => e.time.elapsed >= min - 5 && e.time.elapsed < min
    );
    const homeGoals = windowEvents.filter(
      (e) => e.type === "Goal" && e.team.id === homeTeamId && e.detail !== "Own Goal"
    ).length;
    const awayGoals = windowEvents.filter(
      (e) => e.type === "Goal" && e.team.id !== homeTeamId && e.detail !== "Own Goal"
    ).length;

    homeXG += homeGoals * 1.0 + (homeGoals === 0 ? 0.05 : 0);
    // Slightly lower baseline for away team (0.03) to reflect home-field advantage
    awayXG += awayGoals * 1.0 + (awayGoals === 0 ? 0.03 : 0);

    // Simple momentum: 50 baseline, shifted by recent goal activity
    const recentHomeActivity = windowEvents.filter((e) => e.team.id === homeTeamId).length;
    const recentAwayActivity = windowEvents.filter((e) => e.team.id !== homeTeamId).length;
    const total = recentHomeActivity + recentAwayActivity + 1;
    const homeMomentum = Math.round(50 + ((recentHomeActivity / total) - 0.5) * 40);

    points.push({
      minute: min,
      home: Math.max(10, Math.min(90, homeMomentum)),
      away: Math.max(10, Math.min(90, 100 - homeMomentum)),
      xGHome: parseFloat(homeXG.toFixed(2)),
      xGAway: parseFloat(awayXG.toFixed(2)),
    });
  }

  return points.length > 0 ? points : [{ minute: 1, home: 50, away: 50, xGHome: 0, xGAway: 0 }];
}

function computeAI(
  stats: LiveMatchStats,
  homeScore: number,
  awayScore: number,
  elapsed: number
): AIAnalysis {
  const [homePoss, awayPoss] = stats.possession;
  const [homeXG, awayXG] = stats.xG;
  const [homeShotsOT] = stats.shotsOnTarget;
  const [homeDanger, awayDanger] = stats.dangerousAttacks;

  // Simple scoring: weighted sum
  const homeDomination =
    (homePoss / 100) * 0.25 +
    (homeXG / Math.max(homeXG + awayXG, 0.1)) * 0.35 +
    (homeShotsOT / Math.max(stats.shotsOnTarget[0] + stats.shotsOnTarget[1], 1)) * 0.2 +
    (homeDanger / Math.max(homeDanger + awayDanger, 1)) * 0.2;

  const score = Math.round(50 + (homeDomination - 0.5) * 80);
  const clampedScore = Math.max(10, Math.min(99, score));

  let favorite: AIAnalysis["favorite"] = "draw";
  if (homeXG > awayXG + 0.3) favorite = "home";
  else if (awayXG > homeXG + 0.3) favorite = "away";

  const confidence = Math.min(95, Math.round(50 + Math.abs(homeXG - awayXG) * 15 + elapsed * 0.3));

  const homeWinProb = favorite === "home" ? 0.55 + (homeXG - awayXG) * 0.1 : 0.35;
  const fairOdds = homeWinProb > 0 ? 1 / homeWinProb : 3;
  const marketOdds = fairOdds * 0.9; // typical margin
  const ev = parseFloat(((marketOdds / fairOdds - 1) * 100).toFixed(1));

  let recommendation: AIAnalysis["recommendation"] = "MODERADO";
  if (clampedScore >= 85) recommendation = "FORTE";
  else if (clampedScore >= 75) recommendation = "BOM";
  else if (clampedScore >= 60) recommendation = "MODERADO";
  else if (clampedScore >= 40) recommendation = "FRACO";
  else recommendation = "EVITAR";

  const trend =
    homeXG > awayXG
      ? `Time da casa em vantagem de xG (${homeXG.toFixed(2)} vs ${awayXG.toFixed(2)}). Pressão crescente.`
      : awayXG > homeXG
      ? `Time visitante em vantagem de xG (${awayXG.toFixed(2)} vs ${homeXG.toFixed(2)}).`
      : "Jogo equilibrado. Nenhum time domina claramente.";

  const explanation = `Análise baseada em dados ao vivo: posse ${homePoss}%/${awayPoss}%, xG ${homeXG.toFixed(2)}/${awayXG.toFixed(2)}, placar atual ${homeScore}–${awayScore} aos ${elapsed}'.`;

  return {
    score: clampedScore,
    confidence,
    favorite,
    expectedValue: ev,
    trend,
    explanation,
    recommendation,
  };
}

function computeOdds(stats: LiveMatchStats, homeScore: number, awayScore: number): Odds {
  const [homeXG, awayXG] = stats.xG;
  const totalXG = homeXG + awayXG || 1;

  // Base win probability from xG share (70%), adjusted by current score (±10–20%)
  const homeScoreBonus = homeScore > awayScore ? 0.2 : homeScore < awayScore ? -0.1 : 0;
  const awayScoreBonus = awayScore > homeScore ? 0.2 : awayScore < homeScore ? -0.1 : 0;

  const homeWinProb = Math.min(0.85, Math.max(0.05, (homeXG / totalXG) * 0.7 + homeScoreBonus));
  const awayWinProb = Math.min(0.85, Math.max(0.05, (awayXG / totalXG) * 0.7 + awayScoreBonus));
  const drawProb = Math.max(0.05, 1 - homeWinProb - awayWinProb);

  // 8% bookmaker overround — typical for main markets on major leagues
  const margin = 1.08;

  return {
    homeWin: parseFloat((margin / homeWinProb).toFixed(2)),
    draw: parseFloat((margin / drawProb).toFixed(2)),
    awayWin: parseFloat((margin / awayWinProb).toFixed(2)),
    over25: parseFloat((margin / Math.min(0.9, Math.max(0.1, totalXG / 2.5 * 0.6))).toFixed(2)),
    under25: parseFloat((margin / Math.min(0.9, Math.max(0.1, 1 - totalXG / 2.5 * 0.6))).toFixed(2)),
    btts: parseFloat((margin / Math.min(0.85, Math.max(0.1, (homeXG / totalXG) * (awayXG / totalXG) * 4))).toFixed(2)),
    bttsNo: parseFloat((margin / Math.min(0.85, Math.max(0.1, 1 - (homeXG / totalXG) * (awayXG / totalXG) * 4))).toFixed(2)),
  };
}

// ─── Main mapper ──────────────────────────────────────────────────────────────

export interface ApiFullFixture {
  fixture: ApiFixtureItem;
  statistics: ApiStatisticItem[];
  events: ApiEventItem[];
  lineups: ApiLineupItem[];
}

export function mapApiFixtureToMatch(data: ApiFullFixture): Match {
  const { fixture, statistics, events, lineups } = data;
  const homeTeamApi = fixture.teams.home;
  const awayTeamApi = fixture.teams.away;

  const homeTeam = mapTeam(homeTeamApi);
  const awayTeam = mapTeam(awayTeamApi);

  // Statistics per team (index 0 = home, index 1 = away)
  const homeStatsRaw = statistics.find((s) => s.team.id === homeTeamApi.id)?.statistics ?? [];
  const awayStatsRaw = statistics.find((s) => s.team.id === awayTeamApi.id)?.statistics ?? [];

  const stats = mapStats(homeStatsRaw, awayStatsRaw);
  const timeline = mapEvents(events, homeTeamApi.id);
  const homeScore = fixture.goals.home ?? 0;
  const awayScore = fixture.goals.away ?? 0;
  const elapsed = fixture.fixture.status.elapsed ?? 0;

  const homeLineup = lineups.find((l) => l.team.id === homeTeamApi.id);
  const awayLineup = lineups.find((l) => l.team.id === awayTeamApi.id);

  return {
    id: String(fixture.fixture.id),
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    minute: elapsed,
    status: statusToAppStatus(fixture.fixture.status.short),
    competition: `${fixture.league.name} — ${fixture.league.country}`,
    stadium: fixture.fixture.venue.name ?? "Estádio desconhecido",
    referee: fixture.fixture.referee ?? "Árbitro desconhecido",
    weather: "—",
    temperature: 22,
    attendance: 0,
    stats,
    odds: computeOdds(stats, homeScore, awayScore),
    ai: computeAI(stats, homeScore, awayScore, elapsed),
    homePlayers: mapPlayers(homeLineup, homeTeam.id),
    awayPlayers: mapPlayers(awayLineup, awayTeam.id),
    timeline,
    momentumData: buildMomentumData(events, elapsed, homeTeamApi.id),
  };
}
