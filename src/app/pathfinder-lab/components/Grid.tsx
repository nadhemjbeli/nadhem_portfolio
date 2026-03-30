"use client";

import type { GridCell, TraversalStep, Mode } from "../algorithms/types";
import { applyStateToGrid } from "../algorithms/gridUtils";

interface GridProps {
  baseGrid: GridCell[][];
  step: TraversalStep;
  start: [number, number];
  end: [number, number];
  mode: Mode;
  waitingForInput: boolean;
  expectedNode: [number, number] | null;
  isRunning: boolean;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellClick?: (row: number, col: number) => void;
}

const STATE_STYLES: Record<string, { bg: string; border: string; glow?: string }> = {
  default:    { bg: "#111111", border: "#1e1e1e" },
  wall:       { bg: "#2a2a2a", border: "#2a2a2a" },
  start:      { bg: "#1a3300", border: "#AAFF00", glow: "0 0 8px rgba(170,255,0,0.6)" },
  end:        { bg: "#001a3a", border: "#00FFFF", glow: "0 0 8px rgba(0,255,255,0.6)" },
  visited:    { bg: "#0d2a0d", border: "#1a5c1a" },
  frontier:   { bg: "#1a1000", border: "#FFD700", glow: "0 0 4px rgba(255,215,0,0.3)" },
  path:       { bg: "#0d2a0d", border: "#AAFF00", glow: "0 0 6px rgba(170,255,0,0.4)" },
  processing: { bg: "#1a0000", border: "#FF4444", glow: "0 0 8px rgba(255,68,68,0.5)" },
};

export default function Grid({
  baseGrid,
  step,
  start,
  end,
  mode,
  waitingForInput,
  expectedNode,
  isRunning,
  onCellMouseDown,
  onCellMouseEnter,
  onCellClick,
}: GridProps) {
  const renderedGrid = applyStateToGrid(baseGrid, step, start, end);
  const rows = renderedGrid.length;
  const cols = renderedGrid[0].length;
  // Compute cell size to fit within a max width
  const cellSize = Math.max(14, Math.min(32, Math.floor(700 / cols)));

  return (
    <div
      className="glass-panel border border-os-border/20 rounded-xl p-3 overflow-auto select-none"
      onMouseLeave={() => {}}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: "1px",
          width: "fit-content",
        }}
      >
        {renderedGrid.map((row, ri) =>
          row.map((cell, ci) => {
            const style = STATE_STYLES[cell.state] ?? STATE_STYLES.default;
            const isExpected =
              mode === "challenge" &&
              waitingForInput &&
              expectedNode &&
              ri === expectedNode[0] &&
              ci === expectedNode[1];

            const canInteract = !isRunning || (mode === "challenge" && waitingForInput);
            const isFrontier = cell.state === "frontier";

            return (
              <div
                key={`${ri}-${ci}`}
                onMouseDown={() => !isRunning && onCellMouseDown(ri, ci)}
                onMouseEnter={() => !isRunning && onCellMouseEnter(ri, ci)}
                onClick={() => mode === "challenge" && waitingForInput && onCellClick?.(ri, ci)}
                title={`[${ri},${ci}]${cell.state !== "default" ? ` — ${cell.state.toUpperCase()}` : ""}${cell.cost > 1 ? ` cost:${cell.cost}` : ""}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: isExpected ? "#1a0d00" : style.bg,
                  border: `1px solid ${isExpected ? "#FF8800" : style.border}`,
                  boxShadow: isExpected
                    ? "0 0 8px rgba(255,136,0,0.5)"
                    : style.glow ?? "none",
                  cursor: canInteract ? "pointer" : "default",
                  transition: "background 0.08s, border-color 0.08s, box-shadow 0.08s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // Dijkstra cost hint — tiny number
                  fontSize: cell.state === "default" && cell.cost > 1 ? 6 : 0,
                  color: "rgba(255,215,0,0.3)",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                {cell.state === "default" && cell.cost > 1 ? cell.cost : ""}
              </div>
            );
          })
        )}
      </div>

      {/* Legend row */}
      <div className="mt-3 flex flex-wrap gap-3">
        {[
          { label: "ORIGIN", color: "#AAFF00" },
          { label: "TARGET", color: "#00FFFF" },
          { label: "PROCESSING", color: "#FF4444" },
          { label: "FRONTIER", color: "#FFD700" },
          { label: "VISITED", color: "#1a5c1a" },
          { label: "SIGNAL_PATH", color: "#AAFF00" },
          { label: "BLOCKED", color: "#2a2a2a" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-sm border"
              style={{ background: item.color + "22", borderColor: item.color }}
            />
            <span className="text-[7px] font-black tracking-widest uppercase text-os-text/25">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
