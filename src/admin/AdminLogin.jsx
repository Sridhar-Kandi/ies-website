import { useState } from 'react';
import { login } from './api.js';

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(user, pass);
      onLogin();
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ background: '#161d2f', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e4e9f2', margin: 0, marginBottom: 8 }}>Admin Panel</h1>
        <p style={{ fontSize: 13, color: '#8894aa', marginBottom: 28 }}>IES Lab Website Management</p>

        {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>{err}</div>}

        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#8894aa', marginBottom: 6 }}>Username</label>
        <input type="text" value={user} onChange={e => setUser(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e4e9f2', fontSize: 14, marginBottom: 16, outline: 'none', fontFamily: 'inherit' }} />

        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#8894aa', marginBottom: 6 }}>Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e4e9f2', fontSize: 14, marginBottom: 24, outline: 'none', fontFamily: 'inherit' }} />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: '#60a5fa', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
