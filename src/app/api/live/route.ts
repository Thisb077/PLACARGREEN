import { NextResponse } from "next/server";
import { getLiveFixtures } from "@/lib/apiFootball";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const fixtures = await getLiveFixtures();
    const matches = fixtures.map((f) => ({
      id: f.fixture.id,
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      homeScore: f.goals.home ?? 0,
      awayScore: f.goals.away ?? 0,
      minute: f.fixture.status.elapsed ?? 0,
      status: f.fixture.status.short,
      competition: f.league.name,
      country: f.league.country,
    }));

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("[/api/live]", err);
    // Return 503 so the client can distinguish an API error from "no live matches"
    return NextResponse.json(
      { matches: [], error: "Não foi possível obter partidas ao vivo" },
      { status: 503 }
    );
  }
}
