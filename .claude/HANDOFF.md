# Claude Ultra Code Handoff

Date: 2026-06-29

This repo is the UCLA Sports MRI Courses web app. The latest release work was focused on making the app better for sports medicine fellows as an installed/mobile web app, tightening normal MRI interactive workstations, improving local preview sign-in, and polishing pathology case review.

## Current Status

- Four normal MRI workstations are active: knee, shoulder, hip, elbow.
- Local preview sign-in is available from `/login` via "Continue in local preview" and bypasses the Google auth loop on localhost.
- PWA/home-screen assets are present: `manifest.webmanifest`, `sw.js`, offline page, apple touch icon, and maskable icons.
- Case pages now have better mobile controls, a sports-medicine readout section, and a cleaner image-review section.
- Elbow pathology cases now use source-attributed local ultrasound correlate images where the image matches the case anatomy.

## Most Recent Notable Changes

- Added/updated PWA install shell and premium UCLA Sports MRI app icons.
- Added offline/status/install UI components and local preview progress support.
- Added normal workstation regression tests and shared normal workstation URL/resume helpers.
- Polished guided tour, cross-plane drill, image CAQ, knowledge check, and advanced challenge components.
- Updated generated medical QA packets/source-check metadata across knee, shoulder, hip, and elbow.
- Added elbow case media helpers in `src/content/elbow/cases.ts`.
- Updated `src/pages/CasePage.tsx` so cases without local media show an `Image review focus` checklist instead of "images are still being added."

## Verification Already Run

- `npm test` passed: 37 test files, 327 tests.
- `npm run build` passed.
- `npm run lint` passed.
- Browser spot-checks on a fresh Vite server confirmed:
  - Local preview sign-in routes into protected case pages.
  - Updated elbow case teaching images decode when scrolled into view.
  - Capitellar OCD fallback shows an image-review checklist and no old unfinished-copy state.
  - No console errors appeared in the checked elbow routes.

## Known Remaining Gaps

- Local media gaps remain for:
  - `hip-cam-fai-labral-tear`
  - `hip-femoral-neck-stress-fracture`
  - `hip-athletic-pubalgia`
  - `elbow-capitellar-ocd`
- Do not add a substitute image unless it is anatomically and diagnostically appropriate. The current fallback is intentionally conservative and should not imply a local pathology image exists.
- If continuing medical-content work, keep the same standard: source-backed, conservative wording, and avoid implying MRI alone determines treatment.

## Suggested Next Work

1. Find or create truly appropriate local teaching images/stacks for the remaining media gaps.
2. Do a mobile pass on the case walkthrough/review screens after deployment, especially with the app installed to the home screen.
3. Continue source-backed marker/CAQ audits for normal hip and shoulder, mirroring the elbow rigor.
4. Consider adding an automated content audit script for core case media, step counts, and missing local asset paths so this stays easy to re-check.

