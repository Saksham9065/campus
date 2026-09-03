"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  LineChart,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Skill Intelligence",
    description:
      "Assess your technical and soft skills and understand where you stand.",
  },
  {
    icon: Target,
    title: "Smart Skill Mapping",
    description:
      "Map your skills against careers, industries, jobs and learning paths.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Internships & Jobs",
    description:
      "Discover opportunities ranked according to your actual skill profile.",
  },
  {
    icon: LineChart,
    title: "Placement Intelligence",
    description:
      "Track readiness, applications, interviews and placement outcomes.",
  },
];

const ecosystem = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Build skills, discover opportunities and create a verified Skill Passport.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Industry",
    description:
      "Find candidates using skill intelligence instead of resumes alone.",
  },
  {
    icon: Users,
    title: "Academia",
    description:
      "Connect faculty and institutions with meaningful industry opportunities.",
  },
  {
    icon: Network,
    title: "Institutions",
    description:
      "Understand skill gaps, industry demand and placement readiness.",
  },
];

const steps = [
  {
    number: "01",
    title: "Assess",
    description: "Measure your current technical and professional skills.",
  },
  {
    number: "02",
    title: "Discover",
    description: "Find career paths and opportunities matching your profile.",
  },
  {
    number: "03",
    title: "Improve",
    description: "Follow a personalized roadmap to close your skill gaps.",
  },
  {
    number: "04",
    title: "Connect",
    description: "Apply to internships, jobs and industry programs.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[5%] h-[450px] w-[450px] rounded-full bg-indigo-200/30 blur-[120px]" />
        <div className="absolute right-[5%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-200/20 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/85 px-5 shadow-lg shadow-slate-200/30 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Network className="h-5 w-5" />
              </div>

              <div>
                <div className="text-[17px] font-bold tracking-tight">
                  Campus<span className="text-indigo-600">Link</span>
                </div>

                <div className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
                  Skill Intelligence
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <Link
                href="/assessment/career"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
              >
                Assessment
              </Link>

              <Link
                href="/roadmap"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
              >
                Roadmap
              </Link>

              <Link
                href="/opportunities"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
              >
                Opportunities
              </Link>

              <Link
                href="/portfolio"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
              >
                Skill Passport
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:block"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-36">
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Career Intelligence
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                Your skills should open{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  better doors.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                CampusLink connects students, academia, institutions and
                industry through intelligent skill mapping, personalized
                learning, internships and placement intelligence.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Build Your Skill Profile
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/assessment/career"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Take Skill Assessment
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "AI skill analysis",
                  "Personalized roadmap",
                  "Smart job matching",
                  "Verified Skill Passport",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* DASHBOARD PREVIEW */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/30">
                {/* browser bar */}
                <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />

                  <div className="ml-3 flex h-7 flex-1 items-center rounded-lg bg-slate-50 px-3">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <span className="ml-2 text-[10px] text-slate-400">
                      campuslink / dashboard
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                  {/* Main card */}
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Career readiness
                        </p>
                        <p className="mt-2 text-4xl font-bold">—</p>
                      </div>

                      <div className="rounded-xl bg-white/10 p-2">
                        <Brain className="h-4 w-4 text-indigo-300" />
                      </div>
                    </div>

                    <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                    </div>

                    <p className="mt-3 text-[10px] text-slate-400">
                      Complete assessment to unlock your score
                    </p>
                  </div>

                  {/* AI */}
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                    </div>

                    <p className="mt-5 text-xs font-bold text-indigo-950">
                      AI Career Insight
                    </p>

                    <p className="mt-2 text-xs leading-5 text-indigo-700">
                      Discover your strengths and skill gaps with a
                      personalized assessment.
                    </p>
                  </div>
                </div>

                {/* skill cards */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Skills", "Build profile"],
                    ["Career Match", "Discover roles"],
                    ["Skill Gaps", "Take assessment"],
                    ["Opportunities", "Explore jobs"],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-[10px] font-medium text-slate-400">
                        {title}
                      </p>
                      <p className="mt-2 text-xs font-bold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`px-5 py-8 sm:px-8 ${
                index !== 0 ? "border-l border-slate-200" : ""
              }`}
            >
              <span className="text-xs font-bold text-indigo-600">
                {step.number}
              </span>

              <h3 className="mt-2 font-bold text-slate-950">
                {step.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-wide text-indigo-600">
              ONE INTELLIGENT PLATFORM
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              From skill discovery to real career outcomes.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              CampusLink brings assessment, learning, industry connection and
              placement tracking into one connected ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-600">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-wide text-indigo-400">
              CONNECTED ECOSYSTEM
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Four sides. One career ecosystem.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Every stakeholder gets the intelligence and workflows they need
              to create better career outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.08]"
                >
                  <Icon className="h-6 w-6 text-indigo-400" />

                  <h3 className="mt-6 font-bold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-7 py-14 text-center text-white shadow-2xl shadow-indigo-500/20 sm:px-14">
          <ShieldCheck className="mx-auto h-9 w-9" />

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Build the career you are ready for.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100">
            Start with your skill profile. CampusLink will help you understand
            what comes next.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-xl transition hover:-translate-y-0.5"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Network className="h-4 w-4" />
            </div>
            CampusLink
          </div>

          <p>AI-powered skill intelligence for academia and industry.</p>

          <p>© 2026 CampusLink</p>
        </div>
      </footer>
    </main>
  );
}
