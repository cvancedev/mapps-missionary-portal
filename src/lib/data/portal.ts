import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Data access for the MAPPS MVP, written against the columns that actually
 * exist in the hosted project:
 *
 *   profiles(user_id, email, full_name, updated_at)
 *   trips(id, missionary_id, destination, start_date, end_date, purpose,
 *         arrival_flight, departure_flight, travel_notes, created_at, updated_at)
 *   support_requests(id, missionary_id, trip_id, request_type, status,
 *                    details, admin_notes, created_at, updated_at)
 *
 * Always select explicit columns so a future schema change fails loudly
 * instead of silently reshaping the UI.
 */

type Db = SupabaseClient;

export type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  updated_at: string | null;
};

export type Trip = {
  id: string;
  missionary_id: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  purpose: string | null;
  arrival_flight: string | null;
  departure_flight: string | null;
  travel_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SupportRequest = {
  id: string;
  missionary_id: string;
  trip_id: string | null;
  request_type: string;
  status: string | null;
  details: string | null;
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const PROFILE_COLUMNS = "user_id, full_name, email, updated_at";
const TRIP_COLUMNS =
  "id, missionary_id, destination, start_date, end_date, purpose, arrival_flight, departure_flight, travel_notes, created_at, updated_at";
const REQUEST_COLUMNS =
  "id, missionary_id, trip_id, request_type, status, details, admin_notes, created_at, updated_at";

export async function getProfile(
  db: Db,
  userId: string
): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await db
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { profile: null, error: error.message };

  return { profile: (data as Profile | null) ?? null, error: null };
}

/**
 * The missionary's current trip. The MVP keeps one trip per missionary, so the
 * most recent trip by start date is treated as current.
 */
export async function getCurrentTrip(
  db: Db,
  userId: string
): Promise<{ trip: Trip | null; error: string | null }> {
  const { data, error } = await db
    .from("trips")
    .select(TRIP_COLUMNS)
    .eq("missionary_id", userId)
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { trip: null, error: error.message };

  return { trip: (data as Trip | null) ?? null, error: null };
}

export async function getSupportRequests(
  db: Db,
  userId: string
): Promise<{ requests: SupportRequest[]; error: string | null }> {
  const { data, error } = await db
    .from("support_requests")
    .select(REQUEST_COLUMNS)
    .eq("missionary_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { requests: [], error: error.message };

  return { requests: (data as SupportRequest[] | null) ?? [], error: null };
}

export type AdminSnapshot = {
  profiles: Profile[];
  trips: Trip[];
  requests: SupportRequest[];
  errors: string[];
};

/**
 * Everything the MAPPS coordinator needs on one screen. Three flat queries are
 * joined in memory so the app does not depend on an embedded-resource name
 * that could differ from the database's foreign-key naming.
 */
export async function getAdminSnapshot(db: Db): Promise<AdminSnapshot> {
  const [profilesResult, tripsResult, requestsResult] = await Promise.all([
    db
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .order("full_name", { ascending: true }),
    db
      .from("trips")
      .select(TRIP_COLUMNS)
      .order("start_date", { ascending: true, nullsFirst: false }),
    db
      .from("support_requests")
      .select(REQUEST_COLUMNS)
      .order("created_at", { ascending: false }),
  ]);

  const errors = [
    profilesResult.error?.message,
    tripsResult.error?.message,
    requestsResult.error?.message,
  ].filter((message): message is string => Boolean(message));

  return {
    profiles: (profilesResult.data as Profile[] | null) ?? [],
    trips: (tripsResult.data as Trip[] | null) ?? [],
    requests: (requestsResult.data as SupportRequest[] | null) ?? [],
    errors,
  };
}
