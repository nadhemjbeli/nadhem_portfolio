import type { GridCell, TraversalResult, TraversalStep } from "./types";
import { getNeighbors, key, reconstructPath } from "./gridUtils";

export function dfs(
  grid: GridCell[][],
  start: [number, number],
  end: [number, number]
): TraversalResult {
  const steps: TraversalStep[] = [];
  const visited = new Set<string>();
  const cameFrom = new Map<string, [number, number]>();
  // Use array as a stack (LIFO — last in, first out)
  const stack: [number, number][] = [start];
  visited.add(key(start[0], start[1]));
  let pathFound = false;
  let finalPath: [number, number][] | null = null;

  steps.push({
    grid,
    currentNode: null,
    visited: new Set(visited),
    frontier: [...stack],
    path: null,
    description: `DFS initialized — ORIGIN [${start[0]},${start[1]}] pushed to STACK`,
    queueSize: stack.length,
    nodesVisited: 0,
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    const [cr, cc] = current;

    if (cr === end[0] && cc === end[1]) {
      finalPath = reconstructPath(cameFrom, start, end);
      pathFound = true;
      steps.push({
        grid,
        currentNode: current,
        visited: new Set(visited),
        frontier: [...stack],
        path: finalPath,
        description: `SIGNAL_ROUTED — TARGET [${end[0]},${end[1]}] reached via deep traversal — PATH_LENGTH: ${finalPath.length} nodes`,
        queueSize: stack.length,
        nodesVisited: visited.size,
      });
      break;
    }

    const neighbors = getNeighbors(grid, cr, cc);
    const newNeighbors: [number, number][] = [];

    for (const [nr, nc] of neighbors) {
      const k = key(nr, nc);
      if (!visited.has(k)) {
        visited.add(k);
        cameFrom.set(k, current);
        stack.push([nr, nc]);
        newNeighbors.push([nr, nc]);
      }
    }

    const depth = stack.length;
    steps.push({
      grid,
      currentNode: current,
      visited: new Set(visited),
      frontier: [...stack],
      path: null,
      description: newNeighbors.length > 0
        ? `DFS visiting NODE [${cr},${cc}] — STACK_DEPTH: ${depth} — Pushing: ${newNeighbors.map(([r, c]) => `[${r},${c}]`).join(" ")}`
        : `DFS backtracking from NODE [${cr},${cc}] — Dead end — STACK_DEPTH: ${depth}`,
      queueSize: stack.length,
      nodesVisited: visited.size,
    });
  }

  if (!pathFound) {
    steps.push({
      grid,
      currentNode: null,
      visited: new Set(visited),
      frontier: [],
      path: null,
      description: `SIGNAL_LOST — DFS exhausted — NO ROUTE TO TARGET [${end[0]},${end[1]}]`,
      queueSize: 0,
      nodesVisited: visited.size,
    });
  }

  return {
    steps,
    totalNodesVisited: visited.size,
    pathLength: finalPath?.length ?? null,
    pathFound,
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
  };
}
