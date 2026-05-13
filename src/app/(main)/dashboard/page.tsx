import Link from "next/link";
import { BookOpen, Plus, FileText, DollarSign, Smile, Flame, Search } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { HoverLift } from "@/components/motion/HoverLift";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-6xl lg:mx-auto">
      {/* Mobile Top App Bar — hidden on desktop */}
      <div className="flex justify-between items-center mb-8 lg:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 text-lg">LifeLog</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-8 h-8 bg-brand-light text-brand rounded-full flex items-center justify-center hover:bg-brand/20 transition-colors">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden border border-orange-200">
            <UserAvatarPlaceholder />
          </div>
        </div>
      </div>

      {/* Desktop Header — hidden on mobile */}
      <FadeIn className="hidden lg:flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Good Evening, Geetanjali
          </h1>
          <p className="text-gray-500 text-base">Ready to log your day?</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all w-64"
          />
        </div>
      </FadeIn>

      {/* Mobile Greeting — hidden on desktop */}
      <div className="mb-6 lg:hidden">
        <h1 className="text-[28px] leading-tight font-bold text-gray-900 mb-1">
          Good Evening, Geetanjali
        </h1>
        <p className="text-gray-500 text-sm">Ready to log your day?</p>
      </div>

      {/* Stats Grid */}
      <StaggeredList className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-8 lg:mb-10">
        <StaggeredItem>
          <HoverLift className="bg-brand-light/60 rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32">
            <div className="flex items-center space-x-2 text-brand font-semibold text-xs tracking-wider">
              <FileText className="w-4 h-4" />
              <span>TOTAL ENTRIES</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">128</div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-blue-50/80 rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32">
            <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>EXPENSES</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">$450</div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-purple-50/80 rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32">
            <div className="flex items-center space-x-2 text-purple-600 font-semibold text-xs tracking-wider">
              <Smile className="w-4 h-4" />
              <span>TOP MOOD</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">😊</span>
              <span className="text-base font-semibold text-gray-700">Joyful</span>
            </div>
          </HoverLift>
        </StaggeredItem>

        <StaggeredItem>
          <HoverLift className="bg-sky-50/80 rounded-2xl p-4 lg:p-5 flex flex-col justify-between h-28 lg:h-32">
            <div className="flex items-center space-x-2 text-sky-600 font-semibold text-xs tracking-wider">
              <Flame className="w-4 h-4" />
              <span>STREAK</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">12 Days</div>
          </HoverLift>
        </StaggeredItem>
      </StaggeredList>

      {/* Recent Entries Header */}
      <FadeIn delay={0.2} className="flex justify-between items-center mb-4 lg:mb-6 px-1">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Entries</h2>
        <Link href="/timeline" className="text-sm font-semibold text-brand hover:underline">
          View All
        </Link>
      </FadeIn>

      {/* Entries List — stacked on mobile, grid on desktop */}
      <StaggeredList
        className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-5"
        staggerDelay={0.1}
      >
        <StaggeredItem>
          <EntryCard
            id="1"
            date="Oct 24, 2023 • 08:45 PM"
            title="A Productive Tuesday"
            emoji="😊"
            preview="Finished the major project milestones today. Celebrated with some iced coffee and a walk in t..."
            tags={["WORK", "FITNESS"]}
          />
        </StaggeredItem>
        <StaggeredItem>
          <EntryCard
            id="2"
            date="Oct 23, 2023 • 07:15 PM"
            title="New Recipe Night"
            emoji="😋"
            preview="Tried making authentic Ramen at home. The broth took 6 hours but it was absolutely worth every..."
            tags={["COOKING", "HOBBIES"]}
          />
        </StaggeredItem>
        <StaggeredItem>
          <EntryCard
            id="3"
            date="Oct 22, 2023 • 11:30 PM"
            title="Late Night Thoughts"
            emoji="😌"
            preview="Reading a new philosophy book. It's making me reconsider how I manage my morning routine..."
            tags={["JOURNAL"]}
          />
        </StaggeredItem>
      </StaggeredList>

      {/* Floating Action Button — mobile only */}
      <div className="fixed bottom-24 right-5 z-[60] lg:hidden">
        <button className="w-14 h-14 bg-brand hover:bg-brand-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/30 transition-transform active:scale-95">
          <Plus className="w-8 h-8" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

interface EntryCardProps {
  id: string;
  date: string;
  title: string;
  emoji: string;
  preview: string;
  tags: string[];
}

// Subcomponents

function EntryCard({ id, date, title, emoji, preview, tags }: EntryCardProps) {
  return (
    <HoverLift>
      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden h-full lg:hover:border-gray-200 transition-all duration-200">
        <div className="absolute top-4 right-4 text-2xl">{emoji}</div>
        <div className="text-xs text-gray-400 font-medium mb-1">{date}</div>
        <h3 className="text-base font-bold text-gray-900 mb-2 pr-8">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">{preview}</p>

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
            View
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
      <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="#FDBA74" />
    </svg>
  );
}
