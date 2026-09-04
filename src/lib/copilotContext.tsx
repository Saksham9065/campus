"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  subscribeToStudentApplications,
} from "@/lib/firestoreApplications";

import {
  subscribeToStudentEnrollments,
  type Enrollment,
} from "@/lib/firestoreLearning";

import type { Application } from "@/lib/applications";

import type { CampusUser } from "@/types";

export type CopilotMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export type CopilotStudentContext = {
  name?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  careerRole?: string;
  careerRoles?: string[];
  readiness?: number;
  skillScores?: Record<string, number>;
  assessmentDomain?: string[];
  experienceYears?: number;
  experienceMonths?: number;
  placementScore?: number;
  placementStage?: CampusUser["placementStage"];
};

type CopilotContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: CopilotMessage[];
  input: string;
  setInput: (value: string) => void;
  sending: boolean;
  sendMessage: (message?: string) => Promise<void>;
  suggestions: string[];
  unreadCount: number;
  clearUnread: () => void;
};

const CopilotContext = createContext<
  CopilotContextType | undefined
>(undefined);

export const copilotSuggestions = [
  "What are my biggest skill gaps?",
  "How can I improve my placement readiness?",
  "Which career path fits my current skills?",
  "What should I learn next?",
];

export const copilotWelcomeMessage =
  "Hi! I'm your CampusLink Career Copilot. I can analyze your skills, learning progress, applications and placement readiness. What would you like to work on?";

function CopilotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = useAuth();

  const [isOpen, setIsOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<CopilotMessage[]>([
      {
        id: 1,
        role: "assistant",
        content: copilotWelcomeMessage,
      },
    ]);

  const [input, setInput] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [learning, setLearning] =
    useState<Enrollment[]>([]);

  const [lastReadCount, setLastReadCount] =
    useState(1);

  const counterRef = useRef(2);

  useEffect(() => {
    if (!user) return;

    const unsubApps =
      subscribeToStudentApplications(
        user.uid,
        setApplications
      );

    const unsubLearn =
      subscribeToStudentEnrollments(
        user.uid,
        setLearning
      );

    return () => {
      unsubApps();
      unsubLearn();
    };
  }, [user]);

  const unreadCount = Math.max(
    0,
    messages.length - lastReadCount
  );

  function open() {
    setIsOpen(true);
    setLastReadCount(messages.length);
  }

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen((current) => {
      const next = !current;
      if (next) setLastReadCount(messages.length);
      return next;
    });
  }

  function clearUnread() {
    setLastReadCount(messages.length);
  }

  async function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || sending || !profile) return;

    const userMessage: CopilotMessage = {
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
      const studentContext: CopilotStudentContext =
        {
          name: profile.name,
          college: profile.college,
          degree: profile.degree,
          branch: profile.branch,
          year: profile.year,
          careerRole: profile.careerRole,
          careerRoles: profile.careerRoles,
          readiness: profile.readiness,
          skillScores: profile.skillScores,
          assessmentDomain:
            profile.assessmentDomain,
          experienceYears:
            profile.experienceYears,
          experienceMonths:
            profile.experienceMonths,
          placementScore:
            profile.placementScore,
          placementStage:
            profile.placementStage,
        };

      const response = await fetch(
        "/api/copilot",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
            history: messages.map(
              (msg) => ({
                role: msg.role,
                content: msg.content,
              })
            ),
            student: studentContext,
            applications: applications.map(
              (application) => ({
                opportunityTitle:
                  application.opportunityTitle,
                company: application.company,
                status: application.status,
              })
            ),
            learning: learning.map((item) => ({
              programTitle:
                item.programTitle,
              provider: item.provider,
              progress: item.progress,
              status: item.status,
              skills: item.skills,
            })),
          }),
        }
      );

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
          content:
            data.answer ||
            "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error(error);

      const content =
        error instanceof Error
          ? error.message
          : "I couldn't connect to the AI service right now. Please check your Gemini API configuration and try again.";

      setMessages((current) => [
        ...current,
        {
          id: counterRef.current++,
          role: "assistant",
          content,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        messages,
        input,
        setInput,
        sending,
        sendMessage,
        suggestions: copilotSuggestions,
        unreadCount,
        clearUnread,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);

  if (!context) {
    throw new Error(
      "useCopilot must be used inside CopilotProvider"
    );
  }

  return context;
}

export { CopilotProvider };
