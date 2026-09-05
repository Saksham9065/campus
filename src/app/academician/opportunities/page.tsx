"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  Filter,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getOpenAcademiaOpportunities,
  type AcademiaOpportunity,
  type AcademiaOpportunityType,
} from "@/lib/academia";
import { getOpenOpportunities } from "@/lib/firestoreOpportunities";
import type { JobOpportunity } from "@/lib/jobMatcher";

const types: (
  | "All"
  | AcademiaOpportunityType
  | JobOpportunity["type"]
)[] = [
  "All",
  "Faculty Internship",
  "Industrial Training",
  "FDP",
  "Consultancy",
  "Research Project",
  "Mentorship",
  "Guest Lecture",
  "Workshop",
  "Innovation Challenge",
  "Live Project",
  "Internship",
  "Full-time",
  "Part-time",
];

type UnifiedItem =
  | (AcademiaOpportunity & { source: "academia" })
  | (JobOpportunity & { source: "industry" });

function searchableText(item: UnifiedItem) {
  if (item.source === "industry") {
    return [
      item.title,
      item.company,
      item.type,
      ...(item.preferredSkills || []),
      ...item.requiredSkills,
      item.location,
      item.description,
    ].join(" ");
  }

  return [
    item.title,
    item.organization,
    item.type,
    ...item.requiredExpertise,
    ...item.preferredExpertise,
    item.description,
  ].join(" ");
}

export default function AcademiaOpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <Opportunities />
    </ProtectedRoute>
  );
}

function Opportunities() {
  const [items, setItems] = useState<UnifiedItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const [industry, academia] =
          await Promise.all([
            getOpenOpportunities(),
            getOpenAcademiaOpportunities(),
          ]);

        setItems([
          ...industry.map((item) => ({
            ...item,
            source: "industry",
          })),
          ...academia.map((item) => ({
            ...item,
            source: "academia",
          })),
        ] as UnifiedItem[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return items.filter((item) => {
      const searchMatch =
        !term ||
        searchableText(item)
          .toLowerCase()
          .includes(term);

      const typeMatch =
        type === "All" || item.type === type;

      return searchMatch && typeMatch;
    });
  }, [items, search, type]);

  const industryCount = items.filter(
    (item) => item.source === "industry"
  ).length;

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
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/academician"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Academia Opportunities
            </h1>

            <p className="text-xs text-slate-500">
              Industry, research and academic collaboration
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-cyan-600 p-7 text-white md:p-9">
          <p className="text-sm font-bold text-indigo-100">
            Collaboration Marketplace
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Opportunities for your expertise
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
            Discover research, industrial training, faculty
            internships, FDPs, workshops and mentorship
            opportunities.
          </p>
        </section>

        <section className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search opportunities..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4">
            <Filter className="h-4 w-4 text-slate-400" />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent py-3 text-sm font-semibold outline-none"
            >
              {types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>

        {industryCount > 0 && (
          <p className="mt-4 text-xs text-slate-500">
            Showing {industryCount} industry opportunities
            alongside academia collaborations.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.map((item) => (
            <OpportunityCard
              key={`${item.source}-${item.id}`}
              item={item}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-bold">
              No opportunities available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              New collaborations will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function OpportunityCard({
  item,
}: {
  item: UnifiedItem;
}) {
  const isIndustry =
    item.source === "industry";

  const href = isIndustry
    ? `/opportunities/${item.id}/apply`
    : `/academician/opportunities/${item.id}`;

  const label = isIndustry
    ? item.company
    : item.organization;

  const skills = isIndustry
    ? item.requiredSkills
    : item.requiredExpertise;

  const subtitle = isIndustry
    ? item.stipend || item.salary || item.mode
    : item.duration || item.mode;

  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600">
            {item.title.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-950">
                {item.title}
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
                  : item.type}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {label}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                {item.type}
              </span>

              {item.mode && (
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">
                  {item.mode}
                </span>
              )}

              {isIndustry && item.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </span>
              )}

              {isIndustry && item.deadline && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock3 className="h-3 w-3" />
                  {item.deadline}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-indigo-600" />

          {subtitle && (
            <span className="text-[11px] font-semibold text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}
