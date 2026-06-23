import type { ConfidenceStatement } from "@/types/content";

/**
 * Elbow MRI confidence / self-efficacy survey.
 * One statement per knowledge domain (domain ids match the pre/post item domains).
 */
export const elbowConfidenceStatements: ConfidenceStatement[] = [
  { id: "conf-elbow-orientation-protocol", domain: "elbow-orientation-protocol", statement: "I can choose the right elbow protocol (non-contrast vs MR arthrogram, and when FABS positioning helps the distal biceps), assign each plane to the structure it best shows, and turn the clinical question into a focused but complete search." },
  { id: "conf-elbow-search-pattern", domain: "elbow-search-pattern", statement: "I can apply a systematic eight-step elbow search pattern — reading the medial valgus triad and the post-traumatic lateral circle as linked groups — and produce a structured impression that names the structure, the grade, and the management consequence." },
  { id: "conf-elbow-bones-marrow-osteochondral", domain: "elbow-bones-marrow-osteochondral", statement: "I can distinguish capitellar osteochondritis dissecans from Panner disease and judge OCD stability, recognize the thrower's stress lesions (medial epicondyle apophysis, olecranon stress, valgus-extension-overload osteophyte), and use CRITOE and the radiocapitellar line to catch occult and pediatric fractures." },
  { id: "conf-elbow-ucl-valgus", domain: "elbow-ucl-valgus", statement: "I can trace the UCL anterior bundle to the sublime tubercle, separate a partial undersurface tear (the T-sign) from a full-thickness tear and from a normal recess, and explain how location, surface, and athlete demand drive repair versus reconstruction in a thrower." },
  { id: "conf-elbow-lcl-plri", domain: "elbow-lcl-plri", statement: "I can evaluate the LCL complex (especially the LUCL) for posterolateral rotatory instability, recognize the anteromedial coronoid facet fracture and the terrible-triad pattern, and comment on LUCL integrity in every post-dislocation or post-lateral-surgery elbow." },
  { id: "conf-elbow-tendons-biceps-triceps-epicondylitis", domain: "elbow-tendons-biceps-triceps-epicondylitis", statement: "I can grade the distal biceps and triceps tendons for partial versus complete tear (with retraction and the lacertus fibrosus), grade lateral and medial epicondylitis, and always check the adjacent ligament (LUCL with lateral, UCL with medial)." },
  { id: "conf-elbow-nerves-entrapment", domain: "elbow-nerves-entrapment", statement: "I can assess the ulnar, median/AIN, and radial/PIN nerves by caliber and signal against an internal control, use muscle denervation as the localizing sign, recognize ulnar-nerve subluxation and snapping triceps, and consider Parsonage–Turner before calling mechanical compression." },
  { id: "conf-elbow-dont-miss", domain: "elbow-dont-miss", statement: "I can prioritize the management-changing elbow findings — complete distal biceps avulsion, unstable capitellar OCD, the thrower's T-sign/full-thickness UCL tear, a common-extensor tear involving the LUCL, and the anteromedial coronoid facet fracture — and route each to the correct disposition." },
];
