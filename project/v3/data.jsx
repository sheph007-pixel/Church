// v3 — Single role: Deacon. Care Team + Contacts are structured per case.
// Each contact: { id, name, phone?, email?, role? }

// Deacons (system users): name, email, phone, color
// One deacon is flagged isLeader: true at a time.
const TEAM = [
  { id: 'tm1', name: 'David Reed',     initials: 'DR', email: 'dreed@gmail.com',           phone: '(404) 555-0118', color: '#1e40af', addedBy: 'system', addedAt: '2026-01-10', isLeader: true, lastLogin: '2026-05-21T08:42:00' },
  { id: 'tm2', name: 'Sarah Pike',     initials: 'SP', email: 'sarah.pike@stvincents.com', phone: '(404) 555-0240', color: '#0f766e', addedBy: 'tm1',    addedAt: '2026-01-12', lastLogin: '2026-05-20T19:05:00' },
  { id: 'tm3', name: 'Marcus Hall',    initials: 'MH', email: 'mhall82@yahoo.com',         phone: '(770) 555-0359', color: '#b45309', addedBy: 'tm1',    addedAt: '2026-01-15', lastLogin: '2026-05-21T07:58:00' },
  { id: 'tm4', name: 'Anna Beckett',   initials: 'AB', email: 'anna.beckett@outlook.com',  phone: '(404) 555-0481', color: '#6d28d9', addedBy: 'tm1',    addedAt: '2026-01-18', lastLogin: '2026-05-20T14:22:00' },
  { id: 'tm5', name: 'Tom Whitfield',  initials: 'TW', email: 'twhitfield@protonmail.com', phone: '(678) 555-0517', color: '#be123c', addedBy: 'tm1',    addedAt: '2026-01-22', lastLogin: '2026-05-18T16:10:00' },
  { id: 'tm6', name: 'Grace Lin',      initials: 'GL', email: 'gracelin77@gmail.com',      phone: '(404) 555-0622', color: '#0e7490', addedBy: 'tm1',    addedAt: '2026-02-03', lastLogin: '2026-05-19T21:30:00' },
  { id: 'tm7', name: 'Paul Mendez',    initials: 'PM', email: 'pmendez@bellsouth.net',     phone: '(770) 555-0703', color: '#4d7c0f', addedBy: 'tm1',    addedAt: '2026-02-14', lastLogin: '2026-05-19T12:00:00' },
  { id: 'tm8', name: 'Rachel Owens',   initials: 'RO', email: 'rachel@owensfamily.com',    phone: '(404) 555-0844', color: '#a21caf', addedBy: 'tm1',    addedAt: '2026-02-20', lastLogin: '2026-05-17T10:15:00' },
  { id: 'tm9', name: 'Ben Carver',     initials: 'BC', email: 'bcarver.atl@gmail.com',     phone: '(678) 555-0962', color: '#4338ca', addedBy: 'tm1',    addedAt: '2026-03-01', lastLogin: '2026-05-20T20:05:00' },
  { id: 'tm10', name: 'Hunter Kennion', initials: 'HK', email: 'hunter@kennion.com',       phone: '',               color: '#0f766e', addedBy: 'tm1',    addedAt: '2026-06-01', lastLogin: null },
];
const ME_ID = 'tm4';

// Faith PCA Internal Benevolence team private GroupMe chat
// Deep-link to the chat for existing members (vs join_group, which is for invites).
const GROUPME_URL = 'https://app.groupme.com/chats/group/108829787';

const STATUSES = {
  active: { label: 'Active', color: '#059669' },
  paused: { label: 'Paused', color: '#a16207' },
  closed: { label: 'Closed', color: '#71717a' },
};

const CASES = [
  {
    id: 'c1', caseNumber: 'C-014',
    name: 'Alvarez Family',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'Maria Alvarez',  phone: '(404) 555-2103', email: 'malvarez.atl@gmail.com' },
      { id: 'p2', name: 'Carlos Alvarez', phone: '(404) 555-2147', email: '' },
    ],
    careTeam: [
      { id: 'ct1', name: 'Mark & Lisa Davis', phone: '(770) 555-1133', email: 'markdavis78@gmail.com', role: 'Small group · bringing meals Tuesdays' },
      { id: 'ct2', name: 'Sue Henderson',     phone: '(404) 555-1492', email: 'suehenderson@gmail.com', role: 'Helping Maria with school pickup for the kids' },
    ],
    opened: '2026-05-08', lastActivity: '2026-05-20T14:22:00',
    notes: [
      { id: 'n1', author: 'tm4', date: '2026-05-20T14:22:00', text: "Met at their apartment. Carlos has two job interviews lined up next week — Amazon warehouse and a roofing crew. Landlord agreed to wait until May 31 if we can cover this month's rent ($1,850)." },
      { id: 'n2', author: 'tm6', date: '2026-05-15T19:10:00', text: "Talked w/ Maria. She's anxious but composed. Grocery situation OK — she got a food box from Westside Pantry last Saturday. Main worry is rent + electric." },
      { id: 'n3', author: 'tm1', date: '2026-05-10T09:00:00', text: "Pastor Mike referred this family after Sunday service. Carlos has been a member 6 years. Reached out to Anna & Grace to take lead." },
    ],
    tasks: [
      { id: 't1', text: 'Confirm landlord acceptance of direct payment', done: true, assignee: 'tm4', due: '2026-05-18' },
      { id: 't2', text: 'Disburse $1,850 to landlord by May 31', done: false, assignee: 'tm2', due: '2026-05-30' },
      { id: 't3', text: 'Follow up after Carlos\'s Amazon interview', done: false, assignee: 'tm4', due: '2026-05-28' },
    ],
    files: [
      { id: 'f1', name: 'May-rent-notice.pdf', size: '184 KB' },
      { id: 'f2', name: 'lease-agreement.pdf', size: '1.2 MB' },
    ],
  },
  {
    id: 'c2', caseNumber: 'C-015',
    name: 'Grace O.',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'Grace Okonkwo', phone: '(770) 555-3318', email: 'g.okonkwo@protonmail.com' },
    ],
    careTeam: [],
    opened: '2026-05-19', lastActivity: '2026-05-21T08:30:00',
    notes: [
      { id: 'n1', author: 'tm3', date: '2026-05-21T08:30:00', text: "Caught up with Grace this morning. MRI scheduled June 4. She has the bill estimate from St. Joseph's. Asked if she'd be OK with us paying the hospital directly — yes, her preference. Bill is $2,400 deductible." },
      { id: 'n2', author: 'tm3', date: '2026-05-19T18:45:00', text: "First conversation after small group. Grace shared a recent diagnosis privately and asked for prayer + help with the deductible. Currently between contracts. Stable housing, no other immediate needs." },
    ],
    tasks: [
      { id: 't1', text: 'Add to June 2 deacon meeting agenda — $2,400 over threshold', done: true, assignee: 'tm1', due: '2026-05-22' },
      { id: 't2', text: 'Confirm hospital can accept payment directly', done: false, assignee: 'tm3', due: '2026-05-28' },
    ],
    files: [{ id: 'f1', name: 'st-joseph-estimate.pdf', size: '212 KB' }],
  },
  {
    id: 'c3', caseNumber: 'C-011',
    name: 'Bennett Household',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'James Bennett', phone: '(404) 555-4419', email: 'jbennett.retired@gmail.com' },
      { id: 'p2', name: 'Helen Bennett', phone: '(404) 555-4421', email: '' },
    ],
    careTeam: [
      { id: 'ct1', name: 'Youth Group', phone: '', email: '', role: 'Did weatherization in March · contact via Anna' },
    ],
    opened: '2026-03-12', lastActivity: '2026-05-18T16:00:00',
    notes: [
      { id: 'n1', author: 'tm5', date: '2026-05-18T16:00:00', text: "Monthly check-in with James and Helen. April utility bill was manageable. James said the weatherization volunteers from the youth group made a real difference. No current ask." },
      { id: 'n2', author: 'tm8', date: '2026-04-20T11:00:00', text: "Dropped off groceries. Helen mentioned she's taking on some online tutoring — extra ~$200/mo." },
      { id: 'n3', author: 'tm5', date: '2026-03-15T14:30:00', text: "Paid Duke Energy + Piedmont Gas directly — $612 + $308. Both confirmed." },
    ],
    tasks: [
      { id: 't1', text: 'June check-in visit', done: false, assignee: 'tm8', due: '2026-06-15' },
    ],
    files: [{ id: 'f1', name: 'duke-statement-feb.pdf', size: '88 KB' }],
  },
  {
    id: 'c4', caseNumber: 'C-016',
    name: 'Rebecca & Owen',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'Rebecca Thornton', phone: '(404) 555-5582', email: 'rebecca.t82@gmail.com' },
    ],
    careTeam: [
      { id: 'ct1', name: 'Karen Liu', phone: '(404) 555-6611', email: 'karenliu.atl@gmail.com', role: "Women's ministry · weekly drop-offs (diapers, groceries)" },
    ],
    opened: '2026-05-14', lastActivity: '2026-05-19T12:00:00',
    notes: [
      { id: 'n1', author: 'tm7', date: '2026-05-19T12:00:00', text: "Sent her this week's $100 grocery card. SNAP interview scheduled for May 28." },
      { id: 'n2', author: 'tm7', date: '2026-05-14T17:00:00', text: "Met Rebecca at the cafe near her apartment. Job interview at Target next Tuesday. She's resourceful and motivated, just need to bridge 6 weeks while SNAP paperwork clears." },
    ],
    tasks: [
      { id: 't1', text: 'Weekly grocery card through end of June', done: false, assignee: 'tm7' },
      { id: 't2', text: 'Check in after SNAP interview May 28', done: false, assignee: 'tm7', due: '2026-05-29' },
    ],
    files: [],
  },
  {
    id: 'c5', caseNumber: 'C-013',
    name: 'Park Family',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'Daniel Park',  phone: '(678) 555-7728', email: 'd.park.atl@gmail.com' },
      { id: 'p2', name: 'Hye-Jin Park', phone: '(678) 555-7729', email: '' },
    ],
    careTeam: [],
    opened: '2026-05-17', lastActivity: '2026-05-20T20:00:00',
    notes: [
      { id: 'n1', author: 'tm9', date: '2026-05-20T20:00:00', text: "Got the estimate from Brake & Tire on Glenwood — $1,200 for rebuilt transmission, 60-day labor warranty. Daniel says he can pay $200 himself if we cover the rest." },
      { id: 'n2', author: 'tm9', date: '2026-05-17T15:00:00', text: "Daniel called me after worship. Car broke down Friday on the way home from work. He's been getting Uber rides ($45/night) — not sustainable. He works night shift as an orderly." },
    ],
    tasks: [
      { id: 't1', text: 'Get team vote on $1,000 to repair shop', done: false, assignee: 'tm1', due: '2026-05-23' },
    ],
    files: [{ id: 'f1', name: 'brake-tire-estimate.jpg', size: '1.4 MB' }],
  },
  {
    id: 'c6', caseNumber: 'C-010',
    name: 'Williams Family',
    status: 'closed',
    contacts: [
      { id: 'p1', name: 'Tasha Williams', phone: '(404) 555-8814', email: 'tasha.w.cna@gmail.com' },
    ],
    careTeam: [],
    opened: '2026-02-04', lastActivity: '2026-04-30T14:00:00',
    notes: [
      { id: 'n1', author: 'tm6', date: '2026-04-30T14:00:00', text: "Closing case. Tasha is six weeks in at Mercy and stable. She sent a thank-you note for the team — taped on the office fridge :)" },
      { id: 'n2', author: 'tm6', date: '2026-03-20T10:00:00', text: "Halfway through CNA program, at the top of her class. After-school care is going smoothly." },
    ],
    tasks: [], files: [],
  },
  {
    id: 'c7', caseNumber: 'C-009',
    name: 'Layla K.',
    status: 'paused',
    contacts: [
      { id: 'p1', name: 'Layla Khoury', phone: '(770) 555-9923', email: 'lkhoury@me.com' },
    ],
    careTeam: [
      { id: 'ct1', name: 'Sue Henderson', phone: '(404) 555-1492', email: 'suehenderson@gmail.com', role: "Women's ministry · helped connect Layla to support group" },
    ],
    opened: '2026-01-22', lastActivity: '2026-04-08T11:00:00',
    notes: [
      { id: 'n1', author: 'tm8', date: '2026-04-08T11:00:00', text: "Layla is doing better — new job at the library went permanent. She asked us to pause, said she wants to give back when she's able. Sweet conversation." },
    ],
    tasks: [], files: [],
  },
  {
    id: 'c8', caseNumber: 'C-012',
    name: 'Singh Family',
    status: 'active',
    contacts: [
      { id: 'p1', name: 'Arjun Singh', phone: '(404) 555-1245', email: 'arjun.singh.atl@gmail.com' },
      { id: 'p2', name: 'Priya Singh', phone: '(404) 555-1246', email: 'priyasingh82@gmail.com' },
    ],
    careTeam: [
      { id: 'ct1', name: 'Pastor Tom Reilly', phone: '(404) 555-9001', email: 'pastortom@faith-pca.org', role: 'Monthly pastoral check-ins' },
      { id: 'ct2', name: 'Vivek & Anjali Rao', phone: '(770) 555-2284', email: 'vivekrao.atl@gmail.com', role: 'Friends from India · driving Priya to appointments' },
    ],
    opened: '2026-04-30', lastActivity: '2026-05-19T09:00:00',
    notes: [
      { id: 'n1', author: 'tm4', date: '2026-05-19T09:00:00', text: "Visited at their home. Arjun was apologetic about asking — he's been a deacon at our sister church in Charlotte. Reassured him. Priya in good spirits, just tired. Surgery scheduled June 18." },
      { id: 'n2', author: 'tm2', date: '2026-05-02T13:00:00', text: "Confirmed insurance numbers with Priya. $3,200 out-of-pocket for gallbladder surgery, family has $1,000 saved. Hospital will accept payment directly from us." },
    ],
    tasks: [
      { id: 't1', text: 'Add to June 2 deacon agenda — $2,200', done: true, assignee: 'tm1' },
      { id: 't2', text: 'Confirm with hospital after deacon approval', done: false, assignee: 'tm2', due: '2026-06-03' },
    ],
    files: [{ id: 'f1', name: 'surgery-estimate.pdf', size: '156 KB' }],
  },
];

const fmt3 = {
  date: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  dateFull: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  dateTime: (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/,/g, '').replace(/ (\d?\d:\d\d)/, ' · $1'),
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
    return fmt3.date(iso);
  },
  initials: (name) => name.replace(/&|and/gi, '').split(/\s+/).filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase(),
  // Stable color from name string (used for non-deacon avatars in care team)
  colorFromName: (name) => {
    const palette = ['#0e7490','#4d7c0f','#a16207','#b45309','#7c3aed','#c026d3','#0891b2','#65a30d','#0d9488','#dc2626','#9333ea','#2563eb'];
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 9999;
    return palette[h % palette.length];
  },
  // Tap-to-call format: strip non-digits, prepend +1 if US-like
  telHref: (raw) => raw ? 'tel:' + raw.replace(/[^\d+]/g, '') : null,
};

// Active deacons recently involved on a case — derived from note authors.
function caseAuthors(c) {
  const seen = new Set();
  const ids = [];
  for (const n of c.notes) {
    if (!seen.has(n.author)) { seen.add(n.author); ids.push(n.author); }
    if (ids.length >= 3) break;
  }
  return ids;
}

// ─── AI helpers ─────────────────────────────────────────
// Summaries are generated on demand by the app, then stored (with a timestamp)
// so they stay STATIC until a note/task changes or someone hits refresh.
// These helpers do no caching — the app owns the cache + persistence.

const SUMMARY_LEN_NOTE = 'three sentences, roughly 45-60 words total';

async function genCaseSummary(c) {
  if (c.notes.length === 0) return null;
  const notesText = c.notes.slice().reverse()
    .map(n => {
      const a = TEAM.find(t => t.id === n.author) || { name: 'Unknown' };
      return `[${fmt3.dateFull(n.date)} · ${a.name}] ${n.text}`;
    }).join('\n\n');
  const prompt = `You are summarizing a benevolence case file for a church care team. Read these chronological notes and produce a brief status summary.

NOTES:
${notesText}

Write EXACTLY three sentences answering, in order: (1) What's going on? (2) What's the latest? (3) What's next? Keep every summary to a consistent length — ${SUMMARY_LEN_NOTE}. Be plain, warm, and specific. No greetings, no preamble. Don't start with "This case" or "The case" — just describe the situation.`;
  try {
    const result = await window.claude.complete(prompt);
    return result.trim();
  } catch (e) { return null; }
}

// Redacts an already-generated summary so the printed version is identical
// in substance to the case-page summary — just with identifying details stripped.
// Returns the exact substrings in a summary that identify the person/family,
// so the app can black them out while leaving every other word verbatim.
async function findRedactions(summary) {
  if (!summary) return [];
  const prompt = `From the church benevolence case summary below, list EVERY span of text that could identify the specific person(s) or family it's about — so it can be blacked out on a printout left on a table.

Include:
- People's names (first, last, or full — list each as it appears)
- Named providers (hospitals, clinics, utilities, employers, schools, churches, programs)
- Specific places, streets, or neighborhoods

Do NOT include: dollar amounts, dates, or generic phrases that don't identify anyone (e.g. "the family", "her job", "their child", "night shift").

Return a JSON array of the exact substrings to redact, copied VERBATIM from the summary (same case and spelling). Return [] if nothing needs redacting.

SUMMARY:
${summary}`;
  try {
    const result = await window.claude.complete(prompt);
    const cleaned = result.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const arr = JSON.parse(cleaned);
    return Array.isArray(arr) ? arr.filter(s => typeof s === 'string' && s.trim()) : [];
  } catch (e) { return []; }
}

// Splits text into segments, marking the spans that should be blacked out.
// Guarantees the visible (non-redacted) text is verbatim from the original.
function maskRedactions(text, phrases) {
  if (!text) return [];
  const list = [...new Set((phrases || []).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!list.length) return [{ t: text }];
  const esc = list.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(' + esc.join('|') + ')', 'g');
  const segments = [];
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ t: text.slice(last, m.index) });
    segments.push({ t: m[0], redact: true });
    last = m.index + m[0].length;
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  if (last < text.length) segments.push({ t: text.slice(last) });
  return segments;
}

// Signature of the content a summary depends on. Changes when a note or task
// is added / completed, which is what triggers a regeneration.
function caseSig(c) {
  return c.notes.length + '/' + c.tasks.length + '/' + c.tasks.filter(t => t.done).length;
}

// ─── Audit / event log ──────────────────────────────────
const EVENT_KINDS = {
  case_created:    { label: 'opened case',         icon: 'plus' },
  case_renamed:    { label: 'renamed case',        icon: 'pencil' },
  status_changed:  { label: 'changed status',      icon: 'flag' },
  contact_added:   { label: 'added a contact',     icon: 'user' },
  contact_edited:  { label: 'edited a contact',    icon: 'pencil' },
  contact_removed: { label: 'removed a contact',   icon: 'close' },
  careteam_added:  { label: 'added to care team',  icon: 'users' },
  careteam_edited: { label: 'edited care team contact', icon: 'pencil' },
  careteam_removed:{ label: 'removed from care team',icon: 'close' },
  note_added:      { label: 'added a note',        icon: 'note' },
  task_added:      { label: 'added a task',        icon: 'plus' },
  task_completed:  { label: 'completed a task',    icon: 'check' },
  task_reopened:   { label: 'reopened a task',     icon: 'refresh' },
  task_deleted:    { label: 'deleted a task',      icon: 'close' },
  file_uploaded:   { label: 'uploaded a file',     icon: 'upload' },
  file_deleted:    { label: 'deleted a file',      icon: 'close' },
  signed_in:       { label: 'signed in',           icon: 'lock' },
  deacon_invited:  { label: 'added a deacon',      icon: 'users' },
  deacon_removed:  { label: 'removed a deacon',    icon: 'users' },
  deacon_edited:   { label: 'updated a deacon\'s contact info', icon: 'pencil' },
  team_leader_changed: { label: 'changed team leader', icon: 'shield' },
  shared_to_groupme:   { label: 'shared to GroupMe', icon: 'chat' },
  summary_generated:   { label: 'regenerated the summary', icon: 'sparkle' },
};

function eventDetailText(e) {
  const d = e.detail || {};
  switch (e.kind) {
    case 'case_created':     return d.name || '';
    case 'case_renamed':     return `"${d.from}" → "${d.to}"`;
    case 'status_changed':   return `${STATUSES[d.from]?.label || d.from} → ${STATUSES[d.to]?.label || d.to}`;
    case 'contact_added':
    case 'contact_edited':
    case 'contact_removed':
    case 'careteam_added':
    case 'careteam_edited':
    case 'careteam_removed': return d.name || '';
    case 'note_added':       return d.preview ? '“' + d.preview + (d.preview.length >= 80 ? '…' : '') + '”' : '';
    case 'task_added':
    case 'task_completed':
    case 'task_reopened':
    case 'task_deleted':     return d.text ? '“' + d.text + '”' : '';
    case 'file_uploaded':
    case 'file_deleted':     return d.name || '';
    case 'deacon_invited':   return `${d.name} <${d.email}>`;
    case 'deacon_removed':   return d.name || '';
    case 'deacon_edited':    return d.name || '';
    case 'team_leader_changed': return d.from ? `${d.from} → ${d.to}` : d.to;
    case 'shared_to_groupme':   return d.caseNumber ? `${d.caseNumber} · ${d.caseName}` : '';
    case 'summary_generated':   return d.manual ? 'manual refresh' : 'after a note or task update';
    default: return '';
  }
}

function seedEvents() {
  const events = [];
  CASES.forEach(c => {
    const opener = c.notes.length ? c.notes[c.notes.length - 1].author : 'tm1';
    events.push({
      id: 'e_open_' + c.id, caseId: c.id,
      at: c.opened + 'T09:00:00',
      who: opener, kind: 'case_created',
      detail: { name: c.name },
    });
    c.contacts.forEach((p, i) => events.push({
      id: 'e_contact_' + c.id + '_' + p.id, caseId: c.id,
      at: c.opened + 'T09:0' + (1 + i) + ':00',
      who: opener, kind: 'contact_added',
      detail: { name: p.name },
    }));
    c.careTeam.forEach((p, i) => events.push({
      id: 'e_ct_' + c.id + '_' + p.id, caseId: c.id,
      at: c.opened + 'T09:1' + i + ':00',
      who: opener, kind: 'careteam_added',
      detail: { name: p.name },
    }));
    c.files.forEach(f => events.push({
      id: 'e_file_' + f.id, caseId: c.id,
      at: c.opened + 'T11:00:00',
      who: opener, kind: 'file_uploaded',
      detail: { name: f.name },
    }));
    c.tasks.forEach((t, i) => {
      events.push({
        id: 'e_task_add_' + t.id, caseId: c.id,
        at: c.opened + 'T1' + (2 + i) + ':00:00',
        who: t.assignee || opener, kind: 'task_added',
        detail: { text: t.text },
      });
      if (t.done) events.push({
        id: 'e_task_done_' + t.id, caseId: c.id,
        at: c.lastActivity,
        who: t.assignee || opener, kind: 'task_completed',
        detail: { text: t.text },
      });
    });
    c.notes.slice().reverse().forEach(n => events.push({
      id: 'e_note_' + n.id, caseId: c.id,
      at: n.date, who: n.author, kind: 'note_added',
      detail: { preview: n.text.slice(0, 80) },
    }));
  });
  return events.sort((a,b) => new Date(b.at) - new Date(a.at));
}

Object.assign(window, {
  TEAM, ME_ID, GROUPME_URL, STATUSES, CASES, fmt3, caseAuthors,
  genCaseSummary, findRedactions, maskRedactions, caseSig,
  EVENT_KINDS, eventDetailText, seedEvents,
});
