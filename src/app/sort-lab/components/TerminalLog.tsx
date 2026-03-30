"use client";

import { useEffect, useState } from "react";

interface TerminalLogProps {
  description: string;
  algorithmLabel: string;
}

export default function TerminalLog({ description, algorithmLabel }: TerminalLogProps) {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Typewriter effect on description change
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const text = `> EXECUTING ${algorithmLabel}... ${description}`;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [description, algorithmLabel]);

  return (
    <div className="glass-panel border border-os-border/20 rounded-xl px-5 py-3 font-mono">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
        <span className="text-[8px] font-black tracking-[0.4em] uppercase text-os-text/30">OPERATION_LOG</span>
      </div>
      <p className="text-[11px] text-neon-primary/80 leading-relaxed min-h-[1.5rem]">
        {displayed}
        <span
          className="inline-block w-[6px] h-[10px] bg-neon-primary ml-0.5 align-middle"
          style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
        />
      </p>
    </div>
  );
}
