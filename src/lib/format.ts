/** Date formatting shared by the dashboard and the administrator surface. */

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats a `date` column value (YYYY-MM-DD) without timezone drift. */
export function formatDate(value: string | null): string | null {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  return DATE_FORMATTER.format(parsed);
}

export function formatDateRange(
  start: string | null,
  end: string | null
): string | null {
  const from = formatDate(start);
  const to = formatDate(end);

  if (from && to && start !== end) return `${from} – ${to}`;
  return from ?? to;
}

/** First name for a greeting, or null when there is no usable name. */
export function firstName(fullName: string | null): string | null {
  if (!fullName) return null;

  const [first] = fullName.trim().split(/\s+/);
  return first && first.length > 0 ? first : null;
}
