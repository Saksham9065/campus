"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Loader2,
  Search,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getIndustryOpportunities,
} from "@/lib/industry";

import type { JobOpportunity } from "@/lib/jobMatcher";

export default function IndustryCandidatesPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <Candidates />
    </ProtectedRoute>
  );
}

function Candidates() {
  const { user } = useAuth();

  const [opportunities, setOpportunities] =
    useState<JobOpportunity[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const data =
          await getIndustryOpportunities(
            user.uid
          );

        setOpportunities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const totalApplicants = opportunities.length;

  const filteredOpportunities = opportunities.filter((opp) => {
    const term = search.toLowerCase().trim();

    if (!term) return true;

    return [
      opp.title,
      opp.company,
      opp.type,
      opp.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading candidates...
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

          <div>
            <h1 className="font-black">
              Candidates
            </h1>

            <p className="text-xs text-slate-500">
              Review applicants across your opportunities
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-indigo-100">
            Candidate Pool
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Applicant overview
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            See how many candidates have applied
            across your posted roles.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-3xl font-black">
                {totalApplicants}
              </p>
              <p className="mt-1 text-xs font-bold text-indigo-100">
                Total Applicants
              </p>
            </div>

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
            placeholder="Search opportunities..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filteredOpportunities.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No candidates yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Post an opportunity to start receiving
                applications.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOpportunities.map((opp) => (
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                     0 applicants
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
