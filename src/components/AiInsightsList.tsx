"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

export function AiInsightsList() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch("/api/ai/insights");
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights || []);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const removeInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  if (loading) return null;
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-brand/5 border border-brand/10 rounded-2xl p-4 relative overflow-hidden group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-brand" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 flex items-center gap-1">
                  AI Life Insight
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {insight.content}
                </p>
              </div>
              <button 
                onClick={() => removeInsight(insight.id)}
                className="text-text-subtle hover:text-foreground p-1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand/5 rounded-full blur-2xl"></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
