import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import app from "./firebase";

// Firestore lives in its own module so firebase/firestore (the largest piece of
// the Firebase SDK) is only pulled into chunks that actually read/write data —
// never the login screen.
//
// Persistent IndexedDB cache: keeps the signed-in user's profile + progress
// readable across a fully-closed PWA relaunch. Without it, an offline cold-launch
// of the installed home-screen app has an empty in-memory cache, so getUserProfile's
// getDoc() rejects (client offline) and the fellow is wrongly bounced to the
// role-selection screen even though they're signed in. The multi-tab manager keeps
// two open tabs consistent.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
