"use client";

import { useParams, useRouter } from "next/navigation";
import { EVENTS_DATA } from "@/lib/events-data";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const event = EVENTS_DATA.find((e) => e.id === params.id) || EVENTS_DATA[0];

  return (
    <div className="min-h-screen p-4 pb-28">
      <div className="max-w-3xl mx-auto bg-[#0B1F3A] text-white rounded-3xl p-6 border border-[#12345f]">
        <img src={event.image} alt={event.title} className="h-64 w-full rounded-2xl object-cover mb-4" />
        <p className="text-[#FF7A00] font-bold text-sm">{event.category}</p>
        <h1 className="text-2xl font-black mb-2">{event.title}</h1>
        <p className="text-slate-300 mb-4">{event.subtitle}</p>

        <div className="rounded-2xl bg-[#112b4c] p-4 mb-4">
          <p>تاریخ: {event.date}</p>
          <p>ساعت: {event.time}</p>
          <p className="text-[#FF7A00] mt-2">15 نفر منتظر همنشینی شما هستند</p>
        </div>

        <button onClick={() => router.push("/post-payment")} className="w-full bg-[#FF7A00] py-3 rounded-xl font-bold">ثبت رزرو</button>
      </div>
    </div>
  );
}
