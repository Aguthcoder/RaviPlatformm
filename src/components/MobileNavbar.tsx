"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Gamepad2, Bell, CalendarDays } from "lucide-react";

export default function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { icon: User, label: "پروفایل", href: "/dashboard/profile" },
    { icon: Gamepad2, label: "بازی‌ها", href: "/games" },
    { icon: Bell, label: "اعلان‌ها", href: "/notifications" },
    { icon: CalendarDays, label: "رزرو", href: "/events" },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-[#0B1F3A] text-slate-300 rounded-2xl border border-[#12345f] flex justify-between items-center px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? "text-[#FF7A00] -translate-y-1" : "hover:text-white"
                }`}
              >
                <item.icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
