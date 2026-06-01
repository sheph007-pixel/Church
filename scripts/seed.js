// One-time DB seed — run via the /api/seed endpoint or directly with DATABASE_URL set.
// Safe to call multiple times: skips if data already exists.

const TEAM = [
  { id: 'tm10',  name: 'Hunter Kennion', initials: 'HK', email: 'hunter@kennion.com',
    phone: '', color: '#0f766e', addedBy: 'system', addedAt: '2024-07-01',
    isLeader: true, lastLogin: null },
  { id: 'tm_ts', name: 'Timothy Smith',  initials: 'TS', email: '',
    phone: '', color: '#2563eb', addedBy: 'tm10', addedAt: '2024-07-01',
    isLeader: false, lastLogin: null },
  { id: 'tm_ca', name: 'Chase Aldridge', initials: 'CA', email: '',
    phone: '', color: '#0891b2', addedBy: 'tm10', addedAt: '2024-07-01',
    isLeader: false, lastLogin: null },
  { id: 'tm_dc', name: 'Derek Cavin',    initials: 'DC', email: '',
    phone: '', color: '#7c3aed', addedBy: 'tm10', addedAt: '2024-07-01',
    isLeader: false, lastLogin: null },
  { id: 'tm_js', name: 'Jeremy Shank',   initials: 'JS', email: '',
    phone: '', color: '#059669', addedBy: 'tm10', addedAt: '2025-05-10',
    isLeader: false, lastLogin: null },
  { id: 'tm_jh', name: 'Josiah Helms',   initials: 'JH', email: '',
    phone: '', color: '#b45309', addedBy: 'tm10', addedAt: '2025-05-10',
    isLeader: false, lastLogin: null },
  { id: 'tm_kc', name: 'Keith Cooke',    initials: 'KC', email: '',
    phone: '', color: '#dc2626', addedBy: 'tm10', addedAt: '2024-07-01',
    isLeader: false, lastLogin: null },
  { id: 'tm_rs', name: 'Randal Snook',   initials: 'RS', email: '',
    phone: '', color: '#0d9488', addedBy: 'tm10', addedAt: '2025-05-10',
    isLeader: false, lastLogin: null },
  { id: 'tm_wy', name: 'Watkins Y',      initials: 'WY', email: '',
    phone: '', color: '#9333ea', addedBy: 'tm10', addedAt: '2025-05-10',
    isLeader: false, lastLogin: null },
];

const CASES = [
  // ─── 24-001 · Patrice Smiley ────────────────────────────────────────
  {
    id: 'c_24001',
    caseNumber: '24-001',
    name: 'Patrice Smiley',
    status: 'active',
    opened: '2024-07-25',
    lastActivity: '2025-05-29T12:00:00.000Z',
    contacts: [
      { id: 'p_24001_1', name: 'Patrice Smiley', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [
      { id: 't_24001_1', text: 'Follow up on van repair status and rental return', done: false, assignee: 'tm_dc' },
    ],
    notes: [
      {
        id: 'n_24001_0',
        author: 'tm_dc',
        date: '2025-05-29T12:00:00.000Z',
        text: 'Approved $350 for a final rental week — flagged as the last rental request. Van repair should be completed soon. Total rental outlay: ~$1,350 gross ($500 refundable deposit + three weekly rentals of $250, $250, and $350). Net cost roughly $850 assuming the deposit is returned.',
      },
      {
        id: 'n_24001_1',
        author: 'tm_dc',
        date: '2025-05-14T12:00:00.000Z',
        text: 'Approved $250 for a second week of car rental (running total now $1,000: $500 deposit + $250 first week + $250 second week). Van still in shop following the March alternator and power steering pump replacement. Patrice has been without her own vehicle for several weeks.',
      },
      {
        id: 'n_24001_2',
        author: 'tm_dc',
        date: '2025-03-23T12:00:00.000Z',
        text: 'Major vehicle repairs approved this month: $1,772 for alternator and power steering pump at John Michael Motors; $600 for one week of car rental during repairs; $394 for prior towing fees; $70 diagnostic check (March 20). Total vehicle-related outlay in March: ~$2,836. Patrice approved $600 for rental car for an additional week (March 23). Rental car previously approved $750 (May 11 week).',
      },
      {
        id: 'n_24001_3',
        author: 'tm_ts',
        date: '2025-01-20T12:00:00.000Z',
        text: 'Approved $600 for rent and food. Patrice tested COVID-positive in February and was unable to work. In December she received a donated 2012 Honda Odyssey (LX, 170k miles, estimated $7,500 value) from David Marsh — a significant gift. Prior approvals: $96 for 6-month P.O. box (Jan 8); $309 vehicle insurance (Nov); $348.34 Odyssey registration tag (Dec 10); $500 in gift cards ($250 Old Navy, $250 Walmart, Dec 19).',
      },
      {
        id: 'n_24001_4',
        author: 'tm_ts',
        date: '2024-11-06T12:00:00.000Z',
        text: 'Car repossessed October 29 while parked at a truck stop. DHR involvement required relocation from her motel. Approved: $400 car rental (Nov 6), $50 car title for scrap yard (Nov 12), $400 car rental (Nov 13), $309 insurance coverage (Nov 20). Discussed and approved $500 in holiday gift cards for her children (Old Navy + Walmart). Total assistance through October: $700 housing/car tag (Oct 9), $150 groceries after motel lock-out (Sept 16), $150 food for diverticulitis (Sept 29), $500 (Sept 4).',
      },
      {
        id: 'n_24001_5',
        author: 'tm_ts',
        date: '2024-07-25T12:00:00.000Z',
        text: 'Case opened. Patrice is a hotel worker with recently reduced hours and active bankruptcy proceedings (finalized by September). Has multiple children. Approved $100 for gas and groceries (Jul 25). Following week: $231.63 for car battery replacement (Jul 27). September: $500 general assistance (Sept 4), $150 groceries after motel lock-out (Sept 16), $150 food while dealing with diverticulitis/ER visits (Sept 29). October: $700 ($500 housing + $200 car tag, Oct 9).',
      },
    ],
    files: [],
  },

  // ─── 24-002 · Crystal Waldo ─────────────────────────────────────────
  {
    id: 'c_24002',
    caseNumber: '24-002',
    name: 'Crystal Waldo',
    status: 'active',
    opened: '2024-07-27',
    lastActivity: '2025-06-01T12:00:00.000Z',
    contacts: [
      { id: 'p_24002_1', name: 'Crystal Waldo', phone: '', email: '', role: 'Primary' },
      { id: 'p_24002_2', name: 'CJ (son)', phone: '', email: '', role: 'Child' },
      { id: 'p_24002_3', name: 'Cody (son, youngest)', phone: '', email: '', role: 'Child' },
    ],
    careTeam: [
      { id: 'ct_24002_1', name: 'Timothy Smith', role: 'Deacon Lead' },
      { id: 'ct_24002_2', name: 'Shelby Seagrest', role: 'Care Team' },
    ],
    tasks: [
      { id: 't_24002_1', text: 'Confirm June COBRA payment ($1,973.90) has been processed', done: false, assignee: 'tm_ts' },
      { id: 't_24002_2', text: 'Monitor child support legal proceedings — ex is 2+ months behind', done: false, assignee: 'tm_ts' },
    ],
    notes: [
      {
        id: 'n_24002_1',
        author: 'tm_ts',
        date: '2025-05-21T12:00:00.000Z',
        text: 'Critical month: ex-husband stopped child support for 2 months, Crystal had 2 unpaid leave days, and had only ~$50 left for the month. Approved $2,000 emergency assistance. Additionally, June COBRA health insurance: $1,973.90. Total June commitment: ~$3,974. Crystal is a Grace Group member and active Faith Presbyterian attendee.',
      },
      {
        id: 'n_24002_2',
        author: 'tm_ts',
        date: '2025-04-12T12:00:00.000Z',
        text: 'Approved: $600 car repair (Crystal pays $500 of $1,000 bill — church covers $600, she pays half). $600 gas/mileage reimbursement to Chris Appleby who volunteered 6 weeks of twice-daily transportation for CJ to Hoover alternative school (7:30am starts) after other diaconate members couldn\'t coordinate schedules — he formed a real connection with CJ. $750 for 5 counseling sessions for Cody at Insights Counseling ($150/session, March 20 approval). $800 March 20: new tires + power bill.',
      },
      {
        id: 'n_24002_3',
        author: 'tm_ts',
        date: '2025-01-22T12:00:00.000Z',
        text: 'Approved $500 for car rental in preparation for upcoming shop visit. Ex-husband is now 2 months behind on court-ordered $500/month child support. Legal action pending but court date not yet scheduled. Crystal is working 2 jobs including Sundays. CJ now in alternative school in Hoover (transportation is a significant challenge). Child support legal retainer $2,500 previously approved.',
      },
      {
        id: 'n_24002_4',
        author: 'tm_ts',
        date: '2024-11-04T12:00:00.000Z',
        text: 'Approved $500 monthly assistance (Nov 4). Nov 15: $1,270 ($770 to even out bank account overdraft + $500 assistance). Dec 7: $500 food and gas. Crystal working 2 jobs to cover the gap left by ex-husband\'s non-payment. Discussed holiday gift planning for the family.',
      },
      {
        id: 'n_24002_5',
        author: 'tm_ts',
        date: '2024-07-27T12:00:00.000Z',
        text: 'Case opened. Crystal is a single mom with 3 children. Ex-husband is not paying $500/month court-ordered child support. She is working 2 jobs including Sundays. Has been receiving some support for several years. Approved $219/month for after-school care (8/11/25–5/11/26) through full diaconate. August 1: $1,000 from deacon fund for school supplies and Uber rides. October 4: $500 child-support shortfall. Long-term care plan in place with Timothy Smith and Shelby Seagrest on care team.',
      },
    ],
    files: [],
  },

  // ─── 24-003 · Ali Tutak ─────────────────────────────────────────────
  {
    id: 'c_24003',
    caseNumber: '24-003',
    name: 'Ali Tutak',
    status: 'active',
    opened: '2024-07-31',
    lastActivity: '2025-05-26T12:00:00.000Z',
    contacts: [
      { id: 'p_24003_1', name: 'Ali Tutak', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [
      { id: 't_24003_1', text: 'Form care team for Ali now that he is back from Turkey', done: false, assignee: 'tm10' },
    ],
    notes: [
      {
        id: 'n_24003_1',
        author: 'tm_ts',
        date: '2025-05-26T12:00:00.000Z',
        text: 'Approved $1,047 for June rent. Ali has transferred from Domino\'s Valleydale location to the Chelsea location and expects stable income going forward. Team plans to form a formal care team now that he is back from Turkey. Prior approval: $990 round-trip flight to Turkey (Feb 4) for family emergency — sister was in critical condition after a car accident, mother is 80 years old. Spent 4+ weeks caring for family before returning.',
      },
      {
        id: 'n_24003_2',
        author: 'tm_ts',
        date: '2025-03-16T12:00:00.000Z',
        text: 'Approved $1,006 for April rent while Ali remains in Turkey (4+ weeks and counting). Sister is in critical condition in the hospital. Mother is 80 and lost her husband in 2020. Ali has been working Domino\'s minimum wage since accounting job in Turkey fell through. ~$3,000 spent on car repairs in recent months. Derrick Helm (Cornerstone KC rep) previously worked with Ali.',
      },
      {
        id: 'n_24003_3',
        author: 'tm_ts',
        date: '2024-12-04T12:00:00.000Z',
        text: 'Approved $967 for December rent. The accounting job in Turkey did not work out. Ali returned to Birmingham and is now working at Domino\'s (Valleydale) for minimum wage. Job prospects are limited. February: $990 rent approved.',
      },
      {
        id: 'n_24003_4',
        author: 'tm_ts',
        date: '2024-07-31T12:00:00.000Z',
        text: 'Case opened. Ali Tutak is a Cornerstone KC resident and member. Approved $946 for rent — he is moving temporarily to Turkey to take an accounting job. Derrick Helm (Cornerstone KC deacon rep) has worked with him previously. Expected to return to Birmingham from Turkey in April.',
      },
    ],
    files: [],
  },

  // ─── 24-004 · Confidential — Medical ────────────────────────────────
  {
    id: 'c_24004',
    caseNumber: '24-004',
    name: 'Confidential — Medical',
    status: 'closed',
    opened: '2024-07-28',
    lastActivity: '2025-01-28T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      {
        id: 'n_24004_1',
        author: 'tm_ts',
        date: '2024-07-28T12:00:00.000Z',
        text: 'Case opened. Faith church member referred by Jason and Martin. Unable to work due to inpatient medical treatment. Approved $1,000/month for 6 months ($6,000 total) to cover bills and allow full focus on health recovery. Approved to full diaconate. 6-month assistance plan completed; case closed.',
      },
    ],
    files: [],
  },

  // ─── 24-005 · Rebekah Kirkland ──────────────────────────────────────
  {
    id: 'c_24005',
    caseNumber: '24-005',
    name: 'Rebekah Kirkland',
    status: 'closed',
    opened: '2024-10-23',
    lastActivity: '2024-11-01T12:00:00.000Z',
    contacts: [
      { id: 'p_24005_1', name: 'Rebekah Kirkland', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [],
    notes: [
      {
        id: 'n_24005_2',
        author: 'tm_ts',
        date: '2024-11-01T12:00:00.000Z',
        text: 'Move completed. Volunteers assisted with U-Haul and storage unit. Rebekah\'s business rebuilding is expected to progress quickly and no further ongoing assistance is anticipated. Case closed.',
      },
      {
        id: 'n_24005_1',
        author: 'tm_ts',
        date: '2024-10-23T12:00:00.000Z',
        text: 'Case opened via Bradley Moore. Rebekah (formerly Anderson) is post-divorce, living with her parents, with a 9-year-old child enrolled at Westminster school. Approved $2,000 for Westminster school tuition covering the remainder of the school year (significant discount applied). One-time assistance for immediate financial gap; business is expected to self-sustain soon. Move from shared house to storage unit coordinated with volunteers.',
      },
    ],
    files: [],
  },

  // ─── 24-006 · Emily Moore ────────────────────────────────────────────
  {
    id: 'c_24006',
    caseNumber: '24-006',
    name: 'Emily Moore',
    status: 'closed',
    opened: '2024-11-13',
    lastActivity: '2024-11-13T12:00:00.000Z',
    contacts: [
      { id: 'p_24006_1', name: 'Emily Moore', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [],
    notes: [
      {
        id: 'n_24006_1',
        author: 'tm_ts',
        date: '2024-11-13T12:00:00.000Z',
        text: 'Case opened via Amy Henry. Emily Moore is a junior at Samford University and a Genesis KC member who completed the Foundations class. Her father died by suicide at their home in Houston — a devastating loss for the entire family. Approved $1,500 for counseling at Covenant Christian Counseling. The whole family needs counseling. Emily is a remarkable young woman who loves the church deeply and moved quickly to begin the counseling process. Case closed after counseling funds disbursed.',
      },
    ],
    files: [],
  },

  // ─── 25-001 · Jon & Alicia Brightwell ───────────────────────────────
  {
    id: 'c_25001',
    caseNumber: '25-001',
    name: 'Jon & Alicia Brightwell',
    status: 'active',
    opened: '2025-03-04',
    lastActivity: '2025-05-28T12:00:00.000Z',
    contacts: [
      { id: 'p_25001_1', name: 'Jon Brightwell', phone: '', email: '', role: 'Primary' },
      { id: 'p_25001_2', name: 'Alicia Brightwell', phone: '', email: '', role: 'Spouse' },
    ],
    careTeam: [
      { id: 'ct_25001_1', name: 'Keith Cooke', role: 'Deacon Lead' },
      { id: 'ct_25001_2', name: 'Grady Trammell', role: 'Referring Elder' },
    ],
    tasks: [
      { id: 't_25001_1', text: 'Follow up with Jon on Moultrie interview outcome (mechanical engineer role)', done: false, assignee: 'tm_kc' },
      { id: 't_25001_2', text: 'Alicia shoulder surgery — confirm timing and insurance coverage', done: false, assignee: 'tm_kc' },
      { id: 't_25001_3', text: 'Process July COBRA payment when due', done: false, assignee: 'tm_kc' },
    ],
    notes: [
      {
        id: 'n_25001_1',
        author: 'tm_kc',
        date: '2025-05-28T12:00:00.000Z',
        text: 'Approved $1,973.90 COBRA for June. Jon had a promising follow-up interview at Moultrie (mechanical engineer position) — Daniel Wilson provided his resume directly to the hiring manager. Jeremy Shank has connections on the product side. Jon is becoming very discouraged by the ongoing rejections and extended unemployment. May 18: $2,245.39 approved for medical bills and utilities.',
      },
      {
        id: 'n_25001_2',
        author: 'tm_kc',
        date: '2025-04-30T12:00:00.000Z',
        text: 'Approved $3,349.83 for itemized bills (utilities, insurance, medical). Alicia\'s shoulder surgery is time-sensitive and needs to happen soon. Jon continues to work with a recruiter and has had several interviews but no offers yet. Unemployment benefits are now active. Family of 6 — all 4 children need ongoing insurance coverage.',
      },
      {
        id: 'n_25001_3',
        author: 'tm_kc',
        date: '2025-03-15T12:00:00.000Z',
        text: 'Approved $1,140 for utilities and insurance payments (Mar 15). Approved $1,973.90 COBRA for March (Mar 31). Jon in touch with recruiter, actively interviewing. Case transitioned from initial introduction phase to ongoing support. Grady Trammell (elder) remains engaged.',
      },
      {
        id: 'n_25001_4',
        author: 'tm_kc',
        date: '2025-03-04T12:00:00.000Z',
        text: 'Case opened via Grady Trammell; initial contact by Bradley Moore. Jon Brightwell (mechanical engineer) lost his job unexpectedly. Alicia has a shoulder condition requiring surgery. Family of 6 — they are active in the same KC as Brent Dorner (Grace Group). Lost health insurance with job loss. Approved first COBRA payment: $1,973.90. Keith Cooke assigned as primary deacon lead.',
      },
    ],
    files: [],
  },

  // ─── 25-002 · Amanda Jones ──────────────────────────────────────────
  {
    id: 'c_25002',
    caseNumber: '25-002',
    name: 'Amanda Jones',
    status: 'active',
    opened: '2025-03-26',
    lastActivity: '2025-04-16T12:00:00.000Z',
    contacts: [
      { id: 'p_25002_1', name: 'Amanda Jones', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [
      { id: 'ct_25002_1', name: 'Randal Snook', role: 'Care Team Lead' },
      { id: 'ct_25002_2', name: 'Amber Peterson', role: 'Care Team' },
    ],
    tasks: [
      { id: 't_25002_1', text: 'Follow up with Amanda — health insurance renewal and overall stability check', done: false, assignee: 'tm_rs' },
      { id: 't_25002_2', text: 'Confirm septic system repairs are fully complete', done: false, assignee: 'tm_rs' },
    ],
    notes: [
      {
        id: 'n_25002_1',
        author: 'tm_rs',
        date: '2025-04-16T12:00:00.000Z',
        text: 'Septic system repairs completed: $1,673 approved March 31 (pump-out $631 + mini excavator rental $850 + mower repair by Keith Belcher $192). Issue was inherited from the home purchase roughly a year ago. Amanda continues to show a sweet spirit and gratitude. Care team following up on health insurance renewal and overall stability.',
      },
      {
        id: 'n_25002_2',
        author: 'tm_rs',
        date: '2025-03-31T12:00:00.000Z',
        text: 'Additional approval: $1,405 health insurance premium + $300 Walmart gift card. Septic system issue confirmed as a major problem inherited from the home purchase roughly a year ago. Amanda has a sweet spirit and is genuinely grateful for the church\'s help. Showing signs of taking steps toward self-sufficiency.',
      },
      {
        id: 'n_25002_3',
        author: 'tm_rs',
        date: '2025-03-26T12:00:00.000Z',
        text: 'Case opened. Amanda is a single mom with 2 children, a regular Faith Presbyterian member. There was some initial shame around asking for help but she opened up well. Approved $1,705: $1,405 health insurance premium + $300 Walmart gift card. Randal Snook assigned as care team lead; Amber Peterson joining care team.',
      },
    ],
    files: [],
  },

  // ─── 25-003 · Shane & Kelcey Alexander ──────────────────────────────
  {
    id: 'c_25003',
    caseNumber: '25-003',
    name: 'Shane & Kelcey Alexander',
    status: 'paused',
    opened: '2025-04-15',
    lastActivity: '2025-04-15T12:00:00.000Z',
    contacts: [
      { id: 'p_25003_1', name: 'Shane Alexander', phone: '', email: '', role: 'Primary' },
      { id: 'p_25003_2', name: 'Kelcey Alexander', phone: '', email: '', role: 'Spouse' },
    ],
    careTeam: [],
    tasks: [
      { id: 't_25003_1', text: 'Follow up on counseling progress with Melea Stephens at Blue Lake', done: false, assignee: 'tm10' },
    ],
    notes: [
      {
        id: 'n_25003_1',
        author: 'tm10',
        date: '2025-04-15T12:00:00.000Z',
        text: 'Case opened via Bradley Moore (Covenant KC elder). Shane and Kelcey are in Covenant KC and their marriage is struggling. Approved $1,500 for approximately 10 sessions of marriage counseling with Melea Stephens at Blue Lake Christian Clinic. Status paused pending counseling completion.',
      },
    ],
    files: [],
  },

  // ─── 25-004 · Robert Fulcher ────────────────────────────────────────
  {
    id: 'c_25004',
    caseNumber: '25-004',
    name: 'Robert Fulcher',
    status: 'active',
    opened: '2025-05-14',
    lastActivity: '2025-05-20T12:00:00.000Z',
    contacts: [
      { id: 'p_25004_1', name: 'Robert Fulcher', phone: '', email: '', role: 'Primary' },
    ],
    careTeam: [],
    tasks: [
      { id: 't_25004_1', text: 'Check in with Robert — confirm A/C repair resolved and family is stable', done: false, assignee: 'tm10' },
    ],
    notes: [
      {
        id: 'n_25004_1',
        author: 'tm10',
        date: '2025-05-20T12:00:00.000Z',
        text: 'Approved $1,500 for A/C repair — faulty thermal expansion valve. Needed urgently for his family.',
      },
      {
        id: 'n_25004_2',
        author: 'tm10',
        date: '2025-05-14T12:00:00.000Z',
        text: 'Case opened (transferred from prior deacon Mitchell who rolled off). Robert works in construction; weather reduced his hours by roughly half over the past 2 months. Approved $1,331.43: approximately $1,131 in medical bills + ~$200 electric/gas utilities.',
      },
    ],
    files: [],
  },

  // ─── 25-005 · Covenant KC Couple — Counseling ────────────────────────
  {
    id: 'c_25005',
    caseNumber: '25-005',
    name: 'Confidential couple (Covenant KC)',
    status: 'active',
    opened: '2025-05-13',
    lastActivity: '2025-05-13T12:00:00.000Z',
    contacts: [],
    careTeam: [
      { id: 'ct_25005_1', name: 'Derek Cavin', role: 'Referring Deacon' },
    ],
    tasks: [
      { id: 't_25005_1', text: 'Follow up on counseling progress at Blue Lake (Melea Stephens)', done: false, assignee: 'tm_dc' },
    ],
    notes: [
      {
        id: 'n_25005_1',
        author: 'tm_dc',
        date: '2025-05-13T12:00:00.000Z',
        text: "Case opened. Referred via their Covenant KC elder. Approved $1,500 for approximately 9-10 marriage counseling sessions with Melea Stephens at Blue Lake Christian Clinic. First round of counseling for this couple. Sent to full diaconate for final approval. Names kept confidential.",
      },
    ],
    files: [],
  },

  // ─── 25-006 · Confidential, counseling (Exodus KC) ──────────────────
  {
    id: 'c_25006',
    caseNumber: '25-006',
    name: 'Confidential, counseling (Exodus KC)',
    status: 'closed',
    opened: '2025-08-15',
    lastActivity: '2025-08-15T12:00:00.000Z',
    contacts: [],
    careTeam: [],
    tasks: [],
    notes: [
      {
        id: 'n_25006_1',
        author: 'tm10',
        date: '2025-08-15T12:00:00.000Z',
        text: 'Case opened and closed (one-time approval, reconstructed from GroupMe). Referred via Martin. Member in Exodus KC with significant health issues and a need for ongoing counseling; savings exhausted on prior medical and counseling bills. Approved up to $2,000 church portion, with the member covering roughly 25% of total cost. No further activity on record after this approval. Distinct from case 24-004 (that case is the July 28 inpatient member).',
      },
    ],
    files: [],
  },
];

const STATE = {
  team: TEAM,
  cases: CASES,
  events: [],
  caseCounter: 1,
};

module.exports = { STATE, TEAM, CASES };
