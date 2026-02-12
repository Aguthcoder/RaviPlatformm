import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientShell from "@/components/ClientShell";
import AuthGate from "@/components/AuthGate";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "راوی - پلتفرم هوشمند همنشینی",
  description: "پلتفرم راوی برای همنشینی و رزرو تجربه‌های اجتماعی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/estedad@v5.0.0/dist/font-face.css"
        />
        <meta name="theme-color" content="#FF7A00" />
      </head>
      <body className="font-sans bg-white">
        <AppProvider>
          <AuthGate>
            <ClientShell>
              <div className="background-animate">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
              </div>
              <AppShell>{children}</AppShell>
            </ClientShell>
          </AuthGate>
        </AppProvider>
      </body>
    </html>
  );
}
