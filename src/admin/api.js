const API = '/api';

let token = null;

export function setToken(t) { token = t; }
export function getToken() { return token; }
export function isLoggedIn() { return !!token; }

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function login(username, password) {
  const data = await req('POST', '/login', { username, password });
  token = data.token;
  return data;
}

export async function getData() {
  return req('GET', '/data');
}

export async function updateData(fullData) {
  return req('PUT', '/data', fullData);
}

export async function updateSection(section, value) {
  return req('PATCH', `/data/${section}`, { value });
}
