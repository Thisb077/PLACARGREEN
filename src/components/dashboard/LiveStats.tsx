"use client";
import { LiveMatchStats } from "@/types";

interface Props {
  stats: LiveMatchStats;
  homeColor: string;
  awayColor: string;
  homeName: string;
  awayName: string;
}

function StatBar({
  label,
  home,
  away,
  homeColor,
  awayColor,
}: {
  label: string;
  home: number;
  away: number;
  homeColor: string;
  awayColor: string;
}) {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span className="font-semibold">{home}</span>
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold">{away}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-700">
        <div
          className="h-full rounded-l-full transition-all duration-700"
          style={{ width: `${homeWidth}%`, backgroundColor: homeColor }}
        />
        <div
          className="h-full rounded-r-full flex-1 transition-all duration-700"
          style={{ backgroundColor: awayColor }}
        />
      </div>
    </div>
  );
}

export default function LiveStats({ stats, homeColor, awayColor, homeName, awayName }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
        📊 <span>Estatísticas ao Vivo</span>
      </h3>
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span style={{ color: homeColor }}>{homeName}</span>
        <span style={{ color: awayColor }}>{awayName}</span>
      </div>
      <StatBar label="Posse de Bola %" home={stats.possession[0]} away={stats.possession[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Finalizações" home={stats.shots[0]} away={stats.shots[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="No Gol" home={stats.shotsOnTarget[0]} away={stats.shotsOnTarget[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Escanteios" home={stats.corners[0]} away={stats.corners[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Ataques" home={stats.attacks[0]} away={stats.attacks[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Ataques Perigosos" home={stats.dangerousAttacks[0]} away={stats.dangerousAttacks[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Faltas" home={stats.fouls[0]} away={stats.fouls[1]} homeColor={homeColor} awayColor={awayColor} />
      <StatBar label="Cartões Amarelos" home={stats.yellowCards[0]} away={stats.yellowCards[1]} homeColor={homeColor} awayColor={awayColor} />

      {/* xG special display */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">xG {homeName}</div>
          <div className="text-xl font-black" style={{ color: homeColor }}>{stats.xG[0].toFixed(2)}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">xG {awayName}</div>
          <div className="text-xl font-black" style={{ color: awayColor }}>{stats.xG[1].toFixed(2)}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Grandes Chances</div>
          <div className="text-lg font-black text-yellow-400">{stats.bigChances[0]} — {stats.bigChances[1]}</div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/50">
          <div className="text-xs text-gray-400 mb-1">Cartões Vermelhos</div>
          <div className="text-lg font-black text-red-400">{stats.redCards[0]} — {stats.redCards[1]}</div>
        </div>
      </div>
    </div>
  );
}
