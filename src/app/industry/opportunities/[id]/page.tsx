"use client";

import { use } from "react";
import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  getIndustryOpportunities,
} from "@/lib/industry";

import {
  subscribeToOpportunityApplications,
  updateApplicationStatus,
} from "@/lib/firestoreApplications";

import type { JobOpportunity } from "@/lib/jobMatcher";
import type {
  Application,
  ApplicationStatus,
} from "@/lib/applications";

type ApplicationWithStatus = Application & {
  status: ApplicationStatus;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function ManageOpportunityContent({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const { user } = useAuth();

  const [opportunity, setOpportunity] =
    useState<JobOpportunity | null>(null);

  const [applications, setApplications] =
    useState<ApplicationWithStatus[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadOpportunity() {
      if (!user) return;

      try {
        const opportunities =
          await getIndustryOpportunities(
            user.uid
          );

        const found =
          opportunities.find(
            (item: JobOpportunity) =>
              item.id === opportunityId
          );

        setOpportunity(found || null);

        const unsubscribe =
          subscribeToOpportunityApplications(
            opportunityId,
            (data) => {
              setApplications(data);
              setLoading(false);
            }
          );

        return unsubscribe;
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    let unsubscribe:
      | (() => void)
      | undefined;

    loadOpportunity().then(
      (cleanup) => {
        unsubscribe = cleanup;
      }
    );

    return () => {
      unsubscribe?.();
    };
  }, [user, opportunityId]);

  async function changeStatus(
    applicationId: string,
    status: ApplicationStatus
  ) {
    setUpdating(applicationId);

    try {
      await updateApplicationStatus(
        applicationId,
        status
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-10 text-center">
        <h1 className="text-xl font-bold">
          Opportunity not found
        </h1>

        <Link
          href="/industry"
          className="mt-5 inline-flex text-sm font-bold text-indigo-600"
        >
          Back to industry dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/industry"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Industry dashboard
          </Link>

          <span className="font-bold">
            Campus
            <span className="text-indigo-600">
              Link
            </span>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <section className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <BriefcaseBusiness className="h-4 w-4" />
                Opportunity
              </div>

              <h1 className="mt-4 text-3xl font-bold">
                {opportunity.title}
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                {opportunity.company}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Applications
              </p>

              <p className="mt-1 text-2xl font-bold">
                {applications.length}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <Link
            href={`/industry/opportunities/${opportunity.id}/candidates`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <Star className="h-4 w-4" />
            AI Candidate Ranking
          </Link>
        </div>

        <section className="mt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Talent pipeline
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Applicants
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Review candidates and move them through your recruitment pipeline.
            </p>
          </div>

          {applications.length ===
          0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <UserRound className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-4 text-sm font-bold text-slate-700">
                No applications yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Candidates will appear here after applying.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {applications.map(
                (application) => (
                  <ApplicantCard
                    key={application.id}
                    application={
                      application
                    }
                    updating={
                      updating ===
                      application.id
                    }
                    onStatusChange={
                      changeStatus
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ApplicantCard({
  application,
  updating,
  onStatusChange,
}: {
  application: Application;
  updating: boolean;
  onStatusChange: (
    id: string,
    status: ApplicationStatus
  ) => void;
}) {
  const nextStatus =
    getNextStatus(
      application.status
    );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50">
            <UserRound className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              {application.studentName}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {application.studentEmail}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <StatusBadge
                status={
                  application.status
                }
              />

              {application.resumeName && (
                <span className="text-[10px] text-slate-400">
                  Resume attached
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {application.resumeUrl && (
            <a
              href={
                application.resumeUrl
              }
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
            >
              View resume
            </a>
          )}

          {nextStatus && (
            <button
              disabled={updating}
              onClick={() =>
                onStatusChange(
                  application.id,
                  nextStatus
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Move to{" "}
                  {nextStatus}
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}

          {application.status !==
            "Rejected" &&
            application.status !==
              "Selected" &&
            application.status !==
              "Completed" && (
              <button
                disabled={updating}
                onClick={() =>
                  onStatusChange(
                    application.id,
                    "Rejected"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-600"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            )}
        </div>
      </div>

      {application.coverLetter && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Cover letter
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-600">
            {application.coverLetter}
          </p>
        </div>
      )}
    </article>
  );
}

function getNextStatus(
  status: ApplicationStatus
): ApplicationStatus | null {
  const next: Partial<
    Record<
      ApplicationStatus,
      ApplicationStatus
    >
  > = {
    Applied: "Screening",
    Screening: "Shortlisted",
    Shortlisted:
      "Interview Scheduled",
    "Interview Scheduled":
      "Interview Completed",
    "Interview Completed":
      "Selected",
    Selected: "Offer Released",
    "Offer Released": "Enrolled",
    Enrolled: "Completed",
  };

  return next[status] || null;
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1.5 text-[10px] font-bold text-rose-700">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  }

  if (
    status === "Selected" ||
    status === "Offer Released"
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        {status}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-indigo-50 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700">
      {status}
    </span>
  );
}

export default function ManageOpportunityPage({
  params,
}: Props) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <ManageOpportunityContent opportunityId={id} />
    </ProtectedRoute>
  );
}
