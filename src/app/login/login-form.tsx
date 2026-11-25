"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InviteSessionHandler from "@/components/invite-session-handler";

// Only these codes are ever rendered. Raw Supabase errors are never shown.
const NOTICES: Record<string, string> = {
  "invalid-invitation":
    "This invitation link is invalid or has already been used. Contact your MAPPS coordinator for a new invitation.",
  "expired-invitation":
    "This invitation link has expired. Contact your MAPPS coordinator for a new invitation.",
  "session-expired":
    "Your invitation session has expired. Open your invitation link again, or contact your MAPPS coordinator.",
  "confirmation-failed":
    "We could not confirm your invitation. Contact your MAPPS coordinator for a new invitation.",
};

// Fixed success codes. Like the error codes above, these are literals only.
const SUCCESS_NOTICES: Record<string, string> = {
  "password-created":
    "Your password was created and this invitation session has ended. Sign in below with your email address and new password.",
};

export default function LoginForm({
  errorCode,
  noticeCode,
}: {
  errorCode?: string;
  noticeCode?: string;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const notice = errorCode ? NOTICES[errorCode] : undefined;
  const successNotice = noticeCode ? SUCCESS_NOTICES[noticeCode] : undefined;

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        setError("Unable to sign in. Please check your credentials.");
        return;
      }

      router.replace("/profile");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <InviteSessionHandler />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              MAPPS Missionary Support Portal
            </h1>
            <p className="text-sm text-slate-500">
              Missionary Planning &amp; Support
            </p>
          </div>
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-85px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                M
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Log in to manage your mission trip, support requests, and MAPPS
                arrangements.
              </p>
            </div>

            {successNotice && (
              <div
                role="status"
                className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900"
              >
                {successNotice}
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900"
              >
                {notice}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Log In"}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                Access by invitation only
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                MAPPS accounts are created for approved missionaries and
                administrators.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Need assistance accessing the portal? Contact your MAPPS mission
            coordinator for support.
          </p>
        </div>
      </section>
    </main>
  );
}
