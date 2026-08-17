// One-time DB seed — run via the /api/seed endpoint or directly with DATABASE_URL set.
// Safe to call multiple times: skips if data already exists.
//
// Cases, dates, amounts, and note authorship below are reconstructed from the
// authoritative GroupMe export (Internal_Benevolence_History), covering
// 2025-07-24 → 2026-06-01. Notes are curated per-period summaries, attributed to
// the deacon who handled the request at the time (including deacons who have since
// rolled off, kept here as inactive members so historical authorship is accurate).

const TEAM = [
  // ── Active deacons ──────────────────────────────────────────────────
  { id: 'tm10',  name: 'Hunter Shepherd', initials: 'HS', email: 'hunter@kennion.com',
    phone: '', color: '#0f766e', addedBy: 'system', addedAt: '2026-05-11',
    isLeader: true, lastLogin: null },
  { id: 'tm_ts', name: 'Timothy Smith',  initials: 'TS', email: 'tsmith24@hotmail.com',
    phone: '', color: '#2563eb', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, lastLogin: null },
  { id: 'tm_ca', name: 'Chase Aldridge', initials: 'CA', email: 'chasealdridge3@gmail.com',
    phone: '', color: '#0891b2', addedBy: 'tm_dc', addedAt: '2026-05-11',
    isLeader: false, lastLogin: null },
  { id: 'tm_dc', name: 'Derek Cavin',    initials: 'DC', email: 'derekcavin@gmail.com',
    phone: '', color: '#7c3aed', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, lastLogin: null },
  { id: 'tm_js', name: 'Jeremy Shank',   initials: 'JS', email: 'jpshank2@gmail.com',
    phone: '', color: '#059669', addedBy: 'tm_ts', addedAt: '2026-05-11',
    isLeader: false, lastLogin: null },
  { id: 'tm_jh', name: 'Josiah Helms',   initials: 'JH', email: 'josiahhelms7@gmail.com',
    phone: '', color: '#b45309', addedBy: 'tm_ts', addedAt: '2026-05-11',
    isLeader: false, lastLogin: null },
  { id: 'tm_kc', name: 'Keith Cooke',    initials: 'KC', email: 'kcooke@esri.com',
    phone: '', color: '#dc2626', addedBy: 'system', addedAt: '2025-07-25',
    isLeader: false, lastLogin: null },
  { id: 'tm_rs', name: 'Randal Snook',   initials: 'RS', email: 'randal@truelightbranding.com',
    phone: '', color: '#0d9488', addedBy: 'tm_dc', addedAt: '2026-05-11',
    isLeader: false, lastLogin: null },
  { id: 'tm_wy', name: 'Watkins Youngblood', initials: 'WY', email: 'jwyoungblood800@gmail.com',
    phone: '', color: '#9333ea', addedBy: 'tm_dc', addedAt: '2026-05-11',
    isLeader: false, lastLogin: null },

  // ── Past deacons (rolled off ~May 2026) — inactive, kept for note authorship ──
  { id: 'tm_ml', name: 'Mitchell Lewis',  initials: 'ML', email: '',
    phone: '', color: '#475569', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_dm', name: 'David Marsh',     initials: 'DM', email: '',
    phone: '', color: '#64748b', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_bd', name: 'Brent Dorner',    initials: 'BD', email: '',
    phone: '', color: '#6b7280', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_ag', name: 'Andrew Glennon',  initials: 'AG', email: '',
    phone: '', color: '#52525b', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_dg', name: 'Dan Gwaltney',    initials: 'DG', email: '',
    phone: '', color: '#71717a', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_sd', name: 'Shaun DeCoudres', initials: 'SD', email: '',
    phone: '', color: '#57534e', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
  { id: 'tm_cc', name: 'Clay Collie',     initials: 'CC', email: '',
    phone: '', color: '#78716c', addedBy: 'system', addedAt: '2025-07-24',
    isLeader: false, inactive: true, lastLogin: null },
];

const CASES = [
  // ─── 4821 · Patrice Smiley ──────────────────────────────────────────
  {
    id: 'c_24001',
    caseNumber: '4821',
    name: 'Patrice Smiley',
    status: 'active',
    opened: '2025-07-25T12:00:00.000Z',
    lastActivity: '2026-05-28T12:00:00.000Z',
    contacts: [
      { id: 'p_24001_1', name: 'Patrice Smiley', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [
      { id: 'ct_24001_1', name: 'Derek Cavin', role: 'Deacon Lead' },
    ],
    tasks: [],
    notes: [
      { id: 'n_24001_0', author: 'tm_dc', date: '2026-05-28T12:00:00.000Z',
        text: 'Approved $350 for what Derek flagged as the final car rental (May 28 poll). Rental phase recap after her bankruptcy cleared the way: $750 on May 11 (incl. a $500 refundable deposit), $250 on May 14, and $350 on May 28.' },
      { id: 'n_24001_1', author: 'tm_dc', date: '2026-03-23T12:00:00.000Z',
        text: 'Van trouble. Mar 18 approved $600 for front brakes/pads (Christian Brothers). Mar 20 $70 for a second-opinion diagnostic (John Michael Motors). Mar 22 the van broke down at a Hwy 78 truck stop; $394 to recover it from the tow company and tow to her cousin’s shop. Mar 23 approved $1,772 for the alternator and power steering pump.' },
      { id: 'n_24001_2', author: 'tm_dc', date: '2026-03-02T12:00:00.000Z',
        text: 'Hours cut at the hotel. Jan 20 approved $600 for rent/food ($400 from Tim’s leftover KC-class fund + $200). Feb 16 $400 for groceries (she had COVID and the slow season cut her hours). Mar 2 $600 for two weeks of food, with hours down to about 3 days/week.' },
      { id: 'n_24001_3', author: 'tm_dc', date: '2026-01-09T12:00:00.000Z',
        text: 'Approved $96 for a 6-month P.O. box. She had been using her cousin’s address and not reliably getting her mail.' },
      { id: 'n_24001_4', author: 'tm_dc', date: '2025-12-19T12:00:00.000Z',
        text: 'Christmas: approved $500 in gift cards for her boys’ clothes and shoes — $250 Old Navy + $250 Walmart.' },
      { id: 'n_24001_5', author: 'tm_dc', date: '2025-12-10T12:00:00.000Z',
        text: 'Vehicle situation resolved. The repossessed Honda Pilot was scrapped via Pull-A-Part ($50 for the title, Nov 12). David Marsh donated his 2012 Honda Odyssey LX (170k miles, ~$7,500 value); per Martin she signed an affidavit not to use it as collateral without coming to the diaconate first. Approved $348.34 for the Odyssey tag (Dec 10) and $309 for 6 months of Progressive insurance (Nov 20).' },
      { id: 'n_24001_6', author: 'tm_dc', date: '2025-11-13T12:00:00.000Z',
        text: 'Her Honda Pilot was repossessed Oct 29 (license and keys were inside it). Approved $500 to cover Uber to work while sorting it out. The Pilot wasn’t worth repairing, so we moved to rentals: $400 on Nov 6 (from the remaining balance of the $500) and another $400 on Nov 13.' },
      { id: 'n_24001_7', author: 'tm_ml', date: '2025-10-09T12:00:00.000Z',
        text: 'Approved $700 — $500 toward housing and $200 for her car tag. Still recovering from the diverticulitis flare and missed work.' },
      { id: 'n_24001_8', author: 'tm_ml', date: '2025-09-04T12:00:00.000Z',
        text: 'Fall assistance. Sept 4 approved $500 (bankruptcy finalizing by month end; she had received $500/mo from the external team the prior 3 months). Sept 16 $150 for groceries after the original motel locked her out of her room and food when she moved to an extended-stay at DHR’s request. Sept 29 $150 for food while dealing with diverticulitis and two ER trips.' },
      { id: 'n_24001_9', author: 'tm_dc', date: '2025-07-25T12:00:00.000Z',
        text: 'Case opened. Derek Cavin requested $100 for gas and groceries (Jul 25). Two days later, $231.63 to replace the car battery that died after KC (Jul 27). Patrice is a hotel worker with recently reduced hours and an active bankruptcy.' },
    ],
    files: [],
  },

  // ─── 7354 · Crystal Waldo ───────────────────────────────────────────
  {
    id: 'c_24002',
    caseNumber: '7354',
    name: 'Crystal Waldo',
    status: 'active',
    opened: '2025-07-27T12:00:00.000Z',
    lastActivity: '2026-05-26T12:00:00.000Z',
    contacts: [
      { id: 'p_24002_1', name: 'Crystal Waldo', phone: '', email: '', role: 'Primary' },
      { id: 'p_24002_2', name: 'CJ (son)', phone: '', email: '', role: 'Child' },
      { id: 'p_24002_3', name: 'Cody (son, youngest)', phone: '', email: '', role: 'Child' },
    ],
    careTeam: [
      { id: 'ct_24002_1', name: 'Timothy Smith', role: 'Deacon Lead' },
      { id: 'ct_24002_2', name: 'Shelby Seagrest', role: 'Care Team' },
      { id: 'ct_24002_3', name: 'David Marsh', role: 'Care Team (rolled off)' },
    ],
    tasks: [],
    notes: [
      { id: 'n_24002_1', author: 'tm_ts', date: '2026-05-26T12:00:00.000Z',
        text: 'Approved $2,000 to get her through June. Two setbacks this month: no child support for two months and two unpaid leave days. She paid June rent and bills and was left with about $50 until her July paycheck. Child support is $500/mo; she has talked to her attorney about next steps.' },
      { id: 'n_24002_2', author: 'tm_ts', date: '2026-05-01T12:00:00.000Z',
        text: 'Approved $600 — rent was due and she was $400 short with nothing left until the next week.' },
      { id: 'n_24002_3', author: 'tm_ts', date: '2026-04-20T12:00:00.000Z',
        text: 'Approved $750 for 5 counseling sessions ($150 each) for her youngest son, Cody, at Insights — recommended by Shelby Seagrest. His older brother was recently out of rehab and there was concern Cody was heading the same direction.' },
      { id: 'n_24002_4', author: 'tm_ts', date: '2026-04-15T12:00:00.000Z',
        text: 'Approved $600 in mileage/gas to Chris Appleby, who volunteered to drive CJ to the Hoover alternative school for the rest of the year (after a 6-week diaconate effort of twice-daily drop-offs). Chris is between jobs and formed a real connection with CJ.' },
      { id: 'n_24002_5', author: 'tm_ts', date: '2026-04-13T12:00:00.000Z',
        text: 'Approved $600 toward a $1,000 car repair — she covered the other half.' },
      { id: 'n_24002_6', author: 'tm_ts', date: '2026-03-20T12:00:00.000Z',
        text: 'Approved $800 for a setback this month — new tires plus a power bill.' },
      { id: 'n_24002_7', author: 'tm_ts', date: '2025-12-08T12:00:00.000Z',
        text: 'Approved $500 for food and gas. Her ex stopped paying child support again (court date pending), and a kitchen power issue forced her to order meals for a few days. Dave Marsh, Shelby and Tim are building a longer-term plan as this is becoming a pattern.' },
      { id: 'n_24002_8', author: 'tm_ts', date: '2025-11-16T12:00:00.000Z',
        text: 'Approved $1,270 — $770 to clear an overdraft (both her old and newly consolidated loan auto-payments drew in the same month) plus $500 to get her to payday.' },
      { id: 'n_24002_9', author: 'tm_ts', date: '2025-11-04T12:00:00.000Z',
        text: 'Approved a $2,500 legal retainer (refundable if it doesn’t go to court) for a hearing to collect back child support.' },
      { id: 'n_24002_10', author: 'tm_ts', date: '2025-10-04T12:00:00.000Z',
        text: 'Approved $500. Her ex didn’t pay child support again and she was down to about $30 for the rest of the month.' },
      { id: 'n_24002_11', author: 'tm_ts', date: '2025-09-05T12:00:00.000Z',
        text: 'Approved $2,722 for what we hope is one of the final legal bills related to the child-support case.' },
      { id: 'n_24002_12', author: 'tm_ts', date: '2025-07-27T12:00:00.000Z',
        text: 'Case opened. Approved $219/mo for after-school care (8/11/25–5/11/26) through the full diaconate — her new job won’t allow her to leave early, and she qualified for assistance that halved the fee. Aug 1: a targeted $1,000 donation distributed for school supplies and Uber rides. Single mom of 3 in Cornerstone KC; her ex isn’t paying the $500/mo court-ordered child support and she works two jobs including Sundays. Care team: Timothy Smith, Shelby Seagrest, David Marsh.' },
    ],
    files: [],
  },

  // ─── 2967 · Ali Tutak ───────────────────────────────────────────────
  {
    id: 'c_24003',
    caseNumber: '2967',
    name: 'Ali Tutak',
    status: 'active',
    opened: '2025-07-31T12:00:00.000Z',
    lastActivity: '2026-05-27T12:00:00.000Z',
    contacts: [
      { id: 'p_24003_1', name: 'Ali Tutak', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [
      { id: 'ct_24003_1', name: 'Timothy Smith', role: 'Deacon Lead' },
    ],
    tasks: [],
    notes: [
      { id: 'n_24003_1', author: 'tm_ts', date: '2026-05-27T12:00:00.000Z',
        text: 'Approved $1,047 for June rent (due June 5). He is transferring from the Valleydale Domino’s to the Chelsea location for more hours and has spent close to $3,000 on car repairs lately. He says he won’t need further help this year once the transfer goes through.' },
      { id: 'n_24003_2', author: 'tm_ag', date: '2026-03-16T12:00:00.000Z',
        text: 'Approved $1,006 for April rent while Ali is in Turkey for 4+ weeks helping his sister (surgery) and 80-year-old mother. He leaves 3/24 and rent is due 4/9; the complex has a waiting list so he can’t just move out for the month. Andrew Glennon picked up this case.' },
      { id: 'n_24003_3', author: 'tm_ts', date: '2026-02-02T12:00:00.000Z',
        text: 'Approved $990 for a round-trip flight to Turkey — his sister is in critical condition after a car accident, his mother is 80, and his father died in 2020. We also covered $990 for February rent. Plan to form a care team when he returns.' },
      { id: 'n_24003_4', author: 'tm_ts', date: '2025-12-04T12:00:00.000Z',
        text: 'Approved $967 for December rent. The accounting job in Turkey fell through; he is back in Birmingham working at the Valleydale Domino’s on reduced hours after the store changed owners.' },
      { id: 'n_24003_5', author: 'tm_ts', date: '2025-07-31T12:00:00.000Z',
        text: 'Case opened. Approved $946 for rent. Ali is a Cornerstone KC member (deacon rep Derrick Helm) planning a temporary move to Turkey for an accounting job. We had previously covered his rent through the external team.' },
    ],
    files: [],
  },

  // ─── 5138 · Confidential — Medical ──────────────────────────────────
  {
    id: 'c_24004',
    caseNumber: '5138',
    name: 'Confidential — Medical',
    status: 'completed',
    opened: '2025-07-28T12:00:00.000Z',
    lastActivity: '2026-01-28T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_24004_1', author: 'tm_ml', date: '2025-07-28T12:00:00.000Z',
        text: 'Case opened. Referred via Jason and Martin. A church member is unable to work due to inpatient treatment for a medical condition. Approved $1,000/month for 6 months ($6,000 total) to cover bills and let the member focus on recovery, pending full-diaconate approval. The 6-month plan has since completed and the case is closed.' },
    ],
    files: [],
  },

  // ─── 8413 · Rebekah Kirkland ────────────────────────────────────────
  {
    id: 'c_24005',
    caseNumber: '8413',
    name: 'Rebekah Kirkland',
    status: 'completed',
    opened: '2025-09-25T12:00:00.000Z',
    lastActivity: '2025-10-23T12:00:00.000Z',
    contacts: [
      { id: 'p_24005_1', name: 'Rebekah Kirkland', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_24005_1', author: 'tm_bd', date: '2025-10-23T12:00:00.000Z',
        text: 'Approved $2,000 for Westminster tuition to keep her 9-year-old enrolled for the rest of the school year (Westminster halved the fees; this is the balance). Referred via Bradley Moore. Post-divorce (formerly Anderson), living with her parents and rebuilding her business — she does not anticipate ongoing needs. Case closed.' },
      { id: 'n_24005_2', author: 'tm_ml', date: '2025-09-25T12:00:00.000Z',
        text: 'Case opened. Coordinated a small move — volunteers (Brent Dorner, Andrew Glennon) helped move her things from the house she shared into a storage unit near the church.' },
    ],
    files: [],
  },

  // ─── 3756 · Emily Moore ─────────────────────────────────────────────
  {
    id: 'c_24006',
    caseNumber: '3756',
    name: 'Emily Moore',
    status: 'completed',
    opened: '2025-11-13T12:00:00.000Z',
    lastActivity: '2025-11-13T12:00:00.000Z',
    contacts: [
      { id: 'p_24006_1', name: 'Emily Moore', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_24006_1', author: 'tm_dm', date: '2025-11-13T12:00:00.000Z',
        text: 'Case opened. Referred via Amy Henry. Emily is a junior at Samford and a Genesis KC member who completed the Foundations class. Her father took his life at their home in Houston — devastating for the whole family. Approved $1,500 for counseling at Covenant Christian Counseling. Jason had already helped get her on their calendar. Case closed after funds disbursed.' },
    ],
    files: [],
  },

  // ─── 5294 · Confidential — Faith family counseling ──────────────────
  {
    id: 'c_24007',
    caseNumber: '5294',
    name: 'Confidential — Counseling (Faith family)',
    status: 'completed',
    opened: '2025-10-22T12:00:00.000Z',
    lastActivity: '2026-01-22T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_24007_1', author: 'tm_dm', date: '2026-01-22T12:00:00.000Z',
        text: 'Follow-up on a counseling approval: sessions came in at $155 rather than the assumed $150. Approved the extra $50 and raised the standard counseling cap to $1,550 going forward so future approvals more reliably cover partner-center fees.' },
      { id: 'n_24007_2', author: 'tm_ml', date: '2025-10-22T12:00:00.000Z',
        text: 'Case opened. Referred via Jason and Martin. Approved up to $1,500 toward counseling for a Faith family — expected to cover roughly 10 sessions. Names kept confidential. Case closed.' },
    ],
    files: [],
  },

  // ─── 6173 · Confidential — underemployed family ─────────────────────
  {
    id: 'c_24008',
    caseNumber: '6173',
    name: 'Confidential — Family assistance',
    status: 'completed',
    opened: '2025-10-30T12:00:00.000Z',
    lastActivity: '2025-12-10T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_24008_1', author: 'tm_dm', date: '2025-12-10T12:00:00.000Z',
        text: 'Update: David Marsh hired the father, who has since interviewed internally for a true marketing role that fits his experience — higher and more consistent pay. He had said it had been nearly impossible to land an interview over the last three years.' },
      { id: 'n_24008_2', author: 'tm_ml', date: '2025-10-30T12:00:00.000Z',
        text: 'Case opened. Approved $1,675 for the month for a Faith family who asked to keep their identity confidential. Both parents and their child are involved in Grace Groups and FSM; the mother works full time; the father lost his job 2.5 years ago and has been underemployed since (~30 hrs/week at $15/hr), picking up handyman work. They have maxed their HELOC and have $98,500 in credit-card debt now on a 2–7% payment plan (5-year payoff), and have cut all reasonable expenses.' },
    ],
    files: [],
  },

  // ─── 6290 · Jon & Alicia Brightwell ─────────────────────────────────
  {
    id: 'c_25001',
    caseNumber: '6290',
    name: 'Jon & Alicia Brightwell',
    status: 'active',
    opened: '2026-03-04T12:00:00.000Z',
    lastActivity: '2026-05-27T12:00:00.000Z',
    contacts: [
      { id: 'p_25001_1', name: 'Jon Brightwell', phone: '', email: '', role: 'Primary' },
      { id: 'p_25001_2', name: 'Alicia Brightwell', phone: '', email: '', role: 'Spouse' },
    ],
    careTeam: [
      { id: 'ct_25001_1', name: 'Keith Cooke', role: 'Deacon Lead' },
      { id: 'ct_25001_2', name: 'Grady Trammell', role: 'Referring Elder' },
    ],
    tasks: [],
    notes: [
      { id: 'n_25001_1', author: 'tm_kc', date: '2026-05-27T12:00:00.000Z',
        text: 'Approved $1,973.90 for June COBRA (poll). Jon is very discouraged by the ongoing unemployment but has two more follow-up interviews this week. Keith is out of town and asked the team for backup support and encouragement; Grady (elder) is being kept updated.' },
      { id: 'n_25001_2', author: 'tm_kc', date: '2026-05-18T12:00:00.000Z',
        text: 'Approved $2,245.39 for medical and utility bills (poll). May 15: Jon had a Moultrie mechanical-engineer interview — Daniel Wilson handed his resume to the hiring manager, and Jeremy Shank has product-side contacts there. Keep him in prayer.' },
      { id: 'n_25001_3', author: 'tm_kc', date: '2026-04-30T12:00:00.000Z',
        text: 'Approved $3,349.83 for itemized bills (nothing frivolous on the list). Unemployment is active and he has had several interviews but no offers yet. Alicia’s shoulder surgery is still pending.' },
      { id: 'n_25001_4', author: 'tm_kc', date: '2026-03-31T12:00:00.000Z',
        text: 'Approved $1,973.90 for April COBRA. Jon has started receiving unemployment, which helps with necessities. Several interviews but no follow-ups, which he finds very disheartening.' },
      { id: 'n_25001_5', author: 'tm_kc', date: '2026-03-15T12:00:00.000Z',
        text: 'Approved $1,140 for upcoming utility and insurance bills. Jon filed for unemployment (not yet received) and is actively job-hunting with a recruiter; he can cover the mortgage and groceries for now.' },
      { id: 'n_25001_6', author: 'tm_kc', date: '2026-03-04T12:00:00.000Z',
        text: 'Case opened. Referred by elder Grady Trammell. Approved $1,973.90 for the BC/BS COBRA premium covering Jon, Alicia, and their four children through the end of March — time-sensitive so Alicia doesn’t have to reschedule her shoulder surgery. Family of 6; Jon is a mechanical engineer who unexpectedly lost his job. Keith Cooke leading; Brent Dorner (their KC and Grace group) assisting.' },
    ],
    files: [],
  },

  // ─── 1847 · Amanda Jones ────────────────────────────────────────────
  {
    id: 'c_25002',
    caseNumber: '1847',
    name: 'Amanda Jones',
    status: 'active',
    opened: '2026-03-26T12:00:00.000Z',
    lastActivity: '2026-04-16T12:00:00.000Z',
    contacts: [
      { id: 'p_25002_1', name: 'Amanda Jones', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [
      { id: 'ct_25002_1', name: 'Randal Snook', role: 'Care Team Lead' },
      { id: 'ct_25002_2', name: 'Amber Peterson', role: 'Care Team' },
      { id: 'ct_25002_3', name: 'Keith Belcher', role: 'Care Team (temporary)' },
    ],
    tasks: [],
    notes: [
      { id: 'n_25002_1', author: 'tm_rs', date: '2026-04-16T12:00:00.000Z',
        text: 'Septic resolved. Total came to $1,673: $631 pump-out + $850 mini-excavator to access the tank + $192 to repair her mower (Keith Belcher). Also a second $1,405 health-insurance premium + a $300 Walmart card. After the $1,000 already approved on Mar 31, the new ask was $2,378 — repair work from the Deacon’s Fund, insurance and gift card from the IB budget. She is taking steps to improve her situation and is grateful.' },
      { id: 'n_25002_2', author: 'tm_rs', date: '2026-03-31T12:00:00.000Z',
        text: 'Approved up to $1,000 for a septic pump-out (~$631 quote). Randal and Keith Belcher visited the home; the tank wasn’t properly addressed when she bought the house about a year ago and they had trouble even locating it.' },
      { id: 'n_25002_3', author: 'tm_rs', date: '2026-03-26T12:00:00.000Z',
        text: 'Case opened. The care team (Randal Snook leading, with Amber Peterson and Keith Belcher temporarily) met Amanda at KC. Approved $1,705: a $1,405 health-insurance premium due at the first of the month plus a $300 Walmart gift card. Single mom of two, a regular attending member; she opened up well after some initial shame about asking for help.' },
    ],
    files: [],
  },

  // ─── 9053 · Shane & Kelcey Alexander ────────────────────────────────
  {
    id: 'c_25003',
    caseNumber: '9053',
    name: 'Shane & Kelcey Alexander',
    status: 'archived',
    opened: '2026-04-15T12:00:00.000Z',
    lastActivity: '2026-04-15T12:00:00.000Z',
    contacts: [
      { id: 'p_25003_1', name: 'Shane Alexander', phone: '', email: '', role: 'Primary' },
      { id: 'p_25003_2', name: 'Kelcey Alexander', phone: '', email: '', role: 'Spouse' },
    ],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_25003_1', author: 'tm_dm', date: '2026-04-15T12:00:00.000Z',
        text: 'Case opened. Referred by Bradley Moore (their KC). Shane and Kelcey are struggling in their marriage and staff suggested Insights Counseling. Approved the standard $1,500 to get them started. Status paused pending counseling progress.' },
    ],
    files: [],
  },

  // ─── 4612 · Robert Fulcher ──────────────────────────────────────────
  {
    id: 'c_25004',
    caseNumber: '4612',
    name: 'Robert Fulcher',
    status: 'active',
    opened: '2026-05-14T12:00:00.000Z',
    lastActivity: '2026-05-20T12:00:00.000Z',
    contacts: [
      { id: 'p_25004_1', name: 'Robert Fulcher', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [
      { id: 'ct_25004_1', name: 'Keith Cooke', role: 'Deacon Lead' },
    ],
    tasks: [],
    notes: [
      { id: 'n_25004_1', author: 'tm_kc', date: '2026-05-20T12:00:00.000Z',
        text: 'Approved $1,500 for an A/C repair (faulty thermal expansion valve) on top of the recent $1,331 — needed urgently for his family.' },
      { id: 'n_25004_2', author: 'tm_kc', date: '2026-05-14T12:00:00.000Z',
        text: 'Case opened (transferred from Mitchell, who rolled off). Approved $1,331.43 — the large majority is medical bills with a little over $200 for electric and gas. Robert works in construction and weather has cut his hours roughly in half over the past two months.' },
    ],
    files: [],
  },

  // ─── 7825 · Confidential couple (Covenant KC) ───────────────────────
  {
    id: 'c_25005',
    caseNumber: '7825',
    name: 'Confidential couple (Covenant KC)',
    status: 'active',
    opened: '2026-05-13T12:00:00.000Z',
    lastActivity: '2026-05-13T12:00:00.000Z',
    contacts: [],
    careTeam: [
      { id: 'ct_25005_1', name: 'Derek Cavin', role: 'Referring Deacon' },
    ],
    tasks: [],
    notes: [
      { id: 'n_25005_1', author: 'tm_dc', date: '2026-05-13T12:00:00.000Z',
        text: 'Case opened. Referred by their Covenant KC elder. Approved $1,500 for roughly 9–10 marriage-counseling sessions with Melea Stephens at Blue Lake Christian Clinic — the couple’s first round. Sent to the full diaconate for final approval. Names kept confidential.' },
    ],
    files: [],
  },

  // ─── 3491 · Confidential, counseling (Exodus KC) ────────────────────
  {
    id: 'c_25006',
    caseNumber: '3491',
    name: 'Confidential, counseling (Exodus KC)',
    status: 'completed',
    opened: '2025-08-15T12:00:00.000Z',
    lastActivity: '2025-08-15T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      { id: 'n_25006_1', author: 'tm_bd', date: '2025-08-15T12:00:00.000Z',
        text: 'Case opened and closed (one-time approval). Referred via Martin. A member in Exodus KC has significant health issues and an ongoing need for counseling; her savings are exhausted from prior medical and counseling bills. Approved up to $2,000 as the church portion, with the member covering roughly 25% of the cost. Names kept confidential.' },
    ],
    files: [],
  },
];

// ── GroupMe catch-up: 2026-06-04 → 2026-08-12 ───────────────────────────────
// Verbatim record of what each deacon actually posted in the Internal Benevolence
// GroupMe over the period the app had gone un-updated. This is the same thing the
// GroupMe Sync tool produces (source: 'groupme'), just applied in bulk from the
// export instead of one card at a time — so `text` is the deacon's own words,
// copied exactly, never paraphrased, summarized, or added to.
//
// What is in here: requests/asks and real case updates.
// What is deliberately left out: "Approve"/"Approved" votes, vote-chasing
// reminders, questions put to the team, meeting/scheduling chatter, and anything
// with no case attached (the IB budget balance, the poll-vs-message process
// change, the All Kids insurance tip). Those are team business, not case record.
//
// `gm` is the GroupMe message id the text came from — it makes the note id
// deterministic (`n_gm_<id>`), so seeding and reconciling can both run repeatedly
// without ever creating a second copy of the same message.
const GROUPME_CATCHUP = [
  { num: '4821',  gm: '178059330919817522',  author: 'tm_dc', date: '2026-06-04T17:15:09.000Z',
    text: 'Approval needed(Hopefully last time) one more rental car weekly rental for Patrice. $350  Carey’s car is at the church but we still need more time to get everything transferred over. Title , Bill of Sale, Insurance etc' },
  { num: '6290',  gm: '178111319539328690',  author: 'tm_kc', date: '2026-06-10T17:39:55.000Z',
    text: 'The Brightwells have asked for help with their June bills totaling $2876.41. It\'s almost entirely mortgage, utilities, insurance and groceries.\nJon\'s interviews dis not lead to a new job. He just started getting unemployment ($275) and has about $1650 in backlog payments he has not yet received.' },
  { num: '1847',  gm: '178145889032682405',  author: 'tm_rs', date: '2026-06-14T17:41:30.000Z',
    text: 'Guys, Keith B and I met w Amanda J for a care team meeting this morning during KC. \nHer former husband is running behind on child support and has given us other concerns by his behavior. \n\nShe is meeting w her attorney on the 22nd. I’m asking that we cover the $350 fee and am seeking approval from our team. Please let me know if you have any questions or thoughts.' },
  { num: '4821',  gm: '178170876003604016',  author: 'tm_dc', date: '2026-06-17T15:06:00.000Z',
    text: 'Approval to pay $381.13 for rental car this next week for Patrice (Juneteenth is making this rate even higher.) Praying we get the title soon' },
  { num: '2967',  gm: '178181372980709959',  author: 'tm10',  date: '2026-06-18T20:15:29.000Z',
    text: 'FYI. Hold off on any assistance with Ali Tutak. I updated notes in system. Marked as completed.' },
  { num: '4821',  gm: '178233353890406946',  author: 'tm_dc', date: '2026-06-24T20:38:58.000Z',
    text: 'This week’s ask for Patrice:\nRent assistance $380\nRental car $391.78\nUS P O Box $99\nTotal; $870.78\nShe is needing rent help due to her low hrs because of her missing work due to diverticulitis' },
  { num: '6290',  gm: '178275795022483014',  author: 'tm_kc', date: '2026-06-29T18:32:30.000Z',
    text: 'Asking for approval for $1973 for the Brightwell\'s insurance premium for July.' },
  { num: '7354',  gm: '178300132865839490',  author: 'tm_ts', date: '2026-07-02T14:08:48.000Z',
    text: 'Gentlemen, i spoke with Crystal Waldo yesterday and let me know a financial need. Due to a payroll issue she is down $900 in he monthly paycheck and her ex continues to not pay child support. She will get back a portion of the pay roll mishap in next months paycheck. At the moment she has $200 in her account. We reviewed expenses and she will need -$2000 to get through the month. Requesting approval of this amount. Thanks\nShe doesn’t get a paycheck until next month' },
  { num: '4821',  gm: '178330290982235206',  author: 'tm_dc', date: '2026-07-06T01:55:09.000Z',
    text: 'Patrice Request: Chase and I have been discussing and agree this is a great opportunity for her oldest son, Thomas. He has special needs and been accepted into The Exceptional Foundation in Homewood. \n\n$500 request is to help pay July tuition. (There is a very high probability he could get scholarships for tuition/dues starting in October.)\nThe monthly amount has to be paid before starting. Patrice is hoping to take him tomorrow.' },
  { num: '6290',  gm: '178336329399920938',  author: 'tm_kc', date: '2026-07-06T18:41:33.000Z',
    text: 'Gents, the Brightwells have nills totaling $2821.08 for July. This is mostly for utilities, a HELOC payment, gas and groceries. There is nothing frivolous on the list. Please let me know if you approve or have any questions.' },
  { num: '6290',  gm: '178342951660670241',  author: 'tm_kc', date: '2026-07-07T13:05:16.000Z',
    text: 'I\'ve asked him and am waiting for a response. I didn\'t press him on it earlier bc it seemed he was getting several interviews and felt he was close to getting a full time job.\nJust heard back. He has looked at jobs at various stores in his area with no luck. One of them told him he was over qualified to work there. Grady and I will have to have a discussion with him if this latest opportunity doesn\'t pan out.' },
  { num: '6290',  gm: '178430269149848273',  author: 'tm_kc', date: '2026-07-17T15:38:11.000Z',
    text: 'I have some good news. Jon Brightwell has started working with a masonry group to earn some money. There looks like there may be a job at the company he applied to (though not the job he wanted) and he should hear from them shortly.\nIn the meantime,  they have asked for help with their mortgage, utilities and healthcare bills. I know it will likely need to come from the Deacon\'s Fund. The total is $3,797.57. The only thing I\'m concerned about in their request is an $800 for their home school co-op that covers all three boys. I\'m not sure about covering this but am open to input from others.' },
  { num: '4821',  gm: '178483427412082308',  author: 'tm_dc', date: '2026-07-23T19:17:54.000Z',
    text: 'Hey guys, Patrice is requesting $250 for food to get her to her next paycheck. She says she has her rent and gas money taken care of.' },
  { num: '6290',  gm: '178536427696185288',  author: 'tm_kc', date: '2026-07-29T22:31:16.000Z',
    text: 'The Brightwells have requested we pay their health insurance premium for August. It\'s $1973.90. \n\nI\'m working with Grady to set a plan where we start to ween Jon off of financial assistance. We obviously can\'t keep spending at this rate. I don\'t have an employment update from him yet. But, I would like to get their insurance taken care of.' },
  { num: '6290',  gm: '178538274544226679',  author: 'tm_kc', date: '2026-07-30T03:39:05.000Z',
    text: 'From Jon:\nI am helping at the masonry crew for $20 an hour but due to weather and temperatures we have not been able to get in full days of work. I would round it out to $350-$400 a week. \n\nMy job opportunities are as usual. Very hard to get a call back, but sometimes I get a few interviews and begin to have hope only to not hear from them again. This one that I have been working with that I would be a hybrid employee with a company in Maine seems hopeful, I just wish I would know something sooner than their timeline.' },
  { num: '7354',  gm: '178576850845599198',  author: 'tm_ts', date: '2026-08-03T14:48:28.000Z',
    text: 'Hey y’all, I spoke with Crystal Waldo today. She was sort of in a panic and was so low she couldn’t get gas. I went ahead and sent her $500 but we went through what she needs for the month and I believe she will need a total of 1000 asking for that approval. Thanks. Let me know if you have any questions.' },
  { num: '4821',  gm: '178587465778135337',  author: 'tm_dc', date: '2026-08-04T20:17:37.000Z',
    text: 'Created new poll \'Seeking approval for $500 to pay Exceptional Foundation fee for Patrice’s son, TW for August\'' },
  { num: '4821',  gm: '178587947996710660',  author: 'tm_dc', date: '2026-08-04T21:37:59.000Z',
    text: 'She has been working every weekend. (Saturday and unfortunately Sunday) I dropped in last Saturday unannounced to give her a birthday gift and she was working the front desk at Ross Bridge. I know she really wants to be at church, but she is scheduled most every Sunday. She has tried to adjust her schedule but she also really needs the hours. \nI’d love to get her in a different position (out of hospitality) to get better hours.' },
  { num: '6290',  gm: '178648829352072540',  author: 'tm_kc', date: '2026-08-11T22:44:53.000Z',
    text: 'Gents, an update on the Brightwells. Jon is still working a part time masonry job and has expanded his jon search outside of the state. After talking with him, I think his problems could be mitigated with some professional career coaching.  Ed recommended someone he used years ago that is a believer and has reasonable rates. We\'re reviewing Jon\'s situation tomorrow.\nJon gets lots of interviews but doesn\'t seem to be able to close the deal. I think this could help.\nIn the meantime,  they need help with insurance, their mortgage,  healthcare costs, and utilities for August in the sum of $2901.92. This also includes money for groceries and gas. Please let me know if you approve or have any questions.' },
  { num: '6290',  gm: '178654552461992592',  author: 'tm_kc', date: '2026-08-12T14:38:44.000Z',
    text: 'One last note. Jon has maxed out his HELOC. Hunter and I are meeting with him next week to talk about what we can reasonably do to pull back financial support.  He\'s incredibly frustrated and ashamed that he\'s been unable to provide for his family.  Let me know if there are any questions.' },
];

// Merge GROUPME_CATCHUP into a cases array, in place. Additive and idempotent:
// a note already present (by deterministic id, or by identical text on that same
// case) is skipped, so this is safe to run on a live DB more than once. Notes are
// prepended newest-first to match how the app stores them.
// Returns { added, skipped, missing }.
function applyGroupmeCatchup(cases) {
  const added = [], skipped = [], missing = [], touched = new Set();
  // Oldest first, so repeated unshifts leave the array newest-first.
  GROUPME_CATCHUP.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(n => {
    const c = (cases || []).find(x => x.caseNumber === n.num);
    if (!c) { missing.push(n.num + ' / ' + n.gm); return; }
    if (!Array.isArray(c.notes)) c.notes = [];
    touched.add(c);
    const id = 'n_gm_' + n.gm;
    if (c.notes.some(x => x.id === id || (x.text || '').trim() === n.text.trim())) {
      skipped.push(c.caseNumber + ' ' + n.date.slice(0, 10));
      return;
    }
    c.notes.unshift({ id, author: n.author, date: n.date, text: n.text, source: 'groupme' });
    added.push({ caseNumber: c.caseNumber, name: c.name, author: n.author, date: n.date, id, text: n.text });
  });
  // Re-derive lastActivity from the notes actually on each case we touched. Driving
  // it off max(note date) rather than only off what we just inserted keeps the case
  // header honest when a note was skipped because a deacon had already typed it in.
  touched.forEach(c => {
    (c.notes || []).forEach(n => {
      if (n.date && (!c.lastActivity || n.date > c.lastActivity)) c.lastActivity = n.date;
    });
  });
  return { added, skipped, missing };
}

applyGroupmeCatchup(CASES);

const STATE = {
  team: TEAM,
  cases: CASES,
  events: [],
};

module.exports = { STATE, TEAM, CASES, GROUPME_CATCHUP, applyGroupmeCatchup };
