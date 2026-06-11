// v3 — Single role: Deacon. Care Team + Contacts are structured per case.
// Each contact: { id, name, phone?, email?, role? }

// Deacons (system users): name, email, phone, color
// One deacon is flagged isLeader: true at a time.
const TEAM = [
  { id: 'tm10', name: 'Hunter Shepherd', initials: 'HS', email: 'hunter@kennion.com',
    phone: '', color: '#0f766e', addedBy: 'system', addedAt: '2026-06-01',
    isLeader: true, lastLogin: null },
];
const ME_ID = 'tm10';

// Faith PCA Internal Benevolence team private GroupMe chat
// Deep-link to the chat for existing members (vs join_group, which is for invites).
const GROUPME_URL = 'https://app.groupme.com/chats/group/108829787';

const STATUSES = {
  active: { label: 'Active', color: '#059669' },
  paused: { label: 'Paused', color: '#a16207' },
  closed: { label: 'Closed', color: '#71717a' },
};

const CASES = [];

const fmt3 = {
  date: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  dateFull: (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  dateTime: (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/,/g, '').replace(/ (\d?\d:\d\d)/, ' · $1'),
  dateShort: (iso) => {
    const d = new Date(iso);
    return String(d.getMonth() + 1).padStart(2, '0') + '/' +
           String(d.getDate()).padStart(2, '0') + '/' +
           String(d.getFullYear()).slice(-2);
  },
  relative: (iso) => {
    const now = new Date();
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

// Effective last-activity date — max of all note dates vs stored lastActivity field.
// Ensures adding a note always moves the case to the top, even if lastActivity drifts.
function caseLastActivity(c) {
  let best = c.lastActivity || c.opened || '';
  (c.notes || []).forEach(n => { if ((n.date || '') > best) best = n.date; });
  return best;
}

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
    .map(n => `[${fmt3.dateFull(n.date)}] ${n.text}`)
    .join('\n\n');
  const prompt = `You are writing a short status summary of a church benevolence record for the care team. Use ONLY the notes provided below — nothing else.

STRICT RULES:
- Base every statement strictly on the notes below. If the notes don't say it, don't write it.
- Do not guess, infer beyond what is written, or add any outside facts or assumptions.
- Do not use outside knowledge about any person, place, employer, or organization.
- Do not mention deacons, staff, or care-team members by name, or reference who wrote the notes.

NOTES:
${notesText}

Write a clean, plain-language summary of EXACTLY three sentences: (1) the person/family's situation, (2) the most recent development, (3) the current next step or open question. Roughly ${SUMMARY_LEN_NOTE}. No greetings or preamble; don't begin with "This case" or "The case" — just describe the situation.`;
  try {
    const resp = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: 'claude-sonnet-4-6' }),
    });
    if (!resp.ok) return null;
    const { result } = await resp.json();
    return result ? result.trim() : null;
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
    const resp = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!resp.ok) return [];
    const { result } = await resp.json();
    if (!result) return [];
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

// Signature of the content a summary depends on. Changes when a note is
// added/edited/removed, a task is added/completed, or the status changes —
// which is what triggers an automatic regeneration so summaries stay current.
function caseSig(c) {
  const notesPart = (c.notes || []).map(n => (n.date || '') + ':' + (n.text || '').length).join('|');
  return [c.status, (c.notes || []).length, (c.tasks || []).length,
          (c.tasks || []).filter(t => t.done).length, notesPart].join('/');
}

// ─── Audit / event log ──────────────────────────────────
const EVENT_KINDS = {
  case_created:    { label: 'opened opportunity',  icon: 'plus' },
  case_renamed:    { label: 'renamed opportunity', icon: 'pencil' },
  status_changed:  { label: 'changed status',      icon: 'flag' },
  contact_added:   { label: 'added a contact',     icon: 'user' },
  contact_edited:  { label: 'edited a contact',    icon: 'pencil' },
  contact_removed: { label: 'removed a contact',   icon: 'close' },
  careteam_added:  { label: 'added to care team',  icon: 'users' },
  careteam_edited: { label: 'edited care team contact', icon: 'pencil' },
  careteam_removed:{ label: 'removed from care team',icon: 'close' },
  note_added:      { label: 'added a note',        icon: 'note' },
  note_edited:     { label: 'edited a note',        icon: 'pencil' },
  assignees_changed: { label: 'changed assigned deacons', icon: 'users' },
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
  groupme_synced:        { label: 'synced from GroupMe', icon: 'download' },
  sync_note_imported:    { label: 'imported a note from GroupMe', icon: 'download' },
  sync_opportunity_created: { label: 'created an opportunity from GroupMe', icon: 'download' },
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
    case 'note_added':       return d.preview ? '"' + d.preview + (d.preview.length >= 80 ? '…' : '') + '"' : '';
    case 'note_edited':      return d.preview ? '"' + d.preview + (d.preview.length >= 80 ? '…' : '') + '"' : '';
    case 'assignees_changed': return (d.ids || []).map(id => (typeof window !== 'undefined' && window.MEMBERS_BY_ID && window.MEMBERS_BY_ID[id] && window.MEMBERS_BY_ID[id].name) || id).join(', ') || 'cleared';
    case 'task_added':
    case 'task_completed':
    case 'task_reopened':
    case 'task_deleted':     return d.text ? '"' + d.text + '"' : '';
    case 'file_uploaded':
    case 'file_deleted':     return d.name || '';
    case 'deacon_invited':   return `${d.name} <${d.email}>`;
    case 'deacon_removed':   return d.name || '';
    case 'deacon_edited':    return d.name || '';
    case 'team_leader_changed': return d.from ? `${d.from} → ${d.to}` : d.to;
    case 'shared_to_groupme':   return d.caseNumber ? `${d.caseNumber} · ${d.caseName}` : '';
    case 'groupme_synced':      return `${d.added || 0} note(s), ${d.created || 0} new · ${d.dismissed || 0} dismissed`;
    case 'sync_note_imported':  return d.preview ? '"' + d.preview + (d.preview.length >= 80 ? '…' : '') + '"' : '';
    case 'sync_opportunity_created': return d.name || '';
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

// ─── GroupMe export parsing (for the admin Sync screen) ──────────────────
// Returns [{ ts: ISO, sender, text }]. Skips GroupMe system lines.
const GM_SYSTEM_RE = /(has joined the group|has left the group|removed .* from the group|added .* to the group|gave group ownership|A message was deleted|This message was deleted|edited to:|Created new poll|Poll '.*' (is about to expire|has expired))/i;

function gmToISO(raw) {
  // "2026-05-28 18:00:12 UTC" → ISO
  const m = String(raw).trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) { const d = new Date(raw); return isNaN(d) ? null : d.toISOString(); }
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.000Z`;
}

function gmKeep(sender, text) {
  if (!sender || sender === 'GroupMe') return false;
  if (!text || !text.trim()) return false;
  if (GM_SYSTEM_RE.test(text)) return false;
  // Drop bare approvals / very short acks — no information to log.
  if (/^(approved?|approve both|agree|will do|thanks?|same|done|👍)\b[.! ]*$/i.test(text.trim())) return false;
  return true;
}

// Plain-text export: lines like "[YYYY-MM-DD HH:MM:SS UTC] Sender: Text",
// with multi-line message bodies continuing until the next bracketed timestamp.
function parseGroupMeText(content) {
  const lines = String(content).split(/\r?\n/);
  const head = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) UTC\]\s*([^:]+?):\s?([\s\S]*)$/;
  const out = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(head);
    if (m) {
      if (cur) out.push(cur);
      cur = { ts: gmToISO(m[1]), sender: m[2].trim(), text: m[3] };
    } else if (cur) {
      cur.text += '\n' + line; // continuation of a multi-line message
    }
  }
  if (cur) out.push(cur);
  return out
    .map(x => ({ ts: x.ts, sender: x.sender, text: (x.text || '').trim() }))
    .filter(x => x.ts && gmKeep(x.sender, x.text));
}

// GroupMe data-export JSON (message.json / conversation.json): an array of
// message objects { created_at (unix seconds), name, text, system, ... }, or an
// object with a .messages array.
function parseGroupMeJson(content) {
  let arr;
  try { arr = JSON.parse(content); } catch (e) { return []; }
  if (!Array.isArray(arr)) arr = (arr && Array.isArray(arr.messages)) ? arr.messages : [];
  return arr
    .map(m => ({
      ts: m.created_at ? new Date(Number(m.created_at) * 1000).toISOString() : (m.ts || null),
      sender: (m.name || m.sender || (m.system ? 'GroupMe' : '')).toString().trim(),
      text: (m.text || '').toString().trim(),
    }))
    .filter(x => x.ts && gmKeep(x.sender, x.text));
}

// .xlsx export with columns: UTC Time | Sender | Text. Needs global XLSX (SheetJS).
function parseGroupMeXlsx(arrayBuffer) {
  if (typeof XLSX === 'undefined') throw new Error('Spreadsheet support not loaded');
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  return rows
    .map(r => ({
      ts: gmToISO(r['UTC Time'] || r['UTC time'] || r['Time'] || r['Date']),
      sender: String(r['Sender'] || r['sender'] || '').trim(),
      text: String(r['Text'] || r['text'] || r['Message'] || '').trim(),
    }))
    .filter(x => x.ts && gmKeep(x.sender, x.text));
}

// Latest note/opened date across all opportunities — default sync cutoff so
// already-recorded history is never re-proposed.
function latestKnownTs(cases) {
  let max = 0;
  (cases || []).forEach(c => {
    [c.opened, c.lastActivity].forEach(d => { const t = +new Date(d); if (t) max = Math.max(max, t); });
    (c.notes || []).forEach(n => { const t = +new Date(n.date); if (t) max = Math.max(max, t); });
  });
  return max ? new Date(max).toISOString() : '1970-01-01T00:00:00.000Z';
}

// Compact opportunity list sent to the AI so it can match messages by name/context.
function compactOpportunities(cases) {
  return (cases || []).map(c => ({
    caseNumber: c.caseNumber,
    name: c.name,
    status: c.status,
    lastNoteDate: (c.notes && c.notes[0]) ? fmt3.dateFull(c.notes[0].date) : '',
    // Condensed recorded history so the AI can tell what's ALREADY logged and
    // avoid re-proposing it (capped to keep the prompt reasonable).
    recorded: (c.notes || [])
      .map(n => `(${fmt3.dateFull(n.date)}) ${n.text}`)
      .join(' • ')
      .slice(0, 5000),
  }));
}

Object.assign(window, {
  TEAM, ME_ID, GROUPME_URL, STATUSES, CASES, fmt3, caseAuthors, caseLastActivity,
  genCaseSummary, findRedactions, maskRedactions, caseSig,
  EVENT_KINDS, eventDetailText, seedEvents,
  parseGroupMeText, parseGroupMeXlsx, parseGroupMeJson, latestKnownTs, compactOpportunities,
});
