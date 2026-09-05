"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDDEN_PATHS = ["/login", "/signup"];

const SIDEBAR_ROUTES = ["/dashboard", "/industry"];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname) || pathname.startsWith("/verify")) {
    return null;
  }

  const hasSidebar = SIDEBAR_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <div className={hasSidebar ? "lg:pl-[270px]" : ""}>
      <Footer />
    </div>
  );
}
