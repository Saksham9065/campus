"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Filter,
  Loader2,
  Search,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getOpenAcademiaOpportunities,
  type AcademiaOpportunity,
  type AcademiaOpportunityType,
} from "@/lib/academia";

const types: (
  | "All"
  | AcademiaOpportunityType
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
];

export default function AcademiaOpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <Opportunities />
    </ProtectedRoute>
  );
}

function Opportunities() {
  const [items, setItems] = useState<
    AcademiaOpportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    getOpenAcademiaOpportunities()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        !search ||
        [
          item.title,
          item.organization,
          item.type,
          ...item.requiredExpertise,
          ...item.preferredExpertise,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const typeMatch =
        type === "All" || item.type === type;

      return searchMatch && typeMatch;
    });
  }, [items, search, type]);

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

          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">
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
              onChange={(e) =>
                setType(e.target.value)
              }
              className="bg-transparent py-3 text-sm font-semibold outline-none"
            >
              {types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/academician/opportunities/${item.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {item.type}
              </span>

              <h3 className="mt-5 text-lg font-black">
                {item.title}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {item.organization}
              </p>

              <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.requiredExpertise.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                <span>{item.mode}</span>

                <span>
                  {item.duration ||
                    "Flexible duration"}
                </span>
              </div>
            </Link>
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
