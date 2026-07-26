import type { LiveStats } from '../../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend,
} from 'recharts';

interface ChartsProps {
  liveStats: LiveStats;
  homeShortName: string;
  awayShortName: string;
}

export default function Charts({ liveStats, homeShortName, awayShortName }: ChartsProps) {
  // Momentum chart data
  const momentumData = liveStats.momentum.map((val, i) => ({
    minute: i + 1,
    home: val > 0 ? val : 0,
    away: val < 0 ? Math.abs(val) : 0,
  }));

  // Radar data for offensive comparison
  const radarData = [
    { subject: 'xG', home: liveStats.xG.home * 40, away: liveStats.xG.away * 40 },
    { subject: 'Chutes', home: liveStats.shots.home * 5, away: liveStats.shots.away * 5 },
    { subject: 'Posse', home: liveStats.possession.home, away: liveStats.possession.away },
    { subject: 'Ataques', home: liveStats.dangerousAttacks.home * 2, away: liveStats.dangerousAttacks.away * 2 },
    { subject: 'Chances', home: liveStats.bigChances.home * 20, away: liveStats.bigChances.away * 20 },
    { subject: 'Escanteios', home: liveStats.corners.home * 10, away: liveStats.corners.away * 10 },
  ];

  // Bar chart for comparison
  const barData = [
    { name: 'Chutes', [homeShortName]: liveStats.shots.home, [awayShortName]: liveStats.shots.away },
    { name: 'No Gol', [homeShortName]: liveStats.shotsOnTarget.home, [awayShortName]: liveStats.shotsOnTarget.away },
    { name: 'Escanteios', [homeShortName]: liveStats.corners.home, [awayShortName]: liveStats.corners.away },
    { name: 'Ataques P.', [homeShortName]: liveStats.dangerousAttacks.home, [awayShortName]: liveStats.dangerousAttacks.away },
    { name: 'Faltas', [homeShortName]: liveStats.fouls.home, [awayShortName]: liveStats.fouls.away },
  ];

  return (
    <div className="space-y-4">
      {/* Momentum Chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">📈 Momentum do Jogo</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={momentumData}>
            <defs>
              <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="minute" stroke="#4b5563" tick={{ fontSize: 10 }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area type="monotone" dataKey="home" name={homeShortName} stroke="#10b981" fill="url(#homeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="away" name={awayShortName} stroke="#3b82f6" fill="url(#awayGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">🎯 Radar Ofensivo</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1f2937" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#374151', fontSize: 9 }} />
            <Radar name={homeShortName} dataKey="home" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Radar name={awayShortName} dataKey="away" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">📊 Comparativo de Estatísticas</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
            <XAxis type="number" stroke="#4b5563" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} width={70} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Bar dataKey={homeShortName} fill="#10b981" radius={[0, 4, 4, 0]} />
            <Bar dataKey={awayShortName} fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
