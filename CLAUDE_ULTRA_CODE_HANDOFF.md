# Handoff to Claude Ultra Code - UCLA Sports MRI App

Last updated: July 21, 2026 (7/24 teaching-session prep + two knee medical-accuracy passes)

Repository: `/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app`

Branch: `main`

Current product HEAD: `106d227 Knee course: second literature-verified medical-accuracy pass (8 corrections)`. The July 19 handoff HEAD was `be2f5ea`; twelve commits of 7/24-teaching-session prep have landed since (`9ed7516`..`106d227`), documented in the new section below.

Production:

- Custom domain: `https://jeremyswisherkneemri.com`
- Firebase Hosting: `https://ucla-knee-mri.web.app`
- Firebase project: `ucla-knee-mri`
- On 2026-07-21, after the latest deploy, both production domains were verified serving the same current bundle `index-CfUWAHBv.js`, and a corrected teaching string was confirmed live in the production JS.

The web/PWA is the active shipping surface. Native iOS submission remains paused; read the iOS section before touching `ios/` or any App Store evidence tooling.

## Start Here

Before changing anything:

```bash
cd "/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app"
git status --short --branch
git log -5 --oneline --decorate
npm run lint
npm test
npm run test:normal
npm run build
```

Expected baseline at handoff:

- `main` is synchronized with `origin/main` (pushed through `106d227`).
- Full suite: 59 test files, 450 tests passing (verified 2026-07-21).
- `npm run lint`, `npm run test:types`, `npm run build`: clean (2026-07-21).
- Performance gate: 210.9 KiB initial gzip across 11 assets (largest `react-vendor` 57.6 KiB); 14 MRI stacks checked; largest stack 2,518.6 KiB and largest slice 91.1 KiB.
- `npm run qa:medical`: 2,768 review items, 1,360 high-risk items, 1,587 source checks, and zero automated diagnostics (2026-07-21).
- NOT re-run in the 2026-07-21 content-only pass (they carry forward from July 19 — re-run if you touch the relevant surface): `npm run test:normal` (was 12 files / 53 tests), `npm run test:e2e` Playwright (was 15 pass / 1 intentional desktop skip), and `npm audit --omit=dev` (was zero vulnerabilities; no dependencies changed since).

If any of those differ, reconcile the working tree and recent commits before assuming this document is still exact. Do not discard uncommitted user work.

## Current Product State

The application contains four active MRI courses:

- Knee MRI
- Shoulder MRI
- Hip MRI
- Elbow MRI

Each course has a real-image interactive normal MRI workstation with:

- Explore
- Guided Tour
- Knowledge Check (Identify and Locate)
- Cross-Plane
- Compare
- Advanced
- Image CAQ

The app is optimized for fellows using a mobile home-screen PWA, while retaining a desktop workstation experience. It also includes course modules, search patterns, cases, pre/post assessments, progress, spaced review, reference material, certificates, and an admin dashboard.

## Changes Since the July 19 Handoff (7/24 live teaching-session prep)

Twelve commits (`9ed7516`..`106d227`) prepared the app for the **July 24, 2026, 1–3 PM live knee-MRI teaching session** with Dr. Kimberly Burbank and three sports-medicine fellows. Grouped by theme; the individual commit bodies carry the full rationale.

### Live-session faculty tooling: `9a57feb`, `b994789`, `41c1891`

- **`/admin/session`** roster-readiness page: per-fellow signed-in / baseline-quiz / confidence-survey / normal-MRI-plane status, a copy-paste invite, an Hour-1 walkthrough with deep links into the exact series+mode, and Hour-2 case cards with persisted per-fellow lead assignment.
- **Projector-safe toggle.** The page may be mirrored to a projector while the app deliberately hides case diagnoses from fellows, so the toggle hides every faculty-only field. A test asserts the projector-safe fields contain no finding vocabulary (an early draft leaked "MPFL"/"extrusion" through the impression prompts).
- **Resident-role flagging.** The roster red-flags resident accounts, because Case 2 (medial-root-tear, `residentVisible:false`) hard-gates residents out and would dead-end them.
- **`src/content/teaching-session.ts` is the single canonical timeline** — each case carries an explicit non-overlapping `window`; `teaching-session.test.ts` validates every case id and Hour-1 series-id+mode against the real registries and asserts the printed `SESSION_2026-07-24_KNEE_RUNSHEET.md` matches it (a dead deep-link at 2 PM on a Friday is not recoverable).
- Two structural realities the run-sheet is built around, both verified in `CasePage.tsx`: **case steps 1–7 render no images** (images show only at step 0 and the review step; between them it is a checklist + textarea), and **each case names its own diagnosis on its opening screen**. The plan is therefore projector-driven images, with the Radiopaedia link flagged as the only scrollable stack.

### Knee medical-accuracy hardening: `b994789`, `4a04c36`, `38274fd`, `106d227`

Four escalating literature-verified passes, each retrieving primary sources (PubMed / full text, not model memory) and double-adjudicating every flag before shipping. The knee course content and the faculty run-sheet are now source-checked. The load-bearing facts are recorded in the Claude memory note `knee-content-medical-facts.md`; do not regress them:

- **TT-TG** bands are CT-derived (Dejour); on MRI, abnormal ≈ ≥15 mm and the CT-20 mm cutoff ≈ **16 mm** on MRI (Camp 2013). Never apply the CT >20 mm rule to an MRI number. (An intermediate pass briefly wrote "≈13 mm" — that was wrong and is corrected everywhere.)
- **Meniscal extrusion** >3 mm is pathologic (Costa 2004); there is **no validated ">5 mm severe" tier** — report the measured value, and it is a medial-meniscus clue (do not apply it laterally).
- **Cartilage grading**: modified Outerbridge ≠ ICRS. Full-thickness loss with an intact plate = Outerbridge IV = ICRS 3C; ICRS 4 breaches the plate.
- **MPFL** tear is patellar-predominant on MRI (~47%), and **tear site does not predict recurrence** — Jiang 2020 meta (PMC7541236) found no significant difference (femoral 37.6% vs patellar 32.3%, p=0.17). The earlier "femoral-sided carries higher recurrence risk" was overstated and removed.
- **Segond** mechanism is internal rotation + varus (not "valgus"); **reverse Segond** is a medial/anteromedial tibial-rim avulsion (not "posteromedial"/"posterior").
- **Ramp-lesion** MRI sensitivity is pooled ~65–71% at ~88–94% specificity.
- **Lateral extra-articular tenodesis** is indicated by clinical graft-failure risk (STABILITY RCT, PMID 33208644), not by an MRI-shown ALL injury.
- Medial meniscal **root** is anteromedial to the PCL (not "lateral to"); anterior-tibial-translation cutoffs are Vahey 1993 (7 mm; 5 mm is 93%-specific, not sensitive).
- **"Satisfaction of search"** is *a* common cognitive error, not "the most common" (underreading/perceptual miss is #1 at ~42%, Kim & Mansfield, AJR 2014).
- Answer keys checked with no wrong keys found: 28 pre/post, ~90 module-quiz, 101 workstation knowledge-check.

### Learner-facing UX for the pilot: `62e861a`, `b55e9a8`, `282a55e`

- **Home / Cases above the fold.** The course picker and the case list were buried below full-height start cards and explainers; on a 375×812 phone the first course card began at y≈912 (0 cards visible). Both pages now lead with the primary content, explainers moved below. Measured: first course card y=912→172; first case card y=925→626.
- **Spoiler-safe case filter + search.** Status chips (All / Not started / Completed) with live counts and a search box that only ever matches text already visible on the card — clinical scenario + tags while a case is unopened, plus title + diagnoses once completed — so a learner cannot type "ACL" and be told which case is the ACL tear. Original "Case N" numbering preserved under filters.
- **Daily review cap + case commit-gate.** Spaced-review queue capped at 20 (`DAILY_REVIEW_CAP`) with an "N of M · N due total" denominator and most-overdue-first ordering; case pages gate the reveal behind a committed read (typed primary impression + pre-reveal confidence slider, with a "Skip and reveal" escape), stored on the attempt. Plus paired per-fellow domain-mastery delta, an account-deletion request panel, and admin action audit fields.

### Whole-app correctness fixes: `9ed7516`, `62e861a`, `19a7f24`, `276504f`

- **Offline submit hangs.** With `persistentLocalCache`, a write is durably queued to IndexedDB immediately but the `addDoc`/`setDoc` promise only settles on server ack, so awaiting it offline stranded learners on "Submitting…" with their (client-computed) score unreachable. A shared **`settleWrite()`** helper (races the write against a 4 s ack timeout, pre-attaches a catch so a later offline rejection can't surface as unhandled) now backs `submitQuiz`, `submitSurvey`, `completeModule`, and `submitCaseAttempt`.
- **Stable research-export participant codes.** Codes are now an FNV-1a hash of the uid, not an index into the role-filtered list — the old scheme reassigned every code when the filter flipped or a learner enrolled, which would misattribute one learner's pre/post scores to another on a merged longitudinal export. Cohort- and enrollment-independence regression tests added.
- **Service worker.** `/images/` teaching stacks (stable filenames) now revalidate in the background instead of staying pinned cache-first forever, so a corrected MRI image reaches installed users; `/assets/` (content-hashed) stays cache-first.
- **Analytics denominators normalized once** at the read boundary (`getUserProgress`) so psychometrics, growth, the dashboard tables, and the CSV cannot report different n's for the same cohort.
- Additional audited fixes: certificate double-send guard, restorable-mode set unified so admin "Adjust" survives reload, role-aware "See it injured" bridge, a GlobalSearch spoiler leak closed, CSV formula-injection neutralized, and `safeInternalPath` hardened against backslash.

## Changes Since the July 10 Handoff

### Curriculum and mastery: `4a08f69`

- Unified the learner-facing course journey and learning-path data across all four courses.
- Reworked normal MRI Knowledge Check into explicit Identify and Locate rounds with tested per-plane mastery logic.
- Normal MRI completion remains tied to passing every required plane at 70 percent.
- Added client/server completion-contract regression tests so certificate and progress calculations cannot silently drift.
- Expanded elbow normal-MRI learning content and regenerated medical-QA data.

### Pilot operations and PWA release gates: `ac99667`

- Added in-context issue reporting from the normal MRI workstations and a course-filtered admin resolution panel.
- Reports preserve the exact route, mode, series, slice, marker/question context, and optional learner note without putting private learner identifiers into source code.
- Added Playwright coverage for the learner journey, all four workstations, issue reporting, mobile routes, and PWA offline/update recovery.
- Added service-worker update UX and stronger local preview/App Review guards.
- Added Firestore rules and indexes for the reporting workflow.

### Mobile, medical-language, and performance polish: `6fcfecf`

- Fixed guided-tour mobile clipping, toolbar/FAQ overlap, comparison control labels, install-prompt expiry, and learner resume copy.
- Added mobile route sweeps, guided-tour layout checks, cross-plane accessibility checks, PWA icon/install tests, and a production performance budget.
- Replaced overconfident medical wording around the meniscal two-slice rule, magic angle, extrusion/root tears, SIFK, Segond/arcuate findings, FAI, and related teaching points.
- Regenerated the medical-QA packets after those wording changes.

### Claude adversarial fixes: `9e299c8` and `be2f5ea`

- Prevented an offline issue-report submission from trapping the user in a permanently locked modal.
- Stopped module Knowledge Check answers from reshuffling after a learner answered.
- Made PWA update, FAQ positioning, and course-filtered admin issue loading resilient.
- Preserved the installed-PWA auth constraint: popup failure must not fall back to a redirect that opens Safari in a separate storage context.
- Standardized spaced-review summary dates on UTC.
- Kept long flashcard actions visible, restored MRI viewer focus indication, fixed search pointer/keyboard competition, and announced Image CAQ feedback to assistive technology.
- Added pathname-based scroll reset, corrected mobile sticky-action spacing and quiz wrapping, enlarged undersized touch targets, paused cine on manual scrub, and preserved original quiz numbering under filters.

### July 19 handoff-readiness fixes

- Updated the vulnerable Firebase transitive dependency `websocket-driver` from 0.7.4 to patched 0.7.5. Do not add it as a direct application dependency.
- Made `ios-evidence-audit.test.ts` execute its expensive evidence subprocess once per suite with a 30-second setup allowance. The previous implementation ran it twice and could exceed Vitest's five-second test timeout under concurrent load.
- Regenerated medical-QA packets on July 19; content totals and zero-diagnostic status are unchanged.
- Re-ran lint, all unit/component tests, the focused normal-MRI suite, production build/performance budget, production dependency audit, medical QA, and full desktop/mobile Playwright suite.

## Earlier Work Preserved from the July 10 Handoff

### `8200592 Polish PWA workflows and strengthen MRI workstation QA`

This was the main app-polish and QA release.

#### Login and PWA

- Reworked `LoginPage` for clearer mobile onboarding, larger touch targets, the production PWA icon, and return-destination messaging.
- Google and Apple sign-in behavior remains routed through the existing popup/redirect safeguards.
- Local preview and App Review demo paths remain available only under their existing guards.
- The production PWA manifest, service worker, Apple touch icon, and 512 px icon were verified live.

#### Admin dashboard

- Expanded the admin layout to `max-w-7xl`.
- Added a tracked-fellows panel for:
  - Riley Coon
  - Sonal Singh
  - Lilian Toaspern (with a `Lillian` spelling alias)
- Matching uses normalized display name plus email text; no learner UID or private email is hard-coded.
- The panel shows sign-in match state, course progress, normal MRI progress, modules, cases, post-quiz score, inactivity, and the next recommended step.
- Added normal-MRI progress to the learner table and expanded learner detail.
- Important limit: local preview intentionally has fellow permissions, so the updated authenticated admin dashboard was compiled and tested but was not visually exercised with a real admin session during Codex QA. Perform that visual pass before making broad admin layout changes.

#### Normal MRI interaction fixes

- Fixed a real keyboard-accessibility bug in Cross-Plane free response.
- Free response now supports arrow-key crosshair movement, Shift for fine movement, and Enter/Space to submit.
- Ordinary mouse/touch behavior is unchanged.
- Added tests for movement and coordinate clamping.
- Improved mobile mode-strip positioning so direct links reveal the active mode.

#### Review and content integrity

- Workstation-derived spaced-review items are now explicitly course-scoped.
- Added regression coverage for every workstation route, series, stack folder, slice file, marker range, unique ID, answer key, Cross-Plane bank, Advanced bank, and Image CAQ bank.
- Added must-not-overcall content safeguards for high-risk teaching points.
- Regenerated all medical-QA packets and the admin source-check queue.

#### Medical-content refinements

- Moved the hip coronal SI-joint marker from `(40,45)` to `(34,45)` so it sits on the joint cleft rather than too medially.
- Refined Buford-complex teaching: do not repair an otherwise normal variant in isolation, but do not dismiss it because it can coexist with and is associated with SLAP pathology. The superior labrum and biceps anchor still require inspection.

### `128a78f Fix desktop scrolling over MRI viewers`

This fixed a user-reported production bug.

Root cause: `MriStackViewer` unconditionally called `preventDefault()` for every wheel/trackpad event over the large image. On desktop, the image occupies much of the viewport, making the page feel completely scroll-locked.

Current required behavior:

- Ordinary vertical wheel/trackpad gestures scroll the page, even directly over the MRI image.
- Horizontal trackpad gestures scrub slices.
- Shift + mouse wheel scrubs slices.
- Drag, arrow keys, slider, previous/next controls, and cine playback still work.
- Small diagonal or jitter events must not accidentally change slices.

Do not restore unconditional vertical-wheel slice capture. The behavior is isolated in:

- `src/components/ui/MriStackViewer.tsx`
- `src/components/ui/mri-stack-wheel.ts`
- `src/components/ui/MriStackViewer.test.tsx`

Two shoulder case captions were updated so their instructions match the new controls.

## Browser QA Evidence

The July 19 Playwright run exercised both desktop and mobile projects: 15 tests passed and the mobile-only route sweep was intentionally skipped in the desktop project. It covered the five-step elbow learner journey, exact-context issue reporting and admin resolution, PWA recovery/update behavior, and every plane/mode in all four normal MRI workstations.

Earlier Codex and Claude passes also used local preview authentication and real input events.

### Whole app

- 135 mobile routes were loaded across knee, shoulder, hip, elbow, account, support, privacy, accessibility, login, and protected-route behavior.
- No broken visible images, error boundaries, page-not-found states, content-coming-soon fallbacks, or page-level horizontal overflow were found.
- Search dialog body-lock cleanup and case-lightbox body-lock cleanup were explicitly verified.
- Nine representative long desktop pages were wheel-scrolled successfully: dashboards, modules, search pattern, cases, reference, progress, and cross-course pages.

### Normal MRI workstations

- 58 mobile workstation states passed:
  - all 14 series in Explore, Guided Tour, and Knowledge Check
  - each course in Cross-Plane, Compare, Advanced, and Image CAQ
- All 14 Identify knowledge checks rendered four options, accepted an answer, enabled Next, and advanced.
- All 14 Locate checks accepted keyboard placement and advanced.
- All 14 guided tours advanced to step 2 and back to step 1.
- All four Cross-Plane multiple-choice banks advanced correctly.
- All four Advanced banks and all four Image CAQ banks started, answered, showed feedback, and advanced.
- All four Compare modes rendered two working MRI stacks and changed planes.
- All 14 Explore stacks advanced by keyboard.
- Cross-Plane free response passed keyboard submission in all four courses after the fix.

### Scroll regression

- Vertical wheel input directly over the viewer was tested in knee, shoulder, hip, and elbow. In all four, the page moved and the MRI slice stayed unchanged.
- Horizontal trackpad input advanced the MRI slice without moving the page.
- Mobile home-screen dimensions (`390x844`) had no horizontal overflow, retained viewer side gutters, and scrolled normally.
- The same vertical and horizontal input behavior was verified on the deployed custom domain after Firebase release.

## Medical QA: What Is Proven and What Is Not

Generated summary: `medical-qa/summary.json`

- Review items: 2,768
- High-risk items: 1,359
- Source-check items: 1,586
- Automated diagnostics: 0
- Diagnostic errors: 0
- Diagnostic warnings: 0

Zero diagnostics means the automated structural/content-integrity checks are clean. It does not prove every medical statement or marker is clinically perfect.

The supplied evidence checklist was reviewed at:

`/Users/jeremyswisher/Downloads/Evidence-Based Normal MRI Teaching Checklist for Sports Medicine Fellows.pdf`

Current high-yield safeguards explicitly preserved by regression tests include:

- Knee: meniscal extrusion is a root-tear clue, not a diagnosis; TT-TG is not a standalone surgical rule; superficial and deep MCL are both taught.
- Shoulder: acromial morphology is not a standalone impingement diagnosis; Buford-complex nuance is preserved.
- Hip: cam/pincer morphology is not symptomatic FAI by itself; GTPS is not reduced to isolated bursal fluid.
- Elbow: capitellar OCD requires coronal and sagittal correlation; the UCL T-sign extends beyond the cartilage edge; isolated ulnar-nerve T2 signal is insufficient.

Do not tell Jeremy that the app is medically error-free or that automated QA has clinically validated it. Final teaching-grade approval still needs physician/MSK-radiology review with source notes.

## Marker Audit Status

Structural validation now guarantees that every normal-workstation marker:

- uses finite 0-100 percent coordinates
- references an existing series
- references a valid slice
- points to an existing image file

Codex manually rechecked the prior marker punch list on rendered source images:

- Hip coronal SI joint: confirmed too medial and fixed to `(34,45)`.
- Elbow sagittal coronoid: visually plausible on the bony beak; left unchanged.
- Shoulder coronal glenoid/labrum: visually plausible for the labeled structure; left unchanged.
- Shoulder axial bicipital groove: visually plausible; left unchanged.
- Shoulder axial coracoid: visually plausible on the coracoid cortex; left unchanged.
- Hip coronal sourcil, cartilage, femoral neck, abductors, and trochanter: visually plausible; left unchanged.
- Elbow axial ulnar nerve at `(20,61)`: still the most ambiguous marker. It is not clearly wrong, but exact teaching-grade confirmation requires tracking the nerve through adjacent slices with a human MSK reviewer.

Standing rule: do not move a marker from a single AI image read. Require consistent cross-slice evidence and human/radiologist confirmation. The admin Adjust mode remains the safest coordinate-editing surface.

## Recommended Next Work

Priority order:

1. **Real-device authentication acceptance test**
   - Test Google sign-in on Safari, Chrome desktop, and the installed iOS home-screen PWA.
   - Confirm the exact `returnTo` page survives login and the session remains available after closing/reopening the PWA.
   - Exercise popup cancellation/failure while installed and confirm the app shows the actionable retry message instead of redirecting into Safari.
   - Test Apple sign-in only if its provider configuration is actually complete; do not infer production behavior from localhost.

2. **Authenticated admin and issue-report pilot QA**
   - Log in with a real admin account.
   - Verify the Riley/Sonal/Lilian matching cards against the real Firestore profiles.
   - Check desktop and mobile wrapping, long emails/names, missing accounts, zero-progress accounts, inactivity, and Open row behavior.
   - Submit, filter, open, and resolve one real non-PHI test issue for each course; confirm the stored route/mode/series/slice context is exact.
   - Do not expose learner email/UID data in screenshots or commits.

3. **Faculty medical sign-off workflow**
   - Start with the ulnar-nerve marker and the highest-risk rows in `medical-qa/review-items.csv`.
   - Record reviewer, date, source notes, and decision rather than making unsourced bulk edits.
   - Regenerate with `npm run qa:medical` after source changes.

4. **PHI/provenance audit of teaching stacks**
   - Run an OCR and visual sweep of `public/images/teaching/stacks/`.
   - Create a durable provenance/PHI-review record for each stack.
   - Add complete source/license links for permissively licensed teaching images.

5. **Observe the three-fellow pilot before adding broad features**
   - Use issue reports, completion friction, inactivity, and repeated misses to choose the next app change.
   - Favor targeted remediation links and pace/time-to-completion views over a generic enterprise analytics dashboard.
   - Keep the current five-step curriculum comprehensible; avoid adding another top-level learning mode without pilot evidence.

6. **Dependency and function maintenance**
   - `npm audit --omit=dev` is clean. Plain `npm audit` still reports eight moderate advisories in the dev-only `firebase-admin` toolchain.
   - Do not run `npm audit fix --force`; the proposed resolution changes `firebase-admin` across a breaking boundary.
   - Firebase deploy also warns that the Functions package uses an older `firebase-functions` version. Upgrade Functions separately with emulator/tests rather than mixing it into learner-facing work.

## Critical Behavior Contracts

- Pre-assessment remains a clean baseline: no answer-key feedback and no spaced-review seeding.
- Workstation review IDs and entries remain course-scoped.
- Every normal MRI course requires passing each plane knowledge check at 70% for normal-MRI completion.
- Knee cases remain optional for certificate completion; non-knee course requirements follow existing course definitions.
- `MriStackViewer` must not trap ordinary vertical desktop scrolling.
- On mobile, vertical touch scrubs the MRI; the approximately 40 px side gutters remain available for reliable page scrolling.
- Double-tap zoom must be armed only by a stationary single-finger tap, never by rapid scrub flicks.
- Manual scrub/slider/previous/next input pauses cine playback.
- Search and lightbox dialogs must restore body scrolling on close/unmount.
- Offline Firestore profile reads must not erase a signed-in fellow's cached role.
- Spaced-review due-day comparisons stay UTC throughout the pipeline.
- Issue-report dialogs must always remain dismissible and an offline queued write must not leave `submitting` stuck.
- A PWA update must not force-reload other clients and destroy in-progress quiz state.
- Installed standalone PWA auth must not fall back from popup failure to cross-context redirect sign-in.
- Do not weaken local-preview/App Review demo guards or expose those paths as normal production login options.
- Do not claim all medical markers are exact without faculty confirmation.
- Do not modify or delete user changes encountered in the working tree.

## Deployment Workflow

For app changes:

```bash
npm run lint
npm test
npm run test:normal
npm run build
npm audit --omit=dev
git diff --check
git status --short
```

For interaction, routing, authentication-shell, PWA, or normal-MRI changes, also run:

```bash
npm run test:e2e
```

For medical content changes, also run:

```bash
npm run qa:medical
```

Then review generated diffs before committing. Deploy only a passing build:

```bash
firebase deploy --only hosting
```

After deploy, verify both production domains, the current hashed app bundle, `manifest.webmanifest`, `sw.js`, the 512 px icon, and at least one real MRI stack asset. For interaction changes, use the deployed App Review demo to verify the actual production bundle without using a learner account.

The service worker uses network-first navigation and content-hashed assets. A currently open tab still needs one refresh after deployment; an installed PWA may need to be closed and reopened once.

## iOS App Store Submission Is Paused

Do not resume native iOS submission work unless Jeremy explicitly reopens it.

The pause is intentional and based on unresolved risks:

1. Several bundled teaching images use CC BY-NC / BY-NC-SA licenses. App Store distribution under a personal account may conflict with those noncommercial terms.
2. The app uses UCLA branding, certificates, and copyright language while the Apple developer account and bundle ownership are personal. UCLA Trademarks & Licensing and department authorization, or a UCLA-owned Apple organization account, should be resolved before submission.
3. App Store distribution signing/provisioning and App Store Connect evidence remain incomplete.

The July 19 evidence audit reports 1/7 audited groups ready: screenshots are 3/3; archive signing, Apple/Firebase auth (0/6), real-device/account deletion (0/5), App Store Connect (0/10), hard submission, and release evidence (0/3) remain TODO. The native project and evidence scripts are retained but dormant:

- Bundle ID: `com.jeremyswisher.uclasportsmri`
- Team ID: `X578T4K65B`
- Xcode project: `ios/UCLASportsMRI.xcodeproj`
- Scheme: `UCLASportsMRI`

Never commit Apple private keys, `.p8` files, API keys, issuer IDs, app-specific passwords, Firebase service-account paths, real learner emails/UIDs, or PHI. Do not mark an external evidence gate complete unless it was actually verified.

## Scope and Collaboration Rules

- Stay inside `knee-mri-app` unless Jeremy explicitly redirects the work.
- Claude and Codex share this repository across sessions. Always reconcile `git status` and `git log` first.
- Work with existing changes; do not reset or revert edits you did not create.
- Prefer current project patterns over new frameworks or broad refactors.
- Keep user-facing web/PWA quality ahead of dormant certificate or iOS work unless Jeremy explicitly changes the priority.

## One-Paragraph Executive Summary

The web/PWA is live at the current product release `106d227` and is substantially hardened for the three-fellow pilot and the July 24 live knee-MRI teaching session with Dr. Burbank. Since the July 19 handoff, twelve commits added the `/admin/session` faculty tooling and canonical `teaching-session.ts` timeline, four escalating literature-verified knee medical-accuracy passes (all recurring facts recorded in `knee-content-medical-facts.md`), pilot UX (home/cases above the fold, spoiler-safe case search, daily review cap, case commit-gate), and a set of whole-app correctness fixes (offline `settleWrite`, stable research-export IDs, service-worker image revalidation, normalized analytics denominators). All four interactive normal MRI workstations have passed complete desktop/mobile plane-and-mode sweeps; the course journey, issue-report workflow, PWA recovery, structural marker/slice/answer-key integrity, and performance budgets are under automated coverage. The 2026-07-21 verified baseline is 450 unit/component tests passing, clean lint/type-check/build, a 210.9 KiB initial-gzip performance budget, and zero automated medical-QA diagnostics; Playwright, `test:normal`, and `npm audit` were not re-run in this content-only pass and carry forward from July 19. The next highest-value work is real-device authentication, authenticated admin/pilot validation, and faculty source-and-marker sign-off. Native iOS submission remains intentionally paused.
