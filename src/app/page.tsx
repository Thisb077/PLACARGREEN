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
import CompetitiveEdge from "@/components/edge/CompetitiveEdge";

type Tab = "dashboard" | "mercados" | "ia" | "graficos" | "jogadores" | "simulacoes" | "vantagens";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "mercados", label: "Mercados", icon: "💰" },
  { id: "ia", label: "IA Engine", icon: "🤖" },
  { id: "graficos", label: "Gráficos", icon: "📊" },
  { id: "jogadores", label: "Jogadores", icon: "👤" },
  { id: "simulacoes", label: "Simulações", icon: "🎲" },
  { id: "vantagens", label: "Vantagens", icon: "🚀" },
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

const heroHighlights = [
  { value: "7", label: "módulos prontos" },
  { value: "100+", label: "sinais por partida" },
  { value: "24/7", label: "monitoramento ao vivo" },
  { value: "IA", label: "explicável e auditável" },
];

const productPillars = [
  {
    title: "Leitura ao vivo do jogo",
    description:
      "Placar, momentum, timeline, xG, pressão ofensiva e contexto da partida em uma única tela.",
    icon: "📡",
  },
  {
    title: "Mercados com contexto",
    description:
      "Odds, valor esperado, confiança e interpretação da IA para resultado, gols, escanteios e cartões.",
    icon: "💰",
  },
  {
    title: "Motor de decisão",
    description:
      "A plataforma destaca força da entrada, tendência do jogo, favorito e explicação do porquê.",
    icon: "🧠",
  },
  {
    title: "Operação profissional",
    description:
      "Alertas, simulações, leitura de jogadores e vantagens competitivas para transformar análise em rotina.",
    icon: "🚀",
  },
];

const workflowSteps = [
  {
    title: "1. Escolha a partida",
    description: "Selecione o jogo ao vivo e acompanhe o painel principal com dados e contexto em tempo real.",
  },
  {
    title: "2. Valide a leitura",
    description: "Cruze estatísticas, alertas e explicações da IA para entender se o momento favorece entrada ou espera.",
  },
  {
    title: "3. Execute com confiança",
    description: "Use os mercados, simulações e insights de jogadores para agir com critério e disciplina.",
  },
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

  // True when real live data is loaded (not the mock fallback)
  const usingLiveData = liveMatches.length > 0 && match.id !== mockMatch.id;

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
              <div
                className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold"
                aria-label="Transmissão ao vivo ativa"
              >
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
              type="button"
              onClick={refresh}
              className="ml-1 text-gray-400 hover:text-white transition-colors"
              title="Atualizar dados"
              aria-label="Atualizar dados"
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
                <span className="text-gray-400 font-normal">{m.minute} min</span>
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
        <section className="mb-8 rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                ⚽ Plataforma ao vivo para leitura de jogo e tomada de decisão
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                O PlacarGreen agora tem cara de produto, não só de uma tela solta.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
                Centralize análise ao vivo, mercados, explicações da IA, simulações e alertas operacionais em um único site.
                Abaixo você vê a demonstração da plataforma e o que ela entrega para o apostador profissional.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                >
                  Ver demonstração
                </a>
                <a
                  href="#recursos"
                  className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-green-500/40 hover:text-green-300"
                >
                  Explorar recursos
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {heroHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
                  <div className="text-2xl font-black text-green-400">{item.value}</div>
                  <div className="mt-1 text-sm text-gray-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="mb-8">
          <div className="mb-4 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">Recursos principais</div>
            <h2 className="mt-2 text-2xl font-black text-white">O que existe no site além da tela principal</h2>
            <p className="mt-2 text-sm text-gray-400">
              O produto foi organizado para mostrar claramente proposta, módulos e fluxo de uso logo na homepage.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productPillars.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{step.description}</p>
            </div>
          ))}
        </section>

        <section id="demo" className="rounded-3xl border border-gray-800 bg-black/20 p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">Demonstração ao vivo</div>
              <h2 className="mt-2 text-2xl font-black text-white">Painel principal da plataforma</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Aqui fica a parte operacional: acompanhamento da partida, leitura dos mercados e interpretação da IA.
              </p>
            </div>
            <div className="text-xs text-gray-500">Layout completo com módulos navegáveis</div>
          </div>

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

          {/* Competitive Edge Tab */}
          {activeTab === "vantagens" && <CompetitiveEdge />}
        </section>

        <section className="mt-8 rounded-3xl border border-green-500/20 bg-gradient-to-r from-gray-900 via-gray-900 to-green-950/40 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">Fechamento</div>
              <h2 className="mt-2 text-2xl font-black text-white">Agora o site comunica produto, valor e demonstração.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Em vez de parecer só uma imagem ou uma única tela isolada, a homepage apresenta contexto, módulos e fluxo de uso.
              </p>
            </div>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
            >
              Voltar para a demonstração
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
