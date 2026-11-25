/**
 * Support categories and arrangement statuses shared by the missionary pages,
 * the administrator surface, and the server actions.
 *
 * These strings are what is written to `support_requests.request_type` and
 * `support_requests.status`. Both columns are plain text in the hosted
 * database, so `normalizeStatus` accepts legacy or hand-entered variants
 * ("In Progress", "in-progress") without breaking display.
 */

export const SUPPORT_TYPES = [
  {
    value: "accommodation",
    label: "Accommodation",
    description: "Housing arrangements during your mission visit.",
  },
  {
    value: "airport_pickup",
    label: "Airport Pickup",
    description: "Transportation from the airport when your team arrives.",
  },
  {
    value: "local_transportation",
    label: "Local Transportation",
    description: "Transportation assistance during your mission.",
  },
  {
    value: "orientation",
    label: "Kenya Orientation",
    description: "Pre-arrival guidance, culture, safety, and local information.",
  },
  {
    value: "ministry_connections",
    label: "Ministry / Church Connections",
    description: "Connections with churches, ministries, and local partners.",
  },
  {
    value: "special_needs",
    label: "Special Needs / Other Support",
    description: "Accessibility needs or any other support your team needs.",
  },
] as const;

export type SupportType = (typeof SUPPORT_TYPES)[number]["value"];

export const SUPPORT_TYPE_VALUES: readonly string[] = SUPPORT_TYPES.map(
  (type) => type.value
);

export const SUPPORT_STATUSES = [
  "requested",
  "in_progress",
  "confirmed",
] as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

export function isSupportType(value: string): value is SupportType {
  return SUPPORT_TYPE_VALUES.includes(value);
}

function prettify(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase());
}

/** Resolves known values to the canonical slug, or null when unrecognised. */
export function normalizeStatus(value: string | null): SupportStatus | null {
  if (!value) return null;

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  return (SUPPORT_STATUSES as readonly string[]).includes(normalized)
    ? (normalized as SupportStatus)
    : null;
}

export function isSupportStatus(value: string): value is SupportStatus {
  return normalizeStatus(value) === value;
}

/** Human label for a stored request type, including legacy free-text values. */
export function supportTypeLabel(value: string): string {
  const match = SUPPORT_TYPES.find((type) => type.value === value);
  if (match) return match.label;

  const byLabel = SUPPORT_TYPES.find(
    (type) => type.label.toLowerCase() === value.trim().toLowerCase()
  );
  return byLabel ? byLabel.label : prettify(value);
}

export function supportStatusLabel(value: string | null): string {
  const normalized = normalizeStatus(value);
  if (normalized === "in_progress") return "In Progress";
  if (normalized === "requested") return "Requested";
  if (normalized === "confirmed") return "Confirmed";
  return value ? prettify(value) : "Requested";
}

/** Tailwind classes for a status pill. */
export function supportStatusBadge(value: string | null): string {
  const normalized = normalizeStatus(value);

  if (normalized === "confirmed") return "bg-green-100 text-green-700";
  if (normalized === "in_progress") return "bg-amber-100 text-amber-700";
  if (normalized === "requested") return "bg-slate-100 text-slate-600";
  return "bg-slate-100 text-slate-600";
}
