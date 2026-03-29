"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!@#$%^&*()_+{}:\"<>?|/\\-=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative inline-block font-mono ${className}`}
    >
      <span className="relative z-10">{displayText}</span>
      <span className="absolute top-0 left-0 -z-10 animate-glitch text-neon-secondary opacity-50 blur-[1px] translate-x-[1px]">
        {displayText}
      </span>
      <span className="absolute top-0 left-0 -z-10 animate-glitch text-neon-accent opacity-50 blur-[1px] -translate-x-[1px]">
        {displayText}
      </span>
    </motion.div>
  );
}
