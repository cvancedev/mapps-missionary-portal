"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  getUnmetRequirements,
  getUpdateErrorMessage,
  validateNewPassword,
} from "./password-policy";

export default function SetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const unmetIds = new Set(
    getUnmetRequirements(password).map((requirement) => requirement.id)
  );
  const showMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const supabase = createClient();
        const { data, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !data.user) {
          router.replace("/login?error=session-expired");
          return;
        }

        setCheckingSession(false);
      } catch {
        if (active) {
          router.replace("/login?error=session-expired");
        }
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || success) return;

    setError("");

    const validationError = validateNewPassword(password, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: userError } =
        await supabase.auth.getUser();

      if (userError || !data.user) {
        setError("Your session has expired. Please request a new invitation.");
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(getUpdateErrorMessage(updateError));
        return;
      }

      setSuccess(true);
      router.replace("/profile");
      router.refresh();
    } catch {
      setError(
        "We could not reach the authentication service. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Verifying your invitation...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
            M
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to MAPPS
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your invitation has been verified. Create a secure password
            to access your missionary support portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Create Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_LENGTH}
              aria-describedby="password-requirements"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <div id="password-requirements" className="mt-3">
              <p className="text-xs font-medium text-slate-600">
                Your password must contain:
              </p>

              <ul className="mt-2 space-y-1 text-xs">
                {PASSWORD_REQUIREMENTS.map((requirement) => {
                  const met = !unmetIds.has(requirement.id);

                  return (
                    <li
                      key={requirement.id}
                      className={
                        met
                          ? "flex items-start gap-2 text-emerald-700"
                          : "flex items-start gap-2 text-slate-500"
                      }
                    >
                      <span aria-hidden="true" className="mt-px w-3 shrink-0">
                        {met ? "✓" : "•"}
                      </span>
                      <span>
                        <span className="sr-only">
                          {met ? "Requirement met: " : "Requirement not met: "}
                        </span>
                        {requirement.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_LENGTH}
              aria-invalid={showMismatch}
              aria-describedby={
                showMismatch ? "confirm-password-error" : undefined
              }
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            {showMismatch && (
              <p
                id="confirm-password-error"
                className="mt-2 text-xs text-red-700"
              >
                Passwords do not match.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading
              ? "Saving Password..."
              : success
                ? "Password Saved"
                : "Create Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          MAPPS Missionary Planning &amp; Support
        </p>
      </section>
    </main>
  );
}
