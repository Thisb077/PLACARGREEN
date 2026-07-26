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
    // Fetch the fixture first; only fetch supporting data if the fixture exists
    const fixture = await getFixture(fixtureId);

    if (!fixture) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    // Fixture confirmed — fetch remaining data in parallel
    const [statistics, events, lineups] = await Promise.all([
      getFixtureStatistics(fixtureId),
      getFixtureEvents(fixtureId),
      getFixtureLineups(fixtureId),
    ]);

    const match = mapApiFixtureToMatch({ fixture, statistics, events, lineups });
    return NextResponse.json({ match });
  } catch (err) {
    console.error(`[/api/fixture/${id}]`, err);
    return NextResponse.json({ error: "Erro ao buscar dados da partida" }, { status: 500 });
  }
}

