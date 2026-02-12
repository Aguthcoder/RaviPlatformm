"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function TestPage() {
  const [q1, setQ1] = useState(50);
  const [q2, setQ2] = useState(50);
  const router = useRouter();
  const { dispatch } = useAppContext();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "TAKE_TEST" });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-3xl bg-[#0B1F3A] p-6 text-white border border-[#12345f]">
        <h1 className="text-2xl font-black text-[#FF7A00] mb-2">آزمون اجباری شروع</h1>
        <p className="text-slate-300 mb-6">برای ادامه باید این آزمون کوتاه را تکمیل کنید.</p>

        <div className="mb-5">
          <label className="block mb-2">چقدر از گفتگوهای عمیق لذت می‌برید؟ ({q1}%)</label>
          <input type="range" min={0} max={100} value={q1} onChange={(e) => setQ1(Number(e.target.value))} className="w-full accent-[#FF7A00]" />
        </div>

        <div className="mb-6">
          <label className="block mb-2">چقدر برای فعالیت گروهی آماده هستید؟ ({q2}%)</label>
          <input type="range" min={0} max={100} value={q2} onChange={(e) => setQ2(Number(e.target.value))} className="w-full accent-[#FF7A00]" />
        </div>

        <button className="w-full bg-[#FF7A00] py-3 rounded-xl font-bold">ثبت آزمون و ورود</button>
      </form>
    </div>
  );
}
