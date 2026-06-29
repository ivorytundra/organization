# ☀️ Daily Digest

A personal dashboard that connects your **Google Calendar** and **Gmail** and
shows you everything that matters today, in one calm view:

- **Today's schedule** — every event on your primary calendar, with one-click
  Join links for Google Meet, a live "happening now" highlight, and an
  "up next" countdown.
- **Important email** — the signal from your inbox: anything Gmail marks
  important, anything you starred, and unread mail from the last couple of
  days — with Promotions and Social filtered out.

It uses **read-only** access to your Google account and stores nothing — the
data is fetched fresh each time you load the page.

> Out of the box the app shows a **demo with sample data** so you can see the UI
> immediately. Connect your Google account (below) to see your real day.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React 19
- [Auth.js / NextAuth](https://authjs.dev/) for Google OAuth
- [`googleapis`](https://github.com/googleapis/google-api-nodejs-client) for the Gmail + Calendar APIs
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open http://localhost:3000. Without credentials you'll see the demo; with them,
click **Connect Google**.

## Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create (or pick) a project.
2. **Enable the APIs** the app uses, in
   [APIs & Services → Library](https://console.cloud.google.com/apis/library):
   - Gmail API
   - Google Calendar API
3. **Configure the OAuth consent screen**
   ([link](https://console.cloud.google.com/apis/credentials/consent)):
   - User type: **External** (fine for personal use).
   - Add the scopes:
     - `.../auth/gmail.readonly`
     - `.../auth/calendar.readonly`
   - While the app is in **Testing**, add your own Google account under
     **Test users** (otherwise Google blocks sign-in).
4. **Create an OAuth client**
   ([Credentials](https://console.cloud.google.com/apis/credentials)):
   - Application type: **Web application**.
   - Authorized redirect URI:
     `http://localhost:3000/api/auth/callback/google`
     (add your production URL too when you deploy).
5. Copy the **Client ID** and **Client secret** into `.env.local`.

### Environment variables

| Variable             | What it is                                                            |
| -------------------- | --------------------------------------------------------------------- |
| `AUTH_GOOGLE_ID`     | OAuth client ID from the step above                                   |
| `AUTH_GOOGLE_SECRET` | OAuth client secret                                                   |
| `AUTH_SECRET`        | Random string to encrypt the session — `openssl rand -base64 32`      |
| `AUTH_URL`           | App base URL (`http://localhost:3000` locally)                        |

See [`.env.example`](./.env.example) for a ready-to-copy template.

## How "important" is decided

The Gmail query lives in [`src/lib/gmail.ts`](./src/lib/gmail.ts):

```
in:inbox newer_than:2d -category:promotions -category:social
  (is:important OR is:starred OR is:unread)
```

Results are then ranked: **important + unread** first, then starred, then plain
unread, newest within each tier. Tweak the query and the `score()` function to
match your own definition of "important".

## Deploying

The app is a standard Next.js app and deploys cleanly to
[Vercel](https://vercel.com/) or any Node host. Remember to:

- Set the same environment variables in your host (with `AUTH_URL` pointing at
  your production domain).
- Add `https://<your-domain>/api/auth/callback/google` as an authorized
  redirect URI in the Google Cloud console.

## Project layout

```
src/
  auth.ts                  Auth.js config (Google provider, token refresh)
  app/
    page.tsx               The dashboard (server component)
    layout.tsx             Root layout + metadata
    api/auth/[...nextauth] OAuth route handlers
  lib/
    digest.ts              Assembles the day's digest (real data or demo)
    calendar.ts            Fetch today's calendar events
    gmail.ts               Fetch + rank important email
    google.ts              Build authenticated Google API clients
    format.ts              Local-time formatting helpers
    mock.ts                Sample data for the demo preview
    types.ts               Shared serializable types
  components/              Dashboard UI (header, schedule, email, auth buttons)
```

## Privacy

Scopes are read-only (`gmail.readonly`, `calendar.readonly`). The app never
writes to or deletes anything in your account, and it doesn't persist your
calendar or email anywhere — each page load fetches live data and renders it.
