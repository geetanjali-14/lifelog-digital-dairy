"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-full w-fit">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-colors ${
          theme === "light" ? "bg-brand text-white" : "text-text-muted hover:bg-surface-hover"
        }`}
        title="Light Mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-colors ${
          theme === "dark" ? "bg-brand text-white" : "text-text-muted hover:bg-surface-hover"
        }`}
        title="Dark Mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-colors ${
          theme === "system" ? "bg-brand text-white" : "text-text-muted hover:bg-surface-hover"
        }`}
        title="System Theme"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}
