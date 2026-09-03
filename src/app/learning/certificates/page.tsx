"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Network,
  ShieldCheck,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  getStudentCertificates,
  type Certificate,
} from "@/lib/firestoreCertificates";

function CertificatesContent() {
  const { user } = useAuth();

  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const data =
          await getStudentCertificates(
            user.uid
          );

        setCertificates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/learning"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Learning
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Network className="h-3.5 w-3.5" />
            </div>

            <span className="font-bold">
              Campus
              <span className="text-indigo-600">
                Link
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Verified achievements
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            My certificates
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Credentials earned through completed CampusLink learning programs.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center rounded-3xl border border-slate-200 bg-white p-12">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : certificates.length ===
          0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Award className="mx-auto h-8 w-8 text-slate-300" />

            <h2 className="mt-4 font-bold text-slate-800">
              No certificates yet
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Complete a learning program to earn your first verified credential.
            </p>

            <Link
              href="/learning"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white"
            >
              Continue learning
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {certificates.map(
              (certificate) => (
                <CertificateCard
                  key={
                    certificate.id
                  }
                  certificate={
                    certificate
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function CertificateCard({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <Award className="h-5 w-5 text-white" />
          </div>

          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
          CampusLink Certificate
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {certificate.programTitle}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Issued by {certificate.provider}
        </p>
      </div>

      <div className="p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Certificate number
          </p>

          <p className="mt-1 font-mono text-xs font-bold text-slate-700">
            {certificate.certificateNumber}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Verified skills
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {certificate.skills.map(
              (skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600"
          >
            <Download className="h-3.5 w-3.5" />
            Certificate
          </button>

          <Link
            href={`/verify/${certificate.id}`}
            className="flex flex-1 items-center justify-center rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white"
          >
            Verify
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CertificatesPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <CertificatesContent />
    </ProtectedRoute>
  );
}
