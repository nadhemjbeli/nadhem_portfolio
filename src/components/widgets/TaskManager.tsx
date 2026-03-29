"use client";

import { motion } from "framer-motion";
import { CheckCircle, Play, Pause, ListChecks } from "lucide-react";
import { CV_DATA } from "@/constants/cvData";

export default function TaskManager() {
  return (
    <div className="flex flex-col h-full bg-os-bg/40 crt-overlay overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-os-border/50 bg-os-surface/40">
        <div className="flex items-center gap-2 text-[12px] font-black text-os-text/40 uppercase tracking-widest">
          <ListChecks size={16} className="text-neon-secondary" />
          <span>Active_Process_Threads</span>
        </div>
        <div className="text-[12px] text-neon-secondary font-mono font-bold">
          TOTAL_THREADS: {CV_DATA.projects.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-none">
        {CV_DATA.projects.map((project, index) => (
          <motion.div 
            key={project.name} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between group cursor-default border-b border-os-border/10 pb-3 last:border-0"
          >
            <div className="flex items-center gap-3">
              {project.status === "ACTIVE" ? (
                <Play size={14} className="text-neon-primary animate-pulse" />
              ) : (
                <CheckCircle size={14} className="text-neon-secondary" />
              )}
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-os-text group-hover:text-neon-primary transition-colors">
                  {project.name.toUpperCase()}
                </span>
                <span className="text-[10px] text-os-text/30 font-bold">
                  PID: {8000 + index * 124}{' // '}{project.link.replace('https://', '')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-[11px] font-black">
              <div className="flex flex-col items-end">
                <span className={project.status === "ACTIVE" ? "text-neon-secondary" : "text-os-text/60"}>
                  {project.status}
                </span>
                <span className="text-[10px] text-neon-primary/40 font-mono">{project.load} LOAD</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* System Services Placeholder */}
        <div className="opacity-10 grayscale py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Pause size={12} />
                    <div className="flex flex-col text-[10px]">
                        <span>KERNEL_SWAP_DAEMON</span>
                        <span className="text-[8px]">PID: 0002</span>
                    </div>
                </div>
                <span className="text-[9px]">SLEEPING</span>
            </div>
        </div>
      </div>

      <div className="p-4 bg-os-surface/20 border-t border-os-border/20 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-os-text/20 font-bold">
          SYS_NODE: NADHEM-OS-X9
        </div>
        <button className="px-4 py-1.5 glass-panel rounded text-[11px] font-black text-os-text/40 hover:text-red-400 hover:border-red-400/50 transition-all uppercase tracking-widest">
          FLUSH_CACHE
        </button>
      </div>
    </div>
  );
}
