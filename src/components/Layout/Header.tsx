import { Activity, Bell, Search, Settings, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  liveCount: number;
}

export default function Header({ liveCount }: HeaderProps) {
  const [time] = useState(() => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">Placar</span>
            <span className="text-lg font-bold tracking-tight text-green-400">Green</span>
            <span className="ml-2 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-green-400 border border-green-500/30">v2.0</span>
          </div>
        </div>

        {/* Center: search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-1.5 w-72">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar partidas, equipes..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Live count */}
          <div className="flex items-center gap-2">
            <div className="live-indicator" />
            <span className="text-sm font-medium text-gray-300">
              <span className="text-red-400 font-bold">{liveCount}</span> ao vivo
            </span>
          </div>

          {/* AI badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400">IA Ativa</span>
          </div>

          <span className="text-sm text-gray-500">{time}</span>

          <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
