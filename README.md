# FitManager

FitManager is a bilingual Vietnamese/English management platform for personal trainers and small fitness studios. It uses Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL/RLS, and Vercel.

## Local development

Requirements: Node.js 20 LTS or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000/vi`. The English site is at `/en`.

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

There is currently no automated test script; do not treat a successful build as proof that database workflows are correct.

## Environment variables

Required for a connected environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

The URL and publishable key are intentionally public Supabase client configuration and are protected by RLS. Older Supabase projects may use `NEXT_PUBLIC_SUPABASE_ANON_KEY`; FitManager supports both names. Never put a service-role key in a `NEXT_PUBLIC_*` variable. `SUPABASE_SERVICE_ROLE_KEY` is reserved for a separately reviewed server-side administrative job and is not required by the current web application. Do not commit `.env.local` or production secrets.

## Supabase production setup

1. Create a separate Supabase project for production; never use development seed data there.
2. In Supabase Authentication, configure the production Site URL as `NEXT_PUBLIC_APP_URL`.
3. Add redirect URLs for `https://your-production-domain.com/vi/auth/callback` and `/en/auth/callback`. Keep localhost callback URLs only in the development project.
4. In Supabase Authentication > Providers, enable Google and Facebook and configure each provider's client credentials and callback URL as shown by Supabase. Add the same providers and callback URLs in the corresponding OAuth provider consoles.
5. Apply migrations in numeric order: `001_initial_schema.sql` through `010_learner_registration.sql`.
6. Prefer the Supabase CLI migration workflow for repeatable deployments. After installing the CLI, link the intended project and review the pending SQL before applying it: `supabase link --project-ref YOUR_PROJECT_REF`, then `supabase db diff`/review, then `supabase db push`. Take a database backup before applying changes. Use the Supabase SQL editor only when the same reviewed migration files are being applied.
7. Do not edit an already-applied migration. Add a new numbered migration for future changes.
8. Run `supabase/verification.sql` with an authorized database connection. Confirm expected tables exist, RLS is enabled, indexes exist, and `orphan_payment_count` is zero.
9. Create the first owner manually in Supabase Auth with a verified email, then insert the matching profile and `owner` role using the SQL in the Authentication section below.

Migrations are schema changes only. `supabase/seed.sql` is for development and must not be run against production.

## Authentication and authorization

Public email and OAuth registration creates a `customer` role and profile through migration `010_learner_registration.sql`; it never grants trainer or owner access. Google and Facebook must be enabled in Supabase before those buttons can complete authentication. Create the first owner manually in Supabase Auth, then run the following with a project owner/admin database connection:

```sql
insert into public.profiles (id, full_name, locale)
values ('AUTH_USER_UUID', 'Studio Owner', 'vi')
on conflict (id) do update set full_name = excluded.full_name;

insert into public.user_roles (user_id, role)
values ('AUTH_USER_UUID', 'owner')
on conflict (user_id, role) do nothing;
```

Dashboard routes are protected by middleware and server checks. Private tables use Supabase Row Level Security; frontend visibility is not an authorization boundary.

## Vercel deployment

1. Import the repository into Vercel and select the Next.js preset.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_APP_URL` to the Production environment only after checking their values.
3. Do not add `SUPABASE_SERVICE_ROLE_KEY` unless a separately reviewed server-only feature requires it.
4. Deploy a preview first and verify `/vi`, `/en`, `/vi/services`, `/api/health`, login, and an unauthenticated dashboard redirect.
5. After the production database is migrated and the owner account exists, promote/deploy production.
6. Configure the custom domain and update Supabase Auth Site URL and redirect allow-list to the final HTTPS domain.
7. Configure Vercel logs/alerts and monitor the health endpoint. The health endpoint is a liveness check; it does not expose database details.

## Health and error handling

`GET /api/health` returns a no-cache JSON liveness response. It intentionally does not reveal Supabase credentials or database internals. `not-found` and generic error boundaries provide safe user-facing fallbacks; detailed server diagnostics belong in Vercel/Supabase logs, not in browser responses.

## Troubleshooting

- `missing_supabase_config`: verify the three environment variables in the active Vercel environment or `.env.local`, then restart the dev server.
- Dashboard redirects to login: verify the Supabase session, the production Auth Site URL/redirect URLs, and that the user has an active profile and `owner`, `manager`, `staff`, or `trainer` role as appropriate.
- Empty dashboard data: confirm migrations were applied to the same Supabase project referenced by the environment variables and inspect RLS policies with `supabase/verification.sql`.
- Build fails on metadata: ensure `NEXT_PUBLIC_APP_URL` is a valid absolute URL, including `http://` or `https://`.
- Never fix deployment errors by disabling RLS, exposing service-role credentials, or deleting historical records.

## Deployment checklist

- [ ] Production Supabase project is separate from development.
- [ ] Reviewed migrations applied in order with a recovery plan.
- [ ] No seed data applied to production.
- [ ] RLS enabled and verification SQL reviewed.
- [ ] Owner account created manually; no public admin registration.
- [ ] Supabase Auth Site URL and redirect URLs use the final HTTPS domain.
- [ ] Vercel environment variables verified; no secrets committed.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass.
- [ ] `/api/health`, public routes, login, and unauthorized dashboard redirect verified.
- [ ] Vercel and Supabase logging/alerts configured.
- [ ] Backup and rollback plan documented before future migrations.
