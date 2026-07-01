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

- Firebase Hosting was deployed on July 1, 2026 after the native-shell stale-cache fix.
- `npm run preflight:ios:live` passes live checks against `https://ucla-knee-mri.firebaseapp.com`, including the Firebase Auth callback endpoints.
- `ios/AppStoreSubmissionGate.json` has hosting marked verified.
- The native iOS shell builds successfully for the iPhone 17 Pro Max simulator with the `UCLASportsMRI` scheme.
- The latest simulator screenshot showed the current login UI with Google, Sign in with Apple, and **Continue in App Review demo** visible.
- Native iOS shell sign-in URLs use Firebase full-page redirect auth (`source=ios-app`) to avoid fragile popup behavior inside `WKWebView`.
- Native iOS shell initial loads ignore stale local WebKit cache data, and the web app skips/clears PWA service-worker cache state when running inside `UCLASportsMRIiOS`.
- `npm run archive:ios:signing` confirms Release bundle ID `com.jeremyswisher.uclasportsmri`, version `1.0`, build `1`, automatic signing, and Sign in with Apple entitlements; it currently reports Development Team as missing until an Apple Team ID is selected or passed through `IOS_DEVELOPMENT_TEAM`.
- `npm run preflight:ios:submit` still intentionally fails on 23 unverified external gates: Apple Developer Sign in with Apple setup, Firebase Apple provider setup, real-device/TestFlight auth, account deletion operations, App Store screenshots, and App Store Connect submission fields.
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
npm run auth:ios:evidence
npm run auth:ios:evidence:verify
npm run preflight:ios:report
npm run preflight:ios:submit
```

`npm run preflight:ios:report` prints a grouped PASS/TODO summary with next actions and does not fail while external gates are still open. Use it as the handoff/status view. `npm run preflight:ios:submit` remains the hard gate.

This command is expected to fail until Apple Developer setup, Firebase Auth setup, live deploy, TestFlight/real-device auth, screenshots, account deletion handling, and App Store Connect fields are all verified.

After final TestFlight/native screenshots are captured, run:

```sh
npm run screenshots:ios:check
npm run screenshots:ios:evidence
npm run screenshots:ios:evidence:verify
```

These commands verify the iPhone 6.9-inch and iPad 13-inch screenshot folders, filenames, file formats, screenshot count, and accepted Apple pixel dimensions before App Store Connect upload.
The evidence commands use `ios/ScreenshotEvidence.json` to keep device/build/source/no-PHI review evidence aligned with the three screenshot gates in `ios/AppStoreSubmissionGate.json`.

After the command passes and the app is submitted, set `appStoreConnect.submittedForReview` to `true` in `ios/AppStoreSubmissionGate.json` as final submission evidence.

For command-line export/upload after an Xcode archive, use `ios/ExportOptions.plist` as the export options template. Xcode Organizer upload is still the easiest first TestFlight path.

When Apple Developer signing is configured, command-line archive/export is available:

```sh
IOS_DEVELOPMENT_TEAM=<Apple Team ID> npm run archive:ios
```

Use `npm run archive:ios:signing` first to confirm the Release bundle ID, version/build, automatic signing style, entitlements path, workspace-local DerivedData path, and whether a Development Team is resolved.

## App Store Connect metadata draft

Structured copy lives in `ios/AppStoreConnectMetadata.json`.

- Name: `UCLA Sports MRI`
- Subtitle: `Sports medicine MRI learning`
- Primary category: Education
- Secondary category: Medical
- Age rating: 17+ recommended because the content is advanced medical education for clinicians/fellows.
- Price: Free
- In-app purchases: None
- Tracking: No
- Advertising: None

## Description draft

UCLA Sports MRI is an interactive sports medicine MRI education app for fellows and advanced learners. Work through normal MRI workstations for knee, shoulder, hip, and elbow, practice guided tours and cross-plane correlation, answer image-based knowledge checks, review cases, and reinforce missed concepts with spaced review.

The app is designed for education and training. It is not a diagnostic device, treatment tool, or substitute for professional clinical judgment.

## Keywords draft

MRI, sports medicine, musculoskeletal, MSK, radiology, knee, shoulder, hip, elbow, fellowship, education

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

## App Review risks to resolve before submission

1. Sign in with Apple is now in the app code, but Apple Developer + Firebase Auth provider setup must be completed before submission.
2. Google sign-in inside `WKWebView` may be blocked by Google OAuth policy on real devices. Test on device/TestFlight.
3. App Review demo mode is implemented locally for TestFlight/App Review builds. Verify it after the next Firebase Hosting deploy and on a real device/TestFlight build.
4. Account deletion must be available in app. The app now has an in-app deletion request path at `/account`; the backend/admin deletion process must actually honor those requests before public release.
5. Because this is medical education, keep the in-app disclaimer and review notes clear that the app is educational and not for diagnosis/treatment.

## Account deletion operations

The app writes signed-in user requests to `accountDeletionRequests/{uid}`. Firestore rules allow a learner to create/update only their own request, and admins can review/process requests. The account-deletion rules were deployed to Firebase on July 1, 2026.

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

The route-by-route capture plan lives in `ios/ScreenshotPlan.md`. Apple currently accepts 1 to 10 screenshots per device set in `.jpeg`, `.jpg`, or `.png`; because this binary targets iPhone and iPad, capture both the iPhone 6.9-inch and iPad 13-inch sets after TestFlight auth is confirmed.

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
