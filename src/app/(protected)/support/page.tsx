import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal";
import { getCurrentTrip, getSupportRequests } from "@/lib/data/portal";
import { formatDate } from "@/lib/format";
import {
  supportStatusBadge,
  supportStatusLabel,
  supportTypeLabel,
} from "@/lib/support";
import SupportForm from "./support-form";

export default async function SupportPage() {
  const { supabase, user } = await requirePortalAccess();

  const [tripResult, requestsResult] = await Promise.all([
    getCurrentTrip(supabase, user.id),
    getSupportRequests(supabase, user.id),
  ]);

  const trip = tripResult.trip;
  const requests = requestsResult.requests;
  const loadError = tripResult.error || requestsResult.error;

  const requestedTypes = requests.map((request) => request.request_type);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-700">
          Mission Support
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          How can MAPPS support your mission?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Select the services your team may need. Your MAPPS coordinator will
          review each request and update its status as arrangements are made.
        </p>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700"
        >
          We could not load your support requests right now. Please refresh the
          page or contact your MAPPS coordinator.
        </div>
      ) : (
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {trip ? (
              <SupportForm requestedTypes={requestedTypes} />
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Add your trip first
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Support requests are attached to a trip, so MAPPS needs your
                  destination and dates before coordinating arrangements.
                </p>
                <Link
                  href="/trip"
                  className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Plan Your Trip
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                Your Requests
              </h3>
              <span className="text-sm text-slate-500">
                {requests.length === 0
                  ? "None submitted yet"
                  : `${requests.length} submitted`}
              </span>
            </div>

            {requests.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No support requests yet. Choose the support your team needs
                above and MAPPS will begin coordinating.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-slate-100">
                {requests.map((request) => (
                  <li key={request.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {supportTypeLabel(request.request_type)}
                        </p>

                        {request.details && (
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {request.details}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          Requested{" "}
                          {formatDate(
                            request.created_at?.slice(0, 10) ?? null
                          ) ?? "recently"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${supportStatusBadge(
                          request.status
                        )}`}
                      >
                        {supportStatusLabel(request.status)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <p className="mt-6 text-center text-xs leading-5 text-slate-500">
        Your MAPPS coordinator will follow up as arrangements are reviewed and
        confirmed.
      </p>
    </div>
  );
}
