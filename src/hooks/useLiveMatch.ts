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
  match: Match;
  liveMatches: LiveMatchInfo[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectMatch: (id: number) => void;
  refresh: () => void;
}

/**
 * Poll interval: 120 seconds.
 * API-Football free plan allows 100 requests/day. Each /api/fixture/[id]
 * call makes up to 4 upstream requests (fixture check + stats + events +
 * lineups). At 120 s intervals that is ~30 polls/hour × 4 upstream calls
 * = ~120 upstream requests/hour, far exceeding the 100 req/day free-plan
 * budget. Configure a longer POLL_INTERVAL_MS or add server-side caching
 * when using the free tier.
 */
const POLL_INTERVAL_MS = 120_000;

export function useLiveMatch(fallbackMatch: Match): UseLiveMatchReturn {
  const [liveMatches, setLiveMatches] = useState<LiveMatchInfo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Store callbacks in refs so effects that reference them don't need them as
  // deps (avoids stale-closure warnings while keeping effects stable).
  const fetchLiveMatchesCb = useCallback(async () => {
    try {
      const res = await fetch("/api/live");
      const json = (await res.json()) as { matches: LiveMatchInfo[]; error?: string };
      if (!res.ok) {
        // API error — surface it and return empty without overwriting existing list
        const message = json.error ?? `Erro ${res.status} ao buscar partidas ao vivo`;
        console.warn("[useLiveMatch] /api/live returned", res.status, json.error);
        setError(message);
        return [];
      }
      setLiveMatches(json.matches);
      return json.matches;
    } catch {
      return [];
    }
  }, []);

  const fetchFixtureCb = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/fixture/${id}`);
      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const json = (await res.json()) as { error?: string };
          if (json.error) message = json.error;
        } catch {
          // ignore JSON parse failure; keep the HTTP status message
        }
        throw new Error(message);
      }
      const json = (await res.json()) as { match: Match };
      setMatch(json.match);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      // Keep last known match data on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep latest callback versions in refs so interval/effect closures always
  // call the current version without needing them as reactive dependencies.
  const fetchLiveMatchesRef = useRef(fetchLiveMatchesCb);
  const fetchFixtureRef = useRef(fetchFixtureCb);
  useEffect(() => { fetchLiveMatchesRef.current = fetchLiveMatchesCb; }, [fetchLiveMatchesCb]);
  useEffect(() => { fetchFixtureRef.current = fetchFixtureCb; }, [fetchFixtureCb]);

  const selectMatch = useCallback((id: number) => {
    setSelectedId(id);
    fetchFixtureRef.current(id);
  }, []);

  const refresh = useCallback(() => {
    setSelectedId((prev) => {
      if (prev !== null) {
        fetchFixtureRef.current(prev);
        return prev;
      }
      fetchLiveMatchesRef.current().then((matches) => {
        if (matches.length > 0) {
          setSelectedId(matches[0].id);
          fetchFixtureRef.current(matches[0].id);
        }
      });
      return prev;
    });
  }, []);

  // Initial load — runs once on mount
  useEffect(() => {
    fetchLiveMatchesRef.current().then((matches) => {
      if (matches.length > 0) {
        const first = matches[0];
        setSelectedId(first.id);
        fetchFixtureRef.current(first.id);
      }
    });
    // Run once on mount; callbacks are accessed via refs (fetchLiveMatchesRef /
    // fetchFixtureRef) to avoid stale closures — no reactive deps needed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh when a match is selected
  useEffect(() => {
    if (selectedId === null) return;
    timerRef.current = setInterval(() => {
      fetchFixtureRef.current(selectedId);
    }, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedId]);

  return {
    // Always fall back to fallbackMatch when match is null (initial load, error, no live games)
    match: match ?? fallbackMatch,
    liveMatches,
    selectedId,
    loading,
    error,
    lastUpdated,
    selectMatch,
    refresh,
  };
}
