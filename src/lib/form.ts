/**
 * Small helpers shared by the server actions. Validation lives on the server;
 * the HTML attributes on the forms are only a convenience.
 */

export type FormState = {
  status: "idle" | "error" | "success";
  message: string;
};

export const IDLE_FORM_STATE: FormState = { status: "idle", message: "" };

export const MAX_NAME = 120;
export const MAX_DESTINATION = 120;
export const MAX_FLIGHT = 80;
export const MAX_LONG_TEXT = 2000;

/** Trimmed string value of a form field, or "" when absent. */
export function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Trimmed optional value; returns null when empty. */
export function optional(value: FormDataEntryValue | null): string | null {
  const trimmed = text(value);
  return trimmed.length > 0 ? trimmed : null;
}

/** True for a real calendar date in YYYY-MM-DD form. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.toISOString().slice(0, 10) === value;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}
