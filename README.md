# HireHub

HireHub is a static employee-onboarding interest portal. Candidates can learn about the organization and submit a validated expression of interest; a single demo administrator can review, edit, and delete submissions. It is intentionally browser-only: submissions use `localStorage` and demo authentication uses tab-scoped `sessionStorage`.

## Stack

- React 18 and Vite
- JavaScript/JSX and React Router v6
- Plain CSS with the PRD-prescribed token palette
- Vitest + Testing Library component/unit tests
- Playwright browser journeys
- Static Vercel deployment with SPA fallback

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL. The public routes are `/`, `/apply`, and `/admin`.

## Demo administrator

- Username: `admin`
- Password: `admin`

These credentials are intentionally hardcoded for this browser-only demo, as required by the product specification. They are not production authentication.

## Test and build

```bash
cd frontend
node node_modules/vitest/vitest.mjs run
node node_modules/vite/bin/vite.js build
node node_modules/@playwright/test/cli.js install chromium
node node_modules/@playwright/test/cli.js test --config playwright.config.js
```

Playwright starts the configured Vite server automatically. E2E screenshots are emitted into Playwright test output directories for human review.

## Persistence model

Submissions are stored as a JSON array under `hirehub_submissions`. Each record has `id`, `fullName`, `email`, `mobile`, `department`, and ISO `submittedAt` fields. Corrupted storage resets safely. The admin session uses `hirehub_admin_auth` in `sessionStorage`.

## Deployment

`vercel.json` deliberately contains only the SPA rewrite mandated by the PRD. Build from `frontend/` with `npm run build`; Vercel should serve the generated `frontend/dist` static assets. A standalone nginx Docker image is also supplied in `frontend/Dockerfile` and retains SPA deep-link fallback.

## License

Private and proprietary. All rights reserved.
