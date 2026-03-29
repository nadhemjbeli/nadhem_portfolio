"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { Activity, Cpu, Zap, Network } from "lucide-react";

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 40) + 30,
  }));
};

export default function SystemMonitor() {
  const [data, setData] = useState(generateData());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), { time: prev.length, value: Math.floor(Math.random() * 40) + 30 }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full p-4 gap-4 bg-os-bg/40 crt-overlay">
      <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.2em] font-black text-os-text/40">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-neon-primary animate-pulse" />
          <span>Kernel_Telemetry</span>
        </div>
        <div className="flex items-center gap-2 text-neon-secondary">
          <div className="w-2 h-2 rounded-full bg-neon-secondary animate-pulse shadow-[0_0_8px_rgba(0,255,204,0.3)]" />
          <span>Live_Feed</span>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] glass-panel rounded-lg p-2 border-neon-primary/10">
        {hasMounted && (
          <ResponsiveContainer width="100%" height={120} minWidth={0} minHeight={0}>
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ccff00"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ccff0033', fontSize: '10px' }}
                itemStyle={{ color: '#ccff00' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-3 rounded-lg flex flex-col gap-2 border-neon-primary/5 hover:border-neon-primary/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-black text-os-text/40 uppercase">
              <Cpu size={14} className="text-neon-primary" />
              <span>CPU_Load</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-neon-primary tracking-tighter">
              {data[data.length - 1].value}%
            </span>
            <span className="text-[11px] text-os-text/20 mb-1 font-black">STABLE</span>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-lg flex flex-col gap-2 border-neon-secondary/5 hover:border-neon-secondary/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-black text-os-text/40 uppercase">
              <Zap size={14} className="text-neon-secondary" />
              <span>Mem_Usage</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-neon-secondary tracking-tighter">
              26.4
            </span>
            <span className="text-[11px] text-os-text/20 mb-1 font-black">GB</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-os-text/20 uppercase tracking-widest font-mono font-bold">
        <Network size={12} />
        <span>Incoming_Traffic: 142.2 KB/s</span>
      </div>
    </div>
  );
}
