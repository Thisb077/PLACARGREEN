import type { ExactScoreOutcome } from '../../types';

interface ExactScoreMarketProps {
  scores: ExactScoreOutcome[];
}

export default function ExactScoreMarket({ scores }: ExactScoreMarketProps) {
  const maxProb = Math.max(...scores.map(s => s.probability));

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
        🎯 Top 10 Placares Mais Prováveis
      </h3>
      <div className="space-y-2">
        {scores.map((score, i) => {
          const barWidth = (score.probability / maxProb) * 100;
          const isTop = i === 0;
          return (
            <div
              key={score.score}
              className={`rounded-lg border p-3 transition-all ${
                isTop ? 'border-green-500/40 bg-green-500/8' : 'border-gray-800 bg-gray-900/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold w-4 text-center ${isTop ? 'text-green-400' : 'text-gray-500'}`}>
                  #{i + 1}
                </span>
                <span className={`text-xl font-bold w-12 text-center ${isTop ? 'text-green-400' : 'text-white'}`}>
                  {score.score}
                </span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bar-fill ${isTop ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-xs font-semibold text-gray-300">
                  {(score.probability * 100).toFixed(1)}%
                </span>
                <div className="text-center w-16">
                  <div className="text-xs text-gray-500">Odd</div>
                  <div className="text-sm font-bold text-white">{score.odd.toFixed(2)}</div>
                </div>
                <div className="text-center w-16">
                  <div className="text-xs text-gray-500">Justa</div>
                  <div className="text-sm font-bold text-blue-300">{score.fairOdd.toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
