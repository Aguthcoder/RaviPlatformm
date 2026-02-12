"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "hamneshin", title: "همنشین", active: true },
  { id: "hamsohbat", title: "هم‌صحبت", active: true },
  { id: "hampa", title: "هم‌پا", active: true },
  { id: "hamkar", title: "همکار", active: false },
  { id: "hamfekr", title: "هم‌فکر", active: false },
];

const sampleEvents = [
  { id: "next", title: "دورهمی همبازی (بردگیم گروهی)", date: "پنجشنبه ۲۳ بهمن", wait: 15 },
  { id: "talk", title: "قرار صبحانه (میز منتخب)", date: "جمعه ۲۴ بهمن", wait: 11 },
  { id: "walk", title: "هم‌پا طبیعت‌گردی سبک", date: "جمعه ۲۴ بهمن", wait: 7 },
];

export default function EventsPage() {
  const [preBookCount, setPreBookCount] = useState(24);

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-4">رزرو همنشینی</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-2xl p-4 text-center app-card">
              <h3 className="font-bold">{cat.title}</h3>
              <p className="text-xs mt-2 text-slate-200">{cat.active ? "فعال" : "هنوز فعال نیست"}</p>
            </div>
          ))}
        </div>

        <section className="space-y-4 mb-8">
          {sampleEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}/booking`} className="block rounded-2xl p-5 app-card hover:-translate-y-1 transition">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="text-sm text-white mt-1">{event.date}</p>
              <p className="text-sm text-orange-300 mt-2">{event.wait} نفر منتظر همنشینی شما هستند</p>
            </Link>
          ))}
        </section>

        <section className="app-card rounded-2xl p-5">
          <h3 className="font-bold text-lg">پیش‌رزرو دسته‌های غیرفعال</h3>
          <p className="text-sm text-slate-200 mt-2">با پیش‌رزرو شما، شمارنده فعال‌سازی کاهش پیدا می‌کند.</p>
          <button
            className="mt-4 bg-orange-500 text-white rounded-xl px-5 py-2"
            onClick={() => setPreBookCount((prev) => Math.max(prev - 1, 0))}
          >
            پیش‌رزرو کنم
          </button>
          <p className="mt-3 text-sm text-orange-300">{preBookCount} نفر تا فعال‌سازی باقی مانده است.</p>
        </section>
      </div>
    </div>
  );
}
