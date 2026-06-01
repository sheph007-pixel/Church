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
