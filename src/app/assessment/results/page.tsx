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
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { getLatestAssessment } from "@/lib/firestoreAssessment";
import {
  buildQuestionReport,
  calculateAssessmentScore,
  calculateReadiness,
  generateSkillResults,
  getSkillGaps,
  getTopSkills,
  suggestCareerRole,
  type AssessmentAttempt,
  type QuestionReport,
  type SkillResult,
} from "@/lib/skillEngine";

function ResultsContent() {
  const { user, profile } = useAuth();

  const [skills, setSkills] = useState<SkillResult[]>([]);
  const [readiness, setReadiness] = useState(0);
  const [attempt, setAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [reports, setReports] = useState<QuestionReport[]>([]);
  const [suggestedRole, setSuggestedRole] = useState<string | null>(null);
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

        const computedAttempt =
          assessment.questions && assessment.answers
            ? calculateAssessmentScore(
                assessment.answers,
                assessment.questions
              )
            : null;

        if (computedAttempt) {
          setReadiness(computedAttempt.score);
        }

        setAttempt(computedAttempt);

        setReports(
          assessment.questions &&
            assessment.questions.length
            ? buildQuestionReport(
                assessment.answers,
                assessment.questions
              )
            : []
        );

        setSuggestedRole(
          assessment.suggestedRole ||
            suggestCareerRole(results, profile?.careerRole)
        );
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

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Attempted
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-white">
                      {attempt ? `${attempt.attempted}/${attempt.total}` : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Correct
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-emerald-300">
                      {attempt ? attempt.correct : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Wrong
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-rose-300">
                      {attempt ? attempt.wrong : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <p className="text-[10px] font-medium text-slate-400">
                      Attempt rate
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-white">
                      {attempt ? `${attempt.attemptRate}%` : "—"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-300">
                  Marks:{" "}
                  <span className="font-bold">
                    {attempt
                      ? `${attempt.correct} / ${attempt.total}`
                      : "—"}
                  </span>
                </p>

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

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Suggested role
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-slate-900">
                      {suggestedRole ?? profile?.careerRole ?? "Data Analyst"}
                    </p>
                  </div>
                </div>
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

            {/* Question Review */}
            <section className="mt-6">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-indigo-600">
                    Question Review
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Your answers, reviewed
                  </h2>
                </div>
                {attempt && (
                  <p className="text-sm font-bold text-slate-600">
                    {attempt.correct} / {attempt.total} correct
                  </p>
                )}
              </div>

              {reports.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Brain className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 font-bold text-slate-800">
                    No question review available
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete the assessment again to see your answers reviewed.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {reports.map((report) => (
                    <QuestionReview
                      key={report.id}
                      report={report}
                    />
                  ))}
                </div>
              )}
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

function QuestionReview({
  report,
}: {
  report: QuestionReport;
}) {
  const labels = ["A", "B", "C", "D"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
          {report.skill}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            report.isUnattempted
              ? "border border-slate-200 bg-slate-50 text-slate-500"
              : report.isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {report.isUnattempted
            ? "Not attempted - 0 / 1 mark"
            : report.isCorrect
            ? "Correct - 1 / 1 mark"
            : "Wrong - 0 / 1 mark"}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-950">
        {report.question}
      </p>

      <div className="mt-3 space-y-2">
        {report.options.map((option, index) => {
          const isSelected =
            report.selectedIndex === index;
          const isCorrectOption =
            report.correctIndex === index;
          const isWrongSelected =
            isSelected && !report.isCorrect;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                isCorrectOption
                  ? "border-emerald-200 bg-emerald-50"
                  : isWrongSelected
                  ? "border-rose-200 bg-rose-50"
                  : isSelected
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-slate-200"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isCorrectOption
                    ? "bg-emerald-100 text-emerald-700"
                    : isWrongSelected
                    ? "bg-rose-100 text-rose-700"
                    : isSelected
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {labels[index] ?? String(index + 1)}
              </span>

              <span className="flex-1 text-slate-700">
                {option}
              </span>

              {isCorrectOption && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              )}
              {isWrongSelected && (
                <X className="h-4 w-4 text-rose-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ResultsContent />
    </ProtectedRoute>
  );
}
