"use client";

import { useActionState } from "react";
import { IDLE_FORM_STATE, MAX_DESTINATION, MAX_FLIGHT, MAX_LONG_TEXT } from "@/lib/form";
import type { Trip } from "@/lib/data/portal";
import { saveTrip } from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function TripForm({ trip }: { trip: Trip | null }) {
  const [state, formAction, pending] = useActionState(saveTrip, IDLE_FORM_STATE);

  return (
    <form action={formAction} className="space-y-8">
      {state.status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900"
        >
          {state.message}
        </div>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
        >
          {state.message}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-slate-900">Mission Details</h3>
        <p className="mt-1 text-sm text-slate-500">
          Provide the basic information for your upcoming mission.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="destination"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Destination
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              required
              maxLength={MAX_DESTINATION}
              defaultValue={trip?.destination ?? ""}
              placeholder="Kenya"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Arrival Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={trip?.start_date ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Departure Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              defaultValue={trip?.end_date ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="purpose"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Mission Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows={4}
            maxLength={MAX_LONG_TEXT}
            defaultValue={trip?.purpose ?? ""}
            placeholder="Tell MAPPS briefly about the purpose of your mission and planned ministry activities..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <h3 className="text-lg font-semibold text-slate-900">
          Travel Information
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Add your flight information if it is already available. You can update
          it later.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="arrivalFlight"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Arrival Flight
            </label>
            <input
              id="arrivalFlight"
              name="arrivalFlight"
              type="text"
              maxLength={MAX_FLIGHT}
              defaultValue={trip?.arrival_flight ?? ""}
              placeholder="Example: KQ 003"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="departureFlight"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Departure Flight
            </label>
            <input
              id="departureFlight"
              name="departureFlight"
              type="text"
              maxLength={MAX_FLIGHT}
              defaultValue={trip?.departure_flight ?? ""}
              placeholder="Example: KQ 002"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="travelNotes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Travel Notes
          </label>
          <textarea
            id="travelNotes"
            name="travelNotes"
            rows={4}
            maxLength={MAX_LONG_TEXT}
            defaultValue={trip?.travel_notes ?? ""}
            placeholder="Share any additional arrival, departure, or travel details..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : trip ? "Update Trip" : "Save Trip"}
        </button>
      </div>
    </form>
  );
}
