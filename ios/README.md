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
```

After deploying Firebase Hosting, verify the live web bundle before archiving:

```sh
npm run preflight:ios:live
```

For command-line export/upload after archiving, use `ios/ExportOptions.plist` as the export options template.

## Reviewer access

Debug, TestFlight, and App Review builds open the login screen with `reviewerDemo=1`.
That exposes **Continue in App Review demo**, which signs in as a local demo fellow
with local-only progress so reviewers can inspect all courses without a live account.

Production App Store builds use the regular hosted URL without the reviewer flag.

## Important next native work

This shell is the fastest route to a real iOS app. Before App Store submission, configure the Apple provider in Firebase Auth and test Google/Firebase/Apple sign-in carefully inside `WKWebView` on a real device. If Google blocks embedded auth, the next step is native sign-in via `ASWebAuthenticationSession` or Firebase native auth, then passing the session into the web app.

See `ios/AppStoreSubmission.md` for App Store Connect metadata, privacy-label guidance, review notes, and remaining submission risks.
