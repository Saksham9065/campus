"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Cloud,
  Code2,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/users";

const careers = [
  {
    id: "Data Analyst",
    title: "Data Analyst",
    description:
      "Turn data into insights, dashboards and business decisions.",
    icon: BarChart3,
  },
  {
    id: "Software Developer",
    title: "Software Developer",
    description:
      "Build modern web applications and scalable software systems.",
    icon: Code2,
  },
  {
    id: "AI/ML Engineer",
    title: "AI / ML Engineer",
    description:
      "Build intelligent systems using machine learning and data.",
    icon: Brain,
  },
  {
    id: "Cloud Engineer",
    title: "Cloud Engineer",
    description:
      "Design, deploy and manage reliable cloud infrastructure.",
    icon: Cloud,
  },
  {
    id: "Cybersecurity Analyst",
    title: "Cybersecurity Analyst",
    description:
      "Protect systems, networks and data from security threats.",
    icon: Shield,
  },
  {
    id: "UI/UX Designer",
    title: "UI / UX Designer",
    description:
      "Create intuitive digital experiences centered around users.",
    icon: Palette,
  },
];

function CareerPageContent() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [selected, setSelected] = useState(
    profile?.careerRole || ""
  );

  const [saving, setSaving] = useState(false);

  async function continueAssessment() {
    if (!user || !selected) return;

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        careerRole: selected,
        careerRoles: [selected],
      });

      router.push(
        `/assessment/preferences?role=${encodeURIComponent(selected)}`
      );
    } catch {
      setSaving(false);
    }
  }

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

          <span className="hidden text-xs font-medium text-slate-400 sm:block">
            Step 1 of 3
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mt-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>

          <p className="mt-5 text-sm font-bold text-indigo-600">
            CAREER DISCOVERY
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Which career are you targeting?
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Select the career path you want to evaluate. CampusLink will
            use it to personalize your assessment and future roadmap.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career) => {
            const Icon = career.icon;
            const active = selected === career.id;

            return (
              <button
                key={career.id}
                type="button"
                onClick={() => setSelected(career.id)}
                className={`relative rounded-3xl border p-6 text-left transition duration-200 ${
                  active
                    ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
                    : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                }`}
              >
                {active && (
                  <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h2 className="mt-6 font-bold text-slate-950">
                  {career.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {career.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={!selected || saving}
            onClick={continueAssessment}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue"}
            {!saving && (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CareerPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <CareerPageContent />
    </ProtectedRoute>
  );
}
