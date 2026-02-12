import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientShell from "@/components/ClientShell";
import AccessGate from "@/components/AccessGate";
import GlobalBottomNav from "@/components/GlobalBottomNav";

export const metadata: Metadata = {
  title: "راوی - پلتفرم هوشمند همنشینی",
  description: "راوی با استفاده از الگوریتم‌های هوشمند، افراد را به همنشینی‌های سازگار متصل می‌کند.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/estedad-font@v5.0.0/dist/font-face.css" />
      </head>
      <body className="font-sans bg-white">
        <AppProvider>
          <ClientShell>
            <AccessGate>
              <div className="background-animate">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
              {children}
              <GlobalBottomNav />
            </AccessGate>
          </ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
