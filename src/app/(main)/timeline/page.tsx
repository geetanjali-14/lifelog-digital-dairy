"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Search, Filter, Plus, Calendar } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { HoverLift } from "@/components/motion/HoverLift";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: string;
  entryDate: string;
  entryTags: { tag: { name: string } }[];
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>}>
      <TimelineContent />
    </Suspense>
  );
}

function TimelineContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries");
        const data = await response.json();
        if (response.ok) {
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredEntries = entries.filter(entry => 
    (entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     entry.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-6xl lg:mx-auto">
      {/* Header */}
      <FadeIn className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Your Timeline</h1>
          <p className="text-gray-500 text-base">A journey through your memories.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <Link href="/entry/new" className="p-2 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors shadow-md shadow-brand/20">
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No entries found</h3>
          <p className="text-gray-500 text-sm mb-6">Start your journey by creating your first entry.</p>
          <Link href="/entry/new" className="inline-flex items-center px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Link>
        </div>
      ) : (
        <StaggeredList className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-4 lg:left-8 top-2 bottom-2 w-0.5 bg-gray-100 hidden sm:block"></div>
          
          {filteredEntries.map((entry) => (
            <StaggeredItem key={entry.id} className="relative sm:pl-12 lg:pl-20">
              {/* Dot on line */}
              <div className="absolute left-[13px] lg:left-[29px] top-6 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white shadow-sm hidden sm:block z-10"></div>
              
              <HoverLift>
                <Link href={`/entry/${entry.id}`} className="block bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-brand/30 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(entry.entryDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">
                        {entry.title || "Untitled Entry"}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full tracking-wider uppercase">
                          {entry.mood}
                        </span>
                        {entry.entryTags.map((et) => (
                          <span key={et.tag.name} className="px-2.5 py-1 bg-brand-light/50 text-brand text-[10px] font-bold rounded-full tracking-wider uppercase">
                            {et.tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-3xl bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center self-start sm:self-auto shrink-0">
                      {getMoodEmoji(entry.mood)}
                    </div>
                  </div>
                </Link>
              </HoverLift>
            </StaggeredItem>
          ))}
        </StaggeredList>
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
