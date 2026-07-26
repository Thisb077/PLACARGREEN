"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { MomentumPoint } from "@/types";

interface Props {
  momentumData: MomentumPoint[];
  homeColor: string;
  awayColor: string;
  homeName: string;
  awayName: string;
}

const homeRadar = [
  { subject: "Ataque", value: 88 },
  { subject: "Posse", value: 75 },
  { subject: "Defesa", value: 72 },
  { subject: "xG", value: 85 },
  { subject: "Pressão", value: 82 },
  { subject: "Escanteios", value: 78 },
];

const awayRadar = [
  { subject: "Ataque", value: 62 },
  { subject: "Posse", value: 58 },
  { subject: "Defesa", value: 74 },
  { subject: "xG", value: 55 },
  { subject: "Pressão", value: 58 },
  { subject: "Escanteios", value: 62 },
];

const radarData = homeRadar.map((item, i) => ({
  subject: item.subject,
  home: item.value,
  away: awayRadar[i].value,
}));

export default function Charts({ momentumData, homeColor, awayColor, homeName, awayName }: Props) {
  return (
    <div className="space-y-4">
      {/* Momentum Chart */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">📈 Momentum do Jogo</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={momentumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="minute" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={v => `${v}'`} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name) => [`${value}%`, name === "home" ? homeName : awayName]}
              labelFormatter={v => `${v}'`}
            />
            <Area type="monotone" dataKey="home" stroke={homeColor} fill={`${homeColor}33`} strokeWidth={2} name="home" />
            <Area type="monotone" dataKey="away" stroke={awayColor} fill={`${awayColor}33`} strokeWidth={2} name="away" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* xG Chart */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">⚡ xG Acumulado</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={momentumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="minute" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={v => `${v}'`} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name) => [Number(value).toFixed(2), name === "xGHome" ? homeName : awayName]}
              labelFormatter={v => `${v}'`}
            />
            <Area type="monotone" dataKey="xGHome" stroke={homeColor} fill={`${homeColor}33`} strokeWidth={2} name="xGHome" />
            <Area type="monotone" dataKey="xGAway" stroke={awayColor} fill={`${awayColor}33`} strokeWidth={2} name="xGAway" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">🕸️ Radar Ofensivo / Defensivo</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Radar name={homeName} dataKey="home" stroke={homeColor} fill={`${homeColor}33`} fillOpacity={0.4} />
            <Radar name={awayName} dataKey="away" stroke={awayColor} fill={`${awayColor}33`} fillOpacity={0.4} />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
