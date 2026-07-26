import type { AIAnalysis } from '../../types';
import { MarketRow, MarketSection } from './MarketRow';

interface ResultMarketProps {
  analysis: AIAnalysis;
}

export default function ResultMarket({ analysis }: ResultMarketProps) {
  const { resultMarket: r } = analysis;
  return (
    <div className="space-y-4">
      <MarketSection title="Resultado Final" icon="🏆">
        <MarketRow outcome={r.homeWin} highlight={r.homeWin.isValueBet} />
        <MarketRow outcome={r.draw} highlight={r.draw.isValueBet} />
        <MarketRow outcome={r.awayWin} highlight={r.awayWin.isValueBet} />
      </MarketSection>

      <MarketSection title="Dupla Chance" icon="🎯">
        <MarketRow outcome={r.doubleChanceHome} />
        <MarketRow outcome={r.doubleChanceDraw} />
        <MarketRow outcome={r.doubleChanceAway} />
      </MarketSection>
    </div>
  );
}
