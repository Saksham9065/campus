"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  createOrUpdatePassport,
  type SkillPassport,
} from "@/lib/passport";

export default function PortfolioPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <PassportContent />
    </ProtectedRoute>
  );
}

function PassportContent() {
  const { user, profile } = useAuth();

  const [passport, setPassport] = useState<SkillPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    async function loadPassport() {
      if (!profile || !user) return;

      try {
        setLoading(true);

        const result = await createOrUpdatePassport(profile);

        setPassport(result);
        setVerificationUrl(
          `${window.location.origin}/verify/${result.passportId}`
        );
      } catch (err) {
        console.error(err);
        setError("Unable to generate your Skill Passport.");
      } finally {
        setLoading(false);
      }
    }

    loadPassport();
  }, [profile, user]);

  async function refreshPassport() {
    if (!profile) return;

    try {
      setGenerating(true);
      setError("");

      const result = await createOrUpdatePassport(profile);

      setPassport(result);
      setVerificationUrl(
        `${window.location.origin}/verify/${result.passportId}`
      );
    } catch (err) {
      console.error(err);
      setError("Could not refresh your passport.");
    } finally {
      setGenerating(false);
    }
  }

  function printPassport() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Building your Skill Passport...
        </div>
      </div>
    );
  }

  if (error || !passport) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-indigo-500" />

          <h1 className="text-xl font-bold text-slate-900">
            Passport unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "We could not create your Skill Passport."}
          </p>

          <button
            onClick={refreshPassport}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const strongSkills = passport.skills.filter(
    (skill) => skill.status === "Strong"
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshPassport}
              disabled={generating}
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 sm:flex sm:items-center sm:gap-2"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Refresh Passport
            </button>

            <button
              onClick={printPassport}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl shadow-indigo-100 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Verified Skill Passport
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                {passport.studentName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
                A verified digital profile of skills, learning achievements
                and career progress powered by CampusLink2.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                {passport.college && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                    <GraduationCap className="h-4 w-4" />
                    {passport.college}
                  </span>
                )}

                {passport.careerRole && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                    <BriefcaseBusiness className="h-4 w-4" />
                    {passport.careerRole}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center rounded-3xl bg-white p-5 text-slate-900 shadow-lg">
              {verificationUrl ? (
                <QRCode
                  value={verificationUrl}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              ) : (
                <div className="flex h-[150px] w-[150px] items-center justify-center bg-slate-100 text-xs text-slate-400">
                  Generating...
                </div>
              )}

              <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                <QrCode className="h-4 w-4" />
                Scan to Verify
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Passport ID
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-slate-800">
              {passport.passportId}
            </p>
          </div>

          <Link
            href={`/verify/passport/${passport.passportId}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Public verification
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Skill Readiness"
            value={`${passport.readiness}%`}
            description="Latest assessment"
          />

          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Verified Skills"
            value={String(passport.skills.length)}
            description={`${strongSkills.length} strong skills`}
          />

          <StatCard
            icon={<Award className="h-5 w-5" />}
            label="Certificates"
            value={String(passport.certificates.length)}
            description="Verified learning"
          />

          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            label="Applications"
            value={String(passport.applications.length)}
            description="Career activity"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  Skill Intelligence
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Verified skill profile
                </h2>
              </div>

              <Sparkles className="h-6 w-6 text-indigo-500" />
            </div>

            {passport.skills.length === 0 ? (
              <EmptyState
                title="No skills assessed yet"
                description="Complete your skill assessment to populate your Skill Passport."
                href="/assessment/career"
                action="Take Assessment"
              />
            ) : (
              <div className="mt-6 space-y-4">
                {passport.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {skill.status === "Strong" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        )}

                        <span className="text-sm font-semibold">
                          {skill.name}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-slate-700">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>

                    <div className="mt-1.5 flex justify-between text-xs text-slate-400">
                      <span>{skill.level}</span>
                      <span>{skill.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold">Academic Profile</h2>
                <p className="text-xs text-slate-500">
                  Your verified identity information
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InfoRow label="Name" value={passport.studentName} />

              <InfoRow label="Email" value={passport.studentEmail} />

              <InfoRow
                label="College"
                value={passport.college || "Not added"}
              />

              <InfoRow
                label="Degree"
                value={passport.degree || "Not added"}
              />

              <InfoRow
                label="Branch"
                value={passport.branch || "Not added"}
              />

              <InfoRow
                label="Year"
                value={passport.year || "Not added"}
              />
            </div>

            <Link
              href="/profile"
              className="mt-6 block rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              Update Profile
            </Link>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Award className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">Verified Certifications</h2>
              <p className="text-xs text-slate-500">
                Learning achievements linked to your passport
              </p>
            </div>
          </div>

          {passport.certificates.length === 0 ? (
            <EmptyState
              title="No certificates yet"
              description="Complete a learning program to earn your first verified certificate."
              href="/learning"
              action="Explore Learning"
            />
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {passport.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {certificate.programTitle}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {certificate.provider}
                      </p>
                    </div>

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {certificate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 font-mono text-xs text-slate-400">
                    {certificate.certificateNumber}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">Career Activity</h2>
              <p className="text-xs text-slate-500">
                Your internship and placement applications
              </p>
            </div>
          </div>

          {passport.applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Explore matched opportunities and start building your career activity."
              href="/opportunities"
              action="Explore Opportunities"
            />
          ) : (
            <div className="mt-6 space-y-3">
              {passport.applications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {application.opportunityTitle}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {application.company}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />

              <div>
                <h3 className="font-bold text-green-900">
                  Passport verification enabled
                </h3>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Anyone with your QR code or verification link can verify
                  the authenticity of this CampusLink2 Skill Passport.
                </p>
              </div>
            </div>

            <Link
              href={`/verify/passport/${passport.passportId}`}
              target="_blank"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              Verify Passport
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
          {icon}
        </span>

        <span className="text-2xl font-black text-slate-900">{value}</span>
      </div>

      <p className="mt-4 text-sm font-bold">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <p className="font-bold text-slate-800">{title}</p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
      >
        {action}
      </Link>
    </div>
  );
}
