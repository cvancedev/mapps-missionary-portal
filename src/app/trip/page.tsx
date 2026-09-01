import Link from "next/link";

export default function TripPage() {
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
            Plan Your Mission
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Tell us about your trip
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Share your mission dates, destination, and travel information so
            MAPPS can begin coordinating the support your team needs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Mission Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Provide the basic information for your upcoming mission.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="destination"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Destination
                  </label>

                  <input
                    id="destination"
                    type="text"
                    placeholder="Kenya"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="teamSize"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Team Size
                  </label>

                  <input
                    id="teamSize"
                    type="number"
                    placeholder="6"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="arrivalDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Arrival Date
                  </label>

                  <input
                    id="arrivalDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="departureDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Departure Date
                  </label>

                  <input
                    id="departureDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="purpose"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mission Purpose
                </label>

                <textarea
                  id="purpose"
                  rows={4}
                  placeholder="Tell MAPPS briefly about the purpose of your mission and planned ministry activities..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold text-slate-900">
                Travel Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your flight information if it is already available.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="arrivalFlight"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Arrival Flight
                  </label>

                  <input
                    id="arrivalFlight"
                    type="text"
                    placeholder="Example: KQ 003"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="departureFlight"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Departure Flight
                  </label>

                  <input
                    id="departureFlight"
                    type="text"
                    placeholder="Example: KQ 002"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="travelNotes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Travel Notes
                </label>

                <textarea
                  id="travelNotes"
                  rows={4}
                  placeholder="Share any additional arrival, departure, or travel details..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Back to Dashboard
              </Link>

              <Link
                href="/support"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Save Trip &amp; Continue
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          You can return to your trip details later if travel information
          changes.
        </p>
      </section>
    </main>
  );
}