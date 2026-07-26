import type { AIAnalysis } from '../../types';

interface AIScoreProps {
  analysis: AIAnalysis;
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excepcional', color: 'text-green-300' };
  if (score >= 75) return { label: 'Muito Forte', color: 'text-green-400' };
  if (score >= 60) return { label: 'Forte', color: 'text-emerald-400' };
  if (score >= 45) return { label: 'Moderado', color: 'text-yellow-400' };
  if (score >= 30) return { label: 'Fraco', color: 'text-orange-400' };
  return { label: 'Evitar', color: 'text-red-400' };
}

function trendLabel(trend: string): string {
  const map: Record<string, string> = {
    home_dominant: '🔥 Casa Dominante',
    away_dominant: '⚡ Fora Dominante',
    balanced: '⚖️ Equilibrado',
    attacking: '🎯 Jogo Ofensivo',
    defensive: '🛡️ Jogo Fechado',
  };
  return map[trend] ?? trend;
}

const circumference = 2 * Math.PI * 45;

export default function AIScore({ analysis }: AIScoreProps) {
  const { score, confidence, favorite, expectedValue, trend, simulationResults: sim } = analysis;
  const { label, color } = scoreLabel(score);
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const favoriteLabel = favorite === 'home' ? 'Casa' : favorite === 'away' ? 'Fora' : 'Empate';

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Score IA — PlacarGreen AI Engine</h3>

      <div className="flex items-center gap-6">
        {/* Score ring */}
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" className="-rotate-90">
            <circle cx="55" cy="55" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="55" cy="55" r="45"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className={`text-xs font-semibold ${color}`}>{label}</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Favorito IA</span>
            <span className="text-sm font-bold text-green-400">{favoriteLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Confiança</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-700"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-white">{confidence}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Valor Esperado</span>
            <span className={`text-sm font-bold ${expectedValue > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {expectedValue > 0 ? '+' : ''}{expectedValue.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Tendência</span>
            <span className="text-xs font-semibold text-blue-400">{trendLabel(trend)}</span>
          </div>
        </div>
      </div>

      {/* Simulation results */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-800/50 p-3">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{(sim.homeWin * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">Vitória Casa</div>
        </div>
        <div className="text-center border-x border-gray-700">
          <div className="text-lg font-bold text-gray-300">{(sim.draw * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">Empate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{(sim.awayWin * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-gray-500">Vitória Fora</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600">
        <span>{sim.runs.toLocaleString()} simulações Monte Carlo</span>
        <span>Placar mais provável: {sim.mostLikelyScore}</span>
      </div>

      {/* AI Explanation */}
      <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs font-semibold text-green-400">🤖 Explicação da IA</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{analysis.explanation}</p>
      </div>
    </div>
  );
}
