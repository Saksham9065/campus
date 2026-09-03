import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "CampusLink — Skill Intelligence Platform",
  description:
    "AI-powered platform connecting students, academia, institutions and industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
