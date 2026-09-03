"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import type { JobOpportunity } from "@/lib/jobMatcher";
import { getOpenOpportunities } from "@/lib/firestoreOpportunities";

import {
  getOpportunityApplications,
  updateApplicationStatus,
  updateApplicationDetails,
} from "@/lib/firestoreApplications";

import type {
  Application,
  ApplicationStatus,
} from "@/lib/applications";

import {
  getCandidateProfile,
} from "@/lib/candidateProfile";

import {
  calculateJobMatch,
} from "@/lib/jobMatcher";

type Candidate = Application & {
  readiness: number;
  skillScores: Record<string, number>;
  match: ReturnType<typeof calculateJobMatch>;
};

export default function CandidatesPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <CandidatesContent />
    </ProtectedRoute>
  );
}

function CandidatesContent() {
  const { user } = useAuth();

  const [opportunity, setOpportunity] =
    useState<JobOpportunity | null>(null);

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [matchFilter, setMatchFilter] = useState("All");

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] =
    useState<"Online" | "Offline">("Online");
  const [interviewLink, setInterviewLink] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const opportunities = await getOpenOpportunities();

        const parts = window.location.pathname.split("/");
        const opportunityId =
          parts[parts.indexOf("opportunities") + 1];

        const found = opportunities.find(
          (item) => item.id === opportunityId
        );

        if (!found) {
          setLoading(false);
          return;
        }

        if (found.companyId !== user.uid) {
          setLoading(false);
          return;
        }

        setOpportunity(found);

        const apps =
          await getOpportunityApplications(opportunityId);

        const enriched: Candidate[] = [];

        for (const application of apps) {
          const profile =
            await getCandidateProfile(application.studentId);

          if (!profile) continue;

          const skillScores =
            profile.skillScores || {};

          const match = calculateJobMatch(
            skillScores,
            found.requiredSkills,
            found.preferredSkills
          );

          enriched.push({
            ...application,
            readiness: profile.readiness || 0,
            skillScores,
            match,
          });
        }

        enriched.sort((a, b) => {
          const scoreA =
            a.match.match * 0.7 +
            a.readiness * 0.3;

          const scoreB =
            b.match.match * 0.7 +
            b.readiness * 0.3;

          return scoreB - scoreA;
        });

        setCandidates(enriched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.studentName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        candidate.studentEmail
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      const matchesMatch =
        matchFilter === "All" ||
        (matchFilter === "90+" && candidate.match.match >= 90) ||
        (matchFilter === "80+" && candidate.match.match >= 80) ||
        (matchFilter === "70+" && candidate.match.match >= 70);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMatch
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
    matchFilter,
  ]);

  async function changeStatus(
    candidate: Candidate,
    status: ApplicationStatus
  ) {
    try {
      await updateApplicationStatus(
        candidate.id,
        status
      );

      setCandidates((current) =>
        current.map((item) =>
          item.id === candidate.id
            ? { ...item, status }
            : item
        )
      );

      if (selectedCandidate?.id === candidate.id) {
        setSelectedCandidate({
          ...selectedCandidate,
          status,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function scheduleInterview() {
    if (!selectedCandidate) return;

    try {
      await updateApplicationDetails(
        selectedCandidate.id,
        {
          interviewDate,
          interviewTime,
          interviewMode,
          interviewLink,
        }
      );

      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === selectedCandidate.id
            ? {
                ...candidate,
                interviewDate,
                interviewTime,
                interviewMode,
                interviewLink,
                status: "Interview Scheduled",
              }
            : candidate
        )
      );

      setSelectedCandidate(null);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Opportunity not found
          </h1>

          <Link
            href="/industry"
            className="mt-4 inline-block text-indigo-600"
          >
            Back to Industry Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortlisted = candidates.filter(
    (candidate) =>
      candidate.status === "Shortlisted"
  ).length;

  const interviews = candidates.filter(
    (candidate) =>
      candidate.status === "Interview Scheduled"
  ).length;

  const strongMatches = candidates.filter(
    (candidate) => candidate.match.match >= 80
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href={`/industry/opportunities/${opportunity.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
            <span className="font-black">
              Candidate Intelligence
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Opportunity */}
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-indigo-950 p-7 text-white md:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                AI Recruitment Workspace
              </div>

              <h1 className="mt-4 text-3xl font-black">
                {opportunity.title}
              </h1>

              <p className="mt-2 text-indigo-200">
                {opportunity.company} · {opportunity.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat
                value={candidates.length}
                label="Applicants"
              />

              <MiniStat
                value={strongMatches}
                label="Strong Match"
              />

              <MiniStat
                value={shortlisted}
                label="Shortlisted"
              />

              <MiniStat
                value={interviews}
                label="Interviews"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search candidates..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All",
                "Applied",
                "Screening",
                "Shortlisted",
                "Interview Scheduled",
                "Selected",
                "Rejected",
              ]}
            />

            <FilterSelect
              value={matchFilter}
              onChange={setMatchFilter}
              options={[
                "All",
                "90+",
                "80+",
                "70+",
              ]}
            />
          </div>
        </section>

        {/* Candidate list */}
        <section className="mt-6 space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <UserRound className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 font-bold">
                No candidates found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredCandidates.map(
              (candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  rank={index + 1}
                  onView={() =>
                    setSelectedCandidate(candidate)
                  }
                  onStatus={(status) =>
                    changeStatus(
                      candidate,
                      status
                    )
                  }
                />
              )
            )
          )}
        </section>
      </div>

      {/* Candidate modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="font-black">
                  {selectedCandidate.studentName}
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedCandidate.studentEmail}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCandidate(null)
                }
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Match */}
              <div className="grid gap-4 sm:grid-cols-3">
                <ScoreBox
                  label="AI Match"
                  value={`${selectedCandidate.match.match}%`}
                />

                <ScoreBox
                  label="Skill Readiness"
                  value={`${selectedCandidate.readiness}%`}
                />

                <ScoreBox
                  label="Status"
                  value={selectedCandidate.status}
                />
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-bold">
                  Skill Match Analysis
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <SkillGroup
                    title="Matched"
                    skills={
                      selectedCandidate.match
                        .matchedSkills
                    }
                    type="success"
                  />

                  <SkillGroup
                    title="Developing"
                    skills={
                      selectedCandidate.match
                        .partialSkills
                    }
                    type="warning"
                  />

                  <SkillGroup
                    title="Missing"
                    skills={
                      selectedCandidate.match
                        .missingSkills
                    }
                    type="danger"
                  />
                </div>
              </div>

              {/* Cover letter */}
              {selectedCandidate.coverLetter && (
                <div>
                  <h3 className="font-bold">
                    Cover Letter
                  </h3>

                  <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {selectedCandidate.coverLetter}
                  </div>
                </div>
              )}

              {/* Resume */}
              {selectedCandidate.resumeUrl && (
                <a
                  href={selectedCandidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {/* Actions */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="font-bold">
                  Recruitment Actions
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() =>
                      changeStatus(
                        selectedCandidate,
                        "Screening"
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50"
                  >
                    Move to Screening
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        selectedCandidate,
                        "Shortlisted"
                      )
                    }
                    className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        selectedCandidate,
                        "Rejected"
                      )
                    }
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Interview */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-indigo-600" />

                  <h3 className="font-bold">
                    Schedule Interview
                  </h3>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) =>
                      setInterviewDate(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />

                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) =>
                      setInterviewTime(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />

                  <select
                    value={interviewMode}
                    onChange={(e) =>
                      setInterviewMode(
                        e.target.value as
                          | "Online"
                          | "Offline"
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option value="Online">
                      Online
                    </option>

                    <option value="Offline">
                      Offline
                    </option>
                  </select>

                  <input
                    value={interviewLink}
                    onChange={(e) =>
                      setInterviewLink(e.target.value)
                    }
                    placeholder="Meeting link / venue"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                </div>

                <button
                  onClick={scheduleInterview}
                  disabled={
                    !interviewDate ||
                    !interviewTime
                  }
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function CandidateCard({
  candidate,
  rank,
  onView,
  onStatus,
}: {
  candidate: Candidate;
  rank: number;
  onView: () => void;
  onStatus: (
    status: ApplicationStatus
  ) => void;
}) {
  const match = candidate.match.match;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4 lg:w-80">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600">
            #{rank}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-black">
              {candidate.studentName}
            </h3>

            <p className="truncate text-sm text-slate-500">
              {candidate.studentEmail}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="AI Match"
            value={`${match}%`}
            highlight={match >= 80}
          />

          <Metric
            label="Readiness"
            value={`${candidate.readiness}%`}
          />

          <Metric
            label="Matched"
            value={
              candidate.match.matchedSkills.length
            }
          />

          <Metric
            label="Missing"
            value={
              candidate.match.missingSkills.length
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            {candidate.status}
          </span>

          <button
            onClick={onView}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            Review
          </button>

          {candidate.status !==
            "Shortlisted" && (
            <button
              onClick={() =>
                onStatus("Shortlisted")
              }
              className="rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              Shortlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-black ${
          highlight
            ? "text-indigo-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
      <p className="text-xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-indigo-200">
        {label}
      </p>
    </div>
  );
}

function ScoreBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SkillGroup({
  title,
  skills,
  type,
}: {
  title: string;
  skills: string[];
  type: "success" | "warning" | "danger";
}) {
  const classes = {
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-2xl p-4 ${classes[type]}`}>
      <p className="text-xs font-black uppercase tracking-wider">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <span className="text-xs opacity-70">
            None
          </span>
        ) : (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold"
            >
              {skill}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold outline-none focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
