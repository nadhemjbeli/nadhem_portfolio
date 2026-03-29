"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Battery, ShieldAlert, Volume2, VolumeX } from "lucide-react";
import SlideToUnlock from "./SlideToUnlock";

interface MobileLockScreenProps {
  onUnlock: () => void;
}

export default function MobileLockScreen({ onUnlock }: MobileLockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center bg-black overflow-hidden font-mono select-none">
      {/* Background Image Layer */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale-[0.3] brightness-[0.7]"
        style={{ backgroundImage: "url('/images/lockscreen-bg.png')" }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      
      {/* Top Bar Navigation */}
      <div className="relative z-10 w-full flex items-center justify-between px-8 py-4 text-[12px] font-black tracking-widest text-white/60">
        <div className="flex items-center gap-2">
            <span>CYBER-OS</span>
        </div>
        <div className="flex items-center gap-4">
            <Wifi size={14} className="text-white/40" />
            <div className="flex items-center gap-1.5 border border-white/20 rounded-md px-1.5 py-0.5">
                <Battery size={14} className="text-neon-secondary" />
                <span>94%</span>
            </div>
        </div>
      </div>

      {/* Main Clock Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 mt-32 flex flex-col items-center text-center px-6"
      >
        <h1 className="text-8xl font-thin tracking-tighter text-white/90 mb-2 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          {formatClock(time)}
        </h1>
        <div className="text-[14px] font-black text-white/40 tracking-[0.5em] uppercase border-y border-white/10 py-2 w-full max-w-[280px]">
          {formatDate(time)}
        </div>
      </motion.div>

      {/* Auth Control Section */}
      <div className="mt-auto mb-20 relative z-10 w-full flex flex-col items-center gap-12 px-10">
        <div className="flex items-center gap-3 text-[11px] font-bold text-white/20 uppercase tracking-[0.4em] animate-pulse">
            <ShieldAlert size={12} className="text-neon-primary" />
            <span>Encrypted Node Access Required</span>
        </div>
        
        <SlideToUnlock onUnlock={onUnlock} />
      </div>

      {/* Global Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-20">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white/40 border border-white/20 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
      </div>
      
      {/* Interactive Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-10">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
}
