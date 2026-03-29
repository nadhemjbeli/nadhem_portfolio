"use client";

import { motion } from "framer-motion";
import { Mail, Send, ShieldCheck, Globe } from "lucide-react";
import { CV_DATA } from "@/constants/cvData";

export default function Contact() {
  const handleSend = () => {
    window.location.href = `mailto:${CV_DATA.email}`;
  };

  return (
    <div className="flex flex-col h-full bg-os-bg/40 font-mono crt-overlay overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-neon-primary/10 flex items-center justify-center border border-neon-primary/20"
        >
          <Mail size={40} className="text-neon-primary animate-pulse" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-[0.2em] text-os-text uppercase">
            Secure Channel Ready
          </h2>
          <p className="text-[10px] text-os-text/40 tracking-widest uppercase mt-1">
            End-to-end encrypted // Transmit message?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          <div className="glass-panel p-4 flex items-center gap-3 border-neon-primary/5 hover:border-neon-primary/20 transition-colors">
            <ShieldCheck size={16} className="text-neon-secondary" />
            <div className="text-left">
              <div className="text-[8px] text-os-text/30 font-bold uppercase">Status</div>
              <div className="text-xs text-os-text/80">AUTHENTICATED</div>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-3 border-neon-secondary/5 hover:border-neon-secondary/20 transition-colors">
            <Globe size={16} className="text-neon-primary" />
            <div className="text-left">
              <div className="text-[8px] text-os-text/30 font-bold uppercase">Node</div>
              <div className="text-xs text-os-text/80">GLOBAL_RELAY</div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSend}
          className="group relative w-full max-w-sm"
        >
          <div className="absolute -inset-0.5 bg-neon-primary opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3 bg-neon-primary py-4 rounded font-bold text-os-bg uppercase tracking-[0.2em] text-sm overflow-hidden">
            <Send size={18} />
            <span>SEND_TRANSMISSION()</span>
            <div className="absolute top-0 -right-full w-full h-full bg-white/20 skew-x-[-25deg] group-hover:left-full transition-all duration-700 ease-in-out" />
          </div>
        </motion.button>
      </div>

      <div className="p-4 bg-os-surface/20 border-t border-os-border/20 flex items-center justify-between text-[8px] text-os-text/20 tracking-[0.3em] uppercase">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-neon-secondary animate-ping" />
          <span>COMMS_ONLINE</span>
        </div>
        <span>{CV_DATA.email}</span>
      </div>
    </div>
  );
}
