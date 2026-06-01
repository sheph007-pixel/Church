const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
  )`).catch(e => console.error('DB init:', e.message));
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
        status: 'closed', opened: '2025-08-15',
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

app.post('/api/ai/complete', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        return res.json({ result: data.content[0].text });
      }
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
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return res.json({ result: data.choices[0].message.content });
      }
    }

    res.json({ result: null });
  } catch (e) {
    console.error('AI error:', e.message);
    res.json({ result: null });
  }
});

// Catch-all: serve index.html for any unmatched route (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Internal Benevolence running on port ${PORT}`));
