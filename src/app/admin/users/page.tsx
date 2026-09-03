"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  Loader2,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { getAllUsers } from "@/lib/admin";
import type { CampusUser, UserRole } from "@/types";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <UsersPage />
    </ProtectedRoute>
  );
}

function UsersPage() {
  const [users, setUsers] = useState<
    CampusUser[]
  >([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<
    "all" | UserRole
  >("all");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const term =
      search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        [
          user.name,
          user.email,
          user.college,
          user.companyName,
          user.degree,
          user.branch,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesRole =
        role === "all" ||
        user.role === role;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [users, search, role]);

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
              User Management
            </h1>

            <p className="text-xs text-slate-500">
              CampusLink2 ecosystem directory
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-7 text-white">
          <p className="text-sm font-bold text-indigo-200">
            Platform Administration
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Manage ecosystem users
          </h2>

          <p className="mt-3 text-sm text-slate-300">
            Search and review students, industries,
            academicians and institutions.
          </p>
        </section>

        <section className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name, email, college or company..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as
                  | "all"
                  | UserRole
              )
            }
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold"
          >
            <option value="all">
              All Roles
            </option>
            <option value="student">
              Students
            </option>
            <option value="industry">
              Industry
            </option>
            <option value="academia">
              Academia
            </option>
            <option value="institution">
              Institutions
            </option>
            <option value="admin">
              Admin
            </option>
          </select>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 font-bold">
                No users found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.uid}
                  user={user}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function UserRow({
  user,
}: {
  user: CampusUser;
}) {
  const roleConfig = {
    student: {
      icon: <GraduationCap />,
      label: "Student",
    },
    industry: {
      icon: <Building2 />,
      label: "Industry",
    },
    academia: {
      icon: <GraduationCap />,
      label: "Academia",
    },
    institution: {
      icon: <Building2 />,
      label: "Institution",
    },
    admin: {
      icon: <ShieldCheck />,
      label: "Admin",
    },
  };

  const config = roleConfig[user.role];

  return (
    <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {config.icon}
        </div>

        <div>
          <p className="font-black">
            {user.name}
          </p>

          <p className="text-sm text-slate-500">
            {user.email}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {user.college ||
              user.companyName ||
              "Profile incomplete"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
          {config.label}
        </span>

        {user.role === "student" && (
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {user.readiness || 0}% readiness
          </span>
        )}
      </div>
    </div>
  );
}
