/**
 * Password policy mirroring the Supabase project's configured requirements
 * (minimum length, required character classes). Kept in one place so the form
 * UI, the pre-submit check, and tests all agree, and so the client never
 * accepts a password that the server would reject as `weak_password`.
 *
 * This is a client-side convenience only. Supabase Auth remains the authority.
 */

export const MIN_LENGTH = 12;

/**
 * Supabase's documented allowed symbol set, used when "symbols" is a required
 * character class. Matching here avoids a server-side `weak_password` result.
 */
export const SYMBOL_PATTERN = /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/;

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    id: "length",
    label: `at least ${MIN_LENGTH} characters`,
    test: (value) => value.length >= MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "an uppercase letter (A–Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "a lowercase letter (a–z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "a number (0–9)",
    test: (value) => /[0-9]/.test(value),
  },
  {
    id: "symbol",
    label: "a symbol such as ! @ # $ %",
    test: (value) => SYMBOL_PATTERN.test(value),
  },
];

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function getUnmetRequirements(password: string): PasswordRequirement[] {
  return PASSWORD_REQUIREMENTS.filter((requirement) => !requirement.test(password));
}

/**
 * Returns a user-facing message when the password is not yet acceptable, or
 * null when it satisfies every local rule. Confirmation must match exactly.
 */
export function validateNewPassword(
  password: string,
  confirmPassword: string
): string | null {
  const unmet = getUnmetRequirements(password);

  if (unmet.length > 0) {
    return `Your password still needs ${formatList(
      unmet.map((requirement) => requirement.label)
    )}.`;
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}

/** Structural subset of the SDK's AuthError, so no error library import is needed. */
export type AuthFailure = {
  name?: string;
  code?: string;
  status?: number;
  reasons?: readonly string[];
};

/**
 * Maps Supabase auth failures onto fixed, non-sensitive messages. Raw error
 * text, codes, tokens and account details are never shown to the user.
 */
export function getUpdateErrorMessage(failure: AuthFailure): string {
  if (failure.name === "AuthRetryableFetchError" || failure.status === 0) {
    return "We could not reach the authentication service. Check your internet connection and try again.";
  }

  switch (failure.code) {
    case "weak_password": {
      const reasons = failure.reasons ?? [];

      if (reasons.includes("pwned")) {
        return "That password has appeared in a known data breach. Please choose a different password.";
      }

      if (reasons.includes("length")) {
        return `Your password must contain at least ${MIN_LENGTH} characters.`;
      }

      if (reasons.includes("characters")) {
        return "Your password must include an uppercase letter, a lowercase letter, a number, and a symbol.";
      }

      return "Your password does not meet the security requirements. Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.";
    }

    case "current_password_required":
      return "This account still needs a valid invitation before a password can be set. Please request a new invitation.";

    case "reauthentication_needed":
      return "For your security, please sign in again and then set your password.";

    case "same_password":
      return "Please choose a password that is different from your current one.";

    case "session_not_found":
    case "session_expired":
    case "refresh_token_not_found":
    case "refresh_token_already_used":
      return "Your session has expired. Please sign in again or request a new invitation.";

    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";

    default:
      return "Unable to update your password. Please try again.";
  }
}
