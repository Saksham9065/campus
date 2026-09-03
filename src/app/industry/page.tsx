"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  PlusCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  getIndustryOpportunities,
} from "@/lib/industry";

import {
  calculateIndustryAnalytics,
  type IndustryAnalytics,
} from "@/lib/industryAnalytics";

import type { JobOpportunity } from "@/lib/jobMatcher";

const navigation = [
  {
    label: "Overview",
    href: "/industry",
    icon: LayoutDashboard,
  },
  {
    label: "Opportunities",
    href: "/industry/opportunities",
    icon: BriefcaseBusiness,
  },
  {
    label: "Candidates",
    href: "/industry/candidates",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/industry/analytics",
    icon: BarChart3,
  },
];

function IndustryDashboardContent() {
  const { profile, logout, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [opportunities, setOpportunities] =
    useState<JobOpportunity[]>([]);

  const [analytics, setAnalytics] =
    useState<IndustryAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const firstName =
    profile?.name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;

    async function loadData() {
      try {
        const opps =
          await getIndustryOpportunities(
            uid
          );

        setOpportunities(opps);

        const stats =
          await calculateIndustryAnalytics(
            opps
          );

        setAnalytics(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const funnelSteps = [
    {
      label: "Total Applicants",
      value: analytics?.totalApplicants ?? 0,
      color: "bg-indigo-600",
    },
    {
      label: "Screening",
      value: analytics?.screening ?? 0,
      color: "bg-blue-500",
    },
    {
      label: "Shortlisted",
      value: analytics?.shortlisted ?? 0,
      color: "bg-emerald-500",
    },
    {
      label: "Interviews",
      value: analytics?.interviews ?? 0,
      color: "bg-amber-500",
    },
    {
      label: "Selected",
      value: analytics?.selected ?? 0,
      color: "bg-emerald-600",
    },
    {
      label: "Rejected",
      value: analytics?.rejected ?? 0,
      color: "bg-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
            <BriefcaseBusiness className="h-5 w-5 animate-pulse text-indigo-600" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading industry dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-67.5 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/industry"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold">
                Campus<span className="text-indigo-600">Link</span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Industry
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    item.href === "/industry"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      item.href === "/industry"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />

                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Actions
          </p>

          <nav className="space-y-1">
            <Link
              href="/industry/opportunities/new"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              New Opportunity
            </Link>
          </nav>
        </div>

        {/* User */}
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {profile?.name
                ?.split(" ")
                .slice(0, 2)
                .map((x) => x[0])
                .join("")
                .toUpperCase() || "I"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {profile?.name || "Industry"}
              </p>

              <p className="truncate text-[10px] text-slate-400">
                {profile?.email}
              </p>
            </div>

            <Settings className="h-4 w-4 text-slate-400" />
          </Link>

          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-67.5">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">
                Industry Workspace
              </p>

              <p className="text-sm font-bold text-slate-900">
                Recruitment Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700"
            >
              {profile?.name?.charAt(0)?.toUpperCase() || "I"}
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/20 sm:p-8">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-indigo-300">
                <Sparkles className="h-3 w-3" />
                AI Recruitment Intelligence
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Manage your opportunities, review candidate matches and
                track your recruitment pipeline with AI-powered insights.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/industry/opportunities/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Opportunity
                </Link>

                <Link
                  href="/industry/opportunities"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  View Opportunities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Total Applicants",
                value: analytics?.totalApplicants ?? 0,
                text: `${opportunities.length} active opportunities`,
              },
              {
                icon: ShieldCheck,
                title: "Shortlisted",
                value: analytics?.shortlisted ?? 0,
                text: "Ready for interview",
              },
              {
                icon: BriefcaseBusiness,
                title: "Interviews",
                value: analytics?.interviews ?? 0,
                text: "Scheduled this week",
              },
              {
                icon: Sparkles,
                title: "Selected",
                value: analytics?.selected ?? 0,
                text: "Offers ready",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                      <Icon className="h-4 w-4 text-indigo-600" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>

                  <p className="mt-5 text-xs font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {stat.text}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Recruitment Funnel */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Recruitment Pipeline
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  Candidate Funnel
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Track applicants through each stage of your hiring process.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {funnelSteps.map((step, index) => (
                <div
                  key={step.label}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">
                        {step.label}
                      </p>

                      <span className="text-sm font-bold text-slate-900">
                        {step.value}
                      </span>
                    </div>

                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${step.color}`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (step.value / Math.max(analytics?.totalApplicants ?? 1, 1)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Opportunities */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Your Opportunities
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  Recent Postings
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Manage your active opportunities and review candidates.
                </p>
              </div>

              <Link
                href="/industry/opportunities/new"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <PlusCircle className="h-4 w-4" />
                New
              </Link>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              {opportunities.length === 0 ? (
                <div className="py-10 text-center">
                  <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    No opportunities posted yet
                  </p>

                  <Link
                    href="/industry/opportunities/new"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
                  >
                    Post your first opportunity
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                opportunities.map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/industry/opportunities/${opp.id}`}
                    className="flex items-center justify-between py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {opp.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {opp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          opp.status === "open"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {opp.status}
                      </span>

                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function IndustryPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <IndustryDashboardContent />
    </ProtectedRoute>
  );
}
