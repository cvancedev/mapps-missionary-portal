import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-amber-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18.14A2 2 0 0 0 3.54 21h16.92a2 2 0 0 0 1.72-2.86L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Access Not Authorized
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your account does not currently have permission to access the
          MAPPS Missionary Support Portal.
        </p>

        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm leading-6 text-emerald-900">
            MAPPS is available by invitation only to approved
            missionaries and administrators.
          </p>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-600">
          If you believe you should have access, please contact your
          MAPPS mission coordinator for assistance.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Return to Login
        </Link>

        <form method="post" action="/auth/signout" className="mt-3">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign Out
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Signing out lets you use a different account.
        </p>

        <p className="mt-8 text-xs text-slate-500">
          MAPPS Missionary Planning &amp; Support
        </p>
      </section>
    </main>
  );
}