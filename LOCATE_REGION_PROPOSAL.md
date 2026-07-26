# `locateRegion` proposal — shoulder, hip, elbow

**Status:** analysis only. No source file was changed by this document, and **no coordinate is
proposed anywhere in it.** Every segment below is described in words, to be placed on the real
images by Dr. Swisher in Adjust mode.

---

## 1. TL;DR

The Locate scorer accepts a click within `DEFAULT_LOCATE_TOLERANCE = 8` (percent of the image)
of a single point, unless the item carries an optional `locateRegion`, in which case it accepts
a click within `region.tolerance` of a line segment. Codex added `locateRegion` to **4 knee
items** (quadriceps tendon and patellar tendon, on `sag-pdfs` and `sag-t1`).

**Shoulder, hip and elbow have 84 locate-eligible items and zero `locateRegion`s.**
Of those, **35 items (28 distinct marker anchors) are elongated in the imaged plane** and are
currently mis-scoring anatomically correct clicks. Because these scores feed the 70 %-per-plane
mastery gate, the damage is unevenly distributed:

| Course | Plane | Locate-eligible items | Chance a given item is drawn into a mastery run | Expected mis-scored locate trials per 5 |
|---|---|---|---|---|
| Hip | `sag` (Sagittal PD-FS) | 7 | 71 % | **3.6** |
| Shoulder | `cor-t2fs` (Coronal T2-FS) | 12 | 42 % | **2.9** |
| Hip | `cor-t2fs` (Coronal T2-FS) | 9 | 56 % | **2.8** |
| Shoulder | `sag-t1` (Sagittal T1) | 12 | 42 % | 2.5 |
| Elbow | `cor-t2fs` (Coronal T2-FS) | 5 | **100 %** | 2.0 (every attempt) |
| Elbow | `sag-ir` (Sagittal IR) | 5 | **100 %** | 2.0 (every attempt) |
| Hip | `axi` (Axial T2-FS) | 6 | 83 % | 1.7 |
| Shoulder | `sag-t2fs` (Sagittal T2-FS) | 12 | 42 % | 1.7 |
| Shoulder | `axi-t2fs` (Axial PD-FS) | 11 | 45 % | 0.9 |
| Elbow | `axi-t2fs` (Axial T2-FS) | 5 | 100 % | **0** (clean) |

**The elbow is the sharpest case.** All three elbow planes have *exactly* five locate-eligible
items, and `MASTERY_SOURCE_COUNT` is five — so mastery draws **all** of them, every time. The two
mis-scored coronal items (UCL anterior bundle, common extensor origin) are not a sampling risk;
they are in **100 % of elbow coronal mastery attempts**. Ten trials, 70 % to pass: two
mis-scored locates plus one genuine slip = 7/10, exactly on the boundary; three = fail.

A second, independent defect surfaced while measuring this (§6): on the hip and knee some
neighbouring answers already sit *closer together than 8*, so a click on the wrong structure is
scored **correct**. That constrains how wide any new region may be, and it is a work item in its
own right.

---

## 2. How the scorer actually works

`src/components/normal/knowledge-check-hit.ts`:

```ts
export const DEFAULT_LOCATE_TOLERANCE = 8;

export function isKnowledgeLocateHit(point, target: Marker, region?: LocateSegmentRegion) {
  return region
    ? distanceToSegment(point, region) <= region.tolerance
    : distance(point, target) <= DEFAULT_LOCATE_TOLERANCE;
}
```

`src/content/normal-mri-types.ts`:

```ts
export interface LocateSegmentRegion {
  kind: "segment";
  start: { x: number; y: number };
  end: { x: number; y: number };
  /** Maximum distance from the centerline, in image-percentage units. */
  tolerance: number;
}
```

Facts that matter for authoring:

1. **Units are percent of the displayed slice** — `x` = % from left, `y` = % from top, same as
   every marker in `normal-*-learn.ts`. There is no pixel anywhere in the model.
2. **`tolerance` is a radius, not a diameter.** The accepted zone is a *stadium*: the segment
   swept by a disc of radius `tolerance`, including round caps past each endpoint
   (`distanceToSegment` clamps the projection parameter `t` to `[0, 1]`).
3. **A region fully replaces the default radius.** When `locateRegion` is present the `8` is
   never consulted — so a region authored with `tolerance: 4` is *stricter* perpendicular to the
   structure than the point default, while being far more permissive along it. That is exactly
   what the knee items do (all four use `tolerance: 4`), and it is why adding a region does not
   silently loosen the gate.
4. **The `marker` stays.** It is still the reveal anchor for Guided Tour hand-off
   (`onShowInLearn`), the anchor the Identify trial pulses, and the key
   `labelQuizItemsFromTour` matches on. A region is additive; it never replaces the marker.
5. **The gold reveal is derived from `tolerance`** via `locateRevealSpanPercent()` — the drawn
   answer is always exactly as wide as the accepted zone. Whatever tolerance is chosen is what
   the fellow *sees*, so an over-wide tolerance is visibly over-wide.
6. **Only `kind: "segment"` exists.** The discriminant leaves room for a polyline, but there is
   no polyline implementation today. Curved structures need either a new variant or a
   two/three-segment approximation (§7).
7. **Only items with a `locateLabel` are locatable at all** — set explicitly, or inherited from
   a Guided Tour marker at the *identical* coordinates (`labelQuizItemsFromTour`). In shoulder,
   hip and elbow **every** quiz item currently resolves a label, so the entire quiz bank of
   those three courses is in the Locate pool.

### The rule that decides "needs a region"

> Elongation counts **only in the imaged plane.**

A structure that is long *through* the slice is a compact dot *on* it. That single rule reverses
two of the examples in the original brief, and it is worth stating in the file comments when the
regions land:

- **Long head of biceps on the axial** (`shoulder / axi-t2fs / axi-q4, axi-q8`) — a small dark
  dot in the bicipital groove. **Point scoring is correct.** It is elongated craniocaudally,
  i.e. through-plane.
- **Ulnar nerve on the axial** (`elbow / axi-t2fs / ec-axi-q1`) — an ovoid dot in the cubital
  tunnel. **Point scoring is correct**, same reason.
- Conversely, the **iliopsoas tendon** is a round dot on the hip axial (fine) but a long band on
  the hip sagittal (**needs a region**). The same structure gets different verdicts on different
  planes; the plane, not the structure, is the unit of decision.

**Threshold used below:** the `8` default already accepts everything within a 16-unit-wide
circle. A structure only mis-scores when its in-plane extent meaningfully exceeds ~16 % of the
image span, i.e. when a correct click at one end is more than 8 from the mid-structure marker.

### Priority score

Each anchor is scored:

```
risk = (5 × items sharing that anchor ÷ locate-eligible items on the plane) × severity
severity: 3 = extent clearly > ~16 % of image span (correct clicks routinely rejected)
          2 = extent ≈ 16 % (only end-of-structure clicks rejected)
          1 = within the default circle
```

The first factor is the *expected number of mastery trials per attempt* that land on that
anchor. It is why an elbow item with one question outranks a shoulder item with two.

---

## 3. Work-list — items that need a `locateRegion`

28 segments to place, covering 35 items, ordered by risk. Items sharing an anchor are one
placement; the same region object is then copied to each item id listed.

| # | Risk | Course | Plane (series id) | Item id(s) | Structure | Anatomic rationale (one line) |
|---|---|---|---|---|---|---|
| 1 | 3.75 | Shoulder | `cor-t2fs` | `scor-q2`, `scor-q12`, `scor-q13` | Supraspinatus tendon | The oblique coronal is cut *parallel* to the tendon specifically so it can be followed along its whole length to the footprint — the one plane where point scoring is most obviously wrong, on the course's most-clicked structure. |
| 2 | 3.00 | Elbow | `cor-t2fs` | `ec-cor-q2` | UCL, anterior bundle | A discrete band from the anteroinferior medial epicondyle to the sublime tubercle; the item's own teaching point (undersurface T-sign) is about tracing it *to the distal attachment*, which is where a click is currently rejected. |
| 3 | 3.00 | Elbow | `cor-t2fs` | `ec-cor-q3` | Common extensor origin | A tendon fanning distally off the lateral epicondyle; the teaching note asks the fellow to trace it deep to the LUCL toward the supinator crest, i.e. away from the marker. |
| 4 | 3.00 | Elbow | `sag-ir` | `ec-sag-q5` | Brachialis / distal biceps | Two longitudinal muscle–tendon units filling the antecubital fossa along the slice's long axis; the answer names *both*, so the anatomically correct area is a long anterior column. |
| 5 | 2.73 | Shoulder | `axi-t2fs` | `axi-q6`, `axi-q11` | Subscapularis | On axial the tendon is traced along the front of the humeral head to the lesser tuberosity — explicitly a "trace it" structure, and the classic axial miss. |
| 6 | 2.50 | Shoulder | `sag-t1` | `t1-q1`, `t1-q5`, `t1-q11` | Supraspinatus (muscle belly) | The belly fills the supraspinatus fossa end to end on the medial sagittal T1; Goutallier grading (the point of these three items) is judged across the whole belly, not at one spot. |
| 7 | 2.50 | Shoulder | `cor-t2fs` | `scor-q5`, `scor-q10` | Subacromial–subdeltoid bursa | A thin fat/fluid stripe arcing the full width of the cuff — a line by definition; it is the longest thin structure on the plane. |
| 8 | 2.14 | Hip | `sag` | `hs-q4` | Iliopsoas tendon | On sagittal the tendon is seen in profile crossing the anterior head-neck toward the lesser trochanter — long in plane (unlike the axial, where it is a dot). |
| 9 | 2.14 | Hip | `sag` | `hs-q6` | Anterior joint recess | A thin fluid sliver following the whole anterior head-neck contour; "where an effusion first collects" is a length, not a point. |
| 10 | 2.14 | Hip | `sag` | `hs-q7` | Joint capsule / iliofemoral ligament | The capsule drapes the entire anterior head-neck as the roof of that recess — same length, offset superficially. **See §6: this anchor already overlaps #9 and #8.** |
| 11 | 2.00 | Elbow | `sag-ir` | `ec-sag-q3` | Trochlea / capitellum articular surface | The tour note is literally "the articular surface curves through this slice… trace the contour"; a curve, so a single segment is only an approximation (§7). |
| 12 | 1.67 | Hip | `cor-t2fs` | `hc-q6` | Gluteus medius / minimus (abductors) | The "rotator cuff of the hip" sweeps from the iliac wing down to the trochanteric facets — the longest musculotendinous run on the plane, and the item is about footprint integrity along it. |
| 13 | 1.67 | Hip | `cor-t2fs` | `hc-q4` | Articular cartilage | A thin curved stripe along the whole weight-bearing joint surface; the note asks the fellow to compare it *across* the dome. **Tolerance is tightly constrained (§6).** |
| 14 | 1.67 | Hip | `axi` | `ha-q5` | Gluteus medius / minimus (abductors) | On axial the two muscles are curved sheets wrapping the lateral hip; the answer names both, so the correct area spans anterior facet to posterosuperior facet. |
| 15 | 1.67 | Hip | `axi` | `ha-q3` | Posterior wall / column of acetabulum | The posterior **wall** is a curved bony rim behind the femoral head — an extent, not a spot. Note the wall and the column are not the same structure: the posterior column is the much larger ischial mass (greater/lesser sciatic notches, quadrilateral surface, ischial tuberosity) of which the wall is one component. Draw the segment along the wall only; separately, `ha-q3`'s answer text ("Posterior wall/column") should be tightened to "posterior wall (part of the posterior column)". |
| 16 | 1.67 | Shoulder | `sag-t2fs` | `ssag-q2`, `ssag-q10` | Supraspinatus tendon | On the oblique sagittal the cuff is a crescent draped over the head; supraspinatus occupies the superior arc, so anterior/posterior clicks along that arc are correct but rejected. Severity 2 — the arc is shorter here than on the coronal. |
| 17 | 1.43 | Hip | `sag` | `hs-q5` | Gluteus medius / minimus (abductors) | Tendons converging on the trochanter, seen along their length on the lateral sagittal image. |
| 18 | 1.43 | Hip | `sag` | `hs-q2` | Femoral neck & head-neck junction | The sagittal profiles the neck end to end; the item asks the fellow to trace the anterior waist from head to neck, i.e. along a line. |
| 19 | 1.25 | Shoulder | `cor-t2fs` | `scor-q9` | Deltoid | A long muscle running the height of the image lateral to the cuff. |
| 20 | 1.25 | Shoulder | `sag-t2fs` | `ssag-q4` | Infraspinatus / teres minor | The answer names **two vertically stacked muscles**; a fellow who clicks teres minor is right by the label and wrong by the scorer. Consider also splitting this into two items (§8). |
| 21 | 1.25 | Shoulder | `sag-t2fs` | `ssag-q8` | Deltoid | Wraps the shoulder as a long superficial band on this plane. |
| 22 | 1.25 | Shoulder | `sag-t1` | `shsagt1-sid-1` | Spine of scapula | A long bony bar running across the medial sagittal slice, separating the supra- from the infraspinatus fossa. |
| 23 | 1.11 | Hip | `cor-t2fs` | `hc-q5` | Femoral neck | An elongated bar from head to trochanteric region; the tension-side teaching point is about *where along* the neck. |
| 24 | 1.11 | Hip | `cor-t2fs` | `hc-q2` | Sourcil | A curved subchondral arc across the weight-bearing roof. **Severely constrained by neighbours (§6) — may be better left as a point.** |
| 25 | 1.11 | Hip | `cor-t2fs` | `hc-q8` | Sacroiliac joint | An oblique cleft, elongated; and the answer is plural ("Sacroiliac joints") while the marker is one. It is alone on slice 15, so tolerance is unconstrained here. |
| 26 | 0.83 | Shoulder | `cor-t2fs` | `shcor-sid-1` | Axillary recess | A shallow U-shaped pouch spanning the width of the inferior capsule. |
| 27 | 0.83 | Shoulder | `sag-t1` | `t1-q2` | Subscapularis (muscle belly) | Fills the subscapular fossa along the anterior scapular surface. |
| 28 | 0.83 | Shoulder | `sag-t1` | `t1-q7` | Infraspinatus (muscle belly) | Fills the infraspinatus fossa below the scapular spine. |

---

## 4. Expected segment course, in words

**These are anatomic expectations, not placements.** I cannot see the slices; each must be
confirmed against the actual image in Adjust mode, and the direction words below are only useful
as a sanity check *after* the segment is drawn ("does what I drew match this description?").

Where a plane's orientation is asserted in its own "Get oriented" tour note, I quote that
convention; where it is not, I describe the course anatomically only.

### Shoulder — `cor-t2fs` (oblique coronal T2-FS; superior is up, greater tuberosity image-left/lateral, glenoid image-right/medial, per the plane's own orientation note)

- **#1 Supraspinatus tendon** — runs from the musculotendinous junction **medially and superiorly
  (image-right, near the glenoid/superior labrum)**, arcing over the convexity of the humeral
  head, **inferolaterally to the greater-tuberosity footprint (image-left, lower)**. Gently
  convex-upward; a straight segment is a good fit over the lateral two-thirds. The existing
  reviewed `Greater tuberosity` anchor (`shcor-sid-2`) sits at the *bony* footprint — a useful
  visual bearing for the lateral end, but it is on bone deep to the insertion, so it must not be
  reused verbatim as the endpoint.
- **#7 Subacromial–subdeltoid bursa** — a thin stripe **parallel to and just superficial
  (superior) to** the supraspinatus tendon, following the same medial-to-lateral arc between the
  cuff and the acromion/deltoid. Essentially an offset copy of #1's course.
- **#19 Deltoid** — near-vertical along the **lateral** soft tissues (image-left), from the level
  of the acromion downward over the greater tuberosity toward the proximal humeral shaft.
- **#26 Axillary recess** — a shallow, transversely oriented U beneath the inferior margin of the
  humeral head; approximate as a short horizontal segment across the dependent pouch.

### Shoulder — `sag-t2fs` (oblique sagittal T2-FS, right shoulder; superior up, anterior image-left, posterior image-right, per the plane's own orientation note)

- **#16 Supraspinatus tendon** — a short **anteroposterior arc across the top** of the humeral
  head (roughly image-left to image-right in the superior third of the head). Keep it short: the
  `Acromion` anchor is only 9.1 away (§6), so tolerance must stay ≤ 4.
- **#20 Infraspinatus / teres minor** — a **vertical** segment down the posterior muscle column
  (image-right), infraspinatus superiorly to teres minor inferiorly.
- **#21 Deltoid** — a long curve wrapping the superficial margin of the shoulder; a single
  segment along the **lateral/superficial** portion is the practical approximation.

### Shoulder — `axi-t2fs`

- **#5 Subscapularis** — runs along the **anterior surface of the humeral head**, from the muscle
  belly medially, curving anterolaterally to the lesser tuberosity, which lies **immediately
  medial to the bicipital groove**. The existing `Biceps tendon (groove)` anchor is 8.6 away and
  marks where the segment must *stop* — tolerance ≤ 4 (§6).

### Shoulder — `sag-t1` (medial sagittal, slice 4 — the muscle-belly slice)

- **#6 Supraspinatus belly** — along the **long axis of the supraspinatus fossa**, above the
  scapular spine, from the medial (deep) fossa laterally toward the musculotendinous junction.
- **#22 Spine of scapula** — the bony bar itself, running obliquely across the slice and
  separating the supraspinatus fossa above from the infraspinatus fossa below; the segment should
  follow that bar.
- **#27 Subscapularis belly** — along the **anterior (costal) surface of the scapular body**,
  roughly parallel to it, on the opposite side of the bone from #6/#28.
- **#28 Infraspinatus belly** — along the long axis of the infraspinatus fossa, **below** the
  scapular spine, roughly parallel to and inferior to #22.

### Hip — `cor-t2fs` (large-FOV bilateral coronal)

- **#12 Abductors** — from the gluteus medius/minimus muscle mass over the iliac wing, descending
  onto the greater trochanteric facets (gluteus minimus to the **anterior** facet; gluteus medius
  to the **lateral** and **superoposterior** facets). The run is **essentially vertical on the
  coronal**, tilting slightly **inferolateral** if anything — the greater trochanter is the most
  lateral bony landmark of the hip (intertrochanteric width ~32 cm vs intercristal ~28 cm), so an
  **inferomedial** tilt is not anatomically available. Read the actual tilt off the slice before
  drawing. The existing reviewed `Gr. trochanter` anchor sits at the insertion end, 10.3 away from
  the abductor anchor — a useful bearing for the distal end, again subject to visual confirmation,
  and it caps tolerance at ≤ 5.
- **#13 Articular cartilage** — a thin curved stripe following the **head–acetabulum joint
  surface**, arcing from the medial (fovea) side **superolaterally to the acetabular rim**.
  Severely constrained: the `Sourcil` anchor is 4.1 away and the `Femoral head` anchor 5.6 away,
  so tolerance must be ≤ 2 (§6). A cartilage segment at that tolerance is thin but honest — the
  cartilage stripe *is* thin.
- **#23 Femoral neck** — obliquely from the head **superomedially** down to the trochanteric
  region **inferolaterally**, following the axis of the neck.
- **#24 Sourcil** — a short curved arc across the superior weight-bearing roof. Given the 4.1 gap
  to the cartilage anchor and 6.6 to the labrum, the honest recommendation is **leave this a
  point** and fix the crowding first.
- **#25 SI joint** — the oblique cleft between sacrum and ilium. The joint is angled roughly
  25–30° posteromedially out of the true coronal plane (which is why dedicated SI protocols
  acquire an *oblique* coronal), and the sacral auricular surface sits on the lateral sacral mass
  spanning about 2.5 sacral segments with real individual variation in its cranio-caudal position.
  Its apparent in-plane tilt on this **non-oblique, large-FOV** coronal is therefore **not
  predictable from anatomy alone** — read the obliquity off the actual slice rather than assuming
  a direction. (If anything the cleft converges *medially* as it descends, since the sacrum
  narrows caudally — the opposite of the superomedial-to-inferolateral run originally asserted.)
  Alone on its slice, so tolerance is free (6–8 is reasonable).

### Hip — `axi` (dedicated single left hip; iliopsoas tendon marks anterior, sciatic nerve posterior, per the plane's own orientation note)

- **#14 Abductors** — a curved sheet along the **lateral** margin of the hip, wrapping from
  gluteus minimus (deeper/anterior, to the anterior facet) round to gluteus medius
  (posterolateral facets).
- **#15 Posterior wall** — along the curved **posterior acetabular rim**, behind the femoral head.
  The posterior *column* extends well beyond this slice's rim, so the segment traces the wall, not
  the column.

### Hip — `sag` (dedicated single left hip; iliopsoas/anterior recess mark anterior, gluteals mark posterior, per the plane's own orientation note)

All three of #8/#9/#10 run roughly **parallel, along the anterior head-neck**, which is exactly
why their point markers already overlap. They should be placed together, in one sitting, as
three offset lines with a small tolerance.

- **#8 Iliopsoas tendon** — the **most superficial/anterior** of the three: a near-vertical band
  descending along the front of the joint, crossing the anterior femoral head and angling
  slightly posteriorly toward the lesser trochanter.
- **#10 Capsule / iliofemoral ligament** — **deep to the iliopsoas**, draping the anterior
  head-neck as the low-signal roof of the recess.
- **#9 Anterior joint recess** — **deep to the capsule**, the thin sliver hugging the bone
  contour of the anterior head-neck. Order from surface to bone: iliopsoas → capsule/IFL →
  recess → cortex. If the three lines cannot be separated by more than ~3 on the actual image,
  the correct answer is to **retire one of the three items rather than widen any of them** (§8).
- **#17 Abductors** — on the lateral sagittal, tendons converging **inferiorly onto the
  trochanter** from the posterosuperior muscle mass.
- **#18 Femoral neck / head-neck junction** — from the head, **anteroinferiorly along the neck
  axis**, following the anterior waist.

### Elbow — `cor-t2fs` (distal humerus above, radius/ulna below; radial head marks the LATERAL side, per the plane's own orientation note)

- **#2 UCL anterior bundle** — a short, taut, near-vertical band from the **anteroinferior medial
  epicondyle** (superior, medial side) descending to the **sublime tubercle on the medial margin
  of the coronoid** (inferior, very slightly toward the joint centre). Short — the gain here is
  modest in absolute terms but it is the elbow's marquee structure and it is in 100 % of mastery
  attempts. Tolerance ≤ 4 (the `Trochlea` anchor is 10.8 away).
- **#3 Common extensor origin** — from the **lateral epicondyle** (superior, lateral side)
  descending **distally and slightly medially** across the radiocapitellar level. Tolerance ≤ 4:
  the `Capitellum` anchor is only 9.2 away and a wider band would swallow it.

### Elbow — `sag-ir` (humerus arcs into trochlea/capitellum; coronoid anteroinferior, olecranon posteroinferior, per the plane's own orientation note)

- **#4 Brachialis / distal biceps** — a **near-vertical column along the anterior** soft tissues,
  descending from the distal arm through the antecubital fossa. Note the two units named in the
  answer do **not** share a destination: the brachialis attaches distally to the **ulnar tuberosity
  and coronoid** (superficial and deep heads, with no tendinous continuity with the biceps), while
  the distal biceps heads for the **radial tuberosity** on an oblique course — superficial-to-deep
  *and* ulnar-to-radial — so it partial-volumes out of any single sagittal slice before it reaches
  bone (exactly why the FABS view exists). Draw the segment along the anterior muscle column only;
  do **not** run it to the radial tuberosity. Tolerance ≤ 6 (the `Coronoid process` anchor is 13.0
  away).
- **#11 Trochlea/capitellum articular surface** — the **curved subchondral arc** of the distal
  humerus. A single chord will either miss the ends of the arc or bulge toward the `Coronoid`
  (14.9) and `Olecranon` (13.6) anchors. Either wait for a polyline (§7) or accept a **short
  central chord with tolerance ≤ 5**; do not attempt the full arc with one segment.

---

## 5. Complete inventory — items that are fine as a point

All 49 remaining locate-eligible items in the three courses, grouped by plane. Verdict for every
one: **fine as a point**, with the reason. Ordered within each plane by how close they came to
needing a region.

### Shoulder `sag-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ssag-q7`, `ssag-q12` | Glenoid & labrum | The labrum is a **ring** around the en-face glenoid, not a line — a segment is the wrong primitive. Marker sits on the glenoid; see §8 for the labral-clock-face question. |
| `ssag-q1` | Humeral head | Large compact area; marker central, most of the head is inside 8. |
| `ssag-q3` | Subscapularis (belly, medial slice) | Compact belly cross-section on this slice. |
| `ssag-q9` | Supraspinatus (belly, medial slice) | Belly is more compact here than on `sag-t1`; borderline, low yield. |
| `ssag-q6` | Acromion | Moderately elongated but bright, wide, and 8 covers most of it. |
| `ssag-q5`, `ssag-q11` | Biceps / rotator interval | The interval is a compact triangular space between subscapularis and supraspinatus. |

### Shoulder `cor-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `shcor-sid-2`, `scor-q11` | Greater tuberosity (footprint) | A bony facet, compact at this scale. |
| `scor-q4` | Glenoid & labrum | Ring/two-triangle geometry again, not a line. |
| `scor-q6` | Acromion / AC joint | Compact bony region. |
| `scor-q8` | Humeral head | Large compact area. |

### Shoulder `axi-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `axi-q4`, `axi-q8` | Long head of biceps in the groove | **A dot on this plane** — elongated only through-plane. Point scoring is anatomically right. |
| `axi-q3`, `axi-q9` | Anterior labrum | Compact triangle at the glenoid rim. |
| `shaxi-sid-2`, `axi-q10` | Posterior labrum | Compact triangle. |
| `axi-q2` | Glenoid | A bar-shaped bone, moderately elongated; 8 covers it. Low yield. |
| `shaxi-sid-1` | Coracoid process | Compact oval on axial. |
| `axi-q1` | Humeral head | Large compact area. |

### Shoulder `sag-t1`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `t1-q8` | Teres minor | Small belly; comfortably inside 8. |
| `t1-q4` | Glenoid & labrum | Ring geometry. |
| `t1-q6` | Acromion | Compact at this slice. |
| `t1-q10` | Coracoid process | Compact beak on sagittal. |
| `shsagt1-sid-2`, `t1-q3` | Humeral head | Large compact area. |

### Hip `cor-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `hc-q3` | Acetabular labrum | Small triangle capping the rim. |
| `hc-q9` | Greater trochanter | Bony prominence, compact. |
| `hc-q7` | Pubic symphysis | Compact midline structure. |
| `hc-q1` | Femoral head | Large compact area; **but see §6 — it already overlaps the cartilage answer.** |

### Hip `axi`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ha-q4` | Iliopsoas tendon | **A dot on this plane** (elongated only through-plane). Contrast with `hs-q4` on the sagittal, which needs a region. |
| `ha-q6` | Sciatic nerve | Rounded fascicular cross-section. |
| `ha-q2` | Acetabular labrum | Compact triangle. |
| `ha-q1` | Femoral head | Large compact area. |

### Hip `sag`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `hs-q3` | Acetabular labrum | Compact triangle. |
| `hs-q1` | Femoral head | Large compact area. |

### Elbow `cor-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-cor-q1` | Capitellum | Compact rounded condyle. |
| `ec-cor-q4` | Trochlea | Compact spool-shaped surface. |
| `ec-cor-q5` | Radial head | Compact disc. |

### Elbow `axi-t2fs` — **no changes needed on this plane**

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-axi-q1` | Ulnar nerve (cubital tunnel) | **A dot on this plane.** Elongated only through-plane. |
| `ec-axi-q2` | Common flexor-pronator | Muscle mass in cross-section; compact wedge. |
| `ec-axi-q3` | Common extensor origin | Cross-section, compact — contrast with `ec-cor-q3`, the *same structure* on the coronal, which needs a region. |
| `ec-axi-q4` | Brachialis | Cross-section. |
| `ec-axi-q5` | Triceps | Cross-section. |

### Elbow `sag-ir`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-sag-q1` | Olecranon fossa / posterior fat pad | Small triangle in the fossa. |
| `ec-sag-q2` | Coronoid process | Compact bony beak. |
| `ec-sag-q4` | Olecranon | Compact bony beak. |

---

## 6. Second defect found while measuring: accepted zones that already overlap

Point scoring cuts both ways. Because every non-region item accepts a **16-wide circle**, any two
answers on the same slice closer than 8 apart accept each other's markers — a click on the
**wrong** structure is scored **correct**. Measured across all four courses:

| Course / plane | Slice | Pair | Distance | Consequence |
|---|---|---|---|---|
| Hip `cor-t2fs` | 19 | Sourcil ↔ Cartilage | **4.1** | A click on either scores both correct. |
| Hip `cor-t2fs` | 19 | Femoral head ↔ Cartilage | **5.6** | Same. |
| Hip `cor-t2fs` | 19 | Sourcil ↔ Labrum | **6.6** | Same. |
| Hip `sag` | 11 | Femoral head ↔ Labrum | **6.7** | Same. |
| Hip `sag` | 11 | Anterior recess ↔ Capsule/IFL | **6.7** | Same. |
| Hip `sag` | 11 | Iliopsoas ↔ Capsule/IFL | **7.6** | Same. |
| Hip `axi` | 23 | Labrum ↔ Iliopsoas | **7.8** | Same. |
| Knee `axi-t2fs` | 13 | Femoral trochlea ↔ Trochlear groove | **5.7** | Arguably benign — the groove is part of the trochlea. |
| Knee `sag-pdfs` / `sag-t1` | 13 | Patellar tendon ↔ Hoffa's fat pad | 6.5 / 9.2 | **Already mitigated** on the tendon side by `tolerance: 4`. |

The knee mitigation is the precedent worth copying: Codex chose `tolerance: 4` — half the
default — precisely so a long band would not swallow its neighbour.

**Authoring rule this yields:**

> An item's accepted zone must never reach another locatable anchor on the same slice.
> `tolerance ≤ (distance to nearest other anchor on that slice) / 2`, and 4 unless there is a
> reason to go higher.

For the hip, this rule cannot be satisfied by tolerances alone — hip `sag` and hip `cor-t2fs`
are over-packed. Those two planes need the item-design decision in §8 *before* segments are
placed, or the segments will simply relocate the false-positive problem.

---

## 7. Type/engine changes worth making first

Another agent is adding segment editing to the admin adjuster in parallel. Three requests, in
priority order:

1. **Support a polyline.** `LocateSegmentRegion` is already a discriminated union of one. A
   `kind: "polyline"` with `points: { x: number; y: number }[]` and a tolerance, hit-tested as
   `min(distanceToSegment)` over consecutive pairs, is a ~10-line change to
   `knowledge-check-hit.ts` and makes six genuinely curved structures placeable instead of
   approximable: shoulder supraspinatus on both `cor-t2fs` and `sag-t2fs`, the SASD bursa, the
   deltoid, the hip femoral articular cartilage, and the elbow distal-humeral articular surface.
   The reveal (`locateRevealSpanPercent`) is already tolerance-derived and needs no change; only
   the drawn path does.
2. **Apply one region to every item sharing an anchor.** `MarkerAdjuster` already keeps tour and
   quiz markers in sync via `sameAnchor`. The 28 segments cover 35 items, and 7 anchors are
   shared by 2–3 items each (`scor-q2/q12/q13`, `t1-q1/q5/q11`, `scor-q5/q10`, `axi-q6/q11`,
   `ssag-q2/q10`, …). If the editor does not propagate by anchor, those will drift apart.
3. **Warn on collision in the editor.** With §6's rule encoded, the adjuster can compute the
   distance from a drafted region to every other anchor on the slice and refuse/flag a tolerance
   that reaches one. That is the single highest-value guard rail here, because the failure it
   prevents (silently accepting the wrong answer) is invisible in testing.

Two smaller notes:

- `Math.hypot(a.x - b.x, a.y - b.y)` mixes **percent-of-width** with **percent-of-height**. On a
  non-square displayed slice the accepted zone is an ellipse in real pixels, not a circle. This
  is pre-existing behaviour for point scoring and is not a regression; it does mean a `tolerance`
  is not literally isotropic. Worth a comment; not worth a rewrite unless the stacks are far from
  square.
- `CrossPlaneDrill` has its own `CROSS_PLANE_FREE_TOLERANCE = 8` in `cross-plane-cursor.ts`
  with **no region support at all**. The same elongated-structure mis-scoring exists there. Out
  of scope for this proposal, but it should be tracked — the cross-plane items name several of
  the same tendons.

---

## 8. Item-design questions that a region cannot answer

Three items mis-score for a reason that is not geometric, and adding a segment would paper over
it:

1. **`ssag-q4` "Infraspinatus / teres minor"** — one marker, two muscles named in the answer. A
   fellow who clicks teres minor is correct by the prompt. Either split into two items (each has
   its own reviewed tour marker on `sag-t1` already) or place the vertical segment in #20 and
   accept both.
2. **Glenoid & labrum items** (`ssag-q7`, `ssag-q12`, `scor-q4`, `t1-q4`) — the labrum is a
   ring/clock-face, and the prompt "Find the Glenoid & labrum" has no single correct answer. No
   segment fixes this. Suggested resolution: rename the locate label to the specific structure
   the marker is on (glenoid, or a named labral quadrant), leaving the identify prompt untouched.
3. **Hip `sag` anterior trio** (`hs-q4`, `hs-q6`, `hs-q7`) — three answers stacked within 7 units
   of each other along the same anterior contour. Even perfectly placed segments will be within
   a few units of each other. Honest options: (a) keep all three with `tolerance` ≈ 2–3 and
   accept that this is a genuinely hard discrimination task (defensible — telling recess from
   capsule *is* the teaching point), or (b) retire one item from the locate pool by moving it to
   identify-only. Note (b) drops hip `sag` to 6 locate-eligible items, which is still above
   `MASTERY_SOURCE_COUNT`.

---

## 9. How to place these — recommended workflow

The tooling already exists; nothing here needs a new page.

1. **Open the course workstation as admin** — `/courses/<course>/normal-mri` (the admin-only
   `MarkerAdjuster` is mounted from `NormalShoulderMriPage.tsx`, `NormalHipMriPage.tsx`,
   `NormalElbowMriPage.tsx`, all around line ~300).
2. **Select the plane, then the quiz item** in the right-hand list (quiz entries are labelled by
   their answer text plus slice number). The slice is already correct — do **not** move the
   slider unless the marker itself is wrong, because `setSlice` re-slices the paired tour step
   too.
3. **Place the segment, not the marker.** The marker stays where the radiologist review left it.
   Once the parallel agent's segment editing lands, drag the two endpoints along the structure;
   until then, the segment cannot be authored from this UI at all — **this work is blocked on
   that change**, which is why this document stops at descriptions.
4. **Set tolerance by the §6 rule**, not by feel: 4 by default, less where §6 lists a close
   neighbour, more only on isolated anchors (hip `cor-t2fs` `hc-q8` is the only clear case).
5. **Sanity-check both ends.** After drawing, click deliberately at each end of the structure and
   at the nearest *neighbouring* structure. Correct-along-the-length must pass; the neighbour
   must fail. That two-click check is the whole point of the change.
6. **"Copy marker changes"** exports `{ tour, quiz }` as JSON to the clipboard; paste it into the
   ticket for review and deployment. Drafts persist in `localStorage` keyed by image directory +
   plane id and are invalidated automatically when the committed content changes, so a long
   session can be split across days safely.
7. **`CrossPlaneAdjuster`** (same pages, just below) is a different bank — cross-plane correlation
   items, `CROSS_PLANE_FREE_TOLERANCE`. It is **not** part of this work-list; see §7.

**Suggested order of sittings** (each is one plane, one sitting, so the collision checks in §6
are done against a stable set):

1. Elbow `cor-t2fs` (2 segments) — 100 % mastery exposure, marquee structures, cleanest geometry.
2. Elbow `sag-ir` (2 segments) — same exposure argument.
3. Shoulder `cor-t2fs` (4 segments, 7 items) — largest single-plane win in the app.
4. Shoulder `axi-t2fs` (1 segment) and `sag-t2fs` (3 segments).
5. Shoulder `sag-t1` (4 segments).
6. Hip `axi` (2 segments).
7. **Hip `sag` and `cor-t2fs` last**, after the §8 item-design decisions — these two planes need
   the crowding resolved before geometry is worth touching.

**Tests to add alongside** (mirroring `src/components/normal/knowledge-check-hit.test.ts`, which
today only covers the four knee items): for each new region, one point at the far end of the
structure that must be **accepted**, and one point on the nearest neighbouring answer that must
be **rejected**. A generic test asserting the §6 rule across all four courses' content —
"no locate item's accepted zone contains another locatable anchor on the same slice" — would be
worth more than the per-item cases, and would have caught the hip overlaps in §6 before they
shipped.

---

## 10. Honest limitations of this document

- **I cannot see the MRI slices.** Every verdict here is derived from the structure's name, the
  plane's own orientation note in the content file, and standard anatomy — not from the image.
  A structure I called compact could be larger on the actual field of view, and vice versa. The
  verdicts are a triage list, not a substitute for looking.
- **No coordinates are proposed**, per the standing project rule. The three places where I point
  at an existing reviewed anchor as a *bearing* for a segment endpoint (shoulder coronal greater
  tuberosity, hip coronal greater trochanter, elbow anchors used to bound tolerance) are flagged
  as requiring visual confirmation, and none of them is a marker I would copy verbatim into a
  `start`/`end`.
- **The severity weights (3/2/1) are judgement, not measurement.** The *expected-trials* half of
  the risk score is exact (it falls out of `buildKnowledgeRound`); the severity half is my
  estimate of in-plane extent relative to the field of view. If a placement session shows a
  structure is smaller than I assumed, drop it down the list rather than forcing a segment.
- **`ec-cor-q2` (UCL) is the item I am least sure about geometrically.** The anterior bundle is
  short in absolute terms and may already sit mostly inside the 8 default on a full-elbow
  coronal. I kept it at rank 2 because of the 100 % mastery exposure and because the item's own
  teaching point is about the distal attachment — but if the placement session shows the whole
  ligament inside the default circle, it is fine to leave it as a point and say so.
