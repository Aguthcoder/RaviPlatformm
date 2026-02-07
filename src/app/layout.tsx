import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "راوی - پلتفرم هوشمند رویداد",
  description: "پلتفرم راوی با استفاده از الگوریتم‌های هوش مصنوعی و تست‌های روان‌شناسی، افراد را با بهترین هم‌نشین‌های خود متصل می‌کند.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* فونت وزیرمتن از CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/font.css"
        />
        {/* متاتگ‌های مهم برای SEO */}
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" href="/favicon.ico" />
        {/* برای پشتیبانی از مرورگرهای قدیمی */}
        <style>{`
          @font-face {
            font-family: 'Vazirmatn Fallback';
            src: local('Tahoma'), local('Segoe UI');
            ascent-override: 95%;
            descent-override: 25%;
            line-gap-override: 0%;
          }
        `}</style>
      </head>
      <body className="font-sans bg-gradient-to-b from-slate-50 to-slate-100">
        <AppProvider>
          {/* پس‌زمینه انیمیشن دار */}
          <div className="background-animate">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
