"use client";

import { use } from "react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

import {
  getOpenOpportunities,
} from "@/lib/firestoreOpportunities";

import {
  createApplication,
  hasApplied,
} from "@/lib/firestoreApplications";

import type { JobOpportunity } from "@/lib/jobMatcher";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function ApplyPageContent({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const { user, profile } = useAuth();

  const [opportunity, setOpportunity] =
    useState<JobOpportunity | null>(
      null
    );

  const [coverLetter, setCoverLetter] =
    useState("");

  const [alreadyApplied, setAlreadyApplied] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const opportunities =
          await getOpenOpportunities();

        const found =
          opportunities.find(
            (item) =>
              item.id === opportunityId
          );

        setOpportunity(found || null);

        if (found) {
          const applied =
            await hasApplied(
              user.uid,
              opportunityId
            );

          setAlreadyApplied(applied);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load this opportunity."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, opportunityId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user || !opportunity) return;

    setError("");
    setSubmitting(true);

    try {
      await createApplication({
        studentId: user.uid,
        studentName:
          profile?.name ||
          user.displayName ||
          (profile?.role === "academia"
            ? "Academician"
            : "Student"),
        studentEmail:
          profile?.email ||
          user.email ||
          "",
        opportunityId:
          opportunity.id,
        opportunityTitle:
          opportunity.title,
        company:
          opportunity.company,
        companyId:
          opportunity.companyId || "",

        ...(profile?.resumeUrl
          ? { resumeUrl: profile.resumeUrl }
          : {}),

        ...(profile?.resumeName
          ? { resumeName: profile.resumeName }
          : {}),

        coverLetter:
          coverLetter.trim(),
      });

      setSuccess(true);
      setAlreadyApplied(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5">
        <div className="text-center">
          <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Opportunity not found
          </h1>

          <Link
            href="/opportunities"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
          >
            Browse opportunities
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-5 sm:px-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <Logo width={32} height={32} />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Application submitted.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your application for{" "}
            <strong className="text-slate-700">
              {opportunity.title}
            </strong>{" "}
            at{" "}
            <strong className="text-slate-700">
              {opportunity.company}
            </strong>{" "}
            has been submitted successfully.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/applications"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
            >
              Track application
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600"
            >
              Browse more
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (alreadyApplied) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <CheckCircle2 className="h-8 w-8 text-indigo-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            You already applied.
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            You can track your application status from your applications dashboard.
          </p>

          <Link
            href="/applications"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
          >
            Track application
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to opportunities
          </Link>

          <span className="font-bold">
            <Logo width={32} height={32} />
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Apply for this opportunity
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your CampusLink profile information will be shared with the employer as part of your application.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >
              <label className="text-xs font-bold text-slate-700">
                Cover letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(
                    event.target.value
                  )
                }
                rows={8}
                placeholder="Tell the employer why you're interested in this opportunity and what makes you a good fit..."
                className="mt-2 w-full rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Resume
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {profile?.resumeName ||
                        "No resume uploaded (optional)"}
                    </p>
                  </div>
                </div>

                {!profile?.resumeUrl && (
                  <Link
                    href="/profile"
                    className="mt-3 inline-flex text-[11px] font-bold text-indigo-600"
                  >
                    Upload resume →
                  </Link>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <button
                disabled={submitting}
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit application
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Opportunity */}
          <aside className="h-fit rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              {opportunity.title}
            </h2>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {opportunity.company}
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-500">
              <p>
                {opportunity.location}
              </p>

              <p>
                {opportunity.type} •{" "}
                {opportunity.mode}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Required skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.requiredSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-indigo-50 p-4">
              <div className="flex gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />

                <p className="text-[11px] leading-5 text-indigo-700">
                  Your assessed skills and CampusLink profile will help the employer understand your capabilities.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage({
  params,
}: Props) {
  const { id } = use(params);

  return (
    <ProtectedRoute allowedRoles={["student", "academia"]}>
      <ApplyPageContent opportunityId={id} />
    </ProtectedRoute>
  );
}
