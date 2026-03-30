import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import type { AlgorithmMeta } from "./types";

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: "bubble",
    label: "BUBBLE_SORT",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly swaps adjacent elements if out of order. Simple but slow.",
    run: bubbleSort,
  },
  {
    id: "selection",
    label: "SELECTION_SORT",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Finds minimum in unsorted region and places it at correct position.",
    run: selectionSort,
  },
  {
    id: "insertion",
    label: "INSERTION_SORT",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Builds sorted region one element at a time by shifting.",
    run: insertionSort,
  },
  {
    id: "merge",
    label: "MERGE_SORT",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Divide and conquer — splits array, sorts halves, merges back.",
    run: mergeSort,
  },
  {
    id: "quick",
    label: "QUICK_SORT",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description: "Partitions around a pivot, recursively sorts sub-arrays.",
    run: quickSort,
  },
];

export { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort };
export type { SortStep, SortResult, AlgorithmId, AlgorithmMeta, Mode, ChallengeState } from "./types";
