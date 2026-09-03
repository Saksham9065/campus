"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/lib/admin";

export default function AdminReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Reports />
    </ProtectedRoute>
  );
}

function Reports() {
  const [analytics, setAnalytics] =
    useState<AdminAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
            Unable to load reports
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please try again later or contact support.
          </p>

          <button
            onClick={() => {
              initialized.current = false;
              refresh();
            }}
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/admin"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1">
            <h1 className="font-black">
              Platform Reports
            </h1>

            <p className="text-xs text-slate-500">
              Comprehensive platform insights and trends
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
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
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-100">
            Platform Overview
          </p>

          <h2 className="mt-2 text-3xl font-black">
            System-wide analytics
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Monitor growth, engagement and outcomes
            across all roles.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics.totalUsers}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Total Users
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics.totalOpportunities}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Opportunities
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics.totalApplications}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Applications
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {selectionRate}%
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Selection Rate
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Assessed Students
                </p>

                <p className="text-2xl font-black">
                  {analytics.assessedStudents}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Students who have completed skill
              assessments.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Placement Ready
                </p>

                <p className="text-2xl font-black">
                  {analytics.placementReadyStudents}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Students meeting placement readiness
              threshold.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Role Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Users by platform role.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <BarChart3 className="h-5 w-5" />
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

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Placement Stages
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student distribution across outcomes.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.placementStages.map(
              (stage) => (
                <div
                  key={stage.stage}
                  className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">
                      {stage.stage}
                    </p>

                    <p className="text-xs text-slate-500">
                      {stage.count} students
                    </p>
                  </div>

                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: `${Math.min(
                          100,
                          analytics.totalUsers
                            ? (stage.count /
                                analytics.totalUsers) *
                              100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
