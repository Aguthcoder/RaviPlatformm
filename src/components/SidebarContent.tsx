"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Wallet, UserPlus, User, Gamepad2 } from "lucide-react";

export default function SidebarContent() {
  const pathname = usePathname();
  const menuItems = [
    { name: "داشبورد", icon: LayoutDashboard, path: "/dashboard" },
    { name: "همنشینی‌ها", icon: Compass, path: "/events" },
    { name: "بازی‌ها", icon: Gamepad2, path: "/games" },
    { name: "پروفایل", icon: User, path: "/dashboard/profile" },
    { name: "کیف پول", icon: Wallet, path: "/wallet" },
    { name: "دعوت دوستان", icon: UserPlus, path: "/invite-friends" },
  ];

  return (
    <>
      <div className="p-6 border-b border-slate-800"><Link href="/" className="text-2xl font-black text-[#FF7A00]">Ravi</Link></div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? "bg-[#FF7A00] text-white" : "text-slate-300 hover:bg-slate-800"}`}>
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
