"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Sparkles,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { saveAssessment } from "@/lib/firestoreAssessment";
import {
  calculateSkillScore,
} from "@/lib/skillEngine";
import { updateUserProfile } from "@/lib/users";
import {
  getQuestionsForRole,
} from "@/lib/assessmentQuestions";

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, profile } = useAuth();

  const role =
    searchParams.get("role") ||
    profile?.careerRole ||
    "Data Analyst";

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] =
    useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const questions = useMemo(
    () => getQuestionsForRole(role),
    [role]
  );

  const question = questions[current];

  const progress = useMemo(
    () =>
      Math.round(
        ((current + 1) / questions.length) * 100
      ),
    [current, questions.length]
  );

  function chooseAnswer(index: number) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: index,
    }));
  }

  async function submitAssessment() {
    if (!user) return;

    try {
      setSubmitting(true);

      const total = questions.length;

      const score = questions.filter(
        (item) => answers[item.id] === item.correct
      ).length;

      const skillTotals: Record<
        string,
        { correct: number; total: number }
      > = {};

      questions.forEach((item) => {
        if (!skillTotals[item.skill]) {
          skillTotals[item.skill] = {
            correct: 0,
            total: 0,
          };
        }

        skillTotals[item.skill].total += 1;

        if (answers[item.id] === item.correct) {
          skillTotals[item.skill].correct += 1;
        }
      });

      const skillScores: Record<string, number> = {};

      Object.entries(skillTotals).forEach(
        ([skill, data]) => {
          skillScores[skill] = calculateSkillScore(
            data.correct,
            data.total
          );
        }
      );

      const readiness = calculateSkillScore(
        score,
        total
      );

      await saveAssessment({
        studentId: user.uid,
        roles: [role],
        answers,
        score,
        total,
        skillScores,
      });

      await updateUserProfile(user.uid, {
        skillScores,
        readiness,
        careerRole: role,
      });

      router.replace(
        `/assessment/results?role=${encodeURIComponent(
          role
        )}`
      );
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  }

  function next() {
    if (answers[question.id] === undefined) return;

    if (current === questions.length - 1) {
      submitAssessment();
      return;
    }

    setCurrent((value) => value + 1);
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <Logo width={32} height={32} />
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock3 className="h-4 w-4" />
            Skill Assessment
          </div>

          <span className="text-xs font-medium text-slate-400">
            Step 3 of 3
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/assessment/career"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Change career
          </Link>

          <span className="text-xs font-bold text-slate-500">
            {current + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-700">
                <Sparkles className="h-3 w-3" />
                {role}
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                Question {current + 1}
              </p>

              <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                {question.question}
              </h1>
            </div>

            <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500 sm:block">
              {question.skill}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {question.options.map((option, index) => {
              const selected =
                answers[question.id] === index;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseAnswer(index)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      selected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span
                    className={`flex-1 text-sm font-medium ${
                      selected
                        ? "text-indigo-950"
                        : "text-slate-700"
                    }`}
                  >
                    {option}
                  </span>

                  {selected && (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
              Select one answer to continue.
            </p>

            <button
              type="button"
              onClick={next}
              disabled={
                answers[question.id] === undefined ||
                submitting
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing...
                </>
              ) : current === questions.length - 1 ? (
                <>
                  Finish Assessment
                  <CheckCircle2 className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function QuestionsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <QuestionsContent />
    </ProtectedRoute>
  );
}
