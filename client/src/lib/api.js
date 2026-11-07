const BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'estatehub_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body, params } = {}) {
  // Build the full URL. A relative BASE (e.g. "/api") is resolved against the
  // current origin (needed so the Vite dev proxy and Vercel same-origin routing
  // both work). An absolute BASE (e.g. "https://api.example.com/api") is used as-is.
  const isAbsolute = String(BASE).startsWith('http');
  const origin = isAbsolute ? '' : window.location.origin;
  const url = `${origin}${BASE}${path}`;
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, v);
  });
  const qs = search.toString();
  const full = qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;

  const res = await fetch(full, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(payload.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = payload.details;
    throw err;
  }
  return payload;
}

export const api = {
  health: () => request('/health'),
  stats: () => request('/stats'),

  properties: (params) => request('/properties', { params }),
  property: (idOrSlug) => request(`/properties/${idOrSlug}`),
  createProperty: (body) => request('/properties', { method: 'POST', body }),
  updateProperty: (id, body) => request(`/properties/${id}`, { method: 'PUT', body }),
  deleteProperty: (id) => request(`/properties/${id}`, { method: 'DELETE' }),

  agents: () => request('/agents'),
  agent: (id) => request(`/agents/${id}`),

  testimonials: () => request('/testimonials'),
  services: () => request('/services'),

  sendMessage: (body) => request('/messages', { method: 'POST', body }),
  messages: () => request('/messages'),
  markMessageRead: (id) => request(`/messages/${id}`, { method: 'PATCH', body: { status: 'read' } }),
  subscribe: (email) => request('/newsletter', { method: 'POST', body: { email } }),

  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  me: () => request('/auth/me'),
};