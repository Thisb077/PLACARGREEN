"use client";

const goalTimeMarkets = [
  { label: "Quem marca primeiro", prediction: "Flamengo (68%)", ev: "+8.4%", confidence: 68, isValue: true },
  { label: "Quem marca por último", prediction: "Flamengo (62%)", ev: "+5.2%", confidence: 62, isValue: true },
  { label: "Gol 0–15 min", prediction: "8%", ev: "-3.2%", confidence: 40, isValue: false },
  { label: "Gol 15–30 min", prediction: "12%", ev: "-1.8%", confidence: 44, isValue: false },
  { label: "Gol 30–45 min", prediction: "18%", ev: "+2.4%", confidence: 52, isValue: false },
  { label: "Gol 45–60 min", prediction: "22%", ev: "+4.8%", confidence: 58, isValue: true },
  { label: "Gol 60–75 min", prediction: "26%", ev: "+7.2%", confidence: 66, isValue: true },
  { label: "Gol 75–90 min", prediction: "24%", ev: "+6.4%", confidence: 64, isValue: true },
  { label: "Gol 90+ min", prediction: "8%", ev: "-4.1%", confidence: 38, isValue: false },
];

export default function TimeMarket() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">⏰ Mercado Tempo</h3>
      <div className="space-y-2">
        {goalTimeMarkets.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl p-3 border ${
              item.isValue ? "border-emerald-500/30 bg-emerald-500/5" : "border-gray-700/50 bg-gray-800/30"
            }`}
          >
            <div className="flex-1">
              <div className="text-sm text-white font-semibold">{item.label}</div>
              <div className="text-xs text-gray-400">{item.prediction}</div>
            </div>
            <div className={`text-sm font-bold ${item.ev.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
              {item.ev}
            </div>
            <div className="text-xs text-blue-400">{item.confidence}%</div>
            {item.isValue && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">★</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
