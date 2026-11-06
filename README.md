# The Rock Lizard Adventure

A trekking and expedition website with a public frontend and an admin dashboard for managing trips, photos, enquiries and site settings.

## Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, Motion and TanStack Query.
- **Backend:** Express, TypeScript, Prisma and MySQL.
- **Services:** Cloudinary for uploaded images, Resend for email and Featurable for Google reviews.

## Requirements

- Git, Node.js **22.12 or newer in the 22.x LTS release**, and npm. Development has been checked with Node.js 22.23.2.
- A running MySQL server and an empty database with a user allowed to apply the supplied migrations.
- Cloudinary and Resend credentials for uploads and email. The backend currently validates these settings at startup, so leaving them blank prevents startup.
- A Featurable widget ID and Google review URL if you want the reviews integration enabled.

## 1. Download and install

```sh
git clone https://github.com/princepal09/TheRockLizardAdventure.git
cd TheRockLizardAdventure
npm ci
npm --prefix frontend ci
npm --prefix backend ci
```

There are three separate package installations. Installing only at the repository root does not install frontend or backend dependencies.

## 2. Configure environment files

Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`. On PowerShell, run these from the repository root:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Run the copy commands only for files that do not already exist. Keep real passwords and API keys in your local `.env` files and out of Git.

### Backend: `backend/.env`

Fill in every setting. This is a local configuration template; replace the placeholder values:

```dotenv
DATABASE_URL="mysql://rocklizard_user:YOUR_DATABASE_PASSWORD@localhost:3306/rocklizard_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
TRUST_PROXY_HOPS=0

ACCESS_TOKEN_SECRET=REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
REFRESH_TOKEN_SECRET=REPLACE_WITH_A_DIFFERENT_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
SALT_ROUNDS=12

ADMIN_NAME="Local Admin"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=REPLACE_WITH_YOUR_OWN_STRONG_PASSWORD

RESEND_API_KEY=YOUR_RESEND_API_KEY
MAIL_FROM=YOUR_VERIFIED_SENDER_EMAIL

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```

Create `rocklizard_db` in MySQL before running migrations. Use your own database name/user if preferred, and update the URL to match. Percent-encode special characters in the URL's username/password.

Generate each token secret separately with:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

`MAIL_FROM` must be a plain email address accepted by your Resend account. Real credentials are needed to actually send email or upload images; a database-only setup does not provide those features.

### Frontend: `frontend/.env`

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_OPS_SUPPORT_EMAIL=YOUR_SUPPORT_EMAIL
NEXT_FEATURABLE_WIDGET_ID=YOUR_FEATURABLE_WIDGET_ID
NEXT_PUBLIC_GOOGLE_REVIEW_URL=YOUR_GOOGLE_WRITE_A_REVIEW_LINK
```

The API URL must include `/api/v1`. The review widget ID and review URL may be left blank while working locally; the reviews section has fallback content. `NEXT_FEATURABLE_WIDGET_ID` is read on the server. Anything prefixed `NEXT_PUBLIC_` is public: never put service secrets there.

## 3. Prepare the database and admin account

Run these commands **inside `backend`** so Prisma can read its configuration and `.env` file:

```sh
cd backend
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
cd ..
```

This applies the repository's existing migrations, generates the Prisma client, and creates the initial admin using `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Seeding does not replace an existing admin with the same email or change their password. It does not populate trips, regions, seasons or gallery content.

For a new checkout, use `migrate deploy` as shown above to apply existing migrations. Use `migrate dev` only when intentionally developing a new database migration.

## 4. Run locally

From the repository root:

```sh
npm run dev
```

This starts both applications. Keep the terminal running; use `Ctrl+C` to stop them.

| Page                 | Local URL                          |
| -------------------- | ---------------------------------- |
| Public website       | http://localhost:3000              |
| Admin login          | http://localhost:3000/admin/login  |
| Backend health check | http://localhost:5000/health-check |
| API base             | http://localhost:5000/api/v1       |

Sign in with the admin credentials configured before seeding. Add regions and seasons before creating trips, configure contact details in site settings, and publish trips when ready. Departure dates and policies should contain confirmed client information; blank fields display a prompt to contact Basecamp.

You can also run the apps in separate terminals:

```sh
npm --prefix backend run dev
```

```sh
npm --prefix frontend run dev
```

Restart the appropriate application after changing its `.env` file.

## Checks

From the repository root:

Build both applications with `npm run build`. The root build command reuses an available API or starts the local backend temporarily, waits for it, verifies database-backed content is available, builds the frontend, and stops only the backend it started. MySQL and the configured database/migrations must already be ready. It does not create or seed the database.

If building each application separately, keep the API running during the frontend build:

```sh
npm --prefix backend run typecheck
npm --prefix backend run build
npm --prefix frontend run build
```

Frontend lint is available with `npm --prefix frontend run lint`. Existing unrelated lint issues may need separate cleanup.

Format frontend source files with `npm --prefix frontend run format`, or check formatting without changing files with `npm --prefix frontend run format:check`. These commands skip dependencies, generated output and static assets.

## Production configuration

### Road and bike trips

Road and bike trips are managed separately from treks and expeditions under
`/admin/trips`. Create a trip, select Road or Bike, and add route distance,
vehicle/rental arrangements, pickup information, prices, seasons, itinerary and
photos. Drafts are private; published trips appear at `/trips`, in the homepage
Trips section, in enquiry options and in the sitemap. Featured trips take
priority in the homepage section. The public cards and detail pages share the
existing visual style, with journey-specific labels and vehicle information.

Apply migrations and regenerate the Prisma client before deploying this update:

```sh
npm --prefix backend run db:deploy
npm --prefix backend run db:generate
```

For the local development MySQL database, run `npm --prefix backend run test:trips`
after seeding an admin. It checks authentication, ROAD/BIKE validation, draft and
published visibility, CRUD, itinerary ownership, bulk actions and enquiry
relations. It removes its own temporary records and does not send email or
upload images. See [Trips API contract](backend/docs/trips-api.md).

### API rate limits

The backend uses `express-rate-limit` with separate in-memory stores; Redis is not required.

| Endpoint | Limit |
| --- | --- |
| `POST /api/v1/auth/login` | 5 failed attempts per 15 minutes per IP + normalized email; successful logins do not count |
| `POST /api/v1/auth/forgot-password` | 3 requests per hour per IP + normalized email |
| `POST /api/v1/enquiries` | 5 submissions per 15 minutes per IP |
| Public content reads | 120 requests per minute per IP, shared across treks (including slug details), expeditions (including slug details), gallery, team, regions, seasons and site settings |

Exceeding a limit returns HTTP `429` with a JSON `message`, rate-limit headers and `Retry-After` in seconds. Failed validation counts toward the relevant limit. Protected dashboard routes, token refresh and health checks do not use the public-read quota.

Counters reset when the backend restarts or redeploys. Run one backend process/replica for a consistent quota; multiple processes require a shared store. Next.js server-side requests share the frontend server's IP and therefore its public-read quota; cached public fetches help reduce these requests.

`TRUST_PROXY_HOPS=0` is the safe default for local/direct connections. Before deploying behind Hostinger's reverse proxy, confirm its number of trusted proxy hops and set this value accordingly (`1` only for a verified single-proxy setup). The backend must not also be directly reachable through a shorter path, and the proxy must overwrite forwarded headers. Do not blindly trust all proxies: an incorrect setting can group all visitors together or let clients spoof their IP. Verify client IP separation on the deployed host before launch.

Set `NODE_ENV=production` on the backend, use HTTPS origins, set `FRONTEND_URL` to the real frontend origin, and set the frontend's `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_BASE_URL` to the production origins/API. Use production service credentials and a production database.

Apply migrations and generate the Prisma client before building the backend. Build both applications using the commands above, then start them in separate processes:

For a local production preview, run `npm start` from the repository root to launch both servers together. Stop development servers first to free their ports. This convenience command requires the root dependencies (including `concurrently`) installed with `npm ci`. For separate hosting services, use the individual commands below.

```sh
npm --prefix backend start
```

```sh
npm --prefix frontend start
```

Keep the backend available during the frontend build because some public pages load API data while prerendering. The root build command handles this for a local API; when deploying separate Hostinger apps, deploy the backend first and set the frontend's API URL to that live backend before building the frontend. Rebuild the frontend after changing public environment variables. Use a process manager or hosting service to keep both servers running.

## Troubleshooting

| Problem                                      | What to check                                                                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Build reports `ECONNREFUSED` on port 5000 | Run `npm run build` from the repository root to start the local API automatically. For a frontend-only build, start the API first. |
| `npm start` reports missing `.next` files | The previous build did not finish. Fix the build error and complete `npm run build` successfully before running `npm start`. |
| `Invalid environment variables`              | Complete `backend/.env`; secrets need at least 32 characters, the admin password needs at least 8, and `MAIL_FROM` must be an email address.   |
| Database connection fails                    | Start MySQL; check the database exists, user permissions and `DATABASE_URL`.                                                                   |
| Missing Prisma client or database columns    | Run the migrate and generate commands from `backend` with `--config prisma7.config.ts`.                                                        |
| Login fails on a fresh database              | Run the seed command and use the seeded email/password. Editing `.env` afterwards does not reset an existing admin.                            |
| Frontend cannot reach the API                | Check the backend health URL, API port and `/api/v1` suffix. `FRONTEND_URL` must match the browser origin for CORS.                            |
| Port 3000 or 5000 is occupied                | Stop the conflicting process, or update the ports and matching environment URLs together.                                                      |
| No trips or photos appear                    | A fresh database contains only the seeded admin. Add and publish content through admin.                                                        |
| Images or email fail                         | Check Cloudinary credentials and Resend API key/sender verification.                                                                           |
| Google reviews are unavailable               | Check the widget ID, review URL and provider availability. The section can show its fallback during an outage.                                 |
| Turbopack reports a CSS-worker process crash | Check the Node version and terminal permissions, stop stale build processes and retry. This is separate from a page's date/prerendering error. |

## Project layout

```text
frontend/               Next.js website and admin UI
backend/                Express API
backend/prisma/         Database schema, migrations and admin seed
frontend/public/        Static assets and downloadable forms
frontend/docs/          Public-site configuration and cache behavior
backend/docs/           Trip-planning fields and migration notes
```

See [public-site configuration](frontend/docs/public-site.md) and [trip-planning documentation](backend/docs/trip-planning.md) for details about cache refreshes, images and trip information.
