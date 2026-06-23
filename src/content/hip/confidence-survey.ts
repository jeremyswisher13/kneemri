import type { ConfidenceStatement } from "@/types/content";

/**
 * Hip MRI confidence / self-efficacy survey.
 * One statement per knowledge domain (domain ids match the pre/post item domains).
 */
export const hipConfidenceStatements: ConfidenceStatement[] = [
  { id: "conf-hip-mri-basics", domain: "hip-mri-basics", statement: "I can choose between a large-FOV pelvis screen and a small-FOV dedicated hip protocol, select the right sequences (T1, PD/T2 FS, STIR) and the oblique-axial neck plane, and decide when direct MR arthrography will change management." },
  { id: "conf-hip-anatomy", domain: "hip-anatomy", statement: "I can identify the acetabular labrum, cartilage, capsuloligamentous complex, and the periarticular muscle-tendon groups on MRI and distinguish normal variants (sublabral sulcus, supra-acetabular fossa, herniation pit, os acetabuli, stellate lesion) from true pathology." },
  { id: "conf-hip-search-pattern", domain: "hip-search-pattern", statement: "I can apply a systematic seven-step hip and pelvis search pattern, use pain location to weight the read, and protect against satisfaction-of-search misses in the femoral neck, sacrum, symphysis, and marrow." },
  { id: "conf-hip-bones-stress", domain: "hip-bones-stress", statement: "I can differentiate compression- from tension-side femoral-neck stress fractures and state the management of each, recognize the AVN double-line sign and stage by ARCO, and separate BMES from subchondral insufficiency fracture and avulsions." },
  { id: "conf-hip-fai-labrum", domain: "hip-fai-labrum", statement: "I can measure the alpha angle in the correct plane, differentiate cam from pincer morphology, identify anterosuperior labral tears and paralabral cysts while avoiding over-calling a normal recess, and recognize associated chondral injury." },
  { id: "conf-hip-cartilage-oa", domain: "hip-cartilage-oa", statement: "I can grade acetabular and femoral cartilage for delamination versus full-thickness loss, recognize early OA, and explain how cartilage status and joint space shift management from joint preservation toward arthroplasty and when MR arthrography helps." },
  { id: "conf-hip-tendons-muscles", domain: "hip-tendons-muscles", statement: "I can recognize gluteus medius/minimus tendon disease behind GTPS, grade hamstring-origin injury with tendon count and retraction, identify iliopsoas pathology and internal snapping hip, and recognize athletic pubalgia including the secondary cleft sign." },
  { id: "conf-hip-dont-miss", domain: "hip-dont-miss", statement: "I can prioritize the urgent hip/pelvis findings (tension-side stress fracture, septic joint, pre-collapse AVN, occult elderly fracture, marrow-replacing/soft-tissue tumor, SCFE) and route each to the correct disposition." },
];
