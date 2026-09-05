"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

import {
  deleteApplication,
  subscribeToStudentApplications,
} from "@/lib/firestoreApplications";

import type {
  Application,
  ApplicationStatus,
} from "@/lib/applications";

function ApplicationsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToStudentApplications(
        user.uid,
        (data) => {
          setApplications(data);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [user]);

  async function handleDelete(id: string) {
    try {
      await deleteApplication(id);
      setApplications((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch {
      alert(
        "Unable to withdraw application. Please try again."
      );
    }
  }

  const active =
    applications.filter(
      (application) =>
        application.status !==
          "Rejected" &&
        application.status !==
          "Completed"
    ).length;

  const selected =
    applications.filter(
      (application) =>
        application.status ===
          "Selected" ||
        application.status ===
          "Offer Released"
    ).length;

  const rejected =
    applications.filter(
      (application) =>
        application.status ===
        "Rejected"
    ).length;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
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

            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white"
            >
              Find opportunities
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Career activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Your applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track every opportunity from application to outcome.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Active"
            value={active}
            icon={<Clock3 />}
          />

          <Stat
            label="Selected"
            value={selected}
            icon={<CheckCircle2 />}
          />

          <Stat
            label="Not selected"
            value={rejected}
            icon={<XCircle />}
          />
        </div>

        <section className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : applications.length ===
            0 ? (
            <EmptyApplications />
          ) : (
            <div className="space-y-5">
              {applications.map(
                (application) => (
                  <ApplicationCard
                    key={application.id}
                    application={
                      application
                    }
                    onDelete={handleDelete}
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

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({
  application,
  onDelete,
}: {
  application: Application;
  onDelete?: (id: string) => void;
}) {
  const rejected =
    application.status ===
    "Rejected";

  const completed =
    application.status === "Completed";

  const canDelete =
    !rejected && !completed;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
            <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-bold text-slate-950">
              {application.opportunityTitle}
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {application.company}
            </p>

            <p className="mt-2 text-[10px] text-slate-400">
              Application ID:{" "}
              {application.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge
            status={
              application.status
            }
          />

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() =>
                onDelete(application.id)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              title="Withdraw application"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ApplicationTimeline
        currentStatus={
          application.status
        }
      />

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs leading-5 text-slate-500">
          {getStudentMessage(
            application.status
          )}
        </p>
      </div>

      {!rejected &&
        application.status !==
          "Completed" && (
          <div className="mt-4 flex justify-end">
            <Link
              href={`/applications/${application.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600"
            >
              View details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const rejected =
    status === "Rejected";

  const completed =
    status === "Completed";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${
        rejected
          ? "bg-rose-50 text-rose-700"
          : completed
          ? "bg-slate-100 text-slate-600"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {status}
    </span>
  );
}

function ApplicationTimeline({
  currentStatus,
}: {
  currentStatus: ApplicationStatus;
}) {
  const statuses: ApplicationStatus[] = [
    "Applied",
    "Screening",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
  ];

  if (currentStatus === "Rejected") {
    return (
      <div className="mt-7 flex items-center gap-3 rounded-2xl bg-rose-50 p-4">
        <XCircle className="h-5 w-5 text-rose-500" />

        <div>
          <p className="text-xs font-bold text-rose-700">
            Application closed
          </p>

          <p className="mt-1 text-[10px] text-rose-500">
            This application is no longer active.
          </p>
        </div>
      </div>
    );
  }

  const selectedIndex =
    statuses.indexOf(
      currentStatus
    );

  return (
    <div className="mt-7 overflow-x-auto">
      <div className="flex min-w-[620px] items-start">
        {statuses.map(
          (status, index) => {
            const completed =
              index <= selectedIndex;

            return (
              <div
                key={status}
                className="relative flex flex-1 flex-col items-center"
              >
                {index <
                  statuses.length -
                    1 && (
                  <div
                    className={`absolute left-1/2 top-4 h-px w-full ${
                      index <
                      selectedIndex
                        ? "bg-indigo-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${
                    completed
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {completed && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <p
                  className={`mt-2 text-center text-[9px] font-bold ${
                    completed
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {status}
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

function getStudentMessage(
  status: ApplicationStatus
) {
  const messages: Record<
    ApplicationStatus,
    string
  > = {
    Applied:
      "Your application has been received. The employer can now review your profile.",

    Screening:
      "The employer is currently reviewing your application.",

    Shortlisted:
      "Great progress — you have been shortlisted.",

    "Interview Scheduled":
      "Your next step is an interview with the employer.",

    "Interview Completed":
      "Your interview is complete. Wait for the employer's decision.",

    Selected:
      "Congratulations! You have been selected.",

    "Offer Released":
      "An offer has been released for this opportunity.",

    Enrolled:
      "You have enrolled in this opportunity.",

    Completed:
      "This opportunity has been completed.",

    Rejected:
      "The employer did not move your application forward this time.",
  };

  return messages[status];
}

function EmptyApplications() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

      <h2 className="mt-4 font-bold text-slate-800">
        No applications yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Discover opportunities matched to your skills and start building your career pipeline.
      </p>

      <Link
        href="/opportunities"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
      >
        Explore opportunities
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute allowedRoles={["student", "academia"]}>
      <ApplicationsContent />
    </ProtectedRoute>
  );
}
