import Link from "next/link";
import { ChevronLeft, MoreHorizontal, Calendar, Smile, Sparkles, Heart, Wallet, Image as ImageIcon, Edit3, Trash2, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import Image from "next/image";

export default function DiaryEntryPage() {
  return (
    <div className="flex flex-col min-h-full pb-8 px-4 pt-6 overflow-y-auto w-full relative lg:px-8 lg:pt-10 lg:max-w-5xl lg:mx-auto">
      {/* Mobile Top App Bar — hidden on desktop */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <span className="font-bold text-gray-900 text-lg">Diary Entry</span>
        <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Desktop Back Link — hidden on mobile */}
      <FadeIn className="hidden lg:flex items-center space-x-3 mb-8">
        <Link href="/dashboard" className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </FadeIn>

      {/* Desktop two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        {/* Left: Main content */}
        <div>
          {/* Hero Image */}
          <FadeIn>
            <div className="w-full h-56 lg:h-80 rounded-3xl lg:rounded-[24px] overflow-hidden mb-6 shadow-md transition-transform duration-500 hover:scale-[1.01] relative">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Sunset at the ocean"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </FadeIn>

          {/* Meta Labels */}
          <FadeIn delay={0.1}>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-brand-light text-brand text-[10px] uppercase font-bold tracking-widest rounded-md">
                TRAVEL
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wide">• 12 min read</span>
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.15}>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              A Calm Evening at the Coast
            </h1>
          </FadeIn>

          {/* Meta Date & Mood — mobile only (desktop shows in sidebar) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-sm font-medium text-gray-600 lg:hidden">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>October 24, 2023</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">😌</span>
              <span>Feeling Peaceful</span>
            </div>
          </div>

          {/* Main Content */}
          <FadeIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed text-[15px] lg:text-base mb-10 lg:leading-7">
              <p>
                Today was exactly what I needed. I left the city early in the afternoon and drove until the tall buildings were replaced by the rhythmic sound of waves crashing against the cliffs.
              </p>
              <p>
                The air was crisp and smelled of salt. I spent nearly three hours just walking along the shoreline, watching the tide slowly pull back to reveal hidden rock pools. There&apos;s something deeply grounding about the ocean&apos;s vastness that makes everyday worries feel so much smaller.
              </p>
            </div>
          </FadeIn>

          {/* Highlight Card */}
          <FadeIn delay={0.25}>
            <div className="bg-brand-light/40 rounded-[20px] p-6 mb-4 relative overflow-hidden border border-brand/5">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand"></div>
              <div className="flex items-center space-x-2 text-brand mb-3 font-bold tracking-widest text-[10px]">
                <Sparkles className="w-4 h-4" />
                <span>THE HIGHLIGHT</span>
              </div>
              <p className="italic text-gray-800 font-medium leading-relaxed">
                &ldquo;Watching the sunset paint the sky in hues of violet and burnt orange while the first stars appeared.&rdquo;
              </p>
            </div>
          </FadeIn>

          {/* Gratitude Card */}
          <FadeIn delay={0.3}>
            <div className="bg-emerald-50/70 rounded-[20px] p-6 mb-8 border border-emerald-100/50 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400"></div>
              <div className="flex items-center space-x-2 text-emerald-600 mb-3 font-bold tracking-widest text-[10px]">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>GRATITUDE</span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                I am thankful for the reliable car that gets me to these places and the quiet moments of solitude.
              </p>
            </div>
          </FadeIn>

          {/* Spent Block — mobile only (desktop shows in sidebar) */}
          <div className="bg-gray-50 rounded-[20px] p-5 mb-8 flex items-center justify-between border border-gray-100 lg:hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider">TOTAL SPENT</div>
                <div className="text-xl font-bold text-gray-900">$42.50</div>
              </div>
            </div>
            <button className="text-xs font-semibold text-brand flex items-center space-x-1 hover:underline">
              <span>Details</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Gallery Section */}
          <FadeIn delay={0.35}>
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Gallery</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm relative">
                  <Image
                    src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=500&q=80"
                    alt="Beach 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm relative">
                  <Image
                    src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=500&q=80"
                    alt="Beach shells"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Tags Chips — mobile only (desktop shows in sidebar) */}
          <div className="flex flex-wrap gap-2 mb-10 lg:hidden">
            <span className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">#nature</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">#mentalhealth</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">#solo-trip</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">#sunset</span>
          </div>

          {/* Bottom Actions */}
          <FadeIn delay={0.4}>
            <div className="flex space-x-3 mb-10">
              <button className="flex-1 bg-brand hover:bg-brand-dark text-white rounded-2xl py-4 flex items-center justify-center space-x-2 font-semibold shadow-md shadow-brand/20 transition-all active:scale-[0.98]">
                <Edit3 className="w-5 h-5" />
                <span>Edit Entry</span>
              </button>
              <button className="w-16 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl flex items-center justify-center transition-colors active:scale-95">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Desktop metadata sidebar */}
        <FadeIn delay={0.2} direction="right" className="hidden lg:block">
          <div className="sticky top-10 space-y-5">
            {/* Date & Mood Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">DETAILS</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-900">October 24, 2023</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-lg">😌</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Mood</p>
                    <p className="text-sm font-semibold text-gray-900">Feeling Peaceful</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider">SPENDING</h3>
                <button className="text-xs font-semibold text-brand hover:underline">Details</button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">$42.50</span>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">#nature</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">#mentalhealth</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">#solo-trip</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">#sunset</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
