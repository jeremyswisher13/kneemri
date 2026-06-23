/**
 * Surgical / arthroscopic correlates that sit ALONGSIDE the MRI teaching to
 * anchor the anatomy — shown when the learner's "Surgical correlates" toggle is
 * on (defaults on for the Orthopedic Surgery specialty). Keyed by bodyRegion.
 *
 * To add an arthroscopy/open image: drop a CC-licensed file under
 * `public/images/teaching/surgical/<region>/` and fill the optional `image`
 * field below (src, alt, attribution). Text-only entries render fine without one.
 */

export interface SurgicalCorrelate {
  /** The anatomic structure this correlates to (matches the MRI teaching). */
  structure: string;
  /** Short title for the card. */
  title: string;
  /** The MRI ↔ surgical/arthroscopic correlation teaching. */
  body: string;
  /** Optional CC-licensed arthroscopy/open image. */
  image?: { src: string; alt: string; attribution: string };
}

export const surgicalCorrelatesByRegion: Record<string, SurgicalCorrelate[]> = {
  knee: [
    {
      structure: "Anterior cruciate ligament",
      title: "ACL — MRI band ↔ arthroscopic view",
      body: "On sagittal PD-FS the ACL is a straight, taut band paralleling Blumensaat's line. At arthroscopy it is the broad, fan-shaped ligament running from the lateral wall of the notch to the tibial footprint; a tear that reads 'empty notch' on MRI shows a bare lateral wall and a balled-up stump that the probe displaces.",
    },
    {
      structure: "Articular cartilage",
      title: "Cartilage — MRI grade ↔ Outerbridge at arthroscopy",
      body: "Fluid-sensitive MRI grades chondral loss from fissure to full-thickness; arthroscopy grades the same surface Outerbridge I–IV by probing (softening → fissuring/fragmentation, graded II vs III by lesion size → exposed bone). The MRI tells you where to look; the probe confirms depth and fragment stability.",
    },
    {
      structure: "Meniscus",
      title: "Meniscal tear — MRI signal ↔ probing",
      body: "A tear is signal reaching the meniscal surface on MRI; at arthroscopy the probe is the arbiter — it catches and displaces an unstable flap or a bucket-handle fragment, which decides repair vs partial meniscectomy.",
    },
  ],
  shoulder: [
    {
      structure: "Rotator cuff footprint",
      title: "Supraspinatus footprint — MRI ↔ arthroscopy",
      body: "Coronal MRI shows the cuff inserting on the greater-tuberosity footprint; a full-thickness tear is a fluid-filled gap. From the subacromial space at arthroscopy the same footprint is bared bone, and the tear pattern (crescent, U-, L-shaped) plus tendon mobility guide the repair construct.",
    },
    {
      structure: "Superior labrum / biceps anchor",
      title: "SLAP — MRI ↔ arthroscopic probe",
      body: "On MR-arthrography the superior labrum–biceps anchor is the SLAP zone, and a smooth sublabral recess can mimic a tear. Arthroscopy settles it — a probe tests whether the superior labrum is abnormally displaceable off the glenoid (vs a normal, smoothly contoured sublabral recess), and the dynamic peel-back sign (arm in ~90° abduction + maximal external rotation) shows the posterosuperior labrum peeling medially off the glenoid in a true type II SLAP.",
    },
  ],
  hip: [
    {
      structure: "Acetabular labrum",
      title: "Labral tear — MR-arthrography ↔ hip arthroscopy",
      body: "MR-arthrography is most sensitive for the anterosuperior labral tear; at arthroscopy the same lesion is probed for chondrolabral separation, and tissue quality decides labral repair vs selective debridement.",
    },
    {
      structure: "Cam lesion (FAI)",
      title: "Cam morphology — alpha angle ↔ femoroplasty",
      body: "The aspherical anterior head-neck bump (alpha angle >~55° on oblique-axial/radial) is the cam lesion. At arthroscopy it is burred back (femoroplasty/osteochondroplasty) to restore the concave head-neck offset and the dynamic clearance lost in impingement.",
    },
  ],
};
