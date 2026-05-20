"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, BarChart3, User, CreditCard } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Entries", href: "/timeline", icon: Book },
  { name: "Money", href: "/transactions", icon: CreditCard },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] h-16 bg-white border-t border-gray-200 safe-area-bottom pb-env px-2">
      <div className="flex justify-between items-center w-full h-full">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "inline-flex flex-col items-center justify-center px-4 w-full h-full group transition-colors duration-200",
                isActive ? "text-brand" : "text-gray-400 hover:text-gray-500"
              )}
            >
              <IconComponent
                className={clsx(
                  "w-6 h-6 mb-1 transition-transform group-hover:scale-110",
                  isActive ? "fill-brand/20" : ""
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
