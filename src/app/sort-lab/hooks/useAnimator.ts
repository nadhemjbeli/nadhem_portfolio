"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SortStep } from "../algorithms/types";

export type PlaybackState = "idle" | "playing" | "paused" | "done";

interface UseAnimatorOptions {
  steps: SortStep[];
  onStepChange?: (step: SortStep, index: number) => void;
  onPauseForChallenge?: (stepIndex: number) => boolean; // returns true if should pause
}

export function useAnimator({ steps, onStepChange, onPauseForChallenge }: UseAnimatorOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const speedRef = useRef(1); // multiplier: 0.5x to 5x
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
      onStepChange?.(steps[idx], idx);

      // Check if challenge mode wants to pause here
      if (onPauseForChallenge?.(idx)) {
        isPausedRef.current = true;
        setPlaybackState("paused");
        return;
      }

      if (!isPausedRef.current) {
        const delay = 800 / speedRef.current;
        timeoutRef.current = setTimeout(() => advance(idx + 1), delay);
      }
    },
    [steps, onStepChange, onPauseForChallenge]
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

  const stepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  }, [currentStepIndex, steps.length]);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
  }, []);

  // Cleanup on unmount
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
    stepForward,
    setSpeed,
    isPaused: isPausedRef.current,
  };
}
