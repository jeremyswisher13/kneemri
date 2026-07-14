const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

admin.initializeApp();
const db = admin.firestore();

// Gmail App Password for the sending account (jeremyswisher13@gmail.com).
// Requires 2-Step Verification on that account; generate at
// https://myaccount.google.com/apppasswords. No expiry, unlike OAuth2 tokens.
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

// --- Constants ---
const ADMIN_EMAILS = [
  "jeremyswisher13@gmail.com",
  "jeremyswisher@gmail.com",
  "jswisher@mednet.ucla.edu",
];

// Workstation plane ids mirror src/lib/firestore.ts. Plane passes are stored in
// users/{uid}/normalKnee for historical reasons, with course-prefixed ids for
// non-knee workstations.
const NORMAL_PLANE_IDS_BY_COURSE = {
  "knee-mri": ["sag-pdfs", "cor-pdfs", "axi-t2fs", "sag-t1"],
  "shoulder-mri": ["sh-sag-t2fs", "sh-cor-t2fs", "sh-axi-t2fs", "sh-sag-t1"],
  "hip-mri": ["hip-cor-t2fs", "hip-axi", "hip-sag"],
  "elbow-mri": ["elbow-cor-t2fs", "elbow-axi-t2fs", "elbow-sag-ir"],
};

// Escape user-controlled text (displayName, email, name) before embedding it in
// any HTML email body, so a learner cannot inject markup/script into the admin's
// or a learner's inbox (stored HTML injection). Email SUBJECTS are plaintext and
// are not escaped here.
const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const MODULE_COUNT = 9;
const REQUIRED_CORE_CASE_COUNT = 3;

// Eligible core-case IDs per role. Completion requires any three from the
// relevant pool; keep the pools in sync with src/content/case-metas.ts.
const FELLOW_REQUIRED_CASE_IDS = [
  "degenerative-knee-oa",
  "acl-pivot-shift",
  "patellar-dislocation-mpfl",
  "medial-root-tear",
  "pcl-plc-dashboard",
  "bucket-handle",
  "ocd-stability",
  "mcl-distal-avulsion",
];
const RESIDENT_REQUIRED_CASE_IDS = [
  "degenerative-knee-oa",
  "acl-pivot-shift",
  "patellar-dislocation-mpfl",
  "bucket-handle",
  "mcl-distal-avulsion",
];

// Shoulder eligible core cases (all core cases are resident-visible, so the
// fellow and resident lists are identical). Must stay in sync with
// src/content/shoulder/cases.ts (tier: "core").
const SHOULDER_REQUIRED_CASE_IDS = [
  "shoulder-cuff-tendinosis-bursitis",
  "shoulder-acute-full-thickness-cuff-tear",
  "shoulder-anterior-instability-bankart",
  "shoulder-slap-biceps-anchor",
  "shoulder-adhesive-capsulitis",
  "shoulder-subscapularis-biceps-hidden-lesion",
];

// Hip eligible core cases (all core cases are resident-visible, so the fellow and
// resident lists are identical). Must stay in sync with src/content/hip/cases.ts
// (tier: "core").
const HIP_REQUIRED_CASE_IDS = [
  "hip-cam-fai-labral-tear",
  "hip-femoral-neck-stress-fracture",
  "hip-avn-femoral-head",
  "hip-gluteus-medius-tear-gtps",
  "hip-proximal-hamstring-avulsion",
  "hip-athletic-pubalgia",
];

// Elbow eligible core cases. The two nerve cases (medial-epicondylitis-ulnar,
// cubital-tunnel) are NOT resident-visible, so the resident pool is the five
// resident-visible core cases. Sync with
// src/content/elbow/cases.ts (tier: "core", residentVisible).
const ELBOW_FELLOW_REQUIRED_CASE_IDS = [
  "elbow-ucl-tear-thrower",
  "elbow-capitellar-ocd",
  "elbow-distal-biceps-tear",
  "elbow-lateral-epicondylitis-lucl",
  "elbow-medial-epicondylitis-ulnar",
  "elbow-cubital-tunnel-ulnar-neuritis",
  "elbow-occult-radial-head-fracture",
];
const ELBOW_RESIDENT_REQUIRED_CASE_IDS = [
  "elbow-ucl-tear-thrower",
  "elbow-capitellar-ocd",
  "elbow-distal-biceps-tear",
  "elbow-lateral-epicondylitis-lucl",
  "elbow-occult-radial-head-fracture",
];

// Per-course certificate/completion configuration. Each course tracks its own
// `sentField` so completing one course never blocks the other's certificate.
const COURSE_CONFIG = {
  "knee-mri": {
    label: "Knee MRI",
    moduleCount: MODULE_COUNT,          // 9
    quizTotal: 14,                      // matched parallel pre/post form size
    normalPlaneIds: NORMAL_PLANE_IDS_BY_COURSE["knee-mri"],
    fellowCaseIds: FELLOW_REQUIRED_CASE_IDS,
    residentCaseIds: RESIDENT_REQUIRED_CASE_IDS,
    courseTitle: "UCLA Knee MRI Interpretation Course",
    fileSlug: "UCLA_Knee_MRI",
    trackText: (isResident) => isResident ? "Knee MRI Fundamentals — Resident Track" : "for Sports Medicine Fellows",
    footerText: (isResident) => isResident
      ? "UCLA Division of Sports Medicine  |  Knee MRI Fundamentals for Resident Physicians"
      : "UCLA Division of Sports Medicine  |  Knee MRI Interpretation Course for Sports Medicine Fellows",
    emailTrack: (isResident) => isResident ? "Resident Track" : "Sports Medicine Fellow Track",
    sentField: "certificateSent",
    sentAtField: "certificateSentAt",
  },
  "shoulder-mri": {
    label: "Shoulder MRI",
    moduleCount: 6,
    quizTotal: 11,
    normalPlaneIds: NORMAL_PLANE_IDS_BY_COURSE["shoulder-mri"],
    fellowCaseIds: SHOULDER_REQUIRED_CASE_IDS,
    residentCaseIds: SHOULDER_REQUIRED_CASE_IDS,
    courseTitle: "UCLA Shoulder MRI for Primary Care Sports Medicine",
    fileSlug: "UCLA_Shoulder_MRI",
    trackText: (isResident) => isResident ? "Shoulder MRI Fundamentals — Resident Track" : "for Primary Care Sports Medicine Fellows",
    footerText: (isResident) => isResident
      ? "UCLA Division of Sports Medicine  |  Shoulder MRI Fundamentals for Resident Physicians"
      : "UCLA Division of Sports Medicine  |  Shoulder MRI for Primary Care Sports Medicine",
    emailTrack: (isResident) => isResident ? "Resident Track" : "Primary Care Sports Medicine Track",
    sentField: "certificateSentShoulder",
    sentAtField: "certificateSentAtShoulder",
  },
  "hip-mri": {
    label: "Hip MRI",
    moduleCount: 8,
    quizTotal: 12,
    normalPlaneIds: NORMAL_PLANE_IDS_BY_COURSE["hip-mri"],
    fellowCaseIds: HIP_REQUIRED_CASE_IDS,
    residentCaseIds: HIP_REQUIRED_CASE_IDS,
    courseTitle: "UCLA Hip MRI for Primary Care Sports Medicine",
    fileSlug: "UCLA_Hip_MRI",
    trackText: (isResident) => isResident ? "Hip MRI Fundamentals — Resident Track" : "for Primary Care Sports Medicine Fellows",
    footerText: (isResident) => isResident
      ? "UCLA Division of Sports Medicine  |  Hip MRI Fundamentals for Resident Physicians"
      : "UCLA Division of Sports Medicine  |  Hip MRI for Primary Care Sports Medicine",
    emailTrack: (isResident) => isResident ? "Resident Track" : "Primary Care Sports Medicine Track",
    sentField: "certificateSentHip",
    sentAtField: "certificateSentAtHip",
  },
  "elbow-mri": {
    label: "Elbow MRI",
    moduleCount: 8,
    quizTotal: 12,
    normalPlaneIds: NORMAL_PLANE_IDS_BY_COURSE["elbow-mri"],
    fellowCaseIds: ELBOW_FELLOW_REQUIRED_CASE_IDS,
    residentCaseIds: ELBOW_RESIDENT_REQUIRED_CASE_IDS,
    courseTitle: "UCLA Elbow MRI for Primary Care Sports Medicine",
    fileSlug: "UCLA_Elbow_MRI",
    trackText: (isResident) => isResident ? "Elbow MRI Fundamentals — Resident Track" : "for Primary Care Sports Medicine Fellows",
    footerText: (isResident) => isResident
      ? "UCLA Division of Sports Medicine  |  Elbow MRI Fundamentals for Resident Physicians"
      : "UCLA Division of Sports Medicine  |  Elbow MRI for Primary Care Sports Medicine",
    emailTrack: (isResident) => isResident ? "Resident Track" : "Primary Care Sports Medicine Track",
    sentField: "certificateSentElbow",
    sentAtField: "certificateSentAtElbow",
  },
};

// Minimum post-assessment score (rounded percent) required before a certificate
// is generated. Keep in sync with CERTIFICATE_PASS_THRESHOLD in src/lib/completion.ts.
const CERTIFICATE_PASS_THRESHOLD = 70;

// Certificates are ADMIN-ONLY for now: the course director sends them manually via
// the "Send Cert" button (the sendCertificate callable). The automatic
// onCourseCompletion trigger that emails a learner the instant they finish is held
// off behind this flag. Flip to true to re-enable fully-automatic certificate emails.
const AUTO_SEND_CERTIFICATES = false;

function postScorePercent(postData, course) {
  return Math.round(((postData.score || 0) / (postData.totalQuestions || course.quizTotal)) * 100);
}

// Sort quiz-attempt docs newest-first by completedAt — Firestore returns an
// unordered query result, and the client picks the most recent attempt, so the
// functions must too (a stale attempt would print the wrong cert/digest score).
function newestFirst(docs) {
  return [...docs].sort(
    (a, b) => (b.data().completedAt?.toMillis?.() ?? 0) - (a.data().completedAt?.toMillis?.() ?? 0),
  );
}

async function normalMriComplete(userId, course) {
  const planeIds = course.normalPlaneIds || [];
  if (planeIds.length === 0) return true;
  const snap = await db.collection("users").doc(userId).collection("normalKnee").get();
  const passed = new Set(snap.docs.filter((d) => d.data().passed === true).map((d) => d.id));
  return planeIds.every((id) => passed.has(id));
}

// Single completion predicate so the certificate trigger and weekly digest stay
// aligned with src/lib/completion.ts: baseline quiz + survey, Normal MRI mastery,
// all modules, any three role-visible core cases, and post quiz + survey with a
// passing knowledge score.
function meetsCompletion({
  course,
  modulesCompleted,
  uniqueCases,
  requiredCaseIds,
  normalDone,
  preAssessmentDone,
  postAssessmentDone,
  postPct,
}) {
  const modulesDone = modulesCompleted >= course.moduleCount;
  const requiredCount = Math.min(REQUIRED_CORE_CASE_COUNT, requiredCaseIds.length);
  const casesDone = requiredCaseIds.filter((id) => uniqueCases.has(id)).length >= requiredCount;
  const normalOk = normalDone;
  const scorePass = postPct != null && postPct >= CERTIFICATE_PASS_THRESHOLD;
  return preAssessmentDone && normalOk && modulesDone && casesDone && postAssessmentDone && scorePass;
}

function resolveCourse(courseId) {
  return COURSE_CONFIG[courseId] || COURSE_CONFIG["knee-mri"];
}

// UCLA colors
const UCLA_BLUE = rgb(0.153, 0.455, 0.682);    // #2774AE
const UCLA_DARK = rgb(0, 0.231, 0.361);         // #003B5C
const UCLA_GOLD = rgb(1, 0.82, 0);              // #FFD100
const GRAY_400 = rgb(0.612, 0.639, 0.686);      // #9CA3AF
const GRAY_600 = rgb(0.294, 0.333, 0.388);      // #4B5563
const GRAY_900 = rgb(0.067, 0.094, 0.153);      // #111827
const GREEN_600 = rgb(0.02, 0.588, 0.412);      // #059669
const WHITE = rgb(1, 1, 1);

// --- Gmail transporter ---
function createTransporter(appPassword) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jeremyswisher13@gmail.com",
      pass: appPassword,
    },
  });
}

// --- PDF Certificate Generator (server-side, using pdf-lib) ---
async function generateCertificatePdf({
  fellowName,
  completionDate,
  modulesCount,
  casesCount,
  preScore,
  postScore,
  preTotal,
  postTotal,
  courseTitle,
  trackText,
  footerText,
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size in points
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const W = 612;
  const H = 792;
  const CX = W / 2;

  // Gold decorative border
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: UCLA_GOLD, borderWidth: 4 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: UCLA_GOLD, borderWidth: 1.5 });

  // Blue header bar
  page.drawRectangle({ x: 32, y: H - 122, width: W - 64, height: 90, color: UCLA_BLUE });

  // Header text
  const uniText = "UNIVERSITY OF CALIFORNIA, LOS ANGELES";
  const uniW = helvetica.widthOfTextAtSize(uniText, 11);
  page.drawText(uniText, { x: CX - uniW / 2, y: H - 74, size: 11, font: helvetica, color: WHITE });

  const certText = "Certificate of Completion";
  const certW = helveticaBold.widthOfTextAtSize(certText, 24);
  page.drawText(certText, { x: CX - certW / 2, y: H - 108, size: 24, font: helveticaBold, color: WHITE });

  // Gold seal circle
  const sealY = H - 172;
  page.drawCircle({ x: CX, y: sealY, size: 28, borderColor: UCLA_GOLD, borderWidth: 3, color: rgb(1, 0.976, 0.878) });
  // Star (simplified for server-side)
  page.drawCircle({ x: CX, y: sealY, size: 12, color: UCLA_GOLD });

  // "This certifies that"
  let y = H - 224;
  const certifiesText = "This certifies that";
  const certifiesW = helvetica.widthOfTextAtSize(certifiesText, 12);
  page.drawText(certifiesText, { x: CX - certifiesW / 2, y, size: 12, font: helvetica, color: GRAY_400 });

  // Fellow name
  y -= 32;
  const nameW = helveticaBold.widthOfTextAtSize(fellowName, 26);
  page.drawText(fellowName, { x: CX - nameW / 2, y, size: 26, font: helveticaBold, color: UCLA_DARK });
  // Gold underline
  page.drawLine({
    start: { x: CX - nameW / 2, y: y - 6 },
    end: { x: CX + nameW / 2, y: y - 6 },
    color: UCLA_GOLD,
    thickness: 1.5,
  });

  // Description
  y -= 36;
  const desc1 = "has successfully completed the";
  const desc1W = helvetica.widthOfTextAtSize(desc1, 12);
  page.drawText(desc1, { x: CX - desc1W / 2, y, size: 12, font: helvetica, color: GRAY_600 });

  y -= 26;
  const courseTitleW = helveticaBold.widthOfTextAtSize(courseTitle, 18);
  page.drawText(courseTitle, { x: CX - courseTitleW / 2, y, size: 18, font: helveticaBold, color: GRAY_900 });

  y -= 22;
  const trackW = helvetica.widthOfTextAtSize(trackText, 12);
  page.drawText(trackText, { x: CX - trackW / 2, y, size: 12, font: helvetica, color: GRAY_600 });

  // Course stats
  y -= 44;
  const statsText = `${modulesCount} modules completed  |  ${casesCount} case studies reviewed  |  Pre & Post assessments`;
  const statsW = helvetica.widthOfTextAtSize(statsText, 10);
  page.drawText(statsText, { x: CX - statsW / 2, y, size: 10, font: helvetica, color: GRAY_400 });

  // Score boxes
  y -= 36;
  const boxW = 130;
  const boxH = 64;
  const gap = 20;
  const prePercent = preTotal > 0 ? Math.round((preScore / preTotal) * 100) : 0;
  const postPercent = postTotal > 0 ? Math.round((postScore / postTotal) * 100) : 0;
  const improvement = postPercent - prePercent;

  const x1 = CX - boxW - gap / 2 - boxW / 2;
  const x2 = CX - boxW / 2;
  const x3 = CX + gap / 2 + boxW / 2;

  drawScoreBox(page, helvetica, helveticaBold, x1, y, boxW, boxH, "Pre-Assessment", `${prePercent}%`, GRAY_600);
  drawScoreBox(page, helvetica, helveticaBold, x2, y, boxW, boxH, "Post-Assessment", `${postPercent}%`, UCLA_BLUE);
  const impColor = improvement > 0 ? GREEN_600 : improvement < 0 ? rgb(0.863, 0.149, 0.149) : GRAY_600;
  const impText = `${improvement > 0 ? "+" : ""}${improvement}%`;
  drawScoreBox(page, helvetica, helveticaBold, x3, y, boxW, boxH, "Improvement", impText, impColor);

  // Signature lines
  y -= boxH + 60;

  // Left: Date
  page.drawLine({ start: { x: CX - 200, y }, end: { x: CX - 200 + 180, y }, color: GRAY_400, thickness: 0.75 });
  page.drawText(completionDate, { x: CX - 200, y: y - 16, size: 11, font: helveticaBold, color: GRAY_900 });
  page.drawText("Date of Completion", { x: CX - 200, y: y - 30, size: 9, font: helvetica, color: GRAY_400 });

  // Right: Course Director
  page.drawLine({ start: { x: CX + 20, y }, end: { x: CX + 200, y }, color: GRAY_400, thickness: 0.75 });
  page.drawText("Jeremy Swisher, MD", { x: CX + 20, y: y - 16, size: 11, font: helveticaBold, color: GRAY_900 });
  page.drawText("Course Director", { x: CX + 20, y: y - 30, size: 9, font: helvetica, color: GRAY_400 });

  // Footer
  page.drawLine({ start: { x: 48, y: 52 }, end: { x: W - 48, y: 52 }, color: UCLA_GOLD, thickness: 1 });
  const footerW = helvetica.widthOfTextAtSize(footerText, 8);
  page.drawText(footerText, { x: CX - footerW / 2, y: 36, size: 8, font: helvetica, color: GRAY_400 });

  return await pdfDoc.save();
}

function drawScoreBox(page, helvetica, helveticaBold, x, y, w, h, label, value, color) {
  page.drawRectangle({
    x, y: y - h, width: w, height: h,
    color: rgb(0.976, 0.98, 0.984),
    borderColor: rgb(0.898, 0.906, 0.922),
    borderWidth: 0.75,
  });
  const labelW = helvetica.widthOfTextAtSize(label, 9);
  page.drawText(label, { x: x + w / 2 - labelW / 2, y: y - 18, size: 9, font: helvetica, color: GRAY_400 });
  const valueW = helveticaBold.widthOfTextAtSize(value, 22);
  page.drawText(value, { x: x + w / 2 - valueW / 2, y: y - 46, size: 22, font: helveticaBold, color });
}

// --- Send certificate email ---
async function sendCertificateEmail(transporter, recipientEmail, recipientName, pdfBytes, courseTitle, trackName, fileSlug) {
  const mailOptions = {
    from: `"UCLA Sports Medicine MRI Course" <jeremyswisher13@gmail.com>`,
    to: recipientEmail,
    subject: `Congratulations! Your ${courseTitle} Certificate of Completion`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2774AE; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${courseTitle}</h1>
        </div>
        <div style="padding: 32px 24px; background-color: #f9fafb;">
          <h2 style="color: #003B5C; margin-top: 0;">Congratulations, ${escapeHtml(recipientName)}!</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            You have successfully completed the <strong>${courseTitle}</strong> (${trackName}).
          </p>
          <p style="color: #4B5563; line-height: 1.6;">
            Your certificate of completion is attached to this email as a PDF. You can also download it anytime from the course app.
          </p>
          <p style="color: #4B5563; line-height: 1.6;">
            Keep up the excellent work in developing your MRI interpretation skills!
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">
            UCLA Division of Sports Medicine<br/>
            Jeremy Swisher, MD — Course Director
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `${fileSlug}_Certificate_${recipientName.replace(/\s+/g, "_")}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

// ============================================================
// CLOUD FUNCTION 1: Auto-send certificate on course completion
// (Held off — certificates are admin-only; see AUTO_SEND_CERTIFICATES.)
// ============================================================
exports.onCourseCompletion = onDocumentWritten(
  {
    // The post survey is the final learner action, after the post quiz. Triggering
    // here lets the full quiz + survey completion contract be verified atomically.
    document: "users/{userId}/surveyResponses/{responseId}",
    secrets: [GMAIL_APP_PASSWORD],
  },
  async (event) => {
    // Certificates are admin-only for now — no automatic learner emails.
    if (!AUTO_SEND_CERTIFICATES) return;

    const data = event.data?.after?.data();
    if (!data || data.surveyType !== "post") return;

    // Resolve the course for this post survey. Responses written before multi-course
    // support have no courseId and are knee by definition.
    const courseId = data.courseId || "knee-mri";
    const course = resolveCourse(courseId);

    const userId = event.params.userId;

    // Check if THIS course's certificate was already sent (per-course flag, so
    // completing knee never blocks the shoulder certificate and vice versa).
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return;
    const userData = userSnap.data();
    if (userData[course.sentField]) return;

    // Verify course completion
    const role = userData.role;
    const isResident = role === "resident";
    const requiredCaseIds = isResident ? course.residentCaseIds : course.fellowCaseIds;
    const belongsToCourse = (d) => (d.data().courseId || "knee-mri") === courseId;

    // Gather completion inputs (modules, cases, both assessment phases, and the
    // normal MRI workstation).
    const moduleSnap = await db.collection("users").doc(userId).collection("moduleProgress").get();
    const modulesCompleted = moduleSnap.docs.filter((d) => d.data().completed && belongsToCourse(d)).length;

    const caseSnap = await db.collection("users").doc(userId).collection("caseAttempts").get();
    const uniqueCases = new Set(caseSnap.docs.filter(belongsToCourse).map((d) => d.data().caseId));

    // Both knowledge quizzes and the baseline confidence survey must exist for
    // this course. The triggering document is the post confidence survey.
    const preQuiz = await db.collection("users").doc(userId).collection("quizAttempts")
      .where("quizType", "==", "pre").get();
    const postQuiz = await db.collection("users").doc(userId).collection("quizAttempts")
      .where("quizType", "==", "post").get();
    const preSurvey = await db.collection("users").doc(userId).collection("surveyResponses")
      .where("surveyType", "==", "pre").get();
    const preDoc = newestFirst(preQuiz.docs).find((d) => (d.data().courseId || "knee-mri") === courseId);
    const postDoc = newestFirst(postQuiz.docs).find((d) => (d.data().courseId || "knee-mri") === courseId);
    const preSurveyDoc = newestFirst(preSurvey.docs).find((d) => (d.data().courseId || "knee-mri") === courseId);
    if (!preDoc || !postDoc || !preSurveyDoc) return;

    const preData = preDoc.data();
    const postData = postDoc.data();
    const postPct = postScorePercent(postData, course);
    const normalDone = await normalMriComplete(userId, course);

    // Single shared completion predicate — keeps this in lockstep with
    // src/lib/completion.ts (all courses require the same three-case milestone,
    // their normal MRI workstation, and a post-assessment score >=70%).
    if (!meetsCompletion({
      course,
      modulesCompleted,
      uniqueCases,
      requiredCaseIds,
      normalDone,
      preAssessmentDone: true,
      postAssessmentDone: true,
      postPct,
    })) {
      console.log(`${course.label} not yet complete or below ${CERTIFICATE_PASS_THRESHOLD}% — certificate not sent (${userId}, post ${postPct}%)`);
      return;
    }

    const casesCount = requiredCaseIds.filter((id) => uniqueCases.has(id)).length;

    // Generate PDF
    const pdfBytes = await generateCertificatePdf({
      fellowName: userData.displayName || userData.email,
      completionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      modulesCount: course.moduleCount,
      casesCount,
      preScore: preData.score || 0,
      postScore: postData.score || 0,
      preTotal: preData.totalQuestions || course.quizTotal,
      postTotal: postData.totalQuestions || course.quizTotal,
      courseTitle: course.courseTitle,
      trackText: course.trackText(isResident),
      footerText: course.footerText(isResident),
    });

    // Send email
    const transporter = createTransporter(GMAIL_APP_PASSWORD.value());

    await sendCertificateEmail(
      transporter,
      userData.email,
      userData.displayName || userData.email,
      pdfBytes,
      course.courseTitle,
      course.emailTrack(isResident),
      course.fileSlug
    );

    // Mark this course's certificate as sent
    await userRef.update({
      [course.sentField]: true,
      [course.sentAtField]: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Notify admin
    await transporter.sendMail({
      from: `"UCLA Sports Medicine MRI Course" <jeremyswisher13@gmail.com>`,
      to: "jeremyswisher13@gmail.com",
      subject: `${userData.displayName || userData.email} completed the ${course.label} course`,
      html: `<p><strong>${escapeHtml(userData.displayName)}</strong> (${escapeHtml(userData.email)}) just completed the ${isResident ? "Resident" : "Fellow"} track of the ${course.label} course and received their certificate.</p>
             <p>Pre: ${preData.score}/${preData.totalQuestions} → Post: ${postData.score}/${postData.totalQuestions}</p>`,
    });

    // Avoid logging learner PII (email) to Cloud Functions logs.
    console.log(`${course.label} certificate sent`);
  }
);

// ============================================================
// CLOUD FUNCTION 2: Admin-triggered certificate send
// ============================================================
exports.sendCertificate = onCall(
  { secrets: [GMAIL_APP_PASSWORD] },
  async (request) => {
    // Verify caller is admin
    const callerUid = request.auth?.uid;
    if (!callerUid) throw new HttpsError("unauthenticated", "Must be signed in");
    const callerSnap = await db.collection("users").doc(callerUid).get();
    if (!callerSnap.exists || callerSnap.data().role !== "admin") {
      throw new HttpsError("permission-denied", "Admin only");
    }

    const { userId, courseId, force } = request.data;
    if (!userId) throw new HttpsError("invalid-argument", "userId required");

    const cid = courseId || "knee-mri";
    const course = resolveCourse(cid);
    const belongsToCourse = (d) => (d.data().courseId || "knee-mri") === cid;

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) throw new HttpsError("not-found", "User not found");
    const userData = userSnap.data();

    // Idempotency: don't silently resend a certificate that already went out
    // (an admin can still force a deliberate resend).
    if (!force && userData[course.sentField]) {
      throw new HttpsError("already-exists", "Certificate already sent for this course — use “Send anyway” to resend.");
    }

    const isResident = userData.role === "resident";
    const requiredCaseIds = isResident ? course.residentCaseIds : course.fellowCaseIds;

    // Get progress data, scoped to this course
    const moduleSnap = await db.collection("users").doc(userId).collection("moduleProgress").get();
    const modulesCompleted = moduleSnap.docs.filter((d) => d.data().completed && belongsToCourse(d)).length;

    const caseSnap = await db.collection("users").doc(userId).collection("caseAttempts").get();
    const uniqueCases = new Set(caseSnap.docs.filter(belongsToCourse).map((d) => d.data().caseId));
    const casesCompleted = requiredCaseIds.filter((id) => uniqueCases.has(id)).length;

    const preQuiz = await db.collection("users").doc(userId).collection("quizAttempts")
      .where("quizType", "==", "pre").get();
    const postQuiz = await db.collection("users").doc(userId).collection("quizAttempts")
      .where("quizType", "==", "post").get();
    const surveySnap = await db.collection("users").doc(userId).collection("surveyResponses").get();

    const preDoc = newestFirst(preQuiz.docs).find(belongsToCourse);
    const postDoc = newestFirst(postQuiz.docs).find(belongsToCourse);
    const preSurveyDoc = newestFirst(surveySnap.docs.filter((d) => d.data().surveyType === "pre"))
      .find(belongsToCourse);
    const postSurveyDoc = newestFirst(surveySnap.docs.filter((d) => d.data().surveyType === "post"))
      .find(belongsToCourse);
    const preData = preDoc ? preDoc.data() : { score: 0, totalQuestions: course.quizTotal };
    const postData = postDoc ? postDoc.data() : { score: 0, totalQuestions: course.quizTotal };

    // Full completion gate — the SAME predicate as the automatic path and
    // src/lib/completion.ts, so an admin send cannot certify a learner who passed
    // the post-quiz but skipped the required modules / cases / workstation. An
    // explicit `force` lets an admin deliberately override (e.g. an out-of-band
    // completion); the override is recorded in the admin notification email below.
    const postPct = postScorePercent(postData, course);
    const normalDone = await normalMriComplete(userId, course);
    const preAssessmentDone = !!preDoc && !!preSurveyDoc;
    const postAssessmentDone = !!postDoc && !!postSurveyDoc;
    if (!force && !meetsCompletion({
      course,
      modulesCompleted,
      uniqueCases,
      requiredCaseIds,
      normalDone,
      preAssessmentDone,
      postAssessmentDone,
      postPct,
    })) {
      const missing = [];
      if (!preDoc) missing.push("baseline knowledge quiz");
      if (!preSurveyDoc) missing.push("baseline confidence survey");
      if (!postDoc) {
        missing.push("post-assessment knowledge quiz");
      } else if (postPct == null || postPct < CERTIFICATE_PASS_THRESHOLD) {
        missing.push(`post-assessment ${postPct ?? 0}% (need ${CERTIFICATE_PASS_THRESHOLD}%)`);
      }
      if (!postSurveyDoc) missing.push("post-course confidence survey");
      if (modulesCompleted < course.moduleCount) {
        missing.push(`modules ${modulesCompleted}/${course.moduleCount}`);
      }
      const doneCases = requiredCaseIds.filter((id) => uniqueCases.has(id)).length;
      const requiredCases = Math.min(REQUIRED_CORE_CASE_COUNT, requiredCaseIds.length);
      if (doneCases < requiredCases) missing.push(`cases ${doneCases}/${requiredCases}`);
      if (!normalDone) {
        missing.push(`Interactive Normal ${course.label} workstation`);
      }
      throw new HttpsError(
        "failed-precondition",
        `${userData.displayName || userData.email} hasn't completed all requirements (${missing.join("; ")}). Use “Send anyway” to override.`,
      );
    }

    const pdfBytes = await generateCertificatePdf({
      fellowName: userData.displayName || userData.email,
      completionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      modulesCount: modulesCompleted,
      casesCount: casesCompleted,
      preScore: preData.score || 0,
      postScore: postData.score || 0,
      preTotal: preData.totalQuestions || course.quizTotal,
      postTotal: postData.totalQuestions || course.quizTotal,
      courseTitle: course.courseTitle,
      trackText: course.trackText(isResident),
      footerText: course.footerText(isResident),
    });

    const transporter = createTransporter(GMAIL_APP_PASSWORD.value());

    await sendCertificateEmail(
      transporter,
      userData.email,
      userData.displayName || userData.email,
      pdfBytes,
      course.courseTitle,
      course.emailTrack(isResident),
      course.fileSlug
    );

    await userRef.update({
      [course.sentField]: true,
      [course.sentAtField]: admin.firestore.FieldValue.serverTimestamp(),
      // Audit trail: if this send overrode an incomplete completion gate, record
      // that it was forced and which admin did it.
      ...(force
        ? {
            [`${course.sentField}Forced`]: true,
            [`${course.sentField}ForcedBy`]: callerSnap.data().email || callerUid,
          }
        : {}),
    });

    return { success: true, email: userData.email };
  }
);

// ============================================================
// CLOUD FUNCTION 3: Server-side analytics tracking
// ============================================================
exports.trackAnalytics = onDocumentWritten(
  { document: "users/{userId}/{subcollection}/{docId}" },
  async (event) => {
    const userId = event.params.userId;
    const subcollection = event.params.subcollection;
    const data = event.data?.after?.data();

    if (!data) return; // Deletion

    const userRef = db.collection("users").doc(userId);
    const analyticsRef = db.collection("analytics").doc("aggregate");

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Track individual event
    await db.collection("analytics").doc("events").collection("log").add({
      userId,
      type: subcollection,
      action: event.data?.before?.exists ? "update" : "create",
      timestamp,
      metadata: getEventMetadata(subcollection, data),
    });

    // Update user's last active
    await userRef.update({ lastActive: timestamp }).catch(() => {});

    // Update aggregate stats
    const batch = db.batch();

    if (subcollection === "quizAttempts" && data.quizType) {
      // Track quiz scores. Use atomic increments (not read-then-add) so concurrent
      // submissions don't clobber each other, and namespace the key by courseId so
      // knee and shoulder assessments (both lacking a moduleId) don't share a bucket.
      const quizStatsRef = db.collection("analytics").doc("quizStats");
      const key = `${data.courseId || "knee-mri"}_${data.quizType}_${data.moduleId || "assessment"}`;
      batch.set(quizStatsRef, {
        [key]: {
          totalAttempts: admin.firestore.FieldValue.increment(1),
          totalScore: admin.firestore.FieldValue.increment(data.score || 0),
          totalQuestions: admin.firestore.FieldValue.increment(data.totalQuestions || 0),
          lastUpdated: new Date().toISOString(),
        },
      }, { merge: true });
    }

    // Count a module completion only on a genuine not-completed -> completed
    // transition; completeModule rewrites the same doc on every quiz retake, which
    // would otherwise inflate the completions counter on each retake.
    const wasCompleted = event.data?.before?.exists && event.data.before.data()?.completed === true;
    if (subcollection === "moduleProgress" && data.completed && !wasCompleted) {
      // Track module completion
      const moduleStatsRef = db.collection("analytics").doc("moduleStats");
      batch.set(moduleStatsRef, {
        [data.moduleId || event.params.docId]: {
          completions: admin.firestore.FieldValue.increment(1),
          lastCompleted: new Date().toISOString(),
        },
      }, { merge: true });
    }

    if (subcollection === "caseAttempts") {
      // Track case completion
      const caseStatsRef = db.collection("analytics").doc("caseStats");
      batch.set(caseStatsRef, {
        [data.caseId || event.params.docId]: {
          attempts: admin.firestore.FieldValue.increment(1),
          lastAttempted: new Date().toISOString(),
        },
      }, { merge: true });
    }

    await batch.commit();
  }
);

function getEventMetadata(subcollection, data) {
  switch (subcollection) {
    case "quizAttempts":
      return { quizType: data.quizType, moduleId: data.moduleId, score: data.score, total: data.totalQuestions };
    case "moduleProgress":
      return { moduleId: data.moduleId, completed: data.completed };
    case "caseAttempts":
      return { caseId: data.caseId };
    case "reviewCards":
      return { questionId: data.questionId, repetitions: data.repetitions };
    default:
      return {};
  }
}

// ============================================================
// CLOUD FUNCTION 4: Weekly analytics digest (runs Monday 8am PT)
// ============================================================
exports.weeklyDigest = onSchedule(
  {
    schedule: "every monday 08:00",
    timeZone: "America/Los_Angeles",
    secrets: [GMAIL_APP_PASSWORD],
  },
  async () => {
    // Get all users
    const usersSnap = await db.collection("users").get();
    const fellows = [];
    const residents = [];

    for (const userDoc of usersSnap.docs) {
      const data = userDoc.data();
      if (data.role === "admin") continue;

      // This digest is the KNEE course report, so count knee progress only.
      // (Docs written before multi-course support have no courseId = knee.)
      const isKnee = (d) => (d.data().courseId || "knee-mri") === "knee-mri";
      const moduleSnap = await db.collection("users").doc(userDoc.id).collection("moduleProgress").get();
      const caseSnap = await db.collection("users").doc(userDoc.id).collection("caseAttempts").get();
      const modulesCompleted = moduleSnap.docs.filter((d) => d.data().completed && isKnee(d)).length;
      const eligibleCaseIds = data.role === "resident" ? RESIDENT_REQUIRED_CASE_IDS : FELLOW_REQUIRED_CASE_IDS;
      const completedCaseIds = new Set(caseSnap.docs.filter(isKnee).map((d) => d.data().caseId));
      const casesCompleted = eligibleCaseIds.filter((id) => completedCaseIds.has(id)).length;

      // "Complete" mirrors the certificate definition in src/lib/completion.ts.
      const normalDone = await normalMriComplete(userDoc.id, COURSE_CONFIG["knee-mri"]);
      const quizSnap = await db.collection("users").doc(userDoc.id).collection("quizAttempts").get();
      const surveySnap = await db.collection("users").doc(userDoc.id).collection("surveyResponses").get();
      const preDoc = newestFirst(quizSnap.docs.filter((d) => d.data().quizType === "pre")).find(isKnee);
      const postDoc = newestFirst(quizSnap.docs.filter((d) => d.data().quizType === "post")).find(isKnee);
      const preSurveyDoc = newestFirst(surveySnap.docs.filter((d) => d.data().surveyType === "pre"))
        .find(isKnee);
      const postSurveyDoc = newestFirst(surveySnap.docs.filter((d) => d.data().surveyType === "post"))
        .find(isKnee);
      const postPct = postDoc ? postScorePercent(postDoc.data(), COURSE_CONFIG["knee-mri"]) : null;
      const courseComplete = meetsCompletion({
        course: COURSE_CONFIG["knee-mri"],
        modulesCompleted,
        uniqueCases: completedCaseIds,
        requiredCaseIds: eligibleCaseIds,
        normalDone,
        preAssessmentDone: !!preDoc && !!preSurveyDoc,
        postAssessmentDone: !!postDoc && !!postSurveyDoc,
        postPct,
      });

      const lastActive = data.lastActive?.toDate?.() || null;
      const daysSinceActive = lastActive
        ? Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const entry = {
        name: data.displayName || data.email,
        email: data.email,
        modulesCompleted,
        casesCompleted,
        lastActive: lastActive ? lastActive.toLocaleDateString() : "Never",
        daysSinceActive,
        courseComplete,
      };

      if (data.role === "resident") residents.push(entry);
      else fellows.push(entry);
    }

    // Build email
    const buildTable = (users, label) => {
      if (users.length === 0) return `<p>No ${label}s enrolled.</p>`;
      return `
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr style="background:#2774AE;color:white;">
            <th style="padding:8px;text-align:left;">Name</th>
            <th style="padding:8px;text-align:center;">Modules</th>
            <th style="padding:8px;text-align:center;">Cases</th>
            <th style="padding:8px;text-align:center;">Last Active</th>
            <th style="padding:8px;text-align:center;">Status</th>
          </tr>
          ${users.map((u) => `
            <tr style="border-bottom:1px solid #E5E7EB;${u.daysSinceActive > 7 ? "background:#FEF2F2;" : ""}">
              <td style="padding:8px;">${escapeHtml(u.name)}</td>
              <td style="padding:8px;text-align:center;">${u.modulesCompleted}/${MODULE_COUNT}</td>
              <td style="padding:8px;text-align:center;">${u.casesCompleted}</td>
              <td style="padding:8px;text-align:center;">${u.lastActive}${u.daysSinceActive > 7 ? " ⚠️" : ""}</td>
              <td style="padding:8px;text-align:center;">${u.courseComplete ? "✅ Complete" : "In Progress"}</td>
            </tr>
          `).join("")}
        </table>
      `;
    };

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
        <div style="background:#2774AE;padding:20px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:18px;">UCLA Knee MRI Course — Weekly Report</h1>
        </div>
        <div style="padding:24px;background:#f9fafb;">
          <p style="color:#4B5563;">Week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

          <h2 style="color:#003B5C;font-size:16px;">Sports Medicine Fellows (${fellows.length})</h2>
          ${buildTable(fellows, "fellow")}

          <h2 style="color:#003B5C;font-size:16px;">Resident Physicians (${residents.length})</h2>
          ${buildTable(residents, "resident")}

          <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />
          <p style="color:#9CA3AF;font-size:11px;">Automated weekly digest from UCLA Knee MRI Course</p>
        </div>
      </div>
    `;

    const transporter = createTransporter(GMAIL_APP_PASSWORD.value());

    await transporter.sendMail({
      from: `"UCLA Knee MRI Course" <jeremyswisher13@gmail.com>`,
      to: "jeremyswisher13@gmail.com",
      subject: `Weekly Report: UCLA Knee MRI Course — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      html,
    });

    console.log("Weekly digest sent");
  }
);
