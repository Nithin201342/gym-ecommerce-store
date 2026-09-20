import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { NavigationLoading } from "@/components/providers/navigation-loading";

export const metadata: Metadata = {
  title: "NovaFit — Gym Equipment & Supplements",
  description: "Premium gym equipment, supplements, and accessories.",
  icons: { icon: "/dumbbell-transparent.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#f8f9fa]">
        <AuthSessionProvider>
          <NavigationLoading />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
