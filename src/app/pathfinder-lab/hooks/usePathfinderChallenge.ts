"use client";

import { useCallback, useState } from "react";
import type { ChallengeState, DifficultyLevel, TraversalStep } from "../algorithms/types";

const CHALLENGE_INTERVAL = 10;

export function usePathfinderChallenge() {
  const [state, setState] = useState<ChallengeState>({
    score: 0,
    streak: 0,
    totalAnswered: 0,
    correct: 0,
    level: "LEVEL_1",
    lastFeedback: null,
    expectedNode: null,
    waitingForInput: false,
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

  const shouldPauseAt = useCallback(
    (idx: number, step: TraversalStep): boolean => {
      // Pause at regular intervals when there's a clear next frontier node
      if (idx > 0 && idx % CHALLENGE_INTERVAL === 0 && step.frontier.length > 0 && step.currentNode) {
        // The expected answer is the first item in the frontier (what will be processed next)
        const expected = step.frontier[0];
        setState((s) => ({
          ...s,
          waitingForInput: true,
          expectedNode: expected,
          lastFeedback: null,
        }));
        return true;
      }
      return false;
    },
    []
  );

  const answerNode = useCallback(
    (row: number, col: number, onComplete: () => void) => {
      setState((s) => {
        if (!s.waitingForInput || !s.expectedNode) return s;
        const [er, ec] = s.expectedNode;
        const isCorrect = row === er && col === ec;

        setTimeout(onComplete, 1600);
        return {
          ...s,
          totalAnswered: s.totalAnswered + 1,
          correct: isCorrect ? s.correct + 1 : s.correct,
          score: isCorrect ? s.score + 1 : s.score,
          streak: isCorrect ? s.streak + 1 : 0,
          lastFeedback: isCorrect ? "correct" : "incorrect",
          waitingForInput: false,
          expectedNode: null,
        };
      });
    },
    []
  );

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
      expectedNode: null,
      waitingForInput: false,
    });
  }, []);

  return {
    ...state,
    accuracy,
    levelLabel: getLevelLabel(state.level),
    shouldPauseAt,
    answerNode,
    setLevel,
    resetChallenge,
  };
}
