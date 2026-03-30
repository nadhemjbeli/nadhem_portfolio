"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgressRing() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest > 0.01) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-8 right-8 z-[1000] pointer-events-none hidden lg:block">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        className="relative flex items-center justify-center w-16 h-16"
      >
        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-os-text/10"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--color-neon-primary)"
            strokeWidth="2"
            strokeDasharray="175.93" // 2 * pi * 28
            style={{ pathLength: scrollYProgress }}
            className="drop-shadow-[0_0_8px_var(--color-neon-primary)]"
          />
        </svg>

        {/* Center Text */}
        <motion.div className="text-[10px] font-black tracking-tighter text-os-text/40">
           <span className="text-neon-primary italic uppercase">Mission</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
