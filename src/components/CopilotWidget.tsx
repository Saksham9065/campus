"use client";

import {
  Bot,
  Loader2,
  Send,
  X,
} from "lucide-react";

import Link from "next/link";

import { useCopilot } from "@/lib/copilotContext";
import { useAuth } from "@/context/AuthContext";

export function CopilotWidget() {
  const { user, profile } = useAuth();

  const {
    isOpen,
    toggle,
    close,
    messages,
    input,
    setInput,
    sending,
    sendMessage,
    suggestions,
    unreadCount,
    clearUnread,
  } = useCopilot();

  if (!user || profile?.role !== "student") {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-2">
      <>
        {unreadCount > 0 ? (
          <button
            onClick={() => {
              clearUnread();
              toggle();
            }}
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-700"
          >
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
            <Bot className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={toggle}
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-700"
          >
            <Bot className="h-6 w-6" />
          </button>
        )}
      </>

        <p className="rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-white">
          Career Copilot
        </p>
      </div>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex w-80 max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
      <div className="border-b border-slate-100 bg-slate-950 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Bot className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <p className="font-bold">
              CampusLink Career Copilot
            </p>
            <p className="text-xs text-emerald-300">
              Online • AI-powered career guidance
            </p>
          </div>

          <button
            onClick={close}
            className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
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
      </div>

      <div className="border-t border-slate-100 p-4">
        {messages.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
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
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={2}
            placeholder="Ask about your skills, roadmap, or placement..."
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="mt-2 flex justify-between">
          <Link
            href="/copilot"
            onClick={close}
            className="text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
          >
            Open full copilot →
          </Link>

          <p className="text-[10px] text-slate-300">
            AI guidance can be imperfect. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
