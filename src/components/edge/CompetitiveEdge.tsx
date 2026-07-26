"use client";

import { useMemo, useState } from "react";
import {
  mockArbitrage,
  mockApiEndpoints,
  mockBacktests,
  mockConfidenceMarkets,
  mockExplainability,
  mockLeagueRanking,
  mockMultichannelAlerts,
  mockOpportunities,
  mockTriggerPlan,
  profileRules,
} from "@/lib/mockData";
import { BettorProfile, OpportunityItem } from "@/types";

function confidenceColor(level: "BAIXA" | "MÉDIA" | "ALTA") {
  if (level === "ALTA") return "text-emerald-400";
  if (level === "MÉDIA") return "text-yellow-400";
  return "text-red-400";
}

function riskRank(risk: OpportunityItem["risk"]) {
  if (risk === "BAIXO") return 1;
  if (risk === "MÉDIO") return 2;
  return 3;
}

function calculateKellyStakeAmount(bankroll: number, odd: number, probabilityPercent: number, fraction: number) {
  if (!Number.isFinite(bankroll) || bankroll <= 0) return 0;
  if (!Number.isFinite(odd) || odd <= 1.01) return 0;
  if (!Number.isFinite(probabilityPercent) || probabilityPercent <= 0) return 0;

  const probability = Math.min(0.99, Math.max(0.01, probabilityPercent / 100));
  const oddsProfit = odd - 1;
  const lossProbability = 1 - probability;
  const rawKelly = ((oddsProfit * probability) - lossProbability) / oddsProfit;
  const adjusted = Math.max(0, rawKelly) * fraction;
  return bankroll * adjusted;
}

export default function CompetitiveEdge() {
  const [profile, setProfile] = useState<BettorProfile>("moderado");
  const [bankroll, setBankroll] = useState(1000);
  const [dailyLimit, setDailyLimit] = useState(120);

  const filteredOpportunities = useMemo(() => {
    const rules = profileRules[profile];
    return mockOpportunities.filter((item) => (
      riskRank(item.risk) <= riskRank(rules.maxRisk) && item.expectedValue >= rules.minExpectedValue
    ));
  }, [profile]);

  const topOpportunity = filteredOpportunities[0];
  const suggestedStake = topOpportunity
    ? Math.min(
      dailyLimit,
      calculateKellyStakeAmount(bankroll, topOpportunity.odd, topOpportunity.modelProbability, profileRules[profile].kellyFraction),
    )
    : 0;

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">🚀 Diferenciais Competitivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["conservador", "moderado", "agressivo"] as BettorProfile[]).map((item) => (
            <button
              key={item}
              onClick={() => setProfile(item)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                profile === item
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              Perfil {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Filtro ativo: risco até <span className="text-white font-semibold">{profileRules[profile].maxRisk}</span> | EV mínimo{" "}
          <span className="text-white font-semibold">{profileRules[profile].minExpectedValue}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">📈 Backtesting público (30/90 dias)</h4>
          <div className="space-y-2">
            {mockBacktests.map((item) => (
              <div key={item.label} className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{item.label}</span>
                  <span>{item.sampleSize} entradas</span>
                </div>
                <div className="mt-1 text-sm">
                  Hit rate <span className="text-emerald-400 font-bold">{item.hitRate}%</span> | ROI{" "}
                  <span className="text-blue-400 font-bold">+{item.roi}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">🎯 Score de confiança por mercado</h4>
          <div className="space-y-2">
            {mockConfidenceMarkets.map((item) => (
              <div key={item.market} className="flex items-center gap-3">
                <div className="w-32 text-xs text-gray-400">{item.market}</div>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${item.probability}%` }} />
                </div>
                <div className={`text-xs w-10 text-right ${confidenceColor(item.confidence)}`}>{item.confidence}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">💸 Gestão de banca (Kelly fracionado)</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="text-gray-400">
              Banca total
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(Number(e.target.value) || 0)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white"
              />
            </label>
            <label className="text-gray-400">
              Limite diário
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value) || 0)}
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white"
              />
            </label>
          </div>
          <div className="mt-3 text-sm text-gray-300">
            Stake sugerida: <span className="text-emerald-400 font-bold">R$ {suggestedStake.toFixed(2)}</span>
            <div className="text-xs text-gray-500 mt-1">Calculada pela melhor oportunidade filtrada no perfil atual.</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">🔔 Alertas multicanal priorizados</h4>
          <div className="space-y-2">
            {mockMultichannelAlerts.map((item) => (
              <div key={`${item.channel}-${item.value}`} className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">{item.channel}</span>
                  <span className="text-yellow-400">{item.priority}</span>
                </div>
                <div className="text-gray-300 mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">🧠 Explicabilidade da IA</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {mockExplainability.map((item) => (
              <li key={item} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">⚖️ Dashboard de arbitragem e surebets</h4>
          <div className="space-y-2 text-xs">
            {mockArbitrage.map((item) => (
              <div key={item.market} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                <div className="text-white font-semibold">{item.market}</div>
                <div className="text-gray-400 mt-1">{item.homeBook} × {item.awayBook}</div>
                <div className="mt-1">
                  Soma implícita: <span className="text-blue-400">{item.combinedProbability.toFixed(1)}%</span> | Margem surebet:{" "}
                  <span className="text-emerald-400 font-bold">{item.surebetMargin.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">🎬 Modo pré-live → live</h4>
          <div className="space-y-2">
            {mockTriggerPlan.map((item, idx) => (
              <div key={`${item.phase}-${idx}`} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-xs">
                <div className="text-purple-400 font-semibold">{item.phase}</div>
                <div className="text-gray-300 mt-1">Gatilho: {item.trigger}</div>
                <div className="text-emerald-400 mt-1">Ação: {item.action}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">🔌 API e webhooks para automação</h4>
          <div className="space-y-2 text-xs">
            {mockApiEndpoints.map((item, idx) => (
              <div key={`${item.event}-${idx}`} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                <div className="text-cyan-300">{item.endpoint}</div>
                <div className="text-gray-300 mt-1">evento: <span className="text-white">{item.event}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-white mb-3">🏆 Ranking de ligas mais previsíveis</h4>
        <div className="space-y-2">
          {mockLeagueRanking.map((item, idx) => (
            <div key={item.league} className="flex items-center gap-3 text-xs bg-gray-800/50 border border-gray-700 rounded-xl p-3">
              <div className="w-6 text-center text-gray-400">#{idx + 1}</div>
              <div className="flex-1">
                <div className="text-white font-semibold">{item.league}</div>
                <div className="text-gray-400">EV médio +{item.avgEv}%</div>
              </div>
              <div className="text-emerald-400 font-bold">{item.predictability}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
