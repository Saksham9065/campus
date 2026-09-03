"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    if (
      profile &&
      allowedRoles &&
      !allowedRoles.includes(profile.role)
    ) {
      switch (profile.role) {
        case "industry":
          router.replace("/industry");
          break;

        case "academia":
          router.replace("/academician");
          break;

        case "institution":
          router.replace("/institution");
          break;

        case "admin":
          router.replace("/admin");
          break;

        default:
          router.replace("/dashboard");
      }
    }
  }, [
    loading,
    user,
    profile,
    allowedRoles,
    router,
    pathname,
  ]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading CampusLink...
          </p>
        </div>
      </div>
    );
  }

  if (
    profile &&
    allowedRoles &&
    !allowedRoles.includes(profile.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
