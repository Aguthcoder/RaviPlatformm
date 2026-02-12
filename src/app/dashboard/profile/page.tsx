"use client";

import { useMemo } from "react";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function UserProfile() {
  const userOpinionScore = 82;
  const eventOpinionScore = 76;
  const matchPercent = useMemo(() => Math.round((userOpinionScore * 0.55) + (eventOpinionScore * 0.45)), []);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900">پروفایل کاربری</h1>
        <p className="text-slate-500 text-sm mt-1">بررسی تطابق و وضعیت همنشینی‌ها</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
            <p className="text-xs text-slate-300">تطابق موفق (نظر کاربر + بازخورد همنشینی)</p>
            <p className="text-2xl font-black text-white">{matchPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
