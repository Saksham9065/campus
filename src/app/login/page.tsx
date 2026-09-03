"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { loginUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/users";
import type { UserRole } from "@/types";

const roleRedirects: Record<UserRole, string> = {
  student: "/dashboard",
  industry: "/industry",
  academia: "/academician",
  institution: "/institution",
  admin: "/admin",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      console.log("Login: starting login", email);

      const user = await loginUser(email, password);
      console.log("Login: auth successful", user.uid);

      const profile = await getUserProfile(user.uid);
      console.log("Login: profile loaded", profile);

      if (!profile) {
        setError(
          "Your account profile could not be found. Please contact support."
        );
        return;
      }

      const target = roleRedirects[profile.role] || "/dashboard";
      console.log("Login: redirecting to", target, "role:", profile.role);
      router.replace(target);
      console.log("Login: redirect called");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      console.error("Login error:", message);

      if (message.includes("auth/invalid-credential")) {
        setError("Incorrect email or password.");
      } else if (message.includes("auth/user-not-found")) {
        setError("No account exists with this email.");
      } else if (message.includes("auth/wrong-password")) {
        setError("Incorrect password.");
      } else if (message.includes("auth/too-many-requests")) {
        setError(
          "Too many attempts. Please wait a while and try again."
        );
      } else {
        setError(message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Network className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold">
                  Campus<span className="text-indigo-400">Link</span>
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  Skill Intelligence
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                Turn your skills into{" "}
                <span className="text-indigo-400">opportunities.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Access your personalized skill intelligence, career roadmap,
                learning opportunities and placement journey.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Personalized skill assessment",
                  "AI-powered career matching",
                  "Verified Skill Passport",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Secure authentication powered by Firebase
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CampusLink
            </Link>

            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Network className="h-5 w-5" />
                </div>

                <p className="text-xl font-bold">
                  Campus<span className="text-indigo-600">Link</span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-indigo-600">
                WELCOME BACK
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Sign in to CampusLink
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Continue your career intelligence journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your account is securely protected
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
