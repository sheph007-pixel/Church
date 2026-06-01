// v3 case detail — notes, tasks, files + care team sidebar

function CaseDetail3({ c, me, caseEvents, team, onBack, onAddNote, onUpdate, onAddTask, onToggleTask, onDeleteTask, onAddFile, onDeleteFile, onSelectCase, onAddContact, onEditContact, onRemoveContact, onAddCareTeam, onEditCareTeam, onRemoveCareTeam, onShare, summaryEntry, onEnsureSummary, onRefreshSummary }) {
  const [noteText, setNoteText] = React.useState('');
  const [taskText, setTaskText] = React.useState('');
  const [taskDue, setTaskDue] = React.useState('');
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(c.name);
  const [showDone, setShowDone] = React.useState(false);
  const [shareState, setShareState] = React.useState('idle'); // idle | copied

  React.useEffect(() => {
    setNoteText('');
    setTaskText('');
    setTaskDue('');
    setEditingName(false);
    setNameDraft(c.name);
    setShowDone(false);
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
      `Internal Benevolence — Case ${c.caseNumber}`,
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
    onAddTask(c.id, taskText, taskDue || null);
    setTaskText('');
    setTaskDue('');
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
        <section className="section">
          <div className="section-head">
            <h2>
              Tasks
              <span className="section-count">{openTasks.length} open{doneTasks.length > 0 ? ` · ${doneTasks.length} done` : ''}</span>
            </h2>
          </div>
          {canEdit && (
            <form className="task-add" onSubmit={e => { e.preventDefault(); postTask(); }}>
              <button type="button" className="task-check task-check-empty"><Icon name="plus" size={11} stroke={2.2} /></button>
              <input className="task-add-text" value={taskText} onChange={e => setTaskText(e.target.value)}
                placeholder="Add a task — e.g. 'Call landlord by Friday'" />
              {taskText.trim() && (
                <>
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
                  Done ({doneTasks.length})
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
              return (
                <article key={n.id} className="note">
                  <div className="note-head">
                    <Av3 id={n.author} size={26} />
                    <div className="note-meta">
                      <span className="note-author">{a.name}</span>
                      <span className="note-time">{fmt3.dateShort(n.date)}</span>
                    </div>
                  </div>
                  <p className="note-body">{n.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Files */}
        <section className="section section-files">
          <div className="section-head">
            <h2>Files <span className="section-count">{c.files.length}</span></h2>
          </div>
          {canEdit && (
            <label className="file-drop">
              <input type="file" onChange={e => {
                const f = e.target.files[0];
                if (f) onAddFile(c.id, { name: f.name, size: (f.size/1024 < 1024 ? Math.round(f.size/1024) + ' KB' : (f.size/1024/1024).toFixed(1) + ' MB') });
                e.target.value = '';
              }} hidden />
              <Icon name="upload" size={16} stroke={1.7} />
              <span>Drop a File or <strong>Browse</strong></span>
            </label>
          )}
          <ul className="files-list">
            {c.files.length === 0 && !canEdit && <li className="empty-line">No files.</li>}
            {c.files.map(f => (
              <li key={f.id} className="file">
                <Icon name={f.name.match(/\.(jpg|png|jpeg|heic)$/i) ? 'image' : 'file'} size={15} stroke={1.7} />
                <span className="file-name">{f.name}</span>
                <span className="file-size">{f.size}</span>
                {canEdit && (
                  <button className="icon-btn" onClick={() => onDeleteFile(c.id, f.id)} title="Remove">
                    <Icon name="close" size={13} stroke={1.8} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* History — audit log for this case */}
        <section className="section section-history">
          <div className="section-head">
            <h2>
              History
              <span className="section-count">{caseEvents.length} {caseEvents.length === 1 ? 'event' : 'events'}</span>
              <span className="section-help"> · every change, who made it, when</span>
            </h2>
          </div>
          <CaseHistoryList events={caseEvents} team={team} />
        </section>
      </div>

      {/* Right meta sidebar: contacts */}
      <aside className="detail-meta">
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
  const assignee = TEAM.find(t => t.id === task.assignee);
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
          <h2>New Case</h2>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" size={18} stroke={1.8} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-intro">Just a name to start. Add the rest as you go.</p>
          <div className="form-row">
            <label>Case Name</label>
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
            <div className="form-hint">Add more contacts after the case is created.</div>
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
            Create Case
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
