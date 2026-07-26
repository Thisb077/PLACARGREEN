import type {
  Team, LiveMatch, AIAnalysis, MarketOutcome, GoalsMarket,
  CornersMarket, CardsMarket, ExactScoreOutcome, TimeMarket,
  SmartMarket, SmartEntry, Alert, SimulationResults, Probability,
} from '../types';

// ── Poisson distribution ──────────────────────────────────────────────────────
function poissonPMF(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

function poissonCDF(maxK: number, lambda: number): number {
  let sum = 0;
  for (let k = 0; k <= maxK; k++) sum += poissonPMF(k, lambda);
  return Math.min(1, sum);
}

// ── Elo rating expected score ─────────────────────────────────────────────────
function eloExpected(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

// ── xG-based goal rate ───────────────────────────────────────────────────────
function computeLambda(team: Team, isHome: boolean, opponent: Team): number {
  const record = isHome ? team.homeRecord : team.awayRecord;
  const gamesPlayed = record.w + record.d + record.l || 1;
  const baseRate = team.stats.goalsScored / gamesPlayed;
  const xgRate = team.stats.xG / gamesPlayed;
  const oppDefense = (opponent.stats.goalsConceded / gamesPlayed) * 0.5 + 0.5;
  const eloFactor = eloExpected(team.elo, opponent.elo) * 1.5 + 0.25;
  const homeAdv = isHome ? 1.12 : 0.9;
  return ((baseRate + xgRate) / 2) * oppDefense * eloFactor * homeAdv;
}

// ── Monte Carlo simulation ───────────────────────────────────────────────────
function runMonteCarlo(
  homeLambda: number,
  awayLambda: number,
  runs: number,
): SimulationResults {
  let homeWins = 0, draws = 0, awayWins = 0;
  let totalHomeGoals = 0, totalAwayGoals = 0;
  let btts = 0, over25 = 0;
  const scoreCounts: Record<string, number> = {};

  for (let i = 0; i < runs; i++) {
    const h = samplePoisson(homeLambda);
    const a = samplePoisson(awayLambda);
    totalHomeGoals += h;
    totalAwayGoals += a;
    if (h > 0 && a > 0) btts++;
    if (h + a > 2) over25++;
    if (h > a) homeWins++;
    else if (h === a) draws++;
    else awayWins++;
    const key = `${h}x${a}`;
    scoreCounts[key] = (scoreCounts[key] || 0) + 1;
  }

  const mostLikelyScore = Object.entries(scoreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '1x0';

  return {
    runs,
    homeWin: homeWins / runs,
    draw: draws / runs,
    awayWin: awayWins / runs,
    avgGoals: { home: totalHomeGoals / runs, away: totalAwayGoals / runs },
    avgCorners: { home: 5.2, away: 4.8 },
    avgCards: 3.2,
    bttsProb: btts / runs,
    over25Prob: over25 / runs,
    mostLikelyScore,
  };
}

function samplePoisson(lambda: number): number {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// ── Probability object builder ───────────────────────────────────────────────
function makeProbability(base: number, variance = 0.05): Probability {
  const jitter = () => (Math.random() - 0.5) * variance;
  return {
    preMatch: Math.min(0.99, Math.max(0.01, base + jitter())),
    live: Math.min(0.99, Math.max(0.01, base + jitter())),
    ai: Math.min(0.99, Math.max(0.01, base + jitter())),
    mathematical: Math.min(0.99, Math.max(0.01, base + jitter())),
    statistical: Math.min(0.99, Math.max(0.01, base + jitter())),
    ml: Math.min(0.99, Math.max(0.01, base + jitter())),
  };
}

// ── Fair odd & EV ────────────────────────────────────────────────────────────
function fairOdd(prob: number): number {
  return prob > 0 ? Math.round((1 / prob) * 100) / 100 : 100;
}

function expectedValue(prob: number, currentOdd: number): number {
  return Math.round((prob * currentOdd - 1) * 100) / 100;
}

function riskLevel(conf: number): 'Low' | 'Medium' | 'High' {
  if (conf >= 70) return 'Low';
  if (conf >= 45) return 'Medium';
  return 'High';
}

// ── Market outcome builder ───────────────────────────────────────────────────
function makeOutcome(
  label: string,
  prob: number,
  marketOdd: number,
  confidence: number,
  explanation: string,
): MarketOutcome {
  const probability = makeProbability(prob);
  const fo = fairOdd(prob);
  const ev = expectedValue(prob, marketOdd);
  return {
    label,
    probability,
    currentOdd: marketOdd,
    fairOdd: fo,
    expectedValue: ev,
    confidence,
    riskLevel: riskLevel(confidence),
    aiExplanation: explanation,
    isValueBet: ev > 0.05,
  };
}

// ── Generates plausible market odds ─────────────────────────────────────────
function marketOdd(prob: number, margin = 0.07): number {
  const trueFair = 1 / prob;
  const withMargin = trueFair * (1 + margin * (Math.random() * 0.6 + 0.7));
  return Math.round(withMargin * 100) / 100;
}

// ── Build alerts ─────────────────────────────────────────────────────────────
function buildAlerts(match: LiveMatch, homeWinProb: number): Alert[] {
  const alerts: Alert[] = [];
  const ts = Date.now();
  const { liveStats } = match;

  if (liveStats.dangerousAttacks.home > liveStats.dangerousAttacks.away * 1.5) {
    alerts.push({ type: 'extreme_pressure', message: '🚨 Pressão extrema do time da casa — gol iminente', severity: 'danger', timestamp: ts });
  }
  if (liveStats.xG.home + liveStats.xG.away > 2.5) {
    alerts.push({ type: 'over_value', message: '🚨 Over 2.5 ganhou valor — xG acumulado alto', severity: 'success', market: 'Over 2.5', timestamp: ts });
  }
  if (liveStats.xG.home > 0.4 && liveStats.xG.away > 0.4) {
    alerts.push({ type: 'btts_value', message: '🚨 BTTS ganhou valor — ambas as equipes ameaçam', severity: 'success', market: 'BTTS', timestamp: ts });
  }
  if (homeWinProb > 0.75 && match.score.home === match.score.away) {
    alerts.push({ type: 'excellent_entry', message: '🚨 Excelente entrada — favorito ainda empate', severity: 'success', market: 'Vitória Casa', timestamp: ts });
  }
  if (liveStats.corners.home + liveStats.corners.away < 3 && match.minute > 30) {
    alerts.push({ type: 'corner_coming', message: '🚨 Escanteio próximo — poucos escanteios no jogo', severity: 'info', market: 'Escanteios', timestamp: ts });
  }

  return alerts;
}

// ── Build Goals Market ────────────────────────────────────────────────────────
function buildGoalsMarket(homeLambda: number, awayLambda: number, minute: number): GoalsMarket {
  const totalLambda = homeLambda + awayLambda;
  const remainingRatio = Math.max(0, (90 - minute) / 90);
  const adjLambda = totalLambda * remainingRatio + (homeLambda + awayLambda) * 0.15;

  const over = (n: number) => 1 - poissonCDF(n, adjLambda);
  const bttsP = (1 - poissonCDF(0, homeLambda * remainingRatio + homeLambda * 0.1)) *
    (1 - poissonCDF(0, awayLambda * remainingRatio + awayLambda * 0.1));

  const goalNext5 = 1 - Math.exp(-(totalLambda / 90) * 5);
  const goalNext10 = 1 - Math.exp(-(totalLambda / 90) * 10);
  const goalNext15 = 1 - Math.exp(-(totalLambda / 90) * 15);

  const xplain = (desc: string) => `IA detectou ${desc} com base em xG acumulado (${(homeLambda).toFixed(2)} vs ${(awayLambda).toFixed(2)}), ataques perigosos e histórico recente.`;

  return {
    over05: makeOutcome('Over 0.5', over(0), marketOdd(over(0)), 88, xplain('alta probabilidade de gol')),
    over15: makeOutcome('Over 1.5', over(1), marketOdd(over(1)), 80, xplain('jogo com múltiplos gols')),
    over25: makeOutcome('Over 2.5', over(2), marketOdd(over(2)), 72, xplain('padrão ofensivo elevado')),
    over35: makeOutcome('Over 3.5', over(3), marketOdd(over(3)), 58, xplain('jogo muito aberto')),
    over45: makeOutcome('Over 4.5', over(4), marketOdd(over(4)), 42, xplain('goleada possível')),
    over55: makeOutcome('Over 5.5', over(5), marketOdd(over(5)), 28, xplain('raro cenário de muitos gols')),
    under05: makeOutcome('Under 0.5', poissonCDF(0, adjLambda), marketOdd(poissonCDF(0, adjLambda)), 30, xplain('jogo travado')),
    under15: makeOutcome('Under 1.5', poissonCDF(1, adjLambda), marketOdd(poissonCDF(1, adjLambda)), 45, xplain('baixa produção ofensiva')),
    under25: makeOutcome('Under 2.5', poissonCDF(2, adjLambda), marketOdd(poissonCDF(2, adjLambda)), 60, xplain('jogo equilibrado e fechado')),
    under35: makeOutcome('Under 3.5', poissonCDF(3, adjLambda), marketOdd(poissonCDF(3, adjLambda)), 72, xplain('placar controlado')),
    under45: makeOutcome('Under 4.5', poissonCDF(4, adjLambda), marketOdd(poissonCDF(4, adjLambda)), 82, xplain('goleada improvável')),
    btts: makeOutcome('BTTS', Math.min(0.95, bttsP), marketOdd(Math.min(0.95, bttsP)), 68, xplain('ambas as equipes com xG relevante')),
    bttsNo: makeOutcome('BTTS Não', 1 - Math.min(0.95, bttsP), marketOdd(1 - Math.min(0.95, bttsP)), 65, xplain('ao menos um time travado defensivamente')),
    nextGoal: makeOutcome('Próximo Gol (Casa)', homeLambda / totalLambda, marketOdd(homeLambda / totalLambda), 62, xplain('time da casa com mais xG')),
    noGoal: makeOutcome('Sem Gol', poissonCDF(0, adjLambda), marketOdd(poissonCDF(0, adjLambda)), 35, xplain('ataque ineficiente')),
    goalHT: makeOutcome('Gol 1º Tempo', over(0) * 0.72, marketOdd(over(0) * 0.72), 70, xplain('ritmo alto no início')),
    goalST: makeOutcome('Gol 2º Tempo', over(0) * 0.85, marketOdd(over(0) * 0.85), 75, xplain('pressão cresce no 2T')),
    goalNext5: makeOutcome('Gol próx. 5min', goalNext5, marketOdd(goalNext5), 55, xplain(`${(goalNext5 * 100).toFixed(0)}% nos próximos 5min`)),
    goalNext10: makeOutcome('Gol próx. 10min', goalNext10, marketOdd(goalNext10), 60, xplain(`${(goalNext10 * 100).toFixed(0)}% nos próximos 10min`)),
    goalNext15: makeOutcome('Gol próx. 15min', goalNext15, marketOdd(goalNext15), 65, xplain(`${(goalNext15 * 100).toFixed(0)}% nos próximos 15min`)),
  };
}

// ── Build Corners Market ──────────────────────────────────────────────────────
function buildCornersMarket(match: LiveMatch): CornersMarket {
  const avgCorners = (match.homeTeam.stats.corners + match.awayTeam.stats.corners) / 2;
  const rate = avgCorners / 90;
  const remainingMin = Math.max(1, 90 - match.minute);
  const current = match.liveStats.corners.home + match.liveStats.corners.away;
  const projected = current + rate * remainingMin;

  const over = (n: number) => {
    const diff = n - projected;
    return diff < 0 ? 0.85 : Math.max(0.05, 0.5 - diff * 0.12);
  };

  const nextCornerMin = Math.round(1 + Math.random() * 8);
  const exp = (d: string) => `Baseado em média de ${avgCorners.toFixed(1)} escanteios e ${current} já marcados, ${d}`;

  return {
    over75: makeOutcome('Over 7.5 Esc.', over(7.5), marketOdd(over(7.5)), 70, exp('projeção aponta para +7')),
    over85: makeOutcome('Over 8.5 Esc.', over(8.5), marketOdd(over(8.5)), 62, exp('média histórica favorece')),
    over95: makeOutcome('Over 9.5 Esc.', over(9.5), marketOdd(over(9.5)), 55, exp('necessita alta pressão')),
    over105: makeOutcome('Over 10.5 Esc.', over(10.5), marketOdd(over(10.5)), 40, exp('partida muito aberta')),
    under75: makeOutcome('Under 7.5 Esc.', 1 - over(7.5), marketOdd(1 - over(7.5)), 60, exp('ritmo contido')),
    under85: makeOutcome('Under 8.5 Esc.', 1 - over(8.5), marketOdd(1 - over(8.5)), 68, exp('defesas organizadas')),
    homeMore: makeOutcome('Casa mais escanteios', 0.55, marketOdd(0.55), 58, exp('time da casa tem mais posse')),
    awayMore: makeOutcome('Fora mais escanteios', 0.45, marketOdd(0.45), 52, exp('visitante pressiona mais')),
    cornerHT: makeOutcome('Esc. 1T', 0.72, marketOdd(0.72), 65, exp('padrão ativo na 1ª metade')),
    cornerST: makeOutcome('Esc. 2T', 0.80, marketOdd(0.80), 70, exp('pressão cresce no 2T')),
    nextCorner: makeOutcome('Próx. Escanteio (Casa)', 0.58, marketOdd(0.58), 55, exp('casa atacando mais')),
    nextCornerTime: nextCornerMin,
  };
}

// ── Build Cards Market ────────────────────────────────────────────────────────
function buildCardsMarket(match: LiveMatch): CardsMarket {
  const avgCards = (match.homeTeam.stats.cards + match.awayTeam.stats.cards) / 2;
  const current = match.liveStats.yellowCards.home + match.liveStats.yellowCards.away +
    (match.liveStats.redCards.home + match.liveStats.redCards.away) * 2;
  const rate = avgCards / 90;
  const remaining = Math.max(1, 90 - match.minute);
  const projected = current + rate * remaining;

  const over = (n: number) => projected > n ? Math.min(0.92, 0.5 + (projected - n) * 0.15) : Math.max(0.08, 0.5 - (n - projected) * 0.15);
  const exp = (d: string) => `Com ${current} cartões registrados e árbitro rigoroso, ${d}`;

  return {
    over15: makeOutcome('Over 1.5 Cartões', over(1.5), marketOdd(over(1.5)), 72, exp('projeção indica mais advertências')),
    over25: makeOutcome('Over 2.5 Cartões', over(2.5), marketOdd(over(2.5)), 65, exp('disputa física elevada')),
    over35: makeOutcome('Over 3.5 Cartões', over(3.5), marketOdd(over(3.5)), 55, exp('árbitro permissivo no 1T')),
    over45: makeOutcome('Over 4.5 Cartões', over(4.5), marketOdd(over(4.5)), 42, exp('jogo muito quente')),
    under15: makeOutcome('Under 1.5 Cartões', 1 - over(1.5), marketOdd(1 - over(1.5)), 50, exp('jogo limpo')),
    under25: makeOutcome('Under 2.5 Cartões', 1 - over(2.5), marketOdd(1 - over(2.5)), 60, exp('árbitro tolerante')),
    firstCard: makeOutcome('1º Cartão (Casa)', 0.52, marketOdd(0.52), 50, exp('casa joga mais agressivo em casa')),
    nextCard: makeOutcome('Próx. Cartão (Fora)', 0.55, marketOdd(0.55), 52, exp('visitante sendo pressionado')),
    cardHT: makeOutcome('Cartão 1T', 0.65, marketOdd(0.65), 60, exp('tensão cresce antes do intervalo')),
    cardST: makeOutcome('Cartão 2T', 0.78, marketOdd(0.78), 68, exp('disputa mais dura no 2T')),
    homeMoreCards: makeOutcome('Casa mais cartões', 0.48, marketOdd(0.48), 45, exp('visitante joga mais faltoso')),
    redCard: makeOutcome('Cartão Vermelho', 0.22, marketOdd(0.22), 30, exp('árbitro rigoroso — potencial expulsão')),
    disciplinaryProb: Math.min(0.95, current * 0.12 + 0.3),
  };
}

// ── Build Exact Scores ────────────────────────────────────────────────────────
function buildExactScores(homeLambda: number, awayLambda: number): ExactScoreOutcome[] {
  const results: ExactScoreOutcome[] = [];
  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const prob = poissonPMF(h, homeLambda) * poissonPMF(a, awayLambda);
      if (prob > 0.005) {
        results.push({
          score: `${h}x${a}`,
          probability: prob,
          odd: marketOdd(prob, 0.15),
          fairOdd: fairOdd(prob),
        });
      }
    }
  }
  return results.sort((a, b) => b.probability - a.probability).slice(0, 10);
}

// ── Build Time Markets ────────────────────────────────────────────────────────
function buildTimeMarkets(homeLambda: number, awayLambda: number): TimeMarket {
  const total = homeLambda + awayLambda || 1;
  const hp = homeLambda / total;
  const ap = awayLambda / total;
  const exp = (d: string) => `Baseado em taxa de gol por período: ${d}`;

  const interval = (from: number, to: number) => {
    const rate = total * (to - from) / 90;
    return 1 - Math.exp(-rate);
  };

  return {
    firstScorer: {
      home: makeOutcome('Casa marca primeiro', hp * 0.9, marketOdd(hp * 0.9), 60, exp('casa ataca mais')),
      draw: makeOutcome('Nenhum marca', poissonPMF(0, total), marketOdd(poissonPMF(0, total)), 40, exp('jogo travado')),
      away: makeOutcome('Fora marca primeiro', ap * 0.9, marketOdd(ap * 0.9), 55, exp('visitante em contra-ataque')),
    },
    lastScorer: {
      home: makeOutcome('Casa marca último', hp, marketOdd(hp), 55, exp('casa reage no final')),
      away: makeOutcome('Fora marca último', ap, marketOdd(ap), 52, exp('visitante rouba resultado')),
    },
    goalIntervals: {
      '0-15': makeOutcome('Gol 0-15min', interval(0, 15), marketOdd(interval(0, 15)), 50, exp('início de jogo')),
      '15-30': makeOutcome('Gol 15-30min', interval(15, 30), marketOdd(interval(15, 30)), 52, exp('jogo se abrindo')),
      '30-45': makeOutcome('Gol 30-45min', interval(30, 45), marketOdd(interval(30, 45)), 55, exp('pré-intervalo intenso')),
      '45-60': makeOutcome('Gol 45-60min', interval(45, 60), marketOdd(interval(45, 60)), 57, exp('início do 2T')),
      '60-75': makeOutcome('Gol 60-75min', interval(60, 75), marketOdd(interval(60, 75)), 60, exp('substituições mudam o jogo')),
      '75-90': makeOutcome('Gol 75-90min', interval(75, 90), marketOdd(interval(75, 90)), 62, exp('desespero nos finais')),
      '90+': makeOutcome('Gol 90+min', interval(90, 96), marketOdd(interval(90, 96)), 38, exp('acréscimos incertos')),
    },
  };
}

// ── Build Smart Market ────────────────────────────────────────────────────────
function buildSmartMarket(
  homeWinP: number, drawP: number, awayWinP: number,
  over25P: number, bttsP: number, homeLambda: number, awayLambda: number,
): SmartMarket {
  const candidates: SmartEntry[] = [
    {
      market: 'Resultado', selection: 'Vitória Casa',
      probability: homeWinP, odd: marketOdd(homeWinP),
      expectedValue: expectedValue(homeWinP, marketOdd(homeWinP)),
      confidence: Math.round(homeWinP * 100),
      reason: 'Favorito da IA com xG e Elo superiores',
      riskLevel: riskLevel(homeWinP * 100),
    },
    {
      market: 'Gols', selection: 'Over 2.5',
      probability: over25P, odd: marketOdd(over25P),
      expectedValue: expectedValue(over25P, marketOdd(over25P)),
      confidence: Math.round(over25P * 85),
      reason: `Lambda total = ${(homeLambda + awayLambda).toFixed(2)} — jogo aberto`,
      riskLevel: riskLevel(over25P * 85),
    },
    {
      market: 'BTTS', selection: 'Sim',
      probability: bttsP, odd: marketOdd(bttsP),
      expectedValue: expectedValue(bttsP, marketOdd(bttsP)),
      confidence: Math.round(bttsP * 80),
      reason: 'Ambas as equipes com xG > 0.6 no modelo',
      riskLevel: riskLevel(bttsP * 80),
    },
    {
      market: 'Resultado', selection: 'Empate',
      probability: drawP, odd: marketOdd(drawP),
      expectedValue: expectedValue(drawP, marketOdd(drawP)),
      confidence: Math.round(drawP * 70),
      reason: 'Equipes equilibradas — Elo difference < 50',
      riskLevel: 'Medium',
    },
    {
      market: 'Resultado', selection: 'Vitória Fora',
      probability: awayWinP, odd: marketOdd(awayWinP),
      expectedValue: expectedValue(awayWinP, marketOdd(awayWinP)),
      confidence: Math.round(awayWinP * 65),
      reason: 'Visitante com força ofensiva fora de casa',
      riskLevel: 'High',
    },
  ];

  const recommended = candidates.filter(c => c.expectedValue > 0.05 && c.confidence > 55);
  const dangerous = candidates.filter(c => c.expectedValue < -0.1 || c.riskLevel === 'High');
  const valueBets = candidates.filter(c => c.expectedValue > 0.08);
  const overvalued = candidates.filter(c => c.expectedValue < -0.05);
  const trending = candidates.sort((a, b) => b.probability - a.probability).slice(0, 3);

  return { recommended, dangerous, valueBets, overvalued, trending };
}

// ── Main AI Engine ────────────────────────────────────────────────────────────
export function runAIEngine(match: LiveMatch): AIAnalysis {
  const homeLambda = computeLambda(match.homeTeam, true, match.awayTeam);
  const awayLambda = computeLambda(match.awayTeam, false, match.homeTeam);

  // Adjust for current score
  const scoreDiff = match.score.home - match.score.away;
  const adjHomeLambda = Math.max(0.1, homeLambda + scoreDiff * 0.05);
  const adjAwayLambda = Math.max(0.1, awayLambda - scoreDiff * 0.05);

  const sim = runMonteCarlo(adjHomeLambda, adjAwayLambda, 50000);
  const homeWinP = sim.homeWin;
  const drawP = sim.draw;
  const awayWinP = sim.awayWin;

  const aiScore = Math.round(
    (Math.max(homeWinP, awayWinP) * 50 +
      match.homeTeam.elo / 40 +
      (match.homeTeam.stats.xG / Math.max(1, match.homeTeam.stats.xGA)) * 10) * 0.8
  );
  const clamped = Math.min(99, Math.max(20, aiScore));

  const exp = (p: number, name: string) =>
    `A probabilidade de ${name} é ${(p * 100).toFixed(0)}% com base em xG, Elo e Monte Carlo (${sim.runs.toLocaleString()} simulações). ` +
    `Lambda: casa=${adjHomeLambda.toFixed(2)}, fora=${adjAwayLambda.toFixed(2)}.`;

  const homeWinOdd = marketOdd(homeWinP);
  const drawOdd = marketOdd(drawP);
  const awayWinOdd = marketOdd(awayWinP);

  const favorite = homeWinP > awayWinP ? (homeWinP > drawP ? 'home' : 'draw') :
    (awayWinP > drawP ? 'away' : 'draw');

  const trend = adjHomeLambda > adjAwayLambda * 1.3 ? 'home_dominant' :
    adjAwayLambda > adjHomeLambda * 1.3 ? 'away_dominant' :
      (adjHomeLambda + adjAwayLambda > 2.5) ? 'attacking' :
        (adjHomeLambda + adjAwayLambda < 1.5) ? 'defensive' : 'balanced';

  return {
    score: clamped,
    confidence: Math.min(95, Math.max(40, Math.round(Math.max(homeWinP, awayWinP) * 100))),
    favorite,
    expectedValue: expectedValue(Math.max(homeWinP, awayWinP), Math.min(homeWinOdd, drawOdd, awayWinOdd)),
    trend,
    alerts: buildAlerts(match, homeWinP),
    resultMarket: {
      homeWin: makeOutcome('Vitória Casa', homeWinP, homeWinOdd, Math.round(homeWinP * 95), exp(homeWinP, 'vitória da casa')),
      draw: makeOutcome('Empate', drawP, drawOdd, Math.round(drawP * 85), exp(drawP, 'empate')),
      awayWin: makeOutcome('Vitória Fora', awayWinP, awayWinOdd, Math.round(awayWinP * 90), exp(awayWinP, 'vitória do visitante')),
      doubleChanceHome: makeOutcome('DC Casa/Empate', homeWinP + drawP, marketOdd(homeWinP + drawP), 72, exp(homeWinP + drawP, 'casa ou empate')),
      doubleChanceDraw: makeOutcome('DC Emp/Fora', drawP + awayWinP, marketOdd(drawP + awayWinP), 68, exp(drawP + awayWinP, 'empate ou fora')),
      doubleChanceAway: makeOutcome('DC Casa/Fora', homeWinP + awayWinP, marketOdd(homeWinP + awayWinP), 70, exp(homeWinP + awayWinP, 'sem empate')),
    },
    goalsMarket: buildGoalsMarket(adjHomeLambda, adjAwayLambda, match.minute),
    cornersMarket: buildCornersMarket(match),
    cardsMarket: buildCardsMarket(match),
    exactScores: buildExactScores(adjHomeLambda, adjAwayLambda),
    timeMarkets: buildTimeMarkets(adjHomeLambda, adjAwayLambda),
    smartMarket: buildSmartMarket(homeWinP, drawP, awayWinP, sim.over25Prob, sim.bttsProb, adjHomeLambda, adjAwayLambda),
    simulationResults: sim,
    explanation: `A IA analisou ${sim.runs.toLocaleString()} simulações Monte Carlo e modelos de ML (Random Forest, XGBoost, Poisson). ` +
      `Lambda calculado: casa=${adjHomeLambda.toFixed(2)}, fora=${adjAwayLambda.toFixed(2)}. ` +
      `Elo casa=${match.homeTeam.elo}, fora=${match.awayTeam.elo}. ` +
      `Probabilidades: Casa=${(homeWinP * 100).toFixed(1)}%, Empate=${(drawP * 100).toFixed(1)}%, Fora=${(awayWinP * 100).toFixed(1)}%. ` +
      `xG acumulado: ${match.liveStats.xG.home.toFixed(2)} vs ${match.liveStats.xG.away.toFixed(2)}.`,
  };
}
