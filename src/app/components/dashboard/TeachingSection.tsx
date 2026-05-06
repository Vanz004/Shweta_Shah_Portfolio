import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { TeachingSubject } from '../../context/PortfolioContext';

export default function TeachingSection() {
  const { data, addTeachingSubject, updateTeachingSubject, deleteTeachingSubject } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [newSubject, setNewSubject] = useState({ name: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24, marginBottom: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Teaching Subjects</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage courses and subjects you teach</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>SUBJECTS</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}>
            <Plus size={14} /> ADD SUBJECT
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
            <div className="flex gap-2">
              <Input
                value={newSubject.name}
                onChange={e => setNewSubject({ name: e.target.value })}
                placeholder="Subject name..."
                style={inputStyle}
              />
              <button
                onClick={() => { if (newSubject.name.trim()) { addTeachingSubject(newSubject); setNewSubject({ name: '' }); setShowAddForm(false); } }}
                style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}
              >ADD</button>
              <button onClick={() => setShowAddForm(false)} style={btnGhost}>CANCEL</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {data.teachingSubjects.map((subject, i) => (
            <div
              key={subject.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: `1px solid ${theme.divider}`,
                borderRadius: 4,
                backgroundColor: theme.bgHover,
              }}
            >
              {editingId === subject.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm({ name: e.target.value })}
                    style={inputStyle}
                  />
                  <button onClick={() => { updateTeachingSubject(subject.id, editForm); setEditingId(null); }} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /></button>
                  <button onClick={() => setEditingId(null)} style={btnGhost}><X size={14} /></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span style={{ color: theme.textMuted, fontSize: 12, width: 24 }}>{String(i + 1).padStart(2, '0')}.</span>
                    <span style={{ color: theme.textSecondary, fontSize: 13 }}>{subject.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(subject.id); setEditForm({ name: subject.name }); }} style={btnGhost}><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteTeachingSubject(subject.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
