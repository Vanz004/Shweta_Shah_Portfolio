import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Save } from 'lucide-react';

export default function SnapshotSection() {
  const { data, updateSnapshot } = usePortfolio();
  const { theme } = useTheme();
  const [formData, setFormData] = useState(data.snapshot);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSnapshot(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const cardStyle = { backgroundColor: theme.bgCard, border: `1px solid ${theme.divider}`, borderRadius: 4, padding: 24 };
  const inputStyle = { backgroundColor: theme.bgHover, borderColor: theme.divider, color: theme.textPrimary, borderRadius: 4 };
  const labelStyle = { color: theme.textMuted, fontSize: 11, letterSpacing: '0.12em', display: 'block', marginBottom: 6 } as React.CSSProperties;

  const fields = [
    { id: 'teachingYears', label: 'TEACHING EXPERIENCE', key: 'teachingYears' as const, placeholder: 'e.g., 17+' },
    { id: 'researchYears', label: 'RESEARCH EXPERIENCE', key: 'researchYears' as const, placeholder: 'e.g., 10+' },
    { id: 'publications', label: 'TOTAL PUBLICATIONS', key: 'publications' as const, placeholder: 'e.g., 45+' },
    { id: 'projects', label: 'PROJECTS SUMMARY', key: 'projects' as const, placeholder: 'e.g., Multiple ISRO' },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Snapshot Statistics</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Update key statistics displayed on your portfolio</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(field => (
              <div key={field.id}>
                <label style={labelStyle}>{field.label}</label>
                <Input
                  value={formData[field.key]}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            style={{
              padding: '10px 24px',
              backgroundColor: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
              letterSpacing: '0.12em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Save size={14} /> SAVE CHANGES
          </button>
          {isSaved && <span style={{ color: theme.accentGreen, fontSize: 12 }}>✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}
