"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { createUserProfile } from "@/lib/users";
import { registerUser } from "@/lib/auth";
import type { CampusUser, UserRole } from "@/types";
import TopNavbar from "@/components/TopNavbar";

const roles = [
  {
    id: "student" as UserRole,
    title: "Student",
    description: "Build skills & find opportunities",
    icon: GraduationCap,
  },
  {
    id: "industry" as UserRole,
    title: "Industry",
    description: "Hire skilled talent",
    icon: Building2,
  },
  {
    id: "academia" as UserRole,
    title: "Academia",
    description: "Connect with industry",
    icon: Users,
  },
  {
    id: "institution" as UserRole,
    title: "Institution",
    description: "Manage career outcomes",
    icon: School,
  },
];

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      (role === "student" ||
        role === "institution" ||
        role === "academia") &&
      !college.trim()
    ) {
      setError("Please enter your institution name.");
      return;
    }

    if (role === "industry" && !companyName.trim()) {
      setError("Please enter your company name.");
      return;
    }

    try {
      setLoading(true);
      console.log("Signup: starting registration");

      const firebaseUser = await registerUser(
        name.trim(),
        email.trim(),
        password
      );
      console.log("Signup: auth user created", firebaseUser.uid);

      const profile: CampusUser = {
        uid: firebaseUser.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      };

      if (role === "student") {
        profile.college = college.trim();
        profile.degree = degree.trim();
        profile.branch = branch.trim();
        profile.year = year;
      }

      if (role === "institution") {
        profile.college = college.trim();
      }

      if (role === "industry") {
        profile.companyName = companyName.trim();
        profile.designation = designation.trim();
      }

      if (role === "academia") {
        profile.college = college.trim();
        profile.designation = designation.trim();
      }

      await createUserProfile(profile);
      console.log("Signup: profile saved");

      const redirects: Record<UserRole, string> = {
        student: "/dashboard",
        industry: "/industry",
        academia: "/academician",
        institution: "/institution",
        admin: "/admin",
      };

      const target = redirects[role];
      console.log("Signup: redirecting to", target);
      router.replace(target);
      console.log("Signup: redirect called");
    } catch (error: unknown) {
      const rawError =
        error instanceof Error
          ? error.message
          : "Unable to create your account.";

      console.error("Signup error:", rawError);

      const friendlyError =
        rawError.includes("auth/email-already-in-use")
          ? "This email is already registered. Please sign in instead."
          : rawError || "Unable to create your account. Please try again.";

      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f8fafc]">
      <TopNavbar />

      <div className="grid flex-1 lg:grid-cols-[0.72fr_1.28fr]">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
          <div className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-112.5 w-112.5 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 text-white"
            >
              <Logo width={40} height={40} />
            </Link>

            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>

              <h1 className="max-w-md text-5xl font-bold leading-tight tracking-tight text-white">
                Build the future of your{" "}
                <span className="text-indigo-400">career.</span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-400">
                Create your CampusLink account and unlock intelligent
                skill-to-opportunity connections.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Discover your real skill strengths",
                  "Get a personalized career roadmap",
                  "Connect with relevant opportunities",
                  "Build your verified Skill Passport",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10">
                      <Check className="h-3.5 w-3.5 text-indigo-400" />
                    </div>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600">
              CampusLink • Skill Intelligence Platform
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CampusLink
            </Link>

            <div>
              <p className="text-sm font-bold text-indigo-600">
                GET STARTED
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose how you want to use CampusLink.
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {roles.map((item) => {
                const Icon = item.icon;
                const active = role === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {active && (
                      <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}

                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? "text-indigo-600"
                          : "text-slate-500"
                      }`}
                    />

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* BASIC INFORMATION */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="font-bold text-slate-950">
                    Account information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Basic details for your CampusLink profile.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Minimum 8 characters"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repeat password"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* STUDENT */}
              {role === "student" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="font-bold text-slate-950">
                    Education
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    This information helps CampusLink personalize your
                    opportunities.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        College / University
                      </label>

                      <input
                        value={college}
                        onChange={(event) =>
                          setCollege(event.target.value)
                        }
                        placeholder="Your college or university"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Degree
                      </label>

                      <input
                        value={degree}
                        onChange={(event) =>
                          setDegree(event.target.value)
                        }
                        placeholder="B.Tech, BCA, MBA..."
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Branch
                      </label>

                      <input
                        value={branch}
                        onChange={(event) =>
                          setBranch(event.target.value)
                        }
                        placeholder="CSE, IT, ECE..."
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Current year
                      </label>

                      <select
                        value={year}
                        onChange={(event) =>
                          setYear(event.target.value)
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INDUSTRY */}
              {role === "industry" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="font-bold text-slate-950">
                    Company information
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Company name
                      </label>

                      <input
                        value={companyName}
                        onChange={(event) =>
                          setCompanyName(event.target.value)
                        }
                        placeholder="Company / organization name"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Your designation
                      </label>

                      <input
                        value={designation}
                        onChange={(event) =>
                          setDesignation(event.target.value)
                        }
                        placeholder="HR Manager, Recruiter..."
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACADEMIA */}
              {role === "academia" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="font-bold text-slate-950">
                    Academic information
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Institution
                      </label>

                      <input
                        value={college}
                        onChange={(event) =>
                          setCollege(event.target.value)
                        }
                        placeholder="University / college"
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Designation
                      </label>

                      <input
                        value={designation}
                        onChange={(event) =>
                          setDesignation(event.target.value)
                        }
                        placeholder="Professor, Assistant Professor..."
                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INSTITUTION */}
              {role === "institution" && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="font-bold text-slate-950">
                    Institution information
                  </h3>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Institution name
                    </label>

                    <input
                      value={college}
                      onChange={(event) =>
                        setCollege(event.target.value)
                      }
                      placeholder="College / university name"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                <p className="text-xs leading-5 text-slate-500">
                  By creating an account, you agree to use CampusLink for
                  legitimate academic, career and recruitment activities.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create {role === "student" ? "student" : role} account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="py-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
