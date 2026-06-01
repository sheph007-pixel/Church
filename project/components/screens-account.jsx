// Me tab — profile, settings, audit log, team roster

function MeScreen({ cases, onOpenCase, onOpenSettings, onOpenAudit, onOpenTeam, onSignOut }) {
  const me = TEAM.find(t => t.id === ME_ID);
  const myCases = cases.filter(c => c.assigned.includes(ME_ID));
  const myActive = myCases.filter(c => !['resolved','paused'].includes(c.status));
  const myDisbursed = cases
    .filter(c => c.assigned.includes(ME_ID))
    .reduce((s,c) => s + (c.amounts.disbursed || 0), 0);
  const myVotes = cases.flatMap(c => c.requests).flatMap(r => r.votes).filter(v => v.tm === ME_ID).length;

  return (
    <div style={{ paddingBottom: 110 }}>
      <ScreenHeader title="Me" />

      {/* Profile card */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          background: T.surface, border: '1px solid ' + T.border,
          borderRadius: 14, padding: 18,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Avatar tm={ME_ID} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontDisp, color: T.text, letterSpacing: -0.4 }}>
              {me.name}
            </div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{me.role} · Benevolence team</div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div style={{ padding: '0 16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <ReportStat label="Active cases" value={myActive.length} sub="assigned to me" />
        <ReportStat label="My votes" value={myVotes} sub="this year" />
        <ReportStat label="Cases touched $" value={fmt.moneyShort(myDisbursed)} sub="disbursed" />
      </div>

      {/* My cases */}
      <SectionLabel>My cases ({myCases.length})</SectionLabel>
      <div style={{ padding: '0 16px' }}>
        {myCases.length === 0
          ? <Empty icon="folder" title="No assignments yet" />
          : myCases.map(c => <CaseRow key={c.id} c={c} onClick={() => onOpenCase(c.id)} />)
        }
      </div>

      {/* Menu */}
      <SectionLabel style={{ paddingTop: 18 }}>App</SectionLabel>
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: T.surface, border: '1px solid ' + T.border,
          borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { id: 'team',     icon: 'users',    label: 'Team roster',    onClick: onOpenTeam },
            { id: 'audit',    icon: 'history',  label: 'Activity & audit log', onClick: onOpenAudit },
            { id: 'settings', icon: 'settings', label: 'Settings & privacy', onClick: onOpenSettings },
            { id: 'signout',  icon: 'logOut',   label: 'Sign out', onClick: onSignOut, danger: true },
          ].map((item, i) => (
            <button key={item.id} onClick={item.onClick} style={{
              background: 'none', border: 'none', width: '100%',
              padding: '13px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
              cursor: 'pointer', textAlign: 'left', fontFamily: T.fontSans,
              color: item.danger ? T.danger : T.text,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <Icon name={item.icon} size={18} style={{ color: item.danger ? T.danger : T.textMuted }} />
              <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.label}</span>
              <Icon name="chevronRight" size={14} style={{ color: T.textFaint }} />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '24px 24px 0', fontSize: 11, color: T.textFaint,
        textAlign: 'center', lineHeight: 1.5,
      }}>
        Helper v0.4 · Trinity PCA<br/>
        Built for our team. Confidential by default.
      </div>
    </div>
  );
}

// Team roster
function TeamScreen({ onBack }) {
  return (
    <div>
      <SheetHeader onBack={onBack} title="Team roster" />
      <div style={{ padding: '14px 16px 30px' }}>
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 12, lineHeight: 1.5 }}>
          {TEAM.length} members. Everyone can see all cases. Only the treasurer can mark disbursements.
        </div>
        <div style={{ background: T.surface, border: '1px solid ' + T.border, borderRadius: 12, overflow: 'hidden' }}>
          {TEAM.map((m, i) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
            }}>
              <Avatar tm={m.id} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                  {m.name}{m.id === ME_ID && <span style={{ color: T.textFaint, fontWeight: 400 }}> (you)</span>}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{m.role}</div>
              </div>
              {m.role === 'Team Lead' && (
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
                  background: T.surfaceAlt, color: T.textMuted, padding: '3px 8px', borderRadius: 99,
                }}>Lead</span>
              )}
              {m.role === 'Treasurer' && (
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
                  background: T.okSoft, color: '#166534', padding: '3px 8px', borderRadius: 99,
                }}>Treasurer</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Audit log
function AuditScreen({ onBack }) {
  // group by date
  const byDate = AUDIT.reduce((acc, a) => {
    const d = a.at.slice(0,10);
    acc[d] = acc[d] || [];
    acc[d].push(a);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div>
      <SheetHeader onBack={onBack} title="Activity log" subtitle="Who did what, and when" />
      <div style={{ padding: '14px 16px 30px' }}>
        <div style={{
          padding: '11px 13px', background: T.accentSoft,
          border: '1px solid oklch(0.88 0.025 257)', borderRadius: 10,
          fontSize: 12, color: T.text, lineHeight: 1.5, marginBottom: 18,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon name="shield" size={16} style={{ color: T.accent, marginTop: 1, flexShrink: 0 }} />
          <div>
            <strong style={{ fontWeight: 600 }}>Every action is recorded.</strong> Sign-ins, page views, votes, notes, file uploads, prints. Only team leads can see this log.
          </div>
        </div>

        {dates.map(d => (
          <div key={d} style={{ marginBottom: 22 }}>
            <SectionLabel style={{ padding: '0 0 8px' }}>
              {fmt.dateFull(d + 'T00:00:00')}
            </SectionLabel>
            <div style={{ background: T.surface, border: '1px solid ' + T.border, borderRadius: 12, overflow: 'hidden' }}>
              {byDate[d].sort((a,b) => b.at.localeCompare(a.at)).map((a, i) => {
                const who = TEAM.find(t => t.id === a.who);
                return (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 12px',
                    borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
                  }}>
                    <Avatar tm={a.who} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.4 }}>
                        <strong style={{ fontWeight: 600 }}>{who.name.split(' ')[0]}</strong> {a.action}
                        {a.target !== '—' && (
                          <> on <span style={{ fontFamily: T.fontMono, fontSize: 12 }}>{a.target}</span></>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{a.detail}</div>
                    </div>
                    <div style={{
                      fontSize: 11, color: T.textFaint,
                      fontFamily: T.fontMono, whiteSpace: 'nowrap',
                    }}>{new Date(a.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings
function SettingsScreen({ onBack }) {
  const [autoRedact, setAutoRedact] = React.useState(true);
  const [rewriteNotes, setRewriteNotes] = React.useState(true);
  const [notif, setNotif] = React.useState({ newCase: true, newRequest: true, votes: false });

  return (
    <div>
      <SheetHeader onBack={onBack} title="Settings & privacy" />
      <div style={{ padding: '14px 16px 30px' }}>

        <SectionLabel style={{ padding: '0 0 8px' }}>Printing</SectionLabel>
        <SettingsGroup>
          <SettingRow
            label="Auto-redact names on print"
            sub="Replace household members' names with case # and initials."
            value={autoRedact} onChange={setAutoRedact}
          />
          <SettingRow
            label="AI rewrite notes to generic"
            sub="Notes printed for deacons are rewritten to remove identifying details."
            value={rewriteNotes} onChange={setRewriteNotes}
          />
        </SettingsGroup>

        <SectionLabel style={{ padding: '16px 0 8px' }}>Notifications</SectionLabel>
        <SettingsGroup>
          <SettingRow label="New case created" value={notif.newCase} onChange={v => setNotif(n => ({ ...n, newCase: v }))} />
          <SettingRow label="New money request" value={notif.newRequest} onChange={v => setNotif(n => ({ ...n, newRequest: v }))} />
          <SettingRow label="Team votes (every one)" value={notif.votes} onChange={v => setNotif(n => ({ ...n, votes: v }))} />
        </SettingsGroup>

        <SectionLabel style={{ padding: '16px 0 8px' }}>Account</SectionLabel>
        <SettingsGroup>
          <SettingsLink label="Approval threshold" hint="$1,500 — set by team lead" />
          <SettingsLink label="Two-factor authentication" hint="On" />
          <SettingsLink label="Data export" hint="Download all my activity" />
        </SettingsGroup>

        <SectionLabel style={{ padding: '16px 0 8px' }}>About</SectionLabel>
        <div style={{
          padding: 14, background: T.surface, border: '1px solid ' + T.border, borderRadius: 12,
          fontSize: 12, color: T.textMuted, lineHeight: 1.6,
        }}>
          <p style={{ margin: 0 }}>Helper is built privately for Trinity PCA's benevolence team. No data leaves the church's account. AI redaction runs on the church's own keys; no household identities are sent to third-party services without consent.</p>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ children }) {
  return (
    <div style={{ background: T.surface, border: '1px solid ' + T.border, borderRadius: 12, overflow: 'hidden' }}>
      {React.Children.toArray(children).map((c, i, arr) =>
        React.cloneElement(c, { __first: i === 0, key: i })
      )}
    </div>
  );
}

function SettingRow({ label, sub, value, onChange, __first }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderTop: __first ? 'none' : '0.5px solid ' + T.border,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 26, borderRadius: 99,
        background: value ? T.ok : T.borderStrong,
        border: 'none', position: 'relative', cursor: 'pointer',
        transition: 'background 200ms ' + T.ease,
        WebkitTapHighlightColor: 'transparent', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: value ? 20 : 2,
          width: 22, height: 22, borderRadius: 99, background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transition: 'left 200ms ' + T.ease,
        }} />
      </button>
    </div>
  );
}

function SettingsLink({ label, hint, __first }) {
  return (
    <button style={{
      background: 'none', border: 'none', width: '100%',
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      borderTop: __first ? 'none' : '0.5px solid ' + T.border,
      fontFamily: T.fontSans, textAlign: 'left',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{hint}</div>}
      </div>
      <Icon name="chevronRight" size={14} style={{ color: T.textFaint }} />
    </button>
  );
}

Object.assign(window, { MeScreen, TeamScreen, AuditScreen, SettingsScreen });
