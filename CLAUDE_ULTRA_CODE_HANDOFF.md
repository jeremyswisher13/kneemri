# Claude Ultra Code Handoff: UCLA Sports MRI App Store Submission

Last updated: July 1, 2026
Repo path: `/Users/jeremyswisher/Jeremy Swisher Knee MRI UCLA Course/knee-mri-app`
Branch: `main`
Starting commit this handoff was based on: `13450cd Print App Store Connect portal copy`

## Mission

Get the UCLA Sports MRI app onto the Apple App Store.

The app is not submitted or live on the App Store yet. Keep the goal open until App Store Connect shows version `1.0 (1)` submitted, approved/ready for sale, and publicly visible on an `apps.apple.com` or `itunes.apple.com` listing.

## Current Status

Run these first:

```sh
git status --short --branch
npm run evidence:ios
npm run preflight:ios:report
```

Current expected state:

- Git should be clean and synced with `origin/main`.
- `npm run evidence:ios` should be non-failing but report only `1/7` audited groups ready.
- `npm run preflight:ios:report` should report `5/28` submission gates verified and `23/28` missing.
- `npm run preflight:ios` should pass.
- `npm run preflight:ios:submit` should fail until external Apple/Firebase/TestFlight/App Store Connect evidence is complete.

Do not mark any gate true in `ios/AppStoreSubmissionGate.json` unless the matching real external evidence exists.

## What Is Already Done

### Web app and hosted readiness

- Firebase Hosting is deployed and recorded as current in `ios/AppStoreSubmissionGate.json`.
- `npm run preflight:ios:live` has passed previously with 105 live checks.
- Public routes are live: privacy, support, accessibility, account deletion UI, login, Firebase auth handlers.
- The native shell is a SwiftUI `WKWebView` app loading the Firebase app with `source=ios-app`.
- Native shell uses redirect-style Firebase Auth for iOS webview auth.
- Native shell skips stale service worker/cache state.

### iOS project

- Xcode project: `ios/UCLASportsMRI.xcodeproj`
- Scheme: `UCLASportsMRI`
- Bundle ID: `com.jeremyswisher.uclasportsmri`
- Version/build: `1.0 (1)`
- Team ID pinned: `X578T4K65B`
- App name: `UCLA Sports MRI`
- Deployment target: iOS 16.0
- Sign in with Apple entitlement is present in native entitlements.
- Privacy manifest is present and declares no tracking.
- Marketing app icon exists and preflight checks it.

### Screenshots

- iPhone 6.9-inch and iPad 13-inch App Store screenshots are captured.
- Screenshot evidence is complete: `npm run screenshots:ios:evidence:verify` should pass.
- Screenshots were reviewed for no PHI, no real learner data, no browser chrome, no debug overlays.

### App Store Connect copy packet

Use this for portal entry:

```sh
npm run asc:ios:evidence
```

It now prints:

- App name, SKU, bundle ID, version/build
- Full Description
- Promotional Text
- What's New
- App Review Notes
- Privacy-label answers
- Screenshot upload file list
- App Store Connect TODO evidence gates

Source metadata:

- `ios/AppStoreConnectMetadata.json`
- `ios/AppStoreConnectEvidence.json`
- `ios/AppStoreSubmission.md`

### Archive/export tooling

Archive/export helper:

```sh
npm run archive:ios:check
npm run archive:ios:signing
npm run archive:ios:only
npm run export:ios
```

`scripts/ios-archive.mjs` supports App Store Connect API key auth via local environment variables:

```sh
IOS_ASC_API_KEY_PATH=/secure/local/path/AuthKey_XXXXXXXXXX.p8
IOS_ASC_API_KEY_ID=<key-id>
IOS_ASC_API_ISSUER_ID=<issuer-id>
```

Never commit the `.p8`, key ID, issuer ID, Apple credentials, or Firebase service credentials.

## Known Remaining Blockers

These are real external blockers, not local test failures.

### 1. Archive/export signing

Current expected audit:

- `App Store export signing ready: no`
- Matching development profile exists.
- Matching App Store distribution provisioning profile does not exist yet.

Next:

1. Create/download an App Store distribution provisioning profile for `com.jeremyswisher.uclasportsmri` on Team `X578T4K65B`.
2. Confirm Xcode has App Store Connect upload access for Team `X578T4K65B`, or configure the local `IOS_ASC_API_KEY_*` env vars.
3. Rerun:

```sh
npm run archive:ios:signing
npm run archive:ios:only
npm run export:ios
```

Only after export/upload access works should `archiveExport.appStoreExportSigningReady` and `archiveExport.appStoreConnectAccountAccessVerified` be set true in `ios/AppStoreSubmissionGate.json`.

### 2. Apple Developer + Firebase Sign in with Apple

Locked values:

- Native bundle ID: `com.jeremyswisher.uclasportsmri`
- Apple Team ID: `X578T4K65B`
- Apple Services ID: `com.jeremyswisher.uclasportsmri.web`
- Primary return URL: `https://ucla-knee-mri.firebaseapp.com/__/auth/handler`
- Secondary auth handler: `https://ucla-knee-mri.web.app/__/auth/handler`
- Firebase project: `ucla-knee-mri`
- Firebase authorized domains: `ucla-knee-mri.firebaseapp.com`, `ucla-knee-mri.web.app`

Next:

1. Enable Sign in with Apple on App ID `com.jeremyswisher.uclasportsmri`.
2. Create Services ID `com.jeremyswisher.uclasportsmri.web`.
3. Set the return URL exactly to `https://ucla-knee-mri.firebaseapp.com/__/auth/handler`.
4. Configure Firebase Authentication > Sign-in method > Apple.
5. Record non-secret evidence in `ios/AppleFirebaseAuthEvidence.json`.
6. Run:

```sh
npm run auth:ios:evidence
npm run auth:ios:evidence:verify
```

Do not store Apple private keys, `.p8` contents, client secrets, Firebase credentials, or API keys in the repo.

### 3. Real-device/TestFlight verification

Evidence file:

- `ios/ReleaseVerificationEvidence.json`

Needed checks:

- Google sign-in passes inside native iOS shell.
- Sign in with Apple passes inside native iOS shell.
- Continue in App Review demo opens the curriculum without a live fellow account.
- Account deletion request flow is verified from `/account`.
- Admin deletion dry run and fulfillment path are verified for a non-identifying test user.

Run:

```sh
npm run release:ios:evidence
npm run release:ios:evidence:verify
```

Do not store real email addresses, full Firebase UIDs, PHI, learner data, or service account paths in evidence JSON.

### 4. App Store Connect entry

Evidence file:

- `ios/AppStoreConnectEvidence.json`

Use:

```sh
npm run asc:ios:evidence
```

Next App Store Connect tasks:

1. Create app record for bundle ID `com.jeremyswisher.uclasportsmri`.
2. SKU: `ucla-sports-mri-ios`.
3. Primary language: English (U.S.).
4. Categories: Education primary, Medical secondary.
5. Price: Free.
6. Enter metadata from `npm run asc:ios:evidence`.
7. Enter privacy labels:
   - Tracking: No
   - Data linked to user: Name, Email Address, User ID, Product Interaction
   - Purpose: App Functionality
8. Age rating: 16+ recommended for frequent medical/treatment information in advanced medical education.
9. Regulated medical device status: No.
10. Export compliance: no non-exempt encryption (`ITSAppUsesNonExemptEncryption` is false).
11. Upload iPhone and iPad screenshots from the verified screenshot folders.
12. Upload/select build `1.0 (1)` after archive/export succeeds.
13. Enter review notes from the copy packet.

Then run:

```sh
npm run asc:ios:evidence:verify
```

### 5. Final App Review submission and public release

Hard gate:

```sh
npm run preflight:ios:submit
```

This should remain failing until all evidence gates are true and detailed verifiers pass.

After actual App Review submission, approval, and public listing, update:

- `ios/AppStoreReleaseEvidence.json`

Then run:

```sh
npm run store:ios:evidence
npm run store:ios:evidence:verify
```

Only when `store:ios:evidence:verify` passes and the App Store listing is public is the overall goal complete.

## Important Commands

Daily status:

```sh
npm run evidence:ios
npm run preflight:ios:report
```

Local app quality:

```sh
npm run lint
npm run build
npm test
npm run preflight:ios
```

Submission hard gate:

```sh
npm run preflight:ios:submit
```

Portal packet:

```sh
npm run submit:ios:packet
npm run asc:ios:evidence
```

Screenshots:

```sh
npm run screenshots:ios:check
npm run screenshots:ios:evidence
npm run screenshots:ios:evidence:verify
```

Archive/signing:

```sh
npm run archive:ios:check
npm run archive:ios:signing
npm run archive:ios:only
npm run export:ios
```

## Recent Commits

- `13450cd Print App Store Connect portal copy`
  - `asc:ios:evidence` now prints the full portal text fields and privacy answers.
- `d410afa Support ASC API key export auth`
  - Archive/export can use local App Store Connect API key env vars.
- `93e204c Clarify iOS submission packet next actions`
- `b27d0a8 Add iOS submission portal packet`
- `b9f3d08 Rerun live readiness in iOS submit gate`

## Safety Rules

- Do not commit Apple private keys, `.p8` contents, App Store Connect API keys, issuer IDs, app-specific passwords, Firebase service-account paths, test-user emails, full Firebase UIDs, PHI, or real learner data.
- Do not set evidence booleans true unless the matching external screen/device/admin operation is actually verified.
- Do not claim the app is submitted, approved, or publicly available until App Store Connect and the public store listing prove it.
- Do not use `git reset --hard` or revert user work without explicit approval.

## Best Next Session

Best use of time with Jeremy present:

1. Open Apple Developer and App Store Connect with Jeremy handling login/2FA.
2. Complete Sign in with Apple App ID + Services ID setup.
3. Configure Firebase Apple provider.
4. Create/download App Store distribution profile or configure local App Store Connect API key export.
5. Archive/upload the build.
6. Create the App Store Connect app record and paste metadata from `npm run asc:ios:evidence`.
7. Run TestFlight/real-device checks.
8. Update evidence JSONs only after each real external step is confirmed.

Expected timeline: even if everything is submitted today, App Review is a waiting process. Approval may happen within a day or two, but first submissions can take longer or require clarification/resubmission.
