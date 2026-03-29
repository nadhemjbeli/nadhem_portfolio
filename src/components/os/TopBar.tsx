"use client";

import { useEffect, useState } from "react";
import { Cpu, Wifi, Battery, Shield, Clock } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-10 glass-panel border-b border-os-border flex items-center justify-between px-4 text-[12px] uppercase tracking-widest z-50 bg-os-bg/90 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-neon-primary animate-pulse font-black">
          <Shield size={14} />
          <span>System Secure</span>
        </div>
        <div className="h-3 w-px bg-os-border" />
        <div className="flex items-center gap-4 text-os-text/60 font-bold">
          <div className="flex items-center gap-1.5">
            <Cpu size={14} />
            <span>4.2GHz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={14} />
            <span>LAT: 12ms</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-bold text-neon-primary">
        <GlitchText text="CYBER-OS v1.0.4-LTS" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-os-text/80 font-bold">
          <Battery size={16} className="text-neon-secondary" />
          <span>98%</span>
        </div>
        <div className="flex items-center gap-2 font-black text-os-text">
          <Clock size={14} className="text-neon-primary" />
          <span>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
