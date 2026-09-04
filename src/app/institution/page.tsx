"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import Logo from "@/components/Logo";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  LogOut,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getInstitutionAnalytics,
  type InstitutionAnalytics,
} from "@/lib/institution";

export default function InstitutionPage() {
  return (
    <ProtectedRoute allowedRoles={["institution"]}>
      <InstitutionDashboard />
    </ProtectedRoute>
  );
}

function InstitutionDashboard() {
  const { logout, profile } = useAuth();

  const [analytics, setAnalytics] =
    useState<InstitutionAnalytics | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function load() {
      const institution =
        profile?.college ||
        profile?.companyName;

      if (!institution) {
        setLoading(false);
        initialized.current = true;
        return;
      }

      try {
        setLoading(true);

        const result =
          await getInstitutionAnalytics(
            institution
          );

        setAnalytics(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        initialized.current = true;
      }
    }

    load();
  }, [profile]);

  async function refreshAnalytics() {
    const institution =
      profile?.college ||
      profile?.companyName;

    if (!institution) return;

    try {
      setRefreshing(true);

      const result =
        await getInstitutionAnalytics(
          institution
        );

      setAnalytics(result);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }

  const readinessPercentage = useMemo(() => {
    if (!analytics?.totalStudents) {
      return 0;
    }

    return Math.round(
      (analytics.placementReady /
        analytics.totalStudents) *
        100
    );
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading institutional intelligence...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Building2 className="mx-auto h-10 w-10 text-indigo-600" />

          <h1 className="mt-4 text-xl font-black">
            Institution profile incomplete
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add your institution name to your profile
            before opening the analytics dashboard.
          </p>

          <Link
            href="/profile"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Update Profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
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
              onClick={() => refreshAnalytics()}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>

            <Link
              href="/profile"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Institution Profile
            </Link>

            <button
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                <Building2 className="h-4 w-4" />
                Institution Intelligence
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                {profile?.college ||
                  "Institution Dashboard"}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-200 md:text-base">
                Monitor student readiness, skill development,
                internships and placement outcomes from one
                centralized workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Placement readiness
              </p>

              <p className="mt-1 text-4xl font-black">
                {readinessPercentage}%
              </p>

              <p className="mt-1 text-xs text-indigo-200">
                students above 75% readiness
              </p>
            </div>
          </div>
        </section>

        {/* KPI */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            icon={<Users />}
            label="Total Students"
            value={analytics.totalStudents}
            description={`${analytics.assessedStudents} assessed`}
          />

          <Kpi
            icon={<Sparkles />}
            label="Average Readiness"
            value={`${analytics.averageReadiness}%`}
            description="Across assessed students"
          />

          <Kpi
            icon={<CheckCircle2 />}
            label="Placement Ready"
            value={analytics.placementReady}
            description="Readiness ≥ 75%"
          />

          <Kpi
            icon={<BriefcaseBusiness />}
            label="Applications"
            value={analytics.totalApplications}
            description={`${analytics.selectedStudents} selected`}
          />
        </section>

        {/* Main analytics */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Departments */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-600">
                  Department Intelligence
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Readiness by department
                </h2>
              </div>

              <BarChart3 className="h-6 w-6 text-indigo-500" />
            </div>

            {analytics.departments.length === 0 ? (
              <Empty
                title="No department data"
                description="Student profiles will appear here once they are associated with your institution."
              />
            ) : (
              <div className="mt-6 space-y-5">
                {analytics.departments.map(
                  (department) => (
                    <DepartmentRow
                      key={department.department}
                      department={department}
                    />
                  )
                )}
              </div>
            )}
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-cyan-600">
                  Skill Intelligence
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Most assessed skills
                </h2>
              </div>

              <Sparkles className="h-6 w-6 text-cyan-500" />
            </div>

            {analytics.skillDemand.length === 0 ? (
              <Empty
                title="No skill data"
                description="Skill assessment data will populate this section."
              />
            ) : (
              <div className="mt-6 space-y-4">
                {analytics.skillDemand.map(
                  (item, index) => {
                    const max =
                      analytics.skillDemand[0]
                        ?.students || 1;

                    const width =
                      (item.students / max) * 100;

                    return (
                      <div key={item.skill}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
                              {index + 1}
                            </span>

                            <span className="text-sm font-bold">
                              {item.skill}
                            </span>
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            {item.students} students
                          </span>
                        </div>

                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </div>

        {/* Placement overview */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-600">
                Placement Intelligence
              </p>

              <h2 className="mt-1 text-xl font-black">
                Institutional career pipeline
              </h2>
            </div>

            <Link
              href="/institution/placements"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
            >
              Detailed analytics
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Pipeline
              label="Students"
              value={analytics.totalStudents}
            />

            <Pipeline
              label="Assessed"
              value={analytics.assessedStudents}
            />

            <Pipeline
              label="Ready"
              value={analytics.placementReady}
            />

            <Pipeline
              label="Selected"
              value={analytics.selectedStudents}
            />

            <Pipeline
              label="Rejected"
              value={analytics.rejectedApplications}
            />
          </div>
        </section>

        {/* Placement stages */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Placement Intelligence
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Understand how students are progressing toward placement.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <PlacementStageCard
              title="Not Assessed"
              value={
                analytics.totalStudents -
                analytics.assessedStudents
              }
            />

            <PlacementStageCard
              title="Skill Building"
              value={Math.max(
                analytics.assessedStudents -
                  analytics.placementReady,
                0
              )}
            />

            <PlacementStageCard
              title="Placement Ready"
              value={analytics.placementReady}
            />

            <PlacementStageCard
              title="Applications"
              value={analytics.totalApplications}
            />

            <PlacementStageCard
              title="Selected"
              value={analytics.selectedStudents}
            />
          </div>
        </section>

        {/* Ecosystem */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/institution/students"
            icon={<Users />}
            title="Student Intelligence"
            description="Explore student readiness, skills and career profiles."
          />

          <ActionCard
            href="/institution/industry"
            icon={<Building2 />}
            title="Industry Connections"
            description="Track companies, opportunities and institutional partnerships."
          />

          <ActionCard
            href="/institution/reports"
            icon={<Activity />}
            title="Institution Reports"
            description="Generate placement and skill-development insights."
          />
        </section>

        {/* Footer insight */}
        <section className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white">
              <TrendingUp className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-black text-indigo-950">
                Institution insight
              </h3>

              <p className="mt-1 text-sm leading-6 text-indigo-800">
                CampusLink2 can continuously connect student
                skill data with internships, recruitment activity
                and industry demand to help institutions identify
                where intervention is needed.
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

function DepartmentRow({
  department,
}: {
  department: {
    department: string;
    students: number;
    assessed: number;
    averageReadiness: number;
    placementReady: number;
  };
}) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold">
            {department.department}
          </p>

          <p className="text-xs text-slate-400">
            {department.students} students ·{" "}
            {department.assessed} assessed
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-indigo-600">
            {department.averageReadiness}%
          </span>

          <span className="text-xs font-semibold text-green-600">
            {department.placementReady} ready
          </span>
        </div>
      </div>

      <div className="mt-3 h-2.5 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{
            width: `${department.averageReadiness}%`,
          }}
        />
      </div>
    </div>
  );
}

function Pipeline({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
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

function ActionCard({
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

        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-indigo-600" />
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

function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
      <p className="font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
