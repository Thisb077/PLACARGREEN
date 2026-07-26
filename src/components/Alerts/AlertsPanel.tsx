import type { Alert } from '../../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityStyles: Record<string, string> = {
  danger: 'border-red-500/40 bg-red-500/10 text-red-400',
  success: 'border-green-500/40 bg-green-500/10 text-green-400',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Alertas Inteligentes</h3>
        <p className="text-xs text-gray-600">Nenhum alerta no momento.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 animate-fade-in">
      <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
        🔔 Alertas Inteligentes
        <span className="ml-2 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">{alerts.length}</span>
      </h3>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`rounded-lg border px-3 py-2 text-sm animate-slide-in ${severityStyles[alert.severity]}`}
          >
            <div className="font-medium">{alert.message}</div>
            {alert.market && (
              <div className="mt-0.5 text-xs opacity-70">Mercado: {alert.market}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
