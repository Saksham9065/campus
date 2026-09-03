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
  Network,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
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
  getMatchExplanation,
  getMatchLabel,
} from "@/lib/jobMatchExplanation";

type OpportunityWithMatch =
  JobOpportunity & {
    matchResult: JobMatchResult;
  };

function OpportunitiesContent() {
  const { user, profile } = useAuth();

  const [jobs, setJobs] = useState<
    OpportunityWithMatch[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [modeFilter, setModeFilter] =
    useState("All");

  const [minMatch, setMinMatch] =
    useState(0);

  const [selectedJob, setSelectedJob] =
    useState<OpportunityWithMatch | null>(
      null
    );

  useEffect(() => {
    async function loadJobs() {
      if (!user) return;

      try {
        const opportunities =
          await getOpenOpportunities();

        const studentSkills =
          profile?.skillScores || {};

        const enriched =
          opportunities.map((job) => ({
            ...job,
            matchResult:
              calculateJobMatch(
                studentSkills,
                job.requiredSkills,
                job.preferredSkills
              ),
          }));

        enriched.sort(
          (a, b) =>
            b.matchResult.match -
            a.matchResult.match
        );

        setJobs(enriched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [user, profile]);

  const filteredJobs = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title
          .toLowerCase()
          .includes(query) ||
        job.company
          .toLowerCase()
          .includes(query) ||
        job.requiredSkills.some(
          (skill) =>
            skill
              .toLowerCase()
              .includes(query)
        );

      const matchesType =
        typeFilter === "All" ||
        job.type === typeFilter;

      const matchesMode =
        modeFilter === "All" ||
        job.mode === modeFilter;

      const matchesScore =
        job.matchResult.match >= minMatch;

      return (
        matchesSearch &&
        matchesType &&
        matchesMode &&
        matchesScore
      );
    });
  }, [
    jobs,
    search,
    typeFilter,
    modeFilter,
    minMatch,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>

            <span className="font-bold text-slate-950">
              Campus
              <span className="text-indigo-600">
                Link
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Hero */}
        <section className="overflow-hidden rounded-4xl bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered opportunity matching
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Opportunities matched
                to your skills.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                CampusLink compares your assessed skills with
                industry requirements and prioritizes opportunities
                where you have the strongest alignment.
              </p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search roles, companies or skills..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
                )
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none"
            >
              <option>All</option>
              <option>Internship</option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>

            <select
              value={modeFilter}
              onChange={(event) =>
                setModeFilter(
                  event.target.value
                )
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none"
            >
              <option>All</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>

            <select
              value={minMatch}
              onChange={(event) =>
                setMinMatch(
                  Number(event.target.value)
                )
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none"
            >
              <option value={0}>
                Any match
              </option>
              <option value={70}>
                70%+ match
              </option>
              <option value={80}>
                80%+ match
              </option>
              <option value={90}>
                90%+ match
              </option>
            </select>
          </div>
        </section>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold text-slate-400">
              Opportunities
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {filteredJobs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold text-slate-400">
              Strong matches
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {
                filteredJobs.filter(
                  (job) =>
                    job.matchResult
                      .match >= 80
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold text-slate-400">
              Average match
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {filteredJobs.length
                ? Math.round(
                    filteredJobs.reduce(
                      (sum, job) =>
                        sum +
                        job.matchResult
                          .match,
                      0
                    ) /
                      filteredJobs.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Jobs */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Recommended for you
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Sorted by your skill alignment.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              {filteredJobs.length} results
            </div>
          </div>

          {!filteredJobs.length ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-800">
                No matching opportunities
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Try changing your filters or improve your skill
                profile to unlock more opportunities.
              </p>

              <Link
                href="/assessment/career"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"
              >
                Retake assessment
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <OpportunityCard
                  key={job.id}
                  job={job}
                  onOpen={() =>
                    setSelectedJob(job)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {selectedJob && (
        <OpportunityModal
          job={selectedJob}
          onClose={() =>
            setSelectedJob(null)
          }
        />
      )}
    </main>
  );
}

function OpportunityCard({
  job,
  onOpen,
}: {
  job: OpportunityWithMatch;
  onOpen: () => void;
}) {
  const match =
    job.matchResult.match;

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              {job.title}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {job.company}
            </p>
          </div>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl ${
            match >= 80
              ? "bg-emerald-50 text-emerald-700"
              : match >= 60
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <span className="text-sm font-bold">
            {match}%
          </span>

          <span className="text-[8px] font-bold uppercase">
            match
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
          <MapPin className="h-3 w-3" />
          {job.location}
        </span>

        <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
          {job.type}
        </span>

        <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
          {job.mode}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold text-slate-700">
          Skill alignment
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {job.matchResult.matchedSkills
            .slice(0, 4)
            .map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700"
              >
                <CheckCircle2 className="h-3 w-3" />
                {skill}
              </span>
            ))}

          {job.matchResult.missingSkills
            .slice(0, 2)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-semibold text-rose-600"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="text-xs leading-5 text-slate-500">
          {job.matchResult.recommendation}
        </p>
      </div>

      <button
        onClick={onOpen}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-indigo-600"
      >
        View opportunity
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

function OpportunityModal({
  job,
  onClose,
}: {
  job: OpportunityWithMatch;
  onClose: () => void;
}) {
  const result =
    job.matchResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold text-indigo-600">
              {job.company}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {job.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-2xl bg-indigo-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                  Your match
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {result.match}%
                </p>

                <p className="mt-1 text-xs font-semibold text-indigo-700">
                  {getMatchLabel(
                    result.match
                  )}
                </p>
              </div>

              <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {result.recommendation}
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              {getMatchExplanation(
                result
              )}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              About the opportunity
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              {job.description}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              Required skills
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {job.requiredSkills.map(
                (skill) => {
                  const matched =
                    result.matchedSkills.includes(
                      skill
                    );

                  return (
                    <span
                      key={skill}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        matched
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                }
              )}
            </div>
          </div>

          {result.missingSkills.length >
            0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold text-amber-800">
                Skills to improve
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {result.missingSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-semibold text-amber-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              <Link
                href="/roadmap"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-800"
              >
                Improve through roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoBox
              icon={<MapPin />}
              label="Location"
              value={job.location}
            />

            <InfoBox
              icon={<Clock3 />}
              label="Type"
              value={job.type}
            />

            <InfoBox
              icon={<BriefcaseBusiness />}
              label="Mode"
              value={job.mode}
            />
          </div>

          <Link
            href={`/opportunities/${job.id}/apply`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-[10px] leading-5 text-slate-400">
            Match percentage is a skill-alignment signal, not a
            guarantee of selection.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <OpportunitiesContent />
    </ProtectedRoute>
  );
}
