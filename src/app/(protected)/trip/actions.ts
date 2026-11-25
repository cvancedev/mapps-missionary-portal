"use server";

import { revalidatePath } from "next/cache";
import { getPortalAccess } from "@/lib/auth/portal";
import { getCurrentTrip } from "@/lib/data/portal";
import {
  MAX_DESTINATION,
  MAX_FLIGHT,
  MAX_LONG_TEXT,
  isIsoDate,
  optional,
  text,
  type FormState,
} from "@/lib/form";

/**
 * Creates or updates the missionary's current trip.
 *
 * Ownership is enforced twice: `missionary_id` is always the session user, and
 * updates are filtered by both the trip id and `missionary_id`. A write that
 * RLS denies returns no rows, which is reported as a failure rather than a
 * false success.
 */
export async function saveTrip(
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

  const destination = text(formData.get("destination"));
  const startDate = optional(formData.get("startDate"));
  const endDate = optional(formData.get("endDate"));
  const purpose = optional(formData.get("purpose"));
  const arrivalFlight = optional(formData.get("arrivalFlight"));
  const departureFlight = optional(formData.get("departureFlight"));
  const travelNotes = optional(formData.get("travelNotes"));

  if (destination.length === 0) {
    return { status: "error", message: "Enter your destination." };
  }

  if (destination.length > MAX_DESTINATION) {
    return {
      status: "error",
      message: `Keep the destination under ${MAX_DESTINATION} characters.`,
    };
  }

  if (!startDate || !isIsoDate(startDate)) {
    return { status: "error", message: "Enter the arrival date." };
  }

  if (!endDate || !isIsoDate(endDate)) {
    return { status: "error", message: "Enter the departure date." };
  }

  if (startDate && endDate && endDate < startDate) {
    return {
      status: "error",
      message: "The departure date cannot be before the arrival date.",
    };
  }

  if (arrivalFlight && arrivalFlight.length > MAX_FLIGHT) {
    return { status: "error", message: "That flight reference is too long." };
  }

  if (departureFlight && departureFlight.length > MAX_FLIGHT) {
    return { status: "error", message: "That flight reference is too long." };
  }

  if (purpose && purpose.length > MAX_LONG_TEXT) {
    return { status: "error", message: "Shorten the mission purpose." };
  }

  if (travelNotes && travelNotes.length > MAX_LONG_TEXT) {
    return { status: "error", message: "Shorten the travel notes." };
  }

  const payload = {
    destination,
    start_date: startDate,
    end_date: endDate,
    purpose,
    arrival_flight: arrivalFlight,
    departure_flight: departureFlight,
    travel_notes: travelNotes,
    updated_at: new Date().toISOString(),
  };

  const { trip } = await getCurrentTrip(access.supabase, access.user.id);

  const { data, error } = trip
    ? await access.supabase
        .from("trips")
        .update(payload)
        .eq("id", trip.id)
        .eq("missionary_id", access.user.id)
        .select("id")
    : await access.supabase
        .from("trips")
        .insert({ ...payload, missionary_id: access.user.id })
        .select("id");

  if (error) {
    console.error("[trip] save failed:", error.message);
    return {
      status: "error",
      message: "We could not save your trip. Please try again.",
    };
  }

  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "Your trip was not saved. Please try again.",
    };
  }

  revalidatePath("/trip");
  revalidatePath("/");
  revalidatePath("/admin");

  return {
    status: "success",
    message: trip ? "Trip details updated." : "Trip details saved.",
  };
}
