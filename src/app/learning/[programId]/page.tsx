"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

import {
  getProgramById,
  type LearningProgram,
  type Lesson,
} from "@/lib/learningEngine";

import {
  type Enrollment,
  type LessonProgress,
  completeLesson,
  subscribeToLessonProgress,
  subscribeToStudentEnrollments,
  syncEnrollmentProgress,
  uncompleteLesson,
} from "@/lib/firestoreLearning";

import { issueCertificate } from "@/lib/firestoreCertificates";

function ProgramLearningContent({
  programId,
}: {
  programId: string;
}) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [enrollments, setEnrollments] =
    useState<Enrollment[]>([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToStudentEnrollments(
        user.uid,
        (data) => {
          setEnrollments(data);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [user]);

  const program = useMemo(
    () => getProgramById(programId),
    [programId]
  );

  const enrollment = useMemo(
    () =>
      enrollments.find(
        (item) =>
          item.programId === programId
      ),
    [enrollments, programId]
  );

  const [lessonProgress, setLessonProgress] =
    useState<LessonProgress[]>([]);

  const completedLessonIds = useMemo(
    () =>
      new Set(
        lessonProgress
          .filter((item) => item.completed)
          .map((item) => item.lessonId)
      ),
    [lessonProgress]
  );

  useEffect(() => {
    if (!enrollment) return;

    const unsubscribe =
      subscribeToLessonProgress(
        enrollment.id,
        (data) => {
          setLessonProgress(data);
        }
      );

    return unsubscribe;
  }, [enrollment]);

  const lessons = useMemo(
    () => program?.lessons ?? [],
    [program]
  );

  const progress = useMemo(() => {
    if (!lessons.length) return 0;

    const completed = lessons.filter((lesson) =>
      completedLessonIds.has(lesson.id)
    ).length;

    return Math.round(
      (completed / lessons.length) * 100
    );
  }, [lessons, completedLessonIds]);

  const [toggling, setToggling] =
    useState<string | null>(null);

  async function handleToggle(lesson: Lesson) {
    if (!enrollment || !user) return;

    setToggling(lesson.id);

    try {
      if (completedLessonIds.has(lesson.id)) {
        await uncompleteLesson(
          enrollment.id,
          lesson.id
        );
      } else {
        const { wasCompleted } = await completeLesson(
          enrollment.id,
          lesson
        );

        if (!wasCompleted) {
          if (progress >= 99) {
            await syncEnrollmentProgress(
              enrollment
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Lesson toggle error:",
        error
      );
    } finally {
      setToggling(null);
    }
  }

  if (loading || !program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/learning"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Learning
            </Link>
            <Logo width={32} height={32} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 font-bold text-slate-800">
              Not enrolled
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              You are not enrolled in this program.
            </p>
            <Link
              href="/learning"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
            >
              Browse programs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isCompleted = progress === 100;

  async function handleComplete() {
    if (!enrollment || !user) return;

    try {
      await syncEnrollmentProgress(enrollment);

      if (progress === 100) {
        await issueCertificate({
          studentId: user.uid,
          studentName:
            profile?.name ||
            user.displayName ||
            "Student",
          programId: enrollment.programId,
          programTitle:
            enrollment.programTitle,
          provider: enrollment.provider,
          skills: enrollment.skills,
        });

        router.push("/learning/certificates");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/learning"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Learning
            </Link>

            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-indigo-600"
            >
              Dashboard
            </Link>
          </div>
          <Logo width={32} height={32} />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <ProgramHeader
            program={program}
            progress={progress}
            completed={completedLessonIds.size}
            total={lessons.length}
            isCompleted={isCompleted}
            onComplete={handleComplete}
          />

        <LessonList
          lessons={lessons}
          completedLessonIds={
            completedLessonIds
          }
          toggling={toggling}
          onToggle={handleToggle}
        />
      </div>
    </main>
  );
}

function ProgramHeader({
  program,
  progress,
  completed,
  total,
  isCompleted,
  onComplete,
}: {
  program: LearningProgram;
  progress: number;
  completed: number;
  total: number;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {program.level} · {program.provider}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {program.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {program.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {program.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {total} lessons
            </span>
          </div>
        </div>

        {isCompleted && (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700"
          >
            <Award className="h-4 w-4" />
            View certificate
          </button>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>
            {completed}/{total} lessons completed
          </span>
          <span>{progress}%</span>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function LessonList({
  lessons,
  completedLessonIds,
  toggling,
  onToggle,
}: {
  lessons: Lesson[];
  completedLessonIds: Set<string>;
  toggling: string | null;
  onToggle: (lesson: Lesson) => void;
}) {
  if (!lessons.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm text-slate-400">
          This program does not have structured lessons yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessonIds.has(
          lesson.id
        );
        const isToggling =
          toggling === lesson.id;

        return (
          <article
            key={lesson.id}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={
                      isCompleted
                        ? "font-bold text-slate-950 line-through decoration-2 decoration-emerald-500"
                        : "font-bold text-slate-950"
                    }
                  >
                    {lesson.title}
                  </h3>
                  {index === lessons.length - 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      Final
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {lesson.description}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {lesson.duration}
                  </span>
                </div>
              </div>
            </div>

            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            ) : (
              <button
                onClick={() => onToggle(lesson)}
                disabled={
                  isCompleted &&
                  completedLessonIds.size !==
                    lessons.length
                }
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  isCompleted
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "bg-slate-950 text-white hover:bg-indigo-600"
                }`}
              >
                {isCompleted ? (
                  "Completed"
                ) : (
                  <>
                    Mark done
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function ProgramLearningPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const [programId, setProgramId] =
    useState<string>("");

  useEffect(() => {
    params.then((p) =>
      setProgramId(p.programId)
    );
  }, [params]);

  if (!programId) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ProgramLearningContent
        programId={programId}
      />
    </ProtectedRoute>
  );
}
