import {
  deleteUser,
  GoogleAuthProvider,
  getRedirectResult,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { logAuditEvent } from "./audit";
import { disableAppReviewDemoAuth, disableLocalPreviewAuth } from "./local-preview-auth";

// Firestore (`firebase/firestore` + `db`) is dynamically imported inside each
// function that needs it, so the large firestore SDK never lands in the eager
// login bundle — it loads only when an auth flow actually reads/writes user docs.

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

// Admin emails - these accounts automatically get admin role on sign-in
const ADMIN_EMAILS = [
  "jeremyswisher13@gmail.com",
  "jeremyswisher@gmail.com",
  "jswisher@mednet.ucla.edu",
  "kimberlymburbank@gmail.com",
];

async function finishFederatedSignIn(user: User, providerId?: string | null) {
  const isAdmin = ADMIN_EMAILS.some(
    (email) => user.email?.toLowerCase() === email.toLowerCase()
  );
  const providerIds = user.providerData.map((provider) => provider.providerId);

  const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const { db } = await import("./db");

  // Create or update user document in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const existingUser = userSnap.exists() ? userSnap.data() : null;
  const email = user.email ?? existingUser?.email ?? null;
  const displayName = user.displayName ?? existingUser?.displayName ?? null;
  const photoURL = user.photoURL ?? existingUser?.photoURL ?? null;

  if (!userSnap.exists()) {
    // New user - create profile (non-admins start with no role; they pick on first login)
    await setDoc(userRef, {
      email,
      displayName,
      photoURL,
      authProviderIds: providerIds,
      lastAuthProviderId: providerId ?? providerIds[0] ?? null,
      role: isAdmin ? "admin" : null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });
  } else {
    // Existing user - update last login (and promote to admin if in admin list)
    const updates: Record<string, unknown> = {
      email,
      displayName,
      photoURL,
      authProviderIds: providerIds,
      lastAuthProviderId: providerId ?? providerIds[0] ?? null,
      lastLoginAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };
    if (isAdmin && existingUser?.role !== "admin") {
      updates.role = "admin";
    }
    await setDoc(userRef, updates, { merge: true });
  }

  await logAuditEvent(user.uid, user.email || "", "login", {});
  const finalRole = isAdmin ? "admin" : (existingUser?.role || null);
  return { user, role: finalRole };
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return finishFederatedSignIn(result.user, result.providerId);
}

export async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

export async function signInWithApple() {
  const result = await signInWithPopup(auth, appleProvider);
  return finishFederatedSignIn(result.user, result.providerId);
}

export async function signInWithAppleRedirect() {
  await signInWithRedirect(auth, appleProvider);
}

export async function completeRedirectSignIn() {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return finishFederatedSignIn(result.user, result.providerId);
}

export const completeGoogleRedirectSignIn = completeRedirectSignIn;

export async function signOutUser() {
  const user = auth.currentUser;
  if (user) {
    await logAuditEvent(user.uid, user.email || "", "logout", {});
  }
  sessionStorage.removeItem("adminPreviewRole");
  disableLocalPreviewAuth(sessionStorage);
  disableAppReviewDemoAuth(sessionStorage);
  return firebaseSignOut(auth);
}

export async function requestAccountDeletion() {
  const user = auth.currentUser;
  if (!user) throw new Error("You need to be signed in to request account deletion.");

  const { doc, serverTimestamp, setDoc } = await import("firebase/firestore");
  const { db } = await import("./db");

  await setDoc(doc(db, "accountDeletionRequests", user.uid), {
    userId: user.uid,
    email: user.email,
    displayName: user.displayName,
    requestedAt: serverTimestamp(),
    status: "requested",
    source: "in-app",
  }, { merge: true });

  await setDoc(doc(db, "users", user.uid), {
    deletionRequestedAt: serverTimestamp(),
    deletionRequestedFrom: "in-app",
  }, { merge: true });

  await logAuditEvent(user.uid, user.email || "", "account_deletion_requested", {});
  await firebaseSignOut(auth);
}

export async function deleteCurrentFirebaseUser() {
  const user = auth.currentUser;
  if (!user) throw new Error("You need to be signed in to delete this account.");
  await deleteUser(user);
}

// Check and promote admin on every auth state change (covers page reloads, not just sign-in)
export async function ensureAdminRole(user: { uid: string; email: string | null }) {
  const isAdmin = ADMIN_EMAILS.some(
    (email) => user.email?.toLowerCase() === email.toLowerCase()
  );
  if (!isAdmin) return;

  const { doc, getDoc, setDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists() && userSnap.data().role !== "admin") {
    await setDoc(userRef, { role: "admin" }, { merge: true });
  }
}

export async function getUserRole(uid: string): Promise<string | null> {
  const { doc, getDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role || null;
  }
  return null;
}

export interface UserProfile {
  role: string | null;
  /** Training specialty — drives surgical-correlate defaults. */
  specialty: "sports-med" | "ortho" | null;
  /** Whether to show surgical / arthroscopy correlates (defaults from specialty). */
  showSurgical: boolean;
}

/** Reads role + specialty + the surgical-correlate preference in one doc read. */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  const { doc, getDoc } = await import("firebase/firestore");
  const { db } = await import("./db");
  const userSnap = await getDoc(doc(db, "users", uid));
  if (userSnap.exists()) {
    const d = userSnap.data();
    return {
      role: d.role || null,
      specialty: d.specialty ?? null,
      showSurgical: d.showSurgical ?? false,
    };
  }
  return { role: null, specialty: null, showSurgical: false };
}
