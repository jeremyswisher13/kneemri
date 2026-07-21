# Knee MRI — Fellows Teaching Session · Faculty Run-Sheet

**Friday, July 24, 2026 · 1:00 – 3:00 PM** · Drs. Jeremy Swisher & Kimberly Burbank · 3 sports medicine fellows

> **Faculty copy. Contains every answer.** Do not hand this to the fellows and do not project it.
> The live version is in the app at **`/admin/session`** — same plan, with a **Projector-safe** toggle that hides everything faculty-only.

App: <https://jeremyswisherkneemri.com/courses/knee-mri>

---

## READ THIS FIRST — three things that change how you teach

**1. Hour 2 has no images to scroll.** This is the single most important operational fact in this document. In a case, the app shows images on the **first screen** (4 thumbnails, tappable to full size) and again on the **answer-key screen**. **Steps 1–7 render a checklist, a pearl box, and a text box — no image.** The fellows read the images up front, then reason from memory and notes. So:

  - Do **not** say "scroll to," "trace the," or "put your cursor on" during Hour 2. There is nothing to scroll.
  - **The plan: you drive the images from your device on the projector while the fellows work the checklist on theirs.** Open the case on your machine, stay on the first screen, and enlarge whichever image the current step needs.
  - The **"Open the full scrollable MRI on Radiopaedia"** button on the first screen is the only true scrollable stack. **Pre-flight it Wednesday** — it is an external site and it is the one thing that can fail in front of the room.
  - Image counts: Case 1 has 13, Case 2 has **2**, Case 3 has 6. Case 2 is image-poor — plan to lean on the projector and the Radiopaedia link there.

**2. The case spoils its own diagnosis on the opening screen.** The title reads "ACL Tear + Pivot-Shift Pattern," the tag chips read `acl`, `pivot-shift`, and the thumbnail captions read "Complete ACL tear — abnormal angulation, mid-substance rupture." **Do not fight this.** Reframe the exercise out loud at 2:05:

  > "You are not guessing the diagnosis — the app already told you. Your job is to **prove it and act on it**: find the evidence, name the companion injuries, and give me an impression a surgeon can use."

  That is the app's own pedagogy (its three-step card reads *Anchor normal → Commit findings → Clinical hinge*). It is a better exercise than guess-the-diagnosis anyway.

**3. The app's "match" indicator cannot detect negation.** It checks whether your text *mentions* related terms, and its own UI says "mentioned," not "correct." Short expected findings are the hole: `PCL intact` is one significant term, so typing *"PCL is not intact"* still registers. Say this once so nobody trusts the checkmark:

  > "Green means you used the right words. It does not mean you were right. I'm the grader."

---

## Canonical timeline

Everything below, and the `/admin/session` page, use these times. **Hour 2 is 48 minutes of case time, not 60** — three 20-minute cases do not fit, so Case 3 is deliberately the short one.

| Time | Block | Where |
|---|---|---|
| 12:50 | Pre-flight | — |
| 1:00 – 1:08 | Get in + orientation contract | Sagittal PD-FS · **Explore** |
| 1:08 – 1:26 | Sagittal PD-FS — Guided Tour (11 stops) | **Guided Tour** |
| 1:26 – 1:38 | Coronal PD-FS — roots, MCL, lateral corner | **Guided Tour → Explore** |
| 1:38 – 1:50 | Axial T2-FS — patellofemoral (9 stops) | **Guided Tour** |
| 1:50 – 1:58 | Practice & Mastery — axial | **Practice & Mastery** |
| 1:58 – 2:05 | Bridge + **5-minute** break | — |
| 2:05 – 2:22 | **Case 1** — ACL / pivot shift | Cases |
| 2:22 – 2:40 | **Case 2** — medial root tear | Cases |
| 2:40 – 2:53 | **Case 3** — patellar dislocation *(short case)* | Cases |
| 2:53 – 3:00 | Close | — |

**Hard checkpoints.** 1:26 coronal starts · 1:38 axial starts · 2:05 Case 1 opens · 2:22 Case 2 opens · 2:40 Case 3 opens. If you are late at any of them, cut from the block you are in, not from the next one.

---

## The two-faculty split

Fixed roles for the whole session. Swap only at the break.

| | **Driver** | **Floor** |
|---|---|---|
| Owns | The projector and the pace | The three fellows |
| Hour 1 | Calls every tour stop; nobody advances alone | Watches screens, catches whoever is lost, fixes devices |
| Hour 2 | Drives the case images on the projector; asks the step questions | Runs the two non-leading fellows; keeps the clock and calls "move on" |
| Says "we're moving on" | No | **Yes** — the Driver is mid-thought and will always run long |

Recommendation: **Dr. Swisher drives** (owns the content and the app), **Dr. Burbank floors** (owns the room and the clock). The Floor holds this run-sheet open at the timeline table.

---

## Pre-flight

**Wednesday (do not leave for Friday):**

- [ ] All three accounts are role **`fellow`**, not `resident` — **Case 2 is `residentVisible: false`** and dead-ends on a "Not Available" page. This is the single most likely way to lose 18 minutes.
- [ ] Open the Radiopaedia link on each of the three cases and confirm the stack loads.
- [ ] Check `/admin/session` roster: signed in · baseline quiz · confidence survey, all three.

**Friday 12:50:**

- [ ] Each device loads the workstation and the sagittal stack renders (first load needs network; offline caching only helps afterward).
- [ ] Projector mirrors **your** device, never a fellow's.
- [ ] Cases 1–3 pre-opened in tabs on the Driver's machine so nothing loads cold.
- [ ] If mirroring `/admin/session`, **Projector-safe ON**.

**Say once at 1:00, never again:**

> "Ground rule: nobody clicks anything blue that says 'See it injured.' Those are this afternoon's cases."

---

# HOUR 1 · 1:00 – 2:00 — Normal knee MRI

Fellows work on their own devices. The Driver calls every stop.

**Slice numbers below are the app's on-screen counter** (1-based: `22 / 29`, shown in **Explore** mode at the bottom of the viewer). Sagittal 29 slices, coronal 19, axial 28.

> ⚠️ **Two different slice numbers on the screen — head this off out loud.** The scanner's own number is *burned into the image pixels* (e.g. `15 of 30`, top/bottom of the picture) and it is **one higher and out of a different total** than the app's counter (`14 / 29`). Tell the fellows: **"Use the counter at the bottom of the viewer, not the number printed inside the picture."** Also note the app's slice counter only appears in **Explore**; Guided Tour shows "Step N of 11" and jumps to each slice for you.

**A structural fact worth knowing:** the **coronal and axial tours never change slice** — all 9 coronal stops sit on 8/19 and all 9 axial stops on 14/28. Only the sagittal tour moves. So anything posterior — including the meniscal roots — is **not on the tour** and requires dropping to Explore.

---

## 1:00 – 1:08 · Get in + the orientation contract

**Say:**

> "Knee course → Normal Knee MRI → **Explore** → Sagittal PD-FS. Don't touch Guided Tour yet."

> "Orientation is something you **verify at the workstation, not assume.** On *this* study, confirm that anterior is image-left and that scrolling runs medial → lateral — neither is a fixed rule: there's no display standard pinning anterior to a side, and because slice order runs along the patient's right–left axis, the medial/lateral scroll direction *flips between a right and a left knee* (and can differ by scanner/PACS). Coronal and axial are the reliable half — they follow the patient-anchored convention, so medial is image-left for a left knee, image-right for a right knee. **So on every new study: check laterality and the DICOM labels first**, confirm scroll direction against something you can name (fibular head = lateral; MCL = medial), then keep that side consistent across all three planes."

> "This is **PD fat-sat**: fluid bright, fat dark. Bright = water — effusion, edema, a tear filling with fluid. On T1, bright = fat and the finding is a *dark* line in the marrow. Don't carry the habit across."

> "Find your slice counter at the **bottom of the viewer** — it reads *number of 29*. Ignore the number printed *inside* the picture (that's the scanner's own, and it's off by one). When I say a number, get to the one at the bottom."

**Done when:** all three on the same series, each has said the orientation sentence back, each can point to their slice counter. **Do not proceed on two of three.**

---

## 1:08 – 1:26 · Sagittal PD-FS — Guided Tour

Stops **1–6 in 6 minutes** (naming). Stops **7–11 in 12 minutes** (reading).

**Spend the time on three stops:**

| Stop (on-screen slice) | Min | Hour-2 payoff |
|---|---|---|
| **3 · Tibial plateau** (14/29) | 2 | The app's own pearl names the posterolateral plateau as the pivot-shift site. Plant it now and Case 1's bruise is recall, not discovery. |
| **7 · Meniscus — bow-ties** (9/29) | 4 | Longest note in the tour; three pseudotears live here. Pays off in Case 1 step 4 and Case 2. |
| **9 · ACL** (22/29) | 4 | Case 1's entire step 5. |

**Say — stop 3, tibial plateau:**
> "Uniform marrow. Nothing to see. Remember what nothing looks like — in an hour one of you is looking at this exact corner, the **posterolateral plateau**, and it will be full of bright signal."

**Say — stop 7, menisci (slice 9/29, a medial slice):**
> "Two appearances, two slice levels. **Peripherally the meniscus is a continuous band — the bow-tie.** Scroll centrally and it opens into **two dark triangles**, anterior and posterior horn."

> "Count your bow-ties against your slice thickness — the rule is arithmetic, not biology. A normal body is ~10–12 mm wide, so on **4–5 mm** slices it spans **at least two** bow-ties. Fewer than two is the **absent-bow-tie sign** (Helms 1998). But rescale if you scan thinner — on 3 mm slices a normal body spans more, so 'fewer than two' no longer applies (and the discoid rule rescales with it). Treat it as a **trigger, not a verdict**: confirm with a second sign — fragment in the notch, double-PCL, truncated meniscus on coronals. Two signs together is what puts a surgeon on the other end."

> "Medially the posterior horn is normally the **bigger** one. A small squashed medial posterior horn is a finding, not anatomy."

> "The rule is a disjunction: **distortion OR grade-3 signal reaching an articular surface.** Requiring the finding on **two or more images** — *not necessarily consecutive; one sagittal plus one coronal at the same spot counts* — raises PPV to 94% medial / 96% lateral (De Smet & Tuite, *AJR* 2006). A touch on **one image only** is 'possibly torn.' Two exceptions: shape alone (a truncated or absent segment, a radial cleft) is a tear without grade-3 signal, and a **root on one slice still warrants the call**."

> "And three normal structures fake a lateral tear: the **popliteomeniscal fascicles / popliteus hiatus**, the **transverse intermeniscal ligament** where it meets the anterior horn, and the **meniscofemoral ligament** (Humphrey/Wrisberg) next to the posterior horn. Before you call a lateral tear, actively exclude all three."

**Say — stop 9, ACL (slice 22/29):**
> "Taut, continuous, **parallel to Blumensaat's line**. Fibers, not a blur. Trace it across at least three slices before you're allowed an opinion — a single slice through a normal ACL can look convincingly torn."

> "Normal ACL striations are fine. **Diffuse thickening with intact, continuous fibers is mucoid degeneration, not a tear** — a consequential over-call (6 of 10 such ligaments were read as torn but were intact at arthroscopy; McIntyre 2001). Look for the celery-stalk look: thickened, high signal on all sequences, but *continuous fibers*. The discriminator that carries the weight is **discontinuity** — present in ~97% of complete tears, 0% of mucoid degeneration. Clinically it's *posterior* knee pain with limited terminal flexion, not instability."

🔑 **Highest-yield sagittal move:** make every fellow trace the ACL across ≥3 slices and say "parallel to Blumensaat" out loud. That one habit is most of Case 1.

**Done when:** each fellow has traced the ACL across ≥3 slices and said it.

---

## 1:26 – 1:38 · Coronal PD-FS — roots, MCL, lateral corner

Orientation 30 s → stops 2–5 at 2:30 → **stop 6 wedges 2:30** → **the root detour 4:00** → stop 8 MCL 1:30 → **stop 9 LCL/PLC 45 s**.

**Say — stop 6, the wedges:**
> "Coronal gives you the meniscus as a **triangle** — sharp free edge pointing into the joint. Blunted, truncated, or signal reaching the surface is your tear."

**Say — the root detour (the important four minutes):**
> "Leave the tour. Go to **Explore** and scroll **posteriorly**. The tour never leaves slice 8, and the posterior root is not on slice 8 — which is exactly why root tears get missed."

> "Find where the posterior horn of the medial meniscus attaches to bone. The medial root sits **anteromedial to the PCL's tibial footprint** — on sagittal, immediately anterior to the PCL, along the posterior slope of the tibial eminence. Landmark it off the medial eminence: ~10 mm posterior and ~1 mm lateral to the apex (Johannsen, *AJSM* 2012, cadaveric — an anatomic guide, not an MRI ruler). Counterintuitive point worth saying: it's the *medial* root, not the lateral, that hugs the PCL. Now measure how far the meniscal body sits past the tibial margin on the mid-coronal image. **>3 mm is the conventional 'major' cutoff** (Gale 1999; used as the split by Costa 2004) — but treat it as a *search trigger, not a diagnosis*: it's sensitive and non-specific (mean medial extrusion in the general 50–90 population is 2.6 mm, and 64% of asymptomatic controls already exceed 3 mm; Svensson, *Eur Radiol* 2019). The honest teaching point is a range — pathologic is somewhere between 2 and 4 mm and the literature doesn't agree — and the number is worth more reported as a continuous value than as yes/no. Any extrusion ≥~3 mm sends you to inspect the root and hunt a radial tear; the extrusion is the flag, the root is the diagnosis. **Do not carry 3 mm to the lateral side** — the lateral meniscus barely extrudes normally (mean −0.1 mm) and averages only 2.0 mm even with a *complete* lateral root tear (Kamatsuki, *J Orthop Res* 2018), so 3 mm there misses the tear."

> "Everyone give me a millimetre number. Out loud."

**Say — stop 9, LCL / posterolateral corner (45 seconds, do not skip):**
> "Trace the LCL to the fibular head, then the popliteus tendon through its hiatus. The app's own pearl says the **posterolateral corner is commonly missed** — and a missed PLC is the classic reason an ACL graft fails. You look here every time."

**Coronal traps:** the **popliteus hiatus** mimicking a lateral meniscal tear; the normal **meniscofemoral ligament**; **magic-angle** signal in the LCL/popliteus at ~55° to B₀ (short-TE PD only — check it on T2).

🔑 **Highest-yield coronal move:** the root detour in Explore, with every fellow stating an extrusion number.

**Done when:** all three found the posterior medial root *in Explore* and said a millimetre number.

---

## 1:38 – 1:50 · Axial T2-FS — patellofemoral

All 9 stops sit on slice 14/28. Three matter: **trochlea (3)**, **trochlear groove (4)**, **MPFL (6)**.

**Say — stops 3–4, trochlea and groove:**
> "The trochlea is the grooved anterior femur the patella rides in, and the **lateral facet is normally longer** — that's the buttress that stops the patella going laterally. The deepest central point is the **groove**. Flatten this groove and you have **trochlear dysplasia**, which is the single strongest anatomic risk factor for dislocation."

**Say — stop 6, MPFL:**
> "Medial side, running toward the adductor tubercle. **This is the structure that tears in a lateral patellar dislocation — 90–100% of first-timers.** Point at it now so that in an hour you're recognising it, not hunting it."

**Axial traps:** normal patellar cartilage signal called chondromalacia; the **medial plica**; **magic-angle** in the retinacula.

🔑 **Highest-yield axial move:** every fellow points to the MPFL unprompted before the block ends.

---

## 1:50 – 1:58 · Practice & Mastery — axial

The mode button is labeled **"Practice & Mastery"** (not "Knowledge Check") — sub-tabs are **Identify / Locate / Mastery**. Each fellow runs it on their own device. The axial bank is **11 items**; a **Mastery Check** samples only **5 of 11** per round, so have them run **Identify** for the fuller pass (immediate feedback on all 11), and the blinded **Mastery Check** for the 70% pass.

**Two items to ask out loud afterward**, because they are Case 3's answers: the trochlear-groove item (flattening = dysplasia) and the MPFL item (*"the structure torn after a lateral patellar dislocation"*).

## 1:58 – 2:05 · Bridge + break

Screens closed. **Five minutes, not ten.** The break is where Hour 2's time gets stolen.

**Running behind?** Cut in this order: (1) the Practice & Mastery block — replace with 90 seconds of you asking the two items aloud; (2) axial stops 7–9; (3) sagittal stops 4–6. **Never cut the coronal root detour** — Case 2 depends on it.

---

# HOUR 2 · 2:05 – 3:00 — Three cases

**Format each time:** the leader drives; the other two have assigned jobs; you drive images on the projector; the leader closes with a two-sentence impression **before** anyone opens the answer key.

**Keeping the other two working** — assign these out loud, every case:
- **Observer A — the plane.** For every finding the leader names, A states which plane/sequence proves it.
- **Observer B — the consequence.** For every finding, B states what it changes in management.
- **The negative.** Both owe one deliberate negative — something they looked for and did not find.

| Case | Lead | Window |
|---|---|---|
| 1 · ACL / pivot shift | Riley Coon | 2:05 – 2:22 |
| 2 · Medial root tear | Sonal Singh | 2:22 – 2:40 |
| 3 · Patellar dislocation | Lilian Toaspern | 2:40 – 2:53 |

---

## CASE 1 · 2:05 – 2:22 — ACL tear + pivot-shift pattern

*22-year-old soccer player, noncontact pivot, effusion within 2 hours.*

**Open with (before images):**
> "Noncontact pivot, swollen in two hours. Before you look at anything — what do you expect to find, and where? Commit out loud."

### Walking the steps

| Step | Expected | Ask → Answer | Typical wrong answer |
|---|---|---|---|
| 1 Verify | Large hemarthrosis; **no** fat–fluid level | *"Why do I care about a fat–fluid level?"* → It means an intra-articular fracture. **Look on a non-fat-sat sequence** — fat-sat nulls the fat and the level vanishes. | "Check the axial" — the axial here is T2-**FS**, where it can disappear |
| 2 Bones | Edema **posterolateral tibial plateau + lateral femoral condyle** | *"Name the two bones, then name the mechanism."* → Pivot shift → ACL | Calling it a "clip injury." Posterolateral plateau edema is the pivot-shift footprint — that fellow just missed an ACL |
| 3 Cartilage | Contusion without chondral injury | *"Bruise or defect?"* → Marrow signal ≠ cartilage loss | Over-calling a defect under a bruise |
| 4 Menisci | **No answer key — three search instructions** | *"Lateral root, ramp, bucket-handle: which did you look at?"* | Silence, then "menisci unremarkable" |
| 5 Ligaments | **Complete ACL tear**; PCL/MCL/LCL intact | *"What proves it — the signal or the fibers?"* → **Discontinuity.** Secondary signs are specific but insensitive; discontinuous fibers is a tear regardless | "It's bright" — bright is not torn |
| 6 Extensor | Intact | — | — |
| 7 Other | Lateral soft-tissue edema; **check for Segond** | *"Tell me the lateral tibial cortex is intact — and that you looked."* | Assuming |

### The three must-see findings

1. **Complete ACL tear — discontinuity**, sagittal, confirmed on coronal. Not "bright signal."
2. **The pivot-shift pair** — posterolateral tibial plateau + lateral femoral condyle (terminal sulcus), named by bone and side.
3. **Large hemarthrosis with no fat–fluid level** — the deliberate negative that excludes a fracture.

### The missable — say the prompt verbatim

- **Ramp lesion** (posteromedial meniscocapsular junction). ~17% at arthroscopy, ~22% pooled prevalence; **MRI sensitivity ~48%** off the *real* preoperative report (DePhillipo, *AJSM* 2017), **65–71% pooled** in meta-analyses. *About half are missed on the actual report; even study-level reads miss a third. A negative MRI does not exclude it — say that out loud.* Look for the posteromedial tibial bruise (present in 72% of confirmed ramp lesions).
  > *"Present, absent, or equivocal — and if equivocal, what do you write?"* Answer: an explicit statement recommending intraoperative posteromedial assessment.
- **Lateral meniscal posterior root tear.** ~7–12% of ACL knees. It sits directly beneath the bruise everyone is staring at.
- **Segond fracture.** Lateral tibial rim just distal to the plateau. Classically associated with ACL tear in the large majority of series; treat as an ACL tear until the ACL is directly assessed.

> **The unifying line:** *"Every one of these is fixed by going to look, not by knowing more. The knowledge isn't the bottleneck — the scroll is."*

### So what (three sentences, not more)

Reconstruction is standard; **primary repair is narrow** — proximal avulsion-type tears with good remnant tissue, selected patients. **Your imaging job is to report the tear location**, because that is what decides whether repair is even discussable. And the companion injuries are the reason the MRI was ordered at all: the Lachman already told you the ACL is torn.

### The close

> "Close the laptop. You're on the phone with the ortho attending and you get **two sentences**."

**Model answer:** *"Complete ACL tear with the classic pivot-shift contusion pattern — lateral femoral condyle and posterolateral tibial plateau — and a large hemarthrosis without a fat–fluid level. I specifically looked at the lateral meniscal root, the posteromedial meniscocapsular junction and the lateral tibial rim; [findings], and there is no Segond fracture."*

**Then make the point:** sentence 2 is what makes you useful. *A surgeon can act on sentence 2. Nobody can act on "menisci unremarkable."*

### If a fellow asks

- **"Does the bone bruise change anything?"** Diagnostically yes (confirms mechanism, dates it as acute — bruises fade over ~3–12 months). Prognostically no: not a validated return-to-play gate.
- **"Why MRI if the Lachman is positive?"** Not for the ACL — for the ramp, the root, a bucket-handle that will lock the knee, a Segond, a PLC injury, a chondral fragment. Those change the operation.
- **"Repair or reconstruct?"** Reconstruct, unless it's a proximal avulsion with good tissue in a selected patient. Report the location.

---

## CASE 2 · 2:22 – 2:40 — Medial meniscal root tear + extrusion

*55-year-old recreational runner, 3 months of medial pain, no injury, mild medial JSN on weight-bearing films.*

⚠️ **Fellow-only case** (`residentVisible: false`) — verified Wednesday.
⚠️ **Only 2 teaching images.** Lean on the projector and the Radiopaedia link.

**Open with:**
> "This is the case that looks boring and isn't. Middle-aged, gradual, no trauma — everything about the history says 'degenerative tear, treat it non-operatively.' By the end I want you to tell me why that would be the wrong call."

### The distinction that is the whole case

**A degenerative posterior-horn tear** is common, usually non-operative, and gets a shrug. **A root tear** detaches the meniscus from bone, destroys hoop stress, and is **biomechanically equivalent to a total meniscectomy — peak contact pressure +25%** (Allaire, *JBJS* 2008). Same patient, same age, completely different conversation. Make them say the difference back to you.

### Walking the steps

| Step | Expected | Ask → Answer | Typical wrong answer |
|---|---|---|---|
| 1 Verify | Small effusion | *"Does a small effusion argue against anything serious?"* → No | Reassurance from a small effusion |
| 2 Bones | Subchondral edema **medial femoral condyle + medial tibial plateau**, no fracture line | *"Edema without trauma — why?"* → Overload. And rule out a **subchondral insufficiency fracture** (SIFK; SONK is its end stage) — a hypointense *line* paralleling the subchondral plate a few mm deep, **dark on T2/PD against the bright edema**, low signal on essentially every sequence. Classic: woman >50, medial femoral condyle, normal films — and very often *with* a medial root tear | Calling edema a bruise in an atraumatic knee |
| 3 Cartilage | Grade 2–3 medial thinning; other compartments preserved | *"Which compartment, and does that fit the meniscus?"* | Grading globally instead of by compartment |
| 4 **Menisci** | **Posterior medial root tear (ghost sign); extrusion >3 mm; lateral meniscus intact** | *"Is the meniscus attached to bone?"* → Ghost sign on sagittal, confirmed by a radial cleft on coronal/axial | "Degenerative posterior horn tear" |
| 5 Ligaments | All intact | *"Anything here to explain 3 months of pain?"* → No — which is the point | Hunting a ligament |
| 6 Extensor | Intact | — | — |
| 7 Other | Nothing significant — **but look for a Baker's cyst** | *"Where does a Baker's cyst live?"* → Between medial gastrocnemius and semimembranosus, posteromedially | — |

### The three must-see findings

1. **Complete radial tear at the posterior medial root** — ghost sign on sagittal, radial cleft confirmed on coronal.
2. **Extrusion >3 mm** — measured on **coronal, mid-body**, excluding osteophyte.
3. **Early medial overload** — grade 2–3 chondral thinning with subchondral edema. This is the finding that dates the problem and shapes the fork below.

### The missable

Root tears are among the most-missed findings in knee MRI, and the reason is mechanical: **the roots are posterior, and the coronal guided tour never leaves one slice.** The fix is the routine you built in Hour 1 — drop to Explore, scroll posteriorly, find the attachment anteromedial to the PCL footprint.

> ⚠️ **The app's only ghost-sign image is a LATERAL root tear.** This case is a **medial** root. Say that before a fellow anchors to the wrong compartment.

### So what — the management fork

Candidacy turns first on **symptoms** and on **how much OA is already there** (2025 international Delphi consensus, expert opinion): repair a symptomatic tear *without* advanced OA via transtibial pull-out; manage advanced OA non-operatively. **End-stage medial OA — Kellgren-Lawrence grade 4, a weight-bearing *radiographic* grade, not an MRI grade — is a contraindication** (98% agreement). KL 3 is a case-by-case call, not an absolute bar. Significant varus doesn't rule out repair — it may add a high tibial osteotomy. **Arthroscopic partial meniscectomy is the wrong operation** in a repairable root tear — not because it "removes remaining hoop function" (the compartment already loads as if the meniscus were gone) but because it forfeits the only procedure shown to restore hoop stress; in a matched cohort, progression to arthroplasty was 9/15 after meniscectomy vs 0/15 after repair (Bernard, *AJSM* 2020, Level III).

**What makes this time-sensitive is the natural history, not the birthday.** Age is *not* an independent outcome predictor (Eseonu, *AJSM* 2022); baseline cartilage status, extrusion, and varus are. In the long-term non-operative cohort, **53% reached arthroplasty at a mean of 14 years and 95% failed non-operative care** (Krych, *AJSM* 2023). The corollary for *this* patient: definite joint-space narrowing on weight-bearing films suggests he may already be a marginal repair candidate — a reason for a prompt surgical opinion with long-leg alignment films, not a reason to promise him a repair.

### The close

**Model answer:** *"Complete radial tear at the posterior root attachment of the medial meniscus, with a ghost root on sagittal and medial body extrusion greater than 3 mm on coronal. This is functionally a total meniscectomy and early medial overload is already present, so refer for surgical assessment — candidacy for root repair depends on OA grade, alignment and extrusion, not on the tear alone."*

### If a fellow asks

- **"Isn't this just a degenerative tear?"** No — it's detached from bone. Hoop stress is gone. That's a different disease from a degenerative flap.
- **"Does repair actually prevent arthritis?"** It improves function and slows progression in appropriately selected knees; it is not proven to prevent arthritis. Selection is everything.
- **"What do I tell them about running?"** Be honest that return-to-run after a root tear isn't well established. The one published criteria set (Monson & LaPrade 2025, expert opinion) is *functional*, not radiographic: minimal effusion, pain ≤2/10, quad symmetry ≥70%, tolerating a mile of brisk walking without a flare — with return around 6 months. Weight-bearing/long-leg films matter *at diagnosis* to stage cartilage and varus; they don't clear someone to run, and symptoms are not to be ignored. Shared decision with surgeon and PT.

---

## CASE 3 · 2:40 – 2:53 — Transient lateral patellar dislocation

*17-year-old basketball player, knee "popped out" while cutting, reduced spontaneously. Medial tenderness, moderate effusion.*

⏱ **This is the short case — 13 minutes.** Run steps **1 → 2 → 3 → 5 → 6** and skip the numbers chapter; the thresholds are on the quick-reference card if anyone asks.

**Open with:**
> "The patella is already back where it belongs. Nothing on this MRI is dislocated. Your job is to convict a dislocation nobody witnessed — from the wreckage it left behind. What evidence would convict?"

### Walking the steps

| Step | Expected | Ask → Answer | Typical wrong answer |
|---|---|---|---|
| 1 Verify | Moderate–large effusion, possible hemarthrosis | — | — |
| 2 Bones | **Medial patellar facet + anterolateral lateral femoral condyle** — "kissing contusions" | *"Two bones. Why those two?"* → The medial patella strikes the LFC as it relocates | Naming only one |
| 3 Cartilage | Osteochondral defect medial patella; **search every recess for a loose body** | *"Where do fragments hide?"* → Notch, gutters, suprapatellar pouch, posterior recesses | Stopping at the patella |
| 5 Ligaments | **MPFL tear — name the site**; medial retinacular disruption; cruciates/collaterals intact | *"Femoral, midsubstance, or patellar?"* | "The MPFL is torn" without a site |
| 6 Extensor | Patella alta assessment; VMO edema | *"Is this knee built to do this again?"* | Skipping predisposing anatomy |

### The three must-see findings

1. **The kissing contusion pair** — medial patellar facet + anterolateral LFC.
2. **MPFL tear with the site named.** Torn in ~90–100% of first-time dislocators. *Note: the tear site is genuinely split across series (patellar-sided predominates in several, femoral 34–50%); **this case is femoral** — don't generalise from it.*
3. **Osteochondral injury — and a deliberate statement about a loose body.** Present or absent.

### The missable — the fragment

This is the finding that turns a brace into an operation. **Sweep every recess on the fluid-sensitive sequences: notch, medial and lateral gutters, suprapatellar pouch, posterior recesses.** A fellow who says "osteochondral defect of the medial patellar facet" and stops has done half the job — the donor site is only half; where the fragment *went* is the other half.

### So what

- **First-time dislocator, no fragment:** non-operative is reasonable first-line **for a low-risk knee** — PT-guided quad and gluteal rehab, brace only briefly and only for comfort (ESSKA 2024 found *no* evidence a brace beats no brace). It's no longer a universal default, and it's explicitly *not* the gold standard in skeletally immature knees. Name the risk being accepted: recurrence after conservative care is ≥25%, up to ~70% in children/adolescents.
- **What pushes toward surgery:** a **displaced osteochondral fragment or loose body**. ESSKA 2024 repairs a chondral *or* osteochondral fracture ≥**1 cm²** in the patellofemoral contact area (expert consensus, Grade C — not outcome-validated); purely chondral flakes count, and the threshold is lower in skeletally immature knees. Refixation is first-line, and **delayed refixation is preferred over discarding the fragment** — timing is the document's weakest recommendation. A concomitant MPFL reconstruction is recommended when a fragment is fixed.
- **Recurrence** is driven by age (skeletally immature highest), **trochlear dysplasia**, patella alta, and a **femoral-sided MPFL tear**.
- **The randomised data on acute MPFL repair are mixed** — Palmu (*JBJS* 2008, adolescents) found no difference vs non-operative. Don't state it as settled either way. MPFL **reconstruction** is the workhorse for recurrent instability; a tubercle osteotomy is *added* for genuinely elevated TT-TG, not substituted.

### The close

**Model answer:** *"Transient lateral patellar dislocation — complete MPFL tear at the femoral insertion with the classic kissing contusions at the inferomedial patellar facet and anterolateral femoral condyle, plus a full-thickness osteochondral defect of the medial patellar facet. [A displaced fragment in the lateral gutter makes this operative rather than braced / No loose body identified]; predisposing anatomy is present, and TT-TG measured on MRI runs lower than on CT, so confirm before anyone plans a tubercle procedure."*

### If a fellow asks

- **"Brace or surgery for a first-timer?"** Brace and rehab, unless there's a displaced osteochondral fragment.
- **"Will they re-dislocate?"** Risk rises with youth, trochlear dysplasia, alta, and a femoral-sided MPFL tear. A dysplastic 17-year-old is high-risk.
- **"Does the MPFL heal?"** It heals, but often lax — which is why recurrence is common and why reconstruction (not repair) is the durable option.

---

## 2:53 – 3:00 · Close

1. **Each fellow names one search-pattern change** they will make on Monday. Go around the room; don't accept "be more systematic."
2. **The post-assessment.** Say why: *"Same structure as the baseline. The pair is the only thing that measures whether this afternoon did anything. It doesn't have to be today — but it does have to be this week."*
3. The course stays open, works offline, installs to the home screen.

---

# QUICK REFERENCE

## Numbers

| Measure | Number | How / caveat |
|---|---|---|
| **Meniscal extrusion (medial)** | pathologic ≈ **2–4 mm**, disputed | Coronal, mid-body, excluding osteophyte. 3 mm is the conventional "major" split (Gale 1999; Costa 2004) but is *sensitive, not specific* — mean is 2.6 mm in the 50–90 population, 64% of asymptomatic controls exceed 3 mm (Svensson, *Eur Radiol* 2019). A **search trigger**, best reported as a continuous number. **Do not apply to the lateral meniscus** (normal ≈0; 2.0 mm even with a complete lateral root tear — Kamatsuki 2018) |
| **Two-image touch** | PPV **94%** medial (NS, p=0.37) / **96%** lateral (p=0.02) | Distortion **or** grade-3 signal on **two or more images** — *not necessarily consecutive*; one sagittal + one coronal at the same spot counts (De Smet & Tuite, *AJR* 2006). One image = "possibly torn." The gain is real only laterally, and it costs sensitivity. **Root exception:** a root on one image still warrants the call (De Smet 2009) |
| **Meniscal signal grades** | 1 globular · 2 linear intrasubstance · **3 reaches a surface = tear** | Grade 2 is common over 40 — degeneration, not a tear. Shape alone (truncated/absent segment, radial cleft) is also a tear without grade-3 signal |
| **Anterior tibial translation** | **≥5 mm** = 58% sens / **93% spec** / 69% acc | **Both cutoffs are Vahey, *Radiology* 1993** (midsagittal LFC method). ≥7 mm = every knee torn *in that series* — a small-subgroup observation, **not Chan, not a validated threshold**. Chan (*AJR* 1994) is a *different* measurement (posterior-cortex tangents, 5-mm bins) and endpoint (complete tear): >5 mm, 86%/99%. A high-specificity **rule-in** — state which technique you used |
| **Deep lateral femoral sulcus** | **>1.5 mm** (>2 mm highly specific) | Cobby, *Radiology* 1992 — derived on **lateral radiographs**; carried over to sagittal MRI |
| **Segond fracture** | ACL tear in the large majority of series | Present in ~9–12% of ACL tears. Treat as ACL tear until the ACL is directly assessed |
| **Ramp lesion with ACL** | **~17%** arthroscopy; ~22% pooled | 16.6% (DePhillipo *AJSM* 2017); pooled prevalence 21.9% (Kunze *AJSM* 2021). MRI sens **~48%** off the real preop report; **65–71% pooled** in meta-analyses (spec ~88–94%). **A negative MRI does not exclude it** |
| **Lateral root tear with ACL** | **~7–12%** | Feucht *KSSTA* 2015 (15%); SANTI (~7%) |
| **Bone bruise in acute ACL tear** | **~80%** | Fades over 3–12 months — a chronic ACL knee may have none |
| **Root tear biomechanics** | Contact pressure **+25%** = total meniscectomy | Allaire, *JBJS* 2008 (cadaveric); repair restored it |
| **TT-TG (CT)** | **≥20 mm** abnormal | Dejour 1994, **measured on CT**. A **risk factor, not an isolated indication** (whether TT-TG alone justifies osteotomy is genuinely contested) |
| **TT-TG (MRI)** | MRI abnormal ≈ **≥15 mm**; the CT 20 mm cutoff ≈ **16 mm** on MRI | MRI runs ~2–4 mm lower than CT (pooled Δ 1.8 mm, 3.8 mm in operative knees — Camp 2013; Tan 2020). **Never carry the CT 20 mm number onto an MRI — it under-calls.** State the modality |
| **Insall-Salvati** | Normal 0.8–1.2; **>1.2 = alta** | Tendon ÷ patellar diagonal. The one index whose normal values still apply **on MRI** |
| **Caton-Deschamps** | Normal 0.6–1.2; **>1.2 = alta** | Distalization planning — but **measure on a lateral radiograph, not MRI** (single-slice MRI inflates it up to 9%; Martinez-Cano *KSSTA* 2022) |
| **Trochlear depth** | **≤3 mm** = dysplastic | Axial, 3 cm above the joint line, off the cartilage contour (Pfirrmann, *Radiology* 2000) |
| **Lateral trochlear inclination** | **<11°** | Most cranial slice where trochlear cartilage first appears; both lines on **subchondral bone** (Carrillon, 2000) — a **different slice level** from Pfirrmann. Single-image LTI under-calls; recheck a borderline value |
| **Sulcus angle** | **>145°** (Merchant view) dysplastic; normal ≈137–138° | The *view* is Merchant *JBJS* 1974; the *numbers* are later (Tecklenburg, Dejour). **On MRI the cutoff is landmark-specific: ~145° on bone but ~154° on cartilage** (Tanaka *AJSM* 2023) — match the cutoff to what you traced |
| **Lateral patellar tilt** | **>20°** abnormal | Patellar transverse axis vs posterior condylar line |
| **MPFL after first dislocation** | Torn in **~90–100%** | **Name the site.** Tear site is *split* — patellar-sided predominates (~48%) over femoral (~34%) in pooled MRI data (Migliorini 2021); femoral-sided carries higher recurrence risk |
| **Cartilage grading** | Modified Outerbridge 0–4 | 1 signal change · 2 <50% · 3 >50%, bone not exposed · 4 full-thickness, bone exposed. **Don't call it ICRS to a surgeon** |

## Bone bruise → mechanism → ligament

| Pattern | The two bones | Predicts |
|---|---|---|
| **Pivot shift** | **Posterolateral tibial plateau + lateral femoral condyle** (terminal sulcus) | **ACL** — then hunt lateral root / ramp / bucket-handle |
| **Dashboard** | **Anterior proximal tibia** (single bone) | **PCL**, posterior capsule |
| **Patellar dislocation** | **Medial patellar facet + anterolateral LFC** | **MPFL — name the site**, osteochondral fragment, loose body |
| **Clip / valgus** | **Prominent lateral femoral condyle + a smaller *medial femoral condyle* focus** (avulsive, at the MCL) | **MCL** — interrogate both menisci |
| **Hyperextension** | **Anterior femoral condyles + anterior tibial plateau** | ACL and/or PCL, posterior capsule |

*The bruise is the fingerprint — name the two bones first, then go prove the ligament.* (Sanders, *RadioGraphics* 2000)
⚠️ **Clip ≠ pivot shift.** LFC + **posterolateral tibial plateau** is the pivot-shift footprint; a fellow who calls that pair a clip injury has missed an ACL. But the reverse trap is bigger: a **medial** focus does *not* exclude a pivot shift — contrecoup posteromedial plateau edema is part of the described pivot-shift pattern, and medial femoral condyle / plateau contusions appear in ~24–26% of arthroscopy-proven ACL ruptures. A medial focus alongside the lateral pair signals a *higher-energy* injury, not a lower chance of ACL tear.

## Sequence logic

| Sequence | For | Best single thing |
|---|---|---|
| **T1** | Anatomy and marrow, no fat sat | A **fracture line** — dark line in bright fatty marrow. Also marrow replacement |
| **PD-FS** | The workhorse — meniscus, cartilage, marrow edema at once | **Internal meniscal signal** — where you diagnose tears |
| **T2-FS** | Fluid | **True fluid** — cleft, cyst, effusion |

**Lipohemarthrosis needs a NON-fat-suppressed sequence.** Fat-sat nulls the fat and the level vanishes. The session's axial is T2-**FS**.

## The 7 steps

1 **Verify & Orient** — right patient, right side, planes, sequences, the clinical question in one sentence
2 **Bones & Marrow** — alignment, then edema; for every bruise ask *which pattern*
3 **Cartilage & Osteochondral** — by compartment + sweep the recesses for loose bodies
4 **Menisci** — AH → body → PH both sides, **both roots**, two-slice-touch, extrusion on coronal
5 **Ligaments** — ACL primary + secondary, PCL, MCL layers, **LCL/PLC**, MPFL
6 **Extensor Mechanism** — quad, patella, patellar tendon, retinacula; patellar height lives here
7 **Synovium/Bursae & Other** — effusion, **fat–fluid level**, Baker's cyst, popliteal fossa

## Don't-miss list

1 Posterior medial root tear · 2 Ramp lesion in an ACL knee · 3 Displaced bucket-handle (double-PCL, absent bow-tie) · 4 Osteochondral fragment after patellar dislocation · 5 **Posterolateral corner** (a recognized contributor to ACL graft failure; caught early on MRI, missed late — 72% missed at first presentation) · 6 Segond / tibial spine / arcuate avulsions · 7 Subchondral insufficiency fracture or marrow-replacing lesion · 8 Bicruciate injury = spontaneously reduced knee dislocation → **vascular assessment today**

## Impression language

> **Sentence 1 (the lesion):** structure + precise location + grade/completeness + the one secondary sign that proves it.
> **Sentence 2 (the hinge):** what it does to the joint or what it changes in management — plus the one thing imaging cannot answer.

Enforce: name the **compartment** and the **third** (root/horn/body), never just "medial meniscal tear." Put **one number** in sentence 1. Hedge only where MRI genuinely can't answer. **Ban "clinical correlation recommended"** as the whole second sentence — it must say *correlate for what decision*.

---

# WHERE THE APP IS WRONG — correct these at the projector

| Where | What it says | Say instead |
|---|---|---|
| Module 4 bruise table | Clip injury = LFC + **lateral tibial plateau** | Clip (pure valgus) = prominent **lateral femoral condyle** + a smaller **medial *femoral condyle*** focus (avulsive, at the MCL) — Sanders 2000. LFC + *lateral tibial plateau* is the **pivot-shift** footprint, and should trigger a hard ACL look |
| Module 4 bruise table | Pivot shift = "valgus + internal rotation" | Say "valgus with rotation." Sanders (*RadioGraphics* 2000) describes external tibial rotation; the pivot-shift *test* describes internal. Specify the frame only if pressed |
| Case 2 ghost-sign image | The ghost-sign teaching image (`33_..._GhostMeniscus.jpg`) is a **lateral** root tear, used in a **medial**-root case | Say it before anyone anchors — and it's on the fix list to swap for the medial image (`32_..._Coronal.jpg`) once faculty confirm the JPEG |
| Case 1 step 4 | No expected findings to reveal | It's three search instructions, not a finding. Frame it as discipline |
| Case 1 answer key | The read-out pulls from steps 2–3 and **never shows the ACL tear** | *"The app proves the mechanism. You still have to say the diagnosis."* |
| Sulcus angle FAQ ("<144°") | Number is fine on MRI **bone**, but unlabeled | It's defensible on MRI using *bony* landmarks (~145° by ROC; Tanaka 2023) — **not** a radiographic error. Add: cartilage landmarks run higher (~154°). Match the cutoff to the landmark |
| MPFL teaching (workstation + module) | Tear site taught as **femoral-predominant** | Pooled MRI data are **patellar-predominant** (~48% vs ~34% femoral; Migliorini 2021). Femoral-sided carries higher *recurrence* — true, but it's not the commonest site |

---

# FAILURE MODES

| Problem | Fix |
|---|---|
| **Case 2 won't open for a fellow** | Their role is `resident`. Change it in `/admin` — this is why you check Wednesday |
| Fellow can't sign in on iPhone | Safari or Chrome directly, not an in-app browser. Sign-in uses a popup |
| Images won't load | Hard reload (pull down / Cmd-Shift-R). First load needs network |
| Radiopaedia link dead | Fall back to projecting the case's own teaching images from your device |
| A fellow never did the baseline | Have them do it at 1:00 — 10 minutes — rather than skip it. The pair is the measurement |
| Device dies | Pair them onto a neighbour's screen. Do not stop the room |
| Room goes quiet | Go to the assigned jobs: *"Observer A — which plane proves that?"* |
| Projector mirroring the run-sheet | **Projector-safe ON** at the top of `/admin/session` |
| Running behind in Hour 1 | Cut the Practice & Mastery block, then axial stops 7–9, then sagittal 4–6. **Never the coronal root detour** |
| Running behind in Hour 2 | Case 3 is already the short one. Cut its steps 1 and 6, keep 2, 3, 5 |
