# HEARCURES analytics setup (Supabase)

This folder contains the database migration and the public event-ingestion Edge Function. The browser never receives the Supabase service-role key. The dashboard requires a Supabase Auth account; there is no registration form in the site.

## 1. Create the Supabase project

1. Create a project at https://supabase.com/.
2. In **Project Settings → API**, copy the Project URL and the publishable/anon key.
3. Create `.env` in the project root (next to `package.json`) based on `.env.example`:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```

4. Restart the Vite dev server after editing `.env`. These two values are meant for browser use; they are not secrets. Do **not** place a service-role key in any `VITE_` variable.

## 2. Create the database table and report function

Open **SQL Editor** in Supabase and run the complete file `supabase/migrations/202610210001_analytics.sql`.

The table stores event type, a temporary browser-session identifier, a limited page path, a coarse traffic-source category, a device category and (for contact clicks) a channel. It does not store names, phone numbers, email addresses, full referrer URLs, query strings or IP addresses in this table.

## 3. Deploy the event function

Install the Supabase CLI, sign in, and link the project from the project root. On Windows, you can use Scoop as described in the official installation guide, or install the CLI as a development dependency (`npm install --save-dev supabase`) and run it with `npx`:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy track-event
```

Supabase provides `SUPABASE_URL` and server-side key variables to Edge Functions. The function supports the built-in legacy `SUPABASE_SERVICE_ROLE_KEY` and new `SUPABASE_SECRET_KEYS` dictionary. Do not put a service-role/secret key in `.env`, React source, GitHub, or any browser field. The function config disables JWT verification because visitors are not signed in; the handler validates the event schema and allowlists every stored value. See the official [Edge Function deployment guide](https://supabase.com/docs/guides/functions/deploy) and [environment variable documentation](https://supabase.com/docs/guides/functions/secrets) if you need installation or troubleshooting help.

Because this is a public telemetry endpoint, consider adding rate limiting at the edge or through your hosting/WAF before high-traffic production use.

## 4. Create the administrator login

1. In Supabase, open **Authentication → Users** and add an administrator user with a real email and a strong password.
2. Turn off public sign-ups in the Authentication settings. Do not add a registration form to the website.
3. In **SQL Editor**, allowlist the new administrator email (replace the example address):

   ```sql
   insert into public.analytics_admins (email)
   values (lower('your-admin-email@example.com'))
   on conflict (email) do nothing;
   ```

4. The admin signs in at `/#/analytics` using that account. Both the SQL report function and table policy verify that the signed-in email appears in `analytics_admins`.

Do not share administrator credentials. To revoke access, delete that email from `public.analytics_admins` and remove or disable the Auth user.

## 5. Run and test

```powershell
npm install
npm run dev
```

Open the public site and accept analytics in the small consent panel. The browser will send a `page_view` event and the contact buttons will send `contact_click` events only after consent. Then open `/#/analytics`, sign in, and press **Обновить**.

Test the production bundle with:

```powershell
npm run lint
npm run build
npm run preview
```

Statistics will be zero until real visitor events are recorded. The single-page website currently has one page path, `/`; the dashboard does not invent page dwell time or bounce rate because those metrics are not measured by this event model.
