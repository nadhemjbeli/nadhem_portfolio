import type { GridCell, TraversalStep } from "./types";

export const DIRS: [number, number][] = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
];

export function key(row: number, col: number): string {
  return `${row},${col}`;
}

export function getNeighbors(
  grid: GridCell[][],
  row: number,
  col: number
): [number, number][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const neighbors: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc].isWall) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

export function createGrid(rows: number, cols: number): GridCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      isWall: false,
      cost: Math.floor(Math.random() * 5) + 1,
      state: "default" as const,
    }))
  );
}

export function applyStateToGrid(
  baseGrid: GridCell[][],
  step: TraversalStep,
  start: [number, number],
  end: [number, number]
): GridCell[][] {
  const rows = baseGrid.length;
  const cols = baseGrid[0].length;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const cell = baseGrid[r][c];
      if (cell.isWall) return { ...cell, state: "wall" as const };
      if (r === start[0] && c === start[1]) return { ...cell, state: "start" as const };
      if (r === end[0] && c === end[1]) return { ...cell, state: "end" as const };

      if (step.path) {
        if (step.path.some(([pr, pc]) => pr === r && pc === c)) {
          return { ...cell, state: "path" as const };
        }
      }
      if (step.currentNode && step.currentNode[0] === r && step.currentNode[1] === c) {
        return { ...cell, state: "processing" as const };
      }
      if (step.frontier.some(([fr, fc]) => fr === r && fc === c)) {
        return { ...cell, state: "frontier" as const };
      }
      if (step.visited.has(key(r, c))) {
        return { ...cell, state: "visited" as const };
      }
      return { ...cell, state: "default" as const };
    })
  );
}

export function reconstructPath(
  cameFrom: Map<string, [number, number]>,
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const path: [number, number][] = [];
  let current: [number, number] = end;
  while (!(current[0] === start[0] && current[1] === start[1])) {
    path.unshift(current);
    const parent = cameFrom.get(key(current[0], current[1]));
    if (!parent) break;
    current = parent;
  }
  path.unshift(start);
  return path;
}

export function randomizeWalls(
  grid: GridCell[][],
  start: [number, number],
  end: [number, number],
  density = 0.3
): GridCell[][] {
  return grid.map((row) =>
    row.map((cell) => {
      if (
        (cell.row === start[0] && cell.col === start[1]) ||
        (cell.row === end[0] && cell.col === end[1])
      ) {
        return { ...cell, isWall: false };
      }
      return { ...cell, isWall: Math.random() < density };
    })
  );
}
