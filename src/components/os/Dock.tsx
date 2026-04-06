"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Mail, Home, ListChecks, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const DOCK_ITEMS = [
  { id: "home", icon: Home, label: "Home", color: "text-blue-400" },
  { id: "terminal", icon: Terminal, label: "Terminal", color: "text-neon-primary" },
  { id: "system", icon: Activity, label: "System", color: "text-neon-accent" },
  { id: "tasks", icon: ListChecks, label: "Tasks", color: "text-neon-secondary" },
  { id: "contact", icon: Mail, label: "Contact", color: "text-red-400" },
];

const MOBILE_DOCK_ITEMS = [
  { id: "home", icon: Home, label: "Home", color: "text-neon-primary" },
  { id: "system", icon: Activity, label: "System", color: "text-neon-secondary" },
  { id: "contact", icon: Mail, label: "Contact", color: "text-red-400" },
];

interface DockProps {
  activeWindows: string[];
  onToggle: (id: string) => void;
  isMobile?: boolean;
}

export default function Dock({ activeWindows, onToggle, isMobile }: DockProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const items = isMobile ? MOBILE_DOCK_ITEMS : DOCK_ITEMS;

  return (
    <div className={`${isMobile ? 'absolute bottom-8' : 'absolute bottom-6'} left-0 w-full flex justify-center px-4 pointer-events-none z-[100]`}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`glass-panel px-2 md:px-4 py-2 flex items-center gap-1 md:gap-4 rounded-2xl md:rounded-3xl border-os-border/20 bg-os-bg/90 backdrop-blur-3xl pointer-events-auto border-t-[1px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${isMobile ? 'ring-1 ring-white/5' : ''}`}
      >
        {items.map((item) => {
          const isActive = activeWindows.includes(item.id);
          
          return (
            <motion.button
              key={item.id}
              id={item.id === "contact" ? "dock-contact-btn" : undefined}
              onClick={() => onToggle(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 hover:bg-white/5 group relative flex flex-col items-center outline-none`}
            >
              <item.icon className={`size-6 md:size-6 transition-all duration-300 ${
                isActive ? `${item.color} drop-shadow-[0_0_8px_currentColor]` : "text-os-text/30 group-hover:text-os-text/60"
              }`} />
              
              <AnimatePresence>
                {hovered === item.id && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute px-3 py-1.5 glass-panel text-[10px] font-black tracking-widest uppercase text-neon-primary border-neon-primary/30 backdrop-blur-md bg-os-bg/90 whitespace-nowrap shadow-2xl"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Glowing Dot Indicator */}
              <div className={`mt-2 w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out ${
                isActive ? "bg-neon-primary scale-110 shadow-[0_0_10px_#ccff00]" : "bg-transparent scale-0"
              }`} />

              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -bottom-1 w-6 h-[1.5px] bg-neon-primary opacity-30" 
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
