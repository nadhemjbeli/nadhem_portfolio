import type { SortResult, SortStep } from "./types";

export function insertionSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const n = a.length;

  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: [0],
    description: `INDEX [0] (VALUE: ${a[0]}) — first element is trivially sorted`,
  });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    steps.push({
      array: [...a],
      comparing: [i, j],
      swapping: null,
      sorted: Array.from({ length: i }, (_, k) => k),
      description: `Picking key — INDEX [${i}] (VALUE: ${key}) to insert into sorted region`,
    });

    while (j >= 0 && a[j] > key) {
      comparisons++;
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        description: `Shifting INDEX [${j}] (VALUE: ${a[j]}) right — making room for key ${key}`,
      });
      a[j + 1] = a[j];
      swaps++;
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: null,
        sorted: Array.from({ length: i }, (_, k) => k),
        description: `Shifted ${a[j + 1]} to INDEX [${j + 1}]`,
      });
      j--;
    }

    comparisons++;
    a[j + 1] = key;
    steps.push({
      array: [...a],
      comparing: [-1, -1],
      swapping: null,
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      description: `Inserted key ${key} at INDEX [${j + 1}] — sorted region now includes ${i + 1} elements`,
    });
  }

  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: a.map((_, i) => i),
    description: `INSERTION_SORT complete — ${comparisons} comparisons, ${swaps} shifts`,
  });

  return {
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  };
}
