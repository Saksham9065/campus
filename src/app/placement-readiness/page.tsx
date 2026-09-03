"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToStudentApplications,
} from "@/lib/firestoreApplications";
import {
  subscribeToStudentEnrollments,
  type Enrollment,
} from "@/lib/firestoreLearning";
import {
  calculatePlacementReadiness,
  type PlacementReadiness,
} from "@/lib/placementIntelligence";
import type { Application } from "@/lib/applications";

function getStageColor(stage: PlacementReadiness["stage"]) {
  if (stage === "Placed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (stage === "Interview Ready") {
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }

  if (stage === "Placement Ready") {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }

  if (stage === "Skill Building") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function PlacementReadinessContent() {
  const { user, profile } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let applicationsLoaded = false;
    let enrollmentsLoaded = false;

    const checkLoaded = () => {
      if (applicationsLoaded && enrollmentsLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeApplications =
      subscribeToStudentApplications(
        user.uid,
        (items) => {
          setApplications(items);
          applicationsLoaded = true;
          checkLoaded();
        }
      );

    const unsubscribeEnrollments =
      subscribeToStudentEnrollments(
        user.uid,
        (items) => {
          setEnrollments(items);
          enrollmentsLoaded = true;
          checkLoaded();
        }
      );

    return () => {
      unsubscribeApplications();
      unsubscribeEnrollments();
    };
  }, [user]);

  const intelligence = useMemo(() => {
    if (!profile) return null;

    return calculatePlacementReadiness(
      profile,
      applications,
      enrollments
    );
  }, [profile, applications, enrollments]);

  if (loading || !profile || !intelligence) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Calculating placement readiness...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-slate-950">
              Placement Readiness
            </span>
          </div>

          <Link
            href="/opportunities"
            className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 sm:block"
          >
            Find Opportunities
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white shadow-2xl shadow-indigo-500/10 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <Sparkles className="h-3.5 w-3.5" />
                Placement Intelligence
              </div>

              <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                Know exactly how ready you are.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
                Your readiness score combines skills, profile
                completeness, learning progress and recruitment
                activity to identify your next best action.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${getStageColor(
                    intelligence.stage
                  )}`}
                >
                  {intelligence.stage}
                </span>

                {profile.careerRole && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                    {profile.careerRole}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-[16px] border-white/10">
                <div
                  className="absolute inset-0 rounded-full border-[16px] border-indigo-400"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${
                      intelligence.score
                    }%, 0 ${intelligence.score}%)`,
                  }}
                />

                <div className="relative flex flex-col items-center">
                  <span className="text-5xl font-black">
                    {intelligence.score}
                  </span>

                  <span className="mt-1 text-xs font-semibold text-indigo-200">
                    / 100
                  </span>

                  <span className="mt-2 text-xs font-bold text-white">
                    Readiness Score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={BarChart3}
            title="Skill Readiness"
            value={`${intelligence.skillScore}%`}
            description="Core skills"
          />

          <MetricCard
            icon={UserRound}
            title="Profile"
            value={`${intelligence.profileScore}%`}
            description="Profile completeness"
          />

          <MetricCard
            icon={BookOpen}
            title="Learning"
            value={`${intelligence.learningScore}%`}
            description="Learning progress"
          />

          <MetricCard
            icon={BriefcaseBusiness}
            title="Applications"
            value={`${applications.length}`}
            description="Total applications"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Readiness Breakdown
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  The factors influencing your placement score.
                </p>
              </div>

              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>

            <div className="mt-7 space-y-6">
              <ScoreBar
                title="Technical Skills"
                value={intelligence.skillScore}
              />

              <ScoreBar
                title="Profile Completeness"
                value={intelligence.profileScore}
              />

              <ScoreBar
                title="Learning Progress"
                value={intelligence.learningScore}
              />

              <ScoreBar
                title="Recruitment Activity"
                value={intelligence.applicationScore}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  AI Recommendation
                </h2>
                <p className="text-xs text-slate-500">
                  Your next best actions
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {intelligence.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={`${recommendation}-${index}`}
                    className="flex gap-3 rounded-2xl border border-indigo-100 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                    <p className="text-sm leading-6 text-slate-700">
                      {recommendation}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <SkillList
            title="Your Strengths"
            icon={Award}
            skills={intelligence.strengths}
            emptyMessage="Complete your assessment to identify strengths."
            positive
          />

          <SkillList
            title="Skills To Improve"
            icon={Target}
            skills={intelligence.gaps}
            emptyMessage="No major skill gaps detected."
          />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/assessment/career"
            icon={BarChart3}
            title="Retake Assessment"
            description="Refresh your skill profile with a new assessment."
          />

          <ActionCard
            href="/roadmap"
            icon={TrendingUp}
            title="View Career Roadmap"
            description="Follow a personalized path based on your gaps."
          />

          <ActionCard
            href="/opportunities"
            icon={BriefcaseBusiness}
            title="Find Matching Jobs"
            description="Explore opportunities ranked by skill match."
          />
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof Target;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-black text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ScoreBar({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {title}
        </span>

        <span className="text-sm font-bold text-slate-950">
          {value}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function SkillList({
  title,
  icon: Icon,
  skills,
  emptyMessage,
  positive = false,
}: {
  title: string;
  icon: typeof Target;
  skills: string[];
  emptyMessage: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="font-bold text-slate-950">
          {title}
        </h2>
      </div>

      {skills.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Target;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
      </div>

      <h3 className="mt-5 font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

export default function PlacementReadinessPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <PlacementReadinessContent />
    </ProtectedRoute>
  );
}
