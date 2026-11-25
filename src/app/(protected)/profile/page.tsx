import { requirePortalAccess } from "@/lib/auth/portal";
import { getProfile } from "@/lib/data/portal";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const { supabase, user } = await requirePortalAccess();
  const { profile, error } = await getProfile(supabase, user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-700">
          Your Profile
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Tell us about yourself
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Your profile helps MAPPS know who you are and how to reach you while
          your team prepares for the mission.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-700"
        >
          We could not load your profile right now. Please refresh the page or
          contact your MAPPS coordinator.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ProfileForm
            fullName={profile?.full_name ?? ""}
            email={profile?.email ?? user.email ?? ""}
          />
        </div>
      )}

      <p className="mt-6 text-center text-xs leading-5 text-slate-500">
        Your information is only visible to you and the MAPPS coordination team.
      </p>
    </div>
  );
}
