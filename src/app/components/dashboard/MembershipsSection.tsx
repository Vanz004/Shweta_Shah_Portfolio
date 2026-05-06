import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Membership } from '../../context/PortfolioContext';

const emptyMembership: Omit<Membership, 'id'> = { organization: '', role: '' };

export default function MembershipsSection() {
  const { data, addMembership, updateMembership, deleteMembership, toggleSectionVisibility } = usePortfolio();
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Membership, 'id'>>(emptyMembership);
  const [newMember, setNewMember] = useState<Omit<Membership, 'id'>>(emptyMembership);
  const [showAddForm, setShowAddForm] = useState(false);

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24, marginBottom: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Memberships & Affiliations</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage professional memberships and affiliations</p>
      </div>

      {/* Section Visibility */}
      <div style={cardStyle}>
        <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em', marginBottom: 16 }}>SECTION VISIBILITY</p>
        <div className="space-y-2">
          {(Object.keys(data.sectionVisibility) as Array<keyof typeof data.sectionVisibility>).map(section => (
            <div key={section} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.divider}` }}>
              <span style={{ color: theme.textSecondary, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section}</span>
              <button
                onClick={() => toggleSectionVisibility(section)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px',
                  backgroundColor: data.sectionVisibility[section] ? theme.accentGreen + '20' : theme.bgHover,
                  border: `1px solid ${data.sectionVisibility[section] ? theme.accentGreen : theme.divider}`,
                  color: data.sectionVisibility[section] ? theme.accentGreen : theme.textMuted,
                  borderRadius: 4, cursor: 'pointer', fontSize: 11, letterSpacing: '0.08em',
                }}
              >
                {data.sectionVisibility[section] ? <Eye size={12} /> : <EyeOff size={12} />}
                {data.sectionVisibility[section] ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Memberships */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>MEMBERSHIPS ({data.memberships.length})</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}><Plus size={14} /> ADD</button>
        </div>

        {showAddForm && (
          <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>ORGANIZATION</label>
                <Input value={newMember.organization} onChange={e => setNewMember({ ...newMember, organization: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>ROLE / LEVEL</label>
                <Input value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} style={inputStyle} placeholder="e.g., Senior Member" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { if (newMember.organization.trim()) { addMembership(newMember); setNewMember(emptyMembership); setShowAddForm(false); } }} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /> ADD</button>
              <button onClick={() => setShowAddForm(false)} style={btnGhost}>CANCEL</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {data.memberships.map((member, i) => (
            <div key={member.id} style={{ border: `1px solid ${theme.divider}`, borderRadius: 4 }}>
              {editingId === member.id ? (
                <div style={{ padding: 16 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>ORGANIZATION</label>
                      <Input value={editForm.organization} onChange={e => setEditForm({ ...editForm, organization: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>ROLE</label>
                      <Input value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { updateMembership(member.id, editForm); setEditingId(null); }} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /> UPDATE</button>
                    <button onClick={() => setEditingId(null)} style={btnGhost}>CANCEL</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12, width: 28, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: theme.textPrimary, fontSize: 13, fontWeight: 500, marginRight: 12 }}>{member.organization}</span>
                    <span style={{ color: theme.textSecondary, fontSize: 12 }}>{member.role}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(member.id); setEditForm({ organization: member.organization, role: member.role }); }} style={btnGhost}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMembership(member.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={13} /></button>
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
