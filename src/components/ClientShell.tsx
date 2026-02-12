"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowPreloader(true);
    const timer = setTimeout(() => setShowPreloader(false), 900);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {showPreloader && <Preloader />}
      <div className={showPreloader ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>{children}</div>
    </>
  );
}
