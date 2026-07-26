import { useState, useEffect, useCallback } from 'react';
import type { LiveMatch } from '../types';
import { runAIEngine } from '../engine/aiEngine';
import { allMatches } from '../data/mockData';

function simulateLiveUpdate(match: LiveMatch): LiveMatch {
  if (match.status !== 'Live') return match;

  const updated = JSON.parse(JSON.stringify(match)) as LiveMatch;
  updated.minute = Math.min(90, updated.minute + 1);

  // Small random fluctuations in live stats
  const rnd = (base: number, delta: number) => Math.max(0, base + (Math.random() - 0.5) * delta);

  updated.liveStats.xG.home = parseFloat((updated.liveStats.xG.home + Math.random() * 0.04).toFixed(2));
  updated.liveStats.xG.away = parseFloat((updated.liveStats.xG.away + Math.random() * 0.03).toFixed(2));
  updated.liveStats.attacks.home = Math.round(rnd(updated.liveStats.attacks.home, 2));
  updated.liveStats.attacks.away = Math.round(rnd(updated.liveStats.attacks.away, 2));
  updated.liveStats.dangerousAttacks.home = Math.round(rnd(updated.liveStats.dangerousAttacks.home, 1));
  updated.liveStats.dangerousAttacks.away = Math.round(rnd(updated.liveStats.dangerousAttacks.away, 1));

  // Randomly add corners / shots
  if (Math.random() < 0.15) {
    if (Math.random() < 0.55) updated.liveStats.corners.home++;
    else updated.liveStats.corners.away++;
  }
  if (Math.random() < 0.12) {
    if (Math.random() < 0.58) updated.liveStats.shots.home++;
    else updated.liveStats.shots.away++;
  }

  // Possession drift
  const drift = (Math.random() - 0.5) * 2;
  updated.liveStats.possession.home = Math.round(Math.min(75, Math.max(30, updated.liveStats.possession.home + drift)));
  updated.liveStats.possession.away = 100 - updated.liveStats.possession.home;

  // Momentum update
  const newMomentum = updated.liveStats.dangerousAttacks.home - updated.liveStats.dangerousAttacks.away;
  updated.liveStats.momentum.push(Math.max(-100, Math.min(100, newMomentum)));
  if (updated.liveStats.momentum.length > 90) updated.liveStats.momentum.shift();

  return updated;
}

export function useRealTimeData() {
  const [matches, setMatches] = useState<LiveMatch[]>(() => {
    return allMatches.map(m => ({ ...m, aiAnalysis: runAIEngine(m) }));
  });
  const [selectedMatchId, setSelectedMatchId] = useState<number>(allMatches[0].id);
  const isLoading = false;

  const refreshAnalysis = useCallback((matchList: LiveMatch[]) => {
    return matchList.map(m => ({ ...m, aiAnalysis: runAIEngine(m) }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => {
        const updated = prev.map(simulateLiveUpdate);
        return refreshAnalysis(updated);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshAnalysis]);

  const selectedMatch = matches.find(m => m.id === selectedMatchId) ?? matches[0];

  return { matches, selectedMatch, selectedMatchId, setSelectedMatchId, isLoading };
}
