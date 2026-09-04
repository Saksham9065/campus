"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/users";

const domains = [
  "AI & Full Stack",
  "Frontend Engineering",
  "Backend Engineering",
  "Full Stack Development",
  "DevOps & Cloud",
  "AI & Data Science",
  "Machine Learning & Deep Learning",
  "Software Engineering",
  "Cybersecurity",
  "Blockchain & Web3",
  "Mobile Development (Android)",
  "Mobile Development (iOS)",
  "Cloud Architecture (AWS)",
  "Cloud Architecture (Azure)",
  "Cloud Architecture (GCP)",
  "Database Engineering",
  "Data Engineering",
  "Embedded Systems & IoT",
  "Game Development",
  "UI/UX & Product Design",
  "Computer Networks",
];

const questionOptions = [
  { value: 10, label: "10", minutes: 25 },
  { value: 20, label: "20", minutes: 50 },
  { value: 30, label: "30", minutes: 75 },
  { value: 40, label: "40", minutes: 100 },
  { value: 50, label: "50", minutes: 125 },
];

function PreferencesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const role = searchParams.get("role") || "";

  const [selectedDomains, setSelectedDomains] =
    useState<string[]>([]);
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [questionCount, setQuestionCount] =
    useState(10);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const dropdownRef = useRef<HTMLDivElement>(
    null
  );

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const totalMonths = useMemo(() => {
    const y = parseInt(years || "0", 10);
    const m = parseInt(months || "0", 10);

    return y * 12 + m;
  }, [years, months]);

  const totalExperience = useMemo(() => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years} years ${months} months`;
  }, [totalMonths]);

  const estimatedMinutes = useMemo(() => {
    const option = questionOptions.find(
      (item) => item.value === questionCount
    );

    return option ? option.minutes : 25;
  }, [questionCount]);

  useEffect(() => {
    if (!role) {
      router.replace("/assessment/career");
    }
  }, [role, router]);

  function toggleDomain(item: string) {
    setSelectedDomains((current) =>
      current.includes(item)
        ? current.filter(
            (x) => x !== item
          )
        : [...current, item]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !role) return;

    if (selectedDomains.length === 0) {
      alert(
        "Please select at least one technology domain."
      );
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        assessmentDomain: selectedDomains,
        experienceYears: parseInt(years || "0", 10),
        experienceMonths: totalMonths,
        preferredQuestionCount: questionCount,
      });

      const domainParam =
        selectedDomains
          .map((d) =>
            encodeURIComponent(d)
          )
          .join(",");

      router.push(
        `/assessment/questions?role=${encodeURIComponent(role)}&domains=${domainParam}&questions=${questionCount}`
      );
    } catch {
      setSaving(false);
    }
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

          <span className="hidden text-xs font-medium text-slate-400 sm:block">
            Step 2 of 3
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/assessment/career"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Change career
        </Link>

        <div className="mt-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>

          <p className="mt-5 text-sm font-bold text-indigo-600">
            ASSESSMENT PREFERENCES
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Personalize your assessment
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Select your domain focus and experience level so we can
            tailor questions to your expertise.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-black text-slate-950">
              Preferred Technology Domains
            </h2>

            <p className="mt-2 text-xs font-semibold text-slate-500">
              Select all domains you want to be assessed on.
            </p>

            <div ref={dropdownRef} className="relative mt-4">
              <button
                type="button"
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <span
                  className={
                    selectedDomains.length
                      ? "text-slate-900"
                      : "text-slate-400"
                  }
                >
                  {selectedDomains.length === 0
                    ? "Select domains..."
                    : `${selectedDomains.length} domain${selectedDomains.length !== 1 ? "s" : ""} selected`}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${
                    dropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="p-2">
                    {domains.map((item) => {
                      const active =
                        selectedDomains.includes(
                          item
                        );

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            toggleDomain(item)
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            active
                              ? "bg-indigo-50 text-indigo-700"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="font-medium">
                            {item}
                          </span>

                          {active && (
                            <Check className="h-4 w-4 text-indigo-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedDomains.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedDomains.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700"
                  >
                    {item}

                    <button
                      type="button"
                      onClick={() =>
                        toggleDomain(item)
                      }
                      className="rounded-full p-0.5 text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-black text-slate-950">
              Professional Experience
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Years
                </label>

                <input
                  value={years}
                  onChange={(e) =>
                    setYears(e.target.value)
                  }
                  placeholder="e.g. 2"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Months
                </label>

                <input
                  value={months}
                  onChange={(e) =>
                    setMonths(e.target.value)
                  }
                  placeholder="e.g. 6"
                  type="number"
                  min="0"
                  max="11"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Total Experience: {totalExperience}
            </p>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-black text-slate-950">
              Number of Questions to Attempt
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {questionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setQuestionCount(option.value)
                  }
                  className={`rounded-2xl border px-4 py-3 text-center transition ${
                    questionCount === option.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200"
                  }`}
                >
                  <p className="text-lg font-black">
                    {option.label}
                  </p>

                  <p className="text-[10px] font-semibold text-slate-400">
                    ~{option.minutes} mins
                  </p>
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Selected: {questionCount} questions (Estimated
              time: ~{estimatedMinutes} mins)
            </p>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || selectedDomains.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Start Assessment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function PreferencesPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <PreferencesContent />
    </ProtectedRoute>
  );
}
