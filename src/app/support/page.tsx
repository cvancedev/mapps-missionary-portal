import Link from "next/link";

const supportOptions = [
  {
    title: "Accommodation",
    description: "Housing arrangements during your mission visit.",
  },
  {
    title: "Airport Pickup",
    description: "Transportation from the airport when your team arrives.",
  },
  {
    title: "Local Transportation",
    description: "Transportation assistance during your mission.",
  },
  {
    title: "Orientation",
    description: "Pre-arrival guidance, culture, safety, and local information.",
  },
  {
    title: "Ministry Connections",
    description: "Connections with churches, ministries, and local partners.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              MAPPS Missionary Support Portal
            </h1>
            <p className="text-sm text-slate-500">
              Missionary Planning &amp; Support
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-700">
            Mission Support
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            How can MAPPS support your mission?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Select the services your team may need. Your MAPPS coordinator will
            review your request and help organize the arrangements.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Support Needs
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select all that apply to your upcoming mission.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {supportOptions.map((option) => (
              <label
                key={option.title}
                className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {option.title}
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-slate-500">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <label
              htmlFor="additionalNeeds"
              className="block text-sm font-semibold text-slate-900"
            >
              Additional Needs or Information
            </label>

            <p className="mt-1 text-sm text-slate-500">
              Tell MAPPS about any other arrangements, accessibility needs, or
              important information for your team.
            </p>

            <textarea
              id="additionalNeeds"
              rows={5}
              placeholder="Share any additional information here..."
              className="mt-4 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-lg bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Submit Support Request
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Your MAPPS coordinator will follow up with you as arrangements are
          reviewed and confirmed.
        </p>
      </section>
    </main>
  );
}