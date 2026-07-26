"use client";
import { mockAlerts } from "@/lib/mockData";
import { Alert } from "@/types";

export default function SmartAlerts() {
  const alertStyles: Record<Alert["type"], { bg: string; border: string; text: string }> = {
    danger: { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-300" },
    value: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-300" },
    warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-300" },
    info: { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-300" },
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
        🔔 <span>Alertas Inteligentes</span>
        <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
          {mockAlerts.length} ATIVOS
        </span>
      </h3>
      <div className="space-y-2">
        {mockAlerts.map((alert) => {
          const style = alertStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-xl p-3 border ${style.bg} ${style.border}`}
            >
              <div className="text-lg flex-shrink-0">{alert.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${style.text}`}>{alert.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{alert.description}</div>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">{alert.timestamp}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
