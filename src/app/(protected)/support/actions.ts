"use server";

import { revalidatePath } from "next/cache";
import { getPortalAccess } from "@/lib/auth/portal";
import { getCurrentTrip } from "@/lib/data/portal";
import { MAX_LONG_TEXT, optional, type FormState } from "@/lib/form";
import { isSupportType, supportTypeLabel } from "@/lib/support";

/**
 * Creates one `support_requests` row per selected category for the missionary's
 * current trip, so each arrangement can be tracked and confirmed separately.
 *
 * `missionary_id` comes from the validated session and `trip_id` from a trip
 * that already belongs to that session user, so a missionary cannot file a
 * request against someone else's trip.
 */
export async function submitSupportRequests(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const access = await getPortalAccess();

  if (access.status !== "ok") {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  const { trip, error: tripError } = await getCurrentTrip(
    access.supabase,
    access.user.id
  );

  if (tripError) {
    return {
      status: "error",
      message: "We could not load your trip. Please try again.",
    };
  }

  if (!trip) {
    return {
      status: "error",
      message: "Add your trip details before requesting support.",
    };
  }

  const selected = Array.from(
    new Set(
      formData
        .getAll("types")
        .filter((value): value is string => typeof value === "string")
        .filter(isSupportType)
    )
  );

  if (selected.length === 0) {
    return { status: "error", message: "Select at least one support category." };
  }

  const details = optional(formData.get("details"));

  if (details && details.length > MAX_LONG_TEXT) {
    return {
      status: "error",
      message: "Shorten the additional information you entered.",
    };
  }

  const { data: existing, error: existingError } = await access.supabase
    .from("support_requests")
    .select("request_type")
    .eq("missionary_id", access.user.id)
    .eq("trip_id", trip.id);

  if (existingError) {
    return {
      status: "error",
      message: "We could not check your existing requests. Please try again.",
    };
  }

  const alreadyRequested = new Set(
    ((existing as { request_type: string }[] | null) ?? []).map(
      (row) => row.request_type
    )
  );

  const newTypes = selected.filter((type) => !alreadyRequested.has(type));

  if (newTypes.length === 0) {
    return {
      status: "success",
      message:
        "Those support categories are already on this trip. MAPPS updates their status as arrangements progress.",
    };
  }

  const rows = newTypes.map((type) => ({
    missionary_id: access.user.id,
    trip_id: trip.id,
    request_type: type,
    status: "requested",
    details,
  }));

  const { data, error } = await access.supabase
    .from("support_requests")
    .insert(rows)
    .select("id");

  if (error) {
    console.error("[support] submit failed:", error.message);
    return {
      status: "error",
      message: "We could not submit your support request. Please try again.",
    };
  }

  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "Your request was not submitted. Please try again.",
    };
  }

  revalidatePath("/support");
  revalidatePath("/");
  revalidatePath("/admin");

  const labels = newTypes.map(supportTypeLabel).join(", ");

  return {
    status: "success",
    message:
      newTypes.length === 1
        ? `Request submitted: ${labels}. MAPPS will review it shortly.`
        : `Requests submitted: ${labels}. MAPPS will review them shortly.`,
  };
}
