// Design tokens — Helper
// Linear/Notion-inspired, mobile-first, warm neutral

const T = {
  // surfaces
  bg:        '#fafaf9',      // app background (warm off-white)
  surface:   '#ffffff',      // cards
  surfaceAlt:'#f5f5f4',      // subtle fill / hover
  border:    '#e7e5e4',      // hairlines
  borderStrong: '#d6d3d1',

  // text
  text:      '#0c0a09',      // near-black
  textMuted: '#57534e',      // body secondary
  textFaint: '#a8a29e',      // captions, labels
  textInverse:'#fafaf9',

  // accent — restrained slate-indigo
  accent:    'oklch(0.42 0.08 257)',
  accentSoft:'oklch(0.96 0.012 257)',
  accentInk: 'oklch(0.32 0.08 257)',

  // semantics
  ok:        'oklch(0.52 0.10 155)',  // approved, disbursed
  okSoft:    'oklch(0.96 0.025 155)',
  warn:      'oklch(0.62 0.12 70)',   // pending team vote
  warnSoft:  'oklch(0.96 0.04 80)',
  deacon:    'oklch(0.50 0.13 295)',  // needs deacon approval
  deaconSoft:'oklch(0.96 0.025 295)',
  danger:    'oklch(0.55 0.15 27)',
  dangerSoft:'oklch(0.96 0.03 27)',
  redact:    '#1c1917',                // print redaction bar

  // type
  fontSans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, system-ui, sans-serif',
  fontDisp: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, system-ui, sans-serif',
  fontMono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',

  // shape
  radius:    10,
  radiusSm:  6,
  radiusLg:  14,

  // motion
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
};

// helper: status pill colors
const statusColors = {
  new:      { bg: T.accentSoft, fg: T.accentInk, dot: T.accent },
  active:   { bg: T.okSoft,     fg: T.ok,        dot: T.ok },
  ongoing:  { bg: '#fff7ed',    fg: '#9a3412',   dot: '#ea580c' },
  paused:   { bg: '#f5f5f4',    fg: '#57534e',   dot: '#a8a29e' },
  resolved: { bg: '#f5f5f4',    fg: '#78716c',   dot: '#a8a29e' },
};

const needTypeMeta = {
  rent:      { label: 'Rent',       glyph: 'R' },
  utilities: { label: 'Utilities',  glyph: 'U' },
  medical:   { label: 'Medical',    glyph: 'M' },
  food:      { label: 'Food',       glyph: 'F' },
  transport: { label: 'Transport',  glyph: 'T' },
  childcare: { label: 'Childcare',  glyph: 'C' },
  other:     { label: 'Other',      glyph: '•' },
};

const fmt = {
  money: (n) => n == null ? '—' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  moneyShort: (n) => {
    if (n == null) return '—';
    if (n >= 1000) return '$' + (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return '$' + n;
  },
  date: (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },
  dateFull: (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
  relative: (iso) => {
    const now = new Date('2026-05-21T12:00:00');
    const d = new Date(iso);
    const diff = Math.floor((now - d) / 86400000);
    if (diff < 1) {
      const hrs = Math.floor((now - d) / 3600000);
      if (hrs < 1) return 'just now';
      return hrs + 'h ago';
    }
    if (diff === 1) return 'yesterday';
    if (diff < 7) return diff + 'd ago';
    if (diff < 30) return Math.floor(diff/7) + 'w ago';
    return fmt.date(iso);
  },
  initials: (name) => name.split(/\s+/).map(p => p[0]).slice(0,2).join('').toUpperCase(),
};

Object.assign(window, { T, statusColors, needTypeMeta, fmt });
