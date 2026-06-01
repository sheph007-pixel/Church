// Slim data — drop member breakdowns, ages, roles, vote arrays
// Each case is just: identity, summary, notes, files, optional money

const TEAM = [
  { id: 'tm1', name: 'David Reed',     initials: 'DR', role: 'Team Lead',  color: '#3b82f6' },
  { id: 'tm2', name: 'Sarah Pike',     initials: 'SP', role: 'Treasurer',  color: '#10b981' },
  { id: 'tm3', name: 'Marcus Hall',    initials: 'MH', role: 'Member',     color: '#f59e0b' },
  { id: 'tm4', name: 'Anna Beckett',   initials: 'AB', role: 'Member',     color: '#8b5cf6' },
  { id: 'tm5', name: 'Tom Whitfield',  initials: 'TW', role: 'Member',     color: '#ef4444' },
  { id: 'tm6', name: 'Grace Lin',      initials: 'GL', role: 'Member',     color: '#06b6d4' },
  { id: 'tm7', name: 'Paul Mendez',    initials: 'PM', role: 'Member',     color: '#84cc16' },
  { id: 'tm8', name: 'Rachel Owens',   initials: 'RO', role: 'Member',     color: '#ec4899' },
  { id: 'tm9', name: 'Ben Carver',     initials: 'BC', role: 'Member',     color: '#6366f1' },
];
const ME_ID = 'tm4'; // Anna

const NEED_TYPES = {
  rent:      'Rent / housing',
  utilities: 'Utilities',
  medical:   'Medical',
  food:      'Food / groceries',
  transport: 'Transport',
  childcare: 'Childcare',
  other:     'Other',
};

const STATUSES = {
  new:      { label: 'New',      color: '#2563eb' },
  active:   { label: 'Active',   color: '#059669' },
  ongoing:  { label: 'Ongoing',  color: '#d97706' },
  paused:   { label: 'Paused',   color: '#71717a' },
  resolved: { label: 'Closed',   color: '#a1a1aa' },
};

const CASES = [
  {
    id: 'c1', caseNumber: 'B-014', household: 'Alvarez',
    type: 'rent', status: 'active',
    assigned: ['tm4', 'tm6'],
    opened: '2026-05-08', lastActivity: '2026-05-20T14:22:00',
    helpGiven: 1850, approvedBy: 'team',
    summary: "Behind on May rent after Carlos was laid off. Landlord started eviction. Maria works part-time at the school cafeteria.",
    notes: [
      { id: 'n1', author: 'tm4', date: '2026-05-20T14:22:00', text: "Met at their apartment. Carlos has two job interviews lined up — Amazon warehouse and a roofing crew. Landlord agreed to wait until May 31 if we cover this month's rent." },
      { id: 'n2', author: 'tm6', date: '2026-05-15T19:10:00', text: "Talked w/ Maria. She's anxious but composed. Grocery situation OK — she got a food box from Westside Pantry last Saturday. Main worry is rent + electric." },
      { id: 'n3', author: 'tm1', date: '2026-05-10T09:00:00', text: "Pastor Mike referred this family after Sunday service. Reached out to Anna & Grace to take lead." },
    ],
    files: [
      { id: 'f1', name: 'May-rent-notice.pdf', size: '184 KB' },
      { id: 'f2', name: 'lease-agreement.pdf', size: '1.2 MB' },
    ],
  },
  {
    id: 'c2', caseNumber: 'B-015', household: 'Okonkwo',
    type: 'medical', status: 'new',
    assigned: ['tm3'],
    opened: '2026-05-19', lastActivity: '2026-05-21T08:30:00',
    helpGiven: 0, approvedBy: 'deacon_pending',
    pendingAmount: 2400,
    summary: "Out-of-pocket cost for follow-up MRI after diagnosis. Insurance covers most but $2,400 deductible remains.",
    notes: [
      { id: 'n1', author: 'tm3', date: '2026-05-21T08:30:00', text: "Caught up with Grace this morning. MRI scheduled June 4. She has the bill estimate from St. Joseph's. Asked if she'd be OK with us paying the hospital directly — yes, her preference." },
      { id: 'n2', author: 'tm3', date: '2026-05-19T18:45:00', text: "First conversation after small group. Shared her diagnosis privately and asked for prayer + help with the deductible. Currently between contracts. Stable housing, no other immediate needs." },
    ],
    files: [{ id: 'f1', name: 'st-joseph-estimate.pdf', size: '212 KB' }],
  },
  {
    id: 'c3', caseNumber: 'B-011', household: 'Bennett',
    type: 'utilities', status: 'ongoing',
    assigned: ['tm5', 'tm8'],
    opened: '2026-03-12', lastActivity: '2026-05-18T16:00:00',
    helpGiven: 920, approvedBy: 'team',
    summary: "Fixed-income retirees. Gas + electric arrears built up over winter. Covered Feb-Mar bills directly; checking in monthly.",
    notes: [
      { id: 'n1', author: 'tm5', date: '2026-05-18T16:00:00', text: "Monthly check-in. April bill was manageable. James said the weatherization volunteers made a real difference. No current ask." },
      { id: 'n2', author: 'tm8', date: '2026-04-20T11:00:00', text: "Dropped off groceries. Helen mentioned she's taking on some online tutoring — extra ~$200/mo." },
    ],
    files: [],
  },
  {
    id: 'c4', caseNumber: 'B-016', household: 'Thornton',
    type: 'food', status: 'active',
    assigned: ['tm7'],
    opened: '2026-05-14', lastActivity: '2026-05-19T12:00:00',
    helpGiven: 200, approvedBy: 'team',
    summary: "Single mom recently moved from out-of-state. SNAP application pending. Bridge support for ~6 weeks.",
    notes: [
      { id: 'n1', author: 'tm7', date: '2026-05-19T12:00:00', text: "Sent her this week's $100 grocery card. SNAP interview scheduled for May 28." },
      { id: 'n2', author: 'tm7', date: '2026-05-14T17:00:00', text: "Met Rebecca at the cafe near her apartment. Job interview at Target next Tuesday. She's resourceful and motivated." },
    ],
    files: [],
  },
  {
    id: 'c5', caseNumber: 'B-013', household: 'Park',
    type: 'transport', status: 'new',
    assigned: ['tm9'],
    opened: '2026-05-17', lastActivity: '2026-05-20T20:00:00',
    helpGiven: 0, approvedBy: 'team_pending',
    pendingAmount: 1000,
    summary: "Only car needs a transmission repair — Daniel uses it for his night-shift commute to the hospital.",
    notes: [
      { id: 'n1', author: 'tm9', date: '2026-05-20T20:00:00', text: "Got the estimate from Brake & Tire on Glenwood — $1,200 for rebuilt transmission, 60-day labor warranty. Daniel says he can pay $200 himself." },
      { id: 'n2', author: 'tm9', date: '2026-05-17T15:00:00', text: "Daniel called me after worship. Car broke down Friday on the way home. He's been getting Uber rides ($45/night)." },
    ],
    files: [{ id: 'f1', name: 'brake-tire-estimate.jpg', size: '1.4 MB' }],
  },
  {
    id: 'c6', caseNumber: 'B-010', household: 'Williams',
    type: 'childcare', status: 'resolved',
    assigned: ['tm6'],
    opened: '2026-02-04', lastActivity: '2026-04-30T14:00:00',
    helpGiven: 1400, approvedBy: 'team',
    summary: "Covered after-school care for 12 weeks while Tasha completed CNA certification. Started full-time April 14.",
    notes: [
      { id: 'n1', author: 'tm6', date: '2026-04-30T14:00:00', text: "Closing case. Tasha is six weeks in at Mercy and stable. She sent a thank-you note for the team." },
      { id: 'n2', author: 'tm6', date: '2026-03-20T10:00:00', text: "Halfway through CNA program, at the top of her class. After-school is going smoothly." },
    ],
    files: [],
  },
  {
    id: 'c7', caseNumber: 'B-009', household: 'Khoury',
    type: 'other', status: 'paused',
    assigned: ['tm8'],
    opened: '2026-01-22', lastActivity: '2026-04-08T11:00:00',
    helpGiven: 600, approvedBy: 'team',
    summary: "Layla declined further help. Connected her with the women's ministry support group. Paused but open in case she reaches out again.",
    notes: [
      { id: 'n1', author: 'tm8', date: '2026-04-08T11:00:00', text: "Layla is doing better — new job at the library went permanent. She asked us to pause; said she wants to give back when she's able." },
    ],
    files: [],
  },
  {
    id: 'c8', caseNumber: 'B-012', household: 'Singh',
    type: 'medical', status: 'active',
    assigned: ['tm2', 'tm4'],
    opened: '2026-04-30', lastActivity: '2026-05-19T09:00:00',
    helpGiven: 0, approvedBy: 'deacon_pending',
    pendingAmount: 2200,
    summary: "Priya needs gallbladder surgery, scheduled June 18. Out-of-pocket portion is $3,200. Family has $1,000 saved.",
    notes: [
      { id: 'n1', author: 'tm4', date: '2026-05-19T09:00:00', text: "Visited at their home. Arjun was apologetic about asking. Reassured him. Priya in good spirits, just tired." },
      { id: 'n2', author: 'tm2', date: '2026-05-02T13:00:00', text: "Confirmed insurance numbers with Priya. $3,200 out-of-pocket is correct. Hospital will accept payment directly from us." },
    ],
    files: [{ id: 'f1', name: 'surgery-estimate.pdf', size: '156 KB' }],
  },
];

const fmt2 = {
  money: (n) => n == null || n === 0 ? '—' : '$' + n.toLocaleString('en-US'),
  date: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  dateFull: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  relative: (iso) => {
    const now = new Date('2026-05-21T12:00:00');
    const d = new Date(iso);
    const diff = Math.floor((now - d) / 86400000);
    if (diff < 1) {
      const hrs = Math.floor((now - d) / 3600000);
      if (hrs < 1) return 'just now';
      return hrs + 'h ago';
    }
    if (diff === 1) return 'yesterday';
    if (diff < 7) return diff + 'd ago';
    if (diff < 30) return Math.floor(diff/7) + 'w ago';
    return fmt2.date(iso);
  },
  initials: (name) => name.split(/\s+/).map(p => p[0]).slice(0,2).join('').toUpperCase(),
};

// Very light redaction stub
function redact(text) {
  return text
    .replace(/\b(Maria|Carlos|Sofia|Diego|James|Helen|Rebecca|Owen|Grace|Daniel|Hye-Jin|Joshua|Tasha|Mia|Jaylen|Layla|Sami|Arjun|Priya|Mike|Anna)\b/g, '[name]')
    .replace(/\b(Alvarez|Bennett|Thornton|Okonkwo|Park|Williams|Khoury|Singh)\b/g, '[household]')
    .replace(/\b(Mercy|St\. Joseph's|Duke Energy|Piedmont Gas|Amazon|Brake & Tire on Glenwood|Target|Westside Pantry|Glenwood)\b/g, '[provider]')
    .replace(/\b(Pastor Mike)\b/g, '[church staff]')
    .replace(/\$\d+(?:\,\d{3})*(?:\/\w+)?/g, '$[amt]');
}

Object.assign(window, { TEAM, ME_ID, NEED_TYPES, STATUSES, CASES, fmt2, redact });
