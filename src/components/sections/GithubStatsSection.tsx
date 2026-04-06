"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  GitCommit, 
  PlusSquare, 
  Star, 
  Activity, 
  ChevronRight,
  Database,
  Users,
  Code,
  Building2,
  MapPin
} from "lucide-react";

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: any;
  created_at: string;
}

interface GroupedRepoEvents {
  repoName: string;
  count: number;
  type: string;
  lastAction: string;
  date: string;
}

const GithubHeatmap = ({ contributions, isLoading }: { contributions: any[], isLoading: boolean }) => {
  const rows = 7;
  const cols = 53;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const cells = useMemo(() => {
    if (isLoading || !contributions || contributions.length === 0) {
      return Array.from({ length: rows * cols }, (_, i) => ({ id: i, level: 0, count: 0, date: "" }));
    }
    const flattenData = Array.isArray(contributions[0]) ? contributions.flat() : contributions;
    const displayData = flattenData.slice(-(rows * cols));
    const levelMap: { [key: string]: number } = {
      "NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2, "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4
    };
    return displayData.map((d: any, i: number) => ({
      id: i,
      level: levelMap[d.contributionLevel] ?? 0,
      count: d.contributionCount ?? 0,
      date: d.date
    }));
  }, [contributions, isLoading]);

  const levelColors = [
    "bg-[#161b22]",         
    "bg-neon-primary/20",   
    "bg-neon-primary/40",   
    "bg-neon-primary/70",   
    "bg-neon-primary",      
  ];

  return (
    <div className="w-full font-mono">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Activity size={14} className="text-neon-primary" />
                <span className="text-[12px] font-black tracking-[0.2em] text-os-text/40 uppercase">Contribution_Matrix</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-os-text/30 font-bold">
                <span>Less</span>
                <div className="flex gap-1.5">
                    {levelColors.map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                </div>
                <span>More</span>
            </div>
        </div>

        <div className="flex gap-6">
            <div className="flex flex-col justify-between text-[10px] text-os-text/20 py-2 h-[100px] font-black select-none pt-4">
                <span>MON</span>
                <span>WED</span>
                <span>FRI</span>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar px-2 bg-os-surface/10 rounded-lg p-4 border border-os-border/10 touch-pan-x select-none pointer-events-auto">
                <div className="w-[820px] min-w-full">
                    <div className="grid grid-cols-12 text-[10px] text-os-text/20 mb-3 font-black select-none px-2 uppercase tracking-tighter">
                        {months.map(m => <span key={m} className="text-center">{m}</span>)}
                    </div>
                    
                    <div 
                        className="grid grid-flow-col gap-[3px] h-[100px] w-full"
                        style={{ 
                            gridTemplateRows: "repeat(7, 1fr)",
                            gridTemplateColumns: `repeat(${cols}, 1fr)`
                        }}
                    >
                        {isLoading ? (
                            Array.from({ length: rows * cols }).map((_, i) => (
                                <div key={i} className="w-[11px] h-[11px] rounded-sm bg-os-surface animate-pulse" />
                            ))
                        ) : (
                            cells.map((cell) => (
                                <div
                                    key={cell.id}
                                    className={`w-[11px] h-[11px] rounded-sm ${levelColors[cell.level]} transition-all hover:ring-2 hover:ring-white/40 cursor-help group/cell relative`}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-os-surface border-t-2 border-neon-primary text-[10px] text-os-text whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none z-20 font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl">
                                        <span className="text-neon-primary">{cell.count} OPS</span> // {cell.date}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function GithubStatsSection() {
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const username = "nadhemjbeli";
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));

    fetch(`https://api.github.com/users/${username}/events`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setEvents(data) : [])
      .catch(err => console.error(err));

    fetch(`https://github-contributions-api.deno.dev/${username}.json`)
      .then(res => res.json())
      .then(data => {
        if (data.contributions) setContributions(data.contributions);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: GroupedRepoEvents } = {};
    events.slice(0, 60).forEach(event => {
      const repoName = event.repo.name.split('/')[1] || event.repo.name;
      if (!groups[repoName]) {
        let count = 0;
        let lastAction = "";
        if (event.type === "PushEvent") {
          count = event.payload.distinct_size || event.payload.size || event.payload.commits?.length || 1;
          lastAction = "DEPLOY_COMMIT";
        } else if (event.type === "CreateEvent") {
          count = 1;
          lastAction = `INIT_${event.payload.ref_type.toUpperCase()}`;
        } else if (event.type === "WatchEvent") {
          count = 1;
          lastAction = "NODE_STARRED";
        } else {
          count = 1;
          lastAction = event.type.replace('Event', '').toUpperCase();
        }
        groups[repoName] = { repoName, count, type: event.type, lastAction, date: event.created_at };
      } else {
        if (event.type === "PushEvent") {
          groups[repoName].count += (event.payload.distinct_size || event.payload.size || event.payload.commits?.length || 1);
        }
      }
    });
    return Object.values(groups).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
        case "PushEvent": return GitCommit;
        case "CreateEvent": return PlusSquare;
        case "WatchEvent": return Star;
        case "PullRequestEvent": return GitBranch;
        default: return Activity;
    }
  };

  return (
    <section className="relative py-12 px-4 md:px-6 max-w-7xl mx-auto z-10 font-mono">
      <div className="flex flex-col mb-20 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="h-[2px] w-16 bg-neon-secondary" />
            <span className="text-neon-secondary text-lg font-black tracking-[0.4em] uppercase">
                Remote_Access // Active_Uplink
            </span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-os-text tracking-tighter uppercase leading-tight">
            GitHub <span className="text-neon-secondary">Operations</span>
        </h2>
      </div>

      <div className="flex flex-col gap-12">
        {/* Top: Heatmap (Full Width) */}
        <div className="glass-panel p-10 md:p-12 border-os-border/20 relative group overflow-hidden bg-os-bg/40 backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-primary/5 blur-[120px] rounded-full" />
            <GithubHeatmap contributions={contributions} isLoading={isLoading} />
        </div>

        {/* Middle: Extended Stats (Full Width) */}
        <div className="grid grid-cols-1 text-center md:grid-cols-3 md:text-left lg:grid-cols-6 lg:text-left xl:text-left gap-4">
            {[
                { label: "Hireable", value: profile?.hireable ? "READY" : "BUSY", icon: Activity, color: "text-blue-400" },
                { label: "Followers", value: profile?.followers || "--", icon: Users, color: "text-neon-secondary" },
                { label: "Following", value: profile?.following || "--", icon: Users, color: "text-neon-accent" },
                { label: "Repos", value: profile?.public_repos || "--", icon: Database, color: "text-neon-primary" },
                { label: "Company", value: profile?.company || "EUCLYDIA", icon: Building2, color: "text-purple-400" },
                { label: "Locale", value: profile?.location || "TUNISIA", icon: MapPin, color: "text-red-400" },
            ].map((stat, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 border-os-border/20 flex flex-col gap-3 hover:border-os-text/20 transition-all hover:-translate-y-1 bg-os-bg/30"
                >
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <stat.icon size={14} className={stat.color} />
                        <span className="text-[11px] font-black text-os-text/40 uppercase tracking-[0.2em]">{stat.label}</span>
                    </div>
                    <span className={`text-2xl font-black truncate ${stat.color}`}>{stat.value}</span>
                </motion.div>
            ))}
        </div>

        {/* Bottom: Mission Timeline (Full Width Refactor) */}
        <div className="glass-panel p-10 border-os-border/20 bg-os-bg/60 backdrop-blur-3xl">
            <div className="flex items-center gap-4 w-full border-b border-os-border/20 pb-6 mb-8">
                <div className="p-3 rounded bg-neon-secondary/10 border border-neon-secondary/20 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                    <GitBranch size={20} className="text-neon-secondary" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-black tracking-[0.3em] text-os-text uppercase">Mission_Logs</h3>
                    <span className="text-[10px] text-os-text/30 font-bold uppercase tracking-widest">Temporal_Dossier // Grouped_Actions</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                <AnimatePresence mode="popLayout">
                    {groupedEvents.map((group, i) => {
                        const Icon = getEventIcon(group.type);
                        return (
                            <motion.div 
                                key={group.repoName + i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative flex flex-col gap-3 group/mission p-4 rounded-xl hover:bg-os-text/5 transition-colors border border-transparent hover:border-os-border/10"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-black text-neon-secondary tracking-widest truncate group-hover/mission:text-neon-primary transition-colors">
                                        {group.repoName}
                                    </span>
                                    <span className="text-[10px] text-os-text/30 font-black whitespace-nowrap bg-os-surface/50 px-2 py-1 rounded border border-os-border/20 uppercase">
                                        {new Date(group.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[12px] text-os-text/70 font-black uppercase tracking-[0.2em]">
                                    <Icon size={12} className={i % 2 === 0 ? "text-neon-primary" : "text-neon-secondary"} />
                                    <span>{group.lastAction}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className={`h-[2px] flex-1 ${i % 2 === 0 ? "bg-neon-primary/10" : "bg-neon-secondary/10"}`} />
                                     <div className={i % 2 === 0 ? "text-[10px] text-neon-primary/60 font-black" : "text-[10px] text-neon-secondary/60 font-black"}>
                                         BATCH::{group.count}
                                     </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-12 flex justify-center">
                <a 
                    href="https://github.com/nadhemjbeli" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-10 py-5 bg-neon-secondary/5 border border-neon-secondary/20 hover:bg-neon-secondary/10 hover:border-secondary-400/40 hover:border-neon-secondary transition-all group rounded-xl shadow-[0_0_30px_rgba(0,0,255,0.05)]"
                >
                    <div className="flex items-center gap-4 text-neon-secondary text-[12px] font-black tracking-[0.5em] uppercase">
                        <Code size={20} />
                        <span>View_Full_Mainframe</span>
                    </div>
                    <ChevronRight size={20} className="text-neon-secondary group-hover:translate-x-2 transition-transform" />
                </a>
            </div>
        </div>
      </div>

      <div className="mt-24 border-t border-os-border/10 pt-10 flex flex-col md:flex-row items-center justify-between font-mono text-[11px] text-os-text/20 uppercase tracking-[0.6em] gap-4">
        <span>GitHub_Sync_Module_v3.5 // AUTH: SUCCESS</span>
        <span>Secure_Node // Nadhem_JB // 2026</span>
      </div>
    </section>
  );
}
