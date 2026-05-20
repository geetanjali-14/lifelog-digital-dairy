"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, DollarSign, Smile, Flame, Search, Calendar, Target } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { HoverLift } from "@/components/motion/HoverLift";
import { CalendarGraph } from "@/components/CalendarGraph";
import { QuickLogWidget } from "@/components/QuickLogWidget";
import { AiInsightsList } from "@/components/AiInsightsList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Stats {
  totalEntries: number;
  totalExpenses: number;
  topMood: string;
  streak: number;
  level: number;
  xp: number;
}

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: string;
  entryDate: string;
  isPrivate: boolean;
  entryTags: { tag: { name: string } }[];
}

interface Habit {
  id: string;
  name: string;
  habitLogs?: { isCompleted: boolean }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, entriesRes, habitsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/entries?limit=3"),
          fetch("/api/habits")
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (entriesRes.ok) setEntries(await entriesRes.json());
        if (habitsRes.ok) setHabits(await habitsRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleHabit = async (habitId: string, completed: boolean) => {
    try {
      const response = await fetch("/api/habits/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, completed }),
      });
      if (response.ok) {
        setHabits(habits.map(h => 
          h.id === habitId ? { ...h, habitLogs: completed ? [{ isCompleted: true }] : [] } : h
        ));
      }
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/timeline?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userName = session?.user?.name || "there";

  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-6xl lg:mx-auto">
      {/* Mobile Top App Bar — hidden on desktop */}
      <div className="flex justify-between items-center mb-8 lg:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-foreground text-lg">LifeLog</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/entry/new" className="w-8 h-8 bg-brand-light text-brand rounded-full flex items-center justify-center hover:bg-brand/20 transition-colors">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </Link>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden border border-orange-200 relative">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="User" fill className="object-cover" />
            ) : (
              <UserAvatarPlaceholder />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header — hidden on mobile */}
      <FadeIn className="hidden lg:flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Good Evening, {userName}
          </h1>
          <p className="text-text-muted text-base">Ready to log your day?</p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all w-64"
          />
        </form>
      </FadeIn>

      {/* Mobile Greeting — hidden on desktop */}
      <div className="mb-6 lg:hidden">
        <h1 className="text-[28px] leading-tight font-bold text-foreground mb-1">
          Good Evening, {userName}
        </h1>
        <p className="text-text-muted text-sm">Ready to log your day?</p>
      </div>

      {/* Journey Section (Calendar Graph) */}
      <FadeIn delay={0.1} className="mb-8 lg:mb-10">
        <AiInsightsList />
        <div className="flex justify-between items-center mb-4 px-1 mt-6">
          <h2 className="text-lg lg:text-xl font-bold text-foreground flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-brand" />
            Your Journey
          </h2>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-4 lg:p-6 shadow-sm">
          <CalendarGraph />
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-8 lg:mb-10">
        <StaggeredItem>
          <HoverLift className="bg-brand text-white rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32 shadow-lg shadow-brand/20">
            <div className="flex items-center space-x-2 text-white/80 font-bold text-[10px] tracking-widest">
              <Target className="w-4 h-4" />
              <span>LEVEL {stats?.level || 1}</span>
            </div>
            <div className="text-2xl lg:text-3xl font-black">{stats?.xp || 0} XP</div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-surface border border-border rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-500 font-bold text-[10px] tracking-widest">
              <DollarSign className="w-4 h-4" />
              <span>SPENT</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-foreground">${stats?.totalExpenses?.toLocaleString() || 0}</div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-surface border border-border rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32 shadow-sm">
            <div className="flex items-center space-x-2 text-purple-500 font-bold text-[10px] tracking-widest">
              <Smile className="w-4 h-4" />
              <span>MOOD</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getMoodEmoji(stats?.topMood || "Neutral")}</span>
              <span className="text-base font-bold text-text-muted">{stats?.topMood || "Neutral"}</span>
            </div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-surface border border-border rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-500 font-bold text-[10px] tracking-widest">
              <Flame className="w-4 h-4" />
              <span>STREAK</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-foreground">{stats?.streak || 0} Days</div>
          </HoverLift>
        </StaggeredItem>
      </StaggeredList>

      {/* Habits Section */}
      <FadeIn delay={0.15} className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg lg:text-xl font-bold text-foreground flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Daily Habits
          </h2>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-4 lg:p-6 shadow-sm overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-2">
            {habits.length === 0 ? (
              <p className="text-text-subtle text-sm">No habits defined. Add some in your profile!</p>
            ) : (
              habits.map((habit) => {
                const isCompleted = habit.habitLogs && habit.habitLogs.length > 0 && habit.habitLogs[0].isCompleted;
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id, !isCompleted)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-w-[100px] h-28 ${
                      isCompleted
                        ? "border-brand bg-brand-light/20"
                        : "border-border bg-surface-hover hover:border-text-subtle"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? "bg-brand text-white" : "bg-border text-text-subtle"
                    }`}>
                      {isCompleted ? <Plus className="w-6 h-6 rotate-45" /> : <Plus className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-bold ${isCompleted ? "text-brand" : "text-text-muted"}`}>
                      {habit.name.toUpperCase()}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </FadeIn>

      {/* Recent Entries Header */}
      <FadeIn delay={0.2} className="flex justify-between items-center mb-4 lg:mb-6 px-1">
        <h2 className="text-lg lg:text-xl font-bold text-foreground">Recent Entries</h2>
        <Link href="/timeline" className="text-sm font-semibold text-brand hover:underline">
          View All
        </Link>
      </FadeIn>

      {/* Entries List — stacked on mobile, grid on desktop */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-surface rounded-2xl border border-border animate-pulse"></div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-8 text-center">
          <p className="text-text-muted mb-4">No entries yet. Start logging your journey!</p>
          <Link href="/entry/new" className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-xl font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Link>
        </div>
      ) : (
        <StaggeredList
          className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-5"
          staggerDelay={0.1}
        >
          {entries.map(entry => (
            <StaggeredItem key={entry.id}>
              <EntryCard
                id={entry.id}
                date={new Date(entry.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                title={entry.isPrivate ? "Private Entry" : (entry.title || "Untitled Entry")}
                emoji={entry.isPrivate ? "🔒" : getMoodEmoji(entry.mood)}
                preview={entry.isPrivate ? "This entry is locked in your secret vault." : entry.content}
                tags={entry.isPrivate ? [] : entry.entryTags.map(et => et.tag.name)}
                isPrivate={entry.isPrivate}
              />
            </StaggeredItem>
          ))}
        </StaggeredList>
      )}

      {/* Floating Action Button — mobile only */}
      <div className="fixed bottom-24 right-5 z-[60] lg:hidden">
        <QuickLogWidget />
      </div>
    </div>
  );
}

function getMoodEmoji(mood: string) {
  const moodMap: Record<string, string> = {
    'Great': '😀',
    'Good': '🙂',
    'Neutral': '😐',
    'Sad': '😔',
    'Frustrated': '😡',
    'Happy': '😊',
    'Excited': '🤩',
    'Tired': '😫',
    'Calm': '😌'
  };
  return moodMap[mood] || '😶';
}

interface EntryCardProps {
  id: string;
  date: string;
  title: string;
  emoji: string;
  preview: string;
  tags: string[];
  isPrivate?: boolean;
}

// Subcomponents

function EntryCard({ id, date, title, emoji, preview, tags, isPrivate }: EntryCardProps) {
  return (
    <HoverLift>
      <div className={`bg-surface p-4 lg:p-5 rounded-2xl border border-border shadow-sm flex flex-col relative overflow-hidden h-full lg:hover:border-text-subtle transition-all duration-200 ${
        isPrivate ? "opacity-75" : ""
      }`}>
        <div className="absolute top-4 right-4 text-2xl">{emoji}</div>
        <div className="text-xs text-text-subtle font-medium mb-1">{date}</div>
        <h3 className="text-base font-bold text-foreground mb-2 pr-8">{title}</h3>
        <p className={`text-sm text-text-muted line-clamp-2 leading-relaxed mb-4 ${isPrivate ? "italic" : ""}`}>{preview}</p>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2.5 py-1 bg-brand-light/50 text-brand text-[10px] font-bold rounded-full tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/entry/${id}`}
            className="px-4 py-1.5 bg-brand-light text-brand text-xs font-semibold rounded-full hover:bg-brand hover:text-white transition-colors"
          >
            {isPrivate ? "Unlock" : "View"}
          </Link>
        </div>
      </div>
    </HoverLift>
  );
}

function UserAvatarPlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#FDBA74" />
      <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.5 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="#FDBA74" />
    </svg>
  );
}
