# `locateRegion` proposal — shoulder, hip, elbow

**Status:** analysis only. No source file was changed by this document, and **no coordinate is
proposed anywhere in it.** Every segment below is described in words, to be placed on the real
images by Dr. Swisher in Adjust mode.

**Recount, 2026-07-26.** Every count, ranking and risk figure below was re-derived from the live
content after the hip and elbow item expansion. The document previously reported the pre-expansion
banks (84 items; five items per elbow plane); those numbers were wrong and are corrected
throughout. **§0 records what the shipped per-item tolerance cap already fixed** — read it before
acting on the work-list, because it changes what is still broken.

---

## 0. What has already shipped since this document was first written

Two things changed under this proposal, and neither of them is a `locateRegion`:

1. **Locate no longer uses a flat 8 for point items.** `src/components/normal/locate-tolerance.ts`
   derives a per-item radius from the reviewed anchors themselves: an item's tolerance is capped at
   *half* the distance to the nearest competing answer on the same series+slice (or, against a
   neighbouring segment, at the free space outside that segment's authored band). Nothing is
   hand-written into content and no coordinate moved — the cap is recomputed from the anchors, so
   a future anchor edit re-derives it and `locate-tolerance.test.ts` fails if an edit reintroduces
   an overlap. **The §6 authoring rule is therefore now enforced automatically for point items.**
2. **It is *not* enforced for segments.** `computeLocateTolerances` returns any item carrying a
   `locateRegion` untouched at its authored tolerance, on the grounds that a segment is
   faculty-reviewed content. So every tolerance recommended in §4 is still a genuine authoring
   decision, and adding a segment to a crowded anchor **re-opens** a false positive the cap had
   closed. It will not ship silently — `locate-tolerance.test.ts` scans segments against their
   neighbours at the authored tolerance and fails — but it will cost a build, and it is exempted
   entirely if the neighbour is on the below-floor list.

Consequences for this work-list:

- Of the 26 anchor pairs that sat closer than the old flat 8, **12 are now fully closed by the
  cap.** The other 14 involve an item whose derived cap fell under `MIN_LOCATE_TOLERANCE = 3`
  (about 17 px in the Locate viewer), so the cap was deliberately *not* applied and the item still
  scores at the flat 8 — **14 distinct items, 12 of them locate-eligible.** Those need **item
  redesign, not a tolerance change** (§6b).
- Six of the 14 are hip `cor-t2fs`, which is why that plane is still blocked in §9 despite ranking
  second on the priority table.

---

## 1. TL;DR

The Locate scorer accepts a click within a per-item tolerance (derived from the neighbouring
anchors, capped at `DEFAULT_LOCATE_TOLERANCE = 8`, in percent of the image) of a single point,
unless the item carries an optional `locateRegion`, in which case it accepts a click within
`region.tolerance` of a line segment. Codex added `locateRegion` to **4 knee items** (quadriceps
tendon and patellar tendon, on `sag-pdfs` and `sag-t1`).

**Shoulder, hip and elbow have 120 locate-eligible items and zero `locateRegion`s** — 47
shoulder, 38 hip, 35 elbow. Of those, **49 items (28 distinct marker anchors) are elongated in the
imaged plane** and are currently mis-scoring anatomically correct clicks. The per-item tolerance
cap does not help here and in places makes it worse: a long structure whose anchor has a close
neighbour now gets a *smaller* circle than 8, so correct clicks along its length are rejected more
often, not less. Because these scores feed the 70 %-per-plane mastery gate, the damage is unevenly
distributed:

| Course | Plane | Locate-eligible items | Chance a given item is drawn into a mastery run | Expected mis-scored locate trials per 5 |
|---|---|---|---|---|
| Hip | `sag` (Sagittal PD-FS) | 12 | 42 % | **3.8** |
| Hip | `cor-t2fs` (Coronal T2-FS) | 15 | 33 % | **3.0** |
| Shoulder | `cor-t2fs` (Coronal T2-FS) | 12 | 42 % | **2.9** |
| Shoulder | `sag-t1` (Sagittal T1) | 12 | 42 % | 2.5 |
| Elbow | `cor-t2fs` (Coronal T2-FS) | 13 | 38 % | 1.9 |
| Shoulder | `sag-t2fs` (Sagittal T2-FS) | 12 | 42 % | 1.7 |
| Elbow | `sag-ir` (Sagittal IR) | 12 | 42 % | 1.7 |
| Hip | `axi` (Axial T2-FS) | 11 | 45 % | 1.4 |
| Shoulder | `axi-t2fs` (Axial PD-FS) | 11 | 45 % | 0.9 |
| Elbow | `axi-t2fs` (Axial T2-FS) | 10 | 50 % | **0** (clean) |

**The hip is now the sharpest case.** Hip `sag` carries 9 of its 12 locate-eligible items on
elongated anchors, so ~3.8 of the five locate trials in a mastery attempt land on a structure the
point scorer gets wrong. Ten trials, 70 % to pass: four mis-scored locates fails the plane outright
even with a perfect identify half.

**The elbow is no longer a 100 % exposure case.** When this document was written each elbow plane
held exactly five locate-eligible items and `MASTERY_SOURCE_COUNT` is five, so mastery drew *all*
of them every attempt. The expansion took the elbow to 13 / 10 / 12 items per plane, so mastery now
samples 5 of 13 on the coronal — each individual item appears in roughly **38 %** of attempts, not
100 %. The two mis-scored coronal structures are still worth fixing first among the elbow work
(they are the plane's marquee structures and now carry 5 items between them), but the "every
attempt" argument no longer applies and should not be used to justify their rank.

A second, independent defect surfaced while measuring this (§6): on the hip and knee some
neighbouring answers sit *closer together than 8*, so under the old flat tolerance a click on the
wrong structure was scored **correct**. The per-item cap has since closed most of those; the 14
items where it could not are listed in §6 and need item redesign. Either way it constrains how wide
any new region may be, because authored segment tolerances bypass the cap.

---

## 2. How the scorer actually works

`src/components/normal/knowledge-check-hit.ts`:

```ts
export const DEFAULT_LOCATE_TOLERANCE = 8;

export function isKnowledgeLocateHit(
  point,
  target: Marker,
  region?: LocateSegmentRegion,
  pointTolerance: number = DEFAULT_LOCATE_TOLERANCE,
) {
  return region
    ? distanceToSegment(point, region) <= region.tolerance
    : distance(point, target) <= pointTolerance;
}
```

`pointTolerance` is the per-item value from `locate-tolerance.ts` (§0); `KnowledgeCheck` passes it
and the gold reveal derives from the same number. The flat default now only applies to items with
no competing answer within 16 on their slice — and to the 14 below-floor items in §6.

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
3. **A region fully replaces the point radius, and is never capped.** When `locateRegion` is
   present neither the `8` nor the derived per-item cap is consulted — so a region authored with
   `tolerance: 4` is *stricter* perpendicular to the structure than the point default, while being
   far more permissive along it. That is exactly what the knee items do (all four use
   `tolerance: 4`), and it is why adding a region does not silently loosen the gate. The corollary
   matters more now that the cap has shipped: a segment authored at 6 on an anchor whose point cap
   had been derived at 3.4 **widens** the accepted zone past what the cap allowed. §6 is the rule
   that has to be applied by hand for segments.
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
   hip and elbow **every** quiz item still resolves a label after the expansion (120/120), so the
   entire quiz bank of those three courses is in the Locate pool. (The knee has 3 unlabeled items;
   they are out of the pool but still count as neighbours for the tolerance cap.)

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

**Threshold used below:** the `8` default accepts everything within a 16-unit-wide circle. A
structure only mis-scores when its in-plane extent meaningfully exceeds ~16 % of the image span,
i.e. when a correct click at one end is more than 8 from the mid-structure marker. Where the
derived cap is *below* 8 the accepted circle is smaller still, so the severity ratings below are
if anything conservative — the `derived tol.` column in §3 shows how small the circle actually is
today.

### Priority score

Each anchor is scored:

```
risk = (5 × items sharing that anchor ÷ locate-eligible items on the plane) × severity
severity: 3 = extent clearly > ~16 % of image span (correct clicks routinely rejected)
          2 = extent ≈ 16 % (only end-of-structure clicks rejected)
          1 = within the default circle
```

The first factor is the *expected number of mastery trials per attempt* that land on that
anchor. The denominator is the plane's **current** locate-eligible count (§1 table), and the
numerator is how many items now share the anchor — both moved in the expansion, so every hip and
elbow score below has been recomputed. It is why an anchor asked three times outranks the same
structure asked once on a busier plane.

---

## 3. Work-list — items that need a `locateRegion`

28 segments to place, **covering 49 items**, ordered by risk. Items sharing an anchor are one
placement; the same region object is then copied to each item id listed. The expansion added a
second (and in three cases a third) question on many of these anchors, so most rows now carry more
items than when this document was first written — that is why the ranking has changed even where
the anatomy has not.

`Cap now` is the radius the point scorer uses **today**, derived by `locate-tolerance.ts` from the
nearest competing anchor on the slice (§0); `8` means nothing competes within 16. It is the ceiling
a segment must respect: authoring a segment wider than this re-opens a false positive the cap had
closed. `FLOOR` marks an item whose derived cap fell under 3 and was therefore not applied — those
score at the flat 8 and are **item-redesign work, not segment work** (§6).

| # | Risk | Course | Plane (series id) | Item id(s) | Structure | Cap now | Anatomic rationale (one line) |
|---|---|---|---|---|---|---|---|
| 1 | 3.75 | Shoulder | `cor-t2fs` | `scor-q2`, `scor-q12`, `scor-q13` | Supraspinatus tendon | 8 | The oblique coronal is cut *parallel* to the tendon specifically so it can be followed along its whole length to the footprint — the one plane where point scoring is most obviously wrong, on the course's most-clicked structure. |
| 2 | 3.46 | Elbow | `cor-t2fs` | `ec-cor-q2`, `ec-cor-q9`, `ec-cor-q10` | UCL, anterior bundle | 5.4 | A discrete band from the anteroinferior medial epicondyle to the sublime tubercle; the item's own teaching point (undersurface T-sign) is about tracing it *to the distal attachment*, which is where a click is currently rejected. Now asked three times, which is what carries it to rank 2 — not the retired "100 % of attempts" argument. |
| 3 | 2.73 | Shoulder | `axi-t2fs` | `axi-q6`, `axi-q11` | Subscapularis | 4.3 | On axial the tendon is traced along the front of the humeral head to the lesser tuberosity — explicitly a "trace it" structure, and the classic axial miss. |
| 4 | 2.50 | Elbow | `sag-ir` | `ec-sag-q5`, `ec-sag-q12` | Brachialis / distal biceps | 6.5 | Two longitudinal muscle–tendon units filling the antecubital fossa along the slice's long axis; the answer names *both*, so the anatomically correct area is a long anterior column. |
| 5 | 2.50 | Shoulder | `sag-t1` | `t1-q1`, `t1-q5`, `t1-q11` | Supraspinatus (muscle belly) | 8 | The belly fills the supraspinatus fossa end to end on the medial sagittal T1; Goutallier grading (the point of these three items) is judged across the whole belly, not at one spot. |
| 6 | 2.50 | Shoulder | `cor-t2fs` | `scor-q5`, `scor-q10` | Subacromial–subdeltoid bursa | 8 | A thin fat/fluid stripe arcing the full width of the cuff — a line by definition; it is the longest thin structure on the plane. |
| 7 | 2.50 | Hip | `sag` | `hs-q6`, `hs-q9` | Anterior joint recess | 3.4 | A thin fluid sliver following the whole anterior head-neck contour; "where an effusion first collects" is a length, not a point. |
| 8 | 2.50 | Hip | `sag` | `hs-q7`, `hs-q10` | Joint capsule / iliofemoral ligament | 3.4 | The capsule drapes the entire anterior head-neck as the roof of that recess — same length, offset superficially. **See §6: this anchor is 6.7 from #7 and 7.6 from #19, and the cap has already squeezed all three to ~3.4.** |
| 9 | 2.31 | Elbow | `cor-t2fs` | `ec-cor-q3`, `ec-cor-q12` | Common extensor origin | 4.6 | A tendon fanning distally off the lateral epicondyle; the teaching note asks the fellow to trace it deep to the LUCL toward the supinator crest, i.e. away from the marker. |
| 10 | 2.00 | Hip | `cor-t2fs` | `hc-q4`, `hc-q14` | Articular cartilage | 8 `FLOOR` | A thin curved stripe along the whole weight-bearing joint surface; the note asks the fellow to compare it *across* the dome. **Below the floor — 4.1 from the sourcil and 5.6 from the femoral head. Do not place a segment here until §8.4 resolves the anchor crowding.** |
| 11 | 1.82 | Hip | `axi` | `ha-q3`, `ha-q11` | Posterior wall / column of acetabulum | 7.5 | The posterior **wall** is a curved bony rim behind the femoral head — an extent, not a spot. Note the wall and the column are not the same structure: the posterior column is the much larger ischial mass (greater/lesser sciatic notches, quadrilateral surface, ischial tuberosity) of which the wall is one component. Draw the segment along the wall only; separately, the `ha-q3`/`ha-q11` answer text ("Posterior wall/column") should be tightened to "posterior wall (part of the posterior column)". |
| 12 | 1.67 | Elbow | `sag-ir` | `ec-sag-q3`, `ec-sag-q10` | Trochlea / capitellum articular surface | 5.7 | The tour note is literally "the articular surface curves through this slice… trace the contour"; a curve, so a single segment is only an approximation (§7). |
| 13 | 1.67 | Shoulder | `sag-t2fs` | `ssag-q2`, `ssag-q10` | Supraspinatus tendon | 4.5 | On the oblique sagittal the cuff is a crescent draped over the head; supraspinatus occupies the superior arc, so anterior/posterior clicks along that arc are correct but rejected. Severity 2 — the arc is shorter here than on the coronal. |
| 14 | 1.67 | Hip | `sag` | `hs-q5`, `hs-q11` | Gluteus medius / minimus (abductors) | 8 | Tendons converging on the trochanter, seen along their length on the lateral sagittal image. |
| 15 | 1.67 | Hip | `sag` | `hs-q2`, `hs-q8` | Femoral neck & head-neck junction | 6.1 | The sagittal profiles the neck end to end; the item asks the fellow to trace the anterior waist from head to neck, i.e. along a line. |
| 16 | 1.33 | Hip | `cor-t2fs` | `hc-q5`, `hc-q10` | Femoral neck | 4.0 | An elongated bar from head to trochanteric region; the tension-side teaching point is about *where along* the neck. |
| 17 | 1.33 | Hip | `cor-t2fs` | `hc-q2`, `hc-q13` | Sourcil | 8 `FLOOR` | A curved subchondral arc across the weight-bearing roof. **Below the floor — 4.1 from the cartilage and 6.6 from the labrum. The honest recommendation is still to leave this a point and fix the crowding first (§8.4).** |
| 18 | 1.33 | Hip | `cor-t2fs` | `hc-q8`, `hc-q15` | Sacroiliac joint | 8 | An oblique cleft, elongated; and the answer is plural ("Sacroiliac joints") while the marker is one. It is alone on slice 15, so tolerance is unconstrained here. |
| 19 | 1.25 | Hip | `sag` | `hs-q4` | Iliopsoas tendon | 3.8 | On sagittal the tendon is seen in profile crossing the anterior head-neck toward the lesser trochanter — long in plane (unlike the axial, where it is a dot). |
| 20 | 1.25 | Shoulder | `cor-t2fs` | `scor-q9` | Deltoid | 8 | A long muscle running the height of the image lateral to the cuff. |
| 21 | 1.25 | Shoulder | `sag-t2fs` | `ssag-q4` | Infraspinatus / teres minor | 8 | The answer names **two vertically stacked muscles**; a fellow who clicks teres minor is right by the label and wrong by the scorer. Consider also splitting this into two items (§8). |
| 22 | 1.25 | Shoulder | `sag-t2fs` | `ssag-q8` | Deltoid | 8 | Wraps the shoulder as a long superficial band on this plane. |
| 23 | 1.25 | Shoulder | `sag-t1` | `shsagt1-sid-1` | Spine of scapula | 8 | A long bony bar running across the medial sagittal slice, separating the supra- from the infraspinatus fossa. |
| 24 | 1.00 | Hip | `cor-t2fs` | `hc-q6` | Gluteus medius / minimus (abductors) | 5.2 | The "rotator cuff of the hip" sweeps from the iliac wing down to the trochanteric facets — the longest musculotendinous run on the plane, and the item is about footprint integrity along it. Still only asked once, on the app's busiest locate plane, which is what drops it from rank 12 to rank 24. |
| 25 | 0.91 | Hip | `axi` | `ha-q5` | Gluteus medius / minimus (abductors) | 8 | On axial the two muscles are curved sheets wrapping the lateral hip; the answer names both, so the correct area spans anterior facet to posterosuperior facet. |
| 26 | 0.83 | Shoulder | `cor-t2fs` | `shcor-sid-1` | Axillary recess | 8 | A shallow U-shaped pouch spanning the width of the inferior capsule. |
| 27 | 0.83 | Shoulder | `sag-t1` | `t1-q2` | Subscapularis (muscle belly) | 8 | Fills the subscapular fossa along the anterior scapular surface. |
| 28 | 0.83 | Shoulder | `sag-t1` | `t1-q7` | Infraspinatus (muscle belly) | 8 | Fills the infraspinatus fossa below the scapular spine. |

**What the re-sort changed.** Hip `sag` moved up (its five elongated anchors are now nine items),
hip `cor-t2fs` moved down on a per-anchor basis (a 15-item denominator dilutes each anchor) while
moving *up* as a plane, and every elbow row lost the exposure multiplier it had when the plane held
exactly five items. The two hip `cor-t2fs` rows marked `FLOOR` (#10, #17) are the only rows in the
table that should **not** be actioned as segment work.

---

## 4. Expected segment course, in words

**These are anatomic expectations, not placements.** I cannot see the slices; each must be
confirmed against the actual image in Adjust mode, and the direction words below are only useful
as a sanity check *after* the segment is drawn ("does what I drew match this description?").

Where a plane's orientation is asserted in its own "Get oriented" tour note, I quote that
convention; where it is not, I describe the course anatomically only.

The `#n` references are the **re-sorted** §3 ranks. Every "tolerance ≤ x" below is a *ceiling*, and
where §3's `Cap now` column is lower than the ceiling quoted here, **the cap wins** — a segment
must not be wider than the radius the point item already had, or it hands back the false positive.

### Shoulder — `cor-t2fs` (oblique coronal T2-FS; superior is up, greater tuberosity image-left/lateral, glenoid image-right/medial, per the plane's own orientation note)

- **#1 Supraspinatus tendon** — runs from the musculotendinous junction **medially and superiorly
  (image-right, near the glenoid/superior labrum)**, arcing over the convexity of the humeral
  head, **inferolaterally to the greater-tuberosity footprint (image-left, lower)**. Gently
  convex-upward; a straight segment is a good fit over the lateral two-thirds. The existing
  reviewed `Greater tuberosity` anchor (`shcor-sid-2`) sits at the *bony* footprint — a useful
  visual bearing for the lateral end, but it is on bone deep to the insertion, so it must not be
  reused verbatim as the endpoint.
- **#6 Subacromial–subdeltoid bursa** — a thin stripe **parallel to and just superficial
  (superior) to** the supraspinatus tendon, following the same medial-to-lateral arc between the
  cuff and the acromion/deltoid. Essentially an offset copy of #1's course.
- **#20 Deltoid** — near-vertical along the **lateral** soft tissues (image-left), from the level
  of the acromion downward over the greater tuberosity toward the proximal humeral shaft.
- **#26 Axillary recess** — a shallow, transversely oriented U beneath the inferior margin of the
  humeral head; approximate as a short horizontal segment across the dependent pouch.

### Shoulder — `sag-t2fs` (oblique sagittal T2-FS, right shoulder; superior up, anterior image-left, posterior image-right, per the plane's own orientation note)

- **#13 Supraspinatus tendon** — a short **anteroposterior arc across the top** of the humeral
  head (roughly image-left to image-right in the superior third of the head). Keep it short: the
  `Acromion` anchor is only 9.1 away (§6), so tolerance must stay ≤ 4.
- **#21 Infraspinatus / teres minor** — a **vertical** segment down the posterior muscle column
  (image-right), infraspinatus superiorly to teres minor inferiorly.
- **#22 Deltoid** — a long curve wrapping the superficial margin of the shoulder; a single
  segment along the **lateral/superficial** portion is the practical approximation.

### Shoulder — `axi-t2fs`

- **#3 Subscapularis** — runs along the **anterior surface of the humeral head**, from the muscle
  belly medially, curving anterolaterally to the lesser tuberosity, which lies **immediately
  medial to the bicipital groove**. The existing `Biceps tendon (groove)` anchor is 8.6 away and
  marks where the segment must *stop* — tolerance ≤ 4 (§6).

### Shoulder — `sag-t1` (medial sagittal, slice 4 — the muscle-belly slice)

- **#5 Supraspinatus belly** — along the **long axis of the supraspinatus fossa**, above the
  scapular spine, from the medial (deep) fossa laterally toward the musculotendinous junction.
- **#23 Spine of scapula** — the bony bar itself, running obliquely across the slice and
  separating the supraspinatus fossa above from the infraspinatus fossa below; the segment should
  follow that bar.
- **#27 Subscapularis belly** — along the **anterior (costal) surface of the scapular body**,
  roughly parallel to it, on the opposite side of the bone from #5/#28.
- **#28 Infraspinatus belly** — along the long axis of the infraspinatus fossa, **below** the
  scapular spine, roughly parallel to and inferior to #23.

### Hip — `cor-t2fs` (large-FOV bilateral coronal)

- **#10 Articular cartilage** — a thin curved stripe following the **head–acetabulum joint
  surface**, arcing from the medial (fovea) side **superolaterally to the acetabular rim**.
  Severely constrained: the `Sourcil` anchor is 4.1 away and the `Femoral head` anchor 5.6 away,
  so the §6 ceiling is ≤ 2 — which is *below* `MIN_LOCATE_TOLERANCE`, i.e. under the width a
  fingertip can hit. **This is why the item is on the below-floor list: do not place a segment
  here. It is item-redesign work (§8.4).**
- **#16 Femoral neck** — obliquely from the head **superomedially** down to the trochanteric
  region **inferolaterally**, following the axis of the neck. Cap is 4.0 (the `Femoral head`
  anchor is 8.1 away), so a segment must stay ≤ 4 — and the head end of the neck is exactly where
  that constraint bites, so keep the medial endpoint short of the head marker.
- **#17 Sourcil** — a short curved arc across the superior weight-bearing roof. Given the 4.1 gap
  to the cartilage anchor and 6.6 to the labrum, the honest recommendation is **leave this a
  point** and fix the crowding first. Also below the floor, for the same reason as #10.
- **#18 SI joint** — the oblique cleft between sacrum and ilium. The joint is angled roughly
  25–30° posteromedially out of the true coronal plane (which is why dedicated SI protocols
  acquire an *oblique* coronal), and the sacral auricular surface sits on the lateral sacral mass
  spanning about 2.5 sacral segments with real individual variation in its cranio-caudal position.
  Its apparent in-plane tilt on this **non-oblique, large-FOV** coronal is therefore **not
  predictable from anatomy alone** — read the obliquity off the actual slice rather than assuming
  a direction. (If anything the cleft converges *medially* as it descends, since the sacrum
  narrows caudally — the opposite of the superomedial-to-inferolateral run originally asserted.)
  Alone on its slice (`hc-q8` and `hc-q15` share the one anchor), so tolerance is free and the cap
  is still 8 — 6–8 is reasonable.
- **#24 Abductors** — from the gluteus medius/minimus muscle mass over the iliac wing, descending
  onto the greater trochanteric facets (gluteus minimus to the **anterior** facet; gluteus medius
  to the **lateral** and **superoposterior** facets). The run is **essentially vertical on the
  coronal**, tilting slightly **inferolateral** if anything — the greater trochanter is the most
  lateral bony landmark of the hip (intertrochanteric width ~32 cm vs intercristal ~28 cm), so an
  **inferomedial** tilt is not anatomically available. Read the actual tilt off the slice before
  drawing. The existing reviewed `Gr. trochanter` anchor sits at the insertion end, 10.3 away from
  the abductor anchor — a useful bearing for the distal end, again subject to visual confirmation,
  and it caps tolerance at ≤ 5.

### Hip — `axi` (dedicated single left hip; iliopsoas tendon marks anterior, sciatic nerve posterior, per the plane's own orientation note)

- **#11 Posterior wall** — along the curved **posterior acetabular rim**, behind the femoral head.
  The posterior *column* extends well beyond this slice's rim, so the segment traces the wall, not
  the column.
- **#25 Abductors** — a curved sheet along the **lateral** margin of the hip, wrapping from
  gluteus minimus (deeper/anterior, to the anterior facet) round to gluteus medius
  (posterolateral facets).

### Hip — `sag` (dedicated single left hip; iliopsoas/anterior recess mark anterior, gluteals mark posterior, per the plane's own orientation note)

All three of #19/#7/#8 run roughly **parallel, along the anterior head-neck**, which is exactly
why their point markers sit 6.7–7.6 apart. The tolerance cap has already squeezed the three
circles to 3.35–3.81 so they no longer accept each other, but that mitigation is what a segment
here would undo: any authored tolerance above ~3.3 re-creates the overlap. They should be placed
together, in one sitting, as three offset lines with a small tolerance.

- **#19 Iliopsoas tendon** — the **most superficial/anterior** of the three: a near-vertical band
  descending along the front of the joint, crossing the anterior femoral head and angling
  slightly posteriorly toward the lesser trochanter.
- **#8 Capsule / iliofemoral ligament** — **deep to the iliopsoas**, draping the anterior
  head-neck as the low-signal roof of the recess.
- **#7 Anterior joint recess** — **deep to the capsule**, the thin sliver hugging the bone
  contour of the anterior head-neck. Order from surface to bone: iliopsoas → capsule/IFL →
  recess → cortex. If the three lines cannot be separated by more than ~3 on the actual image,
  the correct answer is to **retire one of the three items rather than widen any of them** (§8).
- **#14 Abductors** — on the lateral sagittal, tendons converging **inferiorly onto the
  trochanter** from the posterosuperior muscle mass.
- **#15 Femoral neck / head-neck junction** — from the head, **anteroinferiorly along the neck
  axis**, following the anterior waist.

### Elbow — `cor-t2fs` (distal humerus above, radius/ulna below; radial head marks the LATERAL side, per the plane's own orientation note)

- **#2 UCL anterior bundle** — a short, taut, near-vertical band from the **anteroinferior medial
  epicondyle** (superior, medial side) descending to the **sublime tubercle on the medial margin
  of the coronoid** (inferior, very slightly toward the joint centre). Short — the gain here is
  modest in absolute terms but it is the elbow's marquee structure and it is now asked three times
  (`ec-cor-q2`, `ec-cor-q9`, `ec-cor-q10`), which is what keeps it near the top of the list.
  Tolerance ≤ 4 (the `Trochlea` anchor is 10.8 away; the derived cap is already 5.4).
- **#9 Common extensor origin** — from the **lateral epicondyle** (superior, lateral side)
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
- **#12 Trochlea/capitellum articular surface** — the **curved subchondral arc** of the distal
  humerus. A single chord will either miss the ends of the arc or bulge toward the `Coronoid`
  (14.9) and `Olecranon` (13.6) anchors. Either wait for a polyline (§7) or accept a **short
  central chord with tolerance ≤ 5**; do not attempt the full arc with one segment.

---

## 5. Complete inventory — items that are fine as a point

All **71** remaining locate-eligible items in the three courses (120 total − 49 on the work-list),
grouped by plane. Verdict for every one: **fine as a point**, with the reason. Ordered within each
plane by how close they came to needing a region. Item ids include the questions the hip/elbow
expansion added on the same anchors — those inherit the verdict, since the verdict is a property of
the anchor and the plane, not of the stem.

Two anchors are **new since the original triage and were never triaged**; both are flagged
`UNTRIAGED` below and are the honest gap in this section (§10).

### Shoulder `sag-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ssag-q7`, `ssag-q12` | Glenoid & labrum | The labrum is a **ring** around the en-face glenoid, not a line — a segment is the wrong primitive. Marker sits on the glenoid; see §8 for the labral-clock-face question. |
| `ssag-q1` | Humeral head | Large compact area; marker central, most of the head is inside 8. |
| `ssag-q3` | Subscapularis (belly, medial slice) | Compact belly cross-section on this slice. |
| `ssag-q9` | Supraspinatus (belly, medial slice) | Belly is more compact here than on `sag-t1`; borderline, low yield. |
| `ssag-q6` | Acromion | Moderately elongated but bright, wide, and its 4.5 circle still covers the useful part. |
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
| `hc-q3` | Acetabular labrum | Small triangle capping the rim; capped at 3.3 by the sourcil 6.6 away. |
| `hc-q9`, `hc-q12` | Greater trochanter | Bony prominence, compact. |
| `hc-q7` | Pubic symphysis | Compact midline structure. |
| `hc-q1`, `hc-q11` | Femoral head | Large compact area; **but see §6 — below the floor, so it still scores at the flat 8 and its zone reaches the cartilage answer 5.6 away.** |

### Hip `axi`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ha-q4`, `ha-q8` | Iliopsoas tendon | **A dot on this plane** (elongated only through-plane). Contrast with `hs-q4` on the sagittal, which needs a region. |
| `ha-q6`, `ha-q9` | Sciatic nerve | Rounded fascicular cross-section. |
| `ha-q2`, `ha-q7` | Acetabular labrum | Compact triangle; capped at 3.9 by the iliopsoas 7.8 away. |
| `ha-q1`, `ha-q10` | Femoral head | Large compact area. |

### Hip `sag`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `hs-q3`, `hs-q12` | Acetabular labrum | Compact triangle; capped at 3.3 by the femoral head 6.7 away. |
| `hs-q1` | Femoral head | Large compact area. |

### Elbow `cor-t2fs`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-cor-q11` | Common flexor origin | **UNTRIAGED.** Added by the expansion. It is the medial mirror of the common extensor origin (#9), which *is* on the work-list, so by the same reasoning — a tendon fanning distally off the epicondyle — this probably needs a region too. Triage it on the actual slice before accepting the "fine as a point" default. |
| `ec-cor-q1`, `ec-cor-q6`, `ec-cor-q7` | Capitellum | Compact rounded condyle. |
| `ec-cor-q4`, `ec-cor-q8` | Trochlea | Compact spool-shaped surface. |
| `ec-cor-q5`, `ec-cor-q13` | Radial head | Compact disc. |

### Elbow `axi-t2fs` — **no changes needed on this plane**

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-axi-q1` | Ulnar nerve (cubital tunnel) | **A dot on this plane.** Elongated only through-plane. |
| `ec-axi-q2`, `ec-axi-q10` | Common flexor-pronator | Muscle mass in cross-section; compact wedge. |
| `ec-axi-q3`, `ec-axi-q9` | Common extensor origin | Cross-section, compact — contrast with `ec-cor-q3`/`ec-cor-q12`, the *same structure* on the coronal, which needs a region. |
| `ec-axi-q4`, `ec-axi-q6` | Brachialis | Cross-section. |
| `ec-axi-q5`, `ec-axi-q7`, `ec-axi-q8` | Triceps | Cross-section. |

### Elbow `sag-ir`

| Item id | Structure | Why a point is fine |
|---|---|---|
| `ec-sag-q6` | Anterior fat pad | **UNTRIAGED.** Added by the expansion. Expected to be a small triangle in the coronoid fossa, i.e. the anterior counterpart of `ec-sag-q1` — but confirm on the slice, because the *displaced* anterior fat pad the item teaches is a longer sail-shaped lucency than the normal one. |
| `ec-sag-q1`, `ec-sag-q9` | Olecranon fossa / posterior fat pad | Small triangle in the fossa. |
| `ec-sag-q2`, `ec-sag-q11` | Coronoid process | Compact bony beak. |
| `ec-sag-q4`, `ec-sag-q7`, `ec-sag-q8` | Olecranon | Compact bony beak. |

---

## 6. Second defect found while measuring: accepted zones that overlapped — mostly fixed

Point scoring cuts both ways. Under the old flat tolerance every non-region item accepted a
**16-wide circle**, so any two answers on the same slice closer than 8 apart accepted each other's
markers — a click on the **wrong** structure was scored **correct**. Across the four courses
**26 anchor pairs** sat that close.

**This has since been fixed for point items** by the derived per-item cap (§0): each item's radius
is now capped at half the distance to its nearest competing answer, so two point zones can touch
but never overlap. What follows is the current state, not the original census.

### 6a. Mitigated by the cap — nothing further to do

| Course / plane | Slice | Pair | Distance | Radius now |
|---|---|---|---|---|
| Hip `sag` | 11 | Femoral head ↔ Labrum | 6.7 | 3.35 each |
| Hip `sag` | 11 | Anterior recess ↔ Capsule/IFL | 6.7 | 3.35 each |
| Hip `sag` | 11 | Iliopsoas ↔ Capsule/IFL | 7.6 | 3.81 / 3.35 |
| Hip `axi` | 23 | Labrum ↔ Iliopsoas | 7.8 | 3.91 each |

The same mechanism silently tightened many anchors that were never in the ≤ 8 census — anything
within 16 of a neighbour now scores on a circle smaller than 8. §3's `Cap now` column is the
per-anchor result, and it is the ceiling every segment in §4 must respect, because **segments are
exempt from the cap**: authoring one wider than the value in that column hands the false positive
straight back.

### 6b. Below the usability floor — needs item redesign, not a tolerance

14 items' derived caps fell under `MIN_LOCATE_TOLERANCE = 3` (≈ 17 px in the ~560 px Locate viewer
— at the edge of what a fingertip can hit). The cap was deliberately **not** applied to these, so
they still score at the flat 8 and their zones still reach the neighbouring answer. Shrinking them
further is not the fix; two answers that close are asking the fellow to separate structures by
clicking that cannot be separated by clicking.

| Course / plane | Slice | Pair | Distance | Items still at flat 8 |
|---|---|---|---|---|
| Knee `cor-pdfs` | 7 | Tibial spines / eminence ↔ a plane-choice item on the same anchor | **2.2** | `cor-sid-3`, `cor-q11` — **neither is locate-eligible** (no `locateLabel`), so this pair has no effect on Locate today; it is on the list because the cap is computed over the whole plane bank |
| Hip `cor-t2fs` | 19 | Sourcil ↔ Cartilage | **4.1** | `hc-q2`, `hc-q13`, `hc-q4`, `hc-q14` |
| Hip `cor-t2fs` | 19 | Femoral head ↔ Cartilage | **5.6** | `hc-q1`, `hc-q11` |
| Knee `axi-t2fs` | 13 | Femoral trochlea ↔ Trochlear groove | **5.7** | `axi-sid-1`, `axi-q4`, `axi-q10` |
| Knee `sag-pdfs` | 13 | Patellar tendon band (tol 4) ↔ Hoffa's fat pad | 6.5 | `sag-q6` |
| Hip `cor-t2fs` | 19 | Sourcil ↔ Labrum | **6.6** | `hc-q2`, `hc-q13` (the labrum side *is* capped, at 3.29) |
| Knee `sag-t1` | 13 | Patellar tendon band (tol 4) ↔ Patella / Hoffa's | 15.5 / 9.2 | `t1-q3`, `t1-q6` — squeezed by the authored band, not by a point |

**12 of the 14 are actually reachable in Locate**; `cor-sid-3` and `cor-q11` are not locatable at
all, so they cost nothing today and would only bite if either item ever gained a `locateLabel`.
Of the 12 live ones, **six are hip `cor-t2fs`** (sourcil, acetabular cartilage, femoral head —
three answers within 5.6 of each other on slice 19) and six are knee. The knee `axi-t2fs` pair is
arguably benign, since the trochlear groove *is* part of the trochlea; the hip `cor-t2fs` cluster
is not — sourcil, cartilage and femoral head are three different answers.

This list is frozen in `locate-tolerance.test.ts` as `BELOW_FLOOR_ITEM_IDS`. It is the only escape
hatch from the no-overlap assertion, so a future anchor edit that crowds a new pair fails that test
rather than quietly re-widening a scoring zone. **Shrinking the list is always safe; growing it
needs a faculty decision.**

**Authoring rule, still in force for segments:**

> An item's accepted zone must never reach another locatable anchor on the same slice.
> `tolerance ≤ (distance to nearest other anchor on that slice) / 2`, and 4 unless there is a
> reason to go higher.

For point items this is now automatic. For the 28 segments in §3 it is manual, and for hip
`cor-t2fs` it cannot be satisfied at all — that plane needs the item-design decision in §8 *before*
segments are placed, or the segments will simply relocate the false-positive problem.

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
   quiz markers in sync via `sameAnchor`. The 28 segments now cover **49 items**, and **18 of the
   28 anchors are shared by 2–3 items each** (`scor-q2/q12/q13`, `ec-cor-q2/q9/q10`,
   `t1-q1/q5/q11`, `scor-q5/q10`, `axi-q6/q11`, `ssag-q2/q10`, `hs-q6/q9`, `hs-q7/q10`, …). The
   expansion roughly doubled the propagation surface, so this went from a nice-to-have to the
   single biggest source of future drift: if the editor does not propagate by anchor, a segment
   drawn for `ec-cor-q2` silently leaves `ec-cor-q9` and `ec-cor-q10` scoring as points.
3. **Warn on collision in the editor, and *especially* on segments.** With §6's rule encoded, the
   adjuster can compute the distance from a drafted region to every other anchor on the slice and
   refuse/flag a tolerance that reaches one. That is the single highest-value guard rail here,
   because `computeLocateTolerances` deliberately does **not** cap authored segments. CI does now
   catch it — `locate-tolerance.test.ts` scans segment↔point pairs at the authored tolerance — but
   catching it in the editor turns a failed build into a live nudge while the faculty member still
   has the slice open. Seeding the warning from §3's `Cap now` column would be exact.

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

Four groups mis-score for a reason that is not geometric, and adding a segment would paper over
it. Group 4 is new: it is the work the tolerance cap explicitly refused to do (§6b).

1. **`ssag-q4` "Infraspinatus / teres minor"** — one marker, two muscles named in the answer. A
   fellow who clicks teres minor is correct by the prompt. Either split into two items (each has
   its own reviewed tour marker on `sag-t1` already) or place the vertical segment in #21 and
   accept both.
2. **Glenoid & labrum items** (`ssag-q7`, `ssag-q12`, `scor-q4`, `t1-q4`) — the labrum is a
   ring/clock-face, and the prompt "Find the Glenoid & labrum" has no single correct answer. No
   segment fixes this. Suggested resolution: rename the locate label to the specific structure
   the marker is on (glenoid, or a named labral quadrant), leaving the identify prompt untouched.
3. **Hip `sag` anterior trio** (`hs-q4`; `hs-q6`/`hs-q9`; `hs-q7`/`hs-q10` — five items on three
   anchors after the expansion) — three answers stacked within 7.6 of each other along the same
   anterior contour. The cap has squeezed them to 3.35–3.81, which is *just* above the usability
   floor, so Locate is currently correct-but-hard here rather than wrong. Even perfectly placed
   segments will be within a few units of each other. Honest options: (a) keep all three with
   `tolerance` ≈ 2–3 and accept that this is a genuinely hard discrimination task (defensible —
   telling recess from capsule *is* the teaching point), or (b) retire one anchor from the locate
   pool by moving its items to identify-only. Note (b) now drops hip `sag` from 12 to 10
   locate-eligible items, comfortably above `MASTERY_SOURCE_COUNT` — the expansion made this option
   cheaper than it was.
4. **Hip `cor-t2fs` slice-19 cluster** (`hc-q1`/`hc-q11` femoral head, `hc-q2`/`hc-q13` sourcil,
   `hc-q4`/`hc-q14` cartilage, with `hc-q3` labrum 6.6 from the sourcil) — **six of the app's 14
   below-floor items sit here.** Sourcil, acetabular cartilage and femoral head are within 5.6 of
   each other, so no tolerance separates them and the cap declined to try; all six still score at
   the flat 8 and accept each other. This is the single largest content defect the analysis found
   and it is **not** segment work. Options, in the order I would try them: (a) reposition the
   sourcil and cartilage anchors further apart along the joint surface — they are genuinely
   distinguishable structures, just anchored too close; (b) merge sourcil and cartilage into one
   Locate answer and keep the distinction as an Identify item; (c) move the cartilage items to
   identify-only, which drops hip `cor-t2fs` from 15 to 13 locate-eligible items. Nothing in §3
   should be placed on this plane until this is decided.

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
4. **Set tolerance by the §6 rule and §3's `Cap now` column**, not by feel: never exceed `Cap now`
   (that is the radius the point item already scores on, and a segment is exempt from the automatic
   cap, so exceeding it re-opens a false positive), 4 by default below that, more only on isolated
   anchors (hip `cor-t2fs` `hc-q8`/`hc-q15` is the only clear case).
5. **Sanity-check both ends.** After drawing, click deliberately at each end of the structure and
   at the nearest *neighbouring* structure. Correct-along-the-length must pass; the neighbour
   must fail. That two-click check is the whole point of the change.
6. **"Copy marker changes"** exports `{ tour, quiz }` as JSON to the clipboard; paste it into the
   ticket for review and deployment. Drafts persist in `localStorage` keyed by image directory +
   plane id and are invalidated automatically when the committed content changes, so a long
   session can be split across days safely.
7. **`CrossPlaneAdjuster`** (same pages, just below) is a different bank — cross-plane correlation
   items, `CROSS_PLANE_FREE_TOLERANCE`. It is **not** part of this work-list; see §7.

**Blocked first, then by yield.** The two highest-yield planes are both hip and both blocked on
§8; do those decisions before any placement session, because they change the anchors the segments
would be drawn against.

| Order | Plane | Segments | Items | Plane yield (§1) | Note |
|---|---|---|---|---|---|
| **Unblock** | Hip `sag` | 5 | 9 | 3.8 | §8.3 — decide the anterior trio first |
| **Unblock** | Hip `cor-t2fs` | 5 | 9 | 3.0 | §8.4 — six below-floor items; **do not place segments yet** |
| 1 | Shoulder `cor-t2fs` | 4 | 7 | 2.9 | Largest unblocked win; marquee structures, cleanest geometry |
| 2 | Shoulder `sag-t1` | 4 | 6 | 2.5 | Four muscle bellies + the scapular spine, all well separated |
| 3 | Elbow `cor-t2fs` | 2 | 5 | 1.9 | Two segments cover five items; tightest tolerance discipline needed |
| 4 | Shoulder `sag-t2fs` | 3 | 4 | 1.7 | Cap already at 4.5 on the supraspinatus arc |
| 5 | Elbow `sag-ir` | 2 | 4 | 1.7 | One of the two is a curve — consider waiting for §7.1 |
| 6 | Hip `axi` | 2 | 3 | 1.4 | Not blocked; the crowded hip anchors are on the other two planes |
| 7 | Shoulder `axi-t2fs` | 1 | 2 | 0.9 | Single segment, hard 4.3 ceiling |
| — | Elbow `axi-t2fs` | 0 | 0 | 0 | Clean; every structure is a through-plane dot |

Each plane is one sitting, so the collision checks in §6 are done against a stable set.

**Tests to add alongside.** `src/components/normal/locate-tolerance.test.ts` now asserts the §6
rule generically across all four courses — "no two accepted zones on a shared series+slice
overlap", with `BELOW_FLOOR_ITEM_IDS` as the frozen escape hatch. That is the generic test this
document originally asked for, and it is already in place. Usefully, its `zoneGap` handles
segment↔point and segment↔segment pairs at the *authored* tolerance, so **an over-wide segment
fails CI rather than shipping** — the cap exemption in §0 is a runtime exemption, not a test
exemption. (The one hole: if either item of the pair is on the below-floor list, the pair is
exempt, which is another reason not to place segments on hip `cor-t2fs` slice 19.)

What is still missing is per-region coverage of the *accept* side, which no generic test can
supply. `knowledge-check-hit.test.ts` today only covers the four knee items, so for **each new
region** add one point at the far end of the structure that must be **accepted** — that is the
whole reason the segment exists — alongside one point on the nearest neighbouring answer that must
be **rejected**.

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
  the risk score is exact (it falls out of `buildKnowledgeRound` and was recomputed from the live
  content for this revision); the severity half is my estimate of in-plane extent relative to the
  field of view, carried over unchanged from the original triage. If a placement session shows a
  structure is smaller than I assumed, drop it down the list rather than forcing a segment.
- **Two anchors added by the expansion have never been triaged**, and are flagged `UNTRIAGED` in
  §5 rather than being silently defaulted: elbow `cor-t2fs` **common flexor origin**
  (`ec-cor-q11`) and elbow `sag-ir` **anterior fat pad** (`ec-sag-q6`). The first is the medial
  mirror of #9, which *is* on the work-list, so I would expect it to need a region too — if it
  does, the work-list becomes 29 segments and elbow `cor-t2fs` rises from 1.9 to about 2.3.
  Someone with the slice open should settle both before the elbow sitting.
- **`ec-cor-q2` (UCL) is the item I am least sure about geometrically.** The anterior bundle is
  short in absolute terms and may already sit mostly inside its 5.4 circle on a full-elbow coronal.
  I kept it at rank 2 because it is now asked three times and because the item's own teaching point
  is about the distal attachment — the "100 % of mastery attempts" argument that originally put it
  at rank 2 no longer holds and has been withdrawn. If the placement session shows the whole
  ligament inside the circle, it is fine to leave it as a point and say so.
- **The severity and "fine as a point" verdicts pre-date the tolerance cap.** They were formed
  against a flat 8 radius. Where §3's `Cap now` is well below 8 the accepted circle is smaller than
  the verdict assumed, so a few §5 entries — shoulder `ssag-q6` acromion (4.5), hip `hc-q3` labrum
  (3.3), hip `ha-q2`/`ha-q7` labrum (3.9), elbow `ec-cor-q1` capitellum (4.6) — are closer to the
  line than "fine as a point" suggests. None of them is elongated, so I did not move them, but they
  are the first place to look if fellows report Locate feeling unfairly tight on a plane with no
  segments on it.
