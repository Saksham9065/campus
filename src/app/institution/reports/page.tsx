"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getInstitutionAnalytics,
  type InstitutionAnalytics,
} from "@/lib/institution";

export default function InstitutionReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["institution"]}>
      <Reports />
    </ProtectedRoute>
  );
}

function Reports() {
  const { profile } = useAuth();

  const [analytics, setAnalytics] =
    useState<InstitutionAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading reports...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <BarChart3 className="mx-auto h-10 w-10 text-indigo-600" />

          <h1 className="mt-4 text-xl font-black">
            Institution profile incomplete
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add your institution name to your profile
            before viewing reports.
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
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/institution"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Institution Reports
            </h1>

            <p className="text-xs text-slate-500">
              Placement and skill development insights
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-100">
            Insights
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Institutional performance
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            High-level summary of skill, placement and
            industry engagement.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics.totalStudents}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Total Students
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics.assessedStudents}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Assessed Students
              </p>
            </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-3xl font-black">
                  {analytics?.activeOpportunities || 0}
                </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Active Opportunities
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Placement Ready
                </p>

                <p className="text-2xl font-black">
                  {analytics.placementReady}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Students meeting placement readiness
              threshold.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Average Readiness
                </p>

                <p className="text-2xl font-black">
                  {analytics.averageReadiness}%
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Institution-wide average readiness score.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Top Skill Demand
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Most common skills across students.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {analytics.skillDemand.length === 0 ? (
              <p className="text-sm text-slate-500">
                No skill data available yet.
              </p>
            ) : (
              analytics.skillDemand
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {item.skill}
                    </p>

                    <span className="text-xs font-semibold text-indigo-600">
                      {item.students} students
                    </span>
                  </div>
                ))
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Role Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Breakdown by user role in the institution.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.roleDistribution.map(
              (role) => (
                <div
                  key={role.role}
                  className="rounded-2xl bg-slate-50 p-4 text-center"
                >
                  <p className="text-2xl font-black">
                    {role.count}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {role.role}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
