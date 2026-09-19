import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Iron & Fuel — Gym Equipment & Supplements",
  description: "Premium gym equipment, supplements, and accessories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#f8f9fa]">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
