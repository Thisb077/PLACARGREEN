"use client";
import { useState } from "react";
import { mockMatch, mockResultMarkets, mockGoalMarkets, mockCornerMarkets, mockCardMarkets } from "@/lib/mockData";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import MatchHeader from "@/components/dashboard/MatchHeader";
import LiveStats from "@/components/dashboard/LiveStats";
import MatchTimeline from "@/components/dashboard/MatchTimeline";
import PlayerStats from "@/components/dashboard/PlayerStats";
import MarketSection from "@/components/markets/MarketSection";
import ExactScoreMarket from "@/components/markets/ExactScoreMarket";
import TimeMarket from "@/components/markets/TimeMarket";
import SmartMarket from "@/components/markets/SmartMarket";
import Charts from "@/components/charts/Charts";
import AIEngine from "@/components/ai/AIEngine";
import Simulations from "@/components/ai/Simulations";
import SmartAlerts from "@/components/alerts/SmartAlerts";

type Tab = "dashboard" | "mercados" | "ia" | "graficos" | "jogadores" | "simulacoes";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "mercados", label: "Mercados", icon: "💰" },
  { id: "ia", label: "IA Engine", icon: "🤖" },
  { id: "graficos", label: "Gráficos", icon: "📊" },
  { id: "jogadores", label: "Jogadores", icon: "👤" },
  { id: "simulacoes", label: "Simulações", icon: "🎲" },
];

type MarketTab = "resultado" | "gols" | "escanteios" | "cartoes" | "placar" | "tempo" | "inteligente";

const marketTabs: { id: MarketTab; label: string }[] = [
  { id: "resultado", label: "Resultado" },
  { id: "gols", label: "Gols" },
  { id: "escanteios", label: "Escanteios" },
  { id: "cartoes", label: "Cartões" },
  { id: "placar", label: "Placar Exato" },
  { id: "tempo", label: "Tempo" },
  { id: "inteligente", label: "Inteligente" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [activeMarket, setActiveMarket] = useState<MarketTab>("resultado");

  const {
    match,
    liveMatches,
    selectedId,
    loading,
    error,
    lastUpdated,
    selectMatch,
    refresh,
  } = useLiveMatch(mockMatch);

  const usingLiveData = liveMatches.length > 0 && match !== null && match.id !== mockMatch.id;

  // Use mock match as absolute fallback
  const displayMatch = match ?? mockMatch;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-green-400">⚽ PlacarGreen</div>
            <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 font-semibold">
              V2.0 PRO
            </div>
            {usingLiveData && (
              <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
                📡 AO VIVO
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {loading && (
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                Atualizando...
              </span>
            )}
            {!loading && (
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${usingLiveData ? "bg-green-400" : "bg-orange-400"}`}></span>
                {usingLiveData ? "Ao Vivo" : "Demo"}
              </span>
            )}
            {lastUpdated && (
              <>
                <span>|</span>
                <span>🕒 {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              </>
            )}
            <span>|</span>
            <span>🤖 IA Ativa</span>
            <button
              onClick={refresh}
              className="ml-1 text-gray-400 hover:text-white transition-colors"
              title="Atualizar dados"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Live match selector — shown when multiple live games exist */}
        {liveMatches.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
            {liveMatches.map((m) => (
              <button
                key={m.id}
                onClick={() => selectMatch(m.id)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                  selectedId === m.id
                    ? "bg-green-500 text-black border-green-500"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                }`}
              >
                {m.homeTeam} {m.homeScore}–{m.awayScore} {m.awayTeam}{" "}
                <span className="text-gray-400 font-normal">{m.minute}&apos;</span>
              </button>
            ))}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 pb-2">
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5">
              ⚠️ {error} — exibindo dados de demonstração
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Match Header - always visible */}
        <MatchHeader match={displayMatch} />

        {/* Smart Alerts - always visible */}
        <div className="mb-4">
          <SmartAlerts />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 bg-gray-900 rounded-xl p-1 border border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-green-500 text-black shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <LiveStats
                stats={displayMatch.stats}
                homeColor={displayMatch.homeTeam.color}
                awayColor={displayMatch.awayTeam.color}
                homeName={displayMatch.homeTeam.shortName}
                awayName={displayMatch.awayTeam.shortName}
              />
              <MatchTimeline
                events={displayMatch.timeline}
                homeColor={displayMatch.homeTeam.color}
                awayColor={displayMatch.awayTeam.color}
              />
            </div>
            <div className="space-y-4">
              <AIEngine
                ai={displayMatch.ai}
                homeName={displayMatch.homeTeam.name}
                awayName={displayMatch.awayTeam.name}
                homeColor={displayMatch.homeTeam.color}
                awayColor={displayMatch.awayTeam.color}
              />
            </div>
          </div>
        )}

        {/* Markets Tab */}
        {activeTab === "mercados" && (
          <div>
            <div className="flex gap-1 mb-4 bg-gray-900 rounded-xl p-1 border border-gray-700 overflow-x-auto">
              {marketTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMarket(tab.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeMarket === tab.id
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeMarket === "resultado" && (
              <MarketSection markets={mockResultMarkets} title="Mercado Resultado" icon="🏆" />
            )}
            {activeMarket === "gols" && (
              <MarketSection markets={mockGoalMarkets} title="Mercado de Gols" icon="⚽" />
            )}
            {activeMarket === "escanteios" && (
              <MarketSection markets={mockCornerMarkets} title="Mercado Escanteios" icon="🚩" />
            )}
            {activeMarket === "cartoes" && (
              <MarketSection markets={mockCardMarkets} title="Mercado Cartões" icon="🟨" />
            )}
            {activeMarket === "placar" && <ExactScoreMarket />}
            {activeMarket === "tempo" && <TimeMarket />}
            {activeMarket === "inteligente" && <SmartMarket />}
          </div>
        )}

        {/* AI Tab */}
        {activeTab === "ia" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AIEngine
              ai={displayMatch.ai}
              homeName={displayMatch.homeTeam.name}
              awayName={displayMatch.awayTeam.name}
              homeColor={displayMatch.homeTeam.color}
              awayColor={displayMatch.awayTeam.color}
            />
            <SmartMarket />
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "graficos" && (
          <Charts
            momentumData={displayMatch.momentumData}
            homeColor={displayMatch.homeTeam.color}
            awayColor={displayMatch.awayTeam.color}
            homeName={displayMatch.homeTeam.name}
            awayName={displayMatch.awayTeam.name}
          />
        )}

        {/* Players Tab */}
        {activeTab === "jogadores" && (
          <PlayerStats
            homePlayers={displayMatch.homePlayers}
            awayPlayers={displayMatch.awayPlayers}
            homeTeamName={displayMatch.homeTeam.name}
            awayTeamName={displayMatch.awayTeam.name}
            homeColor={displayMatch.homeTeam.color}
            awayColor={displayMatch.awayTeam.color}
          />
        )}

        {/* Simulations Tab */}
        {activeTab === "simulacoes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Simulations />
            <ExactScoreMarket />
          </div>
        )}
      </div>
    </div>
  );
}
