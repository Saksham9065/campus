"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BellRing,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  MailOpen,
  Sparkles,
  Award,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToNotifications,
  type CampusNotification,
} from "@/lib/notifications";

function getNotificationIcon(type: CampusNotification["type"]) {
  switch (type) {
    case "application":
      return BriefcaseBusiness;

    case "opportunity":
      return Sparkles;

    case "certificate":
      return Award;

    case "learning":
      return GraduationCap;

    default:
      return Bell;
  }
}

function getNotificationStyle(type: CampusNotification["type"]) {
  switch (type) {
    case "application":
      return "bg-indigo-50 text-indigo-600";

    case "opportunity":
      return "bg-cyan-50 text-cyan-600";

    case "certificate":
      return "bg-emerald-50 text-emerald-600";

    case "learning":
      return "bg-violet-50 text-violet-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function NotificationsContent() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<
    CampusNotification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(
      user.uid,
      (items) => {
        setNotifications(items);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  async function handleMarkRead(notification: CampusNotification) {
    if (notification.read) return;

    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  async function handleMarkAllRead() {
    if (!user || unreadCount === 0) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error("Failed to mark all notifications:", error);
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-indigo-600" />

            <span className="font-bold text-slate-950">
              Notifications
            </span>
          </div>

          <button
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MailOpen className="h-4 w-4" />
            )}

            Mark all read
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 p-7 text-white shadow-xl shadow-indigo-500/20">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Bell className="h-5 w-5" />
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Stay in the loop.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                Track application updates, new opportunities,
                learning progress and verified achievements in real
                time.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs font-medium text-indigo-100">
                Unread
              </p>

              <p className="mt-1 text-3xl font-bold">
                {unreadCount}
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Loading notifications...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <Bell className="h-6 w-6 text-indigo-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              You&apos;re all caught up
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Notifications about applications, opportunities and
              achievements will appear here.
            </p>

            <Link
              href="/opportunities"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconStyle = getNotificationStyle(
                notification.type
              );

              return (
                <div
                  key={notification.id}
                  className={`group rounded-2xl border bg-white p-5 shadow-sm transition ${
                    notification.read
                      ? "border-slate-200"
                      : "border-indigo-200 bg-indigo-50/30 shadow-indigo-100"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-950">
                              {notification.title}
                            </h3>

                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                        </div>

                        {!notification.read && (
                          <button
                            onClick={() =>
                              handleMarkRead(notification)
                            }
                            className="self-start rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                          >
                            Mark read
                          </button>
                        )}
                      </div>

                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() =>
                            handleMarkRead(notification)
                          }
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
