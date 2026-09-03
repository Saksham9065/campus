"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Network,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getLatestAssessment } from "@/lib/firestoreAssessment";
import {
  generateRoadmap,
  generateSkillResults,
  type RoadmapNode,
} from "@/lib/skillEngine";
import {
  recommendLearningPrograms,
  type LearningProgram,
} from "@/lib/learningEngine";

function RoadmapContent() {
  const { user, profile } = useAuth();

  const [roadmap, setRoadmap] = useState<
    RoadmapNode[]
  >([]);

  const [recommendations, setRecommendations] =
    useState<
      {
        program: LearningProgram;
        relevance: number;
        matchingSkills: string[];
      }[]
    >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
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

        const skills = generateSkillResults(scores);

        const generated =
          generateRoadmap(skills);

        setRoadmap(generated);

        const gaps = skills.filter(
          (skill) => skill.score < 70
        );

        setRecommendations(
          recommendLearningPrograms(gaps)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!roadmap.length) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Network className="h-4 w-4" />
              </div>

              <span className="font-bold">
                Campus<span className="text-indigo-600">
                  Link
                </span>
              </span>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Target className="h-6 w-6 text-indigo-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Your roadmap is waiting.
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Complete your skill assessment first. CampusLink will then
            generate a personalized learning and career roadmap.
          </p>

          <Link
            href="/assessment/career"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Take Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>

            <span className="font-bold">
              Campus<span className="text-indigo-600">
                Link
              </span>
            </span>
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
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Personalized Career Roadmap
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Your path to career readiness.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Based on your latest skill assessment, CampusLink has created
            a learning path tailored to your current capabilities.
          </p>

          {profile?.careerRole && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
              <Target className="h-4 w-4 text-indigo-600" />
              Target role: {profile.careerRole}
            </div>
          )}
        </div>

        {/* Roadmap */}
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Target className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-950">
                Skill-to-career journey
              </h2>

              <p className="text-xs text-slate-400">
                Complete each stage to move forward.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute bottom-7 left-[19px] top-7 w-px bg-slate-200 sm:left-[23px]" />

            <div className="space-y-7">
              {roadmap.map((node, index) => (
                <div
                  key={node.id}
                  className="relative flex gap-5"
                >
                  {/* Node */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                      node.status === "completed"
                        ? "bg-emerald-500 text-white"
                        : node.status === "current"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {node.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 rounded-2xl border p-5 ${
                      node.status === "current"
                        ? "border-indigo-200 bg-indigo-50/50"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {node.title}
                          </h3>

                          {node.status === "current" && (
                            <span className="rounded-full bg-indigo-600 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {node.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {node.duration}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {node.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {node.status === "current" && (
                      <Link
                        href="/learning"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Start learning
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Learning */}
        <section className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Recommended learning
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Close your highest-priority gaps.
              </h2>
            </div>

            <Link
              href="/learning"
              className="hidden items-center gap-1 text-xs font-bold text-indigo-600 sm:flex"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {recommendations.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {recommendations
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.program.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        {item.relevance} gap
                        {item.relevance > 1
                          ? "s"
                          : ""}
                        covered
                      </span>
                    </div>

                    <h3 className="mt-5 font-bold text-slate-950">
                      {item.program.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.program.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.matchingSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-slate-400">
                        {item.program.provider} •{" "}
                        {item.program.duration}
                      </span>

                      <Link
                        href={`/learning?program=${item.program.id}`}
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <Wrench className="mx-auto h-7 w-7 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Your current profile has no recommended courses.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Keep building your skills and we will update your roadmap.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <RoadmapContent />
    </ProtectedRoute>
  );
}
