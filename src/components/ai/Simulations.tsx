"use client";
import { mockSimulationResults } from "@/lib/mockData";

export default function Simulations() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
        🎲 <span>Simulações Monte Carlo</span>
      </h3>
      <div className="text-xs text-gray-400 mb-4">
        Baseado em <span className="text-white font-bold">100.000</span> simulações
      </div>
      <div className="space-y-3">
        {mockSimulationResults.map((sim) => (
          <div key={sim.outcome}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-semibold">{sim.outcome}</span>
              <span className="text-white font-bold">{sim.probability.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{
                  width: `${sim.probability}%`,
                  background: sim.probability > 70 ? "linear-gradient(90deg, #10b981, #059669)" :
                    sim.probability > 50 ? "linear-gradient(90deg, #3b82f6, #2563eb)" :
                    "linear-gradient(90deg, #6b7280, #4b5563)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{sim.count.toLocaleString()} ocorrências</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <button className="bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 py-2 rounded-lg border border-gray-600 transition-colors">
          10.000 sim
        </button>
        <button className="bg-blue-500/20 hover:bg-blue-500/30 text-xs text-blue-300 py-2 rounded-lg border border-blue-500/40 transition-colors">
          50.000 sim
        </button>
        <button className="bg-purple-500/20 hover:bg-purple-500/30 text-xs text-purple-300 py-2 rounded-lg border border-purple-500/40 transition-colors">
          100.000 sim
        </button>
      </div>
    </div>
  );
}
