"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:block"><Sidebar /></div>
      <main className="flex-1 p-4 lg:p-8 pb-28">{children}</main>
    </div>
  );
}
