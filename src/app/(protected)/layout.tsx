import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Step 1: Verify the authenticated user.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Step 2: Verify the user's approved MAPPS role.
  const { data: userRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // Step 3: Deny access if the role cannot be verified.
  if (
    roleError ||
    !userRole ||
    !["missionary", "administrator"].includes(userRole.role)
  ) {
    redirect("/access-denied");
  }

  // Step 4: Allow authorized users to access the portal.
  return <>{children}</>;
}