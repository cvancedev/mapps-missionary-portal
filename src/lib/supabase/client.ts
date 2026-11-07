import { createBrowserClient } from "@supabase/ssr";

type BrowserClientOptions = {
  /**
   * Set to false when the URL fragment (#access_token=...) is handled manually,
   * as it is for Supabase's default invitation links. The SSR client is fixed
   * to the PKCE flow, so it cannot adopt an implicit-grant fragment itself.
   */
  detectSessionInUrl?: boolean;
};

export function createClient(options?: BrowserClientOptions) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: options?.detectSessionInUrl ?? true,
    },
  });
}
