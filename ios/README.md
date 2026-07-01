# UCLA Sports MRI iOS Shell

This folder contains the first native iOS shell for the UCLA Sports MRI web app.

## What this version does

- Builds a SwiftUI iOS app with a `WKWebView`.
- Loads the deployed Firebase app at `https://ucla-knee-mri.firebaseapp.com/?source=ios-app`.
- Uses the current premium PWA icon as the iOS app icon source.
- Keeps the React/Vite app as the source of truth, so normal web deploys update the iOS shell content.
- Hides the web-only home-screen install prompts inside the native app.
- Opens outside reference/support links in Safari while keeping Firebase, Google, and Apple auth flows in the shell.
- Shows a local App Review demo access button in Debug/TestFlight/App Review builds.

## Generate the Xcode project

From the repository root:

```sh
xcodegen generate --spec ios/project.yml
```

Then open:

```sh
open ios/UCLASportsMRI.xcodeproj
```

## Signing for device or TestFlight

1. Select the `UCLASportsMRI` target.
2. Open **Signing & Capabilities**.
3. Select your Apple Developer Team.
4. Confirm that **Sign in with Apple** is enabled for the app identifier.
5. Confirm or change the bundle identifier. The default is:

```text
com.jeremyswisher.uclasportsmri
```

6. For TestFlight, choose **Product > Archive** in Xcode, then upload through Organizer.

Before archiving, run the local submission preflight:

```sh
npm run build
npm run preflight:ios
npm run archive:ios:check
npm run archive:ios:signing
```

After deploying Firebase Hosting, verify the live web bundle before archiving:

```sh
npm run preflight:ios:live
```

Before submitting to App Review, update `ios/AppStoreSubmissionGate.json` with verified external evidence and run:

```sh
npm run evidence:ios
npm run release:ios:evidence
npm run release:ios:evidence:verify
npm run asc:ios:evidence
npm run asc:ios:evidence:verify
npm run preflight:ios:submit
npm run store:ios:evidence
```

`npm run evidence:ios` is the consolidated non-failing audit for signing, Apple/Firebase auth evidence, release verification evidence, screenshots, App Store Connect evidence, the final submission gate, and post-submission App Store release evidence.
`npm run release:ios:evidence` reports the real-device/TestFlight auth and account-deletion evidence still missing from `ios/ReleaseVerificationEvidence.json`.
`npm run asc:ios:evidence` validates `ios/AppStoreConnectMetadata.json`, prints the App Store Connect copy-paste packet with the full Description, Promotional Text, What's New, App Review Notes, privacy-label answers, and screenshot file list, then reports which external App Store Connect confirmations still need to be recorded in `ios/AppStoreConnectEvidence.json`.
`npm run store:ios:evidence` reports the post-submission evidence in `ios/AppStoreReleaseEvidence.json`; `npm run store:ios:evidence:verify` is the final goal gate after App Review approval and public App Store availability.

For command-line export/upload after archiving, use `ios/ExportOptions.plist` as the export options template.
The exact App Store distribution profile checklist lives in `ios/AppStoreExportReadiness.md`.

To keep archive creation separate from App Store Connect upload retries:

```sh
npm run archive:ios:only
npm run export:ios
```

`archive:ios:only` creates or refreshes `ios/build/UCLASportsMRI.xcarchive`.
`export:ios` retries App Store Connect export/upload from the existing archive.
If export fails, the helper reads Xcode's distribution log and prints the exact
account/profile next action.
If export fails with App Store Connect account access, open Xcode > Settings >
Accounts and confirm the signed-in Apple ID has App Store Connect access for
Team `X578T4K65B`. If `npm run archive:ios:signing` reports
`App Store export signing ready: no`, create/download an App Store distribution
provisioning profile for `com.jeremyswisher.uclasportsmri` before retrying
export/upload.
If Xcode account access is flaky, `npm run export:ios` can also use a local App
Store Connect API key when `IOS_ASC_API_KEY_PATH`, `IOS_ASC_API_KEY_ID`, and
`IOS_ASC_API_ISSUER_ID` are set. Keep the `.p8` file, key ID, issuer ID, and any
Apple credentials out of git and out of evidence JSON files.

Once Apple Developer signing is configured, archive/export with:

```sh
IOS_DEVELOPMENT_TEAM=<Apple Team ID> npm run archive:ios
```

The Xcode project pins Team ID `X578T4K65B` for `Jeremy Swisher`, so `IOS_DEVELOPMENT_TEAM` is optional after Xcode account credentials and signing assets are valid.
The archive helper writes to `ios/build/`, which is ignored by git.
`npm run archive:ios:signing` reports the Release signing settings, detected team, Apple Development/Distribution identity counts, decoded provisioning profile count, exact matching profile count, matching App Store profile count for `com.jeremyswisher.uclasportsmri / X578T4K65B`, and whether archive signing and App Store export signing are ready before you attempt upload.

## Reviewer access

Debug, TestFlight, and App Review builds open the login screen with `reviewerDemo=1`.
That exposes **Continue in App Review demo**, which signs in as a local demo fellow
with local-only progress so reviewers can inspect all courses without a live account.

Production App Store builds use the regular hosted URL without the reviewer flag.

## Important next native work

This shell is the fastest route to a real iOS app. Before App Store submission, configure the Apple provider in Firebase Auth and test Google/Firebase/Apple sign-in carefully inside `WKWebView` on a real device. If Google blocks embedded auth, the next step is native sign-in via `ASWebAuthenticationSession` or Firebase native auth, then passing the session into the web app.

See `ios/AppStoreSubmission.md` for App Store Connect metadata, evidence tracking, privacy-label guidance, review notes, and remaining submission risks.
