"use client";
import { Match } from "@/types";
import { getScoreLabel } from "@/lib/mockData";

interface Props {
  ai: Match["ai"];
  homeName: string;
  awayName: string;
  homeColor: string;
  awayColor: string;
}

const aiModels = [
  { name: "Random Forest", accuracy: 76.4, contribution: 18 },
  { name: "Gradient Boosting", accuracy: 78.2, contribution: 22 },
  { name: "XGBoost", accuracy: 79.1, contribution: 25 },
  { name: "LightGBM", accuracy: 77.8, contribution: 20 },
  { name: "LSTM Neural Net", accuracy: 81.3, contribution: 28 },
  { name: "Bayesian Model", accuracy: 74.6, contribution: 15 },
  { name: "Elo Rating", accuracy: 71.2, contribution: 12 },
  { name: "Poisson", accuracy: 73.8, contribution: 14 },
];

const historicalData = [
  { period: "Últimos 5", homeWins: 3, draws: 1, awayWins: 1 },
  { period: "Últimos 10", homeWins: 6, draws: 2, awayWins: 2 },
  { period: "Últimos 20", homeWins: 11, draws: 5, awayWins: 4 },
  { period: "Em casa", homeWins: 8, draws: 1, awayWins: 1 },
  { period: "Fora", homeWins: 3, draws: 3, awayWins: 4 },
  { period: "H2H (Dir.)", homeWins: 7, draws: 4, awayWins: 5 },
];

export default function AIEngine({ ai, homeColor, awayColor }: Props) {
  const scoreInfo = getScoreLabel(ai.score);

  return (
    <div className="space-y-4">
      {/* AI Score */}
      <div className="bg-gradient-to-br from-gray-900 to-purple-900/20 border border-purple-500/30 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">🤖 PlacarGreen AI Engine</h3>

        {/* Score Circle */}
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90">
              <circle cx="48" cy="48" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke={ai.score >= 80 ? "#10b981" : ai.score >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${(ai.score / 100) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-2xl font-black ${scoreInfo.color}`}>{ai.score}</div>
              <div className="text-xs text-gray-400">/ 100</div>
            </div>
          </div>
          <div>
            <div className={`text-xl font-black ${scoreInfo.color}`}>{scoreInfo.label}</div>
            <div className="text-sm text-gray-400 mt-1">Recomendação: <span className="text-yellow-400 font-bold">{ai.recommendation}</span></div>
            <div className="text-sm text-gray-400">Confiança: <span className="text-blue-400 font-bold">{ai.confidence}%</span></div>
            <div className="text-sm text-gray-400">Valor Esp.: <span className="text-emerald-400 font-bold">+{ai.expectedValue}%</span></div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-black/30 rounded-xl p-3 border border-purple-500/20">
          <div className="text-xs text-purple-400 font-semibold mb-1">💬 Explicação da IA</div>
          <p className="text-sm text-gray-300 leading-relaxed">{ai.explanation}</p>
        </div>
      </div>

      {/* ML Models */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">🧬 Modelos de Machine Learning</h3>
        <div className="space-y-2">
          {aiModels.map((model) => (
            <div key={model.name} className="flex items-center gap-3">
              <div className="w-32 text-xs text-gray-400 truncate">{model.name}</div>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>
              <div className="text-xs text-gray-300 w-12 text-right">{model.accuracy}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Analysis */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">📚 Análise Histórica</h3>
        <div className="space-y-2">
          {historicalData.map((row) => (
            <div key={row.period} className="bg-gray-800/50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-2">{row.period}</div>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold" style={{ color: homeColor }}>{row.homeWins}V</div>
                  <div className="text-xs text-gray-500">Casa</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold text-gray-400">{row.draws}E</div>
                  <div className="text-xs text-gray-500">Empate</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold" style={{ color: awayColor }}>{row.awayWins}V</div>
                  <div className="text-xs text-gray-500">Fora</div>
                </div>
              </div>
              {/* mini bar */}
              <div className="flex h-1.5 mt-2 rounded-full overflow-hidden">
                <div style={{ width: `${(row.homeWins / (row.homeWins + row.draws + row.awayWins)) * 100}%`, backgroundColor: homeColor }} />
                <div style={{ width: `${(row.draws / (row.homeWins + row.draws + row.awayWins)) * 100}%`, backgroundColor: "#6b7280" }} />
                <div style={{ width: `${(row.awayWins / (row.homeWins + row.draws + row.awayWins)) * 100}%`, backgroundColor: awayColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
