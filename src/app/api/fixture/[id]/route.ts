import { NextResponse } from "next/server";
import {
  getFixture,
  getFixtureStatistics,
  getFixtureEvents,
  getFixtureLineups,
} from "@/lib/apiFootball";
import { mapApiFixtureToMatch } from "@/lib/mapApiData";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fixtureId = parseInt(id, 10);

  if (isNaN(fixtureId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Fetch all data in parallel
    const [fixture, statistics, events, lineups] = await Promise.all([
      getFixture(fixtureId),
      getFixtureStatistics(fixtureId),
      getFixtureEvents(fixtureId),
      getFixtureLineups(fixtureId),
    ]);

    if (!fixture) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    const match = mapApiFixtureToMatch({ fixture, statistics, events, lineups });
    return NextResponse.json({ match });
  } catch (err) {
    console.error(`[/api/fixture/${id}]`, err);
    return NextResponse.json({ error: "Erro ao buscar dados da partida" }, { status: 500 });
  }
}
