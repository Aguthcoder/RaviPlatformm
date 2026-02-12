"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 app-card rounded-3xl p-6">
          <h1 className="text-2xl font-black mb-3">جزئیات همنشینی {params.id}</h1>
          <p className="text-slate-200 mb-4">
            این صفحه نهایی رزرو است. بخش لوکیشن عمومی و زمان‌بندی طبق درخواست حذف شده و اطلاعات تکمیلی فقط در داشبورد خصوصی نمایش داده می‌شود.
          </p>
          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-orange-300">۱۵ نفر منتظر همنشینی شما هستند.</p>
          </div>
        </div>

        <aside className="app-card rounded-3xl p-6">
          <p className="text-sm text-slate-300">هزینه ثبت‌نام</p>
          <p className="text-2xl font-black mt-1">۴۵۰,۰۰۰ تومان</p>
          <button className="w-full bg-orange-500 text-white rounded-xl py-3 mt-6">تکمیل رزرو</button>
          <Link href="/events" className="block text-center mt-3 text-slate-300 text-sm">بازگشت</Link>
        </aside>
      </div>
    </div>
  );
}
