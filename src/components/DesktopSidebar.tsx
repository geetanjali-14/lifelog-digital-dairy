"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, BarChart3, User, Plus, BookOpen, LogOut, CreditCard } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Entries", href: "/timeline", icon: Book },
  { name: "Money", href: "/transactions", icon: CreditCard },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-gray-100 z-40 px-4 py-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 px-3 mb-8">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-sm shadow-brand/20">
          <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-gray-900 text-xl tracking-tight">LifeLog</span>
      </div>

      {/* New Entry Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center space-x-2 w-full py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold shadow-md shadow-brand/20 transition-colors mb-8"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        <span>New Entry</span>
      </motion.button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-brand-light text-brand"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <IconComponent
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=FDBA74"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Alex Rivers</p>
            <p className="text-xs text-gray-400 truncate">alex@lifelog.app</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-300 hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
