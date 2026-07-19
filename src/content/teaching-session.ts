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
  /**
   * Wall-clock window. Hour 2 is 55 minutes after a 5-minute break, not 60, so
   * three "20-minute" cases do not fit — case 3 is deliberately the short one.
   * These windows are the SINGLE canonical timeline; the printed run-sheet is
   * asserted against them by teaching-session.test.ts.
   */
  window: string;
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
    window: "2:05 – 2:22",
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
    window: "2:22 – 2:40",
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
    window: "2:40 – 2:53",
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
    minutes: "1:00 – 1:08",
    label: "Get in + the orientation contract",
    facultyNote:
      "All three signed in on their own device, workstation loaded, slice counter visible. Everyone says the orientation sentence back before you advance — do not proceed on two of three.",
    seriesId: "sag-pdfs",
    mode: "explore",
  },
  {
    minutes: "1:08 – 1:26",
    label: "Sagittal PD-FS — Guided Tour (11 stops)",
    facultyNote:
      "Stops 1-6 are naming (6 min); stops 7-11 are reading (12 min). Spend the time on stop 3 (tibial plateau — plants Case 1's bruise), stop 7 (menisci, slice 9/29) and stop 9 (ACL, slice 22/29).",
    seriesId: "sag-pdfs",
    mode: "tour",
  },
  {
    minutes: "1:26 – 1:38",
    label: "Coronal PD-FS — roots, MCL, lateral corner",
    facultyNote:
      "All 9 coronal stops sit on slice 8/19 and never move, so the posterior root is NOT on the tour — you must drop to Explore and scroll posteriorly. That detour is what pays off in Case 2. Do not skip stop 9 (LCL/PLC).",
    seriesId: "cor-pdfs",
    mode: "tour",
  },
  {
    minutes: "1:38 – 1:50",
    label: "Axial T2-FS — patellofemoral (9 stops)",
    facultyNote:
      "All 9 axial stops sit on slice 14/28. Trochlea, trochlear groove and MPFL are the three that set up Case 3.",
    seriesId: "axi-t2fs",
    mode: "tour",
  },
  {
    minutes: "1:50 – 1:58",
    label: "Knowledge Check — axial",
    facultyNote:
      "Each fellow runs it on their own device. The axial bank is 11 items; Practice & Mastery samples only 5 of them per round, so the Knowledge Check is the fuller pass.",
    seriesId: "axi-t2fs",
    mode: "check",
  },
  {
    minutes: "1:58 – 2:05",
    label: "Bridge + 5-minute break",
    facultyNote:
      "Screens closed. FIVE minutes, not ten — Hour 2 is over-committed and the break is where it gets stolen from.",
    seriesId: "axi-t2fs",
    mode: "explore",
  },
] as const;

/** Hour 2 wall-clock, kept beside the case windows so the close is not forgotten. */
export const SESSION_CLOSE_WINDOW = "2:53 – 3:00";

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
