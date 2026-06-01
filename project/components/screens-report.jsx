// Monthly report (in-app) + Print preview (AI-redacted)

function ReportScreen({ cases, onOpenPrint, onOpenCase }) {
  // gather everything for monthly meeting:
  // - deacon review items
  // - approved + disbursed this month
  // - new cases this month
  const meetingDate = '2026-06-02';
  const deaconItems = cases.flatMap(c =>
    c.requests.filter(r => r.status === 'deacon_review').map(r => ({ c, r }))
  );
  const newThisMonth = cases.filter(c => c.opened.startsWith('2026-05'));
  const teamApproved = cases.flatMap(c =>
    c.requests.filter(r => r.status === 'approved' && r.path === 'team').map(r => ({ c, r }))
  );
  const totalDeacon = deaconItems.reduce((s,x) => s + x.r.amount, 0);
  const totalTeamApproved = teamApproved.reduce((s,x) => s + x.r.amount, 0);
  const totalDisbursed = cases.reduce((s,c) => s + (c.amounts.disbursed || 0), 0);

  return (
    <div style={{ paddingBottom: 110 }}>
      <ScreenHeader title="Monthly report" subtitle="For deacon meeting · Jun 2, 2026" />

      {/* Print button */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          background: T.text, color: T.bg,
          borderRadius: 14, padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="redact" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Ready to print</div>
              <div style={{ fontSize: 12, color: 'rgba(250,250,249,0.6)', marginTop: 2, lineHeight: 1.4 }}>
                Names auto-redacted, notes AI-rewritten as generic summaries.
              </div>
            </div>
          </div>
          <Button variant="secondary" icon="print" onClick={onOpenPrint} fullWidth style={{
            marginTop: 14, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            Preview printable report
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ padding: '0 16px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <ReportStat label="Deacon decisions needed" value={fmt.money(totalDeacon)} sub={`${deaconItems.length} requests`} accent={T.deacon} />
        <ReportStat label="Team-approved" value={fmt.money(totalTeamApproved)} sub={`${teamApproved.length} requests`} accent={T.ok} />
        <ReportStat label="Disbursed YTD" value={fmt.money(totalDisbursed)} sub={`from $${(BUDGET.annual/1000)}k budget`} />
        <ReportStat label="New this month" value={newThisMonth.length} sub="cases opened" />
      </div>

      {/* Deacon decisions */}
      {deaconItems.length > 0 && (
        <>
          <SectionLabel style={{ paddingTop: 18 }}>
            For deacon approval ({deaconItems.length})
          </SectionLabel>
          <div style={{ padding: '0 16px' }}>
            {deaconItems.map(({ c, r }) => (
              <div key={c.id + r.id} onClick={() => onOpenCase(c.id)} style={{
                background: T.surface, border: '1px solid ' + T.border,
                borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textFaint, letterSpacing: 0.4 }}>{c.caseNumber}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: T.fontDisp, color: T.text, marginTop: 3, letterSpacing: -0.5 }}>
                      {fmt.money(r.amount)}
                    </div>
                  </div>
                  <RequestStatusPill status="deacon_review" />
                </div>
                <div style={{ fontSize: 13, color: T.textMuted, marginTop: 8, lineHeight: 1.4 }}>{r.purpose}</div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 10, paddingTop: 10, borderTop: '0.5px solid ' + T.border,
                }}>
                  <TypeChip type={c.type} />
                  <div style={{ fontSize: 12, color: T.textMuted }}>
                    Team: {r.votes.filter(v => v.vote === 'yes').length} yes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All active cases summary */}
      <SectionLabel style={{ paddingTop: 18 }}>All open cases</SectionLabel>
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: T.surface, border: '1px solid ' + T.border,
          borderRadius: 12, overflow: 'hidden',
        }}>
          {cases.filter(c => !['resolved'].includes(c.status)).map((c, i) => (
            <button key={c.id} onClick={() => onOpenCase(c.id)} style={{
              background: 'none', border: 'none', width: '100%',
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
              cursor: 'pointer', textAlign: 'left', fontFamily: T.fontSans,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textFaint, letterSpacing: 0.4 }}>{c.caseNumber}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginTop: 2 }}>
                  {needTypeMeta[c.type].label}
                  <span style={{ color: T.textFaint, fontWeight: 400 }}> · {c.amounts.requested ? fmt.money(c.amounts.requested) : 'no $ ask'}</span>
                </div>
              </div>
              <StatusPill status={c.status} size="sm" />
              <Icon name="chevronRight" size={14} style={{ color: T.textFaint }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportStat({ label, value, sub, accent }) {
  return (
    <div style={{
      background: T.surface, border: '1px solid ' + T.border,
      borderRadius: 12, padding: 12,
    }}>
      <div style={{
        fontSize: 10, color: T.textFaint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
      }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 700, fontFamily: T.fontDisp, letterSpacing: -0.6,
        color: accent || T.text, marginTop: 4, lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ─── Print preview ─────────────────────────────────────────
// AI-redacted version. Shows the "paper" with redacted bars + rewritten notes.

const REDACTED_REWRITES = {
  // map of raw note → AI-generic version (faked here)
  // We'll demonstrate AI rewrite on a few representative notes
};

function genericRewrite(text) {
  // Very lightweight rules-based "AI" — this is the prototype demo.
  // Real version would call an LLM.
  return text
    .replace(/\b([A-Z][a-z]+) (Alvarez|Bennett|Thornton|Okonkwo|Park|Williams|Khoury|Singh)\b/g, 'household member')
    .replace(/\b(Maria|Carlos|Sofia|Diego|James|Helen|Rebecca|Owen|Grace|Daniel|Hye-Jin|Joshua|Tasha|Mia|Jaylen|Layla|Sami|Arjun|Priya)\b/gi, '[member]')
    .replace(/\b(Mercy Hospital|St\. Joseph's|St\. Joseph's Hospital|Duke Energy|Piedmont Gas|Amazon|Brake & Tire on Glenwood|Target|Westside Pantry|PCA Job Network|PCA Education Network|Mercy)\b/gi, '[provider]')
    .replace(/\b(Pastor Mike)\b/gi, '[church staff]')
    .replace(/(\$[\d,]+\/night|\$[\d]+)/g, '$[amt]');
}

function PrintPreviewScreen({ cases, onBack }) {
  const [revealed, setRevealed] = React.useState(false);
  const meetingDate = '2026-06-02';
  const deaconItems = cases.flatMap(c =>
    c.requests.filter(r => r.status === 'deacon_review').map(r => ({ c, r }))
  );
  const allOpen = cases.filter(c => !['resolved'].includes(c.status));
  const totalDeacon = deaconItems.reduce((s,x) => s + x.r.amount, 0);

  // Redaction bar component
  const Bar = ({ w = 80 }) => (
    <span style={{
      display: 'inline-block', height: 12,
      width: w, background: T.redact, borderRadius: 2,
      verticalAlign: 'middle', margin: '0 1px',
    }} />
  );

  return (
    <div style={{ background: '#e7e5e4', minHeight: '100%', paddingBottom: 30 }}>
      <SheetHeader
        onBack={onBack}
        title="Print preview"
        subtitle="Redacted · safe to leave on table"
        rightAction={
          <button onClick={() => setRevealed(v => !v)} style={{
            background: 'none', border: 'none', color: T.accent,
            fontSize: 13, fontWeight: 500, padding: '6px 8px',
            cursor: 'pointer', fontFamily: T.fontSans,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name={revealed ? 'eyeOff' : 'eye'} size={14} />
            {revealed ? 'Hide' : 'Reveal'}
          </button>
        }
      />

      {/* Toggle banner */}
      <div style={{
        margin: '12px 12px 14px', padding: '11px 13px',
        background: revealed ? T.warnSoft : T.accentSoft,
        border: '1px solid ' + (revealed ? 'oklch(0.85 0.08 80)' : 'oklch(0.88 0.025 257)'),
        borderRadius: 10,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Icon name={revealed ? 'alert' : 'sparkle'} size={16}
              style={{ color: revealed ? '#b45309' : T.accent, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
          {revealed
            ? <><strong style={{ color: T.text }}>Preview only.</strong> Showing real names — for your reference. Print will always redact.</>
            : <><strong style={{ color: T.text }}>AI-redacted for printing.</strong> Names, addresses, and providers replaced. Notes rewritten as generic summaries.</>}
        </div>
      </div>

      {/* "Paper" */}
      <div style={{
        margin: '0 12px', background: '#fff', borderRadius: 4,
        boxShadow: '0 1px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12)',
        padding: '28px 24px', fontFamily: T.fontSans, color: '#1c1917',
      }}>
        {/* Letterhead */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottom: '2px solid #1c1917', paddingBottom: 12, marginBottom: 18,
        }}>
          <div>
            <div style={{
              fontFamily: T.fontDisp, fontSize: 16, fontWeight: 700,
              letterSpacing: -0.4, color: '#1c1917',
            }}>Trinity PCA — Benevolence</div>
            <div style={{ fontSize: 11, color: '#57534e', marginTop: 2 }}>
              Monthly report · Confidential
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#57534e' }}>
            <div>Prepared {fmt.dateFull('2026-05-21')}</div>
            <div>For meeting {fmt.dateFull(meetingDate)}</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{
          fontSize: 14, lineHeight: 1.55, color: '#1c1917',
          marginBottom: 22,
        }}>
          The benevolence team is currently supporting <strong>{allOpen.length} households</strong>.
          Total disbursed year-to-date: <strong>{fmt.money(BUDGET.ytdDisbursed)}</strong> of the {fmt.money(BUDGET.annual)} annual budget.
          {deaconItems.length > 0 && <> This month requires deacon approval on <strong>{deaconItems.length} requests</strong> totalling <strong>{fmt.money(totalDeacon)}</strong>.</>}
        </div>

        {/* Section: Deacon decisions */}
        {deaconItems.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              textTransform: 'uppercase', color: '#1c1917',
              borderBottom: '1px solid #1c1917', paddingBottom: 4, marginBottom: 12,
            }}>For deacon approval</div>
            {deaconItems.map(({ c, r }, idx) => (
              <div key={c.id + r.id} style={{
                marginBottom: 14, paddingBottom: 14,
                borderBottom: idx < deaconItems.length - 1 ? '1px dashed #d6d3d1' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: 11, color: '#57534e' }}>{c.caseNumber}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontDisp }}>{fmt.money(r.amount)}</div>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <strong>Need:</strong> {needTypeMeta[c.type].label} —{' '}
                  {revealed
                    ? c.household + ' household, ' + c.members.length + ' ' + (c.members.length === 1 ? 'person' : 'people')
                    : <>Household of {c.members.length} ({c.members.map(m => m.role.charAt(0)).join('/')})</>}
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  <strong>Purpose:</strong> {revealed ? r.purpose : genericRewrite(r.purpose)}
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: '#44403c' }}>
                  <strong>Context:</strong> {revealed ? c.summary : genericRewrite(c.summary)}
                </div>
                <div style={{
                  fontSize: 11, color: '#57534e', marginTop: 6,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>Team vote: {r.votes.filter(v => v.vote === 'yes').length} yes</span>
                  <span>Opened {fmt.dateFull(c.opened)}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Section: All open cases */}
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          textTransform: 'uppercase', color: '#1c1917',
          borderBottom: '1px solid #1c1917', paddingBottom: 4, marginBottom: 12, marginTop: 24,
        }}>All open cases</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d6d3d1' }}>
              <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: 600 }}>Case #</th>
              <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: 600 }}>Need</th>
              <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: 600 }}>HH size</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', fontWeight: 600 }}>Ask</th>
              <th style={{ textAlign: 'left', padding: '6px 4px', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allOpen.map(c => (
              <tr key={c.id} style={{ borderBottom: '0.5px solid #e7e5e4' }}>
                <td style={{ padding: '7px 4px', fontFamily: T.fontMono, fontSize: 11 }}>{c.caseNumber}</td>
                <td style={{ padding: '7px 4px' }}>{needTypeMeta[c.type].label}</td>
                <td style={{ padding: '7px 4px' }}>{c.members.length}</td>
                <td style={{ padding: '7px 4px', textAlign: 'right', fontFamily: T.fontMono, fontSize: 11 }}>
                  {c.amounts.requested ? fmt.money(c.amounts.requested) : '—'}
                </td>
                <td style={{ padding: '7px 4px', textTransform: 'capitalize', color: '#57534e' }}>
                  {c.status.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sample notes (showing redaction effect) */}
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          textTransform: 'uppercase', color: '#1c1917',
          borderBottom: '1px solid #1c1917', paddingBottom: 4, marginBottom: 12, marginTop: 24,
        }}>Recent activity (sample)</div>

        {deaconItems.slice(0, 2).map(({ c, r }) => {
          const note = c.notes[0];
          if (!note) return null;
          return (
            <div key={c.id} style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.55 }}>
              <div style={{ fontFamily: T.fontMono, color: '#57534e', fontSize: 11, marginBottom: 2 }}>
                {c.caseNumber} · {fmt.dateFull(note.date)} · {note.channel}
              </div>
              <div style={{ color: '#1c1917' }}>
                {revealed ? note.text : genericRewrite(note.text)}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{
          marginTop: 30, paddingTop: 12, borderTop: '1px solid #d6d3d1',
          fontSize: 10, color: '#78716c', lineHeight: 1.5, textAlign: 'center',
        }}>
          Confidential — for benevolence team & deacons only.<br/>
          Names and identifying details automatically redacted by Helper.<br/>
          Full case files are available in-app to authorized team members.
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '18px 16px', display: 'flex', gap: 8 }}>
        <Button variant="primary" size="lg" icon="print" fullWidth>Print</Button>
        <Button variant="secondary" size="lg" icon="download" style={{ width: 'auto' }}>PDF</Button>
      </div>
    </div>
  );
}

Object.assign(window, { ReportScreen, PrintPreviewScreen });
