import type { AIAnalysis } from '../../types';
import { MarketRow, MarketSection } from './MarketRow';
import { Clock } from 'lucide-react';

interface CornersMarketProps {
  analysis: AIAnalysis;
}

export default function CornersMarket({ analysis }: CornersMarketProps) {
  const c = analysis.cornersMarket;
  return (
    <div className="space-y-4">
      <MarketSection title="Over / Under Escanteios" icon="🚩">
        <MarketRow outcome={c.over75} />
        <MarketRow outcome={c.over85} />
        <MarketRow outcome={c.over95} />
        <MarketRow outcome={c.over105} />
        <MarketRow outcome={c.under75} />
        <MarketRow outcome={c.under85} />
      </MarketSection>

      <MarketSection title="Handicap Escanteios" icon="⚖️">
        <MarketRow outcome={c.homeMore} />
        <MarketRow outcome={c.awayMore} />
      </MarketSection>

      <MarketSection title="Escanteios por Período" icon="⏱">
        <MarketRow outcome={c.cornerHT} />
        <MarketRow outcome={c.cornerST} />
      </MarketSection>

      <MarketSection title="Próximo Escanteio" icon="🎯">
        <MarketRow outcome={c.nextCorner} />
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-2 text-sm">
          <Clock className="h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Tempo provável do próximo escanteio:</span>
          <span className="font-bold text-blue-400">~{c.nextCornerTime} min</span>
        </div>
      </MarketSection>
    </div>
  );
}
