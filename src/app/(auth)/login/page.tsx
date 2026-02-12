"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Smartphone, Sparkles, Star } from "lucide-react";
import { testimonialsData } from "@/lib/testimonials";
import { useAppContext } from "@/context/AppContext";

type AuthTab = "login" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const { dispatch } = useAppContext();
  const router = useRouter();

  const testimonials = useMemo(() => testimonialsData.slice(0, 6), []);
  const activeTestimonial = testimonials[testimonialIndex % testimonials.length];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const finishLogin = () => {
    dispatch({ type: "LOGIN" });
    router.push("/test");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-7xl rounded-[34px] overflow-hidden bg-[#f5f6f8] shadow-[0_30px_60px_rgba(2,6,23,0.18)] grid md:grid-cols-[1.35fr_1fr]">
        <section className="p-6 md:p-14">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={16} />
            بازگشت به خانه
          </Link>

          <h1 className="text-4xl font-black mt-10 text-slate-900">خوش آمدید 👋</h1>
          <p className="text-slate-500 mt-2 text-lg">لطفا برای ادامه شماره موبایل خود را وارد کنید.</p>

          <div className="mt-8 rounded-xl bg-slate-200/80 p-1 grid grid-cols-2 max-w-md">
            <button
              className={`py-3 rounded-lg font-bold transition ${tab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              onClick={() => setTab("login")}
            >
              ورود
            </button>
            <button
              className={`py-3 rounded-lg font-bold transition ${tab === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              onClick={() => setTab("signup")}
            >
              ثبت نام
            </button>
          </div>

          <form
            className="space-y-5 mt-8 max-w-xl"
            onSubmit={(event) => {
              event.preventDefault();
              finishLogin();
            }}
          >
            {tab === "signup" && (
              <div>
                <label className="block text-slate-900 font-bold mb-2">نام و نام خانوادگی</label>
                <div className="bg-slate-200/70 rounded-2xl p-4 flex items-center gap-3">
                  <Smartphone className="text-slate-400" size={20} />
                  <input
                    className="bg-transparent w-full outline-none"
                    placeholder="مثال: علی رضایی"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required={tab === "signup"}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-900 font-bold mb-2">شماره موبایل</label>
              <div className="bg-slate-200/70 rounded-2xl p-4 flex items-center gap-3">
                <Smartphone className="text-slate-400" size={20} />
                <input
                  className="bg-transparent w-full outline-none ltr text-left"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="0912xxxxxxx"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-900 font-bold">رمز عبور</label>
                <button type="button" className="text-orange-500 text-sm font-semibold">فراموشی رمز؟</button>
              </div>
              <div className="bg-slate-200/70 rounded-2xl p-4 flex items-center gap-3">
                <Lock className="text-slate-400" size={20} />
                <input
                  className="bg-transparent w-full outline-none"
                  placeholder="رمز عبور"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 font-bold text-xl shadow-[0_10px_25px_rgba(249,115,22,0.35)] transition-colors">
              {tab === "login" ? "ورود" : "ثبت نام"}
            </button>
          </form>
        </section>

        <aside className="bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-orange-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-cyan-400/10 blur-3xl rounded-full" />

          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-4xl font-black">راوی</h2>
            <Sparkles className="text-white/90" />
          </div>

          <div className="relative z-10 mt-16">
            <h3 className="text-5xl font-black leading-tight">هوشمندانه انتخاب کن</h3>
            <p className="text-slate-300 mt-5 text-xl leading-9">
              با ورود به راوی، به جامعه‌ای از افراد می‌پیوندید که به دنبال روابط
              معنادار بر پایه علم روان‌شناسی هستند.
            </p>
          </div>

          <div className="relative z-10 border border-white/15 rounded-3xl bg-white/5 backdrop-blur p-6 mt-8">
            <div className="flex gap-1 text-orange-400 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-lg leading-8">&quot;{activeTestimonial.message}&quot;</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="font-bold">{activeTestimonial.name}</p>
                <p className="text-slate-300 text-sm">{activeTestimonial.role}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> آنلاین
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
