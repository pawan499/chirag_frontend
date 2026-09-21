# Eye-care shop management frontend

## User-facing outcome
A fast, responsive workspace for a single doctor/shop owner to move from patient search to eye examination, medicines, spectacles, billing, and payment without hospital-style complexity.

## Build scope
- Replace the placeholder with a professional light dashboard shell: desktop sidebar, mobile drawer, compact top bar, responsive page content, and shared status/empty/error/loading patterns.
- Add login with show/hide password and a local session flow for the current frontend-only environment.
- Add working screens for dashboard, patients, patient profile, new visit, today’s visits, medicines, spectacle orders, payments, reports, and settings.
- Use a small local service/data layer with realistic shop records, typed models, search/filter helpers, and mutation-like functions so it can be replaced by HTTP APIs later without coupling screens to mock data.
- Add form validation for patient, visit, medicine, payment, and settings flows with inline feedback and success toasts.
- Add responsive charts and collection summaries using the existing chart package; keep collection based on received payments and make outstanding dues explicit.
- Add page-specific metadata and remove the starter placeholder/metadata.

## Technical approach
- Use TanStack Router route files already provided by the project; do not add React Router or `src/App.tsx`.
- Use existing Tailwind v4 tokens in `src/styles.css`, lucide icons, React Hook Form, Zod, Recharts, and Sonner.
- Keep UI primitives and app shell in `src/components/`, typed demo/API abstraction in `src/lib/`, and pages in `src/routes/`.
- Use semantic theme tokens only; no hardcoded visual colors in page components.
- Keep mobile layouts card-first and use a drawer for navigation; keep desktop tables only where they improve scanning.
- Add `.env.example` with `VITE_API_BASE_URL` as the future API seam; no backend integration will be invented without an available backend.

## Verification
- Regenerate route tree through the Vite plugin.
- Check build diagnostics, run lint/build, and inspect the live preview at desktop and narrow mobile widths for overflow, navigation, forms, and key workflow states.
