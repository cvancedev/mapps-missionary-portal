"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const INVALID_INVITATION = "/login?error=invalid-invitation";
const EXPIRED_INVITATION = "/login?error=expired-invitation";

/**
 * Supabase's default invitation email links to Supabase's own verify endpoint,
 * which then redirects to the Site URL with the session in the URL fragment
 * (#access_token=...&refresh_token=...&type=invite). Fragments never reach the
 * server, so the invitation can only be adopted in the browser.
 *
 * The SSR browser client is fixed to the PKCE flow and throws on an implicit
 * grant fragment, so URL detection is disabled here and the tokens are adopted
 * with setSession(), which writes the session through the normal cookie adapter.
 * The server then verifies the session on the password setup page.
 *
 * Tokens are never logged, and the fragment is removed from the address bar
 * before redirecting so it does not remain in browser history.
 */
export default function InviteSessionHandler() {
  // Effects run twice in development (React Strict Mode). The fragment must be
  // processed exactly once, and the redirect must not be cancelled by the
  // simulated cleanup, so completion is guarded by a ref instead.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";

    if (!rawHash) return;

    const params = new URLSearchParams(rawHash);
    const errorCode = params.get("error_code") ?? params.get("error");
    const type = params.get("type");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    const stripTokens = () => {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    };

    if (errorCode) {
      stripTokens();
      window.location.replace(
        errorCode === "otp_expired" ? EXPIRED_INVITATION : INVALID_INVITATION
      );
      return;
    }

    if (type !== "invite" || !accessToken || !refreshToken) return;

    handled.current = true;
    stripTokens();

    const supabase = createClient({ detectSessionInUrl: false });

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        window.location.replace(
          error ? INVALID_INVITATION : "/auth/set-password"
        );
      })
      .catch(() => {
        window.location.replace(INVALID_INVITATION);
      });
  }, []);

  return null;
}
