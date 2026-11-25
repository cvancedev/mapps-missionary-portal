import { requireAdministrator } from "@/lib/auth/portal";
import { getAdminSnapshot, type Profile, type Trip } from "@/lib/data/portal";
import { formatDate, formatDateRange } from "@/lib/format";
import {
  normalizeStatus,
  supportStatusBadge,
  supportStatusLabel,
  supportTypeLabel,
} from "@/lib/support";
import StatusForm from "./status-form";

function missionaryName(profile: Profile | undefined): string {
  const name = profile?.full_name?.trim();
  if (name) return name;

  const email = profile?.email?.trim();
  return email && email.length > 0 ? email : "Missionary";
}

export default async function AdminPage() {
  const { supabase } = await requireAdministrator();
  const snapshot = await getAdminSnapshot(supabase);

  const profileById = new Map(
    snapshot.profiles.map((profile) => [profile.user_id, profile])
  );

  // Trips arrive ordered by start date, so the last entry per missionary is
  // the most recent one.
  const currentTripByUser = new Map<string, Trip>();
  for (const trip of snapshot.trips) {
    currentTripByUser.set(trip.missionary_id, trip);
  }

  const missionaryIds = new Set<string>([
    ...snapshot.profiles.map((profile) => profile.user_id),
    ...snapshot.trips.map((trip) => trip.missionary_id),
  ]);

  const requestedCount = snapshot.requests.filter(
    (request) => normalizeStatus(request.status) === "requested"
  ).length;
  const inProgressCount = snapshot.requests.filter(
    (request) => normalizeStatus(request.status) === "in_progress"
  ).length;
  const confirmedCount = snapshot.requests.filter(
    (request) => normalizeStatus(request.status) === "confirmed"
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-700">
          MAPPS Coordination
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Missionary support overview
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review incoming support requests and update each arrangement as it is
          confirmed. Missionaries see the updated status on their dashboard.
        </p>
      </div>

      {snapshot.errors.length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          Some coordination data could not be loaded. If this persists, ask your
          technical administrator to confirm the database permissions for
          administrator accounts.
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Missionaries</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {missionaryIds.size}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Requested</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {requestedCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {inProgressCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {confirmedCount}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Support Requests
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Newest first. Change the status and select Update to notify the
          missionary through their dashboard.
        </p>

        {snapshot.requests.length === 0 ? (
          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            No support requests have been submitted yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {snapshot.requests.map((request) => {
              const profile = profileById.get(request.missionary_id);
              const trip = currentTripByUser.get(request.missionary_id);

              return (
                <li key={request.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {missionaryName(profile)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {supportTypeLabel(request.request_type)}
                        {trip?.destination
                          ? ` · ${trip.destination}`
                          : " · No trip recorded"}
                      </p>

                      {request.details && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          {request.details}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-500">
                        {profile?.email ?? "No email on file"}
                        {" · "}
                        Requested{" "}
                        {formatDate(request.created_at?.slice(0, 10) ?? null) ??
                          "recently"}
                        {trip
                          ? ` · Trip ${formatDateRange(
                              trip.start_date,
                              trip.end_date
                            ) ?? "dates pending"}`
                          : ""}
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

                  <div className="mt-3">
                    <StatusForm
                      requestId={request.id}
                      status={request.status}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Missionaries and Trips
        </h3>

        {missionaryIds.size === 0 ? (
          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            No missionary profiles or trips yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {Array.from(missionaryIds).map((userId) => {
              const profile = profileById.get(userId);
              const trip = currentTripByUser.get(userId);

              return (
                <li key={userId} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {missionaryName(profile)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {profile?.email ?? "No email on file"}
                    </p>
                  </div>

                  {trip ? (
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      <p>
                        <span className="font-medium text-slate-700">
                          {trip.destination ?? "Destination pending"}
                        </span>
                        {" · "}
                        {formatDateRange(trip.start_date, trip.end_date) ??
                          "Dates pending"}
                      </p>
                      {trip.purpose && (
                        <p className="mt-1 text-slate-500">{trip.purpose}</p>
                      )}
                      {(trip.arrival_flight || trip.departure_flight) && (
                        <p className="mt-1 text-xs text-slate-500">
                          Flights: {trip.arrival_flight ?? "—"} /{" "}
                          {trip.departure_flight ?? "—"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No trip planned yet.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
