import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Normalize a value to an origin ("https://app.example.com"), or null if invalid.
 */
function parseOrigin(value: string): string | null {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

/**
 * Decide whether this POST came from the application's own origin.
 *
 * Trusted origins come from APP_ORIGIN (comma-separated, optional). When it is
 * configured, the Origin header must match one of those entries exactly.
 *
 * When APP_ORIGIN is not configured, we require two independent signals:
 *   1. Origin must equal the request origin.
 *   2. Sec-Fetch-Site must be "same-origin". It is set by the browser and
 *      cannot be forged by page script, so it keeps a spoofed Host header from
 *      being sufficient on its own.
 *
 * A request with no Origin header is always rejected.
 */
function isTrustedRequest(request: NextRequest): boolean {
  const rawOrigin = request.headers.get("origin");
  if (!rawOrigin) return false;

  const origin = parseOrigin(rawOrigin);
  if (!origin) return false;

  const configured = (process.env.APP_ORIGIN ?? "")
    .split(",")
    .map(parseOrigin)
    .filter((value): value is string => value !== null);

  if (configured.length > 0) {
    return configured.includes(origin);
  }

  return (
    request.headers.get("sec-fetch-site") === "same-origin" &&
    origin === request.nextUrl.origin
  );
}

const SIGN_OUT_FAILED_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign out failed</title>
  </head>
  <body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a">
    <main style="max-width:28rem;margin:15vh auto;padding:2rem;background:#fff;border:1px solid #e2e8f0;border-radius:1rem;text-align:center">
      <h1 style="font-size:1.25rem;margin:0 0 0.75rem">We could not sign you out</h1>
      <p style="margin:0 0 1.5rem;font-size:0.875rem;line-height:1.6;color:#475569">
        Something went wrong while ending your session. Please try again.
      </p>
      <form method="post" action="/auth/signout">
        <button type="submit" style="width:100%;padding:0.75rem 1rem;font:inherit;font-weight:600;color:#fff;background:#047857;border:0;border-radius:0.5rem;cursor:pointer">
          Try again
        </button>
      </form>
      <p style="margin:1.25rem 0 0;font-size:0.875rem">
        <a href="/login" style="color:#047857">Return to login</a>
      </p>
    </main>
  </body>
</html>`;

export async function POST(request: NextRequest) {
  if (!isTrustedRequest(request)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "cache-control": "no-store" },
    });
  }

  const supabase = await createClient();

  // signOut() removes the session through the SSR cookie adapter, which clears
  // the sb-* cookies on this response. A missing or already-invalid session is
  // treated as success so a stale session can always be cleared.
  const { error } = await supabase.auth.signOut();

  if (error) {
    return new NextResponse(SIGN_OUT_FAILED_PAGE, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  // Relative Location keeps the redirect independent of the Host header.
  return new NextResponse(null, {
    status: 303,
    headers: { location: "/login", "cache-control": "no-store" },
  });
}
