/**
 * The 7/24 live knee-MRI teaching session (Drs. Swisher & Burbank, 3 fellows).
 *
 * Kept as DATA rather than JSX so the run-sheet, the roster check and any future
 * export all read the same plan. Case ids are validated against the real case
 * registry by teaching-session.test.ts — a renamed case fails the build, it does
 * not silently produce a dead "Open case" button during the session.
 */

export const TEACHING_SESSION = {
  title: "Knee MRI — Fellows Teaching Session",
  dateLabel: "Friday, July 24, 2026",
  timeLabel: "1:00 – 3:00 PM",
  faculty: ["Dr. Jeremy Swisher", "Dr. Kimberly Burbank"],
  courseId: "knee-mri",
  appUrl: "https://jeremyswisherkneemri.com/courses/knee-mri",
} as const;

export interface SessionCasePlan {
  /** Must match a case id in the knee course registry. */
  caseId: string;
  title: string;
  /** Shown to everyone — no diagnosis, safe to project. */
  scenario: string;
  /** Faculty-only. Hidden by the projector-safe toggle. */
  teachingFocus: string[];
  /**
   * Faculty-only. Both of these name findings ("measure the extrusion", "where
   * the MPFL failed"), so they are spoilers and hide with the teaching focus.
   */
  supportingRole: string;
  impressionPrompt: string;
}

/** Hour 2, in running order — matches the session plan sent to the fellows. */
export const SESSION_CASES: SessionCasePlan[] = [
  {
    caseId: "acl-pivot-shift",
    title: "ACL Tear + Pivot-Shift Pattern",
    scenario:
      "22-year-old soccer player, noncontact pivoting injury, rapid effusion within 2 hours.",
    teachingFocus: [
      "Primary ACL signs: fiber discontinuity, abnormal Blumensaat angle, empty notch",
      "Secondary signs: the pivot-shift contusion pair (lateral femoral condyle + posterolateral tibia)",
      "Anterior tibial translation and the deep lateral femoral notch sign",
      "Search pattern for the associated lateral meniscal root / posterior horn tear",
    ],
    supportingRole:
      "Find one piece of imaging evidence the leader did not name, and say which plane you found it on.",
    impressionPrompt:
      "In two sentences: what is torn, what is the secondary evidence, and what does it change for this athlete?",
  },
  {
    caseId: "medial-root-tear",
    title: "Medial Meniscal Root Tear + Extrusion",
    scenario:
      "55-year-old recreational runner, 3 months of worsening medial pain, no single injury. Mild medial joint-space narrowing on weight-bearing films.",
    teachingFocus: [
      "Where the posterior medial root actually inserts, and the coronal slice that shows it",
      "The ghost sign on sagittal; the truncated-triangle / cleft on coronal",
      "Measuring extrusion — >3 mm past the tibial margin is the threshold that matters",
      "Why this is a functional total meniscectomy, not a degenerative tear to observe",
    ],
    supportingRole:
      "Measure the extrusion yourself and state your number before the leader gives theirs.",
    impressionPrompt:
      "In two sentences: name the tear and its location, give the extrusion, and say why this is time-sensitive.",
  },
  {
    caseId: "patellar-dislocation-mpfl",
    title: "Transient Patellar Dislocation",
    scenario:
      '17-year-old basketball player — the knee "popped out" while cutting and reduced on its own. Medial tenderness, moderate effusion.',
    teachingFocus: [
      "MPFL: which axial slice shows it, and where it fails (patellar vs femoral vs mid-substance)",
      "The mirror-image contusion pair: medial patellar facet + anterolateral femoral condyle",
      "Osteochondral injury — the donor site and hunting the loose body in the recesses",
      "Predisposing anatomy: trochlear dysplasia, patella alta, TT-TG",
    ],
    supportingRole:
      "One of you tracks the bone-injury pattern, the other searches every recess for the fragment.",
    impressionPrompt:
      "In two sentences: state the mechanism the imaging proves, where the MPFL failed, and whether there is a surgical fragment.",
  },
];

/**
 * Hour 1 — the normal-MRI walkthrough, in the order we drive it.
 *
 * `label` + `minutes` are projector-safe. `facultyNote` is not: it forward-refers
 * to the Hour 2 cases on purpose ("the plane that pays off in case 2").
 */
export const SESSION_HOUR_ONE = [
  {
    minutes: "1:00 – 1:10",
    label: "Get everyone in",
    facultyNote:
      "All three signed in on their own device, knee course open, Normal Knee MRI workstation loaded. Confirm the baseline is done (see the roster check above).",
    seriesId: "sag-pdfs",
    mode: "explore",
  },
  {
    minutes: "1:10 – 1:30",
    label: "Sagittal PD-FS — Guided Tour",
    facultyNote:
      "Drive the tour together. Stop at the ACL and have a fellow describe the normal fiber orientation before advancing.",
    seriesId: "sag-pdfs",
    mode: "tour",
  },
  {
    minutes: "1:30 – 1:45",
    label: "Coronal PD-FS — roots, MCL, lateral corner",
    facultyNote:
      "This is the plane that pays off in case 2. Make them find the posterior medial root and the normal tibial margin relationship now.",
    seriesId: "cor-pdfs",
    mode: "tour",
  },
  {
    minutes: "1:45 – 2:00",
    label: "Axial T2-FS — patellofemoral + Knowledge Check",
    facultyNote:
      "MPFL and the retinacula, then let each fellow run the Knowledge Check on their own device. This sets up case 3.",
    seriesId: "axi-t2fs",
    mode: "check",
  },
] as const;

/** Copy-paste text sent to the fellows ahead of the session. */
export function fellowInviteText(): string {
  return [
    "Subject: Knee MRI session — Friday 7/24, 1–3 PM",
    "",
    "Hi all,",
    "",
    "Dr. Burbank and I are teaching knee MRI this Friday, July 24, from 1:00 to 3:00 PM.",
    "",
    "Before Friday, please do two things (about 20 minutes total):",
    "",
    `1. Open ${TEACHING_SESSION.appUrl} and sign in with your Google account.`,
    "2. Complete the baseline quiz and the confidence survey on the course dashboard.",
    "",
    "The baseline is not graded and nobody sees your individual answers — it just lets us",
    "measure what the session actually changes. Please do it before Friday, not after.",
    "",
    "How Friday will run:",
    "",
    "  Hour 1 — you'll work through the interactive normal knee MRI on your own device",
    "  while we help you navigate. Bring a laptop or an iPad if you can.",
    "",
    "  Hour 2 — three cases together. Each of you will lead one; the other two find the",
    "  imaging evidence and the clinical implications. Each case ends with a short impression.",
    "",
    "Tip: on your phone, open the link in Safari or Chrome and choose \"Add to Home Screen\" —",
    "it installs as an app and works offline.",
    "",
    "See you Friday,",
    "Jeremy",
  ].join("\n");
}
