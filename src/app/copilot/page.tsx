"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Bot,
  Loader2,
  Send,
  UserRound,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";

import {
  useCopilot,
} from "@/lib/copilotContext";

import Logo from "@/components/Logo";

function CopilotContent() {
  const {
    isOpen,
    open,
    messages,
    input,
    setInput,
    sending,
    sendMessage,
    suggestions,
    unreadCount,
    clearUnread,
  } = useCopilot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      clearUnread();
    }
  }, [isOpen, clearUnread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC]">
      {/* TOPBAR */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isOpen && unreadCount > 0 && (
            <button
              onClick={open}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700"
            >
              {unreadCount} new
            </button>
          )}

          <div className="flex items-center gap-2">
            <Logo width={32} height={32} showText={false} />

            <div>
              <p className="text-sm font-bold text-slate-950">
                Career Copilot
              </p>

              <p className="hidden text-[10px] font-medium text-emerald-600 sm:block">
                AI-powered career guidance
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CHAT */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-4xl flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-6">
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
                    className={`flex max-w-[85%] gap-3 sm:max-w-[75%] ${
                      message.role === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <UserRound className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                        message.role === "user"
                          ? "rounded-br-md bg-indigo-600 text-white"
                          : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex max-w-[75%] gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Bot className="h-4 w-4" />
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      Analyzing your career data...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
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
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-3"
            >
              <textarea
                ref={textareaRef}
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
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask about your skills, roadmap, internships or placement..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-[52px] w-13 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
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
        </div>
      </main>
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
