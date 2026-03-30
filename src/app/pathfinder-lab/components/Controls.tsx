"use client";

import type { PlaybackState } from "../hooks/useGridAnimator";

interface ControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onRandomizeWalls: () => void;
  onClearWalls: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 1, 2, 3, 5];

export default function Controls({
  playbackState,
  onPlay, onPause, onResume, onReset,
  onRandomizeWalls, onClearWalls,
  gridSize, onGridSizeChange,
  speed, onSpeedChange,
}: ControlsProps) {
  const isRunning = playbackState === "playing";
  const isPaused = playbackState === "paused";
  const isDone = playbackState === "done";
  const isIdle = playbackState === "idle";

  return (
    <div className="flex flex-col gap-5">
      {/* Primary Controls */}
      <div className="flex flex-wrap gap-3">
        {(isIdle || isDone) && (
          <button onClick={onPlay} className="px-5 py-2.5 bg-neon-primary text-black font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all active:scale-95">
            &gt; RUN
          </button>
        )}
        {isRunning && (
          <button onClick={onPause} className="px-5 py-2.5 bg-transparent text-neon-primary font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary/60 hover:bg-neon-primary/10 transition-all active:scale-95">
            &gt; PAUSE
          </button>
        )}
        {isPaused && (
          <button onClick={onResume} className="px-5 py-2.5 bg-neon-primary/20 text-neon-primary font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary/60 hover:bg-neon-primary/30 transition-all active:scale-95">
            &gt; RESUME
          </button>
        )}
        <button onClick={onReset} className="px-5 py-2.5 bg-transparent text-os-text/40 font-black text-[11px] uppercase tracking-[0.2em] rounded border border-os-border/40 hover:text-os-text hover:border-os-border transition-all active:scale-95">
          &gt; RESET
        </button>

        <div className="w-px h-8 bg-os-border/20 self-center hidden md:block" />

        <button
          onClick={onRandomizeWalls}
          disabled={isRunning}
          className="px-5 py-2.5 bg-transparent text-os-text/40 font-black text-[11px] uppercase tracking-[0.2em] rounded border border-os-border/40 hover:text-os-text hover:border-neon-primary/30 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &gt; RANDOMIZE_WALLS
        </button>
        <button
          onClick={onClearWalls}
          disabled={isRunning}
          className="px-5 py-2.5 bg-transparent text-os-text/40 font-black text-[11px] uppercase tracking-[0.2em] rounded border border-os-border/40 hover:text-os-text hover:border-os-border transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &gt; CLEAR_WALLS
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grid Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-os-text/40">GRID_SIZE</span>
            <span className="text-[10px] font-black text-neon-primary">{gridSize} × {gridSize}</span>
          </div>
          <input
            type="range" min={10} max={25} value={gridSize}
            onChange={(e) => onGridSizeChange(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-1 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: `linear-gradient(to right, #AAFF00 0%, #AAFF00 ${((gridSize - 10) / 15) * 100}%, #1a3a1a ${((gridSize - 10) / 15) * 100}%, #1a3a1a 100%)` }}
          />
          <div className="flex justify-between">
            <span className="text-[8px] text-os-text/20">10</span>
            <span className="text-[8px] text-os-text/20">25</span>
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-os-text/40">EXECUTION_SPEED</span>
            <span className="text-[10px] font-black text-neon-primary">{speed}x</span>
          </div>
          <div className="flex gap-2">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`flex-1 py-1.5 text-[9px] font-black tracking-wider rounded border transition-all ${
                  speed === s
                    ? "bg-neon-primary/20 border-neon-primary text-neon-primary"
                    : "border-os-border/30 text-os-text/30 hover:border-os-border/60 hover:text-os-text/60"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
