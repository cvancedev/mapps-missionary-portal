import PortalShell from "@/components/portal-shell";
import { requirePortalAccess } from "@/lib/auth/portal";

/**
 * Authenticated area. `requirePortalAccess` verifies the session server-side
 * and fails closed when the approved role cannot be read, so every page below
 * this layout is already behind both authentication and role authorization.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await requirePortalAccess();

  return (
    <PortalShell role={role} email={user.email ?? ""}>
      {children}
    </PortalShell>
  );
}
