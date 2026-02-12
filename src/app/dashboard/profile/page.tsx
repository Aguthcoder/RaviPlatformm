"use client";

import { useMemo } from "react";
import { CheckCircle, MessageCircle, Sparkles, UserCircle2 } from "lucide-react";

export default function UserProfile() {
  const userOpinionScore = 82;
  const eventOpinionScore = 76;
  const matchPercent = useMemo(() => Math.round((userOpinionScore * 0.55) + (eventOpinionScore * 0.45)), []);

  return (
    <div className="space-y-6 pb-10">
      <div className="app-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-8 -left-8 h-28 w-28 rounded-full bg-orange-500/25 blur-2xl" />
        <div className="absolute -bottom-10 right-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-orange-400">
            <UserCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">پروفایل کاربری</h1>
            <p className="text-slate-300 text-sm mt-1">بررسی تطابق، عملکرد و وضعیت همنشینی‌ها</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="app-card rounded-2xl p-5 flex items-center gap-4">
          <MessageCircle className="text-orange-400" />
          <div>
            <p className="text-xs text-slate-300">پیام‌های نخوانده</p>
            <p className="text-2xl font-black text-white">۱۲</p>
          </div>
        </div>

        <div className="app-card rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle className="text-orange-400" />
          <div>
            <p className="text-xs text-slate-300">تطابق موفق</p>
            <p className="text-2xl font-black text-white">{matchPercent}%</p>
          </div>
        </div>

        <div className="app-card rounded-2xl p-5 flex items-center gap-4">
          <Sparkles className="text-orange-400" />
          <div>
            <p className="text-xs text-slate-300">سطح اعتماد پروفایل</p>
            <p className="text-2xl font-black text-white">A+</p>
          </div>
        </div>
      </div>
    </div>
  );
}
