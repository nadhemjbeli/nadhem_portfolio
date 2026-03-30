"use client";

import type { DifficultyLevel } from "../algorithms/types";

interface ScorePanelProps {
  score: number;
  streak: number;
  accuracy: number;
  level: DifficultyLevel;
  levelLabel: string;
  onLevelChange: (level: DifficultyLevel) => void;
}

const LEVELS: { id: DifficultyLevel; label: string }[] = [
  { id: "LEVEL_1", label: "LEVEL_1" },
  { id: "LEVEL_2", label: "LEVEL_2" },
  { id: "LEVEL_3", label: "LEVEL_3" },
];

export default function ScorePanel({
  score,
  streak,
  accuracy,
  level,
  levelLabel,
  onLevelChange,
}: ScorePanelProps) {
  const stats = [
    { label: "SCORE", value: score, color: "#AAFF00" },
    { label: "STREAK", value: streak, color: "#FFD700" },
    { label: "ACCURACY", value: `${accuracy}%`, color: "#00FFCC" },
    { label: "LEVEL", value: levelLabel, color: "rgba(224,224,224,0.7)" },
  ];

  return (
    <div className="glass-panel border border-os-border/20 rounded-xl p-4 space-y-4">
      {/* Stats Row */}
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-os-text/30">{s.label}</span>
            <span className="text-xl font-black font-mono" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Level Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-os-text/30 mr-1">DIFFICULTY</span>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => onLevelChange(l.id)}
            className={`px-3 py-1.5 text-[9px] font-black tracking-widest rounded border transition-all ${
              level === l.id
                ? "bg-neon-primary/20 border-neon-primary text-neon-primary"
                : "border-os-border/30 text-os-text/30 hover:border-os-border/60 hover:text-os-text/60"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
