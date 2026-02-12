"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { testimonialsData } from "@/lib/testimonials";

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [mode, setMode] = useState<"email" | "mobile">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const comments = useMemo(() => testimonialsData.slice(0, 3), []);

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch({ type: "LOGIN" });
    router.push("/test");
  };

  const submitMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    router.push(`/verify-mobile?mobile=${encodeURIComponent(mobile)}`);
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <section className="bg-[#112b4c] rounded-3xl p-6 border border-[#1f4673]">
          <h1 className="text-3xl font-black text-[#FF7A00] mb-2">ورود به Ravi</h1>
          <p className="text-slate-300 mb-6">ورود با ایمیل یا موبایل</p>

          <div className="flex gap-2 mb-5">
            <button onClick={() => setMode("email")} className={`px-4 py-2 rounded-xl font-bold ${mode === "email" ? "bg-[#FF7A00]" : "bg-[#0B1F3A]"}`}>ایمیل</button>
            <button onClick={() => setMode("mobile")} className={`px-4 py-2 rounded-xl font-bold ${mode === "mobile" ? "bg-[#FF7A00]" : "bg-[#0B1F3A]"}`}>موبایل</button>
          </div>

          {mode === "email" ? (
            <form className="space-y-3" onSubmit={submitEmail}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl bg-[#0B1F3A] border border-[#1f4673] px-4 py-3" placeholder="ایمیل" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl bg-[#0B1F3A] border border-[#1f4673] px-4 py-3" placeholder="رمز عبور" />
              <button className="w-full bg-[#FF7A00] rounded-xl py-3 font-bold">ورود</button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={submitMobile}>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-xl bg-[#0B1F3A] border border-[#1f4673] px-4 py-3" placeholder="شماره موبایل" />
              <button className="w-full bg-[#FF7A00] rounded-xl py-3 font-bold">دریافت کد تایید</button>
            </form>
          )}
        </section>

        <section className="bg-white text-[#0B1F3A] rounded-3xl p-6">
          <h2 className="text-xl font-black text-[#FF7A00] mb-4">نظر کاربران از صفحه اصلی</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-[#0B1F3A] rounded-2xl p-4 text-white">
                <p className="font-bold text-[#FF7A00]">{comment.name}</p>
                <p className="text-sm text-slate-200">{comment.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
