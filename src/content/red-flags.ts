/**
 * Per-course "don't-miss" red flags — the highest-stakes, management-changing
 * findings, pulled into one glanceable safety net for a fellow reading between
 * cases. Distilled from each course's don't-miss module teaching; kept to the
 * handful that actually change disposition (refer / urgent / surgical).
 *
 * Keyed by CourseDefinition.bodyRegion.
 */

export interface RedFlag {
  /** The finding to never miss. */
  finding: string;
  /** Why it matters + what it changes (the action). */
  action: string;
}

export const redFlagsByRegion: Record<string, RedFlag[]> = {
  knee: [
    {
      finding: "Bicruciate injury / knee dislocation",
      action:
        "Treat as a possible spontaneously reduced knee dislocation. A routine knee MRI cannot exclude popliteal-artery injury: prompt vascular examination and ankle-brachial index are required, with CT angiography and serial assessment according to the trauma pathway. Also assess the common peroneal nerve. Urgent.",
    },
    {
      finding: "Locked knee + displaced bucket-handle tear",
      action:
        "A displaced fragment in the notch can produce mechanical locking. Correlate the double-PCL, absent bow-tie, donor-site, and orthogonal-plane findings with the examination, and communicate promptly for orthopedic assessment.",
    },
    {
      finding: "Extensor mechanism rupture (quadriceps / patellar tendon)",
      action: "A full-thickness gap with clinical loss of active extension needs prompt orthopedic assessment and is commonly repaired. Report tendon, tear extent, gap/retraction, retinacular involvement, and any postoperative context.",
    },
    {
      finding: "Marrow-replacing lesion",
      action:
        "Marrow signal that is disproportionately low on T1, replaces rather than intersperses fat, or has aggressive features needs dedicated characterization and prompt workup. Low T1 signal alone is not specific for tumor.",
    },
    {
      finding: "Segond / reverse Segond fracture",
      action:
        "A lateral tibial-rim Segond fracture strongly flags ACL injury. A medial-rim reverse Segond fracture flags a potentially complex injury involving the PCL and medial/posteromedial structures. Map every ligament and confirm injuries directly.",
    },
  ],
  shoulder: [
    {
      finding: "HAGL (humeral avulsion of the glenohumeral ligament)",
      action:
        "The IGHL torn off the HUMERAL neck (J-sign axillary pouch) — the classic miss when attention is on the glenoid. A surgical instability lesion.",
    },
    {
      finding: "Posterior dislocation (reverse Hill-Sachs + reverse Bankart)",
      action:
        "Seizure, electrocution, or fall on an adducted arm — easily missed; the head locks posteriorly. Read it on the axial.",
    },
    {
      finding: "Critical glenoid bone loss / off-track Hill-Sachs",
      action:
        "≥20–25% glenoid loss or an engaging Hill-Sachs shifts a soft-tissue Bankart repair toward a bony procedure (Latarjet). CT quantifies best.",
    },
    {
      finding: "Irreparable cuff tear (high Goutallier + narrowed AHI)",
      action:
        "Goutallier ≥3 fatty infiltration with an acromiohumeral interval <7 mm signals a chronic/irreparable tear — changes the surgical conversation.",
    },
    {
      finding: "Resorptive calcific tendinitis",
      action:
        "Hydroxyapatite is LOW signal on T1 AND T2 — easy to overlook on MRI; correlate the radiograph/ultrasound. It's an acute pain crisis, not a cuff-repair problem.",
    },
  ],
  hip: [
    {
      finding: "Tension-side femoral-neck stress fracture",
      action:
        "A line on the SUPEROLATERAL (tension) cortex is the surgical-urgency pattern — prone to displacement and AVN. Protected/non-weight-bearing + prompt ortho.",
    },
    {
      finding: "AVN pre-collapse (double-line sign)",
      action:
        "A radiograph-negative double-line is ARCO I — the joint-preservation window. Refer promptly and image the contralateral hip (often bilateral).",
    },
    {
      finding: "Subchondral insufficiency fracture (SIF)",
      action:
        "A subchondral low-signal fracture line (± flattening) carries collapse risk — it is NOT benign transient marrow edema. Offload and refer.",
    },
    {
      finding: "Marrow-replacing lesion",
      action: "Low-T1 marrow that isn't a stress/edema pattern — tumor or infiltration until proven otherwise.",
    },
    {
      finding: "Proximal hamstring avulsion",
      action:
        "≥2 tendons torn AND ≥2 cm retraction meets the surgical-referral window (the sciatic nerve sits right there) — flag it before retraction worsens.",
    },
  ],
  elbow: [
    {
      finding: "Complete distal biceps avulsion (or a complete tear with an intact lacertus that doesn't retract)",
      action:
        "A time-sensitive surgical repair (≈40–50% supination / ≈30% flexion strength lost). An intact lacertus tethers the tendon so it neither retracts nor shows an obvious clinical gap — the classic undercall as 'partial.' Report partial-vs-complete, retraction in cm, and lacertus integrity, and refer promptly while the tendon still reaches the tuberosity.",
    },
    {
      finding: "Unstable capitellar OCD",
      action:
        "A fluid line undercutting the fragment, sizeable/multiple subchondral cysts, a cartilage breach, or a displaced fragment/loose body in a young thrower → stop throwing and refer for surgery. Surrounding edema alone is not instability; an isolated high-T2 line is indeterminate.",
    },
    {
      finding: "Thrower's UCL tear — the deep-fiber T-sign or a full-thickness tear",
      action:
        "The undersurface (sublime-tubercle) partial tear is occult to exam and at arthroscopy and ends a throwing season if missed; distal/full-thickness tears do worse nonoperatively. Name surface, location, and acute-vs-chronic; add MR arthrography when non-contrast MRI is equivocal.",
    },
    {
      finding: "Deep common-extensor tear involving the LUCL (posterolateral rotatory instability)",
      action:
        "A deep ECRB tear with a fluid-bright gap undercutting the radiocapitellar joint and involving the LUCL turns a routine 'tennis elbow' debridement into a ligament repair/reconstruction (a classic post-injection/post-release complication). Trace the LUCL to the supinator crest before signing off any high-grade lateral epicondylitis.",
    },
    {
      finding: "Anteromedial coronoid facet fracture (and the terrible triad)",
      action:
        "The small-looking anteromedial facet fragment implies varus posteromedial rotatory instability and is surgical; the terrible triad (dislocation + radial head + coronoid) is unstable with the coronoid and LCL as keystones. Classify the coronoid, look for the Osborne–Cotterill lesion on any post-dislocation elbow, and route to surgery (CT maps the fragments).",
    },
  ],
};
