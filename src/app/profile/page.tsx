"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Network,
  Save,
  Sparkles,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/users";

function ProfileContent() {
  const { user, profile } = useAuth();

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initialized = useRef(false);

  useEffect(() => {
    if (!profile || initialized.current) return;

    initialized.current = true;

    setName(profile.name || "");
    setCollege(profile.college || "");
    setDegree(profile.degree || "");
    setBranch(profile.branch || "");
    setYear(profile.year || "");
  }, [profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setError("");
    setSaved(false);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!college.trim()) {
      setError("Please enter your college.");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        name: name.trim(),
        college: college.trim(),
        degree: degree.trim(),
        branch: branch.trim(),
        year,
      });

      setSaved(true);
    } catch {
      setError(
        "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>

            <span className="font-bold">
              Campus<span className="text-indigo-600">Link</span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Heading */}
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
          </div>

          <p className="mt-5 text-sm font-bold text-indigo-600">
            STUDENT PROFILE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Build your career profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Keep your academic information updated so CampusLink can
            personalize your skill mapping, opportunities and career
            recommendations.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Profile card */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
              {initials}
            </div>

            <div className="mt-5 text-center">
              <h2 className="font-bold text-slate-950">
                {name || "Your Name"}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />

                <span className="text-xs font-bold text-slate-800">
                  Profile completion
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{
                    width: `${
                      [
                        name,
                        college,
                        degree,
                        branch,
                        year,
                      ].filter(Boolean).length * 20
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                Complete your profile for better recommendations.
              </p>
            </div>
          </aside>

          {/* Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="font-bold text-slate-950">
                Personal & academic details
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                These details are stored securely in your CampusLink
                profile.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Profile saved successfully.
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  value={user?.email || ""}
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  College / University
                </label>

                <input
                  value={college}
                  onChange={(event) =>
                    setCollege(event.target.value)
                  }
                  placeholder="e.g. University / College name"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Degree
                  </label>

                  <input
                    value={degree}
                    onChange={(event) =>
                      setDegree(event.target.value)
                    }
                    placeholder="B.Tech, BCA, MBA..."
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Branch
                  </label>

                  <input
                    value={branch}
                    onChange={(event) =>
                      setBranch(event.target.value)
                    }
                    placeholder="CSE, IT, ECE..."
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Current year
                </label>

                <select
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
