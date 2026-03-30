"use client";

import { useCallback, useState } from "react";
import type { ChallengeState, DifficultyLevel } from "../algorithms/types";

const CHALLENGE_INTERVAL = 8; // pause every N steps for a question

export function useChallenge() {
  const [state, setState] = useState<ChallengeState>({
    score: 0,
    streak: 0,
    totalAnswered: 0,
    correct: 0,
    level: "LEVEL_1",
    lastFeedback: null,
    expectedSwap: null,
    waitingForInput: false,
    selectedBars: [],
  });

  const accuracy = state.totalAnswered === 0
    ? 100
    : Math.round((state.correct / state.totalAnswered) * 100);

  const getLevelLabel = (level: DifficultyLevel) => {
    switch (level) {
      case "LEVEL_1": return "NOVICE";
      case "LEVEL_2": return "INTERMEDIATE";
      case "LEVEL_3": return "ADVANCED";
    }
  };

  /** Called by the animator to check if it should pause at this step index */
  const shouldPauseAt = useCallback(
    (stepIndex: number, swapping: [number, number] | null): boolean => {
      if (stepIndex > 0 && stepIndex % CHALLENGE_INTERVAL === 0 && swapping !== null) {
        setState((s) => ({
          ...s,
          waitingForInput: true,
          expectedSwap: swapping,
          selectedBars: [],
          lastFeedback: null,
        }));
        return true;
      }
      return false;
    },
    []
  );

  const selectBar = useCallback((barIndex: number, onComplete: () => void) => {
    setState((s) => {
      const next = [...s.selectedBars];
      if (next.includes(barIndex)) return s; // already selected
      next.push(barIndex);

      if (next.length === 2) {
        const [a, b] = next;
        const [ea, eb] = s.expectedSwap ?? [-1, -1];
        const isCorrect =
          (a === ea && b === eb) || (a === eb && b === ea);

        const newState: ChallengeState = {
          ...s,
          totalAnswered: s.totalAnswered + 1,
          correct: isCorrect ? s.correct + 1 : s.correct,
          score: isCorrect ? s.score + 1 : s.score,
          streak: isCorrect ? s.streak + 1 : 0,
          lastFeedback: isCorrect ? "correct" : "incorrect",
          waitingForInput: false,
          selectedBars: next,
        };

        // Small delay so user sees feedback, then continue
        setTimeout(onComplete, 1600);
        return newState;
      }

      return { ...s, selectedBars: next };
    });
  }, []);

  const setLevel = useCallback((level: DifficultyLevel) => {
    setState((s) => ({ ...s, level }));
  }, []);

  const resetChallenge = useCallback(() => {
    setState({
      score: 0,
      streak: 0,
      totalAnswered: 0,
      correct: 0,
      level: "LEVEL_1",
      lastFeedback: null,
      expectedSwap: null,
      waitingForInput: false,
      selectedBars: [],
    });
  }, []);

  return {
    ...state,
    accuracy,
    levelLabel: getLevelLabel(state.level),
    shouldPauseAt,
    selectBar,
    setLevel,
    resetChallenge,
  };
}
