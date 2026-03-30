"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TraversalStep } from "../algorithms/types";

export type PlaybackState = "idle" | "playing" | "paused" | "done";

interface UseGridAnimatorOptions {
  steps: TraversalStep[];
  onPauseForChallenge?: (stepIndex: number, step: TraversalStep) => boolean;
}

export function useGridAnimator({ steps, onPauseForChallenge }: UseGridAnimatorOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const speedRef = useRef(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  const currentStep = steps[currentStepIndex] ?? steps[0];

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const advance = useCallback(
    (idx: number) => {
      if (idx >= steps.length) {
        setPlaybackState("done");
        return;
      }

      setCurrentStepIndex(idx);

      if (onPauseForChallenge?.(idx, steps[idx])) {
        isPausedRef.current = true;
        setPlaybackState("paused");
        return;
      }

      if (!isPausedRef.current) {
        // Grid animation is slower — cells need time to render
        const delay = 120 / speedRef.current;
        timeoutRef.current = setTimeout(() => advance(idx + 1), delay);
      }
    },
    [steps, onPauseForChallenge]
  );

  const play = useCallback(() => {
    if (playbackState === "done") return;
    isPausedRef.current = false;
    setPlaybackState("playing");
    advance(currentStepIndex);
  }, [playbackState, currentStepIndex, advance]);

  const pause = useCallback(() => {
    clearTimer();
    isPausedRef.current = true;
    setPlaybackState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (playbackState !== "paused") return;
    isPausedRef.current = false;
    setPlaybackState("playing");
    advance(currentStepIndex + 1);
  }, [playbackState, currentStepIndex, advance]);

  const reset = useCallback(() => {
    clearTimer();
    isPausedRef.current = false;
    setCurrentStepIndex(0);
    setPlaybackState("idle");
  }, [clearTimer]);

  const setSpeed = useCallback((s: number) => { speedRef.current = s; }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    playbackState,
    play,
    pause,
    resume,
    reset,
    setSpeed,
  };
}
