import type { SortResult, SortStep } from "./types";

export function mergeSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  function merge(
    array: number[],
    left: number,
    mid: number,
    right: number
  ): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({
      array: [...array],
      comparing: [left, right],
      swapping: null,
      sorted: [],
      description: `Merging sub-arrays [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [left + i, mid + 1 + j],
        swapping: null,
        sorted: [],
        description: `Comparing LEFT[${i}] = ${leftArr[i]} vs RIGHT[${j}] = ${rightArr[j]}`,
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        swaps++;
        j++;
      }
      steps.push({
        array: [...array],
        comparing: [k, k],
        swapping: [k, k],
        sorted: [],
        description: `Placed VALUE ${array[k]} at INDEX [${k}]`,
      });
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      steps.push({
        array: [...array],
        comparing: [-1, -1],
        swapping: null,
        sorted: [],
        description: `Placing remaining left element ${array[k]} at INDEX [${k}]`,
      });
      i++; k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      steps.push({
        array: [...array],
        comparing: [-1, -1],
        swapping: null,
        sorted: [],
        description: `Placing remaining right element ${array[k]} at INDEX [${k}]`,
      });
      j++; k++;
    }
  }

  function mergeSortHelper(array: number[], left: number, right: number): void {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: [...array],
      comparing: [left, right],
      swapping: null,
      sorted: [],
      description: `Dividing segment [${left}..${right}] at midpoint INDEX [${mid}]`,
    });
    mergeSortHelper(array, left, mid);
    mergeSortHelper(array, mid + 1, right);
    merge(array, left, mid, right);
  }

  mergeSortHelper(a, 0, a.length - 1);

  steps.push({
    array: [...a],
    comparing: [-1, -1],
    swapping: null,
    sorted: a.map((_, i) => i),
    description: `MERGE_SORT complete — ${comparisons} comparisons, ${swaps} out-of-order merges`,
  });

  return {
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  };
}
