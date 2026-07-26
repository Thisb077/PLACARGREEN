import { useState } from 'react';
import Header from './components/Layout/Header';
import MatchCard from './components/Dashboard/MatchCard';
import MatchDetails from './components/Dashboard/MatchDetails';
import AIScore from './components/UI/AIScore';
import AlertsPanel from './components/Alerts/AlertsPanel';
import ResultMarket from './components/Markets/ResultMarket';
import GoalsMarket from './components/Markets/GoalsMarket';
import CornersMarket from './components/Markets/CornersMarket';
import CardsMarket from './components/Markets/CardsMarket';
import PlayersMarket from './components/Markets/PlayersMarket';
import ExactScoreMarket from './components/Markets/ExactScoreMarket';
import TimeMarket from './components/Markets/TimeMarket';
import SmartMarket from './components/Markets/SmartMarket';
import Charts from './components/Charts/Charts';
import { useRealTimeData } from './hooks/useRealTimeData';

type Tab =
  | 'overview'
  | 'resultado'
  | 'gols'
  | 'escanteios'
  | 'cartoes'
  | 'jogadores'
  | 'placar_exato'
  | 'tempo'
  | 'smart'
  | 'graficos';

const tabList: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Visão Geral', icon: '🏠' },
  { key: 'resultado', label: 'Resultado', icon: '🏆' },
  { key: 'gols', label: 'Gols', icon: '⚽' },
  { key: 'escanteios', label: 'Escanteios', icon: '🚩' },
  { key: 'cartoes', label: 'Cartões', icon: '🟨' },
  { key: 'jogadores', label: 'Jogadores', icon: '👤' },
  { key: 'placar_exato', label: 'Placar Exato', icon: '🎯' },
  { key: 'tempo', label: 'Tempo', icon: '⏰' },
  { key: 'smart', label: 'IA Smart', icon: '🤖' },
  { key: 'graficos', label: 'Gráficos', icon: '📈' },
];

export default function App() {
  const { matches, selectedMatch, selectedMatchId, setSelectedMatchId } = useRealTimeData();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const liveCount = matches.filter(m => m.status === 'Live').length;
  const ai = selectedMatch.aiAnalysis;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header liveCount={liveCount} />

      <div className="flex h-[calc(100vh-57px)] overflow-hidden">
        {/* Left sidebar: match list */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-y-auto p-3 space-y-3 hidden lg:block">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">Partidas</div>
          {matches.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              isSelected={m.id === selectedMatchId}
              onClick={() => { setSelectedMatchId(m.id); setActiveTab('overview'); }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Match header bar */}
          <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm px-4 py-3">
            {/* Mobile match selector */}
            <div className="flex gap-2 mb-3 lg:hidden overflow-x-auto pb-1">
              {matches.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMatchId(m.id); setActiveTab('overview'); }}
                  className={`flex-shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    m.id === selectedMatchId
                      ? 'border-green-500/40 bg-green-500/10 text-green-400'
                      : 'border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {m.homeTeam.shortName} vs {m.awayTeam.shortName}
                  {m.status === 'Live' && <span className="ml-1 text-red-400">{m.minute}'</span>}
                </button>
              ))}
            </div>

            {/* Match summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{selectedMatch.homeTeam.logo}</span>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-semibold text-white">{selectedMatch.homeTeam.name}</div>
                </div>
                <div className="mx-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {selectedMatch.score.home} – {selectedMatch.score.away}
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 flex items-center justify-center gap-1 ${
                    selectedMatch.status === 'Live' ? 'text-red-400' :
                    selectedMatch.status === 'HT' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {selectedMatch.status === 'Live' ? `${selectedMatch.minute}'` : selectedMatch.status}
                    {selectedMatch.status === 'Live' && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
                  </div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-semibold text-white">{selectedMatch.awayTeam.name}</div>
                </div>
                <span className="text-2xl">{selectedMatch.awayTeam.logo}</span>
              </div>

              {ai?.score != null && (
                <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-1.5">
                  <span className="text-xs text-gray-500">Score IA</span>
                  <span className="text-lg font-bold text-green-400">{ai.score}</span>
                </div>
              )}
            </div>

            {/* Tab navigation */}
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
              {tabList.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 space-y-4">
            {activeTab === 'overview' && (
              <>
                {ai?.alerts != null && ai.alerts.length > 0 && <AlertsPanel alerts={ai.alerts} />}
                {ai != null && <AIScore analysis={ai} />}
                <MatchDetails match={selectedMatch} />
              </>
            )}

            {activeTab === 'resultado' && ai != null && <ResultMarket analysis={ai} />}
            {activeTab === 'gols' && ai != null && <GoalsMarket analysis={ai} />}
            {activeTab === 'escanteios' && ai != null && <CornersMarket analysis={ai} />}
            {activeTab === 'cartoes' && ai != null && <CardsMarket analysis={ai} />}
            {activeTab === 'jogadores' && (
              <PlayersMarket homeTeam={selectedMatch.homeTeam} awayTeam={selectedMatch.awayTeam} />
            )}
            {activeTab === 'placar_exato' && ai != null && <ExactScoreMarket scores={ai.exactScores} />}
            {activeTab === 'tempo' && ai != null && <TimeMarket analysis={ai} />}
            {activeTab === 'smart' && ai != null && <SmartMarket market={ai.smartMarket} />}
            {activeTab === 'graficos' && (
              <Charts
                liveStats={selectedMatch.liveStats}
                homeShortName={selectedMatch.homeTeam.shortName}
                awayShortName={selectedMatch.awayTeam.shortName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
