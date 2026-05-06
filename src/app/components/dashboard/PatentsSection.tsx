import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Patent } from '../../context/PortfolioContext';

const emptyPatent: Omit<Patent, 'id'> = { title: '', number: '', year: '', status: 'Published' };

export default function PatentsSection() {
  const { data, addPatent, updatePatent, deletePatent } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Patent, 'id'>>(emptyPatent);
  const [newPatent, setNewPatent] = useState<Omit<Patent, 'id'>>(emptyPatent);
  const [showAddForm, setShowAddForm] = useState(false);

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  const PatentForm = ({ values, onChange, onSave, onCancel, saveLabel }: any) => (
    <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>TITLE</label>
          <Input value={values.title} onChange={e => onChange({ ...values, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>PATENT NUMBER</label>
          <Input value={values.number} onChange={e => onChange({ ...values, number: e.target.value })} style={inputStyle} placeholder="e.g., IN 302458" />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>YEAR</label>
          <Input value={values.year} onChange={e => onChange({ ...values, year: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>STATUS</label>
          <select
            value={values.status}
            onChange={e => onChange({ ...values, status: e.target.value })}
            style={{ ...inputStyle, padding: '8px 12px', width: '100%', outline: 'none' }}
          >
            <option value="Granted">Granted</option>
            <option value="Published">Published</option>
            <option value="Filed">Filed</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /> {saveLabel}</button>
        <button onClick={onCancel} style={btnGhost}>CANCEL</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Patents Management</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage your patents and intellectual property</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>PATENTS ({data.patents.length})</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}><Plus size={14} /> ADD PATENT</button>
        </div>

        {showAddForm && (
          <PatentForm
            values={newPatent}
            onChange={setNewPatent}
            onSave={() => { if (newPatent.title.trim()) { addPatent(newPatent); setNewPatent(emptyPatent); setShowAddForm(false); } }}
            onCancel={() => setShowAddForm(false)}
            saveLabel="ADD"
          />
        )}

        <div className="space-y-3">
          {data.patents.map((patent, i) => (
            <div key={patent.id} style={{ border: `1px solid ${theme.divider}`, borderRadius: 4 }}>
              {editingId === patent.id ? (
                <div style={{ padding: 16 }}>
                  <PatentForm
                    values={editForm}
                    onChange={setEditForm}
                    onSave={() => { updatePatent(patent.id, editForm); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                    saveLabel="UPDATE"
                  />
                </div>
              ) : (
                <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12, width: 32, flexShrink: 0, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}.</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{patent.title}</p>
                    <div className="flex flex-wrap gap-4 items-center">
                      <span style={{ color: theme.accent, fontSize: 12, letterSpacing: '0.05em' }}>{patent.number}</span>
                      <span style={{ color: theme.textMuted, fontSize: 12 }}>{patent.year}</span>
                      <span style={{
                        padding: '2px 8px', fontSize: 10, letterSpacing: '0.08em', borderRadius: 2,
                        border: `1px solid ${theme.accentGreen}`, color: theme.accentGreen,
                      }}>{patent.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(patent.id); setEditForm({ title: patent.title, number: patent.number, year: patent.year, status: patent.status }); }} style={btnGhost}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deletePatent(patent.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={13} /></button>
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
