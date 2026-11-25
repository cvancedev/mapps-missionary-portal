"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PortalRole } from "@/lib/auth/portal";

type NavItem = { href: string; label: string };

function navItems(role: PortalRole): NavItem[] {
  const items: NavItem[] = [
    { href: "/", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/trip", label: "My Trip" },
    { href: "/support", label: "Support" },
  ];

  if (role === "administrator") {
    items.push({ href: "/admin", label: "Admin" });
  }

  return items;
}

export default function PortalShell({
  role,
  email,
  children,
}: {
  role: PortalRole;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navItems(role);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-green-900 sm:text-lg">
                MAPPS Missionary Support Portal
              </h1>
              <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                {email || "Missionary Planning & Support"}
              </p>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-5 lg:flex">
              <nav aria-label="Portal" className="flex items-center gap-5">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={
                      isActive(item.href)
                        ? "text-sm font-semibold text-emerald-700"
                        : "text-sm font-medium text-slate-700 transition hover:text-emerald-700"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <form method="post" action="/auth/signout">
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Log Out
                </button>
              </form>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            >
              {menuOpen ? (
                <span className="text-2xl leading-none">×</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          </div>

          {/* Mobile navigation */}
          {menuOpen && (
            <nav
              aria-label="Portal"
              className="mt-4 border-t border-slate-200 pt-3 lg:hidden"
            >
              <div className="flex flex-col">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={
                      isActive(item.href)
                        ? "rounded-lg px-3 py-3 text-sm font-semibold text-emerald-700 hover:bg-slate-50"
                        : "rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    }
                  >
                    {item.label}
                  </Link>
                ))}

                <form method="post" action="/auth/signout" className="mt-2">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6">
          MAPPS Missionary Planning &amp; Support
        </div>
      </footer>
    </div>
  );
}
