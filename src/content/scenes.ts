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
  | 'portfolio'
  | 'innovathon'
  | 'the-gap'
  | 'roadmap'
  | 'command-centre'
  | 'predict-and-scale'
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
  flip: { from: string; to: string; caption: string }
}

export interface Results {
  figures: Figure[]
  footnote: string
}

export interface Portfolio {
  lanes: { name: string; items: string[]; speed: number }[]
  centre: { image: string; url: string }
  line: string
}

export interface Innovathon {
  date: string
  poster: string
  /** Final 55.9s of the event reel, cut before its own closing card. */
  video: string
  videoSeconds: number
  rotation: number
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

export interface Roadmap {
  phases: {
    n: number
    name: string
    dates: string
    achieved?: boolean
    body: string
    doneWhen: string
  }[]
  enablers: string[]
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
  | (Base & { id: 'portfolio'; content: Portfolio })
  | (Base & { id: 'innovathon'; content: Innovathon })
  | (Base & { id: 'the-gap'; content: TheGap })
  | (Base & { id: 'roadmap'; content: Roadmap })
  | (Base & { id: 'command-centre'; content: CommandCentre })
  | (Base & { id: 'predict-and-scale'; content: PredictAndScale })
  | (Base & { id: 'lesson-and-close'; content: LessonAndClose })

// ─── The talk ───────────────────────────────────────────────────────────────

export const SCENES: Scene[] = [
  {
    id: 'cold-open',
    sheet: 'S-01',
    title: 'Cold open',
    steps: 1,
    moment: 0,
    seconds: 20,
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
    seconds: 25,
    content: {
      forces: [
        {
          name: 'Pressure',
          figure: { value: 128, prefix: '+', suffix: '%', tone: 'alert' },
          caption: 'Dengue admissions, June 2026 vs the year before.',
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
    notes: `Three forces made this necessary. Pressure: beds are full, staff are tired, and this June our dengue admissions rose a hundred and twenty-eight percent. Vendor lock-in: procurement is too slow for problems that change every month. And opportunity: for the first time, clinicians can build real tools in weeks. The limit is no longer technology. It's leadership.`,
  },

  {
    id: 'ahead-of-mandate',
    sheet: 'S-03',
    title: 'Ahead of the mandate',
    steps: 2,
    moment: 1,
    seconds: 20,
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
    steps: 2,
    moment: 1,
    seconds: 25,
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
    seconds: 25,
    content: {
      figures: [
        { value: 1300, suffix: '+', label: 'healthcare staff trained', tone: 'signal' },
        { value: 50, suffix: '+', label: 'in-house apps in active use', tone: 'signal' },
        {
          value: 35,
          suffix: '+',
          label: 'workshops, 18 by external invitation',
          tone: 'signal',
        },
        { value: 0, prefix: 'RM', label: 'software licensing cost', tone: 'signal' },
      ],
      footnote: 'Figures as of October 2026.',
    },
    notes: `Eighteen months in: more than thirteen hundred staff trained, more than fifty apps in daily use, thirty-five workshops, eighteen of them because other hospitals invited us. And zero ringgit in software licences.`,
  },

  {
    id: 'portfolio',
    sheet: 'S-06',
    title: 'The portfolio',
    steps: 1,
    moment: 0,
    seconds: 20,
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
    sheet: 'S-07',
    title: 'Innovathon',
    steps: 1,
    moment: 0,
    seconds: 60,
    content: {
      date: '21 July 2026',
      poster: 'innovathon-poster.webp',
      video: 'innovathon.mp4',
      videoSeconds: 55.9,
      rotation: -5,
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
    sheet: 'S-08',
    title: 'The gap',
    steps: 2,
    moment: 1,
    seconds: 25,
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
    id: 'roadmap',
    sheet: 'S-09',
    title: 'Roadmap',
    steps: 4,
    moment: 0,
    seconds: 30,
    content: {
      phases: [
        {
          n: 1,
          name: 'Ignite',
          dates: 'Apr 2025–Jul 2026',
          achieved: true,
          body: 'Culture and capability proven.',
          doneWhen: '',
        },
        {
          n: 2,
          name: 'Consolidate & Govern',
          dates: 'Nov 2026–Jun 2027',
          body: 'App registry with 3 risk tiers (Experimental / Departmental / Hospital-critical), build lifecycle, PDPA data governance with on-prem AI for sensitive data, impact baselines.',
          doneWhen: 'every tool is registered and owned',
        },
        {
          n: 3,
          name: 'Integrate',
          dates: 'Jul 2027–Jun 2028',
          body: 'HTPN Command Centre.',
          doneWhen: "it's used daily and flow beats baseline",
        },
        {
          n: 4,
          name: 'Predict & Scale',
          dates: 'from Jul 2028',
          body: 'Forecasting, governed clinical AI, KKM-wide playbook.',
          doneWhen: 'other KKM sites adopt it',
        },
      ],
      enablers: [
        'people',
        'process',
        'technology',
        'data',
        'governance',
        'funding and partnerships',
      ],
    },
    notes: `So here's the roadmap. Phase one is done. Phase two governs what we've built: every tool registered, tiered by risk, with an owner and a backup. Phase three is the flagship: integration. Phase four adds prediction and takes the model across the Ministry. Every phase has a clear test for done.`,
  },

  {
    id: 'command-centre',
    sheet: 'S-10',
    title: 'Command Centre',
    steps: 2,
    moment: 0,
    seconds: 35,
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
    id: 'predict-and-scale',
    sheet: 'S-11',
    title: 'Predict and scale',
    steps: 1,
    moment: 0,
    seconds: 20,
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
    id: 'lesson-and-close',
    sheet: 'S-12',
    title: 'Lesson & close',
    steps: 3,
    moment: 1,
    seconds: 30,
    content: {
      before: 'Phase 1 was won through culture.',
      strike: 'culture',
      after: 'Phases 2 to 4 must be won through architecture.',
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
