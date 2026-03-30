import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import type { AlgorithmMeta } from "./types";

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: "bfs",
    label: "BFS",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    description: "Breadth-First Search — explores level by level. Guaranteed shortest path on unweighted grids.",
    challengeQuestion: "> WHICH NODE DOES BFS_QUEUE PROCESS NEXT?",
    run: bfs,
  },
  {
    id: "dfs",
    label: "DFS",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
    description: "Depth-First Search — goes deep before backtracking. Does not guarantee shortest path.",
    challengeQuestion: "> WHICH NODE DOES DFS_STACK VISIT NEXT?",
    run: dfs,
  },
  {
    id: "dijkstra",
    label: "DIJKSTRA",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
    description: "Dijkstra's Algorithm — weighted traversal. Processes lowest-cost node first. Guaranteed optimal path.",
    challengeQuestion: "> WHICH NODE HAS THE LOWEST COST AND IS PROCESSED NEXT?",
    run: dijkstra,
  },
];

export { bfs, dfs, dijkstra };
export { createGrid, randomizeWalls, applyStateToGrid } from "./gridUtils";
export type {
  GridCell,
  TraversalStep,
  TraversalResult,
  AlgorithmId,
  AlgorithmMeta,
  CellState,
  Mode,
  DifficultyLevel,
  ChallengeState,
} from "./types";
