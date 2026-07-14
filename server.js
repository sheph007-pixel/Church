const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json({ limit: '5mb' }));
// public/ is 100% app source (index.html + the .jsx files, no images/fonts) that
// changes on every deploy. Force every request to revalidate with the server
// (Cache-Control: no-cache) rather than letting browsers apply heuristic freshness
// and silently keep serving a pre-deploy copy after a reload. ETag/Last-Modified
// stay on, so an unchanged file still comes back as a cheap 304.
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache'),
}));

// Build/version info. BOOT_TIME ≈ the deploy time (the process restarts on each
// deploy), so the footer can show an accurate "updated" date + time automatically.
const APP_VERSION = 'v2.1';
const BOOT_TIME = new Date().toISOString();
app.get('/api/version', (req, res) => res.json({ version: APP_VERSION, deployedAt: BOOT_TIME }));

// PostgreSQL state persistence
const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}) : null;

if (pool) {
  pool.query(`CREATE TABLE IF NOT EXISTS app_state (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    state JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`)
    .then(() => reconcileData())
    .catch(e => console.error('DB init:', e.message));
}

// ── Automatic data reconciliation (runs once per DATA_VERSION on boot) ──────
// The live case/team data was originally reconstructed from a hard-to-read PDF
// and had wrong years, missing cases, and missing past-deacon authors. When this
// version of the code deploys, overwrite the live cases + team from the
// authoritative seed (preserving the activity log). Version-gated so it runs only
// once and never fights later edits. The marker lives in its own row so the
// client's {cases,team,events} autosave can't clobber it.
const DATA_VERSION = 4;
async function reconcileData() {
  if (!pool) return;
  try {
    const meta = await pool.query("SELECT state FROM app_state WHERE id = 'datamigration'");
    const applied = meta.rows[0] && meta.rows[0].state ? (meta.rows[0].state.version || 0) : 0;
    if (applied >= DATA_VERSION) return;

    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (rows[0] && rows[0].state) {
      const { TEAM, CASES } = require('./scripts/seed.js');
      const state = JSON.parse(JSON.stringify(rows[0].state));

      if (applied < 2) {
        // First reconcile: authoritative team + cases (only on un-reconciled DBs).
        state.team = TEAM;
        state.cases = CASES;
      }
      if (applied < 3) {
        // Remove auto-generated (seeded) tasks — ids prefixed 't_'. Deacon-added
        // tasks (id 't<timestamp>', no underscore) and everything else are kept.
        (state.cases || []).forEach(c => {
          if (Array.isArray(c.tasks)) c.tasks = c.tasks.filter(t => !/^t_/.test(t.id || ''));
        });
      }
      if (applied < 4) {
        // Re-attribute earlier GroupMe-sync notes: they were saved under the admin
        // with a "Deacon Name — " prefix. Attribute to the deacon and strip the prefix.
        const byName = {};
        TEAM.forEach(t => { byName[(t.name || '').toLowerCase()] = t.id; });
        (state.cases || []).forEach(c => (c.notes || []).forEach(n => {
          if (n.source !== 'groupme' || typeof n.text !== 'string') return;
          const m = n.text.match(/^(.+?)\s+—\s+([\s\S]+)$/);
          if (m && byName[m[1].trim().toLowerCase()]) { n.author = byName[m[1].trim().toLowerCase()]; n.text = m[2].trim(); }
        }));
      }

      await pool.query(
        `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
         ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
        [state]
      );
      console.log(`Data reconcile -> v${DATA_VERSION} applied (was v${applied}).`);
    }
    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('datamigration', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [{ version: DATA_VERSION }]
    );
  } catch (e) {
    console.error('Data reconcile error:', e.message);
  }
}

app.get('/api/state', async (req, res) => {
  if (!pool) return res.json({ state: null });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    res.json({ state: rows[0] ? rows[0].state : null });
  } catch (e) {
    console.error('DB read error:', e.message);
    res.json({ state: null });
  }
});

// Minimal roster (deacons only) for the login screen — lets any deacon be
// matched by email before sign-in WITHOUT exposing confidential case data.
app.get('/api/roster', async (req, res) => {
  if (!pool) return res.json({ team: [] });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    const team = rows[0] && rows[0].state && Array.isArray(rows[0].state.team) ? rows[0].state.team : [];
    res.json({ team });
  } catch (e) {
    console.error('Roster read error:', e.message);
    res.json({ team: [] });
  }
});

app.post('/api/state', async (req, res) => {
  if (!pool) return res.json({ ok: false });
  try {
    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [req.body]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('DB write error:', e.message);
    res.status(500).json({ ok: false });
  }
});

// ONE-TIME SEED — always overwrites so it works even if empty state was saved first
app.get('/api/seed', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database configured' });
  try {
    const { STATE } = require('./scripts/seed.js');
    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [STATE]
    );
    res.json({ ok: true, cases: STATE.cases.length, team: STATE.team.length });
  } catch (e) {
    console.error('Seed error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Manual trigger for the data reconcile (normally runs automatically on boot).
// Clears the version marker and re-applies, overwriting live cases + team from
// the authoritative seed while preserving the activity log.
app.get('/api/reseed-data', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database configured' });
  try {
    await pool.query("DELETE FROM app_state WHERE id = 'datamigration'");
    await reconcileData();
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    const state = rows[0] ? rows[0].state : null;
    res.json({
      ok: true,
      version: DATA_VERSION,
      cases: state ? state.cases.length : 0,
      team: state ? state.team.length : 0,
    });
  } catch (e) {
    console.error('Reseed-data error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Targeted patch — updates only the 4 affected cases directly in Postgres
app.get('/api/patch-v2', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB — seed first via /api/seed' });

    const state = JSON.parse(JSON.stringify(rows[0].state));
    const changes = [];

    // ── Fix 1: Amanda Jones 25-002 — remove Blue Lake, add septic detail ─
    const amanda = state.cases.find(c => c.caseNumber === '25-002');
    if (amanda) {
      const note = amanda.notes.find(n => n.id === 'n_25002_1');
      if (note) {
        note.text = 'Septic system repairs completed: $1,673 approved March 31 (pump-out $631 + mini excavator rental $850 + mower repair by Keith Belcher $192). Issue was inherited from the home purchase roughly a year ago. Amanda continues to show a sweet spirit and gratitude. Care team following up on health insurance renewal and overall stability.';
        note.date = '2025-04-16T12:00:00.000Z';
        changes.push('Fixed 25-002 Amanda Jones — April note now describes septic repairs');
      }
      const task = amanda.tasks.find(t => t.id === 't_25002_1');
      if (task) {
        task.text = 'Follow up with Amanda — health insurance renewal and overall stability check';
        changes.push('Fixed 25-002 Amanda Jones task text');
      }
    }

    // ── Fix 2: Add 25-005 — Confidential couple (Covenant KC) ────────────
    if (!state.cases.find(c => c.caseNumber === '25-005')) {
      state.cases.push({
        id: 'c_25005', caseNumber: '25-005',
        name: 'Confidential couple (Covenant KC)',
        status: 'active', opened: '2025-05-13',
        lastActivity: '2025-05-13T12:00:00.000Z',
        contacts: [],
        careTeam: [{ id: 'ct_25005_1', name: 'Derek Cavin', role: 'Referring Deacon' }],
        tasks: [{ id: 't_25005_1', text: 'Follow up on counseling progress at Blue Lake (Melea Stephens)', done: false, assignee: 'tm_dc' }],
        notes: [{ id: 'n_25005_1', author: 'tm_dc', date: '2025-05-13T12:00:00.000Z',
          text: "Referred via their elder, Covenant KC. Approved $1,500 for approximately 9-10 marriage counseling sessions with Melea Stephens at Blue Lake Christian Clinic. First round of counseling for this couple. Sent to full diaconate for final approval. Names kept confidential." }],
        files: [],
      });
      changes.push('Added 25-005: Confidential couple (Covenant KC)');
    }

    // ── Fix 3: Add 25-006 — Confidential, counseling (Exodus KC) ─────────
    if (!state.cases.find(c => c.caseNumber === '25-006')) {
      state.cases.push({
        id: 'c_25006', caseNumber: '25-006',
        name: 'Confidential, counseling (Exodus KC)',
        status: 'completed', opened: '2025-08-15',
        lastActivity: '2025-08-15T12:00:00.000Z',
        contacts: [], careTeam: [], tasks: [],
        notes: [{ id: 'n_25006_1', author: 'tm10', date: '2025-08-15T12:00:00.000Z',
          text: "Referred via Martin. Member in Exodus KC with significant health issues and a need for ongoing counseling, savings exhausted on prior medical and counseling bills. Approved up to $2,000 church portion, with the member covering roughly 25% of total cost. One-time approval, no further activity on record. Distinct from case 24-004." }],
        files: [],
      });
      changes.push('Added 25-006: Confidential, counseling (Exodus KC)');
    }

    // ── Fix 4: Patrice Smiley 24-001 — correct rental math + add May 29 ──
    const patrice = state.cases.find(c => c.caseNumber === '24-001');
    if (patrice) {
      const note1 = patrice.notes.find(n => n.id === 'n_24001_1');
      if (note1) {
        note1.text = 'Approved $250 for a second week of car rental (running total now $1,000: $500 deposit + $250 first week + $250 second week). Van still in shop following the March alternator and power steering pump replacement. Patrice has been without her own vehicle for several weeks.';
        changes.push('Fixed 24-001 Patrice Smiley — May 14 note corrects rental math');
      }
      if (!patrice.notes.find(n => n.id === 'n_24001_0')) {
        patrice.notes.unshift({
          id: 'n_24001_0', author: 'tm_dc', date: '2025-05-29T12:00:00.000Z',
          text: 'Approved $350 for a final rental week — flagged as the last rental request. Van repair should be completed soon. Total rental outlay: ~$1,350 gross ($500 refundable deposit + three weekly rentals of $250, $250, and $350). Net cost roughly $850 assuming the deposit is returned.',
        });
        changes.push('Added 24-001 Patrice Smiley — May 29 note ($350 final rental)');
      }
      patrice.lastActivity = '2025-05-29T12:00:00.000Z';
    }

    // Write corrected state back to Postgres
    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    res.json({
      ok: true,
      changes,
      totalCases: state.cases.length,
      cases: state.cases.map(c => ({
        caseNumber: c.caseNumber,
        name: c.name,
        status: c.status,
        notes: c.notes.length,
      })),
    });
  } catch (e) {
    console.error('Patch-v2 error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Patch v8 — fill in deacon emails from the Faith PCA deacons email list.
// Matches existing team members by id (with a name fallback) and only fills
// emails that are currently empty, so it is safe to run repeatedly.
app.get('/api/patch-v8', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB — seed first via /api/seed' });

    const state = JSON.parse(JSON.stringify(rows[0].state));

    // Email by stable team id (primary match)
    const byId = {
      tm10:  'hunter@kennion.com',
      tm_ts: 'tsmith24@hotmail.com',
      tm_ca: 'chasealdridge3@gmail.com',
      tm_dc: 'derekcavin@gmail.com',
      tm_js: 'jpshank2@gmail.com',
      tm_jh: 'josiahhelms7@gmail.com',
      tm_kc: 'kcooke@esri.com',
      tm_rs: 'randal@truelightbranding.com',
      tm_wy: 'jwyoungblood800@gmail.com',
    };
    // Email by normalized name (fallback if ids differ in the live DB)
    const byName = {
      'hunter shepherd': 'hunter@kennion.com',
      'timothy smith':   'tsmith24@hotmail.com',
      'tim smith':       'tsmith24@hotmail.com',
      'chase aldridge':  'chasealdridge3@gmail.com',
      'derek cavin':     'derekcavin@gmail.com',
      'jeremy shank':    'jpshank2@gmail.com',
      'josiah helms':    'josiahhelms7@gmail.com',
      'keith cooke':     'kcooke@esri.com',
      'randal snook':    'randal@truelightbranding.com',
      'watkins y':         'jwyoungblood800@gmail.com',
      'watkins youngblood':'jwyoungblood800@gmail.com',
    };

    const changes = [];
    const unmatched = [];
    (state.team || []).forEach(d => {
      const email = byId[d.id] || byName[(d.name || '').trim().toLowerCase()];
      if (!email) { unmatched.push(d.name); return; }
      if (d.email === email) return; // already set
      d.email = email;
      changes.push(`${d.name} → ${email}`);
    });

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    res.json({
      ok: true,
      changes,
      unmatched,
      team: (state.team || []).map(d => ({ id: d.id, name: d.name, email: d.email })),
    });
  } catch (e) {
    console.error('Patch-v8 error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Patch v3 — fix 25-006 date (2026→2025) + correct Amanda Jones description
app.get('/api/patch-v3', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB' });

    const state = JSON.parse(JSON.stringify(rows[0].state));
    const changes = [];

    // Fix 1: 25-006 — force all dates to 2025-08-15
    const c25006 = state.cases.find(c => c.caseNumber === '25-006');
    if (c25006) {
      c25006.opened = '2025-08-15';
      c25006.lastActivity = '2025-08-15T12:00:00.000Z';
      c25006.notes.forEach(n => { n.date = '2025-08-15T12:00:00.000Z'; });
      changes.push('Fixed 25-006 dates → 2025-08-15');
    }

    // Fix 2: 25-002 Amanda Jones — replace April 16 note with accurate description
    const amanda = state.cases.find(c => c.caseNumber === '25-002');
    if (amanda) {
      const note = amanda.notes.find(n => n.id === 'n_25002_1');
      if (note) {
        note.text = 'Single mom, two kids, regular attending member. Care team: Randal Snook, Amber Peterson, Keith Belcher. Approved $1,405 health insurance premium plus $300 Walmart gift card (Mar 26). Septic work approved across Mar 31 and Apr 16: pump-out $631, mini excavator access $850, mower repair $192, totaling $1,673.';
        changes.push('Updated Amanda Jones (25-002) April 16 note with accurate description');
      }
    }

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    // Return verification data sorted by lastActivity so user can confirm sort order
    const sorted = [...state.cases].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    res.json({
      ok: true,
      changes,
      totalCases: state.cases.length,
      sortedByActivity: sorted.map(c => ({
        caseNumber: c.caseNumber,
        name: c.name,
        status: c.status,
        lastActivity: c.lastActivity,
      })),
    });
  } catch (e) {
    console.error('Patch-v3 error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Patch v4 — fix 25-006 opened date (date-only string → UTC noon timestamp)
app.get('/api/patch-v4', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB' });

    const state = JSON.parse(JSON.stringify(rows[0].state));
    const c = state.cases.find(c => c.caseNumber === '25-006');
    if (!c) return res.status(404).json({ error: '25-006 not found' });

    c.opened = '2025-08-15T12:00:00.000Z';
    c.lastActivity = '2025-08-15T12:00:00.000Z';
    c.notes.forEach(n => { n.date = '2025-08-15T12:00:00.000Z'; });

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    res.json({
      ok: true,
      fixed: { caseNumber: c.caseNumber, name: c.name, opened: c.opened, lastActivity: c.lastActivity },
      totalCases: state.cases.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Patch v7 — combined: fix 25-006 date + rename all cases to 4-digit numbers
app.get('/api/patch-v7', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB' });

    const state = JSON.parse(JSON.stringify(rows[0].state));

    // Fix 25-006 date (2026 → 2025)
    const c006 = state.cases.find(c => c.id === 'c_25006' || c.caseNumber === '25-006' || c.caseNumber === '3491');
    if (c006) {
      c006.opened = '2025-08-15T12:00:00.000Z';
      c006.lastActivity = '2025-08-15T12:00:00.000Z';
      c006.notes.forEach(n => { n.date = '2025-08-15T12:00:00.000Z'; });
    }

    // Rename all cases to 4-digit numbers
    const numMap = {
      'c_24001': '4821', 'c_24002': '7354', 'c_24003': '2967',
      'c_24004': '5138', 'c_24005': '8413', 'c_24006': '3756',
      'c_25001': '6290', 'c_25002': '1847', 'c_25003': '9053',
      'c_25004': '4612', 'c_25005': '7825', 'c_25006': '3491',
    };
    state.cases.forEach(c => { if (numMap[c.id]) c.caseNumber = numMap[c.id]; });
    delete state.caseCounter;

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    const sorted = [...state.cases].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    res.json({
      ok: true,
      sortedByActivity: sorted.map(c => ({ caseNumber: c.caseNumber, name: c.name, lastActivity: c.lastActivity })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Patch v6 — rename all cases from YY-NNN to random 4-digit numbers
app.get('/api/patch-v6', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB' });

    const state = JSON.parse(JSON.stringify(rows[0].state));
    const numMap = {
      'c_24001': '4821', 'c_24002': '7354', 'c_24003': '2967',
      'c_24004': '5138', 'c_24005': '8413', 'c_24006': '3756',
      'c_25001': '6290', 'c_25002': '1847', 'c_25003': '9053',
      'c_25004': '4612', 'c_25005': '7825', 'c_25006': '3491',
    };
    const changes = [];
    state.cases.forEach(c => {
      if (numMap[c.id]) {
        changes.push(`${c.caseNumber} → ${numMap[c.id]} (${c.name})`);
        c.caseNumber = numMap[c.id];
      }
    });
    // Also strip caseCounter from state
    delete state.caseCounter;

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );
    res.json({ ok: true, changes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Patch v5 — definitive fix for 25-006 date (reverts any auto-save writing 2026 back)
app.get('/api/patch-v5', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'No database' });
  try {
    const { rows } = await pool.query("SELECT state FROM app_state WHERE id = 'singleton'");
    if (!rows[0]) return res.status(404).json({ error: 'No state in DB' });

    const state = JSON.parse(JSON.stringify(rows[0].state));
    const c = state.cases.find(c => c.caseNumber === '25-006');
    if (!c) return res.status(404).json({ error: '25-006 not found' });

    c.opened = '2025-08-15T12:00:00.000Z';
    c.lastActivity = '2025-08-15T12:00:00.000Z';
    c.notes.forEach(n => { n.date = '2025-08-15T12:00:00.000Z'; });

    await pool.query(
      `INSERT INTO app_state (id, state) VALUES ('singleton', $1)
       ON CONFLICT (id) DO UPDATE SET state = $1, updated_at = NOW()`,
      [state]
    );

    const sorted = [...state.cases].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    res.json({
      ok: true,
      fixed: { caseNumber: c.caseNumber, opened: c.opened, lastActivity: c.lastActivity },
      sortedByActivity: sorted.map(x => ({ caseNumber: x.caseNumber, name: x.name, lastActivity: x.lastActivity })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Shared LLM call — Anthropic (preferred) → OpenAI fallback → null. Returns text or null.
async function callLLM(prompt, maxTokens = 1024, model, temperature) {
  if (process.env.ANTHROPIC_API_KEY) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        ...(temperature != null ? { temperature } : {}),
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.content && data.content[0]) return data.content[0].text;
  }

  const openaiKey = process.env.OPENAI_API_KEY || process.env.openai;
  if (openaiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: maxTokens,
        ...(temperature != null ? { temperature } : {}),
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.choices && data.choices[0]) return data.choices[0].message.content;
  }
  return null;
}

app.post('/api/ai/complete', async (req, res) => {
  const { prompt, model } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });
  try {
    res.json({ result: await callLLM(prompt, 1024, model) });
  } catch (e) {
    console.error('AI error:', e.message);
    res.json({ result: null });
  }
});

// GroupMe Sync — analyze NEW chat messages against EXISTING opportunities and
// propose additive suggestions only. Returns { ok, suggestions:{noteSuggestions,
// unmatched}, aiAvailable }. Never mutates anything, and never invents a new
// opportunity — a qualifying message that doesn't match an existing one by name
// is reported in `unmatched` for a deacon to handle manually. The client applies
// accepted items via the normal append-only paths.
app.post('/api/groupme-suggest', async (req, res) => {
  const { messages, opportunities } = req.body || {};
  if (!Array.isArray(messages) || !Array.isArray(opportunities)) {
    return res.status(400).json({ error: 'messages[] and opportunities[] required' });
  }
  if (messages.length === 0) {
    return res.json({ ok: true, aiAvailable: true, suggestions: { noteSuggestions: [], unmatched: [] } });
  }

  const oppLines = opportunities.map(o =>
    `- #${o.caseNumber} | ${o.name} | ${o.status}\n    recorded notes: ${o.recorded || o.recent || '(none)'}`
  ).join('\n');

  const buildPrompt = (msgs) => `You are helping a church benevolence team catch up their internal records from a GroupMe chat export, ahead of a monthly meeting. You are given the team's EXISTING opportunities and a batch of NEW chat messages. Identify only what is genuinely actionable.

Each message line is "[timestamp] Sender: text" — the Sender is the deacon reporting it. Consecutive lines
from the same sender are one report; read them together to find the person and the amount.

Your job is to MATCH each report to the right opportunity — NOT to rewrite it. The note must be the deacon's
OWN WORDS, copied verbatim. Do not paraphrase, summarize, shorten, interpret, or add anything.

Return STRICT JSON only (no prose, no code fences) with this exact shape:
{
  "noteSuggestions": [ { "caseNumber": "<existing # it belongs to>", "by": "<the deacon who sent the message>", "date": "YYYY-MM-DD", "text": "<the deacon's message copied VERBATIM — exact words, no changes>" } ],
  "unmatched": [ { "by": "<the deacon who sent the message>", "date": "YYYY-MM-DD", "text": "<the deacon's message copied VERBATIM — exact words, no changes>" } ]
}

RULES:
- Use ONLY information explicitly in the messages. Do not invent or infer beyond them.
- ONLY two things qualify: (a) a case UPDATE (a real development about a person already being helped), or
  (b) anything about MONEY for a person — a request/ask for help, a bill total, an approval, or a
  disbursement. A pending request counts (e.g. "the Brightwells asked for help with June bills totaling
  $2,876.41" → a noteSuggestion on the Brightwells). Never skip a message that ties a dollar amount to a
  person, even if it's large or not yet approved. Everything else is noise.
- MATCH TO AN EXISTING OPPORTUNITY BY THE PERSON'S NAME, using the whole report (all consecutive lines from
  that sender). A message naming the person (first name, nickname, or initial — e.g. "Amanda", "Amanda J",
  "CW", "Crystal W") refers to THAT person's opportunity; tie the amount to the person named in the same
  report. Example: "met w Amanda J … I'm asking that we cover the $350 fee" → the $350 belongs to Amanda
  Jones, NOT to anyone else. NEVER attach an amount to an opportunity whose person isn't named in that report.
- "by" = the Sender of the message. Always fill it in.
- "text" = the deacon's message(s) copied VERBATIM (exact words). Include the full relevant message; if the
  report spans several of that sender's lines, include those lines verbatim. Do NOT paraphrase, summarize,
  or add commentary — the deacon's actual words go into the record.
- If the person isn't clearly one of the existing opportunities, put it in "unmatched" instead — do NOT guess
  a random existing "#", and do NOT invent a new opportunity. An update about someone who IS already an
  existing opportunity (e.g. the Brightwells) is a noteSuggestion on that opportunity, NOT unmatched.
- ADDITIVE ONLY: propose what is MISSING. If the event (that person + that amount/decision) is already in
  that opportunity's "recorded notes", SKIP it. Never restate, merge, or "correct" existing notes.
- Ignore everything that isn't (a) or (b): bare "Approve"/"Approved" replies, scheduling/logistics, prayer
  requests, thank-yous, volunteer coordination, general discussion, and GroupMe join/left/poll/deleted lines.
  When in doubt, leave it out.
- One suggestion per distinct report. The text stays verbatim (the deacon's exact words), never rewritten.
- Go through EVERY report below and include ALL that qualify — do not sample, summarize a subset, or stop
  early. If three reports qualify, return three. Completeness matters more than brevity.
- If nothing qualifies, return empty arrays.

EXISTING OPPORTUNITIES:
${oppLines || '(none)'}

NEW MESSAGES:
${msgs.map(m => `[${m.ts}] ${m.sender}: ${m.text}`).join('\n')}`;

  const parseJSON = (raw) => {
    if (!raw) return null;
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    try { return JSON.parse(cleaned); } catch (e) { return null; }
  };

  try {
    // Chunk to keep each call within limits; merge results.
    const CHUNK = 12;
    const merged = { noteSuggestions: [], unmatched: [] };
    let sawAI = false;
    for (let i = 0; i < messages.length; i += CHUNK) {
      const raw = await callLLM(buildPrompt(messages.slice(i, i + CHUNK)), 4096, 'claude-sonnet-5', 0);
      if (raw == null) continue; // no API key / failure
      sawAI = true;
      const parsed = parseJSON(raw);
      if (!parsed) continue;
      if (Array.isArray(parsed.noteSuggestions)) merged.noteSuggestions.push(...parsed.noteSuggestions);
      if (Array.isArray(parsed.unmatched)) merged.unmatched.push(...parsed.unmatched);
    }
    if (!sawAI) return res.json({ ok: false, aiAvailable: false, suggestions: { noteSuggestions: [], unmatched: [] } });
    res.json({ ok: true, aiAvailable: true, suggestions: merged });
  } catch (e) {
    console.error('GroupMe suggest error:', e.message);
    res.status(500).json({ error: e.message, aiAvailable: true });
  }
});

// Catch-all: serve index.html for any unmatched route (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Internal Benevolence running on port ${PORT}`));
