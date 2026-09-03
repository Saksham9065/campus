"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  Search,
  ShieldCheck,
  Users,
  Loader2,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  getInstitutionStudents,
} from "@/lib/institution";

import type { CampusUser } from "@/types";

export default function InstitutionStudentsPage() {
  return (
    <ProtectedRoute allowedRoles={["institution"]}>
      <Students />
    </ProtectedRoute>
  );
}

function Students() {
  const { profile } = useAuth();

  const [students, setStudents] =
    useState<CampusUser[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function load() {
      const institution =
        profile?.college;

      if (!institution) {
        setLoading(false);
        initialized.current = true;
        return;
      }

      try {
        getInstitutionStudents(institution)
          .then(setStudents)
          .catch(console.error)
          .finally(() => {
            setLoading(false);
            initialized.current = true;
          });
      } catch (error) {
        console.error(error);
        setLoading(false);
        initialized.current = true;
      }
    }

    load();
  }, [profile]);

  const filtered = useMemo(() => {
    const term =
      search.toLowerCase().trim();

    if (!term) return students;

    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.branch,
        student.degree,
        student.careerRole,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [students, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/institution"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Student Intelligence
            </h1>

            <p className="text-xs text-slate-500">
              Institution student directory
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white">
          <p className="text-sm font-bold text-indigo-100">
            Student Analytics
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Know where your students stand
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            Review skill readiness and career alignment.
          </p>
        </section>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search student, branch, degree or career..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No students found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((student) => {
                const readiness =
                  student.readiness || 0;

                return (
                  <div
                    key={student.uid}
                    className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600">
                        {student.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-black">
                          {student.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {student.degree ||
                            "Degree not added"}
                          {student.branch
                            ? ` · ${student.branch}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {student.careerRole ||
                            "Career role not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-xl bg-slate-50 px-4 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Readiness
                        </p>

                        <p className="font-black text-indigo-600">
                          {readiness}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Skills
                        </p>

                        <p className="font-black">
                          {Object.keys(
                            student.skillScores ||
                              {}
                          ).length}
                        </p>
                      </div>

                      <Link
                        href={`/verify/student/${student.uid}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
