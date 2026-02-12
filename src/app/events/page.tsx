"use client";

import Link from "next/link";
import { EVENTS_DATA } from "@/lib/events-data";

const ACTIVE_CATEGORIES = ["همنشین", "هم صحبت", "هم پا"];

export default function EventsPage() {
  const activeEvents = EVENTS_DATA.filter((e) => ACTIVE_CATEGORIES.includes(e.category) && e.active);
  const inactiveEvents = EVENTS_DATA.filter((e) => !e.active);

  return (
    <div className="min-h-screen py-8 px-4 pb-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#FF7A00] mb-2">رزرو همنشینی</h1>
        <p className="text-slate-700 mb-8">دسته‌بندی‌ها: همنشین، هم صحبت و هم پا</p>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {activeEvents.map((event) => (
            <div key={event.id} className="rounded-3xl bg-[#0B1F3A] text-white p-4 border border-[#12345f]">
              <img src={event.image} alt={event.title} className="h-40 w-full object-cover rounded-2xl mb-3" />
              <p className="text-[#FF7A00] font-bold text-sm">{event.category}</p>
              <h3 className="font-black text-lg">{event.title}</h3>
              <p className="text-slate-300 text-sm mb-3">{event.subtitle}</p>
              <p className="text-xs text-white mb-4">15 نفر منتظر همنشینی شما هستند</p>
              <Link href={`/events/${event.id}/booking`} className="block text-center bg-[#FF7A00] rounded-xl py-2.5 font-bold">مشاهده و رزرو</Link>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-black text-[#FF7A00] mb-4">دسته‌های غیرفعال (فقط پیش‌رزرو)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {inactiveEvents.map((event) => (
            <div key={event.id} className="rounded-2xl bg-[#0B1F3A] text-white p-4 border border-dashed border-[#FF7A00]">
              <p className="font-bold">{event.title}</p>
              <p className="text-sm text-slate-300">{event.subtitle}</p>
              <p className="text-xs text-[#FF7A00] my-2">{event.waitingCount} نفر مانده تا فعال‌سازی همنشینی</p>
              <button className="bg-[#FF7A00] px-4 py-2 rounded-lg text-sm font-bold">پیش‌رزرو و اطلاع‌رسانی</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
