"use client";

import { useActionState } from "react";
import { IDLE_FORM_STATE } from "@/lib/form";
import {
  SUPPORT_STATUSES,
  normalizeStatus,
  supportStatusLabel,
} from "@/lib/support";
import { updateSupportStatus } from "./actions";

export default function StatusForm({
  requestId,
  status,
}: {
  requestId: string;
  status: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateSupportStatus,
    IDLE_FORM_STATE
  );

  const normalized = normalizeStatus(status);

  // If the stored value is not one of the MVP statuses, keep it selectable so
  // the administrator sees the real current value instead of a false default.
  const options: { value: string; label: string }[] = SUPPORT_STATUSES.map(
    (value) => ({
      value,
      label: supportStatusLabel(value),
    })
  );

  if (!normalized && status && status.trim().length > 0) {
    options.unshift({ value: status, label: supportStatusLabel(status) });
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="requestId" value={requestId} />

      <label htmlFor={`status-${requestId}`} className="sr-only">
        Status
      </label>

      <select
        id={`status-${requestId}`}
        name="status"
        defaultValue={normalized ?? status ?? "requested"}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update"}
      </button>

      {state.status === "error" && (
        <p role="alert" className="w-full text-xs text-red-700">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <p role="status" className="w-full text-xs text-emerald-700">
          {state.message}
        </p>
      )}
    </form>
  );
}
