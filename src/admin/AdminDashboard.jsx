import { useState, useEffect, useCallback } from 'react';
import { getData, updateData } from './api.js';
import ImageUploader from './ImageUploader.jsx';

const s = {
  page: { minHeight: '100vh', background: '#0b0f1a', color: '#e4e9f2', padding: '20px 24px' },
  wrap: { maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 },
  h1: { fontSize: 22, fontWeight: 700, margin: 0, color: '#e4e9f2' },
  tabs: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 28 },
  tab: (a) => ({ padding: '8px 18px', borderRadius: 99, border: a ? 'none' : '1px solid rgba(255,255,255,0.08)', background: a ? '#60a5fa' : 'transparent', color: a ? '#fff' : '#8894aa', fontSize: 13, fontWeight: a ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }),
  card: { background: '#161d2f', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 20, marginBottom: 12 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#8894aa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e4e9f2', fontSize: 13, outline: 'none', fontFamily: 'inherit', marginBottom: 12 },
  textarea: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e4e9f2', fontSize: 13, outline: 'none', fontFamily: 'inherit', marginBottom: 12, minHeight: 80, resize: 'vertical' },
  btnP: { padding: '9px 20px', borderRadius: 8, border: 'none', background: '#60a5fa', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnD: { padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnS: { padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#8894aa', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  success: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#34d399' },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  half: { flex: '1 1 200px' },
};

const ML = { professor: 'Professor', seniorResearchers: 'Senior Researchers', phdStudents: 'PhD Students', secretary: 'Secretary' };
const MTABS = Object.keys(ML);

export default function AdminDashboard({ onLogout }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('members');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { try { setData(await getData()); } catch (e) { console.error(e); } }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (nd) => {
    setSaving(true); setMsg('');
    try { await updateData(nd || data); setMsg('Saved! Website updated.'); if (nd) setData(nd); setTimeout(() => setMsg(''), 3000); }
    catch (e) { setMsg('Error: ' + e.message); }
    setSaving(false);
  };

  const upd = (path, value) => {
    setData(prev => {
      const d = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let obj = d;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return d;
    });
  };

  if (!data) return <div style={s.page}><p>Loading...</p></div>;

  const tabs = ['members', 'projects', 'theses', 'news', 'positions', 'contact', 'about'];

  return (
    <div style={s.page}><div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Admin Panel</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => save()} disabled={saving} style={s.btnP}>{saving ? 'Saving...' : 'Save All Changes'}</button>
          <button onClick={onLogout} style={s.btnS}>Logout</button>
        </div>
      </div>
      {msg && <div style={s.success}>{msg}</div>}
      <div style={s.tabs}>{tabs.map(t => <button key={t} onClick={() => setTab(t)} style={s.tab(tab === t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</div>

      {tab === 'members' && <MembersEditor data={data} upd={upd} save={save} />}
      {tab === 'projects' && <ProjectsEditor data={data} upd={upd} save={save} />}
      {tab === 'theses' && <ThesesEditor data={data} upd={upd} save={save} />}
      {tab === 'news' && <NewsEditor data={data} upd={upd} save={save} />}
      {tab === 'positions' && <PositionsEditor data={data} upd={upd} save={save} />}
      {tab === 'contact' && <ContactEditor data={data} upd={upd} save={save} />}
      {tab === 'about' && <AboutEditor data={data} upd={upd} save={save} />}
    </div></div>
  );
}

// ===== BIO EDITOR (reused for professor, senior researchers, phd) =====
function BioEditor({ bio, onChange }) {
  const up = (k, v) => onChange({ ...bio, [k]: v });
  return <>
    <label style={s.label}>Bio Headline</label>
    <input style={s.input} value={bio?.headline || ''} onChange={e => up('headline', e.target.value)} />
    <label style={s.label}>Bio Summary</label>
    <textarea style={s.textarea} value={bio?.summary || ''} onChange={e => up('summary', e.target.value)} />
    <label style={s.label}>ORCID URL</label>
    <input style={s.input} value={bio?.orcidUrl || ''} onChange={e => up('orcidUrl', e.target.value)} />
    <label style={s.label}>Research Highlights (label:detail, one per line)</label>
    <textarea style={s.textarea} value={(bio?.highlights || []).map(h => `${h.label}:${h.detail}`).join('\n')} onChange={e => up('highlights', e.target.value.split('\n').filter(Boolean).map(l => { const [label, ...r] = l.split(':'); return { label: label.trim(), detail: r.join(':').trim() }; }))} />
    <label style={s.label}>Publications (one per line)</label>
    <textarea style={s.textarea} value={(bio?.publications || []).join('\n')} onChange={e => up('publications', e.target.value.split('\n').filter(Boolean))} />
    <label style={s.label}>Teaching (one per line)</label>
    <textarea style={s.textarea} value={(bio?.teaching || []).join('\n')} onChange={e => up('teaching', e.target.value.split('\n').filter(Boolean))} />
    <label style={s.label}>Memberships (one per line)</label>
    <textarea style={s.textarea} value={(bio?.memberships || []).join('\n')} onChange={e => up('memberships', e.target.value.split('\n').filter(Boolean))} />
    <label style={s.label}>Supervised Theses (one per line)</label>
    <textarea style={s.textarea} value={(bio?.theses || []).join('\n')} onChange={e => up('theses', e.target.value.split('\n').filter(Boolean))} />
    <label style={s.label}>Ongoing Projects (title:description:icon, one per line)</label>
    <textarea style={s.textarea} value={(bio?.projects || []).map(p => `${p.title}:${p.desc}:${p.icon}`).join('\n')} onChange={e => up('projects', e.target.value.split('\n').filter(Boolean).map(l => { const [t, d, ic] = l.split(':').map(x => x.trim()); return { title: t || '', desc: d || '', icon: ic || 'cpu' }; }))} />
  </>;
}

// ===== MEMBERS EDITOR =====
function MembersEditor({ data, upd, save }) {
  const [cat, setCat] = useState('professor');
  const members = data.members[cat] || [];
  const [bioOpen, setBioOpen] = useState({});

  const add = () => {
    const base = cat === 'secretary'
      ? { name: '', role: 'Sekretariat', email: '', photo: '' }
      : { name: '', topics: [], email: '', photo: '', bio: { headline: '', summary: '', highlights: [], orcidUrl: '', projects: [], publications: [], theses: [], memberships: [], teaching: [] } };
    upd(`members.${cat}`, [...members, base]);
  };

  const updM = (idx, field, value) => {
    const ms = JSON.parse(JSON.stringify(members));
    const parts = field.split('.');
    let obj = ms[idx];
    for (let i = 0; i < parts.length - 1; i++) { if (!obj[parts[i]]) obj[parts[i]] = {}; obj = obj[parts[i]]; }
    obj[parts[parts.length - 1]] = value;
    upd(`members.${cat}`, ms);
  };

  const rem = (idx) => upd(`members.${cat}`, members.filter((_, i) => i !== idx));

  return <div>
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
      {MTABS.map(t => <button key={t} onClick={() => setCat(t)} style={s.tab(cat === t)}>{ML[t]}</button>)}
    </div>
    {members.map((m, idx) => (
      <div key={idx} style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#e4e9f2', margin: 0 }}>{m.name || 'New Member'}</h4>
          <button onClick={() => rem(idx)} style={{ ...s.btnD, padding: '4px 12px', fontSize: 11 }}>Delete</button>
        </div>
        <div style={s.row}>
          <div style={s.half}><label style={s.label}>Name</label><input style={s.input} value={m.name} onChange={e => updM(idx, 'name', e.target.value)} /></div>
          <div style={s.half}><label style={s.label}>Email</label><input style={s.input} value={m.email || ''} onChange={e => updM(idx, 'email', e.target.value)} /></div>
        </div>
        <ImageUploader label="Photo" value={m.photo || ''} onChange={v => updM(idx, 'photo', v)} />
        {cat === 'secretary' ? (
          <><label style={s.label}>Role</label><input style={s.input} value={m.role || ''} onChange={e => updM(idx, 'role', e.target.value)} /></>
        ) : (
          <>
            <label style={s.label}>Topics (comma separated)</label>
            <input style={s.input} value={(m.topics || []).join(', ')} onChange={e => updM(idx, 'topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
            {/* Bio section - toggle */}
            <button onClick={() => setBioOpen(p => ({ ...p, [idx]: !p[idx] }))} style={{ ...s.btnS, marginBottom: 12, fontSize: 11 }}>
              {bioOpen[idx] ? 'Hide' : 'Edit'} Website / Bio Details
            </button>
            {bioOpen[idx] && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 4 }}>
                <BioEditor bio={m.bio || {}} onChange={bio => updM(idx, 'bio', bio)} />
              </div>
            )}
          </>
        )}
      </div>
    ))}
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <button onClick={add} style={s.btnS}>+ Add {ML[cat]}</button>
      <button onClick={() => save()} style={s.btnP}>Save Members</button>
    </div>
  </div>;
}

// ===== PROJECTS EDITOR =====
function ProjectsEditor({ data, upd, save }) {
  const items = data.studentProjects || [];
  const updI = (idx, k, v) => { const l = JSON.parse(JSON.stringify(items)); l[idx][k] = v; upd('studentProjects', l); };
  const rem = (idx) => upd('studentProjects', items.filter((_, i) => i !== idx));
  const add = () => upd('studentProjects', [...items, { id: 'proj-' + Date.now(), shortTitle: '', title: '', icon: 'scatter', image: '', description: [], details: {} }]);

  return <div>
    {items.map((item, idx) => (
      <div key={idx} style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#e4e9f2', margin: 0 }}>{item.shortTitle || 'New Project'}</h4>
          <button onClick={() => rem(idx)} style={{ ...s.btnD, padding: '4px 12px', fontSize: 11 }}>Delete</button>
        </div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Short Title</label><input style={s.input} value={item.shortTitle || ''} onChange={e => updI(idx, 'shortTitle', e.target.value)} /></div><div style={s.half}><label style={s.label}>Icon</label><input style={s.input} value={item.icon || ''} onChange={e => updI(idx, 'icon', e.target.value)} placeholder="scatter/brain/heartPulse/cpu/hand" /></div></div>
        <label style={s.label}>Full Title</label><input style={s.input} value={item.title || ''} onChange={e => updI(idx, 'title', e.target.value)} />
        <ImageUploader label="Project Image" value={item.image || ''} onChange={v => updI(idx, 'image', v)} />
        <label style={s.label}>Description (one paragraph per line)</label><textarea style={s.textarea} value={(Array.isArray(item.description) ? item.description : []).join('\n')} onChange={e => updI(idx, 'description', e.target.value.split('\n').filter(Boolean))} />
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 8 }}>
          <label style={{ ...s.label, marginBottom: 8 }}>Project Details</label>
          {["Project Type", "ECTS", "Start Time", "Requirements", "Presence Time", "Work Distribution"].map(dk => (
            <div key={dk} style={{ ...s.row, marginBottom: 4 }}><div style={{ minWidth: 130, fontSize: 12, color: '#8894aa', paddingTop: 10 }}>{dk}</div><div style={{ flex: 1 }}><input style={s.input} value={item.details?.[dk] || ''} onChange={e => { const l = JSON.parse(JSON.stringify(items)); if (!l[idx].details) l[idx].details = {}; l[idx].details[dk] = e.target.value; upd('studentProjects', l); }} /></div></div>
          ))}
        </div>
      </div>
    ))}
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}><button onClick={add} style={s.btnS}>+ Add Project</button><button onClick={() => save()} style={s.btnP}>Save Projects</button></div>
  </div>;
}

// ===== THESES EDITOR =====
function ThesesEditor({ data, upd, save }) {
  const items = data.masterTheses || [];
  const updI = (idx, k, v) => { const l = JSON.parse(JSON.stringify(items)); l[idx][k] = v; upd('masterTheses', l); };
  const rem = (idx) => upd('masterTheses', items.filter((_, i) => i !== idx));
  const add = () => upd('masterTheses', [...items, { name: '', fullName: '', degree: 'Masters Candidate', lab: 'Intelligent Embedded Systems Lab', phone: '', email: '', project: '', photo: '' }]);

  return <div>
    {items.map((item, idx) => (
      <div key={idx} style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h4 style={{ fontSize: 14, fontWeight: 600, color: '#e4e9f2', margin: 0 }}>{item.name || 'New Student'}</h4><button onClick={() => rem(idx)} style={{ ...s.btnD, padding: '4px 12px', fontSize: 11 }}>Delete</button></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Display Name (Surname, First)</label><input style={s.input} value={item.name || ''} onChange={e => updI(idx, 'name', e.target.value)} /></div><div style={s.half}><label style={s.label}>Full Name</label><input style={s.input} value={item.fullName || ''} onChange={e => updI(idx, 'fullName', e.target.value)} /></div></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Degree</label><input style={s.input} value={item.degree || ''} onChange={e => updI(idx, 'degree', e.target.value)} /></div><div style={s.half}><label style={s.label}>Phone</label><input style={s.input} value={item.phone || ''} onChange={e => updI(idx, 'phone', e.target.value)} /></div></div>
        <label style={s.label}>Email</label><input style={s.input} value={item.email || ''} onChange={e => updI(idx, 'email', e.target.value)} />
        <label style={s.label}>Project Description</label><input style={s.input} value={item.project || ''} onChange={e => updI(idx, 'project', e.target.value)} />
        <ImageUploader label="Photo" value={item.photo || ''} onChange={v => updI(idx, 'photo', v)} />
      </div>
    ))}
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}><button onClick={add} style={s.btnS}>+ Add Student</button><button onClick={() => save()} style={s.btnP}>Save Theses</button></div>
  </div>;
}

// ===== NEWS EDITOR =====
function NewsEditor({ data, upd, save }) {
  const items = data.news || [];
  const updI = (idx, k, v) => { const l = JSON.parse(JSON.stringify(items)); l[idx][k] = v; upd('news', l); };
  const rem = (idx) => upd('news', items.filter((_, i) => i !== idx));
  const add = () => upd('news', [...items, { id: Date.now(), title: '', description: '', date: '', location: '', color: '#6366f1', icon: 'heart', image: '' }]);

  return <div>
    {items.map((item, idx) => (
      <div key={idx} style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h4 style={{ fontSize: 14, fontWeight: 600, color: '#e4e9f2', margin: 0 }}>{item.title || 'New Item'}</h4><button onClick={() => rem(idx)} style={{ ...s.btnD, padding: '4px 12px', fontSize: 11 }}>Delete</button></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Title</label><input style={s.input} value={item.title || ''} onChange={e => updI(idx, 'title', e.target.value)} /></div><div style={s.half}><label style={s.label}>Date</label><input style={s.input} value={item.date || ''} onChange={e => updI(idx, 'date', e.target.value)} /></div></div>
        <label style={s.label}>Description</label><textarea style={s.textarea} value={item.description || ''} onChange={e => updI(idx, 'description', e.target.value)} />
        <div style={s.row}><div style={s.half}><label style={s.label}>Location</label><input style={s.input} value={item.location || ''} onChange={e => updI(idx, 'location', e.target.value)} /></div><div style={s.half}><label style={s.label}>Color (#hex)</label><input style={s.input} value={item.color || ''} onChange={e => updI(idx, 'color', e.target.value)} /></div></div>
        <label style={s.label}>Icon (heart/trophy/briefcase)</label><input style={s.input} value={item.icon || ''} onChange={e => updI(idx, 'icon', e.target.value)} />
        <ImageUploader label="News Image" value={item.image || ''} onChange={v => updI(idx, 'image', v)} />
      </div>
    ))}
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}><button onClick={add} style={s.btnS}>+ Add News</button><button onClick={() => save()} style={s.btnP}>Save News</button></div>
  </div>;
}

// ===== POSITIONS EDITOR =====
function PositionsEditor({ data, upd, save }) {
  const items = data.openPositions || [];
  const updI = (idx, k, v) => { const l = JSON.parse(JSON.stringify(items)); l[idx][k] = v; upd('openPositions', l); };
  const rem = (idx) => upd('openPositions', items.filter((_, i) => i !== idx));
  const add = () => upd('openPositions', [...items, { id: Date.now(), title: '', area: '', type: 'Full-time', location: 'Freiburg', deadline: '', description: '', requirements: [], contact: '' }]);

  return <div>
    {items.map((item, idx) => (
      <div key={idx} style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h4 style={{ fontSize: 14, fontWeight: 600, color: '#e4e9f2', margin: 0 }}>{item.title || 'New Position'}</h4><button onClick={() => rem(idx)} style={{ ...s.btnD, padding: '4px 12px', fontSize: 11 }}>Delete</button></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Title</label><input style={s.input} value={item.title || ''} onChange={e => updI(idx, 'title', e.target.value)} /></div><div style={s.half}><label style={s.label}>Area</label><input style={s.input} value={item.area || ''} onChange={e => updI(idx, 'area', e.target.value)} /></div></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Type</label><input style={s.input} value={item.type || ''} onChange={e => updI(idx, 'type', e.target.value)} /></div><div style={s.half}><label style={s.label}>Location</label><input style={s.input} value={item.location || ''} onChange={e => updI(idx, 'location', e.target.value)} /></div></div>
        <div style={s.row}><div style={s.half}><label style={s.label}>Deadline</label><input style={s.input} value={item.deadline || ''} onChange={e => updI(idx, 'deadline', e.target.value)} /></div><div style={s.half}><label style={s.label}>Contact Email</label><input style={s.input} value={item.contact || ''} onChange={e => updI(idx, 'contact', e.target.value)} /></div></div>
        <label style={s.label}>Description</label><textarea style={s.textarea} value={item.description || ''} onChange={e => updI(idx, 'description', e.target.value)} />
        <label style={s.label}>Requirements (one per line)</label><textarea style={s.textarea} value={(Array.isArray(item.requirements) ? item.requirements : []).join('\n')} onChange={e => updI(idx, 'requirements', e.target.value.split('\n').filter(Boolean))} />
      </div>
    ))}
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}><button onClick={add} style={s.btnS}>+ Add Position</button><button onClick={() => save()} style={s.btnP}>Save Positions</button></div>
  </div>;
}

// ===== CONTACT EDITOR =====
function ContactEditor({ data, upd, save }) {
  return <div><div style={s.card}>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#e4e9f2' }}>Contact Information</h3>
    <label style={s.label}>Lab Name</label><input style={s.input} value={data.meta.labName} onChange={e => upd('meta.labName', e.target.value)} />
    <label style={s.label}>Address (use newlines)</label><textarea style={s.textarea} value={data.meta.address} onChange={e => upd('meta.address', e.target.value)} />
    <div style={s.row}><div style={s.half}><label style={s.label}>Email</label><input style={s.input} value={data.meta.email} onChange={e => upd('meta.email', e.target.value)} /></div><div style={s.half}><label style={s.label}>Phone</label><input style={s.input} value={data.meta.phone} onChange={e => upd('meta.phone', e.target.value)} /></div></div>
    <label style={s.label}>Map Embed URL</label><input style={s.input} value={data.contact?.mapUrl || ''} onChange={e => upd('contact.mapUrl', e.target.value)} />
    <ImageUploader label="Building Image" value={data.contact?.buildingImage || ''} onChange={v => upd('contact.buildingImage', v)} />
  </div><button onClick={() => save()} style={s.btnP}>Save Contact</button></div>;
}

// ===== ABOUT EDITOR =====
function AboutEditor({ data, upd, save }) {
  return <div><div style={s.card}>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#e4e9f2' }}>About Section & Images</h3>
    <ImageUploader label="Hero Background Image" value={data.heroImage} onChange={v => upd('heroImage', v)} />
    <ImageUploader label="Group Team Photo" value={data.groupPhoto} onChange={v => upd('groupPhoto', v)} />
    <ImageUploader label="About Section Image" value={data.about.image} onChange={v => upd('about.image', v)} />
    <label style={s.label}>Paragraphs</label>
    {data.about.paragraphs.map((p, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <textarea style={{ ...s.textarea, marginBottom: 0, flex: 1 }} value={p} onChange={e => { const ps = [...data.about.paragraphs]; ps[i] = e.target.value; upd('about.paragraphs', ps); }} />
        <button onClick={() => upd('about.paragraphs', data.about.paragraphs.filter((_, j) => j !== i))} style={{ ...s.btnD, padding: '6px 12px', alignSelf: 'flex-start' }}>X</button>
      </div>
    ))}
    <button onClick={() => upd('about.paragraphs', [...data.about.paragraphs, ''])} style={s.btnS}>+ Add Paragraph</button>
  </div><button onClick={() => save()} style={{ ...s.btnP, marginTop: 12 }}>Save About</button></div>;
}
