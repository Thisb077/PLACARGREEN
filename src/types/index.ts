export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
  stats: PlayerStats;
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
  saves?: number;
  minutesPerGoal?: number;
  form: number;
  avgRating: number;
}

export interface LiveMatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  attacks: [number, number];
  dangerousAttacks: [number, number];
  xG: [number, number];
  xGA: [number, number];
  bigChances: [number, number];
}

export interface Odds {
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  btts: number;
  bttsNo: number;
}

export interface AIAnalysis {
  score: number;
  confidence: number;
  favorite: 'home' | 'draw' | 'away';
  expectedValue: number;
  trend: string;
  explanation: string;
  recommendation: 'FORTE' | 'BOM' | 'MODERADO' | 'FRACO' | 'EVITAR';
}

export interface Market {
  name: string;
  odds: number;
  fairOdds: number;
  preGameProb: number;
  liveProb: number;
  aiProb: number;
  mathProb: number;
  statProb: number;
  mlProb: number;
  expectedValue: number;
  confidence: number;
  risk: 'BAIXO' | 'MÉDIO' | 'ALTO';
  explanation: string;
  value: boolean;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'LIVE' | 'HT' | 'FT' | 'UPCOMING';
  competition: string;
  stadium: string;
  referee: string;
  weather: string;
  temperature: number;
  attendance: number;
  stats: LiveMatchStats;
  odds: Odds;
  ai: AIAnalysis;
  homePlayers: Player[];
  awayPlayers: Player[];
  timeline: TimelineEvent[];
  momentumData: MomentumPoint[];
}

export interface TimelineEvent {
  minute: number;
  type: 'goal' | 'yellowCard' | 'redCard' | 'substitution' | 'corner';
  team: 'home' | 'away';
  player: string;
  description: string;
}

export interface MomentumPoint {
  minute: number;
  home: number;
  away: number;
  xGHome: number;
  xGAway: number;
}

export interface Alert {
  id: string;
  type: 'danger' | 'value' | 'warning' | 'info';
  emoji: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface SimulationResult {
  outcome: string;
  probability: number;
  count: number;
}

export type BettorProfile = "conservador" | "moderado" | "agressivo";

export interface BacktestWindow {
  label: string;
  hitRate: number;
  roi: number;
  sampleSize: number;
}

export interface ConfidenceMarket {
  market: string;
  probability: number;
  confidence: "BAIXA" | "MÉDIA" | "ALTA";
}

export interface OpportunityItem {
  market: string;
  odd: number;
  impliedProbability: number;
  modelProbability: number;
  expectedValue: number;
  risk: "BAIXO" | "MÉDIO" | "ALTO";
}

export interface ArbitrageItem {
  market: string;
  homeBook: string;
  awayBook: string;
  combinedProbability: number;
  surebetMargin: number;
}

export interface TriggerPlan {
  phase: "Pré-jogo" | "Ao vivo";
  trigger: string;
  action: string;
}

export interface LeaguePredictability {
  league: string;
  predictability: number;
  avgEv: number;
}
