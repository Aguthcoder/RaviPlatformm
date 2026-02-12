"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Bell, Gamepad2, UserRound, MessageCircle } from "lucide-react";

export default function GlobalBottomNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/test") return null;

  const navItems = [
    { href: "/events", label: "رزرو", icon: CalendarDays },
    { href: "/chat", label: "چت", icon: MessageCircle },
    { href: "/dashboard", label: "اعلان‌ها", icon: Bell },
    { href: "/games", label: "بازی", icon: Gamepad2 },
    { href: "/dashboard/profile", label: "پروفایل", icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${active ? "text-orange-500" : "text-slate-500"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
