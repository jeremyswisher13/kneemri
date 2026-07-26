# Handoff to Claude Ultra Code - UCLA Sports MRI App

Last updated: July 26, 2026 (rebrand to Sports MRI Academy; NonCommercial images eliminated; iOS reopened)

Repository: `/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app`

Branch: `main`

Current product HEAD: see `git log` — this line has gone stale twice, so treat git as authoritative rather than trusting a sha written here. The July 19 handoff HEAD was `be2f5ea`; retain the detailed historical sections below, but use `git log` as the source of truth for all work after that handoff.

**Direction, as of the end of 2026-07-26 — this SUPERSEDES the commercialization plan further down.** Selling institutional licenses was considered and then **abandoned the same day**, once the blockers were priced out. The app **stays free**. The product was still renamed to **Sports MRI Academy** (the domain had already moved), and the current goal is a **free iOS App Store app** — pursued for credibility rather than capability: an App Store listing is citable and lands differently with a program director than "add this URL to your home screen." The PWA already covers the functional need.

Consequences for anyone picking this up:

- The section "Commercialization: what blocks taking money" below is retained for its analysis of the *selling* path, which is still accurate if that is ever revisited. It is NOT the current plan, and its headline claim is now out of date: **there are zero NonCommercial images left** (see "NonCommercial image migration" below).
- Multi-tenancy is NOT being built. Admin remains a single global email allowlist. That is fine for one institution and is only a blocker for a second paying customer, which is no longer the goal.
- The UCLA IP-ownership question is still unresolved and still worth answering, but it is no longer urgent, because nothing is being sold.

Production:

- Primary custom domain: `https://sportsmriacademy.com`
- `www` redirect: `https://www.sportsmriacademy.com` -> `https://sportsmriacademy.com`
- Legacy custom domain (keep connected): `https://jeremyswisherkneemri.com`
- Firebase Hosting: `https://ucla-knee-mri.web.app`
- Firebase project: `ucla-knee-mri`
- On 2026-07-26, the new apex and `www` domains were attached to Firebase Hosting, exact Namecheap DNS records were installed, both domains were added to Firebase Authentication's authorized-domain list, and the canonical/share URLs were deployed. Firebase's `ucla-knee-mri.firebaseapp.com` remains the SDK `authDomain` and native callback host; do not change it casually because that separation preserves the proven Google/Apple redirect flow.
- Production at the end of 2026-07-26 serves bundle `index-Dnn6hQUY.js` on all three hosts. Verified then: 71 test files / 535 tests passing plus 2 EXPECTED failures (see below), lint clean, production build clean, `qa:medical` 0 diagnostics, and the live release gate green against `https://sportsmriacademy.com` after its two stale pre-rebrand assertions were fixed.
- **"2 expected fail" is correct, not breakage.** They are `it.fails()` guards in `src/content/medical-language-regression.test.ts` staking out two medical strings in `src/components/ui/VisualAtlas.tsx` that Dr. Swisher is authoring himself (a ">5mm severe" meniscal-extrusion tier and "functional meniscectomy equivalent", both contradicted by `modules/module6-menisci.ts`). When he fixes the wording they stop throwing and vitest reports "Expect test to fail" — at that point delete the `.fails` and each becomes a permanent guard. Do NOT "fix" them by weakening the assertion.

The web/PWA is the active shipping surface. **Native iOS is no longer blocked on content licensing and is the current goal** — the two documented reasons it was paused (UCLA trademark under a personal developer account; NonCommercial bundled images) are both now resolved. What remains is the App Store Connect checklist, 0/10 at last audit. Read the iOS section before touching `ios/`.

## July 26 Domain Migration

- `sportsmriacademy.com` is the canonical public origin in `index.html`, Open Graph/Twitter image metadata, the teaching-session invite, and the faculty run-sheet.
- Namecheap DNS intentionally retains the email-forwarding SPF TXT record alongside Firebase's ownership TXT record. Do not remove the SPF record merely because two apex TXT records are present.
- The Firebase Hosting records are apex `A 199.36.158.100`, apex `TXT hosting-site=ucla-knee-mri`, and `www CNAME ucla-knee-mri.web.app`.
- `www.sportsmriacademy.com` is configured in Firebase as a redirect to the apex domain. Do not replace it with a Namecheap URL redirect; Firebase owns HTTPS and the redirect certificate.
- **Certificate issuance COMPLETED and verified live on 2026-07-26.** The apex serves HTTPS 200 with a valid certificate, `www` 301-redirects to the apex, and `sportsmriacademy.com`, `jeremyswisherkneemri.com`, and `ucla-knee-mri.web.app` all serve the same bundle. Verified on the new origin: the app shell renders with zero console errors, `canonical`/`og:url`/`og:image` all point at the new domain, `og-image.jpg` (200, image/jpeg), `manifest.webmanifest` (200), `sw.js` (200), and `/__/auth/handler` (200). The legacy domain also advertises the new canonical, so bookmarks and installed home-screen apps keep working while indexing consolidates.
- The live release gate HAS now been run against the new origin and passes. It was red on BOTH origins for a while after the rebrand because two assertions still expected "UCLA Sports MRI" in the manifest and favicon; those were updated in `scripts/ios-live-readiness.mjs`. Re-run with `LIVE_APP_BASE_URL=https://sportsmriacademy.com npm run preflight:ios:live`.
- Still outstanding: Google sign-in has NOT been exercised by hand from the new origin in mobile Safari or an installed PWA. The popup hops to `ucla-knee-mri.firebaseapp.com`, which is exactly the class of hop that caused the earlier iOS Safari bounce, so this deserves a real-device check before the App Store push.
- The `rel=canonical` tag was REMOVED rather than made per-route, so every URL is now self-canonical, which is the correct claim. A runtime per-route canonical would have been inert: `FellowLayout` sits inside `ProtectedRoute`, so a signed-out crawler is redirected to `/login` before the effect runs, and it could not have reached `/login`, `/privacy`, `/support` or `/accessibility` — the only genuinely public pages and the ones actually harmed. The reasoning ships as comments in `index.html` and `FellowLayout.tsx`; do not "fix" it back. Side note not acted on: `/robots.txt` returns the SPA HTML shell because there is no `public/robots.txt`.
- Keep `jeremyswisherkneemri.com` attached to the same Hosting site so existing bookmarks and installed home-screen apps continue working. New installs and shared links should use the Sports MRI Academy domain.
- Keep `src/lib/firebase.ts` on `authDomain: "ucla-knee-mri.firebaseapp.com"`. The new domains are authorized origins, not replacement callback hosts.

## NonCommercial image migration — DONE (zero remain)

All 33 NonCommercial-licensed teaching images are gone. Final census of attribution strings in
`src/content/**`: **141 CC BY, 1 CC BY-SA, 0 NC**. This removed the second of the two documented
reasons iOS submission was paused.

- **24 replaced** with verified CC BY figures from 14 open-access sources (Parkar/JBSR,
  Celikyay/JBSR, ESSR/Eur Radiol, IDKD Bookshelf, Moon/Medicina, Von Rehlingen-Prinz/Sports Med
  Open, Willinger/KSSTA, Uchida/KSSTA, Perez Yubran/Insights Imaging, Yeap/JBSR, van Trigt/JSES
  Int, Albano/Insights Imaging, Dai/Bioengineering, Adwan/Cureus). Four were already cited in the
  repo, so they needed no new licence review.
- **9 deleted** — 8 with no acceptable CC BY equivalent after a filtered search of Europe PMC,
  Cureus, MDPI, BMC, NCBI Bookshelf and Wikimedia, plus 1 redundant duplicate. Deleting was the
  explicit instruction: unblocking iOS beat retaining an image. Content entries were removed
  alongside the files and the surrounding teaching text left intact.

**Process rules that were learned the hard way — follow them if you source more images:**

1. **Read the licence on the article page**, not from PMC metadata. This repo has already hit a
   case where the two disagreed.
2. **Download and LOOK at every candidate.** Two candidates were correctly CC BY and had matching
   legends but were a photograph of a film and a cramped research panel; both would have
   downgraded a clear teaching image. Neither was detectable from text.
3. **Never carry a caption across a swap.** Roughly a dozen captions had to be rewritten because
   they described the old picture. Several were substantively wrong once the image changed — one
   asserted "measured here, 15.4 mm" over a figure measuring 7.2 mm; two promised "LFC +
   posterolateral tibial plateau" over a figure showing only the tibial half.
4. **Radiopaedia is CC BY-NC-SA and cannot be copied.** The repo correctly links to it and never
   copies it. The one remaining `BY-NC` string in the tree is `VisualAtlas.tsx` disclosing that
   its outbound links point there — linking is not copying, leave it.

**What was lost, and the cheapest way to restore it.** The 8 deletions were: the ACL coronal
empty-notch sign, PCL intrasubstance injury, a fourth ACL tear-appearance variant, the clip /
dashboard / hyperextension contusion patterns, and the adult radiocapitellar ultrasound. Five of
those are knee mechanism-pattern or single-sign images — exactly the category where a labelled
diagram works as well as a photograph, and this repo already ships 18 hand-authored SVGs under
`public/images/modules/` that are owned outright. Dr. Swisher supplying his own de-identified
cases is the other clean answer. Do not re-add an NC image to fill these.

**Still owed before anyone claims the app ships no NC content:** this migration covered the 33
images an audit identified. A repo-wide sweep of all 128 referenced images has NOT been done. The
census above reads attribution strings, so an image with no attribution at all would not appear
in it.

## Changes since the last handoff update (`d8c8fad`..`HEAD`)

Eighteen commits. Grouped by theme; commit bodies carry the detail.

**Rebrand to Sports MRI Academy** (`17c0dfe`, `ac91bfb`, `db0998c`). Colour tokens renamed
`ucla-*` -> `brand-*` across 559 call sites with byte-identical hex values, so it is a pure rename
with no visual change. Deliberately NOT renamed because they are not colour tokens and would break
things: the `ucla-knee-mri` Firebase project id, the `ucla-pwa-*` / `ucla-sports-mri-*` cache and
storage keys, and the `UCLASportsMRIiOS` user-agent token. Brand mark supplied by Jeremy, vendored
to `brand/` and derived into `public/` by `scripts/gen-brand-icons.py`; the og-image is likewise
generated by `scripts/gen-og-image.py` rather than hand-exported, because the previous hand-made
card silently carried UCLA branding, the LEGACY domain, and a stale two-course list in baked
pixels that no grep or test could catch. UCLA remains only as footer affiliation, image
provenance, a support-contact route, and the iOS UA token.

**Locate scoring — wrong-structure clicks were being scored CORRECT** (`06597f1`). Point items
used a flat radius-8 accept zone, so any two answer anchors on the same series+slice closer than
8 apart accepted each other. 26 such pairs measured across the four courses, worst 2.2 apart.
Tolerance is now derived per item from the nearest neighbouring anchor and memoised per plane,
computed from existing reviewed coordinates — no coordinate moved, so the standing rule against
AI-placed markers is untouched, and a future anchor edit re-derives automatically. The reveal
reads the same number, so the gold ring cannot claim an area different from what the scorer
accepts. A permanent regression test recomputes the scan and asserts no overlap; verified
non-vacuous (forcing the old flat tolerance fails it with 126 overlapping pairs). **14 items sit
below a 3% usability floor and were deliberately left alone — they need item redesign or faculty
repositioning, listed in `LOCATE_REGION_PROPOSAL.md`.**

**Course depth and the elbow deck** (`65053c8`, `a91726d`). Hip plane-quiz items 22 -> 38 and
advanced 12 -> 22; elbow 15 -> 35 and 10 -> 20; a 38-card elbow flashcard deck added where the
course previously had none. All new items hang on existing faculty-reviewed markers. Literature
verification of the authored content found 25 problems including 8 outright reversals; one flag
was OVERTURNED on second opinion because it misread its own source. A follow-up audit then found
three of those corrections had been applied only in the file each was spotted in and left wrong
elsewhere — apply corrections **by claim across the repo**, never by the file the claim was
noticed in.

**Security and infrastructure** (`afb8d02`, `cd984cd`, `7ce8d31`). Tracked-fellow roster moved out
of the public bundle and then out of learner-readable `settings/` into admin-only
`adminSettings/` — REQUIRES `firebase deploy --only firestore:rules`, which has been done. Service
worker no longer hands `offline.html` to script/style requests (MIME refusal instead of the
offline page). Router-level `errorElement` had swallowed the only `console.error`, so chunk-load
crashes lost their diagnostics — restored. Case spoiler leak closed: image-less cases printed the
`expectedFindings` answer key on the opening screen before commit.

**NonCommercial image migration** — see its own section above.

## Commercialization: what blocks taking money (HISTORICAL — not the current plan)

**Superseded. Selling was abandoned on 2026-07-26; see the direction note at the top.** This
section is kept because its analysis of the selling path remains accurate if that is revisited.
Note that blocker 1 below is now resolved — there are zero NonCommercial images.

Direction set 2026-07-26: sell institutional licenses as **Sports MRI Academy**, drop UCLA
identity. The domain migration already landed the name. Two findings are load-bearing and were
verified directly in the repo — do not start rebranding work without accounting for them.

**1. 33 shipped teaching images carry NonCommercial licenses.** `CC BY-NC`, `CC BY-NC-SA`, and
at least one `-ND` variant appear in `src/content/**` attribution strings. NonCommercial terms
forbid use in a product sold for money; `-SA` (share-alike) additionally propagates obligations
to the derived work, and `-ND` forbids the cropping and annotating that a teaching image
inherently requires. Concentration by area: `cases/acl-pivot-shift/` 11 (the flagship case),
`modules/module7-ligaments/` 4, `modules/module4-bones/` 4 (all four contusion patterns),
`shoulder/modules/` 3, and the 5 ultrasound correlates under `images/teaching/us/`. Roughly 100
further attributions are plain `CC BY`, which **is** fine commercially with attribution — so the
sourcing habit is already mostly right and the fix is targeted replacement, not a rebuild. This
is a licensing question for an IP attorney, not something to resolve by reading the deed text.

**2. There is no concept of an organization.** Admin is a global hardcoded email allowlist (see
"Administrator Access"), so the moment a second institution exists, each customer's admin can
read every other customer's learners. Org entity, org-scoped roles, seat/license enforcement,
per-org reporting, and data isolation in `firestore.rules` all have to exist before two paying
customers can coexist. The analytics, psychometrics, research-export, tracked-fellows panel, and
the `weeklyDigest` function are all written around a single global cohort and will need scoping.

**Upstream of everything, and unresolved: IP ownership.** The work was created while Jeremy is
UCLA faculty and the course carries UCLA branding, certificates, and copyright language. Whether
it is fully his to sell is a question for UCLA's technology-transfer / OTL office and his own
counsel. Removing UCLA branding lowers trademark exposure — it does **not** settle ownership.
Resolve this before investing in billing, contracts, or a sales motion.

Sequencing traps, learned the hard way elsewhere in this document:

- Do **not** rename the `uclaSportsMri.*` localStorage key prefix without a migration path —
  those keys are persisted on real devices and silently dropping them discards learner state.
- Do **not** rename the Firebase project (`ucla-knee-mri`) or `authDomain`. The authDomain is the
  registered Apple Service ID return URL and the only host allowlisted in the native shell;
  renaming breaks Google/Apple sign-in. The project id is not user-visible — leave it alone.
- Do **not** alter certificate wording for already-issued certificates without a plan; three
  fellows hold certificates naming the current institution.
- Do **not** imply CME credit or accreditation you do not hold. Selling a "certificate" makes
  that claim materially riskier than giving one away.

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

- `main` is synchronized with `origin/main` (pushed through `921a298`).
- Full suite: 71 test files, 535 tests passing + 2 expected fail (verified end of 2026-07-26). See the note above on the 2 expected failures before assuming the suite is red.
- `npm run lint`, `npm run test:types`, `npm run build`: clean (2026-07-26).
- Performance gate: 228.2 KiB initial gzip across 11 assets (largest `react-vendor` 57.6 KiB); 14 MRI stacks checked; largest stack 2,518.6 KiB and largest slice 91.1 KiB.
- Live release gate: 112 checks passing across app routes, every discovered JS chunk, manifest/icons, account routes, login, and both Firebase Auth handlers (verified 2026-07-26).
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

**SUPERSEDED on 2026-07-24 — see "Wheel behavior: current contract" immediately below.** The
July 19 rule ("ordinary vertical wheel/trackpad gestures scroll the page, even directly over the
MRI image; do not restore unconditional vertical-wheel slice capture") no longer describes what
ships. It is preserved here only so the history of the original production bug is legible.

The behavior remains isolated in:

- `src/components/ui/MriStackViewer.tsx`
- `src/components/ui/mri-stack-wheel.ts`
- `src/components/ui/mri-stack-wheel.test.ts`
- `src/components/ui/MriStackViewer.test.tsx`

Two shoulder case captions were updated so their instructions match the controls.

### Wheel behavior: current contract (supersedes `128a78f`)

`2fc634e` deliberately made the mouse wheel scrub slices, and Jeremy confirmed on 2026-07-26 that
this is **intentional** — scrubbing a stack with the wheel is the natural radiology-workstation
gesture and is how the app is taught. The required behavior today is:

- **Any wheel/trackpad gesture over the viewer scrubs slices** (vertical or horizontal) and
  consumes the event.
- When the stack is **exhausted in the direction of travel**, the wheel stops being consumed and
  is handed back to the page, so the user can keep scrolling past the viewer without a dead zone.
  This handoff is the reason the original scroll-lock bug does not recur.
- Ctrl+wheel is never consumed — browser pinch-zoom must keep working.
- Sub-pixel jitter (|delta| < 1 in pixel mode) does not step a slice.
- Drag, arrow keys, slider, previous/next controls, and cine playback still work; manual stepping
  pauses cine.

Trade-off accepted knowingly: on a long page, a user scrolling through the middle of a stack must
traverse the remaining slices (19–44) before the page scrolls again. If that ever becomes a
complaint, the intended fix is to gate capture on the viewer having focus, **not** to silently
revert to the July 19 rule.

Guarding this: `mri-stack-wheel.test.ts` pins the step function and `MriStackViewer.test.tsx`
pins the mid-stack capture plus the end-of-stack handoff. Do not delete a wheel test to make a
behavior change pass — `2fc634e` inverted the old guard assertion rather than replacing it, which
is how this contract silently diverged from the documentation for two days.

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

## Administrator Access (who has it, and why)

**The tracked-fellow roster is NOT in the bundle and NOT in `settings/`.** It lives in
`adminSettings/cohort.trackedFellows`, readable only by admins. It was previously hard-coded in
`src/lib/tracked-fellows.ts`, which shipped three real trainees' names in the public JS bundle;
moving it to `settings/cohort` was not enough, because `match /settings/{doc}` grants read to any
signed-in user and every learner's app fetches that document on the progress path. Firestore ORs
`allow` rules across matching paths, so a narrower `match /settings/roster` could not have taken
that access back — hence a separate collection. `src/lib/tracked-fellows.test.ts` guards this and
deliberately names nobody, matching the SHAPE of a personal-name literal instead. Note the names
remain in git history, and this is a public repo.

Admin is granted by a hardcoded email allowlist that must stay identical in two places —
`src/lib/auth.ts` (`ADMIN_EMAILS`, controls what the client renders) and `firestore.rules`
(`isAdminEmail()`, controls what the server actually permits). `src/lib/admin-emails.test.ts`
asserts the two lists are equal; that test proves **file-to-file parity only**, never that the
live ruleset matches the repo.

Current standing administrators:

- `jswisher@mednet.ucla.edu` — course director.
- `kimberlymburbank@gmail.com` — **Dr. Kimberly Burbank, standing co-faculty. Intentional and
  ratified by Jeremy on 2026-07-26.** Granted in `d14b367` for the 2026-07-24 live session and
  deliberately retained afterward. This is NOT a leftover; do not "clean it up." If it is ever
  revoked, remove it from `auth.ts` AND `firestore.rules`, delete the assertion in
  `admin-emails.test.ts`, and redeploy rules.

Two things to know before touching this:

1. **Admin is global, not scoped.** An admin reads every learner document and subcollection,
   can write any learner's `quizAttempts`/`progress`, and can read/delete `issueReports` and
   `accountDeletionRequests`. There is no per-course or per-cohort admin. Any move toward
   selling institutional licenses has to replace this allowlist with org-scoped roles before a
   second institution exists — otherwise every customer's admin sees every other customer's
   learners.
2. **Editing `firestore.rules` changes nothing until it is deployed.** Hosting deploys do not
   ship rules. After any allowlist change: `firebase deploy --only firestore:rules`. As of
   2026-07-26 there is no artifact in the repo recording a rules deploy after `d14b367`, so if
   Dr. Burbank's admin actions failed with permission-denied on 7/24, an undeployed ruleset is
   the first thing to check.

## Critical Behavior Contracts

- Pre-assessment remains a clean baseline: no answer-key feedback and no spaced-review seeding.
- Workstation review IDs and entries remain course-scoped.
- Every normal MRI course requires passing each plane knowledge check at 70% for normal-MRI completion.
- Knee cases remain optional for certificate completion; non-knee course requirements follow existing course definitions.
- `MriStackViewer` captures the wheel to scrub slices (intentional as of 2026-07-24 — see "Wheel behavior: current contract") and MUST hand the wheel back to the page once the stack is exhausted in the direction of travel, so the viewer never becomes a permanent scroll trap.
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

## iOS App Store Submission — REOPENED, both content blockers cleared

Submission was paused on two documented risks. **Both are now resolved**, and a free iOS app is
the current goal (see the direction note at the top).

1. ~~Bundled teaching images under CC BY-NC / BY-NC-SA.~~ **RESOLVED** — zero NonCommercial
   images remain; see "NonCommercial image migration" above.
2. ~~UCLA branding in the app shipped from a personal developer account.~~ **RESOLVED** — the
   product is Sports MRI Academy throughout, and the bundle identifier was renamed before it
   locks (below). UCLA now appears only as a footer affiliation line, image provenance, and a
   support-contact route. The IP-ownership question with UCLA is still open but is not a
   submission blocker for a free app.
3. App Store distribution signing/provisioning and App Store Connect evidence remain incomplete.
   **This is what is left.**

### The bundle identifier was renamed, and it is now effectively frozen

Apple does not allow `PRODUCT_BUNDLE_IDENTIFIER` to change after first submission, so it was
renamed while that was still free:

- Bundle ID: `com.jeremyswisher.sportsmriacademy` *(was `com.jeremyswisher.uclasportsmri`)*
- Team ID: `X578T4K65B`
- Xcode project: `ios/SportsMRIAcademy.xcodeproj`
- Scheme / target: `SportsMRIAcademy`
- Display name: `Sports MRI Academy`
- App Store SKU: `sports-mri-academy-ios`

**Do not rename it again.** It is verified working: `xcodebuild` succeeds and the compiled
product carries `CFBundleIdentifier com.jeremyswisher.sportsmriacademy`.

Three things that make this project easy to break:

- **The Xcode project is GENERATED by XcodeGen from `ios/project.yml`.** Edit the yml and run
  `cd ios && xcodegen generate`, then commit the regenerated `.xcodeproj`. Do not hand-edit
  `project.pbxproj`.
- **The JS and native sides share a contract.** The shell announces itself via
  `applicationNameForUserAgent` in `ios/SportsMRIAcademy/WebShellView.swift`, and
  `src/lib/pwa.ts` matches it to hide browser install prompts inside the app. Both say
  `SportsMRIAcademyiOS`. The matcher deliberately still accepts the legacy `UCLASportsMRIiOS`
  token because a dev build carrying it may be installed on a device; drop that once none
  survive. Both tokens are covered by tests.
- **The Apple Service ID was renamed too** and is NOT yet registered with Apple
  (`signInWithAppleEnabledForBundleId: false`). Register `com.jeremyswisher.sportsmriacademy.web`,
  not the old one.

The July 19 evidence audit reported 1/7 groups ready: screenshots 3/3; archive signing,
Apple/Firebase auth (0/6), real-device/account deletion (0/5), App Store Connect (0/10), hard
submission, and release evidence (0/3) remain TODO. Every evidence boolean in `ios/*.json` is
still `false` — those files describe the app we intend to create, they do not attest to
verification that happened.

Two things worth doing before the submission push: exercise Google sign-in by hand from
`sportsmriacademy.com` on a real device (mobile Safari and installed PWA), and be aware that
medical-education apps draw real App Review scrutiny — ship after the content has settled, not
during a week of active medical correction.

Never commit Apple private keys, `.p8` files, API keys, issuer IDs, app-specific passwords, Firebase service-account paths, real learner emails/UIDs, or PHI. Do not mark an external evidence gate complete unless it was actually verified.

## Scope and Collaboration Rules

- Stay inside `knee-mri-app` unless Jeremy explicitly redirects the work.
- Claude and Codex share this repository across sessions. Always reconcile `git status` and `git log` first.
- Work with existing changes; do not reset or revert edits you did not create.
- Prefer current project patterns over new frameworks or broad refactors.
- Keep user-facing web/PWA quality ahead of dormant certificate or iOS work unless Jeremy explicitly changes the priority.

## One-Paragraph Executive Summary

The web/PWA is live and free at `https://sportsmriacademy.com`, rebranded from UCLA to **Sports
MRI Academy**, and the current goal is a **free iOS App Store app** — selling institutional
licenses was considered and abandoned on 2026-07-26. Both documented iOS blockers are now cleared:
every NonCommercial teaching image is gone (24 replaced with verified CC BY figures, 9 deleted;
final census 141 CC BY / 1 CC BY-SA / 0 NC), and the UCLA trademark is out of the app identity,
including a bundle-ID rename to `com.jeremyswisher.sportsmriacademy` done before Apple freezes it
and verified by an actual `xcodebuild`. What remains for submission is the App Store Connect
checklist (0/10) and a real-device sign-in check from the new origin. Also landed since the last
handoff: a locate-scoring fix that stopped 26 pairs of answer anchors accepting each other so
clicking the WRONG structure scored correct; hip and elbow workstation depth roughly doubled and
a 38-card elbow flashcard deck added, both literature-verified with 25 medical corrections applied
and one over-correction overturned; three elbow medical claims propagated to every remaining site
after an audit found they had been fixed in one file and left wrong in others; and the
tracked-fellow roster moved out of the public bundle into an admin-only Firestore collection. The
verified baseline is 71 test files / 535 tests passing plus 2 EXPECTED `it.fails()` guards
awaiting Dr. Swisher's own medical wording in `VisualAtlas.tsx`, clean lint/build, `qa:medical` 0
diagnostics, a 228.6 KiB initial-gzip budget, and the live release gate green against the new
origin. The highest-value open items are the App Store Connect checklist, faculty placement of
`locateRegion` endpoints (see `LOCATE_REGION_PROPOSAL.md` — 14 items sit below a usability floor
and need item redesign, not a tolerance change), and a repo-wide licence sweep of all 128
referenced images, since this migration only covered the 33 an audit had identified.
