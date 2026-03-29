"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CV_DATA } from "@/constants/cvData";

interface LogEntry {
  type: "command" | "output" | "error" | "info" | "success";
  content: string | React.ReactNode;
}

export default function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "info", content: "KO_KERNEL CONNECTION ESTABLISHED..." },
    { type: "success", content: `NADHEM-DEV-X9 AUTHENTICATED [AES-256]` },
    { type: "output", content: 'Type "help" for a list of available system commands.' },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newLogs: LogEntry[] = [...logs, { type: "command", content: cmd }];

    switch (trimmedCmd) {
      case "help":
        newLogs.push({
          type: "output",
          content: (
            <div className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-2 text-[13px] text-os-text/60 mt-3 font-mono leading-relaxed">
              <div className="text-neon-primary font-black">HELP</div>
              <div>Show this assistance interface</div>
              <div className="text-neon-primary font-black">ABOUT</div>
              <div>Retrieve developer bio from kernel</div>
              <div className="text-neon-primary font-black">EXPERIENCE</div>
              <div>Display detailed professional history</div>
              <div className="text-neon-primary font-black">SKILLS</div>
              <div>Display technical architecture stack</div>
              <div className="text-neon-primary font-black">PROJECTS</div>
              <div>Query active project processes</div>
              <div className="text-neon-primary font-black">CONTACT</div>
              <div>Retrieve encrypted communication links</div>
              <div className="text-neon-primary font-black">CLEAR</div>
              <div>Flush terminal memory buffer</div>
            </div>
          ),
        });
        break;
      case "clear":
        setLogs([]);
        return;
      case "about":
        newLogs.push({
          type: "output",
          content: (
            <div className="space-y-2 mt-1">
              <div className="text-neon-secondary font-black uppercase tracking-[0.2em] text-sm">{CV_DATA.name.toUpperCase()}{' // '}{CV_DATA.subtitle.toUpperCase()}</div>
              <div className="leading-relaxed opacity-80 text-[13px]">{CV_DATA.profile}</div>
              <div className="text-[11px] text-os-text/40 pt-1 font-bold italic">
                CURRENTLY_LOCATED_AT: {CV_DATA.location}
              </div>
            </div>
          )
        });
        break;
      case "experience":
        newLogs.push({
          type: "output",
          content: (
            <div className="space-y-6 mt-3">
              {CV_DATA.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-neon-secondary/20 pl-4 py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-neon-secondary font-black tracking-widest text-sm">[{exp.role.toUpperCase()}]</span>
                    <span className="text-os-text/40 text-[10px] font-bold">@ {exp.company.toUpperCase()}</span>
                  </div>
                  <div className="text-[11px] text-neon-primary/60 font-black mb-2 italic">{exp.period}</div>
                  <ul className="space-y-1">
                    {exp.highlights.map((h, hidx) => (
                      <li key={hidx} className="text-[13px] opacity-70 flex gap-2">
                        <span className="text-neon-primary/40">›</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        });
        break;
      case "skills":
        newLogs.push({
          type: "output",
          content: (
            <div className="grid grid-cols-[120px_1fr] gap-y-3 mt-3 text-[13px] font-bold">
              <div className="text-neon-primary opacity-60">LANGS:</div>
              <div>{CV_DATA.skills.languages.join(", ")}</div>
              <div className="text-neon-primary opacity-60">BACKEND:</div>
              <div>{CV_DATA.skills.backend.join(", ")}</div>
              <div className="text-neon-primary opacity-60">DEVOPS:</div>
              <div>{CV_DATA.skills.devops.join(", ")}</div>
              <div className="text-neon-primary opacity-60">TESTING:</div>
              <div>{CV_DATA.skills.testing.join(", ")}</div>
            </div>
          )
        });
        break;
      case "projects":
        newLogs.push({
          type: "output",
          content: (
            <div className="space-y-6 mt-3">
              <div className="text-[11px] opacity-40 italic font-bold uppercase tracking-widest">searching_database: active_projects...</div>
              {CV_DATA.projects.map(p => (
                <div key={p.name} className="border-l-2 border-neon-primary/20 pl-4 py-2 hover:bg-os-text/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-neon-primary font-black tracking-[0.2em] text-sm">[{p.name.toUpperCase()}]</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-black ${p.status === 'ACTIVE' ? 'border-neon-secondary text-neon-secondary' : 'border-os-border text-os-text/40'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[13px] opacity-70 mt-2 leading-relaxed">{p.description}</div>
                  <div className="text-[11px] text-neon-secondary/60 mt-2 underline underline-offset-4 font-bold">{p.link}</div>
                </div>
              ))}
            </div>
          )
        });
        break;
      case "contact":
        newLogs.push({
          type: "output",
          content: (
            <div className="space-y-4 mt-3">
              <div className="text-[11px] opacity-40 uppercase tracking-[0.4em] font-black">Establishing_secure_uplink...</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 group cursor-pointer hover:bg-os-text/5 p-2 rounded transition-colors">
                  <span className="text-neon-primary w-20 font-black">GITHUB::</span>
                  <span className="text-[13px] font-bold text-os-text/80">{CV_DATA.github}</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer hover:bg-os-text/5 p-2 rounded transition-colors">
                  <span className="text-neon-secondary w-20 font-black">LINKEDIN::</span>
                  <span className="text-[13px] font-bold text-os-text/80">{CV_DATA.linkedin}</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer hover:bg-os-text/5 p-2 rounded transition-colors">
                  <span className="text-red-400 w-20 font-black">MAIL::</span>
                  <span className="text-[13px] font-bold text-os-text/80">{CV_DATA.email}</span>
                </div>
              </div>
            </div>
          )
        });
        break;
      case "sudo hire nadhem":
        newLogs.push({ type: "info", content: "[sudo] password for recruiter: ••••••••" });
        setTimeout(() => {
          setLogs(prev => [...prev, 
            { type: "success", content: "✔ Access granted." },
            { type: "info", content: "Initiating offer sequence..." },
            { type: "output", content: (
              <div className="p-4 border-2 border-neon-primary bg-neon-primary/5 rounded mt-2 animate-pulse">
                <div className="text-neon-primary font-black tracking-[0.5em] text-center text-lg">
                  STATUS: CANDIDATE_ACQUIRED
                </div>
                <div className="text-[10px] text-os-text/60 text-center mt-2 font-bold">
                    PREPARING_ONBOARDING_PROTOCOL_X9...
                </div>
              </div>
            )}
          ]);
        }, 800);
        break;
      case "exit":
        newLogs.push({ type: "error", content: "SYS_ERR: SESSION TERMINATION REQUIRES ROOT PRIVILEGES." });
        break;
      case "":
        break;
      default:
        newLogs.push({ type: "error", content: `ERR: COMMAND NOT RECOGNIZED: ${trimmedCmd}` });
    }

    setLogs(newLogs);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) handleCommand(input);
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full font-mono text-sm p-6 bg-os-bg/40 overflow-hidden crt-overlay"
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-neon-primary/20 scrollbar-track-transparent pr-2"
      >
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={
                log.type === "command" ? "text-neon-primary" : 
                log.type === "error" ? "text-red-400" : 
                log.type === "info" ? "text-blue-400" : 
                log.type === "success" ? "text-neon-secondary" :
                "text-os-text/90"
              }
            >
              {log.type === "command" ? (
                <span className="flex items-center gap-2 font-bold mb-1">
                  <span className="text-neon-primary opacity-50">λ</span>
                  {log.content}
                </span>
              ) : (
                <div className="pl-4 whitespace-pre-wrap leading-relaxed text-[13px]">
                  {log.type === "success" && <CheckCircle2 size={12} className="inline mr-2 mb-1" />}
                  {log.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-os-border/50 pt-4 bg-os-bg/60">
        <span className="text-neon-primary font-bold flex items-center gap-1">
          <ChevronRight size={16} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-os-text caret-neon-primary placeholder:text-os-text/10"
          placeholder="EXE_COMMAND..."
          autoFocus
        />
        <div className="flex items-center gap-6 text-[11px] font-black text-os-text/20 tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-primary animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.4)]" />
            <span>ONLINE</span>
          </div>
          <div className="flex items-center gap-1">
            <span>BASH@NADHEM-OS-X9</span>
          </div>
        </div>
      </form>
    </div>
  );
}
