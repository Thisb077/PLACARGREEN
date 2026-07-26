"use client";
import { Match } from "@/types";
import { getScoreLabel } from "@/lib/mockData";

interface Props {
  match: Match;
}

export default function MatchHeader({ match }: Props) {
  const scoreInfo = getScoreLabel(match.ai.score);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 mb-6 shadow-2xl">
      {/* Competition Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
            🏆 {match.competition}
          </span>
          <span className="text-xs text-gray-400">{match.stadium}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>🧑‍⚖️ {match.referee}</span>
          <span>{match.weather}</span>
          <span>🌡️ {match.temperature}°C</span>
          <span>👥 {match.attendance.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Score Block */}
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-5xl">{match.homeTeam.logo}</div>
          <div className="text-xl font-bold text-white">{match.homeTeam.name}</div>
          <div className="text-xs text-gray-400">{match.homeTeam.shortName}</div>
        </div>

        {/* Score Center */}
        <div className="flex flex-col items-center gap-2 px-8">
          <div className="flex items-center gap-4">
            <div
              className="text-6xl font-black text-white drop-shadow-lg"
              style={{ color: match.homeTeam.color }}
            >
              {match.homeScore}
            </div>
            <div className="text-3xl text-gray-500 font-thin">—</div>
            <div
              className="text-6xl font-black text-white drop-shadow-lg"
              style={{ color: match.awayTeam.color }}
            >
              {match.awayScore}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {match.status === "LIVE" && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-400 font-bold text-sm">{match.minute}&apos;</span>
              </span>
            )}
            <span className="text-gray-400 text-xs">{match.status}</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-5xl">{match.awayTeam.logo}</div>
          <div className="text-xl font-bold text-white">{match.awayTeam.name}</div>
          <div className="text-xs text-gray-400">{match.awayTeam.shortName}</div>
        </div>
      </div>

      {/* AI Summary Row */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Score IA</div>
          <div className={`text-2xl font-black ${scoreInfo.color}`}>{match.ai.score}</div>
          <div className={`text-xs font-bold ${scoreInfo.color}`}>{scoreInfo.label}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Confiança</div>
          <div className="text-2xl font-black text-blue-400">{match.ai.confidence}%</div>
          <div className="text-xs text-blue-300/70">IA Engine</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Valor Esperado</div>
          <div className="text-2xl font-black text-emerald-400">+{match.ai.expectedValue}%</div>
          <div className="text-xs text-emerald-300/70">EV positivo</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Favorito IA</div>
          <div className="text-lg font-black text-white">
            {match.ai.favorite === "home"
              ? match.homeTeam.shortName
              : match.ai.favorite === "away"
              ? match.awayTeam.shortName
              : "Empate"}
          </div>
          <div className="text-xs text-yellow-400">{match.ai.recommendation}</div>
        </div>
      </div>

      {/* AI Trend */}
      <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <div className="text-xs text-blue-300 font-semibold mb-1">📈 Tendência do Jogo</div>
        <p className="text-sm text-gray-300">{match.ai.trend}</p>
      </div>
    </div>
  );
}
