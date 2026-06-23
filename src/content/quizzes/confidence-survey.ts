import type { ConfidenceStatement } from '@/types/content';

/**
 * Knee MRI confidence / self-efficacy survey.
 *
 * One statement per KNOWLEDGE domain (domain ids match the pre/post item domains),
 * so each fellow's confidence pairs 1:1 with their measured competence. Rated on a
 * 5-point scale; at post the survey also collects a retrospective "before the course"
 * rating (response-shift correction).
 */
export const confidenceStatements: ConfidenceStatement[] = [
  { id: "kc-mri-basics", domain: "mri-basics", statement: "I can select the appropriate MRI sequence for a given knee question and interpret fluid-sensitive fat-saturated signal to distinguish true pathology from normal tissue." },
  { id: "kc-normal-variants", domain: "normal-variants", statement: "I can recognize normal knee variants such as the popliteal hiatus and meniscofemoral ligaments and tell them apart from a genuine meniscal or ligament tear." },
  { id: "kc-search-reporting", domain: "search-reporting", statement: "I can apply a systematic knee MRI search pattern that avoids satisfaction of search and produce a structured impression that prioritizes management-changing findings." },
  { id: "kc-marrow-mechanism", domain: "marrow-mechanism", statement: "I can read bone marrow edema patterns to infer the injury mechanism (pivot-shift, dashboard/PCL, patellar dislocation) and distinguish insufficiency edema from traumatic contusion." },
  { id: "kc-menisci", domain: "menisci", statement: "I can systematically trace each meniscus and its roots to identify root tears, ramp lesions, and bucket-handle tears, measure extrusion, and apply the two-slice-touch rule." },
  { id: "kc-cartilage-osteochondral", domain: "cartilage-osteochondral", statement: "I can grade chondral lesions and judge osteochondral-fragment stability using interface fluid signal, cysts, and cartilage breach, accounting for reduced specificity in juveniles." },
  { id: "kc-cruciates", domain: "cruciates", statement: "I can diagnose ACL and PCL tears from direct fiber-discontinuity signs and distinguish a true tear from mucoid degeneration with preserved fiber continuity." },
  { id: "kc-collateral-corner", domain: "collateral-corner", statement: "I can evaluate the collateral ligaments and the posterolateral and posteromedial corners as combined injury patterns rather than isolated findings." },
  { id: "kc-extensor-synovium", domain: "extensor-synovium", statement: "I can assess the quadriceps and patellar tendons, characterize a joint effusion versus a Baker cyst, and identify loose bodies in the synovial compartments." },
];
