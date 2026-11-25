"use client";

import { useActionState, useEffect, useRef } from "react";
import { IDLE_FORM_STATE, MAX_LONG_TEXT } from "@/lib/form";
import { SUPPORT_TYPES } from "@/lib/support";
import { submitSupportRequests } from "./actions";

export default function SupportForm({
  requestedTypes,
}: {
  requestedTypes: string[];
}) {
  const [state, formAction, pending] = useActionState(
    submitSupportRequests,
    IDLE_FORM_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
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
        <h3 className="text-lg font-semibold text-slate-900">Support Needs</h3>
        <p className="mt-1 text-sm text-slate-500">
          Select all that apply to your upcoming mission.
        </p>
      </div>

      <div className="space-y-3">
        {SUPPORT_TYPES.map((option) => {
          const alreadyRequested = requestedTypes.some(
            (type) => type.toLowerCase() === option.value.toLowerCase()
          );

          return (
            <label
              key={option.value}
              className={
                alreadyRequested
                  ? "flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-70"
                  : "flex cursor-pointer items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"
              }
            >
              <input
                type="checkbox"
                name="types"
                value={option.value}
                disabled={alreadyRequested}
                className="mt-1 h-4 w-4 accent-emerald-700"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-slate-500">
                  {alreadyRequested
                    ? "Already requested for this trip."
                    : option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <label
          htmlFor="details"
          className="block text-sm font-semibold text-slate-900"
        >
          Additional Needs or Information
        </label>
        <p className="mt-1 text-sm text-slate-500">
          Tell MAPPS about any other arrangements, accessibility needs, or
          important information for your team.
        </p>
        <textarea
          id="details"
          name="details"
          rows={5}
          maxLength={MAX_LONG_TEXT}
          placeholder="Share any additional information here..."
          className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting..." : "Submit Support Request"}
        </button>
      </div>
    </form>
  );
}
