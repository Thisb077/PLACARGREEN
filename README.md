# 🟢 PlacarGreen v2.0

**Plataforma profissional de inteligência para apostas esportivas com Inteligência Artificial.**

## 🚀 Sobre o Projeto

O PlacarGreen v2.0 é uma plataforma completa de análise de apostas esportivas que utiliza IA, Machine Learning, modelos estatísticos e simulações probabilísticas para fornecer recomendações de valor (Value Bets) com explicações detalhadas.

## ✨ Funcionalidades

### 🤖 PlacarGreen AI Engine
- Modelo de Poisson para previsão de gols
- Simulações Monte Carlo (50.000 iterações)
- Sistema de Elo Rating
- Modelo de xG (Expected Goals)
- Score IA de 0 a 100

### 📊 Dashboard Principal
- Placar ao vivo com cronômetro
- Campeonato, estádio, árbitro, clima, temperatura, público
- Escalações com lesões e suspensões
- Formação tática
- Odds em tempo real
- Score IA, confiança, valor esperado, tendência

### 🏆 Mercados de Apostas
- **Resultado**: 1X2, Dupla Chance, Handicap
- **Gols**: Over/Under 0.5–5.5, BTTS, Próximo Gol, Gol por período, Gol nos próximos 5/10/15 minutos
- **Escanteios**: Over/Under, Handicap, Próximo Escanteio, Tempo provável
- **Cartões**: Over/Under, Primeiro Cartão, Probabilidade disciplinar
- **Jogadores**: Gols, assistências, finalizações, passes, dribles, defesas, forma
- **Placar Exato**: Top 10 placares mais prováveis com probabilidade e odds
- **Tempo**: Primeiro/Último gol, Intervalos de tempo (0-15, 15-30, ..., 90+)
- **IA Smart**: Value Bets, Entradas recomendadas/perigosas, Mercados em tendência

### 📈 Gráficos Interativos
- Momentum do jogo
- Radar ofensivo comparativo
- Gráfico de barras de estatísticas

### 🔔 Alertas Inteligentes
- 🚨 Gol iminente
- 🚨 Pressão extrema
- 🚨 BTTS ganhou valor
- 🚨 Over ganhou valor
- 🚨 Escanteio próximo
- 🚨 Excelente entrada

### 🧠 Para Cada Mercado
- Probabilidade Pré-jogo, Ao Vivo, IA, Matemática, Estatística, ML
- Odd Atual e Odd Justa
- Valor Esperado (EV)
- Nível de Confiança e Risco
- Explicação automática da IA

## 🛠 Tecnologias

- **Frontend**: React 19 + TypeScript + Vite
- **Estilização**: Tailwind CSS v4
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Motor IA**: Poisson, Monte Carlo, Elo Rating, xG model

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento (com hot-reload)
npm run dev

# Build de produção
npm run build

# Visualizar build de produção
npm run preview
```

## 🔗 Integração com APIs Reais

Para produção, conecte às seguintes APIs:

- **API-Football**: Dados ao vivo, escalações, estatísticas
- **The Odds API**: Odds em tempo real de múltiplas casas
- **StatsBomb / Opta**: Dados de xG e estatísticas avançadas

Configure as chaves no arquivo `.env`:

```env
VITE_API_FOOTBALL_KEY=sua_chave_aqui
VITE_ODDS_API_KEY=sua_chave_aqui
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Alerts/         # AlertsPanel
│   ├── Charts/         # Gráficos (Momentum, Radar, Barras)
│   ├── Dashboard/      # MatchCard, MatchDetails
│   ├── Layout/         # Header
│   ├── Markets/        # Todos os mercados de apostas
│   └── UI/             # AIScore
├── data/               # Dados mock realistas
├── engine/             # PlacarGreen AI Engine
├── hooks/              # useRealTimeData (simulação em tempo real)
└── types/              # TypeScript types
```

---

> **Aviso Legal**: O PlacarGreen é uma ferramenta de análise estatística para fins informativos. Aposte com responsabilidade. Resultados passados não garantem resultados futuros.
