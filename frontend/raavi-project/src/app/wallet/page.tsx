"use client";
import { useState } from "react";

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  return (
    <div className="min-h-screen p-4 pb-28">
      <div className="max-w-xl bg-[#0B1F3A] text-white rounded-2xl p-5">
        <h1 className="text-2xl font-black text-[#FF7A00] mb-4">کیف پول</h1>
        <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="مبلغ شارژ" className="w-full rounded-xl bg-[#112b4c] border border-[#1f4673] px-4 py-3 mb-3"/>
        <button className="w-full bg-[#FF7A00] rounded-xl py-3 font-bold">شارژ کیف پول</button>
      </div>
    </div>
  );
}
