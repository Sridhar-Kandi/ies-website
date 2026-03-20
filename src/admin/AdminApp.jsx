import { useState } from 'react';
import { isLoggedIn, setToken } from './api.js';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => { setToken(null); setLoggedIn(false); }} />;
}
