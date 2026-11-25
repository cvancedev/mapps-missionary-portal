import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SetPasswordForm from "./set-password-form";

export default async function SetPasswordPage() {
  const supabase = await createClient();

  // Server-side gate: anonymous visitors never receive the password form.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?error=session-expired");
  }

  // The email shown to the user comes from the server-validated user record,
  // never from the URL or any other client-supplied value.
  return <SetPasswordForm email={user.email ?? "this account"} />;
}
