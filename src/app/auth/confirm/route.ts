import { NextResponse, type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const origin = request.nextUrl.origin;

  if (token_hash && type === "invite") {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });

    if (!error) {
      return NextResponse.redirect(
        new URL("/auth/set-password", origin)
      );
    }

    // Map only the documented expiry code, never the raw error text.
    return NextResponse.redirect(
      new URL(
        error.code === "otp_expired"
          ? "/login?error=expired-invitation"
          : "/login?error=invalid-invitation",
        origin
      )
    );
  }

  return NextResponse.redirect(
    new URL("/login?error=invalid-invitation", origin)
  );
}