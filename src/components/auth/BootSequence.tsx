"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "INITIALIZING KO_KERNEL V1.0.4-LTS...",
  "CHECKING CPU: AMD EPYC 7763 64-CORE PROCESSOR... OK",
  "CHECKING MEMORY: 65536MB RAM... OK",
  "INITIALIZING VIRTUAL DISK [SDA1]... OK",
  "MOUNTING ROOT FILE SYSTEM... OK",
  "ENABLING NETWORK INTERFACE [ETH0]... OK",
  "ESTABLISHING SECURE TUNNEL TO NADHEM-DEV-ENV... OK",
  "STARTING SYSTEM SERVICES...",
  "SERVICE [SSHD]... STARTED",
  "SERVICE [DOCKER]... STARTED",
  "SERVICE [POSTGRES]... STARTED",
  "LOADING CYBER-OS DESKTOP ENVIRONMENT...",
  "SYSTEM STATUS: OPTIMAL",
  "ACCESS GRANTED.",
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-os-bg flex items-center justify-center p-8 z-[200] font-mono crt-overlay">
      <div 
        ref={scrollRef}
        className="w-full max-w-2xl h-[400px] overflow-y-auto space-y-1 text-xs md:text-sm text-neon-primary/80 scrollbar-none"
      >
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
            >
              <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-neon-primary ml-1"
        />
      </div>
    </div>
  );
}
