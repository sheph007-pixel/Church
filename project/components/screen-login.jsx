// Login screen — passwordless email + PIN
// (Mocked auth; communicates "secure" with shield, redaction note)

function LoginScreen({ onLogin }) {
  const [step, setStep] = React.useState('email'); // email | pin
  const [email, setEmail] = React.useState('anna@trinitychurch.org');
  const [pin, setPin] = React.useState('');
  const [shake, setShake] = React.useState(false);

  const submitEmail = (e) => {
    e.preventDefault();
    if (email.includes('@')) setStep('pin');
  };
  const submitPin = (e) => {
    e.preventDefault();
    if (pin === '000000' || pin.length === 6) {
      onLogin();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div style={{
      height: '100%', background: T.bg,
      display: 'flex', flexDirection: 'column',
      paddingTop: 60,
    }}>
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13,
            background: T.text, color: T.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.fontDisp, fontSize: 26, fontWeight: 700,
            letterSpacing: -1, marginBottom: 22,
          }}>H</div>
          <div style={{
            fontFamily: T.fontDisp, fontSize: 32, fontWeight: 700,
            letterSpacing: -1, color: T.text, lineHeight: 1.05,
          }}>Helper</div>
          <div style={{
            fontSize: 14, color: T.textMuted, marginTop: 6, lineHeight: 1.4,
          }}>Benevolence team — Trinity PCA</div>
        </div>

        {step === 'email' && (
          <form onSubmit={submitEmail} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Church email">
              <Input value={email} onChange={e => setEmail(e.target.value)}
                     type="email" autoFocus placeholder="you@trinitychurch.org" />
            </Field>
            <Button variant="primary" size="lg" fullWidth onClick={submitEmail}>
              Send sign-in code
            </Button>
            <div style={{
              fontSize: 12, lineHeight: 1.5, color: T.textFaint,
              display: 'flex', gap: 8, padding: '12px 14px',
              background: T.surfaceAlt, borderRadius: 10,
            }}>
              <Icon name="shield" size={16} style={{ flexShrink: 0, color: T.textMuted, marginTop: 1 }} />
              <div>
                Approved team members only. Each sign-in is logged. We send a 6-digit code to your church email — no password to remember.
              </div>
            </div>
          </form>
        )}

        {step === 'pin' && (
          <form onSubmit={submitPin} style={{
            display: 'flex', flexDirection: 'column', gap: 18,
            animation: shake ? 'shake 360ms' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 15, color: T.text, fontWeight: 500 }}>
                Code sent to <span style={{ color: T.textMuted }}>{email}</span>
              </div>
              <button type="button" onClick={() => setStep('email')} style={{
                background: 'none', border: 'none', color: T.accent,
                fontSize: 13, padding: '6px 0 0', cursor: 'pointer',
              }}>Use a different email</button>
            </div>
            <Field label="6-digit code">
              <Input value={pin}
                     onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,6))}
                     autoFocus inputMode="numeric"
                     placeholder="••••••"
                     style={{
                       fontFamily: T.fontMono, fontSize: 22, letterSpacing: 12,
                       textAlign: 'center', padding: '14px 12px',
                     }} />
            </Field>
            <Button variant="primary" size="lg" fullWidth onClick={submitPin}
                    disabled={pin.length !== 6}>
              Sign in
            </Button>
            <div style={{
              fontSize: 12, color: T.textFaint, textAlign: 'center', marginTop: -6,
            }}>For this demo, any 6 digits work.</div>
          </form>
        )}
      </div>

      <div style={{
        padding: '0 28px 28px', fontSize: 11,
        color: T.textFaint, textAlign: 'center', lineHeight: 1.5,
      }}>
        Names of those we help never appear in printed reports. All page views are recorded in the audit log.
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
