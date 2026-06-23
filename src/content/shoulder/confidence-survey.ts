import type { ConfidenceStatement } from '@/types/content';

/**
 * Shoulder MRI confidence / self-efficacy survey.
 * One statement per knowledge domain (domain ids match the pre/post item domains).
 */
export const shoulderConfidenceStatements: ConfidenceStatement[] = [
  { id: "sc-orientation-search", domain: "orientation-search", statement: "I can choose the correct imaging plane for each shoulder structure and follow a repeatable search pattern that evaluates every key structure without skipping any." },
  { id: "sc-rotator-cuff", domain: "rotator-cuff", statement: "I can distinguish rotator cuff tendinosis from partial-thickness and full-thickness tears and judge reparability from retraction, fatty infiltration, and atrophy." },
  { id: "sc-subscapularis-biceps", domain: "subscapularis-biceps", statement: "I can identify subscapularis tears and recognize the associated biceps pulley lesion and medial biceps subluxation on axial images." },
  { id: "sc-labrum-slap", domain: "labrum-slap", statement: "I can differentiate a SLAP tear from a normal sublabral recess using lateral or posterior contrast extension, margin irregularity, and cleft orientation." },
  { id: "sc-instability", domain: "instability", statement: "I can recognize and distinguish Bankart, ALPSA, Perthes, and HAGL lesions and identify when glenoid bone loss or an off-track Hill-Sachs warrants CT bone-loss quantification." },
  { id: "sc-capsule-adhesive", domain: "capsule-adhesive", statement: "I can identify the MRI findings of adhesive capsulitis at the rotator interval and axillary pouch and avoid mistaking them for a cuff-driven cause of pain." },
  { id: "sc-nerve-entrapment", domain: "nerve-entrapment", statement: "I can trace a paralabral cyst to its notch and report the resulting suprascapular nerve denervation edema or muscle atrophy beyond the labral tear itself." },
  { id: "sc-postoperative", domain: "postoperative", statement: "I can distinguish a recurrent full-thickness cuff tear from expected postoperative tendon thickening, heterogeneous signal, and hardware artifact without over-calling failure." },
];
