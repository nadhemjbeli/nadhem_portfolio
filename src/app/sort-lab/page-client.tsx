"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { ALGORITHMS } from "./algorithms";
import type { AlgorithmId, Mode, SortStep } from "./algorithms/types";
import { useAnimator } from "./hooks/useAnimator";
import { useChallenge } from "./hooks/useChallenge";

import AlgorithmSelector from "./components/AlgorithmSelector";
import BarChart from "./components/BarChart";
import Controls from "./components/Controls";
import StatsPanel from "./components/StatsPanel";
import TerminalLog from "./components/TerminalLog";
import ChallengeQuestion from "./components/ChallengeQuestion";
import ScorePanel from "./components/ScorePanel";

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

export default function SortLabClient() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>("bubble");
  const [mode, setMode] = useState<Mode>("watch");
  const [arraySize, setArraySize] = useState(16);
  const [speed, setSpeed] = useState(1);
  const [sourceArray, setSourceArray] = useState(() => generateArray(16));

  const challenge = useChallenge();

  const result = useMemo(() => {
    const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
    return algo.run(sourceArray);
  }, [sourceArray, selectedAlgo]);

  const [liveComparisons, setLiveComparisons] = useState(0);
  const [liveSwaps, setLiveSwaps] = useState(0);

  const handleStepChange = useCallback(
    (_step: SortStep) => {
      if (_step.swapping) setLiveSwaps((s) => Math.min(s + 1, result.totalSwaps));
      setLiveComparisons((c) => Math.min(c + 1, result.totalComparisons));
    },
    [result]
  );

  const handlePauseForChallenge = useCallback(
    (idx: number) => {
      if (mode !== "challenge") return false;
      const step = result.steps[idx];
      if (!step) return false;
      return challenge.shouldPauseAt(idx, step.swapping);
    },
    [mode, result.steps, challenge]
  );

  const animator = useAnimator({
    steps: result.steps,
    onStepChange: handleStepChange,
    onPauseForChallenge: handlePauseForChallenge,
  });

  const handleBarClick = useCallback(
    (barIndex: number) => {
      if (!challenge.waitingForInput) return;
      challenge.selectBar(barIndex, animator.resume);
    },
    [challenge, animator]
  );

  function handleAlgoChange(id: AlgorithmId) {
    animator.reset();
    setSelectedAlgo(id);
    setLiveComparisons(0);
    setLiveSwaps(0);
  }

  function handleArraySizeChange(size: number) {
    animator.reset();
    setArraySize(size);
    setSourceArray(generateArray(size));
    setLiveComparisons(0);
    setLiveSwaps(0);
  }

  function handleReset() {
    animator.reset();
    setSourceArray(generateArray(arraySize));
    setLiveComparisons(0);
    setLiveSwaps(0);
    if (mode === "challenge") challenge.resetChallenge();
  }

  function handleModeChange(m: Mode) {
    animator.reset();
    setMode(m);
    setSourceArray(generateArray(arraySize));
    setLiveComparisons(0);
    setLiveSwaps(0);
    if (m === "challenge") challenge.resetChallenge();
  }

  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
  const currentStep = animator.currentStep;
  const isDone = animator.playbackState === "done";

  return (
    <div className="min-h-screen bg-os-bg font-mono selection:bg-neon-primary selection:text-black">
      {/* ── Minimal Nav ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-os-border/20 bg-os-bg/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-1">
              <span className="text-xl font-black tracking-tighter uppercase group-hover:text-neon-primary transition-colors">NJ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
            </Link>
            <div className="w-px h-4 bg-os-border/30" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-neon-primary animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon-primary/70">
                OPERATION: SORT_SEQUENCE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] font-black tracking-[0.2em] uppercase text-os-text/40 hover:text-os-text transition-colors">
              &lt; HOME
            </Link>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-neon-primary border-b border-neon-primary pb-0.5">
              SORT_LAB
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="pt-20 pb-16 max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 mb-12 space-y-3"
        >
          <div className="text-[9px] font-black tracking-[0.5em] uppercase text-os-text/30">
            CLASSIFIED // ALGORITHM_LAB // NADHEM-OS-X9
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
            SORT<span style={{ color: "var(--color-neon-primary)" }}>_LAB</span>
          </h1>
          <p className="text-os-text/40 text-sm tracking-widest uppercase">
            Select an algorithm. Initialize the array. Execute the sort.
          </p>
        </motion.div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-4 mb-8">
          {(["watch", "challenge"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded border transition-all ${
                mode === m
                  ? "bg-neon-primary text-black border-neon-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                  : "text-os-text/50 border-os-border/40 hover:border-neon-primary/40 hover:text-os-text"
              }`}
            >
              &gt; {m === "watch" ? "WATCH_MODE" : "CHALLENGE_MODE"}
            </button>
          ))}
          <div className="flex-1" />
          <div className="text-[8px] font-black tracking-[0.3em] uppercase text-os-text/20 hidden md:block">
            {mode === "watch" ? "OBSERVE THE ALGORITHM" : "PROVE YOU UNDERSTAND IT"}
          </div>
        </div>

        {/* Main Stack */}
        <div className="space-y-5">
          {/* Algorithm Selector */}
          <div className="space-y-2">
            <span className="text-[8px] font-black tracking-[0.4em] uppercase text-os-text/30">SELECT_ALGORITHM</span>
            <AlgorithmSelector
              algorithms={ALGORITHMS}
              selected={selectedAlgo}
              onSelect={handleAlgoChange}
              disabled={animator.playbackState === "playing"}
            />
          </div>

          {/* Controls */}
          <div className="glass-panel border border-os-border/20 rounded-xl p-5">
            <Controls
              playbackState={animator.playbackState}
              onPlay={animator.play}
              onPause={animator.pause}
              onResume={animator.resume}
              onReset={handleReset}
              arraySize={arraySize}
              onArraySizeChange={handleArraySizeChange}
              speed={speed}
              onSpeedChange={(s) => { setSpeed(s); animator.setSpeed(s); }}
            />
          </div>

          {/* Challenge Score Panel */}
          {mode === "challenge" && (
            <ScorePanel
              score={challenge.score}
              streak={challenge.streak}
              accuracy={challenge.accuracy}
              level={challenge.level}
              levelLabel={challenge.levelLabel}
              onLevelChange={challenge.setLevel}
            />
          )}

          {/* Bar Visualization */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-black tracking-[0.4em] uppercase text-os-text/30">ARRAY_VISUALIZATION</span>
              {isDone && (
                <span className="text-[8px] font-black tracking-[0.3em] uppercase text-neon-primary animate-pulse">
                  ✓ SEQUENCE_SORTED
                </span>
              )}
            </div>
            <BarChart
              step={currentStep}
              mode={mode}
              waitingForInput={challenge.waitingForInput}
              selectedBars={challenge.selectedBars}
              onBarClick={handleBarClick}
            />
          </div>

          {/* Challenge Question */}
          {mode === "challenge" && (
            <ChallengeQuestion
              waitingForInput={challenge.waitingForInput}
              feedback={challenge.lastFeedback}
              expectedSwap={challenge.expectedSwap}
              selectedCount={challenge.selectedBars.length}
            />
          )}

          {/* Terminal Log */}
          <TerminalLog
            description={currentStep?.description ?? "Awaiting initialization..."}
            algorithmLabel={algo.label}
          />

          {/* Stats */}
          <StatsPanel
            comparisons={liveComparisons}
            swaps={liveSwaps}
            timeComplexity={algo.timeComplexity}
            spaceComplexity={algo.spaceComplexity}
            currentStep={animator.currentStepIndex}
            totalSteps={animator.totalSteps}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-5 pt-2">
            {[
              { label: "COMPARING", color: "#FFD700" },
              { label: "SWAPPING", color: "#FF4444" },
              { label: "SORTED", color: "#AAFF00" },
              { label: "DEFAULT", color: "#1a5c1a" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm border"
                  style={{ background: item.color + "33", borderColor: item.color }}
                />
                <span className="text-[8px] font-black tracking-[0.2em] uppercase text-os-text/30">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="border-t border-os-border/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[8px] font-black tracking-[0.3em] uppercase text-os-text/20">
          <span>SECURE_ENVIRONMENT // ALGORITHM_DIAGNOSTICS</span>
          <span>NJ. PORTFOLIO // SORT_LAB v1.0</span>
        </div>
      </div>
    </div>
  );
}
