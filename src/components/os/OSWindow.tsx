"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OSWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  isFocused: boolean;
  className?: string;
  icon?: React.ReactNode;
  isMobile?: boolean;
}

export default function OSWindow({ 
  id, 
  title, 
  children, 
  onClose, 
  onFocus, 
  isFocused, 
  className, 
  icon,
  isMobile
}: OSWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <motion.div
      drag={!isMaximized && !isMobile}
      dragMomentum={false}
      initial={isMobile ? { y: 20, opacity: 0 } : { scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      onMouseDown={onFocus}
      style={{ zIndex: isFocused ? 50 : 30 }}
      className={cn(
        "glass-panel rounded-xl shadow-2xl flex flex-col overflow-hidden border-os-border min-w-[300px] min-h-[200px] transition-all duration-300",
        isFocused ? "border-neon-active ring-1 ring-neon-primary/20" : "opacity-80 scale-[0.98]",
        isMaximized || isMobile ? "fixed inset-0 z-[60] rounded-none m-0 border-x-0 border-t-0" : "absolute",
        isMobile && "top-12 bottom-24", // Adjust for TopBar and Dock
        className
      )}
    >
      {/* Title Bar */}
      <div className="h-10 bg-os-surface/90 border-b border-os-border flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group"
            >
              <span className="text-[10px] text-black opacity-0 group-hover:opacity-100 font-black">×</span>
            </button>
            {!isMobile && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group"
                >
                  <span className="text-[10px] text-black opacity-0 group-hover:opacity-100 font-black">−</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                  className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group"
                >
                  <span className="text-[10px] text-black opacity-0 group-hover:opacity-100 font-black">+</span>
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 h-4 w-px bg-os-border mx-1" />

          <div className="flex items-center gap-2">
            {icon}
            <span className={cn(
              "text-[12px] font-black tracking-widest uppercase truncate max-w-[200px] transition-colors",
              isFocused ? "text-neon-primary" : "text-os-text/40"
            )}>
              {title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[9px] font-bold font-mono text-os-text/20">
          <span>{id.toUpperCase()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto os-scrollbar bg-os-bg/60 backdrop-blur-md relative">
        {children}
      </div>
      
      {/* Status Bar */}
      <div className={cn(
        "h-8 bg-os-surface/40 border-t border-os-border/30 flex items-center px-4 justify-between text-[11px] font-black uppercase tracking-widest",
        isFocused ? "text-neon-primary/40" : "text-os-text/20"
      )}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-neon-secondary">
             <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
             <span>CONNECTED_SECURE</span>
          </div>
          <span className="opacity-40">:: {title.toUpperCase()}</span>
        </div>
        <span className="opacity-20 hidden md:block">NADHEM-OS-X9 // KERNEL-v1.4</span>
      </div>
    </motion.div>
  );
}
