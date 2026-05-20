"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Smile, Flame, Target, Award } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { HoverLift } from "@/components/motion/HoverLift";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

interface Stats {
  totalEntries: number;
  totalExpenses: number;
  topMood: string;
  streak: number;
  level: number;
  xp: number;
}

interface TrendData {
  date: string;
  mood: number | null;
  expense: number;
}

interface DistributionData {
  name: string;
  value: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [distribution, setDistribution] = useState<DistributionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch(`/api/stats/trends?days=${days}`)
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (trendsRes.ok) {
          const trendData = await trendsRes.json();
          setTrends(trendData.trends);
          setDistribution(trendData.distribution);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [days]);

  const COLORS = ['#5A52FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-6xl lg:mx-auto">
      {/* Header */}
      <FadeIn className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Life Analytics</h1>
          <p className="text-text-muted text-base">Visualize your progress and emotional patterns.</p>
        </div>
        <div className="flex bg-surface border border-border rounded-xl p-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                days === d ? "bg-brand text-white shadow-sm" : "text-text-muted hover:text-foreground"
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn className="bg-brand text-white p-6 rounded-3xl shadow-lg shadow-brand/20 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <Target size={14} /> Current Level
                </div>
                <div className="text-4xl font-black">Level {stats?.level || 1}</div>
                <div className="text-white/80 text-sm font-medium">{stats?.xp || 0} Total XP Earned</div>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                <Award size={40} className="text-white" />
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="bg-surface border border-border p-6 rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-text-subtle text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                   <Flame size={14} className="text-orange-500" /> Current Streak
                </div>
                <div className="text-4xl font-black text-foreground">{stats?.streak || 0} Days</div>
                <div className="text-text-muted text-sm font-medium">Keep it going!</div>
              </div>
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center border-4 border-orange-100 dark:border-orange-500/20">
                 <Flame size={40} className="text-orange-500" />
              </div>
            </FadeIn>
          </div>

          {/* Main Stats Grid */}
          <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggeredItem>
              <HoverLift className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[10px] font-bold text-text-subtle mb-1 uppercase tracking-wider">Total Entries</div>
                <div className="text-2xl font-bold text-foreground">{stats?.totalEntries || 0}</div>
              </HoverLift>
            </StaggeredItem>

            <StaggeredItem>
              <HoverLift className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[10px] font-bold text-text-subtle mb-1 uppercase tracking-wider">Lifetime Spend</div>
                <div className="text-2xl font-bold text-foreground">${stats?.totalExpenses?.toLocaleString() || 0}</div>
              </HoverLift>
            </StaggeredItem>

            <StaggeredItem>
              <HoverLift className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[10px] font-bold text-text-subtle mb-1 uppercase tracking-wider">Top Mood</div>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                   {stats?.topMood || 'Neutral'}
                   <span>{getMoodEmoji(stats?.topMood || 'Neutral')}</span>
                </div>
              </HoverLift>
            </StaggeredItem>

            <StaggeredItem>
              <HoverLift className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[10px] font-bold text-text-subtle mb-1 uppercase tracking-wider">Active Days</div>
                <div className="text-2xl font-bold text-foreground">{trends.filter(t => t.mood !== null).length} / {days}</div>
              </HoverLift>
            </StaggeredItem>
          </StaggeredList>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.2} className="bg-surface p-6 lg:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <TrendingUp className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-bold text-foreground">Mood Over Time</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5A52FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#5A52FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                    <YAxis hide domain={[1, 5]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="mood" stroke="#5A52FF" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="bg-surface p-6 lg:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-foreground">Spending Patterns</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart3 className="w-full h-full">
                    {/* Simplified for demo, can be actual BarChart */}
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={trends}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                         <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                         <YAxis hide />
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                         <Line type="stepAfter" dataKey="expense" stroke="#10B981" strokeWidth={2} dot={false} />
                       </LineChart>
                    </ResponsiveContainer>
                  </BarChart3>
                </ResponsiveContainer>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="bg-surface p-6 lg:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <Smile className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-foreground">Mood Distribution</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </FadeIn>
          </div>
        </div>
      )}
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
