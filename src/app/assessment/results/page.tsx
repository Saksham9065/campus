"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { getLatestAssessment } from "@/lib/firestoreAssessment";
import {
  calculateReadiness,
  generateSkillResults,
  getSkillGaps,
  getTopSkills,
  type SkillResult,
} from "@/lib/skillEngine";

function ResultsContent() {
  const { user, profile } = useAuth();

  const [skills, setSkills] = useState<SkillResult[]>([]);
  const [readiness, setReadiness] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      if (!user) return;

      try {
        const assessment =
          await getLatestAssessment(user.uid);

        if (!assessment) {
          setLoading(false);
          return;
        }

        const scores =
          (assessment.skillScores as Record<
            string,
            number
          >) || {};

        const results = generateSkillResults(scores);

        const calculatedReadiness =
          calculateReadiness(results);

        setSkills(results);
        setReadiness(calculatedReadiness);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  const gaps = getSkillGaps(skills);
  const strengths = getTopSkills(skills);

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

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-12">
        {skills.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <Brain className="mx-auto h-10 w-10 text-slate-300" />

            <h1 className="mt-5 text-xl font-bold text-slate-950">
              No assessment found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Complete your skill assessment to see your results.
            </p>

            <Link
              href="/assessment/preferences"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
            >
              Start Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Assessment Complete
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
                Your skill intelligence is ready.
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Hi {profile?.name?.split(" ")[0] || "there"}, here is your
                current skill profile based on your assessment.
              </p>
            </div>

            {/* Readiness */}
            <section className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Target className="h-4 w-4" />
                  Career Readiness
                </div>

                <div className="mt-7 flex items-end gap-2">
                  <span className="text-6xl font-bold">
                    {readiness}%
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Based on your assessed skill performance.
                </p>

                <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all"
                    style={{ width: `${readiness}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      AI Insight
                    </p>

                    <h2 className="mt-1 font-bold text-slate-950">
                      Your next step is skill improvement.
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-500">
                  Your assessment identifies your strongest capabilities
                  and the areas that need improvement. CampusLink will use
                  these signals to create a personalized roadmap and
                  opportunity matches.
                </p>

                <Link
                  href="/roadmap"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
                >
                  View personalized roadmap
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Skills */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Your strengths
                    </h2>
                    <p className="text-xs text-slate-400">
                      Skills currently performing well
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {strengths.length ? (
                    strengths.map((skill) => (
                      <SkillBar
                        key={skill.name}
                        skill={skill}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No strong skills identified yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Gaps */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <Brain className="h-4 w-4 text-amber-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Skill gaps
                    </h2>
                    <p className="text-xs text-slate-400">
                      Skills recommended for improvement
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {gaps.length ? (
                    gaps.map((skill) => (
                      <SkillBar
                        key={skill.name}
                        skill={skill}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-emerald-600">
                      Great! No major gaps identified.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* All skills */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-indigo-600" />

                <div>
                  <h2 className="font-bold text-slate-950">
                    Skill intelligence
                  </h2>

                  <p className="text-xs text-slate-400">
                    Detailed assessment breakdown
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">
                        {skill.name}
                      </span>

                      <span className="text-sm font-bold text-indigo-600">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${skill.score}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {skill.level}
                      </span>

                      <span className="text-[10px] font-bold text-slate-500">
                        {skill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <section className="mt-6 grid gap-4 sm:grid-cols-3">
              <ActionCard
                icon={Target}
                title="Career Roadmap"
                text="See what to learn next."
                href="/roadmap"
              />

              <ActionCard
                icon={BriefcaseIcon}
                title="Find Opportunities"
                text="Discover matching internships."
                href="/opportunities"
              />

              <ActionCard
                icon={Award}
                title="Skill Passport"
                text="Build your verified profile."
                href="/portfolio"
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SkillBar({
  skill,
}: {
  skill: SkillResult;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {skill.name}
        </span>

        <span className="text-xs font-bold text-slate-500">
          {skill.score}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{ width: `${skill.score}%` }}
        />
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
    >
      <Icon className="h-5 w-5 text-indigo-600" />

      <h3 className="mt-5 text-sm font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">{text}</p>

      <div className="mt-4 flex items-center text-xs font-bold text-indigo-600">
        Explore
        <ChevronRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export default function ResultsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ResultsContent />
    </ProtectedRoute>
  );
}
