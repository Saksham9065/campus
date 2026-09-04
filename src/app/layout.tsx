import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { CopilotProvider } from "@/lib/copilotContext";
import { CopilotWidget } from "@/components/CopilotWidget";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CampusLink — Skill Intelligence Platform",
  description:
    "AI-powered platform connecting students, academia, institutions and industry.",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CopilotProvider>
            {children}
            <CopilotWidget />
          </CopilotProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
