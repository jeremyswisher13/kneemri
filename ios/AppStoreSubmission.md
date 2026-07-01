# App Store Submission Handoff

Last updated: July 1, 2026

## Current binary

- Xcode project: `ios/UCLASportsMRI.xcodeproj`
- Scheme: `UCLASportsMRI`
- Bundle ID: `com.jeremyswisher.uclasportsmri`
- Version/build: `1.0 (1)`
- Deployment target: iOS 16.0
- App type: SwiftUI `WKWebView` shell loading the hosted Firebase app
- App URL: `https://ucla-knee-mri.firebaseapp.com/?source=ios-app`
- Debug/TestFlight/App Review launch URL: `https://ucla-knee-mri.firebaseapp.com/login?source=ios-app&reviewerDemo=1`

## Current verified status

- Firebase Hosting was deployed on July 1, 2026 after the accessibility URL addition.
- `npm run preflight:ios:live` passes against `https://ucla-knee-mri.firebaseapp.com`, including public privacy/support/accessibility/account routes, lazy-loaded route chunks, account deletion UI, login/App Review demo affordances, and Firebase Auth callback endpoints.
- `ios/AppStoreSubmissionGate.json` has hosting marked verified.
- The native iOS shell builds successfully for the iPhone 17 Pro Max simulator with the `UCLASportsMRI` scheme.
- The latest simulator screenshot showed the current login UI with Google, Sign in with Apple, and **Continue in App Review demo** visible.
- Native iOS shell sign-in URLs use Firebase full-page redirect auth (`source=ios-app`) to avoid fragile popup behavior inside `WKWebView`.
- Native iOS shell initial loads ignore stale local WebKit cache data, and the web app skips/clears PWA service-worker cache state when running inside `UCLASportsMRIiOS`.
- `npm run archive:ios:signing` confirms Release bundle ID `com.jeremyswisher.uclasportsmri`, version `1.0`, build `1`, automatic signing, Sign in with Apple entitlements, Apple Developer Team `X578T4K65B` (`Jeremy Swisher`), 1 Apple Development identity, and 1 Apple Distribution identity. It also reports 1 matching development provisioning profile but 0 matching App Store distribution profiles, so App Store export signing is not ready yet.
- `npm run archive:ios:only` created `ios/build/UCLASportsMRI.xcarchive` on July 1, 2026. The archive step succeeds; `npm run export:ios` fails with `Failed to find an account with App Store Connect access for team X578T4K65B`. A local `destination=export` retry also fails because no App Store distribution provisioning profile is installed for `com.jeremyswisher.uclasportsmri`. The current blocker is App Store Connect-capable Xcode account access plus an App Store distribution provisioning profile for Team `X578T4K65B`.
- `npm run preflight:ios:submit` still intentionally fails on unverified external gates: Apple Developer Sign in with Apple setup, Firebase Apple provider setup, archive/export signing, real-device/TestFlight auth, account deletion operations, and App Store Connect submission/compliance fields.
- iPhone 6.9-inch and iPad 13-inch App Store screenshots have been captured from the native iOS simulator path and reviewed for no PHI; the remaining screenshot work is uploading the verified sets to App Store Connect.
- Account deletion now has a Firestore rules-backed request path, deployed Firestore rules, and an Admin SDK processing script, but the gate must stay false until a real signed-in request and admin fulfillment are verified.

## Local preflight

Run this before every TestFlight archive/upload:

```sh
npm run build
npm run preflight:ios
npm run archive:ios:check
npm run archive:ios:signing
plutil -lint ios/ExportOptions.plist ios/UCLASportsMRI/UCLASportsMRI.entitlements ios/UCLASportsMRI/PrivacyInfo.xcprivacy ios/UCLASportsMRI/Info.plist
```

`npm run preflight:ios` checks the native bundle metadata, privacy manifest, Sign in with Apple entitlement, app icons, reviewer demo path, required public URLs, login/disclaimer routes, Firebase Hosting configuration, and built `dist/index.html`.

After Firebase Hosting is deployed, run:

```sh
npm run preflight:ios:live
```

The live preflight checks that the deployed app serves the required public routes and includes the App Store login affordances expected by the native shell. It is expected to fail before the current build is deployed.

Before submitting to App Review, update `ios/AppStoreSubmissionGate.json` only for items that have external evidence, then run:

```sh
npm run evidence:ios
npm run auth:ios:evidence
npm run auth:ios:evidence:verify
npm run release:ios:evidence
npm run release:ios:evidence:verify
npm run asc:ios:evidence
npm run asc:ios:evidence:verify
npm run preflight:ios:report
npm run preflight:ios:submit
npm run store:ios:evidence
```

`npm run preflight:ios:report` prints a grouped PASS/TODO summary with next actions and does not fail while external gates are still open. Use it as the handoff/status view. `npm run preflight:ios:submit` remains the hard gate. After every submission-gate boolean is true, it also runs the detailed evidence verifiers and checks the live archive-signing report for `App Store export signing ready: yes` before saying the app is ready for App Review.

This command is expected to fail until Apple Developer setup, Firebase Auth setup, TestFlight/real-device auth, account deletion handling, and App Store Connect fields are all verified.

`npm run evidence:ios` is the consolidated non-failing audit. It runs the archive-signing report plus Apple/Firebase auth, release verification, screenshot, App Store Connect, submission-gate, and final App Store release evidence reports, then prints the suggested order of remaining work. `npm run evidence:ios:verify` is useful only when all evidence should be complete.

After the app is submitted, approved, and publicly available, record the final App Store release evidence in `ios/AppStoreReleaseEvidence.json`, then run:

```sh
npm run store:ios:evidence
npm run store:ios:evidence:verify
```

`npm run store:ios:evidence:verify` is the final proof gate for this thread's goal. It fails until version `1.0 (1)` is recorded as submitted for App Review, approved or ready for sale, and publicly visible on an `apps.apple.com` or `itunes.apple.com` listing.

`npm run release:ios:evidence` reports the real-device/TestFlight auth checks and account-deletion checks that still need external evidence. `npm run release:ios:evidence:verify` is the hard evidence gate for the three real-device auth items and two account-deletion items. It uses `ios/ReleaseVerificationEvidence.json`, which stores only non-identifying confirmation metadata and must never store Apple credentials, Firebase credentials, service-account paths, test-user emails, full Firebase UIDs, PHI, or real learner data.

`npm run asc:ios:evidence` validates the local App Store Connect metadata draft, prints a copy-paste packet for App Store Connect, and reports which external App Store Connect confirmations are still missing. `npm run asc:ios:evidence:verify` is the hard evidence gate for the App Store Connect metadata, privacy, age-rating, regulated-device, build, review-note, and screenshot items. It uses `ios/AppStoreConnectEvidence.json`, which stores only confirmation metadata and must never store App Store Connect API keys, app-specific passwords, issuer IDs, or Apple account credentials.
The App Store Connect evidence script also reads the native version/build from `ios/project.yml` and runs `scripts/ios-screenshot-evidence.mjs --verify`, so screenshot upload evidence cannot pass on stale JSON alone.

After final native simulator or TestFlight screenshots are captured, run:

```sh
npm run screenshots:ios:capture -- --set iphone-6-9 --device <iphone-simulator-udid-or-booted> --app "<path-to-UCLA Sports MRI.app>"
npm run screenshots:ios:capture -- --set ipad-13 --device <ipad-simulator-udid> --app "<path-to-UCLA Sports MRI.app>"
npm run screenshots:ios:check
npm run screenshots:ios:evidence
npm run screenshots:ios:evidence:verify
```

These commands verify the iPhone 6.9-inch and iPad 13-inch screenshot folders, filenames, file formats, screenshot count, and accepted Apple pixel dimensions before App Store Connect upload.
The capture command uses a Debug simulator build and native `WKWebView` launch arguments to open each planned App Review demo route without browser chrome.
The evidence commands use `ios/ScreenshotEvidence.json` to keep device/build/source/no-PHI review evidence aligned with the three screenshot gates in `ios/AppStoreSubmissionGate.json`.

After the command passes and the app is submitted, set `appStoreConnect.submittedForReview` to `true` in `ios/AppStoreSubmissionGate.json` as final submission evidence.

For command-line export/upload after an Xcode archive, use `ios/ExportOptions.plist` as the export options template. Xcode Organizer upload is still the easiest first TestFlight path.
The exact App Store distribution profile checklist lives in `ios/AppStoreExportReadiness.md`.

To split archive and upload retries:

```sh
npm run archive:ios:only
npm run export:ios
```

`archive:ios:only` creates or refreshes `ios/build/UCLASportsMRI.xcarchive`. `export:ios` retries App Store Connect export/upload from the existing archive after Xcode has an App Store Connect-capable account and an App Store distribution provisioning profile for Team `X578T4K65B`. If export fails, the helper now reads Xcode's distribution log and prints the exact account/profile next action.
Only set `archiveExport.appStoreExportSigningReady` and `archiveExport.appStoreConnectAccountAccessVerified` in `ios/AppStoreSubmissionGate.json` after the matching command evidence exists.

When Apple Developer signing is configured, command-line archive/export is available:

```sh
IOS_DEVELOPMENT_TEAM=<Apple Team ID> npm run archive:ios
```

The Xcode project now pins `DEVELOPMENT_TEAM = X578T4K65B`, so the environment variable is optional. Use `npm run archive:ios:signing` first to confirm the Release bundle ID, version/build, automatic signing style, entitlements path, workspace-local DerivedData path, resolved Development Team, Apple Development/Distribution identity counts, decoded provisioning profile count, exact matching provisioning profile count, and matching App Store profile count for `com.jeremyswisher.uclasportsmri / X578T4K65B`. If `App Store export signing ready` is `no`, open Xcode > Settings > Accounts and confirm the signed-in Apple ID has App Store Connect access for Team `X578T4K65B`; then create/download an App Store distribution provisioning profile for `com.jeremyswisher.uclasportsmri` and retry the export/upload.

## App Store Connect metadata draft

Structured copy lives in `ios/AppStoreConnectMetadata.json`.
External App Store Connect entry/upload evidence lives in `ios/AppStoreConnectEvidence.json`.

- Name: `UCLA Sports MRI`
- Subtitle: `Sports medicine MRI learning`
- Primary language: `English (U.S.)`
- User access when creating the app record: `Full Access`
- Required App Store Connect role for app record creation: Account Holder, App Manager, or Admin. Confirm the latest Apple Developer/App Store Connect agreement is accepted before creating the record.
- Primary category: Education
- Secondary category: Medical
- Age rating: 16+ recommended because Apple's current age-rating reference maps frequent medical/treatment information to 16+; this app is advanced medical education for clinicians/fellows and is not for diagnosis or treatment.
- Regulated medical device status: No. The app is educational only; it is not intended to diagnose, prevent, monitor, or treat disease or physiological conditions, does not interface with medical device hardware, and has no FDA clearance, FDA registration, CE mark, UKCA mark, or self-certified medical-device status.
- Price: Free
- In-app purchases: None
- Tracking: No
- Advertising: None
- Accessibility URL: `https://ucla-knee-mri.firebaseapp.com/accessibility`
- Accessibility Nutrition Labels: optional for the current submission; do not claim support for individual labels until common tasks are tested on each supported device against Apple's criteria.

## Description draft

UCLA Sports MRI is an interactive sports medicine MRI education app for fellows and advanced learners. Work through normal MRI workstations for knee, shoulder, hip, and elbow, practice guided tours and cross-plane correlation, answer image-based knowledge checks, review cases, and reinforce missed concepts with spaced review.

The app is designed for education and training. It is not a diagnostic device, treatment tool, or substitute for professional clinical judgment.

## Accessibility draft

The accessibility URL is `https://ucla-knee-mri.firebaseapp.com/accessibility`. It describes common app tasks, current support, known MRI image-interpretation limitations, and the plan to claim Accessibility Nutrition Label support only after device-level testing. Enter the URL in App Store Connect if the field is available. Keep individual label claims conservative until VoiceOver, Voice Control, Larger Text, Differentiate Without Color Alone, Sufficient Contrast, Reduced Motion, and Dark Interface are tested against common tasks on iPhone and iPad.

## Keywords draft

MRI, sports medicine, musculoskeletal, MSK, radiology, knee, shoulder, hip, elbow, fellows

## Review notes draft

UCLA Sports MRI is a medical education app for sports medicine MRI interpretation. It is not intended to diagnose, treat, or guide patient-specific care. The app teaches normal anatomy, MRI search patterns, guided landmark recognition, cross-plane correlation, cases, quizzes, and spaced review.

The app currently requires sign-in to save learner progress. Google sign-in and Sign in with Apple are available in the app. TestFlight/App Review builds also expose a **Continue in App Review demo** button on the login screen so reviewers can inspect all courses without a live fellow account. Backend services are live through Firebase Hosting/Auth/Firestore.

No in-app purchases, ads, tracking, HealthKit, location, camera, contacts, or push notifications are used.

## Privacy label draft

Data linked to user identity:

- Contact Info: name and email address
- User ID
- Product Interaction: course progress, quiz attempts, case attempts, normal MRI completion, review-card scheduling

Purpose:

- App Functionality

Not used for tracking:

- No third-party advertising
- No cross-app tracking
- No IDFA use

## Required URLs

- Privacy Policy URL: `https://ucla-knee-mri.firebaseapp.com/privacy`
- Support URL: `https://ucla-knee-mri.firebaseapp.com/support`
- Accessibility URL: `https://ucla-knee-mri.firebaseapp.com/accessibility`

## App Review risks to resolve before submission

1. Sign in with Apple is now in the app code, but Apple Developer + Firebase Auth provider setup must be completed before submission.
2. Google sign-in inside `WKWebView` may be blocked by Google OAuth policy on real devices. Test on device/TestFlight.
3. App Review demo mode is implemented locally for TestFlight/App Review builds. Verify it after the next Firebase Hosting deploy and on a real device/TestFlight build.
4. Account deletion must be available in app. The app now has an in-app deletion request path at `/account` and shows a confirmation notice after sign-out; the backend/admin deletion process must actually honor those requests before public release.
5. Because this is medical education, keep the in-app disclaimer and review notes clear that the app is educational and not for diagnosis/treatment.

## Account deletion operations

The app writes signed-in user requests to `accountDeletionRequests/{uid}`. Firestore rules allow a learner to create/update only their own request, and admins can review/process requests. The account-deletion rules were deployed to Firebase on July 1, 2026. After request submission, the app signs the learner out and shows the success notice on `/login`.

External account-deletion verification evidence lives in `ios/ReleaseVerificationEvidence.json`. Use a non-identifying test user reference in that file rather than a real email address, full Firebase UID, or any learner data.

After a test user submits `/account` > **Request deletion**, list pending requests with:

```sh
npm run account:deletion -- --list
```

Dry-run a specific request before deleting anything:

```sh
npm run account:deletion -- --uid <firebase-uid>
```

Fulfill the request only after reviewing the dry-run counts:

```sh
npm run account:deletion -- --uid <firebase-uid> --confirm --operator <admin-email>
```

The processor deletes the Firebase Auth user, recursively removes the learner's Firestore `users/{uid}` tree, de-identifies matching audit-log entries, and keeps a scrubbed fulfilled request record. It uses Firebase Admin credentials via `GOOGLE_APPLICATION_CREDENTIALS` or application-default credentials.

## Sign in with Apple setup

Detailed setup tracking lives in `ios/AppleFirebaseAuthSetup.md` and `ios/AppStoreSubmissionGate.json`.
External Apple/Firebase setup evidence lives in `ios/AppleFirebaseAuthEvidence.json`; it intentionally stores only confirmation metadata and must never store Apple private keys, `.p8` contents, Firebase credentials, or client secrets.

The web app now exposes a Sign in with Apple button through Firebase Auth's `apple.com` provider. Before uploading for review:

1. In Apple Developer, enable **Sign in with Apple** for the app identifier associated with `com.jeremyswisher.uclasportsmri`.
2. Create the web/service identifier required by Firebase Auth for Apple provider redirects.
3. Configure the Apple Service ID Return URL exactly:

```text
https://ucla-knee-mri.firebaseapp.com/__/auth/handler
```

4. Configure the Apple private key, team ID, key ID, Service ID, and OAuth code-flow settings in Firebase Authentication > Sign-in method > Apple.
5. Confirm Firebase authorized domains include:

```text
ucla-knee-mri.firebaseapp.com
ucla-knee-mri.web.app
```

6. Run `npm run preflight:ios:live` and confirm the Firebase Auth handler checks pass.
7. Confirm Apple sign-in works on:
   - Safari/mobile web
   - Home-screen PWA
   - Native iOS `WKWebView` shell
8. Add any required associated domains/redirect domains to Firebase and Apple if the provider setup requests them.

## Screenshots needed

The route-by-route capture plan lives in `ios/ScreenshotPlan.md`. Apple currently accepts 1 to 10 screenshots per device set in `.jpeg`, `.jpg`, or `.png`; because this binary targets iPhone and iPad, capture both the iPhone 6.9-inch and iPad 13-inch sets from the native simulator capture path or after TestFlight auth is confirmed.

For repeatable simulator captures from an installed Debug build, use `npm run screenshots:ios:capture` with the simulator UDID, then review the output before treating it as final App Store evidence.

Before uploading the screenshots, run `npm run screenshots:ios:check` to confirm filenames and pixel dimensions match the accepted Apple sizes.

Recommended screenshot set:

1. Course dashboard
2. Normal MRI workstation
3. Guided tour marker
4. Knowledge check
5. Cross-plane drill
6. Case simulator
7. Spaced review

Capture iPhone and iPad screenshots after signing/TestFlight login is confirmed.
