# ⚽ PlacarGreen V2.0

**Plataforma profissional de inteligência para apostas esportivas com IA e Machine Learning**

## 🚀 Funcionalidades

### Dashboard Principal
- Placar ao vivo com cronômetro, campeonato, estádio, árbitro, clima, temperatura e público
- Score IA (0–100), confiança, valor esperado e favorito da IA
- Tendência e explicação automática da IA

### 🤖 PlacarGreen AI Engine
- Análise histórica (últimos 5, 10, 20 jogos, casa, fora, confronto direto)
- 8 modelos de Machine Learning: Random Forest, Gradient Boosting, XGBoost, LightGBM, LSTM, Bayesian, Elo Rating, Poisson
- xG, grandes chances, ataques perigosos, défense e dados externos

### 💰 Mercados
- **Resultado**: Vitória Casa/Empate/Fora, Dupla Chance, Handicap
- **Gols**: Over/Under 0.5 a 5.5, BTTS, Próximo Gol, Gol por tempo
- **Escanteios**: Mais/Menos, handicap, tempo
- **Cartões**: Total, primeiro, equipe mais advertida
- **Placar Exato**: Top 10 mais prováveis com probabilidade e variação
- **Tempo**: Primeiro/último marcador, gol por intervalo de 15 min
- **Mercado Inteligente**: Entradas recomendadas, perigosas e em tendência

Cada mercado exibe: Probabilidade Pré-jogo, Ao Vivo, IA, Matemática, Estatística, ML, Odd Atual, Odd Justa, Valor Esperado, Confiança, Risco e Explicação da IA.

### 📊 Gráficos
- Momentum do jogo (área animada)
- xG acumulado por tempo
- Radar ofensivo/defensivo
- Estatísticas ao vivo com barras animadas

### 🎲 Simulações Monte Carlo
- 10.000 / 50.000 / 100.000 simulações
- Previsão de resultado, gols, BTTS e placar exato

### 🔔 Alertas Inteligentes
- Gol iminente, pressão extrema, escanteio próximo
- BTTS ganhou valor, Over/Under mudando, odd incorreta
- Excelente entrada / Evitar entrada

### 👤 Estatísticas de Jogadores
- Para todos os jogadores: gols, assistências, finalizações, passes, desarmes, interceptações, faltas, cartões, dribles, defesas, nota, forma

## 🚀 Deploy na Vercel (recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FThisb077%2FPLACARGREEN&env=FOOTBALL_API_KEY&envDescription=Sua%20chave%20da%20API-Football%20(api-sports.io)&envLink=https%3A%2F%2Fwww.api-football.com%2F&project-name=placargreen&repository-name=PLACARGREEN)

1. Clique no botão acima
2. Conecte com o GitHub
3. Preencha `FOOTBALL_API_KEY` com sua chave da [API-Football](https://www.api-football.com/)
4. Clique em **Deploy** — o site fica no ar em ~2 minutos

## 🛠️ Instalação local

```bash
# 1. Copie o arquivo de variáveis de ambiente
cp .env.example .env.local
# 2. Preencha FOOTBALL_API_KEY no .env.local
# 3. Instale as dependências e rode
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## 🏗️ Tecnologias

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** (tema escuro premium)
- **Recharts** (gráficos interativos)
