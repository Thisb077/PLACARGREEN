import type { AIAnalysis } from '../../types';
import { MarketRow, MarketSection } from './MarketRow';

interface GoalsMarketProps {
  analysis: AIAnalysis;
}

export default function GoalsMarket({ analysis }: GoalsMarketProps) {
  const g = analysis.goalsMarket;
  return (
    <div className="space-y-4">
      <MarketSection title="Over / Under Gols" icon="⚽">
        <MarketRow outcome={g.over05} />
        <MarketRow outcome={g.over15} />
        <MarketRow outcome={g.over25} highlight={g.over25.isValueBet} />
        <MarketRow outcome={g.over35} />
        <MarketRow outcome={g.over45} />
        <MarketRow outcome={g.over55} />
        <MarketRow outcome={g.under05} />
        <MarketRow outcome={g.under15} />
        <MarketRow outcome={g.under25} />
        <MarketRow outcome={g.under35} />
        <MarketRow outcome={g.under45} />
      </MarketSection>

      <MarketSection title="BTTS — Ambas Marcam" icon="🎰">
        <MarketRow outcome={g.btts} highlight={g.btts.isValueBet} />
        <MarketRow outcome={g.bttsNo} />
      </MarketSection>

      <MarketSection title="Próximo Gol" icon="🚀">
        <MarketRow outcome={g.nextGoal} />
        <MarketRow outcome={g.noGoal} />
      </MarketSection>

      <MarketSection title="Gol por Período" icon="⏱">
        <MarketRow outcome={g.goalHT} />
        <MarketRow outcome={g.goalST} />
      </MarketSection>

      <MarketSection title="Gol nos Próximos Minutos" icon="⚡">
        <MarketRow outcome={g.goalNext5} />
        <MarketRow outcome={g.goalNext10} />
        <MarketRow outcome={g.goalNext15} />
      </MarketSection>
    </div>
  );
}
