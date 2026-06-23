import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./firebase";

// Cloud Functions are only used for admin/certificate flows, so firebase/functions
// is split out here to keep it off the initial-load path.
export const functions = getFunctions(app);
export const sendCertificateCallable = httpsCallable(functions, "sendCertificate");
