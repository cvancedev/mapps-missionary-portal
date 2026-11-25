"use server";

import { revalidatePath } from "next/cache";
import { getPortalAccess } from "@/lib/auth/portal";
import { MAX_NAME, text, type FormState } from "@/lib/form";

/**
 * Creates or updates the signed-in missionary's own profile row.
 *
 * The user id always comes from the validated session, never from the form, so
 * a missionary can only write their own row. The `profiles` table is keyed by
 * `user_id`; `.select()` is used to confirm a row was actually written, because
 * an RLS policy that denies the write returns no error and no rows.
 */
export async function saveProfile(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const access = await getPortalAccess();

  if (access.status !== "ok") {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  const fullName = text(formData.get("fullName"));

  if (fullName.length === 0) {
    return { status: "error", message: "Enter your full name." };
  }

  if (fullName.length > MAX_NAME) {
    return {
      status: "error",
      message: `Keep your name under ${MAX_NAME} characters.`,
    };
  }

  const payload = {
    full_name: fullName,
    email: access.user.email,
    updated_at: new Date().toISOString(),
  };

  // Update first, then insert when no row exists. This avoids depending on a
  // unique-constraint name that cannot be confirmed from the repository.
  const updated = await access.supabase
    .from("profiles")
    .update(payload)
    .eq("user_id", access.user.id)
    .select("user_id");

  if (updated.error) {
    console.error("[profile] update failed:", updated.error.message);
    return {
      status: "error",
      message: "We could not save your profile. Please try again.",
    };
  }

  let written = updated.data ?? [];

  if (written.length === 0) {
    const inserted = await access.supabase
      .from("profiles")
      .insert({ user_id: access.user.id, ...payload })
      .select("user_id");

    if (inserted.error) {
      console.error("[profile] insert failed:", inserted.error.message);
      return {
        status: "error",
        message: "We could not save your profile. Please try again.",
      };
    }

    written = inserted.data ?? [];
  }

  if (written.length === 0) {
    return {
      status: "error",
      message: "Your profile was not saved. Please try again.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/");

  return { status: "success", message: "Profile saved." };
}
