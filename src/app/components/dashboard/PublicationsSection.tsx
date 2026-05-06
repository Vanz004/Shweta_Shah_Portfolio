import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Publication } from '../../context/PortfolioContext';

const emptyPub: Omit<Publication, 'id'> = { title: '', authors: '', year: '', venue: '', link: '', type: 'journal' };

export default function PublicationsSection() {
  const { data, addPublication, updatePublication, deletePublication } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Publication, 'id'>>(emptyPub);
  const [newPub, setNewPub] = useState<Omit<Publication, 'id'>>(emptyPub);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'journal' | 'conference'>('all');

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  const PubForm = ({ values, onChange, onSave, onCancel, saveLabel }: any) => (
    <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>TITLE</label>
          <Input value={values.title} onChange={e => onChange({ ...values, title: e.target.value })} style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>AUTHORS</label>
          <Input value={values.authors} onChange={e => onChange({ ...values, authors: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>YEAR</label>
          <Input value={values.year} onChange={e => onChange({ ...values, year: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>VENUE</label>
          <Input value={values.venue} onChange={e => onChange({ ...values, venue: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>LINK</label>
          <Input value={values.link} onChange={e => onChange({ ...values, link: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>TYPE</label>
          <select
            value={values.type}
            onChange={e => onChange({ ...values, type: e.target.value as 'journal' | 'conference' })}
            style={{ ...inputStyle, padding: '8px 12px', width: '100%', outline: 'none' }}
          >
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /> {saveLabel}</button>
        <button onClick={onCancel} style={btnGhost}>CANCEL</button>
      </div>
    </div>
  );

  const filtered = data.publications.filter(p => filter === 'all' || p.type === filter);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Publications Management</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage your research publications</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(['all', 'journal', 'conference'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  border: `1px solid ${filter === f ? theme.accent : theme.divider}`,
                  backgroundColor: filter === f ? theme.accent : 'transparent',
                  color: filter === f ? '#fff' : theme.textSecondary,
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}>
            <Plus size={14} /> ADD
          </button>
        </div>

        {showAddForm && (
          <PubForm
            values={newPub}
            onChange={setNewPub}
            onSave={() => { if (newPub.title.trim()) { addPublication(newPub); setNewPub(emptyPub); setShowAddForm(false); } }}
            onCancel={() => setShowAddForm(false)}
            saveLabel="ADD PUBLICATION"
          />
        )}

        <div className="space-y-3">
          {filtered.map((pub, i) => (
            <div key={pub.id} style={{ border: `1px solid ${theme.divider}`, borderRadius: 4, overflow: 'hidden' }}>
              {editingId === pub.id ? (
                <div style={{ padding: 16, backgroundColor: theme.bgHover }}>
                  <PubForm
                    values={editForm}
                    onChange={setEditForm}
                    onSave={() => { updatePublication(pub.id, editForm); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                    saveLabel="UPDATE"
                  />
                </div>
              ) : (
                <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12, width: 32, flexShrink: 0, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{pub.title}</p>
                    <p style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>{pub.authors}</p>
                    <div className="flex flex-wrap gap-3 items-center">
                      <span style={{ color: theme.accent, fontSize: 11 }}>{pub.year}</span>
                      <span style={{ color: theme.textMuted, fontSize: 11 }}>{pub.venue}</span>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        border: `1px solid ${pub.type === 'journal' ? theme.accentGreen : theme.accent}`,
                        color: pub.type === 'journal' ? theme.accentGreen : theme.accent,
                        borderRadius: 2,
                      }}>{pub.type.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(pub.id); setEditForm({ title: pub.title, authors: pub.authors, year: pub.year, venue: pub.venue, link: pub.link, type: pub.type }); }} style={btnGhost}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deletePublication(pub.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
