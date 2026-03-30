"use client";

import type { SortStep } from "../algorithms/types";

interface BarChartProps {
  step: SortStep;
  mode: "watch" | "challenge";
  waitingForInput?: boolean;
  selectedBars?: number[];
  onBarClick?: (index: number) => void;
}

const MAX_BAR_HEIGHT = 260; // px

function getBarColor(
  index: number,
  step: SortStep,
  mode: "watch" | "challenge",
  waitingForInput: boolean,
  selectedBars: number[]
): { bg: string; border: string; glow: string } {
  const { comparing, swapping, sorted } = step;

  if (mode === "challenge" && waitingForInput) {
    if (selectedBars.includes(index)) {
      return { bg: "#1a1000", border: "#FFD700", glow: "0 0 10px rgba(255,215,0,0.6)" };
    }
    if (comparing[0] === index || comparing[1] === index) {
      return { bg: "#1a1000", border: "#FFD700", glow: "0 0 8px rgba(255,215,0,0.4)" };
    }
  }

  if (swapping && (swapping[0] === index || swapping[1] === index)) {
    return { bg: "#1a0000", border: "#FF4444", glow: "0 0 10px rgba(255,68,68,0.5)" };
  }
  if (comparing[0] === index || comparing[1] === index) {
    return { bg: "#1a1000", border: "#FFD700", glow: "0 0 8px rgba(255,215,0,0.4)" };
  }
  if (sorted.includes(index)) {
    return { bg: "#0d2a0d", border: "#AAFF00", glow: "0 0 8px rgba(170,255,0,0.3)" };
  }
  return { bg: "#0a1a0a", border: "#1a5c1a", glow: "none" };
}

export default function BarChart({
  step,
  mode,
  waitingForInput = false,
  selectedBars = [],
  onBarClick,
}: BarChartProps) {
  const maxVal = Math.max(...step.array);
  const n = step.array.length;
  const barWidth = Math.max(16, Math.min(40, Math.floor(800 / n) - 4));

  return (
    <div className="w-full glass-panel border border-os-border/20 rounded-xl p-4 overflow-x-auto">
      <div
        className="flex items-end gap-1 min-h-[280px] w-full"
        style={{ minWidth: n * (barWidth + 4) }}
      >
        {step.array.map((val, i) => {
          const height = Math.max(8, Math.floor((val / maxVal) * MAX_BAR_HEIGHT));
          const colors = getBarColor(i, step, mode, waitingForInput, selectedBars);
          const isClickable = mode === "challenge" && waitingForInput && onBarClick;
          const isSelected = selectedBars.includes(i);

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
              style={{ width: barWidth }}
            >
              <div
                onClick={() => isClickable && onBarClick(i)}
                title={`INDEX [${i}] — VALUE: ${val}`}
                style={{
                  height,
                  width: "100%",
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.glow,
                  transition: "height 0.18s ease, background 0.12s, border-color 0.12s, box-shadow 0.12s",
                  cursor: isClickable ? "pointer" : "default",
                  transform: isSelected ? "scaleY(1.05)" : "scaleY(1)",
                  transformOrigin: "bottom",
                }}
              />
              <span
                className="text-[8px] font-black tracking-tight"
                style={{ color: step.sorted.includes(i) ? "#AAFF00" : "rgba(224,224,224,0.3)" }}
              >
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
