"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Logo from "@/components/Logo";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  Handshake,
  Lightbulb,
  Loader2,
  LogOut,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import {
  getAcademicianApplications,
  getOpenAcademiaOpportunities,
  type AcademiaApplication,
  type AcademiaOpportunity,
} from "@/lib/academia";

export default function AcademicianPage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <AcademicianDashboard />
    </ProtectedRoute>
  );
}

function AcademicianDashboard() {
  const { logout, profile } = useAuth();

  const [opportunities, setOpportunities] = useState<
    AcademiaOpportunity[]
  >([]);

  const [applications, setApplications] = useState<
    AcademiaApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      if (!profile) return;

      try {
        const [opportunityData, applicationData] =
          await Promise.all([
            getOpenAcademiaOpportunities(),
            getAcademicianApplications(profile.uid),
          ]);

        setOpportunities(opportunityData);
        setApplications(applicationData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profile]);

  const filteredOpportunities = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return opportunities;

    return opportunities.filter((item) =>
      [
        item.title,
        item.organization,
        item.type,
        ...item.requiredExpertise,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [opportunities, search]);

  const selected = applications.filter(
    (item) => item.status === "Selected"
  ).length;

  const completed = applications.filter(
    (item) => item.status === "Completed"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Logo width={36} height={36} />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/academician/applications"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block"
            >
              My Applications
            </Link>

            <Link
              href="/profile"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Profile
            </Link>

            <button
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-4xl bg-linear-to-br from-indigo-700 via-indigo-600 to-cyan-600 p-7 text-white shadow-xl md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              Academia Workspace
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              Welcome, {profile?.name || "Academician"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
              Connect your academic expertise with industry,
              research, training and innovation opportunities.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/academician/opportunities"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
              >
                Explore Opportunities
              </Link>

              <Link
                href="/academician/profile"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                Complete Academic Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<BriefcaseBusiness />}
            label="Open Opportunities"
            value={opportunities.length}
          />

          <Stat
            icon={<BookOpen />}
            label="Applications"
            value={applications.length}
          />

          <Stat
            icon={<Award />}
            label="Selected"
            value={selected}
          />

          <Stat
            icon={<CheckIcon />}
            label="Completed"
            value={completed}
          />
        </section>

        {/* Collaboration categories */}
        <section className="mt-8">
          <div>
            <p className="text-sm font-bold text-indigo-600">
              Collaboration Ecosystem
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Find the right collaboration
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Category
              icon={<BriefcaseBusiness />}
              title="Faculty Internship"
              description="Gain practical industry exposure."
            />

            <Category
              icon={<BookOpen />}
              title="Research"
              description="Collaborate on applied research projects."
            />

            <Category
              icon={<Users />}
              title="Mentorship"
              description="Mentor students and industry teams."
            />

            <Category
              icon={<Lightbulb />}
              title="Innovation"
              description="Participate in challenges and live projects."
            />
          </div>
        </section>

        {/* Opportunities */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-600">
                Recommended Opportunities
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Industry & academia connections
              </h2>
            </div>

            <Link
              href="/academician/opportunities"
              className="text-sm font-bold text-indigo-600"
            >
              View all →
            </Link>
          </div>

          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search research, FDP, mentorship, workshops..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredOpportunities
              .slice(0, 6)
              .map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Handshake className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No opportunities found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another expertise or opportunity type.
              </p>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <QuickAction
            href="/academician/profile"
            icon={<GraduationCap />}
            title="Academic Profile"
            description="Add expertise, specialization and research interests."
          />

          <QuickAction
            href="/academician/applications"
            icon={<BriefcaseBusiness />}
            title="Track Applications"
            description="Monitor your collaboration application pipeline."
          />

          <QuickAction
            href="/academician/collaborations"
            icon={<Handshake />}
            title="Collaborations"
            description="Manage your industry and institution collaborations."
          />
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
          {icon}
        </span>

        <span className="text-2xl font-black">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold">{label}</p>
    </div>
  );
}

function Category({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="w-fit rounded-xl bg-indigo-50 p-3 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function OpportunityCard({
  opportunity,
}: {
  opportunity: AcademiaOpportunity;
}) {
  return (
    <Link
      href={`/academician/opportunities/${opportunity.id}`}
      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {opportunity.type}
          </span>

          <h3 className="mt-4 font-black">
            {opportunity.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {opportunity.organization}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-indigo-600" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {opportunity.requiredExpertise
          .slice(0, 4)
          .map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {skill}
            </span>
          ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
        <span>{opportunity.mode}</span>

        <span>
          {opportunity.duration || "Flexible duration"}
        </span>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <span className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
        {icon}
      </span>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function CheckIcon() {
  return <Sparkles className="h-5 w-5" />;
}
