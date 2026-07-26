"use client";
import { useState } from "react";
import { mockMatch, mockResultMarkets, mockGoalMarkets, mockCornerMarkets, mockCardMarkets } from "@/lib/mockData";
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
  const match = mockMatch;

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
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Ao Vivo
            </span>
            <span>|</span>
            <span>🤖 IA Ativa</span>
            <span>|</span>
            <span>📡 Dados em tempo real</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Match Header - always visible */}
        <MatchHeader match={match} />

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
                stats={match.stats}
                homeColor={match.homeTeam.color}
                awayColor={match.awayTeam.color}
                homeName={match.homeTeam.shortName}
                awayName={match.awayTeam.shortName}
              />
              <MatchTimeline
                events={match.timeline}
                homeColor={match.homeTeam.color}
                awayColor={match.awayTeam.color}
              />
            </div>
            <div className="space-y-4">
              <AIEngine
                ai={match.ai}
                homeName={match.homeTeam.name}
                awayName={match.awayTeam.name}
                homeColor={match.homeTeam.color}
                awayColor={match.awayTeam.color}
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
              ai={match.ai}
              homeName={match.homeTeam.name}
              awayName={match.awayTeam.name}
              homeColor={match.homeTeam.color}
              awayColor={match.awayTeam.color}
            />
            <SmartMarket />
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "graficos" && (
          <Charts
            momentumData={match.momentumData}
            homeColor={match.homeTeam.color}
            awayColor={match.awayTeam.color}
            homeName={match.homeTeam.name}
            awayName={match.awayTeam.name}
          />
        )}

        {/* Players Tab */}
        {activeTab === "jogadores" && (
          <PlayerStats
            homePlayers={match.homePlayers}
            awayPlayers={match.awayPlayers}
            homeTeamName={match.homeTeam.name}
            awayTeamName={match.awayTeam.name}
            homeColor={match.homeTeam.color}
            awayColor={match.awayTeam.color}
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
