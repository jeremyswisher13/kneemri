# App Store Screenshot Plan

Last checked against Apple App Store Connect Help on July 1, 2026:

- Upload screenshots on the platform version page in App Store Connect.
- Apple accepts 1 to 10 screenshots in `.jpeg`, `.jpg`, or `.png`.
- Because this app targets iPhone and iPad, prepare at least one iPhone set and one iPad set.
- For this universal app, capture the high-resolution sets first:
  - iPhone 6.9-inch display: portrait `1260 x 2736`, `1290 x 2796`, or `1320 x 2868`.
  - iPad 13-inch display: portrait `2064 x 2752` or `2048 x 2732`.
- Official Apple references:
  - `https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots`
  - `https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications`

## Capture Conditions

Use the TestFlight/native iOS app after Firebase Hosting is deployed with the current web build.

Required before final screenshots:

1. Sign in with Apple configured in Apple Developer and Firebase Auth.
2. Google sign-in, Sign in with Apple, and App Review demo verified on a real device.
3. Privacy URL and Support URL live:
   - `https://ucla-knee-mri.firebaseapp.com/privacy`
   - `https://ucla-knee-mri.firebaseapp.com/support`
4. No visible browser chrome, local preview labels, debug overlays, localhost URLs, or personally identifying learner data.

Preferred access path:

1. Launch TestFlight build.
2. Tap **Continue in App Review demo**.
3. Capture the screens below using the demo fellow state.

## Screenshot Set

Use the same content order for iPhone and iPad unless the final device review suggests a better order.

| # | Filename stem | Route / state | App Store message |
|---|---|---|---|
| 01 | `01-dashboard` | `/courses/knee-mri` | Choose a sports MRI course and continue the next learning step. |
| 02 | `02-normal-guided-tour` | `/courses/knee-mri/normal-knee-mri?mode=tour&series=sag-pdfs` | Guided normal MRI landmarks with high-yield anatomy callouts. |
| 03 | `03-knowledge-check` | `/courses/knee-mri/normal-knee-mri?mode=check&series=cor-pdfs` | Image-based knowledge checks reinforce normal anatomy. |
| 04 | `04-cross-plane` | `/courses/shoulder-mri/normal-shoulder-mri?mode=correlate&series=cor-t2fs` | Cross-plane correlation before calling a finding real. |
| 05 | `05-cases` | `/courses/knee-mri/cases` | Case practice links search patterns to real MRI decisions. |
| 06 | `06-spaced-review` | `/courses/knee-mri/review` | Missed concepts return as spaced review cards. |
| 07 | `07-progress` | `/courses/knee-mri/progress` | Track completion across normal MRI, modules, cases, and assessments. |

## Device Naming

Suggested export folders:

```text
ios/screenshots/iphone-6-9/
ios/screenshots/ipad-13/
```

Suggested final filenames:

```text
iphone-6-9-01-dashboard.png
iphone-6-9-02-normal-guided-tour.png
iphone-6-9-03-knowledge-check.png
iphone-6-9-04-cross-plane.png
iphone-6-9-05-cases.png
iphone-6-9-06-spaced-review.png
iphone-6-9-07-progress.png
ipad-13-01-dashboard.png
ipad-13-02-normal-guided-tour.png
ipad-13-03-knowledge-check.png
ipad-13-04-cross-plane.png
ipad-13-05-cases.png
ipad-13-06-spaced-review.png
ipad-13-07-progress.png
```

Before uploading to App Store Connect, verify every file with:

```sh
npm run screenshots:ios:check
```

The checker validates the two screenshot folders, planned filenames, accepted `.png` / `.jpg` / `.jpeg` formats, 1-10 screenshots per device set, and the Apple-accepted pixel dimensions listed above.

## Final QA Before Upload

- Text is legible and not clipped.
- MRI image area is visible in screenshots 02-04.
- No protected health information or real learner data appears.
- The login screen is not part of the primary screenshot set.
- Screenshots show the native app or TestFlight app, not a desktop browser or local preview.
