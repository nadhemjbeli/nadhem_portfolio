"use client";

import type { AlgorithmId, AlgorithmMeta } from "../algorithms/types";

interface AlgorithmSelectorProps {
  algorithms: AlgorithmMeta[];
  selected: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
  disabled?: boolean;
}

export default function AlgorithmSelector({
  algorithms,
  selected,
  onSelect,
  disabled,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {algorithms.map((algo) => {
        const isActive = algo.id === selected;
        return (
          <button
            key={algo.id}
            onClick={() => !disabled && onSelect(algo.id)}
            disabled={disabled}
            className={`
              px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-200 rounded
              ${isActive
                ? "bg-neon-primary text-black border-neon-primary shadow-[0_0_12px_rgba(204,255,0,0.4)]"
                : "bg-transparent text-os-text/50 border-os-border/40 hover:border-neon-primary/40 hover:text-os-text disabled:opacity-30 disabled:cursor-not-allowed"
              }
            `}
          >
            [ {algo.label} ]
          </button>
        );
      })}
    </div>
  );
}
