"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import TopNavbar from "@/components/TopNavbar";

type Certificate = {
  certificateNumber: string;
  studentId: string;
  studentName: string;
  programTitle: string;
  provider: string;
  skills: string[];
  issuedAt?: {
    seconds?: number;
  };
};

export default function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { certificateId } = await params;

      try {
        const snapshot = await getDoc(
          doc(db, "certificates", certificateId)
        );

        if (snapshot.exists()) {
          setCertificate(
            snapshot.data() as Certificate
          );
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50">
        <TopNavbar />
        <div className="flex flex-1 items-center justify-center">
          Loading verification...
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main className="flex min-h-screen flex-col bg-slate-50 px-5">
        <TopNavbar />
        <div className="flex flex-1 items-center justify-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-xl font-bold">
            Certificate Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This certificate could not be verified.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Go to CampusLink
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <TopNavbar />

      <div className="flex-1 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          CampusLink2
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-8 w-8" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">
                  Verified Credential
                </p>

                <h1 className="mt-1 text-2xl font-black">
                  Certificate Verified
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Student
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {certificate.studentName}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Info
                icon={GraduationCap}
                label="Program"
                value={certificate.programTitle}
              />

              <Info
                icon={ShieldCheck}
                label="Provider"
                value={certificate.provider}
              />

              <Info
                icon={BadgeCheck}
                label="Certificate ID"
                value={certificate.certificateNumber}
              />

              <Info
                icon={CalendarDays}
                label="Status"
                value="Verified"
              />
            </div>

            <div className="mt-8 border-t border-slate-100 pt-7">
              <p className="text-sm font-bold text-slate-900">
                Verified Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {certificate.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-indigo-600">
        <Icon className="h-4 w-4" />

        <span className="text-xs font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
