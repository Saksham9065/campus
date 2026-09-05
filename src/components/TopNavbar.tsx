"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo width={32} height={32} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            href="/assessment/preferences"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Assessment
          </Link>

          <Link
            href="/learning"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Learning
          </Link>

          <Link
            href="/opportunities"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Opportunities
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
