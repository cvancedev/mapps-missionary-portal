"use server";

import { revalidatePath } from "next/cache";
import { getPortalAccess } from "@/lib/auth/portal";
import { isUuid, text, type FormState } from "@/lib/form";
import { normalizeStatus, supportStatusLabel } from "@/lib/support";

/**
 * Updates one support request status. This is the MAPPS side of the loop:
 * the missionary dashboard reads the same row on its next request.
 *
 * Authorization is checked here again (not only in the page), because a Server
 * Action can be invoked by a direct POST that never renders /admin. Only an
 * administrator session may proceed; everyone else gets a refusal.
 */
export async function updateSupportStatus(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const access = await getPortalAccess();

  if (access.status === "unauthenticated") {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  if (access.status !== "ok" || access.role !== "administrator") {
    return {
      status: "error",
      message: "You do not have permission to update arrangements.",
    };
  }

  const requestId = text(formData.get("requestId"));
  const status = normalizeStatus(text(formData.get("status")));

  if (!isUuid(requestId)) {
    return { status: "error", message: "That request could not be identified." };
  }

  if (!status) {
    return { status: "error", message: "Choose a valid status." };
  }

  const { data, error } = await access.supabase
    .from("support_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select("id");

  if (error) {
    console.error("[admin] status update failed:", error.message);
    return {
      status: "error",
      message: "We could not update that request. Please try again.",
    };
  }

  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "That request was not updated. It may no longer exist.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/support");

  return {
    status: "success",
    message: `Status updated to ${supportStatusLabel(status)}.`,
  };
}
