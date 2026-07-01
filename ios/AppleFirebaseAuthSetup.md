# Apple and Firebase Auth Setup

Last updated: July 1, 2026

This app uses Firebase Auth for Google sign-in and Sign in with Apple. The iOS
binary already includes the Sign in with Apple entitlement, and the web app
already exposes the `apple.com` Firebase provider path. These console steps must
still be completed before App Store submission.

## Apple Developer

1. Open Apple Developer > Certificates, Identifiers & Profiles.
2. Select or create the App ID for:

```text
com.jeremyswisher.uclasportsmri
```

3. Enable **Sign in with Apple** for that App ID.
4. Create the web/service identifier required by Firebase Auth for Apple web
   redirects.
5. Configure the service identifier's return URL to exactly match the callback
   URL shown by Firebase Authentication's Apple provider setup.
6. Create or select a Sign in with Apple private key.
7. Record the Team ID, Key ID, Service ID, and private key only in the secure
   Firebase console flow. Do not commit those values to this repo.

## Firebase Authentication

1. Open Firebase Console > Authentication > Sign-in method.
2. Enable Apple provider.
3. Enter the Apple Team ID, Key ID, Service ID, private key, and return/callback
   configuration required by Firebase.
4. Confirm authorized domains include:

```text
ucla-knee-mri.firebaseapp.com
ucla-knee-mri.web.app
```

5. Keep Google provider enabled.

## Deploy and Verify

After the Apple provider is configured:

```sh
npm run build
firebase deploy --only hosting
npm run preflight:ios:live
```

Then archive/upload a TestFlight build and verify on a real iPhone:

1. Google sign-in works in the native shell.
2. Sign in with Apple works in the native shell.
3. App Review demo works in the native shell.
4. `/privacy`, `/support`, and `/account` are reachable.
5. Account deletion request can be submitted and handled.

Once each item is verified, update `ios/AppStoreSubmissionGate.json` and run:

```sh
npm run preflight:ios:submit
```

Only submit to App Review when that command passes.
