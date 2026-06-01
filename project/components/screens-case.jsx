// Case detail (tabs: overview, notes, money, files, activity), New case, Add note

function CaseDetailScreen({ c, onBack, onAction, onAddNote, onAddRequest, onVote, onUploadFile }) {
  const [tab, setTab] = React.useState('overview');
  const [showReveal, setShowReveal] = React.useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes',    label: 'Notes',    count: c.notes.length },
    { id: 'money',    label: 'Money',    count: c.requests.length },
    { id: 'files',    label: 'Files',    count: c.files.length },
  ];

  return (
    <div style={{ paddingBottom: 110 }}>
      <SheetHeader
        onBack={onBack}
        title={c.caseNumber}
        rightAction={
          <button style={{
            background: 'none', border: 'none', padding: '6px 10px',
            color: T.text, cursor: 'pointer',
          }}><Icon name="moreV" size={20} /></button>
        }
      />

      {/* Title block */}
      <div style={{ padding: '6px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 24, fontWeight: 700, fontFamily: T.fontDisp,
              color: T.text, letterSpacing: -0.6, lineHeight: 1.1,
            }}>
              {c.household} household
            </div>
            <div style={{
              fontSize: 13, color: T.textMuted, marginTop: 6,
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>
              <span>{c.members.length} {c.members.length === 1 ? 'person' : 'people'}</span>
              <span style={{ color: T.textFaint }}>•</span>
              <span>Opened {fmt.dateFull(c.opened)}</span>
            </div>
          </div>
          <StatusPill status={c.status} />
        </div>

        {/* Inline summary */}
        <div style={{
          marginTop: 14, padding: '12px 14px',
          background: T.surfaceAlt, borderRadius: 10,
          fontSize: 14, lineHeight: 1.5, color: T.text, letterSpacing: -0.05,
        }}>{c.summary}</div>

        {/* Quick stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12,
        }}>
          {[
            { label: 'Approved', val: fmt.money(c.amounts.approved), color: c.amounts.approved ? T.ok : T.textFaint },
            { label: 'Disbursed', val: fmt.money(c.amounts.disbursed), color: c.amounts.disbursed ? T.text : T.textFaint },
            { label: 'Pending',  val: fmt.money(c.amounts.requested && c.amounts.requested - (c.amounts.approved || 0)), color: T.warn },
          ].map((s,i) => (
            <div key={i} style={{
              background: T.surface, border: '1px solid ' + T.border,
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 600, fontFamily: T.fontDisp, color: s.color, marginTop: 2, letterSpacing: -0.4 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        position: 'sticky', top: 44, zIndex: 10, background: T.bg,
        borderBottom: '0.5px solid ' + T.border,
        display: 'flex', padding: '0 8px',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none',
            padding: '12px 12px 14px', flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
            color: tab === t.id ? T.text : T.textMuted,
            borderBottom: '2px solid ' + (tab === t.id ? T.text : 'transparent'),
            marginBottom: -1, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 99,
                background: tab === t.id ? T.text : T.surfaceAlt,
                color: tab === t.id ? T.bg : T.textMuted,
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{ padding: '14px 16px' }}>
        {tab === 'overview' && <OverviewTab c={c} showReveal={showReveal} onReveal={() => setShowReveal(v => !v)} />}
        {tab === 'notes'    && <NotesTab c={c} onAddNote={() => onAddNote(c.id)} />}
        {tab === 'money'    && <MoneyTab c={c} onAddRequest={() => onAddRequest(c.id)} onVote={onVote} />}
        {tab === 'files'    && <FilesTab c={c} onUploadFile={() => onUploadFile(c.id)} />}
      </div>
    </div>
  );
}

// ── Overview tab
function OverviewTab({ c, showReveal, onReveal }) {
  return (
    <>
      <Card title={
        <span>Household members</span>
      } action={
        <button onClick={onReveal} style={{
          background: 'none', border: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: T.textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <Icon name={showReveal ? 'eyeOff' : 'eye'} size={14} />
          {showReveal ? 'Hide names' : 'Reveal names'}
        </button>
      } padding={0} style={{ marginBottom: 12 }}>
        {c.members.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px',
            borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 99,
              background: T.surfaceAlt, color: T.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, fontFamily: T.fontMono,
            }}>{showReveal ? fmt.initials(m.name) : '••'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                {showReveal
                  ? m.name
                  : <span style={{ fontFamily: T.fontMono, color: T.text, background: T.text + '12', padding: '1px 8px', borderRadius: 4 }}>
                      ████████ {fmt.initials(m.name)}
                    </span>}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>
                {m.role} · age {m.age}
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Assigned team" padding={0} style={{ marginBottom: 12 }}>
        {c.assigned.map((tm, i) => {
          const m = TEAM.find(t => t.id === tm);
          return (
            <div key={tm} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
            }}>
              <Avatar tm={tm} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                  {m.name}{tm === ME_ID && <span style={{ color: T.textFaint, fontWeight: 400 }}> (you)</span>}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{m.role}</div>
              </div>
            </div>
          );
        })}
        <button style={{
          width: '100%', borderTop: '0.5px solid ' + T.border, background: 'none',
          padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8,
          color: T.accent, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: T.fontSans,
        }}>
          <Icon name="plus" size={14} stroke={2} /> Assign another team member
        </button>
      </Card>

      {/* Need type */}
      <Card title="Need" style={{ marginBottom: 12 }}>
        <TypeChip type={c.type} />
      </Card>
    </>
  );
}

// ── Notes tab
function NotesTab({ c, onAddNote }) {
  const channelIcon = { call: 'phone', visit: 'home', text: 'chat', general: 'note' };
  const sorted = c.notes.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  return (
    <>
      <Button variant="secondary" icon="plus" onClick={onAddNote} fullWidth style={{ marginBottom: 14 }}>
        Add a note
      </Button>
      {sorted.length === 0 && <Empty icon="note" title="No notes yet" body="Log every conversation, visit, or call here." />}
      <div style={{ position: 'relative' }}>
        {sorted.length > 1 && (
          <div style={{
            position: 'absolute', left: 13, top: 22, bottom: 22, width: 1,
            background: T.border,
          }} />
        )}
        {sorted.map((n, i) => {
          const author = TEAM.find(t => t.id === n.author);
          return (
            <div key={n.id} style={{
              display: 'flex', gap: 12, marginBottom: 14, position: 'relative',
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Avatar tm={n.author} size={28} />
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: 99, background: T.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.textMuted,
                }}>
                  <Icon name={channelIcon[n.channel] || 'note'} size={10} stroke={2} />
                </div>
              </div>
              <div style={{
                flex: 1, background: T.surface,
                border: '1px solid ' + T.border, borderRadius: 12,
                padding: '11px 13px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
                  marginBottom: 4,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {author.name.split(' ')[0]} <span style={{ color: T.textFaint, fontWeight: 400, textTransform: 'capitalize' }}>· {n.channel}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textFaint }}>{fmt.relative(n.date)}</div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45, color: T.text }}>{n.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Money tab
function MoneyTab({ c, onAddRequest, onVote }) {
  const sorted = c.requests.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  return (
    <>
      <Button variant="secondary" icon="dollar" onClick={onAddRequest} fullWidth style={{ marginBottom: 14 }}>
        New money request
      </Button>

      {/* Summary box */}
      <div style={{
        background: T.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 14,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>Requested</div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: T.fontDisp, letterSpacing: -0.4, color: T.text }}>{fmt.money(c.amounts.requested)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>Approved</div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: T.fontDisp, letterSpacing: -0.4, color: c.amounts.approved ? T.ok : T.textFaint }}>{fmt.money(c.amounts.approved)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>Disbursed</div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: T.fontDisp, letterSpacing: -0.4, color: c.amounts.disbursed ? T.text : T.textFaint }}>{fmt.money(c.amounts.disbursed)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 500 }}>Remaining to send</div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: T.fontDisp, letterSpacing: -0.4, color: T.text }}>{fmt.money((c.amounts.approved || 0) - (c.amounts.disbursed || 0))}</div>
        </div>
      </div>

      {sorted.length === 0 && <Empty icon="dollar" title="No money requests" body="Open one when the household needs financial help." />}

      {sorted.map(r => <RequestCard key={r.id} r={r} c={c} onVote={onVote} />)}
    </>
  );
}

function RequestCard({ r, c, onVote }) {
  const myVote = r.votes.find(v => v.tm === ME_ID);
  const yesVotes = r.votes.filter(v => v.vote === 'yes').length;
  const requester = TEAM.find(t => t.id === r.requester);
  return (
    <div style={{
      background: T.surface, border: '1px solid ' + T.border,
      borderRadius: 12, marginBottom: 10, overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -0.6, color: T.text, lineHeight: 1 }}>
              {fmt.money(r.amount)}
            </div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6, lineHeight: 1.4 }}>{r.purpose}</div>
          </div>
          <RequestStatusPill status={r.status} />
        </div>

        {r.path === 'deacon' && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: T.deaconSoft, borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: '#5b21b6',
          }}>
            <Icon name="flag" size={14} />
            <span>Over $1,500 — on agenda for {fmt.dateFull(r.meetingDate)} deacon meeting</span>
          </div>
        )}
      </div>

      {/* Votes */}
      <div style={{
        padding: '10px 14px 12px', borderTop: '0.5px solid ' + T.border,
        background: T.surfaceAlt + '60',
      }}>
        <div style={{
          fontSize: 11, color: T.textFaint, letterSpacing: 0.4, textTransform: 'uppercase',
          fontWeight: 500, marginBottom: 8,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{yesVotes}/{TEAM.length} team votes</span>
          <span>Submitted by {requester.name.split(' ')[0]} · {fmt.relative(r.date)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {TEAM.map(tm => {
            const v = r.votes.find(vv => vv.tm === tm.id);
            return (
              <div key={tm.id} style={{ position: 'relative' }}>
                <Avatar tm={tm.id} size={26} />
                {v && (
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 12, height: 12, borderRadius: 99,
                    background: v.vote === 'yes' ? T.ok : T.danger,
                    border: '2px solid ' + T.bg,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {(r.status === 'pending_team' || r.status === 'deacon_review') && !myVote && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="ok" size="sm" icon="check" onClick={() => onVote(c.id, r.id, 'yes')} style={{ flex: 1 }}>
              I approve
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onVote(c.id, r.id, 'no')} style={{ flex: 1 }}>
              No
            </Button>
          </div>
        )}
        {myVote && (
          <div style={{
            marginTop: 12, fontSize: 12, color: T.textMuted, textAlign: 'center',
            background: T.surface, borderRadius: 8, padding: '6px 10px',
          }}>You voted <strong style={{ color: myVote.vote === 'yes' ? T.ok : T.danger }}>{myVote.vote}</strong></div>
        )}
      </div>
    </div>
  );
}

// ── Files tab
function FilesTab({ c, onUploadFile }) {
  return (
    <>
      <Button variant="secondary" icon="upload" onClick={onUploadFile} fullWidth style={{ marginBottom: 14 }}>
        Upload a file
      </Button>
      {c.files.length === 0 && <Empty icon="paperclip" title="No files yet" body="Attach bills, photos, receipts — anything you'd lose track of in texts." />}
      {c.files.map(f => (
        <div key={f.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, background: T.surface,
          border: '1px solid ' + T.border, borderRadius: 10, marginBottom: 8,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8, background: T.surfaceAlt,
            color: T.textMuted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name={f.name.match(/\.(jpg|png|heic|jpeg)$/i) ? 'image' : 'file'} size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 500, color: T.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{f.name}</div>
            <div style={{ fontSize: 12, color: T.textFaint, marginTop: 2 }}>
              {f.size} · {TEAM.find(t => t.id === f.uploadedBy).name.split(' ')[0]} · {fmt.relative(f.date)}
            </div>
          </div>
          <Icon name="download" size={16} style={{ color: T.textMuted }} />
        </div>
      ))}
    </>
  );
}

// ─── New case flow ──────────────────────────────────────────
function NewCaseScreen({ onBack, onCreate }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    household: '', members: [{ name: '', role: 'Head of household', age: '' }],
    type: 'rent', summary: '', assigned: [ME_ID],
  });
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const totalSteps = 3;

  return (
    <div style={{ paddingBottom: 30 }}>
      <SheetHeader onBack={() => step === 1 ? onBack() : setStep(step - 1)}
                   title="New case" subtitle={`Step ${step} of ${totalSteps}`} />

      {/* Progress */}
      <div style={{ height: 3, background: T.border, margin: '0 0 18px' }}>
        <div style={{ width: (step/totalSteps*100) + '%', height: '100%', background: T.text, transition: 'width 240ms ' + T.ease }} />
      </div>

      <div style={{ padding: '0 20px' }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -0.5, color: T.text, margin: '0 0 6px' }}>
              Who are we helping?
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: '0 0 22px', lineHeight: 1.45 }}>
              One case per household. Add everyone the help touches — kids, spouses, anyone living together.
            </p>
            <Field label="Household name" hint="Last name or family identifier (e.g. 'Alvarez').">
              <Input value={data.household} onChange={e => update('household', e.target.value)} placeholder="e.g. Alvarez" autoFocus />
            </Field>
            <div style={{ height: 20 }} />
            <SectionLabel style={{ padding: 0, marginBottom: 8 }}>Household members</SectionLabel>
            {data.members.map((m, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8, marginBottom: 8,
                position: 'relative',
              }}>
                <Input value={m.name} placeholder={i === 0 ? 'Maria Alvarez' : 'Name'}
                       onChange={e => {
                         const arr = data.members.slice();
                         arr[i] = { ...m, name: e.target.value };
                         update('members', arr);
                       }} />
                <Input value={m.age} placeholder="Age" inputMode="numeric"
                       onChange={e => {
                         const arr = data.members.slice();
                         arr[i] = { ...m, age: e.target.value };
                         update('members', arr);
                       }} />
              </div>
            ))}
            <button onClick={() => update('members', [...data.members, { name: '', role: 'Member', age: '' }])}
                    style={{
                      background: 'none', border: '1px dashed ' + T.borderStrong, borderRadius: 8,
                      padding: '10px', width: '100%', color: T.textMuted,
                      fontSize: 13, fontFamily: T.fontSans, fontWeight: 500, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
              <Icon name="plus" size={14} stroke={2} /> Add another member
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -0.5, color: T.text, margin: '0 0 6px' }}>
              What's going on?
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: '0 0 22px', lineHeight: 1.45 }}>
              Pick the kind of need. We can change it later as things develop.
            </p>
            <SectionLabel style={{ padding: 0, marginBottom: 8 }}>Type of need</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18,
            }}>
              {Object.entries(needTypeMeta).map(([key, meta]) => (
                <button key={key} onClick={() => update('type', key)} style={{
                  background: data.type === key ? T.text : T.surface,
                  color: data.type === key ? T.bg : T.text,
                  border: '1px solid ' + (data.type === key ? T.text : T.border),
                  borderRadius: 10, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, fontWeight: 500, fontFamily: T.fontSans,
                  cursor: 'pointer', textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 99,
                    background: data.type === key ? T.bg : T.text,
                    color: data.type === key ? T.text : T.bg,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, fontFamily: T.fontMono,
                  }}>{meta.glyph}</span>
                  {meta.label}
                </button>
              ))}
            </div>
            <Field label="Brief summary" hint="A sentence or two. Be honest — this is private to the team.">
              <Textarea value={data.summary} onChange={e => update('summary', e.target.value)}
                        placeholder="e.g. Family of four behind on May rent after job loss…" rows={4} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -0.5, color: T.text, margin: '0 0 6px' }}>
              Who's taking this on?
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: '0 0 22px', lineHeight: 1.45 }}>
              Pick the team members who'll be in primary contact. Others can still see the case.
            </p>
            <SectionLabel style={{ padding: 0, marginBottom: 8 }}>Assign to</SectionLabel>
            <div style={{ background: T.surface, border: '1px solid ' + T.border, borderRadius: 10, overflow: 'hidden' }}>
              {TEAM.map((tm, i) => {
                const on = data.assigned.includes(tm.id);
                return (
                  <button key={tm.id} onClick={() => {
                    const arr = on ? data.assigned.filter(x => x !== tm.id) : [...data.assigned, tm.id];
                    update('assigned', arr);
                  }} style={{
                    background: 'none', border: 'none', width: '100%', padding: '11px 14px',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
                    fontFamily: T.fontSans,
                    WebkitTapHighlightColor: 'transparent',
                  }}>
                    <Avatar tm={tm.id} size={30} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                        {tm.name}{tm.id === ME_ID && <span style={{ color: T.textFaint, fontWeight: 400 }}> (you)</span>}
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{tm.role}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: on ? T.text : T.surface,
                      border: '1.5px solid ' + (on ? T.text : T.border),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: T.bg,
                    }}>
                      {on && <Icon name="check" size={14} stroke={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary preview */}
            <div style={{
              marginTop: 22, padding: 14, background: T.accentSoft,
              border: '1px solid oklch(0.88 0.025 257)', borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, color: T.accentInk, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                Will be created as
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.accentInk, marginBottom: 6 }}>
                B-2026-017
              </div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>
                {data.household || 'Unnamed'} household
                <span style={{ color: T.textFaint, fontWeight: 400 }}> · {data.members.filter(m => m.name).length} {data.members.filter(m => m.name).length === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom action */}
      <div style={{ padding: '20px' }}>
        {step < totalSteps ? (
          <Button variant="primary" size="lg" fullWidth
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !data.household}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth icon="check" onClick={() => onCreate(data)}>
            Create case
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Add note screen ─────────────────────────────────────────
function AddNoteScreen({ c, onBack, onSave }) {
  const [channel, setChannel] = React.useState('visit');
  const [text, setText] = React.useState('');

  const channels = [
    { id: 'visit', label: 'Visit', icon: 'home2' },
    { id: 'call',  label: 'Call',  icon: 'phone' },
    { id: 'text',  label: 'Text',  icon: 'chat' },
    { id: 'general', label: 'Other', icon: 'note' },
  ];

  return (
    <div>
      <SheetHeader
        onBack={onBack}
        title="Add a note"
        subtitle={c.caseNumber + ' · ' + c.household}
        rightAction={
          <button onClick={() => onSave({ channel, text })} disabled={!text.trim()} style={{
            background: 'none', border: 'none', color: text.trim() ? T.accent : T.textFaint,
            fontSize: 15, fontWeight: 600, padding: '6px 8px',
            cursor: text.trim() ? 'pointer' : 'not-allowed', fontFamily: T.fontSans,
          }}>Save</button>
        }
      />
      <div style={{ padding: '14px 20px' }}>
        <SectionLabel style={{ padding: '0 0 8px' }}>Channel</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 18 }}>
          {channels.map(ch => (
            <button key={ch.id} onClick={() => setChannel(ch.id)} style={{
              background: channel === ch.id ? T.text : T.surface,
              color: channel === ch.id ? T.bg : T.text,
              border: '1px solid ' + (channel === ch.id ? T.text : T.border),
              borderRadius: 10, padding: '12px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: 12, fontFamily: T.fontSans, fontWeight: 500, cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <Icon name={ch.icon} size={18} />
              {ch.label}
            </button>
          ))}
        </div>

        <Field label="What happened?">
          <Textarea value={text} onChange={e => setText(e.target.value)}
                    placeholder="Write like you'd text a teammate. Names + sensitive details stay private to the team."
                    rows={8} autoFocus />
        </Field>

        <div style={{
          marginTop: 14, padding: '11px 13px',
          background: T.surfaceAlt, borderRadius: 10,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon name="sparkle" size={16} style={{ color: T.accent, marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
            <strong style={{ color: T.text, fontWeight: 600 }}>Auto-redact on print.</strong>
            {' '}When this note appears in printable reports, names, addresses, and other identifying details will be replaced with generic language. Your raw note stays in the app.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CaseDetailScreen, NewCaseScreen, AddNoteScreen });
