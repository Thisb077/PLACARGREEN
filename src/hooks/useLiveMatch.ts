"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Match } from "@/types";

export interface LiveMatchInfo {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: string;
  competition: string;
  country: string;
}

interface UseLiveMatchReturn {
  match: Match | null;
  liveMatches: LiveMatchInfo[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectMatch: (id: number) => void;
  refresh: () => void;
}

/** Poll interval in ms. API-Football free plan: 100 req/day. */
const POLL_INTERVAL_MS = 60_000;

export function useLiveMatch(fallbackMatch: Match): UseLiveMatchReturn {
  const [liveMatches, setLiveMatches] = useState<LiveMatchInfo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/live");
      const json = await res.json() as { matches: LiveMatchInfo[] };
      setLiveMatches(json.matches);
      return json.matches;
    } catch {
      return [];
    }
  }, []);

  const fetchFixture = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/fixture/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as { match: Match };
      setMatch(json.match);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      // Keep last known match data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const selectMatch = useCallback(
    (id: number) => {
      setSelectedId(id);
      fetchFixture(id);
    },
    [fetchFixture]
  );

  const refresh = useCallback(() => {
    if (selectedId !== null) {
      fetchFixture(selectedId);
    } else {
      fetchLiveMatches().then((matches) => {
        if (matches.length > 0) {
          selectMatch(matches[0].id);
        }
      });
    }
  }, [selectedId, fetchFixture, fetchLiveMatches, selectMatch]);

  // Initial load
  useEffect(() => {
    fetchLiveMatches().then((matches) => {
      if (matches.length > 0) {
        const first = matches[0];
        setSelectedId(first.id);
        fetchFixture(first.id);
      }
    });
  }, [fetchLiveMatches, fetchFixture]);

  // Auto-refresh when a match is selected
  useEffect(() => {
    if (selectedId === null) return;
    timerRef.current = setInterval(() => {
      fetchFixture(selectedId);
    }, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedId, fetchFixture]);

  return {
    match: match ?? (liveMatches.length === 0 ? fallbackMatch : null),
    liveMatches,
    selectedId,
    loading,
    error,
    lastUpdated,
    selectMatch,
    refresh,
  };
}
