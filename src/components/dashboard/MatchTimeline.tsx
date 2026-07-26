"use client";
import { TimelineEvent } from "@/types";

interface Props {
  events: TimelineEvent[];
  homeColor: string;
  awayColor: string;
}

function EventIcon({ type }: { type: TimelineEvent["type"] }) {
  switch (type) {
    case "goal": return <span className="text-base">⚽</span>;
    case "yellowCard": return <span className="text-base">🟨</span>;
    case "redCard": return <span className="text-base">🟥</span>;
    case "substitution": return <span className="text-base">🔄</span>;
    case "corner": return <span className="text-base">🚩</span>;
    default: return <span>📌</span>;
  }
}

export default function MatchTimeline({ events, homeColor, awayColor }: Props) {
  const sorted = [...events].sort((a, b) => a.minute - b.minute);
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">⏱️ Linha do Tempo</h3>
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700 -translate-x-1/2" />
        
        <div className="space-y-3">
          {sorted.map((event, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                event.team === "home" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Content side */}
              <div
                className={`flex-1 ${
                  event.team === "home" ? "text-right pr-4" : "text-left pl-4"
                }`}
              >
                <div className="text-xs font-semibold text-white">{event.player}</div>
                {event.type === "goal" && (
                  <div className="text-xs text-yellow-400 font-bold">GOL!</div>
                )}
                <div className="text-xs text-gray-400">{event.description}</div>
              </div>

              {/* Center minute + icon */}
              <div className="flex flex-col items-center z-10 relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{
                    borderColor: event.team === "home" ? homeColor : awayColor,
                    backgroundColor: event.type === "goal" ? "#fbbf24" : "#1f2937",
                    color: event.type === "goal" ? "#000" : "#fff",
                  }}
                >
                  {event.minute}&apos;
                </div>
              </div>

              {/* Other side (blank) */}
              <div className="flex-1 flex items-center">
                <EventIcon type={event.type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
