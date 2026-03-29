"use client";

import { motion } from "framer-motion";
import { Lock, ChevronRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import GlitchText from "@/components/ui/GlitchText";
import { CV_DATA } from "@/constants/cvData";
import MobileLockScreen from "./MobileLockScreen";

export default function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!hasMounted) return null;

  if (isMobile) {
    return <MobileLockScreen onUnlock={onEnter} />;
  }

  return (
    <div className="fixed inset-0 bg-os-bg flex items-center justify-center z-[150] crt-overlay overflow-hidden font-mono">
      {/* Background Decoration */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-12 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 px-6 py-2 glass-panel rounded-full text-[12px] uppercase font-black tracking-[0.3em] text-neon-primary/60 border-neon animate-pulse"
          >
            <Lock size={14} />
            SECURE WORKSTATION LOCKED
          </motion.div>
          
          <div className="flex flex-col gap-2 mt-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-os-text">
              <span className="block opacity-30 text-xl md:text-2xl font-black tracking-[0.5em] mb-6">ACCESSING_ENV:</span>
              <GlitchText text={CV_DATA.name.toUpperCase()} className="text-shadow-neon" />
            </h1>
            <p className="text-neon-secondary/60 font-black tracking-[0.4em] text-lg uppercase mt-4">
                {CV_DATA.title.toUpperCase()}
            </p>
          </div>
        </div>

        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-6 px-16 py-6 glass-panel rounded-xl border-2 border-neon-primary/20 hover:border-neon-primary transition-all duration-300 shadow-[0_0_30px_rgba(204,255,0,0.1)] hover:shadow-[0_0_50px_rgba(204,255,0,0.2)]"
        >
          <div className="absolute inset-0 bg-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <ShieldCheck className="text-neon-primary animate-pulse" size={28} />
          <span className="text-xl font-black tracking-[0.3em] text-os-text group-hover:text-neon-primary transition-colors">
            ENTER SYSTEM
          </span>
          <ChevronRight className="text-neon-primary transform group-hover:translate-x-2 transition-transform" />
        </motion.button>
        
        <div className="absolute bottom-[-140px] flex flex-col gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-os-text/20">
          <span>ENCRYPTION: AES-256-GCM // RSA-4096</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
            <span>STATUS: WAITING_FOR_AUTH...</span>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-neon-primary/10" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-neon-primary/10" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-neon-primary/10" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-neon-primary/10" />
    </div>
  );
}
