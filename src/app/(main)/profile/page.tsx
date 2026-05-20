"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronLeft, Settings, Edit3, Banknote, User, Lock, Bell, ChevronRight, LogOut, Palette } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { HoverLift } from "@/components/motion/HoverLift";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

interface Stats {
  totalEntries: number;
  totalExpenses: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalEntries: data.totalEntries,
            totalExpenses: data.totalExpenses
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
    fetchStats();
  }, []);

  const userEmail = session?.user?.email || "user@lifelog.app";
  const userName = session?.user?.name || "LifeLog User";

  return (
    <div className="flex flex-col min-h-full pb-6 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-5xl lg:mx-auto">
      {/* Mobile Top App Bar — hidden on desktop */}
      <div className="flex justify-between items-center mb-10 h-8 lg:hidden">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <span className="font-bold text-gray-900 text-lg">Profile</span>
        <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Desktop Header — hidden on mobile */}
      <FadeIn className="hidden lg:flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </FadeIn>

      {/* Two-column layout on desktop */}
      <div className="lg:flex lg:gap-10">
        {/* Left column: User card */}
        <FadeIn className="lg:w-[340px] lg:shrink-0 lg:sticky lg:top-10 lg:self-start">
          {/* Card wrapper for desktop */}
          <div className="lg:bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm lg:p-8">
            {/* User Info Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-brand/10 flex items-center justify-center p-1.5 ring-4 ring-white shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">{userName}</h1>
              <p className="text-brand text-sm font-medium mb-2">{userEmail}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-10 lg:mb-0">
              <HoverLift>
                <div className="bg-white lg:bg-gray-50/80 rounded-[24px] p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 lg:border-gray-200/50 h-full">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <Edit3 className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalEntries || 0}</span>
                  <span className="text-[10px] font-bold tracking-wider text-gray-500 text-center uppercase">Total Entries</span>
                </div>
              </HoverLift>

              <HoverLift>
                <div className="bg-white lg:bg-gray-50/80 rounded-[24px] p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 lg:border-gray-200/50 h-full">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Banknote className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 mb-1">${stats?.totalExpenses?.toLocaleString() || 0}</span>
                  <span className="text-[10px] font-bold tracking-wider text-gray-500 text-center uppercase">Lifetime Spend</span>
                </div>
              </HoverLift>
            </div>
          </div>
        </FadeIn>

        {/* Right column: Settings */}
        <FadeIn delay={0.15} className="flex-1 lg:min-w-0">
          {/* Personalization */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand" />
              Personalization
            </h2>
            <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900 block">App Theme</span>
                <span className="text-xs text-gray-400 mt-0.5">Switch between light, dark, and system themes</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Settings List */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Account Settings</h2>

            <StaggeredList className="space-y-3 px-1 lg:px-0">
              <StaggeredItem>
                <SettingsLink
                  icon={<User className="w-5 h-5" />}
                  title="Edit Profile"
                  description="Update your name, bio, and avatar"
                  bgColor="bg-brand text-white"
                />
              </StaggeredItem>
              <StaggeredItem>
                <SettingsLink
                  icon={<Lock className="w-5 h-5" />}
                  title="Change Password"
                  description="Update your security credentials"
                  bgColor="bg-gray-200 text-gray-600"
                />
              </StaggeredItem>
              <StaggeredItem>
                <SettingsLink
                  icon={<Bell className="w-5 h-5" />}
                  title="Notifications"
                  description="Manage alerts and reminders"
                  bgColor="bg-gray-200 text-gray-600"
                />
              </StaggeredItem>
            </StaggeredList>
          </div>

          {/* Sign Out Button */}
          <div className="mt-8 mb-4 flex justify-center lg:justify-start lg:px-1">
            <button 
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center space-x-2 text-red-500 font-semibold hover:bg-red-50 px-6 py-3 rounded-full transition-colors active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// Subcomponents

function SettingsLink({
  icon,
  title,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  bgColor: string;
}) {
  return (
    <HoverLift>
      <button className="w-full bg-white rounded-2xl p-4 lg:p-5 flex items-center justify-between shadow-sm border border-gray-100/50 hover:border-gray-200 transition-colors active:scale-[0.98]">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}>
            {icon}
          </div>
          <div className="text-left">
            <span className="font-semibold text-gray-900 block">{title}</span>
            {description && (
              <span className="text-xs text-gray-400 hidden lg:block mt-0.5">{description}</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </HoverLift>
  );
}
