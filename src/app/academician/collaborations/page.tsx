"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Handshake,
  Loader2,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getOpenAcademiaOpportunities,
  getAcademicianApplications,
  type AcademiaOpportunity,
  type AcademiaApplication,
} from "@/lib/academia";

export default function AcademicianCollaborationsPage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <Collaborations />
    </ProtectedRoute>
  );
}

function Collaborations() {
  const { profile } = useAuth();

  const [opportunities, setOpportunities] =
    useState<AcademiaOpportunity[]>([]);

  const [applications, setApplications] =
    useState<AcademiaApplication[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile) return;

      try {
        const [opportunityData, applicationData] =
          await Promise.all([
            getOpenAcademiaOpportunities(),
            getAcademicianApplications(profile.uid),
          ]);

        setOpportunities(opportunityData);
        setApplications(applicationData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading collaborations...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/academician"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Collaborations
            </h1>

            <p className="text-xs text-slate-500">
              Industry and academic partnerships
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-100">
            Partnership Hub
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Academic collaborations
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Track your engagement with industry,
            research and training opportunities.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {opportunities.length}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Open Opportunities
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {applications.length}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                My Applications
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {applications.filter(
                  (app) =>
                    app.status === "Selected" ||
                    app.status === "Completed"
                ).length}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Active Collaborations
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Open Opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore available collaborations.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Handshake className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6">
            {opportunities.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-4 font-bold">
                  No opportunities available
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Check back later for new collaborations.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <h3 className="font-black">
                        {opp.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {opp.organization}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                          {opp.type}
                        </span>

                        {opp.mode && (
                          <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                            {opp.mode}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        opp.status === "open"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {opp.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
