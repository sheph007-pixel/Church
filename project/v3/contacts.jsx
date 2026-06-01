// ContactList — shared compact contact rows
// Used for case Contacts (people we're helping) and case Care Team (people helping).

// Avatar from a name string (no system user behind it)
function NameAvatar({ name, size = 28 }) {
  const initials = fmt3.initials(name) || '?';
  const color = fmt3.colorFromName(name);
  return (
    <div className="contact-av" style={{
      width: size, height: size, borderRadius: 99,
      background: color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

function ContactRow({ p, withRole, onSave, onRemove }) {
  const [editing, setEditing] = React.useState(!p.name);
  const [draft, setDraft] = React.useState(p);

  React.useEffect(() => { setDraft(p); }, [p.id, p.name, p.phone, p.email, p.role]);

  if (editing) {
    return (
      <div className="contact-row contact-row-edit">
        <div className="contact-edit-grid">
          <input autoFocus className="ct-name"
                 placeholder="Name (required)" value={draft.name || ''}
                 onChange={e => setDraft({ ...draft, name: e.target.value })} />
          <input className="ct-phone" placeholder="Phone" value={draft.phone || ''}
                 inputMode="tel" autoComplete="off"
                 onChange={e => setDraft({ ...draft, phone: e.target.value })} />
          <input className="ct-email" placeholder="Email" value={draft.email || ''}
                 type="email" autoComplete="off"
                 onChange={e => setDraft({ ...draft, email: e.target.value })} />
          {withRole && (
            <input className="ct-role"
                   placeholder='What are they doing? (e.g. "bringing meals Tuesdays")'
                   value={draft.role || ''}
                   onChange={e => setDraft({ ...draft, role: e.target.value })} />
          )}
        </div>
        <div className="contact-edit-actions">
          <button className="link-btn" onClick={() => { setDraft(p); setEditing(false); if (!p.name) onRemove(); }}>
            Cancel
          </button>
          <Btn3 variant="primary" size="sm" disabled={!draft.name?.trim()}
                onClick={() => { onSave(draft); setEditing(false); }}>
            Save
          </Btn3>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-row" onClick={() => setEditing(true)}>
      <NameAvatar name={p.name} size={28} />
      <div className="contact-body">
        <div className="contact-name">{p.name}</div>
        <div className="contact-meta">
          {p.phone && (
            <a href={fmt3.telHref(p.phone)} className="contact-link"
               onClick={e => e.stopPropagation()}>
              <Icon name="phone" size={11} stroke={1.9} /> {p.phone}
            </a>
          )}
          {p.email && (
            <a href={'mailto:' + p.email} className="contact-link"
               onClick={e => e.stopPropagation()}>
              <Icon name="chat" size={11} stroke={1.9} /> {p.email}
            </a>
          )}
          {!p.phone && !p.email && (
            <span className="contact-empty">No phone or email</span>
          )}
        </div>
        {withRole && p.role && <div className="contact-role">{p.role}</div>}
      </div>
      <div className="contact-actions">
        <button className="icon-btn" onClick={e => { e.stopPropagation(); setEditing(true); }} title="Edit">
          <Icon name="pencil" size={13} stroke={1.7} />
        </button>
        <button className="icon-btn" onClick={e => { e.stopPropagation(); onRemove(); }} title="Remove">
          <Icon name="close" size={13} stroke={1.8} />
        </button>
      </div>
    </div>
  );
}

function ContactList({ items, withRole, onAdd, onEdit, onRemove, addLabel = '+ Add Person', empty }) {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ name: '', phone: '', email: '', role: '' });

  React.useEffect(() => {
    if (!adding) setDraft({ name: '', phone: '', email: '', role: '' });
  }, [adding]);

  return (
    <div className="contact-list">
      {items.length === 0 && !adding && empty && (
        <div className="contact-empty-state">{empty}</div>
      )}
      {items.map(p => (
        <ContactRow key={p.id} p={p} withRole={withRole}
          onSave={(patch) => onEdit(p.id, patch)}
          onRemove={() => onRemove(p.id)} />
      ))}
      {adding && (
        <div className="contact-row contact-row-edit">
          <div className="contact-edit-grid">
            <input autoFocus className="ct-name"
                   placeholder="Name (required)" value={draft.name}
                   onChange={e => setDraft({ ...draft, name: e.target.value })} />
            <input className="ct-phone" placeholder="Phone" value={draft.phone}
                   inputMode="tel" autoComplete="off"
                   onChange={e => setDraft({ ...draft, phone: e.target.value })} />
            <input className="ct-email" placeholder="Email" value={draft.email}
                   type="email" autoComplete="off"
                   onChange={e => setDraft({ ...draft, email: e.target.value })} />
            {withRole && (
              <input className="ct-role"
                     placeholder='What are they doing? (e.g. "bringing meals Tuesdays")'
                     value={draft.role}
                     onChange={e => setDraft({ ...draft, role: e.target.value })} />
            )}
          </div>
          <div className="contact-edit-actions">
            <button className="link-btn" onClick={() => setAdding(false)}>Cancel</button>
            <Btn3 variant="primary" size="sm" disabled={!draft.name.trim()}
                  onClick={() => { onAdd(draft); setAdding(false); }}>
              Add
            </Btn3>
          </div>
        </div>
      )}
      {!adding && (
        <button className="contact-add-btn" onClick={() => setAdding(true)}>
          <Icon name="plus" size={13} stroke={2} /> {addLabel}
        </button>
      )}
    </div>
  );
}

Object.assign(window, { NameAvatar, ContactRow, ContactList });
