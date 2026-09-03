"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getInstitutionOpportunities,
} from "@/lib/institution";

import type { JobOpportunity } from "@/lib/jobMatcher";

export default function InstitutionIndustryPage() {
  return (
    <ProtectedRoute allowedRoles={["institution"]}>
      <Industry />
    </ProtectedRoute>
  );
}

function Industry() {
  const [opportunities, setOpportunities] =
    useState<JobOpportunity[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function load() {
      try {
        setLoading(true);

        const data =
          await getInstitutionOpportunities();

        setOpportunities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        initialized.current = true;
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const term =
      search.toLowerCase().trim();

    if (!term) return opportunities;

    return opportunities.filter((opp) =>
      [
        opp.title,
        opp.company,
        opp.type,
        opp.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [opportunities, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading industry connections...
        </div>
      </div>
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
              Industry Connections
            </h1>

            <p className="text-xs text-slate-500">
              Companies, opportunities and partnerships
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-200">
            Ecosystem Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Industry partnerships
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Track active opportunities and recruiter
            engagement.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {opportunities.length}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Opportunities
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {new Set(
                  opportunities
                    .map((opp) => opp.company)
                    .filter(Boolean)
                ).size}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Companies
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {opportunities.filter(
                  (opp) => opp.status === "open"
                ).length}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Open Roles
              </p>
            </div>
          </div>
        </section>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search opportunity, company or type..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No opportunities found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Opportunities posted by partners will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((opp) => (
                <div
                  key={opp.id}
                  className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600">
                      {opp.company
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </div>

                    <div>
                      <h3 className="font-black">
                        {opp.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {opp.company || "Independent"}
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

                        {opp.location && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {opp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
