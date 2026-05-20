"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal, Calendar, Sparkles, Heart, Wallet, Image as ImageIcon, Edit3, Trash2, Lock } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { PinLock } from "@/components/PinLock";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: string;
  entryDate: string;
  isPrivate: boolean;
  gratitude: string | null;
  highlight: string | null;
  expense: number | null;
  entryTags: { tag: { name: string } }[];
}

export default function DiaryEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const response = await fetch(`/api/entries/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEntry(data);
          if (!data.isPrivate) {
            setIsUnlocked(true);
          }
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch entry:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntry();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/timeline");
      } else {
        alert("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!entry) return null;

  if (entry.isPrivate && !isUnlocked) {
    return (
      <PinLock 
        onSuccess={() => setIsUnlocked(true)} 
        onCancel={() => router.push("/dashboard")} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-8 px-4 pt-6 overflow-y-auto w-full relative lg:px-8 lg:pt-10 lg:max-w-5xl lg:mx-auto">
      {/* Mobile Top App Bar — hidden on desktop */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <Link href="/timeline" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </Link>
        <span className="font-bold text-foreground text-lg">Diary Entry</span>
        <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Desktop Back Link — hidden on mobile */}
      <FadeIn className="hidden lg:flex items-center space-x-3 mb-8">
        <Link href="/timeline" className="flex items-center space-x-2 text-text-muted hover:text-foreground transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Timeline</span>
        </Link>
      </FadeIn>

      {/* Desktop two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        {/* Left: Main content */}
        <div>
          {/* Hero Image - Placeholder for now since we don't have real upload yet */}
          <FadeIn>
            <div className="w-full h-56 lg:h-80 rounded-3xl lg:rounded-[24px] overflow-hidden mb-6 shadow-md transition-transform duration-500 hover:scale-[1.01] relative bg-surface-hover flex items-center justify-center">
               <ImageIcon className="w-12 h-12 text-text-subtle" />
            </div>
          </FadeIn>

          {/* Meta Labels */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-brand-light text-brand text-[10px] uppercase font-bold tracking-widest rounded-md">
                {entry.mood.toUpperCase()}
              </span>
              {entry.entryTags.map(et => (
                <span key={et.tag.name} className="px-3 py-1 bg-surface border border-border text-text-muted text-[10px] uppercase font-bold tracking-widest rounded-md">
                  {et.tag.name.toUpperCase()}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.15}>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4 leading-tight tracking-tight flex items-center gap-3">
              {entry.title || "Untitled Entry"}
              {entry.isPrivate && <Lock className="w-6 h-6 text-amber-500" />}
            </h1>
          </FadeIn>

          {/* Meta Date & Mood — mobile only (desktop shows in sidebar) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm font-medium text-text-muted lg:hidden">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-text-subtle" />
              <span>{new Date(entry.entryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
              <span>Feeling {entry.mood}</span>
            </div>
          </div>

          {/* Main Content */}
          <FadeIn delay={0.2}>
            <div className="space-y-6 text-foreground leading-relaxed text-[15px] lg:text-base mb-10 lg:leading-7 whitespace-pre-wrap">
              {entry.content}
            </div>
          </FadeIn>

          {/* Highlight Card */}
          {entry.highlight && (
            <FadeIn delay={0.25}>
              <div className="bg-brand-light/40 rounded-[20px] p-6 mb-4 relative overflow-hidden border border-brand/5">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand"></div>
                <div className="flex items-center space-x-2 text-brand mb-3 font-bold tracking-widest text-[10px]">
                  <Sparkles className="w-4 h-4" />
                  <span>THE HIGHLIGHT</span>
                </div>
                <p className="italic text-foreground font-medium leading-relaxed">
                  &ldquo;{entry.highlight}&rdquo;
                </p>
              </div>
            </FadeIn>
          )}

          {/* Gratitude Card */}
          {entry.gratitude && (
            <FadeIn delay={0.3}>
              <div className="bg-emerald-50/70 dark:bg-emerald-500/10 rounded-[20px] p-6 mb-8 border border-emerald-100/50 dark:border-emerald-500/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400"></div>
                <div className="flex items-center space-x-2 text-emerald-600 mb-3 font-bold tracking-widest text-[10px]">
                  <Heart className="w-4 h-4" fill="currentColor" />
                  <span>GRATITUDE</span>
                </div>
                <p className="text-foreground font-medium leading-relaxed">
                  {entry.gratitude}
                </p>
              </div>
            </FadeIn>
          )}

          {/* Spent Block — mobile only (desktop shows in sidebar) */}
          {entry.expense !== null && (
            <div className="bg-surface border border-border rounded-[20px] p-5 mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-subtle tracking-wider">TOTAL SPENT</div>
                  <div className="text-xl font-bold text-foreground">${Number(entry.expense).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <FadeIn delay={0.4}>
            <div className="flex space-x-3 mb-10">
              <button className="flex-1 bg-brand hover:bg-brand-dark text-white rounded-2xl py-4 flex items-center justify-center space-x-2 font-semibold shadow-md shadow-brand/20 transition-all active:scale-[0.98]">
                <Edit3 className="w-5 h-5" />
                <span>Edit Entry</span>
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-16 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-2xl flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div> : <Trash2 className="w-6 h-6" />}
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Desktop metadata sidebar */}
        <FadeIn delay={0.2} direction="right" className="hidden lg:block">
          <div className="sticky top-10 space-y-5">
            {/* Date & Mood Card */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
              <h3 className="text-xs font-bold text-text-subtle tracking-wider mb-4">DETAILS</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-surface-hover rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-xs text-text-subtle">Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(entry.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-surface-hover rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-subtle">Mood</p>
                    <p className="text-sm font-semibold text-foreground">Feeling {entry.mood}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Card */}
            {entry.expense !== null && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-text-subtle tracking-wider">SPENDING</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">${Number(entry.expense).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Tags Card */}
            {entry.entryTags.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
                <h3 className="text-xs font-bold text-text-subtle tracking-wider mb-4">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.entryTags.map(et => (
                    <span key={et.tag.name} className="px-3 py-1.5 bg-surface-hover text-text-muted text-xs font-medium rounded-full border border-border">#{et.tag.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
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
