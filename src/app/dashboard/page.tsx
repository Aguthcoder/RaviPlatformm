import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-[#FF7A00]">داشبورد همنشینی</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/events" className="bg-[#0B1F3A] text-white rounded-2xl p-4">رزرو همنشینی</Link>
        <Link href="/wallet" className="bg-[#0B1F3A] text-white rounded-2xl p-4">کیف پول</Link>
        <Link href="/invite-friends" className="bg-[#0B1F3A] text-white rounded-2xl p-4">دعوت دوستان</Link>
      </div>
    </div>
  );
}
