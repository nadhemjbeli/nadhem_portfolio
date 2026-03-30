"use client";

import type { PlaybackState } from "../hooks/useAnimator";

interface ControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const SPEED_OPTIONS = [0.5, 1, 2, 3, 5];

export default function Controls({
  playbackState,
  onPlay,
  onPause,
  onResume,
  onReset,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  disabled,
}: ControlsProps) {
  const isRunning = playbackState === "playing";
  const isPaused = playbackState === "paused";
  const isDone = playbackState === "done";
  const isIdle = playbackState === "idle";

  return (
    <div className="flex flex-col gap-5">
      {/* Playback Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {(isIdle || isDone) && (
          <button
            onClick={onPlay}
            disabled={disabled}
            className="flex items-center gap-2 px-5 py-2.5 bg-neon-primary text-black font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <span>&gt; RUN</span>
          </button>
        )}
        {isRunning && (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-neon-primary font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary/60 hover:border-neon-primary hover:bg-neon-primary/10 transition-all active:scale-95"
          >
            <span>&gt; PAUSE</span>
          </button>
        )}
        {isPaused && (
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-5 py-2.5 bg-neon-primary/20 text-neon-primary font-black text-[11px] uppercase tracking-[0.2em] rounded border border-neon-primary/60 hover:bg-neon-primary/30 transition-all active:scale-95"
          >
            <span>&gt; RESUME</span>
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-os-text/40 font-black text-[11px] uppercase tracking-[0.2em] rounded border border-os-border/40 hover:text-os-text hover:border-os-border transition-all active:scale-95"
        >
          <span>&gt; RESET</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Array Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-os-text/40">ARRAY_SIZE</span>
            <span className="text-[10px] font-black text-neon-primary">{arraySize}</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-1 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #AAFF00 0%, #AAFF00 ${((arraySize - 5) / 45) * 100}%, #1a3a1a ${((arraySize - 5) / 45) * 100}%, #1a3a1a 100%)`,
            }}
          />
          <div className="flex justify-between">
            <span className="text-[8px] text-os-text/20">5</span>
            <span className="text-[8px] text-os-text/20">50</span>
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
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
