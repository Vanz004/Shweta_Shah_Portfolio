import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Project } from '../../context/PortfolioContext';

const emptyProject: Omit<Project, 'id'> = { title: '', funding: '', duration: '', status: 'ongoing', link: '' };

export default function ProjectsSection() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Project, 'id'>>(emptyProject);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>(emptyProject);
  const [showAddForm, setShowAddForm] = useState(false);

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  const ProjectForm = ({ values, onChange, onSave, onCancel, saveLabel }: any) => (
    <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>TITLE</label>
          <Input value={values.title} onChange={e => onChange({ ...values, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>FUNDING</label>
          <Input value={values.funding} onChange={e => onChange({ ...values, funding: e.target.value })} style={inputStyle} placeholder="e.g., ISRO - ₹25 Lakhs" />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>DURATION</label>
          <Input value={values.duration} onChange={e => onChange({ ...values, duration: e.target.value })} style={inputStyle} placeholder="e.g., 2022-2024" />
        </div>
        <div>
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>STATUS</label>
          <select
            value={values.status}
            onChange={e => onChange({ ...values, status: e.target.value as 'funded' | 'ongoing' })}
            style={{ ...inputStyle, padding: '8px 12px', width: '100%', outline: 'none' }}
          >
            <option value="funded">Funded</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>PROJECT LINK (OPTIONAL)</label>
          <Input value={values.link || ''} onChange={e => onChange({ ...values, link: e.target.value })} style={inputStyle} placeholder="https://drive.google.com/..." />
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
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Projects Management</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage funded and ongoing research projects</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>PROJECTS ({data.projects.length})</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}><Plus size={14} /> ADD PROJECT</button>
        </div>

        {showAddForm && (
          <ProjectForm
            values={newProject}
            onChange={setNewProject}
            onSave={() => { if (newProject.title.trim()) { addProject(newProject); setNewProject(emptyProject); setShowAddForm(false); } }}
            onCancel={() => setShowAddForm(false)}
            saveLabel="ADD"
          />
        )}

        <div className="space-y-3">
          {data.projects.map((proj, i) => (
            <div key={proj.id} style={{ border: `1px solid ${theme.divider}`, borderRadius: 4 }}>
              {editingId === proj.id ? (
                <div style={{ padding: 16 }}>
                  <ProjectForm
                    values={editForm}
                    onChange={setEditForm}
                    onSave={() => { updateProject(proj.id, editForm); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                    saveLabel="UPDATE"
                  />
                </div>
              ) : (
                <div style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12, width: 32, flexShrink: 0, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}.</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{proj.title}</p>
                    <div className="flex flex-wrap gap-4">
                      <span style={{ color: theme.accentGreen, fontSize: 12 }}>{proj.funding}</span>
                      <span style={{ color: theme.textMuted, fontSize: 12 }}>{proj.duration}</span>
                      <span style={{
                        padding: '2px 8px', fontSize: 10, letterSpacing: '0.08em', borderRadius: 2,
                        border: `1px solid ${proj.status === 'ongoing' ? theme.accentGreen : theme.accent}`,
                        color: proj.status === 'ongoing' ? theme.accentGreen : theme.accent,
                      }}>{proj.status.toUpperCase()}</span>
                      {proj.link && (
                        <span style={{ color: theme.accent, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          🔗 Has Link
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(proj.id); setEditForm({ title: proj.title, funding: proj.funding, duration: proj.duration, status: proj.status, link: proj.link }); }} style={btnGhost}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteProject(proj.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={13} /></button>
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
