"use client";

import { useMemo } from "react";

export default function ProfilePage() {
  const ownFeedback = [80, 65, 90];
  const othersOpinion = [70, 75, 85];

  const matchScore = useMemo(() => {
    const ownAvg = ownFeedback.reduce((a, b) => a + b, 0) / ownFeedback.length;
    const othersAvg = othersOpinion.reduce((a, b) => a + b, 0) / othersOpinion.length;
    return Math.round((ownAvg * 0.5) + (othersAvg * 0.5));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-[#FF7A00]">پروفایل</h1>
      <div className="bg-[#0B1F3A] text-white rounded-2xl p-4">
        <p className="text-slate-300 text-sm">موفقیت تطبیق بر اساس نظر شما و دیگران</p>
        <p className="text-3xl font-black text-[#FF7A00] mt-2">{matchScore}%</p>
      </div>
    </div>
  );
}
