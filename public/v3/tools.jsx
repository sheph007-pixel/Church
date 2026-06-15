// v3 tools — Report, Activity, Members admin, Print preview (AI-redacted)

// ─── Monthly report ─────────────────────────────────────
function ReportView3({ cases, me, onSelect, onPrint }) {
  const active = cases.filter(c => c.status === 'active');
  const paused = cases.filter(c => c.status === 'paused');
  const closedThisMonth = cases.filter(c => c.status === 'closed' && c.lastActivity.startsWith('2026-04'));
  const newThisMonth = cases.filter(c => c.opened.startsWith('2026-05'));

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Monthly Report</h1>
          <div className="page-sub">For deacon meeting · Jun 2, 2026</div>
        </div>
        <Btn3 variant="primary" icon="print" onClick={onPrint}>Open Print Preview</Btn3>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Active</div>
          <div className="stat-val">{active.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">New This Month</div>
          <div className="stat-val">{newThisMonth.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Paused</div>
          <div className="stat-val">{paused.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Closed Recently</div>
          <div className="stat-val">{closedThisMonth.length}</div>
        </div>
      </div>

      <h2 className="section-h">Active Opportunities</h2>
      <div className="rows">
        {active.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)} className="row">
            <div className="row-left"><div className="row-num">{c.caseNumber}</div></div>
            <div className="row-mid">
              <div className="row-title">{c.name} <StatusPill3 status={c.status} /></div>
              <div className="row-preview">{c.notes[0]?.text || 'No notes yet'}</div>
            </div>
            <div className="row-meta"><AvStack3 ids={caseAuthors(c)} size={20} /></div>
            <div className="row-time">{fmt3.relative(c.lastActivity)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Renders summary text with identifying spans blacked out — exact wording
// preserved, only the sensitive substrings replaced by redaction boxes.
function RedactedSummary({ text, redactions }) {
  const segs = maskRedactions(text, redactions);
  return (
    <>
      {segs.map((s, i) => s.redact
        ? <span key={i} className="redact-box"
                style={{ width: Math.min(150, Math.max(22, s.t.length * 7)) + 'px' }}
                aria-label="redacted" />
        : <React.Fragment key={i}>{s.t}</React.Fragment>)}
    </>
  );
}

// ─── Monthly report — redacted print preview ─────────────
// Same summary shown on each case page, with names/identifying details
// stripped. On screen you can Reveal real names; printing is ALWAYS redacted
// (enforced by print-only CSS), so a printout left on a table is safe.
function PrintPreview3({ cases, summaries, onEnsureSummary }) {
  const [reveal, setReveal] = React.useState(false);
  const active = cases.filter(c => c.status === 'active');

  // Ensure every active opportunity has a stored summary (generates any that are
  // missing/stale). Uses the SAME shared summaries shown on each opportunity page.
  React.useEffect(() => {
    active.forEach(c => onEnsureSummary && onEnsureSummary(c));
  }, [cases]);

  const Bar = ({ w = 56 }) => (
    <span className="name-bar" style={{
      display: 'inline-block', verticalAlign: '-2px', height: 11, width: w,
      background: '#0f2447', borderRadius: 2, margin: '0 1px',
      WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
    }} />
  );

  return (
    <div className="tool-view print-wrap">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Monthly Report</h1>
          <div className="page-sub">For the deacon meeting · printout is always redacted — safe to leave on a table</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn3 variant="secondary" icon={reveal ? 'eyeOff' : 'eye'} onClick={() => setReveal(v => !v)}>
            {reveal ? 'Hide Names' : 'Reveal (Screen Only)'}
          </Btn3>
          <Btn3 variant="primary" icon="print" onClick={() => window.print()}>Print</Btn3>
        </div>
      </div>

      <div className={'paper' + (reveal ? ' paper-reveal' : '')}>
        <header className="paper-head">
          <div className="paper-brand">
            <div>
              <div className="paper-org">Internal Benevolence Report</div>
              <div className="paper-sub">Confidential</div>
            </div>
          </div>
          <div className="paper-meta">
            <div>Date prepared: {fmt3.dateFull(new Date().toISOString())}</div>
          </div>
        </header>

        <p className="paper-lead">
          <strong>{active.length} active opportunities.</strong> A redacted summary of each follows below.
        </p>

        <section>
          <h3 className="paper-h">Active Opportunities</h3>
          {active.map((c) => {
            const entry = (summaries && summaries[c.id]) || {};
            const loading = entry.loading && entry.text == null;
            return (
              <div key={c.id} className="paper-item">
                <div className="paper-item-head">
                  <span className="paper-case-num">{c.caseNumber}</span>
                </div>
                <div className="paper-item-line">
                  <strong>Opportunity:</strong>{' '}
                  <span className="reveal-only">{c.name}</span>
                  <span className="redact-only"><Bar w={Math.min(140, 50 + c.name.length * 6)} /></span>
                </div>
                <div className="paper-item-line paper-summary">
                  <strong>Summary:</strong>{' '}
                  {loading
                    ? <em className="paper-loading">Helper is summarizing and redacting…</em>
                    : entry.text
                      ? <>
                          <span className="reveal-only">{entry.text}</span>
                          <span className="redact-only"><RedactedSummary text={entry.text} redactions={entry.redactions} /></span>
                        </>
                      : 'No notes yet.'}
                </div>
              </div>
            );
          })}
          <div className="paper-foot">End of report · {active.length} active opportunities · this printout is redacted and safe to leave on a table.</div>
        </section>
      </div>
    </div>
  );
}

// ─── Activity log ────────────────────────────────────────
function ActivityView3({ events, cases, team, onSelectCase }) {
  const [filterWho, setFilterWho] = React.useState('all');
  const [filterKind, setFilterKind] = React.useState('all');

  let filtered = events;
  if (filterWho !== 'all') filtered = filtered.filter(e => e.who === filterWho);
  if (filterKind !== 'all') {
    if (filterKind === 'notes')   filtered = filtered.filter(e => e.kind === 'note_added');
    else if (filterKind === 'tasks')   filtered = filtered.filter(e => e.kind.startsWith('task_'));
    else if (filterKind === 'files')   filtered = filtered.filter(e => e.kind.startsWith('file_'));
    else if (filterKind === 'access')  filtered = filtered.filter(e => e.kind === 'signed_in' || e.kind.startsWith('member_'));
    else if (filterKind === 'changes') filtered = filtered.filter(e => ['case_renamed','status_changed','care_team_added','care_team_removed','care_notes_edited','case_created'].includes(e.kind));
  }

  // Group by date
  const byDate = filtered.reduce((acc, e) => {
    const d = e.at.slice(0, 10);
    (acc[d] = acc[d] || []).push(e);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <div className="page-sub">Every action by every person — timestamped. Paper trail for the whole team.</div>
        </div>
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <div className="filter-group">
          <label>Who</label>
          <select value={filterWho} onChange={e => setFilterWho(e.target.value)}>
            <option value="all">Everyone</option>
            {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>What</label>
          <select value={filterKind} onChange={e => setFilterKind(e.target.value)}>
            <option value="all">All Actions</option>
            <option value="notes">Notes</option>
            <option value="tasks">Tasks</option>
            <option value="files">Files</option>
            <option value="changes">Opportunity Changes</option>
            <option value="access">Access & Members</option>
          </select>
        </div>
        <div className="filter-count">{filtered.length} of {events.length} events</div>
      </div>

      {dates.length === 0 && (
        <div className="empty">
          <Icon name="history" size={22} stroke={1.5} />
          <div className="empty-title">No Events Match</div>
          <div className="empty-body">Try a different filter.</div>
        </div>
      )}

      {dates.map(d => (
        <div key={d} className="activity-day">
          <div className="section-label">{fmt3.dateFull(d + 'T00:00:00')}</div>
          <ul className="activity-list">
            {byDate[d].map(e => {
              const who = team.find(t => t.id === e.who) || { name: 'Admin', initials: 'AD', color: '#64748b' };
              const kind = EVENT_KINDS[e.kind] || { label: e.kind, icon: 'note' };
              const c = e.caseId ? cases.find(c => c.id === e.caseId) : null;
              const detail = eventDetailText(e);
              return (
                <li key={e.id} className="activity-row">
                  <Av3 id={e.who} size={26} />
                  <div className="activity-body">
                    <div className="activity-line">
                      <strong>{who.name}</strong>{' '}
                      <span className="muted">{kind.label}</span>
                      {c && (
                        <> {' '}<span className="muted">on</span>{' '}
                          <button className="link-case" onClick={() => onSelectCase(c.id)}>
                            <span className="mono">{c.caseNumber}</span> <span className="muted">· {c.name}</span>
                          </button>
                        </>
                      )}
                    </div>
                    {detail && <div className="activity-text">{detail}</div>}
                  </div>
                  <div className="activity-time">
                    {new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ─── Deacons (only the Team Leader can add / remove) ─────
function MembersView({ team, me, onAddMember, onUpdateMember, onRemoveMember, onSetLeader }) {
  const [adding, setAdding] = React.useState(false);
  const isLeader = !!me.isLeader;

  // sort leader first, then alpha
  const byName = (a, b) => {
    if (a.isLeader && !b.isLeader) return -1;
    if (b.isLeader && !a.isLeader) return 1;
    return a.name.localeCompare(b.name);
  };
  const active = team.filter(m => !m.inactive).sort(byName);
  const past = team.filter(m => m.inactive).sort(byName);

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Deacons</h1>
          <div className="page-sub">
            {active.length} deacons · one designated Team Leader.{past.length ? ` ${past.length} past deacons kept for history.` : ''}{' '}
            {isLeader
              ? 'As leader, you can add or remove deacons and reassign the lead.'
              : 'Only the Team Leader can add or remove deacons.'}
          </div>
        </div>
        {isLeader && <Btn3 variant="primary" icon="plus" onClick={() => setAdding(true)}>Add Deacon</Btn3>}
      </div>

      <div className="members-list">
        {active.map(m => (
          <MemberRow key={m.id} m={m} me={me} isLeader={isLeader}
            onUpdate={onUpdateMember} onRemove={onRemoveMember}
            onSetLeader={onSetLeader} />
        ))}
      </div>

      {past.length > 0 && (
        <>
          <div className="page-sub" style={{ margin: '22px 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 11, opacity: .7 }}>
            Past deacons
          </div>
          <div className="members-list">
            {past.map(m => (
              <MemberRow key={m.id} m={m} me={me} isLeader={isLeader}
                onUpdate={onUpdateMember} onRemove={onRemoveMember}
                onSetLeader={onSetLeader} />
            ))}
          </div>
        </>
      )}

      {adding && (
        <AddDeaconModal onClose={() => setAdding(false)} onAdd={(payload) => { onAddMember(payload); setAdding(false); }} />
      )}
    </div>
  );
}

function MemberRow({ m, me, isLeader, onUpdate, onRemove, onSetLeader }) {
  const inviter = TEAM.find(t => t.id === m.addedBy);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(m);
  React.useEffect(() => { setDraft(m); }, [m.id, m.name, m.email, m.phone]);

  // Who may edit this row's contact info: the leader (anyone) or a deacon editing their own row.
  // Past (inactive) deacons are read-only — kept only so their historical notes attribute correctly.
  const canEdit = !m.inactive && (isLeader || m.id === me.id);

  if (editing) {
    return (
      <div className="member-row member-row-edit">
        <Av3 id={m.id} size={36} />
        <div className="member-edit-grid">
          <input value={draft.name}  onChange={e => setDraft({...draft, name: e.target.value})}  placeholder="Name" />
          <input value={draft.phone || ''} onChange={e => setDraft({...draft, phone: e.target.value})} placeholder="Phone" inputMode="tel" />
          <input value={draft.email || ''} onChange={e => setDraft({...draft, email: e.target.value})} placeholder="Email" type="email" />
        </div>
        <div className="member-actions">
          <button className="link-btn" onClick={() => { setDraft(m); setEditing(false); }}>Cancel</button>
          <Btn3 variant="primary" size="sm" disabled={!draft.name?.trim()}
                onClick={() => { onUpdate(m.id, { name: draft.name, phone: draft.phone, email: draft.email }); setEditing(false); }}>
            Save
          </Btn3>
        </div>
      </div>
    );
  }

  return (
    <div className="member-row" style={m.inactive ? { opacity: .55 } : undefined}>
      <Av3 id={m.id} size={36} />
      <div className="member-col">
        <div className="member-name">
          {m.name}{m.id === me.id && <span className="member-you"> (you)</span>}
          {m.isLeader && <span className="leader-tag"><Icon name="shield" size={10} stroke={2} /> Team Leader</span>}
          {m.inactive && <span className="member-you"> · Past deacon</span>}
        </div>
        <div className="member-contact">
          {m.phone && <a href={fmt3.telHref(m.phone)} className="contact-link"><Icon name="phone" size={11} stroke={1.9} /> {m.phone}</a>}
          {m.email && <a href={'mailto:' + m.email} className="contact-link"><Icon name="chat" size={11} stroke={1.9} /> {m.email}</a>}
        </div>
      </div>
      <div className="member-meta">
        <span className="member-lastlogin">
          {m.inactive
            ? <span className="member-never">Rolled off</span>
            : m.lastLogin
              ? <>Last login {fmt3.dateTime(m.lastLogin)}</>
              : <span className="member-never">Never signed in</span>}
        </span>
        <span className="member-since">
          Added {fmt3.dateFull(m.addedAt + 'T00:00:00')}{inviter && ` by ${inviter.name.split(' ')[0]}`}
        </span>
      </div>
      <div className="member-actions">
        {isLeader && !m.isLeader && !m.inactive && (
          <button className="link-btn" onClick={() => {
            if (confirm(`Make ${m.name} the Team Leader? You'll be demoted to deacon and lose the ability to add or remove deacons.`)) onSetLeader(m.id);
          }} title="Make Team Leader">
            Make Leader
          </button>
        )}
        {canEdit && (
          <button className="icon-btn" onClick={() => setEditing(true)} title="Edit contact info">
            <Icon name="pencil" size={13} stroke={1.7} />
          </button>
        )}
        {isLeader && m.id !== me.id && !m.isLeader && !m.inactive && (
          <button className="icon-btn member-remove" onClick={() => {
            if (confirm(`Remove ${m.name}? They'll lose access. Their past notes stay.`)) onRemove(m.id);
          }} title="Remove">
            <Icon name="close" size={14} stroke={1.8} />
          </button>
        )}
      </div>
    </div>
  );
}

function AddDeaconModal({ onClose, onAdd }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const valid = name.trim() && email.includes('@');

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Add Deacon</h2>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" size={18} stroke={1.8} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-intro">
            Add their email to the team. They'll sign in with that email and the shared team code — no invite needed.
          </p>
          <div className="form-row">
            <label>Full Name</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="jane@example.com" />
            <div className="form-hint">This is what they'll sign in with — and what tracks their notes and tasks to them.</div>
          </div>
          <div className="form-row">
            <label>Phone <span className="optional">(optional)</span></label>
            <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" placeholder="(404) 555-0000" />
            <div className="form-hint">So other deacons can call them about an opportunity.</div>
          </div>
        </div>
        <div className="modal-foot">
          <Btn3 variant="ghost" onClick={onClose}>Cancel</Btn3>
          <Btn3 variant="primary" disabled={!valid}
                onClick={() => onAdd({ name: name.trim(), email: email.trim(), phone: phone.trim() })}>
            Add Deacon
          </Btn3>
        </div>
      </div>
    </div>
  );
}

// ─── GroupMe Sync (admin only) ──────────────────────────
// Upload a GroupMe export; AI proposes additive suggestions (new notes on
// existing opportunities + brand-new opportunities). Nothing is written until
// the leader clicks Accept. Re-uploads are deduped by a moving timestamp cutoff.
function SyncView3({ me, cases, sync, onAcceptNote, onAcceptOpportunity, onRecordSync }) {
  const [phase, setPhase] = React.useState('idle'); // idle | analyzing | review | error | done
  const [fileName, setFileName] = React.useState('');
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState({ noteSuggestions: [], newOpportunities: [] });
  const [decisions, setDecisions] = React.useState({}); // key -> 'accepted' | 'dismissed' | 'error'
  const [routes, setRoutes] = React.useState({});       // 'n<i>' -> chosen caseNumber (override the AI's match)
  const [maxTs, setMaxTs] = React.useState(null);
  const [cutoff, setCutoff] = React.useState(null);
  const [newCount, setNewCount] = React.useState(0);
  const [summary, setSummary] = React.useState(null);
  const [lookbackDays, setLookbackDays] = React.useState(60); // analysis window (0 = entire export)

  const byNum = {};
  cases.forEach(c => { byNum[c.caseNumber] = c; });

  // Relevance pre-filter: a message matters if it mentions a dollar amount OR a
  // known person (an opportunity/contact name). We send ONLY these to the AI so a
  // money/name message can't be missed in the noise — the AI just matches + dedupes.
  const GENERIC = new Set(['confidential', 'family', 'couple', 'medical', 'counseling', 'the', 'and', 'jr', 'sr']);
  const nameTokens = (() => {
    const set = new Set();
    const add = (s) => (s || '').split(/[^A-Za-z]+/).forEach(w => {
      const lw = w.toLowerCase();
      if (w.length >= 3 && !GENERIC.has(lw)) set.add(lw);
    });
    cases.forEach(c => { add(c.name); (c.contacts || []).forEach(p => add(p.name)); });
    return [...set];
  })();
  const nameRe = nameTokens.length
    ? new RegExp('\\b(' + nameTokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i')
    : null;
  const isRelevant = (m) => /\$\s?\d/.test(m.text || '') || (nameRe && nameRe.test(m.text || ''));

  // Deterministic safety net. Per opportunity: drop a note whose amounts are all
  // already recorded on THAT case. For a proposed "new opportunity", fuzzy-match it
  // to existing cases — if it's really an existing person, convert it into a note on
  // that case (so a mis-classified update isn't lost), dropping it only if already
  // recorded; otherwise keep it as genuinely new.
  const normAmts = (t) => (String(t).match(/\$\s?[\d,]+(?:\.\d{1,2})?/g) || [])
    .map(a => a.replace(/[^0-9.]/g, '').replace(/\.0+$/, '').replace(/\.$/, ''));
  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const toks = (s) => new Set(norm(s).split(' ').filter(w => w.length >= 3 && !['the', 'and'].includes(w)));
  const matchCase = (name) => {
    const n = norm(name); if (!n) return null;
    const nt = toks(name); let best = null, score = 0;
    for (const c of cases) {
      const cn = norm(c.name);
      if (cn && (cn === n || cn.includes(n) || n.includes(cn))) return c;
      const ct = toks(c.name);
      const inter = [...nt].filter(x => ct.has(x)).length;
      const uni = new Set([...nt, ...ct]).size;
      const j = uni ? inter / uni : 0;
      if (j > score) { score = j; best = c; }
    }
    return score >= 0.5 ? best : null;
  };
  const recordedFor = (c) => new Set((c.notes || []).flatMap(n => normAmts(n.text)));
  const alreadyRecorded = (c, text) => { const a = normAmts(text); const r = recordedFor(c); return a.length > 0 && a.every(x => r.has(x)); };
  // Catch a dup even when the AI routed it to the WRONG case: if some case already
  // has all these amounts AND that case's name words appear in the text, it's logged.
  const recordedElsewhere = (text) => {
    const a = normAmts(text); if (!a.length) return false;
    const tt = toks(text);
    return cases.some(c => {
      const r = recordedFor(c);
      if (!a.every(x => r.has(x))) return false;
      return [...toks(c.name)].some(t => tt.has(t));
    });
  };
  const dedupe = (sugg) => {
    const noteSuggestions = (sugg.noteSuggestions || []).filter(s => {
      const opp = byNum[s.caseNumber];
      if (!opp) return false;                                   // unknown opportunity
      const blob = (s.text || '') + ' ' + (s.source || '');
      if (alreadyRecorded(opp, s.text)) return false;           // already on this case
      if (recordedElsewhere(blob)) return false;                // already logged on another case (mis-routed dup)
      return true;
    });
    const newOpportunities = [];
    (sugg.newOpportunities || []).forEach(s => {
      const m = matchCase(s.name);
      const blob = (s.firstNote || '') + ' ' + (s.source || '');
      if (m) {
        // Really about an existing case → turn into a note (unless already recorded).
        if (!alreadyRecorded(m, s.firstNote || '') && !recordedElsewhere(blob)) {
          noteSuggestions.push({ caseNumber: m.caseNumber, by: s.by, date: s.date, text: s.firstNote, source: s.source });
        }
        return;
      }
      if ((s.name || '').trim() && !recordedElsewhere(blob)) newOpportunities.push(s);
    });
    return { noteSuggestions, newOpportunities };
  };

  // Parse one file by type → [{ts,sender,text}]. Unknown/media files yield [].
  const readOne = async (file) => {
    const n = (file.name || '').toLowerCase();
    try {
      if (/\.xlsx?$/.test(n)) return parseGroupMeXlsx(await file.arrayBuffer());
      if (/\.json$/.test(n)) return parseGroupMeJson(await file.text());
      if (/\.(txt|csv)$/.test(n)) return parseGroupMeText(await file.text());
    } catch (e) { return []; }
    return []; // images / other files in the export folder are ignored
  };

  // Accept a single file OR a whole folder (GroupMe export). Merge + dedupe.
  const collectMessages = async (fileList) => {
    const files = Array.from(fileList || []);
    const all = [];
    for (const f of files) all.push(...await readOne(f));
    const seen = new Set();
    const merged = [];
    for (const m of all) {
      const k = m.ts + '|' + m.sender + '|' + m.text;
      if (!seen.has(k)) { seen.add(k); merged.push(m); }
    }
    return merged.sort((a, b) => new Date(a.ts) - new Date(b.ts));
  };

  // Merge a deacon's consecutive messages (within 30 min) into one block, so the
  // person's name and the dollar amount stay together for accurate matching.
  const groupConsecutive = (msgs) => {
    const out = [];
    for (const m of msgs) {
      const prev = out[out.length - 1];
      if (prev && prev.sender === m.sender && (new Date(m.ts) - new Date(prev._last)) <= 30 * 60000) {
        prev.text += '\n' + m.text; prev._last = m.ts;
      } else {
        out.push({ ts: m.ts, sender: m.sender, text: m.text, _last: m.ts });
      }
    }
    return out.map(({ _last, ...b }) => b);
  };

  const onPick = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const label = files.length === 1 ? files[0].name
      : (files[0].webkitRelativePath ? files[0].webkitRelativePath.split('/')[0] + '/' : `${files.length} files`);
    setFileName(label); setError(''); setDecisions({}); setSummary(null); setPhase('analyzing');
    try {
      const parsed = await collectMessages(files);
      if (parsed.length === 0) {
        setError('No GroupMe messages found in that selection. Upload the export folder (or its message.json / .txt / .xlsx).');
        setPhase('error'); return;
      }
      // Analysis window: the last N days of the chat (anchored to the export's
      // most recent message), or everything when N = 0.
      const maxParsedTs = parsed.reduce((mx, m) => m.ts > mx ? m.ts : mx, parsed[0].ts);
      const cut = lookbackDays > 0
        ? new Date(new Date(maxParsedTs).getTime() - lookbackDays * 86400000).toISOString()
        : '1970-01-01T00:00:00.000Z';
      setCutoff(cut);
      const fresh = parsed.filter(m => new Date(m.ts) >= new Date(cut));
      // Group each deacon's burst, then keep only money/name-relevant blocks so a
      // request can't be missed and its amount stays tied to the right person.
      const relevant = groupConsecutive(fresh).filter(isRelevant);
      setNewCount(relevant.length);
      if (relevant.length === 0) {
        setResult({ noteSuggestions: [], newOpportunities: [] });
        setMaxTs(cut); setPhase('review'); return;
      }
      setMaxTs(fresh.reduce((mx, m) => new Date(m.ts) > new Date(mx) ? m.ts : mx, fresh[0].ts));
      const resp = await fetch('/api/groupme-suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: relevant, opportunities: compactOpportunities(cases) }),
      });
      const data = await resp.json().catch(() => ({}));
      if (data.aiAvailable === false) { setError('AI isn’t configured on the server, so suggestions can’t be generated. (An ANTHROPIC_API_KEY is required.)'); setPhase('error'); return; }
      if (!resp.ok) { setError(data.error || 'Analysis failed. Please try again.'); setPhase('error'); return; }
      setResult(dedupe(data.suggestions || { noteSuggestions: [], newOpportunities: [] }));
      setPhase('review');
    } catch (e) { setError(e.message || 'Could not read that file.'); setPhase('error'); }
  };

  const decide = (key, status) => setDecisions(d => ({ ...d, [key]: status }));
  const noteText = (s) => (s.by ? s.by + ' — ' : '') + (s.text || '');
  const acceptNote = (i, s) => {
    const cn = routes['n' + i] || s.caseNumber;
    decide('n' + i, onAcceptNote(cn, { text: noteText(s), date: s.date }) ? 'accepted' : 'error');
  };
  // Opportunities for the correction dropdown (active first), [{num,label}].
  const oppOptions = cases.slice()
    .sort((a, b) => (a.status === 'closed') - (b.status === 'closed') || a.name.localeCompare(b.name))
    .map(c => ({ num: c.caseNumber, label: `#${c.caseNumber} · ${c.name}` }));
  const acceptOpp  = (i, s) => { onAcceptOpportunity({ name: s.name, firstNote: (s.by ? s.by + ' — ' : '') + (s.firstNote || ''), date: s.date }); decide('o' + i, 'accepted'); };

  const finish = () => {
    const added     = Object.entries(decisions).filter(([k, v]) => k[0] === 'n' && v === 'accepted').length;
    const created   = Object.entries(decisions).filter(([k, v]) => k[0] === 'o' && v === 'accepted').length;
    const dismissed = Object.values(decisions).filter(v => v === 'dismissed').length;
    onRecordSync({ lastSyncedTs: maxTs || cutoff, added, created, dismissed });
    setSummary({ added, created, dismissed }); setPhase('done');
  };

  const notes = result.noteSuggestions || [];
  const opps = result.newOpportunities || [];
  const total = notes.length + opps.length;
  const decidedCount = Object.keys(decisions).length;

  const Card = ({ done, accepted, children, onAccept, onDismiss, acceptLabel, disabled }) => (
    <div style={{ padding: '14px 16px', border: '1px solid var(--border, #e5e7eb)', borderRadius: 10, marginBottom: 10, background: done ? '#f8fafc' : '#fff', opacity: done ? 0.7 : 1 }}>
      {children}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
        {done ? (
          <span style={{ fontSize: 13, color: accepted ? '#059669' : '#6b7280', fontWeight: 600 }}>
            <Icon name={accepted ? 'check' : 'close'} size={12} stroke={2} /> {accepted ? 'Added' : 'Dismissed'}
          </span>
        ) : (
          <>
            <Btn3 variant="primary" size="sm" disabled={disabled} onClick={onAccept}>{acceptLabel || 'Accept'}</Btn3>
            <button className="link-btn" onClick={onDismiss}>Dismiss</button>
            {disabled && <span style={{ fontSize: 12, color: '#b45309' }}>No matching opportunity (#{disabled})</span>}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">GroupMe Sync</h1>
          <div className="page-sub">
            Upload your GroupMe export folder. AI finds only what's missing and proposes it as additive
            notes/opportunities — nothing is changed until you Accept, it never edits or removes anything
            already in a case, and it skips chatter that doesn't match an opportunity. Accepted items are
            saved by you (admin) and tagged "from GroupMe."
          </div>
        </div>
      </div>

      {(phase === 'idle' || phase === 'error') && (
        <>
          <label className="file-drop" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px', border: '1px dashed #cbd5e1', borderRadius: 10, cursor: 'pointer' }}>
            <input type="file" webkitdirectory="" directory="" multiple hidden
                   onChange={e => onPick(e.target.files)} />
            <Icon name="upload" size={18} stroke={1.7} />
            <span>Upload the GroupMe export <strong>folder</strong> — the whole folder, media and all</span>
          </label>
          <label className="file-drop" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', marginTop: 10, border: '1px dashed #cbd5e1', borderRadius: 10, cursor: 'pointer' }}>
            <input type="file" accept=".json,.txt,.csv,.xlsx,.xls" hidden
                   onChange={e => onPick(e.target.files)} />
            <Icon name="file" size={16} stroke={1.7} />
            <span className="page-sub" style={{ margin: 0 }}>…or a single file (message.json, .txt, .csv, or .xlsx)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>Look back over</span>
            <select value={lookbackDays} onChange={e => setLookbackDays(Number(e.target.value))}
                    style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)' }}>
              <option value={30}>the last 30 days</option>
              <option value={60}>the last 60 days</option>
              <option value={90}>the last 90 days</option>
              <option value={0}>the entire export</option>
            </select>
          </label>
          <div className="page-sub" style={{ marginTop: 10 }}>
            Set this <em>before</em> you choose the folder. Only the most recent window is analyzed — the AI
            matches messages to existing opportunities by name (e.g. "Amanda J" → Amanda Jones), keeps only
            case updates and fund approvals/disbursements, and skips general back-and-forth. Anything already
            recorded on that opportunity is dropped, and you still review and Accept each item.
          </div>
          {phase === 'error' && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#b91c1c', fontSize: 13 }}>
              <Icon name="alert" size={14} stroke={1.9} /> {error}
            </div>
          )}
        </>
      )}

      {phase === 'analyzing' && (
        <div className="empty">
          <Icon name="refresh" size={22} stroke={1.7} className="spin" />
          <div className="empty-title">Analyzing {fileName}…</div>
          <div className="empty-body">Reading the export and checking it against existing records. A full scan of a large export can take a minute.</div>
        </div>
      )}

      {phase === 'review' && total === 0 && (
        <div className="empty">
          <Icon name="check" size={22} stroke={1.6} />
          <div className="empty-title">Nothing missing to add</div>
          <div className="empty-body">
            {newCount === 0
              ? `No messages in the chosen window (since ${cutoff ? fmt3.dateFull(cutoff) : 'n/a'}). Widen the look-back range and try again.`
              : `Checked ${newCount} message${newCount === 1 ? '' : 's'} in the window — everything is already recorded on its opportunity. Nothing missing to add.`}
          </div>
          <div style={{ marginTop: 14 }}>
            <Btn3 variant="primary" onClick={finish}>Done</Btn3>
          </div>
        </div>
      )}

      {phase === 'review' && total > 0 && (
        <>
          <div className="page-sub" style={{ margin: '4px 0 16px' }}>
            {notes.length} suggested note{notes.length === 1 ? '' : 's'} and {opps.length} possible new
            opportunit{opps.length === 1 ? 'y' : 'ies'} from {newCount} new message{newCount === 1 ? '' : 's'}.
            Review each below.
          </div>

          {notes.length > 0 && <h2 className="section-h">Updates for existing opportunities</h2>}
          {notes.map((s, i) => {
            const key = 'n' + i; const st = decisions[key];
            const chosen = routes[key] || s.caseNumber;
            const target = byNum[chosen];
            return (
              <Card key={key} done={!!st} accepted={st === 'accepted'}
                    disabled={target ? false : chosen}
                    acceptLabel="Add note"
                    onAccept={() => acceptNote(i, s)} onDismiss={() => decide(key, 'dismissed')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>Tie to:</span>
                  <select value={chosen} onChange={e => setRoutes(r => ({ ...r, [key]: e.target.value }))}
                          style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 600, background: 'var(--bg)', color: 'var(--text)', maxWidth: '100%' }}>
                    {oppOptions.map(o => <option key={o.num} value={o.num}>{o.label}</option>)}
                  </select>
                  {s.date && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>· {fmt3.dateFull(s.date)}</span>}
                </div>
                {s.by && <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>{s.by} reported:</div>}
                <div style={{ fontSize: 14, marginTop: 2 }}>{s.text}</div>
                {s.source && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>“{s.source}”</div>}
              </Card>
            );
          })}

          {opps.length > 0 && <h2 className="section-h" style={{ marginTop: 18 }}>Possible new opportunities</h2>}
          {opps.map((s, i) => {
            const key = 'o' + i; const st = decisions[key];
            return (
              <Card key={key} done={!!st} accepted={st === 'accepted'}
                    acceptLabel="Create opportunity"
                    onAccept={() => acceptOpp(i, s)} onDismiss={() => decide(key, 'dismissed')}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {s.name}{s.date && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> · {fmt3.dateFull(s.date)}</span>}
                </div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{s.firstNote}</div>
                {s.source && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>source: {s.source}</div>}
              </Card>
            );
          })}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border, #e5e7eb)' }}>
            <Btn3 variant="primary" onClick={finish}>Done</Btn3>
            <span className="page-sub" style={{ margin: 0 }}>{decidedCount} of {total} reviewed</span>
          </div>
        </>
      )}

      {phase === 'done' && summary && (
        <div className="empty">
          <Icon name="check" size={22} stroke={1.6} />
          <div className="empty-title">Sync complete</div>
          <div className="empty-body">
            Added {summary.added} note{summary.added === 1 ? '' : 's'} and created {summary.created} opportunit{summary.created === 1 ? 'y' : 'ies'}; dismissed {summary.dismissed}.
          </div>
          <div style={{ marginTop: 14 }}>
            <Btn3 variant="ghost" onClick={() => { setPhase('idle'); setFileName(''); }}>Sync another export</Btn3>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin password gate ────────────────────────────────
// Guards the whole Admin area (Deacons, Activity Log, Monthly Report, GroupMe
// Sync). Unlock persists for the browser session.
const ADMIN_PASSWORD = '8787';
function AdminGate({ onUnlock, onCancel }) {
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState('');
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) onUnlock();
    else { setErr('Incorrect password.'); setPw(''); }
  };
  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Admin</h1>
          <div className="page-sub">Enter the admin password to access Deacons, Activity Log, Monthly Report, and GroupMe Sync.</div>
        </div>
      </div>
      <form onSubmit={submit} style={{ maxWidth: 320, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Icon name="lock" size={18} stroke={1.7} />
          <input type="password" inputMode="numeric" autoFocus value={pw}
                 onChange={e => { setPw(e.target.value); setErr(''); }}
                 placeholder="Admin password" className="pin-input" style={{ letterSpacing: '0.3em' }} />
        </div>
        {err && <div className="login-error" style={{ marginBottom: 10 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn3 variant="primary" type="submit" disabled={!pw}>Unlock</Btn3>
          {onCancel && <button type="button" className="link-btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

Object.assign(window, { ReportView3, PrintPreview3, ActivityView3, MembersView, SyncView3, AdminGate });
