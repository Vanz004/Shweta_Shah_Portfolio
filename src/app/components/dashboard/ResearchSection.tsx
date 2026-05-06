import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { ResearchArea } from '../../context/PortfolioContext';

export default function ResearchSection() {
  const { data, updateResearchHighlight, addResearchArea, updateResearchArea, deleteResearchArea } = usePortfolio();
  const { theme } = useTheme();
  const [highlight, setHighlight] = useState(data.researchHighlight);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [newArea, setNewArea] = useState({ name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveHighlight = () => {
    updateResearchHighlight(highlight);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAdd = () => {
    if (newArea.name.trim()) {
      addResearchArea(newArea);
      setNewArea({ name: '' });
      setShowAddForm(false);
    }
  };

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24, marginBottom: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const btnPrimary = { padding: '8px 16px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties;
  const btnGhost = { padding: '6px 10px', backgroundColor: 'transparent', color: theme.textSecondary, border: `1px solid ${theme.divider}`, borderRadius: 4, cursor: 'pointer', fontSize: 12 } as React.CSSProperties;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Research Management</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Manage research areas and highlight text</p>
      </div>

      {/* Research Highlight */}
      <div style={cardStyle}>
        <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em', marginBottom: 12 }}>RESEARCH HIGHLIGHT</p>
        <Textarea
          value={highlight}
          onChange={e => setHighlight(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', marginBottom: 16 }}
        />
        <div className="flex items-center gap-4">
          <button onClick={handleSaveHighlight} style={btnPrimary}>
            <Save size={14} /> SAVE
          </button>
          {isSaved && <span style={{ color: theme.accentGreen, fontSize: 12 }}>✓ Saved</span>}
        </div>
      </div>

      {/* Research Areas */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em' }}>RESEARCH AREAS</p>
          <button onClick={() => setShowAddForm(!showAddForm)} style={btnPrimary}>
            <Plus size={14} /> ADD AREA
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: 16, backgroundColor: theme.bgHover, borderRadius: 4, marginBottom: 16 }}>
            <div className="flex gap-2">
              <Input
                value={newArea.name}
                onChange={e => setNewArea({ name: e.target.value })}
                placeholder="Research area name..."
                style={inputStyle}
              />
              <button onClick={handleAdd} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}>ADD</button>
              <button onClick={() => setShowAddForm(false)} style={btnGhost}>CANCEL</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {data.researchAreas.map(area => (
            <div
              key={area.id}
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
              {editingId === area.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm({ name: e.target.value })}
                    style={inputStyle}
                  />
                  <button onClick={() => { updateResearchArea(area.id, editForm); setEditingId(null); }} style={{ ...btnPrimary, backgroundColor: theme.accentGreen }}><Save size={14} /></button>
                  <button onClick={() => setEditingId(null)} style={btnGhost}><X size={14} /></button>
                </div>
              ) : (
                <>
                  <span style={{ color: theme.textSecondary, fontSize: 13 }}>{area.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(area.id); setEditForm({ name: area.name }); }} style={btnGhost}><Edit2 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteResearchArea(area.id); }} style={{ ...btnGhost, color: '#EF4444', borderColor: '#EF444440' }}><Trash2 size={14} /></button>
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
