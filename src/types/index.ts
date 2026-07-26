export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  elo: number;
  form: ('W' | 'D' | 'L')[];
  homeRecord: { w: number; d: number; l: number };
  awayRecord: { w: number; d: number; l: number };
  stats: TeamStats;
  players: Player[];
}

export interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  xG: number;
  xGA: number;
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  cards: number;
  yellowCards: number;
  redCards: number;
  tackles: number;
  interceptions: number;
  saves: number;
  bigChances: number;
  bigChancesMissed: number;
  attacks: number;
  dangerousAttacks: number;
  progressivePasses: number;
  dribbles: number;
  clearances: number;
  defensiveErrors: number;
}

export interface Player {
  id: number;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CM' | 'DM' | 'AM' | 'LW' | 'RW' | 'ST';
  number: number;
  stats: PlayerStats;
  isInjured?: boolean;
  isSuspended?: boolean;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  corners: number;
  dribbles: number;
  saves: number;
  minutesPerGoal: number;
  form: number; // 0-10
}

export interface Weather {
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy' | 'Foggy';
  temperature: number;
  humidity: number;
  wind: number;
}

export interface LiveMatch {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  score: { home: number; away: number };
  minute: number;
  status: 'Pre-Match' | 'Live' | 'HT' | 'FT';
  competition: string;
  stadium: string;
  referee: string;
  attendance: number;
  weather: Weather;
  formation: { home: string; away: string };
  events: MatchEvent[];
  liveStats: LiveStats;
  aiAnalysis: AIAnalysis;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'corner' | 'var';
  team: 'home' | 'away';
  player: string;
  description: string;
}

export interface LiveStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  xG: { home: number; away: number };
  attacks: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  bigChances: { home: number; away: number };
  tackles: { home: number; away: number };
  momentum: number[]; // -100 to 100 per minute (home positive)
}

export interface Probability {
  preMatch: number;
  live: number;
  ai: number;
  mathematical: number;
  statistical: number;
  ml: number;
}

export interface MarketOutcome {
  label: string;
  probability: Probability;
  currentOdd: number;
  fairOdd: number;
  expectedValue: number;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  aiExplanation: string;
  isValueBet: boolean;
}

export interface AIAnalysis {
  score: number; // 0-100
  confidence: number; // 0-100
  favorite: 'home' | 'away' | 'draw';
  expectedValue: number;
  trend: 'home_dominant' | 'away_dominant' | 'balanced' | 'attacking' | 'defensive';
  alerts: Alert[];
  resultMarket: {
    homeWin: MarketOutcome;
    draw: MarketOutcome;
    awayWin: MarketOutcome;
    doubleChanceHome: MarketOutcome;
    doubleChanceAway: MarketOutcome;
    doubleChanceDraw: MarketOutcome;
  };
  goalsMarket: GoalsMarket;
  cornersMarket: CornersMarket;
  cardsMarket: CardsMarket;
  exactScores: ExactScoreOutcome[];
  timeMarkets: TimeMarket;
  smartMarket: SmartMarket;
  simulationResults: SimulationResults;
  explanation: string;
}

export interface GoalsMarket {
  over05: MarketOutcome;
  over15: MarketOutcome;
  over25: MarketOutcome;
  over35: MarketOutcome;
  over45: MarketOutcome;
  over55: MarketOutcome;
  under05: MarketOutcome;
  under15: MarketOutcome;
  under25: MarketOutcome;
  under35: MarketOutcome;
  under45: MarketOutcome;
  btts: MarketOutcome;
  bttsNo: MarketOutcome;
  nextGoal: MarketOutcome;
  noGoal: MarketOutcome;
  goalHT: MarketOutcome;
  goalST: MarketOutcome;
  goalNext5: MarketOutcome;
  goalNext10: MarketOutcome;
  goalNext15: MarketOutcome;
}

export interface CornersMarket {
  over75: MarketOutcome;
  over85: MarketOutcome;
  over95: MarketOutcome;
  over105: MarketOutcome;
  under75: MarketOutcome;
  under85: MarketOutcome;
  homeMore: MarketOutcome;
  awayMore: MarketOutcome;
  cornerHT: MarketOutcome;
  cornerST: MarketOutcome;
  nextCorner: MarketOutcome;
  nextCornerTime: number; // minutes
}

export interface CardsMarket {
  over15: MarketOutcome;
  over25: MarketOutcome;
  over35: MarketOutcome;
  over45: MarketOutcome;
  under15: MarketOutcome;
  under25: MarketOutcome;
  firstCard: MarketOutcome;
  nextCard: MarketOutcome;
  cardHT: MarketOutcome;
  cardST: MarketOutcome;
  homeMoreCards: MarketOutcome;
  redCard: MarketOutcome;
  disciplinaryProb: number;
}

export interface ExactScoreOutcome {
  score: string;
  probability: number;
  odd: number;
  fairOdd: number;
}

export interface TimeMarket {
  firstScorer: { home: MarketOutcome; draw: MarketOutcome; away: MarketOutcome };
  lastScorer: { home: MarketOutcome; away: MarketOutcome };
  goalIntervals: {
    '0-15': MarketOutcome;
    '15-30': MarketOutcome;
    '30-45': MarketOutcome;
    '45-60': MarketOutcome;
    '60-75': MarketOutcome;
    '75-90': MarketOutcome;
    '90+': MarketOutcome;
  };
}

export interface SmartMarket {
  recommended: SmartEntry[];
  dangerous: SmartEntry[];
  valueBets: SmartEntry[];
  overvalued: SmartEntry[];
  trending: SmartEntry[];
}

export interface SmartEntry {
  market: string;
  selection: string;
  probability: number;
  odd: number;
  expectedValue: number;
  confidence: number;
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Alert {
  type: 'goal_imminent' | 'extreme_pressure' | 'corner_coming' | 'btts_value' | 'over_value' | 'under_value' | 'market_hot' | 'wrong_odd' | 'excellent_entry' | 'avoid_entry';
  message: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
  market?: string;
  timestamp: number;
}

export interface SimulationResults {
  runs: number;
  homeWin: number;
  draw: number;
  awayWin: number;
  avgGoals: { home: number; away: number };
  avgCorners: { home: number; away: number };
  avgCards: number;
  bttsProb: number;
  over25Prob: number;
  mostLikelyScore: string;
}
