"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { categories, popularEvents } from "@/lib/events-catalog";
import { getTopicImage } from "@/lib/dynamic-images";
import { ApiEvent, fetchUpcomingEvents } from "@/lib/api";

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [remoteEvents, setRemoteEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const events = await fetchUpcomingEvents({ limit: 8 });
        if (isMounted) setRemoteEvents(events);
      } catch {
        if (isMounted) setRemoteEvents([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRemoteEvents = useMemo(() => {
    if (!query.trim()) return remoteEvents;
    const text = query.trim().toLowerCase();

    return remoteEvents.filter((event) =>
      [event.title, event.description, event.category, ...(event.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [query, remoteEvents]);

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 text-slate-100">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mb-4 text-center text-3xl font-black text-slate-900">رزرو همنشینی</h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="جست‌وجو"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 py-4 pr-12 pl-4 text-sm text-slate-200 shadow-lg"
          />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="mb-4 flex items-center justify-end gap-2 text-sm font-semibold text-orange-500">
          <MapPin className="h-4 w-4" />
          استان تهران، شهر تهران
        </div>

        <div className="mb-7 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-900/40">
          <img src={getTopicImage("social event booking", 1, 1400, 700)} alt="بنر رزرو" className="h-48 w-full object-cover" />
          <div className="flex items-center justify-between bg-gradient-to-l from-slate-900 to-slate-800 px-4 py-3 text-white">
            <p className="text-sm font-bold">همبازی، همپا و هم‌فکر در یک نگاه</p>
            <button className="rounded-full bg-orange-500 px-4 py-1 text-sm font-bold text-white">ثبت‌نام</button>
          </div>
        </div>

        <div className="mb-6 border-b border-slate-300/60">
          <div className="flex items-end justify-between text-sm font-semibold text-slate-500">
            <button className="border-b-2 border-orange-500 px-2 pb-3 text-slate-900">دسته بندی</button>
            <button className="px-2 pb-3">جدیدترین</button>
            <button className="px-2 pb-3">تخفیف‌ها</button>
            <button className="px-2 pb-3">رزرو من</button>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-3 gap-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/events/category/${category.id}`}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-center shadow-xl transition hover:-translate-y-1"
            >
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl ${
                  index % 2 === 0 ? "bg-[#102647] text-orange-400" : "bg-orange-500/15 text-[#102647]"
                }`}
              >
                <category.icon className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-white">{category.title}</p>
            </Link>
          ))}
        </section>

        <h2 className="mb-4 text-xl font-black text-slate-900">همنشینی‌های پرطرفدار</h2>

        {isLoading ? <p className="mb-4 text-sm text-slate-600">در حال دریافت رویدادها...</p> : null}

        <section className="space-y-4">
          {filteredRemoteEvents.length > 0
            ? filteredRemoteEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}/booking`} className="block overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-xl">
                  <img src={getTopicImage(event.title, 10, 1200, 600)} alt={event.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-black leading-8 text-white">{event.title}</h3>
                    <p className="text-sm font-semibold text-slate-300">{new Date(event.startDate).toLocaleString("fa-IR")}</p>
                    {event.category ? <p className="mt-1 text-sm font-bold text-orange-400">{event.category}</p> : null}
                  </div>
                </Link>
              ))
            : popularEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}/booking`} className="block overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-xl">
                  <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-black leading-8 text-white">{event.title}</h3>
                    <p className="text-sm font-semibold text-slate-300">{event.time}</p>
                    <p className="mt-1 text-sm font-bold text-orange-400">(تکمیل ظرفیت)</p>
                  </div>
                </Link>
              ))}
        </section>
      </div>
    </div>
  );
}
