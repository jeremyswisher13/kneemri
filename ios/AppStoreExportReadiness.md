# App Store Export Readiness

Last updated: July 1, 2026

This checklist tracks the remaining signing/upload step between a successful local archive and a TestFlight/App Store Connect upload.

## Current State

- Team: `X578T4K65B` (`Jeremy Swisher`)
- Bundle ID: `com.jeremyswisher.uclasportsmri`
- Version/build: `1.0 (1)`
- Local archive path: `ios/build/UCLASportsMRI.xcarchive`
- Apple Development identity: present
- Apple Distribution identity: present
- Matching development provisioning profile: present
- Matching App Store distribution provisioning profile: missing
- `npm run archive:ios:only`: succeeds
- `npm run export:ios`: fails because Xcode cannot find an App Store Connect-capable account for Team `X578T4K65B`

Two independent Apple-side blockers remain:

1. Xcode must be signed in with an Apple ID that has App Store Connect access for Team `X578T4K65B`.
2. An App Store distribution provisioning profile must exist for `com.jeremyswisher.uclasportsmri` and be installed locally.

`npm run archive:ios:signing` must show:

```text
App Store export signing ready: yes
Matching App Store profiles: 1 for com.jeremyswisher.uclasportsmri / X578T4K65B
```

## Required Apple Steps

Apple's App Store Connect provisioning profile workflow requires an explicit App ID, a distribution certificate, and Account Holder or Admin role access.

1. Open Apple Developer > Certificates, Identifiers & Profiles.
2. Confirm the explicit App ID exists for:

```text
com.jeremyswisher.uclasportsmri
```

3. Confirm Sign in with Apple remains enabled on that App ID.
4. Open Profiles and create a new Distribution profile.
5. Select **App Store Connect** for iOS/iPadOS distribution.
6. Choose the App ID matching `com.jeremyswisher.uclasportsmri`.
7. Select the Apple Distribution certificate for Team `X578T4K65B`.
8. Name the profile clearly, for example:

```text
UCLA Sports MRI App Store Connect
```

9. Generate and download the profile, then install it in Xcode or double-click it.
10. Confirm the Apple ID signed in to Xcode has App Store Connect access for Team `X578T4K65B`.

Official references:

- Apple Developer: https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile
- App Store Connect role permissions: https://developer.apple.com/help/app-store-connect/reference/account-management/role-permissions

## Verify

After the profile is installed:

```sh
npm run archive:ios:signing
npm run export:ios
```

If `archive:ios:signing` reports zero code-signing identities while Xcode shows Apple certificates in Settings > Accounts, rerun the command from a normal Terminal/Xcode session with full keychain access before creating replacement certificates. Sandboxed automation can see provisioning profiles while failing to see keychain identities; the authoritative report is the keychain-access run.

If `archive:ios:signing` still shows `Matching App Store profiles: 0`, the App Store distribution profile is not installed or does not match the bundle ID/team.
If `export:ios` still fails with account access, open Xcode > Settings > Accounts and refresh/sign in to the Apple ID that has App Store Connect access for Team `X578T4K65B`.
The export helper reads Xcode's `IDEDistribution.standard.log` and prints the exact account/profile next action when export fails.

Only after export/upload succeeds should the App Store Connect build evidence be recorded in `ios/AppStoreConnectEvidence.json`.
