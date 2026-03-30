import type { SortResult, SortStep } from "./types";

export function selectionSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        array: [...a],
        comparing: [minIdx, j],
        swapping: null,
        sorted: [...sorted],
        description: `Scanning — current minimum INDEX [${minIdx}] (${a[minIdx]}) vs INDEX [${j}] (${a[j]})`,
      });

      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...a],
          comparing: [minIdx, j],
          swapping: null,
          sorted: [...sorted],
          description: `New minimum found — INDEX [${minIdx}] (VALUE: ${a[minIdx]})`,
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      steps.push({
        array: [...a],
        comparing: [i, minIdx],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Placing minimum — swapping INDEX [${i}] (${a[i]}) with INDEX [${minIdx}] (${a[minIdx]})`,
      });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }

    sorted.push(i);
    steps.push({
      array: [...a],
      comparing: [-1, -1],
      swapping: null,
      sorted: [...sorted],
      description: `INDEX [${i}] locked — VALUE ${a[i]} is in final position`,
    });
  }

  sorted.push(n - 1);
  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: a.map((_, i) => i),
    description: `SELECTION_SORT complete — ${comparisons} comparisons, ${swaps} swaps`,
  });

  return {
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  };
}
