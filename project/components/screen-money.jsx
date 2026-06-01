// New money request flow

function NewRequestScreen({ c, onBack, onSubmit }) {
  const [amount, setAmount] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [payee, setPayee] = React.useState('direct');

  const amt = parseFloat(amount) || 0;
  const overThreshold = amt > 1500;

  return (
    <div>
      <SheetHeader
        onBack={onBack}
        title="New money request"
        subtitle={c.caseNumber + ' · ' + c.household}
      />

      <div style={{ padding: '14px 20px 24px' }}>
        <Field label="Amount requested">
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: T.textFaint, fontSize: 22, fontWeight: 500,
            }}>$</div>
            <input value={amount}
                   onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g,''))}
                   inputMode="decimal" autoFocus placeholder="0"
                   style={{
                     ...inputStyle, paddingLeft: 28, height: 60,
                     fontSize: 32, fontFamily: T.fontDisp,
                     fontWeight: 700, letterSpacing: -0.8, color: T.text,
                   }} />
          </div>
        </Field>

        {/* Live approval path indicator */}
        <div style={{
          marginTop: 14, padding: '14px',
          background: overThreshold ? T.deaconSoft : (amt > 0 ? T.okSoft : T.surfaceAlt),
          border: '1px solid ' + (overThreshold ? 'oklch(0.86 0.04 295)' : amt > 0 ? 'oklch(0.86 0.04 155)' : T.border),
          borderRadius: 10,
          transition: 'all 200ms ' + T.ease,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: amt > 0 ? 8 : 0,
          }}>
            <Icon name={overThreshold ? 'flag' : amt > 0 ? 'check' : 'shield'}
                  size={18}
                  style={{ color: overThreshold ? T.deacon : amt > 0 ? T.ok : T.textMuted }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
              {overThreshold ? 'Deacon approval required' : amt > 0 ? 'Team can approve' : 'Approval path'}
            </div>
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
            {overThreshold
              ? <>Over $1,500 — this will appear on the next monthly meeting agenda (Jun&nbsp;2). The team will vote first, then deacons formally approve.</>
              : amt > 0
                ? <>Under $1,500 — the team can vote in GroupMe / here. Two yes votes from team leadership plus one more is enough to disburse.</>
                : <>$1,500 or under: team votes. Over $1,500: deacon meeting approves.</>}
          </div>
        </div>

        <div style={{ height: 18 }} />

        <Field label="What's it for?" hint="The team and deacons see this. Be specific.">
          <Textarea value={purpose} onChange={e => setPurpose(e.target.value)}
                    placeholder="e.g. May rent — paid directly to landlord" rows={3} />
        </Field>

        <div style={{ height: 18 }} />

        <SectionLabel style={{ padding: 0, marginBottom: 8 }}>Pay how</SectionLabel>
        <div style={{ background: T.surface, border: '1px solid ' + T.border, borderRadius: 10, overflow: 'hidden' }}>
          {[
            { id: 'direct',     label: 'Direct to provider', sub: 'Landlord, utility, hospital — our preference' },
            { id: 'reimburse',  label: 'Reimburse household', sub: 'They paid; we pay them back' },
            { id: 'card',       label: 'Gift card / grocery card', sub: 'Treasurer issues card' },
          ].map((opt, i) => (
            <button key={opt.id} onClick={() => setPayee(opt.id)} style={{
              background: 'none', border: 'none', width: '100%', padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              borderTop: i === 0 ? 'none' : '0.5px solid ' + T.border,
              fontFamily: T.fontSans, textAlign: 'left',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 99,
                border: '1.5px solid ' + (payee === opt.id ? T.text : T.borderStrong),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {payee === opt.id && <div style={{ width: 10, height: 10, borderRadius: 99, background: T.text }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{opt.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <Button variant="primary" size="lg" fullWidth icon="arrowRight"
                disabled={!amt || !purpose.trim()}
                onClick={() => onSubmit({ amount: amt, purpose, payee, path: overThreshold ? 'deacon' : 'team' })}>
          {overThreshold ? 'Submit for deacon review' : 'Submit for team vote'}
        </Button>
      </div>
    </div>
  );
}

window.NewRequestScreen = NewRequestScreen;
