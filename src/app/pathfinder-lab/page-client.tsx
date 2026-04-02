"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { ALGORITHMS, createGrid, randomizeWalls } from "./algorithms";
import type { AlgorithmId, Mode, TraversalStep } from "./algorithms/types";

import { useGridAnimator } from "./hooks/useGridAnimator";
import { usePathfinderChallenge } from "./hooks/usePathfinderChallenge";
import { useWallEditor } from "./hooks/useWallEditor";

import AlgorithmSelector from "./components/AlgorithmSelector";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import OperationLog from "./components/OperationLog";
import StatsBar from "./components/StatsBar";
import ChallengeQuestion from "./components/ChallengeQuestion";
import ScorePanel from "./components/ScorePanel";

export default function PathfinderLabClient() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>("bfs");
  const [mode, setMode] = useState<Mode>("watch");
  const [gridSize, setGridSize] = useState(15);
  const [speed, setSpeed] = useState(1);

  const startNode: [number, number] = useMemo(() => [Math.floor(gridSize / 2), 2], [gridSize]);
  const endNode: [number, number] = useMemo(() => [Math.floor(gridSize / 2), gridSize - 3], [gridSize]);

  const wallEditor = useWallEditor(useMemo(() => createGrid(gridSize, gridSize), [gridSize]), startNode, endNode);
  const challenge = usePathfinderChallenge();

  const algoMeta = ALGORITHMS.find((a) => a.id === selectedAlgo)!;

  const result = useMemo(() => {
    return algoMeta.run(wallEditor.grid, startNode, endNode);
  }, [wallEditor.grid, algoMeta, startNode, endNode]);

  const handlePauseForChallenge = useCallback(
    (idx: number, step: TraversalStep) => {
      if (mode !== "challenge") return false;
      return challenge.shouldPauseAt(idx, step);
    },
    [mode, challenge]
  );

  const animator = useGridAnimator({
    steps: result.steps,
    onPauseForChallenge: handlePauseForChallenge,
  });

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!challenge.waitingForInput) return;
      challenge.answerNode(row, col, animator.resume);
    },
    [challenge, animator]
  );

  function handleAlgoChange(id: AlgorithmId) {
    animator.reset();
    setSelectedAlgo(id);
  }

  function handleGridSizeChange(size: number) {
    animator.reset();
    setGridSize(size);
    // recalculate new start/end internally above based on new gridSize
    wallEditor.replaceGrid(createGrid(size, size));
    if (mode === "challenge") challenge.resetChallenge();
  }

  function handleReset() {
    animator.reset();
    if (mode === "challenge") challenge.resetChallenge();
  }

  function handleModeChange(m: Mode) {
    animator.reset();
    setMode(m);
    if (m === "challenge") challenge.resetChallenge();
  }

  function handleRandomizeWalls() {
    animator.reset();
    wallEditor.replaceGrid(randomizeWalls(createGrid(gridSize, gridSize), startNode, endNode, 0.3));
  }

  function handleClearWalls() {
    animator.reset();
    wallEditor.clearWalls();
  }

  const currentStep = animator.currentStep;

  return (
    <div className="min-h-screen bg-os-bg font-mono selection:bg-neon-primary selection:text-black pb-16">
      {/* Header */}
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
                OPERATION: SIGNAL_ROUTING
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] font-black tracking-[0.2em] uppercase text-os-text/40 hover:text-os-text transition-colors">
              &lt; HOME
            </Link>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-neon-primary border-b border-neon-primary pb-0.5 hidden sm:block">
              PATHFINDER_LAB
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="pt-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT COLUMN: Controls & Grid */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="text-[9px] font-black tracking-[0.5em] uppercase text-os-text/30">
              CLASSIFIED // PATHFINDER_LAB // NADHEM-OS-X9
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-white">
              PATHFINDER<span style={{ color: "var(--color-neon-primary)" }}>_LAB</span>
            </h1>
            <p className="text-os-text/40 text-[10px] tracking-widest uppercase">
              SELECT AN ALGORITHM. DRAW YOUR WALLS. ROUTE THE SIGNAL.
            </p>
          </motion.div>

          <AlgorithmSelector
            algorithms={ALGORITHMS}
            selected={selectedAlgo}
            onSelect={handleAlgoChange}
            disabled={animator.playbackState === "playing"}
          />

          <div className="flex flex-wrap items-center gap-4">
            {(["watch", "challenge"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded border transition-all ${
                  mode === m
                    ? "bg-neon-primary text-black border-neon-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                    : "text-os-text/50 border-os-border/40 hover:border-neon-primary/40 hover:text-os-text"
                }`}
              >
                &gt; {m === "watch" ? "WATCH_MODE" : "CHALLENGE_MODE"}
              </button>
            ))}
          </div>

          <Controls
            playbackState={animator.playbackState}
            onPlay={animator.play}
            onPause={animator.pause}
            onResume={animator.resume}
            onReset={handleReset}
            onRandomizeWalls={handleRandomizeWalls}
            onClearWalls={handleClearWalls}
            gridSize={gridSize}
            onGridSizeChange={handleGridSizeChange}
            speed={speed}
            onSpeedChange={(s) => { setSpeed(s); animator.setSpeed(s); }}
          />

          <div className="space-y-2">
            <span className="text-[8px] font-black tracking-[0.4em] uppercase text-os-text/30">
              NETWORK_GRID_VISUALIZATION
            </span>
            <div className="relative">
              <Grid
                baseGrid={wallEditor.grid}
                step={currentStep}
                start={startNode}
                end={endNode}
                mode={mode}
                waitingForInput={challenge.waitingForInput}
                expectedNode={challenge.expectedNode}
                isRunning={animator.playbackState !== "idle" && animator.playbackState !== "done"}
                onCellMouseDown={wallEditor.onCellMouseDown}
                onCellMouseEnter={wallEditor.onCellMouseEnter}
                onCellClick={handleCellClick}
              />
              
              {/* Drag release handler overlay when dragging */}
              <div 
                className="absolute inset-0 pointer-events-none z-10" 
                onMouseUpCapture={wallEditor.onMouseUp} 
                onMouseLeave={wallEditor.onMouseUp}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Logs, Stats, Challenge */}
        <div className="space-y-6 lg:mt-32">
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

          {mode === "challenge" && (
            <ChallengeQuestion
              waitingForInput={challenge.waitingForInput}
              feedback={challenge.lastFeedback}
              expectedNode={challenge.expectedNode}
              questionText={algoMeta.challengeQuestion}
            />
          )}

          <OperationLog
            description={currentStep?.description ?? "Awaiting initialization..."}
            algorithmLabel={algoMeta.label}
          />

          <StatsBar
            nodesVisited={currentStep?.nodesVisited ?? 0}
            queueSize={currentStep?.queueSize ?? 0}
            pathLength={currentStep?.path?.length ?? null}
            timeComplexity={algoMeta.timeComplexity}
            spaceComplexity={algoMeta.spaceComplexity}
            currentStep={animator.currentStepIndex}
            totalSteps={animator.totalSteps}
          />
        </div>
      </main>
    </div>
  );
}
