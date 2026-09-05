"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/users";
import { uploadResume } from "@/lib/resume";

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

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleResumeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setResumeMessage("");
    setResumeError("");

    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are accepted.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError("File must be under 10MB.");
      event.target.value = "";
      return;
    }

    setPendingFile(file);
  }

  function clearPendingFile() {
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleResumeUpload() {
    if (!user || !pendingFile) return;

    setResumeError("");
    setResumeMessage("");
    setUploadingResume(true);

    try {
      const { url, name } = await uploadResume(
        user.uid,
        pendingFile
      );

      await updateUserProfile(user.uid, {
        resumeUrl: url,
        resumeName: name,
      });

      setResumeMessage("Resume uploaded successfully.");
      clearPendingFile();
    } catch (err) {
      setResumeError(
        err instanceof Error
          ? err.message
          : "Unable to upload resume."
      );
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleResumeRemove() {
    if (!user) return;

    if (
      !window.confirm(
        "Remove your current resume? You can upload a new one anytime."
      )
    ) {
      return;
    }

    setResumeError("");
    setResumeMessage("");
    setUploadingResume(true);

    try {
      await updateUserProfile(user.uid, {
        resumeUrl: "",
        resumeName: "",
      });

      setResumeMessage("Resume removed.");
    } catch {
      setResumeError("Unable to remove resume.");
    } finally {
      setUploadingResume(false);
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
            <Logo width={32} height={32} />
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
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resume
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  Upload your resume as a PDF (max 10MB). It will be
                  shared with employers when you apply to opportunities.
                </p>

                {profile?.resumeUrl ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-emerald-900">
                          {profile.resumeName || "Resume uploaded"}
                        </p>
                        <p className="text-xs text-emerald-700">
                          Ready to use for applications
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        View
                      </a>

                      <button
                        type="button"
                        onClick={handleResumeRemove}
                        disabled={uploadingResume}
                        className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      No resume uploaded yet
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose a PDF file below to upload.
                    </p>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                    id="resume-upload"
                  />

                  <label
                    htmlFor="resume-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
                  >
                    <Upload className="h-4 w-4" />
                    {pendingFile
                      ? "Choose different file"
                      : profile?.resumeUrl
                        ? "Replace resume"
                        : "Choose PDF"}
                  </label>

                  {pendingFile && (
                    <div className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate text-sm font-semibold text-slate-700">
                          {pendingFile.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={clearPendingFile}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {pendingFile && (
                    <button
                      type="button"
                      onClick={handleResumeUpload}
                      disabled={uploadingResume}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload
                        </>
                      )}
                    </button>
                  )}
                </div>

                {resumeMessage && (
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {resumeMessage}
                  </p>
                )}

                {resumeError && (
                  <p className="mt-2 text-xs font-semibold text-rose-700">
                    {resumeError}
                  </p>
                )}
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
