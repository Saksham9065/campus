"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getIndustryOpportunities,
} from "@/lib/industry";

import {
  calculateIndustryAnalytics,
  type IndustryAnalytics,
} from "@/lib/industryAnalytics";

export default function IndustryAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <Analytics />
    </ProtectedRoute>
  );
}

function Analytics() {
  const { user } = useAuth();

  const [analytics, setAnalytics] =
    useState<IndustryAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        setLoading(true);

        const opps =
          await getIndustryOpportunities(
            user.uid
          );

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

    load();
  }, [user]);

  async function refresh() {
    if (!user) return;

    try {
      setRefreshing(true);

      const opps =
        await getIndustryOpportunities(
          user.uid
        );

      const stats =
        await calculateIndustryAnalytics(
          opps
        );

      setAnalytics(stats);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/industry"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1">
            <h1 className="font-black">
              Recruitment Analytics
            </h1>

            <p className="text-xs text-slate-500">
              Funnel insights and candidate metrics
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
            Hiring Pipeline
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Recruitment performance
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Track applicants from application to
            selection.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics?.totalApplicants ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Total Applicants
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics?.shortlisted ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Shortlisted
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics?.interviews ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Interviews
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {analytics?.selected ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Selected
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Screening
                </p>

                <p className="text-2xl font-black">
                  {analytics?.screening ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Candidates currently in screening.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Rejected
                </p>

                <p className="text-2xl font-black">
                  {analytics?.rejected ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Applications that did not move forward.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
