/**
 * The talk. Single source of truth.
 *
 * Screens read from here and render; they never hold copy or figures of their
 * own. Every number in this file came from the deck and is quoted as given.
 *
 * `steps` is how many clicker presses happen inside a scene, counting the
 * entrance as step 0. `moment` names the one step that carries the scene's
 * orchestrated animation — everything else holds still and readable.
 */

export type SceneId =
  | 'cold-open'
  | 'three-forces'
  | 'ahead-of-mandate'
  | 'how-we-led-it'
  | 'results'
  | 'where-weve-taught'
  | 'portfolio'
  | 'innovathon'
  | 'the-gap'
  | 'national-picture'
  | 'vision-2028'
  | 'roadmap'
  | 'phase-registry'
  | 'phase-foundations'
  | 'command-centre'
  | 'command-centre-build'
  | 'predict-and-scale'
  | 'measuring-success'
  | 'risks'
  | 'lesson-and-close'

export type Tone = 'chalk' | 'line' | 'signal' | 'alert'

/** A number that counts up while its width axis expands. */
export interface Figure {
  value: number
  prefix?: string
  suffix?: string
  label?: string
  tone?: Tone
}

interface Base {
  sheet: string
  title: string
  steps: number
  moment: number
  seconds: number
  notes: string
  /** Seen in the presenter panel only: lines that did not fit on the sheet at 28px. */
  cues?: string
}

// ─── Per-scene content ──────────────────────────────────────────────────────

export interface ColdOpen {
  lines: string[]
  title: string
  subtitle: string
  byline: string
}

export interface Force {
  name: string
  figure?: Figure
  caption?: string
  /** A second, smaller before-and-after beside the main figure. */
  change?: { from: string; to: string; caption: string }
  body?: string
}

export interface ThreeForces {
  forces: Force[]
  footer: string
}

export interface AheadOfMandate {
  nodes: { date: string; label: string }[]
  span: string
  clipping: { headline: string; source: string }
  tags: string[]
}

export interface HowWeLedIt {
  framework: string
  stages: { name: string; detail: string }[]
  /** Dates of the photographs under stage 1, as taken. */
  photos: string
  flip: { from: string; to: string; caption: string }
}

export interface Results {
  figures: Figure[]
  footnote: string
  /** Dates of the photographs in the column, as taken. */
  photos: string
}

export interface WhereTaught {
  heading: string
  subline: string
  adoptedLine: string
  legendAdopted: string
  /** Dates of the photographs in the strip, as taken. */
  photos: string
}

export interface Portfolio {
  lanes: { name: string; items: string[]; speed: number }[]
  centre: { image: string; url: string }
  line: string
}

export interface Innovathon {
  /** As printed on the delegate badge and the event site. */
  title: string
  date: string
  /** Final 55.9s of the event reel, cut before its own closing card. */
  video: string
  videoSeconds: number
  counters: Figure[]
  coverage: string
  spreadIntro: string
  spread: string[]
  url: string
}

export interface TheGap {
  dots: number
  headline: string
  gaps: { name: string; body: string }[]
  lens: string
}

export interface Vision2028 {
  heading: string
  vision: string
  hospitalsCaption: string
  hospitals: { type: string; detail: string }[]
  rings: { name: string; body: string }[]
  footer: string
  objectives: { verb: string; rest: string; note?: string }[]
}

export interface Roadmap {
  rails: { htpn: string; kkm: string }
  phases: {
    n: number
    name: string
    dates: string
    achieved?: boolean
    htpn: string
    kkm: string
    doneWhen: string
  }[]
  /** Phase 2, the workshop that has already happened. */
  milestone: {
    underway: string
    title: string
    where: string
    attendance: string
    speakers: { name: string; role: string }[]
    line: string
    stamp: string
  }
  enablers: string[]
}

export interface NationalPicture {
  heading: string
  total: { value: number; label: string }
  withThis: { value: number; label: string }
  manual: { value: number; label: string }
  rollout: { caption: string; years: { year: string; add: number }[] }
  budget: { amount: string; label: string }
  depth: { line: string; foundAt: string; sites: string[]; closer: string }
}

export interface MeasuringSuccess {
  heading: string
  columns: [string, string]
  rows: {
    n: number
    name: string
    indicators: string
    achieved?: boolean
  }[]
  note: string
}

export interface Risks {
  stamp: string
  columns: [string, string]
  first: { severity: string; risk: string; mitigation: string }
  rest: { risk: string; mitigation: string }[]
}

export interface PhaseRegistry {
  heading: string
  kicker: string
  tiers: { name: string; body: string }[]
  footer: string
}

export interface PhaseFoundations {
  heading: string
  piles: { name: string; body: string; tick?: string }[]
  doneWhen: string
}

export interface CommandCentreBuild {
  heading: string
  kicker: string
  range: { from: string; to: string }
  milestones: string[]
  rules: string[]
  doneWhen: string
}

export interface CommandCentre {
  hub: { name: string; strapline: string }
  streams: { name: string; source: string }[]
  alert: string
  evidence: string[]
  footer: string
}

export interface PredictAndScale {
  headline: { from: string; to: string }
  items: string[]
}

export interface LessonAndClose {
  before: string
  strike: string
  after: string
  lines: string[]
  closing: string[]
  thanks: string
  codes: { label: string; url: string }[]
}

export type Scene =
  | (Base & { id: 'cold-open'; content: ColdOpen })
  | (Base & { id: 'three-forces'; content: ThreeForces })
  | (Base & { id: 'ahead-of-mandate'; content: AheadOfMandate })
  | (Base & { id: 'how-we-led-it'; content: HowWeLedIt })
  | (Base & { id: 'results'; content: Results })
  | (Base & { id: 'where-weve-taught'; content: WhereTaught })
  | (Base & { id: 'portfolio'; content: Portfolio })
  | (Base & { id: 'innovathon'; content: Innovathon })
  | (Base & { id: 'the-gap'; content: TheGap })
  | (Base & { id: 'national-picture'; content: NationalPicture })
  | (Base & { id: 'vision-2028'; content: Vision2028 })
  | (Base & { id: 'roadmap'; content: Roadmap })
  | (Base & { id: 'phase-registry'; content: PhaseRegistry })
  | (Base & { id: 'phase-foundations'; content: PhaseFoundations })
  | (Base & { id: 'command-centre'; content: CommandCentre })
  | (Base & { id: 'command-centre-build'; content: CommandCentreBuild })
  | (Base & { id: 'predict-and-scale'; content: PredictAndScale })
  | (Base & { id: 'measuring-success'; content: MeasuringSuccess })
  | (Base & { id: 'risks'; content: Risks })
  | (Base & { id: 'lesson-and-close'; content: LessonAndClose })

// ─── The talk ───────────────────────────────────────────────────────────────

export const SCENES: Scene[] = [
  {
    id: 'cold-open',
    sheet: 'S-01',
    title: 'Cold open',
    steps: 1,
    moment: 0,
    seconds: 45,
    content: {
      lines: ['A public hospital.', '135 years old.', 'No vendor to wait for.'],
      title: 'Built From Within',
      subtitle: 'HTPN Digital Roadmap 2025–2028',
      byline:
        'Dr Ferwahn Fairis bin Ab Karim · Acting Deputy Director, Hospital Tengku Permaisuri Norashikin, Kajang · Ministry of Health Malaysia',
    },
    notes: `Good afternoon. I'm Fairis, from Hospital Tengku Permaisuri Norashikin in Kajang, a public hospital that is a hundred and thirty-five years old. Eighteen months ago, a small team of clinicians decided not to wait for a vendor. We decided to build it ourselves. This is the story of what we built, and where it goes next.`,
  },

  {
    id: 'three-forces',
    sheet: 'S-02',
    title: 'Three forces',
    steps: 3,
    moment: 0,
    seconds: 69,
    content: {
      forces: [
        {
          name: 'Pressure',
          figure: { value: 128, prefix: '+', suffix: '%', tone: 'alert' },
          caption: 'Dengue admissions, June 2026 vs the year before.',
          change: {
            from: '200+',
            to: '500+',
            caption:
              'Births a month: almost tripled since moving from the old building to the new Women & Child Centre.',
          },
        },
        {
          name: 'Vendor lock-in',
          body: 'Every change request has a price. Data can leave our control.',
        },
        {
          name: 'Opportunity',
          body: 'AI and low-code let clinicians build working tools in weeks.',
        },
      ],
      footer: 'Change fails when it is delegated. It succeeds when it is led.',
    },
    notes: `Three forces made this necessary. Pressure: beds are full, staff are tired, and this June our dengue admissions rose a hundred and twenty-eight percent. Births have almost tripled since we moved into the new Women and Child Centre, from two hundred to more than five hundred a month. Vendor lock-in: procurement is too slow for problems that change every month. And opportunity: for the first time, clinicians can build real tools in weeks. The limit is no longer technology. It's leadership.`,
  },

  {
    id: 'ahead-of-mandate',
    sheet: 'S-03',
    title: 'Ahead of the mandate',
    steps: 2,
    moment: 1,
    seconds: 38,
    content: {
      nodes: [
        {
          date: 'April 2025',
          label: 'HTPN starts in-house, clinician-led digital and AI development',
        },
        {
          date: '5 June 2026',
          label:
            'Cabinet directs all government digital services to be developed in-house',
        },
      ],
      span: '14 months',
      clipping: {
        headline:
          'Anwar directs all government digital services to be developed in-house',
        source: 'The Star, 5 June 2026',
      },
      tags: ['data sovereignty', 'access to source code', 'civil service talent'],
    },
    notes: `In June this year, the Prime Minister directed that all government digital services be built in-house, for data sovereignty, source code access and civil service talent. We started fourteen months earlier. We weren't reacting to the policy. We were already a working example of it.`,
  },

  {
    id: 'how-we-led-it',
    sheet: 'S-04',
    title: 'How we led it',
    steps: 5,
    moment: 4,
    seconds: 61,
    content: {
      framework: "Kotter's eight steps",
      stages: [
        {
          name: 'Leaders learn first',
          detail: 'Monash, EDLP with MIT Sloan & ASB, LSE',
        },
        {
          name: 'Our own syllabus',
          detail: 'everyone leaves having built something',
        },
        { name: 'Quick wins', detail: 'shipped in weeks' },
        { name: 'Reward the builders', detail: 'a national Innovathon' },
      ],
      photos: '11 Apr – 29 May 2025',
      flip: {
        from: '85% outsourced',
        to: '85% insourced',
        caption: "DBS Bank's shift. Our benchmark.",
      },
    },
    notes: `We ran this as a change programme, not an IT project. Leaders learned first, so we had credibility. We wrote our own syllabus, and everyone leaves having built something. We chose small, visible quick wins. And we celebrated the builders. Our benchmark was DBS Bank, which moved from eighty-five percent outsourced to eighty-five percent insourced.`,
  },

  {
    id: 'results',
    sheet: 'S-05',
    title: 'Results',
    steps: 1,
    moment: 0,
    seconds: 34,
    content: {
      figures: [
        { value: 1300, suffix: '+', label: 'healthcare staff trained', tone: 'signal' },
        { value: 50, suffix: '+', label: 'in-house apps in active use', tone: 'signal' },
        {
          value: 35,
          suffix: '+',
          label: 'workshops, 15 by external invitation',
          tone: 'signal',
        },
        { value: 0, prefix: 'RM', label: 'software licensing cost', tone: 'signal' },
      ],
      footnote: 'Figures as of October 2026.',
      photos: 'Oct 2025 – May 2026',
    },
    notes: `Eighteen months in: more than thirteen hundred staff trained, more than fifty apps in daily use, thirty-five workshops, fifteen of them because other hospitals and services invited us. And zero ringgit in software licences.`,
  },

  {
    id: 'where-weve-taught',
    sheet: 'S-06',
    title: "Where we've taught",
    steps: 2,
    moment: 0,
    seconds: 55,
    content: {
      heading: 'Invited, not imposed.',
      subline: '15 external sessions in 12 months. 5 in the last two.',
      adoptedLine: 'We taught. They built.',
      legendAdopted: 'cyan ring = runs a tool built on our model',
      photos: 'Nov 2025 – Oct 2026',
    },
    notes: `And then people started inviting us. Fifteen sessions in twelve months: hospitals, community groups, and whole national services. Northern, central and southern O&G. Family Medicine. Medical Services. From Alor Setar to Johor Bahru, and across the sea to Kuching. Five of those were in the last two months alone. And here's what happened next. The hospitals we taught started building their own tools, in Marudi, Sri Aman, Mukah, Penang and Johor. We taught. They built.`,
  },

  {
    id: 'portfolio',
    sheet: 'S-07',
    title: 'The portfolio',
    steps: 1,
    moment: 0,
    seconds: 39,
    content: {
      lanes: [
        {
          name: "Patient's journey",
          speed: 54,
          items: [
            'GynaeClerk',
            'AntenatalClerk',
            'Fetal Kick Chart',
            'Medexa',
          ],
        },
        {
          name: "Doctor's journey",
          speed: 68,
          items: [
            'OT Scheduling System',
            'EBL Estimator AI',
            'TherapyAI',
            'Clinical Document Checker',
            'Skin Diary Generator',
            'Gynae Census',
          ],
        },
        {
          name: 'Management productivity',
          speed: 61,
          items: [
            'Dashboard ED',
            'Roster Scheduling',
            'CGR Web Form',
            'DLP Dashboard',
            'MedMove Pro',
            'MEDEVAC E-Request',
            'HIRARC Portal',
            'OSH-Alert',
          ],
        },
      ],
      centre: {
        image: 'shot-showcase.webp',
        url: 'https://htpn-showcase-v2.vercel.app/',
      },
      line: 'Built by clinicians, for clinicians.',
    },
    notes: `These are real tools, used daily: theatre scheduling, an AI blood-loss estimator, an emergency department dashboard. And some of them weren't built by us. They were built by hospitals in Penang, Johor and Sarawak that learned our model. Scan the code and look for yourself.`,
  },

  {
    id: 'innovathon',
    sheet: 'S-08',
    title: 'Innovathon',
    steps: 2,
    moment: 1,
    seconds: 76,
    content: {
      title: 'AI Productivity Intelligence Innovathon 2026',
      date: '21 July 2026',
      video: 'innovathon.mp4',
      videoSeconds: 55.9,
      counters: [
        { value: 200, label: 'delegates' },
        { value: 28, label: 'finalists' },
        { value: 9, label: 'winners' },
        { value: 13, label: 'external judges' },
      ],
      coverage: 'Covered by BERNAMA.',
      spreadIntro: 'The model is spreading:',
      spread: [
        'Hospital Pulau Pinang',
        'Kepala Batas',
        'Sultanah Aminah',
        'JKN Sarawak',
        'the national O&G, FMS and Internal Medicine services',
      ],
      url: 'https://udppkhtpn-hue.github.io/innovathon2026/',
    },
    notes: `In July we took it national. Innovathon 2026: two hundred delegates, twenty-eight finalists, thirteen judges from industry, academia and government, some of them in this room. Several winners came from other hospitals that adopted our model.`,
  },

  {
    id: 'the-gap',
    sheet: 'S-09',
    title: 'The gap',
    steps: 2,
    moment: 1,
    seconds: 66,
    content: {
      dots: 50,
      headline: '50 apps ≠ one hospital',
      gaps: [
        {
          name: 'Fragmentation',
          body: 'separate spreadsheets, rarely talk to each other or the HIS',
        },
        { name: 'Sustainability', body: 'many tools depend on one builder' },
        {
          name: 'Governance',
          body: 'registration, PDPA classes, AI rules incomplete; shadow-IT risk',
        },
        { name: 'Evidence', body: 'few before-and-after measures' },
      ],
      lens: 'MIT CISR lens: strong shared insights, a growing developer community; weak operational backbone and accountability.',
    },
    notes: `But success created a new problem, one you'll all recognise. Fifty apps is not one hospital. Our tools sit on separate spreadsheets. Many depend on a single builder. Governance hasn't caught up, and we lack the evidence to know what to scale. In MIT's terms, we have the community. We don't yet have the backbone.`,
  },

  {
    id: 'national-picture',
    sheet: 'S-10',
    title: 'The national picture',
    steps: 3,
    moment: 0,
    seconds: 67,
    content: {
      heading: '135 of 155 hospitals are still manual.',
      total: { value: 155, label: 'MOH hospitals' },
      withThis: { value: 20, label: 'have THIS, the Total Hospital Information System' },
      manual: { value: 135, label: 'still manual' },
      rollout: {
        caption: 'THIS rollout target, hospitals added each year',
        years: [
          { year: '2026', add: 16 },
          { year: '2027', add: 26 },
          { year: '2028', add: 44 },
          { year: '2029', add: 49 },
        ],
      },
      budget: { amount: 'RM 1 billion', label: 'budget for THIS' },
      depth: {
        line: 'Even in hospitals that have THIS, it did not cover the whole work process.',
        foundAt: 'We found it at',
        sites: ['Hospital Cyberjaya', 'Hospital Port Dickson', 'WCC, HTPN Kajang'],
        closer: 'Our apps fill the gaps around it.',
      },
    },
    notes: `Now zoom out from our hospital to the whole country. The Ministry runs a hundred and fifty-five hospitals. Twenty have THIS, the Total Hospital Information System. A hundred and thirty-five are still manual. THIS is coming: sixteen hospitals this year, then twenty-six, forty-four and forty-nine, on a budget of one billion ringgit. That's the right investment, and we're not competing with it. But even where THIS is live, it doesn't cover the whole work process. We saw that ourselves at Hospital Cyberjaya, at Port Dickson, and in our own Women and Child Centre. So our apps fill two gaps: the years before THIS arrives, and the work it was never designed to cover. And that's why our roadmap can't stop at Kajang.`,
  },

  {
    id: 'vision-2028',
    sheet: 'S-11',
    title: 'Vision 2028',
    steps: 4,
    moment: 1,
    seconds: 85,
    content: {
      heading: 'A lighthouse, not an island',
      vision:
        'An intelligent public hospital that sees its patient flow in real time and owns its digital solutions, and a lighthouse whose proven tools any KKM hospital can adopt.',
      hospitalsCaption: 'One ministry. Very different hospitals.',
      hospitals: [
        { type: 'Type 4 district hospital', detail: '30–150 beds' },
        { type: 'Type 3', detail: 'minor specialty disciplines' },
        { type: 'Type 2', detail: 'major specialty disciplines' },
        { type: 'State hospital (Type 1)', detail: '1,000+ beds' },
      ],
      rings: [
        {
          name: 'Facility-specific',
          body: "Built for HTPN's own setup. Stays local.",
        },
        {
          name: 'Service- or discipline-specific',
          body: 'Travels to every hospital running that service (e.g. our O&G tools, already used by the national O&G service).',
        },
        {
          name: 'General',
          body: 'Patient-journey apps any KKM hospital can use, from district to state.',
        },
      ],
      footer: 'Build locally. Scale what travels.',
      objectives: [
        { verb: 'Govern', rest: 'what we build' },
        { verb: 'Integrate', rest: 'for patient flow' },
        { verb: 'Prove', rest: 'the value' },
        { verb: 'Sustain', rest: 'the capability' },
        {
          verb: 'Scale',
          rest: 'what travels',
          note: '(general and service-specific apps, packaged for any KKM hospital)',
        },
      ],
    },
    notes: `Before the route, the destination. By 2028 we want two things at once: a hospital that sees its patient flow in real time and owns its own solutions, and a lighthouse other hospitals can learn from. But KKM hospitals are not the same. A district hospital may have thirty beds. A state hospital has more than a thousand. So not every app should travel. Some are built for our setup. Some belong to a discipline, like our O&G tools, already used nationally. And some, like patient-journey apps, work anywhere. Build locally. Scale what travels.`,
  },

  {
    id: 'roadmap',
    sheet: 'S-12',
    title: 'Roadmap',
    steps: 5,
    moment: 1,
    seconds: 135,
    content: {
      rails: { htpn: 'HTPN · the lighthouse', kkm: 'KKM · scale what travels' },
      phases: [
        {
          n: 1,
          name: 'Ignite',
          dates: 'Apr 2025–Jul 2026',
          achieved: true,
          htpn: 'Started Apr 2025, ahead of the Cabinet directive. Leaders learned first, then our own syllabus. 1,300+ trained, 50+ apps, RM0 licensing. National Innovathon, 21 Jul 2026.',
          kkm: '15 external sessions in 12 months. Model adopted by Hospital Pulau Pinang, Kepala Batas, Sultanah Aminah, JKN Sarawak and the national O&G, FMS and Internal Medicine services.',
          doneWhen: '',
        },
        {
          n: 2,
          name: 'Protect & Showcase',
          dates: '19 Oct 2026',
          htpn: 'Workshop held: ~20 Innovathon participants.',
          kkm: 'Protect key innovations through MyIPO; enter Karnival Inovasi KKM for national exposure.',
          doneWhen: '',
        },
        {
          n: 3,
          name: 'Consolidate & Govern',
          dates: 'Nov 2026–Jun 2027',
          htpn: 'App registry with 3 risk tiers, build lifecycle, PDPA data governance with on-prem AI for sensitive data, impact baselines.',
          kkm: 'Tag every app by reach (facility, service, general).',
          doneWhen: 'every tool is registered, owned, and tagged by reach',
        },
        {
          n: 4,
          name: 'Integrate',
          dates: 'Jul 2027–Jun 2028',
          htpn: 'HTPN Command Centre.',
          kkm: 'Package general patient-journey apps as configurable templates other hospitals can deploy; service-specific apps offered through their national services.',
          doneWhen:
            'the Command Centre is used daily and flow beats baseline, and at least one general app runs at another KKM hospital',
        },
        {
          n: 5,
          name: 'Predict & Scale',
          dates: 'from Jul 2028',
          htpn: 'Forecasting, governed clinical AI.',
          kkm: 'A hub-and-spoke playbook for every hospital type, from 30-bed district to 1,000-bed state hospital.',
          doneWhen: 'other KKM sites adopt it',
        },
      ],
      milestone: {
        underway: 'Already under way',
        title: 'MyIPO & Innovation Workshop',
        where: '19 October 2026 · WCC, HTPN Kajang',
        attendance: '~20 Innovathon participants',
        speakers: [
          {
            name: 'Ts. Mohd Azirudin bin Sahhudin',
            role: 'Principal Lecturer, Politeknik Port Dickson',
          },
          {
            name: 'Puan Norshariza binti Jamhuri',
            role: 'Oncology Dietetics Specialist, Hospital Kuala Lumpur',
          },
        ],
        line: 'Protecting our innovations as IP, and preparing entries for Karnival Inovasi KKM.',
        stamp: 'Follow-up done',
      },
      enablers: [
        'people',
        'process',
        'technology',
        'data',
        'governance',
        'funding and partnerships',
      ],
    },
    cues:
      "Phase 1 in full, from sheets 3 to 8. Started April 2025, fourteen months before the Cabinet directive of 5 June 2026. Leaders learned first (Monash, EDLP with MIT Sloan and ASB, LSE); our own syllabus, so everyone leaves having built something; quick wins shipped in weeks; a national Innovathon to reward the builders. 1,300+ staff trained, 50+ in-house apps in active use, 35+ workshops (15 by external invitation), RM0 software licensing. Innovathon 2026, 21 July: 200 delegates, 28 finalists, 9 winners, 13 external judges, covered by BERNAMA. Done when. Phase 3: every tool is registered, owned, and tagged by reach. Phase 4: the Command Centre is used daily and flow beats baseline, and at least one general app runs at another KKM hospital. Phase 5: other KKM sites adopt it.",
    notes: `So the roadmap runs on two tracks. One is HTPN as the lighthouse; the other is KKM, scaling what travels. Phase one is everything you've just seen: we started before the mandate, trained thirteen hundred staff, built fifty apps, and other hospitals now run our model. Phase two has already started. On the nineteenth of October, twenty of our Innovathon builders learned how to protect their work as intellectual property and prepare for the KKM Innovation Carnival. Phase three governs what we've built, and tags every app by how far it can travel. Phase four builds our Command Centre and, in parallel, packages patient-journey apps for other hospitals. Phase five is a playbook for every hospital type in the Ministry.`,
  },

  {
    id: 'phase-registry',
    sheet: 'S-13',
    title: 'Phase 3: the registry',
    steps: 2,
    moment: 0,
    seconds: 50,
    content: {
      heading: 'A registry with governance in proportion to risk',
      kicker: 'Phase 3 · Consolidate and Govern · Nov 2026 – Jun 2027',
      tiers: [
        {
          name: 'Experimental',
          body: 'Learning and testing with dummy or de-identified data. Built freely.',
        },
        {
          name: 'Departmental',
          body: 'Routine use in one unit. Needs a named owner, documentation and a backup maintainer.',
        },
        {
          name: 'Hospital-critical',
          body: 'Cross-department or patient safety. Full governance, security review and impact measures.',
        },
      ],
      footer: 'Experiments stay easy. Critical tools meet a full standard.',
    },
    notes: `Phase three turns grassroots tools into a portfolio the hospital can rely on. Every tool is registered and placed in one of three tiers. Experiments stay easy: dummy data, build freely. A tool used routinely in one unit needs a named owner, documentation and a backup. And anything hospital-critical, crossing departments or touching patient safety, gets full governance, a security review and impact measures. Governance in proportion to risk.`,
  },

  {
    id: 'phase-foundations',
    sheet: 'S-14',
    title: 'Phase 3: the foundations',
    steps: 2,
    moment: 0,
    seconds: 55,
    content: {
      heading: 'Four foundations under everything we build',
      piles: [
        {
          name: 'Build lifecycle',
          body: 'Version control, demo vs production, handover notes.',
        },
        {
          name: 'Data governance',
          body: 'PDPA data classes; on-premises AI for sensitive data.',
        },
        {
          name: 'Registration',
          body: 'RKB, MyIPO, and a standing link with JP ICT.',
          tick: 'MyIPO workshop held 19 Oct 2026',
        },
        {
          name: 'Impact baselines',
          body: 'Our 20-week roster study as the template.',
        },
      ],
      doneWhen:
        'Done when: every tool is registered, and every hospital-critical tool has an owner, a backup and a baseline.',
    },
    notes: `Underneath the registry sit four foundations nobody will see, and everything rests on them. A standard build lifecycle, so a tool survives its builder. Data governance under the PDPA, with an on-premises route for sensitive AI work. Formal registration and a standing partnership with our IT colleagues at JP ICT, and we've already started on intellectual property. And a standard way to measure impact, based on our own twenty-week roster study.`,
  },

  {
    id: 'command-centre',
    sheet: 'S-15',
    title: 'Command Centre',
    steps: 2,
    moment: 0,
    seconds: 64,
    content: {
      hub: {
        name: 'HTPN Command Centre',
        strapline: 'one real-time view of patient flow',
      },
      streams: [
        { name: 'Beds', source: 'Bed Watcher' },
        { name: 'Emergency department', source: 'ED dashboard' },
        { name: 'Theatres', source: 'OT scheduling' },
        { name: 'Transport', source: 'transfer requests' },
        { name: 'Discharge & step-down', source: 'SSU, Project BRIDGE' },
        { name: 'Staffing', source: 'roster' },
      ],
      alert: 'Automated surge alerts — our own dengue Yellow and Orange thresholds',
      evidence: [
        'Flow work at PDL and Ward 72 already cut boarding time 13.3%.',
        'The 2026 dengue surge ran on hand-gathered bed data.',
      ],
      footer:
        'Reads from existing tools · read-only HIS feeds · audit-logged access',
    },
    notes: `This is where we're going. The HTPN Command Centre. Six data streams we already own — beds, the emergency department, theatres, transport, discharge and staffing — into one real-time view of patient flow, with automatic surge alerts built on our own dengue thresholds. Why? Because focused flow work already cut boarding time by thirteen point three percent. And during this year's dengue surge, every decision ran on bed data gathered by hand. Never again.`,
  },

  {
    id: 'command-centre-build',
    sheet: 'S-16',
    title: 'Command Centre: how we build it',
    steps: 2,
    moment: 0,
    seconds: 57,
    content: {
      heading: 'Small first, governed from day one',
      kicker: 'Phase 4 · Integrate · Jul 2027 – Jun 2028',
      range: { from: 'Jul 2027', to: 'Jun 2028' },
      milestones: [
        'Minimum viable view: beds and ED flow first',
        'Automated surge alerts live before the 2027–2028 dengue season',
      ],
      rules: [
        'Reads from existing tools; read-only HIS feeds where agreed.',
        'Aggregate views for managers; audit-logged access to identifiable data.',
        'Alerts use our own dengue Yellow and Orange thresholds.',
        'An architecture review to choose an approved data layer as spreadsheets hit their limits.',
      ],
      doneWhen:
        'Done when: used in daily bed meetings, alerts are automatic, and boarding time and ED stay beat baseline.',
    },
    notes: `We won't build it all at once. A minimum viable view of beds and emergency department flow comes first, with surge alerts live before the next dengue season. It reads from the tools we already have, takes read-only feeds from the hospital information system where agreed, and logs every access to identifiable data. And because spreadsheets will hit their limits, Phase four includes an architecture review to choose a proper data layer. It's done when it's used every morning in the bed meeting, and the numbers beat baseline.`,
  },

  {
    id: 'predict-and-scale',
    sheet: 'S-17',
    title: 'Predict and scale',
    steps: 1,
    moment: 0,
    seconds: 44,
    content: {
      headline: { from: 'From seeing now', to: 'to anticipating next' },
      items: [
        'admission and bed-demand forecasting',
        'governed clinical AI with clinician sign-off (document checking, ICD-11 coding)',
        'innovation pipeline (facial PPG triage, specimen robots and drones, prison virtual clinic)',
        'a hub-and-spoke playbook for KKM',
      ],
    },
    notes: `With a year of clean, integrated data, we move from seeing now to anticipating next: forecasting admissions, putting clinical AI into production with a clinician always signing off, and packaging all of it as a playbook for every Ministry hospital.`,
  },

  {
    id: 'measuring-success',
    sheet: 'S-18',
    title: 'Measuring success',
    steps: 1,
    moment: 0,
    seconds: 43,
    content: {
      heading: "How we'll know it worked",
      columns: ['Phase', 'Indicators'],
      rows: [
        {
          n: 1,
          name: 'Ignite',
          achieved: true,
          indicators:
            '1,300+ trained; 50+ apps in use; national Innovathon; adoption by partner sites.',
        },
        {
          n: 2,
          name: 'Protect & Showcase',
          indicators:
            'MyIPO workshop held; key innovations protected through MyIPO; entries to Karnival Inovasi KKM.',
        },
        {
          n: 3,
          name: 'Consolidate & Govern',
          indicators:
            'All tools registered and tiered; all critical tools with owner, backup and baseline; governance endorsed.',
        },
        {
          n: 4,
          name: 'Integrate',
          indicators:
            'Command Centre in daily bed meetings; automated alerts live; boarding time, BOR and ED stay vs baseline.',
        },
        {
          n: 5,
          name: 'Predict & Scale',
          indicators:
            'Forecast accuracy; clinical AI in production with sign-off; KKM sites adopting the playbook.',
        },
      ],
      note: "Operational targets are set from Phase 3 baselines, grounded in HTPN's own data. Programme health is tracked too: active builders, tools with a backup maintainer, staff satisfaction.",
    },
    notes: `Every phase has indicators. You'll notice I haven't put a target on boarding time or length of stay. That's deliberate. Those targets will be set from our Phase three baselines, from our own data, not invented for a slide. And we track the health of the programme itself: active builders, tools with a backup, and how our staff feel. Because the biggest risk to this roadmap isn't technical.`,
  },

  {
    id: 'risks',
    sheet: 'S-19',
    title: 'Risks',
    steps: 2,
    moment: 0,
    seconds: 66,
    content: {
      stamp: 'The biggest risk is already here: key people.',
      columns: ['Risk', 'Mitigation'],
      first: {
        severity: 'High',
        risk: 'key-person dependency',
        mitigation:
          'protected time or formal posts; departmental champions; a backup maintainer for every tool.',
      },
      rest: [
        {
          risk: 'Seen as shadow IT',
          mitigation:
            'early partnership with the IT unit and JP ICT; a joint digital governance committee.',
        },
        {
          risk: 'Data protection breach',
          mitigation:
            'tiered data classes; de-identified by default; audit logs; human review of AI.',
        },
        {
          risk: 'Spreadsheets hit their limits',
          mitigation:
            'architecture review in Phase 4 to choose an approved data layer.',
        },
        {
          risk: 'Resistance to HIS integration',
          mitigation:
            'start with read-only feeds; prove value with our own data first.',
        },
        {
          risk: 'Builder burnout, lost momentum',
          mitigation:
            'keep the Innovathon; balance governance with new wins; proportionate rules.',
        },
      ],
    },
    notes: `I want to be candid. The biggest risk isn't in the future. It's here now. This whole office runs on a handful of people doing it on top of clinical and management work. So protected time, formal posts and champions in every department are not optional. The other risks: being seen as shadow IT, data protection, platform limits, resistance to integration, and burnout. None of them is a reason to slow down. Each is a reason to make the next phase about structure.`,
  },

  {
    id: 'lesson-and-close',
    sheet: 'S-20',
    title: 'Lesson & close',
    steps: 3,
    moment: 1,
    seconds: 61,
    content: {
      before: 'Phase 1 was won through culture.',
      strike: 'culture',
      after: 'Phases 2 to 5 must be won through architecture.',
      lines: [
        'Add structure, keep the spirit',
        'Make IT a partner',
        'Turn goodwill into roles',
      ],
      closing: ['Built from within.', 'Shared with all of KKM.'],
      thanks: 'Thank you.',
      codes: [
        { label: 'Showcase', url: 'https://htpn-showcase-v2.vercel.app/' },
        {
          label: 'Innovathon 2026',
          url: 'https://udppkhtpn-hue.github.io/innovathon2026/',
        },
      ],
    },
    notes: `Here's the lesson for me as a leader. Phase one was won through culture: energy, example, recognition. The next phases must be won through architecture: structure, governance, roles. You have built platforms at a scale we can only imagine, and that's exactly the conversation I'd love to have with you after this. We started before the policy required it. Now we'll turn that head start into an intelligent hospital, built from within, and shared with all of KKM. Thank you.`,
  },
]

/** Total clicker presses across the talk. */
export const TOTAL_STEPS = SCENES.reduce((n, s) => n + s.steps, 0)

/** Planned running time in seconds. */
export const PLANNED_SECONDS = SCENES.reduce((n, s) => n + s.seconds, 0)

/** Shown in the title block as "S-04 / 12". */
export const SHEET_COUNT = SCENES.length
