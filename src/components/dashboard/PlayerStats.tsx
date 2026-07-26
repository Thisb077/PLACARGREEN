"use client";
import { Player } from "@/types";

interface Props {
  homePlayers: Player[];
  awayPlayers: Player[];
  homeTeamName: string;
  awayTeamName: string;
  homeColor: string;
  awayColor: string;
}

function PlayerRow({ player, color }: { player: Player; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors px-2 rounded">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {player.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{player.name}</div>
        <div className="text-xs text-gray-400">{player.position}</div>
      </div>
      <div className="flex gap-3 text-xs text-gray-300">
        <div className="text-center">
          <div className="text-white font-bold">{player.stats.goals}</div>
          <div className="text-gray-500">Gols</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">{player.stats.assists}</div>
          <div className="text-gray-500">Ass</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">{player.stats.shots}</div>
          <div className="text-gray-500">Fin</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">{player.stats.passAccuracy}%</div>
          <div className="text-gray-500">Pass</div>
        </div>
        <div className="text-center">
          <div className={`font-bold ${player.stats.avgRating >= 8 ? 'text-emerald-400' : player.stats.avgRating >= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
            {player.stats.avgRating.toFixed(1)}
          </div>
          <div className="text-gray-500">Nota</div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerStats({ homePlayers, awayPlayers, homeTeamName, awayTeamName, homeColor, awayColor }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">👥 Jogadores em Destaque</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold mb-2 pb-1 border-b border-gray-700" style={{ color: homeColor }}>
            {homeTeamName}
          </div>
          {homePlayers.map(p => (
            <PlayerRow key={p.id} player={p} color={homeColor} />
          ))}
        </div>
        <div>
          <div className="text-xs font-bold mb-2 pb-1 border-b border-gray-700" style={{ color: awayColor }}>
            {awayTeamName}
          </div>
          {awayPlayers.map(p => (
            <PlayerRow key={p.id} player={p} color={awayColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
