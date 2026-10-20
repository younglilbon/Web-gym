# FitManager authentication verification

Run these checks against a local Supabase project after creating one owner and one customer-only test user. Do not use a real customer account for destructive tests.

| Case | Expected result |
| --- | --- |
| Open `/vi/dashboard` without a session | Redirect to `/vi/auth/login` |
| Open `/en/dashboard/customers` without a session | Redirect to `/en/auth/login` |
| Sign in with an invalid password | Localized generic credential error; no session is created |
| Sign in as an active `owner` | Redirect to the same-locale dashboard |
| Sign in as an active `trainer` | Redirect to the same-locale dashboard |
| Sign in as a customer-only user | Redirect to localized login with an authorization error |
| Refresh a dashboard page | Session remains available through Supabase SSR cookies |
| Sign out | Session is revoked and the user returns to the localized login page |
| Expire or revoke the session, then open dashboard | Middleware/server guard redirects to localized login |
| Change `/vi/...` to `/en/...` | Matching page remains open in the new locale |

Database checks:

1. In Supabase SQL Editor run `supabase/verification.sql`.
2. Confirm every listed private table has `rls_enabled = true`.
3. With the anon key, confirm private tables return no rows and the consultation RPC is the only public intake path.
4. With an owner session, confirm profile/role visibility works.
5. With a customer-only session, confirm trainer tables are denied by RLS even if a request is manually crafted.

The project currently has no test runner dependency. These are intentionally documented integration checks; adding Playwright or Vitest can be a separate milestone when a test environment and Supabase test project are available.
