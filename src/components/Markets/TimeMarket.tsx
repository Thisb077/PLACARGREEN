import type { AIAnalysis } from '../../types';
import { MarketRow, MarketSection } from './MarketRow';

interface TimeMarketProps {
  analysis: AIAnalysis;
}

export default function TimeMarket({ analysis }: TimeMarketProps) {
  const t = analysis.timeMarkets;
  return (
    <div className="space-y-4">
      <MarketSection title="Primeiro Gol" icon="🥇">
        <MarketRow outcome={t.firstScorer.home} />
        <MarketRow outcome={t.firstScorer.draw} />
        <MarketRow outcome={t.firstScorer.away} />
      </MarketSection>

      <MarketSection title="Último Gol" icon="🏁">
        <MarketRow outcome={t.lastScorer.home} />
        <MarketRow outcome={t.lastScorer.away} />
      </MarketSection>

      <MarketSection title="Intervalo de Tempo do Gol" icon="⏰">
        {(Object.values(t.goalIntervals) as import('../../types').MarketOutcome[]).map(outcome => (
          <MarketRow key={outcome.label} outcome={outcome} />
        ))}
      </MarketSection>
    </div>
  );
}
