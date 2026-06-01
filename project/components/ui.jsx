// Shared UI building blocks

// Status pill (case status)
const StatusPill = ({ status, size = 'md' }) => {
  const meta = {
    new:           { c: statusColors.new,      label: 'New' },
    active:        { c: statusColors.active,   label: 'Active' },
    ongoing:       { c: statusColors.ongoing,  label: 'Ongoing' },
    pending_team:  { c: statusColors.new,      label: 'Team voting' },
    paused:        { c: statusColors.paused,   label: 'Paused' },
    resolved:      { c: statusColors.resolved, label: 'Resolved' },
  }[status] || { c: statusColors.paused, label: status };
  const pad = size === 'sm' ? '2px 7px' : '3px 9px';
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: pad, borderRadius: 99, fontSize: fs, fontWeight: 500,
      background: meta.c.bg, color: meta.c.fg, letterSpacing: -0.1,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: meta.c.dot }} />
      {meta.label}
    </span>
  );
};

// Request status pill
const RequestStatusPill = ({ status }) => {
  const meta = {
    pending_team:  { bg: T.warnSoft,  fg: '#92400e', label: 'Team voting' },
    approved:      { bg: T.okSoft,    fg: '#166534', label: 'Approved' },
    deacon_review: { bg: T.deaconSoft,fg: '#5b21b6', label: 'Deacon review' },
    denied:        { bg: T.dangerSoft,fg: '#991b1b', label: 'Denied' },
    disbursed:     { bg: T.surfaceAlt,fg: T.textMuted, label: 'Disbursed' },
  }[status] || { bg: T.surfaceAlt, fg: T.textMuted, label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 99, fontSize: 12, fontWeight: 500,
      background: meta.bg, color: meta.fg, letterSpacing: -0.1,
    }}>{meta.label}</span>
  );
};

// Need-type chip
const TypeChip = ({ type }) => {
  const meta = needTypeMeta[type] || needTypeMeta.other;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 6px', borderRadius: 99,
      background: T.surfaceAlt, color: T.text, fontSize: 12, fontWeight: 500,
      border: '0.5px solid ' + T.border, letterSpacing: -0.1,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 99, background: T.text, color: T.bg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, fontFamily: T.fontMono,
      }}>{meta.glyph}</span>
      {meta.label}
    </span>
  );
};

// Avatar
const Avatar = ({ tm, size = 28, ring = false }) => {
  const member = TEAM.find(t => t.id === tm) || { initials: '?', color: '#999' };
  return (
    <div style={{
      width: size, height: size, borderRadius: 99,
      background: member.color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, letterSpacing: 0,
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px ${T.bg}, 0 0 0 3px ${member.color}` : 'none',
    }}>{member.initials}</div>
  );
};

// AvatarStack
const AvatarStack = ({ ids, size = 22 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
    {ids.map((id, i) => (
      <div key={id} style={{ marginLeft: i === 0 ? 0 : -8, position: 'relative', zIndex: 10 - i }}>
        <Avatar tm={id} size={size} ring />
      </div>
    ))}
  </div>
);

// Button — primary / secondary / ghost / danger
const Button = ({ variant = 'secondary', size = 'md', icon, children, onClick, disabled, fullWidth, style = {} }) => {
  const styles = {
    primary:   { bg: T.text,       fg: T.bg,         border: T.text },
    secondary: { bg: T.surface,    fg: T.text,       border: T.border },
    ghost:     { bg: 'transparent',fg: T.text,       border: 'transparent' },
    accent:    { bg: T.accent,     fg: '#fff',       border: T.accent },
    danger:    { bg: T.surface,    fg: T.danger,     border: T.border },
    ok:        { bg: T.ok,         fg: '#fff',       border: T.ok },
  }[variant];
  const sizes = {
    sm: { p: '6px 10px', fs: 13, h: 30, gap: 5 },
    md: { p: '9px 14px', fs: 14, h: 38, gap: 7 },
    lg: { p: '12px 18px', fs: 15, h: 46, gap: 8 },
  }[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sizes.gap, padding: sizes.p, height: sizes.h,
      background: styles.bg, color: styles.fg,
      border: '1px solid ' + styles.border, borderRadius: 8,
      fontSize: sizes.fs, fontFamily: T.fontSans, fontWeight: 500,
      letterSpacing: -0.1, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'transform 80ms ' + T.ease,
      WebkitTapHighlightColor: 'transparent',
      ...style,
    }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Field — label + input/select/textarea
const Field = ({ label, hint, children, error }) => (
  <label style={{ display: 'block' }}>
    {label && <div style={{
      fontSize: 12, fontWeight: 500, color: T.textMuted,
      marginBottom: 6, letterSpacing: 0.2, textTransform: 'uppercase',
    }}>{label}</div>}
    {children}
    {hint && !error && <div style={{ fontSize: 12, color: T.textFaint, marginTop: 5 }}>{hint}</div>}
    {error && <div style={{ fontSize: 12, color: T.danger, marginTop: 5 }}>{error}</div>}
  </label>
);

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: T.surface, color: T.text,
  border: '1px solid ' + T.border, borderRadius: 8,
  padding: '10px 12px', fontSize: 15, fontFamily: T.fontSans,
  outline: 'none', WebkitAppearance: 'none',
};

const Input = (props) => (
  <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />
);

const Textarea = (props) => (
  <textarea {...props} style={{ ...inputStyle, minHeight: 90, resize: 'vertical', ...(props.style || {}) }} />
);

const Select = ({ value, onChange, options, ...rest }) => (
  <div style={{ position: 'relative' }}>
    <select value={value} onChange={onChange} {...rest} style={{
      ...inputStyle, paddingRight: 34, appearance: 'none',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: T.textFaint }}>
      <Icon name="chevronDown" size={16} />
    </div>
  </div>
);

// Card — surface container w/ optional header
const Card = ({ title, action, children, padding = 16, style = {} }) => (
  <div style={{
    background: T.surface, border: '1px solid ' + T.border,
    borderRadius: T.radius, overflow: 'hidden', ...style,
  }}>
    {title && (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', borderBottom: '1px solid ' + T.border,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: -0.1 }}>{title}</div>
        {action}
      </div>
    )}
    <div style={{ padding }}>{children}</div>
  </div>
);

// Empty state
const Empty = ({ icon = 'folder', title, body, action }) => (
  <div style={{ textAlign: 'center', padding: '40px 24px', color: T.textMuted }}>
    <div style={{
      width: 44, height: 44, margin: '0 auto 14px',
      borderRadius: 99, background: T.surfaceAlt,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.textFaint,
    }}><Icon name={icon} size={20} /></div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>{title}</div>
    {body && <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{body}</div>}
    {action}
  </div>
);

// Bottom-sheet header (used by detail screens)
const SheetHeader = ({ onBack, title, rightAction, subtitle }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    background: T.bg + 'f0', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: '0.5px solid ' + T.border,
    padding: '8px 6px 8px 6px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    minHeight: 44,
  }}>
    <button onClick={onBack} style={{
      background: 'none', border: 'none', color: T.text,
      display: 'inline-flex', alignItems: 'center', gap: 2,
      fontSize: 15, fontFamily: T.fontSans, padding: '6px 8px',
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      <Icon name="chevronLeft" size={20} stroke={2} /> Back
    </button>
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: T.textFaint, marginTop: 1 }}>{subtitle}</div>}
    </div>
    <div style={{ minWidth: 60, display: 'flex', justifyContent: 'flex-end' }}>{rightAction}</div>
  </div>
);

// Big screen header — large title, used at top of tab roots
const ScreenHeader = ({ title, subtitle, right }) => (
  <div style={{ padding: '12px 16px 8px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{
          fontSize: 28, fontWeight: 700, fontFamily: T.fontDisp,
          color: T.text, letterSpacing: -0.7, lineHeight: 1.1,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  </div>
);

// Section label (small caps)
const SectionLabel = ({ children, action, style = {} }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '4px 16px 8px', ...style,
  }}>
    <div style={{
      fontSize: 11, fontWeight: 600, color: T.textFaint,
      letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{children}</div>
    {action}
  </div>
);

// Toast (lightweight)
const Toast = ({ msg, kind = 'ok', onDone }) => {
  React.useEffect(() => { if (msg) { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 110, transform: 'translateX(-50%)',
      background: T.text, color: T.bg, padding: '11px 16px', borderRadius: 99,
      fontSize: 13, fontWeight: 500, zIndex: 200,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      animation: 'toastIn 240ms ' + T.ease,
    }}>
      {kind === 'ok' && <Icon name="check" size={16} stroke={2.4} />}
      {msg}
    </div>
  );
};

Object.assign(window, {
  StatusPill, RequestStatusPill, TypeChip, Avatar, AvatarStack,
  Button, Field, Input, Textarea, Select, Card, Empty,
  SheetHeader, ScreenHeader, SectionLabel, Toast,
  inputStyle,
});
