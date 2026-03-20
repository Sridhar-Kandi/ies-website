import { useState, useRef } from 'react';
import { getToken } from './api.js';

const st = {
  wrap: { marginBottom: 12 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#8894aa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { display: 'flex', gap: 8, alignItems: 'stretch' },
  input: { flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e4e9f2', fontSize: 13, outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#8894aa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  btnActive: { padding: '9px 14px', borderRadius: 8, border: 'none', background: '#60a5fa', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  preview: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
  uploading: { fontSize: 11, color: '#60a5fa', marginTop: 4 },
};

export default function ImageUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div style={st.wrap}>
      <label style={st.label}>{label}</label>
      <div style={st.row}>
        {value && <img src={value} alt="preview" style={st.preview} onError={(e) => { e.target.style.display = 'none'; }} />}
        <input
          style={st.input}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL..."
        />
        <button type="button" onClick={() => fileRef.current?.click()} style={uploading ? st.btnActive : st.btn}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>
      {uploading && <p style={st.uploading}>Uploading image...</p>}
    </div>
  );
}
