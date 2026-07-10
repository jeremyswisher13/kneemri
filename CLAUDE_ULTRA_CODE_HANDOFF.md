# Handoff to Claude Ultra Code - UCLA Sports MRI App

Last updated: July 10, 2026 (Codex session)

Repository: `/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app`

Branch: `main`

Current app HEAD before this handoff-only update: `128a78f Fix desktop scrolling over MRI viewers`

Production:

- Custom domain: `https://jeremyswisherkneemri.com`
- Firebase Hosting: `https://ucla-knee-mri.web.app`
- Firebase project: `ucla-knee-mri`

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

- `main` is synchronized with `origin/main`.
- Full suite: 48 test files, 398 tests passing.
- Normal MRI suite: 10 test files, 45 tests passing.
- `npm run lint`: clean.
- `npm run build`: clean.
- `npm audit --omit=dev`: zero vulnerabilities.
- `npm run qa:medical`: zero automated diagnostics.

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

## Work Completed by Codex After the Previous Handoff

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

Codex used the in-app browser with local preview authentication and real input events.

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

- Review items: 2,754
- High-risk items: 1,359
- Source-check items: 1,584
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

1. **Authenticated admin visual QA**
   - Log in with a real admin account.
   - Verify the Riley/Sonal/Lilian matching cards against the real Firestore profiles.
   - Check desktop and mobile wrapping, long emails/names, missing accounts, zero-progress accounts, inactivity, and Open row behavior.
   - Do not expose learner email/UID data in screenshots or commits.

2. **Faculty medical sign-off workflow**
   - Start with the ulnar-nerve marker and the highest-risk rows in `medical-qa/review-items.csv`.
   - Record reviewer, date, source notes, and decision rather than making unsourced bulk edits.
   - Regenerate with `npm run qa:medical` after source changes.

3. **Real-device authentication acceptance test**
   - Test Google and Apple sign-in on Safari, Chrome desktop, and the installed iOS PWA.
   - Confirm the exact `returnTo` page survives login and the session remains available after closing/reopening the PWA.
   - Do not change auth strategy solely from localhost behavior.

4. **PHI/provenance audit of teaching stacks**
   - Run an OCR and visual sweep of `public/images/teaching/stacks/`.
   - Create a durable provenance/PHI-review record for each stack.

5. **Trust and attribution cleanup**
   - Add complete source/license links for permissively licensed teaching images.
   - Consider a persistent authenticated educational-use disclaimer with Jeremy's approval.

6. **Admin analytics after the above**
   - Pace/time-to-completion.
   - Distractor-to-module remediation links.
   - Keep analytics actionable for three fellows rather than building a generic enterprise dashboard.

## Critical Behavior Contracts

- Pre-assessment remains a clean baseline: no answer-key feedback and no spaced-review seeding.
- Workstation review IDs and entries remain course-scoped.
- Every normal MRI course requires passing each plane knowledge check at 70% for normal-MRI completion.
- Knee cases remain optional for certificate completion; non-knee course requirements follow existing course definitions.
- `MriStackViewer` must not trap ordinary vertical desktop scrolling.
- Search and lightbox dialogs must restore body scrolling on close/unmount.
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

Last known native submission gate state remains 5/28 verified. The native project and evidence scripts are retained but dormant:

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

The web/PWA is live, clean, and materially more polished. All four interactive normal MRI workstations have passed exhaustive series/mode interaction sweeps; structural marker, slice, answer-key, and bank integrity is covered by regression tests; Cross-Plane free response is keyboard accessible; the named-fellow admin tracking panel is implemented; login and mobile mode navigation are improved; and the desktop MRI viewer no longer traps vertical scrolling. The current release is `128a78f`, with 398 tests passing and zero automated medical-QA diagnostics. The next highest-value work is a real-admin visual/data pass, faculty source-and-marker sign-off, and real-device authentication acceptance testing. Native iOS submission remains intentionally paused.
