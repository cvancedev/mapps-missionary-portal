import Link from "next/link";

export default function LoginPage() {
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
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-85px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                M
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Log in to manage your mission trip, support requests, and MAPPS
                arrangements.
              </p>
            </div>

            <form className="space-y-5">
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
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <span className="text-sm font-medium text-emerald-700">
                    Forgot password?
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <Link
                href="/"
                className="block w-full rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Log In
              </Link>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                New to MAPPS?
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/profile"
              className="block w-full rounded-lg border border-emerald-700 px-4 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Create an Account
            </Link>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Need assistance accessing the portal? Contact your MAPPS mission
            coordinator for support.
          </p>
        </div>
      </section>
    </main>
  );
}