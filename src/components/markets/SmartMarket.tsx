"use client";

const smartMarkets = {
  recommended: [
    { name: "Over 2.5 Gols", odds: 1.72, ev: "+18.4%", confidence: 84, reason: "xG combinado de 2.80 com 23 min restantes" },
    { name: "Vitória Flamengo", odds: 1.95, ev: "+14.8%", confidence: 82, reason: "Domínio completo — xG 1.84 vs 0.96" },
    { name: "BTTS", odds: 1.88, ev: "+13.2%", confidence: 78, reason: "Ambos já marcaram, alta pressão ofensiva" },
    { name: "Próximo Gol Flamengo", odds: 1.65, ev: "+12.8%", confidence: 74, reason: "Padrão de 42 ataques perigosos" },
  ],
  dangerous: [
    { name: "Empate", odds: 3.40, ev: "-8.2%", confidence: 45, reason: "Baixa probabilidade dado domínio do Flamengo" },
    { name: "Under 1.5 Gols", odds: 5.50, ev: "-42%", confidence: 4, reason: "Já há 2 gols marcados" },
    { name: "Vitória Palmeiras", odds: 4.10, ev: "-12.4%", confidence: 30, reason: "xG muito baixo e pressão defensiva alta" },
  ],
  trending: [
    { name: "Over 3.5 Gols", direction: "↑", change: "+4.8%", reason: "Pressão crescente nos últimos 15 min" },
    { name: "Escanteios Flamengo +7.5", direction: "↑", change: "+3.2%", reason: "7 escanteios já conquistados" },
    { name: "Under 2.5 Gols", direction: "↓", change: "-6.4%", reason: "Perdendo valor com domínio do Flamengo" },
  ],
};

function SmartCard({ item, type }: { item: { name: string; odds?: number; ev?: string; confidence?: number; reason: string; direction?: string; change?: string }; type: "recommended" | "dangerous" | "trending" }) {
  const borderColor =
    type === "recommended" ? "border-emerald-500/40 bg-emerald-500/5" :
    type === "dangerous" ? "border-red-500/40 bg-red-500/5" :
    "border-blue-500/40 bg-blue-500/5";
  const badgeColor =
    type === "recommended" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
    type === "dangerous" ? "bg-red-500/20 text-red-400 border-red-500/30" :
    "bg-blue-500/20 text-blue-400 border-blue-500/30";

  return (
    <div className={`rounded-xl p-3 border ${borderColor} mb-2`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-sm font-bold text-white">{item.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{item.reason}</div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          {item.odds && <div className="text-sm font-black text-white">{item.odds}</div>}
          {item.ev && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${item.ev.startsWith("+") ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
              EV {item.ev}
            </span>
          )}
          {item.change && (
            <span className={`text-xs font-bold ${item.direction === "↑" ? "text-emerald-400" : "text-red-400"}`}>
              {item.direction} {item.change}
            </span>
          )}
          {item.confidence && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${badgeColor}`}>
              {item.confidence}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SmartMarket() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">🧠 Mercado Inteligente</h3>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <div className="text-xs font-bold text-emerald-400">ENTRADAS RECOMENDADAS</div>
        </div>
        {smartMarkets.recommended.map((m, i) => (
          <SmartCard key={i} item={m} type="recommended" />
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="text-xs font-bold text-red-400">ENTRADAS PERIGOSAS</div>
        </div>
        {smartMarkets.dangerous.map((m, i) => (
          <SmartCard key={i} item={m} type="dangerous" />
        ))}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <div className="text-xs font-bold text-blue-400">MERCADOS EM TENDÊNCIA</div>
        </div>
        {smartMarkets.trending.map((m, i) => (
          <SmartCard key={i} item={m} type="trending" />
        ))}
      </div>
    </div>
  );
}
