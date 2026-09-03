"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Loader2,
  TrendingUp,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getInstitutionAnalytics,
  type InstitutionAnalytics,
} from "@/lib/institution";

export default function InstitutionPlacementsPage() {
  return (
    <ProtectedRoute allowedRoles={["institution"]}>
      <Placements />
    </ProtectedRoute>
  );
}

function Placements() {
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
          Loading placement intelligence...
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
            before viewing placement analytics.
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
              Placement Analytics
            </h1>

            <p className="text-xs text-slate-500">
              Detailed career pipeline and outcomes
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-100">
            Placement Pipeline
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Track career outcomes
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Monitor how students progress from assessment
            to selection.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                {analytics.placementReady}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Placement Ready
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
                {analytics.selectedStudents}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Selected
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Placement Stages
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student distribution across placement stages.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.placementStages.map((stage) => (
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
                        analytics.totalStudents
                          ? (stage.count /
                              analytics.totalStudents) *
                            100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Selected Students
                </p>

                <p className="text-2xl font-black">
                  {analytics.selectedStudents}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Students who received offers or were
              enrolled.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">
                  Rejected Applications
                </p>

                <p className="text-2xl font-black">
                  {analytics.rejectedApplications}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Applications that did not move forward.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            Department Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Readiness and placement readiness by department.
          </p>

          <div className="mt-6 space-y-4">
            {analytics.departments.map((dept) => (
              <div
                key={dept.department}
                className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {dept.department}
                  </p>

                  <p className="text-xs text-slate-500">
                    {dept.students} students ·{" "}
                    {dept.assessed} assessed
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-indigo-600">
                    {dept.averageReadiness}%
                  </span>

                  <span className="text-xs font-semibold text-green-600">
                    {dept.placementReady} ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
