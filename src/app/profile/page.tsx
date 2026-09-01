import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-lg font-bold text-slate-900">
            MAPPS Missionary Support Portal
          </h1>
          <p className="text-sm text-slate-500">
            Missionary Planning &amp; Support
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-700">
            Create Profile
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Tell us about yourself
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your missionary profile helps MAPPS understand who you are, your
            ministry connection, and how our team can support your mission
            journey.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Enter your basic contact information.
            </p>
          </div>

          <form className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="David"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Miller"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="david@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold text-slate-900">
                Ministry Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Tell MAPPS about your ministry or sending organization.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Church or Organization
                  </label>
                  <input
                    id="organization"
                    type="text"
                    placeholder="Grace Community Church"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Home Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="United States"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Ministry Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    placeholder="Mission Team Leader"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="teamSize"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Expected Team Size
                  </label>
                  <input
                    id="teamSize"
                    type="number"
                    placeholder="6"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/login"
                className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Back to Login
              </Link>

              <Link
                href="/"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Save &amp; Continue
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Your information helps MAPPS coordinate mission support and travel
          arrangements.
        </p>
      </section>
    </main>
  );
}