"use client";

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
  currentStep: number;
  totalSteps: number;
}

export default function StatsPanel({
  comparisons,
  swaps,
  timeComplexity,
  spaceComplexity,
  currentStep,
  totalSteps,
}: StatsPanelProps) {
  const stats = [
    { label: "COMPARISONS", value: comparisons, color: "#FFD700" },
    { label: "SWAPS", value: swaps, color: "#FF4444" },
    { label: "TIME_COMPLEXITY", value: timeComplexity, color: "#AAFF00" },
    { label: "SPACE_COMPLEXITY", value: spaceComplexity, color: "#00FFCC" },
    { label: "STEP", value: `${currentStep} / ${totalSteps}`, color: "rgba(224,224,224,0.5)" },
  ];

  return (
    <div className="glass-panel border border-os-border/20 rounded-xl p-4">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-os-text/30">
              {stat.label}
            </span>
            <span
              className="text-lg font-black font-mono"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
