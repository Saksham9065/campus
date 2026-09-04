"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  ArrowRight,
  Bell,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";

import {
  subscribeToStudentApplications,
} from "@/lib/firestoreApplications";

import {
  subscribeToStudentEnrollments,
} from "@/lib/firestoreLearning";

import {
  subscribeToNotifications,
  type CampusNotification,
} from "@/lib/notifications";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Skill Assessment",
    href: "/assessment/career",
    icon: Brain,
  },
  {
    label: "Career Roadmap",
    href: "/roadmap",
    icon: Route,
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    icon: BriefcaseBusiness,
  },
  {
    label: "Learning",
    href: "/learning",
    icon: BookOpen,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: CheckCircle2,
  },
  {
    label: "Placement Readiness",
    href: "/placement-readiness",
    icon: Target,
  },
];

function DashboardContent() {
  const { profile, logout, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [applicationCount, setApplicationCount] =
    useState(0);

  const [notifications, setNotifications] = useState<
    CampusNotification[]
  >([]);

  const firstName =
    profile?.name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToStudentApplications(
        user.uid,
        (applications) => {
          setApplicationCount(
            applications.length
          );
        }
      );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToNotifications(
        user.uid,
        setNotifications
      );

    return unsubscribe;
  }, [user]);

  const [learningProgress, setLearningProgress] =
    useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe =
      subscribeToStudentEnrollments(
        user.uid,
        (enrollments) => {
          if (!enrollments.length) {
            setLearningProgress(0);
            return;
          }

          const total =
            enrollments.reduce(
              (sum, item) =>
                sum + item.progress,
              0
            );

          setLearningProgress(
            Math.round(
              total / enrollments.length
            )
          );
        }
      );

    return unsubscribe;
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <Logo width={36} height={36} subtitle="Student" />
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    item.href === "/dashboard"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      item.href === "/dashboard"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />

                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intelligence
          </p>

          <nav className="space-y-1">
            <Link
              href="/copilot"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            >
              <Sparkles className="h-4 w-4 text-slate-400" />
              Career Copilot
            </Link>
          </nav>
        </div>

        {/* User */}
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {profile?.name
                ?.split(" ")
                .slice(0, 2)
                .map((x) => x[0])
                .join("")
                .toUpperCase() || "S"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {profile?.name || "Student"}
              </p>

              <p className="truncate text-[10px] text-slate-400">
                {profile?.email}
              </p>
            </div>

            <Settings className="h-4 w-4 text-slate-400" />
          </Link>

          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-[270px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">
                Student Workspace
              </p>

              <p className="text-sm font-bold text-slate-900">
                Career Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />

              {(() => {
                const unreadNotifications = notifications.filter(
                  (notification) => !notification.read
                ).length;

                if (unreadNotifications === 0) {
                  return null;
                }

                return (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                    {unreadNotifications > 9
                      ? "9+"
                      : unreadNotifications}
                  </span>
                );
              })()}
            </Link>

            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700"
            >
              {profile?.name?.charAt(0)?.toUpperCase() || "S"}
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/20 sm:p-8">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-indigo-300">
                <Sparkles className="h-3 w-3" />
                AI Career Intelligence
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Good to see you, {firstName}.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Your CampusLink career workspace is ready. Start by
                completing your skill assessment to unlock personalized
                intelligence.
              </p>

              <Link
                href="/assessment/career"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
              >
                Start Skill Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Brain,
                title: "Skill Readiness",
                value:
                  profile?.readiness !== undefined
                    ? `${profile.readiness}%`
                    : "—",
                text:
                  profile?.readiness !== undefined
                    ? "Assessment complete"
                    : "Take assessment",
              },
              {
                icon: Target,
                title: "Career Match",
                value: "—",
                text: "Discover your fit",
              },
              {
                icon: BriefcaseBusiness,
                title: "Applications",
                value: applicationCount,
                text: "Start applying",
              },
              {
                icon: BookOpen,
                title: "Learning Progress",
                value: `${learningProgress}%`,
                text: learningProgress > 0 ? "Keep learning" : "No courses yet",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                      <Icon className="h-4 w-4 text-indigo-600" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>

                  <p className="mt-5 text-xs font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {stat.text}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Main cards */}
          <section className="mt-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Next best action
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-950">
                    Discover where you stand
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Complete the career assessment to generate your skill
                    profile, identify gaps and create your personalized
                    roadmap.
                  </p>
                </div>

                <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 sm:flex">
                  <Brain className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["1", "Choose career", "/assessment/career"],
                  ["2", "Take assessment", "/assessment/questions"],
                  ["3", "Get roadmap", "/roadmap"],
                ].map(([number, title, href]) => (
                  <Link
                    key={number}
                    href={href}
                    className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-indigo-600 shadow-sm">
                        {number}
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                    </div>

                    <p className="mt-4 text-xs font-bold text-slate-800">
                      {title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Profile CTA */}
          <section className="mt-6 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                <UserRound className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-950">
                  Complete your profile
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add your education details to improve your career
                  recommendations.
                </p>
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Edit Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
