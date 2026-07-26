import type { MarketOutcome } from '../../types';
import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface MarketRowProps {
  outcome: MarketOutcome;
  highlight?: boolean;
}

const riskColor = {
  Low: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  High: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export function MarketRow({ outcome, highlight }: MarketRowProps) {
  const [expanded, setExpanded] = useState(false);
  const p = outcome.probability.ai * 100;

  return (
    <div className={`rounded-lg border transition-all ${highlight ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 bg-gray-900/40'}`}>
      <div
        className="flex cursor-pointer items-center gap-3 p-3"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Label + value badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{outcome.label}</span>
            {outcome.isValueBet && (
              <span className="flex items-center gap-0.5 rounded bg-green-500/20 px-1 py-0.5 text-[10px] text-green-400 border border-green-500/30">
                <TrendingUp className="h-2.5 w-2.5" /> VALUE
              </span>
            )}
          </div>
          {/* Probability bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-800">
              <div
                className={`h-full rounded-full bar-fill ${outcome.isValueBet ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${p}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-300 w-8 text-right">{p.toFixed(0)}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center">
            <div className="text-xs text-gray-500">Odd</div>
            <div className="text-sm font-bold text-white">{outcome.currentOdd.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Justa</div>
            <div className="text-sm font-bold text-blue-300">{outcome.fairOdd.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">EV</div>
            <div className={`text-sm font-bold ${outcome.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {outcome.expectedValue > 0 ? '+' : ''}{outcome.expectedValue.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Conf.</div>
            <div className="text-sm font-bold text-white">{outcome.confidence}%</div>
          </div>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${riskColor[outcome.riskLevel]}`}>
            {outcome.riskLevel}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </div>
      </div>

      {/* Expanded: probabilities breakdown + explanation */}
      {expanded && (
        <div className="border-t border-gray-800 px-3 pb-3 pt-2 space-y-2 animate-fade-in">
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {[
              ['Pré-Jogo', outcome.probability.preMatch],
              ['Ao Vivo', outcome.probability.live],
              ['IA', outcome.probability.ai],
              ['Matemática', outcome.probability.mathematical],
              ['Estatística', outcome.probability.statistical],
              ['ML', outcome.probability.ml],
            ].map(([label, val]) => (
              <div key={label as string} className="rounded bg-gray-800/60 p-2 text-center">
                <div className="text-gray-500">{label as string}</div>
                <div className="font-bold text-white">{((val as number) * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{outcome.aiExplanation}</p>
        </div>
      )}
    </div>
  );
}

interface MarketSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export function MarketSection({ title, icon, children }: MarketSectionProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {icon && <span className="mr-1.5">{icon}</span>}{title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
