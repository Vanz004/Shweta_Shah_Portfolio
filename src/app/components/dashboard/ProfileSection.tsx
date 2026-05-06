import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Save, X, Upload, Image } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function ProfileSection() {
  const { data, updateProfile, updateAbout } = usePortfolio();
  const { theme } = useTheme();
  const [formData, setFormData] = useState(data.profile);
  const [aboutText, setAboutText] = useState(data.aboutText);
  const [tagInput, setTagInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(data.profile.image);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData, image: imagePreview });
    updateAbout(aboutText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const handleFileRead = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileRead(file);
  };

  const cardStyle = {
    backgroundColor: theme.bgCard,
    border: `1px solid ${theme.divider}`,
    borderRadius: 4,
    padding: 24,
    marginBottom: 24,
  };

  const inputStyle = {
    backgroundColor: theme.bgHover,
    borderColor: theme.divider,
    color: theme.textPrimary,
    borderRadius: 4,
  };

  const labelStyle = {
    color: theme.textMuted,
    fontSize: 11,
    letterSpacing: '0.12em',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>SECTION</p>
        <h2 style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 300 }}>Profile Management</h2>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>Update your profile information and contact details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'name', label: 'FULL NAME', value: formData.name, key: 'name' as const },
              { id: 'role', label: 'ROLE', value: formData.role, key: 'role' as const },
              { id: 'organization', label: 'ORGANIZATION', value: formData.organization, key: 'organization' as const },
              { id: 'email', label: 'EMAIL', value: formData.email, key: 'email' as const },
              { id: 'phone', label: 'PHONE', value: formData.phone, key: 'phone' as const },
              { id: 'office', label: 'OFFICE', value: formData.office, key: 'office' as const },
            ].map(field => (
              <div key={field.id}>
                <label style={labelStyle}>{field.label}</label>
                <Input
                  id={field.id}
                  value={field.value}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div style={cardStyle}>
          <label style={{ ...labelStyle, marginBottom: 16 }}>PROFILE PHOTO</label>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Preview */}
            <div
              style={{
                width: 140,
                height: 180,
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${theme.divider}`,
                flexShrink: 0,
                backgroundColor: theme.bgHover,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                  }}
                />
              ) : (
                <Image size={32} style={{ color: theme.textMuted }} />
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Drag & Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? theme.accent : theme.divider}`,
                  borderRadius: 6,
                  padding: '20px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, background-color 200ms ease',
                  backgroundColor: isDragging ? `${theme.accent}10` : 'transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = theme.accent)}
                onMouseLeave={e => { if (!isDragging) e.currentTarget.style.borderColor = theme.divider; }}
              >
                <Upload size={20} style={{ color: theme.textMuted, margin: '0 auto 8px' }} />
                <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 4 }}>
                  Click or drag & drop to upload
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.05em' }}>
                  PNG, JPG, WEBP supported
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* OR divider */}
              <div className="flex items-center gap-3">
                <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
                <span style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.1em' }}>OR</span>
                <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
              </div>

              {/* URL input */}
              <div>
                <label style={{ ...labelStyle, marginBottom: 6 }}>IMAGE URL</label>
                <Input
                  value={imagePreview.startsWith('data:') ? '' : imagePreview}
                  onChange={e => setImagePreview(e.target.value)}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </div>

              {/* Preview note */}
              <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.04em' }}>
                Preview shows the black & white effect as it appears on the portfolio.
              </p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>ABOUT TEXT</label>
          <Textarea
            value={aboutText}
            onChange={e => setAboutText(e.target.value)}
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* CV Upload Card */}
        <div style={cardStyle}>
          <label style={{ ...labelStyle, marginBottom: 16 }}>CURRICULUM VITAE (PDF)</label>
          <div className="flex flex-col gap-4">
            {formData.cvBase64 ? (
              <div className="flex items-center gap-4">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    backgroundColor: theme.bgHover,
                    border: `1px solid ${theme.divider}`,
                    borderRadius: 4,
                    color: theme.textSecondary,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                  }}
                >
                  <Upload size={13} style={{ color: theme.accent }} />
                  CV uploaded ✓
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cvBase64: undefined })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    background: 'none',
                    border: `1px solid ${theme.divider}`,
                    borderRadius: 4,
                    color: '#EF4444',
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                  }}
                >
                  <X size={13} />
                  REMOVE CV
                </button>
              </div>
            ) : (
              <div
                onClick={() => document.getElementById('cv-upload-input')?.click()}
                style={{
                  border: `2px dashed ${theme.divider}`,
                  borderRadius: 6,
                  padding: '20px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = theme.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = theme.divider)}
              >
                <Upload size={20} style={{ color: theme.textMuted, margin: '0 auto 8px' }} />
                <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 4 }}>
                  Click to upload your CV
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.05em' }}>
                  PDF only · max ~2 MB (stored in browser)
                </p>
              </div>
            )}
            <input
              id="cv-upload-input"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 2.5 * 1024 * 1024) {
                  alert('PDF is too large. Please use a file under 2 MB.');
                  return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setFormData({ ...formData, cvBase64: ev.target?.result as string });
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>RESEARCH TAGS</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              style={inputStyle}
            />
            <button
              type="button"
              onClick={addTag}
              style={{
                padding: '8px 16px',
                backgroundColor: theme.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                letterSpacing: '0.08em',
              }}
            >
              ADD
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  backgroundColor: theme.bgHover,
                  border: `1px solid ${theme.divider}`,
                  borderRadius: 2,
                  color: theme.textSecondary,
                  fontSize: 12,
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  style={{ color: theme.textMuted, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                >
                  <X size={12} />
                </button>
              </span>
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
            <Save size={14} />
            SAVE CHANGES
          </button>
          {isSaved && (
            <span style={{ color: theme.accentGreen, fontSize: 12, letterSpacing: '0.05em' }}>
              ✓ Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}