"use client";

import Terminal from "./Terminal";
import TaskManager from "../widgets/TaskManager";
import SystemMonitor from "../widgets/SystemMonitor";
import { ListChecks, Terminal as TerminalIcon, Activity } from "lucide-react";

export default function MobileSystemView() {
  return (
    <div className="flex flex-col gap-8 px-4 py-8 animate-in fade-in slide-in-from-right-4 duration-700 pb-32">
      {/* OS Monitor Module */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 px-4">
            <Activity size={18} className="text-neon-primary" />
            <h3 className="text-sm font-black text-os-text uppercase tracking-[0.4em]">Kernel_Telemetry</h3>
        </div>
        <div className="glass-panel rounded-2xl border-os-border/20 overflow-hidden h-[380px]">
            <SystemMonitor />
        </div>
      </div>

      {/* Task Manager Module */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 px-4 pt-4">
            <ListChecks size={18} className="text-neon-secondary" />
            <h3 className="text-sm font-black text-os-text uppercase tracking-[0.4em]">Active_Process_Threads</h3>
        </div>
        <div className="glass-panel rounded-2xl border-os-border/20 overflow-hidden h-[420px]">
            <TaskManager />
        </div>
      </div>

      {/* Terminal Module */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 px-4 pt-4">
            <TerminalIcon size={18} className="text-neon-primary" />
            <h3 className="text-sm font-black text-os-text uppercase tracking-[0.4em]">Secure_Shell_Terminal</h3>
        </div>
        <div className="glass-panel rounded-2xl border-os-border/20 overflow-hidden h-[500px]">
            <Terminal />
        </div>
      </div>

      <div className="flex items-center justify-center p-8 opacity-20 text-[10px] font-black uppercase tracking-[1em] pb-24">
          END_OF_SYSTEM_DATA
      </div>
    </div>
  );
}
