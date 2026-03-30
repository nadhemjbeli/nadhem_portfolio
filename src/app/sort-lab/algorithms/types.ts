// ============================================================
// SORT_LAB — Core Types
// All sorting algorithms produce SortResult with step arrays.
// ============================================================

export type BarState = "default" | "comparing" | "swapping" | "sorted";

export type SortStep = {
  array: number[];
  comparing: [number, number];
  swapping: [number, number] | null;
  sorted: number[];
  description: string;
};

export type SortResult = {
  steps: SortStep[];
  totalComparisons: number;
  totalSwaps: number;
  timeComplexity: string;
  spaceComplexity: string;
};

export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export type AlgorithmMeta = {
  id: AlgorithmId;
  label: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  run: (arr: number[]) => SortResult;
};

export type Mode = "watch" | "challenge";

export type DifficultyLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3";

export type ChallengeState = {
  score: number;
  streak: number;
  totalAnswered: number;
  correct: number;
  level: DifficultyLevel;
  lastFeedback: "correct" | "incorrect" | null;
  expectedSwap: [number, number] | null;
  waitingForInput: boolean;
  selectedBars: number[];
};
