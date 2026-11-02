# StudioSpace

StudioSpace is a platform for discovering, listing, and booking creative workspaces such as photography studios, film stages, podcast rooms, music suites, and workshops. Users can browse available spaces by category, view studio details and amenities, book a studio, manage their own listings, and track their bookings through a personalized dashboard.

## Live Website

[https://studiospace-frontend.vercel.app](https://studiospace-frontend.vercel.app)

## Project Features

- Studio discovery and category-based browsing with search, location, and price filters
- Dynamic featured studios carousel on the home page
- Studio details pages with gallery, amenities, host information, and reviews
- User authentication (email/password and Google) with protected routes via middleware
- Studio listing creation, editing, and deletion for hosts
- Booking creation with date, time, duration, and crew count
- Booking cancellation for pending bookings
- Duplicate booking prevention (conflict validation at booking time)
- Responsive interface across mobile and desktop
- Light and dark theme support
- User dashboard and profile management (my listings, my bookings, profile)

## Technology Stack

- [Next.js](https://nextjs.org/) 16.4.3 — App Router, React Server Components, and client components
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) — strict type checking (`noEmit`)
- [Tailwind CSS](https://tailwindcss.com/) v4 — styling via CSS design tokens
- [shadcn/ui](https://ui.shadcn.com/) — accessible UI components (`@/components/ui`)
- [Better Auth](https://www.better-auth.com/) — authentication (email/password + Google social provider) with the MongoDB adapter
- [Sonner](https://sonner.emilkowal.ski/) — toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) — light/dark theme switching
- [lucide-react](https://lucide.dev/) — icons
- [MongoDB](https://www.mongodb.com/) — used by the Better Auth adapter on the server
- Express API integration — frontend calls the StudioSpace backend at `NEXT_PUBLIC_API_URL` (`http://localhost:5000` in development)

## Project Structure

```
src/
  app/                    # Next.js App Router routes
    layout.tsx            # Root layout (Navbar, Footer, theme providers)
    page.tsx              # Home page (Hero, Categories, Featured, HowItWorks, AboutUs)
    globals.css           # Global styles and design tokens
    loading.tsx           # Root loading UI
    not-found.tsx         # 404 UI
    login/                # Login page (public)
    register/             # Register page (public)
    studios/
      page.tsx            # Studio listing page with category/price filters (public)
      [id]/               # Studio details page with booking modal (public)
      loading.tsx
    add-studio/           # Create a new studio listing (protected)
    my-listings/          # Host dashboard: list, edit, delete studios (protected)
    my-bookings/          # User bookings with cancellation and receipts (protected)
    profile/              # Profile name and image management (protected)
    api/auth/[...all]/    # Better Auth route handler
  components/
    ui/                   # shadcn/ui primitives
    home/                 # Home page sections (Hero, Featured, Categories, Navbar, Footer)
    studio/               # Studio cards, edit and delete dialogs
    booking/              # Booking modal, gallery, host details, reviews, bookings list
    profile/              # Profile form
    providers/            # Theme provider and toaster
    shared/               # Empty states and loading skeletons
  lib/
    auth.ts               # Better Auth server configuration (MongoDB adapter)
    auth-client.ts        # Better Auth React client
    studio.ts             # Studio image/category helpers
    booking.ts            # Booking and status types
    type.ts               # TStudio type definition
    getTokenFromClient.ts # Client-side JWT token helper
    getTokenFromServer.ts # Server-side JWT token helper
    notify.ts             # Sonner toast helpers
    utils.ts              # Shared utilities
  proxy.ts                # Middleware protecting /add-studio, /my-bookings, /my-listings/:path*, /profile
```

## Local Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/abdulkader02/A8-StudioSpace.git
```

2. Navigate into the project (the repository root is the client-side project):

```bash
cd A8-StudioSpace
```

3. Install dependencies using npm:

```bash
npm install
```

4. Create the environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not provided, create `.env.local` manually based on the variables below.

5. Configure the required environment variables in `.env.local`:

```
# Better Auth
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (used by the Better Auth adapter)
MONGODB_URI=your-mongodb-connection-string

# Google social provider
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# StudioSpace Express backend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Variable reference:

| Variable | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Secret used to sign Better Auth sessions |
| `BETTER_AUTH_URL` | Base URL of the Next.js app (used by Better Auth) |
| `MONGODB_URI` | MongoDB connection string for the Better Auth adapter |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for social sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret for social sign-in |
| `NEXT_PUBLIC_API_URL` | Base URL of the StudioSpace Express backend API |

Do not commit `.env.local`; env files are gitignored (`.env*`).

6. Start the development server:

```bash
npm run dev
```

7. Open the local development URL:

```
http://localhost:3000
```

## Environment Variables

The frontend requires the following environment variables to run locally:

| Variable | Example value | Used for |
|---|---|---|
| `BETTER_AUTH_SECRET` | `Not provided` | Better Auth session signing |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Better Auth base URL |
| `MONGODB_URI` | `Not provided` | MongoDB connection (Better Auth adapter) |
| `GOOGLE_CLIENT_ID` | `Not provided` | Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | `Not provided` | Google OAuth sign-in |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | StudioSpace Express backend API |

Example `.env.local` (placeholder values only — do not use real secrets):

```
BETTER_AUTH_SECRET=replace-with-a-generated-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/studiospace
GOOGLE_CLIENT_ID=replace-with-your-google-client-id
GOOGLE_CLIENT_SECRET=replace-with-your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The StudioSpace Express backend (API) must be running separately at `NEXT_PUBLIC_API_URL` for studio and booking features to work. The backend is not part of this repository.

## Examiner Test Credentials

Email: Not provided  
Password: Not provided

No examiner test account credentials are present in the project. Credentials must be supplied by the project owner before testing authenticated flows.

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page (Hero, Categories, Featured studios, How It Works, About Us) |
| `/login` | Public | Email/password login |
| `/register` | Public | User registration |
| `/studios` | Public | Studio discovery with category, keyword, location, and price filters |
| `/studios/[id]` | Public | Studio details, amenities, host info, reviews, and booking |
| `/add-studio` | Private | Create a new studio listing |
| `/my-listings` | Private | Host dashboard: view, edit, and delete your listings |
| `/my-bookings` | Private | View your bookings, cancel pending bookings, download receipts |
| `/profile` | Private | Update profile name and profile image |
| `/api/auth/[...all]` | Public | Better Auth route handler (sign-in, sign-out, sessions) |

Private routes are protected by Next.js middleware (`src/proxy.ts`), which redirects unauthenticated users to `/login`. Protected matchers: `/add-studio`, `/my-bookings`, `/my-listings/:path*`, `/profile`.

## Booking and Security

- Booking creation: an authenticated user selects a date, start time, duration, and crew count, then submits a booking request to `POST /booking`.
- Booking statuses: `Pending`, `Confirmed`, `Completed`, `Cancelled`.
- Booking cancellation: only bookings with `Pending` status can be cancelled via `PATCH /booking/:id/cancel`.
- Duplicate booking prevention: the client handles a `409` conflict response, indicating the studio is already in the user's booking list.
- Authentication: sessions are managed by Better Auth (email/password and Google). Protected routes require an authenticated session; unauthenticated users are redirected to `/login`.

JWT HTTPOnly cookie security is not claimed here; confirm session cookie behavior directly against the backend implementation if required.

## Deployment

- Live URL: [https://studiospace-frontend.vercel.app](https://studiospace-frontend.vercel.app)
- Production environment variables: the same variables listed above (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`) must be configured in the production hosting environment.
- Deployment note: the frontend is deployed on Vercel. The StudioSpace Express backend must be running separately and reachable at `NEXT_PUBLIC_API_URL` for studio discovery, listings, and bookings to function in production.
