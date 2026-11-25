import { requirePortalAccess } from "@/lib/auth/portal";
import { getCurrentTrip } from "@/lib/data/portal";
import TripForm from "./trip-form";

export default async function TripPage() {
  const { supabase, user } = await requirePortalAccess();
  const { trip, error } = await getCurrentTrip(supabase, user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-700">
          Plan Your Trip
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Tell us about your trip
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Share your mission dates, destination, and travel information so MAPPS
          can begin coordinating the support your team needs.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700"
        >
          We could not load your trip right now. Please refresh the page or
          contact your MAPPS coordinator.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <TripForm trip={trip} />
        </div>
      )}

      <p className="mt-6 text-center text-xs leading-5 text-slate-500">
        One trip is tracked at a time. Contact your MAPPS coordinator for
        additional trips or changes to an approved itinerary.
      </p>
    </div>
  );
}
