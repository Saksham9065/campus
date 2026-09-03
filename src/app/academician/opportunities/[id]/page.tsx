"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  createAcademiaApplication,
  getOpenAcademiaOpportunities,
  type AcademiaOpportunity,
} from "@/lib/academia";

export default function AcademiaOpportunityDetail() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <Detail />
    </ProtectedRoute>
  );
}

function Detail() {
  const { user, profile } = useAuth();

  const [opportunity, setOpportunity] =
    useState<AcademiaOpportunity | null>(null);

  const [coverLetter, setCoverLetter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const id =
        window.location.pathname.split("/").pop();

      if (!id) return;

      try {
        const items =
          await getOpenAcademiaOpportunities();

        const found = items.find(
          (item) => item.id === id
        );

        setOpportunity(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function apply() {
    if (!user || !profile || !opportunity) return;

    try {
      setApplying(true);
      setError("");

      await createAcademiaApplication({
        academicianId: user.uid,
        academicianName: profile.name,
        academicianEmail: profile.email,

        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        organization: opportunity.organization,

        coverLetter,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit application."
      );
    } finally {
      setApplying(false);
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
          <h1 className="text-xl font-black">
            Opportunity not found
          </h1>

          <Link
            href="/academician/opportunities"
            className="mt-4 inline-block text-indigo-600"
          >
            Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-lg rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />

          <h1 className="mt-5 text-2xl font-black">
            Application submitted
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your application for{" "}
            <strong>{opportunity.title}</strong> has
            been submitted successfully.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/academician/applications"
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white"
            >
              Track Application
            </Link>

            <Link
              href="/academician/opportunities"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
            >
              Explore More
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-4">
          <Link
            href="/academician/opportunities"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-indigo-950 p-7 text-white md:p-10">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
            {opportunity.type}
          </span>

          <h1 className="mt-5 text-3xl font-black md:text-4xl">
            {opportunity.title}
          </h1>

          <p className="mt-3 text-indigo-200">
            {opportunity.organization}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Meta
              icon={<BriefcaseBusiness />}
              value={opportunity.mode}
            />

            {opportunity.location && (
              <Meta
                icon={<MapPin />}
                value={opportunity.location}
              />
            )}

            {opportunity.duration && (
              <Meta
                icon={<Clock3 />}
                value={opportunity.duration}
              />
            )}

            {opportunity.deadline && (
              <Meta
                icon={<CalendarDays />}
                value={`Deadline ${opportunity.deadline}`}
              />
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              About this opportunity
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {opportunity.description}
            </p>

            <h3 className="mt-8 font-bold">
              Required expertise
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {opportunity.requiredExpertise.map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>

            {opportunity.preferredExpertise.length >
              0 && (
              <>
                <h3 className="mt-7 font-bold">
                  Preferred expertise
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {opportunity.preferredExpertise.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Apply for collaboration
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Introduce your expertise and explain why this
              collaboration is relevant to your academic work.
            </p>

            <textarea
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              rows={8}
              placeholder="Write your application..."
              className="mt-5 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500"
            />

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              onClick={apply}
              disabled={applying}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {applying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              Submit Application
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

function Meta({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold">
      {icon}
      {value}
    </span>
  );
}
