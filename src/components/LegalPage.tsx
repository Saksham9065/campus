import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "@/components/Logo";

export default function LegalPage({
  title,
  description,
  children,
  updated = "September 5, 2026",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  updated?: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={32} height={32} />
            <span className="text-lg font-black text-slate-900">
              CampusLink
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 hover:text-indigo-600"
          >
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        {description && (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {children}

        <p className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
          Last updated: {updated}
        </p>
      </article>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2 className="mt-9 text-lg font-bold text-slate-950">
        {title}
      </h2>

      {children}
    </>
  );
}

export function Para({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-6 text-slate-600">
      {children}
    </p>
  );
}

export function BulletList({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 text-sm text-slate-600 pl-5">
      {children}
    </ul>
  );
}
