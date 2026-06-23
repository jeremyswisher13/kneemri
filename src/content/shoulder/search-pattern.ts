import type { SearchPatternStep } from "@/types/content";

export const shoulderSearchPatternSteps: SearchPatternStep[] = [
  {
    number: 1,
    name: "Verify Protocol & Clinical Question",
    shortName: "Verify",
    description:
      "Confirm side, exam type, arthrogram status, available sequences, and the exact clinical question before narrowing your attention.",
    checklistItems: [
      "Confirm correct patient, side, and comparison imaging",
      "Identify whether this is non-contrast MRI or MR arthrogram",
      "Inventory planes and sequences: oblique coronal, oblique sagittal, axial, fluid-sensitive, T1",
      "State the clinical question: cuff, instability, biceps/labrum, adhesive capsulitis, arthritis, trauma",
      "Note image quality limitations and metal or motion artifact",
    ],
    pearls: [
      "Primary care sports medicine reads should start with the management question: rehab, injection, surgical referral, or urgent escalation.",
    ],
  },
  {
    number: 2,
    name: "Bones, Alignment & AC Joint",
    shortName: "Bones",
    description:
      "Assess humeral head position, glenoid bone stock, marrow edema, occult fracture, acromial morphology, and AC joint degeneration.",
    checklistItems: [
      "Check glenohumeral alignment and posterior/anterior subluxation",
      "Look for fracture, marrow edema, Hill-Sachs or reverse Hill-Sachs lesion",
      "Evaluate glenoid bone loss or bony Bankart fragment",
      "Assess AC joint osteoarthritis and distal clavicle edema",
      "Look for os acromiale or acromial stress reaction when impingement symptoms persist",
    ],
    pearls: [
      "Bone bruising often explains pain after instability even when the labral tear is subtle.",
      "AC joint edema can be clinically dominant even when cuff findings are mild.",
    ],
  },
  {
    number: 3,
    name: "Rotator Cuff Tendons",
    shortName: "Cuff",
    description:
      "Trace supraspinatus, infraspinatus, subscapularis, and teres minor from musculotendinous junction to insertion, then classify tendinosis or tear.",
    checklistItems: [
      "Supraspinatus: tendinosis, bursal-sided tear, articular-sided tear, full-thickness tear",
      "Infraspinatus: posterior extension, delamination, full-thickness component",
      "Subscapularis: upper-border tear, footprint involvement, lesser tuberosity attachment",
      "Teres minor: edema or fatty change suggesting axillary nerve/quadrilateral space issue",
      "For tears: report side, depth, AP size, retraction, and exposed footprint",
    ],
    pearls: [
      "Subscapularis tears are easy to undercall and matter because they destabilize the biceps pulley.",
      "A full-thickness tear is a communication from articular to bursal surface, often with fluid in the subacromial-subdeltoid bursa.",
    ],
  },
  {
    number: 4,
    name: "Rotator Cuff Muscles",
    shortName: "Muscle",
    description:
      "Evaluate muscle bulk, edema, and fatty infiltration because reparability and urgency often depend on the muscle more than the tendon edge.",
    checklistItems: [
      "Check supraspinatus and infraspinatus volume in the supraspinous/infraspinous fossae",
      "Assess fatty infiltration qualitatively and compare muscle to surrounding fat",
      "Look for muscle edema after acute tear, strain, denervation, or Parsonage-Turner pattern",
      "Identify retraction to humeral head, glenoid, or medial to glenoid level",
      "Look for superior humeral head migration suggesting chronic cuff insufficiency",
    ],
    pearls: [
      "Massive tear plus marked atrophy/fatty infiltration changes the referral conversation from repair toward salvage options.",
    ],
  },
  {
    number: 5,
    name: "Labrum & Instability Lesions",
    shortName: "Labrum",
    description:
      "Evaluate the labrum by quadrant, connect abnormalities to instability direction, and look for associated osseous defects.",
    checklistItems: [
      "Superior labrum and biceps anchor: SLAP pattern versus normal recess",
      "Anteroinferior labrum: Bankart, Perthes, ALPSA, GLAD, bony Bankart",
      "Posterior labrum: reverse Bankart, Kim lesion, posterior paralabral cyst",
      "Inferior capsule/IGHL: HAGL or capsular tear pattern",
      "Match labral findings to Hill-Sachs, reverse Hill-Sachs, or glenoid bone loss",
    ],
    pearls: [
      "For primary care sports medicine, the question is not just 'is the labrum torn?' but whether the pattern explains instability and needs surgical consultation.",
    ],
  },
  {
    number: 6,
    name: "Biceps, Pulley & Rotator Interval",
    shortName: "Biceps",
    description:
      "Assess the long head biceps tendon from anchor to groove, then evaluate the pulley and rotator interval structures that stabilize it.",
    checklistItems: [
      "Biceps anchor: fraying, SLAP extension, detachment",
      "Intra-articular biceps: tendinosis, split tear, partial tear, rupture",
      "Bicipital groove: tenosynovitis, subluxation, dislocation",
      "Pulley: coracohumeral ligament, superior glenohumeral ligament, upper subscapularis",
      "Rotator interval and capsule: thickening or edema suggesting adhesive capsulitis",
    ],
    pearls: [
      "Medial biceps subluxation should trigger a deliberate search for an upper-border subscapularis tear.",
    ],
  },
  {
    number: 7,
    name: "Cartilage, Capsule, Bursa & Synovium",
    shortName: "Joint",
    description:
      "Survey glenohumeral cartilage, capsule, recesses, subacromial-subdeltoid bursa, and synovium for pain generators and inflammatory patterns.",
    checklistItems: [
      "Glenohumeral cartilage: focal defect, diffuse thinning, osteophytes, subchondral cysts",
      "Inferior capsule and axillary recess: thickening, edema, capsular volume loss",
      "Subacromial-subdeltoid bursa: fluid, synovitis, communication with cuff tear",
      "Loose bodies in axillary recess, biceps sheath, and subcoracoid recess",
      "Synovitis or erosive pattern suggesting inflammatory arthropathy or infection",
    ],
    pearls: [
      "Adhesive capsulitis is a clinical diagnosis, but rotator interval edema and axillary capsular thickening can support the exam.",
    ],
  },
  {
    number: 8,
    name: "Nerves, Masses & Final Management Review",
    shortName: "Other",
    description:
      "Finish with the spaces and soft tissues that can hide management-changing findings, then translate the MRI into a clear clinical next step.",
    checklistItems: [
      "Spinoglenoid notch and suprascapular notch: paralabral cyst or denervation changes",
      "Quadrilateral space: mass, teres minor denervation, axillary nerve pattern",
      "Deltoid, pectoralis major insertion, latissimus/teres major region if trauma history fits",
      "Look for infection, tumor, or marrow replacement red flags",
      "Summarize: rehab/injection candidate, surgical referral, urgent escalation, or imaging follow-up",
    ],
    pearls: [
      "A paralabral cyst with infraspinatus denervation is more than an incidental labral tear; it can change urgency and referral priority.",
    ],
  },
];
