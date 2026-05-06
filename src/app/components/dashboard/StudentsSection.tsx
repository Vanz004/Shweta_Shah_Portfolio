import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Student } from '../../context/PortfolioContext';

const emptyStudent: Omit<Student, 'id'> = { name: '', topic: '', status: 'ongoing', year: '' };

export default function StudentsSection() {
  const { data, addStudent, updateStudent, deleteStudent } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Student, 'id'>>(emptyStudent);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>(emptyStudent);
  const [showAddForm, setShowAddForm] = useState(false);

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  const StudentForm = ({ values, onChange, onSave, onCancel, saveLabel }: any) => (
    <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>NAME</label>
          <Input value={values.name} onChange={e => onChange({ ...values, name: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>YEAR (if completed)</label>
          <Input value={values.year || ''} onChange={e => onChange({ ...values, year: e.target.value })} style={inputStyle} placeholder="e.g., 2022" />
        </div>
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>RESEARCH TOPIC</label>
          <Input value={values.topic} onChange={e => onChange({ ...values, topic: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>STATUS</label>
          <select
            value={values.status}
            onChange={e => onChange({ ...values, status: e.target.value as 'completed' | 'ongoing' })}
            style={{ ...inputStyle, padding: '8px 12px', width: '100%', outline: 'none' }}
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
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
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>PhD Students</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage PhD student records</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>STUDENTS ({data.students.length})</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}><Plus size={14} /> ADD STUDENT</button>
        </div>

        {showAddForm && (
          <StudentForm
            values={newStudent}
            onChange={setNewStudent}
            onSave={() => { if (newStudent.name.trim()) { addStudent(newStudent); setNewStudent(emptyStudent); setShowAddForm(false); } }}
            onCancel={() => setShowAddForm(false)}
            saveLabel="ADD"
          />
        )}

        <div className="space-y-2">
          {data.students.map((student, i) => (
            <div key={student.id} style={{ border: `1px solid ${theme.divider}`, borderRadius: 4 }}>
              {editingId === student.id ? (
                <div style={{ padding: 16 }}>
                  <StudentForm
                    values={editForm}
                    onChange={setEditForm}
                    onSave={() => { updateStudent(student.id, editForm); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                    saveLabel="UPDATE"
                  />
                </div>
              ) : (
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12, width: 28, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 500 }}>{student.name}</p>
                    <p style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{student.topic}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {student.year && <span style={{ color: theme.textMuted, fontSize: 12 }}>{student.year}</span>}
                    <span style={{
                      padding: '2px 8px', fontSize: 10, letterSpacing: '0.08em', borderRadius: 2,
                      border: `1px solid ${student.status === 'completed' ? theme.accentGreen : theme.accent}`,
                      color: student.status === 'completed' ? theme.accentGreen : theme.accent,
                    }}>{student.status.toUpperCase()}</span>
                    <button onClick={() => { setEditingId(student.id); setEditForm({ name: student.name, topic: student.topic, status: student.status, year: student.year }); }} style={btnGhost}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteStudent(student.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={13} /></button>
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
