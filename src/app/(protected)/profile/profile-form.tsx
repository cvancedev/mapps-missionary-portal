"use client";

import { useActionState } from "react";
import { IDLE_FORM_STATE, MAX_NAME } from "@/lib/form";
import { saveProfile } from "./actions";

export default function ProfileForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    IDLE_FORM_STATE
  );

  return (
    <form action={formAction} className="space-y-6">
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
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          MAPPS uses this information to identify you and coordinate your
          mission support.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            maxLength={MAX_NAME}
            defaultValue={fullName}
            autoComplete="name"
            placeholder="David Miller"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-slate-700">
            Sign-In Email
          </p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
            {email || "Not available"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Your sign-in email is managed by MAPPS. Contact your coordinator if
            it needs to change.
          </p>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
