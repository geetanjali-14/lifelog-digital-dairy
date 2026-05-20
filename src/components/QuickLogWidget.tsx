"use client";

import React, { useState } from "react";
import { Smile, DollarSign, Flame, Check, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function QuickLogWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initial" | "mood" | "expense" | "habit">("initial");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logMood = async (mood: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Quick log: I'm feeling ${mood}`,
          mood,
          entryDate: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setStep("initial");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Quick log failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const moods = [
    { label: "Great", emoji: "🤩" },
    { label: "Good", emoji: "😊" },
    { label: "Neutral", emoji: "😐" },
    { label: "Sad", emoji: "😔" },
    { label: "Tired", emoji: "😫" },
  ];

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setStep("initial");
              }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed bottom-24 right-5 left-5 md:left-auto md:right-10 md:w-80 bg-surface border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden p-6"
            >
              {step === "initial" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Quick Log</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setStep("mood")}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
                    >
                      <Smile size={24} />
                      <span className="text-xs font-bold">MOOD</span>
                    </button>
                    <button
                      onClick={() => router.push("/transactions")}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                      <DollarSign size={24} />
                      <span className="text-xs font-bold">MONEY</span>
                    </button>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                    >
                      <Flame size={24} />
                      <span className="text-xs font-bold">HABIT</span>
                    </button>
                  </div>
                </div>
              )}

              {step === "mood" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">How are you?</h3>
                    <button onClick={() => setStep("initial")} className="text-text-subtle p-1">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        disabled={loading}
                        onClick={() => logMood(m.label)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-surface-hover transition-colors"
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-[10px] font-medium text-text-muted">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-[102] relative ${
          isOpen ? "bg-surface text-foreground rotate-45" : "bg-brand text-white"
        }`}
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
