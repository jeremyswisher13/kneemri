import type { TopicFlashcards } from "@/content/flashcards/module-flashcards";

/**
 * Elbow MRI spaced-repetition flashcards, keyed by elbow module id + topicIndex.
 *
 * Every card is a recall-shaped restatement of a teaching point that already
 * exists in the elbow modules/search-pattern/reference content — no new medical
 * claims. Where the source content is deliberately hedged (isolated ulnar-nerve
 * T2 signal, the capitellar 5 mm cyst figure, distal-vs-proximal UCL
 * predominance, the distal-biceps repair window), the hedge is carried into the
 * answer so the card cannot teach a harder rule than the module does.
 */
export const elbowModuleFlashcards: Record<string, TopicFlashcards[]> = {
  "elbow-mri-orientation": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-mri-orientation-t0-1",
          question: "Which elbow MRI plane answers which question, and why must capitellar OCD be read on coronal AND sagittal?",
          answer: "Axial = nerves (ulnar in the cubital tunnel, radial/PIN), the annular ligament, the origins in cross-section, and the distal biceps footprint. Coronal = the UCL anterior bundle to the sublime tubercle, the RCL/LUCL complex, the epicondylar origins, and the radiocapitellar contact zone. Sagittal = the coronoid/olecranon fossae and radiocapitellar recess (loose bodies), the triceps insertion, and the fat pads. Capitellar OCD needs coronal (the contact face where the lesion lives) plus sagittal (its anterior-to-posterior extent and contour); a lesion convincing on one plane but absent on the orthogonal plane is more likely partial-volume artifact.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-mri-orientation-t1-1",
          question: "What does FABS positioning mean, and which two management-changing variables does it let you report?",
          answer: "Flexed elbow, ABducted shoulder, Supinated forearm, patient prone with the arm overhead. It lays the obliquely-running distal biceps flat and in-plane all the way to its radial-tuberosity footprint, so you can grade partial versus complete and measure retraction — the two variables that drive repair urgency and that standard planes foreshorten. (Lacertus fibrosus status, the third key variable, is read on axial.) FABS is for the distal biceps, not the UCL.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-mri-orientation-t2-1",
          question: "When does MR arthrography earn its needle at the elbow?",
          answer: "Only when the added detail changes a decision: a suspected partial undersurface UCL tear (T-sign) when non-contrast MRI is equivocal, OCD stability that will change the operation, or counting loose bodies / showing chondral delamination pre-op. Non-contrast 3T answers most elbow questions — tendons, OCD, nerves, occult fracture, loose bodies. A valgus-applied or flexed positioning adjunct can open the medial joint, but the elbow evidence base is thin compared with the shoulder ABER: present it as an adjunct, not a validated routine sequence.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-mri-orientation-t4-1",
          question: "Where does the capitellar pseudodefect sit versus a true capitellar OCD, and what separates variant from lesion?",
          answer: "The pseudodefect is a normal posterolateral / postero-inferior bare-area groove at the capitellum–lateral-epicondyle junction where the articular cartilage ends. True capitellar OCD is anterolateral/central, in the radiocapitellar contact zone, with a fluid rim, cyst, or fragment. Location plus a corroborating sign — not signal alone — makes the call. The transverse trochlear ridge/groove and a small synovial recess just distal to the UCL attachment are the other two routinely over-called normals.",
        },
      ],
    },
  ],
  "elbow-search-pattern": [
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-search-pattern-t1-1",
          question: "In the eight-step elbow search pattern, why are bones and marrow read as step 2 rather than last?",
          answer: "The disposition-changing lesions are osseous — an unstable capitellar OCD, an olecranon stress fracture, an occult radial-head fracture, the anteromedial coronoid facet, and marrow replacement — and those are exactly what is lost to end-of-read fatigue and satisfaction-of-search once an obvious tendinopathy is found. Read context (step 1) and bones/marrow (step 2) while attention is freshest, pair T1 (marrow, occult fracture lines) with fluid-sensitive fat-sat (edema, tears, denervation), and confirm every finding in at least two planes.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-search-pattern-t2-1",
          question: "You have called lateral epicondylitis. What is the required next step — and what is the medial equivalent?",
          answer: "Trace the LUCL to the supinator crest. The LUCL/RCL origin lies deep to the common extensor tendon, so a deep tear whose fluid-bright gap undercuts or communicates with the radiocapitellar joint and involves the LUCL implies PLRI — a surgical problem and a classic complication of prior lateral steroid injection or release. Medially, trace the UCL anterior bundle to the sublime tubercle and interrogate the ulnar nerve, because a coexistent UCL tear shifts a thrower's conversation toward reconstruction. Make the deep ligament a listed next step, not a matter of memory.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-search-pattern-t3-1",
          question: "Name the medial valgus triad and the post-trauma O'Driscoll circle, and state the order in which soft tissue fails in a dislocation.",
          answer: "Triad (every thrower's medial-pain read) = UCL anterior bundle + flexor-pronator origin + ulnar nerve. Circle (every dislocation / terrible-triad elbow) = LCL/LUCL, then the coronoid including the anteromedial facet, then the radial head, then the Osborne-Cotterill posterolateral capitellar impaction, then heterotopic ossification. Disruption proceeds lateral-to-medial — LCL/LUCL first, capsule next, MCL last — which is why the LCL is the primary lesion in most simple dislocations and valgus stability is often preserved.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-search-pattern-t4-1",
          question: "Where do elbow loose bodies settle, and which mimic must you exclude before committing to one?",
          answer: "In the dependent recesses — the coronoid fossa, the olecranon fossa, and the radiocapitellar recess — best seen against bright joint fluid on sagittal fluid-sensitive images (GRE blooms ossified bodies; CT/CT arthrography is most sensitive for small ossified bodies and for counting them pre-op). Exclude a thickened radiocapitellar plica / posterolateral synovial fold, which can cause lateral catching and mimics a loose body or OCD. Thickness helps but does not decide: the radiohumeral plica averages about 1.8 mm in asymptomatic elbows versus 2.5 mm in synovial fringe syndrome, a difference that is NOT statistically significant on mean thickness — only the proportion exceeding roughly 2.6 mm separates the groups (67% vs 13%). A separate 3 mm figure comes from the POSTERIOR (olecranon-level) fold, and that study likewise reported substantial overlap between symptomatic and asymptomatic plicae. So treat a plica thicker than roughly 2.5–3 mm as suggestive only when the patient has concordant mechanical symptoms, and never as a stand-alone diagnosis. And do not ascribe every loose body to a throwing lesion: in the non-thrower/laborer, primary elbow OA is the most common source.",
        },
      ],
    },
  ],
  "elbow-bones-marrow": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-bones-marrow-t0-1",
          question: "Which three discriminators separate Panner disease from capitellar OCD?",
          answer: "Age, focality, and reversibility. Panner is a self-limited osteochondrosis of the ENTIRE capitellar ossific nucleus in a younger child (~5–10 yr) — fragmented-looking and low-signal but with no discrete fragment, subchondral cyst, or loose body, and it remodels and heals. Capitellar OCD is a FOCAL anterolateral/central osteochondral lesion of the adolescent thrower or gymnast (~12–17 yr) that can fragment, delaminate, and shed a loose body. Read either on coronal plus sagittal, and do not call a normal CRITOE secondary ossification center — fragmented-looking by nature — a lesion.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-bones-marrow-t1-1",
          question: "What makes a capitellar OCD unstable on MRI — and which two findings are NOT stability signs?",
          answer: "Unstable if ANY of: a T2 fluid-bright line completely undercutting the fragment and matching joint-fluid signal, a sizeable or multiple subchondral cyst(s) deep to it, a high-signal cartilage cleft reaching the fragment (delamination), or a displaced fragment / loose body. Surrounding marrow edema is NOT a stability sign — stable and unstable lesions both have it — and an isolated high-T2 line without a cyst or cartilage breach is INDETERMINATE and may be healing granulation tissue. The often-quoted 5 mm cyst figure is De Smet's knee-derived criterion. It HAS been applied to the capitellum, but it performs poorly there: in surgically confirmed capitellar OCD in overhead athletes the De Smet criteria were about 89% sensitive and only 44% specific, so a 'positive' MRI over-calls instability roughly as often as not — while the criteria used together are highly sensitive, so a fully negative study is reassuring. Teach 'sizeable or multiple cysts' rather than a hard millimeter cutoff, and when stability is indeterminate and will change the operation, get arthrographic (MR or CT) or arthroscopic confirmation rather than trusting the number.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-bones-marrow-t2-1",
          question: "What separates an olecranon stress FRACTURE from a stress reaction, and what should a posteromedial olecranon osteophyte make you do?",
          answer: "A discrete low-signal fracture line (classically posteromedial/mid-olecranon) with marrow edema is a stress fracture — longer rest, and fixation is considered especially if it widens or displaces; edema WITHOUT a line is a lower-grade stress reaction. A posteromedial olecranon osteophyte is the chronic end of valgus extension overload, so go back and interrogate the UCL: debriding the osteophyte without addressing valgus laxity can unmask instability.",
        },
        {
          id: "fc-elbow-bones-marrow-t2-2",
          question: "In the skeletally immature thrower with a medial epicondyle apophyseal injury (Little League elbow), what triggers surgery?",
          answer: "In a throwing athlete: displacement of about 5 mm or more, an intra-articular / incarcerated fragment, or valgus instability. Report the millimeters and whether the fragment is intra-articular. MRI shows a widened, fluid-bright physis with adjacent marrow edema. The millimeter cutoff is debated in the general population, but incarceration or instability mandates surgery regardless of the number. Separately, the olecranon apophysis is among the last to fuse (roughly mid-to-late teens, later in throwers) — compare with the contralateral side rather than trusting a hard fusion age.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-bones-marrow-t3-1",
          question: "State the CRITOE order and the single load-bearing rule it gives you.",
          answer: "Capitellum, Radial head, Internal (medial) epicondyle, Trochlea, Olecranon, External (lateral) epicondyle. The quoted ages (~1, 3, 5, 7, 9, 11) are approximate mnemonics with wide normal and sex-based variation, so trust the ORDER and the contralateral comparison, not the exact ages. The rule: the trochlea NEVER ossifies before the medial epicondyle — so if you see a trochlea but no medial epicondyle, the medial epicondyle has been avulsed, often into the joint.",
        },
        {
          id: "fc-elbow-bones-marrow-t3-2",
          question: "What does a visible posterior fat pad mean after adult elbow trauma, and what is the real surgical trigger for a radial-head fracture?",
          answer: "The posterior fat pad sits hidden in the olecranon fossa and is normally invisible, so any visible (displaced) posterior fat pad in an adult after trauma means hemarthrosis from an occult intra-articular fracture until proven otherwise — the radial head most commonly (supracondylar in children). MRI shows a low-signal line plus fat-suppressed-bright marrow edema and separates a true fracture from a bone bruise (edema only). Mason I = non-/minimally displaced, II = displaced (commonly >2 mm) partial articular, III = comminuted whole-head — but the surgical trigger is a mechanical BLOCK to forearm rotation, a fragment displaced enough to impede motion, or comminution, NOT the 2 mm number alone.",
        },
      ],
    },
  ],
  "elbow-ucl-valgus": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-ucl-valgus-t0-1",
          question: "Which band of the UCL complex matters to the thrower, where does it run, and how do you read it?",
          answer: "The anterior bundle — the primary valgus restraint across the functional throwing arc (~20–120°), running from the anteroinferior medial epicondyle to the sublime tubercle of the medial coronoid. It is the band reconstructed in Tommy John surgery. The posterior bundle forms the floor of the cubital tunnel (relevant to the ulnar nerve, not valgus stability) and the transverse (Cooper) ligament is mechanically negligible. Read the anterior bundle as a thin, taut, uniformly low-signal band on coronal (or coronal-oblique) fluid-sensitive fat-sat prescribed along the band, tracing it separately from the common flexor-pronator origin that drapes over it.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-ucl-valgus-t1-1",
          question: "What is the threshold that separates a normal distal UCL synovial recess from an undersurface tear?",
          answer: "The articular-cartilage edge. A sliver of fluid undercutting the most distal fibers by a couple of millimeters at the sublime-tubercle attachment is a normal recess; the abnormal finding is fluid or contrast tracking distal to the sublime-tubercle margin BEYOND the edge of the articular cartilage — not 'any undercutting at all.' Over-calling the recess pushes a thrower toward an injection or an operation he does not need; under-calling a true undersurface tear ends a season.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-ucl-valgus-t2-1",
          question: "What forms the 'T' in the UCL T-sign, and why is MR arthrography the most sensitive study for it?",
          answer: "Fluid or contrast tracks medially along the sublime tubercle UNDER the distal UCL attachment, beyond the articular-cartilage edge; this medial limb meets the vertical joint-fluid column at a right angle, giving an inverted/right-angle 'T' while the ligament stays attached more proximally — the deep fibers are stripped off bone and the superficial fibers still hold. It is a partial-thickness undersurface (articular-sided) DISTAL tear and is routinely undercalled on non-contrast MRI, because the deep-surface tear may not fill with native joint fluid; intra-articular contrast actively undercuts it. Add MR arthrography when the question is surgically decisive and the non-contrast study is equivocal.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-ucl-valgus-t3-1",
          question: "What three things must a UCL report give the surgeon, and what is the honest caveat about distal versus proximal tears?",
          answer: "Surface/grade (sprain vs partial undersurface T-sign vs full-thickness — fluid-bright signal spanning the whole thickness with a gap/retraction or medial extravasation), location (proximal/humeral vs midsubstance vs distal/sublime tubercle), and chronicity (a thickened, heterogeneous, or ossified ligament reads chronic; clean fiber disruption reads acute). Caveat: distal-versus-proximal predominance is genuinely not uniform in the literature — teach the distal tear as a recognized, prognostically worse, under-recognized pattern that does worse nonoperatively, NOT as the most frequent lesion; proximal partials are the ones favored for nonoperative/PRP management. A <50%/>50% split is a descriptive heuristic, not a validated named UCL scale.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-ucl-valgus-t4-1",
          question: "How is a thrower's UCL injury managed, and which number can MRI not supply?",
          answer: "Most partial/low-grade tears are managed nonoperatively first — rest, flexor-pronator and kinetic-chain rehab, structured return-to-throwing, with PRP increasingly used especially for proximal partials. Reconstruction (Tommy John autograft) is the conversation for full-thickness tears in throwers wanting high-level return, high-grade or symptomatic partials that fail roughly 3–6 months of rehab, or valgus instability discordant with demand; repair ± internal brace has re-emerged for acute avulsion-type tears with good tissue. These boundaries and PRP efficacy are evolving — present decision drivers, not rigid cutoffs — and concurrent ulnar nerve transposition is selective (for preoperative ulnar symptoms or instability), not routine. MRI cannot supply the functional instability number: dynamic valgus-stress ultrasound quantifies medial ulnohumeral gapping. The best-validated cutoff is a SIDE-TO-SIDE stress-delta difference of about 1 mm (roughly 96% sensitive, 81% specific for tears needing surgery); the separately quoted ~2.4 mm figure is the WITHIN-elbow stress delta (unloaded vs loaded in the injured arm), not a side-to-side difference. Interpret both with care: asymptomatic professional pitchers already gap about 0.8 mm more on the dominant side, and published techniques differ substantially in applied load (25 N vs 150 N) and flexion angle (30° vs 90°), so apply a threshold only alongside the technique it was derived from.",
        },
      ],
    },
  ],
  "elbow-lcl-plri": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-lcl-plri-t0-1",
          question: "Trace the LUCL, and explain why it must be read on two planes.",
          answer: "Lateral epicondyle → arcing posterior to the radial head → supinator crest of the ulna. It is the principal restraint to posterolateral rotatory instability, and a normal LUCL is a thin, continuous, uniformly low-signal band to the supinator crest. Because it is an oblique, curving structure, partial-volume averaging on a single plane is the single most common reason it is missed — trace its posterolateral arc across consecutive coronal AND axial images. The rest of the complex: the RCL (epicondyle blending into the annular ligament), the annular ligament encircling the radial neck (best on axial), and the accessory LCL.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-lcl-plri-t1-1",
          question: "Which lateral-sided finding turns refractory 'tennis elbow' into a surgical instability problem, and what should you NOT over-call?",
          answer: "A fluid-bright gap at the common-extensor origin that undercuts or communicates with the radiocapitellar joint AND involves the LUCL — a deep tear implying PLRI, which converts a debridement into a ligament repair/reconstruction. PLRI is LUCL incompetence allowing posterolateral subluxation off the capitellum (the clinical lateral pivot-shift apprehension) and is the most common chronic/recurrent elbow instability; it follows dislocation/subluxation or iatrogenic injury from an aggressive lateral epicondylitis release, lateral corticosteroid injection, or radial-head surgery. Do NOT over-call reactive lateral-epicondyle marrow edema or a thin RCL signal alone as an LCL tear — a thickened T2-bright common extensor with intact deep fibers is tendinosis and stays conservative.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-lcl-plri-t3-1",
          question: "Why is a small anteromedial coronoid facet fragment a surgical lesion, and which classification applies to what?",
          answer: "It is the imaging signature of varus posteromedial rotatory instability (VPMRI) — a third instability mechanism distinct from valgus instability and from PLRI — usually with an accompanying LUCL injury. Small does not mean stable at the coronoid: untreated VPMRI drives early arthrosis. Use O'Driscoll to classify the anteromedial facet (the VPMRI lesion) and Regan-Morrey for coronoid HEIGHT (I = tip avulsion, II = ≤50%, III = >50%), which matters because the coronoid is the keystone of terrible-triad reconstruction. CT maps the osseous fragment best.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-lcl-plri-t4-1",
          question: "What is the terrible triad, and what determines whether a post-dislocation elbow goes to surgery?",
          answer: "Elbow dislocation + radial head fracture + coronoid fracture — surgical, with the coronoid and the LCL as the reconstructive keystones. The hinge is whether the joint stays concentrically reduced: an acute LUCL injury in a concentrically reduced, stable elbow is often nonoperative, whereas persistent/recurrent PLRI, an iatrogenic LUCL injury after lateral release or radial-head surgery, the anteromedial coronoid facet fracture (VPMRI), and the terrible triad all go to surgery. On every post-dislocation study also hunt the Osborne-Cotterill lesion (posterolateral capitellar impaction plus posterolateral capsular avulsion — the lateral analog of a Hill-Sachs that perpetuates recurrent PLRI) and post-traumatic heterotopic ossification, a common function-limiting cause of the stiff elbow.",
        },
      ],
    },
  ],
  "elbow-tendons": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-tendons-t0-1",
          question: "Which three anatomic structures decide every distal biceps read?",
          answer: "(1) The bifurcated radial-tuberosity footprint — the short head attaches distal/anterior and is the flexion lever, the long head proximal/posterior and the dominant supination lever, which is why undersurface partial tears along one limb are easy to under-grade. (2) The lacertus fibrosus, an aponeurotic expansion off the medial musculotendinous junction blending into the forearm flexor fascia; intact, it tethers the tendon and limits retraction even when the main tendon is fully torn. (3) The bicipitoradial bursa between the tendon and the tuberosity — a distended bursa is a clue to scrutinize the insertion, not a diagnosis, and a large one can compress the PIN/radial nerve.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-tendons-t1-1",
          question: "What three things must every distal biceps tear report contain, and what is the great mimic?",
          answer: "Partial versus complete, lacertus fibrosus intact versus torn, and retraction — where the stump sits, in centimeters. The great mimic is a COMPLETE tear with an INTACT lacertus: the tendon does not retract (or only minimally) and the exam can look near-normal, so it is routinely undercalled as a partial tear. A complete tear with a disrupted lacertus retracts proximally and leaves an empty tuberosity. On timing, do not teach a hard 2–4-week or graft-after-6-week deadline: earlier anatomic repair is technically easier, many primary repairs succeed out to roughly 4–6 weeks and beyond, and only chronic irreducible retraction that will not reach the tuberosity pushes toward a graft. Partial tears and tendinosis are managed conservatively first.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-tendons-t2-1",
          question: "Why does a near-complete triceps avulsion often look like a partial tear, and what should the report state?",
          answer: "Distal triceps tears characteristically fail SUPERFICIAL-layer-first: the posterior/superficial component — the combined long- and lateral-head tendon — avulses and retracts, often carrying an olecranon enthesophyte flake, while the deep, anterior medial-head attachment stays intact. A functionally near-complete avulsion can still read as 'partial' both clinically and on imaging, because an intact lateral expansion of the triceps (with the anconeus compensating) permits weak active extension — complete loss of active extension is present in only about 20% of ruptures. Triceps rupture is also uncommon (0.8% of the 1014 tendon ruptures in Anzel's classic series) and is frequently missed or diagnosed late for exactly that reason. Report the PERCENTAGE of tendon width torn, WHICH layer is torn, and the gap — not just 'partial' — and do not undercall a high-grade partial as tendinosis in a patient who cannot extend against resistance. Complete ruptures and high-grade partials (commonly >50% width, or any tear with extension weakness against resistance) are repaired. Raise suspicion with anabolic steroids, fluoroquinolones, renal failure/hyperparathyroidism, chronic olecranon bursitis, or local steroid injection, and look for the avulsed olecranon 'fleck' on the lateral radiograph.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-tendons-t3-1",
          question: "What is lateral epicondylitis pathologically, and what should you tell a patient about corticosteroid injection?",
          answer: "Angiofibroblastic TENDINOSIS, not inflammation, of the common extensor origin off the lateral epicondyle — the ECRB is the principal culprit. Grade it on the usual ladder: tendinosis (thickening plus intermediate signal, no surface-reaching fluid or gap) → partial (fluid-bright signal reaching a surface or a focal discontinuity, deep fibers intact) → full-thickness (complete fluid-bright gap at the origin). Corticosteroid injection gives only short-term benefit and may worsen long-term outcomes, so frame expectations accordingly — and never sign off a high-grade tear without tracing the LUCL to the supinator crest.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-tendons-t4-1",
          question: "Medial epicondylitis is on the images — what two additional structures must you trace, and why?",
          answer: "The UCL anterior bundle to the sublime tubercle and the ulnar nerve in the cubital tunnel. The common flexor-pronator tendon overlies the UCL and the ulnar nerve sits immediately posterior, and medial epicondylitis and UCL injury frequently coexist — a concomitant UCL tear shifts a thrower's conversation toward reconstruction, and coexisting ulnar neuritis changes symptoms and treatment. Medial epicondylitis is less common than lateral but is graded on the same tendinosis → partial → full-thickness ladder.",
        },
      ],
    },
  ],
  "elbow-nerves": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-nerves-t0-1",
          question: "What are the three phases of muscle denervation on MRI, and how early can the edema phase appear?",
          answer: "Denervation on MRI runs through three phases, but the first one is not a blind window. EARLY: fluid-sensitive (T2/STIR) muscle edema can appear within days — 24–48 h in experimental models, and as early as 4 days after symptom onset in patients — which is why MRI generally turns positive BEFORE EMG fibrillation potentials, which typically require ~2–3 weeks (range roughly 1–5 weeks, longer the farther the muscle sits from the lesion). SUBACUTE: established diffuse, feathery T2/STIR edema with preserved T1 signal and bulk — still potentially reversible with decompression or reinnervation. CHRONIC: T1 fatty atrophy with volume loss — not reversible. So denervation edema does NOT date the injury to weeks. Call it 'edema-phase' denervation and let the clinical history, not the edema, set the age; conversely, a normal MRI in the first few days does not exclude denervation. What the edema does tell you is LOCATION — name the affected muscles explicitly, because the constellation (isolated pronator quadratus vs the whole extensor compartment vs FCU plus ulnar intrinsics) is what localizes the nerve and the level, and the edema phase is the window in which decompressing a true mechanical lesion can still recover muscle.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-nerves-t1-1",
          question: "Why is isolated ulnar-nerve T2 hyperintensity at the cubital tunnel insufficient for neuritis, and what technique replaces the missing cutoff?",
          answer: "Mild intraneural T2 brightness occurs in asymptomatic elbows, because the nerve angulates and is closely apposed at the cubital tunnel — and there is no validated universal cross-sectional-area threshold. Instead, assess at the medial-epicondyle level on axial images and use two internal controls: the contralateral ulnar nerve (side-to-side asymmetry) and the ipsilateral MEDIAN nerve (a same-arm normal nerve that calibrates how bright is too bright). Anchor the diagnosis to caliber enlargement at or just distal to the medial epicondyle PLUS denervation of the ulnar-innervated muscles (FCU, the ulnar half of FDP, the ulnar intrinsics) PLUS clinical correlation — never signal alone.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-nerves-t2-1",
          question: "Which cubital-tunnel findings change the operation, and what imaging is required to see them?",
          answer: "Ulnar nerve subluxation/dislocation over the medial epicondyle favors anterior transposition rather than in-situ decompression, because an unstable nerve re-subluxates over a simple release. The medial head of the triceps can subluxate WITH the nerve (snapping triceps) — transposing the nerve alone leaves the snapping triceps, so the operation must address it. An anconeus epitrochlearis is an accessory muscle replacing Osborne's retinaculum that roofs and crowds the tunnel; recognize it as muscle, not a mass or ganglion. All of these are dynamic: assess on axial images in FLEXION, since a static neutral study underdiagnoses both the nerve and the triceps subluxation.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-nerves-t3-1",
          question: "What is the pattern of an AIN palsy, and why should it usually NOT go to decompression?",
          answer: "The anterior interosseous nerve (Kiloh-Nevin) is PURE MOTOR: it denervates flexor pollicis longus, FDP to the index/middle fingers, and pronator quadratus, giving weak pinch (an abnormal 'OK' sign) with NO sensory loss; MRI classically shows isolated pronator quadratus edema on axial fat-sat images. The caveat that stops a surgeon: an AIN palsy is frequently neuralgic amyotrophy (Parsonage-Turner), not a mechanical compression, so surgery is usually not indicated — pivot to EMG and observation and search the history for a viral/post-vaccination prodrome or a broader brachial-plexus pattern. Contrast this with pronator syndrome, which is MIXED sensory plus motor median compression (between the pronator teres heads, under the lacertus fibrosus, at the FDS arch, or at a ligament of Struthers with a supracondylar process).",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-nerves-t4-1",
          question: "How does PIN syndrome localize on MRI, which muscle must NOT be claimed as a constant sign, and what does radial tunnel syndrome look like?",
          answer: "The PIN is most commonly compressed at the arcade of Frohse, the proximal often-fibrous edge of the supinator, producing a digit drop with radially-deviated wrist extension because ECRL is spared. Localize by extensor-compartment denervation: extensor digitorum, EDM, ECU, APL, EPB/EPL, EI. The supinator is variably involved and often SPARED — its motor branches frequently arise proximal to the arcade — so do not assert supinator denervation as a constant PIN feature. Radial tunnel syndrome is lateral forearm PAIN without a motor deficit and often has a completely NORMAL MRI: say so rather than manufacturing a finding, and use the study to report or exclude a mass at the arcade (ganglion, lipoma, distended bicipitoradial bursa), since a space-occupying lesion changes management from splinting/therapy to surgical referral.",
        },
      ],
    },
  ],
  "elbow-dont-miss": [
    {
      topicIndex: 0,
      cards: [
        {
          id: "fc-elbow-dont-miss-t0-1",
          question: "A post-traumatic elbow radiograph is called normal but shows a displaced posterior fat pad. What have you been told, and who fractures what?",
          answer: "That there is hemarthrosis from an occult intra-articular fracture until proven otherwise — the anterior fat pad is normally seen (elevation = the sail sign), but the posterior fat pad hides in the olecranon fossa and should be invisible. In an adult, suspect the radial head first and run the radiocapitellar line (a line through the central long axis of the radial neck must bisect the capitellum on every projection) to catch an occult Monteggia. In a child, think supracondylar first and then the lateral condyle — usually a Salter-Harris IV and the elbow fracture most prone to nonunion and malunion (reported nonunion ~1–5%, higher than other pediatric elbow fractures). Do NOT rely on the fat pad sign to find the lateral condyle fracture: because it often tears the capsule, the hemarthrosis decompresses into the soft tissues and the fat pad sign can be FALSELY NEGATIVE. Its clue is lateral soft-tissue swelling on the AP view plus a subtle metaphyseal lucency; an isolated posterior fat pad without a visible line is the classic marker of an occult SUPRACONDYLAR fracture. Either way the answer is oblique views, MRI, or short-interval follow-up — not reassurance. MRI's job is the low-signal line plus fat-suppressed-bright marrow edema, separating a true fracture from a bone bruise.",
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: "fc-elbow-dont-miss-t1-1",
          question: "Which soft-tissue avulsions at the elbow convert a rehab plan into a same-week surgical conversation?",
          answer: "A complete distal biceps avulsion (empty radial tuberosity with a balled-up, retracted, wavy stump; left unrepaired it costs roughly 40% of supination strength and about 30% of flexion strength, with a much larger hit to supination ENDURANCE — on the order of 80%, and the endurance loss rather than the peak-strength loss is what most patients actually notice) — including the intact-lacertus mimic that neither retracts nor gaps and is routinely undercalled as partial. A complete triceps avulsion (full-thickness gap, retracted stump, often a small olecranon flake), remembering that it is the SUPERFICIAL posterior component (combined long and lateral heads) that avulses while the deep medial-head attachment stays intact, so it can look partial despite near-complete extension weakness. And the two ligamentous members: a full-thickness UCL tear in a thrower and a deep common-extensor tear involving the LUCL. Name each explicitly in the impression rather than letting it sink into a list.",
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: "fc-elbow-dont-miss-t2-1",
          question: "Which two bony patterns of the post-trauma elbow look small on radiographs but are inherently unstable and surgical?",
          answer: "The anteromedial coronoid facet fracture — a seemingly tiny rim fragment that implies varus posteromedial rotatory instability (VPMRI), a mechanism distinct from PLRI, and drives early arthrosis untreated; classify the facet with O'Driscoll and coronoid height with Regan-Morrey, and get a CT to map the fragments. And the terrible triad — dislocation plus radial head fracture plus coronoid fracture — where the coronoid and the LCL are the reconstructive keystones. Because the O'Driscoll circle runs lateral-to-medial (LUCL → capsule → MCL last), comment on LUCL integrity in EVERY post-dislocation elbow, and hunt the Osborne-Cotterill impaction and heterotopic ossification while you are there.",
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: "fc-elbow-dont-miss-t3-1",
          question: "A patient has a red, warm, fluctuant olecranon bursa and a reassuring-looking MRI. What is the correct action?",
          answer: "Aspirate it. The single most important teaching point about elbow infection is a limitation, not a sign: MRI cannot reliably exclude infection, and a normal-looking or 'reactive' study must not talk a clinician out of tapping a clinically inflamed bursa. Aseptic bursitis from gout, rheumatoid arthritis, or repetitive trauma can look identical to septic bursitis. Escalate urgently when the deeper compartments are involved — a joint effusion with aggressive periarticular edema and rim enhancement suggests septic arthritis, and marrow edema/replacement with cortical involvement suggests osteomyelitis, which cannot be confidently separated from aggressive inflammation on signal alone. MRI maps extent and raises the alarm; aspiration plus the clinical picture makes the diagnosis.",
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: "fc-elbow-dont-miss-t4-1",
          question: "What is the marrow red-flag pattern on elbow MRI, and which benign processes also lower T1?",
          answer: "Confluent low-T1 marrow signal that drops BELOW skeletal muscle or disc and lacks interspersed fat — marrow replacement, i.e. tumor or infiltration until proven otherwise — and it is most convincing when it keeps dangerous company: an associated soft-tissue mass, cortical destruction, or a wide/ill-defined transition zone. But red-marrow reconversion (athletes, smokers; signal stays at or above muscle, spares subchondral/epiphyseal fat, symmetric), fracture or stress-injury edema (a discrete line or a clinical injury; geographic, not mass-like), and osteomyelitis all lower T1 too. Judge by signal level relative to muscle/disc, loss of interspersed fat, and the company it keeps — not by T1 alone, and do not bury a replacement pattern as 'edema' on the fat-sat images.",
        },
      ],
    },
  ],
};
