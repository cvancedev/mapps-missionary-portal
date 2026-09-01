"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
     <header className="border-b border-slate-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-green-900 sm:text-2xl">
          MAPPS Missionary Support Portal
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Missionary Planning &amp; Support
        </p>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-6 lg:flex">
        <nav className="flex items-center gap-6">
          <span className="font-medium text-emerald-700">
            Dashboard
          </span>

        <Link
  href="/trip"
  className="text-slate-700 transition hover:text-emerald-700"
>
  My Trip
</Link>

     <Link
  href="/support"
  className="text-slate-700 transition hover:text-emerald-700"
>
  Support
</Link>
<span className="text-slate-700">Messages</span>
<span className="text-slate-700">Resources</span>
        </nav>

        <Link
          href="/login"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Log Out
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
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

    {/* Mobile Navigation */}
    {menuOpen && (
      <nav className="mt-5 border-t border-slate-200 pt-4 lg:hidden">
        <div className="flex flex-col">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-3 font-medium text-emerald-700 hover:bg-slate-50"
          >
            Dashboard
          </Link>

          <Link
            href="/trip"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-3 text-slate-700 hover:bg-slate-50"
          >
            My Trip
          </Link>

          <Link
            href="/support"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-3 py-3 text-slate-700 hover:bg-slate-50"
          >
            Support
          </Link>

          <span className="rounded-lg px-3 py-3 text-slate-700">
            Messages
          </span>

          <span className="rounded-lg px-3 py-3 text-slate-700">
            Resources
          </span>

          <Link
            href="/login"
            className="mt-2 rounded-lg border border-slate-200 px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Log Out
          </Link>
        </div>
      </nav>
    )}
  </div>
</header>
  

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section>
          <p className="text-sm font-medium text-green-700">
            Missionary Dashboard
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Welcome, David
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Your personal mission-planning space for preparing your trip,
            requesting support, tracking arrangements, and staying connected
            with MAPPS.
          </p>
        </section>
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                Mission Preparation
              </p>

              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                Your Journey to Kenya
              </h3>
            </div>

            <span className="text-sm font-medium text-slate-500">
              3 of 5 steps complete
            </span>
          </div>

          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-3/5 rounded-full bg-green-700" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-5">
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  ✓
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Intake
                </p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>

              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  ✓
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Trip Details
                </p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>

              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  ✓
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Support Needs
                </p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>

              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  4
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Arrangements
                </p>
                <p className="text-xs text-amber-700">In progress</p>
              </div>

              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  5
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Ready to Travel
                </p>
                <p className="text-xs text-slate-500">Upcoming</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">My Trip</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Kenya Mission
            </h3>
            <p className="mt-2 text-sm text-slate-600">October 12–24, 2026</p>
            <p className="mt-1 text-sm text-slate-600">6 team members</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Support Requests
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              5 Requests
            </h3>
            <p className="mt-2 text-sm text-green-700">3 confirmed</p>
            <p className="mt-1 text-sm text-amber-600">2 in progress</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Next Actions</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              3 Items
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Information still needed before your trip.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">MAPPS Support</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              We&apos;re here to help
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Contact your MAPPS coordinator at any point.
            </p>
          </div>
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Support Needs */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-medium text-green-700">
                Support Needs
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                Your Requested Support
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Track the support MAPPS is coordinating for your mission.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-medium text-slate-900">Accommodation</p>
                  <p className="text-sm text-slate-500">
                    Housing during your visit
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-medium text-slate-900">Airport Pickup</p>
                  <p className="text-sm text-slate-500">
                    Arrival transportation
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Local Transportation
                  </p>
                  <p className="text-sm text-slate-500">
                    Transportation during your mission
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  In Progress
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Kenya Orientation
                  </p>
                  <p className="text-sm text-slate-500">
                    Pre-arrival orientation and guidance
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    Ministry Connections
                  </p>
                  <p className="text-sm text-slate-500">
                    Local ministry and church connections
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  In Progress
                </span>
              </div>
            </div>
          </div>

          {/* Next Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-medium text-green-700">Next Actions</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                Before Your Trip
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                A few items still need your attention.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">
                  Upload final flight itinerary
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  MAPPS needs your final arrival and departure information.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">
                  Confirm team member information
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Review the information for all six missionaries traveling.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">
                  Review Kenya orientation materials
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Review important information before arriving in Kenya.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* MAPPS Contact */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-green-700">MAPPS Support</p>

            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              Your MAPPS Contact
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              We&apos;re here to support you throughout your mission journey.
            </p>

            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">
                MAPPS Mission Support Team
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Kenya Mission Coordination
              </p>

              <p className="mt-4 text-sm text-slate-600">
                Have a question or need help with an arrangement? Contact your
                MAPPS coordinator and our team will help you with the next step.
              </p>
            </div>

            <button className="mt-5 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900">
              Contact MAPPS
            </button>
          </div>

          {/* Visit Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-green-700">
              Visit Information
            </p>

            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              Prepare for Your Mission
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Important information and resources for your upcoming visit.
            </p>

            <div className="mt-6 divide-y divide-slate-100">
              <div className="py-4 first:pt-0">
                <p className="font-medium text-slate-900">Kenya Orientation</p>
                <p className="mt-1 text-sm text-slate-500">
                  Culture, arrival guidance, safety, and what to expect.
                </p>
              </div>

              <div className="py-4">
                <p className="font-medium text-slate-900">Travel Information</p>
                <p className="mt-1 text-sm text-slate-500">
                  Important travel and arrival information for your team.
                </p>
              </div>

              <div className="py-4">
                <p className="font-medium text-slate-900">Emergency Contacts</p>
                <p className="mt-1 text-sm text-slate-500">
                  MAPPS and local contacts available during your visit.
                </p>
              </div>

              <div className="py-4 pb-0">
                <p className="font-medium text-slate-900">
                  Ministry & Local Connections
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Information about ministry partners and local connections.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
