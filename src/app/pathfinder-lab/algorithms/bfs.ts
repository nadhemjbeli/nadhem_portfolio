import type { GridCell, TraversalResult, TraversalStep } from "./types";
import { getNeighbors, key, reconstructPath } from "./gridUtils";

export function bfs(
  grid: GridCell[][],
  start: [number, number],
  end: [number, number]
): TraversalResult {
  const steps: TraversalStep[] = [];
  const visited = new Set<string>();
  const cameFrom = new Map<string, [number, number]>();
  const queue: [number, number][] = [start];
  visited.add(key(start[0], start[1]));
  let pathFound = false;
  let finalPath: [number, number][] | null = null;

  steps.push({
    grid,
    currentNode: null,
    visited: new Set(visited),
    frontier: [...queue],
    path: null,
    description: `BFS initialized — ORIGIN [${start[0]},${start[1]}] added to QUEUE`,
    queueSize: queue.length,
    nodesVisited: 0,
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const [cr, cc] = current;

    if (cr === end[0] && cc === end[1]) {
      finalPath = reconstructPath(cameFrom, start, end);
      pathFound = true;
      steps.push({
        grid,
        currentNode: current,
        visited: new Set(visited),
        frontier: [...queue],
        path: finalPath,
        description: `SIGNAL_ROUTED — TARGET [${end[0]},${end[1]}] reached — PATH_LENGTH: ${finalPath.length} nodes`,
        queueSize: queue.length,
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
        queue.push([nr, nc]);
        newNeighbors.push([nr, nc]);
      }
    }

    steps.push({
      grid,
      currentNode: current,
      visited: new Set(visited),
      frontier: [...queue],
      path: null,
      description: newNeighbors.length > 0
        ? `Processing NODE [${cr},${cc}] — Adding neighbours to QUEUE: ${newNeighbors.map(([r, c]) => `[${r},${c}]`).join(" ")}`
        : `Processing NODE [${cr},${cc}] — All neighbours already visited or blocked`,
      queueSize: queue.length,
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
      description: `SIGNAL_LOST — NO ROUTE TO TARGET [${end[0]},${end[1]}] — grid is disconnected`,
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
