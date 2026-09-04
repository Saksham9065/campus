"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

import {
  getOpenOpportunities,
} from "@/lib/firestoreOpportunities";

import {
  calculateJobMatch,
  type JobMatchResult,
  type JobOpportunity,
} from "@/lib/jobMatcher";

import {
  getOpenAcademiaOpportunities,
  type AcademiaOpportunity,
} from "@/lib/academia";

type UnifiedOpportunity =
  | (JobOpportunity & {
      source: "industry";
      matchResult: JobMatchResult;
    })
  | (AcademiaOpportunity & {
      source: "academia";
      matchResult: { match: number; matchedSkills: string[] };
    });

function OpportunitiesContent() {
  const { user, profile } = useAuth();

  const [items, setItems] = useState<
    UnifiedOpportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const [industry, academia] =
          await Promise.all([
            getOpenOpportunities(),
            getOpenAcademiaOpportunities(),
          ]);

        const studentSkills =
          profile?.skillScores || {};

        const enrichedIndustry: UnifiedOpportunity[] =
          industry.map((job) => {
            const matchResult =
              calculateJobMatch(
                studentSkills,
                job.requiredSkills,
                job.preferredSkills
              );

            return {
              ...job,
              source: "industry",
              matchResult,
            };
          });

        const enrichedAcademia: UnifiedOpportunity[] =
          academia.map((opp) => {
            const matched =
              opp.requiredExpertise.filter(
                (skill) =>
                  Object.keys(
                    studentSkills
                  ).some((userSkill) =>
                    userSkill
                      .toLowerCase()
                      .includes(
                        skill.toLowerCase()
                      ) ||
                    skill
                      .toLowerCase()
                      .includes(
                        userSkill
                          .toLowerCase()
                      )
                  )
              );

            const matchResult = {
              match: matched.length
                ? Math.min(
                    100,
                    Math.round(
                      (matched.length /
                        Math.max(
                          opp.requiredExpertise.length,
                          1
                        )) *
                        100
                    )
                  )
                : 0,
              matchedSkills: matched,
            };

            return {
              ...opp,
              source: "academia",
              matchResult,
            };
          });

        const combined = [
          ...enrichedIndustry,
          ...enrichedAcademia,
        ].sort((a, b) => {
          const aTime =
            a.postedAt instanceof Date
              ? a.postedAt.getTime()
              : typeof a.postedAt === "number"
                ? a.postedAt
                : 0;

          const bTime =
            b.postedAt instanceof Date
              ? b.postedAt.getTime()
              : typeof b.postedAt === "number"
                ? b.postedAt
                : 0;

          return bTime - aTime;
        });

        setItems(combined);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, profile]);

  const filtered = useMemo(() => {
    const term =
      search.toLowerCase().trim();

    return items.filter((item) => {
      const searchMatch =
        !term ||
        [
          item.title,
          item.type,
          item.description,
          item.source === "industry"
            ? item.company
            : item.organization,
          ...(item.source === "industry"
            ? item.requiredSkills
            : item.requiredExpertise),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);

      const typeMatch =
        typeFilter === "All" || item.type === typeFilter;

      return searchMatch && typeMatch;
    });
  }, [items, search, typeFilter]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();

    items.forEach((item) => {
      types.add(item.type);
    });

    return Array.from(types).sort();
  }, [items]);

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
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <Logo width={32} height={32} />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-indigo-600"
            >
              Dashboard
            </Link>

            <span className="hidden text-xs font-medium text-slate-400 sm:block">
              Opportunities
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Opportunities
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Discover roles and collaborations matched to your skills.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search opportunities..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 sm:w-72"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold text-slate-900">
                No opportunities found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((opportunity) => {
                const match =
                  opportunity.matchResult.match;

                const isIndustry =
                  opportunity.source ===
                  "industry";

                return (
                  <div
                    key={`${opportunity.source}-${opportunity.id}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600">
                          {opportunity.title
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-950">
                              {opportunity.title}
                            </h3>

                            <span
                              className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                                isIndustry
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {isIndustry
                                ? "Industry"
                                : "Academia"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {isIndustry
                              ? opportunity.company
                              : opportunity.organization}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                              {opportunity.type}
                            </span>

                            {opportunity.mode && (
                              <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                                {opportunity.mode}
                              </span>
                            )}

                            {opportunity.location && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <MapPin className="h-3 w-3" />
                                {opportunity.location}
                              </span>
                            )}

                            {opportunity.deadline && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock3 className="h-3 w-3" />
                                {opportunity.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-black ${
                              match >= 75
                                ? "text-emerald-600"
                                : match >= 50
                                  ? "text-indigo-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {match}% match
                          </span>

                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-indigo-600"
                              style={{
                                width: `${Math.min(100, match)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <Link
                          href={
                            isIndustry
                              ? `/opportunities/${opportunity.id}/apply`
                              : `/academician/opportunities/${opportunity.id}`
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                          {isIndustry
                            ? "Apply Now"
                            : "View Details"}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {opportunity.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OpportunitiesPage() {
  return (
    <ProtectedRoute
      allowedRoles={["student", "academia"]}
    >
      <OpportunitiesContent />
    </ProtectedRoute>
  );
}
