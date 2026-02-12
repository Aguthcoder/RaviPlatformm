import { EVENTS_DATA } from "@/lib/events-data";

export default function GamesPage() {
  const reservedEvents = EVENTS_DATA.filter((e) => e.active).slice(0, 2);

  return (
    <div className="min-h-screen p-4 pb-28">
      <h1 className="text-2xl font-black text-[#FF7A00] mb-4">بازی و کوئیز همنشینی</h1>
      <div className="space-y-4">
        {reservedEvents.map((event) => (
          <div key={event.id} className="bg-[#0B1F3A] text-white rounded-2xl p-4">
            <h2 className="font-bold">کوئیز مرتبط با {event.title}</h2>
            <p className="text-sm text-slate-300">پس از شروع همنشینی در داشبورد نمایش داده می‌شود.</p>
            <button className="mt-3 bg-[#FF7A00] px-4 py-2 rounded-lg text-sm font-bold">شروع کوئیز نمونه</button>
          </div>
        ))}
      </div>
    </div>
  );
}
