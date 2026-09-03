"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/lib/admin";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["student", "industry", "academia", "institution", "admin"]}>
      <Analytics />
    </ProtectedRoute>
  );
}

function Analytics() {
  const { } = useAuth();

  const [analytics, setAnalytics] =
    useState<AdminAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading analytics...
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
            Unable to load analytics
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please try again later.
          </p>

          <button
            onClick={refresh}
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
            href="/dashboard"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1">
            <h1 className="font-black">
              Platform Analytics
            </h1>

            <p className="text-xs text-slate-500">
              Comprehensive platform insights
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
            Overview
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Platform performance
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Key metrics across students, industry,
            academia and institutions.
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
                {analytics.activeOpportunities}
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
                  Students
                </p>

                <p className="text-2xl font-black">
                  {analytics.students}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Registered students on the platform.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Industries
                </p>

                <p className="text-2xl font-black">
                  {analytics.industries}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Industry partners actively posting
              opportunities.
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
      </div>
    </main>
  );
}
