"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";
import { CV_DATA } from "@/constants/cvData";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function DesktopHero() {
  const handleInitiateContact = () => {
    // Dispatch a custom event or trigger navigation
    const contactBtn = document.getElementById("dock-contact-btn");
    if (contactBtn) contactBtn.click();
    else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-20 xl:px-32 pointer-events-none select-none z-0">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col gap-0 mb-12"
      >
        <h1 className="text-[120px] font-black leading-[0.8] tracking-tighter text-os-text opacity-80 uppercase">
            NADHEM
        </h1>
        <h1 className="text-[120px] font-black leading-[0.8] tracking-tighter border-text-os uppercase opacity-60">
            JBELI
        </h1>
        <h1 className="text-[120px] font-black leading-[0.8] tracking-tighter text-neon-primary text-shadow-neon uppercase">
            BACKEND
        </h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-[380px] lg:max-w-[450px] flex flex-col gap-8 pointer-events-auto"
      >
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-neon-primary text-[12px] font-black tracking-[0.4em] uppercase">
                <div className="h-[2px] w-8 bg-current" />
                <span>:: BACKEND_ENGINEER ::</span>
                <div className="h-[2px] w-8 bg-current" />
            </div>

            <p className="text-[16px] leading-relaxed text-os-text/60 font-medium">
                Building scalable services and mission-critical APIs. Specializing in <span className="text-os-text font-black">Node.js</span>, <span className="text-os-text font-black">NestJS</span>, <span className="text-os-text font-black">React</span>, <span className="text-os-text font-black">Docker</span>, and <span className="text-os-text font-black">GCP</span>. Turning complex data pipelines into elegant, manageable code.
            </p>
        </div>

        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-os-text/30">
                <div className="w-2 h-2 rounded-full bg-neon-primary animate-pulse" />
                <span>STATUS: AVAILABLE</span>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <motion.button
                    onClick={handleInitiateContact}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-4 px-10 py-4 bg-neon-primary text-black font-black text-sm tracking-[0.3em] uppercase rounded-md shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:shadow-[0_0_60px_rgba(204,255,0,0.5)] transition-shadow group"
                >
                    INITIATE CONTACT()
                    <ChevronRight className="transform group-hover:translate-x-2 transition-transform" />
                </motion.button>

                <motion.a
                    href="/nadhem_jbeli_cv_english.pdf"
                    download="Nadhem_Jbeli_CV.pdf"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(204,255,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-4 px-10 py-4 border border-neon-primary/30 text-neon-primary font-black text-sm tracking-[0.3em] uppercase rounded-md hover:border-neon-primary/60 transition-all duration-300 group"
                >
                    DOWNLOAD_DOSSIER[PDF]
                </motion.a>
            </div>
        </div>
      </motion.div>

      {/* Background Ambience Labels */}
      <div className="absolute top-1/2 right-24 h-[400px] w-[400px] border-l border-t border-neon-primary/20 pointer-events-none opacity-40 -translate-y-1/2">
          <div className="absolute top-4 left-4 text-[10px] font-black text-neon-primary/40 uppercase tracking-[1em] vertical-rl">
              TERMINAL_UPLINK_ENCRYPTED
          </div>
      </div>
    </div>
  );
}
