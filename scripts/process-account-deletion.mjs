import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const DEFAULT_PROJECT_ID = "ucla-knee-mri";

function readFlag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] && !process.argv[index + 1].startsWith("--")
    ? process.argv[index + 1]
    : "";
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function usage() {
  console.log(`Usage:
  node scripts/process-account-deletion.mjs --list
  node scripts/process-account-deletion.mjs --uid <firebase-uid>
  node scripts/process-account-deletion.mjs --uid <firebase-uid> --confirm --operator <admin-email>

Environment:
  GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
  FIREBASE_PROJECT_ID=ucla-knee-mri

Safety:
  Without --confirm this script only prints the actions it would take.`);
}

function initFirebaseAdmin() {
  if (getApps().length > 0) return;
  initializeApp({
    credential: applicationDefault(),
    projectId:
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      DEFAULT_PROJECT_ID,
  });
}

function formatTimestamp(value) {
  if (!value) return "not recorded";
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return String(value);
}

async function countDocumentTree(docRef) {
  const snap = await docRef.get();
  let count = snap.exists ? 1 : 0;
  const subcollections = await docRef.listCollections();
  for (const collectionRef of subcollections) {
    const childRefs = await collectionRef.listDocuments();
    for (const childRef of childRefs) {
      count += await countDocumentTree(childRef);
    }
  }
  return count;
}

async function deleteDocumentTree(docRef) {
  const subcollections = await docRef.listCollections();
  for (const collectionRef of subcollections) {
    const childRefs = await collectionRef.listDocuments();
    for (const childRef of childRefs) {
      await deleteDocumentTree(childRef);
    }
  }
  await docRef.delete();
}

async function deidentifyAuditLogs(db, uid, confirm) {
  const snap = await db.collection("auditLog").where("userId", "==", uid).get();
  if (snap.empty) return 0;
  if (!confirm) return snap.size;

  let batch = db.batch();
  let pending = 0;
  for (const doc of snap.docs) {
    batch.update(doc.ref, {
      userId: "deleted-account",
      userEmail: null,
      details: {
        retainedAfterAccountDeletion: true,
      },
      deidentifiedAt: FieldValue.serverTimestamp(),
    });
    pending += 1;
    if (pending === 450) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }
  if (pending > 0) await batch.commit();
  return snap.size;
}

async function listRequests(db) {
  const snap = await db.collection("accountDeletionRequests").get();
  const requested = snap.docs
    .map((doc) => ({ uid: doc.id, ...doc.data() }))
    .filter((request) => request.status === "requested")
    .sort((a, b) => {
      const aMs = a.requestedAt?.toMillis?.() ?? 0;
      const bMs = b.requestedAt?.toMillis?.() ?? 0;
      return aMs - bMs;
    });

  if (requested.length === 0) {
    console.log("No pending account deletion requests.");
    return;
  }

  console.log(`${requested.length} pending account deletion request(s):`);
  for (const request of requested) {
    console.log(
      `- ${request.uid} | ${request.email || "no email"} | ${formatTimestamp(request.requestedAt)}`,
    );
  }
}

async function authUserExists(uid) {
  try {
    await getAuth().getUser(uid);
    return true;
  } catch (error) {
    if (error?.code === "auth/user-not-found") return false;
    throw error;
  }
}

async function deleteAuthUser(uid) {
  try {
    await getAuth().deleteUser(uid);
    return true;
  } catch (error) {
    if (error?.code === "auth/user-not-found") return false;
    throw error;
  }
}

async function processRequest(db, uid, confirm) {
  const operator =
    readFlag("--operator") ||
    process.env.OPERATOR_EMAIL ||
    process.env.USER ||
    "admin-script";
  const requestRef = db.collection("accountDeletionRequests").doc(uid);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) {
    throw new Error(`No accountDeletionRequests/${uid} document exists.`);
  }

  const request = requestSnap.data();
  if (request.status !== "requested" && !hasFlag("--force")) {
    throw new Error(`Request ${uid} is status=${request.status}; pass --force to reprocess.`);
  }

  const userRef = db.collection("users").doc(uid);
  const userDocCount = await countDocumentTree(userRef);
  const auditLogCount = await deidentifyAuditLogs(db, uid, false);
  const hasAuthUser = await authUserExists(uid);

  console.log(`Account deletion request: ${uid}`);
  console.log(`Requested: ${formatTimestamp(request.requestedAt)}`);
  console.log(`Auth user exists: ${hasAuthUser ? "yes" : "no"}`);
  console.log(`Firestore user-tree documents to delete: ${userDocCount}`);
  console.log(`Audit log entries to de-identify: ${auditLogCount}`);

  if (!confirm) {
    console.log("\nDry run only. Re-run with --confirm after reviewing the counts above.");
    return;
  }

  const authDeleted = await deleteAuthUser(uid);
  await deleteDocumentTree(userRef);
  const auditLogsDeidentified = await deidentifyAuditLogs(db, uid, true);

  await requestRef.set(
    {
      email: null,
      displayName: null,
      fulfilledAt: FieldValue.serverTimestamp(),
      fulfilledBy: operator,
      status: "fulfilled",
      authUserDeleted: authDeleted,
      firestoreUserTreeDeleted: true,
      auditLogsDeidentified,
    },
    { merge: true },
  );

  console.log("\nAccount deletion request fulfilled and de-identified.");
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    usage();
    return;
  }

  initFirebaseAdmin();
  const db = getFirestore();
  const uid = readFlag("--uid");

  if (!uid || hasFlag("--list")) {
    await listRequests(db);
    return;
  }

  await processRequest(db, uid, hasFlag("--confirm"));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
