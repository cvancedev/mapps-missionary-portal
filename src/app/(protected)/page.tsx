import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal";
import {
  getCurrentTrip,
  getProfile,
  getSupportRequests,
} from "@/lib/data/portal";
import { firstName, formatDateRange } from "@/lib/format";
import {
  normalizeStatus,
  supportStatusBadge,
  supportStatusLabel,
  supportTypeLabel,
} from "@/lib/support";

type StepState = "complete" | "current" | "upcoming";

function stepCircleClass(state: StepState): string {
  if (state === "complete") {
    return "flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white";
  }
  if (state === "current") {
    return "flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700";
  }
  return "flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500";
}

export default async function DashboardPage() {
  const { supabase, user } = await requirePortalAccess();

  const [profileResult, tripResult, requestsResult] = await Promise.all([
    getProfile(supabase, user.id),
    getCurrentTrip(supabase, user.id),
    getSupportRequests(supabase, user.id),
  ]);

  const profile = profileResult.profile;
  const trip = tripResult.trip;
  const requests = requestsResult.requests;
  const loadError = profileResult.error || tripResult.error || requestsResult.error;

  const hasProfile = Boolean(profile?.full_name);
  const hasTrip = Boolean(trip);
  const totalRequests = requests.length;
  const confirmedCount = requests.filter(
    (request) => normalizeStatus(request.status) === "confirmed"
  ).length;
  const inProgressCount = requests.filter(
    (request) => normalizeStatus(request.status) === "in_progress"
  ).length;
  const allConfirmed = totalRequests > 0 && confirmedCount === totalRequests;

  const steps: { label: string; state: StepState; note: string }[] = [
    {
      label: "Profile",
      state: hasProfile ? "complete" : "current",
      note: hasProfile ? "Complete" : "Needs details",
    },
    {
      label: "Trip Details",
      state: hasTrip ? "complete" : hasProfile ? "current" : "upcoming",
      note: hasTrip ? "Complete" : hasProfile ? "In progress" : "Upcoming",
    },
    {
      label: "Support Needs",
      state:
        totalRequests > 0 ? "complete" : hasTrip ? "current" : "upcoming",
      note:
        totalRequests > 0 ? "Complete" : hasTrip ? "In progress" : "Upcoming",
    },
    {
      label: "Arrangements",
      state:
        allConfirmed ? "complete" : totalRequests > 0 ? "current" : "upcoming",
      note:
        allConfirmed ? "Complete" : totalRequests > 0 ? "In progress" : "Upcoming",
    },
    {
      label: "Ready to Travel",
      state: allConfirmed ? "complete" : "upcoming",
      note: allConfirmed ? "Complete" : "Upcoming",
    },
  ];

  const completedSteps = steps.filter((step) => step.state === "complete").length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  const nextActions: { title: string; body: string; href?: string; cta?: string }[] =
    [];

  if (!hasProfile) {
    nextActions.push({
      title: "Complete your profile",
      body: "Add your name so MAPPS knows who is preparing for this mission.",
      href: "/profile",
      cta: "Open profile",
    });
  }

  if (!hasTrip) {
    nextActions.push({
      title: "Add your trip details",
      body: "Share your destination and dates so MAPPS can begin coordinating.",
      href: "/trip",
      cta: "Plan trip",
    });
  }

  if (hasTrip && totalRequests === 0) {
    nextActions.push({
      title: "Request support",
      body: "Tell MAPPS which arrangements your team needs.",
      href: "/support",
      cta: "Request support",
    });
  }

  if (totalRequests > 0 && !allConfirmed) {
    nextActions.push({
      title: "MAPPS is coordinating your arrangements",
      body: `${totalRequests - confirmedCount} of ${totalRequests} request${
        totalRequests === 1 ? "" : "s"
      } still waiting on confirmation.`,
    });
  }

  const greetingName = firstName(profile?.full_name ?? null);
  const contactEmail = process.env.MAPPS_CONTACT_EMAIL?.trim() || null;
  const contactHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(
        "MAPPS missionary support"
      )}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section>
        <p className="text-sm font-medium text-green-700">
          Missionary Dashboard
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome{greetingName ? `, ${greetingName}` : ""}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Your personal mission-planning space for preparing your trip,
          requesting support, tracking arrangements, and staying connected with
          MAPPS.
        </p>
      </section>

      {loadError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          Some of your information could not be loaded right now. Please refresh
          the page, or contact your MAPPS coordinator if it continues.
        </div>
      )}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">
              Mission Preparation
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {trip?.destination
                ? `Your journey to ${trip.destination}`
                : "Your mission journey"}
            </h3>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {completedSteps} of {steps.length} steps complete
          </span>
        </div>

        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-green-700 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step.label}>
                <div className={stepCircleClass(step.state)}>
                  {step.state === "complete" ? "✓" : index + 1}
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {step.label}
                </p>
                <p
                  className={
                    step.state === "current"
                      ? "text-xs text-amber-700"
                      : "text-xs text-slate-500"
                  }
                >
                  {step.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">My Trip</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            {trip?.destination ?? "Not planned yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {formatDateRange(trip?.start_date ?? null, trip?.end_date ?? null) ??
              "Dates not set"}
          </p>
          <Link
            href="/trip"
            className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {hasTrip ? "Update trip" : "Plan trip"}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Support Requests</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            {totalRequests === 0
              ? "None yet"
              : `${totalRequests} Request${totalRequests === 1 ? "" : "s"}`}
          </h3>
          {totalRequests === 0 ? (
            <p className="mt-2 text-sm text-slate-600">
              No support requested so far.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-green-700">
                {confirmedCount} confirmed
              </p>
              <p className="mt-1 text-sm text-amber-600">
                {inProgressCount} in progress
              </p>
            </>
          )}
          <Link
            href="/support"
            className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View support
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Next Actions</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            {nextActions.length === 0
              ? "Nothing outstanding"
              : `${nextActions.length} Item${nextActions.length === 1 ? "" : "s"}`}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {nextActions.length === 0
              ? "Your preparation is up to date."
              : "Information still needed before your trip."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">MAPPS Support</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            We are here to help
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Contact your MAPPS coordinator at any point.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-green-700">Support Needs</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Your Requested Support
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Track the support MAPPS is coordinating for your mission.
            </p>
          </div>

          {totalRequests === 0 ? (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-600">
                You have not requested support yet.
              </p>
              <Link
                href="/support"
                className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Request support
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {supportTypeLabel(request.request_type)}
                    </p>
                    {request.details && (
                      <p className="mt-1 max-w-md text-sm leading-5 text-slate-500">
                        {request.details}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${supportStatusBadge(
                      request.status
                    )}`}
                  >
                    {supportStatusLabel(request.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-green-700">Next Actions</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Before Your Trip
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {nextActions.length === 0
                ? "Nothing needs your attention right now."
                : "A few items still need your attention."}
            </p>
          </div>

          {nextActions.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              MAPPS has everything it needs for now. You can update your details
              at any time.
            </p>
          ) : (
            <div className="space-y-4">
              {nextActions.slice(0, 3).map((action) => (
                <div
                  key={action.title}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <p className="font-medium text-slate-900">{action.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{action.body}</p>
                  {action.href && action.cta && (
                    <Link
                      href={action.href}
                      className="mt-2 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      {action.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-green-700">MAPPS Support</p>

          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            Your MAPPS Contact
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            We are here to support you throughout your mission journey.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">
              MAPPS Mission Support Team
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Mission coordination and arrangements
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Have a question or need help with an arrangement? Contact your
              MAPPS coordinator and our team will help you with the next step.
            </p>
          </div>

          {contactHref ? (
            <a
              href={contactHref}
              className="mt-5 inline-flex rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            >
              Email MAPPS
            </a>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Your coordinator contact details will be shared by the MAPPS team.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-green-700">Visit Information</p>

          <h3 className="mt-1 text-xl font-semibold text-slate-900">
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
                MAPPS shares local and emergency contact details before
                departure.
              </p>
            </div>

            <div className="py-4 pb-0">
              <p className="font-medium text-slate-900">
                Ministry &amp; Local Connections
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Information about ministry partners and local connections.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
