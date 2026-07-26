import type { AIAnalysis } from '../../types';
import { MarketRow, MarketSection } from './MarketRow';

interface CardsMarketProps {
  analysis: AIAnalysis;
}

export default function CardsMarket({ analysis }: CardsMarketProps) {
  const c = analysis.cardsMarket;
  return (
    <div className="space-y-4">
      <MarketSection title="Over / Under Cartões" icon="🟨">
        <MarketRow outcome={c.over15} />
        <MarketRow outcome={c.over25} />
        <MarketRow outcome={c.over35} />
        <MarketRow outcome={c.over45} />
        <MarketRow outcome={c.under15} />
        <MarketRow outcome={c.under25} />
      </MarketSection>

      <MarketSection title="Próximo Cartão" icon="🎴">
        <MarketRow outcome={c.firstCard} />
        <MarketRow outcome={c.nextCard} />
        <MarketRow outcome={c.homeMoreCards} />
      </MarketSection>

      <MarketSection title="Cartões por Período" icon="⏱">
        <MarketRow outcome={c.cardHT} />
        <MarketRow outcome={c.cardST} />
      </MarketSection>

      <MarketSection title="Disciplinar" icon="🟥">
        <MarketRow outcome={c.redCard} />
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-2 text-sm">
          <span className="text-gray-400">Probabilidade disciplinar geral:</span>
          <span className="ml-2 font-bold text-orange-400">{(c.disciplinaryProb * 100).toFixed(0)}%</span>
        </div>
      </MarketSection>
    </div>
  );
}
