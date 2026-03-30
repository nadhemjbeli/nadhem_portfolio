"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ChallengeQuestionProps {
  waitingForInput: boolean;
  feedback: "correct" | "incorrect" | null;
  expectedNode: [number, number] | null;
  questionText: string;
}

export default function ChallengeQuestion({
  waitingForInput,
  feedback,
  expectedNode,
  questionText,
}: ChallengeQuestionProps) {
  return (
    <AnimatePresence>
      {(waitingForInput || feedback) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-panel border rounded-xl px-5 py-4 font-mono w-full"
          style={{
            borderColor:
              feedback === "correct"
                ? "rgba(170,255,0,0.4)"
                : feedback === "incorrect"
                ? "rgba(255,68,68,0.4)"
                : "rgba(255,215,0,0.3)",
          }}
        >
          {waitingForInput && !feedback && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-[8px] font-black tracking-[0.4em] uppercase text-yellow-400/70">AWAITING_INPUT</span>
              </div>
              <p className="text-[12px] font-black text-yellow-400 uppercase tracking-wider">
                {questionText}
              </p>
              <p className="text-[10px] text-os-text/40">
                Click a cell to answer — frontier cells are highlighted in yellow
              </p>
            </div>
          )}

          {feedback === "correct" && (
            <div className="space-y-1">
              <p className="text-[12px] font-black text-neon-primary uppercase tracking-wider">
                ✓ CORRECT — CONTINUING EXECUTION...
              </p>
              <p className="text-[10px] text-os-text/40">+1 to score · streak continues</p>
            </div>
          )}

          {feedback === "incorrect" && expectedNode && (
            <div className="space-y-1">
              <p className="text-[12px] font-black text-red-400 uppercase tracking-wider">
                ✗ INCORRECT — EXPECTED NODE [{expectedNode[0]}, {expectedNode[1]}]
              </p>
              <p className="text-[10px] text-os-text/40">Streak reset · continuing execution</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
