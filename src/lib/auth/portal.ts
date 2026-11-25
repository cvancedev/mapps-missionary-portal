import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PortalRole = "missionary" | "administrator";

export type PortalAccess =
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | {
      status: "ok";
      supabase: Awaited<ReturnType<typeof createClient>>;
      user: { id: string; email: string | null };
      role: PortalRole;
    };

/**
 * Resolves the session and the approved MAPPS role.
 *
 * Fail-closed: a missing session, a failed role lookup, a missing role row, or
 * any role other than missionary/administrator is never treated as access.
 * The role is read through the request-scoped Supabase client, so RLS still
 * applies; this check is the application-level guard, not the only boundary.
 */
export async function getPortalAccess(): Promise<PortalAccess> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { status: "unauthenticated" };

  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = roleRow?.role;

  if (
    roleError ||
    (role !== "missionary" && role !== "administrator")
  ) {
    return { status: "unauthorized" };
  }

  return {
    status: "ok",
    supabase,
    user: { id: user.id, email: user.email ?? null },
    role,
  };
}

/** Page guard: anonymous visitors go to login, unapproved roles to /access-denied. */
export async function requirePortalAccess() {
  const access = await getPortalAccess();

  if (access.status === "unauthenticated") redirect("/login");
  if (access.status === "unauthorized") redirect("/access-denied");

  return access;
}

/** Administrator-only guard, checked independently of the portal layout. */
export async function requireAdministrator() {
  const access = await requirePortalAccess();

  if (access.role !== "administrator") redirect("/access-denied");

  return access;
}
