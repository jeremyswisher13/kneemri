# Apple and Firebase Auth Setup

Last updated: July 1, 2026

This app uses Firebase Auth for Google sign-in and Sign in with Apple. The iOS
binary already includes the Sign in with Apple entitlement, and the web app
already exposes the `apple.com` Firebase provider path. These console steps must
still be completed before App Store submission.

Firebase uses the project auth domain as the OAuth redirect mechanism. For this
project, register this exact Return URL in the Apple Service ID:

```text
https://ucla-knee-mri.firebaseapp.com/__/auth/handler
```

The secondary Firebase Hosting domain also serves the auth handler and should
remain in Firebase authorized domains:

```text
https://ucla-knee-mri.web.app/__/auth/handler
```

Reference: Firebase's web Apple-auth setup uses
`https://YOUR_FIREBASE_PROJECT_ID.firebaseapp.com/__/auth/handler` as the Apple
Service ID Return URL.

## Apple Developer

1. Open Apple Developer > Certificates, Identifiers & Profiles.
2. Select or create the App ID for:

```text
com.jeremyswisher.uclasportsmri
```

3. Enable **Sign in with Apple** for that App ID.
4. Create the web/service identifier required by Firebase Auth for Apple web
   redirects.
5. Configure the service identifier's return URL to exactly:

```text
https://ucla-knee-mri.firebaseapp.com/__/auth/handler
```

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

## Public callback checks

`npm run preflight:ios:live` verifies these public Firebase Auth helper pages are
reachable:

```text
https://ucla-knee-mri.firebaseapp.com/__/auth/handler
https://ucla-knee-mri.web.app/__/auth/handler
```

Those checks do not prove the Apple provider is fully configured; they only prove
the redirect URLs that Apple/Firebase must use are live.

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
