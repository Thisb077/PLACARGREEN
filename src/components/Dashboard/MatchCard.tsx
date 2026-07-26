import type { LiveMatch } from '../../types';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface MatchCardProps {
  match: LiveMatch;
  isSelected: boolean;
  onClick: () => void;
}

const weatherIcon = (cond: string) => {
  if (cond === 'Sunny') return <Sun className="h-3.5 w-3.5 text-yellow-400" />;
  if (cond === 'Rainy') return <CloudRain className="h-3.5 w-3.5 text-blue-400" />;
  if (cond === 'Windy') return <Wind className="h-3.5 w-3.5 text-gray-400" />;
  return <Cloud className="h-3.5 w-3.5 text-gray-400" />;
};

const statusColor = (status: string) => {
  if (status === 'Live') return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (status === 'HT') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
};

const formDot = (r: string) => {
  if (r === 'W') return 'bg-green-500';
  if (r === 'L') return 'bg-red-500';
  return 'bg-gray-500';
};

export default function MatchCard({ match, isSelected, onClick }: MatchCardProps) {
  const ai = match.aiAnalysis;
  const homeWinP = (ai?.resultMarket?.homeWin?.probability?.ai ?? 0) * 100;
  const drawP = (ai?.resultMarket?.draw?.probability?.ai ?? 0) * 100;
  const awayWinP = (ai?.resultMarket?.awayWin?.probability?.ai ?? 0) * 100;

  return (
    <div
      onClick={onClick}
      className={`match-card cursor-pointer rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-green-500/50 bg-green-500/5 shadow-lg shadow-green-500/10'
          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
      }`}
    >
      {/* Competition + Status */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500 truncate">{match.competition}</span>
        <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor(match.status)}`}>
          {match.status === 'Live' && <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
          {match.status === 'Live' ? `${match.minute}'` : match.status}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{match.homeTeam.logo}</span>
          <span className="text-sm font-semibold text-white text-center">{match.homeTeam.shortName}</span>
          <div className="flex gap-0.5">
            {match.homeTeam.form.map((f, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${formDot(f)}`} />
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{match.score.home}</span>
            <span className="text-lg text-gray-500">-</span>
            <span className="text-2xl font-bold text-white">{match.score.away}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {weatherIcon(match.weather.condition)}
            <span className="text-xs text-gray-500">{match.weather.temperature}°C</span>
          </div>
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-2xl">{match.awayTeam.logo}</span>
          <span className="text-sm font-semibold text-white text-center">{match.awayTeam.shortName}</span>
          <div className="flex gap-0.5">
            {match.awayTeam.form.map((f, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${formDot(f)}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Probability bars */}
      {ai?.resultMarket && (
        <div className="mt-3">
          <div className="flex gap-0.5 rounded-full overflow-hidden h-2">
            <div className="bg-green-500 transition-all duration-700" style={{ width: `${homeWinP}%` }} />
            <div className="bg-gray-500 transition-all duration-700" style={{ width: `${drawP}%` }} />
            <div className="bg-red-500 transition-all duration-700" style={{ width: `${awayWinP}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-500">
            <span className="text-green-400">{homeWinP.toFixed(0)}%</span>
            <span>{drawP.toFixed(0)}%</span>
            <span className="text-red-400">{awayWinP.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* AI Score */}
      {ai?.score && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">Score IA</span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-20 rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${ai.score}%` }}
              />
            </div>
            <span className="text-xs font-bold text-green-400">{ai.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
