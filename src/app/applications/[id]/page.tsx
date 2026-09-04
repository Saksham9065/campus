"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

import {
  deleteApplication,
  getApplication,
} from "@/lib/firestoreApplications";

import {
  canMoveToStatus,
  getStudentMessage,
  type ApplicationStatus,
} from "@/lib/applications";

type ApplicationDetail = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  companyId: string;
  resumeUrl?: string;
  resumeName?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt?: unknown;
  updatedAt?: unknown;
};

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ApplicationDetail params={params} />
    </ProtectedRoute>
  );
}

function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [applicationId, setApplicationId] =
    useState<string | null>(null);
  const [application, setApplication] =
    useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((resolved) => {
      setApplicationId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    async function load() {
      if (!applicationId) return;

      try {
        const data =
          await getApplication(applicationId);

        if (!data) {
          setError("Application not found.");
          return;
        }

        setApplication(data as ApplicationDetail);
      } catch {
        setError("Unable to load application.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [applicationId]);

  async function handleDelete() {
    if (!applicationId || !application) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to withdraw this application? This action cannot be undone."
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteApplication(applicationId);

      router.push("/applications");
    } catch {
      setError("Unable to delete application.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/applications"
              className="flex items-center gap-3"
            >
              <Logo width={32} height={32} />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="text-sm text-red-600">{error || "Application not found."}</p>
        </div>
      </main>
    );
  }

  const isFinal =
    application.status === "Rejected" ||
    application.status === "Completed";

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/applications"
            className="flex items-center gap-3"
          >
            <Logo width={32} height={32} />
          </Link>

          <span className="text-xs font-medium text-slate-400">
            Application Details
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Link
          href="/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-950">
                  {application.opportunityTitle}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {application.company}
                </p>

                <p className="mt-2 text-[10px] text-slate-400">
                  Application ID: {application.id}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${
                application.status === "Rejected"
                  ? "bg-rose-50 text-rose-700"
                  : application.status === "Completed"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {application.status}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs leading-5 text-slate-500">
              {getStudentMessage(application.status)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Student Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {application.studentName}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {application.studentEmail}
              </p>
            </div>

            {application.coverLetter && (
              <div className="md:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Cover Letter
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {application.resumeName && (
              <div className="md:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Resume
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {application.resumeName}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            {!isFinal && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Withdrawing..." : "Withdraw Application"}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
