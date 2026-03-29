"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Cpu, Code, ShieldCheck } from "lucide-react";
import { CV_DATA } from "@/constants/cvData";

export default function MobileHome() {
  const skills = ["Docker", "GCP", "Node.js", "NestJS", "React"];

  return (
    <div className="flex flex-col gap-8 px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Profile Card */}
      <div className="glass-panel p-8 rounded-[2rem] border-os-border/20 bg-os-surface/30 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-primary/10 blur-[60px] rounded-full -mr-10 -mt-10" />
        
        <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-neon-primary flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)] border-4 border-black/20">
                NJ
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-os-text tracking-tight uppercase">
                    {CV_DATA.name}
                </h2>
                <div className="flex items-center gap-2 text-neon-primary text-[10px] font-black tracking-[0.3em] uppercase opacity-80">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>BACKEND_ENGINEER</span>
                </div>
            </div>
        </div>

        <p className="text-[14px] leading-relaxed text-os-text/70 font-medium mb-6">
            Building scalable services and mission-critical APIs. Specializing in <span className="text-os-text font-black">Node.js</span>, <span className="text-os-text font-black">NestJS</span>, <span className="text-os-text font-black">React</span>, <span className="text-os-text font-black">Docker</span>, and <span className="text-os-text font-black">GCP</span>. Turning complex data pipelines into elegant, manageable code.
        </p>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-os-border/10">
            <span className="text-[10px] text-os-text/30 font-black uppercase tracking-widest mr-2 py-1">Core Stack::</span>
            {skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full bg-os-surface/50 border border-os-border/20 text-[10px] font-black text-os-text/60 uppercase tracking-wider group-hover:border-neon-primary/30 transition-colors">
                    {skill}
                </span>
            ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-os-border/20 bg-os-surface/20">
            <div className="p-3 w-fit rounded-xl bg-neon-primary/10 border border-neon-primary/20">
                <Activity size={20} className="text-neon-primary" />
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black text-os-text">99.9%</span>
                <span className="text-[10px] text-os-text/30 font-black uppercase tracking-widest">Global_Uptime</span>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-os-border/20 bg-os-surface/20">
            <div className="p-3 w-fit rounded-xl bg-neon-secondary/10 border border-neon-secondary/20">
                <Zap size={20} className="text-neon-secondary" />
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black text-neon-secondary">Active</span>
                <span className="text-[10px] text-os-text/30 font-black uppercase tracking-widest">Process_Status</span>
            </div>
        </div>
      </div>

      {/* Quick Access / Decoration */}
      <div className="flex items-center justify-between px-2 text-[10px] text-os-text/20 font-black uppercase tracking-[0.5em]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-neon-primary/40" />
            <span>Secure_Link_Established</span>
          </div>
          <span>v2.4.0</span>
      </div>
    </div>
  );
}
