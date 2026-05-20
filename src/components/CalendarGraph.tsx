"use client";

import React, { useEffect, useState } from "react";
import { format, subDays, eachDayOfInterval, startOfToday } from "date-fns";
import { motion } from "framer-motion";

interface CalendarData {
  [key: string]: {
    mood: string | null;
    title: string | null;
    habitsCompleted: number;
    totalHabits: number;
  };
}

export function CalendarGraph() {
  const [data, setData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalendarData() {
      try {
        const response = await fetch("/api/entries/calendar?days=70");
        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendarData();
  }, []);

  const today = startOfToday();
  const days = eachDayOfInterval({
    start: subDays(today, 69),
    end: today,
  });

  const getMoodColor = (mood: string | null) => {
    if (!mood) return "bg-gray-100 dark:bg-gray-800";
    
    const moodMap: Record<string, string> = {
      'Great': 'bg-mood-excellent',
      'Excellent': 'bg-mood-excellent',
      'Good': 'bg-mood-good',
      'Happy': 'bg-mood-good',
      'Neutral': 'bg-mood-neutral',
      'Calm': 'bg-mood-neutral',
      'Sad': 'bg-mood-fair',
      'Tired': 'bg-mood-fair',
      'Fair': 'bg-mood-fair',
      'Poor': 'bg-mood-poor',
      'Frustrated': 'bg-mood-poor',
      'Angry': 'bg-mood-poor',
    };
    
    return moodMap[mood] || "bg-mood-neutral";
  };

  if (loading) {
    return (
      <div className="w-full h-32 bg-surface rounded-2xl border border-border animate-pulse flex items-center justify-center">
        <span className="text-text-muted text-sm">Loading your year in review...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex flex-wrap gap-1.5 min-w-[300px]">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayData = data[dateKey];
          const hasData = !!dayData;
          
          return (
            <motion.div
              key={dateKey}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`w-3.5 h-3.5 rounded-sm sm:w-4 sm:h-4 ${getMoodColor(dayData?.mood || null)} relative group cursor-pointer hover:ring-2 hover:ring-brand/50 transition-all`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl">
                  {format(day, "MMM d, yyyy")}
                  {dayData?.mood && ` • ${dayData.mood}`}
                  {dayData?.habitsCompleted !== undefined && ` • ${dayData.habitsCompleted}/${dayData.totalHabits} Habits`}
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              {/* Habit ring indicator (very small dot if habits completed) */}
              {dayData && dayData.habitsCompleted > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-text-subtle font-medium uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-3 h-3 rounded-sm bg-mood-poor"></div>
            <div className="w-3 h-3 rounded-sm bg-mood-fair"></div>
            <div className="w-3 h-3 rounded-sm bg-mood-neutral"></div>
            <div className="w-3 h-3 rounded-sm bg-mood-good"></div>
            <div className="w-3 h-3 rounded-sm bg-mood-excellent"></div>
          </div>
          <span>More Happy</span>
        </div>
        <span>Last 70 Days</span>
      </div>
    </div>
  );
}
