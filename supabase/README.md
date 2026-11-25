# Hosted database reference

The application writes to a Supabase project that is managed outside this
repository. This note records what the code depends on, how it was verified, and
what could not be verified from the repository.

## Verified tables and columns

Inspected on 2026-11-19 against the hosted project with the publishable key,
using read-only PostgREST column probes (`select=<column>&limit=0`). A missing
column returns `42703`; an existing column returns a permission error or an
empty result. No rows were read and no schema changes were made.

| Table | Columns used by the app |
| --- | --- |
| `profiles` | `user_id` (uuid), `email`, `full_name`, `updated_at` |
| `trips` | `id` (uuid), `missionary_id` (uuid), `destination`, `start_date` (date), `end_date` (date), `purpose`, `arrival_flight`, `departure_flight`, `travel_notes`, `created_at`, `updated_at` |
| `support_requests` | `id` (uuid), `missionary_id` (uuid), `trip_id` (uuid), `request_type`, `status`, `details`, `admin_notes`, `created_at`, `updated_at` |
| `user_roles` | `user_id` (uuid), `role`, `created_at` |

Observed behaviour with the `anon` role:

- `profiles`, `trips`, `support_requests` → `401 / 42501` (no table privilege).
- `user_roles` → `200 []` (privilege present, rows hidden by RLS).

This is correct for anonymous visitors. It also means `anon` cannot read any
application data.

## Not verifiable from the repository

- **RLS policies and grants for `authenticated`.** There is no service-role key
  in the project and no linked Supabase CLI, so policy definitions and the
  `authenticated` grant set cannot be read. The app therefore assumes, but does
  not prove, that signed-in missionaries can select/insert/update their own rows
  and that administrators can read all rows.
- **Column types and constraints** beyond `uuid` / `date` (nullability,
  defaults, check constraints, unique keys). For example, whether
  `support_requests.trip_id` is nullable is unknown, which is why the app asks
  missionaries to create a trip before requesting support.
- **Existing row values.** `request_type` and `status` are text. The app writes
  `accommodation`, `airport_pickup`, `local_transportation`, `orientation`,
  `ministry_connections`, `special_needs` and `requested`, `in_progress`,
  `confirmed`. Display normalises capitalisation, so older hand-entered values
  still render.

Because the policies cannot be inspected, no DDL or policy SQL is checked in: a
reconstruction would be guesswork and could conflict with the live project.

## Read-only verification to run in the SQL editor

```sql
-- Policies and grants for the four tables the MVP uses.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'trips', 'support_requests', 'user_roles')
order by tablename, policyname;

select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('profiles', 'trips', 'support_requests', 'user_roles')
group by table_name, grantee
order by table_name, grantee;

-- Column types, nullability and defaults for the same tables.
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles', 'trips', 'support_requests', 'user_roles')
order by table_name, ordinal_position;
```

Minimum behaviour those queries should confirm:

1. A missionary can `select`/`insert`/`update` only rows where
   `user_id = auth.uid()` (`profiles`, `user_roles`) or
   `missionary_id = auth.uid()` (`trips`, `support_requests`).
2. An administrator can `select` all rows in those tables and `update`
   `support_requests.status`.
3. No policy allows `anon` to read or write application data.

## Optional columns that do not exist yet

The prototype UI previously showed phone number, sending organisation, home
country, ministry role, and team size. None of those columns exist, so those
fields were removed from the forms rather than stored somewhere invented. If
Peter wants them, the database needs an explicit migration (for example adding
`phone`, `organization`, `home_country`, `ministry_role` to `profiles` and
`team_size` to `trips`) before any UI is added back.

## Inviting a missionary and assigning a role

Access is by invitation only: there is no in-app sign-up, and a signed-in user
with no `user_roles` row is refused at `/access-denied`. Roles are stored in
`public.user_roles (user_id uuid primary key, role text, created_at timestamptz)`,
where `role` is constrained to `'missionary'` or `'administrator'`.

Nothing in the application writes `user_roles`; `authenticated` has `SELECT`
only, so every step below is performed by the project owner.

### 1. Invite the missionary

Supabase Dashboard → **Authentication** → **Users** → **Invite user** → enter the
email address → **Send**.

This uses Supabase's admin API (no key is stored in this repository) and sends a
`type=invite` link. The app already handles both link shapes: `/auth/confirm`
verifies `token_hash`, and the login page adopts the `#access_token=…&type=invite`
fragment. The invited person lands on `/auth/set-password`, creates a password,
is signed out, then logs in normally.

### 2. Assign the `missionary` role

Run this in the SQL editor after the invitation exists. Replace the email:

```sql
insert into public.user_roles (user_id, role)
select u.id, 'missionary'
from auth.users u
where lower(u.email) = 'missionary@example.com'
  and not exists (
    select 1 from public.user_roles r where r.user_id = u.id
  );
```

The statement is guarded: it inserts nothing when the Auth user does not exist
yet, and nothing when a role is already assigned, so it is safe to re-run.
Use `'administrator'` instead of `'missionary'` for a coordinator account.

### 3. Verify the assignment

```sql
select u.id::text as user_id,
       u.email,
       u.invited_at,
       u.email_confirmed_at,
       u.last_sign_in_at,
       r.role
from auth.users u
left join public.user_roles r on r.user_id = u.id
where lower(u.email) = 'missionary@example.com';
```

Expected: exactly one row with `role = missionary`. Before the invitation is
accepted, `email_confirmed_at` and `last_sign_in_at` are null, which is normal —
the role is already in place and takes effect at first sign-in.

The missionary's `profiles` row is optional and self-service: they can fill in
`/profile` after their first login, which inserts it through the existing RLS
policy. No row needs to be seeded here.

### Notes

- If the invitation email does not arrive, re-send it from the user's row in the
  Dashboard. Invitation links expire, so generate a new one rather than reusing
  an old email.
- There is no password-reset page in the app. To reset a missionary's password,
  use the Dashboard's password recovery for that user and have them set a new
  one from the emailed link, then share the new password securely.
