// v3 app — cases, care team, AI summary, tasks, files, member admin

// ─── UI atoms ───────────────────────────────────────────
// Resolve a member's avatar (initials + color) from the LIVE team index kept by
// App (window.MEMBERS_BY_ID), falling back to the bootstrap TEAM, then to a
// stable color derived from the id so we never show a blank/grey "?" bubble.
function avMember(id) {
  const reg = (typeof window !== 'undefined' && window.MEMBERS_BY_ID) || null;
  const m = (reg && reg[id]) || TEAM.find(t => t.id === id);
  if (m) return m;
  const palette = ['#0f766e', '#2563eb', '#7c3aed', '#b45309', '#dc2626', '#0891b2', '#059669', '#9333ea', '#0d9488'];
  let h = 0; for (let i = 0; i < String(id).length; i++) h = (h * 31 + String(id).charCodeAt(i)) >>> 0;
  const suffix = String(id || '').replace(/^tm[_]?/, '');
  const initials = (suffix.match(/[a-z]/gi) || ['?']).slice(0, 2).join('').toUpperCase();
  return { initials: initials || '?', color: palette[h % palette.length] };
}

const Av3 = ({ id, size = 24, ring }) => {
  const m = avMember(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      background: m.color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
      boxShadow: ring ? '0 0 0 2px #fff' : 'none',
    }}>{m.initials}</div>
  );
};

const AvStack3 = ({ ids, size = 22, max = 4 }) => {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((id, i) => (
        <div key={id} style={{ marginLeft: i === 0 ? 0 : -7, position: 'relative', zIndex: 10 - i }}>
          <Av3 id={id} size={size} ring />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: -7,
          width: size, height: size, borderRadius: 99,
          background: '#e4e4e7', color: '#52525b',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.36, fontWeight: 600,
          boxShadow: '0 0 0 2px #fff',
        }}>+{extra}</div>
      )}
    </div>
  );
};

const StatusPill3 = ({ status }) => {
  const s = STATUSES[status] || { label: status, color: '#a1a1aa' };
  return (
    <span className="status-pill" style={{ '--c': s.color }}>
      <span className="status-dot" /> {s.label}
    </span>
  );
};

// Assigned-deacon name badges for the Team column (stacked, up to 2).
const AssigneeBadges = ({ ids }) => {
  const reg = (typeof window !== 'undefined' && window.MEMBERS_BY_ID) || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
      {ids.slice(0, 2).map(id => {
        const m = reg[id] || TEAM.find(t => t.id === id) || {};
        const first = (m.name || '').split(' ')[0] || avMember(id).initials;
        return (
          <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 99,
            padding: '2px 9px 2px 2px', fontSize: 12, fontWeight: 600, color: 'var(--text)', maxWidth: '100%' }}>
            <Av3 id={id} size={18} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{first}</span>
          </span>
        );
      })}
    </div>
  );
};

const Btn3 = ({ variant = 'secondary', icon, children, onClick, size = 'md', disabled, fullWidth, type, style }) => {
  const cls = 'btn btn-' + variant + ' btn-' + size + (fullWidth ? ' btn-full' : '');
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} stroke={1.8} />}
      {children}
    </button>
  );
};

// ─── Sidebar ────────────────────────────────────────────
function Sidebar3({ active, onNav, counts, onNew, me, adminUnlocked, onSignOut, onSwitchMe, collapsed, onToggleCollapse }) {
  const items = [
    { id: 'active', icon: 'folder',  label: 'Active',  count: counts.active },
    { id: 'paused', icon: 'clock',   label: 'Paused',  count: counts.paused },
    { id: 'closed', icon: 'check',   label: 'Closed',  count: counts.closed },
  ];
  const tools = [
    { id: 'activity', icon: 'history', label: 'Activity Log' },
    { id: 'report',   icon: 'print',   label: 'Monthly Report' },
    { id: 'sync',     icon: 'download', label: 'GroupMe Sync' },
  ];
  return (
    <aside className={'sidebar' + (collapsed ? ' sidebar-collapsed' : '')}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img
            src="https://faith-pca.org/wp-content/uploads/2022/11/cropped-Faith_icon_color-270x270.png"
            alt="Faith Presbyterian"
            width="30" height="30"
            style={{ borderRadius: 6, display: 'block' }}
            onError={e => {
              e.target.outerHTML = `<svg viewBox="0 0 32 32" width="30" height="30" fill="none"><rect width="32" height="32" rx="7" fill="#0f2447"/><path d="M11 8 H22 V12 H15 V15 H21 V19 H15 V25 H11 Z" fill="#fff"/></svg>`;
            }}
          />
        </div>
        <div className="brand-text">
          <div className="brand-name">Internal Benevolence</div>
          <div className="brand-sub">Faith Presbyterian</div>
        </div>
        <button className="collapse-btn" onClick={onToggleCollapse}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={14} stroke={2} />
        </button>
      </div>
      <button onClick={onNew} className="new-btn" title={collapsed ? 'New Opportunity' : null}>
        <Icon name="plus" size={14} stroke={2.2} /> <span className="btn-label">New Opportunity</span>
      </button>
      <nav className="sidebar-nav">
        <div className="nav-label">Opportunities</div>
        {items.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} title={it.label}
            className={'nav-item' + (active === it.id ? ' active' : '')}>
            <Icon name={it.icon} size={16} stroke={1.7} />
            <span>{it.label}</span>
            <span className="nav-count">{it.count}</span>
          </button>
        ))}
        <div className="nav-label">Admin {!adminUnlocked && <Icon name="lock" size={10} stroke={2} />}</div>
        <button onClick={() => onNav('members')} title="Deacons"
          className={'nav-item' + (active === 'members' ? ' active' : '')}>
          <Icon name="users" size={16} stroke={1.7} />
          <span>Deacons</span>
        </button>
        {tools.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} title={it.label}
            className={'nav-item' + (active === it.id ? ' active' : '')}>
            <Icon name={it.icon} size={16} stroke={1.7} />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <a href={GROUPME_URL} target="_blank" rel="noopener noreferrer"
           className="groupme-link" title="Open GroupMe — Internal Benevolence team chat">
          <Icon name="chat" size={16} stroke={1.9} />
          <span className="btn-label">Open GroupMe</span>
          <Icon name="chevronRight" size={14} stroke={2} />
        </a>
        <a href="https://faithpca.ccbchurch.com/goto/forms/170/responses/new" target="_blank" rel="noopener noreferrer"
           className="groupme-link" title="Open the benevolence request form (CCB)">
          <Icon name="file" size={16} stroke={1.9} />
          <span className="btn-label">Request Form</span>
          <Icon name="chevronRight" size={14} stroke={2} />
        </a>
        <div className="me-row">
          <Av3 id={me.id} size={28} />
          <div className="me-col">
            <div className="me-name">{me.name}</div>
            <div className="me-role"><span className="me-title">Deacon</span></div>
          </div>
          <button className="icon-btn" onClick={onSignOut} title="Sign out">
            <Icon name="logOut" size={14} stroke={1.7} />
          </button>
        </div>
        <div className="version-line" style={{ fontSize: 10, color: 'var(--text-faint)', textAlign: 'center', marginTop: 8, letterSpacing: '0.02em' }}>
          {APP_VERSION}
        </div>
      </div>
    </aside>
  );
}

// ─── Case list ──────────────────────────────────────────
function CaseList3({ cases, onSelect, title, sub, q, setQ, onNew, onImport }) {
  const [seedStatus, setSeedStatus] = React.useState('idle');
  const [sortKey, setSortKey] = React.useState('date');
  const [sortDir, setSortDir] = React.useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'date' ? 'desc' : 'asc');
    }
  };

  const sorted = [...cases].sort((a, b) => {
    let cmp;
    if (sortKey === 'date') cmp = new Date(caseLastActivity(a)) - new Date(caseLastActivity(b));
    else if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
    else cmp = a.caseNumber.localeCompare(b.caseNumber);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const ColH = ({ k, label, align }) => {
    const active = sortKey === k;
    return (
      <button className={'col-h sortable' + (active ? ' col-active' : '')}
              style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
              onClick={() => handleSort(k)}>
        {label}
        <Icon name="chevronDown" size={11} stroke={2.2} style={{
          opacity: active ? 1 : 0.45,
          transform: active && sortDir === 'asc' ? 'scaleY(-1)' : 'none',
          transition: 'transform 120ms',
        }} />
      </button>
    );
  };

  return (
    <div className="case-list">
      <div className="list-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <div className="page-sub">{sub}</div>
        </div>
        <div className="head-actions">
          <div className="search">
            <Icon name="search" size={15} stroke={1.7} />
            <input value={q} onChange={e => setQ(e.target.value)}
                   placeholder="Search all opportunities, notes, contacts…" />
          </div>
          <Btn3 variant="primary" icon="plus" onClick={onNew}>New Opportunity</Btn3>
        </div>
      </div>
      <div className="col-headers">
        <ColH k="num"  label="#" />
        <ColH k="name" label="Name" />
        <span className="col-h" style={{ cursor: 'default' }}>Team</span>
        <ColH k="date" label="Last Activity" align="right" />
      </div>

      {onImport && seedStatus !== 'done' && (
        <div style={{ margin: '0 0 20px', padding: '18px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="sparkle" size={18} stroke={1.7} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#065f46' }}>Import historical opportunity data</div>
            <div style={{ fontSize: 13, color: '#047857', marginTop: 2 }}>Opportunities from the GroupMe chat are ready to load.</div>
          </div>
          {seedStatus === 'error' && <span style={{ fontSize: 13, color: '#dc2626' }}>Error — try again</span>}
          {seedStatus === 'exists' && <span style={{ fontSize: 13, color: '#6b7280' }}>Already imported</span>}
          <Btn3 variant="primary" disabled={seedStatus === 'loading'} onClick={() => onImport(setSeedStatus)}>
            {seedStatus === 'loading' ? 'Importing…' : 'Import Now'}
          </Btn3>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="empty">
          <Icon name="folder" size={22} stroke={1.5} />
          <div className="empty-title">No Opportunities Here</div>
          <div className="empty-body">Try a different filter or create a new opportunity.</div>
        </div>
      ) : (
        <div className="rows">
          {sorted.map(c => {
            const latest = c.notes[0];
            const openTasks = c.tasks.filter(t => !t.done).length;
            return (
              <button key={c.id} onClick={() => onSelect(c.id)} className="row">
                <div className="row-left">
                  <div className="row-num">{c.caseNumber}</div>
                </div>
                <div className="row-mid">
                  <div className="row-title">
                    {c.name}
                    <StatusPill3 status={c.status} />
                  </div>
                  <div className="row-preview">
                    {latest ? latest.text : 'No notes yet'}
                  </div>
                </div>
                <div className="row-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                  {(c.assignees && c.assignees.length)
                    ? <AssigneeBadges ids={c.assignees} />
                    : <AvStack3 ids={caseAuthors(c)} size={20} />}
                  {openTasks > 0 && (
                    <span className="task-badge">
                      <Icon name="check" size={11} stroke={2} /> {openTasks}
                    </span>
                  )}
                </div>
                <div className="row-time">{fmt3.dateShort(caseLastActivity(c))}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── AI summary card ─────────────────────────────────────
function AiSummaryCard({ c, entry, onEnsure, onRefresh }) {
  // Auto-(re)generate when the case content signature changes (note/task added).
  const sig = caseSig(c);
  React.useEffect(() => { if (onEnsure) onEnsure(c); }, [c.id, sig]);

  const text = entry && entry.text;
  const at = entry && entry.at;
  const loading = !!(entry && entry.loading);
  const firstLoad = loading && !text;
  const refreshing = loading && !!text;

  if (c.notes.length === 0) {
    return (
      <div className="ai-card ai-empty">
        <Icon name="sparkle" size={14} stroke={1.7} />
        <span>Add the first note and a summary will appear here.</span>
      </div>
    );
  }

  return (
    <div className="ai-card">
      <div className="ai-head">
        <div className="ai-label">
          <Icon name="sparkle" size={13} stroke={1.8} /> System Generated Summary
        </div>
        <button className="ai-refresh" onClick={() => onRefresh && onRefresh(c)} disabled={loading} title="Regenerate summary">
          <Icon name="refresh" size={13} stroke={1.8} className={refreshing ? 'spin' : ''} />
        </button>
      </div>
      {firstLoad ? (
        <div className="ai-loading">
          <span className="dot" /><span className="dot" /><span className="dot" />
        </div>
      ) : text ? (
        <p className="ai-body">{text}</p>
      ) : (
        <p className="ai-body ai-fallback">Summary unavailable. Read notes below.</p>
      )}
      {text && at && (
        <div className="ai-foot">
          {refreshing ? 'Updating…' : `Generated ${fmt3.dateTime(at)}`}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Av3, AvStack3, StatusPill3, Btn3, Sidebar3, CaseList3, AiSummaryCard });
