// Tools — Report, Activity, Team, Print preview

function ReportView({ cases, onSelect, onPrint }) {
  const open = cases.filter(c => !['resolved'].includes(c.status));
  const newThisMonth = cases.filter(c => c.opened.startsWith('2026-05')).length;
  const closedRecently = cases.filter(c => c.status === 'resolved').length;
  const deaconNeeded = cases.filter(c => c.approvedBy === 'deacon_pending');

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Monthly report</h1>
          <div className="page-sub">For next deacon meeting · Jun 2, 2026</div>
        </div>
        <Btn variant="primary" icon="print" onClick={onPrint}>Print redacted report</Btn>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Open cases</div>
          <div className="stat-val">{open.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">New this month</div>
          <div className="stat-val">{newThisMonth}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Recently closed</div>
          <div className="stat-val">{closedRecently}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Need deacon vote</div>
          <div className="stat-val" style={{ color: deaconNeeded.length ? '#7c3aed' : '#a1a1aa' }}>
            {deaconNeeded.length}
          </div>
        </div>
      </div>

      {deaconNeeded.length > 0 && (
        <>
          <h2 className="section-h">For deacon approval</h2>
          <div className="rows">
            {deaconNeeded.map(c => (
              <button key={c.id} onClick={() => onSelect(c.id)} className="row">
                <div className="row-left">
                  <div className="row-num">{c.caseNumber}</div>
                  <AvStack ids={c.assigned} size={20} />
                </div>
                <div className="row-mid">
                  <div className="row-title">{c.household} household <StatusPill2 status={c.status} /></div>
                  <div className="row-preview">{c.summary}</div>
                </div>
                <div className="row-right">
                  <div className="row-type">{NEED_TYPES[c.type]}</div>
                  <div className="row-time" style={{ color: '#7c3aed', fontWeight: 500 }}>
                    {fmt2.money(c.pendingAmount)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <h2 className="section-h">All open cases ({open.length})</h2>
      <div className="rows">
        {open.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)} className="row">
            <div className="row-left">
              <div className="row-num">{c.caseNumber}</div>
              <AvStack ids={c.assigned} size={20} />
            </div>
            <div className="row-mid">
              <div className="row-title">{c.household} household <StatusPill2 status={c.status} /></div>
              <div className="row-preview">{c.summary}</div>
            </div>
            <div className="row-right">
              <div className="row-type">{NEED_TYPES[c.type]}</div>
              <div className="row-time">{fmt2.relative(c.lastActivity)}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Print preview ────────────────────────────────────────
function PrintPreview({ cases, onBack }) {
  const [reveal, setReveal] = React.useState(false);
  const open = cases.filter(c => !['resolved'].includes(c.status));
  const deaconNeeded = cases.filter(c => c.approvedBy === 'deacon_pending');

  // Bar component for redacted name
  const Bar = ({ w = 56 }) => (
    <span style={{
      display: 'inline-block', verticalAlign: '-2px', height: 10, width: w,
      background: '#18181b', borderRadius: 2, margin: '0 1px',
    }} />
  );
  const showName = (c) => reveal ? c.household : <Bar w={64} />;

  return (
    <div className="tool-view print-view">
      <div className="tool-head">
        <div>
          <button className="back-btn" onClick={onBack}>
            <Icon name="chevronLeft" size={16} stroke={1.8} /> Report
          </button>
          <h1 className="page-title" style={{ marginTop: 6 }}>Print preview</h1>
          <div className="page-sub">Names redacted · safe to leave on a table</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" icon={reveal ? 'eyeOff' : 'eye'} onClick={() => setReveal(v => !v)}>
            {reveal ? 'Hide names' : 'Reveal (preview only)'}
          </Btn>
          <Btn variant="primary" icon="print" onClick={() => window.print()}>Print</Btn>
        </div>
      </div>

      <div className={'paper ' + (reveal ? 'paper-reveal' : '')}>
        <header className="paper-head">
          <div>
            <div className="paper-org">Trinity PCA — Benevolence</div>
            <div className="paper-sub">Monthly report · Confidential</div>
          </div>
          <div className="paper-meta">
            <div>Prepared {fmt2.dateFull('2026-05-21')}</div>
            <div>For meeting Jun 2, 2026</div>
          </div>
        </header>

        <p className="paper-lead">
          The benevolence team is currently supporting <strong>{open.length} households</strong>.
          {deaconNeeded.length > 0 && <> This month, <strong>{deaconNeeded.length} requests</strong> need deacon approval, totaling <strong>{fmt2.money(deaconNeeded.reduce((s,c) => s + (c.pendingAmount || 0), 0))}</strong>.</>}
        </p>

        {deaconNeeded.length > 0 && (
          <section>
            <h3 className="paper-h">For deacon approval</h3>
            {deaconNeeded.map((c, i) => (
              <div key={c.id} className="paper-item">
                <div className="paper-item-head">
                  <span className="paper-case-num">{c.caseNumber}</span>
                  <span className="paper-amt">{fmt2.money(c.pendingAmount)}</span>
                </div>
                <div className="paper-item-line">
                  <strong>Household:</strong> {showName(c)} ({NEED_TYPES[c.type]})
                </div>
                <div className="paper-item-line">
                  <strong>Context:</strong> {reveal ? c.summary : redact(c.summary)}
                </div>
              </div>
            ))}
          </section>
        )}

        <section>
          <h3 className="paper-h">All open cases</h3>
          <table className="paper-table">
            <thead>
              <tr>
                <th>Case #</th>
                <th>Household</th>
                <th>Need</th>
                <th>Status</th>
                <th>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {open.map(c => (
                <tr key={c.id}>
                  <td className="mono">{c.caseNumber}</td>
                  <td>{showName(c)}</td>
                  <td>{NEED_TYPES[c.type]}</td>
                  <td>{STATUSES[c.status].label}</td>
                  <td>{fmt2.dateFull(c.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="paper-h">Recent notes (sampled)</h3>
          {open.slice(0, 3).map(c => {
            const n = c.notes[0];
            if (!n) return null;
            return (
              <div key={c.id} className="paper-note">
                <div className="paper-note-meta">
                  {c.caseNumber} · {fmt2.dateFull(n.date)}
                </div>
                <div>{reveal ? n.text : redact(n.text)}</div>
              </div>
            );
          })}
        </section>

        <footer className="paper-foot">
          Confidential — for benevolence team & deacons only.<br/>
          Names and identifying details auto-redacted by Helper.
        </footer>
      </div>
    </div>
  );
}

// ─── Activity ─────────────────────────────────────────────
function ActivityView({ cases }) {
  // synthesize an activity stream from cases
  const events = [];
  cases.forEach(c => {
    c.notes.forEach(n => events.push({
      kind: 'note', date: n.date, who: n.author, case: c, text: n.text.slice(0, 80) + (n.text.length > 80 ? '…' : '')
    }));
    if (c.status === 'new') events.push({
      kind: 'open', date: c.opened + 'T09:00:00', who: c.assigned[0], case: c, text: 'opened case'
    });
  });
  events.sort((a,b) => new Date(b.date) - new Date(a.date));

  // group by date
  const byDate = events.reduce((acc, e) => {
    const d = e.date.slice(0,10);
    acc[d] = acc[d] || [];
    acc[d].push(e);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Activity</h1>
          <div className="page-sub">Every change is recorded. Team leads can see this log.</div>
        </div>
      </div>

      {dates.map(d => (
        <div key={d} className="activity-day">
          <div className="section-label">{fmt2.dateFull(d + 'T00:00:00')}</div>
          <div className="activity-list">
            {byDate[d].map((e, i) => {
              const who = TEAM.find(t => t.id === e.who);
              return (
                <div key={i} className="activity-row">
                  <Av tm={e.who} size={26} />
                  <div className="activity-body">
                    <div className="activity-line">
                      <strong>{who.name.split(' ')[0]}</strong>{' '}
                      <span style={{ color: '#71717a' }}>
                        {e.kind === 'note' ? 'added a note on' : 'opened'}
                      </span>{' '}
                      <span className="mono">{e.case.caseNumber}</span>
                    </div>
                    <div className="activity-text">{e.text}</div>
                  </div>
                  <div className="activity-time">
                    {new Date(e.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Team ────────────────────────────────────────────────
function TeamView() {
  return (
    <div className="tool-view">
      <div className="tool-head">
        <div>
          <h1 className="page-title">Team</h1>
          <div className="page-sub">{TEAM.length} members · everyone can see all cases</div>
        </div>
        <Btn variant="secondary" icon="plus">Invite member</Btn>
      </div>
      <div className="team-grid">
        {TEAM.map(m => (
          <div key={m.id} className="team-card">
            <Av tm={m.id} size={44} />
            <div>
              <div className="team-name">
                {m.name}{m.id === ME_ID && <span className="team-you"> (you)</span>}
              </div>
              <div className="team-role">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ReportView, PrintPreview, ActivityView, TeamView });
