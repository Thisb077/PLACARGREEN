import type { LiveMatch } from '../../types';
import { Cloud, CloudRain, MapPin, Sun, Users, Wind } from 'lucide-react';

interface MatchDetailsProps {
  match: LiveMatch;
}

const weatherIcon = (cond: string) => {
  if (cond === 'Sunny') return <Sun className="h-4 w-4 text-yellow-400" />;
  if (cond === 'Rainy') return <CloudRain className="h-4 w-4 text-blue-400" />;
  if (cond === 'Windy') return <Wind className="h-4 w-4 text-blue-300" />;
  return <Cloud className="h-4 w-4 text-gray-400" />;
};

interface StatBarProps {
  label: string;
  home: number;
  away: number;
  format?: (v: number) => string;
}

function StatBar({ home, away, format }: Omit<StatBarProps, 'label'> & { label?: string }) {
  const total = home + away || 1;
  const homeP = (home / total) * 100;
  const fmt = format ?? ((v: number) => String(v));

  return (
    <div className="grid grid-cols-7 items-center gap-1 text-sm">
      <span className="col-span-1 text-right font-semibold text-white">{fmt(home)}</span>
      <div className="col-span-5 flex h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="bg-green-500 bar-fill"
          style={{ width: `${homeP}%` }}
        />
        <div
          className="bg-blue-500 bar-fill"
          style={{ width: `${100 - homeP}%` }}
        />
      </div>
      <span className="col-span-1 font-semibold text-white">{fmt(away)}</span>
    </div>
  );
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const { liveStats: s, homeTeam, awayTeam } = match;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      {/* Info Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{match.stadium}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>{match.attendance.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-1">
          {weatherIcon(match.weather.condition)}
          <span>{match.weather.temperature}°C · {match.weather.condition}</span>
        </div>
        <div className="text-gray-500">
          <span className="text-gray-400">Árbitro:</span> {match.referee}
        </div>
        <div className="text-gray-500">
          <span className="text-gray-400">Formação:</span> {match.formation.home} vs {match.formation.away}
        </div>
      </div>

      {/* Team headers */}
      <div className="mb-3 grid grid-cols-7 text-xs font-semibold text-gray-400">
        <span className="col-span-1 text-right">{homeTeam.shortName}</span>
        <span className="col-span-5 text-center">Estatística</span>
        <span className="col-span-1">{awayTeam.shortName}</span>
      </div>

      {/* Stat bars */}
      <div className="space-y-2">
        <StatBar label="Posse" home={s.possession.home} away={s.possession.away} format={v => `${v}%`} />
        <StatBar label="xG" home={s.xG.home * 100} away={s.xG.away * 100} format={v => (v / 100).toFixed(2)} />
        <StatBar label="Chutes" home={s.shots.home} away={s.shots.away} />
        <StatBar label="Chutes no Gol" home={s.shotsOnTarget.home} away={s.shotsOnTarget.away} />
        <StatBar label="Escanteios" home={s.corners.home} away={s.corners.away} />
        <StatBar label="Ataques" home={s.attacks.home} away={s.attacks.away} />
        <StatBar label="Ataques Peric." home={s.dangerousAttacks.home} away={s.dangerousAttacks.away} />
        <StatBar label="Grandes Chances" home={s.bigChances.home} away={s.bigChances.away} />
        <StatBar label="Passes" home={s.passes.home} away={s.passes.away} />
        <StatBar label="Precisão Passe" home={s.passAccuracy.home} away={s.passAccuracy.away} format={v => `${v}%`} />
        <StatBar label="Cartões Amarelos" home={s.yellowCards.home} away={s.yellowCards.away} />
        <StatBar label="Faltas" home={s.fouls.home} away={s.fouls.away} />
      </div>

      {/* Events */}
      {match.events.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Eventos</h4>
          <div className="space-y-1.5">
            {match.events.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-8 text-right text-xs font-bold text-gray-500">{ev.minute}'</span>
                <span className="text-base">
                  {ev.type === 'goal' ? '⚽' : ev.type === 'yellow_card' ? '🟨' : ev.type === 'red_card' ? '🟥' : ev.type === 'substitution' ? '🔄' : '🚩'}
                </span>
                <span className={ev.team === 'home' ? 'text-green-400' : 'text-blue-400'}>{ev.player}</span>
                <span className="text-gray-500 text-xs truncate">{ev.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
