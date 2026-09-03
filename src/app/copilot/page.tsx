"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  Send,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  subscribeToStudentApplications,
} from "@/lib/firestoreApplications";

import {
  subscribeToStudentEnrollments,
  type Enrollment,
} from "@/lib/firestoreLearning";

import type { Application } from "@/lib/applications";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What are my biggest skill gaps?",
  "How can I improve my placement readiness?",
  "Which career path fits my current skills?",
  "What should I learn next?",
];

function CopilotContent() {
  const { user, profile } = useAuth();

  const [applications, setApplications] = useState<Application[]>(
    []
  );

  const [learning, setLearning] = useState<Enrollment[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your CampusLink Career Copilot. I can analyze your skills, learning progress, applications and placement readiness. What would you like to work on?",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const counterRef = useRef(1);

  useEffect(() => {
    if (!user) return;

    const unsubscribeApplications =
      subscribeToStudentApplications(
        user.uid,
        setApplications
      );

    const unsubscribeLearning =
      subscribeToStudentEnrollments(
        user.uid,
        setLearning
      );

    return () => {
      unsubscribeApplications();
      unsubscribeLearning();
    };
  }, [user]);

  async function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || sending || !profile) return;

    const userMessage: Message = {
      id: counterRef.current++,
      role: "user",
      content: text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,

          student: {
            name: profile.name,
            college: profile.college,
            degree: profile.degree,
            branch: profile.branch,
            year: profile.year,
            careerRole: profile.careerRole,
            readiness: profile.readiness,
            skillScores: profile.skillScores,
          },

          applications: applications.map(
            (application) => ({
              opportunityTitle:
                application.opportunityTitle,
              company: application.company,
              status: application.status,
            })
          ),

          learning: learning.map((item) => ({
            programTitle: item.programTitle,
            provider: item.provider,
            progress: item.progress,
            status: item.status,
            skills: item.skills,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: counterRef.current++,
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          id: counterRef.current++,
          role: "assistant",
          content:
            "I couldn't connect to the AI service right now. Please check your Gemini API configuration and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Bot className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">
                Career Copilot
              </p>

              <p className="hidden text-[10px] font-medium text-emerald-600 sm:block">
                AI-powered career guidance
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-6 px-4 py-5 sm:px-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mt-5 font-bold text-slate-950">
                Your Career AI
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Copilot understands your CampusLink profile
                and uses your actual career data.
              </p>
            </div>

            <div className="space-y-2">
              <ContextCard
                icon={Target}
                title="Readiness"
                value={
                  profile?.readiness !== undefined
                    ? `${profile.readiness}%`
                    : "Not assessed"
                }
              />

              <ContextCard
                icon={BriefcaseBusiness}
                title="Applications"
                value={`${applications.length}`}
              />

              <ContextCard
                icon={GraduationCap}
                title="Learning"
                value={`${learning.length} programs`}
              />

              <ContextCard
                icon={UserRound}
                title="Career"
                value={
                  profile?.careerRole || "Not selected"
                }
              />
            </div>
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-113px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-cyan-50/50 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h1 className="font-bold text-slate-950">
                  CampusLink Career Copilot
                </h1>

                <p className="text-xs text-slate-500">
                  Personalized guidance based on your data
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  Analyzing your career data...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  disabled={sending}
                  className="whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-3"
            >
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleSubmit(
                      event as unknown as FormEvent
                    );
                  }
                }}
                rows={2}
                placeholder="Ask about your skills, roadmap, internships or placement..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              AI guidance can be imperfect. Verify important
              career, recruitment and institutional information.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ContextCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Target;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p className="truncate text-xs font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CopilotPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <CopilotContent />
    </ProtectedRoute>
  );
}
