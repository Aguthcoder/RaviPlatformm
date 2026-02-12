"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Home,
  Sparkles,
  BookOpen,
  Briefcase,
  Brain,
  Dumbbell,
  Users,
} from "lucide-react";

const categories = [
  { id: "hamneshin", title: "همنشین", icon: Home },
  { id: "hamsohbat", title: "هم‌صحبت", icon: Users },
  { id: "hampa", title: "هم‌پا", icon: Dumbbell },
  { id: "hamkar", title: "همکار", icon: Briefcase },
  { id: "hamamooz", title: "هم‌آموز", icon: BookOpen },
  { id: "hamfekr", title: "هم‌فکر", icon: Brain },
  { id: "hamteami", title: "هم‌تیمی", icon: Sparkles },
  { id: "hamghese", title: "هم‌قصه", icon: Users },
];

const popularEvents = [
  {
    id: "boardgame",
    title: "دورهمی همبازی (بردگیم گروهی) - پنجشنبه ۲۳ بهمن",
    time: "پنجشنبه، ۲۳ بهمن ساعت ۱۵:۰۰",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "breakfast",
    title: "قرار صبحانه (میز منتخب)",
    time: "جمعه، ۲۴ بهمن ساعت ۱۰:۰۰",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cafe",
    title: "قرار صبحانه، جمعه ۲۴ بهمن",
    time: "جمعه، ۲۴ بهمن ساعت ۱۰:۰۰",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mafia",
    title: "همبازی ۲۴ بهمن (مافیا)",
    time: "جمعه، ۲۴ بهمن ساعت ۱۶:۰۰",
    image:
      "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen px-4 pt-6 pb-24 text-slate-800">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mb-4 text-center text-3xl font-black text-slate-900">رزرو همنشینی</h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="جست‌وجو"
            className="w-full rounded-2xl border border-slate-200/80 bg-slate-100/90 py-4 pr-12 pl-4 text-sm text-slate-600 shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="mb-4 flex items-center justify-end gap-2 text-sm font-semibold text-sky-500">
          <MapPin className="h-4 w-4" />
          استان تهران، شهر تهران
        </div>

        <div className="mb-7 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-100/60">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80"
            alt="بنر رزرو"
            className="h-48 w-full object-cover"
          />
          <div className="flex items-center justify-between bg-gradient-to-l from-orange-500 to-amber-500 px-4 py-3 text-white">
            <p className="text-sm font-bold">همبازی، همپا و هم‌فکر در یک نگاه</p>
            <button className="rounded-full bg-white px-4 py-1 text-sm font-bold text-orange-500">ثبت‌نام</button>
          </div>
        </div>

        <div className="mb-6 border-b border-slate-200">
          <div className="flex items-end justify-between text-sm font-semibold text-slate-400">
            <button className="border-b-2 border-sky-500 px-2 pb-3 text-slate-900">دسته بندی</button>
            <button className="px-2 pb-3">جدیدترین</button>
            <button className="px-2 pb-3">تخفیف‌ها</button>
            <button className="px-2 pb-3">رزرو من</button>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className="rounded-2xl border border-slate-200 bg-slate-100/90 p-3 text-center shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <category.icon className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-slate-800">{category.title}</p>
            </button>
          ))}
        </section>

        <h2 className="mb-4 text-xl font-black text-slate-900">همنشینی‌های پرطرفدار</h2>
        <section className="space-y-4">
          {popularEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}/booking`} className="block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
              <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-black leading-8 text-slate-900">{event.title}</h3>
                <p className="text-sm font-semibold text-slate-500">{event.time}</p>
                <p className="mt-1 text-sm font-bold text-sky-500">(تکمیل ظرفیت)</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
