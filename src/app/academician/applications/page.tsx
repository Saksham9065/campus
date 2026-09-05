"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  getAcademicianApplications,
  type AcademiaApplication,
} from "@/lib/academia";
import {
  getStudentApplications,
} from "@/lib/firestoreApplications";
import type { Application } from "@/lib/applications";

type UnifiedApplication = {
  id: string;
  opportunityTitle: string;
  organization: string;
  status: string;
  coverLetter?: string;
  appliedAt?: unknown;
};

export default function AcademiaApplicationsPage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <Applications />
    </ProtectedRoute>
  );
}

function Applications() {
  const { user } = useAuth();

  const [items, setItems] = useState<
    UnifiedApplication[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      getAcademicianApplications(user.uid),
      getStudentApplications(user.uid),
    ])
      .then(([academiaApps, studentApps]) => {
        const normalizedStudentApps: UnifiedApplication[] =
          studentApps.map((app) => ({
            id: app.id,
            opportunityTitle: app.opportunityTitle,
            organization: app.company,
            status: app.status,
            coverLetter: app.coverLetter,
            appliedAt: app.appliedAt,
          }));

        const combined = [
          ...academiaApps.map((app) => ({
            id: app.id,
            opportunityTitle: app.opportunityTitle,
            organization: app.organization,
            status: app.status,
            coverLetter: app.coverLetter,
            appliedAt: app.appliedAt,
          })),
          ...normalizedStudentApps,
        ];

        combined.sort((a, b) => {
          const aTime =
            a.appliedAt instanceof Date
              ? a.appliedAt.getTime()
              : a.appliedAt
                ? new Date(
                    a.appliedAt as string
                  ).getTime()
                : 0;
          const bTime =
            b.appliedAt instanceof Date
              ? b.appliedAt.getTime()
              : b.appliedAt
                ? new Date(
                    b.appliedAt as string
                  ).getTime()
                : 0;
          return bTime - aTime;
        });

        setItems(combined);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link
            href="/academician"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              My Applications
            </h1>

            <p className="text-xs text-slate-500">
              Track your applications across opportunities
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 font-black">
              No applications yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore opportunities to get started.
            </p>

            <Link
              href="/opportunities"
              className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-black">
                      {application.opportunityTitle}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {application.organization}
                    </p>
                  </div>

                  <StatusBadge
                    status={application.status}
                  />
                </div>

                {application.coverLetter && (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                    {application.coverLetter}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "Selected") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        {status}
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
        <XCircle className="h-4 w-4" />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
      <Clock3 className="h-4 w-4" />
      {status}
    </span>
  );
}
