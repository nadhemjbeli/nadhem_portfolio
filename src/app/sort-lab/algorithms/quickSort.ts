import type { SortResult, SortStep } from "./types";

export function quickSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function partition(array: number[], low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      array: [...array],
      comparing: [high, high],
      swapping: null,
      sorted: [],
      description: `Pivot selected — INDEX [${high}] (VALUE: ${pivot})`,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [j, high],
        swapping: null,
        sorted: [],
        description: `Comparing INDEX [${j}] (${array[j]}) vs pivot ${pivot}`,
      });

      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          steps.push({
            array: [...array],
            comparing: [i, j],
            swapping: [i, j],
            sorted: [],
            description: `Swap INDEX [${i}] (${array[i]}) with INDEX [${j}] (${array[j]}) — moving smaller left of pivot`,
          });
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            comparing: [i, j],
            swapping: null,
            sorted: [],
            description: `Swap complete — INDEX [${i}] = ${array[i]}, INDEX [${j}] = ${array[j]}`,
          });
        }
      }
    }

    swaps++;
    steps.push({
      array: [...array],
      comparing: [i + 1, high],
      swapping: [i + 1, high],
      sorted: [],
      description: `Placing pivot — swap INDEX [${i + 1}] (${array[i + 1]}) with INDEX [${high}] (${pivot})`,
    });
    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    const pivotPos = i + 1;
    steps.push({
      array: [...array],
      comparing: [-1, -1],
      swapping: null,
      sorted: [pivotPos],
      description: `Pivot ${pivot} locked at INDEX [${pivotPos}] — partition complete`,
    });

    return pivotPos;
  }

  function quickSortHelper(array: number[], low: number, high: number): void {
    if (low < high) {
      steps.push({
        array: [...array],
        comparing: [low, high],
        swapping: null,
        sorted: [],
        description: `Partitioning segment [${low}..${high}]`,
      });
      const pi = partition(array, low, high);
      quickSortHelper(array, low, pi - 1);
      quickSortHelper(array, pi + 1, high);
    }
  }

  quickSortHelper(a, 0, a.length - 1);

  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: a.map((_, i) => i),
    description: `QUICK_SORT complete — ${comparisons} comparisons, ${swaps} swaps`,
  });

  return {
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
  };
}
