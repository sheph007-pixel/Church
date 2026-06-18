// v3 case detail — notes, tasks, files + care team sidebar

// A single note in the timeline. Only the note's author may edit it; an edit
// marks it "edited" (with the change logged to history) and is shown inline.
function NoteItem3({ n, author, me, caseId, onEditNote }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(n.text);
  React.useEffect(() => { setDraft(n.text); setEditing(false); }, [n.id, n.text]);
  const mine = me && n.author === me.id;
  return (
    <article className="note">
      <div className="note-head">
        <Av3 id={n.author} size={26} />
        <div className="note-meta">
          <span className="note-author">{author.name}</span>
          <span className="note-time">{fmt3.dateShort(n.date)}</span>
          {n.editedAt && (
            <span className="note-edited" title={'Edited ' + fmt3.dateFull(n.editedAt)}
                  style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              · edited
            </span>
          )}
          {n.source === 'groupme' && (
            <span className="note-source" title="Imported from a GroupMe export and accepted"
                  style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, letterSpacing: '.03em', textTransform: 'uppercase', color: '#0369a1', background: '#e0f2fe', borderRadius: 4, padding: '1px 6px' }}>
              <Icon name="download" size={9} stroke={2} /> from GroupMe sync
            </span>
          )}
        </div>
        {mine && !editing && (
          <button className="icon-btn" style={{ marginLeft: 'auto' }} title="Edit note"
                  onClick={() => { setDraft(n.text); setEditing(true); }}>
            <Icon name="pencil" size={13} stroke={1.7} />
          </button>
        )}
      </div>
      {editing ? (
        <div className="composer-body" style={{ marginTop: 6 }}>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} autoFocus />
          <div className="composer-foot">
            <button className="link-btn" onClick={() => { setDraft(n.text); setEditing(false); }}>Cancel</button>
            <Btn3 variant="primary" size="sm" disabled={!draft.trim() || draft.trim() === n.text}
                  onClick={() => { onEditNote(caseId, n.id, draft.trim()); setEditing(false); }}>Save</Btn3>
          </div>
        </div>
      ) : (
        <p className="note-body">{n.text}</p>
      )}
    </article>
  );
}

function CaseDetail3({ c, me, caseEvents, team, onBack, onAddNote, onEditNote, onUpdate, onAddTask, onToggleTask, onDeleteTask, onSelectCase, onAddContact, onEditContact, onRemoveContact, onAddCareTeam, onEditCareTeam, onRemoveCareTeam, onSetAssignees, onShare, summaryEntry, onEnsureSummary, onRefreshSummary }) {
  const [noteText, setNoteText] = React.useState('');
  const [taskText, setTaskText] = React.useState('');
  const [taskDue, setTaskDue] = React.useState('');
  const [taskOwner, setTaskOwner] = React.useState(me.id);
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(c.name);
  const [showDone, setShowDone] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [shareState, setShareState] = React.useState('idle'); // idle | copied

  React.useEffect(() => {
    setNoteText('');
    setTaskText('');
    setTaskDue('');
    setTaskOwner(me.id);
    setEditingName(false);
    setNameDraft(c.name);
    setShowDone(false);
    setShowHistory(false);
    setShareState('idle');
  }, [c.id]);

  // Robust clipboard write — falls back to execCommand if modern API blocked.
  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  };
  const fallbackCopy = (text) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { /* noop */ }
  };

  const shareToGroupMe = async () => {
    const openTasks = c.tasks.filter(t => !t.done).length;
    const summary = [
      `Internal Benevolence — Opportunity ${c.caseNumber}`,
      ``,
      `Status: ${(STATUSES[c.status] || {}).label || c.status}`,
      `Open tasks: ${openTasks}`,
      `Last activity: ${fmt3.relative(c.lastActivity)}`,
      ``,
      `(Names redacted. Sign in to the app for full details.)`,
    ].join('\n');
    // Copy FIRST so the clipboard write completes before the tab opens.
    await copyToClipboard(summary);
    setShareState('copied');
    if (onShare) onShare(c.id);
    setTimeout(() => setShareState('idle'), 4000);
    window.open(GROUPME_URL, '_blank', 'noopener');
  };

  // All system users are deacons with full edit access.
  const canEdit = true;

  const postNote = () => {
    if (!noteText.trim()) return;
    onAddNote(c.id, noteText);
    setNoteText('');
  };
  const postTask = () => {
    if (!taskText.trim()) return;
    onAddTask(c.id, taskText, taskDue || null, taskOwner || me.id);
    setTaskText('');
    setTaskDue('');
    setTaskOwner(me.id);
  };
  const saveName = () => {
    if (nameDraft.trim() && nameDraft !== c.name) onUpdate(c.id, { name: nameDraft.trim() });
    setEditingName(false);
  };

  const openTasks = c.tasks.filter(t => !t.done);
  const doneTasks = c.tasks.filter(t => t.done);

  return (
    <div className="detail">
      <header className="detail-head">
        <button className="back-btn" onClick={onBack}>
          <Icon name="chevronLeft" size={16} stroke={1.8} /> Back
        </button>
        <div className="case-num">{c.caseNumber}</div>
        <div className="head-spacer" />
        <Btn3 variant={shareState === 'copied' ? 'primary' : 'dark'} size="sm"
              icon={shareState === 'copied' ? 'check' : 'chat'}
              onClick={shareToGroupMe}
              title="Copy a redacted summary to your clipboard, then open GroupMe to paste it">
          {shareState === 'copied' ? 'Copied — paste in GroupMe (⌘V)' : 'Open GroupMe'}
        </Btn3>
      </header>

      <div className="detail-body">
        {/* Name + status */}
        <div className="hero">
          {editingName ? (
            <input className="name-input" autoFocus value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setNameDraft(c.name); setEditingName(false); } }}
            />
          ) : (
            <h1 className="hero-title" onClick={() => canEdit && setEditingName(true)}>
              {c.name}
              {canEdit && <Icon name="pencil" size={15} stroke={1.7} className="edit-hint" />}
            </h1>
          )}
          <div className="hero-meta">
            <select className="status-select" disabled={!canEdit}
              value={c.status}
              onChange={e => onUpdate(c.id, { status: e.target.value })}>
              {Object.entries(STATUSES).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
            <span className="dot-sep">·</span>
            <span>Opened {fmt3.dateFull(c.opened)}</span>
            <span className="dot-sep">·</span>
            <span>Last activity {fmt3.relative(c.lastActivity)}</span>
          </div>
        </div>

        {/* AI summary */}
        <AiSummaryCard c={c} entry={summaryEntry} onEnsure={onEnsureSummary} onRefresh={onRefreshSummary} />

        {/* Tasks */}
        <section className="section section-tasks">
          <div className="section-head">
            <h2>
              <span className="tasks-icon"><Icon name="check" size={13} stroke={2.4} /></span>
              Tasks
              <span className="section-count">{openTasks.length} open{doneTasks.length > 0 ? ` · ${doneTasks.length} completed` : ''}</span>
            </h2>
          </div>
          {canEdit && (
            <form className="task-add" onSubmit={e => { e.preventDefault(); postTask(); }}>
              <button type="button" className="task-check task-check-empty"><Icon name="plus" size={11} stroke={2.2} /></button>
              <input className="task-add-text" value={taskText} onChange={e => setTaskText(e.target.value)}
                placeholder="Add a task" />
              {taskText.trim() && (
                <>
                  <select className="task-add-owner" value={taskOwner}
                          onChange={e => setTaskOwner(e.target.value)}
                          title="Who's responsible for this task"
                          style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', fontFamily: 'var(--font)', fontSize: 13, background: 'var(--bg)', color: 'var(--text)' }}>
                    {team.filter(t => !t.inactive).map(t => (
                      <option key={t.id} value={t.id}>{t.name}{t.id === me.id ? ' (you)' : ''}</option>
                    ))}
                  </select>
                  <label className="task-add-due" title="Due date (optional)">
                    <Icon name="calendar" size={14} stroke={1.8} />
                    <input type="date" value={taskDue}
                           onChange={e => setTaskDue(e.target.value)} />
                    {taskDue && <span className="due-pill">{fmt3.date(taskDue + 'T12:00:00')}</span>}
                  </label>
                  <Btn3 type="submit" variant="primary" size="sm">Add</Btn3>
                </>
              )}
            </form>
          )}
          <ul className="task-list">
            {openTasks.map(t => (
              <TaskRow key={t.id} task={t} onToggle={() => onToggleTask(c.id, t.id)}
                onDelete={() => onDeleteTask(c.id, t.id)} canEdit={canEdit} />
            ))}
            {doneTasks.length > 0 && (
              <li className="task-done-divider">
                <button type="button" className="task-done-toggle"
                        onClick={() => setShowDone(v => !v)}>
                  <Icon name="chevronDown" size={12} stroke={2}
                        style={{ transform: showDone ? 'none' : 'rotate(-90deg)',
                                 transition: 'transform 150ms' }} />
                  Completed ({doneTasks.length})
                </button>
              </li>
            )}
            {showDone && doneTasks.map(t => (
              <TaskRow key={t.id} task={t} onToggle={() => onToggleTask(c.id, t.id)}
                onDelete={() => onDeleteTask(c.id, t.id)} canEdit={canEdit} />
            ))}
            {c.tasks.length === 0 && !canEdit && (
              <li className="empty-line">No tasks.</li>
            )}
          </ul>
        </section>

        {/* Notes */}
        <section className="section">
          <div className="section-head">
            <h2>Notes <span className="section-count">{c.notes.length}</span></h2>
          </div>
          {canEdit && (
            <div className="composer">
              <Av3 id={me.id} size={32} />
              <div className="composer-body">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="What happened? A visit, a call, an update — just type it."
                  rows={2}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postNote(); }}
                />
                <div className="composer-foot">
                  <span className="hint">Cmd / Ctrl + Enter to post</span>
                  <Btn3 variant="primary" size="sm" onClick={postNote} disabled={!noteText.trim()}>Post</Btn3>
                </div>
              </div>
            </div>
          )}
          <div className="timeline">
            {c.notes.length === 0 && <div className="empty-line">No notes yet.</div>}
            {c.notes.map(n => {
              const a = team.find(t => t.id === n.author) || { name: 'Admin', initials: 'AD' };
              return <NoteItem3 key={n.id} n={n} author={a} me={me} caseId={c.id} onEditNote={onEditNote} />;
            })}
          </div>
        </section>

        {/* History — audit log for this case (collapsed by default) */}
        <section className="section section-history">
          <div className="section-head">
            <button type="button" className="history-toggle"
                    onClick={() => setShowHistory(v => !v)}
                    aria-expanded={showHistory}>
              <Icon name="chevronDown" size={13} stroke={2.2}
                    style={{ transform: showHistory ? 'none' : 'rotate(-90deg)',
                             transition: 'transform 150ms' }} />
              <h2 style={{ display: 'inline-flex' }}>
                History
                <span className="section-count">{caseEvents.length} {caseEvents.length === 1 ? 'event' : 'events'}</span>
                <span className="section-help"> · every change, who made it, when</span>
              </h2>
            </button>
          </div>
          {showHistory && <CaseHistoryList events={caseEvents} team={team} />}
        </section>
      </div>

      {/* Right meta sidebar: assigned deacons + contacts */}
      <aside className="detail-meta">
        <div className="meta-section" style={{ background: 'var(--primary-soft)', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-lg)', padding: '14px', marginBottom: 20 }}>
          <div className="meta-label-row" style={{ marginBottom: 8 }}>
            <span className="meta-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 12.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <Icon name="users" size={13} stroke={2} /> Assigned Deacons
            </span>
            <span className="meta-count" style={{ fontWeight: 700, color: 'var(--primary)' }}>{(c.assignees || []).length}/2</span>
          </div>
          {(c.assignees || []).length === 0 && (
            <div className="empty-line" style={{ fontSize: 13, color: 'var(--text-muted)', padding: '2px 0 6px' }}>
              No deacons assigned yet. Aim for 2 per opportunity.
            </div>
          )}
          {(c.assignees || []).map(id => {
            const m = team.find(t => t.id === id) || { name: '(unknown)' };
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <Av3 id={id} size={26} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{m.name}</span>
                <button className="icon-btn" title="Unassign"
                        onClick={() => onSetAssignees(c.id, (c.assignees || []).filter(x => x !== id))}>
                  <Icon name="close" size={13} stroke={1.8} />
                </button>
              </div>
            );
          })}
          {(c.assignees || []).length < 2 && (
            <select value="" onChange={e => { if (e.target.value) onSetAssignees(c.id, [...(c.assignees || []), e.target.value]); }}
                    style={{ marginTop: 8, width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)' }}>
              <option value="">+ Assign a deacon…</option>
              {team.filter(t => !t.inactive && !(c.assignees || []).includes(t.id))
                   .map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
        </div>
        <div className="meta-section">
          <div className="meta-label-row">
            <span className="meta-label">Contacts</span>
            <span className="meta-count">{c.contacts.length}</span>
          </div>
          <ContactList
            items={c.contacts}
            onAdd={(p) => onAddContact(c.id, p)}
            onEdit={(pid, patch) => onEditContact(c.id, pid, patch)}
            onRemove={(pid) => onRemoveContact(c.id, pid)}
            addLabel="Add Contact"
            empty="No contact info yet."
          />
        </div>
      </aside>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete, canEdit }) {
  const reg = (typeof window !== 'undefined' && window.MEMBERS_BY_ID) || {};
  const assignee = task.assignee ? (reg[task.assignee] || TEAM.find(t => t.id === task.assignee)) : null;
  return (
    <li className={'task' + (task.done ? ' task-done' : '')}>
      <button
        className={'task-check' + (task.done ? ' on' : '')}
        onClick={onToggle}
        disabled={!canEdit}
        aria-label={task.done ? 'Mark not done' : 'Mark done'}
      >
        {task.done && <Icon name="check" size={11} stroke={3} />}
      </button>
      <div className="task-body">
        <div className="task-text">{task.text}</div>
        {(assignee || task.due) && (
          <div className="task-meta">
            {assignee && <span className="task-assignee"><Av3 id={assignee.id} size={14} /> {assignee.name.split(' ')[0]}</span>}
            {task.due && <span className="task-due">Due {fmt3.dateFull(task.due + 'T12:00:00')}</span>}
          </div>
        )}
      </div>
      {canEdit && (
        <button className="icon-btn task-del" onClick={onDelete} title="Delete">
          <Icon name="close" size={13} stroke={1.8} />
        </button>
      )}
    </li>
  );
}

// ─── New case modal ─────────────────────────────────────
function NewCase3({ onClose, onCreate, me }) {
  const [name, setName] = React.useState('');
  const [firstNote, setFirstNote] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>New Opportunity</h2>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" size={18} stroke={1.8} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-intro">Just a name to start. Add the rest as you go.</p>
          <div className="form-row">
            <label>Opportunity Name</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)}
                   placeholder='"Alvarez Family", "Grace O.", anything internal' />
            <div className="form-hint">Only deacons see this name. Printed reports always redact it.</div>
          </div>
          <div className="form-row">
            <label>First Note <span className="optional">(optional)</span></label>
            <textarea value={firstNote} onChange={e => setFirstNote(e.target.value)}
                      placeholder="A sentence or two about the situation."
                      rows={3} />
          </div>
          <div className="form-row">
            <label>Primary Contact <span className="optional">(optional)</span></label>
            <div className="new-contact-grid">
              <input value={contactName} placeholder="Name"
                     onChange={e => setContactName(e.target.value)} />
              <input value={contactPhone} placeholder="Phone" inputMode="tel"
                     onChange={e => setContactPhone(e.target.value)} />
              <input value={contactEmail} placeholder="Email" type="email"
                     onChange={e => setContactEmail(e.target.value)} />
            </div>
            <div className="form-hint">Add more contacts after the opportunity is created.</div>
          </div>
        </div>
        <div className="modal-foot">
          <Btn3 variant="ghost" onClick={onClose}>Cancel</Btn3>
          <Btn3 variant="primary" disabled={!name.trim()}
               onClick={() => onCreate({
                 name: name.trim(),
                 firstNote,
                 contact: contactName.trim()
                   ? { name: contactName.trim(), phone: contactPhone.trim(), email: contactEmail.trim() }
                   : null,
               })}>
            Create Opportunity
          </Btn3>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CaseDetail3, NewCase3, CaseHistoryList });

// ─── History list (used inside case detail) ─────────────
function CaseHistoryList({ events, team }) {
  if (!events || events.length === 0) {
    return <div className="empty-line">No history yet. Every change made here is recorded.</div>;
  }
  // Group by date (yyyy-mm-dd)
  const groups = events.reduce((acc, e) => {
    const d = e.at.slice(0, 10);
    (acc[d] = acc[d] || []).push(e);
    return acc;
  }, {});
  const dates = Object.keys(groups).sort().reverse();

  return (
    <div className="history">
      {dates.map(d => (
        <div key={d} className="history-day">
          <div className="history-day-label">{fmt3.dateFull(d + 'T00:00:00')}</div>
          <ul className="history-list">
            {groups[d].map(e => <HistoryRow key={e.id} e={e} team={team} />)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function HistoryRow({ e, team }) {
  const who = (team || TEAM).find(t => t.id === e.who) || { name: 'Admin' };
  const kind = EVENT_KINDS[e.kind] || { label: e.kind, icon: 'note' };
  const detail = eventDetailText(e);
  const time = new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return (
    <li className="history-row">
      <div className="history-icon" data-kind={e.kind}>
        <Icon name={kind.icon} size={11} stroke={2} />
      </div>
      <div className="history-body">
        <div className="history-line">
          <strong>{who.name}</strong>{' '}
          <span className="muted">{kind.label}</span>
        </div>
        {detail && <div className="history-detail">{detail}</div>}
      </div>
      <div className="history-time">{time}</div>
    </li>
  );
}
