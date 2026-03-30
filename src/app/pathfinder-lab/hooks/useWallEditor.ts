"use client";

import { useCallback, useRef, useState } from "react";
import type { GridCell } from "../algorithms/types";

export function useWallEditor(
  initialGrid: GridCell[][],
  start: [number, number],
  end: [number, number]
) {
  const [grid, setGrid] = useState<GridCell[][]>(initialGrid);
  const isDragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add"); // add walls or remove them

  const toggleWall = useCallback(
    (row: number, col: number) => {
      if (
        (row === start[0] && col === start[1]) ||
        (row === end[0] && col === end[1])
      )
        return;

      setGrid((prev) =>
        prev.map((r, ri) =>
          r.map((cell, ci) => {
            if (ri === row && ci === col) {
              return { ...cell, isWall: !cell.isWall };
            }
            return cell;
          })
        )
      );
    },
    [start, end]
  );

  const setWall = useCallback(
    (row: number, col: number, isWall: boolean) => {
      if (
        (row === start[0] && col === start[1]) ||
        (row === end[0] && col === end[1])
      )
        return;

      setGrid((prev) =>
        prev.map((r, ri) =>
          r.map((cell, ci) => {
            if (ri === row && ci === col) {
              return { ...cell, isWall };
            }
            return cell;
          })
        )
      );
    },
    [start, end]
  );

  const onCellMouseDown = useCallback(
    (row: number, col: number) => {
      isDragging.current = true;
      const isWall = grid[row][col].isWall;
      dragMode.current = isWall ? "remove" : "add";
      toggleWall(row, col);
    },
    [grid, toggleWall]
  );

  const onCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isDragging.current) return;
      setWall(row, col, dragMode.current === "add");
    },
    [setWall]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const replaceGrid = useCallback((newGrid: GridCell[][]) => {
    setGrid(newGrid);
  }, []);

  const clearWalls = useCallback(() => {
    setGrid((prev) =>
      prev.map((row) => row.map((cell) => ({ ...cell, isWall: false })))
    );
  }, []);

  return {
    grid,
    onCellMouseDown,
    onCellMouseEnter,
    onMouseUp,
    replaceGrid,
    clearWalls,
  };
}
