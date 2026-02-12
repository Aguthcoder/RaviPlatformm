"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationsRead, NotificationItem } from "@/lib/api";

export default function NotificationsPage() {
  const [data, setData] = useState<{ unread: number; items: NotificationItem[] } | null>(null);

  const load = () => fetchNotifications().then(setData).catch(() => setData({ unread: 0, items: [] }));

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    await markNotificationsRead();
    await load();
  };

  return (
    <div className="min-h-screen p-4 pb-28">
      <h1 className="text-2xl font-black text-[#FF7A00]">اعلان‌ها {data ? `(${data.unread})` : ""}</h1>
      <button onClick={markAllRead} className="mt-3 rounded-lg bg-black px-3 py-2 text-sm text-white">
        علامت‌گذاری همه به‌عنوان خوانده‌شده
      </button>
      <div className="mt-4 space-y-3">
        {data?.items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-4">
            <p className="font-bold">{item.title}</p>
            <p className="text-sm text-slate-600">{item.body}</p>
            <p className="mt-2 text-xs text-slate-400">{item.type} • {new Date(item.createdAt).toLocaleString("fa-IR")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
