import Link from "next/link";
import Logo from "./Logo";

const footerLinks = {
  product: [
    { label: "Features", href: "/" },
    { label: "Skill Assessment", href: "/assessment/career" },
    { label: "Learning", href: "/learning" },
    { label: "Opportunities", href: "/opportunities" },
  ],
  company: [
    { label: "About", href: "/" },
    { label: "Careers", href: "/" },
    { label: "Contact", href: "/" },
  ],
  legal: [
    { label: "Privacy", href: "/" },
    { label: "Terms", href: "/" },
    { label: "Cookies", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo width={32} height={32} />

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              AI-powered skill intelligence platform connecting students,
              academia, institutions and industry.
            </p>

            <p className="mt-4 text-xs text-slate-400">
              © 2026 CampusLink. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h3>

            <ul className="mt-4 space-y-3">
              {footerLinks.product.map(
                (item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>

            <ul className="mt-4 space-y-3">
              {footerLinks.company.map(
                (item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Legal
            </h3>

            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map(
                (item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-400">
              Built for students, academia and industry.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                Terms of Service
              </Link>

              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
