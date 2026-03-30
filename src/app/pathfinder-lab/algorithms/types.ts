// ============================================================
// PATHFINDER_LAB — Core Types
// ============================================================

export type AlgorithmId = "bfs" | "dfs" | "dijkstra";
export type Mode = "watch" | "challenge";
export type DifficultyLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3";

export type CellState =
  | "default"
  | "wall"
  | "start"
  | "end"
  | "visited"
  | "frontier"
  | "path"
  | "processing";

export type GridCell = {
  row: number;
  col: number;
  isWall: boolean;
  cost: number; // 1-9, used by Dijkstra
  state: CellState;
};

export type TraversalStep = {
  grid: GridCell[][];
  currentNode: [number, number] | null;
  visited: Set<string>;
  frontier: [number, number][];
  path: [number, number][] | null;
  description: string;
  queueSize: number;
  nodesVisited: number;
};

export type TraversalResult = {
  steps: TraversalStep[];
  totalNodesVisited: number;
  pathLength: number | null;
  pathFound: boolean;
  timeComplexity: string;
  spaceComplexity: string;
};

export type AlgorithmMeta = {
  id: AlgorithmId;
  label: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  challengeQuestion: string;
  run: (grid: GridCell[][], start: [number, number], end: [number, number]) => TraversalResult;
};

export type ChallengeState = {
  score: number;
  streak: number;
  totalAnswered: number;
  correct: number;
  level: DifficultyLevel;
  lastFeedback: "correct" | "incorrect" | null;
  expectedNode: [number, number] | null;
  waitingForInput: boolean;
};
