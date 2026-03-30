import type { GridCell, TraversalResult, TraversalStep } from "./types";
import { getNeighbors, key, reconstructPath } from "./gridUtils";

// Minimal priority queue (min-heap) for Dijkstra
class MinHeap {
  private data: { node: [number, number]; cost: number }[] = [];

  push(node: [number, number], cost: number) {
    this.data.push({ node, cost });
    this.data.sort((a, b) => a.cost - b.cost);
  }

  pop(): { node: [number, number]; cost: number } | undefined {
    return this.data.shift();
  }

  get size() { return this.data.length; }

  peek(): { node: [number, number]; cost: number } | undefined {
    return this.data[0];
  }

  all() { return [...this.data]; }
}

export function dijkstra(
  grid: GridCell[][],
  start: [number, number],
  end: [number, number]
): TraversalResult {
  const steps: TraversalStep[] = [];
  const visited = new Set<string>();
  const cameFrom = new Map<string, [number, number]>();
  const costMap = new Map<string, number>();
  const pq = new MinHeap();
  let pathFound = false;
  let finalPath: [number, number][] | null = null;

  costMap.set(key(start[0], start[1]), 0);
  pq.push(start, 0);

  steps.push({
    grid,
    currentNode: null,
    visited: new Set(visited),
    frontier: pq.all().map((e) => e.node),
    path: null,
    description: `Dijkstra initialized — ORIGIN [${start[0]},${start[1]}] added to PRIORITY_QUEUE with cost 0`,
    queueSize: pq.size,
    nodesVisited: 0,
  });

  while (pq.size > 0) {
    const entry = pq.pop()!;
    const [cr, cc] = entry.node;
    const currentCost = entry.cost;
    const k = key(cr, cc);

    if (visited.has(k)) continue;
    visited.add(k);

    if (cr === end[0] && cc === end[1]) {
      finalPath = reconstructPath(cameFrom, start, end);
      pathFound = true;
      steps.push({
        grid,
        currentNode: entry.node,
        visited: new Set(visited),
        frontier: pq.all().map((e) => e.node),
        path: finalPath,
        description: `SIGNAL_ROUTED — TARGET [${end[0]},${end[1]}] reached — TOTAL_COST: ${currentCost} — PATH_LENGTH: ${finalPath.length}`,
        queueSize: pq.size,
        nodesVisited: visited.size,
      });
      break;
    }

    const neighbors = getNeighbors(grid, cr, cc);
    const updatedNeighbors: string[] = [];

    for (const [nr, nc] of neighbors) {
      const nk = key(nr, nc);
      if (visited.has(nk)) continue;
      const newCost = currentCost + grid[nr][nc].cost;
      const existingCost = costMap.get(nk) ?? Infinity;
      if (newCost < existingCost) {
        costMap.set(nk, newCost);
        cameFrom.set(nk, entry.node);
        pq.push([nr, nc], newCost);
        updatedNeighbors.push(`[${nr},${nc}](cost:${newCost})`);
      }
    }

    steps.push({
      grid,
      currentNode: entry.node,
      visited: new Set(visited),
      frontier: pq.all().map((e) => e.node),
      path: null,
      description: updatedNeighbors.length > 0
        ? `Processing NODE [${cr},${cc}] cost:${currentCost} — Relaxing edges: ${updatedNeighbors.join(" ")}`
        : `Processing NODE [${cr},${cc}] cost:${currentCost} — No cheaper paths found`,
      queueSize: pq.size,
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
      description: `SIGNAL_LOST — Dijkstra exhausted — NO ROUTE TO TARGET [${end[0]},${end[1]}]`,
      queueSize: 0,
      nodesVisited: visited.size,
    });
  }

  return {
    steps,
    totalNodesVisited: visited.size,
    pathLength: finalPath?.length ?? null,
    pathFound,
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
  };
}
