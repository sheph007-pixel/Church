// Tab roots — Dashboard, Cases list, Report, Me
// Plus: bottom tab bar

function BottomTabs({ active, onTab, onCreate }) {
  const items = [
    { id: 'home',   icon: 'home2',  label: 'Home' },
    { id: 'cases',  icon: 'folder', label: 'Cases' },
    { id: 'report', icon: 'chart',  label: 'Report' },
    { id: 'me',     icon: 'user',   label: 'Me' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: T.bg + 'ee', backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderTop: '0.5px solid ' + T.border,
      padding: '8px 0 34px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        position: 'relative', height: 48,
      }}>
        {items.slice(0, 2).map(it => <TabItem key={it.id} item={it} active={active === it.id} onClick={() => onTab(it.id)} />)}
        <button onClick={onCreate} style={{
          width: 56, height: 56, marginBottom: 4,
          borderRadius: 99, border: 'none', background: T.text, color: T.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <Icon name="plus" size={26} stroke={2.4} />
        </button>
        {items.slice(2).map(it => <TabItem key={it.id} item={it} active={active === it.id} onClick={() => onTab(it.id)} />)}
      </div>
    </div>
  );
}

function TabItem({ item, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', flex: 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      color: active ? T.text : T.textFaint, padding: '4px 0',
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      <Icon name={item.icon} size={22} stroke={active ? 1.9 : 1.6} />
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.1 }}>{item.label}</span>
    </button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function DashboardScreen({ cases, onOpenCase, onSeeAll, onOpenReport }) {
  const my = cases.filter(c => c.assigned.includes(ME_ID) && !['resolved'].includes(c.status));
  const needsAction = cases.filter(c =>
    c.requests.some(r => r.status === 'pending_team' && !r.votes.find(v => v.tm === ME_ID))
  );
  const ytd = BUDGET.ytdDisbursed;
  const pct = Math.round(ytd / BUDGET.annual * 100);

  return (
    <div style={{ paddingBottom: 110 }}>
      <ScreenHeader
        title="Helper"
        subtitle={`Wed, May 21 · ${TEAM.find(t => t.id === ME_ID).name.split(' ')[0]}`}
      />

      {/* Hero stat — month at a glance */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          background: T.text, color: T.bg,
          borderRadius: 16, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, top: -30, width: 160, height: 160,
            borderRadius: 999, background: 'oklch(0.42 0.08 257 / 0.5)',
            filter: 'blur(40px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase',
              color: 'rgba(250,250,249,0.55)', fontWeight: 500,
            }}>This month</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -1, lineHeight: 1 }}>
                  {cases.filter(c => !['resolved','paused'].includes(c.status)).length}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(250,250,249,0.5)', marginTop: 4 }}>open cases</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -1, lineHeight: 1 }}>
                  {fmt.moneyShort(ytd)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(250,250,249,0.5)', marginTop: 4 }}>disbursed YTD</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -1, lineHeight: 1, color: 'oklch(0.78 0.13 70)' }}>
                  {cases.filter(c => c.requests.some(r => r.status === 'deacon_review')).length}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(250,250,249,0.5)', marginTop: 4 }}>deacon review</div>
              </div>
            </div>
            {/* budget bar */}
            <div style={{ marginTop: 18 }}>
              <div style={{
                fontSize: 11, color: 'rgba(250,250,249,0.55)',
                display: 'flex', justifyContent: 'space-between', marginBottom: 6,
              }}>
                <span>FY26 benevolence fund</span>
                <span>{pct}% used · {fmt.moneyShort(BUDGET.annual - ytd)} left</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: pct + '%', height: '100%', background: '#fff', borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Needs your vote */}
      {needsAction.length > 0 && (
        <>
          <SectionLabel>Needs your vote</SectionLabel>
          <div style={{ padding: '0 16px 6px' }}>
            {needsAction.map(c => {
              const req = c.requests.find(r => r.status === 'pending_team');
              return (
                <div key={c.id} onClick={() => onOpenCase(c.id)} style={{
                  background: T.warnSoft, border: '1px solid oklch(0.85 0.08 80)',
                  borderRadius: 12, padding: 14, marginBottom: 8,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <Icon name="alert" size={20} style={{ color: '#b45309', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: -0.1 }}>
                      {fmt.money(req.amount)} — {needTypeMeta[c.type].label}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.caseNumber} · {req.purpose}
                    </div>
                  </div>
                  <Icon name="chevronRight" size={16} style={{ color: T.textFaint }} />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* My cases */}
      <SectionLabel
        action={
          <button onClick={onSeeAll} style={{
            background: 'none', border: 'none', color: T.accent,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0,
          }}>See all</button>
        }
      >My active cases</SectionLabel>
      <div style={{ padding: '0 16px 4px' }}>
        {my.length === 0
          ? <Empty icon="folder" title="Nothing on your plate" body="When you're assigned to a case, it shows here." />
          : my.map(c => <CaseRow key={c.id} c={c} onClick={() => onOpenCase(c.id)} />)
        }
      </div>

      {/* Upcoming meeting */}
      <SectionLabel style={{ paddingTop: 16 }}>Next monthly meeting</SectionLabel>
      <div style={{ padding: '0 16px' }}>
        <div onClick={onOpenReport} style={{
          background: T.surface, border: '1px solid ' + T.border,
          borderRadius: 12, padding: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: T.deaconSoft,
            color: T.deacon,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>Jun</div>
            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: T.fontDisp, lineHeight: 1, letterSpacing: -0.5 }}>2</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Deacon meeting · 7:00 PM</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
              {cases.filter(c => c.requests.some(r => r.status === 'deacon_review')).length} requests, {fmt.money(
                cases.flatMap(c => c.requests).filter(r => r.status === 'deacon_review').reduce((s,r) => s+r.amount, 0)
              )} total · preview report
            </div>
          </div>
          <Icon name="chevronRight" size={16} style={{ color: T.textFaint }} />
        </div>
      </div>
    </div>
  );
}

// Single row used in lists
function CaseRow({ c, onClick }) {
  const pendingAmt = c.requests.find(r => r.status === 'pending_team' || r.status === 'deacon_review')?.amount;
  return (
    <div onClick={onClick} style={{
      background: T.surface, border: '1px solid ' + T.border,
      borderRadius: 12, padding: '14px', marginBottom: 8,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 11, color: T.textFaint,
            letterSpacing: 0.4, marginBottom: 3,
          }}>{c.caseNumber}</div>
          <div style={{
            fontSize: 15, fontWeight: 600, color: T.text,
            letterSpacing: -0.15, lineHeight: 1.25,
          }}>
            {c.household} household
            <span style={{ color: T.textFaint, fontWeight: 400 }}> · {c.members.length} {c.members.length === 1 ? 'person' : 'people'}</span>
          </div>
        </div>
        <StatusPill status={c.status} size="sm" />
      </div>
      <div style={{
        fontSize: 13, color: T.textMuted, lineHeight: 1.4, marginTop: 8,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{c.summary}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 12, gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <TypeChip type={c.type} />
          {pendingAmt && (
            <span style={{
              fontSize: 12, color: T.textMuted, fontWeight: 500,
            }}>· {fmt.money(pendingAmt)} pending</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AvatarStack ids={c.assigned} size={20} />
          <span style={{ fontSize: 11, color: T.textFaint }}>{fmt.relative(c.lastActivity)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Cases list ──────────────────────────────────────────────
function CasesListScreen({ cases, onOpenCase }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | mine | open | needs_vote | deacon
  const [type, setType] = React.useState('all');

  const filters = [
    { id: 'all',       label: 'All' },
    { id: 'mine',      label: 'Mine' },
    { id: 'open',      label: 'Open' },
    { id: 'needs_vote',label: 'Needs vote' },
    { id: 'deacon',    label: 'Deacon' },
    { id: 'resolved',  label: 'Resolved' },
  ];

  let list = cases.slice();
  if (filter === 'mine') list = list.filter(c => c.assigned.includes(ME_ID));
  if (filter === 'open') list = list.filter(c => !['resolved','paused'].includes(c.status));
  if (filter === 'needs_vote') list = list.filter(c => c.requests.some(r => r.status === 'pending_team'));
  if (filter === 'deacon') list = list.filter(c => c.requests.some(r => r.status === 'deacon_review'));
  if (filter === 'resolved') list = list.filter(c => c.status === 'resolved' || c.status === 'paused');
  if (type !== 'all') list = list.filter(c => c.type === type);
  if (q) {
    const qq = q.toLowerCase();
    list = list.filter(c =>
      c.household.toLowerCase().includes(qq) ||
      c.caseNumber.toLowerCase().includes(qq) ||
      c.summary.toLowerCase().includes(qq) ||
      c.notes.some(n => n.text.toLowerCase().includes(qq))
    );
  }
  // sort by last activity desc
  list.sort((a,b) => new Date(b.lastActivity) - new Date(a.lastActivity));

  return (
    <div style={{ paddingBottom: 110 }}>
      <ScreenHeader title="Cases" subtitle={`${cases.length} total · ${cases.filter(c => !['resolved','paused'].includes(c.status)).length} open`} />

      {/* Search */}
      <div style={{ padding: '6px 16px 10px' }}>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: T.textFaint, pointerEvents: 'none',
          }} />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search cases, notes, case numbers…"
            style={{
              ...inputStyle, paddingLeft: 36, height: 40, fontSize: 14,
              background: T.surfaceAlt, border: '1px solid transparent',
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        padding: '0 16px 12px', scrollbarWidth: 'none',
      }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            background: filter === f.id ? T.text : T.surface,
            color: filter === f.id ? T.bg : T.text,
            border: '1px solid ' + (filter === f.id ? T.text : T.border),
            borderRadius: 99, padding: '7px 13px', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            WebkitTapHighlightColor: 'transparent', fontFamily: T.fontSans,
          }}>{f.label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '0 16px' }}>
        {list.length === 0
          ? <Empty icon="search" title="No matches" body="Try a different filter or search term." />
          : list.map(c => <CaseRow key={c.id} c={c} onClick={() => onOpenCase(c.id)} />)
        }
      </div>
    </div>
  );
}

Object.assign(window, { BottomTabs, DashboardScreen, CasesListScreen, CaseRow });
