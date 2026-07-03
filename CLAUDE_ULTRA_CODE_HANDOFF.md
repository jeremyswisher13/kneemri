# Handoff to Codex — UCLA Sports MRI App

Last updated: July 2, 2026 (Claude session)
Repo path: `/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app`
Branch: `main`
HEAD this handoff is based on: `da85bec Nudge two off-structure workstation markers onto their targets`

Verified before handoff: `git status` clean, 386/386 tests passing, `npm run build` clean, `npm run lint` clean, Firebase Hosting deployed and confirmed live (bundle hash on `https://ucla-knee-mri.web.app` matches this build's `dist/`).

---

## ⚠️ iOS App Store submission is PAUSED — read this before touching `ios/`

Jeremy decided to **stay web-app-only for now** rather than continue the App Store push. This was an informed decision after a licensing/legal risk review (informational, not legal advice) surfaced three real blockers to submitting under his personal Apple account:

1. **NonCommercial teaching images** — ~46 uses (~33 unique files) of Radiopaedia/journal images licensed CC BY-NC / BY-NC-SA are bundled in the app. NC + App Store distribution is a plausible license violation; "free app" is not a defense under CC's NC test. One source (`PMC11463185`) accounts for 19 of the 46 uses.
2. **"UCLA" branding under a personal Apple developer account with no evidence of authorization** — the app is UCLA end-to-end (name, "© UCLA Health" footer on every authenticated screen at `src/components/layout/AppLayout.tsx:27`, and completion certificates headed "UNIVERSITY OF CALIFORNIA, LOS ANGELES" with a seal, generated both client-side `CertificatePage.tsx` and server-side `functions/index.js`) while the Apple account/bundle ID/copyright are personal (`com.jeremyswisher.uclasportsmri`, Team `X578T4K65B`). This is the one that exposes Jeremy personally and needs UCLA Trademarks & Licensing + department sign-off, or a UCLA-owned Apple org account — not something to resolve in code.
3. Plus a real signing/export blocker (no App Store distribution profile) — purely operational, not a legal issue.

**Do not resume `ios/` submission work (archive, export, App Store Connect evidence gates) without Jeremy explicitly re-opening it.** The web app is the shipping surface now: it already installs to the home screen as a PWA, has working offline support (better than the native shell, which was actively deleting its own service-worker cache), and keeps all the branding/certificates/images as-is with much lower legal exposure as an unpublished, closed-cohort teaching site.

The `ios/` project, its evidence-gate tooling (`npm run evidence:ios`, `preflight:ios:*`, `archive:ios:*`, `asc:ios:*`), and the older App Store technical setup notes are left in the repo untouched and still accurate if this resumes later — see "iOS reference material (dormant)" at the bottom of this doc. **I did not touch `ios/` this session** — the gate file is unchanged since Codex's `a60bdb6 Sync live hosting evidence for App Store`.

If Jeremy asks about App Store status: the honest state is unchanged from Codex's last update (`5/28` submission gates verified) — nothing regressed, it's just not being actively pursued.

---

## What changed since Codex's last session (chronological)

All committed to `main`, all deployed, all covered by the current 386-test suite.

1. **`094a7a0`, `8d7790b` — Redesigned the PWA/App Store icon** (UCLA-blue reticle mark) across all sizes (web PWA, iOS AppIcon set, SVGs), fixed a brittle iOS evidence test.
2. **`8f45cda` — Fixed 3 real bugs from a post-Codex audit**: service-worker `staleWhileRevalidate` offline-fallback bug (an un-awaited promise skipped the offline page on network failure), a login double-navigation race, and CasePage image-load failures leaving empty boxes instead of a placeholder.
3. **`1280d1f`, `a524556` — Fixed iOS Safari + standalone-PWA login** (this was reported by a real user, "Riley," and then hit Jeremy himself on his home-screen app). `signInWithRedirect` on iOS breaks out to Safari — a separate storage context — and drops the session. Fixed by routing mobile Safari **and** installed PWAs through `signInWithPopup` instead; redirect is now reserved for the native iOS shell and localhost only. See `src/lib/login-return.ts:shouldUseRedirectSignIn`.
4. **`48d975d` — Simplified the mobile workstation UI.** The normal-MRI workstation stacked ~1.3 screens of nav chrome (a 7-mode button wall + a 5-step guidance panel) above the actual content on phones. `NormalModeSwitcher` is now a horizontally-scrolling single row on mobile; `NormalMriMasteryPanel`'s guidance collapses behind a "Learning steps" toggle on mobile. Affects all 4 course workstations (shared components).
5. **`6686b00` — Quick-wins batch**: pre-quiz no longer leaks the answer key (pre/post are matched parallel forms — revealing answers on the baseline was inflating the measured learning gain; now shows a per-domain breakdown only); `QuizQuestion` is now a real WAI-ARIA radio group (roving tabindex + arrow keys); modules now show a "Step N of the systematic search pattern" chip linking to `SearchPatternPage`, which now honors `?step=N`.
6. **`a524556` — Pre-quiz also stopped seeding the spaced-review queue** (per Jeremy's explicit choice), so it's now a genuinely clean baseline with zero answer feedback.
7. **`9054789` — Accessibility sprint**: `GlobalSearch` is now a proper `role="dialog"` with a focus trap and focus restore; both confidence-survey Likert components (`LikertScale`, `RetroLikertScale`) are now real radio groups instead of `aria-pressed` toggles.
8. **`ab86a9c`, `da85bec` — Normal-MRI workstation accuracy audit** (see full section below).

Also produced but **not yet acted on** — see "Open items for Jeremy" below.

---

## Normal-MRI workstation marker audit (completed this session)

Jeremy asked for an extreme-detail pass on every marker placement across all 4 courses' interactive normal-MRI workstations (knee/shoulder/hip/elbow — 14 planes, ~327 markers total: `src/content/normal-{knee,shoulder,hip,elbow}-learn.ts`).

**Result: 5/14 planes fully clean, zero laterality (wrong-side) bugs anywhere.** Fixed and deployed:
- Shoulder Axial PD-FS humeral-head note said "bright marrow" on a fat-suppressed sequence (fat is suppressed → should read dark; a bright focus is edema). Fixed in the tour note and the `axi-q1` quiz explanation.
- Knee posterior-horn meniscus marker (Sagittal PD-FS **and** Sagittal T1, 5 linked occurrences incl. the cross-plane drill) was ~5% too posterior, in the capsule behind the meniscal triangle. Nudged `x: 66.6 → 61` (do not confuse with the separate lateral-femoral-condyle marker at `66.6, 44.9`, which is correct and untouched).
- Hip acetabular labrum marker (Sagittal PD-FS, 3 occurrences) was in the acetabular roof bone above the cartilage arc. Moved `(44,46) → (46,54)` onto the rim.

**Important methodology finding, worth knowing before doing more of this work:** I ran a 3-independent-AI-read precision pass to try to nail exact pixel coordinates on the remaining flagged markers. The reads diverged badly — e.g. 62% spread on the ulnar-nerve x-coordinate, 10-17% spread on joint-line vertical position, and the consensus would have moved an *already-correct* meniscus marker into bone. **AI vision cannot reliably pixel-place these markers to teaching-grade precision** — only apply a coordinate change when multiple signals tightly agree AND a human/radiologist visually confirms it. The admin **Adjust mode** (`MarkerAdjuster.tsx`, the "Adjust (admin)" tab on each workstation, admin-only) is the right tool for the rest.

**Open punch-list for Adjust mode** (direction is reasonably agreed, exact pixel needs a human eye on the rendered slice):
- ⚠️ Elbow Axial — **ulnar nerve** marker (`x:20,y:61`): genuinely ambiguous, the bright candidate structure nearby reads as vascular (a vein), not nerve. Needs tracking across the original series, not a single-slice guess.
- Elbow Sagittal IR — coronoid process (`x:45,y:60`): likely sits anterior to the bony beak, nudge toward ~`(49,55)`.
- Shoulder Coronal T2-FS — superior glenoid labrum (`x:53,y:57`): likely needs to rise toward the superior rim.
- Shoulder Axial PD-FS — biceps groove (`x:44,y:40`): may be above the formed groove; consider a lower slice or reword the note.
- Shoulder Axial PD-FS — coracoid process (`x:48,y:30`): minor nudge onto cortex.
- Hip Coronal T2-FS — SI joint (`x:40,y:45`): minor nudge onto the joint cleft.
- Minor/low-priority: hip coronal femoral-neck / sourcil / cartilage markers, small lateral nudges only.

Confirmed fine as-is (do not change without new evidence): hip axial labrum/iliopsoas/sciatic nerve, hip sagittal abductor marker (only the tour note's "tendon footprint" wording vs. "muscle belly" is a judgment call, not an error).

---

## Open items for Jeremy (informational — not yet actioned, no urgency)

These came out of a broader improvement audit and a licensing review this session. None are blocking; listed here so Codex has context if Jeremy brings any of them up.

- **PHI pixel-sweep of the teaching MRI slices** (recommended, not yet done): ~400+ "de-identified" PACS-screen-capture JPGs (`public/images/teaching/stacks/`) have no documented provenance/PHI QA record. A spot-check was clean but most slices are uninspected. Worth an OCR sweep + a one-page provenance record, independent of any App Store question — this app is public today.
- **Persistent in-app "educational, not for diagnosis" disclaimer**: currently only on the pre-auth `LoginPage`, not in the authenticated app chrome (`FellowLayout`/`AppLayout`). Cheap to add, good liability hygiene for a medical teaching app.
- **CC-BY image attribution completeness**: ~102 permissively-licensed images don't carry a source-URL/license-deed link in the UI (`MriStackViewer` already supports a `sourceUrl` field on ~4 images — just needs populating). CC BY 4.0 technically requires it.
- **Remaining accessibility/faculty-analytics quick-wins** (not started): pace/time-to-completion analytics and distractor→module links for the admin dashboard (data already fetched, just not surfaced) — these were on Jeremy's original roadmap pick but got deprioritized when he pivoted to the App Store question, then the marker audit.
- A larger prioritized product roadmap (pedagogy, content parity, workstation depth, admin analytics, a11y, engagement, trust) exists in this session's history if useful context — ask Jeremy or re-derive from the codebase; not persisted to a file to avoid rot.

---

## Constraint (standing, from Jeremy)

Stay scoped to this repo (`knee-mri-app`) only. Do not write to `~/.codex/`, sibling projects, or global git config. Both of us (Claude Code and Codex) work in this same repo across sessions — always start with `git status`/`git log` to reconcile before assuming the state you last left it in.

---

## iOS reference material (dormant — do not act on unless Jeremy re-opens this)

Everything below was accurate as of Codex's last iOS session and I did not change it. Kept for reference only.

### Locked identifiers
- Native bundle ID: `com.jeremyswisher.uclasportsmri`
- Apple Team ID: `X578T4K65B`
- Apple Services ID: `com.jeremyswisher.uclasportsmri.web`
- Primary return URL: `https://ucla-knee-mri.firebaseapp.com/__/auth/handler`
- Secondary auth handler: `https://ucla-knee-mri.web.app/__/auth/handler`
- Firebase project: `ucla-knee-mri`
- Firebase authorized domains: `ucla-knee-mri.firebaseapp.com`, `ucla-knee-mri.web.app`
- Xcode project: `ios/UCLASportsMRI.xcodeproj`, scheme `UCLASportsMRI`, version/build `1.0 (1)`, deployment target iOS 16.0

### Last known gate status
- `npm run evidence:ios`: 1/7 audited groups ready.
- `npm run preflight:ios:report`: 5/28 submission gates verified, 23/28 missing.
- `npm run preflight:ios`: passes. `npm run preflight:ios:submit`: fails (expected — real external Apple/ASC steps incomplete).
- Screenshots complete and verified (no PHI, no browser chrome).
- Blocking on: App Store distribution provisioning profile + ASC account access (export/signing), Apple Sign-In App ID + Services ID + Firebase provider config, TestFlight/real-device verification, App Store Connect app-record creation.

### Safety rules if this resumes
- Never commit Apple private keys, `.p8` files, ASC API keys, issuer IDs, app-specific passwords, Firebase service-account paths, real learner emails/UIDs, or PHI.
- Do not set an evidence boolean true in `ios/AppStoreSubmissionGate.json` unless the matching real external step is verified.
- Do not claim submitted/approved/live until App Store Connect and the public listing prove it.
- **Before resuming any of this, first resolve the two real blockers above (image licensing, UCLA authorization) — do not re-attempt export/submission while those are open.**
