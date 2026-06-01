// Web-first Helper — sidebar + content layout
// Mobile-friendly via CSS responsive

// ─── Small UI atoms ────────────────────────────────────────
const StatusDot = ({ status, size = 8 }) => (
  <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: 99,
    background: STATUSES[status]?.color || '#a1a1aa',
  }} />
);

const StatusPill2 = ({ status }) => {
  const s = STATUSES[status] || { label: status, color: '#a1a1aa' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, color: '#52525b', fontWeight: 500,
    }}>
      <StatusDot status={status} /> {s.label}
    </span>
  );
};

const Av = ({ tm, size = 24 }) => {
  const m = TEAM.find(t => t.id === tm) || { initials: '?', color: '#999' };
  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      background: m.color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    }}>{m.initials}</div>
  );
};

const AvStack = ({ ids, size = 20 }) => (
  <div style={{ display: 'inline-flex' }}>
    {ids.map((id, i) => (
      <div key={id} style={{
        marginLeft: i === 0 ? 0 : -6,
        boxShadow: '0 0 0 2px #fff', borderRadius: 99,
      }}>
        <Av tm={id} size={size} />
      </div>
    ))}
  </div>
);

const Btn = ({ variant = 'secondary', icon, children, onClick, size = 'md', disabled, fullWidth, style = {} }) => {
  const v = {
    primary:   { bg: '#18181b', fg: '#fff', bd: '#18181b' },
    secondary: { bg: '#fff',   fg: '#18181b', bd: '#e4e4e7' },
    ghost:     { bg: 'transparent', fg: '#52525b', bd: 'transparent' },
    danger:    { bg: '#fff', fg: '#dc2626', bd: '#e4e4e7' },
  }[variant];
  const sz = { sm: { p: '5px 10px', fs: 13, h: 28, g: 5 },
               md: { p: '7px 14px', fs: 14, h: 34, g: 6 },
               lg: { p: '10px 18px', fs: 15, h: 42, g: 7 } }[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sz.g, padding: sz.p, height: sz.h,
      background: v.bg, color: v.fg,
      border: '1px solid ' + v.bd, borderRadius: 7,
      fontSize: sz.fs, fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} stroke={1.8} />}
      {children}
    </button>
  );
};

// ─── Sidebar ───────────────────────────────────────────────
function Sidebar({ active, onNav, counts, onNew, onSignOut }) {
  const me = TEAM.find(t => t.id === ME_ID);
  const items = [
    { id: 'cases',    icon: 'folder',  label: 'All cases',  count: counts.all },
    { id: 'mine',     icon: 'user',    label: 'My cases',   count: counts.mine },
    { id: 'open',     icon: 'clock',   label: 'Open',       count: counts.open },
    { id: 'closed',   icon: 'check',   label: 'Closed',     count: counts.closed },
  ];
  const tools = [
    { id: 'report',   icon: 'print',   label: 'Monthly report' },
    { id: 'activity', icon: 'history', label: 'Activity' },
    { id: 'team',     icon: 'users',   label: 'Team' },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark">H</div>
        <div>
          <div className="logo-name">Helper</div>
          <div className="logo-sub">Trinity PCA</div>
        </div>
      </div>
      <button onClick={onNew} className="new-btn">
        <Icon name="plus" size={15} stroke={2.2} /> New case
      </button>
      <nav className="sidebar-nav">
        <div className="nav-label">Cases</div>
        {items.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)}
            className={'nav-item' + (active === it.id ? ' active' : '')}>
            <Icon name={it.icon} size={16} stroke={1.7} />
            <span>{it.label}</span>
            <span className="nav-count">{it.count}</span>
          </button>
        ))}
        <div className="nav-label">Tools</div>
        {tools.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)}
            className={'nav-item' + (active === it.id ? ' active' : '')}>
            <Icon name={it.icon} size={16} stroke={1.7} />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button className="me-row" onClick={onSignOut}>
          <Av tm={ME_ID} size={28} />
          <div>
            <div className="me-name">{me.name}</div>
            <div className="me-role">{me.role}</div>
          </div>
          <Icon name="logOut" size={14} stroke={1.6} style={{ color: '#a1a1aa', marginLeft: 'auto' }} />
        </button>
      </div>
    </aside>
  );
}

// ─── Case list ─────────────────────────────────────────────
function CaseList({ cases, selectedId, onSelect, title, q, setQ, onNew }) {
  return (
    <div className="case-list">
      <div className="list-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <div className="page-sub">{cases.length} {cases.length === 1 ? 'case' : 'cases'}</div>
        </div>
        <div className="head-actions">
          <div className="search">
            <Icon name="search" size={15} stroke={1.7} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search cases or notes…" />
          </div>
          <Btn variant="primary" icon="plus" onClick={onNew}>New case</Btn>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="empty">
          <Icon name="search" size={20} stroke={1.6} style={{ color: '#a1a1aa' }} />
          <div className="empty-title">No cases match</div>
          <div className="empty-body">Try a different filter or search.</div>
        </div>
      ) : (
        <div className="rows">
          {cases.map(c => {
            const latest = c.notes[0];
            return (
              <button key={c.id} onClick={() => onSelect(c.id)}
                className={'row' + (selectedId === c.id ? ' selected' : '')}>
                <div className="row-left">
                  <div className="row-num">{c.caseNumber}</div>
                  <AvStack ids={c.assigned} size={20} />
                </div>
                <div className="row-mid">
                  <div className="row-title">
                    {c.household} household
                    <StatusPill2 status={c.status} />
                  </div>
                  <div className="row-preview">
                    {latest ? latest.text : c.summary}
                  </div>
                </div>
                <div className="row-right">
                  <div className="row-type">{NEED_TYPES[c.type]}</div>
                  <div className="row-time">{fmt2.relative(c.lastActivity)}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Case detail ───────────────────────────────────────────
function CaseDetail({ c, onBack, onAddNote, onUpdate, onPrint }) {
  const [noteText, setNoteText] = React.useState('');
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({
    summary: c.summary, type: c.type, status: c.status,
    helpGiven: c.helpGiven || 0, assigned: c.assigned,
  });
  React.useEffect(() => {
    setDraft({ summary: c.summary, type: c.type, status: c.status,
               helpGiven: c.helpGiven || 0, assigned: c.assigned });
    setEditing(false);
  }, [c.id]);

  const post = () => {
    if (!noteText.trim()) return;
    onAddNote(c.id, noteText);
    setNoteText('');
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify({
    summary: c.summary, type: c.type, status: c.status,
    helpGiven: c.helpGiven || 0, assigned: c.assigned,
  });

  return (
    <div className="detail">
      <div className="detail-head">
        <button className="back-btn" onClick={onBack}>
          <Icon name="chevronLeft" size={16} stroke={1.8} /> Cases
        </button>
        <div className="case-num">{c.caseNumber}</div>
        <div className="head-spacer" />
        <Btn variant="ghost" size="sm" icon="print">Print summary</Btn>
      </div>

      <div className="detail-body">
        {/* Hero */}
        <div className="hero">
          <h1 className="hero-title">{c.household} household</h1>
          <div className="hero-meta">
            <StatusPill2 status={c.status} />
            <span className="dot-sep">·</span>
            <span>{NEED_TYPES[c.type]}</span>
            <span className="dot-sep">·</span>
            <span>Opened {fmt2.dateFull(c.opened)}</span>
          </div>
          <p className="hero-summary">{c.summary}</p>
        </div>

        {/* Quick add note */}
        <div className="composer">
          <Av tm={ME_ID} size={32} />
          <div className="composer-body">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note. What happened? A visit, a call, an update — just type it out."
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post(); }}
            />
            <div className="composer-foot">
              <span className="hint">Cmd / Ctrl + Enter to post · names auto-redacted when printed</span>
              <Btn variant="primary" size="sm" onClick={post} disabled={!noteText.trim()}>Post note</Btn>
            </div>
          </div>
        </div>

        {/* Notes timeline */}
        <div className="timeline">
          {c.notes.length === 0 && (
            <div className="empty-inline">No notes yet. Add the first one above.</div>
          )}
          {c.notes.map(n => {
            const a = TEAM.find(t => t.id === n.author);
            return (
              <article key={n.id} className="note">
                <div className="note-head">
                  <Av tm={n.author} size={28} />
                  <div className="note-meta">
                    <span className="note-author">{a.name}</span>
                    <span className="note-time">{fmt2.relative(n.date)}</span>
                  </div>
                </div>
                <p className="note-body">{n.text}</p>
              </article>
            );
          })}
        </div>

        {/* Files */}
        {c.files.length > 0 && (
          <div className="files">
            <div className="section-label">Files ({c.files.length})</div>
            <div className="files-list">
              {c.files.map(f => (
                <div key={f.id} className="file">
                  <Icon name="paperclip" size={14} stroke={1.7} />
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">{f.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right metadata pane */}
      <aside className="detail-meta">
        <div className="meta-section">
          <div className="meta-row">
            <label>Status</label>
            <select value={draft.status}
              onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}>
              {Object.entries(STATUSES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </div>
          <div className="meta-row">
            <label>Need type</label>
            <select value={draft.type}
              onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}>
              {Object.entries(NEED_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          <div className="meta-row">
            <label>Assigned</label>
            <div className="assigned-chips">
              {draft.assigned.map(id => {
                const m = TEAM.find(t => t.id === id);
                return (
                  <span key={id} className="chip">
                    <Av tm={id} size={18} /> {m.name.split(' ')[0]}
                    <button onClick={() => setDraft(d => ({ ...d, assigned: d.assigned.filter(x => x !== id) }))}>
                      <Icon name="close" size={11} stroke={2} />
                    </button>
                  </span>
                );
              })}
              <select value=""
                onChange={e => {
                  if (e.target.value) setDraft(d => ({ ...d, assigned: [...d.assigned, e.target.value] }));
                }}
                className="add-assign">
                <option value="">+ Add</option>
                {TEAM.filter(t => !draft.assigned.includes(t.id)).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="meta-section meta-quiet">
          <div className="meta-quiet-head">
            <span>Help given (optional)</span>
            <span className="meta-quiet-sub">Not the focus — fill in if/when relevant</span>
          </div>
          <div className="meta-row">
            <label>Amount</label>
            <div style={{ position: 'relative' }}>
              <span className="amt-prefix">$</span>
              <input
                type="text" inputMode="numeric"
                value={draft.helpGiven || ''}
                placeholder="0"
                onChange={e => setDraft(d => ({ ...d, helpGiven: parseInt(e.target.value.replace(/\D/g,'')) || 0 }))}
                style={{ paddingLeft: 18 }}
              />
            </div>
          </div>
          {draft.helpGiven > 1500 && (
            <div className="deacon-note">
              <Icon name="flag" size={12} stroke={1.8} />
              Over $1,500 — needs deacon approval at monthly meeting.
            </div>
          )}
        </div>

        {dirty && (
          <div className="save-bar">
            <button className="discard" onClick={() => {
              setDraft({ summary: c.summary, type: c.type, status: c.status,
                         helpGiven: c.helpGiven || 0, assigned: c.assigned });
            }}>Discard</button>
            <Btn variant="primary" size="sm" onClick={() => { onUpdate(c.id, draft); }}>Save changes</Btn>
          </div>
        )}
      </aside>
    </div>
  );
}

// ─── New case modal ────────────────────────────────────────
function NewCaseModal({ onClose, onCreate }) {
  const [household, setHousehold] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [type, setType] = React.useState('rent');
  const [assigned, setAssigned] = React.useState([ME_ID]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>New case</h2>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" size={18} stroke={1.8} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-intro">Keep it light. You can fill in details later from notes.</p>
          <div className="form-row">
            <label>Household</label>
            <input autoFocus value={household} onChange={e => setHousehold(e.target.value)}
                   placeholder="Last name or family identifier" />
            <div className="form-hint">e.g. "Alvarez" — used internally; never on printed reports.</div>
          </div>
          <div className="form-row">
            <label>What's going on?</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)}
                      placeholder="A sentence or two. This becomes the first note."
                      rows={3} />
          </div>
          <div className="form-row">
            <label>Type of need</label>
            <div className="chip-grid">
              {Object.entries(NEED_TYPES).map(([k, l]) => (
                <button key={k} onClick={() => setType(k)}
                  className={'chip-btn' + (type === k ? ' on' : '')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>Who's helping</label>
            <div className="assign-grid">
              {TEAM.map(t => {
                const on = assigned.includes(t.id);
                return (
                  <button key={t.id}
                    onClick={() => setAssigned(a => on ? a.filter(x => x !== t.id) : [...a, t.id])}
                    className={'assign-btn' + (on ? ' on' : '')}>
                    <Av tm={t.id} size={22} />
                    <span>{t.name.split(' ')[0]}{t.id === ME_ID && ' (you)'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" disabled={!household.trim()}
               onClick={() => onCreate({ household, summary, type, assigned })}>
            Create case
          </Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Sidebar, CaseList, CaseDetail, NewCaseModal,
  StatusPill2, StatusDot, Av, AvStack, Btn,
});
