import type { SmartMarket as SmartMarketType, SmartEntry } from '../../types';
import { TrendingUp, TrendingDown, AlertTriangle, Star, Zap } from 'lucide-react';

interface SmartMarketProps {
  market: SmartMarketType;
}

const riskColors = {
  Low: 'text-green-400',
  Medium: 'text-yellow-400',
  High: 'text-red-400',
};

function SmartEntryCard({ entry, variant }: { entry: SmartEntry; variant: 'success' | 'danger' | 'info' | 'value' }) {
  const borderColors = {
    success: 'border-green-500/30 bg-green-500/5',
    danger: 'border-red-500/30 bg-red-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
    value: 'border-yellow-500/30 bg-yellow-500/5',
  };

  return (
    <div className={`rounded-lg border p-3 ${borderColors[variant]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500">{entry.market}</div>
          <div className="text-sm font-semibold text-white truncate">{entry.selection}</div>
          <div className="mt-1 text-xs text-gray-400 leading-relaxed">{entry.reason}</div>
        </div>
        <div className="flex-shrink-0 text-right space-y-1">
          <div className="text-xs text-gray-500">Prob.</div>
          <div className="text-base font-bold text-white">{(entry.probability * 100).toFixed(0)}%</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs">
        <div>
          <span className="text-gray-500">Odd: </span>
          <span className="font-bold text-white">{entry.odd.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-500">EV: </span>
          <span className={`font-bold ${entry.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {entry.expectedValue > 0 ? '+' : ''}{entry.expectedValue.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Conf.: </span>
          <span className={`font-bold ${riskColors[entry.riskLevel]}`}>{entry.confidence}%</span>
        </div>
        <span className={`ml-auto font-semibold ${riskColors[entry.riskLevel]}`}>{entry.riskLevel}</span>
      </div>
    </div>
  );
}

function Section({ title, icon, entries, variant }: {
  title: string;
  icon: React.ReactNode;
  entries: SmartEntry[];
  variant: 'success' | 'danger' | 'info' | 'value';
}) {
  if (entries.length === 0) return null;
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {icon}{title}
        <span className="ml-auto rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">{entries.length}</span>
      </h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <SmartEntryCard key={i} entry={entry} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export default function SmartMarket({ market }: SmartMarketProps) {
  return (
    <div className="space-y-4">
      <Section
        title="Entradas Recomendadas"
        icon={<Star className="h-4 w-4 text-green-400" />}
        entries={market.recommended}
        variant="success"
      />
      <Section
        title="Value Bets"
        icon={<TrendingUp className="h-4 w-4 text-yellow-400" />}
        entries={market.valueBets}
        variant="value"
      />
      <Section
        title="Em Tendência"
        icon={<Zap className="h-4 w-4 text-blue-400" />}
        entries={market.trending}
        variant="info"
      />
      <Section
        title="Entradas Perigosas"
        icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
        entries={market.dangerous}
        variant="danger"
      />
      <Section
        title="Mercados Supervalorizados"
        icon={<TrendingDown className="h-4 w-4 text-orange-400" />}
        entries={market.overvalued}
        variant="danger"
      />
    </div>
  );
}
