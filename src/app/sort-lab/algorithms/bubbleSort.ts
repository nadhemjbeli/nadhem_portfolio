import type { SortResult, SortStep } from "./types";

export function bubbleSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sorted],
        description: `Comparing INDEX [${j}] (VALUE: ${a[j]}) and INDEX [${j + 1}] (VALUE: ${a[j + 1]})`,
      });

      if (a[j] > a[j + 1]) {
        swaps++;
        steps.push({
          array: [...a],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Swapping INDEX [${j}] (${a[j]}) and INDEX [${j + 1}] (${a[j + 1]}) — larger element bubbles up`,
        });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          array: [...a],
          comparing: [j, j + 1],
          swapping: null,
          sorted: [...sorted],
          description: `Swap complete — INDEX [${j}] = ${a[j]}, INDEX [${j + 1}] = ${a[j + 1]}`,
        });
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);

  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: a.map((_, i) => i),
    description: `BUBBLE_SORT complete — array fully sorted in ${comparisons} comparisons, ${swaps} swaps`,
  });

  return {
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  };
}
