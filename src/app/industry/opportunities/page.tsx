"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getIndustryOpportunities,
} from "@/lib/industry";
import {
  deleteOpportunity,
} from "@/lib/firestoreOpportunities";

import type { JobOpportunity } from "@/lib/jobMatcher";

export default function IndustryOpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <Opportunities />
    </ProtectedRoute>
  );
}

function Opportunities() {
  const { user } = useAuth();

  const [opportunities, setOpportunities] =
    useState<JobOpportunity[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

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

  const filtered = opportunities.filter((opp) => {
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

  async function handleDelete(
    opp: JobOpportunity
  ) {
    const confirmed =
      confirm(
        `Remove "${opp.title}"? This will also delete all ${opp.title} applications. This action cannot be undone.`
      );

    if (!confirmed) return;

    setDeletingId(opp.id);

    try {
      await deleteOpportunity(opp.id);

      setOpportunities((current) =>
        current.filter(
          (item) => item.id !== opp.id
        )
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove opportunity."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading opportunities...
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
              Opportunities
            </h1>

            <p className="text-xs text-slate-500">
              Manage your posted opportunities
            </p>
          </div>

          <Link
            href="/industry/opportunities/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" />
            New Opportunity
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="relative">
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
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No opportunities found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {opportunities.length === 0
                  ? "Create your first opportunity to start receiving applications."
                  : "Try adjusting your search."}
              </p>

              {opportunities.length === 0 && (
                <Link
                  href="/industry/opportunities/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Opportunity
                </Link>
              )}
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
                            <BriefcaseBusiness className="h-3 w-3" />
                            {opp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/industry/opportunities/${opp.id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Manage
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(opp)
                      }
                      disabled={deletingId === opp.id}
                      className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === opp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
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
