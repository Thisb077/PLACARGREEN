"use client";
import { mockExactScores } from "@/lib/mockData";

export default function ExactScoreMarket() {
  const maxProb = Math.max(...mockExactScores.map(s => s.probability));

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">🎯 Mercado Placar Exato</h3>
      <div className="text-xs text-gray-400 mb-3">Top 10 Placares Mais Prováveis</div>
      <div className="space-y-2">
        {mockExactScores.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 text-center text-xs text-gray-500 font-bold">#{i + 1}</div>
            <div className="w-12 text-center text-sm font-black text-white bg-gray-800 rounded-lg py-1 border border-gray-700">
              {item.score}
            </div>
            <div className="flex-1 relative">
              <div className="h-6 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${(item.probability / maxProb) * 100}%`,
                    background: i === 0
                      ? "linear-gradient(90deg, #10b981, #059669)"
                      : i < 3
                      ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                      : "linear-gradient(90deg, #4b5563, #374151)",
                  }}
                >
                  <span className="text-xs font-bold text-white">{item.probability.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div
              className={`text-xs font-semibold w-14 text-right ${
                item.change > 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.change > 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <div className="text-xs text-blue-300 font-semibold mb-1">💡 Análise IA</div>
        <div className="text-xs text-gray-300">
          Modelo Poisson ajustado com xG ao vivo prevê <strong className="text-white">2-1 para o Flamengo</strong> como
          placar mais provável (18.4%). Baseado em 100.000 simulações Monte Carlo.
        </div>
      </div>
    </div>
  );
}
