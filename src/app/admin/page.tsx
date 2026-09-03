"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import Logo from "@/components/Logo";

import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/lib/admin";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const [analytics, setAnalytics] =
    useState<AdminAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function load() {
      try {
        setLoading(true);

        const result =
          await getAdminAnalytics();

        setAnalytics(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        initialized.current = true;
      }
    }

    load();
  }, []);

  async function refresh() {
    try {
      setRefreshing(true);

      const result =
        await getAdminAnalytics();

      setAnalytics(result);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }

  const readiness = useMemo(() => {
    if (!analytics?.students) return 0;

    return Math.round(
      (analytics.placementReadyStudents /
        analytics.students) *
        100
    );
  }, [analytics]);

  const selectionRate = useMemo(() => {
    if (!analytics?.totalApplications) {
      return 0;
    }

    return Math.round(
      (analytics.selectedApplications /
        analytics.totalApplications) *
        100
    );
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading platform intelligence...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="font-bold">
            Unable to load admin analytics.
          </p>

          <button
            onClick={() => {
              initialized.current = false;
              refresh();
            }}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Logo width={36} height={36} />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
            >
              <RefreshCw
                className={
                  refreshing
                    ? "h-4 w-4 animate-spin"
                    : "h-4 w-4"
                }
              />
              Refresh
            </button>

            <Link
              href="/admin/users"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-7 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                Platform Administration
              </div>

              <h1 className="mt-5 text-3xl font-black md:text-5xl">
                CampusLink2 Command Center
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-200 md:text-base">
                Monitor the complete student, industry, academia
                and institution ecosystem from one place.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Platform health
              </p>

              <p className="mt-1 text-4xl font-black">
                {analytics.totalUsers}
              </p>

              <p className="text-xs text-indigo-200">
                registered users
              </p>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            icon={<Users />}
            label="Total Users"
            value={analytics.totalUsers}
            description={`${analytics.students} students`}
          />

          <Kpi
            icon={<BriefcaseBusiness />}
            label="Opportunities"
            value={analytics.totalOpportunities}
            description={`${analytics.activeOpportunities} active`}
          />

          <Kpi
            icon={<Activity />}
            label="Applications"
            value={analytics.totalApplications}
            description={`${analytics.selectedApplications} selected`}
          />

          <Kpi
            icon={<Sparkles />}
            label="Placement Ready"
            value={`${readiness}%`}
            description={`${analytics.placementReadyStudents} students`}
          />
        </section>

        {/* Ecosystem */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard
            icon={<GraduationCap />}
            title="Students"
            value={analytics.students}
            href="/admin/users"
          />

          <RoleCard
            icon={<Building2 />}
            title="Industry"
            value={analytics.industries}
            href="/admin/users"
          />

          <RoleCard
            icon={<GraduationCap />}
            title="Academia"
            value={analytics.academicians}
            href="/admin/users"
          />

          <RoleCard
            icon={<Building2 />}
            title="Institutions"
            value={analytics.institutions}
            href="/admin/users"
          />
        </section>

        {/* Analytics */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Skill demand */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-600">
                  Skill Intelligence
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Platform skill distribution
                </h2>
              </div>

              <BarChart3 className="h-6 w-6 text-indigo-500" />
            </div>

            <div className="mt-6 space-y-4">
              {analytics.skillDistribution.length ===
              0 ? (
                <Empty />
              ) : (
                analytics.skillDistribution.map(
                  (skill, index) => {
                    const max =
                      analytics
                        .skillDistribution[0]
                        ?.count || 1;

                    return (
                      <div key={skill.skill}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black">
                              {index + 1}
                            </span>

                            <span className="text-sm font-bold">
                              {skill.skill}
                            </span>
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            {skill.count}
                          </span>
                        </div>

                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{
                              width: `${
                                (skill.count /
                                  max) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </section>

          {/* Application performance */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-green-600">
                  Recruitment Intelligence
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Platform outcomes
                </h2>
              </div>

              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Outcome
                label="Applications"
                value={analytics.totalApplications}
              />

              <Outcome
                label="Selected"
                value={analytics.selectedApplications}
              />

              <Outcome
                label="Rejected"
                value={analytics.rejectedApplications}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-green-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-green-900">
                  Selection Rate
                </span>

                <span className="text-2xl font-black text-green-700">
                  {selectionRate}%
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-green-100">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${selectionRate}%`,
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Placement stages */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Placement Intelligence
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Platform-wide student progression toward placement.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <PlacementStageCard
              title="Students"
              value={analytics.students}
            />

            <PlacementStageCard
              title="Assessed"
              value={analytics.assessedStudents}
            />

            <PlacementStageCard
              title="Placement Ready"
              value={analytics.placementReadyStudents}
            />

            <PlacementStageCard
              title="Applications"
              value={analytics.totalApplications}
            />

            <PlacementStageCard
              title="Selected"
              value={analytics.selectedApplications}
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <AdminAction
            href="/admin/users"
            icon={<Users />}
            title="User Management"
            description="Review all platform participants and roles."
          />

          <AdminAction
            href="/admin/opportunities"
            icon={<BriefcaseBusiness />}
            title="Opportunity Moderation"
            description="Review industry opportunities and platform activity."
          />

          <AdminAction
            href="/admin/reports"
            icon={<BarChart3 />}
            title="Platform Reports"
            description="View ecosystem-level analytics and outcomes."
          />
        </section>

        {/* System summary */}
        <section className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-black text-indigo-950">
                Administration insight
              </h3>

              <p className="mt-1 text-sm leading-6 text-indigo-800">
                CampusLink2 connects skill assessment, learning,
                opportunities, recruitment and institutional
                outcomes so administrators can monitor the full
                career ecosystem.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
          {icon}
        </span>

        <span className="text-2xl font-black">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {icon}
        </span>

        <ArrowUpRight className="h-5 w-5 text-slate-300" />
      </div>

      <p className="mt-5 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>
    </Link>
  );
}

function Outcome({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 text-center">
      <p className="text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function PlacementStageCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <p className="text-2xl font-black">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-500">
        {title}
      </p>
    </div>
  );
}

function AdminAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          {icon}
        </span>

        <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600" />
      </div>

      <h3 className="mt-5 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
      No skill data available yet.
    </div>
  );
}
