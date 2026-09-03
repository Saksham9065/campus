"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  getPassportById,
  type SkillPassport,
} from "@/lib/passport";

export default function VerifyPassportPage({
  params,
}: {
  params: Promise<{ passportId: string }>;
}) {
  const [passport, setPassport] = useState<SkillPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { passportId } = await params;

        const result = await getPassportById(passportId);

        if (!result) {
          setNotFound(true);
          return;
        }

        setPassport(result);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying passport...
        </div>
      </main>
    );
  }

  if (notFound || !passport) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Passport not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This passport ID does not exist or is no longer available.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Go to CampusLink2
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">
            Campus<span className="text-indigo-600">Link2</span>
          </Link>

          <div className="flex items-center gap-2 text-sm font-bold text-green-600">
            <ShieldCheck className="h-5 w-5" />
            Verified
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-green-600 p-4 text-white">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div>
              <p className="text-sm font-bold text-green-700">
                AUTHENTIC CAMPUSLINK2 RECORD
              </p>

              <h1 className="mt-1 text-2xl font-black text-green-950 md:text-3xl">
                Skill Passport Verified
              </h1>

              <p className="mt-2 text-sm leading-6 text-green-800">
                This digital passport was issued and can be verified through
                CampusLink2.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <UserRound className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {passport.studentName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {passport.studentEmail}
                </p>

                {passport.careerRole && (
                  <p className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    {passport.careerRole}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 md:min-w-48">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Readiness
              </p>

              <p className="mt-1 text-4xl font-black text-indigo-600">
                {passport.readiness}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Latest skill assessment
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <Info
              icon={<GraduationCap className="h-4 w-4" />}
              label="College"
              value={passport.college || "Not available"}
            />

            <Info
              icon={<GraduationCap className="h-4 w-4" />}
              label="Degree"
              value={passport.degree || "Not available"}
            />

            <Info
              icon={<UserRound className="h-4 w-4" />}
              label="Branch"
              value={passport.branch || "Not available"}
            />

            <Info
              icon={<Sparkles className="h-4 w-4" />}
              label="Year"
              value={passport.year || "Not available"}
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-indigo-600" />

            <div>
              <h2 className="text-xl font-black">
                Verified Skills
              </h2>

              <p className="text-sm text-slate-500">
                Skills recorded from CampusLink2 assessments
              </p>
            </div>
          </div>

          {passport.skills.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              No assessed skills available.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {passport.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{skill.name}</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {skill.level}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-black text-indigo-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {skill.score}%
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {skill.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-amber-500" />

            <div>
              <h2 className="text-xl font-black">
                Verified Certifications
              </h2>

              <p className="text-sm text-slate-500">
                Certificates associated with this passport
              </p>
            </div>
          </div>

          {passport.certificates.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              No certificates available.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {passport.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">
                        {certificate.programTitle}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {certificate.provider}
                      </p>
                    </div>

                    <CheckCircle2 className="h-5 w-5 text-green-600" />
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

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-6 w-6 text-blue-600" />

            <div>
              <h2 className="text-xl font-black">
                Career Activity
              </h2>

              <p className="text-sm text-slate-500">
                Internship and placement applications
              </p>
            </div>
          </div>

          {passport.applications.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              No career activity available.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {passport.applications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {application.opportunityTitle}
                    </p>

                    <p className="text-sm text-slate-500">
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

        <footer className="py-10 text-center">
          <p className="text-xs text-slate-400">
            Passport ID
          </p>

          <p className="mt-1 font-mono text-xs font-bold text-slate-500">
            {passport.passportId}
          </p>

          <p className="mt-3 text-xs text-slate-400">
            Verified by CampusLink2
          </p>
        </footer>
      </div>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}
