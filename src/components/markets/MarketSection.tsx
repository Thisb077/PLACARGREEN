"use client";
import { Market } from "@/types";

interface Props {
  markets: Market[];
  title: string;
  icon: string;
}

function MarketCard({ market }: { market: Market }) {
  const evColor = market.expectedValue > 0 ? "text-emerald-400" : "text-red-400";
  const evBg = market.expectedValue > 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30";

  return (
    <div className={`rounded-xl p-4 border ${evBg} mb-3`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-bold text-white">{market.name}</div>
          {market.value && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              💎 VALUE BET
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-white">{market.odds}</div>
          <div className="text-xs text-gray-400">Odd atual</div>
        </div>
      </div>

      {/* Probability Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Pré-Jogo</div>
          <div className="text-sm font-bold text-white">{market.preGameProb}%</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Ao Vivo</div>
          <div className="text-sm font-bold text-blue-400">{market.liveProb}%</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">IA</div>
          <div className="text-sm font-bold text-purple-400">{market.aiProb}%</div>
        </div>
      </div>

      {/* ML/Math/Stat row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-500">Matemática</div>
          <div className="text-xs font-semibold text-gray-300">{market.mathProb}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Estatística</div>
          <div className="text-xs font-semibold text-gray-300">{market.statProb}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">ML</div>
          <div className="text-xs font-semibold text-gray-300">{market.mlProb}%</div>
        </div>
      </div>

      {/* EV, Confidence, Risk, Fair Odds */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-400">Valor Esp.</div>
          <div className={`text-sm font-black ${evColor}`}>
            {market.expectedValue > 0 ? "+" : ""}{market.expectedValue}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Confiança</div>
          <div className="text-sm font-bold text-blue-400">{market.confidence}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Risco</div>
          <div className={`text-xs font-bold ${market.risk === 'BAIXO' ? 'text-emerald-400' : market.risk === 'MÉDIO' ? 'text-yellow-400' : 'text-red-400'}`}>
            {market.risk}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Odd Justa</div>
          <div className="text-sm font-bold text-yellow-400">{market.fairOdds}</div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-2">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${market.confidence}%` }}
          />
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-black/20 rounded-lg p-2">
        <div className="text-xs text-gray-300 italic">💡 {market.explanation}</div>
      </div>
    </div>
  );
}

export default function MarketSection({ markets, title, icon }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">
        {icon} {title}
      </h3>
      {markets.map((m, i) => (
        <MarketCard key={i} market={m} />
      ))}
    </div>
  );
}
