import type { Team } from '../../types';
import { useState } from 'react';

interface PlayersMarketProps {
  homeTeam: Team;
  awayTeam: Team;
}

const positions: Record<string, string> = {
  GK: '🥅', CB: '🛡️', LB: '🛡️', RB: '🛡️',
  CM: '⚙️', DM: '⚙️', AM: '✨', LW: '⚡', RW: '⚡', ST: '🔥',
};

type SortKey = 'goals' | 'assists' | 'shots' | 'passes' | 'fouls' | 'form';

export default function PlayersMarket({ homeTeam, awayTeam }: PlayersMarketProps) {
  const [view, setView] = useState<'home' | 'away'>('home');
  const [sortKey, setSortKey] = useState<SortKey>('goals');

  const team = view === 'home' ? homeTeam : awayTeam;
  const sorted = [...team.players].sort((a, b) => {
    const aVal = sortKey === 'form' ? a.stats.form : (a.stats as unknown as Record<string, number>)[sortKey] ?? 0;
    const bVal = sortKey === 'form' ? b.stats.form : (b.stats as unknown as Record<string, number>)[sortKey] ?? 0;
    return bVal - aVal;
  });

  const tabs: { key: SortKey; label: string }[] = [
    { key: 'goals', label: 'Gols' },
    { key: 'assists', label: 'Assist.' },
    { key: 'shots', label: 'Chutes' },
    { key: 'passes', label: 'Passes' },
    { key: 'fouls', label: 'Faltas' },
    { key: 'form', label: 'Forma' },
  ];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">👤 Mercado Jogadores</h3>

      {/* Team selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setView('home')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            view === 'home' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          {homeTeam.logo} {homeTeam.shortName}
        </button>
        <button
          onClick={() => setView('away')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            view === 'away' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          {awayTeam.logo} {awayTeam.shortName}
        </button>
      </div>

      {/* Sort tabs */}
      <div className="mb-4 flex gap-1 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setSortKey(t.key)}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all ${
              sortKey === t.key ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Players table */}
      <div className="space-y-2">
        {sorted.map(player => {
          const s = player.stats;
          const formColor = s.form >= 8 ? 'text-green-400' : s.form >= 6 ? 'text-yellow-400' : 'text-red-400';

          return (
            <div
              key={player.id}
              className={`rounded-lg border p-3 transition-all ${
                player.isInjured ? 'border-red-500/30 bg-red-500/5 opacity-60' :
                player.isSuspended ? 'border-yellow-500/30 bg-yellow-500/5 opacity-60' :
                'border-gray-800 bg-gray-900/40 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Position + Number */}
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <span className="text-base">{positions[player.position]}</span>
                  <span className="text-xs text-gray-500">#{player.number}</span>
                </div>

                {/* Name + Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white truncate">{player.name}</span>
                    {player.isInjured && <span className="text-xs text-red-400">🏥 Lesionado</span>}
                    {player.isSuspended && <span className="text-xs text-yellow-400">🟨 Suspenso</span>}
                  </div>
                  <span className="text-xs text-gray-500">{player.position}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-6 gap-2 text-center flex-shrink-0">
                  {[
                    ['G', s.goals, 'text-green-400'],
                    ['A', s.assists, 'text-blue-400'],
                    ['Ch', s.shots, 'text-white'],
                    ['P', s.passes, 'text-gray-300'],
                    ['F', s.fouls, 'text-orange-400'],
                    ['F', s.form, formColor],
                  ].map(([label, val, clr], i) => (
                    <div key={i}>
                      <div className="text-[10px] text-gray-600">{label as string}</div>
                      <div className={`text-sm font-bold ${clr as string}`}>{val as number}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pass accuracy mini bar */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-gray-600 w-20">Precisão Passe</span>
                <div className="flex-1 h-1 rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-500 bar-fill"
                    style={{ width: `${s.passAccuracy}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-8 text-right">{s.passAccuracy}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
