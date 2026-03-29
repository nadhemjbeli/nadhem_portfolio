"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface SlideToUnlockProps {
  onUnlock: () => void;
  text?: string;
}

export default function SlideToUnlock({ onUnlock, text = "SLIDE TO UNLOCK" }: SlideToUnlockProps) {
  const x = useMotionValue(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Track width for constraints
  const [trackWidth, setTrackWidth] = useState(0);
  const handleWidth = 60; // circular handle size

  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById("slide-track");
      if (el) setTrackWidth(el.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Text opacity fades as we slide
  const textOpacity = useTransform(x, [0, trackWidth * 0.5], [1, 0]);
  
  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= trackWidth - handleWidth - 10) {
      setIsUnlocked(true);
      onUnlock();
    } else {
      x.set(0);
    }
  };

  return (
    <div 
      id="slide-track"
      className="relative w-full max-w-[320px] h-[64px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 overflow-hidden select-none"
    >
      {/* Dynamic Text Label */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-white/40 tracking-[0.3em] uppercase pointer-events-none"
      >
        {text}
      </motion.div>

      {/* Draggable Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: trackWidth - handleWidth - 8 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      >
        <ChevronRight className="text-black" size={28} />
      </motion.div>
      
      {/* Background Progress Fill */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 bg-white/5 rounded-full"
        style={{ width: x }}
      />
    </div>
  );
}
