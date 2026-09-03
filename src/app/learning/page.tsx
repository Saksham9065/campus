"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Network,
  Play,
  Sparkles,
  Target,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  recommendLearningPrograms,
  type LearningProgram,
} from "@/lib/learningEngine";

import {
  subscribeToStudentEnrollments,
  updateEnrollmentProgress,
  enrollInProgram,
  type Enrollment,
} from "@/lib/firestoreLearning";

import {
  generateSkillResults,
  getSkillGaps,
} from "@/lib/skillEngine";

import {
  issueCertificate,
} from "@/lib/firestoreCertificates";

function LearningContent() {
  const { user, profile } = useAuth();

  const [enrollments, setEnrollments] =
    useState<Enrollment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [enrolling, setEnrolling] =
    useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<
      "recommended" | "my-learning"
    >("recommended");

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToStudentEnrollments(
        user.uid,
        (data) => {
          setEnrollments(data);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [user]);

  const recommendations = useMemo(() => {
    const scores =
      profile?.skillScores || {};

    const skills =
      generateSkillResults(scores);

    const gaps = getSkillGaps(skills);

    return recommendLearningPrograms(
      gaps
    );
  }, [profile?.skillScores]);

  const enrolledIds = new Set(
    enrollments.map(
      (item) => item.programId
    )
  );

  async function handleEnroll(
    program: LearningProgram
  ) {
    if (!user) return;

    setEnrolling(program.id);

    try {
      await enrollInProgram({
        studentId: user.uid,
        programId: program.id,
        programTitle: program.title,
        provider: program.provider,
        duration: program.duration,
        skills: program.skills,
      });

      setActiveTab("my-learning");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to enroll."
      );
    } finally {
      setEnrolling(null);
    }
  }

  async function handleProgress(
    enrollment: Enrollment,
    progress: number
  ) {
    try {
      await updateEnrollmentProgress(
        enrollment.id,
        progress
      );

      if (
        progress >= 100 &&
        enrollment.status !== "completed" &&
        user
      ) {
        await issueCertificate({
          studentId: user.uid,
          studentName:
            profile?.name ||
            user.displayName ||
            "Student",
          programId:
            enrollment.programId,
          programTitle:
            enrollment.programTitle,
          provider:
            enrollment.provider,
          skills:
            enrollment.skills,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const overallProgress =
    enrollments.length
      ? Math.round(
          enrollments.reduce(
            (sum, item) =>
              sum + item.progress,
            0
          ) / enrollments.length
        )
      : 0;

  const completed =
    enrollments.filter(
      (item) =>
        item.status === "completed"
    ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>

            <span className="font-bold">
              Campus
              <span className="text-indigo-600">
                Link
              </span>
            </span>
          </Link>

          <Link
            href="/roadmap"
            className="text-xs font-bold text-slate-500 hover:text-indigo-600"
          >
            My roadmap →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                Personalized learning
              </div>

              <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Learn what moves your career forward.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Your recommendations are generated from the skills you
                assessed and the gaps you need to close.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <LearningStat
            label="Enrolled programs"
            value={enrollments.length}
            icon={<BookOpen />}
          />

          <LearningStat
            label="Completed"
            value={completed}
            icon={<CheckCircle2 />}
          />

          <LearningStat
            label="Overall progress"
            value={`${overallProgress}%`}
            icon={<Target />}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2">
          <button
            onClick={() =>
              setActiveTab("recommended")
            }
            className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
              activeTab ===
              "recommended"
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Recommended for you
          </button>

          <button
            onClick={() =>
              setActiveTab("my-learning")
            }
            className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
              activeTab ===
              "my-learning"
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            My learning
          </button>
        </div>

        {activeTab ===
          "recommended" && (
          <section className="mt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Based on your skill gaps
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Recommended programs
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Prioritized by how many of your current gaps each program addresses.
              </p>
            </div>

            {recommendations.length ===
            0 ? (
              <NoRecommendations />
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {recommendations
                  .slice(0, 6)
                  .map((item) => (
                    <ProgramCard
                      key={
                        item.program.id
                      }
                      program={
                        item.program
                      }
                      matchingSkills={
                        item.matchingSkills
                      }
                      enrolled={enrolledIds.has(
                        item.program.id
                      )}
                      enrolling={
                        enrolling ===
                        item.program.id
                      }
                      onEnroll={() =>
                        handleEnroll(
                          item.program
                        )
                      }
                    />
                  ))}
              </div>
            )}
          </section>
        )}

        {activeTab ===
          "my-learning" && (
          <section className="mt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Your learning journey
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                My programs
              </h2>
            </div>

            {enrollments.length ===
            0 ? (
              <NoEnrollments
                onExplore={() =>
                  setActiveTab(
                    "recommended"
                  )
                }
              />
            ) : (
              <div className="mt-6 space-y-4">
                {enrollments.map(
                  (enrollment) => (
                    <EnrollmentCard
                      key={
                        enrollment.id
                      }
                      enrollment={
                        enrollment
                      }
                      onProgress={
                        handleProgress
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function LearningStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
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

function ProgramCard({
  program,
  matchingSkills,
  enrolled,
  enrolling,
  onEnroll,
}: {
  program: LearningProgram;
  matchingSkills: string[];
  enrolled: boolean;
  enrolling: boolean;
  onEnroll: () => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
          <BookOpen className="h-5 w-5 text-indigo-600" />
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {matchingSkills.length} gap
          {matchingSkills.length > 1
            ? "s"
            : ""}{" "}
          covered
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        {program.title}
      </h3>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {program.provider}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {program.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {program.skills.map(
          (skill) => (
            <span
              key={skill}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
                matchingSkills.includes(
                  skill
                )
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {skill}
            </span>
          )
        )}
      </div>

      <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-400">
        <span className="flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {program.duration}
        </span>

        <span>{program.level}</span>
      </div>

      <button
        disabled={enrolled || enrolling}
        onClick={onEnroll}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold ${
          enrolled
            ? "bg-emerald-50 text-emerald-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } disabled:cursor-not-allowed`}
      >
        {enrolling ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Enrolling...
          </>
        ) : enrolled ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Enrolled
          </>
        ) : (
          <>
            Start learning
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </article>
  );
}

function EnrollmentCard({
  enrollment,
  onProgress,
}: {
  enrollment: Enrollment;
  onProgress: (
    enrollment: Enrollment,
    progress: number
  ) => void;
}) {
  const completed =
    enrollment.status === "completed";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Play className="h-5 w-5 text-indigo-600" />
            )}
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              {enrollment.programTitle}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {enrollment.provider} •{" "}
              {enrollment.duration}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
            completed
              ? "bg-emerald-50 text-emerald-700"
              : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {completed
            ? "Completed"
            : `${enrollment.progress}% complete`}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-[10px] font-semibold text-slate-400">
          <span>Progress</span>
          <span>
            {enrollment.progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{
              width: `${enrollment.progress}%`,
            }}
          />
        </div>
      </div>

      {!completed && (
        <div className="mt-5">
          <p className="text-[10px] font-bold text-slate-400">
            Update progress
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[25, 50, 75, 100].map(
              (value) => (
                <button
                  key={value}
                  onClick={() =>
                    onProgress(
                      enrollment,
                      value
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                >
                  {value}%
                </button>
              )
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function NoRecommendations() {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <Target className="mx-auto h-8 w-8 text-slate-300" />

      <h3 className="mt-4 font-bold text-slate-800">
        No learning gaps right now.
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Your current skill profile does not require any of the available programs.
      </p>
    </div>
  );
}

function NoEnrollments({
  onExplore,
}: {
  onExplore: () => void;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

      <h3 className="mt-4 font-bold text-slate-800">
        Nothing enrolled yet.
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Pick a recommended program to start improving your profile.
      </p>

      <button
        onClick={onExplore}
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
      >
        Explore recommendations
      </button>
    </div>
  );
}

export default function LearningPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <LearningContent />
    </ProtectedRoute>
  );
}
