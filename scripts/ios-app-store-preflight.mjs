import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];

function path(...parts) {
  return join(root, ...parts);
}

function readText(...parts) {
  return readFileSync(path(...parts), "utf8");
}

function pass(label, detail = "") {
  checks.push({ ok: true, label, detail });
}

function fail(label, detail = "") {
  checks.push({ ok: false, label, detail });
}

function assertFile(label, ...parts) {
  const file = path(...parts);
  if (existsSync(file) && statSync(file).isFile()) {
    pass(label, parts.join("/"));
    return true;
  }
  fail(label, `${parts.join("/")} is missing`);
  return false;
}

function assertIncludes(label, text, needle) {
  if (text.includes(needle)) {
    pass(label, needle);
  } else {
    fail(label, `Missing ${needle}`);
  }
}

function pngSize(file) {
  const data = readFileSync(file);
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("Not a PNG file");
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

assertFile("Xcode project exists", "ios", "UCLASportsMRI.xcodeproj", "project.pbxproj");
assertFile("XcodeGen spec exists", "ios", "project.yml");
assertFile("Info.plist exists", "ios", "UCLASportsMRI", "Info.plist");
assertFile("Privacy manifest exists", "ios", "UCLASportsMRI", "PrivacyInfo.xcprivacy");
assertFile("Entitlements exist", "ios", "UCLASportsMRI", "UCLASportsMRI.entitlements");
assertFile("Native shell exists", "ios", "UCLASportsMRI", "WebShellView.swift");
assertFile("Export options template exists", "ios", "ExportOptions.plist");
assertFile("App Store handoff exists", "ios", "AppStoreSubmission.md");
assertFile("iOS README exists", "ios", "README.md");

const project = readText("ios", "project.yml");
assertIncludes("Bundle ID configured", project, "PRODUCT_BUNDLE_IDENTIFIER: com.jeremyswisher.uclasportsmri");
assertIncludes("iPhone and iPad enabled", project, 'TARGETED_DEVICE_FAMILY: "1,2"');
assertIncludes("App icon catalog configured", project, "ASSETCATALOG_COMPILER_APPICON_NAME: AppIcon");
assertIncludes("Sign in with Apple entitlement wired", project, "CODE_SIGN_ENTITLEMENTS");

const info = readText("ios", "UCLASportsMRI", "Info.plist");
assertIncludes("Display name configured", info, "<string>UCLA Sports MRI</string>");
assertIncludes("Encryption export declaration present", info, "<key>ITSAppUsesNonExemptEncryption</key>");
assertIncludes("Launch color configured", info, "<string>LaunchBackground</string>");
assertIncludes("iPad orientations configured", info, "<key>UISupportedInterfaceOrientations~ipad</key>");

const entitlements = readText("ios", "UCLASportsMRI", "UCLASportsMRI.entitlements");
assertIncludes("Sign in with Apple entitlement present", entitlements, "com.apple.developer.applesignin");

const privacy = readText("ios", "UCLASportsMRI", "PrivacyInfo.xcprivacy");
assertIncludes("Privacy manifest says no tracking", privacy, "<key>NSPrivacyTracking</key>");
assertIncludes("Name privacy label present", privacy, "NSPrivacyCollectedDataTypeName");
assertIncludes("Email privacy label present", privacy, "NSPrivacyCollectedDataTypeEmailAddress");
assertIncludes("User ID privacy label present", privacy, "NSPrivacyCollectedDataTypeUserID");
assertIncludes("Product interaction privacy label present", privacy, "NSPrivacyCollectedDataTypeProductInteraction");
assertIncludes("Privacy purpose is app functionality", privacy, "NSPrivacyCollectedDataTypePurposeAppFunctionality");

const webShell = readText("ios", "UCLASportsMRI", "WebShellView.swift");
assertIncludes("Native shell loads Firebase app", webShell, "https://ucla-knee-mri.firebaseapp.com/");
assertIncludes("Native shell marks iOS source", webShell, 'URLQueryItem(name: "source", value: "ios-app")');
assertIncludes("Reviewer demo launch flag present", webShell, 'URLQueryItem(name: "reviewerDemo", value: "1")');
assertIncludes("TestFlight sandbox receipt path handled", webShell, "sandboxReceipt");
assertIncludes("Apple auth host allowed", webShell, "appleid.apple.com");
assertIncludes("External links open outside shell", webShell, "UIApplication.shared.open(url)");

const appStoreSubmission = readText("ios", "AppStoreSubmission.md");
assertIncludes("Privacy URL documented", appStoreSubmission, "https://ucla-knee-mri.firebaseapp.com/privacy");
assertIncludes("Support URL documented", appStoreSubmission, "https://ucla-knee-mri.firebaseapp.com/support");
assertIncludes("Reviewer demo documented", appStoreSubmission, "Continue in App Review demo");
assertIncludes("Medical education disclaimer documented", appStoreSubmission, "not intended to diagnose");
assertIncludes("Account deletion risk documented", appStoreSubmission, "Account deletion");

const exportOptions = readText("ios", "ExportOptions.plist");
assertIncludes("Export destination uploads to App Store Connect", exportOptions, "<string>upload</string>");
assertIncludes("Export method targets App Store Connect", exportOptions, "<string>app-store-connect</string>");
assertIncludes("Automatic signing export configured", exportOptions, "<string>automatic</string>");

const appIconManifestPath = path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", "Contents.json");
const appIconManifest = JSON.parse(readFileSync(appIconManifestPath, "utf8"));
const expectedMarketing = appIconManifest.images.find(
  (image) => image.idiom === "ios-marketing" && image.size === "1024x1024" && image.scale === "1x",
);
if (expectedMarketing?.filename) {
  const iconPath = path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", expectedMarketing.filename);
  if (!existsSync(iconPath)) {
    fail("Marketing app icon exists", `${expectedMarketing.filename} is missing`);
  } else {
    const size = pngSize(iconPath);
    if (size.width === 1024 && size.height === 1024) {
      pass("Marketing app icon is 1024x1024", expectedMarketing.filename);
    } else {
      fail("Marketing app icon is 1024x1024", `${expectedMarketing.filename} is ${size.width}x${size.height}`);
    }
  }
} else {
  fail("Marketing app icon declared", "Missing ios-marketing 1024x1024 entry");
}

for (const image of appIconManifest.images) {
  if (!image.filename) continue;
  if (!existsSync(path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", image.filename))) {
    fail("All declared app icon files exist", `${image.filename} is missing`);
  }
}
if (!checks.some((check) => check.label === "All declared app icon files exist" && !check.ok)) {
  pass("All declared app icon files exist");
}

assertFile("Built web index exists", "dist", "index.html");
assertFile("PWA 512 icon exists", "public", "pwa-icon-512.png");
assertFile("Apple touch icon exists", "public", "apple-touch-icon.png");

const app = readText("src", "App.tsx");
assertIncludes("Privacy route exists", app, 'path="/privacy"');
assertIncludes("Support route exists", app, 'path="/support"');
assertIncludes("Account route exists", app, 'path="/account"');

const login = readText("src", "pages", "LoginPage.tsx");
assertIncludes("Sign in with Apple button exists", login, "Sign in with Apple");
assertIncludes("App Review demo button exists", login, "Continue in App Review demo");
assertIncludes("Medical disclaimer present on login", login, "Educational training only");

const firebase = readText("firebase.json");
assertIncludes("Firebase Hosting serves dist", firebase, '"public": "dist"');
assertIncludes("SPA rewrite configured", firebase, '"destination": "/index.html"');

const failures = checks.filter((check) => !check.ok);
for (const check of checks) {
  const icon = check.ok ? "PASS" : "FAIL";
  console.log(`${icon} ${check.label}${check.detail ? ` - ${check.detail}` : ""}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} iOS App Store preflight check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} iOS App Store preflight checks passed.`);
