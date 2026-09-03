"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";

import type { JobOpportunity } from "@/lib/jobMatcher";

export default function AdminOpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <OpportunityModeration />
    </ProtectedRoute>
  );
}

function OpportunityModeration() {
  const [items, setItems] = useState<
    JobOpportunity[]
  >([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] =
    useState(true);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    async function load() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "opportunities")
          )
        );

        setItems(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<
              JobOpportunity,
              "id"
            >),
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        initialized.current = true;
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const term =
      search.toLowerCase().trim();

    if (!term) return items;

    return items.filter((item) =>
      [
        item.title,
        item.company,
        item.location,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [items, search]);

  async function toggleStatus(
    item: JobOpportunity
  ) {
    try {
      const newStatus =
        item.status === "closed"
          ? "open"
          : "closed";

      await updateDoc(
        doc(
          db,
          "opportunities",
          item.id
        ),
        {
          status: newStatus,
        }
      );

      setItems((current) =>
        current.map((opportunity) =>
          opportunity.id === item.id
            ? {
                ...opportunity,
                status: newStatus,
              }
            : opportunity
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

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
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
          <Link
            href="/admin"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Opportunity Moderation
            </h1>

            <p className="text-xs text-slate-500">
              Review platform recruitment activity
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-7 text-white">
          <p className="text-sm font-bold text-indigo-200">
            Platform Governance
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Opportunity moderation
          </h2>

          <p className="mt-3 text-sm text-slate-300">
            Review and manage opportunities published by
            industry partners.
          </p>
        </section>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search opportunity or company..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <section className="mt-6 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <BriefcaseBusiness />
                  </div>

                  <div>
                    <h3 className="font-black">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.company} ·{" "}
                      {item.location}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {item.type}
                      </span>

                      <span
                        className={
                          item.status === "closed"
                            ? "rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                            : "rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
                        }
                      >
                        {item.status === "closed"
                          ? "Closed"
                          : "Open"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    toggleStatus(item)
                  }
                  className={
                    item.status === "closed"
                      ? "rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white"
                      : "rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                  }
                >
                  {item.status === "closed" ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Reopen
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Close
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            No opportunities found.
          </div>
        )}
      </div>
    </main>
  );
}
